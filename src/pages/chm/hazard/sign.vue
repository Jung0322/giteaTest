<!--
  목적 : 물질관리 > 화학물질 > MSDS > MSDS 요약내용
  작성자 : kdh
  Detail : MSDS 요약내용 조회 화면
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
            <y-label
              label="서명란"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div class="float-right mb-1">
              <!-- 되돌리기 -->
              <y-btn title="L0000005445" color="blue" @btnClicked="undo" />
              <!-- 적용 -->
              <y-btn title="L0000002482" color="blue" @btnClicked="save" />
              <!-- 닫기 -->
              <y-btn
                title="L0000000881"
                color="gray"
                @btnClicked="closePopup"
              />
            </div>
          </b-col>
        </b-row>
        <b-card sm="12">
          <b-row>
            <VueSignaturePad ref="signaturePad" :options="options" />
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// import VueSignaturePad from 'vue-signature-pad';
export default {
  name: 'sign',
  // components: { VueSignaturePad },
  props: {},
  data() {
    return {
      options: {
        penColor: '#00f',
        minWidth: 2,
        maxWidth: 4,
      },
    };
  },
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {},
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    save() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      console.log(this.$refs.signaturePad.saveSignature());
      if (isEmpty) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000176', // '서명을 하지 않았습니다.',
          type: 'warning',
        });
      } else {
        this.closePopup(data);
      }
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
    /** /Button Event **/
  },
};
</script>
