<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 온실가스 등록 -->
            <y-label
              label="L0000002033"
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
              <!-- 온실가스코드 -->
              <y-text
                :editable="editable"
                :disabled="isSave"
                :required="true"
                label="L0000002035"
                ui="bootstrap"
                name="gasTypeCd"
                :width="8"
                :maxlength="25"
                v-model="gasType.gasTypeCd"
                v-validate="'required'"
                :state="validateState('gasTypeCd')"
                @input="formatInput"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 온실가스명 -->
              <y-text
                :editable="editable"
                :required="true"
                label="L0000002034"
                ui="bootstrap"
                name="gasTypeNm"
                :width="8"
                :maxlength="50"
                v-model="gasType.gasTypeNm"
                v-validate="'required'"
                :state="validateState('gasTypeNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 화학식 -->
              <y-text
                :editable="editable"
                :required="true"
                label="L0000003308"
                ui="bootstrap"
                name="cheForm"
                :width="8"
                :maxlength="50"
                v-model="gasType.cheForm"
                v-validate="'required'"
                :state="validateState('cheForm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- GWP(지구온난화지수) -->
              <y-text
                :editable="editable"
                :required="true"
                label="L0000000114"
                ui="bootstrap"
                name="disActNm"
                :width="8"
                :maxlength="50"
                v-model="gasType.gwp"
                v-validate="'required'"
                :state="validateState('disActNm')"
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
                v-model="gasType.sortOrder"
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
                v-model="gasType.useYn"
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
  name: 'y-gas-type-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        gasTypeCd: null,
      },
    },
  },
  data() {
    return {
      gasType: {
        gasTypeCd: '',
        gasTypeNm: '',
        cheForm: '',
        gwp: '',
        useYn: 'Y',
        sortOrder: '',
        createUserId: '',
        updateUserId: '',
      },
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,
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

      if (this.popupParam.gasTypeCd) {
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
        if (!this.popupParam.gasTypeCd) {
          this.$http.url = this.$format(
            selectConfig.env.gas.baseInfo.gasType.check.url,
            this.popupParam.gasTypeCd
              ? this.popupParam.gasTypeCd
              : this.gasType.gasTypeCd
          );
          this.$http.type = 'GET';
          this.$http.request(
            (_result) => {
              if (_result.data > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003321', // '확인',
                  message: 'M0000000347', // 온실가스종류가 이미 존재합니다.
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
        if (this.popupParam.gasTypeCd) {
          this.$http.url = transactionConfig.env.gas.baseInfo.gasType.edit.url;
          this.$http.type = 'PUT';
          this.gasType.updateUserId = this.$store.getters.token;
        } else {
          this.$http.url =
            transactionConfig.env.gas.baseInfo.gasType.insert.url;
          this.$http.type = 'POST';
        }
        this.gasType.createUserId = this.$store.getters.token;
        this.$http.param = this.gasType;
        this.popupParam.gasTypeCd = this.gasType.gasTypeCd;
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
        if (this.popupParam.gasTypeCd) {
          this.$http.url = this.$format(
            selectConfig.env.gas.baseInfo.gasType.get.url,
            this.popupParam.gasTypeCd
          );
          this.$http.type = 'GET';
          this.$http.request(
            (_result) => {
              this.gasType = this.$_.clone(_result.data);
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
        this.gasType.gasTypeCd = text;
      } else {
        // 한글이 빠른 시간에 여러개 들어오는 경우도 있으니,한글이 없을 때까지 삭제하고, 검사
        setTimeout(() => {
          text = text.slice(0, -1);
          let condition = notPhoneticSymbolExp.test(text);
          while (condition) {
            text = text.slice(0, -1);
            condition = notPhoneticSymbolExp.test(text);
          }
          this.gasType.gasTypeCd = text;
        }, 50);
      }
    },
  },
};
</script>

<style></style>
