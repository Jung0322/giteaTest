<!--
  목적 : 전력량계 관리
  작성자 : kkc (2021-02-18 수정)
  Detail : 전력량계 조회,등록,수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="insertBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 전력량계 상세 -->
            <y-label
              label="L0000002507"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="ewtrPwrMeter"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="ewtrPwrMeter"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12">
              <el-tag size="mini" type="danger">
                <!-- 사업장별로 클린센터가 조회됩니다. -->
                <i class="el-icon-info"></i>
                {{ this.$comm.getLangSpecInfoLabel('L0000001434') }}
              </el-tag>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="ewtrPwrMeter.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 전력량계명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002510"
                name="ewtrPwrMeterNm"
                v-model="ewtrPwrMeter.ewtrPwrMeterNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrPwrMeterNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 클린센터 -->
              <y-select
                :width="8"
                :comboItems="ewtrCleanFacItems"
                itemText="ewtrCleanFacNm"
                itemValue="ewtrCleanFacNo"
                ui="bootstrap"
                label="L0000002988"
                name="ewtrCleanFacNo"
                v-model="ewtrPwrMeter.ewtrCleanFacNo"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrCleanFacNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 전력계배율 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="10"
                :hasSeperator="true"
                :pointNumber="1"
                ui="bootstrap"
                label="L0000002504"
                name="pwrMeterMagn"
                v-model="ewtrPwrMeter.pwrMeterMagn"
                :required="true"
                v-validate="'required'"
                :state="validateState('pwrMeterMagn')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 전력계일련번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002505"
                name="pwrMeterCode"
                v-model="ewtrPwrMeter.pwrMeterCode"
              ></y-text>
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
                v-model="ewtrPwrMeter.useYn"
              ></y-switch>
              <!-- L0000001440: 사용 -->
              <!-- L0000001063: 미사용 -->
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="150"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="ewtrPwrMeter.remark"
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
  /* attributes: name, components, props, data */
  name: 'pwr-meter-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ewtrPwrMeterNo: 0,
      },
    },
  },
  data() {
    return {
      ewtrPwrMeter: {
        ewtrPwrMeterNo: 0,
        ewtrPwrMeterNm: '',
        remark: '',
        sortOrder: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        plantCd: null,
        plantNm: '',
        ewtrCleanFacNo: null,
        ewtrCleanFacNm: null,
        pwrMeterCode: null,
        pwrMeterMagn: null,
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
      gridOptions: {
        header: [],
        data: [],
        height: 300,
      },
      editable: true,
      updateMode: false,
      isInsert: false,
      isEdit: false,
      editUrl: '',
      insertUrl: '',
      ewtrCleanFacItems: [],
    };
  },
  watch: {
    'ewtrPwrMeter.plantCd': function (newValue, oldValue) {
      this.getCleanItems();

      this.ewtrPwrMeter.ewtrCleanFacNo = null;
    },
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
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.editUrl = transactionConfig.env.water.facility.pwrMeter.edit.url;
      this.insertUrl = transactionConfig.env.water.facility.pwrMeter.insert.url;

      this.getCleanItems();

      this.getDetail();
    },
    getDetail() {
      if (this.popupParam.ewtrPwrMeterNo === 0) return;

      this.$http.url = this.$format(
        selectConfig.env.water.facility.pwrMeter.get.url,
        this.popupParam.ewtrPwrMeterNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.ewtrPwrMeter = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getCleanItems() {
      this.$http.url = selectConfig.env.water.facility.wasteBasicUnit.list.url;
      this.$http.type = 'GET';
      this.$http.param = { plantCd: this.ewtrPwrMeter.plantCd };
      this.$http.request(
        (_result) => {
          this.ewtrCleanFacItems = this.$_.clone(_result.data);
          this.ewtrCleanFacItems.splice(0, 0, {
            ewtrCleanFacNo: null,
            ewtrCleanFacNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
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
    beforeEdit() {
      this.$http.url = selectConfig.env.water.facility.pwrMeter.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrPwrMeterNo: this.popupParam.ewtrPwrMeterNo,
        plantCd: this.ewtrPwrMeter.plantCd,
        ewtrPwrMeterNm: this.ewtrPwrMeter.ewtrPwrMeterNm,
      };
      this.$http.request((_result) => {
        if (_result.data === 0) {
          this.$validator
            .validateAll()
            .then((_result) => {
              if (_result) {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321', // '확인',
                  message: 'M0000000011', // 저장하시겠습니까?
                  type: 'info',
                  confirmCallback: () => {
                    this.ewtrPwrMeter.updateUserId = this.$store.getters.token;

                    this.isEdit = true;
                  },
                });
              } else if (!_result) {
                this.$popupRequired.check(
                  'pwrMeterDetail',
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
        } else {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000394', // '이미 입력된 사업장에 같은 전력량계명이 존재합니다.',
            type: 'warning',
          });
        }
      });
    },
    beforeInsert() {
      this.updateMode = false;
      this.$http.url = selectConfig.env.water.facility.pwrMeter.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrPwrMeterNo: 0,
        plantCd: this.ewtrPwrMeter.plantCd,
        ewtrPwrMeterNm: this.ewtrPwrMeter.ewtrPwrMeterNm,
      };
      this.$http.request((_result) => {
        if (_result.data === 0) {
          this.$validator
            .validateAll()
            .then((_result) => {
              if (_result) {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321', // '확인',
                  message: 'M0000000011', // 저장하시겠습니까?
                  type: 'info',
                  confirmCallback: () => {
                    this.ewtrPwrMeter.createUserId = this.$store.getters.token;

                    this.isInsert = true;
                  },
                });
              } else if (!_result) {
                this.$popupRequired.check(
                  'pwrMeterDetail',
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
        } else {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000394', // '이미 입력된 사업장에 같은 전력량계명이 존재합니다.',
            type: 'warning',
          });
        }
      });
    },
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
      this.getDetail();
    },
    /** button 관련 이벤트 **/
    btnInsertClickedCallback(_result) {
      this.popupParam.ewtrPwrMeterNo = _result.data;
      this.isInsert = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
      this.getDetail();
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
