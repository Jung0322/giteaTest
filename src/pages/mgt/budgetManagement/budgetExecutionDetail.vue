<!--
  목적 : 경영>SHE예산 관리>예산집행 관리>예산집행 상세 팝업
  Detail : 예산집행 관리 상세 팝업화면
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
              <!-- 예산집행 상세 -->
              <y-label
                label="L0000005098"
                icon="user-edit"
                color-class="cutstom-title-color"
              />
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 예산계정 선택 시 [사업장, 대상부서, 예산분류, 예산구분] 값이 자동으로 설정됩니다. -->
                <y-label
                  v-if="popupParam.budgetExecNo === 0"
                  label="*"
                  style="color: red"
                />
                <y-label
                  v-if="popupParam.budgetExecNo === 0"
                  label="L0000005317"
                />
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
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                <b-row>
                  <b-col sm="4">
                    <y-label label="L0000005003" :required="true" />
                  </b-col>
                  <b-col sm="2">
                    <!-- 예산년도 -->
                    <y-text
                      :width="12"
                      :editable="false"
                      :maxlength="4"
                      ui="bootstrap"
                      name="budgetActYear"
                      v-model="budgetExec.budgetActYear"
                    />
                  </b-col>
                  <b-col sm="6">
                    <!-- 예산계정 -->
                    <y-text
                      :width="12"
                      ui="bootstrap"
                      :editable="editable"
                      :disabled="true"
                      :placeholder="$comm.getLangSpecInfoLabel('L0000005332')"
                      name="budgetActNm"
                      v-model="budgetExec.budgetActNm"
                      v-validate="'required'"
                      :state="validateState('budgetActNm')"
                      :appendIcon="
                        editable && !disabled
                          ? [
                              {
                                icon: 'search',
                                callbackName: 'searchBudgetActMst',
                              },
                              {
                                icon: 'times',
                                callbackName: 'clearBudgetActMst',
                              },
                            ]
                          : null
                      "
                      @searchBudgetActMst="searchBudgetActMst"
                      @clearBudgetActMst="clearBudgetActMst"
                    />
                  </b-col>
                </b-row>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6"></b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                <!-- 사업장 -->
                <y-plant
                  type="none"
                  :editable="editable"
                  :disabled="true"
                  name="plantCd"
                  v-model="budgetExec.plantCd"
                ></y-plant>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                <!-- 대상부서 -->
                <y-tree-dept
                  :width="8"
                  label="L0000000927"
                  :editable="false"
                  :disabled="true"
                  :plantCd="budgetExec.plantCd"
                  v-model="budgetExec.deptCd"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                <!-- 예산분류 -->
                <y-select
                  :width="8"
                  :comboItems="budgetTypeItems"
                  :editable="editable"
                  :disabled="true"
                  itemText="codeNm"
                  itemValue="code"
                  ui="bootstrap"
                  name="budgetTypeCd"
                  label="L0000005001"
                  v-model="budgetExec.budgetTypeCd"
                  @text="
                    (val) => {
                      inputText(val, 'budgetTypeCd');
                    }
                  "
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                <!-- 예산구분 -->
                <y-select
                  :width="8"
                  :comboItems="budgetClsItems"
                  :editable="editable"
                  :disabled="true"
                  itemText="codeNm"
                  itemValue="code"
                  ui="bootstrap"
                  name="budgetClsCd"
                  label="L0000005004"
                  v-model="budgetExec.budgetClsCd"
                  @text="
                    (val) => {
                      inputText(val, 'budgetClsCd');
                    }
                  "
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                <!-- 집행일자 -->
                <y-datepicker
                  :width="8"
                  :editable="editable"
                  :disabled="disabled"
                  label="L0000005099"
                  :required="true"
                  name="execDt"
                  :default="budgetExec.execDt"
                  v-model="budgetExec.execDt"
                  v-validate="'required'"
                  :state="validateState('execDt')"
                ></y-datepicker>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6"></b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                <!-- 집행 금액(원) -->
                <y-number
                  :width="8"
                  ui="bootstrap"
                  :editable="editable"
                  :disabled="disabled"
                  :required="true"
                  label="L0000005100"
                  name="execAmt"
                  v-model="budgetExec.execAmt"
                  v-validate="'required'"
                  :state="validateState('execAmt')"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                <b-row>
                  <b-col sm="4">
                    <!-- 집행가능 금액(원) -->
                    <y-label label="L0000005101"></y-label>
                  </b-col>
                  <b-col sm="8">
                    <el-button
                      type="text"
                      size="small"
                      @click.stop="openExecPslbAmtPopup"
                    >
                      <div>
                        <span :style="{ fontWeight: 'bold' }">{{
                          calcExecPsblAmt
                        }}</span>
                      </div>
                    </el-button>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-card>
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
  name: 'budget-execution-detail',
  props: {
    popupParam: {
      default: {
        budgetExecNo: 0, // 예산편성번호
        apprFlag: false,
      },
    },
  },
  data() {
    return {
      editable: false, // 수정 가능 여부
      budgetExec: {
        budgetExecNo: 0, // 예산집행번호
        budgetActDeptItemNo: 0, // 예산편성부서계정번호
        execDt: null, // 집행일자
        plantCd: null, // 사업장코드
        deptCd: null, // 대상부서코드
        budgetTypeCd: null, // 예산분류코드
        budgetClsCd: null, // 예산구분코드
        budgetActMstNo: 0, // 예산계정번호
        budgetActCd: null, // 예산계정코드
        budgetActNm: null, // 예산계정명
        budgetActYear: null, // 예산계정년도
        execAmt: 0, // 집행금액
        procStepCd: null, // 단계(MGT_BUDGET_STEP)
        stateCd: null, // 상태(COM_STATE)
        stepCd: null, // 결재상태(COM_BIZ_APPR_STEP)
        apprRqstNo: 0, // 결재요청번호
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
      budgetTypeItems: [], // 예산분류 selectbox 목록
      budgetClsItems: [], // 예산구분 selectbox 목록
      disabled: false,
      execPsblAmt: null, // 집행가능 금액(원)
    };
  },
  computed: {
    apprState() {
      return (
        this.budgetExec.stepCd === 'BAPSA' || this.budgetExec.stepCd === 'BAPSG'
      );
    },
    apprBtn() {
      // 결재요청버튼 권한
      return (
        this.editable &&
        this.budgetExec.budgetExecNo &&
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
        this.budgetExec.budgetExecNo &&
        !this.disabled &&
        !this.popupParam.apprFlag
      );
    },
    calcExecPsblAmt() {
      let resultVal = '';

      if (this.execPsblAmt) {
        resultVal =
          this.budgetExec.stepCd === 'BAPSD' || !this.budgetExec.stepCd
            ? Number(this.execPsblAmt.replace(/,/g, '')) -
              this.budgetExec.execAmt
            : this.execPsblAmt;
      }

      if (resultVal < 0) {
        this.budgetExec.execAmt = Number(this.execPsblAmt.replaceAll(/,/g, ''));
        resultVal = 0;
      }

      return this.$numeral(resultVal).format('0,0');
    },
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.budgetExec.plantCd = null;
    this.budgetExec.deptCd = null;
  },
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.budgetExec.execDt = this.$comm.getToday();

      // 예산분류 (예산계정 관리 기준정보)
      this.$comm.getComboItems('MICS3', true).then((_result) => {
        this.budgetTypeItems = this.$_.clone(_result);
      });

      // 예산구분 (MGT_BDT_CLS)
      this.$comm.getComboItems('MGT_BDT_CLS', false).then((_result) => {
        this.budgetClsItems = this.$_.clone(_result);
        this.budgetClsItems.splice(0, 0, {
          code: null,
          codeNm: '',
        });
      });

      if (this.popupParam.budgetExecNo) {
        this.budgetExec.budgetExecNo = this.popupParam.budgetExecNo;
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.mgt.budgetManagement.budgetExec.get.url,
        this.budgetExec.budgetExecNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.budgetExec = this.$_.clone(_result.data);
            this.budgetExec.budgetActYear = this.budgetExec.year;
            this.budgetExec.budgetActNm = this.budgetExec.budgetActNm;
            this.execPsblAmt = this.budgetExec.execPsblAmt;

            if (this.apprState && !this.popupParam.apprFlag) {
              this.disabled = true;
            }
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
      // MG-BD-01
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
              if (
                this.calcExecPsblAmt &&
                Number(this.calcExecPsblAmt.replace(/,/g, '')) < 0
              ) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'L0000005298', // 집행가능금액이상의 집행금액을 입력하였습니다. 집행금액을 확인해주세요.
                  type: 'info',
                });
                return;
              }

              // 집행일자 유효성 체크
              if (!this.budgetExec.execDt) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'L0000005106', // 집행일자를 입력하세요.
                  type: 'info',
                });
                return;
              }

              // 집행일자, 예산일자 유효성 체크
              if (
                this.budgetExec.execDt.substring(0, 4) !==
                this.budgetExec.budgetActYear
              ) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'L0000005318', // 집행년도와 예산년도가 일치하지 않습니다.
                  type: 'info',
                });
                return;
              }

              // 예산계정(예산편성 결재가 완료된 건) 유효성 체크
              if (!this.budgetExec.budgetActMstNo) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'L0000005109', // 예산계정을 선택해주세요.
                  type: 'info',
                });
                return;
              }

              // 집행 금액(원) 유효성 체크
              if (!this.budgetExec.execAmt && this.budgetExec.execAmt === 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'L0000005110', // 집행 금액(원)을 입력해주세요.
                  type: 'info',
                });
                return;
              }

              _resolve(true);
            }
          })
          .catch((e) => {
            console.log('eeeeeeee', e);
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
            if (this.budgetExec.budgetExecNo) {
              this.budgetExec.updateUserId = this.$store.getters.token;
              this.budgetExec.updateDeptCd = this.$store.getters.deptCd;
              this.budgetExec.updateDeptNm = this.$store.getters.deptNm;
              this.budgetExec.updatePositionCd = this.$store.getters.positionCd;
              this.budgetExec.updatePositionNm = this.$store.getters.positionNm;
            } else {
              this.budgetExec.createUserId = this.$store.getters.token;
              this.budgetExec.createDeptCd = this.$store.getters.deptCd;
              this.budgetExec.createDeptNm = this.$store.getters.deptNm;
              this.budgetExec.createPositionCd = this.$store.getters.positionCd;
              this.budgetExec.createPositionNm = this.$store.getters.positionNm;
            }

            this.budgetExec.procStepCd = 'MBS02'; // 집행
            this.budgetExec.stateCd = 'STATE2'; // 작성중

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
        let url = transactionConfig.mgt.budgetManagement.budgetExec.save.url;
        let type = this.budgetExec.budgetExecNo ? 'PUT' : 'POST';

        this.$http.url = url;
        this.$http.type = type;

        this.budgetExec.budgetActNm = this.budgetExec.budgetActNm;
        this.$http.param = this.budgetExec;
        this.$http.request(
          (_result) => {
            this.budgetExec = this.$_.clone(_result.data);
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
          transactionConfig.mgt.budgetManagement.budgetExec.delete.url,
          this.budgetExec.budgetExecNo
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
          apprBizCd: 'MG-BD-02',
          apprRqstNo: this.budgetExec.apprRqstNo,
          apprParams: {
            budgetExecNo: this.budgetExec.budgetExecNo,
          },
        };
      });
    },
    closeApprPop(data) {
      if (data.resultFlag) {
        this.budgetExec.apprRqstNo = data.apprRqstNo;
        this.budgetExec.stepCd = 'BAPSA'; // 결재중
        this.disabled = true;
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
    searchBudgetActMst() {
      // 예산계정 검색 팝업
      this.popupOptions.target = () => import(`${'./budgetActMstPop.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005102'; // 예산계정 검색
      this.popupOptions.width = '70%';
      this.popupOptions.param = {
        year: this.$comm.moment(this.budgetExec.execDt).format('YYYY'), // 집행일자의 년도
        plantCd: this.budgetExec.plantCd,
        deptCd: this.budgetExec.deptCd,
        budgetTypeCd: this.budgetExec.budgetTypeCd,
        budgetClsCd: this.budgetExec.budgetClsCd,
      };
      this.popupOptions.closeCallback = this.closeBudgetActMstPop;
    },
    closeBudgetActMstPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data && data.budgetAct.budgetActMstNo) {
        // 예산계정 선택했을 경우 처리
        this.budgetExec.budgetActMstNo = data.budgetAct.budgetActMstNo;
        this.budgetExec.budgetActYear = data.budgetAct.year;
        this.budgetExec.budgetActCd = data.budgetAct.budgetActCd;
        this.budgetExec.budgetActNm = data.budgetAct.budgetActNm;
        this.budgetExec.budgetActDeptItemNo =
          data.budgetAct.budgetActDeptItemNo;
        this.budgetExec.budgetTypeCd = data.budgetAct.budgetTypeCd;
        this.budgetExec.budgetClsCd = data.budgetAct.budgetClsCd;
        this.budgetExec.deptCd = data.budgetAct.deptCd;
        this.budgetExec.plantCd = data.budgetAct.plantCd;
        this.getExecPsblAmt();
      }
      console.log('data', data);
    },
    clearBudgetActMst() {
      // 예산계정 정보 초기화
      this.budgetExec.budgetActMstNo = null;
      this.budgetExec.budgetActCd = null;
      this.budgetExec.budgetActNm = null;
      this.budgetExec.budgetActDeptItemNo = null;
      this.execPsblAmt = null;
      this.budgetExec.deptCd = null;
      this.budgetExec.plantCd = null;
    },
    inputText(text, headerName) {
      let budgetActMst = null;

      if (headerName === 'budgetTypeCd') {
        this.budgetExec.budgetTypeNm = text;
      } else {
        this.budgetExec.budgetClsNm = text;
      }
    },
    // 집행가능 금액 조회
    getExecPsblAmt() {
      this.$http.url =
        selectConfig.mgt.budgetManagement.budgetExec.execPsblAmt.url;
      this.$http.type = 'GET';
      this.$http.param = {
        deptCd: this.budgetExec.deptCd,
        budgetTypeCd: this.budgetExec.budgetTypeCd,
        budgetClsCd: this.budgetExec.budgetClsCd,
        budgetActMstNo: this.budgetExec.budgetActMstNo,
        budgetExecNo:
          this.budgetExec.stepCd === 'BAPSD' || !this.budgetExec.stepCd
            ? this.budgetExec.budgetExecNo
            : 0,
      };
      this.$http.request(
        (_result) => {
          // 집행가능금액은 0이 조회될 수도 있기 때문에 null, undefined를 체크
          if (_result.data !== null && typeof _result.data !== 'undefined') {
            this.execPsblAmt = this.$_.clone(_result.data);
            // this.$forceUpdate();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR');
        }
      );
    },
    openExecPslbAmtPopup() {
      // 집행가능 금액(원) 상세 팝업
      this.popupOptions.target = () =>
        import(`${'./budgetExecPslbAmtPop.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005114'; // 집행가능 금액(원) 상세
      this.popupOptions.width = '70%';
      this.popupOptions.param = {
        year: this.$comm.moment(this.budgetExec.execDt).format('YYYY'), // 집행일자의 년도
        plantCd: this.budgetExec.plantCd,
        deptCd: this.budgetExec.deptCd,
        budgetActMstNo: this.budgetExec.budgetActMstNo,
      };
      this.popupOptions.closeCallback = this.closeExecPslbAmtPop;
    },
    closeExecPslbAmtPop() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** /Button Event **/
  },
};
</script>
