<!--
  목적 : 환경 > 온실가스 > 배출량 거래이력
  작성자 : PSB
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
          <y-plant
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 거래일자 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000004466"
            name="period"
            default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 배출량 거래이력 -->
          <!-- 거래업체 -->
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            label="L0000004467"
            name="trVendorCd"
            v-model="searchParam.trVendorNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchUser' },
            ]"
            @searchUser="searchVendor"
            @clear="clear"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 구매/판매 구분 -->
          <y-select
            :width="8"
            :editable="true"
            :comboItems="gubunItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000004468"
            name="gubun"
            v-model="searchParam.gubun"
          >
          </y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 거래구분 -->
          <y-select
            :width="8"
            :editable="true"
            :comboItems="trGubunItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000004469"
            name="gubun"
            v-model="searchParam.trGubun"
          >
          </y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 거래사업장 -->
          <y-plant
            type="search"
            label="L0000004470"
            name="trPlantCd"
            :disAuthPage="true"
            v-model="searchParam.trPlantCd"
          ></y-plant>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 거래이력 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004471')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked"
          @openPopup="openPopup"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'operation-log',
  data() {
    return {
      searchParam: {
        plantCd: '',
        period: [],
        trVendorCd: '',
        trVendorNm: '',
        gubun: '',
        trGubun: '',
        trPlantCd: '',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        height: '50%',
        param: {},
        closeCallback: null,
      },

      gridOptions: {
        name: 'emsHis',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },
      editable: true,

      gubunItems: [],
      trGubunItems: [],
      YAuiGrid: null,
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  beforeDestroy() {},
  destroyed() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.$comm.getComboItems('ghg_tr_gubun', true).then((_result) => {
        this.gubunItems = _result;
      });

      this.searchParam.period.push(
        this.$moment().startOf('month').format('YYYY-MM-DD')
      );

      this.searchParam.period.push(
        this.$moment().endOf('month').format('YYYY-MM-DD')
      );
      this.trGubunItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'in', codeNm: this.$comm.getLangSpecInfoLabel('L0000004472') }, // 내부
        { code: 'out', codeNm: this.$comm.getLangSpecInfoLabel('L0000004473') }, // 외부
      ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '100',
          style: 'center-align',
        },
        // 거래일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004466'),
          dataField: 'trYmd',
          width: '120',
          style: 'center-align grid-link-cell',
        },

        // 거래구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004469'),
          dataField: 'trGubunNm',
          width: '120',
          style: 'center-align',
        },
        // 거래업체
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004467'),
          dataField: 'trVendorNm',
          width: '160',
          style: 'center-align',
        },
        // 구매/판매 구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004474'),
          dataField: 'gubunNm',
          width: '160',
          style: 'center-align',
        },
        // 구매량(tCO2-eq)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004475'),
          dataField: 'purchases',
          width: '160',
          style: 'right-align',
          dataType: 'numeric',
          formatString: '#,##0.###',
        },
        // 판매량(tCO2-eq)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004476'),
          dataField: 'sales',
          width: '160',
          style: 'right-align',
          dataType: 'numeric',
          formatString: '#,##0.###',
        },
        // 비고
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '160',
          style: 'center-align',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '120',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '120',
          style: 'center-align',
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
          btnClicked: 'btnSearchClickedCallback',
        },
      ];
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList();
    },

    getList() {
      this.$http.url = selectConfig.env.gas.emstr.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkClicked(data) {
      if (!data) return;
      if (data.dataField === 'trYmd') {
        this.openPopup(data.item);
      }
    },
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./emsHisDetail.vue'}`);
      this.popupOptions.title = 'L0000004477'; // 배출량 거래이력 등록
      this.popupOptions.param = {
        emstrHisNo: data ? data.emstrHisNo : 0,
      };
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    searchVendor() {
      this.popupOptions.target = () =>
        import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003246'; /* 협력업체 */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
        multiple: false,
        vendors: [],
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data && data.data !== 'C') {
        this.searchParam.trVendorCd = data.data.vendorCd;
        this.searchParam.trVendorNm = data.data.vendorNm;
      }
    },
    clear() {
      this.searchParam.trVendorCd = '';
      this.searchParam.trVendorNm = '';
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchClickedCallback(result) {
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
