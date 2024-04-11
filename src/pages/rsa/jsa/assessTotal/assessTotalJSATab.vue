<!--
  목적 : 위험성평가 실행
  Detail : 위험성평가 실행 목록 화면
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
          <!-- 평가년도 -->
          <y-datepicker
            :width="8"
            :range="true"
            type="year"
            label="L0000003065"
            name="assessYear"
            :default="searchParam.assessYear"
            v-model="searchParam.assessYear"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 평가명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003081"
            name="assessNm"
            v-model="searchParam.assessNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 집계구분 -->
          <y-select
            :width="8"
            :comboItems="comboTotalDivisionItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002789"
            name="totalDivision"
            v-model="searchParam.totalDivision"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 담당자 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000004201"
            :disabled="true"
            name="userNm"
            v-model="searchParam.userNm"
            :appendIcon="[
              { icon: 'search', callbackName: 'searchUser' },
              { icon: 'times', callbackName: 'clear' },
            ]"
            @searchUser="btnSearchUserClicked"
            @clear="clear"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-1">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1">
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           평가결과집계 
          <y-data-table
            label="L0000003049"
            ref="dataTable"
            :print="true"
            :use-paging="true"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @tableLinkClicked="tableLinkAssessNmClicked"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003049')"
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
  name: 'assess-total-JSA-tab',
  props: {},
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '95%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        plantCd: '',
        assessYear: [],
        assessNm: '',
        totalDivision: 'PROCESS',
        flag: 'JSA',
        userNm: null,
        userId: '',
      },
      gridOptions: {
        name: 'assessTotalJSATab',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      comboTotalDivisionItems: [],
      searchUrl: '',
    };
  },
  watch: {
    'searchParam.totalDivision': {
      handler: function (val, oldVal) {
        this.getList();

        if (val === 'DEPT') {
          this.gridOptions.header.splice(3, 1);
        } else {
          this.gridOptions.header.splice(3, 0, {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
            dataField: 'processNm',
            width: '10%',
          });
        }
      },
      deep: true,
    },
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
    // window.addEventListener('resize', this.setGridSize);
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.setGridSize);
  },
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = selectConfig.rsa.assessTotal.list.url;

      let today = this.$comm.getToday();
      this.searchParam.assessYear = [
        today.substring(0, 4),
        today.substring(0, 4),
      ];
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
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003065'),
          dataField: 'assessYear',
          width: '5%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'),
          dataField: 'assessNm',
          width: '13%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002364'),
          dataField: 'processCnt',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000866'),
          dataField: 'jobStepCnt',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002153'),
          dataField: 'riskhazardCnt',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003085'),
          dataField: 'completCnt',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003084'),
          dataField: 'assessPercent',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002135'),
          dataField: 'jobRiskBookCnt',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000255'),
          dataField: 'imprActRequestCnt',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000257'),
          dataField: 'imprActCompletCnt',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000256'),
          dataField: 'imprActPercent',
          width: '7%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
      this.comboTotalDivisionItems = [
        {
          code: 'DEPT',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001287'),
        }, // 부서
        {
          code: 'PROCESS',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000000515'),
        }, // 공정
      ];
    },
    resizeGrid() {
      let _height = window.innerHeight - 385;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    cellClickHandler(event) {
      if (event.dataField !== 'assessNm') return;
      this.openDialogPage(event.item);
    },
    // combo box list
    tableLinkAssessNmClicked(header, data) {
      this.openDialogPage(data);
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
    openDialogPage(data) {
      this.popupOptions.param = {
        plantCd: data.plantCd,
        assessPlanNo: data.assessPlanNo,
        deptCd: data.deptCd,
        deptNm: data.deptNm,
        assessNm: data.assessNm,
        processCd: data.processCd,
        processNm: data.processNm,
        totalDivision: this.searchParam.totalDivision,
      };

      this.popupOptions.target = () =>
        import(`${'./assessTotalJSADialog.vue'}`);
      this.popupOptions.title = 'L0000003050'; // 평가결과집계 상세

      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },

    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** button 관련 이벤트 **/
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchUserClicked() {
      this.popupOptions.target = () =>
        import(`${'../../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.searchParam.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupUser;
    },
    closePopupUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.searchParam.userId = data.user.userId;
        this.searchParam.userNm = data.user.userNm;
      }
    },
    clear() {
      this.searchParam.userId = null;
      this.searchParam.userNm = null;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>

<style></style>
