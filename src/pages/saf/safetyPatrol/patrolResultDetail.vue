<!--
  목적 : 순회결과 등록/상세
  Detail : 순회결과 등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 순회점검결과 상세 -->
            <y-label
              label="순회점검결과 상세"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 완료 -->
              <y-btn
                v-if="popupParam.safCheckRsltNo > 0 && !disabled && editable"
                title="L0000002039"
                color="black"
                @btnClicked="beforeComplete"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="!disabled && editable"
                :action-url="saveUrl"
                :param="checkPlanDetail"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="popupParam.safCheckRsltNo > 0 && !disabled && editable"
                color="red"
                title="L0000001495"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :disabled="disabled || popupParam.safCheckRsltNo > 0"
                :editable="editable"
                name="plantCd"
                v-model="checkPlanDetail.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 순회주관부서 -->
              <y-tree-dept
                label="L0000001721"
                :required="true"
                :disabled="disabled || popupParam.safCheckRsltNo > 0"
                :editable="editable"
                name="deptCd"
                :plantCd="checkPlanDetail.plantCd"
                v-model="checkPlanDetail.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검종류 상세 -->
              <y-select
                :width="8"
                :required="true"
                :comboItems="patrolTypeItems"
                :disabled="disabled || popupParam.safCheckRsltNo > 0"
                :editable="editable"
                itemText="safCheckKindNm"
                itemValue="safCheckKindNo"
                ui="bootstrap"
                name="safCheckKindNo"
                label="L0000003718"
                v-model="checkPlanDetail.safCheckKindNo"
                v-validate="'required'"
                :state="validateState('safCheckKindNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 순회일 -->
              <y-datepicker
                :width="8"
                :required="true"
                :disabled="disabled"
                :editable="editable"
                label="L0000001717"
                name="checkYmd"
                v-model="checkPlanDetail.checkYmd"
                v-validate="'required'"
                :state="validateState('checkYmd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <!-- 순회대상 -->
                  <y-select
                    :width="8"
                    :required="true"
                    :editable="editable"
                    :disabled="disabled"
                    :comboItems="targetItems"
                    itemText="codeNm"
                    itemValue="code"
                    ui="bootstrap"
                    name="tgtClsCd"
                    label="L0000001714"
                    v-model="checkPlanDetail.tgtClsCd"
                    v-validate="'required'"
                    :state="validateState('tgtClsCd')"
                  ></y-select>
                </b-col>
                <b-col
                  v-if="checkPlanDetail.tgtClsCd === 'ACTDP'"
                  sm="6"
                  md="6"
                  lg="6"
                  xl="6"
                  class="col-xxl-6"
                >
                  <y-tree-dept
                    :required="true"
                    label
                    name="tgtDeptCd"
                    :disabled="disabled"
                    :plantCd="checkPlanDetail.plantCd"
                    :editable="editable"
                    v-model="checkPlanDetail.tgtDeptCd"
                    v-validate="'required'"
                    :state="validateState('tgtDeptCd')"
                  />
                </b-col>
                <b-col
                  v-if="checkPlanDetail.tgtClsCd === 'ACTSC'"
                  sm="6"
                  md="6"
                  lg="6"
                  xl="6"
                  class="col-xxl-6"
                >
                  <y-text
                    :width="8"
                    :disabled="true"
                    :required="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="tgtVendorNm"
                    v-model="checkPlanDetail.tgtVendorNm"
                    :appendIcon="
                      disabled
                        ? null
                        : [{ icon: 'search', callbackName: 'searchVendor' }]
                    "
                    @searchVendor="searchVendor"
                    v-validate="'required'"
                    :state="validateState('tgtVendorNm')"
                  ></y-text>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 순회수행부서 -->
                  <y-tree-dept
                    :editable="editable"
                    :required="true"
                    label="순회수행부서"
                    name="pgpDeptCd"
                    :disabled="disabled"
                    :plantCd="checkPlanDetail.plantCd"
                    v-model="checkPlanDetail.pgpDeptCd"
                    v-validate="'required'"
                    :state="validateState('pgpDeptCd')"
                  />
                </b-col>
                <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
                  <!-- 순회명 -->
                  <y-text
                    :width="10"
                    :required="true"
                    :editable="editable"
                    :disabled="disabled"
                    ui="bootstrap"
                    name="checkTitle"
                    label="L0000001716"
                    v-model="checkPlanDetail.checkTitle"
                    v-validate="'required'"
                    :state="validateState('checkTitle')"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <el-tabs type="border-card" v-model="tabIndex">
      <el-tab-pane
        v-for="(item, i) in tabItems"
        :key="i"
        stretch
        class="default-tab-pane"
      >
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ item.title }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :disabled="disabled"
          :checkPlanDetail.sync="checkPlanDetail"
          :tabParam.sync="tabParam"
          :submitObject="submitObject"
          :attachFileGrps="safAttachFileGrps"
          :saveAttachFiles="safSaveAttachFiles"
          @changeUploadFiles="changeUploadFiles"
          @isEditMode="setBtnVisible"
        />
      </keep-alive>
    </el-tabs>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-patrol-result-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safCheckRsltNo: 0, // 순회결과번호
        checkStepCd: '',
        detailCheck: false,
      },
    },
  },
  data: () => ({
    // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
    //                즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
    tabItems: [],
    component: null,
    tabIndex: 0,
    checkPlanDetail: {
      safCheckRsltNo: 0, // 순회결과번호
      plantCd: '',
      safCheckKindNo: null, // 순회종류
      patrolMstNo: 0,
      checkStepCd: '', // 진행단계
      tgtClsCd: 'ACTDP',
      safCheckKindNm: '', // 순회종류
      checkYmd: '', // 순회일
      deptCd: '', // 순회주관부서
      tgtDeptCd: '', // 순회대상부서
      tgtVendorCd: '', // 순회대상업체
      tgtVendorNm: '',

      innerTeamData: [],
      outerTeamData: [],
      patrolInspectors: [],

      checkTitle: '', // 순회명
      checkResultCd: null, // 순회결과
      checkResult: '', // 순회결과요약
      patrolItems: [], // 순회항목별 결과
      createUserId: '',
      updateUserId: '',
    },
    // 개선조치를 위한 변수
    tabParam: {
      imprClassCd: 'ICL09',
      refTableId: 0,
      editable: true,
      detailCheck: false,
      message: 'M0000000075', // 즉시조치는 순회점검 등록 후 입력 가능합니다.
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: null,
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    targetItems: [],
    patrolTypeItems: [],
    disabled: false,
    editable: true,
    isSave: false,
    isComplete: false,
    searchDetailUrl: '',
    deleteUrl: '',
    saveUrl: '',
    actionType: 'POST',

    // 첨부파일 관련
    attach: null, // 첨부파일컴포넌트
    submitObject: {
      submitCheck: false,
    },
    safSaveAttachFiles: [],
    safAttachFileGrps: [],
  }),
  computed: {},
  watch: {
    tabIndex: function (newValue, oldValue) {
      this.loadComponent();
    },
    'checkPlanDetail.plantCd'() {
      this.getPatrolKindList();
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
    this.loadComponent();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.tabItems = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000405'),
          url: './patrolItemResult',
        }, // 결과
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002572'),
          url: './checkInspector',
        }, // '점검자'
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000259'),
          url: 'imprActTab',
        }, // '개선사항'
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002843'),
          url: 'multiFileUpload',
        }, // '첨부파일'
      ];
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchDetailUrl = selectConfig.saf.patrol.get.url;
      this.saveUrl = transactionConfig.saf.patrol.edit.url;

      this.tabParam.refTableId = this.popupParam.safCheckRsltNo
        ? this.popupParam.safCheckRsltNo
        : 0;

      this.$comm.getComboItems('SAF_ACTPART_CLS', false).then((_result) => {
        this.targetItems = _result;
      });
      this.getPatrolKindList();
      this.getDetail();
    },
    getDetail() {
      if (
        !this.popupParam.safCheckRsltNo ||
        this.popupParam.safCheckRsltNo === 0
      ) {
        // default로 자신의 사업장에 부서가 매핑 될 수 있도록 설정
        this.checkPlanDetail.checkYmd = this.$comm.getToday();
        this.tabParam.editable = false;
      } else {
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.popupParam.safCheckRsltNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.$_.extend(this.checkPlanDetail, _result.data);

            this.checkPlanDetail.patrolItems = [];
            this.checkPlanDetail.patrolInspectors = [];

            if (
              this.checkPlanDetail.patrolInspectors &&
              this.checkPlanDetail.patrolInspectors.length > 0
            ) {
              this.checkPlanDetail.innerTeamData = this.$_.filter(
                this.checkPlanDetail.patrolInspectors,
                { inspectorClassCd: 'CLS01' }
              );
              this.checkPlanDetail.outerTeamData = this.$_.filter(
                this.checkPlanDetail.patrolInspectors,
                { inspectorClassCd: 'CLS02' }
              );
            } else {
              this.checkPlanDetail.patrolInspectors = [];
            }

            this.setBtnVisible();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    setBtnVisible() {
      // 작성자, 점검주관부서 부서원, 점검자 부서 수정 가능
      if (
        (this.checkPlanDetail &&
          (this.checkPlanDetail.createUserId === this.$store.getters.token ||
            this.checkPlanDetail.deptCd === this.$store.getters.deptCd ||
            (this.checkPlanDetail.patrolInspectors.length > 0
              ? this.checkPlanDetail.patrolInspectors.filter(
                (d) => d.deptCd === this.$store.getters.deptCd
              ).length > 0
              : false))) ||
        this.$store.getters.userAuthGrps.filter(
          (auth) => String(auth.authGrpNo) === '1090' && auth.settingYn === 'Y'
        ).length > 0
      ) {
        if (this.checkPlanDetail.checkStepCd === 'CHS02') {
          this.tabParam.editable = true;
        } else {
          this.tabParam.editable = false;
          this.tabParam.detailCheck = true;
          this.disabled = true;
        }

        if (this.popupParam.detailCheck) {
          this.tabParam.editable = false;
          this.tabParam.detailCheck = true;
          this.disabled = true;
        }
      } else {
        this.tabParam.editable = false;
        this.tabParam.detailCheck = true;
        this.disabled = true;
      }

      this.setAttachFileGrp();
    },
    setAttachFileGrp() {
      let taskKey = this.popupParam.safCheckRsltNo
        ? this.popupParam.safCheckRsltNo.toString()
        : '';
      this.safAttachFileGrps = [
        {
          label: 'L0000003030', // 파일업로드',
          uploadTempFiles: null,
          taskClassNm: 'CHECK_RESULT',
          taskKey: taskKey,
          drag: !this.disabled,
          editable: this.editable,
          disabled: this.disabled,
          onlyDownload: this.disabled,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === 'imprActTab') {
        this.component = () => import('@/pages/impr/imprActTab');
      } else this.component = () => import(`${path}`);
    },
    getPatrolKindList() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        patrolYn: 'Y',
        chngKind: 'CKC04',
        plantCd: this.checkPlanDetail.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          this.patrolTypeItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeComplete() {
      if (
        this.checkPlanDetail.innerTeamData.length === 0 &&
        this.checkPlanDetail.outerTeamData.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000720', // 점검자가 입력되지 않았습니다.',
          type: 'warning', // success / info / warning / error
        });
      } else if (
        !this.checkPlanDetail.patrolItems ||
        this.checkPlanDetail.patrolItems.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000775', // 점검 결과가 입력되지 않았습니다.',
          type: 'warning', // success / info / warning / error
        });
      } else if (!this.checkPlanDetail.checkResult) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000076', // 순회결과요약을 입력해주세요.',
          type: 'warning', // success / info / warning / error
        });
      } else if (!this.checkPlanDetail.checkResultCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000077', // 순회결과를 입력해주세요.',
          type: 'warning', // success / info / warning / error
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000838', // 완료하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            this.isComplete = true;
            this.saveUrl = transactionConfig.saf.patrol.edit.url;
            this.actionType = 'PUT';
            this.saveCheckResult();
          },
          cancelCallback: () => {},
        });
      }
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSave() {
      if (this.popupParam.safCheckRsltNo > 0) {
        this.saveUrl = transactionConfig.saf.patrol.edit.url;
        this.actionType = 'PUT';
      } else {
        this.saveUrl = transactionConfig.saf.patrol.insert.url;
        this.actionType = 'POST';
      }
      this.saveCheckResult();
    },
    saveCheckResult() {
      this.$validator
        .validateAll()
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            if (!this.isComplete) {
              if (!this.checkPlanDetail.checkResult) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000076', // 회결과요약을 입력해주세요.',
                  type: 'warning', // success / info / warning / error
                });
                return;
              }
              if (!this.checkPlanDetail.checkResultCd) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000077', // 순회결과를 입력해주세요.',
                  type: 'warning', // success / info / warning / error
                });
                return;
              }

              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321', // 확인
                message: 'M0000000011', // 저장하시겠습니까?',
                // TODO : 필요시 추가하세요.
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.checkPlanDetail.createUserId = this.$store.getters.token;
                  this.checkPlanDetail.updateUserId = this.$store.getters.token;

                  if (this.checkPlanDetail.tgtClsCd === 'ACTDP') {
                    this.checkPlanDetail.tgtVendorNm = '';
                    this.checkPlanDetail.tgtVendorCd = '';
                  } else {
                    this.checkPlanDetail.tgtDeptCd = '';
                  }
                  this.checkPlanDetail.checkStepCd = 'CHS02';

                  this.checkPlanDetail.patrolInspectors = [];
                  this.$_.forEach(
                    this.checkPlanDetail.innerTeamData,
                    (item) => {
                      this.checkPlanDetail.patrolInspectors.push(item);
                    }
                  );
                  this.$_.forEach(
                    this.checkPlanDetail.outerTeamData,
                    (item) => {
                      this.checkPlanDetail.patrolInspectors.push(item);
                    }
                  );

                  this.isSave = true;
                },
                // 취소 callback 함수
                cancelCallback: () => {},
              });
            } else {
              this.checkPlanDetail.createUserId = this.$store.getters.token;
              this.checkPlanDetail.updateUserId = this.$store.getters.token;

              if (this.checkPlanDetail.tgtClsCd === 'ACTDP') {
                this.checkPlanDetail.tgtVendorNm = '';
                this.checkPlanDetail.tgtVendorCd = '';
              } else {
                this.checkPlanDetail.tgtDeptCd = '';
              }
              this.checkPlanDetail.checkStepCd = 'CHS04';

              this.checkPlanDetail.patrolInspectors = [];
              this.$_.forEach(this.checkPlanDetail.innerTeamData, (item) => {
                this.checkPlanDetail.patrolInspectors.push(item);
              });
              this.$_.forEach(this.checkPlanDetail.outerTeamData, (item) => {
                this.checkPlanDetail.patrolInspectors.push(item);
              });

              this.isSave = true;
            }
          } else if (!_result) {
            this.$popupRequired.check(
              'patrolResultDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.'
          );
          this.isSave = false;
        });
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인',
        message: 'M0000000012', // 삭제하시겠습니까?',
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            transactionConfig.saf.patrol.delete.url,
            this.popupParam.safCheckRsltNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // 삭제되었습니다.',
                type: 'success', // success / info / warning / error
              });
              this.closePopup(null);
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
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
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      this.isComplete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     *  수정 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      this.isSave = false;
      this.popupParam.safCheckRsltNo = this.$_.clone(_result.data);
      this.tabParam.refTableId = this.$_.clone(_result.data);
      this.tabParam.editable = true;
      this.tabParam.detailCheck = false;

      if (!this.isComplete) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000006', // 저장되었습니다.',
          type: 'success', // success / info / warning / error
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000078', // 완료되었습니다.',
          type: 'success', // success / info / warning / error
        });
        this.isComplete = false;
      }

      this.getDetail();
    },
    searchVendor() {
      if (!this.editable || this.disabled) return;
      this.popupOptions.target = () =>
        import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003246'; // 협력업체
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        vendorTypeCd: 'CVET1', // 공사업체
        plantCd: this.checkPlanDetail.plantCd,
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        this.checkPlanDetail.tgtVendorCd = data.data.vendorCd;
        this.checkPlanDetail.tgtVendorNm = data.data.vendorNm;
      }
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.safAttachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.safAttachFileGrps[index].uploadTempFiles = data;
        let saveIndex = this.$_.findIndex(this.safSaveAttachFiles, {
          taskClassNm: data.taskClassNm,
        });
        if (saveIndex > -1) {
          this.safSaveAttachFiles[saveIndex] = this.$_.clone(
            this.safAttachFileGrps[index]
          );
        } else {
          this.safSaveAttachFiles.push(
            this.$_.clone(this.safAttachFileGrps[index])
          );
        }
      }
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.safAttachFileGrps, (item) => {
        item.taskKey = this.popupParam.safCheckRsltNo;
      });

      if (this.safSaveAttachFiles.length > 0) {
        // 저장할 데이터가 있는 경우
        this.submitObject.submitCheck = !this.submitObject.submitCheck;
      }
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
