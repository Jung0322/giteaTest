<template>
  <div id="app" v-loading="loading">
    <router-view/>
  </div>
</template>

<script>
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'App',
  computed: {
    loading() {
      return this.$store.getters.loading
    }
  },
  created() {
    // document.addEventListener('beforeunload', this.handlerClose);
    // window.addEventListener('beforeunload', (event) => {
    //   // Cancel the event as stated by the standard.
    //   event.preventDefault();
    //   // Chrome requires returnValue to be set.
    //   event.returnValue = '';
      
    //   this.$http.url = this.$format(
    //     transactionConfig.login.update.url,
    //     this.$store.getters.token
    //   );
    //   this.$http.type = 'PUT';
    //   this.$http.request(
    //     this.$store.dispatch('LogOut').then(() => {
    //       // location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
    //     })
    //   );
    // });
  },
}
</script>
