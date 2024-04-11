<!--
  목적 : 점검>정부지자체 시정조치 이행점검 관리 관리>점검결과 관리
  Detail : 점검결과 관리 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 사업장 -->
          <y-plant
            :width="8"
            name="plantCd"
            type="search"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 대상년도 -->
          <y-datepicker
            :width="8"
            label="L0000004449"
            type="year"
            name="year"
            :default="searchParam.year"
            v-model="searchParam.year"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 구분 -->
          <y-select
            :width="8"
            :comboItems="regRegdemItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="regRegdem"
            label="L0000000686"
            v-model="searchParam.regRegdem"
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
          <!-- 점검명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002551"
            name="chkNm"
            v-model="searchParam.chkNm"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 관련 정부지자체 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000005255"
            name="refGovNm"
            v-model="searchParam.refGovNm"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 주관부서 -->
          <y-tree-dept
            label="L0000002713"
            type="search"
            name="mainDeptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.mainDeptCd"
            :deptSubYn="searchParam.mainDeptSubYn"
            @setDeptSubYn="
              (val) => {
                searchParam.mainDeptSubYn = val;
              }
            "
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 대상부서 -->
          <y-tree-dept
            label="L0000000927"
            type="search"
            name="targetDeptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.targetDeptCd"
            :deptSubYn="searchParam.targetDeptSubYn"
            @setDeptSubYn="
              (val) => {
                searchParam.targetDeptSubYn = val;
              }
            "
          />
        </b-col>
        <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
          <!-- 조치기한 초과 -->
          <y-checkbox
            :width="4"
            :useDefault="true"
            checkedValue="Y"
            uncheckedValue="N"
            ui="bootstrap"
            name="overdueYn"
            label="L0000005013"
            v-model="searchParam.overdueYn"
          ></y-checkbox>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
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
           점검결과 목록 
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
            :cellClassName="tableCellClassName"
            label="L0000002537"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002537')"
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
  name: 'gov-impl-chk-result',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: null, // 사업장
      year: null, // 대상년도
      regRegdem: null, // 구분
      procStepCd: 'CS002', // 단계 (결과로 고정)
      stateCd: null, // 상태
      chkNm: null, // 점검명
      mainDeptCd: null, // 주관부서
      mainDeptSubYn: 'Y', // 주관부서 하위부서 조회 여부
      targetDeptCd: null, // 대상부서
      targetDeptSubYn: 'Y', // 대상부서 하위부서 조회 여부
      refGovNm: null, // 관련 정부지자체
      overdueYn: null, // 조치기한 초과 여부
    },
    gridOptions: {
      name: 'govImplChkResult',
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
    regRegdemItems: [], // 구분 selectbox 목록
    procStepItems: [], // 상태 selectbox 목록
    stateItems: [], // 상태 selectbox 목록
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
    tableCellClassName({ row, column, rowIndex, colIndex }) {
      if (column.property === 'overdueCnt' && row['overdueCnt'] !== '0') {
        return 'row-color';
      }
    },
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchParam.year = this.$comm.getThisYear();

      this.searchParam.targetDeptCd = null;

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
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '5%', 

        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004449'), 
          dataField: 'year', 
          width: '5%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002551'), 
          dataField: 'chkNm', 
          width: '13%', 
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), 
          dataField: 'regRegdemNm', 
          width: '5%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'), 
          dataField: 'mainDeptNm', 
          width: '6%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005255'), 
          dataField: 'refGovNm', 
          width: '6%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002545'), 
          dataField: 'chkPeriod', 
          width: '13%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'), 
          dataField: 'stepNm', 
          width: '6%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writerNm', 
          width: '6%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'writeDt', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'), 
          dataField: 'targetDeptCnt', 
          width: '5%', 
        },

        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000264'), 
          dataField: 'requestCnt', 
          width: '5%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005012'), 
          dataField: 'incompletCnt', 
          width: '5%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005013'), 
          dataField: 'overdueCnt', 
          width: '5%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002683'), 
          dataField: 'completCnt', 
          width: '5%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openPopup',
          visible: this.editable
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ]

      // 구분 (정기/수시)
      this.$comm.getComboItems('RSA_REG_REGDEM', true).then((_result) => {
        this.regRegdemItems = _result;
      });

      // 단계 (계획/결과)
      this.$comm.getComboItems('COM_STEP', true).then((_result) => {
        this.procStepItems = _result;
      });

      // 상태 (미작성/작성중/결재중/결재완료)
      this.$comm.getComboItems('COM_STATE', true).then((_result) => {
        this.stateItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    getList() {
      this.$http.url = selectConfig.saf.govImplChkResult.list.url;
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
                  v.mainDeptCd === this.$store.getters.deptCd ||
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
    cellClickHandler(event) {
      if (event.dataField === 'stepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField.includes('Cnt')) {
        this.openStatusPop(event.item, event.dataField);
      } else if (event.dataField === 'chkNm') {
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
      this.popupOptions.target = () =>
        import(`${'./govImplChkResultDetail.vue'}`);
      this.popupOptions.title = 'L0000005275'; // 정부지자체 시정조치 이행점검결과 상세
      this.popupOptions.param = data ? data : { evalPlanNo: 0 };
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
    resizeGrid() {
      let _height = window.innerHeight - 335;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    openStatusPop(data, headerName) {
      let param = {
        imprClassCd: 'ICL39', // 정부지자체 시정조치 이행점검
        refTableId: data.implChkPlanNo,
        actClassCd: headerName === 'overdueCnt' ? 'ACL02' : null,
        apprFlag: headerName,
      };

      this.popupOptions.target = () => import(`${'@/pages/impr/imprActPopup'}`);
      this.popupOptions.title = 'L0000000259'; // 개선사항
      this.popupOptions.param = param;
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getList();
    },
    /** button 관련 이벤트 **/
    /** end button 관련 이벤트 **/
  },
};
</script>
<style>
.row-color .el-button {
  color: red !important;
}
</style>
