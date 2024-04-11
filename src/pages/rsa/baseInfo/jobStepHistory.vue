<!--
  목적 : 위험성평가 > 기준정보 > 작업 관리 > 작업단계 탭
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mb-3">
      <b-col sm="12">
        <!-- <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
           닫기 
            <y-btn
              title="L0000000881"
              @btnClicked="closePopup('C')" 
            />
          </div>
           작업단계 이력 목록 
          <y-data-table 
            label="L0000002381"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @selectedRow="selectedRow"
            >
          </y-data-table>
        </b-col> -->
        <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002381')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @closePopup="closePopup('C')"
          @selectedRow="selectedRow"
          />
        </b-col>
        <!-- <b-col sm="12" class="px-0 mt-3">
           작업단계별 유해위험요인 목록 -
          <y-data-table 
            ref="hazardDataTable"
            :height="hazardGridOptions.height"
            :headers="hazardGridOptions.header"
            :items="hazardGridOptions.data"
            label="L0000002384"
            >
          </y-data-table>
        </b-col> -->
        <b-col sm="12" class="h100p">
        <y-auigrid
          ref="auiGrid"
          :name="hazardGridOptions.name"
          :headers="hazardGridOptions.header"
          :btns="hazardGridOptions.btns"
          :height="hazardGridOptions.height"
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
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-job-step-history',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        jobId: 0,
        jobStepNo: 0,       
      }),
    },
  },
  data () {
    return {
      gridOptions: {
        name: 'jobStepHistory',
        btns: [],
        header: [],
        data: [],
        height: 210
      },
      hazardGridOptions: {
        name: 'jobStepHistoryHazard',
        header: [],
        data: [],
        height: 210
      },
      YAuiGrid: null,
      AuiGrid: null,
      editable: false,
      searchUrl: '',
    };
  },
  beforeMount () {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.AuiGrid = this.$refs.auiGrid;
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init () {
      // URL 셋팅
      this.searchUrl = selectConfig.rsa.jobStep.history.url;

      this.editable = this.$route.meta.editable;
      
      this.getDataList();  // 작업단계 이력 grid

      // 작업단계 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001707'), 
          dataField: 'jobStepNo', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002382'), 
          dataField: 'jobStepNm', 
          width: '15%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002379'), 
          dataField: 'jobStepDesc', 
          width: '25%', 
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002798'), 
          dataField: 'revNo', 
          width: '15%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000294'), 
          dataField: 'revContents', 
          width: '25%', 
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'), 
          dataField: 'useYnNm', 
          width: '10%', 
        },
      ];
      // 유해위험요인 grid 헤더 설정
      this.hazardGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002181'), 
          dataField: 'priskHazardNm', 
          width: '40%', 
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002179'), 
          dataField: 'riskHazardNm', 
          width: '60%', 
          style: 'left-align',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        },
      ]
    },
    // 작업단계 이력 grid
    getDataList () {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        'jobId': this.popupParam.jobId,
        'jobStepNo': this.popupParam.jobStepNo,
      }
      this.$http.request((_result) => {
        this.gridOptions.data = _result.data;
        this.YAuiGrid.setGridData(_result.data)
      }, (_error) => {
        window.getApp.$emit('APP_REQUEST_ERROR', _error);
      });
    },
    // 유해위험요인 grid
    selectedRow (data) {
      this.$http.url = selectConfig.rsa.jobRiskHazard.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        'jobStepId': data.jobStepId,
      }
      this.$http.request((_result) => {
        this.hazardGridOptions.data = _result.data;
        this.AuiGrid.setGridData(_result.data);
      }, (_error) => {
        window.getApp.$emit('APP_REQUEST_ERROR', _error);
      });
    },
    closePopup () {
      this.$emit('closePopup', {});
    },

    /** validation checking **/
    /** /validation checking **/

    /** Button Event **/
    /** /Button Event **/
  }
};
</script>