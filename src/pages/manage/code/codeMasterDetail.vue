<!--
  목적 : 시스템관리-공용코드-코드마스터
  작성자 : SB
  Detail : 코드마스터 관리
  *
  examples: 코드마스터 관리 상세/수정/등록
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 코드마스터 등록 -->
            <y-label
              label="L0000004545"
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
                name="codeDomainCd"
                label="L0000002976"
                v-model="codeMaster.codeDomainCd"
                v-validate="'required'"
                :state="validateState('codeDomainCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 코드그룹 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :disabled="!createMode"
                :comboItems="detailCodeGroupCdItems"
                itemText="codeGroupNm"
                itemValue="codeGroupCd"
                ui="bootstrap"
                name="codeGroupCd"
                label="L0000002970"
                v-model="codeMaster.codeGroupCd"
                v-validate="'required'"
                :state="validateState('codeGroupCd')"
              ></y-select>
            </b-col>
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
              <!-- 코드명(KOR) -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000004544"
                name="codeNm"
                v-model="codeMaster.codeNm"
                v-validate="'required'"
                :state="validateState('codeNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 코드명(ENG) -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000004546"
                name="codeNmEn"
                v-model="codeMaster.codeNmEn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 코드명(JPN) -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000004547"
                name="codeNmJa"
                v-model="codeMaster.codeNmJa"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 중국어(간체) -->
              <!-- 코드명(CHS) -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000004548"
                name="codeNmZhCn"
                v-model="codeMaster.codeNmZhCn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 중국어(번체) -->
              <!-- 코드명(CHT) -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000004549"
                name="codeNmZhTw"
                v-model="codeMaster.codeNmZhTw"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 약어 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000001914"
                name="codeAbbr"
                v-model="codeMaster.codeAbbr"
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
            <b-col sm="12" class="mb-2">
              <el-tag size="medium" type="info" class="float-right">
                <i class="el-icon-info"></i>
                <y-label
                  label="KOR = 한국어, ENG = 영어, JPN = 일본어, CHS = 중국어(간체), CHT = 중국어(번체)입니다."
                />
                <!-- <i class="el-icon-info"></i> KOR = 한국어, ENG = 영어, JPN =
                일본어, CHS = 중국어(간체), CHT = 중국어(번체)입니다. -->
              </el-tag>
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
                v-model="codeMaster.remarks"
                :rows="2"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 추가속성1 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002895"
                name="attr1"
                v-model="codeMaster.attr1"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 추가속성2 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002896"
                name="attr2"
                v-model="codeMaster.attr2"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 추가속성3 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002897"
                name="attr3"
                v-model="codeMaster.attr3"
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
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-code-master-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        codeGroupCd: '',
        code: '',
      },
    },
  },
  data() {
    return {
      codeMaster: {
        codeDomainCd: null,
        codeDomainNm: '',
        codeGroupCd: null,
        codeGroupNm: '',
        code: '',

        // 다국어 추가
        codeNm: '',
        codeNmEn: '',
        codeNmJa: '',
        codeNmZhCn: '',
        codeNmZhTw: '',

        remarks: '',
        sortOrder: null,
        useYn: 'Y',
        attr1: '',
        attr2: '',
        attr3: '',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
      },
      codeGroup: {
        codeGroupCd: '',
        codeLength: 5,
      },

      editable: false,
      createMode: true,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      totalCodeList: [],
      detailCodeGroupCdItems: [],
      detailCodeDomainCdItems: [],
      insertUrl: '',
      editUrl: '',
      searchUrl: '',
      detailUrl: '',
    };
  },
  watch: {
    'codeMaster.codeGroupCd': function (newValue, oldValue) {
      this.getCodeGroup();
    },
    'codeMaster.codeDomainCd': function (newValue, oldValue) {
      this.getCodeGroupCdItems();
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

      this.getCodeDomainCdItems();
      this.getCodeGroupCdItems();
      this.getTotalCodeList();

      if (this.popupParam.codeGroup !== '' && this.popupParam.code !== '') {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.popupParam.codeGroupCd,
        this.popupParam.code
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.createMode = false;
          this.updateMode = true;
          this.codeMaster = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' //  오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    getCodeDomainCdItems() {
      this.$http.url = selectConfig.codeDomain.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.detailCodeDomainCdItems = this.$_.clone(_result.data);
          this.detailCodeDomainCdItems.splice(0, 0, {
            codeDomainCd: null,
            codeDomainNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    getCodeGroupCdItems() {
      this.$http.url = selectConfig.codeGroup.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        codeDomainCd: this.codeMaster.codeDomainCd,
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.detailCodeGroupCdItems = this.$_.clone(_result.data);
          this.detailCodeGroupCdItems.splice(0, 0, {
            codeGroupCd: null,
            codeGroupNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
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
    getCodeGroup() {
      if (this.codeMaster.codeGroupCd !== '') {
        this.$http.url = this.$format(
          selectConfig.codeGroup.get.url,
          this.codeMaster.codeGroupCd
        );
        this.$http.type = 'get';
        this.$http.request(
          (_result) => {
            this.codeGroup = _result.data;
            if (this.codeGroup.codeLength < this.codeMaster.code.length) {
              this.codeMaster.code = this.codeMaster.code.substring(
                0,
                this.codeGroup.codeLength
              );
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
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
          } else {
            this.$popupRequired.check(
              'codeMasterDetail',
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
          } else {
            this.$popupRequired.check(
              'codeMasterDetail',
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
  },
};
</script>
