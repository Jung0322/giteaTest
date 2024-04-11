<!--
  목적 : 시설점검 - 시설점검일정
  Detail : 시설점검일정 등록화면으로 시설유형별로 시설을 조회 및 선택하여 시설점검종류와 시설점검예정일을 등록한다.
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            :disabled="plantDisabled"
            v-model="searchParam.plantCd"
          />
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
          ></y-select>
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
            :plantCd="searchParam.plantCd"
            type="search"
            label="L0000000591"
            v-model="searchParam.deptCd"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn
              title="L0000001561"
              color="orange"
              @btnClicked="closePopup('SAVE')"
              v-if="!popupParam.gubun"
            />
             선택 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
            />
             검색 
            <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
             닫기 
          </div>
           시설 목록 
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="editable"
            :use-paging="true"
            :checkItemData="checkItemData"
            checkKey="facilityCd"
            v-model="facilityMstValue"
            label="L0000001738"
            @selectedRow="selectedRow"
            @rowDoubleClicked="rowDoubleClicked"
          >
            <el-table-column
              v-if="!popupParam.gubun"
              :selectable="selectedCheck"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <!-- 시설목록 -->
      <b-col sm="12" class="h100p">
        <!-- 사용자 목록 -->
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
          :showRowCheckColumn="false"
          @cellDoubleClick="cellDoubleClickHandler"
          @closePopup="closePopup('SAVE')"
          @btnSearch="btnSearch"
          @closePopup2="closePopup('CLOSE')"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-facility-mst-popup',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        selectedFacilityMstValue: [], // 선택 된 시설
        plantCd: '',
        gubun: null,
        deptCd: null,
      }),
    },
  },
  data: () => ({
    selectRow: null,
    searchParam: {
      comFacilityTypeCd: null, // 시설유형코드
      deptCd: '', // 관리부서 코드
      facilityNm: '', // 시설명
      plantCd: '', // 사업장
      useYn: 'Y', // 사용여부
    },
    gridOptions: {
      header: [],
      data: [],
      height: '350',
      btns: [],
    },
    checkItemTempData: [],
    checkItemData: [],
    baseWidth: 9,
    plantDisabled: false,
    editable: false,
    comboFacilityTypeItems: [], // 시설유형
    comboDeptItems: [], // 관리부서
    facilityMstValue: [], // 체크된 시설목록
    searchUrl: '',
    YAuiGrid: null,
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.setGridHeader();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.baseInfo.safFacility.facilityMst.list.url;

      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.popupParam.plantCd;
        this.plantDisabled = true;
      }
      if (this.popupParam.deptCd) {
        this.searchParam.deptCd = this.popupParam.deptCd;
      }

      this.getComboFacilityTypeItems(); // 시설유형
      this.getList();
    },
    setGridHeader() {
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '130px',
          align: 'center',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001747'),
          dataField: 'comFacilityTypeNm',
          width: '150px',
          align: 'center',
        }, // 시설유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001767'),
          dataField: 'facilityCd',
          width: '130px',
          align: 'center',
        }, // 시설코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001743'),
          dataField: 'facilityNm',
          width: '250px',
        }, // 시설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001742'),
          dataField: 'deptNm',
          width: '150px',
        }, // 시설관리부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002879'),
          dataField: 'lastLawckYmd',
          width: '160px',
          align: 'center',
        }, // 최근 법정 점검일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002884'),
          dataField: 'lastSelfcYmd',
          width: '160px',
          align: 'center',
        }, // 최근자체점검일
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'closePopup',
        }, //  선택
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, //  검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup2',
        }, //  닫기
      ];
    },
    selectedCheck() {
      return this.editable;
    },
    /**
     * 시설유형 조회
     */
    getComboFacilityTypeItems() {
      this.$http.url = selectConfig.baseInfo.safFacility.facilityType.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.comboFacilityTypeItems = this.$_.clone(_result.data);
          this.comboFacilityTypeItems.splice(0, 0, {
            comFacilityTypeCd: null,
            comFacilityTypeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체,
          });
          this.searchParam.comFacilityTypeCd = '';
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 시설 목록 조회 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          if (
            this.popupParam.selectedFacilityMstValue &&
            this.popupParam.selectedFacilityMstValue.length > 0
          ) {
            this.checkItemData = this.popupParam.selectedFacilityMstValue;
          } else {
            this.checkItemData = [];
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      let selectedRow;
      if (data === 'SAVE') {
        selectedRow = this.YAuiGrid.getCheckedRowItems();
        this.$emit('closePopup', selectedRow);
      } else if (data === 'CLOSE') {
        this.$emit('closePopup', 'CLOSE');
      }
    },
    cellDoubleClickHandler(event) {
      console.log('2', event);
      this.$emit('closePopup', { success: true, facility: event.item });
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
    btnSearch() {
      this.getList();
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
