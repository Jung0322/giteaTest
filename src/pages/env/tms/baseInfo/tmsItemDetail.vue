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
            <!-- TMS 측정항목 상세 -->
            <y-label
              label="L0000000183"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="tmsItem"
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
                v-if="editable && popupParam.itemCode"
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
              <!-- 구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="typeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000686"
                name="tmsType"
                v-model="tmsItem.tmsType"
                v-validate="'required'"
                :state="validateState('tmsType')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 항목코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="3"
                ui="bootstrap"
                label="L0000003212"
                name="itemCode"
                v-model="tmsItem.itemCode"
                v-validate="'required'"
                :state="validateState('itemCode')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 항목명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="8"
                ui="bootstrap"
                label="L0000003205"
                name="itemName"
                v-model="tmsItem.itemName"
                v-validate="'required'"
                :state="validateState('itemName')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 단위 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="6"
                ui="bootstrap"
                label="L0000000870"
                name="unit"
                v-model="tmsItem.unit"
                v-validate="'required'"
                :state="validateState('unit')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 변환팩터 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="6"
                :required="true"
                :hasSeperator="true"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000001244"
                name="convFactor"
                v-model="tmsItem.convFactor"
                v-validate="'required'"
                :state="validateState('convFactor')"
              ></y-number>
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
                v-model="tmsItem.dispOrder"
              ></y-number>
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
  name: 'y-tms-station-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        itemCode: '',
      },
    },
  },
  data: () => ({
    tmsItem: {
      itemCodeOrign: '',
      itemCode: '',
      itemName: '',
      tmsType: null,
      unit: '',
      convFactor: null,
      dispOrder: 0,
      createUserId: '',
      updateUserId: '',
    },
    deleteValue: null,
    itemCode: '',
    typeItems: [],
    actionType: 'POST',
    editable: false,
    disabled: false,
    isSave: false,
    isDelete: false,
    searchDetailUrl: '',
    checkUrl: '',
    saveUrl: '',
    deleteCheckUrl: '',
    deleteUrl: '',
  }),
  watch: {
    'tmsItem.plantCd'() {
      this.tmsItem.deptNm = '';
      this.tmsItem.eairOutletNo = '';
      this.tmsItem.eairOutletNm = '';
    },
  },
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

      this.searchDetailUrl = selectConfig.env.tms.baseInfo.tmsItem.get.url;
      this.checkUrl = selectConfig.env.tms.baseInfo.tmsItem.check.url;
      this.checkDetailUrl =
        selectConfig.env.tms.baseInfo.tmsItem.deleteCheck.url;
      this.saveUrl = transactionConfig.env.tms.baseInfo.tmsItem.insert.url;
      this.deleteCheckUrl =
        selectConfig.env.tms.baseInfo.tmsItem.deleteCheck.url;
      this.deleteUrl = transactionConfig.env.tms.baseInfo.tmsItem.delete.url;

      this.getDetail(); // TMS 측정항목 상세조회
      this.getComboItems('TMS_TYPE');
    },
    getDetail() {
      if (!this.popupParam.itemCode) {
        return;
      }
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.itemCode
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.disabled = true;
          this.tmsItem = this.$_.clone(_result.data);
          this.itemCode = this.$_.clone(this.tmsItem.itemCode);
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
    beforeSave() {
      if (this.popupParam.itemCode) {
        this.saveUrl = transactionConfig.env.tms.baseInfo.tmsItem.edit.url;
        this.actionType = 'PUT';
        this.checkValidator('edit');
      } else {
        this.saveUrl = transactionConfig.env.tms.baseInfo.tmsItem.insert.url;
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
              itemCodeOrign: flag === 'edit' ? this.itemCode : '',
              itemCode: this.tmsItem.itemCode,
              itemName: this.tmsItem.itemName,
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
                      this.tmsItem.itemCodeOrign = this.popupParam.itemCode;
                      this.tmsItem.createUserId = this.$store.getters.token;
                      this.tmsItem.updateUserId = this.$store.getters.token;
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
              'M0000000005' /* 필수 입력값을 입력해 주세요 */
            );
          }
        })
        .catch(() => {
          this.isSave = false;
          if (!this.isSave) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000881' /* 유효성 검사도중 에러가 발생하였습니다. */
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
              ? 'M0000000357' /* 이미 해당 사업장에 존재하는 항목명입니다. */
              : 'M0000000358'; /* 이미 존재하는 항목코드입니다. */
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
        itemCode: this.popupParam.itemCode,
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
              message: 'M0000000012', // 삭제하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.deleteValue = {
                  data: Object.values([this.tmsItem]),
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
        message: 'M0000000007', // 삭제되었습니다.
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
      if (!this.popupParam.itemCode) {
        let key = this.$_.padStart(result.data, 3, '0');
        this.itemCode = key;
        this.tmsItem.itemCode = key;
        this.popupParam.itemCode = key;
      } else {
        let key = this.$_.padStart(this.tmsItem.itemCode, 3, '0');
        this.tmsItem.itemCode = this.$_.clone(key);
        this.itemCode = key;
        this.popupParam.itemCode = key;
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
