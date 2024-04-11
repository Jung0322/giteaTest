<!--
  목적 : 기초정보 > 설비 관리 > 설비별 화학 자재
  작성자 : kga > kyh
  Detail :
  y-aui-grid 로 변경
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 관리부서 -->
          <y-tree-dept
            type="search"
            label="L0000000591"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-process
            type="search"
            :plantCd="searchParam.plantCd"
            :deptCd="searchParam.deptCd"
            v-model="searchParam.processCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 설비유형 -->
          <y-tree-facility-type
            label="L0000001597"
            type="search"
            name="searchSafFacilityTypeCd"
            v-model="searchParam.safFacilityTypeCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 설비코드 -->
          <y-text
            :width="8"
            ui="bootstrap"
            type="search"
            label="L0000001618"
            name="safFacilityCd"
            v-model="searchParam.safFacilityCd"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 설비명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            type="search"
            label="L0000001596"
            name="facilityNm"
            v-model="searchParam.facilityNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 설치위치 -->
          <y-text
            :width="8"
            ui="bootstrap"
            type="search"
            label="L0000001626"
            name="installLocate"
            v-model="searchParam.installLocate"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 안전인증 -->
          <y-select
            :width="8"
            :comboItems="safLsnItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001867"
            name="safLsnYn"
            v-model="searchParam.safLsnYn"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 안전검사 -->
          <y-select
            :width="8"
            :comboItems="safChkItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001842"
            name="safChkYn"
            v-model="searchParam.safChkYn"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 설비 grid -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1"> -->
    <!-- 검색 -->
    <!-- <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
            />
          </div> -->
    <!-- 설비 목록 -->
    <!-- <y-data-table
            label="L0000001581"
            gridType="edit"
            :print="true"
            :use-paging="true"
            :rows="3"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @tableLinkClicked="tableLinkClicked"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <!-- 설비 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001581')"
          :useExcelExport="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked"
          @btnGetList="getDataList"
          @closePopup="closePopup"
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
  props: {},
  data() {
    return {
      searchParam: {
        safFacilityTypeCd: '', // 설비유형
        processCd: '', // 공정
        deptCd: '', // 관리부서
        safFacilityCd: '', // 설비코드
        facilityNm: '', // 설비명
        installLocate: '', // 설치위치
        plantCd: '', // 사업장
        safLsnYn: '',
        safChkYn: '',
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
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      comboFacilityTypeItems: [], // 설비유형
      safLsnItems: [],
      safChkItems: [],
      searchUrl: '',
      YAuiGrid: null,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.editable = this.$route.meta.editable;
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.mountedInit();
    this.resizeGrid();
  },
  beforeDestroy() {},
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.facilityMst.list.url;

      this.safLsnItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003788') }, // 관련
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000003789') }, // 미관련
      ];
      this.safChkItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003788') }, // 관련
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000003789') }, // 미관련
      ];

      this.getFacilityTypeItems(); // 설비유형

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDataList(); // 설비 grid

      // 설비 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '120px',
          style: 'center',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001596'),
          dataField: 'facilityNm',
          width: '200px',
          style: 'left',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 설비명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001618'),
          dataField: 'safFacilityCd',
          width: '110px',
          style: 'center',
        }, // 설비코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'deptNm',
          width: '120px',
          style: 'center',
        }, // 관리부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: '120px',
          style: 'left',
        }, // 공정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001597'),
          dataField: 'safFacilityTypeNm',
          width: '150px',
          style: 'center',
        }, // 설비유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001626'),
          dataField: 'installLocate',
          width: '120px',
          style: 'left',
        }, // 설치위치
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001867'),
          dataField: 'safLsnYnNm',
          width: '90px',
          style: 'center',
        }, // 안전인증
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001842'),
          dataField: 'safChkYnNm',
          width: '90px',
          style: 'center',
        }, // 안전검사
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001627'),
          dataField: 'installYmd',
          width: '120px',
          style: 'center',
        }, // 설치일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002061'),
          dataField: 'vol',
          width: '100px',
          style: 'right',
        }, // 용량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001846'),
          dataField: 'safMgrPsn',
          width: '100px',
          style: 'center',
        }, // 안전관리자
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002355') /* 작성자 */,
          dataField: 'writerUserNm',
          width: '120px',
          style: 'center',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002352') /* 작성일 */,
          dataField: 'writerDt',
          width: '120px',
          style: 'center',
        },
      ];
    },
    mountedInit() {
      this.gridOptions.btn = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnGetList',
        }, // 검색
      ];

      this.YAuiGrid.setBtnArr(this.gridOptions.btn);
    },
    resizeGrid() {
      let _height = window.innerHeight - 455;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    // 설비유형
    getFacilityTypeItems() {
      this.$http.url = selectConfig.baseInfo.facilityType.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            safFacilityTypeCd: '',
            safFacilityTypeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          this.comboFacilityTypeItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 설비 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    // 그리드 row click 이벤트
    tableLinkClicked(event) {
      if (event.dataField === 'facilityNm') {
        this.popupOptions.target = () =>
          import(`${'./facilityMaterialDetail.vue'}`);
        this.popupOptions.title = 'L0000001594'; // 설비마스터
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          safFacilityCd: event.item.safFacilityCd
            ? event.item.safFacilityCd
            : '',
          title: event.item.safFacilityTypeNm
            ? event.item.safFacilityTypeNm + 'L0000001526'
            : 'L0000004510', // 상세 : 유형별 설비 상세
          // flag: true,
        };
        this.popupOptions.closeCallback = this.closePopup;
      }
    },

    /** Button Event **/

    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // 팝업 닫기
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
  },
};
</script>
