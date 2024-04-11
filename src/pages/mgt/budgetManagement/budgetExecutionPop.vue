<!--
  목적 : 경영>SHE예산 관리>예산집행 관리>상세 팝업>집행가능 금액(원) 상세 팝업>예산집행 관리 목록 조회 팝업
  Detail : 예산집행 관리 목록 조회 팝업화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 닫기 -->
            <y-btn title="L0000000881" @btnClicked="closePopup" />
          </div>
          <!-- 예산집행관리 -->
          <y-data-table
            label="L0000005115"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
          />
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'budget-execution-pop',
  props: {
    popupParam: {
      type: Object,
      default: {
        year: null, // 년도
        plantCd: null, // 사업장코드
        budgetTypeCd: null, // 예산분류
        budgetClsCd: null, // 예산구분
        budgetActMstNo: null, // 예산계정
      },
    },
  },
  data() {
    return {
      searchParam: {
        year: null, // 년도
        plantCd: null, // 사업장
        budgetTypeCd: null, // 예산분류
        budgetClsCd: null, // 예산구분
        budgetActMstNo: null, // 예산계정
      },
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      budgetTypeItems: [], // 예산분류 selectbox 목록
      budgetClsItems: [], // 예산구분 selectbox 목록
      selectedValue: null, // 선택된 row item
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  /** methods **/
  methods: {
    init() {
      // 권한 셋팅
      this.editable = this.$route.meta.editable;

      this.searchParam.deptSubYn = 'Y';

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { text: 'L0000000829', name: 'year', width: '100px', align: 'center' }, // 년도
        {
          text: 'L0000005099',
          name: 'execDt',
          width: '120px',
          align: 'center',
        }, // 집행일자
        {
          text: 'L0000001415',
          name: 'plantNm',
          width: '120px',
          align: 'center',
        }, // 사업장
        {
          text: 'L0000000927',
          name: 'deptNm',
          width: '120px',
          align: 'center',
        }, // 대상부서
        {
          text: 'L0000005001',
          name: 'budgetTypeNm',
          width: '120px',
          align: 'center',
        }, // 예산분류
        {
          text: 'L0000005004',
          name: 'budgetClsNm',
          width: '120px',
          align: 'center',
        }, // 예산구분
        {
          text: 'L0000005003',
          name: 'budgetActNm',
          width: '150px',
          align: 'center',
        }, // 예산계정
        {
          text: 'L0000005100',
          name: 'execAmtT',
          width: '150px',
          align: 'right',
        }, // 집행 금액(원)
        {
          text: 'L0000004972' /* 단계(상태) */,
          name: 'stepNm',
          width: '100px',
          align: 'center',
        },
        {
          text: 'L0000002355' /* 작성자 */,
          name: 'writerNm',
          width: '100px',
          align: 'center',
        },
        {
          text: 'L0000002352' /* 작성일 */,
          name: 'writeDt',
          width: '100px',
          align: 'center',
        },
      ];

      // 년도
      if (this.popupParam.year) {
        this.searchParam.year = this.popupParam.year;
      }

      // 사업장
      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.popupParam.plantCd;
      }

      // 예산분류
      if (this.popupParam.budgetTypeCd) {
        this.searchParam.budgetTypeCd = this.popupParam.budgetTypeCd;
      }

      // 예산구분
      if (this.popupParam.budgetClsCd) {
        this.searchParam.budgetClsCd = this.popupParam.budgetClsCd;
      }

      // 예산구분
      if (this.popupParam.budgetActMstNo) {
        this.searchParam.budgetActMstNo = this.popupParam.budgetActMstNo;
      }

      this.getList();
    },
    // 예산편성 목록 그리드
    getList() {
      this.$http.url = selectConfig.mgt.budgetManagement.budgetExec.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR');
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
    /** Button Event **/
    /** /Button Event **/
  },
};
</script>
