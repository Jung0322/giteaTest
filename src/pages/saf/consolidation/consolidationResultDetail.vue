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
            <y-label
              label="합동결과 상세"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- <el-tag v-if="checkPlanDetail.bizApprStepCd === 'BAPSD'" size="mini" type="danger">
                <i class="el-icon-warning"></i>
                반려된 문서로 재결재요청은 반려문서 메뉴에서 하시기 바랍니다.
              </el-tag> -->
              <y-btn
                v-if="btnApprStatus"
                title="결재요청"
                color="black"
                @btnClicked="btnAppr"
              />
              <y-btn
                v-if="!disabled && editable"
                :action-url="saveUrl"
                :param="checkPlanDetail"
                :is-submit="isSave"
                title="저장"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- <y-btn
                v-if="popupParam.safCongChkRsltNo > 0&&!disabled&&editable"
                color="red"
                title="삭제"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              /> -->
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
                :disabled="disabled || popupParam.safCongChkRsltNo > 0"
                :editable="editable"
                name="plantCd"
                v-model="checkPlanDetail.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-dept
                label="주관부서"
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
              <y-select
                :width="8"
                :required="true"
                :comboItems="consolTypeItems"
                :disabled="disabled || popupParam.safCongChkRsltNo > 0"
                :editable="editable"
                itemText="safCheckKindNm"
                itemValue="safCheckKindNo"
                ui="bootstrap"
                name="safCheckKindNo"
                label="합동종류"
                v-model="checkPlanDetail.safCheckKindNo"
                v-validate="'required'"
                :state="validateState('safCheckKindNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-datepicker
                :width="8"
                :required="true"
                :disabled="disabled"
                :editable="editable"
                label="점검일"
                name="congChkYmd"
                v-model="checkPlanDetail.congChkYmd"
                v-validate="'required'"
                :state="validateState('congChkYmd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :width="10"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                name="chkTitle"
                label="합동점검계획명"
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
    tabItems: [
      { title: '결과', url: './consolItemResult' },
      { title: '점검자', url: './checkInspectorResult' },
      { title: '개선사항', url: 'imprActTab' },
      { title: '첨부파일', url: 'multiFileUpload' },
    ],
    component: null,
    tabIndex: 0,
    checkPlanDetail: {
      safCongChkRsltNo: 0, // 합동결과번호
      safCongChkPlanNo: 0,
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
      bizApprStepCd: '',
      rApprRqstNo: 0,
      congChkYmd: '',
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
      detailCheck: true,
      message: '개선사항 입력은 합동점검결과를 등록후 입력 가능합니다.',
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
    consolTypeItems: [],
    disabled: false,
    editable: true,
    isSave: false,
    isComplete: false,
    searchDetailUrl: '',
    deleteUrl: '',
    saveUrl: '',
    actionType: 'POST',
    updateMode: false,
    // 첨부파 일 관련
    attach: null, // 첨부파일컴포넌트
    submitObject: {
      submitCheck: false,
    },
    safSaveAttachFiles: [],
    safAttachFileGrps: [],
  }),
  computed: {
    btnApprStatus() {
      return this.editable && !this.disabled && this.updateMode;
    },
  },
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
      this.getConsolKindList();
      this.getDetail();
      this.getInsp();
    },
    getInsp() {
      this.$http.url = this.$format(
        selectConfig.saf.consolPlan.inspector.url,
        this.popupParam.safCongChkRsltNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.checkPlanDetail.innerTeamData = this.$_.filter(_result.data, {
            inspClsCd: 'DPT',
          });
          this.checkPlanDetail.outerTeamData = this.$_.filter(_result.data, {
            inspClsCd: 'VDR',
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
            if (_result.data.bizApprStepCd) {
              if (_result.data.bizApprStepCd === 'BAPSD') {
                this.disabled = false;
                this.updateMode = true;
                this.tabParam.editable = true;
              } else {
                this.updateMode = false;
                this.disabled = true;
                this.tabParam.editable = false;
                this.tabParam.detailCheck = true;
              }
            } else {
              if (
                _result.data.checkStepCd === 'CHS02' ||
                _result.data.checkStepCd === 'CHS03'
              ) {
                this.disabled = false;
                this.updateMode = true;
                this.tabParam.editable = true;
                this.tabParam.detailCheck = false;
              } else {
                this.disabled = true;
                this.updateMode = false;
                this.tabParam.editable = false;
                this.tabParam.detailCheck = true;
              }
            }
            this.setAttachFileGrp();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    setAttachFileGrp() {
      let taskKey = this.popupParam.safCongChkRsltNo
        ? this.popupParam.safCongChkRsltNo.toString()
        : '';
      this.safAttachFileGrps = [
        {
          label: '파일업로드',
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
      } else this.component = () => import(`${path}`);
    },
    setBtnVisible() {},
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
            safCheckKindNm: '선택하세요',
          });
          this.consolTypeItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnAppr() {
      if (
        this.checkPlanDetail.innerTeamData.length === 0 &&
        this.checkPlanDetail.outerTeamData.length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '점검자가 입력되지 않았습니다.',
          type: 'warning', // success / info / warning / error
        });
      } else if (!this.checkPlanDetail.checkResult) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '합동결과요약을 입력해주세요.',
          type: 'warning', // success / info / warning / error
        });
      } else if (!this.checkPlanDetail.congChkYmd) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '점검일을 입력해주세요.',
          type: 'warning', // success / info / warning / error
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: '확인',
          message: '결재요청 전 저장됩니다. 진행하시겠습니까?',
          type: 'info', // success / info / warning / error
          confirmCallback: () => {
            this.$http.url = transactionConfig.saf.consolPlan.edit.url;
            this.$http.type = 'PUT';
            this.checkPlanDetail.createUserId = this.$store.getters.token;
            this.checkPlanDetail.updateUserId = this.$store.getters.token;

            this.checkPlanDetail.checkStepCd = 'CHS03';

            this.checkPlanDetail.consolInspectors = [];
            this.$_.forEach(this.checkPlanDetail.innerTeamData, (item) => {
              this.checkPlanDetail.consolInspectors.push(item);
            });

            this.$_.forEach(this.checkPlanDetail.outerTeamData, (item) => {
              this.checkPlanDetail.consolInspectors.push(item);
            });
            this.$http.param = this.checkPlanDetail;
            this.$http.request(
              (_result) => {
                this.btnApprPopup();
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          cancelCallback: () => {},
        });
      }
    },
    btnApprPopup() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = '결재요청';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'SA_CO_1',
        apprParams: {
          safCongChkRsltNo: this.checkPlanDetail.safCongChkRsltNo,
        },
      };
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
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
                  title: '안내',
                  message: '합동결과요약을 입력해주세요.',
                  type: 'warning', // success / info / warning / error
                });
                return;
              }
              window.getApp.$emit('CONFIRM', {
                title: '확인',
                message: '저장하시겠습니까?',
                // TODO : 필요시 추가하세요.
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.checkPlanDetail.createUserId = this.$store.getters.token;
                  this.checkPlanDetail.updateUserId = this.$store.getters.token;

                  this.checkPlanDetail.checkStepCd = 'CHS03';

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

              this.checkPlanDetail.checkStepCd = 'CHS03';

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
            window.getApp.$emit('ALERT', {
              title: '안내',
              message: '필수입력값을 입력해주세요.',
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사도중 에러가 발생하였습니다.'
          );
          this.isSave = false;
        });
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: '확인',
        message: '삭제하시겠습니까?',
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            transactionConfig.saf.patrol.delete.url,
            this.popupParam.safCongChkRsltNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: '안내',
                message: '삭제되었습니다.',
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
      this.popupParam.safCongChkRsltNo = this.$_.clone(_result.data);
      this.tabParam.refTableId = this.$_.clone(_result.data);
      this.tabParam.editable = true;
      this.tabParam.detailCheck = false;

      if (!this.isComplete) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '저장되었습니다.',
          type: 'success', // success / info / warning / error
        });
      }
      this.updateMode = true;
      this.getDetail();
    },
    searchVendor() {
      if (!this.editable || this.disabled) return;
      this.popupOptions.target = () =>
        import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = '협력업체';
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
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    /** end button 관련 이벤트 **/

    /** end button 관련 이벤트 **/
  },
};
</script>
