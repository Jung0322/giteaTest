<!--
  목적 : 위험성평가 > 작업위험성평가 > 평가 계획 상세 > 평가대상 작업 탭
  작성자 : kyh
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003053')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="true"
          @btnPopupInsertClicked="btnPopupInsertClicked"
          @btnPopupInsertClicked2="btnPopupInsertClicked2"
          @deleteRow="deleteRow"
        />
        <!-- 평가대상 작업 목록 -->
        <!-- <y-data-table
            :editable="editable && apprMode"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="selectedValues"
            label="L0000003072"
          >
       
          </y-data-table> -->
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
  name: 'rsaPlanDetailList',
  props: {
    Planmgmt: {
      type: Object,
      default: () => ({
        assessPlanNo: 0,
        plantCd: '', // 사업장 코드
        assessYear: '',
        classificationCd: '',
        regRegdemCd: '',
        assessNm: '',
        assessDt: null,
        assessDesc: '',
        riskType: '',
        planmgmtDeptList: [], // 평가대상작업목록'
        deptList: [],
        deptCd: '',
        deptNm: '',
        tempAssessYear: '',
        assessStepCd: '',
      }),
    },

    disabled: false,
    deptListLoad: false,
    updateMode: false,
    deptReLoad: false,
    apprMode: false,
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        header: [],
        data: [],
        height: '500',
        name: 'planListGrid',
      },
      editable: true,
      selectedValues: [], // 그리드 선택 목록

      deleteValue: null,
      deleteUrl: '',
      isDelete: false,
      detailUrl: '',

      deptList2: [],
      YAuiGrid: null,
      apprFlag: false,
    };
  },
  watch: {
    deptListLoad() {
      this.Planmgmt.planmgmtDeptList = this.gridOptions.data;
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.deleteUrl = transactionConfig.rsa.planmgmtdeptlist2.delete.url;
      this.detailUrl = selectConfig.rsa.planmgmt2.get2.url;
      this.$comm.getComboItems('RSA_ASSESS_CLASS', true).then((_result) => {
        this.deptList2 = _result;
        this.deptList2.splice(0, 1, {
          code: null,
          codeNm:
            this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
        });
      });

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 평가팀
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004990'),
          dataField: 'deptNm',
          width: 300,
        },
        {
          // 분류
          headerText: this.$comm.getLangSpecInfoLabel('L0000001341'),
          dataField: 'classificationNm',
          width: 150,
        },
        {
          // 관리번호
          headerText: this.$comm.getLangSpecInfoLabel('L0000000590'),
          dataField: 'jobManageNo',
          width: 600,
        },
        {
          // 공정
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: 200,
        },

        // 작업명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'jobNm',
          width: 250,
        },
        // 평가년도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003065'),
          dataField: 'year',
          width: 150,
        },
        // 이전평가일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005834'),
          dataField: 'assessDate',
          width: 150,
        },
        // 평가담당자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004201'),
          dataField: 'userNm',
          width: 200,
        },
        // 이력번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005835'),
          dataField: 'revNo',
          width: 120,
        },
      ];

      // 그리드 버튼 설정
      this.gridOptions.btns = [
        // 이전이력조회
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002219'),
          color: 'orange',
          btnClicked: 'btnPopupInsertClicked2',
        },
        // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupInsertClicked',
        },
        // 삭제
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'deleteRow',
        },
      ];
    },

    getList() {
      if (!this.Planmgmt.assessPlanNo || this.Planmgmt.assessPlanNo === 0) {
        return;
      }
      this.$http.url = this.$format(this.detailUrl, this.Planmgmt.assessPlanNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.Planmgmt.planmgmtDeptList = _result.data.planmgmtDeptList;

          this.Planmgmt.assessStepCd = _result.data.assessStepCd;

          this.gridOptions.data = this.Planmgmt.planmgmtDeptList;
          this.YAuiGrid.setGridData(this.Planmgmt.planmgmtDeptList);

          if (
            this.Planmgmt.assessStepCd === 'STATE4' ||
            this.Planmgmt.assessStepCd === 'STATE3'
          ) {
            // 결재중, 결재완료인 경우
            this.editable = false;
          } else if (this.Planmgmt.apprRqstStatus === '진행') {
            this.editable = false;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnPopupInsertClicked2() {
      let tempYear = '';
      if (this.Planmgmt.tempAssessYear.length > 0) {
        tempYear = Number(this.Planmgmt.tempAssessYear[0].substring(0, 4)) - 1;
        this.popupOptions.top = '10px';
        this.popupOptions.width = '90%';
        this.popupOptions.target = () =>
          import(`${'./assessCompleteResultRevisionListPopup.vue'}`);
        this.popupOptions.title = 'L0000005845'; // 위험성평가 이력 조회
        this.popupOptions.visible = true;

        this.popupOptions.param = {
          popupMode: true,
          multiple: true,
          plantCd: this.Planmgmt.plantCd,
          deptCd: this.Planmgmt.deptCd,
          deptNm: this.Planmgmt.deptNm,
          classificationCd: this.Planmgmt.classificationCd,
          assessYear: String(tempYear),
        };
        this.popupOptions.closeCallback = this.closeRevPopup;
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001316' /* 평가기간을 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
    },
    btnPopupInsertClicked(data) {
      if (!this.Planmgmt.tempAssessYear) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          // 필수항목작성이 누락되었습니다. 빨간색 BOX를 작성해주세요.
          message: 'L0000005154', // 평가기간을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.Planmgmt.classificationCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          // 필수항목작성이 누락되었습니다. 빨간색 BOX를 작성해주세요.
          message: 'M0000001105', // 분류를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.Planmgmt.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          // 필수항목작성이 누락되었습니다. 빨간색 BOX를 작성해주세요.
          message: 'M0000001087', // 부서를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      let tempYear;
      let rsaYear;
      if (Array.isArray(this.Planmgmt.assessYear)) {
        tempYear = new Date(this.Planmgmt.assessYear[0]);
        rsaYear = tempYear.getFullYear();
      } else {
        rsaYear = this.Planmgmt.assessYear;
      }
      this.$_.forEach(this.deptList2, (item) => {
        if (item.code === this.Planmgmt.classificationCd) {
          this.Planmgmt.classificationNm = item.codeNm;
        }
      });

      this.popupOptions.top = '10px';
      this.popupOptions.width = '90%';
      this.popupOptions.target = () => import(`${'./planOperationPopup.vue'}`);
      this.popupOptions.title = 'L0000005847'; // '평가대상 작업 신규등록';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        deptCd: this.Planmgmt.deptCd, // 평가팀 부서코드
        deptNm: this.Planmgmt.deptNm, // 평가팀 부서명
        classificationCd: this.Planmgmt.classificationCd, // 분류코드
        classificationNm: this.Planmgmt.classificationNm, // 분류명
        plantCd: this.Planmgmt.plantCd, // 사업장코드
        year: rsaYear, // 년도
        userId: this.$store.getters.token, // 평가담당자
        userNm: this.$store.getters.name, // 평가담당자명
        multiple: true,
        deptList: this.Planmgmt.deptList, // 분류
        rsaRegRegdemItems: this.rsaRegRegdemItems, // 정기/수시
        regRegdem: this.Planmgmt.regRegdem, // 정기/수시
        assessNm: this.Planmgmt.assessNm, // 평가명
        alias: this.Planmgmt.alias, // 부서약어, 부서약어가 없을시 부서명을 보여줌
      };

      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closeRevPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      let tempGridData = this.YAuiGrid.getGridData();

      if (data) {
        if (data.length > 0) {
          this.$_.forEach(data, (item) => {
            if (
              this.$_.findIndex(tempGridData, {
                jobNo: item.jobNo,
              }) === -1
            ) {
              let tempData = {
                deptCd: item.deptCd, // 평가팀 부서코드
                deptNm: item.deptNm, // 평가팀 부서명
                classificationCd: item.classificationCd, // 분류코드
                classificationNm: item.classificationNm, // 분류명
                year: item.year, // 년도
                jobNm: item.jobNm, // 작업명
                processCd: item.processCd, // 공정코드
                processNm: item.processNm, // 공정명
                plantCd: item.plantCd, // 사업장코드
                jobManageNo: item.jobManageNo, // 관리번호
                createUserId: item.createUserId,
                userNm: item.createUserNm,
                jobNo: item.jobNo, // 작업번호 (PK)
                revNo: item.revNo,
                assessDate: item.assessDate,
              };

              tempGridData.push(tempData);
            }
          });
        }
        this.Planmgmt.planmgmtDeptList = tempGridData;
        this.YAuiGrid.setGridData(tempGridData);
      }
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      let tempGridData = this.YAuiGrid.getGridData();

      if (data && data.length) {
        this.$_.forEach(data, (item) => {
          tempGridData.push(item);
        });
        this.YAuiGrid.setGridData(tempGridData);
        this.Planmgmt.planmgmtDeptList = tempGridData;
      }
    },
    deleteRow() {
      let selectedValues = this.YAuiGrid.getCheckedRowItemsAll();
      let tempGridData = this.YAuiGrid.getGridData();
      if (!selectedValues || !selectedValues.length) {
        this.$comm.alertWarning('M0000001614'); // 선택된 항목이 없습니다.
        return;
      }

      this.$_.forEach(selectedValues, (item) => {
        tempGridData.splice(
          this.$_.findIndex(tempGridData, {
            workNm: item.workNm,
          }),
          1
        );
      });
      this.YAuiGrid.setGridData(tempGridData);
    },
    beforeDelete() {
      if (!this.selectedValues || !this.selectedValues.length) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001614', // 선택된 항목이 없습니다.
          type: 'warning',
        });
        return;
      }
      if (this.selectedValues.assessFinishYn === '완료') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000057', // 평가완료여부가 완료인상태는 삭제가 불가합니다.
          type: 'warning',
        });
        return;
      }
      let filterValues = [];
      this.$_.forEach(this.selectedValues, (item) => {
        if (item.assessDeptNo !== 0) {
          let saveIdx = this.$_.findIndex(this.selectedValues, {
            deptCd: item.deptCd,
          });
          filterValues.push(this.selectedValues[saveIdx]);
        }
      });
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.deleteValue = {
            data: Object.values(this.$_.clone(this.selectedValues)),
          };
          this.isDelete = true;
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      let selectedValues = this.YAuiGrid.getCheckedRowItemsAll();
      let tempGridData = this.YAuiGrid.getGridData();
      this.$_.forEach(selectedValues, (item) => {
        tempGridData.splice(
          this.$_.findIndex(tempGridData, {
            deptCd: item.deptCd,
          }),
          1
        );
      });

      this.isDelete = false;
      this.YAuiGrid.setGridData(tempGridData);
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>
