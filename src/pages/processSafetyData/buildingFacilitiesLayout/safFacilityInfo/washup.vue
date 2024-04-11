<!--
  목적 : 세척ㆍ세안 시설 및 안전 보호장구 설치계획 
  Detail : 세척ㆍ세안 시설 및 안전 보호장구 설치계획 화면
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
          title: this.$comm.getLangSpecInfoLabel('L0000001647'),
          url: './washupTab',
        }, // 세척·세안 시설 및 안전 보호장구 설치계획
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001655'),
          url: 'diagramFile',
        }, // 세척·세안 시설 및 안전 보호장구 설치계획도
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002843'),
          url: 'safFileUploadPage',
        }, // 첨부파일
      ];
    },
    setAttachFile() {
      if (this.tabIndex === '1') {
        this.attachFileGrp = {
          taskClassNm: 'WASHUP',
          taskKey: '0',
          diagClassCd: 'WASHU',
          taskFlag: 'SAF',
          plantCd: 'PLT01',
          label: 'L0000001655', // 세척·세안 시설 및 안전 보호장구 설치계획도
        };

        this.tap = this.attachFileGrp.diagClassCd;
      } else {
        this.attachFileGrp = {
          taskClassNm: 'WASHUP_ATTACH',
          taskKey: 0,
          docuKindCd: 'WASHU',
          taskFlag: 'SAF',
          refTableId: '',
          label: 'L0000004043', // 세척ㆍ세안 시설 및 안전 보호장구 설치계획 문서
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
