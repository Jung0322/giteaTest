<!--
  목적 : 폐수배출시설 관리
  작성자 : kkc (2021-02-17 수정 etg)
  Detail : 폐수배출시설 조회,등록,수정
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
            <!-- 폐수배출시설 상세 -->
            <y-label
              label="L0000003130"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="ewtrWasteDischFac"
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
                :param="ewtrWasteDischFac"
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
                :disabled="updateMode"
                :editable="editable"
                name="plantCd"
                v-model="ewtrWasteDischFac.plantCd"
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
                v-model="ewtrWasteDischFac.deptCd"
                :plantCd="ewtrWasteDischFac.plantCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 클린센터 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="ewtrCleanFacItems"
                itemText="ewtrCleanFacNm"
                itemValue="ewtrCleanFacNo"
                ui="bootstrap"
                label="L0000002988"
                name="ewtrCleanFacNo"
                v-model="ewtrWasteDischFac.ewtrCleanFacNo"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrCleanFacNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출시설명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001174"
                name="ewtrWasteDischFacNm"
                v-model="ewtrWasteDischFac.ewtrWasteDischFacNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrWasteDischFacNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 일지표시명 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="ewtrDischGrpCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002284"
                name="ewtrDischGrpCd"
                v-model="ewtrWasteDischFac.ewtrDischGrpCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrDischGrpCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="8">
                  <!-- 용량 -->
                  <y-number
                    :width="6"
                    :editable="editable"
                    :required="true"
                    :maxlength="10"
                    :hasSeperator="true"
                    :pointNumber="2"
                    ui="bootstrap"
                    label="L0000002061"
                    name="vol"
                    v-model="ewtrWasteDischFac.vol"
                    v-validate="'required'"
                    :state="validateState('vol')"
                  />
                </b-col>
                <b-col sm="4">
                  <y-select
                    :width="12"
                    :editable="editable"
                    :required="true"
                    :comboItems="envUnitCdItems"
                    itemText="codeNm"
                    itemValue="code"
                    ui="bootstrap"
                    name="unitCd"
                    v-model="ewtrWasteDischFac.unitCd"
                    v-validate="'required'"
                    :state="validateState('unitCd')"
                  ></y-select>
                </b-col>
              </b-row>
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
                v-model="ewtrWasteDischFac.remark"
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
                v-model="ewtrWasteDischFac.useYn"
              ></y-switch>
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
  name: 'waste-discharge-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ewtrWasteDischFacNo: 0,
        facilityCd: 0,
        disabled: false,
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      ewtrWasteDischFac: {
        ewtrWasteDischFacNm: '',
        remark: '',
        sortOrder: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        plantCd: null,
        plantNm: null,
        ewtrCleanFacNm: null,
        deptCd: null,
        safFacilityCd: null,
        vol: null,
        unitCd: null,
        ewtrDischGrpCd: null,
        ewtrDischGrpNm: null,
        ewtrCleanFacNo: null,
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
      ewtrDischGrpCdItems: [],
      ewtrCleanFacItems: [],
      colsItems: [],
      envUnitCdItems: [],
    };
  },
  watch: {
    'ewtrWasteDischFac.plantCd'() {
      this.$comm
        .getComboItems('EWTR_DISCH_GRP', false)
        .then((_result) => {
          this.ewtrDischGrpCdItems = _result;
        })
        .then(this.getCleanItems());
      this.ewtrWasteDischFac.ewtrCleanFacNo = null;
      this.ewtrWasteDischFac.ewtrDischGrpCd = null;
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
    init() {
      this.editable = this.$route.meta.editable && !this.popupParam.disabled;
      this.editUrl =
        transactionConfig.env.water.facility.wasteDischFac.edit.url;
      this.insertUrl =
        transactionConfig.env.water.facility.wasteDischFac.insert.url;

      if (this.popupParam.facilityCd) {
        this.popupParam.ewtrWasteDischFacNo = this.popupParam.facilityCd;
      }

      this.$comm.getComboItems('ENV_UNIT', false).then((_result) => {
        this.envUnitCdItems = _result;
      });
      this.$comm.getComboItems('EWTR_DISCH_GRP', false).then((_result) => {
        this.ewtrDischGrpCdItems = _result;
      }); // 공통코드의 com_code_master의 remarks에 사업장코드가 들어가 있으므로 해당 사업장의 것만 조회.

      this.getDetail();
    },
    getDetail() {
      if (this.popupParam.ewtrWasteDischFacNo === 0) return;

      this.$http.url = this.$format(
        selectConfig.env.water.facility.wasteDischFac.get.url,
        this.popupParam.ewtrWasteDischFacNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.ewtrWasteDischFac = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeEdit() {
      this.$http.url = selectConfig.env.water.facility.wasteDischFac.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrWasteDischFacNo: this.popupParam.ewtrWasteDischFacNo,
        plantCd: this.ewtrWasteDischFac.plantCd,
        ewtrWasteDischFacNm: this.ewtrWasteDischFac.ewtrWasteDischFacNm,
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
                    this.ewtrWasteDischFac.updateUserId =
                      this.$store.getters.token;
                    this.isEdit = true;
                  },
                });
              } else if (!_result) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
                  type: 'warning', // success / info / warning / error
                });
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
            message: 'M0000000396', // '이미 입력된 사업장에 같은 배출시설명이 존재합니다.',
            type: 'warning',
          });
        }
      });
    },
    beforeInsert() {
      this.updateMode = false;
      this.$http.url = selectConfig.env.water.facility.wasteDischFac.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrWasteDischFacNo: this.popupParam.ewtrWasteDischFacNo,
        plantCd: this.ewtrWasteDischFac.plantCd,
        ewtrWasteDischFacNm: this.ewtrWasteDischFac.ewtrWasteDischFacNm,
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
                    this.ewtrWasteDischFac.ewtrWasteDischFacNo = 0;
                    this.ewtrWasteDischFac.createUserId =
                      this.$store.getters.token;
                    this.isInsert = true;
                  },
                });
              } else if (!_result) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
                  type: 'warning', // success / info / warning / error
                });
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
            message: 'M0000000396', // '이미 입력된 사업장에 같은 배출시설명이 존재합니다.',
            type: 'warning',
          });
        }
      });
    },
    getCleanItems() {
      this.$http.url = selectConfig.env.water.facility.wasteBasicUnit.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.ewtrWasteDischFac.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewtrCleanFacNo: null,
            ewtrCleanFacNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
          this.ewtrCleanFacItems = this.$_.clone(_result.data);
          setTimeout(() => {
            this.ewtrDischGrpCdItems = this.$_.filter(
              this.ewtrDischGrpCdItems,
              (_item) => {
                return (
                  this.ewtrWasteDischFac.plantCd === _item.remarks ||
                  _item.code === null
                );
              }
            );
          }, 300);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** button 관련 이벤트 **/
    btnInsertClickedCallback(_result) {
      this.popupParam.ewtrWasteDischFacNo = _result.data;
      this.isInsert = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = true;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
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
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
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
