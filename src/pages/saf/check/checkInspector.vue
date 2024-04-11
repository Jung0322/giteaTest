<!--
  목적 : 안전점검 관리 - 안전점검결과 - 점검자
  Detail : 안전점검 점검자
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <!-- 점검팀원 테이블 -->
        <b-row>
          <b-col sm="12">
            <y-auigrid
              ref="yAuiGrid"
              :editable="editable && !disabled"
              :headers="gridInspectorInOptions.header"
              :btns="gridInspectorInOptions.btns"
              :height="gridInspectorInOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000004884')"
              :items="gridInspectorInOptions.data"
              :useExcelExport="false"
              :showRowCheckColumn="true"
              @cellEditEnd="cellEditEndHandler"
              @btnInAdd="btnInAdd"
              @btnInDelete="btnInDelete"
              @btnClickedError="btnClickedErrorCallback"
            />
          </b-col>
        </b-row>
        <!-- 점검수행팀원(외부) 테이블 -->
        <b-row class="mt-1">
          <b-col sm="12">
            <y-auigrid
              ref="yAuiGrid2"
              :editable="editable && !disabled"
              :headers="gridInspectorOutOptions.header"
              :btns="gridInspectorOutOptions.btns"
              :height="gridInspectorOutOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000004885')"
              :items="gridInspectorOutOptions.data"
              :useExcelExport="false"
              :showRowCheckColumn="true"
              @cellEditEnd="cellEditEndHandler2"
              @btnOutAdd="btnOutAdd"
              @btnOutDelete="btnOutDelete"
              @btnClickedError="btnClickedErrorCallback"
            />
          </b-col>
        </b-row>
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
  name: 'y-check-inspector',
  props: {
    popupMode: false,
    authDuringAppr: false,
    checkResultDetail: {
      type: Object,
      default: {
        safCheckScheduleNo: 0,
        innerTeamData: [],
        outerTeamData: [],
        checkStepCd: '',
        checkPlanFlag: false, // 탭에 정보 조회 후 등록/수정 판단용 flag
      },
    },
    checkStepCd: '',
  },
  data: () => ({
    gridInspectorInOptions: {
      // 점검팀원
      header: [],
      data: [],
      height: '250',
    },
    gridInspectorOutOptions: {
      // 점검팀(외부)
      header: [],
      data: [],
      height: '250',
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
    selectedInValue: [],
    selectedOutValue: [],
    editable: false,
    isInsert: false,
    isEdit: false,
    disabled: false,
    searchUrl: '',
    checkSchHourItems: [],
    checkSchMinuteItems: [],

    YAuiGrid: null,
    YAuiGrid2: null,
    tmpIdx: 0,
  }),
  watch: {
    'checkResultDetail.safCheckScheduleNo': function (newValue, oldValue) {
      // this.gridInspectorInOptions.data = [];
      // this.gridInspectorOutOptions.data = [];
      if (this.checkResultDetail.safCheckScheduleNo > 0) {
        this.searchUrl = selectConfig.saf.checkInspector.list.url;
        this.getList('CLS01'); // 점검팀원 리스트 조회
        this.getList('CLS02'); // 점검팀(외부) 리스트 조회
      }
    },
    'gridInspectorInOptions.data': {
      handler: function (val, oldVal) {
        this.checkResultDetail.innerTeamData = this.gridInspectorInOptions.data;
      },
      deep: true,
    },
    'gridInspectorOutOptions.data': {
      handler: function (val, oldVal) {
        this.checkResultDetail.outerTeamData =
          this.gridInspectorOutOptions.data;
        // this.YAuiGrid2.setGridData(this.checkResultDetail.outerTeamData);
      },

      deep: true,
    },

    // 'checkResultDetail.outerTeamData': {
    //   handler: function (val, oldVal) {},

    //   deep: true,
    // },
    'checkResultDetail.checkPlanFlag': function (newVal, oldVal) {
      this.disabled = this.checkResultDetail.checkPlanFlag;
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.disabled = this.checkResultDetail.checkPlanFlag;
      this.gridInspectorInOptions.data = [];
      this.gridInspectorOutOptions.data = [];
      // Url Setting
      this.searchUrl = selectConfig.saf.checkInspector.list.url;

      // 점검시간 셋팅
      var i = 0;
      for (; i < 24; i++) {
        if (i < 10) {
          this.checkSchHourItems.push({
            codeNm: '0' + i.toString() + '시',
            code: '0' + i.toString(),
          });
        } else {
          this.checkSchHourItems.push({
            codeNm: i.toString() + '시',
            code: i.toString(),
          });
        }
      }
      i = 0;
      for (; i < 60; i++) {
        if (i < 10) {
          this.checkSchMinuteItems.push({
            codeNm: '0' + i.toString() + '분',
            code: '0' + i.toString(),
          });
        } else {
          this.checkSchMinuteItems.push({
            codeNm: i.toString() + '분',
            code: i.toString(),
          });
        }
      }

      if (this.checkResultDetail.safCheckScheduleNo > 0) {
        this.getList('CLS01'); // 점검팀원 리스트 조회
        this.getList('CLS02'); // 점검팀(외부) 리스트 조회
      }
      this.setHeader();
      this.setGridBtn();
    },
    setHeader() {
      /**
       * 2020-02-08 KDH
       * 단계가 CHS02, CHS04 인 경우에는 예정시간을 보여주지 않는다.
       * 위의 경우가 아니라면 예정시간을 보여준다.
       * 단계가 없는 경우는 결재팝업창 또는 무계획결과로 들어왔다고 여김
       * 결재팝업창은 결과에서만 띄움으로 다음과 같이 하더라도 안전점검계획에 영향 없음
       */
      if (
        this.checkStepCd === 'CHS02' ||
        this.checkStepCd === 'CHS04' ||
        !this.checkStepCd
      ) {
        this.gridInspectorInOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
            dataField: 'userNm',
            width: '12%',
            style: 'center-align',
            editable: false,
          }, // 성명
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001662'),
            dataField: 'deptNm',
            width: '12%',
            style: 'center-align',
            editable: false,
          }, // 소속
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
            dataField: 'dutyNm',
            width: '12%',
            style: 'center-align',
            editable: false,
          }, // 직책
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002558'),
            dataField: 'checkHour',
            width: '12%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchHourItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchHourItems,
            // itemheaderText: 'codeNm',
            // itemValue: 'code',
          }, // 점검시
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002553'),
            dataField: 'checkMinute',
            width: '12%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchMinuteItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchMinuteItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검분
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002575'),
            dataField: 'checkEhour',
            width: '12%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchHourItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchHourItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검종류시
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002574'),
            dataField: 'checkEminute',
            width: '14%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchMinuteItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchMinuteItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검종료분
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'remark',
            width: '14%',
            editRenderer: {
              type: 'InputEditRenderer',
              maxlength: 600,
            },
          }, // 비고
        ];
        this.gridInspectorOutOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
            dataField: 'userNm',
            width: '12%',
            style: 'center-align',
            maxlength: 15,
          }, // 성명
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001662'),
            dataField: 'deptNm',
            width: '12%',
            style: 'center-align',
            editRenderer: {
              type: 'InputEditRenderer',
              maxlength: 30,
            },
          }, // 소속
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
            dataField: 'dutyNm',
            width: '12%',
            style: 'center-align',
            editRenderer: {
              type: 'InputEditRenderer',
              maxlength: 30,
            },
          }, // 직책
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002558'),
            dataField: 'checkHour',
            width: '12%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchHourItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchHourItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검시
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002553'),
            dataField: 'checkMinute',
            width: '12%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchMinuteItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchMinuteItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검분
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002575'),
            dataField: 'checkEhour',
            width: '12%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchHourItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchHourItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검종료시
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002574'),
            dataField: 'checkEminute',
            width: '12%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchMinuteItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchMinuteItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검종료분
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'remark',
            width: '16%',
            editRenderer: {
              type: 'InputEditRenderer',
              maxlength: 600,
            },
          }, // 비고
        ];
      } else {
        this.gridInspectorInOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
            dataField: 'userNm',
            width: '11%',
            style: 'center-align',
          }, // 성명
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001662'),
            dataField: 'deptNm',
            width: '11%',
            style: 'center-align',
          }, // 소속
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
            dataField: 'dutyNm',
            width: '11%',
            style: 'center-align',
          }, // 직책
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002558'),
            dataField: 'checkHour',
            width: '11%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchHourItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchHourItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검시
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002563'),
            dataField: 'checkSchHour',
            width: '11%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchHourItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchHourItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검예정시
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002562'),
            dataField: 'checkSchMinute',
            width: '11%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchMinuteItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchMinuteItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검예정분
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002567'),
            dataField: 'checkSchEhour',
            width: '11%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchHourItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchHourItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검예정종료시
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002566'),
            dataField: 'checkSchEminute',
            width: '11%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchMinuteItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchMinuteItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검예정종료분
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'remark',
            width: '12%',
            editRenderer: {
              type: 'InputEditRenderer',
              maxlength: 600,
            },
          }, // 비고
        ];
        this.gridInspectorOutOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
            dataField: 'userNm',
            width: '12%',
            style: 'center-align',
            editRenderer: {
              type: 'InputEditRenderer',
              maxlength: 15,
            },
          }, // 성명
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001662'),
            dataField: 'deptNm',
            width: '12%',
            style: 'center-align',
            editRenderer: {
              type: 'InputEditRenderer',
              maxlength: 30,
            },
          }, // 소속
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
            dataField: 'dutyNm',
            width: '12%',
            style: 'center-align',
            editRenderer: {
              type: 'InputEditRenderer',
              maxlength: 30,
            },
          }, // 직책
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002563'),
            dataField: 'checkSchHour',
            width: '12%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchHourItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchHourItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검예정시
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002562'),
            dataField: 'checkSchMinute',
            width: '12%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchMinuteItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchMinuteItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검예정분
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002567'),
            dataField: 'checkSchEhour',
            width: '12%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchHourItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchHourItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검예정종료시
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002566'),
            dataField: 'checkSchEminute',
            width: '12%',
            style: 'center-align',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.checkSchMinuteItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
              // disabledFunction: () => {
              //   return this.checkDisabled;
              // },
            },
            // items: this.checkSchMinuteItems,
            // itemText: 'codeNm',
            // itemValue: 'code',
          }, // 점검예정종료분
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'remark',
            width: '16%',
            editRenderer: {
              type: 'InputEditRenderer',
              maxlength: 600,
            },
          }, // 비고
        ];
      }
      this.gridInspectorInOptions.height = '370';
      this.gridInspectorOutOptions.height = '370';
      this.$forceUpdate();
    },
    setGridBtn() {
      this.gridInspectorInOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnInAdd',
          btnClickedError: 'btnClickedError',
          visible: !this.disabled && this.editable && !this.popupMode,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnInDelete',
          btnClickedError: 'btnClickedError',
          visible: !this.disabled && this.editable && !this.popupMode,
        }, // 삭제
      ];

      this.gridInspectorOutOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnOutAdd',
          btnClickedError: 'btnClickedError',
          visible: !this.disabled && this.editable && !this.popupMode,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnOutDelete',
          btnClickedError: 'btnClickedError',
          visible: !this.disabled && this.editable && !this.popupMode,
        }, // 삭제
      ];
      this.YAuiGrid.setBtnArr(this.gridInspectorInOptions.btns);
      this.YAuiGrid2.setBtnArr(this.gridInspectorOutOptions.btns);
    },
    /** 점검팀원 목록, 점검팀(외부) 목록 조회 **/
    getList(classCd) {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        safCheckScheduleNo: this.checkResultDetail.safCheckScheduleNo,
        inspectorClassCd: classCd,
      };
      this.$http.request(
        (_result) => {
          if (classCd === 'CLS01') {
            this.gridInspectorInOptions.data = this.$_.clone(_result.data);
          } else if (classCd === 'CLS02') {
            this.gridInspectorOutOptions.data = this.$_.clone(_result.data);
          }
          this.$forceUpdate();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** button 관련 이벤트 **/
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.users) {
        this.$_.forEach(data.users, (user) => {
          if (
            this.$_.indexOf(
              this.$_.map(this.YAuiGrid.getGridData(), 'userId'),
              user.userId
            ) > -1
          ) {
            return;
          }
          let row = {
            userId: user.userId,
            userNm: user.userNm,
            deptCd: user.deptCd,
            deptNm: user.deptNm,
            dutyNm: user.positionNm,
            checkSchHour: '00',
            checkSchMinute: '00',
            checkSchEhour: '00',
            checkSchEminute: '00',
            inspectorClassCd: 'CLS01',
          };
          this.YAuiGrid.addRow(row, 'last');
        });
        this.checkResultDetail.innerTeamData = this.YAuiGrid.getGridData();
      }
    },
    /**
     * 점검팀원 행 추가
     */
    btnInAdd() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.checkResultDetail.plantCd,
        deptCd: this.checkResultDetail.pfmDeptCd,
        // deptCd: this.checkResultDetail.deptCd,
      };
    },
    /**
     * 점검팀원 행 삭제
     */
    btnInDelete() {
      let gridData = this.YAuiGrid.getGridData();
      const selectedRowItems = this.YAuiGrid.getCheckedRowItemsAll();
      if (gridData.length > 0 && selectedRowItems.length > 0) {
        this.$_.forEach(selectedRowItems, (item) => {
          gridData = this.$_.reject(gridData, item);
        });
        this.YAuiGrid.setGridData(gridData);
        this.checkResultDetail.innerTeamData = gridData;
      }
    },
    /**
     * 점검팀(외부) 행 추가
     */
    btnOutAdd() {
      const addData = {
        id: this.tmpIdx++,
        userId: '',
        userNm: '',
        deptCd: '',
        deptNm: '',
        dutyNm: '',
        checkSchHour: '00',
        checkSchMinute: '00',
        checkSchEhour: '00',
        checkSchEminute: '00',
        inspectorClassCd: 'CLS02',
      };

      this.YAuiGrid2.addRow(addData);
      this.checkResultDetail.outerTeamData.push(addData);
    },
    /**
     * 점검팀(외부) 행 삭제
     */
    btnOutDelete() {
      let gridData = this.YAuiGrid2.getGridData();
      const selectedRowItems = this.YAuiGrid2.getCheckedRowItemsAll();
      if (gridData.length > 0 && selectedRowItems.length > 0) {
        this.$_.forEach(selectedRowItems, (item) => {
          gridData = this.$_.reject(gridData, item);
        });
        this.YAuiGrid2.setGridData(gridData);
        this.checkResultDetail.outerTeamData = gridData;
      }
    },
    cellEditEndHandler() {
      this.checkResultDetail.innerTeamData = this.YAuiGrid.getGridData();
    },
    cellEditEndHandler2() {
      this.checkResultDetail.outerTeamData = this.YAuiGrid2.getGridData();
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
