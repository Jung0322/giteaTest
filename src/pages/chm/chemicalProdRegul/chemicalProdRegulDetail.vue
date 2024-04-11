<!--
  목적 : 화학물질 > 규제항목별 자재현황 > 상세화면
  Detail : 화학자재 규제현황 상세정보
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="searchBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 화학자재 규제현황 -->
            <y-label label="L0000003310" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card header-class="default-card">
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 법규 -->
              <y-text
                :width="10"
                :readonly="true"
                :disabled="true"
                ui="bootstrap"
                label="L0000001205"
                name="regulLawNm"
                v-model="popupParam.regulLawNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 규제항목 -->
              <y-text
                :width="10"
                :readonly="true"
                :disabled="true"
                ui="bootstrap"
                label="L0000000729"
                name="regulItmNm"
                v-model="popupParam.regulItmNm"
              ></y-text>
            </b-col>
          </b-row>
          <!-- <b-row class="pt-3">
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-data-table
                ref="dataTable"
                :label="headerTitle"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :use-paging="false"
                :use-server-paging="true"
                :useRownum="false"
                @tableLinkClicked="tableLinkClicked"
                @onSortChange="tableSortChange"
                :pageTotal="searchParam.pageTotal"
                :searchExcelTotalUrl="$format(this.searchUrl, this.popupParam.regulItmNo)"
                :searchExcelTotalParam="searchParam"
              ></y-data-table>
              <div class="pagination-container">
                <el-pagination
                  ref="pagination"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="searchParam.pageNumber"
                  :page-size="searchParam.pageSize"
                  :page-sizes="searchParam.pageSizes"
                  layout="total, sizes, prev, pager, next, jumper, ->, slot"
                  :total="popupParam.pageTotal"
                ></el-pagination>
              </div>
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
                :label="headerTitle"
                :useExcelExport="false"
                :enableCellMerge="true"
                :enableSorting="true"
                :showGridSetSave="true"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"  
                :usePaginate="true"
                :paginateListCount="searchParam.pageSize"
                :paginateTotalCount="searchParam.pageTotal"
                :paginateCurrentPage="searchParam.pageNumber"
                @paginateClick="paginateClickHandler"    
                @cellClick="cellClickHandler"       
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'chemical-prod-regul-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        viewtype: 'chemCnt',
        totalCount: 0,
        regulItmNo: 0,
        regulItmNm: '',
        regulOrgNm: '',
        regulLawNm: '',
      },
    },
  },
  data() {
    return {
      editable: false,
      gridOptions: {
        name: 'chemicalProdRegulDetail',
        header: [],
        data: [],
        height: '300',
      },
      YAuiGrid: null,
      searchParam: {
        pageNumber: 1,
        pageSize: 20,
        pageTotal: 0,
        pageSizes: [10, 20, 50],
        orderByExpression: '',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      searchUrl: '',
      headerTitle: '',
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
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      if (this.popupParam.viewtype === 'chemProdCnt') {
        this.headerTitle = this.$comm.getLangSpecInfoLabel('L0000003307'); // '화학물질이 포함된 화학자재 개수';
        this.searchUrl = selectConfig.chm.chemicalprodregul.prodlist.url;
        // 그리드 헤더 설정
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001205'), 
            dataField: 'regulLawNm', 
            width: '15%',        
            style: 'left-align'   
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000729'), 
            dataField: 'regulItmNm', 
            width: '20%',    
            style: 'left-align'          
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002329'), 
            dataField: 'sapMatCd', 
            width: '15%',                              
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002326'), 
            dataField: 'chemProdNmKr', 
            width: '20%',      
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {              
              },
            },    
            style: 'left-align'     
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000804'), 
            dataField: 'vendorNm', 
            width: '15%',      
            style: 'left-align'        
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002627'), 
            dataField: 'makerNm', 
            width: '15%',   
            style: 'left-align'           
          },
        ];
      } else {
        this.headerTitle = this.$comm.getLangSpecInfoLabel('L0000003286'); // '화학물질 개수';
        this.searchUrl = selectConfig.chm.chemicalprodregul.chemlist.url;
        // 그리드 헤더 설정
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001205'), 
            dataField: 'regulLawNm', 
            width: '15%',           
            style: 'left-align'     
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000729'), 
            dataField: 'regulItmNm', 
            width: '20%',           
            style: 'left-align'     
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000102'), 
            dataField: 'casNo', 
            width: '15%',           
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003304'), 
            dataField: 'chemNmKr', 
            width: '25%',     
            style: 'left-align',
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {              
              },
            },              
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003305'), 
            dataField: 'chemNmEn', 
            width: '25%',  
            style: 'left-align'              
          },
        ];
      }
      this.getList();
    },
    /** 규제법규 및 항목 목록 검색 **/
    getList() {
      if (!this.popupParam.regulItmNo) return;
      this.$http.url = this.$format(this.searchUrl, this.popupParam.regulItmNo);
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          // this.gridOptions.data = this.$_.clone(_result.data.items);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data.items))
          this.searchParam.pageTotal = _result.data.count;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField !== 'chemProdNmKr' && event.dataField !== 'chemNmKr') return;
      this.openPopup(event.item);
    },
    tableLinkClicked(header, row) {
      if (row === null) return;
      this.openPopup(row);
    },
    openPopup(data) {
      if (this.popupParam.viewtype === 'chemProdCnt') {
        this.popupOptions.target = () =>
          import(`${'@/pages/chm/chemprod/chemprodDetail.vue'}`);
        this.popupOptions.title = 'L0000003309'; // '화학자재';
        this.popupOptions.visible = true;
        this.popupOptions.param = {
          chemprodNo: data.chemProdNo,
          popupMode: true,
        };
        this.popupOptions.closeCallback = this.closeChemPopup;
      } else {
        this.popupOptions.target = () =>
          import(`${'@/pages/chm/chemical/chemDetail.vue'}`);
        this.popupOptions.title = 'L0000003285'; // '화학물질';
        this.popupOptions.visible = true;
        this.popupOptions.param = {
          chemNo: data.chemNo,
          popupMode: true,
        };
        this.popupOptions.closeCallback = this.closeChemPopup;
      }
    },
    paginateClickHandler(pageNum) {
      this.searchParam.pageNumber = pageNum;
      this.getList();
    },
    closeChemPopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    onPageChange(_item) {
      if (this.searchParam.pageNumber !== _item.page) {
        this.searchParam.pageNumber = _item.page;
        this.searchParam.pageSize = _item.limit;
        this.getList();
      }
    },
    handleSizeChange(_newPageSize) {
      this.searchParam.pageSize = _newPageSize;
      this.getList();
    },
    handleCurrentChange(_newPage) {
      this.getList();
    },
    tableSortChange(_item) {
      this.searchParam.orderByExpression =
        this.$comm.toUndrFromCamelCase(_item.prop) +
        ' ' +
        (_item.order === 'descending' ? 'desc' : 'asc');
      this.getList();
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
  },
};
</script>
<style scoped>
.bg-white {
  background-color: #fff!important;
}
</style>