<!--
  목적 : 폐기물-폐기물 처리결과
  작성자 : khk
  Detail : 폐기물-폐기물 처리결과 조회
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
          <!-- 처리일 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002839"
            name="reqYmdPeriod"
            :default="searchParam.reqYmdPeriod"
            v-model="searchParam.reqYmdPeriod"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 폐기물 분류 -->
          <y-select
            :width="8"
            :comboItems="ewstClassCdItemsEdit"
            itemText="ewstClassNm"
            itemValue="ewstClassCd"
            ui="bootstrap"
            type="search"
            name="ewstClassCd"
            label="L0000003106"
            v-model="searchParam.ewstClassCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 폐기물 -->
          <y-select
            :width="8"
            :comboItems="ewstWasteCdItemsEdit"
            itemText="ewstWasteNm"
            itemValue="ewstWasteNo"
            ui="bootstrap"
            type="search"
            name="ewstWasteNo"
            label="L0000003102"
            v-model="searchParam.ewstWasteNo"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 처리상태 -->
          <y-select
            :width="8"
            :comboItems="ewstDispoStCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="ewstDispoStCd"
            label="L0000002830"
            v-model="searchParam.ewstDispoStCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 요청부서 -->
          <y-tree-dept
            type="search"
            label="L0000002053"
            :showAllDept="true"
            :disabled="disabled"
            name="dispoDeptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.dispoDeptCd"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 폐기물 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003104')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked"
          @btnPopupClickedCallback="btnPopupClickedCallback"
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
  /** attributes: name, components, props, data **/
  name: 'dispo-result',
  props: {},
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        plantCd: '',
        reqYmdPeriod: [],
        ewstDispoStCd: '',
        dispoDeptCd: '',
      },
      gridOptions: {
        name: 'dispoResult',
        header: [],
        data: [],
        btns: [],
        height: '350',
      },
      editable: true,
      disabled: false,
      ewstClassCdItemsEdit: [], // 폐기물 분류
      ewstWasteCdItemsEdit: [], // 폐기물

      ewstDispoStCdItems: [], // 처리상태

      searchUrl: '',
      YAuiGrid: null,
    };
  },
  computed: {},
  watch: {
    'searchParam.plantCd'() {
      this.getEwstWasteCdItems(
        this.searchParam.plantCd,
        this.searchParam.ewstClassCd
      );
    },
    'searchParam.ewstClassCd'() {
      this.getEwstWasteCdItems(
        this.searchParam.plantCd,
        this.searchParam.ewstClassCd
      );
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);

    this.searchParam.reqYmdPeriod.push(
      this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      )
    );
    this.searchParam.reqYmdPeriod.push(
      this.$comm.moment().format('YYYY-MM-DD')
    );
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.ewstDispoStCdItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: '31', codeNm: this.$comm.getLangSpecInfoLabel('L0000004489') }, // 처리중
        { code: '91', codeNm: this.$comm.getLangSpecInfoLabel('L0000003850') }, // 처리완료
      ];

      // 폐기물
      this.getEwstWasteCdItems(
        this.searchParam.plantCd,
        this.searchParam.ewstClassCd
      );
      // 폐기물 분류
      this.getEwstClassCdItems();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '110',
          style: 'center-align',
        },
        // 진행상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'),
          dataField: 'ewstDispoStNm',
          width: '100',
          style: 'center-align',
        },
        // 처리일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002839'),
          dataField: 'dispoYmd',
          width: '120',
          style: 'center-align',
        },
        // 폐기물분류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003120'),
          dataField: 'ewstClassNm',
          width: '160',
          style: 'center-align',
        },
        // 폐기물
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003102'),
          dataField: 'ewstWasteNm',
          width: '160',
          style: 'left-align grid-link-cell',
        },
        // 요청부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002053'),
          dataField: 'dispoDeptNm',
          width: '120',
          style: 'center-align',
        },
        // 처리구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002816'),
          dataField: 'ewstDispoDivNm',
          width: '100',
          style: 'center-align',
        },
        // 처리량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002824'),
          dataField: 'amtGent',
          width: '100',
          style: 'right-align',
        },
        // 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'envUnitNm',
          width: '120',
          style: 'center-align',
        },
        // 처리단가
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002821'),
          dataField: 'freightCostt',
          width: '100',
          style: 'right-align',
        },
        // 운반업체
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002072'), dataField: 'vendorNm', width: '200', style: 'left-align', },
        // 차량번호
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002797'), dataField: 'carrier', width: '200', style: 'left-align', },
        // 처리업체
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002831'), dataField: 'freightNm', width: '200', style: 'left-align', },
        // 처리방법
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002825'),
          dataField: 'ewstDispoMtdNm',
          width: '100',
          style: 'center-align',
        },
        // 회수번호
        { headerText: this.$comm.getLangSpecInfoLabel('L0000003359'), dataField: 'wgtIocnt', width: '120', style: 'left-align', },
        // 출고번호
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002904'), dataField: 'wgtOutNo', width: '120', style: 'left-align', },
        // 관련근거
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000565'), dataField: 'wgtRfno', width: '120', style: 'left-align', },
        // 반출입구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001072'),
          dataField: 'wgtIogbNm',
          width: '120',
          style: 'center-align',
        },
        // 비고(계근)
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001361'), dataField: 'wgtBigo', width: '200', style: 'left-align', },
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
          btnClicked: 'btnPopupClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      if (
        this.$store.getters.deptAuthGrp &&
        this.$store.getters.deptAuthGrp.deptAccessYn === 'N'
      ) {
        this.searchParam.dispoDeptCd = this.$store.getters.deptCd;
        this.disabled = true;
      }

      this.searchUrl =
        selectConfig.env.waste.operationLog.disposalResult.list.url;

      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
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
    getEwstClassCdItems() {
      this.$http.url = selectConfig.env.waste.baseInfo.wasteClass.list.url;
      this.$http.type = 'GET';
      this.$http.param = { useYn: 'Y' };
      this.$http.request(
        (_result) => {
          this.ewstClassCdItemsEdit = this.$_.clone(_result.data);
          this.ewstClassCdItemsEdit.splice(0, 0, {
            ewstClassCd: null,
            ewstClassNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEwstWasteCdItems(plantCd, ewstClassCd) {
      this.$http.url = selectConfig.env.waste.baseInfo.waste.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: plantCd,
        ewstClassCd: ewstClassCd,
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.ewstWasteCdItemsEdit = _result.data;
          this.ewstWasteCdItemsEdit.splice(0, 0, {
            ewstWasteNo: null,
            ewstWasteNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkClicked(data) {
      if (data === null) return;
      if (data.dataField === 'ewstWasteNm') {
        this.btnPopupClickedCallback(data.item);
      }
    },
    btnPopupClickedCallback(data) {
      let param = null;
      if (data) {
        param = data;
      } else {
        param = {
          ewstDispoResultNo: 0,
        };
      }

      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./dispoResultDetail.vue'}`);
      this.popupOptions.title = 'L0000003112'; // '폐기물 처리결과 상세 등록/수정';
      this.popupOptions.visible = true;
      this.popupOptions.param = param;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
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
