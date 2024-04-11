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
    <!-- <b-row ref="insertBox">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          교육이수자 
          <y-data-table
            label="L0000000668"
            ref="dataTable"
            grid-type="edit"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="eduMaster.personList"
            @selectedRow="changeSelectedRow"
            :excelDown="editable"
            :editable="editable && !authDuringAppr && !search"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="true"
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
          :showRowCheckColumn="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @cellEditEnd="cellEditEndHandler"
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
    authDuringAppr: false,
    search: false,
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
    parentEditable: null,
    refresh: false,
  },
  data: () => ({
    gridOptions: {
      name: 'eduResultPerson',
      header: [],
      data: [],
      height: 300,
      selectedRowData: {
        completYn: '',
        reEduYn: '',
      },
    },
    YAuiGrid: null,
    editable: false,
    searchUrl: '',
    test: false,
  }),
  watch: {
    'eduMaster.safEduMstNo': {
      handler: function (newValue, oldValue) {
        this.getList();
      },
      deep: true,
    },
    parentEditable: {
      handler: function (newValue, oldValue) {
        if (this.editable) {
          this.editable = this.parentEditable;
        }
      },
    },
    refresh(newVal, oldVal) {
      this.getList();
    },
  },

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
      this.editable = this.$route.meta.editable;
      if (this.editable) {
        this.editable = this.parentEditable;
      }

      let Mythis = this;
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
            disabledFunction: function(rowIndex, columnIndex, value, isChecked, item, dataField) {
              if (!isChecked) {
                item.completYmd = ''
              }              
              return false;
            }
          }
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002467'), 
          dataField: 'reCompletYn', 
          width: '10%', 
          editable: false,
          renderer: {
            type: "CheckBoxEditRenderer",
            editable: false, // 체크박스 편집 활성화 여부(기본값 : false)
            checkValue: 'Y', // true, false 인 경우가 기본
            unCheckValue: 'N',
            disabledFunction: () => {
              return true;
            },
          }
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002217'), 
          dataField: 'completYmd', 
          width: '10%',        
          editRenderer: {
            type: "ConditionRenderer", 
            conditionFunction: function (rowIndex, columnIndex, value, item, dataField) {
              if (item.completYn === 'Y') {
                return {
                  type: "CalendarRenderer",
                  onlyCalendar: true, 
                  showExtraDays: true,
                  defaultFormat: 'yyyy-mm-dd', 
                };
              } else {
                return {
                  type: "InputEditRenderer",
                  onlyNumeric: true,
                  validator: function(oldValue, newValue, item, dataField, fromClipboard, which) {
                    item.completYmd = ''
                    var isValid = false;
                    return { "validate": isValid, "message": "이수여부를 체크하지 않으면 이수일을 입력할 수 없습니다" };
                  }
                };
              }           
            }
          }
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001362'), 
          dataField: 'remark', 
          width: '10%', 
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
          }
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002891'), 
          dataField: 'eduEvalPnt', 
          width: '10%', 
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
          editable: false,
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
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.eduMaster.personList = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.eduMaster.personList)

          // this.$_.forEach(this.gridOptions.data, item => {
          this.$_.forEach(this.eduMaster.personList, (item) => {
            if (item.completYn === 'N' && item.reEduNotYn === 'N') {
              this.eduMaster.reEduPersonYn = true;
            }
          });
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    cellEditEndHandler(event) {
      this.eduMaster.personList = this.YAuiGrid.getGridData();
    },
    changeSelectedRow(row) {
      this.gridOptions.selectedRowData = row;
    },
  },
};
</script>
