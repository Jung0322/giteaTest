<!--
  목적 : 평가계획 수립 - 평가계획 수립 관리
  Detail : 평가계획 등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 마스터 정보 -->
    <b-row
      v-if="popupParam.assessStepCd === 'A' || popupParam.assessStepCd === 'C'"
    >
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 평가계획 -->
            <y-label
              label="L0000003051"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <!-- 평가기법 -->
              <y-label label="L0000003416" />
              <y-label :label="riskAssessPlan.assessTypeNm" :fieldable="true" />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <!-- 메트릭스명 -->
              <y-label label="L0000003419" />
              <y-label
                :label="riskAssessPlan.assessTypeChecks"
                :fieldable="true"
              />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <!-- 평가명 -->
              <y-label label="L0000003081" />
              <y-label :label="riskAssessPlan.assessNm" :fieldable="true" />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <!-- 평가기간 -->
              <y-label label="L0000003062" />
              <y-label :label="riskAssessPlan.assessPeriod" :fieldable="true" />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <!-- 정기/수시 -->
              <y-label label="L0000002596" />
              <y-label :label="riskAssessPlan.regRegdemNm" :fieldable="true" />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <!-- 등록 -->
    <b-row v-else ref="editBox">
      <b-col sm="12">
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
                v-if="
                  popupParam.assessStepCd === 'P' &&
                  editable &&
                  updateMode &&
                  !popupParam.apprFlag
                "
                title="L0000003418"
                color="black"
                @btnClicked="beforeConfirm"
              />
              <!-- 결재요청회수 -->
              <y-btn
                v-if="collectCheck && !popupParam.apprFlag"
                title="L0000003420"
                color="black"
                @btnClicked="btnCollectClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="
                  editable && !updateMode && editableInput && !authDuringAppr
                "
                :action-url="insertUrl"
                :param="riskAssessPlan"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="
                  updateMode && editable && editableInput && !authDuringAppr
                "
                :action-url="editUrl"
                :param="riskAssessPlan"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeSubmit"
                @btnClicked="btnSaveClickedCallback"
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
                :editable="editable"
                :disabled="updateMode || authDuringAppr || !editableInput"
                :required="true"
                type="edit"
                name="plantCd"
                v-model="riskAssessPlan.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 위험Matrix명 -->
              <y-select
                :width="8"
                :comboItems="comboAssessTypeSaveItems"
                :disabled="!editableInput || authDuringAppr"
                :required="true"
                :editable="editable"
                itemText="assessNm"
                itemValue="assessTypeNo"
                ui="bootstrap"
                name="assessTypeNo"
                label="L0000002120"
                v-model="riskAssessPlan.assessTypeNo"
                v-validate="'required'"
                :state="validateState('assessTypeNo')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 평가기간 -->
              <y-datepicker
                :width="8"
                :disabled="!editableInput || authDuringAppr"
                :editable="editable"
                label="L0000003062"
                name="assessPriod"
                :required="true"
                :range="true"
                :default="riskAssessPlan.assessPriod"
                v-model="riskAssessPlan.assessPriod"
                v-validate="'required'"
                :state="validateState('assessPriod')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 담당자 -->
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000004201"
                name="userNm"
                v-model="riskAssessPlan.userNm"
                :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                @searchUser="btnSearchUserClicked"
                v-validate="'required'"
                :state="validateState('userNm')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 평가명 -->
              <y-text
                :width="10"
                :maxlength="30"
                :disabled="!editableInput || authDuringAppr"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                name="assessNm"
                label="L0000003081"
                v-model="riskAssessPlan.assessNm"
                v-validate="'required'"
                :state="validateState('assessNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 정기/수시 -->
              <y-select
                :width="8"
                :disabled="!editableInput || authDuringAppr"
                :required="true"
                :comboItems="comboRegRegdemSaveItems"
                :editable="editable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="regRegdem"
                label="L0000002596"
                v-model="riskAssessPlan.regRegdem"
                v-validate="'required'"
                :state="validateState('regRegdem')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 상세내용 -->
              <y-textarea
                :width="10"
                :maxlength="150"
                :disabled="!editableInput || authDuringAppr"
                :editable="editable"
                ui="bootstrap"
                name="assessDesc"
                label="L0000001528"
                v-model="riskAssessPlan.assessDesc"
              />
            </b-col>
          </b-row>
          <div class="float-right mt-3">
            <!--
            <div slot="buttonGroup" class="float-right mb-1">
    
              <y-btn
                v-if="
                  editable && !updateMode && editableInput && !authDuringAppr
                "
                :action-url="insertUrl"
                :param="riskAssessPlan"
                :is-submit="isInsert"
                title="L0000003056"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="
                  updateMode && editable && editableInput && !authDuringAppr
                "
                :action-url="editUrl"
                :param="riskAssessPlan"
                :is-submit="isEdit"
                title="L0000003056"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeSubmit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>-->
          </div>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3 mb-2">
      <b-col sm="12">
        <el-tag size="medium" type="info">
          <!-- 평가계획이 등록 되면 대상공정과 평가대상 작업을 입력할 수 있습니다. -->
          <i class="el-icon-info"></i>
          {{ $comm.getLangSpecInfoLabel('L0000003057') }}
        </el-tag>
      </b-col>
    </b-row>
    <el-tabs type="border-card" v-model="tabIndex" @tab-click="tabClick">
      <el-tab-pane
        v-for="(item, i) in tabItems"
        :key="i"
        stretch
        class="default-tab-pane"
        :name="i.toString()"
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
          :assessPlanNo.sync="popupParam.assessPlanNo"
          :plantCd.sync="riskAssessPlan.plantCd"
          :createDeptCd.sync="riskAssessPlan.createDeptCd"
          :updateModeParent="updateMode"
          :editableInput="editableInput"
          :tabIndex="tabIndexParam"
          :authDuringAppr="authDuringAppr"
          @apprCheck="apprCheck"
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
  name: 'y-assess-plan-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        assessPlanNo: 0, // key
        assessStepCd: '',
        plantCd: '',
        apprFlag: false,
        apprRqstNo: 0,
      },
    },
  },
  data: () => ({
    riskAssessPlan: {
      plantCd: '', // 사업장코드
      assessPlanNo: '', // key
      assessNm: '', // 평가명
      assessTypeNm: '', // 평가기법
      userId: '', // 담당자 ID
      userNm: '', // 담당자
      assessTypeChecks: '',
      regRegdemNm: '', // 정시/수기 명
      assessPeriod: '', // 평가 기간
      apprValidation: 0,

      assessTypeNo: null,
      assessTypeNos: [], // 평가유형
      regRegdem: null, // 정시/수기
      assessPriod: [], // 평가 기간
      assessStartDate: '', // 평가 시작일
      assessEndDate: '', // 평가 종료일
      assessDesc: '', // 상세내용
      assessTypeCd: null,
      createDeptCd: '',
      createUserId: '',
      updateUserId: '',
      assessGroupCd: null, // 위험성평가 분류
      papprRqstNo: 0,
      assessNode: null,
      variables: [],
    },
    tabItems: [
      { title: 'L0000000919', url: './riskAssessDept' }, // 대상공정
      { title: 'L0000003071', url: './deptAssessJob' }, // 평가대상 작업
    ],
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
    editableInput: true,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    tabIndexParam: '',
    component: null,
    comboRegRegdemSaveItems: [], // 정기/수기 (저장시)
    comboAssessTypeSaveItems: [], // 평가유형 (저장시)
    tabIndex: '1',
    searchUrl: '',
    insertUrl: '',
    editUrl: '',
    authDuringAppr: false,
    collectCheck: false,
    collectUrl: '',
  }),
  watch: {
    tabIndex: function (newValue, oldValue) {
      setTimeout(() => {
        this.loadComponent();
      }, 500);
      
    },
    'riskAssessPlan.plantCd'() {
      // 사업장 정보가 바뀌게 되면 위험Matirx명은 해당 사업장의 정보로 가져와야 함
      this.getComboAssessTypeItems(); // 평가유형
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.editable = this.$route.meta.editable;
    //
  },
  mounted() {
    this.init();
    this.loadComponent();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // 사업장 정보 세팅
      this.riskAssessPlan.plantCd = this.$store.getters.plantCd;
      this.editUrl = transactionConfig.rsa.assessPlan.edit.url;
      this.insertUrl = transactionConfig.rsa.assessPlan.insert.url;
      this.searchUrl = selectConfig.rsa.assessPlan.list.url;
      this.collectUrl = transactionConfig.manage.appr.collect.url;

      this.getDetail(); // 평가계획 상세 조회

      this.$comm.getComboItems('RSA_REG_REGDEM', false).then((_result) => {
        this.comboRegRegdemSaveItems = _result;
      });
      this.getComboAssessTypeItems(); // 평가유형
      this.getApprTaskList();
    },
    /**
     * 자식 페이지에 넘길 paneName 정보 업데이트
     * tab 클릭시 마다
     * tab : 클릭한 tab 정보
     */
    tabClick(tab) {
      var nowDate = new Date();
      this.tabIndexParam = nowDate.getMilliseconds();
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      this.component = () => import(`${path}`);
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
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
    /**
     * 평가유형 조회
     */
    getComboAssessTypeItems() {
      this.$http.url = selectConfig.rsa.assessType.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.riskAssessPlan.plantCd,
        assessGroupCd: 'AK002',
        assessTypeCd: 'AT002',
      };
      this.$http.request(
        (_result) => {
          this.comboAssessTypeSaveItems = this.$_.clone(_result.data);
          this.comboAssessTypeSaveItems.splice(0, 0, {
            assessTypeNo: null,
            assessNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getCollectable() {
      if (
        !this.riskAssessPlan.papprRqstNo ||
        this.riskAssessPlan.papprRqstNo <= 0
      ) {
        return;
      }
      this.$http.url = this.$format(
        selectConfig.manage.appr.getCollect.url,
        this.riskAssessPlan.papprRqstNo,
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
          this.riskAssessPlan.papprRqstNo
        );
        this.$http.type = 'PUT';

        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000507', // 회수되었습니다.
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
          message: 'M0000000506', // 이미 결재된 문서입니다.
          type: 'warning', // success / info / warning / error
        });
        this.closePopup();
      }
    },
    /** 위험성 평가계획 수립 상세 검색 **/
    getDetail() {
      if (!this.popupParam.assessPlanNo || this.popupParam.assessPlanNo === 0) {
        this.riskAssessPlan.assessGroupCd = 'AK002';
        this.riskAssessPlan.assessTypeCd = 'AT002';
        return;
      }
      this.$http.url = this.$format(
        selectConfig.rsa.assessPlan.get.url,
        this.popupParam.assessPlanNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.getApprDetail();
          this.updateMode = true;
          this.assessTypeSaveNos = [];

          this.$_.extend(this.riskAssessPlan, _result.data);
          // this.riskAssessPlan = this.$_.clone(_result.data);
          // alert(this.riskAssessPlan.assessStartDate);
          // alert(this.riskAssessPlan.assessEndDate);
          // this.$forceUpdate();
          this.getCollectable();
          this.setMode();
          this.riskAssessPlan.assessPriod = [
            this.riskAssessPlan.assessStartDate,
            this.riskAssessPlan.assessEndDate,
          ];
          this.tabIndex = '0'
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setMode() {
      if (!this.popupParam.apprFlag) {
        // 결재요청 팝업으로 들어온 경우가 아닌 경우
        if (this.riskAssessPlan.assessStepCd === 'P') {
          this.updateMode = true;
          this.editableInput = true;
        } else {
          this.updateMode = false;
          this.editableInput = false;
        }
        if (
          !(
            this.riskAssessPlan.bizApprStepCd === 'BAPSG' ||
            this.riskAssessPlan.bizApprStepCd === 'BAPSD' ||
            !this.riskAssessPlan.bizApprStepCd
          )
        ) {
          this.updateMode = false;
          this.editableInput = false;
        }
      } else {
        // 결재요청 팝업으로 들어온 경우
        if (this.riskAssessPlan.assessStepCd !== 'P') {
          this.updateMode = false;
          this.editableInput = false;
        } else {
          this.updateMode = true;
          this.editableInput = true;
        }
      }
    },
    checkName(flag) {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {};
      this.$http.request(
        (_result) => {
          var assessNms = this.$_.map(this.$_.clone(_result.data), 'assessNm');
          var index = this.$_.indexOf(assessNms, this.riskAssessPlan.assessNm);

          // 수정일때
          if (flag === 'edit') {
            if (
              index > -1 &&
              _result.data[index].assessPlanNo !==
                this.riskAssessPlan.assessPlanNo
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000089',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
          }
          // 등록일때
          else {
            if (index > -1) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000089', // 이미 같은 이름의 평가명이 존재합니다.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
          }
          // 빈 배열이 담겨있어서 vee-validator의 유효성검증을 통과해버려서 null로 할당함
          if (
            this.riskAssessPlan.assessPriod.length === 0 ||
            this.riskAssessPlan.assessPriod[0] === null
          ) {
            this.riskAssessPlan.assessPriod = null;
          }
          this.$validator
            .validateAll()
            .then((_result) => {
              // TODO : 전역 성공 메시지 처리
              // 이벤트는 ./event.js 파일에 선언되어 있음
              if (_result) {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321',
                  message: 'M0000000011', // 저장하시겠습니까?
                  // TODO : 필요시 추가하세요.
                  type: 'info', // success / info / warning / error
                  // 확인 callback 함수
                  confirmCallback: () => {
                    this.riskAssessPlan.assessStartDate =
                      this.riskAssessPlan.assessPriod[0];
                    this.riskAssessPlan.assessEndDate =
                      this.riskAssessPlan.assessPriod[1];

                    if (flag === 'edit') {
                      this.riskAssessPlan.updateUserId =
                        this.$store.getters.token;
                      this.isEdit = true;
                    } else {
                      this.riskAssessPlan.createUserId =
                        this.$store.getters.token;
                      this.isInsert = true;
                    }
                  },
                  // 취소 callback 함수
                  cancelCallback: () => {
                    this.isEdit = false;
                    this.isInsert = false;
                  },
                });
              } else if (!_result) {
                this.$popupRequired.check(
                  'assessPlanDetail',
                  this.$data,
                  this.errors
                );
              }
            })
            .catch(() => {
              window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
              this.isEdit = false;
              this.isInsert = false;
            });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeInsert() {
      this.checkName('insert');
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSubmit() {
      this.checkName('edit');
    },
    beforeConfirm() {
      // 평가대상 작업이 없다면 결재를 할 수 없다
      if (this.riskAssessPlan.apprValidation > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321',
          message: 'M0000000718',
          // 결재요청 전 저장됩니다. 진행하시겠습니까?
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            this.riskAssessPlan.createUserId = this.$store.getters.token;
            this.riskAssessPlan.updateUserId = this.$store.getters.token;
            this.$http.url = this.editUrl;
            this.$http.type = 'PUT';
            this.$http.param = this.riskAssessPlan;
            this.$http.request(
              (_result) => {
                this.popupOptions.target = () =>
                  import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
                this.popupOptions.title = 'L0000003418'; // 결재요청
                this.popupOptions.visible = true;
                this.popupOptions.closeCallback = this.closeApprPop;
                this.popupOptions.width = '80%';
                this.popupOptions.param = {
                  apprBizCd: 'RS-EV-01',
                  apprParams: {
                    assessPlanNo: this.riskAssessPlan.assessPlanNo,
                  },
                };
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000642',
          // 평가대상작업이 있어야 결재요청가능합니다.
          type: 'warning', // success / info / warning / error
        });
      }
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
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
    btnSearchUserClicked() {
      if ((!this.editableInput && !this.editable) || this.authDuringAppr) {
        return;
      }
      this.popupOptions.target = () =>
        import(`${'../../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.riskAssessPlan.plantCd,
      };
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
        this.riskAssessPlan.userId = data.user.userId;
        this.riskAssessPlan.userNm = data.user.userNm;
      }
    },
    /** button 관련 이벤트 **/
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    /**
     * 평가계획   목록 조회
     *  수정 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      this.getDetail();
    },
    /**
     * 평가계획   목록 조회 및 수정 버튼 보이도록 처리
     *  신규등록 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.updateMode = true;
      this.popupParam.assessStepCd = 'P';
      this.popupParam.assessPlanNo = this.$_.clone(_result.data);
      this.getDetail();
    },
    apprCheck(data) {
      this.riskAssessPlan.apprValidation = data;
    },
    /** 평가대상작업 목록 조회 **/
    getApprTaskList() {
      if (!this.popupParam.assessPlanNo) return;
      this.$http.url = selectConfig.rsa.deptAssessJob.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        assessPlanNo: this.popupParam.assessPlanNo,
        processCd: null,
        assessTypeNo: 2,
      };
      this.$http.request(
        (_result) => {
          // 평가대상작업  목록 중 대상여부 col 중 대상 체크
          var Indexes = this.$_.keys(
            this.$_.pickBy(_result.data, { targetYnNm: '대상' })
          );
          if (Indexes) this.apprCheck(Indexes.length);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
