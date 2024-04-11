<!--
  목적 : 공통 > 결재 할 문서
  Detail : 결재 할 문서 조회/결재 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 알람방식 -->
          <y-select
            :width="8"
            :comboItems="alarmTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000001899"
            name="alarmType"
            v-model="searchParam.alarmType"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 알람명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            type="search"
            label="L0000001898"
            name="alarmNm"
            v-model="searchParam.alarmNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="useYnItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000001439"
            name="useYn"
            v-model="searchParam.useYn"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000004555')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
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
  name: 'alarm',
  props: {},
  data() {
    return {
      searchParam: {
        alarmType: '',
        alarmNm: '',
        useYn: 'Y',
      },
      gridOptions: {
        name: 'alarm',
        header: [],
        data: [],
        btns: [],
        height: 'auto',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '70%',
        top: '10px',
        closeCallback: null,
      },
      editable: false,
      alarmTypeItems: [],
      useYnItems: [],
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
    this.getList(); // 안전점검결과 목록 조회
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.manage.alarm.list.url;

      this.$comm.getComboItems('ALARM_TYPE', true).then((_result) => {
        this.alarmTypeItems = _result;
      });

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001898'), // 알람명
          dataField: 'alarmNm',
          width: '17%',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001899'), // 알람방식
          dataField: 'smsEmailYnNm',
          width: '17%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001900'), // 알람설명
          dataField: 'alarmDesk',
          width: '19%',
          // textCalculate: this.textCalculate,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'), // 사용여부
          dataField: 'useYnNm',
          width: '13%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000976'), // 등록자
          dataField: 'createUserNm',
          width: '17%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000973'), // 등록일
          dataField: 'createDt',
          width: '17%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClicked',
        },
      ];

      this.useYnItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
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
    textCalculate(row, name) {
      var text = row[name];
      if (text) {
        text = text.replace(/\n/g, '<br />');
      }
      return text;
    },
    /** button 관련 이벤트 **/
    /**
     * 검색박스 숨기기/보이기 처리 후 setGridSize 호출
     */
    btnSearchClicked() {
      this.getList();
    },
    cellClickHandler(event) {
      this.btnAdd(event);
    },
    btnAdd(event) {
      if (event === null || event === undefined) return;
      if (event.dataField === 'alarmNm') {
        this.popupOptions.target = () =>
          import(`${'@/pages/manage/alarm/alarmDetail.vue'}`);
        this.popupOptions.title = 'L0000004556'; // 알람등록
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
        this.popupOptions.param = {
          alarmNo: event.item ? event.item.alarmNo : 0,
        };
      }
    },
    btnPopupClickedCallback() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/alarm/alarmDetail.vue'}`);
      this.popupOptions.title = 'L0000004556'; // 알람등록
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.param = {
        alarmNo: event.item ? event.item.alarmNo : 0,
      };
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
