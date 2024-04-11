<!--
  목적 : 폐기물-폐기물 발생 현황
  작성자 : khk
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
          <!-- 연도 -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000001991"
            name="measureYear"
            v-model="searchParam.measureYear"
            :default="searchParam.measureYear"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 폐기물분류 -->
          <y-select
            :width="8"
            :comboItems="ewstClassCdItems"
            itemText="ewstClassNm"
            itemValue="ewstClassCd"
            ui="bootstrap"
            name="ewstClassCd"
            label="L0000003120"
            v-model="searchParam.ewstClassCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 폐기물 -->
          <y-select
            :width="8"
            :comboItems="ewstWasteNoItems"
            itemText="ewstWasteNm"
            itemValue="ewstWasteNo"
            ui="bootstrap"
            name="ewstWasteNo"
            label="L0000003102"
            v-model="searchParam.ewstWasteNo"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 요청부서 -->
          <y-tree-dept
            type="search"
            label="L0000002053"
            name="deptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 폐기물 발생 현황 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003105')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'wst-gen-status',
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '',
        measureYear: '',
        ewstClassCd: '',
        ewstWasteNo: '',
        deptCd: '',
      },
      gridOptions: {
        name: 'wstGenStatus',
        header: [],
        data: [],
        btns: [],
        height: '350',
        merge: [],
      },
      searchUrl: '',
      plantItems: [], // 사업장
      ewstClassCdItems: [],
      ewstWasteNoItems: [],
      ewstWasteCdItems: [],
      YAuiGrid: null,
    };
  },
  computed: {},
  watch: {
    'searchParam.ewstClassCd': function (newValue, oldValue) {
      this.getEwstWasteNoItems();
    },
    'searchParam.plantCd': function (newValue, oldValue) {
      this.getEwstWasteNoItems();
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);

    this.searchParam.measureYear = this.$comm.moment().format('YYYY');
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
      // 선택항목 설정
      this.getEwstClassCdItems();
      this.getEwstWasteNoItems();
      this.getEwstWasteCdItems();

      this.gridOptions.merge = [];

      this.gridOptions.merge.push(
        { index: 0, field: 'plantNm' },
        { index: 1, field: 'ewstClassNm' },
        { index: 2, field: 'ewstWasteNm' },
        { index: 3, field: 'envUnitNm' }
      );
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        }, //  검색
      ];

      this.searchUrl =
        selectConfig.env.waste.operationStatus.wstGenStatus.list.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList();
    },
    // 그리드 헤더 설정
    getHeaders() {
      this.gridOptions.merge = [
        { index: 1, field: 'plantNm' },
        { index: 2, field: 'ewstClassNm' },
        { index: 3, field: 'ewstWasteNm' },
        { index: 4, field: 'envUnitNm' },
      ];

      this.gridOptions.header = [];
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), // 사업장
        dataField: 'plantNm', 
        width: '110', 
        style: 'center-align',
        cellMerge: true,
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000003120'), // 폐기물분류
        dataField: 'ewstClassNm',
        width: '160',
        style: 'center-align',
        cellMerge: true,
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000003102'), // 폐기물
        dataField: 'ewstWasteNm',
        width: '160',
        style: 'center-align',
        cellMerge: true,
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000000870'), // 단위
        dataField: 'envUnitNm',
        width: '90',
        style: 'center-align',
        cellMerge: true,
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000001991'), // 연도
        dataField: 'year',
        width: '90',
        style: 'center-align',
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), // 부서
        dataField: 'deptNm',
        width: '110',
        style: 'center-align',
      });    
      this.getYearHeader();  
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000003180'), // 합계
        dataField: 'sum',
        width: '100',
        style: 'center-align',
      });    
    },
    getYearHeader() {
      // 다국어 처리 '월'
      let langMonth = this.$comm.getLangSpecInfoLabel('L0000002108');
      var header = { headerText: this.$comm.getLangSpecInfoLabel('L0000004752'), align: 'center', children: [] };
      for (let i = 1; i < 13; i++) {
        header.children.push({
          headerText: i + langMonth,
          dataField: 'mm' + String(i),
          width: '7%', 
          style: 'right-align',
        });
      }
      this.gridOptions.header.push(this.$_.clone(header));
    },
    getList() {
      this.getHeaders();
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
    getEwstWasteCdItems() {
      this.$http.url = selectConfig.env.waste.baseInfo.waste.list.url;
      this.$http.type = 'GET';
      this.$http.param = { useYn: 'Y' };
      this.$http.request(
        (_result) => {
          this.ewstWasteCdItems = this.$_.clone(_result.data);
          this.ewstWasteCdItems.splice(0, 0, {
            ewstWasteNo: null,
            ewstWasteNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEwstClassCdItems() {
      this.$http.url = selectConfig.env.waste.baseInfo.wasteClass.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewstClassCd: null,
            ewstClassNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          this.ewstClassCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEwstWasteNoItems() {
      this.$http.url = selectConfig.env.waste.baseInfo.waste.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        ewstClassCd: this.searchParam.ewstClassCd,
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewstWasteNo: null,
            ewstWasteNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          this.ewstWasteNoItems = _result.data;
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
