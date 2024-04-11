<!--
  목적 : 안전 > 안전순회 > 순회계획 목록
  Detail : 순회계획 목록 화면으로 이미 등록된 계획을 선택하여 결과를 등록하거나 등록창을 띄워 별도 결과만 등록할 수 있음.
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
            label="점검계획기간"
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
          <!-- 순회결과 -->
          <y-select
            :width="8"
            :comboItems="patrolResultCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="checkResultCd"
            label="L0000001710"
            v-model="searchParam.checkResultCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 순회주관부서 -->
          <y-tree-dept
            label="L0000001721"
            type="search"
            name="deptCd"
            :showAllDept="false"
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
          <!-- 순회대상 부서 -->
          <y-tree-dept
            type="search"
            name="tgtDeptCd"
            label="L0000004279"
            :showAllDept="true"
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
        <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
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
            :comboItems="patrolStepItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="점검상태"
            name="checkStepCd"
            v-model="searchParam.checkStepCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 세부점검계획 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001642"
            name="checkTitle"
            v-model="searchParam.checkTitle"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- <div slot="buttonGroup" class="float-right mb-1">
             무일정계획등록  
            <y-btn
              v-if="editable"
              title="L0000001036"
              color="orange"
              @btnClicked="tableLinkCheckTitleClicked"
            />
              검색  
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div> -->
          <!-- 순회점검계획 목록 -->
          <!-- <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            label="L0000001718"
            @tableLinkClicked="tableLinkCheckTitleClicked"
          ></y-data-table> -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001718')"
            :useExcelExport="false"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            @cellClick="cellClickHandler"
            @openNewPage="openNewPage"
            @getList="getList"
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
  name: 'y-patrol-plan',
  props: {},
  data: () => ({
    searchParam: {
      period: [],
      plantCd: '',
      safCheckKindNo: null,
      checkStepCd: 'CHS01',
      deptCd: '', // 순회주관부서
      tgtDeptCd: '', // 순회대상부서
      tgtVendorCd: '', // 순회대상업체
      tgtVendorNm: '',
      checkTitle: '',
      pgpDeptCd: '',
      pgpDeptNm: '',
      checkResultCd: '', // 순회결과
      deptSubYn: 'Y', // 하위부서여부 사용
      tgtDeptSubYn: 'Y', // 하위부서여부 사용
      pgpDeptSubYn: 'Y', // 하위부서여부 사용
    },
    gridOptions: {
      name: 'patrolPlan',
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
    patrolTypeItems: [], // 순회종류
    patrolStepItems: [], // 진행단계
    patrolResultCdItems: [],
    searchUrl: '',
    YAuiGrid: null,
  }),
  watch: {
    'searchParam.plantCd'() {
      this.getPatrolKindList();
    },
    'searchParam.tgtVendorNm'() {
      if (
        this.searchParam.tgtVendorNm === '' ||
        this.searchParam.tgtVendorNm === null
      ) {
        this.searchParam.tgtVendorCd = '';
      }
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
      this.searchUrl = selectConfig.saf.patrol.list.url;

      this.searchParam.deptSubYn = 'Y';
      this.searchParam.tgtDeptSubYn = 'Y';
      this.searchParam.pgpDeptSubYn = 'Y';

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), // 사업장
          dataField: 'plantNm',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002535'), // 점검(일정)명
          dataField: 'title',
          width: '250',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001642'), // 세부점검계획
          dataField: 'checkTitle',
          width: '250',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003718'),
          dataField: 'safCheckKindNm',
          width: '100',
          style: 'center-align',
        }, // 점검종류 상세
        {
          headerText: '점검상태', // 점검상태
          dataField: 'checkStepNm',
          width: '90',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002564'), // 점검예정일
          dataField: 'checkSchYmd',
          width: '120',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001721'),
          dataField: 'deptNm',
          width: '120',
          style: 'center-align',
        }, // 순회주관부서
        {
          headerText: '순회대상부서', // 순회대상
          dataField: 'tgt',
          width: '150',
          style: 'center-align',
        },
        {
          headerText: '순회수행부서', // 순회수행부서
          dataField: 'pgpDeptNm',
          width: '150',
          style: 'center-align',
        },
        {
          headerText: '순회결과', // 순회결과
          dataField: 'checkResultNm',
          width: '150',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002355') /* 작성자 */,
          dataField: 'writerUserNm',
          width: '120',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002352') /* 작성일 */,
          dataField: 'writerDt',
          width: '110',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001036'),
          color: 'orange',
          btnClicked: 'openNewPage',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        }, //  무일정계획등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        }, //  검색
      ];

      // 기간 Setting
      let today = this.$comm.getToday();
      let from = this.$comm.getCalculatedDate(
        today,
        '-2m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      let to = this.$comm.getCalculatedDate(
        today,
        '1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.period = [from, to];

      // 진행단계
      this.$comm.getComboItems('SAF_CHECK_STEP', true).then((_result) => {
        _result.splice(3, 1);
        _result.splice(0, 1);
        _result.splice(0, 0, {
          code: 'CHS99',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // '전체',
        });
        this.patrolStepItems = _result;
      });

      this.$comm.getComboItems('SAF_PATROL_RSLT_CLS', true).then((_result) => {
        this.patrolResultCdItems = _result;
      });

      this.getPatrolKindList();
      this.getList(); // 목록 조회
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
    getList() {
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
    cellClickHandler(event) {
      if (event.dataField !== 'checkTitle') return;

      // this.tableLinkCheckTitleClicked(event.item, false);
      this.popupOptions.target = () => import(`${'./patrolPlanDetail.vue'}`);
      this.popupOptions.title = 'L0000004284'; // 순회점검계획 등록/수정
      this.popupOptions.param = {
        safCheckRsltNo: event.item ? event.item.safCheckRsltNo : 0, // 순회결과번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openNewPage(event) {
      this.popupOptions.target = () => import(`${'./patrolPlanDetail.vue'}`);
      this.popupOptions.title = 'L0000004284'; // 순회점검계획 등록/수정
      this.popupOptions.param = {
        safCheckRsltNo: 0, // 순회결과번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /**
     * 순회결과 목록에 점검명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    tableLinkCheckTitleClicked(header, data) {
      this.popupOptions.target = () => import(`${'./patrolPlanDetail.vue'}`);
      this.popupOptions.title = 'L0000004284'; // 순회점검계획 등록/수정
      this.popupOptions.param = {
        safCheckRsltNo: data ? data.safCheckRsltNo : 0, // 순회결과번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
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
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 335;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
