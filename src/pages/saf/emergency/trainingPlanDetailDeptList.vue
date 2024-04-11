<!--
  목적 : 훈련계획 관리 > 대상부서
  작성자 : pkj
  Detail : 훈련계획 관리 > 대상부서
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <!-- 훈련대상 부서 -->
        <y-auigrid
          ref="yAuiGrid"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :editable="editable && stateYn"
          :label="this.$comm.getLangSpecInfoLabel('L0000005191')"
          :useExcelExport="true"
          :showRowCheckColumn="editable && stateYn"
          @cellEditEnd="cellEditEndHandler"
          @btnPopupInsert="btnPopupInsertClicked"
          @deleteRow="deleteRow"
          @beforeDelete="beforeDelete"
          @btnDelete="btnDeleteClickedCallback"
          @btnClickedError="btnClickedErrorCallback"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'emergencyDeptList',
  props: {
    emergencyInfo: {
      type: Object,
      default: () => ({
        vendorEvalPlanNo: 0,
        plantCd: '', // 사업장 코드
        year: '',
        evalClsCd: '',
        evalTitle: '',
        assessDt: null,
        evalDesc: '',
        emergencyDeptList: [],
      }),
    },
    tabIndex: 0,
    updateMode: false,
    stateYn: false,
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
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
      },
      editable: true,
      selectedValues: [], // 그리드 선택 목록
      deleteValue: null,
      deleteUrl: '',
      isDelete: false,
    };
  },
  watch: {
    tabIndex() {
      if (Number(this.tabIndex) === 0) {
        this.resizeGrid();
      }
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
    this.resizeGrid();
    this.YAuiGrid.setGridData(this.emergencyInfo.emergencyDeptList);
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.deleteUrl = transactionConfig.saf.emergency.deptdelete.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '150',
          editable: false,
        }, // 부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005192'),
          dataField: 'trainUserCnt',
          width: '130',
          style: 'right-align',
          dataType: 'numeric',
          formatString: '#,###.#',
          rounding: 'floor',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            autoThousandSeparator: true, // 자동 컴마를 천단위 출력할지 여부
            allowPoint: true, // 소수점 입력(.) 도 허용할지 여부
            maxlength: 6,
          },
        }, // 참여인원수
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'trainDesc',
          width: '200',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 2000,
          },
        }, // 비고
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003385'),
          dataField: 'trainYmd',
          width: '130',
          editRenderer: {
            type: 'CalendarRenderer',
            onlyCalendar: true,
            defaultFormat: 'yyyy-mm-dd',
          },
        }, // 훈련일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005194'),
          dataField: 'trainSTime',
          width: '100',
          editRenderer: {
            editable: !this.disabled && this.editable,
            type: 'MaskEditRenderer',
            mask: '99:99',
            textAlign: 'center',
            placeholder: '__:__',
            applyMaskValue: true,
          },
        }, // 훈련시작시간
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005193'),
          dataField: 'trainETime',
          width: '100',
          editRenderer: {
            editable: !this.disabled && this.editable,
            type: 'MaskEditRenderer',
            mask: '99:99',
            textAlign: 'center',
            placeholder: '__:__',
            applyMaskValue: true,
          },
        }, // 훈련종료시간
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005355'),
          dataField: 'trainCompleteYn',
          width: '100',
          editable: false,
        }, // 훈련완료여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005397'),
          dataField: 'trainCompleteDt',
          width: '130',
          editable: false,
        }, // 훈련완료일
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003226'),
          color: 'orange',
          btnClicked: 'btnPopupInsert',
          btnClickedError: 'btnClickedError',
          visible: this.editable && this.stateYn,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003225'),
          color: 'red',
          actionUrl: this.deleteUrl,
          actionType: 'delete',
          beforeSubmit: 'beforeDelete',
          btnClicked: 'btnDelete',
          btnClickedError: 'btnClickedError',
          visible: this.updateMode && this.editable && this.stateYn,
          useSubmit: true,
        }, // 삭제
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'deleteRow',
          btnClickedError: 'btnClickedError',
          visible: !this.updateMode && this.editable && this.stateYn,
        }, // 삭제
      ];
    },
    btnPopupInsertClicked(data) {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '60%';
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000001293'; // '부서 선택';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        plantCd: this.emergencyInfo.plantCd,
        multiple: true,
        isSubDeptSelection: true,
      };

      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data && data.length) {
        const gridData = this.YAuiGrid.getGridData();
        this.$_.forEach(data, (user) => {
          // 중복방지
          let idx = this.$_.findIndex(
            gridData,
            (u) => u.deptCd === user.deptCd
          );
          if (idx < 0) {
            const newObj = {
              deptCd: user.deptCd, // 부서코드
              deptNm: user.deptNm,
              trainDesc: '', // 비고
              procStepCd: 'STS02', // 단계(결과)
              createUserId: this.$store.getters.token,
              createDeptNm: this.$store.getters.deptNm,
              createDeptCd: this.$store.getters.deptCd,
              createPositionNm: this.$store.getters.positionNm,
              createPositionCd: this.$store.getters.positionCd,
              trainSTime: this.emergencyInfo.trainSTime
                ? this.emergencyInfo.trainSTime
                : '', // 훈련시작시간
              trainETime: this.emergencyInfo.trainETime
                ? this.emergencyInfo.trainETime
                : '', // 훈련종료시간
              trainYmd: this.emergencyInfo.trainYmd
                ? this.emergencyInfo.trainYmd
                : '',
              trainYn: 'N', // 참여여부
              trainUserCnt: 0, // 참여인원수
              stateCd: 'PSURE', // 최초 미작성
            };
            gridData.push(newObj);
            this.YAuiGrid.addRow(newObj);
          }
        });

        this.emergencyInfo.emergencyDeptList = gridData;
      }
    },
    deleteRow() {
      if (this.YAuiGrid.getCheckedRowItemsAll().length <= 0) {
        this.$comm.alertWarning('M0000001614'); // 선택된 항목이 없습니다.
        return;
      }
      if (this.selectedValues.showEvalFinishYn === '완료') {
        this.$comm.alertWarning('M0000001612'); // 평가완료여부가 완료인상태는 삭제가 불가합니다.
        return;
      }
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      let gridData = this.YAuiGrid.getGridData();
      this.$_.forEach(selectedRows, (item) => {
        gridData = this.$_.reject(gridData, { deptCd: item.deptCd });
      });
      this.emergencyInfo.emergencyDeptList = gridData;
      this.YAuiGrid.setGridData(gridData);
    },
    beforeDelete() {
      if (this.YAuiGrid.getCheckedRowItemsAll().length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001614', // 선택된 항목이 없습니다.
          type: 'warning',
        });
        return;
      }

      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      const filterValues = [];
      this.$_.forEach(selectedRows, (item) => {
        if (item.assessDeptNo !== 0) {
          const saveIdx = this.$_.findIndex(selectedRows, {
            deptCd: item.deptCd,
          });
          if (saveIdx > -1) {
            filterValues.push(this.selectedValues[saveIdx]);
          }
        }
      });
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.deleteValue = {
            data: Object.values(this.$_.clone(selectedRows)),
          };
          this.isDelete = true;
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      let gridData = this.YAuiGrid.getGridData();
      this.$_.forEach(selectedRows, (item) => {
        gridData = this.$_.reject(gridData, { deptCd: item.deptCd });
      });
      this.emergencyInfo.emergencyDeptList = gridData;
      this.YAuiGrid.setGridData(gridData);

      this.isDelete = false;
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

    cellEditEndHandler(event) {
      this.emergencyInfo.emergencyDeptList = this.YAuiGrid.getGridData();
    },
    resizeGrid() {
      this.YAuiGrid.resize(null, this.gridOptions.height);
    },
  },
};
</script>
