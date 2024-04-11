<!--
  목적 : 위험성평가 > 기준정보 > 위험Matrix 관리
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
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />           
          </div>
           위험Matrix 이력 목록 
          <y-data-table
            label="L0000003415"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @tableLinkClicked="tableLinkClicked"
            :popMode="true"
            v-model="gridSelectedRows"
          >
            <el-table-column
              label="checkbox"
              align="center"
              type="selection"
              slot="selection"
              width="55"
            />
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003415')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          :showRowCheckColumn="true"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-assess-type-history',
  props: {
    assessType: {
      type: Object,
      default: {
        assessGroupNo: 0,
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        name: 'assessTypeHistory',
        header: [],
        data: [],
        height: 400,
      },
      YAuiGrid: null,
      editable: false,
      gridSelectedRows: [],
      isDeleteSubmit: false,
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
      this.editable = this.$route.meta.editable;
      // URL 셋팅
      this.searchUrl = selectConfig.rsa.assessType.history.url;
      this.revdeleteUrl = transactionConfig.rsa.assessType.revdelete.url;

      this.getList(); // 평가기법 grid

      // 평가기법 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003417'), 
          dataField: 'assessGroupNm', 
          width: '15%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003416'), 
          dataField: 'assessTypeNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002120'), 
          dataField: 'assessNm', 
          width: '10%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002798'), 
          dataField: 'revNo', 
          width: '5%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000294'), 
          dataField: 'revContents', 
          width: '30%', 
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002118'), 
          dataField: 'assessDesc', 
          width: '30%', 
          style: 'left-align',
        },

      ];
    },
    // 평가기법 grid
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        assessGroupNo: this.assessType.assessGroupNo,
      };
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data)
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'assessNm') {
        this.openDialogPage(event.item);
      }
    },
    // 그리드 row click 이벤트
    tableLinkClicked(header, data) {
      if (header.name === 'assessNm') {
        this.openDialogPage(data);
      }
    },
    openDialogPage(data) {
      if (data === undefined) {
        this.popupOptions.param = {
          assessTypeNo: 0,
        };
      } else {
        this.popupOptions.param = {
          assessTypeNo: data.assessTypeNo,
          isHistory: true,
        };
      }

      this.popupOptions.target = () => import(`${'./riskMatrixDialog.vue'}`);
      this.popupOptions.title = 'L0000002115'; // 위험 Matrix 상세

      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeDetailPopup;
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
    btnDeleteClickedCallback(_result) {
      this.isDeleteSubmit = false;
      this.getList();
      this.$emit('');
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
    closeDetailPopup() {
      this.getList();
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
    /** /Button Event **/
  },
};
</script>
