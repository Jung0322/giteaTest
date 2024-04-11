<!--
  목적 : 오염방지시설관리 
  작성자 : kkc (2021-02-18 수정 etg)
  Detail : 오염방지시설 목록 조회 화면
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
          <!-- 관리부서 -->
          <y-tree-dept
            type="search"
            label="L0000000591"
            name="deptCd"
            v-model="searchParam.deptCd"
            :plantCd="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 시설명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001743"
            name="searchEwtrPreventFacNm"
            v-model="searchParam.ewtrPreventFacNm"
          />
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
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002989')"
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
  /* attributes: name, components, props, data */
  name: 'prevent-base',
  components: {},
  props: {},
  data() {
    return {
      gridOptions: {
        name: 'preventBase',
        header: [],
        data: [],
        btns: [],
        height: '350',
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
      searchParam: {
        plantCd: '', // 사업장
        ewtrPreventFacNm: '', // 시설명
        deptCd: '', // 관리부서
        useYn: 'Y',
      },
      useItems: [],
      editable: true,
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
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.useItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), dataField: 'plantNm', width: '110', style: 'left-align', },
        // 방지시설명
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001117'), dataField: 'ewtrPreventFacNm', width: '200', style: 'left-align grid-link-cell', },
        // 처리방법명
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002826'), dataField: 'ewtrDispoMtdNm', width: '200', style: 'left-align', },
        // 관리부서
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000591'), dataField: 'deptNm', width: '150', style: 'left-align', },
        // 클린센터
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002988'), dataField: 'ewtrCleanFacNm', width: '150', style: 'left-align', },
        // 용량
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002061'), dataField: 'vol', width: '100', style: 'center-align', },
        // 단위
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000870'), dataField: 'unitNm', width: '100', style: 'center-align', },
        // 비고
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), dataField: 'remark', width: '200', style: 'left-align', },
        // 사용여부
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001439'), dataField: 'useYnNm', width: '100', style: 'center-align', },
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
      this.$http.url = selectConfig.env.water.facility.preventFac.list.url;
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
    tableLinkClicked(data) {
      if (data === null) return;
      if (data.dataField === 'ewtrPreventFacNm') {
        this.btnPopupClickedCallback(data.item);
      }
    },
    btnPopupClickedCallback(data) {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./preventBaseDetail.vue'}`);
      this.popupOptions.title = 'L0000002024'; // '오염방지시설 상세 등록/수정';
      this.popupOptions.visible = true;
      this.popupOptions.param = data ? data : {
        ewtrPreventFacNo: 0,
        disabled: false,
      };
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
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>