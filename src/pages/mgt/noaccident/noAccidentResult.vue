<!--
  목적 : 사업장무재해목록
  작성자 : kth
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 아래 그리드 강제 설정을 위해 y-search-box 생성 -->
    <y-search-box :gridOptions="gridOptions" v-show="false"></y-search-box>

    <!-- 무재해 목록 grid -->

    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003615')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="openDetailPage"
          @openNewPage="openDetailPage()"
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
  name: 'no-accident-result',
  props: {},
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      searchParam: {
        plantCd: '',
        searchFlag: 'LIST',
      },
      gridOptions: {
        name: 'noAccidentResult',
        header: [],
        data: [],
        btns: [],
        height: 'auto',
      },
      YAuiGrid: null,
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
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.noAccidentResult.list.url;
      this.editable = this.$route.meta.editable;

      var today = this.$comm.getToday();
      var from = null; // this.$comm.getCalculatedDate(today, '-1y', 'YYYY-MM-DD', 'YYYY-MM-DD');
      var to = null; // this.$comm.getCalculatedDate(today, '1y', 'YYYY-MM-DD', 'YYYY-MM-DD');
      this.searchParam.duration = [from, to];
      this.getDataList();

      // 사업장 무재해 결과 목록 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001417'),
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
              dataField: 'plantNm',
              width: '8%',
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002233'),
              dataField: 'dayMancntSum',
              width: '8%',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001778'),
              dataField: 'startYmd',
              width: '9%',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000886'),
              dataField: 'endSchYmd',
              width: '9%',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
              dataField: 'remark',
              width: '8%',
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000792'),
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001029'),
              dataField: 'multiple',
              width: '8%',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000788'),
              dataField: 'stndDays',
              width: '8%',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003242'),
              dataField: 'totalDays',
              width: '8%',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001031'),
              dataField: 'targetDays',
              width: '8%',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002778'),
              dataField: 'progressDays',
              width: '8%',
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '9%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '9%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openNewPage',
        },
      ];
    },
    resizeGrid() {
      let _height = window.innerHeight - 275;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          // this.gridOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    tableLinkClicked(event) {
      if (event.dataField !== 'plantNm') return;
      this.openDetailPage(event.item);
    },
    openDetailPage(data) {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '90%';
      this.popupOptions.target = () => import(`${'./createNoAccident.vue'}`);
      this.popupOptions.title = 'L0000003616'; /* 사업장무재해 등록/수정 */
      this.popupOptions.visible = true;
      this.popupOptions.param = data ? data : { safNoAccidentNo: 0 };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
  },
};
</script>
