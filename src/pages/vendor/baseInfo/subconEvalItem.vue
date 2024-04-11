<!--
  목적 : 안전 > 기준정보 > 협력업체 평가 항목 관리
  작성자 : kdh
  Detail : 협력업체 평가 항목 관리 목록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.subconEvalPlantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 평가구분 -->
          <y-select
            :width="8"
            :comboItems="evalClsSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000003059"
            name="subconEvalClsSearchCd"
            v-model="searchParam.subconEvalClsCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 평가유형 -->
          <y-select
            :width="8"
            :comboItems="evalAttSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000003089"
            name="subconEvalAttSearchCd"
            v-model="searchParam.subconEvalAttCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 평가항목명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003099"
            name="subconEvalItemSearchNm"
            v-model="searchParam.subconEvalItemNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001439"
            name="useYn"
            v-model="searchParam.useYn"
          ></y-select>
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
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           협력업체 평가 항목 목록 
          <y-data-table
            label="L0000003261"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @tableLinkClicked="tableLinkClicked"
            :use-paging="true"
          ></y-data-table>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003261')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @btnSearchClickedCallback="btnSearchClickedCallback"
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
  name: 'y-subcon-eval-item',
  props: {},
  data() {
    return {
      subconEvalItem: {
        safSubconEvalItemNo: 0,
        subconEvalPlantCd: null,
        subconEvalPlantNm: '',
        subconEvalItemNm: '',
        subconEvalItemStnd: '',
        subconEvalItemPnt: 0,
        subconEvalClsCd: null,
        subconEvalAttCd: null,
        sortOrder: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      searchParam: {
        subconEvalPlantCd: null, // 사업장
        subconEvalClsCd: null, // 평가구분
        subconEvalItemNm: '', // 평가항목명
        subconEvalAttCd: null,
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
        name: 'subconEvalItem',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      editable: false,
      updateMode: false,
      searchUrl: '',

      isInsert: false,
      isEdit: false,
      evalClsSearchItems: [], // 평가구분 리스트 (조회)
      evalAttSearchItems: [], // 평가유형 리스트 (조회)
      evalClsItems: [], // 평가구분 리스트 (저장)
      evalAttItems: [], // 평가유형 리스트(저장)
      useItems: [],
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
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.vendor.baseInfo.subconEvalItem.list.url;

      this.editable = this.$route.meta.editable;

      this.$comm.getComboItems('SAF_SC_EVAL_CLS', true).then((_result) => {
        this.evalClsSearchItems = _result; // 평가구분
      });
      this.$comm.getComboItems('SAF_SC_EVAL_ATT', true).then((_result) => {
        this.evalAttSearchItems = _result; // 평가유형
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDataList(); // 협력업체 평가 항목 grid

      this.subconEvalItem.subconEvalClsCd = 'SCSC1';
      this.subconEvalItem.subconEvalAttCd = 'SCSA1';
      // 협력업체 평가 항목 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'subconEvalPlantNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003059'),
          dataField: 'subconEvalClsNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003089'),
          dataField: 'subconEvalAttNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003099'),
          dataField: 'subconEvalItemNm',
          width: '16%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003063'),
          dataField: 'subconEvalItemStnd',
          width: '16%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001137'),
          dataField: 'subconEvalItemPnt',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '7%',
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
          btnClicked: 'btnSearchClickedCallback',
        },
      ];
      this.useItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];
    },
    // 협력업체 평가 항목 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 395;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },

    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.dataField !== 'subconEvalItemNm') {
        return;
      }
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () =>
        import(`${'./subconEvalItemDetail.vue'}`);
      this.popupOptions.title = 'L0000003263';
      // 협력업체 평가 항목 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () =>
        import(`${'./subconEvalItemDetail.vue'}`);
      this.popupOptions.title = 'L0000003263';
      // 협력업체 평가 항목 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () =>
        import(`${'./subconEvalItemDetail.vue'}`);
      this.popupOptions.title = 'L0000003263';
      // 협력업체 평가 항목 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        safSubconEvalItemNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    /** /Button Event **/
  },
};
</script>
