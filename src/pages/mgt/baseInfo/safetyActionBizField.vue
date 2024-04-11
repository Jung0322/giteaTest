<!--
  목적 : 경영 > 기준정보 > SHE 목표분야 분야관리
  작성자 : yyu.winscore
  Detail : KPI 분야 관리 조회화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 분야명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001346"
            name="codeNm"
            v-model="searchParam.codeNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            label="L0000001439"
            ui="bootstrap"
            name="useYn"
            v-model="searchParam.useYn"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           KPI 분야관리
          <y-data-table
            ref="dataTable"
            label="L0000004266"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
          />
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004266')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getList="getList"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @cellClick="cellClickHandler"
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
  name: 'safety-action-biz-field',
  props: {},
  data() {
    return {
      searchParam: {
        codeNm: '',
        useYn: 'Y',
        // forSystemYn: 'Y',
      },
      gridOptions: {
        name: 'safetyActionBizField',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      useItems: [],
      editable: false,
      searchUrl: '',
    };
  },
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
  },
  beforeDestroy() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.mgt.safetyActionBizField.list.url;

      this.useItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002969'),
          dataField: 'code',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001346'),
          dataField: 'codeNm',
          width: '40%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
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
          btnClicked: 'getList',
        },
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
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField !== 'codeNm') return;
      this.popupOptions.target = () =>
        import(`${'./safetyActionBizFieldDetail.vue'}`);
      this.popupOptions.title = 'L0000004267'; // KPI분야관리 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 수정 팝업 호출
     */
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = () =>
        import(`${'./safetyActionBizFieldDetail.vue'}`);
      this.popupOptions.title = 'L0000004267'; // KPI분야관리 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업 호출
     */
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    btnPopupClickedCallback(data) {
      this.popupOptions.target = () =>
        import(`${'./safetyActionBizFieldDetail.vue'}`);
      this.popupOptions.title = 'L0000004267'; // KPI분야관리 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        code: '',
        chkGrid: this.YAuiGrid.getGridData(),
      };
      data = this.popupOptions.param;
      // console.log(data);
      this.popupOptions.closeCallback = this.closePopupUsage;
    },

    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
  },
};
</script>
