<!--
  목적 : 환경 > 대기 > 운영일지(관리자)
  작성자 : LHJ
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작업기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002373"
            name="evalPeriod"
            default="searchParam.evalPeriod"
            v-model="searchParam.evalPeriod"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 진행상태 -->
          <y-select
            :width="8"
            :comboItems="stepCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002779"
            name="stepCd"
            v-model="searchParam.stepCd"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000908')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
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
  name: 'operation-log',
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        height: '50%',
        param: {},
        closeCallback: null,
        stepCd: '',
      },
      searchParam: {
        evalPeriod: [],
        mgDeptCd: '',
        deptCd: '',
        plantCd: '',
        fromDate: '',
        toDate: '',
      },
      gridOptions: {
        name: 'operationLogAdmin',
        header: [],
        data: [],
        btns: [],
        height: '400',
      },
      editable: true,
      stepCdItems: [],
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
  beforeDestroy() {},
  destroyed() {},

  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam.evalPeriod.push(
        this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '-7d',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        )
      );
      this.searchParam.evalPeriod.push(
        this.$comm.moment().format('YYYY-MM-DD')
      );

      this.$comm.getComboItems('SAF_PROCESS_STEP', true).then((_result) => {
        this.stepCdItems = _result;
      });
      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '9%',
          style: 'center-align',
        },
        // 진행상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'),
          dataField: 'stepNm',
          width: '9%',
          style: 'grid-link-cell',
        },
        // 결재상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000428'),
          dataField: 'bizApprStepNm',
          width: '9%',
          style: 'grid-link-cell',
        },
        // 작성일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002354'),
          dataField: 'measureYmd',
          width: '9%',
          style: 'center-align',
        },
        // 날씨
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000803'),
          dataField: 'weatherNm',
          width: '9%',
        },
        // 온도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002028'),
          dataField: 'temp',
          width: '9%',
          style: 'right-align',
        },
        // 대상부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'),
          dataField: 'tgtCnt',
          width: '9%',
          style: 'grid-link-cell',
        },
        // 작성부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002348'),
          dataField: 'writeCnt',
          width: '9%',
          style: 'grid-link-cell',
        },
        // 미작성부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004783'),
          dataField: 'noCnt',
          width: '9%',
          style: 'grid-link-cell',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '9%',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
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
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList();
    },

    getList() {
      this.searchParam.startYmd = this.searchParam.evalPeriod[0];
      this.searchParam.endYmd = this.searchParam.evalPeriod[1];
      this.$http.url = selectConfig.env.air.opLog.admin.list.url;
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
    cellClickHandler(event) {
      if (event.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(event.item);
      } else {
        this.openPopup(event.dataField, event.item);
      }
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.apprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openPopup(header, data) {
      if (header === 'stepNm') {
        this.popupOptions.target = () =>
          import(`${'./operationLogAdminBase.vue'}`);
        this.popupOptions.title = 'L0000000907'; // 대기 운영일지
        this.popupOptions.param = {
          measureYmd: data.measureYmd,
          deptCd: data.deptCd,
          plantCd: data.plantCd,
        };
        this.popupOptions.visible = true;
        this.popupOptions.width = '90%';
        this.popupOptions.top = '10px';
        this.popupOptions.closeCallback = this.closePopup;
      } else if (
        header === 'tgtCnt' ||
        header === 'writeCnt' ||
        header === 'noCnt'
      ) {
        this.popupOptions.target = () =>
          import(`${'./operationLogAdminDept.vue'}`);
        this.popupOptions.title = 'L0000004784'; // 대기 운영일지 // 대기 운영일지 부서별 작성정보
        this.popupOptions.param = data;
        this.popupOptions.visible = true;
        this.popupOptions.width = '90%';
        this.popupOptions.top = '10px';
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnSearchClickedCallback(result) {
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
