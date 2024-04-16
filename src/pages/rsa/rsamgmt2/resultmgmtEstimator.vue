<!--
  목적 : 평가결과 관리
  작성자 : pkj
  Detail : 평가결과 관리 평가자
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
            <!-- 평가리더 -->
            <y-tree-dept
              :editable="false"
              :required="true"
              label="L0000005088"
              :plantCd="rsaRiskAssessResult.plantCd"
              v-model="rsaRiskAssessResult.deptReaderDeptCd"
            />
          </b-col>
          <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
            <!-- 담당자 -->
            <y-text
              :width="5"
              ui="bootstrap"
              :editable="apprMode"
              :disabled="apprMode"
              name="deptReaderNm"
              v-model="rsaRiskAssessResult.deptReaderNm"
              :appendIcon="[
                { icon: 'times', callbackName: 'clear' },
                { icon: 'search', callbackName: 'searchUser' },
              ]"
              @searchUser="btnDeptSearchUserClicked"
              @clear="clear"
            ></y-text>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3"></b-col>
        </b-row>
      </b-col>
      <b-col sm="6" class="mt-3">
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 내부평가자 추가 -->
          <y-btn
            v-if="apprMode"
            title="L0000005139"
            color="blue"
            @btnClicked="btnAddRow"
          />
          <!-- 행삭제 -->
          <y-btn
            v-if="apprMode"
            title="L0000003225"
            color="red"
            @btnClicked="btnRemoveRow"
          />
        </div>
        <!-- 내부평가자 목록 -->
        <y-data-table
          label="L0000004988"
          ref="dataTable"
          :editable="apprMode"
          :height="gridOptions.height"
          :headers="gridOptions.header"
          :items="gridOptions.data"
          :popMode="true"
          v-model="selectedValues"
        >
          <el-table-column
            v-if="apprMode"
            type="selection"
            slot="selection"
            align="center"
            width="55"
          ></el-table-column>
        </y-data-table>
      </b-col>

      <b-col sm="6" class="mt-3">
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 외부평가자추가 -->
          <y-btn
            v-if="apprMode"
            title="L0000005140"
            color="blue"
            @btnClicked="btnAddOutRow"
          />
          <!-- 행삭제 -->
          <y-btn
            v-if="apprMode"
            title="L0000003225"
            color="red"
            @btnClicked="btnRemoveOutRow"
          />
        </div>
        <!-- 외부평가자 목록 -->
        <y-data-table
          label="L0000004989"
          ref="dataTable2"
          :editable="apprMode"
          :height="gridOutOptions.height"
          :headers="gridOutOptions.header"
          :items="gridOutOptions.data"
          :popMode="true"
          v-model="selectedOutValues"
        >
          <el-table-column
            v-if="apprMode"
            type="selection"
            slot="selection"
            align="center"
            width="55"
          ></el-table-column>
        </y-data-table>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'rsa-result-detail-estimator',
  props: {
    rsaRiskAssessResult: {
      type: Object,
      default: () => ({
        assessPlanNo: 0,
        assessDeptNo: 0,
        plantCd: '', // 사업장 코드
        mainDeptCd: '',
        deptCd: '',
        assessYear: '',
        assessTypeCd: '',
        regRegdemCd: '',
        assessNm: '',
        assessDt: null,
        deptReaderId: '',
        deptReaderNm: '',
        deptReaderDeptCd: '',
        assessStartDt: '',
        assessEndDt: '',
        assessDesc: '',
        rapprRqstNo: 0,
        rapprRqstNm: '',
        assessRsltNo: 0,
        imprCaseCnt: 0,
        assessRsltDesc: '',
        estimatorInList: [],
        estimatorOutList: [],
      }),
    },
    editable: false,
    apprMode: false,
    EstimatorLoad: false,
  },
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: 300,
      },
      selectedValues: [], // 평가자 선택항목
      gridOutOptions: {
        header: [],
        data: [],
        height: 300,
      },
      selectedOutValues: [], // 평가자(외부) 선택항목
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchUrl: '',
    };
  },
  computed: {},
  watch: {
    'rsaRiskAssessResult.assessPlanNo': {
      handler: function(oldV, newV) {
        this.gridOptions.data = this.rsaRiskAssessResult.estimatorInList;
        this.gridOutOptions.data = this.rsaRiskAssessResult.estimatorOutList;
      },
      deep: true,
    },
    EstimatorLoad() {
      this.rsaRiskAssessResult.estimatorInList = this.gridOptions.data;
      this.rsaRiskAssessResult.estimatorOutList = this.gridOutOptions.data;
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // this.searchUrl = selectConfig.rsa.rsaResult.estList.url;

      this.rsaRiskAssessResult.deptReaderDeptCd = this.rsaRiskAssessResult.mainDeptCd;

      this.gridOptions.header = [
        {
          text: 'L0000001630' /* 성명 */,
          name: 'userNm',
          width: '100px',
          align: 'center',
        },
        {
          text: 'L0000001662' /* 소속 */,
          name: 'deptNm',
          width: '150px',
          align: 'center',
        },
        {
          text: 'L0000002772' /* 직책 */,
          name: 'positionNm',
          width: '100px',
          align: 'center',
        },
        {
          text: 'L0000001360' /* 비고 */,
          name: 'raterDesc',
          width: '200px',
          align: 'left',
          type: 'text',
          maxlength: 200,
        },
      ];
      this.gridOutOptions.header = [
        {
          text: 'L0000001630' /* 성명 */,
          name: 'userNm',
          width: '100px',
          align: 'center',
          type: 'text',
          maxlength: 20,
        },
        {
          text: 'L0000001662' /* 소속 */,
          name: 'companyNm',
          width: '150px',
          align: 'center',
          type: 'text',
          maxlength: 40,
        },
        {
          text: 'L0000002772' /* 직책 */,
          name: 'positionNm',
          width: '100px',
          align: 'center',
          type: 'text',
          maxlength: 20,
        },
        {
          text: 'L0000001360' /* 비고 */,
          name: 'raterDesc',
          width: '200px',
          align: 'left',
          type: 'text',
          maxlength: 200,
        },
      ];
    },
    // 평가자 추가
    btnAddRow() {
      // 사용자 검색 팝업
      this.btnSearchUserClicked();
    },
    // 평가자 삭제
    btnRemoveRow() {
      this.$_.forEach(this.selectedValues, item => {
        // 저장된 항목이면 삭제목록에 추가
        if (item.raEmpNo) {
          // 중복방지
          let delUser = this.$_.filter(
            this.smtRaRev.deleteRsaResultEsimators,
            u => u.raEmpNo === item.raEmpNo
          );
          if (!delUser.length) {
            this.smtRaRev.deleteRsaResultEsimators.push(item);
          }
        }
        this.gridOptions.data = this.$_.reject(this.gridOptions.data, item);
      });
    },
    // 사용자 검색 팝업
    btnSearchUserClicked() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.rsaRiskAssessResult.plantCd,
        deptCd: this.rsaRiskAssessResult.mainDeptCd,
        multiple: true,
      };
      this.popupOptions.title = '사용자검색';
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    // 사용자 검색 팝업 callback
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.users && data.users.length) {
        this.$_.forEach(data.users, user => {
          // 중복방지
          let existUser = this.$_.filter(
            this.gridOptions.data,
            u => u.userId === user.userId
          );
          if (!existUser.length) {
            this.gridOptions.data.push({
              assessDeptNo:
                this.rsaRiskAssessResult.assessDeptNo === 0
                  ? 0
                  : this.rsaRiskAssessResult.assessDeptNo, //
              userId: user.userId, // 사용자 ID
              userNm: user.userNm, // 성명
              deptCd: user.deptCd, // 부서코드
              deptNm: user.deptNm, // 부서명
              positionNm: user.positionNm, // 직위명
              raterDesc: '', // 비고
            });
          }
        });
      }
    },
    // 평가자(외부) 추가
    btnAddOutRow() {
      this.gridOutOptions.data.push({
        assessDeptNo:
          this.rsaRiskAssessResult.assessDeptNo === 0
            ? 0
            : this.rsaRiskAssessResult.assessDeptNo, //
        userNm: '', // 성명
        companyNm: '', // 직위명
        positionNm: '', // 직책
        raterDesc: '', // 비고
      });
    },
    // 평가자(외부) 삭제
    btnRemoveOutRow() {
      this.$_.forEach(this.selectedOutValues, item => {
        // 저장된 항목이면 삭제목록에 추가
        if (item.raEmpNo) {
          // 중복방지
          let delUser = this.$_.filter(
            this.smtRaRev.deleteRsaResultEsimators,
            u => u.raEmpNo === item.raEmpNo
          );
          if (!delUser.length) {
            this.smtRaRev.deleteRsaResultEsimators.push(item);
          }
        }
        this.gridOutOptions.data = this.$_.reject(
          this.gridOutOptions.data,
          item
        );
      });
    },
    btnDeptSearchUserClicked() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.rsaRiskAssessResult.plantCd,
        deptCd: this.rsaRiskAssessResult.mainDeptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupUser;
    },
    closePopupUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.rsaRiskAssessResult.deptReaderId = data.user.userId;
        this.rsaRiskAssessResult.deptReaderDeptCd = data.user.deptCd;
        this.rsaRiskAssessResult.deptNm = data.user.deptNm;
        this.rsaRiskAssessResult.deptReaderNm = data.user.userNm;
      }
    },
    clear() {
      this.rsaRiskAssessResult.deptReaderId = null;
      this.rsaRiskAssessResult.deptReaderNm = null;
    },
  },
};
</script>
