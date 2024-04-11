<!--
  목적 : SHE경영 관리>법정선임자 관리>법정선임자 평가 관리>본인평가결과 관리
  Detail : 본인평가결과 관리 조회 화면
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
            <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
          </div>
          평가결과 목록 
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
            label="L0000005207"
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
            :label="this.$comm.getLangSpecInfoLabel('L0000005207')"
            :useExcelExport="false"
            :enableSorting="true"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"   
            @btnClosePopup="btnClosePopup"
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
  name: 'elect-eval-plan',
  props: {
    popupParam: {
      default: {
        year: null, // 대상년도
        period: null, // 대상년도
        plantCd: null, // 사업장
        halfTypeCd: null, // 구분
        safElectTitlNo: 0, // 법정선임자번호
        evalType: null, // 대상자(명) 컬럼/평가완료(명) 컬럼 여부
        evalPlanNo: 0, // 평가계획번호
      },
    },
  },
  data: () => ({
    searchParam: {
      period: [], // 대상년도
      halfTypeCd: null, // 구분
      plantCd: null, // 사업장
      safElectTitlNo: null, // 법정선임자번호
      procStepCd: null, // 단계
      stateCd: null, // 상태
    },
    gridOptions: {
      name: 'electEvalRsltList',
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
      param: {},
      width: '80%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
  }),
  computed: {},
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

      this.searchParam.period = [
        this.$comm.getThisYear(),
        this.$comm.getThisYear(),
      ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '5%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004449'), 
          dataField: 'year', 
          width: '5%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), 
          dataField: 'halfTypeNm', 
          width: '5%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'), 
          dataField: 'evalNm', 
          width: '15%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005162'), 
          dataField: 'electTitlNm', 
          width: '10%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005226'), 
          dataField: 'meDeptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004488'), 
          dataField: 'userNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'), 
          dataField: 'deptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'), 
          dataField: 'stepNm', 
          width: '10%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005163'), 
          dataField: 'meUserNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005164'), 
          dataField: 'upUserNm', 
          width: '10%', 
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClosePopup',
        },
      ]

      // 대상년도
      if (
        this.popupParam.year ||
        (this.popupParam.period && this.popupParam.period.length)
      ) {
        this.searchParam.period =
          this.popupParam.year === '합계'
            ? this.popupParam.period
            : [this.popupParam.year, this.popupParam.year];
      }

      if (this.popupParam.year === 'sum' && this.popupParam.period) {
        this.searchParam.period = this.popupParam.period;
      }

      // 사업장
      if (this.popupParam.plantCd) {
        this.searchParam.plantCd =
          this.popupParam.plantCd === 'sum' ? '' : this.popupParam.plantCd;
      }

      // 구분 (상반기/하반기)
      if (this.popupParam.halfTypeCd) {
        this.searchParam.halfTypeCd = this.popupParam.halfTypeCd;
      }

      // 법정선임자
      if (this.popupParam.safElectTitlNo) {
        this.searchParam.safElectTitlNo = this.popupParam.safElectTitlNo;
      }

      if (this.popupParam.evalType === 'up') {
        this.searchParam.stateCd = 'PSEND'; // 완료
        this.searchParam.procStepCd = 'SETS3';
      }
      else if (this.popupParam.evalType === null || this.popupParam.evalType === '')
      {
        this.searchParam.procStepCd = '';
      }
      else
      {
        this.searchParam.procStepCd = 'SETS2';
      }

      // 평가계획의 건수 조회일 경우
      if (this.popupParam.evalPlanNo) {
        this.searchParam.evalPlanNo = this.popupParam.evalPlanNo;
        this.searchParam.period = null;
        this.searchParam.plantCd = null;
        this.searchParam.halfTypeCd = null;
        // this.searchParam.safElectTitlNo = null;
        // this.searchParam.procStepCd =
        //   this.popupParam.evalType === 'up' ? 'SETS3' : 'SETS2';
        this.searchParam.stateCd = !this.popupParam.evalType
          ? null
          : this.popupParam.evalType !== 'no'
            ? 'PSEND'
            : 'PSURE'; // 미진행 - 미작성, 본인평가/상위평가 - 완료
      }

      this.getList();
    },
    getList() {
      let url =
        this.popupParam.evalType === 'up'
          ? selectConfig.mgt.electEvalMgmt.rslt.up.list.url
          : selectConfig.mgt.electEvalMgmt.rslt.me.list.url;

      this.$http.url = url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      this.showApprProgressPopup(event.item);
    },
    tableLinkClicked(header, data) {
      this.showApprProgressPopup(data);
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.apprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getList();
    },
    btnClosePopup() {
      this.$emit('closePopup');
    },
    /** button 관련 이벤트 **/
    /** end button 관련 이벤트 **/
  },
};
</script>
