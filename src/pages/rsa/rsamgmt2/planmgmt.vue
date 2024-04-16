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
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" :width="8" v-model="searchParam.plantCd" />
        </b-col>
        <!-- 평가팀 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <b-row>
            <b-col sm="4" md="4" lg="4" xl="4">
              <y-label label="L0000004990" />
            </b-col>
            <b-col sm="8" md="8" lg="8" xl="8">
              <!-- 부서 선택 -->
              <y-tag-structure
                :width="12"
                itemText="deptNm"
                itemValue="deptCd"
                newLabelText="부서 추가"
                :clearable="true"
                v-model="searchParam.deptCdList"
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
            itemText="codeNm"
            itemValue="code"
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
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 평가담당자 -->
          <y-text
            :width="8"
            :clearable="true"
            :disabled="true"
            ui="bootstrap"
            label="L0000004201"
            name="assessLeaderNm"
            v-model="searchParam.assessLeaderNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchUser' },
            ]"
            @searchUser="btnSearchUserClicked"
            @clear="clear('rqst')"
          />
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
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3"> </b-col>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003053')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="true"
          @openPopup="openPopup"
          @getList="getList"
          @btnDownload="btnDownload"
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
      period: [], // 대상년도
      assessNm: '',
      classificationCd: '',
      regRegdem: '', // 구분
      yearChk: '',
      riskType: '',
      stateCd: '', // 상태
      apprStatusCd: '', // 결재상태
      deptSubYn: 'Y', // 하위부서여부 사용
      deptCdList: [],
      deptCd: [],
      statusCd: null,
      assessLeaderId: '',
      assessLeaderNm: '',
    },
    gridOptions: {
      header: [],
      data: [],
      btns: [],
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
    classificationItems: [], // 분류
    selectedValue: [],
    stateItems: [], // 상태
    statusItem: [{ code: null, codeNm: '계획' }], // 단계
    searchUrl: '',
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
    excelUrl: '',
    classificationUrl: '',
    rsltNosUrl: '',
    tempAssessRsltNo: [],
    YAuiGrid: null,
  }),
  watch: {},
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
      // this.searchParam.period = this.$comm.moment().format('YYYY');
      this.excelUrl = selectConfig.rsa.planmgmt2.getPlanmgmtPrint.url;
      this.rsltNosUrl = selectConfig.rsa.planmgmt2.getRsltNos.url;
      this.classificationUrl =
        selectConfig.rsa.planmgmt2.getClassificationListForDepts.url;
      // Url Setting
      this.searchUrl = selectConfig.rsa.planmgmt2.list2.url;
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
      // 분류
      this.$comm.getComboItems('RSA_ASSESS_CLASS', true).then((_result) => {
        this.classificationItems = _result;
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
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'),
          dataField: 'assessNm',
          width: 250,
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: (rowIndex, columnIndex, value, item) => {
              this.openPopup(item);
            },
          },
        } /* 평가명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003059'),
          dataField: 'regRegemNm',
          width: 100,
        } /* 평가구분 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002777'),
          dataField: 'assessStepNm',
          width: 100,
        } /* 진행단계 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004990'),
          dataField: 'deptNm',
          width: 200,
        } /* 평가팀 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001341'),
          dataField: 'classificationNm',
          width: 50,
        } /* 분류 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003062'),
          dataField: 'period',
          width: 200,
        } /* 평가기간 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004201'),
          dataField: 'approvalUserNm',
          width: 200,
        } /* 평가담당자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'createDt',
          width: 200,
        } /* 작성일 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: 200,
        } /* 사업장 */,
      ];

      // 그리드 버튼 설정
      this.gridOptions.btns = [
        // 계획등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000470'),
          color: 'orange',
          btnClicked: 'openPopup',
        },
        // 출력
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004214'),
          color: 'black',
          btnClicked: 'btnDownload',
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
    clear(type) {
      this.searchParam.assessLeaderId = null;
      this.searchParam.assessLeaderNm = null;
    },
    /*  한화솔루션 SHE 고도화 프로젝트(쿠키 삭제) wukjin.j 220627 */
    removeCookie() {
      this.$comm.deleteSearchParamByCookie();
      this.$router.go();
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
            let index = this.$_.findIndex(this.searchParam.deptCdList, {
              deptCd: dept.deptCd,
            });
            if (index === -1) {
              this.searchParam.deptCdList.push({
                deptCd: dept.deptCd,
                deptNm: dept.deptNm,
              });
            }
          });
        } else if (data.dept) {
          let index = this.$_.findIndex(this.searchParam.deptCdList, {
            deptCd: data.dept.deptCd,
          });
          if (index === -1) {
            this.searchParam.deptCdList = [
              {
                deptCd: data.dept.deptCd,
                deptNm: data.dept.deptNm,
              },
            ];
          }
        }
      }
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
        this.searchParam.assessLeaderId = data.user.userId;
        this.searchParam.assessLeaderNm = data.user.userNm;
      }
    },
    /**
     * showAccidentPopup 호출
     * 평가계획 목록에 평가명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    cellClickHandler(header, data) {
      if (header.name === 'assessStepNm') {
        this.showApprProgressPopup(data);
      } else {
        this.openPopup(data);
      }
    },
    btnDownload() {
      let printFlag = false;
      let selectedValue = this.YAuiGrid.getCheckedRowItemsAll();

      try {
        if (!selectedValue || !selectedValue.length) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: '출력할 평가계획을 선택해주세요.', // 출력할 평가계획을 선택해주세요.
          });
          return;
        }
        this.$_.forEach(selectedValue, (item) => {
          if (item.assessStepCd !== 'STATE4') {
            printFlag = true;
          }
        });
        if (printFlag === true) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: '결재완료가 안된 계획이 존재합니다.', // 출력할 평가계획을 선택해주세요.
          });
          return false;
        }

        let assessPlanNos = this.$_.flatMap(selectedValue, (item) => {
          return item.assessPlanNo;
        });

        let thisVue = this;
        let _comm = this.$comm;
        this.$http.url = this.excelUrl; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
        this.$http.param = { assessPlanNos };

        this.$http.type = 'POST';
        this.$http.request((_result) => {
          let fileOrgNm = '위험성평가 계획_' + this.$comm.getToday() + '.xlsx';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          // let fileOrgNm = '한글.xlsx'
          let blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        });
      } catch (error) {
        this.pageAlert = {
          alertType: 'error',
          alertMsg: this.gm(
            'common.file.download.error.msg',
            '오류가 발생했습니다.'
          ),
        };
      }

      // this.$comm.exportFile(this.excelUrl, { assessRsltNos }, 'POST');
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
        apprRqstNo: data.apprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./planmgmtDetail.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000003052'; // '평가계획 등록';
      this.popupOptions.param = data
        ? data
        : { assessPlanNo: 0, riskType: this.searchParam.riskType };

      this.popupOptions.closeCallback = this.closePopup;
    },

    getRsltNos() {
      this.$http.url = this.rsltNosUrl;
      this.$http.type = 'GET';
      let assessPlanNos = this.$_.flatMap(this.selectedValue, (item) => {
        return item.assessPlanNo;
      });

      this.$http.param = { assessPlanNos };

      return new Promise((resolve, reject) => {
        this.$http.request(
          (_result) => {
            let assessRsltNos = this.$_.map(_result.data, (item) => {
              return item.assessRsltNo;
            });
            resolve(assessRsltNos);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            reject(_error);
          }
        );
      });
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
      this.searchParam.deptCd = this.$_.map(
        this.searchParam.deptCdList,
        (dept) => {
          return dept.deptCd;
        }
      );
      this.$http.param = this.searchParam;

      this.$http.request(
        (_result) => {
          this.$comm.pushCookie(this.searchParam);
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.gridOptions.data);
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
