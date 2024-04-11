<!--
  목적 : vue-simple-calendar를 이용한 스케줄러 
  작성자 : yullin
  Detail :
  *
  examples:
  *
  -->
<template>
  <!-- <el-image class="mb-3" :src="'/src/assets/images/calender.png'"></el-image> -->
  <div class="vsc-div-defaultxx mini-calendar" style="width: 100%;">
    <calendar-view
      :locale="locale"
      :events="items"
      :show-date="showDate"
      :time-format-options="{ hour: 'numeric', minute: '2-digit' }"
      :enable-drag-drop="false"
      :disable-past="disablePast"
      :disable-future="disableFuture"
      :show-event-times="showEventTimes"
      :display-period-uom="displayPeriodUom"
      :display-period-count="displayPeriodCount"
      :starting-day-of-week="startingDayOfWeek"
      :class="themeClasses"
      :period-changed-callback="periodChanged"
      :current-period-label="useTodayIcons ? (locale === 'kr' ? '오늘' : 'today') : ''"
      @drop-on-date="onDrop"
      @click-date="onClickDay"
      @click-event="onClickItem"
      @show-date-change="setShowDate"
    >
      <calendar-view-header
        slot="header"
        slot-scope="{ headerProps }"
        :header-props="headerProps"
        @input="setShowDate"
      />
    </calendar-view>

    <!-- <calendar-view
      :show-date="showDate"
      class="theme-cal-yullin holiday-us-traditional holiday-us-official"
    >
      <calendar-view-header
        slot="header"
        slot-scope="t"
        :header-props="t.headerProps"
        @input="setShowDate"
      />
    </calendar-view>-->
  </div>
</template>

<script>
import {
  CalendarView,
  CalendarViewHeader,
  CalendarMathMixin,
} from 'vue-simple-calendar';
export default {
  components: {
    CalendarView,
    CalendarViewHeader,
  },
  mixins: [CalendarMathMixin],
  /** attributes: name, components, props, data **/
  name: 'y-vue-simple-calendar-mini', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  props: {
    calItems: {
      type: Array,
      default: () => [],
    },
    calHeight: {
      type: String,
      default: '350px',
    },
    locale: {
      type: String,
      default: 'kr',
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      // Naming Rule : JAVA model class와 연동되는 vue model은 model class명을 Camel case로 변환해서 선언하시고 기본값은 {}로 초기화 시켜주세요.
      // 예) ExamData -> examData: {},
      // isSubmit: false,  // 버튼을 submit 할 것인지 판단하는 변수로써 버튼의 개수만큼 필요합니다.
      /* Show the current month, and give it some fake items to show */
      showDate: null,
      message: '',
      startingDayOfWeek: 0,
      disablePast: false,
      disableFuture: false,
      displayPeriodUom: 'month',
      displayPeriodCount: 1,
      showEventTimes: true,
      newItemTitle: '',
      newItemStartDate: '',
      newItemEndDate: '',
      useDefaultTheme: true,
      useHolidayTheme: false,
      useTodayIcons: true,
      items: [],
    };
  },
  computed: {
    userLocale() {
      return this.getDefaultBrowserLocale;
    },
    dayNames() {
      return this.getFormattedWeekdayNames('en', 'long', 0);
    },
    themeClasses() {
      return {
        'theme-cal-yullin': this.useDefaultTheme,
        'holiday-us-traditional': this.useHolidayTheme,
        'holiday-us-official': this.useHolidayTheme,
      };
    },
  },
  watch: {
    // 부모로 부터 값을 비동기로 가져올 경우 처리
    calItems() {
      this.makeCalendar();
    },
    calHeight() {
      this.changeHeight();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
    this.newItemStartDate = this.isoYearMonthDay(this.today());
    this.newItemEndDate = this.isoYearMonthDay(this.today());
  },
  beforeDestory() {
    this.init();
  },

  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
      this.showDate = this.thisMonth(1);
      this.makeCalendar();
      this.changeHeight();
      /* xxxx년 xx월 형식으로 변환 */
      $('.periodLabel').text(this.$comm
        .moment(this.showDate)
        .format((this.locale === 'kr' ? 'YYYY년 MM월' : 'MM/YYYY')));
    },
    /** /초기화 관련 함수 **/
    periodChanged() {
      // range, eventSource) {
      // Demo does nothing with this information, just including the method to demonstrate how
      // you can listen for changes to the displayed range and react to them (by loading items, etc.)
    },
    thisMonth(d, h, m) {
      const t = new Date();
      return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0);
    },
    onClickDay(d) {
      this.message = `You clicked: ${d.toLocaleDateString()}`;
    },
    onClickItem(e) {
      this.message = `You clicked: ${e.title}`;
      this.$emit('onClick', e.originalEvent);
    },
    setShowDate(d) {
      this.message = `Changing calendar view to ${d.toLocaleDateString()}`;
      this.showDate = d;
    },
    onDrop(item, date) {
      this.message = `You dropped ${item.id} on ${date.toLocaleDateString()}`;
      // Determine the delta between the old start date and the date chosen,
      // and apply that delta to both the start and end date to move the item.
      const eLength = this.dayDiff(item.startDate, date);
      item.originalEvent.startDate = this.addDays(item.startDate, eLength);
      item.originalEvent.endDate = this.addDays(item.endDate, eLength);
    },
    clickTestAddItem() {
      this.items.push({
        startDate: this.newItemStartDate,
        endDate: this.newItemEndDate,
        title: this.newItemTitle,
        id:
          'e' +
          Math.random()
            .toString(36)
            .substr(2, 10),
      });
      this.message = 'You added a calendar item!';
    },
    makeCalendar() {
      this.items = this.calItems;
    },
    changeHeight() {
      var targetItem = document.querySelectorAll(
        '.theme-cal-yullin .cv-weeks'
      )[0];
      targetItem.style.height = this.calHeight;
    },
    setShowDate(d) {
      this.showDate = d;
      /* xxxx년 xx월 형식으로 변환 */
      $('.periodLabel').text(this.$comm
        .moment(this.showDate)
        .format((this.locale === 'kr' ? 'YYYY년 MM월' : 'MM/YYYY')));
      this.onSearch();
    },
    onSearch() {
      this.$nextTick(() => {
        // $('.custom-day').removeClass('.custom-day')
        // $('.cv-day-name').remove()
        // for (let i in this.holidayData) {
        //   $(this.holidayData[i].date).addClass('custom-day')
        //   if (($(this.holidayData[i].date).find('.cv-day-name')).length > 0) continue
        //   $(this.holidayData[i].date).prepend('<div class="cv-day-number cv-day-name ml-4 pt-1 ellipsisClass">' + this.holidayData[i].name + '</div>')
        // }
        this.$emit('onSearch', this.showDate);
      });
    },
  },
};
</script>

<style>
/* html,
body {
  height: 100%;
  margin: 0;
  background-color: #f7fcff;
}

#app {
  display: flex;
  flex-direction: row;
  font-family: Calibri, sans-serif;
  width: 95vw;
  min-width: 30rem;
  max-width: 100rem;
  min-height: 40rem;
  margin-left: auto;
  margin-right: auto;
} */

/* .vsc-div-default {
  height: 100%;
  margin: 0;
  background-color: #f7fcff;
  display: block;
  flex-direction: row;
  font-family: Calibri, sans-serif;
  min-width: 30rem;
  min-height: 10rem;
  width: 95vw;
  max-width: 100rem;
  margin-left: 5px;
  margin-right: auto;
} */

/* .calendar-controls {
  margin-right: 1rem;
  min-width: 14rem;
  max-width: 14rem;
}

.calendar-parent {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  max-height: 80vh;
  background-color: white;
} */

.theme-cal-yullin {
  width: 100%;
  font-size: 0.7rem;
}

.theme-cal-yullin .cv-wrapper {
  width: 100%;
  font-size: 0.7rem;
}

.theme-cal-yullin .cv-weeks {
  height: 220px;
}

/* For long calendars, ensure each week gets sufficient height. The body of the calendar will scroll if needed */
.theme-cal-yullin .cv-wrapper.period-month.periodCount-2 .cv-week,
.theme-cal-yullin .cv-wrapper.period-month.periodCount-3 .cv-week,
.theme-cal-yullin .cv-wrapper.period-year .cv-week {
  min-height: 6rem;
}

/* These styles are optional, to illustrate the flexbility of styling the calendar purely with CSS. */

/* Add some styling for items tagged with the "birthday" class */
.theme-cal-yullin .cv-event.birthday {
  background-color: #e0f0e0;
  border-color: #d7e7d7;
}

.theme-cal-yullin .cv-event.birthday::before {
  content: '\1F382'; /* Birthday cake */
  margin-right: 0.5em;
}

/* Header */

.theme-cal-yullin .previousYear,
.theme-cal-yullin .currentPeriod,
.theme-cal-yullin .nextPeriod,
.theme-cal-yullin .nextYear,
.theme-cal-yullin .previousPeriod {
  background-color: #f1f5f7;
  border-color: #dee2e6;
  font-weight: bold;
}

.theme-cal-yullin .cv-header {
  /* display: none;  */
  background-color: #fff;
}

.theme-cal-yullin .cv-header-day {
  background-color: #f1f5f7;
}

.theme-cal-yullin .cv-header-days {
  height: 2em;
  font-weight: bold;
}

.theme-cal-yullin .cv-header .periodLabel {
  font-size: 1.5em;
}

.theme-cal-yullin .cv-header button {
  color: #7f7f7f;
}

.theme-cal-yullin .cv-header button:disabled {
  color: #ccc;
  background-color: #f7f7f7;
}

/* Grid */

.theme-cal-yullin .cv-day.past,
.theme-cal-yullin .cv-day.future {
  /* background-color: #fafafa; */
  background-color: #fff;
}

.theme-cal-yullin .cv-day.outsideOfMonth {
  background-color: #fafafa;
  color: #d8d8d8;
}

.theme-cal-yullin .cv-day.today {
  background-color: #ffe;
}

/* Events */

.theme-cal-yullin .cv-event {
  border-color: #e0e0f0;
  border-radius: 0.3em;
  background-color: #e7e7ff;
  text-overflow: ellipsis;
  font-family: NanumGothic, 나눔고딕, 'Malgun Gothic', '맑은 고딕', sans-serif;
  font-size: 0.7rem;
  font-weight: bold;
  padding-bottom: 1px;
}

.theme-cal-yullin .cv-event.span1 {
  /* width: auto; */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding: 1px;
}

/* 색상추가 : MGT_CAL_KIND 코드별로 색상이 상이함.*/

/*MGT_CAL_KIND:작업 */
.theme-cal-yullin .cv-event.dg {
  background-color: #3e94ff;
  border-color: #3e94ff;
  color: #fff;
}
/*MGT_CAL_KIND:교육 */
.theme-cal-yullin .cv-event.rb {
  background-color: #9ea623;
  border-color: #9ea623;
  color: #fff;
}
/*MGT_CAL_KIND:점검 */
.theme-cal-yullin .cv-event.gr {
  background-color: #ff8840;
  border-color: #ff8840;
  color: #fff;
}
/*MGT_CAL_KIND:개선 */
.theme-cal-yullin .cv-event.bl {
  background-color: #69b341;
  border-color: #69b341;
  color: #fff;
}
/*MGT_CAL_KIND:변경 */
.theme-cal-yullin .cv-event.ye {
  background-color: #ff5652;
  border-color: #ff5652;
  color: #fff;
}
/*MGT_CAL_KIND:보건 */
.theme-cal-yullin .cv-event.pu {
  background-color: #59adf2;
  border-color: #59adf2;
  color: #fff;
}
/*MGT_CAL_KIND:평가 */
.theme-cal-yullin .cv-event.or {
  background-color: #879be8;
  border-color: #879be8;
  color: #fff;
}
/*MGT_CAL_KIND:기타 */
.theme-cal-yullin .cv-event.kh {
  background-color: #777777;
  border-color: #777777;
  color: #fff;
}

.theme-cal-yullin .cv-event.continued::before,
.theme-cal-yullin .cv-event.toBeContinued::after {
  content: ' \21e2 ';
  color: #999;
}

.theme-cal-yullin .cv-event.toBeContinued {
  border-right-style: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.theme-cal-yullin .cv-event.isHovered.hasUrl {
  text-decoration: underline;
}

.theme-cal-yullin .cv-event.continued {
  border-left-style: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/* Event Times */

.theme-cal-yullin .cv-event .startTime,
.theme-cal-yullin .cv-event .endTime {
  font-weight: bold;
  color: #666;
}

/* Drag and drop */

.theme-cal-yullin .cv-day.draghover {
  box-shadow: inset 0 0 0.2em 0.2em yellow;
}

/* Easter: example of a holiday that changes each year. Easy to pre-populate for a reasonable number of years. */
.theme-cal-yullin
  .cv-wrapper.holiday-us-traditional
  .d2015-04-05
  .cv-day-number::before {
  content: '\271D';
}

.theme-cal-yullin
  .cv-wrapper.holiday-us-traditional
  .d2016-03-27
  .cv-day-number::before {
  content: '\271D';
}

.theme-cal-yullin
  .cv-wrapper.holiday-us-traditional
  .d2017-04-16
  .cv-day-number::before {
  content: '\271D';
}

.theme-cal-yullin
  .cv-wrapper.holiday-us-traditional
  .d2018-04-01
  .cv-day-number::before {
  content: '\271D';
}

.theme-cal-yullin
  .cv-wrapper.holiday-us-traditional
  .d2019-04-21
  .cv-day-number::before {
  content: '\271D';
}

.theme-cal-yullin
  .cv-wrapper.holiday-us-traditional
  .d2020-04-12
  .cv-day-number::before {
  content: '\271D';
}

.theme-cal-yullin
  .cv-wrapper.holiday-us-traditional
  .d2021-04-04
  .cv-day-number::before {
  content: '\271D';
}

.theme-cal-yullin
  .cv-wrapper.holiday-us-traditional
  .d2022-04-17
  .cv-day-number::before {
  content: '\271D';
}

.theme-cal-yullin
  .cv-wrapper.holiday-us-traditional
  .d2023-04-09
  .cv-day-number::before {
  content: '\271D';
}

/* Cinco de Mayo */
.theme-cal-yullin
  .cv-wrapper.holiday-us-traditional
  .d05-05
  .cv-day-number::before {
  content: '\1F1F2\1F1FD';
}

/* Halloween - October 31 */
.theme-cal-yullin
  .cv-wrapper.holiday-us-traditional
  .d10-31
  .cv-day-number::before {
  content: '\1F383';
}

/*
****************************************************
Official US Holidays
****************************************************
*/

/**** Same date every year ****/

/* New Year's Day - January 1 */
.theme-cal-yullin
  .cv-wrapper.holiday-us-official
  .d01-01
  .cv-day-number::before {
  content: '\1F37E';
}

/* Independence Day - July 4 */
.theme-cal-yullin
  .cv-wrapper.holiday-us-official
  .d07-04
  .cv-day-number::before {
  content: '\1F1FA\1F1F8';
}

/* Veteran's Day - November 11 */
.theme-cal-yullin
  .cv-wrapper.holiday-us-official
  .d11-11
  .cv-day-number::before {
  content: '\1F396';
}

/* Christmas Day - December 25 */
.theme-cal-yullin
  .cv-wrapper.holiday-us-official
  .d12-25
  .cv-day-number::before {
  content: '\1F384';
}

/**** Same month position every year ****/

/* Martin Luther King, Jr. Day - 3rd Monday of January */
.theme-cal-yullin
  .cv-wrapper.holiday-us-official.m01
  .day.dow1.instance3
  .cv-day-number::before {
  content: '\270C\1F3FE';
}

/* Washington's Birthday - 3rd Monday in February */
.theme-cal-yullin
  .cv-wrapper.holiday-us-official.m02
  .day.dow1.instance3
  .cv-day-number::before {
  content: '\1F34E';
}

/* Memorial Day - last Monday in May */
.theme-cal-yullin
  .cv-wrapper.holiday-us-official.m05
  .day.dow1.lastInstance
  .cv-day-number::before {
  content: '\1F1FA\1F1F8';
}

/* Labor Day - 1st Monday in September */
.theme-cal-yullin
  .cv-wrapper.holiday-us-official.m09
  .day.dow1.instance1
  .cv-day-number::before {
  content: '\1F4AA';
}

/* Columbus Day - 2nd Monday in October */
.theme-cal-yullin
  .cv-wrapper.holiday-us-official.m10
  .day.dow1.instance2
  .cv-day-number::before {
  content: '\2388';
}

/* Thanksgiving Day - 4th Thursday of November */
.theme-cal-yullin
  .cv-wrapper.holiday-us-official.m11
  .day.dow4.instance4
  .cv-day-number::before {
  content: '\1F64F';
}

.theme-cal-yullin .cv-wrapper div {
  line-height: 12px !important;
  font-size: 12px !important;
}
.theme-cal-yullin .cv-header-nav button {
  font-size: 12px !important;
}
.theme-cal-yullin .cv-header-day {
  font-size: 12px !important;
}
.theme-cal-yullin .cv-day-number {
  font-size: 12px !important;
}
.theme-cal-yullin .periodLabel {
  font-size: 13px !important;
}
</style>      
