<!--
  목적 : 환경 > 대기 > 기준정보 > 검사항목 > 상세
  작성자 : jkl
  Detail : 대기 검사항목 관리
  *
  examples:
  *
  -->

<template>
  <b-container fluid>
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 검사항목 정보 -->
            <y-label
              label="L0000003585"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="testItem"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="testItem.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 검사항목명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000325"
                name="eairTestItemNm"
                v-model="testItem.eairTestItemNm"
                v-validate="'required'"
                :state="validateState('eairTestItemNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 단위 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="envUnitCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="envUnitCd"
                label="L0000000870"
                v-model="testItem.envUnitCd"
                v-validate="'required'"
                :state="validateState('envUnitCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- SEMS 코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000161"
                name="semsCd"
                v-model="testItem.semsCd"
              />
            </b-col>
            <b-col
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-8"
              style="margin-bottom: 15px"
            >
              <!-- 대기총량제 사용여부 -->
              <y-switch
                :width="10"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000004836"
                name="airtotTargetYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="testItem.airtotTargetYn"
              />
              <!-- L0000001440: 사용 -->
              <!-- L0000001063: 미사용 -->
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="200"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="testItem.remark"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
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
                v-model="testItem.useYn"
              />
              <!-- L0000001440: 사용 -->
              <!-- L0000001063: 미사용 -->
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
  name: 'air-test-item-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        eairTestItemCd: null,
      },
    },
  },
  data() {
    return {
      testItem: {
        eairTestItemCd: null,
        eairTestItemNm: null,
        plantCd: null,
        envUnitCd: null,
        semsCd: null,
        remark: null,
        sortOrder: 0,
        useYn: 'Y',
        createUserId: null,
        updateUserId: null,
        airtotTargetYn: 'Y',
      },
      editable: false,
      isSave: false,
      actionType: 'POST',
      saveUrl: '',
      detailUrl: '',
      checkUrl: '',

      envUnitCdItems: [],
    };
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // 단위
      this.$comm.getComboItems('ENV_UNIT', false).then((_result) => {
        this.envUnitCdItems = _result;
      });

      this.detailUrl = selectConfig.env.air.baseInfo.testItem.get.url;
      this.checkUrl = selectConfig.env.air.baseInfo.testItem.check.url;
      this.saveUrl = transactionConfig.env.air.baseInfo.testItem.insert.url;

      if (this.popupParam.eairTestItemCd) {
        this.testItem.eairTestItemCd = this.popupParam.eairTestItemCd;
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.testItem.eairTestItemCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.testItem = _result.data;
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
    beforeSave() {
      let flag = '';
      if (this.testItem.eairTestItemCd) {
        // 수정
        flag = 'update';
        this.actionType = 'PUT';
        this.saveUrl = transactionConfig.env.air.baseInfo.testItem.edit.url;
      } else {
        // 신규등록
        flag = 'insert';
        this.actionType = 'POST';
        this.saveUrl = transactionConfig.env.air.baseInfo.testItem.insert.url;
      }
      this.check(flag);
    },
    check(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              eairTestItemCd:
                flag === 'insert' ? null : this.testItem.eairTestItemCd,
              eairTestItemNm: this.testItem.eairTestItemNm,
              plantCd: this.testItem.plantCd,
            };
            this.$http.request(
              (_result) => {
                if (_result.data > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000303', // '이미 같은 이름의 검사항목명이 있습니다.',
                    type: 'warning',
                  });
                  return;
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      if (flag === 'insert') {
                        this.testItem.createUserId = this.$store.getters.token;
                      } else {
                        this.testItem.updateUserId = this.$store.getters.token;
                      }
                      this.isSave = true;
                    },
                    cancelCallback: () => {},
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else if (!_result) {
            this.isSave = false;
            this.$popupRequired.check(
              'envTestItemDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          this.isSave = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    btnSaveClickedCallback(_result) {
      this.isSave = false;
      this.testItem.eairTestItemCd = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
