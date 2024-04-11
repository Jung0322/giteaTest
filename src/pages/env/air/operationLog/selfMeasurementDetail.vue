<!--
  목적 : 환경 > 대기 > 자가측정 상세조회
  작성자 : kyk
  Detail : 자가측정 등록,수정 화면 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 자가측정 정보 -->
            <y-label
              label="L0000002301"
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
              <!-- 저장 -->
              <y-btn
                v-if="btnSave"
                :action-url="saveUrl"
                :param="selfMeasure"
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
                v-if="btnDelete"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClickedCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
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
                :disabled="updateMode"
                name="plantCd"
                v-model="selfMeasure.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관리부서 -->
              <y-tree-dept
                label="L0000000591"
                :required="true"
                name="deptCd"
                v-model="selfMeasure.deptCd"
                :plantCd="selfMeasure.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출구 -->
              <y-select
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                :comboItems="searchEairOutletNoItems"
                itemText="outletNm"
                itemValue="eairOutletNo"
                ui="bootstrap"
                name="eairOutletNo"
                label="L0000001142"
                v-model="selfMeasure.eairOutletNo"
                @datachange="
                  (val) => {
                    (selfMeasure.eairOutletNo = val), getList();
                  }
                "
                v-validate="'required'"
                :state="validateState('eairOutletNo')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 측정일자 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="disabled"
                type="measureYmd"
                label="L0000002953"
                name="measureYmd"
                :default="selfMeasure.measureYmd"
                :end="$comm.getToday()"
                v-model="selfMeasure.measureYmd"
                :required="true"
                v-validate="'required'"
                :state="validateState('measureYmd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 날씨 -->
              <y-select
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                :comboItems="eairWeatherItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="eairWeather"
                label="L0000000803"
                v-model="selfMeasure.weatherCd"
                v-validate="'required'"
                :state="validateState('weatherCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 온도(℃) -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="5"
                :hasSeperator="false"
                ui="bootstrap"
                label="L0000002029"
                name="temp"
                v-model="selfMeasure.temp"
                :required="true"
                v-validate="'required'"
                :state="validateState('temp')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 습도(%) -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000001730"
                name="hum"
                v-model="selfMeasure.hum"
                :required="true"
                v-validate="'required'"
                :state="validateState('hum')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 기압(mb) -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000000780"
                name="airPress"
                v-model="selfMeasure.airPress"
                :required="true"
                v-validate="'required'"
                :state="validateState('airPress')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 풍향(풍) -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="10"
                ui="bootstrap"
                name="windDir"
                label="L0000003156"
                v-model="selfMeasure.windDir"
                :required="true"
                v-validate="'required'"
                :state="validateState('windDir')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 환경기술인 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="15"
                ui="bootstrap"
                name="envEngrNm"
                label="L0000003326"
                v-model="selfMeasure.envEngrNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 풍속(m/sec) -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000003155"
                name="windSpeed"
                v-model="selfMeasure.windSpeed"
                :required="true"
                v-validate="'required'"
                :state="validateState('windSpeed')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 가스속도(m/s) -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000000212"
                name="gasSpeed"
                v-model="selfMeasure.gasSpeed"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 가스온도(℃) -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="5"
                :hasSeperator="false"
                ui="bootstrap"
                label="L0000000213"
                name="gasTemp"
                v-model="selfMeasure.gasTemp"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 수분함량(%) -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000001685"
                name="wtrPer"
                v-model="selfMeasure.wtrPer"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 실측산소농도(%) -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000001813"
                name="realO2Val"
                v-model="selfMeasure.realO2Val"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 표준산소농도(%) -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000003152"
                name="stndO2Val"
                v-model="selfMeasure.stndO2Val"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 유량(S㎥/일) -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="10"
                :hasSeperator="false"
                ui="bootstrap"
                label="L0000002156"
                name="flowPerDay"
                v-model="selfMeasure.flowDay"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 자가측정방법 -->
              <y-select
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :comboItems="eairSelfTestMtdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="methodCd"
                label="L0000002302"
                v-model="selfMeasure.methodCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('methodCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 과학원산정유량 -->
              <y-number
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="10"
                :hasSeperator="false"
                ui="bootstrap"
                label="L0000000563"
                name="scFlow"
                v-model="selfMeasure.scFlow"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 환경기술인의견 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="150"
                ui="bootstrap"
                name="envEngrOpn"
                label="L0000003327"
                v-model="selfMeasure.envEngrOpn"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 기타 -->
              <y-text
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000794"
                name="remark"
                v-model="selfMeasure.remark"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 연료명 및 사용량 -->
              <y-text
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002001"
                name="fuelNmResult"
                v-model="selfMeasure.fuelNmResult"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 원료명 및 사용량 -->
              <y-text
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002089"
                name="ingrNmResult"
                v-model="selfMeasure.ingrNmResult"
              />
            </b-col>
          </b-row>
          <!--<b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              -- 배출구별 검사결과 --
              <y-data-table
                class="self-measurement-detail-newline"
                v-model="selectedValue"
                label="L0000001148"
                ref="dataTable"
                :editable="editable && !disabled"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :popMode="true"
              ></y-data-table>
            </b-col>
          </b-row>-->

          <b-row class="grid-height grid-box">
            <b-col sm="12" class="h100p">
              <y-auigrid
                ref="yAuiGrid"
                :editable="!disabled && editable"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000001148')"
                :useExcelExport="false"
                :enableSorting="true"
                :showGridSetSave="true"
              />
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
  name: 'self-measurement-detail',
  components: {},
  props: {
    popupParam: {
      type: Object,
      default: {
        eairOpMeasNo: 0,
        plantCd: '',
      },
    },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니며, this.myProp는 정의되지 않습니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      selfMeasure: {
        eairOpMeasNo: '',
        deptCd: '',
        eairOutletNo: null,

        createUserId: '',
        updateUserId: '',
        measureYmd: null,
        weatherCd: null,
        temp: null,
        hum: null,
        airPress: null,
        windDir: null,
        envEngrNm: null,
        windSpeed: null,
        envEngrOpn: null,
        remark: null,
        gasSpeed: null,
        gasTemp: null,
        wtrPer: null,
        realO2Val: null,
        stndO2Val: null,
        flowDay: null,
        fuelNmResult: null,
        ingrNmResult: null,
        methodCd: null,
        scFlow: null,
        plantCd: null,
        selfMeasurementResult: [],
        apprRqstNo: 0,
      },
      gridOptions: {
        name: 'selfMeasurementDetail',
        header: [],
        data: [],
        height: '300',
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
      editable: false,
      updateMode: false,
      disabled: false,
      isSave: false,
      isUpdate: false,
      selectedValue: [],
      searchDetailUrl: '',
      searchOriginUrl: '',
      searchUrl: '',
      checkUrl: '',
      insertUrl: '',
      editUrl: '',
      saveUrl: '',
      updateUrl: '',
      isInsert: false,
      isEdit: false,
      actionType: 'POST',
      paneName: '',
      genderItems: [],
      deleteUrl: '',
      deleteValue: null,
      initMode: false,
      isDelete: false,
      eairWeatherItems: [], // 날씨
      searchEairOutletNoItems: [], // 배출구
      eairSelfTestMtdItems: [], // 자가측정방법
      eairInstCdItems: [], // 검사기기
      eairTestMtdCdItems: [], // 검사방법
      gridListUrl: '',
      apprParamUrl: '',
      YAuiGrid: null,
    };
  },
  computed: {
    btnSave() {
      return this.editable && !this.disabled;
    },
    btnDelete() {
      return this.editable && this.selfMeasure.eairOpMeasNo && !this.disabled;
    },
    btnAppr() {
      return this.editable && this.selfMeasure.eairOpMeasNo && !this.disabled;
    },
  },
  watch: {
    'selfMeasure.plantCd': function (newValue, oldValue) {
      if (this.selfMeasure.plantCd && this.selfMeasure.deptCd) {
        // 배출구
        this.getEairOutletNoItems();
      }
    },
    'selfMeasure.deptCd': function (newValue, oldValue) {
      if (this.selfMeasure.plantCd && this.selfMeasure.deptCd) {
        // 배출구
        this.getEairOutletNoItems();
      }
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.mountInit();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.apprParamUrl = transactionConfig.manage.appr.editParam.url;
      this.saveUrl =
        transactionConfig.env.air.facility.selfMeasurement.insert.url;
      this.updateUrl =
        transactionConfig.env.air.facility.selfMeasurement.edit.url;
      this.deleteUrl =
        transactionConfig.env.air.facility.selfMeasurement.delete.url;
      this.gridListUrl = selectConfig.env.air.baseInfo.outletN.get.url;
      this.searchUrl = selectConfig.env.air.facility.selfMeasurement.get.url;
      this.checkUrl = selectConfig.env.air.facility.selfMeasurement.check.url;

      // 배출구
      if (this.popupParam.plantCd) {
        this.selfMeasure.plantCd = this.popupParam.plantCd;
      }

      if (this.popupParam.eairOpMeasNo > 0) {
        this.selfMeasure.eairOpMeasNo = this.popupParam.eairOpMeasNo;

        this.updateMode = true;
        this.getDetail();
      } else {
        this.selfMeasure.plantCd = this.$store.getters.plantCd;
        this.updateMode = false;
      }
    },
    mountInit() {
      const promise1 =
        // 자가측정방법
        this.$comm
          .getComboItems('EAIR_SELF_TEST_MTD', false)
          .then((_result) => {
            this.eairSelfTestMtdItems = _result;
          });
      // 날씨
      this.$comm.getComboItems('SAF_WEATHER', false).then((_result) => {
        this.eairWeatherItems = _result;
      });
      this.$comm.getComboItems('EAIR_INST', false).then((_result) => {
        // 검사기기
        this.eairInstCdItems = _result;
        this.$comm.getComboItems('EAIR_TEST_MTD', false).then((_result) => {
          // 검사방법
          this.eairTestMtdCdItems = _result;
        });
      });

      Promise.all([promise1]).then(() => {
        this.setGridHeader().then(() => {
          if (this.popupParam.eairOpMeasNo > 0) {
            this.getDetail(); // 코드 정보 db 조회
          }
        });
      });
    },

    setGridHeader() {
      let dischAmtCalcFactorStr =
        this.$comm.getLangSpecInfoLabel('L0000004408');
      dischAmtCalcFactorStr = dischAmtCalcFactorStr.split('\\n').join('\n');

      let limitPerDayStr = this.$comm.getLangSpecInfoLabel('L0000004409');
      limitPerDayStr = limitPerDayStr.split('\\n').join('\n');

      return new Promise((resolve) => {
        // 그리드 헤더 설정
        this.gridOptions.header = [
          // 검사항목
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000319'),
            dataField: 'eairTestItemNm',
            width: '150',
            style: 'center-align',
            editable: false,
          },
          // 단위
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
            dataField: 'envUnitNm',
            width: '100',
          },
          // 배출량\n계산팩터
          {
            headerText: dischAmtCalcFactorStr,
            dataField: 'dischAmtCalcFactor',
            width: '100',
            style: 'center-align',
            editable: false,
          },
          // 법적기준
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001212'),
            dataField: 'legalLimit',
            width: '100',
            style: 'center-align',
            editable: false,
          },
          // 자체기준
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002336'),
            dataField: 'selfLimit',
            width: '100',
            style: 'center-align',
            editable: false,
          },
          // 일일배출량기준\n(kg/day)
          {
            headerText: limitPerDayStr,
            dataField: 'limitPerDay',
            width: '100',
            style: 'center-align',
            editable: false,
          },
          // 측정농도
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002932'),
            dataField: 'numResult',
            width: '100',
            dataType: 'numeric',
            formatString: '#,###.#',
            editRenderer: {
              type: 'InputEditRenderer',
              onlyNumeric: true,
              maxlength: 10,
              autoThousandSeparator: true,
            },
          },
          // 일일배출량(kg/day)
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002270'),
            dataField: 'dischAmtPerDay',
            width: '170',
            dataType: 'numeric',
            formatString: '#,###.#',
            style: 'center-align',
            editRenderer: {
              type: 'InputEditRenderer',
              onlyNumeric: true,
              maxlength: 13,
              autoThousandSeparator: true,
            },
          },
          // 검사기기
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000309'),
            dataField: 'eairInstCd',
            width: '160',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.eairInstCdItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
            },
          },
          // 검사방법
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000311'),
            dataField: 'eairTestMtdCd',
            width: '160',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.eairTestMtdCdItems;
              },
              keyField: 'code', // key 에 해당되는 필드명
              valueField: 'codeNm', // value 에 해당되는 필드명
            },
          },
        ];
        resolve();
      });
    },

    overLimitPerDay() {
      let result = this.gridOptions.data.filter(
        (row) => Number(row.limitPerDay) < Number(row.dischAmtPerDay)
      );
      return result.length > 0;
    },
    getEairOutletNoItems() {
      this.$http.url = selectConfig.env.air.baseInfo.outletN.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        // useYn: 'Y',
        plantCd: this.selfMeasure.plantCd,
        mgDeptCd: this.selfMeasure.deptCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            eairOutletNo: null,
            outletNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // '선택하세요',
          });
          this.searchEairOutletNoItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      if (!this.selfMeasure.eairOutletNo) return;
      this.$http.url = this.$format(
        selectConfig.env.air.baseInfo.outletN.get.url,
        this.selfMeasure.eairOutletNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data.eairTestItemCds;
          this.selfMeasure.deptCd = _result.data.mgDeptCd;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.selfMeasure.eairOpMeasNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.selfMeasure = _result.data;
          // this.gridOptions.data = _result.data.selfMeasurementResult;
          this.YAuiGrid.setGridData(
            this.$_.clone(_result.data.selfMeasurementResult)
          );

          if (
            this.selfMeasure.stepCd === 'STEP2' ||
            this.selfMeasure.bizApprStepCd === 'BAPSA'
          ) {
            this.disabled = true;
          }
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
    beforeSave() {
      let flag = '';
      if (this.selfMeasure.eairOpMeasNo) {
        // 수정
        flag = 'update';
        this.actionType = 'PUT';
        this.saveUrl =
          transactionConfig.env.air.facility.selfMeasurement.edit.url;
      } else {
        // 신규등록
        flag = 'insert';
        this.actionType = 'POST';
        this.saveUrl =
          transactionConfig.env.air.facility.selfMeasurement.insert.url;
      }
      this.check(flag);
    },
    check(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              eairOpMeasNo:
                flag === 'insert' ? 0 : this.selfMeasure.eairOpMeasNo,
              eairOutletNo: this.selfMeasure.eairOutletNo,
              plantCd: this.selfMeasure.plantCd,
              measureYmd: this.selfMeasure.measureYmd,
            };
            this.$http.request(
              (_result) => {
                if (_result.data > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000079', // '해당 측정일자에 이미 등록된 배출구 자가측정이 있습니다.',
                    type: 'warning',
                  });
                  return;
                } else {
                  if (this.overLimitPerDay()) {
                    window.getApp.$emit('CONFIRM', {
                      title: 'L0000003321', // '확인',
                      message: 'M0000001046', // 일일 배출량이 기준치를 초과하였습니다. 저장하시겠습니까?
                      type: 'info',
                      confirmCallback: () => {
                        if (flag === 'insert') {
                          this.selfMeasure.createUserId =
                            this.$store.getters.token;
                        } else {
                          this.selfMeasure.updateUserId =
                            this.$store.getters.token;
                        }
                        this.selfMeasure.selfMeasurementResult =
                          this.gridOptions.data;
                        this.isSave = true;
                      },
                    });
                    return;
                  }
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // '저장하시겠습니까?',
                    type: 'info',
                    confirmCallback: () => {
                      if (flag === 'insert') {
                        this.selfMeasure.createUserId =
                          this.$store.getters.token;
                      } else {
                        this.selfMeasure.updateUserId =
                          this.$store.getters.token;
                      }
                      this.selfMeasure.selfMeasurementResult =
                        this.gridOptions.data;
                      this.isSave = true;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else if (!_result) {
            this.$popupRequired.check(
              'selfMeasurementDetail',
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
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.isSave = false;
      this.selfMeasure.eairOpMeasNo = _result.data;
      this.updateMode = true;
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    beforeDelete() {},
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // '삭제하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.selfMeasure.eairOpMeasNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // '삭제되었습니다.',
                type: 'success',
              });
              this.closePopup(_result);
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    btnApprClicked() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; // '결재요청';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'EN-AR-02',
        apprParams: {
          eairOpMeasNo: this.selfMeasure.eairOpMeasNo,
        },
      };
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
    },
  },
};
</script>
<style>
.self-measurement-detail-newline
  .el-table
  .el-table__header-wrapper
  .default-td
  .cell {
  white-space: pre;
}
</style>
