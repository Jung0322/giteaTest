<!--
  목적 : 근골격계 유해인자 조사 유해요인 평가
  Detail : 유해요인 평가
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <!-- 유해요인 평가 -->
        <b-row>
          <b-col sm="12">
            <!-- <b-col sm="12" class="px-0">
               유해요인 원인 분석 
              <y-data-table
                ref="dataTableIn"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="harmful.muscHarmfulEvals"
                :print="true"
                :editable="!disabled && editable"
                :useRownum="false"
                label="L0000004392"
              ></y-data-table>
            </b-col> -->
            <b-col sm="12" class="h100p">
                <y-auigrid
                  ref="yAuiGrid"
                  :editable="true"
                  :name="gridOptions.name"
                  :headers="gridOptions.header"
                  :btns="gridOptions.btns"
                  :height="gridOptions.height"
                  :label="this.$comm.getLangSpecInfoLabel('L0000000877')"
                  :useExcelExport="false"
                  :enableCellMerge="true"
                  :enableSorting="true"
                  :showGridSetSave="true"
                  :useContextMenu="true"
                  :enableRightDownFocus="true"
                  :showGridCtrl="true"  
                  @cellEditEnd="cellEditEndHandler"
                />
              </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 종합소견 -->
              <y-textarea
                :width="12"
                :editable="editable"
                :disabled="disabled"
                :maxlength="150"
                ui="bootstrap"
                label="L0000002708"
                name="summaryOverall"
                v-model="harmful.summaryOverall"
              ></y-textarea>
            </b-col>
          </b-col>
        </b-row>
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
  name: 'survey-result',
  props: {
    disabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    harmful: {
      type: Object,
      default: function () {
        return {
          muscHarmfulNo: 0,
          muscHarmfulEvals: [],
          summaryOverall: '',
          muscHarmfulEvalNo: 0,
        };
      },
    },
    getFile: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    saveData: {
      type: Object,
      default: function () {
        return {
          files: [],
        };
      },
    },
  },
  data() {
    return {
      gridOptions: {
        name: 'harmfulEval',
        // 조사결과
        header: [],
        data: [],
        height: '300',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '1000px',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      muscResearchRsltNo: 0,
      finalValue: '',
      totExposureTime: 0,
      workCnt: 0,
      workTime: 0,
      workNm: '',
      chklistDesc: '',
      muscResearchChklistNo: 0,
      unitWorkNm: '',
      selectedValue: [],
      editable: false,
      updateUrl: '',
      searchUrl: '',
      finalValues: [],
      isEdit: false,
    };
  },
  watch: {
    // getFile() {
    //   let temp = this.$refs.dataTableIn.getSaveFiles();
    //   if (temp) {
    //     this.saveData.files = temp.files;
    //   }
    // },
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
    init() {
      this.editable = this.$route.meta.editable;

      this.setGridHeader().then(() => {
        console.log(this.harmful.muscHarmfulEvals)
        this.YAuiGrid.setGridData(this.harmful.muscHarmfulEvals)
      });

      // this.getList();
    },
    setGridHeader() {
      return new Promise((resolve) => {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000875'), 
            dataField: 'unitWorkNm', 
            width: '10%',   
            editable: false,        
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002389'), 
            dataField: 'workNm', 
            width: '10%',   
            editable: false,        
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001285'), 
            dataField: 'muscResearchChklistNo', 
            width: '10%',   
            editable: false,        
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002393'), 
            dataField: 'workload', 
            width: '10%',   
            editable: false,      
            style: 'right-align'  
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002397'), 
            dataField: 'workCnt', 
            width: '10%',   
            editable: false,      
            style: 'right-align'    
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002871'), 
            dataField: 'totalScore', 
            width: '10%',   
            editable: false,      
            style: 'right-align'    
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004391'), 
            dataField: 'causes', 
            width: '10%',   
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
            dataField: 'remark', 
            width: '10%',           
          },
          // {
          //   text: 'L0000001360', // 비고
          //   name: 'remark',
          //   width: '150px',
          //   align: 'center',
          //   type: 'text',
          //   maxlength: 300,
          // },
          // {
          //   text: 'L0000001490', // 사진
          //   name: 'files',
          //   width: '120px',
          //   align: 'center',
          //   type: 'attach',
          //   keyText: 'muscHarmfulEvalNo',
          //   accept: 'image/*',
          // },
        ];
        this.$comm.getComboItems('HEA_HARMFUL_FACTORS', false).then(_result => {
          this.gridOptions.header.splice(3, 0, {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002168'), 
            dataField: 'harmfulCode',
            width: '10%',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return _result;
              },
              keyField: 'code',
              valueField: 'codeNm',

            },
          })
        });
        resolve();
      })
    },
    cellEditEndHandler() {
      this.harmful.muscHarmfulEvals = this.YAuiGrid.getGridData();
      console.log(this.harmful.muscHarmfulEvals)
    },
    // btnVisitorAdd() {
    //   var date = new Date();
    //   this.gridVisitorOptions.data.splice(0, 0, {
    //     tempId: String(date.getTime()),
    //     col1: '',
    //     files: [],
    //   });
    // },
    // save() {
    //   let jsonString = [];
    //   this.$_.forEach(this.gridOptions.data, (item) => {
    //     jsonString.splice(0, 0, {
    //       muscHarmfulEvalNo: item.muscHarmfulEvalNo,

    //       tempId: item.tempId ? item.tempId : item.muscHarmfulEvalNo,
    //       createUserId: this.$store.getters.token,
    //     });
    //   });
    // },
    // getList() {
    //   if (!this.harmful.muscHarmfulNo) {
    //     return;
    //   } else {
    //     if (
    //       this.harmful.harmfulEvalItems &&
    //       this.harmful.harmfulEvalItems.length > 0
    //     ) {
    //       this.gridOptions.data = this.$_.clone(this.harmful.harmfulEvalItems);
    //     }
    //   }
    // },
    /**
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */

    /** end button 관련 이벤트 **/
  },
};
</script>
