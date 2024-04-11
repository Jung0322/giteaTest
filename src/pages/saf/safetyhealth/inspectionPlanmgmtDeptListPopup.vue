<!--
  목적 : 대상부서 상태 팝업
  Detail : 대상부서 상태 팝업
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
            <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
          </div>
           대상부서 목록 
          <y-data-table
            label="L0000000928"
            ref="dataTable"
            :headers="gridOptions.header"
            :items="gridOptions.data"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000928')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @closePopup="closePopup('CLOSE')"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'appr-progress-popup',
  props: {
    popupParam: {
      type: Object,
      default() {
        return {
          assessPlanNo: 0,
          apprFlag: '',
          regRegdemCd: '',
        };
      },
    },
  },
  data() {
    return {
      editable: true,
      searchParam: {
        assessPlanNo: 0,
        apprFlag: '',
        regRegdemCd: '',
      },
      gridOptions: {
        name: 'inspectionPlanmgmtDeptListPopup',
        btns: [],
        header: [],
        data: [],
        height: '250',
        merge: [],
      },
      YAuiGrid: null,
      searchUrl: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam = this.popupParam;
      // Url Setting
      this.searchUrl = selectConfig.rsa.planmgmt.deptList.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), 
          dataField: 'deptNm', 
          width: '15%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004977'), 
          dataField: 'chkStartDt', 
          width: '15%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004978'), 
          dataField: 'chkEndDt', 
          width: '15%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
          dataField: 'chkDesc', 
          style: 'left-align',
          width: '25%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004979'), 
          dataField: 'chkFinishYn', 
          width: '15%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004980'), 
          dataField: 'chkFinishDt', 
          width: '15%', 
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        },
      ]

      this.getList();
    },
    getList() {
      this.$http.url = selectConfig.saf.inspection.deptList.url;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data))
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
  },
};
</script>
