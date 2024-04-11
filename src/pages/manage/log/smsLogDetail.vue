<template>
  <b-container fluid>
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- SMS로그 상세 -->
            <y-label
              label="L0000004569"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 로그번호 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000000994"
                name="logNo"
                v-model="smsLog.logNo"
                :editable="false"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발신자ID -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000001098"
                name="sndPhnId"
                v-model="smsLog.sndPhnId"
                :editable="false"
              ></y-text>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발신자번호 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000001099"
                name="callback"
                v-model="smsLog.callback"
                :editable="false"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 수신자번호 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000001691"
                name="rcvPhnId"
                v-model="smsLog.rcvPhnId"
                :editable="false"
              ></y-text>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 메시지내용 -->
              <y-textarea
                :width="10"
                ui="bootstrap"
                label="L0000001013"
                name="sndMsg"
                v-model="smsLog.sndMsg"
                :editable="false"
              ></y-textarea>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 메시지상태 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000001014"
                name="smsSt"
                v-model="smsLog.smsSt"
                :editable="false"
              ></y-text>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 전송결과 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000002512"
                name="rsltVal"
                v-model="smsLog.rsltVal"
                :editable="false"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발신자ID -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000001098"
                name="rsrvdId"
                v-model="smsLog.rsrvdId"
                :editable="false"
              ></y-text>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발신부서명 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000001094"
                name="rsrvdWd"
                v-model="smsLog.rsrvdWd"
                :editable="false"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발신부서코드 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000001095"
                name="sndDept"
                v-model="smsLog.sndDept"
                :editable="false"
              ></y-text>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발신자이름 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000001100"
                name="snderNm"
                v-model="smsLog.snderNm"
                :editable="false"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 수신자이름 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000001692"
                name="rcvNm"
                v-model="smsLog.rcvNm"
                :editable="false"
              ></y-text>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발송일시 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000001093"
                name="sendDt"
                v-model="smsLog.sendDt"
                :editable="false"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발송여부 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000001092"
                name="sendYn"
                v-model="smsLog.sendYn"
                :editable="false"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'smslog-detail',
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
      smsLog: {},
      searchUrl: '',
      paramVal: [],
    };
  },
  watch: {
    popupParam() {
      this.smsLog = this.popupParam;
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
    init() {
      this.routeName = this.$route.name;
      this.cookieName = 'SHE' + this.$store.getters.token; // cookieName 설정

      this.smsLog = this.popupParam; // 초기 모델 설정
    },

    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
