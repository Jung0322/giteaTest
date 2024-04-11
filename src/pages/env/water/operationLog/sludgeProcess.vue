<!--
  목적 : 운영일지 기본정보
  작성자 : etg
  Detail : 운영일지 기본정보 상세,등록,수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 슬러지 처리시설 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001728')"
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
        name: 'sludgeProcess',
        header: [],
        data: [],
        btns: [],
        height: 200,
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
    };
  },
  watch: {
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
          // 슬러지 발생량(kg)
          headerText: this.$comm.getLangSpecInfoLabel('L0000001725'),
          dataField: 'amtSludgeGen',
          width: '10%',
          style: 'center-align',
        },
        {
          // 슬러지 처리량(kg)
          headerText: this.$comm.getLangSpecInfoLabel('L0000001727'),
          dataField: 'amtSludgeTx',
          width: '10%',
          style: 'center-align',
        },
        {
          // 슬러지 보관량(kg)
          headerText: this.$comm.getLangSpecInfoLabel('L0000001726'),
          dataField: 'amtSludgeSto',
          width: '10%',
          style: 'center-align',
        },
        {
          // 함수율(%)
          headerText: this.$comm.getLangSpecInfoLabel('L0000003172'),
          dataField: 'sludgeMc',
          width: '10%',
          style: 'center-align',
        },
        {
          // 보관장소
          headerText: this.$comm.getLangSpecInfoLabel('L0000001248'),
          dataField: 'sludgeStoPo',
          width: '15%',
          style: 'center-align',
        },
        {
          // 위탁처리업소
          headerText: this.$comm.getLangSpecInfoLabel('L0000002112'),
          dataField: 'sludgeTxPo',
          width: '15%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001729'),
          color: 'orange',
          btnClicked: 'btnClicked',
          visible: this.tabEditable && this.updateMode && !this.disabled,
        },
      ];

      this.editUrl =
        transactionConfig.env.water.operationLog.sludgeProcess.edit.url;
      this.searchUrl =
        selectConfig.env.water.operationLog.dailyReport.table.url;

      if (
        this.paramMeasureYmd &&
        this.paramEwtrCleanFacNo > 0 &&
        this.paramDeptCd
      ) {
        this.getList();
      }
    },

    getList() {
      let param = {};
      param.plantCd = !this.paramPlantCd ? '' : this.paramPlantCd;
      param.measureYmd = this.paramMeasureYmd;
      param.ewtrCleanFacNo = this.paramEwtrCleanFacNo;
      param.deptCd = this.paramDeptCd;
      const sucess = (res) => {
        this.YAuiGrid.setGridData(this.$_.clone(Array.from(res.data)));
      };
      this.$comm.reqHttp('GET', this.searchUrl, param, sucess);
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
      this.popupOptions.target = () => import(`${'./sludgeProcessDetail.vue'}`);
      this.popupOptions.title = 'L0000001728'; // '약품사용량 목록';
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
      this.$emit('getDetail');
    },
  },
};
</script>
