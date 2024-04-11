<!--
  목적 : 안전점검 - 안전 점검 종류
  Detail : 안전 점검 종류 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 연도별 TMS 측정소항목 허용기준 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001992')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="false"
          @selectedRow="selectedRow"
        />
      </b-col>
    </b-row>
    <!-- 등록 -->
    <b-row ref="editBox" class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- TMS 측정소별 항목 상세 -->
            <y-label label="L0000000177" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="tmsStationItemStd.stationItemCode && editable"
                :action-url="saveUrl"
                :param="tmsStationItemStd"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                action-type="POST"
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
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 년도 -->
                  <y-label label="L0000000829" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <!-- 년 -->
                  <y-label
                    :label="tmsStationItemStd.dataYear ? tmsStationItemStd.dataYear + '년' : ''"
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 구분 -->
                  <y-label label="L0000000686" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="tmsStationItemStd.tmsTypeNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 사업장 -->
                  <y-label label="L0000001415" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="tmsStationItemStd.plantNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 측정소 -->
                  <y-label label="L0000002935" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="tmsStationItemStd.stationName" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 측정소코드 -->
                  <y-label label="L0000002938" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="tmsStationItemStd.stationCode" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 측정항목 -->
                  <y-label label="L0000002963" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="tmsStationItemStd.itemName" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 항목코드 -->
                  <y-label label="L0000003212" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="tmsStationItemStd.itemCode" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 측정소항목코드 -->
                  <y-label label="L0000002940" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="tmsStationItemStd.stationItemCode" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 배출시설 -->
                  <y-label label="L0000001167" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="tmsStationItemStd.facilityNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 배출구 -->
                  <y-label label="L0000001142" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="tmsStationItemStd.outletNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 단위 -->
                  <y-label label="L0000000870" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="tmsStationItemStd.sunit" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 측정최대 -->
                  <y-label label="L0000002961" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="tmsStationItemStd.limMax" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 법적기준 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="6"
                :hasSeperator="true"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000001212"
                name="lawMax"
                v-model="tmsStationItemStd.lawMax"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사내기준 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="6"
                :hasSeperator="true"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000001409"
                name="limMax"
                v-model="tmsStationItemStd.wrnMax"
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
  name: 'y-tms-station-item-std-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        stationItemCode: '',
      },
    },
  },
  data: () => ({
    tmsStationItemStd: {
      dataYear: '',
      plantNm: '',
      stationItemCode: '',
      stationCode: null,
      stationName: '',
      itemCode: null,
      itemName: '',
      facilityNm: '',
      outletNm: '',
      tmsTypeNm: '',
      sunit: '',
      limMax: '',
      lawMax: '',
      wrnMax: '',
      operMax: '',
      createUserId: '',
      updateUserId: '',
    },
    gridOptions: {
      name: 'tmsStationItemStdDetail',
      header: [],
      data: [],
      btns: [],
      height: 300,
    },
    editable: false,
    isSave: false,
    searchDetailUrl: '',
    saveUrl: '',
    checkUrl: '',
    YAuiGrid: null,
  }),
  watch: {},
  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getDetail();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting

      this.searchDetailUrl =
        selectConfig.env.tms.baseInfo.tmsStationItemStd.get.url;
      this.saveUrl =
        transactionConfig.env.tms.baseInfo.tmsStationItemStd.insert.url;

      this.gridOptions.header = [
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), dataField: 'plantNm', width: '110', style: 'center-align', }, /* 사업장 */
        { /* 배출시설 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001167'),
          dataField: 'facilityNm',
          width: '130',
          style: 'center-align',
        },
        { /* 배출구명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001147'),
          dataField: 'outletNm',
          width: '150',
          style: 'left-align',
        },
        { /* 측정소코드 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002938'),
          dataField: 'stationCode',
          width: '130',
          style: 'center-align',
        },
        { /* 측정소명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000002937'),
          dataField: 'stationName',
          width: '150',
          style: 'left-align',
        },
        { /* 항목코드 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003212'),
          dataField: 'itemCode',
          width: '130',
          style: 'center-align',
        },
        { /* 항목명 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000003205'),
          dataField: 'itemName',
          width: '150',
          style: 'left-align',
        },
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), dataField: 'tmsTypeNm', width: '120', style: 'center-align', }, /* 구분 */
        { headerText: this.$comm.getLangSpecInfoLabel('L0000000829'), dataField: 'dataYear', width: '120', style: 'center-align', }, /* 년도 */
        { headerText: this.$comm.getLangSpecInfoLabel('L0000002961'), dataField: 'limMax', width: '130', style: 'right-align', }, /* 측정최대 */
        { headerText: this.$comm.getLangSpecInfoLabel('L0000001212'), dataField: 'lawMax', width: '130', style: 'right-align', }, /* 법적기준 */
        { /* 사내기준 */
          headerText: this.$comm.getLangSpecInfoLabel('L0000001409'),
          dataField: 'wrnMax',
          width: '130',
          style: 'right-align',
        },
      ];

      this.getDetail(); // TMS 측정소별 항목 상세조회
    },
    getDetail(year) {
      let param = {
        stationItemCode: this.popupParam.stationItemCode,
      };
      if (year) {
        param.dataYear = year;
      }
      this.$http.url = this.searchDetailUrl;
      this.$http.type = 'GET';
      this.$http.param = param;
      this.$http.request(
        (_result) => {
          if (year) {
            this.$_.extend(this.tmsStationItemStd, _result.data[0]);
          } else {
            this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 그리드 row click 이벤트
    selectedRow(data) {
      this.getDetail(data.dataYear);
    },
    beforeSave() {
      this.checkValidator();
    },
    checkValidator() {
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
                this.tmsStationItemStd.createUserId = this.$store.getters.token;
                this.tmsStationItemStd.updateUserId = this.$store.getters.token;
                // if (!this.tmsStationItemStd.lawMax) {
                //   this.tmsStationItemStd.lawMax = '';
                // }
                // if (!this.tmsStationItemStd.wrnMax) {
                //   this.tmsStationItemStd.wrnMax = '';
                // }
                // if (!this.tmsStationItemStd.operMax) {
                //   this.tmsStationItemStd.operMax = '';
                // }
                this.isSave = true;
              },
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
          if (!this.isSave) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
            );
          }
        });
    },
    btnSaveClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isSave = false;
      this.getDetail();
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