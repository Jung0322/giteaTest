<!--
  목적 : 부서무재해목록
  작성자 : ksw
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 부서 -->
          <y-tree-dept
            type="search"
            label="L0000001287"
            name="deptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 무재해 목록 grid -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001291')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
          @openNewPage="openNewPage"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'dept-no-accident-result',
  props: {},
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      searchParam: {
        plantCd: null,
        deptCd: null,
        searchFlag: 'LIST',
        deptSubYn: 'Y', // 하위부서여부 사용
      },
      noAccident: {
        safNoAccidentDeptNo: 0,
        startYmd: '',
        endSchYmd: '',
        mhUseYn: '',
        targetMh: 0,
        initMh: 0,
        normMh: 0,
        holiMh: 0,
        dayMancntCpy: 0,
        dayMancntCon: 0,
        dayUseYn: 0,
        targetDays: 0,
        initDays: 0,
        normalDays: 0,
        holiDays: 0,
        remark: '',
        useYn: '',
        createUserId: '',
        createDt: '',
        updateUserId: '',
        updateDt: '',
        totalMh: 0,
        totalDays: 0,
        progressMh: 0,
        byDateMh: '',
        noAccidentDays: 0,
        byDefaultDays: '',
        noaccStypeCd: '',
        noaccStypeNm: '',
        noaccStypeYmd: '',
      },
      gridOptions: {
        name: 'deptNoAccident',
        header: [],
        data: [],
        btns: [],
        height: 'auto',
      },
      YAuiGrid: null,
      searchOptions: [],
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      baseWidth: 8,
      editable: true,
      searchUrl: '',
      isSubmit: false, // 버튼을 submit 할 것인지 판단하는 변수로써 버튼의 개수만큼 필요합니다.
      isInsert: false,
      plantItems: [],
    };
  },
  watch: {},
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.deptNoAccidentResult.list.url;
      this.editable = this.$route.meta.editable;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      var today = this.$comm.getToday();
      var from = null; // this.$comm.getCalculatedDate(  today, '-1y', 'YYYY-MM-DD', 'YYYY-MM-DD' );
      var to = null; // this.$comm.getCalculatedDate(  today,   '1y', 'YYYY-MM-DD',   'YYYY-MM-DD' );
      this.searchParam.duration = [from, to];
      this.getDataList();

      // 부서 무재해 결과 목록 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001290'),
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
              dataField: 'plantNm',
              width: '110',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
              dataField: 'deptNm',
              width: '110',
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002233'),
              dataField: 'dayMancntSum',
              width: '110',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001778'),
              dataField: 'startYmd',
              width: '110',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
              dataField: 'remark',
              width: '110',
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000792'),
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001029'),
              dataField: 'multiple',
              width: '110',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000788'),
              dataField: 'stndDays',
              width: '110',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003242'),
              dataField: 'mulTotalDays',
              width: '110',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001031'),
              dataField: 'targetDays',
              width: '110',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002778'),
              dataField: 'progressDays',
              width: '110',
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '110',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '110',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openNewPage',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    getDataList() {
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

    /** /초기화 관련 함수 **/

    /** Call API service
     * Naming Rule: get, post, put 등의 RESTFul verb를 접두사로 사용하고 그 뒤에 관련 모델명을 Camel case로 추가하세요.
     * Naming Rule: get의 경우 복수의 데이터조회(리스트 데이터 등)시에는 복수를 나타내는 접미사 "s"를 붙여주세요.
     * ex) getExamData () {}
     * ex) getExamDatas () {}
     */
    resizeGrid() {
      let _height = window.innerHeight - 300;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    openNewPage() {
      this.popupOptions.target = () =>
        import(`${'./createDeptNoAccident.vue'}`);
      this.popupOptions.title = 'L0000003622'; /* 부서 무재해 등록 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '90%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safNoAccidentDeptNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    cellClickHandler(event) {
      if (
        event.item === null ||
        event.item === undefined ||
        event.dataField !== 'deptNm'
      ) {
        return;
      }

      this.popupOptions.top = '10px';
      this.popupOptions.width = '90%';
      this.popupOptions.target = () =>
        import(`${'./createDeptNoAccident.vue'}`);
      this.popupOptions.title = 'L0000003621'; /* 부서무재해 등록/수정 */
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 수정 팝업 호출
     */
    selectedRow(data) {
      if (data === null) return;
      this.noAccident = data;
    },
    /** /Call API service **/

    /** validation checking(필요없으면 지워주세요) **/
    checkValidation() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isSubmit = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isSubmit) {
            window.getApp.emit(
              'APP_VALID_ERROR',
              'M0000000876'
              /* 유효성 검사도중 에러가 발생하였습니다. */
            );
          }
        })
        .catch(() => {
          this.isSubmit = false;
        });
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    /** /validation checking **/

    /** Component Events, Callbacks (버튼 제외) **/

    /** /Component, Callbacks (버튼 제외) **/

    /** Button Event **/
    // 검색
    btnSearchClickedCallback(result) {
      this.getDataList();
      // this.isInsert = false;
      // this.gridOptions.data = this.$_.clone(result.data);
    },
    /**
     * 저장 버튼 처리용 샘플함수
     */
    btnSaveClickedCallback(_result) {
      this.isSubmit = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      // TODO : 여기에 추가 로직 삽입(로직 삽입시 지워주세요)
      window.getApp.emit(
        'APP_REQUEST_SUCCESS',
        'M0000000006'
      ); /* 저장되었습니다. */
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isSubmit = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      // TODO : 여기에 추가 로직 삽입(로직 삽입시 지워주세요)
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/
    btnPopupClickedCallback() {
      this.popupOptions.target = () =>
        import(`${'./createDeptNoAccident.vue'}`);
      this.popupOptions.title = 'L0000003622'; /* 부서 무재해 등록 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '90%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safNoAccidentDeptNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    // 신규등록 팝업 닫기
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      // this.getDataList();
    },
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
  },
};
</script>
