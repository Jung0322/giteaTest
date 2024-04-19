<!--
  목적 : 위험성평가 > 작업 위험성평가 관리 > 평가계획 관리
  Detail : 평가계획 관리 등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <div slot="header">
        <y-label label="L0000000327" />
        <div class="float-right">
          <!--검색조건 초기화-->
          <y-btn title="L0000003402" color="gray" @btnClicked="removeCookie" />
          <!-- 검색 -->
          <y-btn title="L0000000327" color="green" @btnClicked="getList" />
        </div>
      </div>
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 사업장 -->
          <y-plant type="search" :width="8" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 대상년도 -->
          <y-datepicker
            :width="8"
            name="assessYear"
            label="L0000004449"
            type="year"
            :default="searchParam.assessYear"
            v-model="searchParam.assessYear"
          />
        </b-col>

        <!-- 평가기법 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="rsaAssessTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000003416"
            name="assessTypeCd"
            v-model="searchParam.assessTypeCd"
          ></y-select>
        </b-col>
        <!-- 구분 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="rsaRegRegdemItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000686"
            name="regRegdemCd"
            v-model="searchParam.regRegdemCd"
          ></y-select>
        </b-col>
        <!-- 평가명 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003081"
            name="assessNm"
            v-model="searchParam.assessNm"
          ></y-text>
        </b-col>

        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <b-row>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-2">
              <!-- 단계/상태 -->
              <y-label label="L0000005147" />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-2">
              <y-select
                :width="12"
                :comboItems="riskStepItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                :disabled="true"
                name="riskTypeCd"
                v-model="searchParam.riskTypeCd"
              ></y-select>
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-2 pl-0">
              <y-select
                :width="10"
                :comboItems="assessStepCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="stepCd"
                v-model="searchParam.stepCd"
              ></y-select>
            </b-col>
          </b-row>
        </b-col>

        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <b-row>
            <b-col sm="4" md="4" lg="4" xl="4">
              <!-- 주관팀 -->
              <y-label label="L0000002713" />
            </b-col>
            <b-col sm="8" md="8" lg="8" xl="8">
              <y-tag-structure
                :width="12"
                itemText="deptNm"
                itemValue="deptCd"
                newLabelText="부서 추가"
                :clearable="true"
                v-model="deptCdList"
                name="deptCdList"
                @customNewTag="searchDept"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- <div slot="buttonGroup" class="float-right mb-1"> -->
          <!-- 계획등록 -->
          <!-- <y-btn
              v-if="editable"
              title="L0000000470"
              color="orange"
              @btnClicked="openPopup"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            /> -->
          <!-- 검색 -->
          <!-- <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div> -->
          <!-- 평가계획 목록 -->
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
            @openPopup="openPopup"
            @getList="getList"
          />
        </b-col>
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
      assessYear: [], // 대상년도
      assessNm: '',
      assessTypeCd: '',
      regRegdemCd: '', // 구분
      yearChk: '',
      riskType: '',
      riskTypeCd: '',
      stateCd: '', // 상태
      apprStatusCd: '', // 결재상태
      deptSubYn: 'Y', // 하위부서여부 사용
      deptCd: '',
      statusCd: null,
      stepCd: '', // 단계, 상태
    },
    gridOptions: {
      header: [],
      data: [],
      height: 'auto',
    },
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
    rsaAssessTypeItems: [], // 기법
    rsaRegRegdemItems: [], // 구분

    stateItems: [], // 상태
    statusItem: [{ code: null, codeNm: '계획' }], // 단계
    searchUrl: '',
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
    excelUrl: '',
    assessStepCdItems: [], // 단계, 상태
    riskStepItems: [],
    deptCdList: [],
    YAuiGrid: null,
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
      if (column.property === 'overDateCnt' && row['overDateCnt'] !== '0') {
        return 'row-color';
      }
    },
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam.plantCd = this.$store.getters.plantCd;
      this.searchParam.assessYear = this.$comm.moment().format('YYYY');
      // this.excelUrl = selectConfig.saf.imprActStd.downLoad;
      // Url Setting
      this.searchUrl = selectConfig.rsa.planmgmt2.list.url;
      this.$comm.getComboItems('RSA_ASSESS_TYPE', true).then((_result) => {
        this.rsaAssessTypeItems = _result;
      });
      // 평가구분
      this.$comm.getComboItems('RSA_REG_REGDEM', true).then((_result) => {
        this.rsaRegRegdemItems = _result;
        this.$_.remove(this.rsaRegRegdemItems, (item) => {
          return item.code === 'REG03';
        });
      });
      // 단계, 상태
      this.$comm.getComboItems('COM_STATE', true).then((_result) => {
        this.assessStepCdItems = _result;
      });
      this.$comm.getComboItems('RSA_WORK_RISK_STEP', true).then((_result) => {
        this.riskStepItems = _result;
      });

      this.$comm.getComboItems('COM_STATE', true).then((_result) => {
        this.stateItems = _result.filter((v) => v.code !== 'STATE1');
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
        if (!this.searchParam.deptCd) {
          this.searchParam.deptCd = [];
        }
        if (!this.searchParam.deptCdList) {
          this.searchParam.deptCdList = [];
        }
      }

      if (this.$route.meta.param === 'W') {
        this.searchParam.riskType = 'work';
      } else {
        this.searchParam.riskType = 'proc';
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
        this.searchParam.deptCd = this.$store.getters.deptCd;
      }
      this.searchParam.riskTypeCd = 'RWRS1'; // 계획
      // 그리드 헤더 설정

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: 120,
        } /* 사업장 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003416'),
          dataField: 'assessTypeNm',
          width: 100,
        } /* 평가기법 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'),
          dataField: 'assessNm',
          width: 650,
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: (rowIndex, columnIndex, value, item) => {
              this.openPopup(item);
            },
          },
        } /* 평가명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'regRegdemNm',
          width: 100,
        } /* 구분 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'),
          dataField: 'mainDeptNm',
          width: 120,
        } /* 주관팀 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004449'),
          dataField: 'assessYear',
          width: 200,
        } /* 대상년도 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'),
          dataField: 'stateNm',
          width: 120,
        } /* 단계(상태) */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'createUserNm',
          width: 110,
        } /* 작성자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'createDt',
          width: 200,
        } /* 작성일 */,
      ];
      // 그리드 버튼 설정
      this.gridOptions.btns = [
        // 계획등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000470'),
          color: 'orange',
          btnClicked: 'openPopup',
        },

        // 검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];

      this.getList(); // 평가계획 목록 조회
    },
    resizeGrid() {
      let _height = window.innerHeight - 385;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    selectCheck() {
      return true;
    },
    searchDept() {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearch.vue'}`);
      this.popupOptions.title = this.$comm.getLangSpecInfoLabel('L0000004209');
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        multiple: true,
        defaultExpandAll: true,
        plantCd: this.searchParam.plantCd,
      };
      this.popupOptions.closeCallback = this.closeDeptPopup;
    },
    /*  한화솔루션 SHE 고도화 프로젝트(쿠키 삭제) wukjin.j 220627 */
    removeCookie() {
      this.$comm.deleteSearchParamByCookie();
      this.$router.go();
    },
    closeDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data && data.success) {
        if (data.depts) {
          this.$_.forEach(data.depts, (dept) => {
            let index = this.$_.findIndex(this.deptCdList, {
              deptCd: dept.deptCd,
            });
            if (index === -1) {
              this.deptCdList.push({
                deptCd: dept.deptCd,
                deptNm: dept.deptNm,
              });
            }
          });
        } else if (data.dept) {
          let index = this.$_.findIndex(this.deptCdList, {
            deptCd: data.dept.deptCd,
          });
          if (index === -1) {
            this.deptCdList = [
              {
                deptCd: data.dept.deptCd,
                deptNm: data.dept.deptNm,
              },
            ];
          }
        }
      }
    },
    /**
     * showAccidentPopup 호출
     * 평가계획 목록에 평가명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    tableLinkAccidentTitleClicked(header, data) {
      if (header.name === 'assessStepNm') {
        this.showApprProgressPopup(data);
      } else {
        this.openPopup(data);
      }

      // else if (
      //   header.name === 'deptCnt' ||
      //   header.name === 'deptNCnt' ||
      //   header.name === 'overDateCnt' ||
      //   header.name === 'deptYCnt'
      // ) {

      //   data.apprFlag = header.name;
      //   this.openDeptListPopup(data);
      // } else {
      //   this.openPopup(data);
      // }
    },

    openDeptListPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./planmgmtDeptListPopup.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000000928'; // '대상부서 목록';
      this.popupOptions.param = {
        assessPlanNo: data.assessPlanNo,
        apprFlag: data.apprFlag,
      };

      this.popupOptions.closeCallback = this.closePopup;
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
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./processPlanmgmtDetail.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000004976'; // '평가계획 관리 상세';
      this.popupOptions.param = data
        ? data
        : { assessPlanNo: 0, riskType: this.searchParam.riskType };
      this.popupOptions.closeCallback = this.closePopup;
    },
    /** 위험성 평가계획 수립 목록 검색 **/
    getList() {
      // this.searchParam.yearChk =
      //   this.searchParam.yearChk === '' ? 'N' : this.searchParam.yearChk;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      if (!this.searchParam.deptCd) {
        this.searchParam.deptCd = [];
      }
      if (!this.searchParam.deptCdList) {
        this.searchParam.deptCdList = [];
      }
      this.searchParam.deptCd = this.$_.map(this.deptCdList, (dept) => {
        return dept.deptCd;
      });
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);

          this.$comm.pushCookie(this.searchParam);
          setTimeout(() => {
            $('.row-color').css('color', 'red');
          }, 50);
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
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
<style>
.row-color .el-button {
  color: red !important;
}
</style>
