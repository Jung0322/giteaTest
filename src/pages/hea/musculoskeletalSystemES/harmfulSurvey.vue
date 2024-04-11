<!--
  목적 : 근골격계 유해인자 조사 작업조건 조사
  Detail :  작업조건 조사
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <!--  단위작업별 작업부하 및 작업빈도 -->
        <b-row>
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <!-- 단위작업별 작업부하 및 작업빈도 -->
              <!-- <y-data-table
                ref="dataTableIn"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :print="true"
                :editable="!disabled && editable"
                :useRownum="false"
                label="L0000000877"
              ></y-data-table> -->
              <b-col sm="12" class="h100p">
                <y-auigrid
                  ref="yAuiGrid"
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
                />
              </b-col>
              <b-col sm="12" class="h100p">
                <y-auigrid
                  ref="auiGrid"
                  :editable="true"
                  :name="gridOptions2.name"
                  :headers="gridOptions2.header"
                  :btns="gridOptions2.btns"
                  :height="gridOptions2.height"
                  :label="this.$comm.getLangSpecInfoLabel('L0000000876')"
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
              <!-- 단위작업별 작업 목록 -->
              <!-- <y-data-table
                ref="dataTableIn"
                :height="gridOptions2.height"
                :headers="gridOptions2.header"
                :items="harmful.muscHarmfulEvals"
                :print="true"
                :editable="!disabled && editable"
                :useRownum="false"
                label="L0000000876"
              >
              작업부하(A) 
                <el-table-column
                  slot="tag"
                  prop="workload"
                  :label="$comm.getLangSpecInfoLabel('L0000002393')"
                  min-width="100px"
                  header-align="center"
                >
                  <template slot-scope="scope">
                    <el-input-number
                      :disabled="!(!disabled && editable)"
                      size="small"
                      :min="0"
                      :max="5"
                      v-model="scope.row.workload"
                      v-on:change="inputChange(scope)"
                    ></el-input-number>
                  </template>
                </el-table-column>
                 작업빈도(B) 
                <el-table-column
                  slot="tag"
                  prop="workCnt"
                  :label="$comm.getLangSpecInfoLabel('L0000002397')"
                  min-width="100px"
                  header-align="center"
                >
                  <template slot-scope="scope">
                    <el-input-number
                      :disabled="!(!disabled && editable)"
                      size="small"
                      :min="0"
                      :max="5"
                      v-model="scope.row.workCnt"
                      v-on:change="inputChange(scope)"
                    ></el-input-number>
                  </template>
                </el-table-column>
                총점수(A*B) 
                <el-table-column
                  slot="tag"
                  prop="totalScore"
                  :label="$comm.getLangSpecInfoLabel('L0000002871')"
                  min-width="150px"
                  header-align="center"
                  align="center"
                >
                  <template slot-scope="scope">{{scope.row.totalScore}}</template>
                </el-table-column>
              </y-data-table> -->
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
        };
      },
    },
  },
  data() {
    return {
      gridOptions: {
        name: 'harmfulSurvey1',
        // 조사결과
        header: [],
        data: [],
        height: '200',
      },
      YAuiGrid: null,
      gridOptions2: {
        name: 'harmfulSurvey2',
        // 조사결과
        header: [],
        data: [],
        height: '400',
      },
      AuiGrid: null,
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
      totalScore: 0,
      workNm: '',
      muscResearchChklistNo: 0,
      unitWorkNm: '',
      selectedValue: [],
      editable: false,
      insertUrl: '',
      searchUrl: '',
      isInsert: false,
    };
  },
  watch: {},
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
    this.AuiGrid = this.$refs.auiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      
      this.editable = this.$route.meta.editable;
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002393'), 
          dataField: 'col1', 
          width: '30%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002588'), 
          dataField: 'col2', 
          width: '20%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002397'), 
          dataField: 'col3', 
          width: '30%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002588'), 
          dataField: 'col4', 
          width: '20%',           
        },
      ];
      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000875'), 
          dataField: 'unitWorkNm', 
          width: '20%',           
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'), 
          dataField: 'workNm', 
          width: '20%',   
          editable: false,        
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001285'), 
          dataField: 'muscResearchChklistNo', 
          width: '20%',   
          editable: false,        
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002393'), 
          dataField: 'workload', 
          width: '10%',        
          dataType: "numeric",
          editRenderer: {
            type: 'InputEditRenderer', 
            onlyNumeric: true, 
            maxlength: 1,
          }, 
          labelFunction: function(rowIndex, columnIndex, value, headerText, item, dataField, cItem) {
            if (value > 5) {
              item.workload = 0;
            }
            return item.workload;
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002397'), 
          dataField: 'workCnt', 
          width: '10%',   
          dataType: "numeric",
          editRenderer: {
            type: 'InputEditRenderer', 
            onlyNumeric: true, 
            maxlength: 1,
          }, 
          labelFunction: function(rowIndex, columnIndex, value, headerText, item, dataField, cItem) {
            if (value > 5) {
              item.workCnt = 0;
            }
            return item.workCnt;
          },        
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002871'), 
          dataField: 'totalScore', 
          width: '20%',     
          editable: false,  
          labelFunction: function(rowIndex, columnIndex, value, headerText, item, dataField, cItem) {
            let plus = item.workCnt * item.workload;
            return plus;
          },       
        },
        
        // {
        //   text: '작업부하(A)',
        //   name: 'workload',
        //   width: '100px',
        //   align: 'right',
        //   type: 'number',
        // },
        // {
        //   text: '작업빈도(B)',
        //   name: 'workCnt',
        //   width: '100px',
        //   align: 'right',
        //   type: 'number',
        // },
        // {
        //   text: '총점수(A*B)',
        //   name: 'totalScore',
        //   width: '150px',
        //   align: 'right',
        // },
      ];
      this.setData().then(() => {
        this.YAuiGrid.setGridData(this.gridOptions.data)
        this.AuiGrid.setGridData(this.harmful.muscHarmfulEvals)
      });

    },
    cellEditEndHandler() {
      this.$_.forEach(this.AuiGrid.getGridData(), item => {
        if (item.workload === 0 || item.workload > 5) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000462', // 1점에서 5점 사이의 작업부하 점수를 입력하세요
            type: 'warning',
          });
          
        }
        if (item.workCnt === 0 || item.workCnt > 5) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000462', // 1점에서 5점 사이의 작업부하 점수를 입력하세요
            type: 'warning',
          });
          
        }
      });
      this.harmful.muscHarmfulEvals = this.AuiGrid.getGridData();
    },
    setData() {
      return new Promise((resolve) => {
        this.gridOptions.data = [
          {
            col1: this.$comm.getLangSpecInfoLabel('L0000004381'), // 매우쉬움
            col2: '1',
            col3: this.$comm.getLangSpecInfoLabel('L0000004382'), //  3개월마다(년 2~3회)
            col4: '1',
          },
          {
            col1: this.$comm.getLangSpecInfoLabel('L0000004383'), // '쉬움',
            col2: '2',
            col3: this.$comm.getLangSpecInfoLabel('L0000004384'), // '가끔(하루 또는 주 2~3회)',
            col4: '2',
          },
          {
            col1: this.$comm.getLangSpecInfoLabel('L0000004385'), // '약간힘듦',
            col2: '3',
            col3: this.$comm.getLangSpecInfoLabel('L0000004386'), // '자주(1일 4시간)',
            col4: '3',
          },
          {
            col1: this.$comm.getLangSpecInfoLabel('L0000004387'), // '힘듦',
            col2: '4',
            col3: this.$comm.getLangSpecInfoLabel('L0000004388'), // '계속(1일 4시간이상)',
            col4: '4',
          },
          {
            col1: this.$comm.getLangSpecInfoLabel('L0000004389'), // '매우 힘듦',
            col2: '5',
            col3: this.$comm.getLangSpecInfoLabel('L0000004390'), // '초과근무(1일 8시간이상)',
            col4: '5',
          },
        ];
        resolve();
      });
    },
    // getList() {
    //   if (!this.harmful.muscHarmfulNo || !this.harmful.muscResearchUnitNo) {
    //     return;
    //   }
    //   this.$http.url = this.searchUrl;
    //   this.$http.type = 'GET';

    //   this.$http.param = {
    //     muscHarmfulNo: this.harmful.muscHarmfulNo,
    //     muscResearchUnitNo: this.harmful.muscResearchUnitNo,
    //   };

    //   this.$http.request(
    //     (_result) => {
    //       this.gridOptions2.data = this.$_.clone(_result.data);
    //     },
    //     (_error) => {
    //       window.getApp.$emit('APP_REQUEST_ERROR', _error);
    //     }
    //   );
    // },
    /**
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */

    /** button 관련 이벤트 **/
    /**
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    resizeGrid() {
      let _height = window.innerHeight - 695;  
      let _width = window.innerWidth - 655;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(_width, _height);
      this.AuiGrid.resize(_width, _height);
    },
    inputChange(data) {
      if (
        data.column.property === 'workload' &&
        (data.row.workload > 5 || data.row.workload === 0)
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000462', // 1점에서 5점 사이의 작업부하 점수를 입력하세요
          type: 'warning',
        });
        setTimeout(() => {
          data.row.workload = null;
        }, 300);
        return;
      } else if (
        data.column.property === 'workCnt' &&
        (data.row.workCnt > 5 || data.row.workCnt === 0)
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000461', //  1점에서 5점 사이의 작업빈도 점수를 입력하세요
          type: 'warning',
        });
        setTimeout(() => {
          data.row.workCnt = null;
        }, 300);
        return;
      }

      data.row.totalScore = data.row.workCnt * data.row.workload;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
