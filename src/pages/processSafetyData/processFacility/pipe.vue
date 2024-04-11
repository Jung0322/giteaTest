<!--
  목적 : 공정안전자료>공정시설정보 - 배관 및 개스킷
  작성자 : kdh
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 공정 -->
          <y-tree-process
            label="L0000000515"
            name="processCd"
            type="search"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.processCd"
          ></y-tree-process>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 분류코드 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            type="search"
            label="L0000001342"
            name="safFacilityCd"
            v-model="searchParam.safFacilityCd"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 설비 grid -->
    <b-row>
      <b-col sm="12">
        <!-- 배관 및 개스킷 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :label="this.$comm.getLangSpecInfoLabel('L0000001131')"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
          @btnPopupClicked="btnPopupClickedCallback"
          @btnSearch="btnSearchClickedCallback"
          @btnClickedError="btnClickedErrorCallback"
        />
      </b-col>
    </b-row>

    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'pipe',
  props: {
    paneName: '',
    tabIndex: 0,
  },
  data() {
    return {
      searchArea: {
        title: '검색박스숨기기', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        processCd: '',
        safFacilityCd: '',
        facilityNm: '',
        plantCd: '',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'processSafetyDataPipe',
        header: [],
        data: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      baseWidth: 8,
      searchUrl: '',
    };
  },
  watch: {
    paneName: function(newValue, oldValue) {
      // this.setGridSize();
      this.resizeGrid();
      this.getDataList();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    // 윈도우 resize event
    // window.addEventListener('resize', this.setGridSize);
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getDataList(); // 설비 grid
  },
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
    // window.removeEventListener('resize', this.setGridSize);
  },
  activated() {
    this.resizeGrid();
  },
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.psm.processFacility.pipe.list.url;
      this.editable = this.$route.meta.editable;

      // 설비 grid 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '90', 
          cellMerge: true,
          mergeRef: "pipeCd",
          mergePolicy: "restrict"
        }, // 사업장 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'), 
          dataField: 'processNm', 
          style: 'left-align',
          width: '150',
          cellMerge: true,
          mergeRef: "pipeCd",
          mergePolicy: "restrict"
        }, // 공정 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001342'), 
          dataField: 'pipeCd', 
          width: '120', 
          cellMerge: true,
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {}, 
          },
        }, // 분류코드 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000004305'), 
          dataField: 'pipeNm', 
          width: '170', 
          style: 'left-align', 
        }, // 유체의 명칭 또는 구분 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001575'), 
          dataField: 'planTemp', 
          width: '140', 
          style: 'right-align', 
        },  // 설계온도(℃) 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001574'), 
          dataField: 'planPress', 
          width: '160', 
          style: 'right-align', 
        }, // 설계압력(Mpa) 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001134'), 
          dataField: 'pipeMat', 
          width: '140', 
          style: 'left-align', 
        }, // 배관재질 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000288'), 
          dataField: 'gasketMat', 
          width: '300', 
          style: 'left-align', 
        }, // 개스킷 재질 및 형태 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001376'), 
          dataField: 'nondestructPer', 
          width: '160', 
          style: 'left-align', 
        }, // 비파괴검사율 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003369'), 
          dataField: 'aftHeatTreatYnNm', 
          width: '100', 
        }, // 후열처리여부 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'writerDt', 
          width: '100', 
        }, // 작성일 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writerUserNm', 
          width: '100', 
        }, // 작성자 
      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000001789'), 
          color: 'orange', 
          btnClicked: 'btnPopupClicked',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        },  // 신규등록
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green', 
          btnClicked: 'btnSearch',
          btnClickedError: 'btnClickedError',
        },  // 검색
      ]; 
    },
    // 설비 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 그리드 row click 이벤트
    cellClickHandler(event) {
      if (event.dataField === 'pipeCd') this.btnPopupClickedCallback(event.item);
    },

    /** Button Event **/

    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // 신규등록 팝업
    btnPopupClickedCallback(data) {
      this.popupOptions.target = () => import(`${'./pipePopup.vue'}`);
      this.popupOptions.title = 'L0000001130'; // 배관 및 개스킷
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        plantCd: data ? data.plantCd : '',
        processCd: data ? data.processCd : '',
        pipeCd: data ? data.pipeCd : '',
        editCheck: data ? true : false,
        // 'title': '배관 및 개스킷 상세',
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    // 신규등록 팝업 닫기
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 390;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
<style>
#pipeTable .cell span {
  white-space: pre-line;
}
</style>