<!--
  목적 : 시설점검일정관리 - 점검일정 등록
  Detail : 시설점검일정 등록/수정 화면

  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 시설점검일정 -->
            <y-label
              label="L0000004670"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  editable &&
                  !popupParam.apprFlag &&
                  !updateMode &&
                  !inserabled &&
                  !disabled
                "
                title="L0000003418"
                color="black"
                :action-url="saveUrl"
                :param="facilityInspectionMaster"
                :is-submit="isAppr"
                :action-type="actionType"
                beforeSubmit="beforeAppr"
                @beforeAppr="beforeAppr"
                @btnClicked="btnAppr"
              />
              <!-- 저장 -->
              <y-btn
                v-if="
                  editable &&
                  !disabled &&
                  inserabled &&
                  !updateMode &&
                  !popupParam.apprFlag
                "
                :action-url="insertUrl"
                :param="facilityInspectionMaster"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="
                  editable &&
                  !disabled &&
                  !inserabled &&
                  !updateMode &&
                  !popupParam.apprFlag
                "
                :action-url="editUrl"
                :param="facilityInspectionMaster"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="
                  editable &&
                  !disabled &&
                  !inserabled &&
                  deleteCheck &&
                  updateMode
                "
                color="red"
                title="L0000001495"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn
                v-if="!popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="closePopup"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :editable="editable"
                :required="true"
                :disabled="!inserabled"
                name="plantCd"
                v-model="facilityInspectionMaster.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검종류 -->
              <y-select
                :width="8"
                :comboItems="comboCheckTypeItems"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="edit"
                name="comFacilityCheckCd"
                label="L0000002576"
                v-model="facilityInspectionMaster.comFacilityCheckCd"
                v-validate="'required'"
                :state="validateState('comFacilityCheckCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 등록자 -->
                  <y-label label="L0000000976" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label
                    :label="facilityInspectionMaster.createUserNm"
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-label label="L0000000973" />
                  <!-- 등록일 -->
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label
                    :label="facilityInspectionMaster.createDt"
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 일정명 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                ui="bootstrap"
                name="comFacilityCheckTitle"
                label="L0000002279"
                v-model="facilityInspectionMaster.comFacilityCheckTitle"
                v-validate="'required'"
                :state="validateState('comFacilityCheckTitle')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- <y-tree-dept
                type="edit"
                label="점검부서"
                :required="true"
                v-model="facilityInspectionMaster.deptCd"
                v-validate="'required'"
              />-->
              <!-- <y-tree-dept
                :required="true"
                :editable="editable"
                name="점검부서"
                v-model="facilityInspectionMaster.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />-->
              <!-- 점검부서 -->
              <y-tree-dept
                :editable="editable"
                :required="true"
                :disabled="disabled"
                :plantCd="facilityInspectionMaster.plantCd"
                label="L0000002578"
                name="deptCd"
                v-model="facilityInspectionMaster.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
          </b-row>

          <b-row v-if="!disabled" class="mt-3">
            <b-col sm="12">
              <b-col sm="12" class="px-0">
                <!-- 점검시설 목록 -->
                <y-auigrid
                  ref="yAuiGridFacility"
                  v-model="this.YAuiGridFacility"
                  :editable="editable"
                  :name="facilityGridOptions.name"
                  :headers="facilityGridOptions.header"
                  :btns="facilityGridOptions.btns"
                  :height="facilityGridOptions.height"
                  :items="facilityGridOptions.data"
                  :label="this.$comm.getLangSpecInfoLabel('L0000002559')"
                  :useExcelExport="false"
                  :showRowCheckColumn="true"
                  @openPopup="openPopup"
                  @btnDeleteFacilityClicked="btnDeleteFacilityClicked"
                />
              </b-col>
            </b-col>
          </b-row>

          <b-row v-if="!disabled" ref="searchBox" class="mt-3">
            <b-col sm="12">
              <b-card
                header-class="default-card"
                body-class="default-body-card"
                class="py-0"
              >
                <div slot="header">
                  <!-- 생성 -->
                  <y-label label="L0000001546" />
                  <div class="float-right">
                    <!-- 점검 생성 -->
                    <y-btn
                      v-if="!disabled && editable"
                      title="L0000004292"
                      color="green"
                      @btnClicked="btnSearchCheckYmdClicked(true)"
                      @btnClickedErrorCallback="btnClickedErrorCallback"
                    />
                  </div>
                </div>
                <b-row>
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                    <!-- 점검주기 -->
                    <y-select
                      :width="8"
                      :disabled="disabled"
                      :editable="editable"
                      :comboItems="comboCycleItems"
                      itemText="codeNm"
                      itemValue="code"
                      ui="bootstrap"
                      name="comFacilityCheckPerd"
                      label="L0000002579"
                      v-model="facilityInspectionMaster.comFacilityCheckPerd"
                    ></y-select>
                  </b-col>
                  <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                    <!-- 점검기간 -->
                    <y-datepicker
                      :width="8"
                      :disabled="disabled"
                      :editable="editable"
                      :range="true"
                      label="L0000002545"
                      name="period"
                      v-model="facilityInspectionMaster.period"
                    ></y-datepicker>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>

          <!-- 점검기간 목록 테이블 -->
          <b-row v-if="!disabled" class="mt-3">
            <b-col sm="12">
              <b-col sm="12" class="px-0">
                <!-- 점검기간 목록 -->
                <y-auigrid
                  ref="yAuiGrid"
                  v-model="this.YAuiGrid"
                  :editable="editable"
                  :name="gridOptions.name"
                  :headers="gridOptions.header"
                  :btns="gridOptions.btns"
                  :height="gridOptions.height"
                  :items="gridOptions.data"
                  :label="this.$comm.getLangSpecInfoLabel('L0000002546')"
                  :useExcelExport="false"
                  :showRowCheckColumn="true"
                  @LineDelete="LineDelete"
                />
              </b-col>
            </b-col>
          </b-row>

          <!-- 점검일정 목록 테이블 -->
          <b-row v-else class="mt-3">
            <b-col sm="12">
              <b-col sm="12" class="px-0">
                <!-- <y-data-table
                  :height="scheduleGridOptions.height"
                  :headers="scheduleGridOptions.header"
                  :items="scheduleGridOptions.data"
                  :editable="false"
                  :useRownum="false"
                  label="L0000002571"
                  ref="scheduleDataTable"
                  :popMode="true"
                ></y-data-table> -->
                <y-auigrid
                  ref="yAuiGridSchedule"
                  v-model="this.YAuiGridSchedule"
                  :editable="editable"
                  :name="scheduleGridOptions.name"
                  :headers="scheduleGridOptions.header"
                  :btns="scheduleGridOptions.btns"
                  :height="scheduleGridOptions.height"
                  :items="scheduleGridOptions.data"
                  :label="this.$comm.getLangSpecInfoLabel('L0000002571')"
                  :useExcelExport="false"
                  :popMode="true"
                />
              </b-col>
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
  name: 'facility-inspection-schedule-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        comFacilityCheckNo: 0, // 시설점검마스터번호
        stepStatus: '',
        apprRqstCd: '',
        cnt: 0,
        apprFlag: false,
        apprRqstNo: 0,
      },
    },
  },
  data: () => ({
    // facilityCheckMaster
    facilityInspectionMaster: {
      comFacilityCheckNo: 0, // 시설점검마스터번호
      comFacilityCheckScheduleNo: 0, // 점검 일정번호
      plantCd: '', // 사업장 코드
      deptCd: null, // 점검 부서
      comFacilityCheckCd: null, // 점검종류번호
      comFacilityCheckTitle: '', // 점검명
      comFacilityCheckPerd: 'FCC1M', // 점검주기
      period: [], // 점검기간
      comFacilityCheckPlanSymd: '', // 시설점검계획시작일
      comFacilityCheckPlanEymd: '', // 시설점검계획종료일
      updateUserId: '',
      createUserId: '',
      createUserNm: '',
      createDt: '',
      deleteData: [],
      facilityInspectionSchedules: [], // 일정
      noPlanYn: null,
    },
    facilityGridOptions: {
      header: [],
      data: [],
      height: '350',
    },
    selectValue: [],
    gridOptions: {
      header: [],
      data: [],
      height: '350',
    },
    scheduleGridOptions: {
      header: [],
      data: [],
      height: '350',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: null,
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    checkYmdValue: [], // 예정일
    checkItemTempData: [], // ?
    checkItemData: [], // 점검 목록 기
    deleteCheck: false,
    updateMode: false,
    editable: false,
    inserabled: true,
    disabled: false,
    isInsert: false,
    isEdit: false,
    isAppr: false,
    actionType: 'POST',
    comboCheckTypeItems: [], // 점검종류
    comboCycleItems: [], // 점검주기
    searchDetailUrl: '',
    searchScheduleUrl: '',
    saveUrl: '',
    insertUrl: '',
    editUrl: '',
    deleteUrl: '',
    comFacilityCheckTypeNm: '',
    onAppr: '',
    createDept: {
      deptCd: '',
      deptNm: '',
    },
    YAuiGridSchedule: null,
    YAuiGrid: null,
    YAuiGridFacility: null,
  }),
  watch: {
    // 점검기간 수정시 생성된 점검예정일의 지정 가능한 날짜의 한계를 바꾼다.
    'facilityInspectionMaster.period': {
      handler: function (val, oldVal) {
        if (
          this.facilityInspectionMaster.period &&
          this.facilityInspectionMaster.period.length === 2
        ) {
          if (
            !this.facilityInspectionMaster.period[0] ||
            !this.facilityInspectionMaster.period[1] ||
            this.facilityInspectionMaster.period[0] === 'Invalid date' ||
            this.facilityInspectionMaster.period[1] === 'Invalid date'
          ) {
            return;
          }
          this.setPlanDateLimit();
        }
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
  mounted() {
    this.YAuiGridSchedule = this.$refs.yAuiGridSchedule;
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.YAuiGridFacility = this.$refs.yAuiGridFacility;

    this.getScheduleList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.disabled = this.popupParam.cnt > 0;

      this.editCheck = true;
      this.deleteCheck = true;
      this.confirmCheck = true;
      if (this.popupParam.apprRqstCd === 'BAPSA') {
        this.updateMode = true;
        this.deleteable = true;
        this.disabled = true;
        this.editCheck = false;
        this.deleteCheck = false;
        this.confirmCheck = false;
      } else if (this.popupParam.apprRqstCd === 'BAPSD') {
        this.updateMode = true;
        this.disabled = true;
        this.editCheck = false;
        this.deleteCheck = false;
        this.confirmCheck = false;
      } else {
        this.updateMode = false;
        this.deleteable = false;
      }
      // URL setting
      this.searchDetailUrl =
        selectConfig.saf.facilityInspection.schedules.get.url;
      this.searchScheduleUrl =
        selectConfig.saf.facilityInspection.facilityInspectionPlan.list.url; // 해야함
      this.insertUrl =
        transactionConfig.saf.facilityInspection.schedules.insert.url;
      this.editUrl =
        transactionConfig.saf.facilityInspection.schedules.edit.url;
      this.deleteUrl =
        transactionConfig.saf.facilityInspection.schedules.delete.url; // 해야함
      this.getComboItems('SAF_FACILITY_CHECK'); // 점검종류
      this.getComboItems('SAF_FAC_CHK_CYE'); // 점검주기

      this.facilityGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001747'),
          dataField: 'comFacilityTypeNm',
          width: '33%',
        }, // 시설유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001767'), // 시설코드
          dataField: 'facilityCd',
          width: '33%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001743'),
          dataField: 'facilityNm',
          width: '34%',
        }, // 시설명
      ];
      this.facilityGridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'openPopup',
          visible: !this.disabled && this.editable,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDeleteFacilityClicked',
          btnClickedError: 'btnClickedErrorCallback',
          visible: !this.disabled && this.editable,
        }, // 삭제
      ];
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001747'),
          dataField: 'comFacilityTypeNm',
          width: '14%',
          style: 'center-align',
        }, // 시설유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001767'),
          dataField: 'facilityCd',
          width: '14%',
          style: 'center-align',
        }, // 시설코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001743'),
          dataField: 'facilityNm',
          width: '16%',
          style: 'left-align',
        }, // 시설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002549'), // 점검대상부서
          dataField: 'tgtDeptNm',
          width: '14%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004852'),
          dataField: 'createDept',
          width: '14%',
          style: 'center-align',
          type: 'deptsearch',
        }, // 점검수행부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002564'), // 점검예정일
          dataField: 'facilityCheckSchYmd',
          width: '14%',
          style: 'center-align',
          type: 'datepicker',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002551'), // 점검명
          dataField: 'facilityCheckNm',
          width: '14%',
          style: 'left-align',
          type: 'text',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003225'),
          color: 'orange',
          btnClicked: 'LineDelete',
        }, //   행삭제
      ];
      this.scheduleGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'), // 진행상태
          dataField: 'checkStepNm',
          width: '100',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001747'), // 시설유형
          dataField: 'comFacilityTypeNm',
          width: '110',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001767'), // 시설코드
          dataField: 'facilityCd',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001743'),
          dataField: 'facilityNm',
          width: '180',
        }, // 시설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002564'), // 점검예정일
          dataField: 'facilityCheckSchYmd',
          width: '150',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002551'), // 점검명
          dataField: 'facilityCheckNm',
          width: '200',
        },
      ];

      // 결재상태일때
      if (this.popupParam.apprFlag) {
        this.editCheck = true;
        this.deleteCheck = false;
        this.updateMode = false;
      }
      // 상세조회
      this.getScheduleDetail();
    },
    apprSave() {
      return new Promise((resolve) => {
        this.onAppr = true;
        this.beforeSubmitCheck().then((result) => {
          this.onAppr = false;
          this.$http.url = this.editUrl;
          this.$http.param = this.facilityInspectionMaster;
          this.$http.type = 'PUT';
          this.$http.request(
            (_result) => {
              this.popupParam.comFacilityCheckNo = _result.data;
              this.facilityInspectionMaster.comFacilityCheckNo = _result.data;
              this.isAppr = false;
              this.isEdit = false;
              this.getScheduleDetail();
              resolve(true);
            },
            (_error) => {
              resolve(false);
            }
          );
        });
      });
    },
    /**
     * 공통 마스터 정보 조회 (점검종류, 점검주기)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'SAF_FACILITY_CHECK') {
            this.comboCheckTypeItems = this.$_.clone(_result.data);
            this.comboCheckTypeItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          } else if (codeGroupCd === 'SAF_FAC_CHK_CYE') {
            this.comboCycleItems = this.$_.clone(_result.data);
            this.comboCycleItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 상세 조회
    getScheduleDetail() {
      if (
        !this.popupParam.comFacilityCheckNo ||
        this.popupParam.comFacilityCheckNo === 0
      ) {
        // 기간 Setting
        let from = this.$comm.getToday();
        let to = this.$comm.getCalculatedDate(
          from,
          '2m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        this.facilityInspectionMaster.period = [from, to];

        // 등록자 setting
        this.facilityInspectionMaster.createUserNm = this.$store.getters.name;
        this.facilityInspectionMaster.createDt = this.$comm.getToday();

        this.inserabled = true;
        this.disabled = false;
      } else {
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.popupParam.comFacilityCheckNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.facilityInspectionMaster = this.$_.clone(_result.data);

            this.facilityInspectionMaster.period = [
              this.facilityInspectionMaster.comFacilityCheckPlanSymd,
              this.facilityInspectionMaster.comFacilityCheckPlanEymd,
            ];

            this.inserabled = false;

            this.gridOptions.header.splice(0, 0, {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002779'), // 진행상태
              dataField: 'checkStepNm',
              width: '10%',
              style: 'center-align',
            });

            if (this.disabled) {
              this.scheduleGridOptions.data = this.$_.clone(
                _result.data.facilityInspectionSchedules
              );
            } else {
              if (
                _result.data.facilityInspectionSchedules &&
                _result.data.facilityInspectionSchedules.length > 0
              ) {
                this.facilityGridOptions.data = this.$_.uniqBy(
                  _result.data.facilityInspectionSchedules,
                  'facilityCd'
                );
              }

              this.btnSearchCheckYmdClicked(false, 'detail');
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    getScheduleList() {
      this.$http.url = this.searchScheduleUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        comFacilityCheckNo: this.popupParam.comFacilityCheckNo,
      };
      this.$http.request(
        (_result) => {
          this.scheduleGridOptions.data = this.$_.clone(_result.data);
          // this.YAuiGridSchedule.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setPlanDateLimit() {
      let index = this.$_.findIndex(this.gridOptions.header, {
        dataField: 'facilityCheckSchYmd',
      });
      this.gridOptions.header.splice(index, 1);
      this.gridOptions.header.splice(index, 0, {
        headerText: this.$comm.getLangSpecInfoLabel('L0000002564'), // 점검예정일
        dataField: 'facilityCheckSchYmd',
        width: '20%',
        style: 'center-align',
        type: 'datepicker',
        start: this.facilityInspectionMaster.period[0],
        end: this.facilityInspectionMaster.period[1],
      });
    },
    /** 점검기간  목록 조회 **/
    btnSearchCheckYmdClicked(isClicked, gubun) {
      // 점검 생성 버튼을 누른 경우에 점검기간 목록에 데이터가 있는 경우
      // 사용자에게 confirm을 받고 기존에 데이터가 날아갈 수 있다 알림
      if (
        isClicked &&
        this.gridOptions.data &&
        this.gridOptions.data.length > 0
      ) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000745', // 입력된 점검기간 목록의 데이터가 지워지고 점검기간에 따른 점검주기별 점검기간 데이터가 새로 생성됩니다.\r\n진행하시겠습니까?
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            this.setSchedule(isClicked, gubun);
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      } else {
        this.setSchedule(isClicked, gubun);
      }
    },
    setSchedule(isClicked, gubun) {
      if (!this.facilityInspectionMaster.comFacilityCheckCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000712', // 점검종류를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else if (this.facilityGridOptions.data.length <= 0) {
        this.$comm.alertWarning('점검시설을 추가해주세요.');
        return;
      } else if (!this.facilityInspectionMaster.comFacilityCheckPerd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000061', // 점검주기를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else if (
        !this.facilityInspectionMaster.period ||
        this.facilityInspectionMaster.period.length <= 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000062', // 점검기간을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      var gapOfDate = '';
      switch (this.facilityInspectionMaster.comFacilityCheckPerd) {
        case 'FCC1M':
          gapOfDate = '1m'; // 1달
          break;
        case 'FCC3M':
          gapOfDate = '3m'; // 3달
          break;
        case 'FCC6M':
          gapOfDate = '6m'; // 반기
          break;
        case 'FCC1Y':
          gapOfDate = '1y'; // 1년
          break;
        case 'FCC2Y':
          gapOfDate = '2y'; // 2년
          break;
        case 'FCC3Y':
          gapOfDate = '3y'; // 3년
          break;
        case 'FCC5Y':
          gapOfDate = '5y'; // 5년
          break;
        default:
        // code block
      }
      var startDate = this.facilityInspectionMaster.period[0];
      var endDate = this.facilityInspectionMaster.period[1];
      var comFacilityCheckNm = '';
      comFacilityCheckNm =
        this.comboCheckTypeItems[
          this.$_.findIndex(this.comboCheckTypeItems, {
            code: this.facilityInspectionMaster.comFacilityCheckCd,
          })
        ].codeNm;
      var gridData = [];
      this.facilityGridOptions.data.forEach((item) => {
        gridData.push({
          comFacilityTypeCd: item.comFacilityTypeCd,
          comFacilityTypeNm: item.comFacilityTypeNm,
          facilityCd: item.facilityCd,
          facilityNm: item.facilityNm,
          facilityCheckSchYmd: startDate,
          facilityCheckNm: comFacilityCheckNm + '(' + startDate + ')',
          tgtDeptCd: item.tgtDeptCd,
          tgtDeptNm: item.tgtDeptNm,
          createDept: {
            deptCd: this.$store.getters.deptCd,
            deptNm: this.$store.getters.deptNm,
          },
        });
      });

      startDate = this.$comm.getCalculatedDate(
        startDate,
        gapOfDate,
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );

      while (
        this.$comm.getDatediff(
          this.$comm.moment(startDate),
          this.$comm.moment(endDate)
        ) >= 0
      ) {
        for (let i = 0; i < this.facilityGridOptions.data.length; i++) {
          gridData.push({
            comFacilityTypeCd:
              this.facilityGridOptions.data[i].comFacilityTypeCd,
            comFacilityTypeNm:
              this.facilityGridOptions.data[i].comFacilityTypeNm,
            facilityCd: this.facilityGridOptions.data[i].facilityCd,
            facilityNm: this.facilityGridOptions.data[i].facilityNm,
            facilityCheckSchYmd: startDate,
            facilityCheckNm: comFacilityCheckNm + '(' + startDate + ')',
            tgtDeptCd: this.facilityGridOptions.data[i].tgtDeptCd,
            tgtDeptNm: this.facilityGridOptions.data[i].tgtDeptNm,
            createDept: {
              deptCd: this.$store.getters.deptCd,
              deptNm: this.$store.getters.deptNm,
            },
          });
        }

        startDate = this.$comm.getCalculatedDate(
          startDate,
          gapOfDate,
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
      }

      this.gridOptions.data = this.$_.clone(gridData);
      if (gubun) {
        this.gridOptions.data = [];
        this.$_.forEach(
          this.facilityInspectionMaster.facilityInspectionSchedules,
          (item) => {
            let pushData = {
              checkStepCd: item.checkStepCd,
              checkStepNm: item.checkStepNm,
              comFacilityCheckCd: item.comFacilityCheckCd,
              comFacilityCheckNo: item.comFacilityCheckNo,
              comFacilityCheckScheduleNo: item.comFacilityCheckScheduleNo,
              comFacilityTypeCd: item.comFacilityTypeCd,
              comFacilityTypeNm: item.comFacilityTypeNm,
              createDt: item.createDt,
              createDept: {
                deptCd: item.pfmDeptCd,
                deptNm: item.pfmDeptNm,
              },
              createUserId: item.createUserId,
              createUserNm: item.createUserNm,
              deptCd: item.deptCd,
              facilityCd: item.facilityCd,
              facilityCheckNm: item.facilityCheckNm,
              facilityCheckSchYmd: item.facilityCheckSchYmd,
              facilityNm: item.facilityNm,
              plantCd: item.plantCd,
              tgtDeptCd: item.tgtDeptCd,
              tgtDeptNm: item.tgtDeptNm,
              updateDt: item.updateDt,
              updateUserId: item.updateUserId,
              updateUserNm: item.updateUserNm,
              pfmDeptCd: item.pfmDeptCd,
            };

            this.gridOptions.data.push(pushData);
          }
        );
      }

      if (this.popupParam.comFacilityCheckNo > 0) {
        // 수정일때 선택된 점검일정 체크표시
        this.checkItemData = [];
        if (
          this.facilityInspectionMaster.facilityInspectionSchedules &&
          this.facilityInspectionMaster.facilityInspectionSchedules.length > 0
        ) {
          this.checkItemData = this.$_.uniqBy(
            this.facilityInspectionMaster.facilityInspectionSchedules,
            'facilityCheckSchYmd'
          );

          this.$_.forEach(this.gridOptions.data, (item) => {
            let idx = this.$_.findIndex(this.checkItemData, {
              facilityCheckSchYmd: item.facilityCheckSchYmd,
            });
            if (idx > -1) {
              item.checkStepCd = this.checkItemData[idx].checkStepCd;
              item.checkStepNm = this.checkItemData[idx].checkStepNm;
            }
          });
          if (!isClicked) {
            this.$_.forEach(this.checkItemData, (item) => {
              let idx = this.$_.findIndex(this.gridOptions.data, {
                facilityCheckSchYmd: item.facilityCheckSchYmd,
              });
              if (idx === -1) {
                // 점검기간에 따른 점검주기별 점검기간 데이터에 맞지 않게 등록된 점검일정이 있을수 있음
                // 그로 인해 기존에 저장된 데이터가 안보이는 현상이 발생
                // 이와 같은 안보이는 데이터를 점김기간 목록에 넣는다.
                let insertIndex = -1;
                this.$_.forEach(this.gridOptions.data, (data) => {
                  insertIndex++;
                  if (
                    !this.$comm.dateCompare(
                      data.facilityCheckSchYmd,
                      item.facilityCheckSchYmd
                    )
                  ) {
                    return false;
                  }
                });
                this.gridOptions.data.splice(insertIndex, 0, {
                  checkStepCd: item.checkStepCd,
                  checkStepNm: item.checkStepNm,
                  facilityCheckSchYmd: item.facilityCheckSchYmd,
                  facilityCheckNm: item.facilityCheckNm,
                });
              }
            });
          }

          // 점검종류가 바뀐 후 점검 생성 버튼을 누른 경우 기존에 저장된 점검명은 그대로 셋팅이 되어야 함
          this.$_.forEach(
            this.facilityInspectionMaster.facilityInspectionSchedules,
            (item) => {
              let idx = this.$_.findIndex(this.gridOptions.data, {
                facilityCheckSchYmd: item.facilityCheckSchYmd,
              });
              if (idx > -1) {
                this.gridOptions.data[idx].facilityCheckNm =
                  item.facilityCheckNm;
              }
            }
          );
        }
      }
    },
    selectedCheck() {
      return this.editable && !this.disabled;
    },
    beforeSubmitCheck(flag, isCheck) {
      return new Promise((resolve) => {
        this.$validator
          .validateAll()
          .then((_result) => {
            // TODO : 전역 성공 메시지 처리
            // 이벤트는 ./event.js 파일에 선언되어 있음

            /* 2022-03-15 수정msg사항 순회점검처럼 전체목록저장하게 */
            this.checkYmdValue = this.gridOptions.data;

            this.facilityInspectionMaster.facilityInspectionSchedules =
              this.checkYmdValue;
            /*  */

            this.$_.forEach(
              this.facilityInspectionMaster.facilityInspectionSchedules,
              (item) => {
                item.pfmDeptCd = item.createDept.deptCd;
              }
            );
            if (_result) {
              if (
                !this.facilityGridOptions.data ||
                this.facilityGridOptions.data.length === 0
              ) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000753', // 시설은 최소 1개 이상 지정되야 합니다.
                  type: 'warning', // success / info / warning / error
                });
                resolve(false);
                return;
              }
              if (!this.checkYmdValue || this.checkYmdValue.length === 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000711', // 점검예정일은 최소 1개 이상 필수 지정되야 합니다.
                  type: 'warning', // success / info / warning / error
                });
                resolve(false);
                return;
              }

              let msg = '';
              if (isCheck) {
                msg = 'M0000000754'; // 저장후 결재하시겠습니까?
              } else if (flag) {
                msg = 'M0000000011'; // 저장하시겠습니까?
              } else if (!this.onAppr) {
                msg = 'M0000000060'; // 수정하시겠습니까?
              } else if (this.onAppr) {
                this.facilityInspectionMaster.createUserId =
                  this.$store.getters.token;
                this.facilityInspectionMaster.updateUserId =
                  this.$store.getters.token;

                this.facilityInspectionMaster.comFacilityCheckPlanSymd =
                  this.facilityInspectionMaster.period[0];
                this.facilityInspectionMaster.comFacilityCheckPlanEymd =
                  this.facilityInspectionMaster.period[1];

                // 시설점검일정 데이터 타입이 알 수 없는 경우 배열로 초기화 (해당의 경우는 신규등록 일 경우에만 해당)
                if (
                  !this.facilityInspectionMaster.facilityInspectionSchedules
                ) {
                  this.facilityInspectionMaster.facilityInspectionSchedules =
                    [];
                }
                this.facilityGridOptions.data = this.YAuiGrid.getGridData();
                // 시설점검일정 = 시설 X 생성된 점검주기
                this.$_.forEach(this.facilityGridOptions.data, (facility) => {
                  this.$_.forEach(this.checkYmdValue, (schedule) => {
                    // 기존에 있는 데이터의 경우 넣지 않음
                    let insertIndex = this.$_.findIndex(
                      this.facilityInspectionMaster.facilityInspectionSchedules,
                      {
                        facilityCd: facility.facilityCd,
                        facilityCheckSchYmd: schedule.facilityCheckSchYmd,
                      }
                    );
                    if (insertIndex === -1) {
                      this.facilityInspectionMaster.facilityInspectionSchedules.push(
                        {
                          facilityCd: facility.facilityCd,
                          facilityCheckSchYmd: schedule.facilityCheckSchYmd,
                          facilityCheckNm: schedule.facilityCheckNm,
                          comFacilityCheckScheduleNo: 0,
                          comFacilityTypeCd: facility.comFacilityTypeCd,
                          createUserId: this.$store.getters.token,
                          createDept: {
                            deptCd: schedule.pfmDeptCd,
                            deptNm: schedule.pfmDeptNm,
                          },
                        }
                      );
                    }
                  });
                });

                let deleteFacilityInfo = [];
                let deleteScheduleInfo = [];
                this.$_.forEach(
                  this.facilityInspectionMaster.facilityInspectionSchedules,
                  (item) => {
                    // 시설 중 제외된 데이터가 있는지 검사
                    if (
                      this.$_.findIndex(this.facilityGridOptions.data, {
                        facilityCd: item.facilityCd,
                      }) === -1
                    ) {
                      // 저장된 값 중에 없어진 경우
                      if (item.comFacilityCheckScheduleNo > 0) {
                        deleteFacilityInfo.push({
                          comFacilityCheckScheduleNo:
                            item.comFacilityCheckScheduleNo,
                          facilityCd: item.facilityCd,
                          isSave: true,
                        });
                      } else {
                        // 저장되지 않은 값 중에 없어진 경우
                        deleteFacilityInfo.push({
                          facilityCd: item.facilityCd,
                          isSave: false,
                        });
                      }
                    }
                    // 일정 중 제외된 데이터가 있는지 검사
                    if (
                      this.$_.findIndex(this.checkYmdValue, {
                        facilityCheckSchYmd: item.facilityCheckSchYmd,
                      }) === -1
                    ) {
                      // 저장된 값 중에 없어진 경우
                      if (item.comFacilityCheckScheduleNo > 0) {
                        deleteScheduleInfo.push({
                          comFacilityCheckScheduleNo:
                            item.comFacilityCheckScheduleNo,
                          facilityCheckSchYmd: item.facilityCheckSchYmd,
                          isSave: true,
                        });
                      } else {
                        // 저장되지 않은 값 중에 없어진 경우
                        deleteScheduleInfo.push({
                          facilityCheckSchYmd: item.facilityCheckSchYmd,
                          isSave: false,
                        });
                      }
                    }
                  }
                );
                deleteFacilityInfo = this.$_.uniqBy(deleteFacilityInfo);
                this.facilityInspectionMaster.deleteData = [];
                // 저장되어진 데이터의 경우 담아서 백단으로 보냄
                // 시설
                this.$_.forEach(deleteFacilityInfo, (item) => {
                  // 저장된 데이터의 경우
                  if (item.isSave) {
                    this.facilityInspectionMaster.deleteData.push(
                      item.comFacilityCheckScheduleNo
                    );
                  }

                  this.facilityInspectionMaster.facilityInspectionSchedules =
                    this.$_.reject(
                      this.facilityInspectionMaster.facilityInspectionSchedules,
                      { facilityCd: item.facilityCd }
                    );
                });
                // 일정
                this.$_.forEach(deleteScheduleInfo, (item) => {
                  // 저장된 데이터의 경우
                  if (item.isSave) {
                    if (
                      this.$_.indexOf(
                        this.facilityInspectionMaster.deleteData,
                        item.comFacilityCheckScheduleNo
                      ) === -1
                    ) {
                      this.facilityInspectionMaster.deleteData.push(
                        item.comFacilityCheckScheduleNo
                      );
                    }
                  }

                  this.facilityInspectionMaster.facilityInspectionSchedules =
                    this.$_.reject(
                      this.facilityInspectionMaster.facilityInspectionSchedules,
                      { facilityCheckSchYmd: item.facilityCheckSchYmd }
                    );
                });

                if (flag === 'insert') {
                  if (isCheck) {
                    this.isAppr = true;
                  } else {
                    this.isInsert = true;
                  }
                } else if (flag === 'edit') {
                  if (isCheck) {
                    this.isAppr = true;
                  } else {
                    this.isEdit = true;
                  }
                }
                resolve(true);
                return;
              }
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321', // '확인',
                message: msg,
                // TODO : 필요시 추가하세요.
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.facilityInspectionMaster.createUserId =
                    this.$store.getters.token;
                  this.facilityInspectionMaster.updateUserId =
                    this.$store.getters.token;

                  this.facilityInspectionMaster.comFacilityCheckPlanSymd =
                    this.facilityInspectionMaster.period[0];
                  this.facilityInspectionMaster.comFacilityCheckPlanEymd =
                    this.facilityInspectionMaster.period[1];

                  // this.$_.forEach(
                  //   this.facilityInspectionMaster.facilityInspectionSchedules,
                  //   (item) => {
                  //     item.pfmDeptCd = item.createDept.deptCd;
                  //   }
                  // );

                  // 시설점검일정 데이터 타입이 알 수 없는 경우 배열로 초기화 (해당의 경우는 신규등록 일 경우에만 해당)
                  if (
                    !this.facilityInspectionMaster.facilityInspectionSchedules
                  ) {
                    this.facilityInspectionMaster.facilityInspectionSchedules =
                      [];
                  }
                  // 시설점검일정 = 시설 X 생성된 점검주기
                  this.facilityGridOptions.data =
                    this.YAuiGridFacility.getGridData();

                  this.$_.forEach(this.facilityGridOptions.data, (facility) => {
                    this.$_.forEach(this.checkYmdValue, (schedule) => {
                      // 기존에 있는 데이터의 경우 넣지 않음
                      let insertIndex = this.$_.findIndex(
                        this.facilityInspectionMaster
                          .facilityInspectionSchedules,
                        {
                          facilityCd: facility.facilityCd,
                          facilityCheckSchYmd: schedule.facilityCheckSchYmd,
                        }
                      );
                      if (insertIndex === -1) {
                        this.facilityInspectionMaster.facilityInspectionSchedules.push(
                          {
                            facilityCd: facility.facilityCd,
                            facilityCheckSchYmd: schedule.facilityCheckSchYmd,
                            facilityCheckNm: schedule.facilityCheckNm,
                            comFacilityCheckScheduleNo: 0,
                            comFacilityTypeCd: facility.comFacilityTypeCd,
                            createUserId: this.$store.getters.token,
                            createDept: {
                              deptCd: schedule.pfmDeptCd,
                              deptNm: schedule.pfmDeptNm,
                            },
                          }
                        );
                      }
                    });
                  });

                  let deleteFacilityInfo = [];
                  let deleteScheduleInfo = [];
                  this.$_.forEach(
                    this.facilityInspectionMaster.facilityInspectionSchedules,
                    (item) => {
                      // 시설 중 제외된 데이터가 있는지 검사
                      if (
                        this.$_.findIndex(this.facilityGridOptions.data, {
                          facilityCd: item.facilityCd,
                        }) === -1
                      ) {
                        // 저장된 값 중에 없어진 경우
                        if (item.comFacilityCheckScheduleNo > 0) {
                          deleteFacilityInfo.push({
                            comFacilityCheckScheduleNo:
                              item.comFacilityCheckScheduleNo,
                            facilityCd: item.facilityCd,
                            isSave: true,
                          });
                        } else {
                          // 저장되지 않은 값 중에 없어진 경우
                          deleteFacilityInfo.push({
                            facilityCd: item.facilityCd,
                            isSave: false,
                          });
                        }
                      }
                      // 일정 중 제외된 데이터가 있는지 검사
                      if (
                        this.$_.findIndex(this.checkYmdValue, {
                          facilityCheckSchYmd: item.facilityCheckSchYmd,
                        }) === -1
                      ) {
                        // 저장된 값 중에 없어진 경우
                        if (item.comFacilityCheckScheduleNo > 0) {
                          deleteScheduleInfo.push({
                            comFacilityCheckScheduleNo:
                              item.comFacilityCheckScheduleNo,
                            facilityCheckSchYmd: item.facilityCheckSchYmd,
                            isSave: true,
                          });
                        } else {
                          // 저장되지 않은 값 중에 없어진 경우
                          deleteScheduleInfo.push({
                            facilityCheckSchYmd: item.facilityCheckSchYmd,
                            isSave: false,
                          });
                        }
                      }
                    }
                  );
                  deleteFacilityInfo = this.$_.uniqBy(deleteFacilityInfo);
                  this.facilityInspectionMaster.deleteData = [];
                  // 저장되어진 데이터의 경우 담아서 백단으로 보냄
                  // 시설
                  this.$_.forEach(deleteFacilityInfo, (item) => {
                    // 저장된 데이터의 경우
                    if (item.isSave) {
                      this.facilityInspectionMaster.deleteData.push(
                        item.comFacilityCheckScheduleNo
                      );
                    }

                    this.facilityInspectionMaster.facilityInspectionSchedules =
                      this.$_.reject(
                        this.facilityInspectionMaster
                          .facilityInspectionSchedules,
                        { facilityCd: item.facilityCd }
                      );
                  });
                  // 일정
                  this.$_.forEach(deleteScheduleInfo, (item) => {
                    // 저장된 데이터의 경우
                    if (item.isSave) {
                      if (
                        this.$_.indexOf(
                          this.facilityInspectionMaster.deleteData,
                          item.comFacilityCheckScheduleNo
                        ) === -1
                      ) {
                        this.facilityInspectionMaster.deleteData.push(
                          item.comFacilityCheckScheduleNo
                        );
                      }
                    }

                    this.facilityInspectionMaster.facilityInspectionSchedules =
                      this.$_.reject(
                        this.facilityInspectionMaster
                          .facilityInspectionSchedules,
                        { facilityCheckSchYmd: item.facilityCheckSchYmd }
                      );
                  });

                  if (flag === 'insert') {
                    if (isCheck) {
                      this.isAppr = true;
                    } else {
                      this.isInsert = true;
                    }
                  } else if (flag === 'edit') {
                    if (isCheck) {
                      this.isAppr = true;
                    } else {
                      this.isEdit = true;
                    }
                  }
                  resolve(true);
                },
                // 취소 callback 함수
                cancelCallback: () => {
                  resolve(false);
                },
              });
            } else if (!_result) {
              this.$popupRequired.check(
                'facilityInspectionScheduleDetail',
                this.$data,
                this.errors
              );
              resolve(false);
              return;
            }
          })
          .catch(() => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
            );
            if (flag === 'insert') {
              if (isCheck) {
                this.isAppr = false;
              } else {
                this.isInsert = false;
              }
            } else if (flag === 'edit') {
              if (isCheck) {
                this.isAppr = false;
              } else {
                this.isEdit = false;
              }
            }
            resolve(false);
          });
      });
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeAppr() {
      if (this.popupParam.comFacilityCheckNo === 0) {
        this.saveUrl = this.insertUrl;
        this.actionType = 'POST';
        this.beforeSubmitCheck('insert', true);
      } else {
        this.saveUrl = this.editUrl;
        this.actionType = 'PUT';
        this.beforeSubmitCheck('edit', true);
      }
    },
    beforeInsert() {
      this.beforeSubmitCheck('insert', false);
    },
    beforeEdit() {
      this.beforeSubmitCheck('edit', false);
    },
    /**
     * 필수입력값 유효성 검사
     */

    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup() {
      this.$emit('closePopup', null);
    },
    /** button 관련 이벤트 **/
    /**
     * 검진항목  목록 조회 및 수정 버튼 보이도록 처리
     *  신규등록 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnInsertClickedCallback(_result) {
      this.popupParam.comFacilityCheckNo = _result.data;
      this.facilityInspectionMaster.comFacilityCheckNo = _result.data;
      this.isAppr = false;
      this.isInsert = false;
      this.inserabled = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.getScheduleDetail();
    },
    btnEditClickedCallback(_result) {
      this.popupParam.comFacilityCheckNo = _result.data;
      this.facilityInspectionMaster.comFacilityCheckNo = _result.data;
      this.isAppr = false;
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000836', // 수정되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.getScheduleDetail();
    },
    /** button 관련 이벤트 **/
    /**
     * 수정 버튼 안보여지도록 처리 및 isSubmit false 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.isAppr = false;
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * 시설점검일정 삭제
     *  삭제 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.facilityInspectionMaster.comFacilityCheckNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success', // success / info / warning / error
              });
              this.closePopup(null);
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    openPopup() {
      this.popupOptions.target = () =>
        import(`${'./facilityInspectionMstPopup.vue'}`);
      this.popupOptions.title = 'L0000001740'; // 시설 추가
      this.popupOptions.param = {
        // 시설 추가 팝업에서 점검시설 목록에 있는 데이터를 넘기지 않음
        // 따라서 제외는 제외버튼을 통해 제외
        plantCd: this.facilityInspectionMaster.plantCd,
        selectedFacilityMstValue: [],
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeFacilityPopup;
    },
    closeFacilityPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data === 'CLOSE') return;
      // 데이터의 타입이 배열이 아닌 알 수 없는값으로 표기 될 시에 배열로 초기화
      if (!this.facilityGridOptions.data) this.facilityGridOptions.data = [];
      // 선택버튼을 이용하여 리스트 형태로 가져올 경우
      if (Array.isArray(data)) {
        this.$_.forEach(data, (facility) => {
          // 점검시설 목록에 선택되어져 온 시설을 바인딩한다.
          let index = this.$_.findIndex(this.facilityGridOptions.data, {
            facilityCd: facility.facilityCd,
          });
          // 팝업창에서 선택한 값이 기존에 없는 값이라면 점검시설목록에 추가한다.
          if (index === -1) {
            this.facilityGridOptions.data.splice(0, 0, {
              facilityCd: facility.facilityCd,
              facilityNm: facility.facilityNm,
              comFacilityTypeCd: facility.comFacilityTypeCd,
              comFacilityTypeNm: facility.comFacilityTypeNm,
              tgtDeptCd: facility.deptCd,
              tgtDeptNm: facility.deptNm,
            });
          } else {
            // 기존에 있는 데이터의 경우에는 데이터를 추가하지 않고 그대로 놔둔다.
          }
        });
      } else {
        // 더블클릭하여 하나의 시설 정보를 맵형태로 가져올 경우
        // 점검시설 목록에 선택되어져 온 시설을 바인딩한다.
        let index = this.$_.findIndex(this.facilityGridOptions.data, {
          facilityCd: data.facilityCd,
        });
        // 팝업창에서 선택한 값이 기존에 없는 값이라면 점검시설목록에 추가한다.
        if (index === -1) {
          this.facilityGridOptions.data.splice(0, 0, {
            facilityCd: data.facilityCd,
            facilityNm: data.facilityNm,
            comFacilityTypeCd: data.comFacilityTypeCd,
            comFacilityTypeNm: data.comFacilityTypeNm,
            tgtDeptCd: data.deptCd,
            tgtDeptNm: data.deptNm,
          });
        } else {
          // 기존에 있는 데이터의 경우에는 데이터를 추가하지 않고 그대로 놔둔다.
        }
      }
      this.YAuiGridFacility.setGridData(this.facilityGridOptions.data);
    },
    btnDeleteFacilityClicked(_result) {
      let removeData = this.YAuiGridFacility.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000755', // 시설목록에서 시설을 한개이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000756', // 선택항목을 삭제하시겠습니까?
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            let gridData = this.YAuiGridFacility.getGridData();
            this.$_.forEach(removeData, (item) => {
              gridData = this.$_.reject(gridData, {
                facilityCd: item.item.facilityCd,
              });
            });
            this.YAuiGridFacility.setGridData(gridData);
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      }
    },
    // 결재
    btnAppr() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; // 결재요청
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'SA_FA-01',
        apprParams: {
          comFacilityCheckNo: this.facilityInspectionMaster.comFacilityCheckNo,
        },
      };
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.resultFlag) {
        this.updateMode = true;
        this.deleteable = true;
        this.disabled = true;
        this.editCheck = false;
        this.deleteCheck = false;
        this.confirmCheck = false;
      }

      this.isAppr = false;
      this.getScheduleDetail();

      // 결재 요청이 성공한 경우
      // if (data.resultFlag) {
      //   // 작업허가서의 결재진행상태를 바꾼다.
      //   this.$http.url = this.$format(
      //     this.completeUrl,
      //     this.wkodMaster.wkodNo,
      //     data.apprRqstNo
      //   );
      //   this.$http.type = 'PUT';
      //   this.$http.request(
      //     _result => {},
      //     _error => {
      //       this.$emit('APP_REQUEST_ERROR', _error);
      //     }
      //   );
      // }
    },

    // 2022-03-15 수정사항 행삭제기능추가
    LineDelete() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      this.$_.forEach(removeData, (item) => {
        let idx = this.$_.indexOf(
          this.$_.map(this.gridOptions.data, 'facilityCheckNm'),
          item.facilityCheckNm
        );
        this.gridOptions.data.splice(idx, 1);
      });
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
