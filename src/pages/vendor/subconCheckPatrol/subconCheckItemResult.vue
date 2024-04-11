<!--
  목적 : 협력업체 > 협력업체 자체점검 결과 > 결과 
  작성자 : kyk
  Detail : 협력업체 자체점검 결과등록 > 결과 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-textarea
                :width="10"
                :disabled="true"
                ui="bootstrap"
                label="점검결과요약"
                name="checkResult"
                v-model="subconCheckResult.checkResult"
              />
            </b-col>
          </b-row>
          <!-- 검색 결과 테이블 -->
          <!-- <b-row>
            <b-col sm="12">
              <b-col sm="12" class="px-0">
                <y-data-table
                  ref="dataSelfCheckItemResultTable"
                  :height="gridOptions.height"
                  :editable="false"
                  :headers="gridOptions.header"
                  :items="gridOptions.data"
                  :print="true"
                  label="점검항목별 결과 목록"
                  :popMode="true"
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
                :label="'점검항목별 결과 목록'"
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
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-selfcheck-item-result',
  props: {
    subconCheckResult: {
      type: Object,
      default: {
        vendorCheckRsltNo: 0,
        safCheckKindNo: '',
        checkResult: null,
        safCheckItemResults: [],
      },
    },
  },
  data() {
    return {
      gridOptions: {
        name: 'subconCheckItemResult',
        header: [],
        data: [],
        height: '300',
      },
      YAuiGrid: null,
      searchUrl: '',
    };
  },
  watch: {
    'subconCheckResult.safCheckKindNo'() {
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
    init() {
      // Url Setting
      this.searchUrl = selectConfig.vendor.subconCheckPatrol.itemResult.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: '점검항목', 
          dataField: 'safCheckTypeNm', 
          width: '25%',           
          style: 'left-align'
        },   
        {
          headerText: '점검결과', 
          dataField: 'checkResult', 
          width: '25%',      
          style: 'left-align'     
        },   
        {
          headerText: '비고', 
          dataField: 'remark', 
          width: '50%',      
          style: 'left-align'     
        },   
        // { text: '점검항목', name: 'safCheckTypeNm', width: '200px' },
        // { text: '점검결과', name: 'checkResult', width: '150px' },
        // { text: '비고', name: 'remark', width: '350px' },
      ];

    },
    /** 협력업체 자체점검결과 목록 조회 **/
    getList() {
      if (this.subconCheckResult.safCheckKindNo) {
        this.$http.url = this.$format(
          this.searchUrl,
          this.subconCheckResult.safCheckKindNo
        );
        this.$http.param = { vendorCheckRsltNo: this.subconCheckResult.vendorCheckRsltNo }
        this.$http.type = 'GET';
        this.$http.request(
          _result => {
            // this.gridOptions.data = this.$_.clone(_result.data);
            this.YAuiGrid.setGridData(this.$_.clone(_result.data))
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
  },
};
</script>