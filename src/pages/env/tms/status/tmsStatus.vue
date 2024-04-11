<!--
  목적 : 안전점검 - 안전 점검 종류
  Detail : 안전점검 점검항목 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 측정소구분 -->
          <y-select
            :width="8"
            :comboItems="typeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002936"
            name="tmsType"
            v-model="searchParam.tmsType"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000767"
            name="period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 측정소 -->
          <y-select
            :width="8"
            :comboItems="stationItems"
            itemText="stationName"
            itemValue="stationCode"
            ui="bootstrap"
            label="L0000002935"
            name="stationCode"
            v-model="searchParam.stationCode"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 측정항목 -->
          <y-select
            :width="8"
            :comboItems="itemItems"
            itemText="itemName"
            itemValue="itemCode"
            ui="bootstrap"
            label="L0000002963"
            name="itemCode"
            v-model="searchParam.itemCode"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- TMS 년간 측정값 집계 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="false"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000178')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-tms-station-item-std',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '',
      tmsType: '',
      period: [],
      stationCode: '',
      itemCode: '',
      pageNumber: 1,
      pageSize: 100,
      pageTotal: 0,
      pageSizes: [100, 200, 300],
      orderByExpression: '',
    },
    gridOptions: {
      name: 'tmsStatus',
      header: [],
      data: [],
      btns: [],
      height: 400,
    },
    stationItems: [],
    itemItems: [],
    typeItems: [],
    editable: false,
    searchUrl: '',
    searchStationUrl: '',
    searchItemUrl: '',
    excelDownUrl: '',
    YAuiGrid: null,
  }),
  watch: {
    'searchParam.stationCode'() {
      if (this.searchParam.stationCode) {
        let data = this.$_.filter(this.stationItems, {
          stationCode: this.searchParam.stationCode,
        });

        if (data && data.length > 0) {
          this.searchParam.plantCd = data[0].plantCd;
          this.searchParam.tmsType = data[0].tmsType;
        }
      }
    },
    'searchParam.itemCode'() {
      if (this.searchParam.itemCode) {
        let data = this.$_.filter(this.itemItems, {
          itemCode: this.searchParam.itemCode,
        });
        if (data && data.length > 0) {
          this.searchParam.tmsType = data[0].tmsType;
        }
      }
    },
    'searchParam.type'() {
      // 측정소와 측정항목을 재조회한다.
      this.getTmsStation(); // TMS 측정소 조회
      this.getTmsItem(); // TMS 측정항목 조회
    },
    'searchParam.plantCd'() {
      // 측정소를 재조회한다.
      this.getTmsStation(); // TMS 측정소 조회
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
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
      this.searchUrl = selectConfig.env.tms.status.list.url;
      this.searchStationUrl = selectConfig.env.tms.baseInfo.tmsStation.list.url;
      this.searchItemUrl = selectConfig.env.tms.baseInfo.tmsItem.list.url;
      this.excelDownUrl = selectConfig.env.tms.status.excel.url;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '120',
          style: 'center-align',
        } /* 사업장 */,
        {
          /* 배출시설명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001174'),
          dataField: 'facilityNm',
          width: '130',
          style: 'center-align',
        },
        {
          /* 배출구명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001147'),
          dataField: 'outletNm',
          width: '150',
          style: 'left-align',
        },
        {
          /* 측정소명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002937'),
          dataField: 'stationName',
          width: '150',
          style: 'center-align',
        },
        {
          /* 항목명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003205'),
          dataField: 'itemName',
          width: '120',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'sunit',
          width: '120',
          style: 'center-align',
        } /* 단위 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'tmsTypeNm',
          width: '120',
          style: 'center-align',
        } /* 구분 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002952'),
          dataField: 'dataDate',
          width: '180',
          style: 'center-align',
        } /* 측정일시 */,
        {
          /* 측정값 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002921'),
          dataField: 'dataValue',
          width: '120',
          style: 'right-align',
          dataType: 'numeric',
          formatString: '#,##0.###',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      let today = this.$comm.getToday();
      this.searchParam.period = [
        this.$comm.getCalculatedDate(today, '-1y', 'YYYY-MM-DD', 'YYYY-MM-DD'),
        today,
      ];
      this.$comm.getComboItems('TMS_TYPE', true).then((_result) => {
        this.typeItems = _result;
      });
      this.getTmsStation(); // TMS 측정소 조회
      this.getTmsItem(); // TMS 측정항목 조회

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.searchParam.pageTotal = _result.data.count;
          // this.gridOptions.data = _result.data.items;
          this.YAuiGrid.setGridData(this.$_.clone(_result.data.items));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getTmsStation() {
      this.$http.url = this.searchStationUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.searchParam.plantCd,
        tmsType: this.searchParam.tmsType,
      };
      this.$http.request(
        (_result) => {
          this.stationItems = this.$_.clone(_result.data);
          this.stationItems.splice(0, 0, {
            stationCode: '',
            stationName: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });

          if (
            this.$_.findIndex(this.stationItems, {
              stationCode: this.searchParam.stationCode,
            }) === -1
          ) {
            this.searchParam.stationCode = '';
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getTmsItem() {
      this.$http.url = this.searchItemUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.searchParam.plantCd,
        tmsType: this.searchParam.tmsType,
      };
      this.$http.request(
        (_result) => {
          this.itemItems = this.$_.clone(_result.data);
          this.itemItems.splice(0, 0, {
            itemCode: '',
            itemName: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });

          if (
            this.$_.findIndex(this.itemItems, {
              itemCode: this.searchParam.itemCode,
            }) === -1
          ) {
            this.searchParam.itemCode = '';
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnSearchClickedCallback() {
      this.searchParam.pageNumber = 1;
      this.getList();
    },
    handleSizeChange(_newPageSize) {
      this.searchParam.pageSize = _newPageSize;
      this.getList();
    },
    handleCurrentChange(_newPage) {
      this.getList();
    },
    tableSortChange(_item) {
      this.searchParam.orderByExpression =
        this.$comm.toUndrFromCamelCase(_item.prop) +
        ' ' +
        (_item.order === 'descending' ? 'desc' : 'asc');
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 370;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
<style scoped>
.pagination-container {
  background: #fff;
  padding: 0px 16px;
  text-align: center;
}
.pagination-container.hidden {
  display: none;
}
</style>
