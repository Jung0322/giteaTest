<!--
  목적 : 공통 > 결재승인 팝업
  Detail : 결재승인 화면
  *
  examples:
  *
  -->
  <template>
    <b-container fluid>
      <!-- 검색 -->
      <b-row ref="searchBox">
        <b-col sm="12">
          <b-row>
            <b-col sm="12">
              <!-- 결재선 -->
              <y-label
                label="L0000000429"
                icon="user-edit"
                color-class="cutstom-title-color"
              />
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 결재선변경 -->
                <y-btn
                  v-if="editable"
                  title="L0000000435"
                  color="blue"
                  @btnClicked="changeApprLine"
                />
                <!-- 결재승인 -->
                <y-btn
                  v-if="editable"
                  title="L0000000436"
                  color="black"
                  @btnClicked="confirmAppr"
                />
                <!-- 결재반려 -->
                <y-btn
                  v-if="editable"
                  title="L0000000426"
                  color="black"
                  @btnClicked="rejectAppr"
                />
                <!-- 닫기 -->
                <y-btn title="L0000000881" @btnClicked="closePop" />
              </div>
            </b-col>
          </b-row>
          <b-card>
            <b-row>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <b-row>
                  <b-col sm="2">
                    <!-- 결재선 -->
                    <y-label label="L0000000429" />
                  </b-col>
                  <b-col>
                    <b>
                      <span
                        v-for="(item, index) in apprRqst.apprLines"
                        :key="index"
                      >
                        <span
                          v-if="
                            item.apprStepCd == null &&
                              apprRqst.apprLines[index - 1] &&
                              apprRqst.apprLines[index - 1].apprStepCd == 'APSPA'
                          "
                        >
                          <font
                            v-if="item.delegatorId && item.delegatorId.length > 0"
                            color="#04B404"
                            >{{ item.delegatorNm }}({{
                              $comm.getLangSpecInfoLabel('L0000003849')
                            }})</font
                          >
                          <!-- 대기 -->
                          <font v-else color="#04B404"
                            >{{ item.apprUserNm }}({{
                              $comm.getLangSpecInfoLabel('L0000003849')
                            }})</font
                          >
                          <!-- 대기 -->
                        </span>
                        <span v-else>
                          <span
                            v-if="item.delegatorId && item.delegatorId.length > 0"
                            >{{ item.delegatorNm }}</span
                          >
                          <span v-else>{{ item.apprUserNm }}</span>
                        </span>
                        <span
                          v-if="
                            item.apprStepCd != null &&
                              index + 1 <= apprRqst.apprLines.length
                          "
                        >
                          <span
                            v-if="
                              index > 0 && index + 1 < apprRqst.apprLines.length
                            "
                            >({{ item.apprStepNm }})&nbsp;&nbsp;▶</span
                          >
                          <span
                            v-if="
                              index > 0 && index + 1 === apprRqst.apprLines.length
                            "
                            >({{ item.apprStepNm }})</span
                          >
                          <span v-if="index === 0"
                            >({{
                              $comm.getLangSpecInfoLabel('L0000003798')
                            }})&nbsp;&nbsp;▶</span
                          >
                          <!-- 기안 -->
                        </span>
                        <span
                          v-if="
                            item.apprStepCd == null &&
                              index + 1 < apprRqst.apprLines.length
                          "
                          >&nbsp;&nbsp;▷</span
                        >
                      </span>
                    </b>
                  </b-col>
                </b-row>
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 결재요청명 -->
                <y-text
                  :width="10"
                  :editable="false"
                  :maxlength="100"
                  ui="bootstrap"
                  label="L0000000439"
                  name="apprRqstNm"
                  v-model="apprRqst.apprRqstNm"
                />
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 결재의견 -->
                <y-textarea
                  :width="10"
                  :maxlength="500"
                  :editable="editable"
                  ui="bootstrap"
                  label="L0000000446"
                  name="apprRemark"
                  v-model="apprRqst.apprRemark"
                ></y-textarea>
              </b-col>
            </b-row>
          </b-card>
          <b-row class="mt-3"></b-row>
          <b-row>
            <b-col sm="12">
              <!-- 결재 상세 내용 -->
              <y-label
                label="L0000000418"
                icon="user-edit"
                color-class="cutstom-title-color"
              />
              <y-label v-if="apprCnt > 1" :label="$comm.getLangSpecInfoLabel('L0000003405', { s1: apprCnt ? apprCnt : 0 })" style="font-size:15px;" />
              <div v-if="apprCnt > 1" slot="buttonGroup" class="float-right mb-1">
                <!-- 이전 -->
                <y-btn title="< Prev" @btnClicked="movePrev" />
                <!-- 다음 -->
                <y-btn title="Next >" @btnClicked="moveNext" />
              </div>
            </b-col>
          </b-row>
          <b-card>
            <b-row>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <el-tabs type="border-card" v-model="tabIndex">
                  <el-tab-pane
                    v-for="(item, i) in tabItems"
                    :key="i"
                    stretch
                    class="default-tab-pane"
                  >
                    <span v-if="tabItems.length === 1" slot="label">
                      <i class="el-icon-date"></i>
                      {{ item.title }}
                    </span>
                    <span v-if="tabItems.length !== 1" slot="label">
                      <i class="el-icon-date"></i>
                      {{ item.title + ' ' + (i + 1) }}
                    </span>
                    <keep-alive>
                      <component 
                        ref="apprDetail"
                        :is="component"
                        v-if="component"
                        :popupParam.sync="apprParams[i]"
                      />
                    </keep-alive>
                  </el-tab-pane>
                </el-tabs>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
      <y-dialog :param="popupOptions"></y-dialog>
    </b-container>
  </template>
  
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'com-appr-multi-confirm',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        apprParams: {},
      }),
    },
  },
  data() {
    return {
      apprRqst: {
        apprBizNo: 0, // 결재문서마스터번호
        plantCd: '', // 사업장코드
        apprReqParameter: '', // 결재요청파라미터
        reqUserId: '', // 요청자 ID
        apprLines: [], // 결재선 목록
        apprRemark: '', // 결재의견
        apprRqstNm: '', // 결재요청명
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '500px',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      apprParams: [], // 콤포넌트 전달 파라미터
      component: null, // 콤포넌트
      getUrl: '', // 결재 정보 상세 조회 url
      editUrl: '', // 결재 상태 변경 url
      tabIndex: 0,
      tabItems: [],
      apprCnt: 0,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.getUrl = selectConfig.manage.appr.getline.url;
      this.editUrl = transactionConfig.manage.appr.edit.url;
      this.$_.extend(this.apprRqst, this.popupParam.apprParams);

      if (this.apprRqst.apprStepCd !== null) {
        this.editable = false;
      }

      this.getApprLine(); // 결재선 조회   
    },
    // 결재선 정보 상세 조회
    getApprLine() {
      this.$http.url = this.$format(
        this.getUrl,
        this.popupParam.apprParams.apprRqstNo
      );
      this.$http.type = 'GET';      
      this.$http.request(
        _result => {
          this.apprRqst.apprLines = this.$_.clone(_result.data); // 결재선
 
          // 콤포넌트 전달 파라미터
          let params = this.$_.split(this.apprRqst.apprReqParameter, '|');            
          this.$_.forEach(params, element => {       
            if (element !== '')
            {
              this.apprCnt = this.$_.split(this.$_.split(element, ':')[1], ',').length;
            }             
          });      

          for (let i = 0; i < this.apprCnt; i++)
          {
            this.apprParams.push({ apprFlag: true, apprConfirmFlag: true });
            this.tabItems.push({ title: this.$comm.getLangSpecInfoLabel('L0000005148'), url: this.apprRqst.apprUrl });

            this.$_.forEach(params, element => {                
              this.apprParams[i][this.$_.split(element, ':')[0]] = this.$_.split(this.$_.split(element, ':')[1], ',')[i];                
            });              

            this.loadComponent();  
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 걸재 상세 내용 첨부
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;      
      this.component = () => import(`@/pages${path}`);
    },
    // 결재선변경
    changeApprLine() {
      this.popupOptions.target = () => import(`${'./comApprLinePopup.vue'}`);
      this.popupOptions.title = 'L0000000435'; // 결재선 변경
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprLinePop;
      this.popupOptions.width = '95%';
      this.popupOptions.param = {
        apprLines: this.apprRqst.apprLines,
        isApprInProgress: true,
        apprRqstNo: this.apprRqst.apprRqstNo,
      };
    },
    closeApprLinePop(data) {
      this.apprRqst.apprLines = data.apprLineList;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getApprLine();
    },
    // 닫기
    closePop() {
      this.$emit('closePopup', {});
    },
    // 결재승인
    confirmAppr() {
      this.editApprStep('APSPA');
    },
    // 결재반려
    rejectAppr() {
      this.editApprStep('APSPD');
    },
    editApprStep(apprStepCd) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: apprStepCd === 'APSPA' ? 'M0000000843' : 'M0000000844', // 결재승인 하시겠습니까? 결재반려 하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          /**
           * 2022.03.11 LHJ
           * 결재승인시 업무별 데이터 저장 후 결재승인처리
           * 결재반려시 바로 결재반려처리
           */
          if (apprStepCd === 'APSPA') {
            let func = this.$refs.apprDetail.apprSave;

            if (func && typeof func === 'function') {
              func().then(_result => {
                if (_result) {
                  if (_result === 'validationError') {
                    return;
                  }
                  this.saveAppr(apprStepCd);
                } else {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003396', // 에러
                    message:
                      apprStepCd === 'APSPA' ? 'M0000000925' : 'M0000000926', // 결재승인 처리 중 오류가 발생했습니다. 결재반려 처리 중 오류가 발생했습니다.
                    type: 'error',
                  });
                  return;
                }
              });
            }
            else {
              this.saveAppr(apprStepCd);
            }
          } else {
            let func = this.$refs.apprDetail.apprDeny;

            if (func && typeof func === 'function') {
              func().then(_result => {
                if (_result) {
                  if (_result === 'validationError') {
                    return;
                  }
                  this.saveAppr(apprStepCd);
                } else {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003396', // 에러
                    message:
                      apprStepCd === 'APSPA' ? 'M0000000925' : 'M0000000926', // 결재승인 처리 중 오류가 발생했습니다. 결재반려 처리 중 오류가 발생했습니다.
                    type: 'error',
                  });
                  return;
                }
              });
            } else {
              this.saveAppr(apprStepCd);
            }
          }
        },
        cancelCallback: () => {},
      });
    },
    saveAppr(apprStepCd) {
      this.$http.url = this.editUrl;
      this.$http.type = 'PUT';
      this.$http.param = {
        apprRqstNo: this.apprRqst.apprRqstNo,
        lineSeqNo: this.apprRqst.lineSeqNo,
        apprUserId: this.$store.getters.token,
        apprStepCd: apprStepCd,
        apprRemark: this.apprRqst.apprRemark,
      };
      this.$http.request(
        _result => {
          if (_result.data > 0) {
            this.$root.$emit('UPDATE_APPR_STATUS');
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message:
                apprStepCd === 'APSPA' ? 'M0000000845' : 'M0000000846', // 결재승인 되었습니다. 결재반려 되었습니다.
              type: 'success', // success / info / warning / error
            });
            this.closePop();
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003396', // 에러
              message:
                apprStepCd === 'APSPA' ? 'M0000000925' : 'M0000000926', // 결재승인 처리 중 오류가 발생했습니다. 결재반려 처리 중 오류가 발생했습니다.
              type: 'error',
            });
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // Detail 이전
    movePrev() {      
      if (Number(this.tabIndex) > 0)
      {
        this.tabIndex = (Number(this.tabIndex) - 1).toString();
      }
    },
    // Detail 다음
    moveNext() {
      if (Number(this.tabIndex) < this.tabItems.length - 1)
      {
        this.tabIndex = (Number(this.tabIndex) + 1).toString();
      }
    },
    /** method end */
  },
};
</script>
  