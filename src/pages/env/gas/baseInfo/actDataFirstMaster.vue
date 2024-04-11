<template>
  <b-container fluid>
    <b-row>
      <!-- 활동자료 분류 등록/수정 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 대분류 상세 -->
            <y-label
              label="L0000000913"
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
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 구분 -->
              <y-select
                :width="8"
                :required="true"
                :editable="editable"
                :comboItems="actClsCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000686"
                name="actClsCd"
                v-model="safetyInfoMaster.actClsCd"
                v-validate="'required'"
                :state="validateState('actClsCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대분류코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="isSave"
                :required="true"
                ui="bootstrap"
                label="L0000000916"
                name="actDataCd"
                v-model="safetyInfoMaster.actDataCd"
                v-validate="'required'"
                :state="validateState('actDataCd')"
                @input="formatInput"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대분류명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000000915"
                :maxlength="50"
                name="actDataNm"
                v-model="safetyInfoMaster.actDataNm"
                v-validate="'required'"
                :state="validateState('actDataNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 정렬순서 -->
              <y-number
                :width="8"
                :editable="editable"
                :isPositive="true"
                ui="bootstrap"
                label="L0000002601"
                name="sortOrder"
                v-model="safetyInfoMaster.sortOrder"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부, 사용/미사용 -->
              <y-switch
                :width="8"
                true-value="Y"
                :editable="editable"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="safetyInfoMaster.useYn"
              ></y-switch>
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
  /** attributes: name, components, props, data **/
  name: 'act-data-first-master',
  props: {
    popupParam: {
      type: Object,
      default: {
        actDataCd: null,
      },
    },
  },
  data: () => ({
    safetyInfoMaster: {
      actDataCd: null,
      actClsCd: null,
      dataLvlCd: 'ECL01',
      pActDataCd: null,
      actDataNm: null,
      useYn: 'Y',
      createUserId: null,
      updateUserId: null,
      sortOrder: null,
    },
    actClsCdItems: [],
    dataLvlCdItems: [],

    tempdataLvlCd: null,
    something: '',
    editable: false,
    isSave: false,
  }),
  computed: {},
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.getDetail();

      this.$comm.getComboItems('ACT_CLS_DATA', false).then((_result) => {
        this.actClsCdItems = _result;
      });

      if (this.popupParam.actDataCd) {
        this.isSave = true;
      }
    },
    getDetail() {
      return new Promise((_resolve, _reject) => {
        if (this.popupParam.actDataCd) {
          this.$http.url = this.$format(
            selectConfig.env.gas.actDataMaster.get.url,
            this.popupParam.actDataCd
          );
          this.$http.type = 'GET';
          this.$http.request(
            (_result) => {
              if (_result.data[0].dataLvlCd === 'ECL01') {
                this.safetyInfoMaster = this.$_.clone(_result.data[0]);
              }
              this.popupParam.actDataCd = _result.data[0].actDataCd;
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
    checkOverlap() {
      return new Promise((_resolve, _reject) => {
        if (!this.popupParam.actDataCd) {
          this.$http.url = this.$format(
            selectConfig.env.gas.actDataMaster.check.url,
            this.popupParam.actDataCd
              ? this.popupParam.actDataCd
              : this.safetyInfoMaster.actDataCd
          );
          this.$http.type = 'GET';
          this.$http.request(
            (_result) => {
              if (_result.data > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003321', // '확인',
                  message: 'M0000000342', // 대분류코드가 이미 존재합니다.
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
        if (this.popupParam.actDataCd) {
          this.$http.url = transactionConfig.env.gas.actDataMaster.update.url;
          this.$http.type = 'PUT';
          this.safetyInfoMaster.updateUserId = this.$store.getters.token;
        } else {
          this.$http.url = transactionConfig.env.gas.actDataMaster.insert.url;
          this.$http.type = 'POST';
        }
        this.safetyInfoMaster.createUserId = this.$store.getters.token;
        this.$http.param = this.safetyInfoMaster;
        this.popupParam.actDataCd = this.safetyInfoMaster.actDataCd;
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
    // 한글입력이 들어오면 삭제
    formatInput(text) {
      // text에 부모 input에 넣는 값이 들어옵니다.
      // 한글 테스트 정규식
      const notPhoneticSymbolExp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
      if (!notPhoneticSymbolExp.test(text)) {
        this.safetyInfoMaster.actDataCd = text;
      } else {
        // 한글이 빠른 시간에 여러개 들어오는 경우도 있으니,한글이 없을 때까지 삭제하고, 검사
        setTimeout(() => {
          text = text.slice(0, -1);
          let condition = notPhoneticSymbolExp.test(text);
          while (condition) {
            text = text.slice(0, -1);
            condition = notPhoneticSymbolExp.test(text);
          }
          this.safetyInfoMaster.actDataCd = text;
        }, 50);
      }
    },
    checkValidation() {
      return this.$validator.validateAll();
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    closePopup() {
      this.$emit('closePopup');
    },
  },
};
</script>
