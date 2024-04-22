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
        @onClick="btnPopupClickedCallback"
      ></y-vue-simple-calendar-mini>
    </b-col>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-row>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import Cookies from 'js-cookie';

export default {
  name: 'mgt-she-calendar',
  props: {
    portletParam: {
      type: String,
      default: {
        plantCd: '',
      },
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
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
    };
  },
  computed: {
    locale() {
      return Cookies.get('language') || 'kr';
    },
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
      this.plantCd = this.portletParam.plantCd || this.$store.getters.plantCd;
      this.onSearch(new Date());
      this.calHeight = 350;
    },
    onSearch: function (_calendarCurrDate) {
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
      this.$http.url = selectConfig.main.portlet.plan.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        plantCd: this.plantCd,
      };
      this.$http.request(
        (_result) => {
          let index = 0;
          this.calItems = [];
          this.$_.forEach(_result.data, (item) => {
            index++;
            let itemStyle =
              'background-color: {0}; border-color: {1}; color: {2};';
            this.calItems.push({
              id: index,
              startDate: item.startDate,
              endDate: item.endDate,
              title: item.title,
              classes: '',
              mgtCalendarNo: item.mgtCalendarNo,
              style: this.$format(
                itemStyle,
                item.bgColor,
                item.brColor,
                item.fontColor
              ),
            });
          });
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
    btnPopupClickedCallback(data) {
      this.popupOptions.target = () =>
        import(
          `${'@/pages/mgt/scheduleManagement/scheduleManagementDetail.vue'}`
        );
      this.popupOptions.title = 'L0000002275'; // 일정상세
      this.popupOptions.param = {
        mgtCalendarNo: data ? data.mgtCalendarNo : 0,
        main: true,
      };
      console.log('this.popupOptions.param: ', this.popupOptions.param);
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getDataList();
    },
  },
};
</script>
