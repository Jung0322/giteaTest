<!--
목적 : 확장검색 기능을 지원하는 컴포넌트
Detail :
 * 
examples: 
 *  
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
      <b-col v-if="editable" :sm="width">
        <b-input-group :class="{ ic: hasAppend1, ic2: hasAppend2 }">
          <!-- 앞쪽에 ICON을 추가해야 할 경우 -->
          <b-input-group-prepend
            v-if="prependIcon"
            :style="{ border: 'solid #ced4da 1px', 'padding-left': '3px' }"
          >
            <f-icon
              v-for="item in prependIcon"
              :key="item.icon"
              :icon="item.icon"
              :size="item.iconSize ? item.iconSize : iconSize"
              :style="{
                color: item.iconColor ? item.iconColor : iconColor,
                cursor: 'pointer',
                'padding-left': '3px',
                'padding-right': '3px',
              }"
              @click.stop="iconClicked(item)"
              class="mt-1 mr-1"
            />
            <slot name="customPrependIcon"></slot>
          </b-input-group-prepend>
          <!-- /앞쪽에 ICON을 추가해야 할 경우 -->

          <b-form-input
            ref="input"
            class="custom-align"
            v-model.trim="vValue"
            :label="label"
            :name="name"
            :placeholder="placeholder"
            :readonly="readonly"
            :state="state"
            :size="size"
            :maxlength="maxlength"
            :disabled="disabled"
            type="text"
            @input="input"
            @change="change"
            @focus="focus"
            @blur="blur"
          ></b-form-input>

          <!-- clear icon 추가 -->
          <span
            v-if="!disabled"
            class="form-control-clear form-control-feedback"
          >
            <f-icon
              icon="times"
              size="sm"
              :style="{ cursor: 'pointer', color: iconColor }"
              @click.stop="clearableClicked"
              class="mt-1"
            />
          </span>
          <!-- /clear icon 추가 -->

          <!-- 컴포넌트 뒷편에 아이콘을 추가해야 할 경우 -->
          <b-input-group-append
            v-if="appendIcon"
            :style="{ border: 'solid #ced4da 1px', 'padding-right': '5px' }"
          >
            <f-icon
              v-for="item in appendIcon"
              :key="item.icon"
              :icon="item.icon"
              :size="item.iconSize ? item.iconSize : iconSize"
              :style="{
                color: item.iconColor ? item.iconColor : iconColor,
                cursor: pointer,
                'padding-left': '3px',
                'padding-right': '3px',
              }"
              @click.stop="iconClicked(item)"
              class="mt-1 ml-1"
            />
            <slot name="customAppendIcon"></slot>
          </b-input-group-append>
          <!-- 컴포넌트 뒷편에 텍스트를 추가해야 할 경우 -->
          <b-input-group-append
            v-if="appendText"
            :style="{
              border: 'solid #ced4da 1px',
              'padding-right': '5px',
              'padding-left': '5px',
              'padding-top': '3px',
            }"
          >
            {{ $comm.getLangSpecInfoLabel(appendText) }}
            <slot name="customAppendIcon"></slot>
          </b-input-group-append>
        </b-input-group>
        <!-- 입력 길이 표시 -->
        <b-form-text
          v-if="maxlength && showMaxLength && !disabled"
          class="mt-0 mb-1 text-right"
          >{{ inputInfo }}</b-form-text
        >
        <!-- /입력 길이 표시 -->
      </b-col>
      <b-col v-else>
        <b-form-input
          ref="input"
          class="custom-align"
          v-model.trim="vValue"
          :label="label"
          :name="name"
          :size="size"
          :disabled="true"
          type="text"
          @input="input"
        ></b-form-input>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import byteLength from 'utf8-byte-length';
import truncateUtf8Bytes from 'truncate-utf8-bytes';

export default {
  /* attributes: name, components, props, data */
  name: 'y-number',
  $_veeValidate: {
    name() {
      return this.name;
    },
    value() {
      return this.vValue;
    },
  },
  props: {
    name: {
      type: String,
    },
    ui: {
      type: String,
      default: 'metroUi',
    },
    label: {
      // 부모로 부터 받아온 라벨 정보
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
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
      type: [Number, String],
      default: null,
    },
    counter: {
      type: Number,
    },
    maxlength: {
      type: Number,
    },
    maxValue: {
      type: Number,
    },
    icon: {
      type: String,
      default: '',
    },
    prependIcon: {
      type: [String, Array],
    },
    appendIcon: {
      type: [String, Array],
    },
    appendText: {
      type: String,
      default: '',
    },
    // 커스텀 클래스
    customClass: {
      type: String,
    },
    hideDetail: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: [String, Number],
    },
    backgroundColor: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
    outline: {
      type: Boolean,
      default: false,
    },
    solo: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 12,
    },
    state: {
      type: Boolean,
      default: null,
    },
    hasSeperator: {
      type: Boolean,
      default: true,
    },
    // 단위를 앞에 표시할 경우에 단위를 prefix에 넣는다.
    prefix: {
      type: String,
      default: null,
    },
    // 단위를 뒤에 표시할 경우에 단위를 prefix에 넣는다.
    suffix: {
      type: String,
      default: null,
    },
    pointNumber: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: 'sm',
    },
    // 바이트로 제한 할 것인지 input box의 maxLength로 제한 할 것인지에 대한 구분
    limitAsByte: {
      type: Boolean,
      default: false,
    },
    // b-row에 추가할 클래스
    rowClass: {
      type: String,
      default: 'mb-2',
    },
    // 필수 입력 여부
    required: {
      type: Boolean,
      default: false,
    },
    // 아이콘의 색상
    iconColor: {
      type: String,
      default: '#BDBDBD',
    },
    // 아이콘의 색상
    pointer: {
      type: String,
      default: 'pointer',
    },
    // 아이콘 커스텀 클래스
    customIconClass: {
      type: String,
      default: '',
    },
    // 아이콘 크기
    iconSize: {
      type: String,
      default: 'lg',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    showMaxLength: {
      type: Boolean,
      default: true,
    },
    // 양수만 입력가능여부
    isPositive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      vValue: '',
      formatOption: {},
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
    limitText() {
      return this.limitAsByte
        ? 'byte'
        : this.$comm.getLangSpecInfoLabel('L0000002297');
    },
    inputLength() {
      return this.limitAsByte ? byteLength(this.vValue) : this.vValue.length;
    },
    inputInfo() {
      var length = '';
      if (this.vValue) {
        length =
          this.inputLength + ' / ' + this.maxlength + ' ' + this.limitText;
      } else length = '0 / ' + this.maxlength + ' ' + this.limitText;
      return length;
    },
    // byte 계산
    truncValue() {
      var truncStr = this.vValue.replace(/[^-\.0-9]/g, '');
      if (!this.vValue || !truncStr) return '';
      // 소수점 표현을 하지 않거나, 소수점을 찍기 위해 .을 표시하는 경우(예: 10.)가 아니면 number 형식으로 바꿈
      if (
        !this.pointNumber ||
        truncStr.lastIndexOf('.') !== truncStr.length - 1
      ) {
        truncStr = this.$numeral(truncStr).value().toString();
      }
      // maxlength와 입력된 값의 byte를 비교해서 크면 입력 못하게 잘라낸다.
      if (this.maxlength && byteLength(truncStr) > this.maxlength) {
        truncStr = truncateUtf8Bytes(truncStr, this.maxlength);
      }

      return this.$numeral(truncStr).format(this.numberFormat);
    },
    validateId() {
      return this.name + '_id';
    },
    validState() {
      return this.state === null ? null : this.state;
    },
    numberValue() {
      if (this.value) {
        let strVal = String(this.value);

        // 22.07.29
        // 소수점 입력을 위한 숫자 포맷 (ex - 0.001, 1.00005, ...)
        let tempFormat =
          (this.hasSeperator && strVal.split('.')[0] !== '-'
            ? strVal.split('.')[0] + ',0'
            : strVal.split('.')[0]) +
          (strVal.split('.')[1]
            ? '.' + strVal.split('.')[1].slice(0, this.pointNumber)
            : '');

        // 22.07.29
        // 음수 및 소수점 입력에 대한 조건 수정
        if (this.pointNumber > 0 || !this.isPositive) {
          // 음수 또는 소수 입력 가능일 경우
          let regex = new RegExp(
            '(^-$)|(^-[0]+$)|(^-[0]+[\.][0]+$)|(^[0-9]+[\.]$)|(^[-][0-9]+[\.]$)'
          );

          // return strVal.indexOf('.') !== strVal.length - 1 &&
          //   (strVal.indexOf('-') !== 0 || strVal.length !== 1)
          //   ? this.$numeral(strVal).format(tempFormat)
          //   : strVal;
          return !regex.test(
            this.hasSeperator ? strVal.replace(/,/g, '') : strVal
          )
            ? this.$numeral(strVal).format(tempFormat)
            : strVal;
        }

        return this.$numeral(strVal).format(tempFormat.replaceAll('-', ''));
      } else {
        // this.$emit('input', 0);
        return this.value;
      }
    },
    // hasSeperator, prefix, suffix, pointNumber 속성에 따라서 숫자 포맷지정
    numberFormat() {
      var format = '0';
      if (this.hasSeperator) format += ',0';
      // if (this.pointNumber) format += '[.]0';
      if (this.pointNumber) {
        let pad = '[';
        for (let i = 0; i < this.pointNumber; i++) pad += '0';
        format += '[.]' + pad + ']';
      }
      if (this.prefix) format = this.prefix + ' ' + format;
      if (this.suffix) format += format + ' ' + this.suffix;

      return format;
    },
    hasAppend1() {
      return (
        this.appendText || (this.appendIcon && this.appendIcon.length === 1)
      );
    },
    hasAppend2() {
      return (
        (this.appendText && this.appendIcon && this.appendIcon.length === 1) ||
        (this.appendIcon && this.appendIcon.length === 2)
      );
    },
  },
  watch: {
    // todo : 부모 v-model 값이 변경되었을 경우 바인딩
    value() {
      this.vValue = this.numberValue;
    },
    state() {
      if (this.state) {
        this.$nextTick(() => {
          $(this.$refs.input.$el).removeClass('is-valid').addClass('valid');
        });
      } else {
        this.$nextTick(() => {
          $(this.$refs.input.$el).removeClass('is-invalid').addClass('invalid');
        });
      }
    },
  },
  /* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    this.vValue = this.numberValue;
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  updated() {
    this.$nextTick(() => {
      // 모든 화면이 렌더링된 후 실행합니다.
      this.vValue = this.numberValue;
    });
  },
  /* methods */
  methods: {
    input() {
      // var t = this.truncValue;

      // 22.07.29
      // 소수점 입력을 위한 숫자 포맷 (ex - 0.001, 1.00005, ...)
      let tempFormat =
        (this.hasSeperator && this.vValue.split('.')[0] !== '-'
          ? this.vValue.split('.')[0] + ',0'
          : this.vValue.split('.')[0]) +
        (this.vValue.split('.')[1]
          ? '.' + this.vValue.split('.')[1].slice(0, this.pointNumber)
          : '');

      // 22.07.29
      // 음수 및 소수점 입력에 대한 조건 수정
      // var value =
      //   this.vValue.indexOf('.') !== this.vValue.length - 1 &&
      //   (this.vValue.indexOf('-') !== 0 || this.vValue.length !== 1)
      //     ? this.$numeral(this.vValue).format(tempFormat)
      //     : this.vValue;
      var value = null;

      if (this.pointNumber > 0 || !this.isPositive) {
        // 음수 또는 소수 입력 가능일 경우
        let regex = new RegExp(
          '(^-$)|(^-[0]+$)|(^-[0]+[\.][0]+$)|(^[0-9]+[\.]$)|(^[-][0-9]+[\.]$)'
        );
        value = !regex.test(
          this.hasSeperator ? this.vValue.replace(/,/g, '') : this.vValue
        )
          ? this.$numeral(this.vValue).format(tempFormat)
          : this.vValue;
      } else {
        value = this.$numeral(this.vValue).format(
          tempFormat.replaceAll('-', '')
        );
      }

      // replace할 문자열 정규식
      let replaceRegex = /[^-\.0-9]/g;

      if (this.pointNumber <= 0 && this.isPositive) {
        // 양의 정수만 입력 가능
        replaceRegex = /[^0-9]/g;
      } else if (this.pointNumber <= 0) {
        // 정수만 입력 가능
        replaceRegex = /[^-0-9]/g;
      } else if (this.isPositive) {
        // 양수만 입력 가능
        replaceRegex = /[^\.0-9]/g;
      }

      if (value != null) {
        if (typeof value === 'string') {
          value = value.replace(replaceRegex, '');
        } else {
          value = Number(value.toString().replace(replaceRegex, ''));
        }
      }

      if (this.maxValue > 0 && this.vValue > this.maxValue) {
        value = this.maxValue;
      }

      // value = this.$numeral(this.vValue).format(this.numberFormat);
      // TODO : 부모에게 변경여부 전달
      this.$emit('datachange', value);
      this.$emit('input', value);
    },
    change() {
      // var t = this.truncValue;// 소수점 입력을 위한 숫자 포맷 (ex - 0.001, 1.00005, ...)
      let tempFormat =
        (this.hasSeperator && this.vValue.split('.')[0] !== '-'
          ? this.vValue.split('.')[0] + ',0'
          : this.vValue.split('.')[0]) +
        (this.vValue.split('.')[1]
          ? '.' + this.vValue.split('.')[1].slice(0, this.pointNumber)
          : '');

      // var value =
      //   this.vValue.indexOf('.') !== this.vValue.length - 1 &&
      //   (this.vValue.indexOf('-') !== 0 || this.vValue.length !== 1)
      //     ? this.$numeral(this.vValue).format(tempFormat)
      //     : this.vValue;

      var value = null;

      if (this.pointNumber > 0 || !this.isPositive) {
        // 음수 또는 소수 입력 가능일 경우
        let regex = new RegExp(
          '(^-$)|(^-[0]+$)|(^-[0]+[\.][0]+$)|(^[0-9]+[\.]$)|(^[-][0-9]+[\.]$)'
        );
        value = !regex.test(
          this.hasSeperator ? this.vValue.replace(/,/g, '') : this.vValue
        )
          ? this.$numeral(this.vValue).format(tempFormat)
          : this.vValue;
      } else {
        value = this.$numeral(this.vValue).format(
          tempFormat.replaceAll('-', '')
        );
      }

      // replace할 문자열 정규식
      let replaceRegex = /[^-\.0-9]/g;

      if (this.pointNumber <= 0 && this.isPositive) {
        // 양의 정수만 입력 가능
        replaceRegex = /[^0-9]/g;
      } else if (this.pointNumber <= 0) {
        // 정수만 입력 가능
        replaceRegex = /[^-0-9]/g;
      } else if (this.isPositive) {
        // 양수만 입력 가능
        replaceRegex = /[^\.0-9]/g;
      }

      if (value != null) {
        if (typeof value === 'string') {
          value = value.replace(replaceRegex, '');
        } else {
          value = Number(value.toString().replace(replaceRegex, ''));
        }
      }
      // value = this.$numeral(this.vValue).format(this.numberFormat);
      // TODO : 부모에게 변경여부 전달
      this.$emit('change', value);
    },
    isNumeric() {
      if (isNaN(this.vValue ? this.vValue.replace(/,/g, '') : this.vValue)) {
        return false;
      } else {
        let regex = new RegExp('(^[0-9]+[\.]$)|(^[-][0-9]+[\.]$)');
        return !regex.test(
          this.hasSeperator && this.vValue
            ? this.vValue.replace(/,/g, '')
            : this.vValue
        );
      }
    },
    /**
     * iconClick시 부모에게 emit한다.
     */
    iconClicked(_item) {
      if (this.pointer === 'pointer') {
        if (!_item.callbackName) {
          return window.alert('[개발자용] callback 함수명이 없습니다.');
        }
        this.$emit(_item.callbackName);
      }
    },
    /**
     * 입력값 초기화
     */
    clearableClicked() {
      this.vValue = 0;
      this.$emit('input', this.vValue);
    },
    focus() {
      if (this.vValue === 0 || this.vValue === '0') {
        this.vValue = '';
        this.$emit('input', this.vValue);
      }
    },
    blur() {
      if (this.vValue === '' || !this.isNumeric()) {
        this.vValue = 0;
        this.$emit('input', this.vValue);
      }
    },
  },
};
</script>

<style scoped>
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

/** todo : clear icon 추가 **/
.clear {
  padding-right: 2.25rem;
  background-repeat: no-repeat;
  background-position: center right calc(2.25rem / 4);
  background-size: calc(2.25rem / 2) calc(2.25rem / 2);
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23BDBDBD' viewBox='-2 -2 7 7'%3e%3cpath stroke='%23BDBDBD' d='M0 0l3 3m0-3L0 3'/%3e%3ccircle r='.5'/%3e%3ccircle cx='3' r='.5'/%3e%3ccircle cy='3' r='.5'/%3e%3ccircle cx='3' cy='3' r='.5'/%3e%3c/svg%3E");
}
.form-control-feedback {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  display: block;
  width: 34px;
  height: 31px;
  line-height: 31px;
  text-align: center;
  pointer-events: none;
}
.form-control-clear {
  z-index: 10;
  pointer-events: auto;
  cursor: pointer;
}

/** TODO : 뒤에 icon이 한 개 일 경우 **/
.ic .form-control-clear {
  right: 24px;
}
/** TODO : 뒤에 icon이 두 개 일 경우 **/
.ic2 .form-control-clear {
  right: 48px;
}

.valid {
  border-color: #28a745;
  padding-right: 2.25rem;
}

.invalid {
  border-color: #dc3545;
  padding-right: 2.25rem;
}

.custom-align {
  text-align: right;
  padding-right: 30px;
}
</style>
