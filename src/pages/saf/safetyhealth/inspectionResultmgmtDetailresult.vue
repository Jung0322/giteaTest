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
        <b-card>
          <b-row>
            <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-3">
              <!-- 개선도출건수 -->
              <y-number
                :editable="apprMode"
                :width="8"
                ui="bootstrap"
                label="L0000004991"
                name="afterImprCaseCnt"
                v-model="afterImprCaseCnt"
                :required="true"
                v-validate="'required'"
                :state="validateState('afterImprCaseCnt')"
                :maxlength="10"
              ></y-number>
            </b-col>
            <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-3">
              <!-- 점검일 -->
              <y-datepicker
                :width="8"
                :editable="apprMode"
                ui="bootstrap"
                label="L0000002570"
                name="evalDt"
                :default="evalDt"
                v-model="evalDt"
                :required="true"
                v-validate="'required'"
                :state="validateState('evalDt')"
              />
            </b-col>
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-4"></b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 점검결과요약 -->
              <y-textarea
                :editable="apprMode"
                :width="10"
                ui="bootstrap"
                label="L0000002538"
                name="afterRsltDesc"
                v-model="afterRsltDesc"
                :maxlength="125"
                :required="true"
                v-validate="'required'"
                :state="validateState('afterRsltDesc')"
                :rows="3"
              ></y-textarea>
            </b-col>
          </b-row>
          <b-card>
            <b-row>
              <b-col sm="6">
                <y-file-upload
                  ref="fileuploadBefore"
                  :editable="apprMode"
                  :attach-file-grp="attachFileGrps"
                  :label="attachFileGrps.label"
                  :showUploadBtn="attachFileGrps.showUploadBtn"
                  :showFileSearch="false"
                  :multiple="true"
                  :limit="5"
                  :close="true"
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
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-facility-mst-detail',
  props: {
    inspectionResult: {
      type: Object,
      default: () => ({
        implChkPlanNo: 0,
        implChkDeptNo: 0,
        plantCd: '', // 사업장 코드
        deptCd: '',
        assessYear: '',
        assessTypeCd: '',
        regRegdemCd: '',
        assessNm: '',
        assessDt: null,
        assessStartDt: '',
        assessEndDt: '',
        assessDesc: '',
        rapprRqstNo: 0,
        rapprRqstNm: '',
        assessRsltNo: 0,
        imprCaseCnt: 0,
        evalDt: '',
        rsltDesc: '',
        estimatorInList: [],
        estimatorOutList: [],
      }),
    },
    updateFile: false,
    editable: false,
    apprMode: false,
    EstimatorLoad: false,
  },
  data: () => ({
    afterImprCaseCnt: 0,
    evalDt: '',
    afterRsltDesc: '',
    gridOptions: {
      header: [],
      data: [],
      height: '450',
    },
    attachFileGrps: {
      taskClassNm: 'INSPECTION_RESULT',
      taskKey: '',
      createUserId: '',
      showUploadBtn: false,
      uploadCheck: false,
      label: '파일업로드' /* 파일업로드 */,
      uploadTempFiles: null,
    },
    refresh: false,
    saveAttachFiles: [],
    tempDeleteFiles: [],
    countIndex: 0,
    disabled: false,
  }),
  watch: {
    'inspectionResult.implChkPlanNo': {
      handler: function (oldV, newV) {
        this.attachFileGrps.createUserId = this.$store.getters.token;
        this.attachFileGrps.taskKey = this.inspectionResult.implChkDeptNo;
        this.afterImprCaseCnt = this.inspectionResult.imprCaseCnt;
        this.evalDt = this.inspectionResult.evalDt;
        this.afterRsltDesc = this.inspectionResult.rsltDesc;
      },
      deep: true,
    },
    EstimatorLoad() {
      this.inspectionResult.imprCaseCnt = this.afterImprCaseCnt;
      this.inspectionResult.evalDt = this.evalDt;
      this.inspectionResult.rsltDesc = this.afterRsltDesc;
    },
    updateFile() {
      this.setAttach();
    },
    setAttachFile() {
      this.setAttachFileGrps();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.evalDt = this.$comm.getToday();
    this.init();
  },
  methods: {
    init() {},
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
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
    uploadedList(data) {
      // task_key 를 셋팅한다.

      if (data && data.length > 0) {
        this.$_.forEach(this.attachFileGrps, (item) => {
          item.taskKey = this.inspectionResult.implChkDeptNo;
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
      this.attachFileGrps.taskKey = this.inspectionResult.implChkDeptNo;
      // 저장할 데이터가 있는 경우
      this.$refs['fileuploadBefore'].submitUpload();
    },
    setAttachFileGrps() {
      let taskKey = '';
      taskKey = !this.inspectionResult.implChkDeptNo
        ? ''
        : this.inspectionResult.implChkDeptNo;

      this.attachFileGrps = [
        {
          label: '파일업로드', // 게시판 자료
          uploadTempFiles: null,
          taskClassNm: 'INSPECTION_RESULT',
          taskKey: taskKey,
          disabled: this.apprMode,
          // multiple: true,         // 첨부파일 설정에서 관리
          // listType: 'text',       // 첨부파일 설정에서 관리
          // showFileSearch: false,  // 첨부파일 설정에서 관리
          // taskFlag: '',           // 첨부파일 설정에서 관리
          createUserId: this.$store.getters.token,
        },
      ];
    },
  },
};
</script>
