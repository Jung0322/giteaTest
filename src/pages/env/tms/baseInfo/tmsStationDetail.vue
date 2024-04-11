<!--
  목적 : 안전점검 - 안전 점검 종류
  Detail : 안전 점검 종류 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- TMS 측정소 상세 -->
            <y-label
              label="L0000000175"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="tmsStation"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="editable && popupParam.stationCode"
                :action-url="deleteUrl"
                :param="deleteValue"
                :is-submit="isDelete"
                title="L0000001495"
                color="red"
                action-type="DELETE"
                beforeSubmit="beforeDelete"
                @beforeDelete="beforeDelete"
                @btnClicked="btnDeleteClickedCallback"
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
                v-model="tmsStation.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출시설명 -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="true"
                label="L0000001174"
                name="facilityNm"
                ui="bootstrap"
                v-model="tmsStation.facilityNm"
                v-validate="'required'"
                :state="validateState('facilityNm')"
              ></y-text>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3" />
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3 float-right">
              <el-tag size="medium" type="info">
                <i class="el-icon-info"></i>
                {{ $comm.getLangSpecInfoLabel('L0000005672') }}
                <!-- 측정소코드는 8자리 미만일 경우 8자리 수만큼 0이 왼쪽에 채워져 저장됩니다. -->
              </el-tag>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출구 -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="true"
                label="L0000001142"
                name="outletNm"
                ui="bootstrap"
                v-model="tmsStation.outletNm"
                :appendIcon="[
                  { icon: 'search', callbackName: 'searchEairOutlet' },
                ]"
                @searchEairOutlet="searchEairOutlet"
                v-validate="'required'"
                :state="validateState('outletNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 측정소코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="8"
                ui="bootstrap"
                label="L0000002938"
                name="stationCode"
                v-model="tmsStation.stationCode"
                v-validate="'required'"
                :state="validateState('stationCode')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 측정소명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="8"
                ui="bootstrap"
                label="L0000002937"
                name="stationName"
                v-model="tmsStation.stationName"
                v-validate="'required'"
                :state="validateState('stationName')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 설치년도 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                label="L0000001624"
                name="setupDay"
                :default="tmsStation.setupDay"
                v-model="tmsStation.setupDay"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 측정소구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="typeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002936"
                name="tmsType"
                v-model="tmsStation.tmsType"
                v-validate="'required'"
                :state="validateState('tmsType')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 제작사 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="8"
                ui="bootstrap"
                label="L0000002623"
                name="comp"
                v-model="tmsStation.comp"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 모델번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="8"
                ui="bootstrap"
                label="L0000001020"
                name="model"
                v-model="tmsStation.model"
              ></y-text>
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
                name="dispOrder"
                v-model="tmsStation.dispOrder"
              ></y-number>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-tms-station-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        stationCode: '',
      },
    },
  },
  data: () => ({
    tmsStation: {
      plantCd: null,
      stationCodeOrign: '',
      stationCode: '',
      stationName: '',
      eairDischFacNo: 0,
      eairOutletNo: 0,
      facilityNm: '',
      outletNm: '',
      tmsType: null,
      comp: '',
      model: '',
      dispOrder: 0,
      createUserId: '',
      updateUserId: '',
    },
    stationCode: '',
    typeItems: [],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '80%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    deleteValue: null,
    actionType: 'POST',
    editable: false,
    isSave: false,
    isDelete: false,
    searchDetailUrl: '',
    saveUrl: '',
    checkUrl: '',
    deleteCheckUrl: '',
    deleteUrl: '',
  }),
  watch: {},
  beforeCreate() {},
  created() {},
  updated() {},
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
      // Url Setting

      this.searchDetailUrl = selectConfig.env.tms.baseInfo.tmsStation.get.url;
      this.checkUrl = selectConfig.env.tms.baseInfo.tmsStation.check.url;
      this.deleteCheckUrl =
        selectConfig.env.tms.baseInfo.tmsStation.deleteCheck.url;
      this.saveUrl = transactionConfig.env.tms.baseInfo.tmsStation.insert.url;
      this.deleteUrl = transactionConfig.env.tms.baseInfo.tmsStation.delete.url;

      this.getDetail(); // TMS 측정소 상세조회
      this.$comm.getComboItems('TMS_TYPE', false).then((_result) => {
        this.typeItems = _result;
      });
    },
    getDetail() {
      if (!this.popupParam.stationCode) {
        return;
      }
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.stationCode
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.tmsStation = this.$_.clone(_result.data);
          this.stationCode = this.$_.clone(this.tmsStation.stationCode);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 공통 마스터 정보 조회
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'TMS_TYPE') {
            _result.data = this.$_.reject(_result.data, { attr1: 'tms_item' });
            this.typeItems = this.$_.clone(_result.data);
            this.typeItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    searchEairOutlet() {
      if (!this.editable) return;

      this.popupOptions.param = {
        plantCd: this.tmsStation.plantCd,
        isPopup: true,
      };
      this.popupOptions.target = () =>
        import(`${'@/pages/env/tms/baseInfo/outletFacility.vue'}`);
      this.popupOptions.title = 'L0000001142'; // 배출구
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchEairOutlet;
    },
    closePopupSearchEairOutlet(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data !== 'CLOSE') {
        this.tmsStation.plantCd = data[0].plantCd;
        this.tmsStation.eairDischFacNo = data[0].eairDischFacNo;
        this.tmsStation.eairOutletNo = data[0].eairOutletNo;
        this.tmsStation.outletNm = data[0].mainDischFacNm;
        this.tmsStation.facilityNm = data[0].eairDischFacNm;
      }
    },
    beforeSave() {
      if (this.popupParam.stationCode) {
        this.saveUrl = transactionConfig.env.tms.baseInfo.tmsStation.edit.url;
        this.actionType = 'PUT';
        this.checkValidator('edit');
      } else {
        this.saveUrl = transactionConfig.env.tms.baseInfo.tmsStation.insert.url;
        this.actionType = 'POST';
        this.checkValidator('insert');
      }
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.param = {
              stationCodeOrign: flag === 'edit' ? this.stationCode : '',
              stationCode: this.tmsStation.stationCode,
              stationName: this.tmsStation.stationName,
              plantCd: this.tmsStation.plantCd,
            };
            this.$http.type = 'GET';
            this.$http.request(
              (_result) => {
                var returnVal = this.showMessage(_result.data, flag);
                if (returnVal) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // 확인
                    message: 'M0000000011', // 저장하시겠습니까?
                    // TODO : 필요시 추가하세요.
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.tmsStation.stationCodeOrign =
                        this.popupParam.stationCode;
                      this.tmsStation.createUserId = this.$store.getters.token;
                      this.tmsStation.updateUserId = this.$store.getters.token;
                      this.isSave = true;
                    },
                    // 취소 callback 함수
                    cancelCallback: () => {},
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000710' /* 필수입력값을 입력 후 저장해주세요. */
            );
          }
        })
        .catch(() => {
          this.isSave = false;
          if (!this.isSave) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000881' /* '유효성 검사도중 에러가 발생하였습니다.' */
            );
          }
        });
    },
    showMessage(checkList, flag) {
      var checkText = '';
      var i = 0;
      for (; i < checkList.length; i++) {
        if (this.$_.parseInt(checkList[i].cnt) > 0) {
          checkText =
            checkList[i].gubun === 'stationName'
              ? 'M0000000361' /* 이미 해당 사업장에 존재하는 측정소명입니다. */
              : 'M0000000362'; /* 이미 존재하는 측정소코드입니다. */
          break;
        }
      }
      if (checkText) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: checkText,
          type: 'warning',
        });
        return false;
      } else {
        return true;
      }
    },
    beforeDelete() {
      this.$http.url = this.deleteCheckUrl;
      this.$http.param = {
        stationCode: this.popupParam.stationCode,
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data > 0) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000363' /* [삭제불가] 이미 사용중인 정보입니다. */,
              type: 'warning',
            });
          } else {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000012' /* 삭제하시겠습니까? */,
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.deleteValue = {
                  data: Object.values([this.tmsStation]),
                };
                this.isDelete = true;
              },
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000007' /* 삭제되었습니다. */,
        type: 'success',
      });
      this.btnClosePopup();
    },
    btnSaveClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      if (!this.popupParam.stationCode) {
        let key = this.$_.padStart(result.data, 8, '0');
        this.stationCode = key;
        this.tmsStation.stationCode = key;
        this.popupParam.stationCode = key;
      } else {
        let key = this.$_.padStart(this.tmsStation.stationCode, 8, '0');
        this.tmsStation.stationCode = this.$_.clone(key);
        this.stationCode = key;
        this.popupParam.stationCode = key;
      }
      this.isSave = false;
    },
    btnClickedErrorCallback(result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', result);
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
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
