<!--
  목적 : 경영 > 게시판 > 자료실 등록/수정 > 내용 탭
  작성자 : ksw
  Detail : 자료실 등록/수정 > 내용 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 관련근거 -->
          <y-textarea
            :width="10"
            :maxlength="300"
            :editable="editable"
            :disabled="updateMode && !updtMode && !revMode"
            ui="bootstrap"
            label="L0000000565"
            name="refContents"
            v-model="electHis.refContents"
          ></y-textarea>
        </b-col>
        <b-col sm="12" class="px-0">
          <!-- 선임사유 -->
          <y-textarea
            :width="10"
            :required="true"
            :maxlength="300"
            :editable="editable"
            :disabled="updateMode && !updtMode && !revMode"
            ui="bootstrap"
            label="L0000001557"
            name="electReason"
            v-model="electHis.electReason"
            v-validate="'required'"
            :state="validateState('electReason')"
          ></y-textarea>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-elect-his-detail-content',
  props: {
    electHis: {
      type: Object,
      default: {
        contents: '',
        refContents: '',
      },
    },
    updateMode: false,
    updtMode: false,
    revMode: false,
    isElectReason: false,
  },
  data: () => ({
    editable: false,
  }),
  watch: {
    // isElectReason: {
    //   handler: function () {
    //     console.log('watch');
    //     this.checkValidator();
    //   },
    //   deep: true,
    // },
    isElectReason() {
      this.checkValidator();
    }
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
    },
    checkValidator() {
      this.$validator
        .validateAll()
        .then(_result => {})
        .catch(e => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
  },
};
</script>