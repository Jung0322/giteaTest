<!--
  목적 : 시스템 > 로그관리 > 배치로그관리
  작성자 : jkl
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000767"
            name="searchDt"
            :default="searchParam.searchDt"
            v-model="searchParam.searchDt"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001197')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @getList="getList"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'batch-log',
  data() {
    return {
      // 검색 결과 테이블 옵션
      gridOptions: {
        name: 'batchLog',
        header: [],
        data: [],
        btns: [],
        height: '600',
      },
      // 검색 조건
      searchParam: {
        searchDt: [], // 로그검색기간
        fromDt: '',
        toDt: '',
      },
      editable: true,
      searchUrl: '',
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    // vue 객체 초기화
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
  /* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.searchUrl = selectConfig.manage.log.batchLog.list.url;

      let from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '0d',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      let to = this.$comm.getToday();
      this.searchParam.searchDt = [from, to];

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001200'), // 배치코드
          dataField: 'batchCd',
          width: '20%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000993'), // 로그발생일
          dataField: 'runDt',
          width: '20%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001819'), // 실행결과
          dataField: 'runResult',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000810'), // 내용
          dataField: 'remark',
          width: '40%',
        },
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
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList();
    },
    getList() {
      this.searchParam.fromDt = this.searchParam.searchDt[0];
      this.searchParam.toDt = this.searchParam.searchDt[1];

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
  /* methods */
};
</script>
