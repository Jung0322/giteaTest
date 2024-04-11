<template>
  <el-scrollbar id="theme-scroll" wrap-class="scrollbar-wrapper">        
    <div class="drawer-container">
      <div>
        <h3 class="drawer-title">색상 및 테마 설정</h3>
        <el-divider></el-divider>
        <div class="drawer-item">
          <h5>상단 색상</h5>
          <y-palette type="top" @mainColorChanged="mainColorChanged"></y-palette>
          <el-divider></el-divider>
          <h5>메뉴 색상</h5>
          <y-palette type="menu" @mainColorChanged="mainColorChanged"></y-palette>
          <el-divider></el-divider>
          <h5>footer 색상</h5>
          <y-palette type="footer" @mainColorChanged="mainColorChanged"></y-palette>
          <el-divider></el-divider>
          <h5>body 색상</h5>
          <y-palette type="body" @mainColorChanged="mainColorChanged"></y-palette>
          <el-divider></el-divider>
          <h5>Theme</h5>
          <y-theme @themeChanged="themeChanged"></y-theme>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'
import YTheme from '@/components/YTheme'

export default {
  components: { 
    ThemePicker,
    YTheme
  },
  name: 'settings',
  data() {
    return {}
  },
  computed: {
  },
  mounted() {
    this.resizeComponents();
    window.addEventListener('resize', this.resizeComponents);
    // this.resizeComponents();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeComponents);
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    },
    mainColorChanged(_item) {
      this.$emit('mainColorChanged', _item);
    },
    themeChanged(_item) {
      this.$emit('themeChanged', _item);
    },
    resizeComponents() {
      setTimeout(() => {
        $('#theme-scroll .el-scrollbar__wrap').height($('.rightPanel').height() - ($('.rightPanel').height() / 20))
      }, 600);
    },
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
    color: #babbbc!important;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }

  .drawer-item h5 {
    position: relative;
    font-size: 11px;
    font-weight: 600;
    color: #babbbc!important;
  }
}
</style>
