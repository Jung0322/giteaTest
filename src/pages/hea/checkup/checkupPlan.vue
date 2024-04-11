<!--
  목적 : 검진 계획
  Detail : 검진계획 검색/등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            type="year"
            label="L0000000767"
            name="heaCheckupPlanPeriod"
            :width="8"
            :range="true"
            :default="searchParam.heaCheckupPlanPeriod"
            v-model="searchParam.heaCheckupPlanPeriod"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 검진 종류 -->
          <y-select
            ui="bootstrap"
            label="L0000000346"
            itemText="codeNm"
            itemValue="code"
            name="heaCheckupClassCd"
            :width="8"
            :comboItems="searchHeaCheckupClassItems"
            v-model="searchParam.heaCheckupClassCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000353"
            name="heaCheckupPlanNm"
            v-model="searchParam.heaCheckupPlanNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getDataList" />
          </div>
          검진결과 계획 테이블 

           검진 계획 목록 
          <y-data-table
            ref="dataTable"
            label="L0000000338"
            :use-paging="true"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000338')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getDataList="getDataList"
          @cellClick="cellClickHandler"
          @btnPopupClickedCallback="btnPopupClickedCallback"
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
  name: 'checkup-plan',
  data() {
    return {
      searchParam: {
        heaCheckupPlanPeriod: [], // 기간
        plantCd: null, // 사업장 코드
        heaCheckupClassCd: null, // 검진 종류 코드
        startDate: null, // 기간 시작
        endDate: null, // 기간 끝
        heaCheckupPlanNm: '',
      },
      gridOptions: {
        name: 'checkupPlan',
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
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      searchHeaCheckupClassItems: [],
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
    init() {
      this.editable = this.$route.meta.editable;

      this.searchUrl = selectConfig.hea.checkupPlan.list.url;

      let year = this.$comm.getThisYear();
      this.searchParam.heaCheckupPlanPeriod = [year, year];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getComboItems();
      this.getDataList();

      // 검진 계획 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000373'),
          dataField: 'heaCheckupClassNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000353'),
          dataField: 'heaCheckupPlanNm',
          width: '30%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000356'),
          dataField: 'heaCheckupPlanPeriod',
          width: '20%',
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
          btnClicked: 'btnPopupClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',
        },
      ];
    },
    // 검진 종류
    getComboItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'HEA_CHECKUP_CLASS'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.searchHeaCheckupClassItems = this.$_.clone(_result.data);

          this.searchHeaCheckupClassItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 검진 계획 그리드
    getDataList() {
      this.searchParam.startDate = this.searchParam.heaCheckupPlanPeriod[0];
      this.searchParam.endDate = this.searchParam.heaCheckupPlanPeriod[1];
      this.$http.url = this.searchUrl;
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
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.dataField !== 'heaCheckupPlanNm') return;
      this.popupOptions.target = () => import(`${'./checkupPlanDetail.vue'}`);
      this.popupOptions.title = 'L0000000340'; // 검진 계획 상세 수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        heaCheckupPlanNo: event.item.heaCheckupPlanNo,
        resultCnt: event.item.resultCnt,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = () => import(`${'./checkupPlanDetail.vue'}`);
      this.popupOptions.title = 'L0000000340'; // 검진 계획 상세 수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        heaCheckupPlanNo: data.heaCheckupPlanNo,
        resultCnt: data.resultCnt,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업  호출
     */
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./checkupPlanDetail.vue'}`);
      this.popupOptions.title = 'L0000004318'; // 검진 계획 상세 등록
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        heaCheckupPlanNo: 0,
        resultCnt: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /** Button Event **/
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    /** /Button Event **/
  },
};
</script>
