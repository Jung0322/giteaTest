<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <div class="mainView" :style="`background-color:` + topColor">
      <div
        class="mainIcon"
        @click="goMain"
        :style="`background-color:` + topColor"
      ></div>
      <!-- 좌측 메뉴 활성/비활성화 icon -->
      <!-- <div class="menuSide" @click="toggleSideBar" :style="`background-color:` + topColor"></div> -->
      <div class="left_align">
        <button
          type="button"
          :class="{ open_menu: true, menu_close: !sidebar.opened }"
          @click="toggleSideBar"
        >
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
      <div class="right_align"></div>
    </div>
    <!-- left menu 영역 -->
    <sidebar class="sidebar-container" :background-color="menuColor" />
    <!-- top 영역 -->
    <navbar :background-color="topColor" />
    <!-- 본문 영역 -->
    <div class="main-container">
      <tags-view />
      <app-main
        :background-color="footerColor"
        :body-background-color="bodyColor"
      />
    </div>
    <!-- theme / 색상 설정 영역 -->
    <right-panel :button-top="500">
      <settings
        @mainColorChanged="mainColorChanged"
        @themeChanged="themeChanged"
      />
    </right-panel>
  </div>
</template>
<script>
/* eslint-disable */
import RightPanel from '@/components/RightPanel';
import { Navbar, Sidebar, AppMain, TagsView, Settings } from './components';
import ResizeMixin from './mixin/ResizeHandler';

import { toggleClass } from '@/utils';
import '@/assets/custom-theme/index.css'; // the theme changed version element-ui css
import '@/assets/custom-theme/she.css'; // SHE용 커스텀 CSS 추가 2020.08.12 by dylee
import '@/assets/custom-theme/font.css'; // 전시용 임시 추가. NTW

// [S] IE일 경우 전용css추가 2021.01.11 dylee
var isChrome = /*@cc_on!@*/ false || !document.documentMode;
if (!isChrome) {
  import('@/assets/custom-theme/ie.css');
}
// [E] IE일 경우 전용css추가 2021.01.11 dylee

import { mapState } from 'vuex';

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    Settings,
    RightPanel,
  },
  mixins: [ResizeMixin],
  data() {
    return {
      topColor: '#ffffff',
      menuColor: '#242939',
      footerColor: '#ffffff',
      bodyColor: '#F1F1F1',
    };
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      };
    },
    ...mapState({
      needTagsView: (state) => state.settings.visitedViews,
    }),
  },
  beforeMount() {
    this.init();
  },
  mounted() {
    window.addEventListener('resize', this.resizeComponents);
    // this.resizeComponents();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeComponents);
  },
  methods: {
    init() {
      this.topColor = window.localStorage.getItem('topColor')
        ? window.localStorage.getItem('topColor')
        : this.topColor;
      this.menuColor = window.localStorage.getItem('menuColor')
        ? window.localStorage.getItem('menuColor')
        : this.menuColor;
      this.footerColor = window.localStorage.getItem('footerColor')
        ? window.localStorage.getItem('footerColor')
        : this.footerColor;
      this.bodyColor = window.localStorage.getItem('bodyColor')
        ? window.localStorage.getItem('bodyColor')
        : this.bodyColor;
    },
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false });
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar');
      setTimeout(() => {
        this.gridResize(this);
      }, 600);
    },
    goMain() {
      this.$comm.movePage(this.$router, '/index');
    },
    resizeComponents() {
      setTimeout(() => {
        var navHeight = $('.navbar').height();
        var tagsHeight = $('.tags-view-container').height();
        $('.sidebar-container')
          .height
          // window.innerHeight - navHeight - tagsHeight - 80
          ();
        $('.main-container').height(
          window.innerHeight - navHeight - tagsHeight - 20
        );
      }, 600);
    },
    /**
     * [event]top(상단 영역), menu(메뉴 영역), footer(footer 영역) 배경 색상 변경
     */
    mainColorChanged(_item) {
      if (_item.type === 'top') this.topColor = _item.color;
      if (_item.type === 'menu') this.menuColor = _item.color;
      if (_item.type === 'footer') this.footerColor = _item.color;
      if (_item.type === 'body') this.bodyColor = _item.color;
    },
    /**
     * [event] theme 변경
     */
    themeChanged(_item) {
      toggleClass(document.body, 'custom-theme');
    },
    gridResize(_obj) {
      if (!_obj) return;

      if (!_obj.$children || !_obj.$children.length) {
        if (typeof _obj.resizeGrid === 'function') {
          _obj.resizeGrid();
        }
      } else {
        for (let i = 0; i < _obj.$children.length; i++) {
          const childObj = _obj.$children[i];
          this.gridResize(childObj);
          if (typeof childObj.resizeGrid === 'function') {
            childObj.resizeGrid();
          }
        }
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/mixin.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.mainIcon {
  width: 170px;
  height: 50px;
  background: url('../../assets/images/she.png');
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
  float: left;
}

.menuSide {
  width: 50px;
  height: 30px;
  margin-top: 15px;
  background: url('./components/image/left_btn.png');
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
  float: left;
}
.openSidebar .menuSide:hover {
  background: url('./components/image/left_btn.png');
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
}

.hideSidebar .menuSide,
.hideSidebar .menuSide:hover {
  background: url('./components/image/right_btn.png');
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
}

// left menu 활성 비활성화 아이콘
button[data-navpopclose] i:before {
  margin: 0;
}
.open_menu {
  float: left;
  position: relative;
  padding: 0 8px;
  width: 36px;
  height: 48px;
  border: none;
  background: rgba(255, 255, 255, 0);
  top: 2px;
  outline: none;
}
.open_menu .bar {
  display: block;
  width: 100%;
  height: 3px;
  margin-top: 2px;
  background-color: #bbbbbb;
  -webkit-transition: all 0.7s ease;
  -moz-transition: all 0.7s ease;
  -ms-transition: all 0.7s ease;
  -o-transition: all 0.7s ease;
  transition: all 0.7s ease;
}
.open_menu .bar:first-child {
  margin: 0;
}
.open_menu .bar:nth-child(2) {
  width: 18px;
  transition: all 0.5s ease;
}
.open_menu .bar:nth-child(3) {
  width: 14px;
  transition: all 0.5s ease-out;
}
.open_menu:hover .bar:first-child {
  width: 16px;
  -webkit-transform: rotateZ(-45deg) translate(-3px, -6px);
  -moz-transform: rotateZ(-45deg) translate(-3px, -6px);
  -ms-transform: rotateZ(-45deg) translate(-3px, -6px);
  -o-transform: rotateZ(-45deg) translate(-3px, -6px);
  transform: rotateZ(-45deg) translate(-2px, -6px);
}
.open_menu:hover .bar:nth-child(2) {
  position: absolute;
  width: 26px;
  top: 21px;
  right: 3px;
}
.open_menu:hover .bar:nth-child(3) {
  position: absolute;
  width: 25px;
  top: 21px;
  right: 3px;
}
.open_menu:hover .bar:last-child {
  width: 16px;
  -webkit-transform: rotateZ(45deg) translate(-3px, 6px);
  -moz-transform: rotateZ(45deg) translate(-3px, 6px);
  -ms-transform: rotateZ(45deg) translate(-3px, 6px);
  -o-transform: rotateZ(45deg) translate(-3px, 6px);
  transform: rotateZ(45deg) translate(-3px, 6px);
}
.open_menu.menu_close:hover .bar:first-child {
  width: 16px;
  -webkit-transform: rotateZ(45deg) translate(7px, -9px);
  -moz-transform: rotateZ(45deg) translate(7px, -9px);
  -ms-transform: rotateZ(45deg) translate(7px, -9px);
  -o-transform: rotateZ(45deg) translate(7px, -9px);
  transform: rotateZ(45deg) translate(7px, -9px);
}
.open_menu.menu_close:hover .bar:nth-child(2) {
  left: 3px;
  right: auto;
}
.open_menu.menu_close:hover .bar:nth-child(3) {
  left: 3px;
  right: auto;
}
.open_menu.menu_close:hover .bar:last-child {
  width: 16px;
  -webkit-transform: rotateZ(-45deg) translate(5px, 10px);
  -moz-transform: rotateZ(-45deg) translate(5px, 10px);
  -ms-transform: rotateZ(-45deg) translate(5px, 10px);
  -o-transform: rotateZ(-45deg) translate(5px, 10px);
  transform: rotateZ(-45deg) translate(5px, 10px);
}
// end left menu 활성 비활성화 아이콘
</style>
