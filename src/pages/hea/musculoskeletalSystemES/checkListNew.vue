<!--
  목적 : 근골격계 체크리스트 목록
  작성자 : ksw
  수정자 : jkl(2021.03.26)
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
            :comboItems="muscResearchStateCds"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000002777"
            name="muscResearchStateCd"
            v-model="searchParam.muscResearchStateCd"
          />
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
            신규등록 
            <y-btn v-if="editable" title="L0000001789" color="orange" @btnClicked="openPopup" />
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="btnSearchClicked" />
          </div>
          - 근골격계 조사 목록
          <y-data-table
            label="L0000000741"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            :useRownum="false"
            @tableLinkClicked="tableLinkClicked"
          >
             조사부서 제출여부 
            <el-table-column align="center" slot="tag" min-width="120px" :label="$comm.getLangSpecInfoLabel('L0000002657')">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-search"
                  circle
                  slot="reference"
                  size="mini"
                  @click="openSend(scope)"
                />
              </template>
            </el-table-column>
          </y-data-table>
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
          @openPopup="openPopup"
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
  name: 'check-list-new',
  props: {},
  data() {
    return {
      searchParam: {
        heaCheckupPlanPeriod: [],
        plantCd: '',
        deptCd: '',
        rshOrg: '',
        muscResearchStateCd: 'HMCS1',
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
        name: 'checkListNew',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      editable: false,
      muscResearchStateCds: [],
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
      this.searchUrl = selectConfig.hea.muscResearch.list.url;

      // 검색조건 설정
      let today = this.$comm.getThisYear();
      this.searchParam.heaCheckupPlanPeriod = [today, today];

      this.$comm.getComboItems('HEA_MUSC_STEP', true).then((_result) => {
        this.muscResearchStateCds = _result;
      });

      // 배포화인
      let myThis = this;
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
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002657'),
          dataField: '',
          width: '10%',
          renderer: {
            type: 'ButtonRenderer',
            labelText: '상세 보기',
            onClick: function (event) {
              myThis.openSend(event);
            },
          },
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
          btnClicked: 'btnSearchClicked',
        },
      ];
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.searchParam.deptSubYn = 'Y';
      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField !== 'researchNm') return;
      this.openPopup(event.item);
    },
    tableLinkClicked(header, data) {
      this.openPopup(data);
    },
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./checkListDetailNew.vue'}`);
      this.popupOptions.title = 'L0000000740'; // 근골격계 사전조사 상세
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        muscResearchNo: data ? data.muscResearchNo : 0,
      };

      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnSearchClicked() {
      this.getList();
    },
    openSend(scope) {
      this.popupOptions.param = {
        muscResearchNo: scope.item.muscResearchNo,
      };
      this.popupOptions.target = () => import(`${'./checkResultDeptSend.vue'}`);
      this.popupOptions.title = 'L0000002657'; // 조사부서 제출여부
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSend;
    },
    resizeGrid() {
      let _height = window.innerHeight - 385;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    closePopupSend() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
  },
};
</script>
