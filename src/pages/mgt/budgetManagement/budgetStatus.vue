<!--
  목적 : 경영>SHE예산 관리>예산 편성및집행 현황
  Detail : 예산 편성및집행 현황 조회화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box
      :gridOptions="gridOptions"
      @enter="getList"
      v-if="!this.popupParam.popupMode"
    >
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
          <y-select
            :width="8"
            :comboItems="budgetActItems"
            itemText="budgetActNm"
            itemValue="budgetActMstNo"
            ui="bootstrap"
            name="budgetActMstNo"
            label="L0000005003"
            v-model="searchParam.budgetActMstNo"
          />
          <!-- <y-text
            :width="8"
            ui="bootstrap"
            label="L0000005003"
            name="budgetActNm"
            v-model="searchParam.budgetActNm"
          /> -->
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
           검색
            <y-btn
              v-if="!this.popupParam.popupMode"
              title="L0000000327"
              color="green"
              @btnClicked="getList"
            />
          </div>
           예산 편성및집행 현황 
          <y-data-table
            :key="gridKey"
            label="L0000005117"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            :rowClassName="tableRowClassName"
            @tableLinkClicked="tableLinkClicked"
            :customSpanOption="customSpanOption"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005117')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
          @getList="getList"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'budget-execution',
  props: {
    popupParam: {
      type: Object,
      default: () => {
        return {
          plantCd: null,
          budgetClsCd: null,
          year: '',
          popupMode: false,
        };
      },
    },
  },
  data() {
    return {
      searchParam: {
        year: null, // 기간
        plantCd: null, // 사업장
        budgetTypeCd: null, // 예산분류
        budgetClsCd: null, // 예산구분
        budgetActNm: null, // 예산계정
      },
      gridOptions: {
        name: 'budgetStatus',
        header: [],
        btns: [],
        data: [],
        height: 'auto',
      },
      YAuigrid: null,
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
      budgetActItems: [], // 예산계정 selectbox 목록
      budgetActMstItems: [], // 전체 예산계정 목록
      gridKey: false,
    };
  },
  watch: {
    'searchParam.budgetTypeCd': {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.budgetActItems = this.$_.cloneDeep(
            this.budgetActMstItems
          ).filter((item) => item.budgetTypeCd === newVal);

          this.budgetActItems.splice(0, 0, {
            budgetActMstNo: null,
            budgetActNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
        } else {
          this.budgetActItems = this.$_.cloneDeep(this.budgetActMstItems);
        }
      },
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
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.editable = this.$route.meta.editable;
      // 예산분류 (예산계정 관리 기준정보)
      this.getComboItems('budgetType');

      this.searchParam.year = this.$comm.getThisYear();

      // 예산구분 (MGT_BDT_CLS)
      this.$comm.getComboItems('MGT_BDT_CLS', true).then((_result) => {
        this.budgetClsItems = this.$_.clone(_result);
      });
      if (this.popupParam.popupMode) {
        this.searchParam.budgetClsCd = this.popupParam.budgetClsCd;
        this.searchParam.year = this.popupParam.year;
        this.searchParam.plantCd = this.popupParam.plantCd;
      }
      // 예산계정 (예산계정 관리 기준정보)
      this.getComboItems('budgetAct');

      let childHeader = [];

      for (let i = 0; i < 12; i++) {
        let header = {
          headerText: this.$comm.getLangSpecInfoLabel(
            'L00000000' + String(42 + i)
          ),
          dataField: 'month' + String(i + 1),
          width: '100',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
          // align: 'right',
          // url: true,
          // disabledFn: this.disabledFn,
        }; // i월

        childHeader.push(header);
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000829'),
          dataField: 'year',
          width: '110',
          cellColSpan: 6,
          colSpan: 3,
          cellMerge: true,
          cellColMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '110',
          cellColSpan: 6,
          cellMerge: true,
          cellColMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005001'),
          dataField: 'budgetTypeNm',
          width: '110',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005004'),
          dataField: 'budgetClsNm',
          width: '110',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005003'),
          dataField: 'budgetActNm',
          width: '110',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005036'),
          dataField: 'orgAmtT',
          width: '110',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005100'),
          dataField: 'execAmtT',
          width: '110',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005118'),
          dataField: 'execRate',
          width: '110',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005119'),
          dataField: 'monthExecRate',
          width: '110',
          children: childHeader,
        },
        // {
        //   text: 'L0000005036',
        //   name: 'orgAmtT',
        //   width: '150px',
        //   align: 'right',
        //   url: true,
        //   disabledFn: this.disabledFn,
        // }, // 편성금액(원)
        // {
        //   text: 'L0000005100',
        //   name: 'execAmtT',
        //   width: '150px',
        //   align: 'right',
        //   url: true,
        //   disabledFn: this.disabledFn,
        // }, // 집행 금액(원)
        // {
        //   text: 'L0000005119',
        //   name: 'monthExecRate',
        //   width: '100px',
        //   align: 'center',
        //   child: childHeader,
        // }, // 월별 집행 금액(원)
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();

      if (
        typeof searchParamByCookie !== 'undefined' &&
        !this.popupParam.popupMode
      ) {
        this.searchParam = searchParamByCookie;
      }
      this.getList();
    },
    getComboItems(flag) {
      let url =
        flag === 'budgetType'
          ? selectConfig.mgt.budgetAct.list.url
          : selectConfig.mgt.budgetAct.budgetActMsts.url;

      if (flag === 'budgetType') {
        this.$http.param = {
          useYn: 'Y',
        };
      }

      this.$http.url = url;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data) {
            if (flag === 'budgetType') {
              this.$comm.getComboItems('MICS3', true).then((_result) => {
                this.budgetTypeItems = this.$_.clone(_result);
              });
            } else {
              this.budgetActItems = this.$_.clone(_result.data);

              this.budgetActItems.splice(0, 0, {
                budgetActMstNo: null,
                budgetActNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
              });

              this.budgetActMstItems = this.$_.cloneDeep(this.budgetActItems);
            }
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR');
        }
      );
    },
    // 예산편성 목록 그리드
    getList() {
      this.$http.url = selectConfig.mgt.budgetManagement.status.budgetExec.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));

          let nowDate = new Date();
          this.gridKey = nowDate.getMilliseconds();
          // 단계(상태) rowspan 기준 정보 추가
          if (!this.popupParam.popupMode) {
            this.$comm.pushCookie(this.searchParam);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR');
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 345;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    cellClickHandler(event) {
      if (event.item === null || event.item === undefined) return;

      if (event.dataField === 'orgAmtT') {
        // 편성금액일 경우 편성관리 팝업
        this.openBudgetingPopup(event.item);
      } else if (event.dataField === 'execAmtT') {
        // 집행금액일 경우 집행관리 팝업
        this.openBudgetExecPopup(event.item, null);
      } else if (event.dataField.includes('month')) {
        this.openBudgetExecPopup(
          event.item,
          event.dataField.replace('month', '')
        );
      }
    },
    // 그리드 row click 이벤트
    /**
     * 수정 팝업 호출
     */
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;

      if (header.name === 'orgAmtT') {
        // 편성금액일 경우 편성관리 팝업
        this.openBudgetingPopup(data);
      } else if (header.name === 'execAmtT') {
        // 집행금액일 경우 집행관리 팝업
        this.openBudgetExecPopup(data, null);
      } else if (header.name.includes('month')) {
        this.openBudgetExecPopup(data, header.name.replace('month', ''));
      }
    },
    /**
     * 대상부서지정 팝업  호출
     */
    openBudgetingPopup(data) {
      data.period = [this.searchParam.year, this.searchParam.year];

      let param = this.$_.cloneDeep(data);
      param.year =
        param.budgetTypeCd === 'typeSum' || param.budgetTypeCd === 'sum'
          ? param.searchYear
          : param.year;
      param.budgetTypeCd =
        param.budgetTypeCd === 'typeSum' || param.budgetTypeCd === 'sum'
          ? this.searchParam.budgetTypeCd
          : param.budgetTypeCd;
      param.plantCd = this.searchParam.plantCd
        ? this.searchParam.plantCd
        : param.plantCd;
      param.budgetActMstNo = this.searchParam.budgetActMstNo
        ? this.searchParam.budgetActMstNo
        : param.budgetActMstNo;
      param.budgetClsCd = this.searchParam.budgetClsCd
        ? this.searchParam.budgetClsCd
        : param.budgetClsCd;
      param.isStatus = true;

      this.popupOptions.target = () => import(`${'./budgeting.vue'}`);
      this.popupOptions.title = 'L0000005143'; // 예산편성 검색
      this.popupOptions.param = param;
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openBudgetExecPopup(data, month) {
      data.period = [this.searchParam.year, this.searchParam.year];
      let param = this.$_.cloneDeep(data);
      param.year =
        param.budgetTypeCd === 'typeSum' || param.budgetTypeCd === 'sum'
          ? param.searchYear
          : param.year;
      param.budgetTypeCd =
        param.budgetTypeCd === 'typeSum' || param.budgetTypeCd === 'sum'
          ? this.searchParam.budgetTypeCd
          : param.budgetTypeCd;
      param.plantCd = this.searchParam.plantCd
        ? this.searchParam.plantCd
        : param.plantCd;
      param.budgetActMstNo = this.searchParam.budgetActMstNo
        ? this.searchParam.budgetActMstNo
        : param.budgetActMstNo;
      param.budgetClsCd = this.searchParam.budgetClsCd
        ? this.searchParam.budgetClsCd
        : param.budgetClsCd;
      param.isStatus = true;

      if (month) {
        param.month = month;
      }

      this.popupOptions.target = () => import(`${'./budgetExecution.vue'}`);
      this.popupOptions.title = 'L0000005158'; // 예산집행 검색
      this.popupOptions.param = param;
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    customSpanOption({ row, column, rowIndex, columnIndex }) {
      let sumLength = this.$_.filter(this.gridOptions.data, {
        budgetTypeCd: 'sum',
      });
      let span = {
        rowspan: 1,
        colspan: 1,
      };
      // 합계 첫번째
      if (row.budgetTypeCd === 'sum') {
        switch (columnIndex) {
          case 1:
            if (sumLength.length === 2) {
              span.rowspan = row.budgetClsCd === 'BC001' ? 2 : 0;
              span.colspan = row.budgetClsCd === 'BC001' ? 2 : 0;
            } else {
              span.rowspan =
                row.budgetClsCd === 'BC001' || row.budgetClsCd === 'BC002'
                  ? 2
                  : 0;
              span.colspan =
                row.budgetClsCd === 'BC001' || row.budgetClsCd === 'BC002'
                  ? 2
                  : 0;
            }

            break;
          case 2:
            span.rowspan = 0;
            span.colspan = 0;
            break;
          case 3:
            span.colspan = 3;
            break;
          case 4:
          case 5:
            span.rowspan = 0;
            span.colspan = 0;
            break;
          default:
            break;
        }
      } else if (row.budgetTypeCd === 'typeSum') {
        switch (columnIndex) {
          case 1:
            span.colspan = 5;
            break;
          case 2:
          case 3:
          case 4:
          case 5:
            span.rowspan = 0;
            span.colspan = 0;
            break;
          default:
            break;
        }
      }

      return span;
    },
    /** Button Event **/
    /** /Button Event **/
    tableRowClassName({ row, rowIndex }) {
      if (row.year === '합계') {
        return 'row-eval-background-color';
      }
    },
    disabledFn(header, row, index) {
      if (row.year === '합계') {
        return false;
      }

      return true;
    },
  },
};
</script>
<style>
.row-eval-background-color {
  background-color: #80808042 !important;
  pointer-events: none;
}
</style>
