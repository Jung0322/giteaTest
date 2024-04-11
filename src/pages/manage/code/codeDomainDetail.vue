<!--
  목적 : 시스템관리-공용코드-코드 도메인
  작성자 : SB
  Detail : 코드도메인 관리
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
            <!-- 코드도메인 등록 -->
            <y-label
              label="L0000002977"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && !createMode && updateMode"
                :action-url="editUrl"
                :param="codeDomain"
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
                :param="codeDomain"
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
              <!-- 코드도메인코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="5"
                :disabled="!createMode"
                ui="bootstrap"
                label="L0000002981"
                name="codeDomainCd"
                v-model="codeDomain.codeDomainCd"
                v-validate="'required'"
                :state="validateState('codeDomainCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 코드도메인명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002980"
                name="codeDomainNm"
                v-model="codeDomain.codeDomainNm"
                v-validate="'required'"
                :state="validateState('codeDomainNm')"
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
                v-model="codeDomain.useYn"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="200"
                ui="bootstrap"
                label="L0000001360"
                name="remarks"
                v-model="codeDomain.remarks"
                :rows="2"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-code-domain-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        codeDomainCd: '',
      },
    },
  },
  data() {
    return {
      codeDomain: {
        codeDomainCd: '',
        codeDomainNm: '',
        remarks: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      editable: false,
      createMode: true,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      totalCodeList: [],

      insertUrl: '',
      editUrl: '',
      searchUrl: '',
      detailUrl: '',
    };
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
      this.insertUrl = transactionConfig.manage.codeDomain.insert.url;
      this.editUrl = transactionConfig.manage.codeDomain.edit.url;
      this.searchUrl = selectConfig.codeDomain.list.url;
      this.detailUrl = selectConfig.codeDomain.get.url;

      this.editable = this.$route.meta.editable;

      this.getTotalCodeList(); // 중복검사
      if (this.popupParam.codeDomainCd !== '') {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.popupParam.codeDomainCd
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.createMode = false;
          this.updateMode = true;
          this.codeDomain = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요
          );
        }
      );
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
                this.codeDomain.updateUserId = this.$store.getters.token;
                this.isUpdateSubmit = true;
              },
            });
          } else {
            this.$popupRequired.check(
              'codeDomainDetail',
              this.$data,
              this.errors
            );
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
      this.getTotalCodeList();
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
        'M0000000016' // 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
    },
    beforeCreateSubmit() {
      var testCd = { codeDomainCd: this.codeDomain.codeDomainCd };
      var testNm = { codeDomainNm: this.codeDomain.codeDomainNm };
      if (this.$_.find(this.totalCodeList, testCd) != null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000534', // 이미 같은 코드도메인이 존재합니다.
          type: 'warning',
        });
        return;
      }
      if (this.$_.find(this.totalCodeList, testNm) != null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000535', // 이미 같은 이름의 코드도메인이 존재합니다.
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
                this.codeDomain.createUserId = this.$store.getters.token;
                this.isCreateSubmit = true;
              },
            });
          } else {
            this.$popupRequired.check(
              'codeDomainDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // 유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        });
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
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.createMode = false;
      this.updateMode = true;
      this.getTotalCodeList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
