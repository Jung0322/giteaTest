<!--
  목적 : 환경 > 대기 > 운영일지 > 상세 > 배출구별 주요배출시설 가동(조업)시간
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
              <!--  저장 -->
              <y-btn
                v-if="editable && !disabled"
                :action-url="editUrl"
                :param="opLogRslt"
                :is-submit="isUpdateSubmit"
                title="L0000002474"
                color="orange"
                action-type="put"
                beforeSubmit="beforeOperationChk"
                @beforeOperationChk="beforeOperationChk"
                @btnClicked="btnUpdateClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
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
              ></y-plant>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 작성자 -->
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
                label="작성부서"
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
                label="L0000002354"
                name="measureYmd"
                v-model="opLogRslt.measureYmd"
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
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-3">
              <y-data-table
                ref="dataTable"
                label="L0000001115"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :popMode="true"
                :editable="!disabled"
                @inputChange="inputChange"
              ></y-data-table>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 방지시설 운전사항 -->
              <y-data-table
                ref="dataTable"
                label="약품사용량"
                :height="chemGridOptions.height"
                :headers="chemGridOptions.header"
                :items="chemGridOptions.data"
                :span-options="chemGridOptions.merge"
                :editable="!disabled"
                :popMode="true"
              ></y-data-table>
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
  /** attributes: name, components, props, data **/
  name: 'discharg-chk-result-detail',
  props: {
    popupParam: {
      selectedMeasureYmd: null,
      selectedDeptCd: null,
      selectedPlantCd: null,
    },
  },
  data() {
    return {
      opLogRslt: {
        temp: null,
        measureYmd: null,
        deptCd: null,
        apprRqstNo: 0,
        createUserNm: '',
        weather: '',
        plantCd: '',
        preventChkResult: [], // 운전사항
        preventChemResults: [], // 운전사항-약품
      },

      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },
      chemGridOptions: {
        header: [],
        data: [],
        height: '300',
        merge: [],
      },

      isUpdateSubmit: false,
      editUrl: '',
      searchUrl: '',
      disabled: false,
      editable: true,
      eairWeatherItems: [],
    };
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {
      // 날씨 선택항목 설정
      this.$comm.getComboItems('SAF_WEATHER', false).then(_result => {
        this.eairWeatherItems = _result;
      });

      this.editUrl = transactionConfig.env.air.opLog.createOplogResult.edit.url;

      this.initGrid();
    },
    initGrid() {
      this.gridOptions.header = [
        // 배출구
        {
          text: 'L0000001142',
          name: 'mainDischFacNm',
          width: '120px',
          align: 'left',
          sortable: false,
        },
        // 방지시설
        {
          text: 'L0000001107',
          name: 'eairPreventFacNm',
          width: '160px',
          align: 'left',
          sortable: false,
        },
        // 설치위치
        {
          text: 'L0000001626',
          name: 'installPos',
          width: '160px',
          align: 'left',
          sortable: false,
        },
        // 전력량계명
        {
          text: '전력량계명',
          name: 'eairPreventFacElecMeterNm',
          width: '150px',
          align: 'right',
        },
        // 전일지침
        {
          text: '전일지침',
          name: 'prevPwrMeterCnt',
          width: '150px',
          align: 'right',
          sortable: false,
        },
        // 금일지침
        {
          text: 'L0000000762',
          name: 'pwrMeterCnt',
          width: '150px',
          align: 'right',
          type: 'number',
        },
        // 사용량(kW/h)
        {
          text: 'L0000001447',
          name: 'pwrConsumAmt',
          width: '150px',
          align: 'right',
          sortable: false,
        },
        // 처리용량(M3/MIN)
        {
          text: 'L0000002838',
          name: 'dispoCap',
          width: '120px',
          align: 'right',
          sortable: false,
        },
        // 처리오염물질
        {
          text: 'L0000002834',
          name: 'eairPolluNm',
          width: '160px',
          align: 'left',
          sortable: false,
        },
        // 처리농도(ppm/mg/Sm3)
        {
          text: 'L0000002820',
          name: 'dispoConc',
          width: '120px',
          align: 'right',
          sortable: false,
        },
        // 처리효율(%)
        {
          text: 'L0000002841',
          name: 'dispoEff',
          width: '120px',
          align: 'right',
          sortable: false,
        },
      ];

      this.chemGridOptions.merge.push({ index: 1, field: 'eairPreventFacNm' });
      this.chemGridOptions.header = [
        {
          text: '방지시설',
          name: 'eairPreventFacNm',
          width: '150px',
          align: 'left',
          sortable: false,
        },
        {
          text: '약품',
          name: 'eairChemNm',
          width: '120px',
          align: 'left',
          sortable: false,
        },
        {
          text: '단위',
          name: 'envUnitNm',
          width: '80px',
          align: 'left',
          sortable: false,
        },
        {
          text: '사용량',
          name: 'consumAmt',
          width: '100px',
          align: 'left',
          type: 'number',
        },
      ];

      if (
        this.popupParam.selectedMeasureYmd &&
        this.popupParam.selectedDeptCd
      ) {
        this.opLogRslt.measureYmd = this.popupParam.selectedMeasureYmd;
        this.opLogRslt.deptCd = this.popupParam.selectedDeptCd;
        this.opLogRslt.plantCd = this.popupParam.selectedPlantCd;
        this.getBaseDetail();
        this.getList();
        this.getChemList();
      }
    },
    getBaseDetail() {
      this.$http.url = this.$format(
        selectConfig.env.air.opLog.get.url,
        this.opLogRslt.plantCd,
        this.opLogRslt.measureYmd,
        this.opLogRslt.deptCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.opLogRslt = this.$_.clone(_result.data);

          if (
            this.opLogRslt.bizApprStepCd === 'BAPSA' ||
            this.opLogRslt.envOpLogStCd === 'STEP2'
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
    getList() {
      this.$http.url = this.$format(
        selectConfig.env.air.opLog.outletPeventCheck.url,
        this.opLogRslt.plantCd,
        this.opLogRslt.deptCd,
        this.opLogRslt.measureYmd
      );
      this.$http.type = 'GET';

      this.$http.request(
        _result => {
          this.gridOptions.data = _result.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getChemList() {
      this.$http.url = this.$format(
        selectConfig.env.air.opLog.outletPreventChem.url,
        this.opLogRslt.deptCd,
        this.opLogRslt.measureYmd
      );
      this.$http.get = 'GET';
      this.$http.request(
        _result => {
          this.chemGridOptions.data = _result.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    beforeOperationChk() {
      this.beforeEdit();
    },
    beforeEdit() {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장 하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.opLogRslt.updateUserId = this.$store.getters.token;
                this.opLogRslt.createUserId = this.$store.getters.token;
                this.opLogRslt.preventChkResult = this.gridOptions.data;
                this.opLogRslt.preventChemResults = this.chemGridOptions.data;

                this.$_.forEach(this.gridOptions.data, row => {
                  row.createUserId = this.$store.getters.token;
                  row.updateUserId = this.$store.getters.token;
                  row.deptCd = this.popupParam.selectedDeptCd;
                });
                this.isUpdateSubmit = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },

    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      this.getList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    inputChange(data) {
      data.row.pwrConsumAmt = data.row.pwrMeterCnt - data.row.prevPwrMeterCnt;
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
  },
};
</script>
