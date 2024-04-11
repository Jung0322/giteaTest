<!--
  목적 : 점검 > 중대시민재해점검 관리 > 점검 결과 관리 상세
  Detail : 점검결과 관리 관리 상세 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 중대시민재해점검 상세 -->
            <y-label
              label="L0000005254"
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
                v-if="!this.popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="closePopup"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <!-- 점검일자 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-datepicker
                :editable="editable"
                :disabled="disabled"
                :width="8"
                name="inspDt"
                label="L0000005253"
                :default="majDisaInsp.inspDt"
                v-model="majDisaInsp.inspDt"
                :required="true"
                v-validate="'required'"
                :state="validateState('inspDt')"
              />
            </b-col>
            <!-- 사업장 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                type="edit"
                :editable="editable"
                :disabled="disabled"
                name="plantCd"
                v-model="majDisaInsp.plantCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>

            <!-- 주관부서 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-tree-dept
                :editable="editable && deptEditable"
                :disabled="disabled"
                label="L0000002713"
                name="mainDeptCd"
                v-model="majDisaInsp.mainDeptCd"
                :plantCd="majDisaInsp.plantCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('mainDeptCd')"
              />
            </b-col>

            <!-- 점검명 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :editable="editable"
                :disabled="disabled"
                :width="10"
                :maxlength="1000"
                :showMaxLength="false"
                ui="bootstrap"
                label="L0000002551"
                name="chkNm"
                v-model="majDisaInsp.chkNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('chkNm')"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <el-tabs type="border-card" v-model="tabIndex">
          <el-tab-pane
            v-for="(item, i) in tabItems"
            :key="i"
            stretch
            class="default-tab-pane"
          >
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ $comm.getLangSpecInfoLabel(item.title) }}
            </span>
          </el-tab-pane>
          <keep-alive>
            <component
              v-if="components"
              :is="components"
              :majDisaInsp.sync="majDisaInsp"
              :tabParam.sync="tabParam"
              :majDisaInspSafe.sync="majDisaInsp.majDisaInspSafe"
              :attachFileGrps="attachFileGrps"
              :safeFlag.sync="safeFlag"
              :tabIndex.sync="tabIndex"
              :parentEditable="editable"
              :parentDisabled="disabled"
            ></component>
          </keep-alive>
        </el-tabs>
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
  name: 'inspection-mgmt-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        majDisaInspNo: 0,
        apprFlag: false,
      },
    },
  },
  data: () => ({
    majDisaInsp: {
      majDisaInspNo: 0, // 중대시민재해점검번호
      inspDt: null, // 점검일시
      plantCd: null, // 사업장
      mainDeptCd: null, // 주관부서
      chkNm: null, // 점검명
      procStepCd: null, // 단계 COM_STEP
      stateCd: null, // 상태 COM_STATE
      stepCd: null, // 결재상태 COM_BIZ_APPR_STEP
      apprRqstNo: 0, // 결재요청번호
      createUserId: null, // 등록자ID
      createDt: null, // 등록일
      updateUserId: null, // 수정자ID
      updateDt: null, // 수정일
      createDeptNm: null, // 등록자부서명
      createDeptCd: null, // 등록자부서코드
      updateDeptNm: null, // 수정자부서명
      updateDeptCd: null, // 수정자부서코드
      createPositionNm: null, // 등록자직위명
      createPositionCd: null, // 등록자직위코드
      updatePositionNm: null, // 수정자직위명
      updatePositionCd: null, // 수정자직위코드
      majDisaInspSafe: {}, // 안전계획
      majDisaInspRaw: {}, // 법정점검 계획
      majDisaInspAct: {}, // 우려사항 조치
    },
    safeFlag: {
      submitCheck: false,
      majDisaInspSafeNo: 0,
      majDisaInspRawNo: 0,
      majDisaInspActNo: 0,
    },
    // 개선조치를 위한 변수
    tabParam: {
      imprClassCd: '',
      refTableId: 0,
      editable: false,
      message: 'L0000005292', // 개선사항 입력은 점검결과 관리 상세를 등록후 입력 가능합니다.
      detailCheck: false,
      editMode: false,
    },
    gridOptions: {
      header: [],
      data: [],
      height: '450',
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
    tabIndex: 0,
    tabItems: [
      {
        title: 'L0000005256',
        path: './inspectionPlan',
      } /* 안전 계획 */,
      { title: 'L0000005257', path: './majDisaInspRaw' } /* 법정점검 계획 */,
      { title: 'L0000005258', path: './majDisaInspAct' } /* 우려사항 조치 */,
      { title: 'L0000000259', path: 'imprActTabSample' }, // 개선사항
    ],
    attachFileGrps: {
      taskClassNm: 'INSP_MGMT_PLAN',
      taskKey: '',
      createUserId: '',
      showUploadBtn: false,
      uploadCheck: false,
      label: '파일업로드' /* 파일업로드 */,
      uploadTempFiles: null,
    },

    editable: false,
    disabled: false,
    isInsert: false,
    isEdit: false,
    newInsertMode: false,
    editUrl: '',
    insertUrl: '',
    detailUrl: '',
    deleteUrl: '',
    components: null,
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
  }),
  computed: {
    apprState() {
      return (
        this.majDisaInsp.stepCd === 'BAPSA' ||
        this.majDisaInsp.stepCd === 'BAPSG'
      );
    },
    apprBtn() {
      // 결재요청버튼 권한
      return (
        this.editable &&
        !this.disabled &&
        !this.popupParam.apprFlag &&
        this.majDisaInsp.majDisaInspNo
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
        this.majDisaInsp.majDisaInspNo
      );
    },
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.majDisaInsp.inspDt = this.$comm.getToday();
      this.majDisaInsp.mainDeptCd = this.$store.getters.deptCd;

      if (this.popupParam.majDisaInspNo) {
        this.majDisaInsp.majDisaInspNo = this.popupParam.majDisaInspNo;

        this.getDetail();
      } else {
        this.tabParam.editable = false;
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
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.saf.majDisaInsp.get.url,
        this.majDisaInsp.majDisaInspNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.majDisaInsp = this.$_.clone(_result.data);

            this.attachFileGrps.taskKey = !this.majDisaInsp.majDisaInspSafe
              .majDisaInspSafeNo
              ? ''
              : this.majDisaInsp.majDisaInspSafe.majDisaInspSafeNo;

            if (this.apprState && !this.popupParam.apprFlag) {
              this.disabled = true;
            }

            this.tabParam.imprClassCd = 'ICL40';
            this.tabParam.refTableId = this.majDisaInsp.majDisaInspNo;
            this.tabParam.detailCheck = this.disabled;
            this.tabParam.editable = this.editable && !this.disabled;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    loadComponent() {
      let path = this.tabItems[this.tabIndex].path;
      if (path === 'imprActTabSample') {
        this.components = () => import('@/pages/impr/imprActTabSample');
      } else {
        this.components = () => import(`${path}`);
      }
    },
    btnSave() {
      let promises = [
        { func: this.checkValidation },
        { func: this.checkValidationTab },
        { func: this.confirm, param: 'M0000000011' }, // 저장하시겠습니까?
        { func: this.saveData },
      ];

      this.$comm.orderedPromise(promises);
    },
    confirm(msg) {
      return new Promise((_resolve) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: msg,
          type: 'info',
          confirmCallback: () => {
            if (this.majDisaInsp.majDisaInspNo) {
              this.majDisaInsp.updateUserId = this.$store.getters.token;
              this.majDisaInsp.updateDeptCd = this.$store.getters.deptCd;
              this.majDisaInsp.updateDeptNm = this.$store.getters.deptNm;
              this.majDisaInsp.updatePositionCd =
                this.$store.getters.positionCd;
              this.majDisaInsp.updatePositionNm =
                this.$store.getters.positionNm;
            } else {
              this.majDisaInsp.createUserId = this.$store.getters.token;
              this.majDisaInsp.createDeptCd = this.$store.getters.deptCd;
              this.majDisaInsp.createDeptNm = this.$store.getters.deptNm;
              this.majDisaInsp.createPositionCd =
                this.$store.getters.positionCd;
              this.majDisaInsp.createPositionNm =
                this.$store.getters.positionNm;

              // 신규등록일 경우 단계코드 지정
              this.majDisaInsp.procStepCd = 'CS002'; // 결과
              this.majDisaInsp.stateCd = 'STATE2'; // 작성중
              this.majDisaInsp.stepCd = 'BAPSB'; // 결재요청전
            }

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
        let type = this.majDisaInsp.majDisaInspNo ? 'PUT' : 'POST';

        this.$http.url = transactionConfig.saf.majDisaInsp.save.url;
        this.$http.type = type;
        this.$http.param = this.majDisaInsp;
        this.$http.request(
          (_result) => {
            this.majDisaInsp = this.$_.clone(_result.data);

            this.safeFlag.submitCheck = !this.safeFlag.submitCheck;
            this.safeFlag.majDisaInspSafeNo =
              this.majDisaInsp.majDisaInspSafe.majDisaInspSafeNo;
            this.safeFlag.majDisaInspRawNo =
              this.majDisaInsp.majDisaInspRaw.majDisaInspRawNo;
            this.safeFlag.majDisaInspActNo =
              this.majDisaInsp.majDisaInspAct.majDisaInspActNo;

            if (flag !== 'appr') {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000006', // 저장되었습니다.
                type: 'success',
              });
            }
            this.getDetail();
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    checkValidation() {
      return new Promise((_resolve) => {
        // 유효성 검사 체크
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              _resolve(true);
            } else {
              // 점검일자 유효성 체크
              if (!this.majDisaInsp.inspDt) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'L0000005272', // 점검일자를 입력해주세요.
                  type: 'warning',
                });
                return;
                // 사업장 유효성 체크
              } else if (!this.majDisaInsp.plantCd) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000001048', // 사업장을 입력해주세요.
                  type: 'warning',
                });
                return;
                // 주관부서 유효성 체크
              } else if (!this.majDisaInsp.mainDeptCd) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'L0000005273', // 주관부서를 입력해주세요.
                  type: 'warning',
                });
                return;
                // 점검명 유효성 체크
              } else if (!this.majDisaInsp.chkNm) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000001260', // 점검명을 입력해주세요.
                  type: 'warning',
                });
                return;
              }
            }
          })
          .catch((e) => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000876' // 유효성 검사도 에러가 발생하였습니다.
            );
          });
      });
    },
    checkValidationTab() {
      return new Promise((_resolve) => {
        if (!this.majDisaInsp.majDisaInspSafe.planTargetVal) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'L0000005278', // 안전계획(탭)의 계획수립대상(개소)를 입력해주세요.
            type: 'warning',
          });
          return;
        } else if (!this.majDisaInsp.majDisaInspSafe.planVal) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'L0000005279', // 안전계획(탭)의 계획수립(개소)를 입력해주세요.
            type: 'warning',
          });
          return;
        } else if (!this.majDisaInsp.majDisaInspRaw.planTargetVal) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'L0000005285', // 법정점검 계획(탭)의 계획수립대상(개소)를 입력해주세요.
            type: 'warning',
          });
          return;
        } else if (!this.majDisaInsp.majDisaInspRaw.planVal) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'L0000005285', // 법정점검 계획(탭)의 계획수립(개소)를 입력해주세요.
            type: 'warning',
          });
          return;
        } else if (!this.majDisaInsp.majDisaInspRaw.chkVal) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'L0000005285', // 법정점검 계획(탭)의 점검실시(개소)를 입력해주세요.
            type: 'warning',
          });
          return;
        } else if (!this.majDisaInsp.majDisaInspAct.conActVal) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'L0000005289', // 우려사항 조치(탭)의 우려사항 조치(건수)를 입력해주세요.
            type: 'warning',
          });
          return;
        } else if (!this.majDisaInsp.majDisaInspAct.civilDisActVal) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'L0000005290', // 우려사항 조치(탭)의 시민재해 조치(건수)를 입력해주세요.
            type: 'warning',
          });
          return;
        } else if (!this.majDisaInsp.majDisaInspAct.civilDisImprVal) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 안내
            message: 'L0000005291', // 우려사항 조치(탭)의 시민재해 개선(건수)를 입력해주세요.
            type: 'warning',
          });
          return;
        }

        _resolve(true);
      }).catch((e) => {
        window.getApp.$emit(
          'APP_VALID_ERROR',
          'M0000000876' // 유효성 검사도 에러가 발생하였습니다.
        );
      });
    },
    btnDelete() {
      let promises = [
        { func: this.confirmDel },
        { func: this.confirm, param: 'M0000000012' }, // 삭제하시겠습니까?
        { func: this.deleteData },
      ];

      this.$comm.orderedPromise(promises);
    },
    confirmDel() {
      return new Promise((_resolve) => {
        this.$http.url = selectConfig.saf.imprAct.newlist.url;
        this.$http.type = 'GET';
        this.$http.param = this.tabParam;
        this.$http.request(
          (_result) => {
            let delYn = 'Y';
            if (!_result.data || _result.data.length > 0) {
              for (let i = 0; i < _result.data.length; i++) {
                if (_result.data[i]['imprStepCd'] !== 'IMST1') {
                  delYn = 'N';
                }
              }
              if (delYn === 'Y') {
                _resolve(true);
              } else {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395' /* 안내 */,
                  message:
                    'M0000001621' /* 개선사항이 평가중 상태일 경우 삭제가 불가합니다. */,
                  type: 'warning', // success / info / warning / error
                });
                _resolve(false);
              }
            } else {
              _resolve(true);
            }
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
          transactionConfig.saf.majDisaInsp.delete.url,
          this.majDisaInsp.majDisaInspNo
        );
        this.$http.type = 'DELETE';
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000007', // 삭제되었습니다.
              type: 'success',
            });
            this.closePopup();
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    btnAppr() {
      let promises = [
        { func: this.checkValidation },
        { func: this.checkValidationTab },
        { func: this.confirm, param: 'M0000000250' }, // 저장하시겠습니까?
        { func: this.saveData, param: 'appr' },
        { func: this.apprData },
      ];
      this.$comm.orderedPromise(promises);
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
          apprBizCd: 'SA-MA-01',
          apprRqstNo: this.majDisaInsp.apprRqstNo,
          apprParams: {
            majDisaInspNo: this.majDisaInsp.majDisaInspNo,
          },
        };
      });
    },
    closeApprPop(data) {
      if (data.resultFlag) {
        this.majDisaInsp.apprRqstNo = data.apprRqstNo;
        this.majDisaInsp.stepCd = 'BAPSA'; // 결재중
        this.disabled = true;
        this.tabParam.editable = false;
      }

      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },

    closePopup() {
      this.$emit('closePopup', { success: true });
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
  },
};
</script>
