<!--
  목적 : 대기-배출량 현황
  작성자 : PSB
  Detail : 
  *
  examples:
  *
  -->
  <template>
    <b-container fluid>
      <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
        <b-row slot="search">
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <y-plant
              type="search"
              name="plantCd"
              v-model="searchParam.plantCd"
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
            <!-- 검색기간 -->
            <y-datepicker
              :width="8"
              :range="true"
              type="month"
              label="L0000000328"
              name="searchPeriod"
              :clearable="false"
              default="searchParam.searchPeriod"
              v-model="searchParam.searchPeriod"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 배출구/시설명 -->
            <y-text
              :width="8"
              ui="bootstrap"
              type="search"
              label="L0000001145"
              name="search"
              v-model="searchParam.search"
            ></y-text>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 관리부서/작성부서 -->
            <y-tree-dept
              type="search"
              label="L0000004410"
              name="deptCd"
              v-model="searchParam.deptCd"
              :plantCd="searchParam.plantCd"
            >
            </y-tree-dept>
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
            @btnSearchClicked="btnSearchClicked"
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
        searchPeriod: [],
        eairOutletNo: 0,
        plantCd: '',
        totalTypeCd: 'EOST1',
        search: '',
        deptCd: '',
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
      totalTypeItems: [], // 집계유형
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
    this.searchParam.searchPeriod.push(this.$comm.getFirstDayThisYear());
    this.searchParam.searchPeriod.push(this.$comm.getLastDayThisYear());
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
      // 집계유형
      this.$comm.getComboItems('EAIR_OPER_STS_TYPE').then(_result => {
        this.totalTypeItems = _result;
      });
  
      this.searchUrl = selectConfig.env.air.opLog.operationstatus.url;
  
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClicked',
        },
      ];
  
      this.getList();
    },
    getHeaders() {
      this.gridOptions.merge = [];
      this.gridOptions.header = [];
  
      if (this.searchParam.totalTypeCd === 'EOST1') {
        this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000000906'); // '대기 배출량 목록';
        this.gridOptions.merge.push({ index: 0, field: 'dept_cd' });
        this.gridOptions.merge.push({ index: 1, field: 'main_disch_fac_nm' });
        this.gridOptions.merge.push({ index: 2, field: 'eair_test_item_nm' });
        // 관리부서
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'dept_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        // 배출구
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000001142'),
          dataField: 'main_disch_fac_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        // 항목
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000003199'),
          dataField: 'eair_test_item_nm',
          width: '160',
          style: 'center-align',
        });
      } else if (this.searchParam.totalTypeCd === 'EOST2') {
        // 전력
        this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000003577'); // '대기 전력 목록';
        this.gridOptions.merge.push(
          { index: 0, field: 'dept_nm' },
          { index: 1, field: 'eair_prevent_fac_nm' }
        );
        // 관리부서
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'dept_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        // 방지시설명
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000001117'),
          dataField: 'eair_prevent_fac_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
      } else if (this.searchParam.totalTypeCd === 'EOST3') {
        // 약품
        this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000003578'); // '대기 약품 목록';
        this.gridOptions.merge.push({ index: 0, field: 'dept_nm' });
        this.gridOptions.merge.push({ index: 1, field: 'eair_prevent_fac_nm' });
        this.gridOptions.merge.push({ index: 2, field: 'eair_chem_nm' });
        // 작성부서
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000002348'),
          dataField: 'dept_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        // 방지시설명
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000001117'),
          dataField: 'eair_prevent_fac_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        // 약품
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000001915'),
          dataField: 'eair_chem_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
      } else if (this.searchParam.totalTypeCd === 'EOST4') {
        // 연료
        this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000003579'); // '대기 연료 목록';
        this.gridOptions.merge.push({ index: 0, field: 'dept_nm' });
        this.gridOptions.merge.push({ index: 1, field: 'eair_fuel_nm' });
        // 관리부서
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000002348'),
          dataField: 'dept_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        // 연료명
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000002000'),
          dataField: 'eair_fuel_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
      } else if (this.searchParam.totalTypeCd === 'EOST5') {
        // 원료목록
        this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000003580'); // '대기 원료 목록';
        this.gridOptions.merge.push({ index: 0, field: 'dept_nm' });
        this.gridOptions.merge.push({ index: 1, field: 'eair_ingr_nm' });
        // 작성부서
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000002348'),
          dataField: 'dept_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        // 원료명
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000002088'),
          dataField: 'eair_ingr_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
      } else if (this.searchParam.totalTypeCd === 'EOST6') {
        // 가동시간 목록
        this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000003581'); // '대기 가동시간 목록';
        this.gridOptions.merge.push(
          { index: 0, field: 'dept_nm' },
          { index: 1, field: 'eair_disch_fac_nm' }
        );
        // 관리부서
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'dept_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
        // 배출시설명
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000001174'),
          dataField: 'eair_disch_fac_nm',
          width: '160',
          style: 'center-align',
          cellMerge: true,
        });
      }
  
      // 다국어 처리 '년'
      let langYear = this.$comm.getLangSpecInfoLabel('L0000000828');
      // 다국어 처리 '월'
      let langMonth = this.$comm.getLangSpecInfoLabel('L0000002108');
  
      var from = this.$comm.moment(this.searchParam.searchPeriod[0]);
      var yearText = from.format('YYYY') + langYear;
      var header = { headerText: yearText, style: 'center-align', children: [] };
      for (
        ;
        from <= this.$comm.moment(this.searchParam.searchPeriod[1]);
        from = from.add('months', 1)
      ) {
        if (yearText !== from.format('YYYY') + langYear) {
          this.gridOptions.header.push(this.$_.clone(header));
          yearText = from.format('YYYY') + langYear;
          header = { headerText: yearText, style: 'center-align', children: [] };
        }
  
        if (this.searchParam.totalTypeCd === 'EOST2') {
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
        } else {
          header.children.push({
            headerText: from.format('M') + langMonth,
            dataField: 'ym' + from.format('YYYYMM'),
            width: '120',
            style: 'right-align',
          });
        }
      }
      if (this.searchParam.totalTypeCd === 'EOST2') {
        this.gridOptions.header.push(this.$_.clone(header));
        this.gridOptions.header.push({
          // 합계
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
      } else {
        this.gridOptions.header.push(this.$_.clone(header));
        this.gridOptions.header.push({
          // 합계
          headerText: this.$comm.getLangSpecInfoLabel('L0000003180'),
          dataField: 'ymtotal',
          width: '120',
          style: 'right-align',
        });
      }
    },
    getList() {
      this.getHeaders();
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnSearchClicked() {
      if (
        !this.searchParam.searchPeriod[0] ||
          !this.searchParam.searchPeriod[1]
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000322', // '검색기간을 입력해주세요.',
          type: 'warning', // success / info / warning / error
        });
        return;
      }
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
  