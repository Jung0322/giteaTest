<!--
  목적 : 경영>기준정보>투자항목관리
  Detail : 투자항목관리 검색 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 투자분류 -->
          <y-text
            :width="8"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000004226"
            name="codeNm"
            v-model="searchParam.codeNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
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
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getList"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           투자항목관리
          <y-data-table
            label="L0000004261"
            ref="dataTable"
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
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004261')"
          :useExcelExport="false"
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
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'invest-item',
  props: {},
  data() {
    return {
      searchParam: {
        mgtMgInfoItmNo: '',
        useYn: 'Y',
        codeNm: '',
      },
      gridOptions: {
        name: 'investItem',
        btns: [],
        header: [],
        data: [],
        height: '600',
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
      isDelete: false,
      selectedValue: [],
      deleteValue: null,
      selectAuditItem: null,
      infoItmAttCdItems: [], // 투자분류 목록
      mgInfoItms: [], // 투자항목 목록
    };
  },
  watch: {
    'searchParam.infoItmAttCd': function (newVal, oldVal) {
      if (this.searchParam.infoItmAttCd) {
        this.getInfoItmAttCdItems(this.searchParam.infoItmAttCd);
        this.searchParam.mgtMgInfoItmNo = '';
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.mgt.investItem.list.url;
      this.editable = this.$route.meta.editable;

      // 공통코드 조회
      // this.getCommonCodeList('MICS3');

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002969'),
          dataField: 'code',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004226'),
          dataField: 'codeNm',
          width: '32%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
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
      if (event.dataField !== 'codeNm') return;
      this.popupOptions.target = () => import(`${'./investItemDetailNew.vue'}`);
      this.popupOptions.title = 'L0000004259'; // 투자항목 상세
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        codeNm: event.item.codeNm,
        codeGroupCd: event.item.codeGroupCd,
        code: event.item.code,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = () => import(`${'./investItemDetailNew.vue'}`);
      this.popupOptions.title = 'L0000004259'; // 투자항목 상세
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        codeNm: data.codeNm,
        codeGroupCd: data.codeGroupCd,
        code: data.code,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업  호출
     */
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./investItemDetailNew.vue'}`);
      this.popupOptions.title = 'L0000004260'; // 투자항목 등록
      this.popupOptions.visible = true;
      this.popupOptions.param = {};
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /** Button Event **/
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSelectAuditItem() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000702' /* 감사범위 목록에서 한 행 이상 선택하세요. */,
          type: 'warning',
        });
      } else {
        this.closePopupThis(this.selectedValue);
      }
    },
    // 팝업 닫기
    closePopupThis(data) {
      if (!data) {
        data = 'CLOSE';
      }
      // 부모창에 값 전달
      this.$emit('closePopup', data);
    },
    /** /Button Event **/
  },
};
</script>
