<!--
  목적 : 환경 > 대기 > 운영일지 > 상세 > 원료사용량
  작성자 : jkl
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 원료사용량 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="opLogRslt.ingrCheckResult"
          :label="this.$comm.getLangSpecInfoLabel('L0000002090')"
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
  name: 'ingredient-check-result',
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
        name: 'ingredientCheckResult',
        header: [],
        data: [],
        btns: [],
        height: '300',
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
      activeName: 'ingredientCheckResult',
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
      this.gridOptions.header = [
        // 원료명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002088'),
          dataField: 'eairIngrNm',
          width: '33%',
          style: 'center-align',
          editable: false,
        },
        // 사용량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001445'),
          dataField: 'numResult',
          width: '33%',
          style: 'center-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true, // 0~9만 입력가능
            allowPoint: true, // 소수점( . ) 도 허용할지 여부
            allowNegative: true, // 마이너스 부호(-) 허용 여부
            textAlign: 'center',
            autoThousandSeparator: true, // 천단위 구분자 삽입 여부
          },
        },
        // 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'envUnitNm',
          width: '34%',
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
    //     selectConfig.env.air.opLog.getIngrChkResult.url,
    //     this.selectedDeptCd,
    //     this.selectedMeasureYmd,
    //     this.selectedPlantCd
    //   );
    //   this.$http.type = 'GET';
    //   this.$http.request(
    //     _result => {
    //       this.opLogRslt.ingrCheckResult = _result.data;
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
      this.opLogRslt.ingrCheckResult = this.YAuiGrid.getGridData();
    },
  },
};
</script>
