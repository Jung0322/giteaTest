<!--
  목적 : 환경 > 환경영향평가 > 중요 환경측명(영향) 등록부
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
          <!-- 대상공정 -->
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            name="tgtProcessNm"
            label="L0000000919"
            v-model="searchParam.tgtProcessNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'search' },
            ]"
            @search="searchTgtProcess"
            @clear="clearTgtProcess"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
          <!-- 대상설비 -->
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            name="safFacilityNm"
            label="L0000000931"
            v-model="searchParam.safFacilityNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'search' },
            ]"
            @search="searchSafFacility"
            @clear="clearSafFacility"
          />
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
        <!-- <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6"> -->
        <!-- 등급 -->
        <!-- <y-select
            :width="8"
            :comboItems="impoRateItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000003944"
            name="impoRate"
            v-model="searchParam.impoRate"
          ></y-select> -->
        <!-- </b-col> -->
      </b-row>
    </y-search-box>

    <!-- 환경영향평가 계획 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
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
  name: 'env-effect-eval-impo-list',
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '',
        deptCd: '',
        deptNm: '',
        tgtDeptCd: '',
        tgtDeptNm: '',
        tgtProcessCd: '',
        tgtProcessNm: '',
        safFacilityCd: '',
        safFacilityNm: '',

        evalTitle: '',
        impoRate: '',

        evalYearPeriod: [],
        evalYearFrom: '',
        evalYearTo: '',
      },
      gridOptions: {
        name: 'envEffectEvalImpoList',
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

      impoRateItems: [],
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

      this.searchUrl = '/api/env/enveffectevalplan/impo/results';

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

      this.impoRateItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'H', codeNm: 'H' },
        { code: 'M', codeNm: 'M' },
        { code: 'L', codeNm: 'L' },
      ];

      this.setHeader();
      this.getList();
    },
    setHeader() {
      let header = [
        { /* 개선진행상태 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000000282'),
          dataField: 'imprStepNm',
          width: '100',
          style: 'center-align grid-link-cell',
        },
        { /* 사업장 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '100',
          style: 'center-align',
        },
        { /* 사업주관부서 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'),
          dataField: 'deptNm',
          width: '120',
          style: 'center-align',
        },
        { /* 대상년도 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000004449'),
          dataField: 'evalYear',
          width: '90',
          style: 'center-align',
        },
        { /* 평가기간 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003062'),
          dataField: 'evalPeriod',
          width: '200',
          style: 'center-align',
        },
        { /* 평가명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'),
          dataField: 'evalTitle',
          width: '200',
          style: 'center-align',
        },
        { /* 대상부서 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'),
          dataField: 'tgtDeptNm',
          width: '90',
          style: 'center-align',
        },
        { // 활동
          headerText: this.$comm.getLangSpecInfoLabel('L0000004911'),
          style: 'center-align',
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003659'),
              dataField: 'safFacilityNm',
              width: '200',
              style: 'center-align',
            }, // 설비
            { // 세부공정
              headerText: this.$comm.getLangSpecInfoLabel('L0000004912'),
              dataField: 'detailProcess',
              width: '100',
              style: 'center-align',
            },
          ],
        },
        { // 기초정보
          headerText: this.$comm.getLangSpecInfoLabel('L0000004913'),
          style: 'center-align',
          children: [
            { // 구동설비(KJ/day)
              headerText: this.$comm.getLangSpecInfoLabel('L0000004914'),
              style: 'center-align',
              children: [
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004915'),
                  dataField: 'facilityNm',
                  width: '120',
                  style: 'center-align',
                }, // 구동설비명
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000001996'),
                  dataField: 'facilityFuel',
                  width: '120',
                  style: 'center-align',
                }, // 연료
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000001445'),
                  dataField: 'facilityAmt',
                  width: '100',
                  style: 'center-align',
                }, // 사용량
              ],
            },
            { // 입력(ton/day)
              headerText: this.$comm.getLangSpecInfoLabel('L0000004916'),
              style: 'center-align',
              children: [
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004917'),
                  dataField: 'inputNm',
                  width: '120',
                  style: 'center-align',
                }, // 입력물
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004918'),
                  dataField: 'inputAmt',
                  width: '100',
                  style: 'center-align',
                }, // 입력량
              ],
            },
            { // 출력(ton/day)
              headerText: this.$comm.getLangSpecInfoLabel('L0000004919'),
              style: 'center-align',
              children: [
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004920'),
                  dataField: 'outputNm',
                  width: '120',
                  style: 'center-align',
                }, // 출력물
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004921'),
                  dataField: 'outputAmt',
                  width: '100',
                  style: 'center-align',
                }, // 출력량
              ],
            },
            { // 부산물(ton/day)
              headerText: this.$comm.getLangSpecInfoLabel('L0000004922'),
              style: 'center-align',
              children: [
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004923'),
                  dataField: 'residueNm',
                  width: '120',
                  style: 'center-align',
                }, // 부산물
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004924'),
                  dataField: 'residueAmt',
                  width: '100',
                  style: 'center-align',
                }, // 부산물량
              ],
            },
          ],
        },
        { // 환경측면
          headerText: this.$comm.getLangSpecInfoLabel('L0000003332'),
          style: 'center-align',
          children: [
            { // 발생조건
              headerText: this.$comm.getLangSpecInfoLabel('L0000004925'),
              dataField: 'envGen',
              width: '100',
              style: 'center-align',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004926'),
              dataField: 'envAct',
              width: '200',
              style: 'center-align',
            }, // 상세활동
          ],
        },
        { // 환경영향
          headerText: this.$comm.getLangSpecInfoLabel('L0000004927'),
          style: 'center-align',
          children: [
            { // 환경분야
              headerText: this.$comm.getLangSpecInfoLabel('L0000004928'),
              dataField: 'envImpDiv',
              width: '120',
              style: 'center-align',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004929'),
              dataField: 'envImpMng',
              width: '200',
              style: 'center-align',
            }, // 통제/관리방안
            { // 환경이슈
              headerText: this.$comm.getLangSpecInfoLabel('L0000004930'),
              dataField: 'envImpIssue',
              width: '100',
              style: 'center-align',
            },
          ],
        },
        { // 중요성평가
          headerText: this.$comm.getLangSpecInfoLabel('L0000004931'),
          style: 'center-align',
          children: [
            { // 발생가능성
              headerText: this.$comm.getLangSpecInfoLabel('L0000004932'),
              dataField: 'impoGen',
              width: '100',
              style: 'center-align',
            },
            { // 부정적영향
              headerText: this.$comm.getLangSpecInfoLabel('L0000004933'),
              style: 'center-align',
              children: [
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004933'),
                  dataField: 'impoEffect',
                  width: '100',
                  style: 'center-align',
                }, // 부정적영향
                { // 유해성
                  headerText: this.$comm.getLangSpecInfoLabel('L0000002166'),
                  dataField: 'impoToxic',
                  width: '100',
                  style: 'center-align',
                },
                {
                  headerText: this.$comm.getLangSpecInfoLabel('Score'),
                  dataField: 'impoToxicScore',
                  width: '70',
                  style: 'center-align',
                },
                { // 양
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004934'),
                  dataField: 'impoQnt',
                  width: '100',
                  style: 'center-align',
                },
                {
                  headerText: this.$comm.getLangSpecInfoLabel('Score'),
                  dataField: 'impoQntScore',
                  width: '70',
                  style: 'center-align',
                },
                { // 통제방안
                  headerText: this.$comm.getLangSpecInfoLabel('L0000004935'),
                  dataField: 'impoCtrl',
                  width: '100',
                  style: 'center-align',
                },
                {
                  headerText: this.$comm.getLangSpecInfoLabel('Score'),
                  dataField: 'impoCtrlScore',
                  width: '70',
                  style: 'center-align',
                },
              ],
            },
            { // 가중치
              headerText: this.$comm.getLangSpecInfoLabel('L0000000218'),
              dataField: 'impoWeight',
              width: '80',
              style: 'center-align',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004936'),
              dataField: 'impoSeriousness',
              width: '80',
              style: 'center-align',
            }, // 심각성
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003944'),
              dataField: 'impoRate',
              width: '80',
              style: 'center-align',
            }, // 등급
            { // 유형
              headerText: this.$comm.getLangSpecInfoLabel('L0000002203'),
              dataField: 'impoType',
              width: '80',
              style: 'center-align',
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004937'),
          dataField: 'confDesc',
          width: '200',
          style: 'center-align',
        }, // 대응방안
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004938'),
          dataField: 'envImpoYnNm',
          width: '100',
          style: 'center-align',
        }, // 중요 환경영향 여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004939'),
          dataField: 'managerComment',
          width: '300',
          style: 'center-align',
        }, // 환경담당자 의견
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writeUserNm',
          width: '120',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writeDt',
          width: '120',
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

      this.gridOptions.header = header;
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
      if (data.dataField === 'imprStepNm') {
        this.popupOptions.param = {
          safImprActNo: data.item.safImprActNo,
          imprClassCd: data.item.imprClassCd,
          refTableId: data.item.refTableId,
          flag: 'DETAIL',
        };

        this.popupOptions.title = 'L0000003458'; /* 개선요청상세 */
        this.popupOptions.target = () =>
          import(`${'../../impr/improveDetail.vue'}`);

        this.popupOptions.top = '10px';
        this.popupOptions.width = '80%';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
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
      this.popupOptions.title = 'L0000004627';
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
    searchTgtProcess() {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/process.vue'}`);
      this.popupOptions.title = 'L0000000515'; // 공정
      this.popupOptions.visible = true;
      this.popupOptions.top = '100px';
      this.popupOptions.width = '60%';
      this.popupOptions.param = {
        popupMode: true,
        multiple: false,
        plantCd: this.searchParam.plantCd,
      };
      this.popupOptions.closeCallback = this.closeTgtProcess;
    },
    closeTgtProcess(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.process) {
        this.searchParam.tgtProcessCd = data.process.processCd;
        this.searchParam.tgtProcessNm = data.process.processNm;
      }
    },
    clearTgtProcess(data) {
      this.searchParam.tgtProcessCd = null;
      this.searchParam.tgtProcessNm = null;
    },
    searchSafFacility(_item) {
      this.popupOptions.target = () =>
        import(`${'../../baseInfo/facility/facilityMstPopup.vue'}`);
      // 설비추가
      this.popupOptions.title = 'L0000003680';
      this.popupOptions.width = '85%';
      this.popupOptions.param = {
        multiple: false,
        plantCd: this.searchParam.plantCd,
        processCd: this.searchParam.tgtProcessCd,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeSearchSafFacility;
    },
    closeSearchSafFacility(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;
      if (data) {
        this.searchParam.safFacilityCd = data.safFacilityCd;
        this.searchParam.safFacilityNm = data.facilityNm;
      }
    },
    clearSafFacility() {
      this.searchParam.safFacilityCd = null;
      this.searchParam.safFacilityNm = null;
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
