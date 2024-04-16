<!--
  목적 : 위험성평가 > 작업위험성평가 > 평가 계획 상세 > 평가대상 작업 탭
  작성자 : kyh
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <!-- 평가결과 목록 -->

        <y-auigrid
          ref="yAuiGrid"
          :editable="editable && apprMode"
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
          :showGridCtrl="true"
          :showRowCheckColumn="true"
          @btnExcelTemplateDownClicked="btnExcelTemplateDownClicked"
          @btnExcelUploadClicked="btnExcelUploadClicked"
          @addRow="addRow"
          @deleteRow="deleteRow"
          @cellEditEnd="cellEditEndHandler"
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
  name: 'rsaPlanDetailList',
  props: {
    Planmgmt: {
      type: Object,
      default: () => ({
        assessPlanNo: 0,
        plantCd: '', // 사업장 코드
        assessYear: '',
        classificationCd: '',
        regRegdemCd: '',
        assessNm: '',
        assessDt: null,
        assessDesc: '',
        riskType: null,
        planmgmtDeptList: [],

        deptList: [],
        deptCd: '',
        deptNm: '',
        tempAssessYear: '',
      }),
    },
    deptListLoad: false,
    updateMode: false,
    deptReLoad: false,
    apprMode: false,
  },
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
      gridOptions: {
        header: [],
        data: [],

        height: 'auto',
      },
      editable: true,
      selectedValues: [], // 그리드 선택 목록
      // deptList: [],
      deleteValue: null,

      detailUrl: '',
      riskTypeItems: [],
      editableFlag: false,
      YAuiGrid: null,
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.detailUrl = selectConfig.rsa.planmgmt2.getResult.url;
      // 그리드 버튼 설정

      this.gridOptions.btns = [
        // 다운로드
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004245'),
          color: 'orange',
          btnClicked: 'btnExcelTemplateDownClicked',
        },
        // 엑셀업로드
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001969'),
          color: 'orange',
          btnClicked: 'btnExcelUploadClicked',
        },
        // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'addRow',
        },
        // 삭제
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'deleteRow',
        },
      ];
      // 그리드 헤더 설정
      // this.gridOptions.header = [
      //   // 작업단계(분석)
      //   {
      //     headerText: this.$comm.getLangSpecInfoLabel('L0000005869'),
      //     dataField: 'jobStep',
      //     width: 340,
      //   },
      //   {
      //     // 유해위험요인
      //     headerText: this.$comm.getLangSpecInfoLabel('L0000002179'),
      //     dataField: 'classificationNm',
      //     children: [
      //       {
      //         headerText: this.$comm.getLangSpecInfoLabel('L0000005870'),
      //         dataField: 'causeEffect',
      //         width: 300,
      //       }, // 원인 및 결과
      //       {
      //         headerText: this.$comm.getLangSpecInfoLabel('L0000001082'),
      //         dataField: 'riskType',
      //         width: 300,
      //       }, // 발생형태
      //     ],
      //   },
      //   {
      //     // 현재 안전조치
      //     headerText: this.$comm.getLangSpecInfoLabel('L0000005871'),
      //     dataField: 'preventMeasure',
      //     width: 600,
      //   },
      //   {
      //     // 위험도
      //     headerText: this.$comm.getLangSpecInfoLabel('L0000002121'),
      //     dataField: 'classificationNm',
      //     children: [
      //       {
      //         headerText: this.$comm.getLangSpecInfoLabel('L0000001378'),
      //         dataField: 'frequency',
      //         width: 120,
      //       }, // 빈도
      //       {
      //         headerText: this.$comm.getLangSpecInfoLabel('L0000000248'),
      //         dataField: 'strong',
      //         width: 120,
      //       }, // 강도
      //       {
      //         headerText: this.$comm.getLangSpecInfoLabel('L0000002121'),
      //         dataField: 'risk',
      //         width: 120,
      //       }, // 위험도
      //     ],
      //   },
      //   {
      //     // 중요위험번호
      //     headerText: this.$comm.getLangSpecInfoLabel('L0000005872'),
      //     dataField: 'refTableId',
      //     width: 200,
      //   },
      // ];
      this.setHeader();
    },
    getList() {
      if (!this.Planmgmt.assessRsltNo) return;
      this.$http.url = this.$format(this.detailUrl, this.Planmgmt.assessRsltNo);
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.Planmgmt.planmgmtDeptList = _result.data.planmgmtDeptList;
          // 재평가가 이루어질때 이전 jsaNo 가 존재하면서 reAssessTargetYn 이  N 인 경우는 비활성화
          this.$_.forEach(this.Planmgmt.planmgmtDeptList, (t) => {
            t.isEdit = true;
            if (t.prevJsaNo && t.reAssessTargetYn === 'N') {
              t.isEdit = false;
            }
          });
          this.gridOptions.data = this.Planmgmt.planmgmtDeptList;
          this.YAuiGrid.setGridData(this.Planmgmt.planmgmtDeptList);

          if (
            this.Planmgmt.assessStepCd === 'RRS03' ||
            this.Planmgmt.assessStepCd === 'RRS02'
          ) {
            this.editable = false;
          }
          if (
            this.Planmgmt.assessStepCd === 'RRS03' ||
            this.Planmgmt.assessStepCd === 'RRS02'
          ) {
            // 결재중, 결재완료인 경우
            this.editable = false;
          } else if (this.Planmgmt.apprRqstStatus === 'BAPSA') {
            // 결재중
            this.editable = false;
          } else if (this.Planmgmt.apprRqstStatus === 'BAPSG') {
            // 결재완료
            this.editable = false;
            this.disabled = true;
            this.updateMode = false;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * showAccidentPopup 호출
     * 평가계획 목록에 평가명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    tableLinkClicked(header, data) {
      if (header.name === 'refTableId') {
        this.showApprProgressPopup(data);
      }
    },
    setHeader() {
      // 위험유해
      this.$comm.getComboItems('RSA_RISK', true).then((_result) => {
        this.riskTypeItems = _result;

        this.$_.forEach(this.riskTypeItems, (item, index) => {
          if (item.code === null) {
            this.riskTypeItems[index] = {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel(
                  'L0000003394'
                ) /* '선택하세요' */,
            };
          }
        });

        // 그리드 헤더 설정
        this.gridOptions.header = [
          // 작업단계(분석)
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005869'),
            dataField: 'jobStep',
            width: 300,
            editRenderer: {
              // text input 사용시 InputEditRenderer
              type: 'InputEditRenderer',
              textAlign: 'left', // 왼쪽 정렬로 입력되도록 설정
              maxlength: 25, // 글자수 25으로 제한
            },
          },
          {
            // 유해위험요인
            headerText: this.$comm.getLangSpecInfoLabel('L0000002179'),
            dataField: 'classificationNm',
            children: [
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000005870'),
                dataField: 'causeEffect',
                width: 250,
                renderer: {
                  type: 'DropDownListRenderer',
                  listFunction: () => {
                    return this.riskTypeItems;
                  },
                  keyField: 'code', // key 에 해당되는 필드명
                  valueField: 'codeNm', // value 에 해당되는 필드명
                  disabledFunction: () => {
                    return !this.editable && this.apprMode;
                  },
                },
              }, // 원인 및 결과
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000001082'),
                dataField: 'riskType',
                width: 250,
                editRenderer: {
                  // text input 사용시 InputEditRenderer
                  type: 'InputEditRenderer',
                  textAlign: 'left', // 왼쪽 정렬로 입력되도록 설정
                  maxlength: 25, // 글자수 25으로 제한
                },
              }, // 발생형태
            ],
          },
          {
            // 현재 안전조치
            headerText: this.$comm.getLangSpecInfoLabel('L0000005871'),
            dataField: 'preventMeasure',
            width: 600,
            editRenderer: {
              // text input 사용시 InputEditRenderer
              type: 'InputEditRenderer',
              textAlign: 'left', // 왼쪽 정렬로 입력되도록 설정
              maxlength: 25, // 글자수 25으로 제한
            },
          },
          {
            // 위험도
            headerText: this.$comm.getLangSpecInfoLabel('L0000002121'),
            dataField: 'classificationNm',
            children: [
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000001378'),
                dataField: 'frequency',
                width: 120,
                dataType: 'numeric',
                editRenderer: {
                  type: 'InputEditRenderer',
                  onlyNumeric: true,
                  maxlength: 2,
                  autoThousandSeparator: true,
                },
              }, // 빈도
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000000248'),
                dataField: 'strong',
                width: 120,
                dataType: 'numeric',
                editRenderer: {
                  type: 'InputEditRenderer',
                  onlyNumeric: true,
                  maxlength: 2,
                  autoThousandSeparator: true,
                },
              }, // 강도
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000002121'),
                dataField: 'risk',
                width: 120,
                editable: false,
                dataType: 'numeric',
                editRenderer: {
                  type: 'InputEditRenderer',
                  onlyNumeric: true,
                  maxlength: 3,
                  autoThousandSeparator: true,
                },
              }, // 위험도
            ],
          },
          {
            // 중요위험번호
            headerText: this.$comm.getLangSpecInfoLabel('L0000005872'),
            dataField: 'refTableId',
            width: 200,
            editable: false,
            editRenderer: {
              // text input 사용시 InputEditRenderer
              type: 'InputEditRenderer',
              textAlign: 'left', // 왼쪽 정렬로 입력되도록 설정
              maxlength: 25, // 글자수 25으로 제한
            },
          },
        ];
      });
    },
    // 개선요청상태 조회
    showApprProgressPopup(data) {
      if (data.safImprActNo > 0) {
        this.popupOptions.title = 'L0000000268'; /* 개선요청등록 */
        this.popupOptions.target = () =>
          import(`${'@/pages/impr/improveDetail.vue'}`);
        this.popupOptions.param = {
          safImprActNo: data.safImprActNo,
          refTableId: data.jsaNo,
          imprClassCd: 'ICL45',
          imprStepCd: 'IMST2',
        };

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: '중요위험번호가 없습니다.', // 중요위험번호가 없습니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
    },
    cellEditEndHandler(event) {
      let tempGridData = this.YAuiGrid.getGridData();
      let tempFrequency = event.item.frequency;
      let tempStrong = event.item.strong;
      tempGridData[event.rowIndex].risk = tempFrequency * tempStrong;
      this.YAuiGrid.setGridData(tempGridData);
      this.Planmgmt.planmgmtDeptList = tempGridData;
    },

    btnExcelUploadClicked() {
      this.popupOptions.target = () => import(`${'./resultExcelUpload.vue'}`);
      this.popupOptions.param = {};
      // 위험성평가 결과 엑셀 업로드
      this.popupOptions.title = 'L0000005884';
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data) {
        this.$_.forEach(data, (item) => {
          item.riskType = item.riskTypeCd;
          item.isEdit = true;
          this.gridOptions.data.push(item);
        });
      }
    },
    btnExcelTemplateDownClicked() {
      let thisVue = this;
      let accept = this.$comm.getAccept('xlsx');
      let _comm = this.$comm;

      this.$http.url = selectConfig.rsa.planmgmt2.getExcelSample.url;
      this.$http.type = 'GET';
      this.$http.param = { publishYn: true };
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(
              blob,
              '위험성평가_평가결과_업로드_양식.xlsx'
            );
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);

            link.download = '위험성평가_평가결과_업로드_양식.xlsx';

            link.click();
          }
        },
        (_error) => {
          this.pageAlert = {
            alertType: 'error',
            alertMsg: this.gm(
              'common.file.download.error.msg',
              '첨부파일 다운로드시 오류가 발생했습니다.'
            ),
          };
        }
      );
    },
    addRow() {
      let tempGridData = this.YAuiGrid.getGridData();
      let rowData = {
        jobStep: '',
        causeEffect: '',
        riskType: null,
        preventMeasure: '',
        frequency: 0,
        strong: 0,
        risk: 0,
        processNm: '',
        isEdit: true,
        reAssessTargetYn: 'N',
      };
      tempGridData.push(rowData);
      this.YAuiGrid.setGridData(tempGridData);
    },

    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      // this.getList();
      if (data && data.length) {
        this.$_.forEach(data, (item) => {
          this.gridOptions.data.push(item);
        });

        // this.gridOptions.data = data

        this.Planmgmt.planmgmtDeptList = this.gridOptions.data;
      }
    },
    deleteRow() {
      let selectedValues = this.YAuiGrid.getCheckedRowItemsAll();
      let tempGridData = this.YAuiGrid.getGridData();
      if (!selectedValues || !selectedValues.length) {
        this.$comm.alertWarning('M0000001614'); // 선택된 항목이 없습니다.
        return;
      }

      this.$_.forEach(selectedValues, (item) => {
        tempGridData = this.$_.reject(tempGridData, item);
      });
      this.YAuiGrid.setGridData(tempGridData);
    },
    // renderPhaseHeader(h, { column }) {
    //   if (column.property === 'frequency') {
    //     return h(
    //       'el-popover',
    //       {
    //         props: {
    //           placement: 'top',
    //           width: '1000',
    //           trigger: 'hover',
    //         },
    //       },
    //       [
    //         h('table', { class: 'assess-popover-table' }, [
    //           h('thead', [
    //             h('tr', [
    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     colspan: '16',
    //                     style: 'background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '위험발생빈도'
    //               ),
    //             ]),
    //             h('tr', [
    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     colspan: '2',
    //                     rowspan: '2',
    //                     style: 'text-align: center; background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '구분'
    //               ),
    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     colspan: '5',
    //                     style:
    //                       'text-align: center;  background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '내 용'
    //               ),
    //             ]),
    //             h('tr', [
    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     style:
    //                       'text-align: center;  background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '사고 유형에 대한 결과 판단'
    //               ),

    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     style:
    //                       'text-align: center;  background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '추가 판단 고려 요소'
    //               ),
    //             ]),
    //           ]),
    //           h('tbody', [
    //             h('tr', [
    //               h('td', '5'),
    //               h(
    //                 'td',
    //                 { attrs: { style: 'text-align: center;' } },
    //                 '매우높음'
    //               ),
    //               h('td', [
    //                 '● 사고 발생 가능성이 매우 높음',
    //                 h('br'),
    //                 '(1년 內 아차사고 발생 가능)',
    //                 h('br'),
    //                 '● 유해인자 발생 설비(발생원)에 접촉하여 8시간 이상 연속 근무하는 경우',
    //               ]),

    //               h('td', [
    //                 '○ 피해가 발생할 가능성이 매우 높음 (1년 內 아차사고 발생 가능) 해당 안전대책이 되어 있지 않고, 표시·표지가 있어도 제대로 갖추어져 있지 않은 것이 많으며, 안전수칙/작업표준 등도 없는 경우',
    //                 h('br'),

    //                 '○ 화학물질의 노출수준이 100%초과',
    //               ]),
    //             ]),
    //             h('tr', [
    //               h('td', '4'),
    //               h('td', { attrs: { style: 'text-align: center;' } }, '높음'),
    //               h('td', [
    //                 '● 사고 발생 가능성이 높음 (분기 1회)',
    //                 h('br'),
    //                 '● 유해인자 발생 설비(발생원)에 접촉하여 6시간 이상 ~ 8시간 미만 연속 근무하는 경우',
    //               ]),

    //               h('td', [
    //                 '○ 피해가 발생할 가능성이 높음 (분기 1회) 가드/방호덮개, 기타 안전장치가 없거나 제대로 설치되지 않은 것이 많고, 안전수칙/표준, 비상정지장치, 표시/표지 등이 어느 정도 설치되어 있으나, 지키기 어렵고 많은 주의를 해야 함',
    //                 h('br'),
    //                 '○ 화학물질의 노출수준이 50%초과 ~ 100%이하',
    //               ]),
    //             ]),
    //             h('tr', [
    //               h('td', '3'),
    //               h('td', { attrs: { style: 'text-align: center;' } }, '보통'),
    //               h('td', [
    //                 '● 사고 발생 가능성이 있음 (반기 1회)',
    //                 h('br'),
    //                 '● 유해인자 발생 설비(발생원)에 접촉하여 4시간 이상 ~ 6시간 미만 연속 근무하는 경우',
    //               ]),

    //               h('td', [
    //                 '○ 부주의하면 피해가 발생할 가능성이 있음 (반기 1회) 가드/방호덮개 또는 안전장치 등은 설치되어 있지만, 가드가 낮거나 간격이 벌어져 있는 등 제대로 갖추어져 있지 않거나, 위험영역 접근, 위험원과의 접촉이 있을 수 있으며, 안전수칙/작업표준 등은 있지만 준수하기 어려운 점이 있음',

    //                 h('br'),
    //                 '○ 화학물질의 노출수준이 10% 초과 ~ 50% 이하',
    //               ]),
    //             ]),
    //             h('tr', [
    //               h('td', '2'),
    //               h('td', { attrs: { style: 'text-align: center;' } }, '낮음'),
    //               h('td', [
    //                 '● 사고 발생 가능성 낮음 (1년 1회)',
    //                 h('br'),
    //                 '● 유해인자 발생 설비(발생원)에 접촉하여 4시간 미만 연속 근무하는 경우',
    //               ]),

    //               h('td', [
    //                 '○ 부주의하면 피해가 발생할 가능성이 있음 (년 1회) 가드/방호덮개 또는 안전장치 등은 설치되어 있지만, 가드가 낮거나 간격이 벌어져 있는 등 제대로 갖추어져 있지 않거나, 위험영역 접근, 위험원과의 접촉이 있을 수 있으며, 안전수칙/작업표준 등은 있지만 일부 준수하기 어려운 점이 있음',

    //                 h('br'),
    //                 '○ 화학물질의 노출수준이 10%이하',
    //               ]),
    //             ]),
    //             h('tr', [
    //               h('td', '1'),
    //               h(
    //                 'td',
    //                 { attrs: { style: 'text-align: center;' } },
    //                 '매우낮음'
    //               ),
    //               h('td', [
    //                 '● 사고 발생 가능성 거의 없음 (3년 1회)',
    //                 h('br'),
    //                 '● 유해인자 발생 설비(발생원)에 접촉하여 1시간 미만 연속 근무하는 경우',
    //               ]),

    //               h('td', [
    //                 '○ 피해가 발생할 가능성이 거의 없음 가드·방호덮개 등으로 보호되고 있어, 안전장치가 설치되어 있으며, 위험영역에서의 출입이 곤란한 상태이고, 안전수칙·작업표준(서) 등이 정비되어 있고 준수하기 쉬우나, 피해의 가능성이 남아 있음',

    //                 h('br'),
    //                 '○ 화학물질의 노출수준이 1%이하',
    //               ]),
    //             ]),
    //           ]),
    //         ]),
    //         h(
    //           'span',
    //           {
    //             slot: 'reference',
    //           },
    //           column.label
    //         ),
    //       ]
    //     );
    //   } else if (column.property === 'strong') {
    //     return h(
    //       'el-popover',
    //       {
    //         props: {
    //           placement: 'top',
    //           width: '700',
    //           trigger: 'hover',
    //         },
    //       },
    //       [
    //         h('table', { class: 'assess-popover-table' }, [
    //           h('thead', [
    //             h('tr', [
    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     colspan: '6',
    //                     style: 'background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '위험발생강도'
    //               ),
    //             ]),
    //             h('tr', [
    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     colspan: '2',
    //                     style: 'text-align: center; background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '위험강도 단계'
    //               ),
    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     colspan: '5',
    //                     style: 'text-align: center; background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '내 용'
    //               ),
    //             ]),
    //             h('tr', [
    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     colspan: '2',
    //                     style: 'text-align: center; background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '중대성'
    //               ),

    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     style: 'text-align: center; background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '인적/물적/조업'
    //               ),
    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     style: 'text-align: center; background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '소음'
    //               ),
    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     style: 'text-align: center; background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '유해인자'
    //               ),
    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     style: 'text-align: center; background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '질병'
    //               ),
    //             ]),
    //           ]),
    //           h('tbody', [
    //             h('tr', [
    //               h('td', { attrs: { style: 'text-align: center;' } }, '4'),
    //               h('td', { attrs: { style: 'text-align: center;' } }, '최대'),
    //               h(
    //                 'td',
    //                 '사망/8주이상/장해 1~5급\n손실액 5천만원 이상\n조업중지 1일 이상, 벌금 발생'
    //               ),
    //               h('td', '90dB 이상'),
    //               h('td', '유해인자 발생수준이 100%초과(보건)'),
    //               h('td', '직업병 유소견자가 1년내 3명 이상 발생'),
    //             ]),
    //             h('tr', [
    //               h('td', { attrs: { style: 'text-align: center;' } }, '3'),
    //               h('td', { attrs: { style: 'text-align: center;' } }, '대'),
    //               h(
    //                 'td',
    //                 '중상/4주~8주/장해 6~11급\n손실액 1천 ~ 5천\n조업중지 1일 이상, 과태료 발생'
    //               ),
    //               h('td', '85 ~ 89dB'),
    //               h('td', '유해인자 발생수준이 80%초과 ~ 100%미만(보건)'),
    //               h('td', '직업병 유소견자가 1년내 2명 발생'),
    //             ]),
    //             h('tr', [
    //               h('td', { attrs: { style: 'text-align: center;' } }, '2'),
    //               h('td', { attrs: { style: 'text-align: center;' } }, '중'),
    //               h(
    //                 'td',
    //                 '보통/4일~4주/장해 12~14급\n손실액 1백만원 ~ 1천\n조업중지 없으나 과태료 발생'
    //               ),
    //               h('td', '80 ~ 84dB'),
    //               h('td', '유해인자 발생수준이 50%초과 ~ 80%미만(보건)'),
    //               h('td', '직업성 질환 요 관찰자 1년내 1명 이상 발생'),
    //             ]),
    //             h('tr', [
    //               h('td', { attrs: { style: 'text-align: center;' } }, '1'),
    //               h('td', { attrs: { style: 'text-align: center;' } }, '소'),
    //               h(
    //                 'td',
    //                 '경미/4일미만/장해\n손실액 1백만원 미만\n조업중지 無'
    //               ),
    //               h('td', '80dB 미만'),
    //               h('td', '유해인자 발생수준이 50%미만(보건)'),
    //               h('td', '직업성 질환 요 관찰자 1년내 1명 발생 가능성 있음'),
    //             ]),
    //           ]),
    //           h('tfoot', [
    //             h('tr', [
    //               h(
    //                 'td',
    //                 { attrs: { colspan: '7', style: 'font-weight: bold;' } },
    //                 '※ 유해인자 및 작업환경적 요인의 경우 보호구 등의 안전대책이 반영되어 있는 경우에 등급 1단계 하향 가능함'
    //               ),
    //             ]),
    //           ]),
    //         ]),
    //         h(
    //           'span',
    //           {
    //             slot: 'reference',
    //           },
    //           column.label
    //         ),
    //       ]
    //     );
    //   } else if (column.property === 'risk') {
    //     return h(
    //       'el-popover',
    //       {
    //         props: {
    //           placement: 'top',
    //           width: '800',
    //           trigger: 'hover',
    //         },
    //       },
    //       [
    //         h('table', { class: 'assess-popover-table' }, [
    //           h('thead', [
    //             h('tr', [
    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     colspan: '8',
    //                     style: 'background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '위험도 평가'
    //               ),
    //             ]),

    //             h('tr', [
    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     colspan: '2',
    //                     style: 'text-align: center; background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '위험도 수준'
    //               ),

    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     colspan: '5',
    //                     style: 'text-align: center; background-color: #f3f2f2;',
    //                   },
    //                 },
    //                 '관 리 기 준'
    //               ),

    //               h(
    //                 'th',
    //                 {
    //                   attrs: {
    //                     style:
    //                       'text-align: center; background-color: #f3f2f2; width: 150px;',
    //                   },
    //                 },
    //                 '비 고'
    //               ),
    //             ]),
    //           ]),
    //           h('tbody', [
    //             h('tr', [
    //               h(
    //                 'td',
    //                 { attrs: { style: 'text-align: center; width: 80px;' } },
    //                 '1 ~ 3'
    //               ),
    //               h(
    //                 'td',
    //                 { attrs: { style: 'width: 150px;' } },
    //                 '무시할 수 있는 위험'
    //               ),
    //               h(
    //                 'td',
    //                 { attrs: { colspan: '5' } },
    //                 '현재의 안전대책 유지(별도의 조치/개선계획 불필요)'
    //               ),
    //               h(
    //                 'td',
    //                 { attrs: { rowspan: '2', style: 'text-align: center;' } },
    //                 '위험 작업 수용'
    //               ),
    //             ]),
    //             h('tr', [
    //               h('td', { attrs: { style: 'text-align: center;' } }, '4 ~ 6'),
    //               h(
    //                 'td',
    //                 { attrs: { style: 'text-align: center;' } },
    //                 '미미한 위험'
    //               ),
    //               h(
    //                 'td',
    //                 { attrs: { colspan: '5' } },
    //                 '안전정보 및 주기적 표준작업안전교육/표지부착 등의 관리적 대책 필요'
    //               ),
    //             ]),
    //             h('tr', [
    //               h('td', { attrs: { style: 'text-align: center;' } }, '8 ~ 9'),
    //               h(
    //                 'td',
    //                 { attrs: { style: 'text-align: center;' } },
    //                 '보통 위험'
    //               ),
    //               h(
    //                 'td',
    //                 { attrs: { colspan: '5' } },
    //                 '계획된 정비, 보수기간에 안전대책을 세워야함/환기장치 효율성 검토\n및 성능 개선이나, 작업방법 개선이나 보호구 착용 검토'
    //               ),
    //               h(
    //                 'td',
    //                 { attrs: { rowspan: '2', style: 'text-align: center;' } },
    //                 '조건부 위험 작업 수용'
    //               ),
    //             ]),
    //             h('tr', [
    //               h(
    //                 'td',
    //                 { attrs: { style: 'text-align: center;' } },
    //                 '10 ~ 12'
    //               ),
    //               h(
    //                 'td',
    //                 { attrs: { style: 'text-align: center;' } },
    //                 '중대한 위험'
    //               ),
    //               h(
    //                 'td',
    //                 { attrs: { colspan: '5' } },
    //                 '긴급 임시 안전대책을 세운 후 작업을 하되 계획된 정비․보수기간에 안전대책을\n세워야함/작업환경 개선이 필요함'
    //               ),
    //             ]),
    //             h('tr', [
    //               h('td', { attrs: { style: 'text-align: center;' } }, '16'),
    //               h(
    //                 'td',
    //                 { attrs: { style: 'text-align: center;' } },
    //                 '허용불가 위험'
    //               ),
    //               h(
    //                 'td',
    //                 { attrs: { colspan: '5' } },
    //                 '즉시 작업중단(즉시 개선)/종합적인 작업환경관리수준 평가 실시\n(전문가 상담)'
    //               ),
    //               h(
    //                 'td',
    //                 { attrs: { style: 'text-align: center;' } },
    //                 '위험작업 불허'
    //               ),
    //             ]),
    //           ]),
    //         ]),
    //         h(
    //           'span',
    //           {
    //             slot: 'reference',
    //           },
    //           column.label
    //         ),
    //       ]
    //     );
    //   } else {
    //     return column.label;
    //   }
    // },
  },
};
</script>
<style>
table.assess-popover-table {
  border-collapse: collapse;
  border-spacing: 0;
}
table.assess-popover-table th {
  padding: 10px 10px;
  border: 1px solid #000;
}
table.assess-popover-table td {
  padding: 10px 10px;
  border: 1px solid #000;
}
</style>
