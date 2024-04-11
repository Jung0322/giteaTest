<!--
  목적 : 작업환경측정결과 통계
  Detail :
  examples:
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <y-search-box :chartOption="chartOption" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            type="year"
            label="L0000000767"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-dept
            type="search"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-process
            :plantCd="searchParam.plantCd"
            :deptCd="searchParam.deptCd"
            name="processCd"
            v-model="searchParam.processCd"
          />
        </b-col>
        <!-- 유해인자명 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            label="L0000004365"
            name="hazardNm"
            v-model="searchParam.hazardNm"
          ></y-text>
        </b-col>
        <!-- 측정값 초과율 -->
        <b-col sm="6" md="6" lg="4" xl="6" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="exposureExcessRateItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000004866"
            name="exposureExcessRate"
            v-model="searchParam.exposureExcessRate"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 검색 -->
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClicked"
            />
          </div>
        </b-col>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 검색 결과 테이블 -->
          <template v-for="item in workMeasureStatus">
            <div :key="item.chartOptions.title.text">
              <apexchart
                type="line"
                :height="item.chartOptions.chart.height"
                :options="item.chartOptions"
                :series="item.series"
              ></apexchart>
            </div>
          </template>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'work-measure-result-graph',
  components: {
    apexchart: VueApexCharts,
  },
  props: {},
  data() {
    return {
      editable: true,
      chartOption: {
        header: [],
        data: [],
        height: 'auto',
        year: [],
      },
      searchParam: {
        plantCd: '',
        deptCd: '',
        period: [],
        processCd: '',
        hazardNm: '',
        exposureExcessRate: '',
        tap: 'graph',
      },
      workMeasureStatus: [
        {
          series: [
            // {
            //   name: this.$comm.getLangSpecInfoLabel('L0000004370'), // 유해인자 1
            //   data: [12, 16, 21, 28, 34, 39, 42, 45, 34, 39, 42, 45],
            // },
            // {
            //   name: this.$comm.getLangSpecInfoLabel('L0000004371'), // 유해인자 2
            //   data: [12, 4, 5, 7, 6, 5, 3, 3, 6, 5, 3, 3],
            // },
            // {
            //   name: this.$comm.getLangSpecInfoLabel('L0000004372'), // 유해인자 3
            //   data: [12, 10, 15, 37, 26, 7, 6, 9, 11, 24, 16, 6],
            // },
          ],
          chartOptions: {
            chart: {
              height: 350,
              type: 'line',
              dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2,
              },
              toolbar: {
                show: true,
              },
              width: '90%',
            },
            // colors: ['#77B6EA', '#008FFB'],
            dataLabels: {
              enabled: true,
              offsetY: -5,
              background: {
                enabled: false,
              },
            },
            stroke: {
              // curve: 'smooth'
            },
            title: {
              text: this.$comm.getLangSpecInfoLabel('L0000002441'), // 작업환경측정 통계
              align: 'left',
            },
            grid: {
              borderColor: '#e7e7e7',
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            markers: {
              size: [5, 5],
              fillOpacity: 1,
              // shape: 'circle',
              // radius: 2,
            },
            xaxis: {
              categories: null,
            },
            yaxis: {
              title: {
                text: this.$comm.getLangSpecInfoLabel('L0000002962'), // 측정치
              },
              min: 0,
              max: 30,
            },
            legend: {
              position: 'bottom',
              horizontalAlign: 'right',
              floating: true,
              // offsetY: -25,
              // offsetX: -5
            },
          },
        },
      ],
      chartUrl: '',
      exposureExcessRateItems: [],
    };
  },
  watch: {
    'searchParam.period'() {
      let gap =
        Number(this.searchParam.period[1].substring(0, 4)) -
        Number(this.searchParam.period[0].substring(0, 4));

      if (gap > 2) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            'M0000001162' /* 기간 검색조건은 최대 2년까지 검색가능합니다 */,
          type: 'warning',
        });
        return;
      }
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      this.exposureExcessRateItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') },
        { code: '30', codeNm: '30%' },
        { code: '50', codeNm: '50%' },
        { code: '100', codeNm: '100%' },
      ];
      this.searchParam.exposureExcessRateItems = '';

      this.editable = this.$route.meta.editable;
      this.searchParam.period = [];
      this.searchParam.period.push(this.$comm.getPrevDate('1y', 'YYYY'));
      this.searchParam.period.push(this.$comm.moment().format('YYYY'));
      this.chartUrl = selectConfig.hea.workMeasureResult.chart.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie(
        this.searchParam.tap
      );
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    getDataList() {
      if (
        !this.searchParam.period ||
        this.searchParam.period.length !== 2 ||
        !this.searchParam.period[0] ||
        !this.searchParam.period[1]
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000475', // 기간은 필수 검색조건입니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      if (
        this.searchParam.processCd === '' ||
        this.searchParam.processCd == null
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001169', // '검색 조건에 공정을 선택하세요',
          type: 'warning',
        });
        return;
      }
      this.$http.url = this.chartUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          console.log(_result.data);
          if (_result.data.data.length > 0) {
            this.chartOption.data = _result.data.data;
            this.workMeasureStatus[0].chartOptions.yaxis.max = _result.data.max;
            this.$comm.pushCookie(this.searchParam);
            this.workMeasureChart();
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000282', // 검색된 데이터가 없습니다.
              type: 'warning', // success / info / warning / error
            });
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    workMeasureChart() {
      let seriseItem = [];

      let fromYearInt = this.searchParam.period[0];
      let toYearInt = this.searchParam.period[1];

      let monthPeriod = [];
      var index = 0;

      for (let i = fromYearInt; i <= toYearInt; i++) {
        for (let j = 1; j <= 12; j++) {
          if (j === 10 || j === 11 || j === 12) {
            monthPeriod.push(i + '-' + j); // 10~12월
            index++;
          } else {
            monthPeriod.push(i + '-0' + j); // 1~9월
            index++;
          }
        }
      }

      this.$_.forEach(this.chartOption.data, (item) => {
        let arr = [];
        monthPeriod.forEach((colName) => {
          arr.push(item[colName]);
        });

        seriseItem.push({
          name: item['hazard_nm_ko'],
          data: arr,
        });
      });

      // this.workMeasureStatus[0].chartOptions = [
      //   ...this.workMeasureStatus[0].chartOptions,
      //   ...{
      //     title: {
      //       text: this.$comm.getLangSpecInfoLabel('L0000002441'), // 작업환경측정 통계
      //       align: 'left',
      //     },
      //     xaxis: {
      //       categories: monthPeriod,
      //     },
      //   },
      // ];
      this.workMeasureStatus[0].chartOptions = {
        ...this.workMeasureStatus[0].chartOptions,
        ...{
          xaxis: {
            categories: monthPeriod,
            title: {
              text: '.',
            },
          },
          yaxis: {
            max: this.workMeasureStatus[0].chartOptions.yaxis.max,
          },
        },
      };

      this.workMeasureStatus[0].series = seriseItem;
    },
    btnSearchClicked() {
      this.getDataList();
    },
  },
};
</script>
