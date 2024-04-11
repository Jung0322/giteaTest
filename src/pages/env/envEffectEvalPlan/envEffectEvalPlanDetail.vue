<!--
  목적 : 환경 > 환경영향평가 > 환경영향평가 계획 등록/수정
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
            <!-- 환경영향평가 계획 -->
            <y-label
              label="L0000004897"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div
              slot="buttonGroup"
              class="float-right mb-1"
              v-if="!popupParam.apprFlag"
            >
              <!-- 결재요청 -->
              <y-btn
                v-if="editable"
                title="L0000003418"
                color="black"
                @btnClicked="onSave('appr')"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                title="L0000002474"
                color="orange"
                @btnClicked="onSave('save')"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="editable && evalPlan.evalPlanNo > 0"
                color="red"
                title="L0000001495"
                @btnClicked="onDelete"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
              <y-plant
                :width="9"
                type="edit"
                :editable="editable"
                :required="true"
                name="plantCd"
                v-model="evalPlan.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <!--주관부서-->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
              <y-text
                :width="9"
                :disabled="true"
                ui="bootstrap"
                name="deptNm"
                label="L0000002713"
                :editable="editable"
                v-model="evalPlan.deptNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('deptNm')"
                :appendIcon="[
                  { icon: 'times', callbackName: 'clear' },
                  { icon: 'search', callbackName: 'search' },
                ]"
                @search="searchDept('dept')"
                @clear="clearDept"
              />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
              <!-- 평가구분 -->
              <y-select
                :width="9"
                :comboItems="envEffEvalDivCdItems"
                itemText="codeNm"
                itemValue="code"
                :editable="editable"
                ui="bootstrap"
                label="L0000003059"
                name="envEffEvalDivCd"
                v-model="evalPlan.envEffEvalDivCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('envEffEvalDivCd')"
              ></y-select>
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
              <!-- 평가년도 -->
              <y-datepicker
                :width="9"
                :required="true"
                :editable="editable"
                :range="false"
                :clearable="false"
                type="year"
                label="L0000003065"
                name="evalYear"
                v-model="evalPlan.evalYear"
                v-validate="'required'"
                :state="validateState('evalYear')"
              ></y-datepicker>
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
              <!-- 평가기간 -->
              <y-datepicker
                :width="9"
                :editable="editable"
                :range="true"
                :clearable="false"
                label="L0000003062"
                name="evalStartEndYmd"
                v-model="evalPlan.evalStartEndYmd"
                :required="true"
                v-validate="'required'"
                :state="validateState('evalStartEndYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 평가명 -->
              <y-text
                :width="11"
                :maxlength="100"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                name="evalTitle"
                label="L0000003081"
                v-model="evalPlan.evalTitle"
                v-validate="'required'"
                :state="validateState('evalTitle')"
              ></y-text>
            </b-col>
            <!--대상부서-->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
              <y-text
                :width="9"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                name="tgtDeptNm"
                label="L0000000927"
                :appendIcon="[
                  { icon: 'times', callbackName: 'clear' },
                  { icon: 'search', callbackName: 'search' },
                ]"
                @search="searchDept('tgt_dept')"
                @clear="clearTgtDept"
                v-model="evalPlan.tgtDeptNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('tgtDeptNm')"
              />
            </b-col>
            <!--대상공정-->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
              <y-text
                :width="9"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                name="tgtProcessNm"
                label="L0000000919"
                :appendIcon="[
                  { icon: 'times', callbackName: 'clear' },
                  { icon: 'search', callbackName: 'search' },
                ]"
                @search="searchTgtProcess"
                @clear="clearTgtProcess"
                v-model="evalPlan.tgtProcessNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('tgtProcessNm')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 비고 -->
              <y-textarea
                :width="11"
                :editable="editable"
                :maxlength="500"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="evalPlan.remark"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-file-upload
                ref="fileupload"
                :attach-file-grp="attachFileGrp"
                :label="attachFileGrp.label"
                :editable="attachFileGrp.editable"
                :disabled="attachFileGrp.disabled"
                :onlyDownload="attachFileGrp.onlyDownload"
                :showUploadBtn="attachFileGrp.showUploadBtn"
              ></y-file-upload>
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
  /* attributes: name, components, props, data */
  name: 'env-effect-eval-plan-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        evalPlanNo: 0,
        bizApprStepCd: '',
        apprFlag: false,
        apprRqstNo: 0,
      },
    },
  },
  data: () => ({
    evalPlan: {
      evalPlanNo: 0, // 계획번호
      plantCd: '', // 사업장
      plantNm: '', // 사업장명
      deptCd: '',
      deptNm: '',
      envEffEvalPlanStepCd: 'EEE01', // 계획
      envEffEvalPlanStepNm: '',
      envEffEvalDivCd: '',
      envEffEvalDivNm: '',
      evalYear: '',
      evalPeriod: '',
      evalStartYmd: '',
      evalEndYmd: '',
      evalStartEndYmd: [],
      evalTitle: '',
      tgtDeptCd: '',
      tgtDeptNm: '',
      tgtProcessCd: '',
      tgtProcessNm: '',
      remark: '',

      planApprRqstNo: 0,
      planApprStepCd: '',
      planApprStepNm: '',
      rsltApprRqstNo: 0,
      rsltApprStepCd: '',
      rsltApprStepNm: '',

      createUserId: '',
      updateUserId: '',
    },
    attachFileGrp: {
      label: 'L0000002843', // 첨부파일
      editable: false,
      disabled: true,
      onlyDownload: true,
      uploadTempFiles: null,
      showUploadBtn: false,
      taskClassNm: 'ENV_EFFECT_EVAL_PLAN',
      taskKey: '',
      taskFlag: '',
      createUserId: '',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,

    saveUrl: '',
    deleteUrl: '',
    detailUrl: '',

    envEffEvalDivCdItems: [],
  }),
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    /**
     * 필수입력값 유효성 검사
     */
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    init() {
      this.editable = this.$route.meta.editable;

      this.saveUrl = '/api/env/enveffectevalplan/plan';
      this.deleteUrl = '/api/env/enveffectevalplan/plan/{0}';
      this.detailUrl = '/api/env/enveffectevalplan/plan/{0}';

      var today = this.$comm.getToday();
      var from = this.$comm.moment(today).format('YYYY-MM-DD');
      var to = this.$comm.getCalculatedDate(
        today,
        '1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.evalPlan.evalStartEndYmd = [from, to];
      this.evalPlan.evalYear = this.$comm.getCalculatedDate(
        today,
        '0y',
        'YYYY',
        'YYYY'
      );
      this.evalPlan.deptCd = this.$store.getters.deptCd;
      this.evalPlan.deptNm = this.$store.getters.deptNm;

      this.getComboItems('ENV_EFF_EVAL_DIV_CD');
      this.attachFileGrpSetting();
      this.getDetail();
    },
    attachFileGrpSetting(_data) {
      this.attachFileGrp.taskKey =
        this.popupParam.evalPlanNo === 0 ? null : this.popupParam.evalPlanNo;
      this.attachFileGrp.createUserId = this.$store.getters.token;
      this.attachFileGrp.editable = this.editable;
      this.attachFileGrp.disabled = !this.editable;
      this.attachFileGrp.onlyDownload = !this.editable;
    },
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'ENV_EFF_EVAL_DIV_CD') {
            this.envEffEvalDivCdItems = this.$_.clone(_result.data);
            this.envEffEvalDivCdItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
            }); /* 선택하세요 */
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      if (this.popupParam.evalPlanNo === 0) {
        return;
      }

      this.$http.url = this.$format(this.detailUrl, this.popupParam.evalPlanNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.evalPlan = _result.data;
          this.evalPlan.evalStartEndYmd = [
            this.evalPlan.evalStartYmd,
            this.evalPlan.evalEndYmd,
          ];

          // 상태: 결과, 완료 또는 결재상태:  진행중, 완료 - false
          this.editable =
            this.editable &&
            !(
              this.evalPlan.envEffEvalPlanStepCd === 'EEE02' ||
              this.evalPlan.planApprStepCd === 'BAPSA' ||
              this.evalPlan.planApprStepCd === 'BAPSG' ||
              this.evalPlan.planApprStepCd === 'BAPST'
            ) &&
            !this.popupParam.apprFlag;

          this.attachFileGrp.editable = this.editable;
          this.attachFileGrp.disabled = !this.editable;
          this.attachFileGrp.onlyDownload = !this.editable;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    onSave(flag) {
      this.evalPlan.evalStartYmd = null;
      this.evalPlan.evalEndYmd = null;
      if (this.evalPlan.evalStartEndYmd.length >= 2) {
        this.evalPlan.evalStartYmd = this.evalPlan.evalStartEndYmd[0];
        this.evalPlan.evalEndYmd = this.evalPlan.evalStartEndYmd[1];
      }

      if (
        this.evalPlan.evalStartYmd == null ||
        this.evalPlan.evalEndYmd == null
      ) {
        // 평가기간 필수체크가 안됨...? 왜 안되는가?
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: this.$comm.getLangSpecInfoMessage('M0000001316'), // 평가기간을 선택해주세요.
          type: 'warning',
        });
        return;
      }

      this.$validator
        .validateAll()
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message:
                flag === 'save'
                  ? 'M0000000011' // 저장하시겠습니까?
                  : 'M0000000754', // 저장후 결재하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.evalPlan.createUserId = this.$store.getters.token;
                this.evalPlan.updateUserId = this.$store.getters.token;

                this.$http.url = this.saveUrl;
                this.$http.type =
                  this.popupParam.evalPlanNo > 0 ? 'PUT' : 'POST';
                this.$http.param = this.evalPlan;
                this.$http.request(
                  (_result) => {
                    this.popupParam.evalPlanNo = _result.data;
                    this.attachFileGrp.taskKey = _result.data;
                    this.$refs.fileupload.submitUpload();

                    if (flag === 'save') {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395', // '안내',
                        message: 'M0000000006', // 저장되었습니다.
                        type: 'success', // success / info / warning / error
                      });

                      this.getDetail();
                    } else {
                      this.doAppr();
                    }
                  },
                  (_error) => {
                    window.getApp.$emit('APP_REQUEST_ERROR', _error);
                  }
                );
              },
              // 취소 callback 함수
              cancelCallback: () => {},
            });
          } else {
            this.$popupRequired.check(
              'envEffectEvalPlan',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    onDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.popupParam.evalPlanNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success', // success / info / warning / error
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {
          this.isSave = false;
          this.isAppr = false;
        },
      });
    },
    doAppr() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; /* 결재요청 */
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'EN-EE-01',
        apprParams: {
          evalPlanNo: this.popupParam.evalPlanNo,
        },
      };
    },
    closeApprPop() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    searchDept(flag) {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000004627'; // 부서 검색
      this.popupOptions.visible = true;
      this.popupOptions.top = '100px';
      this.popupOptions.width = '35%';
      if (flag === 'dept') {
        this.popupOptions.closeCallback = this.closeDept;
      } else {
        this.popupOptions.closeCallback = this.closeTgtDept;
      }
    },
    closeDept(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.dept) {
        this.evalPlan.deptCd = data.dept.deptCd;
        this.evalPlan.deptNm = data.dept.deptNm;
      }
    },
    closeTgtDept(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.dept) {
        this.evalPlan.tgtDeptCd = data.dept.deptCd;
        this.evalPlan.tgtDeptNm = data.dept.deptNm;
      }
    },
    clearDept() {
      this.evalPlan.deptCd = null;
      this.evalPlan.deptNm = null;
    },
    clearTgtDept() {
      this.evalPlan.tgtDeptCd = null;
      this.evalPlan.tgtDeptNm = null;
    },
    searchTgtProcess() {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/process.vue'}`);
      this.popupOptions.title = 'L0000000515'; // 공정
      this.popupOptions.visible = true;
      this.popupOptions.top = '100px';
      this.popupOptions.width = '60%';
      this.popupOptions.param = {
        popupMode: true,
        multiple: false,
        plantCd: this.evalPlan.plantCd,
      };
      this.popupOptions.closeCallback = this.closeTgtProcess;
    },
    closeTgtProcess(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.process) {
        this.evalPlan.tgtProcessCd = data.process.processCd;
        this.evalPlan.tgtProcessNm = data.process.processNm;
      }
    },
    clearTgtProcess(data) {
      this.evalPlan.tgtProcessCd = null;
      this.evalPlan.tgtProcessNm = null;
    },
  },
};
</script>
