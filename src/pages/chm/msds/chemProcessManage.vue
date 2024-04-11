<!--
  목적 : 화학물질 > 공정자재관리요령
  작성자 : kyk
  수정자 : jkl
  Detail : 공정관리 요령 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            filter="chm"
            type="search"
            v-model="searchParam.plantCd"
            @datachange="
              (val) => {
                (searchParam.plantCd = val), getDataList();
              }
            "
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 부서 -->
          <y-tree-dept
            type="search"
            label="L0000001287"
            v-model="searchParam.deptCd"
            :plantCd="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 공정 -->
          <y-tree-process
            label="L0000000515"
            name="processCdSearch"
            type="search"
            :plantCd="searchParam.plantCd"
            :deptCd="searchParam.deptCd"
            v-model="searchParam.processCd"
          ></y-tree-process>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1">
             <y-btn :title="searchArea.title" color="green" @btnClicked="btnSearchVisibleClicked" /> 
             신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="openPopup(null)"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getDataList"
            />
          </div>
           공정관리요령 목록 
          <y-data-table
            ref="dataTable"
            label="L0000000531"
            :use-paging="true"
            :editable="editable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @tableLinkClicked="tableLinkClicked"
          >
          </y-data-table>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000531')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getDataList="getDataList"
          @openPopup="openPopup(null)"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'chem-process-manage',
  props: {},
  data() {
    return {
      // processManage: {
      //   chmProcessManageNo: 0,
      //   plantCd: '',
      //   plantNm: null,
      //   deptCd: '',
      //   deptNm: null,
      //   processCd: '',
      //   processNm: null,
      //   hazDangerDesc: '',
      //   handleCareDesc: '',
      //   safetyEquipDesc: '',
      //   fstHandleDesc: '',
      //   accHandleDesc: '',
      //   etc: '',
      //   useYn: 'Y',
      //   chemProcessManageChemprodVals: [],
      //   processManagePicGraphs: [],
      //   createUserId: '',
      //   updateUserId: '',
      // },
      searchParam: {
        plantCd: '',
        deptCd: '',
        processCd: '',
        search: '',
        useYn: '',
      },
      gridOptions: {
        name: 'chemProcessManage',
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
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // 공정관리요령 그리드 헤더
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004367'),
          dataField: 'deptNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002915'),
          dataField: 'processNm',
          width: '20%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '15%',
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
          btnClicked: 'getDataList',
        },
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      // 공정관리요령 그리드 데이터 조회
      this.getDataList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    getDataList() {
      this.$http.url = selectConfig.chm.processManage.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField !== 'processNm') return;
      this.openPopup(event.item);
    },
    tableLinkClicked(header, data) {
      this.openPopup(data);
    },
    openPopup(data) {
      if (data) {
        this.popupOptions.title =
          this.$comm.getLangSpecInfoLabel('L0000000532'); // 공정관리요령 수정
        this.popupOptions.param = {
          chmProcessManageNoProp: data.chmProcessManageNo,
        };
      } else {
        this.popupOptions.title =
          this.$comm.getLangSpecInfoLabel('L0000000530'); // 공정관리요령 등록
        this.popupOptions.param = {
          chmProcessManageNoProp: null,
        };
      }
      this.popupOptions.target = () =>
        import(`${'./chemProcessManageDetail.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
  },
};
</script>
