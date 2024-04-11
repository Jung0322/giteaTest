<!--
  목적 : 안전점검 관리 - 안전점검계획 목록
  Detail : 안전점검계획 목록 화면으로 이미 등록된 계획을 조회하여 삭제하거나,  등록창을 띄워 신규 계획을  등록할 수 있음.
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
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
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검종류 상세 -->
          <y-select
            :width="8"
            :comboItems="comboCheckKindItems"
            itemText="safCheckKindNm"
            itemValue="safCheckKindNo"
            ui="bootstrap"
            name="safCheckKindNo"
            label="L0000003718"
            v-model="searchParam.safCheckKindNo"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
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
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검대상부서 -->
          <y-tree-dept
            type="search"
            label="L0000002549"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.tgtDeptCd"
            :deptSubYn="searchParam.tgtDeptSubYn"
            @setDeptSubYn="setTgtDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검수행부서 -->
          <y-tree-dept
            type="search"
            label="L0000004852"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.pfmDeptCd"
            :deptSubYn="searchParam.pfmDeptSubYn"
            @setDeptSubYn="setPfmDeptSubYn"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검상태 -->
          <y-select
            :width="8"
            :comboItems="comboCheckStepItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="checkStepCd"
            label="L0000002777"
            v-model="searchParam.checkStepCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검(일정)명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000331"
            :placeholder="keywordHint"
            name="keyword"
            v-model="searchParam.keyword"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <!-- <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
              무일정계획등록 
            <y-btn
              v-if="editable"
              title="L0000001036"
              color="orange"
              @btnClicked="addNoSchedule"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
            안전점검계획 목록  
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="editable"
            :print="true"
            :use-paging="true"
            @tableLinkClicked="tableLinkCheckTitleClicked"
            label="L0000001879"
          ></y-data-table>
        </b-col> -->
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001879')"
            :useExcelExport="false"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            @cellClick="cellClickHandler"
            @addNoSchedule="addNoSchedule"
            @btnSearchClickedCallback="btnSearchClickedCallback"
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
  name: 'y-check-result',
  props: {},
  data: () => ({
    searchParam: {
      period: [],
      startDate: '',
      endDate: '',
      tgtDeptCd: '', // 대상부서코드
      deptCd: '', // 주관부서코드
      safCheckKindNo: '', // 점검종류번호
      plantCd: '', // 사업장 코드
      checkStepCd: '', // 점검진행상태
      keyword: '', // 검색어
      deptSubYn: 'Y', // 하위부서여부 사용
      tgtDeptSubYn: 'Y', // 하위부서여부 사용
      pfmDeptCd: '', // 수행부서코드
      pfmDeptSubYn: 'Y', // 하위부서여부 사용
    },
    gridOptions: {
      name: 'checkResultPlanList',
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
    // checkResultValue: [],
    baseWidth: 9,
    editable: false,
    isInsert: false,
    isEdit: false,
    comboCheckKindItems: [], // 점검종류
    comboDeptItems: [], // 주관부서
    comboTgtDeptItems: [], // 대상부서
    comboCheckStepItems: [], // 진행단계
    searchUrl: '',
    keywordHint: '',
    YAuiGrid: null,
  }),
  watch: {
    'searchParam.plantCd'() {
      this.getComboCheckKindItems();
    },
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
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.checkPlan.list.url;

      this.searchParam.deptSubYn = 'Y';
      this.searchParam.tgtDeptSubYn = 'Y';
      this.searchParam.pfmDeptSubYn = 'Y';

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '120',
          style: 'center-align',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002535'),
          dataField: 'checkMasterTitle',
          width: '150px',
          style: 'left-align',
        }, // 점검(일정)명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001642'),
          dataField: 'checkTitle',
          width: '200',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 세부점검계획
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003718'),
          dataField: 'safCheckKindNm',
          width: '250',
          style: 'left-align',
        }, // 점검종류 상세
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002777'),
          dataField: 'checkStepNm',
          width: '110',
          style: 'center-align',
        }, // 진행단계
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002564'),
          dataField: 'checkSchYmd',
          width: '120',
          style: 'center-align',
        }, // 점검예정일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'),
          dataField: 'tgtDeptNm',
          width: '130',
        }, // 대상부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'),
          dataField: 'deptNm',
          width: '130',
        }, // 주관부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004852'),
          dataField: 'pfmDeptNm',
          width: '130',
        }, // 수행부서
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002355') /* 작성자 */,
          dataField: 'writerUserNm',
          width: '120',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002352') /* 작성일 */,
          dataField: 'writerDt',
          width: '110',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001036'),
          color: 'orange',
          btnClicked: 'addNoSchedule',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
          visible: this.editable,
        }, //  검색
      ];

      // 진행단계
      this.comboCheckStepItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        {
          code: 'CHS01',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000004069'),
        }, // 계획작성중
        {
          code: 'CHS02',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003478'),
        }, // 계획완료
      ];
      this.searchParam.checkStepCd = 'CHS01';

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

      this.searchParam.period = [from, to];

      this.keywordHint =
        this.$comm.getLangSpecInfoLabel('L0000002535') + // 점검(일정)명
        ', ' +
        this.$comm.getLangSpecInfoLabel('L0000001642'); // 세부점검계획

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList(); // 안전점검결과 목록 조회
    },
    /**
     * 점검종류 조회
     */
    getComboCheckKindItems() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        planUseYn: 'Y',
        useYn: 'Y',
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.comboCheckKindItems = this.$_.clone(_result.data);
          this.comboCheckKindItems.splice(0, 0, {
            safCheckKindNo: '',
            safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          });

          if (
            this.$_.findIndex(this.comboCheckKindItems, {
              safCheckKindNo: this.searchParam.safCheckKindNo,
            }) === -1
          ) {
            this.searchParam.safCheckKindNo = '';
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 안전점검결과 목록 조회 **/
    getList() {
      this.searchParam.startDate = this.$_.clone(this.searchParam.period[0]);
      this.searchParam.endDate = this.$_.clone(this.searchParam.period[1]);
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
    tableLinkCheckTitleClicked(header, data) {
      this.popupOptions.target = () =>
        import(`${'./checkResultPlanDetail.vue'}`);
      this.popupOptions.title = 'L0000002565'; // 점검예정일별 점검계획
      this.popupOptions.param = {
        safCheckScheduleNo: data.safCheckScheduleNo, // 안전점검일정 일련번호
        checkStepCd: data.checkStepCd,
        // bizApprStepCd: data.bizApprStepCd, // 결재진행상태
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },

    cellClickHandler(event) {
      if (event.dataField !== 'checkTitle') return;

      this.showCheckResultPopup(event.item, false);
    },

    showCheckResultPopup(data, flag) {
      this.popupOptions.target = () =>
        import(`${'./checkResultPlanDetail.vue'}`);
      this.popupOptions.title = 'L0000002565'; // 점검예정일별 점검계획
      this.popupOptions.param = {
        safCheckScheduleNo: data.safCheckScheduleNo, // 안전점검일정 일련번호
        checkStepCd: data.checkStepCd,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },

    /** button 관련 이벤트 **/

    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchClickedCallback() {
      this.getList();
    },
    /**
     * 2020-02-08
     *  무일정등록 추가 kdh
     *  method는 담당하는 개발자가 틀리기에 혹시 모를 위험을 방지하고자 분리
     */
    addNoSchedule() {
      this.popupOptions.target = () =>
        import(`${'./checkResultPlanDetail.vue'}`);
      this.popupOptions.title = 'L0000002565'; // 점검예정일별 점검계획
      this.popupOptions.param = {
        safCheckScheduleNo: 0, // 안전점검일정 일련번호
        checkStepCd: 'CHS01',
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setTgtDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.tgtDeptSubYn = _result;
    },

    setPfmDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.pfmDeptSubYn = _result;
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
