<!--
  목적 : 위험성평가 > 기준정보 > 작업 관리 > 상세정보 탭
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 코드 -->
            <y-text
              :width="8"
              :editable="editable"
              :required="true"
              :maxlength="codeGroup.codeLength"
              :disabled="!createMode"
              ui="bootstrap"
              label="L0000002969"
              name="code"
              v-model="codeMaster.code"
              v-validate="'required'"
              :state="validateState('code')"
            />
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 대분류명 -->
            <y-text
              :width="8"
              :editable="editable"
              :required="true"
              :maxlength="30"
              ui="bootstrap"
              label="L0000000915"
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
          <!-- 저장 -->
          <y-btn
            v-if="editable && !createMode && updateMode"
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
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-occurr-form-detail',
  props: {
    code: '',
  },
  data() {
    return {
      codeMaster: {
        codeGroupCd: '',
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
      editable: false,
      createMode: true,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,
      insertUrl: '',
      editUrl: '',
      detailUrl: '',
      checkUrl: '',
    };
  },
  watch: {
    code: function (newValue, oldValue) {
      this.getDetail();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      // URL 셋팅
      this.insertUrl = transactionConfig.saf.accidentOccurrForm.insert.url;
      this.editUrl = transactionConfig.saf.accidentOccurrForm.edit.url;
      this.detailUrl = selectConfig.saf.accidentOccurrForm.get.url;
      this.checkUrl = selectConfig.saf.accidentOccurrForm.check.url;

      this.getDetail();
    },
    getDetail() {
      if (!this.code) return;
      this.$http.url = this.$format(this.detailUrl, this.code);
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.createMode = false;
          this.updateMode = true;
          this.codeMaster = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    checkBeforSubmit(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'get';
            this.$http.param = {
              code: this.codeMaster.code,
              codeNm: this.codeMaster.codeNm,
            };
            this.$http.request(
              (_result) => {
                let result = true;
                if (_result.data && _result.data.length > 0) {
                  if (
                    flag === 'insert' &&
                    this.$_.findIndex(_result.data, { gubun: 'code' }) > -1
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: 'M0000000692', // 이미 같은 코드가 존재합니다.
                      type: 'warning',
                    });
                    result = false;
                  } else if (
                    this.$_.findIndex(_result.data, { gubun: 'name' }) > -1
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: 'M0000000697', // 이미 같은 대분류명이 존재합니다.
                      type: 'warning',
                    });
                    result = false;
                  }
                }
                if (result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // 확인
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.codeMaster.createUserId = this.$store.getters.token;
                      this.codeMaster.updateUserId = this.$store.getters.token;
                      if (flag === 'insert') this.isCreateSubmit = true;
                      else this.isUpdateSubmit = true;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            this.$popupRequired.check(
              'occurrFormAttDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도  에러가 발생하였습니다.
          );
        });
    },
    beforeCreateSubmit() {
      this.checkBeforSubmit('insert');
    },
    beforeUpdateSubmit() {
      this.checkBeforSubmit('edit');
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
    /** /validation checking **/

    /** Button Event **/
    // 초기화
    btnClearClickedCallback() {
      this.createMode = true;
      this.updateMode = false;
      Object.assign(this.$data.codeMaster, this.$options.data().codeMaster);
    },
    btnCreateClickedCallback(_result) {
      this.codeMaster.code = _result.data;
      this.isCreateSubmit = false;
      this.createMode = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.$emit('getDataList');
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.$emit('getDataList');
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/
  },
};
</script>
