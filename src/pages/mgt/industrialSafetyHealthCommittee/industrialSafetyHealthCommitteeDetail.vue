<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 회의록 상세 -->
            <y-label
              label="L0000003361"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  industrialSafetyHealthCommittee.progressStepCd === 'CMS03' &&
                  industrialSafetyHealthCommittee.committeeConfNo > 0 &&
                  editable &&
                  !disabled &&
                  !popupParam.isSearch
                "
                title="L0000003418"
                color="black"
                @btnClicked="btnApprRequestClickedCallback"
              />
              <!-- 완료 -->
              <y-btn
                v-show="
                  editable &&
                  !disabled &&
                  !popupParam.isSearch &&
                  popupParam.committeeConfNo > 0 &&
                  industrialSafetyHealthCommittee.progressStepCd === 'CMS01'
                "
                :action-url="completeUrl"
                :param="industrialSafetyHealthCommittee"
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
                v-if="editable && !disabled && !popupParam.isSearch"
                :action-url="saveUrl"
                :param="industrialSafetyHealthCommittee"
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
                v-if="
                  editable &&
                  !disabled &&
                  !popupParam.isSearch &&
                  popupParam.committeeConfNo > 0
                "
                :action-url="deleteUrl"
                :param="deleteValue"
                :is-submit="isDelete"
                title="L0000001495"
                color="red"
                action-type="DELETE"
                beforeSubmit="beforeDelete"
                @beforeDelete="beforeDelete"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
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
                :disabled="disabled"
                name="plantCd"
                v-model="industrialSafetyHealthCommittee.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 구분 -->
              <y-select
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                :comboItems="cmiClsCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000686"
                name="cmiClsCd"
                v-model="industrialSafetyHealthCommittee.cmiClsCd"
                v-validate="'required'"
                :state="validateState('cmiClsCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 장소 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="50"
                :required="true"
                ui="bootstrap"
                label="L0000002451"
                name="confPlace"
                v-model="industrialSafetyHealthCommittee.confPlace"
                v-validate="'required'"
                :state="validateState('confPlace')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 일시 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                label="L0000002268"
                type="datetime"
                :minuteStep="1"
                name="confDate"
                :default="industrialSafetyHealthCommittee.confDate"
                v-model="industrialSafetyHealthCommittee.confDate"
                v-validate="'required'"
                :state="validateState('confDate')"
              ></y-datepicker>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 제목 -->
              <y-text
                :width="10"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                :maxlength="50"
                ui="bootstrap"
                label="L0000002616"
                name="confNm"
                v-model="industrialSafetyHealthCommittee.confNm"
                v-validate="'required'"
                :state="validateState('confNm')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :maxlength="1000"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="industrialSafetyHealthCommittee.remark"
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
        <keep-alive>
          <component
            :is="component"
            v-if="component"
            :disabled="disabled"
            :editable="editable"
            :industrialSafetyHealthCommittee.sync="
              industrialSafetyHealthCommittee
            "
            :tabParam="tabParam"
            :submitObject.sync="submitObject"
            :attachFileGrps.sync="attachFileGrps"
            :saveAttachFiles.sync="saveAttachFiles"
            @changeUploadFiles="changeUploadFiles"
            :submitCheckPicture.sync="submitCheck"
            :attachFileGrpsPicture="attachFileGrpsPicture"
            :saveAttachFilesPicture="saveAttachFilesPicture"
            @changeUploadFilesPicture="changeUploadFilesPicture"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'industrial-safety-health-committee-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        committeeConfNo: 0,
        progressStepCd: null,
        isSearch: false,
      },
    },
  },
  data() {
    return {
      industrialSafetyHealthCommittee: {
        committeeConfNo: 0,
        meetingGrpNo: 0,
        cmiClsCd: null, // 구분코드
        plantCd: '', // 사업자코드
        confPlace: '', // 장소
        confDate: '', // 일시
        confNm: '', // 회의록명
        remark: '', // 비고
        progressStepCd: '', // 산업안전보건위원회진행단계
        bizApprStepNm: '', // 결재상태명칭
        bizApprStepCd: '', // 결재상태코드
        createUserId: '',
        updateUserId: '',
        mgtCommitteeAgendas: [], // 위원회 회의안건
        deleteMgtCommitteeAgendas: [], // [삭제] 위원회 회의안건
        mgtCommitteeAgendaImprs: [], // 개선사항
        deleteMgtCommitteeAgendaImprs: [], // [삭제] 개선사항
        mgtCommitteePsns: [], // 참석자
        inMgtCommitteePsn: [], // 내부 참석자
        outMgtCommitteePsn: [], // 외부 참석자
      },

      // 개선조치를 위한 변수
      tabParam: {
        imprClassCd: 'ICL13',
        refTableId: 0,
        editable: true,
        editable2: true,
        detailCheck: true,
        tabClickCnt: 0,
        plantCd: '', // 사업자코드
      },
      tabItems: [
        { title: 'L0000003362', url: './conferencePhoto' } /* 회의사진 */,
        { title: 'L0000002804', url: './attendants' } /* 참석자 */,
        { title: 'L0000003364', url: './meetingAgenda' } /* 회의안건 */,
        { title: 'L0000000259', url: 'meetingAgendaImprActTab' } /* 개선사항 */,
        { title: 'L0000002843', url: 'multiFileUpload' } /* 첨부파일 */,
      ],
      component: null,
      tabIndex: 0,
      submitObject: {
        submitCheck: false,
      },
      attachFileGrps: [],
      saveAttachFiles: [],
      tempDeleteFiles: [],
      // 관련사진 첨부 파일
      attach: null,
      submitCheck: false,
      saveAttachFilesPicture: [],
      tempDeleteFilesPicture: [],
      attachFileGrpsPicture: [],
      disabled: false,
      editable: false,
      searchDetailUrl: '',
      saveUrl: '',
      deleteUrl: '',
      completeUrl: '',
      isSave: false,
      actionType: 'POST',
      isComplete: false,
      isDelete: false,
      deleteValue: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
        gridRow: '',
      },
      cmiClsCdItems: [],
    };
  },
  watch: {
    tabIndex: function (newValue, oldValue) {
      this.loadComponent();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchDetailUrl =
        selectConfig.mgt.industrialSafetyHealthCommittee.get.url;
      this.saveUrl =
        transactionConfig.mgt.industrialSafetyHealthCommittee.insert.url;
      this.completeUrl =
        transactionConfig.mgt.industrialSafetyHealthCommittee.complete.url;
      this.deleteUrl =
        transactionConfig.mgt.industrialSafetyHealthCommittee.delete.url;

      this.editable = this.$route.meta.editable;

      this.$comm.getComboItems('MGT_CMI_CLS', false).then((_result) => {
        this.cmiClsCdItems = _result;
      });
      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps();
      if (!this.popupParam.committeeConfNo) {
        // 시 분 setting
        this.industrialSafetyHealthCommittee.confDate =
          this.$comm.getTodayDateTime(); // 발생일시
        if (this.popupParam.progressStepCd) {
          this.industrialSafetyHealthCommittee.progressStepCd =
            this.popupParam.progressStepCd;
        } else {
          this.industrialSafetyHealthCommittee.progressStepCd = 'CMS01';
        }

        if (this.industrialSafetyHealthCommittee.progressStepCd !== 'CMS01') {
          this.tabParam.editable = this.$route.meta.editable;
          this.tabParam.detailCheck = !this.$route.meta.editable;
          this.tabItems = [
            { title: 'L0000003362', url: './conferencePhoto' } /* 회의사진 */,
            { title: 'L0000002804', url: './attendants' } /* 참석자 */,
            { title: 'L0000003364', url: './meetingAgenda' } /* 회의안건 */,
            {
              title: 'L0000000259',
              url: 'meetingAgendaImprActTab',
            } /* 개선사항 */,
            { title: 'L0000002843', url: 'multiFileUpload' } /* 첨부파일 */,
          ];
        } else {
          this.tabItems = [
            { title: 'L0000002804', url: './attendants' } /* 참석자 */,
            { title: 'L0000002843', url: 'multiFileUpload' } /* 첨부파일 */,
          ];
        }
        this.loadComponent();
        this.setAttachFileGrps();
      } else {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.committeeConfNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.$_.extend(this.industrialSafetyHealthCommittee, _result.data);
          this.industrialSafetyHealthCommittee.inMgtCommitteePsn = [];
          this.industrialSafetyHealthCommittee.outMgtCommitteePsn = [];
          this.$_.forEach(
            this.industrialSafetyHealthCommittee.mgtCommitteePsns,
            (_item) => {
              if (_item.psnClsCd === 'CLS01') {
                this.industrialSafetyHealthCommittee.inMgtCommitteePsn.push(
                  _item
                );
              }
              if (_item.psnClsCd === 'CLS02') {
                this.industrialSafetyHealthCommittee.outMgtCommitteePsn.push(
                  _item
                );
              }
            }
          );
          if (!this.industrialSafetyHealthCommittee.mgtCommitteeAgendas) {
            this.industrialSafetyHealthCommittee.mgtCommitteeAgendas = {
              agendaNo: 0,
              agendaDesc: '',
              agendaReview: '',
              agendaResult: '',
              remark: '',
              createUserId: '',
              updateUSerId: '',
            };
          }
          if (this.industrialSafetyHealthCommittee.progressStepCd !== 'CMS01') {
            this.tabParam.editable = this.$route.meta.editable;
            this.tabParam.detailCheck = false;

            this.tabItems = [
              { title: 'L0000003362', url: './conferencePhoto' } /* 회의사진 */,
              { title: 'L0000002804', url: './attendants' } /* 참석자 */,
              { title: 'L0000003364', url: './meetingAgenda' } /* 회의안건 */,
              {
                title: 'L0000000259',
                url: 'meetingAgendaImprActTab',
              } /* 개선사항 */,
              { title: 'L0000002843', url: 'multiFileUpload' } /* 첨부파일 */,
            ];
          } else {
            this.tabItems = [
              { title: 'L0000002804', url: './attendants' } /* 참석자 */,
              { title: 'L0000002843', url: 'multiFileUpload' } /* 첨부파일 */,
            ];
          }

          if (
            this.industrialSafetyHealthCommittee.progressStepCd === 'CMS04' ||
            this.industrialSafetyHealthCommittee.bizApprStepCd === 'BAPSA'
          ) {
            this.disabled = true;
            this.tabParam.detailCheck = true;
          }

          this.tabParam.refTableId =
            this.industrialSafetyHealthCommittee.committeeConfNo;
          this.tabParam.message = '';
          this.loadComponent();
          this.setAttachFileGrps();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setAttachFileGrps() {
      let taskKey = this.popupParam.committeeConfNo
        ? this.popupParam.committeeConfNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000003030' /* 파일업로드 */,
          listType: 'text',
          showFileSearch: !this.disabled,
          editable: this.editable,
          disabled: this.disabled,
          limit: 10,
          multiple: true,
          onlyDownload: this.disabled,
          uploadTempFiles: null,
          taskClassNm: 'INDUSTRIAL_SAFETY_HEALTH_COMMITTEE',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];

      this.attachFileGrpsPicture = [
        {
          label: 'L0000003363' /* 회의사진 [* 사진만 첨부] */,
          isPictureExplan: true,
          pictureExplan: '',
          editable: this.editable,
          disabled: this.disabled,
          onlyDownload: this.disabled,
          limit: 5,
          multiple: true,
          uploadTempFiles: null,
          // accept: 'image/*',
          taskClassNm: 'INDUSTRIAL_SAFETY_HEALTH_COMMITTEE_MEETING',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === 'meetingAgendaImprActTab') {
        this.tabParam.plantCd = this.industrialSafetyHealthCommittee.plantCd;
        this.tabParam.tabClickCnt = this.tabParam.tabClickCnt + 1;
        this.component = () => import('./meetingAgendaImprActTab.vue');
      } else this.component = () => import(`${path}`);
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState(_ref) {
      if (!_ref) return;
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    beforeComplete() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000838' /* 완료하시겠습니까? */,
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.industrialSafetyHealthCommittee.updateUserId =
                  this.$store.getters.token;
                this.industrialSafetyHealthCommittee.progressStepCd = 'CMS02';

                this.isComplete = true;
              },
            });
          } else {
            this.checkRequiredInput();
          }
        })
        .catch(() => {
          this.isComplete = false;
        });
    },
    btnCompleteClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000078' /* 완료되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.isComplete = false;

      this.popupParam.committeeConfNo = _result.data;

      this.tabParam.refTableId = _result.data;
      this.tabParam.message = '';

      this.saveAttach();
      this.setAttachFileGrps();
      this.getDetail();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    checkRequiredInput() {
      if (!this.industrialSafetyHealthCommittee.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000863', // 사업장을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.industrialSafetyHealthCommittee.cmiClsCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001116', // 구분을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.industrialSafetyHealthCommittee.confPlace) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001117', // 장소를 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.industrialSafetyHealthCommittee.confDate) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001118', // 일시를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.industrialSafetyHealthCommittee.confNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001106', // 제목을 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      return true;
    },
    beforeSave() {
      let isVal = false;
      if (!this.checkRequiredInput()) {
        return;
      }
      if (this.industrialSafetyHealthCommittee.progressStepCd !== 'CMS01') {
        if (
          this.industrialSafetyHealthCommittee.mgtCommitteeAgendas.length < 1
        ) {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000923' /* 입력된 회의 안건이 한 건도 없습니다. */
          );
          return;
        } else {
          let mgt = false;
          this.$_.forEach(
            this.industrialSafetyHealthCommittee.mgtCommitteeAgendas,
            (item) => {
              mgt = true;
              if (!item.agendaDesc) {
                mgt = false;
                window.getApp.$emit(
                  'APP_VALID_ERROR',
                  'M0000000005' /* 필수 입력값을 입력해 주세요. */
                );
                return;
              }
              if (!item.agendaResult) {
                mgt = false;
                window.getApp.$emit(
                  'APP_VALID_ERROR',
                  'M0000000005' /* 필수 입력값을 입력해 주세요. */
                );
                return;
              }
            }
          );
          isVal = mgt;
        }
      } else {
        isVal = true;
      }

      if (isVal) {
        this.industrialSafetyHealthCommittee.mgtCommitteePsns = [];
        this.$_.forEach(
          this.industrialSafetyHealthCommittee.inMgtCommitteePsn,
          (item) => {
            this.industrialSafetyHealthCommittee.mgtCommitteePsns.push(item);
          }
        );
        this.$_.forEach(
          this.industrialSafetyHealthCommittee.outMgtCommitteePsn,
          (item) => {
            this.industrialSafetyHealthCommittee.mgtCommitteePsns.push(item);
          }
        );
        if (this.industrialSafetyHealthCommittee.committeeConfNo) {
          this.industrialSafetyHealthCommittee.updateUserId =
            this.$store.getters.token;
          this.saveUrl =
            transactionConfig.mgt.industrialSafetyHealthCommittee.edit.url;
          this.actionType = 'PUT';
          this.checkValidator('edit');
        } else {
          this.industrialSafetyHealthCommittee.createUserId =
            this.$store.getters.token;
          this.saveUrl =
            transactionConfig.mgt.industrialSafetyHealthCommittee.insert.url;
          this.actionType = 'POST';
          this.checkValidator('insert');
        }
      }
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (flag === 'appr') {
              this.popupOptions.target = () =>
                import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
              this.popupOptions.title = 'L0000003418'; /* 결재요청 */
              this.popupOptions.visible = true;
              this.popupOptions.closeCallback = this.closeApprPop;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                apprBizCd: 'MG-CM-01',
                apprParams: {
                  committeeConfNo:
                    this.industrialSafetyHealthCommittee.committeeConfNo,
                },
              };
            } else {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321' /* 확인 */,
                message: 'M0000000011' /* 저장하시겠습니까? */,
                // TODO : 필요시 추가하세요.
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.isSave = true;
                },
              });
            }
          } else {
            this.checkRequiredInput();
          }
        })
        .catch(() => {
          this.isSave = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006' /* 저장되었습니다. */,
        type: 'success',
      });
      this.popupParam.committeeConfNo = _result.data;
      this.industrialSafetyHealthCommittee.committeeConfNo = _result.data;

      this.tabParam.editable = true;
      this.tabParam.detailCheck = false;
      this.tabParam.refTableId = _result.data;
      this.tabParam.message = '';

      this.isSave = false;
      this.saveAttach();
      this.getDetail();
      this.loadComponent();
      console.log(
        '1212',
        this.industrialSafetyHealthCommittee.mgtCommitteeAgendas
      );
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.attachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.attachFileGrps[index].uploadTempFiles = data;
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
    changeUploadFilesPicture(data) {
      var index = this.$_.findIndex(this.attachFileGrpsPicture, {
        taskClassNm: data.taskClassNm,
      });

      if (index > -1) {
        data.index = index;
        this.attachFileGrpsPicture[index].uploadTempFiles = data;

        // 업로드 하기 위해 올라온 파일들을 저장하는 부분
        // 기존에 들어가 있는 경우에는 덮어쓰고 아닌 경우에는 신규로 넣는다.
        let saveIndex = this.$_.findIndex(this.saveAttachFilesPicture, {
          taskClassNm: data.taskClassNm,
        });
        if (saveIndex > -1) {
          this.saveAttachFilesPicture[saveIndex] = this.$_.clone(
            this.attachFileGrpsPicture[index]
          );
        } else {
          this.saveAttachFilesPicture.push(
            this.$_.clone(this.attachFileGrpsPicture[index])
          );
        }
      }
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.industrialSafetyHealthCommittee.committeeConfNo;
      });
      this.$_.forEach(this.attachFileGrpsPicture, (item) => {
        item.taskKey = this.industrialSafetyHealthCommittee.committeeConfNo;
      });

      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitObject.submitCheck = !this.submitObject.submitCheck;
      }
      if (this.saveAttachFilesPicture.length > 0) {
        this.submitObject.submitCheck = !this.submitObject.submitCheck;
      }
    },
    beforeDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        type: 'info',
        confirmCallback: () => {
          this.industrialSafetyHealthCommittees = [];
          this.industrialSafetyHealthCommittees.push(
            this.industrialSafetyHealthCommittee
          );
          this.deleteValue = {
            data: Object.values(
              this.$_.clone(this.industrialSafetyHealthCommittees)
            ),
          };
          this.isDelete = true;
        },
      });
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000007' /* 삭제되었습니다 */,
        type: 'success',
      });
      this.btnClosePopup();
    },
    /** /Button Event **/
    btnApprRequestClickedCallback() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            // 확인 callback 함수
            let isVal = false;
            if (
              this.industrialSafetyHealthCommittee.mgtCommitteeAgendas.length <
              1
            ) {
              window.getApp.$emit('APP_VALID_ERROR', 'M0000000923');
              return;
            } else {
              let mgt = false;
              this.$_.forEach(
                this.industrialSafetyHealthCommittee.mgtCommitteeAgendas,
                (item) => {
                  mgt = true;
                  if (item.agendaDesc === '') {
                    mgt = false;
                    window.getApp.$emit(
                      'APP_VALID_ERROR',
                      'M0000000005' /* 필수 입력값을 입력해 주세요. */
                    );
                    return;
                  }
                }
              );
              isVal = mgt;
            }

            if (isVal) {
              this.industrialSafetyHealthCommittee.mgtCommitteePsns = [];
              this.$_.forEach(
                this.industrialSafetyHealthCommittee.inMgtCommitteePsn,
                (item) => {
                  this.industrialSafetyHealthCommittee.mgtCommitteePsns.push(
                    item
                  );
                }
              );
              this.$_.forEach(
                this.industrialSafetyHealthCommittee.outMgtCommitteePsn,
                (item) => {
                  this.industrialSafetyHealthCommittee.mgtCommitteePsns.push(
                    item
                  );
                }
              );
              this.industrialSafetyHealthCommittee.updateUserId =
                this.$store.getters.token;
              this.saveUrl =
                transactionConfig.mgt.industrialSafetyHealthCommittee.edit.url;
              this.actionType = 'PUT';
              this.checkValidator('appr');
            }
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' /* 필수 입력값을 입력해 주세요. */
            );
          }
        })
        .catch(() => {
          this.isSave = false;
        });
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.isAppr = false;
      if (data && data.resultFlag) {
        this.disabled = true;
        this.getDetail();
      } else {
        this.getDetail();
      }
    },
  },
};
</script>
