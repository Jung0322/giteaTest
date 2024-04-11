<!--
  목적 : 합동결과 등록/상세
  Detail : 합동결과 등록/수정 화면
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
            <!-- 합동결과 상세 -->
            <y-label
              label="L0000003184"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
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
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :disabled="disabled || popupParam.safCongChkRsltNo > 0"
                :editable="editable"
                name="plantCd"
                v-model="checkPlanDetail.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 주관부서 -->
              <y-tree-dept
                label="L0000002713"
                :required="true"
                :disabled="disabled"
                :editable="editable"
                name="deptCd"
                :plantCd="checkPlanDetail.plantCd"
                v-model="checkPlanDetail.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 합동종류 -->
              <y-select
                :width="8"
                :required="true"
                :comboItems="patrolTypeItems"
                :disabled="disabled || popupParam.safCongChkRsltNo > 0"
                :editable="editable"
                itemText="safCheckKindNm"
                itemValue="safCheckKindNo"
                ui="bootstrap"
                name="safCheckKindNo"
                label="L0000003197"
                v-model="checkPlanDetail.safCheckKindNo"
                v-validate="'required'"
                :state="validateState('safCheckKindNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검일 -->
              <y-datepicker
                :width="8"
                :required="true"
                :disabled="disabled"
                :editable="editable"
                label="L0000002570"
                name="congChkYmd"
                v-model="checkPlanDetail.congChkYmd"
                v-validate="'required'"
                :state="validateState('congChkYmd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 합동점검계획명 -->
              <y-text
                :width="10"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                name="chkTitle"
                label="L0000003195"
                v-model="checkPlanDetail.chkTitle"
                v-validate="'required'"
                :state="validateState('chkTitle')"
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
  name: 'patrol-result-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safCongChkRsltNo: 0, // 합동결과번호
      },
    },
  },
  data: () => ({
    // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
    //                즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
    tabItems: [
      { title: 'L0000000405', url: 'checkResultItem' }, // 결과
      { title: 'L0000002572', url: 'checkInspector' }, // 점검자
      { title: 'L0000000259', url: 'imprActTab' }, // 개선사항
      { title: 'L0000002843', url: 'multiFileUpload' }, // 첨부파일
    ],
    component: null,
    tabIndex: 0,
    checkPlanDetail: {
      safCongChkRsltNo: 0, // 합동결과번호
      plantCd: '',
      safCheckKindNo: null, // 순회종류
      patrolMstNo: 0,
      checkStepCd: '', // 진행단계
      safCheckKindNm: '', // 순회종류
      checkYmd: '', // 순회일
      deptCd: '', // 순회주관부서
      tgtDeptCd: '', // 순회대상부서
      tgtVendorCd: '', // 순회대상업체
      tgtVendorNm: '',
      innerTeamData: [],
      outerTeamData: [],
      consolInspectors: [],
      checkTitle: '', // 순회명
      checkResult: '', // 합동결과요약
      consolItems: [], // 순회항목별 결과
      createUserId: '',
      updateUserId: '',
    },
    // 개선조치를 위한 변수
    tabParam: {
      imprClassCd: 'ICL12',
      refTableId: 0,
      editable: true,
      detailCheck: false,
      target: 'IMM',
      message: 'M0000000069', // 즉시조치는 합동점검 등록 후 입력 가능합니다.
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
  watch: {
    tabIndex: function (newValue, oldValue) {
      this.loadComponent();
    },
    'checkPlanDetail.plantCd'() {
      this.getConsolKindList();
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
      this.searchDetailUrl = selectConfig.saf.consolPlan.get.url;
      this.saveUrl = transactionConfig.saf.consolPlan.edit.url;

      this.tabParam.refTableId = this.popupParam.safCongChkRsltNo
        ? this.popupParam.safCongChkRsltNo
        : 0;

      this.$comm.getComboItems('SAF_ACTPART_CLS', false).then((_result) => {
        this.targetItems = _result;
      });
      this.getConsolKindList();
      this.getDetail();
    },
    getDetail() {
      if (
        !this.popupParam.safCongChkRsltNo ||
        this.popupParam.safCongChkRsltNo === 0
      ) {
        // default로 자신의 사업장에 부서가 매핑 될 수 있도록 설정
        this.checkPlanDetail.checkYmd = this.$comm.getToday();
        this.tabParam.editable = false;
      } else {
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.popupParam.safCongChkRsltNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.$_.extend(this.checkPlanDetail, _result.data);

            if (
              this.checkPlanDetail.consolInspectors &&
              this.checkPlanDetail.consolInspectors.length > 0
            ) {
              this.checkPlanDetail.innerTeamData = this.$_.filter(
                this.checkPlanDetail.consolInspectors,
                { inspClsCd: 'DPT' }
              );
              this.checkPlanDetail.outerTeamData = this.$_.filter(
                this.checkPlanDetail.consolInspectors,
                { inspClsCd: 'VDR' }
              );
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
      if (this.checkPlanDetail) {
        if (this.checkPlanDetail.checkStepCd === 'CHS02') {
          this.tabParam.editable = true;
        }
      }
      this.setAttachFileGrp();
    },
    setAttachFileGrp() {
      let taskKey = this.popupParam.safCongChkRsltNo
        ? this.popupParam.safCongChkRsltNo.toString()
        : '';
      this.safAttachFileGrps = [
        {
          label: 'L0000003030', // 파일업로드
          uploadTempFiles: null,
          taskClassNm: 'CONSOL_DATA',
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
      } else if (path === 'checkInspector') {
        this.component = () =>
          import('@/pages/saf/consolidation/checkInspectorResult');
      } else if (path === 'checkResultItem') {
        this.component = () =>
          import('@/pages/saf/consolidation/consolItemResult');
      }
    },
    getConsolKindList() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        congYn: 'Y',
        plantCd: this.checkPlanDetail.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
          this.patrolTypeItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSave() {
      if (this.popupParam.safCongChkRsltNo > 0) {
        this.saveUrl = transactionConfig.saf.consolPlan.edit.url;
        this.actionType = 'PUT';
      } else {
        this.saveUrl = transactionConfig.saf.consolPlan.insert.url;
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
                  title: 'L0000003395' /* 안내 */,
                  message: 'M0000000070', // 합동결과요약을 입력해주세요.
                  type: 'warning', // success / info / warning / error
                });
                return;
              }
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321' /* 확인 */,
                message: 'M0000000011' /* 저장하시겠습니까? */,
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

                  this.checkPlanDetail.consolInspectors = [];
                  this.$_.forEach(
                    this.checkPlanDetail.innerTeamData,
                    (item) => {
                      this.checkPlanDetail.consolInspectors.push(item);
                    }
                  );
                  this.$_.forEach(
                    this.checkPlanDetail.outerTeamData,
                    (item) => {
                      this.checkPlanDetail.consolInspectors.push(item);
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

              this.checkPlanDetail.consolInspectors = [];
              this.$_.forEach(this.checkPlanDetail.innerTeamData, (item) => {
                this.checkPlanDetail.consolInspectors.push(item);
              });
              this.$_.forEach(this.checkPlanDetail.outerTeamData, (item) => {
                this.checkPlanDetail.consolInspectors.push(item);
              });

              this.isSave = true;
            }
          } else if (!_result) {
            // window.alert("필수입력값을 입력해주세요");
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000000005',
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
          this.isSave = false;
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
      this.popupParam.safCongChkRsltNo = this.$_.clone(_result.data);
      this.tabParam.refTableId = this.$_.clone(_result.data);
      this.tabParam.editable = true;
      this.tabParam.detailCheck = false;

      if (!this.isComplete) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000006',
          type: 'success', // success / info / warning / error
        });
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
        item.taskKey = this.popupParam.safCongChkRsltNo;
      });

      if (this.safSaveAttachFiles.length > 0) {
        // 저장할 데이터가 있는 경우
        this.submitObject.submitCheck = !this.submitObject.submitCheck;
      }
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
  },
};
</script>
