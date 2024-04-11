<!--
목적 : v-date-picker기반 datepicker 컴포넌트
Detail :
 * 주의사항 :
  - vee-validate를 사용하여 유효성 검사
  - 여기서는 컴포넌트 자체에서 발생하는 유효성을 검사
  - 부모에서는($validator.validateAll 함수 호출 시) 별도로 추가해야 함
  - 즉, 유효성 검사를 2중 체크를 하고 있으며 이는 나중에 개선해야 할 사항임
examples: 
 *  <YDatepicker 
      label="요청일*"
      name="rqstDt"
      v-model="saveData.workOrder.rqstDt"
      default="today"
      validate-type="required"
      :parentValidateCheck="validateCheck"
      >
    </YDatepicker>
-->
<template>
  <div>
    <b-row :class="rowClass">
      <b-col :sm="labelWidth" v-if="label != ''">
        <y-label
          :name="name"
          :size="size"
          :label="label"
          :icon="icon"
          :required="required"
        ></y-label>
      </b-col>
      <b-col v-if="editable" :sm="width" class="fix-height">
        <!-- v-if="vValue" -->
        <datetime-picker
          v-model="vValue"
          :width="datepickerWidth"
          :lang="krLanguage"
          :range="range"
          :type="type"
          :format="format"
          :value-type="format"
          :not-before="start"
          :not-after="end"
          :disabled-date="disabledDate"
          :clearable="clearable"
          :append-to-body="true"
          :disabled="disabled"
          input-class="inputClass"
          placeholder="select"
          :confirm="range"
          :confirmText="$comm.getLangSpecInfoLabel('L0000003321') /* 확인 */"
          :minute-step="minuteStep"
          :time-picker-options="timePickerOptions"
          :hourOptions="hourOptions"
          :minuteOptions="minuteOptions"
          :show-time-header="true"
          :time-title-format="timeTitleFormat"
          @input="input"
          @calendar-change="calendarChange"
          @change="change"
          @blur="blur"
          @clear="clear"
        >
        </datetime-picker>
      </b-col>
      <b-col v-else :sm="width" class="fix-height">
        <datetime-picker
          v-model="vValue"
          :width="datepickerWidth"
          :lang="krLanguage"
          :range="range"
          :disabled-date="disabledDate"
          :type="type"
          :format="format"
          :value-type="format"
          :not-before="start"
          :not-after="end"
          :clearable="clearable"
          :append-to-body="true"
          :disabled="true"
          input-class="inputClass"
          :minute-step="minuteStep"
          :confirmText="$comm.getLangSpecInfoLabel('L0000003321') /* 확인 */"
          :time-picker-options="timePickerOptions"
          :hourOptions="hourOptions"
          :minuteOptions="minuteOptions"
          @input="input"
          @change="change"
          @clear="clear"
        ></datetime-picker>
      </b-col>
    </b-row>
  </div>
</template>

<script>
let localeMapper = require('@/locale/localeMapper.json');
import vue2Datepicker from 'vue2-datepicker';
import {
  isValidDate,
  isValidRange,
  isDateObejct,
  isPlainObject,
  formatDate,
  parseDate,
  throttle,
} from '@/js/transformBase';
import ko from 'vue2-datepicker/locale/ko';
import en from 'vue2-datepicker/locale/en';
import ja from 'vue2-datepicker/locale/ja';
import zh_cn from 'vue2-datepicker/locale/zh-cn';
import zh_tw from 'vue2-datepicker/locale/zh-tw';
import { transformDate, transformDateRange } from '@/js/transform';

// require("moment/min/locales.min");
export default {
  /* attributes: name, components, props, data */
  name: 'y-datepicker',
  components: {
    'datetime-picker': vue2Datepicker,
  },
  // TODO : veeValidate error를 처리하기 위해 선언해야 하는 부분
  $_veeValidate: {
    name() {
      return this.name;
    },
    value() {
      return this.vValue;
    },
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: 'date',
    },
    // TODO : 부모로 부터 에러 메시지를 받아옴
    errorMsg: {
      type: String,
      required: false,
    },
    // 쓰기 권한 여부
    editable: {
      type: Boolean,
      default: true,
    },
    // TODO : 부모의 v-model의 값을 받아오는 속성
    value: {
      type: [String, Date, Array],
      default: null,
    },
    // 컴포넌트의 너비(1~12)
    width: {
      type: Number,
      default: 12,
    },
    size: {
      type: String,
      default: 'sm',
    },
    // b-row에 추가할 클래스
    rowClass: {
      type: String,
      default: 'mb-2',
    },
    // 기간 선택 여부
    range: {
      type: Boolean,
      default: false,
    },
    // 기본:날짜 선택, month: 월만 선택, year: 년도만 선택, time: 시간 선택
    type: {
      type: String,
      default: 'date',
    },
    minuteStep: {
      type: Number,
      default: 0,
    },
    // 날짜의 기본값
    default: {
      type: [String, Array],
      default: null,
    },
    defaultPeriod: {
      type: String,
      default: '1m',
    },
    placeholder: {
      type: String,
      default: '',
    },
    datepickerWidth: {
      type: [Number, String],
      default: '100%',
    },
    icon: {
      type: String,
      default: '',
    },
    // 필수 입력 여부
    required: {
      type: Boolean,
      default: false,
    },
    // 시작일
    start: {
      type: String,
      default: '',
    },
    // 종료일
    end: {
      type: String,
      default: '',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    timePickerOptions: {
      type: Object,
    },
    hourOptions: {
      type: Array,
    },
    minuteOptions: {
      type: Array,
    },
    viewFormat: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      datePickerMenu: null,
      localFormattedDate: null, // TODO : 날짜 값을 표시하는 v-text-field에 표시되는 값으로 local date format 형태의 값(언어 설정 변경시 같이 변경됨)
      locale: 'ko-KR', // window.getApp.locale.datepicker
      period: [],
      vValue: null, // TODO : datepicker 내부 값, YYYY-MM-DD(ISO 표준) 형태의 값
      timeTitleFormat: '',
    };
  },
  computed: {
    // 현재 컨트롤에 에러가 존재하는지 여부
    error() {
      return this.errorMsg && this.errorMsg.length > 0;
    },
    isMetroUi() {
      return this.ui === 'metroUi';
    },
    labelWidth() {
      var width = 12 - this.width;
      return width <= 0 ? 12 : width;
    },
    format() {
      if (this.viewFormat) {
        return this.viewFormat;
      }

      if (this.type === 'date') {
        return 'YYYY-MM-DD';
      } else if (this.type === 'month') {
        return 'YYYY-MM';
      } else if (this.type === 'year') {
        return 'YYYY';
      } else if (this.type === 'time') {
        if (this.minuteStep > 0) {
          if (this.$comm.getLang() === 'kr') {
            this.timeTitleFormat = 'HH시mm분';
          } else {
            this.timeTitleFormat = 'HH:mm';
          }
          return 'HH:mm';
        } else {
          if (this.$comm.getLang() === 'kr') {
            this.timeTitleFormat = 'HH시mm분s초';
          } else {
            this.timeTitleFormat = 'HH:mm:s';
          }
          return 'HH:mm:ss';
        }
      } else if (this.type === 'datetime') {
        if (this.minuteStep > 0) {
          if (this.$comm.getLang() === 'kr') {
            this.timeTitleFormat = 'HH시mm분';
          } else {
            this.timeTitleFormat = 'HH:mm';
          }
          return 'YYYY-MM-DD HH:mm';
        } else {
          if (this.$comm.getLang() === 'kr') {
            this.timeTitleFormat = 'HH시mm분s초';
          } else {
            this.timeTitleFormat = 'HH:mm:s';
          }
          return 'YYYY-MM-DD HH:mm:ss';
        }
      } else {
        return 'YYYY-MM-DD';
      }
    },
    krLanguage() {
      if (this.$comm.getLang() === 'kr') {
        return ko;
      } else if (this.$comm.getLang() === 'en') {
        return en;
      } else if (this.$comm.getLang() === 'ja') {
        return ja;
      } else if (this.$comm.getLang() === 'zh_cn') {
        return zh_cn;
      } else if (this.$comm.getLang() === 'zh_tw') {
        return zh_tw;
      }

      return ko;
    },
    transform() {
      const obj = this.range ? transformDateRange : transformDate;
      const type = this.valueType;
      if (isPlainObject(type)) {
        return { ...obj.date, ...type };
      }
      return obj[type] || obj.date;
    },
  },
  watch: {
    errorMsg() {},
    default() {
      if (!this.default) return;
      if (this.default === 'today') {
        this.vValue = this.$comm.getToday();
        this.$emit(
          'input',
          this.$comm.moment(this.vValue).format('YYYY-MM-DD')
        );
      } else {
        this.vValue = this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          this.default,
          'yyyy-mm-dd'
        );
      }
    },
    vValue() {},
    // todo : 부모의 v-model 변경을 감시
    value: {
      handler: function (val, oldVal) {
        this.vValue = this.value;
      },
      deep: true,
    },
  },
  /* Vue lifecycle: created, mounted, destroyed, etc */
  beforeMount() {
    window.getApp.$on('LOCALE_CHANGE', (_localeCode) => {
      // datepicker의 언어설정
      this.locale = localeMapper[_localeCode].datepicker;
      this.setLocalFormattedDate();
    });

    // TODO : 팝업창의 z-index가 2001이어서 강제로 z-index를 높게 지정, element-ui의 popover도 z-index가 2021임
    // $('.mx-datepicker-popup').css('z-index', '3000');
  },
  mounted() {
    this.vValue = this.value;
  },
  beforeDestroy() {
    // TODO : remove event listener, 삭제 하지 않으면 이벤트가 중복 발생됨
    window.getApp.$off('LOCALE_CHANGE');
  },
  /* methods */
  methods: {
    input() {
      this.$emit('input', this.vValue);
      this.$emit('change', this.vValue);
    },
    change() {
      // 값 변경 이벤트
      this.$emit('datachange', this.vValue);
    },
    /**
     * delete icon 클릭시 값 초기화
     */
    clearValue() {
      this.vValue = null;
      this.localFormattedDate = null;
      this.$refs.datePickerMenu.save(this.vValue);
      this.$emit('input', this.vValue);
    },
    // locale이 변경되었을 경우 datepicker의 값 변경
    setLocalFormattedDate() {
      var dateFormat = 'L';
      if (this.locale.toLowerCase() === 'ko-kr') dateFormat = 'YYYY-MM-DD';
      this.localFormattedDate = this.$comm
        .moment(this.vValue)
        .format(dateFormat);
      if (this.localFormattedDate === 'Invalid date') {
        this.localFormattedDate = '';
      }
      this.$emit('input', this.localFormattedDate);
    },
    setLocalFormattedPeriod() {
      var dateFormat = 'L';
      if (this.locale.toLowerCase() === 'ko-kr') dateFormat = 'YYYY-MM-DD';
      this.period = [
        this.$comm.moment(this.vValue[0]).format(dateFormat),
        this.$comm.moment(this.vValue[1]).format(dateFormat),
      ];
      // const date = this.transform.value2date(this.vValue, this.format);
      if (this.vValue === 'Invalid date') this.vValue = '';
      this.$emit('input', this.vValue);
    },
    blur() {},
    // 기간 일 경우 confirm 버튼을 둠으로 인해 blur 처리가 현상으로 인해 vValue에 값을 넣어줌
    calendarChange(n, o, x) {
      if (!this.vValue || this.vValue.length === 0) return;
      if (this.range) {
        // to do..
      }
    },
    disabledDate(date) {
      let startCheck = false;
      let endCheck = false;
      if (this.start) {
        startCheck = date < this.$comm.moment(this.start);
      }
      if (this.end) {
        endCheck = date > this.$comm.moment(this.end);
      }
      return startCheck || endCheck;
    },
    clear() {
      // 기간 지정 후 clear 시 [ null, null ] 형태로 return 하고 있어 [] 형태로 return 하도록 추가
      if (this.range) {
        this.vValue = [];
        this.$emit('input', this.vValue);
      }
    },
  },
};
</script>

<style>
::-webkit-input-placeholder {
  font-style: italic;
  font-size: 1rem;
}
:-moz-placeholder {
  font-style: italic;
  font-size: 1rem;
}
::-moz-placeholder {
  font-style: italic;
  font-size: 1rem;
}
:-ms-input-placeholder {
  font-style: italic;
  font-size: 1rem;
}
</style>

<style lang="scss">
.inputClass {
  display: inline-block;
  width: 100%;
  height: 31px;
  max-height: 31px;
  // padding: 6px 30px;
  padding: 0px 30px;
  padding-left: 10px;
  font-size: 0.875rem;
  line-height: 1.4;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  &:disabled,
  &.disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
  }
}
.fix-height {
  height: 31px;
}
.fix-height .mx-datepicker {
  width: 100% !important;
}
</style>
