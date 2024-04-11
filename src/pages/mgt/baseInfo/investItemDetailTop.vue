<!--
  목적 : 경영>기준정보>투자항목관리(대분류)
  Detail : 대분류 등록/수정 화면
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row ref="editBox">
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 코드 -->
            <y-text
              :width="8"
              :editable="editable"
              :required="true"
              :disabled="updateMode"
              :maxlength="codeGroup.codeLength"
              ui="bootstrap"
              label="L0000002969"
              name="code"
              v-model="codeMaster.code"
              v-validate="'required'"
              :state="validateState('code')"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 투자분류 -->
            <y-text
              :width="8"
              :editable="editable"
              :required="true"
              :maxlength="30"
              ui="bootstrap"
              label="L0000004226"
              name="codeNm"
              v-model="codeMaster.codeNm"
              v-validate="'required'"
              :state="validateState('codeNm')"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 사용여부 -->
            <y-switch
              :width="8"
              :editable="editable"
              true-value="Y"
              false-value="N"
              ui="bootstrap"
              label="L0000001439"
              name="useYn"
              selectText="L0000001440"
              unselectText="L0000001063"
              v-model="codeMaster.useYn"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 정렬순서 -->
            <y-number
              :width="8"
              :editable="editable"
              :maxlength="5"
              :hasSeperator="false"
              :isPositive="true"
              ui="bootstrap"
              label="L0000002601"
              name="sortOrder"
              v-model="codeMaster.sortOrder"
            />
          </b-col>
        </b-row>
        <b-col>
          <div class="float-right mt-3">
            <!-- 저장 -->
            <y-btn
              v-if="editable && createMode"
              :action-url="insertUrl"
              :param="codeMaster"
              :is-submit="isCreateSubmit"
              title="L0000002474"
              color="orange"
              action-type="post"
              beforeSubmit="beforeCreateSubmit"
              @beforeCreateSubmit="beforeCreateSubmit"
              @btnClicked="btnCreateClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <!-- 저장(update) -->
            <y-btn
              v-if="editable && updateMode"
              :action-url="editUrl"
              :param="codeMaster"
              :is-submit="isUpdateSubmit"
              title="L0000002474"
              color="orange"
              action-type="put"
              beforeSubmit="beforeUpdateSubmit"
              @beforeUpdateSubmit="beforeUpdateSubmit"
              @btnClicked="btnUpdateClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-code-master-detail',
  props: {
    code: '',
  },
  data() {
    return {
      codeMaster: {
        codeGroupCd: 'MICS3',
        code: '',
        codeNm: '',
        sortOrder: 0,
        useYn: 'Y',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
      },
      codeGroup: {
        codeLength: 5,
      },
      searchParam: {
        codeDomainCd: '',
        codeGroupCd: '',
        codeNm: '',
        // forSystemYn: 'Y',
      },

      editable: false,
      createMode: true,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      totalCodeList: [],
      searchCodeGroupCdItems: [],
      detailCodeGroupCdItems: [],
      searchCodeDomainCdItems: [],

      insertUrl: '',
      editUrl: '',
      searchUrl: '',
      detailUrl: '',
      saveBtnShow: false,
      checkVal: false,
    };
  },
  watch: {
    'codeMaster.code': function (newValue, oldValue) {
      this.checkNextVal();
    },
    'codeMaster.codeNm': function (newValue, oldValue) {
      this.checkNextVal();
    },
    'codeMaster.sortOrder': function (newValue, oldValue) {
      this.checkNextVal();
    },
    code: function (newValue, oldValue) {
      this.getDetail();
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {
      this.insertUrl = transactionConfig.manage.codeMaster.insert.url;
      this.editUrl = transactionConfig.manage.codeMaster.edit.url;
      this.searchUrl = selectConfig.codeMaster.allList.url;
      this.detailUrl = selectConfig.codeMaster.get.url;

      this.editable = this.$route.meta.editable;

      this.getTotalCodeList();

      this.getDetail();
    },
    getDetail() {
      if (!this.code) return;
      this.$http.url = this.$format(
        this.detailUrl,
        this.codeMaster.codeGroupCd,
        this.code
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.createMode = false;
          this.updateMode = true;
          this.codeMaster = _result.data;
          this.popupOptions = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    checkNextVal() {
      if (
        this.codeMaster.code !== '' &&
        this.codeMaster.codeNm !== '' &&
        this.codeMaster.sortOrder !== 0
      ) {
        this.checkVal = true;
      }
    },
    beforeUpdateSubmit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.codeMaster.updateUserId = this.$store.getters.token;
                this.isUpdateSubmit = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // 유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        });
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.createMode = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.$emit('code', { code: this.codeMaster.code });
    },
    getTotalCodeList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.totalCodeList = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeCreateSubmit() {
      var test = {
        codeGroupCd: this.codeMaster.codeGroupCd,
        code: this.codeMaster.code,
      };
      if (this.$_.find(this.totalCodeList, test) != null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001027', // 이미 같은 이름의 코드가 존재합니다.
          type: 'warning',
        });
        return;
      }

      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.codeMaster.createUserId = this.$store.getters.token;
                this.isCreateSubmit = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // 유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
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
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
  },
};
</script>
