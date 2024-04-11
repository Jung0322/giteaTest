<!--
  목적 : 안전 > 가동전점검 > 가동전점검실적
  Detail : 점검실적 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions2" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam2.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
           <!-- 점검년도 -->
          <y-datepicker
            :width="8"
            :required="true"
            type="year"
            label="L0000002548"
            name="year"
            :default="searchParam2.year"
            v-model="searchParam2.year"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 설비유형 -->
          <y-tree-facility-type
            label="L0000001597"
            type="search"
            name="searchSafFacilityTypeCd"
            v-model="searchParam2.safFacilityTypeCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 점검주관부서 -->
          <y-tree-dept
            type="search"
            label="L0000002578"
            :plantCd="searchPlantCd"
            v-model="searchParam2.deptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 점검유형 -->
          <y-select
            :width="8"
            :comboItems="comboCheckTypeItems"
            :editable="editable"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000004068"
            name="safCheckTypeCd"
            v-model="searchParam2.safCheckTypeCd"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0 facilityCheckResultSub">
          <div class="float-right mb-1">
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getList"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           사업장별 세부 가동전점검실적 현황
          <y-data-table
            ref="dataTable2"
            :height="gridOptions2.height"
            :headers="gridOptions2.header"
            :items="gridOptions2.data"
            :use-paging="false"
            :useRownum="false"
            :showSummary="true"
            @tableLinkClicked="tableLinkClicked2"
            label="L0000003996"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions2.name"
          :headers="gridOptions2.header"
          :btns="gridOptions2.btns"
          :height="gridOptions2.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003996')"
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
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'facil-chk-performance',
  props: {},
  data() {
    return {
      searchParam2: {
        year: '', // 기간(점검일)
        plantCd: '',
        safCheckTypeCd: null,
        safFacilityTypeCd: '',
        deptCd: '', // 주관부서코드
        deptSubYn: 'Y', // 하위부서여부 사용
      },
      popupParam: {
        plantCd: '',
      },
      gridOptions2: {
        name: 'inspBefOperPerfomanceDetail',
        btns: [],
        header: [],
        data: [],
        height: '500',
      },
      YAuiGrid: null,
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
      comboCheckTypeItems: [], // 점검종류
      editable: false,
      searchUrl: '',
      searchUrl2: '',
      gridMessage: '',
    };
  },
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
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
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.searchUrl2 = selectConfig.saf.befInspResult.status2.url;

      this.searchParam2.deptSubYn = 'Y';

      this.$comm.getComboItems('SAF_PREOPERATION_CHECK', true).then(_result => {
        this.comboCheckTypeItems = _result;
      });

      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plant_nm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002576'), 
          dataField: 'saf_check_type_nm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001597'), 
          dataField: 'saf_facility_type_nm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002578'), 
          dataField: 'dept_nm', 
          width: '10%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004071'), 
          dataField: 'sum_plan', 
          width: '8%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004072'), 
          dataField: 'sum_result', 
          width: '8%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002874'), 
          dataField: 'sum', 
          width: '8%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
      ];

      for (let i = 1; i < 13; i++) {
        let month = i < 10 ? '0' + i : i.toString();
        this.gridOptions2.header.splice(i + 3, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003663', {
            s1: i,
          }), // {s1}월
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003642'), 
              dataField: month + '_plan',
              width: '5%', 
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {              
                },
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002039'), 
              dataField: month + '_result',
              width: '5%', 
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {              
                },
              },
            },
          ],
          sortable: false,
        });
      }
      let today = this.$comm.getToday();
      this.searchParam2.year = today.substring(0, 4);
      this.getList();
    },
    cellClickHandler(event) {
      this.popupOptions.target = () =>
        import(`${'./inspBefOperResultTable.vue'}`);
      this.popupOptions.title = 'L0000003997'; // 가동전점검
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      let dtlYn = 'Y';
      let completeYn = 'N';
      if (event.dataField === 'sum') {
        completeYn = '';
      } else if (event.dataField === 'sum_result') {
        completeYn = 'Y';
      } else if (event.dataField === 'sum_plan') {
        completeYn = 'N';
      } else if (event.dataField.split('_')[1] === 'plan') {
        completeYn = 'N';
      } else if (event.dataField.split('_')[1] === 'result') {
        completeYn = 'Y';
      }
      this.popupOptions.param = {
        popupMode: true,
        plantCd: this.searchPlantCd,
        year: this.searchParam2.year,
        completeYn: completeYn,
        dtlYn: dtlYn,
        month:
        event.dataField !== 'sum' &&
          event.dataField !== 'sum_plan' &&
          event.dataField !== 'sum_result'
          ? event.dataField.substring(0, 2)
          : '',
        safCheckTypeCd: event.item.saf_check_type_cd,
        safFacilityTypeCd: event.item.saf_facility_type_cd,
        deptCd: event.item.dept_cd,
      };
      this.popupOptions.closeCallback = this.closePopup;
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
    tableLinkClicked2(header, row) {
      this.popupOptions.target = () =>
        import(`${'./inspBefOperResultTable.vue'}`);
      this.popupOptions.title = 'L0000003997'; // 가동전점검
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      let dtlYn = 'Y';
      let completeYn = 'N';
      if (header.name === 'sum') {
        completeYn = '';
      } else if (header.name === 'sum_result') {
        completeYn = 'Y';
      } else if (header.name === 'sum_plan') {
        completeYn = 'N';
      } else if (header['name'].split('_')[1] === 'plan') {
        completeYn = 'N';
      } else if (header['name'].split('_')[1] === 'result') {
        completeYn = 'Y';
      }
      this.popupOptions.param = {
        popupMode: true,
        plantCd: this.searchPlantCd,
        year: this.searchParam2.year,
        completeYn: completeYn,
        dtlYn: dtlYn,
        month:
          header['name'] !== 'sum' &&
          header['name'] !== 'sum_plan' &&
          header['name'] !== 'sum_result'
            ? header['name'].substring(0, 2)
            : '',
        safCheckTypeCd: row.saf_check_type_cd,
        safFacilityTypeCd: row.saf_facility_type_cd,
        deptCd: row.dept_cd,
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
        _result => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          // this.gridOptions2.data = this.$_.clone(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>
