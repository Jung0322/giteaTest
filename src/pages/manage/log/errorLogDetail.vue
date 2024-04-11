<template>
  <b-container fluid>
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 오류로그 상세 -->
            <y-label
              label="L0000004557"
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
                v-model="errorLog.logNo"
                :editable="false"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발생일 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000001078"
                name="createDt"
                v-model="errorLog.createDt"
                :editable="false"
              ></y-text>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 상태코드 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000001539"
                name="statusCd"
                v-model="errorLog.statusCd"
                :editable="false"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 메시지 -->
              <y-textarea
                :width="8"
                ui="bootstrap"
                label="L0000001011"
                name="logInfo"
                v-model="errorLog.logInfo"
                :editable="false"
              ></y-textarea>
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 원인 -->
              <y-textarea
                :width="10"
                ui="bootstrap"
                label="L0000002098"
                name="cause"
                v-model="errorLog.cause"
                :editable="false"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 원인상세 -->
              <y-textarea
                :width="10"
                ui="bootstrap"
                label="L0000002107"
                name="causeMessage"
                v-model="errorLog.causeMessage"
                :editable="false"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 쿼리문 -->
              <y-textarea
                :width="10"
                ui="bootstrap"
                label="L0000002986"
                name="queryString"
                v-model="errorLog.queryString"
                :editable="false"
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
export default {
  name: 'errorlog-detail',
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
      errorLog: {
        logNo: '',
        logInfo: '',
        statusCd: '',
        queryString: '',
        cause: '',
        causeMessage: '',
        createDt: '',
      },

      searchUrl: '',
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
      this.searchUrl = selectConfig.manage.log.errorLog.detail.url;
      if (this.popupParam.logNo !== 0) {
        this.getDetail();
      }
    },

    getDetail() {
      //   this.$http.url = this.searchUrl;
      //   this.$http.param = this.popupParam.logNo;

      this.$http.url = this.$format(this.searchUrl, this.popupParam.logNo);
      this.$http.type = 'GET';
      this.$http.request((_result) => {
        this.errorLog.logNo = this.popupParam.logNo;
        this.errorLog.logInfo = _result.data.logInfo;
        this.errorLog.statusCd = _result.data.statusCd;
        this.errorLog.queryString = _result.data.queryString;
        this.errorLog.cause = _result.data.cause;
        this.errorLog.causeMessage = _result.data.causeMessage;
        this.errorLog.createDt = _result.data.createDt;
      });
    },

    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
