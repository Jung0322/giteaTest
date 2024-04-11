<!--
  목적 : 위험성평가 > 기준정보 > 위험Matrix 관리
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 위험Matrix명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            name="assessNm"
            label="L0000002120"
            v-model="searchParam.assessNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row>
      <b-col sm="12" class="mt-3">
        <b-col sm="12" class="px-0">
         - 평가기법 grid 
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn v-if="editable" title="L0000001789" color="orange" @btnClicked="openDialogPage()" />
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           위험Matrix 목록 
          <y-data-table
            label="L0000002117"
            :cellClick="true"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002117')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getList="getList"
          @openDialogPage="openDialogPage()"
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
  name: 'y-assess-type',
  props: {},
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
      searchParam: {
        plantCd: '',
        assessGroupCd: null,
        assessNm: '',
      },
      gridOptions: {
        name: 'assessType',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      searchUrl: '',
      editable: false,
    };
  },
  watch: {},
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
      this.editable = this.$route.meta.editable;
      // URL 셋팅
      this.searchUrl = selectConfig.rsa.assessType.list.url;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002120'),
          dataField: 'assessNm',
          width: '40%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002118'),
          dataField: 'assessDesc',
          width: '20%',
          style: 'left-align',
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
          btnClicked: 'openDialogPage',
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
      this.getList(); // 평가기법 grid
    },
    // 평가기법 grid
    getList() {
      this.$comm.pushCookie(this.searchParam);
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 300;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    cellClickHandler(event) {
      if (event.dataField === 'assessNm') {
        this.openDialogPage(event.item);
      }
      // else {
      //   this.popupOptions.target = () => import(`${'./assessTypeHistory.vue'}`);
      //   this.popupOptions.title = 'L0000003415'; // 위험 Matrix 이력
      //   this.popupOptions.param = {
      //     assessGroupNo: event.item.assessGroupNo,
      //   };
      //   this.popupOptions.visible = true;
      //   this.popupOptions.closeCallback = this.closePopup;
      // }
    },
    // 그리드 row click 이벤트
    tableLinkClicked(header, data) {
      if (header.name === 'assessNm') {
        this.openDialogPage(data);
      } else {
        this.popupOptions.target = () => import(`${'./assessTypeHistory.vue'}`);
        this.popupOptions.title = 'L0000003415'; // 위험 Matrix 이력
        this.popupOptions.param = {
          assessGroupNo: data.assessGroupNo,
        };
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    openDialogPage(data) {
      if (!data) {
        this.popupOptions.param = {
          assessTypeNo: 0,
        };
      } else {
        this.popupOptions.param = {
          assessTypeNo: data.assessTypeNo,
        };
      }
      this.popupOptions.target = () => import(`${'./riskMatrixDialog.vue'}`);
      this.popupOptions.title = 'L0000002115'; // 위험 Matrix 상세
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.getList();
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** /Button Event **/
  },
};
</script>
