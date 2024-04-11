<!--
  목적 : 환경 > 온실가스 > 할당량 관리
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
          <!-- 대상연도 -->
          <y-datepicker
            :width="8"
            :range="true"
            type="year"
            label="L0000002373"
            name="period"
            default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 할당량 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004431')"
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
  name: 'operation-log',
  data() {
    return {
      searchParam: {
        plantCd: '',
        period: [],
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
        name: 'allocMgt',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },
      editable: true,
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

      this.searchParam.period.push(this.$comm.moment().format('YYYY'));

      this.searchParam.period.push(
        this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '1y',
          'YYYY',
          'YYYY'
        )
      );

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '12%',
          style: 'center-align',
        },
        // 대상연도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004432'),
          dataField: 'year',
          width: '12%',
          style: 'center-align grid-link-cell',
        },

        // 전년도 이월량(tCO2-eq)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004433'),
          dataField: 'prevAmount',
          width: '13%',
          style: 'right-align',
          dataType: 'numeric',
          formatString: '#,###.#',
        },
        // 할당량(tCO2-eq)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004434'),
          dataField: 'amount',
          width: '13%',
          style: 'right-align',
          dataType: 'numeric',
          formatString: '#,###.#',
        },
        // 월 예상배출량(tCO2-eq)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004435'),
          dataField: 'estEmissions',
          width: '13%',
          style: 'right-align',
          dataType: 'numeric',
          formatString: '#,###.#',
        },
        // 차년도 이월량(tCO2-eq)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004436'),
          dataField: 'nextAmount',
          width: '13%',
          style: 'right-align',
          dataType: 'numeric',
          formatString: '#,###.###',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '12%',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '12%',
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

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },

    getList() {
      this.$http.url = selectConfig.env.gas.alloc.list.url;
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
      if (data.dataField === 'year') {
        this.btnPopupClickedCallback(data.item);
      }
    },
    btnPopupClickedCallback(data) {
      this.popupOptions.target = () => import(`${'./allocMgtDetail.vue'}`);
      this.popupOptions.title = 'L0000004437'; // 할당량 관리 등록
      this.popupOptions.param = {
        ghgAllocNo: data ? data.ghgAllocNo : 0,
      };
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopup;
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
