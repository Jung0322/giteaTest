<!--
  목적 : 경영 > 일정관리
  작성자 : kdh
  Detail : 일정관리 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 일정유형 -->
          <y-select
            :width="8"
            :comboItems="scheduleTpItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002280"
            name="mgtCalKindCd"
            v-model="searchParam.mgtCalKindCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 일정기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002277"
            name="period"
            v-model="searchParam.period"
            :type="periodType"
          />
        </b-col>

        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 업무유형 -->
          <y-select
            :width="8"
            :comboItems="mgtCalTypeCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001950"
            name="mgtCalTypeCd"
            v-model="searchParam.mgtCalTypeCd"
          ></y-select>
        </b-col>

        <!-- 제목 추가 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-8">
          <!-- 제목 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002616"
            name="title"
            v-model="searchParam.title"
          ></y-text>
        </b-col>
        <!-- -->

        <!-- 사용여부 추가 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-8">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="mgtUseYnNmItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001439"
            name="useYn"
            v-model="searchParam.useYn"
          ></y-select>
        </b-col>
        <!-- -->
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002274')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
          @getList="getList"
          @openNewPopup="openNewPopup"
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
  name: 'schedule-management',
  props: {},
  data() {
    return {
      searchArea: {
        // title: '검색박스숨기기',
        show: true,
      },
      searchParam: {
        period: [], // 기간
        mgtCalTypeCd: '', // 업무유형
        // plantCd: '', // 사업장
        useYn: '',
        createUserId: '', // 등록자
        mgtCalKindCd: '', // 일정유형
      },
      gridOptions: {
        name: 'scheduleManagement',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      periodType: '',
      editable: false,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      mgtCalTypeCdItems: [],
      mgtUseYnNmItems: [],
      scheduleTpItems: [],
      searchUrl: '',
    };
  },
  watch: {
    'searchParam.mgtCalKindCd'() {
      if (this.searchParam.mgtCalKindCd === 'MCL02') {
        // 월간
        this.periodType = 'month';
        this.searchParam.period = [];
      } else if (this.searchParam.mgtCalKindCd === 'MCL03') {
        // 연간
        this.periodType = 'year';
        this.searchParam.period = [];
      } else {
        // 일간, 주간
        if (this.periodType !== '') {
          this.searchParam.period = [];
        }
        this.periodType = '';
      }
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
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
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.mgt.scheduleManagement.list.url;

      this.searchParam.period.push(
        this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '-1m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        )
      );
      this.searchParam.period.push(
        this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '0m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        )
      );
      this.searchParam.createUserId = this.$store.getters.token;
      this.getComboItems('MGT_CAL_KIND'); // 일정유형(일간,주간,월간,연간)
      this.mgtCalTypeCdItems = [
        {
          code: '',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
        } /* 전체 */,
        {
          code: '1',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003969'),
        } /* 일정 */,
        {
          code: '2',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001221'),
        } /* 변경관리 */,
        {
          code: '3',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001870'),
        } /* 안전점검 */,
        {
          code: '4',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001606'),
        } /* 설비점검 */,
        {
          code: '5',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001753'),
        } /* 시설점검 */,
        {
          code: '6',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000000276'),
        } /* 개선조치 */,
        {
          code: '7',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003970'),
        } /* 교육 */,
        {
          code: '8',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002147'),
        } /* 위험성평가 */,
        {
          code: '9',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001417'),
        } /* 사업장 무재해 */,
        {
          code: '10',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001290'),
        } /* 부서 무재해 */,
        {
          code: '11',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000004658'),
        } /* 산업안전위원회/협의체 */,
      ];

      this.mgtUseYnNmItems = [
        {
          code: '',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
        } /* 전체 */,
        {
          code: 'Y',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001440'),
        } /* 사용 */,
        {
          code: 'N',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001063'),
        } /* 미사용 */,
      ];

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001950'),
          dataField: 'mgtCalTypeNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002277'),
          dataField: 'period',
          width: '16%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002616'),
          dataField: 'title',
          width: '14%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002278'),
          dataField: 'planContents',
          width: '12%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '12%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002348'),
          dataField: 'createDeptNm',
          width: '12%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '12%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '12%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openNewPopup',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    // 검색
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

    // 사업장
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'MGT_CAL_KIND') {
            this.scheduleTpItems = this.$_.clone(_result.data);
            this.scheduleTpItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 375;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    cellClickHandler(event) {
      if (event.item === null) return;
      if (event.dataField !== 'title') return;
      this.btnPopupClickedCallback(event.item);
    },
    openNewPopup() {
      this.btnPopupClickedCallback();
    },
    btnPopupClickedCallback(data) {
      if (
        !data ||
        data.mgtCalTypeNm === this.$comm.getLangSpecInfoLabel('L0000003969')
      ) {
        /* 일정 */
        this.popupOptions.target = () =>
          import(`${'./scheduleManagementDetail.vue'}`);
        this.popupOptions.title = 'L0000002273';
        this.popupOptions.param = {
          mgtCalendarNo: data ? data.mgtCalendarNo : 0,
        };
      } else if (
        data.mgtCalTypeNm === this.$comm.getLangSpecInfoLabel('L0000001221')
      ) {
        /* 변경관리 */
        this.popupOptions.target = () =>
          import(`${'../../saf/change/changeDetail.vue'}`);
        this.popupOptions.title = 'L0000001223'; /* 변경관리 상세 */
        this.popupOptions.param = {
          safChngNo: data ? data.mgtCalendarNo : 0,
          isSearch: true,
        };
      } else if (
        data.mgtCalTypeNm === this.$comm.getLangSpecInfoLabel('L0000001870')
      ) {
        /* 안전점검 */
        this.popupOptions.target = () =>
          import(`${'../../saf/check/checkResultDetail.vue'}`);
        this.popupOptions.title = 'L0000003976'; /* 안전점검 상세 */
        this.popupOptions.param = {
          safCheckScheduleNo: data ? data.mgtCalendarNo : 0,
          isSearch: true,
        };
      } else if (
        data.mgtCalTypeNm === this.$comm.getLangSpecInfoLabel('L0000001606')
      ) {
        /* 설비점검 */
        this.popupOptions.target = () =>
          import(`${'../../saf/facilityCheck/facilChkResultDetail.vue'}`);
        this.popupOptions.title = 'L0000001607'; /* 설비점검 상세 */
        this.popupOptions.param = {
          safFacilChkNo: data ? data.mgtCalendarNo : 0,
          isSearch: true,
        };
      } else if (
        data.mgtCalTypeNm === this.$comm.getLangSpecInfoLabel('L0000001753')
      ) {
        /* 시설점검 */
        this.popupOptions.target = () =>
          import(
            `${'../../saf/facilityInspection/facilityInspectionResultDetail.vue'}`
          );
        this.popupOptions.title = 'L0000003975'; /* 시설점검 상세 */
        this.popupOptions.param = {
          comFacilityCheckScheduleNo: data ? data.mgtCalendarNo : 0,
          isSearch: true,
        };
      } else if (
        data.mgtCalTypeNm === this.$comm.getLangSpecInfoLabel('L0000000276')
      ) {
        /* 개선조치 */
        this.popupOptions.target = () =>
          import(`${'../../impr/improveDetail.vue'}`);
        this.popupOptions.title = 'L0000003974'; /* 개선조치 상세 */
        this.popupOptions.param = {
          safImprActNo: data ? data.mgtCalendarNo : 0,
          flag: 'DETAIL',
        };
      } else if (
        data.mgtCalTypeNm === this.$comm.getLangSpecInfoLabel('L0000003970')
      ) {
        /* 교육 */
        this.popupOptions.target = () =>
          import(`${'../../education/eduResult.vue'}`);
        this.popupOptions.title = 'L0000003973'; /* 교육 상세 */
        this.popupOptions.param = {
          safEduMstNo: data ? data.mgtCalendarNo : 0,
          search: true,
        };
      } else if (
        data.mgtCalTypeNm === this.$comm.getLangSpecInfoLabel('L0000002147')
      ) {
        this.popupOptions.target = () =>
          import(`${'@/pages/rsa/jsa/assessAction/assessActionDetail.vue'}`);
        this.popupOptions.title = 'L0000002148'; /* 위험성평가 상세 */
        this.popupOptions.param = {
          assessNm: data ? data.title : '',
          assessPlanNo: data ? data.mgtCalendarNo : 0,
          isSearch: true,
        };
      } else if (
        data.mgtCalTypeNm === this.$comm.getLangSpecInfoLabel('L0000004658')
      ) {
        this.popupOptions.target = () =>
          import(
            `${'@/pages/mgt/industrialSafetyHealthCommittee/industrialSafetyHealthCommitteeDetail.vue'}`
          );
        this.popupOptions.title = 'L0000004658'; // 산업안전위원회/협의체
        this.popupOptions.param = {
          committeeConfNo: data ? data.mgtCalendarNo : 0,
          progressStepCd: data ? data.progressStepCd : 0,
          isSearch: true,
        };
      } else if (
        data.mgtCalTypeNm === this.$comm.getLangSpecInfoLabel('L0000001417')
      ) {
        /* 사업장 무재해 */
        this.popupOptions.target = () =>
          import(`${'../noaccident/createNoAccident.vue'}`);
        this.popupOptions.title = 'L0000003972'; /* 사업장 무재해 상세 */
        this.popupOptions.param = {
          safNoAccidentNo: data ? data.mgtCalendarNo : 0,
          isSearch: true,
        };
      } else if (
        data.mgtCalTypeNm === this.$comm.getLangSpecInfoLabel('L0000001290')
      ) {
        /* 부서 무재해 */
        this.popupOptions.target = () =>
          import(`${'../noaccident/createDeptNoAccident.vue'}`);
        this.popupOptions.title = 'L0000003971'; /* 부서 무재해 상세 */
        this.popupOptions.param = {
          safNoAccidentDeptNo: data ? data.mgtCalendarNo : 0,
          isSearch: true,
        };
      }
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getList();
    },
  },
};
</script>
