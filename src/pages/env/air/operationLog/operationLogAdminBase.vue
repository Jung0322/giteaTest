<!--
  목적 : 환경 > 대기 > 운영일지(관리자) > 상세
  작성자 : LHJ
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
            <!-- 기본정보 -->
            <y-label
              label="L0000000776"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="btnAppr && !popupParam.apprFlag"
                title="L0000003418"
                color="black"
                @btnClicked="btnApprClicked"
              />
              <!-- 일지출력 -->
              <y-btn
                v-if="editable && updateMode && buttonAble && !popupParam.apprFlag"
                title="L0000002283"
                @btnClicked="printOperationLog"
              />
              <!--  저장 -->
              <y-btn
                v-if="btnSave"
                :action-url="saveUrl"
                :param="opLogAdminRslt"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn v-if="!popupParam.apprFlag" title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="py-0">
      <b-col sm="12">
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                name="plantCd"
                v-model="opLogAdminRslt.plantCd"
                :required="true"
                :editable="false"
                v-validate="'required'"
                :state="validateState('plantCd')"
              ></y-plant>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 작성자 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002355"
                v-model="opLogAdminRslt.createUserNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 작성일자 -->
              <y-datepicker
                :width="8"
                :editable="false"
                :required="true"
                :disabled="updateMode"
                label="L0000002354"
                name="measureYmd"
                v-model="opLogAdminRslt.measureYmd"
                v-validate="'required'"
                :state="validateState('measureYmd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 날씨 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="eairWeatherItems"
                :disabled="disabled"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="weather"
                label="L0000000803"
                v-model="opLogAdminRslt.weather"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 온도(℃) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :disabled="disabled"
                :hasSeperator="false"
                ui="bootstrap"
                label="L0000002029"
                name="temp"
                v-model="opLogAdminRslt.temp"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <component
      :is="dischargeChkResult"
      v-if="dischargeChkResult"
      :opLogRslt.sync="this.opLogAdminRslt"
      :tabEditable.sync="editable"
      :updateMode.sync="updateMode"
      :disabled.sync="disabled"
    />

    <component
      :is="preventFacOperChkResult"
      v-if="preventFacOperChkResult"
      :opLogRslt.sync="this.opLogAdminRslt"
      :tabEditable.sync="editable"
      :updateMode.sync="updateMode"
      :disabled.sync="disabled"
    />

    <component
      :is="preventFacMaintHist"
      v-if="preventFacMaintHist"
      :tabEditable.sync="editable"
      :updateMode.sync="updateMode"
      :disabled.sync="disabled"
    />

    <b-row>
      <b-col sm="6">
        <component
          :is="fuelCheckResult"
          v-if="fuelCheckResult"
          :opLogRslt.sync="this.opLogAdminRslt"
          :tabEditable.sync="editable"
          :updateMode.sync="updateMode"
          :disabled.sync="disabled"
        />
      </b-col>

      <b-col sm="6">
        <component
          :is="ingredientCheckResult"
          v-if="ingredientCheckResult"
          :opLogRslt.sync="this.opLogAdminRslt"
          :tabEditable.sync="editable"
          :updateMode.sync="updateMode"
          :disabled.sync="disabled"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'operation-log-base',
  props: {
    popupParam: {
      measureYmd: null,
      deptCd: null,
      plantCd: null,
      apprFlag: false,
      apprRqstNo: 0,
    },
  },
  data: function () {
    return {
      opLogAdminRslt: {
        temp: null,
        measureYmd: null,
        deptCd: null,
        apprRqstNo: 0,
        createUserNm: '',
        updateUserId: '',
        weather: '',
        plantCd: '',
        dischChkResult: [], // 가동시간
        preventChkResult: [], // 운전사항
        preventChemResults: [], // 운전사항-약품
        fuelCheckResult: [], // 연료
        ingrCheckResult: [], // 원료
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      dischargeChkResult: null, // 배출구별 주요배출시설 및 방지시설 가동(조업)시간
      preventFacOperChkResult: null, // 방지시설 운전사항
      preventFacMaintHist: null, // 방지시설 보수내역
      fuelCheckResult: null, // 배출시설별 연료사용량
      ingredientCheckResult: null, // 원료사용량

      editable: true,
      updateMode: false,
      printUrl: '',
      saveUrl: '',

      isSave: false,
      disabled: false,

      displayCreateUser: '', // 작성자
      eairWeatherItems: [], // 날씨 아이템
      deptItems: [], // 부서 아이템
      buttonAble: false,
    };
  },
  computed: {
    btnSave() {
      return this.editable && !this.disabled;
    },

    btnAppr() {
      return this.editable && this.updateMode && !this.disabled;
    },
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();

    this.loadComponent();
  },
  beforeDestory() {},
  //* methods */
  methods: {
    init() {
      // 날씨 선택항목 설정
      this.$comm.getComboItems('SAF_WEATHER', false).then((_result) => {
        this.eairWeatherItems = _result;
      });
      this.saveUrl = transactionConfig.env.air.opLog.admin.createOplogResultAdmin.edit.url;

      if (this.popupParam.measureYmd && this.popupParam.plantCd) {
        this.opLogAdminRslt.measureYmd = this.popupParam.measureYmd;
        this.opLogAdminRslt.plantCd = this.popupParam.plantCd;
        this.getDetail();
      }
    },
    loadComponent() {
      // 배출구별 주요배출시설 및 방지시설 가동(조업)시간
      this.dischargeChkResult = () => import(`${'./dischargeChkResult.vue'}`);
      // 방지시설 운전사항
      this.preventFacOperChkResult = () =>
        import(`${'./preventFacOperChkResult.vue'}`);
      // 방지시설 보수내역
      this.preventFacMaintHist = () => import(`${'./preventFacMaintHist.vue'}`);
      // 연료사용량
      this.fuelCheckResult = () => import(`${'./fuelCheckResult.vue'}`);
      // 원료사용량
      this.ingredientCheckResult = () =>
        import(`${'./ingredientCheckResult.vue'}`);
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.env.air.opLog.admin.all.url,
        this.opLogAdminRslt.plantCd,
        this.opLogAdminRslt.measureYmd,
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.opLogAdminRslt = _result.data;

          if (
            this.opLogAdminRslt.bizApprStepCd === 'BAPSA' ||
            this.opLogAdminRslt.stepCd === 'STEP2'
          ) {
            this.disabled = true;
          } else {
            this.disabled = false;
          }
          if (this.opLogAdminRslt.bizApprStepCd === 'BAPSG') {
            this.buttonAble = true;
          } else {
            this.buttonAble = false;
          }
          if (this.opLogAdminRslt.createDt) {
            this.updateMode = true;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
    beforeSave() {
      let flag = '';
      if (this.updateMode) {
        // 수정
        flag = 'update';
      } else {
        // 신규등록
        flag = 'insert';
      }
      let a = true;
      this.check(flag);
    },

    check(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = selectConfig.env.air.opLog.check.url;
            this.$http.param = {
              plantCd: this.opLogAdminRslt.plantCd,
              measureYmd: this.opLogAdminRslt.measureYmd,
              deptCd: this.opLogAdminRslt.deptCd,
            };
            this.$http.type = 'GET';
            this.$http.request(
              (_result) => {
                if (flag === 'update') {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // '저장하시겠습니까?',
                    type: 'info',
                    confirmCallback: () => {
                      this.opLogAdminRslt.updateUserId = this.$store.getters.token;

                      // 운영일지 항목들의 updateUserId 지정
                      this.opLogAdminRslt.dischChkResult = this.opLogAdminRslt.dischChkResult.map(row => {
                        row.updateUserId = this.$store.getters.token;
                        return row;
                      });

                      this.opLogAdminRslt.preventChkResult = this.opLogAdminRslt.preventChkResult.map(row => {
                        row.updateUserId = this.$store.getters.token;
                        return row;
                      });

                      this.opLogAdminRslt.preventChemResults = this.opLogAdminRslt.preventChemResults.map(row => {
                        row.updateUserId = this.$store.getters.token;
                        return row;
                      });

                      this.opLogAdminRslt.fuelCheckResult = this.opLogAdminRslt.fuelCheckResult.map(row => {
                        row.updateUserId = this.$store.getters.token;
                        return row;
                      });

                      this.opLogAdminRslt.ingrCheckResult = this.opLogAdminRslt.ingrCheckResult.map(row => {
                        row.updateUserId = this.$store.getters.token;
                        return row;
                      });


                      this.isSave = true;
                    },
                    cancelCallback: () => {},
                  });
                } else {
                  if (_result.data > 0) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // '안내',
                      message: 'M0000000317', // '해당 작성일자의 운영일지가 존재합니다.',
                      type: 'warning', // success / info / warning / error
                    });
                    return;
                  } else {
                    window.getApp.$emit('CONFIRM', {
                      title: 'L0000003321', // '확인',
                      message: 'M0000000011', // '저장하시겠습니까?',
                      type: 'info',
                      confirmCallback: () => {
                        this.opLogAdminRslt.createUserId = this.$store.getters.token;

                        // 운영일지 항목들의 updateUserId 지정
                        this.opLogAdminRslt.dischChkResult = this.opLogAdminRslt.dischChkResult.map(row => {
                          row.updateUserId = this.$store.getters.token;
                          return row;
                        });

                        this.opLogAdminRslt.preventChkResult = this.opLogAdminRslt.preventChkResult.map(row => {
                          row.updateUserId = this.$store.getters.token;
                          return row;
                        });

                        this.opLogAdminRslt.preventChemResults = this.opLogAdminRslt.preventChemResults.map(row => {
                          row.updateUserId = this.$store.getters.token;
                          return row;
                        });

                        this.opLogAdminRslt.fuelCheckResult = this.opLogAdminRslt.fuelCheckResult.map(row => {
                          row.updateUserId = this.$store.getters.token;
                          return row;
                        });

                        this.opLogAdminRslt.ingrCheckResult = this.opLogAdminRslt.ingrCheckResult.map(row => {
                          row.updateUserId = this.$store.getters.token;
                          return row;
                        });

                        this.isSave = true;
                      },
                      cancelCallback: () => {},
                    });
                  }
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000005', // '필수입력값을 입력해주세요.',
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          this.isDailyUpdateSubmit = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // '유효성 검사도중 에러가 발생하였습니다.'
          );
        });
    },
    btnSaveClickedCallback(_result) {
      this.isSave = false;
      if (!this.updateMode) {
        this.getDetail();
        this.loadComponent();
      }
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
      this.updateMode = true;
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
    printOperationLog() {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: '개발중입니다.',
        type: 'warning', // success / info / warning / error
      });
      return;
      // let thisVue = this;
      // let _comm = this.$comm;
      // this.$http.url = this.$format(
      //   selectConfig.env.air.opLog.print.url,
      //   this.popupParam.plantCd,
      //   this.popupParam.measureYmd,
      //   this.popupParam.deptCd
      // ); // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      // this.$http.type = 'GET';
      // this.$http.request(
      //   (_result) => {
      //     let fileOrgNm =
      //       this.$comm.getLangSpecInfoLabel('L0000000907') +
      //       '_' +
      //       this.$comm.getToday() +
      //       '.xlsx'; // '대기운영일지'
      //     // this.$comm.getLangSpecInfoLabel('L0000000907') +
      //     // '_' +
      //     // this.$comm.getToday() +
      //     // '.pdf'; // '대기운영일지'
      //     var url = window.URL || window.webkitURL;
      //     let link = document.createElement('a');
      //     var blob = thisVue.$comm.base64ToBlob(_result.data);
      //     if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //       window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
      //     } else {
      //       let link = document.createElement('a');
      //       link.href = window.URL.createObjectURL(blob);
      //       link.download = fileOrgNm;
      //       link.click();
      //     }
      //   },
      //   (_error) => {
      //     window.getApp.$emit('APP_REQUEST_ERROR', _error);
      //   }
      // );
    },
    btnApprClicked() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000250', // '결재요청 하기전 입력된 값을 저장합니다. 진행하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.$http.url =
            transactionConfig.env.air.opLog.admin.createOplogResultAdmin.edit.url;
          this.$http.type = 'PUT';
          this.$http.param = this.opLogAdminRslt;
          this.$http.request(
            (_result) => {
              this.popupOptions.target = () =>
                import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
              this.popupOptions.title = 'L0000003418'; // '결재요청';
              this.popupOptions.visible = true;
              this.popupOptions.closeCallback = this.closeApprPop;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                apprBizCd: 'EN-AR-03',
                apprParams: {
                  measureYmd: this.popupParam.measureYmd,
                  plantCd: this.popupParam.plantCd,
                },
              };
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        cancelCallback: () => {},
      });
    },

    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
      this.loadComponent();
    },
  },
};
</script>
