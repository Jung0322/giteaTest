<!--
  목적 : 점검>정부지자체 시정조치 이행점검 관리 관리>점검결과 관리
  Detail : 점검결과 관리 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 사업장 -->
          <y-plant
            :width="8"
            name="plantCd"
            type="search"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 대상년도 -->
          <y-datepicker
            :width="8"
            label="L0000004449"
            type="year"
            name="year"
            :default="searchParam.year"
            v-model="searchParam.year"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 구분 -->
          <y-select
            :width="8"
            :comboItems="regRegdemItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="regRegdem"
            label="L0000000686"
            v-model="searchParam.regRegdem"
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
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           점검결과 현황 목록 
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
            label="L0000005319"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005319')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
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
  /* attributes: name, components, props, data */
  name: 'gov-impl-chk-result-status',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: null, // 사업장
      year: null, // 대상년도
      regRegdem: null, // 구분
      totalFlag: '',
    },
    gridOptions: {
      name: 'govImplChkResultStatus',
      btns: [],
      header: [],
      data: [],
      height: 'auto',
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
    regRegdemItems: [], // 구분 selectbox 목록
  }),
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
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchParam.year = this.$comm.getThisYear();

      // 구분 (정기/수시)
      this.$comm.getComboItems('RSA_REG_REGDEM', true).then((_result) => {
        this.regRegdemItems = _result;
      });

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ]
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    getHeaders() {
      this.gridOptions.header = [];
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
        dataField: 'plantNm', 
        width: '7%', 
        cellMerge: true,
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000005320'), 
        dataField: 'gubun', 
        width: '7%', 
        cellMerge: true,
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), 
        dataField: 'type', 
        width: '10%', 
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000005400'), 
        dataField: 'oldCnt', 
        width: '10%', 
        styleFunction: (rowIndex, columnIndex, value, headerText, item, dataField) => {
          if (item.plantCd === '합계') {
            return "row-color3";
          } else {
            if (item.type === '개선 조치율(%)') {
              return "row-color3";  
            } else {
              return "row-color2";
            }
            
          }
        },
      });
      this.getYearHeader();
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000003180'), 
        dataField: 'total', 
        width: '5%', 
        styleFunction: (rowIndex, columnIndex, value, headerText, item, dataField) => {
          if (item.plantCd === '합계') {
            return "row-color3";
          } else {
            if (item.type === '개선 조치율(%)') {
              return "row-color3";  
            } else {
              return "row-color2";
            }
            
          }
        },
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000005399'), 
        dataField: 'allCnt', 
        width: '5%', 
        styleFunction: (rowIndex, columnIndex, value, headerText, item, dataField) => {
          if (item.plantCd === '합계') {
            return "row-color3";
          } else {
            if (item.type === '개선 조치율(%)') {
              return "row-color3";  
            } else {
              return "row-color2";
            }
            
          }
        },
      });
    },
    getYearHeader() {
      // 다국어 처리 '년'
      let langYear = this.$comm.getLangSpecInfoLabel('L0000000828');
      // 다국어 처리 '월'
      let langMonth = this.$comm.getLangSpecInfoLabel('L0000002108');
      let from = this.$comm.moment(this.searchParam.year);
      var yearText = from.format('YYYY') + langYear;
      var header = { headerText: yearText, align: 'center', children: [] };

      for (let i = 1; i < 13; i++) {
        header.children.push({
          headerText: i + langMonth,
          dataField: 'mon' + String(i),
          width: '5%', 
          styleFunction: (rowIndex, columnIndex, value, headerText, item, dataField) => {
            if (item.plantCd === '합계') {
              return "row-color3";
            } else {
              if (item.type === '개선 조치율(%)') {
                return "row-color3";  
              } else {
                return "row-color2";
              }
            
            }
          },
        });
      }
      this.gridOptions.header.push(this.$_.clone(header));
    },
    getList() {
      this.getHeaders();

      if (!this.searchParam.plantCd) {
        this.searchParam.totalFlag = 'Y';
      } else {
        this.searchParam.totalFlag = '';
      }
      this.$http.url = selectConfig.saf.govImplChkResult.status.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.gridOptions.data)
          this.gridOptions.data = this.gridOptions.data.map((item) => {
            let row = item;
            row.regRegdem = this.searchParam.regRegdem;

            return row;
          });

          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'plantNm') return;
      if (event.dataField === 'gubun') return;
      if (event.dataField === 'type') return;
      if (event.item.type === '개선 조치율(%)') return;
      if (event.item.plantNm === '합계') return;
      if (event.item === '개선현황') {
        // 개선요청현황 목록 조회 팝업
        this.openImprStatusPop(event.item, event.dataField);
      } else {
        // 정부지자체 시정조치 이행점검 결과현황 목록 조회 팝업
        this.openGovImplChkResultPop(event.item, event.dataField);
      }
    },
    tableLinkClicked(header, data) {
      if (data.gubun === '개선현황') {
        // 개선요청현황 목록 조회 팝업
        this.openImprStatusPop(data, header.name);
      } else {
        // 정부지자체 시정조치 이행점검 결과현황 목록 조회 팝업
        this.openGovImplChkResultPop(data, header.name);
      }
    },
    // 행 분리 컬러 제거
    tableRowClassName({ row, rowIndex }) {
      let retStyle = '';

      if (row.plantNm === '합계') {
        retStyle += 'row-eval-background-color';
      }

      if (row.gubun === '개선 조치율(%)') {
        retStyle += ' row-pointer';
      }

      return retStyle;
    },
    tableCellClassName({ row, column, rowIndex, colIndex }) {
      if (row.gubun === '조치기한 초과(건수)' && row[column.property] !== '0') {
        return 'row-color';
      }
    },
    disabledFn(header, row, index) {
      if (row.plantNm === '합계') {
        return false;
      }

      return true;
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    openGovImplChkResultPop(data, headerName) {
      data.statusYn = 'Y';
      data.plantCd = data.plantCd === '합계' ? '' : data.plantCd;
      let param = data;

      param.tgtDeptYn = data.typeCd.includes('tgtDept') ? 'Y' : null;

      if (headerName === 'total') {
        data.month = '100';
      } else if (headerName === 'oldCnt') {
        data.month = '200';
      } else if (headerName === 'allCnt') {
        data.month = '300';
      } else {
        data.month = headerName.includes('mon')
          ? headerName.replace('mon', '')
          : '';
      }

      // 정부지자체 시정조치 이행점검 결과현황 목록 조회 팝업
      this.popupOptions.target = () =>
        import(`${'./govImplChkResultListPop.vue'}`);
      this.popupOptions.title = 'L0000005275'; // 정부지자체 시정조치 이행점검결과 상세
      this.popupOptions.param = data;
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openImprStatusPop(data, headerName) {
      // 개선요청현황 목록 조회 팝업
      let strParam = Object.keys(data)
        .filter((key) => key === 'plantCd' || key === 'regRegdem')
        .map((key) => {
          return data[key] === '합계' ? '' : data[key];
        })
        .join('|');

      let monFlag = '';
      if (headerName === 'total') {
        monFlag = '100';
      } else if (headerName === 'oldCnt') {
        monFlag = '200';
      } else if (headerName === 'allCnt') {
        monFlag = '300';
      } else {
        monFlag = Number(headerName.replace('mon', ''));
      }

      strParam += '|BAPSG';
      let param = {
        imprClassCd: 'ICL39', // 정부지자체 시정조치 이행점검
        monFlag: monFlag,
        strParam: strParam,
        subPlantCd: data.plantCd === '합계' ? '' : data.plantCd,
        apprFlag: data.typeCd,
        year: this.searchParam.year,
      };

      this.popupOptions.target = () => import(`${'@/pages/impr/imprActPopup'}`);
      this.popupOptions.title = 'L0000000259'; // 개선사항
      this.popupOptions.param = param;
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
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
.row-color{
  color: red !important;
}
.row-color2{
  color: #0A85E7 !important;
}
.row-color3{
  color: #333333 !important;
}
</style>
