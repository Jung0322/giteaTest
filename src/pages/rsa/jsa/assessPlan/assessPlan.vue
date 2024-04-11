<!--
  목적 : 평가계획 수립 - 평가계획 수립 관리
  Detail : 평가계획 등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <!-- 진행상태 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="comboAssessStatusItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002779"
            name="assessStatus"
            v-model="searchParam.assessStatus"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 평가년도 -->
          <y-datepicker
            :width="8"
            type="year"
            :range="true"
            name="searchAssessYear"
            label="L0000003065"
            :default="searchParam.assessYear"
            v-model="searchParam.assessYear"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-dept
            type="search"
            label="L0000000890"
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
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 담당자 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000004201"
            :disabled="true"
            name="userNm"
            v-model="searchParam.userNm"
            :appendIcon="[{ 'icon': 'times', callbackName: 'clear' }, { 'icon': 'search', callbackName: 'searchUser' }]"
            @searchUser="btnSearchUserClicked"
            @clear="clear"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003081"
            name="assessNm"
            v-model="searchParam.assessNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
          계획등록 
            <y-btn
              v-if="editable"
              title="L0000000470"
              color="orange"
              @btnClicked="openPopup('JSA', null)"
              @btnClickedErrorCallback="btnClickedErrorCallback"
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
            :print="true"
            :use-paging="true"
            @tableLinkClicked="tableLinkAccidentTitleClicked"
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
          @getList="getList"
          @openPopup="openPopup('JSA', null)"
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
      assessTypeCd: 'AT002', // JSA
      assessGroupCd: 'AK002', // 작업위험성평가
      assessStatus: 'P', // 진행상태
      assessYear: [], // 평가기간
      userId: '', // 담당자ID
      userNm: '', // 담당자명
      deptCd: '',
      assessNm: '',
      deptSubYn: 'Y', // 하위부서여부 사용
    },
    gridOptions: {
      name: 'assessPlanJSA',
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
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    comboAssessStatusItems: [], // 진행상태
    comboAssessTypeItems: [], // 평가기법
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
  },
  beforeDestroy() {
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      let today = this.$comm.getToday();
      this.searchParam.assessYear = [
        today.substring(0, 4),
        today.substring(0, 4),
      ];
      // Url Setting
      this.searchUrl = selectConfig.rsa.assessPlan.list.url;

      this.searchParam.deptSubYn = 'Y';


      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '5%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'), 
          dataField: 'assessNm', 
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
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'), 
          dataField: 'assessStatusNm', 
          width: '5%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000452'), 
          dataField: 'bizApprStepNm', 
          width: '7%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002120'), 
          dataField: 'assessTypeChecks', 
          width: '7%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002596'), 
          dataField: 'regRegdemNm', 
          width: '7%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003062'), 
          dataField: 'assessPeriod', 
          width: '13%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000890'), 
          dataField: 'deptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004201'), 
          dataField: 'userNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001528'), 
          dataField: 'assessDesc', 
          width: '15%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writerUserNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'writerDt', 
          width: '10%', 
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
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.$comm.getComboItems('RSA_STEP', true).then(_result => {
        _result.splice(2, 2)
        this.comboAssessStatusItems = _result
      });
      this.getList(); // 평가계획 목록 조회
    },

    /**
     * showAccidentPopup 호출
     * 평가계획 목록에 평가명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    cellClickHandler(event) {
      if (event.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'assessNm') {
        this.openPopup('detail', event.item);
      }
    },
    tableLinkAccidentTitleClicked(header, data) {
      if (header.name === 'bizApprStepNm') {
        this.showApprProgressPopup(data);
      } else {
        this.openPopup('detail', data);
      }
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.papprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openPopup(gubun, data) {
      this.popupOptions.target = () => import(`${'./assessPlanDetail.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;

      if (gubun === 'detail') {
        this.popupOptions.title = 'L0000003051'; // 평가등록
        this.popupOptions.param = {
          assessPlanNo: data.assessPlanNo, // key
          assessStepCd: data.assessStepCd,
          plantCd: data.plantCd,
        };
      } else if (gubun === 'JSA') {
        this.popupOptions.title = 'L0000000124'; // JSA평가계획 등록
        this.popupOptions.param = {
          assessPlanNo: 0, // key
        };
      }
    },
    resizeGrid() {
      let _height = window.innerHeight - 385;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    /** 위험성 평가계획 수립 목록 검색 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.gridOptions.data);
          this.$comm.pushCookie(this.searchParam);
        },
        _error => {
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
    btnSearchUserClicked() {
      this.popupOptions.target = () =>
        import(`${'../../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.searchParam.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupUser;
    },
    closePopupUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.searchParam.userId = data.user.userId;
        this.searchParam.userNm = data.user.userNm;
      }
    },
    clear() {
      this.searchParam.userId = null;
      this.searchParam.userNm = null;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
