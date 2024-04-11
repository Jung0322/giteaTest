<!--
  목적 : 대상부서 상태 팝업
  Detail : 대상부서 상태 팝업
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             닫기 
            <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
          </div>
           대상협력업체 목록 
          <y-data-table
            label="L0000005144"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :cellClassName="tableCellClassName"
          />
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005144')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @closePopup="closePopup('CLOSE')"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'appr-progress-popup',
  props: {
    popupParam: {
      type: Object,
      default() {
        return {
          vendorEvalPlanNo: 0,
          apprFlag: '',
          procStepCd: '',
        };
      },
    },
  },
  data() {
    return {
      editable: true,
      searchParam: {
        vendorEvalPlanNo: 0,
        apprFlag: '',
        procStepCd: '',
      },
      gridOptions: {
        name: 'planmgmtVendorListPopup',
        btns: [],
        header: [],
        data: [],
        height: '500',
        merge: [],
      },
      YAuiGrid: null,
      searchUrl: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam = this.popupParam;
      // Url Setting
      this.searchUrl = selectConfig.vendor.assmnSfhlc.vendorList.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005121'), 
          dataField: 'vendorNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004977'), 
          dataField: 'evalStartDt', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004978'), 
          dataField: 'evalEndDt', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005120'), 
          dataField: 'deptNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
          dataField: 'vendorDesc', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004979'), 
          dataField: 'evalFinishYn', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004980'), 
          dataField: 'evalFinishDt', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005125'), 
          dataField: 'averageCnt', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005124'), 
          dataField: 'ratingNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005123'), 
          dataField: 'cost', 
          width: '10%',           
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), 
          btnClicked: 'closePopup'
        },
      ]
      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data))
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableCellClassName({ row, column, rowIndex, colIndex }) {      
      if (column.property === 'cost' && row['cost'] !== null) {
        row['cost'] = row['cost'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return null;
      }
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
  },
};
</script>
