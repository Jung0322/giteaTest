<!--
  목적 : 합동점검  - 합동점검결과 목록
  Detail : 합동점검결과
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
            label="점검예정일"
            name="period"
            :default="searchParam.period"
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
            name="safCheckKindNo"
            label="점검종류"
            v-model="searchParam.safCheckKindNo"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-dept
            type="search"
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
            name="checkStepCd"
            label="진행상태"
            v-model="searchParam.checkStepCd"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          label="합동점검결과 목록"
          :useExcelExport="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableSorting="true"
          @cellClick="cellClickHandler"
          @openPopUp="openPopUp"
          @getList="getList"
          @btnClickedError="btnClickedErrorCallback"
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
  name: 'consol-plan',
  props: {},
  data: () => ({
    searchParam: {
      period: [],
      startDate: '',
      endDate: '',
      deptCd: '', // 주관부서코드
      plantCd: '', // 사업장 코드
      safCheckKindNo: null,
      checkStepCd: 'CHS02', // 점검진행상태
    },

    YAuiGrid: null,
    gridOptions: {
      name: 'safConsolidationConsolidationResult',
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
      { code: 'CHS02', codeNm: '계획완료' },
      { code: 'CHS03', codeNm: '결과' },
      { code: 'CHS04', codeNm: '점검완료' },
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
    this.getList(); // 합동점검계획 목록 조회
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.consolPlan.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '90',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001986'),
          dataField: 'chkYearTitle',
          width: '230',
          style: 'left-align',
        }, // 연간합동점검계획명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003195'),
          dataField: 'chkTitle',
          width: '230',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 합동점검계획명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'),
          dataField: 'checkStepNm',
          width: '100',
        }, // 진행상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000428'),
          dataField: 'bizApprStepNm',
          width: '100',
        }, // 결재상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003197'),
          dataField: 'safCheckKindNm',
          width: '100',
        }, // 합동종류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002564'),
          dataField: 'congChkSchYmd',
          width: '100',
        }, // 점검예정일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002570'),
          dataField: 'congChkYmd',
          width: '100',
        }, // 점검일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'),
          dataField: 'deptNm',
          width: '130',
        }, // 주관부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002809'),
          dataField: 'depts',
          width: '130',
        }, // 참여부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002813'),
          dataField: 'vendors',
          width: '130',
        }, // 참여협력업체
      ];
      this.gridOptions.btns = [
        {
          title: 'L0000001034',
          color: 'orange',
          btnClicked: 'openPopUp',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        }, // 무계획결과등록
        {
          title: 'L0000000327',
          color: 'green',
          btnClicked: 'getList',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
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

      this.getConsolKindList();
    },
    /** 합동점검계획 목록 조회 **/
    getList() {
      this.searchParam.startDate = this.$_.clone(this.searchParam.period[0]);
      this.searchParam.endDate = this.$_.clone(this.searchParam.period[1]);
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(_result.data);
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
        useYn: 'Y',
        congYn: 'Y',
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm: '전체',
          });
          this.consolTypeItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'chkTitle') {
        this.popupOptions.target = () =>
          import(`${'./consolidationResultDetail.vue'}`);
        this.popupOptions.title = '합동점검결과 수정/상세';
        this.popupOptions.param = {
          safCongChkRsltNo: event.item.safCongChkRsltNo, // 합동점검일련번호
        };
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    openPopUp() {
      this.popupOptions.target = () =>
        import(`${'./consolidationResultDetail.vue'}`);
      this.popupOptions.title = '합동점검결과 등록';
      this.popupOptions.param = {
        safCongChkRsltNo: 0, // 합동점검일련번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },

    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 370;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
