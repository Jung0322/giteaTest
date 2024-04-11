<!--
  목적 : 시스템 > 로그 > 액션 로그
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
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 유형명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002204"
            name="crudNmSearch"
            v-model="searchParam.crudNm"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!--  주요액션 등록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004558')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @btnPopupClickedCallback="btnPopupClickedCallback"
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
  name: 'crud-log-list',
  props: {},
  data() {
    return {
      searchArea: {
        title: 'L0000000329', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        searchDt: [], // 로그검색기간
        fromDt: '',
        toDt: '',
        crudNm: '',
      },
      gridOptions: {
        name: 'crudLog',
        header: [],
        data: [],
        btns: [],
        height: '600',
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
      crudLog: {
        logNo: '',
        crudCd: '',
        crudNm: '',
        crudDesc: '',
        url: '',
        deptNm: '',
        palntNm: '',
        userId: '',
        userNm: '',
        crudOption: '',
        logDt: '',
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
      this.searchUrl = selectConfig.manage.log.crudLog.list.url; // 년도별 목표 리스트 상세 조회

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
          width: '10%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002203'), // 유형
          dataField: 'crudCd',
          width: '10%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002204'), // 유형명
          dataField: 'crudNm',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004559'), // 유형설명
          dataField: 'crudDesc',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000186'), // URL
          dataField: 'url',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), // 사업장
          dataField: 'plantNm',
          width: '10%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), // 부서
          dataField: 'deptNm',
          width: '10%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001465'), // 사용자ID
          dataField: 'userId',
          width: '10%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001472'), // 사용자명
          dataField: 'userNm',
          width: '10%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001078'), // 발생일
          dataField: 'logDt',
          width: '10%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002718'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
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
    btnClearClickedCallback() {},

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
          this.YAuiGrid.setGridData(_result.data);
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

    /** /Button Event **/

    // 주요액션 등록 팝업
    btnPopupClickedCallback() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./impoAction.vue'}`);
      this.popupOptions.title = 'L0000004560'; // 주요액션 상세 등록
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },

    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
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
