/* eslint-disable */
const getters = {
  sidebar: (state) => state.app.sidebar,
  language: (state) => state.app.language,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  token: (state) => state.user.token,
  isSso: (state) => state.user.isSso,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  introduction: (state) => state.user.introduction,
  status: (state) => state.user.status,
  roles: (state) => state.user.roles,
  deptAuthGrp: (state) => state.user.deptAuthGrp,
  setting: (state) => state.user.setting,
  permission_routers: (state) => state.permission.routers,
  addRouters: (state) => state.permission.addRouters,
  menuInfo: (state) => state.user.menu,
  allMenu: (state) => state.user.allMenu,
  allAuthMenu: (state) => state.permission.allAuthMenu,
  errorLogs: (state) => state.errorLog.logs,
  deptCd: (state) => state.user.user.deptCd,
  deptNm: (state) => state.user.user.deptNm,
  plantCd: (state) => state.user.user.plantCd,
  plantNm: (state) => state.user.user.plantNm,
  dutyCd: (state) => state.user.user.dutyCd,
  dutyNm: (state) => state.user.user.dutyNm,
  positionCd: (state) => state.user.user.positionCd,
  positionNm: (state) => state.user.user.positionNm,
  userAuthGrps: (state) => state.user.userAuthGrps,
  allDept: (state) => state.dept.allDept,
  langInfo: (state) => state.app.langInfo,
  loading: (state) => state.app.loading,
  isManager: (state) => {
    let authGrps = state.user.userAuthGrps.filter(
      (auth) => auth.settingYn === 'Y'
    );

    let idx = authGrps.findIndex((auth) => auth.authGrpNo === '1090');

    return idx > -1;
  },
  // Google OTP 2차인증용 샘플
  // otpYn: state => state.user.otpYn,
  // otpSecKey: state => state.user.otpSecKey,
  // otpUrl: state => state.user.otpUrl
};
export default getters;
