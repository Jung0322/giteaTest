<!--
  목적 : 검진 기준정보 - 검진기관
  Detail : 검진기관 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 검진기관명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000362"
            name="heaCheckupOrgNm"
            v-model="searchParam.heaCheckupOrgNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
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
            - 검색 
            <y-btn
              :action-url="searchUrl"
              :param="searchParam"
              title="L0000000327"
              color="green"
              action-type="get"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           검진기관 목록 
          <y-data-table
            ref="dataTable"
            :editable="editable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :print="true"
            :use-paging="true"
            :useRownum="false"
            label="L0000000359"
            @tableLinkClicked="tableLinkClicked"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000359')"
          :useExcelExport="false"
          :enableCellMerge="true"
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
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-checkup-org',
  props: {
    paneName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      checkupOrgan: {
        heaCheckupOrgNo: '',
        heaCheckupOrgNm: '',
        address: '',
        businessNo: '',
        telNo: '',
        chargerNm: '',
        email: '',
        sortOrder: '',
        useYn: 'Y',
        updateUserId: '',
        createUserId: '',
      },
      searchParam: {
        heaCheckupOrgNm: '',
      },
      searchArea: {
        title: 'L0000000329', // '검색박스숨기기',
        show: true,
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
        name: 'checkUpOrgHea',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      baseWidth: 9,
      editable: false,
      updateMode: false,
      isInsert: false,
      isEdit: false,

      duplHeaCheckupOrgNms: [], // 중복확인용 검진기관명 배열
    };
  },
  computed: {},
  watch: {
    // 해당 tab 들어올 때마다 그리드 사이즈 조정
    paneName() {
      // this.setGridSize();
    },
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
    // 윈도우 resize event
    // window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
    // window.removeEventListener('resize', this.setGridSize);
  },
  destroyed() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // URL setting
      this.searchUrl = selectConfig.hea.checkupOrg.list.url;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000363'),
          dataField: 'heaCheckupOrgNo',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000362'),
          dataField: 'heaCheckupOrgNm',
          width: '15%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002717'),
          dataField: 'address',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001414'),
          dataField: 'businessNo',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000892'),
          dataField: 'chargerNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002528'),
          dataField: 'telNo',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000110'),
          dataField: 'email',
          width: '10%',
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
          btnClicked: 'getList',
        },
      ];
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList(); // 검진기관 목록 조회
      // this.setGridSize(); // 그리드 사이즈 조절
    },

    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.dataField !== 'heaCheckupOrgNm') return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./checkupOrgDetail.vue'}`);
      this.popupOptions.title = 'L0000000361'; // 검진기관 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./checkupOrgDetail.vue'}`);
      this.popupOptions.title = 'L0000000361'; // 검진기관 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./checkupOrgDetail.vue'}`);
      this.popupOptions.title = 'L0000000361'; // 검진기관 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        heaCheckupOrgNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    resizeGrid() {
      let _height = window.innerHeight - 300;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    /** 검진기관 목록 조회 **/
    getList() {
      this.$http.url = selectConfig.hea.checkupOrg.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.$comm.pushCookie(this.searchParam);
          this.YAuiGrid.setGridData(this.gridOptions.data);

          if (!this.searchParam.heaCheckupOrgNm) {
            this.duplHeaCheckupOrgNms = this.$_.map(
              this.gridOptions.data,
              'heaCheckupOrgNm'
            );
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /** button 관련 이벤트 **/

    btnSearchClickedCallback(result) {
      this.isInsert = false;
      this.gridOptions.data = this.$_.clone(result.data);
      // window.getApp.$emit('APP_REQUEST_SUCCESS', '조회 버튼이 클릭되었습니다.');
    },

    /**
     * 수정 버튼 안보여지도록 처리 및 isSubmit false 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.$emit('APP_REQUEST_ERROR', _result);
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
      // window.alert("ERROR.. 담당자에게 연락바랍니다.");
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
