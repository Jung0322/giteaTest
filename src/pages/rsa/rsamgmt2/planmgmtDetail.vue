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
              label="L0000005831"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->

              <y-btn
                v-if="updateMode && editable && apprMode"
                :action-url="editUrl"
                :param="Planmgmt"
                :is-submit="isAppr"
                title="L0000003418"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeValidateChk('appr')"
                @btnClicked="btnSaveClickedCallback2"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="updateMode && editable && apprMode"
                title="L0000001495"
                color="red"
                @btnClicked="deleteSubmit"
              />
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable && apprMode"
                :action-url="editUrl"
                :param="Planmgmt"
                :is-submit="isEdit"
                title="L0000002474"
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
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeValidateChk('insert')"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
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
              <!-- 평가기간 -->
              <y-datepicker
                :editable="editable && apprMode"
                :width="8"
                :range="true"
                name="tempAssessYear"
                label="L0000003062"
                :default="Planmgmt.tempAssessYear"
                v-model="Planmgmt.tempAssessYear"
                :required="true"
                v-validate="'required'"
                :state="validateState('tempAssessYear')"
              />
            </b-col>
            <!-- 평가팀 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-tree-dept
                label="L0000004990"
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
            <!-- 분류 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :editable="editable && apprMode"
                :width="8"
                :comboItems="deptList"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001341"
                name="classificationCd"
                v-model="Planmgmt.classificationCd"
                :state="validateState('classificationCd')"
              ></y-select>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 평가구분 -->
              <y-select
                :editable="editable && apprMode"
                :width="8"
                :comboItems="rsaRegRegdemItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000003059"
                name="regRegdem"
                v-model="Planmgmt.regRegdem"
                :required="true"
                v-validate="'required'"
                :state="validateState('regRegdem')"
              ></y-select>
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
                label="L0000001528"
                v-model="Planmgmt.assessDesc"
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
          <keep-alive>
            <component
              :is="component"
              v-if="component"
              :Planmgmt.sync="this.Planmgmt"
              :deptListLoad.sync="deptListLoad"
              :updateMode.sync="updateMode"
              :editable.sync="editable"
              :deptReLoad.sync="deptReLoad"
              :apprMode.sync="apprMode"
              :apprFlag.sync="this.popupParam.apprFlag"
              :saveAttachFiles="saveAttachFiles"
              :attachFileGrps="attachFileGrps"
              :submitCheck="submitCheck"
              @changeUploadFiles="changeUploadFiles"
            />
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
  name: 'y-facility-mst-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        assessPlanNo: 0,
        assessRsltNo: 0,
        riskType: '',
        deptCd: '',
        apprFlag: false,
      },
    },
    isPopView: false,
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
      tempAssessYear: [], // 임시저장용 평가년도
      tempAssessYear2: '', // 임시저장용 평가년도 (백엔드용)
      tempAssessNm: '', // 임시저장용 평가명
      assessStepCd: '', // 평가진행단계코드
      apprRqstCode: '',
      apprRqstStatus: '',
      alias: '',
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
        title: 'L0000003071',
        url: './planOperationListTab',
      } /* 평가대상 작업 */,
      {
        title: 'L0000004990',
        url: './planOperationTeamTab',
      } /* 평가팀 */,
      { title: 'L0000002843', url: 'multiFileUpload' } /* 첨부파일 */,
    ],
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
    classificationUrl: '', // 평가팀별 분류 조회 url
    rsaRegRegdemItems: [], // 구분
    component: null,

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
    deptList: [], // 분류목록
    aliasUrl: '',
    initCnt: 0,
    titleCnt: 0,
  }),
  watch: {
    'Planmgmt.tempAssessYear': function (newValue, oldValue) {
      if (oldValue !== null && oldValue !== '') {
        if (this.nextInsertFlag === false && this.nextUpdateFlag === false) {
          if (Array.isArray(oldValue)) {
            if (!this.Planmgmt.apprRqstStatus) {
              this.setTitleName();
            }
          }
        }
      }
    },
    'Planmgmt.assessNm': function (newValue, oldValue) {
      this.tempName = this.Planmgmt.assessNm;
    },
    'Planmgmt.regRegdem': function (newValue, oldValue) {
      this.titleCnt += 1;

      if (oldValue !== null && oldValue !== '') {
        if (!this.Planmgmt.apprRqstStatus) {
          this.setTitleName();
        }
      } else if (newValue) {
        if (!this.Planmgmt.apprRqstStatus) {
          this.setTitleName();
        }
      }
    },

    'Planmgmt.classificationCd': function (newValue, oldValue) {
      if (this.Planmgmt.classificationCd) {
        this.$_.forEach(this.deptList, (item) => {
          if (this.Planmgmt.classificationCd === item.classificationCd) {
            this.Planmgmt.classificationNm = item.classificationNm;
          }
        });
      }
    },
    tabIndex: function (newValue, oldValue) {
      this.loadComponent();
    },
  },

  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.getDetailFlag = false;
      // Url Setting
      this.aliasUrl = selectConfig.rsa.planmgmt2.getDeptAlias.url;
      this.detailUrl = selectConfig.rsa.planmgmt2.get2.url;
      this.classificationUrl =
        selectConfig.rsa.planmgmt2.getClassificationList.url;
      this.editUrl = transactionConfig.rsa.planmgmt2.edit2.url;
      this.apprUrl = transactionConfig.rsa.planmgmt2.appr.url;
      this.insertUrl = transactionConfig.rsa.planmgmt2.insert2.url;
      this.deleteUrl = transactionConfig.rsa.planmgmt2.delete.url;

      this.$comm.getComboItems('RSA_REG_REGDEM', false).then((_result) => {
        this.rsaRegRegdemItems = _result;
        this.$_.remove(this.rsaRegRegdemItems, (item) => {
          return item.code === 'REG03';
        });
      });
      this.$comm.getComboItems('RSA_ASSESS_CLASS', true).then((_result) => {
        this.deptList = _result;
        this.deptList.splice(0, 1, {
          code: null,
          codeNm:
            this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
        });
      });

      if (!this.popupParam.assessPlanNo) {
        let from = this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '0m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        let to = this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '1m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        this.Planmgmt.tempAssessYear = [from, to];
        this.Planmgmt.riskType = this.popupParam.riskType;
        // this.Planmgmt.deptCd = this.$store.getters.deptCd;

        this.getAlias();
        this.setAttachFileGrps();
      } else {
        this.Planmgmt.assessPlanNo = this.popupParam.assessPlanNo;
        this.getDetail();
        this.getAlias();
        this.Planmgmt.assessNm = this.popupParam.assessNm;
      }
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      if (path === './planOperationListTab') {
        this.component = () => import(`${'./planOperationListTab'}`);
      } else if (path === './planOperationTeamTab') {
        this.component = () => import(`${'./planOperationTeamTab'}`);
      } else {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      }
    },
    // 평가명 세팅 메소드
    setTitleName() {
      let tempYear;
      let year;
      if (this.titleCnt >= 2 && !this.popupParam.assessPlanNo) {
        // 신규등록 화면일때
        if (Array.isArray(this.Planmgmt.tempAssessYear)) {
          tempYear = new Date(this.Planmgmt.tempAssessYear[0]);
          year = tempYear.getFullYear();
        } else {
          year = this.Planmgmt.tempAssessYear;
        }

        this.$_.forEach(this.rsaRegRegdemItems, (item) => {
          if (item.code === this.Planmgmt.regRegdem) {
            this.Planmgmt.regRegdemNm = item.codeNm;
          }
        });

        if (this.Planmgmt.tempAssessYear || this.Planmgmt.regRegdem) {
          if (!year) {
            this.Planmgmt.assessNm = this.Planmgmt.regRegdemNm;
          } else if (!this.Planmgmt.regRegdem) {
            this.Planmgmt.assessNm = year + '년 ';
          } else {
            if (this.Planmgmt.regRegdemNm === '중요위험 재평가') {
              this.Planmgmt.assessNm = year + '년 ' + this.Planmgmt.regRegdemNm;
            } else {
              this.Planmgmt.assessNm =
                year + '년 ' + this.Planmgmt.regRegdemNm + '평가';
            }
          }
        } else if (!this.Planmgmt.tempAssessYear && !this.Planmgmt.regRegdem) {
          this.Planmgmt.assessNm = '';
        }
      } else if (this.titleCnt > 3 && this.popupParam.assessPlanNo) {
        if (Array.isArray(this.Planmgmt.tempAssessYear)) {
          tempYear = new Date(this.Planmgmt.tempAssessYear[0]);
          year = tempYear.getFullYear();
        } else {
          year = this.Planmgmt.tempAssessYear;
        }

        this.$_.forEach(this.rsaRegRegdemItems, (item) => {
          if (item.code === this.Planmgmt.regRegdem) {
            this.Planmgmt.regRegdemNm = item.codeNm;
          }
        });

        if (this.Planmgmt.tempAssessYear || this.Planmgmt.regRegdem) {
          if (!year) {
            this.Planmgmt.assessNm = this.Planmgmt.regRegdemNm;
          } else if (!this.Planmgmt.regRegdem) {
            this.Planmgmt.assessNm = year + '년 ';
          } else {
            if (this.Planmgmt.regRegdemNm === '중요위험 재평가') {
              this.Planmgmt.assessNm = year + '년 ' + this.Planmgmt.regRegdemNm;
            } else {
              this.Planmgmt.assessNm =
                year + '년 ' + this.Planmgmt.regRegdemNm + '평가';
            }
          }
        } else if (!this.Planmgmt.tempAssessYear && !this.Planmgmt.regRegdem) {
          this.Planmgmt.assessNm = '';
        }
      }
    },
    getAlias() {
      if (this.Planmgmt.deptCd) {
        this.$http.url = this.aliasUrl;
        this.$http.param = this.Planmgmt;
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            if (_result.data) {
              this.Planmgmt.alias = _result.data.alias;
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        this.Planmgmt.alias = '';
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
            this.apprMode = false;
          } else if (this.Planmgmt.apprRqstStatus === '진행') {
            this.editable = false;
            this.apprMode = false;
          } else if (this.Planmgmt.apprRqstStatus === '완료') {
            this.editable = false;
            this.disabled = true;
            this.updateMode = false;
            this.apprMode = false;
          }
          if (this.popupParam.apprFlag) {
            this.editable = false;
            this.disabled = true;
            this.updateMode = false;
            this.apprMode = false;
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
          message: 'L0000005842' /* 본문 사업장을 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }

      if (!this.Planmgmt.tempAssessYear) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001316' /* 평가기간을 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }

      if (!this.Planmgmt.classificationCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001516' /* 분류를 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
      if (!this.Planmgmt.regRegdem) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001512' /* 평가구분을 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }

      if (!this.Planmgmt.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000005843' /* 평가팀을 선택해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }
      if (!this.Planmgmt.assessNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001318' /* 평가명을 입력해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }

      if (
        !this.Planmgmt.planmgmtDeptList ||
        this.Planmgmt.planmgmtDeptList.length <= 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000005841' /* 평가대상 작업을 한건이상 등록해주세요. */,
          type: 'warning', // success / info / warning / error
        });

        return;
      }

      if (flag === 'insert') {
        this.nextInsert();
      } else if (flag === 'update') {
        this.nextUpdate();
      } else {
        this.btnAppr();
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
              title: 'L0000003321', // 확인
              message: 'L0000005853', // 평가계획을 등록하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.nextInsertFlag = true;
                this.Planmgmt.assessStartDate = this.Planmgmt.tempAssessYear[0];
                this.Planmgmt.assessEndDate = this.Planmgmt.tempAssessYear[1];
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
                if (this.Planmgmt.internalList) {
                  this.$_.forEach(this.Planmgmt.internalList, (item) => {
                    if (item.teamType === 'RAT01') {
                      this.Planmgmt.assessLeaderId = item.raterId;
                    }
                  });
                }

                this.isInsert = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000881');
        });
    },

    nextUpdate() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'L0000005844', // 평가계획을 수정하시겠습니까?
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

                if (this.Planmgmt.internalList) {
                  this.$_.forEach(this.Planmgmt.internalList, (item) => {
                    if (item.teamType === 'RAT01') {
                      this.Planmgmt.assessLeaderId = item.raterId;
                    }
                  });
                }
                this.isEdit = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000881');
        });
    },
    btnApprClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'L0000005899', // 결재완료되었습니다.
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
      this.getDetail();
      this.deptReLoad = !this.deptReLoad;
      this.Planmgmt.assessNm = this.tempName;
      this.closePopup();
    },
    btnSaveClickedCallback2(result) {
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

      setTimeout(() => {
        this.deptReLoad = !this.deptReLoad;
      }, 300);
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

      setTimeout(() => {
        this.deptReLoad = !this.deptReLoad;
      }, 300);
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

      this.getDetail();

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

    btnAppr() {
      this.$validator.validateAll().then((_result) => {
        // TODO : 전역 성공 메시지 처리
        // 이벤트는 ./event.js 파일에 선언되어 있음
        // 조사내용, 조사결과검토 탭 부분에서 유효성검사를 실행하지 않아 소스 수정
        if (_result) {
          let tableNm = 'risk_assess_plan';
          let approvalCode = null;
          let tableKey = this.Planmgmt.assessPlanNo;
          let approvalType = '';
          if (this.Planmgmt.assessStepCd === 'STATE2') {
            // 작성중
            approvalType = 'PLAN_MGMT_RQST';
            approvalCode = this.Planmgmt.apprRqstCode;
          } else if (this.Planmgmt.assessStepCd === 'STATE3') {
            // 결재중
            approvalType = 'PLAN_MGMT_RQST';
            approvalCode = this.Planmgmt.apprRqstCode;
          }
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321',
            message: 'M0000000718', // 결재요청 전 저장됩니다. 진행하시겠습니까?
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

              // this.popupOptions.target = () =>
              // import(`${'@/pages/approval/approval.vue'}`);
              this.popupOptions.target = () =>
                import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
              this.popupOptions.title = 'L0000003418'; // 결재요청
              this.popupOptions.visible = true;
              this.popupOptions.closeCallback = this.closeApprPop;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                apprBizCd: 'RS-HP-01',
                apprParams: {
                  assessPlanNo: this.Planmgmt.assessPlanNo,
                },
              };
            },
          });
        } else if (!_result) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            // 필수항목작성이 누락되었습니다. 빨간색 BOX를 작성해주세요.
            message: this.$comm.getLangSpecInfoLabel('L0000005871'),
            type: 'warning', // success / info / warning / error
          });
          return;
        }
      });
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data) {
        this.getDetail();
        this.Planmgmt.assessNm = this.tempName;
      }
    },
    setAttachFileGrps() {
      let taskKey = this.Planmgmt.assessPlanNo
        ? this.Planmgmt.assessPlanNo
        : ''; // 현 모델 키 값

      this.attachFileGrps = [
        {
          label: 'L0000003030', // 파일업로드
          drag: this.editable,
          showFileSearch: false,
          editable: this.editable,
          disabled: !this.editable,
          uploadTempFiles: null,
          taskClassNm: 'RSA_PLANMGMT2', // 현 화면의 첨부파일 키 값
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
  },
  closeApprPop(data) {
    // 결재요청팝업 버튼 표시여부
    this.popupOptions.target = null;
    this.popupOptions.visible = false;
    this.getDetail();
    this.deptReLoad = !this.deptReLoad;
  },
};
</script>
