<!--
  목적 : 위험성평가 > 작업 위험성평가 관리 > 중요위험등록부 현황
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
          <y-plant type="search" :width="8" v-model="searchParam.plantCd" />
        </b-col>

        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <b-row>
            <b-col sm="4" md="4" lg="4" xl="4">
              <!-- 평가팀 -->
              <y-label label="L0000004990" />
            </b-col>
            <b-col sm="8" md="8" lg="8" xl="8">
              <y-tag-structure
                :width="12"
                itemText="deptNm"
                itemValue="deptCd"
                newLabelText="L0000005773"
                :clearable="true"
                v-model="deptCdList"
                name="deptCdList"
                @customNewTag="searchDept"
              />
            </b-col>
          </b-row>
        </b-col>
        <!-- 분류 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="classificationItems"
            itemText="classificationNm"
            itemValue="classificationCd"
            ui="bootstrap"
            label="L0000001341"
            name="classificationCd"
            v-model="searchParam.classificationCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 평가기간 -->
          <y-datepicker
            :width="8"
            name="period"
            label="L0000003062"
            :range="true"
            :default="searchParam.period"
            v-model="searchParam.period"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 평가담당자 -->
          <y-text
            :width="8"
            :clearable="true"
            :disabled="true"
            ui="bootstrap"
            label="L0000004201"
            name="userNm"
            v-model="searchParam.userNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchUser' },
            ]"
            @searchUser="btnSearchUserClicked"
            @clear="clear('rqst')"
          />
        </b-col>
        <!-- 평가구분 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="rsaRegRegdemItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000003059"
            name="regRegdem"
            v-model="searchParam.regRegdem"
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
        <!-- 공정 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="processItems"
            itemText="processNm"
            itemValue="processCd"
            ui="bootstrap"
            label="L0000000515"
            name="processCd"
            v-model="searchParam.processCd"
          ></y-select>
        </b-col>

        <!-- 작업명 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002389"
            name="jobNm"
            v-model="searchParam.jobNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1"></div>
          <!-- 위험등록부 목록 -->
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :print="true"
            :use-paging="true"
            @tableLinkClicked="tableLinkAccidentTitleClicked"
            :cellClassName="tableCellClassName"
            label="L0000006067"
          >
          </y-data-table>
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
      period: [], // 평가기간
      assessNm: '',
      classificationCd: '',
      processCd: '', // 구분
      yearChk: '',
      riskType: '',
      stateCd: '', // 상태
      apprStatusCd: '', // 결재상태
      deptSubYn: 'Y', // 하위부서여부 사용
      deptCd: [],
      statusCd: null,
      regRegdem: '',
      userId: '',
      userNm: '',
      jobNm: '',
      reAssessYn: '',
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
    selectedValue: [],
    processItems: [], // 공정
    stateItems: [], // 상태
    statusItem: [{ code: null, codeNm: '계획' }], // 단계
    searchUrl: '',
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
    excelUrl: '',
    processUrl: '',
    insertUrl: '',
    classificationUrl: '',
    isInsert: false,
    Planmgmt: {
      assessPlanNo: 0,
    },
    deptCdList: [],
    classificationItems: [],
  }),
  watch: {
    'searchParam.plantCd': function (newValue, oldValue) {
      this.getProcessList();
    },
    deptCdList: function (newValue, oldValue) {
      this.getClassificationList();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
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
      this.getProcessList();
      // this.searchParam.period = this.$comm.moment().format('YYYY');
      this.classificationUrl =
        selectConfig.rsa.planmgmt.getClassificationListForDepts.url;
      this.excelUrl = selectConfig.rsa.planmgmt.getResultExcelDown.url;
      // Url Setting
      this.searchUrl = selectConfig.rsa.planmgmt.list6.url;
      this.insertUrl = transactionConfig.rsa.planmgmt.insertReEval.url;
      this.$comm.getComboItems('RSA_ASSESS_TYPE', true).then((_result) => {
        this.rsaAssessTypeItems = _result;
      });
      // 평가구분
      this.$comm.getComboItems('RSA_REG_REGDEM', true).then((_result) => {
        this.rsaRegRegdemItems = _result;
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

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 중요위험번호
        {
          text: 'L0000006043',
          name: 'refManagNo',
          width: '180px',
          align: 'center',
        },
        // 개선요청관리번호
        {
          text: 'L0000006057',
          name: 'managNo',
          width: '150px',
          align: 'center',
        },
        // 사업장
        {
          text: 'L0000001415',
          name: 'plantNm',
          width: '150px',
          align: 'center',
        },
        // 재평가완료여부
        {
          text: 'L0000006068',
          name: 'reAssessNm',
          width: '120px',
          align: 'center',
        },
        // 개선요청상태
        {
          text: 'L0000000271',
          name: 'rsltStepNm',
          width: '120px',
          align: 'center',
          url: true,
        },

        // 평가명
        {
          text: 'L0000003081',
          name: 'assessNm',
          width: '180px',
          align: 'center',
        },
        // 평가구분
        {
          text: 'L0000003059',
          name: 'regRegdemNm',
          width: '150px',
          align: 'center',
        },
        // 평가팀
        {
          text: 'L0000004990',
          name: 'deptNm',
          width: '120px',
          align: 'center',
        },
        // 분류
        {
          text: 'L0000001341',
          name: 'classificationNm',
          width: '120px',
          align: 'center',
        },
        // 관리번호
        {
          text: 'L0000000590',
          name: 'jobManageNo',
          width: '280px',
          align: 'center',
          url: true,
        },
        // 평가담당자
        {
          text: 'L0000004201',
          name: 'approvalUserNm',
          width: '100px',
          align: 'center',
        },

        // 평가일자
        {
          text: 'L0000003092',
          name: 'assessDate',
          width: '110px',
          align: 'center',
        },
        // 공정
        {
          text: 'L0000000515',
          name: 'processNm',
          width: '110px',
          align: 'center',
        },
        // 작업명
        {
          text: 'L0000002389',
          name: 'jobNm',
          width: '180px',
          align: 'center',
        },
        // 중요위험요인
        {
          text: 'L0000006058',
          name: 'causeEffect',
          width: '110px',
          align: 'center',
        },
        // 개선전 위험도
        {
          text: 'L0000000275',
          name: 'prevRisk',
          width: '110px',
          align: 'center',
        },
        // 개선결과
        {
          text: 'L0000006059',
          name: 'actResultContents',
          width: '110px',
          align: 'center',
        },
        // 완료일자
        {
          text: 'L0000002044',
          name: 'actConfirmYmd',
          width: '180px',
          align: 'center',
        },
        // 개선후위험도
        {
          text: 'L0000000286',
          name: 'afterRisk',
          width: '80px',
          align: 'center',
        },

        // 재평가일자
        {
          text: 'L0000006069',
          name: 'reAssessDate',
          width: '110px',
          align: 'center',
        },
      ];

      this.getList(); // 평가계획 목록 조회
    },
    /*  한화솔루션 SHE 고도화 프로젝트(쿠키 삭제) wukjin.j 220627 */
    removeCookie() {
      this.$comm.deleteSearchParamByCookie();
      this.$router.go();
    },
    getClassificationList() {
      if (this.classificationItems === null) {
        this.classificationItems = [];
      }
      this.searchParam.deptCd = this.$_.map(this.deptCdList, (dept) => {
        return dept.deptCd;
      });
      if (this.searchParam.deptCd) {
        // 평가팀 별 분류 조회
        this.$http.url = this.classificationUrl;

        this.$http.param = {
          deptCd: this.searchParam.deptCd,
        };

        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            if (_result.data) {
              this.classificationItems = _result.data;
              if (
                this.classificationItems &&
                this.classificationItems !== null
              ) {
                this.classificationItems.splice(0, 0, {
                  classificationCd: null,
                  classificationNm: '전체',
                }); // 선택하세요
              } else {
                this.classificationItems = [
                  {
                    classificationCd: null,
                    classificationNm: '전체',
                  },
                ];
              }
            } else {
              this.classificationItems = [
                {
                  classificationCd: null,
                  classificationNm: '전체',
                },
              ];
            }
            if (this.searchParam.deptCd.length === 0) {
              this.classificationItems = [
                {
                  classificationCd: null,
                  classificationNm: '전체',
                },
              ];
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        this.classificationItems = [
          {
            classificationCd: null,
            classificationNm: '전체',
          },
        ];
      }
    },
    clear(type) {
      this.searchParam.userId = null;
      this.searchParam.userNm = null;
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

    getProcessList() {
      this.$http.url = this.$format(
        selectConfig.manage.dept.getProcess.url,
        this.searchParam.plantCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.processItems = _result.data.processList;

            this.processItems.splice(0, 0, {
              processCd: null,
              processNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
            }); // 선택하세요
          } else {
            this.processItems = [
              {
                processCd: null,
                processNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
              },
            ];
          }

          this.updateMode = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectCheck() {
      return true;
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        multiple: false,
        defaultExpandAll: true,
        plantCd: this.searchParam.plantCd,
      };
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
    /**
     * showAccidentPopup 호출
     * 평가계획 목록에 평가명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    tableLinkAccidentTitleClicked(header, data) {
      if (header.name === 'rsltStepNm') {
        this.showApprProgressPopup(data);
      } else {
        this.openPopup(data);
      }
    },

    // 개선요청상태 조회
    showApprProgressPopup(data) {
      if (!data.rsltStepCd) {
        this.popupOptions.title = 'L0000000268'; /* 개선요청등록 */
        this.popupOptions.target = () =>
          import(`${'@/pages/impr/actionRequest.vue'}`);
        this.popupOptions.param = {
          safImprActNo: 0,
          refTableId: data.jsaNo,
          imprClassCd: 'ICL11',
          taskClassNm: '',
          actClassYn: false,
          plantCd: data.plantCd,
        };
      } else {
        this.popupOptions.title = 'L0000000268'; /* 개선요청등록 */
        this.popupOptions.target = () =>
          import(`${'@/pages/impr/improveDetail.vue'}`);
        this.popupOptions.param = {
          safImprActNo: data.safImprActNo,
          refTableId: data.jsaNo,
          imprClassCd: 'ICL11',
        };
      }

      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./planmgmtResultDetail.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = '위험성평가 결과 상세'; // '평가계획 등록';
      this.popupOptions.param = data
        ? data
        : { assessRsltNo: 0, riskType: this.searchParam.riskType };
      this.popupOptions.closeCallback = this.closePopup;
    },
    /** 위험성 평가계획 수립 목록 검색 **/
    getList() {
      this.searchParam.yearChk =
        this.searchParam.yearChk === '' ? 'N' : this.searchParam.yearChk;

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
          // if (this.companyEditable) {
          //   // 전사권한 : 전체 건
          //   this.gridOptions.data = this.$_.clone(_result.data);
          // } else if (this.plantEditable) {
          //   // 사업장권한 : 내 사업장 등록 건
          //   this.gridOptions.data = this.$_.clone(
          //     _result.data.filter(
          //       (v) => v.plantCd === this.$store.getters.plantCd
          //     )
          //   );
          // } else if (this.deptEditable) {
          //   // 일반권한 : 내 부서 등록 건 + 타 부서 평가완료 건
          //   this.gridOptions.data = this.$_.clone(
          //     _result.data.filter(
          //       (v) =>
          //         v.deptCd === this.$store.getters.deptCd ||
          //           v.stepCd === 'BAPSG'
          //     )
          //   );
          // }

          this.$comm.pushCookie(this.searchParam);
          this.gridOptions.data = this.$_.clone(_result.data);
          // setTimeout(() => {
          //   $('.row-color').css('color', 'red');
          // }, 50);
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
