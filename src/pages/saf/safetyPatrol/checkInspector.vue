<!--
  목적 : 순회점검 관리 - 순회점검 - 점검자
  Detail : 순회점검 점검자
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
              <b-col sm="12" class="px-0">
                <!-- 점검수행팀원 목록 -->
                <y-auigrid
                  ref="yAuiGrid2"
                  :editable="editable && !disabled"
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
          </b-col>
        </b-row>
        <b-row class="mt-1">
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <!-- 점검팀원(외부) -->
              <y-auigrid
                ref="yAuiGrid3"
                :editable="!disabled && editable"
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
export default {
  /* attributes: name, components, props, data */
  name: 'y-check-inspector',
  props: {
    checkPlanDetail: {
      type: Object,
      default: {
        safCheckRsltNo: 0,
        plantCd: '',
        deptCd: '',
        pgpDeptCd: '',
        innerTeamData: [],
        outerTeamData: [],
      },
    },
    disabled: false,
  },
  data: () => ({
    gridInspectorInOptions: {
      // 점검팀원
      header: [],
      data: [],
      btns: [],
      height: '250',
    },
    gridInspectorOutOptions: {
      // 점검팀(외부)
      header: [],
      data: [],
      btns: [],
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

    YAuiGrid2: null,
    YAuiGrid3: null,
    tmpIdx: 0,
  }),
  watch: {
    'checkPlanDetail.safCheckRsltNo': function (newValue, oldValue) {
      // this.gridInspectorInOptions.data = [];
      // this.gridInspectorOutOptions.data = [];
      if (this.checkPlanDetail.safCheckRsltNo > 0) {
        this.searchUrl = selectConfig.saf.patrol.inspector.url;
        this.getList('CLS01'); // 점검팀원 리스트 조회
        this.getList('CLS02'); // 점검팀(외부) 리스트 조회
      }
    },
    'gridInspectorInOptions.data': {
      handler: function (val, oldVal) {
        this.checkPlanDetail.innerTeamData = this.$_.clone(
          this.gridInspectorInOptions.data
        );
      },
      deep: true,
    },
    'gridInspectorOutOptions.data': {
      handler: function (val, oldVal) {
        this.checkPlanDetail.outerTeamData = this.$_.clone(
          this.gridInspectorOutOptions.data
        );
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
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
    this.YAuiGrid3 = this.$refs.yAuiGrid3;
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.gridInspectorInOptions.data = [];
      this.gridInspectorOutOptions.data = [];

      this.searchUrl = selectConfig.saf.patrol.inspector.url;
      if (this.checkPlanDetail.safCheckRsltNo > 0) {
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
          width: '25%',
        }, // 성명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001662'),
          dataField: 'deptNm',
          width: '25%',
        }, // 소속
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
          dataField: 'dutyNm',
          width: '25%',
        }, // 직책
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '25%',
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
          width: '25%',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 15,
          },
        }, // 성명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001662'),
          dataField: 'deptNm',
          width: '25%',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 30,
          },
        }, // 소속
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
          dataField: 'dutyNm',
          width: '25%',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 30,
          },
        }, // 직책
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '25%',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 600,
          },
        }, // 비고
      ];
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
          btnClickedError: 'btnClickedErrorCallback',
          visible: !this.disabled && this.editable,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnInDelete',
          btnClickedError: 'btnClickedErrorCallback',
          visible: !this.disabled && this.editable,
        }, // 삭제
      ];

      this.gridInspectorOutOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnOutAdd',
          btnClickedError: 'btnClickedErrorCallback',
          visible: !this.disabled && this.editable,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnOutDelete',
          btnClickedError: 'btnClickedErrorCallback',
          visible: !this.disabled && this.editable,
        }, // 삭제
      ];
      this.YAuiGrid2.setBtnArr(this.gridInspectorInOptions.btns);
      this.YAuiGrid3.setBtnArr(this.gridInspectorOutOptions.btns);
    },
    /** button 관련 이벤트 **/
    getList(classCd) {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        safCheckRsltNo: this.checkPlanDetail.safCheckRsltNo,
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
    /**
     * 점검팀원 행 추가
     */
    btnInAdd() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
      this.popupOptions.param = {
        plantCd: this.checkPlanDetail.plantCd,
        deptCd: this.checkPlanDetail.pgpDeptCd,
        multiple: true,
      };
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.users) {
        // if (!this.checkPlanDetail.innerTeamData) {
        //   this.checkPlanDetail.innerTeamData = [];
        // }

        // if (this.gridInspectorInOptions.data.length === 0) {
        //   this.gridInspectorInOptions.data = [];
        // }
        // if (data.users && data.users.length > 0) {
        this.$_.forEach(data.users, (user) => {
          if (
            this.$_.indexOf(
              this.$_.map(this.YAuiGrid2.getGridData(), 'userId'),
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
            remark: '',
            safCheckRsltNo: this.checkPlanDetail.safCheckRsltNo,
            safCheckInspectPsnNo: 0,
            inspectorClassCd: 'CLS01',
          };
          this.YAuiGrid2.addRow(row, 'first');
        });
        this.gridInspectorInOptions.data = this.YAuiGrid2.getGridData();
        // }
      }
    },
    /**
     * 점검팀원 행 삭제
     */
    btnInDelete() {
      let gridData = this.YAuiGrid2.getGridData();
      const selectedRowItems = this.YAuiGrid2.getCheckedRowItemsAll();
      if (gridData.length > 0 && selectedRowItems.length > 0) {
        this.$_.forEach(selectedRowItems, (item) => {
          gridData = this.$_.reject(gridData, item);
        });
        this.YAuiGrid2.setGridData(gridData);
        this.checkPlanDetail.innerTeamData = gridData;
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
        remark: '',
        safCheckRsltNo: this.checkPlanDetail.safCheckRsltNo,
        safCheckInspectPsnNo: 0,
        inspectorClassCd: 'CLS02',
      };

      this.YAuiGrid3.addRow(addData);
      this.checkPlanDetail.outerTeamData.push(addData);
    },
    /**
     * 점검팀(외부) 행 삭제
     */
    btnOutDelete() {
      let gridData = this.YAuiGrid3.getGridData();
      const selectedRowItems = this.YAuiGrid3.getCheckedRowItemsAll();
      if (gridData.length > 0 && selectedRowItems.length > 0) {
        this.$_.forEach(selectedRowItems, (item) => {
          gridData = this.$_.reject(gridData, item);
        });
        this.YAuiGrid3.setGridData(gridData);
        this.checkPlanDetail.outerTeamData = gridData;
      }
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** end button 관련 이벤트 **/
    cellEditEndHandler() {
      this.checkPlanDetail.innerTeamData = this.YAuiGrid2.getGridData();
    },
    cellEditEndHandler2() {
      this.checkPlanDetail.outerTeamData = this.YAuiGrid3.getGridData();
    },
  },
};
</script>
