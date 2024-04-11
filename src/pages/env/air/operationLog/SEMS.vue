<!--
  목적 : 대기 > 운영관리 > SEMS 데이터 등록 
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <y-plant
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 작업기간 -->
          <y-datepicker
            :width="8"
            v-if="!isStatus"
            :range="true"
            :required="true"
            label="L0000002373"
            type="month"
            name="period"
            :clearable="false"
            v-validate="'required'"
            :state="validateState('period')"
            default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
          <!-- 연도 -->
          <y-datepicker
            v-if="isStatus"
            :width="8"
            :required="true"
            type="year"
            label="L0000001991"
            name="period"
            :clearable="false"
            v-validate="'required'"
            :state="validateState('period')"
            v-model="searchParam.period"
            :default="searchParam.period"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- SEMS 양식종류 -->
          <y-select
            :width="8"
            :required="true"
            :comboItems="eairSemsRptTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000160"
            name="eairSemsRptTypeCd"
            v-validate="'required'"
            :state="validateState('eairSemsRptTypeCd')"
            v-model="searchParam.eairSemsRptTypeCd"
            @datachange="
              (val) => {
                (searchParam.eairSemsRptTypeCd = val), getDataList();
              }
            "
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001147"
            name="mainDischFacNm"
            v-model="searchParam.mainDischFacNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!--<b-row class="mt-3">
      <b-col sm="12">
        <div class="float-right mb-1">
          <y-btn
            :title="excelDownNm"
            @btnClicked="excelDown(searchParam.eairSemsRptTypeCd)"
          />
          -- 검색 --
          <y-btn title="L0000000327" color="green" @btnClicked="getDataList" />
        </div>
        -- SEMS 데이터현황 --
        <y-data-table
          ref="dataTable"
          label="L0000000159"
          :height="gridOptions.height"
          :headers="gridOptions.header"
          :items="gridOptions.data"
          :useRownum="false"
          :excelIcon="false"
        ></y-data-table>
      </b-col>
    </b-row>-->

    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          v-if="this.searchParam.eairSemsRptTypeCd === 'ESRT1'"
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000159')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @btnExcelClickedCallback="btnExcelClickedCallback"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
      <b-col sm="12" class="h100p">
        <y-auigrid
          v-if="this.searchParam.eairSemsRptTypeCd === 'ESRT2'"
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000159')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @btnExcelClickedCallback="btnExcelClickedCallback"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
      <b-col sm="12" class="h100p">
        <y-auigrid
          v-if="this.searchParam.eairSemsRptTypeCd === 'ESRT3'"
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000159')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @btnExcelClickedCallback="btnExcelClickedCallback"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
      <b-col sm="12" class="h100p">
        <y-auigrid
          v-if="this.searchParam.eairSemsRptTypeCd === 'ESRT4'"
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000159')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @btnExcelClickedCallback="btnExcelClickedCallback"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
      <b-col sm="12" class="h100p">
        <y-auigrid
          v-if="this.searchParam.eairSemsRptTypeCd === 'ESRT5'"
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000159')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @btnExcelClickedCallback="btnExcelClickedCallback"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
      <b-col sm="12" class="h100p">
        <y-auigrid
          v-if="this.searchParam.eairSemsRptTypeCd === 'ESRT6'"
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000159')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @btnExcelClickedCallback="btnExcelClickedCallback"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'sems',
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '', // 사업장코드
        period: [], // 작업기간
        eairSemsRptTypeCd: 'ESRT1',
      },
      gridOptions: {
        name: 'sems',
        header: [],
        data: [],
        btns: [],
        height: '450',
        title: ' ',
      },
      excelDownNm: '',
      eairSemsRptTypeItems: [], // SEMS 양식종류
      isStatus: false,
      searchUrl: '',
      excelDownUrl: '',
      YAuiGrid: null,
    };
  },
  watch: {
    'searchParam.eairSemsRptTypeCd'() {
      if (
        this.searchParam.eairSemsRptTypeCd === 'ESRT5' ||
        this.searchParam.eairSemsRptTypeCd === 'ESRT6'
      ) {
        this.searchParam.period = [];
        this.searchParam.period = this.$comm.getThisYear();
        this.isStatus = true;
      } else {
        this.isStatus = false;
        this.searchParam.period = [];

        this.searchParam.period.push(this.$comm.today.getFullYear() + '-01');
        this.searchParam.period.push(this.$comm.today.getFullYear() + '-12');
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getDataList();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.searchParam.period.push(this.$comm.getFirstDayThisYear());
      this.searchParam.period.push(this.$comm.getLastDayThisYear());

      this.searchUrl = selectConfig.env.air.opLog.sems.list.url;
      this.excelDownUrl = selectConfig.env.air.opLog.sems.excelDown.url;

      // SEMS 양식종류
      this.$comm.getComboItems('EAIR_SEMS_RPT_TYPE').then((_result) => {
        this.eairSemsRptTypeItems = _result;
      });

      this.setGridSetting();

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getDataList();
    },
    excelDown(flag) {
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = this.excelDownUrl; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          var fileOrgNm = null;
          if (flag === 'ESRT1') {
            fileOrgNm =
              'SEMS_가동시간_' +
              this.$comm.moment().format('YYYYMMDD') +
              '.xls';
          } else if (flag === 'ESRT2') {
            fileOrgNm =
              'SEMS_시설운전사항_' +
              this.$comm.moment().format('YYYYMMDD') +
              '.xls';
          } else if (flag === 'ESRT3') {
            fileOrgNm =
              'SEMS_보수사항_' +
              this.$comm.moment().format('YYYYMMDD') +
              '.xls';
          } else if (flag === 'ESRT4') {
            fileOrgNm =
              'SEMS_자가측정사항_' +
              this.$comm.moment().format('YYYYMMDD') +
              '.xls';
          } else if (flag === 'ESRT5') {
            fileOrgNm =
              'SEMS_연료사용량_' +
              this.$comm.moment().format('YYYYMMDD') +
              '.xls';
          } else if (flag === 'ESRT6') {
            fileOrgNm =
              'SEMS_원료사용량_' +
              this.$comm.moment().format('YYYYMMDD') +
              '.xls';
          }
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
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    getDataList() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (!this.searchParam.period[0] || !this.searchParam.period[1]) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000239', // '작업기간을 입력하세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (this.searchParam.eairSemsRptTypeCd === 'ESRT1') {
              // 가동시간
              this.setGridSetting();
              this.getRptA();
              this.getList();
            } else if (this.searchParam.eairSemsRptTypeCd === 'ESRT2') {
              // 시설운전사항
              this.setGridSetting();
              this.getRptB();
              this.getList();
            } else if (this.searchParam.eairSemsRptTypeCd === 'ESRT3') {
              // 보수사항
              this.setGridSetting();
              this.getRptC();
              this.getList();
            } else if (this.searchParam.eairSemsRptTypeCd === 'ESRT4') {
              // 자가측정사항
              this.setGridSetting();
              this.getRptD();
              this.getList();
            } else if (this.searchParam.eairSemsRptTypeCd === 'ESRT5') {
              // 연료사용량
              this.setGridSetting();
              this.getRptF();
              this.getList();
            } else if (this.searchParam.eairSemsRptTypeCd === 'ESRT6') {
              // 원료사용량
              this.setGridSetting();
              this.getRptG();
              this.getList();
            }
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          this.isDailyUpdateSubmit = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getRptA() {
      this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000000191'); // '가동시간';
      // this.excelDownNm = this.$comm.getLangSpecInfoLabel('L0000000195'); // '가동시간 엑셀다운로드';

      this.gridOptions.header = [
        // 일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002272'),
          dataField: 'measure_ymd',
          width: '14%',
          style: 'center-align',
        },
        // 허가증상배출구번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003235'),
          dataField: 'eair_outlet_permit_no',
          width: '15%',
          style: 'center-align',
        },
        // 배출구일련번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001150'),
          dataField: 'eair_outlet_nm',
          width: '14%',
          style: 'center-align',
        },
        // 배출구명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001147'),
          dataField: 'main_disch_fac_nm',
          width: '15%',
          style: 'left-align',
        },
        // 가동시간ㅣ시간
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000193'),
          dataField: 'run_tm',
          width: '14%',
          style: 'center-align',
        },
        // 가동시간ㅣ분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000192'),
          dataField: 'run_min',
          width: '14%',
          style: 'center-align',
        },
        // 비고
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '14%',
          style: 'center-align',
        },
      ];
    },
    getRptB() {
      this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000003486'); //  '시설운전사항';
      // this.excelDownNm = this.$comm.getLangSpecInfoLabel('L0000003487'); //  '시설운전사항 엑셀다운로드';

      this.gridOptions.header = [
        // 일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002272'),
          dataField: 'measure_ymd',
          width: '110',
          style: 'center-align',
        },
        // 배출구일련번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001150'),
          dataField: 'eair_outlet_nm',
          width: '150',
          style: 'center-align',
        },
        // 허가증상배출구번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003235'),
          dataField: 'eair_outlet_permit_no',
          width: '200',
          style: 'center-align',
        },
        // 배출구명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001147'),
          dataField: 'main_disch_fac_nm',
          width: '150',
          style: 'left-align',
        },
        // 방지시설일련번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001119'),
          dataField: 'eair_prevent_fac_num',
          width: '150',
          style: 'center-align',
        },
        // 사내고유방지시설번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003497'),
          dataField: 'eair_prevent_fac_inh_num',
          width: '200',
          style: 'center-align',
        },
        // 방지시설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001117'),
          dataField: 'eair_prevent_fac_nm',
          width: '150',
          style: 'center-align',
        },
        // 전력계부착여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003498'),
          dataField: 'elec_yn',
          width: '140',
          style: 'right-align',
        },
        // 적산전력계번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003499'),
          dataField: 'eair_prevent_fac_elec_meter_no',
          width: '140',
          style: 'right-align',
        },
        // 전력계배율
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002504'),
          dataField: 'pwr_meter_magn',
          width: '120',
          style: 'right-align',
        },
        // 전력 검침량(kWh)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003500'),
          dataField: 'pwr_meter_cnt',
          width: '150',
          style: 'right-align',
        },
        // 약품명1
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003501'),
          dataField: 'eair_chem_nm',
          width: '120',
          style: 'center-align',
        },
        // 사용량1
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001450'),
          dataField: 'consum_amt1',
          width: '120',
          style: 'center-align',
        },
        // 단위1
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003502'),
          dataField: 'unit_cd1',
          width: '120',
          style: 'center-align',
        },
        // 약품명2
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003503'),
          dataField: 'eair_chem_nm2',
          width: '120',
          style: 'center-align',
        },
        // 사용량2
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003504'),
          dataField: 'consum_amt2',
          width: '120',
          style: 'center-align',
        },
        // 단위2
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003505'),
          dataField: 'unit_cd2',
          width: '120',
          style: 'center-align',
        },
        // 약품명3
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003506'),
          dataField: 'eair_chem_nm3',
          width: '120',
          style: 'center-align',
        },
        // 사용량3
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003507'),
          dataField: 'consum_amt3',
          width: '120',
          style: 'center-align',
        },
        // 단위3
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003508'),
          dataField: 'unit_cd3',
          width: '120',
          style: 'center-align',
        },
      ];
    },
    getRptC() {
      this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000003488'); //  '보수사항';
      // this.excelDownNm = this.$comm.getLangSpecInfoLabel('L0000003489'); //  '보수사항 엑셀다운로드';

      this.gridOptions.header = [
        // 등록일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000975'),
          dataField: 'reg_dt',
          width: '9%',
          style: 'center-align',
        },
        // 배출구일련번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001150'),
          dataField: 'eair_outlet_nm',
          width: '9%',
          style: 'center-align',
        },
        // 허가증상배출구번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003235'),
          dataField: 'eair_outlet_permit_no',
          width: '10%',
          style: 'center-align',
        },
        // 배출구명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001147'),
          dataField: 'main_disch_fac_nm',
          width: '9%',
          style: 'left-align',
        },
        // 방지시설일련번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001119'),
          dataField: 'eair_prevent_fac_num',
          width: '9%',
          style: 'center-align',
        },
        // 사내고유방지시설번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003497'),
          dataField: 'eair_prevent_fac_inh_num',
          width: '9%',
          style: 'center-align',
        },
        // 방지시설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001117'),
          dataField: 'eair_prevent_fac_nm',
          width: '9%',
          style: 'center-align',
        },
        // 시작일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001779'),
          dataField: 'start_ymd',
          width: '9%',
          style: 'center-align',
        },
        // 마침일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003509'),
          dataField: 'end_ymd',
          width: '9%',
          style: 'center-align',
        },
        // 보수자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001255'),
          dataField: 'worker',
          width: '9%',
          style: 'center-align',
        },
        // 보수명세
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001251'),
          dataField: 'remark',
          width: '9%',
          style: 'center-align',
        },
      ];
    },
    getRptD() {
      this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000003490'); //  '자가측정사항';
      // this.excelDownNm = this.$comm.getLangSpecInfoLabel('L0000003491'); //  '자가측정사항 엑셀다운로드';

      this.gridOptions.header = [
        // 배출구일련번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001150'),
          dataField: 'eair_outlet_nm',
          width: '150',
          style: 'center-align',
        },
        // 허가증상배출구번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003235'),
          dataField: 'eair_outlet_permit_no',
          width: '200',
          style: 'center-align',
        },
        // 배출구명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001147'),
          dataField: 'main_disch_fac_nm',
          width: '150',
          style: 'left-align',
        },
        // 기상
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003465'),
          dataField: 'weather',
          width: '120',
          style: 'center-align',
        },
        // 온도℃
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003510'),
          dataField: 'temp',
          width: '120',
          style: 'center-align',
        },
        // 습도％
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003511'),
          dataField: 'hum',
          width: '120',
          style: 'center-align',
        },
        // 기압mmHg
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003512'),
          dataField: 'air_press',
          width: '120',
          style: 'center-align',
        },
        // 풍향
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003513'),
          dataField: 'wind_dir',
          width: '120',
          style: 'center-align',
        },
        // 풍속m／sec
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003514'),
          dataField: 'wind_speed',
          width: '120',
          style: 'center-align',
        },
        // 측정일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002953'),
          dataField: 'measure_ymd',
          width: '120',
          style: 'center-align',
        },
        // 자가측정방법
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002302'),
          dataField: 'method_cd',
          width: '120',
          style: 'center-align',
        },
        // 가스속도m／s
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003515'),
          dataField: 'gas_speed',
          width: '140',
          style: 'center-align',
        },
        // 가스온도℃
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003516'),
          dataField: 'gas_temp',
          width: '120',
          style: 'center-align',
        },
        // 수분함량％
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003517'),
          dataField: 'wtr_per',
          width: '120',
          style: 'center-align',
        },
        // 실측산소농도％
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003518'),
          dataField: 'real_o2_val',
          width: '140',
          style: 'center-align',
        },
        // 표준산소농도％
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003519'),
          dataField: 'stnd_o2_val',
          width: '140',
          style: 'center-align',
        },
        // 배출가스유량S㎥／min
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003520'),
          dataField: 'flow_day',
          width: '170',
          style: 'center-align',
        },
        // 오염물질
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003521'),
          dataField: 'test_item_cd',
          width: '120',
          style: 'center-align',
        },
        // 농도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003522'),
          dataField: 'num_result',
          width: '120',
          style: 'center-align',
        },
        // 배출허용기준농도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003523'),
          dataField: 'legal_limit',
          width: '150',
          style: 'center-align',
        },
        // 배출허용기준체크
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003524'),
          dataField: 'legal_limit',
          width: '150',
          style: 'center-align',
        },
        // 연료명및사용량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003525'),
          dataField: 'fuel_nm_result',
          width: '150',
          style: 'center-align',
        },
        // 원료명및사용량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003526'),
          dataField: 'ingr_nm_result',
          width: '150',
          style: 'center-align',
        },
        // 환경기술인
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003326'),
          dataField: 'env_engr_nm',
          width: '120',
          style: 'center-align',
        },
        // 환경기술인의견
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003327'),
          dataField: 'env_engr_opn',
          width: '150',
          style: 'center-align',
        },
        // 검사기기명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003527'),
          dataField: 'eair_inst_nm',
          width: '200',
          style: 'center-align',
        },
        // 검사방법
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000311'),
          dataField: 'eair_test_mtd_nm',
          width: '120',
          style: 'center-align',
        },
      ];
    },

    getRptF() {
      this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000002002'); //  '연료사용량';
      // this.excelDownNm = this.$comm.getLangSpecInfoLabel('L0000003493'); //  '연료사용량 엑셀다운로드';
      this.gridOptions.header = [
        // 배출구일련번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001150'),
          dataField: 'eair_outlet_nm',
          width: '150',
          style: 'center-align',
        },
        // 배출구명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001147'),
          dataField: 'main_disch_fac_nm',
          width: '150',
          style: 'left-align',
        },
        // 방지시설일련번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001119'),
          dataField: 'eair_prevent_fac_num',
          width: '150',
          style: 'center-align',
        },
        // 방지시설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001117'),
          dataField: 'eair_prevent_fac_nm',
          width: '150',
          style: 'center-align',
        },
        // 배출시설일련번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001178'),
          dataField: 'eair_disch_fac_num',
          width: '150',
          style: 'center-align',
        },
        // 배출시설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001174'),
          dataField: 'eair_disch_fac_nm',
          width: '200',
          style: 'center-align',
        },
        // 사용연료코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003528'),
          dataField: 'eair_fuel_cd',
          width: '200',
          style: 'center-align',
        },
        // 기타사용연료명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003529'),
          dataField: 'fuel_etc',
          width: '150',
          style: 'center-align',
        },
        // 사용량단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003530'),
          dataField: 'env_unit_cd',
          width: '120',
          style: 'center-align',
        },
        // 발열량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001101'),
          dataField: 'cal_val',
          width: '120',
          style: 'center-align',
        },
        // 발열량단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001102'),
          dataField: 'cal_val_unit_cd',
          width: '120',
          style: 'center-align',
        },
        // 황함량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003531'),
          dataField: 'sulfur_content',
          width: '120',
          style: 'center-align',
        },
      ];

      for (let i = 1; i <= 12; i++) {
        this.gridOptions.header.push({
          headerText: i + this.$comm.getLangSpecInfoLabel('L0000002108'), // 월
          dataField: 'ym' + this.searchParam.period + (i > 9 ? i : '0' + i),
          width: '120',
          style: 'center-align',
        });
      }
    },

    getRptG() {
      this.gridOptions.title = this.$comm.getLangSpecInfoLabel('L0000002090'); //  '원료사용량';
      // this.excelDownNm = this.$comm.getLangSpecInfoLabel('L0000003495'); //  '원료사용량 엑셀다운로드';
      this.gridOptions.header = [
        // 사용원료명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003544'),
          dataField: 'eair_ingr_nm',
          width: '150px',
          style: 'center-align',
        },
        // 사용량단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003530'),
          dataField: 'env_unit_cd',
          width: '150',
          style: 'center-align',
        },
      ];

      for (let i = 1; i <= 12; i++) {
        this.gridOptions.header.push({
          headerText: i + this.$comm.getLangSpecInfoLabel('L0000002108'), // 월
          dataField: 'ym' + this.searchParam.period + (i > 9 ? i : '0' + i),
          width: '120',
          style: 'center-align',
        });
      }
    },
    setGridSetting() {
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000195'), // '가동시간 엑셀다운로드';
          color: 'gray',
          btnClicked: 'btnExcelClickedCallback',
          visible: this.searchParam.eairSemsRptTypeCd === 'ESRT1',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003487'), //  '시설운전사항 엑셀다운로드';
          color: 'gray',
          btnClicked: 'btnExcelClickedCallback',
          visible: this.searchParam.eairSemsRptTypeCd === 'ESRT2',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003489'), //  '보수사항 엑셀다운로드';
          color: 'gray',
          btnClicked: 'btnExcelClickedCallback',
          visible: this.searchParam.eairSemsRptTypeCd === 'ESRT3',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003491'), //  '자가측정사항 엑셀다운로드';
          color: 'gray',
          btnClicked: 'btnExcelClickedCallback',
          visible: this.searchParam.eairSemsRptTypeCd === 'ESRT4',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003493'), //  '연료사용량 엑셀다운로드';
          color: 'gray',
          btnClicked: 'btnExcelClickedCallback',
          visible: this.searchParam.eairSemsRptTypeCd === 'ESRT5',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003495'), //  '원료사용량 엑셀다운로드';
          color: 'gray',
          btnClicked: 'btnExcelClickedCallback',
          visible: this.searchParam.eairSemsRptTypeCd === 'ESRT6',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
          visible: true,
        },
      ];
    },
    btnExcelClickedCallback(result) {
      this.excelDown(this.searchParam.eairSemsRptTypeCd);
    },
    btnSearchClickedCallback(result) {
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
