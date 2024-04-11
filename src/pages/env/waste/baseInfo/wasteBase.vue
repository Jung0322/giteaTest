<!--
  목적 : 폐기물-폐기물관리
  작성자 : khk
  Detail : 폐기물 처리방법 및 분류, 폐기물관리
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <el-tabs type="border-card" v-model="tabIndex" ref="tab">
      <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ $comm.getLangSpecInfoLabel(item.title) }}
        </span>
      </el-tab-pane>
        <keep-alive>
          <component :is="component" v-if="component" :selectedTabIndex="tabIndex" />
        </keep-alive>
    </el-tabs>
  </b-container>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'waste-base',
  components: {},
  props: {},
  data: function() {
    return {
      tabItems: [
        { title: 'L0000003120', url: './wasteClass' }, // '폐기물분류'
        { title: 'L0000003124', url: './wasteDispoMtd' }, // '폐기물처리방법'
        { title: 'L0000003102', url: './waste' }, // '폐기물'
      ],
      component: null,
      tabIndex: 0,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.loadComponent();
  },
  beforeDestory() {},
  //* methods */
  methods: {
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      this.component = () => import(`${path}`);
    },
  },
};
</script>