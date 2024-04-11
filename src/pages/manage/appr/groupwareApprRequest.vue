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
    <b-row>
      <b-col sm="12">
        <b-row v-if="rejectFlag">
          <b-col sm="12">
            <y-label label="결재선" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn
                title="재결재요청"
                color="black"
                @btnClicked="requestAppr"
              />
              <y-btn
                title="결재선변경"
                color="blue"
                @btnClicked="changeApprLine"
              />
            </div>
          </b-col>
        </b-row>
        <b-card v-if="rejectFlag">
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="2">
                  <y-label label="결재선" />
                </b-col>
                <b-col>
                  <b>
                    <span v-for="(item, index) in apprRqst.apprLines" :key="index">
                      {{item.userNm}}
                      <span v-if="index + 1 < apprRqst.apprLines.length">&nbsp;&nbsp;▷</span>
                    </span>
                  </b>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-text
                :width="10"
                :editable="true"
                :required="true"
                :maxlength="100"
                ui="bootstrap"
                label="결재요청명"
                name="apprRqstNm"
                v-model="apprRqst.apprRqstNm"
                v-validate="'required'"
                :state="validateState('apprRqstNm')"
              />
            </b-col>
          </b-row>
        </b-card>

        <b-row class="mt-3">
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <y-data-table 
                ref="dataTable"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :label="rejectFlag ? '결재 이력' : '결재 현황'"
                >
              </y-data-table>
            </b-col>
          </b-col>
        </b-row>
        <b-row class="mt-3"></b-row>
        <b-row>
          <b-col sm="12">
            <y-label label="결재 상세 내용" icon="user-edit" color-class="cutstom-title-color" />
          </b-col>
        </b-row>
        <b-card >
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mb-3" v-if="!rejectFlag">
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
              <component
                :is="component"
                :popupParam.sync="apprParams"
              />
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
  name: 'groupware-appr-request',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        apprBizNo: 0,
        apprRqstNo: 0
      }),
    },
  },
  data () {
    return {
      apprRqst: {
        apprLines: [], // 결재선 목록
        apprRqstNm: null, // 결재요청명
      },
      apprParams: {
        apprFlag: true,
      }, // 콤포넌트 전달 파라미터
      gridOptions: {
        header: [],
        data: [],
        height: '300'
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '500px',
        top: '50px',
        param: {},
        closeCallback: null
      },
      component: null, // 콤포넌트
      getUrl: '', // 결재 정보 상세 조회 url
      insertUrl: '',
      rejectFlag: false,
      loading: {
        loadingInstance: null,
        passCount: 0,
      },
    }
  },
  created () {
    window.getApp = this;
    this.$on('LOADING_PASS_COUNT', this.setLoadingPassCount);
    this.$on('LOADING_SHOW', this.loadingShow);
    this.$on('LOADING_HIDE', this.loadingHide);
    this.$on('CONFIRM', this.confirm);
    this.$on('ALERT', this.alert);
  },
  beforeMount () {
    // this.loading = true;
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
  methods: {
    init () {
        
      this.getUrl = selectConfig.manage.appr.getRejectDetail.url;
      this.insertUrl = transactionConfig.manage.apprRequest.edit.url;

      this.apprRqst.apprBizNo = this.$route.query.apprBizNo;
      this.apprRqst.apprRqstNo = this.$route.query.apprRqstNo;

      this.gridOptions.header = [
        { text: '결재진행단계', name: 'apprStepNm', width: '100px', align: 'center' },
        { text: '결재유형', name: 'apprTypeNm', width: '100px', align: 'center' },
        { text: '결재부서', name: 'apprUserDeptNm', width: '100px', align: 'center' },
        { text: '결재자', name: 'apprUserNm', width: '100px', align: 'center' },
        { text: '결재일시', name: 'apprDt', width: '100px', align: 'center' },
        { text: '결재의견', name: 'apprRemark', width: '300px' },
      ]

      this.getApprLineDetail(); // 결재 정보 상세 조회 (반려 이력포함)
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
    /**
     * window.alert 대체 함수
     */
    alert(_option) {
      var type = '';
      if (_option.hasOwnProperty('type')) type = _option.type;
      this.$alert(_option.message, _option.title, {
        confirmButtonText: '확인',
        type: type,
        callback:
          typeof _option.callback === 'function'
            ? _option.callback
            : this.dummyCallback,
      });
    },
    // 결재 정보 상세 조회 (반려용)
    getApprLineDetail () {
      this.$http.url = this.$format(this.getUrl, this.apprRqst.apprRqstNo);
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.$_.extend(this.apprRqst, _result.data);
          this.apprRqst.apprLines = this.$_.clone(_result.data.apprRqstLineList);
          this.gridOptions.data = this.$_.clone(_result.data.apprRqstLineHistoryList);

          if (this.apprRqst.bizApprStepCd === 'BAPSD') {
            this.rejectFlag = true;
          } else {
            this.rejectFlag = false;
          }

          // 콤포넌트 전달 파라미터
          let params = this.$_.split(_result.data.apprReqParameter, '|');
          this.$_.forEach(params, element => {
            let paramMap = this.$_.split(element, ':');
            if (paramMap.length === 2) {
              this.apprParams[paramMap[0]] = paramMap[1];
            }
          });

          this.loadComponent(_result.data.apprUrl); // 콤포넌트 호출
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 걸재 상세 내용 첨부
    loadComponent (url) {
      this.component = () => import(`@/pages${url}`)
    },
    // 재결재요청
    requestAppr () {
      if (this.apprRqst.apprLines.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: '안내',
          message: '결재선을 지정해주세요.',
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        this.$validator
          .validateAll()
          .then(_result => {
            if (_result) {
              window.getApp.$emit('CONFIRM', {
                title: '확인',
                message: '재결재요청 하시겠습니까?',
                // TODO : 필요시 추가하세요.
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.apprRqst.reqUserId = this.$store.getters.token;
                  this.apprRqst.plantCd = this.$store.getters.plantCd;
            
                  this.$http.url = this.insertUrl;
                  this.$http.type = 'PUT';
                  this.$http.param = this.apprRqst;
                  this.$http.request(_result => {
                    if (_result.data > 0) {
                      window.getApp.$emit('ALERT', {
                        title: '안내',
                        message: '결재요청 되었습니다.',
                        type: 'success', // success / info / warning / error
                      });
                    } else {
                      window.getApp.$emit('ALERT', {
                        title: '에러',
                        message: '결재요청 처리중 오류가 발생하였습니다.',
                        type: 'error', // success / info / warning / error
                      });
                    }
                  });
                },
                // 취소 callback 함수
                cancelCallback: () => {
                },
              });
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
              '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
            );
          });
      }
    },
    // 결재선변경
    changeApprLine () {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprLinePopup.vue'}`);
      this.popupOptions.title = '결재선 변경';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprLinePop;
      this.popupOptions.width = '95%';
      this.popupOptions.param = {
        apprLines: this.apprRqst.apprLines,
      };
    },
    closeApprLinePop (data) {
      this.apprRqst.apprLines = data.apprLineList;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    validateState (_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    /** method end */
  },
}
</script>