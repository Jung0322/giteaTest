<!--
  목적 : 공정안전자료>공정시설정보
  Detail : 
  *
  examples:
  *
  -->
<template>
  <el-tabs type="border-card" v-model="tabIndex" @tab-click="tabClick">
    <el-tab-pane
      v-for="(item, i) in tabItems"
      :key="i"
      stretch
      class="default-tab-pane"
    >
      <span slot="label">
        <i class="el-icon-date"></i>
        {{ item.title }}
      </span>
    </el-tab-pane>
    <keep-alive>
      <component
        :is="component"
        v-if="component"
        :paneName="paneName"
        :tabIndex="tabIndex"
      />
    </keep-alive>
  </el-tabs>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'y-process-facility-info',
  components: {},
  props: {},
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니며, this.myProp는 정의되지 않습니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data: function () {
    return {
      // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
      //                즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
      tabItems: [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000960'),
          url: './powerMachine',
        }, // 동력기계
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002453'),
          url: './equipment',
        }, // 장치 및 설비
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002005'),
          url: './heatExchange',
        }, // 열교환기
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001130'),
          url: './pipe',
        }, // 배관 및 개스킷
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001855'),
          url: './safetyValve',
        }, // 안전밸브 및 파열판
      ],
      component: null,
      tabIndex: 0,
      paneName: '',
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.loadComponent();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      this.component = () => import(`${path}`);
    },
    /**
     * 자식 페이지에 넘길 paneName 정보 업데이트
     * tab 클릭시 마다
     * tab : 클릭한 tab 정보
     */
    tabClick(tab) {
      var nowDate = new Date();
      this.paneName = tab.paneName + nowDate.getMilliseconds();
    },
  },
};
</script>
