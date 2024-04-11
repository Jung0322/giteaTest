<!--
  목적 : 보건 > 검진 > 대상자지정
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
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            type="year"
            :range="true"
            label="L0000000767"
            name="heaCheckupPlanPeriod"
            :default="searchParam.heaCheckupPlanPeriod"
            v-model="searchParam.heaCheckupPlanPeriod"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 검진 종류 -->
          <y-select
            :width="8"
            :comboItems="searchHeaCheckupClassItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000346"
            name="heaCheckupClassCd"
            v-model="searchParam.heaCheckupClassCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000355"
            name="heaCheckupPlanNm"
            v-model="searchParam.heaCheckupPlanNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <div class="float-right mb-1">
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           검진계획 목록 
          <y-data-table
            label="L0000000354"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000354')"
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
export default {
  /* attributes: name, components, props, data */
  name: 'checkup-org-calendar',
  data: function () {
    return {
      searchParam: {
        heaCheckupPlanPeriod: [],
        plantCd: '', // 사업장 코드
        heaCheckupClassCd: '', // 검진 종류
        startDate: null, // 기간 시작
        endDate: null, // 기간 끝
        heaCheckupPlanNm: '', // 검진계획명
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchHeaCheckupClassItems: [],
      gridOptions: {
        name: 'checkupOrgCalendar',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      searchUrl: '',
    };
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
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.hea.checkupPlan.list.url;

      // let today = this.$comm.moment().format('YYYY');
      let today = this.$comm.getThisYear();
      this.searchParam.heaCheckupPlanPeriod = [today, today];
      this.getComboItems();

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000373'),
          dataField: 'heaCheckupClassNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000355'),
          dataField: 'heaCheckupPlanNm',
          width: '30%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000356'),
          dataField: 'heaCheckupPlanPeriod',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '15%',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
    },
    // 검진 종류
    getComboItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'HEA_CHECKUP_CLASS'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.searchHeaCheckupClassItems = this.$_.clone(_result.data);

          this.searchHeaCheckupClassItems.splice(0, 0, {
            code: '',
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
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
    getList() {
      this.searchParam.startDate = this.searchParam.heaCheckupPlanPeriod[0];
      this.searchParam.endDate = this.searchParam.heaCheckupPlanPeriod[1];
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.dataField !== 'heaCheckupPlanNm') return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '90%';
      this.popupOptions.target = () =>
        import(`${'./checkupOrgCalendarDetail.vue'}`);
      this.popupOptions.title = 'L0000000935'; // 대상자 선정
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '90%';
      this.popupOptions.target = () =>
        import(`${'./checkupOrgCalendarDetail.vue'}`);
      this.popupOptions.title = 'L0000000935'; // 대상자 선정
      this.popupOptions.visible = true;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },

    /** button 관련 이벤트 **/
    /** end button 관련 이벤트 **/
  },
};
</script>
