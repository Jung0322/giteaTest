<!--
  목적 : 운영일지-전력 사용량
  작성자 : etg
  Detail : 운영일지-전력 사용량 조회,등록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 전력 사용량 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002502')"
          :showRightLabel="true"
          :rightLabel="this.$comm.getLangSpecInfoLabel('L0000000763')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @btnClicked="btnClicked"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'pwrc-chk-result',
  props: {
    tabEditable: false,
    paramEwtrCleanFacNo: 0,
    paramMeasureYmd: '',
    paramPlantCd: '',
    paramDeptCd: '',
    authDuringAppr: false,
    apprMode: false,
    updateMode: false,
    disabled: false,
  },
  data() {
    return {
      gridOptions: {
        name: 'pwrcChkResult',
        header: [],
        data: [],
        btns: [],
        height: 300,
        selectedRowData: {
          pwrMeterCntY: null,
          pwrMeterCntT: null,
          pwrConsumAmt: null,
        },
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
      editable: true,
      isSaveDisable: true,
      isUpdate: false,
      editUrl: '',
      searchUrl: '',
      YAuiGrid: null,
    };
  },
  watch: {
    'gridOptions.selectedRowData.pwrMeterCntT': function (newValue, oldValue) {
      this.gridOptions.selectedRowData.pwrConsumAmt = this.getCalc(
        this.gridOptions.selectedRowData.pwrMeterCntY,
        this.gridOptions.selectedRowData.pwrMeterCntT,
        this.gridOptions.selectedRowData.pwrMeterMagn
      );
    },
    updateMode: {
      handler: function (val, oldVal) {
        console.log('123', this.updateMode);
        if (this.updateMode) {
          this.gridOptions.btns[0].visible = true;
        } else {
          this.gridOptions.btns[0].visible = false;
        }
      },
      deep: true,
    },
    disabled: {
      handler: function (newVal, oldVal) {
        console.log('123aaa', this.disabled);
        if (this.disabled) {
          this.gridOptions.btns[0].visible = false;
        } else {
          this.gridOptions.btns[0].visible = true;
        }
      },
      deep: true,
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          // 전력사용량계명
          headerText: this.$comm.getLangSpecInfoLabel('L0000002511'),
          dataField: 'ewtrPwrMeterNm',
          width: '180',
          style: 'left-align',
        },
        {
          // 가동시간
          headerText: this.$comm.getLangSpecInfoLabel('L0000000191'),
          dataField: 'runTm',
          width: '150',
          style: 'left-align',
        },
        {
          // 사용량(kWh)
          headerText: this.$comm.getLangSpecInfoLabel('L0000001448'),
          dataField: 'pwrConsumAmt',
          width: '120',
          style: 'center-align',
        },
        {
          // 금일폐수 1㎥당 소모전력량(kWh/㎥)
          headerText: this.$comm.getLangSpecInfoLabel('L0000000764'),
          dataField: 'pwrcPerDay',
          width: '200',
          style: 'center-align',
        },
        {
          // 검침시간
          headerText: this.$comm.getLangSpecInfoLabel('L0000000379'),
          dataField: 'chkTime',
          width: '150',
          style: 'left-align',
        },
        {
          // 전력량계 지침
          headerText: this.$comm.getLangSpecInfoLabel('L0000002509'),
          children: [
            {
              // 전일
              headerText: this.$comm.getLangSpecInfoLabel('L0000002515'),
              dataField: 'pwrMeterCntY',
              width: '120',
              style: 'center-align',
            },
            {
              // 금일
              headerText: this.$comm.getLangSpecInfoLabel('L0000003595'),
              dataField: 'pwrMeterCntT',
              width: '120',
              style: 'center-align',
            },
            {
              // 배율
              headerText: this.$comm.getLangSpecInfoLabel('L0000001136'),
              dataField: 'pwrMeterMagn',
              width: '120',
              style: 'center-align',
            },
          ],
        },
        {
          // 참고사항
          headerText: this.$comm.getLangSpecInfoLabel('L0000002800'),
          dataField: 'remark',
          width: '250',
          style: 'left-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002503'),
          color: 'orange',
          btnClicked: 'btnClicked',
          visible: this.tabEditable && this.updateMode && !this.disabled,
        },
      ];

      this.editUrl =
        transactionConfig.env.water.operationLog.pwrcChkResult.edit.url;
      this.searchUrl =
        selectConfig.env.water.operationLog.pwrcChkResult.list.url;

      if (
        this.paramMeasureYmd !== null &&
        this.paramEwtrCleanFacNo !== null &&
        this.paramDeptCd
      ) {
        this.getList();
      }
    },

    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        measureYmd: this.paramMeasureYmd,
        ewtrCleanFacNo: this.paramEwtrCleanFacNo,
        deptCd: this.paramDeptCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.forEach((item) => {
            item.pwrConsumAmt = this.getCalc(
              item.pwrMeterCntY,
              item.pwrMeterCntT,
              item.pwrMeterMagn
            );
          });
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));

          if (_result.data.length > 0) {
            this.isSaveDisable = false;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    changeSelectedRow(row) {
      this.gridOptions.selectedRowData = row;

      this.gridOptions.selectedRowData.pwrConsumAmt = this.getCalc(
        this.gridOptions.selectedRowData.pwrMeterCntY,
        this.gridOptions.selectedRowData.pwrMeterCntT,
        this.gridOptions.selectedRowData.pwrMeterMagn
      );
    },
    getCalc(pwrMeterCntY, pwrMeterCntT, pwrMeterMagn) {
      if (pwrMeterCntY && pwrMeterCntT) {
        // 금일검침 - 전일검침
        return ((pwrMeterCntT - pwrMeterCntY) * Number(pwrMeterMagn)).toFixed(
          2
        );
      } else if (pwrMeterCntT) {
        let tempPwrMeterMagn = Number(pwrMeterMagn) ? Number(pwrMeterMagn) : 1;
        return (Number(pwrMeterCntT) * tempPwrMeterMagn).toFixed(2);
      } else return '0.00';
    },
    getDataSet() {
      this.$http.url =
        selectConfig.env.water.operationLog.pwrcChkResult.default.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrCleanFacNo: this.paramEwtrCleanFacNo,
        measureYmd: this.paramMeasureYmd,
        plantCd: this.paramPlantCd,
      };

      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;

          if (_result.data.length > 0) {
            this.isSaveDisable = false;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnClicked() {
      this.popupOptions.target = () => import(`${'./pwrcChkResultDetail.vue'}`);
      this.popupOptions.title = 'L0000002502'; // 전력 사용량 목록
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        paramMeasureYmd: this.paramMeasureYmd,
        paramPlantCd: this.paramPlantCd,
        paramEwtrCleanFacNo: this.paramEwtrCleanFacNo,
        paramDeptCd: this.paramDeptCd,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      this.isUpdate = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>
