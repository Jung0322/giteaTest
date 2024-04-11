<!--
  목적 : 대기 운영일지-방지시설 보수내역
  작성자 : PSB
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 방지시설 보수내역 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :label="this.$comm.getLangSpecInfoLabel('L0000001112')"
          :editable="!this.disabled"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="false"
          @cellEditEnd="cellEditEndHandler"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'prevent-fac-maint-hist',
  props: {
    selectedMeasureYmd: '',
    selectedDeptCd: '',
  },
  data() {
    return {
      gridOptions: {
        name: 'preventFacMaintHist',
        header: [],
        data: [],
        btns: [],
        height: '300',
      },
      activeName: 'preventFacMainHist',
      YAuiGrid: null,
    };
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestory() {},
  methods: {
    init() {
      this.gridOptions.header = [
        // 방지시설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001117'),
          dataField: 'eairPreventFacNm',
          width: '20%',
          style: 'center-align',
          editable: false,
        },
        // 배출구
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001142'),
          dataField: 'eairOutletNm',
          width: '20%',
          style: 'center-align',
          editable: false,
        },
        // 보수기간
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001250'),
          dataField: 'maintYmd',
          width: '20%',
          style: 'center-align',
          editable: false,
        },
        // 보수자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001255'),
          dataField: 'worker',
          width: '20%',
          style: 'center-align',
          editable: false,
        },
        // 보수명세
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001251'),
          dataField: 'remark',
          width: '20%',
          style: 'left-align',
          sortable: false,
        },
      ];

      if (this.selectedMeasureYmd && this.selectedDeptCd) {
        this.getList();
      }
    },

    getList() {
      this.$http.url = this.$format(
        selectConfig.env.air.opLog.preventmainthist.url,
        this.selectedDeptCd,
        this.selectedMeasureYmd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>

<style>
/**
  * 2022.04.01 LHJ
  * 대기 운영일지 항목 collapse 처리시 background color 기존과 동일하게 처리
  */

.oplog-collapse > div[role='tab'] > .el-collapse-item__header {
  background: rgb(241, 241, 241) !important;
}

.oplog-collapse > .el-collapse-item__wrap {
  background: rgb(241, 241, 241);
}

.oplog-collapse > .el-collapse-item__wrap > .el-collapse-item__content {
  padding-bottom: 0px;
}
</style>
