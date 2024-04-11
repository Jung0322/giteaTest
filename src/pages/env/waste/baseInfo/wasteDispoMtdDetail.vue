<!--
  목적 : 폐기물 기준정보 > 폐기물분류
  작성자 :  psb
  Detail : 폐기물분류
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row class="mt-3" ref="insertBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 폐기물 상세 -->
            <y-label
              label="L0000003107"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 신규등록 -->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="wasteDispoMtd"
                :is-submit="isCreateSubmit"
                title="L0000001789"
                color="orange"
                action-type="post"
                beforeSubmit="beforeCreateSubmit"
                @beforeCreateSubmit="beforeCreateSubmit"
                @btnClicked="btnCreateClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="wasteDispoMtd"
                :is-submit="isUpdateSubmit"
                title="L0000002474"
                color="orange"
                action-type="put"
                beforeSubmit="beforeUpdateSubmit"
                @beforeUpdateSubmit="beforeUpdateSubmit"
                @btnClicked="btnUpdateClickedCallback"
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
              <!-- 처리방법코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :disabled="updateMode"
                :maxlength="4"
                ui="bootstrap"
                label="L0000002828"
                name="ewstDispoMtdCd"
                v-model="wasteDispoMtd.ewstDispoMtdCd"
                v-validate="'required'"
                :state="validateState('ewstDispoMtdCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리방법 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002825"
                name="ewstDispoMtdNm"
                v-model="wasteDispoMtd.ewstDispoMtdNm"
                v-validate="'required'"
                :state="validateState('ewstDispoMtdNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리분류 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="ewstDispoClassCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="ewstDispoClassCd"
                label="L0000002829"
                v-model="wasteDispoMtd.ewstDispoClassCd"
                v-validate="'required'"
                :state="validateState('ewstDispoClassCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
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
                v-model="wasteDispoMtd.useYn"
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
  /* attributes: name, components, props, data */
  name: 'ingredient-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ewstDispoMtdCd: null,
      },
    },
  },
  data() {
    return {
      wasteDispoMtd: {
        ewstDispoMtdCd: null,
        ewstDispoMtdNm: '',
        ewstDispoClassCd: null,
        ewstDispoClassNm: '',
        sortOrder: null,
        useYn: 'Y',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
      },

      editable: true,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      ewstDispoClassCdItems: [],
      insertUrl: '',
      editUrl: '',
      etailUrl: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // 처리분류
      this.$comm.getComboItems('EWST_DISPO_CLASS', false).then((_result) => {
        this.ewstDispoClassCdItems = _result;
      });

      this.insertUrl =
        transactionConfig.env.waste.baseInfo.wasteDisposalMethod.insert.url;
      this.editUrl =
        transactionConfig.env.waste.baseInfo.wasteDisposalMethod.edit.url;
      this.detailUrl = selectConfig.env.waste.baseInfo.wasteClass.get.url;
      this.detailUrl =
        selectConfig.env.waste.baseInfo.wasteDisposalMethod.get.url;

      if (this.popupParam.ewstDispoMtdCd) {
        this.wasteDispoMtd.ewstDispoMtdCd = this.popupParam.ewstDispoMtdCd;
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.wasteDispoMtd.ewstDispoMtdCd
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.wasteDispoMtd = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeCreateSubmit() {
      this.checkDuplicate();
    },
    beforeUpdateSubmit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.wasteDispoMtd.updateUserId = this.$store.getters.token;
                this.isUpdateSubmit = true;
              },
              cancelCallback: () => {},
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'wasteDispoMtdDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    checkDuplicate() {
      this.$http.url = this.$format(
        selectConfig.env.waste.baseInfo.wasteDisposalMethod.dupleCheck.url,
        this.wasteDispoMtd.ewstDispoMtdCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data > 0) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000372', // '이미 같은 처리방법 코드가 존재합니다.',
              type: 'warning',
            });
          } else {
            this.updateMode = false;
            this.$validator
              .validateAll()
              .then((_result) => {
                if (_result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.wasteDispoMtd.createUserId =
                        this.$store.getters.token;
                      this.isCreateSubmit = true;
                    },
                    cancelCallback: () => {},
                  });
                } else if (!_result) {
                  this.$popupRequired.check(
                    'wasteDispoMtdDetail',
                    this.$data,
                    this.errors
                  );
                }
              })
              .catch(() => {
                window.getApp.$emit(
                  'APP_VALID_ERROR',
                  'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
                );
              });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.updateMode = true;
      this.getDetail();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      this.getDetail();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
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
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
