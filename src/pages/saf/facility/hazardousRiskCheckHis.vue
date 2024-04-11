<!--
  목적 : 유해위험기계기구 검사 이력
  Detail : 검사 이력 등록/수정/삭제 화면
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
             추가 
            <y-btn
              v-if="!disabled && editable"
              title="L0000002892"
              color="blue"
              @btnClicked="btnAdd"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             삭제 
            <y-btn
              v-if="!disabled && editable"
              title="L0000001495"
              color="red"
              @btnClicked="btnDelete"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div> -->
          <!-- 검사 이력 -->
          <!-- <y-data-table
            label="L0000000308"
            ref="dataTableCheck"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="!disabled && editable"
            v-model="selectedValue"
          >
            <el-table-column
              align="center"
              type="selection"
              slot="selection"
              width="55"
            ></el-table-column>
             검사일자 
            <el-table-column
              align="center"
              slot="tag"
              width="300"
              :label="$comm.getLangSpecInfoLabel('L0000000314')"
            >
              <template slot-scope="scope">
                <y-datepicker
                  label
                  :editable="editable"
                  :disabled="disabled"
                  v-model="scope.row.inspDt"
                  @datachange="inspDkCheck(scope.$index, scope.row)"
                ></y-datepicker>
              </template>
            </el-table-column>
             비고 
            <el-table-column
              align="center"
              slot="tag"
              width="1000"
              :label="$comm.getLangSpecInfoLabel('L0000001360')"
            >
              <template slot-scope="scope">
                <y-textarea
                  :maxlength="200"
                  align="center"
                  :editable="!disabled && editable"
                  ui="bootstrap"
                  label
                  name="remark"
                  v-model="scope.row.remark"
                ></y-textarea>
              </template>
            </el-table-column>
          </y-data-table> -->
        <!-- </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="!disabled && editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000308')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :showRowCheckColumn="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"       
          :softRemoveRowMode="false"
          @cellEditEnd="cellEditEndHandler"     
          @btnAddRow="btnAddRow"
          @btnDelRow="btnDelRow"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'hazardous-risk-check-his',
  props: {
    disabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    safCheckMachine: {
      type: Object,
      default: function () {
        return {
          checkMachineNo: 0, // 기계기구번호
          safCheckLogs: [], // 점검이력
          deleteSafCheckLogs: [], // 삭제할 점검이력
        };
      },
    },
  },
  data() {
    return {
      gridOptions: {
        name: 'hazardousRistCheckHis',
        btns: [],
        header: [],
        data: [],
        height: '320',
      },
      YAuiGrid: null,
      editable: false,
      selectedValue: [],
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
    };
  },
  watch: {
    'safCheckMachine.checkMachineNo': {
      handler: function (val, oldVal) {
        this.getDataList(); // 검사이력
      },
      deep: true,
    },
    'safCheckMachine.itemNo'() {
      this.$_.forEach(this.gridOptions.data, (item) => {
        item.itemNo = this.safCheckMachine.itemNo;
      });
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        let deleteData = this.$_.clone(this.safCheckMachine.safCheckLogs);
        this.$_.forEach(this.safCheckMachine.safCheckLogs, (item) => {
          if (item.checkLogNo) {
            let index = this.$_.findIndex(this.gridOptions.data, {
              checkLogNo: item.checkLogNo,
            });
            if (index === -1) {
              deleteData = this.$_.reject(deleteData, {
                checkLogNo: item.checkLogNo,
              });
            }
          } else {
            let index = this.$_.findIndex(this.gridOptions.data, {
              tempId: item.tempId,
            });
            if (index === -1) {
              deleteData = this.$_.reject(deleteData, {
                tempId: item.tempId,
              });
            }
          }
        });
        this.safCheckMachine.safCheckLogs = deleteData;

        this.$_.forEach(this.gridOptions.data, (item) => {
          if (item.checkLogNo) {
            let index = this.$_.findIndex(this.safCheckMachine.safCheckLogs, {
              checkLogNo: item.checkLogNo,
            });
            if (index > -1) {
              this.safCheckMachine.safCheckLogs[index] = item;
            } else {
              this.safCheckMachine.safCheckLogs.push(item);
            }
          } else {
            let index = this.$_.findIndex(this.safCheckMachine.safCheckLogs, {
              tempId: item.tempId,
            });
            if (index > -1) {
              this.safCheckMachine.safCheckLogs[index] = item;
            } else {
              this.safCheckMachine.safCheckLogs.push(item);
            }
          }
        });
      },
    },
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
    init() {
      // URL 셋팅
      this.searchUrl = this.$format(
        selectConfig.saf.safCheckLog.get.url,
        this.safCheckMachine.checkMachineNo
      );

      this.editable = this.$route.meta.editable;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000119'), 
          dataField: 'itemNo', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000314'), 
          dataField: 'inspDt', 
          width: '20%', 
          editRenderer: {
            type: "CalendarRenderer",
            defaultFormat: "yyyy-mm-dd", // 달력 선택 시 데이터에 적용되는 날짜 형식
            showEditorBtn: false,
            showEditorBtnOver: false, // 마우스 오버 시 에디터버턴 출력 여부
            onlyCalendar: true, // 사용자 입력 불가, 즉 달력으로만 날짜입력 (기본값 : true)
            showExtraDays: true // 지난 달, 다음 달 여분의 날짜(days) 출력
          }
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
          dataField: 'remark', 
          width: '60%', 
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnAddRow',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelRow',
        },
      ]

      this.getDataList();
    },
    // 그리드
    cellEditEndHandler() {
      this.safCheckMachine.safCheckLogs = this.YAuiGrid.getGridData();
    },
    getDataList() {
      if (this.safCheckMachine.checkMachineNo > 0) {
        this.gridOptions.data = [];
        if (
          this.safCheckMachine.safCheckLogs &&
          this.safCheckMachine.safCheckLogs.length > 0
        ) {
          this.gridOptions.data = this.safCheckMachine.safCheckLogs;
          this.YAuiGrid.setGridData(this.safCheckMachine.safCheckLogs)
        }
      } else {
        this.$http.url = this.searchUrl;
        this.$http.type = 'GET';
        this.$http.param = this.searchParam;
        this.$http.request(
          (_result) => {
            if (this.safCheckMachine.checkMachineNo === 0) {
              this.gridOptions.data = _result.data;
              this.YAuiGrid.setGridData(_result.data)
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    btnAddRow() {
      var date = new Date();
      let row = {
        tempId: String(date.getTime()),
        checkMachineNo: this.safCheckMachine.checkMachineNo,
        itemNo: this.safCheckMachine.itemNo,
        inspDt: '',
        remark: '',
      };
      this.YAuiGrid.addRow(row, 'first');
      this.cellEditEndHandler();
    },
    btnDelRow() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (!this.safCheckMachine.deleteSafCheckLogs) {
        this.safCheckMachine.deleteSafCheckLogs = [];
      }
      for (let i = 0; i < removeData.length; i++) {
        this.safCheckMachine.deleteSafCheckLogs.push(removeData[i].item);
        this.YAuiGrid.removeRow(removeData[i].rowIndex);
      }
      this.cellEditEndHandler();
    },
    btnAdd() {
      var date = new Date();
      this.gridOptions.data.splice(0, 0, {
        tempId: String(date.getTime()),
        checkMachineNo: this.safCheckMachine.checkMachineNo,
        itemNo: this.safCheckMachine.itemNo,
        inspDt: '',
        remark: '',
      });
    },
    btnDelete() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
      } else {
        // 삭제한 항목을 따로 저장해 둔 후 저장 버튼을 누를때 가지고 가서
        if (!this.safCheckMachine.deleteSafCheckLogs) {
          this.safCheckMachine.deleteSafCheckLogs = [];
        }

        this.$_.forEach(this.selectedValue, (item) => {
          if (item.tempId) {
            this.gridOptions.data.splice(
              this.$_.findIndex(this.gridOptions.data, { tempId: item.tempId }),
              1
            );
          } else {
            this.safCheckMachine.deleteSafCheckLogs.push(item);
            this.gridOptions.data.splice(
              this.$_.findIndex(this.gridOptions.data, {
                checkLogNo: item.checkLogNo,
              }),
              1
            );
          }
        });
      }
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    inspDkCheck(idx, rowData) {
      this.gridOptions.data[idx].inspDt = rowData.inspDt;
      let gridData = this.$_.concat(this.gridOptions.data);
      gridData.splice(idx, 1);

      if (gridData !== null && gridData.length > 0) {
        let ckIndex = this.$_.findIndex(gridData, {
          inspDt: rowData.inspDt,
        });

        if (ckIndex > -1) {
          rowData.inspDt = null;
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000920'); // 중복된 검사일자가 있습니다.
        }
      }
    },
    /** /Button Event **/
  },
};
</script>
