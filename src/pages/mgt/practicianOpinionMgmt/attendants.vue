<!--
  목적 : 등록/접수/조치결과 - 조사결과
  Detail : 조사결과
  *
  examples: 
  *
  -->
<template>
  <b-container fluid>
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="inGridOptions.name"
          :headers="inGridOptions.header"
          :btns="inGridOptions.btns"
          :height="inGridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001408')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :softRemoveRowMode="false"
          :showRowCheckColumn="true"
          @btnAddRowInGrid="btnAddRowInGrid"
          @btnDeleteRowInGrid="btnDeleteRowInGrid"
          @cellEditBegin="cellEditBeginHandler"
          @cellEditEnd="cellEditEndHandler"
        />
      </b-col>
    </b-row>
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid2"
          :editable="editable"
          :name="outGridOptions.name"
          :headers="outGridOptions.header"
          :btns="outGridOptions.btns"
          :height="outGridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002047')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="true"
          :softRemoveRowMode="false"
          @btnAddRowOutGrid="btnAddRowOutGrid"
          @btnDeleteRowOutGrid="btnDeleteRowOutGrid"
          @cellEditBegin="cellEditBeginOutHandler"
          @cellEditEnd="cellEditEndOutHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
export default {
  /* attributes: name, components, props, data */
  name: 'attendants',
  props: {
    industrialSafetyHealthCommittee: {
      type: Object,
      default() {
        return {
          // col0: 0,
          committeeConfNo: 0,
          progressStepCd: null,
          inMgtCommitteePsn: [],
          outMgtCommitteePsn: [],
        };
      },
    },
    editable: false,
    disabled: false,
    completeData: false,
  },
  data() {
    return {
      inGridOptions: {
        name: 'attendantsIngrid',
        btns: [],
        data: [],
        header: [],
        height: '200',
      },
      outGridOptions: {
        name: 'attendantsOutgrid',
        btns: [],
        data: [],
        header: [],
        height: '200',
      },
      YAuiGrid: null,
      AuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '100px',
        param: {},
        closeCallback: null,
      },
      inSelectedValue: [],
      outSelectedValue: [],
    };
  },
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.AuiGrid = this.$refs.yAuiGrid2;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.setGridHeader().then(() => {
        this.setData();
      });

      this.inGridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnAddRowInGrid',
          visible: !this.disabled,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDeleteRowInGrid',
          visible: !this.disabled,
        },
      ];

      this.outGridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnAddRowOutGrid',
          visible: !this.disabled,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDeleteRowOutGrid',
          visible: !this.disabled,
        },
      ];
    },
    setGridHeader() {
      return new Promise((resovle) => {
        this.inGridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
            dataField: 'deptNm',
            editable: false,
            width: '25%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
            dataField: 'userNm',
            width: '25%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
            dataField: 'dutyNm',
            width: '25%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'remark',
            width: '25%',
            editable: !this.disabled,
            editRenderer: {
              type: 'InputEditRenderer',
            },
          },
        ];
        this.outGridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001663'),
            dataField: 'deptNm',
            width: '25%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001631'),
            dataField: 'userNm',
            width: '25%',
            editable: !this.disabled,
            editRenderer: {
              type: 'InputEditRenderer',
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
            dataField: 'dutyNm',
            width: '25%',
            editable: !this.disabled,
            editRenderer: {
              type: 'InputEditRenderer',
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'remark',
            width: '25%',
            editable: !this.disabled,
            editRenderer: {
              type: 'InputEditRenderer',
            },
          },
        ];
        resovle();
      });
    },
    setData() {
      this.YAuiGrid.setGridData(
        this.industrialSafetyHealthCommittee.inMgtCommitteePsn
      );
      this.AuiGrid.setGridData(
        this.industrialSafetyHealthCommittee.outMgtCommitteePsn
      );
    },
    // 내부참석자 목록 셀 편집
    cellEditBeginHandler() {},
    cellEditEndHandler() {
      this.industrialSafetyHealthCommittee.inMgtCommitteePsn =
        this.YAuiGrid.getGridData();
    },

    // 외부참석자 목록 셀 편집
    cellEditBeginOutHandler() {},
    cellEditEndOutHandler() {
      this.industrialSafetyHealthCommittee.outMgtCommitteePsn =
        this.AuiGrid.getGridData();
    },
    // 내부참석자 행 추가
    btnAddRowInGrid() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.industrialSafetyHealthCommittee.plantCd,
        user: this.industrialSafetyHealthCommittee.inMgtCommitteePsn,
        multiple: true,
      };
      this.popupOptions.title = 'L0000001466'; /* 사용자검색 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePersonPopup;
    },
    closePersonPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.users) {
        this.$_.forEach(data.users, (user) => {
          if (
            this.$_.indexOf(
              this.$_.map(this.YAuiGrid.getGridData(), 'userId'),
              user.userId
            ) > -1
          ) {
            return;
          }
          let row = {
            userId: user.userId,
            userNm: user.userNm,
            deptNm: user.deptNm,
            dutyNm: user.dutyNm,
            positionNm: user.positionNm,
            remark: user.remark,
            psnClsCd: 'CLS01', // 내부
          };
          this.YAuiGrid.addRow(row, 'first');
        });

        this.industrialSafetyHealthCommittee.inMgtCommitteePsn =
          this.YAuiGrid.getGridData();
        // 추가
        // if (
        //   this.$_.findIndex(
        //     this.industrialSafetyHealthCommittee.inMgtCommitteePsn,
        //     {
        //       userId: data.user.userId,
        //     }
        //   ) === -1
        // ) {
        //   let row = {
        //     userId: data.user.userId,
        //     userNm: data.user.userNm,
        //     deptNm: data.user.deptNm,
        //     dutyNm: data.user.dutyNm,
        //     positionNm: data.user.positionNm,
        //     remark: data.user.remark,
        //   };
        //   this.YAuiGrid.addRow(row, 'last');
        //   this.industrialSafetyHealthCommittee.inMgtCommitteePsn.splice(0, 0, {
        //     mgtCommitteePsnNo: 0,
        //     committeeConfNo: 0,
        //     psnClsCd: 'CLS01', // 내부
        //     userId: data.user.userId,
        //     userNm: data.user.userNm,
        //     deptCd: data.user.deptCd,
        //     vendorCd: null,
        //     deptNm: data.user.deptNm,
        //     dutyNm: data.user.dutyNm,
        //     remark: null,
        //     signImg: null,
        //     signCfmYn: 'N',
        //     signRegDt: null,
        //   });
        // }
      }
    },
    // 내부참석자 삭제
    btnDeleteRowInGrid() {
      let gridData = this.YAuiGrid.getGridData();
      let selectedRows = this.YAuiGrid.getCheckedRowItemsAll();

      if (selectedRows.length > 0) {
        this.$_.forEach(selectedRows, (item) => {
          gridData = this.$_.reject(gridData, item);
        });
        this.YAuiGrid.setGridData(gridData);
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000911' /* 삭제 할 데이터를 선택하세요. */,
          type: 'warning', // success / info / warning / error
        });
      }
      this.industrialSafetyHealthCommittee.inMgtCommitteePsn = gridData;
    },
    // 외부참석자 행 추가
    btnAddRowOutGrid() {
      this.popupOptions.target = () =>
        import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003848'; /* 협력업체검색 */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
        multiSelect: true,
        plantCd: this.industrialSafetyHealthCommittee.plantCd,
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.data && data.data !== 'C') {
        this.$_.forEach(data.data, (item) => {
          if (
            this.$_.indexOf(
              this.$_.map(this.YAuiGrid.getGridData(), 'vendorCd'),
              item.vendorCd
            ) > -1
          ) {
            return;
          }
          let row = {
            userId: null,
            userNm: null,
            deptNm: item.vendorNm,
            vendorCd: item.vendorCd,
            dutyNm: null,
            remark: null,
            psnClsCd: 'CLS02',
          };
          this.AuiGrid.addRow(row, 'first');
        });

        this.industrialSafetyHealthCommittee.outMgtCommitteePsn =
          this.AuiGrid.getGridData();
        // let row = {
        //   userId: null,
        //   userNm: null,
        //   deptNm: data.data.vendorNm,
        //   vendorCd: data.data.vendorCd,
        //   dutyNm: null,
        //   remark: null,
        //   psnClsCd: 'CLS02',
        // };
        // this.AuiGrid.addRow(row, 'last');
        // this.industrialSafetyHealthCommittee.outMgtCommitteePsn.splice(0, 0, {
        //   rowId: uuidv4(),
        //   mgtCommitteePsnNo: 0,
        //   committeeConfNo: 0,
        //   psnClsCd: 'CLS02', // 외부
        //   userId: null,
        //   userNm: null,
        //   deptCd: null,
        //   vendorCd: data.data.vendorCd,
        //   deptNm: data.data.vendorNm,
        //   dutyNm: null,
        //   remark: null,
        //   signImg: null,
        //   signCfmYn: 'N',
        //   signRegDt: null,
        // });
      }
    },
    // 외부참석자 행 삭제
    btnDeleteRowOutGrid() {
      let gridData2 = this.AuiGrid.getGridData();
      let selectedRows2 = this.AuiGrid.getCheckedRowItemsAll();

      if (selectedRows2.length > 0) {
        this.$_.forEach(selectedRows2, (item) => {
          gridData2 = this.$_.reject(gridData2, item);
        });
        this.AuiGrid.setGridData(gridData2);
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000911' /* 삭제 할 데이터를 선택하세요. */,
          type: 'warning', // success / info / warning / error
        });
      }
      this.industrialSafetyHealthCommittee.outMgtCommitteePsn =
        this.AuiGrid.getGridData();
    },
  },
};
</script>
