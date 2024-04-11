<!--
  목적 : 경영>SHE예산 관리>예산집행 관리
  Detail : 예산집행 관리 조회화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box
      v-if="!popupParam.isStatus"
      :gridOptions="gridOptions"
      @enter="getList"
    >
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            label="L0000000767"
            :range="true"
            type="year"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 사업장 -->
          <y-plant
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 대상부서 -->
          <y-tree-dept
            label="L0000000927"
            type="search"
            name="deptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 예산분류 -->
          <y-select
            :width="8"
            :comboItems="budgetTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="budgetTypeCd"
            label="L0000005001"
            v-model="searchParam.budgetTypeCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 예산구분 -->
          <y-select
            :width="8"
            :comboItems="budgetClsItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="budgetClsCd"
            label="L0000005004"
            v-model="searchParam.budgetClsCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 예산계정 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000005003"
            name="budgetActNm"
            v-model="searchParam.budgetActNm"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 단계 -->
          <y-select
            :width="8"
            :disabled="true"
            :comboItems="procStepItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="procStepCd"
            label="L0000005014"
            v-model="searchParam.procStepCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 상태 -->
          <y-select
            :width="8"
            :comboItems="stateItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="stateCd"
            label="L0000001538"
            v-model="searchParam.stateCd"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             일괄결재요청
            <y-btn
              v-if="editable && !popupParam.isStatus"
              title="L0000005043"
              color="black"
              @btnClicked="btnAppr"
            />
             신규등록
            <y-btn
              v-if="editable && !popupParam.isStatus"
              title="L0000001789"
              color="orange"
              @btnClicked="openPopup"
            />
             검색 
            <y-btn
              v-if="!popupParam.isStatus"
              title="L0000000327"
              color="green"
              @btnClicked="getList"
            />
             닫기 
            <y-btn
              v-if="popupParam.isStatus"
              title="L0000000881"
              @btnClicked="btnClosePopup"
            />
          </div>
           예산집행관리 
          <y-data-table
            :key="tempKey"
            label="L0000005115"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
          />
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005115')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @btnAppr="btnAppr"
          @openPopup="openPopup"
          @getList="getList"
          @closePopup="btnClosePopup"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'budget-execution',
  props: {
    popupParam: {
      type: Object,
      default: () => {
        return {
          year: null, // 년도
          plantCd: null, // 사업장코드
          budgetClsCd: null, // 예산구분코드
          budgetActMstNo: 0, // 예산계정번호
          isStatus: false, // 예산 편성및집행 현황에서 팝업시 true
          budgetTypeCd: null,
        };
      },
    },
  },
  data() {
    return {
      searchParam: {
        period: [], // 기간
        plantCd: null, // 사업장
        deptCd: null, // 대상부서
        deptSubYn: null, // 하위부서 검색여부
        budgetTypeCd: null, // 예산분류
        budgetClsCd: null, // 예산구분
        budgetActNm: null, // 예산계정
        procStepCd: 'MBS02', // 단계 - 집행으로 고정
        stateCd: '', // 상태
      },
      gridOptions: {
        name: 'budgetExecution',
        header: [],
        btns: [],
        data: [],
        height: 'auto',
      },
      YAuigrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      budgetTypeItems: [], // 예산분류 selectbox 목록
      budgetClsItems: [], // 예산구분 selectbox 목록
      procStepItems: [], // 단계 selectbox 목록
      stateItems: [], // 상태 selectbox 목록
      tempKey: null, // 그리드 재렌더링할 키값
      budgetExecNos: null, // 결재요청시 전달할 파라미터
      companyEditable: false, // 전사 권한
      plantEditable: false, // 사업장 권한
      deptEditable: false, // 일반 권한
      sumDisable: 0,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.editable = this.$route.meta.editable;

      this.searchParam.deptSubYn = 'Y';

      this.searchParam.period = [
        this.$comm.getThisYear(),
        this.$comm.getThisYear(),
      ];

      // 예산분류 (예산계정 관리 기준정보)
      this.$comm.getComboItems('MICS3', true).then((_result) => {
        this.budgetTypeItems = this.$_.clone(_result);
      });

      // 예산구분 (MGT_BDT_CLS)
      this.$comm.getComboItems('MGT_BDT_CLS', true).then((_result) => {
        this.budgetClsItems = this.$_.clone(_result);
      });

      // 단계 (MGT_BUDGET_STEP)
      this.$comm.getComboItems('MGT_BUDGET_STEP', true).then((_result) => {
        this.procStepItems = this.$_.clone(_result);
      });

      // 상태 (COM_STATE)
      this.$comm.getComboItems('COM_STATE', true).then((_result) => {
        this.stateItems = this.$_.clone(_result);
      });

      // 권한별 컨트롤 처리
      if (this.$comm.isCompanyGrp()) {
        // 전사권한
        this.companyEditable = true;
        this.plantEditable = true;
        this.deptEditable = true;
      } else if (this.$comm.isPlantGrp()) {
        // 사업장권한
        this.plantEditable = true;
        this.deptEditable = true;
      } // 일반권한
      else {
        this.deptEditable = true;
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000829'),
          dataField: 'year',
          width: '9%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005099'),
          dataField: 'execDt',
          width: '9%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '9%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'),
          dataField: 'deptNm',
          width: '9%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005001'),
          dataField: 'budgetTypeNm',
          width: '9%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005004'),
          dataField: 'budgetClsNm',
          width: '9%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005003'),
          dataField: 'budgetActNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005100'),
          dataField: 'execAmtT',
          width: '9%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'),
          dataField: 'stepNm',
          width: '9%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerNm',
          width: '9%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writeDt',
          width: '9%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005043'),
          color: 'black',
          btnClicked: 'btnAppr',
          visible: !this.popupParam.isStatus,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openPopup',
          visible: !this.popupParam.isStatus,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
          visible: !this.popupParam.isStatus,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
          visible: this.popupParam.isStatus,
        }, //  닫기
      ];

      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (this.popupParam.isStatus) {
        this.searchParam.period = [this.popupParam.year, this.popupParam.year];
        this.searchParam.plantCd = this.popupParam.plantCd;
        this.searchParam.budgetActMstNo = this.popupParam.budgetActMstNo;
        this.searchParam.statusYn = !this.popupParam.isStatus ? 'N' : 'Y';
        this.searchParam.stateCd = this.popupParam.isStatus ? 'STATE4' : '';
        this.searchParam.budgetClsCd = this.popupParam.budgetClsCd;
        this.searchParam.month = this.popupParam.month;
        this.searchParam.budgetTypeCd = this.popupParam.budgetTypeCd;

        this.gridOptions.height = '350px';

        let nowDate = new Date();
        this.tempKey = nowDate.getMilliseconds();
      } else {
        /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
        if (typeof searchParamByCookie !== 'undefined') {
          this.searchParam = searchParamByCookie;
        }
      }

      this.getList();
    },
    // 링크 제외 처리 함수
    disabledFn(header, row, index) {
      if (row.budgetActNm === '합계') {
        return false;
      }

      return true;
    },
    // 예산편성 목록 그리드
    getList() {
      this.searchParam.period =
        !this.searchParam.period || this.searchParam.period.length !== 2
          ? this.popupParam.period
          : this.searchParam.period;
      this.$http.url = selectConfig.mgt.budgetManagement.budgetExec.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          if (this.companyEditable) {
            // 전사권한 : 전체 건
            // this.gridOptions.data = this.$_.clone(_result.data);
            this.YAuiGrid.setGridData(_result.data);
          } else if (this.plantEditable) {
            // 사업장권한 : 내 사업장 등록 건
            this.gridOptions.data = this.$_.clone(
              _result.data.filter(
                (v) => v.plantCd === this.$store.getters.plantCd
              )
            );
            this.YAuiGrid.setGridData(this.gridOptions.data);
          } else if (this.deptEditable) {
            // 일반권한 : 내 부서 등록 건 + 타 부서 평가완료 건
            this.gridOptions.data = this.$_.clone(
              _result.data.filter(
                (v) =>
                  v.deptCd === this.$store.getters.deptCd ||
                  v.stepCd === 'BAPSG'
              )
            );
            this.YAuiGrid.setGridData(this.gridOptions.data);
          }
          // 단계(상태) rowspan 기준 정보 추가
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR');
        }
      );
    },
    // 그리드 row click 이벤트
    /**
     * 수정 팝업 호출
     */
    resizeGrid() {
      let _height = window.innerHeight - 395;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    cellClickHandler(event) {
      if (event.item === null || event.item === undefined) return;
      if (event.item.budgetActNm === '합계') return;

      if (event.dataField === 'stepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'execAmtT') {
        this.openPopup(event.item);
      }
    },
    /**
     * 대상부서지정 팝업  호출
     */
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./budgetExecutionDetail.vue'}`);
      this.popupOptions.title = 'L0000005098'; // 예산집행 상세
      this.popupOptions.param = data ? data : { budgetExecNo: 0 };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
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
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    btnClosePopup() {
      this.$emit('closePopup');
    },
    /** Button Event **/
    btnAppr() {
      // MG-BD-01
      let promises = [{ func: this.checkValidation }, { func: this.apprData }];

      this.$comm.orderedPromise(promises);
    },
    checkValidation() {
      return new Promise((_resolve) => {
        let apprDatas = this.YAuiGrid.getGridData().filter(
          (data) => data.stepCd === 'BAPSD' || data.stateCd === 'STATE2'
        );

        if (!apprDatas || !apprDatas.length) {
          // 일괄결재요청할 수 있는 데이터가 없을 경우
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005161' /* 결재요청할 수 있는 데이터가 없습니다. */,
            type: 'info',
          });
          return;
        } else {
          this.budgetExecNos = apprDatas
            .map((data) => data.budgetExecNo)
            .join(',');
        }

        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'L0000005160', // 일괄결재요청 하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    apprData() {
      return new Promise((_resolve) => {
        this.popupOptions.target = () =>
          import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
        this.popupOptions.title = 'L0000003418'; // 결재요청
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
        this.popupOptions.width = '80%';
        this.popupOptions.param = {
          apprBizCd: 'MG-BD-02',
          apprParams: {
            budgetExecNo: this.budgetExecNos,
          },
        };
      });
    },
    /** /Button Event **/
  },
};
</script>
