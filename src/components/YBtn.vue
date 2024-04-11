<!--
  TODO : 버튼 공통 모듈
-->
<template>
  <span>
    <el-button
      plain
      :loading="loading"
      :disabled="disabled"
      :type="getColor"
      :size="getSize"
      :icon="icon"
      :circle="isIcon"
      class="default-buntton"
      @click.prevent="btnClicked"
    >{{$comm.getLangSpecInfoLabel(title)}}</el-button>
  </span>
</template>

<script>
import { changeLang } from '@/utils/i18n'
export default {
  /* attributes: name, components, props, data */
  name: 'y-btn',
  props: {
    ui: {
      type: String,
      default: 'bootstrap',
    },
    name: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    actionUrl: {
      type: String,
      default: '',
    },
    actionType: {
      type: String,
      default: '',
    },
    param: {
      type: [Object, Array],
      default: null,
    },
    // isValidByParent: {
    //   type: Boolean,
    //   default: null
    // },
    customColor: {
      type: String,
      default: null,
    },
    beforeSubmit: {
      // 버튼 클릭 전에 사전 처리해야 할 경우 부모의 함수명
      type: String,
      default: '',
    },
    isSubmit: {
      // 버튼 클릭 후 처리를 계속 진행할지 여부
      type: Boolean,
      default: null,
    },
    size: {
      type: String,
      default: 'default',
    },
    color: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showLoading: {
      type: Boolean,
      default: true,
    },
    isFileRequestPost: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      hasButtonError: false, // 버튼 속성값에 에러가 있는지 확인
    };
  },
  computed: {
    isMetroUi() {
      return this.ui === 'metroUi';
    },
    isIcon() {
      return this.title === '' && this.icon !== '';
    },
    getColor() {
      if (this.color === 'blue') {
        return 'primary';
      } else if (this.color === 'orange') {
        return 'warning';
      } else if (this.color === 'red') {
        return 'danger';
      } else if (this.color === 'gray') {
        return 'info';
      } else if (this.color === 'green') {
        return 'success';
      } else if (this.color === 'black') {
        return '';
      } else {
        return 'info';
      }
    },
    getSize() {
      if (this.size === 'sm') {
        return 'small';
      } else if (this.size === 'md') {
        return '';
      } else if (this.size === 'lg') {
        return 'large';
      } else {
        return 'mini';
      }
    },
  },
  watch: {
    // isValidByParent () {
    //   if (this.isValidByParent) this.callButtonAction();
    //   else return this.$emit('btnClickedError', this.param);
    // },
    isSubmit() {
      if (this.isSubmit) this.callButtonAction();
      else {
        this.closeLoading();
        return this.$emit('btnClickedError', this.param);
      }
    },
  },
  /* Vue lifecycle: created, mounted, destroyed, etc */
  mounted() {
    // this.initButtonType();
  },
  /* methods */
  methods: {
    changeLang,
    /**
     * 버튼 클릭 처리
     *  - 저장 버튼 클릭시 저장전 유효성 검사
     */
    btnClicked() {
      let self = this;
      if (this.showLoading) this.loading = !this.loading;
      else this.loading = false;
      // 부모vue에서 주어진 속성값이 잘못 되었으면 리턴 처리함
      if (this.hasButtonError) {
        self.closeLoading();
        window.getApp.$emit('APP_VALID_ERROR', this.$t('error.validError'));
        return false;
      }
      // 저장일 경우 유효성 검사
      if (this.beforeSubmit) {
        self.closeLoading();
        this.$emit(this.beforeSubmit);
        return;
      }
      self.closeLoading();
      this.callButtonAction();
    },
    /**
     * 버튼 행위 정의
     */
    callButtonAction() {
      let self = this;
      // ajax action
      if (this.actionUrl) {
        this.$http.url = this.actionUrl;
        this.$http.param = this.param;
        this.$http.type = this.actionType;
        this.$http.isLoading = true;
        this.$http.isFileRequestPost = this.isFileRequestPost;

        this.$http.request(
          _result => {
            self.$emit('btnClicked', _result);
          },
          _error => {
            this.$emit(
              'btnClickedErrorCallback',
              _error ? _error.message : _error
            );
          }
        );
      } else {
        this.$emit('btnClicked');
      }
    },
    /**
     * 버튼 로딩바 1초 후 제거
     */
    closeLoading() {
      setTimeout(() => (this.loading = false), 600);
    },
  },
};
</script>
<style>
.default-buntton {
  font-weight: 400;
  font-size: 14px;
  background: black;
  color: white;
}
</style>

