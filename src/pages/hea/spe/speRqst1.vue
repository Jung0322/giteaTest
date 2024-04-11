<!--
  목적 : 안전보호구 > 보호구 신청/지급
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            :editable="editable"
            name="plantCd"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 신청/지급 기간 -->
          <y-datepicker
            :width="baseWidth"
            :range="true"
            label="L0000004397"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 신청/지급 요청부서 -->
          <y-tree-dept
            type="search"
            label="L0000001791"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.rqstDeptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 신청/지급 요청자 -->
          <y-text
            :width="baseWidth"
            :readonly="true"
            ui="bootstrap"
            label="L0000001792"
            name="rqstUserNm"
            v-model="searchParam.rqstUserNm"
            :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
            @searchUser="btnSearchUserClicked"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 진행단계 -->
          <y-select
            :width="baseWidth"
            :comboItems="speStepCds"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000002777"
            name="speStepCd"
            v-model="searchParam.speStepCd"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 보호구 신청 grid -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             무신청 지급등록 
            <y-btn
              v-if="editable && isShieldManager && this.$route.meta.param === 'PAY'"
              :title="$comm.getLangSpecInfoLabel('L0000003998')"
              color="blue"
              @btnClicked="btnPopupClickedCallback"
            /> 
             보호구 신청
            <y-btn v-if="editable && this.$route.meta.param === 'APPLY'" :title="$comm.getLangSpecInfoLabel('L0000004402')" color="orange" @btnClicked="openCreateRqst" />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           보호구 신청/지급 목록 
          <y-data-table
            label="L0000001268"
            gridType="edit"
            :print="true"
            :use-paging="true"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :excelDown="true"
            @tableLinkClicked="tableLinkClicked"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001268')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @openCreateRqst="openCreateRqst"
          @btnPopupClickedCallback="btnPopupClickedCallback"
        />
      </b-col>
    </b-row>
    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'spe-rqst',
  props: {},
  data() {
    return {
      searchArea: {
        title: '검색박스숨기기', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        plantCd: '',
        period: [],
        rqstDeptCd: '',
        rqstUserId: '',
        rqstUserNm: '',
        speStepCd: '',
        type: '',
      },
      gridOptions: {
        name: 'speRqst1',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      baseWidth: 8,
      speStepCds: [], // 진행단계
      speKindCds: [], // 보호구 종류
      searchUrl: '',
      isShieldManager: false, // 보호구 담당자 여부
    };
  },
  watch: {
    'searchParam.rqstUserNm'() {
      if (this.searchParam.rqstUserNm === '') {
        this.searchParam.rqstUserId = '';
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
    this.editable = this.$route.meta.editable;
    this.searchParam.type = this.$route.meta.param;
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.speRqst.list.url;
      this.editable = this.$route.meta.editable;

      let userAuthGrps = this.$store.getters.userAuthGrps;
      this.$_.forEach(userAuthGrps, (item) => {
        if (
          (item.authGrpNo === '1036' && item.settingYn === 'Y') ||
          (item.authGrpNo === '1090' && item.settingYn === 'Y') ||
          (item.authGrpNo === '1015' && item.settingYn === 'Y')
        ) {
          this.isShieldManager = true;
        }
      });

      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        today,
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.period = [from, today];

      if (this.$route.meta.param === 'APPLY') {
        this.searchParam.speStepCd = 'SPES1';
      } else {
        this.searchParam.speStepCd = 'SPES3';
      }

      this.getspeStepCds(); // 진행단계
      this.getSpeKindCds(); // 보호구 종류

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getDataList();

      // 보호구 신청 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002777'),
          dataField: 'speStepNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001795'),
          dataField: 'rqstUserNm',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002746'),
          dataField: 'rqstYnNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001802'),
          dataField: 'rqstYmd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002751'),
          dataField: 'giveYmd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001794'),
          dataField: 'rqstDeptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001359'),
          dataField: 'giveCreateUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003998'),
          color: 'blue',
          btnClicked: 'btnPopupClickedCallback',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004402'),
          color: 'orange',
          btnClicked: 'openCreateRqst',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
          visible: true,
        },
      ];
    },
    // 진행단계
    getspeStepCds() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_SPE_STEP'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.speStepCds = this.$_.clone(_result.data);
          this.speStepCds.splice(0, 0, {
            code: '',
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }); // 전체
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 보호구 종류
    getSpeKindCds() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_SPE_KIND'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.speKindCds = this.$_.clone(_result.data);
          this.speKindCds.splice(0, 0, {
            code: '',
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }); // 전체
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 보호구 신청 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // v-if="editable && isShieldManager && this.$route.meta.param === 'PAY'"
          //     :title="$comm.getLangSpecInfoLabel('L0000003998')"
          //     color="blue"
          //     @btnClicked="btnPopupClickedCallback"
          //   />
          //    보호구 신청
          //   <y-btn v-if="editable && this.$route.meta.param === 'APPLY'" :title="$comm.getLangSpecInfoLabel('L0000004402')" color="orange" @btnClicked="openCreateRqst" />
          //    검색
          //   <y-btn
          //     title="L0000000327"
          //     color="green"
          //     @btnClicked="btnSearchClickedCallback"
          //     @btnClickedErrorCallback="btnClickedErrorCallback"
          //   />
          if (
            this.editable &&
            this.isShieldManager &&
            this.$route.meta.param === 'PAY'
          ) {
            this.gridOptions.btns[0].visible = true;
            this.gridOptions.btns[1].visible = false;
            this.gridOptions.btns[2].visible = true;
          } else if (this.editable && this.$route.meta.param === 'APPLY') {
            this.gridOptions.btns[0].visible = false;
            this.gridOptions.btns[1].visible = true;
            this.gridOptions.btns[2].visible = true;
          }
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /** Button Event **/
    resizeGrid() {
      let _height = window.innerHeight - 385;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // 사용자 검색
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    // 신규등록 팝업
    openCreateRqst() {
      this.popupOptions.target = () => import(`${'./createSpeRqst.vue'}`);
      this.popupOptions.title = 'L0000004402'; // 보호구 신청
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safSpeRqstGiveNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    // 그리드 row click 이벤트
    cellClickHandler(event) {
      if (event.dataField !== 'rqstUserNm') return;
      if (this.$route.meta.param === 'APPLY') {
        // 보호구 신청
        this.popupOptions.target = () => import(`${'./createSpeRqst.vue'}`);
        this.popupOptions.title = 'L0000001264'; // 보호구 상세
        this.popupOptions.param = {
          safSpeRqstGiveNo: event.item.safSpeRqstGiveNo,
        };
      } else if (this.$route.meta.param === 'PAY') {
        // 보호구 지급
        if (event.item.rqstYn === 'Y') {
          // 보호구 신청지급
          this.popupOptions.target = () =>
            import(`${'./createSpeRqstGive.vue'}`);
          this.popupOptions.title = 'L0000003999'; // 보호구 지급
          this.popupOptions.param = {
            safSpeRqstGiveNo: event.item.safSpeRqstGiveNo,
          };
        } else {
          this.popupOptions.target = () =>
            import(`${'./createSpeNoRqstGive.vue'}`);
          this.popupOptions.title = 'L0000001262'; // 보호구 무신청 지급
          this.popupOptions.param = {
            safSpeRqstGiveNo: event.item.safSpeRqstGiveNo,
          };
        }
      }
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopup;
    },

    btnPopupClickedCallback(data) {
      this.popupOptions.target = () => import(`${'./createSpeNoRqstGive.vue'}`);
      this.popupOptions.title = 'L0000001262'; // 보호구 무신청 지급
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {};
      this.popupOptions.closeCallback = this.closePopup;
    },

    // 신규등록 팝업 닫기
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    // 사용자 검색 팝업 닫기
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.searchParam.rqstUserNm = data.user.userNm;
        this.searchParam.rqstUserId = data.user.userId;
      }
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/
  },
};
</script>
