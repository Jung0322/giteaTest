<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 년도 -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000000829"
            name="year"
            v-model="searchParam.year"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작성여부 -->
          <y-select
            :width="8"
            :comboItems="saveItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002351"
            name="ghgFcltCd"
            v-model="searchParam.isSave"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 배출시설분류 -->
          <y-select
            :width="8"
            :comboItems="disFacItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001175"
            name="ghgFcltCd"
            v-model="searchParam.ghgFcltCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!--배출시설명-->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001174"
            name="fcltNm"
            v-model="searchParam.fcltNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 배출시설 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001170')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkAccidentTitleClicked"
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
  /* attributes: name, components, props, data */
  name: 'y-fac-cal-by-year',
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '', // 사업장
        fcltNm: '', // 배출시설명
        year: '',
        ghgFcltCd: '',
        isSave: '',
      },
      gridOptions: {
        name: 'facCalByYear',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '90%',
        top: '10px',
        closeCallback: null,
      },
      editable: false,
      disFacItems: [],
      saveItems: [],
      searchUrl: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
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
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam.year = this.$comm.getToday().substring(0, 4);
      // 그리드 헤더 설정
      this.gridOptions.header = [
        { /* 사업장 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '150',
          style: 'left-align',
        },
        { /* 년도 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000000829'),
          dataField: 'year',
          width: '100',
          style: 'center-align',
        },
        { /* 배출시설분류 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001175'),
          dataField: 'ghgFcltNm',
          width: '140',
          style: 'left-align',
        },
        { /* 배출시설명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001174'),
          dataField: 'fcltNm',
          width: '150',
          style: 'left-align grid-link-cell',
        },
        { /* NGMS시설일련번호 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000000136'),
          dataField: 'ngmsFceqNum',
          width: '200',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002351'),
          dataField: 'isSave',
          width: '100',
          style: 'center-align',
        } /* 작성여부 */,
        { /* 산정자 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001512'),
          dataField: 'updateUserNm',
          width: '150',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001511'),
          dataField: 'updateDt',
          width: '150',
          style: 'center-align',
        } /* 산정일시 */,
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
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];
      
      this.saveItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];

      this.$comm.getComboItems('GHG_FAC_DATA', true).then((_result) => {
        this.disFacItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList();
    },
    tableLinkAccidentTitleClicked(data) {
      if (!data) return;
      if (data.dataField === 'fcltNm') {
        this.popupOptions.target = () => import(`${'./facCalByYearDetail.vue'}`);
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
        this.popupOptions.title = 'L0000001510'; /* 산정매개변수 */
        this.popupOptions.param = {
          ghgFcltNo: data.item.ghgFcltNo,
          year: data.item.year,
        };
      }

    },
    getList() {
      this.$http.url = selectConfig.env.gas.facFacYear.list.url;
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
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === null || data === undefined) return;
      this.getList();
    },
    btnSearchClickedCallback() {
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 370;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
