<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  *
  examples:
  *
  -->
<template>
  <div id>
    <template v-if="!isMetroUi">
      <b-row :class="rowClass">
        <!-- 라벨 영역 -->
        <b-col :sm="labelWidth" v-if="label!=''">
          <y-label :name="name" :size="size" :label="label" :icon="icon" :required="required"></y-label>
        </b-col>
        <b-col v-if="editable" :sm="width" class="control_area">
          <el-switch
            v-model="vValue"
            theme="bootstrap"
            :active-value="trueValue"
            :inactive-value="falseValue"
            :color="color"
            :disabled="disabled"
            @change="input"
          ></el-switch>
          <span v-if="text">{{text}}</span>
        </b-col>
        <b-col v-else :sm="width">
          <el-switch
            v-model="vValue"
            theme="bootstrap"
            :active-value="trueValue"
            :inactive-value="falseValue"
            :color="color"
            :disabled="true"
            @change="input"
          ></el-switch>
          <span v-if="text">{{text}}</span>
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script>
// TODO : IE 연동 문제로 삭제
// import Switches from 'vue-switches';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-switch', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  props: {
    ui: {
      type: String,
      default: 'bootstrap',
    },
    label: {
      type: String,
      default: '',
    },
    // grid 수정 여부
    editable: {
      type: Boolean,
      default: true,
    },
    // 선택시 텍스트 값
    selectText: {
      type: String,
    },
    // 선택 안 했을때 텍스트 정보
    unselectText: {
      type: String,
    },
    value: {
      type: [Boolean, String, Number],
      default: false,
    },
    name: {
      type: String,
    },
    width: {
      type: Number,
    },
    color: {
      type: String,
      default: 'info',
    },
    size: {
      type: String,
      default: 'sm',
    },
    // 리턴 값이 Boolean 형태가 아닐 경우에 대한 true 대체값
    trueValue: {
      type: [String, Number],
      default: 'Y',
    },
    // 리턴 값이 Boolean 형태가 아닐 경우에 대한 false 대체값
    falseValue: {
      type: [String, Number],
      default: 'N',
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      vValue: null,
    };
  },
  computed: {
    // 현재 컨트롤에 에러가 존재하는지 여부
    error() {
      return this.errorMsg && this.errorMsg.length > 0;
    },
    isMetroUi() {
      return this.ui !== 'bootstrap';
    },
    labelWidth() {
      var width = 12 - this.width;
      return width <= 0 ? 12 : width;
    },
    // select box에서 선택되어진 text 값
    text() {
      if (String(this.vValue) === this.trueValue) {
        return this.$comm.getLangSpecInfoLabel(this.selectText);
      }
      else {
        return this.$comm.getLangSpecInfoLabel(this.unselectText);
      }
    },
  },
  watch: {
    value() {
      this.init();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    $('.control_area')
      .find('span')
      .css('font-size', '80%');
  },
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
      this.vValue = String(this.value); // this.getValue(this.value);
    },
    /** /초기화 관련 함수 **/

    /** Call API service
     * Naming Rule: get, post, put 등의 RESTFul verb를 접두사로 사용하고 그 뒤에 관련 모델명을 Camel case로 추가하세요.
     * Naming Rule: get의 경우 복수의 데이터조회(리스트 데이터 등)시에는 복수를 나타내는 접미사 "s"를 붙여주세요.
     * ex) getExamData () {}
     * ex) getExamDatas () {}
     */

    /** /Call API service **/

    /** validation checking(필요없으면 지워주세요) **/
    /** /validation checking **/

    /** Component Events, Callbacks (버튼 제외) **/
    input() {
      // TODO : 불필요한 로직
      // var value = null;
      // if (this.trueValue && this.falseValue) value = this.vValue ? this.trueValue : this.falseValue;
      // else value = this.vValue;
      return this.$emit('input', this.vValue);
    },
    /** /Component, Callbacks (버튼 제외) **/

    /** 기타 function **/
    // TODO : 불필요한 함수
    // getValue (_value) {
    //   if (this.trueValue && this.falseValue) return this.trueValue === _value;
    //   else return _value;
    // }
    /** /기타 function **/
  },
};
</script>