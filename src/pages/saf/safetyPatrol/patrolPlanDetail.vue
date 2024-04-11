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
            <!-- 순회점검계획 상세 -->
            <y-label
              label="L0000004285"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 완료 -->
              <y-btn
                v-if="popupParam.safCheckRsltNo > 0 && editable && !disabled"
                color="black"
                title="L0000002039"
                @btnClicked="beforeComplete"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && !disabled"
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
                v-if="popupParam.safCheckRsltNo > 0 && editable && !disabled"
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
                :disabled="popupParam.safCheckRsltNo > 0 || disabled"
                name="plantCd"
                v-model="checkPlanDetail.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 순회주관부서 -->
              <y-tree-dept
                :required="true"
                :editable="editable"
                :disabled="popupParam.safCheckRsltNo > 0 || disabled"
                label="L0000001721"
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
                :disabled="popupParam.safCheckRsltNo > 0 || disabled"
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
              <!-- 순회예정일 -->
              <y-datepicker
                :width="8"
                :required="true"
                :disabled="disabled"
                :editable="editable"
                label="순회예정일"
                name="checkSchYmd"
                :default="checkPlanDetail.checkSchYmd"
                v-model="checkPlanDetail.checkSchYmd"
                v-validate="'required'"
                :state="validateState('checkSchYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <!-- 순회대상 -->
                  <y-select
                    :width="8"
                    :comboItems="targetItems"
                    :disabled="disabled"
                    itemText="codeNm"
                    itemValue="code"
                    :required="true"
                    ui="bootstrap"
                    name="patrolType"
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
                    label
                    name="tgtDeptCd"
                    type="search"
                    :disabled="disabled"
                    :plantCd="checkPlanDetail.plantCd"
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
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 순회수행부서 -->
              <y-tree-dept
                :editable="editable"
                :required="true"
                label="순회수행부서"
                name="pgpDeptCd"
                :disabled="disabled"
                :showAllDept="true"
                :plantCd="checkPlanDetail.plantCd"
                v-model="checkPlanDetail.pgpDeptCd"
                v-validate="'required'"
                :state="validateState('pgpDeptCd')"
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
                v-model="checkPlanDetail.checkTitle"
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
          {{ item.title }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :checkPlanDetail.sync="checkPlanDetail"
          :disabled.sync="disabled"
          :submitObject="submitObject"
          :attachFileGrps="safAttachFileGrps"
          :saveAttachFiles="safSaveAttachFiles"
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
  name: 'patrol-plan-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safCheckRsltNo: 0, // 안전점검일정 일련번호
      },
    },
  },
  data: () => ({
    tabItems: [
      { title: '점검자', url: './checkInspector' }, //  L0000002572
      { title: '첨부파일', url: 'multiFileUpload' }, // 첨부파일
    ],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '80%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    component: null,
    tabIndex: 0,
    checkPlanDetail: {
      safCheckRsltNo: 0, //  일련번호
      checkYmd: '', // 점검일
      tgtDeptCd: null, // 대상부서코드
      tgtDeptNm: '',
      tgtClsCd: null,
      tgtVendorCd: '',
      tgtVendorNm: '',
      pgpDeptCd: null,
      pgpDeptNm: '',
      deptCd: '', // 주관부서코드
      checkSchYmd: '',
      safCheckKindNo: null,
      checkTitle: '',
      checkOrgCd: '',
      checkStepCd: '',
      checkItemResults: [],
      innerTeamData: [],
      outerTeamData: [],
      patrolInspectors: [],
      checkResult: null,
      isComplete: 0,
      isResult: 0,
      createUserId: '',
      updateUserId: '',
      plantCd: null, // 사업장 코드
      checkPlanFlag: false, // 탭에 정보 조회 후 등록/수정 판단용 flag
    },
    disabled: false,
    editable: true,
    isSave: false,
    actionType: 'POST',
    targetItems: [],
    patrolTypeItems: [],
    deleteUrl: '',
    editUrl: '',
    insertUrl: '',
    saveUrl: '',
    detailUrl: '',
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
    'checkPlanDetail.tgtClsCd': {
      handler: function (newValue, oldValue) {
        if (this.checkPlanDetail.tgtClsCd === 'ACTSC') {
          this.checkPlanDetail.tgtDeptCd = null;
          this.checkPlanDetail.tgtDeptNm = null;
        } else {
          this.checkPlanDetail.tgtVendorCd = null;
          this.checkPlanDetail.tgtVendorNm = null;
        }
      },
      deep: true,
    },
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
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.insertUrl = transactionConfig.saf.patrol.insert.url;
      this.editUrl = transactionConfig.saf.patrol.edit.url;
      this.deleteUrl = transactionConfig.saf.patrol.delete.url;
      this.detailUrl = selectConfig.saf.patrol.get.url;

      this.$comm.getComboItems('SAF_ACTPART_CLS', false).then((_result) => {
        this.targetItems = _result;
      });

      this.getPatrolKindList();
      this.getDetail();
    },
    getDetail() {
      if (this.popupParam.safCheckRsltNo === 0) {
        /**
         * 2020-02-08
         *  무일정등록 추가로 인해 키 값이 없는 경우 체크
         */
        this.checkPlanDetail.checkYmd = this.$comm.getToday();
        this.checkPlanDetail.checkPlanFlag = false;
      } else {
        this.$http.url = this.$format(
          this.detailUrl,
          this.popupParam.safCheckRsltNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.$_.extend(this.checkPlanDetail, _result.data);

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
            }

            this.setBtnVisible(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    setBtnVisible() {
      if (this.checkPlanDetail.checkStepCd === 'CHS01') {
        this.disabled = false;
      } else {
        this.disabled = true;
      }

      // 점검자 목록이 있으면 수정
      this.checkPlanDetail.checkYmd = this.checkPlanDetail.checkYmd
        ? this.checkPlanDetail.checkYmd
        : this.checkPlanDetail.checkSchYmd;
      if (this.checkPlanDetail.checkStepCd !== 'CHS01') {
        this.checkPlanDetail.checkPlanFlag = true;
      } else {
        this.checkPlanDetail.checkPlanFlag = false;
      }
      this.setAttachFileGrp();
    },
    setAttachFileGrp() {
      let taskKey = this.popupParam.safCheckRsltNo
        ? this.popupParam.safCheckRsltNo.toString()
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
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else this.component = () => import(`${path}`);
    },
    beforeSave() {
      if (this.popupParam.safCheckRsltNo > 0) {
        this.saveUrl = this.$_.clone(this.editUrl);
        this.actionType = 'PUT';
      } else {
        this.saveUrl = this.$_.clone(this.insertUrl);
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
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321', // '확인',
                message: 'M0000000011', // 저장하시겠습니까?
                // TODO : 필요시 추가하세요.
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.checkPlanDetail.createUserId = this.$store.getters.token;
                  this.checkPlanDetail.updateUserId = this.$store.getters.token;
                  this.checkPlanDetail.checkStepCd = 'CHS01';
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
                cancelCallback: () => {
                  this.isSave = false;
                },
              });
            } else {
              this.checkPlanDetail.createUserId = this.$store.getters.token;
              this.checkPlanDetail.updateUserId = this.$store.getters.token;
              this.checkPlanDetail.checkStepCd = 'CHS02';
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
              'patrolPlanDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isSave = false;
        });
    },
    beforeComplete() {
      let check =
        this.checkPlanDetail.innerTeamData.length === 0 &&
        this.checkPlanDetail.outerTeamData.length === 0;
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: !check ? 'M0000000838' : 'M0000000774', // '완료하시겠습니까?' : '점검자가 입력되지 않았습니다. 진행하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.isComplete = true;
          this.saveUrl = this.$_.clone(this.editUrl);
          this.actionType = 'PUT';
          this.saveCheckResult();
        },
        cancelCallback: () => {},
      });
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.popupParam.safCheckRsltNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success', // success / info / warning / error
              });
              this.closePopup();
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
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      this.isComplete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** button 관련 이벤트 **/
    btnSaveClickedCallback(_result) {
      if (!this.isComplete) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000006', // 저장되었습니다.
          type: 'success', // success / info / warning / error
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000078', // 완료되었습니다.
          type: 'success', // success / info / warning / error
        });
        this.isComplete = false;
      }
      this.popupParam.safCheckRsltNo = _result.data;
      this.isSave = false;
      this.saveAttach();
      this.getDetail();
    },
    searchVendor() {
      this.popupOptions.target = () =>
        import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003246'; // 협력업체
      this.popupOptions.visible = true;
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
    /** end button 관련 이벤트 **/
  },
};
</script>
