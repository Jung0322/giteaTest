/* eslint-disable */
import router from './router';
import store from './store';
import _ from 'lodash'
import {
  Message
} from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import {
  getToken,
  haveRoute
} from '@/utils/auth'; // getToken from cookie
import common from './js/common';
import transactionConfig from '@/js/transactionConfig';
import request from '@/utils/request';
import Cookies from 'js-cookie'

NProgress.configure({
  showSpinner: false
}); // NProgress Configuration

// permission judge function
function hasPermission(roles, permissionRoles) {
  // if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
  // if (!permissionRoles) return true
  // return roles.some(role => permissionRoles.indexOf(role) >= 0)
  return true;
}

const whiteList = ['/login', '/auth-redirect', '/ssologin', '/404', '/sessionTimeOut', '/ssoFail', '/sheappr/appr-list', '/sheappr/appr-request-list']; // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar
  store.dispatch('setLoading', true);

  // 검색 박스 보이고 숨기기 초기화
  store.dispatch('clearSearchBox');
  // let resolve = router.resolve({
  //   name: to.name
  // });
  // if (to.name !== 'Dashboard' && to.name !== '' && (resolve.href === '' || resolve.href === '/')) {
  //   next({
  //     path: '/404'
  //   });
  // }
  if (store.getters.permission_routers && store.getters.permission_routers.length > 0) { //  && !to.name
    if (!haveRoute(store.getters.permission_routers, to.name)) {
      next({
        path: '/404'
      });
    }
  }
  window.localStorage.setItem('checkToPath', to.path);
  let isToken = getToken();
  if (isToken && isToken !== 'undefined') {
    // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({
        path: '/'
      });
      NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
      store.dispatch('setLoading', false);
    } else if (to.path === '/ssologin') {
      next();
      NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
      store.dispatch('setLoading', false);
    } else {
      var url = transactionConfig.manage.log.menulog.url;
      let menuId = to.name;
      let menuNm = to.meta.title;
      let menuPath;
      if (to.meta.navi !== undefined) {
        menuPath = to.meta.navi + to.meta.title;
      } else {
        menuPath = to.meta.title;
      }
      let menuUrl = to.path;

      if (menuNm !== undefined) {
        request({
          url: url,
          method: 'POST',
          params: {
            menuId: menuId,
            menuNm: menuNm,
            menuPath: menuPath,
            url: menuUrl,
            createUserId: isToken,
          },
        });
      }
      if (store.getters.roles.length === 0) {
        // 현재 사용자가 user_info 정보를 가져 왔는지 확인
        store
          .dispatch('GetUserInfo')
          .then(result => {
            // user_info 조회
            store
            .dispatch('GetLangInfo', { lang: Cookies.get('language'), divide: null })
            .then(() => {
              store
                .dispatch('GetUserMenus')
                .then(_menus => {
                  // TODO : 원본 소스
                  // const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
                  store.dispatch('GenerateRoutes', {
                    _menus
                  }).then(() => {
                    router.addRoutes(store.getters.addRouters); // 접근 가능한 라우팅 테이블을 동적으로 추가
                    next({
                      ...to,
                      replace: true
                    }); // addRoutes가 완료되었는지 확인하기위한 해킹 메소드 , set the replace: true so the navigation will not leave a history record
                  });
                  // next();
                })
              store
                .dispatch('GetMenus')
                .then(result => {
                  // 전체 메뉴 조회
                })
                .catch(err => {
                  store.dispatch('FedLogOut').then(() => {
                    Message.error(
                      err || 'Verification failed, please login again'
                    );
                    next({
                      path: '/'
                    });
                  });
                });
            })
            .catch(err => {
              store.dispatch('FedLogOut').then(() => {
                Message.error(
                  err || 'Verification failed, please login again'
                );
                next({
                  path: '/'
                });
              });
            });;
          })
          .catch(err => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err || 'Verification failed, please login again');
              next({
                path: '/'
              });
            });
          });
          store.dispatch('getDept');
      } else {
        // 동적으로 권한을 변경할 필요가 없으며, next ()로 권한 판단 삭제
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          // const link = router.resolve({
          //   path: router.currentRoute.path,
          // });
          // // if (to.path === '/index' || (link && (link.href !== '/' && link.href !== '/login'))) {
          // if (to.path === '/index' || (link && link.href !== '/')) {
          store
            .dispatch('ValidCheckToken')
            .then(result => {
              next();
            })
            .catch(err => {
              // refresh_token을 재발급 처리시도
              store
                .dispatch('ValidCheckRefreshToken')
                .then(() => {
                  next();
                })
                .catch(err => {
                  // 로그인 창띄우고 처리되면 next()처리를 해야 한다.
                  if (store.getters.isSso === '1') {
                    $('#goLogin').click();
                  } else {
                    // 초기화 후 sso 처리가 끝났다는 창 open
                    store
                      .dispatch('LogOut')
                      .then(() => {
                        next({
                          path: '/sessionTimeOut',
                        });
                      })
                      .catch(err => {
                        next({
                          path: '/sessionTimeOut',
                        });
                      });
                  }
                });
            });
          // next();
          // } else {
          //   next({
          //     path: '/'
          //   });
          // }
        } else {
          next({
            path: '/401',
            replace: true,
            query: {
              noGoBack: true
            }
          });
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
      store.dispatch('setLoading', false);
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
  store.dispatch('setLoading', false);
});
