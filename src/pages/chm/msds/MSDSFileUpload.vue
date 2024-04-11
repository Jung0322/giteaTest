<!--
  목적 : 작업허가서 항목 관리
  Detail : 작업허가서 항목 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row class="mt-1">
      <b-col 
        v-for="(attachFileGrp, index) in attachFileGrps"
        :key="index"
        sm="6" class="mb-2">
        <y-file-upload
          :ref="'fileupload' + index"
          :label="attachFileGrp.label"
          :showUploadBtn="false"
          :drag="attachFileGrp.drag"
          :editable="attachFileGrp.editable"
          :multiple="false"
          :attach-file-grp="attachFileGrp"
          :close="true"
          :limit="1"
          :disabled="attachFileGrp.disabled"
          :listType="attachFileGrp.listType"
          :showFileSearch="attachFileGrp.showFileSearch"
          :onlyDownload="true"
          textAlign="left"
          :uploadTempFiles="attachFileGrp.uploadTempFiles"
          @closePopup="closePopup"
          @uploadFiles="uploadFiles"
          @setDeleteTempFileData="setDeleteTempFileData"
        >
        </y-file-upload>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'matCheckRequest-file-upload',
  props: {
    // 파일 정보
    attachFileGrps: {
      type: Array,
    },
    saveAttachFiles: {
      type: Array,
    },
    // updateMod: false,
    submitCheck: false,
    // MSDS 요약 파일
    // attachSummeryMSDSFileGrp: {
    //   taskClassNm: '',
    //   taskKey: '',
    //   createUserId: '',
    //   editable: true,
    //   drag: true,
    //   submitCheck: false,
    //   close: false,
    //   disabled: false,
    // },
    // uploadTempSummeryFiles: {
    //   data: [],
    // },
  },
  data: () => ({
  }),
  watch: {
    // 첨부하기 위해 올린 파일이 있을 경우 파일저장
    'submitCheck': {
      handler: function (val, oldVal) {
        // true
        if (val) {
          if (this.saveAttachFiles.length > 0) {
            // 우선 맨 처음거를 업로드한다.
            // 그런후 맨 처음거가 success를 타고 넘어온다면 다음거를 실행
            this.$refs['fileupload' + this.saveAttachFiles[0].uploadTempFiles.index][0].submitUpload();
          } else {
            // 저장할 데이터가 없으면 창을 닫는다.
            this.$emit('closePopup');
          }
        }
        
        // if (val) this.$refs.fileupload.submitUpload();
        // this.$emit('setSubmitCheckFalse', 'attachMSDSFileGrp');
      },
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  updated () {
  },
  mounted () {
  },
  beforeDestroy () {
  },
  //* methods */
  methods: {
    init () {
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup (data) {
      // 저장이 잘 이루어지게 되면 이곳을 타게 된다.
      //  처음 할 것은 맨처음 데이터를 지운다.
      this.saveAttachFiles.splice(0, 1);
      // 저장할 것이 남았는지 확인한다.
      if (this.saveAttachFiles.length > 0) {
        this.$refs['fileupload' + this.saveAttachFiles[0].uploadTempFiles.index][0].submitUpload();
      } else {
        // 저장할 데이터가 없으면 창을 닫는다.
        this.$emit('closePopup');
      }
    },
    uploadFiles (data, taskClassNm) {
      this.$emit('changeUploadFiles', { data: data, taskClassNm: taskClassNm });
    },
    setDeleteTempFileData (data) {
      this.$emit('setTempDeleteFiles', { data });
    },
  }
};
</script>

<style>

</style>
