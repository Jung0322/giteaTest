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
            <!-- 유해요인조사및평가 등록 -->
            <y-label
              label="L0000004715"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 조사완료 -->
              <y-btn
                v-if="editable && harmsur.surveyMode"
                :action-url="completeUrl"
                :param="muscResearch"
                :is-submit="isComplete"
                title="L0000004714"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeComplete"
                @beforeComplete="beforeComplete"
                @btnClicked="btnFinishClickedCallback"
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
                :width="baseWidth"
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
                :width="baseWidth"
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
                label="L0000002646"
                name="period"
                :default="muscResearch.period"
                v-model="muscResearch.period"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3 mb-3">
              <!-- 조사대상부서, 부서 추가 -->
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
          <keep-alive>
            <component
              :is="component"
              v-if="component"
              :muscResearch.sync="muscResearch"
              :tabEditable="false"
              :disabled="disabled"
              :tabParam.sync="tabParam"
              :plan.sync="plan"
              :harmsur.sync="harmsur"
              :allDept="true"
              sm="12"
              :attachFileGrps.sync="attachFileGrps"
              :paneName="paneName"
              :tabIndex="paneName"
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
  /** attributes: name, components, props, data **/
  name: 'check-result-harmful-detail',
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
        editable: false,
        editable2: false,
        detailCheck: false,
        plantCd: '',
      },
      editable: true,
      disabled: false,
      tabItems: [],
      paneName: '',
      searchUrl: '',
      completeUrl: '',
      isComplete: false,
      baseWidth: 8,
      component: null,
      tabIndex: 0,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
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
      this.searchUrl = selectConfig.hea.muscResearch.get.url;
      this.completeUrl = transactionConfig.hea.muscResearchResult.complete.url;
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
          title: this.$comm.getLangSpecInfoLabel('L0000002173'),
          url: './harmful',
        }, // 유해요인조사
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000259'),
          url: 'imprActTab',
        }, // 개선사항
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002843'),
          url: 'multiFileUpload',
        }, // 첨부파일
      ];
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
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.muscResearch = this.$_.clone(_result.data);
          this.tabParam.muscResearchStateCd =
            this.muscResearch.muscResearchStateCd;
          this.muscResearch.period = [
            _result.data.researchStartDt,
            _result.data.researchEndDt,
          ];
          if (!this.muscResearch.muscResearchDepts) {
            this.muscResearch.muscResearchDepts = [];
          }

          this.tabParam.refTableId = this.popupParam.muscResearchNo;
          // this.tabParam.plantCd = this.muscResearch.plantCd;

          if (this.muscResearch.muscResearchStateCd === 'HMCS5') {
            this.harmsur.surveyMode = true;
            this.disabled = false;
          } else if (this.muscResearch.muscResearchStateCd === 'HMCS4') {
            this.disabled = false;
            this.harmsur.surveyMode = false;
          } else {
            this.harmsur.surveyMode = false;
            this.disabled = true;
            this.tabParam.detailCheck = true;
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
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000838', // 완료하시겠습니까?
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            this.muscResearch.createUserId = this.$store.getters.token;
            this.muscResearch.updateUserId = this.$store.getters.token;
            this.isComplete = true;
          },
        });
      }
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
    closePopup() {
      this.$emit('closePopup');
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isComplete = false;
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
  },
};
</script>
