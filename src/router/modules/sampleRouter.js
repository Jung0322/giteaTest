// /** When your routing table is too long, you can split it into small modules**/

// import Layout from '@/views/layout/Layout'

// /* Router Modules */
// import componentsRouter from './components'
// import chartsRouter from './charts'
// import tableRouter from './table'

// const sampleRouter = {
//   // TODO : 1 Level
//   path: '/sample',
//   component: Layout,
//   redirect: 'noredirect',
//   name: 'sample',
//   meta: {
//     title: '샘플소스',
//     icon: '',
//     color: '',
//   },
//   // TODO : 2 Level
//   children: [
//     // 기초 정보 메뉴
//     {
//       path: 'reports',
//       component: () => import('@/pages/sample/reports'),
//       name: 'reports',
//       meta: { title: '성적서' }
//     },
//     {
//       path: 'permit',
//       component: () => import('@/pages/sample/permit'),
//       name: 'permit',
//       meta: { title: '인허가' }
//     },
//     {
//       path: 'moc',
//       component: () => import('@/pages/sample/moc'),
//       name: 'moc',
//       meta: { title: '변경' }
//     },
//     {
//       path: 'excavation',
//       component: () => import('@/pages/sample/excavation'),
//       name: 'excavation',
//       meta: { title: '아차사고/발굴카드' }
//     },
//     {
//       path: 'riskHazard',
//       component: () => import('@/pages/sample/riskHazard'),
//       name: 'riskHazard',
//       meta: { title: '유해위험물질' }
//     },
//     {
//       path: 'autogenerator',
//       component: () => import('@/pages/autogenerator/AutoGenerator'),
//       name: 'AutoGenerator',          
//       meta: { title: '코드생성기', noCache: true }
//     },
//     {
//       path: 'edit',
//       component: () => import('@/pages/sample/edit'),
//       name: 'edit',
//       meta: { title: 'y-Components' }
//     },
//     componentsRouter,
//     chartsRouter,
//     tableRouter
//   ]
// }

// export default sampleRouter
