<!--
  목적 : 환경 > 환경영향평가 > 환경영향평가 목록
  Detail : 환경영향평가 목록 화면
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
        <!--        사업주관부서-->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            name="deptNm"
            label="L0000004730"
            v-model="searchParam.deptNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchDept' },
            ]"
            @searchDept="searchDept"
            @clear="clearDept"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
          <!-- 평가구분 -->
          <y-select
            :width="8"
            :comboItems="evalGubunCombos"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000003059"
            name="evalGubun"
            v-model="searchParam.evalGubun"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
          <!-- 사업진행상태 -->
          <y-select
            :width="8"
            :comboItems="evalProgStateCombos"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000004733"
            name="evalProgState"
            v-model="searchParam.evalProgState"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
          <!-- 진행단계 -->
          <y-select
            :width="8"
            :comboItems="evalStepCombos"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002777"
            name="evalStepCd"
            v-model="searchParam.evalStepCd"
          ></y-select>
        </b-col>
        <!--        대행업체-->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            name="vendorNm"
            label="L0000004734"
            v-model="searchParam.proxyVendorNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchVendor' },
            ]"
            @searchVendor="searchVendor"
            @clear="clearVendor"
          />
        </b-col>
        <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-3">
          <!-- 사업명 -->
          <y-text
            :width="10"
            ui="bootstrap"
            label="L0000004732"
            name="bizNm"
            v-model="searchParam.businessName"
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
          @btnPopupClickedCallback="btnPopupClickedCallback"
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
  name: 'env-effect-eval-list',
  props: {},
  data() {
    return {
      envEffectEval: {
        envEffectEvalNo: 0,
        plantCd: '',
        deptCd: '',
        evalGubun: '',
        evalProgState: '',
        evalStepNm: '',
        evalStepCd: '',
        proxyVendorCd: '',
        proxyYn: '',
        businessName: '',
        writerUserNm: '',
        writerDt: '',
      },
      searchParam: {
        plantCd: '',
        deptCd: '',
        deptNm: '',
        evalGubun: '',
        evalProgState: '',
        evalStepCd: '',
        proxyVendorCd: '',
        proxyVendorNm: '',
        businessName: '',
      },
      gridOptions: {
        name: 'envEffectEvalList',
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
      evalStepCombos: [],
      evalGubunCombos: [],
      evalProgStateCombos: [],
      YAuiGrid: null,
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
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
          style: 'center-align',
        } /* 사업장 */,
        {
          /* 사업주관부서 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000004730'),
          dataField: 'deptNm',
          width: '11%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003059'),
          dataField: 'evalGubun',
          width: '11%',
          style: 'center-align',
        } /* 평가구분 */,
        {
          /* 사업명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000004732'),
          dataField: 'businessName',
          width: '16%',
          style: 'left-align grid-link-cell',
        },
        {
          /* 진행단계 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002777'),
          dataField: 'evalStepNm',
          width: '11%',
          style: 'center-align',
        },
        {
          /* 사업진행상태 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000004733'),
          dataField: 'evalProgState',
          width: '11%',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004734'),
          dataField: 'proxyVendorNm',
          width: '11%',
          style: 'center-align',
        } /* 대행업체 */,
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '11%',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '11%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      this.searchUrl = selectConfig.env.envEffectEval.envEffectEval.list.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getComboItems('EVAL_STEP_CD');
      this.getComboItems('EVAL_GUBUN');
      this.getComboItems('EVAL_PROG_STATE');
      this.getList();
    },
    getList() {
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
      if (data.dataField === 'businessName') {
        this.popupOptions.target = () =>
          import(`${'./envEffectEvalDetail.vue'}`);
        this.popupOptions.title = 'L0000004728'; /* 환경영향평가 상세 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          envEffectEvalNo: data.item.envEffectEvalNo,
        };
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./envEffectEvalDetail.vue'}`);
      this.popupOptions.title = 'L0000004728'; /* 환경영향평가 상세 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        envEffectEvalNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopup;
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
      this.popupOptions.title = 'L0000004627';
      this.popupOptions.visible = true;
      this.popupOptions.width = '35%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchDept;
    },
    closePopupSearchDept(data) {
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
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'EVAL_STEP_CD') {
            this.evalStepCombos.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            }); /* 전체 */
            this.evalStepCombos = this.$_.clone(_result.data);
          }
          if (codeGroupCd === 'EVAL_GUBUN') {
            this.evalGubunCombos = this.$_.clone(_result.data);
            this.evalGubunCombos.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            }); /* 전체 */
          }
          if (codeGroupCd === 'EVAL_PROG_STATE') {
            this.evalProgStateCombos = this.$_.clone(_result.data);
            this.evalProgStateCombos.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            }); /* 전체 */
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    searchVendor() {
      this.popupOptions.target = () =>
        import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000004283'; // 협력업체 검색
      this.popupOptions.param = {
        plantCd: this.envEffectEval.plantCd,
        popupMode: true,
        multiSelect: false,
      };
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.searchParam.proxyVendorCd = data.data.vendorCd;
      this.searchParam.proxyVendorNm = data.data.vendorNm;
    },
    clearVendor() {
      this.searchParam.proxyVendorCd = '';
      this.searchParam.proxyVendorNm = '';
    },
    btnSearchClickedCallback(result) {
      this.getList();
    },
    /** end button 관련 이벤트 **/
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

<style scoped></style>
