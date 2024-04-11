<!--
  목적 : SHE경영 관리>법정선임자 관리>법정선임자 평가 관리>평가결과 현황
  Detail : 평가결과 현황 조회 화면
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
          <!-- 대상년도 -->
          <y-datepicker
            :width="8"
            label="L0000004449"
            :range="true"
            type="year"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 사업장 -->
          <y-plant
            :width="8"
            ui="bootstrap"
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 구분 -->
          <y-select
            :width="8"
            :comboItems="MgtHalfTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="halfTypeCd"
            label="L0000000686"
            v-model="searchParam.halfTypeCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 법정선임자 -->
          <y-select
            :width="8"
            :comboItems="electTitleItems"
            itemText="electTitlNm"
            itemValue="safElectTitlNo"
            ui="bootstrap"
            name="safElectTitlNo"
            label="L0000005162"
            v-model="searchParam.safElectTitlNo"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
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
           본인평가결과 목록 
          <y-data-table
            ref="dataTable"
            class="mergeTable"
            :spanOptions="gridOptions.merge"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="false"
            :rowClassName="tableRowClassName"
            :cellClassName="tableCellClassName"
            @tableLinkClicked="tableLinkClicked"
            label="L0000005207"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005207')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getList="getList"
          @cellClick="cellClickHandler"
          @closePopup="closePopup('CLOSE')"
        />
      </b-col>
    </b-row>

    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'elect-eval-plan',
  props: {
    popupParam: {
      type: Object,
      default: () => {
        return {
          plantCd: null,
          startDt: '',
          endDt: '',
          popupMode: false,
        };
      },
    },
  },
  data: () => ({
    searchParam: {
      period: [], // 대상년도
      halfTypeCd: null, // 구분
      plantCd: null, // 사업장
      safElectTitlNo: null, // 법정선임자번호
    },
    gridOptions: {
      name: 'electEvalRsltStatus',
      btns: [],
      header: [],
      data: [],
      height: 'auto',
      merge: [],
    },
    YAuiGrid: null,
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '80%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    MgtHalfTypeItems: [], // 구분 selectbox 목록
    electTitleItems: [], // 법정선임자 selectbox 목록
    procStepItems: [], // 상태 selectbox 목록
    stateItems: [], // 상태 selectbox 목록
    userType: null, // 대상자 검색/본인평가자 검색 구분
  }),
  computed: {
    changeUpUserEditable() {
      // 전사 담당자이거나 사업장 담당자이거나 시스템 관리자인지 권한 여부
      return (
        this.$comm.isPlantGrp() ||
        this.$comm.isCompanyGrp() ||
        this.$store.getters.isManager
      );
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
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
  //* methods */
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.year === '합계') {
        return 'row-eval-background-color';
      }
    },
    tableCellClassName({ row, colunm, rowIndex, colIndex }) {
      if (row.year === '합계') {
        return 'row-color';
      }
    },
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchParam.period = [
        this.$comm.getThisYear(),
        this.$comm.getThisYear(),
      ];

      this.gridOptions.merge = [
        { index: 1, field: 'year' },
        { index: 2, field: 'plantNm' },
        { index: 3, field: 'halfTypeNm' },
      ];
      if (this.popupParam.popupMode) {
        this.searchParam.period = [
          this.popupParam.startDt,
          this.popupParam.endDt,
        ];
        this.searchParam.plantCd = this.popupParam.plantCd;
      }
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004449'),
          dataField: 'year',
          width: '10%',
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'halfTypeNm',
          width: '10%',
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005162'),
          dataField: 'electTitlNm',
          width: '30%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005205'),
          dataField: 'tgtCntT',
          width: '15%',
          style: 'right-align',
          styleFunction: (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item,
            dataField
          ) => {
            if (item.plantNm === '합계') {
              return 'row-color3';
            } else {
              return 'row-color2';
            }
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005230'),
          dataField: 'completeCntT',
          width: '15%',
          style: 'right-align',
          styleFunction: (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item,
            dataField
          ) => {
            if (item.plantNm === '합계') {
              return 'row-color3';
            } else {
              return 'row-color2';
            }
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005231'),
          dataField: 'evalRate',
          width: '10%',
          style: 'right-align',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
          visible: this.popupParam.popupMode,
        }, // 닫기
      ];

      // 구분 (상반기/하반기)
      this.$comm.getComboItems('MGT_HALF_TYPE', true).then((_result) => {
        this.MgtHalfTypeItems = _result;
      });

      // 법정선임자(평가대상인 법정선임자)
      this.getElectTitleComboItems();

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
    getElectTitleComboItems() {
      this.$http.url = selectConfig.saf.electTitle.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y', // 사용여부
        evalTgtYn: 'Y', // 평가대상여부
      };
      this.$http.request(
        (_result) => {
          this.electTitleItems = this.$_.clone(_result.data);
          this.electTitleItems.splice(0, 0, {
            safElectTitlNo: null,
            electTitlNm:
              this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      this.$http.url = selectConfig.mgt.electEvalMgmt.status.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          if (!this.popupParam.popupMode) {
            this.$comm.pushCookie(this.searchParam);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField !== 'completeCntT' && event.dataField !== 'tgtCntT') {
        return;
      }

      this.openPopup(event.item, event.dataField === 'tgtCntT' ? 'me' : 'up');
    },
    tableLinkClicked(header, data) {
      this.openPopup(data, header.name === 'tgtCntT' ? 'me' : 'up');
    },
    openPopup(data, evalType) {
      data.evalType = evalType;
      if (data.year === '합계') {
        data.period = this.searchParam.period;
      }

      this.popupOptions.target = () => import(`${'./electEvalRsltList.vue'}`);
      this.popupOptions.title = 'L0000005207'; // 평가결과 목록
      this.popupOptions.param = data;
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    closePopup(gubun) {
      if (gubun === 'CLOSE') {
        this.$emit('closePopup', '');
      }
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getList();
    },
    /** button 관련 이벤트 **/
    /** end button 관련 이벤트 **/
  },
};
</script>
<style>
.row-eval-background-color {
  background-color: #c7c7c742 !important;
}
.row-color .el-button {
  color: black !important;
}
.row-color {
  color: red !important;
}
.row-color2 {
  color: #0a85e7 !important;
}
.row-color3 {
  color: #333333 !important;
}
</style>
