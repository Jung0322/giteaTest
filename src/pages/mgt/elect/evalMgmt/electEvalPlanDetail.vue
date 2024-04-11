<!--
  목적 : SHE경영 관리>법정선임자 관리>법정선임자 평가 관리>평가계획 관리
  Detail : 평가계획 관리 상세 팝업화면
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
              <!-- 평가계획 상세 -->
              <y-label
                label="L0000003054"
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
                <!-- 대상년도 -->
                <y-datepicker
                  :width="9"
                  :editable="editable"
                  :disabled="disabled"
                  label="L0000004449"
                  :required="true"
                  type="year"
                  name="year"
                  :default="electEvalPlan.year"
                  v-model="electEvalPlan.year"
                  v-validate="'required'"
                  :state="validateState('year')"
                ></y-datepicker>
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 구분 -->
                <y-select
                  :width="9"
                  :comboItems="MgtHalfTypeItems"
                  :editable="editable"
                  :disabled="disabled"
                  :required="true"
                  itemText="codeNm"
                  itemValue="code"
                  ui="bootstrap"
                  name="halfTypeCd"
                  label="L0000000686"
                  v-model="electEvalPlan.halfTypeCd"
                  v-validate="'required'"
                  :state="validateState('halfTypeCd')"
                />
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 사업장 -->
                <y-plant
                  :width="9"
                  :editable="editable"
                  :disabled="disabled"
                  :required="true"
                  v-model="electEvalPlan.plantCd"
                  v-validate="'required'"
                  :state="validateState('plantCd')"
                >
                </y-plant>
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 주관부서 -->
                <y-tree-dept
                  :width="9"
                  label="L0000002713"
                  :editable="editable && deptEditable"
                  :disabled="disabled"
                  :required="true"
                  v-model="electEvalPlan.deptCd"
                  v-validate="'required'"
                  :state="validateState('deptCd')"
                />
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 법정선임자 -->
                <y-select
                  :width="9"
                  :comboItems="electTitleItems"
                  :editable="editable"
                  :disabled="disabled"
                  :required="true"
                  itemText="electTitlNm"
                  itemValue="safElectTitlNo"
                  ui="bootstrap"
                  name="safElectTitlNo"
                  label="L0000005162"
                  v-model="electEvalPlan.safElectTitlNo"
                  v-validate="'required'"
                  :state="validateState('safElectTitlNo')"
                  @datachange="checkInit"
                />
              </b-col>
              <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8"> </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 평가명 -->
                <y-text
                  :width="11"
                  :editable="editable"
                  :disabled="disabled"
                  :required="true"
                  ui="bootstrap"
                  name="evalNm"
                  label="L0000003081"
                  :maxlength="50"
                  v-model="electEvalPlan.evalNm"
                  v-validate="'required'"
                  :state="validateState('evalNm')"
                />
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 상세내용 -->
                <y-textarea
                  :width="11"
                  :editable="editable"
                  :disabled="disabled"
                  :rows="5"
                  :maxlength="1000"
                  ui="bootstrap"
                  name="evalDesc"
                  label="L0000001528"
                  v-model="electEvalPlan.evalDesc"
                />
              </b-col>
            </b-row>
          </b-card>
          <b-row class="mt-3"></b-row>
          <el-tabs type="border-card" v-model="tabIndex">
            <el-tab-pane v-for="(item, i) in tabItems" :key="i">
              <template slot="label">
                {{ $comm.getLangSpecInfoLabel(item.title) }}
              </template>
            </el-tab-pane>
            <keep-alive>
              <component
                v-if="components"
                :is="components"
                :electEvalPlan="electEvalPlan"
                :parentEditable="editable"
                :parentDisabled="disabled"
                :tabKey="tabKey"
                :attachFileGrps="attachFileGrps"
                :saveAttachFiles="saveAttachFiles"
                :tempDeleteFiles="tempDeleteFiles"
                :submitObject="submitObject"
                @changeUploadFiles="changeUploadFiles"
                @setTempDeleteFiles="setTempDeleteFiles"
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
  name: 'elect-eval-plan-detail',
  props: {
    popupParam: {
      default: {
        evalPlanNo: 0, // 평가계획번호
        apprFlag: false,
      },
    },
  },
  data() {
    return {
      editable: false, // 수정 가능 여부
      electEvalPlan: {
        plantCd: null,
        evalPlanNo: 0, // 평가계획번호
        year: null, // 대상년도
        halfTypeCd: null, // 구분(상반기/하반기)
        deptCd: null, // 주관부서
        safElectTitlNo: null, // 법정선임자번호
        evalNm: null, // 평가명
        evalDesc: null, // 상세내용
        procStepCd: null, // 단계(SAF_ELECT_TITL_STEP)
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
        electEvalUsers: [], // 평가대상자 목록
        deleteElectEvalUsers: [], // 평가대상자 삭제목록
        electEvalItems: [], // 평가항목 목록
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
      MgtHalfTypeItems: [], // 구분 selectbox 목록
      electTitleItems: [], // 법정선임자 selectbox 목록
      disabled: false,
      tabItems: [
        { title: 'L0000003098', path: './electEvalPlanItem' }, // 평가항목
        { title: 'L0000004488', path: './electEvalPlanPerson' }, // 대상자
        { title: 'L0000002843', path: 'fileUpload' }, // 첨부파일
      ], // 탭아이템
      tabIndex: 0,
      components: null,
      attachFileGrps: [],
      saveAttachFiles: [],
      tempDeleteFiles: [],
      submitObject: {
        submitCheck: false,
      },
      tabKey: null, // 평가 대상자 그리드 렌더링에 사용할 key
      deptEditable: true,
      tempSafElectTitlNo: 0,
    };
  },
  computed: {
    apprState() {
      return (
        this.electEvalPlan.stepCd === 'BAPSA' ||
        this.electEvalPlan.stepCd === 'BAPSG'
      );
    },
    apprBtn() {
      // 결재요청버튼 권한
      return (
        this.editable &&
        !this.disabled &&
        !this.popupParam.apprFlag &&
        this.electEvalPlan.evalPlanNo
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
        !this.disabled &&
        !this.popupParam.apprFlag &&
        this.electEvalPlan.evalPlanNo
      );
    },
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'electEvalPlan.safElectTitlNo': function(newVal, oldVal) {
      this.tempSafElectTitlNo = oldVal;
    },
    'electEvalPlan.plantCd'() {
      if (!this.electEvalPlan.plantCd) return;

      this.getElectTitleComboItems();
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

      this.electEvalPlan.year = this.$comm.getThisYear();

      // 구분 (상반기/하반기)
      this.$comm.getComboItems('MGT_HALF_TYPE', false).then(_result => {
        this.MgtHalfTypeItems = _result;
      });

      // 법정선임자(평가대상인 법정선임자)
      this.getElectTitleComboItems();

      if (this.popupParam.evalPlanNo) {
        this.electEvalPlan.evalPlanNo = this.popupParam.evalPlanNo;
        this.getDetail();
      } else {
        this.setAttachFileGrps();
      }

      // 권한별 컨트롤 처리
      if (!this.$comm.isCompanyGrp() && !this.$comm.isPlantGrp()) {
        // 일반사용자
        this.deptEditable = false;
      }
    },
    getElectTitleComboItems() {
      this.electEvalPlan.safElectTitlNo = null;
      this.$http.url = selectConfig.saf.electTitle.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.electEvalPlan.plantCd,
        useYn: 'Y', // 사용여부
        evalTgtYn: 'Y', // 평가대상여부
      };
      this.$http.request(
        _result => {
          this.electTitleItems = this.$_.clone(_result.data);
          this.electTitleItems.splice(0, 0, {
            safElectTitlNo: null,
            electTitlNm: this.$comm.getLangSpecInfoLabel(
              'L0000003394'
            ) /* 선택하세요. */,
          });
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    checkInit(data) {
      let promises = [
        { func: this.checkChange },
        // eslint-disable-next-line object-curly-spacing
        { func: this.confirm, param: { msg: 'L0000005335', param: data } }, // 법정선임자 변경시 하단 평가 대상자는 초기화 됩니다. 변경하시겠습니까?
        { func: this.getEvalItems }, // 평가항목 조회
        { func: this.delEvalUsers }, // 대상자들 초기화
      ];

      this.$comm.orderedPromise(promises);
    },
    checkChange() {
      return new Promise(_resolve => {
        if (!this.electEvalPlan.safElectTitlNo) {
          this.electEvalPlan.electEvalItems = [];
          this.electEvalPlan.electEvalUsers = [];

          _resolve(false);
        } else if (
          !this.electEvalPlan.electEvalUsers ||
          this.electEvalPlan.electEvalUsers.length === 0
        ) {
          this.getEvalItems();
          this.electEvalPlan.electEvalUsers = [];

          _resolve(false);
        }

        _resolve(true);
      });
    },
    getEvalItems() {
      return new Promise(_resolve => {
        this.$http.url = this.$format(
          selectConfig.mgt.electEvalMgmt.plan.evalItems.url,
          this.electEvalPlan.safElectTitlNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          _result => {
            if (_result.data) {
              this.electEvalPlan.electEvalItems = this.$_.clone(_result.data);
              _resolve(true);
            }
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    delEvalUsers() {
      return new Promise(_resolve => {
        if (!this.electEvalPlan.evalPlanNo) {
          this.electEvalPlan.electEvalUsers = [];
          _resolve(true);
        } else {
          this.$http.url = this.$format(
            transactionConfig.mgt.electEvalMgmt.plan.deleteEvalUser.url,
            this.electEvalPlan.evalPlanNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            _result => {
              if (_result.data) {
                this.electEvalPlan.electEvalUsers = [];
                _resolve(true);
              }
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        }
      });
    },

    getDetail() {
      this.$http.url = this.$format(
        selectConfig.mgt.electEvalMgmt.plan.get.url,
        this.electEvalPlan.evalPlanNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          if (_result.data) {
            this.electEvalPlan = this.$_.clone(_result.data);

            this.electEvalPlan.electEvalUsers = this.$_.cloneDeep(
              this.electEvalPlan.electEvalUsers.map(item => {
                let row = item;
                // 본인 평가자
                row.meUser = {
                  userId: row.meUserId,
                  userNm: row.meUserNm,
                };
                // 상위 평가자
                row.upUser = {
                  userId: row.upUserId,
                  userNm: row.upUserNm,
                };

                return row;
              })
            );

            if (this.apprState && !this.popupParam.apprFlag) {
              this.disabled = true;
            }

            let nowDate = new Date();
            this.tabKey = nowDate.getMilliseconds();

            this.setAttachFileGrps();
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    loadComponent() {
      let path = this.tabItems[this.tabIndex].path;

      if (path === 'fileUpload') {
        this.components = () =>
          import(`${'@/pages/common/attachFile/multiFileUpload'}`);
      } else {
        this.components = () => import(`${path}`);
      }
    },
    btnSave() {
      let promises = [
        { func: this.checkValidation },
        { func: this.checkValidationEvalUsers },
        { func: this.confirm, param: 'M0000000011' }, // 저장하시겠습니까?
        { func: this.saveData },
      ];

      this.$comm.orderedPromise(promises);
    },
    btnDelete() {
      let promises = [
        { func: this.checkValidation, param: 'delete' },
        { func: this.confirm, param: 'M0000000012' }, // 삭제하시겠습니까?
        { func: this.deleteData },
      ];

      this.$comm.orderedPromise(promises);
    },
    btnAppr() {
      let promises = [
        { func: this.checkValidation },
        { func: this.checkValidationEvalUsers },
        { func: this.confirm, param: 'M0000000250' }, // 결재요청 하기 전 입력된 값을 저장합니다. 진행하시겠습니까?
        { func: this.saveData, param: 'appr' },
        { func: this.apprData },
      ];

      this.$comm.orderedPromise(promises);
    },
    /** validation checking **/
    checkValidation(flag) {
      // 값 유효성 체크
      return new Promise(_resolve => {
        if (flag === 'delete') {
          // 1건 이상 평가진행중(본인평가/상위평가)일 경우 삭제 불가능
          let validDelete =
            this.electEvalPlan.electEvalUsers.filter(
              item => item.meProcStep !== 'PSURE' || item.upProcStep !== 'PSURE'
            ).length <= 0;

          if (!validDelete) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'L0000005195', // 평가가 진행되어 삭제할 수 없습니다.
              type: 'warning',
            });
            return;
          }

          _resolve(true);
        } else {
          // 유효성 검사 체크
          this.$validator
            .validateAll()
            .then(_result => {
              if (_result) {
                _resolve(true);
              } else {
                // 집행일자 유효성 체크
                if (!this.electEvalPlan.year) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'L0000005132', // 대상년도를 선택해주세요.
                    type: 'warning',
                  });
                  return;
                }

                // 사업장 유효성 체크
                if (!this.electEvalPlan.halfTypeCd) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000001116', // 구분을 선택해주세요.
                    type: 'warning',
                  });
                  return;
                }

                // 대상부서 유효성 체크
                if (!this.electEvalPlan.deptCd) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000001110', // 주관부서를 선택해주세요.
                    type: 'warning',
                  });
                  return;
                }

                // 예산분류 유효성 체크
                if (!this.electEvalPlan.safElectTitlNo) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'L0000005180', // 법정선임자를 선택해주세요.
                    type: 'warning',
                  });
                  return;
                }

                // 예산구분 유효성 체크
                if (!this.electEvalPlan.evalNm) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000001318', // 평가명을 입력해주세요.
                    type: 'warning',
                  });
                  return;
                }
              }
            })
            .catch(e => {
              window.getApp.$emit(
                'APP_VALID_ERROR',
                'M0000000876' // 유효성 검사도 에러가 발생하였습니다.
              );
            });
        }
      });
    },
    checkValidationEvalUsers() {
      // 평가 대상자 유효성 체크
      return new Promise(_resolve => {
        if (
          !this.electEvalPlan.electEvalUsers ||
          !this.electEvalPlan.electEvalUsers.length
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message:
              '[' +
              this.$comm.getLangSpecInfoLabel('L0000004488') +
              '] ' +
              this.$comm.getLangSpecInfoLabel('L0000005198'), // 한 명 이상의평가대상자를 선택해주세요.
            type: 'warning',
          });
          return;
        }

        this.electEvalPlan.electEvalUsers.every(user => {
          if (!user.meUserId) {
            // 본인평가자 유효성검사
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message:
                '[' +
                this.$comm.getLangSpecInfoLabel('L0000004488') +
                '] ' +
                this.$comm.getLangSpecInfoLabel('L0000005199'), // 본인평가자를 지정해주세요.
              type: 'warning',
            });
            _resolve(false);
            return false;
          }

          if (!user.upUserId) {
            // 상위평가자 유효성검사
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message:
                '[' +
                this.$comm.getLangSpecInfoLabel('L0000004488') +
                '] ' +
                this.$comm.getLangSpecInfoLabel('L0000005200'), // 상위평가자를 지정해주세요.
              type: 'warning',
            });
            _resolve(false);
            return false;
          }

          return true;
        });

        if (
          !this.electEvalPlan.electEvalItems ||
          !this.electEvalPlan.electEvalItems.length
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'L0000005201', // 한 개 이상의 평가항목을 지정해주세요.
            type: 'warning',
          });
          return;
        }

        _resolve(true);
      });
    },
    confirm(data) {
      // 저장
      return new Promise(_resolve => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: data.param ? data.msg : data,
          type: 'info',
          confirmCallback: () => {
            if (this.electEvalPlan.evalPlanNo) {
              this.electEvalPlan.updateUserId = this.$store.getters.token;
              this.electEvalPlan.updateDeptCd = this.$store.getters.deptCd;
              this.electEvalPlan.updateDeptNm = this.$store.getters.deptNm;
              this.electEvalPlan.updatePositionCd = this.$store.getters.positionCd;
              this.electEvalPlan.updatePositionNm = this.$store.getters.positionNm;
            } else {
              this.electEvalPlan.createUserId = this.$store.getters.token;
              this.electEvalPlan.createDeptCd = this.$store.getters.deptCd;
              this.electEvalPlan.createDeptNm = this.$store.getters.deptNm;
              this.electEvalPlan.createPositionCd = this.$store.getters.positionCd;
              this.electEvalPlan.createPositionNm = this.$store.getters.positionNm;

              // 신규등록일 경우 단계코드 지정
              this.electEvalPlan.procStepCd = 'SETS1'; // 계획
              this.electEvalPlan.stateCd = 'STATE2'; // 작성중
              this.electEvalPlan.stepCd = 'BAPSB'; // 결재요청전
            }

            _resolve(true);
          },
          cancelCallback: () => {
            if (data.param) {
              this.electEvalPlan.safElectTitlNo = this.tempSafElectTitlNo;
            }
            _resolve(false);
          },
        });
      });
    },
    saveData(flag) {
      return new Promise(_resolve => {
        let type = this.electEvalPlan.evalPlanNo ? 'PUT' : 'POST';

        this.$http.url = transactionConfig.mgt.electEvalMgmt.plan.save.url;
        this.$http.type = type;
        this.$http.param = this.electEvalPlan;
        this.$http.request(
          _result => {
            this.electEvalPlan = this.$_.clone(_result.data);

            this.electEvalPlan.electEvalUsers = this.$_.cloneDeep(
              this.electEvalPlan.electEvalUsers.map(item => {
                let row = item;
                // 본인 평가자
                row.meUser = {
                  userId: row.meUserId,
                  userNm: row.meUserNm,
                };
                // 상위 평가자
                row.upUser = {
                  userId: row.upUserId,
                  userNm: row.upUserNm,
                };

                return row;
              })
            );

            this.saveAttach();

            if (flag !== 'appr') {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000006', // 저장되었습니다.
                type: 'success',
              });
            }

            _resolve(true);
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    deleteData() {
      return new Promise(_resolve => {
        this.$http.url = this.$format(
          transactionConfig.mgt.electEvalMgmt.plan.delete.url,
          this.electEvalPlan.evalPlanNo
        );
        this.$http.type = 'DELETE';
        this.$http.request(
          _result => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000007', // 삭제되었습니다.
              type: 'success',
            });

            this.btnClosePopup();

            _resolve(true);
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    apprData() {
      return new Promise(_resolve => {
        this.popupOptions.target = () =>
          import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
        this.popupOptions.title = 'L0000003418'; // 결재요청
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closeApprPop;
        this.popupOptions.width = '80%';
        this.popupOptions.param = {
          apprBizCd: 'MG-EV-01',
          apprRqstNo: this.electEvalPlan.apprRqstNo,
          apprParams: {
            evalPlanNo: this.electEvalPlan.evalPlanNo,
          },
        };
      });
    },
    closeApprPop(data) {
      if (data.resultFlag) {
        this.electEvalPlan.apprRqstNo = data.apprRqstNo;
        this.electEvalPlan.stepCd = 'BAPSA'; // 결재중
        this.disabled = true;

        this.setAttachFileGrps();
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
    setAttachFileGrps() {
      let taskKey = this.electEvalPlan.evalPlanNo
        ? this.electEvalPlan.evalPlanNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000002843', // '첨부파일',
          taskClassNm: 'ELECT_EVAL_PLAN',
          taskKey: taskKey,
          editable: this.editable && !this.disabled,
          drag: this.editable && !this.disabled,
          disabled: !this.editable || this.disabled,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.attachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.attachFileGrps[index].uploadTempFiles = data;
        let saveIndex = this.$_.findIndex(this.saveAttachFiles, {
          taskClassNm: data.taskClassNm,
        });
        if (saveIndex > -1) {
          this.saveAttachFiles[saveIndex] = this.$_.clone(
            this.attachFileGrps[index]
          );
        } else {
          this.saveAttachFiles.push(this.$_.clone(this.attachFileGrps[index]));
        }
      }
    },
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, item => {
        item.taskKey = this.electEvalPlan.evalPlanNo;
      });

      if (this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        this.$http.request(
          _result => {
            this.tempDeleteFiles = [];
            // 저장할 데이터가 있는 경우
            if (this.saveAttachFiles.length > 0) {
              this.submitObject.submitCheck = !this.submitObject.submitCheck;
            }
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitObject.submitCheck = !this.submitObject.submitCheck;
        }
      }
    },
    /** Button Event **/
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    /** /Button Event **/
  },
};
</script>
