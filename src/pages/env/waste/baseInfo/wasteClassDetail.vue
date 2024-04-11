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
              <!-- 저장 -->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="wasteClass"
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
                :param="wasteClass"
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
              <!-- 폐기물분류코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :disabled="updateMode"
                :maxlength="8"
                ui="bootstrap"
                label="L0000003122"
                name="ewstClassCd"
                v-model="wasteClass.ewstClassCd"
                v-validate="'required'"
                :state="validateState('ewstClassCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 폐기물분류명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000003121"
                name="ewstClassNm"
                v-model="wasteClass.ewstClassNm"
                v-validate="'required'"
                :state="validateState('ewstClassNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 폐기물구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="ewstDivCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="ewstDivCd"
                label="L0000003118"
                v-model="wasteClass.ewstDivCd"
                v-validate="'required'"
                :state="validateState('ewstDivCd')"
              ></y-select>
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
                v-model="wasteClass.useYn"
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
  /* attributes: name, components, props, data */
  name: 'ingredient-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ewstClassCd: null,
      },
    },
  },
  data() {
    return {
      wasteClass: {
        ewstClassCd: null,
        ewstClassNm: '',
        ewstDivCd: null,
        ewstDivNm: '',
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

      ewstDivCdItems: [],
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
      // 폐기물구분
      this.$comm.getComboItems('EWST_DIV', false).then(_result => {
        this.ewstDivCdItems = _result;
      });

      this.insertUrl =
        transactionConfig.env.waste.baseInfo.wasteClass.insert.url;
      this.editUrl = transactionConfig.env.waste.baseInfo.wasteClass.edit.url;
      this.detailUrl = selectConfig.env.waste.baseInfo.wasteClass.get.url;

      if (this.popupParam.ewstClassCd) {
        this.wasteClass.ewstClassCd = this.popupParam.ewstClassCd;
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.wasteClass.ewstClassCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.updateMode = true;
          this.wasteClass = _result.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeCreateSubmit() {
      this.updateMode = false;
      this.checkDuplicate();
    },
    beforeUpdateSubmit() {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.wasteClass.updateUserId = this.$store.getters.token;

                this.isUpdateSubmit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check('wasteClassDetail', this.$data, this.errors);
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
        selectConfig.env.waste.baseInfo.wasteClass.dupleCheck.url,
        this.wasteClass.ewstClassCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          let cnt = _result.data;
          if (cnt > 0) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000371', // '이미 같은 폐기물 분류 코드가 존재합니다.',
              type: 'warning',
            });
          } else {
            this.$validator
              .validateAll()
              .then(_result => {
                if (_result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.wasteClass.createUserId = this.$store.getters.token;
                      this.isCreateSubmit = true;
                    },
                  });
                } else if (!_result) {
                  this.$popupRequired.check('wasteClassDetail', this.$data, this.errors);
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
        _error => {
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

    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
