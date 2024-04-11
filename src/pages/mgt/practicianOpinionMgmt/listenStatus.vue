<!--
  목적 : 경영 > 종사자의견 관리 > 종사자의견청취 현황
  작성자 : kyk (2021-02-18 수정 etg)
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 대상년도 -->
          <y-datepicker
            :width="8"
            type="year"
            :range="false"
            name="year"
            label="L0000004449"
            :default="searchParam.year"
            v-model="searchParam.year"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="halfTypeCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000686"
            name="halfTypeCd"
            v-model="searchParam.halfTypeCd"
          ></y-select>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005085')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getList="getList"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
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
        plantCd: '',
        year: '',
        halfTypeCd: '',
        totalFlag: '',
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
      gridOptions: {
        name: 'listenStatus',
        btns: [],
        header: [],
        data: [],
        height: '550',
        merge: [],
      },
      YAuiGrid: null,
      editable: true,
      halfTypeCdItems: [], // 구분
      searchUrl: '',
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
  },
  beforeDestroy() {},
  destroyed() {},
  methods: {
    tableCellClassName({ row, column, rowIndex, colIndex }) {
      if (column.property === 'overdueCnt' && row['overdueCnt'] !== 0) {
        return 'row-color';
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.plantNm === '합계') {
        return 'row-eval-background-color';
      } else {
        return 'odd-row';
      }
    },
    disabledFn(header, row, index) {
      if (row.plantNm === '합계') {
        return false;
      }

      return true;
    },
    init() {
      this.editable = this.$route.meta.editable;
      this.getHeaders();
      this.$comm.getComboItems('MGT_HALF_TYPE', false).then((_result) => {
        this.halfTypeCdItems = _result;
      });
      this.searchParam.year = this.$comm.moment().format('YYYY');

      this.searchUrl =
        selectConfig.mgt.industrialSafetyHealthCommittee.status.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];

      this.getList();
    },
    getHeaders() {
      return new Promise((resovle) => {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004449'),
            dataField: 'year',
            width: '11%',
            cellMerge: true,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
            dataField: 'plantNm',
            width: '11%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
            dataField: 'gubun',
            width: '11%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005078'),
            dataField: 'mckCnt',
            width: '11%',
            styleFunction: (
              rowIndex,
              columnIndex,
              value,
              headerText,
              item,
              dataField
            ) => {
              if (item.plantNm === '합계') {
                return 'row-color3';
              } else {
                return 'row-color2';
              }
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005227'),
            dataField: 'statGrp',
            width: '11%',
            children: [
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000005072'),
                dataField: 'requestCnt',
                width: '11%',
                style: 'right-align',
                styleFunction: (
                  rowIndex,
                  columnIndex,
                  value,
                  headerText,
                  item,
                  dataField
                ) => {
                  if (item.plantNm === '합계') {
                    return 'row-color3';
                  } else {
                    return 'row-color2';
                  }
                },
              },
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000005073'),
                dataField: 'incompletCnt',
                width: '11%',
                style: 'right-align',
                styleFunction: (
                  rowIndex,
                  columnIndex,
                  value,
                  headerText,
                  item,
                  dataField
                ) => {
                  if (item.plantNm === '합계') {
                    return 'row-color3';
                  } else {
                    return 'row-color2';
                  }
                },
              },
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000005074'),
                dataField: 'overdueCnt',
                width: '11%',
                style: 'right-align',
                styleFunction: (
                  rowIndex,
                  columnIndex,
                  value,
                  headerText,
                  item,
                  dataField
                ) => {
                  if (item.plantNm === '합계') {
                    return 'row-color3';
                  } else if (value !== 0) {
                    return 'row-color';
                  } else {
                    return 'row-color2';
                  }
                },
              },
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000005076'),
                dataField: 'completCnt',
                width: '11%',
                style: 'right-align',
                styleFunction: (
                  rowIndex,
                  columnIndex,
                  value,
                  headerText,
                  item,
                  dataField
                ) => {
                  if (item.plantNm === '합계') {
                    return 'row-color3';
                  } else {
                    return 'row-color2';
                  }
                },
              },
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000005075'),
                dataField: 'improvement',
                width: '12%',
                style: 'right-align',
              },
            ],
          },
          // {
          // // 청취(건수)
          //   text: 'L0000005078',
          //   name: 'mckCnt',
          //   width: '80px',
          //   align: 'right',
          //   url: true,
          //   disabledFn: this.disabledFn,
          // },
        ];
        resovle();
      });
    },
    resizeGrid() {
      let _height = window.innerHeight - 300;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    getList() {
      if (!this.searchParam.year) {
        this.searchParam.year = this.$comm.moment().format('YYYY');
      }
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
    cellClickHandler(event) {
      if (event.item.plantNm === '합계') {
        event.item.plantCd = this.searchParam.plantCd;
      }
      if (!event.item.gubun_type) {
        event.item.gubun_type = this.searchParam.halfTypeCd;
      }
      event.item.imprFlag = event.dataField;
      event.item.imprClassCd = 'ICL13';
      if (event.item.plantNm === '합계') {
        return;
      }
      if (event.dataField === 'mckCnt') {
        event.item.halfTypeCd = event.item.gubun_type;
        event.item.progressStepCd = 'CMS03';

        this.openResultMgmtPopup(event.item);
      } else if (
        event.dataField === 'requestCnt' ||
        event.dataField === 'incompletCnt' ||
        event.dataField === 'overdueCnt' ||
        event.dataField === 'completCnt'
      ) {
        this.openImprPopup(event.item);
      }
    },
    openResultMgmtPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./listenResultMgmtPopup.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005228'; // '청취(건수) 목록';
      this.popupOptions.param = data;

      this.popupOptions.closeCallback = this.closePopup;
    },
    openImprPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./listenStatusImprPopup.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005000'; // '개선사항 목록';
      this.popupOptions.param = data;

      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
  },
};
</script>
<style>
.row-color {
  color: red !important;
}
.row-color2 {
  color: #0a85e7 !important;
}
.row-color3 {
  color: #333333 !important;
}
</style>
