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
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 팀추가 -->
            <y-btn
              v-if="editable && apprMode"
              title="L0000005905"
              color="orange"
              @btnClicked="btnPopupInsertClicked"
            />

            <!-- 행삭제 -->
            <y-btn
              v-if="editable && apprMode"
              title="L0000003225"
              color="red"
              @btnClicked="deleteRow"
            />
          </div>
          <!-- 평가대상 작업 목록 -->
          <y-data-table
            :editable="editable && apprMode"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="selectedValues"
            label="L0000003072"
          >
            <el-table-column
              v-if="editable && apprMode"
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
      }),
    },
    deptListLoad: false,
    updateMode: false,
    deptReLoad: false,
    apprMode: false,
    apprFlag: false,
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
      },
      editable: true,
      selectedValues: [], // 그리드 선택 목록
      // deptList: [],
      deleteValue: null,
      deleteUrl: '',
      isDelete: false,
      detailUrl: '',
    };
  },
  watch: {
    deptListLoad() {
      this.Planmgmt.planmgmtDeptList = this.gridOptions.data;
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
      this.deleteUrl = transactionConfig.rsa.planmgmtdeptlist2.delete.url;
      this.detailUrl = selectConfig.rsa.planmgmt2.get.url;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 대상팀
        {
          text: 'L0000000927',
          name: 'deptNm',
          width: '130px',
          align: 'center',
        },
        {
          // 평가시작일
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
          width: '130px',
          align: 'center',
          type: 'text',
        },
        {
          // 평가완료여부
          text: 'L0000004979',
          name: 'assessFinishYn',
          width: '130px',
          align: 'center',
        },
        {
          // 평가완료일
          text: 'L0000004980',
          name: 'assessFinishDt',
          width: '130px',
          align: 'center',
        },
      ];
      this.getList();
    },

    getList() {
      if (!this.Planmgmt.assessPlanNo) return;
      this.$http.url = this.$format(this.detailUrl, this.Planmgmt.assessPlanNo);
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.Planmgmt.planmgmtDeptList = _result.data.planmgmtDeptList;
          this.Planmgmt.plantCd = _result.data.plantCd;
          this.gridOptions.data = this.Planmgmt.planmgmtDeptList;

          if (
            this.Planmgmt.stepCd === 'BAPSG' ||
            this.Planmgmt.stepCd === 'BAPSA'
          ) {
            this.editable = false;
          }
          if (this.apprFlag) {
            this.editable = false;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    btnPopupInsertClicked() {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearch.vue'}`);
      this.popupOptions.title = 'L0000004209'; // 팀검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        multiple: true,
        defaultExpandAll: true,
        plantCd: this.Planmgmt.plantCd,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data && data.success) {
        if (data.depts) {
          this.$_.forEach(data.depts, (dept) => {
            let index = this.$_.findIndex(this.gridOptions.data, {
              deptCd: dept.deptCd,
            });
            if (index === -1) {
              this.gridOptions.data.push({
                deptCd: dept.deptCd,
                deptNm: dept.deptNm,
                assessStartDate: '',
                assessEndDate: '',
                remarks: '',
                completeYn: '완료',
                assessDate: this.$comm.getToday(),
              });
            }
          });
        }
      }
    },
    deleteRow() {
      if (!this.selectedValues || !this.selectedValues.length) {
        this.$comm.alertWarning('M0000001614'); // 선택된 항목이 없습니다.
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
