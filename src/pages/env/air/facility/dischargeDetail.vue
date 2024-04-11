<!--
  목적 : 환경 > 대기 > 시설관리 > 배출시설 > 상세
  작성자 : psb
  Detail : 대기 배출시설 등록/수정
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
            <!-- 배출시설 정보 -->
            <y-label
              label="L0000001173"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="discharge"
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="discharge.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관리부서 -->
              <y-tree-dept
                :editable="editable"
                type="edit"
                label="L0000000591"
                name="mgDeptCd"
                :plantCd="discharge.plantCd"
                v-model="discharge.mgDeptCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('mgDeptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출시설명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001174"
                name="eairDischFacNm"
                v-model="discharge.eairDischFacNm"
                v-validate="'required'"
                :state="validateState('eairDischFacNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관리번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000590"
                name="mgrNum"
                v-model="discharge.mgrNum"
                v-validate="'required'"
                :state="validateState('mgrNum')"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 연료 -->
              <y-multi-select
                :width="8"
                :editable="editable"
                :needDefaultView="true"
                :comboItems="fuelItems"
                itemText="eairFuelNm"
                itemValue="eairFuelCd"
                ui="bootstrap"
                label="L0000001996"
                name="fuelItems"
                v-model="discharge.fuelItems"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="8">
                  <!-- 용량 -->
                  <y-number
                    :width="6"
                    :editable="editable"
                    :maxlength="10"
                    ui="bootstrap"
                    label="L0000002061"
                    name="vol"
                    v-model="discharge.vol"
                  ></y-number>
                </b-col>
                <b-col sm="4">
                  <y-select
                    :width="12"
                    :editable="editable"
                    :comboItems="envUnitCdItems"
                    itemText="codeNm"
                    itemValue="code"
                    ui="bootstrap"
                    name="unitCd"
                    v-model="discharge.unitCd"
                  ></y-select>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 수량 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="25"
                ui="bootstrap"
                label="L0000001680"
                name="capVol"
                v-model="discharge.capVol"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- ERP 코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="25"
                ui="bootstrap"
                label="L0000000111"
                name="sapCd"
                v-model="discharge.sapCd"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출시설일련번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="25"
                ui="bootstrap"
                label="L0000001178"
                name="eairDischFacNum"
                v-model="discharge.eairDischFacNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- SEMS대상여부 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="semsTargetYnItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000004221"
                name="semsYn"
                v-model="discharge.semsYn"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="200"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="discharge.remark"
                :rows="2"
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
                v-model="discharge.useYn"
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
  name: 'discharge-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        eairDischFacNo: 0,
        facilityCd: 0,
        disabled: false,
      },
    },
  },
  data() {
    return {
      discharge: {
        eairDischFacNo: 0,
        eairDischFacNm: null,
        eairDischFacNum: null,
        eairOutletNo: null,
        plantCd: null,
        eairOutletNm: null,
        remark: '',
        sortOrder: null,
        useYn: 'Y',
        mgrNum: '', // 관리번호
        deptCd: null, // 일지작성부서
        mgDeptCd: null, // 관리부서

        createUserId: '',
        updateUserId: '',

        fuelItems: [],
        fuelItem: [],

        vol: null,
        unitCd: null,
        unitNm: null,
        capVol: null,
        sapCd: null,
        semsYn: null,
      },
      editable: false,

      isSave: false,
      actionType: 'POST',
      saveUrl: '',
      detailUrl: '',
      checkUrl: '',

      fuelItems: [], // 연료 멀티 콤보 아이템
      envUnitCdItems: [], // 용량 단위 콤보박스
      semsTargetYnItems: [], // SEMS 대상여부 콤보 아이템
    };
  },
  watch: {
    'discharge.plantCd': function (newValue, oldValue) {
      this.getFuelItems();
    },
  },
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
      this.editable = this.$route.meta.editable && !this.popupParam.disabled;

      if (this.popupParam.facilityCd) {
        this.popupParam.eairDischFacNo = this.popupParam.facilityCd;
      }

      // 용량 단위
      this.$comm.getComboItems('ENV_UNIT', false).then((_result) => {
        this.envUnitCdItems = _result;
      });

      // SEMS대상여부
      this.semsTargetYnItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') }, // '선택하세요'
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003213') }, // 해당
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001065') }, // 미해당
      ];

      // 연료
      this.getFuelItems();

      this.saveUrl = transactionConfig.env.air.facility.discharge.insert.url;
      this.detailUrl = selectConfig.env.air.facility.dischargeN.get.url;
      this.checkUrl = selectConfig.env.air.facility.dischargeN.check.url;

      if (this.popupParam.eairDischFacNo) {
        this.discharge.eairDischFacNo = this.popupParam.eairDischFacNo;
        this.getDetail();
      }
    },

    getFuelItems() {
      this.$http.url = selectConfig.env.air.baseInfo.fuel.list.url;
      this.$http.type = 'GET';
      this.$http.param = { plantCd: this.discharge.plantCd };
      this.$http.request(
        (_result) => {
          this.fuelItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.discharge.eairDischFacNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.discharge = _result.data;
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
      if (this.discharge.eairDischFacNo) {
        // 수정
        flag = 'update';
        this.actionType = 'PUT';
        this.saveUrl = transactionConfig.env.air.facility.discharge.edit.url;
      } else {
        // 신규등록
        flag = 'insert';
        this.actionType = 'POST';
        this.saveUrl = transactionConfig.env.air.facility.discharge.insert.url;
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
              eairDischFacNo:
                flag === 'insert' ? 0 : this.discharge.eairDischFacNo,
              eairDischFacNm: this.discharge.eairDischFacNm,
              plantCd: this.discharge.plantCd,
            };
            this.$http.request(
              (_result) => {
                if (_result.data > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000312', // '이미 같은 이름의 배출시설명이 있습니다.',
                    type: 'warning',
                  });
                  return;
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.discharge.fuelItem = this.$_.clone(
                        this.$_.map(this.discharge.fuelItems, 'code')
                      );
                      if (flag === 'insert') {
                        this.discharge.createUserId = this.$store.getters.token;
                      } else {
                        this.discharge.updateUserId = this.$store.getters.token;
                      }
                      this.isSave = true;
                    },
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
              'dischargeDetail',
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
      this.discharge.eairDischFacNo = _result.data;
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
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
