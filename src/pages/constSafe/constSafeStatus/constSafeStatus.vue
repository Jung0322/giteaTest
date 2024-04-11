<!--
  목적 : 공사안전 > 공사현황 목록
  Detail : 공사현황 신청 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
        <!-- 사업장 -->
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작업기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002373"
            name="constPeriod"
            :default="searchParam.constPeriod"
            v-model="searchParam.constPeriod"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 공사진행단계 -->
          <y-select
            :width="8"
            :comboItems="constSafeStepItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000510"
            name="constStepCd"
            v-model="searchParam.constStepCd"
          ></y-select>
        </b-col>
        <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3"> -->
          <!-- 결재진행단계 -->
          <!-- <y-select
            :width="8"
            :comboItems="apprStepCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000451"
            name="bizApprStepCd"
            v-model="searchParam.bizApprStepCd"
          ></y-select>
        </b-col> -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 공사명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000503"
            name="constTitle"
            v-model="searchParam.constTitle"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000498')"
          :useExcelExport="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @cellDoubleClick="cellDoubleClickHandler"
          @openDetailPage="openDetailPage"
          @btnSearchClicked="btnSearchClickedCallback"
          @selectConst="selectConst"
          @closeConstPopup="closeConstPopup('CLOSE')"
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
  name: 'const-safe-status',
  props: {
    popupParam: {
      type: Object,
      default: function() {
        return {
          popupMode: false,
        };
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        plantCd: '',
        constPeriod: [],
        constTitle: '',
        constStepCd: '',
        bizApprStepCd: '',
        vendorCd: '',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'constSafeConstSafeStatus',
        header: [],
        data: [],
        height: '400',
      },
      selectedValue: null,
      editable: true,
      apprStepCdItems: [],
      constSafeStepItems: [],
      selectRow: null,
      searchUrl: '',
      excelDown: false,
    };
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

    if (this.popupParam.popupMode) {
      this.gridOptions.header.splice(1, 0, { 
        headerText: this.$comm.getLangSpecInfoLabel('L0000000503'), 
        dataField: 'constTitle', 
        width: '250', 
        renderer: {
          type: 'LinkRenderer',
          baseUrl: 'javascript',
          jsCallback: function (rowIndex, columnIndex, value, item) {},
        },
      });
    }
      
    this.setGridBtns();
    this.getList();
  },
  beforeDestroy() {
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      let excelDownDept = ['10C1400', '30E1300', '40K3600', '50K9200E']; // 안전환경팀
      if (this.$_.indexOf(excelDownDept, this.$store.getters.deptCd) > -1) {
        this.excelDown = true;
      } else {
        this.excelDown = false;
      }

      // Url Setting
      this.searchUrl = selectConfig.constSafe.const.list.url;
      this.searchParam.constPeriod = [];
      this.searchParam.constPeriod.push(
        this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '-21d',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        )
      );
      this.searchParam.constPeriod.push(
        this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '21d',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        )
      );

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '130', 
        }, 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000503'), 
          dataField: 'constTitle', 
          width: '250',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000510'), 
          dataField: 'constStepNm', 
          width: '120', 
        }, 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000451'), 
          dataField: 'bizApprStepNm', 
          width: '120', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002373'), 
          dataField: 'constPeriod', 
          width: '210',
        }, 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000502'), 
          dataField: 'constContent', 
          width: '250', 
          style: 'left-align',
        }, 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000139'), 
          dataField: 'constNum', 
          width: '130', 
        }, 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003246'), 
          dataField: 'vendorNms', 
          width: '130', 
        }, 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000971'), 
          dataField: 'createDeptNm', 
          width: '130', 
        }, 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writerUserNm', 
          width: '130', 
        }, 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'writerDt', 
          width: '130', 
        }, 
      ];

      this.$comm.getComboItems('SAF_CONST_STEP', true).then(_result => {
        this.constSafeStepItems = _result;
      });
      this.$comm.getComboItems('COM_BIZ_APPR_STEP', true).then(_result => {
        this.apprStepCdItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    setGridBtns() {
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'), // 신규등록
          color: 'orange',
          btnClicked: 'openDetailPage',
          visible: this.editable && !this.popupParam.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), // 검색
          color: 'green',
          btnClicked: 'btnSearchClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'), // 선택
          color: 'orange',
          selectConst: 'selectConst',
          visible: this.popupParam.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), // 닫기
          btnClicked: 'closeConstPopup',
          visible: this.popupParam.popupMode,
        },
      ];

      this.YAuiGrid.setBtnArr(this.gridOptions.btns);
    },
    /**
     * showAccidentPopup 호출
     * 사고등록 목록에 사고명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    cellClickHandler(event) {
      // click row
      if (this.popupParam.popupMode) {
        this.selectedValue = this.$_.clone(event.item);
      } else {
        this.selectRow = this.$_.clone(event.item);
      }

      if (event.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'constTitle') {
        this.openDetailPage(event.item);
      }
    },
    cellDoubleClickHandler(event) {
      if (this.popupParam.popupMode) {
        this.closeConstPopup(event.item);
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
    /** button 관련 이벤트 **/

    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openDetailPage(data) {
      if (!data) {
        this.popupOptions.title = 'L0000000497'; // 공사 등록
        this.popupOptions.param = {
          constNo: '',
          constStepCd: '',
        };
      } else {
        this.popupOptions.title = 'L0000000499'; // 공사 상세
        this.popupOptions.param = {
          constNo: data.constNo,
          constStepCd: data.constStepCd,
        };
      }
      this.popupOptions.top = '10px';
      this.popupOptions.target = () => import(`${'./constSafeDetail.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.width = '90%';
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /**
     * 사용자의 입력을 받는다.
     */
    /** button 관련 이벤트 **/
    btnSearchClickedCallback() {
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    selectConst() {
      if (!this.selectedValue) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000229', // 공사를 지정하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.closeConstPopup(this.selectedValue);
    },
    closeConstPopup(data) {
      if (data !== 'CLOSE') {
        data = this.selectedValue;
      }
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true, const: data });
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
