<!--
  목적 : 안전 > 안전점검 > 안전점검실적
  Detail : 안전점검실적 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions2" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam2.plantCd" />
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 점검년도 -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000002548"
            name="year"
            :default="searchParam2.year"
            v-model="searchParam2.year"
          ></y-datepicker>
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3"> </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 점검종류 -->
          <y-select
            :width="8"
            :comboItems="comboCheckTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002576"
            name="safCheckTypeCd"
            v-model="searchParam2.safCheckTypeCd"
          ></y-select>
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 설비유형 -->
          <y-tree-facility-type
            label="L0000001597"
            type="search"
            name="searchSafFacilityTypeCd"
            v-model="searchParam2.safFacilityTypeCd"
          />
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
          <!-- 점검수행부서 -->
          <y-tree-dept
            type="search"
            label="L0000004852"
            :plantCd="searchPlantCd"
            v-model="searchParam2.deptCd"
            :deptSubYn="searchParam2.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0 facilityCheckResultSub">
          <!-- <div class="float-right mb-1">
              검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div> -->
          <!-- 사업장별 세부 설비점검실적 현황 -->
          <!-- <y-data-table
            ref="dataTable2"
            :height="gridOptions2.height"
            :headers="gridOptions2.header"
            :items="gridOptions2.data"
            :use-paging="false"
            :useRownum="false"
            :showSummary="true"
            @tableLinkClicked="tableLinkClicked2"
            label="L0000001425"
          ></y-data-table> -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions2.name"
            :headers="gridOptions2.header"
            :btns="gridOptions2.btns"
            :height="gridOptions2.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001425')"
            :useExcelExport="false"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            @cellClick="cellClickHandler"
            @btnSearch="btnSearchClickedCallback"
            @btnClickedError="btnClickedErrorCallback"
          />
        </b-col>
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
  name: 'facil-chk-performance',
  props: {},
  data: () => ({
    searchParam2: {
      year: '', // 기간(점검일)
      plantCd: '',
      safCheckTypeCd: '',
      safFacilityTypeCd: '',
      deptCd: '', // 점검수행부서코드
      deptSubYn: 'Y', // 하위부서여부 사용
    },
    gridOptions2: {
      header: [],
      data: [],
      height: '500',
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
    searchPlantCd: '',
    searchYear: '',
    comboCheckTypeItems: [], // 점검종류
    editable: false,
    searchUrl: '',
    searchUrl2: '',
    gridMessage: '',
    YAuiGrid: null,
  }),
  watch: {},
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // 실적의 건수는 점검 대상 설비의 건수 입니다.
      this.gridMessage = 'M0000001016';
      // Url Setting
      this.searchUrl2 = selectConfig.saf.facilChkResult.status2.url;

      this.searchParam2.deptSubYn = 'Y';

      // 그리드 헤더 설정
      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plant_nm',
          width: '150',
          style: 'center-align',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002576'),
          dataField: 'saf_check_type_nm',
          width: '150',
          style: 'center-align',
        }, // 점검종류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001597'),
          dataField: 'saf_facility_type_nm',
          width: '150',
          style: 'center-align',
        }, // 설비유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004852'),
          dataField: 'dept_nm',
          width: '150',
          style: 'center-align',
        }, // 점검수행부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003181'),
          dataField: 'sum_plan',
          wdith: '90',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 합계 계획
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003182'),
          dataField: 'sum_result',
          wdith: '90',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 합계 실적
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002874'),
          dataField: 'sum',
          wdith: '90',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 총합
      ];
      for (let i = 1; i < 13; i++) {
        let month = i < 10 ? '0' + i : i.toString();
        this.gridOptions2.header.splice(i + 3, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003663', {
            s1: i,
          }), // {s1}월
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000466'),
              dataField: month + '_plan',
              wdith: '90',
              style: 'center-align',
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            }, // 계획
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001810'),
              dataField: month + '_result',
              wdith: '90',
              style: 'center-align',
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            }, // 실적
          ],
        });
      }
      this.gridOptions2.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
          visible: this.editable,
        }, //  검색
      ];

      let today = this.$comm.getToday();
      this.searchParam2.year = today.substring(0, 4);

      this.$comm.getComboItems('SAF_FACILITY_CHECK', true).then((_result) => {
        this.comboCheckTypeItems = _result;
      }); // 점검종류
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie2 = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie2 !== 'undefined') {
        this.searchParam2 = searchParamByCookie2;
      }

      this.getList();
    },

    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchClickedCallback() {
      this.getList();
    },
    cellClickHandler(event) {
      if (
        event.dataField === 'plant_nm' ||
        event.dataField === 'saf_check_type_nm' ||
        event.dataField === 'saf_facility_type_nm' ||
        event.dataField === 'dept_nm'
      ) {
        return;
      }
      let gubun = '';

      if (event.dataField.split('_')[1] === 'plan') gubun = 'CHS02';
      else if (event.dataField.split('_')[1] === 'result') gubun = 'CHS04';
      else gubun = 'CHS99';
      console.log('1111', event);

      this.popupOptions.target = () => import(`${'./facilChkResultTable.vue'}`);
      this.popupOptions.title = 'L0000001606'; // 설비점검
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: event.item.plant_cd,
        year: this.searchParam2.year,
        gubun: gubun,
        month:
          event.dataField !== 'sum' &&
          event.dataField !== 'sum_plan' &&
          event.dataField !== 'sum_result'
            ? event.dataField.substring(0, 2)
            : '',
        safCheckTypeCd: event.item.saf_check_type_cd,
        safFacilityTypeCd: event.item.saf_facility_type_cd,
        deptCd: event.item.dept_cd,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },

    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    getList() {
      this.$http.url = this.searchUrl2;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam2;
      this.$http.request(
        (_result) => {
          // this.gridOptions2.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam2);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam2.deptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
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

<style>
.facilityCheckResultSub .el-table__body-wrapper {
  height: 382.22px !important;
}
</style>
