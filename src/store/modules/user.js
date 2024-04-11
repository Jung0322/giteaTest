/* eslint-disable */
import axios from 'axios';
import {
  sso,
  loginByUsername,
  logout,
  getUserInfo,
  loginByUserAccount,
  getUserMenus,
  getMenus,
  validToken,
} from '@/api/login';
import {
  getToken,
  getAccessToken,
  getRefreshToken,
  setToken,
  setAccessToken,
  setRefreshToken,
  removeToken,
  removeRefreshToken,
  removeAccessToken,
} from '@/utils/auth';

const user = {
  state: {
    user: '',
    status: '',
    // Google OTP 2차인증용 샘플
    // otpYn: '',
    // otpSecKey: '',
    // otpUrl: '',
    code: '',
    token: getToken(),
    isSso: '',
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    deptAuthGrp: null,
    setting: {
      articlePlatform: [],
    },
    userAuthGrps: [],
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_IS_SSO: (state, token) => {
      state.isSso = token;
    },
    SET_ACCESS_TOKEN: (state, token) => {
      state.accessToken = token;
    },
    SET_REFRESH_TOKEN: (state, token) => {
      state.refreshtoken = token;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_AUTH_PLANT_DEPT: (state, deptAuthGrp) => {
      state.deptAuthGrp = deptAuthGrp;
    },
    SET_MENU_INFO: (state, menu) => {
      state.menu = menu;
    },
    SET_ALL_MENU: (state, allMenu) => {
      state.allMenu = allMenu;
    },
    SET_USER_AUTH_GRPS: (state, userAuthGrps) => {
      state.userAuthGrps = userAuthGrps;
    },
    // Google OTP 2차인증용 샘플
    // SET_OTP_YN: (state, otpYn) => {
    //   state.otpYn = otpYn;
    // },
    // SET_OTP_SECKEY: (state, otpSecKey) => {
    //   state.otpSecKey = otpSecKey;
    // },
    // SET_OTP_URL: (state, otpUrl) => {
    //   state.otpUrl = otpUrl;
    // }
  },

  actions: {
    // 사용자 이름 로그인
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password)
          .then((response) => {
            const data = response.data;
            commit('SET_TOKEN', data.userId);
            commit('SET_ACCESS_TOKEN', data.accessToken);
            commit('SET_REFRESH_TOKEN', data.refreshToken);
            setToken(response.data.userId);
            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 사용자 계정 로그인
    sso({ commit }) {
      return new Promise((resolve, reject) => {
        sso()
          .then((response) => {
            const data = response.data;
            // 원본
            // commit('SET_TOKEN', data.token)
            // setToken(response.data.token)
            commit('SET_IS_SSO', '0');
            commit('SET_TOKEN', data.userId);
            commit('SET_ACCESS_TOKEN', data.accessToken);
            commit('SET_REFRESH_TOKEN', data.refreshToken);

            setToken(response.data.userId);
            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken);
            resolve();
          })
          .catch((error) => {
            // if (
            //   error.message.includes('undefined') &&
            //   error.message.includes('$emit')
            // ) {
            //   window.alert('연결할 수 없습니다. 관리자에게 문의하세요.');
            // } else {
            //   window.alert(error.response.data.message);
            // }
            reject(error);
          });
      });
    },

    // 사용자 계정 로그인
    LoginByUserAccount({ commit }, userInfo) {
      const userId = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        loginByUserAccount(userId, userInfo.password, userInfo.otppassword)
          .then((response) => {
            const data = response.data;
            // 원본
            // commit('SET_TOKEN', data.token)
            // setToken(response.data.token)
            commit('SET_IS_SSO', '1');
            commit('SET_TOKEN', data.userId);
            commit('SET_ACCESS_TOKEN', data.accessToken);
            commit('SET_REFRESH_TOKEN', data.refreshToken);
            // Google OTP 2차인증용 샘플
            // commit('SET_OTP_YN', data.otpYn);
            // commit('SET_OTP_SECKEY', data.otpSecKey);
            // commit('SET_OTP_URL', data.otpUrl);
            setToken(response.data.userId);
            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken);
            resolve();
          })
          .catch((error) => {
            // if (
            //   error.message.includes('undefined') &&
            //   error.message.includes('$emit')
            // ) {
            //   window.alert('연결할 수 없습니다. 관리자에게 문의하세요.');
            // } else {
            //   window.alert(error.response.data.message);
            // }
            reject(error);
          });
      });
    },

    // 사용자 정보 얻기
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.access)
          .then((response) => {
            if (!response.data) {
              // mockjs는 맞춤 상태 코드를 지원하지 않으므로 다음과 같이 Interupt 가능
              reject('error');
            }
            const data = response.data;
            if (data.auths && data.auths.length > 0) {
              // 사용자 roles 확인
              commit('SET_ROLES', data.auths);
              commit('SET_USER_AUTH_GRPS', data.userAuthGrps);
            } else {
              reject('getInfo: roles must be a non-null array !');
            }

            commit('SET_NAME', data.user.userNm);

            commit('SET_USER', data.user);
            commit('SET_AUTH_PLANT_DEPT', data.deptAuthGrp);

            // commit('SET_AVATAR', data.avatar)
            // commit('SET_INTRODUCTION', data.introduction)

            // TODO : 원본 소스
            // if (data.roles && data.roles.length > 0) { // 사용자 roles 확인
            //   commit('SET_ROLES', data.roles)
            // } else {
            //   reject('getInfo: roles must be a non-null array !')
            // }

            // commit('SET_NAME', data.name)
            // commit('SET_AVATAR', data.avatar)
            // commit('SET_INTRODUCTION', data.introduction)
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 사용자 계정 로그인
    GetUserMenus({ commit }, state) {
      const userId = this.state.user.user.userId.trim();
      return new Promise((resolve, reject) => {
        getUserMenus(userId)
          .then((response) => {
            const data = response.data;
            commit('SET_MENU_INFO', data);

            resolve(data);
          })
          .catch((error) => {
            this.$emit('APP_REQUEST_ERROR', _error);
            window.alert('Not login');
            reject(error);
          });
      });
    },

    // 전체 메뉴 조회
    GetMenus({ commit }, state) {
      return new Promise((resolve, reject) => {
        getMenus()
          .then((response) => {
            const data = response.data;
            commit('SET_ALL_MENU', data);

            resolve(data);
          })
          .catch((error) => {
            this.$emit('APP_REQUEST_ERROR', _error);
            // window.alert('Not login');
            reject(error);
          });
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_IS_SSO', '');
            commit('SET_TOKEN', '');
            commit('SET_ACCESS_TOKEN', '');
            commit('SET_REFRESH_TOKEN', '');
            commit('SET_ROLES', []);
            // Google OTP 2차인증용 샘플
            // commit('SET_OTP_YN', '');
            // commit('SET_OTP_SECKEY', '');
            // commit('SET_OTP_URL', '');
            removeToken();
            removeAccessToken();
            removeRefreshToken();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit('SET_IS_SSO', '');
        commit('SET_TOKEN', '');
        commit('SET_ACCESS_TOKEN', '');
        commit('SET_REFRESH_TOKEN', '');
        // Google OTP 2차인증용 샘플
        // commit('SET_OTP_YN', '');
        // commit('SET_OTP_SECKEY', '');
        // commit('SET_OTP_URL', '');
        removeToken();
        removeAccessToken();
        removeRefreshToken();
        resolve();
      });
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise((resolve) => {
        commit('SET_ROLES', role);
        // setToken(role)
        getUserInfo(role).then((response) => {
          const data = response.data;
          commit('SET_ROLES', data.roles);
          commit('SET_NAME', data.name);
          commit('SET_AVATAR', data.avatar);
          commit('SET_INTRODUCTION', data.introduction);
          dispatch('GenerateRoutes', data); // 动态修改权限后 重绘侧边菜单
          resolve();
        });
      });
    },

    // AccessToken만료로 Refresh토큰으로
    UpdateTokenByRefreshToken({ commit }, state) {
      const refreshToken = getRefreshToken();
      // 헤더에 설정.
      axios.defaults.headers.common['X-Authorization'] = refreshToken;
      return new Promise((resolve, reject) => {
        updateTokenByRefreshToken()
          .then((response) => {
            const data = response.data;
            resolve();
          })
          .catch((error) => {
            if (
              error.message.includes('undefined') &&
              error.message.includes('$emit')
            ) {
              window.alert('연결할 수 없습니다. 관리자에게 문의하세요.');
            } else {
              window.alert(error.response.data.message);
            }
            reject(error);
          });
      });
    },
    ValidCheckRefreshToken({ commit }, state) {
      const refreshToken = getRefreshToken();
      // 헤더에 설정.
      axios.defaults.headers.common['X-Authorization'] = refreshToken;
      return new Promise((resolve, reject) => {
        updateTokenByRefreshToken()
          .then((response) => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // AccessToken만료로 Refresh토큰으로
    ValidCheckToken({ commit }, state) {
      // 헤더에 설정.
      axios.defaults.headers.common['X-Authorization'] = getAccessToken();
      return new Promise((resolve, reject) => {
        validToken()
          .then((response) => {
            const data = response.data;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    ClearRoles({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLES', []);
        resolve();
      });
    },
  },
};

export default user;
