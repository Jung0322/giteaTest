<!--
  목적 : 시설점검 관리 - 시설점검결과 - 결과
  Detail : 안전점검 항목별 점검결과
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 항목별점검결과 -->
            <y-label
              label="L0000003208"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 시설점검결과 -->
              <y-select
                :width="8"
                :required="true"
                :comboItems="comboCheckResultItems"
                :editable="editable"
                :disabled="disabled || authDuringAppr || popupMode"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001754"
                name="checkResultCd"
                v-model="facilityInspectionSchedule.checkResultCd"
                v-validate="'required'"
                :state="validateState('checkResultCd')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 시설점검결과요약 -->
              <y-textarea
                :width="10"
                :maxlength="60"
                :required="true"
                :editable="editable"
                :disabled="disabled || authDuringAppr || popupMode"
                ui="bootstrap"
                label="L0000001757"
                name="facilityCheckResult"
                v-model="facilityInspectionSchedule.facilityCheckResult"
                v-validate="'required'"
                :state="validateState('facilityCheckResult')"
              />
            </b-col>
          </b-row>
          <!-- 검색 결과 테이블 -->
          <b-row>
            <b-col sm="8">
              <b-col sm="12" class="px-0">
                <!-- 시설점검항목별 결과 목록 -->
                <!-- <y-data-table
                  ref="dataFaciliyItemResultTable"
                  :height="gridOptions.height"
                  :editable="!disabled && editable && !authDuringAppr"
                  :headers="gridOptions.header"
                  :items="gridOptions.data"
                  :print="true"
                  label="L0000001766"
                  :popMode="true"
                  @tableLinkClicked="tableLinkClicked"
                ></y-data-table> -->
                <y-auigrid
                  ref="yAuiGrid"
                  :name="gridOptions.name"
                  :headers="gridOptions.header"
                  :btns="gridOptions.btns"
                  :height="gridOptions.height"
                  :items="gridOptions.data"
                  :label="this.$comm.getLangSpecInfoLabel('L0000001766')"
                  :useExcelExport="false"
                  :showGridSetSave="true"
                  :useContextMenu="true"
                  :enableRightDownFocus="true"
                  :showGridCtrl="true"
                  :enableSorting="true"
                  @cellClick="cellClickHandler"
                />
              </b-col>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-facility-item-result',
  props: {
    popupMode: false,
    authDuringAppr: false,
    facilityInspectionSchedule: {
      type: Object,
      default: {
        plantCd: '', // 사업장
        comFacilityCheckScheduleNo: 0, // 시설점검일정번호
        comFacilityCheckNo: 0,
        comFacilityCheckCd: '', // 시설점검종류코드
        comFacilityTypeCd: '', // 시설유형코드
        checkResultCd: null, // 시설점검결과코드
        facilityCheckResult: '', // 시설점검결과요약
        facilityInsItemResults: [], // 점검항목결과
      },
    },
    disabled: false,
    fileUploadTaskTempKey: '',
  },
  data: () => ({
    gridOptions: {
      header: [],
      data: [],
      height: '300',
    },
    editable: false,
    searchUrl: '',
    comboCheckResultItems: [],
    refresh: false,
    countIndex: 0,

    attachFileGrp: {
      label: 'L0000004895', // 첨부파일
      editable: false,
      disabled: true,
      onlyDownload: true,
      uploadTempFiles: null,
      showUploadBtn: false,
      taskClassNm: 'FACILITY_INSPECTION_ITEM_RSLT',
      taskKey: '',
      taskFlag: '',
      createUserId: '',
    },
    fileUploadKey: 0,
    YAuiGrid: null,
  }),
  computed: {},
  watch: {
    'facilityInspectionSchedule.comFacilityCheckCd'() {
      this.getList();
    },
    'facilityInspectionSchedule.comFacilityTypeCd': {
      handler: function (val, oldVal) {
        this.getList();
      },
      deep: true,
    },
    'facilityInspectionSchedule.comFacilityCheckScheduleNo': function (
      newValue,
      oldValue
    ) {
      this.getList();
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.facilityInspectionSchedule.facilityInsItemResults =
          this.gridOptions.data;
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
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl =
        selectConfig.saf.facilityInspection.facilityInspectionItemResult.list.url;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002584'),
          dataField: 'comFacilityCheckNm',
          width: '200px',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 점검항목
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002536'),
          dataField: 'checkResult',
          width: '150px',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        }, // 점검결과
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '350px',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 600,
          },
        }, // 비고
      ];
      this.getComboItems('SAF_F_CHK_RSLT_CLS'); // 시설점검결과
    },
    /**
     * 공통 마스터 정보 조회 (진행단계, 점검종류)
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
          if (codeGroupCd === 'SAF_F_CHK_RSLT_CLS') {
            this.comboCheckResultItems = this.$_.clone(_result.data);
            this.comboCheckResultItems.splice(0, 0, {
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
    /** 시설점검결과 목록 조회 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        comFacilityCheckScheduleNo:
          this.facilityInspectionSchedule.comFacilityCheckScheduleNo,
        comFacilityCheckCd: this.facilityInspectionSchedule.comFacilityCheckCd,
        comFacilityTypeCd: this.facilityInspectionSchedule.comFacilityTypeCd,
        plantCd: this.facilityInspectionSchedule.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
    /** button 관련 이벤트 **/
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** end button 관련 이벤트 **/
    // tableLinkClicked(header, data) {
    //   this.attachFileGrpSetting(data);
    //   this.fileUploadKey += 1;
    // },

    cellClickHandler(header, event) {
      this.attachFileGrpSetting(event.item);
      this.fileUploadKey += 1;
    },

    resizeGrid() {
      this.YAuiGrid.resize(null, this.gridOptions.height);
    },
  },
};
</script>
