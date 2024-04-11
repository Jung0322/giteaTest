<!--
  목적 : 환경 > 환경영향평가 > 환경영향평가 계획
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!--검색 -->
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <!--사업주관부서-->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            name="deptNm"
            label="L0000002713"
            v-model="searchParam.deptNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchDept' },
            ]"
            @searchDept="searchDept"
            @clear="clearDept"
          />
        </b-col>
        <!--대상부서-->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            name="tgtDeptNm"
            label="L0000000927"
            v-model="searchParam.tgtDeptNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchDept' },
            ]"
            @searchDept="searchTgtDept"
            @clear="clearTgtDept"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
          <!-- 진행상태 -->
          <y-select
            :width="8"
            :comboItems="apprStepCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002779"
            name="apprStepCd"
            v-model="searchParam.apprStepCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
          <!-- 평가구분 -->
          <y-select
            :width="8"
            :comboItems="envEffEvalDivCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000003059"
            name="envEffEvalDivCd"
            v-model="searchParam.envEffEvalDivCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
          <!-- 대상년도 -->
          <y-datepicker
            :width="8"
            type="year"
            :range="true"
            name="evalYearPeriod"
            label="L0000004449"
            v-model="searchParam.evalYearPeriod"
          />
        </b-col>
        <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-6">
          <!-- 평가명 -->
          <y-text
            :width="10"
            ui="bootstrap"
            label="L0000003081"
            name="evalTitle"
            v-model="searchParam.evalTitle"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 환경영향평가 계획 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003331')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'env-effect-eval-rslt-list',
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '',
        deptCd: '',
        deptNm: '',
        tgtDeptCd: '',
        tgtDeptNm: '',
        envEffEvalPlanStepCd: 'EEE02',
        envEffEvalDivCd: '',
        evalTitle: '',
        evalYearPeriod: [],
        evalYearFrom: '',
        evalYearTo: '',
        apprStepCd: '',
      },
      gridOptions: {
        name: 'envEffectEvalRsltList',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      searchUrl: '',

      envEffEvalDivCdItems: [],
      apprStepCdItems: [],
    };
  },
  computed: {},
  watch: {},
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
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.gridOptions.header = [
        {
          /* 사업장 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
          style: 'center-align',
        },
        {
          /* 사업주관부서 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'),
          dataField: 'deptNm',
          width: '10%',
          style: 'center-align',
        },
        {
          /* 대상년도 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000004449'),
          dataField: 'evalYear',
          width: '7%',
          style: 'center-align',
        },
        {
          /* 평가기간 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003062'),
          dataField: 'evalPeriod',
          width: '16%',
          style: 'center-align',
        },
        {
          /* 평가구분 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003059'),
          dataField: 'envEffEvalDivNm',
          width: '10%',
          style: 'center-align',
        },
        {
          /* 평가명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'),
          dataField: 'evalTitle',
          width: '10%',
          style: 'center-align grid-link-cell',
        },
        {
          /* 대상부서 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'),
          dataField: 'tgtDeptNm',
          width: '10%',
          style: 'center-align',
        },
        {
          /* 진행상태 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'),
          dataField: 'apprStepNm',
          width: '10%',
          style: 'center-align grid-link-cell',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writeUserNm',
          width: '10%',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writeDt',
          width: '10%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      this.searchUrl = '/api/env/enveffectevalplan/plans';

      // 기간 Setting
      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(today, '-1y', 'YYYY', 'YYYY');
      var to = this.$comm.moment(today).format('YYYY');
      this.searchParam.evalYearPeriod = [from, to];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getComboItems('ENV_EFF_EVAL_DIV_CD');
      this.getComboItems('COM_BIZ_APPR_STEP');
      this.getList();
    },
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'ENV_EFF_EVAL_DIV_CD') {
            this.envEffEvalDivCdItems = this.$_.clone(_result.data);
            this.envEffEvalDivCdItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); /* 전체 */
          }
          if (codeGroupCd === 'COM_BIZ_APPR_STEP') {
            this.apprStepCdItems = this.$_.clone(_result.data);
            this.apprStepCdItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); /* 전체 */
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      this.searchParam.evalYearFrom = this.searchParam.evalYearPeriod[0];
      this.searchParam.evalYearTo = this.searchParam.evalYearPeriod[1];

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkClicked(data) {
      if (!data) return;
      if (data.dataField === 'apprStepNm') {
        this.popupOptions.target = () =>
          import('@/pages/appr/apprProgressPopup');
        this.popupOptions.title = 'L0000000452'; // 결재진행상태
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          apprRqstNo:
            data.envEffEvalPlanStepCd === 'EEE01'
              ? data.item.planApprRqstNo
              : data.item.rsltApprRqstNo, // 결재번호
        };
        this.popupOptions.closeCallback = this.closePopup;
      } else if (data.dataField === 'evalTitle') {
        this.popupOptions.target = () =>
          import(`${'./envEffectEvalRsltDetail.vue'}`);
        this.popupOptions.title = 'L0000004898'; /* 환경영향평가 결과 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '90%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          evalPlanNo: data.item.evalPlanNo,
          bizApprStepCd: '',
          apprFlag: false,
          apprRqstNo: 0,
          viewMode: false,
        };
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    searchDept(_item) {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000004627'; // 부서검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '35%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closeSearchDept;
    },
    closeSearchDept(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.dept) {
        this.searchParam.deptCd = data.dept.deptCd;
        this.searchParam.deptNm = data.dept.deptNm;
      }
    },
    clearDept() {
      this.searchParam.deptCd = null;
      this.searchParam.deptNm = null;
    },
    searchTgtDept(_item) {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000004627'; // 부서검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '35%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closeSearchTgtDept;
    },
    closeSearchTgtDept(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.dept) {
        this.searchParam.tgtDeptCd = data.dept.deptCd;
        this.searchParam.tgtDeptNm = data.dept.deptNm;
      }
    },
    clearTgtDept() {
      this.searchParam.tgtDeptCd = null;
      this.searchParam.tgtDeptNm = null;
    },
    btnSearchClickedCallback(result) {
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 370;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
