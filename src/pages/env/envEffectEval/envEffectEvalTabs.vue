<!--
  목적 : 환경 > 환경영향평가 > 환경영향평가 목록 > 등록/수정/조회 페이지 > 대상여부확인탭
  Detail : 대상여부확인탭
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mb-1 mr-2">
          <!-- 저장 -->
          <y-btn
            v-if="!evalComplete && this.editable && !this.popupParam.popupMode"
            :action-url="requestUrl"
            :param="envEffectEval"
            :is-submit="isSave"
            title="L0000002474"
            color="orange"
            action-type="PUT"
            beforeSubmit="beforeSave"
            @beforeSave="beforeSave"
            @btnClicked="btnSaveClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!--  삭제 -->
          <y-btn
            v-if="!evalComplete && this.editable && !this.popupParam.popupMode"
            title="L0000001495"
            color="red"
            @btnClicked="btnDeleteClickedCallback"
          />
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
          <y-textarea
            :width="11"
            :editable="!evalComplete && editable"
            :maxlength="2000"
            ui="bootstrap"
            label="L0000004740"
            v-model="tabDetail"
          ></y-textarea>
          <el-divider content-position="left">{{
            $comm.getLangSpecInfoLabel('L0000002843')
          }}</el-divider>
          <component
            :is="attach"
            v-if="attach"
            :submitCheck="submitCheck"
            :attachFileGrps="attachFileGrps"
            :saveAttachFiles="saveAttachFiles"
            @changeUploadFiles="changeUploadFiles"
            @setTempDeleteFiles="setTempDeleteFiles"
          />
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'env-effect-eval-tabs',
  props: {
    popupMode: false,
    envEffectEval: {
      type: Object,
      default: {
        envEffectEvalNo: 0,
      },
    },
    evalComplete1: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    popupParam: {
      type: Object,
      default: {
        envEffectEvalNo: 0, // 번호
      },
    },
    tabParam: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    envEffectEvals: {
      envEffectEvalNo: 0,
      plantCd: '',
      deptCd: '',
      deptNm: '',
      evalGubun: '',
      evalProgState: '',
      evalProgStateCd: '',
      evalStepCd: '',
      proxyVendorCd: '',
      proxyVendorNm: '',
      proxyYn: '',
      businessName: '',
      businessStartDt: '',
      businessEndDt: '',
      businessContents: '',
      objectConfirmContent: '',
      evalPrepCont: '',
      evalDeterCont: '',
      draftCont: '',
      draftNoticeCont: '',
      residentOpnAccept: '',
      residentExplCont: '',
      residentHearCont: '',
      evalAgendaReflect: '',
      evalAgendaDiscuss: '',
      evalAgendaWrite: '',
      createUserId: '',
      createDt: '',
      updateUserId: '',
      updateDt: '',
      writerUserNm: '',
      writerDt: '',
      period: [],
      tabParam: '0',
    },
    tabDetail: '',

    requestUrl: '',

    isSave: false,

    editable: false,

    attach: null, // 첨부파일컴포넌트
    attachFileGrp: {
      taskClassNm: '',
      taskKey: '',
      createUserId: '',
      showUploadBtn: true,
      editable: true,
      multiple: true,
      drag: true,
      label: '',
    },
    submitCheck: false,
    saveAttachFiles: [],
    tempDeleteFiles: [],
    attachFileGrps: [],
  }),
  computed: {
    evalComplete: function () {
      return this.envEffectEval.evalProgStateCd === '2';
    },
  },
  watch: {
    evalComplete: 'setAttachFileGrps',
    tabParam(newVal, oldVal) {
      switch (this.tabParam) {
        case 0:
          this.tabDetail = this.envEffectEval.objectConfirmContent;
          break;
        case 1:
          this.tabDetail = this.envEffectEval.evalPrepCont;
          break;
        case 2:
          this.tabDetail = this.envEffectEval.evalDeterCont;
          break;
        case 3:
          this.tabDetail = this.envEffectEval.draftCont;
          break;
        case 4:
          this.tabDetail = this.envEffectEval.draftNoticeCont;
          break;
        case 5:
          this.tabDetail = this.envEffectEval.residentOpnAccept;
          break;
        case 6:
          this.tabDetail = this.envEffectEval.residentExplCont;
          break;
        case 7:
          this.tabDetail = this.envEffectEval.residentHearCont;
          break;
        case 8:
          this.tabDetail = this.envEffectEval.evalAgendaWrite;
          break;
        case 9:
          this.tabDetail = this.envEffectEval.evalAgendaDiscuss;
          break;
        default:
          this.tabDetail = this.envEffectEval.evalAgendaReflect;
          break;
      }
      this.setAttachFileGrps();
    },
    tabDetail() {
      this.updateContent();
    },
  },
  beforeMount() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      switch (this.tabParam) {
        case 0:
          this.tabDetail = this.envEffectEval.objectConfirmContent;
          break;
        case 1:
          this.tabDetail = this.envEffectEval.evalPrepCont;
          break;
        case 2:
          this.tabDetail = this.envEffectEval.evalDeterCont;
          break;
        case 3:
          this.tabDetail = this.envEffectEval.draftCont;
          break;
        case 4:
          this.tabDetail = this.envEffectEval.draftNoticeCont;
          break;
        case 5:
          this.tabDetail = this.envEffectEval.residentOpnAccept;
          break;
        case 6:
          this.tabDetail = this.envEffectEval.residentExplCont;
          break;
        case 7:
          this.tabDetail = this.envEffectEval.residentHearCont;
          break;
        case 8:
          this.tabDetail = this.envEffectEval.evalAgendaWrite;
          break;
        case 9:
          this.tabDetail = this.envEffectEval.evalAgendaDiscuss;
          break;
        default:
          this.tabDetail = this.envEffectEval.evalAgendaReflect;
          break;
      }

      this.requestUrl =
        transactionConfig.env.envEffectEval.envEffectEval.editTabInfo.url;

      if (this.tabParam === '0') {
        document.getElementById('tab-0').click();
      }

      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps();
    },
    beforeSave() {
      if (this.tabParam === '0') {
        this.envEffectEval.objectConfirmContent = this.tabDetail;
      }

      if (this.tabParam === '1') {
        this.envEffectEval.evalPrepCont = this.tabDetail;
      }
      if (this.tabParam === '2') {
        this.envEffectEval.evalDeterCont = this.tabDetail;
      }
      if (this.tabParam === '3') {
        this.envEffectEval.draftCont = this.tabDetail;
      }
      if (this.tabParam === '4') {
        this.envEffectEval.draftNoticeCont = this.tabDetail;
      }
      if (this.tabParam === '5') {
        this.envEffectEval.residentOpnAccept = this.tabDetail;
      }
      if (this.tabParam === '6') {
        this.envEffectEval.residentExplCont = this.tabDetail;
      }
      if (this.tabParam === '7') {
        this.envEffectEval.residentHearCont = this.tabDetail;
      }
      if (this.tabParam === '8') {
        this.envEffectEval.evalAgendaWrite = this.tabDetail;
      }
      if (this.tabParam === '9') {
        this.envEffectEval.evalAgendaDiscuss = this.tabDetail;
      }
      if (this.tabParam === '10') {
        this.envEffectEval.evalAgendaReflect = this.tabDetail;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: this.$comm.getLangSpecInfoMessage('M0000000011'), // 저장하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.envEffectEval.updateUserId = this.$store.getters.token;
          this.envEffectEval.tabParam = this.tabParam;
          this.isSave = true;
        },
        // 취소 callback 함수
        cancelCallback: () => {
          this.isSave = false;
        },
      });
    },
    btnSaveClickedCallback() {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.isSave = false;
      window.getApp.$emit('getEnvEffectEvalDetail');
    },
    btnClickedErrorCallback() {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR');
    },
    btnDeleteClickedCallback() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.envEffectEval.updateUserId = this.$store.getters.token;
          this.envEffectEval.tabParam = this.tabParam;

          if (this.tabParam === '0') {
            this.envEffectEval.objectConfirmContent = null;
          }
          if (this.tabParam === '1') this.envEffectEval.evalPrepCont = null;
          if (this.tabParam === '2') this.envEffectEval.evalDeterCont = null;
          if (this.tabParam === '3') this.envEffectEval.draftCont = null;
          if (this.tabParam === '4') this.envEffectEval.draftNoticeCont = null;
          if (this.tabParam === '5') {
            this.envEffectEval.residentOpnAccept = null;
          }

          if (this.tabParam === '6') this.envEffectEval.residentExplCont = null;
          if (this.tabParam === '7') this.envEffectEval.residentHearCont = null;
          if (this.tabParam === '8') this.envEffectEval.evalAgendaWrite = null;
          if (this.tabParam === '9') {
            this.envEffectEval.evalAgendaDiscuss = null;
          }

          if (this.tabParam === '10') {
            this.envEffectEval.evalAgendaReflect = null;
          }

          this.$http.url = this.requestUrl;
          this.$http.param = this.envEffectEval;
          this.$http.type = 'PUT';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // '삭제되었습니다.',
                type: 'success',
              });
              this.tabDetail = '';
              window.getApp.$emit('getEnvEffectEvalDetail');

              let taskClassNm = '';

              switch (this.tabParam) {
                case 0:
                  taskClassNm = 'ENV_OBJECT_CONFIRM_CONTENT';
                  break;
                case 1:
                  taskClassNm = 'ENV_EVAL_PREP_CONT';
                  break;
                case 2:
                  taskClassNm = 'ENV_EVAL_DETER_CONT';
                  break;
                case 3:
                  taskClassNm = 'ENV_DRAFT_CONT';
                  break;
                case 4:
                  taskClassNm = 'ENV_DRAFT_NOTICE_CONT';
                  break;
                case 5:
                  taskClassNm = 'ENV_RESIDENT_OPN_ACCEPT';
                  break;
                case 6:
                  taskClassNm = 'ENV_RESIDENT_EXPL_CONT';
                  break;
                case 7:
                  taskClassNm = 'ENV_RESIDENT_HEAR_CONT';
                  break;
                case 8:
                  taskClassNm = 'ENV_EVAL_AGENDA_REFLECT';
                  break;
                case 9:
                  taskClassNm = 'ENV_EVAL_AGENDA_DISCUSS';
                  break;
                default:
                  taskClassNm = 'ENV_EVAL_AGENDA_WRITE';
                  break;
              }

              this.$http.url = this.$format(
                transactionConfig.attachFile.deleteAllDocu.url,
                taskClassNm,
                this.envEffectEval.envEffectEvalNo
              );
              this.$http.type = 'DELETE';
              this.$http.request(
                (_result) => {
                  this.setAttachFileGrps();
                },
                (_error) => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                }
              );
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
    setAttachFileGrps() {
      let taskKey = '';
      if (this.popupParam.envEffectEvalNo) {
        taskKey = this.popupParam.envEffectEvalNo.toString();
      } else if (this.envEffectEval.envEffectEvalNo) {
        taskKey = this.envEffectEval.envEffectEvalNo.toString();
      }

      let taskClassNm = '';

      switch (this.tabParam) {
        case 0:
          taskClassNm = 'ENV_OBJECT_CONFIRM_CONTENT';
          break;
        case 1:
          taskClassNm = 'ENV_EVAL_PREP_CONT';
          break;
        case 2:
          taskClassNm = 'ENV_EVAL_DETER_CONT';
          break;
        case 3:
          taskClassNm = 'ENV_DRAFT_CONT';
          break;
        case 4:
          taskClassNm = 'ENV_DRAFT_NOTICE_CONT';
          break;
        case 5:
          taskClassNm = 'ENV_RESIDENT_OPN_ACCEPT';
          break;
        case 6:
          taskClassNm = 'ENV_RESIDENT_EXPL_CONT';
          break;
        case 7:
          taskClassNm = 'ENV_RESIDENT_HEAR_CONT';
          break;
        case 8:
          taskClassNm = 'ENV_EVAL_AGENDA_REFLECT';
          break;
        case 9:
          taskClassNm = 'ENV_EVAL_AGENDA_DISCUSS';
          break;
        default:
          taskClassNm = 'ENV_EVAL_AGENDA_WRITE';
          break;
      }

      this.attachFileGrps = [
        {
          label: 'L0000003030', // 파일업로드
          uploadTempFiles: null,
          taskClassNm: taskClassNm,
          taskKey: taskKey,
          drag: false,
          showFileSearch: !this.evalComplete && this.editable,
          editable: !this.evalComplete && this.editable,
          disabled: false,
          onlyDownload: !this.evalComplete && this.editable,
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
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
    },
    updateContent() {
      window.getApp.$emit('updateEnvEffectEvalContent', [
        this.tabDetail,
        this.tabParam,
      ]);
    },
  },
};
</script>
