<!--
  목적 : 경영>SHE예산 관리>예산편성 관리
  Detail : 예산편성 관리 조회화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box v-if="isNotPopup" :gridOptions="gridOptions" @enter="getList">
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
            :width="8"
            label="L0000000927"
            type="search"
            deptSubYn="Y"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
            @setDeptSubYn="
              (val) => {
                searchParam.deptSubYn = val;
              }
            "
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
          <!-- 편성 미완료 부서 -->
          <y-checkbox
            :width="8"
            :useDefault="true"
            checkedValue="Y"
            uncheckedValue="N"
            ui="bootstrap"
            label="L0000005334"
            name="unOrganizeYn"
            v-model="searchParam.unOrganizeYn"
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
              v-if="editable && isNotPopup"
              title="L0000005043"
              color="black"
              @btnClicked="btnAppr"
            />
             대상부서지정 
            <y-btn
              v-if="editable && isNotPopup"
              title="L0000005044"
              color="orange"
              @btnClicked="openDeptPopup"
            />
             검색 
            <y-btn
              v-if="isNotPopup"
              title="L0000000327"
              color="green"
              @btnClicked="getList"
            />
            닫기 
            <y-btn
              v-if="!isNotPopup"
              title="L0000000881"
              @btnClicked="btnClosePopup"
            />
          </div>
           예산편성관리 
          <y-data-table
            class="mergeTable"
            :key="tempKey"
            label="L0000005103"
            ref="dataTable"
            :spanOptions="gridOptions.merge"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            :rowClassName="tableRowClassName"
            :cellClassName="tableCellClassName"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005103')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
          @openDeptPopup="openDeptPopup"
          @getList="getList"
          @btnAppr="btnAppr"
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
  name: 'budgeting',
  props: {
    popupParam: {
      type: Object,
      default: () => {
        return {
          readonly: false,
          year: null, // 년도
          plantCd: null, // 사업장코드
          budgetClsCd: null, // 예산구분코드
          budgetActMstNo: 0, // 예산계정번호
          isStatus: false, // 예산 편성및집행 현황에서 팝업시 true / 예산집행 등록시 집행가능 금액에서 팝업시 false
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
        unOrganizeYn: null, // 미편성 대상부서여부
        procStepCd: 'MBS01', // 단계 - 편성으로 고정
        stateCd: '', // 상태
        statusYn: null, // 예산 편성및집행 현황에서의 팝업여부
      },
      gridOptions: {
        name: 'budgeting',
        header: [],
        data: [],
        btns: [],
        height: 'auto',
        merge: [], // rowspan할 컬럼명 및 기준
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
      budgetActDeptNos: null, // 결재요청시 전달할 파라미터
      budgetActNos: null, // 결재요청시 전달할 파라미터
      companyEditable: false, // 전사 권한
      plantEditable: false, // 사업장 권한
      deptEditable: false, // 일반 권한
    };
  },
  computed: {
    isNotPopup() {
      // 예산편성관리 메뉴여부/팝업여부
      return !this.popupParam.readonly && !this.popupParam.isStatus;
    },
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

      this.gridOptions.merge = [
        { index: 1, field: 'year' }, // 년도
        { index: 2, field: 'plantNm' }, // 사업장
        { index: 3, field: 'deptNm' }, // 대상부서
        { index: 8, field: 'stepMerge' }, // 단계(상태)
        { index: 9, field: 'writerNm' }, // 작성자
        { index: 10, field: 'writeDt' }, // 작성일
      ];
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000829'),
          dataField: 'year',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'),
          dataField: 'deptNm',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005001'),
          dataField: 'budgetTypeNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005004'),
          dataField: 'budgetClsNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005003'),
          dataField: 'budgetActNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005036'),
          dataField: 'orgAmt',
          width: '10%',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'),
          dataField: 'stepNm',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writeDt',
          width: '10%',
        },
        // {
        //   text: 'L0000004972' /* 단계(상태) */,
        //   name: 'stepNm',
        //   width: '120px',
        //   align: 'center',
        //   url: true,
        //   disabledFn: !this.isNotPopup ? this.disabledFn : null,
        // },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005043'),
          color: 'black',
          btnClicked: 'btnAppr',
          visible: this.isNotPopup,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005044'),
          color: 'orange',
          btnClicked: 'openDeptPopup',
          visible: this.isNotPopup,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
          visible: this.isNotPopup,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
          visible: !this.isNotPopup,
        }, //  닫기
      ];

      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (!this.isNotPopup) {
        this.searchParam.period = [this.popupParam.year, this.popupParam.year];
        this.searchParam.plantCd = this.popupParam.plantCd;
        this.searchParam.budgetActMstNo = this.popupParam.budgetActMstNo;
        this.searchParam.statusYn = !this.popupParam.isStatus ? 'N' : 'Y';
        this.searchParam.stateCd = this.popupParam.isStatus ? 'STATE4' : '';
        this.searchParam.budgetClsCd = this.popupParam.budgetClsCd;
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
    tableRowClassName({ row, rowIndex }) {
      return 'odd-row';
    },
    tableCellClassName({ row, column, rowIndex, colIndex }) {
      if (column.property === 'orgAmt' && row['orgAmt'] !== null) {
        row['orgAmt'] = row['orgAmt']
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return null;
      }
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
      this.searchParam.period = !this.searchParam.period[0]
        ? this.popupParam.period
        : this.searchParam.period;
      this.$http.url = selectConfig.mgt.budgetManagement.budgetAct.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          if (this.companyEditable) {
            // 전사권한 : 전체 건
            // this.gridOptions.data = this.$_.clone(_result.data);
            this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          } else if (this.plantEditable) {
            // 사업장권한 : 내 사업장 등록 건
            this.YAuiGrid.setGridData(
              this.$_.clone(
                _result.data.filter(
                  (v) => v.plantCd === this.$store.getters.plantCd
                )
              )
            );
            // this.gridOptions.data = this.$_.clone(
            //   _result.data.filter(
            //     (v) => v.plantCd === this.$store.getters.plantCd
            //   )
            // );
          } else if (this.deptEditable) {
            // 일반권한 : 내 부서 등록 건 + 타 부서 평가완료 건
            this.YAuiGrid.setGridData(
              this.$_.clone(
                _result.data.filter(
                  (v) =>
                    v.deptCd === this.$store.getters.deptCd ||
                    v.stepCd === 'BAPSG'
                )
              )
            );
            // this.gridOptions.data = this.$_.clone(
            //   _result.data.filter(
            //     (v) =>
            //       v.deptCd === this.$store.getters.deptCd ||
            //       v.stepCd === 'BAPSG'
            //   )
            // );
          }

          // 단계(상태) rowspan 기준 정보 추가
          this.gridOptions.data.map((row) => {
            let newRow = row;
            newRow.stepMerge =
              row.budgetActNo + '_' + row.deptCd + '_' + row.stepNm;
            return newRow;
          });
          // 팝업이 아니고 readonly가 아닐 경우 검색조건 저장
          if (!this.popupParam.readonly && !this.popupParam.isStatus) {
            this.$comm.pushCookie(this.searchParam);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR');
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 395;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    cellClickHandler(event) {
      if (event.dataField === 'stepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'deptNm') {
        this.openBudgetActMstPopup(event.item);
      }
    },
    // 그리드 row click 이벤트
    /**
     * 수정 팝업 호출
     */
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;

      if (header.name === 'stepNm') {
        this.showApprProgressPopup(data);
      } else {
        this.openBudgetActMstPopup(data);
      }
    },
    /**
     * 대상부서지정 팝업  호출
     */
    openDeptPopup() {
      this.popupOptions.target = () => import(`${'./budgetingDeptDetail.vue'}`);
      this.popupOptions.title = 'L0000005045'; // 예산편성 대상부서지정
      this.popupOptions.param = { budgetActNo: 0 };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /**
     * 예산계정 팝업  호출
     */
    openBudgetActMstPopup(data) {
      if (this.popupParam.readonly) {
        data.readonly = this.popupParam.readonly;
      }

      this.popupOptions.target = () =>
        import(`${'./budgetingDeptActMstDetail.vue'}`);
      this.popupOptions.title = 'L0000005069'; // 대상부서별 예산계정상세
      this.popupOptions.param = data;
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
          const objUnique = {};
          apprDatas
            .map((data) => data.budgetActDeptNo)
            .forEach((el) => {
              objUnique[el] = true;
            });
          this.budgetActDeptNos = Object.keys(objUnique).join(','); // 객체 키만 모아서 배열로 반환

          const objUnique2 = {};
          apprDatas
            .map((data) => data.budgetActNo)
            .forEach((el) => {
              objUnique2[el] = true;
            });
          this.budgetActNos = Object.keys(objUnique2).join(','); // 객체 키만 모아서 배열로 반환

          // this.budgetActDeptNos = apprDatas
          //   .map((data) => data.budgetActDeptNo)
          //   .join(',');
          // this.budgetActNos = apprDatas
          //   .map((data) => data.budgetActNo)
          //   .join(',');
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
          apprBizCd: 'MG-BD-01',
          apprParams: {
            budgetActDeptNo: this.budgetActDeptNos,
            budgetActNo: this.budgetActNos,
          },
        };
      });
    },
    /** /Button Event **/
  },
};
</script>
