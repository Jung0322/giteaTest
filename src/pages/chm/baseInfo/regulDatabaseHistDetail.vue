<!--
  목적 : 화학물질관리 > 기본정보 > 규제DB 업로드 > 규제DB업로드 목록
  작성자 : kyk
  Detail : 업로드할 목록에 대해서 조회할 수 있도록 한다. 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" v-show="false"></y-search-box>

    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 닫기 -->
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>

        <b-card>
          <!-- <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
               업로드 정보 
              <y-data-table
                v-model="selectedValue"
                label="L0000001945"
                ref="dataTable"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :use-paging="false"
                :use-server-paging="true"
                :pageTotal="searchParam.pageTotal"
                :searchExcelTotalUrl="searchUrl"
                :searchExcelTotalParam="searchParam"
                @onSortChange="tableSortChange"
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
                  :total="searchParam.pageTotal"
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
                :label="this.$comm.getLangSpecInfoLabel('L0000001945')"
                :useExcelExport="false"
                :showGridSetSave="true"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"
                :usePaginate="true"
                :paginateListCount="searchParam.pageSize"
                :paginateTotalCount="searchParam.pageTotal"
                :paginateCurrentPage="searchParam.pageNumber"
                @paginateClick="paginateClickHandler"
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
  name: 'regul-database-hist-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        chmRegulDbCd: '',
        uploadStatus: '',
      },
    },
  },
  data: () => ({
    editable: false,
    gridOptions: {
      name: 'regulDatabaseHisDetail',
      btns: [],
      header: [],
      data: [],
      totalData: [],
      height: '400',
    },
    YAuiGrid: null,
    selectedValue: [],
    searchUrl: '',
    searchParam: {
      chmRegulDbCd: '',
      pageNumber: 1,
      pageSize: 100,
      pageTotal: 0,
      pageSizes: [20, 50, 100, 200, 300],
      orderByExpression: '',
    },
  }),
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
      this.searchUrl = selectConfig.chm.chemicalreguldb.list.url;

      this.searchParam.chmRegulDbCd = this.popupParam.chmRegulDbCd;
      // 그리드 헤더 설정
      if (
        this.popupParam.uploadStatus === 'CRD40' ||
        this.popupParam.uploadStatus === 'CRD50' ||
        this.popupParam.uploadStatus === 'CRD60'
      ) {
        this.getHistHeader();
      } else {
        this.getWorkingHeader();
      }
      this.getDataList();
    },
    getDataList() {
      if (this.popupParam.chmRegulDbCd === '') return;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.searchParam.pageTotal = _result.data.count;
          this.gridOptions.data = this.$_.clone(_result.data.items);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data.items));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    paginateClickHandler(pageNum) {
      this.searchParam.pageNumber = pageNum;
      this.getDataList();
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    getHistHeader() {
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000725'),
          dataField: 'lawNm',
          width: '15%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000731'),
          dataField: 'regulItmNm',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003878'),
          dataField: 'dbTypeNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003879'),
          dataField: 'applyMsg',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003300'),
          dataField: 'chmNmEn',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003299'),
          dataField: 'chmNmKr',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003880'),
          dataField: 'chmNmSyn',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000102'),
          dataField: 'casNo',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003881'),
          dataField: 'unNo',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003882'),
          dataField: 'ecNo',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003883'),
          dataField: 'noticeDate',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003884'),
          dataField: 'contStdDesc',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003885'),
          dataField: 'contStdNum',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003886'),
          dataField: 'formula',
          width: '10%',
          style: 'left-align',
        },
      ];
    },
    getWorkingHeader() {
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000725'),
          dataField: 'lawNm',
          width: '170px',
          align: 'left',
        }, // 규제법규명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000731'),
          dataField: 'regulItmNm',
          width: '150px',
          align: 'left',
        }, // 규제항목명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003878'),
          dataField: 'dbTypeNm',
          width: '120px',
          align: 'center',
        }, // 구분자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003300'),
          dataField: 'chmNmEn',
          width: '150px',
          align: 'left',
        }, // 화학물질명영문
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003299'),
          dataField: 'chmNmKr',
          width: '200px',
          align: 'left',
        }, // 화학물질명국문
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003880'),
          dataField: 'chmNmSyn',
          width: '200px',
          align: 'left',
        }, // 화학물질명일반명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000102'),
          dataField: 'casNo',
          width: '150px',
          align: 'left',
        }, // CAS No.
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003881'),
          dataField: 'unNo',
          width: '180px',
          align: 'left',
        }, // UN NO.
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003882'),
          dataField: 'ecNo',
          width: '150px',
          align: 'left',
        }, // EC NO.
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003883'),
          dataField: 'noticeDate',
          width: '150px',
          align: 'center',
        }, // 고시일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003884'),
          dataField: 'contStdDesc',
          width: '500px',
          align: 'left',
        }, // 함량기준설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003885'),
          dataField: 'contStdNum',
          width: '150px',
          align: 'center',
        }, // 함량기준수치
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003886'),
          dataField: 'formula',
          width: '200px',
          align: 'left',
        }, // 분자식/화학식/구조식
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003887'),
          dataField: 'errMsg',
          width: '500px',
          align: 'left',
        }, // 오류
      ];
    },
    handleSizeChange(_newPageSize) {
      this.searchParam.pageSize = _newPageSize;
      this.getDataList();
    },
    handleCurrentChange(_newPage) {
      this.getDataList();
    },
    tableSortChange(_item) {
      this.searchParam.orderByExpression =
        this.$comm.toUndrFromCamelCase(_item.prop) +
        ' ' +
        (_item.order === 'descending' ? 'desc' : 'asc');
      this.getDataList();
    },
  },
};
</script>
<style scoped>
.pagination-container {
  background: #fff;
  padding: 0px 16px;
  text-align: center;
}
.pagination-container.hidden {
  display: none;
}
</style>
