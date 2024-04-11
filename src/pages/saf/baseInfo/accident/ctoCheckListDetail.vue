<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 체크리스트 상세 -->
            <y-label
              label="L0000003435"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
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
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
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
              <!-- 항목명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000003205"
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
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import transactionConfig from '@/js/transactionConfig';
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'cto-check-list-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        code: '',
        pageNm: '',
        noAccUseYn: false,
        chkGrid: null,
      },
    },
  },
  data() {
    return {
      codeMaster: {
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
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.insertUrl = transactionConfig.saf.cto.checkListInsert.url;
      this.editUrl = transactionConfig.saf.cto.checkListEdit.url;
      this.detailUrl = selectConfig.saf.cto.checkListItem.url;
      this.checkUrl = selectConfig.saf.cto.checkListItemCheck.url;

      if (this.popupParam.code) {
        this.getDetail();
      } else {
        this.createMode = true;
      }
    },
    getDetail() {
      this.$http.url = this.$format(this.detailUrl, this.popupParam.code);
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
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    beforeUpdateSubmit() {
      this.checkBeforSubmit('edit');
    },
    beforeCreateSubmit() {
      this.checkBeforSubmit('insert');
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
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
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
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
                      message: 'M0000001589', // 이미 같은 항목이 존재합니다.
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
            if (!this.codeMaster.code) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001119', // 코드를 입력해주세요
                type: 'warning', // success / info / warning / error
              });
              return false;
            }
            if (!this.codeMaster.codeNm) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001084', // 분야를 선택해주세요.
                type: 'warning', // success / info / warning / error
              });
              return false;
            }
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도  에러가 발생하였습니다.
          );
        });
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
