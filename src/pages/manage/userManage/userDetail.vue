<!--
  목적 : 시스템 > 사용자 관리 상세
  작성자 : SB
  Detail : 사용자 관리 상세/등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 사용자 관리 -->
            <y-label
              label="L0000001460"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 비밀번호 변경 -->
              <y-btn
                v-if="user.userId && editable && updateMode"
                title="L0000001363"
                @btnClicked="btnPasswordChangeClickedCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="user"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장(수정) -->
              <y-btn
                v-if="user.userId && editable && updateMode"
                :action-url="editUrl"
                :param="user"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeUpdate"
                @beforeUpdate="beforeUpdate"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <!-- 사업장 -->
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :disabled="false"
                :editable="editable"
                name="plantCd"
                v-model="user.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 부서 -->
              <y-tree-dept
                :width="8"
                :editable="editable"
                :disabled="false"
                :required="true"
                :plant-cd="user.plantCd"
                label="L0000001287"
                name="deptCd"
                v-model="user.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용자ID -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="updateMode"
                :required="true"
                ui="bootstrap"
                :maxlength="15"
                label="L0000001465"
                name="userId"
                v-model="user.userId"
                v-validate="'required'"
                :state="validateState('userId')"
              ></y-text>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용자명 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="false"
                :required="true"
                ui="bootstrap"
                :maxlength="30"
                label="L0000001472"
                name="userNm"
                v-model="user.userNm"
                v-validate="'required'"
                :state="validateState('userNm')"
              ></y-text>
            </b-col>
            <b-col
              v-if="editable && !updateMode"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
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
                user.userPwdSHA="user.userPwd"
              ></y-text>
            </b-col>
            <b-col
              v-if="editable && !updateMode"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
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
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 직위 -->
              <y-select
                :width="8"
                :required="true"
                :disabled="false"
                :comboItems="positionlItems"
                itemText="positionNm"
                itemValue="positionCd"
                ui="bootstrap"
                label="L0000002769"
                name="positionCd"
                v-model="user.positionCd"
                v-validate="'required'"
                :state="validateState('positionCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 직책 -->
              <y-select
                :width="8"
                :comboItems="dutylItems"
                :disabled="false"
                itemText="dutyNm"
                itemValue="dutyCd"
                ui="bootstrap"
                label="L0000002772"
                name="dutyCd"
                v-model="user.dutyCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 성별 -->
              <y-select
                :width="8"
                :required="true"
                :disabled="false"
                :comboItems="sexualItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001632"
                name="comSexTypeCd"
                v-model="user.comSexTypeCd"
                v-validate="'required'"
                :state="validateState('comSexTypeCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 생년월일 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="false"
                :required="true"
                ui="bootstrap"
                label="L0000001545"
                name="birthYmd"
                :default="user.birthYmd"
                v-model="user.birthYmd"
                v-validate="'required'"
                :state="validateState('birthYmd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사내전화 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="false"
                ui="bootstrap"
                :maxlength="20"
                label="L0000001411"
                name="officeTel"
                v-model="user.officeTel"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 휴대전화 -->
              <y-text
                :width="8"
                :editable="editable"
                ui="bootstrap"
                :maxlength="20"
                label="L0000003389"
                name="phoneNo"
                v-model="user.phoneNo"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- Email -->
              <y-text
                :width="8"
                :editable="editable"
                ui="bootstrap"
                :maxlength="50"
                label="L0000004539"
                name="email"
                v-model="user.email"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 입사일 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                label="L0000002293"
                name="entryYmd"
                :default="user.entryYmd"
                v-model="user.entryYmd"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 재직여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                :disabled="false"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000002471"
                name="useYn"
                selectText="L0000002470"
                unselectText="L0000004538"
                v-model="user.useYn"
              ></y-switch>
            </b-col>
            <b-col
              v-show="user.userId && updateMode"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
              <!-- 서명  -->
              <y-label label="L0000001547" />
              <y-signature-pad
                name="signature"
                :editable="editable"
                :width="270"
                :height="160"
                :signData="user.signature"
                @signatureToSvg="signatureToSvg"
              />
            </b-col>
            <!-- <b-col v-else sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
               * 서명은 사용자 저장 후 등록할 수 있습니다. 
              <y-label label="L0000004541" :warning="true" />
            </b-col> -->
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'user-manage', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  props: {
    popupParam: {
      type: Object,
      default: {
        userId: '',
      },
    },
  },
  data() {
    return {
      user: {
        userId: '',
        userPwd: '',

        userPwdSHA: '',
        userPwdRepeat: '',
        userNm: '',
        deptCd: '',
        comSexTypeCd: null,
        birthYmd: '',
        officeTel: '',
        phoneNo: '',
        email: '',
        entryYmd: '',
        positionCd: null,
        dutyCd: null,
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        signature: '',
      },
      orgUser: {},
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      selectedUserId: '',
      searchUrl: '',
      searchPositionUrl: '',
      searchDutyUrl: '',
      countUrl: '',
      searchParam: {
        plantCd: '',
        deptCd: '',
        userNm: '',
        userId: '',
      },
      positionlItems: [],
      dutylItems: [],
      sexualItems: [],
      isInsert: false,
      insertUrl: '',
      isEdit: false,
      editUrl: '',
      editable: false,
      updateMode: false,
      upMenuLvl: null, // 버튼을 submit 할 것인지 판단하는 변수로써 버튼의 개수만큼 필요합니다.
      tempSignature: '', // 신규등록 서명데이터 변수
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestory() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.insertUrl = transactionConfig.user.insert.url;
      this.searchUrl = selectConfig.manage.user.list.url;
      this.searchPositionUrl = selectConfig.manage.position.list.url;
      this.searchDutyUrl = selectConfig.manage.duty.list.url;
      this.countUrl = selectConfig.manage.user.count.url;
      this.editUrl = transactionConfig.user.update.url;

      this.getComboItems('COM_SEX_TYPE');
      this.getPositionList();
      this.getDutyList();
      if (this.popupParam.userId) {
        this.getDetail();
      }
    },
    /** 기타 function **/
    /**
     * 공통 마스터 정보 조회
     */
    getComboItems(codeGroupCd) {
      this.$http.url = selectConfig.codeMaster.allList.url;
      this.$http.param = {
        codeGroupCd: codeGroupCd,
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.sexualItems = this.$_.clone(_result.data);
          this.sexualItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 선택하세요
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.manage.user.get.url,
        this.popupParam.userId
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.user = _result.data;
          this.selectedUserId = this.user.userId;

          this.updateMode = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getPositionList() {
      this.$http.url = this.searchPositionUrl;
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.positionlItems = _result.data;
          this.positionlItems.splice(0, 0, {
            positionCd: null,
            positionNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDutyList() {
      this.$http.url = this.searchDutyUrl;
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.dutylItems = _result.data;
          this.dutylItems.splice(0, 0, {
            dutyCd: null,
            dutyNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeUpdate() {
      if (this.selectedUserId !== this.user.userId) {
        this.isEdit = false;
        window.getApp.$emit('APP_VALID_ERROR', 'ID는 수정할 수 없습니다.');
        return;
      }
      this.user.signature = null;
      this.checkValidation('update');
    },
    /**
     * 등록전 유효성 검사
     */
    beforeInsert() {
      this.checkValidation('insert');
    },
    /** validation checking(필요없으면 지워주세요) **/
    checkValidation(flag) {
      var countUser = 0;

      this.$http.url = this.countUrl;
      this.$http.param = this.user;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          countUser = _result.data;

          if (countUser > 0 && flag === 'insert') {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000553', // 이미 존재하는 ID입니다.
              type: 'warning',
            });
            return;
          }
          if (flag === 'insert') {
            if (!this.user.userPwd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000558', // 비밀번호를 입력해주세요.
                type: 'warning',
              });
              return;
            }
            if (!this.user.userPwdRepeat) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000559', // 비밀번호 확인을 입력해주세요
                type: 'warning',
              });
              return;
            }
          }
          if (this.user.userPwd !== this.user.userPwdRepeat) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000560', // 비밀번호와 비밀번호 확인은 동일해야 합니다
              type: 'warning',
            });
            // window.getApp.$emit('APP_REQUEST_ERROR', '비밀번호와 비밀번호 확인은 동일해야 합니다.');
            return;
          }
          this.$validator
            .validateAll()
            .then((_result) => {
              if (_result) {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321', // 확인
                  message:
                    flag === 'insert'
                      ? 'M0000000105' // 등록하시겠습니까?
                      : 'M0000000060', // 수정하시겠습니까?
                  type: 'info',
                  // 확인 callback 함수
                  confirmCallback: () => {
                    if (flag === 'insert') {
                      this.user.createUserId = this.$store.getters.token;
                      this.user.signature = this.tempSignature;
                      this.isInsert = true;
                    } else {
                      this.user.updateUserId = this.$store.getters.token;
                      this.isEdit = true;
                    }
                  },
                  cancelCallback: () => {
                    this.isInsert = false;
                    this.isEdit = false;
                  },
                });
              } else if (!_result) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000710', // 필수입력값을 입력 후 저장해주세요.
                  type: 'warning',
                });
              }
            })
            .catch(() => {
              if (flag === 'insert') this.isInsert = false;
              else this.isEdit = false;
            });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 저장 버튼 처리용 샘플함수
     */
    btnInsertClickedCallback(_result) {
      this.selectedUserId = _result.data;
      this.user.userId = _result.data;
      this.popupParam.userId = _result.data;
      this.updateMode = true;
      this.isInsert = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      window.getApp.$emit('APP_REQUEST_SUCCESS', '정상적으로 등록되었습니다.');
      // this.getDetail();
    },
    btnSaveClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_SUCCESS', '정상적으로 수정되었습니다.');
    },

    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    // 비밀번호 변경 팝업
    btnPasswordChangeClickedCallback(data) {
      if (!this.user.userId) {
        window.getApp.$emit('APP_REQUEST_ERROR', '사용자를 먼저 선택해주세요.');
        return;
      }
      this.popupOptions.target = () => import(`${'./passwordChange.vue'}`);
      this.popupOptions.title = 'L0000001363'; // 비밀번호 변경
      this.popupOptions.visible = true;
      this.popupOptions.width = '450px';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        userId: this.user.userId,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },

    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isInsert = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    signatureToSvg(data) {
      if (data) {
        this.$http.url = transactionConfig.user.signatureUpdate.url;
        this.$http.type = 'PUT';
        this.$http.param = {
          userId: this.user.userId,
          signature: data,
        };
        this.tempSignature = this.$http.param.signature;
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000561', // 서명이 등록되었습니다.
              type: 'success',
            });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
  },
};
</script>
