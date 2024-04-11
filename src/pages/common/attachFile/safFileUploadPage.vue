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
      <b-col sm="12" class="px-0">
        <y-file-upload
          ref="fileupload"
          :label="safAttachFileGrp.label"
          :showUploadBtn="safAttachFileGrp.showUploadBtn"
          :drag="safAttachFileGrp.drag"
          :editable="safAttachFileGrp.editable"
          :multiple="safAttachFileGrp.multiple"
          :attach-file-grp="safAttachFileGrp"
          :close="safAttachFileGrp.close"
          :message="safAttachFileGrp.message"
          :limit="safAttachFileGrp.limit"
          :disabled="safAttachFileGrp.disabled"
          :onlyDownload="safAttachFileGrp.onlyDownload"
          @closePopup="closePopup"
          @uploadFiles="uploadFiles"
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
  name: 'file-upload-page',
  props: {
    safAttachFileGrp: {
      taskClassNm: '',
      taskKey: '',
      taskFlag: '',
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
  },
  data: () => ({}),
  watch: {
    'safAttachFileGrp.submitCheck': {
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
      this.safAttachFileGrp.editable = this.$route.meta.editable;
      if (this.safAttachFileGrp.limit === undefined) {
        this.safAttachFileGrp.limit = 999;
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
        if (data !== 'CLOSE') data = this.safAttachFileGrp;
        this.$emit('closePopup', data);
      } else {
        this.$emit('checkSafFileUpload', data);
      }
    },
    uploadFiles(data) {
      this.$emit('changeSafUploadFiles', { data: data });
    },
    setDeleteTempFileData(data) {
      this.$emit('setSafTempDeleteFiles', { data });
    },
  },
};
</script>

<style></style>
