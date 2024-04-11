<!--
  목적 : 교육 목록
  작성자 : kkc
  Detail : 교육 목록 조회
  * 
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 대상년도 -->
          <y-datepicker
            :width="9"
            label="L0000004449"
            type="year"
            name="year"
            :default="searchParam.year"
            v-model="searchParam.year"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <y-plant
            :width="9"
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
            @datachange="
              (val) => {
                (searchParam.plantCd = val), getEduCourseItems();
              }
            "
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육기간 -->
          <y-datepicker
            :width="9"
            type="day"
            :range="true"
            label="L0000000641"
            name="year"
            :start="minDt"
            :end="maxDt"
            :default="searchParam.duration"
            v-model="searchParam.duration"
          ></y-datepicker>
        </b-col>

        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육대분류 -->
          <y-select
            :width="9"
            :comboItems="eduAttCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000644"
            name="eduAttCd"
            v-model="searchParam.eduAttCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육분류 -->
          <y-select
            :width="9"
            :comboItems="eduClassCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000659"
            name="eduClassCd"
            v-model="searchParam.eduClassCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육명 -->
          <y-select
            :width="9"
            :comboItems="eduCourseSearchItems"
            itemText="eduCourseNm"
            itemValue="safEduCourseNo"
            ui="bootstrap"
            type="edit"
            label="L0000000653"
            name="safEduCourseNo"
            v-model="searchParam.safEduCourseNo"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육구분 -->
          <y-select
            :width="9"
            :comboItems="eduTypeCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000639"
            name="eduTypeCd"
            v-model="searchParam.eduTypeCd"
          ></y-select>
        </b-col>

        <b-col sm="1" md="1" lg="1" xl="1" class="col-xxl-1">
          <!-- 교육과정 -->
          <y-label label="L0000000633" />
        </b-col>
        <b-col sm="7" md="7" lg="7" xl="7" class="col-xxl-7">
          <y-text
            :width="12"
            ui="bootstrap"
            type="search"
            name="eduNm"
            v-model="searchParam.eduNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 단계 -->
          <y-select
            :width="9"
            :disabled="true"
            :comboItems="procStepItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000005014"
            name="procStepCd"
            v-model="searchParam.procStepCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 상태 -->
          <y-select
            :width="9"
            :comboItems="stateItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="pStateCd"
            label="L0000001538"
            v-model="searchParam.pStateCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 관련법규 -->
          <y-select
            :width="9"
            :comboItems="isTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="isTypeCd"
            label="L0000000568"
            v-model="searchParam.isTypeCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 주관부서 -->
          <y-tree-dept
            :width="9"
            type="search"
            label="L0000002713"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.mainDeptCd"
            :deptSubYn="searchParam.mainDeptSubYn"
            @setDeptSubYn="setMainDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 대상부서 -->
          <y-tree-dept
            :width="9"
            type="search"
            label="L0000000927"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.targetDeptCd"
            :deptSubYn="searchParam.targetDeptSubYn"
            @setDeptSubYn="setTargetDeptSubYn"
          />
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 수행부서 -->
          <y-tree-dept
            :width="9"
            type="search"
            label="L0000005120"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.execDeptCd"
            :deptSubYn="searchParam.execDeptSubYn"
            @setDeptSubYn="setExecDeptSubYn"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 교육 목록 결과 목록 grid -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           교육 목록 현황 
          <y-data-table
            label="L0000000613"
            :print="true"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000613')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getList="getList"
          @cellClick="cellClickHandler"
          @btnPopupClickedCallback="btnPopupClickedCallback"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'education-list',
  props: {},
  data() {
    return {
      searchParam: {
        safEduCourseNo: 0,
        duration: [],
        year: '',
        deptCd: null,
        tgtDeptCd: null,
        eduAttCd: null,
        eduTypeCd: null,
        eduClassCd: null,
        eduNm: '',
        procStepCd: 'CS001',
        pStateCd: '',
        isTypeCd: '',
        mainDeptSubYn: 'Y', // 하위부서여부 사용
        targetDeptSubYn: 'Y', // 하위부서여부 사용
        execDeptSubYn: 'Y', // 하위부서여부 사용
        mainDeptCd: null,
        targetDeptCd: null,
        execDeptCd: null,
      },
      gridOptions: {
        name: 'planEducation',
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
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: true,
      eduAttCdSearchItems: [],
      eduCourseSearchItems: [],
      eduTypeCdSearchItems: [],
      eduClassCdSearchItems: [],
      procStepItems: [],
      stateItems: [],
      isTypeItems: [],
      searchUrl: '',
      minDt: '',
      maxDt: '',
      companyEditable: false, // 전사 권한
      plantEditable: false, // 사업장 권한
      deptEditable: false, // 일반 권한
    };
  },
  computed: {},
  watch: {
    'searchParam.eduAttCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },
    'searchParam.eduClassCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },
    'searchParam.processStepNm': function (newValue, oldValue) {
      this.getEduCourseItems();
    },

    // 'searchParam.year': function (newVal, oldVal) {
    //   if (this.searchParam.year) {
    //     this.minDt = this.searchParam.year + '-01-01';
    //     this.maxDt = this.searchParam.year + '-12-31';
    //     this.searchParam.duration = [this.minDt, this.maxDt];
    //   }
    // },
  },

  /** Vue lifecycle: created, mounted, destroyed, etc **/
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
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam.mainDeptSubYn = 'Y';
      this.searchParam.targetDeptSubYn = 'Y';
      this.searchParam.execDeptSubYn = 'Y';

      // 권한에 따른 대상, 수행부서 초기화
      this.searchParam.targetDeptCd = null;
      this.searchParam.execDeptCd = null;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      // let from = this.$comm.moment().format('YYYY-01-01');
      // let to = this.$comm.moment().format('YYYY-MM-DD');
      // this.searchParam.duration = [from, to];

      var from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '0m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '3m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );

      this.searchParam.duration = [from, to];

      // 년도 설정
      this.searchParam.year = this.$comm.moment().format('YYYY');

      // 교육 대분류
      this.$comm.getComboItems('SAF_EDU_ATT', true).then((_result) => {
        this.eduAttCdSearchItems = _result;
      });

      // 교육 구분
      this.$comm.getComboItems('SAF_EDU_TYPE', true).then((_result) => {
        this.eduTypeCdSearchItems = _result;
      });

      // 교육 과정
      this.$comm.getComboItems('SAF_EDU_COURSE', true).then((_result) => {
        this.eduClassCdSearchItems = _result;
      });

      // 단계 (결과/계획)
      this.$comm.getComboItems('COM_STEP', true).then((_result) => {
        this.procStepItems = _result;
      });

      // 상태 (미작성/작성중/결재중/결재완료)
      this.$comm.getComboItems('COM_STATE', true).then((_result) => {
        this.stateItems = _result.filter((v) => v.code !== 'STATE1');
      });

      // 관련법규 ()
      this.$comm.getComboItems('MGT_LAW_CLASS', true).then((_result) => {
        this.isTypeItems = _result;
      });

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
          headerText: this.$comm.getLangSpecInfoLabel('L0000000633'),
          dataField: 'eduNm',
          width: '15%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'),
          dataField: 'pstateNm',
          width: '7%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000644'),
          dataField: 'eduAttNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000659'),
          dataField: 'eduClassNm',
          width: '5%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000653'),
          dataField: 'eduCourseNm',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000639'),
          dataField: 'eduTypeNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000641'),
          dataField: 'eduYmd',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000155'),
          dataField: 'qrCode',
          width: '7%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000672'),
          dataField: 'eduPlace',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'),
          dataField: 'mainDeptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'),
          dataField: 'targetDeptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005120'),
          dataField: 'execDeptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000568'),
          dataField: 'isTypeNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000892'),
          dataField: 'userNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000934'),
          dataField: 'totalUserNum',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002213'),
          dataField: 'passUserNum',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001354'),
          dataField: 'failUserNum',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002622'),
          dataField: 'exceptUserNum',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002215'),
          dataField: 'passOutUserNum',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002216'),
          dataField: 'totPassUserNum',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001806'),
          dataField: 'eduTime',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002468'),
          dataField: 'reEduPerson',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002466'),
          dataField: 'reEduAbsentPerson',
          width: '10%',
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
          btnClicked: 'btnPopupClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
      this.searchUrl = selectConfig.saf.education.eduStatus.list.url;

      this.getEduCourseItems();

      this.getList();
    },
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
                  v.mainDeptCd === this.$store.getters.deptCd ||
                  v.pstepCd === 'BAPSG'
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
    getEduCourseItems() {
      this.$http.url = selectConfig.saf.education.eduCourse.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        eduAttCd: this.searchParam.eduAttCd,
        eduTypeCd: this.searchParam.eduClassCd,
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.eduCourseSearchItems = this.$_.clone(_result.data);
          this.eduCourseSearchItems.splice(0, 0, {
            safEduCourseNo: 0,
            eduCourseNm:
              this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
          });
          if (
            this.searchParam.safEduCourseNo &&
            this.$_.indexOf(
              this.$_.map(this.eduCourseSearchItems, 'safEduCourseNo'),
              this.searchParam.safEduCourseNo
            ) === -1
          ) {
            this.searchParam.safEduCourseNo = 0;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./eduPlan.vue'}`);
      this.popupOptions.title = 'L0000000629'; /* 교육계획 등록/수정 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safEduMstNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    cellClickHandler(event) {
      if (event.dataField === 'qrCode') {
        this.popupOptions.target = () => import(`${'./eduResultQrcode.vue'}`);
        this.popupOptions.title = 'L0000003648'; /* 교육결과 QR코드 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '100%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = event.item;
        this.popupOptions.closeCallback = this.closePopup;
      } else if (event.dataField === 'pstateNm') {
        // 결재 상태 팝업
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'eduNm') {
        // 상세페이지(수정모드) 팝업
        this.popupOptions.target = () => import(`${'./eduPlan.vue'}`);
        this.popupOptions.title = 'L0000000629'; /* 교육계획 등록/수정 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = event.item;
        this.popupOptions.closeCallback = this.closePopup;
      } else if (
        // 대상 명단 팝업
        event.dataField === 'totalUserNum' ||
        event.dataField === 'passUserNum' ||
        event.dataField === 'failUserNum' ||
        event.dataField === 'exceptUserNum'
      ) {
        this.popupOptions.target = () => import(`${'./eduUserListPopup.vue'}`);
        if (event.dataField === 'totalUserNum') {
          this.popupOptions.title = 'L0000000934'; // 대상인원
        } else if (event.dataField === 'passUserNum') {
          this.popupOptions.title = 'L0000002213'; // 이수인원
          event.item.completCheckYn = 'Y';
        } else if (event.dataField === 'failUserNum') {
          this.popupOptions.title = 'L0000001354'; // 불참인원
          event.item.completCheckYn = 'N';
        } else if (event.dataField === 'exceptUserNum') {
          this.popupOptions.title = 'L0000002622'; // 제외인원
          event.item.notReEduYn = 'Y';
          event.item.completCheckYn = 'N';
        }
        this.popupOptions.visible = true;
        this.popupOptions.width = '100%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = event.item;
        this.popupOptions.closeCallback = this.closePopup;
      } else if (event.dataField === 'passOutUserNum') {
        // 이수인원(외부) 팝업
        this.popupOptions.target = () =>
          import(`${'./eduOutUserListPopup.vue'}`);
        this.popupOptions.title = 'L0000002215'; /* 이수인원(외부) */
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = event.item;
        this.popupOptions.closeCallback = this.closePopup;
      } else if (event.dataField === 'totPassUserNum') {
        this.popupOptions.target = () => import(`${'./eduComYListPopup.vue'}`);
        this.popupOptions.title = 'L0000002216'; /* 이수인원(외부) */
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = event.item;
        this.popupOptions.closeCallback = this.closePopup;
        event.item.completCheckYn = 'Y';
      }
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.rapprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    // 하위부서 포함 조회 관련 함수 추가
    setMainDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.mainDeptSubYn = _result;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setTargetDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.targetDeptSubYn = _result;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setExecDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.execDeptSubYn = _result;
    },
    resizeGrid() {
      let _height = window.innerHeight - 445;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
