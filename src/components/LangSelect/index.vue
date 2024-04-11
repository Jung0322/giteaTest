<template>
  <el-dropdown
    trigger="click"
    class="international"
    @command="handleSetLanguage"
  >
    <div>
      <img
        :src="publicPath + '/src/icons/' + language + '.png'"
        alt=""
        style="width: 18px"
      />
      <!-- <svg-icon class-name="international-icon" icon-class="language" /> -->
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language === 'kr'" command="kr">
        한글
      </el-dropdown-item>
      <el-dropdown-item :disabled="language === 'en'" command="en">
        English
      </el-dropdown-item>
      <el-dropdown-item :disabled="language === 'ja'" command="ja">
        日本
      </el-dropdown-item>
      <el-dropdown-item :disabled="language === 'zh_cn'" command="zh_cn">
        简体中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language === 'zh_tw'" command="zh_tw">
        繁體中文
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
/* eslint-disable */
export default {
  computed: {
    language() {
      return this.$store.getters.language;
    },
    publicPath: function () {
      return process.env.PUBLIC_PATH;
    },
  },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang;
      this.$store
        .dispatch('setLanguage', lang)
        .then(() => {
          window.location.reload();
          // this.$store.dispatch('delAllViews').then(() => {
          //   this.$store.dispatch('ClearRoles').then(() => {
          //     this.$nextTick(() => {
          //       // this.$router.replace({
          //       //   path: '/redirect' + this.$route.fullPath,
          //       // });
          //     });
          //   });
          // });
          this.$message({
            message: 'Switch Language Success',
            type: 'success',
          });
        })
        .catch((e) => {
          this.$message({
            message: 'Switch Language Fail',
            type: 'error',
          });
        });
    },
  },
};
</script>

<style scoped>
.international-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px !important;
}
.international {
  padding-top: 10px;
}
</style>
