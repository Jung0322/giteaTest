<!--
  목적 : 안전 > 안전점검 > 안전점검실적
  Detail : 안전점검실적 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 점검년도 -->
          <y-datepicker
            :width="8"
            :required="true"
            type="year"
            label="L0000002548"
            name="year"
            :default="searchParam.year"
            v-model="searchParam.year"
          ></y-datepicker>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0 checkResult">
          <div class="float-right mb-1">
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getList"
            />
          </div>
           사업장별 가동전점검실적 현황 
          <y-data-table
            ref="dataTable"
            label="L0000003995"
            :useRownum="false"
            :showSummary="true"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :messageCheck="editable"
            :message="gridMessage"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003995')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getList="getList"
          @cellClick="cellClickHandler"
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
  name: 'facil-chk-performance',
  props: {},
  data: () => ({
    searchParam: {
      year: '', // 기간(점검일)
      plantCd: '',
    },
    gridOptions: {
      name: 'inspBefOperEstablishment',
      btns: [],
      header: [],
      data: [],
      height: '470',
    },
    YAuiGrid: null,
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
    gridMessage: '',
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
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // 실적의 건수는 점검 대상 설비의 건수 입니다.
      this.gridMessage = 'M0000001016';
      // Url Setting
      this.searchUrl = selectConfig.saf.befInspResult.status.url;

      this.$comm
        .getComboItems('SAF_PREOPERATION_CHECK', true)
        .then((_result) => {
          this.comboCheckTypeItems = _result;
        });

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plant_nm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004071'),
          dataField: 'sum_plan',
          width: '8%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004072'),
          dataField: 'sum_result',
          width: '8%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002874'),
          dataField: 'sum',
          width: '8%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
      ];

      let today = this.$comm.getToday();
      this.searchParam.year = today.substring(0, 4);

      for (let i = 1; i < 13; i++) {
        let month = i < 10 ? '0' + i : i.toString();
        this.gridOptions.header.splice(i, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003663', {
            s1: i,
          }), // {s1}월
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000003642'),
              dataField: month + '_plan',
              width: '5%',
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002039'),
              dataField: month + '_result',
              width: '5%',
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            },
          ],
          sortable: false,
        });
      }
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
      this.getList();
    },
    /** 사고 현황 검색 **/
    getList() {
      if (!this.searchParam.year) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000339', // 년도를 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.searchYear = this.$_.clone(this.searchParam.year);
          this.searchPlantCd = this.$_.clone(this.searchParam.plantCd);
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          // this.$refs.dataTable.setCurrentRow(this.gridOptions.data[0]);
          // this.selectedRow(this.gridOptions.data[0]);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    cellClickHandler(event) {
      let completeYn = 'N';

      if (event.dataField === 'sum') {
        completeYn = '';
      } else if (event.dataField === 'sum_result') {
        completeYn = 'Y';
      } else if (event.dataField === 'sum_plan') {
        completeYn = 'N';
      } else if (event.dataField.split('_')[1] === 'plan') {
        completeYn = 'N';
      } else if (event.dataField.split('_')[1] === 'result') {
        completeYn = 'Y';
      }

      this.popupOptions.target = () =>
        import(`${'./inspBefOperResultTable.vue'}`);
      this.popupOptions.title = 'L0000003997'; // 가동전점검
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: event.item.plant_cd,
        year: this.searchYear,
        completeYn: completeYn,
        dtlYn: 'N',

        month:
          event.dataField !== 'sum' &&
          event.dataField !== 'sum_plan' &&
          event.dataField !== 'sum_result'
            ? event.dataField.substring(0, 2)
            : '',
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkClicked(header, row) {
      let completeYn = 'N';

      if (header.name === 'sum') {
        completeYn = '';
      } else if (header.name === 'sum_result') {
        completeYn = 'Y';
      } else if (header.name === 'sum_plan') {
        completeYn = 'N';
      } else if (header['name'].split('_')[1] === 'plan') {
        completeYn = 'N';
      } else if (header['name'].split('_')[1] === 'result') {
        completeYn = 'Y';
      }

      this.popupOptions.target = () =>
        import(`${'./inspBefOperResultTable.vue'}`);
      this.popupOptions.title = 'L0000003997'; // 가동전점검
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: row.plant_cd,
        year: this.searchYear,
        completeYn: completeYn,
        dtlYn: 'N',

        month:
          header['name'] !== 'sum' &&
          header['name'] !== 'sum_plan' &&
          header['name'] !== 'sum_result'
            ? header['name'].substring(0, 2)
            : '',
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam2.deptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>

<style></style>
