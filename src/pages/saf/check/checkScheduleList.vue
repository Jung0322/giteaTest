<!--
  목적 : 안전점검 관리 - 안전점검계획 목록
  Detail : 안전점검계획 목록 화면으로 이미 등록된 계획을 조회하여 삭제하거나,  등록창을 띄워 신규 계획을  등록할 수 있음.
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
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000767"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검종류 상세 -->
          <y-select
            :width="8"
            :comboItems="comboCheckKindItems"
            itemText="safCheckKindNm"
            itemValue="safCheckKindNo"
            ui="bootstrap"
            name="safCheckKindNo"
            label="L0000003718"
            v-model="searchParam.safCheckKindNo"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검주관부서 -->
          <y-tree-dept
            type="search"
            label="L0000002578"
            :showAllDept="false"
            name="deptCd"
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
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검대상부서 -->
          <y-tree-dept
            type="search"
            label="L0000002549"
            :showAllDept="true"
            name="tgtDeptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.tgtDeptCd"
            :deptSubYn="searchParam.tgtDeptSubYn"
            @setDeptSubYn="setTgtDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!--점검수행부서 -->
          <y-tree-dept
            type="search"
            label="L0000004852"
            :showAllDept="true"
            name="pfmDeptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.pfmDeptCd"
            :deptSubYn="searchParam.pfmDeptSubYn"
            @setDeptSubYn="setPfmDeptSubYn"
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
            name="stepStatus"
            label="L0000002554"
            v-model="searchParam.stepStatus"
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
    <b-row>
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :label="this.$comm.getLangSpecInfoLabel('L0000001884')"
          :use-paging="true"
          :editable="editable"
          :useExcelExport="false"
          @cellClick="cellClickHandler"
          @openPopup="openPopup"
          @getList="getList"
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
  name: 'check-schedule-list',
  props: {},
  data() {
    return {
      searchParam: {
        period: [],
        startDate: '',
        endDate: '',
        tgtDeptCd: '', // 대상부서코드
        deptCd: '', // 주관부서코드
        safCheckKindNo: '', // 점검종류번호
        plantCd: '', // 사업장 코드
        checkStepCd: 'CHS00', // 점검진행상태
        stepStatus: '', // 점검상태
        keyword: '', // 점검(일정)명
        deptSubYn: 'Y', // 하위부서여부 사용
        tgtDeptSubYn: 'Y', // 하위부서여부 사용
        pfmDeptSubYn: 'Y',
      },
      gridOptions: {
        name: 'checkScheduleList',
        header: [],
        data: [],
        btns: [],
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
      comboCheckKindItems: [], // 점검종류
      stepStatusItems: [],
      searchUrl: '',
      YAuiGrid: null,
    };
  },
  watch: {
    'searchParam.plantCd'() {
      this.getComboCheckKindItems();
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
      this.searchUrl = selectConfig.saf.checkSchedule.list.url;

      this.searchParam.deptSubYn = 'Y';
      this.searchParam.tgtDeptSubYn = 'Y';
      this.searchParam.pfmDeptSubYn = 'Y';

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '90',
          style: 'center-align',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004877'),
          dataField: 'checkMasterTitle',
          width: '200',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 점검일정명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003718'),
          dataField: 'safCheckKindNm',
          width: '250',
          style: 'left-align',
        }, // 점검종류 상세
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002554'),
          dataField: 'stepStatusNm',
          width: '110',
          style: 'center-align',
        }, // 점검상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000452'),
          dataField: 'bizApprStepNm',
          width: '110',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 결재진행상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002543'),
          dataField: 'safCheckPlanSymd',
          width: '130',
          style: 'center-align',
        }, // 점검계획시작일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002544'),
          dataField: 'safCheckPlanEymd',
          width: '130',
          style: 'center-align',
        }, // 점검계획종료일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002578'),
          dataField: 'deptNm',
          width: '130',
          style: 'center-align',
        }, // 점검주관부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002549'),
          dataField: 'tgtDeptNm',
          width: '130',
          style: 'center-align',
        }, // 점검대상부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004852'),
          dataField: 'pfmDeptNm',
          width: '130',
          style: 'center-align',
        }, // 점검수행부서
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002355') /* 작성자 */,
          dataField: 'writerUserNm',
          width: '110',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002352') /* 작성일 */,
          name: 'writerDt',
          width: '110',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openPopup',
          visible: this.editable,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
          visible: this.editable,
        }, //  검색
      ];
      this.stepStatusItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') },
        { code: 'ING', codeNm: this.$comm.getLangSpecInfoLabel('L0000003642') },
        {
          code: 'CMPLT',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003643'),
        },
      ];
      // 기간 Setting
      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        today,
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to = this.$comm.getCalculatedDate(
        today,
        '1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.period = [from, to];
      this.getList(); // 안전점검일정 목록 조회
    },
    /**
     * 점검종류 조회
     */
    getComboCheckKindItems() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        planUseYn: 'Y',
        useYn: 'Y',
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.comboCheckKindItems = this.$_.clone(_result.data);
          this.comboCheckKindItems.splice(0, 0, {
            safCheckKindNo: '',
            safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          });

          if (
            this.$_.findIndex(this.comboCheckKindItems, {
              safCheckKindNo: this.searchParam.safCheckKindNo,
            }) === -1
          ) {
            this.searchParam.safCheckKindNo = '';
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 안전점검일정 목록 조회 **/
    getList() {
      this.searchParam.startDate = this.$_.clone(this.searchParam.period[0]);
      this.searchParam.endDate = this.$_.clone(this.searchParam.period[1]);
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    cellClickHandler(event) {
      if (event.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'checkMasterTitle') {
        this.openPopup(event.item);
      } else {
        return;
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
      this.popupOptions.target = () => import(`${'./checkScheduleDetail.vue'}`);
      this.popupOptions.title = 'L0000001882'; // 안전점검일정
      this.popupOptions.param = {
        safCheckNo: data ? data.safCheckNo : 0, // 안전점검일련번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
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
    setPfmDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.pfmDeptSubYn = _result;
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
