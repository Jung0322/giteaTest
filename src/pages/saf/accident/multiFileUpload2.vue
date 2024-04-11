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
      <b-col v-for="(attachFileGrp, index) in attachFileGrps2" :key="index" :sm="sm" class="mb-2">
        <y-file-upload
          :ref="'fileupload' + index"
          :label="attachFileGrp.label"
          :showUploadBtn="false"
          :drag="attachFileGrp.drag"
          :editable="attachFileGrp.editable"
          :multiple="attachFileGrp.multiple"
          :attach-file-grp="attachFileGrp"
          :loadOtherFileGrps="attachFileGrp.loadOtherFileGrps"
          :close="true"
          :limit="attachFileGrp.limit"
          :disabled="attachFileGrp.disabled"
          :listType="attachFileGrp.listType"
          :showFileSearch="attachFileGrp.showFileSearch"
          :onlyDownload="attachFileGrp.onlyDownload"
          :uploadTempFiles="attachFileGrp.uploadTempFiles"
          :accept="attachFileGrp.accept"
          :refresh="refresh"
          @closePopup="closePopup"
          @uploadFiles="uploadFiles"
          @uploadedList="uploadedList"
          @setDeleteTempFileData="setDeleteTempFileData"
          @setClearOtherFileList="setClearOtherFileList"
          @setDeleteOtherFileList="setDeleteOtherFileList"
          @setUploadFileLength="setUploadFileLength"
        ></y-file-upload>
        <!-- <div v-if="attachFileGrp.isPictureExplan === true" class="mb-3" />
        <y-textarea
          v-if="attachFileGrp.isPictureExplan"
          :width="10"
          :editable="!attachFileGrp.disabled&&attachFileGrp.editable"
          :maxlength="150"
          ui="bootstrap"
          label="설명"
          v-model="attachFileGrp.pictureExplan"
        ></y-textarea> -->
      </b-col>
      <!-- <b-col  :sm="remainderSm">
      </b-col>-->
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'multi-file-upload',
  props: {
    // 파일 정보
    attachFileGrps2: {
      type: Array,
    },
    saveAttachFiles2: {
      type: Array,
    },
    submitObject2: {
      type: Object,
      default: null,
    },
    submitCheck2: {
      type: Boolean,
      default: false,
    },
    sm: {
      type: String, // not 'number'
      default: '12',
    },
  },
  data: () => ({
    refresh: false,
    countIndex: 0,
  }),
  computed: {
    remainderSm() {
      return (12 - this.$_.parseInt(this.sm)).toString();
    },
  },
  watch: {
    // 첨부하기 위해 올린 파일이 있을 경우 파일저장
    submitCheck2: {
      handler: function(val, oldVal) {
        // true
        if (val !== oldVal) {
          if (this.saveAttachFiles2.length > 0) {
            // 우선 맨 처음거를 업로드한다.
            // 그런후 맨 처음거가 success를 타고 넘어온다면 다음거를 실행
            // 여러개의 첨부를 처리하는 경우 아래 주석의 방식으로는 처리되지 못함.
            // 여러개 첨부처리를 아래와 같이함.
            let _executeIndex = 0;
            let uniqIndex = [];
            this.$_.forEach(this.saveAttachFiles2, _item => {
              if (_item.uploadTempFiles.data.length > 0) {
                uniqIndex.push(_item.uploadTempFiles.index);
              }
            });
            uniqIndex = this.$_.uniq(uniqIndex);
            if (uniqIndex && uniqIndex.length > 0) {
              this.$_.forEach(uniqIndex, index => {
                this.$refs['fileupload' + index][0].submitUpload();
              });
            }
          } else {
            // 저장할 데이터가 없으면 창을 닫는다.
            this.$emit('closePopup');
          }
        }
      },
    },
    // 첨부하기 위해 올린 파일이 있을 경우 파일저장
    'submitObject2.submitCheck2': {
      handler: function(val, oldVal) {
        // true
        if (val !== oldVal) {
          if (this.saveAttachFiles2.length > 0) {
            // 우선 맨 처음거를 업로드한다.
            // 그런후 맨 처음거가 success를 타고 넘어온다면 다음거를 실행
            // 여러개의 첨부를 처리하는 경우 아래 주석의 방식으로는 처리되지 못함.
            // 여러개 첨부처리를 아래와 같이함.
            let _executeIndex = 0;
            let uniqIndex = [];
            this.$_.forEach(this.saveAttachFiles2, _item => {
              if (_item.uploadTempFiles.data.length > 0) {
                uniqIndex.push(_item.uploadTempFiles.index);
              }
            });
            uniqIndex = this.$_.uniq(uniqIndex);
            if (uniqIndex && uniqIndex.length > 0) {
              this.$_.forEach(uniqIndex, index => {
                this.$refs['fileupload' + index][0].submitUpload();
              });
            }
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
      this.saveAttachFiles2.splice(0, 1);
      // 저장할 것이 남았는지 확인한다.
      // if (this.saveAttachFiles2.length > 0) {
      //   if (this.saveAttachFiles2[0].uploadTempFiles.data.length > 1) {
      //     this.$refs[
      //       'fileupload' + this.saveAttachFiles2[0].uploadTempFiles.index
      //     ][0].submitUpload();
      //   }
      // } else {
      //   // 저장할 데이터가 없으면 창을 닫는다.
      //   this.$emit('closePopup');
      // }
      this.$emit('closePopup', { state: 'success' });
    },
    uploadFiles(data, taskClassNm) {
      this.$emit('changeUploadFiles2', {
        data: data,
        taskClassNm: taskClassNm,
      });
    },
    uploadedList(data, taskClassNm) {
      if (data && data.length > 0) {
        let index = this.$_.findIndex(this.attachFileGrps2, {
          taskClassNm: taskClassNm,
        });
        this.attachFileGrps2[index].pictureExplan = data[0].pictureExplan;
        if (data.length < this.countIndex && this.countIndex !== 0) {
          this.refresh = !this.refresh;
        } else {
          this.countIndex = 0;
        }
      }
      this.$emit('setUploadedList2', { data: data, taskClassNm: taskClassNm });
    },
    setDeleteTempFileData(data) {
      this.$emit('setTempDeleteFiles2', { data });
    },
    setClearOtherFileList(taskClassNm) {
      this.$emit('setClearOtherFileList2', taskClassNm);
    },
    setDeleteOtherFileList(data) {
      this.$emit('setDeleteOtherFileList2', data);
    },
    setUploadFileLength(data) {
      this.countIndex = data;
    },
  },
};
</script>

<style>
</style>
