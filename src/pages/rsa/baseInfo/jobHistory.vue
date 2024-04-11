<!--
  목적 : 위험성평가 > 기준정보 > 작업 관리 > 이력정보 탭
  작성자 : kga
  Detail :
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
              v-if="editable"
              :action-url="revdeleteUrl"
              :param="deleteRows"
              :is-submit="isDeleteSubmit"
              title="L0000001495" 
              color="red"
              action-type="delete"
              beforeSubmit="beforeDeleteSubmit"
              @beforeDeleteSubmit="beforeDeleteSubmit"
              @btnClicked="btnDeleteClickedCallback"
              @btnClickedErrorCallback="btnDeleteClickedErrorCallback"
            />
          </div>
          이력정보 목록 
          <y-data-table
            label="L0000002209"
            :cellClick="true"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="gridSelectedRows"
            @tableLinkClicked="tableLinkClicked"
            :popMode="true"
          >
            <el-table-column
              v-if="editable"
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
    <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002209')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :showRowCheckColumn="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @cellClick="cellClickHandler"
          @btnDelRow="btnDelRow"
        />
      </b-col>
    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-job-history',
  props: {
    selectedJobId: 0,
    selectedJobCd: '',
  },
  data() {
    return {
      gridOptions: {
        name: 'jobHistory',
        btns: [],
        header: [],
        data: [],
        height: 210,
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      selectUrl: '',
      editable: false,
      revdeleteUrl: '',
      deleteRows: [],
      isDeleteSubmit: false,
      gridSelectedRows: [],
    };
  },
  watch: {
    selectedJobId: function(newValue, oldValue) {
      this.getDataList();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.revdeleteUrl = transactionConfig.rsa.jobHistory.revdelete.url;      
      this.getDataList(); // 이력정보 grid

      // 이력정보 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'), 
          dataField: 'jobNm', 
          width: '30%', 
          style: 'left-align'
        },    
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001227'), 
          dataField: 'jobCommts', 
          width: '30%', 
          style: 'left-align'
        },    
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000156'), 
          dataField: 'jobRevno', 
          width: '20%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },    
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001233'), 
          dataField: 'editDt', 
          width: '20%', 
        },  
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelRow',
        },
      ]
    },
    // 이력정보 grid
    getDataList() {
      this.$http.url = selectConfig.rsa.jobHistory.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        jobCd: this.selectedJobCd,
      };
      this.$http.request(
        _result => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField !== 'jobRevno') return;
      this.btnPopupClickedCallback(event.item);
    },
    // 그리드 row click 이벤트
    tableLinkClicked(header, data) {
      this.btnPopupClickedCallback(data);
    },

    /** Button Event **/
    // 상세 팝업
    btnPopupClickedCallback(data) {
      this.popupOptions.target = () => import(`${'./jobHistoryDetail.vue'}`);
      this.popupOptions.title = 'L0000003411'; // 작업 이력 상세
      this.popupOptions.visible = true;
      this.popupOptions.width = '75%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        jobId: data ? data.jobId : 0,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    // 상세 팝업 닫기
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isDelete = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    btnDelRow() {
      this.deleteList = [];
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        // 체크 항목 미존재 시
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      }
      removeData.forEach((item) => {
        this.deleteList.push(item.item); 
      })

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.revdeleteUrl;
          this.$http.type = 'DELETE';
          this.$http.param = {
            data: Object.values(this.$_.clone(this.deleteList)),
          };
          this.$http.request(
            (_result) => {
              this.getDataList();
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000001024', /* 선택된 개정이력을 목록에서 제외하였습니다. */
                type: 'success',
              });
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );

        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    /** /Button Event **/
    beforeDeleteSubmit() {
      if (this.gridSelectedRows.length > 0) {
        this.deleteRows = {
          data: Object.values(this.$_.clone(this.gridSelectedRows)),
        };
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', /* 확인 */
          message: 'M0000001022', /* 개정이력 목록에서 제외 하시겠습니까? */
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.isDeleteSubmit = true;
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', /* 안내 */
          message:
            'M0000001023', /* 선택된 이력이 없습니다. 목록 앞단에 선택박스를 확인하세요. */
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
      this.$emit('');
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', /* 안내 */
        message: 'M0000001024', /* 선택된 개정이력을 목록에서 제외하였습니다. */
        type: 'success',
      });
    },
    btnDeleteClickedErrorCallback(_result) {
      this.isDeleteSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
      );
    },
  },  
};
</script>