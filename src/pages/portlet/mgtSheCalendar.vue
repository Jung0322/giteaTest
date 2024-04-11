<!--
  목적 : 포틀릿-Calendar
  작성자 : kyk
  Detail : 
  *  
  examples:
  *
  -->
<template>
  <b-row>
    <b-col sm="12" class="mt-1">
      <y-vue-simple-calendar-mini
        :calItems="calItems"
        :calHeight="portletHeight - 120 + 'px'"
        :locale="locale"
        @onSearch="onSearch"
      ></y-vue-simple-calendar-mini>
    </b-col>
  </b-row>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import Cookies from 'js-cookie'

export default {
  name: 'mgt-she-calendar',
  props: {
    portletParam: {
      type: String,
      default: '',
    },
    portletHeight: {
      type: [String, Number],
      default: 350,
    },
  },
  data() {
    return {
      searchParam: {
        fromDate: '',
        toDate: '',
      },
      calItems: [],
      calHeight: 350,
    };
  },
  computed: {
    locale() {
      return Cookies.get('language') || 'kr';
    }
  },
  watch: {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    init() {
      // 최근 1년
      var from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-1y',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      from = this.$comm.getCalculatedDate(
        from,
        '1d',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );

      this.searchParam.fromDate = from;
      this.searchParam.toDate = this.$comm
        .moment(this.$comm.getToday())
        .format('YYYY-MM-DD');

      this.onSearch(new Date());
      this.calHeight = 350;
    },
    onSearch: function(_calendarCurrDate) {
      var yyyy = _calendarCurrDate.getFullYear().toString();
      var mm = (_calendarCurrDate.getMonth() + 1).toString();
      var dd = _calendarCurrDate.getDate().toString();
      if (_calendarCurrDate !== null) {
        this.searchParam.yearMonth =
          yyyy +
          '-' +
          (mm[1] ? mm : '0' + mm[0]) +
          '-' +
          (dd[1] ? dd : '0' + dd[0]);
      }
      this.getDataList();
    },
    getDataList() {
      // this.$http.url = selectConfig.mgt.sheCalendar.calendarviewmini.url;
      // this.$http.param = this.searchParam;
      // this.$http.type = 'GET';
      // this.$http.request(
      //   _result => {
      //     this.calItems = _result.data;
      //   },
      //   _error => {
      //     this.$emit('APP_REQUEST_ERROR', _error);
      //   }
      // );

      this.$http.url = selectConfig.main.portlet.plan.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        userId: this.$store.getters.token,
      };
      this.$http.request(
        _result => {
          let index = 0;
          this.calItems = [];
          this.$_.forEach(_result.data, item => {
            index++;
            this.calItems.push({
              id: index,
              startDate: item.startDate,
              endDate: item.endDate,
              title: item.title,
              classes: '',
            });
          });
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
  },
};
</script>
