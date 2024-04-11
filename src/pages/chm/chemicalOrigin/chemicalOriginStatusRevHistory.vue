<!--
  목적 :
  작성자 :
  Detail : 인허가현황 등록/수정 > 개정이력 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             삭제 -
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
          개정이력 목록 
          <y-data-table
            label="L0000000296"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="gridSelectedRows"
            :editable="editable"
            @tableLinkClicked="tableLinkClicked"
            :popMode="true"
          >
            <el-table-column
              v-show="editable && !disabled"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000296')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :showRowCheckColumn="true"
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
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'chemical-origin-status-rev-history',
  props: {
    count: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    gridOptions: {
      name: 'chemicalOriginStatusRevHistory',
      btns: [],
      header: [],
      data: [],
      height: '300',
    },
    YAuiGrid: null,
    selectValue: [],
    revdeleteUrl: '',
    saveData: {
      permitProdHisNo: 0,
      createUserId: '',
      updateUserId: '',
    },
    isRevisionButtonClicked: false,
    isRev: false,
    changeChemPermit: false,
    editable: false,
    updateMode: false,
    disabled: false,
    isSave: false,
    permitClsItems: [], // 인허가종류목록
    userItems: [], // 신고자목록
    deleteRows: [],
    gridSelectedRows: [],
    uploadFile: {
      data: [],
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '80%',
      top: '50px',
      param: {},
      closeCallback: null,
    },
    isDeleteSubmit: false,
    count1: 0,
    selectedValue: [],
    searchDetailUrl: '',
    saveUrl: '',
    checkUrl: '',
    actionType: 'POST',
    component: null,
    tabIndex: 0,
    paneName: '',

    permitClsUrl: '',
    permitClsParam: {},

    // 첨부 파일
    attach: null,
    submitCheck: false,
    saveAttachFiles: [],
    tempDeleteFiles: [],
    attachFileGrps: [],
    permitProdHisNo: 0,
  }),
  watch: {
    count() {
      this.getList();
    },
    permitProdHisNo: function (newval, oldval) {
      this.getList(newval);
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002256'),
          dataField: 'permitClsNm',
          width: '30%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000294'),
          dataField: 'revContents',
          width: '25%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000293'),
          dataField: 'revNum',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001452'),
          dataField: 'useDeptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000976'),
          dataField: 'createUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000297'),
          dataField: 'revYmd',
          width: '10%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelRowClicked',
          visible: !this.editable && !this.disabled,
        },
      ];
      this.revdeleteUrl = transactionConfig.chm.chemPermitProdHis.delete.url;
      this.editable = this.$route.meta.editable;

      this.getList();
    },
    getList(_permitProdHisNo) {
      this.$http.url = selectConfig.chm.chemPermitProdHis.revisions.url;
      this.$http.type = 'GET';

      // 개정이력 최상단을 선택해서 삭제후, 개정이력이 안나타나는 현상 해결을 위한 코드
      if (this.deleteRows.length !== 0) {
        let copiedList = this.$_.cloneDeep(this.gridOptions.data);
        this.$_.forEach(this.deleteRows.data, (deleteRow) => {
          this.$_.remove(copiedList, {
            permitProdHisNo: deleteRow.permitProdHisNo,
          });
        });
        this.permitProdHisNo = copiedList[0].permitProdHisNo;
      }

      this.$http.param = {
        permitProdHisNo: _permitProdHisNo
          ? _permitProdHisNo
          : this.permitProdHisNo,
      };
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$emit('permitProdHisRevs', this.gridOptions.data);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016'
            /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    // getDetail() {
    //   this.$http.url = this.$format(
    //     this.searchUrl,
    //     this.referenceInfo.lcnBoardNo === 0
    //       ? this.popupParam.lcnBoardNo.toString()
    //       : this.referenceInfo.lcnBoardNo.toString()
    //   );
    //   this.$http.type = 'get';
    //   this.$http.request(
    //     _result => {
    //       this.referenceInfo = _result.data;
    //     },
    //     _error => {
    //       window.getApp.$emit(
    //         'APP_REQUEST_ERROR',
    //         'M0000000016'
    //         /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
    //       );
    //     }
    //   );
    // },
    closePopup() {
      this.$emit('closePopup');
    },
    cellClickHandler(event) {
      if (event.dataField !== 'permitClsNm') return;
      this.popupOptions.target = () =>
        import(`${'./chemicalOriginStatusHistoryDetail.vue'}`);
      this.popupOptions.title = 'L0000003779'; /* 인허가현황 개정상세 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        permitProdHisNo: event.item.permitProdHisNo,
      };
      this.popupOptions.closeCallback = this.closeDetailPopup;
    },
    tableLinkClicked(header, data) {
      if (data === null) return;
      this.popupOptions.target = () =>
        import(`${'./chemicalOriginStatusHistoryDetail.vue'}`);
      this.popupOptions.title = 'L0000003779'; /* 인허가현황 개정상세 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        permitProdHisNo: data.permitProdHisNo,
      };
      this.popupOptions.closeCallback = this.closeDetailPopup;
    },
    closeDetailPopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },

    /** validation checking**/
    /**
     * 저장 하기전 UI단 유효성 검사
     **/
    btnDelRowClicked() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (!checkingData || checkingData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001614', // 선택된 항목이 없습니다.
          type: 'warning',
        });
        return;
      }

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
              this.getList();
              this.$emit('');
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message:
                  'M0000001024' /* 선택된 개정이력을 목록에서 제외하였습니다. */,
                type: 'success',
              });
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    beforeDeleteSubmit() {
      if (this.gridSelectedRows.length > 0) {
        this.deleteRows = {
          data: Object.values(this.$_.clone(this.gridSelectedRows)),
        };
        // let tok = Object.values(this.$_.clone(this.gridSelectedRows));
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
  },
};
</script>
