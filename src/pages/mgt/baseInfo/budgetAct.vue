<!--
  목적 : 경영>기준정보>예산분류별 계정 관리
  Detail : 예산분류별 계정 관리 조회화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 예산분류 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000005001"
            name="codeNm"
            v-model="searchParam.codeNm"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            label="L0000001439"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
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
              @btnClicked="openPopup"
            />
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           예산계정관리 
          <y-data-table
            class="mergeTable"
            label="L0000005002"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :span-options="gridOptions.merge"
            :use-paging="true"
            :rowClassName="tableRowClassName"
            @tableLinkClicked="tableLinkClicked"
          />
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005002')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getList="getList"
          @openPopup="openPopup"
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
  name: 'invest-item',
  props: {},
  data() {
    return {
      searchParam: {
        useYn: 'Y',
        codeNm: '',
      },
      gridOptions: {
        name: 'budgetAct',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
        merge: [],
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      useItems: [],
      editable: false,
      searchUrl: '',
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  /** methods **/
  methods: {
    tableRowClassName({ row, rowIndex }) {
      return 'odd-row';
    },
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.mgt.budgetAct.list.url;
      this.editable = this.$route.meta.editable;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005008'),
          dataField: 'code',
          width: '12%',
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005001'),
          dataField: 'codeNm',
          width: '12%',
          cellMerge: true,
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005004'),
          dataField: 'budgetClsNm',
          width: '12%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005003'),
          dataField: 'budgetActNm',
          width: '16%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '12%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '12%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '12%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '12%',
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
          btnClicked: 'getList',
        },
      ];
      // 사용여부
      this.useItems = [
        {
          code: null,
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
        } /* 전체 */,
        {
          code: 'Y',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001440'),
        } /* 사용 */,
        {
          code: 'N',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001063'),
        } /* 미사용 */,
      ];
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    // 검진 계획 그리드
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
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
    // 그리드 row click 이벤트
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.item === null || event.item === undefined) return;
      if (event.dataField !== 'codeNm') return;

      this.openPopup(event.item);
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;

      this.openPopup(data);
    },
    /**
     * 등록 팝업  호출
     */
    openPopup(data) {
      let popupTitle = data ? 'L0000005006' : 'L0000005006'; // L0000005006 : 예산계정 상세 / L0000005006 : 예산계정 등록
      this.popupOptions.target = () => import(`${'./budgetActDetail.vue'}`);
      this.popupOptions.title = popupTitle;
      this.popupOptions.visible = true;
      this.popupOptions.param = data ? data : {};
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /** Button Event **/
    // 팝업 닫기
    closePopupThis(data) {
      if (!data) {
        data = 'CLOSE';
      }
      // 부모창에 값 전달
      this.$emit('closePopup', data);
    },
    /** /Button Event **/
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
