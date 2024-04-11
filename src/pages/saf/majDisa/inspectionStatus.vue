<!--
  목적 : 점검 > 중대시민재해점검 관리 > 점검 결과 관리 상세
  Detail : 점검결과 관리 관리 상세 화면
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
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
          <y-data-table
            label="L0000005319"
            ref="dataTable"
            class="mergeTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :span-options="gridOptions.merge"
            @tableLinkClicked="tableLinkClicked"
            :rowClassName="tableRowClassName"
            :cellClassName="tableCellClassName"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005319')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @getList="getList"
          @cellClick="cellCLickHandler"
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
        name: 'inspectionStatus',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
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

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.searchParam.year = this.$comm.moment().format('YYYY');

      this.searchUrl = selectConfig.saf.majDisaInsp.status.url;
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
        { index: 2, field: 'gubun_type' },
      ];

      this.gridOptions.header = [];
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
        dataField: 'plant_nm', 
        width: '7%', 
        cellMerge: true
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000004997'), 
        dataField: 'gubun_type', 
        width: '7%', 
        cellMerge: true
        // 평가현황
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), 
        dataField: 'gubun', 
        width: '10%', 
        // 구분
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000005400'), 
        dataField: 'oldCnt', 
        width: '7%', 
        style: 'right-align',
        styleFunction: (rowIndex, columnIndex, value, headerText, item, dataField) => {          
          if (item.gubun_type === '개선현황' && item.plant_nm !== '합계' && item.gubun !== '개선 조치율(%)') {
            if (item.gubun === '조치기한 초과(건수)' && item.oldCnt > 0) {
              return "row-color";
            } else {
              return "row-color2";
            }            
          }
          else {
            return "row-color3";
          }                   
        },
        // 전년도 누적 합계
      });
      this.getYearHeader();
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000003180'), 
        dataField: 'total', 
        width: '7%', 
        style: 'right-align',
        styleFunction: (rowIndex, columnIndex, value, headerText, item, dataField) => {          
          if (item.gubun_type === '개선현황' && item.plant_nm !== '합계' && item.gubun !== '개선 조치율(%)') {
            if (item.gubun === '조치기한 초과(건수)' && item.total > 0) {
              return "row-color";
            } else {
              return "row-color2";
            }     
          }
          else {
            return "row-color3";
          }                   
        },
        // 합계
      });
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000005399'), 
        dataField: 'allCnt', 
        width: '7%', 
        style: 'right-align',
        styleFunction: (rowIndex, columnIndex, value, headerText, item, dataField) => {
          if (item.gubun_type === '개선현황' && item.plant_nm !== '합계' && item.gubun !== '개선 조치율(%)') {
            if (item.gubun === '조치기한 초과(건수)' && item.allCnt > 0) {
              return "row-color";
            } else {
              return "row-color2";
            }     
          }
          else {
            return "row-color3";
          }                   
        },
        // 누적 합계
      });
    },

    getYearHeader() {
      // 다국어 처리 '년'
      let langYear = this.$comm.getLangSpecInfoLabel('L0000000828');
      // 다국어 처리 '월'
      let langMonth = this.$comm.getLangSpecInfoLabel('L0000002108');
      let from = this.$comm.moment(this.searchParam.year);
      var yearText = from.format('YYYY') + langYear;
      var header = { text: yearText, align: 'center', children: [] };

      for (let i = 1; i < 13; i++) {
        header.children.push({
          headerText: i + langMonth, 
          dataField: 'mon' + String(i),
          width: '5%', 
          styleFunction: (rowIndex, columnIndex, value, headerText, item, dataField) => {
            if (item.gubun_type === '개선현황' && item.plant_nm !== '합계' && item.gubun !== '개선 조치율(%)') {
              if (item.gubun === '조치기한 초과(건수)' && value > 0) {
                return "row-color";
              } else {
                return "row-color2";
              }   
            }
            else {
              return "row-color3";
            }                   
          },
        });
      }
      this.gridOptions.header.push(this.$_.clone(header));
    },
    getList() {
      this.getHeaders();
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.plant_nm === '합계') {
        return 'row-pointer row-eval-background-color';
      } else if (
        row.gubun !== '요청(건수)' &&
        row.gubun !== '조치미완료(건수)' &&
        row.gubun !== '조치기한 초과(건수)' &&
        row.gubun !== '조치완료(건수)'
      ) {
        return 'row-pointer';
      }
    },
    tableCellClassName({ row, column, rowIndex, colIndex }) {
      if (row.gubun === '조치기한 초과(건수)' && row[column.property] !== '0') {
        return 'row-color';
      }
    },
    cellCLickHandler(event) {
      if (event.item.gubun_type !== '개선현황') return;
      if (event.item.plant_nm === '합계') return;
      if (event.item.gubun === '개선 조치율(%)') return;
      event.item.subPlantCd = event.item.plantCd;
      event.item.year = this.searchParam.year;
      if (event.item.gubun_type === '개선현황') {
        if (event.item.gubun === '요청(건수)') {
          event.item.apprFlag = 'requestCnt';
        } else if (event.item.gubun === '조치미완료(건수)') {
          event.item.apprFlag = 'incompletCnt';
        } else if (event.item.gubun === '조치기한 초과(건수)') {
          event.item.apprFlag = 'overdueCnt';
        } else if (event.item.gubun === '조치완료(건수)') {
          event.item.apprFlag = 'completCnt';
        }
        if (event.item.plantCd === '합계') {
          event.item.subPlantCd = '';
        }

        event.item.imprClassCd = 'ICL40';

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
      }

      let strParam = event.item.subPlantCd;
      event.item.strParam = strParam;
      var regex = /[^0-9]/g; // 숫자가 아닌 문자열을 매칭하는 정규식
      event.item.monFlag = event.item.monFlag.replace(regex, '');
      if (event.item.gubun_type === '개선현황') {
        this.openImprPopup(event.item);
      }
    },
    tableLinkClicked(header, data) {
      data.subPlantCd = data.plantCd;
      data.year = this.searchParam.year;
      if (data.gubun_type === '개선현황') {
        if (data.gubun === '요청(건수)') {
          data.apprFlag = 'requestCnt';
        } else if (data.gubun === '조치미완료(건수)') {
          data.apprFlag = 'incompletCnt';
        } else if (data.gubun === '조치기한 초과(건수)') {
          data.apprFlag = 'overdueCnt';
        } else if (data.gubun === '조치완료(건수)') {
          data.apprFlag = 'completCnt';
        }
        if (data.plantCd === '합계') {
          data.subPlantCd = '';
        }

        data.imprClassCd = 'ICL40';

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
      }

      let strParam = data.subPlantCd;
      data.strParam = strParam;
      var regex = /[^0-9]/g; // 숫자가 아닌 문자열을 매칭하는 정규식
      data.monFlag = data.monFlag.replace(regex, '');
      if (data.gubun_type === '개선현황') {
        this.openImprPopup(data);
      }
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    openImprPopup(data) {
      this.popupOptions.target = () => import(`${'./resultmgmtImprPopup.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.height = '500';
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
.row-pointer .el-button {
  color: black !important;
  pointer-events: none;
}
.row-color .el-button {
  color: red !important;
}
.row-eval-background-color {
  background-color: #c7c7c742 !important;
}
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
