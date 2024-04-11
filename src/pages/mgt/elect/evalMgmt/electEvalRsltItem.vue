<!--
  목적 : SHE경영 관리>법정선임자 관리>법정선임자 평가 관리>평가계획 관리>평가결과 상세(본인평가/상위평가)
  Detail : 평가결과 관리(본인평가/상위평가) 상세 팝업 평가결과 탭 화면
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
                   평가결과 목록 
                  <y-data-table
                    :key="tempKey"
                    ref="dataTable"
                    :editable="gridEditable"
                    :height="gridOptions.height"
                    :headers="gridOptions.header"
                    :items="electEvalRslt.electEvalRsltItems"
                    :use-paging="false"
                    label="L0000005207"
                  ></y-data-table>
                </b-col>
              </b-col>
            </b-row> -->
            <b-row class="grid-height grid-box">
              <b-col sm="12" class="h100p">
                <y-auigrid
                  ref="yAuiGrid"
                  :editable="gridEditable"
                  :name="gridOptions.name"
                  :headers="gridOptions.header"
                  :btns="gridOptions.btns"
                  :height="gridOptions.height"
                  :label="this.$comm.getLangSpecInfoLabel('L0000005207')"
                  :useExcelExport="false"
                  :enableCellMerge="true"
                  :enableSorting="true"
                  :showGridSetSave="true"
                  :useContextMenu="true"
                  :enableRightDownFocus="true"
                  :rowHeight="60"
                  :showGridCtrl="true"  
                  @cellEditEnd="cellEditEndHandler"
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
    electEvalRslt: {
      evalPlanNo: 0, // 평가계획번호
      evalUserNo: 0, // 평가대상자 번호
      plantCd: null, // 사업장코드
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
      meDeptCd: null, // 평가대상자 소속부서코드
      meDeptNm: null, // 평가대상자 소속부서
      meUserId: null, // 평가대상자(본인평가자) 사번
      meUserNm: null, // 평가대상자(본인평가자)
      meProcStep: null, // 본인평가 진행상태
      upUserId: null, // 평가자(상위평가자) 사번
      upUserNm: null, // 평가자(상위평가자)
      upProcStep: null, // 상위평가 진행상태
      electEvalRsltItems: [], // 평가결과 목록
    },
    parentEditable: false, // 본인평가결과/상위평가결과 상세팝업의 권한
    evalType: null, // 본인평가/상위평가 구분
  },
  data() {
    return {
      editable: false, // 수정 가능 여부
      gridOptions: {
        name: 'electEvalRsltItem',
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
      pointItems: [], // 본인평가 점수 selectbox 목록
      tempKey: null, // 그리드 렌더링 키
    };
  },
  computed: {
    gridEditable() {
      let procStepCd =
        this.evalType === 'me'
          ? this.electEvalRslt.meProcStep !== 'PSEND'
          : this.electEvalRslt.upProcStep !== 'PSEND';

      return this.editable && this.parentEditable && procStepCd;
    },
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.mountInit();
  },
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

    },
    mountInit() {
      const promise1  = this.getPointItems();
      Promise.all([promise1]).then(() => { 
        this.setGridHeader().then(() => {
          this.setGridData(); // 코드 정보 db 조회
        });
      });
    },
    setGridHeader() {
      return new Promise(resolve => {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000686') + ' *', 
            dataField: 'itemType', 
            editable: false,
            wrapText: true,
            width: '20%', 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005047') + ' *', 
            dataField: 'itemWork', 
            editable: false,
            wrapText: true,
            width: '20%', 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
            dataField: 'remark', 
            width: '20%', 
            editRenderer: {
              type: 'InputEditRenderer', 
            }, 
          },
          // {
          //   text: this.$comm.getLangSpecInfoLabel('L0000000686') + ' *', // 구분 *
          //   name: 'itemType',
          //   width: '100px',
          //   align: 'center',
          //   textCalculate: this.gridTextCalucate,
          // },
          // {
          //   text: this.$comm.getLangSpecInfoLabel('L0000005047') + ' *', // 평가대상업무 *
          //   name: 'itemWork',
          //   width: '100px',
          //   align: 'center',
          //   textCalculate: this.gridTextCalucate,
          // },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005203') + ' *', // 본인평가 점수 *
            dataField: 'meEvalPoint', 
            width: '20%', 
            renderer: {
              type: this.evalType === 'me' ? "DropDownListRenderer" : null,
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.pointItems;
              },
              keyField: "code", // key 에 해당되는 필드명
              valueField: "codeNm", // value 에 해당되는 필드명
            // disabledFunction: () => {
            //   return this.checkDisabled;
            // },
            }
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005204'),
            dataField: 'upEvalPoint', 
            editable: false,
            width: '20%', 
            renderer: {
              type: this.evalType === 'me' ? null : "DropDownListRenderer",
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.pointItems;
              },
              keyField: "code", // key 에 해당되는 필드명
              valueField: "codeNm", // value 에 해당되는 필드명
            // disabledFunction: () => {
            //   return this.checkDisabled;
            // },
            }
          },
          // {
          //   text: this.$comm.getLangSpecInfoLabel('L0000005203') + ' *', // 본인평가 점수 *
          //   name: 'meEvalPoint',
          //   width: '100px',
          //   align: 'center',
          //   type: this.evalType === 'me' ? 'select' : null,
          //   itemValue: this.evalType === 'me' ? 'code' : null,
          //   itemText: this.evalType === 'me' ? 'codeNm' : null,
          //   items: this.evalType === 'me' ? this.pointItems : null,
          // },
          // {
          //   text: 'L0000005204', // 상위평가 점수
          //   name: 'upEvalPoint',
          //   width: '100px',
          //   align: 'center',
          //   type: this.evalType === 'me' ? null : 'select',
          //   itemValue: this.evalType === 'me' ? null : 'code',
          //   itemText: this.evalType === 'me' ? null : 'codeNm',
          //   items: this.evalType === 'me' ? null : this.pointItems,
          // },
        ];
        resolve();
      });
    },
    setGridData() {
      this.YAuiGrid.setGridData(this.electEvalRslt.electEvalRsltItems);
    },
    gridTextCalucate(row, headerName) {
      return row[headerName].replaceAll('\n', '<br/>');
    },
    cellEditEndHandler() {
      this.electEvalRslt.electEvalRsltItems = this.YAuiGrid.getGridData();
    },
    getPointItems() {
      this.pointItems = [];

      this.pointItems.push({
        code: null,
        codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
      }); // 선택하세요.

      for (let i = 100; i >= 0; i -= 10) {
        this.pointItems.push({ code: i, codeNm: i });
      }
    },
    /** Button Event **/
    /** /Button Event **/
  },
};
</script>
