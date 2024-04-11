<!-- top 영역 -->
<template>
  <div class="navbar navbar_custom" :style="`background-color:` + topColor">
    <div style="width: 0%">
      <template v-if="device !== 'mobile'">
        <error-log class="errLog-container right-menu-item" />
      </template>
    </div>
    <div class="safelogo">
      <img :src="publicPath + '/src/assets/images/safe-logo-tree.png'" />
      <span
        ><font class="safe-logo-1">안</font><font class="safe-logo-1">전</font
        ><font class="safe-logo-1">환</font><font class="safe-logo-1">경</font>
        <font class="safe-logo-2">P</font><font class="safe-logo-2">o</font
        ><font class="safe-logo-2">r</font><font class="safe-logo-2">t</font
        ><font class="safe-logo-2">a</font
        ><font class="safe-logo-2">l</font></span
      >
    </div>

    <div class="topuserclass">
      <div style="float: right; line-height: 50px">
        <span class="usernmlabel" style="font-size: 12.8px">
          <b>{{ this.$store.getters.name }}</b
          >님
        </span>
        <el-link
          icon="el-icon-switch-button"
          class="logoutbtn"
          @click.native.prevent="logout"
          title="Logout"
        ></el-link>
        <el-menu
          id="hamburgerMenu"
          :default-active="test1"
          class="el-menu-demo no-border-bottom"
          style="overflow-x: auto; float: right"
          mode="horizontal"
          :background-color="topColor"
          text-color="#545c64"
          active-text-color="#545c64"
          @select="handleSelect"
        >
          <el-submenu index="1" class="top-menu">
            <div slot="title" class="topTilie">
              <f-icon
                icon="list-alt"
                size="2x"
                :style="{ color: 'black', cursor: 'pointer' }"
              />
            </div>
            <el-menu-item index="1-1" @click="openUserFavoritesDialog()"
              >즐겨찾기</el-menu-item
            >
            <el-menu-item index="1-2" @click="openMyPageDialog()"
              >비밀번호 변경</el-menu-item
            >
            <el-menu-item index="1-3" @click="openMySignDialog()"
              >내 서명 관리</el-menu-item
            >
          </el-submenu>
        </el-menu>
        <el-button
          type="text"
          @click.prevent="goLogin"
          id="goLogin"
          style="visibility: hidden"
        ></el-button>
      </div>
    </div>

    <div v-if="isManage" class="topbadgeclass">
      <LangSelect />
    </div>

    <div class="topbadgeclass">
      <template v-for="item in badges">
        <el-badge
          :value="item.count"
          :max="9"
          :key="item.title"
          :class="{ item: true, on: item.count > 0 }"
        >
          <el-button
            type="primary"
            :icon="item.icon"
            @click="movePage(item)"
            class="topbadgebtn"
            :title="item.title"
          ></el-button>
        </el-badge>
      </template>
    </div>

    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Hamburger from '@/components/Hamburger';
import ErrorLog from '@/components/ErrorLog';
import Screenfull from '@/components/Screenfull';
import SizeSelect from '@/components/SizeSelect';
import LangSelect from '@/components/LangSelect';
import ThemePicker from '@/components/ThemePicker';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import {
  removeToken,
  removeAccessToken,
  removeRefreshToken,
} from '../../../utils/auth';
// import { asyncRouterMap } from '@/router/index';
let fromDate = null;
let toDate = null;

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker,
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar', 'device']),
    topColor() {
      let localStorageColor = window.localStorage.getItem('topColor');
      let color = this.backgroundColor;
      color = localStorageColor || this.backgroundColor;
      return color;
    },
    isManage() {
      /**
       * 2022.02.16 LHJ
       * 시스템 관리자/협력사개발 권한 있을 경우 다국어 아이콘 보여주도록 수정
       */
      let isManager = false;
      let userAuthGrps = this.$store.getters.userAuthGrps.filter(
        (auth) => auth.settingYn === 'Y'
      );

      let authLen = userAuthGrps.filter(
        (auth) =>
          String(auth.authGrpNo) === '1090' || String(auth.authGrpNo) === '1095'
      ).length;
      isManager = authLen ? true : false;

      return isManager;
      // return this.$store.getters.token === 'manager';
    },
    publicPath: function () {
      return process.env.PUBLIC_PATH;
    },
  },
  beforeMount() {
    this.init();
    this.$root.$on('UPDATE_APPR_STATUS', this.getData);
  },
  mounted() {
    this.$nextTick(() => {
      $('.el-menu-demo .el-icon-arrow-down').hide();
    });
    window.addEventListener('resize', this.setSize);
  },
  beforeDestory() {
    window.removeEventListener('resize', this.setSize);
  },
  props: {
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
  },
  data() {
    return {
      activeIndex2: '1',
      test1: '1',
      loading: false,
      topMenuDisplay: true,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '500px',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      // 상단의 아이콘 영역
      badges: [],
    };
  },

  methods: {
    init() {
      this.setSize();
      this.initBadges();
      this.getData();
    },
    initBadges() {
      // 최근 1년
      fromDate = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-1y',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      fromDate = this.$comm.getCalculatedDate(
        fromDate,
        '1d',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      toDate = this.$comm.moment(this.$comm.getToday()).format('YYYY-MM-DD');

      let badges = [
        {
          icon: 'el-icon-tickets',
          title: '결재할 문서',
          id: 'apprCnt',
          name: 'COM30010',
          params: {
            from: fromDate,
            to: toDate,
            apprYn: 'N',
            returnYn: 'N',
          },
          path: '/manage/appr/apprWhich',
          count: 0,
        },
        {
          icon: 'el-icon-time',
          title: '결재요청문서',
          id: 'requestCnt',
          name: 'COM30011',
          params: {
            from: fromDate,
            to: toDate,
            bizApprStepCd: 'BAPSA',
          },
          path: '/manage/appr/apprRequest',
          count: 0,
        },
        {
          icon: 'el-icon-scissors',
          title: '반려된 문서',
          id: 'returnCnt',
          name: 'COM30010',
          params: {
            from: fromDate,
            to: toDate,
            apprYn: 'Y',
            returnYn: 'Y',
          },
          path: '/manage/appr/apprWhich',
          count: 0,
        },
      ];

      this.badges = badges;
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar');
    },
    handleSelect(key, keyPath) {
      // el-menu--horizontal
      setTimeout(() => {
        $('#hamburgerMenu')
          .find('.el-submenu__title')
          .css('border-bottom-color', 'rgb(255, 255, 255)');
      }, 600);
    },
    logout() {
      this.$http.url = this.$format(
        transactionConfig.login.update.url,
        this.$store.getters.token
      );
      this.$http.type = 'PUT';
      this.$http.request(
        (_result) => {
          this.$store.dispatch('LogOut').then(() => {
            location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getUserNm() {
      this.$store.commit('SET_NAME');
    },
    setSize() {
      setTimeout(() => {
        this.topMenuDisplay = window.innerWidth > 1500;
      }, 600);
    },
    onChangePassword: function () {
      this.$refs.modalsChangePwd.show();
    },
    goLogin: function () {
      // this.memoryInit();
      // this.$router.push('/auth/login');
      this.popupOptions.target = () =>
        import(`${'../../../views/login/loginpop.vue'}`);
      this.popupOptions.title = '로그인';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closeLoginPopup;
    },
    memoryInit: function () {
      removeToken();
      removeAccessToken();
      removeRefreshToken();
      axios.defaults.headers.common['X-Authorization'] = null;
      // this.$router.push('/auth/login');
    },
    closeLoginPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      // this.popupOptions.width = '500px';
      // 로그인정보 다시 설정 및 원래 페이지의 처리
      if (data === 'X') {
        // 이전 서비스 호출.
        let checkToPath = window.localStorage.getItem('checkToPath');
        if (checkToPath !== 'null') {
          this.$router.push(checkToPath);
          window.localStorage.setItem('checkToPath', null);
        }
      }
    },
    openUserFavoritesDialog() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/userManage/userFavorites.vue'}`);
      this.popupOptions.width = '95%';
      this.popupOptions.height = '100%';
      this.popupOptions.title = '즐겨찾기';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
        popupName: '즐겨찾기',
      };
      this.popupOptions.closeCallback = this.closeFavoritesPopup;
    },
    openMyPageDialog() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/userManage/passwordChange.vue'}`);
      this.popupOptions.width = '30%';
      this.popupOptions.height = '100%';
      this.popupOptions.title = '비밀번호 변경';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        userId: this.$store.getters.token,
      };
      this.popupOptions.closeCallback = this.closeFavoritesPopup;
    },
    openMySignDialog() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/userManage/userSignManage.vue'}`);
      this.popupOptions.width = '350px';
      this.popupOptions.height = '100%';
      this.popupOptions.title = '내 서명 관리';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        userId: this.$store.getters.token,
      };
      this.popupOptions.closeCallback = this.closeFavoritesPopup;
    },
    closeFavoritesPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data && data.frontEndUrl) {
        var lvCheckMenuId = data.menuId;
        var redirectMenuUrl = data.frontEndUrl;
        if (data.menuLvl === 2) {
          let createUrl = redirectMenuUrl.split('/');
          redirectMenuUrl =
            '/' + createUrl[1] + '/' + createUrl[createUrl.length - 1];
        } else if (data.menuLvl === 3) {
          let createUrl = redirectMenuUrl.split('/');
          redirectMenuUrl =
            '/' +
            createUrl[1] +
            '/' +
            createUrl[2] +
            '/' +
            createUrl[createUrl.length - 1];
        }

        this.$comm.movePage(this.$router, redirectMenuUrl);
      }
    },
    closeApprPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    // [event] 배지 클릭시 이동
    movePage(_item) {
      _item.query = { timestamp: Date.now() };
      this.$router.push(_item).catch(() => {});
    },
    setBtnText(_text) {
      alert();
    },
    getData() {
      this.$http.url = selectConfig.main.portlet.myInfo.get.url;
      this.$http.type = 'GET';
      this.$http.param = {
        userId: this.$store.getters.token,
        from: fromDate,
        to: toDate,
      };
      this.$http.request(
        (_result) => {
          // this.$_.extend(this.myInfoData, _result.data);
          if (!_result || !_result.data) return;

          this.$_.forEach(this.badges, (_item) => {
            if (_result.data.hasOwnProperty(_item.id))
              _item.count = _result.data[_item.id];
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">
#hamburgerMenu {
  .el-submenu__title:hover {
    background-color: #fff !important;
  }
  .el-submenu__title {
    padding: 0px !important;
  }
}
</style>

<style scoped>
.no-border-bottom {
  border-bottom: solid 0px #e6e6e6;
}
.item {
  margin-top: 5px;
  margin-right: 10px;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
