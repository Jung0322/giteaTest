<!--
  목적 : 위험성평가 > 작업 위험성평가 관리(작업중) > 평가결과 현황
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
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
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
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="rsaRegRegdemItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000686"
            name="regRegdemCd"
            v-model="searchParam.regRegdemCd"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="mt-3 h-100">
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <div class="float-right mb-1">
            <!-- 검색 -->
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
          <y-data-table
            label="L0000004996"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :span-options="gridOptions.merge"
            @tableLinkClicked="tableLinkClicked"
            :rowClassName="tableRowClassName"
            :cellClassName="tableCellClassName"
          ></y-data-table>
        </b-col>
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
        regRegdemCd: '',
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
      gridOptions: {
        header: [],
        data: [],
        height: '600',
        merge: [],
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
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  destroyed() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      if (this.$route.meta.param === 'W') {
        this.searchParam.riskType = 'work';
      } else {
        this.searchParam.riskType = 'proc';
      }
      this.$comm.getComboItems('RSA_REG_REGDEM', true).then((_result) => {
        this.rsaRegRegdemItems = _result;
      });
      this.searchParam.assessYear = this.$comm.moment().format('YYYY');

      this.searchUrl = selectConfig.rsa.resultmgmt.status.url;

      this.getList();
    },
    getHeaders() {
      this.gridOptions.merge = [
        { index: 1, field: 'plant_nm' },
        { index: 2, field: 'rsa_result' },
      ];

      this.gridOptions.header = [];
      this.gridOptions.header.push({
        // 사업장
        text: 'L0000001415',
        name: 'plant_nm',
        width: '100px',
        align: 'center',
      });
      this.gridOptions.header.push({
        // 평가현황
        text: 'L0000004997',
        name: 'rsa_result',
        width: '100px',
        align: 'center',
      });
      this.gridOptions.header.push({
        // 구분
        text: 'L0000000686',
        name: 'gubun',
        width: '150px',
        align: 'center',
      });
      this.gridOptions.header.push({
        // 전년도 누적 합계
        text: 'L0000005400',
        name: 'oldCnt',
        width: '80px',
        align: 'right',
        url: true,
        disabledFn: this.disabledFn,
      });
      this.getYearHeader();
      this.gridOptions.header.push({
        // 합계
        text: 'L0000003180',
        name: 'total',
        width: '60px',
        align: 'right',
        url: true,
        disabledFn: this.disabledFn,
      });
      this.gridOptions.header.push({
        // 누적 합계
        text: 'L0000005399',
        name: 'allCnt',
        width: '80px',
        align: 'right',
        url: true,
        disabledFn: this.disabledFn,
      });
    },
    getYearHeader() {
      // 다국어 처리 '년'
      let langYear = this.$comm.getLangSpecInfoLabel('L0000000828');
      // 다국어 처리 '월'
      let langMonth = this.$comm.getLangSpecInfoLabel('L0000002108');
      let from = this.$comm.moment(this.searchParam.assessYear);
      var yearText = from.format('YYYY') + langYear;
      var header = { text: yearText, align: 'center', child: [] };
      for (let i = 1; i < 13; i++) {
        header.child.push({
          text: i + langMonth,
          name: 'mon' + String(i),
          width: '50px',
          align: 'right',
          type: 'info',
          url: true,
          disabledFn: this.disabledFn,
        });
      }
      this.gridOptions.header.push(this.$_.clone(header));
    },
    getList() {
      if (!this.searchParam.plantCd) {
        this.searchParam.totalFlag = 'Y';
      } else {
        this.searchParam.totalFlag = '';
      }
      this.getHeaders();
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableRowClassName({ row, rowIndex }) {
      let retStyle = '';

      if (row.plant_nm === '합계') {
        retStyle += 'row-eval-background-color';
      }

      if (row.gubun === '평가 실시율(%)' || row.gubun === '개선 조치율(%)') {
        retStyle += ' row-pointer';
      }

      return retStyle;
    },
    tableCellClassName({ row, column, rowIndex, colIndex }) {
      if (row.gubun === '기한초과(건수)' && row[column.property] !== '0') {
        return 'row-color';
      }
    },
    disabledFn(header, row, index) {
      if (row.plant_nm === '합계') {
        return false;
      }

      return true;
    },
    tableLinkClicked(header, data) {
      data.subPlantCd = data.plantCd;
      if (this.searchParam.regRegdemCd) {
        data.regRegdemCd = this.searchParam.regRegdemCd;
      }
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

        data.imprClassCd =
          this.searchParam.riskType === 'work' ? 'ICL41' : 'ICL42';
      }
      // data.actLimitYmd = this.searchParam.assessYear;
      data.assessYear = this.searchParam.assessYear;
      data.riskType = this.searchParam.riskType;
      if (header.name === 'total') {
        data.monFlag = 'mon100';
      } else if (header.name === 'oldCnt') {
        data.monFlag = 'mon200';
      } else if (header.name === 'allCnt') {
        data.monFlag = 'mon300';
      } else {
        data.monFlag = header.name;
      }
      data.regRegdemCd = data.regRegdemCd ? data.regRegdemCd : '';
      data.riskType = data.riskType ? data.riskType : '';
      let strParam =
        data.subPlantCd + '|' + data.regRegdemCd + '|' + data.riskType;
      data.strParam = strParam;
      var regex = /[^0-9]/g; // 숫자가 아닌 문자열을 매칭하는 정규식
      data.monFlag = data.monFlag.replace(regex, '');
      if (data.rsa_result === '개선현황') {
        this.openImprPopup(data);
      } else {
        this.openResultPopup(data);
      }
    },
    openImprPopup(data) {
      this.popupOptions.target = () => import(`${'./resultmgmtImprPopup.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.height = '500';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005000'; // '개선사항 목록';
      this.popupOptions.param = data;

      this.popupOptions.closeCallback = this.closePopup;
    },
    openResultPopup(data) {
      this.popupOptions.target = () => import(`${'./resultstatusPopup.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000004997'; // '평가현황';
      this.popupOptions.param = data ? data : { monFlag: 'mon100' };

      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
  },
};
</script>
<style>
.row-pointer .el-button {
  color: black !important;
  pointer-events: none;
}
.row-eval-background-color {
  background-color: #c7c7c742 !important;
}
</style>
