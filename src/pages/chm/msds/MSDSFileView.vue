<!--
  목적 : MSDS 파일 정보 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <div slot="buttonGroup" class="float-right mb-1 mr-3">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
            <component
              :is="attach"
              v-if="attach"
              :submitCheck="submitCheck"
              :attachFileGrps="attachFileGrps"
              :saveAttachFiles="saveAttachFiles"
              sm="12"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'msds-file-view',
  props: {
    popupParam: {
      type: Object,
      default: {
        msdsRqstNo: 0,
        taskClassNm: '',
        taskLabel: '',
      },
    },
  },
  data: function () {
    return {
      // 첨부 파일
      attach: null,
      submitCheck: false,
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],
      uploadedMsdsList: [], // 업로드된 msds
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate () {},
  created () {},
  beforeMount () {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  updated () {},
  mounted () {},
  beforeDestroy () {},
  //* methods */
  methods: {
    init () {
      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps();
    },
    setAttachFileGrps () {
      // 첨부파일 설정
      let taskKey = this.popupParam.msdsRqstNo
        ? this.popupParam.msdsRqstNo.toString()
        : '';

      this.attachFileGrps = [
        {
          label: this.popupParam.taskLabel,
          listType: 'text',
          drag: false,
          showFileSearch: false,
          editable: false,
          disabled: false,
          limit: 3,
          multiple: true,
          uploadTempFiles: null,
          loadOtherFileGrps: null,
          taskClassNm: this.popupParam.taskClassNm,
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    closePopup (data) {
      this.$emit('closePopup', {});
    },
  },
};
</script>

<style>
</style>
