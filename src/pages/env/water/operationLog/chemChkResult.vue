<!--
  목적 : 운영일지-약품 사용량
  작성자 : etg
  Detail : 운영일지-약품 사용량 조회,등록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="insertBox">
      <b-col sm="12">
        <!-- 약품 사용량 목록 -->
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000003635')"
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
  name: 'chem-chk-result',
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
        name: 'chemChkResult',
        header: [],
        data: [],
        btns: [],
        height: 300,
        selectedRowData: {
          prevAmountCurr: 0,
          inAmt: 0,
          consumAmt: 0,
          amountCurr: 0,
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
      initData: [],
      firstFlag: true,
      YAuiGrid: null,
      totalAmt: null,
    };
  },
  watch: {
    'gridOptions.selectedRowData.inAmt': function (newValue, oldValue) {
      this.gridOptions.selectedRowData.amountCurr =
        Number(this.gridOptions.selectedRowData.prevAmountCurr) +
        Number(this.gridOptions.selectedRowData.inAmt) -
        Number(this.gridOptions.selectedRowData.consumAmt);
    },
    'gridOptions.selectedRowData.consumAmt': function (newValue, oldValue) {
      this.gridOptions.selectedRowData.amountCurr =
        Number(this.gridOptions.selectedRowData.prevAmountCurr) +
        Number(this.gridOptions.selectedRowData.inAmt) -
        Number(this.gridOptions.selectedRowData.consumAmt);
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
          // 구분
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'ewtrDischGrpNm',
          width: '15%',
          style: 'left-align',
        },
        {
          // 약품명
          headerText: this.$comm.getLangSpecInfoLabel('L0000001922'),
          dataField: 'ewtrChemNm',
          width: '15%',
          style: 'left-align',
        },
        {
          // 전일잔고량
          headerText: this.$comm.getLangSpecInfoLabel('L0000002516'),
          dataField: 'prevAmountCurr',
          width: '10%',
          style: 'center-align',
        },
        {
          // 구입량
          headerText: this.$comm.getLangSpecInfoLabel('L0000000701'),
          dataField: 'inAmt',
          width: '10%',
          style: 'center-align',
        },
        {
          // 약품사용량
          headerText: this.$comm.getLangSpecInfoLabel('L0000001923'),
          dataField: 'consumAmt',
          width: '10%',
          style: 'center-align',
        },
        {
          // 잔고량
          headerText: this.$comm.getLangSpecInfoLabel('L0000002448'),
          dataField: 'amountCurr',
          width: '10%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001917'),
          color: 'orange',
          btnClicked: 'btnClicked',
          visible: this.tabEditable && this.updateMode && !this.disabled,
        },
      ];

      this.editUrl =
        transactionConfig.env.water.operationLog.chemChkResult.edit.url;
      this.searchUrl =
        selectConfig.env.water.operationLog.chemChkResult.list.url;

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
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));

          if (this.firstFlag === true) {
            this.initData = JSON.parse(JSON.stringify(_result.data));
            this.firstFlag = false;
          }

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
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    btnClicked() {
      this.popupOptions.target = () => import(`${'./chemChkResultDetail.vue'}`);
      this.popupOptions.title = 'L0000003635'; // '약품사용량 목록';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        paramMeasureYmd: this.paramMeasureYmd,
        paramPlantCd: this.paramPlantCd,
        paramEwtrCleanFacNo: this.paramEwtrCleanFacNo,
        paramDeptCd: this.paramDeptCd,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
  },
};
</script>
