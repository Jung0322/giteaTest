<!--
  목적 : 폐기물-폐기물 처리방법
  작성자 : khk
  Detail : 폐기물 처리방법
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 처리방법 -->
          <y-text
            :width="8"
            :maxlength="30"
            ui="bootstrap"
            label="L0000002825"
            name="ewstDispoMtdNm"
            v-model="searchParam.ewstDispoMtdNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 처리분류 -->
          <y-select
            :width="8"
            :comboItems="ewstDispoClassCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="ewstDispoClassCd"
            label="L0000002829"
            v-model="searchParam.ewstDispoClassCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            label="L0000001439"
            ui="bootstrap"
            name="useYn"
            v-model="searchParam.useYn"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 폐기물 처리방법 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003114')"
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
  name: 'waste-dispo-mtd',
  props: {},
  data() {
    return {
      searchParam: {
        ewstDispoMtdNm: null,
        ewstDispoClassCd: null,
        useYn: 'Y',
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
      gridOptions: {
        name: 'wasteDispoMtd',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },
      editable: true,

      ewstDispoClassCdItems: [],
      useItems: [],
      searchUrl: '',
      YAuiGrid: null,
    };
  },
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
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // 처리분류
      this.$comm.getComboItems('EWST_DISPO_CLASS', true).then((_result) => {
        this.ewstDispoClassCdItems = _result;
      });

      this.useItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 처리방법코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002828'),
          dataField: 'ewstDispoMtdCd',
          width: '17%',
          style: 'center-align',
        },
        // 처리방법
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002825'),
          dataField: 'ewstDispoMtdNm',
          width: '17%',
          style: 'left-align grid-link-cell',
        },
        // 처리분류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002829'),
          dataField: 'ewstDispoClassNm',
          width: '17%',
          style: 'center-align',
        },
        // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '17%',
          style: 'center-align',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '16%',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '16%',
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

      this.searchUrl =
        selectConfig.env.waste.baseInfo.wasteDisposalMethod.list.url;

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
      if (!data) return;
      if (data.dataField === 'ewstDispoMtdNm') {
        this.btnPopupClickedCallback(data.item);
      }
    },
    btnPopupClickedCallback(data) {
      let wasteDispoMtd = {};
      if (data) {
        wasteDispoMtd = data;
      }
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./wasteDispoMtdDetail.vue'}`);
      this.popupOptions.title = 'L0000003113'; // 폐기물 처리방법 등록
      this.popupOptions.visible = true;
      this.popupOptions.param = wasteDispoMtd;

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
      let _height = window.innerHeight - 420;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
