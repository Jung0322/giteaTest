<!--
  목적 : 중처법 업무별 개선사항 목록 조회 팝업
  Detail : 중처법 업무별 개선사항 목록 조회 팝업 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             닫기 
            <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
          </div>
           개선사항 목록 
          <y-data-table
            ref="dataTable"
            :use-paging="true"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            label="L0000005000"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005000')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @btnClosePopup="btnClosePopup"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'impr-act',
  props: {
    popupParam: {
      imprClassCd: '', // 업무구분
      refTableId: 0, // 관련 업무 테이블Id
      apprFlag: '', // 결재완료 조회 flag
      monFlag: '', // 월
      strParam: '', // 업무별 필수 검색조건
      subPlantCd: '', // 합계 row 여부
      actClassCd: null,
      year: ''
    },
  },
  data() {
    return {
      searchParam: {
        imprClassCd: '', // 업무구분
        refTableId: 0, // 관련 업무 테이블Id
        apprFlag: '', // 결재완료 조회 flag
      },
      gridOptions: {
        name: 'imprActPopup',
        btns: [],
        header: [],
        data: [],
        height: '500',
        label: '',
      },
      YAuiGrid: null,
      searchUrl: '',
      editable: true,
      companyEditable: false,
      plantEditable: false,
      deptEditable: false,
    };
  },
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.searchUrl = selectConfig.saf.imprAct.list.url;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002668'), 
          dataField: 'actClassNm', 
          width: '5%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '7%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005032'), 
          dataField: 'imprTitle', 
          width: '13%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000267'), 
          dataField: 'imprRqstContents', 
          width: '15%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002666'), 
          dataField: 'actResultContents', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005033'), 
          dataField: 'imprStepNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002673'), 
          dataField: 'actDeptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002670'), 
          dataField: 'actLimitYmd', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002694'), 
          dataField: 'actConfirmYmd', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002040'), 
          dataField: 'completYn', 
          width: '10%', 
        },

      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClosePopup',
        },
      ]
      if (this.popupParam.imprClassCd) {
        this.searchParam.imprClassCd = this.popupParam.imprClassCd;
      }

      if (this.popupParam.refTableId) {
        this.searchParam.refTableId = this.popupParam.refTableId;
      }

      if (this.popupParam.apprFlag) {
        this.searchParam.apprFlag = this.popupParam.apprFlag;
      }

      if (this.popupParam.monFlag) {
        this.searchParam.monFlag = this.popupParam.monFlag;
      }

      if (this.popupParam.strParam) {
        this.searchParam.strParam = this.popupParam.strParam;
      }

      if (this.popupParam.subPlantCd) {
        this.searchParam.subPlantCd = this.popupParam.subPlantCd;
      }

      if (this.popupParam.actClassCd) {
        this.searchParam.actClassCd = this.popupParam.actClassCd;
      }

      if (this.popupParam.year) {
        this.searchParam.year = this.popupParam.year;
      }

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
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnClosePopup() {
      this.$emit('closePopup');
    },
    /** button 관련 이벤트 **/
    /** end button 관련 이벤트 **/
  },
};
</script>
