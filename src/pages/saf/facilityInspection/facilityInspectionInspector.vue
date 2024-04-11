<!--
  목적 : 시설점검 관리 - 시설점검계획/결과  - 점검자
  Detail : 시설점검 점검자
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
            <b-col sm="12" class="px-0">
              <!-- 점검수행팀원 목록 -->
              <y-auigrid
                ref="yAuiGrid"
                v-model="this.YAuiGrid"
                :editable="!disabled && editable && !authDuringAppr"
                :name="gridInspectorInOptions.name"
                :headers="gridInspectorInOptions.header"
                :btns="gridInspectorInOptions.btns"
                :height="gridInspectorInOptions.height"
                :items="gridInspectorInOptions.data"
                :label="this.$comm.getLangSpecInfoLabel('L0000004884')"
                :useExcelExport="false"
                :showRowCheckColumn="true"
                @cellEditEnd="cellEditEndHandler"
                @btnInAdd="btnInAdd"
                @btnInDelete="btnInDelete"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </b-col>
          </b-col>
        </b-row>
        <!-- 점검팀(외부) 테이블 -->
        <b-row class="mt-3">
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <!-- 점검수행팀원(외부) 목록 -->
              <y-auigrid
                ref="yAuiGrid2"
                v-model="this.YAuiGrid2"
                :editable="!disabled && editable && !authDuringAppr"
                :name="gridInspectorOutOptions.name"
                :headers="gridInspectorOutOptions.header"
                :btns="gridInspectorOutOptions.btns"
                :height="gridInspectorOutOptions.height"
                :items="gridInspectorOutOptions.data"
                :label="this.$comm.getLangSpecInfoLabel('L0000004885')"
                :useExcelExport="false"
                :showRowCheckColumn="true"
                @cellEditEnd="cellEditEndHandler2"
                @btnOutAdd="btnOutAdd"
                @btnOutDelete="btnOutDelete"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </b-col>
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
  name: 'y-facility-inspection-inspector',
  props: {
    facilityInspectionSchedule: {
      type: Object,
      default: {
        comFacilityCheckScheduleNo: 0, // 시설점검일정번호
        innerTeamData: [],
        outerTeamData: [],
        plantCd: '',
        deptCd: '',
      },
    },
    disabled: false,
    authDuringAppr: false,
    popupMode: false,
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
    checkSchHourItems: [],
    checkSchMinuteItems: [],
    editable: false,
    searchUrl: '',

    YAuiGrid: null,
    YAuiGrid2: null,
    tmpIdx: 0,
  }),
  watch: {
    'facilityInspectionSchedule.comFacilityCheckScheduleNo': function (
      newValue,
      oldValue
    ) {
      if (this.facilityInspectionSchedule.comFacilityCheckScheduleNo > 0) {
        this.searchUrl =
          selectConfig.saf.facilityInspection.facilityInspectionInspector.list.url;
        this.getList('CLS01'); // 점검팀원 리스트 조회
        this.getList('CLS02'); // 점검팀(외부) 리스트 조회
      }
    },
    'gridInspectorInOptions.data': {
      handler: function (val, oldVal) {
        this.facilityInspectionSchedule.innerTeamData =
          this.gridInspectorInOptions.data;
      },
      deep: true,
    },
    'gridInspectorOutOptions.data': {
      handler: function (val, oldVal) {
        this.facilityInspectionSchedule.outerTeamData =
          this.gridInspectorOutOptions.data;
      },
      deep: true,
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

      this.gridInspectorInOptions.data = [];
      this.gridInspectorOutOptions.data = [];
      // Url Setting
      this.searchUrl =
        selectConfig.saf.facilityInspection.facilityInspectionInspector.list.url;

      // 점검시간 셋팅
      var i = 0;
      for (; i < 24; i++) {
        if (i < 10) {
          this.checkSchHourItems.push({
            codeNm: '0' + i.toString() + '시', // 시
            code: '0' + i.toString(),
          });
        } else {
          this.checkSchHourItems.push({
            codeNm: i.toString() + '시', // 시
            code: i.toString(),
          });
        }
      }
      i = 0;
      for (; i < 60; i++) {
        if (i < 10) {
          this.checkSchMinuteItems.push({
            codeNm: '0' + i.toString() + '분', // 분
            code: '0' + i.toString(),
          });
        } else {
          this.checkSchMinuteItems.push({
            codeNm: i.toString() + '분', // 분
            code: i.toString(),
          });
        }
      }
      if (this.facilityInspectionSchedule.comFacilityCheckScheduleNo > 0) {
        this.getList('CLS01'); // 점검팀원 리스트 조회
        this.getList('CLS02'); // 점검팀(외부) 리스트 조회
      }
      this.setHeader();
      this.setGridBtn();
    },
    setHeader() {
      this.gridInspectorInOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'userNm',
          width: '14%',
        }, // 성명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001662'),
          dataField: 'deptNm',
          width: '14%',
        }, // 소속
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004886'), // 점검예정시작시
          dataField: 'checkSchHour',
          width: '14%',
          style: 'center-align',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.checkSchHourItems;
            },
            keyField: 'code', // key 에 해당되는 필드명
            valueField: 'codeNm', // value 에 해당되는 필드명
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004887'), // 점검예정시작분
          dataField: 'checkSchMinute',
          width: '14%',
          style: 'center-align',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.checkSchMinuteItems;
            },
            keyField: 'code', // key 에 해당되는 필드명
            valueField: 'codeNm', // value 에 해당되는 필드명
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002567'), // 점검예정종료시
          dataField: 'checkSchEhour',
          width: '14%',
          style: 'center-align',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.checkSchHourItems;
            },
            keyField: 'code', // key 에 해당되는 필드명
            valueField: 'codeNm', // value 에 해당되는 필드명
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002566'), // 점검예정종료분
          dataField: 'checkSchEminute',
          width: '14%',
          style: 'center-align',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.checkSchMinuteItems;
            },
            keyField: 'code', // key 에 해당되는 필드명
            valueField: 'codeNm', // value 에 해당되는 필드명
          },
        },
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

      this.gridInspectorOutOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'userNm',
          width: '14%',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 성명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001662'),
          dataField: 'deptNm',
          width: '14%',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 소속
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004886'), // 점검예정시작시
          dataField: 'checkSchHour',
          width: '14%',
          style: 'center-align',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.checkSchHourItems;
            },
            keyField: 'code', // key 에 해당되는 필드명
            valueField: 'codeNm', // value 에 해당되는 필드명
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004887'), // 점검예정시작분
          dataField: 'checkSchMinute',
          width: '14%',
          style: 'center-align',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.checkSchMinuteItems;
            },
            keyField: 'code', // key 에 해당되는 필드명
            valueField: 'codeNm', // value 에 해당되는 필드명
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002567'), // 점검예정종료시
          dataField: 'checkSchEhour',
          width: '14%',
          style: 'center-align',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.checkSchHourItems;
            },
            keyField: 'code', // key 에 해당되는 필드명
            valueField: 'codeNm', // value 에 해당되는 필드명
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002566'), // 점검예정종료분
          dataField: 'checkSchEminute',
          width: '14%',
          style: 'center-align',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.checkSchMinuteItems;
            },
            keyField: 'code', // key 에 해당되는 필드명
            valueField: 'codeNm', // value 에 해당되는 필드명
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '16%',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 300,
          },
        }, // 비고
      ];
    },
    setGridBtn() {
      this.gridInspectorInOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnInAdd',
          btnClickedError: 'btnClickedErrorCallback',
          visible:
            !this.disabled &&
            this.editable &&
            !this.authDuringAppr &&
            !this.popupMode,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnInDelete',
          btnClickedError: 'btnClickedErrorCallback',
          visible:
            !this.disabled &&
            this.editable &&
            !this.authDuringAppr &&
            !this.popupMode,
        }, // 삭제
      ];
      this.gridInspectorOutOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnOutAdd',
          btnClickedError: 'btnClickedErrorCallback',
          visible:
            !this.disabled &&
            this.editable &&
            !this.authDuringAppr &&
            !this.popupMode,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnOutDelete',
          btnClickedError: 'btnClickedErrorCallback',
          visible:
            !this.disabled &&
            this.editable &&
            !this.authDuringAppr &&
            !this.popupMode,
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
        comFacilityCheckScheduleNo:
          this.facilityInspectionSchedule.comFacilityCheckScheduleNo,
        inspectorClassCd: classCd,
      };
      this.$http.request(
        (_result) => {
          if (classCd === 'CLS01') {
            this.gridInspectorInOptions.data = this.$_.clone(_result.data);
          } else if (classCd === 'CLS02') {
            this.gridInspectorOutOptions.data = this.$_.clone(_result.data);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectedCheck() {
      return this.editable;
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
    /**
     * 점검팀원 행 추가
     */
    btnInAdd() {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.facilityInspectionSchedule.plantCd,
        deptCd: this.facilityInspectionSchedule.pfmDeptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.users) {
        // if (!this.YAuiGrid.getGridData()) {
        if (this.gridInspectorInOptions.data.length === 0) {
          this.gridInspectorInOptions.data = [];
        }
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
          this.YAuiGrid.addRow(row, 'first');
        });
        this.gridInspectorInOptions.data = this.YAuiGrid.getGridData();
      }
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
        this.facilityInspectionSchedule.innerTeamData = gridData;
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
      this.facilityInspectionSchedule.outerTeamData.push(addData);
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
        this.facilityInspectionSchedule.outerTeamData = gridData;
      }
    },
    cellEditEndHandler() {
      this.facilityInspectionSchedule.innerTeamData =
        this.YAuiGrid.getGridData();
    },
    cellEditEndHandler2() {
      this.facilityInspectionSchedule.outerTeamData =
        this.YAuiGrid2.getGridData();
    },
  },
};
</script>
