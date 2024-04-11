import request from '@/utils/request';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import common from '@/js/common';

export function loginByUsername(username, password) {
  const data = {
    username,
    password,
  };
  return request({
    url: '/login/login',
    method: 'post',
    data,
  });
}

export function sso() {
  return request({
    url: transactionConfig.sso.insert.url,
    method: 'post',
  });
}

export function loginByUserAccount(_userId, _userPwd, _userOtpPass) {
  const data = {
    userId: _userId,
    userPwdSHA: _userPwd,
    userOtpPass: _userOtpPass,
  };
  return request({
    url: transactionConfig.login.insert.url,
    method: 'post',
    data,
  });
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post',
  });
}

export function getUserInfo(token) {
  return request({
    // url: '/user/info',
    url: selectConfig.manage.loginuser.get.url,
    method: 'get',
    params: {
      token,
    },
  });
}

export function getUserMenus(userId) {
  var url = selectConfig.userMenu.get.url + userId;
  const data = {
    lang: common.getLang(),
  };
  return request({
    url: url,
    method: 'get',
    params: {
      lang: common.getLang(),
    },
  });
}

export function getMenus() {
  var url = selectConfig.menu.list.url;
  const data = {
    lang: common.getLang(),
  };
  return request({
    url: url,
    method: 'get',
    params: {
      lang: common.getLang(),
    },
  });
}

export function updateTokenByRefreshToken() {
  var url = selectConfig.login.refresh.url;
  return request({
    url: url,
    method: 'get',
  });
}

export function validToken() {
  var url = selectConfig.login.valid.url;
  return request({
    url: url,
    method: 'get',
  });
}

export function getLangInfo(_lang, _divide) {
  const data = {
    lang: _lang,
    divide: _divide,
  };
  return request({
    url: selectConfig.language.url,
    method: 'post',
    data,
  });
}
