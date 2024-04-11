<template>
  <b-container fluid>
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 메일로그 상세 -->
            <y-label
              label="L0000004573"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 메일발송테스트 -->
              <y-btn
                title="L0000004574"
                color="orange"
                @btnClicked="btnSendTest"
              />
              <!-- 재발송 -->
              <y-btn
                title="L0000004564"
                color="orange"
                @btnClicked="btnSendMail"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 로그번호 -->
                  <y-label label="L0000000994" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="mailLog.logNo" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 발송등록일 -->
                  <y-label label="L0000001091" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="mailLog.reqDt" />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발신자 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000001096"
                name="sendnm"
                v-model="mailLog.sendnm"
                :editable="false"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 수신자 -->
              <y-textarea
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000001690"
                name="tonm"
                v-model="mailLog.tonm"
              ></y-textarea>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 참조자 -->
              <y-textarea
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002814"
                name="ccNm"
                v-model="mailLog.ccNm"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 숨은참조자 -->
              <y-textarea
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000004575"
                name="bccnm"
                v-model="mailLog.bccnm"
              ></y-textarea>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 발송여부 -->
                  <y-label label="L0000001092" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="mailLog.sendYn" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 발송일 -->
                  <y-label label="L0000004565" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="mailLog.sendDt" />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12">
              <b-row>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 메일 제목 -->
                  <y-label label="L0000001016" />
                </b-col>
                <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10">
                  <y-label
                    :label="mailLog.title"
                    :fieldable="true"
                    :size="20"
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12">
              <b-row>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 메일 내용 -->
                  <y-label label="L0000004570" />
                </b-col>
                <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10">
                  <div
                    v-html="mailLog.content"
                    style="
                      min-height: 100px;
                      border: 1px solid rgba(0, 0, 0, 0.125);
                    "
                  >
                    test
                  </div>
                </b-col>
              </b-row>
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
  name: 'maillog-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        logNo: 0,
      },
    },
  },
  data() {
    return {
      mailLog: {
        logNo: '',
        sendem: '',
        sendnm: '',
        toem: '',
        tonm: '',
        ccEm: '',
        ccNm: '',
        bccem: '',
        bccnm: '',
        title: '',
        content: '',
        sendDt: '',
        sendYn: '',
        reqDt: '',
      },

      searchUrl: '',
      insertUrl: '',
      paramVal: [],
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  //   beforeDestroy() {
  //   },
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.manage.log.mailLog.detail.url;
      this.insertUrl = transactionConfig.manage.log.mailLog.insert.url;

      this.routeName = this.$route.name;
      this.cookieName = 'SHE' + this.$store.getters.token; // cookieName 설정

      if (this.popupParam.logNo !== 0) {
        this.getDetail();
      }
    },

    getDetail() {
      this.$http.url = this.$format(this.searchUrl, this.popupParam.logNo);
      this.$http.type = 'GET';
      this.$http.request((_result) => {
        this.mailLog = _result.data;
      });
    },

    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },

    btnSendMail() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000540', // 해당 메일을 재발송 하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.insertUrl;
          this.$http.type = 'POST';
          this.$http.param = this.mailLog;
          this.$http.request((_result) => {
            if (_result.data) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000541', // 메일 발송을 정상적으로 실행하였습니다.
                type: 'warning', // success / info / warning / error
              });
            } else {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000542', // 메일 발송 중 오류가 발생했습니다. 관리자에게 문의하세요.
                type: 'warning', // success / info / warning / error
              });
            }
          });
        },
        cancelCallback: () => {},
      });
    },
    btnSendTest() {
      this.$http.url = '/api/manage/swtest/mailtest';
      this.$http.type = 'GET';
      this.$http.request((_result) => {});
    },
  },
};
</script>
