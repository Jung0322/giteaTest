<!--
  목적 : (반드시 기입하세요) 컴포넌트
  작성자 : (이니셜로 반드시 입력하세요)
  비고 :
  -->
<template>
  <el-color-picker
    v-model="color"
    class="theme-picker"
    :size="size"
  />
</template>


<script>

export default {
  /** attributes: name, components, props, data **/
  name: 'y-color-picker',
  props: {
    size: {
      type: String,
      default: 'mini'
    }
  },
  data() {
    return {
      color: '#bdbdbd'
    };
  },
  watch: {
    color(_val) {
      return this.$emit('colorChanged', this.color);
    }
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
  },
  beforeDestory() {
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
    }
    /** functions **/
    /** events **/
  }
};
</script>
