<!--
  목적 : 결제진행 상태 팝업
  Detail : 결제진행 상태 팝업
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000452')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @closeConstPopup="closePopup('CLOSE')"
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
          apprRqstNo: '', // 결재번호
        };
      },
    },
  },
  data() {
    return {
      YAuiGrid: null, // 
      gridOptions: {
        header: [],
        data: [],
        height: '250',
        merge: [],
      },
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

    if (this.popupParam.apprRqstNo && this.popupParam.apprRqstNo > 0) {
      this.getList();
    } else {
      this.YAuiGrid.clearGridData();
    }
  },
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = selectConfig.manage.appr.getApprProgress.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000439'), 
          dataField: 'apprRqstNm', 
          width: '20%',
          style: 'left-align',
          cellMerge: true,
        },  // 결재요청명
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), 
          dataField: 'apprTypeNm', 
          width: '7%', 
        }, // 구분
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), 
          dataField: 'deptNm', 
          width: '13%', 
        }, // 부서
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002772'), 
          dataField: 'positionNm', 
          width: '8%', 
        }, // 직책
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001472'), 
          dataField: 'userNm', 
          width: '13%', 
        }, // 사용자명
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001538'), 
          dataField: 'apprStepNm', 
          width: '7%', 
        }, // 상태
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002268'), 
          dataField: 'apprDt', 
          width: '8%', 
        }, // 일시
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002206'), 
          dataField: 'apprRemark', 
          width: '24%', 
        }, // 의견
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closeConstPopup',
        },
      ];
    },
    getList() {
      this.$http.url = this.$format(this.searchUrl, this.popupParam.apprRqstNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
  },
};
</script>
