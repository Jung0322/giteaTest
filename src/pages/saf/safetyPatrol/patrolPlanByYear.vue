<!--
  목적 : 순회점검  - 연간순회점검계획 목록
  Detail : 연간순회점검계획
  etg
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검계획기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002542"
            name="period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검종류 상세 -->
          <y-select
            :width="8"
            :comboItems="patrolTypeItems"
            itemText="safCheckKindNm"
            itemValue="safCheckKindNo"
            ui="bootstrap"
            name="patrolType"
            label="L0000003718"
            v-model="searchParam.safCheckKindNo"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 순회주관부서 -->
          <y-tree-dept
            type="search"
            name="deptCd"
            label="L0000001721"
            :showAllDept="false"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 순회대상부서 -->
          <y-tree-dept
            type="search"
            name="tgtDeptCd"
            label="순회대상부서"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.tgtDeptCd"
            :deptSubYn="searchParam.tgtDeptSubYn"
            @setDeptSubYn="setTgtDeptSubYn"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 순회대상 협력업체 -->
          <y-text
            :width="8"
            :readonly="true"
            ui="bootstrap"
            label="L0000004280"
            name="tgtVendorNm"
            v-model="searchParam.tgtVendorNm"
            :appendIcon="[{ icon: 'search', callbackName: 'searchVendor' }]"
            @searchVendor="searchVendor"
          ></y-text>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 순회수행부서 -->
          <y-tree-dept
            type="search"
            name="pgpDeptCd"
            label="순회수행부서"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.pgpDeptCd"
            :deptSubYn="searchParam.pgpDeptSubYn"
            @setDeptSubYn="setPgpDeptSubYn"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검상태 -->
          <y-select
            :width="8"
            :comboItems="stepStatusItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="stepCd"
            label="L0000002554"
            v-model="searchParam.stepCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검(일정)명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002535"
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
              신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="openPopUp"
            />
              검색  
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
            연간순회점검일정 목록  
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkCheckTitleClicked"
            label="연간순회점검일정 목록"
          ></y-data-table>
        </b-col> -->
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            label="연간순회점검일정 목록"
            :useExcelExport="false"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            @cellClick="cellClickHandler"
            @getList="getList"
            @openPopUp="openPopUp"
            @btnClickedError="btnClickedErrorCallback"
          />
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'patrol-plan-by-year',
  props: {},
  data: () => ({
    searchParam: {
      period: [],
      startDate: '',
      endDate: '',
      deptCd: '', // 순회주관부서
      tgtDeptCd: '', // 순회대상부서
      pgpDeptCd: '', // 순회수행부서
      tgtVendorCd: '', // 순회대상업체
      tgtVendorNm: '',
      plantCd: '', // 사업장 코드
      safCheckKindNo: null,
      stepCd: null, // 점검진행상태
      keyword: '', // 점검(일정)명
      deptSubYn: 'Y', // 하위부서여부 사용
      tgtDeptSubYn: 'Y', // 하위부서여부 사용
      pgpDeptSubYn: 'Y',
    },
    gridOptions: {
      name: 'patrolPlanByYear',
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
    editable: false,
    stepStatusItems: [],
    searchUrl: '',
    patrolTypeItems: [],
    YAuiGrid: null,
  }),
  watch: {
    'searchParam.tgtVendorNm'() {
      if (
        this.searchParam.tgtVendorNm === '' ||
        this.searchParam.tgtVendorNm === null
      ) {
        this.searchParam.tgtVendorCd = '';
      }
    },
    'searchParam.plantCd'() {
      this.getPatrolKindList();
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
      this.searchUrl = selectConfig.saf.patrolMst.list.url;

      this.searchParam.deptSubYn = 'Y';
      this.searchParam.tgtDeptSubYn = 'Y';
      this.searchParam.pgpDeptSubYn = 'Y';

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), // 사업장
          dataField: 'plantNm',
          width: '120px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002535'), // 점검(일정)명
          dataField: 'title',
          width: '250px',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        // {
        //   headerText: this.$comm.getLangSpecInfoLabel('L0000001415')'L0000000452', // 결재진행상태
        //  dataField: 'bizApprStepNm',
        //   width: '150px',
        //   style: 'center-align',
        //   url: 'true',
        // },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003718'), // 점검종류 상세
          dataField: 'safCheckKindNm',
          width: '120px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002554'), // 점검상태
          dataField: 'stepNm',
          width: '90px',
          style: 'center-align',
        },

        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002543'), // 점검계획시작일
          dataField: 'checkPlanSYmd',
          width: '130px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002544'), // 점검계획종료일
          dataField: 'checkPlanEYmd',
          width: '130px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001721'),
          dataField: 'deptNm',
          width: '130px',
          style: 'center-align',
        }, // 순회주관부서
        {
          headerText: '순회대상부서', // 순회대상부서
          dataField: 'tgtNm',
          width: '150px',
          style: 'center-align',
        },
        {
          headerText: '순회수행부서', // 순회수행부서
          dataField: 'pgpDeptNm',
          width: '150px',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002355') /* 작성자 */,
          dataField: 'writerUserNm',
          width: '120px',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002352') /* 작성일 */,
          dataField: 'writerDt',
          width: '110px',
          style: 'center-align',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openPopUp',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        }, //  검색
      ];

      this.$comm.getComboItems('SAF_PATROL_YEAR_STEP', true).then((_result) => {
        this.stepStatusItems = _result;
      });
      this.getList(); // 안전점검결과 목록 조회
      // 순회종류
      this.getPatrolKindList();
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
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    getPatrolKindList() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        patrolYn: 'Y',
        chngKind: 'CKC04',
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          this.patrolTypeItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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

    tableLinkCheckTitleClicked(header, data) {
      if (header.name === 'bizApprStepNm') {
        this.showApprProgressPopup(data);
      } else {
        if (!data) return;
        this.openPopUp(data, false);
      }
      // this.popupOptions.target = () =>
      //   import(`${'./patrolPlanByYearDetail.vue'}`);
      // this.popupOptions.title = 'L0000001980'; // 연간순회점검계획 수정/상세
      // this.popupOptions.param = {
      //   patrolMstNo: data.patrolMstNo, // 연간순회점검일련번호
      //   bizApprStepCd: data.bizApprStepCd, // 결재진행상태
      // };
      // this.popupOptions.width = '90%';
      // this.popupOptions.visible = true;
      // this.popupOptions.closeCallback = this.closePopup;
    },

    cellClickHandler(event) {
      if (event.dataField === 'title') {
        this.openPopUp(event.item, false);
      } else if (event.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(event.item);
      } else return;
    },

    openPopUp(data) {
      this.popupOptions.target = () =>
        import(`${'./patrolPlanByYearDetail.vue'}`);
      this.popupOptions.title = 'L0000001977'; // 연간순회점검계획 등록
      this.popupOptions.param = {
        patrolMstNo: data ? data.patrolMstNo : 0, // 연간순회점검일련번호
      };
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** end button 관련 이벤트 **/
    searchVendor() {
      this.popupOptions.target = () =>
        import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003246'; // 협력업체
      this.popupOptions.param = {
        popupMode: true,
        plantCd: this.searchParam.plantCd,
      };
      this.popupOptions.width = '80%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        this.searchParam.tgtVendorCd = data.data.vendorCd;
        this.searchParam.tgtVendorNm = data.data.vendorNm;
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
    setPgpDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.pgpDeptSubYn = _result;
    },
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
