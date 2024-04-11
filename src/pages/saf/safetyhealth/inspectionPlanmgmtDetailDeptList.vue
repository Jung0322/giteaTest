<!--
  목적 : 정기위험성평가계획 > 계획목록
  작성자 : pkj
  Detail : 정기위험성평가계획 > 계획목록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             추가 
            <y-btn
              v-if="editable && apprMode"
              title="L0000001300"
              color="orange"
              @btnClicked="btnPopupInsertClicked"
            />
             삭제 
            <y-btn
              v-if="updateMode && editable && apprMode"
              :action-url="deleteUrl"
              :param="deleteValue"
              :is-submit="isDelete"
              title="L0000003225"
              color="green"
              action-type="DELETE"
              beforeSubmit="beforeDelete"
              @beforeDelete="beforeDelete"
              @btnClicked="btnDeleteClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             삭제 
            <y-btn
              v-if="!updateMode && editable && apprMode"
              title="L0000003225"
              color="red"
              @btnClicked="deleteRow"
            />
          </div>
         정기위험성평가계획 목록 
          <y-data-table
            :editable="editable && apprMode"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="selectedValues"
          >
            <el-table-column
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
          :editable="editable && apprMode"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :showRowCheckColumn="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :softRemoveRowMode="false"
          @cellEditEnd="cellEditEndHandler"
          @btnAddRow="btnAddRow"
          @btnDelRow="btnDelRow"
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
  name: 'rsaPlanDetailList',
  props: {
    inspectionPlan: {
      type: Object,
      default: () => ({
        implChkPlanNo: 0,
        implChkDeptNo: 0,
        plantCd: '', // 사업장 코드
        year: '',
        regRegdemCd: '',
        chkNm: '',
        assessDt: null,
        chkDesc: '',
        inspectionSHDetp: [],
      }),
    },
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
        name: 'inspectionPlanmgmtDetailDeptList',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      editable: true,
      selectedValues: [], // 그리드 선택 목록
      deleteValue: null,
      deleteUrl: '',
      isDelete: false,
    };
  },
  watch: {
    deptListLoad() {
      this.inspectionPlan.inspectionSHDetp = this.gridOptions.data;
    },
    deptReLoad() {
      setTimeout(() => {
        this.getList();
      }, 300);
    },
    apprMode: {
      handler: function (val, oldVal) {
        if (this.apprMode === true) {
          this.gridOptions.btns[0].visible = true;
          this.gridOptions.btns[1].visible = true;
        } else {
          this.gridOptions.btns[0].visible = false;
          this.gridOptions.btns[1].visible = false;
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
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.deleteUrl = transactionConfig.saf.inspection.deptdelete.url;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '10%',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005346'),
          dataField: 'chkStartDt',
          width: '20%',
          editRenderer: {
            type: 'CalendarRenderer',
            defaultFormat: 'yyyy-mm-dd', // 달력 선택 시 데이터에 적용되는 날짜 형식
            showEditorBtn: false,
            showEditorBtnOver: false, // 마우스 오버 시 에디터버턴 출력 여부
            onlyCalendar: true, // 사용자 입력 불가, 즉 달력으로만 날짜입력 (기본값 : true)
            showExtraDays: true, // 지난 달, 다음 달 여분의 날짜(days) 출력
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005347'),
          dataField: 'chkEndDt',
          width: '20%',
          editRenderer: {
            type: 'CalendarRenderer',
            defaultFormat: 'yyyy-mm-dd', // 달력 선택 시 데이터에 적용되는 날짜 형식
            showEditorBtn: false,
            showEditorBtnOver: false, // 마우스 오버 시 에디터버턴 출력 여부
            onlyCalendar: true, // 사용자 입력 불가, 즉 달력으로만 날짜입력 (기본값 : true)
            showExtraDays: true, // 지난 달, 다음 달 여분의 날짜(days) 출력
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'chkDesc',
          width: '30%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002568'),
          dataField: 'showChkFinishYn',
          width: '10%',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002569'),
          dataField: 'chkFinishDt',
          width: '10%',
          editable: false,
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001300'),
          color: 'orange',
          btnClicked: 'btnAddRow',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003225'),
          color: 'red',
          btnClicked: 'btnDelRow',
          visible: true,
        },
      ];

      this.getList();
    },
    getList() {
      if (!this.inspectionPlan.implChkPlanNo) return;
      this.$http.url = selectConfig.saf.inspection.deptList.url;
      this.$http.param = { implChkPlanNo: this.inspectionPlan.implChkPlanNo };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.inspectionPlan.inspectionSHDetp = this.gridOptions.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
    cellEditEndHandler() {
      this.inspectionPlan.inspectionSHDetp = this.YAuiGrid.getGridData();
    },
    btnAddRow() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '60%';
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000001293'; // '부서 선택';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        plantCd: this.inspectionPlan.plantCd,
        multiple: true,
        isSubDeptSelection: true,
      };

      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    btnPopupInsertClicked(data) {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '60%';
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000001293'; // '부서 선택';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        plantCd: this.inspectionPlan.plantCd,
        multiple: true,
        isSubDeptSelection: true,
      };

      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data && data.length) {
        this.$_.forEach(data, (user) => {
          // 중복방지
          let existDept = this.$_.filter(
            this.YAuiGrid.getGridData(),
            (u) => u.deptCd === user.deptCd
          );
          if (!existDept.length) {
            let row = {
              userNm: user.userNm, // 성명
              deptCd: user.deptCd, // 부서코드
              deptNm: user.deptNm, // 부서명
              chkDesc: '', // 비고
              chkStartDt: this.inspectionPlan.assessDt[0]
                ? this.inspectionPlan.assessDt[0]
                : '',
              chkEndDt: this.inspectionPlan.assessDt[1]
                ? this.inspectionPlan.assessDt[1]
                : '',
              chkFinishYn: 'N', // 평가완료여부
              showChkFinishYn: '미완료',
              implChkDeptNo: 0,
            };
            this.YAuiGrid.addRow(row, 'first');
          }
        });
        this.inspectionPlan.inspectionSHDetp = this.YAuiGrid.getGridData();
      }
    },
    btnDelRow() {
      if (this.updateMode) {
        let removeData = this.YAuiGrid.getCheckedRowItems();
        if (!removeData || removeData.length === 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000057', // 삭제할 항목을 선택해주세요.
            type: 'warning', // success / info / warning / error
          });
          return;
        }
        let checkMy = 0;
        this.$_.forEach(removeData, (item) => {
          if (item.item.chkFinishYn === '완료') {
            checkMy++;
          }
        });
        if (checkMy > 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: 'M0000001612',
            type: 'warning',
          });
          return;
        }

        let selectItem = [];
        this.$_.forEach(removeData, (item) => {
          selectItem.push(item.item);
        });
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000012', // 삭제하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            this.deleteValue = {
              data: Object.values(this.$_.clone(selectItem)),
            };
            this.$http.url = this.deleteUrl;
            this.$http.param = this.deleteValue;
            this.$http.type = 'DELETE';
            this.$http.request(
              (_result) => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000007', // 삭제되었습니다.
                  type: 'success',
                });
                this.getList();
              },
              (_error) => {}
            );
          },
          // 취소 callback 함수
          cancelCallback: () => {},
        });
      } else {
        let removeData = this.YAuiGrid.getCheckedRowItems();
        if (!removeData || removeData.length === 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'M0000000057', // 삭제할 항목을 선택해주세요.
            type: 'warning', // success / info / warning / error
          });
          return;
        }
        let checkMy = 0;
        this.$_.forEach(removeData, (item) => {
          if (item.item.chkFinishYn === '완료') {
            checkMy++;
          }
        });
        if (checkMy > 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: 'M0000001612',
            type: 'warning',
          });
          return;
        }
        for (let i = 0; i < removeData.length; i++) {
          this.YAuiGrid.removeRow(removeData[i].rowIndex);
        }
        this.cellEditEndHandler();
      }
    },
    deleteRow() {
      if (!this.selectedValues || !this.selectedValues.length) {
        this.$comm.alertWarning('M0000001614'); // 선택된 항목이 없습니다.
        return;
      }
      if (this.selectedValues.chkFinishYn === '완료') {
        this.$comm.alertWarning('M0000001612'); // 평가완료여부가 완료인상태는 삭제가 불가합니다.
        return;
      }
      this.$_.forEach(this.selectedValues, (item) => {
        this.gridOptions.data.splice(
          this.$_.findIndex(this.gridOptions.data, {
            deptCd: item.deptCd,
          }),
          1
        );
      });
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
      if (this.selectedValues.chkFinishYn === '완료') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000057', // 평가완료여부가 완료인상태는 삭제가 불가합니다.
          type: 'warning',
        });
        return;
      }
      let filterValues = [];
      this.$_.forEach(this.selectedValues, (item) => {
        if (item.implChkDeptNo !== 0) {
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
      this.$_.forEach(this.selectedValues, (item) => {
        this.gridOptions.data.splice(
          this.$_.findIndex(this.gridOptions.data, {
            deptCd: item.deptCd,
          }),
          1
        );
      });
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
  },
};
</script>
