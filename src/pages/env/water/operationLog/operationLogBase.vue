<!--
  목적 : 운영일지 팝업
  작성자 : etg
  Detail : 탭들을 묶은 화면
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
              <!-- 결재요청 -->
              <y-btn
                v-if="btnAppr"
                title="L0000003418"
                color="black"
                @btnClicked="btnApprClicked"
              />
              <!-- 일지삭제 -->
              <y-btn
                v-if="btnDelete"
                title="L0000002281"
                color="red"
                @btnClicked="btnDeleteClickedCallback"
              />
              <!-- 일지출력 -->
              <y-btn
                title="L0000002283"
                v-if="btnPrint"
                @btnClicked="printOperationLog"
              />
              <!-- 기본정보 저장 -->
              <y-btn
                v-if="editable && !disabled"
                :action-url="saveUrl"
                :param="ewtrOpLogResult"
                :is-submit="isEdit"
                title="L0000000778"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn
                title="L0000000881"
                v-if="!this.popupParam.apprFlag"
                @btnClicked="closePopup"
              />
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row ref="insertBox">
      <b-col sm="12">
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                type="edit"
                :disabled="updateMode || disabled"
                v-model="ewtrOpLogResult.plantCd"
                @datachange="
                  (val) => {
                    (ewtrOpLogResult.plantCd = val), getCleanItems();
                  }
                "
                :required="true"
                :editable="false"
                v-validate="'required'"
                :state="validateState('plantCd')"
              ></y-plant>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 클린센터 -->
              <y-select
                :width="8"
                :editable="false"
                :comboItems="ewtrCleanFacItems"
                itemText="ewtrCleanFacNm"
                itemValue="ewtrCleanFacNo"
                :disabled="updateMode"
                ui="bootstrap"
                label="L0000002988"
                name="ewtrCleanFacNm"
                v-model="ewtrOpLogResult.ewtrCleanFacNo"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrCleanFacNm')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 작성일자 -->
              <y-datepicker
                :width="8"
                :editable="false"
                :disabled="updateMode || disabled"
                :required="true"
                label="L0000002354"
                name="measureYmd"
                v-model="ewtrOpLogResult.measureYmd"
                v-validate="'required'"
                :state="validateState('measureYmd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 작성자 -->
              <y-text
                :width="8"
                :editable="editable"
                ui="bootstrap"
                label="L0000002355"
                :disabled="true"
                v-model="displayCreateUser"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
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
                v-model="ewtrOpLogResult.weather"
                label="L0000000803"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 온도(℃) -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="7"
                :disabled="disabled"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000002029"
                name="temp"
                v-model="ewtrOpLogResult.temp"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="8">
                  <!-- 근무자/근무시간1 -->
                  <y-text
                    :width="6"
                    :maxlength="50"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000000753"
                    name="shiftWorker1"
                    v-model="ewtrOpLogResult.shiftWorker1"
                  ></y-text>
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :maxlength="15"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    name="shiftWktm1"
                    v-model="ewtrOpLogResult.shiftWktm1"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="8">
                  <!-- 근무자/근무시간2 -->
                  <y-text
                    :width="6"
                    :maxlength="50"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000000754"
                    name="shiftWorker2"
                    v-model="ewtrOpLogResult.shiftWorker2"
                  ></y-text>
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :maxlength="15"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    name="shiftWktm2"
                    v-model="ewtrOpLogResult.shiftWktm2"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="8">
                  <!-- 근무자/근무시간3 -->
                  <y-text
                    :width="6"
                    :maxlength="50"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000000755"
                    name="shiftWorker3"
                    v-model="ewtrOpLogResult.shiftWorker3"
                  ></y-text>
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :maxlength="15"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    name="shiftWktm3"
                    v-model="ewtrOpLogResult.shiftWktm3"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="8">
                  <!-- 근무자/근무시간4 -->
                  <y-text
                    :width="6"
                    :maxlength="50"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000000756"
                    name="shiftWorker4"
                    v-model="ewtrOpLogResult.shiftWorker4"
                  ></y-text>
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :maxlength="15"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    name="shiftWktm4"
                    v-model="ewtrOpLogResult.shiftWktm4"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="8">
                  <!-- 근무자/근무시간5 -->
                  <y-text
                    :width="6"
                    :maxlength="50"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000000757"
                    name="shiftWorker5"
                    v-model="ewtrOpLogResult.shiftWorker5"
                  ></y-text>
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :maxlength="15"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    name="shiftWktm5"
                    v-model="ewtrOpLogResult.shiftWktm5"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="8">
                  <!-- 근무자/근무시간6 -->
                  <y-text
                    :width="6"
                    :maxlength="50"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000000758"
                    name="shiftWorker6"
                    v-model="ewtrOpLogResult.shiftWorker6"
                  ></y-text>
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :maxlength="15"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    name="shiftWktm6"
                    v-model="ewtrOpLogResult.shiftWktm6"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col v-if="!updateMode && !disabled" sm="12">
              <el-tag size="mini" type="danger">
                <!-- 기본정보를 저장하면 아래의 데이터가 조회됩니다. -->
                <i class="el-icon-info"></i>
                {{ $comm.getLangSpecInfoLabel('L0000000779') }}
              </el-tag>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <component
        :is="comDischRunTm"
        v-if="comDischRunTm"
        :tabEditable.sync="editable"
        :paramMeasureYmd.sync="this.ewtrOpLogResult.measureYmd"
        :paramEwtrCleanFacNo.sync="this.ewtrOpLogResult.ewtrCleanFacNo"
        :paramPlantCd.sync="this.ewtrOpLogResult.plantCd"
        :paramDeptCd.sync="this.ewtrOpLogResult.deptCd"
        :apprMode.sync="apprMode"
        :authDuringAppr.sync="authDuringAppr"
        :updateMode.sync="updateMode"
        :disabled.sync="disabled"
      />

      <component
        :is="comPreventRunTm"
        v-if="comPreventRunTm"
        :tabEditable.sync="editable"
        :paramMeasureYmd.sync="this.ewtrOpLogResult.measureYmd"
        :paramEwtrCleanFacNo.sync="this.ewtrOpLogResult.ewtrCleanFacNo"
        :paramPlantCd.sync="this.ewtrOpLogResult.plantCd"
        :paramDeptCd.sync="this.ewtrOpLogResult.deptCd"
        :apprMode.sync="apprMode"
        :authDuringAppr.sync="authDuringAppr"
        :updateMode.sync="updateMode"
        :disabled.sync="disabled"
      />

      <component
        :is="comSuplChkResult"
        v-if="comSuplChkResult"
        :tabEditable.sync="editable"
        :paramMeasureYmd.sync="this.ewtrOpLogResult.measureYmd"
        :paramEwtrCleanFacNo.sync="this.ewtrOpLogResult.ewtrCleanFacNo"
        :paramPlantCd.sync="this.ewtrOpLogResult.plantCd"
        :paramDeptCd.sync="this.ewtrOpLogResult.deptCd"
        :apprMode.sync="apprMode"
        :authDuringAppr.sync="authDuringAppr"
        :updateMode.sync="updateMode"
        :disabled.sync="disabled"
      />

      <component
        :is="comDischChkResult"
        v-if="comDischChkResult"
        :tabEditable.sync="editable"
        :paramMeasureYmd.sync="this.ewtrOpLogResult.measureYmd"
        :paramEwtrCleanFacNo.sync="this.ewtrOpLogResult.ewtrCleanFacNo"
        :paramPlantCd.sync="this.ewtrOpLogResult.plantCd"
        :paramDeptCd.sync="this.ewtrOpLogResult.deptCd"
        :apprMode.sync="apprMode"
        :authDuringAppr.sync="authDuringAppr"
        :updateMode.sync="updateMode"
        :disabled.sync="disabled"
      />

      <component
        :is="comPwrcChkResult"
        v-if="comPwrcChkResult"
        :tabEditable.sync="editable"
        :paramMeasureYmd.sync="this.ewtrOpLogResult.measureYmd"
        :paramEwtrCleanFacNo.sync="this.ewtrOpLogResult.ewtrCleanFacNo"
        :paramPlantCd.sync="this.ewtrOpLogResult.plantCd"
        :paramDeptCd.sync="this.ewtrOpLogResult.deptCd"
        :apprMode.sync="apprMode"
        :authDuringAppr.sync="authDuringAppr"
        :updateMode.sync="updateMode"
        :disabled.sync="disabled"
      />

      <component
        :is="comChemChkResult"
        v-if="comChemChkResult"
        :tabEditable.sync="editable"
        :paramMeasureYmd.sync="this.ewtrOpLogResult.measureYmd"
        :paramEwtrCleanFacNo.sync="this.ewtrOpLogResult.ewtrCleanFacNo"
        :paramPlantCd.sync="this.ewtrOpLogResult.plantCd"
        :paramDeptCd.sync="this.ewtrOpLogResult.deptCd"
        :apprMode.sync="apprMode"
        :authDuringAppr.sync="authDuringAppr"
        :updateMode.sync="updateMode"
        :disabled.sync="disabled"
      />

      <component
        :is="comIngrChkResult"
        v-if="comIngrChkResult"
        :tabEditable.sync="editable"
        :paramMeasureYmd.sync="this.ewtrOpLogResult.measureYmd"
        :paramEwtrCleanFacNo.sync="this.ewtrOpLogResult.ewtrCleanFacNo"
        :paramPlantCd.sync="this.ewtrOpLogResult.plantCd"
        :paramDeptCd.sync="this.ewtrOpLogResult.deptCd"
        :apprMode.sync="apprMode"
        :authDuringAppr.sync="authDuringAppr"
        :updateMode.sync="updateMode"
        :disabled.sync="disabled"
      />

      <component
        :is="comTestItemResult"
        v-if="comTestItemResult"
        :tabEditable.sync="editable"
        :paramMeasureYmd.sync="this.ewtrOpLogResult.measureYmd"
        :paramEwtrCleanFacNo.sync="this.ewtrOpLogResult.ewtrCleanFacNo"
        :paramPlantCd.sync="this.ewtrOpLogResult.plantCd"
        :paramDeptCd.sync="this.ewtrOpLogResult.deptCd"
        :apprMode.sync="apprMode"
        :authDuringAppr.sync="authDuringAppr"
        :updateMode.sync="updateMode"
        :disabled.sync="disabled"
      />

      <component
        :is="comSludgeProcess"
        v-if="comSludgeProcess"
        :tabEditable.sync="editable"
        :paramMeasureYmd.sync="this.ewtrOpLogResult.measureYmd"
        :paramEwtrCleanFacNo.sync="this.ewtrOpLogResult.ewtrCleanFacNo"
        :paramPlantCd.sync="this.ewtrOpLogResult.plantCd"
        :paramDeptCd.sync="this.ewtrOpLogResult.deptCd"
        :apprMode.sync="apprMode"
        :authDuringAppr.sync="authDuringAppr"
        :updateMode.sync="updateMode"
        :disabled.sync="disabled"
        @getDetail="getDetail"
      />

      <component
        :is="inspection"
        v-if="inspection"
        :tabEditable.sync="editable"
        :paramMeasureYmd.sync="this.ewtrOpLogResult.measureYmd"
        :paramEwtrCleanFacNo.sync="this.ewtrOpLogResult.ewtrCleanFacNo"
        :paramPlantCd.sync="this.ewtrOpLogResult.plantCd"
        :paramDeptCd.sync="this.ewtrOpLogResult.deptCd"
        :apprMode.sync="apprMode"
        :authDuringAppr.sync="authDuringAppr"
        :updateMode.sync="updateMode"
        :disabled.sync="disabled"
        @getDetail="getDetail"
      />

      <component
        :is="comPreventBreakHist"
        v-if="comPreventBreakHist"
        :tabEditable.sync="editable"
        :paramMeasureYmd.sync="this.ewtrOpLogResult.measureYmd"
        :paramEwtrCleanFacNo.sync="this.ewtrOpLogResult.ewtrCleanFacNo"
        :paramPlantCd.sync="this.ewtrOpLogResult.plantCd"
        :paramDeptCd.sync="this.ewtrOpLogResult.deptCd"
        :apprMode.sync="apprMode"
        :authDuringAppr.sync="authDuringAppr"
        :updateMode.sync="updateMode"
        :disabled.sync="disabled"
      />
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'op-log-base',
  components: {},
  props: {
    popupParam: {
      measureYmd: null,
      ewtrCleanFacNo: 0,
      plantCd: null,
      deptCd: null,
      apprFlag: false,
      apprRqstNo: 0,
    },
  },
  data() {
    return {
      editable: true,
      inspection: null,
      isEdit: false,
      isNew: false,
      apprMode: false,

      // 컴포넌트 쪽 is
      comSludgeProcess: null,
      comSuplChkResult: null,
      comPreventBreakHist: null,
      comDischChkResult: null,
      comIngrChkResult: null,
      comPwrcChkResult: null,
      comChemChkResult: null,
      comTestItemResult: null,
      comDischRunTm: null,
      comPreventRunTm: null,

      ewtrOpLogResult: {
        measureYmd: null,
        createUserNm: null,
        deptNm: null,
        createUserId: null,
        day: null,
        weather: null,
        temp: null,
        plantCd: null,

        shiftWorker1: null,
        shiftWorker2: null,
        shiftWorker3: null,
        shiftWorker4: null,
        shiftWorker5: null,
        shiftWorker6: null,

        shiftWktm1: null,
        shiftWktm2: null,
        shiftWktm3: null,
        shiftWktm4: null,
        shiftWktm5: null,
        shiftWktm6: null,

        envOpLogStCd: null,
        updateUserId: null,
        ewtrCleanFacNo: 0,
        ewtrCleanFacNm: null,
        updateFlag: false,
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
      editUrl: '',
      saveUrl: '',
      actionType: 'POST',
      eairWeatherItems: [], // 날씨
      ewtrCleanFacItems: [],
      selectedRow: [],
      displayCreateUser: '',
      authDuringAppr: false, // 결재상태
      collectCheck: false, // 회수상태
      collectUrl: '', // 회수 url
      updateMode: false,
      disabled: false,
      // isSludgeValid: false,
      // isInspectionValid: false,
    };
  },
  computed: {
    btnDelete() {
      return this.editable && this.updateMode && !this.disabled;
    },
    btnPrint() {
      return this.editable && this.updateMode;
    },
    btnAppr() {
      return this.editable && this.updateMode && !this.disabled;
    },
  },
  watch: {
    tabIndex() {
      setTimeout(() => {
        this.loadComponent();
      }, 200);
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
    this.loadComponent();
    // window.getApp.$on(
    //   'sludge-invalid',
    //   function () {
    //     this.isSludgeValid = false;
    //   }.bind(this)
    // );
    // window.getApp.$on(
    //   'sludge-valid',
    //   function () {
    //     this.isSludgeValid = true;
    //   }.bind(this)
    // );
    // window.getApp.$on(
    //   'inspection-invalid',
    //   function () {
    //     this.isInspectionValid = false;
    //   }.bind(this)
    // );
    // window.getApp.$on(
    //   'inspection-valid',
    //   function () {
    //     this.isInspectionValid = true;
    //   }.bind(this)
    // );
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // 날씨
      this.$comm.getComboItems('SAF_WEATHER', false).then((_result) => {
        this.eairWeatherItems = _result;
      });
      this.getCleanItems();
      this.saveUrl =
        transactionConfig.env.water.operationLog.dailyReport.insert.url;
      this.editUrl =
        transactionConfig.env.water.operationLog.dailyReport.edit.url;
      this.detailUrl = selectConfig.env.water.operationLog.dailyReport.get.url;
      this.collectUrl = transactionConfig.manage.appr.collect.url;
      if (
        this.popupParam.measureYmd &&
        this.popupParam.ewtrCleanFacNo > 0 &&
        this.popupParam.deptCd
      ) {
        this.ewtrOpLogResult.measureYmd = this.popupParam.measureYmd;
        this.ewtrOpLogResult.ewtrCleanFacNo = this.popupParam.ewtrCleanFacNo;
        this.ewtrOpLogResult.plantCd = this.popupParam.plantCd;
        this.ewtrOpLogResult.deptCd = this.popupParam.deptCd;

        this.getDetail();
      }
    },

    loadComponent() {
      this.comDischRunTm = () => import(`${'./dischRunTm.vue'}`);
      this.comPreventRunTm = () => import(`${'./preventRunTm.vue'}`);
      this.comSuplChkResult = () => import(`${'./suplChkResult.vue'}`);
      this.comDischChkResult = () => import(`${'./dischChkResult.vue'}`);
      this.comPwrcChkResult = () => import(`${'./pwrcChkResult.vue'}`);
      this.comIngrChkResult = () => import(`${'./ingrChkResult.vue'}`);
      this.comChemChkResult = () => import(`${'./chemChkResult.vue'}`);
      this.comPreventBreakHist = () => import(`${'./preventBreakHist.vue'}`);
      this.comSludgeProcess = () => import(`${'./sludgeProcess.vue'}`);
      this.inspection = () => import(`${'./inspection.vue'}`);
      this.comTestItemResult = () => import(`${'./testItemResult.vue'}`);
    },
    getDetail() {
      this.$http.url = selectConfig.env.water.operationLog.dailyReport.get.url;
      this.$http.param = {
        plantCd: this.ewtrOpLogResult.plantCd,
        measureYmd: this.ewtrOpLogResult.measureYmd,
        ewtrCleanFacNo: this.ewtrOpLogResult.ewtrCleanFacNo,
        deptCd: this.ewtrOpLogResult.deptCd,
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.ewtrOpLogResult = _result.data;

          if (this.ewtrOpLogResult.updateFlag) {
            this.updateMode = true;
            console.log('a');
          } else {
            this.updateMode = false;
            console.log('b');
          }

          if (
            _result.data.bizApprStepCd === 'BAPSA' ||
            _result.data.envOpLogStCd === 'STEP2'
          ) {
            this.disabled = true;
            console.log('c');
          } else {
            this.disabled = false;
            console.log('d');
          }
          if (
            _result.data.deptNm !== null &&
            _result.data.createUserNm !== null
          ) {
            this.displayCreateUser =
              _result.data.deptNm + ' / ' + _result.data.createUserNm;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getApprDetail() {
      if (!this.popupParam.apprRqstNo || this.popupParam.apprRqstNo <= 0) {
        return;
      }
      this.$http.url = this.$format(
        selectConfig.manage.appr.authCheck.url,
        this.popupParam.apprRqstNo,
        this.$store.getters.token
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.authDuringAppr = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // '삭제하시겠습니까?',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            selectConfig.env.water.operationLog.dailyReport.delete.url,
            !this.popupParam.measureYmd
              ? this.ewtrOpLogResult.measureYmd
              : this.popupParam.measureYmd,
            this.popupParam.ewtrCleanFacNo === 0
              ? this.ewtrOpLogResult.ewtrCleanFacNo
              : this.popupParam.ewtrCleanFacNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // '삭제되었습니다.',
                type: 'success',
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
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
    getCleanItems() {
      this.$http.url = selectConfig.env.water.facility.wasteBasicUnit.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.popupParam.plantCd,
        ewtrCleanFacNo: this.popupParam.ewtrCleanFacNo,
        ewtrCleanFacNm: this.popupParam.ewtrCleanFacNm,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewtrCleanFacNo: null,
            ewtrCleanFacNm: this.popupParam.ewtrCleanFacNm,
          });
          this.ewtrCleanFacItems = this.$_.clone(_result.data);
          if (!this.updateMode) {
            this.ewtrOpLogResult.ewtrCleanFacNo = null;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    btnApprClicked() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000767', // '결재요청 하기전 입력된 값을 저장합니다. 진행하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.ewtrOpLogResult.updateUserId = this.$store.getters.token;
          this.ewtrOpLogResult.createUserId = this.$store.getters.token;
          this.$http.url = this.editUrl;
          this.$http.type = 'PUT';
          this.$http.param = this.ewtrOpLogResult;
          this.$http.request(
            (_result) => {
              // 화면닫기
              this.popupOptions.target = () =>
                import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
              this.popupOptions.title = 'L0000003418'; // '결재요청';
              this.popupOptions.visible = true;
              this.popupOptions.closeCallback = this.closeApprPop;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                apprBizCd: 'EN-WT-01',
                apprParams: {
                  ewtrCleanFacNo: this.ewtrOpLogResult.ewtrCleanFacNo,
                  measureYmd: this.ewtrOpLogResult.measureYmd,
                  plantCd: this.ewtrOpLogResult.plantCd,
                  deptCd: this.ewtrOpLogResult.deptCd,
                },
              };
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
    beforeEdit() {
      let flag = '';

      flag = 'update';
      this.actionType = 'PUT';
      this.saveUrl =
        transactionConfig.env.water.operationLog.dailyReport.edit.url;

      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            // if (this.isSludgeValid) {
            //   window.getApp.$emit('ALERT', {
            //     title: 'L0000003395', // '안내',
            //     message: '슬러지 처리시설 정보를 입력해주세요.',
            //     type: 'warning', // success / info / warning / error
            //   });
            //   return;
            // }
            // if (this.isInspectionValid) {
            //   window.getApp.$emit('ALERT', {
            //     title: 'L0000003395', // '안내',
            //     message: '지도점검 사항 정보를 입력해주세요.',
            //     type: 'warning', // success / info / warning / error
            //   });
            //   return;
            // }

            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.ewtrOpLogResult.updateUserId = this.$store.getters.token;
                this.ewtrOpLogResult.createUserId = this.$store.getters.token;

                this.$http.url =
                  selectConfig.env.water.operationLog.dailyReport.check.url;
                this.$http.param = {
                  plantCd: this.ewtrOpLogResult.plantCd,
                  measureYmd: this.ewtrOpLogResult.measureYmd,
                  ewtrCleanFacNo: this.ewtrOpLogResult.ewtrCleanFacNo,
                  ewtrCleanFacNm: this.ewtrOpLogResult.ewtrCleanFacNm,
                  deptCd: this.ewtrOpLogResult.deptCd,
                };
                this.$http.type = 'GET';
                this.$http.request(
                  (_result) => {
                    if (!this.updateMode) {
                      if (_result.data === 0) {
                        this.isEdit = true;
                      } else {
                        window.getApp.$emit('ALERT', {
                          title: 'L0000003395', // '안내',
                          message: 'M0000000072', // '해당 일자의 클린센터는 이미 작성된 일지입니다.',
                          type: 'warning', // success / info / warning / error
                        });
                        this.isNew = false;
                      }
                    } else {
                      this.isEdit = true;
                    }
                  },

                  (_error) => {
                    window.getApp.$emit('APP_REQUEST_ERROR', _error);
                  }
                );
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'wtrOperationLogBase',
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
    },
    /** button 관련 이벤트 **/
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      if (!this.updateMode) {
        this.loadComponent();
      }
      if (!this.isSaveDailyReport) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000006', // '저장되었습니다.',
          type: 'success',
        });
      }
      this.updateMode = true;
      this.getDetail();
    },
    btnClickedErrorCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    printOperationLog() {
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = this.$format(
        selectConfig.env.water.operationLog.print.url,
        this.ewtrOpLogResult.ewtrCleanFacNo,
        this.ewtrOpLogResult.measureYmd,
        this.ewtrOpLogResult.plantCd,
        this.ewtrOpLogResult.deptCd
      ); // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          let fileOrgNm = '수질운영일지_' + this.$comm.getToday() + '.xlsx';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>
