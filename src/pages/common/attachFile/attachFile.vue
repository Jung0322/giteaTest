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
      <b-col :sm="beforeAttachFileGrp.isBefore ? 6 : 12">
        <b-col sm="12" class="px-0">
          <!-- 신규 파일 업로드 -->
          <y-label
            label="L0000001788"
            icon="user-edit"
            color-class="cutstom-title-color"
          />
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
            :uploadTempFiles="beforeUploadTempFiles"
            @uploadFiles="uploadFiles"
          >
          </y-file-upload>
        </b-col>
      </b-col>
      <b-col :sm="beforeAttachFileGrp.isBefore ? 6 : 12">
        <b-col sm="12" v-if="beforeAttachFileGrp.isBefore">
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name + '_' + safAttachFileGrp.taskClassNm"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="$comm.getLangSpecInfoLabel('L0000005482')"
            :items="gridOptions.data"
            :useExcelExport="true"
            :showGridSetSave="false"
            :useContextMenu="false"
            :enableRightDownFocus="false"
            :showGridCtrl="false"
            :showRowCheckColumn="true"
            @cellClick="tableLinkClicked"
            @rowCheckClick="rowCheckClickHandler"
          />
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'file-upload-page',
  props: {
    safAttachFileGrp: {
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
    },
    beforeAttachFileGrp: {
      gridkey: '',
      taskClassNm: '',
      taskKey: '',
      taskFlag: '',
      isBefore: true,
      selectRow: [],
      paneName: '',
    },
    beforeUploadTempFiles: {
      data: [],
    },
    multiFileUpload: false,
    smSize: 6,
    paneName: '',
  },
  data: () => ({
    gridOptions: {
      name: 'commonAttachFileAttachFile',
      header: [],
      data: [],
      height: 300,
    },
    beforeFileList: [],
    YAuiGrid: null,
  }),
  watch: {
    'safAttachFileGrp.submitCheck': {
      handler: function (val, oldVal) {
        this.$refs.fileupload.submitUpload();
      },
    },
    'beforeAttachFileGrp.paneName'() {
      this.getList();
      this.searchAttachFile();
    },
    refresh(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getList();
        this.searchAttachFile();
      }
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
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;

    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.searchUrl = selectConfig.attachFile.getBeforList.url;
      this.safAttachFileGrp.editable = this.$route.meta.editable;
      if (this.safAttachFileGrp.limit === undefined) {
        this.safAttachFileGrp.limit = 999;
      }

      if (this.beforeAttachFileGrp.isBefore === undefined) {
        this.beforeAttachFileGrp.isBefore = true;
      }

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003027'),
          dataField: 'fileOrgNm',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 파일명
      ];
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.beforeAttachFileGrp;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          this.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    searchAttachFile() {
      this.$refs.fileupload.getUploadedFileList();
    },
    tableLinkClicked(event) {
      const link = document.createElement('a');
      link.href = event.item.fileDownPath;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
    },
    fileUploadComplete() {},
    btnSearchClickedCallback(_result) {},
    btnClickedErrorCallback(_result) {},
    uploadFiles(data) {
      this.$emit('changeBeforeUploadFiles', { data: data });
    },
    rowCheckClickHandler(event) {
      if (!this.beforeAttachFileGrp.selectRow) {
        this.beforeAttachFileGrp.selectRow = [];
      }

      let idx = this.beforeAttachFileGrp.selectRow.findIndex(
        (file) => file.fileNo === event.item.fileNo
      );

      if (idx === -1) {
        this.beforeAttachFileGrp.selectRow.push(event.item);
      }
    },
  },
};
</script>

<style></style>
