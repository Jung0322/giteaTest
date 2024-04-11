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
            :editable="apprMode"
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
          :editable="true"
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
          @cellEditEnd="cellEditEndHandler"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'resultmgnt-item-result',
  props: {
    disabled: false,
    assmnSfhlcResultInfo: {
      type: Object,
      default: {
        evalPlanVendorNo: 0,
        evalSumPnt: 0, // 평점
        evalAllPnt: 0, // 총점
        assmnSfhlcItemList: [],
        plantCd: '',
      },
    },
    deptListLoad: false,
    apprMode: false,
  },
  data() {
    return {
      gridOptions: {
        name: 'resultmgmtItemResult',
        header: [],
        data: [],
        height: 210,
      },
      YAuiGrid: null,
      editable: false,
      searchUrl: '',
    };
  },
  watch: {
    'assmnSfhlcResultInfo.assmnSfhlcItemList'() {
      this.gridOptions.data = this.assmnSfhlcResultInfo.assmnSfhlcItemList;
      this.YAuiGrid.setGridData(this.assmnSfhlcResultInfo.assmnSfhlcItemList);
    },
    deptListLoad() {
      this.assmnSfhlcResultInfo.assmnSfhlcItemList = this.gridOptions.data;
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        let evalSumPnt = 0;
        this.$_.forEach(this.gridOptions.data, (item) => {
          if (
            this.$_.parseInt(item.subconEvalItemPnt) <
            this.$_.parseInt(item.evalPnt)
          ) {
            item.evalPnt = 0;
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000825', // 평점을 배점보다 높게 기입할 수 없습니다.
              type: 'warning',
            });

            return;
          } else {
            evalSumPnt += this.$_.parseInt(item.evalPnt);
          }
          if (!item.evalPnt) {
            item.evalPnt = 0;
          }
        });
        this.assmnSfhlcResultInfo.evalSumPnt = evalSumPnt;
        this.assmnSfhlcResultInfo.subconEvalItemResults = this.gridOptions.data;
      },
      deep: true,
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅

      this.editable = this.$route.meta.editable;
      setTimeout(() => {
        this.setGridHeader().then(() => {
          this.YAuiGrid.setGridData(
            this.assmnSfhlcResultInfo.assmnSfhlcItemList
          );
        });
      }, 500);

      // 협력업체 평가 항목 grid 헤더 설정
    },
    setGridHeader() {
      return new Promise((resolve) => {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003099'),
            dataField: 'subconEvalItemNm',
            width: '15%',
            editable: false,
            style: 'left-align',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003063'),
            dataField: 'subconEvalItemStnd',
            width: '15%',
            editable: false,
            style: 'left-align',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005752'),
            dataField: 'subconEvalItemPnt',
            width: '10%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005753'),
            dataField: 'evalPnt',
            width: '15%',
            dataType: 'numeric',
            editable: this.apprMode,
            style: 'center-align',
            editRenderer: {
              type: 'InputEditRenderer',
              onlyNumeric: true,
              autoThousandSeparator: true,
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'remarks',
            editable: this.apprMode,
            width: '45%',
          },
        ];
        resolve();
      });
    },
    cellEditEndHandler(event) {
      if (
        this.$_.parseInt(event.item.subconEvalItemPnt) <
        this.$_.parseInt(event.item.evalPnt)
      ) {
        event.item.evalPnt = 0;
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000825', // 평점을 배점보다 높게 기입할 수 없습니다.
          type: 'warning',
        });
        this.YAuiGrid.setGridData(this.assmnSfhlcResultInfo.assmnSfhlcItemList);
        return;
      } else {
        this.assmnSfhlcResultInfo.assmnSfhlcItemList =
          this.YAuiGrid.getGridData();
      }
    },
    // 평점별 등급
    gradePnt(sumVal, allVal) {
      var sumGradePer = (sumVal / allVal) * 100;
      if (sumGradePer >= 90) {
        return '우수';
      } else if (sumGradePer >= 75) {
        return '양호';
      } else if (sumGradePer >= 55) {
        return '미흡';
      } else {
        return '부적격';
      }
    },
  },
};
</script>
