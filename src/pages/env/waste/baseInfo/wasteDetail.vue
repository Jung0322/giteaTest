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
              <!-- 신규등록-->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="waste"
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
                :param="waste"
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
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="waste.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 폐기물분류 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="ewstClassCdItems"
                itemText="ewstClassNm"
                itemValue="ewstClassCd"
                ui="bootstrap"
                name="ewstClassCd"
                label="L0000003120"
                v-model="waste.ewstClassCd"
                v-validate="'required'"
                :state="validateState('ewstClassCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 폐기물명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000003119"
                name="ewstWasteNm"
                v-model="waste.ewstWasteNm"
                v-validate="'required'"
                :state="validateState('ewstWasteNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리방법 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="ewstDispoMtdCdItems"
                itemText="ewstDispoMtdNm"
                itemValue="ewstDispoMtdCd"
                ui="bootstrap"
                name="ewstDispoMtdCd"
                label="L0000002825"
                v-model="waste.ewstDispoMtdCd"
                v-validate="'required'"
                :state="validateState('ewstDispoMtdCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 성질/상태 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="ewstPhaseCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="ewstPhaseCd"
                label="L0000001637"
                v-model="waste.ewstPhaseCd"
                v-validate="'required'"
                :state="validateState('ewstPhaseCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="ewstDispoDivCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="ewstDispoDivCd"
                label="L0000002816"
                v-model="waste.ewstDispoDivCd"
                v-validate="'required'"
                :state="validateState('ewstDispoDivCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리주기 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="ewstDispoCyCdItems"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="ewstDispoCyCd"
                label="L0000002840"
                v-model="waste.ewstDispoCyCd"
                v-validate="'required'"
                :state="validateState('ewstDispoCyCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- ERP 코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000111"
                name="sapCd"
                v-model="waste.sapCd"
                v-validate="'required'"
                :state="validateState('sapCd')"
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
                v-model="waste.useYn"
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
        ewstWasteNo: 0,
      },
    },
  },
  data() {
    return {
      waste: {
        ewstWasteNo: 0,
        ewstWasteNm: '',
        ewstClassCd: null,
        ewstClassNm: '',
        ewstDispoMtdCd: null,
        ewstDispoMtdNm: '',
        ewstPhaseCd: null,
        ewstPhaseNm: '',
        sapCd: '',
        ewstDispoDivCd: null,
        ewstDispoDivNm: '',
        ewstDispoCyCd: null,
        ewstDispoCyNm: '',
        sortOrder: null,
        useYn: 'Y',
        plantCd: null,
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

      insertUrl: '',
      editUrl: '',
      etailUrl: '',
      detailUrl: '',

      ewstClassCdItems: [],
      ewstDispoMtdCdItems: [],
      ewstPhaseCdItems: [],
      ewstDispoDivCdItems: [],
      ewstDispoCyCdItems: [],

      plantSearchItems: [],
      plantItems: [],
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
      // 선택항목 설정
      this.getEwstClassCdItems();
      this.getEwstDispoMtdCdItems();

      // 처리주기
      this.$comm.getComboItems('EWST_DISPO_CY', false).then((_result) => {
        this.ewstDispoCyCdItems = _result;
      });
      // 처리구분
      this.$comm.getComboItems('EWST_DISPO_DIV', false).then((_result) => {
        this.ewstDispoDivCdItems = _result;
      });
      // 성질/상태
      this.$comm.getComboItems('EWST_PHASE', false).then((_result) => {
        this.ewstPhaseCdItems = _result;
      });

      this.insertUrl = transactionConfig.env.waste.baseInfo.waste.insert.url;
      this.editUrl = transactionConfig.env.waste.baseInfo.waste.edit.url;
      this.detailUrl = selectConfig.env.waste.baseInfo.waste.get.url;

      if (this.popupParam.ewstWasteNo) {
        this.waste.ewstWasteNo = this.popupParam.ewstWasteNo;
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(this.detailUrl, this.waste.ewstWasteNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.waste = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEwstClassCdItems() {
      this.$http.url = selectConfig.env.waste.baseInfo.wasteClass.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewstClassCd: null,
            ewstClassNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요,
          });
          this.ewstClassCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    checkDuplicate() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.$format(
              selectConfig.env.waste.baseInfo.waste.dupleCheck.url,
              this.waste.ewstWasteNm,
              this.waste.plantCd
            );
            this.$http.type = 'GET';
            this.$http.request(
              (_result) => {
                if (_result.data > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000370', // '이미 같은 이름의 폐기물명이 존재합니다.',
                    type: 'warning',
                  });
                } else {
                  this.waste.ewstWasteNo = 0;
                  this.updateMode = false;
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.waste.createUserId = this.$store.getters.token;
                      this.isCreateSubmit = true;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else if (!_result) {
            this.$popupRequired.check('wasteDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
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
                this.waste.updateUserId = this.$store.getters.token;
                this.isUpdateSubmit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check('wasteDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    getEwstDispoMtdCdItems() {
      this.$http.url =
        selectConfig.env.waste.baseInfo.wasteDisposalMethod.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewstDispoMtdCd: null,
            ewstDispoMtdNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요,
          });
          this.ewstDispoMtdCdItems = _result.data;
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
    btnClearClickedCallback(_result) {
      Object.assign(this.$data.waste, this.$options.data().waste);
      this.$validator.reset();
      this.updateMode = false;
      this.waste.plantCd = this.$store.getters.plantCd;
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.updateMode = true;
      this.waste.ewstWasteNo = _result.data;
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

    btnClosePopup() {
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
