<!--
  목적 : 근골격계 결과등록 및 결재요청
  Detail : 근골격계 결과등록 및 결재요청
  examples:
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 체크리스트 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 부담작업 조사 등록 -->

            <y-label
              label="L0000004713"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 조사결과 양식 다운로드 -->
              <y-btn
                v-if="editable && !resultDisabled"
                :width="8"
                title="L0000004876"
                color="blue"
                @btnClicked="excelDownTemplate"
              />
              <!-- 조사결과 업로드 -->
              <y-btn
                v-if="editable && !resultDisabled"
                :width="8"
                title="L0000004875"
                color="blue"
                @btnClicked="btnExcelUploadClicked"
              />
              <!-- 결과완료 -->
              <y-btn
                v-if="plan.planMode && editable"
                :action-url="allCompleteUrl"
                :param="muscResearch"
                :is-submit="isAllComplete"
                title="L0000000412"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeComplete"
                @beforeComplete="beforeAllComplete"
                @btnClicked="btnAllFinishClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-plant
                :width="8"
                type="edit"
                :editable="editable"
                :disabled="true"
                name="plantCd"
                v-model="muscResearch.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 년도 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="true"
                type="year"
                label="L0000000829"
                name="year"
                :default="muscResearch.year"
                v-model="muscResearch.year"
              ></y-datepicker>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 조사계획명 -->
              <y-text
                :width="10"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000004373"
                name="researchNm"
                v-model="muscResearch.researchNm"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 조사내용 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002648"
                name="researchDesc"
                v-model="muscResearch.researchDesc"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 조사기관 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002647"
                name="researchOrgNm"
                v-model="muscResearch.researchOrgNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 조사기간 -->
              <y-datepicker
                :width="8"
                :range="true"
                :editable="editable"
                :disabled="true"
                label="L0000002647"
                name="period"
                :default="muscResearch.period"
                v-model="muscResearch.period"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3 mb-3">
              <!-- 조사대상부서,  부서 추가 -->
              <y-tag-structure
                :width="8"
                itemText="deptNm"
                itemValue="deptCd"
                label="L0000004264"
                :newLabelText="$comm.getLangSpecInfoLabel('L0000001300')"
                :editable="editable"
                :disabled="true"
                :name="'muscResearchDepts'"
                v-model="muscResearch.muscResearchDepts"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-4">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="muscResearch.remark"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
        <el-tabs
          type="border-card"
          v-model="tabIndex"
          class="mt-3"
          @tab-click="tabClick"
        >
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
          <component
            :is="component"
            v-if="component"
            :muscResearch.sync="muscResearch"
            :tabEditable="!resultDisabled"
            :disabled="disabled"
            :tabParam.sync="tabParam"
            :plan.sync="plan"
            :harmsur.sync="harmsur"
            :allDept="allDept"
            ref="chkRsltDetailRef"
            sm="12"
            :attachFileGrps.sync="attachFileGrps"
            :paneName="paneName"
            @reloadChkRsltDetail="getDetail"
          />
          <!-- :harmfulsur.sync="harmfulsur" -->
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
  /** attributes: name, components, props, data **/
  name: 'check-result-detail-list',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          muscResearchNo: 0,
          muscResearchStateCd: '',
        };
      },
    },
  },
  data() {
    return {
      muscResearch: {
        muscResearchNo: 0,
        muscResearchDeptNo: 0,
        deptCd: '',
        plantCd: '',
        period: [],
        researchStartDt: '',
        researchEndDt: '',
        researchDesc: '',
        researchOrgNm: '',
        researchNm: '',
        muscResearchStateCd: '',
        remark: '',
        createUserId: '',
        updateUserId: '',
        harmfulUpdateDt: '',
        muscResearchDepts: [],
      },
      plan: {
        planMode: false,
      },
      harmsur: {
        surveyMode: false,
      },
      harmful: {
        createUserId: '',
      },
      attachFileGrps: [],
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      // // 개선조치를 위한 변수
      tabParam: {
        imprClassCd: 'ICL14',
        refTableId: 0,
        editable: true,
        editable2: true,
        detailCheck: false,
        plantCd: '',
      },
      editable: true,
      disabled: false,
      resultDisabled: false,
      tabItems: [],
      paneName: '',
      searchUrl: '',
      completeUrl: '',
      isComplete: false,
      component: null,
      tabIndex: 0,
      allDept: false,
      allCompleteUrl: '',
      isAllComplete: false,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'plan.planMode'() {
      if (this.plan.planMode) {
        this.muscResearch.muscResearchStateCd = 'HMCS3';
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.tabItems = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000872'),
          url: './unitWork',
        }, // 단위작업
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002642'),
          url: './surveyResult',
        }, // 조사결과
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002394'),
          url: './workCategoryTableNew',
        }, // 작업분류표
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002843'),
          url: 'multiFileUpload',
        }, // 첨부파일
      ];
      this.searchUrl = selectConfig.hea.muscResearch.get.url;
      this.completeUrl = transactionConfig.hea.muscResearchResult.complete.url;
      this.allCompleteUrl =
        transactionConfig.hea.muscResearchResult.allComplete.url;

      this.getDetail();
    },
    // 탭
    loadComponent() {
      // this.tabIndex
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === 'imprActTab') {
        this.component = () => import('@/pages/impr/imprActTab');
      } else this.component = () => import(`${path}`);
    },
    getDetail() {
      if (!this.popupParam.muscResearchNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000456', // 관리자에게 문의바랍니다.
          type: 'warning',
        });
        this.closePopup();
        return;
      }
      this.$http.url = this.$format(
        this.searchUrl,
        this.popupParam.muscResearchNo
      );
      this.$http.type = 'get';

      this.$http.request(
        (_result) => {
          this.muscResearch = this.$_.clone(_result.data);
          this.muscResearch.period = [
            _result.data.researchStartDt,
            _result.data.researchEndDt,
          ];
          let sendYn = false;
          let cntSurveyResult = 0;
          let sendYnTot = false;
          let cntSurveyResultTot = 0;
          if (!this.muscResearch.muscResearchDepts) {
            this.muscResearch.muscResearchDepts = [];
          } else {
            let info = this.$_.find(this.muscResearch.muscResearchDepts, {
              deptCd: this.$store.getters.deptCd,
            });
            if (info) {
              sendYn = info.sendYn === 'Y';
              cntSurveyResult = info.cntSurveyResult;

              /**
               * 조사부서 키 값 셋팅
               *
               * 해당 상세 팝업에서는 결과완료 시 조사부서의 제출여부를 Y로 변경해야 함
               * 그리고 자신의 부서 정보만 보게 됨으로 단 하나의 조사부서 키 값을 가져와 셋팅 가능
               * 따라서 다음과 같이 셋팅
               *
               *
               * (실제로는 근골격계 질환조사 밑에 여러개의 조사부서가 붙으므로 하나의 조사부서 키 값을 가지고 올 수 없음)
               */
              this.muscResearch.muscResearchDeptNo = info.muscResearchDeptNo;
              this.muscResearch.deptCd = info.deptCd;
            }
          }

          if (
            this.muscResearch.muscResearchStateCd === 'HMCS4' ||
            this.muscResearch.muscResearchStateCd === 'HMCS5' ||
            this.muscResearch.muscResearchStateCd === 'HMCS6' ||
            this.muscResearch.muscResearchStateCd === 'HMCS7'
          ) {
            this.tabItems.splice(3, 0, {
              title: this.$comm.getLangSpecInfoLabel('L0000002173'), // 유해요인조사
              url: './harmful',
            });
            this.tabItems.splice(4, 0, {
              title: this.$comm.getLangSpecInfoLabel('L0000000259'), // 개선사항
              url: 'imprActTab',
            });
            this.tabParam.refTableId = this.popupParam.muscResearchNo;
            // this.tabParam.plantCd = this.muscResearch.plantCd;
            this.tabParam.editable = false;
            this.tabParam.editable2 = false;
          }

          if (this.muscResearch.muscResearchStateCd === 'HMCS3') {
            if (sendYn) {
              this.plan.planMode = false;
              this.resultDisabled = false;
              this.disabled = true;
            } else {
              if (cntSurveyResult > 0) {
                // 저장된 조사결과 데이터가 있다면 결과완료 버튼 보이도록 처리
                this.plan.planMode = true;
              } else {
                this.plan.planMode = false;
              }
              this.resultDisabled = false;
              this.disabled = false;
            }
          } else if (this.muscResearch.muscResearchStateCd === 'HMCS2') {
            this.resultDisabled = false;
          } else {
            this.resultDisabled = true;
            this.disabled = true;
            this.plan.planMode = false;
          }

          /**
           * 2021-12-08 kdh
           *
           * 조사부서가 결과를 입력하도록 변경
           * 단, 예외로 전사담당자, 시스템관리자 권한의 경우엔 결과를 입력 가능
           */

          // if (this.$_.findIndex(this.muscResearch.muscResearchDepts, { deptCd: this.$store.getters.deptCd }) === -1) {
          //   let userAuthGrps = this.$store.getters.userAuthGrps;
          //   userAuthGrps = this.$_.filter(userAuthGrps, { settingYn: 'Y' })
          //   if (userAuthGrps && userAuthGrps.length > 0) {
          //     let idx = this.$_.findIndex(userAuthGrps, userAuthGrp => {
          //       return this.$_.indexOf(['1022', '1090'], userAuthGrp.authGrpNo) > -1
          //     })
          //     if (idx === -1) {
          //       this.resultDisabled = true;
          //       this.disabled = true;
          //       this.plan.planMode = false;
          //     } else {
          //       this.allDept = true;
          //     }
          //   } else {
          //     this.resultDisabled = true;
          //     this.disabled = true;
          //     this.plan.planMode = false;
          //   }
          // }

          this.allDept = this.editable;

          /**
           * 2021-12-17 lhj
           *
           * 단위작업 조사담당자일 경우 쓰기권한 추가
           */
          let researchUser = this.$_.find(this.muscResearch.muscResearchDepts, {
            researchUserId: this.$store.getters.token,
          });

          this.editable = researchUser ? true : this.editable;

          /**
           * 2021-12-28 lhj
           *
           * 조사부서가 결과를 완료
           * 단, 예외로 전사담당자, 시스템관리자 권한의 경우엔 전체 조사부서에 대한 결과완료 가능
           */
          let sendYnStr = '';
          this.muscResearch.muscResearchDepts.forEach((dept) => {
            sendYnStr += dept.sendYn;
            cntSurveyResultTot += dept.cntSurveyResult;
          });

          sendYnTot = !sendYnStr.includes('N');
          if (this.allDept && cntSurveyResultTot > 0 && !sendYnTot) {
            this.plan.planMode = true;
            this.resultDisabled = false;
            this.disabled = false;
          }

          this.setAttachFileGrps(); // 첨부파일 셋팅
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    beforeComplete() {
      if (this.popupParam.muscResearchNo) {
        this.checkValidator('complete');
      }
    },
    beforeAllComplete() {
      if (this.popupParam.muscResearchNo) {
        this.checkValidator('allcomplete');
      }
    },
    checkValidator(checkMode) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000838', // 완료하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.muscResearch.createUserId = this.$store.getters.token;
                this.muscResearch.updateUserId = this.$store.getters.token;
                if (checkMode === 'complete') {
                  this.isComplete = true;
                } else {
                  this.isAllComplete = true;
                }
              },
            });
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' // '필수 입력값을 입력해 주세요.',
            );
          }
        })
        .catch(() => {
          this.isComplete = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    // 완료
    btnFinishClickedCallback(_result) {
      if (_result.data === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003396', // 에러
          message: 'M0000000457', // 완료 처리하는 중 오류가 발생했습니다.
          type: 'error',
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000078', // 완료되었습니다.
          type: 'success',
        });
        this.getDetail();
        this.isComplete = false;
      }
    },
    // 완료
    btnAllFinishClickedCallback(_result) {
      if (_result.data === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003396', // 에러
          message: 'M0000000457', // 완료 처리하는 중 오류가 발생했습니다.
          type: 'error',
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000078', // 완료되었습니다.
          type: 'success',
        });
        this.getDetail();
        this.isAllComplete = false;
      }
    },
    closePopup() {
      this.$emit('closePopup');
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isComplete = false;
      this.isAllComplete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    setAttachFileGrps() {
      let taskKey = this.popupParam.muscResearchNo
        ? this.popupParam.muscResearchNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000002843', // 첨부파일
          listType: 'text',
          drag: !this.disabled,
          showFileSearch: false,
          showUploadBtn: !this.disabled,
          editable: this.editable,
          disabled: this.disabled,
          onlyDownload: this.disabled,
          limit: 10,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'MUSC_SURVEY',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    tabClick(tab) {
      var date = new Date();
      this.paneName = String(date.getTime());
    },
    excelDownTemplate() {
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = selectConfig.hea.muscResearch.excelSample.url; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.param = {};
      this.$http.request(
        (_result) => {
          var fileOrgNm =
            '단위작업_및_조사결과_양식' +
            this.$comm.moment().format('YYYYMMDD') +
            '.xlsx';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnExcelUploadClicked() {
      this.popupOptions.target = () =>
        import(`${'./checkResultDetailListUpload.vue'}`);
      this.popupOptions.title = 'L0000004874'; // 단위작업 및 조사결과 엑셀 업로드
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        muscResearchNo: this.muscResearch.muscResearchNo,
      };
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupExcelUpload;
    },
    closePopupExcelUpload() {
      this.getDetail();
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.$refs.chkRsltDetailRef.init();
    },
  },
};
</script>
