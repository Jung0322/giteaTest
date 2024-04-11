<!--
  목적 : 위험성평가 > 기준정보 > 작업 관리 > 유해위험요인 탭
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1" v-if="jobStepId > 0 && editable">
             추가
            <y-btn title="L0000002892" color="orange" @btnClicked="btnPopupClickedCallback" />
             삭제 
            <y-btn
              v-if="gridOptions.data.length > 0 && editable"
              :action-url="deleteUrl"
              :param="deleteValue"
              :is-submit="isDelete"
              title="L0000001495"
              color="red"
              action-type="DELETE"
              beforeSubmit="beforeDelete"
              @beforeDelete="beforeDelete"
              @btnClicked="btnDeleteClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           작업단계별 유해위험요인 목록 
          <y-data-table
            :cellClick="true"
            v-model="selectedValue"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            label="L0000002384"
            :popMode="true"
          >
            <el-table-column type="selection" slot="selection" align="center" width="55"></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->

    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <!-- 예산편성 부서 -->
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005046')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showRowCheckColumn="true"
          :showGridCtrl="true"
          :softRemoveRowMode="false"
          @btnAddRow="btnAddRow"
          @btnDelRow="btnDelRow"
        />
      </b-col>
    </b-row>

    <!-- 버튼 -->

    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-job-risk-hazard',
  props: {
    jobStepId: 0,
    jobStep: {
      type: Object,
      default: () => ({
        selectedJobId: 0,
        selectedJobStepNo: 0,
      }),
    },
  },
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: 210,
        btns: [],
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
      editable: false,
      selectUrl: '',
      insertUrl: '',
      deleteUrl: '',
      isInsert: false,
      isDelete: false,
      selectedValue: [],
      deleteValue: null,
      YAuiGrid: null,
    };
  },
  watch: {
    jobStepId: function (newValue, oldValue) {
      this.getDataList();
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
      // this.selectUrl = selectConfig.rsa.jobRiskHazard.list.url;
      this.insertUrl = transactionConfig.rsa.jobRiskHazard.insert.url;
      this.deleteUrl = transactionConfig.rsa.jobRiskHazard.delete.url;

      this.editable = this.$route.meta.editable;

      this.getDataList(); // 유해위험요인 grid

      // 유해위험요인 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002181'),
          dataField: 'priskHazardNm',
          width: '150px',
          align: 'left', // 유해위험요인 분류
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002179'),
          dataField: 'riskHazardNm',
          width: '400px',
          align: 'left', // 유해위험요인
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAddRow',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelRow',
        },
      ];
    },
    // 유해위험요인 grid
    getDataList() {
      this.$http.url = selectConfig.rsa.jobRiskHazard.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        jobStepId: this.jobStepId,
      };
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /** validation checking **/
    btnDelRow() {
      const selectedRow = this.YAuiGrid.getCheckedRowItemsAll();
      let gridData = this.YAuiGrid.getGridData();
      if (selectedRow.length === 0) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: 'M0000000102', // 항목을 선택해주세요.
          type: 'warning',
        });
        return;
      }
      window.getApp.$emit('CONFIRM', {
        title: '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.deleteUrl;
          this.$http.type = 'DELETE';
          this.$http.param = { data: selectedRow };
          this.$http.request((_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000000007', // '삭제되었습니다.',
              type: 'success',
            });
          });
          this.$_.forEach(selectedRow, (item) => {
            gridData = this.$_.reject(gridData, item);
          });
          this.YAuiGrid.setGridData(gridData);
          this.isDelete = false;
        },
      });
    },

    /** /validation checking **/

    /** Button Event **/
    // 신규등록 팝업
    btnAddRow() {
      this.popupOptions.target = () => import(`${'./jobRiskHazardPopup.vue'}`);
      this.popupOptions.title = 'L0000002184'; // 유해위험요인 선택
      this.popupOptions.visible = true;
      this.popupOptions.width = '450px';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        jobStepId: this.jobStepId,
        addSelectedRow: this.YAuiGrid.getGridData(),
      };

      this.popupOptions.closeCallback = this.closePopup;
    },

    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isDelete = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    // 신규등록 팝업 닫기
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    /** /Button Event **/
  },
};
</script>
