<!--
  목적 : 폐기물-폐기물원단위
  작성자 : khk
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
          <!-- 연도 -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000001991"
            name="measureYear"
            v-model="searchParam.measureYear"
            :default="searchParam.measureYear"
          />
        </b-col>
      </b-row>
    </y-search-box>
    
    <!-- 폐기물 원단위 현황 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003109')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'wst-gen-status',
  props: {},
  data() {
    return {
      searchParam: {
        measureYear: '',
      },
      gridOptions: {
        name: 'wstGenStatus',
        header: [],
        data: [],
        btns: [],
        height: '350',
      },
      searchUrl: '',
      editable: false,
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
    this.searchParam.measureYear = this.$comm.moment().format('YYYY');
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  beforeDestroy() {
  },
  methods: {
    init() {
      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), dataField: 'plant_nm', width: '160', style: 'center-align', },
        // 구분
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), dataField: 'gubun', width: '180', style: 'center-align', },
        // 단위
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000870'), dataField: 'unit_nm', width: '120', style: 'center-align', },
        // 종합
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002707'), dataField: 'sum', width: '120', style: 'center-align', },
        // 1월
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000042'), dataField: 'mm1', width: '120', style: 'center-align', },
        // 2월
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000043'), dataField: 'mm2', width: '120', style: 'center-align', },
        // 3월
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000044'), dataField: 'mm3', width: '120', style: 'center-align', },
        // 4월
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000045'), dataField: 'mm4', width: '120', style: 'center-align', },
        // 5월
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000046'), dataField: 'mm5', width: '120', style: 'center-align', },
        // 6월
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000047'), dataField: 'mm6', width: '120', style: 'center-align', },
        // 7월
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000048'), dataField: 'mm7', width: '120', style: 'center-align', },
        // 8월
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000049'), dataField: 'mm8', width: '120', style: 'center-align', },
        // 9월
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000050'), dataField: 'mm9', width: '120', style: 'center-align', },
        // 10월
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000051'), dataField: 'mm10', width: '120', style: 'center-align', },
        // 11월
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000052'), dataField: 'mm11', width: '120', style: 'center-align', },
        // 12월
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000053'), dataField: 'mm12', width: '120', style: 'center-align', },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        }, //  검색
      ];

      this.searchUrl = selectConfig.env.waste.operationLog.dailyReport.wstBasicUnitStatus.list.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    myRowClassName({ row, rowIndex }) {
      if (rowIndex === 7 || rowIndex === 10) {
        return 'sum-row';
      }
      return '';
    },
    btnSearchClickedCallback(result) {
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 295;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
