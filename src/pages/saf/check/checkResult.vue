<!--
  목적 : 안전점검 관리 - 안전점검결과
  Detail : 안전점검결과 목록 화면으로 이미 등록된 계획을 선택하여 결과를 등록하거나 등록창을 띄워 별도 결과만 등록할 수 있음
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
        <b-col ssm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            :width="9"
            :range="true"
            label="L0000000767"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 점검종류 상세 -->
          <y-select
            :width="8"
            :comboItems="comboCheckKindItems"
            itemText="safCheckKindNm"
            itemValue="safCheckKindNo"
            ui="bootstrap"
            name="safCheckKindNo"
            label="L0000003718"
            v-model="searchParam.safCheckKindNo"
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
          <!-- 점검주관부서 -->
          <y-tree-dept
            type="search"
            label="L0000002578"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
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
            label="L0000002549"
            :showAllDept="false"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.tgtDeptCd"
            :deptSubYn="searchParam.tgtDeptSubYn"
            @setDeptSubYn="setTgtDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 점검수행부서 -->
          <y-tree-dept
            type="search"
            label="L0000004852"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.pfmDeptCd"
            :deptSubYn="searchParam.pfmDeptSubYn"
            @setDeptSubYn="setPfmDeptSubYn"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 검색어 -->
          <y-text
            :width="9"
            ui="bootstrap"
            label="L0000000331"
            :placeholder="keywordHint"
            name="keyword"
            v-model="searchParam.keyword"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <!-- <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
              점검결과 복사등록 
            <y-btn
              v-if="!popupParam.popupMode && editable"
              title="L0000004220"
              @btnClicked="btnOpenCopyPopupClick"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             무계획결과등록  
            <y-btn
              v-if="!popupParam.popupMode && editable"
              title="L0000001034"
              color="orange"
              @btnClicked="btnSearchCheckResultOpenPopupClicked"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
              검색  
            <y-btn
              v-if="!popupParam.popupMode"
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             닫기  
            <y-btn
              v-if="popupParam.popupMode"
              title="L0000000881"
              @btnClicked="closeTotalPopup"
            />
          </div>
          안전점검결과 목록 
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="editable"
            :print="true"
            :use-paging="true"
            @tableLinkClicked="tableLinkCheckTitleClicked"
            label="L0000001877"
            v-model="selectedValue"
          >
            <el-table-column
              v-if="editable && !popupParam.popupMode"
              type="selection"
              slot="selection"
              align="center"
              width="55"
              key="checkSelection"
            />
          </y-data-table>
        </b-col> -->
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001877')"
            :useExcelExport="false"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            :showRowCheckColumn="true"
            @cellClick="cellClickHandler"
            @btnOpenCopyPopupClick="btnOpenCopyPopupClick"
            @btnSearchCheckResultOpenPopupClicked="
              btnSearchCheckResultOpenPopupClicked
            "
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
  name: 'y-check-result',
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
          safCheckKindNo: '',
          deptCd: '',
          tgtDeptCd: '',
          keyword: '', // 점검(일정)명
        };
      },
    },
  },
  data: () => ({
    searchParam: {
      period: [],
      startDate: '',
      endDate: '',
      tgtDeptCd: '', // 대상부서코드
      pfmDeptCd: '', // 수행부서코드
      deptCd: '', // 주관부서코드
      safCheckKindNo: '', // 점검종류번호
      plantCd: '', // 사업장 코드
      checkStepCd: '', // 점검진행상태
      checkResultCd: '', // 점검결과
      deptSubYn: 'N', // 하위부서여부 사용
      tgtDeptSubYn: 'N', // 하위부서여부 사용
      pfmDeptSubYn: 'N', // 하위부서여부 사용
    },
    gridOptions: {
      name: 'checkResult',
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
    baseWidth: 9,
    editable: false,
    isInsert: false,
    isEdit: false,
    comboCheckKindItems: [], // 점검종류
    comboResultKindItems: [], // 점검결과
    comboCheckStepItems: [], // 진행단계
    searchUrl: '',
    keywordHint: '',
    selectedValue: [],
    YAuiGrid: null,
  }),
  watch: {
    'searchParam.plantCd'() {
      this.getComboCheckKindItems();
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.checkResult.list.url;
      if (!this.popupParam.popupMode) {
        this.searchParam.deptSubYn = 'Y';
        this.searchParam.tgtDeptSubYn = 'Y';
        this.searchParam.pfmDeptSubYn = 'Y';
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '100',
          style: 'center-align',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002570'),
          dataField: 'checkYmd',
          width: '110',
          style: 'center-align',
        }, // 점검일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002535'),
          dataField: 'checkMasterTitle',
          width: '200px',
        }, // 점검(일정)명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001642'),
          dataField: 'checkTitle',
          width: '200',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 세부점검계획
        // {
        //   headerText: this.$comm.getLangSpecInfoLabel('L0000002777'),
        //   dataField: 'checkStepNm',
        //   width: '110',
        //   style: 'center-align',
        // }, // 진행단계
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003718'),
          dataField: 'safCheckKindNm',
          width: '130',
          style: 'center-align',
        }, // 점검종류 상세
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000428'),
          dataField: 'bizApprStepNm',
          width: '110',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 결재상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002564'),
          dataField: 'checkSchYmd',
          width: '120',
          style: 'center-align',
        }, // 점검예정일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'),
          dataField: 'deptNm',
          width: '110',
        }, // 주관부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'),
          dataField: 'tgtDeptNm',
          width: '110',
        }, // 대상부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004852'),
          dataField: 'pfmDeptNm',
          width: '110',
        }, // 수행부서
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002536') /* 점검결과 */,
          dataField: 'checkResultNm',
          width: '110',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002355') /* 작성자 */,
          dataField: 'writerUserNm',
          width: '110',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002352') /* 작성일 */,
          dataField: 'writerDt',
          width: '120',
          style: 'center-align',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004220'),
          btnClicked: 'btnOpenCopyPopupClick',
          btnClickedError: 'btnClickedError',
          visible: !this.popupParam.popupMode && this.editable,
        }, // 점검결과 복사등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001034'),
          color: 'orange',
          btnClicked: 'btnSearchCheckResultOpenPopupClicked',
          visible: !this.popupParam.popupMode && this.editable,
        }, //  무계획결과등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
          visible: !this.popupParam.popupMode,
        }, //  검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          color: 'green',
          btnClicked: 'closeTotalPopup',
          visible: this.popupParam.popupMode,
        }, //  닫기
      ];

      this.$comm.getComboItems('SAF_CHK_STEP', true).then((_result) => {
        this.comboCheckStepItems = _result;
      });

      this.$comm.getComboItems('SAF_CHK_RSLT_CLS', true).then((_result) => {
        this.comboResultKindItems = _result;
      });
      // this.getComboCheckKindItems(); // 점검종류

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
        if (this.popupParam.safCheckKindNo) {
          this.searchParam.safCheckKindNo = this.popupParam.safCheckKindNo;
        }
        if (this.popupParam.deptCd) {
          this.searchParam.deptCd = this.popupParam.deptCd;
        }
        if (this.popupParam.tgtDeptCd) {
          this.searchParam.tgtDeptCd = this.popupParam.tgtDeptCd;
        }
        this.gridOptions.header.splice(1, 1);
      }

      this.keywordHint =
        this.$comm.getLangSpecInfoLabel('L0000002535') + // 점검(일정)명
        ', ' +
        this.$comm.getLangSpecInfoLabel('L0000001642'); // 세부점검계획

      // /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      // var searchParamByCookie = this.$comm.setSearchParamByCookie();
      // if (typeof searchParamByCookie !== 'undefined') {
      //   this.searchParam = searchParamByCookie;
      // }

      this.getList(); // 안전점검결과 목록 조회
    },
    /**
     * 점검종류 조회
     */
    getComboCheckKindItems() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        planUseYn: 'Y',
        useYn: 'Y',
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.comboCheckKindItems = this.$_.clone(_result.data);
          this.comboCheckKindItems.splice(0, 0, {
            safCheckKindNo: '',
            safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          });

          if (
            this.$_.findIndex(this.comboCheckKindItems, {
              safCheckKindNo: this.searchParam.safCheckKindNo,
            }) === -1
          ) {
            this.searchParam.safCheckKindNo = '';
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * showCheckResultPopup 호출
     * 월별 안전점검결과 목록에 점검명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    tableLinkCheckTitleClicked(header, data) {
      if (header.name === 'bizApprStepNm') {
        this.showApprProgressPopup(data);
      } else {
        this.showCheckResultPopup(data, false);
      }
    },

    cellClickHandler(event) {
      if (event.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'checkTitle') {
        this.showCheckResultPopup(event.item, false);
      } else {
        return;
      }
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
    /**
     * 해당 계획 결과 상세보는 팝업 open
     */
    showCheckResultPopup(data, flag, copyDataKey) {
      this.popupOptions.target = () => import(`${'./checkResultDetail.vue'}`);
      // 안전점검결과 등록 : 안전점검결과
      this.popupOptions.title = flag ? 'L0000001876' : 'L0000001875';
      this.popupOptions.param = {
        safCheckScheduleNo: data.safCheckScheduleNo, // 안전점검일정 일련번호
        // safCheckNo: data.safCheckNo, // 점검항목.. 번호
        checkStepCd: data.checkStepCd,
        bizApprStepCd: data.bizApprStepCd, // 결재진행상태
        flag: flag, // 수정인지 등록인지 판단
        copyDataKey: copyDataKey,
        noPlanPopup: data.noPlanPopup,
        popupMode: this.popupParam.popupMode,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /** 안전점검결과 목록 조회 **/
    getList() {
      this.searchParam.startDate = this.$_.clone(this.searchParam.period[0]);
      this.searchParam.endDate = this.$_.clone(this.searchParam.period[1]);
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));

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
    /**

    /** button 관련 이벤트 **/

    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchCheckResultOpenPopupClicked() {
      var data = {
        safCheckNo: 0, // 안전점검마스터 일련번호
        safCheckScheduleNo: 0, // 안전점검일정 일련번호
        tgtDeptCd: null, // 대상부서코드
        pfmDeptCd: null, // 수행부서코드
        deptCd: '', // 주관부서코드
        checkOrgCd: '', // 점검기관코드
        checkYmd: '', // 점검일
        checkSchYmd: '', // 점검예정일
        checkTitle: '', // 점검명
        checkResult: null, // 결과요약
        checkStepCd: '', // 점검진행상태코드
        checkStepNm: '', // 점검진행상태명
        safCheckKindNo: '', // 안전점검종류번호
        plantCd: null, // 사업장 코드
        noPlanPopup: true,
      };
      this.showCheckResultPopup(data, true);
    },
    btnSearchClickedCallback() {
      this.getList();
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closeTotalPopup(data) {
      this.$emit('closePopup', {});
    },
    btnOpenCopyPopupClick() {
      let isValid = false;

      const selectedGrid = this.YAuiGrid.getCheckedRowItemsAll();

      isValid = selectedGrid && selectedGrid.length === 1;

      if (isValid) {
        console.log('222');
        let data = {
          safCheckNo: 0, // 안전점검마스터 일련번호
          safCheckScheduleNo: 0, // 안전점검일정 일련번호
          tgtDeptCd: null, // 대상부서코드
          deptCd: '', // 주관부서코드
          checkOrgCd: '', // 점검기관코드
          checkYmd: '', // 점검일
          checkSchYmd: '', // 점검예정일
          checkTitle: '', // 점검명
          checkResult: null, // 결과요약
          checkStepCd: '', // 점검진행상태코드
          checkStepNm: '', // 점검진행상태명
          safCheckKindNo: '', // 안전점검종류번호
          plantCd: null, // 사업장 코드
          noPlanPopup: true,
        };

        let safCheckScheduleNo = selectedGrid[0].safCheckScheduleNo;

        this.showCheckResultPopup(data, true, safCheckScheduleNo);
      } else {
        let message =
          selectedGrid && selectedGrid.length === 0
            ? 'M0000001014'
            : 'M0000001013'; // 점검결과 복사등록 대상을 선택해주세요. : 점검결과 복사등록 대상을 1개만 선택해주세요.
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: message,
          type: 'warning',
        });

        return;
      }
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
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
    /** end button 관련 이벤트 **/
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
