<!--
  목적 : 평가및안전보건비용 현황
  작성자 : pkj 
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box
      v-if="!this.popupParam.popupMode"
      :gridOptions="gridOptions"
      @enter="getList"
    >
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
            name="year"
            label="L0000004449"
            :default="searchParam.year"
            v-model="searchParam.year"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row class="mt-3 h-100">
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <div class="float-right mb-1">
             검색 
            <y-btn
              v-if="!this.popupParam.popupMode"
              title="L0000000327"
              color="green"
              @btnClicked="getList"
            />
          </div>
           평가및안전보건비용 현황 -
          <y-data-table
            label="L0000005175"
            ref="dataTable"
            class="mergeTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :span-options="gridOptions.merge"
            :rowClassName="tableRowClassName"
            @tableLinkClicked="tableLinkClicked"
          ></y-data-table>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005175')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getList="getList"
          @cellClick="cellClickHandler"
          @closePopup2="closePopup2"
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
  props: {
    popupParam: {
      type: Object,
      default: () => {
        return {
          popupMode: false,
          year: '',
          plantCd: null,
        };
      },
    },
  },
  data() {
    return {
      searchParam: {
        plantCd: '',
        year: '',
        allSearchYn: 'Y',
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
        name: 'vendorStatus',
        btns: [],
        header: [],
        data: [],
        height: '600',
        merge: [],
      },
      YAuiGrid: null,
      editable: true,
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
    init() {
      this.editable = this.$route.meta.editable;

      this.searchParam.year = this.$comm.moment().format('YYYY');
      this.searchUrl = selectConfig.vendor.assmnSfhlc.status.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      if (this.popupParam.popupMode) {
        this.searchParam.plantCd = this.popupParam.plantCd;
        this.searchParam.year = this.popupParam.year;
      }
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup2',
        }, // 닫기
      ];
      this.getList();
    },
    getHeaders() {
      this.gridOptions.merge = [{ index: 1, field: 'plant_nm' }];

      this.gridOptions.header = [];
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
        dataField: 'plant_nm',
        width: '10%',
        cellMerge: true,
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
        dataField: 'gubun',
        width: '10%',
      });
      this.getYearHeader();
      this.gridOptions.header.push({
        // 합계
        headerText: this.$comm.getLangSpecInfoLabel('L0000003180'),
        dataField: 'total',
        width: '9%',
        style: 'right-align',
        styleFunction: (
          rowIndex,
          columnIndex,
          value,
          headerText,
          item,
          dataField
        ) => {
          if (item.gubun === '평가 실시율(%)') {
            return 'row-color3';
          } else if (item.gubun === '산업안전보건비 반영율(%)') {
            return 'row-color3';
          } else if (item.plant_nm === '합계') {
            return 'row-color3';
          } else {
            return 'row-color2';
          }
        },
      });
    },
    getYearHeader() {
      // 다국어 처리 '년'
      let langYear = this.$comm.getLangSpecInfoLabel('L0000000828');
      // 다국어 처리 '월'
      let langMonth = this.$comm.getLangSpecInfoLabel('L0000002108');
      let from = this.$comm.moment(this.searchParam.year);
      var yearText = from.format('YYYY') + langYear;
      var header = { headerText: yearText, align: 'center', children: [] };
      for (let i = 1; i < 13; i++) {
        header.children.push({
          headerText: i + langMonth,
          dataField: 'mon' + String(i),
          width: '6%',
          style: 'right-align',
          styleFunction: (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item,
            dataField
          ) => {
            if (item.gubun === '평가 실시율(%)') {
              return 'row-color3';
            } else if (item.gubun === '산업안전보건비 반영율(%)') {
              return 'row-color3';
            } else if (item.plant_nm === '합계') {
              return 'row-color3';
            } else {
              return 'row-color2';
            }
          },
        });
      }
      this.gridOptions.header.push(this.$_.clone(header));
    },
    getList() {
      if (!this.searchParam.year) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'L0000005132' /* 대상년도를 선택해주세요. */,
          type: 'warning',
        });
        return;
      }
      if (!this.searchParam.plantCd) {
        this.searchParam.allSearchYn = 'Y';
      } else {
        this.searchParam.allSearchYn = 'N';
      }
      this.getHeaders();
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 295;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    tableRowClassName({ row, rowIndex }) {
      let retStyle = '';

      if (row.plant_nm === '합계') {
        retStyle += 'row-eval-background-color';
      }

      if (
        row.gubun === '평가 실시율(%)' ||
        row.gubun === '산업안전보건비 반영율(%)'
      ) {
        retStyle += ' row-pointer';
      }

      return retStyle;
    },

    disabledFn(header, row, index) {
      if (row.plant_nm === '합계') {
        return false;
      }

      return true;
    },
    cellClickHandler(event) {
      if (event.dataField === 'plant_nm') return;
      if (event.dataField === 'gubun') return;
      if (event.item.gubun === '평가 실시율(%)') return;
      if (event.item.gubun === '산업안전보건비 반영율(%)') return;
      if (event.item.plant_nm === '합계') return;
      event.item.searchFlag = event.item.sortOrder;
      // 조회 사업장(total = 합계)
      event.item.plantCd = event.item.plant_cd;
      // 대상년도
      event.item.year = this.searchParam.year;
      // 월별 구분
      if (event.dataField === 'total') {
        event.item.monFlag = 'mon100';
      } else {
        event.item.monFlag = event.dataField;
      }
      // 숫자가 아닌 문자열을 매칭하는 정규식
      var regex = /[^0-9]/g;
      event.item.monFlag = event.item.monFlag.replace(regex, '');
      this.openStatusPopup(event.item);
    },
    tableLinkClicked(header, data) {
      // 구분 분류
      data.searchFlag = data.sortOrder;
      // 조회 사업장(total = 합계)
      data.plantCd = data.plant_cd;
      // 대상년도
      data.year = this.searchParam.year;
      // 월별 구분
      if (header.name === 'total') {
        data.monFlag = 'mon100';
      } else {
        data.monFlag = header.name;
      }
      // 숫자가 아닌 문자열을 매칭하는 정규식
      var regex = /[^0-9]/g;
      data.monFlag = data.monFlag.replace(regex, '');
      this.openStatusPopup(data);
    },

    openStatusPopup(data) {
      if (!data) return;
      this.popupOptions.target = () => import(`${'./statusPopup.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000003251'; // '협력업체 목록';
      this.popupOptions.param = data;

      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    closePopup2() {
      this.$emit('closePopup', '');
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
