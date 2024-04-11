<!--
  목적 : 배치도면 조회
  Detail : 배치도면 목록 화면
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
    <!-- <keep-alive> -->
    <component
      :is="component"
      v-if="component"
      :attachFileGrp.sync="attachFileGrp"
      :tap="tap"
      :tabIndex="tabIndex"
    />
    <!-- </keep-alive> -->
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
        taskClassNm: 'PIPING_ISTRU',
        taskKey: '0',
        diagClassCd: 'PIPIS',
        taskFlag: 'SAF',
        plantCd: 'PLT01',
        label: 'L0000000522', // 공정 배관ㆍ계장도
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
      this.setAttachFile();
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
          title: this.$comm.getLangSpecInfoLabel('L0000000304'),
          url: 'diagramFile',
        }, // 건물 설비 전체 배치 도면
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001582'),
          url: 'diagramFile',
        }, // 설비 배치 도면
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000301'),
          url: 'diagramFile',
        }, // 건물 및 철구조물의 평면도 및 입면도
      ];
    },
    setAttachFile() {
      if (this.tabIndex === '0') {
        this.attachFileGrp = {
          taskClassNm: 'BUILDING_LAYOUT',
          taskKey: '0',
          diagClassCd: 'BFAAD',
          taskFlag: 'SAF',
          plantCd: 'PLT01',
          label: 'L0000000305', // 건물 설비 전체 배치도
        };
      } else if (this.tabIndex === '1') {
        this.attachFileGrp = {
          taskClassNm: 'FACILITY_LAYOUT',
          taskKey: '0',
          diagClassCd: 'FAARD',
          taskFlag: 'SAF',
          plantCd: 'PLT01',
          label: 'L0000001584', // 설비 배치도
        };
      } else {
        this.attachFileGrp = {
          taskClassNm: 'BUILDING_CONSTRUCTION',
          taskKey: '0',
          diagClassCd: 'FAIRD',
          taskFlag: 'SAF',
          plantCd: 'PLT01',
          label: 'L0000000301', // 건물 및 철구조물의 평면도 및 입면도
        };
      }

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
