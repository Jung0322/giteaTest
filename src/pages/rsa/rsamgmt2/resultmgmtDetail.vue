<!--
  목적 : 평가결과 관리 상세
  작성자 : pkj
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 평가결과 관리 상세 -->
            <y-label
              label="L0000004985"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn
                v-if="updateMode && editable && apprMode"
                :action-url="insertUrl"
                :param="rsaRiskAssessResult"
                :is-submit="isAppr"
                title="L0000003418"
                color="black"
                action-type="POST"
                beforeSubmit="beforeAppr"
                @beforeAppr="beforeValidateChk"
                @btnClicked="btnApprClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />

              <!-- 삭제 -->
              <y-btn
                v-if="updateMode && editable && apprMode && this.noPlanFlag"
                title="L0000001495"
                color="red"
                @btnClicked="deleteSubmit"
              />
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable && apprMode"
                :action-url="insertUrl"
                :param="rsaRiskAssessResult"
                :is-submit="isEdit"
                title="저장"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeSubmit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!updateMode && editable"
                :action-url="insertUrl"
                :param="rsaRiskAssessResult"
                :is-submit="isInsert"
                title="저장"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />

              <!-- 닫기 -->
              <y-btn
                v-if="!this.popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="closePopup"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :editable="newInsertMode"
                name="plantCd"
                v-model="rsaRiskAssessResult.plantCd"
                :disabled="this.popupParam.apprFlag"
                :required="true"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대상년도 -->
              <y-datepicker
                :editable="newInsertMode"
                :width="8"
                type="year"
                :disabled="this.popupParam.apprFlag"
                name="assessYear"
                label="L0000004449"
                :default="rsaRiskAssessResult.assessYear"
                v-model="rsaRiskAssessResult.assessYear"
                :required="true"
                v-validate="'required'"
                :state="validateState('assessYear')"
              />
            </b-col>
            <!-- 주관부서 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-tree-dept
                :editable="newInsertMode && deptEditable"
                label="L0000005015"
                name="mainDeptCd"
                :disabled="this.popupParam.apprFlag"
                v-model="rsaRiskAssessResult.mainDeptCd"
                :plantCd="rsaRiskAssessResult.plantCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('mainDeptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 대상부서 -->
              <y-tree-dept
                :editable="newInsertMode"
                label="L0000000927"
                :disabled="this.popupParam.apprFlag"
                :plantCd="rsaRiskAssessResult.plantCd"
                v-model="rsaRiskAssessResult.deptCd"
                :dtlNull="true"
                :required="true"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <!-- 평가기법 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :editable="newInsertMode"
                :width="8"
                :comboItems="rsaAssessTypeItems"
                :disabled="this.popupParam.apprFlag"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000003416"
                name="assessTypeCd"
                v-model="rsaRiskAssessResult.assessTypeCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('assessTypeCd')"
              ></y-select>
            </b-col>
            <!-- 구분 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :editable="newInsertMode"
                :width="8"
                :comboItems="rsaRegRegdemItems"
                :disabled="this.popupParam.apprFlag"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000686"
                name="regRegdemCd"
                v-model="rsaRiskAssessResult.regRegdemCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('regRegdemCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 기간(계획) -->
              <y-datepicker
                :editable="newInsertMode"
                :width="8"
                :disabled="this.popupParam.apprFlag"
                :range="true"
                label="L0000004987"
                name="assessDt"
                v-model="rsaRiskAssessResult.assessDt"
                :required="true"
                v-validate="'required'"
                :state="validateState('assessDt')"
              ></y-datepicker>
            </b-col>

            <!-- 평가명 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :editable="newInsertMode"
                :width="10"
                :maxlength="50"
                :disabled="this.popupParam.apprFlag"
                ui="bootstrap"
                label="L0000003081"
                name="assessNm"
                v-model="rsaRiskAssessResult.assessNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('assessNm')"
              ></y-text>
            </b-col>
            <!-- 상세내용 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :editable="newInsertMode"
                :width="10"
                :disabled="this.popupParam.apprFlag"
                :maxlength="250"
                ui="bootstrap"
                name="assessDesc"
                label="L0000001528"
                v-model="rsaRiskAssessResult.assessDesc"
                :rows="3"
              />
            </b-col>

            <b-col sm="12">
              <b-card>
                <b-row sm="12">
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                    <!-- 개선도출건수 -->
                    <y-number
                      :editable="editable"
                      :width="8"
                      ui="bootstrap"
                      label="L0000004991"
                      name="imprCaseCnt"
                      v-model="rsaRiskAssessResult.imprCaseCnt"
                      :required="true"
                      v-validate="'required'"
                      :state="validateState('imprCaseCnt')"
                    ></y-number>
                  </b-col>

                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                    <!-- 평가일 -->
                    <y-datepicker
                      :width="8"
                      :editable="editable"
                      ui="bootstrap"
                      label="L0000003091"
                      name="evalDt"
                      :default="rsaRiskAssessResult.evalDt"
                      v-model="rsaRiskAssessResult.evalDt"
                      :required="true"
                      v-validate="'required'"
                      :state="validateState('evalDt')"
                    />
                  </b-col>

                  <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-4"></b-col>

                  <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
                    <!-- 평가결과요약 -->
                    <y-textarea
                      :editable="editable"
                      :width="10"
                      ui="bootstrap"
                      label="L0000004992"
                      name="assessRsltDesc"
                      v-model="rsaRiskAssessResult.assessRsltDesc"
                      :required="true"
                      v-validate="'required'"
                      :state="validateState('assessRsltDesc')"
                      :rows="3"
                    ></y-textarea>
                  </b-col>
                </b-row>

                <b-card>
                  <b-row>
                    <b-col sm="12">
                      <y-file-upload
                        ref="fileuploadBefore"
                        :editable="editable"
                        :disabled="!editable"
                        :attach-file-grp="attachFileGrps"
                        :label="attachFileGrps.label"
                        :showUploadBtn="attachFileGrps.showUploadBtn"
                        :showFileSearch="false"
                        :multiple="true"
                        :limit="5"
                        :close="true"
                        :submitCheck="submitCheck"
                        @uploadFiles="safetyPlanUploadFiles"
                        @setDeleteTempFileData="setDeleteTempFileData"
                        @setUploadFileLength="setUploadFileLength"
                      ></y-file-upload>
                    </b-col>
                  </b-row>
                </b-card>
              </b-card>
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
  name: 'y-facility-mst-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        assessDeptNo: 0,
        riskType: '',
        noPlanYn: '',
        apprFlag: false,
      },
    },
    isPopView: false,
  },
  data: () => ({
    rsaRiskAssessResult: {
      assessPlanNo: 0,
      assessDeptNo: 0,
      plantCd: '', // 사업장 코드
      deptCd: '',
      deptNm: '',
      assessYear: '',
      assessTypeCd: '',
      regRegdemCd: '',
      assessNm: '',
      assessDt: '',
      assessStartDt: '',
      assessEndDt: '',
      assessDesc: '',
      riskType: '',
      deptReaderId: '',
      deptReaderDeptCd: '',
      mainDeptCd: '',
      deptReaderNm: '',
      rapprRqstNo: 0,
      rapprRqstNm: '',
      assessRsltNo: 0,
      imprCaseCnt: 0,
      evalDt: '',
      assessRsltDesc: '',
      estimatorInList: [],
      estimatorOutList: [],
      createUserId: '',
      createDeptNm: '',
      createDeptCd: '',
      createPositionCd: '',
      createPositionNm: '',
      newInsert: false,
      afterImprCaseCnt: 0,
      apprRqstCode: '',
      apprRqstStatus: '',
      noPlanYn: '',
    },
    // 개선조치를 위한 변수
    tabParam: {
      imprClassCd: '',
      refTableId: 0,
      editable: false,
      message: 'M0000001618', // 개선사항 입력은 평가결과 관리 상세를 등록후 입력 가능합니다.
      detailCheck: false,
      editMode: false,
    },
    gridOptions: {
      header: [],
      data: [],
      height: '450',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '90%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    tabIndex: 0,
    tabItems: [],

    submitCheck: false,
    editable: false,
    disabled: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    editUrl: '',
    insertUrl: '',
    detailUrl: '',
    deleteUrl: '',
    rsaAssessTypeItems: [], // 기법
    rsaRegRegdemItems: [], // 구분
    component: null,
    component2: null,
    component3: null,
    apprMode: false,
    newInsertMode: false,
    EstimatorLoad: false,
    updateFile: false,
    setAttachFile: false,
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
    attachFileGrps: {
      taskClassNm: 'RSA_PROCRSLT',
      taskKey: '',
      createUserId: '',
      showUploadBtn: false,
      uploadCheck: false,
      label: '파일업로드' /* 파일업로드 */,
      uploadTempFiles: null,
    },
    saveAttachFiles: [],
    tempDeleteFiles: [],
    countIndex: 0,
    apprUrl: '',
    isAppr: false,
    refresh: false,
    noPlanFlag: false,
  }),
  watch: {
    tabIndex() {
      this.tabParam.refTableId = this.rsaRiskAssessResult.assessDeptNo;
    },
    'rsaRiskAssessResult.assessPlanNo': {
      handler: function (oldV, newV) {
        this.attachFileGrps.createUserId = this.$store.getters.token;
      },
      deep: true,
    },
    EstimatorLoad() {},
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.newInsertMode = this.popupParam.newInsert;
      if (this.isPopView === true) {
        this.newInsertMode = false;
      }
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.detailUrl = selectConfig.rsa.resultmgmt2.get.url;
      this.insertUrl = transactionConfig.rsa.resultmgmt2.insert.url;
      this.apprUrl = transactionConfig.rsa.resultmgmt2.completeAppr.url;
      this.deleteUrl = transactionConfig.rsa.planmgmt2.deleteUploadRslt.url;

      this.$comm.getComboItems('RSA_ASSESS_TYPE', false).then((_result) => {
        this.rsaAssessTypeItems = _result;
      });
      this.$comm.getComboItems('RSA_REG_REGDEM', false).then((_result) => {
        this.rsaRegRegdemItems = _result;
        this.$_.remove(this.rsaRegRegdemItems, (item) => {
          return item.code === 'REG03';
        });
      });
      if (!this.popupParam.assessDeptNo) {
        this.apprMode = true;
        this.rsaRiskAssessResult.assessYear = this.$comm
          .moment()
          .format('YYYY');
        let from = this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '0y',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        let to = this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '6m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        this.rsaRiskAssessResult.riskType = this.popupParam.riskType;
        this.rsaRiskAssessResult.noPlanYn = this.popupParam.noPlanYn;
        this.rsaRiskAssessResult.assessDt = [from, to];
        this.rsaRiskAssessResult.mainDeptCd = this.$store.getters.deptCd;
      } else {
        this.tabParam.imprClassCd =
          this.popupParam.riskType === 'work' ? 'ICL41' : 'ICL42';
        this.tabParam.refTableId = this.rsaRiskAssessResult.assessDeptNo;
        this.tabParam.detailCheck = this.disabled;
        this.rsaRiskAssessResult.assessDeptNo = this.popupParam.assessDeptNo;
      }

      // 권한별 컨트롤 처리
      if (this.$comm.isCompanyGrp()) {
        // 전사권한
        this.companyEditable = true;
        this.plantEditable = true;
        this.deptEditable = true;
      } else if (this.$comm.isPlantGrp()) {
        // 사업장권한
        this.plantEditable = true;
        this.deptEditable = true;
      }

      this.getDetail();

      this.setAttach();
    },
    setAttachFileGrps() {
      let taskKey = null;
      taskKey = !this.rsaRiskAssessResult.assessDeptNo
        ? null
        : this.rsaRiskAssessResult.assessDeptNo;

      this.attachFileGrps = [
        {
          uploadTempFiles: null,
          taskClassNm: 'RSA_RESULT',
          taskKey: taskKey,
          disabled: this.apprMode,
          createUserId: this.$store.getters.token,
        },
      ];
    },

    uploadedList(data) {
      // task_key 를 셋팅한다.

      if (data && data.length > 0) {
        this.$_.forEach(this.attachFileGrps, (item) => {
          item.taskKey = this.rsaRiskAssessResult.assessDeptNo
            ? this.rsaRiskAssessResult.assessDeptNo
            : null;
        });

        if (data.length < this.countIndex1 && this.countIndex1 !== 0) {
          this.refresh = !this.refresh;
        } else {
          this.countIndex1 = 0;
        }
      }
    },

    setAttach() {
      // task_key 를 셋팅한다.
      this.attachFileGrps.taskKey = this.rsaRiskAssessResult.assessDeptNo
        ? this.rsaRiskAssessResult.assessDeptNo
        : '';

      this.$refs['fileuploadBefore'].submitUpload();
    },
    safetyPlanUploadFiles(data, taskClassNm, attachFileGrp) {
      let inputData = {
        data: data,
      };

      this.attachFileGrps.uploadTempFiles = inputData;
    },
    setDeleteTempFileData(data) {
      var pushData = {
        fileNo: data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
      // this.$emit('refWorkAttach');
    },
    setUploadFileLength(data) {
      this.countIndex = data;
    },
    saveAttach() {
      // 첨부파일 task_key 세팅
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = String(this.rsaRiskAssessResult.assessDeptNo);
      });

      // 첨부파일
      if (this.attachFileGrps.length > 0) {
        // 저장할 데이터가 있는 경우
        this.submitCheck = !this.submitCheck;
      }
    },
    approval() {
      // this.popupOptions.target = () =>
      //   import(`${'@/pages/approval/processResultApproval.vue'}`);
      this.popupOptions.title = '결재요청';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        url: selectConfig.rsa.planmgmt.getProcessResultAppr.url,
        assessDeptNo: this.rsaRiskAssessResult.assessDeptNo.toString(),
      };
    },
    getDetail() {
      if (this.rsaRiskAssessResult.assessDeptNo) {
        this.$http.url = this.$format(
          this.detailUrl,
          this.rsaRiskAssessResult.assessDeptNo
        );
        this.$http.type = 'GET';

        this.$http.request(
          (_result) => {
            this.updateMode = true;

            this.rsaRiskAssessResult = _result.data;
            this.rsaRiskAssessResult.noPlanYn = _result.data.noPlanYn;
            if (this.rsaRiskAssessResult.noPlanYn === 'Y') {
              this.noPlanFlag = true;
            }

            this.rsaRiskAssessResult.assessDt = [
              this.rsaRiskAssessResult.assessStartDt,
              this.rsaRiskAssessResult.assessEndDt,
            ];
            if (this.rsaRiskAssessResult.rapprRqstNo === 0) {
              this.apprMode = true;
            } else if (
              this.rsaRiskAssessResult.rapprRqstNm === '결재반려' ||
              this.rsaRiskAssessResult.rapprRqstNm === '결재요청전' ||
              this.popupParam.apprFlag
            ) {
              this.apprMode = true;
            } else {
              this.tabParam.editMode = true;
              this.apprMode = false;
            }
            if (this.popupParam.apprFlag) {
              this.editable = false;
            }
            if (
              this.rsaRiskAssessResult.stepCd === 'BAPSG' ||
              this.rsaRiskAssessResult.stepCd === 'BAPSA'
            ) {
              this.editable = false;
            }
            this.setAttachFile = !this.setAttachFile;

            this.tabParam.editable = this.apprMode;

            this.tabParam.imprClassCd =
              this.popupParam.riskType === 'work' ? 'ICL41' : 'ICL42';
            this.tabParam.refTableId = this.rsaRiskAssessResult.assessDeptNo;
            this.tabParam.detailCheck = this.disabled;
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
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
    async beforeValidateChk(flag) {
      this.deptListLoad = !this.deptListLoad;

      if (this.rsaRiskAssessResult.imprCaseCnt < 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'L0000005093', // [평가결과] 개선도출건수를 입력해주세요.
          type: 'warning',
        });

        return false;
      }
      if (!this.rsaRiskAssessResult.evalDt) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'L0000005141', // 평가일을 입력해주세요.
          type: 'warning',
        });

        return false;
      }
      if (!this.rsaRiskAssessResult.assessRsltDesc) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'L0000005094', // [평가결과] 평가결과요약을 입력해주세요.
          type: 'warning',
        });

        return false;
      }

      this.btnAppr();
    },
    btnAppr() {
      this.$validator.validateAll().then((_result) => {
        // TODO : 전역 성공 메시지 처리
        // 이벤트는 ./event.js 파일에 선언되어 있음
        // 조사내용, 조사결과검토 탭 부분에서 유효성검사를 실행하지 않아 소스 수정
        if (_result) {
          let tableNm = 'rsa_work_risk_assess_dept';
          let approvalCode = null;
          let tableKey = this.rsaRiskAssessResult.assessDeptNo;
          let approvalType = '';
          this.rsaRiskAssessResult.riskType === 'work'
            ? (approvalType = 'UPLD_WRSLT_RQST')
            : (approvalType = 'UPLD_RSLT_RQST');

          if (this.rsaRiskAssessResult.stepCd === 'BAPSB') {
            // 결재요청전

            approvalCode = this.rsaRiskAssessResult.apprRqstCode;
          } else if (this.rsaRiskAssessResult.stepCd === 'BAPSA') {
            // 결재중

            approvalCode = this.rsaRiskAssessResult.apprRqstCode;
          }

          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321',
            message: 'M0000000718', // 결재요청 전 저장됩니다. 진행하시겠습니까?
            type: 'info',
            confirmCallback: () => {
              this.isAppr = true;

              // this.popupOptions.target = () =>
              // import(`${'@/pages/approval/approval.vue'}`);
              this.popupOptions.target = () =>
                import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
              this.popupOptions.title = 'L0000003418'; // 결재요청
              this.popupOptions.visible = true;
              this.popupOptions.closeCallback = this.closeApprPop;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                apprBizCd: 'RS-HP-04',
                apprParams: {
                  assessDeptNo: this.rsaRiskAssessResult.assessDeptNo,
                },
              };
            },
          });
        } else if (!_result) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            // 필수항목작성이 누락되었습니다. 빨간색 BOX를 작성해주세요.
            message: this.$comm.getLangSpecInfoLabel('L0000005871'),
            type: 'warning', // success / info / warning / error
          });
          return;
        }
      });
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
    },
    beforeAppr() {
      this.EstimatorLoad = !this.EstimatorLoad;
      setTimeout(() => {
        let promises = [{ func: this.validateChk }, { func: this.btnAppr }];
        this.$comm.orderedPromise(promises);
      }, 200);
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSubmit() {
      this.EstimatorLoad = !this.EstimatorLoad;
      setTimeout(() => {
        let promises = [
          { func: this.validateChk },
          { func: this.beforeSubmitNext },
        ];
        this.$comm.orderedPromise(promises);
      }, 200);
    },
    beforeSubmitNext() {
      return new Promise((_resolve, _reject) => {
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321',
                message: 'M0000000011',
                type: 'info',
                confirmCallback: () => {
                  this.isEdit = true;
                },
              });
            }
          })
          .catch(() => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              '유효성 검사도중 에러가 발생하였습니다.'
            );
          });
      });
    },
    validateChkBeforeInsert() {
      return new Promise((_resolve, _reject) => {
        if (!this.rsaRiskAssessResult.plantCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: 'M0000000066', // 사업장을 선택하세요.
            type: 'warning',
          });
          _resolve(false);
          return;
        }
        if (!this.rsaRiskAssessResult.assessYear) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: '대상년도를 선택하세요.', // 대상년도를 선택하세요.
            type: 'warning',
          });
          _resolve(false);
          return;
        }
        if (!this.rsaRiskAssessResult.mainDeptCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: '주관팀을 선택하세요.', // 평가일을 입력해주세요.
            type: 'warning',
          });
          _resolve(false);
          return;
        }
        if (!this.rsaRiskAssessResult.deptCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: '대상팀을 선택하세요.', // 평가일을 입력해주세요.
            type: 'warning',
          });
          _resolve(false);
          return;
        }
        if (!this.rsaRiskAssessResult.assessTypeCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: '평가기법을 선택하세요.', // 평가일을 입력해주세요.
            type: 'warning',
          });
          _resolve(false);
          return;
        }
        if (!this.rsaRiskAssessResult.regRegdemCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: '구분을 선택하세요.', // 평가일을 입력해주세요.
            type: 'warning',
          });
          _resolve(false);
          return;
        }
        if (this.rsaRiskAssessResult.assessDt.length < 2) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: '기간(계획)을 입력하세요.', // 평가일을 입력해주세요.
            type: 'warning',
          });
          _resolve(false);
          return;
        }
        if (!this.rsaRiskAssessResult.assessNm) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: '평가명을 입력하세요.', // 평가일을 입력해주세요.
            type: 'warning',
          });
          _resolve(false);
          return;
        }

        if (this.rsaRiskAssessResult.imprCaseCnt < 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: 'L0000005093', // [평가결과] 개선도출건수를 입력해주세요.
            type: 'warning',
          });
          _resolve(false);
          return;
        }
        if (!this.rsaRiskAssessResult.evalDt) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: 'L0000005141', // 평가일을 입력해주세요.
            type: 'warning',
          });
          _resolve(false);
          return;
        }
        if (!this.rsaRiskAssessResult.assessRsltDesc) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: 'L0000005094', // [평가결과] 평가결과요약을 입력해주세요.
            type: 'warning',
          });
          _resolve(false);
          return;
        }
        _resolve(true);
      });
    },
    approval2() {
      return new Promise((_resolve, _reject) => {
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321',
                message:
                  '해당버튼은 임시 결재완료 버튼입니다. 확인을 누르면 해당 평가결과의 결재가 완료됩니다. 진행하시겠습니까?',
                type: 'info',
                confirmCallback: () => {
                  this.rsaRiskAssessResult.stepCd = 'BAPSG'; // 결재완료
                  this.rsaRiskAssessResult.stateCd = 'STATE4'; // 결재완료
                  this.isAppr = true;
                },
              });
            }
          })
          .catch(() => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              '유효성 검사도중 에러가 발생하였습니다.'
            );
          });
      });
    },
    validateChk() {
      return new Promise((_resolve, _reject) => {
        if (this.rsaRiskAssessResult.imprCaseCnt < 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: 'L0000005093', // [평가결과] 개선도출건수를 입력해주세요.
            type: 'warning',
          });
          _resolve(false);
          return;
        }
        if (!this.rsaRiskAssessResult.evalDt) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: 'L0000005141', // 평가일을 입력해주세요.
            type: 'warning',
          });
          _resolve(false);
          return;
        }
        if (!this.rsaRiskAssessResult.assessRsltDesc) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: 'L0000005094', // [평가결과] 평가결과요약을 입력해주세요.
            type: 'warning',
          });
          _resolve(false);
          return;
        }
        _resolve(true);
      });
    },
    beforeInsert() {
      this.EstimatorLoad = !this.EstimatorLoad;
      setTimeout(() => {
        let promises = [
          { func: this.validateChkBeforeInsert },
          { func: this.beforeInsertNext },
        ];
        this.$comm.orderedPromise(promises);
      }, 200);
    },
    btnApprClickedCallback(result) {
      this.isAppr = false;

      this.setAttach();
    },
    beforeInsertNext() {
      return new Promise((_resolve, _reject) => {
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321',
                message: 'M0000000011',
                type: 'info',
                confirmCallback: () => {
                  this.rsaRiskAssessResult.riskType = this.popupParam.riskType;
                  this.rsaRiskAssessResult.assessStartDt =
                    this.rsaRiskAssessResult.assessDt[0];
                  this.rsaRiskAssessResult.assessEndDt =
                    this.rsaRiskAssessResult.assessDt[1];
                  this.rsaRiskAssessResult.createUserId =
                    this.$store.getters.token;
                  this.rsaRiskAssessResult.createDeptNm =
                    this.$store.getters.deptNm;
                  this.rsaRiskAssessResult.createDeptCd =
                    this.$store.getters.deptCd;
                  this.rsaRiskAssessResult.createPositionCd =
                    this.$store.getters.positionCd;
                  this.rsaRiskAssessResult.createPositionNm =
                    this.$store.getters.positionNm;

                  this.isInsert = true;
                },
              });
            }
          })
          .catch(() => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              '유효성 검사도중 에러가 발생하였습니다.'
            );
          });
      });
    },
    btnSaveClickedCallback(result) {
      this.rsaRiskAssessResult.assessDeptNo = result.data;

      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      this.updateMode = true;
      this.getDetail();
      // this.saveAttach();
      this.setAttach();
    },
    btnInsertClickedCallback(result) {
      this.rsaRiskAssessResult.assessDeptNo = result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.updateMode = true;

      this.getDetail();
      this.setAttach();
      // this.saveAttach();
    },
    btnClickedErrorCallback(result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', result);
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    beforeConfirm() {
      this.EstimatorLoad = !this.EstimatorLoad;
      setTimeout(() => {
        let promises = [
          { func: this.validateChk },
          { func: this.beforeConfirmNext },
        ];
        this.$comm.orderedPromise(promises);
      }, 200);
    },
    beforeConfirmNext() {
      return new Promise((_resolve, _reject) => {
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321',
                message: 'M0000000718',
                // 결재요청 전 저장됩니다. 진행하시겠습니까?
                type: 'info', // success / info / warning / error
                confirmCallback: () => {
                  this.$http.url = this.insertUrl;
                  this.$http.type = 'POST';
                  this.$http.param = this.rsaRiskAssessResult;
                  this.$http.request(
                    (_result) => {
                      this.popupOptions.target = () =>
                        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
                      this.popupOptions.title = 'L0000003418'; // 결재요청
                      this.popupOptions.visible = true;
                      this.popupOptions.closeCallback = this.closeApprPop;
                      this.popupOptions.width = '80%';
                      this.popupOptions.param = {
                        apprBizCd:
                          this.rsaRiskAssessResult.riskType === 'work'
                            ? 'RS-RE-01'
                            : 'RS-RE-02',
                        apprRqstNo: this.rsaRiskAssessResult.rapprRqstNo,
                        apprParams: {
                          assessDeptNo: this.rsaRiskAssessResult.assessDeptNo,
                          riskType: this.popupParam.riskType,
                        },
                      };
                    },
                    (_error) => {
                      window.getApp.$emit('APP_REQUEST_ERROR', _error);
                    }
                  );
                },
              });
            }
          })
          .catch(() => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              '유효성 검사도중 에러가 발생하였습니다.'
            );
          });
      });
    },
    deleteInfo() {
      return new Promise((_resolve, _reject) => {
        this.$http.type = 'GET';
        this.$http.url = this.$format(
          selectConfig.rsa.rsaRiskAssessResult.getimprstatus.url,
          this.rsaRiskAssessResult.assessDeptNo
        );
        this.$http.request(
          (_result) => {
            let delYn = 'Y';
            if (!_result.data || _result.data.length > 0) {
              for (let i = 0; i < _result.data.length; i++) {
                if (_result.data[i]['imprStepCd'] !== 'IMST1') {
                  delYn = 'N';
                }
              }
              if (delYn === 'Y') {
                _resolve(true);
                this.deleteSubmit();
              } else {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395' /* 안내 */,
                  message:
                    'M0000001621' /* 개선사항이 평가중 상태일 경우 삭제가 불가합니다. */,
                  type: 'warning', // success / info / warning / error
                });
                _resolve(false);
                return;
              }
            } else {
              _resolve(true);
              this.deleteSubmit();
            }
          },
          (_error) => {
            _reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },

    deleteSubmit() {
      console.log(
        ' this.rsaRiskAssessResult.assessPlanNo: ',
        this.rsaRiskAssessResult.assessPlanNo
      );
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // '삭제하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.rsaRiskAssessResult.assessDeptNo,
            this.rsaRiskAssessResult.assessRsltNo,
            this.rsaRiskAssessResult.assessPlanNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // '삭제되었습니다.',
                type: 'success',
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
  },
};
</script>
