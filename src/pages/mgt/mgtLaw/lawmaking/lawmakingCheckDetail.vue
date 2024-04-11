/* eslint-disable no-inner-declarations */
<!--
  목적 : 경영 > 게시판 > 게시판 등록/수정
  작성자 : ksw
  Detail : 게시판 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 게시판 등록/수정 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 검토요청내용 작성 -->
            <y-label label="L0000004243" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="editable && disableObject.disabled2 && !disableObject.disabled3 && lawMakingCheck.bizApprStepCd !== 'BAPSD' && isAppr"
                title="L0000003418"
                color="black"
                @btnClicked="beforeConfirm"
              />
              <!-- 검토요청 -->
              <y-btn
                v-if="editable && popupParam.lmcSeqNo > 0 && !disableObject.disabled1"
                :action-url="saveUrl"
                :param="lawMakingCheck"
                :is-submit="isRqst"
                title="L0000004244"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeRqst"
                @beforeRqst="beforeRqst"
                @btnClicked="btnRqstClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && !disableObject.disabled1"
                :action-url="saveUrl"
                :param="lawMakingCheck"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- <y-btn
                v-if="this.popupParam.lmcSeqNo && editable"
                title="삭제"
                color="red"
                @btnClicked="deleteCommunication"
              /> -->
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 등록일 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000973"
                name="createDt"
                v-model="lawMakingCheck.createDt"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 등록자 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000976"
                name="createUserNm"
                v-model="lawMakingCheck.createUserNm"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 법규 -->
              <y-text
                :width="10"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000001205"
                name="isNm"
                v-model="lawMakingCheck.isNm"
              ></y-text>
            </b-col>
            <!-- 법령안 다운로드, 법규내용요약 추가 2021.04.22 jkl -->
            <b-col sm="2" md lg="2" xl="2" class="col-xxl-2">
              <!-- 법령안 -->
              <y-label label="L0000001208" />
            </b-col>
            <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10 mb-2">
              <!-- 다운로드 -->
              <y-btn
                title="L0000004245"
                color="blue"
                @btnClicked="fileDown"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 법규내용요약 -->
              <y-textarea
                :width="10"
                :maxlength="1000"
                :editable="editable"
                :disabled="disableObject.disabled1"
                ui="bootstrap"
                label="L0000004246"
                name="summary"
                v-model="lawMakingCheck.summary"
              ></y-textarea>
            </b-col>
            <!-- /법령안 다운로드, 법규내용요약 추가 2021.04.22 jkl -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 검토요청 제목 -->
              <y-text
                :width="10"
                :editable="editable"
                :disabled="disableObject.disabled1"
                ui="bootstrap"
                label="L0000000384"
                name="title"
                :maxlength="100"
                :required="true"
                v-model="lawMakingCheck.checkRqstTitle"
                v-validate="'required'"
                :state="validateState('checkRqstTitle')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 검토부서 -->
                  <y-label label="L0000004247" :required="true" />
                </b-col>
                <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10 mb-3" style="max-height:300px;overflow-y:auto;overflow-x:hidden">
                  <!-- 부서 추가 / L0000001300-->
                  <y-tag-structure
                    :width="12"
                    :editable="editable"
                    :disabled="disableObject.disabled1"
                    itemText="checkDeptNm"
                    itemValue="checkDeptCd"
                    :newLabelText="$comm.getLangSpecInfoLabel('L0000001300')"
                    v-model="lawMakingCheck.lawMakingCheckDepts"
                    name="lawMakingCheckDepts"
                    v-validate="'required'"
                    :state="validateState('lawMakingCheckDepts')"
                    @customNewTag="customNewTag"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 검토요청 내용 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="disableObject.disabled1"
                :maxlength="1000"
                ui="bootstrap"
                label="L0000004248"
                name="checkRqstDesc"
                v-model="lawMakingCheck.checkRqstDesc"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <b-row>
      <b-col sm="12">
        <el-tabs type="border-card" v-model="tabIndex">
          <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ item.title }}
            </span>
          </el-tab-pane>
          <keep-alive>
            <component
              :is="component"
              v-if="component"
              :lawmakingCheck.sync="lawMakingCheck"
              sm="12"
              :disableObject="disableObject"
              :submitObject="submitObject"
              :attachFileGrps="attachFileGrps"
              :saveAttachFiles="saveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @refresh="getDetail"
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
  /** attributes: name, components, props, data **/
  name: 'lawmaking-check-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        seqNo: 0,
        lmcSeqNo: 0,
        step: '',
      },
    },
  },
  data() {
    return {
      lawMakingCheck: {
        seqNo: 0,
        lmcSeqNo: 0,
        isNm: '',
        detailUrl: '',
        checkStepCd: null,
        checkRqstTitle: null,
        checkRqstDesc: null,
        summary: null,
        bizApprStepCd: '',
        createDt: null,
        createUserId: null,
        updateUserId: null,
        createUserNm: null,
        lawMakingCheckDepts: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '70%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: true,
      disableObject: {
        disabled1: false, // 검토요청내용 disabled
        disabled2: false, // 검토자 등록 disabled
        disabled3: false, // 검토의견 등록 disabled
      },
      tabIndex: 0,
      tabItems: [],
      // 첨부 파일
      submitObject: {
        submitCheck: false
      },
      saveAttachFiles: [],
      attachFileGrps: [],

      component: null,
      saveUrl: '',
      // deleteUrl: '',
      isRqst: false,
      isSave: false,
      actionType: 'POST',
    }
  },
  computed: {
    /**
     * 2022.02.22 LHJ
     * 부서별 검토자의 검토가 모두 완료된 이후에 결재요청버튼 활성화 (결재요청 권한 있는 경우에만)
     */
    isAppr() {
      // 부서별 검토자의 의견작성이 완료되지 않은 건 filtering
      let noFinishDepts = this.lawMakingCheck.lawMakingCheckDepts.filter(dept => dept.finishYn !== 'Y');
      // 사업장 안전담당자(1021), 사업장 보건담당자(1022), 사업장 환경담당자(1024), 시스템관리자(1090), 협력사개발(1095)일 경우 결재요청 권한 부여
      let authGrps = this.$store.getters.userAuthGrps.filter(auth => auth.settingYn === 'Y');
      let validAppr = this.$_.findIndex(authGrps, grp => {
        return this.$_.indexOf(['1021', '1022', '1024', '1090', '1095'], grp.authGrpNo) > -1;
      });

      return !noFinishDepts.length && this.lawMakingCheck.checkStepCd === 'LMCS3' && validAppr > -1;
    },
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
    this.loadComponent();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.detailUrl = selectConfig.lawMakingCheck.get.url;
      this.insertUrl = transactionConfig.mgt.mgtLaw.lawMakingCheck.insert.url;
      this.editUrl = transactionConfig.mgt.mgtLaw.lawMakingCheck.edit.url;
      // this.deleteUrl = transactionConfig.mgt.mgtLaw.lawMakingCheck.delete.url;

      // { title: '검토자', url: './selectLawmakingChecker.vue' },
      this.tabItems = [{ title: this.$comm.getLangSpecInfoLabel('L0000002843'), url: 'multiFileUpload' }] /* 첨부파일 */
    
      this.getDetail();
    },
    getDetail() {
      this.$http.url = this.detailUrl
      this.$http.param = {
        lmcSeqNo: this.popupParam.lmcSeqNo,
        seqNo: this.popupParam.seqNo,
        createUserId: this.$store.getters.token,
      };
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.lawMakingCheck = _result.data
          if (!this.lawMakingCheck.lmcSeqNo) {
            this.lawMakingCheck.createUserNm = this.$store.getters.name;
            this.lawMakingCheck.createDt = this.$comm
              .moment(this.$comm.getToday())
              .format('YYYY-MM-DD');
          } else {
            this.lawMakingCheck.createDt = this.$comm
              .moment(this.lawMakingCheck.createDt)
              .format('YYYY-MM-DD');
          }

          if (this.popupParam.step === 'REVIEW' && this.lawMakingCheck.checkStepCd === 'LMCS2') {
            this.popupParam.step = 'DESIGNATION';
          }
          if (this.popupParam.step === 'DESIGNATION' && this.lawMakingCheck.checkStepCd === 'LMCS3') {
            this.popupParam.step = 'OPINION';
          }

          this.stepBystep();
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    stepBystep() {
      if (this.lawMakingCheck.checkStepCd === 'LMCS2') {
        this.disableObject.disabled1 = true;
        /**
         * 검토부서에서 검토자를 지정
         */
        if (this.tabItems.length === 2) {
          this.tabItems.splice(0, 1);
        }
        this.tabItems.splice(0, 0, { title: this.$comm.getLangSpecInfoLabel('L0000004249'), url: './selectLawmakingChecker' }) /* 검토자 */
        this.component = () => import('./selectLawmakingChecker');
        this.tabIndex = '0';
      } else if (this.lawMakingCheck.checkStepCd === 'LMCS3') {
        this.disableObject.disabled1 = true;
        this.disableObject.disabled2 = true;
        /**
         * 검토자가 의견을 입력
         */
        if (this.tabItems.length === 2) {
          this.tabItems.splice(0, 1);
        }
        this.tabItems.splice(0, 0, { title: this.$comm.getLangSpecInfoLabel('L0000004250'), url: './selectLawmakingChecker' }) /* 검토자 의견 */
        this.component = () => import('./selectLawmakingChecker');
        this.tabIndex = '0';
      } else if (this.lawMakingCheck.checkStepCd === 'LMCS4') {
        this.disableObject.disabled1 = true;
        this.disableObject.disabled2 = true;
        this.disableObject.disabled3 = true;
        /**
         * 검토 완료
         */
        if (this.tabItems.length === 2) {
          this.tabItems.splice(0, 1);
        }
        this.tabItems.splice(0, 0, { title: this.$comm.getLangSpecInfoLabel('L0000004250'), url: './selectLawmakingChecker' }) /* 검토자 의견 */
        this.component = () => import('./selectLawmakingChecker');
        this.tabIndex = '0';
      } else {
        //
      }

      if (this.popupParam.step === 'REVIEW' && this.lawMakingCheck.checkStepCd && this.lawMakingCheck.checkStepCd !== 'LMCS1') {
        this.disableObject.disabled1 = true;
        this.disableObject.disabled2 = true;
        this.disableObject.disabled3 = true;
      } else if (this.popupParam.step === 'DESIGNATION' && this.lawMakingCheck.checkStepCd && this.lawMakingCheck.checkStepCd !== 'LMCS2') {
        this.disableObject.disabled1 = true;
        this.disableObject.disabled2 = true;
        this.disableObject.disabled3 = true;
      } else if (this.popupParam.step === 'OPINION' && this.lawMakingCheck.checkStepCd && this.lawMakingCheck.checkStepCd !== 'LMCS3') {
        this.disableObject.disabled1 = true;
        this.disableObject.disabled2 = true;
        this.disableObject.disabled3 = true;
      }

      if (this.lawMakingCheck.bizApprStepCd === 'BAPSA') {
        this.disableObject.disabled3 = true;
      }

      // 첨부파일 셋팅
      this.setAttachFileGrps();
    },
    // 첨부파일 관련 메서드
    setAttachFileGrps() {
      let taskKey = this.popupParam.lmcSeqNo
        ? this.popupParam.lmcSeqNo.toString()
        : '';
      this.attachFileGrps = [
        {
          uploadTempFiles: null,
          taskClassNm: 'LAW_MAKING_CHECK',
          taskKey: taskKey,
          drag: false,
          showFileSearch: this.editable && !this.disableObject.disabled3,
          editable: this.editable && !this.disableObject.disabled3,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    fileDown() {
      let link = document.createElement('a');
      link.href = this.lawMakingCheck.fileDownLink.includes('https:') ? this.lawMakingCheck.fileDownLink.replace('https:', '') : this.lawMakingCheck.fileDownLink.replace('http:', '');
      link.download = this.lawMakingCheck.fileName;
      link.click();
    },
    // 탭
    loadComponent() {
      var path = this.tabItems[this.$_.parseInt(this.tabIndex)].url;
      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else {
        this.component = () => import(`${path}`);
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
    beforeSave() {
      if (this.popupParam.lmcSeqNo > 0) {
        this.saveUrl = this.editUrl;
        this.actionType = 'PUT';
      } else {
        this.saveUrl = this.insertUrl;
        this.actionType = 'POST';
      }
      this.saveCheckResult(this.$comm.getLangSpecInfoLabel('L0000002474')); /* 저장 */
    },
    beforeRqst() {
      this.saveUrl = this.editUrl;
      this.saveCheckResult(this.$comm.getLangSpecInfoLabel('L0000004244')); /* 검토요청 */
    },
    saveCheckResult(alertTitle) {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', /* 확인 */
              message: alertTitle + 'M0000000097', /* 하시겠습니까? */
              type: 'info',
              confirmCallback: () => {
                this.lawMakingCheck.createUserId = this.$store.getters.token;
                this.lawMakingCheck.updateUserNm = this.$store.getters.token;
                if (alertTitle === 'L0000002474') { /* 저장 */
                  this.isSave = true;
                } else if (alertTitle === 'L0000004244') { /* 검토요청 */
                  this.lawMakingCheck.checkStepCd = 'LMCS2';
                  this.isRqst = true;
                }
              },
              cancelCallback: () => {
                this.isSave = false;
                this.isRqst = false;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check('lawmakingCheckDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          this.isSave = false;
          this.isRqst = false;
          this.lawMakingCheck.checkStepCd = 'LMCS1';
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    btnRqstClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', /* 안내 */
        message: 'M0000000098', /* 검토요청되었습니다. */
        type: 'success', // success / info / warning / error
      });
      this.isRqst = false;
      this.getDetail();
      this.saveAttach();
    },
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', /* 안내 */
        message: 'M0000000006', /* 저장되었습니다. */
        type: 'success', // success / info / warning / error
      });
      this.isSave = false;

      if (!this.popupParam.lmcSeqNo) {
        this.popupParam.lmcSeqNo = _result.data;
      }
      this.saveAttach();
      this.getDetail();
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      this.isRqst = false;
      this.lawMakingCheck.checkStepCd = 'LMCS1';
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
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
      this.$_.forEach(this.attachFileGrps, item => {
        item.taskKey = this.popupParam.lmcSeqNo;
      });
      // 저장할 데이터가 있는 경우

      if (this.saveAttachFiles.length > 0) {
        this.submitObject.submitCheck = !this.submitObject.submitCheck;
      }
    },
    beforeConfirm() {
      // 검토자가 의견을 다 기입한 후 완료 하였을 경우 결재 진행
      let check = true;
      this.$_.forEach(this.lawMakingCheck.lawMakingCheckDepts, item => {
        let filterData = this.$_.filter(item.lawMakingCheckers, { finishYn: 'N' });
        if (filterData && filterData.length > 0) {
          check = false;
          return false;
        }
      });

      if (check) {
        this.popupOptions.target = () =>
          import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
        this.popupOptions.title = 'L0000003418'; /* 결재요청 */
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeApprPop;
        this.popupOptions.width = '80%';
        this.popupOptions.param = {
          apprBizCd: 'MG-LM-01',
          apprParams: {
            lmcSeqNo: this.popupParam.lmcSeqNo,
            seqNo: this.popupParam.seqNo,
          },
        };
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', /* 안내 */
          message: 'M0000000579', /* 완료하지 않은 검토자가 있습니다. */
          type: 'warning', // success / info / warning / error
        });
      }
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
    },
    customNewTag() {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000001287'; /* 부서 */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        plantCd: this.lawMakingCheck.plantCd,
        multiple: true,
      };
      this.popupOptions.width = '35%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closeDeptPopup;
    },
    closeDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE') {
        if (!this.lawMakingCheck.lawMakingCheckDepts) {
          this.lawMakingCheck.lawMakingCheckDepts = [];
        }
        this.$_.forEach(data, (item) => {
          if (item.deptCd) {
            if (
              this.$_.findIndex(this.lawMakingCheck.lawMakingCheckDepts, {
                deptCd: item.deptCd
              }) === -1
            ) {
              item.checkDeptCd = item.deptCd;
              item.checkDeptNm = '[' + item.plantNm + '] ' + item.deptNm;
              this.lawMakingCheck.lawMakingCheckDepts.push(item);
            }
          }
        });
      }
    },
    closePopup() {
      this.$emit('closePopup');
    },
  },
};
</script>