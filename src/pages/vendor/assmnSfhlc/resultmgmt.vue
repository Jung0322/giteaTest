<!--
  목적 : 평가및안전보건비용 결과
  Detail : 평가및안전보건비용 결과 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>

        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 평가구분 -->
          <y-select
            :width="8"
            :comboItems="evalClsCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000003059"
            name="evalClsCd"
            v-model="searchParam.evalClsCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 평가기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000003062"
            name="assessDt"
            v-model="searchParam.assessDt"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 평가명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003081"
            name="evalTitle"
            v-model="searchParam.evalTitle"
          ></y-text>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 업체 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001951"
            name="vendorNm"
            v-model="searchParam.vendorNm"
          ></y-text>
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
          <!-- 산업안전보건비 반영 -->
          <y-select
            :width="8"
            :comboItems="costRefItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="costRefYn"
            label="L0000005087"
            v-model="searchParam.costRefYn"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 수행부서 -->
          <y-tree-dept
            type="search"
            label="L0000005120"
            name="deptCd"
            v-model="searchParam.deptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <!--            평가및안전보건비용 결과 관리  -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="$comm.getLangSpecInfoLabel('L0000005089')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getList="getList"
          @openPopup="openPopup"
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
  name: 'y-subcon-eval-result',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '',
      assessDt: [], // 평가기한
      evalClsCd: null, // 평가구분
      evalTitle: '', // 평가명
      vendorNm: '', // 업체명
      mainDeptCd: null, // 주관부서
      stateCd: null, // 단계
      procStepCd: 'RWRS2', // 진행상태
      costRefYn: null, // 산업안전보건비 반영여부
      deptCd: '', // 수행부서
      deptSubYn: 'Y', // 하위부서여부 사용
    },
    gridOptions: {
      name: 'resultmgmtVendor',
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
    evalClsCdItems: [], // 평가구분
    stateItems: [], // 진행상태
    procStepItems: [{ code: 'RWRS2', codeNm: '결과' }], // 단계
    costRefItems: [
      { code: null, codeNm: '전체' },
      { code: 'Y', codeNm: '반영' },
      { code: 'N', codeNm: '미반영' },
    ], // 산업안전보건비 반영
    searchUrl: '',
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
  }),
  watch: {},
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
      // URL 세팅
      this.searchUrl = selectConfig.vendor.assmnSfhlcResult.list.url;

      // 평가구분
      this.$comm.getComboItems('SAF_SC_EVAL_CLS', true).then((_result) => {
        this.evalClsCdItems = _result;
      });
      // 진행상태
      this.$comm.getComboItems('COM_STATE', true).then((_result) => {
        this.stateItems = _result;
      });
      var from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-3m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '0m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );

      this.searchParam.assessDt = [from, to];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();

      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

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
        this.searchParam.deptCd = this.$store.getters.deptCd;
        this.deptEditable = true;
      }

      this.searchParam.deptCd = null;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'),
          dataField: 'evalTitle',
          width: '13%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001957'),
          dataField: 'vendorNm',
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
          headerText: this.$comm.getLangSpecInfoLabel('L0000003059'),
          dataField: 'evalClsNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003062'),
          dataField: 'evalDate',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005015'),
          dataField: 'mainDeptNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005120'),
          dataField: 'deptNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005753'),
          dataField: 'evalSumPnt',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005752'),
          dataField: 'evalAllPnt',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005151'),
          dataField: 'costRefYn',
          width: '8%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005150'),
          dataField: 'cost',
          width: '10%',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'updateUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'updateDt',
          width: '10%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004982'),
          color: 'orange',
          btnClicked: 'openPopup',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
      this.getList(); // 협력업체 평가계획 목록 조회
    },
    /** 협력업체 평가계획 수립 목록 검색 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          if (this.companyEditable) {
            // 전사권한 : 전체 건
            this.gridOptions.data = this.$_.clone(_result.data);
            this.YAuiGrid.setGridData(this.gridOptions.data);
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
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableCellClassName({ row, column, rowIndex, colIndex }) {
      if (column.label === '평가기한초과') {
        return 'row-color';
      }
      if (column.property === 'cost' && row['cost'] !== null) {
        row['cost'] = row['cost']
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return null;
      }
    },
    /**
     * showAccidentPopup 호출
     * 평가계획 목록에 평가명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
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
      } else if (event.dataField === 'evalTitle') {
        this.openPopup(event.item);
      }
    },
    tableLinkAccidentTitleClicked(header, data) {
      if (header.name === 'stepNm') {
        this.showApprProgressPopup(data);
      } else {
        this.openPopup(data);
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
      if (data) {
        data.newInsert = false;
      }
      this.popupOptions.param = data
        ? data
        : { vendorEvalPlanNo: 0, newInsert: true };
      this.popupOptions.target = () => import(`${'./resultmgmtDetail.vue'}`);
      this.popupOptions.title = 'L0000005173'; /* 평가및안전보건비용 결과 */
      this.popupOptions.width = '80%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
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

    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
<style>
.row-color .el-button {
  color: red !important;
}
</style>
