<!--
  목적 : 첨부파일 목록
  Detail : 펌부파일 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="popupParam.listLabel"
          :items="gridOptions.data"
          :useExcelExport="false"
          :showItemCount="false"
          @cellClick="cellClickHandler"
          @btnClose="closeSndPopup"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'common-baseInfo-customDialog',
  props: {
    popupParam: {
      gridOptions: {
        header: [],
      },
      flag: '',
      listLabel: '',
      searchUrl: '',
      searchKey: {},
      dialogTitle: '',
      dialogParam: {},
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        header: [],
        data: [],
        height: 300,
      },
      component: null,
      comboPlantItems: [],
      searchUrl: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = this.popupParam.searchUrl;

      // 그리드 헤더 설정
      this.gridOptions.header = this.$_.clone(
        this.popupParam.gridOptions.header
      );

      if (this.popupParam.flag === 'SAF_ATTACH_FILE') {
        // 개정사유
        this.gridOptions.header.splice(4, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000294'),
          dataField: 'revContents',
          style: 'left-align',
          width: '250',
        });
      } else if (this.popupParam.flag === 'DIAGRAM_FILE') {
        // 개정사유
        this.gridOptions.header.splice(3, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000294'),
          dataField: 'revContents',
          style: 'left-align',
          width: '250',
        });
      }

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClose',
        }, // 닫기
      ];
      console.log('111', this.gridOptions);
    },
    cellClickHandler(event) {
      console.log('222', event);
      if (event.dataField === 'fileOrgNm') {
        const link = document.createElement('a');
        link.href = event.item.fileDownPath;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
      } else {
        this.openDialogPage(event.item);
      }
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.popupParam.searchKey;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openDialogPage(data) {
      this.popupOptions.param = this.popupParam.dialogParam;
      this.popupOptions.title = this.popupParam.dialogTitle;

      this.popupOptions.param.key1 = data.key1;
      this.popupOptions.param.taskKey = data.key1;
      this.popupOptions.param.data = data;
      this.popupOptions.param.editable = false;

      if (this.popupParam.flag === 'SAF_ATTACH_FILE') {
        this.popupOptions.target = () =>
          import(`${'../attachFile/safAttachFileDialog.vue'}`);
      } else if (this.popupParam.flag === 'DIAGRAM_FILE') {
        this.popupOptions.target = () =>
          import(`${'../diagram/diagramFileDialog.vue'}`);
      }

      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    // 검색박스숨기기
    closePopup() {
      this.getList();

      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    closeSndPopup() {
      this.$emit('closePopup', {});
    },
    /**
     * 사용자의 입력을 받는다.
     */
    getConfirm() {},
    /** button 관련 이벤트 **/
    btnSearchClickedCallback(_result) {
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
