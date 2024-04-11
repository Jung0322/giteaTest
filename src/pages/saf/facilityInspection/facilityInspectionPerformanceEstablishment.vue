<!--
  목적 : 안전 > 안전점검 > 안전점검실적
  Detail : 안전점검실적 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 년도(점검일) -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000000830"
            name="year"
            :default="searchParam.year"
            v-model="searchParam.year"
          ></y-datepicker>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0 checkResult">
          <!-- <div class="float-right mb-1">
             검색 
            <y-btn
              :action-url="searchUrl"
              :param="searchParam"
              title="L0000000327"
              color="green"
              action-type="get"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div> -->
          <!-- 사업장별 시설점검실적 현황 -->
          <!-- <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :useRownum="false"
            @tableLinkClicked="tableLinkClicked"
            label="L0000001431"
          ></y-data-table> -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001431')"
            :useExcelExport="false"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            :showSummary="true"
            @cellClick="cellClickHandler"
            @btnSearchClickedCallback="btnSearchClickedCallback"
            @btnClickedError="btnClickedErrorCallback"
          />
        </b-col>
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
  name: 'check-result-performance',
  props: {},
  data: () => ({
    searchParam: {
      year: '', // 기간(점검일)
      plantCd: '',
    },

    searchArea: {
      title: '검색박스숨기기', // 검색박스숨기기
      show: true,
    },

    gridOptions: {
      header: [],
      data: [],
      height: 'auto',
    },

    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: null,
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    searchPlantCd: '',
    searchYear: '',
    editable: false,
    searchUrl: '',
    searchUrl2: '',
    YAuiGrid: null,
  }),
  watch: {},
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl =
        selectConfig.saf.facilityInspection.facilityInspectionResult.status.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), // 사업장
          dataField: 'plant_nm',
          width: '150px',
          style: 'center-align',
          fixed: 'left',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003181'), // 합계 계획
          dataField: 'sum_plan',
          wdith: '90px',
          style: 'center-align',
          fixed: 'right',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003182'), // 합계 실적
          dataField: 'sum_result',
          wdith: '90px',
          style: 'center-align',
          fixed: 'right',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002874'), // 총합
          dataField: 'sum',
          wdith: '90px',
          style: 'center-align',
          fixed: 'right',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
      ];

      for (let i = 1; i < 13; i++) {
        let month = i < 10 ? '0' + i : i.toString();
        this.gridOptions.header.splice(i, 0, {
          headerText: i + this.$comm.getLangSpecInfoLabel('L0000002108'), // 월
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000466'), // 계획
              dataField: month + '_plan',
              wdith: '90px',
              style: 'center-align',
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001810'), // 실적
              dataField: month + '_result',
              wdith: '90px',
              style: 'center-align',
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            },
          ],
        });
      }
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
          visible: this.editable,
        }, //  검색
      ];

      let today = this.$comm.getToday();
      this.searchParam.year = today.substring(0, 4);

      // /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      // var searchParamByCookie = this.$comm.setSearchParamByCookie();
      // if (typeof searchParamByCookie !== 'undefined') {
      //   this.searchParam = searchParamByCookie;
      // }

      this.getList();
    },
    /** 사고 현황 검색 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.searchYear = this.$_.clone(this.searchParam.year);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          // this.gridOptions.data = this.$_.clone(_result.data);
          // this.$refs.dataTable.setCurrentRow(this.gridOptions.data[0]);
          // this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchClickedCallback() {
      this.getList();
    },
    cellClickHandler(event) {
      let gubun = '';
      if (event.dataField.split('_')[1] === 'result') {
        gubun = 'CHS04';
      }
      this.popupOptions.target = () =>
        import(`${'./facilityInspectionResult.vue'}`);
      this.popupOptions.title = 'L0000001753'; // 시설점검
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: this.YAuiGrid.plant_cd,
        year: this.searchYear,
        gubun: gubun,
        month:
          event.dataField !== 'sum' &&
          event.dataField !== 'sum_plan' &&
          event.dataField !== 'sum_result'
            ? event.dataField.substring(0, 2)
            : '',
      };
      console.log('event: ', event);
      this.popupOptions.closeCallback = this.closePopup;
    },

    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },

    /** end button 관련 이벤트 **/
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>

<style>
/* .facilityInspectionResultSub .el-table__body-wrapper {
  height: 382.22px !important;
} */
</style>
