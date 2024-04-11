<!--
  목적 : 환경 > 수질 > 운영일지 > 운영일지 구분
  작성자 :
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 관리부서 -->
          <y-tree-dept
            :editable="editable"
            label="L0000000591"
            name="deptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 시설명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001743"
            name="ewtrCleanFacNm"
            v-model="searchParam.ewtrCleanFacNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <b-row>
      <b-col sm="12">
        <b-row class="grid-height grid-box">
          <b-col sm="12" class="h100p">
            <y-auigrid
              ref="yAuiGrid"
              :headers="gridOptions.header"
              :btns="gridOptions.btns"
              :height="gridOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000002988')"
              :useExcelExport="false"
              :showGridSetSave="true"
              @selectedRow="selectedRow"
              @btnSearch="getList"
              @btnSave="btnSave"
            />
          </b-col>
        </b-row>
        <b-row class="grid-height grid-box">
          <b-col sm="12" class="h100p">
            <y-auigrid
              ref="yAuiGrid2"
              :editable="editable"
              :headers="deptGridOptions.header"
              :btns="deptGridOptions.btns"
              :height="deptGridOptions.height"
              :items="deptGridOptions.data"
              :label="this.$comm.getLangSpecInfoLabel('L0000002348')"
              :showRightLabel="!this.selectedFlag"
              :rightLabel="this.$comm.getLangSpecInfoLabel('M0000001052')"
              :useExcelExport="false"
              :showGridSetSave="true"
              :showRowCheckColumn="true"
              @btnDeptAdd="btnDeptAdd"
              @btnDeptRemove="btnDeptRemove"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'operation-bagic-unit',

  props: {},
  data: function () {
    return {
      oplogBaseMst: {
        eairOplogBaseMstNo: 0,
        plantCd: '',
        deptCd: '',
        createUserId: '',
        createDt: '',
        updateUserId: '',
        updateDt: '',
        oplogBaseDept: [],
        oplogBase: [],
      },

      searchParam: {
        plantCd: '',
        deptCd: '',
        ewtrCleanFacNm: '',
      },

      gridOptions: {
        name: 'operationBagicUnit',
        header: [],
        data: [],
        btns: [],
        height: '350',
      },

      deptGridOptions: {
        name: 'operationBagicUnitDept',
        header: [],
        data: [],
        btns: [],
        height: '250',
        selectedItems: [],
      },

      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },

      selected: null,
      editable: false,
      saveFlag: false,
      isSave: false,
      selectedFlag: false,
      YAuiGrid: null,
      YAuiGrid2: null,
    };
  },
  watch: {
    'searchParam.plantCd': function (newVal, oldVal) {
      this.selectedFlag = false;
      this.getList();
    },
    'searchParam.deptCd': function (newVal, oldVal) {
      this.deptGridOptions.data = [];
      this.selectedFlag = false;
      if (this.searchParam.deptCd) {
        this.saveFlag = true;
        this.getList();
      } else {
        this.saveFlag = false;
        this.gridOptions.data = [];
        this.deptGridOptions.data = [];
      }
    },
    selected: function (newVal, oldVal) {
      if (this.selected) {
        this.selectedFlag = true;
      } else {
        this.selectedFlag = false;
      }
      this.setDeptBtns();
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
  },
  beforeDestory() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam.plantCd = this.$store.getters.plantCd;

      this.setGridHeader();
      this.setDeptBtns();
      // this.getList();
    },

    setGridHeader() {
      this.deptGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002348'), // 작성부서
          dataField: 'deptCd',
          width: '50%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002348'), // 작성부서명
          dataField: 'deptNm',
          width: '50%',
          style: 'center-align',
        },
      ];

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), // 사업장
          dataField: 'plantNm',
          width: '20%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'), // 관리부서
          dataField: 'deptNm',
          width: '20%',
          style: 'center-align',
        },

        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001744'), // 시설분류
          dataField: 'ewtrCleanFacClassNm',
          width: '20%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001743'), // 시설명
          dataField: 'ewtrCleanFacNm',
          width: '20%',
          style: 'left-align',
          sortable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'), // 사용여부
          dataField: 'useYn',
          width: '20%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002474'),
          color: 'orange',
          btnClicked: 'btnSave',
        }, // 저장
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, // 검색
      ];
    },

    setDeptBtns() {
      this.deptGridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001300'), // 부서추가
          color: 'orange',
          btnClicked: 'btnDeptAdd',
          visible: this.editable && this.selectedFlag,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001299'), // 부서제외
          color: 'red',
          btnClicked: 'btnDeptRemove',
          visible: this.editable && this.selectedFlag,
        },
      ];
    },

    btnSave() {
      if (!this.selected) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000001052', // 클린센터를 선택하세요.
          type: 'warning',
        });

        this.isSave = false;
      } else if (!this.searchParam.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000001048', // 사업장을 입력해주세요
          type: 'warning',
        });
        return;
      } else if (!this.searchParam.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000001049', // 관리부서를 입력해주세요
          type: 'warning',
        });
        return;
      } else if (
        !this.YAuiGrid2.getGridData() ||
        this.YAuiGrid2.getRowCount() === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000001047', // 작성부서를 입력해주세요
          type: 'warning',
        });
        return;
      } else {
        this.oplogBaseMst.oplogBaseDept = this.YAuiGrid2.getGridData();
        this.oplogBaseMst.plantCd = this.searchParam.plantCd;
        this.oplogBaseMst.mgDeptCd = this.searchParam.mgDeptCd;
      }

      this.$http.url =
        transactionConfig.env.water.baseInfo.basicUnit.insert.url;
      this.$http.type = 'POST';
      this.$http.param = this.oplogBaseMst.oplogBaseDept;
      this.$http.request(
        (_result) => {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000006', // 저장되었습니다.
            type: 'success',
          });
        },
        (_error) => {
          window.getApp.emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    getList() {
      if (!this.searchParam.deptCd) {
        this.saveFlag = false;
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000001050', // 관리부서를 선택하세요.
          type: 'warning',
        });

        return;
      } else {
        this.saveFlag = true;
      }

      this.$http.url = selectConfig.env.water.baseInfo.basicUnit.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.searchParam.plantCd,
        deptCd: this.searchParam.deptCd,
        ewtrCleanFacNm: this.searchParam.ewtrCleanFacNm,
      };
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectedRow(data) {
      if (!data) return;
      this.selected = data;

      this.$http.url = this.$format(
        selectConfig.env.water.baseInfo.basicUnit.deltList.url,
        data.ewtrCleanFacNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.deptGridOptions.data = _result.data;
          this.YAuiGrid2.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnDeptAdd() {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000001287'; // 부서
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.searchParam.plantCd,
      };
      this.popupOptions.width = '35%';
      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeDeptPopup;
    },
    closeDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data !== 'CLOSE') {
        this.$_.forEach(data, (item) => {
          if (
            this.$_.findIndex(this.deptGridOptions.data, {
              deptCd: item.deptCd,
            }) === -1
          ) {
            this.deptGridOptions.data.push({
              ewtrCleanFacNo: this.selected.ewtrCleanFacNo,
              deptCd: item.deptCd,
              deptNm: item.deptNm,
            });
          }
        });
        this.YAuiGrid2.setGridData(this.$_.clone(this.deptGridOptions.data));
      }
    },
    btnDeptRemove() {
      let removeData = this.YAuiGrid2.getCheckedRowItems();
      if (removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000530', // 제외할 부서를 선택하세요
          type: 'warning',
        });
        return;
      }

      for (let i = 0; i < removeData.length; i++) {
        this.YAuiGrid2.removeRow(removeData[i].rowIndex);
      }
    },
  },
};
</script>
