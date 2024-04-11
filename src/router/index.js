import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/views/layout/Layout';

/* Router Modules */
// import heaRouter from './modules/heaRouter.js'
// import safeRouter from './modules/safeRouter.js'
// import envRouter from './modules/envRouter.js'
// import baseInfoRouter from './modules/baseInfoRouter.js'
// import mgtRouter from './modules/mgtRouter.js'
// import manageRouter from './modules/manageRouter.js'
// import sampleRouter from './modules/sampleRouter.js'
// import rsaRouter from './modules/rsaRouter.js'
// import psmRouter from './modules/psmRouter.js'
// import imprRouter from './modules/imprRouter.js'
// import chemRouter from './modules/chemRouter.js'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
/* eslint-disable */
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        name: 'redirect',
        component: () => import('@/views/redirect/index'),
      },
    ],
  },
  {
    path: '/ssologin',
    name: 'ssologin',
    component: () => import('@/views/login/default'),
    hidden: true,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/auth-redirect',
    name: 'auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true,
  },
  {
    path: '/ssoFail',
    name: 'ssoFail',
    component: () => import('@/views/errorPage/ssoFail'),
    hidden: true,
  },
  {
    path: '/sessionTimeOut',
    name: 'sessionTimeOut',
    component: () => import('@/views/errorPage/ssoOut'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errorPage/404'),
    hidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/errorPage/401'),
    hidden: true,
  },
  {
    path: '/poplogin',
    name: 'poplogin',
    component: () => import('@/views/login/loginpop'),
    hidden: true,
  },
  {
    path: '/sheappr/appr-list',
    name: 'appr-list',
    component: () => import('@/pages/manage/appr/groupwareAppr'),
    hidden: true,
  },
  {
    path: '/sheappr/appr-request-list',
    name: 'appr-request-list',
    component: () => import('@/pages/manage/appr/groupwareApprRequest'),
    hidden: true,
  },
  {
    path: '/she/chm/mat-check-requst',
    name: 'mat-check-requst',
    component: () => import('@/pages/chm/wholeProcess/matCheckRequestPODetail'),
    hidden: true,
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    name: 'index-dashboard',
    children: [
      {
        path: 'index',
        // component: () => import('@/views/dashboard/index'),
        component: () => import('@/pages/index'),
        // component: () => import('@/pages/sample/chart'),
        name: 'Dashboard',
        meta: {
          title: '', // '메인화면'
          icon: 'home',
          noCache: true,
          editable: true,
        },
      },
    ],
  },
];

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0,
  }),
  base: process.env.NODE_ENV === 'production' ? '/v2/' : '/',
  routes: constantRouterMap,
  mode: 'history', // # 제거
});

export const asyncRouterMap = [
  /** When your routing table is too long, you can split it into small modules**/
  // mgtRouter,
  // safeRouter,
  // imprRouter,
  // heaRouter,
  // envRouter,
  // psmRouter,
  // rsaRouter,
  // chemRouter,
  // baseInfoRouter,
  // manageRouter,
  // sampleRouter,
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
];
