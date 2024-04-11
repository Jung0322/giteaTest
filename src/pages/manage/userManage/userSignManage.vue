<!--
  목적 : 내 서명관리 컴포넌트
  작성자 : dylee
  Detail :
  *
  examples:
  *
  -->
<template>
  <div id>
    <b-container fluid>
      <b-row>
        <b-col v-if="popupParam.userId" sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <y-label label="서명"/>
          <y-signature-pad
            name="signature"
            :editable="editable"
            :width="270"
            :height="160"
            :signData="user.signature"
            @signatureToSvg="signatureToSvg"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'usersign-manage',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        userId: '',
      }),
    },
    // 팝업 컴포넌트 일 경우 팝업 정보가 변경
    // isPopupOpen: {
    //   type: Boolean,
    //   default: false
    // },
  },
  data() {
    return {
      user: {
        userId: '',
        signature: '',
      },
      editable: false,
      isSubmit: false, // 버튼을 submit 할 것인지 판단하는 변수로써 버튼의 개수만큼 필요합니다.
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.user.userId = this.popupParam.userId;
      this.editable = this.$route.meta.editable;
      if (this.popupParam.userId) {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.manage.user.get.url,
        this.popupParam.userId
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.user = _result.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    signatureToSvg(data) {
      if (data) {
        this.$http.url = transactionConfig.user.signatureUpdate.url;
        this.$http.type = 'PUT';
        this.$http.param = {
          userId: this.user.userId,
          signature: data,
        };
        this.$http.request(
          _result => {
            window.getApp.$emit('ALERT', {
              title: '안내',
              message: '서명이 등록되었습니다.',
              type: 'success',
            });
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },

    /** Button Event **/
    closePopup(data) {
      this.$emit('closePopup', data);
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/

    /** 기타 function **/
    /** /기타 function **/
  },
};
</script>