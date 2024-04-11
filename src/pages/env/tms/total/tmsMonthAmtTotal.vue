<!--
  목적 : 안전점검 - 안전 점검 종류
  Detail : 안전점검 점검항목 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <!-- 측정소구분 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="typeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002936"
            name="tmsType"
            v-model="searchParam.tmsType"
          ></y-select>
        </b-col>
        <!-- 집계구분 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="searchTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002789"
            name="searchType"
            v-model="searchParam.searchType"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            v-show="searchParam.searchType === 'm'"
            :width="8"
            type="month"
            :range="true"
            label="L0000000767"
            name="monthPeriod"
            v-model="searchParam.monthPeriod"
          ></y-datepicker>
          <!-- 년도 -->
          <y-datepicker
            v-show="searchParam.searchType === 'y'"
            :width="8"
            type="year"
            label="L0000000829"
            name="year"
            v-model="searchParam.year"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 측정소 -->
          <y-select
            :width="8"
            :comboItems="stationItems"
            itemText="stationName"
            itemValue="stationCode"
            ui="bootstrap"
            label="L0000002935"
            name="stationCode"
            v-model="searchParam.stationCode"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 측정항목 -->
          <y-select
            :width="8"
            :comboItems="itemItems"
            itemText="itemName"
            itemValue="itemCode"
            ui="bootstrap"
            label="L0000002963"
            name="itemCode"
            v-model="searchParam.itemCode"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- TMS 년간 측정값 집계 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="false"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000172')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked"
          @btnSearchClickedCallback="btnSearchClickedCallback"
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
  name: 'y-tms-station-item-std',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '',
      tmsType: '',
      searchType: 'y',
      monthPeriod: [],
      year: '',
      yearMonth: [],
      stationCode: '',
      itemCode: '',
    },
    gridOptions: {
      name: 'tmsMonthAmtTotal',
      header: [],
      data: [],
      btns: [],
      height: '420',
    },
    stationItems: [],
    itemItems: [],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '80%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    searchTypeItems: [],
    typeItems: [],
    editable: false,
    searchUrl: '',
    searchStationUrl: '',
    searchItemUrl: '',
    YAuiGrid: null,
  }),
  watch: {
    'searchParam.searchType'() {
      if (this.searchParam.searchType === 'm') {
        // 집계구분을 월간으로 한 경우
        this.label = 'L0000004499'; /* TMS 월간 측정값 집계 */
      } else {
        // 집계구분을 년간으로 한 경우
        this.label = 'L0000000172'; /* TMS 년간 측정값 집계 */
      }
      this.setHeader();
    },
    'searchParam.year'(val) {
      if (!this.searchParam.year) {
        let today = this.$comm.getToday();
        this.searchParam.year = today.substring(0, 4);
      } else {
        this.setHeader();
      }
    },
    'searchParam.monthPeriod'(val) {
      this.setHeader();
    },
    'searchParam.stationCode'() {
      if (this.searchParam.stationCode) {
        let data = this.$_.filter(this.stationItems, {
          stationCode: this.searchParam.stationCode,
        });

        if (data && data.length > 0) {
          this.searchParam.plantCd = data[0].plantCd;
          this.searchParam.tmsType = data[0].tmsType;
        }
      }
    },
    'searchParam.itemCode'() {
      if (this.searchParam.itemCode) {
        let data = this.$_.filter(this.itemItems, {
          itemCode: this.searchParam.itemCode,
        });
        if (data && data.length > 0) {
          this.searchParam.tmsType = data[0].tmsType;
        }
      }
    },
    'searchParam.tmsType'() {
      // 측정소와 측정항목을 재조회한다.
      this.getTmsStation(); // TMS 측정소 조회
      this.getTmsItem(); // TMS 측정항목 조회
    },
    'searchParam.plantCd'() {
      // 측정소를 재조회한다.
      this.getTmsStation(); // TMS 측정소 조회
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.env.tms.total.list.url;
      this.searchStationUrl = selectConfig.env.tms.baseInfo.tmsStation.list.url;
      this.searchItemUrl = selectConfig.env.tms.baseInfo.tmsItem.list.url;

      this.searchTypeItems = [
        { code: 'm', codeNm: this.$comm.getLangSpecInfoLabel('L0000005675') }, // 월간
        { code: 'y', codeNm: this.$comm.getLangSpecInfoLabel('L0000005676') }, // 연간
      ];

      let today =
        this.$comm.today.getFullYear() +
        '-' +
        this.$_.padStart(this.$comm.today.getMonth() + 1, 2, '0') +
        '-01';

      this.searchParam.monthPeriod = [
        this.$comm.getCalculatedDate(today, '-6m', 'YYYY-MM-DD', 'YYYY-MM-DD'),
        today,
      ];
      this.searchParam.year = today.substring(0, 4);
      this.$comm.getComboItems('TMS_TYPE', true).then((_result) => {
        this.typeItems = _result;
      });
      this.getTmsStation(); // TMS 측정소 조회
      this.getTmsItem(); // TMS 측정항목 조회

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      // this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
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
    getTmsStation() {
      this.$http.url = this.searchStationUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.searchParam.plantCd,
        tmsType: this.searchParam.tmsType,
      };
      this.$http.request(
        (_result) => {
          this.stationItems = this.$_.clone(_result.data);
          this.stationItems.splice(0, 0, {
            stationCode: '',
            stationName:
              this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
          });

          if (
            this.$_.findIndex(this.stationItems, {
              stationCode: this.searchParam.stationCode,
            }) === -1
          ) {
            this.searchParam.stationCode = '';
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getTmsItem() {
      this.$http.url = this.searchItemUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.searchParam.plantCd,
        tmsType: this.searchParam.tmsType,
      };
      this.$http.request(
        (_result) => {
          this.itemItems = this.$_.clone(_result.data);
          this.itemItems.splice(0, 0, {
            itemCode: '',
            itemName: this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
          });

          if (
            this.$_.findIndex(this.itemItems, {
              itemCode: this.searchParam.itemCode,
            }) === -1
          ) {
            this.searchParam.itemCode = '';
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setHeader() {
      if (
        (this.searchParam.monthPeriod &&
          this.searchParam.monthPeriod.length === 2 &&
          this.searchParam.searchType === 'm') ||
        this.searchParam.searchType === 'y'
      ) {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
            dataField: 'plant_nm',
            width: '120',
            style: 'center-align',
          } /* 사업장 */,
          {
            /* 유형 */
            headerText: this.$comm.getLangSpecInfoLabel('L0000002203'),
            dataField: 'output_type',
            width: '100',
            style: 'center-align',
          },
          {
            /* 항목명 */
            headerText: this.$comm.getLangSpecInfoLabel('L0000003205'),
            dataField: 'item_name',
            width: '180',
            style: 'center-align',
          },
          {
            /* 배출시설명 */
            headerText: this.$comm.getLangSpecInfoLabel('L0000001174'),
            dataField: 'facility_nm',
            width: '130',
            style: 'center-align',
          },
          {
            /* 배출구명 */
            headerText: this.$comm.getLangSpecInfoLabel('L0000001147'),
            dataField: 'outlet_nm',
            width: '180',
            style: 'center-align',
          },
          {
            /* 측정소명 */
            headerText: this.$comm.getLangSpecInfoLabel('L0000002937'),
            dataField: 'station_name',
            width: '180',
            style: 'center-align',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
            dataField: 's_unit',
            width: '120',
            style: 'center-align',
          } /* 단위 */,
          {
            /* 구분 */
            headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
            dataField: 'tms_type_nm',
            width: '120',
            style: 'center-align',
          },
        ];

        let from = this.$_.parseInt(this.searchParam.monthPeriod[0]);
        let to = this.$_.parseInt(this.searchParam.monthPeriod[1]);
        let j = 8;
        // 집계구분이 월간인지 년간인지 파악한다.
        if (this.searchParam.searchType === 'm') {
          // 집계구분이 월간인 경우
          let diff =
            this.$comm
              .moment(this.searchParam.monthPeriod[1])
              .diff(this.searchParam.monthPeriod[0], 'months', true) + 1;
          let start = this.$_.clone(this.searchParam.monthPeriod[0]);
          let year = start.substring(0, 4);
          let tempYear = '';
          let childObject = [];
          let child = [];
          for (let i = 1; i <= diff; i++) {
            if (year === tempYear) {
              // 같은 경우 하나의 부모에 들어가게 처리
              child.splice(i, 0, {
                headerText:
                  String(this.$_.parseInt(start.substring(5, 7))) + '월',
                dataField:
                  year + '_' + String(this.$_.parseInt(start.substring(5, 7))),
                width: '100',
                style: 'right-align',
                dataType: 'numeric',
                formatString: '#,##0.###',
              });
            } else {
              // 다른 경우 부모를 하나더 생성 시켜 데이터 들어가게 처리
              if (tempYear) {
                // 집계
                child.splice(0, 0, {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000002788'),
                  dataField: tempYear + '_sum',
                  width: '100',
                  style: 'right-align',
                  dataType: 'numeric',
                  formatString: '#,##0.###',
                });
                // 법적기준
                child.splice(0, 0, {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000001212'),
                  dataField: tempYear + '_law_max',
                  width: '100',
                  style: 'right-align',
                  dataType: 'numeric',
                  formatString: '#,##0.###',
                });

                childObject.push({
                  year: tempYear,
                  child: child,
                });
              }

              child = []; // 초기화
              child.splice(i, 0, {
                headerText:
                  String(this.$_.parseInt(start.substring(5, 7))) + '월',
                dataField:
                  year + '_' + String(this.$_.parseInt(start.substring(5, 7))),
                width: '100',
                style: 'right-align',
                dataType: 'numeric',
                formatString: '#,##0.###',
              });
            }

            tempYear = year;

            start = this.$comm.getCalculatedDate(
              start,
              '1m',
              'YYYY-MM-DD',
              'YYYY-MM-DD'
            );
            year = start.substring(0, 4);
          }
          // 마지막 데이터도 넣어준다.
          // 집계
          child.splice(0, 0, {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002788'),
            dataField: year + '_sum',
            width: '100',
            style: 'right-align',
            dataType: 'numeric',
            formatString: '#,##0.###',
          });
          // 법적기준
          child.splice(0, 0, {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001212'),
            dataField: year + '_law_max',
            width: '100',
            style: 'right-align',
            dataType: 'numeric',
            formatString: '#,##0.###',
          });
          childObject.push({
            year: year,
            child: child,
          });

          this.$_.forEach(childObject, (data) => {
            this.gridOptions.header.splice(j, 0, {
              headerText:
                data.year + this.$comm.getLangSpecInfoLabel('L0000000828'), // 년
              children: data.child,
            });
            j++;
          });
        } else {
          // 집계구분이 년간인 경우

          let child = [];
          for (let i = 1; i <= 12; i++) {
            child.splice(i, 0, {
              headerText: i + this.$comm.getLangSpecInfoLabel('L0000002108'), // 월
              dataField: this.searchParam.year + '_' + i,
              width: '100',
              style: 'right-align',
              dataType: 'numeric',
              formatString: '#,##0.###',
            });
          }

          child.splice(0, 0, {
            // 집계
            headerText: this.$comm.getLangSpecInfoLabel('L0000002788'),
            dataField: this.searchParam.year + '_sum',
            width: '100',
            style: 'right-align',
            dataType: 'numeric',
            formatString: '#,##0.###',
          });

          child.splice(0, 0, {
            // 법적기준
            headerText: this.$comm.getLangSpecInfoLabel('L0000001212'),
            dataField: this.searchParam.year + '_law_max',
            width: '100',
            style: 'right-align',
            dataType: 'numeric',
            formatString: '#,##0.###',
          });
          this.gridOptions.header.splice(j, 0, {
            headerText:
              this.searchParam.year +
              this.$comm.getLangSpecInfoLabel('L0000000828'), // 년
            children: child,
          });
        }
        this.setSearchParam();
      }
    },
    setSearchParam() {
      let diff = 0;
      let start = '';
      if (this.searchParam.searchType === 'm') {
        start = this.$_.clone(this.searchParam.monthPeriod[0]);
        if (
          !(
            this.searchParam.monthPeriod &&
            this.searchParam.monthPeriod.length === 2
          )
        ) {
          let today =
            this.$comm.today.getFullYear() +
            '-' +
            this.$_.padStart(this.$comm.today.getMonth() + 1, 2, '0') +
            '-01';

          this.searchParam.monthPeriod = [
            this.$comm.getCalculatedDate(
              today,
              '-6m',
              'YYYY-MM-DD',
              'YYYY-MM-DD'
            ),
            today,
          ];
          return;
        }

        diff =
          this.$comm
            .moment(this.searchParam.monthPeriod[1])
            .diff(this.searchParam.monthPeriod[0], 'months', true) + 1;
      } else {
        start = this.$_.clone(this.searchParam.year) + '-01-01';
        diff = 12;
      }
      this.searchParam.yearMonth = [];
      if (this.searchParam.searchType === 'y') {
        this.searchParam.yearMonth.push(this.searchParam.year);
      } else {
        let startYear = this.$comm
          .moment(this.searchParam.monthPeriod[0])
          .format('YYYY');
        let endYear = this.$comm
          .moment(this.searchParam.monthPeriod[1])
          .format('YYYY');
        if (startYear !== endYear) {
          let yearDiff =
            this.$_.parseInt(endYear) - this.$_.parseInt(startYear);
          for (let i = 0; i <= yearDiff; i++) {
            this.searchParam.yearMonth.push(this.$_.parseInt(startYear) + i);
          }
        } else {
          this.searchParam.yearMonth.push(startYear);
        }
      }
      this.getList();
    },
    /**
     * 수정 팝업 호출
     */
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.openPopup(data);
    },
    btnSearchClickedCallback(result) {
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 370;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
