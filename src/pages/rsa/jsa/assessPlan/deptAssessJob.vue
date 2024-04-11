<!--
  목적 : 평가계획수립 - 평가대상 작업
  Detail : 
   - 평가계획별 대상 작업 지정 화면
   - JSA의 경우에도 대상작업를 지정하며 평가시에는 대상작업별 작업단계를 평가한다.
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <!-- 평가대상공정 -->
    <!-- <y-search-box v-if="!authDuringAppr && editableInput" :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="processCdItems"
            itemText="processNm"
            itemValue="processCd"
            ui="bootstrap"
            type="search"
            label="L0000003077"
            name="processCd"
            v-model="searchParam.processCd"
          />
        </b-col>
      </b-row>
    </y-search-box> -->

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0"> -->
    <!-- <div slot="buttonGroup" class="float-right mb-1"> -->
    <!-- 대상여부 지정 -->
    <!-- <y-btn
              v-if="editableInput && updateModeParent && editable && !authDuringAppr"
              :action-url="insertUrl"
              :param="saveData"
              :is-submit="isInsert"
              :title="$comm.getLangSpecInfoLabel('L0000004313')"
              color="orange"
              action-type="POST"
              beforeSubmit="beforeSubmit"
              @beforeSubmit="beforeSubmit"
              @btnClicked="btnSaveClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            /> -->
    <!-- 검색 -->
    <!-- <y-btn v-if="!authDuringAppr && editableInput" title="L0000000327" color="green" @btnClicked="btnSearchClickedCallback" /> -->
    <!-- </div> -->
    <!-- 평가대상작업 목록 -->
    <!-- <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :print="true"
            :useRownum="false"
            :editable="editable && !authDuringAppr"
            checkKey="jobId"
            v-model="selectedValue"
            label="L0000003080"
            @selectedRow="selectedRow"
            :popMode="true"
          >
            <el-table-column
              v-if="!authDuringAppr && editableInput"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003080')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showRowCheckColumn="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @selectedRow="selectedRow"
          @itemInsert="itemInsert"
        />
      </b-col>
    </b-row>
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
           작업단계 목록 
          <y-data-table
            ref="dataTableJobStep"
            :height="gridOptions.jobStephHeight"
            :headers="gridOptions.jobStepHeader"
            :items="gridOptions.jobStepData"
            :span-options="gridOptions.merge"
            :useRownum="false"
            label="L0000002376"
            :popMode="true"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="auiGrid"
          :name="jobGridOptions.name"
          :headers="jobGridOptions.header"
          :btns="jobGridOptions.btns"
          :height="jobGridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002376')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showRowCheckColumn="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
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
  name: 'y-dept-assess-job',
  props: {
    authDuringAppr: false,
    assessPlanNo: 0, // 평가계획 번호
    editableInput: true, // 수정
    tabIndex: '',
    updateModeParent: false,
  },
  data: () => ({
    gridOptions: {
      name: 'deptAssessJob',
      btns: [],
      header: [],
      data: [],
      height: '300',
      jobStepHeader: [],
      jobStepData: [],
      jobStepHeight: '300',
      merge: [],
    },
    jobGridOptions: {
      name: 'deptAssessJobGrid',
      btns: [],
      header: [],
      data: [],
      height: '300',
    },
    YAuiGrid: null,
    AuiGrid: null,
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    searchParam: {
      deptCd: null, // 평가대상부서
      processCd: null, // 평가대상공정
    },
    editable: false,
    insertable: false,
    isInsert: false,
    processCdItems: [],
    selectedValue: [],
    saveData: {
      assessPlanNo: 0,
      jobs: [],
    },
    checkItemData: [],
    insertUrl: '',
  }),
  watch: {
    tabIndex: function (newValue, oldValue) {
      this.getProcessCdItems(); // 평가대상공정 조회
      this.getList(); // 평가대상작업 조회
    },
    'searchParam.processCd': function (newValue, oldValue) {
      this.getList(); // 평가대상작업 조회
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.AuiGrid = this.$refs.auiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.insertUrl = transactionConfig.rsa.deptAssessJob.insert.url;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000933'),
          dataField: 'targetYnNm',
          width: '10%',
          editable: false,
        }, // 대상여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '10%',
          editable: false,
        }, // 부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: '10%',
          editable: false,
        }, // 공정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002423'),
          dataField: 'jobCd',
          width: '10%',
          editable: false,
        }, // 작업코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'jobNm',
          width: '40%',
          editable: false,
        }, // 작업명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003091'),
          dataField: 'assessDate',
          width: '20%',
          editable: false,
        }, // 평가일
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004313'),
          color: 'orange',
          btnClicked: 'itemInsert',
          visible: true,
        },
      ];
      // 작업단계 grid 헤더 설정
      this.jobGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001707'),
          dataField: 'jobStepNo',
          width: '10%',
          editable: false,
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002382'),
          dataField: 'jobStepNm',
          width: '25%',
          editable: false,
          style: 'left-align',
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002181'),
          dataField: 'priskHazardNm',
          width: '25%',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002179'),
          dataField: 'riskHazardNm',
          width: '40%',
          editable: false,
        },
      ];
      this.gridOptions.merge = [];
      this.gridOptions.merge.push({ index: 0, field: 'jobStepNo' });
      this.gridOptions.merge.push({ index: 1, field: 'jobStepNo' });
      this.getProcessCdItems(); // 평가대상공정 조회
      this.getList(); // 평가대상작업 조회
    },
    /**
     * 평가대상공정 조회
     */
    getProcessCdItems() {
      this.$http.url = selectConfig.rsa.riskAssessDept.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        assessPlanNo: this.assessPlanNo,
        processCd: this.processCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            processCd: null,
            processNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          });
          this.processCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            _error

            // 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    itemInsert() {
      let checkInsertData = this.YAuiGrid.getCheckedRowItems();
      if (!checkInsertData || checkInsertData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000068',
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.selectedValue = [];
      this.$_.forEach(checkInsertData, (item) => {
        this.selectedValue.push(item.item);
      });

      this.beforeSubmit();
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSubmit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000011', // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.saveData.assessPlanNo = this.assessPlanNo;
                this.saveData.jobs = [];
                this.$_.forEach(this.selectedValue, (item) => {
                  this.saveData.jobs.push({
                    deptCd: item.deptCd,
                    processCd: item.processCd,
                    jobId: item.jobId,
                    jobCd: item.jobCd,
                    createUserId: this.$store.getters.token,
                    updateUserId: this.$store.getters.token,
                  });
                });
                this.$http.url = this.insertUrl;
                this.$http.type = 'POST';
                this.$http.param = this.saveData;
                this.$http.request(
                  (__result) => {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // '안내',
                      message: 'M0000000006', // '저장되었습니다.',
                      type: 'success',
                    });
                    this.getList();
                  },
                  (_error) => {
                    window.getApp.$emit('APP_REQUEST_ERROR', _error);
                  }
                );
              },
              // 취소 callback 함수
              cancelCallback: () => {
                this.isInsert = false;
              },
            });
          } else if (!_result) {
            // window.alert("필수입력값을 입력해주세요");
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000005', // 필수입력
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
          this.isInsert = false;
        });
    },
    // 그리드 row click 이벤트
    selectedRow(data) {
      this.$http.url = selectConfig.rsa.jobStep.hazard.url;
      this.$http.type = 'GET';
      this.$http.param = {
        jobId: data.jobId,
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.AuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 평가대상작업 목록 조회 **/
    getList() {
      if (!this.assessPlanNo) return;
      this.$http.url = selectConfig.rsa.deptAssessJob.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        assessPlanNo: this.assessPlanNo,
        processCd: this.searchParam.processCd,
        assessTypeNo: 2,
      };
      this.$http.request(
        (_result) => {
          if (
            this.editableInput &&
            this.updateModeParent &&
            this.editable &&
            !this.authDuringAppr
          ) {
            this.gridOptions.btns[0].visible = true;
          } else {
            this.gridOptions.btns[0].visible = false;
          }
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));

          // 평가대상작업  목록 중 대상여부 col 중 대상 체크
          var Indexes = this.$_.keys(
            this.$_.pickBy(_result.data, {
              targetYnNm: this.$comm.getLangSpecInfoLabel('L0000003427'),
            }) // 대상
          );
          var i = 0;
          if (Indexes) {
            this.checkItemData = [];
            for (; i < Indexes.length; i++) {
              this.checkItemData.push(this.gridOptions.data[Indexes[i]]);
            }
          }
          this.$emit(
            'apprCheck',
            !Indexes || Indexes.length === 0 ? 0 : Indexes.length
          );

          // if (_result.data && _result.data.length > 0) {
          //   this.selectedRow(this.gridOptions.data[0]);
          //   this.$refs.dataTable.setCurrentRow(this.gridOptions.data[0]);
          // }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** button 관련 이벤트 **/
    /**
     * 평가대상작업 목록 조회
     *  수정 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      this.getList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
    },
    /**
     * 데이터 및 이벤트 초기화, 수정버튼 안보여지도록 처리
     *  초기화 버튼 callback
     */
    btnClearClickedCallback() {
      this.insertable = false;
      this.selectedValue = [];
      Object.assign(this.$data.saveData, this.$options.data().saveData);
      this.$validator.reset();
    },
    /**
     * 수정 버튼 안보여지도록 처리 및 isSubmit false 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.insertable = false;
      this.isInsert = false;
      this.btnClearClickedCallback();
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchClickedCallback() {
      this.getList();
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
