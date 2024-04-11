<!--
  목적 : 공정시설정보 - 안전밸브 및 파열판
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
          <!-- 계기번호 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            type="search"
            label="L0000000464"
            name="safFacilityCd"
            v-model="searchParam.safFacilityCd"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 계기명 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            type="search"
            label="L0000000463"
            name="facilityNm"
            v-model="searchParam.facilityNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 설비 grid -->
    <b-row>
      <b-col sm="12">
        <!--  안전밸브 및 파열판 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :label="this.$comm.getLangSpecInfoLabel('L0000001856')"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
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
  name: 'safety-valve',
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
        facilityPsmCd: 'FPSM1',
        processCd: '',
        safFacilityCd: '',
        facilityNm: '',
        plantCd: '',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'processSafetyDataSafetyValve',
        header: [],
        data: [],
        height: 'auto',
        tabs: true,
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
    this.resizeGrid();
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
      this.searchUrl = selectConfig.psm.processFacility.safetyValve.list.url;
      this.editable = this.$route.meta.editable;

      // 설비 grid 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '90', 
        }, // 사업장 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'), 
          dataField: 'processNm', 
          style: 'left-align',
          width: '150',
        }, // 공정 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000464'), 
          dataField: 'safFacilityCd', 
          width: '120', 
        }, // 계기번호 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000463'), 
          dataField: 'facilityNm', 
          width: '200', 
          style: 'left-align', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {}, 
          },
        }, // 계기명 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000811'), 
          dataField: 'inMat', 
          width: '200', 
          style: 'left-align', 
        }, // 내용물 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001538'), 
          dataField: 'condition', 
          width: '150', 
          style: 'left-align', 
        }, // 상태 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001183'), 
          dataField: 'outVol', 
          width: '150', 
          style: 'left-align', 
        }, // 배출용량(kg/hr) 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002595'), 
          dataField: 'regulVol', 
          width: '150', 
          style: 'left-align', 
        }, // 정격용량(kg/hr) 
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000842'), // 노즐크기
          children: [
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000002289'), 
              dataField: 'nozSizeIn', 
              width: '80', 
              style: 'left-align', 
            }, // 입구 
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000002905'), 
              dataField: 'nozSizeOut', 
              width: '80', 
              style: 'left-align', 
            }, // 출구 
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001278'), // 보호기기압력
          children: [
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000000774'), 
              dataField: 'protectSerial', 
              width: '105', 
              style: 'left-align', 
            }, // 기기번호 
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000002077'), 
              dataField: 'protectOpr', 
              width: '105', 
              style: 'left-align', 
            }, // 운전(MPa) 
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000001573'), 
              dataField: 'protectPlan', 
              width: '105', 
              style: 'left-align', 
            }, // 설계(MPa) 
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001854'), // 안전밸브 등
          children: [
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000001620'), 
              dataField: 'valveSetting', 
              width: '105', 
              style: 'left-align', 
            }, // 설정(MPa) 
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000001032'), 
              dataField: 'valueMat', 
              width: '105', 
              style: 'left-align', 
            }, // 몸체재질 
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000000185'), 
              dataField: 'valveTrim', 
              width: '105', 
              style: 'left-align', 
            }, // Trim재질 
          ],
        },
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002603'), 
          dataField: 'precision', 
          width: '160', 
        }, // 정밀도(오차범위) 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001181'), 
          dataField: 'outConnect', 
          width: '160', 
          style: 'left-align', 
        }, // 배출연결부위 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001184'), 
          dataField: 'outReason', 
          width: '160', 
          style: 'left-align', 
        }, // 배출원인 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003270'), 
          dataField: 'form', 
          width: '160', 
          style: 'left-align', 
        }, // 형식 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writerUserNm', 
          width: '100', 
        }, /* 작성자 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'writerDt', 
          width: '100', 
        }, /* 작성일 */ 

      ];
      this.gridOptions.btns = [
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
          this.YAuiGrid.setGridData(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 그리드 row click 이벤트
    cellClickHandler(event) {
      if (event.dataField === 'facilityNm') this.btnPopupClickedCallback(event.item);
    },

    /** Button Event **/
    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // 신규등록 팝업
    btnPopupClickedCallback(data) {
      this.popupOptions.target = () =>
        import(`${'../../baseInfo/facility/createFacilityMst.vue'}`);
      this.popupOptions.title = 'L0000001855'; // 안전밸브 및 파열판
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safFacilityCd: data ? data.safFacilityCd : '',
        facilityPsmCd: this.searchParam.facilityPsmCd,
        title: 'L0000001857', // 안전밸브 및 파열판 상세
        flag: false, // data ? data.count !== '0' ? true : false : false
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
#powerMachineTable .cell span {
  white-space: pre-line;
}
</style>