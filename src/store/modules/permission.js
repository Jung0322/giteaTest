/* eslint-disable */
import { asyncRouterMap, constantRouterMap } from '@/router';
import _ from 'lodash';
import comm from '@/js/common';

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */

function hasPermission(_menus, _path) {
  var path = _path;
  if (path.lastIndexOf('/') === path.length - 1) path = path.slice(0, -1);
  return _menus.some((_menu) => {
    var frontEndUrl = _menu.frontEndUrl;
    if (frontEndUrl.lastIndexOf('/') === frontEndUrl.length - 1)
      frontEndUrl = frontEndUrl.slice(0, -1);
    return path === frontEndUrl;
  });
}

// TODO : 원본
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * 비동기식 라우팅 테이블을 반복적으로 필터링하고 사용자 역할 사용 권한과 일치하는 라우팅 테이블 반환
 * @param routes asyncRouterMap
 * @param roles
 */

function filterAsyncRouter(routes, _menus, _parentPath) {
  const res = [];
  routes.forEach((route) => {
    const tmp = {
      ...route,
    };

    let path = '';
    let writeYn = '';
    let title = '';
    if (typeof _parentPath != 'undefined') path = _parentPath + '/' + tmp.path;
    else path = tmp.path;
    // var has = true;
    var has = hasPermission(_menus, path);
    if (has) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, _menus, path);
      }

      for (var i = 0; i < _menus.length; i++) {
        if (_menus[i].frontEndUrl === path) {
          writeYn = _menus[i].writeYn === 'Y' ? true : false;
          title = _menus[i].menuNm;
          break;
        }
      }

      tmp.meta.editable = writeYn;
      tmp.meta.title = title;
      res.push(tmp);
    }
    // if (hasPermission(_menus, path)) res.push(tmp)
    //}
  });
  return res;
}

function getComponet(subLevel, frontEndUrl, menuLevel) {
  let componet;
  if (menuLevel === 1) {
    componet = () => import('@/views/layout/Layout');
  } else if (subLevel && subLevel.length > 0 && menuLevel === 2) {
    componet = () => import('@/router/routeLevel');
  } else if (subLevel && subLevel.length > 0 && menuLevel === 3) {
    componet = () => import('@/router/routeSubLevel');
  } else {
    componet = () => import(`@/pages${frontEndUrl.join('/')}`);
  }
  return componet;
}

function getLeftMenu(_Allmenus, _menus, menuLevel, navi) {
  let menuLevel1 = _.filter(_menus, {
    menuLvl: menuLevel.toString(),
  });
  _.forEach(menuLevel1, (menu) => {
    menu.sortOrder = menu.sortOrder
      ? !isNaN(menu.sortOrder)
        ? _.parseInt(menu.sortOrder)
        : 0
      : 0;
  });
  menuLevel1 = _.orderBy(menuLevel1, ['sortOrder'], ['asc']);

  let subLevel = [];
  let returnMenu = [];
  let urlSplit = [];
  let frontEndUrlSplit = [];
  _.forEach(menuLevel1, (menu) => {
    let param = [];
    subLevel = _.filter(_Allmenus, {
      menuLvl: (menuLevel + 1).toString(),
      upMenuId: menu.menuId,
    });
    urlSplit = menu.frontEndUrl.split('?');
    if (urlSplit.length > 1) param = urlSplit[1];

    frontEndUrlSplit = urlSplit[0].split('/');
    let menuInfo = {
      component: getComponet(subLevel, frontEndUrlSplit, menuLevel),
      // component: menuLevel === 1 ? '@/views/layout/Layout' : subLevel && subLevel.length > 0 && menuLevel === 2 ? '@/router/routeLevel' : subLevel && subLevel.length > 0 && menuLevel === 3 ? '@/router/routeSubLevel' : `@/pages${menu.frontEndUrl}`,
      meta: {
        editable: menu.writeYn === 'Y' ? true : false,
        // plantAccess: !menu.allPlantAccessCd ? 'APA02' : menu.allPlantAccessCd,
        title: menu.menuNm,
      },
      name: menu.menuId, // frontEndUrlSplit.join('_') + (param.length > 0 ? '_' + param.split('=')[1] : ''),
    };

    if (menuLevel === 1) {
      menuInfo.meta.color = menu.color;
      menuInfo.meta.icon = menu.icon;
      menuInfo.path = '/' + frontEndUrlSplit[frontEndUrlSplit.length - 1];
    } else {
      menuInfo.path = frontEndUrlSplit[frontEndUrlSplit.length - 1];
    }

    // param은 1개만 되도록 설정
    // 여러개의 param을 받게 할 시 수정 필요
    if (param.length > 0) {
      menuInfo.meta.param = param.split('=')[1];
      menuInfo.path = menuInfo.path + '_' + param.split('=')[1];
    }

    if (subLevel && subLevel.length > 0) {
      menuInfo.children = getLeftMenu(
        _Allmenus,
        subLevel,
        menuLevel + 1,
        navi ? navi + ' > ' + menu.menuNm : menu.menuNm
      );
      let paramRemove = subLevel[0].frontEndUrl.split('?');
      menuInfo.redirect = paramRemove[0];
    } else {
      menuInfo.meta.navi = menuLevel === 1 ? '' : navi + ' > ';
    }
    returnMenu.push(menuInfo);
  });
  return returnMenu;
}
// TODO : 원본
// function filterAsyncRouter(routes, roles) {
//   const res = []

//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRouter(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })

//   return res
// }

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    allAuthMenu: [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      let index = _.findIndex(constantRouterMap, { name: 'index-dashboard' });
      if (index > -1) {
        constantRouterMap[index].children[0].meta.title =
          comm.getLangSpecInfoLabel('L0000001015'); // '메인화면'
      }

      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
    SET_ALL_AUTH_MENU: (state, routers) => {
      state.allAuthMenu = routers;
    },
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise((resolve) => {
        const { _menus } = data;
        let accessedRouters;

        let filteredMenu = _.filter(_menus, { mainMenuYn: 'Y' });

        // accessedRouters = asyncRouterMap
        // accessedRouters = filterAsyncRouter(asyncRouterMap, _menus); -- 기존방식(router를 만들어 보여주는 방식)

        // 2019.06.14 kdh 메뉴 DB에서 가져와 show
        accessedRouters = getLeftMenu(filteredMenu, filteredMenu, 1, '');

        // TODO : 원본소스
        // if (roles.includes('admin')) {
        //   accessedRouters = asyncRouterMap
        // } else {
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        // }
        commit('SET_ROUTERS', accessedRouters);
        commit('SET_ALL_AUTH_MENU', _menus);
        resolve();
      });
    },
  },
};

export default permission;
