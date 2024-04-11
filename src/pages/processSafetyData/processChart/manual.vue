<!--
  목적 : 위험성평가 결과 상세
  Detail : 위험성평가 결과 상세 화면
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
    </el-tab-pane>
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
  name: 'manual',
  props: {},
  data() {
    return {
      attachFileGrp: {
        taskClassNm: 'PLANT_MENUAL',
        taskKey: '',
        docuKindCd: 'PLMUL',
        taskFlag: 'SAF',
        refTableId: '',
        label: 'L0000000538', // 공정설명서
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
          title: this.$comm.getLangSpecInfoLabel('L0000000538'),
          url: 'safFileUploadPage',
        }, // 공정설명서
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004027'),
          url: './interLock',
        }, // 인터락 작동조건 및 가동중지
      ];
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      this.tap = this.attachFileGrp.docuKindCd;

      if (path === 'safFileUploadPage') {
        this.component = () =>
          import('@/pages/common/attachFile/safAttachFile');
      } else this.component = () => import(`${path}`);
    },
  },
};
</script>
