<!--
  목적 : 사고관리 - 조사결과/개선계획
  Detail : 사고 접수 목록 화면을 접수단계의 사고 목록을 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <y-search-box
      :gridOptions="gridOptions"
      @enter="getList"
      v-if="!this.popupParam.popupMode"
    >
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 기간(발생일) -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000770"
            name="period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 발생부서 -->
          <y-tree-dept
            type="search"
            label="L0000001076"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 사고종류 -->
          <y-select
            :width="8"
            :comboItems="accidentTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000001406"
            name="accidentType"
            v-model="searchParam.accidentType"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 대분류 -->
          <y-select
            :width="8"
            :comboItems="comboFormOcuurMainCategoryItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="occKindCd"
            label="L0000000912"
            v-model="searchParam.occKindCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 중분류 -->
          <y-select
            :width="8"
            :comboItems="comboFormOcuurCategoryItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002729"
            name="occAttCd"
            v-model="searchParam.occAttCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 직접원인 -->
          <y-select
            :width="8"
            :comboItems="comboProvDirectlyReasonItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="immCauseCd"
            label="L0000002771"
            v-model="searchParam.immCauseCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 간접원인 -->
          <y-select
            :width="8"
            :comboItems="comboProvIndirectReasonItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="indCauseCd"
            label="L0000000220"
            v-model="searchParam.indCauseCd"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="
            popupParam.gubun + ' ' + $comm.getLangSpecInfoLabel('L0000001022')
          "
          :useExcelExport="false"
          @cellClick="cellClickHandler"
          @btnSearch="getList"
          @btnClose="closeTotalPopup"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-accident-total-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        plantCd: '', // 사업장
        occKindCd: '', // 발생형태 대분류
        occAttCd: '', // 발생형태 중분류
        immCauseCd: '', // 사고원인 직접원인
        indCauseCd: '', // 사고원인 간접원인
        deptCd: '', // 발생부서
        accidentTypeCd: '', // 사고종류
        yearMonth: '', // 조회년도
        gubun: '', // 사고구분
      },
    },
  },
  data: () => ({
    searchParam: {
      plantCd: '',
      period: [], // 기간(발생일)
      startDate: '', // From
      endDate: '', // To
      deptCd: '', // 발생부서 코드
      accidentStepCd: 'ACCS4', // 사내사고진행단계
      processStepCd: 'NEMS2',
      searchFlag: 'result',
      accidentType: '', // 사고종류
      occKindCd: '', // 발생형태 대분류
      occAttCd: '', // 발생형태 중분류
      immCauseCd: '', // 사고원인 직접
      indCauseCd: '', // 사고원인 간접
    },
    YAuiGrid: null,
    gridOptions: {
      header: [],
      data: [],
      height: '300',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: null,
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    accidentTypeItems: [],
    comboFormOcuurMainCategoryItems: [],
    comboFormOcuurCategoryItems: [],
    comboProvDirectlyReasonItems: [],
    comboProvIndirectReasonItems: [],
    searchUrl: '',
  }),
  watch: {
    'searchParam.occKindCd': function (newValue, oldValue) {
      if (newValue) {
        this.$comm.getComboItems(newValue, true).then((_result) => {
          this.comboFormOcuurCategoryItems = _result;
          this.searchParam.occAttCd =
            this.$_.findIndex(this.comboFormOcuurCategoryItems, {
              code: this.searchParam.occAttCd,
            }) === -1
              ? ''
              : this.searchParam.occAttCd;
        });
      } else {
        this.comboFormOcuurCategoryItems = [
          { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') },
        ];
        this.searchParam.occAttCd = '';
      }
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList(); // 사고조사결과 목록 조회
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      if (this.popupParam.gubun === 'Nearmiss') {
        this.searchUrl = selectConfig.saf.nearmiss.list.url;
      } else {
        this.searchUrl = selectConfig.saf.accident.list.url;
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '120',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001078'),
          dataField: 'accidentYmd',
          width: '130',
        }, // 발생일

        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001082'), // 발생형태
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000912'),
              dataField: 'occKindNm',
              width: '150',
            }, // 대분류
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002729'),
              dataField: 'occAttNm',
              width: '150',
            }, // 중분류
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001397'), // 사고원인
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002771'),
              dataField: 'immCauseNm',
              width: '150',
            }, // 직접원인
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000220'),
              dataField: 'indCauseNm',
              width: '150',
            }, // 간접원인
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001076'),
          dataField: 'deptNm',
          width: '150',
          style: 'left-align',
        }, // 발생부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001081'),
          dataField: 'area',
          width: '150',
          style: 'left-align',
        }, // 발생장소
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001390'),
          dataField: 'accidentTitle',
          width: '250',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 사고명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001386'),
          dataField: 'accKindNms',
          width: '180',
        }, // 사고구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001406'),
          dataField: 'accidentTypeNms',
          width: '180',
        }, // 사고종류
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
          visible: !this.popupParam.popupMode,
        }, // 검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClose',
        }, // 닫기
      ];

      let startDate = '';
      let endDate = '';
      if (this.popupParam.yearMonth.length === 4) {
        startDate = this.$comm.moment([this.popupParam.yearMonth, 0]);
        endDate = this.$comm.moment([this.popupParam.yearMonth, 11]);
        endDate = this.$comm.moment(endDate).endOf('month');
      } else {
        let year = this.popupParam.yearMonth.split('-')[0];
        let month = this.popupParam.yearMonth.split('-')[1];

        startDate = this.$comm.moment([year, month - 1]);
        // Clone the value before .endOf()
        endDate = this.$comm.moment(startDate).endOf('month');
      }
      this.searchParam.startDate = startDate.format('YYYY-MM-DD');
      this.searchParam.endDate = endDate.format('YYYY-MM-DD');
      this.searchParam.period = [
        this.searchParam.startDate,
        this.searchParam.endDate,
      ];
      this.searchParam.plantCd = this.popupParam.plantCd || '';
      this.searchParam.deptCd = this.popupParam.deptCd || '';
      this.searchParam.accidentType = this.popupParam.accidentTypeCd || '';
      this.searchParam.occKindCd = this.popupParam.occKindCd || '';
      this.searchParam.occAttCd = this.popupParam.occAttCd || '';
      this.searchParam.immCauseCd = this.popupParam.immCauseCd || '';
      this.searchParam.indCauseCd = this.popupParam.indCauseCd || '';

      // 사고종류
      this.$comm.getComboItems('SAF_OCC_TYPE', true).then((_result) => {
        this.accidentTypeItems = _result;
      });
      // 대분류
      this.$comm
        .getComboItems('SAF_ACCIDENT_OCC_PTN_CLS', true)
        .then((_result) => {
          this.comboFormOcuurMainCategoryItems = _result;
        });
      // 중분류
      if (!this.popupParam.occKindCd || !this.searchParam.occKindCd) {
        this.comboFormOcuurCategoryItems = [
          {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }, // '선택하세요';
        ];
      }
      // 직접원인
      this.$comm
        .getComboItems('SAF_ACCIDENT_IMM_CAUSE', true)
        .then((_result) => {
          this.comboProvDirectlyReasonItems = _result;
        });
      // 간접원인
      this.$comm
        .getComboItems('SAF_ACCIDENT_IND_CAUSE', true)
        .then((_result) => {
          this.comboProvIndirectReasonItems = _result;
        });
    },
    /** 사고조사결과 목록 조회 **/
    getList() {
      this.searchParam.startDate = this.$_.clone(this.searchParam.period[0]);
      this.searchParam.endDate = this.$_.clone(this.searchParam.period[1]);
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * showAccidentPopup 호출
     * 사고조사결과 목록에 사고명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    cellClickHandler(event) {
      if (event.dataField === 'accidentTitle') {
        this.showAccidentPopup(event.item, false);
      }
    },

    /**
     * 해당 사고 상세보는 팝업 open
     */
    showAccidentPopup(data, flag) {
      if (this.popupParam.gubun === 'Accident') {
        this.popupOptions.target = () => import(`${'./accidentDetail.vue'}`);
        this.popupOptions.title = 'L0000001395'; // 사고상세
        this.popupOptions.param = {
          safAccidentNo: data.safAccidentNo, // 사내사고번호
          accidentStepCd: data.accidentStepCd, // 사내사고진행단계
          investYn: data.investYn,
          insertFlag: 'result',
          tabIndex:
            data.accidentStepCd === 'ACCS0' || !data.accidentStepCd
              ? 0
              : data.accidentStepCd === 'ACCS1'
              ? 1
              : data.accidentStepCd === 'ACCS2'
              ? 3
              : 5,
        };
      } else {
        this.popupOptions.target = () => import(`${'./nearmissDetail.vue'}`);
        this.popupOptions.title = 'L0000001838'; // 아차사고상세
        this.popupOptions.param = {
          safNearmissNo: data.safNearmissNo, // 아차사고 번호
          bizApprStepCd: data.bizApprStepCd, // 결재진행상태
        };
      }
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /** button 관련 이벤트 **/
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closeTotalPopup(data) {
      this.$emit('closePopup', {});
    },
    /** end button 관련 이벤트 **/
    resizeGrid() {
      this.YAuiGrid.resize(null, this.gridOptions.height);
    },
  },
};
</script>
