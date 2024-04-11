import _ from 'lodash';
import Cookies from 'js-cookie'

import $router from '@/router';
import $store from '@/store';

import $comm from '@/js/common';

var commMessage = {
  notify: null,
  exceptionNotify: null,
  alert: null,
  confirm: null,
};

/**
 * function name : notify
 * desc : 오른쪽 상단에 표시되는 알림이며 일정시간이 지날시 사라짐
 * parameters
 *  _option : 
 *    - title : 상단 표시 라벨
 *    - message : 본문 내용
 *    - type : success/warning/info/error
 *    - duration : 표시되는 시간 (단위 ms)
 */
commMessage.notify = function (target, _option) {
  if (!_option) {
    _option = {
      title: 'L0000003396',
      message: $comm.getLangSpecInfoMessage('M0000000016'),
      type: 'error',
    }
  }
  if (process.env.NODE_ENV === 'production') {
    // 운영 서버인 경우에는 
    // [''] ** 현재는 notify를 exception발생하였을 경우에만 사용함으로 이후에 notify를 추가로 사용하는 경우 default문구 생성
    // 라는 문구의 메시지가 뜨도록 설정
    _option.message = $comm.getLangSpecInfoMessage('M0000000016');
  }
  target.$notify({
    title: $comm.getLangSpecInfoLabel(_option.title),
    message: _option.message,
    type: _option.type ? _option.type : 'error',
    duration: _option && _option.hasOwnProperty('duration') ? _option.duration : 3000,
    dangerouslyUseHTMLString: _option.dangerouslyUseHTMLString,
    customClass: _option.customClass ? _option.customClass : '',
  });
};

/**
 * function name : exceptionNotify
 * desc : 오른쪽 상단에 표시되는 알림이며 예외상항에 대해 표시한다.
 *         일정시간이 지날시 사라짐
 *         ##개발모드인 경우에만 사용##
 * parameters
 *  _option : 
 *    - title : 상단 표시 라벨
 *    - message : 본문 내용
 *    - type : success/warning/info/error
 *    - duration : 표시되는 시간 (단위 ms)
 */
commMessage.exceptionNotify = function (target, _option) {
  var type = '';
  var _errMsg = '';
  if (_option && _option.hasOwnProperty('type')) type = _option.type;

  if (_option.message.message === 'Network Error') {
    this.alert(target, {
      title: 'L0000003404', // 네트워크 접속오류
      message:
        'M0000000015', // 네트워크 접속문제로 요청된 정보를 찾을 수 없습니다. 관리자에게 문의해 주시기 바랍니다.',
      type: 'error',
    });
    return;
  }

  _errMsg = '<table class="table table-bordered"><tbody>';
  _errMsg +=
    '<tr><th scope="row">오류코드</th><td>' +
    _option.message.code +
    '</td>';
  _errMsg +=
    '<th scope="row">TimeStamp</th><td>' +
    _option.message.timestamp +
    '</td></tr>';
  _errMsg +=
    '<tr><th scope="row">Message</th><td colspan="3">' +
    _option.message.message +
    '</td></tr>';
  _errMsg +=
    '<tr><th scope="row">Cause</th><td colspan="3">' +
    _option.message.cause +
    '</td></tr>';
  _errMsg +=
    '<tr><th scope="row">CauseDetail</th><td colspan="3">' +
    _option.message.causeDetail +
    '</td></tr>';
  _errMsg +=
    '<tr><th scope="row">Url</th><td colspan="3">' +
    _option.message.url +
    '</td></tr>';
  _errMsg +=
    '<tr><th scope="row">QueryString</th><td colspan="3">' +
    _option.message.queryString +
    '</td></tr>';
  _errMsg +=
    '<tr><th scope="row">반환코드</th><td>' +
    _option.message.returnCode +
    '</td>';
  _errMsg +=
    '<th scope="row">로그번호</th><td>' +
    _option.message.logNo +
    '</td></tr>';
  _errMsg += '</tbody></table>';
  
  this.notify(target, {
    title: _option.title,
    message: _errMsg,
    type: type,
    customClass: 'y-el-notification',
    dangerouslyUseHTMLString: true,
    duration: _option && _option.hasOwnProperty('duration') ? _option.duration : 3000,
  });
};

/**
 * function name : alert
 * desc : 중앙에 표시되는 알림이며 confirm button 클릭 시 사라짐
 * parameters
 *  _option : 
 *    - title : 상단 표시 라벨
 *    - message : 본문 내용
 *    - type : success/warning/info/error
 */
commMessage.alert = function (target, _option) {
  let type = '';
  let title = $comm.getLangSpecInfoLabel(_option.title);
  title = title === _option.title ? '안내' : title; // 코드값에 대한 라벨 값을 못 가져올 시에 '안내'라고 타이틀 표시
  let cofirmButtonText = $comm.getLangSpecInfoLabel('L0000003321');
  let messageTitleWhiteList = [
    'L0000003598', /** [개발자 안내] */
  ];
  if (_option && _option.hasOwnProperty('type')) type = _option.type;

  if (messageTitleWhiteList.indexOf(_option.title) > -1) {
    if (process.env.NODE_ENV === 'production') {
      // 운영 서버인 경우에는 에러 알림창은
      // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      // 라는 문구의 메시지가 뜨도록 설정
      _option.message = $comm.getLangSpecInfoMessage('M0000000016');
    }
  } else {
    _option.message = $comm.getLangSpecInfoMessage(_option.message, _option.format);
  }

  target.$alert(_option.message, title, {
    confirmButtonText: cofirmButtonText !== 'L0000003321' ? cofirmButtonText : '확인', // 확인
    type: type,
    callback: action => {}
  });
};

/**
 * function name : confirm
 * desc : 중앙에 표시되는 확인창
 * parameters
 *  _option : 
 *    - title : 상단 표시 라벨
 *    - message : 본문 내용
 *    - type : success/warning/info/error
 *    - confirmCallback : 확인 시 진행할 function
 *    - cancelCallback : 취소 시 진행할 function
 */
commMessage.confirm = function (target, _option) {
  var type = '';
  if (_option && _option.hasOwnProperty('type')) type = _option.type;
  target.$confirm($comm.getLangSpecInfoMessage(_option.message), $comm.getLangSpecInfoLabel(_option.title), {
    confirmButtonText: $comm.getLangSpecInfoLabel('L0000003321'), // 확인
    cancelButtonText: $comm.getLangSpecInfoLabel('L0000002920'), // 취소
    type: 'info',
  })
    .then(
      typeof _option.confirmCallback === 'function'
        ? _option.confirmCallback
        : null
    )
    .catch(
      typeof _option.cancelCallback === 'function'
        ? _option.cancelCallback
        : null
    );
};

export default commMessage;
