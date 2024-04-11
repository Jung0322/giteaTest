<!--
  목적 : 교육결과 등록 팝업 > 교육이수자 탭
  작성자 : kkc
  Detail : 교육결과 등록 팝업 > 교육이수자 탭
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- <b-row class="mt-3" ref="insertBox">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
           교육이수자 
          <y-data-table
            label="L0000000668"
            ref="dataTable"
            grid-type="edit"
            :editable="!viewMode"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @selectedRow="changeSelectedRow"
            :excelDown="true"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000668')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'edu-result-person',
  props: {
    eduMaster: {
      safEduMstNo: 0,
      eduAttCd: null,
      safEduCourseNo: null,
      eduTypeCd: null,
      deptCd: null,
      eduNm: '',
      duration: [],
      eduTime: 0,
      eduSYmd: '',
      eduEYmd: '',
      eduPlace: '',
      eduTeacher: '',
      eduContent: '',
      processStepCd: '',
      eduResultSummary: '',
      eduEvalOpin: '',
      personList: [],
      reEduPersonYn: false,
    },
    viewMode: false,
  },
  data: () => ({
    gridOptions: {
      name: 'eduResultPersonPopup',
      header: [],
      data: [],
      height: 300,
      selectedRowData: {
        completYn: '',
        reEduYn: '',
      },
    },
    YAuiGrid: null,
    editable: true,
    searchUrl: '',
  }),
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
    /** 초기화 관련 함수 **/
    init() {
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001662'), 
          dataField: 'deptNm', 
          width: '10%', 
          editable: false
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'), 
          dataField: 'userNm', 
          width: '10%', 
          editable: false
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002212'), 
          dataField: 'completYn', 
          width: '10%', 
          renderer: {
            type: "CheckBoxEditRenderer",
            editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
            checkValue: 'Y', // true, false 인 경우가 기본
            unCheckValue: 'N',
            disabledFunction: () => {
              return true;
            },
          }
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001362'), 
          dataField: 'remark', 
          width: '25%', 
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002463'), 
          dataField: 'reEduNotYn', 
          width: '10%', 
          renderer: {
            type: "CheckBoxEditRenderer",
            editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
            checkValue: 'Y', // true, false 인 경우가 기본
            unCheckValue: 'N',
            disabledFunction: () => {
              return true;
            },
          }
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002891'), 
          dataField: 'eduEvalPnt', 
          width: '15%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000097'), 
          dataField: 'eduEvalPntSec', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003651'), 
          dataField: 'eduEvalTime', 
          width: '10%', 
        },       
      ];

      this.searchUrl = selectConfig.saf.education.eduDetailPerson.list.url;

      this.getList();
    },

    getList() {
      this.$http.url = this.searchUrl;

      this.$http.type = 'GET';
      this.$http.param = {
        safEduMstNo: this.eduMaster.safEduMstNo,
      };
      this.$http.request(
        _result => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));

          // this.$_.forEach(this.gridOptions.data, item => {
          this.$_.forEach(this.eduMaster.personList, item => {
            if (item.completYn === 'N' && item.reEduNotYn === 'N') {
              this.eduMaster.reEduPersonYn = true;
            }
          });
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    changeSelectedRow(row) {
      this.gridOptions.selectedRowData = row;
    },
  },
};
</script>