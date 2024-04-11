<!--
  목적 : 시설점검 - 시설점검일정 목록
  Detail : 시설점검일정 목록 화면으로 이미 등록된 일정을 선택하여 결과를 등록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000767"
            name="period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 시설점검종류 -->
          <y-select
            :width="8"
            :comboItems="comboCheckTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001765"
            name="comFacilityCheckCd"
            v-model="searchParam.comFacilityCheckCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 시설유형 -->
          <y-select
            :width="8"
            :comboItems="comboFacilityTypeItems"
            itemText="comFacilityTypeNm"
            itemValue="comFacilityTypeCd"
            ui="bootstrap"
            name="comFacilityTypeCd"
            label="L0000001747"
            v-model="searchParam.comFacilityTypeCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 진행상태 -->
          <y-select
            :width="8"
            :comboItems="stepStatusItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="stepStatus"
            label="L0000002779"
            v-model="searchParam.stepStatus"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 검색어, placeholder: 일정명, 시설명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            name="facilityNm"
            label="L0000000331"
            placeholder="L0000004291"
            v-model="searchParam.facilityNm"
          ></y-text>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검주관부서 -->
          <y-tree-dept
            type="search"
            label="L0000002578"
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
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검대상부서 -->
          <y-tree-dept
            type="search"
            label="L0000002549"
            :showAllDept="true"
            name="tgtDeptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.tgtDeptCd"
            :deptSubYn="searchParam.tgtDeptSubYn"
            @setDeptSubYn="setTgtDeptSubYn"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검수행부서 -->
          <y-tree-dept
            type="search"
            label="L0000004852"
            :showAllDept="true"
            name="pfmDeptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.pfmDeptCd"
            :deptSubYn="searchParam.pfmDeptSubYn"
            @setDeptSubYn="setPfmDeptSubYn"
          />
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
            :label="this.$comm.getLangSpecInfoLabel('L0000001763')"
            :useExcelExport="false"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            @cellClick="cellClickHandler"
            @btnNew="btnNew"
            @getList="getList"
          />
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'facility-inspection-schedule-list',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '', // 사업장
      period: [],
      comFacilityCheckCd: '', // 점검종류
      comFacilityTypeCd: null, // 시설유형코드
      facilityNm: '', // 시설명
      stepStatus: '', // 진행상태
      deptCd: null, // 점검주관부서
      pfmDeptCd: null, // 점검수행부서
      tgtDeptCd: null, // 점검대상부서
      deptSubYn: 'Y', // 하위부서여부 사용
      tgtDeptSubYn: 'Y', // 하위대상부서여부 사용
      pfmDeptSubYn: 'Y', // 하위수행부서여부 사용
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
    // facilityCheckResultValue: [],
    editable: false,
    comboCheckTypeItems: [], // 점검종류
    comboFacilityTypeItems: [], // 시설유형
    /* stepStatusItems: [
      { code: '', codeNm: '전체' }, // 전체
      { code: 'ING', codeNm: '진행중' }, // 진행중
      { code: 'CMPLT', codeNm: '점검완료' }, // 점검완료
    ], */
    stepStatusItems: [],
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
      // Url Setting
      this.searchUrl = selectConfig.saf.facilityInspection.schedules.list.url;

      this.searchParam.deptSubYn = 'Y';
      this.searchParam.tgtDeptSubYn = 'Y';
      this.searchParam.pfmDeptSubYn = 'Y';

      this.stepStatusItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'ING', codeNm: this.$comm.getLangSpecInfoLabel('L0000003642') }, // 진행중
        {
          code: 'CMPLT',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003643'),
        }, // 점검완료
      ];
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '130',
          style: 'center-align',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002576'), // 점검종류
          dataField: 'comFacilityCheckNm',
          width: '120',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002279'), // 일정명
          dataField: 'comFacilityCheckTitle',
          width: '180',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002543'), // 점검계획시작일
          dataField: 'comFacilityCheckPlanSymd',
          width: '130',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002544'), // 점검계획종료일
          dataField: 'comFacilityCheckPlanEymd',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002554'), // 점검상태
          dataField: 'stepStatusNm',
          width: '110',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000452'), // 결재진행상태
          dataField: 'apprRqstNm',
          width: '110',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002578'),
          dataField: 'deptNm',
          width: '110 ',
        }, // 점검주관부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002549'),
          dataField: 'tgtDeptNm',
          width: '110 ',
        }, // 점검대상부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004852'),
          dataField: 'pfmDeptNm',
          width: '110 ',
        }, // 점검수행부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001747'),
          dataField: 'comFacilityTypeNms',
          width: '110 ',
        }, // 시설유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '110',
          style: 'center-align',
        }, // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '120',
          style: 'center-align',
        }, // 작성일
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnNew',
          visible: this.editable,
        }, //  신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        }, //  검색
      ];

      // 기간 Setting
      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        today,
        '-2m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to = this.$comm.getCalculatedDate(
        today,
        '1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.period = [from, to];
      this.getComboItems('SAF_FACILITY_CHECK'); // 점검종류
      this.getComboFacilityTypeItems(); // 시설유형
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList(); // 시설점검결과 목록 조회
    },
    /**
     * 공통 마스터 정보 조회 (점검종류)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'SAF_FACILITY_CHECK') {
            this.comboCheckTypeItems = this.$_.clone(_result.data);
            this.comboCheckTypeItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 시설유형 조회
     */
    getComboFacilityTypeItems() {
      this.$http.url = selectConfig.baseInfo.safFacility.facilityType.list.url;
      this.$http.type = 'GET';
      // this.$http.param = {
      //   useYn: 'Y',
      // };
      this.$http.request(
        (_result) => {
          this.comboFacilityTypeItems = this.$_.clone(_result.data);
          this.comboFacilityTypeItems.splice(0, 0, {
            comFacilityTypeCd: null,
            comFacilityTypeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          // if (
          //   this.$_.findIndex(this.comboFacilityTypeItems, {
          //     code: this.searchParam.comFacilityTypeCd,
          //   }) === -1
          // ) {
          //   this.searchParam.comFacilityTypeCd = null;
          // }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /** 시설점검결과 목록 조회 **/
    getList() {
      this.$comm.reqHttp('GET', this.searchUrl, this.searchParam, (_result) => {
        // this.gridOptions.data = this.$_.clone(_result.data);
        this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        this.$comm.pushCookie(this.searchParam);
      });
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /**
     * showCheckResultPopup 호출
     * 월별 안전점검결과 목록에 점검명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    cellClickHandler(event) {
      if (event.dataField === 'apprRqstNm') {
        this.showApprProgressPopup(event);
      } else if (event.dataField === 'comFacilityCheckTitle') {
        this.openDetailPopup(event.item, false);
      } else return;
    },
    // tableLinkCheckTitleClicked(header, data) {
    //   if (header.name === 'apprRqstNm') {
    //     this.showApprProgressPopup(data);
    //   } else {
    //     this.openDetailPopup(data, false);
    //   }
    // },
    //  결재상태 조회

    showApprProgressPopup(event) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: event.item.apprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openDetailPopup(data, isInsert) {
      this.popupOptions.target = () =>
        import(`${'./facilityInspectionScheduleDetail.vue'}`);
      this.popupOptions.title = isInsert
        ? 'L0000001762' // 시설점검일정 등록
        : 'L0000001764'; // 시설점검일정 상세
      this.popupOptions.param = {
        comFacilityCheckNo: data.comFacilityCheckNo, // 시설점검마스터번호
        stepStatus: data.stepStatus,
        apprRqstCd: data.apprRqstCd,
        cnt: data.cnt,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /*
     * 해당 일정 결과 상세보는 팝업 open
     */
    btnNew() {
      const data = {
        comFacilityCheckNo: 0, // 시설점검마스터번호
        apprRqstCd: '',
        cnt: 0,
        stepStatus: '',
      };
      this.openDetailPopup(data, true);
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    // 하위대상부서 포함 조회 관련 함수 추가
    setTgtDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.tgtDeptSubYn = _result;
    },
    // 하위수행부서 포함 조회 관련 함수 추가
    setPfmDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.pfmDeptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 335;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
