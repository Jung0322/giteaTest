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
        <b-card header-class="default-card" body-class="default-body-card" class="py-0">
          <div slot="header">
            <y-label label="검색" />
            <div class="float-right">
              <y-btn :title="searchArea.title" color="green" @btnClicked="btnSearchVisibleClicked" />
              <y-btn title="검색" color="green" @btnClicked="getList" />
            </div>
          </div>
          <b-row v-if="searchArea.show">
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant type="search" v-model="searchParam.plantCd" />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-dept
                type="search"
                name="deptCd"
                :plantCd="searchParam.plantCd"
                v-model="searchParam.deptCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-process
                label="공정"
                name="processCd"
                type="search"
                :plantCd="searchParam.plantCd"
                :deptCd="searchParam.deptCd"
                v-model="searchParam.processCd"
              ></y-tree-process>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                ui="bootstrap"
                label="작업명"
                name="jobNm"
                v-model="searchParam.jobNm"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <!-- 등록 -->
    <b-row class="mt-1">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <y-data-table
            ref="dataTable"
            label="평가대상 작업 목록"
            :height="jobGridOptions.height"
            :headers="jobGridOptions.header"
            :items="jobGridOptions.data"
            @selectedRow="selectedJobRow"
          ></y-data-table>
        </b-col>
      </b-col>
      <b-col sm="12">
        <b-col sm="12" class="px-0 mt-3">
          <y-data-table
            ref="dataTable"
            label="평가대상 작업단계 목록"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @selectedRow="selectedRow"
          ></y-data-table>
        </b-col>
      </b-col>
      <b-col sm="12">
        <b-col sm="12" class="mt-3 px-0">
          <y-data-table
            ref="dataTable"
            label="유해위험요인 목록"
            :height="JSAGridOptions.height"
            :headers="JSAGridOptions.header"
            :items="JSAGridOptions.data"
            :useRownum="false"
            @selectedRow="selectedJSARow"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <y-label label="위험성 평가" icon="user-edit" color-class="cutstom-title-color" />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="부서 / 공정"
                name="deptAndPrecess"
                v-model="assessInfo.deptAndPrecess"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="작업코드 / Rev No"
                name="jobCdAndJobRevno"
                v-model="assessInfo.jobCdAndJobRevno"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="작업명"
                name="jobNm"
                v-model="assessInfo.jobNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="작업순서 / 작업단계"
                name="jobStepCdAndNm"
                v-model="assessInfo.jobStepCdAndNm"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="4">
                  <y-text
                    :width="6"
                    :disabled="true"
                    :required="true"
                    ui="bootstrap"
                    label="개선전 위험도"
                    name="currentRiskSize"
                    v-model="assessInfo.currentRiskSize"
                    v-validate="'required'"
                    :state="validateState('currentRiskSize')"
                  ></y-text>
                </b-col>
                <b-col sm="2">
                  <!-- 위험도 조회 -->
                  <label style="color:#0174DF;" @click="openDialogPage('C')">{{$comm.getLangSpecInfoLabel('L0000002124')}}</label>
                </b-col>
                <b-col sm="3">
                  <y-text
                    :width="8"
                    :disabled="true"
                    :required="true"
                    ui="bootstrap"
                    label="빈도"
                    name="currentFrequencySize"
                    v-model="assessInfo.currentFrequencySize"
                    v-validate="'required'"
                    :state="validateState('currentFrequencySize')"
                  ></y-text>
                </b-col>
                <b-col sm="3">
                  <y-text
                    :width="8"
                    :disabled="true"
                    :required="true"
                    ui="bootstrap"
                    label="강도"
                    name="currentStrongSize"
                    v-model="assessInfo.currentStrongSize"
                    v-validate="'required'"
                    :state="validateState('currentStrongSize')"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-text
                :width="10"
                :disabled="true"
                ui="bootstrap"
                label="유해위험요인"
                name="riskHazard"
                v-model="assessInfo.riskHazard"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-text
                :disabled="!updateMod"
                :editable="editable"
                :maxlength="80"
                :width="10"
                :required="true"
                ui="bootstrap"
                label="개선대책"
                name="improve"
                v-model="assessInfo.improve"
                v-validate="'required'"
                :state="validateState('improve')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="4">
                  <y-text
                    :width="6"
                    :disabled="true"
                    :required="true"
                    ui="bootstrap"
                    label="개선후 위험도"
                    name="afterRiskSize"
                    v-model="assessInfo.afterRiskSize"
                    v-validate="'required'"
                    :state="validateState('afterRiskSize')"
                  ></y-text>
                </b-col>
                <b-col sm="2">
                  <!-- 위험도 조회 -->
                  <label style="color:#0174DF;" @click="openDialogPage('A')">{{$comm.getLangSpecInfoLabel('L0000002124')}}</label>
                </b-col>
                <b-col sm="3">
                  <y-text
                    :width="8"
                    :disabled="true"
                    :required="true"
                    ui="bootstrap"
                    label="빈도"
                    name="afterFrequencySize"
                    v-model="assessInfo.afterFrequencySize"
                    v-validate="'required'"
                    :state="validateState('afterFrequencySize')"
                  ></y-text>
                </b-col>
                <b-col sm="3">
                  <y-text
                    :width="8"
                    :disabled="true"
                    :required="true"
                    ui="bootstrap"
                    label="강도"
                    name="afterStrongSize"
                    v-model="assessInfo.afterStrongSize"
                    v-validate="'required'"
                    :state="validateState('afterStrongSize')"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-textarea
                :disabled="!updateMod"
                :editable="editable"
                :maxlength="300"
                :width="10"
                ui="bootstrap"
                label="평가상세"
                name="evalDesc"
                v-model="assessInfo.evalDesc"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="평가자"
                name="ADeptNmAndAUserNm"
                v-model="assessInfo.ADeptNmAndAUserNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-datepicker
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="!updateMod"
                label="평가일자"
                name="assessDate"
                :default="assessInfo.assessDate"
                v-model="assessInfo.assessDate"
                v-validate="'required'"
                :state="validateState('assessDate')"
              ></y-datepicker>
            </b-col>
          </b-row>
          <div class="float-right mt-3">
            <y-btn
              v-if="updateMod&&editable"
              :action-url="insertUrl"
              :param="assessInfo"
              :is-submit="isInsert"
              title="저장"
              color="orange"
              action-type="POST"
              beforeSubmit="beforeInsert"
              @beforeInsert="beforeInsert"
              @btnClicked="btnInsertClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
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
  name: 'assess-JSA-tab',
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
      searchArea: {
        title: '검색박스숨기기',
        show: true,
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
        header: [],
        data: [],
        height: 200,
      },
      gridOptions: {
        header: [],
        data: [],
        height: 200,
      },
      JSAGridOptions: {
        header: [],
        data: [],
        height: 200,
      },
      searchUrl: '',
      searchJobUrl: '',
      insertUrl: '',
      isInsert: false,
      riskAssessSearchUrl: '',
      updateMod: false,
      editable: true,
      parentData: {},
      processCd: '',
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
  mounted() {},
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

      // GridHeader
      this.jobGridOptions.header = [
        { text: '부서', name: 'deptNm', width: '100px', align: 'center' },
        { text: '공정', name: 'processNm', width: '100px', align: 'center' },
        { text: '작업코드', name: 'jobCd', width: '150px', align: 'center' },
        { text: '작업명', name: 'jobNm', width: '200px' },
      ];

      // GridHeader
      this.gridOptions.header = [
        {
          text: '작업순서',
          name: 'jobStepNo',
          width: '100px',
          align: 'center',
        },
        { text: '작업단계', name: 'jobStepNm', width: '150px' },
        {
          text: '최종 평가일',
          name: 'lastAssessDate',
          width: '120px',
          align: 'center',
        },
        {
          text: '평가건수',
          name: 'riskHazardCnt',
          width: '100px',
          align: 'center',
        },
      ];

      // this.gridOptions.merge = [];
      // for (let i = 1; i <= 4; i++)
      // {
      //   this.gridOptions.merge.push({ index: i, field: 'jobId' });
      // }

      this.JSAGridOptions.header = [
        // { text: '유해위험요인 번호', name: 'riskHazardNo', width: '150px', align: 'center' },
        {
          text: '평가유무 (Y/N)',
          name: 'assessYn',
          width: '150px',
          align: 'center',
        },
        {
          text: '작업단계명(차수)',
          name: 'jobStepNmRev',
          width: '200px',
          align: 'left',
        },
        {
          text: '유해위험요인 분류',
          name: 'pRiskHazardNm',
          width: '200px',
          align: 'center',
        },
        { text: '유해위험요인', name: 'riskHazardNm', width: '300px' },
        {
          text: '개선전 위험도',
          name: 'currentRiskSize',
          width: '150px',
          align: 'center',
        },
        { text: '개선대책', name: 'improve', width: '250px' },
        {
          text: '개선후 위험도',
          name: 'afterRiskSize',
          width: '150px',
          align: 'center',
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
          this.JSAGridOptions.data = [];
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
          title: '안내',
          message: '쓰기 권한이 없습니다.',
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
      this.popupOptions.title = '위험도 Matrix 선택';

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
        // if (this.assess.createDeptCd === this.$store.getters.deptCd) {
        //   this.updateMod = true;
        // } else {
        //   this.updateMod = false;
        // }
      }
      // 저장 하지 않은 상태로 다른 cell 클릭시 저장 체크용 데이터 셋팅
    },
    beforeInsert(data) {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '저장하시겠습니까?',
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
              '필수 입력값을 입력해 주세요.'
            );
          }
        })
        .catch(() => {
          this.isInsert = false;
        });
    },
    btnInsertClickedCallback(_result) {
      if (!this.assessInfo.assessDate) {
        this.assessInfo.assessDate = this.$comm.getToday();
      }
      this.assessInfo.jsaCnt = 1;
      this.assessInfo.krasCnt = 1;

      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '저장되었습니다.',
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
    /**
     * 검색박스 숨기기/보이기 처리 후 setGridSize 호출
     */
    btnSearchVisibleClicked() {
      this.searchArea.show = !this.searchArea.show;
      if (this.searchArea.show) this.searchArea.title = '검색박스숨기기';
      else this.searchArea.title = '검색박스보이기';

      window.getApp.$emit('LOADING_PASS_COUNT', 1);
    },
  },
};
</script>

<style>
</style>
