<!--
  목적 : 위험성평가 > 기준정보 > 작업 관리 > 이력정보 탭 > 상세 팝업
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
      <!-- 작업 상세 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 작업 이력 상세 -->
            <y-label label="L0000003411" icon="user-edit" color-class="cutstom-title-color"/>
            <div slot="buttonGroup" class="float-right mb-1"> 
              <!-- 닫기 -->
              <y-btn
                title="L0000000881"
                @btnClicked="btnClosePopup" 
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-1">
              <!-- 부서 -->
              <y-label label="L0000001287" />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-2">
              <y-label :label="job.deptNm" :fieldable="true" />
            </b-col>
            <!-- 공정 -->
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-1">
              <y-label label="L0000000515" />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-2">
              <y-label :label="job.processNm" :fieldable="true" />
            </b-col>
            <!-- 작업코드 -->
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-1">
              <y-label label="L0000002423" />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-2">
              <y-label :label="job.jobCd" :fieldable="true" />
            </b-col>
            <!-- 작업명 -->
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-1">
              <y-label label="L0000002389" />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-2">
              <y-label :label="job.jobNm" :fieldable="true" />
            </b-col>
            <!-- SOP번호 -->
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-1">
              <y-label label="L0000000171" />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-2">
              <y-label :label="job.sopNo.toString()" :fieldable="true" />
            </b-col>
            <!-- SOP명 -->
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-1">
              <y-label label="L0000000170" />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-2">
              <y-label :label="job.sopNm" :fieldable="true" />
            </b-col>
            <!-- 변경내용 -->
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-1">
              <y-label label="L0000001227" />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-2">
              <y-label :label="job.jobCommts" :fieldable="true" />
            </b-col>
            <!-- Rev No -->
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-1">
              <y-label label="L0000000156" />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-2">
              <y-label :label="job.jobRevno.toString()" :fieldable="true" />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- 작업단계 grid -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
           작업단계 목록 
          <y-data-table 
            label="L0000002376"
            :useRownum="false"
            :height="gridOptions.height"
            :headers="gridOptions.jobStepHeader"
            :items="gridOptions.jobStepData"
            @selectedRow="getJobRiskHazardList"
            >
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.jobStepHeader"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002376')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @selectedRow="getJobRiskHazardList"
        />
      </b-col>
    </b-row>
    <!-- 작업별 유해위험요인 grid -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
           작업단계별 유해위험요인 목록 
          <y-data-table 
            label="L0000002384"
            :height="gridOptions.height"
            :headers="gridOptions.jobRiskHazardHeader"
            :items="gridOptions.jobRiskHazardData"
            >
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="auiGrid"
          :name="gridOptions2.name"
          :headers="gridOptions2.jobRiskHazardHeader"
          :btns="gridOptions2.btns"
          :height="gridOptions2.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002384')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-job-history-detail',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        jobId: 0,
      }),
    },
  },
  data () {
    return {
      job: {
        jobId: 0,
        deptNm: '',
        processNm: '',
        jobCd: '',
        jobRevno: 1,
        jobNm: '',
        sopNo: '',
        sopNm: '',
        jobCommts: '',
      },
      gridOptions: {
        name: 'jobHistoryDetail',
        jobStepHeader: [],
        jobRiskHazardHeader: [],
        jobStepData: [],
        jobRiskHazardData: [],
        height: '210'
      },
      gridOptions2: {
        name: 'jobHistoryDetail2',
        jobStepHeader: [],
        jobRiskHazardHeader: [],
        jobStepData: [],
        jobRiskHazardData: [],
        height: '210'
      },
      YAuiGrid: null,
      AuiGrid: null,
      deptCdItems: [], // 부서
      processNoItems: [], // 공정
      comboUseYnItems: [],  // 사용여부
      countUrl: '',
      detailUrl: '',
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,  
    };
  },
  beforeMount () {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid
    this.AuiGrid = this.$refs.auiGrid
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init () {
      // URL 셋팅
      this.countUrl = selectConfig.rsa.job.count.url;
      this.detailUrl = selectConfig.rsa.job.get.url;
      this.insertUrl = transactionConfig.rsa.job.insert.url;
      this.editUrl = transactionConfig.rsa.job.edit.url;

      this.job.jobId = this.popupParam.jobId;
      this.getDetail(); // 작업 이력 상세
      this.getJobStepList();  // 작업단계 grid
      // this.getJobRiskHazardList();  // 작업별 유해위험요인 grid

      //  작업단계 grid 헤더 설정
      this.gridOptions.jobStepHeader = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001707'), 
          dataField: 'jobStepNo', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002382'), 
          dataField: 'jobStepNm', 
          width: '30%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002379'), 
          dataField: 'jobStepDesc', 
          width: '40%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'), 
          dataField: 'useYnNm', 
          width: '20%', 
        },
      ];

      // 유해위험요인 grid 헤더 설정
      this.gridOptions2.jobRiskHazardHeader = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002181'), 
          dataField: 'priskHazardNm', 
          width: '30%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002179'), 
          dataField: 'riskHazardNm', 
          width: '70%', 
          style: 'left-align'
        },
      ]; // 유해위험요인
    },
    // 작업 이력 상세
    getDetail () {
      this.$http.url = this.$format(this.detailUrl, this.job.jobId);
      this.$http.type = 'get'; 
      this.$http.request((_result) => {
        this.job = _result.data;
      }, (_error) => {
        window.getApp.$emit('APP_REQUEST_ERROR', _error);
      });
    },
    // 작업단계 grid
    getJobStepList () {
      this.$http.url = selectConfig.rsa.jobStep.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        'jobId': this.job.jobId
      }
      this.$http.request((_result) => {
        this.gridOptions.jobStepData = _result.data;
        this.YAuiGrid.setGridData(_result.data)
      }, (_error) => {
        window.getApp.$emit('APP_REQUEST_ERROR', _error);
      });
    },
    // 유해위험요인 grid
    getJobRiskHazardList (row) {
      this.$http.url = selectConfig.rsa.jobRiskHazard.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        'jobStepId': row.jobStepId,
      }
      this.$http.request((_result) => {
        this.gridOptions.jobRiskHazardData = _result.data;
        this.AuiGrid.setGridData(_result.data)
      }, (_error) => {
        window.getApp.$emit('APP_REQUEST_ERROR', _error);
      });
    },

    /** Button Event **/
    // 팝업 닫기
    btnClosePopup () {
      // 부모창에 값 전달
      this.$emit('closePopup', { 'success': true });
    },
    // 초기화
    btnClearClickedCallback () {
      Object.assign(this.$data.job, this.$options.data().job);
      this.$validator.reset();
    },
    // 신규등록
    btnInsertClickedCallback (_result) {
      this.$emit('getDataList');
      this.isInsert = false;
      this.job.jobId = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success',
      });
    },
    // 수정
    btnEditClickedCallback (_result) {
      this.$emit('getDataList');
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success',
      });
    },
    // 버튼 에러 처리
    btnClickedErrorCallback (_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/
  }
};
</script>