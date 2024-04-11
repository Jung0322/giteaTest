<!--
  목적 : 첨부파일 설정 목록조회
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 첨부파일구분명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            type="search"
            label="L0000002849"
            name="taskClassNm"
            v-model="searchParam.taskClassNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 첨부파일구분설명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            type="search"
            label="L0000002850"
            name="taskClassDesc"
            v-model="searchParam.taskClassDesc"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002845')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @btnSearchClicked="btnSearchClicked"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'attach-setting',
  props: {},
  data: () => ({
    searchParam: {
      taskClassNm: '',
      taskClassDesc: '',
    },
    searchArea: {
      title: 'L0000000329', // 검색박스숨기기
      show: true,
    },
    gridOptions: {
      header: [],
      data: [],
      height: 'auto',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '80%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    searchUrl: '',
    YAuiGrid: null,
  }),
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
    this.getList();
  },
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
    // window.removeEventListener('resize', this.setGridSize);
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.manage.attachSetting.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002849'), // 첨부파일구분명
          dataField: 'taskClassNm',
          width: '150',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002850'), // 첨부파일구분설명
          dataField: 'taskClassDesc',
          width: '300',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003238'), // 허용확장자
          dataField: 'acceptExt',
          width: '250',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001942'), // 업로드가능파일수
          dataField: 'limitCnt',
          width: '100',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001943'), // 업로드가능파일크기(MB)
          dataField: 'limitSize',
          width: '100',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000109'), // Drag&Drop 가능여부
          dataField: 'dragDropYnNm',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001946'), // 업로드파일 다중선택 가능여부
          dataField: 'multipleSelYnNm',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001062'), // 미리보기여부
          dataField: 'previewYnNm',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001579'), // 설명작성가능여부
          dataField: 'pictureExplainYnNm',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001905'), // 암호화여부
          dataField: 'encryptYnNm',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'), // 사용여부
          dataField: 'useYnNm',
          width: '130',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002355') /* 작성자 */,
          dataField: 'writerUserNm',
          width: '120',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002352') /* 작성일 */,
          dataField: 'writerDt',
          width: '120',
          style: 'center-align',
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
          btnClicked: 'btnSearchClicked',
        },
      ];
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList(); // 결재 할 목록 조회

      // this.setGridSize(); // 그리드 사이즈 조절
    },
    /** 결재 할 목록 검색 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnPopupClickedCallback() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/attach/attachSettingDetail.vue'}`);
      this.popupOptions.title = 'L0000004551'; // 첨부파일설정 등록
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        taskClassNm: '',
      };
    },
    // },
    cellClickHandler(event) {
      if (event.item === null || event.item === undefined) return;
      if (event.dataField === 'taskClassNm') {
        this.popupOptions.target = () =>
          import(`${'@/pages/manage/attach/attachSettingDetail.vue'}`);
        this.popupOptions.title = 'L0000004552'; // 첨부파일설정 수정
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
        this.popupOptions.width = '80%';
        this.popupOptions.param = {
          taskClassNm: event.item.taskClassNm,
        };
      }
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },

    /** button 관련 이벤트 **/

    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchClicked() {
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 295;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
