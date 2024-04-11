import moment from 'moment';
import _ from 'lodash';
import Cookies from 'js-cookie';

import $format from 'string-format';
import $router from '../router';
import $store from '../store';

import selectConfig from '@/js/selectConfig';

import arrayToTree from 'array-to-tree';

var comm = {
  baseDeviceSize: 600,
  getFixedSizeByDevice: null,
  movePage: null,
  movePageReplace: null,
  clone: null,
  today: new Date(moment().format()),
  getToday: null,
  getPrevDate: null,
  getFirstDayThisYear: null,
  getLastDayThisYear: null,
  getThisMonth: null,
  getPrevMonth: null,
  getThisYear: null,
  getPrevYear: null,
  getFormatDate: null,
  getCalculatedDate: null,
  getLocaleYearMon: null,
  getLastDayOfMonth: null,
  convertStringToDate: null,
  dateCompare: null,
  getDatediff: null,
  fixedStr: null,
  getFilteredArray: null,
  trim: null,
  moment: moment,
  setNumberSeperator: null,
  getPercentage: null,
  getImgFileAsUrl: null,
  getFileAsBlob: null,
  defaultGapOfDate: '6d',
  removeDuplicatedArray: null,
  isDateType: null,
  fileDownload: null,
  openCheckPwdPopup: null,
  goCheckPassword: null,
  goLogin: null,
  base64ToBlob: null,
  bytesToSize: null,
  getFileExtIcon: null,
  getAccept: null,
  isStringEmpty: null,
  toUndrFromCamelCase: null,
  telephoneMask: null,
  checkEmail: null,
  generateRandom: null,
  getCookieName: null,
  getRouterName: null,
  setCookie: null,
  getCookie: null,
  pushCookie: null,
  setSearchParamByCookie: null,
  // array를 tree형태로 변환
  convertArrayToTree: null,
  findNestedNode: null,
  recursivePromise: null,
  orderedPromise: null,
  getComboItems: null,
  hexToDecimal: null,
  decimalToHex: null,
  getTextColorByBackgroundColor: null,
  getLang: null,
  getLangSpecInfoLabel: null,
  getLangSpecInfoMessage: null,
  chkAuthGrp: null,
  isCompanyGrp: false, // 전사 담당자 여부
  isPlantGrp: false, // 사업장 담당자
};

/**
 * function name : getDeviceRatio
 * remark : device 크기에 따라서 크기를 동적으로 조정
 * parameters
 *  _baseSize : xs 사이즈(600px) 기준 크기
 *  _breakpoint: $vuetify.breakpoint 개체
 */
comm.getFixedSizeByDevice = function (_baseSize, _breakpoint) {
  var ratio = null;
  if (_breakpoint.xs) return _baseSize;
  else if (_breakpoint.smAndUp) {
    ratio = window.screen.width / comm.baseDeviceSize;
    return Math.floor(_baseSize * ratio);
  }
};

comm.movePage = function (_$router, _path) {
  _$router.push({
    path: _path,
  });
};

comm.movePageReplace = function (_$router, _path) {
  _$router.replace({
    path: _path,
  });
};

/**
 * function name : clone
 * remark : JSON object 복제
 * @param {*} _json : 원본 JSON object
 */
comm.clone = function (_json) {
  return JSON.parse(JSON.stringify(_json));
};

comm.getToday = function (_isLocalSet) {
  var today = null;
  var dateFormat = _isLocalSet ? 'L' : 'YYYY-MM-DD'; // default : ISO format('YYYY-MM-DD)
  return moment().format(dateFormat);
};

comm.getTodayDateTime = function () {
  var today = null;
  var dateFormat = 'YYYY-MM-DD HH:mm:ss';
  return moment().format(dateFormat);
};

/**
 * 현재날짜를 기준으로 과거 일자를 가져오는 함수
 * @param {} _gapOfDate : 현재일 기준 이전 날짜, 기본값 : 1y (예) 10d - 10일전, 10m - 10개월 전, 10y - 10년전
 * 사용예) comm.getPrevDate('10d')
 */
comm.getPrevDate = function (_gapOfDate, _format) {
  let gapOfDate = comm.defaultGapOfDate;
  if (_gapOfDate) gapOfDate = _gapOfDate;
  let div = gapOfDate.substr(gapOfDate.length - 1, 1).toLowerCase();
  let gap = Number(gapOfDate.substring(0, gapOfDate.length - 1));
  let date = new Date(comm.today);
  if (div === 'd') date.setDate(date.getDate() - gap);
  else if (div === 'm') date.setMonth(date.getMonth() - gap);
  else if (div === 'y') date.setYear(date.getFullYear() - gap);

  var prevDate = null;
  var dateFormat = _format ? _format : 'YYYY-MM-DD'; // default : ISO format('YYYY-MM-DD)
  return moment(date).format(dateFormat);
};

comm.fixStr = function (_str, _size, _div) {
  if (_str === null || _str.length <= 0) return '';
  var fixedStr = _str.toString();
  var i = 0;
  for (i = 0; i < _size - fixedStr.length; i++) {
    fixedStr = _div + fixedStr;
  }
  return fixedStr;
};

comm.getFormatDate = function (_dateStr, _div) {
  var date = _dateStr.split(' ');
  if (_dateStr.length < 8) return null;
  _div = typeof _div === 'undefined' ? '-' : _div;
  var formatDate = {};
  formatDate.date = '';
  formatDate.hour = [];
  if (_dateStr.length === 8) formatDate.date =
      _dateStr.substring(0, 4) +
      _div +
      _dateStr.substring(4, 6) +
      _div +
      _dateStr.substring(6, 8);
  else if (_dateStr.length === 12) {
    formatDate.date =
      _dateStr.substring(0, 4) +
      _div +
      _dateStr.substring(4, 6) +
      _div +
      _dateStr.substring(6, 8);
    formatDate.hour.push(_dateStr.substring(8, 10));
    formatDate.hour.push(_dateStr.substring(10, 12));
  } else {
    formatDate.date = date[0];
    formatDate.hour.push(date[1].split(':')[0]);
    formatDate.hour.push(date[1].split(':')[1]);
  }
  return formatDate;
};

/**
 * 배열내 _item을 비교하여 중복된 정보를 제거한 배열
 * @param {*} _array : 원본 배열
 * @param {*} _item : 비교할 정보
 * ex) this.$comm.getFilteredArray(orgArray, item) OR
 *      orgArray = this.$comm.getFilteredArray(orgArray, item)
 */
comm.getFilteredArray = function (_array, _item) {
  // var filteredItems = [];
  // filteredItems = _.filter(_array, function (__item) {
  //   return _.isEqual(_item, __item);
  // });
  // if (!filteredItems.length) _array.push(_item);
  // return _array;
};

/**
 * _fromDate와 _toDate를 비교하는 함수
 * @param _fromDate : 비교 시작일자
 * @param _toDate : 비교 종료일자 : 없을 경우 오늘날짜로 기본값 설정
 * @returns Boolean
 */
comm.dateCompare = function (_fromDate, _toDate) {
  if (!_fromDate) return false;
  var fromDate = moment(_fromDate).format('YYYYMMDD');
  var toDate = null;
  if (_toDate) toDate = moment(_toDate).format('YYYYMMDD');
  else toDate = moment(comm.today).format('YYYYMMDD');
  return fromDate <= toDate;
};

comm.getFirstDayThisYear = function () {
  return comm.today.getFullYear() + '-01-01';
};

comm.getLastDayThisYear = function () {
  return comm.today.getFullYear() + '-12-31';
};

comm.trim = function (_data) {
  // if (typeof _data === 'string') return $.trim(_data);
  // else if (typeof _data === 'object') {
  //   try {
  //     for (var key in _data) {
  //       if (_data[key] && typeof _data[key] === 'string') _data[key] = $.trim(_data[key]);
  //     }
  //     return _data;
  //   } catch (e) {
  //     return _data;
  //   }
  // }
};
/**
 * 날짜를 받아와서 두 날의 차이일수를 가져오는 함수
 * @param {*필수} _firstDate : 비교날짜 1
 * @param _secondDate : 비교날짜 2, 없으면
 * @return 차이일수
 */
comm.getDatediff = function (_firstDate, _secondDate) {
  if (!_firstDate) return null;
  if (!_secondDate) _secondDate = comm.today;
  return Math.round((_secondDate - _firstDate) / (1000 * 60 * 60 * 24));
};

/**
 * string으로 날짜형식을 Date형식으로 변환
 * @param {*필수} _strDate : string형식의 날짜값
 * @param _spliter : 년월일 구분자(기본값: '-')
 * @return Date
 * @example comm.convertStringToDate('2018-12-12', '-')
 */
comm.convertStringToDate = function (_strDate, _spliter) {
  if (!_spliter) _spliter = '-';
  var dateArray = _strDate.split(_spliter);
  return new Date(_strDate);
};

comm.getThisMonth = function (_format) {
  var formatL = '';
  _format = _format ? _format : 'YYYYMM';
  if (_format === 'locale') {
    formatL = moment.localeData().longDateFormat('L');
    _format = formatL.replace(/D/g, '').replace(/^\W|\W$|\W\W/, '');
  }
  return moment().format(_format);
};

comm.getPrevMonth = function (_prev, _format) {
  var formatL = '';
  _format = _format ? _format : 'YYYYMM';
  if (_format === 'locale') {
    formatL = moment.localeData().longDateFormat('L');
    _format = formatL.replace(/D/g, '').replace(/^\W|\W$|\W\W/, '');
  }
  return moment()
    .add(Math.abs(_prev) * -1, 'M')
    .format(_format);
};

comm.getThisYear = function () {
  return moment().format('YYYY');
};

comm.getPrevYear = function (_prev) {
  return moment()
    .add(Math.abs(_prev) * -1, 'y')
    .format('YYYY');
};

/**
 * 기준일자(_thisDate)에서 계산된 날짜(년, 월, 일)를 가져오는 함수
 * 사용예) comm.getPrevDate('10d')
 * @param {*String} _thisDateStr : 기준일자(년, 월, 일)
 * @param {*String} _gapOfDate : 현재일 기준 이전 날짜, 기본값 : 1y (예) -10d - 10일전, 10m - 10개월 후, 10y - 10년후
 * @param {*String} _givenFormat : 주어진 날짜의 형식
 * @param {*String} _format : 리턴되는 날짜 형식(기본값은 ISO 표준 형식)
 */
comm.getCalculatedDate = function (
  _thisDateStr,
  _gapOfDate,
  _givenFormat,
  _format
) {
  let gapOfDate = comm.defaultGapOfDate;
  if (_gapOfDate) gapOfDate = _gapOfDate;
  if (
    _gapOfDate.indexOf('d') === -1 &&
    _gapOfDate.indexOf('m') === -1 &&
    _gapOfDate.indexOf('y') === -1
  ) {
    return;
  }
  let div = gapOfDate.substr(gapOfDate.length - 1, 1).toLowerCase();
  let gap = Number(gapOfDate.substring(0, gapOfDate.length - 1));
  let thisDate = comm.moment(_thisDateStr, _givenFormat);
  // let define = _isAdd ? 1 : -1
  let format = _givenFormat.toUpperCase();
  let typeOfDate = null; // TODO : 계산되는 날짜 형식(https://momentjs.com/docs/ 페이지의 Add함수 참고)
  if (div === 'd') {
    // format = _format ? _format : 'YYYY-MM-DD';
    typeOfDate = 'd';
  } else if (div === 'm') {
    // format = _format ? _format : 'YYYY-MM';
    typeOfDate = 'M';
  } else if (div === 'y') {
    // format = _format ? _format : 'YYYY';
    typeOfDate = 'y';
  }
  return thisDate.add(gap, typeOfDate).format(format);
};

/**
 * locale 형식에 맞는 년월 날짜를 가져오는 함수
 * @param {String} _thisDateStr
 * @param {String} _givenFormat
 */
comm.getLocaleYearMon = function (_thisDateStr, _givenFormat) {
  let formatL = moment.localeData().longDateFormat('L');
  let format = formatL.replace(/D/g, '').replace(/^\W|\W$|\W\W/, '');
  return comm.moment(_thisDateStr, _givenFormat).format(format);
};

comm.setNumberSeperator = (_number) => {
  if (!_number) return 0;
  if (isNaN(_number)) return null;
  return _number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

comm.getPercentage = (_target, _devider) => {
  if (!_target) return 0;
  _devider = !_devider ? 1 : _devider;
  var value = Math.ceil((_target / _devider) * 100);
  if (isNaN(value)) value = 0;
  return value;
};

/**
 * 이미지 파일을 url 정보로 조회
 * @augments 서버에서 수신된 byte이미지
 */
comm.getImgFileAsUrl = (_imgData) => {
  // var imgData = new Uint8Array(_imgData)
  // var blob = new window.Blob([imgData], {type: 'image/png'})
  var blob = comm.getFileAsBlob(true, _imgData);
  return window.URL.createObjectURL(blob);
};

comm.getFileAsBlob = (_isImage, _fileData) => {
  var type = _isImage ? 'image/png' : 'application/octet-stream';
  var fileData = new Uint8Array(_fileData);
  return new window.Blob([fileData], {
    type: type,
  });
};

/**
 * 배열과 배열을 비교해서 포함되어 있는지 확인하는 함수
 * _targetArray : 대상 배열
 * _array : 원본 배열
 */
comm.removeDuplicatedArray = (_targetArray, _array) => {
  var hasItems = false;
  var filteredArray = [];
  _.forEach(_array, (_item) => {
    hasItems = false;
    _.forEach(_targetArray, (__item) => {
      if (JSON.stringify(_item) === JSON.stringify(__item)) hasItems = true;
    });
    if (!hasItems) filteredArray.push(_item);
  });
  return filteredArray;
};

/**
 * 배열과 배열을 비교해서 포함되어 있는지 확인하는 함수 (배열안의 데이터타입이 object인 경우)
 * _targetArray : 대상 배열
 * _array : 원본 배열
 * _key : 비교할 키
 */
comm.removeDuplicatedArrayObject = (_targetArray, _array, _key) => {
  var hasItems = false;
  var filteredArray = [];
  _.forEach(_array, (_item) => {
    hasItems = false;
    _.forEach(_targetArray, (__item) => {
      if (_item[_key] === __item[_key]) {
        hasItems = true;
      }
    });
    if (!hasItems) filteredArray.push(_item);
  });
  return filteredArray;
};

/**
 *
 * _targetArray : 대상 배열
 * _array : 원본 배열
 * _key : 비교할 키
 */
comm.removeDuplicatedArrayObject = (_targetArray, _array, _key) => {
  var hasItems = false;
  var filteredArray = [];
  _.forEach(_array, (_item) => {
    hasItems = false;
    _.forEach(_targetArray, (__item) => {
      if (_item[_key] === __item[_key]) {
        hasItems = true;
      }
    });
    if (!hasItems) filteredArray.push(_item);
  });
  return filteredArray;
};

comm.isDateType = (_str) => {
  var m = moment(_str);
  return m.isValid();
};

comm.fileDownload = (_url, _method) => {
  if (typeof _method === 'undefined') {
    _method = 'get';
  }

  var frame = null;
  var form = null;
  if (document.getElementById('__filedownload')) {
    frame = document.getElementById('__filedownload');
    form = document.getElementsByName('__filedownloadform');
  } else {
    frame = document.createElement('iframe');
    form = document.createElement('form');

    frame.id = '__filedownload';
    frame.name = '__filedownload';
    frame.style.display = 'none';
    document.body.appendChild(frame);

    frame.id = '__filedownloadform';
    form.action = _url;
    form.method = _method;
    form.target = '__filedownload';
    document.body.appendChild(form);
  }

  form.submit();
};

// 비밀번호 확인 팝업 띄우기
comm.openCheckPwdPopup = function () {
  $('#openCheckPwdPopup').click();
};

comm.openCheckLoginPopup = function () {
  $('#openCheckLoginPopup').click();
};

comm.goCheckPassword = function () {
  $('#goCheckPwdPopup').click();
};

// cookie, localStorage 비움 → 로그인 화면으로 이동 (※ 로그아웃 서비스 호출 X)
comm.goLogin = function () {
  $('#goLogin').click();
};

// Base64로 인코딩된 이미지, 텍스트 데이터 등을 Blob 유형으로 변환한다.
comm.base64ToBlob = function (base64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  let byteCharacters = atob(base64Data);
  let byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    let slice = byteCharacters.slice(offset, offset + sliceSize);

    let byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    let byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  let blob = new Blob(byteArrays, {
    type: contentType,
  });

  return blob;
};

comm.bytesToSize = function (bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

comm.getFileExtIcon = function (_fileExt) {
  let iconExt = '';
  switch (_fileExt) {
    case 'pdf':
      iconExt = 'fas fa-file-pdf';
      break;
    case 'xlsx' || 'xls':
      iconExt = 'fas fa-file-excel';
      break;
    case 'doc' || 'docx':
      iconExt = 'fas fa-file-word';
      break;
    case 'ppt' || 'pptx':
      iconExt = 'fas fa-file-powerpoint';
      break;
    case 'txt':
      iconExt = 'fas fa-file-alt';
      break;
    case 'zip':
      iconExt = 'fas fa-clone';
      break;
    default:
      iconExt = 'fas fa-file-alt';
      break;
  }
  return iconExt;
};

comm.getAccept = function (_fileExt) {
  let accept = 'application';
  if (_fileExt.indexOf('xls') >= 0) accept += '/vnd.ms-excel';
  else if (_fileExt.indexOf('doc') >= 0) accept += '/msword';
  else if (_fileExt.indexOf('ppt') >= 0) accept += '/vnd.ms-powerpoint';
  else if (_fileExt.indexOf('pdf') >= 0) accept += '/pdf';
  else accept += '/octet-stream';

  return accept;
};

comm.isStringEmpty = function (_str) {
  if (_str === undefined) return true;
  if (_str === null) return true;
  if (_str.replace(/(\s*)/g, '') === '') return true;
  return false;
};

comm.toUndrFromCamelCase = function (_str) {
  return _str
    .replace(/(.)([A-Z][a-z]+)/g, '$1_$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase();
};

comm.telephoneMask = function (val) {
  if (val) {
    if (val.length <= 11) {
      return '##-###-####';
    } else if (val.length === 12) {
      return '###-###-####';
    } else {
      return '###-####-####';
    }
  } else {
    return '';
  }
};

comm.checkEmail = function (email) {
  if (email === null || email === '') {
    return null;
  }
  var exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
  if (exptext.test(email) === false) {
    return false;
  } else {
    return true;
  }
};

comm.generateRandom = function (min, max) {
  var ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return ranNum;
};

comm.getCookie = function (cookieName) {
  return Cookies.get(cookieName);
};

comm.setCookie = function (cookieName, contents, expireTime) {
  if (typeof expireTime !== 'undefined' || expireTime != null) {
    let exTime = Number(expireTime) / 24;
    Cookies.set(cookieName, contents, {
      expires: exTime,
    });
  } else {
    Cookies.set(cookieName, contents);
  }
};

// CookieName 공통선언
comm.getCookieName = function () {
  return 'SHE' + $store.getters.token;
};
// RouterName 공통선언
comm.getRouterName = function () {
  return $router.app._route.name;
};

comm.pushCookie = function (searchParam) {
  // , routeName, cookieName // 공통적용

  var cookieName = comm.getCookieName();
  var routeName = comm.getRouterName();

  if (searchParam.tap) {
    routeName = routeName + '_' + searchParam.tap;
  }

  let cookie = localStorage.getItem(cookieName);
  if (cookie) {
    let index = -1;
    // let cookieLength = document.cookie.match('(^|[^;]+)\\s*' + cookieName + '\\s*=\\s*([^;]+)');

    cookie = JSON.parse(cookie);

    _.forEach(cookie, (item, i) => {
      if (item.routeName === routeName) {
        index = i;
      }
    });
    if (index !== -1) {
      cookie.splice(index, 1);
    }

    cookie.push({
      searchParam: searchParam,
      routeName: routeName,
    });

    // if (cookie.length > 20 || cookieLength.pop().length > 3000) {
    //   cookie.splice(0, 1);
    // }
  } else {
    cookie = [];
    cookie.push({
      searchParam: searchParam,
      routeName: routeName,
    });
  }
  // comm.setCookie(cookieName, JSON.stringify(cookie), 2);
  localStorage.setItem(cookieName, JSON.stringify(cookie));
};

comm.setSearchParamByCookie = function (tap) {
  // , routeName, cookieName // 공통적용

  var cookieName = comm.getCookieName();
  var routeName = comm.getRouterName();
  var searchedParam;

  if (tap) {
    routeName = routeName + '_' + tap;
  }

  if (localStorage.getItem(cookieName)) {
    let cookieData = JSON.parse(localStorage.getItem(cookieName));
    let index = -1;
    _.forEach(cookieData, (item, i) => {
      if (item.routeName === routeName) {
        index = i;
      }
    });
    if (index !== -1) {
      searchedParam = cookieData[index].searchParam;
    }
  }
  return searchedParam;
};

comm.deleteSearchParamByCookie = function () {
  // routeName, cookieName // 공통적용

  var cookieName = comm.getCookieName();
  var routeName = comm.getRouterName();

  let cookie = localStorage.getItem(cookieName);
  if (cookie) {
    let index = -1;
    // let cookieLength = document.cookie.match('(^|[^;]+)\\s*' + cookieName + '\\s*=\\s*([^;]+)');

    cookie = JSON.parse(cookie);

    _.forEach(cookie, (item, i) => {
      if (item.routeName === routeName) {
        index = i;
      }
    });
    if (index !== -1) {
      cookie.splice(index, 1);
    }
  }
  localStorage.setItem(cookieName, JSON.stringify(cookie));
};

/**
 * array를 tree json 형태로 변환
 * @param {*} _array array 데이터(DB 데이터)
 * @param {*} _parentProperty 부모 키 속성명
 * @param {*} _id id 속성명
 */
comm.convertArrayToTree = function (_array, _parentProperty, _id) {
  if (!_array || _array.length <= 0) return null;

  var tree = arrayToTree(_array, {
    parentProperty: _parentProperty,
    customID: _id,
  });
  return tree;
};

/**
 *
 * @param {*} _node json 형식의 array
 * @param {*} _childProperty 자식 속성명
 * @param {*} _filter 검색 조건
 */
comm.findNestedNode = function (_node, _childProperty, _filter) {
  let foundNode = null;
  let result = window.getApp.$_.filter(_node, _filter);
  if (result.length > 0) foundNode = result;

  if (foundNode) return foundNode;
  let i = 0;
  for (i; i < _node.length; i++) {
    let item = _node[i];
    let result = null;
    if (item.hasOwnProperty(_childProperty)) result = comm.findNestedNode(
      item[_childProperty],
      _childProperty,
      _filter
    );
    if (result) return result;
  }
};

/**
 * 재귀함수로 promise 처리하는 함수
 * @param {Promise 함수와 옵션값을 가지고 있는 Object 배열} _promises
 * @param {배열의 index} _currIndex
 * _promises 내부 인자 값 설명
 * @param {Promise 함수} _promises[_currIndex].func
 * @param {Promise 함수의 parameter} _promises[_currIndex].param
 * @param {예외 처리용 메시지} _promises[_currIndex].exceptionMessage
 * @param {성공 처리용 메시지} _promises[_currIndex].successMessage
 */
comm.recursivePromise = function (_promises, _currIndex) {
  _currIndex = typeof _currIndex === 'undefined' ? 0 : _currIndex;
  if (_currIndex >= _promises.length) return false;
  let currentPromise = _promises[_currIndex];
  let currentPromiseFunc = currentPromise.func;
  let param = currentPromise.param ? currentPromise.param : null;

  let alertMessage = {
    title: 'L0000003395', // 안내
    message: null,
    type: 'warning',
  };

  if (typeof currentPromiseFunc !== 'function') return false;
  currentPromiseFunc
    .call(this, param)
    .then((_resolve) => {
      if (_resolve) {
        if (currentPromise.successMessage) {
          alertMessage.message = this.getLangSpecInfoMessage(
            currentPromise.successMessage
          );
          alertMessage.type = 'success';
          return window.getApp.$emit('ALERT', alertMessage);
        }
        return this.recursivePromise(_promises, ++_currIndex);
      } else {
        if (currentPromise.exceptionMessage) {
          alertMessage.message = this.getLangSpecInfoMessage(
            currentPromise.exceptionMessage
          );
          return window.getApp.$emit('ALERT', alertMessage);
        }
      }
    })
    .catch((_error) => {
      if (window.getApp) {
        window.getApp.$emit('APP_REQUEST_ERROR', _error);
      }
    });
};

/**
 * 재귀함수로 promise를 호출하는 진입 함수
 * @param {Promise 배열}} _promises
 */
comm.orderedPromise = function (_promises) {
  if (_promises.length <= 0) return false;
  comm.recursivePromise(_promises, 0);
};

comm.getComboItems = function (_codeGroupCd, _isSearch) {
  return new Promise((_resolve, _reject) => {
    window.getApp.$http.url = window.getApp.$format(
      selectConfig.codeMaster.getSelect.url,
      _codeGroupCd
    );
    window.getApp.$http.type = 'GET';
    window.getApp.$http.request(
      (_result) => {
        let codes = _result.data;
        let name = '';
        if (_isSearch === true) {
          name = this.getLangSpecInfoLabel('L0000002519'); // '전체';
          codes.splice(0, 0, { code: null, codeNm: name });
        } else if (_isSearch === false) {
          name = this.getLangSpecInfoLabel('L0000003394'); // '선택하세요';
          codes.splice(0, 0, { code: null, codeNm: name });
        } else {
          // '전체' 또는 '선택하세요'를 넣지 않음
        }
        _resolve(codes);
      },
      (_error) => {
        window.getApp.$emit('APP_REQUEST_ERROR', _error);
        _reject(_error);
      }
    );
  });
};

/**
 * 10진수 to 16진수
 * @param {16진수} _hex
 */
comm.hexToDecimal = function (_hex) {
  return parseInt(_hex, 16);
};

/**
 * 16진수 to 10진수
 * @param {10진수} _decimal
 */
comm.decimalToHex = function (_decimal) {
  return _decimal.toString(16);
};

comm.getTextColorByBackgroundColor = function (_backgroundColor) {
  if (!_backgroundColor || _backgroundColor.length < 6) return;
  let backgroundColor = _backgroundColor;
  _backgroundColor =
    _backgroundColor.indexOf('#') === 0
      ? _backgroundColor.split.join('')
      : _backgroundColor;

  let rgb = new Array(3);

  if (_backgroundColor.indexOf('rgb(') >= 0) rgb = comm.getRgbArray(_backgroundColor);
  else {
    rgb.push(_backgroundColor.substr(0, 2));
    rgb.push(_backgroundColor.substr(2, 2));
    rgb.push(_backgroundColor.substr(4, 2));
  }

  let baseValue = Math.round(
    (parseInt(rgb[0], 10) * 299 +
      parseInt(rgb[1], 10) * 587 +
      parseInt(rgb[2], 10) * 114) /
      1000
  );
  return baseValue > 125 ? '#212529' : '#FCFCFC';
};

comm.getRgbArray = function (_backgroundColor) {
  return _backgroundColor.replace(/[^\d,]/g, '').split(',');
};

comm.getLang = function () {
  return Cookies.get('language') || 'kr';
};

comm.getLangSpecInfoLabel = function (code, formatVals) {
  let returnText = '';
  if ($store.getters.langInfo.label) {
    returnText = $store.getters.langInfo.label[code];

    if (returnText && formatVals) {
      returnText = $format(returnText, formatVals);
    }
  }
  return returnText ? returnText : code;
};

comm.getLangSpecInfoMessage = function (code, formatVals) {
  // 라벨, 메시지 병합
  return comm.getLangSpecInfoLabel(code, formatVals);
  // let returnText = '';
  // if ($store.getters.langInfo.message) {
  //   returnText = $store.getters.langInfo.message[code];

  //   if (returnText && formatVals) {
  //     returnText = $format(returnText, formatVals);
  //   }
  // }
  // return returnText ? returnText : code;
};

comm.reqHttp = function (type, url, param, sucess, error) {
  window.getApp.$http.url = url;
  window.getApp.$http.type = type;
  window.getApp.$http.param = param;
  window.getApp.$http.request(
    (_result) => {
      sucess(_result);
    },
    (_error) => {
      if (error) {
        error(_error);
      } else {
        window.getApp.$emit('APP_REQUEST_ERROR', _error);
      }
    }
  );
};

comm.alertSucess = function (message) {
  window.getApp.$emit('ALERT', {
    title: 'L0000003395', // 안내
    message: message,
    type: 'sucess',
  });
};

comm.alertWarning = function (message) {
  window.getApp.$emit('ALERT', {
    title: 'L0000003395', // 안내
    message: message,
    type: 'warning',
  });
};

comm.alertConfirm = function (message, confirmCallback, cancelCallback) {
  cancelCallback = cancelCallback ? cancelCallback : () => {};
  window.getApp.$emit('CONFIRM', {
    title: 'L0000003321', // 확인
    message: message,
    type: 'info',
    confirmCallback: confirmCallback,
    cancelCallback: cancelCallback,
  });
};

// 권한 보유여부 체크
comm.chkAuthGrp = function (authGrpNo) {
  let isAuthGrp = false;
  let userAuthGrps = $store.getters.userAuthGrps.filter(auth => auth.settingYn === 'Y');

  let authLen = userAuthGrps.filter(auth => String(auth.authGrpNo) === authGrpNo).length;
  isAuthGrp = authLen ? true : false;

  return isAuthGrp;
}

// 전사 담당자 여부
comm.isCompanyGrp = function () {
  let isCompanyGrp = false;    
  if ($store.getters.deptAuthGrp && $store.getters.deptAuthGrp.plantAccessYn === 'Y')
  {
    isCompanyGrp = true;
  }

  return isCompanyGrp;
}

// 사업장 담당자 여부
comm.isPlantGrp = function () {
  let isPlantGrp = false;
  if ($store.getters.deptAuthGrp && $store.getters.deptAuthGrp.deptAccessYn === 'Y')
  {
    isPlantGrp = true;
  }

  return isPlantGrp;
}

/**
 * 부서 tree에서 특정 부서찾기
 * @param {*} searchDeptCd 비교할 부서트리 정보
 * @param {*} _deptCd 부서코드
 */
comm.findDeptToTree = function (searchDept, _deptCd) {
  if (searchDept.deptCd === _deptCd) {
    return searchDept;
  } else if (searchDept.children && searchDept.children.length > 0) {
    let result = null;
    for (let i = 0; !result && i < searchDept.children.length; i++) {
      result = this.findDeptToTree(searchDept.children[i], _deptCd);
    }
    return result;
  }

  return null;
};

/**
 * 부서 tree에서 특정 부서 tree 찾기
 * @param {*} _deptCd 부서코드
 */
comm.searchDept = function (_deptCd) {
  if (!$store.getters.allDept || !$store.getters.allDept.length) return null;

  let result = null;

  let allDept = $store.getters.allDept;
  let length = $store.getters.allDept.length;

  for (let i = 0; !result && i < length; i++) {
    result = comm.findDeptToTree(allDept[i], _deptCd);
  }

  return result;
};

/**
 * 부서 tree에서 하위부서 여부 찾기
 * @param {*} subDept 비교할 부서트리 정보
 * @param {*} _deptCd 하위부서코드
 */
comm.searchSubDept = function (subDept, _deptCd) {
  if (Array.isArray(subDept)) {
    if (!subDept || !subDept.length) return null;

    let result = null;

    let allDept = subDept;
    let length = subDept.length;

    for (let i = 0; !result && i < length; i++) {
      result = comm.findDeptToTree(allDept[i], _deptCd);
    }

    return result;
  } else if (typeof subDept === 'object') {
    if (!subDept) return null;

    let result = null;

    result = comm.findDeptToTree(subDept, _deptCd);

    return result;
  } else {
    return null;
  }
};

comm.isStrEmpty = _str => {
  if (_str === null || _str === undefined || _str === '') {
    return true;
  } else {
    // if (_str.trim() === '') {
    //   return true;
    // }
    return false;
  }
};
comm.replaceChar = _dataArray => {
  const newJson = _dataArray.map(rec => {
    const newData = {
      ...rec,
    };
    let val = '';
    for (const key in newData) {
      if (newData[key] !== null && newData[key] !== '' && typeof newData[key] === 'string') {
        val = newData[key].trim();
        if (val === '-') {
          val = ' -';
        }
        newData[key] = val;
        // else {
        //  newData[key] = newData[key].replace(/-/gi, "&#64;");
        // }
      }
    }
    return newData;
  });
  return newJson;
};

export default comm;
