<!--
  목적 : 폐기물-폐기물 처리 현황
  작성자 : khk
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getHeaders">
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
            :comboItems="ewstWasteCdItems"
            itemText="ewstWasteNm"
            itemValue="ewstWasteNo"
            ui="bootstrap"
            name="ewstWasteNo"
            label="L0000003102"
            v-model="searchParam.ewstWasteNo"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 집계유형 -->
          <y-select
            :width="8"
            :comboItems="totalTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="totalTypeCd"
            label="L0000002790"
            v-model="searchParam.totalTypeCd"
          />
        </b-col>
      </b-row>
    </y-search-box>
    
    <!-- 폐기물 처리 현황 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003110')"
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
  name: 'wst-dispo-status',
  props: {},
  data() {
    return {
      searchParam: {
        // reqYmdPeriod: [],
        // ewstClassCd: '',
        // ewstDispoStCd: '',
        measureYear: '',
        ewstClassCd: '',
        ewstWasteNo: '',
        ewstDivCd: '',
      },
      gridOptions: {
        name: 'wstDispoStatus',
        header: [],
        data: [],
        btns: [],
        height: '350',
        merge: [],
      },
      ewstClassCdItems: [], // 폐기물 분류 아이템
      totalTypeItems: [], // 집계유형 아이템
      ewstWasteCdItems: [], // 폐기물
      searchUrl: '',
      editable: false,
    };
  },
  computed: {},
  watch: {
    'searchParam.ewstClassCd': function (newValue, oldValue) {
      this.getEwstWasteNoItems();
    },
  },
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
  methods: {
    init() {
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.totalTypeItems = [
        { code: '01', codeNm: this.$comm.getLangSpecInfoLabel('L0000002824') }, // 처리량
        { code: '02', codeNm: this.$comm.getLangSpecInfoLabel('L0000003664') }, // 업체별 운반처리량
      ];

      this.editable = this.$route.meta.editable;

      this.searchParam.measureYear = this.$comm.moment().format('YYYY');
      this.searchParam.totalTypeCd = '01';
      this.searchUrl =
        selectConfig.env.waste.operationLog.dailyReport.wstDispoStatus.list.url;

      // 폐기물
      this.getEwstWasteCdItems();
      // 폐기물 분류
      this.getEwstClassCdItems();
      
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        }, //  검색
      ];

      this.getHeaders();
    },
    getHeaders() {
      this.gridOptions.merge = [];
      this.gridOptions.header = [];

      // 다국어 처리 '월'
      let langMonth = this.$comm.getLangSpecInfoLabel('L0000002108');

      this.gridOptions.merge.push({ index: 0, field: 'plant_nm' });

      if (this.searchParam.totalTypeCd === '01') {
        // 사업장
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plant_nm',
          width: '120',
          style: 'center-align',
          cellMerge: true,
        });
        // 폐기물분류
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000003120'),
          dataField: 'ewst_class_nm',
          width: '160',
          style: 'left-align',
        });
        // 폐기물
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000003102'),
          dataField: 'ewst_waste_nm',
          width: '160',
          style: 'left-align',
        });
        // 단위
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'env_unit_nm',
          width: '80',
          style: 'center-align',
        });
        // 연도
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000001991'),
          dataField: 'year',
          width: '80',
          style: 'center-align',
        });

        this.getYearHeader();  
        // 합계
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000003180'),
          dataField: 'sum',
          width: '95',
          style: 'center-align',
        });
      } else {
        this.gridOptions.merge.push({ index: 0, field: 'plant_nm' });
        // 사업장
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plant_nm',
          width: '160',
          style: 'center-align',
        });
        // 운반업체
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000002072'),
          name: 'freight_nm',
          width: '160',
          style: 'left-align',
        });
        // 처리업체
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000002831'),
          name: 'vendor_nm',
          width: '160',
          style: 'left-align',
        });
        // 폐기물분류
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000003120'),
          name: 'ewst_class_nm',
          width: '160',
          style: 'left-align',
        });
        // 폐기물
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000003102'),
          name: 'ewst_waste_nm',
          width: '160',
          style: 'center-align',
        });
        // 단위
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          name: 'env_unit_nm',
          width: '100',
          style: 'center-align',
        });
        // 년도
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000001991'),
          name: 'year',
          width: '100',
          style: 'center-align',
        });

        this.getYearHeader();  
        // 합계
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000003180'),
          name: 'sum',
          width: '100',
          style: 'center-align',
        });
      }
    },
    getYearHeader() {
      // 다국어 처리 '월'
      let langMonth = this.$comm.getLangSpecInfoLabel('L0000002108');
      var header = { headerText: this.$comm.getLangSpecInfoLabel('L0000004752'), align: 'center', children: [] }; // 폐기물 처리량
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
            ewstWasteNm:
              this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
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
          this.ewstWasteCdItems = _result.data;

          if (
            this.$_.findIndex(this.ewstWasteCdItems, {
              ewstWasteNo: this.searchParam.ewstWasteNo,
            }) === -1
          ) {
            this.searchParam.ewstWasteNo = null;
          }
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
