<!--
  목적 : 운영일지-공급수 사용량
  작성자 : etg
  Detail : 운영일지-공급수 사용량 조회,등록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="insertBox">
      <b-col sm="12">
        <!-- 공급수 사용량 목록 -->
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000000490')"
            :useExcelExport="false"
            :enableSorting="true"
            :showGridSetSave="true"
            @btnClicked="btnClicked"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4 mt-1">
          <!-- 총사용량(m³/일) -->
          <y-text
            :width="8"
            :editable="editable"
            ui="bootstrap"
            label="L0000002865"
            :disabled="true"
            name="totalAmt"
            v-model="totalAmt"
          ></y-text>
        </b-col>
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
  name: 'supl-chk-result',
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
      totalAmt: '',
      gridOptions: {
        name: 'suplChkResult',
        header: [],
        data: [],
        btns: [],
        height: 300,
        selectedRowData: {
          meterCntY: null,
          meterCntT: null,
          consumAmt: null,
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
    'gridOptions.selectedRowData.meterCntT': function (newValue, oldValue) {
      this.gridOptions.selectedRowData.consumAmt = this.getCalc(
        this.gridOptions.selectedRowData.meterCntY,
        this.gridOptions.selectedRowData.meterCntT
      );
      this.totalAmt = 0;
      this.$_.forEach(this.gridOptions.data, (row) => {
        this.totalAmt =
          parseFloat(this.totalAmt) +
          (!row.consumAmt ? 0 : parseFloat(row.consumAmt));
      });
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
          // '공급수분류명',
          headerText: this.$comm.getLangSpecInfoLabel('L0000000495'),
          dataField: 'ewtrSuplClassNm',
          width: '100',
          style: 'left-align',
        },
        {
          // '공급수명',
          headerText: this.$comm.getLangSpecInfoLabel('L0000000494'),
          dataField: 'ewtrSuplNm',
          width: '150',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002767'), // '지침(㎥)',
          children: [
            {
              // '전일',
              headerText: this.$comm.getLangSpecInfoLabel('L0000002515'),
              dataField: 'meterCntY',
              width: '100',
              style: 'center-align',
            },
            {
              // '금일',
              headerText: this.$comm.getLangSpecInfoLabel('L0000003595'),
              dataField: 'meterCntT',
              width: '100',
              style: 'center-align',
            },
          ],
        },
        {
          // '사용량(㎥/일)',
          headerText: this.$comm.getLangSpecInfoLabel('L0000001449'),
          dataField: 'consumAmt',
          width: '100',
          style: 'center-align',
        },
        {
          // '검침시간',
          headerText: this.$comm.getLangSpecInfoLabel('L0000000379'),
          dataField: 'chkTime',
          width: '100',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000491'),
          color: 'orange',
          btnClicked: 'btnClicked',
          visible: this.tabEditable && this.updateMode && !this.disabled,
        },
      ];

      this.editUrl =
        transactionConfig.env.water.operationLog.suplChkResult.edit.url;
      this.searchUrl =
        selectConfig.env.water.operationLog.suplChkResult.list.url;
      if (
        this.paramMeasureYmd &&
        this.paramEwtrCleanFacNo > 0 &&
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
            item.consumAmt = this.getCalc(item.meterCntY, item.meterCntT);
          });
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.totalAmt = 0;
          this.$_.forEach(this.gridOptions.data, (row) => {
            this.totalAmt =
              parseFloat(this.totalAmt) +
              (!row.consumAmt ? 0 : parseFloat(row.consumAmt));
          });

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
      this.gridOptions.selectedRowData.consumAmt = this.getCalc(
        this.gridOptions.selectedRowData.meterCntY,
        this.gridOptions.selectedRowData.meterCntT
      );
      this.totalAmt = 0;
      this.$_.forEach(this.gridOptions.data, (row) => {
        this.totalAmt =
          parseFloat(this.totalAmt) +
          (!row.consumAmt ? 0 : parseFloat(row.consumAmt));
      });
    },
    getCalc(meterCntY, meterCntT) {
      if (meterCntY != null && meterCntT != null) {
        // 금일검침 - 전일검침
        return (meterCntT - meterCntY).toFixed(2);
      } else if (meterCntT != null) {
        return Number(meterCntT).toFixed(2);
      } else return '0.00';
    },
    btnClicked() {
      console.log(this.paramDeptCd);
      this.popupOptions.target = () =>
        import(`${'./suplChkResultDetail2.vue'}`);
      this.popupOptions.title = 'L0000000490'; // '공급수 사용량 목록';
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
  },
};
</script>
