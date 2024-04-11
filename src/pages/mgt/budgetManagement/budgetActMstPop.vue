<!--
  목적 : 경영>SHE예산 관리>예산집행 관리>상세 팝업>예산계정 검색 팝업
  Detail : 예산계정 검색 팝업화면
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
    <b-row>
      <b-col sm="12" class="h100p">
        <!-- 예산편성관리 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005002')"
          :useExcelExport="false"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="popupParam.multiple"
          @cellClick="cellClickHandler"
          @cellDoubleClick="cellDoubleClickHandler"
          @btnSelectBudget="btnSelect"
          @btnSearch="btnSearchClicked"
          @closePopup="closePopup"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'budget-act-mst-pop',
  props: {
    popupParam: {
      type: Object,
      default: {
        year: null, // 년도
        deptCd: null, // 대상부서코드
        plantCd: null, // 사업장코드
        budgetTypeCd: null, // 예산분류
        budgetClsCd: null, // 예산구분
      },
    },
  },
  data() {
    return {
      searchParam: {
        year: null, // 년도
        plantCd: null, // 사업장
        deptCd: null, // 대상부서
        pdeptCd: null, // 상위대상부서
        budgetTypeCd: null, // 예산분류
        budgetClsCd: null, // 예산구분
        budgetActNm: null, // 예산계정
      },
      gridOptions: {
        header: [],
        data: [],
        height: '300',
        btns: [],
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
      YAuiGrid: null,
      selectedRow: null,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.setGridHeader();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
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

        // 대상부서의 트리 탐색
        let deptTree = this.$comm.searchDept(this.searchParam.deptCd);
        if (deptTree) {
          // 부서트리가 있을 경우 상위부서코드를 할당
          this.searchParam.pdeptCd = deptTree.pdeptCd;
        }
      }

      // 예산분류
      if (this.popupParam.budgetTypeCd) {
        this.searchParam.budgetTypeCd = this.popupParam.budgetTypeCd;
      }

      // 예산구분
      if (this.popupParam.budgetClsCd) {
        this.searchParam.budgetClsCd = this.popupParam.budgetClsCd;
      }

      this.getList();
    },
    setGridHeader() {
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000829'),
          dataField: 'year',
          width: '17%',
        }, // 년도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '17%',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'),
          dataField: 'deptNm',
          width: '17%',
        }, // 대상부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005001'),
          dataField: 'budgetTypeNm',
          width: '17%',
        }, // 예산분류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005004'),
          dataField: 'budgetClsNm',
          width: '17%',
        }, // 예산계정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005036'),
          dataField: 'orgAmt',
          width: '17%',
        }, // 편성금액
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, //  검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnSelectBudget',
        }, //  선택
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        }, //  닫기
      ];
    },

    // 예산편성 목록 그리드
    getList() {
      this.$http.url =
        selectConfig.mgt.budgetManagement.budgetExec.budgetActMstList.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR');
        }
      );
    },
    tableCellClassName({ row, column, rowIndex, colIndex }) {
      if (column.property === 'orgAmt' && row['orgAmt'] !== null) {
        row['orgAmt'] = row['orgAmt']
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return null;
      }
    },
    cellDoubleClickHandler(event) {
      this.$emit('closePopup', { success: true, budgetAct: event.item });
    },

    cellClickHandler(event) {
      this.selectedRow = event.item;
    },
    btnSelect() {
      if (!this.selectedRow) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'L0000005109', // 예산계정을 선택해주세요.
          type: 'warning',
        });
        return;
      }

      this.$emit('closePopup', { success: true, budgetAct: this.selectedRow });
    },

    closePopup() {
      this.$emit('closePopup', { success: true });
    },
    btnSearchClicked() {
      this.getList();
    },
    /** Button Event **/
    /** /Button Event **/
  },
};
</script>
