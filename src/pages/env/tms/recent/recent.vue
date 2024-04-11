<!--
  목적 : 안전점검 - 안전 점검 종류
  Detail : 안전점검 점검항목 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <y-search-box @enter="search">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            type="month"
            label="L0000000767"
            name="period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 측정항목 -->
          <y-select
            :width="8"
            :comboItems="itemItems"
            itemText="itemName"
            itemValue="itemCode"
            ui="bootstrap"
            label="L0000002963"
            name="itemCode"
            v-model="searchParam.itemCode"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <b-row class="mt-3">
      <b-col sm="12">
        <b-card
          header-class="default-card"
          body-class="default-body-card"
          class="py-0"
        >
          <b-row>
            <b-col sm="12">
              <div class="float-right mb-1">
                <y-btn title="L0000000327" color="green" @btnClicked="search" />
              </div>
            </b-col>
            <b-col sm="12">
              <div ref="chart" :style="{ height: '500px' }" />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- 검색 결과 테이블 -->
    <!--<b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <el-tag size="medium">
              <i class="el-icon-info"></i>
              {{ $comm.getLangSpecInfoLabel('L0000003214') }}
              <-- 해당 목록은 검색조건에 영향없이 결과값이 보여집니다. --
            </el-tag>
          </div>
          !-- TMS 측정소항목별 현재값 목록 --
          <y-data-table
            :headers="gridOptions.header"
            :height="gridOptions.height"
            :items="gridOptions.data"
            label="L0000000181"
            ref="dataTable"
            @tableLinkClicked="tableLinkClicked"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row>-->
    <!-- TMS 측정소항목별 현재값 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000181')"
          :showRightLabel="this.editable"
          :rightLabel="this.$comm.getLangSpecInfoLabel('L0000003214')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import echarts from 'echarts';
require('echarts/theme/macarons');
export default {
  /* attributes: name, components, props, data */
  name: 'y-recent',
  props: {},
  data: () => ({
    chart: null,
    searchParam: {
      period: [],
      itemCode: '',
    },
    gridOptions: {
      name: 'recent',
      header: [],
      data: [],
      btns: [],
      height: 400,
    },
    // itemItemsGrid: [],
    itemItems: [],
    editable: false,
    searchUrl: '',
    searchItemUrl: '',
    chartUrl: '',
    YAuiGrid: null,
  }),
  watch: {
    'searchParam.itemCode'() {
      this.getChartData();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.env.tms.recent.list.url;
      this.chartUrl = selectConfig.env.tms.recent.chart.url;
      this.searchItemUrl = selectConfig.env.tms.baseInfo.tmsItem.list.url;

      // 기간 Setting
      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        today,
        '-1m',
        'YYYY-MM',
        'YYYY-MM'
      );
      this.searchParam.period = [
        from,
        this.$comm.moment(today).format('YYYY-MM'),
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getTmsItem(); // TMS 측정항목 조회
      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getTmsItem() {
      this.$http.url = this.searchItemUrl;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.itemItems = this.$_.clone(_result.data);
          if (this.itemItems && this.itemItems.length > 0) {
            this.searchParam.itemCode = this.itemItems[0].itemCode;
            this.getChartData();
          }
          this.setHeader();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setHeader() {
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plant_nm',
          width: '150',
          style: 'center-align',
        } /* 사업장 */,
        { /* 배출시설명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001174'),
          dataField: 'facility_nm',
          width: '180',
          style: 'center-align',
        },
        { /* 배출구명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001147'),
          dataField: 'outlet_nm',
          width: '180',
          style: 'left-align',
        },
        { /* 측정소명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002937'),
          dataField: 'station_name',
          width: '180',
          style: 'center-align',
        },
      ];
      let i = 5;
      this.$_.forEach(this.itemItems, (item) => {
        this.gridOptions.header.splice(i, 0, {
          headerText: this.$comm.getLangSpecInfoLabel(item.itemName + ' (' + item.unit + ')'),
          children: [
            { /* 법적기준 */
              headerText: this.$comm.getLangSpecInfoLabel('L0000001212'),
              dataField: item.itemCode + '_law',
              width: '100',
              style: 'center-align',
            },
            { /* 측정치 */
              headerText: this.$comm.getLangSpecInfoLabel('L0000002962'),
              dataField: item.itemCode + '_val',
              width: '100',
              style: 'center-align',
            },
            { /* 측정일시 */
              headerText: this.$comm.getLangSpecInfoLabel('L0000002952'),
              dataField: item.itemCode + '_date',
              width: '180',
              style: 'center-align',
            },
          ],
        });
      });
      this.gridOptions.height = 'auto';
    },
    getChartData() {
      if (
        !this.searchParam.period ||
        this.searchParam.period.length !== 2 ||
        !this.searchParam.period[0] ||
        !this.searchParam.period[1]
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000367' /* 기간 검색조건은 필수입니다 */,
          type: 'warning',
        });
        return;
      }
      let diff = this.$comm
        .moment(this.searchParam.period[1])
        .diff(this.searchParam.period[0], 'months', true);
      if (diff > 6) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            'M0000000368' /* 기간 검색조건은 최대 6개월까지 검색가능합니다 */,
          type: 'warning',
        });
        return;
      }
      this.$http.url = this.chartUrl;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.createChart(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    createChart(_result) {
      let data = [];
      let dataLaw = [];
      if (_result && _result.list && _result.list.length > 0) {
        let chartXAxisData = this.$_.map(_result, 'eairOutletNm');
        this.$_.forEach(_result.list, (item) => {
          data.push({
            name: item.dataDate,
            value: [item.dataDate, item.dataValue],
          });
        });
        let startDate = '';
        let endDate = '';
        if (_result.yearLaw && _result.yearLaw.length > 1) {
          startDate = _result.yearLaw[0].minDate;
          endDate = _result.yearLaw[_result.yearLaw.length - 1].maxDate;
          this.$_.forEach(_result.yearLaw, (item) => {
            let law = null;
            let law2 = null;
            if (startDate && startDate.substring(0, 4) === item.dataYear) {
              law = {
                name: startDate,
                value: [startDate, item.lawMax],
              };
              law2 = {
                name: item.dataYear + '-12-31 23:59:59',
                value: [item.dataYear + '-12-31 23:59:59', item.lawMax],
              };
            } else if (endDate && endDate.substring(0, 4) === item.dataYear) {
              law = {
                name: item.dataYear + '-01-01 00:00:00',
                value: [item.dataYear + '-01-01 00:00:00', item.lawMax],
              };
              law2 = {
                name: endDate,
                value: [endDate, item.lawMax],
              };
            }
            if (law) {
              dataLaw.push(law);
            }
            if (law2) {
              dataLaw.push(law2);
            }
          });
        } else if (_result.yearLaw && _result.yearLaw.length === 1) {
          startDate = _result.yearLaw[0].minDate;
          endDate = _result.yearLaw[0].maxDate;
          dataLaw.push({
            name: startDate,
            value: [startDate, _result.yearLaw[0].lawMax],
          });
          dataLaw.push({
            name: endDate,
            value: [endDate, _result.yearLaw[0].lawMax],
          });
        }
      }
      let chartSeries = [
        {
          name: 'L0000002962' /* 측정치 */,
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: data,
          smooth: false,
        },
        {
          name: 'L0000001212' /* 법적기준 */,
          type: 'line',
          data: dataLaw,
          smooth: false,
        },
      ];

      let subText = '';
      if (this.searchParam.itemCode) {
        let temp = this.$_.filter(this.itemItems, {
          itemCode: this.searchParam.itemCode,
        });
        if (temp && temp.length > 0) {
          subText = 'L0000005674' + temp[0].itemName + ']'; /* 측정항목[] */
        }
      } else {
        subText = 'L0000005673'; /* 측정항목 : [전체] */
      }
      this.$_.forEach(_result.yearLaw, (law) => {
        if (law && law.minDate) {
          subText +=
            ', [' +
            law.minDate.substring(0, 4) +
            'L0000004498 : ' /* 년 법적기준 */ +
            law.lawMax +
            ']';
        } else if (law && law.maxDate) {
          subText +=
            ', [' +
            law.maxDate.substring(0, 4) +
            'L0000004498 : ' /* 년 법적기준 */ +
            law.lawMax +
            ']';
        }
      });

      this.chart = echarts.init(this.$refs.chart, 'macarons');
      this.chart.setOption({
        title: {
          text: '',
          subtext: subText,
          padding: [0, 5, 5, 0],
        },
        grid: {
          top: '35px',
          left: '30px',
          x2: 200,
          y2: 30,
        },
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          show: false,
        },
        calculable: true,
        xAxis: [
          {
            type: 'time',
            splitLine: {
              show: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
              show: false,
            },
          },
        ],
        series: chartSeries,
      });
    },
    /**
     * 수정 팝업 호출
     */
    tableLinkClicked(data) {
      if (data === null || data === undefined) return;
      this.openPopup(data);
    },
    search() {
      this.getChartData();
    },
    resizeGrid() {
      let _height = window.innerHeight - 370;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
