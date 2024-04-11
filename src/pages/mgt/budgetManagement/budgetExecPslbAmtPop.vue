<!--
  목적 : 경영>SHE예산 관리>예산집행 관리>상세 팝업>집행가능 금액(원) 상세 팝업
  Detail : 집행가능 금액(원) 팝업화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            label="L0000000767"
            type="year"
            name="year"
            :default="searchParam.year"
            v-model="searchParam.year"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 사업장 -->
          <y-plant
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 대상부서 -->
          <y-tree-dept
            :width="8"
            label="L0000000927"
            type="search"
            :deptSubYn="searchParam.deptSubYn"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
            @setDeptSubYn="
              (val) => {
                searchParam.deptSubYn = val;
              }
            "
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 예산분류 -->
          <y-select
            :width="8"
            :comboItems="budgetTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="budgetTypeCd"
            label="L0000005001"
            v-model="searchParam.budgetTypeCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 예산구분 -->
          <y-select
            :width="8"
            :comboItems="budgetClsItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="budgetClsCd"
            label="L0000005004"
            v-model="searchParam.budgetClsCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 예산계정 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000005003"
            name="budgetActNm"
            v-model="searchParam.budgetActNm"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 검색 -->
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
            <!-- 닫기 -->
            <y-btn title="L0000000881" @btnClicked="closePopup" />
          </div>
          <!-- 예산집행현황 -->
          <y-data-table
            label="L0000005116"
            ref="dataTable"
            :spanOptions="gridOptions.merge"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
          />
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'budget-exec-pslb-amt-pop',
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
        merge: [],
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

      this.searchParam.year = this.$comm.getThisYear();

      // 예산분류 (예산계정 관리 기준정보)
      this.$comm.getComboItems('MICS3', true).then((_result) => {
        this.budgetTypeItems = this.$_.clone(_result);
      });

      // 예산구분 (MGT_BDT_CLS)
      this.$comm.getComboItems('MGT_BDT_CLS', true).then((_result) => {
        this.budgetClsItems = this.$_.clone(_result);
      });

      this.gridOptions.merge = [
        { index: 1, field: 'year' }, // 년도 기준
        { index: 2, field: 'plantNm' }, // 사업장 기준
      ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { text: 'L0000000829', name: 'year', width: '100px', align: 'center' }, // 년도
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
          url: true,
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
          text: 'L0000005036',
          name: 'orgAmtT',
          width: '150px',
          align: 'right',
        }, // 편성금액(원)
        {
          text: 'L0000005100',
          name: 'execAmtT',
          width: '150px',
          align: 'right',
          url: true,
          disabledFn: this.disabledFn,
        }, // 집행 금액(원)
        {
          text: 'L0000005101',
          name: 'execPslbAmtT',
          width: '150px',
          align: 'right',
        }, // 집행가능 금액(원)
      ];

      // 년도
      if (this.popupParam.year) {
        this.searchParam.year = this.popupParam.year;
      }

      // 사업장
      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.popupParam.plantCd;
      }

      // 대상부서
      if (this.popupParam.deptCd) {
        this.searchParam.deptCd = this.popupParam.deptCd;
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
    // 링크 제외 처리 함수
    disabledFn(header, row, index) {
      if (row.budgetActNm === '합계') {
        return false;
      }

      return true;
    },
    // 예산편성 목록 그리드
    getList() {
      this.$http.url =
        selectConfig.mgt.budgetManagement.status.budgetActDeptItem.url;
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
    tableLinkClicked(header, data) {
      if (header.name === 'deptNm') {
        // 대상부서 링크 클릭시
        this.openDeptPopup(data);
      } else {
        // 집행 금액(원) 링크 클릭시
        this.openExecAmtPopup(data);
      }
    },
    openDeptPopup(data) {
      let param = data;
      param.readonly = true;
      this.popupOptions.target = () =>
        import(`${'./budgetingDeptActMstDetail'}`);
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005069'; // 대상부서별 예산계정상세
      this.popupOptions.param = param;
      this.popupOptions.closeCallback = this.closeDeptPopup;
    },
    closeDeptPopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    openExecAmtPopup(data) {
      this.popupOptions.target = () => import(`${'./budgetExecutionPop'}`);
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005069'; // 예산집행 관리 검색
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closeExecAmtPopup;
    },
    closeExecAmtPopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /** Button Event **/
    /** /Button Event **/
  },
};
</script>
