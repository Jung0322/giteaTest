<!--
  목적 : 협력업체 포탈 > 협력업체 자체점검 결과등록 > 점검자 
  작성자 : kyk
  Detail : 협력업체 자체점검 결과등록 > 점검자 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <!-- 점검팀(외부) 테이블 -->
        <b-row class="mt-1">
          <b-col sm="12">
            <!-- <b-col sm="12" class="px-0">
              <y-data-table
                ref="dataTableOut"
                :height="gridInspectorOutOptions.height"
                :headers="gridInspectorOutOptions.header"
                :items="gridInspectorOutOptions.data"
                :editable="false"
                :print="true"
                label="점검팀(외부) 목록"
                :popMode="true"
              >
              </y-data-table>
            </b-col> -->
            <b-col sm="12">
              <y-auigrid
                ref="yAuiGrid"
                :name="gridInspectorOutOptions.name"
                :headers="gridInspectorOutOptions.header"
                :btns="gridInspectorOutOptions.btns"
                :height="gridInspectorOutOptions.height"
                :label="'점검팀(외부) 목록'"
                :useExcelExport="false"
                :enableCellMerge="true"
                :enableSorting="true"
                :showGridSetSave="true"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"  
              />
            </b-col>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!-- <y-dialog :param="popupOptions"></y-dialog> -->
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-selfcheck-check-inspector',
  props: {
    tabIndex: {
      type: Number,
      default() {
        return 0;
      }
    },
    subconCheckResult: {
      type: Object,
      default() {
        return {
          vendorCheckRsltNo: 0,
          safCheckKindNo: '',
          checkResult: null,
          safCheckItemResults: [],
        }
      },
    },
  },
  data() {
    return {
      gridInspectorOutOptions: {
        name: 'selfCheckInspector',
        header: [],
        data: [],
        height: '250',
      },
      YAuiGrid: null,
      searchUrl: '',
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
      // Url Setting
      this.searchUrl = selectConfig.vendor.subconCheckPatrol.inspector.url;

      // 점검팀원 그리드 헤더  점검팀(외부) 그리드 헤더 설정
    
      this.setGridHeader().then(() => {
        this.getList();
      })
      // this.getList(); // 점검팀(외부) 리스트 조회 - 'CLS02'
    },
    setGridHeader() {
      return new Promise((resolve) => {
        this.gridInspectorOutOptions.header = [
          {
            headerText: '성명', 
            dataField: 'workerNm', 
            width: '15%',           
          },
          {
            headerText: '소속회사', 
            dataField: 'vendorNm', 
            width: '20%',    
            style: 'left-align'       
          },
          {
            headerText: '직책', 
            dataField: 'workerJob', 
            width: '15%',         
          },
          {
            headerText: '연락처', 
            dataField: 'tel', 
            width: '20%',         
          },
          {
            headerText: '비고', 
            dataField: 'remark', 
            width: '30%',     
            style: 'left-align'           
          },          
        ];
        resolve();
      })
    },
    /** 점검팀원 목록, 점검팀(외부) 목록 조회 **/
    getList() {
      if (this.subconCheckResult.vendorCheckRsltNo) {
        this.$http.url = this.$format(
          this.searchUrl,
          this.subconCheckResult.vendorCheckRsltNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          _result => {
            this.gridInspectorOutOptions.data = this.$_.clone(_result.data);
            this.YAuiGrid.setGridData(this.$_.clone(_result.data))
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
  }
};
</script>