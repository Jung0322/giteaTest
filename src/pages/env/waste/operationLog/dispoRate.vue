<!--
  목적 : 폐기물-부서별분배율
  작성자 : khk
  Detail : 부서별분배율
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
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            type="year"
            :range="true"
            label="L0000000767"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!--대상부서 -->
          <y-tree-dept
            type="search"
            label="L0000000927"
            name="dispoDeptCd"
            v-model="searchParam.dispoDeptCd"
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
      </b-row>
    </y-search-box>
    <!-- 부서별 분배율 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001319')"
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
  name: 'dispo-rate',
  props: {},
  data() {
    return {
      gridOptions: {
        name: 'dispoRate',
        header: [],
        data: [],
        btns: [],
        height: '350',
      },
      searchParam: {
        period: [], // 기간(점검일)
        plantCd: '',
        dispoDeptCd: '',
        ewstClassCd: '',
        ewstWasteNo: '',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: true,
      searchUrl: '',
      YAuiGrid: null,
      ewstWasteCdItemsEdit: [],
      ewstClassCdItemsEdit: [],
    };
  },
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
    this.searchParam.period.push(this.$comm.moment().format('YYYY'));
    this.searchParam.period.push(this.$comm.moment().format('YYYY'));
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  beforeDestroy() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.getEwstWasteCdItems(
        this.searchParam.plantCd,
        this.searchParam.ewstClassCd
      );

      this.getEwstClassCdItems();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
          style: 'center-align',
        },
        // 년도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000829'),
          dataField: 'year',
          width: '10%',
          style: 'center-align',
        },
        // 폐기물분류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003120'),
          dataField: 'ewstClassNm',
          width: '19%',
          style: 'center-align',
        },
        // 폐기물
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003102'),
          dataField: 'ewstWasteNm',
          width: '14%',
          style: 'left-align grid-link-cell',
        },
        // 대상부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'),
          dataField: 'deptNm',
          width: '19%',
          style: 'left-align',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '14%',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '14%',
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
      this.searchUrl = selectConfig.env.waste.operationLog.disporate.list.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
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
    tableLinkClicked(data) {
      if (data === null) return;
      if (data.dataField === 'ewstWasteNm') {
        this.btnPopupClickedCallback(data.item);
      }
    },
    btnPopupClickedCallback(data) {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./dispoRateDetail.vue'}`);
      this.popupOptions.title = 'L0000001320'; // 부서별 분배율 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        ewstWasteRateNo: data ? data.ewstWasteRateNo : 0,
        plantCd: data ? data.plantCd : this.$store.getters.plantCd,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
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
