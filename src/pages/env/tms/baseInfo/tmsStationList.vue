<!--
  목적 : 기준정보 측정소
  Detail : 배출구마다 측정하는 측정소를 지정하는 화면
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
          <!-- 측정소구분 -->
          <y-select
            :width="8"
            :comboItems="typeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002936"
            name="tmsType"
            v-model="searchParam.tmsType"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 측정소명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002937"
            name="stationName"
            v-model="searchParam.stationName"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000174')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked"
          @openPopup="openPopup"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
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
  name: 'y-tms-station',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '',
      tmsType: '',
    },
    gridOptions: {
      name: 'tmsStationList',
      header: [],
      data: [],
      btns: [],
      height: 400,
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '80%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    typeItems: [],
    editable: false,
    searchUrl: '',
    YAuiGrid: null,
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
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
      this.searchUrl = selectConfig.env.tms.baseInfo.tmsStation.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '150',
          style: 'center-align',
        } /* 사업장 */,
        { /* 배출시설명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001174'),
          dataField: 'facilityNm',
          width: '180',
          style: 'center-align',
        },
        { /* 배출구명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001147'),
          dataField: 'outletNm',
          width: '180',
          style: 'left-align grid-link-cell',
        },
        { /* 측정소코드 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002938'),
          dataField: 'stationCode',
          width: '180',
          style: 'center-align',
        },
        { /* 측정소명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002937'),
          dataField: 'stationName',
          width: '180',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'tmsTypeNm',
          width: '180',
          style: 'center-align',
        } /* 구분 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001624'),
          dataField: 'setupDay',
          width: '180',
          style: 'center-align',
        } /* 설치년도 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002623'),
          dataField: 'comp',
          width: '180',
          style: 'center-align',
        } /* 제작사 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001020'),
          dataField: 'model',
          width: '180',
          style: 'center-align',
        } /* 모델번호 */,
        { /* 정렬순서 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'dispOrder',
          width: '100',
          style: 'center-align',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '120',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '120',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openPopup',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];
      this.$comm.getComboItems('TMS_TYPE', true).then((_result) => {
        this.typeItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
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
     * 수정 팝업 호출
     */
    tableLinkClicked(data) {
      if (data === null || data === undefined) return;
      if (data.dataField === 'outletNm') {
        this.openPopup(data.item);
      }
    },
    /**
     * 등록 팝업  호출
     */
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./tmsStationDetail.vue'}`);
      this.popupOptions.title = data
        ? 'L0000000175'
        : 'L0000004500'; /*  'TMS 측정소 상세' : 'TMS 측정소 등록' */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        stationCode: data ? data.stationCode : 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnSearchClickedCallback(result) {
      this.getList();
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
