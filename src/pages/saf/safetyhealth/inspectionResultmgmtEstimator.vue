<!--
  목적 : 평가결과 관리
  작성자 : pkj
  Detail : 평가결과 관리 평가자
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
            <!-- 점검리더 -->
            <y-tree-dept
              :editable="false"
              :required="true"
              label="L0000004219"
              :plantCd="inspectionResult.plantCd"
              v-model="inspectionResult.readerDeptCd"
            />
          </b-col>
          <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
            <!-- 담당자 -->
            <y-text
              :width="5"
              ui="bootstrap"
              :editable="apprMode"
              :disabled="apprMode"
              name="deptReaderNm"
              v-model="inspectionResult.deptReaderNm"
              :appendIcon="[
                { icon: 'times', callbackName: 'clear' },
                { icon: 'search', callbackName: 'searchUser' },
              ]"
              @searchUser="btnDeptSearchUserClicked"
              @clear="clear"
            ></y-text>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3"></b-col>
        </b-row>
        <!-- <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             내부점검자 추가 
            <y-btn
              v-if="apprMode"
              title="L0000005376"
              color="blue"
              @btnClicked="btnAddRow"
            />
             행삭제 
            <y-btn
              v-if="apprMode"
              title="L0000003225"
              color="red"
              @btnClicked="btnRemoveRow"
            />
          </div>
           내부점검자 목록 
          <y-data-table
            label="L0000005282"
            ref="dataTable"
            :editable="apprMode"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :popMode="true"
            v-model="selectedValues"
          >
            <el-table-column
              v-if="apprMode"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>-->
      </b-col> 
      <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="true"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005282')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :showRowCheckColumn="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"       
          :softRemoveRowMode="false"
          @btnAddRowInUser="btnAddRowInUser"
          @btnDelRowInUser="btnDelRowInUser"
        />
      </b-col>
    </b-row>
      <!-- <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             평가자(외부)추가 
            <y-btn
              v-if="apprMode"
              title="L0000005140"
              color="blue"
              @btnClicked="btnAddOutRow"
            />
             행삭제 
            <y-btn
              v-if="apprMode"
              title="L0000003225"
              color="red"
              @btnClicked="btnRemoveOutRow"
            />
          </div>
           평가자(외부) 목록 
          <y-data-table
            label="L0000004989"
            ref="dataTable2"
            :editable="apprMode"
            :height="gridOutOptions.height"
            :headers="gridOutOptions.header"
            :items="gridOutOptions.data"
            :popMode="true"
            v-model="selectedOutValues"
          >
            <el-table-column
              v-if="apprMode"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col> -->
      <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="auiGrid"
          :editable="true"
          :name="gridOutOptions.name"
          :headers="gridOutOptions.header"
          :btns="gridOutOptions.btns"
          :height="gridOutOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004989')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :showRowCheckColumn="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"       
          :softRemoveRowMode="false"
          @btnAddRowOutUser="btnAddRowOutUser"
          @btnDelRowOutUser="btnDelRowOutUser"
        />
      </b-col>
    </b-row>
     </b-row> 
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'rsa-result-detail-estimator',
  props: {
    inspectionResult: {
      type: Object,
      default: () => ({
        implChkPlanNo: 0,
        implChkDeptNo: 0,
        plantCd: '', // 사업장 코드
        deptCd: '',
        mainDeptCd: '',
        year: '',
        regRegdemCd: '',
        chkNm: '',
        assessDt: null,
        deptReaderId: '',
        deptReaderNm: '',
        deptReaderCd: '',
        chkStartDt: '',
        chkEndDt: '',
        chkDesc: '',
        rapprRqstNo: 0,
        rapprRqstNm: '',
        implChkRsltNo: 0,
        imprCaseCnt: 0,
        rsltDesc: '',
        estimatorInList: [],
        estimatorOutList: [],
      }),
    },
    editable: false,
    apprMode: false,
    EstimatorLoad: false,
  },
  data() {
    return {
      gridOptions: {
        name: 'inspectionREsultmgmtEstimatorIn',
        btns: [],
        header: [],
        data: [],
        height: 300,
      },
      selectedValues: [], // 평가자 선택항목
      gridOutOptions: {
        name: 'inspectionREsultmgmtEstimatorOut',
        btns: [],
        header: [],
        data: [],
        height: 300,
      },
      YAuiGrid: null,
      AuiGrid: null,
      selectedOutValues: [], // 평가자(외부) 선택항목
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchUrl: '',
    };
  },
  computed: {},
  watch: {
    'inspectionResult.implChkPlanNo': {
      handler: function(oldV, newV) {
        this.gridOptions.data = this.inspectionResult.estimatorInList;
        this.gridOutOptions.data = this.inspectionResult.estimatorOutList;
      },
    },
    EstimatorLoad() {
      this.inspectionResult.estimatorInList = this.YAuiGrid.getGridData();
      this.inspectionResult.estimatorOutList = this.AuiGrid.getGridData();
    },
  },
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
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // this.searchUrl = selectConfig.rsa.rsaResult.estList.url;
      this.setGridHeader()
      setTimeout(() => {
        this.btnVisible();
        this.YAuiGrid.setGridData(this.inspectionResult.estimatorInList)
        this.AuiGrid.setGridData(this.inspectionResult.estimatorOutList)
      }, 500);

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005376'),
          color: 'blue',
          btnClicked: 'btnAddRowInUser',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelRowInUser',
          visible: true,
        },
      ]
      this.gridOutOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005140'),
          color: 'blue',
          btnClicked: 'btnAddRowOutUser',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelRowOutUser',
          visible: true,
        },
      ]
    },
    setGridHeader() {
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'), 
          dataField: 'userNm', 
          width: '20%', 
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001662'), 
          dataField: 'deptNm', 
          width: '20%', 
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002772'), 
          dataField: 'positionNm', 
          width: '20%', 
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
          dataField: 'raterDesc', 
          width: '40%', 
          style: 'left-align',
        },
      ]; 
      this.gridOutOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'), 
          dataField: 'userNm', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001662'), 
          dataField: 'companyNm', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002772'), 
          dataField: 'positionNm', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
          dataField: 'raterDesc', 
          width: '40%', 
        },
      ];
    },
    btnVisible() {
      if (this.apprMode) {
        this.gridOptions.btns[0].visible = true
        this.gridOptions.btns[1].visible = true
        this.gridOutOptions.btns[0].visible = true
        this.gridOutOptions.btns[1].visible = true
      } else {
        this.gridOptions.btns[0].visible = false
        this.gridOptions.btns[1].visible = false
        this.gridOutOptions.btns[0].visible = false
        this.gridOutOptions.btns[1].visible = false
      }
      
    },
    btnDelRowInUser() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      for (let i = 0; i < removeData.length; i++) {
        this.YAuiGrid.removeRow(removeData[i].rowIndex);
      }
    },
    // 평가자 추가
    btnAddRow() {
      // 사용자 검색 팝업
      this.btnSearchUserClicked();
    },
    // 평가자 삭제
    btnRemoveRow() {
      this.$_.forEach(this.selectedValues, item => {
        // 저장된 항목이면 삭제목록에 추가
        if (item.raEmpNo) {
          // 중복방지
          let delUser = this.$_.filter(
            this.smtRaRev.deleteRsaResultEsimators,
            u => u.raEmpNo === item.raEmpNo
          );
          if (!delUser.length) {
            this.smtRaRev.deleteRsaResultEsimators.push(item);
          }
        }
        this.gridOptions.data = this.$_.reject(this.gridOptions.data, item);
      });
    },
    btnAddRowInUser() {
      this.btnSearchUserClicked();
    },
    // 사용자 검색 팝업
    btnSearchUserClicked() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.inspectionResult.plantCd,
        deptCd: this.inspectionResult.mainDeptCd,
        multiple: true,
      };
      this.popupOptions.title = '사용자검색';
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    // 사용자 검색 팝업 callback
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.users && data.users.length) {
        this.$_.forEach(data.users, user => {
          // 중복방지
          let existUser = this.$_.filter(
            this.YAuiGrid.getGridData(),
            u => u.userId === user.userId
          );
          if (!existUser.length) {
            let row = {
              mplChkDeptNo:
                this.inspectionResult.implChkDeptNo === 0
                  ? 0
                  : this.inspectionResult.implChkDeptNo, //
              userId: user.userId, // 사용자 ID
              userNm: user.userNm, // 성명
              deptCd: user.deptCd, // 부서코드
              deptNm: user.deptNm, // 부서명
              positionNm: user.positionNm, // 직위명
              raterDesc: '', // 비고
            };
            this.YAuiGrid.addRow(row, 'first');
          }
        });
      }
    },
    btnAddRowOutUser() {
      let row = {
        implChkDeptNo:
          this.inspectionResult.implChkDeptNo === 0
            ? 0
            : this.inspectionResult.implChkDeptNo, //
        userNm: '', // 성명
        companyNm: '', // 직위명
        positionNm: '', // 직책
        raterDesc: '', // 비고
      };
      this.AuiGrid.addRow(row, 'first');
    },
    btnDelRowOutUser() {
      let removeData = this.AuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      for (let i = 0; i < removeData.length; i++) {
        this.AuiGrid.removeRow(removeData[i].rowIndex);
      }
    },
    // 평가자(외부) 추가
    btnAddOutRow() {
      this.gridOutOptions.data.push({
        implChkDeptNo:
          this.inspectionResult.implChkDeptNo === 0
            ? 0
            : this.inspectionResult.implChkDeptNo, //
        userNm: '', // 성명
        companyNm: '', // 직위명
        positionNm: '', // 직책
        raterDesc: '', // 비고
      });
    },
    // 평가자(외부) 삭제
    btnRemoveOutRow() {
      this.$_.forEach(this.selectedOutValues, item => {
        // 저장된 항목이면 삭제목록에 추가
        if (item.raEmpNo) {
          // 중복방지
          let delUser = this.$_.filter(
            this.smtRaRev.deleteRsaResultEsimators,
            u => u.raEmpNo === item.raEmpNo
          );
          if (!delUser.length) {
            this.smtRaRev.deleteRsaResultEsimators.push(item);
          }
        }
        this.gridOutOptions.data = this.$_.reject(
          this.gridOutOptions.data,
          item
        );
      });
    },
    btnDeptSearchUserClicked() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.inspectionResult.plantCd,
        deptCd: this.inspectionResult.mainDeptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupUser;
    },
    closePopupUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.inspectionResult.deptReaderId = data.user.userId;
        this.inspectionResult.deptReaderNm = data.user.userNm;
        this.inspectionResult.readerDeptCd = data.user.deptCd;
      }
    },
    clear() {
      this.inspectionResult.deptReaderId = null;
      this.inspectionResult.deptReaderNm = null;
    },
    resizeGrid() {
      let _height = window.innerHeight - 770;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(window.innerWidth - 300, _height);
      this.AuiGrid.resize(window.innerWidth - 300, _height);
    },
  },
};
</script>
