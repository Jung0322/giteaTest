<!--
  목적 : 환경 > 대기 > 운영일지 > 운영일지 구분
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
            name="mgDeptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.mgDeptCd"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <b-row>
      <b-col sm="12">
        <b-row class="grid-height grid-box">
          <b-col sm="12" class="h100p">
            <y-auigrid
              ref="yAuiGrid"
              :editable="editable"
              :headers="gridOptions.header"
              :btns="gridOptions.btns"
              :height="gridOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000005774')"
              :useExcelExport="false"
              :showGridSetSave="true"
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
        mgDeptCd: '',
        createUserId: '',
        createDt: '',
        updateUserId: '',
        updateDt: '',
        oplogBaseDept: [],
        oplogBase: [],
      },

      searchParam: {
        plantCd: '',
        mgDeptCd: '',
      },

      gridOptions: {
        name: 'operationBagicUnit',
        header: [],
        data: [],
        btns: [],
        height: '350',
        merge: [],
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

      editable: false,
      saveFlag: false,
      saveUrl: '',
      actionType: 'POST',
      isSave: false,
      YAuiGrid: null,
      YAuiGrid2: null,
    };
  },
  watch: {
    'searchParam.plantCd': function (newVal, oldVal) {
      this.getList();
    },
    'searchParam.mgDeptCd': function (newVal, oldVal) {
      if (this.searchParam.mgDeptCd) {
        this.saveFlag = true;
        this.getList();
      } else {
        this.saveFlag = false;
        this.gridOptions.data = [];
        this.deptGridOptions.data = [];
      }
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
      this.oplogBaseMst.plantCd = this.$store.getters.plantCd;

      this.setGridHeader();
      // this.getList();

      this.gridOptions.merge = [];
      this.gridOptions.merge.push(
        {
          index: 0,
          field: 'eairOutletNm',
        },
        { index: 1, field: 'mainDischFacNm' },
        // { index: 2, field: 'eairOutletPermitNo' },
        { index: 2, field: 'eairPreventFacNm' },
        { index: 4, field: 'eairSerialPreventFacNo' }
      );
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
          headerText: this.$comm.getLangSpecInfoLabel('L0000004411'), // 작성부서명
          dataField: 'deptNm',
          width: '50%',
          style: 'center-align',
        },
      ];
      this.deptGridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001300'), // 부서추가
          color: 'orange',
          btnClicked: 'btnDeptAdd',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001299'), // 부서제외
          color: 'red',
          btnClicked: 'btnDeptRemove',
        },
      ];

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004412'), // 일련번호
          dataField: 'eairOutletNm',
          width: '13%',
          style: 'center-align',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001147'), // 배출구명
          dataField: 'mainDischFacNm',
          width: '12%',
          style: 'center-align',
          editable: false,
        },

        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004413'), // 방지시설명(병렬)
          dataField: 'eairPreventFacNm',
          width: '13%',
          style: 'center-align',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004414'), // 차순
          dataField: 'serial',
          width: '12%',
          style: 'center-align',
          editable: false,
          sortable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004415'), // 방지시설명(직렬)
          dataField: 'eairSerialPreventFacNm',
          width: '13%',
          style: 'center-align',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001174'), // 배출시설명
          dataField: 'eairDischFacNm',
          width: '13%',
          style: 'center-align',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004416'), // 대표배출시설
          dataField: 'oplogDischYn',
          width: '12%',
          style: 'center-align',
          editable: true,
          renderer: {
            type: 'CheckBoxEditRenderer',
            editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
            checkValue: 'Y', // true, false 인 경우가 기본
            unCheckValue: 'N',
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004417'), // 방지시설 운전여부
          dataField: 'oplogPreventYn',
          width: '12%',
          style: 'center-align',
          editable: !this.disabled,
          renderer: {
            type: 'CheckBoxEditRenderer',
            editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
            checkValue: 'Y', // true, false 인 경우가 기본
            unCheckValue: 'N',
          },
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

    btnSave() {
      if (!this.YAuiGrid2.getGridData() || this.YAuiGrid2.getRowCount() === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001047', // 작성부서를 입력해주세요
          type: 'warning',
        });
        return;
      } else if (!this.searchParam.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001048', // 사업장을 입력해주세요
          type: 'warning',
        });
        return;
      } else if (!this.searchParam.mgDeptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001049', // 관리부서를 입력해주세요
          type: 'warning',
        });
        return;
      } else {
        this.oplogBaseMst.oplogBase = this.YAuiGrid.getGridData();
        this.oplogBaseMst.oplogBaseDept = this.YAuiGrid2.getGridData();

        this.oplogBaseMst.plantCd = this.searchParam.plantCd;
        this.oplogBaseMst.mgDeptCd = this.searchParam.mgDeptCd;
      }

      if (this.oplogBaseMst.eairOplogBaseMstNo > 0) {
        this.actionType = 'PUT';
        this.saveUrl = transactionConfig.env.air.baseInfo.oplogBase.edit.url;
        this.oplogBaseMst.updateUserId = this.$store.getters.token;
      } else {
        this.actionType = 'POST';
        this.saveUrl = transactionConfig.env.air.baseInfo.oplogBase.insert.url;
        this.oplogBaseMst.createUserId = this.$store.getters.token;
      }

      this.$http.url = this.saveUrl;
      this.$http.type = this.actionType;
      this.$http.param = this.oplogBaseMst;
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
      if (!this.searchParam.mgDeptCd) {
        this.saveFlag = false;
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001050', // 관리부서를 선택하세요.
          type: 'warning',
        });

        return;
      } else {
        this.saveFlag = true;
      }

      this.$http.url = selectConfig.env.air.baseInfo.oplogBase.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.searchParam.plantCd,
        mgDeptCd: this.searchParam.mgDeptCd,
      };
      this.$http.request(
        (_result) => {
          this.oplogBaseMst = _result.data;
          this.YAuiGrid.setGridData(this.$_.clone(this.oplogBaseMst.oplogBase));
          this.YAuiGrid2.setGridData(
            this.$_.clone(this.oplogBaseMst.oplogBaseDept)
          );

          if (this.oplogBaseMst.eairOplogBaseMstNo === 0) {
            this.$_.forEach(this.gridOptions.data, (item) => {
              if (item.serial === 1 || item.serial === 0) {
                item.oplogDischYn = 'Y';
              }

              if (item.eairOplogBaseMstNo === 0) {
                item.oplogPreventYn = 'Y';
              }
            });
          }
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
        plantCd: this.oplogBaseMst.plantCd,
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
          this.YAuiGrid2.addRow(item);
        });
      }
    },
    btnDeptRemove() {
      let removeData = this.YAuiGrid2.getCheckedRowItems();
      if (removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000530', // 제외할 부서를 선택하세요
          type: 'warning',
        });
        return;
      }

      let gridData = this.YAuiGrid2.getGridData();
      const selectedRows = this.YAuiGrid2.getCheckedRowItems().map(
        (row) => row.item
      );
      this.$_.forEach(selectedRows, (item) => {
        gridData = this.$_.reject(gridData, item);
      });

      this.oplogBaseMst.oplogBaseDept = gridData;
      this.YAuiGrid2.setGridData(gridData);
      this.cellEditEndHandler();
    },
  },
};
</script>
