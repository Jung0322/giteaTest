<!--
  목적 : 환경 > 온실가스 > 배출량 거래이력
  작성자 : PSB
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 거래이력 등록 -->
            <y-label
              label="L0000004478"
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
              <y-plant
                :editable="editable"
                :disabled="disabled"
                type="edit"
                name="plantCd"
                v-model="ghgEmstrHis.plantCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 거래일자 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                label="L0000004466"
                ui="bootstrap"
                name="trYmd"
                v-validate="'required'"
                :state="validateState('trYmd')"
                v-model="ghgEmstrHis.trYmd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 거래구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="trGubunItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000004469"
                name="gubun"
                v-model="ghgEmstrHis.trGubun"
                :required="true"
                v-validate="'required'"
                :state="validateState('trGubun')"
              >
              </y-select>
            </b-col>
            <b-col
              v-if="!trGubunFalg"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 거래업체 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000004467"
                name="trVendorNm"
                v-model="ghgEmstrHis.trVendorNm"
                :appendIcon="[
                  { icon: 'times', callbackName: 'clear' },
                  { icon: 'search', callbackName: 'searchUser' },
                ]"
                @searchUser="searchVendor"
                @clear="clear"
                :required="true"
                v-validate="ghgEmstrHis.trGubun === 'OUT' ? 'required' : ''"
                :state="validateState('trVendorNm')"
              />
            </b-col>
            <b-col
              v-if="trGubunFalg"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <y-plant
                type="edit"
                name="trPlantCd"
                v-model="ghgEmstrHis.trPlantCd"
                :required="true"
                v-validate="ghgEmstrHis.trGubun === 'IN' ? 'required' : ''"
                :state="validateState('trPlantCd')"
              ></y-plant>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 구매/판매 구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="gubunItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000004468"
                name="gubun"
                v-model="ghgEmstrHis.gubun"
                :required="true"
                v-validate="'required'"
                :state="validateState('gubun')"
              >
              </y-select>
            </b-col>
            <b-col
              v-if="!gubunFlag"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <!-- 구매량(tCO2-eq) -->
              <y-number
                :editable="editable"
                :width="8"
                :pointNumber="2"
                label="L0000004475"
                ui="bootstrap"
                name="purchases"
                
                v-model="ghgEmstrHis.purchases"
              />
            </b-col>
            <b-col
              v-if="gubunFlag"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
            <!-- 판매량(tCO2-eq) -->
              <y-number
                :editable="editable"
                :width="8"
                :pointNumber="2"
                label="L0000004476"
                ui="bootstrap"
                name="sales"
                v-model="ghgEmstrHis.sales"
              />
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 비고 -->
              <y-text
                :width="10"
                :editable="editable"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="ghgEmstrHis.remark"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
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
        emstrHisNo: 0,
      },
    },
  },
  data() {
    return {
      ghgEmstrHis: {
        emstrHisNo: 0,
        plantCd: '',
        trYmd: '',
        trGubun: 'IN',
        gubun: 'TPUR',
        trVendorCd: '',
        trVendorNm: '',
        trPlantCd: '',
        purchases: '',
        sales: '',
        remark: '',
        createUserId: '',
        createDt: '',
        updateUserId: '',
        updateDt: '',
      },

      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        height: '50%',
        param: {},
        closeCallback: null,
      },
      insertUrl: '',
      editUrl: '',

      editable: false,
      disabled: false,
      trGubunFalg: true,
      gubunFlag: false,
      gubunItems: [],
      trGubunItems: [],
    };
  },
  watch: {
    'ghgEmstrHis.trGubun': function(newVal, oldVal) {
      if (this.ghgEmstrHis.trGubun === 'OUT') {
        this.trGubunFalg = false;
        this.trPlantCd = '';
      } else {
        this.trGubunFalg = true;
        this.trVendorCd = '';
      }
    },
    'ghgEmstrHis.gubun': function(newVal, oldVal) {
      if (this.ghgEmstrHis.gubun === 'TSAL') {
        this.gubunFlag = true;
        this.ghgEmstrHis.purchases = 0;
      } else {
        this.gubunFlag = false;
        this.ghgEmstrHis.sales = 0;
      }
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
    // 초기화
    init() {
      this.editable = this.$route.meta.editable;

      this.$comm.getComboItems('ghg_tr_gubun', false).then(_result => {
        this.gubunItems = _result;
      });

      this.ghgEmstrHis.trYmd = this.$comm.getToday();

      if (this.popupParam.emstrHisNo) {
        this.ghgEmstrHis.emstrHisNo = this.popupParam.emstrHisNo;
        this.disabled = true;
        this.getDetail();
      }

      this.trGubunItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'IN', codeNm: this.$comm.getLangSpecInfoLabel('L0000004472') }, // 내부
        { code: 'OUT', codeNm: this.$comm.getLangSpecInfoLabel('L0000004473') }, // 외부
      ];
    },

    /** validation checking **/
    // 저장 버튼 클릭
    btnSaveClicked() {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            this.$comm.recursivePromise([
              {
                func: this.checkValidation,
                exceptionMessage: this.$comm.getLangSpecInfoLabel('M0000000005'), // '필수 입력값을 입력해 주세요.',
              },
              { func: this.checDuple },
              { func: this.confirm, param: this.$comm.getLangSpecInfoLabel('M0000000011') }, // 저장하시겠습니까?
              { func: this.saveData },
              { func: this.getDetail, successMessage: this.$comm.getLangSpecInfoLabel('M0000000006') }, // 저장되었습니다.
            ]);
          } else if (!_result) {
            this.$popupRequired.check('emsHisDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881', // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isInsert = false;
        });
    },
    checkValidation() {
      return this.$validator.validateAll();
    },
    checDuple() {
      return new Promise((_resolve, _reject) => {
        if (!this.ghgEmstrHis.emstrHisNo) {
          this.$http.url = this.$format(
            selectConfig.env.gas.emstr.check.url,
            this.ghgEmstrHis.plantCd,
            this.ghgEmstrHis.trYmd,
            this.ghgEmstrHis.trGubun,
            this.ghgEmstrHis.gubun
          );
          this.$http.type = 'GET';
          this.$http.request(
            _result => {
              if (_result.data > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003321', // '확인',
                  message: 'M0000001057', // 해당사업장에 거래일자가 이미 존재합니다.
                  type: 'warning',
                });
                _resolve(false);
              } else {
                _resolve(true);
              }
            },
            _error => {
              window.getApp.$emit(
                'APP_REQUEST_ERROR',
                'M0000000016', // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
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
        if (this.ghgEmstrHis.emstrHisNo > 0) {
          this.$http.type = 'PUT';
          this.ghgEmstrHis.updateUserId = this.$store.getters.token;
        } else {
          this.$http.type = 'POST';
          this.ghgEmstrHis.createUserId = this.$store.getters.token;
        }
        this.$http.url = transactionConfig.env.gas.emstr.edit.url;
        this.$http.param = this.ghgEmstrHis;
        this.$http.request(
          _result => {
            this.ghgEmstrHis.emstrHisNo = _result.data;
            _resolve(true);
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
      });
    },
    getDetail() {
      return new Promise((_resolve, _reject) => {
        if (this.ghgEmstrHis.emstrHisNo) {
          this.$http.url = this.$format(
            selectConfig.env.gas.emstr.get.url,
            this.ghgEmstrHis.emstrHisNo
          );
          this.$http.type = 'GET';
          this.$http.request(
            _result => {
              this.ghgEmstrHis = this.$_.clone(_result.data);
              _resolve(true);
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
              _reject(_error);
            }
          );
        }
      });
    },
    searchVendor() {
      this.popupOptions.target = () =>
        import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003246'; /* 협력업체 */
      this.popupOptions.width = '60%';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
        multiple: false,
        vendors: [],
        plantCd: this.ghgEmstrHis.plantCd,
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data && data.data !== 'C') {
        this.ghgEmstrHis.trVendorCd = data.data.vendorCd;
        this.ghgEmstrHis.trVendorNm = data.data.vendorNm;
      }
    },
    clear() {},
    // 창 닫기
    btnClosePopup() {
      this.$emit('closePopup');
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
  },
};
</script>

<style></style>
