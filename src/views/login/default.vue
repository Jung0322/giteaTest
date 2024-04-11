<template>
  <div class="login-container"></div>
</template>

<script>
/* eslint-disable */
import Cookies from 'js-cookie';
import { isvalidUsername } from '@/utils/validate';
import LangSelect from '@/components/LangSelect';
import SocialSign from './socialsignin';
import { MessageBox } from 'element-ui';

export default {
  name: 'Login',
  data() {
    return {};
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  beforeMount() {
    this.init();
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    init() {
      this.loading = true;
      this.$store
        .dispatch('sso')
        .then(() => {
          this.loading = false;
          this.$router.push({ path: this.redirect || '/' });
        })
        .catch(error => {
          this.loading = false;

          this.$store
            .dispatch('LogOut')
            .then(() => {
              this.$router.push({ path: this.redirect || '/ssoFail' });
            })
            .catch(err => {
              this.$router.push({ path: this.redirect || '/ssoFail' });
            });
          // this.$comm.movePage(this.$router, '/404');
        });
    },
  },
};
</script>