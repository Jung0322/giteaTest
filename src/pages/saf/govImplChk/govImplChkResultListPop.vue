<!--
  목적 : 점검>정부지자체 시정조치 이행점검 관리 관리>점검결과 관리
  Detail : 점검결과 관리 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             닫기 
            <y-btn title="L0000000881" color="green" @btnClicked="closePopup" />
          </div>
           점검결과 목록 
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            label="L0000002537"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002537')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @closePopup="closePopup"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'gov-impl-chk-result-list-pop',
  props: {
    popupParam: {
      plantCd: null, // 사업장
      month: 0, // 월
      year: null, // 대상년도
      regRegdem: null, // 구분
      tgtDeptYn: null, // 대상부서별 조회 여부
      statusYn: null, // 현황조회 여부
    },
  },
  data: () => ({
    searchParam: {
      plantCd: null, // 사업장
      year: null, // 대상년도
      regRegdem: null, // 구분
      procStepCd: 'CS002', // 단계 (결과로 고정)
      month: null, // 월
      tgtDeptYn: null, // 대상부서별 조회 여부
      statusYn: null, // 현황조회 여부
    },
    gridOptions: {
      name: 'govImplChkResultListPop',
      btns: [],
      header: [],
      data: [],
      height: '400',
    },
    YAuiGrid: null,
    editable: false,
    regRegdemItems: [], // 구분 selectbox 목록
    procStepItems: [], // 상태 selectbox 목록
  }),
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
      this.searchParam.year = this.$comm.getThisYear();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'), 
          dataField: 'targetDeptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004449'), 
          dataField: 'year',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002551'), 
          dataField: 'chkNm',
          width: '10%',
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), 
          dataField: 'regRegdemNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'), 
          dataField: 'mainDeptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005255'), 
          dataField: 'refGovNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002545'), 
          dataField: 'chkPeriod',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'), 
          dataField: 'stepNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writerNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'writeDt',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000264'), 
          dataField: 'requestCnt',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005012'), 
          dataField: 'incompletCnt',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005013'), 
          dataField: 'overdueCnt',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002683'), 
          dataField: 'completCnt',
          width: '10%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        },
      ]
      // 구분 (정기/수시)
      this.$comm.getComboItems('RSA_REG_REGDEM', true).then((_result) => {
        this.regRegdemItems = _result;
      });

      // 단계 (계획/결과)
      this.$comm.getComboItems('COM_STEP', true).then((_result) => {
        this.procStepItems = _result;
      });

      // 사업장
      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.popupParam.plantCd;
      }

      // 대상년도
      if (this.popupParam.year) {
        this.searchParam.year = this.popupParam.year;
      }

      // 구분
      if (this.popupParam.regRegdem) {
        this.searchParam.regRegdem = this.popupParam.regRegdem;
      }

      // 월
      if (this.popupParam.month) {
        this.searchParam.month = this.popupParam.month;
      }

      // 대상부서별 조회여부
      if (this.popupParam.tgtDeptYn) {
        this.searchParam.tgtDeptYn = this.popupParam.tgtDeptYn;
      }

      // 현황 조회여부
      if (this.popupParam.statusYn) {
        this.searchParam.statusYn = this.popupParam.statusYn;
      }

      this.getList();
    },
    getList() {
      this.$http.url = selectConfig.saf.govImplChkResult.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data))
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup() {
      this.$emit('closePopup');
    },
    /** button 관련 이벤트 **/
    /** end button 관련 이벤트 **/
  },
};
</script>
