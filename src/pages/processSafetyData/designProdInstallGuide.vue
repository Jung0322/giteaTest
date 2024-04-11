<!--
  목적 : 안전설계 제작 및 설치관련 지침서
  Detail : 안전설계 제작 및 설치관련 지침서 목록 화면
  *
  examples:
  *
  -->
<template>
  <el-tabs type="border-card" v-model="tabIndex">
    <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch>
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
        taskClassNm: 'DESIGN_PROD_INSTALL_GUIDE',
        taskKey: 0,
        docuKindCd: 'DEPIG',
        taskFlag: 'SAF',
        refTableId: '',
        label: 'L0000001861', // 안전설계 제작 및 설치관련 지침서 문서
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
          title: this.$comm.getLangSpecInfoLabel('L0000001860'),
          url: 'safFileUploadPage',
        }, // 안전설계 제작 및 설치관련 지침서
      ];

      this.tap = this.attachFileGrp.docuKindCd;
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'safFileUploadPage') {
        this.component = () =>
          import('@/pages/common/attachFile/safAttachFile');
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
