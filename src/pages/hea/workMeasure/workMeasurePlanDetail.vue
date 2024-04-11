<!--
  목적 : 보건 > 작업환경측정 > 작업환경측정 계획 상세/등록/수정/삭제
  Detail : 작업환경 측정 계획 상세/등록/수정/삭제 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 작업환경측정 계획 상세 -->
            <y-label
              label="L0000004354"
              icon="user-edit"
              color-class="cutstom-title-color"
            ></y-label>
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="btnAppr"
                title="L0000003418"
                color="black"
                @btnClicked="apprBtnClicked"
              />
              <!-- 저장 -->
              <y-btn
                v-if="btnSave"
                title="L0000002474"
                color="orange"
                @btnClicked="saveBtnClicked"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="btnDelete"
                title="L0000001495"
                color="red"
                @btnClicked="deleteBtnClicked"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>

        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                :editable="editable"
                :disabled="disabled"
                :required="true"
                :state="validateState('plantCd')"
                type="edit"
                name="plantCd"
                v-validate="'required'"
                v-model="workMeasurePlan.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 측정년도 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                :default="workMeasurePlan.year"
                :state="validateState('year')"
                type="year"
                label="L0000002931"
                name="year"
                v-validate="'required'"
                v-model="workMeasurePlan.year"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 분기 -->
              <y-select
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                :comboItems="halfYearCdItems"
                :state="validateState('halfYearCd')"
                ui="bootstrap"
                label="L0000001337"
                name="halfYearCd"
                itemText="codeNm"
                itemValue="code"
                v-validate="'required'"
                v-model="workMeasurePlan.halfYearCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 측정기간 -->
              <y-datepicker
                :width="8"
                :range="true"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                label="L0000002929"
                name="measPeriod"
                :default="workMeasurePlan.measPeriod"
                v-model="workMeasurePlan.measPeriod"
                v-validate="'required'"
                :state="validateState('measPeriod')"
              ></y-datepicker>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 측정기관 -->
              <y-text
                :width="10"
                :maxlength="50"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000002930"
                name="measAgency"
                v-model="workMeasurePlan.measAgency"
                v-validate="'required'"
                :state="validateState('measAgency')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 측정계획명 -->
              <y-text
                :width="10"
                :maxlength="50"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000002926"
                name="measPlanNm"
                v-model="workMeasurePlan.measPlanNm"
                v-validate="'required'"
                :state="validateState('measPlanNm')"
              ></y-text>
            </b-col>
          </b-row>

          <b-row>
            <b-col sm="12">
              <b-row>
                <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                  <div slot="buttonGroup" class="float-right mb-1">
                     추가 
                    <y-btn
                      v-if="btnAddRow"
                      title="L0000002892"
                      color="blue"
                      @btnClicked="addRowBtnClicked"
                    />
                    제거 
                    <y-btn
                      v-if="btnRemoveRow"
                      title="L0000002615"
                      color="red"
                      @btnClicked="removeRowBtnClicked"
                    />
                  </div>
                  대상 및 범위 목록 
                  <y-data-table
                    ref="dataTable"
                    label="L0000000917"
                    :headers="gridOptions.header"
                    :items="workMeasurePlan.workMeasurePlanTargets"
                    :height="gridOptions.height"
                    :editable="!disabled && editable"
                    v-model="selectedValue"
                  >
                    <el-table-column
                      type="selection"
                      slot="selection"
                      align="center"
                      width="55"
                    ></el-table-column>
                    부서 
                    <el-table-column
                      slot="expand"
                      align="center"
                      min-width="150px"
                      prop="deptCd"
                      :label="$comm.getLangSpecInfoLabel('L0000001287')"
                    >
                      <template slot-scope="scope">
                        <y-tree-dept
                          :width="12"
                          label=""
                          type="edit"
                          name="deptCd"
                          :editable="editable"
                          :disabled="disabled"
                          :plantCd="workMeasurePlan.plantCd"
                          v-model="scope.row.deptCd"
                        />
                      </template>
                    </el-table-column>
                   공정
                    <el-table-column
                      slot="expand"
                      align="center"
                      min-width="150px"
                      prop="processCd"
                      :label="$comm.getLangSpecInfoLabel('L0000000515')"
                    >
                      <template slot-scope="scope">
                        <y-tree-process
                          :width="12"
                          :editable="editable"
                          :disabled="disabled"
                          label=""
                          name="processCd"
                          type="edit"
                          :showDataMapping="true"
                          :plantCd="workMeasurePlan.plantCd"
                          :deptCd="scope.row.deptCd"
                          v-model="scope.row.processCd"
                        ></y-tree-process>
                      </template>
                    </el-table-column>
                     측정유해인자 
                    <el-table-column
                      slot="expand"
                      align="center"
                      min-width="250px"
                      prop="hazardNm"
                      :label="$comm.getLangSpecInfoLabel('L0000002950')"
                    >
                      <template slot-scope="scope">
                        <유해인자 추가 
                        <y-tag-structure
                          :width="12"
                          itemText="hazardNmKo"
                          itemValue="hazardCd"
                          label
                          :newLabelText="
                            $comm.getLangSpecInfoLabel('L0000002194')
                          "
                          :editable="editable"
                          :disabled="disabled"
                          :controleClose="true"
                          :name="'hazard_' + scope.$index"
                          v-model="scope.row.workMeasurePlanHazards"
                          @customNewTag="customNewTag(scope.row, scope.$index)"
                          @closeTag="
                            (val) => {
                              closeTag(val, scope.row);
                            }
                          "
                        />
                      </template>
                    </el-table-column>
                  </y-data-table>
                </b-col> -->
                <b-col sm="12" class="h100p">
                  <y-auigrid
                    ref="yAuiGrid"
                    :editable="true"
                    :name="gridOptions.name"
                    :headers="gridOptions.header"
                    :btns="gridOptions.btns"
                    :height="gridOptions.height"
                    :label="this.$comm.getLangSpecInfoLabel('L0000000917')"
                    :useExcelExport="false"
                    :enableCellMerge="true"
                    :enableSorting="true"
                    :showGridSetSave="true"
                    :useContextMenu="true"
                    :enableRightDownFocus="true"
                    :showGridCtrl="true"
                    :showRowCheckColumn="true"
                    @cellEditEnd="cellEditEndHandler"
                    @btnAddRowGrid="btnAddRowGrid"
                    @btnDelRowGrid="btnDelRowGrid"
                  />
                </b-col>
                <!-- 첨부파일 -->
                <el-divider content-position="left">{{
                  $comm.getLangSpecInfoLabel('L0000002843')
                }}</el-divider>
                <component
                  :is="attach"
                  v-if="attach"
                  :submitCheck="submitCheck"
                  :attachFileGrps="attachFileGrps"
                  :saveAttachFiles="saveAttachFiles"
                  @changeUploadFiles="changeUploadFiles"
                />
              </b-row>
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
import { v4 as uuidv4 } from 'uuid';
export default {
  name: 'work-measure-plan-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        workMeasPlanNo: null, // 작업환경측정 계획 번호
      },
    },
  },
  data() {
    return {
      workMeasurePlan: {
        workMeasPlanNo: null, // 작업환경측정 계획 번호
        plantCd: null, // 사업장코드
        year: null, // 측정년도
        halfYearCd: null, // 분기
        measAgency: null, // 측정기관
        measPeriod: [], // 측정기간
        measPlanNm: null, // 측정계획명
        workMeasStateCd: null, // 측정계획 단계코드
        createUserId: null, // 등록자ID
        updateUserId: null, // 수정자ID
        workMeasurePlanTargets: [], // 대상 및 범위
        deleteWorkMeasurePlanTargets: [], // (제거) 대상 및 범위
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: null,
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      gridOptions: {
        name: 'workMeasurePlanDetail',
        btns: [],
        header: [],
        data: [],
        height: '300',
      },
      YAuiGrid: null,
      halfYearCdItems: [], // 분기

      editable: false,
      disabled: false,
      submitCheck: false,
      attach: null, // 첨부파일 컴포넌트
      attachFileGrps: [], // 첨부파일 설정 그룹
      saveAttachFiles: [], // 첨부파일
      selectedValue: [], // 데이터테이블 선택
      clickedRowIdx: 0,
      hazardNmKoForGrid: '',
      hazardCdForGrid: '',
      searchIndexForDept: 0,
      searchIndexForProcess: 0,
      searchIndexForHazard: 0,
      searchIndexForHazardClear: 0,
    };
  },
  computed: {
    btnAppr() {
      return (
        this.editable && !this.disabled && this.workMeasurePlan.workMeasPlanNo
      );
    },
    btnSave() {
      return this.editable && !this.disabled;
    },
    btnDelete() {
      return (
        this.editable && !this.disabled && this.workMeasurePlan.workMeasPlanNo
      );
    },
    btnAddRow() {
      return this.editable && !this.disabled;
    },
    btnRemoveRow() {
      return (
        this.editable &&
        !this.disabled &&
        this.workMeasurePlan.workMeasurePlanTargets &&
        this.workMeasurePlan.workMeasurePlanTargets.length > 0
      );
    },
  },
  watch: {
    'workMeasurePlan.measPeriod'() {
      // 측정기간
      this.checkYear();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      if (this.popupParam.workMeasPlanNo) {
        this.workMeasurePlan.workMeasPlanNo = this.popupParam.workMeasPlanNo;
        this.getDetail();
      } else {
        this.workMeasurePlan.year = this.$comm.getThisYear();
        this.workMeasurePlan.measPeriod.push(
          this.$comm.getToday(),
          this.$comm.getToday()
        );
      }

      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps();
      this.setGridHeader();
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnAddRowGrid',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002615'),
          color: 'red',
          btnClicked: 'btnDelRowGrid',
          visible: true,
        },
      ];
      this.$comm.getComboItems('RSA_HALF_YEAR', false).then((_result) => {
        this.halfYearCdItems = _result;
      });
    },
    setGridHeader() {
      let myThis = this;
      this.gridOptions.header = [
        // {
        //   headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
        //   dataField: 'deptCd',
        //   width: '15%',
        // },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          editable: false,
          width: '14%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287') + '찾기',
          dataField: 'deptCd',
          width: this.popupParam.bizApprStepCd !== 'BAPSG' ? '10%' : '0%',
          editable: false,
          renderer: {
            type:
              this.popupParam.bizApprStepCd !== 'BAPSG'
                ? 'ButtonRenderer'
                : null,
            labelText: '찾기',
            onClick: function (rowIndex, columnIndex, value, item) {
              myThis.myDeptSearch(rowIndex.rowIndex);
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          editable: false,
          width: '14%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515') + '찾기',
          dataField: '',
          width: this.popupParam.bizApprStepCd !== 'BAPSG' ? '10%' : '0%',
          editable: false,
          renderer: {
            type:
              this.popupParam.bizApprStepCd !== 'BAPSG'
                ? 'ButtonRenderer'
                : null,
            labelText: '찾기',
            onClick: function (rowIndex, columnIndex, value, item) {
              myThis.myPorcessSearch(rowIndex);
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002950'),
          dataField: 'hazardNmKoForGrid',
          width: '15%',
          editable: false,
        },
        // {
        //   headerText: this.$comm.getLangSpecInfoLabel('L0000002950'),
        //   dataField: 'hazardCdForGrid',
        //   width: '15%',
        // },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002950') + ' 추가',
          dataField: '',
          width: this.popupParam.bizApprStepCd !== 'BAPSG' ? '10%' : '0%',
          editable: false,
          renderer: {
            type:
              this.popupParam.bizApprStepCd !== 'BAPSG'
                ? 'ButtonRenderer'
                : null,
            labelText: '추가',
            onClick: function (rowIndex, columnIndex, value, item) {
              myThis.myhazardCdPlus(rowIndex);
            },
          },
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002950') + ' 초기화',
          dataField: '',
          width: this.popupParam.bizApprStepCd !== 'BAPSG' ? '10%' : '0%',
          editable: false,
          renderer: {
            type:
              this.popupParam.bizApprStepCd !== 'BAPSG'
                ? 'ButtonRenderer'
                : null,
            labelText: '초기화',
            onClick: function (rowIndex, columnIndex, value, item) {
              myThis.myhazardCdClear(rowIndex);
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '15%',
        },
      ];
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
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.hea.workMeasurePlan.get.url,
        this.workMeasurePlan.workMeasPlanNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.measPeriod = [
            _result.data.measDtSta,
            _result.data.measDtEnd,
          ]; // 측정시작일, 측정종료일로 측정기간 생성
          this.workMeasurePlan = this.$_.clone(_result.data);
          this.$_.forEach(
            this.workMeasurePlan.workMeasurePlanTargets,
            (item) => {
              this.hazardNmKoForGrid = '';
              this.hazardCdForGrid = '';
              this.$_.forEach(item.workMeasurePlanHazards, (item) => {
                this.hazardNmKoForGrid += item.hazardNmKo + ',';
                this.hazardCdForGrid += item.hazardCd + ',';
              });
              item.hazardNmKoForGrid = this.hazardNmKoForGrid;
              item.hazardCdForGrid = this.hazardCdForGrid;
            }
          );
          this.YAuiGrid.setGridData(
            this.workMeasurePlan.workMeasurePlanTargets
          );
          if (!_result.data.workMeasurePlanTargets) {
            this.workMeasurePlan.workMeasurePlanTargets = [];
          }
          this.workMeasurePlan.deleteWorkMeasurePlanTargets = [];

          if (this.workMeasurePlan.workMeasStateCd !== 'WMS10') {
            this.disabled = true;
            this.gridOptions.btns[0].visible = false;
            this.gridOptions.btns[1].visible = false;
          }

          if (this.workMeasurePlan.bizApprStepCd === 'BAPSA') {
            this.disabled = true;
            this.gridOptions.btns[0].visible = true;
            this.gridOptions.btns[1].visible = true;
          }
          this.setAttachFileGrps();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellEditEndHandler() {
      // searchIndexForHazardClear
      this.workMeasurePlan.workMeasurePlanTargets = this.YAuiGrid.getGridData();
    },
    myhazardCdClear(item) {
      this.searchIndexForHazardClear = item.rowIndex;
      this.workMeasurePlan.workMeasurePlanTargets[
        this.searchIndexForHazardClear
      ].hazardNmKoForGrid = '';
      this.workMeasurePlan.workMeasurePlanTargets[
        this.searchIndexForHazardClear
      ].workMeasurePlanHazards = [];
      this.YAuiGrid.setGridData(this.workMeasurePlan.workMeasurePlanTargets);
    },
    myhazardCdPlus(item) {
      this.searchIndexForHazard = item.rowIndex;
      this.popupOptions.target = () =>
        import(`${'@/pages/hea/workMeasure/hazardSearch.vue'}`);
      this.popupOptions.title = 'L0000002950'; // 측정유해인자';
      this.popupOptions.param = {
        isMulti: true,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupHazard;
    },
    closePopupHazard(data) {
      // this.hazardNmKoForGrid
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data) {
        this.$_.forEach(data, (item) => {
          let existDept = this.$_.filter(
            this.workMeasurePlan.workMeasurePlanTargets[
              this.searchIndexForHazard
            ].workMeasurePlanHazards,
            (u) => u.hazardCd === item.item.hazardCd
          );
          if (!existDept.length) {
            this.workMeasurePlan.workMeasurePlanTargets[
              this.searchIndexForHazard
            ].hazardNmKoForGrid += item.item.hazardNmKo + ',';
            this.workMeasurePlan.workMeasurePlanTargets[
              this.searchIndexForHazard
            ].workMeasurePlanHazards.push(item.item);
          }
        });
        this.YAuiGrid.setGridData(this.workMeasurePlan.workMeasurePlanTargets);
      }
    },
    myPorcessSearch(item) {
      this.searchIndexForProcess = item.rowIndex;
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/process.vue'}`);
      this.popupOptions.title = 'L0000000529'; // 공정검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: this.workMeasurePlan.plantCd
          ? this.workMeasurePlan.plantCd
          : this.$store.getters.plantCd,
        deptCd: item.item.deptCd,
      };
      this.popupOptions.closeCallback = this.closeProcessPopup;
    },
    closeProcessPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.process) {
        this.workMeasurePlan.workMeasurePlanTargets[
          this.searchIndexForProcess
        ].processCd = data.process.processCd;
        this.workMeasurePlan.workMeasurePlanTargets[
          this.searchIndexForProcess
        ].processNm = data.process.processNm;
        this.YAuiGrid.setGridData(this.workMeasurePlan.workMeasurePlanTargets);
        this.cellEditEndHandler();
      }
    },
    myDeptSearch(item) {
      this.searchIndexForDept = item;
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.param = {
        plantCd: this.workMeasurePlan.plantCd
          ? this.workMeasurePlan.plantCd
          : this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000004627'; // 부서 검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '35%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchDept;
    },
    closePopupSearchDept(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.dept) {
        this.workMeasurePlan.workMeasurePlanTargets[
          this.searchIndexForDept
        ].deptCd = data.dept.deptCd;
        this.workMeasurePlan.workMeasurePlanTargets[
          this.searchIndexForDept
        ].deptNm = data.dept.deptNm;
        this.YAuiGrid.setGridData(this.workMeasurePlan.workMeasurePlanTargets);
        this.cellEditEndHandler();
      }
    },
    apprBtnClicked() {
      let promises = [
        {
          func: this.checkValidation,
          exceptionMessage: this.$comm.getLangSpecInfoLabel('M0000000005'),
        }, // '필수 입력값을 입력해 주세요.',
        { func: this.checkTargets },
        { func: this.checkYear },
        // { func: this.checkData },
        { func: this.confirmAppr },
        { func: this.saveData },
        { func: this.openAppr },
      ];
      this.$comm.orderedPromise(promises);
    },
    confirmAppr() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000767', // 결재요청 하기전 입력된 값을 저장합니다. 진행하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    openAppr() {
      return new Promise((_resolve, _reject) => {
        this.popupOptions.target = () =>
          import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
        this.popupOptions.title = 'L0000003418'; // 결재요청
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeApprPop;
        this.popupOptions.width = '80%';
        this.popupOptions.param = {
          apprBizCd: 'HE-WM-01',
          apprParams: {
            workMeasPlanNo: this.workMeasurePlan.workMeasPlanNo,
          },
        };
        _resolve(true);
      });
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.resultFlag) {
        this.workMeasurePlan.planApprRqstNo = data.apprRqstNo;
        this.disabled = true;
      }
      this.getDetail();
    },
    saveBtnClicked() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (!_result) {
            this.$popupRequired.check(
              'workMeasurePlanDetail',
              this.$data,
              this.errors
            );
          } else {
            let promises = [
              {
                func: this.checkValidation,
                exceptionMessage:
                  this.$comm.getLangSpecInfoLabel('M0000000005'),
              }, // '필수 입력값을 입력해 주세요.',
              { func: this.checkTargets },
              { func: this.checkYear },
              // { func: this.checkData },
              { func: this.confirmSave },
              {
                func: this.saveData,
                successMessage: this.$comm.getLangSpecInfoLabel('M0000000006'),
              }, // 저장되었습니다.
            ];
            this.$comm.orderedPromise(promises);
          }
        })
        .catch((e) => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    checkValidation() {
      return this.$validator.validateAll();
    },
    checkTargets() {
      return new Promise((_resolve, _reject) => {
        if (
          !this.workMeasurePlan.workMeasurePlanTargets ||
          this.workMeasurePlan.workMeasurePlanTargets.length < 1
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000080', // 대상 및 범위를 추가하세요.
            type: 'warning',
          });
          _resolve(false);
        }
        this.$_.forEach(
          this.workMeasurePlan.workMeasurePlanTargets,
          (_item) => {
            if (!_item.deptCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000471', // 대상 및 범위 목록에 부서를 선택하세요.
                type: 'warning',
              });
              _resolve(false);
            } else if (!_item.processCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000081', // 대상 및 범위 목록에 공정을 선택하세요.
                type: 'warning',
              });
              _resolve(false);
            } else if (!_item.workMeasurePlanHazards) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000472', // 대상 및 범위 목록에 측정유해인자를 선택하세요.
                type: 'warning',
              });
              _resolve(false);
            } else {
              _resolve(true);
            }
          }
        );
      });
    },
    checkYear() {
      return new Promise((_resolve, _reject) => {
        if (
          this.workMeasurePlan.measPeriod[0] &&
          this.workMeasurePlan.year &&
          (this.workMeasurePlan.measPeriod[0].substring(0, 4) !==
            this.workMeasurePlan.year ||
            this.workMeasurePlan.measPeriod[1].substring(0, 4) !==
              this.workMeasurePlan.year)
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message:
              'M0000001597' /* 측정년도와 측정일자의 년도가 같지 않습니다. */,
            type: 'warning',
          });
          _resolve(false);
        } else {
          _resolve(true);
        }
      });
    },
    // checkData() {
    //   return new Promise((_resolve, _reject) => {
    //     this.$http.url = selectConfig.hea.workMeasurePlan.check.url;
    //     this.$http.param = {
    //       plantCd: this.workMeasurePlan.plantCd,
    //       year: this.workMeasurePlan.year,
    //       halfYearCd: this.workMeasurePlan.halfYearCd,
    //       workMeasPlanNo: this.workMeasurePlan.workMeasPlanNo
    //         ? this.workMeasurePlan.workMeasPlanNo
    //         : '',
    //       measDt: this.workMeasurePlan.measDt,
    //     };
    //     this.$http.type = 'GET';
    //     this.$http.request(
    //       (_result) => {
    //         this.$_.forEach(_result.data, (_item) => {
    //           if (this.$_.parseInt(_item.cnt) > 0) {
    //             window.getApp.$emit('ALERT', {
    //               title: 'L0000003395', // '안내',
    //               message: 'M0000001039', // 해당 사업장에 입력된 측정년도, 측정분기에 세워진 계획이 있습니다.
    //               type: 'warning',
    //             });
    //             _resolve(false);
    //           } else {
    //             _resolve(true);
    //           }
    //         });
    //       },
    //       (_error) => {
    //         _reject(_error);
    //         window.getApp.$emit('APP_REQUEST_ERROR', _error);
    //       }
    //     );
    //   });
    // },
    confirmSave() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000011', // 저장하시겠습니까?
          type: 'info',
          // 확인 callback 함수
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
        if (this.workMeasurePlan.workMeasPlanNo) {
          // 수정
          this.workMeasurePlan.updateUserId = this.$store.getters.token;
          this.$http.url = transactionConfig.hea.workMeasurePlan.edit.url;
          this.$http.type = 'PUT';
        } else {
          // 신규등록
          this.workMeasurePlan.workMeasStateCd = 'WMS10';
          this.workMeasurePlan.createUserId = this.$store.getters.token;
          this.$http.url = transactionConfig.hea.workMeasurePlan.insert.url;
          this.$http.type = 'POST';
        }
        this.workMeasurePlan.measDtSta = this.workMeasurePlan.measPeriod[0];
        this.workMeasurePlan.measDtEnd = this.workMeasurePlan.measPeriod[1];

        this.$http.param = this.workMeasurePlan;
        this.$http.request(
          (_result) => {
            if (!this.workMeasurePlan.workMeasPlanNo) {
              this.workMeasurePlan.workMeasPlanNo = this.$_.clone(_result.data);
            }
            this.getDetail();
            this.saveAttach();
            _resolve(true);
          },
          (_error) => {
            _reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    saveAttach() {
      // 첨부파일 task_key 세팅
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = String(this.workMeasurePlan.workMeasPlanNo);
      });

      // 첨부파일
      if (this.saveAttachFiles.length > 0) {
        // 저장할 데이터가 있는 경우
        this.submitCheck = !this.submitCheck;
      }
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.attachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.attachFileGrps[index].uploadTempFiles = data;
        let saveIndex = this.$_.findIndex(this.saveAttachFiles, {
          taskClassNm: data.taskClassNm,
        });
        if (saveIndex > -1) {
          this.saveAttachFiles[saveIndex] = this.$_.clone(
            this.attachFileGrps[index]
          );
        } else {
          this.saveAttachFiles.push(this.$_.clone(this.attachFileGrps[index]));
        }
      }
    },
    setAttachFileGrps() {
      let taskKey = this.workMeasurePlan.workMeasPlanNo
        ? String(this.workMeasurePlan.workMeasPlanNo)
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000004355', // 파일첨부
          listType: 'text',
          drag: !this.disabled && this.editable,
          showFileSearch: false,
          editable: !this.disabled && this.editable,
          limit: 5,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'WORK_MEAS_PLAN',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    deleteBtnClicked() {
      let promises = [
        { func: this.confirmDelete },
        {
          func: this.deleteData,
          successMessage: this.$comm.getLangSpecInfoLabel('M0000000007'),
        }, // 삭제되었습니다.
      ];
      this.$comm.orderedPromise(promises);
    },
    confirmDelete() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000012', // 삭제하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    deleteData() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = transactionConfig.hea.workMeasurePlan.delete.url;
        this.$http.type = 'DELETE';
        this.$http.param = { data: this.workMeasurePlan };
        this.$http.request(
          (_result) => {
            _resolve(true);
            this.btnClosePopup();
          },
          (_error) => {
            _reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    btnAddRowGrid() {
      this.workMeasurePlan.workMeasurePlanTargets.splice(0, 0, {
        rowId: uuidv4(),
        workMeasPlanTargetNo: 0,
        workMeasPlanNo: this.workMeasurePlan.workMeasPlanNo,
        workMeasurePlanHazards: [],
        processCd: null,
        processNm: null,
        deptCd: this.$store.getters.deptCd,
        deptNm: null,
        remark: null,
      });
      this.YAuiGrid.setGridData(this.workMeasurePlan.workMeasurePlanTargets);
    },
    addRowBtnClicked() {
      this.workMeasurePlan.workMeasurePlanTargets.splice(0, 0, {
        rowId: uuidv4(),
        workMeasPlanTargetNo: 0,
        workMeasPlanNo: this.workMeasurePlan.workMeasPlanNo,
        workMeasurePlanHazards: [],
        processCd: null,
        processNm: null,
        deptCd: this.$store.getters.deptCd,
        deptNm: null,
        remark: null,
      });
    },
    btnDelRowGrid() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();

      if (!checkingData || checkingData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.$_.forEach(checkingData, (_item) => {
          this.workMeasurePlan.workMeasurePlanTargets = this.$_.reject(
            this.workMeasurePlan.workMeasurePlanTargets,
            _item
          );

          if (_item.workMeasPlanTargetNo > 0) {
            // 저장된 데이터의 경우에만 삭제할 배열에 쌓아준다.
            if (
              this.$_.findIndex(
                this.workMeasurePlan.deleteWorkMeasurePlanTargets,
                { workMeasPlanTargetNo: _item.workMeasPlanTargetNo } === -1
              )
            ) {
              this.workMeasurePlan.deleteWorkMeasurePlanTargets.push(_item);
            }
          }
        });
        let gridData = this.YAuiGrid.getGridData();
        this.$_.forEach(checkingData, (item) => {
          gridData = this.$_.reject(gridData, item);
        });
        this.YAuiGrid.setGridData(gridData);
      }
    },
    removeRowBtnClicked() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.$_.forEach(this.selectedValue, (_item) => {
          this.workMeasurePlan.workMeasurePlanTargets = this.$_.reject(
            this.workMeasurePlan.workMeasurePlanTargets,
            _item
          );

          if (_item.workMeasPlanTargetNo > 0) {
            // 저장된 데이터의 경우에만 삭제할 배열에 쌓아준다.
            if (
              this.$_.findIndex(
                this.workMeasurePlan.deleteWorkMeasurePlanTargets,
                { workMeasPlanTargetNo: _item.workMeasPlanTargetNo } === -1
              )
            ) {
              this.workMeasurePlan.deleteWorkMeasurePlanTargets.push(_item);
            }
          }
        });
      }
    },
    customNewTag(data, index) {
      this.popupOptions.target = () =>
        import(`${'@/pages/hea/workMeasure/hazardSearch.vue'}`);
      this.popupOptions.title = 'L0000002950'; // 측정유해인자';
      this.popupOptions.param = {
        isMulti: true,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
      this.clickedRowIdx = index;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE') {
        let workMeasurePlanHazards =
          this.workMeasurePlan.workMeasurePlanTargets[this.clickedRowIdx]
            .workMeasurePlanHazards;
        if (!workMeasurePlanHazards) {
          workMeasurePlanHazards = [];
        }
        this.$_.forEach(workMeasurePlanHazards, (item) => {
          data = this.$_.reject(data, { hazardCd: item.hazardCd });
        });

        this.$_.forEach(data, (item) => {
          item.createUserId = this.$store.getters.token;
          this.workMeasurePlan.workMeasurePlanTargets[
            this.clickedRowIdx
          ].workMeasurePlanHazards.push(item);
        });
      }
    },
    closeTag(tag, row) {
      row.workMeasurePlanHazards = this.$_.reject(row.workMeasurePlanHazards, {
        hazardCd: tag.code,
      });
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
