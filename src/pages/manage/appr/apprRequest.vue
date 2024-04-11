<!--
  목적 : 공통 > 결재요청 문서
  Detail : 결재요청 문서 조회/결재 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 결재요청일 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000442"
            name="createPeriod"
            v-model="searchParam.createPeriod"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 결재진행단계 -->
          <y-select
            :width="8"
            :comboItems="bizApprStepItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000000451"
            name="bizApprStepCd"
            v-model="searchParam.bizApprStepCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000439"
            name="apprRqstNm"
            v-model="searchParam.apprRqstNm"
          ></y-text>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000438')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
          @cellDoubleClick="cellDoubleClickHandler"
          @openDetailPage="openDetailPage"
          @btnSearchClicked="btnSearchClickedCallback"
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
  name: 'appr-request',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          popupMode: false,
          popupName: '',
        };
      },
    },
  },
  data: () => ({
    searchParam: {
      createPeriod: [], // 결재요청일
      bizApprStepCd: '', // 완료여부
      apprUserId: '',
      apprRqstNm: '',
    },
    gridOptions: {
      name: 'apprRequest',
      header: [],
      data: [],
      height: '400',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '80%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    bizApprStepItems: [], // 완료여부
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
    if (this.popupParam.popupMode) {
      this.gridOptions.header.splice(1, 0, {
        headerText: this.$comm.getLangSpecInfoLabel('L0000000503'),
        dataField: 'constTitle',
        width: '250',
        renderer: {
          type: 'LinkRenderer',
          baseUrl: 'javascript',
          jsCallback: function (rowIndex, columnIndex, value, item) {},
        },
      });
    }
    this.resizeGrid();
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable || this.popupParam.popupMode;
      // Url Setting
      this.searchUrl = selectConfig.manage.appr.requestList.url;
      this.searchParam.apprUserId = this.$store.getters.token;

      this.$comm.getComboItems('COM_BIZ_APPR_STEP', true).then((_result) => {
        this.bizApprStepItems = _result;
      });

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000442'), // 결재요청일
          dataField: 'createDt',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001948'), // 업무명
          dataField: 'bizNm',
          width: '200',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000439'),
          dataField: 'apprRqstNm',
          width: '200',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 결재요청명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000451'), // 결재진행단계
          dataField: 'bizApprStepNm',
          width: '100',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000427'), // 결재부서
          dataField: 'apprUserDeptNm',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000448'),
          dataField: 'apprUserNm',
          width: '100',
          style: 'center-align',
        }, // 결재자
        // {
        //   text: 'L0000000444', // 결재위임자
        //   name: 'delegatorNm',
        //   width: '100px',
        //   align: 'center',
        // },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000428'), // 결재상태
          dataField: 'apprStepNm',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000447'),
          dataField: 'apprDt',
          width: '130px',
          style: 'center-align',
        }, // 결재일시
      ];

      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        today,
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      if (this.$route.params && !this.popupParam.popupMode) {
        if (this.$route.params.bizApprStepCd) {
          this.searchParam.bizApprStepCd = this.$route.params.bizApprStepCd;
        }
        if (this.$route.params.from) {
          from = this.$route.params.from;
          today = this.$route.params.to;
        }
      }
      this.searchParam.createPeriod = [from, today];

      this.setGridBtns();
      this.getList(); // 결재 할 목록 조회
    },
    setGridBtns() {
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'), // 신규등록
          color: 'orange',
          btnClicked: 'openDetailPage',
          visible: this.editable && this.popupParam.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), // 검색
          color: 'green',
          btnClicked: 'btnSearchClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'), // 선택
          color: 'orange',
          selectConst: 'selectConst',
          visible: this.popupParam.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), // 닫기
          btnClicked: 'closeConstPopup',
          visible: this.popupParam.popupMode,
        },
      ];
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      // click row
      if (this.popupParam.popupMode) {
        this.selectedValue = this.$_.clone(event.item);
      } else {
        this.selectRow = this.$_.clone(event.item);
      }
      if (event.dataField === 'apprRqstNm') {
        this.openDetailPage(event.item);
      }
    },
    cellDoubleClickHandler(event) {
      if (this.popupParam.popupMode) {
        this.closeConstPopup(event.item);
      }
    },
    openDetailPage(data) {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/apprRequestDetail.vue'}`);
      this.popupOptions.title = 'L0000000441'; // 결재요청상세
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizNo: data.apprBizNo,
        apprRqstNo: data.apprRqstNo,
        bizApprStepCd: data.bizApprStepCd,
      };
    },
    /** 결재 할 목록 검색 **/
    getList() {
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
    btnSearchClickedCallback() {
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
    /** end button 관련 이벤트 **/
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
