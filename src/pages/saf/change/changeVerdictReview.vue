<!--
  목적 : 안전 - 변경관리 상세 (요청, 기술검토, 변경진행)
  Detail : 변경관리 등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="editBox">
      <b-col sm="12">
        <!-- 설비별 변경여부 판정 기준 -->
        <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000004311')"
            :useExcelExport="false"
            :showGridSetSave="false"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :editable="!disabled"
            @cellEditEnd="clsGridCellClick"
          />
      </b-col>
      <b-col sm="12" class="mt-1">
        <!-- 정비·운전 변경여부 판정 기준 -->
        <y-auigrid
            ref="yAuiGrid2"
            :name="gridOptions2.name"
            :headers="gridOptions2.header"
            :height="gridOptions2.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000004311')"
            :useExcelExport="false"
            :showGridSetSave="false"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :editable="!disabled"
            @cellEditEnd="operClsGridCellClick"
          />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  /* attributes: name, components, props, data */
  name: 'y-change-verdict-review',
  props: {
    change: {
      type: Object,
      default: function () {
        return {
          safChngNo: 0, // key
          changeTypes: [],
          changeOperations: [],
        };
      },
    },
    disabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  data: () => ({
    YAuiGrid: null,
    YAuiGrid2: null,
    gridOptions: {
      name: 'changechangeVerdictReview',
      header: [],
      data: [],
      height: 200,
    },
    gridOptions2: {
      name: 'changechangeVerdictReview2',
      header: [],
      data: [],
      height: 200,
    },
    editable: false,
    changeClsItems: [],
    changeClsItems2: [],
  }),
  computed: {},
  watch: {
    'gridOptions.data': {
      handler: function (newValue, oldValue) {
        this.change.changeTypes = [];
        this.$_.forEach(this.gridOptions.data, (gridData) => {
          this.$_.forEach(this.changeClsItems, (clsItem) => {
            if (gridData[clsItem.code] === 'Y') {
              this.change.changeTypes.splice(0, 0, {
                chngTypeCd: gridData.chngTypeCd,
                chngClsCd: clsItem.code,
              });
            }
          });
        });
      },
      deep: true,
    },
    'gridOptions2.data': {
      handler: function (newValue, oldValue) {
        this.change.changeOperations = [];
        this.$_.forEach(this.gridOptions2.data, (gridData) => {
          this.$_.forEach(this.changeClsItems2, (clsItem) => {
            if (gridData[clsItem.code] === 'Y') {
              this.change.changeOperations.splice(0, 0, {
                chngOperationCd: gridData.chngOperationCd,
                chngClsCd: clsItem.code,
              });
            }
          });
        });
      },      
      deep: true,
    },
    disabled: function() {
      this.init();
    }
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
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), // 구분
          dataField: 'chngTypeNm',
          editable: false,
          width: '90px',
          style: 'center-align',
        },
      ];
      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), // 구분
          dataField: 'chngOperationNm',
          editable: false,
          width: '350px',
          style: 'center-align',
        },
      ];
      this.getChngCls();
      this.getChngOperCls();
    },
    getChngCls() {
      // 구분목록
      this.$comm.getComboItems('SAF_CHNG_CLS').then((_result) => {
        this.changeClsItems = _result;
        let i = 1;
        this.gridOptions.header.splice(0, this.gridOptions.header.length);
        this.gridOptions.header.splice(0, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), // 구분
          dataField: 'chngTypeNm',
          width: '90px',
          style: 'center-align',
        });
        this.$_.forEach(_result, (item) => {
          this.gridOptions.header.splice(i, 0, {
            headerText: item.codeNm,
            dataField: item.code,
            style: 'center-align',
            renderer: {
              type: 'CheckBoxEditRenderer',
              checkValue: 'Y',
              unCheckValue: 'N',
              editable: true,
              // 체크박스 disabled 함수
              disabledFunction: function (rowIndex, columnIndex, value, isChecked, item, dataField) {
                return item.disabledEdit; // true 반환하면 disabled 시킴
              }           
            },
          });
          i++;
        });
        
        this.$comm.getComboItems('SAF_CHNG_TYPE').then((_result) => {
          if (this.change.changeTypes && this.change.changeTypes.length > 0) {
            // 값 들어오면 확인
            this.gridOptions.data.splice(0, this.gridOptions.data.length);
            this.$_.forEach(_result, (item) => {
              let pushData = {
                chngTypeCd: item.code,
                chngTypeNm: item.codeNm,
                disabledEdit: this.disabled,
              };
              this.$_.forEach(this.change.changeTypes, (type) => {
                if (item.code === type.chngTypeCd) {
                  pushData[type.chngClsCd] = 'Y';
                }
              });

              this.gridOptions.data.push(pushData);
            });

          } else {
            this.$_.forEach(_result, (item) => {
              this.gridOptions.data.push({
                chngTypeCd: item.code,
                chngTypeNm: item.codeNm,
                disabledEdit: this.disabled,
              });
            });
          }
          this.gridOptions.height = 350;
          this.YAuiGrid.setGridData(this.gridOptions.data);
          this.YAuiGrid.changeColumnLayout(this.gridOptions.header);
        });
      });
    },
    getChngOperCls() {
      // 구분목록
      this.$comm.getComboItems('SAF_CHNG_CLS2').then((_result) => {
        this.changeClsItems2 = _result;
        let i = 1;
        this.gridOptions2.header.splice(0, this.gridOptions2.header.length);
        this.gridOptions2.header.splice(0, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), // 구분
          dataField: 'chngOperationNm',
          width: '350px',
          style: 'center-align',
        });
        this.$_.forEach(_result, (item) => {
          this.gridOptions2.header.splice(i, 0, {
            headerText: item.codeNm,
            dataField: item.code,
            align: 'center',
            renderer: {
              type: 'CheckBoxEditRenderer',
              checkValue: 'Y',
              unCheckValue: 'N',
              editable: true,
              // 체크박스 disabled 함수
              disabledFunction: function (rowIndex, columnIndex, value, isChecked, item, dataField) {
                return item.disabledEdit; // true 반환하면 disabled 시킴
              } 
            },
          });
          i++;
        });

        this.$comm.getComboItems('SAF_CHNG_OPERATION').then((_result) => {
          if (
            this.change.changeOperations &&
            this.change.changeOperations.length > 0
          ) {
            // 값 들어오면 확인
            this.gridOptions2.data.splice(0, this.gridOptions2.data.length);
            this.$_.forEach(_result, (item) => {
              let pushData = {
                chngOperationCd: item.code,
                chngOperationNm: item.codeNm,
                disabledEdit: this.disabled,
              };
              this.$_.forEach(this.change.changeOperations, (type) => {
                if (item.code === type.chngOperationCd) {
                  pushData[type.chngClsCd] = 'Y';
                }
              });

              this.gridOptions2.data.push(pushData);
            });
          } else {
            this.$_.forEach(_result, (item) => {
              this.gridOptions2.data.push({
                chngOperationCd: item.code,
                chngOperationNm: item.codeNm,
                disabledEdit: this.disabled,
              });
            });
          }
          this.gridOptions2.height = 350;
          this.YAuiGrid2.setGridData(this.gridOptions2.data);
          this.YAuiGrid2.changeColumnLayout(this.gridOptions2.header);
        });
      });
    },
    // YAuiGrid 클릭시 이벤트 호출
    clsGridCellClick(event) {
      this.change.changeTypes = [];
      this.$_.forEach(this.YAuiGrid.getGridData(), (gridData) => {
        this.$_.forEach(this.changeClsItems, (clsItem) => {
          if (gridData[clsItem.code] === 'Y') {
            this.change.changeTypes.splice(0, 0, {
              chngTypeCd: gridData.chngTypeCd,
              chngClsCd: clsItem.code,
            });
          }
        });
      });
    },
    // YAuiGrid2 클릭시 이벤트 호출
    operClsGridCellClick(event) {
      this.change.changeOperations = [];
      this.$_.forEach(this.YAuiGrid2.getGridData(), (gridData) => {
        this.$_.forEach(this.changeClsItems2, (clsItem) => {
          if (gridData[clsItem.code] === 'Y') {
            this.change.changeOperations.splice(0, 0, {
              chngOperationCd: gridData.chngOperationCd,
              chngClsCd: clsItem.code,
            });
          }
        });
      });
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
