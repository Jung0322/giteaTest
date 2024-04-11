<!--
  목적 : 협력업체 포탈 > 경고 및 지적현황
  작성자 : kyk
  Detail : 경고 및 지적현황
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
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000767"
            name="searchPeriod"
            :default="searchParam.searchPeriod"
            v-model="searchParam.searchPeriod"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 주관부서 -->
          <y-tree-dept
            type="search"
            label="L0000002713"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 대상업체 -->
          <y-text
            :width="8"
            :readonly="true"
            :clearable="true"
            ui="bootstrap"
            name="tgtVendorNm"
            label="L0000000932"
            v-model="searchParam.tgtVendorNm"
            :appendIcon="[
              { icon: 'search', callbackName: 'searchVendorMaster' },
            ]"
            @searchVendorMaster="btnSearchVendorClicked"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 순회명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001716"
            name="checkTitle"
            v-model="searchParam.checkTitle"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1">
             <y-btn :title="searchArea.title" color="green" @btnClicked="btnSearchVisibleClicked" /> 
         검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           경고 및 지적현황 
          <y-data-table
            label="L0000000456"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            excelDown="true"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000456')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @btnSearchClickedCallback="btnSearchClickedCallback"
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
  name: 'portal-improvement-manage',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return { noticeNo: [], popupMode: false };
      },
    },
  },
  data() {
    return {
      searchArea: {
        title: 'L0000000329', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        plantCd: '',
        deptCd: '',
        startDate: '',
        endDate: '',
        tgtVendorCd: '',
        tgtVendorNm: '',
        searchPeriod: [],
        checkTitle: '',
      },
      gridOptions: {
        name: 'warnAndPointOutStatus',
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
        param: {},
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      editable: false,
      searchUrl: '',
      plantItems: [],
      vendorCdItems: [], // 협력업체
    };
  },
  watch: {
    'searchParam.tgtVendorNm'() {
      if (
        this.searchParam.tgtVendorNm === '' ||
        this.searchParam.tgtVendorNm === null
      ) {
        this.searchParam.tgtVendorCd = '';
      }
    },
  },
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
      this.searchUrl = selectConfig.vendor.warning.list.url;

      let from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-3m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      let to = this.$comm.moment(this.$comm.getToday()).format('YYYY-MM-DD');
      this.searchParam.searchPeriod = [from, to];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001720'),
          dataField: 'safCheckKindNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001717'),
          dataField: 'checkYmd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001716'),
          dataField: 'checkTitle',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'),
          dataField: 'deptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000932'),
          dataField: 'tgtVendorNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001710'),
          dataField: 'checkResultNm',
          width: '10%',
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
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDataList();
    },
    // 업체 grid
    getDataList() {
      this.searchParam.startDate = this.$_.clone(
        this.searchParam.searchPeriod[0]
      );
      this.searchParam.endDate = this.$_.clone(
        this.searchParam.searchPeriod[1]
      );

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 375;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    /** /validation checking **/

    /** Button Event **/

    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },

    btnSearchVendorClicked() {
      this.popupOptions.target = () =>
        import(`${'../baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003848'; // 협력업체검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closePopupSearchVendor;
    },
    closePopupSearchVendor(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data) {
        this.searchParam.tgtVendorCd = data.data.vendorCd;
        this.searchParam.tgtVendorNm = data.data.vendorNm;
      }
    },
  },
};
</script>
