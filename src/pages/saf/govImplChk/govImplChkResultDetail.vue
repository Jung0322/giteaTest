<!--
  목적 : 점검>정부지자체 시정조치 이행점검 관리 관리>점검결과 관리>점검결과 상세 팝업
  Detail : 점검결과 상세 팝업화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <b-row>
            <b-col sm="12">
              <!-- 점검개요 -->
              <y-label
                label="L0000005276"
                icon="user-edit"
                color-class="cutstom-title-color"
              />
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 결재요청 -->
                <y-btn
                  v-if="apprBtn"
                  title="L0000003418"
                  color="black"
                  @btnClicked="btnAppr"
                />
                <!-- 임시저장 -->
                <y-btn
                  v-if="saveBtn"
                  title="L0000004986"
                  color="orange"
                  @btnClicked="btnSave"
                />
                <!-- 삭제 -->
                <y-btn
                  v-if="deleteBtn"
                  title="L0000001495"
                  color="red"
                  @btnClicked="btnDelete"
                />
                <!-- 닫기 -->
                <y-btn
                  v-if="!popupParam.apprFlag"
                  title="L0000000881"
                  @btnClicked="btnClosePopup"
                />
              </div>
            </b-col>
          </b-row>
          <b-card>
            <b-row>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 사업장 -->
                <y-plant
                  :width="9"
                  type="edit"
                  :editable="editable"
                  :disabled="disabled"
                  name="plantCd"
                  :required="true"
                  v-model="govImplChkPlan.plantCd"
                  v-validate="'required'"
                  :state="validateState('plantCd')"
                ></y-plant>
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 대상년도 -->
                <y-datepicker
                  :width="9"
                  :editable="editable"
                  :disabled="disabled"
                  label="L0000004449"
                  :required="true"
                  type="year"
                  name="year"
                  :default="govImplChkPlan.year"
                  v-model="govImplChkPlan.year"
                  v-validate="'required'"
                  :state="validateState('year')"
                ></y-datepicker>
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 구분 -->
                <y-select
                  :width="9"
                  :comboItems="regRegdemItems"
                  :editable="editable"
                  :disabled="disabled"
                  :required="true"
                  itemText="codeNm"
                  itemValue="code"
                  ui="bootstrap"
                  name="regRegdem"
                  label="L0000000686"
                  v-model="govImplChkPlan.regRegdem"
                  v-validate="'required'"
                  :state="validateState('regRegdem')"
                />
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 주관부서 -->
                <y-tree-dept
                  :width="9"
                  label="L0000002713"
                  :editable="editable && deptEditable"
                  :disabled="disabled"
                  :required="true"
                  name="mainDeptCd"
                  :plantCd="govImplChkPlan.plantCd"
                  v-model="govImplChkPlan.mainDeptCd"
                  v-validate="'required'"
                  :state="validateState('mainDeptCd')"
                />
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 대상부서 -->
                <!-- <y-tree-dept
                  :width="9"
                  :editable="editable"
                  :disabled="disabled"
                  :required="true"
                  :plantCd="govImplChkPlan.plantCd"
                  v-model="govImplChkPlan.targetDeptCd"
                  v-validate="'required'"
                  :state="validateState('targetDeptCd')"
                /> -->
                <y-text
                  :width="9"
                  :title="govImplChkPlan.targetDeptNm"
                  ui="bootstrap"
                  label="L0000000927"
                  :editable="editable"
                  :disabled="true"
                  :required="true"
                  name="targetDeptNm"
                  v-model="govImplChkPlan.targetDeptNm"
                  v-validate="'required'"
                  :state="validateState('targetDeptNm')"
                  :appendIcon="
                    editable && !disabled
                      ? [
                          { icon: 'search', callbackName: 'deptSearch' },
                          { icon: 'times', callbackName: 'clearDept' },
                        ]
                      : null
                  "
                  @deptSearch="deptSearch"
                  @clearDept="clearDept"
                />
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 점검기간 -->
                <y-datepicker
                  :width="9"
                  :editable="editable"
                  :disabled="disabled"
                  label="L0000002545"
                  :required="true"
                  :range="true"
                  name="chkPeriod"
                  :default="chkPeriod"
                  v-model="chkPeriod"
                  v-validate="'required'"
                  :state="validateState('chkPeriod')"
                ></y-datepicker>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                <!-- 점검명 -->
                <y-text
                  :width="10"
                  :maxlength="50"
                  ui="bootstrap"
                  :editable="editable"
                  :disabled="disabled"
                  :required="true"
                  label="L0000002551"
                  name="chkNm"
                  v-model="govImplChkPlan.chkNm"
                  v-validate="'required'"
                  :state="validateState('chkNm')"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                <!-- 관련 정부지자체 -->
                <y-text
                  :width="9"
                  ui="bootstrap"
                  :maxlength="50"
                  :editable="editable"
                  :disabled="disabled"
                  :required="true"
                  label="L0000005255"
                  name="refGovNm"
                  v-model="govImplChkPlan.refGovNm"
                  v-validate="'required'"
                  :state="validateState('refGovNm')"
                />
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 상세내용 -->
                <y-textarea
                  :width="11"
                  ui="bootstrap"
                  :editable="editable"
                  :disabled="disabled"
                  :required="true"
                  label="L0000001528"
                  name="chkDesc"
                  v-model="govImplChkPlan.chkDesc"
                  v-validate="'required'"
                  :maxlength="1000"
                  :state="validateState('chkDesc')"
                />
              </b-col>
            </b-row>
          </b-card>
          <b-row class="mt-2">
            <b-col sm="12">
              <!-- 점검결과 -->
              <y-label
                label="L0000002536"
                icon="user-edit"
                color-class="cutstom-title-color"
              />
            </b-col>
          </b-row>
          <b-row class="mt-2"></b-row>
          <el-tabs type="border-card" v-model="tabIndex">
            <el-tab-pane v-for="(item, i) in tabItems" :key="i">
              <span slot="label">{{
                $comm.getLangSpecInfoLabel(item.title)
              }}</span>
            </el-tab-pane>
            <keep-alive ref="test">
              <component
                :v-if="components"
                :is="components"
                :govImplChkPlan="govImplChkPlan"
                :tabParam="tabParam"
                :parentEditable="editable"
                :parentDisabled="disabled"
                :attachFileGrps="attachFileGrps"
                :refreshObject="refreshObject"
              ></component>
            </keep-alive>
          </el-tabs>
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
  /** attributes: name, components, props, data **/
  name: 'gov-impl-chk-result-detail',
  props: {
    popupParam: {
      default: {
        implChkPlanNo: 0, // 정부지자체 시정조치 이행점검번호
        apprFlag: false,
      },
    },
  },
  data() {
    return {
      editable: false, // 수정 가능 여부
      govImplChkPlan: {
        implChkPlanNo: 0, // 정부지자체 시정조치 이행점검번호
        plantCd: null, // 사업장
        year: null, // 대상년도
        regRegdem: null, // 구분(정기/수시) RSA_REG_REGDEM
        chkStartDt: null, // 점검(계획)시작일
        chkEndDt: null, // 점검(계획)종료일
        mainDeptCd: null, // 주관부서
        mainDeptNm: null, // 주관부서
        targetDeptCd: null, // 대상부서
        targetDeptNm: null, // 대상부서
        chkNm: null, // 점검명
        chkDesc: null, // 상세내용
        procStepCd: null, // 단계(COM_STEP)
        stateCd: null, // 상태(COM_STATE)
        stepCd: null, // 결재상태(COM_BIZ_APPR_STEP)
        apprRqstNo: 0, // 결재요청번호
        refGovNm: null, // 관련 정부지자체
        deptReaderId: null, // 평가리더ID
        deptReaderNm: null, // 평가리더
        deptReaderDeptCd: null, // 평가리더 부서코드
        deptReaderDeptNm: null, // 평가리더 부서
        createUserId: null, // 등록자ID
        createDt: null, // 등록일시
        updateUserId: null, // 수정자ID
        updateDt: null, // 수정일시
        createDeptNm: null, // 등록자부서명
        createDeptCd: null, // 등록자부서코드
        updateDeptNm: null, // 수정자부서명
        updateDeptCd: null, // 수정자부서코드
        createPositionNm: null, // 등록자직위명
        createPositionCd: null, // 등록자직위코드
        updatePositionNm: null, // 수정자직위명
        updatePositionCd: null, // 수정자직위코드
        govImplChkInRaters: [], // 내부 점검자 목록
        govImplChkExRaters: [], // 외부 점검자 목록
        govImplChkRslt: {
          implChkRsltNo: 0, // 정부지자체 시정조치 이행점검 결과번호
          implChkPlanNo: 0, // 정부지자체 시정조치 이행점검번호
          imprCaseCnt: 0, // 개선도출건수
          chkDt: null, // 점검 완료일
          rsltDesc: null, // 점검결과 요약
        },
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      regRegdemItems: [], // 구분 selectbox 목록
      disabled: false,
      tabItems: [
        { title: 'L0000005277', path: './govImplChkTeamTab' }, // 점검팀
        { title: 'L0000002536', path: './govImplChkResultTab' }, // 점검결과
        { title: 'L0000000259', path: 'imprActTab' }, // 개선사항
      ],
      components: null,
      tabIndex: '2',
      tabParam: {
        imprClassCd: 'ICL39',
        refTableId: 0,
        editable: false,
        message: 'L0000005292', // 개선사항은 상세정보 등록 후 입력 가능합니다.
        detailCheck: false,
        editMode: false,
      },
      chkPeriod: [], // 점검기간
      attachFileGrps: [], // 첨부파일 그룹 목록
      refreshObject: {
        refresh: false,
        taskKey: '',
      }, // 첨부파일 refresh 처리 flag
      minDt: '',
      maxDt: '',
      companyEditable: false, // 전사 권한
      plantEditable: false, // 사업장 권한
      deptEditable: false, // 일반 권한
    };
  },
  computed: {
    apprState() {
      // 상세팝업에서 결재중/결재완료 상태이거나 결재팝업에서 결재완료/반려일 경우
      return (
        (this.govImplChkPlan.stepCd === 'BAPSA' && !this.popupParam.apprFlag) ||
        this.govImplChkPlan.stepCd === 'BAPSG'
      );
    },
    apprBtn() {
      // 결재요청버튼 권한
      return (
        this.editable &&
        this.govImplChkPlan.implChkPlanNo &&
        !this.disabled &&
        !this.popupParam.apprFlag
      );
    },
    saveBtn() {
      // 저장버튼 권한
      return this.editable && !this.disabled;
    },
    deleteBtn() {
      // 삭제버튼 권한
      return (
        this.editable &&
        this.govImplChkPlan.implChkPlanNo &&
        !this.disabled &&
        !this.popupParam.apprFlag
      );
    },
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'govImplChkPlan.year': function (newVal, oldVal) {
      if (this.govImplChkPlan.year) {
        this.minDt = this.govImplChkPlan.year + '-01-01';
        this.maxDt = this.govImplChkPlan.year + '-12-31';
        this.chkPeriod = [this.minDt, this.maxDt];
      }
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.govImplChkPlan.year = this.$comm.getThisYear();
      this.chkPeriod = [this.$comm.getPrevDate('6m'), this.$comm.getToday()];

      // 구분 (정기/수시)
      this.$comm.getComboItems('RSA_REG_REGDEM', false).then((_result) => {
        this.regRegdemItems = _result;
      });

      if (this.popupParam.implChkPlanNo) {
        this.govImplChkPlan.implChkPlanNo = this.popupParam.implChkPlanNo;
        this.getDetail();
      } else {
        this.setAttachFileGrps();
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
      }
      this.tabIndex = '1'
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.saf.govImplChkResult.get.url,
        this.govImplChkPlan.implChkPlanNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.govImplChkPlan = this.$_.clone(_result.data);
            this.chkPeriod = [
              this.govImplChkPlan.chkStartDt,
              this.govImplChkPlan.chkEndDt,
            ];

            this.tabParam.refTableId = this.govImplChkPlan.implChkPlanNo;
            if (this.apprState) {
              this.disabled = true;
              this.tabParam.editable = false;
              this.tabParam.detailCheck = true;
              this.tabParam.editMode = true;
            } else {
              this.disabled = false;
              this.tabParam.editable = true;
              this.tabParam.detailCheck = false;
              this.tabParam.editMode = false;
            }

            this.setAttachFileGrps();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setAttachFileGrps() {
      let taskKey = this.govImplChkPlan.implChkPlanNo
        ? this.govImplChkPlan.implChkPlanNo.toString()
        : '';

      this.attachFileGrps = [
        {
          label: 'L0000002843', // '첨부파일',
          taskClassNm: 'GOV_IMPL_CHK_RESULT',
          taskKey: taskKey,
          editable: this.editable && !this.disabled,
          drag: this.editable && !this.disabled,
          disabled: !this.editable || this.disabled,
          createUserId: this.$store.getters.token,
        },
        {
          label: 'L0000002843', // '첨부파일',
          taskClassNm: 'GOV_IMPL_CHK_RESULT_REF',
          taskKey: taskKey,
          editable: this.editable && !this.disabled,
          drag: this.editable && !this.disabled,
          disabled: !this.editable || this.disabled,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    loadComponent() {
      if (this.tabItems[this.tabIndex].path === 'imprActTab') {
        this.components = () => import(`${'@/pages/impr/imprActTabSample'}`);
      } else {
        this.components = () => import(`${this.tabItems[this.tabIndex].path}`);
      }
    },
    btnSave() {
      let promises = [
        { func: this.checkValidation },
        { func: this.confirm, param: 'M0000000011' }, // 저장하시겠습니까?
        { func: this.saveData },
      ];

      this.$comm.orderedPromise(promises);
    },
    btnDelete() {
      let promises = [
        { func: this.confirm, param: 'M0000000012' }, // 삭제하시겠습니까?
        { func: this.deleteData },
      ];

      this.$comm.orderedPromise(promises);
    },
    btnAppr() {
      //
      let promises = [
        { func: this.checkValidation },
        { func: this.confirm, param: 'M0000000250' }, // 결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?
        { func: this.saveData, param: 'appr' },
        { func: this.apprData },
      ];

      this.$comm.orderedPromise(promises);
    },
    /** validation checking **/
    checkValidation(flag) {
      // 값 유효성 체크
      return new Promise((_resolve) => {
        // 유효성 검사 체크
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              // 점검리더 유효성 체크
              if (!this.govImplChkPlan.deptReaderNm) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message:
                    '[' +
                    this.$comm.getLangSpecInfoLabel('L0000005277') +
                    '] ' +
                    this.$comm.getLangSpecInfoLabel('L0000005312'), // 점검리더를 선택하세요.
                  type: 'warning',
                });
                return false;
              }

              // 내부 점검팀원 목록 validation 체크
              if (
                !this.govImplChkPlan.govImplChkInRaters ||
                !this.govImplChkPlan.govImplChkInRaters.length
              ) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message:
                    '[' +
                    this.$comm.getLangSpecInfoLabel('L0000005277') +
                    '] ' +
                    this.$comm.getLangSpecInfoLabel('L0000005311'), // 내부 점검자를 1명이상 선택하세요.
                  type: 'warning',
                });
                return;
              }

              // 점검완료일 유효성 체크
              if (!this.govImplChkPlan.govImplChkRslt.chkDt) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message:
                    '[' +
                    this.$comm.getLangSpecInfoLabel('L0000002536') +
                    '] ' +
                    this.$comm.getLangSpecInfoLabel('M0000001262'), // 점검완료일을 선택해주세요.
                  type: 'warning',
                });
                // this.tabIndex = '1';
                return;
              }
              console.log(this.govImplChkPlan);
              console.log(this.$comm.moment(this.chkPeriod[0]).format('YYYY'));
              if (
                this.govImplChkPlan.year !==
                  this.$comm.moment(this.chkPeriod[0]).format('YYYY') ||
                this.govImplChkPlan.year !==
                  this.$comm.moment(this.chkPeriod[1]).format('YYYY')
              ) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395' /* 안내 */,
                  message:
                    'L0000005393' /* 대상년도와 점검기간이 일치 하지 않습니다. */,
                  type: 'warning', // success / info / warning / error
                });

                return;
              }

              _resolve(true);
            } else {
              // 사업장 유효성 체크
              if (!this.govImplChkPlan.plantCd) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000066', // 사업장을 선택하세요.
                  type: 'warning',
                });
                return;
              }

              // 대상년도 유효성 체크
              if (!this.govImplChkPlan.year) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'L0000005132', // 대상년도를 선택해주세요.
                  type: 'warning',
                });
                return;
              }

              // 구분 유효성 체크
              if (!this.govImplChkPlan.regRegdem) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'L0000005134', // 구분을 선택해주세요.
                  type: 'warning',
                });
                return;
              }

              // 주관부서 유효성 체크
              if (!this.govImplChkPlan.mainDeptCd) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'L0000005136', // 주관부서를 선택해주세요.
                  type: 'warning',
                });
                return;
              }

              // 대상부서 유효성 체크
              if (!this.govImplChkPlan.targetDeptCd) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000001308', // 대상부서를 선택해주세요.
                  type: 'warning',
                });
                return;
              }

              // 점검기간 유효성 체크
              if (!this.chkPeriod || !this.chkPeriod.length) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000062', // 점검기간을 선택해주세요.
                  type: 'warning',
                });
                return;
              }

              // 점검명 유효성 체크
              if (!this.govImplChkPlan.chkNm) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000001260', // 점검명을 입력해주세요.
                  type: 'warning',
                });
                return;
              }

              // 관련 정부지자체 유효성 체크
              if (!this.govImplChkPlan.refGovNm) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'L0000005308', // 관련 정부지자체를 입력해주세요.
                  type: 'warning',
                });
                return;
              }

              // 상세내용 유효성 체크
              if (!this.govImplChkPlan.chkDesc) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'L0000005309', // 상세내용을 입력해주세요.
                  type: 'warning',
                });
                return;
              }
            }
          })
          .catch((e) => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
            );
          });
      });
    },
    confirm(msg) {
      // 저장
      return new Promise((_resolve) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: msg,
          type: 'info',
          confirmCallback: () => {
            if (this.govImplChkPlan.implChkPlanNo) {
              this.govImplChkPlan.updateUserId = this.$store.getters.token;
              this.govImplChkPlan.updateDeptCd = this.$store.getters.deptCd;
              this.govImplChkPlan.updateDeptNm = this.$store.getters.deptNm;
              this.govImplChkPlan.updatePositionCd =
                this.$store.getters.positionCd;
              this.govImplChkPlan.updatePositionNm =
                this.$store.getters.positionNm;
            } else {
              this.govImplChkPlan.createUserId = this.$store.getters.token;
              this.govImplChkPlan.createDeptCd = this.$store.getters.deptCd;
              this.govImplChkPlan.createDeptNm = this.$store.getters.deptNm;
              this.govImplChkPlan.createPositionCd =
                this.$store.getters.positionCd;
              this.govImplChkPlan.createPositionNm =
                this.$store.getters.positionNm;

              this.govImplChkPlan.procStepCd = 'CS002'; // 결과
              this.govImplChkPlan.stateCd = 'STATE2'; // 작성중
            }

            this.govImplChkPlan.chkStartDt = this.chkPeriod[0];
            this.govImplChkPlan.chkEndDt = this.chkPeriod[1];

            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData(flag) {
      return new Promise((_resolve) => {
        let url = transactionConfig.saf.govImplChkResult.save.url;
        let type = this.govImplChkPlan.implChkPlanNo ? 'PUT' : 'POST';

        this.$http.url = url;
        this.$http.type = type;
        this.$http.param = this.govImplChkPlan;
        this.$http.request(
          (_result) => {
            this.govImplChkPlan = this.$_.cloneDeep(_result.data);

            this.refreshObject.taskKey = this.govImplChkPlan.implChkPlanNo;
            this.refreshObject.refresh = !this.refreshObject.refresh;
            this.getDetail();

            if (flag !== 'appr') {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000006', // 저장되었습니다.
                type: 'success',
              });
            }

            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    deleteData() {
      return new Promise((_resolve) => {
        this.$http.url = this.$format(
          transactionConfig.saf.govImplChkResult.delete.url,
          this.govImplChkPlan.implChkPlanNo
        );
        this.$http.type = 'DELETE';
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000007', // 삭제되었습니다.
              type: 'success',
            });

            this.btnClosePopup();

            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    apprData() {
      return new Promise((_resolve) => {
        this.popupOptions.target = () =>
          import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
        this.popupOptions.title = 'L0000003418'; // 결재요청
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeApprPop;
        this.popupOptions.width = '80%';
        this.popupOptions.param = {
          apprBizCd: 'SA-GV-01',
          apprRqstNo: this.govImplChkPlan.apprRqstNo,
          apprParams: {
            implChkPlanNo: this.govImplChkPlan.implChkPlanNo,
          },
        };
      });
    },
    closeApprPop(data) {
      if (data.resultFlag) {
        this.getDetail();
      }
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    /** /validation checking **/

    /** Button Event **/
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    deptSearch() {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000004209'; /* 부서검색 */
      this.popupOptions.param = {
        plantCd: this.govImplChkPlan.plantCd
          ? this.govImplChkPlan.plantCd
          : this.$store.getters.plantCd,
        multiple: true,
      };
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchDept;
    },
    closePopupSearchDept(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data && data.length) {
        let targetDeptCds = this.govImplChkPlan.targetDeptCd
          ? this.govImplChkPlan.targetDeptCd.split(',')
          : '';
        let targetDeptNms = this.govImplChkPlan.targetDeptNm
          ? this.govImplChkPlan.targetDeptNm.split(',')
          : '';

        targetDeptCds = this.$comm.removeDuplicatedArray(
          targetDeptCds,
          data.map((item) => item.deptCd)
        );

        targetDeptNms = this.$comm.removeDuplicatedArray(
          targetDeptNms,
          data.map((item) => item.deptNm)
        );

        this.govImplChkPlan.targetDeptCd = targetDeptCds.join(',');
        this.govImplChkPlan.targetDeptNm = targetDeptNms.join(',');
      }
    },
    clearDept() {
      this.govImplChkPlan.targetDeptCd = null;
      this.govImplChkPlan.targetDeptNm = null;
    },
    /** /Button Event **/
  },
};
</script>
