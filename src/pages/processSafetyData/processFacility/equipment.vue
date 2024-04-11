<!--
  목적 : 공정시설정보 - 장치 및  설비
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
          <y-plant type="search" v-model="searchParam2.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 공정 -->
          <y-tree-process
            label="L0000000515"
            name="processCd"
            type="search"
            :plantCd="searchParam2.plantCd"
            v-model="searchParam2.processCd"
          ></y-tree-process>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 장치번호 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            type="search"
            label="L0000002458"
            name="safFacilityCd"
            v-model="searchParam2.safFacilityCd"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 장치명 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            type="search"
            label="L0000002457"
            name="facilityNm"
            v-model="searchParam2.facilityNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 설비 grid -->
    <b-row>
      <b-col sm="12">
        <!-- 장치 및 설비 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :label="this.$comm.getLangSpecInfoLabel('L0000002454')"
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
  name: 'facility-mst',
  props: {
    paneName: '',
    tabIndex: 0,
  },
  data() {
    return {
      searchArea: {
        title: 'L0000000329', // 검색박스숨기기
        show: true,
      },
      searchParam2: {
        facilityPsmCd: 'FPSM2',
        processCd: '',
        safFacilityCd: '',
        facilityNm: '',
        plantCd: '',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'processSafetyDataEquipment',
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
    paneName: function (newValue, oldValue) {
      this.resizeGrid();
      // this.setGridSize();
      this.getDataList();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getDataList(); // 설비 grid
  },
  beforeDestroy() { },
  activated() {
    this.resizeGrid();
  },
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.psm.processFacility.equipment.list.url;

      this.editable = this.$route.meta.editable;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      const searchParamByCookie2 = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie2 !== 'undefined') {
        this.searchParam2 = searchParamByCookie2;
      }

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
          headerText: this.$comm.getLangSpecInfoLabel('L0000002458'), 
          dataField: 'safFacilityCd', 
          width: '120', 
        }, // 장치번호 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002457'), 
          dataField: 'facilityNm', 
          width: '200', 
          style: 'left-align', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {}, 
          },
        }, // 장치명 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000811'), 
          dataField: 'inMat', 
          width: '200', 
          style: 'left-align', 
        }, // 내용물 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002061'), 
          dataField: 'vol', 
          width: '150', 
          style: 'left-align', 
        }, // 용량 
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001907'), // 압력(Mpa)
          children: [
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000002076'), 
              dataField: 'pressOpr', 
              width: '80', 
              style: 'right-align', 
            }, // 운전 
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000001572'), 
              dataField: 'pressPlan', 
              width: '80', 
              style: 'right-align', 
            }, // 설계 
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002029'), // 온도(℃)
          children: [
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000002076'), 
              dataField: 'tempOpr', 
              width: '80', 
              style: 'right-align', 
            }, // 운전 
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000001572'), 
              dataField: 'tempPlan', 
              width: '80', 
              style: 'right-align', 
            }, // 설계 
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001476'), // 사용재질
          children: [
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000001284'), 
              dataField: 'matMain', 
              width: '105', 
              style: 'left-align', 
            }, // 본체 
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000001334'), 
              dataField: 'matSub', 
              width: '105', 
              style: 'left-align', 
            }, // 부속품 
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000000287'), 
              dataField: 'matGasket', 
              width: '165', 
              style: 'left-align', 
            }, // 개스킷 
          ],
        },
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002069'), 
          dataField: 'weldEff', 
          width: '110', 
          style: 'right-align', 
        }, // 용접효율 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000465'), 
          dataField: 'calcThick', 
          width: '140', 
          style: 'right-align', 
        }, // 계산두께(mm) 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001336'), 
          dataField: 'corrosBuf', 
          width: '130', 
          style: 'right-align', 
        }, // 부식여유(mm) 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001444'), 
          dataField: 'useThick', 
          width: '130', 
          style: 'right-align', 
        }, // 사용두께(mm) 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003369'), 
          dataField: 'aftHeatTreatYnNm', 
          width: '100', 
        }, // 후열처리여부 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001377'), 
          dataField: 'nondestructPer', 
          width: '140', 
          style: 'left-align', 
        }, // 비파괴검사율(%) 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
          dataField: 'actLaw', 
          width: '200', 
          style: 'left-align', 
        }, // 비고 
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
      this.$http.param = this.searchParam2;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam2);
        },
        (_error) => {
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
      this.popupOptions.title = 'L0000002453'; // 장치 및 설비
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safFacilityCd: data ? data.safFacilityCd : '',
        facilityPsmCd: this.searchParam2.facilityPsmCd,
        title: 'L0000002455', // 장치 및 설비 상세
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