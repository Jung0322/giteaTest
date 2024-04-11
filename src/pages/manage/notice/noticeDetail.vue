<!--
  목적 : 시스템관리-공지사항 상세
  작성자 : khk
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>

        <b-card>
          <b-row>
            <b-col sm="12">
              <div
                class="editor-content"
                :style="{
                  minHeight: popupParam.height + 'px',
                  height: popupParam.height + 'px',
                }"
                v-html="notice.noticeContents"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row>
      <b-col sm="12">
        <div class="float-right mt-1">
          <y-btn title="L0000000881" @btnClicked="closePopup" />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'notice-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        noticeNo: 0,
        height: 500,
      },
    },
  },
  data() {
    return {
      notice: {
        noticeNo: 0,
        comNoticeClassCd: null,
        comNoticeClassNm: '',
        noticeTitle: '',
        noticeContents: '',
        popupYn: 'N',
        popupStartYmd: null,
        popupEndYmd: null,
        popupPeriod: null,
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
      },

      detailUrl: '',
    };
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {
      // 선택항목 설정
      setTimeout(() => {}, 200);

      this.detailUrl = selectConfig.manage.notice.get.url;
      this.getDetail();
    },
    getDetail() {
      this.$http.url = this.$format(this.detailUrl, this.popupParam.noticeNo);
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.notice = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },

    closePopup() {
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>

<style>
.editor-content {
  overflow-y: auto;
}
</style>
