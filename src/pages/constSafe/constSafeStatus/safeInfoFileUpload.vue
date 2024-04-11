<!--
  목적 : 안전 > 작업허가서 > 공사안전정보 탭
  Detail : 공사안전정보 파일 등록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row class="mt-1">
      <b-col
        v-for="(attachFileGrp, index) in safInfoAttachFileGrps"
        :key="index"
        :sm="safeInfosm"
        class="mb-2"
      >
        <y-file-upload
          :ref="'fileupload' + index"
          :label="attachFileGrp.label"
          :showUploadBtn="false"
          :drag="attachFileGrp.drag"
          :editable="attachFileGrp.editable"
          :multiple="attachFileGrp.multiple"
          :attach-file-grp="attachFileGrp"
          :close="true"
          :limit="attachFileGrp.limit"
          :disabled="attachFileGrp.disabled"
          :listType="attachFileGrp.listType"
          :showFileSearch="attachFileGrp.showFileSearch"
          :onlyDownload="true"
          :uploadTempFiles="attachFileGrp.uploadTempFiles"
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
  name: 'saf-info-file-upload',
  props: {
    // 파일 정보
    safInfoAttachFileGrps: {
      type: Array,
    },
    saveSafeInfoAttachFiles: {
      type: Array,
    },
    safeInfoSubmitCheck: false,
    safeInfosm: {
      type: String, // not 'number'
      default: '6',
    },
  },
  data: () => ({}),
  watch: {
    // 첨부하기 위해 올린 파일이 있을 경우 파일저장
    safeInfoSubmitCheck: {
      handler: function(val, oldVal) {
        // true
        if (val) {
          if (this.saveSafeInfoAttachFiles.length > 0) {
            // 우선 맨 처음거를 업로드한다.
            // 그런후 맨 처음거가 success를 타고 넘어온다면 다음거를 실행
            this.$refs[
              'fileupload' +
                this.saveSafeInfoAttachFiles[0].uploadTempFiles.index
            ][0].submitUpload();
          } else {
            // 저장할 데이터가 없으면 창을 닫는다.
            this.$emit('closePopup');
          }
        }
      },
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
    init() {},
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      // 저장이 잘 이루어지게 되면 이곳을 타게 된다.
      //  처음 할 것은 맨처음 데이터를 지운다.
      this.saveSafeInfoAttachFiles.splice(0, 1);
      // 저장할 것이 남았는지 확인한다.
      if (this.saveSafeInfoAttachFiles.length > 0) {
        this.$refs[
          'fileupload' + this.saveSafeInfoAttachFiles[0].uploadTempFiles.index
        ][0].submitUpload();
      } else {
        // 저장할 데이터가 없으면 창을 닫는다.
        this.$emit('closePopup');
      }
    },
    uploadFiles(data, taskClassNm) {
      this.$emit('changeUploadFiles', { data: data, taskClassNm: taskClassNm });
    },
    setDeleteTempFileData(data) {
      this.$emit('setTempDeleteFiles', { data });
    },
  },
};
</script>

<style>
</style>
