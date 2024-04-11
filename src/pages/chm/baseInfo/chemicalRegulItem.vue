<!--
  목적 : 물질관리 > 기준정보 > 규제항목관리
  작성자 : kdh
  Detail : 규제항목관리 목록 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 규제법규 -->
          <y-select
            :width="8"
            :comboItems="regulLawCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000723"
            v-model="searchParam.regulLawCd"
            @datachange="
              (val) => {
                (searchParam.regulLawCd = val), getDataList();
              }
            "
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 규제항목명 -->
          <y-text
            :width="9"
            ui="bootstrap"
            label="L0000000731"
            name="regulItmNm"
            v-model="searchParam.regulItmNm"
            @datachange="
              (val) => {
                (searchParam.regulItmNm = val), getDataList();
              }
            "
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-switch
            :width="8"
            :editable="editable"
            true-value="Y"
            false-value="N"
            ui="bootstrap"
            label="L0000001439"
            name="radioValue"
            selectText="L0000001440"
            unselectText="L0000001063"
            v-model="searchParam.useYn"
            @input="
              (val) => {
                (searchParam.useYn = val), getDataList();
              }
            "
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
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           규제항목 목록 
          <y-data-table
            label="L0000000730"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @tableLinkClicked="tableLinkClicked"
            :excelDown="true"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000730')"
          :useExcelExport="false"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @btnSearchClickedCallback="btnSearchClickedCallback"
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
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-chemical-branch',
  props: {},
  data() {
    return {
      chemicalRegulItem: {
        regulLawCd: null,
        regulItmNm: '',
        regulItmCd: '',
        contents: '',
        sortOrder: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        regulOrgCd: null,
      },
      searchParam: {
        regulLawCd: null, // 규제법규
        regulItmNm: '', // 규제항목명
        useYn: 'Y',
      },
      gridOptions: {
        name: 'chemicalRegulItem',
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
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      updateMode: false,
      searchUrl: '',

      isInsert: false,
      isEdit: false,
      regulLawCdItems: [], // 규제법규 리스트 (조회)
      regulLawCdSaveItems: [], // 규제법규 리스트 (저장)
      regulOrgCdItems: [], // 기관
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
      this.searchUrl = selectConfig.chm.chemicalRegulItem.list.url;

      this.editable = this.$route.meta.editable;
      this.$comm.getComboItems('CHM_REGUL_LAW', true).then((_result) => {
        this.regulLawCdItems = _result; // 규제법규
      });
      this.$comm.getComboItems('CHM_REGUL_ORG', true).then((_result) => {
        this.regulOrgCdItems = _result; // 기관
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDataList(); // 규제항목 grid

      // 규제항목 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000725'),
          dataField: 'regulLawNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000731'),
          dataField: 'regulItmNm',
          width: '10%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000734'),
          dataField: 'regulItmCd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000773'),
          dataField: 'regulOrgNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001578'),
          dataField: 'contents',
          width: '20%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '10%',
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
    },
    // 규제항목 grid
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

    /** Button Event **/

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
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    cellClickHandler(event) {
      if (event.dataField !== 'regulItmNm') return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () =>
        import(`${'./chemicalRegulItemDetail.vue'}`);
      this.popupOptions.title = 'L0000000729'; // 규제항목
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () =>
        import(`${'./chemicalRegulItemDetail.vue'}`);
      this.popupOptions.title = 'L0000000729'; // 규제항목
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
        import(`${'./chemicalRegulItemDetail.vue'}`);
      this.popupOptions.title = 'L0000000729'; // 규제항목
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        regulItmNo: 0,
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
