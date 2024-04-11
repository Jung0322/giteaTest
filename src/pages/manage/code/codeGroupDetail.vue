<!--
  목적 : 시스템관리-공용코드-코드그룹
  작성자 : SB
  Detail : 코드그룹 상세/수정/등록
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
            <!-- 코드그룹 등록 -->
            <y-label
              label="L0000004543"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && !createMode && updateMode"
                :action-url="editUrl"
                :param="codeGroup"
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
                :param="codeGroup"
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
              <!-- 코드도메인 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :disabled="!createMode"
                :comboItems="detailCodeDomainCdItems"
                itemText="codeDomainNm"
                itemValue="codeDomainCd"
                ui="bootstrap"
                name="codeGroupCd"
                label="L0000002976"
                v-model="codeGroup.codeDomainCd"
                v-validate="'required'"
                :state="validateState('codeDomainCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 코드그룹코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="25"
                :disabled="!createMode"
                ui="bootstrap"
                label="L0000002974"
                name="codeGroupCd"
                v-model="codeGroup.codeGroupCd"
                v-validate="'required'"
                :state="validateState('codeGroupCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 코드그룹명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002973"
                name="codeGroupNm"
                v-model="codeGroup.codeGroupNm"
                v-validate="'required'"
                :state="validateState('codeGroupNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 코드길이 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="false"
                ui="bootstrap"
                label="L0000002975"
                name="codeLength"
                v-model="codeGroup.codeLength"
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
                v-model="codeGroup.remarks"
                :rows="2"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 시스템용여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001769"
                name="forSystemYn"
                selectText="L0000003213"
                unselectText="L0000001065"
                v-model="codeGroup.forSystemYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 설정가능여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001621"
                name="settableYn"
                selectText="L0000003213"
                unselectText="L0000001065"
                v-model="codeGroup.settableYn"
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
                v-model="codeGroup.useYn"
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
  name: 'y-code-group-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        codeGroupCd: '',
        code: 0,
      },
    },
  },
  data() {
    return {
      codeGroup: {
        codeDomainCd: null,
        codeGroupCd: '',
        codeGroupNm: '',
        remarks: '',
        codeLength: null,
        forSystemYn: 'N',
        settableYn: 'Y',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      searchParam: {
        codeDomainCd: '',
        codeGroupNm: '',
      },
      searchArea: {
        title: 'L0000000329', // 검색박스숨기기
        show: true,
      },
      gridOptions: {
        header: [],
        data: [],
        height: '250',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      createMode: true,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      totalCodeList: [],
      searchCodeDomainCdItems: [],
      detailCodeDomainCdItems: [],

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
      // 선택항목 설정
      setTimeout(() => {
        this.getCodeGroupCdItems();
      }, 200);

      this.insertUrl = transactionConfig.manage.codeGroup.insert.url;
      this.editUrl = transactionConfig.manage.codeGroup.edit.url;
      this.searchUrl = selectConfig.codeGroup.list.url;
      this.detailUrl = selectConfig.codeGroup.get.url;

      this.editable = this.$route.meta.editable;

      this.getTotalCodeList();
      if (this.popupParam.codeGroupCd !== '' || this.popupParam.code !== 0) {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.popupParam.codeGroupCd,
        this.popupParam.code,
        'Y'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.createMode = false;
          this.updateMode = true;
          this.codeGroup = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
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
                this.codeGroup.updateUserId = this.$store.getters.token;
                this.isUpdateSubmit = true;
              },
            });
          } else {
            this.$popupRequired.check(
              'codeGroupDetail',
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
    getCodeGroupCdItems() {
      this.$http.url = selectConfig.codeDomain.list.url;
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          var searchItems = this.$_.clone(_result.data);
          var detailItems = this.$_.clone(_result.data);
          searchItems.splice(0, 0, {
            codeDomainCd: null,
            codeDomainNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          detailItems.splice(0, 0, {
            codeDomainCd: null,
            codeDomainNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });

          this.searchCodeDomainCdItems = searchItems;
          this.detailCodeDomainCdItems = detailItems;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
    beforeCreateSubmit() {
      var test = {
        codeDomainCd: this.codeGroup.codeDomainCd,
        codeGroupCd: this.codeGroup.codeGroupCd,
      };
      if (this.$_.find(this.totalCodeList, test) != null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000536', // 이미 같은 이름의 코드그룹이 존재합니다.
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
                this.codeGroup.createUserId = this.$store.getters.token;
                this.isCreateSubmit = true;
              },
            });
          } else {
            this.$popupRequired.check(
              'codeGroupDetail',
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
        'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
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
  },
};
</script>
