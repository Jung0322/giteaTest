<!--
  목적 : 검진 계획
  Detail : 검진계획 검색/등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :useBtn="false"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
        />
      </b-col>

      <!-- <b-col sm="12">
        <b-col sm="12" class="px-0">
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :showSummary="true"
          ></y-data-table>
        </b-col>
      </b-col> -->
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import echarts from 'echarts';
require('echarts/theme/macarons');
export default {
  name: 'audit-analysis-status',
  props: {
    searchParam: {
      type: Object,
      default: function () {
        return {
          plantCd: '',
          year: '',
          col1: '',
        };
      },
    },
    searchFlag: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  data() {
    return {
      chart1: null,
      chart2: null,
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '425',
      },
      editable: false,
      searchUrl: '',
      chartData: [],
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
    };
  },
  watch: {
    searchFlag() {
      this.setGridData().then(() => {
        this.getDataList();
      });

      // this.getChartData();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    // this.getChartData();
  },
  beforeDestroy() {},
  activated() {
    this.resizeGrid();
  },
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.auditAnalysis.analyList.url;
      this.headerUrl = selectConfig.saf.auditAnalysis.gridSetting.url;
      this.editable = this.$route.meta.editable;

      this.setGridData().then(() => {
        this.getDataList();
      });
    },
    setGridData() {
      return new Promise((resolve) => {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003199'),
            dataField: 'auditStdNm',
            width: '25%',
            style: 'left-align',
          } /* 항목 */,
        ];

        const temp = [];
        this.searchParam.deptCds = [];
        this.$http.url = this.headerUrl;
        this.$http.param = this.searchParam;
        this.$http.type = 'GET';
        this.$http.request((_result) => {
          this.chartData = _result.data;
          this.$_.forEach(_result.data, (item) => {
            this.gridOptions.header.push({
              headerText: item.dept_nm,
              dataField: 'dept' + item.dept_cd,
              width: '100',
              style: 'right-align',
              dataType: 'numeric',
              formatString: '#,##0',
            });
            // this.gridOptions.header.splice(this.gridOptions.header.length, 0, {
            //   text: item.dept_nm,
            //   name: 'dept' + item.dept_cd,
            //   width: '140px',
            //   align: 'center',
            //   type: 'cost',
            // });

            temp.push(item.dept_cd);
          });

          this.gridOptions.header.push(
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002762'),
              dataField: 'totImpr',
              width: '100',
              style: 'right-align',
              dataType: 'numeric',
              formatString: '#,##0',
            } /* 지적건수 */
          );
          this.YAuiGrid.changeColumnLayout(this.gridOptions.header);
          this.searchParam.deptCds = temp;

          resolve();
        });
      });
    },
    // 검진 계획 그리드
    getDataList() {
      // 그리드 헤더 설정
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.$comm.pushCookie(this.searchParam);
          this.getChartData(this.gridOptions.data, this.chartData);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** Button Event **/
    /**
     * 검색박스 숨기기/보이기 처리
     */
    getChartData(data, deptCds) {
      let chart1Tit = [];
      let chart1Data = [];
      let chart2Tit = [];
      let chart2Data = [];

      this.$_.forEach(data, (item) => {
        chart1Tit.push(item.auditStdNm);
        chart1Data.push(item.totImpr);
      });

      this.$_.forEach(deptCds, (item) => {
        chart2Tit.push(item.dept_nm.trim());
        chart2Data.push(item.impr_cnt);
      });
      this.createChart(chart1Tit, chart1Data, chart2Tit, chart2Data);
    },
    createChart(chart1Tit, chart1Data, chart2Tit, chart2Data) {
      // this.chart1 = echarts.init(this.$refs.chart1, 'macarons');
      // this.chart1.setOption({
      //   title: {
      //     text: this.$comm.getLangSpecInfoLabel('L0000003206'),
      //   }, /* 항목별 시정지시 건수 */
      //   tooltip: {},
      //   grid: {
      //     height: '350px',
      //   },
      //   xAxis: {
      //     type: 'category',
      //     axisLabel: {
      //       rotate: 30,
      //     },
      //     nameTextStyle: {
      //       height: '150px',
      //     },
      //     data: chart1Tit,
      //   },
      //   yAxis: {
      //     type: 'value',
      //   },
      //   series: [
      //     {
      //       type: 'bar',
      //       barWidth: 30,
      //       data: chart1Data,
      //     },
      //   ],
      // });
      // this.chart2 = echarts.init(this.$refs.chart2, 'macarons');
      // this.chart2.setOption({
      //   title: {
      //     text: this.$comm.getLangSpecInfoLabel('L0000001321'),
      //   }, /* 부서별 시정지시 건수 */
      //   tooltip: {},
      //   grid: {
      //     height: '350px',
      //   },
      //   xAxis: {
      //     type: 'category',
      //     axisLabel: {
      //       rotate: 30,
      //     },
      //     data: chart2Tit,
      //   },
      //   yAxis: {
      //     type: 'value',
      //   },
      //   series: [
      //     {
      //       type: 'bar',
      //       barWidth: 30,
      //       data: chart2Data,
      //     },
      //   ],
      // });
    },
    /** /Button Event **/
    resizeGrid() {
      if ((this.YAuiGrid || null) !== null) {
        this.YAuiGrid.resize(null, this.gridOptions.height);
      }
    },
  },
};
</script>
