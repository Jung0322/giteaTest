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
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="isTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000568"
            name="isTypeCd"
            v-model="searchParam.isTypeCd"
          ></y-select>
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
          <y-data-table
            label="L0000004996"
            ref="dataTable"
            class="mergeTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :span-options="gridOptions.merge"
            @tableLinkClicked="tableLinkClicked"
            :rowClassName="tableRowClassName"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000004996')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
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
  name: 'SHEFrontendEduResultStatus',
  components: {},
  props: {
    popupParam: {
      type: Object,
      default: () => {
        return {
          plantCd: null,
          year: '',
          popupMode: false,
        };
      },
    },
  },
  data() {
    return {
      searchParam: {
        plantCd: '',
        year: '',
        isTypeCd: '',
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
        name: 'eduResultStatus',
        btns: [],
        header: [],
        data: [],
        height: '600',
        merge: [],
      },
      YAuiGrid: null,
      editable: true,
      isTypeItems: [],
      searchUrl: '',
    };
  },

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
  destroyed() {},

  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.saf.education.resultEdu.status.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (
        typeof searchParamByCookie !== 'undefined' &&
        !this.popupParam.popupMode
      ) {
        this.searchParam = searchParamByCookie;
      }
      this.searchParam.year = this.$comm.moment().format('YYYY');

      // 관련법규 ()
      this.$comm.getComboItems('MGT_LAW_CLASS', true).then((_result) => {
        this.isTypeItems = _result;
      });
      if (this.popupParam.popupMode) {
        this.searchParam.year = this.popupParam.year;
        this.searchParam.plantCd = this.popupParam.plantCd;
      }
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ]
      this.getList();
    },
    getHeaders() {
      this.gridOptions.merge = [
        { index: 1, field: 'plant_nm' },
        { index: 2, field: 'is_type_nm' },
      ];

      this.gridOptions.header = [];
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
        dataField: 'plant_nm', 
        width: '7%', 
        cellMerge: true,
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000000568'), 
        dataField: 'is_type_nm', 
        width: '10%', 
        cellMerge: true,
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), 
        dataField: 'gubun', 
        width: '10%', 
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000005400'), 
        dataField: 'oldCnt', 
        width: '10%', 
        styleFunction: (rowIndex, columnIndex, value, headerText, item, dataField) => {
          if (item.gubun === '교육 이수율(%)' || item.plant_nm === '합계') {
            return "row-color3";
          }
          else {
            return "row-color2";
          }                   
        },
      });
      this.getYearHeader();
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000003180'), 
        dataField: 'total', 
        style: 'right-align',
        width: '7%', 
        styleFunction: (rowIndex, columnIndex, value, headerText, item, dataField) => {
          if (item.gubun === '교육 이수율(%)' || item.plant_nm === '합계') {
            return "row-color3";
          }
          else {
            return "row-color2";
          }                   
        },
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000005399'), 
        dataField: 'allCnt', 
        width: '7%', 
        style: 'right-align',
        styleFunction: (rowIndex, columnIndex, value, headerText, item, dataField) => {
          if (item.gubun === '교육 이수율(%)' || item.plant_nm === '합계') {
            return "row-color3";
          }
          else {
            return "row-color2";
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
          width: '5%', 
          style: 'right-align',
          styleFunction: (rowIndex, columnIndex, value, headerText, item, dataField) => {
            if (item.gubun === '교육 이수율(%)' || item.plant_nm === '합계') {
              return "row-color3";
            }
            else {
              return "row-color2";
            }                   
          },
        });
      }
      this.gridOptions.header.push(this.$_.clone(header));
    },
    cellClickHandler(event) {
      if (event.dataField === 'plant_nm') return;
      if (event.dataField === 'is_type_nm') return;
      if (event.dataField === 'gubun') return;
      if (event.item.gubun === '교육 이수율(%)') return;
      if (this.searchParam.regRegdemCd) {
        event.item.regRegdemCd = this.searchParam.regRegdemCd;
      }
      if (event.item.gubun === '교육 이수자(명)') {
        event.item.completCheckYn = 'Y';
      }
      if (event.dataField === 'total') {
        event.item.monFlag = 'mon100';
      }
      else if (event.dataField === 'oldCnt') {
        event.item.monFlag = 'mon200';
      }
      else if (event.dataField === 'allCnt') {
        event.item.monFlag = 'mon300';
      }
      else {
        event.item.monFlag = event.dataField;
      }
      var regex = /[^0-9]/g; // 숫자가 아닌 문자열을 매칭하는 정규식
      event.item.monFlag = event.item.monFlag.replace(regex, '');
      this.openPopup(event.item);
    },
    tableLinkClicked(header, data) {
      if (this.searchParam.regRegdemCd) {
        data.regRegdemCd = this.searchParam.regRegdemCd;
      }
      if (data.gubun === '교육 이수자(명)') {
        data.completCheckYn = 'Y';
      }
      if (header.name === 'total') {
        data.monFlag = 'mon100';
      }
      else if (header.name === 'oldCnt') {
        data.monFlag = 'mon200';
      }
      else if (header.name === 'allCnt') {
        data.monFlag = 'mon300';
      }
      else {
        data.monFlag = header.name;
      }
      var regex = /[^0-9]/g; // 숫자가 아닌 문자열을 매칭하는 정규식
      data.monFlag = data.monFlag.replace(regex, '');
      this.openPopup(data);
    },
    openPopup(data) {
      if (data) {
        data.year = this.searchParam.year;
        data.isTypeCd = data.is_type_cd;
      }

      this.popupOptions.target = () =>
        import(`${'./eduResultStatusPopup.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000000290'; // '개인별 교육현황 목록'
      this.popupOptions.param = data ? data : { monFlag: 'mon100' };

      this.popupOptions.closeCallback = this.closePopup;
    },

    tableRowClassName({ row, rowIndex }) {
      let retStyle = '';

      if (row.plant_nm === '합계') {
        retStyle += 'row-eval-background-color';
      }

      if (row.gubun === '교육 이수율(%)') {
        retStyle += ' row-pointer';
      }

      return retStyle;
    },
    getList() {
      if (!this.searchParam.plantCd) {
        this.searchParam.totalFlag = 'Y';
      } else {
        this.searchParam.totalFlag = '';
      }
      this.getHeaders();
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          if (!this.popupParam.popupMode) {
            this.gridOptions.btns[0].visible = false;
            this.$comm.pushCookie(this.searchParam);
          }
          this.YAuiGrid.setGridData(this.$_.clone(_result.data))
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
.row-color{
  color: red !important;
}
.row-color2{
  color: #0A85E7 !important;
}
.row-color3{
  color: #333333 !important;
}
</style>
