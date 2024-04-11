<template>
  <el-tabs type="border-card" v-model="tabIndex">
    <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
      <span slot="label">
        <i class="el-icon-date"></i>
        {{ item.title }}
      </span>
    </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :tabIndex="tabIndex"
        />
      </keep-alive>
  </el-tabs>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'ghg-data-master',
  props: {},
  data() {
    return {
      tabItems: [],
      tabIndex: 0,
      component: null,
      comboDeptItems: [],
      processNoItems: [],
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
        { title: this.$comm.getLangSpecInfoLabel('L0000001186'), url: 'dischargeActMasterChange' }, // 배출활동
        { title: this.$comm.getLangSpecInfoLabel('L0000004479'), url: 'dischargeFacMaster' }, // 온실가스 배출시설분류
        { title: this.$comm.getLangSpecInfoLabel('L0000002032'), url: 'gasTypeMaster' }, // 온실가스
        { title: this.$comm.getLangSpecInfoLabel('L0000001503'), url: 'gasUnitMaster' }, // 산정기준단위
        { title: this.$comm.getLangSpecInfoLabel('L0000003345'), url: 'actDataMaster' }, // 활동자료
      ];
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'dischargeActMasterChange') {
        this.component = () =>
          import('@/pages/env/gas/baseInfo/dischargeActMasterChange');
      } else if (path === 'dischargeFacMaster') {
        this.component = () =>
          import('@/pages/env/gas/baseInfo/dischargeFacMaster');
      } else if (path === 'gasTypeMaster') {
        this.component = () =>
          import('@/pages/env/gas/baseInfo/gasTypeMaster');
      } else if (path === 'gasUnitMaster') {
        this.component = () =>
          import('@/pages/env/gas/baseInfo/gasUnitMaster');
      } else if (path === 'actDataMaster') {
        this.component = () =>
          import('@/pages/env/gas/baseInfo/actDataMaster');
      }
    },
  },
};
</script>