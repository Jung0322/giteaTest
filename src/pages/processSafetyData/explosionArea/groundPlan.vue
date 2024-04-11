<!--
  목적 : 접지계획
  Detail : 접지계획 목록 화면
  *
  examples:
  *
  -->
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
        <component
          :is="component"
          v-if="component"
          :attachFileGrp.sync="attachFileGrp"
          :tap="tap"
          :tabIndex="tabIndex"
        />
      </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'flow-chart',
  props: {},
  data() {
    return {
      attachFileGrp: {
        taskClassNm: 'GROUND_PLAN',
        taskKey: '0',
        diagClassCd: 'GPLAN',
        taskFlag: 'SAF',
        plantCd: 'PLT01',
        label: 'L0000002591', // 접지계획
      },
      tabItems: [],
      tabIndex: 0,
      component: null,
      comboDeptItems: [],
      processNoItems: [],
      tap: null,
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
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002591'),
          url: 'diagramFile',
        }, // 접지계획
      ];

      this.tap = this.attachFileGrp.diagClassCd;
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'diagramFile') {
        this.component = () => import('@/pages/common/diagram/diagramFile');
      } else this.component = () => import(`${path}`);
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
