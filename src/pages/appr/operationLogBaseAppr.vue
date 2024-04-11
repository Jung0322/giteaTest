<!--
  목적 : 환경 > 대기 > 운영일지 > 상세
  작성자 : jkl
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 기본정보 -->
            <y-label
              label="L0000000776"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && !disabled"
                :action-url="saveUrl"
                :param="opLogRslt"
                :is-submit="isSave"
                title="저장"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="py-0">
      <b-col sm="12">
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                name="plantCd"
                v-model="opLogRslt.plantCd"
                :required="true"
                :editable="false"
                v-validate="'required'"
                :state="validateState('plantCd')"
              ></y-plant>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002355"
                v-model="opLogRslt.createUserNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 작성부서 -->
              <y-tree-dept
                type="edit"
                label="L0000002348"
                name="deptCd"
                :editable="false"
                v-model="opLogRslt.deptCd"
                :plantCd="opLogRslt.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 작성일자 -->
              <y-datepicker
                :width="8"
                :editable="false"
                :required="true"
                :disabled="updateMode"
                label="L0000002354"
                name="measureYmd"
                v-model="opLogRslt.measureYmd"
                v-validate="'required'"
                :state="validateState('measureYmd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 날씨 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="eairWeatherItems"
                :disabled="disabled"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="weather"
                label="L0000000803"
                v-model="opLogRslt.weather"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 온도(℃) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :disabled="disabled"
                :hasSeperator="false"
                ui="bootstrap"
                label="L0000002029"
                name="temp"
                v-model="opLogRslt.temp"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <component
      :is="dischargeChkResult"
      v-if="dischargeChkResult"
      :selectedMeasureYmd.sync="this.opLogRslt.measureYmd"
      :selectedDeptCd.sync="this.opLogRslt.deptCd"
      :selectedPlantCd.sync="this.opLogRslt.plantCd"
      :opLogRslt.sync="this.opLogRslt"
      :tabEditable.sync="editable"
      :updateMode.sync="updateMode"
    />
    <component
      :is="preventFacOperChkResult"
      v-if="preventFacOperChkResult"
      :selectedMeasureYmd.sync="opLogRslt.measureYmd"
      :selectedDeptCd.sync="this.opLogRslt.deptCd"
      :selectedPlantCd.sync="this.opLogRslt.plantCd"
      :opLogRslt.sync="this.opLogRslt"
      :tabEditable.sync="editable"
      :updateMode.sync="updateMode"
    />
    <component
      :is="preventFacMaintHist"
      v-if="preventFacMaintHist"
      :selectedMeasureYmd.sync="opLogRslt.measureYmd"
      :selectedDeptCd.sync="this.opLogRslt.deptCd"
      :selectedPlantCd.sync="this.opLogRslt.plantCd"
      :tabEditable.sync="editable"
      :updateMode.sync="updateMode"
    />

    <b-row>
      <b-col sm="6">
        <component
          :is="fuelCheckResult"
          v-if="fuelCheckResult"
          :selectedMeasureYmd.sync="opLogRslt.measureYmd"
          :selectedDeptCd.sync="this.opLogRslt.deptCd"
          :selectedPlantCd.sync="this.opLogRslt.plantCd"
          :opLogRslt.sync="this.opLogRslt"
          :tabEditable.sync="editable"
          :updateMode.sync="updateMode"
        />
      </b-col>
      <b-col sm="6">
        <component
          :is="ingredientCheckResult"
          v-if="ingredientCheckResult"
          :selectedMeasureYmd.sync="opLogRslt.measureYmd"
          :selectedDeptCd.sync="this.opLogRslt.deptCd"
          :selectedPlantCd.sync="this.opLogRslt.plantCd"
          :opLogRslt.sync="this.opLogRslt"
          :tabEditable.sync="editable"
          :updateMode.sync="updateMode"
        />
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
  name: 'operation-log-base-appr',
  props: {
    popupParam: {
      measureYmd: null,
      deptCd: null,
      plantCd: null,
      apprFlag: false,
      apprRqstNo: 0,
    },
  },
  data: function() {
    return {
      opLogRslt: {
        temp: null,
        measureYmd: null,
        deptCd: null,
        apprRqstNo: 0,
        createUserNm: '',
        weather: '',
        plantCd: '',
        dischChkResult: [], // 가동시간
        preventChkResult: [], // 운전사항
        preventChemResults: [], // 운전사항-약품
        fuelCheckResult: [], // 연료
        ingrCheckResult: [], // 원료
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      dischargeChkResult: null, // 배출구별 주요배출시설 및 방지시설 가동(조업)시간
      preventFacOperChkResult: null, // 방지시설 운전사항
      preventFacMaintHist: null, // 방지시설 보수내역
      fuelCheckResult: null, // 배출시설별 연료사용량
      ingredientCheckResult: null, // 원료사용량

      editable: true,
      updateMode: true,
      saveUrl: '',
      actionType: 'PUT',
      isSave: false,
      disabled: false,

      displayCreateUser: '', // 작성자
      eairWeatherItems: [], // 날씨 아이템
      deptItems: [], // 부서 아이템
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();

    this.loadComponent();
  },
  beforeDestory() {},
  //* methods */
  methods: {
    init() {
      this.$comm.getComboItems('SAF_WEATHER', false).then(_result => {
        this.eairWeatherItems = _result;
      }); // 날씨

      this.saveUrl = transactionConfig.env.air.opLog.createOplogResult.edit.url;
      this.detailUrl = selectConfig.env.air.opLog.oplogAll.url;

      this.opLogRslt.measureYmd = this.popupParam.measureYmd;
      this.opLogRslt.deptCd = this.popupParam.deptCd;
      this.opLogRslt.plantCd = this.popupParam.plantCd;
      this.getDetail();
    },
    apprSave() {
      return new Promise((resolve) => {
        this.$validator
          .validateAll()
          .then(_result => {
            if (_result) {
              this.opLogRslt.updateUserId = this.$store.getters.token;
              this.$http.url = this.saveUrl;
              this.$http.param = this.opLogRslt;
              this.$http.type = "PUT";
              this.$http.request(
                _result => {
                  this.isSave = false;
                  resolve(true);
                },
                _error => {
                  resolve(false)
                }
              );
            } else if (!_result) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000005',
                // 필수입력값을 입력해주세요.
                type: 'warning', // success / info / warning / error
              });
              resolve(false)
            }
          })
          .catch(() => {
            resolve(false)
            this.isDailyUpdateSubmit = false;
            window.getApp.$emit('APP_VALID_ERROR', 'M0000000881');
          });
      })
    },
    loadComponent() {
      // 배출구별 주요배출시설 및 방지시설 가동(조업)시간
      this.dischargeChkResult = () =>
        import(`${'@/pages/env/air/operationLog/dischargeChkResult.vue'}`);
      // 방지시설 운전사항
      this.preventFacOperChkResult = () =>
        import(`${'@/pages/env/air/operationLog/preventFacOperChkResult.vue'}`);
      // 방지시설 보수내역
      this.preventFacMaintHist = () =>
        import(`${'@/pages/env/air/operationLog/preventFacMaintHist.vue'}`);
      // 연료사용량
      this.fuelCheckResult = () =>
        import(`${'@/pages/env/air/operationLog/fuelCheckResult.vue'}`);
      // 원료사용량
      this.ingredientCheckResult = () =>
        import(`${'@/pages/env/air/operationLog/ingredientCheckResult.vue'}`);
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.opLogRslt.plantCd,
        this.opLogRslt.measureYmd,
        this.opLogRslt.deptCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.opLogRslt = _result.data;

          if (
            _result.data.bizApprStepCd === 'BAPSA' ||
            _result.data.envOpLogStCd === 'STEP2'
          ) {
            this.disabled = true;
          } else {
            this.disabled = false;
          }
        },
        _error => {
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
    beforeSave(flag) {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000011',
              // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.opLogRslt.updateUserId = this.$store.getters.token;
                this.isSave = true;
              },
              cancelCallback: () => {},
            });
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000005',
              // 필수입력값을 입력해주세요.
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          this.isDailyUpdateSubmit = false;
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000881');
        });
    },
    btnSaveClickedCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        // 저장되었습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
    },
  },
};
</script>
