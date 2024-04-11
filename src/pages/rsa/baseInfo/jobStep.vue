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
    <!-- <b-row class="mb-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
          추가 
            <y-btn
              v-if="selectedJobId && editable && editMode"
              title="L0000002892"
              color="orange"
              @btnClicked="openPopup"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           작업단계 목록 
          <y-data-table
            label="L0000002376"
            :cellClick="true"
            :useRownum="false"
            v-model="jobStep"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @selectedRow="selectedRow"
            @tableLinkClicked="tableLinkClicked"
            :popMode="true"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002376')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :showRowCheckColumn="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @openPopup="openPopup"
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
  name: 'y-job-step',
  props: {
    selectedJobId: 0,
    editMode: false,
  },
  data() {
    return {
      jobStep: {
        jobId: 0,
        jobStepNo: null,
        jobStepId: 0,
        selectedJobId: 0,
        selectedJobStepNo: 0,
        jobStepNm: '',
        jobStepDesc: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        name: 'jobStep',
        btns: [],
        header: [],
        data: [],
        height: 210,
      },
      YAuiGrid: null,
      component: null,
      tabIndex: 0,
      editable: false,
      searchUrl: '',
      detailUrl: '',
    };
  },
  watch: {
    selectedJobId: function(newValue, oldValue) {
      this.jobStep.jobId = this.selectedJobId;
      this.getDataList();
    },
    'editMode': function(newValue, oldValue) {      
      if (this.editMode) {
        this.gridOptions.btns[0].visible = true
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;  
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.rsa.jobStep.list.url;
      this.detailUrl = selectConfig.rsa.jobStep.get.url;
      if (this.selectedJobId) this.jobStep.jobId = this.selectedJobId;
      this.editable = this.$route.meta.editable;
      this.getDataList(); // 작업단계 grid
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
          width: '20%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002379'), 
          dataField: 'jobStepDesc', 
          width: '30%', 
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002798'), 
          dataField: 'revNo', 
          width: '20%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'), 
          dataField: 'useYnNm', 
          width: '20%', 
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), 
          color: 'orange',
          btnClicked: 'openPopup',
          visible: false,
        },
      ]
    },
    // /init()
    // 작업단계 grid
    getDataList() {
      if (!this.jobStep.jobId) return;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        jobId: this.selectedJobId,
      };
      this.$http.request(
        _result => {
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data)
          this.jobStep.selectedJobId = this.$_.clone(this.selectedJobId);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 그리드 row click 이벤트
    selectedRow(data) {
      if (data === null) return;
      this.$http.url = this.$format(this.detailUrl, data.jobStepId);
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.jobStep = this.$_.clone(_result.data);
          this.jobStep.selectedJobStepNo = _result.data.jobStepNo;
          this.jobStep.selectedJobId = this.$_.clone(this.selectedJobId);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 그리드 row click 이벤트
    cellClickHandler(event) {
      if (event.dataField === 'revNo') {
        this.popupOptions.target = () => import(`${'./jobStepHistory.vue'}`);
        this.popupOptions.title = 'L0000002380'; // 작업단계 이력
        this.popupOptions.param = {
          jobId: event.item.jobId,
          jobStepNo: event.item.jobStepNo,
        };
        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else if (event.dataField === 'jobStepNm') {
        this.popupOptions.target = () => import(`${'./jobStepPopup.vue'}`);
        this.popupOptions.title = 'L0000002378'; // 작업단계 상세 수정
        this.popupOptions.param = {
          jobStep: event.item,
        };
        this.popupOptions.top = '100px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    tableLinkClicked(header, data) {
      if (header.name === 'revNo') {
        this.popupOptions.target = () => import(`${'./jobStepHistory.vue'}`);
        this.popupOptions.title = 'L0000002380'; // 작업단계 이력
        this.popupOptions.param = {
          jobId: data.jobId,
          jobStepNo: data.jobStepNo,
        };
        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else {
        this.popupOptions.target = () => import(`${'./jobStepPopup.vue'}`);
        this.popupOptions.title = 'L0000002378'; // 작업단계 상세 수정
        this.popupOptions.param = {
          jobStep: data,
        };
        this.popupOptions.top = '100px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    // 추가버튼 팝업열기
    openPopup() {
      this.jobStep.jobStepNm = '';
      this.jobStep.jobStepDesc = '';
      this.jobStep.useYn = 'Y';

      this.popupOptions.target = () => import(`${'./jobStepPopup.vue'}`);
      this.popupOptions.title = 'L0000002377'; // 작업단계 상세 등록
      this.popupOptions.param = {
        jobStep: { 
          jobId: this.selectedJobId,
          jobStepId: 0,
        },
      };
      this.popupOptions.top = '100px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    // 팝업닫기
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>