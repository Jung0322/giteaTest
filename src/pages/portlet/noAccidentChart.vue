<!--
  목적 : 포틀릿-무재해 현황
  작성자 : khk
  Detail : 
  *
  examples:
  *
  -->
<template>
  <div ref="chart" :style="{width:'100%', height:(portletHeight-55)+'px'}" />
</template>

<script>
import selectConfig from '@/js/selectConfig';

import echarts from 'echarts'
require('echarts/theme/macarons') 
import { debounce } from '@/utils'

export default {
  name: 'portlet-no-accident-chart',
  props: {
    portletParam: {
      type: String,
      default: ''
    },
    portletHeight: {
      type: [String, Number],
      default: 350
    },
  },
  data () {
    return {
      chart: null,
      sidebarElm: null,      
      searchParam: {
        dataDate: ''
      },
    }
  },
  watch: {
  },
  mounted () {
    this.init();
    this.__resizeHandler = debounce(() => {
      if (this.chart) {        
        this.getChartData();
        this.chart.resize();
      }
    }, 100);
    window.addEventListener('resize', this.__resizeHandler);

    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0];
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler);
  },
  beforeDestroy () {
    if (!this.chart) {
      return;
    }
    window.removeEventListener('resize', this.__resizeHandler);

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler);

    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    sidebarResizeHandler (e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler();
      }
    },
    init () {
      this.searchParam.dataDate = this.$comm.moment(this.$comm.getToday()).format('YYYY-MM-DD');
      this.getChartData();
    },
    getChartData () {      
      this.$http.url = selectConfig.main.portlet.noAccident.list.url;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request((_result) => {        
        this.createChart(_result.data);
      }, (_error) => {
        window.getApp.$emit('APP_REQUEST_ERROR', '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.');
      });
    },
    createChart (_result) {      
      if (_result.length === 0) {
        return;
      }
      
      var dataStyle = {
        normal: {
          label: { show: false },
          labelLine: { show: false }
        }
      };
      var placeHolderStyle = {
        normal: {
          color: 'rgba(0,0,0,0)',
          label: { show: false },
          labelLine: { show: false }
        },
        emphasis: {
          color: 'rgba(0,0,0,0)'
        }        
      };

      var chartLegend = [];
      var chartSeries = [];
      var chartSubtext = [];
      var series = {};
      if (_result[0]['mh_use_yn'] === 'Y') {
        chartLegend.push('무재해 인시');
        series = {
          name: '무재해 인시',
          type: 'pie',
          clockWise: false,
          radius: [100, 120],
          itemStyle: dataStyle,
          data: [
            {
              value: Number(_result[0]['real_mh']),
              name: _result[0]['real_mh'] + ' / ' + _result[0]['target_mh'],
            },
            {
              value: Number(_result[0]['target_mh']) - Number(_result[0]['real_mh']),
              itemStyle: placeHolderStyle,
              tooltip: { show: false }
            }
          ]
        };          
        chartSeries.push(series);
        chartSubtext.push('무재해 인시: ' + _result[0]['mh_rate'] + '%');
      }
      if (_result[0]['day_use_yn'] === 'Y') {
        chartLegend.push('무재해 일');
        series = {
          name: '무재해 일',
          type: 'pie',
          clockWise: false,
          radius: [80, 100],
          itemStyle: dataStyle,
          data: [
            {
              value: Number(_result[0]['real_days']),
              name: _result[0]['real_days'] + ' / ' + _result[0]['target_days'],
            },
            {
              value: Number(_result[0]['target_days']) - Number(_result[0]['real_days']),
              itemStyle: placeHolderStyle,
              tooltip: { show: false }
            }
          ]
        };          
        chartSeries.push(series);
        chartSubtext.push('  무재해 일: ' + _result[0]['days_rate'] + '%');
      }
      
      this.chart = echarts.init(this.$refs.chart, 'macarons');      
      this.chart.setOption(
        {
          title: {
            text: '무재해 달성률',
            subtext: chartSubtext.join('\n'),
            top: 100,
            x: 'center',
            y: 'center',
            textStyle: {
              fontSize: 23,
              fontWeight: 'bolder'
            },
            subtextStyle: {
              fontSize: 13,
              fontWeight: 'bolder'
            },
          },
          grid: {
            top: '135px',
            left: '130px',
            x2: 120,
            y2: 130
          },
          tooltip: {
            show: true,
            formatter: '{a}: {b}'
          },
          legend: {
            orient: 'vertical',
            x: (this.$refs.chart.offsetWidth / 2) + 15,
            y: 15,
            data: chartLegend
          },
          toolbox: {
            show: false
          },
          calculable: true,
          series: chartSeries
        }
      );
    },
    
  }
}
</script>
