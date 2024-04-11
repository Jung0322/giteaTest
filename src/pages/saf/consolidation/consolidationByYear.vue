<!--
  목적 : 합동점검  - 연간합동점검계획 목록
  Detail : 연간합동점검계획
  etg
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-datepicker
            :width="8"
            :range="true"
            label="점검기간"
            name="period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="consolTypeItems"
            itemText="safCheckKindNm"
            itemValue="safCheckKindNo"
            ui="bootstrap"
            name="patrolType"
            label="점검종류"
            v-model="searchParam.safCheckKindNo"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-dept
            type="search"
            name="deptCd"
            label="주관부서"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="stepStatusItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="stepStatus"
            label="진행상태"
            v-model="searchParam.stepCd"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          label="연간합동점검 목록"
          :items="gridOptions.data"
          :useExcelExport="false"
          @cellClick="cellClickHandler"
          @btnPopup="openPopUp"
          @btnSearch="getList"
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
  name: 'check-schedule-list',
  props: {},
  data: () => ({
    searchParam: {
      period: [],
      startDate: '',
      endDate: '',
      deptCd: '', // 주관부서코드
      plantCd: '', // 사업장 코드
      safCheckKindNo: null,
      stepCd: null, // 점검진행상태
    },
    YAuiGrid: null,
    gridOptions: {
      name: 'safConsolidationConsolidationByYear',
      header: [],
      data: [],
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
    editable: false,
    stepStatusItems: [
      { code: null, codeNm: '전체' },
      { code: 'ING', codeNm: '진행중' },
      { code: 'CMPLT', codeNm: '점검완료' },
    ],
    searchUrl: '',
    consolTypeItems: [],
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
    this.getList(); // 연간합동점검계획 목록 조회
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.consolMst.list.url;

      // 합동종류
      this.getConsolKindList();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001986'),
          dataField: 'chkYearTitle',
          width: '16%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 연간합동점검계획명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002554'),
          dataField: 'stepNm',
          width: '7%',
        }, // 점검상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000428'),
          dataField: 'bizApprStepNm',
          width: '10%',
        }, // 결재상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002543'),
          dataField: 'planSymd',
          width: '10%',
        }, // 점검계획시작일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002544'),
          dataField: 'planEymd',
          width: '10%',
        }, // 점검계획종료일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003197'),
          dataField: 'safCheckKindNm',
          width: '10%',
        }, // 합동종류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'),
          dataField: 'deptNm',
          width: '10%',
          style: 'left-align',
        }, // 주관부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002809'),
          dataField: 'depts',
          width: '10%',
          style: 'left-align',
        }, // 참여부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002813'),
          dataField: 'vendors',
          width: '10%',
          style: 'left-align',
        }, // 참여협력업체
      ];
      this.gridOptions.btns = [
        {
          title: 'L0000001789',
          color: 'orange',
          btnClicked: 'btnPopup',
          visible: this.editable,
        }, // 신규등록
        {
          title: 'L0000000327',
          color: 'green',
          btnClicked: 'btnSearch',
        }, // 검색
      ];

      const today = this.$comm.getToday();
      const from = this.$comm.getCalculatedDate(
        today,
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      const to = this.$comm.getCalculatedDate(
        today,
        '1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.period = [from, to];
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      const searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    /** 연간합동점검 목록 조회 **/
    getList() {
      this.searchParam.startDate = this.$_.clone(this.searchParam.period[0]);
      this.searchParam.endDate = this.$_.clone(this.searchParam.period[1]);
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    getConsolKindList() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        congYn: 'Y',
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.consolTypeItems = this.$_.clone(_result.data);
          this.consolTypeItems.unshift({
            safCheckKindNo: null,
            safCheckKindNm: '전체',
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'chkYearTitle') {
        this.popupOptions.target = () =>
          import(`${'./consolidationByYearDetail.vue'}`);
        this.popupOptions.title = '연간합동점검계획';
        this.popupOptions.param = {
          safCongChkRsltNo: event.item.safCongChkRsltNo, // 합동점검일련번호
          safCongChkPlanNo: event.item.safCongChkPlanNo, // 연간합동점검공통번호
        };
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    openPopUp() {
      this.popupOptions.target = () =>
        import(`${'./consolidationByYearDetail.vue'}`);
      this.popupOptions.title = '연간합동점검계획';
      this.popupOptions.param = {
        safCongChkRsltNo: 0, // 합동점검일련번호
        safCongChkPlanNo: 0, // 연간합동점검공통번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data === 'delete') {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '삭제되었습니다.',
          type: 'success', // success / info / warning / error
        });
      }
      this.getList();
    },

    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 370;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
