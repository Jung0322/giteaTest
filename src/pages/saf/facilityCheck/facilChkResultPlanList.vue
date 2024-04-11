<!--
  목적 : 설비점검 - 설비점검계획 목록
  Detail : 설비점검계획 목록 화면으로 이미 등록된 계획을 선택하여 결과를 등록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 기간(작성일) -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000004851"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 설비점검종류 -->
          <y-select
            :width="8"
            :comboItems="comboCheckTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001616"
            name="safCheckTypeCd"
            v-model="searchParam.safCheckTypeCd"
          ></y-select>
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 점검상태 -->
          <y-select
            :width="8"
            :comboItems="checkStepCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="checkStepCd"
            label="L0000002554"
            v-model="searchParam.checkStepCd"
          ></y-select>
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 점검주관부서 -->
          <y-tree-dept
            type="search"
            label="L0000002578"
            :showAllDept="false"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 점검대상부서 -->
          <y-tree-dept
            type="search"
            label="L0000002549"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.tDeptCd"
            :deptSubYn="searchParam.tDeptSubYn"
            @setDeptSubYn="setTDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 점검수행부서 -->
          <y-tree-dept
            type="search"
            label="L0000004852"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.pDeptCd"
            :deptSubYn="searchParam.pDeptSubYn"
            @setDeptSubYn="setPDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 점검명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002551"
            name="keyword"
            v-model="searchParam.keyword"
          ></y-text>
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 완료여부 -->
          <y-select
            :width="8"
            :comboItems="chkEndYnItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002040"
            name="chkEndYn"
            v-model="searchParam.chkEndYn"
          ></y-select>
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 설비명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001596"
            name="facilityNm"
            v-model="searchParam.facilityNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :items="gridOptions.data"
            :label="this.$comm.getLangSpecInfoLabel('L0000001611')"
            :useExcelExport="false"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            :span-options="gridOptions.merge"
            @cellClick="cellClickHandler"
            @btnNew="btnCreateFacilChkPlanOpenPopupClicked"
            @getList="getList"
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
  name: 'facil-chk-result-plan-list',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '',
      pPlantCd: '',
      tPlantCd: '',
      deptCd: '',
      safCheckTypeCd: '', // 점검종류
      // safFacilityTypeCd: '', // 설비유형코드
      facilityNm: '', // 설비명
      checkStepCd: 'CHS01', // 점검진행상태
      period: [],
      keyword: '', // 점검명
      chkEndYn: null,
      tDeptCd: '', // 점검대상부서
      pDeptCd: '', // 점검수행부서
      deptSubYn: 'Y', // 하위부서여부 사용
      tDeptSubYn: 'Y', // 하위부서여부 사용
      pDeptSubYn: 'Y', // 하위부서여부 사용
    },
    gridOptions: {
      name: 'facilChkResultPlan',
      header: [],
      data: [],
      height: 'auto',
      merge: [],
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
    comboCheckTypeItems: [], // 점검종류
    checkStepCdItems: [], // 진행상태
    chkEndYnItems: [], // 점검완료여부콤보
    searchUrl: '',
    YAuiGrid: null,
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.gridOptions.merge = [];
      this.gridOptions.header = [];

      // Url Setting
      this.searchUrl = selectConfig.saf.facilChkPlan.list.url;

      this.searchParam.deptSubYn = 'Y';
      this.searchParam.tDeptSubYn = 'Y';
      this.searchParam.pDeptSubYn = 'Y';

      this.gridOptions.merge.push(
        // { index: 0, field: 'rownum' },
        { index: 0, field: 'safFacilChkTitle' },
        { index: 1, field: 'safFacilChkTitle' },
        { index: 2, field: 'safFacilChkTitle' },
        { index: 3, field: 'safFacilChkTitle' },
        { index: 4, field: 'safFacilChkTitle' },
        { index: 5, field: 'safFacilChkTitle' },
        { index: 10, field: 'safFacilChkTitle' },
        { index: 11, field: 'safFacilChkTitle' }
      );

      // 그리드 헤더 설정
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
        dataField: 'plantNm',
        width: '8%',
        style: 'center-align',
      }); // 사업장
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000000452'),
        dataField: 'bizApprStepNm',
        width: '8%',
        style: 'center-align',
        renderer: {
          type: 'LinkRenderer',
          baseUrl: 'javascript',
          jsCallback: function (rowIndex, columnIndex, value, item) {},
        },
      }); // 결재진행상태
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000002551'),
        dataField: 'safFacilChkTitle',
        width: '12%',
        style: 'center-align',
        renderer: {
          type: 'LinkRenderer',
          baseUrl: 'javascript',
          jsCallback: function (rowIndex, columnIndex, value, item) {},
        },
      }); // 점검명
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000002554'),
        dataField: 'chkStepNm',
        width: '8%',
        style: 'center-align',
      }); // 점검상태
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000002576'),
        dataField: 'safCheckTypeNm',
        width: '8%',
        style: 'center-align',
      }); // 점검종류
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000002578'),
        dataField: 'deptNm',
        width: '8%',
        style: 'center-align',
      }); // 점검주관부서
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000002549'),
        dataField: 'tdeptNm',
        width: '8%',
        style: 'center-align',
      }); // 점검대상부서
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000004852'),
        dataField: 'pdeptNm',
        width: '8%',
        style: 'center-align',
      }); // 점검수행부서
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000001596'),
        dataField: 'facilityNm',
        width: '8%',
        style: 'center-align',
      }); // 설비명
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000002040'),
        dataField: 'chkEndYnNm',
        width: '8%',
        style: 'center-align',
      }); // 완료여부
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000002355') /* 작성자 */,
        dataField: 'writerUserNm',
        width: '8%',
        style: 'center-align',
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000002352') /* 작성일 */,
        dataField: 'writerDt',
        width: '8%',
        style: 'center-align',
      });

      // 기간 Setting
      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        today,
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to = this.$comm.getCalculatedDate(
        today,
        '1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      // 점검완료여부
      this.chkEndYnItems.push({
        code: null,
        codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
      });
      this.chkEndYnItems.push({
        code: 'Y',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000002039'),
      });
      this.chkEndYnItems.push({
        code: 'N',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000003563'),
      });
      this.searchParam.period = [from, to];
      this.$comm.getComboItems('SAF_FACILITY_CHECK', true).then((_result) => {
        this.comboCheckTypeItems = _result;
      });
      this.$comm.getComboItems('SAF_CHK_STEP2', true).then((_result) => {
        this.checkStepCdItems = _result;
      });
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002539'),
          color: 'orange',
          btnClicked: 'btnNew',
          btnClickedError: 'btnClickedErrorCallback',
        }, //  점검계획 등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
          btnClickedError: 'btnClickedErrorCallback',
        }, // 검색
      ];

      this.getList(); // 설비점검결과 목록 조회
    },
    /** 설비점검결과 목록 조회 **/
    getList() {
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
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === null || data === undefined) return;
      this.getList();
    },
    cellClickHandler(event) {
      if (event.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(event);
      } else if (event.dataField === 'safFacilChkTitle') {
        this.openDetailPopup(event, false);
      } else return;
    },

    showApprProgressPopup(event) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: event.item.apprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openDetailPopup(event, isInsert) {
      this.popupOptions.target = () => import(`${'./facilChkPlanDetail.vue'}`);
      this.popupOptions.title = isInsert
        ? 'L0000001610' // 설비점검계획 등록
        : 'L0000001612'; // 설비점검계획 상세
      this.popupOptions.param = {
        safFacilChkNo: event ? event.item.safFacilChkNo : 0, // 설비점검번호
        stepStatus: '',
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },

    btnCreateFacilChkPlanOpenPopupClicked() {
      this.openDetailPopup();
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setTDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.tDeptSubYn = _result;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setPDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.pDeptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 335;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
