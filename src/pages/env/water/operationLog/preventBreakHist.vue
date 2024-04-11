<!--
  목적 : 운영일지-공급수 사용량
  작성자 : kkc
  Detail : 운영일지-공급수 사용량 조회,등록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="insertBox">
      <!-- 방지시설 고장유무 및 특기사항 -->
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001110')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
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
    tabDisabled: false,
  },
  data() {
    return {
      totalAmt: '',
      gridOptions: {
        name: 'preventBreakHist',
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
      changeSelectedRow: [],
      editable: true,
      isUpdate: false,
      editUrl: '',
      searchUrl: '',
      YAuiGrid: null,
    };
  },
  watch: {},
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
          // 고장시설명
          headerText: this.$comm.getLangSpecInfoLabel('L0000000481'),
          dataField: 'ewtrPreventFacNm',
          width: '100',
          style: 'left-align',
        },
        {
          // 고장시간
          headerText: this.$comm.getLangSpecInfoLabel('L0000000480'),
          dataField: 'downTime',
          width: '200',
          style: 'left-align',
        },
        {
          // 고장상태
          headerText: this.$comm.getLangSpecInfoLabel('L0000000479'),
          dataField: 'downCond',
          width: '150',
          style: 'left-align',
        },
        {
          // 조치상태
          headerText: this.$comm.getLangSpecInfoLabel('L0000002680'),
          dataField: 'action',
          width: '150',
          style: 'left-align',
        },
        {
          // 특기사항
          headerText: this.$comm.getLangSpecInfoLabel('L0000003012'),
          dataField: 'remark',
          width: '150',
          style: 'left-align',
        },
      ];

      this.searchUrl =
        selectConfig.env.water.operationLog.preventBreakHist.list.url;

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
        plantCd: this.paramPlantCd,
        deptCd: this.paramDeptCd,
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
  },
};
</script>
