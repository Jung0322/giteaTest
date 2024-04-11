<!--
  목적 : 점검예정일별 점검계획 등록/상세
  Detail : 점검예정일별 점검계획 등록/수정 화면
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
            <!-- 점검예정일별 점검계획 -->
            <y-label
              label="L0000002565"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 완료 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="completeUrl"
                :param="checkResultDetail"
                :is-submit="isComplete"
                title="L0000002039"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeComplete"
                @beforeComplete="beforeComplete"
                @btnClicked="btnCompleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="insertable && editable"
                :action-url="insertUrl"
                :param="checkResultDetail"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="updateMode && editable"
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
                v-if="deleteable && editable"
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
                :editable="editable"
                :disabled="disabled || updateMode"
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
                :required="true"
                :comboItems="comboCheckKindItems"
                :disabled="disabled || updateMode"
                :editable="editable"
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
              <!-- 점검주관부서 -->
              <y-tree-dept
                label="L0000002578"
                :showAllDept="true"
                :required="true"
                :editable="editable"
                :disabled="disabled || updateMode"
                :plantCd="checkResultDetail.plantCd"
                name="deptCd"
                v-model="checkResultDetail.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검예정일 -->
              <y-datepicker
                :width="8"
                :required="true"
                :disabled="disabled || updateMode"
                :editable="editable"
                label="L0000002564"
                name="checkSchYmd"
                :default="checkResultDetail.checkSchYmd"
                v-model="checkResultDetail.checkSchYmd"
                v-validate="'required'"
                :state="validateState('checkSchYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검대상부서 -->
              <y-tree-dept
                :required="true"
                :editable="editable"
                :showAllDept="true"
                :disabled="disabled || updateMode"
                label="L0000002549"
                name="tgtDeptCd"
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
                :disabled="disabled"
                :showAllDept="true"
                label="L0000004852"
                name="pfmDeptCd"
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
                :disabled="disabled"
                ui="bootstrap"
                label="L0000001642"
                name="checkTitle"
                v-model="checkResultDetail.checkTitle"
                v-validate="'required'"
                :state="validateState('checkTitle')"
              ></y-text>
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
          :submitCheck="safSubmitCheck"
          :attachFileGrps="safAttachFileGrps"
          :saveAttachFiles="safSaveAttachFiles"
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
          @closePopup="closePopup2"
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
  name: 'check-result-plan-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safCheckScheduleNo: 0, // 안전점검일정 일련번호
        checkStepCd: '', // 점검자에서 단계를 보는데 상세조회후 단계를 점검자로 넘기게 되면 깜빡임이 존재함으로 추가
        // bizApprStepCd: '', // 결재진행상태
        // apprFlag: false,
      },
    },
  },
  data: () => ({
    tabItems: [
      { title: 'L0000002572', url: './checkInspector' }, // 점검자
      { title: 'L0000002843', url: 'multiFileUpload' }, // 첨부파일
    ],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '500px',
      top: '50px',
      param: {},
      closeCallback: null,
    },
    component: null,
    tabIndex: 0,
    checkResultDetail: {
      safCheckNo: 0, // 안전점검 마스터 일련번호
      safCheckScheduleNo: 0, // 안전점검일정 일련번호
      checkYmd: '', // 점검일
      tgtDeptCd: null, // 대상부서코드
      deptCd: '', // 주관부서코드
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

      checkPlanFlag: false, // 탭에 정보 조회 후 등록/수정 판단용 flag
    },
    disabled: false,
    // saveBtnTitile: '수정',
    insertable: false,
    editable: true,
    updateMode: false,
    deleteable: false,
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
    // apprMode: false,

    // 첨부파일 관련
    attach: null, // 첨부파일컴포넌트
    safSubmitCheck: false,
    safSaveAttachFiles: [],
    safTempDeleteFiles: [],
    safAttachFileGrps: [],
  }),
  watch: {
    'popupParam.checkStepCd': {
      handler: function (newValue, oldValue) {
        this.setBtnVisible(false);
      },
      deep: true,
    },
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
  },
  mounted() {
    this.init();
    this.loadComponent();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.checkResultDetail.safCheckScheduleNo =
        this.popupParam.safCheckScheduleNo;
      // Url Setting
      this.insertUrl = transactionConfig.saf.checkPlan.insert.url;
      this.editUrl = transactionConfig.saf.checkPlan.edit.url;
      this.deleteUrl = transactionConfig.saf.checkPlan.delete.url;
      this.completeUrl = transactionConfig.saf.checkPlan.complete.url;
      this.selectUrl = selectConfig.saf.checkPlan.get.url;

      this.getDetail();

      this.getComboCheckKindItems(); // 점검종류
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      }
      // else if (path === 'imprActTab') this.component = () => import('@/pages/impr/imprActTab');
      else this.component = () => import(`${path}`);
    },
    getDetail() {
      if (this.checkResultDetail.safCheckScheduleNo === 0) {
        /**
         * 2020-02-08
         *  무일정등록 추가로 인해 키 값이 없는 경우 체크
         */
        this.setBtnVisible(false);
      } else {
        this.$http.url = this.$format(
          this.selectUrl,
          this.checkResultDetail.safCheckScheduleNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.$_.extend(this.checkResultDetail, _result.data);
            this.setBtnVisible(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    setBtnVisible(isEditMode) {
      // 점검자 목록이 있으면 수정
      if (isEditMode) {
        this.checkResultDetail.checkYmd = this.checkResultDetail.checkYmd
          ? this.checkResultDetail.checkYmd
          : this.checkResultDetail.checkSchYmd;
        if (this.checkResultDetail.checkStepCd === 'CHS01') {
          this.insertable = false;
          this.updateMode = true;
          this.deleteable = true;
        } else {
          this.insertable = false;
          this.updateMode = false;
          this.deleteable = false;
        }
      } else {
        this.checkResultDetail.checkYmd = this.$comm.getToday();
        this.insertable = true;
        this.updateMode = false;
        this.deleteable = false;
      }
      if (isEditMode) {
        if (this.checkResultDetail.checkStepCd !== 'CHS01') {
          this.disabled = true;
          this.checkResultDetail.checkPlanFlag = true;
        } else {
          this.checkResultDetail.checkPlanFlag = false;
          this.disabled = false;
        }
      } else {
        this.checkResultDetail.checkPlanFlag = false;
        this.disabled = false;
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
          // this.checkResultDetail.safCheckKindNo = this.popupParam.safCheckKindNo;
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
                /**
                 * 2020-02-08 KDH
                 *  사업장을 수정가능하도록 풀려져 있는 상태임으로 자신의 사업장이 무조건 들어가는것이 아닌
                 *  사용자가 수정한 사업장으로 등록/ 수정 되도록 변경
                 */
                // this.checkResultDetail.plantCd = this.$store.getters.plantCd;
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
                // this.checkResultDetail.isResult = !this.popupParam.flag ? 1 : 0;

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
              'checkResultPlanDetail',
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
      this.saveCheckResult(1, 'M0000000838');
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeEdit() {
      /*
          무계획으로 이번달이외에 달로 등록시 점검일세팅이 오늘날짜로 들어가서 점검실적 카운트에 해당되지않음 (점검실적은 점검일로 집계하고있음)
          => 어차피 기존 로직을타고들어오면 점검일이 있으면 점검일로 세팅하는데 없으면 예정일로 세팅되게 되어있어서 점검예정일로 넣자고 하여 점검예정일로넣음
          2022-03-18
      */
      if (this.checkResultDetail.safCheckScheduleNo === 0) {
        this.checkResultDetail.checkYmd = this.checkResultDetail.checkSchYmd;
      }
      /*  */
      this.saveCheckResult(0, 'M0000000011');
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
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      this.checkResultDetail.safCheckScheduleNo = _result.data;
      this.saveAttach();
    },
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
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
        message: 'M0000000012',
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.checkResultDetail.safCheckNo,
            this.checkResultDetail.safCheckScheduleNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000007',
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
        message: 'M0000000078',
        type: 'success', // success / info / warning / error
      });
      this.isComplete = false;
      this.disabled = true;
      this.checkResultDetail.checkPlanFlag = true;
      this.updateMode = false;
      this.deleteable = false;
      this.checkResultDetail.checkStepCd = 'CHS02';
      if (this.safSaveAttachFiles.length > 0) {
        this.saveAttach();
      } else {
        // this.closePopup(null);
      }
      this.setAttachFileGrp();
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
          drag: !this.disabled,
          editable: this.editable,
          disabled: this.disabled,
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
      this.setBtnVisible(true);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
