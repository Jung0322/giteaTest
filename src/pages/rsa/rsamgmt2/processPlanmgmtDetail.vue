<!--
  목적 : 평가계획 관리 상세
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
            <!-- 평가계획 관리 상세 -->
            <y-label
              label="L0000004976"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn
                v-if="updateMode && editable && apprMode"
                :action-url="apprUrl"
                :param="Planmgmt"
                :is-submit="isAppr"
                title="L0000003418"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeValidateChk('appr')"
                @btnClicked="btnApprClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="updateMode && editable && apprMode"
                title="L0000001495"
                color="red"
                @btnClicked="deleteSubmit"
              />
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable && apprMode"
                :action-url="editUrl"
                :param="Planmgmt"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeValidateChk('update')"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!updateMode && editable"
                :action-url="insertUrl"
                :param="Planmgmt"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeValidateChk('insert')"
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
                :editable="editable && apprMode"
                :required="true"
                name="plantCd"
                v-model="Planmgmt.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대상년도 -->
              <y-datepicker
                :editable="editable && apprMode"
                :width="8"
                type="year"
                name="assessYear"
                label="L0000004449"
                :default="Planmgmt.assessYear"
                v-model="Planmgmt.assessYear"
                :required="true"
                v-validate="'required'"
                :state="validateState('assessYear')"
              />
            </b-col>
            <!-- 평가기법 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :editable="editable && apprMode"
                :width="8"
                :comboItems="deptList"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000003416"
                name="assessTypeCd"
                v-model="Planmgmt.assessTypeCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('assessTypeCd')"
              ></y-select>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 구분 -->
              <y-select
                :editable="editable && apprMode"
                :width="8"
                :comboItems="rsaRegRegdemItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000686"
                name="regRegdemCd"
                v-model="Planmgmt.regRegdemCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('regRegdemCd')"
              ></y-select>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 기간 -->
              <y-datepicker
                :editable="editable && apprMode"
                :width="8"
                :range="true"
                name="period2"
                label="L0000000767"
                :default="Planmgmt.period2"
                v-model="Planmgmt.period2"
                :required="true"
                v-validate="'required'"
                :state="validateState('period2')"
              />
            </b-col>

            <!-- 주관팀 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-tree-dept
                label="L0000002713"
                name="deptCd"
                v-model="Planmgmt.deptCd"
                :plantCd="Planmgmt.plantCd"
                :required="true"
                :editable="editable && apprMode"
                v-validate="'required'"
                :state="validateState('deptCd')"
                @setDeptNm="setDeptNm"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3"> </b-col>

            <!-- 평가명 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :editable="editable && apprMode"
                :width="10"
                :maxlength="50"
                ui="bootstrap"
                label="L0000003081"
                name="assessNm"
                v-model="Planmgmt.assessNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('assessNm')"
              ></y-text>
            </b-col>
            <!-- 상세내용 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :editable="editable && apprMode"
                :width="10"
                :maxlength="250"
                ui="bootstrap"
                name="assessDesc"
                label="L0000001528"
                v-model="Planmgmt.assessDesc"
                :rows="3"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <el-tabs type="border-card" v-model="tabIndex">
          <el-tab-pane
            v-for="(item, i) in tabItems"
            :key="i"
            stretch
            class="default-tab-pane"
          >
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ $comm.getLangSpecInfoLabel(item.title) }}
            </span>
          </el-tab-pane>
          <component
            v-show="tabIndex === '0'"
            :is="component"
            sm="12"
            :Planmgmt.sync="Planmgmt"
            :deptListLoad.sync="deptListLoad"
            :updateMode.sync="updateMode"
            :editable.sync="editable"
            :deptReLoad.sync="deptReLoad"
            :apprMode.sync="apprMode"
            :apprFlag.sync="this.popupParam.apprFlag"
          />

          <component
            v-show="tabIndex === '1'"
            sm="12"
            :is="component1"
            :saveAttachFiles="saveAttachFiles"
            :attachFileGrps="attachFileGrps"
            :submitCheck="submitCheck"
            @changeUploadFiles="changeUploadFiles"
          />
        </el-tabs>
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
        assessPlanNo: 0,
        assessRsltNo: 0,
        riskType: '',
        deptCd: '',
        apprFlag: false,
      },
    },
    isPopView: false,
  },
  data: () => ({
    Planmgmt: {
      assessPlanNo: 0,
      assessRsltNo: 0,
      plantCd: '', // 사업장 코드
      assessYear: '',
      assessTypeCd: null, // 분류
      classificationNm: '', // 분류명
      assessTypeNm: '', // 분류명
      regRegdemCd: '', // 평가구분
      regRegdemNm: '', // 평가구분명
      assessNm: '',
      assessStartDt: '',
      assessEndDt: '',
      assessDesc: '',
      deptCd: '', // 평가팀 부서코드
      deptNm: '', // 평가팀 부서명
      riskType: '',
      createUserId: '',
      createDeptNm: '',
      createDeptCd: '',
      createPositionCd: '',
      createPositionNm: '',
      updatePositionCd: '',
      updatePositionNm: '',
      updateUserId: '',
      updateDeptNm: '',
      updateDeptCd: '',
      papprRqstNm: '',
      papprRqstNo: 0,
      userId: '',
      internalList: [], // 내부평가자 목록
      externalList: [], // 외부평가자 목록
      assessLeaderId: '', // 평가리더ID
      assessLeaderNm: '', // 평가리더명
      planmgmtDeptList: [], // 평가대상작업목록
      procStepCd: '',
      tempAssessYear2: '', // 임시저장용 평가년도 (백엔드용)
      tempAssessNm: '', // 임시저장용 평가명
      assessStepCd: '', // 평가진행단계코드
      period2: [],
      stepCd: '',
      apprRqstCode: '',
      apprRqstStatus: '',
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
    tabItems: [
      {
        title: 'L0000000927',
      } /* 대상팀 */,

      { title: 'L0000002843', url: 'multiFileUpload' } /* 첨부파일 */,
    ],
    saveAttachFiles: [],
    attachFileGrps: [],
    submitCheck: false,
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    editUrl: '',
    insertUrl: '',
    deleteUrl: '',
    detailUrl: '',
    rsaRegRegdemItems: [], // 구분
    component: null,
    component1: null,
    component2: null,
    deptListLoad: false,
    deptReLoad: false,
    apprMode: true,
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
    tempAssessNm2: '',

    isAppr: false,
    apprUrl: '',
    deptList: [], // 분류목록
  }),
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.getDetailFlag = false;
      // Url Setting

      this.detailUrl = selectConfig.rsa.planmgmt2.get.url;

      this.editUrl = transactionConfig.rsa.planmgmt2.edit.url;
      this.apprUrl = transactionConfig.rsa.planmgmt2.edit.url;
      this.insertUrl = transactionConfig.rsa.planmgmt2.insert.url;
      this.deleteUrl = transactionConfig.rsa.planmgmt2.deleteUploadPlan.url;

      this.component = () => import(`${'./processPlanOperationListTab'}`);

      this.component1 = () =>
        import('@/pages/common/attachFile/multiFileUpload');

      this.$comm.getComboItems('RSA_REG_REGDEM', false).then((_result) => {
        this.rsaRegRegdemItems = _result;
        this.$_.remove(this.rsaRegRegdemItems, (item) => {
          return item.code === 'REG03';
        });
      });
      if (this.deptList === null) {
        this.deptList = [];
      }
      this.$comm.getComboItems('RSA_ASSESS_TYPE', false).then((_result) => {
        this.deptList = _result || [];
      });

      if (!this.popupParam.assessPlanNo) {
        let from = this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '-6m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        let to = this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '0y',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );

        this.Planmgmt.riskType = this.popupParam.riskType;
        this.Planmgmt.deptCd = this.$store.getters.deptCd;

        this.setAttachFileGrps();
      } else {
        this.Planmgmt.assessPlanNo = this.popupParam.assessPlanNo;
        this.Planmgmt.assessYear = '';
        this.getDetail();
        this.Planmgmt.assessNm = this.popupParam.assessNm;
      }
    },

    getDetail() {
      if (!this.Planmgmt.assessPlanNo) return;
      this.$http.url = this.$format(this.detailUrl, this.Planmgmt.assessPlanNo);
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.updateMode = true;

          this.Planmgmt = _result.data;
          this.Planmgmt.assessYear = String(this.Planmgmt.assessYear);
          this.Planmgmt.period2 = [
            this.Planmgmt.assessStartDt,
            this.Planmgmt.assessEndDt,
          ];

          this.Planmgmt.planmgmtDeptList = _result.data.planmgmtDeptList;
          this.Planmgmt.internalList = _result.data.internalList;

          this.Planmgmt.tempAssessNm = _result.data.assessNm;
          this.Planmgmt.assessNm = _result.data.assessNm;

          if (
            this.Planmgmt.stepCd === 'BAPSG' ||
            this.Planmgmt.stepCd === 'BAPSA'
          ) {
            this.editable = false;
          }
          if (this.popupParam.apprFlag) {
            this.editable = false;
          }

          this.setAttachFileGrps();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
    /** 수정 하기전 UI단 유효성 검사 **/
    async beforeValidateChk(flag) {
      this.deptListLoad = !this.deptListLoad;
      if (!this.Planmgmt.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000005081' /* 본문 사업장을 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }

      if (!this.Planmgmt.assessYear) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000005132' /* 대상년도를 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
      if (!this.Planmgmt.period2) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000006075' /* 기간을 입력해주세요 */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }

      if (!this.Planmgmt.assessTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000006076' /* 평가기법을 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
      if (!this.Planmgmt.regRegdemCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001313' /* 구분을 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }

      if (!this.Planmgmt.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000006077' /* 주관팀을 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
      if (!this.Planmgmt.assessNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000005137' /* 평가명을 입력해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
      if (this.Planmgmt.planmgmtDeptList.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            '평가대상 작업 목록을 최소 1건 이상 등록해주세요.' /* 평가대상 작업 목록을 최소 1건 이상 등록해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
      // 입력되지 않은 날짜 검사
      let dateFlag = true;
      this.$_.forEach(this.Planmgmt.planmgmtDeptList, (item) => {
        if (!item.assessStartDt) {
          dateFlag = false;
          return;
        }

        if (!item.assessEndDt) {
          dateFlag = false;
          return;
        }
      });
      // 평가대상 작업 목록 중 날짜가 입력되지 않은 행이 있다면 에러메세지
      if (dateFlag === false) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            '평가대상 작업 목록 중 평가 시작일, 또는 종료일이 입력되지 않은 행이 존재합니다.' /* 평가대상 작업 목록 중 평가 시작일, 또는 종료일이 입력되지 않은 행이 존재합니다. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }

      if (flag === 'insert') {
        this.nextInsert();
      } else if (flag === 'update') {
        this.nextUpdate();
      } else if (flag === 'appr') {
        this.Planmgmt.assessStartDt = this.Planmgmt.period2[0];
        this.Planmgmt.assessEndDt = this.Planmgmt.period2[1];
        this.Planmgmt.updateUserId = this.$store.getters.token;
        this.Planmgmt.updateDeptNm = this.$store.getters.deptNm;
        this.Planmgmt.updateDeptCd = this.$store.getters.deptCd;
        this.Planmgmt.updatePositionCd = this.$store.getters.positionCd;
        this.Planmgmt.updatePositionNm = this.$store.getters.positionNm;
        this.Planmgmt.procStepCd = 'RWRS1';
        this.Planmgmt.stateCd = 'STATE2'; // 작성중

        this.btnAppr();
      }
    },
    setDeptNm(deptNm) {
      this.Planmgmt.deptNm = deptNm;
    },

    nextInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'L0000005853', // 평가계획을 등록하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.Planmgmt.assessStartDt = this.Planmgmt.period2[0];
                this.Planmgmt.assessEndDt = this.Planmgmt.period2[1];

                this.Planmgmt.createUserId = this.$store.getters.token;
                this.Planmgmt.userId = this.$store.getters.token;
                this.Planmgmt.createDeptNm = this.$store.getters.deptNm;
                this.Planmgmt.createDeptCd = this.$store.getters.deptCd;
                this.Planmgmt.createPositionCd = this.$store.getters.positionCd;
                this.Planmgmt.createPositionNm = this.$store.getters.positionNm;

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
    },
    btnAppr() {
      this.$validator.validateAll().then((_result) => {
        // TODO : 전역 성공 메시지 처리
        // 이벤트는 ./event.js 파일에 선언되어 있음
        // 조사내용, 조사결과검토 탭 부분에서 유효성검사를 실행하지 않아 소스 수정
        if (_result) {
          let tableNm = 'rsa_work_risk_assess_plan';
          let approvalCode = null;
          let tableKey = this.Planmgmt.assessPlanNo;
          let approvalType = '';
          this.Planmgmt.riskType === 'work'
            ? (approvalType = 'UPLD_WPLAN_RQST')
            : (approvalType = 'UPLD_PLAN_RQST');
          if (this.Planmgmt.stepCd === 'BAPSB') {
            // 결재요청전

            approvalCode = this.Planmgmt.apprRqstCode;
          } else if (this.Planmgmt.stepCd === 'BAPSA') {
            // 결재중

            approvalCode = this.Planmgmt.apprRqstCode;
          }
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321',
            message: 'M0000000718', // 결재요청 전 저장됩니다. 진행하시겠습니까?
            type: 'info',
            confirmCallback: () => {
              this.nextUpdateFlag = true;
              this.nextInsertFlag = true;
              this.Planmgmt.assessStartDate = this.Planmgmt.tempAssessYear[0];
              this.Planmgmt.assessEndDate = this.Planmgmt.tempAssessYear[1];
              this.Planmgmt.tempAssessYear = this.Planmgmt.assessYear;
              // this.Planmgmt.assessYear =
              //   this.Planmgmt.tempAssessYear[0].substring(0, 4);
              // this.Planmgmt.tempAssessYear =
              //   this.Planmgmt.tempAssessYear[0].substring(0, 4);
              this.Planmgmt.updateUserId = this.$store.getters.token;
              this.Planmgmt.updateDeptNm = this.$store.getters.deptNm;
              this.Planmgmt.updateDeptCd = this.$store.getters.deptCd;
              this.Planmgmt.updatePositionCd = this.$store.getters.positionCd;
              this.Planmgmt.updatePositionNm = this.$store.getters.positionNm;

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
                apprBizCd: 'RS-HP-03',
                apprParams: {
                  assessPlanNo: this.Planmgmt.assessPlanNo,
                },
              };
            },
          });

          // this.isAppr = true;
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
    approval() {
      // this.popupOptions.target = () =>
      //   import(`${'@/pages/approval/processPlanApproval.vue'}`);
      this.popupOptions.title = 'L0000003418'; // 결재요청
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        url: selectConfig.rsa.planmgmt.getProcessPlanAppr.url,
        assessPlanNo: this.Planmgmt.assessPlanNo.toString(),
      };
    },

    nextUpdate() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'L0000005844', // 평가계획을 수정하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.Planmgmt.assessStartDt = this.Planmgmt.period2[0];
                this.Planmgmt.assessEndDt = this.Planmgmt.period2[1];
                this.Planmgmt.procStepCd = 'RWRS1';
                this.Planmgmt.stateCd = 'STATE2'; // 작성중
                this.Planmgmt.updateUserId = this.$store.getters.token;
                this.Planmgmt.updateDeptNm = this.$store.getters.deptNm;
                this.Planmgmt.updateDeptCd = this.$store.getters.deptCd;
                this.Planmgmt.updatePositionCd = this.$store.getters.positionCd;
                this.Planmgmt.updatePositionNm = this.$store.getters.positionNm;

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
    },
    btnApprClickedCallback(result) {
      this.isAppr = false;

      this.saveAttach();

      this.deptReLoad = !this.deptReLoad;
    },
    btnSaveClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });

      this.isEdit = false;
      this.updateMode = true;

      this.saveAttach();

      this.deptReLoad = !this.deptReLoad;
    },
    btnInsertClickedCallback(result) {
      this.Planmgmt.assessPlanNo = result.data;

      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.updateMode = true;
      this.saveAttach();

      // 저장 후 재 조회시 대상부서탭 우선조회되서 데이터 정합성 안맞는 현상처리
      setTimeout(() => {
        this.deptReLoad = !this.deptReLoad;
      }, 300);
    },
    deleteInfo() {
      return new Promise((_resolve, _reject) => {
        this.$http.type = 'GET';
        this.$http.url = this.$format(
          selectConfig.rsa.planmgmt.getstatus.url,
          this.Planmgmt.assessPlanNo
        );
        this.$http.request(
          (_result) => {
            if (_result.data === 0) {
              _resolve(true);
              this.deleteSubmit();
            } else {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message:
                  'M0000001620' /* 대상 부서가 평가 중상 태일 경우 삭제가 불가합니다. */,
                type: 'warning', // success / info / warning / error
              });
              _resolve(false);
              return;
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
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // '삭제하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.Planmgmt.assessPlanNo
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
    btnClickedErrorCallback(result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', result);
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    setAttachFileGrps() {
      let taskKey = this.Planmgmt.assessPlanNo
        ? this.Planmgmt.assessPlanNo
        : ''; // 현 모델 키 값

      this.attachFileGrps = [
        {
          label: 'L0000003030',
          drag: this.editable,
          showFileSearch: false,
          editable: this.editable,
          disabled: !this.editable,
          uploadTempFiles: null,
          taskClassNm: 'RSA_PROCPLAN', // 현 화면의 첨부파일 키 값
          taskKey: taskKey,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.attachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.attachFileGrps[index].uploadTempFiles = data;

        // 업로드 하기 위해 올라온 파일들을 저장하는 부분
        // 기존에 들어가 있는 경우에는 덮어쓰고 아닌 경우에는 신규로 넣는다.
        let saveIndex = this.$_.findIndex(this.saveAttachFiles, {
          taskClassNm: data.taskClassNm,
        });
        if (saveIndex > -1) {
          this.saveAttachFiles[saveIndex] = this.$_.clone(
            this.attachFileGrps[index]
          );
        } else {
          this.saveAttachFiles.push(this.$_.clone(this.attachFileGrps[index]));
        }
      }
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.Planmgmt.assessPlanNo;
      });

      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitCheck = !this.submitCheck;
      }
    },
    beforeConfirm() {
      this.deptListLoad = !this.deptListLoad;
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000718',
        // 결재요청 전 저장됩니다. 진행하시겠습니까?
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          // 결재요청팝업 버튼 표시여부

          this.Planmgmt.updateUserId = this.$store.getters.token;
          this.Planmgmt.updateDeptNm = this.$store.getters.deptNm;
          this.Planmgmt.updateDeptCd = this.$store.getters.deptCd;
          this.Planmgmt.updatePositionCd = this.$store.getters.positionCd;
          this.Planmgmt.updatePositionNm = this.$store.getters.positionNm;
          this.$http.url = this.editUrl;
          this.$http.type = 'PUT';
          this.$http.param = this.Planmgmt;
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
                  this.Planmgmt.riskType === 'work' ? 'RS-PL-01' : 'RS-PL-02',
                apprRqstNo: this.Planmgmt.papprRqstNo,
                apprParams: {
                  assessPlanNo: this.Planmgmt.assessPlanNo,
                },
              };
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    closeApprPop(data) {
      // 결재요청팝업 버튼 표시여부
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
      this.deptReLoad = !this.deptReLoad;
    },
  },
};
</script>
