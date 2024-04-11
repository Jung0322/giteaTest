<!--
  목적 : 폐기물-폐기물 분류
  작성자 : khk
  Detail : 폐기물 분류
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 폐기물분류명 -->
          <y-text
            :width="8"
            :maxlength="30"
            ui="bootstrap"
            label="L0000003121"
            name="ewstClassNm"
            v-model="searchParam.ewstClassNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 폐기물구분 -->
          <y-select
            :width="8"
            :comboItems="ewstDivCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="ewstDivCd"
            label="L0000003118"
            v-model="searchParam.ewstDivCd"
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
    <!-- 폐기물 분류 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003108')"
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
  name: 'waste-class',
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '',
        useYn: 'Y',
        ewstClassNm: '',
        ewstDivCd: '',
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
        name: 'wasteClass',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },

      ewstDivCdItems: [],
      useItems: [],
      editable: true,

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
      // 폐기물구분
      this.$comm.getComboItems('EWST_DIV', true).then((_result) => {
        this.ewstDivCdItems = _result;
      });

      this.useItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 폐기물분류코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003122'),
          dataField: 'ewstClassCd',
          width: '17%',
          style: 'center-align',
        },
        // 폐기물분류명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003121'),
          dataField: 'ewstClassNmOld',
          width: '17%',
          style: 'left-align grid-link-cell',
        },
        // 폐기물구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003118'),
          dataField: 'ewstDivNm',
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

      this.searchUrl = selectConfig.env.waste.baseInfo.wasteClass.list.url;

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
      if (data.dataField === 'ewstClassNmOld') {
        this.btnPopupClickedCallback(data.item);
      }
    },
    btnPopupClickedCallback(data) {
      let wasteClass = {};
      if (data) {
        wasteClass = data;
      }
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./wasteClassDetail.vue'}`);
      this.popupOptions.title = 'L0000003107'; //
      this.popupOptions.visible = true;
      this.popupOptions.param = wasteClass;

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
