<!--
  목적 : 시스템 > 배치관리 > 배치관리 상세
  수정자 : jkl
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
            <!-- 배치관리-상세 -->
            <y-label
              label="L0000004580"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="batch"
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 배치ID -->
              <y-text
                :width="8"
                :maxlength="25"
                :editable="editable"
                :required="true"
                :disabled="checkMode"
                ui="bootstrap"
                label="L0000001196"
                name="batchCd"
                v-model="batch.batchCd"
                v-validate="'required'"
                :state="validateState('batchCd')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 배치명 -->
              <y-text
                :width="8"
                :maxlength="100"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000001198"
                name="batchNm"
                v-model="batch.batchNm"
                v-validate="'required'"
                :state="validateState('batchNm')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 배치설명 -->
              <y-textarea
                :width="10"
                :maxlength="2000"
                :editable="editable"
                ui="bootstrap"
                label="L0000001199"
                name="batchDesc"
                v-model="batch.batchDesc"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 시작일자 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :required="true"
                label="L0000001779"
                name="cycleStartYmd"
                v-model="batch.cycleStartYmd"
                v-validate="'required'"
                :state="validateState('cycleStartYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6"></b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 반복주기 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="cycleDayCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="cycleDayCd"
                label="L0000001069"
                v-model="batch.cycleDayCd"
                v-validate="'required'"
                :state="validateState('cycleDayCd')"
                @datachange="
                  (val) => {
                    (batch.cycleDayCd = val), setDefault(val, 'cycleDayCd');
                  }
                "
              ></y-select>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 반복주기값 (반복주기 : 반복) -->
              <!-- 반복주기값 -->
              <y-text
                v-show="batch.cycleDayCd === 'R'"
                :width="8"
                :editable="false"
                ui="bootstrap"
                label="L0000001070"
                name="cycleDay"
                :value="text1"
              ></y-text>
              <!-- 반복주기값 -->
              <y-select
                v-show="batch.cycleDayCd === 'S'"
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="cycleDayItems"
                itemText="dayNm"
                itemValue="day"
                name="cycleDay"
                v-model="batch.cycleDay"
                ui="bootstrap"
                label="L0000001070"
                v-validate="batch.cycleDayCd === 'S' ? 'required' : null"
                :state="
                  batch.cycleDayCd === 'S' ? validateState('cycleDay') : null
                "
              ></y-select>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 실행주기 -->
              <y-select
                :width="8"
                label="실행주기"
                :required="true"
                :editable="editable"
                :comboItems="cycleHmCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="cycleHmCd"
                v-model="batch.cycleHmCd"
                v-validate="'required'"
                :state="validateState('cycleHmCd')"
                @datachange="
                  (val) => {
                    (batch.cycleHmCd = val), setDefault(val, 'cycleHmCd');
                  }
                "
              ></y-select>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 실행주기값 -->
              <y-text
                v-show="batch.cycleHmCd === 'R'"
                :width="8"
                :editable="false"
                ui="bootstrap"
                label="L0000001821"
                name="cycleHm"
                :value="text2"
              ></y-text>
              <!-- 실행주기값 -->
              <y-datepicker
                v-show="batch.cycleHmCd === 'S'"
                :width="8"
                :required="true"
                :editable="editable"
                label="L0000001821"
                name="time"
                type="time"
                :hourOptions="hourOptions"
                :minuteStep="1"
                v-model="batch.cycleHmNm"
                v-validate="batch.cycleHmCd === 'S' ? 'required' : null"
                :state="
                  batch.cycleHmCd === 'S' ? validateState('cycleHmNm') : null
                "
              ></y-datepicker>
            </b-col>
            <!-- 사용여부 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-switch
                :width="8"
                :editable="editable"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                itemText="codeNm"
                itemValue="code"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="batch.useYn"
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
  name: 'batch-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        batchCd: '',
      },
    },
  },
  data() {
    return {
      batch: {
        batchCd: '',
        batchNm: '',
        batchDesc: '',
        cycleStartYmd: '',
        cycleDayCd: 'R', // R: 반복, S: 고정
        cycleDay: '1',
        cycleHm: '1',
        cycleHmCd: 'R', // R: 반복(분), S: 고정(시간)
        cycleHmNm: '1',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      hourOptions: Array.from({ length: 23 }).map((_, i) => i + 1),
      editable: false,
      detailUrl: '',
      checkUrl: '',
      saveUrl: '',
      isSave: false,
      actionType: 'POST',
      cycleDayItems: [],
      cycleDayCdItems: [],
      cycleHmCdItems: [],
      checkMode: false,
      text1: '',
      text2: '',
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
      this.detailUrl = selectConfig.manage.log.batch.get.url;
      this.checkUrl = selectConfig.manage.log.batch.check.url;
      this.saveUrl = transactionConfig.manage.log.batch.insert.url;
      this.text1 = this.$comm.getLangSpecInfoLabel('L0000004581');
      this.text2 = this.$comm.getLangSpecInfoLabel('L0000004582');

      this.$comm.getComboItems('CYCLE_DAY_CD', false).then((_result) => {
        this.cycleDayCdItems = _result;
      });
      this.$comm.getComboItems('CYCLE_HM_CD', false).then((_result) => {
        this.cycleHmCdItems = _result;
      });

      this.getDetail();

      var k = 1;
      for (; k < 31; k++) {
        let val = '';
        if (k <= 9) {
          val = '0' + k;
        } else {
          val = k;
        }
        this.cycleDayItems.push({
          dayNm:
            this.$comm.getLangSpecInfoLabel('L0000004583') /* 매월  */ +
            k +
            this.$comm.getLangSpecInfoLabel('L0000003660') /* 일 */,
          day: val,
        });
      }
    },
    getDetail() {
      if (!this.popupParam.batchCd) {
        this.batch.cycleStartYmd = this.$comm.getToday();
      } else {
        this.$http.url = this.$format(this.detailUrl, this.popupParam.batchCd);
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.batch = this.$_.clone(_result.data);
            this.checkMode = true;
          },
          (_error) => {
            window.getApp.$emit(
              'APP_REQUEST_ERROR',
              'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
            );
          }
        );
      }
    },
    // 반복주기, 실행주기 고정일때 기본값 설정
    setDefault(va, flag) {
      // 반복주기값 기본값 설정 (매월 1일)
      if (flag === 'cycleDayCd') {
        if (this.batch.cycleDayCd === 'R') {
          // 반복
          this.batch.cycleDay = '1';
        } else {
          // 고정
          this.batch.cycleDay = '01';
        }
      } else if (flag === 'cycleHmCd') {
        if (this.batch.cycleHmCd === 'R') {
          // 반복
          this.batch.cycleHmNm = '1';
        } else {
          // 고정
          this.batch.cycleHmNm = '01:00';
        }
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
    /** validation checking **/
    beforeSave() {
      if (!this.popupParam.batchCd) {
        this.actionType = 'POST';
        this.saveUrl = transactionConfig.manage.log.batch.insert.url;
      } else {
        this.actionType = 'PUT';
        this.saveUrl = transactionConfig.manage.log.batch.edit.url;
      }
      this.beforeCheck();
    },
    beforeCheck(mode) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              batchCdSave: this.popupParam.batchCd
                ? this.popupParam.batchCd
                : '',
              batchCd: this.batch.batchCd,
            };
            this.$http.request((_result) => {
              if (_result.data > 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: 'M0000001071', // 동일한 배치ID가 존재합니다. 다른 배치ID를 입력해주세요.
                  type: 'warning', // success / info / warning / error
                });
              } else {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321', // 확인
                  message: 'M0000000011', // 저장하시겠습니까?
                  type: 'info',
                  confirmCallback: () => {
                    this.batch.createUserId = this.$store.getters.token;
                    this.batch.updateUserId = this.$store.getters.token;

                    let data = this.$_.split(this.batch.cycleHmNm, ':');
                    if (data && data.length === 2) {
                      this.batch.cycleHm = data[0] + data[1];
                    } else {
                      this.batch.cycleHm = this.$_.clone(this.batch.cycleHmNm);
                    }
                    this.isSave = true;
                  },
                  cancelCallback: () => {
                    this.isSave = false;
                  },
                });
              }
            });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000005', // 필수 입력값을 입력해 주세요.
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          this.isSave = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // 유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        });
    },
    btnSaveClickedCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      if (!this.popupParam.batchCd) {
        this.popupParam.batchCd = _result.data;
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
