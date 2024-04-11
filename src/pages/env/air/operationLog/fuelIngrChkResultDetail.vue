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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 연료 -->
              <y-data-table
                ref="dataTable"
                label="L0000002002"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :span-options="gridOptions.merge"
                :popMode="true"
                :useRownum="false"
                :editable="!disabled"
              ></y-data-table>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 원료 -->
              <y-data-table
                ref="dataTable"
                label="L0000002090"
                :height="ingrGridOptions.height"
                :headers="ingrGridOptions.header"
                :items="ingrGridOptions.data"
                :popMode="true"
                :useRownum="false"
                :editable="!disabled"
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
        fuelCheckResult: [], // 연료 사용량
        ingrCheckResult: [], // 원료 사용량
      },

      gridOptions: {
        header: [],
        data: [],
        height: '300',
        merge: [],
      },
      ingrGridOptions: {
        header: [],
        data: [],
        height: '300',
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
      this.$comm.getComboItems('SAF_WEATHER', false).then((_result) => {
        this.eairWeatherItems = _result;
      });

      this.editUrl = transactionConfig.env.air.opLog.createOplogResult.edit.url;

      this.initGrid();
    },
    initGrid() {
      this.gridOptions.merge.push({ index: 1, field: 'eairDischFacNm' });

      this.gridOptions.header = [
        // 배출시설명
        {
          text: 'L0000001174',
          name: 'eairDischFacNm',
          width: '160px',
          align: 'center',
          sortable: false,
        },
        // 연료명
        {
          text: 'L0000002000',
          name: 'eairFuelNm',
          width: '160px',
          align: 'center',
          sortable: false,
        },
        // 사용량
        {
          text: 'L0000001445',
          name: 'numResult',
          width: '120px',
          align: 'center',
          type: 'number',
          pointNumber: 3,
          maxlength: 10,
          hasSeperator: true,
          sortable: false,
        },
        // 단위
        {
          text: 'L0000000870',
          name: 'envUnitNm',
          width: '120px',
          align: 'center',
          sortable: false,
        },
      ];

      this.ingrGridOptions.header = [
        // 원료명
        {
          text: 'L0000002088',
          name: 'eairIngrNm',
          width: '160px',
          align: 'center',
          sortable: false,
        },
        // 사용량
        {
          text: 'L0000001445',
          name: 'numResult',
          width: '120px',
          align: 'center',
          type: 'number',
          pointNumber: 3,
          hasSeperator: true,
          sortable: false,
        },
        // 단위
        {
          text: 'L0000000870',
          name: 'envUnitNm',
          width: '120px',
          align: 'center',
          sortable: false,
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
        this.getIngrList();
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
        (_result) => {
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
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      this.$http.url = this.$format(
        selectConfig.env.air.opLog.dischFuelResult.url,
        this.opLogRslt.deptCd,
        this.opLogRslt.measureYmd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getIngrList() {
      this.$http.url = this.$format(
        selectConfig.env.air.opLog.getIngrChkResult.url,
        this.opLogRslt.deptCd,
        this.opLogRslt.measureYmd,
        this.opLogRslt.plantCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.ingrGridOptions.data = _result.data;
        },
        (_error) => {
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
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장 하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.opLogRslt.updateUserId = this.$store.getters.token;
                this.opLogRslt.createUserId = this.$store.getters.token;
                this.opLogRslt.fuelCheckResult = this.gridOptions.data;
                this.opLogRslt.ingrCheckResult = this.ingrGridOptions.data;

                this.$_.forEach(this.gridOptions.data, (row) => {
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
    closePopup() {
      this.$emit('closePopup', {});
    },
  },
};
</script>
