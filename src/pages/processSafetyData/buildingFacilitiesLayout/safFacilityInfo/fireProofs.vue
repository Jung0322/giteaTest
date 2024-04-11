<!--
  목적 : 내화구조명세
  Detail : 내화구조 명세 목록 화면
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
  name: 'fire-proofs',
  props: {},
  data() {
    return {
      attachFileGrp: {
        taskClassNm: '',
        taskKey: '0',
        diagClassCd: '',
        taskFlag: '',
        plantCd: '',
        label: '',
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
          title: this.$comm.getLangSpecInfoLabel('L0000000814'),
          url: './fireProofsTab',
        }, // 내화구조 명세
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000821'),
          url: 'diagramFile',
        }, // 내화구조도
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002843'),
          url: 'safFileUploadPage',
        }, // 첨부파일
      ];
    },
    setAttachFile() {
      if (this.tabIndex === '1') {
        this.attachFileGrp = {
          taskClassNm: 'FIRE_PROOFS',
          taskKey: '0',
          diagClassCd: 'FIREP',
          taskFlag: 'SAF',
          plantCd: 'PLT01',
          label: 'L0000000821', // 내화구조도
        };

        this.tap = this.attachFileGrp.diagClassCd;
      } else {
        this.attachFileGrp = {
          taskClassNm: 'FIRE_PROOFS_ATTACH',
          taskKey: 0,
          docuKindCd: 'FIREP',
          taskFlag: 'SAF',
          refTableId: '',
          label: 'L0000000816', // 내화구조 명세서
        };

        this.tap = this.attachFileGrp.docuKindCd;
      }
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'diagramFile') {
        this.component = () => import('@/pages/common/diagram/diagramFile');
      } else if (path === 'safFileUploadPage') {
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
