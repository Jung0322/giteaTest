<!--
  목적 : 시스템 > 로그관리 > 에러로그관리
  작성자 : kdk
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
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
    <!-- 검색 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002021')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
          @btnSearchClicked="btnSearchClicked"
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
  name: 'error-log-list',
  props: {},
  data() {
    return {
      searchParam: {
        // deptCd: '', // 사업장
        // plantCd: '',
        searchDt: [], // 로그검색기간
        fromDt: '',
        toDt: '',
      },
      gridOptions: {
        name: 'errorLog',
        header: [],
        data: [],
        btns: [],
        height: '600',
      },

      errorLog: {
        logNo: '',
        logInfo: '',
        statusCd: '',
        cause: '',
        causeMessage: '',
        createDt: '',
        // plantCd: '',
        // plantNm: '',
        // deptCd: '',
        // deptNm: '',
        // userId: '',
        // userNm: '',
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
      //   this.searchParam.deptCd = this.$store.getters.deptCd;
      this.searchUrl = selectConfig.manage.log.errorLog.list.url; // 년도별 목표 리스트 상세 조회

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
          dataField: 'logNo',
          width: '17%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001011'), // 메시지
          dataField: 'logInfo',
          width: '17%',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001539'), // 상태코드
          dataField: 'statusCd',
          width: '17%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002098'), // 원인
          dataField: 'cause',
          width: '17%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002107'), // 원인상세
          dataField: 'causeMessage',
          width: '17%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001078'), // 발생일
          dataField: 'createDt',
          width: '15%',
          style: 'center-align',
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
    cellClickHandler(event) {
      if (event.item === null || event.item === undefined) return;
      if (event.dataField === 'logInfo') {
        this.popupOptions.target = () =>
          import(`${'@/pages/manage/log/errorLogDetail.vue'}`);
        this.popupOptions.title = 'L0000004557'; // 오류로그 상세
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
        this.popupOptions.width = '80%';
        this.popupOptions.param = {
          logNo: event.item.logNo,
          // gridOptions: this.gridOptions.data,
        };
      }
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },

    /** validation checking **/
    btnSearchClickedCallback() {
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 295;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
