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
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 추가 -->
            <y-btn
              v-if="editable && apprMode"
              title="L0000001300"
              color="orange"
              @btnClicked="btnPopupInsertClicked"
            />
            <!-- 삭제 -->
            <y-btn
              v-if="updateMode && editable && apprMode"
              :action-url="deleteUrl"
              :param="deleteValue"
              :is-submit="isDelete"
              title="L0000003225"
              color="red"
              action-type="DELETE"
              beforeSubmit="beforeDelete"
              @beforeDelete="beforeDelete"
              @btnClicked="btnDeleteClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <!-- 삭제 -->
            <y-btn
              v-if="!updateMode && editable && apprMode"
              title="L0000003225"
              color="red"
              @btnClicked="deleteRow"
            />
          </div>
          <!-- 정기위험성평가계획 목록 -->
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
    rsaRiskAssessPlan: {
      type: Object,
      default: () => ({
        assessPlanNo: 0,
        plantCd: '', // 사업장 코드
        assessYear: '',
        assessTypeCd: '',
        regRegdemCd: '',
        assessNm: '',
        assessDt: null,
        assessDesc: '',
        riskType: '',
        planmgmtDeptList: [],
      }),
    },
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
        height: '300',
      },
      editable: true,
      selectedValues: [], // 그리드 선택 목록
      deleteValue: null,
      deleteUrl: '',
      isDelete: false,
    };
  },
  watch: {
    deptListLoad() {
      this.rsaRiskAssessPlan.planmgmtDeptList = this.gridOptions.data;
    },
    deptReLoad() {
      setTimeout(() => {
        this.getList();
      }, 300);
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.deleteUrl = transactionConfig.rsa.planmgmtdeptlist.delete.url;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 대상부서
        {
          text: 'L0000000927',
          name: 'deptNm',
          width: '130px',
          align: 'center',
        },
        {
          // 평가일시작
          text: 'L0000004977',
          name: 'assessStartDt',
          width: '130px',
          align: 'center',
          type: 'datepicker',
        },
        {
          // 평가종료일
          text: 'L0000004978',
          name: 'assessEndDt',
          width: '130px',
          align: 'center',
          type: 'datepicker',
        },
        {
          // 비고
          text: 'L0000001360',
          name: 'assessDesc',
          width: '200px',
          align: 'center',
          type: 'text',
          maxlength: 500,
        },

        // 평가완료여부
        {
          text: 'L0000004979',
          name: 'showAssessFinishYn',
          width: '100px',
          align: 'center',
        },
        // 평가완료일
        {
          text: 'L0000004980',
          name: 'assessFinishDt',
          width: '70px',
          align: 'center',
        },
      ];
      this.getList();
    },

    getList() {
      if (!this.rsaRiskAssessPlan.assessPlanNo) return;
      this.$http.url = selectConfig.rsa.planmgmt.deptList.url;
      this.$http.param = { assessPlanNo: this.rsaRiskAssessPlan.assessPlanNo };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.rsaRiskAssessPlan.planmgmtDeptList = this.gridOptions.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
    btnPopupInsertClicked(data) {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '60%';
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000001293'; // '부서 선택';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        plantCd: this.rsaRiskAssessPlan.plantCd,
        multiple: true,
        isSubDeptSelection: true,
      };

      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      // this.getList();
      if (data && data.length) {
        this.$_.forEach(data, (user) => {
          // 중복방지
          let existDept = this.$_.filter(
            this.gridOptions.data,
            (u) => u.deptCd === user.deptCd
          );
          if (!existDept.length) {
            this.gridOptions.data.push({
              userNm: user.userNm, // 성명
              deptCd: user.deptCd, // 부서코드
              deptNm: user.deptNm, // 부서명
              assessDesc: '', // 비고
              assessStartDt: this.rsaRiskAssessPlan.assessDt[0]
                ? this.rsaRiskAssessPlan.assessDt[0]
                : '',
              assessEndDt: this.rsaRiskAssessPlan.assessDt[1]
                ? this.rsaRiskAssessPlan.assessDt[1]
                : '',
              assessFinishYn: 'N', // 평가완료여부
              showAssessFinishYn: '미완료',
              assessFinishDt: '', // 평가완료일
              assessDeptNo: 0,
            });
          }
        });
        this.rsaRiskAssessPlan.planmgmtDeptList = this.gridOptions.data;
      }
    },
    deleteRow() {
      if (!this.selectedValues || !this.selectedValues.length) {
        this.$comm.alertWarning('M0000001614'); // 선택된 항목이 없습니다.
        return;
      }
      if (this.selectedValues.assessFinishYn === '완료') {
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
      this.$_.forEach(this.selectedValues, (item) => {
        this.gridOptions.data.splice(
          this.$_.findIndex(this.gridOptions.data, {
            deptCd: item.deptCd,
          }),
          1
        );
      });
      // this.getList();
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
