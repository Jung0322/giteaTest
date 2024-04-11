<!--
  목적 : 수질 - 운영현황
  작성자 : kyk (2021-02-18 수정 etg)
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
            @datachange="
              (val) => {
                (searchParam.plantCd = val), getCleanItems();
              }
            "
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 집계유형 -->
          <y-select
            :width="8"
            :comboItems="totalTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000002790"
            name="totalTypeCd"
            @datachange="
              (val) => {
                (searchParam.totalTypeCd = val), getHeaders();
                getList();
              }
            "
            v-model="searchParam.totalTypeCd"
          />
        </b-col>

        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 관리부서 -->
          <y-tree-dept
            type="search"
            label="L0000000591"
            name="deptCd"
            v-model="searchParam.deptCd"
            :plantCd="searchParam.plantCd"
          >
          </y-tree-dept>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 클린센터 -->
          <y-select
            :width="8"
            :editable="editable"
            :comboItems="ewtrCleanFacItems"
            itemText="ewtrCleanFacNm"
            itemValue="ewtrCleanFacNo"
            ui="bootstrap"
            label="L0000002988"
            v-model="searchParam.ewtrCleanFacNo"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 검색기간 -->
          <y-datepicker
            :width="8"
            :editable="editable"
            type="year"
            label="L0000000328"
            name="searchPeriod"
            v-model="searchParam.searchPeriod"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 구분명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            type="search"
            label="L0000000687"
            name="search"
            v-model="searchParam.search"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="gridOptions.title"
          :enableCellMerge="true"
          :useExcelExport="false"
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
  name: 'operation-status',
  components: {},
  props: {},
  data() {
    return {
      searchParam: {
        searchPeriod: '',
        eairOutletNo: 0,
        ewtrCleanFacNo: 0,
        plantCd: '',
        totalTypeCd: 'WTCCL',
        search: '',
        deptCd: '',
        col1: 'T1',
      },
      gridOptions: {
        name: 'operationStatus',
        header: [],
        data: [],
        btns: [],
        height: 400,
        merge: [],
        title: '',
      },
      editable: true,
      eairOutletNoItems: [],
      ewtrCleanFacItems: [],
      totalTypeItems: [],
      searchUrl: '',
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
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.env.water.operationStatus.list.url;
      this.searchParam.searchPeriod = new Date().getFullYear().toString();
      this.getCleanItems();

      this.$comm.getComboItems('EWTR_CALC_CLS', false).then((_result) => {
        this.$_.forEach([null], (_item) => {
          _result.splice(this.$_.findIndex(_result, { code: _item }), 1);
        });
        this.totalTypeItems = _result;
      });
      
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      setTimeout(() => {
        this.getList();
      }, 300);
    },
    getHeaders() {
      this.gridOptions.merge = [];

      this.gridOptions.header = [];
      if (this.searchParam.totalTypeCd === 'WTCCL') {
        this.gridOptions.merge = [
          { index: 1, field: 'dept_nm' },
          { index: 2, field: 'ewtr_clean_fac_nm' },
        ];
        this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000002066'); // '용수량 현황';

        this.gridOptions.header.push({
          // 관리부서
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'dept_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        this.gridOptions.header.push({
          // 클린센터명
          headerText: this.$comm.getLangSpecInfoLabel('L0000002992'),
          dataField: 'ewtr_clean_fac_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        this.gridOptions.header.push({
          // 구분명
          headerText: this.$comm.getLangSpecInfoLabel('L0000000687'),
          dataField: 'ewtr_supl_nm',
          width: '160',
          style: 'center-align',
        });
        this.getYearHeader();
      } else if (this.searchParam.totalTypeCd === 'WTCDI') {
        this.gridOptions.merge = [
          { index: 1, field: 'dept_nm' },
          { index: 2, field: 'ewtr_clean_fac_nm' },
        ];
        this.gridOptions.header.push({
          // 관리부서
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'dept_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000003634'); // 폐수량 현황

        this.gridOptions.header.push({
          // 클린센터명
          headerText: this.$comm.getLangSpecInfoLabel('L0000002992'),
          dataField: 'ewtr_clean_fac_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        this.gridOptions.header.push({
          // 구분명
          headerText: this.$comm.getLangSpecInfoLabel('L0000000687'),
          dataField: 'ewtr_disch_nm',
          width: '160',
          style: 'center-align',
        });
        this.getYearHeader();
      } else if (this.searchParam.totalTypeCd === 'WTCEL') {
        this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000003637'); // '전력사용량 현황';
        this.gridOptions.merge = [
          { index: 1, field: 'dept_nm' },
          { index: 2, field: 'ewtr_clean_fac_nm' },
        ];
        this.gridOptions.header.push({
          // 관리부서
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'dept_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });

        this.gridOptions.header.push({
          // 클린센터명
          headerText: this.$comm.getLangSpecInfoLabel('L0000002992'),
          dataField: 'ewtr_clean_fac_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        this.gridOptions.header.push({
          // '전력량계명',
          headerText: this.$comm.getLangSpecInfoLabel('L0000002510'),
          dataField: 'ewtr_pwr_meter_nm',
          width: '160',
          style: 'center-align',
        });
        this.getYearHeaderWtcel();
      } else if (this.searchParam.totalTypeCd === 'WTCIN') {
        this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000003633'); // '원료사용량 현황';
        this.gridOptions.merge = [
          { index: 1, field: 'dept_nm' },
          { index: 2, field: 'ewtr_clean_fac_nm' },
        ];
        this.gridOptions.header.push({
          // 관리부서
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'dept_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        this.gridOptions.header.push({
          // 클린센터명
          headerText: this.$comm.getLangSpecInfoLabel('L0000002992'),
          dataField: 'ewtr_clean_fac_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        this.gridOptions.header.push({
          // '원료명',
          headerText: this.$comm.getLangSpecInfoLabel('L0000002088'),
          dataField: 'ewtr_ingr_nm',
          width: '160',
          style: 'center-align',
        });
        this.getYearHeader();
      } else if (this.searchParam.totalTypeCd === 'WTCCH') {
        this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000003632'); // '약품사용량 현황';
        this.gridOptions.merge = [
          { index: 1, field: 'dept_nm' },
          { index: 2, field: 'ewtr_clean_fac_nm' },
        ];
        this.gridOptions.header = [
          { // 관리부서
            headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
            dataField: 'dept_nm',
            width: '160',
            style: 'center-align',
            cellMerge: true,
          },
          { // 클린센터명
            headerText: this.$comm.getLangSpecInfoLabel('L0000002992'),
            dataField: 'ewtr_clean_fac_nm',
            width: '160',
            style: 'center-align',
            cellMerge: true,
          },
          { // '약품명',
            headerText: this.$comm.getLangSpecInfoLabel('L0000001922'),
            dataField: 'ewtr_chem_nm',
            width: '160',
            style: 'center-align',
          },
          { // '단위',
            headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
            dataField: 'env_unit_nm',
            width: '160',
            style: 'center-align',
          },
        ];
        this.getYearHeaderBody();
      } else if (this.searchParam.totalTypeCd === 'WTCME') {
        this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000003631'); // '자가측정 현황';
        this.gridOptions.header = [
          { // '측정일',
            headerText: this.$comm.getLangSpecInfoLabel('L0000002951'),
            dataField: 'measure_ymd',
            width: '160',
            style: 'center-align',
          },
          { // '측정지점',
            headerText: this.$comm.getLangSpecInfoLabel('L0000002957'),
            dataField: 'ewtr_mon_pos_nm',
            width: '160',
            style: 'center-align',
          },
        ];
        this.getTestItemHeader();
      }
    },
    getCleanItems() {
      this.$http.url = selectConfig.env.water.facility.wasteBasicUnit.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.searchParam.plantCd,
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewtrCleanFacNo: null,
            ewtrCleanFacNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // '전체',
          });
          this.ewtrCleanFacItems = this.$_.clone(_result.data);
          if (
            this.$_.findIndex(this.ewtrCleanFacItems, {
              ewtrCleanFacNo: this.searchParam.ewtrCleanFacNo,
            }) === -1
          ) {
            this.searchParam.ewtrCleanFacNo = null;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getTestItemHeader() {
      this.$http.url = selectConfig.env.water.operationStatus.item.url;
      this.$http.type = 'GET';
      this.$http.param = { plantCd: this.searchParam.plantCd };
      this.$http.request(
        (_result) => {
          this.$_.forEach(_result.data, (item) => {
            this.gridOptions.header.push({
              headerText: item.ewtrTestItemNm,
              dataField: item.ewtrTestItemCd,
              width: '120',
              style: 'right-align',
            });
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getYearHeader() {
      // 다국어 처리 '년'
      let langYear = this.$comm.getLangSpecInfoLabel('L0000000828');
      // 다국어 처리 '월'
      let langMonth = this.$comm.getLangSpecInfoLabel('L0000002108');
      var from = this.$comm.moment(this.searchParam.searchPeriod + '-01-01');
      var yearText = from.format('YYYY') + langYear;
      var header = { headerText: yearText, style: 'center-align', children: [] };
      for (
        ;
        from <= this.$comm.moment(this.searchParam.searchPeriod + '-12-31');
        from = from.add('months', 1)
      ) {
        if (yearText !== from.format('YYYY') + langYear) {
          this.gridOptions.header.push(this.$_.clone(header));
          yearText = from.format('YYYY') + langYear;
          header = { headerText: yearText, style: 'center-align', children: [] };
        }
        header.children.push({
          headerText: from.format('M') + langMonth,
          dataField: 'ym' + from.format('YYYYMM'),
          width: '120',
          style: 'right-align',
        });
      }
      this.gridOptions.header.push(this.$_.clone(header));
      this.gridOptions.header.push({
        // '합계',
        headerText: this.$comm.getLangSpecInfoLabel('L0000003180'),
        dataField: 'ymtotal',
        width: '120',
        style: 'right-align',
      });
    },
    getYearHeaderBody() {
      // 다국어 처리 '년'
      let langYear = this.$comm.getLangSpecInfoLabel('L0000000828');
      // 다국어 처리 '월'
      let langMonth = this.$comm.getLangSpecInfoLabel('L0000002108');
      var date = new Date();
      var from = this.$comm.moment(this.searchParam.searchPeriod + '-01-01');
      var yearText = from.format('YYYY') + langYear;
      var header = { headerText: yearText, style: 'center-align', children: [] };
      for (
        ;
        from <= this.$comm.moment(this.searchParam.searchPeriod + '-12-31');
        from = from.add('months', 1)
      ) {
        if (yearText !== from.format('YYYY') + langYear) {
          this.gridOptions.header.push(this.$_.clone(header));
          yearText = from.format('YYYY') + langYear;
          header = { headerText: yearText, style: 'center-align', children: [] };
        }
        header.children.push({
          headerText: from.format('M') + langMonth,
          width: '120',
          style: 'right-align',
          children: [
            { // '구입',
              headerText: this.$comm.getLangSpecInfoLabel('L0000003630'),
              dataField: 'x' + from.format('YYYYMM'),
              width: '100',
              style: 'center-align',
            },
            { // '사용',
              headerText: this.$comm.getLangSpecInfoLabel('L0000001440'),
              dataField: 'y' + from.format('YYYYMM'),
              width: '100',
              style: 'center-align',
            },
          ],
        });
      }
      this.gridOptions.header.push(this.$_.clone(header));
      this.gridOptions.header.push({
        // '합계',
        headerText: this.$comm.getLangSpecInfoLabel('L0000003180'),
        dataField: 'ymtotal',
        width: '120',
        style: 'right-align',
        children: [
          { // '구입',
            headerText: this.$comm.getLangSpecInfoLabel('L0000003630'),
            dataField: 'xtotal',
            width: '100',
            style: 'center-align',
          },
          { // '사용',
            headerText: this.$comm.getLangSpecInfoLabel('L0000001440'),
            dataField: 'ytotal',
            width: '100',
            style: 'center-align',
          },
        ],
      });
    },
    getYearHeaderWtcel() {
      // 다국어 처리 '년'
      let langYear = this.$comm.getLangSpecInfoLabel('L0000000828');
      // 다국어 처리 '월'
      let langMonth = this.$comm.getLangSpecInfoLabel('L0000002108');
      var from = this.$comm.moment(this.searchParam.searchPeriod + '-01-01');
      var yearText = from.format('YYYY') + langYear;
      var header = { headerText: yearText, style: 'center-align', children: [] };
      for (
        ;
        from <= this.$comm.moment(this.searchParam.searchPeriod + '-12-31');
        from = from.add('months', 1)
      ) {
        if (yearText !== from.format('YYYY') + langYear) {
          this.gridOptions.header.push(this.$_.clone(header));
          yearText = from.format('YYYY') + langYear;
          header = { headerText: yearText, style: 'center-align', children: [] };
        }
        header.children.push({
          headerText: from.format('M') + langMonth,
          width: '120',
          style: 'right-align',
          children: [
            { // '전력',
              headerText: this.$comm.getLangSpecInfoLabel('L0000003582'),
              dataField: 'x' + from.format('YYYYMM'),
              width: '100',
              style: 'center-align',
            },
            { // '금액',
              headerText: this.$comm.getLangSpecInfoLabel('L0000003583'),
              dataField: 'y' + from.format('YYYYMM'),
              width: '100',
              style: 'center-align',
            },
          ],
        });
      }
      this.gridOptions.header.push(this.$_.clone(header));
      this.gridOptions.header.push({
        // '합계',
        headerText: this.$comm.getLangSpecInfoLabel('L0000003180'),
        dataField: 'ymtotal',
        width: '120',
        style: 'right-align',
        children: [
          { // '전력',
            headerText: this.$comm.getLangSpecInfoLabel('L0000003582'),
            dataField: 'YSUM',
            width: '100',
            style: 'center-align',
          },
          { // '금액',
            headerText: this.$comm.getLangSpecInfoLabel('L0000003583'),
            dataField: 'CSUM',
            width: '100',
            style: 'center-align',
          },
        ],
      });
    },
    getList() {
      if (!this.searchParam.searchPeriod) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000322', // '검색기간을 입력해주세요.',
          type: 'warning',
        });
        return;
      }
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
