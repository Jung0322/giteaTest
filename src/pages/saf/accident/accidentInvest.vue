<!--
  목적 : 등록/접수/조치결과 - 사내사고조사
  Detail : 사내사고조사
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 사고조사대상 -->
            <!-- 해당 -->
            <!-- 해당없음 -->
            <y-switch
              :width="8"
              :required="true"
              :disabled="disabled"
              :editable="editable"
              true-value="Y"
              false-value="N"
              ui="bootstrap"
              label="L0000001405"
              name="investYn"
              selectText="L0000003213"
              unselectText="L0000001065"
              v-model="accidentDetail.investYn"
              v-validate="'required'"
              :state="validateState('investYn')"
            ></y-switch>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 조사기간 -->
            <y-datepicker
              :width="8"
              :required="true"
              :range="true"
              :disabled="disabledInvest"
              :editable="editable"
              label="L0000002646"
              name="period"
              v-model="accidentDetail.accidentInvest.period"
              v-validate="'required'"
              :state="validateState('period')"
            ></y-datepicker>
          </b-col>
          <b-col sm="0" md="0" lg="0" xl="0" class="col-xxl-3"></b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <b-row>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 리더 -->
                <y-text
                  :width="6"
                  :disabled="true"
                  :required="true"
                  :editable="editable"
                  ui="bootstrap"
                  label="L0000000999"
                  name="leaderUserId"
                  v-model="accidentDetail.accidentInvest.leaderUserId"
                  :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                  @searchUser="btnSearchLeaderUserClicked"
                ></y-text>
              </b-col>
              <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2 px-1">
                <!-- 성명 -->
                <y-text
                  :width="12"
                  :disabled="true"
                  :editable="editable"
                  ui="bootstrap"
                  name="leaderUserNm"
                  v-model="accidentDetail.accidentInvest.leaderUserNm"
                ></y-text>
              </b-col>
              <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2 px-1">
                <!-- 소속부서명 -->
                <y-text
                  :width="12"
                  :disabled="true"
                  :editable="editable"
                  ui="bootstrap"
                  name="leaderDeptNm"
                  v-model="accidentDetail.accidentInvest.leaderDeptNm"
                ></y-text>
              </b-col>
              <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2 px-1">
                <!-- 조사팀리더선정일 -->
                <y-datepicker
                  :width="12"
                  :disabled="disabledInvest"
                  :editable="editable"
                  name="leaderSelYmd"
                  :default="accidentDetail.accidentInvest.leaderSelYmd"
                  v-model="accidentDetail.accidentInvest.leaderSelYmd"
                ></y-datepicker>
              </b-col>
              <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2 px-1">
                <y-btn
                  v-if="!disabledInvest && editable"
                  title="초기화"
                  @btnClicked="btnSearchLeaderClearClicked"
                />
              </b-col>
            </b-row>
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <b-row>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 사번 -->
                <y-text
                  :width="6"
                  :disabled="true"
                  :editable="editable"
                  ui="bootstrap"
                  label="Facilitator"
                  name="faciUserId"
                  v-model="accidentDetail.accidentInvest.faciUserId"
                  :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                  @searchUser="btnSearchFacilitatorUserClicked"
                ></y-text>
              </b-col>
              <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2 px-1">
                <!-- 성명 -->
                <y-text
                  :width="12"
                  :disabled="true"
                  :editable="editable"
                  ui="bootstrap"
                  name="faciUserNm"
                  v-model="accidentDetail.accidentInvest.faciUserNm"
                ></y-text>
              </b-col>
              <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2 px-1">
                <!-- 소속부서명 -->
                <y-text
                  :width="12"
                  :disabled="true"
                  :editable="editable"
                  ui="bootstrap"
                  name="faciDeptNm"
                  v-model="accidentDetail.accidentInvest.faciDeptNm"
                ></y-text>
              </b-col>
              <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2 px-1">
                <!-- 초기화 -->
                <y-btn
                  v-if="!disabledInvest && editable"
                  title="L0000002859"
                  @btnClicked="btnSearchClearClicked"
                />
              </b-col>
            </b-row>
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <!-- 조사계획 -->
            <y-textarea
              :width="10"
              :maxlength="600"
              :required="true"
              :disabled="disabledInvest"
              :editable="editable"
              ui="bootstrap"
              label="L0000002644"
              name="investPlan"
              v-model="accidentDetail.accidentInvest.investPlan"
              v-validate="'required'"
              :state="validateState('investPlan')"
            />
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <!-- 조사방법 -->
            <y-textarea
              :width="10"
              :maxlength="1000"
              :disabled="disabledInvest"
              :editable="editable"
              ui="bootstrap"
              label="L0000002653"
              name="investMethod"
              v-model="accidentDetail.accidentInvest.investMethod"
            />
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
            <!-- 조사인원 테이블 -->
            <b-row>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 조사인원 목록 -->
                <y-auigrid
                  ref="yAuiGrid"
                  :headers="gridOptions.header"
                  :btns="gridOptions.btns"
                  :label="this.$comm.getLangSpecInfoLabel('L0000002659')"
                  :useExcelExport="false"
                  :showRowCheckColumn="true"
                  @cellClick="cellClickHandler"
                  @btnAdd="btnAdd"
                  @btnDelete="btnDelete"
                  @btnClickedError="btnClickedErrorCallback"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-accident-invest',
  props: {
    disabled: false,
    accidentDetail: {
      type: Object,
      default: {
        safAccidentNo: 0,
        investYn: 'Y', // 사고조사대상 여부
        accidentStepCd: '',
        accidentInvestPsns: [], // 조사인원 데이터
        accidentInvest: {
          leaderUserId: '', // 리더 사번
          leaderUserNm: '', // 리더 성명
          leaderDeptCd: '', // 리더 소속부서코드
          leaderDeptNm: '', // 리더 소속부서명
          leaderOfficeTel: '', // 리더 사무실전화번호
          leaderSelYmd: '', // 리더 선정일

          faciUserId: '', // 사고조사 Facilitator 사번
          faciUserNm: '', // 사고조사 Facilitator 성명
          faciDeptCd: '', // 사고조사 Facilitator 부서코드
          faciDeptNm: '', // 사고조사 Facilitator 부서명

          investPlan: '', // 조사계획
          investStartYmd: '', // 조사기간시작일
          investEndYmd: '', // 조사기간종료일
          period: [],
          investMethod: '', // 조사방법
        },
      },
    },
  },
  data: () => ({
    YAuiGrid: null,
    gridOptions: {
      // 조사인원
      header: [],
      data: [],
      height: '320',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '60%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    disabledInvest: false,
    searchInvestUrl: '', // 사내사고조사 검색 url
    searchInvestPsnUrl: '', // 사내사고조사인원 검색 url
    selectedValue: [],
    editable: true,
    isFirst: true,
  }),
  watch: {
    'accidentDetail.investYn': {
      handler: function (val, oldVal) {
        if (this.isFirst) {
          this.setDisabled();
          this.isFirst = false;
          return;
        }
        // 조사계획이 해당없는 경우 조사정보들을 리셋한다.
        if (this.accidentDetail.investYn === 'N') {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321', // 확인
            message: 'M0000000683', // 조사정보가 초기화 됩니다.\n변경하시겠습니까?
            // TODO : 필요시 추가하세요.
            type: 'info', // success / info / warning / error
            // 확인 callback 함수
            confirmCallback: () => {
              this.setDisabled();
              this.accidentDetail.accidentInvestPsns = []; // 조사인원 데이터
              this.gridOptions.data = [];
              this.accidentDetail.accidentInvest = {
                leaderUserId: '', // 리더 사번
                leaderUserNm: '', // 리더 성명
                leaderDeptCd: '', // 리더 소속부서코드
                leaderDeptNm: '', // 리더 소속부서명
                leaderOfficeTel: '', // 리더 사무실전화번호
                leaderSelYmd: '', // 리더 선정일

                faciUserId: '', // 사고조사 Facilitator 사번
                faciUserNm: '', // 사고조사 Facilitator 성명
                faciDeptCd: '', // 사고조사 Facilitator 부서코드
                faciDeptNm: '', // 사고조사 Facilitator 부서명

                investPlan: '', // 조사계획
                investStartYmd: '', // 조사기간시작일
                investEndYmd: '', // 조사기간종료일
                period: [],
                investMethod: '', // 조사방법
              };
              this.$forceUpdate();
            },
            // 취소 callback 함수
            cancelCallback: () => {
              this.accidentDetail.investYn = oldVal;
              this.setDisabled();
            },
          });
        } else {
          this.setDisabled();
        }
      },
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.accidentDetail.accidentInvestPsns = this.gridOptions.data;
        if ((this.YAuiGrid || null) !== null) {
          this.YAuiGrid.setGridData(this.gridOptions.data);
        }
      },
      deep: true,
    },
    'accidentDetail.accidentInvest.investStartYmd': {
      handler: function (val, oldVal) {
        this.setPeriod();
      },
    },
    'accidentDetail.accidentInvest.investEndYmd': {
      handler: function (val, oldVal) {
        this.setPeriod();
      },
    },
    'accidentDetail.safAccidentNo': {
      handler: function (val, oldVal) {
        this.getInvestPsnList(); // 사내사고조사인원
      },
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;

    this.getInvestPsnList(); // 사내사고조사인원
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.setDisabled();
      this.setPeriod();
      // Url Setting
      this.searchInvestPsnUrl = selectConfig.saf.accidentInvestPsn.list.url; // 사내사고조사인원 검색 url
      // 조사인원 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001412'),
          dataField: 'userId',
          style: 'left-align',
          width: '18%',
        }, // 사번
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'userNm',
          style: 'left-align',
          width: '19%',
        }, // 성명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002768'),
          dataField: 'dutyNm',
          style: 'left-align',
          width: '19%',
        }, // 직급
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002772'),
          dataField: 'positionNm',
          style: 'left-align',
          width: '19%',
        }, // 직책
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          style: 'left-align',
          width: '25%',
        }, // 부서
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnAdd',
          btnClickedError: 'btnClickedError',
          visible: !this.disabledInvest && this.editable,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelete',
          btnClickedError: 'btnClickedError',
          visible: !this.disabledInvest && this.editable,
        }, // 삭제
      ];
    },
    /** 사내사고조사인원 조회 **/
    getInvestPsnList() {
      if (
        !this.accidentDetail.safAccidentNo ||
        this.accidentDetail.safAccidentNo === 0
      ) {
        return;
      }
      this.$http.url = this.searchInvestPsnUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        safAccidentNo: this.accidentDetail.safAccidentNo,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      console.log('1111', data);
      if (data.users) {
        this.$_.forEach(data.users, (user) => {
          if (
            this.$_.indexOf(
              this.$_.map(this.YAuiGrid.getGridData(), 'userId'),
              user.userId
            ) > -1
          ) {
            return;
          }
          if (this.openUserFlag === 'GRID') {
            let row = {
              userId: user.userId,
              userNm: user.userNm,
              deptCd: user.deptCd,
              deptNm: user.deptNm,
              positionNm: user.positionNm,
              dutyNm: user.dutyNm,
              comSexTypeNm: user.comSexTypeNm,
            };
            this.YAuiGrid.addRow(row, 'last');
            this.accidentDetail.accidentInvestPsns =
              this.YAuiGrid.getGridData();
          } else if (this.openUserFlag === 'LEADER') {
            this.accidentDetail.accidentInvest.leaderUserId = user.userId;
            this.accidentDetail.accidentInvest.leaderUserNm = user.userNm;
            this.accidentDetail.accidentInvest.leaderDeptCd = user.deptCd;
            this.accidentDetail.accidentInvest.leaderDeptNm = user.deptNm;
          } else if (this.openUserFlag === 'FACILITATOR') {
            this.accidentDetail.accidentInvest.faciUserId = user.userId;
            this.accidentDetail.accidentInvest.faciUserNm = user.userNm;
            this.accidentDetail.accidentInvest.faciDeptCd = user.deptCd;
            this.accidentDetail.accidentInvest.faciDeptNm = user.deptNm;
          }
        });

        this.openUserFlag = '';
      }
    },
    openUserPopup() {
      if (this.disabledInvest || !this.editable) return;
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        multiple: true,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    cellClickHandler(event) {
      //
    },
    /** button 관련 이벤트 **/
    btnSearchFacilitatorUserClicked() {
      this.openUserFlag = 'FACILITATOR';
      this.openUserPopup();
    },
    btnSearchLeaderUserClicked() {
      this.openUserFlag = 'LEADER';
      this.openUserPopup();
    },
    btnSearchLeaderClearClicked() {
      setTimeout(() => {
        this.accidentDetail.accidentInvest.leaderUserId = '';
        this.accidentDetail.accidentInvest.leaderUserNm = '';
        this.accidentDetail.accidentInvest.leaderDeptCd = '';
        this.accidentDetail.accidentInvest.leaderDeptNm = '';
        this.accidentDetail.accidentInvest.leaderSelYmd = '';
      }, 100);
    },
    btnSearchClearClicked() {
      this.accidentDetail.accidentInvest.faciUserId = '';
      this.accidentDetail.accidentInvest.faciUserNm = '';
      this.accidentDetail.accidentInvest.faciDeptCd = '';
      this.accidentDetail.accidentInvest.faciDeptNm = '';
    },
    /**
     * 점검팀원 행 추가
     */
    btnAdd() {
      this.openUserFlag = 'GRID';
      this.openUserPopup();
    },
    /**
     * 점검팀원 행 삭제
     */
    btnDelete() {
      const selectedRowItems = this.YAuiGrid.getCheckedRowItemsAll();
      let gridData = this.$_.cloneDeep(this.gridOptions.data);
      if (selectedRowItems.length > 0) {
        this.$_.forEach(selectedRowItems, (item) => {
          gridData = this.$_.reject(gridData, { userId: item.userId });
        });
        this.gridOptions.data = gridData;
      }
    },
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    setDisabled() {
      this.disabledInvest =
        this.accidentDetail.investYn !== 'Y' || this.disabled;

      if ((this.YAuiGrid || null) !== null) {
        this.YAuiGrid.setNewBtnArr([
          {
            title: this.$comm.getLangSpecInfoLabel('L0000002892'),
            color: 'blue',
            btnClicked: 'btnAdd',
            btnClickedError: 'btnClickedError',
            visible: !this.disabledInvest && this.editable,
          }, // 추가
          {
            title: this.$comm.getLangSpecInfoLabel('L0000001495'),
            color: 'red',
            btnClicked: 'btnDelete',
            btnClickedError: 'btnClickedError',
            visible: !this.disabledInvest && this.editable,
          }, // 삭제
        ]);
      }
    },
    setPeriod() {
      if (
        this.accidentDetail.accidentInvest.investStartYmd &&
        this.accidentDetail.accidentInvest.investEndYmd
      ) {
        this.accidentDetail.accidentInvest.period = [
          this.accidentDetail.accidentInvest.investStartYmd,
          this.accidentDetail.accidentInvest.investEndYmd,
        ];
      }
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
