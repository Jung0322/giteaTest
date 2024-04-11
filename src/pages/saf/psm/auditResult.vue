<!--
  목적 : 검진 계획
  Detail : 검진계획 검색/등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="searchBox">
      <b-col sm="12">
        <y-search-box :gridOptions="gridOptions" @enter="getList">
          <b-row slot="search">
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant type="search" v-model="searchParam.plantCd" />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 년도 -->
              <y-datepicker
                :width="8"
                type="year"
                :range="true"
                label="L0000000829"
                name="period"
                v-model="searchParam.period"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 감사종류 -->
              <y-select
                :width="8"
                :comboItems="kindItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000238"
                name="auditType"
                v-model="searchParam.auditType"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 진행상태 -->
              <y-select
                :width="8"
                :comboItems="stepItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002779"
                name="psmProgState"
                v-model="searchParam.psmProgState"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000002335"
                name="auditNm"
                v-model="searchParam.auditNm"
              ></y-text>
            </b-col>
          </b-row>
        </y-search-box>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <!-- 자체감사 결과 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :label="this.$comm.getLangSpecInfoLabel('L0000003786')"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @btnSearch="getList"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'audit-plan',
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '',
        period: [],
        auditType: '',
        psmProgState: '',
        startYear: '',
        endYear: '',
        auditNm: '',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'safPsmAuditResult',
        header: [],
        data: [],
        height: 'auto',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      stepItems: [],
      kindItems: [],
      editable: false,
      searchUrl: '',
    };
  },
  watch: {},
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
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.auditResult.list.url;
      this.editable = this.$route.meta.editable;

      const today = this.$comm.moment().format('YYYY');
      this.searchParam.period = [today, today];

      // (C)감사종류
      this.$comm.getComboItems('AUDIT_TYPE', true).then((_result) => {
        this.kindItems = _result;
      });

      // (C)진행상태
      this.$comm.getComboItems('PSM_PROG_STATE', true).then((_result) => {
        this.$_.forEach(['PPS10', 'PPS20'], (item) => {
          const findIndex = this.$_.findIndex(_result, { code: item });
          if (findIndex !== -1) {
            _result.splice(findIndex, 1);
          }
        });
        this.stepItems = _result;
      });

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        } /* 사업장 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'),
          dataField: 'psmProgStateNm',
          width: '10%',
        } /* 진행상태 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000409'),
          dataField: 'rsltApprRqstNm',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        } /* 결과결재진행상태 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000829'),
          dataField: 'auditYear',
          width: '10%',
        } /* 년도 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002335'),
          dataField: 'auditNm',
          width: '10%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        } /* 자체감사명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000921'),
          dataField: 'targetDt',
          width: '10%',
        } /* 대상기간 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000228'),
          dataField: 'auditDt',
          width: '10%',
        } /* 감사기간 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000238'),
          dataField: 'auditTypeNm',
          width: '10%',
        } /* 감사종류 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        } /* 작성자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        } /* 작성일 */,
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, // 검색
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      const searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    // 검진 계획 그리드
    getList() {
      this.searchParam.startYear = this.searchParam.period[0];
      this.searchParam.endYear = this.searchParam.period[1];
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 그리드 row click 이벤트
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.dataField === 'rsltApprRqstNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'auditNm') {
        if ((event.item || null) === null) return;
        this.popupOptions.target = () =>
          import(`${'@/pages/saf/psm/auditResultDetail.vue'}`);
        this.popupOptions.title = 'L0000000149'; /* PSM 결과 상세 */
        this.popupOptions.visible = true;
        this.popupOptions.param = {
          auditRsltNo: event.item.auditRsltNo,
        };
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.rsltApprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /** Button Event **/
    /**
     * 검색박스 숨기기/보이기 처리
     */
    searchUser() {
      if (!this.editable) return;

      this.popupOptions.param = {
        plantCd: this.searchParam.plantCd,
        deptCd: this.searchParam.deptCd,
      };
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; /* 사용자검색 */
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.searchParam.userNm = data.user.userNm; // 검사자명
        this.searchParam.userId = data.user.userId; // 검사자id
      }
    },
    removeUser() {
      this.searchParam.userNm = ''; // 검사자명
      this.searchParam.userId = ''; // 검사자id
    },
    /** /Button Event **/
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 370;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
