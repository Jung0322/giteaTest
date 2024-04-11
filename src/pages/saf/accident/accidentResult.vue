<!--
  목적 : 사고관리 - 조사결과/개선계획
  Detail : 사고 접수 목록 화면을 접수단계의 사고 목록을 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 기간(발생일) -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000770"
            name="period"
            v-model="searchParam.period"
          ></y-datepicker>
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
                :comboItems="comboAccidentStepItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="checkStepCd"
                v-model="searchParam.accidentStepCd"
              ></y-select>
            </b-col>
            <b-col sm="4">
              <y-select
                :width="12"
                :comboItems="apprItems"
                itemText="codeNm"
                itemValue="codeNm"
                ui="bootstrap"
                name="stateCd"
                v-model="searchParam.bizApprStepNm"
              ></y-select>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 발생장소 -->
          <y-text
            :width="8"
            ui="bootstrap"
            name="area"
            label="L0000001081"
            v-model="searchParam.area"
          ></y-text>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 사고명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            name="accidentTitle"
            label="L0000001390"
            v-model="searchParam.accidentTitle"
          ></y-text>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 발생부서 -->
          <y-tree-dept
            type="search"
            label="L0000001076"
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
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :label="this.$comm.getLangSpecInfoLabel('L0000001382')"
          :useExcelExport="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableSorting="true"
          @cellClick="cellClickHandler"
          @btnSearch="getList"
          @btnClickedError="btnClickedErrorCallback"
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
  name: 'y-accident-result',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '',
      period: [], // 기간(발생일)
      startDate: '', // From
      endDate: '', // To
      deptCd: '', // 발생부서 코드
      area: '', // 발생장소
      accidentTitle: '', // 사고명
      accidentStepCd: 'ACCS3', // 사내사고진행단계
      searchFlag: 'result',
      deptSubYn: 'Y', // 하위부서여부 사용
      bizApprStepNm: '', // 단계(결재상태)
    },
    YAuiGrid: null,
    gridOptions: {
      name: 'safAccidentAccidentResult',
      header: [],
      data: [],
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
    apprItems: [],
    comboAccidentStepItems: [], // 사내사고진행단계
    searchUrl: '',
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
    this.getList(); // 사고조사결과 목록 조회
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam.deptSubYn = 'Y';
      this.searchParam.bizApprStepNm = '전체';
      // Url Setting
      this.searchUrl = selectConfig.saf.accident.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '90', 
        }, // 사업장 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001390'), 
          dataField: 'accidentTitle', 
          width: '260', 
          style: 'left-align', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {}, 
          },
        }, // 사고명 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'), 
          dataField: 'stateNm', 
          width: '150',  
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {}, 
          },
        }, // 단계(상태) 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001078'), 
          dataField: 'accidentYmd', 
          width: '120', 
        }, // 발생일 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001076'), 
          dataField: 'deptNm', 
          style: 'left-align',
          width: '150', 
        }, // 발생부서 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001081'), 
          dataField: 'area', 
          style: 'left-align',
          width: '150', 
        }, // 발생장소 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001386'), 
          dataField: 'accKindNms', 
          width: '180', 
        }, // 사고구분 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001406'), 
          dataField: 'accidentTypeNms', 
          width: '180', 
        }, // 사고종류 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001401'), 
          dataField: 'victimNms', 
          style: 'left-align',
          width: '150', 
        }, // 사고자 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001405'), 
          dataField: 'investYnNm', 
          width: '120', 
        }, // 사고조사대상 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writerUserNm', 
          width: '100', 
        }, /* 작성자 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'writerDt', 
          width: '120', 
        }, /* 작성일 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000264'), 
          dataField: 'requestCnt', 
          width: '100', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) { },
          },
        }, // 개선요청
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000005012'), 
          dataField: 'incompletCnt', 
          width: '100', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {}, 
          },
        }, // 조치미완료 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000005013'), 
          dataField: 'overdueCnt', 
          width: '100',
          styleFunction: function (rowIndex, columnIndex, value, headerText, item, dataField) {
            return Number(value) !== 0 ? "grid-link-cell-red" : "grid-link-cell";
          }
        }, // 조치기한초과 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002683'), 
          dataField: 'completCnt', 
          width: '100', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {}, 
          },
        }, // 조치완료
      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'orange', 
          btnClicked: 'btnSearch',
          btnClickedError: 'btnClickedError',
        },  // 검색  
      ];

      // 사내사고진행단계
      this.$comm.getComboItems('SAF_ACCIDENT_STEP', true).then((_result) => {
        this.comboAccidentStepItems = _result;
        if (
          this.$_.findIndex(this.comboAccidentStepItems, {
            code: this.searchParam.accidentStepCd,
          }) === -1
        ) {
          this.searchParam.accidentStepCd = 'ACCS1';
        }
      });
      // 기간 Setting
      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        today,
        '-3m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to = this.$comm.getCalculatedDate(
        today,
        '0m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.period = [from, to];
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      // 상태(결재)
      this.$comm.getComboItems('COM_BIZ_APPR_STEP', true).then((_result) => {
        this.apprItems = _result;
      });
    },
    /** 사고조사결과 목록 조회 **/
    getList() {
      this.searchParam.startDate = this.$_.clone(this.searchParam.period[0]);
      this.searchParam.endDate = this.$_.clone(this.searchParam.period[1]);
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
    /**
     * showAccidentPopup 호출
     * 사고조사결과 목록에 사고명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    cellClickHandler(event) {
      if (event.dataField === 'accidentTitle') {
        this.showAccidentPopup(event.item, false);
      } else if (event.dataField === 'stateNm') {
        this.showApprProgressPopup(event.item);
      } else if (
        event.dataField === 'requestCnt' ||
        event.dataField === 'incompletCnt' ||
        event.dataField === 'overdueCnt' ||
        event.dataField === 'completCnt'
      ) {
        const data = this.$_.cloneDeep(event.item);
        data.apprFlag = event.dataField;
        this.openImprPopup(data);
      }
    },
    openImprPopup(data) {
      this.popupOptions.target = () =>
        import('@/pages/rsa/rsamgmt/resultmgmtImprPopup');
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005000'; // '개선사항 목록';
      this.popupOptions.param = {
        imprClassCd: 'ICL01',
        refTableId: data.safAccidentNo,
        apprFlag: data.apprFlag,
      };

      this.popupOptions.closeCallback = this.closePopup;
    },
    /**
     * 해당 사고 상세보는 팝업 open
     */
    showAccidentPopup(data, flag) {
      let tabIndex = 5;
      if (data.accidentStepCd === 'ACCS0' || !data.accidentStepCd) {
        tabIndex = 0;
      } else if (data.accidentStepCd === 'ACCS1') {
        tabIndex = 1;
      } else if (data.accidentStepCd === 'ACCS2') {
        tabIndex = 3;
      }
      this.popupOptions.target = () => import(`${'./accidentDetail.vue'}`);
      this.popupOptions.title = 'L0000003652'; // 사고
      this.popupOptions.param = {
        safAccidentNo: data.safAccidentNo, // 사내사고번호
        accidentStepCd: data.accidentStepCd, // 사내사고진행단계
        investYn: data.investYn,
        insertFlag: 'result',
        tabIndex: tabIndex,
      };
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

    /** button 관련 이벤트 **/

    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 350;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>