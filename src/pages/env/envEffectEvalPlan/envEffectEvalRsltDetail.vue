<!--
  목적 : 환경 > 환경영향평가 > 환경영향평가 결과 등록/수정
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
              <!-- 계획 보이기 -->
              <y-btn
                v-if="!planVisible"
                title="L0000004899"
                @btnClicked="onPlanVisible(true)"
              />
              <!-- 계획 숨기기 -->
              <y-btn
                v-if="planVisible"
                title="L0000004900"
                @btnClicked="onPlanVisible(false)"
              />
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
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card v-show="planVisible">
          <b-row>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
              <y-plant
                :width="9"
                type="edit"
                :editable="false"
                name="plantCd"
                v-model="evalPlan.plantCd"
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
                :editable="false"
                v-model="evalPlan.deptNm"
              />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
              <!-- 평가구분 -->
              <y-select
                :width="9"
                :comboItems="envEffEvalDivCdItems"
                itemText="codeNm"
                itemValue="code"
                :editable="false"
                ui="bootstrap"
                label="L0000003059"
                name="envEffEvalDivCd"
                v-model="evalPlan.envEffEvalDivCd"
              ></y-select>
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
              <!-- 평가년도 -->
              <y-datepicker
                :width="9"
                :editable="false"
                :range="false"
                type="year"
                label="L0000003065"
                name="evalYear"
                v-model="evalPlan.evalYear"
              ></y-datepicker>
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
              <!-- 평가기간 -->
              <y-datepicker
                :width="9"
                :editable="false"
                :range="true"
                label="L0000003062"
                name="evalStartEndYmd"
                v-model="evalStartEndYmd"
              ></y-datepicker>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 평가명 -->
              <y-text
                :width="11"
                :maxlength="100"
                :editable="false"
                ui="bootstrap"
                name="evalTitle"
                label="L0000003081"
                v-model="evalPlan.evalTitle"
              ></y-text>
            </b-col>
            <!--대상부서-->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
              <y-text
                :width="9"
                :disabled="true"
                :editable="false"
                ui="bootstrap"
                name="tgtDeptNm"
                label="L0000000927"
                v-model="evalPlan.tgtDeptNm"
              />
            </b-col>
            <!--대상공정-->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
              <y-text
                :width="9"
                :disabled="true"
                :editable="false"
                ui="bootstrap"
                name="tgtProcessNm"
                label="L0000000919"
                v-model="evalPlan.tgtProcessNm"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 비고 -->
              <y-textarea
                :width="11"
                :editable="false"
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
    <b-row class="mt-3">
      <b-col sm="12">
        <el-tabs type="border-card" v-model="tabIndex" @tab-click="tabClick">
          <el-tab-pane name="1">
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ $comm.getLangSpecInfoLabel('L0000004898') }}
            </span>
            <eval-rslt-excel
              ref="refEvalRsltExcel"
              v-if="evalPlan.evalPlanNo > 0"
              :evalPlan.sync="evalPlan"
              :editable.sync="editable"
              :envManager="envManager"
              :key="tabKey"
            />
          </el-tab-pane>
          <el-tab-pane name="2">
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ $comm.getLangSpecInfoLabel('L0000000259') }}
            </span>
            <impr-act-tab
              v-if="evalPlan.evalPlanNo > 0"
              :tabParam.sync="evalPlanImprActParam"
              :key="tabKey"
            />
          </el-tab-pane>
        </el-tabs>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import evalRsltExcel from '@/pages/env/envEffectEvalPlan/envEffectEvalRsltExcel.vue';
import imprActTab from '@/pages/impr/imprActTab.vue';
export default {
  /* attributes: name, components, props, data */
  name: 'env-effect-eval-rslt-detail',
  components: {
    evalRsltExcel: evalRsltExcel,
    imprActTab: imprActTab,
  },
  props: {
    popupParam: {
      type: Object,
      default: {
        evalPlanNo: 0,
        bizApprStepCd: '',
        apprFlag: false,
        apprRqstNo: 0,
        viewMode: false,
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

      envEffectEvalRslts: [],
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
    gridOptions: {
      header: [],
      data: [],
      height: 'auto',
    },
    editable: false,
    envManager: false,

    saveUrl: '',
    detailUrl: '',
    commentSaveurl: '',

    evalStartEndYmd: [],
    envEffEvalDivCdItems: [],

    planVisible: true,

    tabKey: 1,
    tabIndex: '1',
    evalPlanImprActParam: {
      imprClassCd: 'ICL35',
      refTableId: 0,
      refTableIdList: [],
      editable: false,
      detailCheck: false,
      status: '',
      message: '',
    },
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
    init() {
      this.editable = this.$route.meta.editable;

      this.saveUrl = '/api/env/enveffectevalplan/result';
      this.detailUrl = '/api/env/enveffectevalplan/plan/{0}';
      this.commentSaveurl = '/api/env/enveffectevalplan/result/managercomment';

      var today = this.$comm.getToday();
      var from = this.$comm.moment(today).format('YYYY-MM-DD');
      var to = this.$comm.getCalculatedDate(
        today,
        '1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.evalStartEndYmd = [from, to];
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
      this.$http.url = this.$format(this.detailUrl, this.popupParam.evalPlanNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.evalPlan = _result.data;
          this.evalStartEndYmd = [
            this.evalPlan.evalStartYmd,
            this.evalPlan.evalEndYmd,
          ];

          // 상태: 결과, 완료 또는 결재상태:  진행중, 완료 - false
          this.editable =
            this.editable &&
            !(
              this.evalPlan.rsltApprStepCd === 'BAPSA' ||
              this.evalPlan.rsltApprStepCd === 'BAPSG' ||
              this.evalPlan.rsltApprStepCd === 'BAPST'
            ) &&
            !this.popupParam.apprFlag &&
            !this.popupParam.viewMode;

          this.evalPlanImprActParam.editable = false;
          this.evalPlanImprActParam.detailCheck = !this.editable;

          if (this.popupParam.apprFlag) {
            let authGrpList = this.$_.filter(this.$store.getters.userAuthGrps, {
              settingYn: 'Y',
            });
            let authGrpNoList = this.$_.map(authGrpList, 'authGrpNo');
            if (authGrpNoList.indexOf('1024') > -1) {
              // 사업장 환경담당자
              this.envManager = true;
            }
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    onSave(flag) {
      // 유효성 체크
      let valid = true;
      let message = '';
      if (this.evalPlan.envEffectEvalRslts.length === 0) {
        message = 'M0000001608'; // 환경영향평가 결과가 없습니다.
        valid = false;
      } else {
        this.evalPlan.envEffectEvalRslts.forEach((item) => {
          console.log('111', item);
          if (valid) {
            if (item.safFacilityCd == null || item.safFacilityCd === '') {
              valid = false;
              message = 'M0000001609'; // 설비를 선택하세요.
            }
          }
        });
      }

      if (!valid) {
        window.getApp.$emit('APP_VALID_ERROR', message);
        return;
      }

      this.doSave(flag);
    },
    doSave(flag) {
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
          this.$http.url = this.saveUrl;
          this.$http.type = 'PUT';
          this.$http.param = this.evalPlan;
          this.$http.request(
            (_result) => {
              if (flag === 'save') {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000006', // 저장되었습니다.
                  type: 'success', // success / info / warning / error
                });
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
    },
    doAppr() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; /* 결재요청 */
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'EN-EE-02',
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
    onPlanVisible(visible) {
      this.planVisible = visible;
    },
    tabClick(tab) {
      this.evalPlanImprActParam.refTableIdList = this.$_.map(
        this.evalPlan.envEffectEvalRslts,
        'evalRsltNo'
      );
      this.tabKey++;
    },
    apprSave() {
      // 결재승인 팝업에서 호출 됨
      return new Promise((resolve) => {
        if (this.envManager) {
          // this.evalPlan.envEffectEvalRslts = this.$refs.refEvalRsltExcel.getEvalRsltData();
          this.evalPlan.envEffectEvalRslts.forEach((item) => {
            item.managerId = this.$store.getters.token;
          });

          this.$http.url = this.commentSaveurl;
          this.$http.type = 'PUT';
          this.$http.param = this.evalPlan;
          this.$http.request(
            (_result) => {
              resolve(true);
            },
            (_error) => {
              resolve(false);
            }
          );
        } else {
          resolve(true);
        }
      });
    },
  },
};
</script>
