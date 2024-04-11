<!--
  목적 : 목표 등록/수정 팝업 목표계획 목록
  작성자 : mjpark
  Detail : 목표계획 목록 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <!-- <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <y-data-table
            class="mergeTable"
            label="L0000005159"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :span-options="gridOptions.merge"
            :cellClassName="calStyle"
            :rowClassName="tableRowClassName"
            @tableLinkClicked="tableLinkClicked"
          >
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005159')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
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
  /** attributes: name, components, props, data **/
  name: 'mgt-target-item-plan',
  props: {    
    mgtTargetItemPlan: {
      type: Object,
      default: function() {
        return {
          mgtTargetNo: null,
          mgtTargetGrpNo: null,
          tapprRqstNo: null,
          year: '',
          month: '',
          plantCd: null,
          deptCd: null,
          stepCd: null,
          planDataList: [],               
        };
      },
    },
    allInputVal: 0,
    apprFlag: false,
  },
  data () {
    return {
      gridOptions: {
        name: 'mgtTargetItemPlan',
        header: [],
        data: [],
        merge: [],
        height: '320'
      },
      YAuigrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: true,
      searchUrl: '',
      tDisabled: false,      
    };
  },
  watch: {
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.mgtTargetItemPlan.planDataList = this.gridOptions.data;
      },
      deep: true,
    },
    'mgtTargetItemPlan.mgtTargetGrpNo': {
      handler: function (val, oldVal) {
        this.getHeaders();
        this.getList();
      },
      deep: true,
    },
    'mgtTargetItemPlan.stepCd': {
      handler: function (val, oldVal) {
        this.getHeaders();
        this.getList();
      },
      deep: true,
    },
    'allInputVal': {
      handler: function (val, oldVal) {
        if (val !== undefined)
        {
          this.$_.forEach(this.gridOptions.data, (item) => {
            for (let i = 1; i < 13; i++)
            {
              item['m' + i.toString() + 'Val'] = val;
            }
          });
        }        
      },
      deep: true,
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted () {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy () {
  },
  /** methods **/
  methods: {
    tableRowClassName({ row, rowIndex }) {
      return 'odd-row';
    },
    /** 초기화 관련 함수 **/
    init () {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.mgt.mgtTarget.mgtTargetItem.list.url;
      
      this.getHeaders();
      this.getList();      
    },
    /** /초기화 관련 함수 **/
    getHeaders () {
      this.tDisabled = false;

      if ((this.mgtTargetItemPlan.tstepCd === 'BAPSA' || this.mgtTargetItemPlan.tstepCd === 'BAPSG') && !this.apprFlag)
      {
        this.tDisabled = true;
      }

      this.gridOptions.header = [];
      return new Promise(resovle => {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001346'), 
            dataField: 'bizFieldNm', 
            cellMerge: true,
            width: '110', 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003199'), 
            dataField: 'bizFieldItemNm', 
            width: '110', 
            style: 'left-align'
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000042'), 
            dataField: 'm1Val', 
            width: '110', 
            dataType: "numeric",
            editable: !this.tDisabled,
            editRenderer: {
              type: 'InputEditRenderer', 
              onlyNumeric: true, // 0~9만 입력가능
              allowPoint: true, // 소수점( . ) 도 허용할지 여부
              allowNegative: true, // 마이너스 부호(-) 허용 여부
              textAlign: "right", // 오른쪽 정렬로 입력되도록 설정
              autoThousandSeparator: true // 천단위 구분자 삽입 여부
            }, 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000043'), 
            dataField: 'm2Val', 
            width: '110', 
            editable: !this.tDisabled,
            dataType: "numeric",
            editRenderer: {
              type: 'InputEditRenderer', 
              onlyNumeric: true,
              allowPoint: true, 
              allowNegative: true,
              textAlign: "right", 
              autoThousandSeparator: true 
            }, 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000044'), 
            dataField: 'm3Val', 
            width: '110', 
            editable: !this.tDisabled,
            dataType: "numeric",
            editRenderer: {
              type: 'InputEditRenderer', 
              onlyNumeric: true,
              allowPoint: true, 
              allowNegative: true,
              textAlign: "right", 
              autoThousandSeparator: true 
            }, 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000045'), 
            dataField: 'm4Val', 
            width: '110', 
            editable: !this.tDisabled,
            dataType: "numeric",
            editRenderer: {
              type: 'InputEditRenderer', 
              onlyNumeric: true,
              allowPoint: true, 
              allowNegative: true,
              textAlign: "right", 
              autoThousandSeparator: true 
            }, 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000046'), 
            dataField: 'm5Val', 
            width: '110', 
            editable: !this.tDisabled,
            dataType: "numeric",
            editRenderer: {
              type: 'InputEditRenderer', 
              onlyNumeric: true,
              allowPoint: true, 
              allowNegative: true,
              textAlign: "right", 
              autoThousandSeparator: true 
            }, 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000047'), 
            dataField: 'm6Val', 
            width: '110', 
            editable: !this.tDisabled,
            dataType: "numeric",
            editRenderer: {
              type: 'InputEditRenderer', 
              onlyNumeric: true,
              allowPoint: true, 
              allowNegative: true,
              textAlign: "right", 
              autoThousandSeparator: true 
            }, 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000048'), 
            dataField: 'm7Val', 
            width: '110', 
            editable: !this.tDisabled,
            dataType: "numeric",
            editRenderer: {
              type: 'InputEditRenderer', 
              onlyNumeric: true,
              allowPoint: true, 
              allowNegative: true,
              textAlign: "right", 
              autoThousandSeparator: true 
            }, 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000049'), 
            dataField: 'm8Val', 
            width: '110', 
            editable: !this.tDisabled,
            dataType: "numeric",
            editRenderer: {
              type: 'InputEditRenderer', 
              onlyNumeric: true,
              allowPoint: true, 
              allowNegative: true,
              textAlign: "right", 
              autoThousandSeparator: true 
            }, 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000050'), 
            dataField: 'm9Val', 
            width: '110', 
            editable: !this.tDisabled,
            dataType: "numeric",
            editRenderer: {
              type: 'InputEditRenderer', 
              onlyNumeric: true,
              allowPoint: true, 
              allowNegative: true,
              textAlign: "right", 
              autoThousandSeparator: true 
            }, 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000051'), 
            dataField: 'm10Val', 
            width: '110', 
            editable: !this.tDisabled,
            dataType: "numeric",
            editRenderer: {
              type: 'InputEditRenderer', 
              onlyNumeric: true,
              allowPoint: true, 
              allowNegative: true,
              textAlign: "right", 
              autoThousandSeparator: true 
            }, 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000052'), 
            dataField: 'm11Val', 
            width: '110', 
            editable: !this.tDisabled,
            dataType: "numeric",
            editRenderer: {
              type: 'InputEditRenderer', 
              onlyNumeric: true,
              allowPoint: true, 
              allowNegative: true,
              textAlign: "right", 
              autoThousandSeparator: true 
            }, 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000053'), 
            dataField: 'm12Val', 
            width: '110', 
            editable: !this.tDisabled,
            dataType: "numeric",
            editRenderer: {
              type: 'InputEditRenderer', 
              onlyNumeric: true,
              allowPoint: true, 
              allowNegative: true,
              textAlign: "right", 
              autoThousandSeparator: true 
            }, 
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004972'), 
            dataField: 'tstepNm', 
            width: '110', 
            cellMerge: true,
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {              
              },
            },
          },
        ];
        resovle();
      });
      // this.gridOptions.header.push({ text: 'L0000001346', name: 'bizFieldNm', width: '100px', align: 'center' });
      // this.gridOptions.header.push({ text: 'L0000003199', name: 'bizFieldItemNm', width: '200px', align: 'left' });
      // this.gridOptions.header.push({ text: 'L0000000042', type: 'number', pointNumber: 3, hasSeperator: true, name: 'm1Val', disabled: this.tDisabled, width: '130px', align: 'center' });
      // this.gridOptions.header.push({ text: 'L0000000043', type: 'number', pointNumber: 3, hasSeperator: true, name: 'm2Val', disabled: this.tDisabled, width: '130px', align: 'center' });
      // this.gridOptions.header.push({ text: 'L0000000044', type: 'number', pointNumber: 3, hasSeperator: true, name: 'm3Val', disabled: this.tDisabled, width: '130px', align: 'center' });
      // this.gridOptions.header.push({ text: 'L0000000045', type: 'number', pointNumber: 3, hasSeperator: true, name: 'm4Val', disabled: this.tDisabled, width: '130px', align: 'center' });
      // this.gridOptions.header.push({ text: 'L0000000046', type: 'number', pointNumber: 3, hasSeperator: true, name: 'm5Val', disabled: this.tDisabled, width: '130px', align: 'center' });
      // this.gridOptions.header.push({ text: 'L0000000047', type: 'number', pointNumber: 3, hasSeperator: true, name: 'm6Val', disabled: this.tDisabled, width: '130px', align: 'center' });
      // this.gridOptions.header.push({ text: 'L0000000048', type: 'number', pointNumber: 3, hasSeperator: true, name: 'm7Val', disabled: this.tDisabled, width: '130px', align: 'center' });
      // this.gridOptions.header.push({ text: 'L0000000049', type: 'number', pointNumber: 3, hasSeperator: true, name: 'm8Val', disabled: this.tDisabled, width: '130px', align: 'center' });
      // this.gridOptions.header.push({ text: 'L0000000050', type: 'number', pointNumber: 3, hasSeperator: true, name: 'm9Val', disabled: this.tDisabled, width: '130px', align: 'center' });
      // this.gridOptions.header.push({ text: 'L0000000051', type: 'number', pointNumber: 3, hasSeperator: true, name: 'm10Val', disabled: this.tDisabled, width: '130px', align: 'center' });
      // this.gridOptions.header.push({ text: 'L0000000052', type: 'number', pointNumber: 3, hasSeperator: true, name: 'm11Val', disabled: this.tDisabled, width: '130px', align: 'center' });
      // this.gridOptions.header.push({ text: 'L0000000053', type: 'number', pointNumber: 3, hasSeperator: true, name: 'm12Val', disabled: this.tDisabled, width: '130px', align: 'center' });
      // this.gridOptions.header.push({ text: 'L0000004972', name: 'tstepNm', width: '130px', align: 'center', url: 'true' });
    },
    getList () {     
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        'mgtTargetGrpNo': this.mgtTargetItemPlan.mgtTargetGrpNo,
      };
      
      this.$http.request((_result) => {
        // this.gridOptions.data = _result.data;
        this.YAuiGrid.setGridData(this.$_.clone(_result.data));
      }, (_error) => {
        window.getApp.$emit('APP_REQUEST_ERROR', '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.');
      });
    },
    cellClickHandler(event) {
      this.mgtTargetItemPlan.planDataList = this.YAuiGrid.getGridData();
      if (event.item === null) return;
      if (event.dataField !== 'tstepNm') return;

      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: this.mgtTargetItemPlan.tapprRqstNo, // 목표결재요청번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkClicked (header, data) {
      if (data === null) return;

      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: this.mgtTargetItemPlan.tapprRqstNo, // 목표결재요청번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    btnClickedErrorCallback (_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.');
    },    
    closePopup (data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getHeaders();
      this.getList();
    },
    calStyle({ row, column, rowIndex, colIndex }) {
      // console.log(row);
      // console.log(column);
      // console.log(rowIndex);
      // console.log(colIndex);
      let returnText = '';
      // if (
      //   typeof row['m' + column.property] !== 'undefined' &&
      //   !row['m' + column.property]
      // ) {
      //   return 'ghg-ems';
      // }
      // if (!row[column.property] && column.property.substring(0, 1) === 'm') {
      //   row[column.property] = row['est_emissions'];
      //   row['m' + column.property] = false;
      //   returnText = 'ghg-ems';
      // }
      return returnText;
    },
    /** /Button Event **/
  }
};
</script>
