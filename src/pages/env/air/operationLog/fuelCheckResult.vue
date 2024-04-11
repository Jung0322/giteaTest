<!--
  목적 : 환경 > 대기 > 운영일지 > 상세 > 연료사용량
  작성자 : jkl
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 연료사용량 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="opLogRslt.fuelCheckResult"
          :label="this.$comm.getLangSpecInfoLabel('L0000002002')"
          :editable="!this.disabled"
          :enableCellMerge="true"
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
  name: 'fuel-check-result',
  props: {
    tabEditable: false,
    updateMode: false,
    disabled: false,
    selectedMeasureYmd: '',
    selectedDeptCd: '',
    selectedPlantCd: '',
    opLogRslt: {},
  },
  data() {
    return {
      gridOptions: {
        name: 'fuelCheckResult',
        header: [],
        data: [],
        btns: [],
        height: '300',
        merge: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      detailUrl: '',
      activeName: 'fuelCheckResult',
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
      this.gridOptions.merge.push({ index: 1, field: 'eairDischFacNm' });

      this.gridOptions.header = [
        // 배출시설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001174'),
          dataField: 'eairDischFacNm',
          width: '25%',
          style: 'left-align',
          editable: false,
          cellMerge: true,
        },
        // 연료명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002000'),
          dataField: 'eairFuelNm',
          width: '25%',
          style: 'left-align',
          editable: false,
        },
        // 사용량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001445'),
          dataField: 'numResult',
          width: '25%',
          style: 'right-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true, // 0~9만 입력가능
            allowPoint: true, // 소수점( . ) 도 허용할지 여부
            allowNegative: true, // 마이너스 부호(-) 허용 여부
            textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
            autoThousandSeparator: true, // 천단위 구분자 삽입 여부
          },
        },
        // 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'envUnitNm',
          width: '25%',
          style: 'center-align',
          editable: false,
        },
      ];

      // if (this.selectedMeasureYmd && this.selectedDeptCd) {
      //   this.getList();
      // }
    },
    // getList() {
    //   this.$http.url = this.$format(
    //     selectConfig.env.air.opLog.dischFuelResult.url,
    //     this.selectedDeptCd,
    //     this.selectedMeasureYmd
    //   );
    //   this.$http.type = 'GET';
    //   this.$http.request(
    //     _result => {
    //       this.opLogRslt.fuelCheckResult = _result.data;
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
      this.opLogRslt.fuelCheckResult = this.YAuiGrid.getGridData();
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
