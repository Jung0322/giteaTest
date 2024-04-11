<!--
  목적 : 환경 > 온실가스 > 명세서 출력
  작성자 : PSB
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 대상년도 -->
          <y-datepicker
            :width="8"
            type="year"
            name="actMonth"
            label="L0000004449"
            v-model="searchParam.year"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 명세표 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004450')"
          :useExcelExport="false"
          :enableSorting="true"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'y-act-data-master',
  props: {},

  data() {
    return {
      searchParam: {
        plantCd: '',
        year: '',
        mCols: [],
      },

      gridOptions: {
        name: 'specSheet',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },
      searchUrl: '',
    };
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
    // 초기화
    init() {
      this.searchUrl = selectConfig.env.gas.emissions.getSpeSheet.url;

      // 기간 Setting

      this.searchParam.year = this.$comm.getToday();

      // grid header 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004451'), // 배출활동[참고1]
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001194'), // 배출활동코드
              dataField: 'ghg_out_act_cd',
              width: '100',
              style: 'center-align',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001192'), // 배출활동명
              dataField: 'ghg_out_act_nm',
              width: '100',
              style: 'center-align',
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004452'), // 배출활동[참고2]
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004412'), // 일련번호
              dataField: 'ngms_fceq_num',
              width: '100',
              style: 'center-align',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001179'), // 배출시설코드
              dataField: 'erp_code',
              width: '100',
              style: 'center-align',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001174'), // 배출시설명
              dataField: 'fclt_nm',
              width: '100',
              style: 'center-align',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004453'), // 소규모 배출시설 여부
              dataField: 's_fclt_yn',
              width: '100',
              style: 'center-align',
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004441'), // 온실가스 배출량
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000005659'),
              dataField: 'ems_co2',
              width: '100',
              style: 'right-align',
              dataType: 'numeric',
              formatString: '#,##0.###',
            }, // CO2(ton)
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000005660'),
              dataField: 'ems_ch4',
              width: '100',
              style: 'right-align',
              dataType: 'numeric',
              formatString: '#,##0.###',
            }, // CH4(kg)
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000005661'),
              dataField: 'ems_n2o',
              width: '100',
              style: 'right-align',
              dataType: 'numeric',
              formatString: '#,##0.###',
            }, // N2O(kg)
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000005662'),
              dataField: 'ems_hfcs',
              width: '100',
              style: 'right-align',
              dataType: 'numeric',
              formatString: '#,##0.###',
            }, // HFCs(kg)
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000005663'),
              dataField: 'ems_pfcs',
              width: '100',
              style: 'right-align',
              dataType: 'numeric',
              formatString: '#,##0.###',
            }, // PFCs(kg)
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000005664'),
              dataField: 'ems_sf6',
              width: '100',
              style: 'right-align',
              dataType: 'numeric',
              formatString: '#,##0.###',
            }, // SF6(kg)
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004454'), // 소계(tCO2-eq)
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000005667'),
              dataField: 'sT1',
              width: '100',
              style: 'right-align',
              dataType: 'numeric',
              formatString: '#,##0.###',
            }, // Scope1
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000005668'),
              dataField: 'sT2',
              width: '100',
              style: 'right-align',
              dataType: 'numeric',
              formatString: '#,##0.###',
            }, // Scope2
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004455'), // 합계(tCO2-eq)
          dataField: 'sT',
          width: '100',
          style: 'right-align',
          dataType: 'numeric',
          formatString: '#,##0.###',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004456'), // 에너지 사용량(MJ)
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004457'), // 에너지
              dataField: 'energy_usage',
              width: '100',
              style: 'center-align',
              dataType: 'numeric',
              formatString: '#,##0.###',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003582'), // 전력
              dataField: 'elec_usage',
              width: '100',
              style: 'center-align',
              dataType: 'numeric',
              formatString: '#,##0.###',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004458'), // 스팀
              dataField: 'steam_usage',
              width: '100',
              style: 'center-align',
              dataType: 'numeric',
              formatString: '#,##0.###',
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004459'), // 합계(TJ)
          dataField: 'cal_ener_use_vol',
          width: '100',
          style: 'center-align',
          dataType: 'numeric',
          formatString: '#,##0.###',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005669'),
          dataField: 'deviationByST',
          width: '160',
          style: 'center-align',
        }, // 전년도 대비 온실가스\n배출량 증감율(%)
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDataList();
    },
    btnSearchClickedCallback() {
      this.getDataList();
    },
    // grid 목록 불러오기
    getDataList() {
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
