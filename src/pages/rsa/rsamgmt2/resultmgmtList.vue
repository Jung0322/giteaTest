<!--
  목적 : 위험성평가 > 작업 위험성평가 관리 > 결과 관리
  Detail : 위험성평가 결과 관리
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
              <!-- 검색 -->
              <y-btn
                title="L0000000327"
                color="green"
                @btnClicked="getList"
              />
            </div>
          </div>
        <b-row slot="search">
          <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
            <y-plant type="search" :width="8" v-model="searchParam.plantCd" />
          </b-col>
              <!-- 평가팀 -->
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
            <y-tree-dept 
              type="search"
              label="평가팀"
              name="deptCd"
              v-model="searchParam.deptCd"
            />
     
          </b-col>
            <!-- 분류 -->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
            <y-select
              :width="8"
              :comboItems="rsaAssessTypeItems"
              itemText="codeNm"
              itemValue="code"
              ui="bootstrap"
              label="분류"
              name="classificationCd"
              v-model="searchParam.classificationCd"
            ></y-select>
          </b-col>
          <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
            <!-- 평가년도 -->
            <y-datepicker
              :width="8"
              name="year"
              label="평가년도"
              type="year"
           
              :default="searchParam.year"
              v-model="searchParam.year"
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

          <!-- 정기/수시 -->
          <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
            <y-select
              :width="8"
              :comboItems="rsaRegRegdemItems"
              itemText="codeNm"
              itemValue="code"
              ui="bootstrap"
              label="정기/수시"
              name="regRegdem"
              v-model="searchParam.regRegdem"
            ></y-select>
          </b-col>
     
  
        
        </b-row>
      </y-search-box>
      <!-- 검색 결과 테이블 -->
      <b-row class="mt-3">
        <b-col sm="12">
          <b-col sm="12" class="px-0">
            <div slot="buttonGroup" class="float-right mb-1">
        
         
     
              <y-btn
                v-if="editable"
                :action-url="insertUrl"
                :param="Planmgmt"
                :is-submit="isInsert"
                title="재평가"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="reEval"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 검색 -->
              <!-- <y-btn title="L0000000327" color="green" @btnClicked="getList" /> -->
            </div>
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
              label="위험등록부 목록"
                  v-model="selectedValue"
            >
                    <el-table-column
                :selectable="selectCheck"
                type="selection"
                slot="selection"
                align="center"
                width="55"
              ></el-table-column>
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
      year: [], // 평가기간
      assessNm: '',
      classificationCd: '',
      processCd: '', // 구분
      yearChk: '',
      riskType: '',
      stateCd: '', // 상태
      apprStatusCd: '', // 결재상태
      deptSubYn: 'Y', // 하위부서여부 사용
      deptCd: '',
      statusCd: null,
      regRegdem: '',
      userId: '',
      userNm: '',
      jobNm: '',
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
    isInsert: false,
    Planmgmt: {
      assessPlanNo: 0
    }
  }),
  watch: {
    'searchParam.PlantCd': function (newValue, oldValue) {
      this.getProcessList();
    }
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
      this.searchParam.plantCd = this.$store.getters.plantCd
      this.getProcessList();
      // this.searchParam.year = this.$comm.moment().format('YYYY');
      this.excelUrl = selectConfig.rsa.planmgmt.getResultExcelDown.url;
      // Url Setting
      this.searchUrl = selectConfig.rsa.planmgmt.list5.url;
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
          text: '중요위험번호',
          name: 'jobManageNo',
          width: '100px',
          align: 'center',
        },
        // 개선요청관리번호
        {
          text: '개선요청관리번호',
          name: 'safImprActNo',
          width: '90px',
          align: 'center',
      
        },
        // 사업장
        {
          text: '사업장',
          name: 'plantNm',
          width: '80px',
          align: 'center',
 
        },
        // 개선요청상태
        {
          text: '개선요청상태',
          name: 'rsltStepNm',
          width: '180px',
          align: 'left',
          url: true,
        },
   
        // 평가명
        {
          text: '평가명',
          name: 'assessNm',
          width: '120px',
          align: 'center',
        },
        // 평가구분
        {
          text: '평가구분',
          name: 'regRegdemNm',
          width: '80px',
          align: 'center',
        },
        // 평가팀
        {
          text: '평가팀',
          name: 'deptNm',
          width: '80px',
          align: 'center',
        },
        // 분류
        {
          text: '분류',
          name: 'classificationNm',
          width: '80px',
          align: 'center',
        },
        // 관리번호
        {
          text: '관리번호',
          name: 'jobManageNo',
          width: '80px',
          align: 'center',
          url: true,
        },
        // 평가담당자
        {
          text: '평가담당자',
          name: 'userNm',
          width: '80px',
          align: 'center',
        },

        // 평가일자
        {
          text: '평가일자',
          name: 'assessDate',
          width: '110px',
          align: 'center',
         
        },
        // 공정
        {
          text: '공정',
          name: 'processNm',
          width: '110px',
          align: 'center',
         
        },
        // 작업명
        {
          text: '작업명',
          name: 'jobNm',
          width: '110px',
          align: 'center',
         
        },
        // 중요위험요인
        {
          text: '중요위험요인',
          name: 'causeEffect',
          width: '110px',
          align: 'center',
         
        },
        // 개선전 위험도
        {
          text: '개선전 위험도',
          name: 'prevRisk',
          width: '110px',
          align: 'center',
         
        },
     
     
         
      ];

      this.getList(); // 평가계획 목록 조회
    },

    reEval() {
      let evalFlag = false
      let imprFlag = false
      // item 내부의 assessRsltNo가 서로 다른 두 개의 번호가 존재할 때
      let assessRsltNos = new Set();
      if (!this.selectedValue || this.selectedValue === null || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          // 작업기간을 입력하세요.
          message: '재평가할 행을 선택하세요',
          type: 'warning', // success / info / warning / error
        });
        return;
      } else if (this.selectedValue.length > 0) {
        // item 내부의 assessRsltNo 가 서로 다른 두개의 번호가 존재할때
        this.$_.forEach(this.selectedValue, (item) => {
    
          if (assessRsltNos.has(item.assessRsltNo)) {
            // 중복된 번호 존재
            evalFlag = true
            return false
          } else {
            assessRsltNos.add(item.assessRsltNo);
          }

          if (evalFlag === true) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              // 작업기간을 입력하세요.
              message: '서로 다른 평가명이 존재합니다. 동일한 평가명만 재평가 가능합니다. 평가명을 확인해주세요.',
              type: 'warning', // success / info / warning / error
            });
          } else {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '재평가를 진행하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.Planmgmt.assessPlanNo = this.selectedValue[0].assessPlanNo
                console.log('this.Planmgmt.assessPlanNo: ', this.Planmgmt.assessPlanNo)
                this.isInsert = true;
              },
            });
          }
        })
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

    btnInsertClickedCallback(result) {
     
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: '재평가를 등록하였습니다. 결과 등록 화면에서 확인 가능합니다.',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.getList();
    
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
    // 개선요청상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.title = 'L0000000268'; /* 개선요청등록 */
      this.popupOptions.target = () =>
          import(`${'../../impr/actionRequest.vue'}`);

      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./planmgmtResultDetail.vue'}`);
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
      this.$http.param = this.searchParam;
     
      this.$http.request(
        (_result) => {
          if (this.companyEditable) {
            // 전사권한 : 전체 건
            this.gridOptions.data = this.$_.clone(_result.data);
          } else if (this.plantEditable) {
            // 사업장권한 : 내 사업장 등록 건
            this.gridOptions.data = this.$_.clone(
              _result.data.filter(
                (v) => v.plantCd === this.$store.getters.plantCd
              )
            );
          } else if (this.deptEditable) {
            // 일반권한 : 내 부서 등록 건 + 타 부서 평가완료 건
            this.gridOptions.data = this.$_.clone(
              _result.data.filter(
                (v) =>
                  v.deptCd === this.$store.getters.deptCd ||
                    v.stepCd === 'BAPSG'
              )
            );
          }
  
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
  