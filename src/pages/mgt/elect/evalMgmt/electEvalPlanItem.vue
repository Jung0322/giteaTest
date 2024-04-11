<!--
  목적 : SHE경영 관리>법정선임자 관리>법정선임자 평가 관리>평가계획 관리>평가계획 상세
  Detail : 평가계획 관리 상세 팝업 대상자 탭 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <b-card>
            <!-- <b-row>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <b-col sm="12" class="px-0">
                  - 평가항목 목록 
                  <y-data-table
                    ref="dataTable"
                    :height="gridOptions.height"
                    :headers="gridOptions.header"
                    :items="electEvalPlan.electEvalItems"
                    :use-paging="true"
                    label="L0000005169"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005169')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :rowHeight="60"
          :showGridCtrl="true"  
        />
      </b-col>
    </b-row>
          </b-card>
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'elect-eval-plan-item',
  props: {
    electEvalPlan: {
      evalPlanNo: 0, // 평가계획번호
      year: null, // 대상년도
      halfTypeCd: null, // 구분(상반기/하반기)
      deptCd: null, // 주관부서
      safElectTitlNo: null, // 법정선임자번호
      evalNm: null, // 평가명
      evalDesc: null, // 상세내용
      procStepCd: null, // 단계(SAF_ELECT_TITL_STEP)
      stateCd: null, // 상태(COM_STATE)
      stepCd: null, // 결재상태(COM_BIZ_APPR_STEP)
      apprRqstNo: 0, // 결재요청번호
      createUserId: null, // 등록자ID
      createDt: null, // 등록일시
      updateUserId: null, // 수정자ID
      updateDt: null, // 수정일시
      createDeptNm: null, // 등록자부서명
      createDeptCd: null, // 등록자부서코드
      updateDeptNm: null, // 수정자부서명
      updateDeptCd: null, // 수정자부서코드
      createPositionNm: null, // 등록자직위명
      createPositionCd: null, // 등록자직위코드
      updatePositionNm: null, // 수정자직위명
      updatePositionCd: null, // 수정자직위코드
      electEvalUsers: [], // 평가대상자 목록
      deleteElectEvalUsers: [], // 평가대상자 삭제목록
      electEvalItems: [], // 평가항목 목록
    },
  },
  data() {
    return {
      editable: false, // 수정 가능 여부
      gridOptions: {
        name: 'elextEvalPlanItem',
        header: [],
        height: '350px',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      disabled: false,
    };
  },
  computed: {},
  watch: {
    'electEvalPlan.electEvalItems'() {
      this.setGridData();
    },
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
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.setGridHeader().then(() => {
        this.setGridData(); // 코드 정보 db 조회
      });
    },
    setGridHeader() {
      return new Promise(resolve => {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), 
            dataField: 'itemType', 
            wrapText: true,
            width: '33%', 
            style: 'left-align',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005047'), 
            dataField: 'itemWork', 
            wrapText: true,
            width: '33%', 
            style: 'left-align',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
            dataField: 'remark', 
            wrapText: true,
            width: '33%', 
            style: 'left-align',
          },
        ];
        resolve();
      });
    },
    setGridData() {
      this.YAuiGrid.setGridData(this.electEvalPlan.electEvalItems);
    },
    gridTextCalucate(row, headerName) {
      return row[headerName].replaceAll('\n', '<br/>');
    },
    /** Button Event **/
    /** /Button Event **/
  },
};
</script>
