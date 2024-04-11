<!--
  목적 : 시설점검 - 시설 목록
  Detail : 시설 목록/등록 화면
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
          <!-- 시설유형 -->
          <y-select
            :width="8"
            :comboItems="comboFacilityTypeItems"
            itemText="comFacilityTypeNm"
            itemValue="comFacilityTypeCd"
            ui="bootstrap"
            name="comFacilityTypeCd"
            label="L0000001747"
            v-model="searchParam.comFacilityTypeCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 시설코드 -->
          <y-text
            :width="8"
            ui="bootstrap"
            name="facilityCd"
            label="L0000001767"
            v-model="searchParam.facilityCd"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 시설명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            name="facilityNm"
            label="L0000001743"
            v-model="searchParam.facilityNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 관리부서 -->
          <y-tree-dept
            type="search"
            :plantCd="searchParam.plantCd"
            label="L0000000591"
            name="deptCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="useYnItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="useYn"
            label="L0000001439"
            v-model="searchParam.useYn"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <!-- 시설 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001738')"
          :useExcelExport="false"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkCheckTitleClicked"
          @btnGetList="getList"
          @closePopup="closePopup"
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
  name: 'y-facility-mst',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '', // 사업장코드
      comFacilityTypeCd: null, // 시설유형코드
      facilityCd: '', // 시설코드
      facilityNm: '', // 시설명
      deptCd: '', // 관리부서코드
      useYn: '', // 사용여부
      flag: 'M', // 시설 마스터만 조회
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
      param: null,
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    comboFacilityTypeItems: [], // 시설유형
    useYnItems: [],
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
    this.mountedInit();
    this.resizeGrid();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.baseInfo.safFacility.facilityMst.list.url;
      this.useYnItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '150px',
          style: 'center',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001747'),
          dataField: 'comFacilityTypeNm',
          width: '150px',
          style: 'center',
        }, // 시설유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001767'),
          dataField: 'facilityCd',
          width: '150px',
          style: 'center',
        }, // 시설코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001743'),
          dataField: 'facilityNm',
          width: '150px',
          style: 'left',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 시설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001741'),
          dataField: 'facilityMgrNum',
          width: '150px',
          style: 'center',
        }, // 시설관리번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001626'),
          dataField: 'installLocate',
          width: '150px',
          style: 'center',
        }, // 설치위치
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'deptNm',
          width: '150px',
          style: 'center',
        }, // 관리부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '150px',
          style: 'center',
        }, // 사용여부
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getComboFacilityTypeItems(); // 시설유형
      this.getList(); // 시설 목록 조회
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
    /** 시설유형 조회 **/
    getComboFacilityTypeItems() {
      this.$http.url = selectConfig.baseInfo.safFacility.facilityType.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          // _result.data.splice(0, 7);
          this.comboFacilityTypeItems = this.$_.clone(_result.data);
          this.comboFacilityTypeItems.splice(0, 0, {
            comFacilityTypeCd: null,
            comFacilityTypeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 390;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    /** 시설 목록 조회 **/
    getList() {
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
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === null || data === undefined) return;
      this.getList();
    },
    /**
     * 시설 목록에 시설명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    tableLinkCheckTitleClicked(event) {
      this.openDetailPopup(event, false);
    },

    openDetailPopup(event, isInsert) {
      if (event.dataField === 'facilityNm') {
        if (event.item.comFacilityTypeCd === 'AIROT') {
          // 대기 배출구
          this.popupOptions.target = () =>
            import(`${'@/pages/env/air/baseInfo/outletDetail'}`);
        } else if (event.item.comFacilityTypeCd === 'AIRPR') {
          // 대기 방지시설
          this.popupOptions.target = () =>
            import(`${'@/pages/env/air/facility/preventBaseDetail'}`);
        } else if (event.item.comFacilityTypeCd === 'AIRDI') {
          // 대기 배출시설
          this.popupOptions.target = () =>
            import(`${'@/pages/env/air/facility/dischargeDetail'}`);
        } else if (event.item.comFacilityTypeCd === 'WTRCL') {
          // 수질 클린센터
          this.popupOptions.target = () =>
            import(`${'@/pages/env/water/facility/wasteBasicUnitDetail'}`);
        } else if (event.item.comFacilityTypeCd === 'WTRDI') {
          // 수질 배출시설
          this.popupOptions.target = () =>
            import(`${'@/pages/env/water/facility/wasteDischargeDetail'}`);
        } else if (event.item.comFacilityTypeCd === 'WTRPR') {
          // 수질 방지시설
          this.popupOptions.target = () =>
            import(`${'@/pages/env/water/facility/preventBaseDetail'}`);
        } else if (event.item.comFacilityTypeCd === 'CHMSG') {
          // 화학물질 저장시설
          this.popupOptions.target = () =>
            import(`${'@/pages/chm/mat/storageFacilityManagementDetail'}`);
        } else {
          this.popupOptions.target = () =>
            import(`${'./facilityMstDetail.vue'}`);
        }
        this.popupOptions.title = isInsert ? 'L0000001739' : 'L0000001739';
        // 시설 상세
        this.popupOptions.param = {
          facilityCd: event.item.facilityCd, // 시설코드
          plantCd: event.item.plantCd, // 시설코드
          disabled: true,
          tabDisabled: true, // 탭 있는 상세에서 disabled 처리
        };
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },

    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * 해당 일정 결과 상세보는 팝업 open
     */
    btnAddClicked() {
      let data = {
        facilityCd: '', // 시설점검마스터번호
      };
      this.openDetailPopup(data, true);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
