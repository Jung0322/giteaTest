<!--
  목적 : 시스템 > 로그 > 로그인 로그
  작성자 : kdk
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
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
        <b-col>
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 부서 -->
          <y-tree-dept
            type="search"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
            label="L0000001287"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :data="gridOptions.data"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000996')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @btnSearchClicked="btnSearchClicked"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'login-log-list',
  props: {},
  data() {
    return {
      searchArea: {
        title: 'L0000000329', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        deptCd: '', // 사업장
        searchDt: [], // 로그검색기간
        plantCd: '',
        fromDt: '',
        toDt: '',
      },
      gridOptions: {
        name: 'loginLog',
        header: [],
        data: [],
        btns: [],
        height: '600',
      },

      loginLog: {
        loginLogNo: '',
        plantCd: '',
        plantNm: '',
        deptCd: '',
        deptNm: '',
        connUserId: '',
        connUserNm: '',
        connIp: '',
        insertDt: '',
        logoutDt: '',
      },

      searchUrl: '',
      YAuiGrid: null,
    };
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.searchParam.deptCd = this.$store.getters.deptCd;
      this.searchUrl = selectConfig.manage.log.loginLog.list.url; // 년도별 목표 리스트 상세 조회

      let from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      let to = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '0m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.searchDt = [from, to];

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000994'), // 로그번호
          dataField: 'loginLogNo',
          width: '8%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004366'), // 사업장명
          dataField: 'plantNm',
          width: '8%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004367'), // 부서명
          dataField: 'deptNm',
          width: '8%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001474'), // 사용자아이디
          dataField: 'connUserId',
          width: '8%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001472'), // 사용자명
          dataField: 'connUserNm',
          width: '8%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001831'), // 아이피정보
          dataField: 'connIp',
          width: '8%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000997'), // 로그인시간
          dataField: 'insertDt',
          width: '10%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000995'), // 로그아웃시간
          dataField: 'logoutDt',
          width: '10%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClicked',
        },
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
      // this.setGridSize();
    },

    // 초기화
    btnClearClickedCallback() {
      //   Object.assign(
      //     this.$data.comSafeMaster,
      //     this.$options.data().comSafeMaster
      //   );
      //   this.$validator.reset();
    },

    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    // 리스트 검색
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

    /** validation checking **/
    btnSearchClicked() {
      this.getList();
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
