<!--
  목적 : 그룹웨어 > 결재승인 화면
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
          <b-col sm="12" class="mt-3">
            <y-label label="결재선" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn
                v-if="editable"
                title="결재승인"
                color="black"
                @btnClicked="confirmAppr"
              />
              <y-btn
                v-if="editable"
                title="결재반려"
                color="black"
                @btnClicked="rejectAppr"
              />
            </div>
          </b-col>
        </b-row>
        <b-card >
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="2">
                  <y-label label="결재선" />
                </b-col>
                <b-col>
                  <b>
                    <span v-for="(item, index) in apprRqst.apprLines" :key="index">
                      <span v-if="item.apprStepCd == null && apprRqst.apprLines[index-1].apprStepCd == 'APSPA'">
                        <font color="#04B404">{{item.apprUserNm}}(대기)</font>
                      </span>
                      <span v-else>
                        {{item.apprUserNm}}
                      </span>
                      <span v-if="item.apprStepCd != null && index + 1 <= apprRqst.apprLines.length">
                        <span v-if="index > 0 && index + 1 < apprRqst.apprLines.length">
                          ({{item.apprStepNm}})&nbsp;&nbsp;▶
                        </span>
                        <span v-if="index > 0 && index + 1 === apprRqst.apprLines.length">
                          ({{item.apprStepNm}})
                        </span>
                        <span v-if="index === 0">
                          (기안)&nbsp;&nbsp;▶
                        </span>
                      </span>
                      <span v-if="item.apprStepCd == null && index + 1 < apprRqst.apprLines.length">
                        &nbsp;&nbsp;▷
                      </span>
                    </span>
                  </b>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-text
                :width="10"
                :editable="false"
                :maxlength="100"
                ui="bootstrap"
                label="결재요청명"
                name="apprRqstNm"
                v-model="apprRqst.apprRqstNm"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-textarea
                :width="10"
                :maxlength="500"
                :editable="editable"
                ui="bootstrap"
                label="결재의견"
                name="apprRemark"
                v-model="apprRqst.apprRemark"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
        <b-row class="mt-3"></b-row>
        <b-row>
          <b-col sm="12">
            <y-label label="결재 상세 내용" icon="user-edit" color-class="cutstom-title-color" />
          </b-col>
        </b-row>
        <b-card >
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <component
                :is="component"
                :popupParam.sync="apprParams"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'groupware-appr',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        apprParams: {},
      }),
    },
  },
  data () {
    return {
      apprRqst: {
        apprBizNo: 0, // 결재문서마스터번호
        apprRqstNo: 0, // 결재요청번호
        lineSeqNo: 0, // 결재선순번

        plantCd: '', // 사업장코드
        apprReqParameter: '', // 결재요청파라미터
        reqUserId: '', // 요청자 ID
        apprLines: [], // 결재선 목록
        apprRemark: '', // 결재의견
        apprRqstNm: '', // 결재요청명
      },
      apprParams: {
        apprFlag: true,
      }, // 콤포넌트 전달 파라미터
      component: null, // 콤포넌트
      getUrl: '', // 결재선 정보 상세 조회 url
      getDetailUrl: '', // 결재 상세 정보 조회 url
      editUrl: '', // 결재 상태 변경 url
      loading: {
        loadingInstance: null,
        passCount: 0,
      },
      editable: false,
    }
  },
  created () {
    window.getApp = this;
    this.$on('LOADING_PASS_COUNT', this.setLoadingPassCount);
    this.$on('LOADING_SHOW', this.loadingShow);
    this.$on('LOADING_HIDE', this.loadingHide);
  },
  beforeMount () {
    this.$store
      .dispatch('sso')
      .then(() => {
        this.loading = false;
        Object.assign(this.$data, this.$options.data());
        this.init();
      })
      .catch(error => {
        this.$store
          .dispatch('LogOut')
          .then(() => {
            this.$router.push({ path: this.redirect || '/ssoFail' });
          })
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            this.$router.push({ path: this.redirect || '/ssoFail' });
          });
        // this.$comm.movePage(this.$router, '/404');
      });
  },
  mounted () {
  },
  methods: {
    init () {
      this.getUrl = selectConfig.manage.appr.getline.url;
      this.getDetailUrl = selectConfig.manage.appr.groupwareDetail.url;
      this.editUrl = transactionConfig.manage.appr.edit.url;

      this.apprRqst.apprBizNo = this.$route.query.apprBizNo;
      this.apprRqst.apprRqstNo = this.$route.query.apprRqstNo;
      this.apprRqst.lineSeqNo = this.$route.query.lineSeqNo;

      this.getApprLine(); // 결재선 조회
    },
    setLoadingPassCount(_count) {
      this.loading.passCount = _count;
    },
    loadingShow(_option) {
      if (this.loading.passCount === 0) {
        this.loading.loadingInstance = this.$loading({
          lock: true,
          text: 'Loading...',
          background: 'rgba(0, 0, 0, 0.7)',
        });
      } else this.loading.passCount--;
    },
    loadingHide(_result) {
      this.$nextTick(() => {
        if (this.loading.loadingInstance) {
          this.loading.loadingInstance.close();
        }
      });
    },
    requestSuccess(_message) {
      if (!_message) return;
      this.alert({
        title: '안내',
        message: _message,
        type: 'success',
      });
    },
    requestError(_message) {
      if (!_message) return;
      this.alert({
        title: '에러',
        message: _message,
        type: 'error',
      });
    },
    confirm(_option) {
      var type = '';
      if (_option.hasOwnProperty('type')) type = _option.type;
      this.$confirm(_option.message, _option.title, {
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        type: type,
      })
        .then(
          typeof _option.confirmCallback === 'function'
            ? _option.confirmCallback
            : null
        )
        .catch(
          typeof _option.cancelCallback === 'function'
            ? _option.cancelCallback
            : null
        );
    },
    // 결재선 정보 상세 조회
    getApprLine () {
      this.$http.url = this.$format(this.getUrl, this.apprRqst.apprRqstNo);
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.apprRqst.apprLines = this.$_.clone(_result.data); // 결재선
          setTimeout(() => {
            this.getApprDetail(); // 결재 상세 정보 조회
          }, 300);
        },
        _error => {
          this.requestError(_error);
        }
      );
    },
    // 결재 상세 조회
    getApprDetail () {
      this.$http.url = this.$format(this.getDetailUrl, this.apprRqst.apprRqstNo);
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.$_.extend(this.apprRqst, _result.data);

          // 콤포넌트 전달 파라미터
          let params = this.$_.split(this.apprRqst.apprReqParameter, '|');
          this.$_.forEach(params, element => {
            let paramMap = this.$_.split(element, ':');
            if (paramMap.length === 2) {
              this.apprParams[paramMap[0]] = paramMap[1];
            }
          });
  
          this.loadComponent(this.apprRqst.apprUrl); // 콤포넌트 호출
          this.$_.forEach(this.apprRqst.apprLines, item => {
            if (Number(item.lineSeqNo) === Number(this.$route.query.lineSeqNo)) {
              if (item.apprStepCd) {
                this.editable = false;
              } else {
                let beforeIdx = Number(item.lineSeqNo) - 1;
                if (beforeIdx < 0) beforeIdx = 0;
                if (this.apprRqst.apprLines[beforeIdx].apprStepCd) {
                  this.editable = true;
                } else {
                  this.editable = false;
                }
              }
            }
          });
        },
        _error => {
          this.requestError(_error);
        }
      );
    },
    // 걸재 상세 내용 첨부
    loadComponent (url) {
      this.component = () => import(`@/pages${url}`)
    },
    // 결재승인
    confirmAppr () {
      this.editApprStep('APSPA', '결재승인');
    },
    // 결재반려
    rejectAppr () {
      this.editApprStep('APSPD', '결재반려');
    },
    editApprStep (apprStepCd, comment) {
      this.confirm({
        title: '확인',
        message: comment + ' 하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.editUrl;
          this.$http.type = 'PUT';
          this.$http.param = {
            apprRqstNo: this.apprRqst.apprRqstNo,
            lineSeqNo: this.$route.query.lineSeqNo,
            apprUserId: this.$store.getters.token,
            apprStepCd: apprStepCd,
            apprRemark: this.apprRqst.apprRemark,
          };
          this.$http.request(
            _result => {
              if (_result.data > 0) {
                window.getApp.$emit('ALERT', {
                  title: '안내',
                  message: comment + ' 처리되었습니다.',
                  type: 'success', // success / info / warning / error
                });
                this.getApprLine();
              } else {
                window.getApp.$emit('ALERT', {
                  title: '에러',
                  message: comment + ' 처리 중 오류가 발생했습니다.',
                  type: 'error',
                });
              }
            },
            _error => {
              this.requestError(_error);
            }
          );
        },
        cancelCallback: () => {
        }
      });
    },
    /** method end */
  },
}
</script>