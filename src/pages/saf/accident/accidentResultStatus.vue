<!--
  목적 : 안전 관리 > 사고관리 > 조사결과 현황
  작성자 : pkj 
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 대상년도 -->
          <y-datepicker
            :width="8"
            type="year"
            name="assessYear"
            label="L0000004449"
            :default="searchParam.assessYear"
            v-model="searchParam.assessYear"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004217')"
          :useExcelExport="true"
          :enableCellMerge="true"
          :rowStyleFunction="gridOptions.rowStyleFunction"
          @cellClick="cellClickHandler"
          @btnSearch="getList"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'operation-status',
  components: {},
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '',
        assessYear: '',
        riskType: '',
        totalFlag: '',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '90%',
        top: '10px',
        closeCallback: null,
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '500',
        rowStyleFunction: (rowIndex, item) => {
          return item.plant_nm === '합계' ? 'grid-cell-disable' : '';
        },
      },
      editable: true,
      rsaRegRegdemItems: [], // 구분
      searchUrl: '',
    };
  },
  computed: {},
  watch: {},
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
    this.getList();
  },
  beforeDestroy() {},
  destroyed() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      if (this.$route.meta.param === 'W') {
        this.searchParam.riskType = 'work';
      } else {
        this.searchParam.riskType = 'proc';
      }
      this.$comm.getComboItems('RSA_REG_REGDEM', false).then((_result) => {
        this.rsaRegRegdemItems = _result;
      });
      this.searchParam.assessYear = this.$comm.moment().format('YYYY');
      this.searchUrl = selectConfig.saf.accident.resultStatus.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      const searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getHeaders();
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, // 검색
      ];
    },
    getHeaders() {
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plant_nm',
          width: '90',
          cellMerge: true,
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004997'),
          dataField: 'rsa_result',
          width: '100',
          cellMerge: true,
          mergeRef: 'plant_nm',
          mergePolicy: 'restrict',
        }, // 평가현황
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'gubun',
          width: '150',
        }, // 구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005400'),
          dataField: 'oldCnt',
          width: '80',
          style: 'right-align',
          styleFunction: (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item,
            dataField
          ) => {
            if (item.plant_nm === '합계') {
              return '';
            } else if (item.gubun === '기한초과(건수)') {
              return Number(value) !== 0
                ? 'grid-link-cell-red'
                : 'grid-link-cell';
            } else {
              return item.gubun === '개선 조치율(%)'
                ? 'grid-cell-bold'
                : 'grid-link-cell';
            }
          },
        }, // 전년도 누적 합계
      ];

      // 다국어 처리 '년'
      let langYear = this.$comm.getLangSpecInfoLabel('L0000000828');
      // 다국어 처리 '월'
      let langMonth = this.$comm.getLangSpecInfoLabel('L0000002108');
      let from = this.$comm.moment(this.searchParam.assessYear);
      var yearText = from.format('YYYY') + langYear;
      var header = { headerText: yearText, children: [] };
      for (let i = 1; i < 13; i++) {
        header.children.push({
          headerText: i + langMonth,
          dataField: 'mon' + String(i),
          width: '64',
          style: 'right-align',
          styleFunction: (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item,
            dataField
          ) => {
            if (item.plant_nm === '합계') {
              return '';
            } else if (item.gubun === '기한초과(건수)') {
              return Number(value) !== 0
                ? 'grid-link-cell-red'
                : 'grid-link-cell';
            } else {
              return item.gubun === '개선 조치율(%)'
                ? 'grid-cell-bold'
                : 'grid-link-cell';
            }
          },
        });
      }
      this.gridOptions.header.push(this.$_.clone(header));
      this.gridOptions.header.push(
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003180'),
          dataField: 'total',
          width: '65',
          style: 'right-align',
          styleFunction: (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item,
            dataField
          ) => {
            if (item.plant_nm === '합계') {
              return '';
            } else if (item.gubun === '기한초과(건수)') {
              return Number(value) !== 0
                ? 'grid-link-cell-red'
                : 'grid-link-cell';
            } else {
              return item.gubun === '개선 조치율(%)'
                ? 'grid-cell-bold'
                : 'grid-link-cell';
            }
          },
        }, // 합계
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005399'),
          dataField: 'allCnt',
          width: '80',
          style: 'right-align',
          styleFunction: (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item,
            dataField
          ) => {
            if (item.plant_nm === '합계') {
              return '';
            } else if (item.gubun === '기한초과(건수)') {
              return Number(value) !== 0
                ? 'grid-link-cell-red'
                : 'grid-link-cell';
            } else {
              return item.gubun === '개선 조치율(%)'
                ? 'grid-cell-bold'
                : 'grid-link-cell';
            }
          },
        } // 누적 합계
      );
    },
    getList() {
      this.searchParam.totalFlag = !this.searchParam.plantCd ? 'Y' : '';

      if (
        (this.searchParam.assessYear || null) === null ||
        this.searchParam.assessYear === ''
      ) {
        this.searchParam.assessYear = this.$comm.moment().format('YYYY');
      }

      this.getHeaders();
      this.YAuiGrid.changeColumnLayout(this.gridOptions.header);

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
    tableCellClassName({ row, column, rowIndex, colIndex }) {
      if (row.gubun === '기한초과(건수)' && row[column.property] !== '0') {
        return 'row-color';
      }
    },
    cellClickHandler(event) {
      if (
        event.dataField === 'plant_nm' ||
        event.dataField === 'rsa_result' ||
        event.dataField === 'gubun'
      ) {
        return;
      }

      const data = event.item;
      data.subPlantCd = data.plantCd;

      if (data.rsa_result === '개선현황') {
        if (data.gubun === '요청(건수)') {
          data.apprFlag = 'requestCnt';
        } else if (data.gubun === '조치미완료(건수)') {
          data.apprFlag = 'incompletCnt';
        } else if (data.gubun === '기한초과(건수)') {
          data.apprFlag = 'overdueCnt';
        } else if (data.gubun === '조치완료(건수)') {
          data.apprFlag = 'completCnt';
        } else if (data.gubun === '개선 조치율(%)') {
          data.apprFlag = 'completCnt';
        }
        if (data.plantCd === '합계') {
          data.subPlantCd = '';
        }

        data.imprClassCd = 'ICL01';
      }

      // data.actLimitYmd = this.searchParam.assessYear;
      data.assessYear = this.searchParam.assessYear;
      data.riskType = this.searchParam.riskType;
      if (event.dataField === 'total') {
        data.monFlag = 'mon100';
      } else if (event.dataField === 'oldCnt') {
        data.monFlag = 'mon200';
      } else if (event.dataField === 'allCnt') {
        data.monFlag = 'mon300';
      } else {
        data.monFlag = event.dataField;
      }
      let strParam = data.subPlantCd;
      data.strParam = strParam;
      var regex = /[^0-9]/g; // 숫자가 아닌 문자열을 매칭하는 정규식
      data.monFlag = data.monFlag.replace(regex, '');
      if (data.rsa_result === '개선현황') {
        this.openImprPopup(data);
      } else {
        data.searchFlag = 'result';
        this.openAccidentResultPopup(data);
      }
    },
    openImprPopup(data) {
      this.popupOptions.target = () =>
        import(`${'@/pages/rsa/rsamgmt/resultmgmtImprPopup.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005000'; // '개선사항 목록';
      this.popupOptions.param = data;

      this.popupOptions.closeCallback = this.closePopup;
    },
    openAccidentResultPopup(data) {
      this.popupOptions.target = () => import(`${'./accidentResultPopup.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005264'; // '조사결과 현황';
      this.popupOptions.param = data ? data : { monFlag: 'mon100' };

      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 300;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
