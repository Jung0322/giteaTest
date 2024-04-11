<!--
  목적 : 검진결과 상세 - 검사항목
  Detail : 
  examples:
  -->
<template>
  <b-container fluid>
    <!-- <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             닫기 
            <y-btn title="L0000000881" @btnClicked="closePopup" />
          </div>
           조사부서 제출 목록 
          <y-data-table
            ref="dataTable"
            label="L0000002656"
            :headers="gridItemResultHeaderOptions"
            :items="gridItemResultData"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002656')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @closePopup="closePopup"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'check-result-dept-send',
  props: {
    popupParam: {
      type: Object,
      default: {
        muscResearchNo: 0,
      },
    },
  },
  data() {
    return {
      editable: false,
      gridItemResultData: [],
      gridItemResultHeaderOptions: [],
      searchUrl: '',
      gridOptions: {
        name: 'checkResultDeptSend',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
    };
  },
  watch: {},
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.searchUrl = selectConfig.hea.muscResearchDept.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002658'),
          dataField: 'deptNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002634'),
          dataField: 'sendYn',
          width: '40%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002636'),
          dataField: 'sendUserNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002635'),
          dataField: 'sendDt',
          width: '20%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        },
      ];
      this.getList();
    },
    /** /초기화 관련 함수 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.popupParam;
      this.$http.request(
        (_result) => {
          // this.gridItemResultData = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
        }
      );
    },
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup');
    },
  },
};
</script>
