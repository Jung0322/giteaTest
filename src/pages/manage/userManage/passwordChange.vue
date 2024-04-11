<!--
  목적 : 비밀번호 변경 컴포넌트
  작성자 : sch
  Detail :
  *
  examples:
  *
  -->
<template>
  <div id>
    <b-container fluid>
      <b-row>
        <!-- TODO : 아래에 본문을 넣으세요 -->
        <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
          <!-- 비밀번호 -->
          <y-text
            :width="8"
            :editable="editable"
            :required="true"
            ui="bootstrap"
            :maxlength="100"
            label="L0000004173"
            name="userPwd"
            type="password"
            v-model="user.userPwd"
            v-validate="'required'"
            :state="validateState('userPwd')"
          ></y-text>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
          <!-- 비밀번호 확인 -->
          <y-text
            :width="8"
            :editable="editable"
            :required="true"
            ui="bootstrap"
            :maxlength="100"
            label="L0000001364"
            name="userPwdRepeat"
            type="password"
            v-model="user.userPwdRepeat"
            v-validate="'required'"
            :state="validateState('userPwdRepeat')"
          ></y-text>
        </b-col>
      </b-row>

      <b-row>
        <b-col sm="12">
          <div class="float-right">
            <!-- 저장 -->
            <y-btn
              v-if="editable"
              title="L0000002474"
              color="orange"
              @btnClicked="passwordChanged"
            />
            <!-- 닫기 -->
            <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'password-change',
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
        userPwd: '',
        userPwdSHA: '',
        userPwdRepeat: '',
      },
      editable: false,
      isSubmit: false, // 버튼을 submit 할 것인지 판단하는 변수로써 버튼의 개수만큼 필요합니다.
    };
  },
  // watch: {
  //   isPopupOpen () {
  //     // 팝업이 활성화 되면 값 초기화
  //     if (this.isPopupOpen) {
  //       Object.assign(this.$data, this.$options.data());
  //       this.init();
  //     }
  //   }
  // },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
    },
    /** /초기화 관련 함수 **/

    /** Call API service **/
    passwordChanged() {
      if (this.user.userPwd !== this.user.userPwdRepeat) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000560', // 비밀번호와 비밀번호 확인은 동일해야 합니다.
          type: 'warning',
        });
        // window.getApp.$emit('APP_REQUEST_ERROR', '비밀번호와 비밀번호 확인은 동일해야 합니다.');
        return;
      } else if (!this.user.userPwd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000550', // 비밀번호를 반드시 입력하세요
          type: 'warning',
        });
        // window.getApp.$emit('APP_REQUEST_ERROR', '비밀번호를 반드시 입력하세요.');
        return;
      }

      this.user.userId = this.popupParam.userId;
      this.$http.url = transactionConfig.user.password.url;
      this.$http.param = this.user;
      this.$http.type = 'PUT';
      this.$http.request(
        (_result) => {
          if (_result) {
            window.getApp.$emit(
              'APP_REQUEST_SUCCESS',
              'M0000000551' // 비밀번호가 변경되었습니다.
            );
            this.closePopup('CLOSE');
          } else {
            window.getApp.$emit(
              'APP_REQUEST_ERROR',
              'M0000000552' // 비밀번호 변경처리가 되지 않았습니다. 관리자에게 문의바랍니다.
            );
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /Call API service **/

    /** validation checking **/
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    /** /validation checking **/

    /** Component Events, Callbacks (버튼 제외) **/
    getPassword() {
      return this.user;
    },
    /** /Component, Callbacks (버튼 제외) **/

    /** Button Event **/
    closePopup(data) {
      this.$emit('closePopup', data);
    },
    /** /Button Event **/

    /** 기타 function **/
    /** /기타 function **/
  },
};
</script>
