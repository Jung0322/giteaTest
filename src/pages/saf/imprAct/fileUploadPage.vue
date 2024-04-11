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
      <b-col sm="12">
        <y-file-upload
          ref="fileupload"
          :label="attachFileGrp.label"
          :showUploadBtn="attachFileGrp.showUploadBtn"
          :drag="attachFileGrp.drag"
          :editable="attachFileGrp.editable"
          :multiple="attachFileGrp.multiple"
          :attach-file-grp="attachFileGrp"
          :close="attachFileGrp.close"
          :message="attachFileGrp.message"
          :limit="attachFileGrp.limit"
          :disabled="attachFileGrp.disabled"
          :onlyDownload="attachFileGrp.onlyDownload"
          :uploadTempFiles="uploadTempFiles"
          @closePopup="closePopup"
          @uploadFiles="uploadFiles"
          @setDeleteTempFileData="setDeleteTempFileData"
          @setDeleteTempFileAll="setDeleteTempFileAll"
        ></y-file-upload>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'file-upload-page',
  props: {
    attachFileGrp: {
      taskClassNm: '',
      taskKey: '',
      createUserId: '',
      showUploadBtn: true,
      editable: true,
      drag: true,
      label: '',
      submitCheck: false,
      close: false,
      message: '',
      limit: 999,
      disabled: false,
      onlyDownload: false,
    },
    multiFileUpload: false,
    paneName: '',
    updateMod: false,
    uploadTempFiles: null,
  },
  data: () => ({}),
  watch: {
    'attachFileGrp.submitCheck': {
      handler: function (val, oldVal) {
        this.$refs.fileupload.submitUpload();
      },
    },
    paneName: function (newValue, oldValue) {
      if (!this.updateMod) this.$refs.fileupload.getUploadedFileList();
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
      this.attachFileGrp.editable = this.$route.meta.editable;
      if (this.attachFileGrp.limit === undefined) {
        this.attachFileGrp.limit = 999;
      }
    },
    getList() {},
    fileUploadComplete() {},
    btnSearchClickedCallback(_result) {},
    btnClickedErrorCallback(_result) {},
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      if (!this.multiFileUpload) {
        if (data !== 'CLOSE') data = this.attachFileGrp;
        this.$emit('closePopup', data);
      } else {
        this.$emit('checkFileUpload', data);
      }
    },
    uploadFiles(data) {
      this.$emit('changeUploadFiles', { data: data });
    },
    setDeleteTempFileData(data) {
      this.$emit('setTempDeleteFiles', { data });
    },
    setDeleteTempFileAll() {
      this.$emit('setDeleteTempFileAll');
    },
  },
};
</script>

<style></style>
