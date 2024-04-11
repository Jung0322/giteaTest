<!--
  목적 : 개인별교육현황
  작성자 : kkc
  Detail : 개인별교육현황 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            v-model="searchParam.plantCd"
            @datachange="
              val => {
                (searchParam.plantCd = val), getList();
                getEduCourseItems();
              }
            "
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 년도 -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000000829"
            name="year"
            default="searchParam.year"
            v-model="searchParam.year"
          ></y-datepicker>
        </b-col>
        <b-col v-if="searchAuth" sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 이수자 -->
          <y-text
            :width="8"
            :clearable="true"
            :readonly="true"
            ui="bootstrap"
            name="userNm"
            label="L0000002218"
            v-model="searchParam.userNm"
            :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
            @searchUser="btnSearchUserClicked"
            @input="clearUser"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 교육대분류 -->
          <y-select
            :width="8"
            :comboItems="eduAttCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000644"
            name="eduAttCd"
            v-model="searchParam.eduAttCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 교육분류 -->
          <y-select
            :width="8"
            :comboItems="eduClassCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000659"
            name="eduClassCd"
            v-model="searchParam.eduClassCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 교육과정 -->
          <y-select
            :width="8"
            :comboItems="eduCourseSearchItems"
            itemText="eduCourseNm"
            itemValue="safEduCourseNo"
            ui="bootstrap"
            type="edit"
            label="L0000000633"
            name="safEduCourseNo"
            v-model="searchParam.safEduCourseNo"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 담당부서 -->
          <y-tree-dept
            type="search"
            label="L0000000890"
            v-model="searchParam.deptCd"
            :plantCd="searchParam.plantCd"
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
          <!-- 기준충족여부 -->
          <y-select
            :width="8"
            :comboItems="completYnLists"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000793"
            name="completYn"
            v-model="searchParam.completYn"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 교육 결과 목록 grid -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1">
             <y-btn :title="searchArea.title" color="green" @btnClicked="btnSearchVisibleClicked" /> 
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
          - 개인별교육현황 목록 
          <y-data-table
            label="L0000000290"
            gridType="edit"
            :print="true"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000290')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @btnSearchClickedCallback="btnSearchClickedCallback"
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
  name: 'edu-person-status',
  props: {},
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '500px',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      searchArea: {
        title: 'L0000000329', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        year: '',
        eduAttCd: null,
        safEduCourseNo: 0,
        userId: '',
        userNm: '',
        deptCd: null,
        deptSubYn: 'Y', // 하위부서여부 사용
      },
      gridOptions: {
        name: 'eduPersonStatus',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      editable: true,
      eduAttCdSearchItems: [],
      eduClassCdSearchItems: [],
      eduCourseSearchItems: [],
      searchUrl: '',
      searchAuth: false,
      completYnLists: [],
    };
  },
  watch: {
    'searchParam.eduAttCd': function(newValue, oldValue) {
      this.getEduCourseItems();
    },
    'searchParam.eduClassCd': function(newValue, oldValue) {
      this.getEduCourseItems();
    },
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

    // window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.setGridSize);
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {

      this.searchParam.deptSubYn = 'Y';

      this.completYnLists = [
        { code: 'Y', codeNm: 'Y' },
        { code: 'N', codeNm: 'N' },
        { code: '-', codeNm: this.$comm.getLangSpecInfoLabel('L0000004317') }, // 해당없음 
      ]

      this.editable = this.$route.meta.editable;
      let userAuthGrps = this.$_.filter(this.$store.getters.userAuthGrps, {
        settingYn: 'Y',
      });
      if (userAuthGrps && userAuthGrps.length > 0) {
        this.$_.forEach(userAuthGrps, item => {
          if (
            String(item.authGrpNo) === '2' ||
            String(item.authGrpNo) === '1090'
          ) {
            this.searchAuth = true;
          }
        });
      }

      this.searchParam.year = this.$comm.getToday().substring(0, 4);

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), 
          dataField: 'deptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'), 
          dataField: 'userNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000644'), 
          dataField: 'eduAttNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000659'), 
          dataField: 'eduClassNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000633'), 
          dataField: 'eduCourseNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001213'), 
          dataField: 'lawEduTm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002211'), 
          dataField: 'dftEduTm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000793'), 
          dataField: 'completYn', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001991'), 
          dataField: 'year', 
          width: '10%', 
        },
        // 1월 ~ 12월
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000042'), 
          dataField: 'month1Num', 
          width: '5%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000043'), 
          dataField: 'month2Num', 
          width: '5%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000044'), 
          dataField: 'month3Num', 
          width: '5%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000045'), 
          dataField: 'month4Num', 
          width: '5%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000046'), 
          dataField: 'month5Num', 
          width: '5%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000047'), 
          dataField: 'month6Num', 
          width: '5%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000048'), 
          dataField: 'month7Num', 
          width: '5%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000049'), 
          dataField: 'month8Num', 
          width: '5%',           

        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000050'), 
          dataField: 'month9Num', 
          width: '5%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000051'), 
          dataField: 'month10Num', 
          width: '5%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000052'), 
          dataField: 'month11Num', 
          width: '5%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000053'), 
          dataField: 'month12Num', 
          width: '5%',         
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ]
      this.searchUrl = selectConfig.saf.education.eduDeptStatus.list.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getEduClassCdItems();
      this.getEduAttCdItems();
      this.getEduCourseItems();
      this.getList();
      // this.setGridSize();
      this.completYnLists.splice(0, 0, {
        code: null,
        codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') /* '전체' */,
      });
    },
    resizeGrid() {
      let _height = window.innerHeight - 415;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    getList() {
      if (!this.searchAuth) {
        this.searchParam.userId = this.$store.getters.token;
        this.searchParam.userNm = this.$store.getters.name;
      }

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    getEduAttCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_ATT'
      );
      this.$http.type = 'get';
      this.$http.request(
        _result => {
          this.eduAttCdSearchItems = this.$_.clone(_result.data);
          this.eduAttCdSearchItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') /* '전체' */,
          });
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    getEduClassCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_COURSE'
      );
      this.$http.type = 'get';
      this.$http.request(
        _result => {
          this.eduClassCdSearchItems = this.$_.clone(_result.data);
          this.eduClassCdSearchItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') /* '전체' */,
          });
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    getEduCourseItems() {
      this.$http.url = selectConfig.saf.education.eduCourse.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        eduAttCd: this.searchParam.eduAttCd,
        plantCd: this.searchParam.plantCd,
        eduTypeCd: this.searchParam.eduClassCd,
      };
      this.$http.request(
        _result => {
          this.eduCourseSearchItems = this.$_.clone(_result.data);
          this.eduCourseSearchItems.splice(0, 0, {
            safEduCourseNo: 0,
            eduCourseNm: this.$comm.getLangSpecInfoLabel(
              'L0000002519'
            ) /* '전체' */,
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
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },

    btnSearchClickedCallback(_result) {
      this.getList();
      // if (!this.searchParam.userId) {
      //   window.getApp.$emit('ALERT', {
      //     title: '안내',
      //     message: '이수자를 선택해 주세요.',
      //     type: 'warning', // success / info / warning / error
      //   });
      // } else {

      // }
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
      );
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001459'; /* 사용자검색 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.searchParam.userId = data.user.userId;
        this.searchParam.userNm = data.user.userNm;
      }
    },
    clearUser(userNm) {
      this.searchParam.userId = !userNm ? '' : this.searchParam.userId;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
  },
};
</script>
