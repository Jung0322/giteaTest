<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 대상년도 -->
          <y-datepicker
            :width="8"
            type="year"
            :range="true"
            name="actMonth"
            label="L0000004449"
            v-model="searchParam.period"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!--<b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <-- 검색 --
            <y-btn title="L0000000327" color="green" @btnClicked="getDataList" />
          </div>
          <-- 배출량 현황 --
          <y-data-table
            ref="dataTable"
            label="L0000004460"
            :message="'M0000001167'"
            :messageCheck="true"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :useRownum="false"
            :cellClassName="calStyle"
          />
        </b-col>
      </b-col>
    </b-row>-->

    <!-- 배출량 현황 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004460')"
          :useExcelExport="false"
          :enableSorting="true"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'y-act-data-master',
  props: {},

  data() {
    return {
      searchParam: {
        plantCd: '',
        period: [],
        mCols: [],
      },

      gridOptions: {
        name: 'emissionsStatus',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },
      searchUrl: '',
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getDataList();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    // 초기화
    init() {
      this.searchUrl = selectConfig.env.gas.emissions.getStatus.url;

      // 기간 Setting
      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(today, '-1y', 'YYYY', 'YYYY');
      var to = this.$comm.moment(today).format('YYYY');
      this.searchParam.period = [from, to];

      // grid header 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), // 사업장
          dataField: 'plant_nm',
          width: '100',
          style: 'center-align',
        },
        { headerText: this.$comm.getLangSpecInfoLabel('L0000004432'), dataField: 'year', width: '100px', align: 'center' }, // 대상연도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004461'), // 전년도이월량
          dataField: 'prev_amount',
          width: '100',
          style: 'center-align',
          dataType: 'numeric',
          formatString: '#,##0.###',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004431'), // 할당량
          dataField: 'amount',
          width: '100',
          style: 'center-align',
          dataType: 'numeric',
          formatString: '#,##0.###',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004462'), // 배출량
          dataField: 'tSum',
          width: '100',
          style: 'right-align',
          dataType: 'numeric',
          formatString: '#,##0.###',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004463'), // 구매 및 판매량
          dataField: 'ps',
          width: '150',
          style: 'center-align',
          dataType: 'numeric',
          formatString: '#,##0.###',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004464'), // 잔여량
          dataField: 'rsdl',
          width: '150',
          style: 'center-align',
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

      let i = 1;
      let m;
      let child = [];
      for (i; i <= 12; i++) {
        if (i < 10) {
          m = '0' + i;
        } else {
          m = i;
        }
        this.searchParam.mCols.push(m);
        child.push({
          headerText: i + this.$comm.getLangSpecInfoLabel('L0000002108'), // 월
          dataField: 'm' + m,
          width: '100',
          style: 'right-align',
          dataType: 'numeric',
          formatString: '#,##0.###',
        });
      }
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000004465'), // 월별 배출량 및 예상배출량
        children: child,
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDataList();
    },
    btnSearchClickedCallback() {
      this.getDataList();
    },
    // grid 목록 불러오기
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    calStyle({ row, column, rowIndex, colIndex }) {
      let returnText = '';
      if (
        typeof row['m' + column.property] !== 'undefined' &&
        !row['m' + column.property]
      ) {
        return 'ghg-ems';
      }
      if (!row[column.property] && column.property.substring(0, 1) === 'm') {
        row[column.property] = row['est_emissions'];
        row['m' + column.property] = false;
        returnText = 'ghg-ems';
      }
      return returnText;
    },
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
.ghg-ems {
  color: red !important;
}
</style>
