<!--
  목적 : 작업환경측정 - 물리적인자
  Detail : 
  examples:
  -->
<template>
  <b-container fluid>
    <!-- <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0" id="workMeasureResultPhys">
          <div slot="buttonGroup" class="float-right mb-1">
             행추가 
            <y-btn
              v-if="editable && !disabled"
              title="L0000003226"
              color="orange"
              @btnClicked="addRow"
            />
             행삭제 
            <y-btn
              v-if="editable && !disabled"
              :action-url="deleteUrl"
              :param="deleteValue"
              :is-submit="isDelete"
              title="L0000003225"
              color="red"
              action-type="DELETE"
              beforeSubmit="beforeDelete"
              @beforeDelete="beforeDelete"
              @btnClicked="btnDeleteClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           작업환경측정결과 물리적인자 목록
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="editable && !disabled"
            :useRownum="false"
            @change="change"
            v-model="selectedValue"
            label="작업환경측정결과 물리적인자 목록"
          >
            <el-table-column
              type="selection"
              slot="selection"
              align="center"
              width="55"
              :selectable="selectable"
            ></el-table-column>
            <부서 
            <el-table-column
              slot="expand"
              prop="deptCd"
              :label="$comm.getLangSpecInfoLabel('L0000001287')"
              align="center"
              width="180px"
            >
              <template slot-scope="scope">
                <y-tree-dept
                  :width="12"
                  type="edit"
                  label=""
                  name="deptCd"
                  rowClass
                  :editable="editable && !disabled"
                  v-model="scope.row.deptCd"
                  :plantCd="workMeasurePlan.plantCd"
                />
              </template>
            </el-table-column>
             공정 
            <el-table-column
              slot="expand"
              prop="processCd"
              :label="$comm.getLangSpecInfoLabel('L0000000515')"
              align="center"
              width="180px"
            >
              <template slot-scope="scope">
                <y-tree-process
                  :width="12"
                  type="edit"
                  label=""
                  name="processCd"
                  rowClass
                  :showDataMapping="true"
                  :editable="editable && !disabled"
                  v-model="scope.row.processCd"
                  :plantCd="workMeasurePlan.plantCd"
                  :deptCd="scope.row.deptCd"
                />
              </template>
            </el-table-column>
            <단위작업장소 
            <el-table-column
              slot="expand"
              prop="workPlace"
              :label="$comm.getLangSpecInfoLabel('L0000000878')"
              align="center"
              width="180px"
            >
              <template slot-scope="scope">
                <y-text
                  :width="12"
                  :maxlength="50"
                  :editable="editable && !disabled"
                  :showMaxLength="false"
                  rowClass
                  ui="bootstrap"
                  label=""
                  name="workPlace"
                  v-model="scope.row.workPlace"
                ></y-text>
              </template>
            </el-table-column>
            유해인자 
            <el-table-column
              slot="expand"
              prop="hazardNm"
              :label="$comm.getLangSpecInfoLabel('L0000002188')"
              align="center"
              width="180px"
            >
              <template slot-scope="scope">
                <y-text
                  :width="12"
                  :editable="editable && !disabled"
                  :disabled="true"
                  ui="bootstrap"
                  label=""
                  name="hazardNm"
                  rowClass
                  v-model="scope.row.hazardNm"
                  :appendIcon="[
                    { icon: 'search', callbackName: 'searchHazard' },
                  ]"
                  @searchHazard="
                    btnSearchHazardClicked(scope.row, scope.$index)
                  "
                ></y-text>
              </template>
            </el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="true"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="'작업환경측정결과 물리적인자 목록'"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="true"
          @cellEditEnd="cellEditEndHandler"
          @btnAddRowClicked="btnAddRowClicked"
          @btnDelRowClicked="btnDelRowClicked"
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
  name: 'work-mesaure-result-Phys',
  props: {
    disabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    research: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    workMeasurePlan: {
      type: Object,
      default: function () {
        return {
          workMeasPlanNo: 0,
          plantCd: '',
          workMeasureResults: [], // 결과
        };
      },
    },
  },
  data() {
    return {
      gridOptions: {
        name: 'workMeasureResultPhys',
        btns: [],
        header: [],
        data: [],
        height: 500,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: null,
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      selectedValue: [],
      editable: false,
      searchUrl: '',
      deleteUrl: '',
      isDelete: false,
      deleteValue: null,
      searchIndexForDept: 0,
      searchIndexForProcess: 0,
      searchIndexForHazard: 0,
      checkData: [],
    };
  },
  watch: {
    'workMeasurePlan.workMeasPlanNo'() {
      this.getList();
    },
    research() {
      this.getList();
    },
    'gridOptions.data': {
      handler: function () {
        this.$emit('getWorkMeasurePhysResults', this.gridOptions.data);
      },
    },
  },
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
      this.searchUrl = selectConfig.hea.workMeasureResult.list.url;
      this.deleteUrl = transactionConfig.hea.workMeasureResult.delete.url;
      // 그리드 헤더 설정
      setTimeout(() => {
        console.log(this.disabled, '1122');
        this.setGridHeader().then(() => {
          this.getList();
        });
      }, 500);

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003226'),
          color: 'orange',
          btnClicked: 'btnAddRowClicked',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003225'),
          color: 'red',
          btnClicked: 'btnDelRowClicked',
          visible: true,
        },
      ];
    },
    setGridHeader() {
      return new Promise((resolve) => {
        let myThis = this;
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
            dataField: 'deptNm',
            editable: false,
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001287') + '찾기',
            dataField: 'deptCd',
            width: !this.disabled ? '10%' : '0%',
            editable: false,
            renderer: {
              type: !this.disabled ? 'ButtonRenderer' : null,
              labelText: '찾기',
              onClick: function (rowIndex, columnIndex, value, item) {
                myThis.myDeptSearch(rowIndex.rowIndex);
              },
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000878'),
            dataField: 'workPlace',
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
            dataField: 'processNm',
            editable: false,
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000515') + '찾기',
            dataField: '',
            width: !this.disabled ? '10%' : '0%',
            editable: false,
            renderer: {
              type: !this.disabled ? 'ButtonRenderer' : null,
              labelText: '찾기',
              onClick: function (rowIndex, columnIndex, value, item) {
                myThis.myPorcessSearch(rowIndex);
              },
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002950'),
            dataField: 'hazardNm',
            editable: false,
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000515') + '찾기',
            dataField: '',
            width: !this.disabled ? '10%' : '0%',
            editable: false,
            renderer: {
              type: !this.disabled ? 'ButtonRenderer' : null,
              labelText: '찾기',
              onClick: function (rowIndex, columnIndex, value, item) {
                myThis.myhazardCdSearch(rowIndex);
              },
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000746'),
            dataField: 'workerCnt',
            width: '10%',
            editable: !this.disabled,
            dataType: 'numeric',
            style: 'right-align',
            editRenderer: {
              type: 'InputEditRenderer',
              onlyNumeric: true, // 0~9만 입력가능
              textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
              maxlength: 3,
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002374'),
            dataField: 'workContents',
            width: '10%',
            editable: !this.disabled,
            style: 'left-align',
            editRenderer: {
              type: 'InputEditRenderer',
              maxlength: 50,
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000747'),
            dataField: 'shiftType',
            width: '10%',
            style: 'left-align',
            editable: !this.disabled,
            editRenderer: {
              type: 'InputEditRenderer',
              textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
              maxlength: 50,
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001085'),
            dataField: 'occurType',
            width: '10%',
            style: 'right-align',
            editable: !this.disabled,
            editRenderer: {
              type: 'InputEditRenderer',
              textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
              maxlength: 50,
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002198'),
            dataField: 'occurTime',
            width: '10%',
            editable: !this.disabled,
            dataType: 'numeric',
            style: 'right-align',
            editRenderer: {
              type: 'InputEditRenderer',
              onlyNumeric: true, // 0~9만 입력가능
              maxlength: 5,
            },
          },
          {
            headerText: '측정위치(근로자명)',
            dataField: 'measPsnNm',
            width: '10%',
            editable: !this.disabled,
            style: 'left-align',
            editRenderer: {
              type: 'InputEditRenderer',
              maxlength: 50,
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002942'),
            dataField: 'measStartTime',
            width: '10%',
            editable: !this.disabled,
            editRenderer: {
              type: 'InputEditRenderer',
              onlyCalendar: true,
              defaultFormat: 'HH:MM',
              validator: function (
                oldValue,
                newValue,
                item,
                dataField,
                fromClipboard,
                which
              ) {
                var isValid = false;
                var timeFormat = /^([01][0-9]|2[0-3]):([0-5][0-9])$/; // 시간형식 체크 정규화 hh:mm
                if (timeFormat.test(newValue)) {
                  isValid = true;
                }
                return {
                  validate: isValid,
                  message: 'OO:OO 형식으로 입력해 주십시오.',
                };
              },
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002943'),
            dataField: 'measEndTime',
            width: '10%',
            editable: !this.disabled,
            editRenderer: {
              type: 'InputEditRenderer',
              onlyCalendar: true,
              defaultFormat: 'HH:MM',
              validator: function (
                oldValue,
                newValue,
                item,
                dataField,
                fromClipboard,
                which
              ) {
                var isValid = false;
                var timeFormat = /^([01][0-9]|2[0-3]):([0-5][0-9])$/; // 시간형식 체크 정규화 hh:mm
                if (timeFormat.test(newValue)) {
                  isValid = true;
                }
                return {
                  validate: isValid,
                  message: 'OO:OO 형식으로 입력해 주십시오.',
                };
              },
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002953'),
            dataField: 'measDt',
            width: '15%',
            editable: !this.disabled,
            editRenderer: {
              type: 'CalendarRenderer',
              onlyCalendar: true,
              defaultFormat: 'yyyy-mm-dd',
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002965'),
            dataField: 'measCnt',
            width: '10%',
            editable: !this.disabled,
            dataType: 'numeric',
            style: 'right-align',
            editRenderer: {
              type: 'InputEditRenderer',
              onlyNumeric: true, // 0~9만 입력가능
              maxlength: 5,
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002962'),
            dataField: 'measValue',
            width: '10%',
            editable: !this.disabled,
            dataType: 'numeric',
            style: 'right-align',
            editRenderer: {
              type: 'InputEditRenderer',
              onlyNumeric: true, // 0~9만 입력가능
              maxlength: 15,
            },
          },

          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001732'),
            children: [
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000002529'),
                dataField: 'twaPrev',
                width: '10%',
                editable: !this.disabled,
                dataType: 'numeric',
                style: 'right-align',
                editRenderer: {
                  type: 'InputEditRenderer',
                  onlyNumeric: true, // 0~9만 입력가능
                  maxlength: 15,
                },
              },
              {
                headerText: this.$comm.getLangSpecInfoLabel('L0000000766'),
                dataField: 'twaCurr',
                width: '10%',
                editable: !this.disabled,
                dataType: 'numeric',
                style: 'right-align',
                editRenderer: {
                  type: 'InputEditRenderer',
                  onlyNumeric: true, // 0~9만 입력가능
                  maxlength: 15,
                },
              },
            ],
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000845'),
            dataField: 'exposureStd',
            width: '10%',
            editable: !this.disabled,
            dataType: 'numeric',
            style: 'right-align',
            editRenderer: {
              type: 'InputEditRenderer',
              onlyNumeric: true, // 0~9만 입력가능
              maxlength: 25,
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000847'),
            dataField: 'exposureExcessFlag',
            editable: false,
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002933'),
            dataField: 'measMethod',
            width: '10%',
            editable: !this.disabled,
            editRenderer: {
              type: 'InputEditRenderer',
              maxlength: 25,
            },
          },
        ];
        resolve();
      });
    },

    myhazardCdSearch(item) {
      this.checkData = [];
      this.searchIndexForHazard = item.rowIndex;
      this.popupOptions.target = () => import(`${'../baseInfo/hazard.vue'}`);
      this.popupOptions.param = {
        popupMode: true,
        workAreaGradeCd: 'C',
      };
      this.popupOptions.title = 'L0000002188'; // 유해인자
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopupHazard;
    },
    closePopupHazard(data) {
      // this.hazardNmKoForGrid
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data && data !== 'CLOSE') {
        this.checkData = this.YAuiGrid.getGridData();
        this.checkData[this.searchIndexForHazard].hazardCd = data.item.hazardCd;
        this.checkData[this.searchIndexForHazard].hazardNm =
          data.item.hazardNmKo;
        this.YAuiGrid.setGridData(this.checkData);
        this.cellEditEndHandler();
      }
    },
    myPorcessSearch(item) {
      this.checkData = [];
      this.searchIndexForProcess = item.rowIndex;
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/process.vue'}`);
      this.popupOptions.title = 'L0000000529'; // 공정검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: this.workMeasurePlan.plantCd
          ? this.workMeasurePlan.plantCd
          : this.$store.getters.plantCd,
        deptCd: item.item.deptCd,
      };
      this.popupOptions.closeCallback = this.closeProcessPopup;
    },
    closeProcessPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.process) {
        this.checkData = this.YAuiGrid.getGridData();
        this.checkData[this.searchIndexForProcess].processCd =
          data.process.processCd;
        this.checkData[this.searchIndexForProcess].processNm =
          data.process.processNm;
        this.YAuiGrid.setGridData(this.checkData);
        this.cellEditEndHandler();
      }
    },
    myDeptSearch(item) {
      this.checkData = [];
      this.searchIndexForDept = item;
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.param = {
        plantCd: this.workMeasurePlan.plantCd
          ? this.workMeasurePlan.plantCd
          : this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000004627'; // 부서 검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '35%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchDept;
    },
    closePopupSearchDept(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.dept) {
        this.checkData = this.YAuiGrid.getGridData();
        this.checkData[this.searchIndexForDept].deptCd = data.dept.deptCd;
        this.checkData[this.searchIndexForDept].deptNm = data.dept.deptNm;
        this.YAuiGrid.setGridData(this.checkData);
        this.cellEditEndHandler();
      }
    },
    getList() {
      if (!this.workMeasurePlan.workMeasPlanNo) {
        return;
      }
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        workMeasPlanNo: this.workMeasurePlan.workMeasPlanNo,
        workMeasStateCd: this.workMeasurePlan.workMeasStateCd,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.filter(_result.data, {
            workAreaGradeCd: 'P',
          });
          if (!this.disabled) {
            this.gridOptions.btns[0].visible = true;
            this.gridOptions.btns[1].visible = true;
          } else {
            this.gridOptions.btns[0].visible = false;
            this.gridOptions.btns[1].visible = false;
          }
          this.YAuiGrid.setGridData(this.gridOptions.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellEditEndHandler(event) {
      this.checkData = [];
      this.checkData = this.YAuiGrid.getGridData();
      if (event !== undefined) {
        if (
          event.dataField === 'measValue' ||
          event.dataField === 'exposureStd'
        ) {
          if (
            event.item.measValue &&
            event.item.exposureStd &&
            !isNaN(event.item.exposureStd)
          ) {
            if (Number(event.item.measValue) > Number(event.item.exposureStd)) {
              this.checkData[event.rowIndex].exposureExcessFlag = 'O';
              this.YAuiGrid.setGridData(this.checkData);
            } else {
              this.checkData[event.rowIndex].exposureExcessFlag = 'X';
              this.YAuiGrid.setGridData(this.checkData);
            }
          }
        }
      }

      // this.checkData[event.rowIndex].exposureExcessFlag = 'O'
      this.$emit('getWorkMeasurePhysResults', this.YAuiGrid.getGridData());
    },
    /**
     * 행추가
     */
    btnAddRowClicked() {
      let rowData = {
        deptCd: this.$store.getters.deptCd, // 부서
        processCd: '', // 공정
        workPlace: '', // 단위작업장소
        hazardCd: '', // 유해인자
        hazardNm: '', // 유해인자명
        workerCnt: '', // 근로자수
        workContents: '', // 작업내용
        shiftType: '', // 근로형태 및 실근로시간
        occurType: '', // 발생형태 및 발생시간(주기)
        occurTime: '', // 유해인자발생시간
        measPsnNm: '', // 측정위치(근로자명)
        measStartTime: '', // 측정시간(시작)
        measEndTime: '', // 측정시간(종료)
        measDt: '', // 측정일자
        measCnt: '', // 측정횟수
        measValue: '', // 측정치
        twaPrev: '', // 시간가중 평균치 전회
        twaCurr: '', // 시간가중 평균치 금회
        exposureStd: '', // 노출기준
        exposureExcessFlag: '', // 노출기준초과여부
        measMethod: '', // 측정방법
        workMeasPlanNo: this.workMeasurePlan.workMeasPlanNo, // 작업환경측정계획 번호
        workAreaGradeCd: 'P', // 물리적인자
      };

      this.YAuiGrid.addRow(rowData, 'last');
    },
    addRow() {
      let rowData = {
        deptCd: this.$store.getters.deptCd, // 부서
        processCd: '', // 공정
        workPlace: '', // 단위작업장소
        hazardCd: '', // 유해인자
        hazardNm: '', // 유해인자명
        workerCnt: '', // 근로자수
        workContents: '', // 작업내용
        shiftType: '', // 근로형태 및 실근로시간
        occurType: '', // 발생형태 및 발생시간(주기)
        occurTime: '', // 유해인자발생시간
        measPsnNm: '', // 측정위치(근로자명)
        measStartTime: '', // 측정시간(시작)
        measEndTime: '', // 측정시간(종료)
        measDt: '', // 측정일자
        measCnt: '', // 측정횟수
        measValue: '', // 측정치
        twaPrev: '', // 시간가중 평균치 전회
        twaCurr: '', // 시간가중 평균치 금회
        exposureStd: '', // 노출기준
        exposureExcessFlag: '', // 노출기준초과여부
        measMethod: '', // 측정방법
        workMeasPlanNo: this.workMeasurePlan.workMeasPlanNo, // 작업환경측정계획 번호
        workAreaGradeCd: 'P', // 물리적인자
      };

      this.gridOptions.data.push(rowData);
    },
    btnDelRowClicked() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (!checkingData || checkingData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning',
        });
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.deleteUrl;
          this.$http.type = 'DELETE';
          this.$http.param = {
            data: Object.values(this.$_.clone(checkingData)),
          };
          this.$http.request(
            (_result) => {
              this.getList();
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success',
              });
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    beforeDelete() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning',
        });
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.deleteValue = {
            data: Object.values(this.$_.clone(this.selectedValue)),
          };
          this.isDelete = true;
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      this.getList();
      this.isDelete = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
    },
    setExposureExcessFlag(data) {
      // 노출기준초과 여부 설정
      if (data.name === 'exposureStd' && isNaN(data.row.exposureStd)) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 오류 */,
          message: `${this.$comm.getLangSpecInfoMessage(
            'M0000001572'
          )} (${this.$comm.getLangSpecInfoLabel('L0000000845')})`,
          type: 'warning',
        });
      }
      if (
        data.row.measValue &&
        data.row.exposureStd &&
        !isNaN(data.row.exposureStd)
      ) {
        if (Number(data.row.measValue) > Number(data.row.exposureStd)) {
          data.row.exposureExcessFlag = 'O';
        } else {
          data.row.exposureExcessFlag = 'X';
        }
      }
    },
    change(data) {
      // 입력값 변경
      if (data.name === 'measValue' || data.name === 'exposureStd') {
        this.setExposureExcessFlag(data);
      }
    },
    /**
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    selectable() {
      return this.editable && !this.disabled;
    },
    btnSearchHazardClicked(row, index) {
      if (this.disabled || !this.editable) {
        return;
      }

      this.rowIndex = index;
      this.popupOptions.target = () => import(`${'../baseInfo/hazard.vue'}`);
      this.popupOptions.param = {
        popupMode: true,
        workAreaGradeCd: 'P',
      };
      this.popupOptions.title = 'L0000002188'; // 유해인자
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopupSearchHazard;
    },
    closePopupSearchHazard(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data !== 'CLOSE') {
        this.gridOptions.data[this.rowIndex].hazardCd = data.hazardCd;
        this.gridOptions.data[this.rowIndex].hazardNm = data.hazardNmKo;

        this.$forceUpdate();
      }
    },
    /** end button 관련 이벤트 **/
  },
};
</script>

<style>
.shortened {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
