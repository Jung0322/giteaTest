<!--
  목적 : 안전점검결과 등록/상세
  Detail : 안전점검결과 등록/수정 화면
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
            <!-- 안전점검결과 상세 -->
            <y-label
              label="L0000001878"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  updateMode &&
                  editable &&
                  !popupParam.apprFlag &&
                  !apprMode &&
                  !popupParam.popupMode
                "
                color="black"
                title="L0000003418"
                @btnClicked="openAppr"
              />
              <!-- 결재요청회수
              <y-btn
                v-if="collectCheck && !popupParam.apprFlag"
                title="L0000003420"
                color="black"
                @btnClicked="btnCollectClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              /> -->
              <!-- 저장 -->
              <y-btn
                v-if="insertable && editable && !popupParam.popupMode"
                :action-url="insertUrl"
                :param="checkResultDetail"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="
                  updateMode &&
                  editable &&
                  !authDuringAppr &&
                  !popupParam.popupMode
                "
                :action-url="editUrl"
                :param="checkResultDetail"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="
                  !popupParam.flag &&
                  deleteable &&
                  editable &&
                  !authDuringAppr &&
                  !popupParam.popupMode
                "
                color="red"
                title="L0000001495"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn
                v-if="!popupParam.apprFlag"
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
                :editable="editable"
                :disabled="
                  disabled ||
                  !popupParam.flag ||
                  authDuringAppr ||
                  popupParam.popupMode
                "
                :required="true"
                name="plantCd"
                v-model="checkResultDetail.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검종류 상세 -->
              <y-select
                :width="8"
                :comboItems="comboCheckKindItems"
                :disabled="disabled || !popupParam.flag || authDuringAppr"
                :editable="editable"
                :required="true"
                itemText="safCheckKindNm"
                itemValue="safCheckKindNo"
                ui="bootstrap"
                name="safCheckKindNo"
                label="L0000003718"
                v-model="checkResultDetail.safCheckKindNo"
                v-validate="'required'"
                :state="validateState('safCheckKindNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검일 -->
              <y-datepicker
                :width="8"
                :required="true"
                :disabled="disabled || authDuringAppr || popupParam.popupMode"
                :editable="editable"
                label="L0000002570"
                name="checkYmd"
                :default="checkResultDetail.checkYmd"
                v-model="checkResultDetail.checkYmd"
                v-validate="'required'"
                :state="validateState('checkYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검예정일 -->
              <y-datepicker
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="disabled || authDuringAppr || popupParam.popupMode"
                ui="bootstrap"
                label="L0000002564"
                name="checkSchYmd"
                :default="checkResultDetail.checkSchYmd"
                v-model="checkResultDetail.checkSchYmd"
                v-validate="'required'"
                :state="validateState('checkSchYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검주관부서 -->
              <y-tree-dept
                label="L0000002578"
                :required="true"
                :editable="editable"
                :disabled="disabled || !popupParam.flag || authDuringAppr"
                :plantCd="checkResultDetail.plantCd"
                v-model="checkResultDetail.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검대상부서 -->
              <y-tree-dept
                :required="true"
                :editable="editable"
                :disabled="disabled || !popupParam.flag || authDuringAppr"
                label="L0000002549"
                :plantCd="checkResultDetail.plantCd"
                v-model="checkResultDetail.tgtDeptCd"
                v-validate="'required'"
                :state="validateState('tgtDeptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검수행부서 -->
              <y-tree-dept
                :required="true"
                :editable="editable"
                :disabled="disabled || !popupParam.flag || authDuringAppr"
                label="L0000004852"
                :plantCd="checkResultDetail.plantCd"
                v-model="checkResultDetail.pfmDeptCd"
                v-validate="'required'"
                :state="validateState('pfmDeptCd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 세부점검계획 -->
              <y-text
                :width="10"
                :maxlength="60"
                :required="true"
                :editable="editable"
                :disabled="disabled || authDuringAppr || popupParam.popupMode"
                ui="bootstrap"
                label="L0000001642"
                name="checkTitle"
                v-model="checkResultDetail.checkTitle"
                v-validate="'required'"
                :state="validateState('checkTitle')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 결과요약 -->
              <y-textarea
                :width="10"
                :maxlength="1200"
                :editable="editable"
                :disabled="disabled || authDuringAppr || popupParam.popupMode"
                :required="true"
                ui="bootstrap"
                label="L0000000413"
                name="checkResult"
                v-model="checkResultDetail.checkResult"
                v-validate="'required'"
                :state="validateState('checkResult')"
              ></y-textarea>
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
          {{ $comm.getLangSpecInfoLabel(item.title) }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :checkResultDetail.sync="checkResultDetail"
          :checkStepCd="popupParam.checkStepCd"
          :popupMode="popupParam.popupMode"
          :tabParam.sync="tabParam"
          :authDuringAppr.sync="authDuringAppr"
          :submitCheck="safSubmitCheck"
          :attachFileGrps="safAttachFileGrps"
          :saveAttachFiles="safSaveAttachFiles"
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
          @closePopup="closePopup2"
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
  name: 'y-check-result-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safCheckScheduleNo: 0, // 안전점검일정 일련번호
        checkStepCd: '', // 점검자에서 단계를 보는데 상세조회후 단계를 점검자로 넘기게 되면 깜빡임이 존재함으로 추가
        bizApprStepCd: '', // 결재진행상태
        apprFlag: false, // 결재여부
        apprRqstNo: 0, // 결재 번호
        flag: true, // 수정인지 등록인지 판단
        isSearch: false,
        copyDataKey: 0, // 점검결과 복사등록인지 판단
        noPlanPopup: false,
      },
    },
  },
  data: () => ({
    // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
    //                즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
    tabItems: [
      { title: 'L0000000405', url: './checkItemResult' }, // 결과
      { title: 'L0000002572', url: './checkInspector' }, // 점검자
      { title: 'L0000000259', url: 'imprActTab' }, // 개선사항
      { title: 'L0000002843', url: 'multiFileUpload' }, // 첨부파일
    ],
    component: null,
    tabIndex: 0,
    checkResultDetail: {
      safCheckNo: 0, // 안전점검마스터 일련번호
      safCheckScheduleNo: 0, // 안전점검일정 일련번호
      checkYmd: '', // 점검일
      tgtDeptCd: null, // 대상부서코드
      deptCd: null, // 주관부서코드
      pfmDeptCd: null, // 수행부서코드
      checkSchYmd: '',
      safCheckKindNo: null,
      checkTitle: '',
      checkOrgCd: '',
      checkStepCd: '',
      checkItemResults: [],
      innerTeamData: [],
      outerTeamData: [],
      checkInspectors: [],
      checkResult: null,
      isComplete: 0,
      isResult: 0,
      createUserId: '',
      updateUserId: '',
      plantCd: null, // 사업장 코드
      checkResultCd: '', // 점검결과코드
      checkPlanFlag: false, // 탭에 정보 조회 후 등록/수정 판단용 flag
      apprRqstNo: 0, // 결재 번호
    },
    // 개선조치를 위한 변수
    tabParam: {
      imprClassCd: '',
      refTableId: 0,
      editable: true,
      message: 'M0000000707',
    },
    // 개선사항 입력은 안전점검결과 등록후 입력 가능합니다.
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '500px',
      top: '50px',
      param: {},
      closeCallback: null,
    },
    disabled: false,
    // saveBtnTitile: '수정',
    insertable: false,
    editable: false,
    updateMode: false,
    deleteable: false,
    completeable: false,
    isInsert: false,
    isEdit: false,
    isComplete: false,
    comboCheckKindItems: [], // 점검종류
    comboCheckOrgItems: [], // 점검기관
    deleteUrl: '',
    editUrl: '',
    insertUrl: '',
    completeUrl: '',
    selectUrl: '',
    apprMode: false,
    authDuringAppr: false,
    // 첨부파일 관련
    attach: null, // 첨부파일컴포넌트
    safSubmitCheck: false,
    safSaveAttachFiles: [],
    safTempDeleteFiles: [],
    safAttachFileGrps: [],
    collectCheck: false,
    collectUrl: '',
  }),
  watch: {
    tabIndex: function (newValue, oldValue) {
      this.loadComponent();
    },
    'checkResultDetail.plantCd'() {
      this.getComboCheckKindItems();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.loadComponent();
    this.editable = this.$route.meta.editable;
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    apprSave() {
      return new Promise((resolve) => {
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              this.checkResultDetail.createUserId = this.$store.getters.token;
              this.checkResultDetail.updateUserId = this.$store.getters.token;
              this.checkResultDetail.checkStepCd = 'CHS03';
              this.checkResultDetail.checkInspectors = [];
              this.$_.forEach(this.checkResultDetail.innerTeamData, (item) => {
                this.checkResultDetail.checkInspectors.push(item);
              });
              this.$_.forEach(this.checkResultDetail.outerTeamData, (item) => {
                this.checkResultDetail.checkInspectors.push(item);
              });
              this.checkResultDetail.isComplete = 0;
              this.checkResultDetail.isResult = !this.popupParam.flag ? 1 : 0;
              this.isEdit = true;
            } else if (!_result) {
              this.$popupRequired.check(
                'checkResultDetail',
                this.$data,
                this.errors
              );
              resolve('validationError');
              return;
            }
          })
          .catch(() => {
            resolve(false);
            return;
          });
        // 유효성검증 통과 이후 로직
        this.$http.url = this.editUrl;
        this.$http.param = this.checkResultDetail;
        this.$http.type = 'PUT';

        this.$http.request(
          (_result) => {
            this.checkResultDetail.safCheckScheduleNo =
              _result.data.safCheckScheduleNo;
            this.popupParam.safCheckScheduleNo =
              _result.data.safCheckScheduleNo;
            this.checkResultDetail.safCheckNo = _result.data.safCheckNo;

            this.popupParam.flag = false;

            this.isEdit = false;
            this.updateMode = true;
            this.insertable = false;
            this.deleteable = true;
            this.apprMode = false;
            this.saveAttach();
            resolve(true);
          },
          (_error) => {
            resolve(false);
          }
        );
      });
    },
    init() {
      // Url Setting
      this.editUrl = transactionConfig.saf.checkResult.edit.url;
      this.insertUrl = transactionConfig.saf.checkResult.insert.url;
      this.completeUrl = transactionConfig.saf.checkResult.complete.url;
      this.selectUrl = selectConfig.saf.checkPlan.get.url;
      this.collectUrl = transactionConfig.manage.appr.collect.url;

      this.checkResultDetail.safCheckScheduleNo =
        this.popupParam.safCheckScheduleNo;
      // this.checkResultDetail.checkStepCd = this.popupParam.checkStepCd;

      this.getComboCheckKindItems(); // 점검종류

      if (this.popupParam.flag) {
        // this.saveBtnTitile = '신규등록';
        this.checkResultDetail.checkYmd = this.$comm.getToday();
        this.tabParam.imprClassCd = 'ICL03';
        this.tabParam.refTableId = 0;
        this.tabParam.editable = false;
        this.tabParam.detailCheck = true;
        this.setBtnVisible();

        if (this.popupParam.copyDataKey) {
          this.getCopyData();
        }
      } else {
        setTimeout(() => {
          this.getDetail();
        }, 400);
      }

      this.setAttachFileGrp(); // 첨부파일 셋팅
      this.getApprDetail();
    },
    getApprDetail() {
      if (!this.popupParam.apprRqstNo || this.popupParam.apprRqstNo <= 0) {
        return;
      }
      this.$http.url = this.$format(
        selectConfig.manage.appr.authCheck.url,
        this.popupParam.apprRqstNo,
        this.$store.getters.token
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.authDuringAppr = _result.data;
          this.tabParam.authDuringAppr = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
    getDetail() {
      this.$http.url = this.$format(
        this.selectUrl,
        this.checkResultDetail.safCheckScheduleNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.$_.extend(this.checkResultDetail, _result.data);
          this.getCollectable();
          this.tabParam.imprClassCd = 'ICL03';
          this.tabParam.refTableId = this.checkResultDetail.safCheckScheduleNo;
          this.checkResultDetail.checkYmd = this.checkResultDetail.checkYmd
            ? this.checkResultDetail.checkYmd
            : this.checkResultDetail.checkSchYmd;
          this.setBtnVisible();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getCollectable() {
      if (
        !this.checkResultDetail.rapprRqstNo ||
        this.checkResultDetail.rapprRqstNo <= 0
      ) {
        return;
      }
      this.$http.url = this.$format(
        selectConfig.manage.appr.getCollect.url,
        this.checkResultDetail.rapprRqstNo,
        this.$store.getters.token
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.collectCheck = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnCollectClickedCallback() {
      if (this.collectCheck) {
        this.$http.url = this.$format(
          this.collectUrl,
          this.checkResultDetail.rapprRqstNo
        );
        this.$http.type = 'PUT';
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000507',
              // 회수되었습니다.
              type: 'success', // success / info / warning / error
            });
            this.closePopup();
          },
          (_error) => {
            this.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000506',
          // 이미 결재된 문서입니다.
          type: 'warning', // success / info / warning / error
        });
        this.closePopup();
      }
    },
    getCopyData() {
      this.$http.url = this.$format(
        this.selectUrl,
        this.popupParam.copyDataKey
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.$_.extend(this.checkResultDetail, _result.data);
          this.checkResultDetail.rapprRqstNo = 0;
          this.checkResultDetail.checkYmd = this.$comm.getToday();
          this.checkResultDetail.checkSchYmd = '';
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setBtnVisible() {
      if (this.checkResultDetail.safCheckScheduleNo > 0) {
        if (this.checkResultDetail.checkStepCd === 'CHS00') {
          // 일정수립
          this.tabParam.editable = false;
          this.tabParam.detailCheck = true;
          this.insertable = false;
          this.updateMode = false;
          this.deleteable = false;
          this.completeable = false;
          this.disabled = true;
          this.checkResultDetail.checkPlanFlag = true;
        } else if (this.checkResultDetail.checkStepCd === 'CHS01') {
          // 계획
          this.tabParam.editable = false;
          this.tabParam.detailCheck = true;
          this.insertable = false;
          this.updateMode = false;
          this.deleteable = false;
          this.completeable = false;
          this.disabled = true;
          this.checkResultDetail.checkPlanFlag = true;
        } else if (
          this.checkResultDetail.checkStepCd === 'CHS02' ||
          this.checkResultDetail.checkStepCd === 'CHS03'
        ) {
          // 계획완료, 결과등록중
          this.tabParam.editable = true;
          this.tabParam.detailCheck = false;
          this.insertable = false;
          this.updateMode = true;
          this.deleteable = true;
          this.completeable = true;
          this.disabled = false;
          this.checkResultDetail.checkPlanFlag = false;
          // } else if (this.checkResultDetail.checkStepCd === 'CHS03') {
          //   // 조치진행중
          //   this.tabParam.editable = false;
          //   this.tabParam.detailCheck = true;
          //   this.insertable = false;
          //   this.updateMode = false;
          //   this.deleteable = false;
          //   this.completeable = true;
          //   this.disabled = true;
          //   this.checkResultDetail.checkPlanFlag = false;
        } else if (this.checkResultDetail.checkStepCd === 'CHS04') {
          // 완료
          this.tabParam.editable = false;
          this.tabParam.detailCheck = true;
          this.insertable = false;
          this.updateMode = false;
          this.deleteable = false;
          this.completeable = false;
          this.disabled = true;
          this.checkResultDetail.checkPlanFlag = true;
        }
      } else {
        this.insertable = true;
        this.updateMode = false;
        this.deleteable = false;
        this.completeable = false;
        this.disabled = false;
        this.checkResultDetail.checkPlanFlag = false;
      }

      if (!this.$_.isNil(this.popupParam.bizApprStepCd)) {
        this.apprMode = true;
        this.tabParam.editable = false;
        this.tabParam.detailCheck = true;
        if (this.popupParam.bizApprStepCd === 'BAPSD') {
          // 반려일땐 수정, 삭제 가능
          this.updateMode = true;
          this.deleteable = true;
          this.disabled = false;
          this.checkResultDetail.checkPlanFlag = false;
        } else {
          this.updateMode = false;
          this.deleteable = false;
          this.disabled = true;
          this.checkResultDetail.checkPlanFlag = true;
        }
      }
      if (this.popupParam.isSearch) {
        this.tabParam.editable = false;
        this.tabParam.detailCheck = true;
        this.insertable = false;
        this.updateMode = false;
        this.deleteable = false;
        this.completeable = false;
        this.disabled = true;
        this.checkResultDetail.checkPlanFlag = true;
      }
      this.setAttachFileGrp();
    },
    /**
     * 점검종류 조회
     */
    getComboCheckKindItems() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        planUseYn: 'Y',
        useYn: 'Y',
        plantCd: this.checkResultDetail.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.comboCheckKindItems = this.$_.clone(_result.data);
          this.comboCheckKindItems.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    saveCheckResult(completeable, alertTitle) {
      this.$validator
        .validateAll()
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: alertTitle,
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.checkResultDetail.createUserId = this.$store.getters.token;
                this.checkResultDetail.updateUserId = this.$store.getters.token;
                this.checkResultDetail.checkStepCd = 'CHS03';
                this.checkResultDetail.checkInspectors = [];
                this.$_.forEach(
                  this.checkResultDetail.innerTeamData,
                  (item) => {
                    this.checkResultDetail.checkInspectors.push(item);
                  }
                );
                this.$_.forEach(
                  this.checkResultDetail.outerTeamData,
                  (item) => {
                    this.checkResultDetail.checkInspectors.push(item);
                  }
                );
                this.checkResultDetail.isComplete = completeable;
                this.checkResultDetail.isResult = !this.popupParam.flag ? 1 : 0;

                if (completeable > 0) this.isComplete = true;
                else this.isEdit = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {
                if (completeable > 0) this.isComplete = false;
                else this.isEdit = false;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'checkResultDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
          if (completeable > 0) this.isComplete = false;
          else this.isEdit = false;
        });
    },
    beforeComplete() {
      this.saveCheckResult(1, 'M0000000838'); // 완료하시겠습니까?
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeEdit() {
      this.saveCheckResult(0, 'M0000000011'); // 저장하시겠습니까?
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
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    closePopup2(data) {},
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** button 관련 이벤트 **/
    /**
     *  수정 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      this.checkResultDetail.safCheckScheduleNo =
        _result.data.safCheckScheduleNo;
      this.popupParam.safCheckScheduleNo = _result.data.safCheckScheduleNo;
      this.checkResultDetail.safCheckNo = _result.data.safCheckNo;

      this.popupParam.flag = false;

      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      // this.saveBtnTitile = '수정';
      this.isEdit = false;
      this.updateMode = true;
      this.insertable = false;
      this.deleteable = true;
      this.apprMode = false;
      this.saveAttach();
    },
    /**
     * 안전점검결과 삭제
     *  삭제 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            transactionConfig.saf.checkResult.delete.url,
            this.checkResultDetail.safCheckNo,
            this.checkResultDetail.safCheckScheduleNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000007', // 삭제되었습니다.
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
    btnCompleteClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000078', // 완료되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isComplete = false;

      this.updateMode = false;
      this.deleteable = false;
      this.completeable = false;

      if (this.uploadFiles.data.length === 0) {
        this.saveAttach();
      }
    },
    openAppr() {
      this.$validator
        .validateAll()
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            // 결재팝업 호출
            this.popupOptions.target = () =>
              import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
            this.popupOptions.title = 'L0000003418'; // 결재요청
            this.popupOptions.visible = true;
            this.popupOptions.closeCallback = this.closeApprPop;
            this.popupOptions.width = '80%';
            this.popupOptions.param = {
              apprBizCd: 'SA-CE-03',
              apprParams: {
                safCheckScheduleNo: this.checkResultDetail.safCheckScheduleNo,
              },
            };
          } else if (!_result) {
            this.$popupRequired.check(
              'checkResultDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876'
            // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.resultFlag) {
        this.tabParam.editable = false;
        this.tabParam.detailCheck = true;

        this.apprMode = true;
        this.insertable = false;
        this.updateMode = false;
        this.deleteable = false;
        this.disabled = true;
        this.collectCheck = true;
        this.checkResultDetail.rapprRqstNo = data.apprRqstNo;
        this.checkResultDetail.checkPlanFlag = true;
        this.setAttachFileGrp();
      }
    },
    setAttachFileGrp() {
      let taskKey = this.checkResultDetail.safCheckScheduleNo
        ? this.checkResultDetail.safCheckScheduleNo.toString()
        : '';
      this.safAttachFileGrps = [
        {
          label: 'L0000003030', // 파일업로드
          uploadTempFiles: null,
          taskClassNm: 'CHECK_RESULT',
          taskKey: taskKey,
          drag: false,
          editable: this.editable && !this.authDuringAppr,
          disabled: this.disabled || this.authDuringAppr,
          showFileSearch: !this.disabled && !this.authDuringAppr,
          onlyDownload: this.disabled,
          createUserId: this.$store.getters.token,
        },
      ];
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
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.safTempDeleteFiles.push(pushData);
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.safAttachFileGrps, (item) => {
        item.taskKey = this.checkResultDetail.safCheckScheduleNo;
      });
      if (this.safTempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.safTempDeleteFiles)),
        };
        this.$http.request((_result) => {
          this.safTempDeleteFiles = [];
          this.getDetail();
          if (this.safSaveAttachFiles.length > 0) {
            // 저장할 데이터가 있는 경우
            this.safSubmitCheck = !this.safSubmitCheck;
          } else {
            // 저장할 데이터가 없는 경우
            this.submitCheck = !this.submitCheck;
          }
        });
      } else {
        this.getDetail();
        if (this.safSaveAttachFiles.length > 0) {
          // 저장할 데이터가 있는 경우
          this.safSubmitCheck = !this.safSubmitCheck;
        } else {
          // 저장할 데이터가 없는 경우
          this.submitCheck = !this.submitCheck;
        }
      }
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
