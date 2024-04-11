<template>
  <b-container fluid>
    <el-button round @click="goToday">Today</el-button>
    <el-button icon="el-icon-arrow-left" circle @click="goPrev"></el-button>
    <el-button icon="el-icon-arrow-right" circle @click="goNext"></el-button>
    {{current}}
    <div 
      id="calendar"
    />
      <!-- @beforeUpdateSchedule="beforeUpdateSchedule"
      @beforeDeleteSchedule="beforeDeleteSchedule" -->
  </b-container>
</template>

<script>
import Calendar from 'tui-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
export default {
  /* attributes: name, components, props, data */
  name: 'toast-calendar',
  props: {},
  data() {
    return {
      calendar: null,
      calendarList: [
        {
          id: '0',
          name: '부서',
          bgColor: '#009688',
          color: '#FFFFFF',
        },
        {
          id: '1',
          name: '개인',
          bgColor: '#FFC107',
          color: '#FFFFFF',
        }
      ],
      scheduleList: [
        {
          id: '1',
          calendarId: '0',
          title: 'my schedule',
          category: 'allday',
          dueDateClass: '',
          start: '2021-08-10',
          end: '2021-08-12',
          isReadOnly: true,
          state: 'busy',
          body: 'textssssssssssssssssss',
        },
        {
          id: '2',
          calendarId: '1',
          title: 'second schedule',
          category: 'allday',
          dueDateClass: '',
          start: '2021-08-10',
          end: '2021-08-16',
          state: 'free',
          body: 'plain',
        }
      ],
      view: 'month',
      taskView: false,
      scheduleView: ['allday'],
      theme: {
        'common.border': '1px solid #ffbb3b',
        'common.backgroundColor': '#ffbb3b0f',
        'common.holiday.color': '#f54f3d',
        'common.saturday.color': '#3162ea',
        'common.dayname.color': '#333'
      },
      month: {
        visibleWeeksCount: 6,
        startDayOfWeek: 1
      },
      disableDblClick: true,
      isReadOnly: false,
      template: {
        milestone: function(schedule) {
          return `<span style="color:red;">${schedule.title}</span>`;
        },
        milestoneTitle: function() {
          return 'MILESTONE';
        },
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: null,
        width: '90%',
        top: '10px',
        closeCallback: null,
      },
      editable: false,
    }
  },
  computed: {
    current() {
      return this.calendar ? this.calendar.getViewName() : '';
    }
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      
      this.calendar = new Calendar('#calendar', {
        defaultView: 'month',
        taskView: false, // 일간/주간일 경우에만 지원
        scheduleView: ['allday'], // 일간/주간일 경우에만 지원
        theme: this.theme,
        calendars: [
          {
            id: '0',
            name: '부서',
            bgColor: '#009688',
            color: '#FFFFFF',
          },
          {
            id: '1',
            name: '개인',
            bgColor: '#FFC107',
            color: '#FFFFFF',
          }
        ],
        useCreationPopup: true,
        useDetailPopup: true
      });
      this.calendar.render();

      
      this.calendar.createSchedules([
        {
          id: '1',
          calendarId: '0',
          title: 'my schedule',
          category: 'allday',
          dueDateClass: '',
          start: '2021-08-10',
          end: '2021-08-12',
          isReadOnly: true,
          state: 'busy',
          body: 'textssssssssssssssssss',
        },
        {
          id: '2',
          calendarId: '1',
          title: 'second schedule',
          category: 'allday',
          dueDateClass: '',
          start: '2021-08-10',
          end: '2021-08-16',
          state: 'free',
          body: 'plain',
        }
      ]);

      this.calendar.on('beforeCreateSchedule', event => {
        let date = new Date();
        let schedule = {
          id: '3',
          calendarId: event.calendarId,
          title: event.title,
          category: 'allday',
          start: this.$moment(event.start).format('YYYY-MM-DD'),
          end: this.$moment(event.end).format('YYYY-MM-DD'),
          state: event.state,
        }
        this.calendar.createSchedules([{
          id: '3',
          calendarId: event.calendarId,
          title: event.title,
          category: 'allday',
          start: event.start._date,
          end: event.end._date,
          state: event.state,
        }]);
        // this.calendar.createSchedules([{
        //   id: '4',
        //   calendarId: '1',
        //   title: '3 schedule',
        //   category: 'allday',
        //   dueDateClass: '',
        //   start: '2021-08-15',
        //   end: '2021-08-22',
        //   state: 'free',
        //   body: 'plain',
        // }]);
      });
      this.calendar.on('beforeUpdateSchedule', event => {
        var schedule = event.schedule;
        var changes = event.changes;

        this.calendar.updateSchedule(schedule.id, schedule.calendarId, changes);
      });
      this.calendar.on('beforeDeleteSchedule', scheduleData => {
        const { schedule, start, end } = scheduleData;
        schedule.start = start;
        schedule.end = end;
        this.calendar.deleteSchedule(schedule.id, schedule.calendarId);
      });
      this.calendar.on('clickDayname', function(event) {
      });
      this.calendar.on('clickSchedule', function(event) {
        // var schedule = event.schedule;

        // if (lastClickSchedule) {
        //     calendar.updateSchedule(lastClickSchedule.id, lastClickSchedule.calendarId, {
        //         isFocused: false
        //     });
        // }
        // this.calendar.updateSchedule(schedule.id, schedule.calendarId, {
        //     isFocused: true
        // });

        // lastClickSchedule = schedule;
        // // open detail view
      });
    },
    goToday() {
      this.calendar.today();
    },
    goPrev() {
      this.calendar.prev();
    },
    goNext() {
      this.calendar.next();
    },
  },
}
</script>

<style>

</style>