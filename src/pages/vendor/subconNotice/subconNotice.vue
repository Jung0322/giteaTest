<!--
  목적 : 협력업체관리 > 협력업체 게시판
  작성자 : kdh
  Detail : 협력업체 게시판 목록/등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row v-on:keyup.enter="btnSearchClickedCallback" slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 등록사업장 -->
          <y-plant
            label="L0000000972" 
            type="search"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 분류 -->
          <y-select
            :width="8"
            :comboItems="searchKindCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="kindCd"
            label="L0000001341"
            v-model="searchParam.kindCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 기간(등록일) -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000769"
            name="searchPeriod"
            default="searchParam.searchPeriod"
            v-model="searchParam.searchPeriod"
          />
        </b-col>
        <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
          <!-- 제목 -->
          <y-text
            :width="10"
            :clearable="true"
            ui="bootstrap"
            name="title"
            label="L0000002616"
            v-model="searchParam.title"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row ref="searchBox">
      <b-col v-if="searchArea.show" sm="12">
        <b-card header-class="default-card" body-class="default-body-card" class="py-0">
          <div slot="header">
            <div class="float-left">
              <y-label label="검색" />
            </div>
            <div class="float-right">
            </div>
          </div>
          <b-row v-on:keyup.enter="btnSearchClickedCallback">
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant label="등록사업장" type="search" v-model="searchParam.plantCd" />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="searchKindCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="kindCd"
                label="분류"
                v-model="searchParam.kindCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-datepicker
                :width="8"
                :range="true"
                label="기간(등록일)"
                name="searchPeriod"
                default="searchParam.searchPeriod"
                v-model="searchParam.searchPeriod"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :width="10"
                :clearable="true"
                ui="bootstrap"
                name="title"
                label="제목"
                v-model="searchParam.title"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>-->

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 -
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="openPopupView"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           협력업체 게시물 목록 
          <y-data-table
            label="L0000003247"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            excelDown="true"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003247')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @openPopupView="openPopupView"
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
  name: 'y-subcon-notice',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return { boardNo: [], popupMode: false };
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      boardNo: '',
      searchParam: {
        plantCd: '',
        searchPeriod: [],
        kindCd: '',
        title: '',
      },
      gridOptions: {
        name: 'subconNotice',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      loginUserId: '',
      editable: false,
      updateMode: false,
      searchUrl: '',
      detailUrl: '',
      isInsert: false,
      isEdit: false,
      popupStartEndYmd: [],
      searchKindCdItems: [],
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
  beforeDestroy() {
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.vendor.subconNotice.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '15%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001341'), 
          dataField: 'kindNm', 
          width: '15%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002616'), 
          dataField: 'title', 
          width: '50%',    
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },             
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
          btnClicked: 'openPopupView'
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green',
          btnClicked: 'btnSearchClickedCallback'
        },
      ]
      // 기간 Setting
      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        today,
        '-3m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to = this.$comm.moment(this.$comm.getToday()).format('YYYY-MM-DD');
      this.searchParam.searchPeriod = [from, to];
      // 분류
      this.$comm.getComboItems('COM_VEN_BOARD_ATT', true).then(_result => {
        this.searchKindCdItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getDataList();
    },
    /**
     * 공통 마스터 정보 조회 (업체분류)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    // 게시판 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data))
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /validation checking **/

    /** Button Event **/

    // 검색
    resizeGrid() {
      let _height = window.innerHeight - 395;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
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
    cellClickHandler(event) {
      if (event.dataField !== 'title') return;
      this.popupOptions.target = () =>
        import(`${'./subconNoticeDetailView.vue'}`);
      this.popupOptions.title = 'L0000003248'; /* 협력업체 게시물 상세 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '20px';
      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.param = {
        boardNo: event.item.boardNo,
      };      
    },
    tableLinkClicked(header, row) {
      this.popupOptions.target = () =>
        import(`${'./subconNoticeDetailView.vue'}`);
      this.popupOptions.title = 'L0000003248'; /* 협력업체 게시물 상세 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '20px';
      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.param = {
        boardNo: row.boardNo,
      };
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getDataList();
    },
    openPopupView(data) {
      this.popupOptions.target = () =>
        import(`${'./subconNoticeDetailView.vue'}`);
      this.popupOptions.title = 'L0000004506'; // 협력업체 게시물 등록
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '20px';
      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.param = {
        boardNo: 0,
      };
    },
  },
};
</script>
