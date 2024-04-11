<!--
  목적 : 안전 > 안전관찰(BBS)
  Detail : 안전관찰 목록화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 기간(관찰일) -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000768"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 관찰공정 -->
          <y-tree-process
            type="search"
            label="L0000000593"
            :plantCd="searchParam.plantCd"
            :deptCd="searchParam.deptCd"
            v-model="searchParam.processCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 관찰부서 -->
          <y-tree-dept
            type="search"
            label="L0000000596"
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
          <!-- 작업명 -->
          <y-text
            :width="8"
            name="name"
            ui="bootstrap"
            label="L0000002389"
            v-model="searchParam.jobNm"
          ></y-text>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 진행상태 -->
          <y-select
            :width="8"
            :comboItems="stepCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002779"
            name="stepCd"
            v-model="searchParam.stepCd"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000498')"
          :useExcelExport="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableSorting="true"
          @cellClick="cellClickHandler"
          @btnNew="btnSearchCheckResultOpenPopupClicked"
          @btnSearch="getList"
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
  name: 'y-cto',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '',
      period: [],
      processCd: '', // 관찰공정
      deptCd: '', // 관찰부서
      jobNm: '', // 작업명
      stepCd: '',
      deptSubYn: 'Y', // 하위부서여부 사용
    },
    searchArea: {
      title: 'L0000000329', // 검색박스숨기기
      show: true,
    },
    YAuiGrid: null,
    gridOptions: {
      name: 'safCtoCto',
      header: [],
      data: [],
      height: '400',
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
    isInsert: false,
    isEdit: false,
    stepCdItems: [],
    searchUrl: '',
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
    this.getList(); // 안전점검결과 목록 조회
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.$comm.getComboItems('SAF_PROCESS_STEP', true).then((_result) => {
        this.stepCdItems = _result;
      });

      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.cto.list.url;
      this.searchParam.deptSubYn = 'Y';

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'),
          dataField: 'stepNm',
          width: '7%',
        }, // 진행상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000599'),
          dataField: 'ctoDt',
          width: '10%',
        }, // 관찰일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'jobNm',
          width: '16%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 작업명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000596'),
          dataField: 'deptNm',
          width: '10%',
        }, // 관찰부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000593'),
          dataField: 'processNm',
          width: '10%',
        }, // 관찰공정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002372'),
          dataField: 'workArea',
          width: '10%',
        }, // 작업구역
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000600'),
          dataField: 'userNm',
          width: '10%',
        }, // 관찰자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        } /* 작성자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        } /* 작성일 */,
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnNew',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
          visible: this.editable,
        }, //  검색
      ];

      // 기간 Setting
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
    /** 안전점검결과 목록 조회 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * showCheckResultPopup 호출
     * 월별 안전점검결과 목록에 점검명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    cellClickHandler(event) {
      if (event.dataField !== 'jobNm') return;

      this.showCheckResultPopup(event.item, false);
    },
    /**
     * 해당 계획 결과 상세보는 팝업 open
     */
    showCheckResultPopup(data, flag) {
      this.popupOptions.target = () => import(`${'./ctoDetail.vue'}`);
      this.popupOptions.title = flag ? 'L0000001848' : 'L0000004273'; // 안전관찰 등록 / 안전관찰
      this.popupOptions.param = {
        safCtoNo: data.safCtoNo, // cto번호
        stepCd: data.stepCd,
        createUserId: data.createUserId,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
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
    btnSearchCheckResultOpenPopupClicked() {
      const data = {
        safCtoNo: 0, // cto번호
        stepCd: '',
        createUserId: '',
      };
      this.showCheckResultPopup(data, true);
    },
    /** end button 관련 이벤트 **/

    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 335;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
