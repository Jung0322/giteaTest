<template>
  <b-container fluid>
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 알람설정 상세 -->
            <y-label
              label="L0000001901"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="alarm"
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
              <!-- 알람명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="50"
                :required="true"
                ui="bootstrap"
                label="L0000001898"
                name="alarmNm"
                v-model="alarm.alarmNm"
                v-validate="'required'"
                :state="validateState('alarmNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 알람방식 -->
              <y-multi-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="alarmTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001899"
                name="alarmTypes"
                v-model="alarmTypes"
                v-validate="'required'"
                :state="validateState('alarmTypes')"
              ></y-multi-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 알람설명 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="1000"
                :rows="10"
                ui="bootstrap"
                label="L0000001900"
                name="alarmDesk"
                v-model="alarm.alarmDesk"
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
                v-model="alarm.useYn"
              ></y-switch>
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
  name: 'alarm-detail',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          alarmNo: 0,
        };
      },
    },
  },
  data() {
    return {
      alarm: {
        alarmNo: 0,
        alarmNm: '',
        smsYn: '',
        emailYn: '',
        alarmDesk: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      alarmTypes: [],
      alarmTypeItems: [
        { code: 'M', codeNm: 'Mail' },
        { code: 'S', codeNm: 'SMS' },
      ],
      editable: false,
      searchUrl: '',
      checkUrl: '',
      saveUrl: '',
      actionType: 'POST',
      isSave: false,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // URL 셋팅
      this.searchUrl = selectConfig.manage.alarm.get.url;
      this.checkUrl = selectConfig.manage.alarm.check.url;
      this.saveUrl = transactionConfig.manage.alarm.insert.url;

      // this.$comm.getComboItems('ALARM_TYPE', false).then(_result => {
      //   _result.splice(0, 1);
      //   this.alarmTypeItems = _result;
      // });

      this.getDetail();
    },
    getDetail() {
      if (!this.popupParam.alarmNo) {
        return;
      } else {
        this.$http.url = this.$format(this.searchUrl, this.popupParam.alarmNo);
        this.$http.type = 'GET';
        this.$http.request((_result) => {
          this.$_.extend(this.alarm, _result.data);

          this.alarmTypes = [];
          if (this.alarm.smsYn === 'Y') {
            this.alarmTypes.push({
              code: 'S',
              name: 'SMS',
            });
          }
          if (this.alarm.emailYn === 'Y') {
            this.alarmTypes.push({
              code: 'M',
              name: 'Mail',
            });
          }
        });
      }
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
      if (this.popupParam.alarmNo > 0) {
        this.saveUrl = transactionConfig.manage.alarm.edit.url;
        this.actionType = 'PUT';
      } else {
        this.saveUrl = transactionConfig.manage.alarm.insert.url;
        this.actionType = 'POST';
      }
      this._beforeCheck();
    },
    _beforeCheck(mode) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              alarmNo: this.popupParam.alarmNo ? this.alarm.alarmNo : 0,
              alarmNm: this.alarm.alarmNm,
            };
            this.$http.request((_result) => {
              if (_result.data > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000000488', // 동일한 알람명이 존재합니다. 다른 알람명을 입력해주세요.
                  type: 'warning', // success / info / warning / error
                });
              } else {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321', // 확인
                  message: 'M0000000011', // 저장하시겠습니까?
                  type: 'info',
                  confirmCallback: () => {
                    this.alarm.createUserId = this.$store.getters.token;
                    this.alarm.updateUserId = this.$store.getters.token;

                    this.alarm.emailYn = 'N';
                    this.alarm.smsYn = 'N';
                    this.$_.forEach(this.alarmTypes, (item) => {
                      if (item.code === 'M') {
                        this.alarm.emailYn = 'Y';
                      }
                      if (item.code === 'S') {
                        this.alarm.smsYn = 'Y';
                      }
                    });
                    this.isSave = true;
                  },
                  cancelCallback: () => {
                    this.isSave = false;
                  },
                });
              }
            });
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000005', // 필수 입력값을 입력해 주세요.
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // 유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
          this.isSave = false;
        });
    },
    btnSaveClickedCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      if (!this.popupParam.alarmNo) {
        this.popupParam.alarmNo = _result.data;
      }
      this.getDetail();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
