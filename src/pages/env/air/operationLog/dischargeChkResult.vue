<!--
  목적 : 환경 > 대기 > 운영일지 > 상세 > 배출구별 주요배출시설 가동(조업)시간
  작성자 : PSB
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 배출구별 주요배출시설 가동(조업)시간 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="opLogRslt.dischChkResult"
          :label="this.$comm.getLangSpecInfoLabel('L0000001149')"
          :editable="!this.disabled"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="false"
          @cellEditEnd="cellEditEndHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'eair-discharge-check-result',
  props: {
    tabEditable: false,
    updateMode: false,
    disabled: false,
    selectedMeasureYmd: '',
    selectedPlantCd: '',
    selectedDeptCd: '',
    opLogRslt: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      gridOptions: {
        name: 'dischargeChkResult',
        header: [],
        data: [],
        btns: [],
        height: '300',
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

      searchUrl: '',
      runTmItems: [],
      activeName: 'dischargeChkResult',
      YAuiGrid: null,
    };
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestory() {},
  methods: {
    init() {
      var i;
      for (i = 0; i <= 24; i++) {
        this.runTmItems.push({ code: String(i), codeNm: String(i) });
      }

      this.initGrid();
    },
    initGrid() {
      this.gridOptions.header = [
        // 배출구
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001142'),
          dataField: 'mainDischFacNm',
          width: '25%',
          style: 'left-align',
          editable: false,
        },
        // 배출시설
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001167'),
          dataField: 'eairDischFacNm',
          width: '25%',
          style: 'left-align',
          editable: false,
        },
        // 정상여부
        // { text: '정상여부', name: 'normalYn', width: '120px', align: 'center', type: 'select', items: this.statusItems, itemText: 'codeNm', itemValue: 'code', sortable: false, },
        // 가동시간(시)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000196'),
          dataField: 'runTm',
          width: '25%',
          style: 'right-align',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.runTmItems;
            },
            keyField: 'code', // key 에 해당되는 필드명
            valueField: 'codeNm', // value 에 해당되는 필드명
            disabledFunction: () => {
              return this.disabled;
            },
          },
        },
        // 가동시간(분)
        // { text: '가동시간(분)', name: 'runMin', width: '120px', align: 'center', type: 'select', items: this.runTmHours, itemText: 'codeNm', itemValue: 'code', sortable: false, },
        // 비고
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '25%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 150,
          },
        },
      ];

      // if (this.selectedMeasureYmd && this.selectedDeptCd) {
      //   this.getList();
      // }
    },

    // getList() {
    //   this.$http.url = this.$format(
    //     selectConfig.env.air.opLog.outletDischCheck.url,
    //     this.selectedPlantCd,
    //     this.selectedDeptCd,
    //     this.selectedMeasureYmd
    //   );
    //   this.$http.type = 'GET';

    //   this.$http.request(
    //     _result => {
    //       this.opLogRslt.dischChkResult = _result.data;
    //       console.log(this.opLogRslt.dischChkResult);
    //     },
    //     _error => {
    //       window.getApp.$emit('APP_REQUEST_ERROR', _error);
    //     }
    //   );
    // },

    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    cellEditEndHandler(event) {
      this.opLogRslt.dischChkResult = this.YAuiGrid.getGridData();
    },
  },
};
</script>

<style>
/**
  * 2022.04.01 LHJ
  * 대기 운영일지 항목 collapse 처리시 background color 기존과 동일하게 처리
  */

.oplog-collapse > div[role='tab'] > .el-collapse-item__header {
  background: rgb(241, 241, 241) !important;
}

.oplog-collapse > .el-collapse-item__wrap {
  background: rgb(241, 241, 241);
}

.oplog-collapse > .el-collapse-item__wrap > .el-collapse-item__content {
  padding-bottom: 0px;
}
</style>
