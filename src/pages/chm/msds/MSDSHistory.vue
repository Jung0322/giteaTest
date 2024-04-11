<!--
  목적 : 물질관리 > 화학물질 > MSDS
  작성자 : kdh
  Detail : MSDS 목록 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             삭제 
            <y-btn
              v-if="editable && !disabled"
              :action-url="revdeleteUrl"
              :param="deleteRows"
              :is-submit="isDeleteSubmit"
              title="L0000001495"
              color="red"
              action-type="delete"
              beforeSubmit="beforeDeleteSubmit"
              @beforeDeleteSubmit="beforeDeleteSubmit"
              @btnClicked="btnDeleteClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
            MSDS 이력 목록
          <y-data-table
            label="L0000000129"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="gridSelectedRows"
            @tableLinkClicked="tableLinkClicked"
            :popMode="true"
          >
            <el-table-column
              label="checkbox"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000129')"
          :useExcelExport="false"
          :showRowCheckColumn="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @btnDelRowClicked="btnDelRowClicked"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'y-msds-history',
  props: {
    msds: {
      type: Object,
      default: {
        msdsGrpNo: 0,
      },
    },
  },
  data() {
    return {
      gridOptions: {
        name: 'MSDSHistory',
        btns: [],
        header: [],
        data: [],
        height: 300,
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      searchUrl: '',
      isDeleteSubmit: false,
      gridSelectedRows: [],
      deleteRows: [],
      revdeleteUrl: '',
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.chm.MSDS.list.url;
      this.editable = this.$route.meta.editable;
      this.revdeleteUrl = selectConfig.chm.MSDS.revdelete.url;
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), 
          color: 'red',
          btnClicked: 'btnDelRowClicked',
        },
      ]
      this.setGridHeader().then(() => {
        this.getDataList(); // MSDS grid
      })
      
    },
    setGridHeader() {
      return new Promise((resolve) => {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
            dataField: 'plantNm', 
            width: '10%',           
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002614'), 
            dataField: 'revTypeNm', 
            width: '15%',           
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000293'), 
            dataField: 'revNum', 
            width: '15%',   
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {              
              },
            },              
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000134'), 
            dataField: 'fileOrgNm', 
            width: '15%',   
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {              
              },
            },              
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000132'), 
            dataField: 'summaryFileOrgNm', 
            width: '15%',   
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {              
              },
            },              
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000133'), 
            dataField: 'writeDt', 
            width: '10%',   
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000976'), 
            dataField: 'createUserNm', 
            width: '10%',   
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000973'), 
            dataField: 'createDt', 
            width: '10%',   
          },
        ];
        resolve();
      })
    },
    // MSDS grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        msdsGrpNo: this.msds.msdsGrpNo,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data)
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 그리드 cell click 이벤트
    cellClickHandler(event) {
      if (event.dataField === 'fileOrgNm' && event.item.fileOrgNm !== null && event.item.fileOrgNm !== '') {
        this.downloadMsdsFile(event.item, 'MSDS', 'MSDS', event.item.fileNo.split(','));
        // MSDS요약파일을 누를 시 MSDS 요약파일을 다운로드한다.
      } else if (event.dataField === 'summaryFileOrgNm' && event.item.summaryFileOrgNm !== null && event.item.summaryFileOrgNm !== '') {
        this.downloadMsdsFile(
          event.item,
          'MSDS_SUMMARY',
          'MSDS요약파일',
          event.item.summaryFileNo.split(',')
        );
      } else if (event.dataField === 'revNum') {
        this.btnOpenSummaryView(event.item);
      }
    },
    tableLinkClicked(header, data) {
      // MSDS파일을 누를 시 MSDS 파일을 다운로드한다.
      if (header.name === 'fileOrgNm') {
        this.downloadMsdsFile(data, 'MSDS', 'MSDS', data.fileNo.split(','));
        // MSDS요약파일을 누를 시 MSDS 요약파일을 다운로드한다.
      } else if (header.name === 'summaryFileOrgNm') {
        this.downloadMsdsFile(
          data,
          'MSDS_SUMMARY',
          'MSDS요약파일',
          data.summaryFileNo.split(',')
        );
      } else if (header.name === 'revNum') {
        this.btnOpenSummaryView(data);
      }
    },
    downloadMsdsFile(data, _taskClassNm, _taskLabel, files) {
      // 파일이 여러개인 경우와 아닌경우를 분리하여 처리
      if (files.length === 1) {
        this.onDocumentDownload(data, _taskClassNm, _taskLabel);
      } else if (files.length > 1) {
        // 팝업
        this.openMsdsFileView(data, _taskClassNm, _taskLabel);
      }
    },
    openMsdsFileView(data, _taskClassNm, _taskLabel) {
      this.popupOptions.target = () => import(`${'./MSDSFileView.vue'}`);
      this.popupOptions.title = 'MSDS';
      this.popupOptions.visible = true;
      this.popupOptions.width = '50%';
      this.popupOptions.param = {
        msdsRqstNo: data ? data.msdsRqstNo : 0,
        taskClassNm: _taskClassNm,
        taskLabel: _taskLabel,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    onDocumentDownload(_item, _taskClassNm, _taskLabel) {
      let thisVue = this;
      let accept = this.$comm.getAccept(_item.fileExt);
      let _comm = this.$comm;
      this.$http.url = selectConfig.attachFile.file64.url; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.param = {
        fileNo: _taskClassNm === 'MSDS' ? _item.fileNo : _item.summaryFileNo, // 해당 컴포넌트는 공정안전자료에서 사용하지 않기 때문에 taskFlag는 주지 않는다. 210629 jkl
      };
      this.$http.request(
        (_result) => {
          let fileOrgNm =
            _taskClassNm === 'MSDS' ? _item.fileOrgNm : _item.summaryFileOrgNm;
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnOpenSummaryView(data) {
      this.popupOptions.target = () => import(`${'./MSDSSummeryView.vue'}`);
      this.popupOptions.title = 'L0000000127'; // MSDS
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        msdsRqstNo: data ? data.msdsRqstNo : 0,
        viewMode: true,
      };
      this.popupOptions.closeCallback = this.closeViewMode;
    },
    closeViewMode() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    btnDelRowClicked() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length > 0) {
        this.deleteRows = {
          data: Object.values(this.$_.clone(checkingData)),
        };
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321' /* 확인 */,
          message: 'M0000001022' /* 개정이력 목록에서 제외 하시겠습니까? */,
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.$http.url = this.revdeleteUrl;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: Object.values(this.$_.clone(checkingData)),
            };
            this.$http.request(
              (_result) => {
                this.getDataList();
                // this.$emit('');
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395' /* 안내 */,
                  message: 'M0000001024' /* 선택된 개정이력을 목록에서 제외하였습니다. */,
                  type: 'success',
                });
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            'M0000001023' /* 선택된 이력이 없습니다. 목록 앞단에 선택박스를 확인하세요. */,
          type: 'warning',
        });
      }
    },
    beforeDeleteSubmit() {
      if (this.gridSelectedRows.length > 0) {
        this.deleteRows = {
          data: Object.values(this.$_.clone(this.gridSelectedRows)),
        };
        // let tok = Object.values(this.$_.clone(this.gridSelectedRows));
        // console.log(tok);
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321' /* 확인 */,
          message: 'M0000001022' /* 개정이력 목록에서 제외 하시겠습니까? */,
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.isDeleteSubmit = true;
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            'M0000001023' /* 선택된 이력이 없습니다. 목록 앞단에 선택박스를 확인하세요. */,
          type: 'warning',
        });
      }
    },
    /**
     * 삭제버튼 클릭 이후 callback 메서드
     **/
    btnDeleteClickedCallback(_result) {
      this.isDeleteSubmit = false;
      this.getDataList();
      // this.$emit('');
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000001024' /* 선택된 개정이력을 목록에서 제외하였습니다. */,
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isDeleteSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
      );
    },
  },
};
</script>
