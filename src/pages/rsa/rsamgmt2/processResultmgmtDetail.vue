<!--
  목적 : 평가계획 관리 상세
  작성자 : pkj
  Detail :
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
            <!-- 평가계획 작성 -->
            <y-label
              label="평가결과 관리 상세"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn title="L0000003418" color="black" @btnClicked="approval" />
              <!-- 결재완료(임시) -->

              <y-btn
                v-if="
                  editable &&
                  updateMode &&
                  apprMode &&
                  !this.popupParam.apprFlag
                "
                :action-url="apprUrl"
                :param="Planmgmt"
                :is-submit="isAppr"
                title="결재완료(임시)"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeValidateChk('appr')"
                @btnClicked="btnApprClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable && apprMode"
                :action-url="editUrl"
                :param="Planmgmt"
                :is-submit="isEdit"
                title="저장"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeValidateChk('update')"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!updateMode && editable"
                :action-url="insertUrl"
                :param="Planmgmt"
                :is-submit="isInsert"
                title="저장"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeValidateChk('insert')"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <!-- <y-btn
                v-if="
                  editable &&
                    updateMode &&
                    apprMode &&
                    !this.popupParam.apprFlag
                "
                title="L0000001495"
                color="red"
                @btnClicked="deleteInfo"
              /> -->
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :editable="editable && apprMode"
                :required="true"
                name="plantCd"
                v-model="Planmgmt.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대상년도 -->
              <y-datepicker
                :editable="editable && apprMode"
                :width="8"
                type="year"
                name="tempAssessYear"
                label="대상년도"
                :default="Planmgmt.tempAssessYear"
                v-model="Planmgmt.tempAssessYear"
                :required="true"
                v-validate="'required'"
                :state="validateState('tempAssessYear')"
              />
            </b-col>
            <!-- 주관팀 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-tree-dept
                label="주관팀"
                name="deptCd"
                v-model="Planmgmt.deptCd"
                :plantCd="Planmgmt.plantCd"
                :required="true"
                :editable="editable && apprMode"
                v-validate="'required'"
                :state="validateState('deptCd')"
                @setDeptNm="setDeptNm"
              />
            </b-col>
            <!-- 대상부서 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-tree-dept
                label="대상부서"
                name="deptCd"
                v-model="Planmgmt.deptCd"
                :plantCd="Planmgmt.plantCd"
                :required="true"
                :editable="editable && apprMode"
                v-validate="'required'"
                :state="validateState('deptCd')"
                @setDeptNm="setDeptNm"
              />
            </b-col>
            <!-- 평가기법 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :editable="editable && apprMode"
                :width="8"
                :comboItems="Planmgmt.deptList"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="평가기법"
                name="classificationCd"
                v-model="Planmgmt.classificationCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('classificationCd')"
              ></y-select>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 구분 -->
              <y-select
                :editable="editable && apprMode"
                :width="8"
                :comboItems="rsaRegRegdemItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="구분"
                name="regRegdem"
                v-model="Planmgmt.regRegdem"
                :required="true"
                v-validate="'required'"
                :state="validateState('regRegdem')"
              ></y-select>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 기간(계획) -->
              <y-datepicker
                :editable="editable && apprMode"
                :width="8"
                :range="true"
                name="period"
                label="기간(계획)"
                :default="Planmgmt.period"
                v-model="Planmgmt.period"
                :required="true"
                v-validate="'required'"
                :state="validateState('period')"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3"> </b-col>

            <!-- 평가명 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :editable="editable && apprMode"
                :width="10"
                :maxlength="50"
                ui="bootstrap"
                label="L0000003081"
                name="assessNm"
                v-model="Planmgmt.assessNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('assessNm')"
              ></y-text>
            </b-col>
            <!-- 상세내용 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :editable="editable && apprMode"
                :width="10"
                :maxlength="250"
                ui="bootstrap"
                name="assessDesc"
                label="상세내용"
                v-model="Planmgmt.assessDesc"
                :rows="3"
              />
            </b-col>
            <el-divider content-position="left">{{ '평가결과' }}</el-divider>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 개선도출건수 -->
              <y-number
                :editable="editable && apprMode"
                :width="8"
                :maxlength="50"
                ui="bootstrap"
                label="개선도출건수"
                name="assessNm"
                v-model="Planmgmt.assessNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('assessNm')"
              ></y-number>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 평가일 -->
              <y-datepicker
                :editable="editable && apprMode"
                :width="8"
                name="period"
                label="평가일"
                :default="Planmgmt.period"
                v-model="Planmgmt.period"
                :required="true"
                v-validate="'required'"
                :state="validateState('period')"
              />
            </b-col>

            <!-- 평가결과 요약 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :editable="editable && apprMode"
                :width="10"
                :maxlength="250"
                ui="bootstrap"
                name="assessDesc"
                label="평가결과 요약"
                v-model="Planmgmt.assessDesc"
                :required="true"
                v-validate="'required'"
                :state="validateState('assessDesc')"
                :rows="3"
              />
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

          <component
            v-show="tabIndex === '0'"
            sm="12"
            :is="component1"
            :saveAttachFiles="saveAttachFiles"
            :attachFileGrps="attachFileGrps"
            :submitCheck="submitCheck"
            @changeUploadFiles="changeUploadFiles"
          />
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
  name: 'y-facility-mst-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        assessPlanNo: 0,
        assessRsltNo: 0,
        riskType: '',
        deptCd: '',
      },
    },
  },
  data: () => ({
    Planmgmt: {
      assessPlanNo: 0,
      assessRsltNo: 0,
      plantCd: '', // 사업장 코드
      assessYear: '',
      classificationCd: null, // 분류
      classificationNm: '', // 분류명
      assessTypeNm: '', // 분류명
      regRegdem: '', // 평가구분
      regRegdemNm: '', // 평가구분명
      assessNm: '',
      assessStartDate: '',
      assessEndDate: '',
      assessDesc: '',
      deptCd: '', // 평가팀 부서코드
      deptNm: '', // 평가팀 부서명
      riskType: '',
      createUserId: '',
      createDeptNm: '',
      createDeptCd: '',
      createPositionCd: '',
      createPositionNm: '',
      updatePositionCd: '',
      updatePositionNm: '',
      updateUserId: '',
      updateDeptNm: '',
      updateDeptCd: '',
      papprRqstNm: '',
      papprRqstNo: 0,
      userId: '',
      internalList: [], // 내부평가자 목록
      externalList: [], // 외부평가자 목록
      assessLeaderId: '', // 평가리더ID
      assessLeaderNm: '', // 평가리더명
      planmgmtDeptList: [], // 평가대상작업목록
      deptList: [], // 분류목록
      tempAssessYear: '', // 임시저장용 평가년도
      tempAssessYear2: '', // 임시저장용 평가년도 (백엔드용)
      tempAssessNm: '', // 임시저장용 평가명
      assessStepCd: '', // 평가진행단계코드
      period: [],
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
    tabItems: [{ title: 'L0000002843', url: 'multiFileUpload' }],
    saveAttachFiles: [],
    attachFileGrps: [],
    submitCheck: false,
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    editUrl: '',
    insertUrl: '',
    deleteUrl: '',
    detailUrl: '',
    rsaRegRegdemItems: [], // 구분
    component: null,
    component1: null,
    component2: null,
    deptListLoad: false,
    deptReLoad: false,
    apprMode: true,
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
    tempAssessNm2: '',
    nextInsertFlag: false,
    nextUpdateFlag: false,
    tempName: '',
    isAppr: false,
    apprUrl: '',
  }),
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.getDetailFlag = false;
      // Url Setting

      this.detailUrl = selectConfig.rsa.planmgmt.get2.url;

      this.editUrl = transactionConfig.rsa.planmgmt.edit2.url;
      this.apprUrl = transactionConfig.rsa.planmgmt.appr.url;
      this.insertUrl = transactionConfig.rsa.planmgmt.insert2.url;
      this.deleteUrl = transactionConfig.rsa.planmgmt.delete.url;

      this.component1 = () =>
        import('@/pages/common/attachFile/multiFileUpload');

      this.$comm.getComboItems('RSA_REG_REGDEM', false).then((_result) => {
        this.rsaRegRegdemItems = _result || [];
      });
      this.$comm.getComboItems('RSA_ASSESS_TYPE', true).then((_result) => {
        this.Planmgmt.deptList = _result;
      });

      if (!this.popupParam.assessPlanNo) {
        let from = this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '-6m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        let to = this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '0y',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        this.Planmgmt.period = [from, to];
        this.Planmgmt.tempAssessYear = [from, to];
        this.Planmgmt.riskType = this.popupParam.riskType;
        this.Planmgmt.deptCd = this.$store.getters.deptCd;

        this.setAttachFileGrps();
      } else {
        this.Planmgmt.assessPlanNo = this.popupParam.assessPlanNo;

        this.getDetail();
        this.Planmgmt.assessNm = this.popupParam.assessNm;
      }
    },

    getDetail() {
      if (!this.Planmgmt.assessPlanNo) return;
      this.$http.url = this.$format(this.detailUrl, this.Planmgmt.assessPlanNo);
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.updateMode = true;

          this.Planmgmt = _result.data;
          this.Planmgmt.tempAssessYear = [
            this.Planmgmt.assessStartDate,
            this.Planmgmt.assessEndDate,
          ];
          this.Planmgmt.planmgmtDeptList = _result.data.planmgmtDeptList;
          this.Planmgmt.internalList = _result.data.internalList;

          this.Planmgmt.tempAssessNm = _result.data.assessNm;
          this.Planmgmt.assessNm = _result.data.assessNm;
          if (
            this.Planmgmt.assessStepCd === 'STATE4' ||
            this.Planmgmt.assessStepCd === 'STATE3'
          ) {
            // 결재중, 결재완료인 경우
            this.editable = false;
          }

          this.setAttachFileGrps();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
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
    /** 수정 하기전 UI단 유효성 검사 **/
    async beforeValidateChk(flag) {
      this.deptListLoad = !this.deptListLoad;
      if (!this.Planmgmt.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000005081' /* 본문 사업장을 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }

      if (!this.Planmgmt.tempAssessYear) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: '대상년도를 입력해주세요' /* 대상년도를 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
      if (!this.Planmgmt.period) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: '기간을 입력해주세요' /* 대상년도를 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }

      if (!this.Planmgmt.classificationCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: '평가기법을 선택해주세요.' /* 평가기법을 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
      if (!this.Planmgmt.regRegdem) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: '구분을 선택해주세요.' /* 평가구분을 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }

      if (!this.Planmgmt.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: '주관팀을 선택해주세요.' /* 평가팀을 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
      if (!this.Planmgmt.assessNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000005137' /* 평가명을 입력해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }

      if (flag === 'insert') {
        this.nextInsert();
      } else if (flag === 'update') {
        this.nextUpdate();
      } else {
        this.approval2();
      }
    },
    setDeptNm(deptNm) {
      this.Planmgmt.deptNm = deptNm;
    },

    nextInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '평가계획을 등록하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.nextInsertFlag = true;
                this.Planmgmt.assessStartDate = this.Planmgmt.period[0];
                this.Planmgmt.assessEndDate = this.Planmgmt.period[1];
                this.Planmgmt.assessYear =
                  this.Planmgmt.tempAssessYear[0].substring(0, 4);
                this.Planmgmt.tempAssessYear =
                  this.Planmgmt.tempAssessYear[0].substring(0, 4);
                this.Planmgmt.createUserId = this.$store.getters.token;
                this.Planmgmt.userId = this.$store.getters.token;
                this.Planmgmt.createDeptNm = this.$store.getters.deptNm;
                this.Planmgmt.createDeptCd = this.$store.getters.deptCd;
                this.Planmgmt.createPositionCd = this.$store.getters.positionCd;
                this.Planmgmt.createPositionNm = this.$store.getters.positionNm;

                this.isInsert = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사도중 에러가 발생하였습니다.'
          );
        });
    },
    approval() {
      // this.popupOptions.target = () =>
      //   import(`${'@/pages/approval/processResultApproval.vue'}`);
      this.popupOptions.title = '결재요청';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        url: selectConfig.rsa.planmgmt.getProcessResultAppr.url,
        // assessPlanNo: this.Planmgmt.assessPlanNo.toString()
      };
    },
    approval2() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message:
                '해당버튼은 임시 결재완료 버튼입니다. 확인을 누르면 위험성평가 계획은 결재완료가 되고 해당 계획의 평가대상작업에 대한 위험성평가 결과가 생성됩니다. 진행하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.nextUpdateFlag = true;
                this.nextInsertFlag = true;
                this.Planmgmt.assessStartDate = this.Planmgmt.tempAssessYear[0];
                this.Planmgmt.assessEndDate = this.Planmgmt.tempAssessYear[1];
                this.Planmgmt.assessYear =
                  this.Planmgmt.tempAssessYear[0].substring(0, 4);
                this.Planmgmt.tempAssessYear =
                  this.Planmgmt.tempAssessYear[0].substring(0, 4);
                this.Planmgmt.updateUserId = this.$store.getters.token;
                this.Planmgmt.updateDeptNm = this.$store.getters.deptNm;
                this.Planmgmt.updateDeptCd = this.$store.getters.deptCd;
                this.Planmgmt.updatePositionCd = this.$store.getters.positionCd;
                this.Planmgmt.updatePositionNm = this.$store.getters.positionNm;

                this.isAppr = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사도중 에러가 발생하였습니다.'
          );
        });
    },
    nextUpdate() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '평가계획을 수정하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.nextUpdateFlag = true;
                this.nextInsertFlag = true;
                this.Planmgmt.assessStartDate = this.Planmgmt.period[0];
                this.Planmgmt.assessEndDate = this.Planmgmt.period[1];
                this.Planmgmt.assessYear =
                  this.Planmgmt.tempAssessYear[0].substring(0, 4);
                this.Planmgmt.tempAssessYear =
                  this.Planmgmt.tempAssessYear[0].substring(0, 4);
                this.Planmgmt.updateUserId = this.$store.getters.token;
                this.Planmgmt.updateDeptNm = this.$store.getters.deptNm;
                this.Planmgmt.updateDeptCd = this.$store.getters.deptCd;
                this.Planmgmt.updatePositionCd = this.$store.getters.positionCd;
                this.Planmgmt.updatePositionNm = this.$store.getters.positionNm;

                this.isEdit = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사도중 에러가 발생하였습니다.'
          );
        });
    },
    btnApprClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: '결재완료되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.Planmgmt.tempAssessYear = [
        this.Planmgmt.assessStartDate,
        this.Planmgmt.assessEndDate,
      ];

      this.isEdit = false;
      this.isAppr = false;
      this.updateMode = true;
      this.nextInsertFlag = false;
      this.nextUpdateFlag = false;
      this.saveAttach();
      // this.getDetail();
      this.deptReLoad = !this.deptReLoad;
      this.Planmgmt.assessNm = this.tempName;
      this.closePopup();
    },
    btnSaveClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.Planmgmt.tempAssessYear = [
        this.Planmgmt.assessStartDate,
        this.Planmgmt.assessEndDate,
      ];

      this.isEdit = false;
      this.updateMode = true;
      this.nextInsertFlag = false;
      this.nextUpdateFlag = false;
      this.saveAttach();
      // this.getDetail();
      this.deptReLoad = !this.deptReLoad;
      this.Planmgmt.assessNm = this.tempName;
    },
    btnInsertClickedCallback(result) {
      this.Planmgmt.assessPlanNo = result.data;
      this.Planmgmt.tempAssessYear = [
        this.Planmgmt.assessStartDate,
        this.Planmgmt.assessEndDate,
      ];
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.updateMode = true;
      this.saveAttach();
      // this.getDetail();
      // 저장 후 재 조회시 대상부서탭 우선조회되서 데이터 정합성 안맞는 현상처리
      setTimeout(() => {
        this.deptReLoad = !this.deptReLoad;
      }, 300);
    },
    deleteInfo() {
      return new Promise((_resolve, _reject) => {
        this.$http.type = 'GET';
        this.$http.url = this.$format(
          selectConfig.rsa.planmgmt.getstatus.url,
          this.Planmgmt.assessPlanNo
        );
        this.$http.request(
          (_result) => {
            if (_result.data === 0) {
              _resolve(true);
              this.deleteSubmit();
            } else {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message:
                  'M0000001620' /* 대상 부서가 평가 중상 태일 경우 삭제가 불가합니다. */,
                type: 'warning', // success / info / warning / error
              });
              _resolve(false);
              return;
            }
          },
          (_error) => {
            _reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    deleteSubmit() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // '삭제하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.Planmgmt.assessPlanNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // '삭제되었습니다.',
                type: 'success',
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    btnClickedErrorCallback(result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', result);
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    setAttachFileGrps() {
      let taskKey = this.Planmgmt.assessPlanNo
        ? this.Planmgmt.assessPlanNo
        : ''; // 현 모델 키 값

      this.attachFileGrps = [
        {
          label: '파일업로드',
          drag: this.editable,
          showFileSearch: false,
          editable: this.editable && this.apprMode,
          disabled: !this.apprMode,
          uploadTempFiles: null,
          taskClassNm: 'RSA_PLANMGMT', // 현 화면의 첨부파일 키 값
          taskKey: taskKey,
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

        // 업로드 하기 위해 올라온 파일들을 저장하는 부분
        // 기존에 들어가 있는 경우에는 덮어쓰고 아닌 경우에는 신규로 넣는다.
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
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.Planmgmt.assessPlanNo;
      });

      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitCheck = !this.submitCheck;
      }
    },
    beforeConfirm() {
      this.deptListLoad = !this.deptListLoad;
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000718',
        // 결재요청 전 저장됩니다. 진행하시겠습니까?
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          // 결재요청팝업 버튼 표시여부
          this.Planmgmt.assessStartDate = this.Planmgmt.tempAssessYear[0];
          this.Planmgmt.assessEndDate = this.Planmgmt.tempAssessYear[1];
          this.Planmgmt.updateUserId = this.$store.getters.token;
          this.Planmgmt.updateDeptNm = this.$store.getters.deptNm;
          this.Planmgmt.updateDeptCd = this.$store.getters.deptCd;
          this.Planmgmt.updatePositionCd = this.$store.getters.positionCd;
          this.Planmgmt.updatePositionNm = this.$store.getters.positionNm;
          this.$http.url = this.editUrl;
          this.$http.type = 'PUT';
          this.$http.param = this.Planmgmt;
          this.$http.request(
            (_result) => {
              this.popupOptions.target = () =>
                import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
              this.popupOptions.title = 'L0000003418'; // 결재요청
              this.popupOptions.visible = true;
              this.popupOptions.closeCallback = this.closeApprPop;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                apprBizCd:
                  this.Planmgmt.riskType === 'work' ? 'RS-PL-01' : 'RS-PL-02',
                apprRqstNo: this.Planmgmt.papprRqstNo,
                apprParams: {
                  assessPlanNo: this.Planmgmt.assessPlanNo,
                },
              };
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    closeApprPop(data) {
      // 결재요청팝업 버튼 표시여부
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
      this.deptReLoad = !this.deptReLoad;
    },
  },
};
</script>
