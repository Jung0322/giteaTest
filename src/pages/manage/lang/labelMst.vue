<!--
  목적 : 시스템관리-다국어관리-다국어타입 관리
  작성자 : jkl
  Detail : 라벨관리
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 다국어타입 상세 -->
            <y-label
              label="L0000005028"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 신규 -->
              <y-btn
                v-if="btnClear"
                title="L0000004584"
                color="blue"
                @btnClicked="btnClearClicked"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="btnDelete"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClicked"
              />
              <!-- 저장 -->
              <y-btn
                v-if="btnSave"
                title="L0000002474"
                color="orange"
                @btnClicked="btnSaveClicked"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 다국어타입 코드 -->
              <y-text
                :width="9"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                ui="bootstrap"
                label="L0000005027"
                name="mstCd"
                v-validate="'required'"
                v-model="lblMst.mstCd"
                :state="validateState('mstCd')"
                :maxlength="15"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 다국어타입 명 -->
              <y-text
                :width="9"
                :editable="editable"
                :disabled="false"
                :required="true"
                ui="bootstrap"
                label="L0000005026"
                name="mstNm"
                v-validate="'required'"
                v-model="lblMst.mstNm"
                :state="validateState('mstNm')"
                :maxlength="50"
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
  name: 'lang-label-mst',
  props: {
    tabParam: {
      type: Object,
      default: {
        mstCd: '',
      },
    },
  },
  data() {
    return {
      lblMst: {
        mstCd: '',
        mstNm: '',
        delYn: 'N',
      },
      disabled: false,
      editable: false,
    };
  },
  computed: {
    btnClear() {
      return this.editable && this.disabled && this.lblMst.mstCd;
    },
    btnDelete() {
      return this.editable && this.disabled && this.lblMst.mstCd;
    },
    btnSave() {
      return this.editable;
    },
  },
  watch: {
    'tabParam.mstCd': {
      handler(val, oldVal) {
        this.getDetail();
      },
      deep: true,
    },
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
    init() {
      this.editable = this.$route.meta.editable;
      this.getDetail();
    },
    getDetail() {
      if (this.tabParam.mstCd) {
        this.lblMst.mstCd = this.tabParam.mstCd;
        this.$http.url = this.$format(
          selectConfig.manage.lang.lblMst.get.url,
          this.lblMst.mstCd
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.lblMst = this.$_.clone(_result.data);
            this.disabled = true;
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    // 신규(초기화)
    btnClearClicked() {
      Object.assign(this.$data, this.$options.data());
      this.$validator.reset();
      this.tabParam.mstCd = null;
      this.disabled = false;
      this.editable = this.$route.meta.editable;
    },
    confirmMessage(message) {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message:
            message === 'L0000001495' // 삭제
              ? this.$comm.getLangSpecInfoMessage('M0000001072') + // ? '다국어타입을 삭제할 경우 다국어타입에 등록된 다국어도 같이 삭제됩니다. ' + message + '하시겠습니까?'
                message +
                this.$comm.getLangSpecInfoMessage('M0000000097')
              : message + this.$comm.getLangSpecInfoMessage('M0000000097'), // 하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    btnDeleteClicked() {
      let promises = [
        {
          func: this.confirmMessage,
          param: this.$comm.getLangSpecInfoLabel('L0000001495'), // 삭제
        },
        {
          func: this.saveData,
          param: 'delete',
          successMessage: 'M0000000007', // 삭제되었습니다.
        },
      ];
      this.$comm.orderedPromise(promises);
    },
    saveData(flag) {
      return new Promise((_resolve, _reject) => {
        if (flag === 'insert') {
          this.$http.url = transactionConfig.manage.lang.lblMst.insert.url;
          this.$http.type = 'POST';
          this.lblMst.createUserId = this.$store.getters.token;
        } else {
          this.$http.url = transactionConfig.manage.lang.lblMst.edit.url;
          this.$http.type = 'PUT';
          this.lblMst.updateUserId = this.$store.getters.token;
          if (flag === 'delete') {
            this.lblMst.delYn = 'Y';
          } else {
            this.lblMst.delYn = 'N';
          }
        }
        this.$http.param = this.lblMst;
        this.$http.request(
          (_result) => {
            _resolve(true);
            if (flag === 'delete') {
              this.btnClearClicked(); // 초기화
            } else {
              this.disabled = true;
            }
            this.$emit('getList'); // 메시지타입 목록 조회
          },
          (_error) => {
            _reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    btnSaveClicked() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (!_result) {
            this.$popupRequired.check('labelMst', this.$data, this.errors);
          } else {
            let flag = '';
            let promises = [];
            if (this.tabParam.mstCd) {
              flag = 'edit';
              promises = [
                {
                  func: this.checkValidation,
                  exceptionMessage: 'M0000000005', // 필수입력값을 입력해주세요.
                },
                {
                  func: this.confirmMessage,
                  param: this.$comm.getLangSpecInfoLabel('L0000002474'), // 저장
                },
                {
                  func: this.saveData,
                  param: flag,
                  successMessage: 'M0000000006', // 저장되었습니다.
                },
              ];
            } else {
              flag = 'insert';
              promises = [
                {
                  func: this.checkValidation,
                  exceptionMessage: 'M0000000005', // 필수입력값을 입력해주세요.
                },
                {
                  func: this.checkData,
                  exceptionMessage: 'M0000000538', // 이미 등록된 메시지타입 코드입니다.
                },
                {
                  func: this.confirmMessage,
                  param: this.$comm.getLangSpecInfoLabel('L0000002474'), // 저장
                },
                {
                  func: this.saveData,
                  param: flag,
                  successMessage: 'M0000000006', // 저장되었습니다.
                },
              ];
            }
            this.$comm.orderedPromise(promises);
          }
          return _result;
        })
        .catch(() => {
          return false;
        });
    },
    checkValidation() {
      return this.$validator.validateAll();
    },
    checkData() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = selectConfig.manage.lang.lblMst.check.url;
        this.$http.param = {
          mstCd: this.lblMst.mstCd,
        };
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            if (_result.data > 0) {
              _resolve(false);
            } else {
              _resolve(true);
            }
          },
          (_error) => {
            _reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
  },
};
</script>
