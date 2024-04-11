<!--
  목적 : 유해위험기계기구 담당자 
  Detail : 유해위험기계기구 담당자 추가/삭제 화면
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
              @btnClicked="btnSearchUserClicked"
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
          </div>
           담당자 목록 
          <y-data-table
            label="L0000000893"
            ref="dataTableCheck"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="!disabled && editable"
            v-model="selectedValue"
          >
            <el-table-column align="center" type="selection" slot="selection" width="55"></el-table-column>
          </y-data-table>
        </b-col>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000893')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :showRowCheckColumn="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"       
          :softRemoveRowMode="false"
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
  name: 'hazardous-risk-mechanism-user',
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
          safCheckUsers: [], // 알람 담당자
          deleteSafCheckUsers: [], // 삭제할 알람 담당자
        };
      },
    },
  },
  data() {
    return {
      gridOptions: {
        name: 'hazardousRiskMechanismUser',
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
    'gridOptions.data': {
      handler: function (val, oldVal) {
        let deleteData = this.$_.clone(this.safCheckMachine.safCheckUsers);
        this.$_.forEach(this.safCheckMachine.safCheckUsers, (item) => {
          if (item.checkUserNo) {
            let index = this.$_.findIndex(this.gridOptions.data, {
              checkUserNo: item.checkUserNo,
            });
            if (index === -1) {
              deleteData = this.$_.reject(deleteData, {
                checkUserNo: item.checkUserNo,
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
        this.safCheckMachine.safCheckUsers = deleteData;

        this.$_.forEach(this.gridOptions.data, (item) => {
          if (item.checkUserNo) {
            let index = this.$_.findIndex(this.safCheckMachine.safCheckUsers, {
              checkUserNo: item.checkUserNo,
            });
            if (index > -1) {
              this.safCheckMachine.safCheckUsers[index] = item;
            } else {
              this.safCheckMachine.safCheckUsers.push(item);
            }
          } else {
            let index = this.$_.findIndex(this.safCheckMachine.safCheckUsers, {
              tempId: item.tempId,
            });
            if (index > -1) {
              this.safCheckMachine.safCheckUsers[index] = item;
            } else {
              this.safCheckMachine.safCheckUsers.push(item);
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
        selectConfig.saf.safCheckUser.get.url,
        this.safCheckMachine.checkMachineNo
      );
      this.editable = this.$route.meta.editable;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), 
          dataField: 'deptNm', 
          width: '25%', 
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002772'), 
          dataField: 'positionNm', 
          width: '25%', 
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001412'), 
          dataField: 'alarmUserId', 
          width: '25%', 
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'), 
          dataField: 'userNm', 
          width: '25%', 
          editable: false,
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnAddRow',
          visible: this.editable && !this.disabled
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'btnDelRow',
          visible: this.editable && !this.disabled
        },
      ]
      this.getDataList();
    },
    // 그리드
    getDataList() {
      if (this.safCheckMachine.checkMachineNo > 0) {
        
        this.$http.url = this.searchUrl;
        this.$http.type = 'GET';
        this.$http.param = this.searchParam;
        this.$http.request(
          (_result) => {
            this.gridOptions.data = _result.data;
            this.YAuiGrid.setGridData(_result.data)
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    btnAddRow() {
      if (!this.editable) return;
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.safCheckMachine.plantCd, // 선택한 사업장의 정보가 따라서 조회되도록 설정
        multiple: true,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    btnSearchUserClicked() {
      if (!this.editable) return;
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.safCheckMachine.plantCd, // 선택한 사업장의 정보가 따라서 조회되도록 설정
        multiple: true,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data === 'CLOSE') return;
      if (data.users != null) {
        this.$_.forEach(data.users, (item) => {
          let date = new Date();
          if (
            this.$_.findIndex(this.YAuiGrid.getGridData(), {
              alarmUserId: item.userId,
            }) === -1
          ) {
            // if (this.gridOptions.data.length === 0) {
            //   this.gridOptions.data = [];
            // }
            // this.gridOptions.data.push({
            //   tempId: item.userId + String(date.getTime()),
            //   checkMachineNo: this.safCheckMachine.checkMachineNo,
            //   alarmUserId: item.userId,
            //   deptNm: item.deptNm,
            //   positionNm: item.positionNm,
            //   userNm: item.userNm,
            // });
            let row = {
              tempId: item.userId + String(date.getTime()),
              checkMachineNo: this.safCheckMachine.checkMachineNo,
              alarmUserId: item.userId,
              deptNm: item.deptNm,
              positionNm: item.positionNm,
              userNm: item.userNm,
            };
            this.YAuiGrid.addRow(row, 'first');
          }
        });
        this.safCheckMachine.safCheckUsers = this.YAuiGrid.getGridData();
      }
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
      if (!this.safCheckMachine.deleteSafCheckUsers) {
        this.safCheckMachine.deleteSafCheckUsers = [];
      }
      for (let i = 0; i < removeData.length; i++) {
        this.safCheckMachine.deleteSafCheckUsers.push(removeData[i].item);
        this.YAuiGrid.removeRow(removeData[i].rowIndex);
      }
      this.safCheckMachine.safCheckUsers = this.YAuiGrid.getGridData();
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
        if (!this.safCheckMachine.deleteSafCheckUsers) {
          this.safCheckMachine.deleteSafCheckUsers = [];
        }

        this.$_.forEach(this.selectedValue, (item) => {
          if (item.tempId) {
            this.gridOptions.data.splice(
              this.$_.findIndex(this.gridOptions.data, { tempId: item.tempId }),
              1
            );
          } else {
            this.safCheckMachine.deleteSafCheckUsers.push(item);
            this.gridOptions.data.splice(
              this.$_.findIndex(this.gridOptions.data, {
                checkUserNo: item.checkUserNo,
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

    /** /Button Event **/
  },
};
</script>
