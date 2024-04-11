<!--
  목적 : 시설점검 - 시설점검결과
  Detail : 시설점검결과 목록 화면으로 이미 등록된 계획을 선택하여 결과를 등록.
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box
      :gridOptions="gridOptions"
      @enter="btnSearchClickedCallback"
      v-if="!popupParam.popupMode"
    >
      <b-row slot="search">
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000767"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 시설점검종류 -->
          <y-select
            :width="8"
            :comboItems="comboFacilityInsCheckItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001765"
            name="comFacilityCheckCd"
            v-model="searchParam.comFacilityCheckCd"
          ></y-select>
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 점검 결과 -->
          <y-select
            :width="8"
            :comboItems="comboResultKindItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="checkResultCd"
            label="L0000002536"
            v-model="searchParam.checkResultCd"
          ></y-select>
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 시설유형 -->
          <y-select
            :width="8"
            :comboItems="comboFacilityInsTypeItems"
            itemText="comFacilityTypeNm"
            itemValue="comFacilityTypeCd"
            ui="bootstrap"
            name="comFacilityTypeCd"
            label="L0000001747"
            v-model="searchParam.comFacilityTypeCd"
          ></y-select>
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 검색어 / 일정명, 점검명, 시설명-->
          <y-text
            :width="8"
            ui="bootstrap"
            name="facilityNm"
            label="L0000000331"
            placeholder="L0000004293"
            v-model="searchParam.facilityNm"
          ></y-text>
        </b-col>

        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 점검주관부서 -->
          <y-tree-dept
            type="search"
            :plantCd="searchParam.plantCd"
            :showAllDept="true"
            label="L0000002578"
            name="deptCd"
            v-model="searchParam.deptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 점검대상부서 -->
          <y-tree-dept
            type="search"
            :plantCd="searchParam.plantCd"
            :showAllDept="true"
            label="L0000002549"
            name="tgtDeptCd"
            v-model="searchParam.tgtDeptCd"
            :deptSubYn="searchParam.tgtDeptSubYn"
            @setDeptSubYn="setTgtDeptSubYn"
          />
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 점검수행부서 -->
          <y-tree-dept
            type="search"
            :plantCd="searchParam.plantCd"
            :showAllDept="false"
            label="L0000004852"
            name="pfmDeptCd"
            v-model="searchParam.pfmDeptCd"
            :deptSubYn="searchParam.pfmDeptSubYn"
            @setDeptSubYn="setPfmDeptSubYn"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- <div slot="buttonGroup" class="float-right mb-1">
            <div class="float-right">
              <y-btn
                v-if="!popupParam.popupMode"
                title="L0000001034"
                color="orange"
                @btnClicked="btnNoPlan"
              />
              무계획결과등록
              <y-btn
                v-if="!popupParam.popupMode"
                title="L0000000327"
                color="green"
                @btnClicked="btnSearchClickedCallback"
              />
              검색
            </div>
            <y-btn
              v-if="popupParam.popupMode"
              title="L0000000881"
              @btnClicked="closeTotalPopup"
            />
            닫기
          </div> -->
          <!-- 시설점검결과 목록 -->
          <!-- <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :print="true"
            :editable="editable"
            :use-paging="true"
            label="L0000001755"
            @tableLinkClicked="tableLinkFacilityNmClicked"
          ></y-data-table> -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :items="gridOptions.data"
            :label="this.$comm.getLangSpecInfoLabel('L0000001755')"
            :useExcelExport="false"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            @cellClick="cellClickHandler"
            @btnNoPlan="btnNoPlan"
            @btnSearchClickedCallback="btnSearchClickedCallback"
            @btnClickedError="btnClickedErrorCallback"
            @closeTotalPopup="closeTotalPopup"
          />
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
  name: 'y-facility-inspection-result',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          popupMode: false,
          plantCd: '',
          year: '',
          month: '',
          gubun: '',
          comFacilityCheckCd: '',
          comFacilityTypeCd: null,
          deptCd: '',
        };
      },
    },
  },
  data: () => ({
    searchParam: {
      plantCd: '', // 사업장코드
      deptCd: '', // 점검부서코드
      comFacilityCheckCd: '', // 시설점검종류
      comFacilityTypeCd: null, // 시설유형코드
      facilityNm: '', // 시설명
      checkStepCd: '', // 점검진행상태
      period: [], // 기간
      startYmd: '', // 시작일
      endYmd: '', // 종료일
      tgtDeptCd: '', // 점검대상부서
      pfmDeptCd: '', // 점검수행부서
      deptSubYn: 'Y', // 하위부서여부 사용
      tgtDeptSubYn: 'Y', // 하위부서여부 사용
      pfmDeptSubYn: 'Y', // 하위부서여부 사용
    },
    searchArea: {
      title: '검색박스숨기기', // 검색박스숨기기
      show: true,
    },
    gridOptions: {
      header: [],
      data: [],
      height: 'auto',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: null,
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    comboFacilityInsCheckItems: [], // 시설점검종류
    comboFacilityInsTypeItems: [], // 시설유형
    comboResultKindItems: [], // 점검결과
    comboCheckStepItems: [], // 진행단계
    searchUrl: '',
    YAuiGrid: null,
  }),
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl =
        selectConfig.saf.facilityInspection.facilityInspectionResult.list.url;
      this.searchParam.deptSubYn = 'Y';
      this.searchParam.pfmDeptSubYn = 'Y';
      this.searchParam.tgtDeptSubYn = 'Y';

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), // 사업장
          dataField: 'plantNm',
          width: '100px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002279'), // 일정명
          dataField: 'comFacilityCheckTitle',
          width: '160px',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002551'), // 점검명
          dataField: 'facilityCheckNm',
          width: '160px',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000452'), // 결재진행상태
          dataField: 'bizApprStepNm',
          width: '120px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002576'), // 점검종류
          dataField: 'comFacilityCheckNm',
          width: '120px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002564'), // 점검예정일
          dataField: 'facilityCheckSchYmd',
          width: '120px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002570'), // 점검일
          dataField: 'facilityCheckYmd',
          width: '120px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002578'), // 점검주관부서
          dataField: 'deptNm',
          width: '110px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002549'), // 점검대상부서
          dataField: 'tgtDeptNm',
          width: '110px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004852'), // 점검수행부서
          dataField: 'pfmDeptNm',
          width: '110px',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002536') /* 점검결과 */,
          dataField: 'checkResultNm',
          width: '110px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001747'), // 시설유형
          dataField: 'comFacilityTypeNm',
          width: '110px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001743'),
          dataField: 'facilityNm',
          width: '150px',
          style: 'center-align',
        }, // 시설명
        // {
        //  headerText: this.$comm.getLangSpecInfoLabel('L0000001415')'L0000002355' /* 작성자 */,
        //   name: 'writerUserNm',
        //   width: '120px',
        //  style: 'center-align',
        // },
        // {
        //  headerText: this.$comm.getLangSpecInfoLabel('L0000001415')'L0000002352' /* 작성일 */,
        //   name: 'writerDt',
        //   width: '110px',
        //  style: 'center-align',
        // },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001034'),
          color: 'orange',
          btnClicked: 'btnNoPlan',
          visible: !this.popupParam.popupMode,
        }, // 무계획결과등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
          visible: !this.popupParam.popupMode,
        }, // 검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closeTotalPopup',
          visible: this.popupParam.popupMode,
        }, // 닫기
      ];

      // this.gridOptions.merge = [];
      // this.gridOptions.merge.push({
      //   index: 1,
      //   field: 'safFacilityInsCheckPlanNm',
      // });

      // 기간 Setting
      if (!this.popupParam.popupMode) {
        let today = this.$comm.getToday();
        let from = this.$comm.getCalculatedDate(
          today,
          '-2m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        let to = this.$comm.getCalculatedDate(
          today,
          '2m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        this.searchParam.period = [from, to];
        // this.searchParam.checkStepCd = 'CHS02';
      } else {
        this.searchParam.checkStepCd = this.popupParam.gubun;
        let startDate = '';
        let endDate = '';
        if (this.popupParam.month) {
          startDate = this.$comm.moment([
            this.popupParam.year,
            this.$_.parseInt(this.popupParam.month) - 1,
          ]);
          endDate = this.$comm.moment(startDate).endOf('month');
        } else {
          startDate = this.$comm.moment([this.popupParam.year, 0]);
          endDate = this.$comm.moment([this.popupParam.year, 11]);
          endDate = this.$comm.moment(endDate).endOf('month');
        }
        this.searchParam.period = [
          startDate.format('YYYY-MM-DD'),
          endDate.format('YYYY-MM-DD'),
        ];
        this.searchParam.plantCd = this.popupParam.plantCd;
        if (this.popupParam.comFacilityCheckCd) {
          this.searchParam.comFacilityCheckCd =
            this.popupParam.comFacilityCheckCd;
        }
        if (this.popupParam.comFacilityTypeCd) {
          this.searchParam.comFacilityTypeCd =
            this.popupParam.comFacilityTypeCd;
        }
        if (this.popupParam.deptCd) {
          this.searchParam.deptCd = this.popupParam.deptCd;
        }
        this.gridOptions.header.splice(1, 1);
      }

      this.getComboItems('SAF_FACILITY_CHECK'); // 시설점검종류
      this.getComboItems('SAF_CHK_STEP'); // 점검진행상태
      this.getComboFacilityTypeItems(); // 시설유형
      this.$comm.getComboItems('SAF_F_CHK_RSLT_CLS', true).then((_result) => {
        this.comboResultKindItems = _result;
      });
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      // var searchParamByCookie = this.$comm.setSearchParamByCookie();
      // if (typeof searchParamByCookie !== 'undefined') {
      //   this.searchParam = searchParamByCookie;
      // }

      this.getList(); // 시설점검결과 목록 조회
    },
    /**
     * 공통 마스터 정보 조회 (점검진행단계, 시설점검종류)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'SAF_FACILITY_CHECK') {
            this.comboFacilityInsCheckItems = this.$_.clone(_result.data);
            this.comboFacilityInsCheckItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            });
          } else if (codeGroupCd === 'SAF_CHK_STEP') {
            this.comboCheckStepItems = this.$_.clone(_result.data);
            this.comboCheckStepItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); // 전체
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 시설유형 조회
     */
    getComboFacilityTypeItems() {
      this.$http.url = selectConfig.baseInfo.safFacility.facilityType.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.comboFacilityInsTypeItems = this.$_.clone(_result.data);
          this.comboFacilityInsTypeItems.splice(0, 0, {
            comFacilityTypeCd: null,
            comFacilityTypeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 해당 계획 결과 상세보는 팝업 open
     * 시설점검결과 목록에 시설명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */

    cellClickHandler(event) {
      if (event.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(event);
      } else if (event.dataField === 'facilityCheckNm') {
        this.openDetailPopup(event.item, false);
      } else return;
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.rapprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    btnNoPlan() {
      const data = {
        comFacilityCheckScheduleNo: 0, // 시설점검마스터번호
        checkStepCd: 'CHS02',
        bizApprStepCd: 'BAPSG',
        gubun: true,
        noPlanYn: 'Y',
      };
      this.openDetailPopup(data, true);
    },
    openDetailPopup(data, gubun) {
      this.popupOptions.target = () =>
        import(`${'./facilityInspectionResultDetail.vue'}`);
      this.popupOptions.title = 'L0000001754'; // 시설점검결과
      this.popupOptions.param = {
        comFacilityCheckScheduleNo: data.comFacilityCheckScheduleNo, // 시설점검번호
        checkStepCd: data.checkStepCd, // 진행상태
        bizApprStepCd: data.bizApprStepCd, // 결재진행상태
        gubun: gubun,
        noPlanYn: null,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /** 시설점검결과 목록 조회 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          // this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },

    /** button 관련 이벤트 **/

    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * 시설점검결과 목록 조회
     *  검색 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSearchClickedCallback() {
      this.getList();
    },
    /**
     * 데이터 및 이벤트 초기화, 수정버튼 안보여지도록 처리
     *  초기화 버튼 callback
     */
    btnClearClickedCallback() {
      Object.assign(
        this.$data.facilityCheckResult,
        this.$options.data().facilityCheckResult
      );
      Object.assign(this.$data.searchParam, this.$options.data().searchParam);
      this.$validator.reset();
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closeTotalPopup(data) {
      this.$emit('closePopup', {});
    },
    /** end button 관련 이벤트 **/
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
    // 하위부서 포함 조회 관련 함수 추가
    setTgtDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.tgtDeptSubYn = _result;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setPfmDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.pfmDeptSubYn = _result;
    },
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 335;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
