<!--
  목적 : 작업허가서 점검 확인사항
  Detail : 작업허가서 점검 확인사항 Tab
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="searchBox">
      <b-col sm="12">
      </b-col>
    </b-row>
    <b-row class="mt-1">
      <!-- <b-col sm="12">
        <b-col sm="12" class="px-0">
           평가대상 작업 목록 
          <y-data-table
            ref="jobDataTable"
            label="L0000003072"
            :height="jobGridOptions.height"
            :headers="jobGridOptions.header"
            :items="jobGridOptions.data"
            rowKey="jobId"
            @selectedRow="selectedJobRow"
            :popMode="true"
          ></y-data-table>
        </b-col>
      </b-col> -->
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="jobGridOptions.name"
          :headers="jobGridOptions.header"
          :btns="jobGridOptions.btns"
          :height="jobGridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003072')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @selectedRow="selectedJobRow"
        />
      </b-col>
      <!-- <b-col sm="12">
        <b-col sm="12" class="px-0 mt-3">
           평가대상 작업단계 목록 
          <y-data-table
            ref="jobStepDataTable"
            label="L0000003074"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            rowKey="jobStepId"
            @selectedRow="selectedRow"
            :popMode="true"
          ></y-data-table>
        </b-col>
      </b-col> -->
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="auiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003074')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @selectedRow="selectedRow"
        />
      </b-col>
      <!-- <b-col sm="12">
        <b-col sm="12" class="mt-3 px-0">
           유해위험요인 목록
          <y-data-table
            ref="dataTable"
            label="L0000002180"
            :height="JSAGridOptions.height"
            :headers="JSAGridOptions.header"
            :items="JSAGridOptions.data"
            :useRownum="false"
            rowKey="riskHazardNo"
            @selectedRow="selectedJSARow"
            :popMode="true"
          ></y-data-table>
        </b-col>
      </b-col> -->
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="finauiGrid"
          :name="JSAGridOptions.name"
          :headers="JSAGridOptions.header"
          :btns="JSAGridOptions.btns"
          :height="JSAGridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002180')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @selectedRow="selectedJSARow"
        />
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 위험성 평가 -->
            <y-label label="L0000002146" icon="user-edit" color-class="cutstom-title-color" />
            <div class="float-right mb-1">
            <y-btn
              v-if="updateMod&&editable"
              :action-url="insertUrl"
              :param="assessInfo"
              :is-submit="isInsert"
              title="L0000002474"
              color="orange"
              action-type="POST"
              beforeSubmit="beforeInsert"
              @beforeInsert="beforeInsert"
              @btnClicked="btnInsertClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 부서/공정 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000001302"
                name="deptAndPrecess"
                v-model="assessInfo.deptAndPrecess"
              ></y-text>
            </b-col>
            
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 작업코드/Rev No -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000002424"
                name="jobCdAndJobRevno"
                v-model="assessInfo.jobCdAndJobRevno"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 작업명 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000002389"
                name="jobNm"
                v-model="assessInfo.jobNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 작업순서/작업단계 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000002402"
                name="jobStepCdAndNm"
                v-model="assessInfo.jobStepCdAndNm"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 개선전 위험도 -->
              <b-row>
                <b-col sm="4">
                  <y-text
                    :width="6"
                    :disabled="true"
                    :required="true"
                    ui="bootstrap"
                    label="L0000000275"
                    name="currentRiskSize"
                    v-model="assessInfo.currentRiskSize"
                    v-validate="'required'"
                    :state="validateState('currentRiskSize')"
                  ></y-text>
                </b-col>
                <b-col sm="3">
                  <!-- 빈도 -->
                  <y-text
                    :width="8"
                    :disabled="true"
                    :required="true"
                    ui="bootstrap"
                    label="L0000001378"
                    name="currentFrequencySize"
                    v-model="assessInfo.currentFrequencySize"
                    v-validate="'required'"
                    :state="validateState('currentFrequencySize')"
                  ></y-text>
                </b-col>
                <b-col sm="3">
                  <!-- 강도 -->
                  <y-text
                    :width="8"
                    :disabled="true"
                    :required="true"
                    ui="bootstrap"
                    label="L0000000248"
                    name="currentStrongSize"
                    v-model="assessInfo.currentStrongSize"
                    v-validate="'required'"
                    :state="validateState('currentStrongSize')"
                  ></y-text>
                </b-col>
                <b-col sm="2">
                  <!-- 위험도등록 -->
                  <y-btn title="L0000004314" :disabled="!updateMod" color="orange" @btnClicked="openDialogPage('C')" />  
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 유해위험요인 -->
              <y-text
                :width="10"
                :disabled="true"
                ui="bootstrap"
                label="L0000002179"
                name="riskHazard"
                v-model="assessInfo.riskHazard"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 개선대책 -->
              <y-text
                :disabled="!updateMod"
                :editable="editable"
                :maxlength="80"
                :width="10"
                :required="true"
                ui="bootstrap"
                label="L0000000254"
                name="improve"
                v-model="assessInfo.improve"
                v-validate="'required'"
                :state="validateState('improve')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="4">
                  <!-- 개선후 위험도 -->
                  <y-text
                    :width="6"
                    :disabled="true"
                    :required="true"
                    ui="bootstrap"
                    label="L0000000286"
                    name="afterRiskSize"
                    v-model="assessInfo.afterRiskSize"
                    v-validate="'required'"
                    :state="validateState('afterRiskSize')"
                  ></y-text>
                </b-col>
                <b-col sm="3">
                  <!-- 빈도 -->
                  <y-text
                    :width="8"
                    :disabled="true"
                    :required="true"
                    ui="bootstrap"
                    label="L0000001378"
                    name="afterFrequencySize"
                    v-model="assessInfo.afterFrequencySize"
                    v-validate="'required'"
                    :state="validateState('afterFrequencySize')"
                  ></y-text>
                </b-col>
                <b-col sm="3">
                  <!-- 강도 -->
                  <y-text
                    :width="8"
                    :disabled="true"
                    :required="true"
                    ui="bootstrap"
                    label="L0000000248"
                    name="afterStrongSize"
                    v-model="assessInfo.afterStrongSize"
                    v-validate="'required'"
                    :state="validateState('afterStrongSize')"
                  ></y-text>
                </b-col>
                <b-col sm="2">
                  <!-- 위험도등록 -->
                  <y-btn title="L0000004314" :disabled="!updateMod" color="orange" @btnClicked="openDialogPage('A')" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 평가상세 -->
              <y-textarea
                :disabled="!updateMod"
                :editable="editable"
                :maxlength="300"
                :width="10"
                ui="bootstrap"
                label="L0000003083"
                name="evalDesc"
                v-model="assessInfo.evalDesc"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 평가자 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000003093"
                name="ADeptNmAndAUserNm"
                v-model="assessInfo.ADeptNmAndAUserNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 평가일자 -->
              <y-datepicker
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="!updateMod"
                label="L0000003092"
                name="assessDate"
                :default="assessInfo.assessDate"
                v-model="assessInfo.assessDate"
                v-validate="'required'"
                :state="validateState('assessDate')"
              ></y-datepicker>
            </b-col>
          </b-row>
        </b-card>
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
  name: 'assess-action-jsa',
  props: {
    assess: {
      assessPlanNo: 0,
      deptCd: '',
      assessNm: '',
      paneName: '',
      assessStatus: '',
      assessTypeNo: 0,
      createDeptCd: '',
    },
    disabled: false,
  },
  data() {
    return {
      searchParam: {
        plantCd: '',
        deptCd: '',
        processCd: '',
        jobNm: '',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '1100px',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      assessInfo: {
        assessPlanNo: 0,
        deptCd: '',
        deptNm: '',
        processNm: '',
        processCd: '',
        jobId: '',
        jobCd: '',
        jobRevno: 0,
        jobNm: '',
        jobStepNo: '',
        jobStepNm: '',
        currentRiskSize: '',
        currentFrequencySize: '',
        currentStrongSize: '',
        pRiskHazardNm: '',
        riskHazardNm: '',
        riskHazard: '',
        improve: '',
        afterRiskSize: '',
        afterFrequencySize: '',
        afterStrongSize: '',
        assessUserId: '',
        assessUserNm: '',
        assessDeptCd: '',
        assessDeptNm: '',
        assessDate: null,
        assessNm: '',
        assessTypeNo: '',
        deptAndPrecess: '',
        jobCdAndJobRevno: '',
        ADeptNmAndAUserNm: '',
        jobStepCdAndNm: '',
        jsaCnt: 0,
        krasCnt: 0,
        evalDesc: '',
        createUserId: '',
        updateUserId: '',
      },
      jobGridOptions: {
        name: 'assessActionJsaJobGrid',
        header: [],
        data: [],
        height: 200,
      },
      gridOptions: {
        name: 'assessActionGrid',
        header: [],
        data: [],
        height: 200,
      },
      JSAGridOptions: {
        name: 'assessActionJsaGrid',
        header: [],
        data: [],
        height: 200,
      },
      YAuiGrid: null,
      AuiGrid: null,
      FinGrid: null,
      searchUrl: '',
      searchJobUrl: '',
      insertUrl: '',
      isInsert: false,
      riskAssessSearchUrl: '',
      updateMod: false,
      editable: true,
      parentData: {},
      processCd: '',
      
      isComplete: false,
      isFirstGetList: false,
    };
  },
  watch: {
    assess: {
      handler: function(val, oldVal) {
        Object.assign(this.$data.assessInfo, this.$options.data().assessInfo);
        this.updateMod = false;
        this.JSAGridOptions.data = [];

        this.getList();
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
  },
  updated() {},
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.AuiGrid = this.$refs.auiGrid;
    this.FinGrid = this.$refs.finauiGrid;
  },
  beforeDestroy() {},
  
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;    
      this.searchParam.deptCd = this.$store.getters.deptCd;

      // Url Setting
      this.searchJobUrl = selectConfig.rsa.assessAction.jsaJobList.url;
      this.searchUrl = selectConfig.rsa.assessAction.jsaList.url;
      this.riskAssessSearchUrl = selectConfig.rsa.assessAction.getJsa.url;
      // this.insertUrl = transactionConfig.rsa.assessAction.insertJsa.url;
      this.insertUrl = transactionConfig.rsa.assessAction.insert.url;

      this.getList();
      
      if (this.assess.assessStatus === 'C') {
        this.isComplete = true;
      }
      // GridHeader
      this.jobGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), 
          dataField: 'deptNm', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'), 
          dataField: 'processNm', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002423'), 
          dataField: 'jobCd', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'), 
          dataField: 'jobNm', 
          width: '40%', 
        },
      ];

      // GridHeader
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002401'), 
          dataField: 'jobStepNo', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002375'), 
          dataField: 'jobStepNm', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002886'), 
          dataField: 'lastAssessDate', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003046'), 
          dataField: 'riskHazardCnt', 
          width: '40%', 
        },
      ];
      this.JSAGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003088'), 
          dataField: 'assessYn', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002383'), 
          dataField: 'jobStepNmRev', 
          width: '10%', 
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002181'), 
          dataField: 'pRiskHazardNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002179'), 
          dataField: 'riskHazardNm', 
          width: '20%', 
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000275'), 
          dataField: 'currentRiskSize', 
          width: '15%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000254'), 
          dataField: 'improve', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000286'), 
          dataField: 'afterRiskSize', 
          width: '15%', 
        },
      ];
    },
    getList() {
      this.$http.url = this.searchJobUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        assessPlanNo: this.assess.assessPlanNo,
        plantCd: this.searchParam.plantCd,
        deptCd: this.searchParam.deptCd,
        processCd: this.searchParam.processCd,
        jobNm: this.searchParam.jobNm,
      };
      this.$http.request(
        _result => {
          this.jobGridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data))

          // if (!this.isFirstGetList && _result.data && _result.data.length > 0) {
          //   this.$refs.jobDataTable.setCurrentRow(this.jobGridOptions.data[0]);
          //   this.selectedJobRow(this.jobGridOptions.data[0]);
          // } 
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectedJobRow(data) {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        assessPlanNo: this.assess.assessPlanNo,
        deptCd: this.assess.deptCd,
        processCd: data.processCd,
        jobId: data.jobId,
      };
      this.$http.request(
        _result => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.AuiGrid.setGridData(this.$_.clone(_result.data))
          this.JSAGridOptions.data = [];

          // if (!this.isFirstGetList && _result.data && _result.data.length > 0) {
          //   this.$refs.jobStepDataTable.setCurrentRow(this.gridOptions.data[0]);
          //   this.selectedRow(this.gridOptions.data[0]);
          // }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getRiskAssessList(data) {
      this.assessInfo.processCd = data.processCd;
      this.$http.url = this.riskAssessSearchUrl;
      this.$http.type = 'GET';
      this.$http.param = data;
      this.$http.request(
        _result => {
          this.JSAGridOptions.data = this.$_.clone(_result.data);
          this.FinGrid.setGridData(this.$_.clone(_result.data))

          // if (!this.isFirstGetList && _result.data && _result.data.length > 0) {
          //   this.$refs.dataTable.setCurrentRow(this.JSAGridOptions.data[0]);
          //   this.selectedJSARow(this.JSAGridOptions.data[0]);
          //   this.isFirstGetList = true;
          // }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openDialogPage(flag) {
      if (!this.updateMod) {
        return;
      }
      // if (
      //   (this.assess.assessStatus !== 'A' &&
      //     this.assess.assessStatus !== 'E') ||
      //   this.assessInfo.jobId === '' ||
      //   this.disabled
      // ) {
      //   return;
      // }

      if (!this.editable) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000633', // 쓰기 권한이 없습니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      if (flag === 'C') {
        this.popupOptions.param = {
          flag: flag,
          assessTypeNo: this.assess.assessTypeNo,
          riskSize: this.assessInfo.currentRiskSize,
          frequencySize: this.assessInfo.currentFrequencySize,
          strongSize: this.assessInfo.currentStrongSize,
        };
      } else {
        this.popupOptions.param = {
          flag: flag,
          assessTypeNo: this.assess.assessTypeNo,
          riskSize: this.assessInfo.afterRiskSize,
          frequencySize: this.assessInfo.afterFrequencySize,
          strongSize: this.assessInfo.afterStrongSize,
        };
      }
      this.popupOptions.target = () => import(`${'./selectMatrixDialog.vue'}`);
      this.popupOptions.title = 'L0000003428'; // 위험도 Matrix 선택

      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      if (data.flag === 'C') {
        this.assessInfo.currentRiskSize = data.riskSize;
        this.assessInfo.currentFrequencySize = data.frequencySize;
        this.assessInfo.currentStrongSize = data.strongSize;
      } else if (data.flag === 'A') {
        this.assessInfo.afterRiskSize = data.riskSize;
        this.assessInfo.afterFrequencySize = data.frequencySize;
        this.assessInfo.afterStrongSize = data.strongSize;
      }

      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    selectedRow(data) {
      this.parentData = data;
      this.getRiskAssessList(data);
      Object.assign(this.$data.assessInfo, this.$options.data().assessInfo);
      this.updateMod = false;
    },
    selectedJSARow(data) {
      this.assessInfo.krasCnt = 1;
      this.setAssessInfo(data);
    },
    setAssessInfo(data) {
      data.processCd = this.parentData.processCd;
      this.$_.extend(this.assessInfo, data);
      // this.assessInfo = this.$_.clone(data);
      if (!this.assessInfo.deptCd && this.parentData.deptCd) {
        this.assessInfo.deptCd = this.parentData.deptCd;
      }
      if (this.assessInfo.assessPlanNo === 0) {
        this.assessInfo.assessPlanNo = this.parentData.assessPlanNo;
      }

      this.assessInfo.deptAndPrecess =
        this.assessInfo.deptNm + ' / ' + this.parentData.processNm;
      this.assessInfo.jobCdAndJobRevno =
        this.parentData.jobCd + ' / ' + this.parentData.jobRevno;
      this.assessInfo.jobNm = this.parentData.jobNm;
      this.assessInfo.jobStepCdAndNm =
        this.assessInfo.jobStepNo + ' / ' + this.assessInfo.jobStepNm;

      if (
        this.assessInfo.assessUserId === null ||
        this.assessInfo.assessUserId === ''
      ) {
        this.assessInfo.assessUserId = this.$store.getters.token;
        this.assessInfo.ADeptNmAndAUserNm =
          this.$store.getters.deptNm + '/' + this.$store.getters.name;
      } else {
        this.assessInfo.ADeptNmAndAUserNm =
          this.assessInfo.assessDeptNm + ' / ' + this.assessInfo.assessUserNm;
      }

      if (this.assessInfo.currentRiskSize === null) {
        this.assessInfo.currentRiskSize = '평가'; 
      }
      if (this.assessInfo.afterRiskSize === null) {
        this.assessInfo.afterRiskSize = '평가';
      }

      if (
        (this.assess.assessStatus === 'A' ||
          this.assess.assessStatus === 'E') &&
        this.assessInfo.jobId !== '' &&
        !this.disabled
      ) {
        this.updateMod = true;
       
      }
      if (this.assess.assessStatus === 'C') {
        this.isComplete = true;
      }
      // 저장 하지 않은 상태로 다른 cell 클릭시 저장 체크용 데이터 셋팅
    },
    beforeInsert(data) {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000011', // 저장
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.assessInfo.createUserId = this.$store.getters.token;
                this.assessInfo.updateUserId = this.$store.getters.token;
                this.assessInfo.assessTypeNo = this.assess.assessTypeNo;
                this.isInsert = true;
              },
              cancelCallback: () => {
                this.isInsert = false;
              },
            });
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005'
            );
          }
        })
        .catch(() => {
          this.isInsert = false;
        });
    },
    btnSave() {
      this.$comm.recursivePromise([
        { func: this.confirm, param: 'M0000000011' },
        { func: this.saveData, successMessage: 'M0000000006' },
      ])
    },
    confirm() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321',
          message: 'M0000000011',
          type: 'info',
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = transactionConfig.rsa.assessAction.insertList.url;
        this.$http.type = 'POST';
        this.$http.param = this.uploadGridOptions.data;
        this.$http.request(
          _result => {
            _resolve(true);
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _resolve(false);
            _reject(_error);
          }
        );
      })
    },
    btnExcelTemplateDownClicked() {
      let thisVue = this;
      let accept = this.$comm.getAccept('xlsx');
      let _comm = this.$comm;
      this.$http.url = selectConfig.rsa.assessAction.excelSample.url;
      this.$http.type = 'GET';
      this.$http.param = this.assess;
      this.$http.request(
        _result => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(
              blob,
              '유해위험요인_업로드_양식.xlsx'
            );
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = '유해위험요인_업로드_양식.xlsx';
            link.click();
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnInsertClickedCallback(_result) {
      if (!this.assessInfo.assessDate) {
        this.assessInfo.assessDate = this.$comm.getToday();
      }
      this.assessInfo.jsaCnt = 1;
      this.assessInfo.krasCnt = 1;

      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.getList();
      this.selectedJobRow({
        processCd: this.assessInfo.processCd,
        jobId: this.assessInfo.jobId,
      });
      this.getRiskAssessList(this.parentData);
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
   
  },
};
</script>

<style>
</style>
