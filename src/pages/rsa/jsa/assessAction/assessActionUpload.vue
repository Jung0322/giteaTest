<!--
  목적 : 작업허가서 점검 확인사항
  Detail : 작업허가서 점검 확인사항 Tab
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col v-if="editable && !isComplete" sm="12">
        <!-- 위험성평가실행(JSA) 파일업로드 목록 
        <y-label label="L0000002152" icon="user-edit" color-class="cutstom-title-color" />
        <div class="float-right">
          <el-tag v-if="isUpload" size="medium" type="info">
            < 불필요한 데이터는 자동 삭제됩니다. 
            <i class="el-icon-info"></i> {{$comm.getLangSpecInfoLabel('L0000003421')}}
          </el-tag>
           저장 
          <y-btn
            v-if="isUpload && editable"
            :width="8"
            title="L0000002474"
            color="orange"
            @btnClicked="btnSave"
          />
           평가계획 다운로드 
          <y-btn
            v-if="editable && !isComplete"
            :width="8"
            title="L0000004203"
            color="blue"
            @btnClicked="btnExcelTemplateDownClicked"
          />
           평가결과 업로드 
          <y-btn
          v-if="editable && !isComplete"
          :width="8" title="L0000004204" color="blue" @btnClicked="btnExcelUploadClicked" />
        </div>
        <y-data-table
          v-if="editable && !isComplete"
          ref="dataTable"
          :height="uploadGridOptions.height"
          :headers="uploadGridOptions.header"
          :items="uploadGridOptions.data"
          :useRownum="true"
          :popMode="true"
        ></y-data-table> -->
        <y-auigrid
          ref="yAuiGrid"
          :name="uploadGridOptions.name"
          :headers="uploadGridOptions.header"
          :btns="uploadGridOptions.btns"
          :height="uploadGridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002852')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getDataList="closePopupExcelUpload"
          @btnExcelTemplateDownClicked="btnExcelTemplateDownClicked"
          @btnExcelUploadClicked="btnExcelUploadClicked"
          @cellClick="cellClickHandler"
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
      uploadGridOptions: {
        header: [],
        data: [],
        btns: [],
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

      isComplete: false,
      isFirstGetList: false,
      YAuiGrid: null,
    };
  },
  computed: {
    isUpload() {
      return !(this.uploadGridOptions.data.length === 0);
    },
  },
  watch: {
    assess: {
      handler: function (val, oldVal) {
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

      if (this.assess.assessStatus === 'C') {
        this.isComplete = true;
      }
      this.uploadGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '150px',
          align: 'left',
        }, // 부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: '150px',
          align: 'left',
        }, // 공정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'jobNm',
          width: '150px',
          align: 'left',
        }, // 작업명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002382'),
          dataField: 'jobStepNm',
          width: '150px',
          align: 'left',
        }, // 작업단계명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002181'),
          dataField: 'pRiskHazardNm',
          width: '200px',
          align: 'center',
        }, // 유해위험요인 분류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002179'),
          dataField: 'riskHazardNm',
          width: '300px',
        }, // 유해위험요인
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000275'),
          dataField: 'currentRiskSize',
          width: '150px',
          align: 'center',
        }, // 개선전 위험도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000254'),
          dataField: 'improve',
          width: '250px',
        }, // 개선대책
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000286'),
          dataField: 'afterRiskSize',
          width: '150px',
          align: 'center',
        }, // 개선후 위험도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003083'),
          dataField: 'evalDesc',
          width: '150px',
          align: 'center',
        }, // 평가상세
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003092'),
          dataField: 'assessDate',
          width: '150px',
          align: 'center',
        }, // 평가일자
      ];
      this.uploadGridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001968'),
          btnClicked: 'btnExcelTemplateDownClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001969'),
          btnClicked: 'btnExcelUploadClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',
        },
      ];
    },
    btnSave() {
      this.$comm.recursivePromise([
        { func: this.confirm, param: 'M0000000011' }, // 저장하시겠습니까?
        { func: this.saveData, successMessage: 'M0000000006' }, // 저장되었습니다.
      ]);
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
          (_result) => {
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _resolve(false);
            _reject(_error);
          }
        );
      });
    },
    btnExcelTemplateDownClicked() {
      let thisVue = this;
      let accept = this.$comm.getAccept('xlsx');
      let _comm = this.$comm;
      this.$http.url = selectConfig.rsa.assessAction.excelSample.url;
      this.$http.type = 'GET';
      this.$http.param = this.assess;
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(
              blob,
              '위험성평가결과_업로드_양식(JSA).xlsx'
            );
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = '위험성평가결과_업로드_양식(JSA).xlsx';
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnExcelUploadClicked() {
      this.popupOptions.target = () =>
        import(`${'./assessActionJSAUpload.vue'}`);
      this.popupOptions.title = 'L0000003422'; // 위험성평가실행 (JSA) 엑셀 업로드
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        assessTypeNo: this.assess.assessTypeNo,
      };
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupExcelUpload;
    },
    closePopupExcelUpload(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (!data || data.length === 0) {
        return;
      }
      this.uploadGridOptions.data = [];
      this.$_.forEach(data, (item) => {
        if (item.assessPlanNo === String(this.assess.assessPlanNo)) {
          this.uploadGridOptions.data.push({
            // afterRiskNo, currnetRiskNo 계산하기 위한 parameters
            afterFrequencySize: item.afterFrequencySize,
            afterRiskSize: item.afterRiskSize,
            afterStrongSize: item.afterStrongSize,
            currentFrequencySize: item.currentFrequencySize,
            currentRiskSize: item.currentRiskSize,
            currentStrongSize: item.currentStrongSize,
            assessTypeNo: item.assessTypeNo,

            // 평가상세 마스터 parameter
            processCd: item.processCd,
            assessPlanNo: this.assess.assessPlanNo,
            jobId: item.jobId,
            jobStepId: item.jobStepId,
            riskHazardNo: item.riskHazardNo,
            improve: item.improve,
            evalDesc: item.evalDesc,
            assessUserId: this.$store.getters.token, // 평가자 추가
            assessDate: item.assessDate,

            // 필요없는것들(혹시나 남겨둠)
            deptCd: item.deptCd,
            deptNm: item.deptNm,
            isEdit: item.isEdit,
            jobNm: item.jobNm,
            jobStepNm: item.jobStepNm,
            pRiskHazardNm: item.pRiskHazardNm,
            processNm: item.processNm,
            riskHazardNm: item.riskHazardNm,
          });
        } else {
          return false;
        }
      });
    },
    cellClickHandler() {},
  },
};
</script>

<style></style>
