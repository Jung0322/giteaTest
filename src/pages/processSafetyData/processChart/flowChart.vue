<!--
  목적 : 공정흐름도(PFD)
  Detail : 공정흐름도(PFD) 목록 화면
  *
  examples:
  *
  -->
<template>
  <el-tabs type="border-card" v-model="tabIndex">
    <!--  <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
      <span slot="label">
        <i class="el-icon-date"></i>
        {{ item.title }}
      </span>
    </el-tab-pane> -->
    <keep-alive>
      <component
        :is="component"
        v-if="component"
        :attachFileGrp.sync="attachFileGrp"
        :tap="tap"
        :tabIndex="tabIndex"
      />
    </keep-alive>
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
        taskClassNm: 'FLOW_CHART',
        taskKey: '',
        diagClassCd: 'FLCHA',
        taskFlag: 'SAF',
        label: 'L0000000550', // 공정흐름도
      },
      tabItems: [],
      tabIndex: 0,
      component: null,
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
          title: this.$comm.getLangSpecInfoLabel('L0000000550'),
          url: 'diagramFile',
        },
      ]; // 공정흐름도
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      this.tap = this.attachFileGrp.diagClassCd;

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
