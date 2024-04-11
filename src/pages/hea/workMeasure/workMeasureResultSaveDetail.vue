<!--
  목적 : 작업환경측정결과 상세조회/등록/수정/삭제
  Detail : 작업환경측정결과 상세조회/등록/수정/삭제 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 작업환경측정결과 상세 -->
            <y-label
              label="L0000004356"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="!popupParam.disabled && editable"
                :action-url="saveUrl"
                :param="workMeasResult"
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
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="popupParam.disabled"
                :required="true"
                label="전회측정일"
                name="prevMeasDt"
                :default="workMeasResult.prevMeasDt"
                v-model="workMeasResult.prevMeasDt"
                v-validate="'required'"
                :state="validateState('prevMeasDt')"
              ></y-datepicker>
            </b-col> -->
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-number
                :width="8"
                :editable="editable"
                :disabled="popupParam.disabled"
                :required="true"
                :maxlength="7"
                :hasSeperator="true"
                :pointNumber="2"
                ui="bootstrap"
                label="작업장기온(℃)"
                name="workPlaceTemp"
                v-model="workMeasResult.workPlaceTemp"
                v-validate="'required'"
                :state="validateState('workPlaceTemp')"
              ></y-number>
            </b-col> -->
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-number
                :width="8"
                :editable="editable"
                :disabled="popupParam.disabled"
                :required="true"
                :maxlength="7"
                :hasSeperator="true"
                :pointNumber="2"
                ui="bootstrap"
                label="작업장습도(%)"
                name="workPlaceHumidity"
                v-model="workMeasResult.workPlaceHumidity"
                v-validate="'required'"
                :state="validateState('workPlaceHumidity')"
              ></y-number>
            </b-col> -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-tree-dept
                :required="true"
                :editable="editable"
                :disabled="popupParam.disabled"
                name="deptCd"
                type="edit"
                :plantCd="popupParam.plantCd"
                v-model="workMeasResult.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              ></y-tree-dept>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 공정 -->
              <y-tree-process
                :required="true"
                :editable="editable"
                :disabled="popupParam.disabled"
                label="L0000000515"
                name="processCd"
                type="edit"
                :showDataMapping="true"
                :plantCd="popupParam.plantCd"
                v-model="workMeasResult.processCd"
                v-validate="'required'"
                :state="validateState('processCd')"
              ></y-tree-process>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 유해인자 -->
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002188"
                name="hazardNm"
                v-model="workMeasResult.hazardNm"
                :appendIcon="[{ icon: 'search', callbackName: 'searchHazard' }]"
                @searchHazard="btnSearchHazardClicked"
                v-validate="'required'"
                :state="validateState('hazardNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 유해인자발생시간 -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="popupParam.disabled"
                :maxlength="5"
                :hasSeperator="false"
                ui="bootstrap"
                label="L0000002198"
                name="occurTime"
                v-model="workMeasResult.occurTime"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 단위작업장소 -->
              <y-text
                :width="10"
                :maxlength="50"
                :required="true"
                :editable="editable"
                :disabled="popupParam.disabled"
                ui="bootstrap"
                label="L0000000878"
                name="workPlace"
                v-model="workMeasResult.workPlace"
                v-validate="'required'"
                :state="validateState('workPlace')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 근로자수 -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="popupParam.disabled"
                :maxlength="3"
                :hasSeperator="false"
                ui="bootstrap"
                label="L0000000746"
                name="workerCnt"
                v-model="workMeasResult.workerCnt"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 작업내용 -->
              <y-text
                :width="10"
                :maxlength="50"
                :editable="editable"
                :disabled="popupParam.disabled"
                ui="bootstrap"
                label="L0000002374"
                name="workContents"
                v-model="workMeasResult.workContents"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 근로형태_시간 -->
              <y-text
                :width="8"
                :maxlength="50"
                :editable="editable"
                :disabled="popupParam.disabled"
                ui="bootstrap"
                label="L0000004706"
                name="shiftType"
                v-model="workMeasResult.shiftType"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 발생형태_주기 -->
              <y-text
                :width="8"
                :maxlength="50"
                :editable="editable"
                :disabled="popupParam.disabled"
                ui="bootstrap"
                label="L0000004707"
                name="occurType"
                v-model="workMeasResult.occurType"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 측정위치(근로자명) -->
              <y-text
                :width="8"
                :maxlength="50"
                :editable="editable"
                :disabled="popupParam.disabled"
                ui="bootstrap"
                label="L0000002948"
                name="measPsnNm"
                v-model="workMeasResult.measPsnNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- <y-text
                :width="8"
                :maxlength="15"
                :editable="editable"
                :disabled="popupParam.disabled"
                ui="bootstrap"
                label="측정시간"
                name="measDt"
                v-model="workMeasResult.measDt"
              ></y-text> -->
              <!-- 측정시간 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="popupParam.disabled"
                :minuteStep="1"
                :clearable="true"
                :range="true"
                label="L0000002941"
                type="time"
                name="measDt"
                v-model="workMeasResult.measDt"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 측정횟수 -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="popupParam.disabled"
                :maxlength="3"
                :hasSeperator="false"
                ui="bootstrap"
                label="L0000002965"
                name="measCnt"
                v-model="workMeasResult.measCnt"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- <y-text
                :width="8"
                :maxlength="25"
                :required="true"
                :editable="editable"
                :disabled="popupParam.disabled"
                ui="bootstrap"
                label="측정치"
                name="measValue"
                v-model="workMeasResult.measValue"
                v-validate="'required'"
                :state="validateState('measValue')"
              ></y-text> -->
              <!-- 측정치 -->
              <y-number
                :width="8"
                :editable="editable"
                :required="true"
                :disabled="popupParam.disabled"
                :maxlength="15"
                :hasSeperator="true"
                :pointNumber="3"
                ui="bootstrap"
                label="L0000002962"
                name="measValue"
                v-validate="'required'"
                v-model="workMeasResult.measValue"
                :state="validateState('measValue')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- <y-text
                :width="8"
                :maxlength="25"
                :editable="editable"
                :disabled="popupParam.disabled"
                ui="bootstrap"
                label="시간가중평균치-전회(TWA)"
                name="twaPrev"
                v-model="workMeasResult.twaPrev"
              ></y-text> -->
              <!-- 시간가중평균치-전회(TWA) -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="popupParam.disabled"
                :maxlength="15"
                :hasSeperator="true"
                :pointNumber="3"
                ui="bootstrap"
                label="L0000004708"
                name="twaPrev"
                v-model="workMeasResult.twaPrev"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- <y-text
                :width="8"
                :maxlength="25"
                :editable="editable"
                :disabled="popupParam.disabled"
                ui="bootstrap"
                label="시간가중평균치-금회(TWA)"
                name="twaCurr"
                v-model="workMeasResult.twaCurr"
              ></y-text> -->
              <!-- 시간가중평균치-금회(TWA) -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="popupParam.disabled"
                :maxlength="15"
                :hasSeperator="true"
                :pointNumber="3"
                ui="bootstrap"
                label="L0000004709"
                name="twaPrev"
                v-model="workMeasResult.twaCurr"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 노출기준 -->
              <y-text
                :width="8"
                :maxlength="25"
                :editable="editable"
                :disabled="popupParam.disabled"
                ui="bootstrap"
                label="L0000000845"
                name="exposureStd"
                v-model="workMeasResult.exposureStd"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 노출기준초과여부 -->
              <y-text
                :width="8"
                :maxlength="25"
                :editable="editable"
                :disabled="popupParam.disabled"
                ui="bootstrap"
                label="L0000000847"
                name="exposureExcessFlag"
                v-model="workMeasResult.exposureExcessFlag"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 측정 및 분석방법 -->
              <y-text
                :width="8"
                :maxlength="25"
                :editable="editable"
                :disabled="popupParam.disabled"
                ui="bootstrap"
                label="L0000004710"
                name="measMethod"
                v-model="workMeasResult.measMethod"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :maxlength="250"
                :editable="editable"
                :disabled="popupParam.disabled"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="workMeasResult.remark"
              ></y-textarea>
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
  name: 'work-measure-result-save-detail',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          workMeasRsltNo: 0,
          workMeasPlanNo: 0,
          disabled: false,
          plantCd: '',
          workAreaGradeCd: '',
        };
      },
    },
  },
  data() {
    return {
      workMeasResult: {
        workMeasRsltNo: 0, // 작업환경측정결과번호
        workMeasPlanNo: 0, // 작업환경측정계획번호
        workAreaGradeCd: '',
        deptCd: '', // 부서코드
        processCd: '', // 공정코드
        workPlace: '', // 단위작업장소(주요발생원인)
        hazardCd: '', // 유해인자코드
        hazardNm: '', // 유해인자명칭
        workContents: '', // 작업내용
        workerCnt: null, // 근로자수
        shiftType: '', // 근로형태_시간
        occurType: '', // 발생형태_주기
        occurTime: null, // 유해인자발생시간
        measPsnNm: '', // 측정위치(근로자)
        measDt: [], // 측정시간(시작~종료)
        measCnt: null, // 측정횟수
        measValue: '', // 측정치
        twaPrev: '', // 시간가중평균치(전회)
        twaCurr: '', // 시간가중평균치(금회)
        exposureStd: '', // 노출기준
        exposureExcessFlag: '', // 노출기준초과여부
        measMethod: '', // 측정_분석방법
        remark: '', // 비고
        workStartTime: '',
        workEndTime: '',

        createUserId: '',
        updateUserId: '',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: null,
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      editable: false,
      searchDetailUrl: '',
      saveUrl: '',
      isSave: false,
      actionType: 'POST',
    };
  },
  watch: {},
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
      this.searchDetailUrl = selectConfig.hea.workMeasureResult.get.url;
      this.saveUrl = transactionConfig.hea.workMeasureResult.insert.url;

      this.getDetail();
    },
    getDetail() {
      if (!this.popupParam.workMeasRsltNo) {
        return;
      }
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.workMeasRsltNo
      );
      this.$http.type = 'GET';
      this.$http.request((_result) => {
        this.workMeasResult = this.$_.clone(_result.data);
        this.workMeasResult.measDt = [
          this.workMeasResult.measStartTime,
          this.workMeasResult.measEndTime,
        ];
      });
    },
    validateState(_ref) {
      if (!_ref) return;
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    beforeSave() {
      if (this.popupParam.workMeasRsltNo) {
        this.saveUrl = transactionConfig.hea.workMeasureResult.edit.url;
        this.actionType = 'PUT';
        this.checkValidator('edit');
      } else {
        this.saveUrl = transactionConfig.hea.workMeasureResult.insert.url;
        this.actionType = 'POST';
        this.checkValidator('insert');
      }
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.workMeasResult.createUserId = this.$store.getters.token;
                this.workMeasResult.updateUserId = this.$store.getters.token;
                this.workMeasResult.workMeasPlanNo =
                  this.popupParam.workMeasPlanNo;
                this.workMeasResult.measStartTime =
                  this.workMeasResult.measDt[0];
                this.workMeasResult.measEndTime = this.workMeasResult.measDt[1];
                this.workMeasResult.workAreaGradeCd =
                  this.popupParam.workAreaGradeCd;

                this.isSave = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {},
            });
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' // 필수 입력값을 입력해 주세요.
            );
          }
        })
        .catch(() => {
          this.isSave = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      if (!this.popupParam.workMeasRsltNo) {
        this.popupParam.workMeasRsltNo = _result.data;
        this.workMeasResult.workMeasRsltNo = _result.data;
      }
      this.isSave = false;

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
    btnSearchHazardClicked() {
      if (this.popupParam.disabled || !this.editable) {
        return;
      }
      this.popupOptions.target = () => import(`${'../baseInfo/hazard.vue'}`);
      this.popupOptions.param = {
        popupMode: true,
        workAreaGradeCd: this.popupParam.workAreaGradeCd,
      };
      this.popupOptions.title = 'L0000002188'; // 유해인자
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopupSearchHazard;
    },
    closePopupSearchHazard(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data !== 'CLOSE') {
        this.workMeasResult.hazardCd = data.hazardCd;
        this.workMeasResult.hazardNm = data.hazardNmKo;
      }
    },
  },
};
</script>
