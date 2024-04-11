<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  *
  examples:
  *
  -->
<template>
  <div>
    <template v-if="isMetroUi">
      <div>MetroUI용 컴포넌트는 준비중입니다.</div>
    </template>
    <template v-else>
      <b-row>
        <b-col :sm="labelWidth">
          <y-label
            :name="name"
            :size="size"
            :label="label"
          >
          </y-label>
        </b-col>
        <b-col 
          v-if="editable"
          :sm="width">
        </b-col>
        <b-col v-else>
          <span v-if="text">
            {{text}}
          </span>
          <small v-else class="text-muted"><em>선택된 데이터가 없습니다.</em></small>
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script>
export default {
  /** attributes: name, components, props, data **/
  name: 'y-',  // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  $_veeValidate: {
    name () {
      return this.name;
    },
    value () {
      return this.vValue;
    }
  },
  props: {
    ui: {
      type: String,
      default: 'metroUi',
    },
    name: {
      type: String
    },
    label: {  // 부모로 부터 받아온 라벨 정보
      type: String,
      default: ''
    },
    // 쓰기 권한 여부
    editable: {
      type: Boolean,
      default: true
    },
    // 컴포넌트의 너비(1~12)
    width: {
      type: Number,
      default: 12
    },
    // TODO : 부모의 v-model의 값을 받아오는 속성
    value: {
      type: [Number, String],
      default: null
    },
    size: {
      type: String,
      default: 'sm'
    }
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data () {
    return {
      vValue: ''
    };
  },
  watch: {
    // TODO : 부모의 v-model 변경을 감시(예를 들면, db로부터 데이터를 조회 한 후 값을 바인딩 할 경우)
    value () {
      this.vValue = this.value;
    }
  },
  computed: {
    // 현재 컨트롤에 에러가 존재하는지 여부
    error () {
      return this.errorMsg && this.errorMsg.length > 0;
    },
    isMetroUi () {
      return this.ui === 'metroUi';
    },
    labelWidth () {
      var width = 12 - this.width;
      return width <= 0 ? 12 : width;
    },
    // select box에서 선택되어진 text 값
    text () {
      var text = '';
      return text;
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    this.init();
  },
  mounted () {
  },
  beforeDestory () {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init () {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
    },
    /** /초기화 관련 함수 **/
    
    /** Call API service
    * Naming Rule: get, post, put 등의 RESTFul verb를 접두사로 사용하고 그 뒤에 관련 모델명을 Camel case로 추가하세요.
    * Naming Rule: get의 경우 복수의 데이터조회(리스트 데이터 등)시에는 복수를 나타내는 접미사 "s"를 붙여주세요.
    * ex) getExamData () {}
    * ex) getExamDatas () {}
    */   
    /** /Call API service **/
    
   
    /** 기타 function **/
    
    /** /기타 function **/
  }
};
</script>