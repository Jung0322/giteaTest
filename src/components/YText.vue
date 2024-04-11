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
      <b-col :sm="labelWidth" v-if="label!=''">
        <y-label :name="name" :size="size" :label="label" :icon="icon" :required="required"></y-label>
      </b-col>
      <b-col v-if="editable" :sm="width">
        <b-input-group :class="{'ic': hasAppend1, 'ic2': hasAppend2}">
          <!-- 앞쪽에 ICON을 추가해야 할 경우 -->
          <b-input-group-prepend
            v-if="prependIcon"
            :style="{'border': 'solid #ced4da 1px', 'padding-right': '5px'}"
          >
            <f-icon
              v-for="item in prependIcon"
              :key="item.icon"
              :icon="item.icon"
              :size="item.iconSize ? item.iconSize : iconSize"
              :style="{color: item.iconColor ? item.iconColor : iconColor, 'cursor': (item.callbackName ? 'pointer' : 'default'), 'padding-left': '3px', 'padding-right': '3px'}"
              @click.stop="iconClicked(item)"
              class="mt-1 ml-1"
            />
            <slot name="customPrependIcon"></slot>
          </b-input-group-prepend>
          <!-- /앞쪽에 ICON을 추가해야 할 경우 -->
          <b-form-input
            ref="input"
            v-model="vValue"
            :label="label"
            :name="name"
            :placeholder="$comm.getLangSpecInfoLabel(placeholder)"
            :readonly="readonly"
            :size="size"
            :state="state"
            :maxlength="maxlength"
            :type="type"
            :disabled="disabled"
            :class="{clear: false}"
            @input="input"
            @change="change"
            @keyup.enter="searchchange"
          ></b-form-input>

          <!-- clear icon 추가 -->
          <span v-if="!disabled" class="form-control-clear form-control-feedback">
            <f-icon
              icon="times"
              size="sm"
              :style="{'cursor': 'pointer', color: iconColor}"
              @click.stop="clearableClicked"
              class="mt-1"
            />
          </span>
          <!-- /clear icon 추가 -->

          <!-- 컴포넌트 뒷편에 아이콘을 추가해야 할 경우 -->
          <b-input-group-append
            v-if="appendIcon"
            :style="{'border': 'solid #ced4da 1px', 'padding-right': '5px'}"
          >
            <f-icon
              v-for="item in appendIcon"
              :key="item.icon"
              :icon="item.icon"
              :size="item.iconSize ? item.iconSize : iconSize"
              :style="{color: item.iconColor ? item.iconColor : iconColor, 'cursor': (item.callbackName ? 'pointer' : 'default'), 'padding-left': '3px', 'padding-right': '3px'}"
              @click.stop="iconClicked(item)"
              class="mt-1 ml-1"
            />
            <slot name="customAppendIcon"></slot>
          </b-input-group-append>
          <!-- 컴포넌트 뒷편에 텍스트를 추가해야 할 경우 -->
          <b-input-group-append
            v-if="appendText"
            :style="{'border': 'solid #ced4da 1px', 'margin-top': '0px', 'padding-left': '3px', 'padding-right': '3px' }"
          >
            <el-button
              v-for="(item, index) in appendText"
              :key="index"
              plain
              size="sm"
              :style="{'border': 'none', 'padding': '0px', 'height': '27px' }"
              @click.prevent="iconClicked(item)"
            >{{item.text}}</el-button>
            <slot name="customAppendIcon"></slot>
          </b-input-group-append>
          <!-- /컴포넌트 뒷편에 아이콘을 추가해야 할 경우 -->
        </b-input-group>
        <!-- 입력 길이 표시 -->
        <b-form-text v-if="maxlength&&showMaxLength" class="mt-0 mb-1 float-right">{{inputInfo}}</b-form-text>
        <div class="float-left mt-1">
          <el-tag v-if="checkMessage && state === false" size="mini" type="danger">
            <i class="el-icon-warning"></i>
            {{checkMessage}}
          </el-tag>
        </div>
        <!-- /입력 길이 표시 -->
      </b-col>
      <b-col v-else :sm="width">
        <span v-if="vValue&&treeCheck" class="fontSize">
          <b-form-input
            ref="input"
            v-model="vValue"
            :label="label"
            :size="size"
            :type="type"
            :disabled="true"
          ></b-form-input>
        </span>
        <span v-else-if="vValue&&!treeCheck" class="fontSize">{{vValue}}</span>
        <small v-else class="text-muted">
          <em v-if="placeholder">{{$comm.getLangSpecInfoLabel(placeholder)}}</em>
          <em v-else>
            <b-form-input
              ref="input"
              v-model="vValue"
              :label="label"
              :size="size"
              :type="type"
              :disabled="true"
            ></b-form-input>
          </em>
        </small>
        <slot name="customAppendIcon"></slot>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import byteLength from 'utf8-byte-length';
import truncateUtf8Bytes from 'truncate-utf8-bytes';

export default {
  /* attributes: name, components, props, data */
  name: 'y-text',
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
      default: 'elementUi',
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
    treeCheck: {
      type: Boolean,
      default: true,
    },
    counter: {
      type: Number,
    },
    maxlength: {
      type: Number,
    },
    icon: {
      type: String,
    },
    prependIcon: {
      type: [String, Array],
    },
    appendIcon: {
      type: [String, Array],
    },
    appendText: {
      type: [String, Array],
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
    // b-col에 추가할 클래스
    // colClass: {
    //   type: String,
    //   default: ''
    // },
    icon: {
      type: String,
      default: '',
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
    type: {
      type: String,
      default: 'text',
    },
    checkMessage: {
      type: String,
      default: null,
    },
    showMaxLength: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      vValue: '',
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
      return this.limitAsByte ? 'byte' : this.$comm.getLangSpecInfoLabel('L0000002297');
    },
    inputLength() {
      if (!this.vValue) return 0;
      else
        return this.limitAsByte ? byteLength(this.vValue) : this.vValue.length;
    },
    inputInfo() {
      var length = '';
      if (this.vValue)
        length =
          this.inputLength + ' / ' + this.maxlength + ' ' + this.limitText;
      else length = '0 / ' + this.maxlength + ' ' + this.limitText;
      return length;
    },
    truncValue() {
      var truncStr = this.vValue;
      if (this.maxlength && byteLength(truncStr) > this.maxlength) {
        truncStr = truncateUtf8Bytes(truncStr, this.maxlength);
      }
      return truncStr;
    },
    validateId() {
      return this.name + '_id';
    },
    validState() {
      return this.state === null ? null : this.state;
    },
    hasCustomIconClass() {
      return !this.customIconClass;
    },
    hasAppend1() {
      return (
        (this.appendText && this.appendText.length === 1) ||
        (this.appendIcon && this.appendIcon.length === 1)
      );
    },
    hasAppend2() {
      return (
        (this.appendText &&
          this.appendText.length === 1 &&
          this.appendIcon &&
          this.appendIcon.length === 1) ||
        (this.appendIcon && this.appendIcon.length === 2) ||
        (this.appendText && this.appendText.length === 2)
      );
    },
  },
  watch: {
    // todo : 부모 v-model 값이 변경되었을 경우 바인딩
    value() {
      this.vValue = this.value;
    },
    state() {
      if (!this.$refs.input || !this.$refs.input.$el) return;
      if (this.state) {
        // this.$nextTick(() => {
          $(this.$refs.input.$el)
            .removeClass('is-valid')
            .addClass('valid');
        // });
      } else {
        // this.$nextTick(() => {
          $(this.$refs.input.$el)
            .removeClass('is-invalid')
            .addClass('invalid');
        // });
      }
    },
  },
  /* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    this.vValue = this.value;
  },
  mounted() {
    // $(this.$refs.input.$el).addClear();
  },
  beforeDestroy() {},
  destroyed() {},
  updated() {
    // this.$nextTick(() => {
    //   // 모든 화면이 렌더링된 후 실행합니다.
    //   this.vValue = this.value;
    //   $('.clear').click(() => {
    //     this.vValue = '';
    //   });
    // });
  },
  /* methods */
  methods: {
    input() {
      // var truncStr = this.value;
      // if (this.maxlength && byteLength(truncStr) > this.maxlength) {
      //   truncStr = truncateUtf8Bytes(truncStr, this.maxlength);
      //   // this.vValue = truncStr;
      // }

      var value = this.limitAsByte ? this.truncValue : this.vValue;
      // TODO : 부모에게 변경여부 전달
      this.$emit('input', value);
    },
    change() {
      var value = this.limitAsByte ? this.truncValue : this.vValue;
      this.$emit('change', value);
    },
    /**
     * iconClick시 부모에게 emit한다.
     */
    iconClicked(_item) {
      if (!_item.callbackName) {
        return ;
      }
      this.$emit(_item.callbackName, _item);
    },
    /**
     * 입력값 초기화
     */
    clearableClicked() {
      this.vValue = '';
      this.$emit('input', this.vValue);
    },
    searchchange() {
      // 데이터가 변경되는 경우 처리 해당 속성이 설정되어 있으면 조회처리하도록 수정
      var value = this.limitAsByte ? this.truncValue : this.vValue;
      // TODO : 부모에게 변경여부 전달
      this.$emit('datachange', value);
    },
  },
};
</script>

<style scoped>
::-webkit-input-placeholder {
  font-style: italic;
  font-size: 0.8125rem;
}
:-moz-placeholder {
  font-style: italic;
  font-size: 0.8125rem;
}
::-moz-placeholder {
  font-style: italic;
  font-size: 0.8125rem;
}
:-ms-input-placeholder {
  font-style: italic;
  font-size: 0.8125rem;
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
.fontSize {
  font-size: 12.8px;
}
</style>

