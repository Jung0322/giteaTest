<!--
  목적 : 폐기물-폐기물
  작성자 : khk
  Detail : 폐기물 관리
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
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 폐기물명 -->
          <y-text
            :width="8"
            :maxlength="30"
            ui="bootstrap"
            label="L0000003119"
            name="ewstWasteNm"
            v-model="searchParam.ewstWasteNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 처리방법 -->
          <y-select
            :width="8"
            :comboItems="ewstDispoMtdCdItems"
            itemText="ewstDispoMtdNm"
            itemValue="ewstDispoMtdCd"
            ui="bootstrap"
            name="ewstDispoMtdCd"
            label="L0000002825"
            v-model="searchParam.ewstDispoMtdCd"
          ></y-select>
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
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'waste',
  props: {},
  data() {
    return {
      gridOptions: {
        name: 'waste',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },
      searchParam: {
        plantCd: '',
        ewstClassCd: '',
        ewstWasteNm: '',
        ewstDispoMtdCd: '',
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

      ewstClassCdItems: [],
      ewstDispoMtdCdItems: [],
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
      // 선택항목 설정
      this.getEwstClassCdItems();
      this.getEwstDispoMtdCdItems();

      // 성질/상태

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
          style: 'center-align',
        },
        // 폐기물분류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003120'),
          dataField: 'ewstClassNm',
          width: '13%',
          style: 'center-align',
        },
        // 폐기물명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003119'),
          dataField: 'ewstWasteNm',
          width: '13%',
          style: 'left-align grid-link-cell',
        },
        // 처리방법
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002825'),
          dataField: 'ewstDispoMtdNm',
          width: '10%',
          style: 'center-align',
        },
        // 성질/상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001637'),
          dataField: 'ewstPhaseNm',
          width: '10%',
          style: 'center-align',
        },
        // 처리구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002816'),
          dataField: 'ewstDispoDivNm',
          width: '10%',
          style: 'center-align',
        },
        // 처리주기
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002840'),
          dataField: 'ewstDispoCyNm',
          width: '10%',
          style: 'center-align',
        },
        // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '7%',
          style: 'center-align',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
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

      this.searchUrl = selectConfig.env.waste.baseInfo.waste.list.url;

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
    getEwstDispoMtdCdItems() {
      this.$http.url =
        selectConfig.env.waste.baseInfo.wasteDisposalMethod.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewstDispoMtdCd: null,
            ewstDispoMtdNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          this.ewstDispoMtdCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkClicked(data) {
      if (!data) return;
      if (data.dataField === 'ewstWasteNm') {
        this.btnPopupClickedCallback(data.item);
      }
    },
    btnPopupClickedCallback(data) {
      let waste = {};
      if (data) {
        waste = data;
      }
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./wasteDetail.vue'}`);
      this.popupOptions.title = 'L0000003102'; // 폐기물
      this.popupOptions.visible = true;
      this.popupOptions.param = waste;

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
