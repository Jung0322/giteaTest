<!--
  목적 : 환경 > 환경영향평가 > 환경영향평가 결과 엑셀 그리드
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 환경영향평가 결과 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :label="this.$comm.getLangSpecInfoLabel('L0000004898')"
          :showRightLabel="this.editable"
          :rightLabel="this.$comm.getLangSpecInfoLabel('L0000004941')"
          :editable="this.editable"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="false"
          :showRowCheckColumn="this.editable"
          @cellClick="tableLinkClicked"
          @helpDownload="helpDownload"
          @excelUpload="excelUpload"
          @excelDownload="excelDownload"
          @addRow="addRow"
          @delRow="delRow"
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
  name: 'env-effect-eval-rslt-excel',
  props: {
    editable: false,
    envManager: false,
    evalPlan: {
      type: Object,
      default: {
        evalPlanNo: 0,
        envEffectEvalRslts: [],
      },
    },
  },
  data: () => ({
    selectedResult: null,
    rowIndex: null,
    gridOptions: {
      name: 'envEffectEvalRsltExcel',
      header: [],
      data: [],
      btns: [],
      height: 300,
      selectedValue: [],
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '60%',
      top: '10px',
      param: {},
      closeCallback: null,
    },

    insertUrl: '',
    updateUrl: '',
    deleteUrl: '',
    searchUrl: '',
    downloadUrl: '',
    downloadHelpUrl: '',

    detailProcessItems: [],
    envGenItems: [],
    envImpDivItems: [],
    envImpIssueItems: [],
    impoGenItems: [],
    impoToxicItems: [],
    impoQntItems: [],
    impoCtrlItems: [],
    impoWeightItems: [],
    impoTypeItems: [],

    gridHelpText: '',

    checkDisabled: true,
    YAuiGrid: null,
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
      if (this.editable) {
        this.checkDisabled = false;
      } else {
        this.checkDisabled = true;
      }

      this.insertUrl = '/api/env/enveffectevalplan/result/{0}';
      this.updateUrl = '/api/env/enveffectevalplan/result';
      this.deleteUrl = '/api/env/enveffectevalplan/result/delete';
      this.searchUrl = '/api/env/enveffectevalplan/plan/{0}/results';
      this.downloadUrl = '/api/env/enveffectevalplan/result/exceldownload';
      this.downloadHelpUrl = '/api/env/enveffectevalplan/result/helpdownload';

      this.gridHelpText =
        this.$comm.getLangSpecInfoLabel('L0000004941') +
        ' / ' +
        this.$comm.getLangSpecInfoLabel('L0000004942');

      this.setItems();
      this.setHeader();
      this.gridOptions.data = this.evalPlan.envEffectEvalRslts;
    },
    setItems() {
      this.detailProcessItems = [
        {
          code: this.$comm.getLangSpecInfoLabel('L0000002286'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002286'),
        },
        {
          code: this.$comm.getLangSpecInfoLabel('L0000002902'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002902'),
        },
        {
          code: this.$comm.getLangSpecInfoLabel('L0000004904'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000004904'),
        },
      ];
      this.envGenItems = [
        {
          code: this.$comm.getLangSpecInfoLabel('L0000003569'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003569'),
        },
        {
          code: this.$comm.getLangSpecInfoLabel('L0000004905'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000004905'),
        },
        {
          code: this.$comm.getLangSpecInfoLabel('L0000004906'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000004906'),
        },
      ];
      this.envImpDivItems = [
        {
          code: this.$comm.getLangSpecInfoLabel('L0000004901'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000004901'),
        },
        {
          code: this.$comm.getLangSpecInfoLabel('L0000004907'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000004907'),
        },
        {
          code: this.$comm.getLangSpecInfoLabel('L0000004908'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000004908'),
        },
        {
          code: this.$comm.getLangSpecInfoLabel('L0000003285'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003285'),
        },
      ];
      this.envImpIssueItems = [
        { code: '1', codeNm: '1' },
        { code: '2', codeNm: '2' },
      ];
      this.impoGenItems = [
        { code: '1', codeNm: '1' },
        { code: '2', codeNm: '2' },
        { code: '3', codeNm: '3' },
        { code: '4', codeNm: '4' },
        { code: '5', codeNm: '5' },
      ];
      this.impoToxicItems = [
        {
          code: this.$comm.getLangSpecInfoLabel('L0000004902'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000004902'),
        },
        {
          code: this.$comm.getLangSpecInfoLabel('L0000004909'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000004909'),
        },
      ];
      this.impoQntItems = [
        {
          code: this.$comm.getLangSpecInfoLabel('L0000004903'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000004903'),
        },
        {
          code: this.$comm.getLangSpecInfoLabel('L0000004910'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000004910'),
        },
      ];
      this.impoCtrlItems = [
        {
          code: this.$comm.getLangSpecInfoLabel('L0000004902'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000004902'),
        },
        {
          code: this.$comm.getLangSpecInfoLabel('L0000004909'),
          codeNm: this.$comm.getLangSpecInfoLabel('L0000004909'),
        },
      ];
      this.impoWeightItems = [
        { code: '1', codeNm: '1' },
        { code: '2', codeNm: '2' },
      ];
      this.impoTypeItems = [
        { code: '1', codeNm: '1' },
        { code: '2', codeNm: '2' },
        { code: '3', codeNm: '3' },
        { code: '4', codeNm: '4' },
      ];
    },
    setHeader() {
      let header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004911'), // 활동
          style: 'center-align',
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003659'),
              dataField: 'safFacilityNm',
              width: '200',
              style: 'center-align grid-link-cell',
              editable: false,
            }, // 설비
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004912'), // 세부공정
              dataField: 'detailProcess',
              width: '100',
              style: 'center-align',
              renderer: {
                type: 'DropDownListRenderer',
                listFunction: (rowIndex, columnIndex, item, dataField) => {
                  return this.detailProcessItems;
                },
                keyField: 'code', // key 에 해당되는 필드명
                valueField: 'codeNm', // value 에 해당되는 필드명
                disabledFunction: () => {
                  return this.checkDisabled;
                },
              },
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004913'), // 기초정보
          style: 'center-align',
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004914'), // 구동설비(KJ/day)
              style: 'center-align',
              children: [
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004915'),
                  dataField: 'facilityNm',
                  width: '120',
                  style: 'center-align',
                }, // 구동설비명
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000001996'),
                  dataField: 'facilityFuel',
                  width: '120',
                  style: 'center-align',
                }, // 연료
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000001445'),
                  dataField: 'facilityAmt',
                  width: '100',
                  style: 'center-align',
                }, // 사용량
              ],
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004916'), // 입력(ton/day)
              style: 'center-align',
              children: [
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004917'),
                  dataField: 'inputNm',
                  width: '120',
                  style: 'center-align',
                }, // 입력물
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004918'),
                  dataField: 'inputAmt',
                  width: '100',
                  style: 'center-align',
                }, // 입력량
              ],
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004919'), // 출력(ton/day)
              style: 'center-align',
              children: [
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004920'),
                  dataField: 'outputNm',
                  width: '120',
                  style: 'center-align',
                }, // 출력물
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004921'),
                  dataField: 'outputAmt',
                  width: '100',
                  style: 'center-align',
                }, // 출력량
              ],
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004922'), // 부산물(ton/day)
              style: 'center-align',
              children: [
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004923'),
                  dataField: 'residueNm',
                  width: '120',
                  style: 'center-align',
                }, // 부산물
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004924'),
                  dataField: 'residueAmt',
                  width: '100',
                  style: 'center-align',
                }, // 부산물량
              ],
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003332'), // 환경측면
          style: 'center-align',
          children: [
            {
              // 발생조건
              headerText: this.$comm.getLangSpecInfoLabel('L0000004925'),
              dataField: 'envGen',
              width: '120',
              style: 'center-align',
              renderer: {
                type: 'DropDownListRenderer',
                listFunction: (rowIndex, columnIndex, item, dataField) => {
                  return this.envGenItems;
                },
                keyField: 'code', // key 에 해당되는 필드명
                valueField: 'codeNm', // value 에 해당되는 필드명
                disabledFunction: () => {
                  return this.checkDisabled;
                },
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004925'),
              dataField: 'envAct',
              width: '200',
              style: 'center-align',
            }, // 상세활동
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004927'), // 환경영향
          style: 'center-align',
          children: [
            {
              // 환경분야
              headerText: this.$comm.getLangSpecInfoLabel('L0000004928'),
              dataField: 'envImpDiv',
              width: '120',
              style: 'center-align',
              renderer: {
                type: 'DropDownListRenderer',
                listFunction: (rowIndex, columnIndex, item, dataField) => {
                  return this.envImpDivItems;
                },
                keyField: 'code', // key 에 해당되는 필드명
                valueField: 'codeNm', // value 에 해당되는 필드명
                disabledFunction: () => {
                  return this.checkDisabled;
                },
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004929'),
              dataField: 'envImpMng',
              width: '200',
              style: 'center-align',
            }, // 통제/관리방안
            {
              // 환경이슈
              headerText: this.$comm.getLangSpecInfoLabel('L0000004930'),
              dataField: 'envImpIssue',
              width: '100',
              style: 'center-align',
              renderer: {
                type: 'DropDownListRenderer',
                listFunction: (rowIndex, columnIndex, item, dataField) => {
                  return this.envImpIssueItems;
                },
                keyField: 'code', // key 에 해당되는 필드명
                valueField: 'codeNm', // value 에 해당되는 필드명
                disabledFunction: () => {
                  return this.checkDisabled;
                },
              },
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004931'), // 중요성평가
          style: 'center-align',
          children: [
            {
              // 발생가능성
              headerText: this.$comm.getLangSpecInfoLabel('L0000004932'),
              dataField: 'impoGen',
              width: '100',
              style: 'center-align',
              renderer: {
                type: 'DropDownListRenderer',
                listFunction: (rowIndex, columnIndex, item, dataField) => {
                  return this.impoGenItems;
                },
                keyField: 'code', // key 에 해당되는 필드명
                valueField: 'codeNm', // value 에 해당되는 필드명
                disabledFunction: () => {
                  return this.checkDisabled;
                },
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004933'), // 부정적영향
              align: 'center',
              children: [
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004933'),
                  dataField: 'impoEffect',
                  width: '100',
                  style: 'center-align',
                  editable: false,
                }, // 부정적영향
                {
                  // 유해성
                  headerText: this.$comm.getLangSpecInfoLabel('L0000002166'),
                  dataField: 'impoToxic',
                  width: '100',
                  style: 'center-align',
                  renderer: {
                    type: 'DropDownListRenderer',
                    listFunction: (rowIndex, columnIndex, item, dataField) => {
                      return this.impoToxicItems;
                    },
                    keyField: 'code', // key 에 해당되는 필드명
                    valueField: 'codeNm', // value 에 해당되는 필드명
                    disabledFunction: () => {
                      return this.checkDisabled;
                    },
                  },
                },
                {
                  headerText: this.$comm.getLangSpecInfoLabel('Score'),
                  dataField: 'impoToxicScore',
                  width: '70',
                  style: 'center-align',
                  editable: false,
                },
                {
                  // 양
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004934'),
                  dataField: 'impoQnt',
                  width: '100',
                  style: 'center-align',
                  renderer: {
                    type: 'DropDownListRenderer',
                    listFunction: (rowIndex, columnIndex, item, dataField) => {
                      return this.impoQntItems;
                    },
                    keyField: 'code', // key 에 해당되는 필드명
                    valueField: 'codeNm', // value 에 해당되는 필드명
                    disabledFunction: () => {
                      return this.checkDisabled;
                    },
                  },
                },
                {
                  headerText: this.$comm.getLangSpecInfoLabel('Score'),
                  dataField: 'impoQntScore',
                  width: '70',
                  style: 'center-align',
                  editable: false,
                },
                {
                  // 통제방안
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004935'),
                  dataField: 'impoCtrl',
                  width: '100',
                  style: 'center-align',
                  renderer: {
                    type: 'DropDownListRenderer',
                    listFunction: (rowIndex, columnIndex, item, dataField) => {
                      return this.impoCtrlItems;
                    },
                    keyField: 'code', // key 에 해당되는 필드명
                    valueField: 'codeNm', // value 에 해당되는 필드명
                    disabledFunction: () => {
                      return this.checkDisabled;
                    },
                  },
                },
                {
                  headerText: this.$comm.getLangSpecInfoLabel('Score'),
                  dataField: 'impoCtrlScore',
                  width: '70',
                  style: 'center-align',
                  editable: false,
                },
              ],
            },
            {
              // 가중치
              headerText: this.$comm.getLangSpecInfoLabel('L0000000218'),
              dataField: 'impoWeight',
              width: '80',
              style: 'center-align',
              renderer: {
                type: 'DropDownListRenderer',
                listFunction: (rowIndex, columnIndex, item, dataField) => {
                  return this.impoWeightItems;
                },
                keyField: 'code', // key 에 해당되는 필드명
                valueField: 'codeNm', // value 에 해당되는 필드명
                disabledFunction: () => {
                  return this.checkDisabled;
                },
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004936'),
              dataField: 'impoSeriousness',
              width: '80',
              style: 'center-align',
              editable: false,
            }, // 심각성
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003944'),
              dataField: 'impoRate',
              width: '80',
              style: 'center-align',
              editable: false,
            }, // 등급
            {
              // 유형
              headerText: this.$comm.getLangSpecInfoLabel('L0000002203'),
              dataField: 'impoType',
              width: '80',
              style: 'center-align',
              renderer: {
                type: 'DropDownListRenderer',
                listFunction: (rowIndex, columnIndex, item, dataField) => {
                  return this.impoTypeItems;
                },
                keyField: 'code', // key 에 해당되는 필드명
                valueField: 'codeNm', // value 에 해당되는 필드명
                disabledFunction: () => {
                  return this.checkDisabled;
                },
              },
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004937'),
          dataField: 'confDesc',
          width: '200',
          style: 'center-align',
          type: 'text',
        }, // 대응방안
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004938'),
          dataField: 'envImpoYnNm',
          width: '100',
          style: 'center-align',
          editable: false,
        }, // 중요 환경영향 여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000276'),
          dataField: 'imprActLbl',
          width: '100',
          style: 'center-align grid-link-cell',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002737'),
          dataField: 'imprActImmeLbl',
          width: '100',
          style: 'center-align grid-link-cell',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004939'),
          dataField: 'managerComment',
          width: '300',
          style: 'left-align',
          editable: false,
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004956'),
          color: 'blue',
          btnClicked: 'helpDownload',
          visible: this.editable,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001926'),
          color: 'blue',
          btnClicked: 'excelDownload',
          visible: this.editable,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001969'),
          color: 'gray',
          btnClicked: 'excelUpload',
          visible: this.editable,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'addRow',
          visible: this.editable,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'delRow',
          visible: this.editable,
        },
      ];

      this.gridOptions.header = header;
    },
    addRow() {
      let _evalRslt = {
        evalPlanNo: this.evalPlan.evalPlanNo,
        evalRsltNo: 0,
        safFacilityCd: '',
        safFacilityNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요,
        detailProcess: this.$comm.getLangSpecInfoLabel('L0000002286'), // '입고',
        facilityNm: '',
        facilityFuel: '',
        facilityAmt: '',
        inputNm: '',
        inputAmt: '',
        outputNm: '',
        outputAmt: '',
        residueNm: '',
        residueAmt: '',
        envGen: this.$comm.getLangSpecInfoLabel('L0000003569'), // '정상',
        envAct: '',
        envImpDiv: this.$comm.getLangSpecInfoLabel('L0000004901'), // '대기오염',
        envImpMng: '',
        envImpIssue: 1,
        impoGen: 1,
        impoEffect: 2,
        impoToxic: this.$comm.getLangSpecInfoLabel('L0000004902'), // '낮음',
        impoToxicScore: 1,
        impoQnt: this.$comm.getLangSpecInfoLabel('L0000004903'), // '적음',
        impoQntScore: 1,
        impoCtrl: this.$comm.getLangSpecInfoLabel('L0000004902'), // '낮음',
        impoCtrlScore: 0,
        impoWeight: 1,
        impoSeriousness: 1,
        impoRate: 'L',
        impoType: '1',
        confDesc: '',
        envImpoYn: 'N',
        envImpoYnNm: this.$comm.getLangSpecInfoLabel('L0000001065'), // '미해당',
        managerComment: '',
        managerDt: '',
        managerId: '',
        managerNm: '',
        createDt: '',
        createUserId: '',
        lang: '',
        imprActLbl: this.$comm.getLangSpecInfoLabel('L0000000276'), // '개선조치',
        imprActImmeLbl: this.$comm.getLangSpecInfoLabel('L0000002737'), // '즉시조치',
      };

      this.$http.url = this.$format(this.insertUrl, this.$comm.getLang());
      this.$http.type = 'POST';
      this.$http.param = _evalRslt;
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.gridOptions.data.splice(
              this.gridOptions.data.length,
              0,
              _result.data
            );
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    delRow() {
      let selectRowItem = this.YAuiGrid.getCheckedRowItemsAll();
      this.$http.url = this.deleteUrl;
      this.$http.type = 'PUT';
      this.$http.param = selectRowItem;
      this.$http.request(
        (_result) => {
          if (_result.data) {
            let deleteData = this.$_.map(selectRowItem, 'evalRsltNo');
            let data = [];
            this.gridOptions.data.forEach((item) => {
              if (deleteData.indexOf(item.evalRsltNo) < 0) {
                data.push(item);
              }
            });
            this.gridOptions.data = data;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkClicked(data) {
      if (this.editable === false) return;

      this.selectedResult = data.item;
      this.rowIndex = data.rowIndex;
      if (data.dataField === 'safFacilityNm') {
        this.popupOptions.target = () =>
          import(`${'../../baseInfo/facility/facilityMstPopup.vue'}`);
        this.popupOptions.title = 'L0000003680';
        this.popupOptions.width = '85%';
        this.popupOptions.param = {
          multiple: false,
          plantDisabled: true,
          processDisabled: true,
          plantCd: this.evalPlan.plantCd,
          processCd: this.evalPlan.tgtProcessCd,
        };
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeFacilityPopup;
      } else if (data.dataField === 'imprActLbl') {
        this.onImprAct('BATCH');
      } else if (data.dataField === 'imprActImmeLbl') {
        this.onImprAct('NOW');
      }
    },
    closeFacilityPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') {
        return;
      }
      if (data && data.safFacilityCd) {
        this.selectedResult.safFacilityCd = data.safFacilityCd;
        this.selectedResult.safFacilityNm = data.facilityNm;
        this.YAuiGrid.updateRow(this.selectedResult, this.rowIndex);
        this.evalPlan.envEffectEvalRslts = this.YAuiGrid.getGridData();
      }
    },
    onImprAct(flag) {
      if (
        this.selectedResult.actClassCd == null ||
        this.selectedResult.actClassCd === ''
      ) {
        this.selectedResult.actClassCd = flag === 'NOW' ? 'ACL01' : 'ACL02';
      }

      this.popupOptions.param = {
        safImprActNo: 0,
        imprClassCd: 'ICL35',
        refTableId: this.selectedResult.evalRsltNo,
        flag: flag,
      };

      if (flag === 'NOW') {
        this.popupOptions.title = 'L0000002740'; /* 즉시조치등록 */
        this.popupOptions.target = () =>
          import(`${'../../impr/immediateActionNewDetail.vue'}`);
      } else if (flag === 'BATCH') {
        this.popupOptions.title = 'L0000004216'; /* 개선요청일괄등록 */
        this.popupOptions.target = () =>
          import(`${'../../impr/actionRequestBatch.vue'}`);
      }

      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeImprAct;
    },
    closeImprAct(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    tableInputChange(scope) {
      // 자동계산
      // let row = this.$_.find(this.gridOptions.data, { evalRsltNo: scope.row.evalRsltNo });
      if (
        scope.name === 'impoToxic' ||
        scope.name === 'impoQnt' ||
        scope.name === 'impoCtrl'
      ) {
        this.calcImpoEffect(scope.row);
      } else if (scope.name === 'impoGen' || scope.name === 'impoWeight') {
        this.calcImpoSeriousness(scope.row);
      }
    },
    calcImpoEffect(row) {
      // 부정적영향 계산 : 유해성+양+통제방안의 합
      let toxic = 1;
      let qnt = 1;
      let ctrl = 0;
      if (row.impoToxic === this.$comm.getLangSpecInfoLabel('L0000004909')) {
        toxic = 2;
      }
      // 높음
      if (row.impoQnt === this.$comm.getLangSpecInfoLabel('L0000004910')) {
        qnt = 2;
      }
      // 많음
      if (row.impoCtrl === this.$comm.getLangSpecInfoLabel('L0000004909')) {
        ctrl = 1;
      }
      // 높음

      row.impoToxicScore = toxic;
      row.impoQntScore = qnt;
      row.impoCtrlScore = ctrl;
      row.impoEffect = toxic + qnt + ctrl;

      this.calcImpoSeriousness(row);
    },
    calcImpoSeriousness(row) {
      // 심각성 계산 : 발생가능성*부정적영향*가중치
      row.impoSeriousness =
        parseInt(row.impoGen, 10) *
        parseInt(row.impoEffect, 10) *
        parseInt(row.impoWeight, 10);

      this.calcImpoRate(row);
    },
    calcImpoRate(row) {
      // 등급 계산 : 심각성 16이상=H, 4이상~16미만=M, 4미만=L
      row.impoRate =
        parseInt(row.impoSeriousness, 10) >= 16
          ? 'H'
          : parseInt(row.impoSeriousness, 10) < 4
          ? 'L'
          : 'M';
      row.envImpoYn = row.impoRate === 'H' ? 'Y' : 'N';
      row.envImpoYnNm =
        row.impoRate === 'H'
          ? this.$comm.getLangSpecInfoLabel('L0000003213')
          : this.$comm.getLangSpecInfoLabel('L0000001065');
      // 해당:미해당
    },
    getEvalRsltData() {
      // 환경영향평가 결과 목록 반환
      return this.gridOptions.data;
    },
    helpDownload() {
      let accept = this.$comm.getAccept('xlsx');
      this.$http.url = this.downloadHelpUrl; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          let fileName = '도움말_환경측면 파악 영향 평가서(KZB-0802-02).xlsx';
          var blob = this.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    excelDownload() {
      let accept = this.$comm.getAccept('xlsx');
      this.$http.url = this.downloadUrl; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          let fileName = '환경영향평가_결과_업로드양식.xlsx';
          var blob = this.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    excelUpload() {
      this.popupOptions.target = () => import(`${'./excelUpload.vue'}`);
      this.popupOptions.title = 'L0000004898'; // 환경영향평가 결과
      this.popupOptions.param = {
        evalPlanNo: this.evalPlan.evalPlanNo,
      };
      this.popupOptions.visible = true;
      this.popupOptions.width = '90%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data) {
        this.$http.url = this.$format(this.searchUrl, this.evalPlan.evalPlanNo);
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            if (_result.data) {
              this.evalPlan.envEffectEvalRslts = _result.data;
              this.gridOptions.data = this.evalPlan.envEffectEvalRslts;
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
  },
};
</script>
