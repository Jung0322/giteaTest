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
        <b-input-group>
          <!-- 앞쪽에 ICON을 추가해야 할 경우 -->
          <b-input-group-prepend v-if="prependIcon">
            <f-icon
              v-for="item in appendIcon"
              :key="item.icon"
              :icon="item.icon"
              :size="item.iconSize ? item.iconSize : iconSize"
              :style="{
                color: item.iconColor ? item.iconColor : iconColor,
                cursor: 'pointer',
              }"
              @click.stop="iconClicked(item)"
              class="mt-1 mr-1"
            />
            <slot name="customPrependIcon"></slot>
          </b-input-group-prepend>
          <!-- /앞쪽에 ICON을 추가해야 할 경우 -->
          <b-form-textarea
            v-model="vValue"
            :label="label"
            :name="name"
            :placeholder="placeholder"
            :disabled="disabled"
            :state="state"
            :rows="rows"
            @input="input"
            @change="change"
            :formatter="formatter"
          />
          <b-input-group-append v-if="clearable && !disabled">
            <f-icon
              icon="times"
              :size="iconSize"
              :style="{ cursor: 'pointer', color: iconColor }"
              @click.stop="clearableClicked"
              class="mt-1 ml-1"
            />
          </b-input-group-append>
          <!-- clearable -->
          <!-- 컴포넌트 뒷편에 아이콘을 추가해야 할 경우 -->
          <b-input-group-append v-if="appendIcon">
            <f-icon
              v-for="item in appendIcon"
              :key="item.icon"
              :icon="item.icon"
              :size="item.iconSize ? item.iconSize : iconSize"
              :style="{
                color: item.iconColor ? item.iconColor : iconColor,
                cursor: 'pointer',
              }"
              @click.stop="iconClicked(item)"
              class="mt-1 ml-1"
            />
            <slot name="customAppendIcon"></slot>
          </b-input-group-append>
        </b-input-group>
        <!-- 입력 길이 표시 -->
        <b-form-text
          v-if="maxlength && showMaxLength"
          class="mt-0 mb-1 text-right"
          >{{ inputInfo }}</b-form-text
        >
        <!-- /입력 길이 표시 -->
      </b-col>
      <b-col v-else :sm="width">
        <b-form-textarea
          v-model="vValue"
          :label="label"
          :name="name"
          :placeholder="placeholder"
          :disabled="true"
          :rows="rows"
          @input="input"
          :formatter="formatter"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import byteLength from 'utf8-byte-length';
import truncateUtf8Bytes from 'truncate-utf8-bytes';

export default {
  /* attributes: name, components, props, data */
  name: 'y-textarea',
  $_veeValidate: {
    name() {
      return this.name;
    },
    value() {
      return this.vValue;
    },
  },
  props: {
    ui: {
      type: String,
      default: 'metroUi',
    },
    name: {
      type: String,
    },
    label: {
      // 부모로 부터 받아온 라벨 정보
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: null,
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
    width: {
      type: Number,
      default: 12,
    },
    state: {
      type: Boolean,
      default: null,
    },
    rows: {
      type: Number,
      default: 3,
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
    icon: {
      type: String,
      default: '',
    },
    // 필수 입력 여부
    required: {
      type: Boolean,
      default: false,
    },
    prependIcon: {
      type: [String, Array],
    },
    appendIcon: {
      type: [String, Array],
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
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
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
      return this.limitAsByte
        ? 'byte'
        : this.$comm.getLangSpecInfoLabel('L0000002297');
    },
    inputLength() {
      return this.limitAsByte ? byteLength(this.vValue) : this.vValue.length;
    },
    inputInfo() {
      var length = (length = '0 / ' + this.maxlength + ' ' + this.limitText);
      if (this.vValue)
        length =
          this.inputLength + ' / ' + this.maxlength + ' ' + this.limitText;
      return length;
    },
    truncValue() {
      if (!this.vValue) return '';
      var truncStr = this.vValue;
      if (this.maxlength && byteLength(truncStr) > this.maxlength) {
        truncStr = truncateUtf8Bytes(truncStr, this.maxlength);
      }
      return truncStr;
    },
  },
  watch: {
    // todo : 부모의 v-model 변경을 감시(예를 들면, db로부터 데이터를 조회 한 후 값을 바인딩 할 경우)s
    value() {
      if (this.value && this.value.length > this.maxlength) {
        this.$emit('input', this.value.substr(0, this.maxlength));
        return;
      }
      this.vValue = this.value;
    },
    state() {
      if (!this.$refs.input || !this.$refs.input.$el) return;
      if (this.state) {
        // this.$nextTick(() => {
        $(this.$refs.input.$el).removeClass('is-valid').addClass('valid');
        // });
      } else {
        // this.$nextTick(() => {
        $(this.$refs.input.$el).removeClass('is-invalid').addClass('invalid');
        // });
      }
    },
  },
  /* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    if (!this.value) return;
    this.vValue = this.value;
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {},
  updated() {
    this.$nextTick(() => {
      // 모든 화면이 렌더링된 후 실행합니다.
      // this.vValue = this.value;
    });
  },
  /* methods */
  methods: {
    input() {
      // TODO : 부모에게 변경여부 전달
      var value = this.limitAsByte ? this.truncValue : this.vValue;
      // TODO : 부모에게 변경여부 전달
      this.$emit('input', value.substr(0, this.maxlength));
    },
    /**
     * iconClick시 부모에게 emit한다.
     */
    iconClicked(_item) {
      if (!_item.callbackName) {
        return window.alert('[개발자용] callback 함수명이 없습니다.');
      }
      this.$emit(_item.callbackName);
    },
    /**
     * 입력값 초기화
     */
    clearableClicked() {
      this.vValue = '';
      this.$emit('input', this.vValue);
    },
    formatter(value) {
      return this.maxlength ? value.substr(0, this.maxlength) : value;
    },
    change() {
      // TODO : 부모에게 변경여부 전달
      var value = this.limitAsByte ? this.truncValue : this.vValue;
      // TODO : 부모에게 변경여부 전달
      this.$emit('change', value.substr(0, this.maxlength));
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

.valid {
  border-color: #28a745;
  padding-right: 2.25rem;
}

.invalid {
  border-color: #dc3545;
  padding-right: 2.25rem;
}
</style>
