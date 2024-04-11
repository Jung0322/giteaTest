<!--
  목적 : 평가및안전보건비용 계획 > 대상협력업체
  작성자 : pkj
  Detail : 정기위험성평가계획 > 대상협력업체
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <!--  -->
        <y-auigrid
          ref="yAuiGrid"
          :editable="apprMode && editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="true"
          @cellEditEnd="cellEditEndHandler"
          @btnAddRowClicked="btnAddRowClicked"
          @btnDelRowClicked="btnDelRowClicked"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import searchIcon from '@/assets/images/info.png';
export default {
  /* attributes: name, components, props, data */
  name: 'rsaPlanDetailList',
  props: {
    assmnSfhlcInfo: {
      type: Object,
      default: () => ({
        vendorEvalPlanNo: 0,
        plantCd: '', // 사업장 코드
        year: '',
        evalClsCd: '',
        evalTitle: '',
        assessDt: null,
        evalDesc: '',
        assmnSfhlcVendorList: [],
      }),
    },
    deptListLoad: false,
    updateMode: false,
    deptReLoad: false,
    apprMode: false,
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        name: 'planmgmtVendorList',
        btns: [],
        header: [],
        data: [],
        height: '300',
      },
      YAuiGrid: null,
      editable: true,
      selectedValues: [], // 그리드 선택 목록
      deleteValue: null,
      deleteUrl: '',
      isDelete: false,
      searchIndexForDept: 0,
      searchIndexForDept2: 0,
      checkData: [],
      checkData2: [],
    };
  },
  watch: {
    'assmnSfhlcInfo.assmnSfhlcVendorList': function (newValue, oldValue) {
      this.YAuiGrid.setGridData(this.assmnSfhlcInfo.assmnSfhlcVendorList);
    },
    apprMode: function (newValue, oldValue) {
      this.gridOptions.btns[0].visible = false;
      this.gridOptions.btns[1].visible = false;
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.deleteUrl = transactionConfig.vendor.assmnSfhlc.vendorDelete.url;

      // 그리드 헤더 설정
      this.setGridHeader();
    },
    setGridHeader() {
      let myThis = this;
      return new Promise((resolve) => {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005121'),
            dataField: 'vendorNm',
            width: '10%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004977'),
            dataField: 'evalStartDt',
            width: '10%',
            editRenderer: {
              type: 'CalendarRenderer',
              onlyCalendar: true,
              defaultFormat: 'yyyy-mm-dd',
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004978'),
            dataField: 'evalEndDt',
            width: '10%',
            editRenderer: {
              type: 'CalendarRenderer',
              onlyCalendar: true,
              defaultFormat: 'yyyy-mm-dd',
            },
          },
          // {
          //   headerText: this.$comm.getLangSpecInfoLabel('L0000005120'),
          //   dataField: 'deptCd',
          //   width: '10%',
          //   editable: false,
          // },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005120'),
            dataField: 'deptNm',
            width: '10%',
            renderer: {
              type: 'IconRenderer',
              iconPosition: 'aisleRight',
              iconWidth: 20,
              iconHeight: 20,
              iconFunction: (rowIndex, columnIndex, value, item) => {
                if (this.apprMode && this.editable) {
                  return searchIcon;
                } else {
                  return false;
                }
              },
              onClick: (event) => {
                this.btnSearchDeptClicked(event);
              },
            },
          },
          // {
          //   headerText: this.$comm.getLangSpecInfoLabel('L0000005120') + '찾기',
          //   dataField: '',
          //   width:
          //     this.updateMode && this.editable && this.apprMode ? '10%' : '0%',
          //   editable: false,
          //   renderer: {
          //     type:
          //       this.updateMode && this.editable && this.apprMode
          //         ? 'ButtonRenderer'
          //         : null,
          //     labelText: '찾기',
          //     onClick: function (rowIndex, columnIndex, value, item) {
          //       myThis.searchDeptPop(rowIndex.rowIndex);
          //     },
          //   },
          // },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'vendorDesc',
            width: '10%',
            editable: !this.apprMode,
          },

          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004979'),
            dataField: 'finishYn',
            width: '10%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004980'),
            dataField: 'evalFinishDt',
            width: '10%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005125'),
            dataField: 'averageCnt',
            width: '10%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005124'),
            dataField: 'ratingNm',
            width: '10%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005123'),
            dataField: 'cost',
            width: '10%',
            editable: false,
          },
        ];
        this.gridOptions.btns = [
          {
            title: this.$comm.getLangSpecInfoLabel('L0000003255'),
            color: 'orange',
            btnClicked: 'btnAddRowClicked',
            visible: true,
          },
          {
            title: this.$comm.getLangSpecInfoLabel('L0000003225'),
            color: 'red',
            btnClicked: 'btnDelRowClicked',
            visible: true,
          },
        ];
        resolve();
      });
    },
    tableCellClassName({ row, column, rowIndex, colIndex }) {
      if (
        column.property !== undefined &&
        column.property === 'cost' &&
        row['cost'] !== undefined
      ) {
        row['cost'] = row['cost']
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return null;
      }
    },
    searchDeptPop(item) {
      this.checkData = [];
      this.searchIndexForDept = item;
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000004627'; // 부서 검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '35%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchDept;
    },
    closePopupSearchDept(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.dept) {
        this.checkData = this.YAuiGrid.getGridData();
        this.checkData[this.searchIndexForDept].deptCd = data.dept.deptCd;
        this.checkData[this.searchIndexForDept].deptNm = data.dept.deptNm;
        this.checkData[this.searchIndexForDept].actDept.deptCd =
          data.dept.deptCd;
        this.checkData[this.searchIndexForDept].actDept.deptNm =
          data.dept.deptNm;
        this.YAuiGrid.setGridData(this.checkData);

        this.cellEditEndHandler();
      }
    },
    cellEditEndHandler() {
      this.assmnSfhlcInfo.assmnSfhlcVendorList = this.YAuiGrid.getGridData();
    },
    btnAddRowClicked() {
      if (!this.assmnSfhlcInfo.plantCd) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '사업장을 선택하세요.',
          type: 'warning',
        });
        return;
      } else {
        this.popupOptions.target = () =>
          import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
        this.popupOptions.title = '협력업체 검색';
        this.popupOptions.param = {
          plantCd: this.assmnSfhlcInfo.plantCd,
          popupMode: true,
          multiSelect: true,
        };
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeVendorPopup;
      }
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data && data.data !== 'C') {
        this.$_.forEach(data.data, (item) => {
          if (item.vendorCd) {
            let existVendorCd = this.$_.filter(
              this.assmnSfhlcInfo.assmnSfhlcVendorList,
              (u) => u.vendorCd === item.vendorCd
            );
            if (!existVendorCd.length) {
              let addItem = {
                vendorCd: item.vendorCd,
                vendorNm: item.vendorNm,
                evalStartDt: this.assmnSfhlcInfo.assessDt[0]
                  ? this.assmnSfhlcInfo.assessDt[0]
                  : '',
                evalEndDt: this.assmnSfhlcInfo.assessDt[1]
                  ? this.assmnSfhlcInfo.assessDt[1]
                  : '',
                actDept: {
                  deptCd: this.assmnSfhlcInfo.mainDeptCd
                    ? this.assmnSfhlcInfo.mainDeptCd
                    : '',
                  deptNm: this.assmnSfhlcInfo.mainDeptNm
                    ? this.assmnSfhlcInfo.mainDeptNm
                    : '',
                },
                deptNm: this.assmnSfhlcInfo.mainDeptNm
                  ? this.assmnSfhlcInfo.mainDeptNm
                  : '',
                showEvalFinishYn: '미완료', // 평가완료여부
                evalFinishYn: 'N', // 평가완료여부
                evalFinishDt: null, // 평가완료일
                averageCnt: '0 / 0', // 평점/총점
                evalGrade: '', // 평가등급
                safHealthAdminExpenses: 0, // 안전보건관리비
                updateUserId: this.$store.getters.token,
                updateDeptNm: this.$store.getters.deptNm,
                updateDeptCd: this.$store.getters.deptCd,
                updatePositionCd: this.$store.getters.positionCd,
                updatePositionNm: this.$store.getters.positionNm,
              };
              this.assmnSfhlcInfo.assmnSfhlcVendorList.push(addItem);
            }
          }
        });
        this.YAuiGrid.setGridData(this.assmnSfhlcInfo.assmnSfhlcVendorList);
        this.cellEditEndHandler();
      }
    },
    deleteRow() {
      if (!this.selectedValues || !this.selectedValues.length) {
        this.$comm.alertWarning('M0000001614'); // 선택된 항목이 없습니다.
        return;
      }
      if (this.selectedValues.showEvalFinishYn === '완료') {
        this.$comm.alertWarning('M0000001612'); // 평가완료여부가 완료인상태는 삭제가 불가합니다.
        return;
      }
      this.$_.forEach(this.selectedValues, (item) => {
        this.assmnSfhlcInfo.assmnSfhlcVendorList.splice(
          this.$_.findIndex(this.assmnSfhlcInfo.assmnSfhlcVendorList, {
            deptCd: item.deptCd,
          }),
          1
        );
      });
    },
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
      this.$_.forEach(checkingData, (item) => {
        if (item.showEvalFinishYn === '완료') {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000057', // 평가완료여부가 완료인상태는 삭제가 불가합니다.
            type: 'warning',
          });
          return;
        }
      });

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.deleteUrl;
          this.$http.type = 'DELETE';
          this.$http.param = {
            data: Object.values(this.$_.clone(checkingData)),
          };
          this.$http.request(
            (_result) => {
              this.$_.forEach(checkingData, (item) => {
                this.assmnSfhlcInfo.assmnSfhlcVendorList.splice(
                  this.$_.findIndex(this.assmnSfhlcInfo.assmnSfhlcVendorList, {
                    deptCd: item.deptCd,
                  }),
                  1
                );
              });
              this.assmnSfhlcInfo.assmnSfhlcVendorList =
                this.assmnSfhlcInfo.assmnSfhlcVendorList;
              this.YAuiGrid.setGridData(
                this.assmnSfhlcInfo.assmnSfhlcVendorList
              );
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success',
              });
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
          this.isDelete = true;
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    beforeDelete() {
      if (!this.selectedValues || !this.selectedValues.length) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001614', // 선택된 항목이 없습니다.
          type: 'warning',
        });
        return;
      }
      if (this.selectedValues.showEvalFinishYn === '완료') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000057', // 평가완료여부가 완료인상태는 삭제가 불가합니다.
          type: 'warning',
        });
        return;
      }
      let filterValues = [];
      this.$_.forEach(this.selectedValues, (item) => {
        if (item.assessDeptNo !== 0) {
          let saveIdx = this.$_.findIndex(this.selectedValues, {
            deptCd: item.deptCd,
          });
          filterValues.push(this.selectedValues[saveIdx]);
        }
      });
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.deleteValue = {
            data: Object.values(this.$_.clone(this.selectedValues)),
          };
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      this.$_.forEach(this.selectedValues, (item) => {
        this.assmnSfhlcInfo.assmnSfhlcVendorList.splice(
          this.$_.findIndex(this.assmnSfhlcInfo.assmnSfhlcVendorList, {
            deptCd: item.deptCd,
          }),
          1
        );
      });
      this.assmnSfhlcInfo.assmnSfhlcVendorList =
        this.assmnSfhlcInfo.assmnSfhlcVendorList;
      // this.getList();
      this.isDelete = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchDeptClicked(event) {
      this.checkData2 = [];
      this.searchIndexForDept2 = event.rowIndex;
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.param = {
        plantCd: this.assmnSfhlcInfo.plantCd,
        deptCd: this.assmnSfhlcInfo.deptCd,
      };

      this.popupOptions.title = 'L0000001287'; // 부서
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchDept2;
    },
    closePopupSearchDept2(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.dept) {
        this.checkData2 = this.YAuiGrid.getGridData();
        this.checkData2[this.searchIndexForDept2].deptCd = data.dept.deptCd;
        this.checkData2[this.searchIndexForDept2].deptNm = data.dept.deptNm;
        this.checkData2[this.searchIndexForDept2].actDept.deptCd =
          data.dept.deptCd;
        this.checkData2[this.searchIndexForDept2].actDept.deptNm =
          data.dept.deptNm;

        this.YAuiGrid.setGridData(this.checkData2);
        this.cellEditEndHandler();
        // this.assmnSfhlcInfo.assmnSfhlcVendorList = this.checkData2;
      }
    },
  },
};
</script>
