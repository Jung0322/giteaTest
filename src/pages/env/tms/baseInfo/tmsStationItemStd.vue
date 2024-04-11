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
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 측정소구분 -->
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
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            type="year"
            :range="true"
            label="L0000000767"
            name="yearPeriod"
            v-model="searchParam.yearPeriod"
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

    <!-- TMS 측정소항목별 허용기준 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000176')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked"
          @openPopup="openPopup"
          @btnSearchClickedCallback="btnSearchClickedCallback"
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
  name: 'y-tms-station-item-std',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '',
      tmsType: '',
      yearPeriod: [],
      stationCode: '',
      itemCode: '',
    },
    gridOptions: {
      name: 'tmsStationItemStd',
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
    typeItems: [],
    editable: false,
    searchUrl: '',
    searchStationUrl: '',
    searchItemUrl: '',
    YAuiGrid: null,
  }),
  watch: {
    'searchParam.yearPeriod'(val) {
      if (
        this.searchParam.yearPeriod &&
        this.searchParam.yearPeriod.length === 2
      ) {
        let from = this.$_.parseInt(this.searchParam.yearPeriod[0]);
        let to = this.$_.parseInt(this.searchParam.yearPeriod[1]);

        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
            dataField: 'plant_nm',
            width: '120',
            style: 'center-align',
          } /* 사업장 */,
          {
            /* 배출시설명 */
            headerText: this.$comm.getLangSpecInfoLabel('L0000001174'),
            dataField: 'facility_nm',
            width: '180',
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
            /* 측정소항목코드 */
            headerText: this.$comm.getLangSpecInfoLabel('L0000002940'),
            dataField: 'station_item_code',
            width: '150',
            style: 'center-align grid-link-cell',
          },
          {
            /* 측정소명 */
            headerText: this.$comm.getLangSpecInfoLabel('L0000002937'),
            dataField: 'station_name',
            width: '180',
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

        let j = 8;
        for (let i = from; i <= to; i++) {
          this.gridOptions.header.splice(j, 0, {
            headerText: i + this.$comm.getLangSpecInfoLabel('L0000000828'), // 년
            children: [
              {
                /* 법적기준 */
                headerText: this.$comm.getLangSpecInfoLabel('L0000001212'),
                dataField: i + '_law_max',
                width: '100',
                style: 'right-align',
                dataType: 'numeric',
                formatString: '#,##0.###',
              },
              {
                /* 사내기준 */
                headerText: this.$comm.getLangSpecInfoLabel('L0000001409'),
                dataField: i + '_wrn_max',
                width: '100',
                style: 'right-align',
                dataType: 'numeric',
                formatString: '#,##0.###',
              },
            ],
          });
          j++;
        }
        this.getList();
      }
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
    // 'searchParam.tmsType'() {
    //   // 측정소와 측정항목을 재조회한다.
    //   this.getTmsStation(); // TMS 측정소 조회
    //   this.getTmsItem(); // TMS 측정항목 조회
    // },
    // 'searchParam.plantCd'() {
    //   // 측정소를 재조회한다.
    //   this.getTmsStation(); // TMS 측정소 조회
    // },
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
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.env.tms.baseInfo.tmsStationItemStd.list.url;
      this.searchStationUrl = selectConfig.env.tms.baseInfo.tmsStation.list.url;
      this.searchItemUrl = selectConfig.env.tms.baseInfo.tmsItem.list.url;

      let today = this.$comm.getToday();
      this.searchParam.yearPeriod = [
        this.$comm
          .getCalculatedDate(today, '-1y', 'YYYY-MM-DD', 'YYYY-MM-DD')
          .substring(0, 4),
        today.substring(0, 4),
      ];
      this.$comm.getComboItems('TMS_TYPE', true).then((_result) => {
        this.typeItems = _result;
      });
      this.getTmsStation(); // TMS 측정소 조회
      this.getTmsItem(); // TMS 측정항목 조회

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      this.getList();
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
            stationName: this.$comm.getLangSpecInfoLabel('L0000001186'), // 전체
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
            itemName: this.$comm.getLangSpecInfoLabel('L0000001186'), // 전체
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
    /**
     * 수정 팝업 호출
     */
    tableLinkClicked(data) {
      if (data === null || data === undefined) return;
      if (data.dataField === 'station_item_code') {
        this.openPopup(data.item);
      }
    },
    /**
     * 등록 팝업  호출
     */
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./tmsStationItemStdDetail.vue'}`);
      this.popupOptions.title = 'L0000000180'; // TMS 측정소항목별 허용기준 상세
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        stationItemCode: data.station_item_code,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
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
