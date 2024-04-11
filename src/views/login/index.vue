<template>
  <section class="login-container login_contain beta">
    <article class="layout col_6 left">
      <div class="top_title">
        <div class="logo_wrap">SHE</div>
        <span
          >We’ve got tips and tools to keep your business<br />
          growing while you’re out of the office</span
        >
      </div>
      <div class="bg_img_up">
        <img :src="publicPath + '/src/assets/images/animals-2022610.svg'" />
      </div>
      <div class="bg_img">
        <img :src="publicPath + '/src/assets/images/future-1751262.svg'" />
      </div>
    </article>
    <article class="layout col_6 right">
      <article class="login_form">
        <div class="title_wrap">
          <span>welcome to</span>
          <div class="safelogologin">
            <span class="logos">
              <img
                :src="publicPath + '/src/assets/images/safe-logo-tree.png'"
              />
              <font class="safe-logo-1">안</font
              ><font class="safe-logo-1">전</font
              ><font class="safe-logo-1">환</font
              ><font class="safe-logo-1">경</font>
              <font class="safe-logo-2">P</font
              ><font class="safe-logo-2">o</font
              ><font class="safe-logo-2">r</font
              ><font class="safe-logo-2">t</font
              ><font class="safe-logo-2">a</font
              ><font class="safe-logo-2">l</font></span
            >
          </div>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="form"
          auto-complete="on"
          label-position="left"
        >
          <h2>ID</h2>
          <!-- <LangSelect class="loginLangSelect" /> -->
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="ID"
              name="username"
              type="text"
              auto-complete="on"
              class="form"
            />
          </el-form-item>
          <h2>Password</h2>
          <el-form-item prop="password">
            <el-input
              :type="passwordType"
              v-model="loginForm.password"
              placeholder="PAWSSWORD"
              name="password"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
              class="form"
            />
            <span class="show-pwd" @click="showPwd">
              <f-icon :icon="iConGroup.eyeIcon" />
            </span>
          </el-form-item>
          <!-- Google OTP 2차인증용 샘플 -->
          <!-- <h2 v-if="otp.url != ''">(관리자용 2차인증) OTP 앱 오픈</h2>
            <img :src="otp.url">
            <h2 v-if="otp.url != ''">OTP 비밀번호</h2>
            <el-form-item prop="otppassword" v-if="otp.url != ''">
              <el-input
                v-model="loginForm.otppassword"
                placeholder="OTP 비밀번호"
                name="otppassword"
                class="form"
                maxlength="6"
              />
            </el-form-item> -->

          <el-button
            :loading="loading"
            type="primary"
            class="sign_btn"
            @click.native.prevent="handleLogin"
            >{{ loginText }}
          </el-button>

          <!-- <div style="position:relative">
              <div class="tips">
                <span>{{ $t('login.username') }} : admin</span>
                <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
              </div>
              <div class="tips">
                <span style="margin-right:18px;">{{ $t('login.username') }} : editor</span>
                <span>{{ $t('login.password') }} : {{ $t('login.any') }}</span>
              </div>

            </div>-->
          <!-- <el-button
                class="thirdparty-button"
                type="primary"
                @click="showDialog=true"
            >{{ $t('login.thirdparty') }}</el-button>-->
        </el-form>
        <div class="div-appdownload">
          <y-qrcodegen
            value="https://she-m.yullin.com"
            text="모바일SHE"
            width="100"
            margin="10"
          />
          <y-qrcodegen
            value="https://she-m.yullin.com/src/assets/images/she-android-v0.1.apk"
            text="SHE 안드로이드"
            width="100"
            margin="10"
          />
        </div>
      </article>
    </article>
  </section>
</template>

<script>
/* eslint-disable */
import Cookies from 'js-cookie';
import { isvalidUsername } from '@/utils/validate';
import LangSelect from '@/components/LangSelect';
import SocialSign from './socialsignin';
import { MessageBox } from 'element-ui';

export default {
  name: 'Login-default',
  components: { LangSelect, SocialSign, MessageBox },
  data() {
    const validateUsername = (rule, value, callback) => {
      // if (!isvalidUsername(value)) {
      //   callback(new Error('Please enter the correct user name'))
      // } else {
      //   callback()
      // }
      callback();
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error('비밀번호는 2자 이상 입력하셔야 합니다.'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: '',
        password: '',
        //Google OTP 2차인증용 샘플
        // otppassword: '',
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername },
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword },
        ],
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      iConGroup: {
        eyeIcon: 'eye-slash',
      },
      otp: {
        url: '',
        key: '',
      },
    };
  },
  computed: {
    loginText() {
      let tranText = this.$comm.getLangSpecInfoLabel('L0000003410');
      return tranText !== 'L0000003410' ? tranText : 'login';
    },
    publicPath: function () {
      return process.env.PUBLIC_PATH;
    },
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  beforeMount() {
    let lang = Cookies.get('language') ? Cookies.get('language') : 'kr';
    this.$i18n.locale = lang;
    this.$store.dispatch('setLanguage', lang);
    this.getLangInfo('login');
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
        this.iConGroup.eyeIcon = 'eye';
      } else {
        this.passwordType = 'password';
        this.iConGroup.eyeIcon = 'eye-slash';
      }
    },
    handleLogin() {
      let promises = [
        {
          func: this.checkValid,
          exceptionMessage: 'M0000000001',
        } /** id, pwd 입력여부 */,
        { func: this.actionLogin } /** login api 호출 */,
        { func: this.getLangInfo } /** 언어별 라벨, 메시지 정보 get */,
      ];
      this.$comm.orderedPromise(promises);
    },
    checkValid() {
      return new Promise((_resolve, _reject) => {
        // 유효성 체크
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            _resolve(true);
          } else {
            _resolve(false);
          }
        });
      });
    },
    actionLogin() {
      return new Promise((_resolve, _reject) => {
        this.loading = true;
        this.$store
          .dispatch('LoginByUserAccount', this.loginForm)
          .then(() => {
            //Google OTP 2차인증용 샘플
            // if (this.$store.getters.otpYn == 'Y') {
            //   this.otp.url = this.$store.getters.otpUrl;
            //   this.otp.key = this.$store.getters.otpSecKey;
            // } else if (this.$store.getters.otpYn == 'X') {
            //   MessageBox.alert('OTP비밀번호가 맞지 않습니다.');
            // } else {
            //   this.$router.push({ path: this.redirect || '/' });
            // }
            _resolve(true);
          })
          .catch((error) => {
            document.activeElement.blur();
            if (error && error.message === 'Network Error') {
              this.$commMessage.alert(this, {
                title: error.message,
                message: '서버에 연결할 수 없습니다. 관리자에게 문의바랍니다.',
                type: 'info',
              });
            } else if (
              error.message.includes('undefined') &&
              error.message.includes('$emit')
            ) {
              this.$commMessage.alert(this, {
                title: 'L0000003406', // 로그인 에러
                message: 'M0000000003', // 연결할 수 없습니다. 관리자에게 문의하세요.
                type: 'info',
              });
            } else {
              let _option = error.response.data;
              this.$commMessage.alert(this, {
                title: 'L0000003406', // 로그인 에러
                message: _option.message,
                type: 'info',
              });
            }
            this.loading = false;
            _reject(error);
          });
      });
    },
    getLangInfo(divide) {
      return new Promise((_resolve, _reject) => {
        this.$store
          .dispatch('GetLangInfo', {
            lang: Cookies.get('language'),
            divide: divide,
          })
          .then((hasLang) => {
            if (hasLang) {
              if (!divide) {
                this.$router.push({ path: this.redirect || '/' });
              }
            }
            this.loading = false;
            _resolve(hasLang);
          })
          .catch((error) => {
            if (error && error.message === 'Network Error') {
            } else {
              this.$commMessage.alert(this, {
                title: 'L0000003406', // 로그인 에러
                message: 'M0000000017', // 로그인 진행중 에러가 발생하였습니다. 관리자에게 문의바랍니다.
                type: 'info',
              });
              this.$store
                .dispatch('LogOut')
                .then(() => {
                  this.$router.push({ path: this.redirect || '/login' });
                })
                .catch((err) => {
                  this.$router.push({ path: this.redirect || '/login' });
                });
              this.loading = false;
            }
            _reject();
          });
      });
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    },
  },
};
</script>
<style scoped>
body {
  background: #fff;
}
.layout.col_6 {
  width: calc(100% / 12 * 6 - 5px);
}
.login_contain {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.login_contain .layout {
  height: 100%;
  float: left;
  margin: 0;
  position: relative;
}
.login_contain .left {
  background: #5567ff;
  padding: 50px 30px 50px 70px;
}
.login_contain .top_title {
  position: absolute;
  z-index: 1;
}
.login_contain .top_title .logo_wrap {
  margin-bottom: 15px;
  font-size: 50px;
  font-weight: 700;
  color: #fff;
}
.login_contain .top_title span {
  line-height: 1.5;
  color: #a6aeff;
}
.login_contain .bg_img {
  position: absolute;
  width: 100%;
  bottom: 0px;
  right: -5px;
  text-align: right;
  opacity: 0.8;
}
.login_contain .bg_img img {
  max-width: 650px;
}
.login_contain .bg_img_up {
  position: absolute;
  width: 100%;
  top: 100px;
  right: 0px;
  text-align: right;
  opacity: 0.5;
}
.login_contain .bg_img_up img {
  max-width: 500px;
}

.login_contain .login_form {
  width: 100%;
  max-width: 535px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: left;
  padding: 0 30px;
}
.login_contain .login_form .title_wrap {
  width: 100%;
  margin-bottom: 50px;
}
.login_contain .login_form .title_wrap h1 {
  font-size: 40px;
  color: #1e2539;
}
.login_contain .login_form .title_wrap span {
  font-size: 24px;
  color: #9096ab;
  display: block;
  text-align: left;
  margin-bottom: 10px;
}
.login_contain .login_form .title_wrap span.maintitle {
  font-size: 24px;
  color: #9096ab;
  display: block;
  text-align: left;
  margin-bottom: 16px;
}
.login_contain .login_form .form {
  margin-bottom: 0px;
  position: relative;
}
.login_contain .login_form .form h2 {
  font-size: 13px;
  font-weight: 400;
  color: #a1a3b6;
  margin-bottom: 10px;
  display: inline-block;
}
.login_contain .login_form .form .loginLangSelect {
  float: right;
  margin-bottom: 10px;
}
.login_contain .login_form .form input {
  border-width: 0px !important;
  border-bottom: 1px solid #d0d8dd !important;
  width: 100% !important;
  font-size: 15px !important;
  padding-bottom: 14px !important;
  margin-bottom: 10px !important;
}
.login_contain .login_form .form .pass,
.login_contain .login_form .form .email {
  margin-bottom: 0;
}
.login_contain .login_form .form #loginPwd,
.login_contain .login_form .form #newPwd {
  margin-bottom: 30px;
}
.login_contain .login_form form input:focus {
  outline: none;
}
.login_contain .login_form .pass_box input {
  padding-right: 35px;
}
.login_contain .login_form .pass_box i {
  position: absolute;
  font-size: 25px;
  left: 94%;
  top: 118px;
  color: #949aae;
  cursor: pointer;
  color: #989db1;
}
.login_contain .login_form .input_group {
  display: inline-block;
}
.login_contain .login_form .checkbox {
  vertical-align: middle;
  margin-top: 0;
}
.login_contain .login_form .sub_box {
  margin-top: 21px;
}
.login_contain .login_form .sub_box .right_align {
  margin-top: 6px;
}
.login_contain .login_form .sub_box .right_align a {
  text-decoration: none;
  color: #2d2d2d;
}
.login_contain .login_form h3 {
  font-size: 12px;
  font-weight: 400;
}
.login_contain .login_form h3 a {
  color: #5567ff;
  text-decoration: underline;
}
.login_contain .button_group {
  display: flex;
}
.login_contain .sign_btn {
  margin-top: 21px;
  padding: 13px;
  width: 100%;
  text-align: center;
  background: #5567ff;
  font-weight: 700;
  font-size: 16px !important;
  color: #fff;
  border-radius: 15px;
  cursor: pointer;
}
.login_contain .sign_btn.cancel {
  margin-left: 5px;
  background: #fff;
  border: 1px solid #5567ff;
  color: #5567ff;
}

.show-pwd {
  position: absolute;
  font-size: 18px;
  left: 94%;
  top: 0px;
  color: #949aae;
  cursor: pointer;
  color: #989db1;
}
/* APP다운로드 버튼 */
.div-appdownload {
  width: 100%;
  padding-top: 30px;
  text-align: center;
}
.div-appdownload img {
  width: 154px;
}

/* [S]안전환경portal 이미지 및 애니메이션 */
.safelogologin {
  vertical-align: middle;
}
.safe-logo-1 {
  color: #58c400;
}
.safe-logo-2 {
  color: rgba(24, 24, 24, 0.6);
}
.safelogologin img {
  vertical-align: middle;
  margin-top: -7px;
}
.safelogologin span.logos {
  font-weight: 700 !important;
  font-size: 35px !important;
}
.safelogologin span.logos img {
  width: 18px;
}
.safelogologin span font {
  display: inline-block;
  margin: 0 -0.02em;
  animation: loading 2.5s infinite alternate;
}
.safelogologin span font:nth-child(2) {
  animation-delay: 1.2s;
}
.safelogologin span font:nth-child(3) {
  animation-delay: 1.4s;
}
.safelogologin span font:nth-child(4) {
  animation-delay: 1.8s;
}
.safelogologin span font:nth-child(5) {
  animation-delay: 2s;
}
.safelogologin span font:nth-child(6) {
  -webkit-animation: logoanimation 5s ease-in-out 1s 1;
  animation: logoanimation 3s ease-in-out 2s 1;
}
.safelogologin span font:nth-child(7) {
  -webkit-animation: logoanimation 5s ease-in-out 1.8s 2;
  animation: logoanimation 3s ease-in-out 1.8s 2;
}
.safelogologin span font:nth-child(8) {
  -webkit-animation: logoanimation 5s ease-in-out 1.6s 3;
  animation: logoanimation 3s ease-in-out 1.6s 3;
}
.safelogologin span font:nth-child(9) {
  -webkit-animation: logoanimation 5s ease-in-out 1.4s 4;
  animation: logoanimation 3s ease-in-out 1.4s 4;
}
.safelogologin span font:nth-child(10) {
  -webkit-animation: logoanimation 5s ease-in-out 1.2s 5;
  animation: logoanimation 3s ease-in-out 1.2s 5;
}
.safelogologin span font:nth-child(11) {
  -webkit-animation: logoanimation 5s ease-in-out 1s 6;
  animation: logoanimation 3s ease-in-out 1s 6;
}
@keyframes logoanimation {
  0% {
    opacity: 1;
    transform: translateX(0%) rotate(0deg);
  }
  25% {
    opacity: 0;
    transform: translateX(400%) rotate(360deg);
  }
  50% {
    opacity: 0;
    transform: translateX(400%) rotate(360deg);
  }
  75% {
    opacity: 0;
    transform: translateX(400%) rotate(360deg);
  }
  100% {
    opacity: 1;
    transform: translateX(0%) rotate(0deg);
  }
}
@keyframes loading {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  75% {
    opacity: 1;
    transform: scale(1);
  }
  76% {
    opacity: 0.9;
    transform: scale(0.98);
  }
  80% {
    opacity: 0.8;
    transform: scale(0.96);
  }
  84% {
    opacity: 0.7;
    transform: scale(0.94);
  }
  88% {
    opacity: 0.6;
    transform: scale(0.92);
  }
  92% {
    opacity: 0.5;
    transform: scale(0.94);
  }
  96% {
    opacity: 0.4;
    transform: scale(0.96);
  }
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
}

@media (max-width: 1200px) {
  .login_contain .left {
    display: none;
  }
  .login_contain .right {
    width: 100%;
  }
  .login_contain .login_form {
    top: 50%;
  }
  .login_contain .login_form .title_wrap {
    margin-bottom: 30px;
  }
  .login_contain .login_form .title_wrap h1 {
    font-size: 25px;
  }
  .login_contain .sign_btn {
    margin-top: 30px;
  }
}
</style>
