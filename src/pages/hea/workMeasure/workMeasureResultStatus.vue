<!--
  목적 : 설비점검 관리 - 설비점검결과  - 점검자
  Detail : 설비점검 점검자
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <!-- <b-row>
      <b-col sm="12">
        점검팀원 테이블 
        <b-row>
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                 닫기 
                <y-btn
                  v-if="popupParam.popupMode"
                  title="L0000000881"
                  @btnClicked="closePopup"
                />
              </div>
               작업환경측정결과 목록 
              <y-data-table
                ref="dataTable"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :editable="editable"
                :useRownum="false"
                label="L0000002442"
                :popMode="true"
                @tableLinkClicked="tableLinkClicked"
              ></y-data-table>
            </b-col>
          </b-col>
        </b-row>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002442')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @closePopup="closePopup"
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
  name: 'facil-chk-result-table',
  props: {
    popupParam: {
      type: Object,
      default: {
        popupMode: false,
        plantCd: '', // 사업장
        year: '', // 측정년도
        processCd: '', // 공정코드
        deptCd: '', // 측정부서
        halfYearCd: '', // 측정분기
        workAreaGradeCd: '', // 유해인자대분류
      },
    },
  },
  data: () => ({
    searchParam: {
      plantCd: '',
      year: '',
      processCd: '',
      deptCd: '',
      halfYearCd: '',
      workAreaGradeCd: '', // 유해인자대분류
    },
    gridOptions: {
      name: 'workMeasureResultStatus',
      btns: [],
      header: [],
      data: [],
      height: '250',
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
    baseWidth: 8,
    editable: false,
    searchUrl: '',
  }),
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
      // this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.hea.workMeasurePlan.status.url;

      this.searchParam.plantCd = this.popupParam.plantCd;
      this.searchParam.deptCd = this.popupParam.deptCd;
      this.searchParam.processCd = this.popupParam.processCd;
      this.searchParam.halfYearCd = this.popupParam.halfYearCd;
      this.searchParam.year = this.popupParam.year;
      this.searchParam.workAreaGradeCd = this.popupParam.workAreaGradeCd;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002931'),
          dataField: 'year',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001337'),
          dataField: 'halfYearNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002929'),
          dataField: 'measPeriod',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002930'),
          dataField: 'measAgency',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002926'),
          dataField: 'measPlanNm',
          width: '15%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000878'),
          dataField: 'workPlace',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002188'),
          dataField: 'hazardNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000746'),
          dataField: 'workerCnt',
          width: '10%',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002374'),
          dataField: 'workContents',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000747'),
          dataField: 'shiftType',
          width: '10%',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001085'),
          dataField: 'occurType',
          width: '10%',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002198'),
          dataField: 'occurTime',
          width: '10%',
          style: 'right-align',
        },
        {
          headerText: '측정위치(근로자명)',
          dataField: 'measPsnNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002942'),
          dataField: 'measStartTime',
          width: '10%',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002943'),
          dataField: 'measEndTime',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002953'),
          dataField: 'measDt',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002965'),
          dataField: 'measCnt',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002962'),
          dataField: 'measValue',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001732'),
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002529'),
              dataField: 'twaPrev',
              width: '10%',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000766'),
              dataField: 'twaCurr',
              width: '10%',
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000845'),
          dataField: 'exposureStd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000847'),
          dataField: 'exposureExcessFlag',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002933'),
          dataField: 'measMethod',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        },
      ];
      // 점검결과목록 조회
      this.getDataList();
    },
    /** 설비점검결과 목록 조회 **/
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.$_.forEach(_result.data, (item) => {
            item.measPeriod = item.measDtSta + ' ~ ' + item.measDtEnd;
          });
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(this.gridOptions.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // tableLinkClicked(header, data) {
    //   this.popupOptions.target = () =>
    //     import(`${'./facilChkResultDetail.vue'}`);
    //   this.popupOptions.title = 'L0000001608';
    //   // 설비점검결과
    //   this.popupOptions.param = {
    //     safFacilChkNo: data.safFacilChkNo, // 설비점검번호
    //   };
    //   this.popupOptions.visible = true;
    //   this.popupOptions.closeCallback = this.closePopup2;
    // },
    closePopup2(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** button 관련 이벤트 **/
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    cellClickHandler(event) {
      if (event.dataField !== 'measPlanNm') return;
      this.openPopup(event.item);
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.openPopup(data);
    },
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'@/pages/hea/workMeasure/workMeasureResultDetail.vue'}`);
      this.popupOptions.title = 'L0000004356'; // 작업환경측정결과 상세
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        workMeasPlanNo: data.workMeasPlanNo,
      };
      this.popupOptions.closeCallback = this.closePopup2;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
