<!--
  목적 : 점검 > 중대시민재해점검 관리 > 점검 결과 관리
  Detail : 점검결과 관리 관리 등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            name="period"
            :range="true"
            label="L0000000767"
            :default="searchParam.period"
            v-model="searchParam.period"
          />
        </b-col>
        <!-- 사업장 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <y-plant type="search" v-model="searchParam.plantCd"></y-plant>
        </b-col>
        <!-- 점검명 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002551"
            name="chkNm"
            v-model="searchParam.chkNm"
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
                :comboItems="statusItem"
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
          <!-- 주관부서 -->
          <y-tree-dept
            label="L0000002713"
            type="search"
            name="mainDeptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.mainDeptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="
              (val) => {
                searchParam.deptSubYn = val;
              }
            "
          />
        </b-col>
        <!-- 개선조치 기한초과 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <b-row>
            <b-col sm="7">
              <y-checkbox
                :width="5"
                :comboItems="[
                  { text: '', value: 'Y' },
                  { text: '', value: 'N' },
                ]"
                ui="bootstrap"
                name="searchParam.imprChk"
                :useDefault="true"
                label="L0000004983"
                v-model="searchParam.imprChk"
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
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="openPopup"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           중대시민재해점검 목록 
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :print="true"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
            :cellClassName="tableCellClassName"
            label="L0000005252"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005252')"
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
  name: 'y-assess-plan',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '', // 사업장
      period: [], // 기간
      deptSubYn: 'Y', // 하위부서여부 사용
      chkNm: null,
      procStepCd: null, // 단계
      mainDeptCd: null,
      stateCd: null, // 상태
      imprChk: 'N', // 개선조치가한초과
    },
    gridOptions: {
      name: 'inspectionMgmt',
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
    statusItem: [{ code: null, codeNm: '결과' }], // 단계
    stateItems: [], // 결재상태
    majDisaInspNos: [], // 결재요청시 전달할 파라미터
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

      this.searchParam.period = [from, to];

      this.$comm.getComboItems('COM_STATE', true).then((_result) => {
        this.stateItems = this.$_.reject(_result, {
          code: 'STATE1',
        });
      });

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
        this.deptEditable = true;
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000829'), 
          dataField: 'year', 
          width: '5%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '5%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005253'), 
          dataField: 'inspDt', 
          width: '8%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002551'), 
          dataField: 'chkNm', 
          width: '15%', 
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'), 
          dataField: 'mainDeptNm', 
          width: '7%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'), 
          dataField: 'stateNm', 
          width: '7%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'createUserNm', 
          width: '8%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'createDt', 
          width: '9%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000264'), 
          dataField: 'requestCnt', 
          width: '9%', 
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
          width: '9%', 
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
          width: '9%', 
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
          width: '9%', 
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
          title: this.$comm.getLangSpecInfoLabel('L0000005043'),
          color: 'black',
          btnClicked: 'btnAppr',
          visible: this.editable
        },
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
      this.getList();
    },
    getList() {
      this.$http.url = selectConfig.saf.majDisaInsp.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          if (this.companyEditable) {
            // 전사권한 : 전체 건
            this.gridOptions.data = this.$_.clone(_result.data);
            this.YAuiGrid.setGridData(this.gridOptions.data)
          } else if (this.plantEditable) {
            // 사업장권한 : 내 사업장 등록 건
            this.gridOptions.data = this.$_.clone(
              _result.data.filter(
                (v) => v.plantCd === this.$store.getters.plantCd
              )
            );
            this.YAuiGrid.setGridData(this.gridOptions.data)
          } else if (this.deptEditable) {
            // 일반권한 : 내 부서 등록 건 + 타 부서 평가완료 건
            this.gridOptions.data = this.$_.clone(
              _result.data.filter(
                (v) =>
                  v.mainDeptCd === this.$store.getters.deptCd ||
                  v.stepCd === 'BAPSG'
              )
            );
            this.YAuiGrid.setGridData(this.gridOptions.data)
          }

          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'stateNm') {
        this.showApprProgressPopup(event.item);
      } else if (
        event.dataField === 'requestCnt' ||
        event.dataField === 'incompletCnt' ||
        event.dataField === 'overdueCnt' ||
        event.dataField === 'completCnt'
      ) {
        event.item.apprFlag = event.dataField;
        this.openImprPopup(event.item);
      } else if (event.dataField === 'chkNm') {
        this.openPopup(event.item);
      }
    },
    tableLinkClicked(header, data) {
      if (header.name === 'stateNm') {
        this.showApprProgressPopup(data);
      } else if (
        header.name === 'requestCnt' ||
        header.name === 'incompletCnt' ||
        header.name === 'overdueCnt' ||
        header.name === 'completCnt'
      ) {
        data.apprFlag = header.name;
        this.openImprPopup(data);
      } else {
        this.openPopup(data);
      }
    },
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./inspectionMgmtDetail.vue'}`);
      this.popupOptions.title = 'L0000005254'; // 중대시민재해점검 상세
      this.popupOptions.param = data ? data : { majDisaInspNo: 0 };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.apprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openImprPopup(data) {
      this.popupOptions.target = () =>
        import(`${'@/pages/rsa/rsamgmt/resultmgmtImprPopup'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005000'; // '개선사항 목록';
      this.popupOptions.param = {
        imprClassCd: 'ICL40',
        refTableId: data.majDisaInspNo,
        apprFlag: data.apprFlag,
      };

      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      if (!data) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    btnAppr() {
      let promises = [{ func: this.checkValidation }, { func: this.apprData }];

      this.$comm.orderedPromise(promises);
    },
    checkValidation() {
      return new Promise((_resolve) => {
        let apprDatas = this.YAuiGrid.getGridData().filter(
          (data) => data.stepCd !== 'BAPSG' && data.stepCd !== 'BAPSA'
        );

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
          this.majDisaInspNos = apprDatas
            .map((data) => data.majDisaInspNo)
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
          apprBizCd: 'SA-MA-01',
          apprParams: {
            majDisaInspNo: this.majDisaInspNos,
          },
        };
      });
    },

    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchClickedCallback() {
      this.getList();
    },
  },
};
</script>

<style></style>
