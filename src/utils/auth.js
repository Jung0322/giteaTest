/* eslint-disable */
import Cookies from 'js-cookie';
import axios from 'axios';

// token은 user_id를 가져오고 있음. 전체바꾸기를 해야함.
const TokenKey = 'jwtToken';
const RefreshTokenKey = 'refreshToken';
const accessTokenKey = 'accessToken';

const accessExpiredCode = 'ACCESS_EXPIRED';
const refreshExpiredCode = 'REFRESH_EXPIRED';
const wrongPasswordCode = 'WRONG_PASSWORD';
const concurrentExpiredCode = 'CONCURRENT_EXPIRED';

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getAccessToken() {
  return Cookies.get(accessTokenKey);
}

export function setAccessToken(accessToken) {
  return Cookies.set(accessTokenKey, 'Bearer ' + accessToken);
}

export function removeAccessToken() {
  return Cookies.remove(accessTokenKey);
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey);
}

export function setRefreshToken(refreshToken) {
  return Cookies.set(RefreshTokenKey, 'Bearer ' + refreshToken);
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey);
}

export function setTodayClose(todayClose) {
  return Cookies.set('todayClose', todayClose);
}

export function getTodayClose() {
  return Cookies.set('todayClose');
}

export function getNewToken() {
  // console.log('-------------- 2-2. Refresh Token 확인 요청')
  let refToken = getRefreshToken();

  const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 5000, // request timeout
    // responseEncoding: 'utf-8',
    // crossDomain: true,
  });
  const validRefreshCall = service
    .get('/api/auth/refresh', {
      headers: {
        // 요청 헤더
        'X-Authorization': refToken,
      },
    })
    .then(response => {
      let data = response.data;
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      return Promise.resolve(true);
      // return response;
    })
    .catch(error => {
      return Promise.reject(error);
    });

  return validRefreshCall;
}

export function getAccessExpiredCode() {
  return accessExpiredCode;
}

export function getRefreshExpiredCode() {
  return refreshExpiredCode;
}

export function getWrongPasswordCode() {
  return wrongPasswordCode;
}

export function getConcurrentExpiredCode() {
  return concurrentExpiredCode;
}

export function haveRoute(routers, pathId) {
  let returnVal = false;
  if (routers && routers.length > 0) {
    for (let i = 0; i < routers.length; i++) {
      if (routers[i].children) {
        // 자식  메뉴가 존재하는 경우
        returnVal = haveRoute(routers[i].children, pathId);
        if (returnVal) {
          return true;
        } else {
          if (routers[i].name === pathId) {
            return true;
          } else {
            returnVal = false;
          }
        }
      } else {
        if (routers[i].name === pathId) {
          return true;
        } else {
          returnVal = false;
        }
      }
    }
  }
  return returnVal;
}