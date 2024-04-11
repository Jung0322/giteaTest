<!--
  목적 : 기초정보 > 설비관리 > 설비유형별 세부항목
  Detail : 설비유형 조회 화면
  y-aui-grid 로 변경
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 설비유형 -->
          <y-tree-facility-type
            label="L0000001597"
            type="search"
            name="searchSafFacilityTypeCd"
            v-model="searchParam.safFacilityTypeCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 세부항목명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001646"
            name="safFacilityTypeItemNm"
            v-model="searchParam.safFacilityTypeItemNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->

    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001589')"
          :useExcelExport="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridSetSave="true"
          :showGridCtrl="true"
          :enableSorting="true"
          @cellClick="tableLinkClicked"
          @btnGetList="getList"
          @btnPopupClicked="btnPopupClickedCallback"
          @closePopup="closePopupUsage"
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
  name: 'y-facility-type-item',
  props: {},
  data: () => ({
    facilityTypeItem: {
      safFacilityTypeItemNo: '',
      safFacilityTypeCd: null,
      safFacilityTypeItemNm: '',
      safFacilityTypeItemExplain: '',
      sortOrder: 0,
      useYn: 'Y',
      safFacilityTypeNm: '',
      createUserId: '',
      updateUserId: '',
    },
    searchParam: {
      safFacilityTypeCd: '', // 설비유형
      safFacilityTypeItemNm: '', // 관리항목
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '90%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    gridOptions: {
      header: [],
      data: [],
      height: '480',
    },
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,

    searchUrl: '',
    searchDetailUrl: '',
    checkUrl: '',
    YAuiGrid: null,
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.mountedInit();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.baseInfo.facilityTypeItem.list.url;
      this.searchDetailUrl = selectConfig.baseInfo.facilityTypeItem.get.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001597'),
          dataField: 'safFacilityTypeNm',
          width: '180px',
          style: 'center',
        }, // 설비유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001646'),
          dataField: 'safFacilityTypeItemNm',
          width: '200px',
          style: 'left',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 세부항목명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002894'),
          dataField: 'safFacilityTypeItemExplain',
          width: '300px',
          style: 'left',
        }, // 추가설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '100px',
          style: 'center',
        }, // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '100px',
          style: 'center',
        }, // 정렬순서
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    mountedInit() {
      this.gridOptions.btn = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnGetList',
        }, // 검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClicked',
          visible: this.editable,
        }, // 신규등록
      ];

      this.YAuiGrid.setBtnArr(this.gridOptions.btn);
    },
    // 그리드 조회
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
    /**
     * 수정 팝업 호출
     */

    tableLinkClicked(event) {
      if (
        event === null ||
        event === undefined ||
        event.dataField !== 'safFacilityTypeItemNm'
      ) {
        return;
      }

      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () =>
        import(`${'./facilityTypeItemDetail.vue'}`);
      this.popupOptions.title = 'L0000001591';
      // 설비 유형별 세부항목 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () =>
        import(`${'./facilityTypeItemDetail.vue'}`);
      this.popupOptions.title = 'L0000001591';
      // 설비 유형별 세부항목 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        safFacilityTypeItemNo: '',
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    btnClickedErrorCallback(result) {
      window.getApp.$emit('APP_REQUEST_ERROR', result);
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
