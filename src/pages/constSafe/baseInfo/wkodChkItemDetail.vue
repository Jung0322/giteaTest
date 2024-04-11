<template>
  <b-container fluid>
    <b-row class="mt-3" ref="insertBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 항목 상세 -->
            <y-label
              label="L0000003203"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="wkodChkItem"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
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
                v-model="wkodChkItem.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 작업종류 -->
              <y-select
                :width="8"
                :comboItems="comboWkodKindItems"
                :editable="editable"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002422"
                name="wkodKindCd"
                v-model="wkodChkItem.wkodKindCd"
                v-validate="'required'"
                :state="validateState('wkodKindCd')"
                @datachange="
                  (val) => {
                    (wkodChkItem.wkodKindCd = val), datachange();
                  }
                "
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 체크항목 종류 -->
              <y-select
                :width="8"
                :comboItems="comboChkTypeCdItems"
                :editable="editable"
                :disabled="chkTypeCdDisabled"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002858"
                name="chkTypeCd"
                v-model="wkodChkItem.chkTypeCd"
                v-validate="'required'"
                :state="validateState('chkTypeCd')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-4">
              <!-- 항목명 -->
              <y-text
                :width="10"
                :maxlength="50"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000003205"
                name="chkItemNm"
                v-model="wkodChkItem.chkItemNm"
                v-validate="'required'"
                :state="validateState('chkItemNm')"
              ></y-text>
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
                name="radioValue"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="wkodChkItem.useYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 정렬순서 -->
              <y-number
                :width="8"
                :maxlength="5"
                :hasSeperator="false"
                :isPositive="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000002601"
                name="sortOrder"
                v-model="wkodChkItem.sortOrder"
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
  name: 'wkod-chk-item-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        chkItemNo: 0,
      },
    },
  },
  data() {
    return {
      wkodChkItem: {
        plantCd: null,
        chkItemNo: '',
        wkodKindCd: null,
        chkItemNm: '',
        chkTypeCd: null,
        sortOrder: 0,
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      editable: true,
      chkTypeCdDisabled: false,
      isSave: false,
      comboWkodKindItems: [],
      comboChkTypeCdItems: [],
      radioItems: null,
      saveUrl: '',
      actionType: 'POST',
    };
  },
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

      // Url Setting
      this.saveUrl = transactionConfig.saf.wkodChkItem.insert.url;

      // 작업종류
      this.$comm.getComboItems('SAF_WKOD_KIND', false).then((_result) => {
        _result.push({
          code: 'W997',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003612'),
        });
        _result.push({
          code: 'W998',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003613'),
        });
        _result.push({
          code: 'W999',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003614'),
        });
        this.comboWkodKindItems = _result;
      });

      // 체크항목종류
      this.$comm
        .getComboItems('STANDARD_WO_CHECK_TYPE', false)
        .then((_result) => {
          this.comboChkTypeCdItems = _result;
        });

      this.getDatail();
    },
    // combo box list

    getDatail() {
      if (this.popupParam.chkItemNo > 0) {
        this.$http.url = this.$format(
          selectConfig.saf.wkodChkItem.get.url,
          this.popupParam.chkItemNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.wkodChkItem = this.$_.clone(_result.data);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },

    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSave() {
      if (this.popupParam.chkItemNo) {
        this.saveUrl = transactionConfig.saf.wkodChkItem.edit.url;
        this.actionType = 'PUT';
        this.checkValidator('edit');
      } else {
        this.saveUrl = transactionConfig.saf.wkodChkItem.insert.url;
        this.actionType = 'POST';
        this.checkValidator('insert');
      }
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = selectConfig.saf.wkodChkItem.check.url;
            this.$http.param = {
              chkItemNo: flag === 'edit' ? this.popupParam.chkItemNo : '',
              wkodKindCd: this.wkodChkItem.wkodKindCd,
              chkItemNm: this.wkodChkItem.chkItemNm,
              plantCd: this.wkodChkItem.plantCd,
            };
            this.$http.type = 'GET';
            this.$http.request(
              (_result) => {
                var returnVal = this.showMessage(_result.data, flag);
                if (returnVal) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321',
                    message: 'M0000000011',
                    // TODO : 필요시 추가하세요.
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.wkodChkItem.createUserId = this.$store.getters.token;
                      this.wkodChkItem.updateUserId = this.$store.getters.token;

                      this.isSave = true;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            if (this.checkRequiredInput() === true) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000005',
                type: 'warning',
              });
            }
          }
        })
        .catch(() => {
          this.isSave = false;
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
        });
    },
    checkRequiredInput() {
      if (!this.wkodChkItem.plantCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000863', // 사업장을 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.wkodChkItem.wkodKindCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000835', // 작업종류를 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.wkodChkItem.chkTypeCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001138', // 체크항목 종류를 선택해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      if (!this.wkodChkItem.chkItemNm) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000001139', // 항목명을 입력해주세요.
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
      return true;
    },
    showMessage(check, flag) {
      var checkText = '';
      var i = 0;
      if (this.$_.parseInt(check.cnt) > 0) {
        // 이미 작업종류에 동일한 항목명이 존재합니다.
        checkText = this.$comm.getLangSpecInfoLabel('M0000000210');
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
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      if (!this.popupParam.chkItemNo) {
        this.popupParam.chkItemNo = this.$_.clone(_result.data);
      }
      this.getDatail();
      this.isSave = false;
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
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    datachange() {
      switch (this.wkodChkItem.wkodKindCd) {
        case 'W997':
        case 'W998':
        case 'W999':
          this.wkodChkItem.chkTypeCd = 'datatable';
          this.chkTypeCdDisabled = true;
          break;
        default:
          this.chkTypeCdDisabled = false;
          break;
      }
    },
  },
};
</script>
