<!-- left menu 영역 -->
<template>
  <el-scrollbar
    wrap-class="scrollbar-wrapper"
    :style="`background-color:` + backgroundColor"
  >
    <el-tabs
      type="card"
      :stretch="true"
      v-model="activeTabName"
      class="tab-background"
      @tab-click="tabClick"
    >
      <!-- 메뉴 -->
      <el-tab-pane
        :label="$comm.getLangSpecInfoLabel('L0000003408')"
        name="menu"
      >
        <el-menu
          :show-timeout="200"
          :default-active="$route.path"
          :collapse="isCollapse"
          :unique-opened="true"
          mode="vertical"
          :background-color="backgroundColor"
          text-color="#c7cbd7"
          active-text-color="#409EFF"
        >
          <sidebar-item
            v-for="route in permission_routers"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </el-tab-pane>
      <!-- 즐겨찾기 -->
      <el-tab-pane
        :label="$comm.getLangSpecInfoLabel('L0000003409')"
        name="myMenu"
      >
        <template v-for="(menu, idx) in favoriteMenus">
          <!-- <app-link :to="resolvePath(onlyOneChild.path)"> -->
          <el-menu
            :key="idx"
            :show-timeout="200"
            :default-active="$route.path"
            :collapse="isCollapse"
            mode="vertical"
            :background-color="backgroundColor"
            text-color="#c7cbd7"
            active-text-color="#409EFF"
          >
            <el-menu-item
              :key="menu.frontEndUrl"
              :index="menu.frontEndUrl"
              :class="{ 'submenu-title-noDropdown': true }"
              @click="menuClicked(menu.frontEndUrl)"
            >
              <item v-if="menu.icon" :icon="menu.icon" :title="menu.menuNm" />
              <i
                v-if="!isCollapse"
                class="favoriteDelIcon el-icon-close"
                @click.prevent.stop="favoriteDel(menu.menuId)"
                title="즐겨찾기 삭제"
              ></i>
            </el-menu-item>
          </el-menu>
          <!-- </app-link> -->
        </template>
      </el-tab-pane>
    </el-tabs>
  </el-scrollbar>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';
import selectConfig from '@/js/selectConfig.js';
import Item from './Item';

export default {
  components: { SidebarItem, Item },
  props: {
    backgroundColor: {
      type: String,
      default: '#242939',
    },
  },
  data() {
    return {
      activeTabName: 'menu',
      favoriteMenus: null,
    };
  },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  beforeMount() {
    this.init();
    // 즐겨찾기 추가/삭제시 사이드바 즐겨찾기 다시 불러오기
    // 2020.08.19 dylee
    this.$root.$on('GET_REF_FAVORITE', this.getFavoriteMenus);
  },
  methods: {
    init() {
      this.getFavoriteMenus();
    },
    getFavoriteMenus() {
      let urlSplit = [];
      let frontEndUrlSplit = [];
      this.$http.url = this.$format(
        selectConfig.userMenu.favorites.url,
        this.$store.getters.token
      );
      this.$http.type = 'GET';
      this.$http.isLoading = false;
      this.$http.request((_result) => {
        if (!_result || !_result.data) return;
        this.favoriteMenus = _result.data;
      });
    },
    favoriteDel(_menuId) {
      // 즐겨찾기 사이드바 삭제
      // 2020.08.19 dylee
      //window.getApp.$emit('CONFIRM', {
      //  title: '확인',
      //  message: '즐겨찾기를 삭제하시겠습니까?',
      //  type: 'info',
      // 확인 callback 함수
      //  confirmCallback: () => {
      window.getApp.$emit('DELETE_FAVORITE', _menuId);
      this.getFavoriteMenus();
      //   },
      //  cancelCallback: () => {

      //  },
      //});
    },
    // [event] 탭 클릭 이벤트
    tabClick() {},
    menuClicked(_url) {
      let frontendUrl = '';
      let routeUrl = _url.split('?')[0];
      let param = _url.split('?').length > 1 ? _url.split('?')[1] : '';

      frontendUrl = !param ? routeUrl : routeUrl + '_' + param.split('=')[1];

      this.$comm.movePage(this.$router, frontendUrl);
    },
  },
};
</script>

<style>
.favoriteDelIcon {
  position: absolute;
  top: 50%;
  right: 20px;
  margin-top: -7px;
  font-size: 12px;
}
.favoriteDelIcon i {
  font-size: 12px !important;
  font-weight: 700 !important;
}
/*
.tab-background>.el-tabs__header {
  background-color: #ffffff !important;
}
*/
</style>
