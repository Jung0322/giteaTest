<!--
  목적 : 화학물질관리 > 화학물질 > 구성성분/규제 정보
  작성자 : kdh
  Detail : 구성성분/규제 정보 등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row sm="12">
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
        <b-card>
          <b-row>
            <b-col
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12 mb-2"
              v-if="matCheckRequest.chkResultFinYn === 'Y'"
            >
              <el-tag size="medium" type="success"
                >검토처리자 : {{ matCheckRequest.chkResultFinUserNm }}</el-tag
              >
              <el-tag size="medium" type="success"
                >검토처리일시 : {{ matCheckRequest.chkResultFinDt }}</el-tag
              >
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 검토완료 -->
                <y-btn
                  v-if="
                    editable &&
                    !disabled2 &&
                    matCheckRequest.chkResultFinYn !== 'Y' &&
                    (isSafHea || isManager)
                  "
                  title="L0000000383"
                  color="orange"
                  @btnClicked="btnResultFinClick"
                />
                <div class="mt-1">
                  <y-switch
                    :width="12"
                    :editable="editable"
                    :disabled="
                      disabled2 ||
                      matCheckRequest.chkResultFinYn === 'Y' ||
                      !(isSafHea || isManager)
                    "
                    true-value="Y"
                    false-value="N"
                    ui="bootstrap"
                    label
                    name="chkResultYn"
                    selectText="적합"
                    unselectText="부적합"
                    v-model="matCheckRequest.chkResultYn"
                  />
                </div>
              </div>
              <!-- 안전/보건 검토결과 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="300"
                :disabled="
                  disabled2 ||
                  matCheckRequest.chkResultFinYn === 'Y' ||
                  !(isSafHea || isManager)
                "
                ui="bootstrap"
                label="L0000005480"
                name="chkResult"
                v-model="matCheckRequest.chkResult"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
        <b-card class="mt-2">
          <b-row>
            <b-col
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12 mb-2"
              v-if="matCheckRequest.chkResultEnvFinYn === 'Y'"
            >
              <el-tag size="medium" type="success"
                >검토처리자 :
                {{ matCheckRequest.chkResultEnvFinUserNm }}</el-tag
              >
              <el-tag size="medium" type="success"
                >검토처리일시 : {{ matCheckRequest.chkResultEnvFinDt }}</el-tag
              >
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 검토완료 -->
                <y-btn
                  v-if="
                    editable &&
                    !disabled2 &&
                    matCheckRequest.chkResultEnvFinYn !== 'Y' &&
                    (isEnv || isManager)
                  "
                  title="L0000000383"
                  color="orange"
                  @btnClicked="btnResultEnvFinClick"
                />
                <div class="mt-1">
                  <y-switch
                    :width="12"
                    :editable="editable"
                    :disabled="
                      disabled2 ||
                      matCheckRequest.chkResultEnvFinYn === 'Y' ||
                      !(isEnv || isManager)
                    "
                    true-value="Y"
                    false-value="N"
                    ui="bootstrap"
                    label
                    name="chkResultEnvYn"
                    selectText="적합"
                    unselectText="부적합"
                    v-model="matCheckRequest.chkResultEnvYn"
                  />
                </div>
              </div>
              <!-- 환경 검토결과 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="300"
                :disabled="
                  disabled2 ||
                  matCheckRequest.chkResultEnvFinYn === 'Y' ||
                  !(isEnv || isManager)
                "
                ui="bootstrap"
                label="L0000005481"
                name="chkResultEnv"
                v-model="matCheckRequest.chkResultEnv"
              ></y-textarea>
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
  name: 'y-matCheckRequest-result',
  props: {
    matCheckRequest: {
      matChkRqstNo: 0,
      chkResult: '', // 안전/보건 검토결과
      chkResultYn: 'N', // 안전/보건 검토결과 적합여부
      chkResultFinYn: 'N', // 안전/보건 검토결과 완료여부
      chkResultFinUserId: '', // 안전/보건 검토결과 완료처리자 아이디
      chkResultFinUserNm: '', // 안전/보건 검토결과 완료처리자
      chkResultFinDt: '', // 안전/보건 검토결과 완료처리일
      chkResultEnv: '', // 환경 검토결과
      chkResultEnvYn: 'N', // 환경 검토결과 적합여부
      chkResultEnvFinYn: 'N', // 환경 검토결과 완료여부
      chkResultEnvFinUserId: '', // 환경 검토결과 완료처리자 아이디
      chkResultEnvFinUserNm: '', // 환경 검토결과 완료처리자
      chkResultEnvFinDt: '', // 환경 검토결과 완료처리일
    },
    chkRqstState: '',
    matChkRqstNo: 0,
    chkFlag: null,
  },
  data() {
    return {
      editable: false,
      disabled2: false,
      updateConfirmUrl: '',
      isSafHea: false,
      isEnv: false,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      if (this.chkRqstState === 'MCRS3') this.disabled2 = true;

      let userAuth = this.$store.getters.userAuthGrps.filter(
        (auth) => auth.settingYn === 'Y'
      );
      this.isSafHea =
        userAuth.filter(
          (auth) =>
            String(auth.authGrpNo) === '1021' ||
            String(auth.authGrpNo) === '1022'
        ).length > 0 && this.chkFlag === 'saf';
      this.isEnv =
        userAuth.filter((auth) => String(auth.authGrpNo) === '1024').length >
          0 && this.chkFlag === 'env';
      this.isManager =
        userAuth.filter(
          (auth) =>
            String(auth.authGrpNo) === '1090' || String(auth.authGrpNo) === '2'
        ).length > 0;
    },
    btnResultFinClick() {
      if ($.trim(this.matCheckRequest.chkResult) === '') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000204', // '안전/보건 검토결과를 입력하세요.',
          type: 'warning',
        });
        return;
      }
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000205', // '안전/보건 검토결과를 완료처리하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.updateConfirmUrl =
            transactionConfig.chm.matCheckRequest.confirm.url;
          this.matCheckRequest.chkResultFinYn = 'Y';
          this.confirmSave('saf');
        },
      });
    },
    btnResultEnvFinClick() {
      if ($.trim(this.matCheckRequest.chkResultEnv) === '') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000206', // '환경 검토결과를 입력하세요.',
          type: 'warning',
        });
        return;
      }
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000207', // '환경 검토결과를 완료처리하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.matCheckRequest.chkResultEnvFinYn = 'Y';
          this.updateConfirmUrl =
            transactionConfig.chm.matCheckRequest.confirmenv.url;
          this.confirmSave('env');
        },
      });
    },
    confirmSave(_gubun) {
      this.$http.url = this.updateConfirmUrl;
      this.$http.type = 'PUT';
      this.$http.param = this.matCheckRequest;
      this.$http.request(
        (_result) => {
          // 저장
          this.matCheckRequest.chkResultFinUserId =
            _result.data.chkResultFinUserId;
          this.matCheckRequest.chkResultFinUserNm =
            _result.data.chkResultFinUserNm;
          this.matCheckRequest.chkResultFinDt = _result.data.chkResultFinDt;
          this.matCheckRequest.chkResultEnvFinUserId =
            _result.data.chkResultEnvFinUserId;
          this.matCheckRequest.chkResultEnvFinUserNm =
            _result.data.chkResultEnvFinUserNm;
          this.matCheckRequest.chkResultEnvFinDt =
            _result.data.chkResultEnvFinDt;
        },
        (_error) => {
          if (_gubun === 'saf') {
            this.matCheckRequest.chkResultFinYn = 'N';
          } else {
            this.matCheckRequest.chkResultEnvFinYn = 'N';
          }
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>
