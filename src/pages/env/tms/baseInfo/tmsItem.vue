<!--
  목적 : 안전점검 - 안전 점검 종류
  Detail : 안전점검 점검항목 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 구분 -->
          <y-select
            :width="8"
            :comboItems="typeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000686"
            name="tmsType"
            v-model="searchParam.tmsType"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 측정항목 -->
          <y-text
            :width="8"
            ui="bootstrap"
            type="search"
            label="L0000002963"
            name="itemName"
            v-model="searchParam.itemName"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- TMS 측정항목 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000182')"
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
import YText from '../../../../components/YText.vue';
export default {
  /* attributes: name, components, props, data */
  name: 'y-tms-item',
  components: { YText },
  props: {},
  data: () => ({
    searchParam: {
      tmsType: '',
      itemName: '',
    },
    gridOptions: {
      name: 'tmsItem',
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
    editable: false,
    searchUrl: '',
    deleteUrl: '',
    itemItems: [],
    typeItems: [],
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
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
    window.removeEventListener('resize', this.setGridSize);
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.env.tms.baseInfo.tmsItem.list.url;

      this.$comm.getComboItems('TMS_TYPE', true).then((_result) => {
        this.typeItems = _result;
      });

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'tmsTypeNm',
          width: '12%',
          style: 'center-align',
        } /* 구분 */,
        {
          /* 항목코드 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003212'),
          dataField: 'itemCode',
          width: '13%',
          style: 'center-align',
        },
        {
          /* 항목명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003205'),
          dataField: 'itemName',
          width: '15%',
          style: 'left-align grid-link-cell',
        },
        {
          /* 단위 */ headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'unit',
          width: '12%',
          style: '13-align',
        },
        {
          /* 변환팩터 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001244'),
          dataField: 'convFactor',
          width: '13%',
          style: 'center-align',
        },
        {
          /* 정렬순서 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'dispOrder',
          width: '12%',
          style: 'center-align',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '12%',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '12%',
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

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
      this.setGridSize();
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
      if (data.dataField === 'itemName') {
        this.openPopup(data.item);
      }
    },
    /**
     * 등록 팝업  호출
     */
    openPopup(data) {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./tmsItemDetail.vue'}`);
      this.popupOptions.title = data
        ? 'L0000000183' /* TMS 측정항목 상세 */
        : 'L0000004501'; /* TMS 측정항목 등록 */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        itemCode: data ? data.itemCode : 0,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnSearchClickedCallback(result) {
      this.getList();
    },
    /**
     * 그리드 리사이징
     */
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
