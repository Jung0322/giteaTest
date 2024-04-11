<!--
  목적 : 환경 > 대기 > 시설관리 > 방지시설 > 상세
  작성자 : jkl
  Detail : 대기 방지시설 관리
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12" class="mt-1">
        <!-- 방지시설 상세 -->
        <y-label
          label="L0000001113"
          icon="user-edit"
          color-class="cutstom-title-color"
        />
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 닫기 -->
          <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
        </div>
      </b-col>
    </b-row>
    <el-tabs type="border-card" v-model="tabIndex">
      <el-tab-pane
        v-for="(item, i) in tabItems"
        :key="i"
        stretch
        class="default-tab-pane"
      >
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ $comm.getLangSpecInfoLabel(item.title) }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :selectedTabIndex="tabIndex"
          :selectedEairPreventFacNo="popupParam.eairPreventFacNo"
          :selectedPlantCd="popupParam.plantCd"
          :tabDisabled="popupParam.disabled"
        />
      </keep-alive>
    </el-tabs>
  </b-container>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'prevent-base-detail',
  components: {},
  props: {
    popupParam: {
      type: Object,
      default: {
        eairPreventFacNo: 0,
        plantCd: '',
        facilityCd: 0,
        disabled: false,
      },
    },
  },
  data: function () {
    return {
      tabItems: [
        { title: 'L0000000776', url: './prevention' }, // '기본정보'
        { title: 'L0000001225', url: './preventChgHist' }, // '변경관리정보'
        { title: 'L0000001249', url: './preventMaintHist' }, // '보수관리정보'
        { title: 'L0000003357', url: './activatedCarbonChange' }, // '활성탄교체'
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
    this.init();
  },
  beforeDestory() {},
  //* methods */
  methods: {
    init() {
      if (this.popupParam.facilityCd) {
        this.popupParam.eairPreventFacNo = this.popupParam.facilityCd;
      }
      this.loadComponent();
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      this.component = () => import(`${path}`);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
