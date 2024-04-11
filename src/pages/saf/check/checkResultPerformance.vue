<!--
  목적 : 안전점검실적 통계
  Detail :
  examples:
  -->
<template>
  <el-tabs type="border-card" v-model="tabIndex" @tab-click="tabClick">
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
        :paneName="paneName"
        :tabIndex="tabIndex"
      />
    </keep-alive>
  </el-tabs>

  <!-- 검색 결과 테이블 -->
  <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1">
            <y-btn title="검색" color="green" @btnClicked="btnSearchClicked" />
          </div>
          <y-data-table
            label="작업환경측정결과 통계 목록"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :useRownum="false"
            :span-options="gridOptions.merge"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'work-measure-result-statistics',
  props: {},
  data: function () {
    return {
      component: null,
      tabIndex: 0,
      tabItems: [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004864'),
          url: './checkResultPerformanceEstablishment',
        }, // 사업장별
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004865'),
          url: './checkResultPerformanceDetail',
        }, // 통계 그래프
      ],
      paneName: '',
      defaultHeaders: [],
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.loadComponent();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    loadComponent() {
      var path = this.tabItems[this.$_.parseInt(this.tabIndex)].url;
      this.component = () => import(`${path}`);
    },
    /**
     * 자식 페이지에 넘길 paneName 정보 업데이트
     * tab 클릭시 마다
     * tab : 클릭한 tab 정보
     */
    tabClick(tab) {
      var nowDate = new Date();
      this.paneName = tab.paneName + nowDate.getMilliseconds();
    },
  },
};
</script>
