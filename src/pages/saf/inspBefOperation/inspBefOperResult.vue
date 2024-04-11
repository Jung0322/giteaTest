<!--
  목적 : 설비점검 - 설비점검계획 목록
  Detail : 설비점검계획 목록 화면으로 이미 등록된 계획을 선택하여 결과를 등록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000767"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 완료여부 -->
          <y-select
            :width="8"
            :comboItems="checkEndYnItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="chkEndYn"
            label="L0000002040"
            v-model="searchParam.chkEndYn"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검주관부서 -->
          <y-tree-dept
            type="search"
            label="L0000002578"
            name="deptCd"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검대상부서 -->
          <y-tree-dept
            type="search"
            label="L0000002549"
            name="tDeptCd"
            :showAllDept="false"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.tDeptCd"
            :deptSubYn="searchParam.tDeptSubYn"
            @setDeptSubYn="setTDeptSubYn"
          />
        </b-col>
         <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검수행부서 -->
          <y-tree-dept
            type="search"
            label="L0000004852"
            name="pDeptCd"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.pDeptCd"
            :deptSubYn="searchParam.pDeptSubYn"
            @setDeptSubYn="setPDeptSubYn"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 점검명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002551"
            name="keyword"
            v-model="searchParam.keyword"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             무계획결과등록 
            <y-btn
              v-if="editable"
              title="L0000001034"
              color="orange"
              @btnClicked="openDetailPopup"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getList"
            />
          </div>
           가동전점검결과 목록 
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="editable"
            :use-paging="true"
            :useRownum="false"
            label="L0000003989"
            @tableLinkClicked="tableLinkCheckTitleClicked"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003989')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @openDetailPopup="openDetailPopup"
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
  name: 'facil-chk-result-plan-list',
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '',
        deptCd: '',
        pDeptCd: '',
        tDeptCd: '',
        safCheckTypeCd: '', // 점검종류
        checkStepCd: 'CHS02', // 점검진행상태
        chkEndYn: '',
        period: [],
        keyword: '', // 점검명
        deptSubYn: 'Y', // 하위부서여부 사용
        tDeptSubYn: 'Y', // 하위부서여부 사용
        pDeptSubYn: 'Y', // 하위부서여부 사용
      },
      gridOptions: {
        name: 'inspBefOperResult',
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
        width: '90%',
        top: '10px',
        closeCallback: null,
      },
      editable: false,
      comboCheckTypeItems: [], // 점검종류
      checkStepCdItems: [],
      checkEndYnItems: [], // 완료여부
      searchUrl: '',
    }
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
  beforeDestroy() {
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.saf.befInspPlan.list.url;

      this.checkEndYnItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000002039') }, // 완료
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000003563') } // 미완료
      ]

      this.searchParam.deptSubYn = 'Y';
      this.searchParam.tDeptSubYn = 'Y';
      this.searchParam.pDeptSubYn = 'Y';

      this.checkStepCdItems = [
        { code: 'CHS02', codeNm: this.$comm.getLangSpecInfoLabel('L0000003478') }, // 계획완료 
        { code: 'CHS04', codeNm: this.$comm.getLangSpecInfoLabel('L0000003643') }, // 점검완료
      ]
      
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000452'), 
          dataField: 'rbizApprStepNm', 
          width: '10%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002551'), 
          dataField: 'safFacilChkTitle', 
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002570'), 
          dataField: 'safFacilityCheckYmd', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002578'), 
          dataField: 'deptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002549'), 
          dataField: 'tdeptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004852'), 
          dataField: 'pdeptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002040'), 
          dataField: 'chkEndYnNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004068'), 
          dataField: 'safCheckTypeNm', 
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
          title: this.$comm.getLangSpecInfoLabel('L0000001034'),
          color: 'orange',
          btnClicked: 'openDetailPopup',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ]

      var from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-2y',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.period = [from, to];

      this.$comm.getComboItems('SAF_PREOPERATION_CHECK', true).then(_result => {
        this.comboCheckTypeItems = _result;
      });

      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'rbizApprStepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'safFacilChkTitle') {
        if (!event.item) return;
        this.openDetailPopup(event.item);
      }     
    },
    tableLinkCheckTitleClicked(header, data) {
      if (header.name === 'rbizApprStepNm') {
        this.showApprProgressPopup(data);
      } else {
        if (!data) return;
        this.openDetailPopup(data);
      }      
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.apprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openDetailPopup(data) {
      this.popupOptions.target = () => import(`${'./inspBefOperResultDetail.vue'}`);
      this.popupOptions.title = 'L0000003990'; // 가동전점검결과 상세
      this.popupOptions.param = data
        ? {
          safFacilChkNo: data.safFacilChkNo, // 가동전점검번호
        }
        : {
          safFacilChkNo: 0, // 가동전점검마스터번호
          stepStatus: '',
        }
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setTDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.tDeptSubYn = _result;
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    // 하위부서 포함 조회 관련 함수 추가
    setPDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.pDeptSubYn = _result;
    },
  },
};
</script>