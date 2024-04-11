/* eslint-disable */
import Cookies from 'js-cookie'
import store from '@/store';
import {
  getLangInfo,
} from '@/api/login';
//싸고 있는 app에서 쿠키를 저장, 다른 메뉴를 클릭 할 때마다 쿠키를 저장, 초기화진행
const app = {
  state: {
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false
    },
    appmain: {
      opened: Cookies.get('searchboxStatus') ? !!+Cookies.get('searchboxStatus') : true,
    },
    device: 'desktop',
    language: Cookies.get('language') || 'kr',
    size: Cookies.get('size') || 'medium',
    langInfo: {
      label: null,
      message: null,
    },
    loading: false,
  }, //돌연변이: 검색박스가 보여진 상태일 때 닫히는 상태로, 때마다 쿠키저장
  mutations: {
    HIDE_SEARCH_BOX: state => {
      state.appmain.opened = !state.appmain.opened
      if (state.appmain.opened) {
        Cookies.set('searchboxStatus', 1)
      } else {
        Cookies.set('searchboxStatus', 0)
      }
    },
    CLEAR_SEARCH_BOX: state => {
      state.appmain.opened = true
      Cookies.set('searchboxStatus', 1)
    },
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }

      let event; // The custom event that will be created
      if(document.createEvent){
          event = document.createEvent("HTMLEvents");
          event.initEvent("SIDEBAR-CHANGED", true, true);
          event.eventName = "SIDEBAR-CHANGED";
          window.dispatchEvent(event);
      } else {
          event = document.createEventObject();
          event.eventName = "SIDEBAR-CHANGED";
          event.eventType = "SIDEBAR-CHANGED";
          window.fireEvent(event.eventType, event);
      }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 0)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_SIZE: (state, size) => {
      state.size = size
      Cookies.set('size', size)
    },
    SET_LANG_INFO: (state, langInfo) => {
      state.langInfo = langInfo;
    },
    SET_LOADING: (state, loading) => {
      state.loading = loading;
    },
  }, //commit 수행, 객체처럼 넘겨줌
  actions: {
    hideSearchBox({
      commit
    }) {
      commit('HIDE_SEARCH_BOX')
    },
    clearSearchBox({
      commit
    }) {
      commit('CLEAR_SEARCH_BOX')
    },
    toggleSideBar({
      commit
    }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({
      commit
    }, {
      withoutAnimation
    }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({
      commit
    }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage({
      commit
    }, language) {
      commit('SET_LANGUAGE', language);
    },
    setSize({
      commit
    }, size) {
      commit('SET_SIZE', size)
    },
    GetLangInfo({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        getLangInfo(data.lang, data.divide)
          .then(response => {
            const data = response.data;
            if (data) {
              let langInfo = {
                label: {},
                message: {},
              };
              let labels = data.label;
              let messages = data.message;
              if (labels) {
                labels.forEach(item => {
                  langInfo.label[item.lblCd] = item.lblConversionVal;
                })
              }
              if (messages) {
                messages.forEach(item => {
                  langInfo.message[item.msgCd] = item.msgConversionVal;
                })
              }

              commit('SET_LANG_INFO', langInfo);
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    setLoading({
      commit
    }, loading) {
      commit('SET_LOADING', loading);
    },
  }
}

export default app
