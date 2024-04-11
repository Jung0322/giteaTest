<template>
  <el-tabs type="border-card" v-model="tabIndex">
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
      <keep-alive>
        <component :is="component" v-if="component" :tabIndex="tabIndex" />
      </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'emissions-tab-collection',
  props: {},
  data() {
    return {
      tabItems: [],
      tabIndex: 0,
      component: null,
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
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.tabItems = [
        { title: 'L0000001156', url: 'emissions' }, // 배출량/에너지사용량
        { title: 'L0000001734', url: 'emissionsParam' }, // 시뮬레이션
        // { title: '에너지사용량', url: 'engConsumption' },
        // { title: '에너지사용량 시뮬레이션', url: 'engConsumptionParam' },
      ];
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'emissions') {
        this.component = () => import('@/pages/env/gas/emissions/emissions');
      } else if (path === 'emissionsParam') {
        this.component = () =>
          import('@/pages/env/gas/emissions/emissionsParam');
      } else if (path === 'engConsumption') {
        this.component = () =>
          import('@/pages/env/gas/emissions/engConsumption');
      } else if (path === 'engConsumptionParam') {
        this.component = () =>
          import('@/pages/env/gas/emissions/engConsumptionParam');
      }
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
    /**
     * 사용자의 입력을 받는다.
     */
  },
};
</script>

<style></style>
