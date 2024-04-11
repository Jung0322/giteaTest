<!--
  목적 : 최신개정법규 조회
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 공포일자 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000004234"
            name="period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 법령명 -->
          <y-select
            :width="8"
            :comboItems="lkeyItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            name="lnameKor"
            label="L0000004235"
            v-model="searchParam.lkey"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             검색
            <y-btn title="L0000000327" color="green" @btnClicked="getDataList" />
          </div>
           개정법규 목록
          <y-data-table
            label="L0000004236"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
          >
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004236')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
          @getDataList="getDataList"
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
  name: 'lawRevisionList2',
  props: {},
  data() {
    return {
      searchParam: {
        period: [],
        lkey: '',
      },
      gridOptions: {
        name: 'lawRevisionList2',
        header: [],
        btns: [],
        data: [],
        height: '550',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '70%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      lkeyItems: [],
      searchUrl: '',
      comboUrl: '',
    };
  },
  watch: {
    'searchParam.period': function (newValue, oldValue) {
      console.log('111111', this.searchParam.period);
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004235'),
          dataField: 'lnameKor',
          width: '12%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004237'),
          dataField: 'mgrGov',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002614'),
          dataField: 'revDiv',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004238'),
          dataField: 'ltypeNm',
          width: '12%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004239'),
          dataField: 'promNum',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004234'),
          dataField: 'promDate',
          width: '12%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004240'),
          dataField: 'enfDate',
          width: '12%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004241'),
          dataField: 'lstepNm',
          width: '12%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',
        },
      ];

      // 공포일자 초기값 설정
      var from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '0m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '3m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );

      this.searchParam.period = [from, to];

      // URL 설정
      this.searchUrl = selectConfig.lawRevisionlist.list.url;
      this.comboUrl = selectConfig.lawRevisionlist.combo.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getComboItems(); // 법령명
      this.getDataList(); // 개정법규 목록
    },
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));

          this.$comm.pushCookie(this.searchParam);
          console.log('dfd', this.searchParam.period);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getComboItems() {
      this.$http.url = this.comboUrl;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.lkeyItems = this.$_.clone(_result.data);
          this.lkeyItems.splice(0, 0, {
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
            code: '',
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField !== 'lnameKor') return;
      this.popupOptions.target = () => import(`${'./lawRevisionDetail.vue'}`);
      this.popupOptions.title = 'L0000004680';
      this.popupOptions.visible = true;
      this.popupOptions.width = '95%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        legiKey: event.item.legiKey,
        lnameKor: event.item.lnameKor,
        promNum: event.item.promNum,
        promDate: event.item.promDate,
        enfDate: event.item.enfDate,
        revDiv: event.item.revDiv,
        ltypeNm: event.item.ltypeNm,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkClicked(header, data) {
      this.popupOptions.target = () => import(`${'./lawRevisionDetail.vue'}`);
      this.popupOptions.title = 'L0000004680';
      this.popupOptions.visible = true;
      this.popupOptions.width = '95%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        legiKey: data.legiKey,
        lnameKor: data.lnameKor,
        promNum: data.promNum,
        promDate: data.promDate,
        enfDate: data.enfDate,
        revDiv: data.revDiv,
        ltypeNm: data.ltypeNm,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
  },
};
</script>
