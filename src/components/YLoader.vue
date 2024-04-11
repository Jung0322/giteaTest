<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  Detail :
  *
  examples:
  *
  -->
<template>
  <div 
    v-if="isLoading"
    class="mb-4">
    <div class="align-items-center text-info" role="status">
      <span>Loading...</span>
      <div class="spinner-grow spinner-grow-sm ml-auto" 
        role="status" 
        aria-hidden="true">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  /** attributes: name, components, props, data **/
  name: 'y-loader',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data () {
    return {
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  },
  beforeDestory () {
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init () {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
    },
    /** /초기화 관련 함수 **/
    
    /** Component Events, Callbacks (버튼 제외) **/
    
    /** /Component, Callbacks (버튼 제외) **/
        
    /** 기타 function **/
    
    /** /기타 function **/
  }
};
</script>