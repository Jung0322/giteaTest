<!--
  목적 : 근골격계 체크리스트 목록
  작성자 : ksw
  수정자 : jkl(2021.03.28)
  Detail : 체크리스트 목록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 조사기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            type="year"
            label="L0000002646"
            name="heaCheckupPlanPeriod"
            :default="searchParam.heaCheckupPlanPeriod"
            v-model="searchParam.heaCheckupPlanPeriod"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 조사계획명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            type="search"
            label="L0000004373"
            name="researchNm"
            v-model="searchParam.researchNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 진행단계 -->
          <y-select
            :width="8"
            :comboItems="muscResearchStateItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002777"
            name="muscResearchStateCd"
            v-model="searchParam.muscResearchStateCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 조사대상부서 -->
          <y-tree-dept
            :plantCd="searchParam.plantCd"
            type="search"
            label="L0000004264"
            name="deptCd"
            v-model="searchParam.deptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="btnSearchClicked" />
          </div>
           근골격계 조사 목록 
          <y-data-table
            label="L0000000741"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000741')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @btnSearchClicked="btnSearchClicked"
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
  /** attributes: name, components, props, data **/
  name: 'check-result-harmful-list',
  props: {},
  data() {
    return {
      searchParam: {
        heaCheckupPlanPeriod: '',
        researchNm: '',
        muscResearchStateCd: 'HMCS999',
        plantCd: '',
        deptCd: '',
        deptSubYn: 'Y', // 하위부서여부 사용
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
      gridOptions: {
        name: 'checkResultHarmfulList',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      editable: false,
      muscResearchStateItems: [],
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
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      // URL 셋팅
      this.searchUrl = selectConfig.hea.muscResearch.resultlist.url;

      let today = this.$comm.getThisYear();
      this.searchParam.heaCheckupPlanPeriod = [today, today];

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002777'),
          dataField: 'muscResearchStateNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000829'),
          dataField: 'year',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004373'),
          dataField: 'researchNm',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002648'),
          dataField: 'researchDesc',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004264'),
          dataField: 'deptNms',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002647'),
          dataField: 'researchOrgNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002646'),
          dataField: 'duration',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '10%',
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
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClicked',
        },
      ];
      this.searchParam.deptSubYn = 'Y';
      this.getComboItems();

      this.getList();
    },
    // 조사구분
    getComboItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'HEA_MUSC_STEP'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.muscResearchStateItems = this.$_.clone(_result.data);
          this.muscResearchStateItems = this.$_.drop(
            this.muscResearchStateItems
          );
          this.muscResearchStateItems = this.$_.drop(
            this.muscResearchStateItems
          );
          this.muscResearchStateItems = this.$_.drop(
            this.muscResearchStateItems
          );
          this.muscResearchStateItems.splice(0, 0, {
            code: 'HMCS999',
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 375;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    cellClickHandler(event) {
      if (event.dataField !== 'researchNm') return;
      this.popupOptions.target = () =>
        import(`${'./checkResultHarmfulDetail.vue'}`);
      this.popupOptions.param = {
        insertMode: false,
        muscResearchNo: Number(event.item.muscResearchNo),
        muscResearchStateCd: event.item.muscResearchStateCd,
      };
      this.popupOptions.title = 'L0000004395'; // 유해요인조사및평가
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkClicked(header, row) {
      if (!row) {
        return;
      }
      this.popupOptions.target = () =>
        import(`${'./checkResultHarmfulDetail.vue'}`);
      this.popupOptions.param = {
        insertMode: false,
        muscResearchNo: Number(row.muscResearchNo),
        muscResearchStateCd: row.muscResearchStateCd,
      };
      this.popupOptions.title = 'L0000004395'; // 유해요인조사및평가
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    btnSearchClicked() {
      this.getList();
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
  },
};
</script>
