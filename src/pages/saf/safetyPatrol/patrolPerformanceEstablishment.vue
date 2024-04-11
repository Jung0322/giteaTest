<!--
  목적 : 안전 > 순회 > 순회실적
  Detail : 순회실적 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 점검년도 -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000002548"
            name="year"
            :default="searchParam.year"
            v-model="searchParam.year"
          ></y-datepicker>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0 checkResult">
          <!-- <div class="float-right mb-1"> -->
          <!-- <y-btn :title="searchArea.title" color="green" @btnClicked="btnSearchVisibleClicked" /> -->
          <!-- 검색 -->
          <!-- <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getList"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div> -->
          <!-- 사업장별 순회실적 현황 -->
          <!--   <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            label="L0000001430"
            :showSummary="true"
            :useRownum="false"
            :routeName="routeName"
            @selectedRow="selectedRow"
            @tableLinkClicked="tableLinkClicked"
          ></y-data-table> -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001430')"
            :useExcelExport="false"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            @cellClick="cellClickHandler"
            :routeName="routeName"
            @selectedRow="selectedRow"
            @getList="getList"
            @btnClickedError="btnClickedErrorCallback"
          />
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import ConsolidationByYearDetail from '../consolidation/consolidationByYearDetail.vue';
export default {
  /* attributes: name, components, props, data */
  name: 'patrol-performance',
  props: {},
  data: () => ({
    searchParam: {
      year: '', // 점검년도
      plantCd: '',
    },
    searchArea: {
      title: '검색박스숨기기', // 검색박스숨기기
      show: true,
    },

    gridOptions: {
      header: [],
      data: [],
      height: 'auto',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: null,
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    searchPlantCd: '',
    searchYear: '',
    targetItems: [],
    patrolResultCdItems: [],
    editable: false,
    searchUrl: '',
    routeName: '',

    YAuiGrid: null,
  }),
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
      // Url Setting
      this.searchUrl = selectConfig.saf.patrol.status.url;

      this.routeName = this.$route.name;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), // 사업장
          dataField: 'plant_nm',
          width: '8%',
          style: 'center-align',
          // fixed: 'left',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003180'), // 합계
          dataField: 'sum',
          width: '8%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
          visible: this.editable,
        }, //  검색
      ];

      let today = this.$comm.getToday();
      this.searchParam.year = today.substring(0, 4);

      for (let i = 1; i <= 12; i++) {
        let month = i < 10 ? '0' + i : i.toString();
        this.gridOptions.header.splice(i, 0, {
          headerText: i + this.$comm.getLangSpecInfoLabel('L0000002108'), // 월
          dataField: month,
          width: '7%',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        });
      }

      this.getComboItems('SAF_ACTPART_CLS'); // 순회대상
      this.getComboItems('SAF_PATROL_RSLT_CLS'); // 순회결과

      this.getList(); // 순회 현황 조회
    },
    // combo box list
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            code: '',
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }); // 전체
          if (codeGroupCd === 'SAF_ACTPART_CLS') {
            this.targetItems = this.$_.clone(_result.data);
          } else if (codeGroupCd === 'SAF_PATROL_RSLT_CLS') {
            this.patrolResultCdItems = this.$_.clone(_result.data);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 사고 현황 검색 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.searchYear = this.$_.clone(this.searchParam.year);
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          // this.$refs.dataTable.setCurrentRow(this.gridOptions.data[0]);
          // this.selectedRow(this.gridOptions.data[0]);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /** button 관련 이벤트 **/

    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    selectedRow(data) {
      if (data) {
        this.searchPlantCd = data.plant_cd;
      } else {
        if (!this.searchPlantCd) {
          // 검색 조건이 전체인 경우는 그냥 빈값 그대로 넘기게 설정
          this.searchPlantCd = this.$_.clone(this.searchParam.plantCd);
        }
      }
    },
    cellClickHandler(header, row) {
      this.popupOptions.target = () => import(`${'./patrolResult.vue'}`);
      this.popupOptions.title = 'L0000001709'; // 순회
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: header.item.plant_cd,
        year: this.searchYear,
        month: header['dataField'] !== 'sum' ? header['dataField'] : '',
        checkStepCd: 'CHS04',
      };

      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkClicked(header, row) {
      this.popupOptions.target = () => import(`${'./patrolResult.vue'}`);
      this.popupOptions.title = 'L0000001709'; // 순회
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: row.plant_cd,
        year: this.searchYear,
        month: header['name'] !== 'sum' ? header['name'] : '',
        checkStepCd: 'CHS04',
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** end button 관련 이벤트 **/
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 335;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>

<style>
.result-row {
  background-color: #ffffb0 !important;
}
.target-row {
  background-color: #f2f5a9 !important;
}
.gubun-row {
  background-color: #d2e5a8 !important;
}
.dept-row {
  background-color: #fff29e !important;
}
.patrol .el-table__body-wrapper {
  height: 227.77px !important;
}
/* .patrolsub .el-table__body-wrapper {
  height: 382.22px !important;
} */
</style>
