<!--
  목적 : 환경 > 대기 > 자가측정 
  Detail : 자가측정 조회 화면
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
          <!-- 관리부서 -->
          <y-tree-dept
            type="search"
            label="L0000000591"
            name="mgDeptCd"
            v-model="searchParam.mgDeptCd"
            :plantCd="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작업기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002373"
            name="evalPeriod"
            v-model="searchParam.evalPeriod"
          ></y-datepicker>
        </b-col>

        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 진행단계 -->
          <y-select
            :width="8"
            :comboItems="selfManageStatusItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="selfManageStatus"
            label="L0000002777"
            v-model="searchParam.selfManageStatus"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 배출구 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001142"
            name="searchEairOutletNm"
            v-model="searchParam.searchEairOutletNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000911')"
          :useExcelExport="true"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
          @excelUploadBtnClicked="excelUploadBtnClicked"
          @tempBtnClicked="tempBtnClicked"
          @openPopup="openPopup"
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
  /* attributes: name, components, props, data */
  name: 'self-measurement',
  props: {},
  data() {
    return {
      searchParam: {
        evalPeriod: [], // 평가기간
        selfManageStatus: null, // 진행단계
        searchEairOutletNm: null, // 배출구
        plantCd: null,
        fromYmd: null,
        toYmd: null,
        mgDeptCd: '',
      },
      gridOptions: {
        name: 'selfMeasurement',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      editable: false,
      selfManageStatusItems: [], // 진행단계
      searchUrl: '',
    };
  },
  computed: {
    excelUploadBtn() {
      return true;
      // return this.editable && (this.$store.getters.token === 'manager' || this.$store.getters.token === 'norma');
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
    this.searchParam.evalPeriod.push(
      this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      )
    );
    this.searchParam.evalPeriod.push(this.$comm.moment().format('YYYY-MM-DD'));
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.env.air.facility.selfMeasurement.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '12%',
          style: 'center-align',
        },
        // 진행단계
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002777'),
          dataField: 'stepNm',
          width: '12%',
          style: 'center-align',
        },
        // 결재상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000428'),
          dataField: 'bizApprStepNm',
          width: '12%',
          style: 'grid-link-cell',
        },
        // 배출구
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001142'),
          dataField: 'eairOutletNm',
          width: '14%',
          style: 'grid-link-cell',
        },
        // 부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'mgDeptNm',
          width: '12%',
          style: 'center-align',
        },
        // 측정일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002951'),
          dataField: 'measureYmd',
          width: '13%',
          style: 'center-align',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '12%',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '13%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001969'),
          color: 'blue',
          btnClicked: 'excelUploadBtnClicked',
          visible: this.editable && this.excelUploadBtn,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002995'),
          color: 'gray',
          btnClicked: 'tempBtnClicked',
          visible: this.editable && this.excelUploadBtn,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openPopup',
          visible: this.editable,
        },
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

      // 진행상태
      this.$comm.getComboItems('SAF_PROCESS_STEP', true).then((_result) => {
        this.selfManageStatusItems = _result;
      });

      this.getList(); // 협력업체 평가계획 목록 조회
    },
    /** 협력업체 평가계획 수립 목록 검색 **/
    getList() {
      this.searchParam.fromYmd = this.searchParam.evalPeriod[0];
      this.searchParam.toYmd = this.searchParam.evalPeriod[1];
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
    cellClickHandler(event) {
      if (event.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'eairOutletNm') {
        this.openPopup(event.item);
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
    openPopup(data) {
      console.log('111', data);
      this.popupOptions.param = {
        eairOpMeasNo: data ? data.eairOpMeasNo : 0, // key
        plantCd: data ? data.plantCd : '', // key
      };
      this.popupOptions.target = () =>
        import(`${'./selfMeasurementDetail.vue'}`);
      this.popupOptions.title = 'L0000002300'; // '자가측정 상세정보';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    tempBtnClicked() {
      let thisVue = this;
      let accept = this.$comm.getAccept('xlsx');
      // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.url =
        selectConfig.env.air.facility.selfMeasurement.excelDown.url;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(
              blob,
              '대기자가측정결과업로드양식.xlsx'
            );
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = '대기자가측정결과업로드양식.xlsx';
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    excelUploadBtnClicked() {
      this.popupOptions.target = () =>
        import(`${'./selfMeasurementExcelUpload.vue'}`);
      this.popupOptions.title = 'L0000003462'; // '자가측정결과 업로드';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
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
