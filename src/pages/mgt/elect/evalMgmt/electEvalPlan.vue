<!--
  목적 : SHE경영 관리>법정선임자 관리>법정선임자 평가 관리>평가계획 관리
  Detail : 평가계획 관리 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 대상년도 -->
          <y-datepicker
            :width="8"
            label="L0000004449"
            :range="true"
            type="year"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 구분 -->
          <y-select
            :width="8"
            :comboItems="MgtHalfTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="halfTypeCd"
            label="L0000000686"
            v-model="searchParam.halfTypeCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 주관부서 -->
          <y-tree-dept
            label="L0000002713"
            type="search"
            name="deptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 법정선임자 -->
          <y-select
            :width="8"
            :comboItems="electTitleItems"
            itemText="electTitlNm"
            itemValue="safElectTitlNo"
            ui="bootstrap"
            name="safElectTitlNo"
            label="L0000005162"
            v-model="searchParam.safElectTitlNo"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 평가명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003081"
            name="evalNm"
            v-model="searchParam.evalNm"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 단계/상태 -->
          <b-row>
            <b-col sm="4">
              <y-label label="L0000005147" />
            </b-col>
            <b-col sm="4">
              <y-select
                :width="12"
                :disabled="true"
                :comboItems="procStepItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="procStepCd"
                v-model="searchParam.procStepCd"
              ></y-select>
            </b-col>
            <b-col sm="4">
              <y-select
                :width="12"
                :comboItems="stateItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="stateCd"
                v-model="searchParam.stateCd"
              ></y-select>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <b-row>
            <b-col sm="6">
              <!-- 평가미완료 -->
              <y-checkbox
                :width="4"
                :useDefault="true"
                checkedValue="Y"
                uncheckedValue="N"
                ui="bootstrap"
                name="evalIncompleteYn"
                label="L0000005011"
                v-model="searchParam.evalIncompleteYn"
              ></y-checkbox>
            </b-col>
            <b-col v-if="searchParam.evalIncompleteYn === 'Y'" sm="6">
              <y-select
                :width="12"
                :comboItems="evalStepItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="evalStepCd"
                v-model="searchParam.evalStepCd"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             일괄결재요청 
            <y-btn
              v-if="editable"
              title="L0000005043"
              color="black"
              @btnClicked="btnAppr"
            />
             신규등록
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="openPopup"
            />
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           평가계획 목록 
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
            label="L0000003053"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003053')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @btnAppr="btnAppr"
          @openPopup="openPopup"
          @getList="getList"
          @cellClick="cellClickHandler"
        />
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
  name: 'elect-eval-plan',
  props: {},
  data: () => ({
    searchParam: {
      period: [], // 대상년도
      halfTypeCd: null, // 구분
      deptCd: null, // 주관부서
      deptSubYn: 'Y', // 하위부서 조회 여부
      safElectTitlNo: null, // 법정선임자번호
      evalNm: null, // 평가명
      procStepCd: 'SETS1', // 단계
      stateCd: null, // 상태
      evalIncompleteYn: null, // 평가미완료여부
      evalStepCd: null, // 평가미완료 상태
    },
    gridOptions: {
      name: 'electEvalPlan',
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
      param: {},
      width: '80%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    MgtHalfTypeItems: [], // 구분 selectbox 목록
    electTitleItems: [], // 법정선임자 selectbox 목록
    procStepItems: [], // 상태 selectbox 목록
    stateItems: [], // 상태 selectbox 목록
    evalStepItems: [], // 평가미완료 selectbox 목록
    evalPlanNos: null, // 일괄결재요청 키
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
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
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.searchParam.period = [
        this.$comm.getThisYear(),
        this.$comm.getThisYear(),
      ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004449'),
          dataField: 'year',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'halfTypeNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005162'),
          dataField: 'electTitlNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'),
          dataField: 'evalNm',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'),
          dataField: 'deptNm',
          width: '10%',
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
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005166'),
          dataField: 'totalCnt',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005163'),
          dataField: 'meCnt',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005164'),
          dataField: 'upCnt',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005167'),
          dataField: 'noCnt',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005043'),
          color: 'black',
          btnClicked: 'btnAppr',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openPopup',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
      // 구분 (상반기/하반기)
      this.$comm.getComboItems('MGT_HALF_TYPE', true).then((_result) => {
        this.MgtHalfTypeItems = _result;
      });

      // 법정선임자(평가대상인 법정선임자)
      this.getElectTitleComboItems();

      // 단계 (계획/본인평가/상위평가)
      this.$comm.getComboItems('SAF_ELECT_TITL_STEP', true).then((_result) => {
        this.procStepItems = _result;
      });

      // 상태 (작성중/결재중/결재완료)
      this.$comm.getComboItems('COM_STATE', true).then((_result) => {
        this.stateItems = _result.filter((v) => v.code !== 'STATE1');
      });

      // 평가 미완료 Y시 나타나는 select box 목록
      this.evalStepItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'me', codeNm: this.$comm.getLangSpecInfoLabel('L0000005163') }, // 본인평가
        { code: 'up', codeNm: this.$comm.getLangSpecInfoLabel('L0000005164') }, // 상위평가
        { code: 'no', codeNm: this.$comm.getLangSpecInfoLabel('L0000005165') }, // 미진행
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.searchParam.deptSubYn = 'Y';
      this.getList();

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
    },
    getElectTitleComboItems() {
      this.$http.url = selectConfig.saf.electTitle.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y', // 사용여부
        evalTgtYn: 'Y', // 평가대상여부
      };
      this.$http.request(
        (_result) => {
          this.electTitleItems = this.$_.clone(_result.data);
          this.electTitleItems.splice(0, 0, {
            safElectTitlNo: null,
            electTitlNm:
              this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      this.$http.url = selectConfig.mgt.electEvalMgmt.plan.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.$_.clone(this.searchParam);
      if (this.searchParam.procStepCd === 'SETS1') {
        this.$http.param.procStepCd = null;
      }
      this.$http.request(
        (_result) => {
          if (this.companyEditable) {
            // 전사권한 : 전체 건
            // this.gridOptions.data = this.$_.clone(_result.data);
            this.YAuiGrid.setGridData(this.$_.clone(_result.data));
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
                  v.stateCd === 'STATE4'
              )
            );
            this.YAuiGrid.setGridData(this.gridOptions.data);
          }
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'stepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField.includes('Cnt')) {
        this.openStatusPop(event.item, event.dataField);
      } else if (event.dataField === 'evalNm') {
        this.openPopup(event.item);
      }
    },
    tableLinkClicked(header, data) {
      if (header.name === 'stepNm') {
        this.showApprProgressPopup(data);
      } else if (header.name.includes('Cnt')) {
        this.openStatusPop(data, header.name);
      } else {
        this.openPopup(data);
      }
    },
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./electEvalPlanDetail.vue'}`);
      this.popupOptions.title = 'L0000003054'; // 평가계획 상세
      this.popupOptions.param = data ? data : { evalPlanNo: 0 };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    resizeGrid() {
      let _height = window.innerHeight - 375;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
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
    openStatusPop(data, headerName) {
      data.evalType =
        headerName.replace('Cnt', '') !== 'total'
          ? headerName.replace('Cnt', '')
          : null;

      this.popupOptions.target = () => import(`${'./electEvalRsltList.vue'}`);
      this.popupOptions.title = 'L0000004996'; // 평가결과 현황
      this.popupOptions.param = data;
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getList();
    },
    /** button 관련 이벤트 **/
    btnAppr() {
      // MG-BD-01
      let promises = [{ func: this.checkValidation }, { func: this.apprData }];

      this.$comm.orderedPromise(promises);
    },
    checkValidation() {
      return new Promise((_resolve) => {
        let apprDatas = this.gridOptions.data.filter(
          (data) => data.stepCd !== 'BAPSG' && data.stepCd !== 'BAPSA'
        );
        console.log(!apprDatas || !apprDatas.length);
        if (!apprDatas || !apprDatas.length) {
          // 일괄결재요청할 수 있는 데이터가 없을 경우
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005161' /* 결재요청할 수 있는 데이터가 없습니다. */,
            type: 'info',
          });
          _resolve(false);
          return;
        } else {
          this.evalPlanNos = apprDatas.map((data) => data.evalPlanNo).join(',');
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
          apprBizCd: 'MG-EV-01',
          apprParams: {
            evalPlanNo: this.evalPlanNos,
          },
        };
      });
    },
    setDeptSubYn(_result) {
      this.searchParam.deptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
