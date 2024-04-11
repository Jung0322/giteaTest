<!--
  목적 : 작업환경측정결과 통계
  Detail :
  examples:
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            type="year"
            label="L0000000767"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-dept
            type="search"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-process
            :plantCd="searchParam.plantCd"
            :deptCd="searchParam.deptCd"
            name="processCd"
            v-model="searchParam.processCd"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
         검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClicked"
            />
          </div>

           검색 결과 테이블 
          <y-data-table
            label="작업환경측정결과 통계 목록"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :useRownum="false"
            :span-options="gridOptions.merge"
            @tableLinkClicked="tableLinkClicked"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="'작업환경측정결과 통계 목록'"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @btnSearchClicked="btnSearchClicked"
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
  /** attributes: name, components, props, data **/
  name: 'work-measure-result-statistics',
  props: {},
  data() {
    return {
      gridOptions: {
        name: 'workMeasureResultTable',
        btns: [],
        header: [],
        data: [],
        height: '350',
        merge: [],
      },
      YAuiGrid: null,
      chartOption: {
        header: [],
        data: [],
        height: 'auto',
        year: [],
      },
      searchParam: {
        plantCd: '',
        deptCd: '',
        period: [],
        processCd: '',
        hazardNm: '',
        tap: 'table',
        deptSubYn: 'Y', // 하위부서여부 사용
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '70%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      component: null,

      editable: true,
      searchUrl: '',
      chartUrl: '',
      defaultHeaders: [],
      workAreaGrades: [], // 유해인자대분류
    };
  },
  watch: {
    'searchParam.period'() {
      let gap =
        Number(this.searchParam.period[1].substring(0, 4)) -
        Number(this.searchParam.period[0].substring(0, 4));

      if (gap > 2) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            'M0000001162' /* 기간 검색조건은 최대 2년까지 검색가능합니다 */,
          type: 'warning',
        });
        return;
      }
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    // window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam.period = [];
      this.searchParam.period.push(this.$comm.moment().format('YYYY'));
      this.searchParam.period.push(this.$comm.moment().format('YYYY'));

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004366'),
          dataField: 'plant_nm',
          width: '13%',
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004367'),
          dataField: 'dept_nm',
          width: '13%',
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'process_nm',
          width: '14%',
          cellMerge: true,
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClicked',
        },
      ];
      // this.setGridHeaders();

      this.searchUrl = selectConfig.hea.workMeasureResult.status.url;
      this.chartUrl = selectConfig.hea.workMeasureResult.chart.url;

      this.gridOptions.merge = [];
      this.gridOptions.merge.push({ index: 0, field: 'plant_nm' });
      this.gridOptions.merge.push({ index: 1, field: 'dept_nm' });
      this.gridOptions.merge.push({ index: 2, field: 'process_nm' });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie(
        this.searchParam.tap
      );
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getWorkAreaGradeItems().then(() => {
        this.setGridHeaders().then(() => {
          this.getDataList();
        });
      });
      this.searchParam.deptSubYn = 'Y';
    },
    /** /초기화 관련 함수 **/
    getDataList() {
      if (
        !this.searchParam.period ||
        this.searchParam.period.length !== 2 ||
        !this.searchParam.period[0] ||
        !this.searchParam.period[1]
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000475', // 기간은 필수 검색조건입니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.searchParam.workAreaGrades = this.$_.map(
        this.workAreaGrades,
        'code'
      );

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(this.gridOptions.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
      /*
      this.$http.url = this.chartUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.chartOption.data = _result.data;
          this.chartOption.year = [
            this.searchParam.period[0],
            this.searchParam.period[1],
          ];
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
      */
    },
    setGridHeaders() {
      return new Promise((resolve) => {
        let startYear = this.searchParam.period[0].substring(0, 4);
        let endYear = this.searchParam.period[1].substring(0, 4);
        let gap = endYear - startYear;
        // this.gridOptions.header = this.$_.clone(this.defaultHeaders);

        for (startYear; startYear <= endYear; startYear++) {
          this.gridOptions.header.push({
            headerText:
              startYear + this.$comm.getLangSpecInfoLabel('L0000000828'), // 년
            children: [],
          });

          for (let i = 0; i < this.workAreaGrades.length; i++) {
            this.gridOptions.header[
              this.gridOptions.header.length - 1
            ].children.push({
              headerText: this.workAreaGrades[i].codeNm, // 하반기
              children: [
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000001525'),
                  dataField:
                    startYear + '_FHALF_' + this.workAreaGrades[i].code,
                  width: '10%',
                  style: 'right-align',
                  renderer: {
                    type: 'LinkRenderer',
                    baseUrl: 'javascript',
                    jsCallback: function (
                      rowIndex,
                      columnIndex,
                      value,
                      item
                    ) {},
                  },
                },
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000003164'),
                  dataField:
                    startYear + '_SHALF_' + this.workAreaGrades[i].code,
                  width: '10%',
                  style: 'right-align',
                  renderer: {
                    type: 'LinkRenderer',
                    baseUrl: 'javascript',
                    jsCallback: function (
                      rowIndex,
                      columnIndex,
                      value,
                      item
                    ) {},
                  },
                },
                {
                  headerText: this.$comm.getLangSpecInfoLabel('L0000001686'),
                  dataField:
                    startYear + '_CHALF_' + this.workAreaGrades[i].code,
                  width: '10%',
                  style: 'right-align',
                  renderer: {
                    type: 'LinkRenderer',
                    baseUrl: 'javascript',
                    jsCallback: function (
                      rowIndex,
                      columnIndex,
                      value,
                      item
                    ) {},
                  },
                },
              ],
            });
          }
        }
        resolve();
      });
    },
    // 유해인자대분류
    getWorkAreaGradeItems() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = this.$format(
          selectConfig.codeMaster.getSelect.url,
          'WORK_AREA_GRADE'
        );
        this.$http.type = 'get';
        this.$http.request(
          (_result) => {
            this.workAreaGrades = _result.data.reverse();
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
      });
    },
    /** Button Event **/
    btnSearchClicked() {
      this.getDataList();
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** /Button Event **/
    cellClickHandler(event) {
      if (
        event.dataField === 'plant_nm' ||
        event.dataField === 'dept_nm' ||
        event.dataField === 'process_nm'
      ) {
        return;
      }
      let year = event.dataField.split('_')[0]; // 측정년도
      let halfYearCd = event.dataField.split('_')[1]; // 측정분기
      let workAreaGradeCd = event.dataField.split('_')[2]; // 유해인자대분류

      console.log('111', event);
      this.popupOptions.target = () =>
        import(`${'./workMeasureResultStatus.vue'}`);

      this.popupOptions.title = 'L0000002442';
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: event.item.plant_cd, // 사업장
        year: year, // 측정년도
        deptCd: event.item.dept_cd, // 측정부서
        processCd: event.item.process_cd, // 측정공정코드
        halfYearCd: halfYearCd, // 측정분기
        workAreaGradeCd: workAreaGradeCd, // 유해인자대분류
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkClicked(header, row) {
      let year = header['name'].split('_')[0]; // 측정년도
      let halfYearCd = header['name'].split('_')[1]; // 측정분기
      let workAreaGradeCd = header['name'].split('_')[2]; // 유해인자대분류

      this.popupOptions.target = () =>
        import(`${'./workMeasureResultStatus.vue'}`);

      this.popupOptions.title = 'L0000002442';
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: row.plant_cd, // 사업장
        year: year, // 측정년도
        deptCd: row.dept_cd, // 측정부서
        processCd: row.process_cd, // 측정공정코드
        halfYearCd: halfYearCd, // 측정분기
        workAreaGradeCd: workAreaGradeCd, // 유해인자대분류
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
  },
};
</script>
