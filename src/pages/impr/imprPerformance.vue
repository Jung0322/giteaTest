<!--
  목적 : 개선 > 개선조치실적
  Detail : 개선조치실적 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 기간(요청일) -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000771"
            name="period"
            default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 업무구분 -->
          <y-select
            :width="8"
            :comboItems="comboImprClassItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001947"
            name="imprClassCd"
            v-model="searchParam.imprClassCd"
          ></y-select>
        </b-col>

        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 조치부서 -->
          <y-tree-dept
            type="search"
            label="L0000002673"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.actDeptCd"
            :deptSubYn="searchParam.actDeptSubYn"
            @setDeptSubYn="setActDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 조치업체 -->
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            name="subconnNm"
            label="L0000002681"
            v-model="searchParam.subconnNm"
            :appendIcon="[{ 'icon': 'search', callbackName: 'searchVendor' }, { 'icon': 'times', callbackName: 'clear' }]"
            @searchVendor="searchVendor"
            @clear="clear"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 -->

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1">
             <y-btn :title="searchArea.title" color="green" @btnClicked="btnSearchVisibleClicked" /> 
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getList('ACL02')" />
          </div>
           개선조치실적 현황 
          <y-data-table
            :headers="gridOptions.header"
            :height="gridOptions.height"
            :items="gridOptions.data"
            :showSummary="true"
            label="L0000000280"
            ref="dataTable"
            :getSummaries="getSummaries"
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
          :Footers="gridOptions.footer"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000280')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          :showFooter="true"
          @getList="getList('ACL02')"
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
  name: 'impr-performance',
  props: {},
  data() {
    return {
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
        period: '',
        plantCd: '',
        imprClassCd: '',
        actDeptCd: '',
        subconnNm: '',
        vendorCd: '',
        actDeptSubYn: 'Y',
      },
      deptVendorGubun: 'd',
      searchArea: {
        title: '검색박스숨기기', /* 검색박스숨기기 */
        show: true,
      },
      gridOptions: {
        name: 'imprPerformance',
        btns: [],
        header: [],
        data: [],
        footer: [],
        height: '500px',
      },
      YAuiGrid: null,
      comboImprClassItems: [],
      // deptVendorGubunItems: [],
      editable: true,
      searchUrl: '',
    };
  },
  watch: {
    // deptVendorGubun() {
    //   this.searchParam.actDeptCd = '';
    //   this.searchParam.subconnNm = '';
    // },
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
    this.YAuiGrid = this.$refs.yAuiGrid
    this.YAuiGrid.setFooter(this.gridOptions.footer);
    this.resizeGrid();
    // window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.setGridSize);
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.imprAct.status.url;

      this.searchParam.actDeptSubYn = 'Y';

      var from =
        this.$comm
          .getCalculatedDate(
            this.$comm.getToday(),
            '-1m',
            'YYYY-MM-DD',
            'YYYY-MM-DD'
          )
          .substr(0, 8) + '01';
      var to = this.$comm.getToday();

      this.searchParam.period = [from, to];

      // this.deptVendorGubunItems = [
      //   { code: 'd', codeNm: '부서' },
      //   { code: 'v', codeNm: '협력업체' },
      // ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001947'), 
          dataField: 'imprClassNm', 
          width: '21%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000265'), 
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000471'), 
              dataField: 'notPlanCnt', 
              width: '11%', 
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {              
                },
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000472'), 
              dataField: 'planCnt', 
              width: '11%', 
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {              
                },
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000281'), 
              dataField: 'actCnt', 
              width: '11%', 
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {              
                },
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002683'), 
              dataField: 'completeCnt', 
              width: '11%', 
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {              
                },
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002049'), 
              dataField: 'requstSum', 
              width: '11%', 
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {              
                },
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002228'), 
              dataField: 'transitionRate1', 
              width: '11%', 
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002739'), 
          children: [
            // {
            //   text: '계획미수립',
            //   name: 'notPlanCnt2',
            //   width: '130px',
            //   align: 'center',
            //   url: 'link',
            // },
            // {
            //   text: '계획수립',
            //   name: 'planCnt',
            //   width: '130px',
            //   align: 'center',
            //   url: 'link',
            // },
            // {
            //   text: '개선조치중',
            //   name: 'actCnt',
            //   width: '100px',
            //   align: 'center',
            //   url: 'link',
            // },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002683'), 
              dataField: 'completeCnt2', 
              width: '13%', 
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {              
                },
              },
            },
            // {
            //   text: '이행률(%)',
            //   name: 'transitionRate2',
            //   width: '100px',
            //   align: 'center',
            // },
          ],
        },
        // {
        //   text: '전체이행률(%)',
        //   name: 'transitionRate3',
        //   width: '100px',
        //   align: 'center',
        // },
      ];
      
      this.gridOptions.footer = [
        { labelText: '합계', positionField: 'imprClassNm' },
        { dataField: 'notPlanCnt', positionField: 'notPlanCnt', operation: 'SUM', formatString: '#,##0', style: 'my-right' },
        { dataField: 'planCnt', positionField: 'planCnt', operation: 'SUM', formatString: '#,##0', style: 'my-right' },
        { dataField: 'actCnt', positionField: 'actCnt', operation: 'SUM', formatString: '#,##0', style: 'my-right' },
        { dataField: 'completeCnt', positionField: 'completeCnt', operation: 'SUM', formatString: '#,##0', style: 'my-right' },
        { dataField: 'requstSum', positionField: 'requstSum', operation: 'SUM', formatString: '#,##0', style: 'my-right' },
        { dataField: 'completeCnt2', positionField: 'completeCnt2', operation: 'SUM', formatString: '#,##0', style: 'my-right' },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ]
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList('ACL02');

      this.getComboItems('SAF_IMPR_CLASS'); // 업무구분
      // this.setGridSize();
    },
    // combo box list
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          _result.data.splice(0, 0, { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }); // 전체
          if (codeGroupCd === 'SAF_IMPR_CLASS') {
            this.comboImprClassItems = this.$_.clone(_result.data);
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'transitionRate1') return;
      let imprStepCd = '';
      let actClassCd = '';
      if (event.dataField === 'notPlanCnt') {
        imprStepCd = 'IMST1';
        actClassCd = 'ACL02';
      } else if (event.dataField === 'planCnt') {
        imprStepCd = 'IMST2';
        actClassCd = 'ACL02';
      } else if (event.dataField === 'actCnt') {
        imprStepCd = 'IMST3';
        actClassCd = 'ACL02';
      } else if (event.dataField === 'completeCnt') {
        imprStepCd = 'IMST5';
        actClassCd = 'ACL02';
      } else if (event.dataField === 'notPlanCnt2') {
        imprStepCd = 'IMST1';
        actClassCd = 'ACL01';
      } else if (event.dataField === 'completeCnt2') {
        imprStepCd = 'IMST5';
        actClassCd = 'ACL01';
      } else if (event.dataField === 'requstSum') {
        imprStepCd = '';
        actClassCd = 'ACL02';
      }

      this.popupOptions.target = () =>
        import(`${'./imprPerformanceDetail.vue'}`);
      this.popupOptions.title = 'L0000000279'; /* 개선조치실적 상세 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '85%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        imprClassCd: event.item ? event.item.imprClassCd : '',
        imprStepCd: imprStepCd,
        imprRqstYmd: this.searchParam.period,
        actClassCd: actClassCd,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    // 그리드 row click 이벤트
    tableLinkClicked(header, data) {
      if (data === null) return;

      let imprStepCd = '';
      let actClassCd = '';
      if (header.name === 'notPlanCnt') {
        imprStepCd = 'IMST1';
        actClassCd = 'ACL02';
      } else if (header.name === 'planCnt') {
        imprStepCd = 'IMST2';
        actClassCd = 'ACL02';
      } else if (header.name === 'actCnt') {
        imprStepCd = 'IMST3';
        actClassCd = 'ACL02';
      } else if (header.name === 'completeCnt') {
        imprStepCd = 'IMST5';
        actClassCd = 'ACL02';
      } else if (header.name === 'notPlanCnt2') {
        imprStepCd = 'IMST1';
        actClassCd = 'ACL01';
      } else if (header.name === 'completeCnt2') {
        imprStepCd = 'IMST5';
        actClassCd = 'ACL01';
      } else if (header.name === 'requstSum') {
        imprStepCd = '';
        actClassCd = 'ACL02';
      }

      this.popupOptions.target = () =>
        import(`${'./imprPerformanceDetail.vue'}`);
      this.popupOptions.title = 'L0000000279'; /* 개선조치실적 상세 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '85%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        imprClassCd: data ? data.imprClassCd : '',
        imprStepCd: imprStepCd,
        imprRqstYmd: this.searchParam.period,
        actClassCd: actClassCd,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },

    /** button 관련 이벤트 **/

    getList(actClassCd) {
      this.searchParam.actClassCd = actClassCd;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.$_.forEach(_result.data, item => {
            this.$comm.pushCookie(this.searchParam);
            item.requstSum =
              item.notPlanCnt + item.planCnt + item.actCnt + item.completeCnt;
          });
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.gridOptions.data);

          // this.gridOptions.height = '490px'
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 사용자의 입력을 받는다.
     */
    /** button 관련 이벤트 **/
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    searchVendor() {
      this.popupOptions.target = () =>
        import(`${'../vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000001951'; /* 업체 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        gubun: 'V',
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        this.searchParam.subconnNm = data.data.vendorNm;
        this.searchParam.vendorCd = data.data.vendorCd;
      }
    },
    resizeGrid() {
      let _height = window.innerHeight - 385;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$comm.getLangSpecInfoLabel('L0000003180'); /* 합계 */
          return;
        }
        if (!data) return;
        // 이행률일 경우
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          if (column.property === 'transitionRate1') {
            sums[index] = Math.round(
              values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0) / data.length
            );
          } else if (column.property === 'transitionRate2') {
            sums[index] = Math.round(
              values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0) / data.length
            );
          } else if (column.property === 'transitionRate3') {
            sums[index] = Math.round(
              values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0) / data.length
            );
          } else {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          }
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
    clear() {
      this.searchParam.subconnNm = '';
      this.searchParam.vendorCd = '';
    },
    // 하위부서 포함 조회 관련 함수 추가
    setActDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.actDeptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>

<style>
</style>
