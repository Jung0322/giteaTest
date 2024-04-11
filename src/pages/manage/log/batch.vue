<!--
  목적 : 시스템 > 배치관리
  작성자 : kdk
  수정자 : jkl
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 배치ID -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001196"
            name="crudNmSearch"
            v-model="searchParam.batchCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 배치명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001198"
            name="crudNmSearch"
            v-model="searchParam.batchNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="batchYnTypeItems"
            itemText="useYnNm"
            itemValue="useYnCode"
            ui="bootstrap"
            type="search"
            label="L0000001439"
            name="useYn"
            v-model="searchParam.useYn"
          />
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
          :label="this.$comm.getLangSpecInfoLabel('L0000001195')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
          @openDetailPage="openDetailPage"
          @getList="getList"
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
  name: 'batch',
  props: {},
  data() {
    return {
      searchParam: {
        batchCd: '',
        batchNm: '',
        useYn: 'Y',
      },
      gridOptions: {
        name: 'batch',
        header: [],
        data: [],
        btns: [],
        height: '600',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      batchYnTypeItems: [],
      searchUrl: '',
      editable: false,
      YAuiGrid: null,
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
      this.searchUrl = selectConfig.manage.log.batch.list.url;

      this.batchYnTypeItems = [
        {
          useYnCode: '',
          useYnNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
        },
        {
          useYnCode: 'Y',
          useYnNm: this.$comm.getLangSpecInfoLabel('L0000001440'), // 사용
        },
        {
          useYnCode: 'N',
          useYnNm: this.$comm.getLangSpecInfoLabel('L0000001063'), // 미사용
        },
      ];

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001196'), // 배치ID
          dataField: 'batchCd',
          width: '70px',
          style: 'left-align',
          url: 'true',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001198'), // 배치명
          dataField: 'batchNm',
          width: '80px',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001199'), // 배치설명
          dataField: 'batchDesc',
          width: '100px',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001779'), // 시작일자
          dataField: 'cycleStartYmd',
          width: '50px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001069'), // 반복주기
          dataField: 'cycleDayNm',
          width: '60px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001820'), // 실행주기
          dataField: 'cycleHmNm',
          width: '60px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'), // 사용여부
          dataField: 'useYnNm',
          width: '40px',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'), // 신규등록
          color: 'orange',
          btnClicked: 'openDetailPage',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        }, // 검색
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    // 리스트 검색
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /Button Event **/
    openDetailPage(data) {
      this.popupOptions.target = () => import(`${'./batchDetail.vue'}`);
      this.popupOptions.title = 'L0000004579'; // 배치관리
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        batchCd: data ? data.batchCd : '',
      };
    },
    // 상세 팝업
    cellClickHandler(event) {
      if (event.dataField !== 'batchCd') return;
      this.openDetailPage(event.item);
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
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
