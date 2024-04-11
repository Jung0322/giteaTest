<!--
  목적 : 안전 > 협력업체 평가 결과 > 상세 > 평가항목
  작성자 : kdh
  Detail : 협력업체 평가 결과 항목 관리 목록/등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
           협력업체 평가 항목 목록 
          <y-data-table
            :messageCheck="true"
            message="M0000000826"
            label="L0000003261"
            ref="dataTable"
            :editable="!disabled && editable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :popMode="true"
          ></y-data-table>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003261')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'planmgmtItem-result',
  props: {
    disabled: false,
    assmnSfhlcInfo: {
      type: Object,
      default: {
        vendorEvalPlanNo: 0,
        subconEvalClsCd: null, // 평가구분코드
        subconEvalAttCd: null, // 평가유형코드
        evalSumPnt: 0, // 평점
        evalAllPnt: 0, // 총점
        evalGrade: '-',
        assmnSfhlcItemList: [],
        plantCd: '',
      },
    },
    deptListLoad: false,
  },
  data() {
    return {
      gridOptions: {
        name: 'planmgmtItemResult',
        header: [],
        data: [],
        height: 350,
      },
      YAuiGrid: null,
      editable: false,
      searchUrl: '',
    };
  },
  watch: {
    'assmnSfhlcInfo.assmnSfhlcItemList'() {
      this.gridOptions.data = this.assmnSfhlcInfo.assmnSfhlcItemList;
      this.YAuiGrid.setGridData(this.assmnSfhlcInfo.assmnSfhlcItemList);
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅

      this.editable = this.$route.meta.editable;

      // 협력업체 평가 항목 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003099'),
          dataField: 'subconEvalItemNm',
          width: '40%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003063'),
          dataField: 'subconEvalItemStnd',
          width: '40%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001137'),
          dataField: 'subconEvalItemPnt',
          width: '20%',
        },
      ];
    },
    resizeGrid() {
      let _height = window.innerHeight - 600;
      let _width = window.innerWidth - 455;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(_width, _height);
    },
  },
};
</script>
