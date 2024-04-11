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
        <!-- <b-row>
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                 추가 
                <y-btn
                  v-if="!disabled && editable"
                  title="L0000002892"
                  color="blue"
                  @btnClicked="btnInAdd"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                 삭제 
                <y-btn
                  v-if="!disabled && editable"
                  title="L0000001495"
                  color="red"
                  @btnClicked="btnInDelete"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
              </div>
               점검팀원 목록 
              <y-data-table
                ref="dataTableIn"
                :height="gridInspectorInOptions.height"
                :headers="gridInspectorInOptions.header"
                :items="gridInspectorInOptions.data"
                :editable="!disabled && editable"
                v-model="selectedInValue"
                label="L0000002582"
                :popMode="true"
              >
                <el-table-column
                  v-if="!disabled && editable"
                  :selectable="selectedCheck"
                  type="selection"
                  slot="selection"
                  align="center"
                  width="55"
                ></el-table-column>
              </y-data-table>
            </b-col>
          </b-col>
        </b-row> -->
        <b-row>
          <b-col sm="12">
            <y-auigrid
              ref="yAuiGrid"
              :editable="editable"
              :name="gridInspectorInOptions.name"
              :headers="gridInspectorInOptions.header"
              :btns="gridInspectorInOptions.btns"
              :height="gridInspectorInOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000002582')"
              :useExcelExport="false"
              :enableSorting="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"
              :showRowCheckColumn="true"
              :softRemoveRowMode="false"
              @btnInAddRow="btnInAddRow"
              @btnInDelRow="btnInDelRow"
              @cellEditEnd="cellEditEndHandler"
            />
          </b-col>
        </b-row>
        <!-- 점검팀(외부) 테이블 -->
        <!-- <b-row class="mt-3">
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                 추가 
                <y-btn
                  v-if="!disabled && editable"
                  title="L0000002892"
                  color="blue"
                  @btnClicked="btnOutAdd"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                 삭제 
                <y-btn
                  v-if="!disabled && editable"
                  title="L0000001495"
                  color="red"
                  @btnClicked="btnOutDelete"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
              </div>
              점검팀원(외부)목록 
              <y-data-table
                ref="dataTableOut"
                :height="gridInspectorOutOptions.height"
                :headers="gridInspectorOutOptions.header"
                :items="gridInspectorOutOptions.data"
                :editable="!disabled && editable"
                v-model="selectedOutValue"
                label="L0000002581"
                :popMode="true"
              >
                <el-table-column
                  v-if="!disabled && editable"
                  :selectable="selectedCheck"
                  type="selection"
                  slot="selection"
                  align="center"
                  width="55"
                ></el-table-column>
              </y-data-table>
            </b-col>
          </b-col>
        </b-row> -->
        <b-row>
          <b-col sm="12">
            <y-auigrid
              ref="auiGrid"
              :editable="editable"
              :name="gridInspectorOutOptions.name"
              :headers="gridInspectorOutOptions.header"
              :btns="gridInspectorOutOptions.btns"
              :height="gridInspectorOutOptions.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000002581')"
              :useExcelExport="false"
              :enableSorting="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"
              :showRowCheckColumn="true"
              :softRemoveRowMode="false"
              @btnOutAddRow="btnOutAddRow"
              @btnOutDelRow="btnOutDelRow"
              @cellEditEnd="cellEditEndHandlerOut"
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
  name: 'y-facility-inspection-inspector',
  props: {
    popupMode: false,
    inspBefChkPlan: {
      type: Object,
      default: function () {
        return {
          safFacilChkNo: 0,
          plantCd: '',
          chkUserNm: '',
          chkSchYmd: '',
          safCheckTypeCd: '',
          safFacilityCd: '',
          typeInfoList: [],
        };
      },
    },
    disabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  data: () => ({
    gridInspectorInOptions: {
      name: 'inspBefOperInspectorIn',
      btns: [],
      // 점검팀원
      header: [],
      data: [],
      height: '250',
    },
    gridInspectorOutOptions: {
      name: 'inspBefOperInspectorOut',
      btns: [],
      // 점검팀(외부)
      header: [],
      data: [],
      height: '250',
    },
    YAuiGrid: null,
    AuiGrid: null,
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
  }),
  watch: {
    'inspBefChkPlan.safFacilChkNo': function (newValue, oldValue) {
      this.gridInspectorInOptions.data = [];
      this.gridInspectorOutOptions.data = [];
      if (this.inspBefChkPlan.safFacilChkNo > 0) {
        this.searchUrl = selectConfig.saf.befInspPlan.inspector.url;
        this.getList('CLS01'); // 점검팀원 리스트 조회
        this.getList('CLS02'); // 점검팀(외부) 리스트 조회
      }
    },
    'gridInspectorInOptions.data': {
      handler: function (val, oldVal) {
        this.setPreOperChkPsn();
      },
      deep: true,
    },
    'gridInspectorOutOptions.data': {
      handler: function (val, oldVal) {
        this.setPreOperChkPsn();
      },
      deep: true,
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.AuiGrid = this.$refs.auiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // this.gridInspectorInOptions.data = [];
      // this.gridInspectorOutOptions.data = [];
      // Url Setting
      this.searchUrl = selectConfig.saf.befInspPlan.inspector.url;

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
      // 점검팀원 그리드 헤더  점검팀(외부) 그리드 헤더 설정
      this.gridInspectorInOptions.header = [
        {
          headerText: '성명',
          dataField: 'userNm',
          width: '10%',
          editable: false,
        },
        {
          headerText: '소속',
          dataField: 'deptNm',
          width: '10%',
          editable: false,
        },
        {
          headerText: '점검예정시',
          dataField: 'checkSchHour',
          width: '15%',
          editable: false,
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
        },
        {
          headerText: '점검예정분',
          dataField: 'checkSchMinute',
          width: '15%',
          editable: false,
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
        },
        {
          headerText: '점검예정종료시',
          dataField: 'checkSchEhour',
          width: '15%',
          editable: false,
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
        },
        {
          headerText: '점검예정종료분',
          dataField: 'checkSchEminute',
          width: '15%',
          editable: false,
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
        },
        {
          headerText: '비고',
          dataField: 'remark',
          width: '20%',
        },
      ];
      this.gridInspectorInOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnInAddRow',
          visible: !this.disabled && this.editable && !this.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnInDelRow',
          visible: !this.disabled && this.editable && !this.popupMode,
        },
      ];
      this.gridInspectorOutOptions.header = [
        {
          headerText: '성명',
          dataField: 'userNm',
          width: '10%',
        },
        {
          headerText: '소속',
          dataField: 'deptNm',
          width: '10%',
        },
        {
          headerText: '점검예정시',
          dataField: 'checkSchHour',
          width: '15%',
          editable: false,
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
        },
        {
          headerText: '점검예정분',
          dataField: 'checkSchMinute',
          width: '15%',
          editable: false,
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
        },
        {
          headerText: '점검예정종료시',
          dataField: 'checkSchEhour',
          width: '15%',
          editable: false,
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
        },
        {
          headerText: '점검예정종료분',
          dataField: 'checkSchEminute',
          width: '15%',
          editable: false,
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
        },
        {
          headerText: '비고',
          dataField: 'remark',
          width: '20%',
        },
      ];
      this.gridInspectorOutOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnOutAddRow',
          visible: !this.disabled && this.editable && !this.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnOutDelRow',
          visible: !this.disabled && this.editable && !this.popupMode,
        },
      ];
      if (this.inspBefChkPlan.safFacilChkNo > 0) {
        this.getList('CLS01'); // 점검팀원 리스트 조회
        this.getList('CLS02'); // 점검팀(외부) 리스트 조회
      }
    },
    cellEditEndHandler() {
      this.setPreOperChkPsn();
    },
    cellEditEndHandlerOut() {
      this.setPreOperChkPsn();
    },
    /** 점검팀원 목록, 점검팀(외부) 목록 조회 **/
    getList(classCd) {
      if (
        !this.inspBefChkPlan.safFacilChkNo ||
        this.inspBefChkPlan.safFacilChkNo === 0
      ) {
        return;
      }
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        safFacilChkNo: this.inspBefChkPlan.safFacilChkNo,
        inspectorClassCd: classCd,
      };
      this.$http.request(
        (_result) => {
          if (classCd === 'CLS01') {
            this.gridInspectorInOptions.data = this.$_.clone(_result.data);
            this.YAuiGrid.setGridData(this.$_.clone(_result.data));
            this.resizeGrid();
          } else if (classCd === 'CLS02') {
            this.gridInspectorOutOptions.data = this.$_.clone(_result.data);
            this.AuiGrid.setGridData(this.$_.clone(_result.data));
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
        plantCd: this.inspBefChkPlan.plantCd,
        deptCd: this.inspBefChkPlan.deptCd,
      };
      this.popupOptions.title = '사용자검색';
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    btnInAddRow() {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.inspBefChkPlan.plantCd,
        deptCd: this.inspBefChkPlan.deptCd,
      };
      this.popupOptions.title = '사용자검색';
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.users) {
        if (!this.YAuiGrid.getGridData()) {
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
            dutyNm: user.dutyNm,
            checkSchHour: '00',
            checkSchMinute: '00',
            checkSchEhour: '00',
            checkSchEminute: '00',
            inspectorClassCd: 'CLS01',
          };
          this.YAuiGrid.addRow(row, 'first');
          this.setPreOperChkPsn();
        });
      }
    },
    resizeGrid() {
      let _height = 150;
      this.YAuiGrid.resize(window.innerWidth - 300, _height);
      this.AuiGrid.resize(window.innerWidth - 300, _height);
    },
    /**
     * 점검팀원 행 삭제
     */

    btnInDelRow() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        // 체크 항목 미존재 시
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      }
      for (let i = 0; i < removeData.length; i++) {
        this.YAuiGrid.removeRow(removeData[i].rowIndex);
      }
      this.setPreOperChkPsn();
    },
    btnInDelete() {
      this.$_.forEach(this.selectedInValue, (item) => {
        this.gridInspectorInOptions.data.splice(
          this.$_.indexOf(
            this.$_.map(this.gridInspectorInOptions.data, 'userId'),
            item.userId
          ),
          1
        );
      });
    },
    /**
     * 점검팀(외부) 행 추가
     */
    btnOutAddRow() {
      let row = {
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
      this.AuiGrid.addRow(row, 'first');
      this.setPreOperChkPsn();
    },
    btnOutAdd() {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`); // 이유는 모르겠으나 이거를 하지 않으면 추가가 이루어지지않음..
      if (this.gridInspectorOutOptions.data.length === 0) {
        this.gridInspectorOutOptions.data = [];
      }
      this.gridInspectorOutOptions.data.splice(0, 0, {
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
      });
    },
    /**
     * 점검팀(외부) 행 삭제
     */
    btnOutDelRow() {
      let removeData = this.AuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        // 체크 항목 미존재 시
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      }
      for (let i = 0; i < removeData.length; i++) {
        this.AuiGrid.removeRow(removeData[i].rowIndex);
      }
      this.setPreOperChkPsn();
    },
    btnOutDelete() {
      this.$_.forEach(this.selectedOutValue, (item) => {
        this.gridInspectorOutOptions.data.splice(
          this.$_.indexOf(this.gridInspectorOutOptions.data, item),
          1
        );
      });
    },
    /**
     * 점검팀(내,외부)DATA -> 시설점검자[] push
     */
    setPreOperChkPsn() {
      this.inspBefChkPlan.preOperChkPsns = [];
      this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
        this.inspBefChkPlan.preOperChkPsns.push(item);
      });
      this.$_.forEach(this.AuiGrid.getGridData(), (item) => {
        this.inspBefChkPlan.preOperChkPsns.push(item);
      });
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
