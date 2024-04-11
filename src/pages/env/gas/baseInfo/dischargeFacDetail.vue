<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 온실가스 배출시설분류 등록 -->
            <y-label
              label="L0000004481"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                title="L0000002474"
                color="orange"
                @btnClicked="btnSaveClicked"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출시설구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="disClsItems"
                itemText="codeNm"
                itemValue="code"
                label="L0000004480"
                ui="bootstrap"
                name="disClsCd"
                v-model="dischargeFac.disClsCd"
                v-validate="'required'"
                :state="validateState('disClsCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출시설코드 -->
              <y-text
                :editable="editable"
                :disabled="isSave"
                :required="true"
                label="L0000001179"
                ui="bootstrap"
                name="disFacCd"
                :width="8"
                :maxlength="25"
                v-model="dischargeFac.disFacCd"
                v-validate="'required'"
                :state="validateState('disFacCd')"
                @input="formatInput"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출시설코드명 -->
              <y-text
                :editable="editable"
                :required="true"
                label="L0000001180"
                ui="bootstrap"
                name="disFacNm"
                :width="8"
                :maxlength="50"
                v-model="dischargeFac.disFacNm"
                v-validate="'required'"
                :state="validateState('disFacNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 정렬순서 -->
              <y-number
                :editable="editable"
                :isPositive="true"
                label="L0000002601"
                name="sortOrder"
                ui="bootstrap"
                :width="8"
                :maxlength="5"
                v-model="dischargeFac.sortOrder"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부, 사용/미사용 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="dischargeFac.useYn"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-discharge-fac-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        disFacCd: null,
      },
    },
  },
  data() {
    return {
      dischargeFac: {
        disFacCd: '',
        disFacNm: '',
        disClsCd: null,
        useYn: 'Y',
        sortOrder: '',
        createUserId: '',
        updateUserId: '',
      },
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,
      disClsItems: [], // 배출활동 구분 리스트
      editable: false,
      isSave: false,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    // 초기화
    init() {
      this.editable = this.$route.meta.editable;
      this.getDetail();

      // 배출활동구분
      this.$comm.getComboItems('GHG_DISCH_TYPE', false).then((_result) => {
        this.disClsItems = _result;
      });

      if (this.popupParam.disFacCd) {
        this.isSave = true;
      }
    },
    // 필수값 주기
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    /** validation checking **/
    // 저장 버튼 클릭
    btnSaveClicked() {
      this.$comm.recursivePromise([
        {
          func: this.checkValidation,
          exceptionMessage: this.$comm.getLangSpecInfoLabel('M0000000005'),
        }, // '필수 입력값을 입력해 주세요.',
        { func: this.checkOverlap },
        {
          func: this.confirm,
          param: this.$comm.getLangSpecInfoLabel('M0000000011'),
        }, // 저장하시겠습니까?
        { func: this.saveData },
        {
          func: this.getDetail,
          successMessage: this.$comm.getLangSpecInfoLabel('M0000000006'),
        }, // 저장되었습니다.
      ]);
    },
    checkValidation() {
      return this.$validator.validateAll();
    },
    checkOverlap() {
      return new Promise((_resolve, _reject) => {
        if (!this.popupParam.disFacCd) {
          this.$http.url = this.$format(
            selectConfig.env.gas.baseInfo.disFac.check.url,
            this.popupParam.disFacCd
              ? this.popupParam.disFacCd
              : this.dischargeFac.disFacCd
          );
          this.$http.type = 'GET';
          this.$http.request(
            (_result) => {
              if (_result.data > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003321', // '확인',
                  message: 'M0000000346', // 배출시설코드가 이미 존재합니다.
                  type: 'warning',
                });
                _resolve(false);
              } else {
                _resolve(true);
              }
            },
            (_error) => {
              window.getApp.$emit(
                'APP_REQUEST_ERROR',
                'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
              );
              _resolve(false);
            }
          );
        } else {
          _resolve(true);
        }
      });
    },
    confirm() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000011', // 저장하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData() {
      return new Promise((_resolve, _reject) => {
        if (this.popupParam.disFacCd) {
          this.$http.url = transactionConfig.env.gas.baseInfo.disFac.edit.url;
          this.$http.type = 'PUT';
          this.dischargeFac.updateUserId = this.$store.getters.token;
        } else {
          this.$http.url = transactionConfig.env.gas.baseInfo.disFac.insert.url;
          this.$http.type = 'POST';
        }
        this.dischargeFac.createUserId = this.$store.getters.token;
        this.$http.param = this.dischargeFac;
        this.popupParam.disFacCd = this.dischargeFac.disFacCd;
        this.$http.request(
          (_result) => {
            this.isSave = true;
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
      });
    },
    getDetail() {
      return new Promise((_resolve, _reject) => {
        if (this.popupParam.disFacCd) {
          this.$http.url = this.$format(
            selectConfig.env.gas.baseInfo.disFac.get.url,
            this.popupParam.disFacCd
          );
          this.$http.type = 'GET';
          this.$http.request(
            (_result) => {
              this.dischargeFac = this.$_.clone(_result.data);
              _resolve(true);
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
              _reject(_error);
            }
          );
        }
      });
    },
    // 창 닫기
    btnClosePopup() {
      this.$emit('closePopup');
    },
    // 한글입력이 들어오면 삭제
    formatInput(text) {
      // text에 부모 input에 넣는 값이 들어옵니다.
      // 한글 테스트 정규식
      const notPhoneticSymbolExp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
      if (!notPhoneticSymbolExp.test(text)) {
        this.dischargeFac.disFacCd = text;
      } else {
        // 한글이 빠른 시간에 여러개 들어오는 경우도 있으니,한글이 없을 때까지 삭제하고, 검사
        setTimeout(() => {
          text = text.slice(0, -1);
          let condition = notPhoneticSymbolExp.test(text);
          while (condition) {
            text = text.slice(0, -1);
            condition = notPhoneticSymbolExp.test(text);
          }
          this.dischargeFac.disFacCd = text;
        }, 50);
      }
    },
  },
};
</script>
