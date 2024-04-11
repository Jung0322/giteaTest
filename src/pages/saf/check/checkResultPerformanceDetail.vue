<!--
  목적 : 안전 > 안전점검 > 안전점검실적(사업장별 세부 tab)
  Detail : 안전점검실적 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions2" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam2.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 년도(점검일) -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000000830"
            name="year"
            :default="searchParam2.year"
            v-model="searchParam2.year"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 점검종류 상세 -->
          <y-select
            :width="8"
            :comboItems="comboCheckKindItems"
            itemText="safCheckKindNm"
            itemValue="safCheckKindNo"
            ui="bootstrap"
            name="safCheckKindNo"
            label="L0000003718"
            v-model="searchParam2.safCheckKindNo"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!--점검주관부서 -->
          <y-tree-dept
            type="search"
            label="L0000002578"
            :showAllDept="true"
            :plantCd="searchPlantCd"
            v-model="searchParam2.deptCd"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 점검대상부서 -->
          <y-tree-dept
            type="search"
            label="L0000002549"
            :showAllDept="false"
            :plantCd="searchPlantCd"
            v-model="searchParam2.tgtDeptCd"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0 checkResultSub">
          <div class="float-right mb-1">
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getList"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           사업장별 세부 안전점검실적 현황 
          <y-data-table
            ref="dataTable2"
            :height="gridOptions2.height"
            :headers="gridOptions2.header"
            :items="gridOptions2.data"
            :use-paging="false"
            :useRownum="false"
            :showSummary="true"
            @tableLinkClicked="tableLinkClicked2"
            label="L0000001428"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="h100p">
          <!--   사업장별 세부 안전점검실적 현황  -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions2.name"
            :headers="gridOptions2.header"
            :btns="gridOptions2.btns"
            :height="gridOptions2.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001428')"
            :useExcelExport="false"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            :showSummary="true"
            @cellClick="cellClickHandler"
            @btnSearchClickedCallback="btnSearchClickedCallback"
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
export default {
  /* attributes: name, components, props, data */
  name: 'check-result-performance',
  props: {},
  data() {
    return {
      searchParam2: {
        year: '', // 기간(점검일)
        plantCd: '',
        tgtDeptCd: '', // 대상부서코드
        deptCd: '', // 주관부서코드
        safCheckKindNo: '', // 점검종류번호
      },
      gridOptions2: {
        name: 'checkResultPerformanceDetail',
        header: [],
        data: [],
        height: '500',
        btns: [],
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
      comboCheckKindItems: [], // 점검종류
      editable: false,
      searchUrl2: '',
      searchPlantCd: '',
      YAuiGrid: null,
    };
  },
  watch: {
    'searchParam2.plantCd'() {
      this.getComboCheckKindItems();
    },
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
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl2 = selectConfig.saf.checkResult.status2.url;

      let today = this.$comm.getToday();
      this.searchParam2.year = today.substring(0, 4);

      this.getComboCheckKindItems(); // 점검종류
      this.setGridHeader();
      this.getList();
    },

    setGridHeader() {
      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plant_nm',
          width: '150px',
          align: 'center',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003718'),
          dataField: 'saf_check_kind_nm',
          width: '150px',
          align: 'center',
        }, // 점검종류 상세
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002578'),
          dataField: 'dept_nm',
          width: '150px',
          align: 'center',
        }, // 점검주관부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002549'),
          dataField: 'tgt_dept_nm',
          width: '150px',
          align: 'center',
        }, // 점검대상부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003181'),
          dataField: 'sum_plan',
          wdith: '90px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 합계 계획
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003182'),
          dataField: 'sum_result',
          wdith: '90px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 합계 실적
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002874'),
          dataField: 'sum',
          wdith: '90px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 총합
      ];
      for (let i = 1; i < 13; i++) {
        let month = i < 10 ? '0' + i : i.toString();
        this.gridOptions2.header.splice(i + 3, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003663', {
            s1: i,
          }), // {s1}월
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000466'),
              dataField: month + '_plan',
              width: '90px',
              style: 'center-align',
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            }, // 계획

            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001810'),
              dataField: month + '_result',
              width: '90px',
              style: 'center-align',
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            }, // 실적
          ],
        });
      }

      this.gridOptions2.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        }, //  검색
      ];
    },

    /**
     * 점검종류 조회
     */
    getComboCheckKindItems() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        plantCd: this.searchParam2.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.comboCheckKindItems = this.$_.clone(_result.data);
          this.comboCheckKindItems.splice(0, 0, {
            safCheckKindNo: '',
            safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchClickedCallback() {
      this.getList();
    },

    cellClickHandler(data) {
      console.log('data', data);
      this.popupOptions.target = () => import(`${'./checkResult.vue'}`);
      this.popupOptions.title = 'L0000001870';
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      let gubun = '';
      if (data.dataField.split('_')[1] === 'result') {
        gubun = 'CHS04';
      }
      this.popupOptions.param = {
        popupMode: true,
        plantCd: this.YAuiGrid.plantCd,
        year: this.searchParam2.year,
        gubun: gubun,
        month:
          data.dataField !== 'sum' &&
          data.dataField !== 'sum_plan' &&
          data.dataField !== 'sum_result'
            ? data.dataField.substring(0, 2)
            : '',
        safCheckKindNo: this.YAuiGrid.saf_check_kind_no,
        deptCd: this.YAuiGrid.dept_cd,
        tgtDeptCd: this.YAuiGrid.tgt_dept_cd,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    getList(data) {
      this.$http.url = this.searchUrl2;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam2;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },

    /** end button 관련 이벤트 **/
  },
};
</script>

<style>
.checkResultSub .el-table__body-wrapper {
  height: 382.22px !important;
}
</style>
