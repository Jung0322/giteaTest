<!--
  목적 : 환경 > 대기 > 운영일지 > 상세 > 방지시설 운전사항
  작성자 : PSB
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 방지시설 운전사항 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid1"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="opLogRslt.preventChkResult"
          :label="this.$comm.getLangSpecInfoLabel('L0000001115')"
          :editable="!this.disabled"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="false"
          @cellEditEnd="cellEditEndHandlerChk"
        />
      </b-col>
    </b-row>
    <!-- 약품사용량 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid2"
          :name="chemGridOptions.name"
          :headers="chemGridOptions.header"
          :btns="chemGridOptions.btns"
          :height="chemGridOptions.height"
          :items="opLogRslt.preventChemResults"
          :label="this.$comm.getLangSpecInfoLabel('L0000001923')"
          :editable="!this.disabled"
          :enableCellMerge="true"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="false"
          @cellEditEnd="cellEditEndHandlerChem"
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
  name: 'prevent-fac-oper-chk-result',
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
        name: 'preventFacOperChk',
        header: [],
        data: [],
        btns: [],
        height: '400',
      },
      chemGridOptions: {
        name: 'preventFacOperChem',
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
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },

      detailUrl: '',
      chemItems: [],
      preventActiveName: 'preventFacOperChkResult',
      drugActiveName: 'preventChkResult',
      YAuiGrid1: null,
      YAuiGrid2: null,
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
    this.YAuiGrid1 = this.$refs.yAuiGrid1;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
  },
  beforeDestory() {},
  methods: {
    init() {
      // 배출활동구분
      this.$comm.getComboItems('GHG_ACT_CD', false).then((_result) => {
        this.chemItems = _result;
      });
      this.initGrid();
    },
    initGrid() {
      this.gridOptions.header = [
        // 배출구
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001142'),
          dataField: 'mainDischFacNm',
          width: '120',
          style: 'left-align',
          editable: false,
        },
        // 방지시설
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001107'),
          dataField: 'eairPreventFacNm',
          width: '160',
          style: 'left-align',
          editable: false,
        },
        // 설치위치
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001626'),
          dataField: 'installPos',
          width: '160',
          style: 'left-align',
          editable: false,
        },
        // 전력량계명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002510'),
          dataField: 'eairPreventFacElecMeterNm',
          width: '150',
          style: 'right-align',
          editable: false,
        },
        // 전일지침
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004100'),
          dataField: 'prevPwrMeterCnt',
          width: '150',
          style: 'right-align',
          editable: false,
        },
        // 금일지침
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000762'),
          dataField: 'pwrMeterCnt',
          width: '150',
          style: 'right-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true, // 0~9만 입력가능
            allowNegative: true, // 마이너스 부호(-) 허용 여부
            textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
            autoThousandSeparator: true, // 천단위 구분자 삽입 여부
          },
        },
        // 전력계배율
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002504'),
          dataField: 'pwrMeterMagn',
          width: '150',
          style: 'right-align',
          editable: false,
        },
        // 사용량(kW/h)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001447'),
          dataField: 'pwrConsumAmt',
          width: '150',
          style: 'right-align',
          editable: false,
        },
        // 처리용량(M3/MIN)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002838'),
          dataField: 'dispoCap',
          width: '120',
          style: 'right-align',
          editable: false,
        },
        // 처리오염물질
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002834'),
          dataField: 'eairPolluNm',
          width: '160',
          style: 'left-align',
          editable: false,
        },
        // 처리농도(ppm/mg/Sm3)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002820'),
          dataField: 'dispoConc',
          width: '120',
          style: 'right-align',
          editable: false,
        },
        // 처리효율(%)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002841'),
          dataField: 'dispoEff',
          width: '120',
          style: 'right-align',
          editable: false,
        },
      ];

      this.chemGridOptions.merge.push({ index: 1, field: 'eairPreventFacNm' });

      this.chemGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001107'),
          dataField: 'eairPreventFacNm',
          width: '25%',
          style: 'left-align',
          editable: false,
          cellMerge: true,
        }, // 방지시설
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001915'),
          dataField: 'eairChemNm',
          width: '25%',
          style: 'left-align',
          editable: false,
        }, // 약품
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'envUnitNm',
          width: '25%',
          style: 'left-align',
          editable: false,
        }, // 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001445'),
          dataField: 'consumAmt',
          width: '25%',
          style: 'left-align',
          dataType: 'numeric',
          type: 'number',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true, // 0~9만 입력가능
            allowPoint: true, // 소수점( . ) 도 허용할지 여부
            allowNegative: true, // 마이너스 부호(-) 허용 여부
            textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
            autoThousandSeparator: true, // 천단위 구분자 삽입 여부
          },
        }, // 사용량
      ];

      // if (this.selectedMeasureYmd && this.selectedDeptCd) {
      //   this.getList();
      //   this.getChemList();
      // }
    },
    // getList() {
    //   this.$http.url = this.$format(
    //     selectConfig.env.air.opLog.outletPeventCheck.url,
    //     this.selectedPlantCd,
    //     this.selectedDeptCd,
    //     this.selectedMeasureYmd
    //   );
    //   this.$http.type = 'GET';
    //   this.$http.request(
    //     _result => {
    //       this.opLogRslt.preventChkResult = _result.data;
    //     },
    //     _error => {
    //       window.getApp.$emit('APP_REQUEST_ERROR', _error);
    //     }
    //   );
    // },
    getChemList() {
      this.$http.url = this.$format(
        selectConfig.env.air.opLog.outletPreventChem.url,
        this.selectedDeptCd,
        this.selectedMeasureYmd
      );
      this.$http.get = 'GET';
      this.$http.request(
        (_result) => {
          this.opLogRslt.preventChemResults = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    cellEditEndHandlerChk(event) {
      this.opLogRslt.preventChkResult = this.YAuiGrid1.getGridData();

      event.item.pwrConsumAmt =
        (event.item.pwrMeterCnt - event.item.prevPwrMeterCnt) *
        event.item.pwrMeterMagn;
      this.opLogRslt.preventChkResult[event.rowIndex].pwrConsumAmt =
        event.item.pwrConsumAmt;

      this.YAuiGrid1.setGridData(this.opLogRslt.preventChkResult);
    },
    cellEditEndHandlerChem(event) {
      this.opLogRslt.preventChemResults = this.YAuiGrid2.getGridData();
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
