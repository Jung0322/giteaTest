<!--
  목적 : Refresh 토큰이 만료된 경우 재 로그인 팝업창 
  작성자 : kyk
  Detail : 
  *
  examples:
  *
  -->

<template>
  <b-container fluid>
    <b-card body-class="p-sm-5" footer-class="px-sm-5 text-center text-muted small">
      <div class="media align-items-center">
        <div class="media-body ml-3">
          <b
            class="text-large font-weight-bolder line-height-1 ml-2"
          >{{this.$store.getters.name}} :::</b>
          <b
            class="text-big font-weight-semibold line-height-1 ml-1"
          >{{this.$store.getters.plantNm}} > {{this.$store.getters.deptNm}}</b>
        </div>
      </div>

      <hr class="my-2" />

      <p class="text-muted small">
        로그인 정보의 유효시간이 만료되었습니다.
        <br />비밀번호를 입력하세요.
        <br />
      </p>
      <b-input-group>
        <b-form-input type="text" v-model="credentials.username" style="display:none;" />
        <b-form-input
          type="password"
          v-model="credentials.password"
          placeholder="비밀번호 입력"
          @keyup.native.enter="handleLogin"
        />
        <b-btn variant="primary icon-btn" slot="append" @click.prevent="handleLogin">
          <small>로그인</small>
        </b-btn>
      </b-input-group>
      <div style="color:#d9534f;" class="mt-1 invalid-text" v-if="afterPwCheck">{{ afterPwCheck }}</div>

      <div slot="footer">
        <div class="row">
          <div class="col-md-6">
            <a href="javascript:void(0)" @click.prevent="onLoginPage()">로그인 화면으로 이동</a>
          </div>
          <div class="col-md-6">
            <a href="javascript:void(0)" @click.prevent="closePopup('C')">닫기</a>
          </div>
        </div>
      </div>
    </b-card>
  </b-container>
</template>

<script>
import transactionConfig from '@/js/transactionConfig';
import { MessageBox } from 'element-ui';
import { getAccessToken } from '../../utils/auth';
import axios from 'axios';
export default {
  name: 'y-login-pop',
  components: { MessageBox },
  props: {
    popupParam: {
      type: Object,
      default: function() {
        return { popupMode: false };
      },
    },
  },
  data() {
    return {
      afterPwCheck: null,
      credentials: {
        username: '',
        password: '',
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
    };
  },
  watch: {
    'credentials.password': function() {
      var thisVal = this.credentials.password ? this.credentials.password : '';
      if (thisVal.length < 1) {
        this.afterPwCheck = '비밀번호를 입력하세요.';
      } else {
        this.afterPwCheck = null;
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    init() {
      this.credentials.username = this.$store.getters.token;
    },
    closePopup(data) {
      this.$emit('closePopup', { data });
    },
    onLoginPage: function() {
      this.$emit('closePopup', 'X');
      this.$store.dispatch('LogOut').then(() => {
        location.reload();
      });
    },
    handleLogin() {
      this.loading = true;
      this.$store
        .dispatch('LoginByUserAccount', this.credentials)
        .then(() => {
          this.loading = false;
          // this.$router.push({ path: this.redirect || '/' });
          let token = getAccessToken();
          axios.defaults.headers.common['X-Authorization'] = token;
          this.$emit('closePopup', 'X');
        })
        .catch(error => {
          if (
            error.message.includes('undefined') &&
            error.message.includes('$emit')
          ) {
            // window.alert('연결할 수 없습니다. 관리자에게 문의하세요.');
            MessageBox.alert('연결할 수 없습니다. 관리자에게 문의하세요.');
          } else {
            if (process.env.NODE_ENV === 'development') {
              var log = error.response.data;
              MessageBox.alert(
                '<p>' + log.message + '</p><p>로그번호 : ' + log.logNo + '</p>',
                '로그인',
                {
                  dangerouslyUseHTMLString: true,
                }
              );
            } else {
              window.alert(error.response.data.message);
            }
          }
          this.loading = false;
        });
    },
  },
};
</script>
