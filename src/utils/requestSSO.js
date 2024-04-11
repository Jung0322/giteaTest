/* eslint-disable */
// 로그인시 처리되는 모듈
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Message
} from 'element-ui';
import store from '@/store';
import router from '@/router';
import {
  getToken
} from '@/utils/auth';
import {
  getAccessToken,
  getNewToken,
  setAccessToken,
  setRefreshToken,
  getAccessExpiredCode,
  getRefreshExpiredCode,
  getWrongPasswordCode,
  getConcurrentExpiredCode,
  getRefreshToken,
} from './auth';
import common from '../js/common';

// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API, // api base_url
  baseURL: process.env.BASE_API,
  timeout: 5000, // request timeout
  withCredentials: true, // 쿠키전달용
  // responseEncoding: 'utf-8',
  // crossDomain: true,
});

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // X-Token으로 사용자 정의 요청 수행
      // config.headers = Cookies.get()
      config.headers['x-token'] = getToken();
      config.headers['X-Authorization'] = `${getAccessToken()}`;
    }
    return config;
  },
  error => {
    // Do something with request error
    this.$emit('APP_REQUEST_ERROR', _error);
    Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // console.log('AUTH INTERCEPTORS', error.response);
    const status = error.response ? error.response.status : null;
    const returnCode = error.response ? error.response.data.returnCode : null;
    if (status === 401) {
      if (returnCode === getAccessExpiredCode()) {
        // Access Token 만료 : Refresh Token으로 재인증 요청
        // console.log('-------------- 2-1. Access Token 만료')
        // 1. Refresh Token 확인 요청
        return getNewToken().then(_res => {
          // 2. 새로 발급된 Access Token 으로 재요청
          // console.log('-------------- 2-3. 새로 발급된 Access Token 으로 재요청')
          let token = getAccessToken();
          service.defaults.headers.common['X-Authorization'] = token;
          error.config.headers['X-Authorization'] = token;
          // 이전요청을 다시 수행하도록 url및 parameter등을 다시 호출.
          return service.request(error.config);
          // if (typeof _callbackSuccess === 'function') _callbackSuccess({});
          // if (http.isLoading) window.getApp.$emit('LOADING_HIDE');
          // http.isLoading = true;
        });
      } else if (returnCode === getRefreshExpiredCode()) {
        // Refresh Token 만료
        // 1. 비밀번호 확인 팝업 띄우기
        common.openCheckPwdPopup();
      } else if (returnCode === getWrongPasswordCode()) {
        // 비밀번호가 맞지 않을 때만 진입
        return Promise.reject(error);
      } else if (returnCode === getConcurrentExpiredCode()) {
        // 새로운 IP로 로그인 했을 때만 진입
        common.openCheckLoginPopup();
        return;
      } else {
        // if (store.getters.isSso === '0') {
        //   common.goLogin();
        // } else {
        //   // session이 끊어졌다는 화면으로 이동시켜야 함
        //   common.movePage(router, '/404');
        // }
        if (store.getters.isSso === '1') {
          common.goLogin();
        } else {
          // 초기화 후 sso 처리가 끝났다는 창 open
          store
            .dispatch('LogOut')
            .then(() => {
              common.movePage(router, '/sessionTimeOut');
            })
            .catch(err => {
              common.movePage(router, '/sessionTimeOut');
            });
        }
      }
    } else {
      window.getApp.$emit('APP_REQUEST_ERROR', '접속이 원활하지 않습니다.');
      if (store.getters.isSso === '1') {
        common.goLogin();
      } else {
        // 초기화 후 sso 처리가 끝났다는 창 open
        store
          .dispatch('LogOut')
          .then(() => {
            common.movePage(router, '/sessionTimeOut');
          })
          .catch(err => {
            common.movePage(router, '/sessionTimeOut');
          });
      }
    }
    return Promise.reject(error);
  }
);

export default service;
