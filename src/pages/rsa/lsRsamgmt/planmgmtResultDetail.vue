<!--
    목적 : 위험성평가 > 작업 위험성평가 (HE) > 결과 등록 상세
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
            <!-- 위험성평가 결과 작성 -->
            <y-label
              label="L0000005864"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="updateMode && editable && apprMode"
                :action-url="editUrl"
                :param="Planmgmt"
                :is-submit="isAppr"
                title="L0000003418"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeValidateChk('appr')"
                @btnClicked="btnSaveClickedCallback2"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />

              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
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
            <!-- 작업명 -->

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :editable="editable && apprMode"
                :width="8"
                :maxlength="50"
                ui="bootstrap"
                label="L0000002389"
                name="jobNm"
                v-model="Planmgmt.jobNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('jobNm')"
              ></y-text>
            </b-col>

            <!-- 평가일 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-datepicker
                :editable="editable && apprMode"
                :width="8"
                name="assessDate"
                label="L0000003091"
                :default="Planmgmt.assessDate"
                v-model="Planmgmt.assessDate"
                :required="true"
                v-validate="'required'"
                :state="validateState('assessDate')"
              />
            </b-col>
            <!-- 담당자 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :clearable="true"
                :disabled="true"
                ui="bootstrap"
                label="L0000004201"
                name="userNm"
                v-model="Planmgmt.userNm"
                :appendIcon="[
                  { icon: 'times', callbackName: 'clear' },
                  { icon: 'search', callbackName: 'searchUser' },
                ]"
                @searchUser="btnSearchUserClicked"
                @clear="clear()"
                :required="true"
                v-validate="'required'"
                :state="validateState('userNm')"
              />
            </b-col>
            <!-- 기타 안전사항 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :editable="editable && apprMode"
                :width="10"
                :maxlength="250"
                ui="bootstrap"
                name="remarks"
                label="L0000005866"
                v-model="Planmgmt.remarks"
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
          <keep-alive>
            <component
              :is="component"
              v-if="component"
              :Planmgmt.sync="Planmgmt"
              :deptListLoad.sync="deptListLoad"
              :updateMode.sync="updateMode"
              :editable.sync="editable"
              :deptReLoad.sync="deptReLoad"
              :apprMode.sync="apprMode"
              :apprFlag.sync="this.popupParam.apprFlag"
              :saveAttachFiles="saveAttachFiles"
              :attachFileGrps="attachFileGrps"
              :submitCheck="submitCheck"
              @changeUploadFiles="changeUploadFiles"
            />
          </keep-alive>
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
      classificationCd: null, // 분류
      classificationNm: '', // 분류명
      assessTypeNm: '', // 분류명
      regRegdem: '', // 평가구분
      regRegdemNm: '', // 평가구분명
      assessNm: '',
      assessStartDate: '',
      assessEndDate: '',
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
      planmgmtDeptList: [],
      deptList: [], // 분류목록

      tempAssessNm: '', // 임시저장용 평가명
      revNo: 0, // 관리번호
      assessDate: '', // 평가일
      remarks: '', // 비고
      jobNm: '', // 작업명
      assessStepCd: '', // 진행단계 코드
      jobManageNo: '', // 관리번호
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
        title: 'L0000005868',
        url: './resultOperationListTab',
      } /* 평가결과 작성 */,
      {
        title: 'L0000004990',
        url: './resultOperationTeamTab',
      } /* 평가팀 */,
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
    classificationUrl: '', // 평가팀별 분류 조회 url
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
    nextInsertFlag: false,
    nextUpdateFlag: false,
    tempName: '',
    isAppr: false,
    apprUrl: '',
    completUrl: '',
    isComplete: false,
    completeFlag: false,
  }),
  watch: {
    tabIndex: function (newValue, oldValue) {
      this.loadComponent();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.getDetailFlag = false;
      // Url Setting

      this.detailUrl = selectConfig.rsa.planmgmt2.getResult.url;
      this.classificationUrl =
        selectConfig.rsa.planmgmt2.getClassificationList.url;
      this.editUrl = transactionConfig.rsa.planmgmt2.editNoPlanResult.url;
      this.completUrl = transactionConfig.rsa.planmgmt2.completeResult.url;
      this.apprUrl = transactionConfig.rsa.planmgmt2.apprResult.url;
      this.insertUrl = transactionConfig.rsa.planmgmt2.insertNoPlanResult.url;
      this.deleteUrl = transactionConfig.rsa.planmgmt2.deleteRslt.url;

      this.$comm.getComboItems('RSA_REG_REGDEM', false).then((_result) => {
        this.rsaRegRegdemItems = _result || [];
      });
      this.$comm.getComboItems('RSA_ASSESS_CLASS', true).then((_result) => {
        this.deptList = _result;
        this.deptList.splice(0, 1, {
          code: null,
          codeNm:
            this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
        });
      });

      this.getClassificationList();
      if (!this.popupParam.assessRsltNo) {
        this.Planmgmt.riskType = this.popupParam.riskType;
        this.Planmgmt.deptCd = this.$store.getters.deptCd;
        this.Planmgmt.assessDate = this.$comm.getToday();
      } else {
        this.Planmgmt.assessRsltNo = this.popupParam.assessRsltNo;

        this.getDetail();
        this.Planmgmt.assessNm = this.popupParam.assessNm;
      }

      this.setAttachFileGrps();
    },
    setDeptNm(deptNm) {
      this.Planmgmt.deptNm = deptNm;
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      if (path === './resultOperationListTab') {
        this.component = () => import(`${'./resultOperationListTab'}`);
      } else if (path === './resultOperationTeamTab') {
        this.component = () => import(`${'./resultOperationTeamTab'}`);
      } else {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      }
    },
    getClassificationList() {
      if (this.Planmgmt.deptList === null) {
        this.Planmgmt.deptList = [];
      }

      if (this.Planmgmt.deptCd) {
        // 평가팀 별 분류 조회
        this.$http.url = this.classificationUrl;

        this.$http.param = {
          deptCd: this.Planmgmt.deptCd,
        };

        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            if (_result.data) {
              this.Planmgmt.deptList = _result.data;
              if (this.Planmgmt.deptList && this.Planmgmt.deptList !== null) {
                this.Planmgmt.deptList.splice(0, 0, {
                  classificationCd: null,
                  classificationNm:
                    this.$comm.getLangSpecInfoLabel('L0000003394'),
                }); // 선택하세요
              } else {
                this.Planmgmt.deptList = [
                  {
                    classificationCd: null,
                    classificationNm:
                      this.$comm.getLangSpecInfoLabel('L0000003394'),
                  },
                ];
              }
            } else {
              if (this.Planmgmt.deptList && this.Planmgmt.deptList !== null) {
                this.Planmgmt.deptList.splice(0, 0, {
                  classificationCd: null,
                  classificationNm:
                    this.$comm.getLangSpecInfoLabel('L0000003394'),
                }); // 선택하세요
              } else {
                this.Planmgmt.deptList = [
                  {
                    classificationCd: null,
                    classificationNm:
                      this.$comm.getLangSpecInfoLabel('L0000003394'),
                  },
                ];
              }
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        this.Planmgmt.deptList = [
          {
            classificationCd: null,
            classificationNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          },
        ];
      }
    },
    btnAppr() {
      this.$validator.validateAll().then((_result) => {
        // TODO : 전역 성공 메시지 처리
        // 이벤트는 ./event.js 파일에 선언되어 있음
        // 조사내용, 조사결과검토 탭 부분에서 유효성검사를 실행하지 않아 소스 수정
        if (_result) {
          let tableNm = 'risk_assess_rslt';
          let approvalCode = null;
          let tableKey = this.Planmgmt.assessRsltNo;
          let approvalType = '';
          if (this.Planmgmt.assessStepCd === 'RRS01') {
            // 평가중
            approvalType = 'RSLT_MGMT_RQST';
            approvalCode = this.Planmgmt.apprRqstCode;
          } else if (this.Planmgmt.assessStepCd === 'RRS02') {
            // 결재중
            approvalType = 'RSLT_MGMT_RQST';
            approvalCode = this.Planmgmt.apprRqstCode;
          } else if (this.Planmgmt.assessStepCd === 'RRS03') {
            // 평가완료
            approvalType = 'RSLT_MGMT_RQST';
            approvalCode = this.Planmgmt.apprRqstCode;
          } else if (this.Planmgmt.assessStepCd === 'RRES11') {
            // 입력완료
            approvalType = 'RSLT_MGMT_RQST';
            approvalCode = this.Planmgmt.apprRqstCode;
          }
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321', // 확인
            message: 'M0000000718', // 결재요청 전 저장됩니다. 진행하시겠습니까?
            type: 'info',
            confirmCallback: () => {
              this.nextUpdateFlag = true;
              this.nextInsertFlag = true;

              this.Planmgmt.updateUserId = this.$store.getters.token;
              this.Planmgmt.updateDeptNm = this.$store.getters.deptNm;
              this.Planmgmt.updateDeptCd = this.$store.getters.deptCd;
              this.Planmgmt.updatePositionCd = this.$store.getters.positionCd;
              this.Planmgmt.updatePositionNm = this.$store.getters.positionNm;

              this.saveAttach();
              this.isAppr = true;

              //   this.popupOptions.target = () =>
              // import(`${'@/pages/approval/approval.vue'}`);
              this.popupOptions.target = () =>
                import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
              this.popupOptions.title = 'L0000003418';
              this.popupOptions.visible = true;
              this.popupOptions.closeCallback = this.closeApprPop;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                apprBizCd: 'RS-HP-02',
                apprParams: {
                  assessRsltNo: this.Planmgmt.assessRsltNo,
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
    getDetail() {
      if (!this.Planmgmt.assessRsltNo) return;
      this.$http.url = this.$format(this.detailUrl, this.Planmgmt.assessRsltNo);
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.updateMode = true;

          this.Planmgmt = _result.data;
          if (!this.Planmgmt.assessDate) {
            this.Planmgmt.assessDate = this.$comm.getToday();
          }

          this.Planmgmt.planmgmtDeptList = _result.data.planmgmtDeptList;
          this.Planmgmt.internalList = _result.data.internalList;

          this.Planmgmt.tempAssessNm = _result.data.assessNm;
          this.Planmgmt.assessNm = _result.data.assessNm;

          if (
            this.Planmgmt.assessStepCd === 'RRS03' ||
            this.Planmgmt.assessStepCd === 'RRS02'
          ) {
            this.editable = false;
            this.apprMode = false;
            this.completeFlag = true;
          }
          if (
            this.Planmgmt.assessStepCd === 'RRS02' ||
            this.Planmgmt.assessStepCd === 'RRS03'
          ) {
            // 결재중, 결재완료인 경우
            this.editable = false;
            this.apprMode = false;
            this.completeFlag = true;
          } else if (this.Planmgmt.apprRqstStatus === 'BAPSA') {
            // 결재중
            this.editable = false;
            this.apprMode = false;
            this.completeFlag = true;
          } else if (this.Planmgmt.apprRqstStatus === 'BAPSG') {
            // 결재완료
            this.editable = false;
            this.apprMode = false;
            this.completeFlag = true;
            this.disabled = true;
            this.updateMode = false;
          }
          if (this.Planmgmt.assessStepCd === 'RRS03') {
            // 평가완료
            this.completeFlag = true;
            this.apprMode = false;
          }
          if (this.popupParam.apprFlag) {
            this.editable = false;
            this.disabled = true;
            this.updateMode = false;
            this.apprMode = false;
          }
          this.deptReLoad = !this.deptReLoad;

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
      let strongFlag = false;
      let freqFlag = false;
      this.$_.forEach(this.Planmgmt.planmgmtDeptList, (item) => {
        if (item.strong > 4) {
          strongFlag = true;
          return false;
        }
      });

      this.$_.forEach(this.Planmgmt.planmgmtDeptList, (item) => {
        if (item.frequency > 5) {
          freqFlag = true;
          return false;
        }
      });
      if (strongFlag === true && freqFlag === true) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            'L0000005876' /* 강도는 최대 4, 빈도는 최대 5까지 입력할수있습니다. */,
          type: 'warning', // success / info / warning / error
        });
        freqFlag = false;
        strongFlag = false;
        return;
      }
      if (strongFlag === true) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000005875' /* 강도는 4 이상 입력할 수 없습니다. */,
          type: 'warning', // success / info / warning / error
        });
        strongFlag = false;
        return;
      }
      if (freqFlag === true) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000005874' /* 빈도는 5 이상 입력할 수 없습니다. */,
          type: 'warning', // success / info / warning / error
        });
        freqFlag = false;
        return;
      }
      if (!this.Planmgmt.jobNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001323' /* 작업명을 입력해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
      if (!this.Planmgmt.assessDate) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000005141' /* 평가일을 입력해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
      if (!this.Planmgmt.userNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000644' /* 담당자를 입력하세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
      if (this.Planmgmt.internalList.length < 3) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            'L0000005873' /* 내부 평가자는 최소 3명 이상 등록되어야 합니다. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
      let leaderCnt = false;
      let teamCnt = false;
      let cnt = 0;
      // 평가리더 유무 체크
      this.$_.forEach(this.Planmgmt.internalList, (item) => {
        if (item.teamType === 'RAT01') {
          console.log('item: ', item);
          this.Planmgmt.assessLeaderId = item.raterId;
          leaderCnt = true;
        }
      });
      // 평가자 3명 이상인지 체크
      this.$_.forEach(this.Planmgmt.internalList, (item) => {
        if (item.teamType === 'RAT02') {
          cnt += 1;
        }
      });
      if (cnt >= 3) {
        teamCnt = true;
      } else {
        teamCnt = false;
      }

      if (flag === 'insert') {
        this.nextInsert();
      } else if (flag === 'update') {
        this.nextUpdate();
      } else if (flag === 'complete') {
        if (
          !this.Planmgmt.planmgmtDeptList ||
          this.Planmgmt.planmgmtDeptList.length === 0
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005877', // 평가결과는 최소 1건 이상 등록되어야 합니다.
            type: 'warning', // success / info / warning / error
          });

          return;
        } else if (leaderCnt === false) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005878', // 평가리더가 지정되지 않았습니다. 평가팀을 확인해주세요.
            type: 'warning', // success / info / warning / error
          });

          return;
        } else if (teamCnt === false) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005879', // 내부평가자의 평가자는 최소 3명 이상 등록되어야 합니다. 내부평가자 목록을 확인해주세요.
            type: 'warning', // success / info / warning / error
          });
          return;
        } else {
          this.nextComplete();
        }
      } else {
        if (leaderCnt === false) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005878', // 평가리더가 지정되지 않았습니다. 평가팀을 확인해주세요.
            type: 'warning', // success / info / warning / error
          });
          return;
        } else if (teamCnt === false) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005879', // 내부평가자의 평가자는 최소 3명 이상 등록되어야 합니다. 내부평가자 목록을 확인해주세요.
            type: 'warning', // success / info / warning / error
          });
          return;
        }

        this.btnAppr();
        // }
      }
    },
    deleteSubmit() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // '삭제하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.Planmgmt.assessRsltNo,
            this.Planmgmt.assessPlanNo,
            this.Planmgmt.jobNo
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

    nextInsert() {
      console.log('this.Planmgmt: ', this.Planmgmt);
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000636', // 평가결과를 등록하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.nextInsertFlag = true;
                this.Planmgmt.createUserId = this.$store.getters.token;

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
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000004');
        });
    },
    approval() {
      // this.popupOptions.target = () =>
      //   import(`${'@/pages/approval/approval3.vue'}`);
      this.popupOptions.title = 'L0000003418';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        url: selectConfig.rsa.planmgmt.getApprResult.url,
        assessRsltNo: this.Planmgmt.assessRsltNo.toString(),
      };
    },

    nextComplete() {
      let leaderFlag = false;
      this.$_.forEach(this.Planmgmt.internalList, (item) => {
        if (item.teamType === 'RAT01') {
          this.Planmgmt.assessLeaderId = item.raterId;
          leaderFlag = true;
        }
      });
      if (
        !this.Planmgmt.planmgmtDeptList ||
        this.Planmgmt.planmgmtDeptList.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000006036', // 평가결과는 최소 1건 이상 등록되어있어야 합니다.
          type: 'warning', // success / info / warning / error
        });
        return false;
      } else if (leaderFlag === false) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000006037', // 평가리더가 지정되지 않았습니다. 평가팀을 확인해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      } else {
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321',
                message: 'L0000005880', // 입력 완료하시겠습니까?
                type: 'info',
                confirmCallback: () => {
                  this.nextUpdateFlag = true;
                  this.nextInsertFlag = true;

                  this.Planmgmt.updateUserId = this.$store.getters.token;
                  this.Planmgmt.updateDeptNm = this.$store.getters.deptNm;
                  this.Planmgmt.updateDeptCd = this.$store.getters.deptCd;
                  this.Planmgmt.updatePositionCd =
                    this.$store.getters.positionCd;
                  this.Planmgmt.updatePositionNm =
                    this.$store.getters.positionNm;

                  this.isComplete = true;
                },
              });
            }
          })
          .catch(() => {
            window.getApp.$emit('APP_VALID_ERROR', 'M0000000881');
          });
      }
    },
    nextUpdate() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000636', // 평가결과를 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.nextUpdateFlag = true;
                this.nextInsertFlag = true;

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
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000881');
        });
    },
    btnApprClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'L0000005899', // 결재완료되었습니다.
        type: 'success', // success / info / warning / error
      });

      this.isEdit = false;
      this.isAppr = false;
      this.updateMode = true;
      this.nextInsertFlag = false;
      this.nextUpdateFlag = false;
      this.saveAttach();
      // this.getDetail();
      this.deptReLoad = !this.deptReLoad;
      this.Planmgmt.assessNm = this.tempName;
      this.closePopup();
    },
    btnSaveClickedCallback2(result) {
      this.isEdit = false;
      this.isAppr = false;
      this.updateMode = true;
      this.nextInsertFlag = false;
      this.nextUpdateFlag = false;
      this.saveAttach();
      // this.getDetail();
      this.deptReLoad = !this.deptReLoad;
      // this.Planmgmt.assessNm = this.tempName
    },
    btnCompleteClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'L0000005881', // 입력 완료되었습니다.
        type: 'success', // success / info / warning / error
      });

      this.isComplete = false;
      this.updateMode = true;
      this.nextInsertFlag = false;
      this.nextUpdateFlag = false;
      this.saveAttach();
      this.getDetail();
      this.deptReLoad = !this.deptReLoad;
      // this.Planmgmt.assessNm = this.tempName
    },
    btnSaveClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });

      this.isEdit = false;
      this.updateMode = true;
      this.nextInsertFlag = false;
      this.nextUpdateFlag = false;
      this.saveAttach();
      // this.getDetail();
      this.deptReLoad = !this.deptReLoad;
      // this.Planmgmt.assessNm = this.tempName
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
      // this.getDetail();
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

    btnClickedErrorCallback(result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', result);
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    setAttachFileGrps() {
      let taskKey = this.Planmgmt.assessRsltNo
        ? this.Planmgmt.assessRsltNo
        : ''; // 현 모델 키 값

      this.attachFileGrps = [
        {
          label: 'L0000003030',
          drag: this.editable,
          showFileSearch: false,
          editable: this.editable,
          disabled: !this.editable,
          uploadTempFiles: null,
          taskClassNm: 'RSA_RSLTMGMT', // 현 화면의 첨부파일 키 값
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
        item.taskKey = this.Planmgmt.assessRsltNo;
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
                apprBizCd: 'RS-HP-02',
                apprParams: {
                  assessRsltNo: this.Planmgmt.assessRsltNo,
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
    btnSearchUserClicked() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.Planmgmt.plantCd,
        deptCd: this.Planmgmt.deptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.Planmgmt.userNm = data.user.userNm;
        this.Planmgmt.userId = data.user.userId;
      }
    },
    clear() {
      this.Planmgmt.userId = null;
      this.Planmgmt.userNm = null;
    },
  },
};
</script>
