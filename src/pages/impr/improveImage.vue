<!--
  목적 : 개선 전/후 사진
  Detail : 개선사항 전, 후 사진 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <!-- 개선 전/후 사진 -->
        <y-label label="L0000000250" icon="user-edit" color-class="cutstom-title-color" />
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <y-file-upload
          ref="fileuploadBefore"
          :attach-file-grp="attachFileGrpBefore"
          :label="attachFileGrpBefore.label"
          :showUploadBtn="attachFileGrpBefore.showUploadBtn"
          :drag="attachFileGrpBefore.drag"
          :showFileSearch="false"
          :editable="editable"
          :multiple="true"
          :limit="5"
          :close="true"
          :onlyDownload="false"
          :disabled="attachFileGrpAfter.disabled"
          :uploadTempFiles="attachFileGrpBefore.uploadTempFiles"
          @uploadFiles="safetyPlanUploadFiles"
          @setDeleteTempFileData="setDeleteTempFileData"
        ></y-file-upload>
      </b-col>
      <b-col sm="6">
        <y-file-upload
          ref="fileuploadAfter"
          :attach-file-grp="attachFileGrpAfter"
          :label="attachFileGrpAfter.label"
          :showUploadBtn="attachFileGrpAfter.showUploadBtn"
          :drag="attachFileGrpAfter.drag"
          :showFileSearch="false"
          :editable="editable"
          :multiple="true"
          :limit="5"
          :close="true"
          :onlyDownload="false"
          :disabled="attachFileGrpAfter.disabled"
          :uploadTempFiles="attachFileGrpBefore.uploadTempFiles"
          @uploadFiles="safetyPlanUploadFiles"
          @setDeleteTempFileData="setDeleteTempFileData"
        ></y-file-upload>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'improve-image',
  props: {
    a: {
      type: Object,
      default: function() {
        return {
          submitCheckAB: false,
        };
      },
    },
    imprAct: {
      type: Object,
      default: function() {
        return {
          safImprActNo: '',
          imprClassCd: '',
          actClassCd: '',
          imprRqstYmd: '',
          imprTitle: '',
          imprRqstDeptCd: '',
          imprRqstDeptNm: '',
          imprRqstUserId: '',
          imprRqstUserNm: '',
          imprRqstContents: '',
          imprStepCd: '',
          refTable: '',
          refTableId: '',
          actSchYmd: '',
          actConfirmYmd: '',
          actLimitYmd: '',
          actDeptCd: '',
          actDeptNm: '',
          actUserId: '',
          actUserNm: '',
          actResultContents: '',
          actResultReview: '',
          createUserId: '',
          createDt: '',
          updateUserId: '',
          updateDt: '',
          flag: '',
        };
      },
    },
  },
  data() {
    return {
      editable: true,
      attachFileGrpBefore: {
        taskClassNm: '',
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
        drag: true,
        label: 'L0000000274', // 개선전 사진
        uploadTempFiles: null,
        disabled: false,
      },
      attachFileGrpAfter: {
        taskClassNm: '',
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
        drag: true,
        label: 'L0000000285', // 개선후 사진
        uploadTempFiles: null,
        disabled: false,
      },
      tempDeleteFiles: [],
    };
  },
  watch: {
    'a.submitCheckAB': {
      handler: function(val, oldVal) {
        if (val) {
          this.saveAttach();
        }
      },
      deep: true,
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  updated() {},
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.attachFileGrpBefore.taskClassNm = 'ACCTION_BEFORE';
      this.attachFileGrpBefore.taskKey = this.imprAct.safImprActNo.toString();
      this.attachFileGrpBefore.createUserId = this.$store.getters.token;
      this.attachFileGrpBefore.label = 'L0000000274'; // 개선전 사진

      this.attachFileGrpAfter.taskClassNm = 'ACCTION_AFTER';
      this.attachFileGrpAfter.taskKey = this.imprAct.safImprActNo.toString();
      this.attachFileGrpAfter.createUserId = this.$store.getters.token;
      this.attachFileGrpAfter.label = 'L0000000285'; // 개선후 사진

      if (this.imprAct.flag !== 'IMPROVE') {
        this.attachFileGrpBefore.disabled = true;
        this.attachFileGrpAfter.disabled = true;
      }
    },
    safetyPlanUploadFiles(data, taskClassNm, attachFileGrp) {
      let inputData = {
        data: data,
      };

      if (this.attachFileGrpBefore.taskClassNm === taskClassNm) {
        this.attachFileGrpBefore.uploadTempFiles = inputData;
        this.$emit('setSaveFile', this.attachFileGrpBefore.uploadTempFiles);
      } else if (this.attachFileGrpAfter.taskClassNm === taskClassNm) {
        this.attachFileGrpAfter.uploadTempFiles = inputData;
        this.$emit('setSaveFile', this.attachFileGrpAfter.uploadTempFiles);
      }
    },
    setDeleteTempFileData(data) {
      var pushData = {
        fileNo: data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
      this.$emit('setDeleteFile', this.tempDeleteFiles);
      // this.$emit('refWorkAttach');
    },
    saveAttach() {
      this.$refs['fileuploadBefore'].submitUpload();
      this.$refs['fileuploadAfter'].submitUpload();
      // task_key 를 셋팅한다.
      if (this.tempDeleteFiles && this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        this.$http.request(_result => {
          this.tempDeleteFiles = [];
          this.$emit('closePopup', { beforeAfterComplete: true });
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        });
      } else {
        this.$emit('closePopup', { beforeAfterComplete: true });
      }
    },
  },
};
</script>

<style>
</style>
