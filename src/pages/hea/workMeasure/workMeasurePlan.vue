<!--
  목적 : 보건 > 작업환경측정 > 작업환경측정 계획
  Detail : 작업환경 측정 계획 목록 화면
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
          <!-- 측정년도 -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000002931"
            name="year"
            :default="searchParam.year"
            v-model="searchParam.year"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 측정계획명 -->
          <y-text
            :width="8"
            label="L0000002926"
            name="measPlanNm"
            v-model="searchParam.measPlanNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 진행상태 -->
          <y-select
            :width="8"
            :comboItems="workMeasStateCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002779"
            name="workMeasStateCd"
            v-model="searchParam.workMeasStateCd"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="openPopup"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getList"
            />
          </div>
          작업환경측정계획 목록 
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            label="L0000002444"
            @tableLinkClicked="tableLinkClicked"
          />
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002444')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getList="getList"
          @openPopup="openPopup"
          @cellClick="cellClickHanlder"
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
  name: 'work-measure-plan',
  data() {
    return {
      searchParam: {
        plantCd: null, // 사업장
        year: null, // 측정년도
        measPlanNm: null, // 측정계획명
        workMeasStateCd: '',
      },
      gridOptions: {
        name: 'workMeasurePlan',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: null,
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      editable: false,
      workMeasStateCdItems: [],
    };
  },
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

      this.$comm.getComboItems('WORK_MEAS_STATE_CD', true).then((_result) => {
        this.workMeasStateCdItems = _result;
      });

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002931'),
          dataField: 'year',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001337'),
          dataField: 'halfYearNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002926'),
          dataField: 'measPlanNm',
          width: '19%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002929'),
          dataField: 'measPeriod',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002930'),
          dataField: 'measAgency',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'),
          dataField: 'workMeasStateNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000452'),
          dataField: 'bizApprStepNm',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openPopup',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
      this.searchParam.year = this.$comm.getThisYear();

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    getList() {
      this.$http.url = selectConfig.hea.workMeasurePlan.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.$_.forEach(
            _result.data,
            (item) =>
              (item.measPeriod = item.measDtSta + ' ~ ' + item.measDtEnd)
          );
          // this.gridOptions.data = this.$_.clone(_result.data);
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
    cellClickHanlder(event) {
      if (event.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'measPlanNm') {
        if (event.item === null || event.item === undefined) return;
        this.openPopup(event.item);
      }
    },
    tableLinkClicked(header, data) {
      if (header.name === 'bizApprStepNm') {
        this.showApprProgressPopup(data);
      } else {
        if (data === null || data === undefined) return;
        this.openPopup(data);
      }
    },
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'@/pages/hea/workMeasure/workMeasurePlanDetail.vue'}`);
      this.popupOptions.title = data ? 'L0000002445' : 'L0000004096'; // '작업환경측정계획 상세' : '작업환경측정계획 등록'
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        workMeasPlanNo: data ? data.workMeasPlanNo : 0,
        bizApprStepCd: data.bizApprStepCd,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.planApprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
  },
};
</script>
