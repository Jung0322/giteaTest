<!--
  목적 : 설비관리 > 설비유형별 설비현황
  Detail : 설비유형별로 관리부서별 설비현황을 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-dept
            type="search"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 -->
    <b-row class="mt-3">
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 검색 -->
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
        </b-col>
      </b-col>
    </b-row>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="5">
        <b-col sm="12" class="px-0">
          <!-- 부서 목록 -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001289')"
            :useExcelExport="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :showGridSetSave="true"
            :enableSorting="true"
            @cellClick="rowClicked"
          />
        </b-col>
      </b-col>
      <b-col sm="7">
        <b-col sm="12" class="px-0">
          <!-- 공정별 설비 목록 -->
          <!-- <y-data-table
              ref="dataTable"
              :height="gridFacilityOptions.height"
              :headers="gridFacilityOptions.header"
              :items="gridFacilityOptions.data"
              :span-options="gridFacilityOptions.merge"
              :use-paging="false"
              label="L0000000535"
              @tableLinkClicked="tableLinkClicked"
              @selectedRow="selectedRow"
            >
            </y-data-table> -->
          <!-- 공정별 설비 목록 -->
          <y-auigrid
            ref="yAuiGrid2"
            :name="gridFacilityOptions.name"
            :headers="gridFacilityOptions.header"
            :btns="gridFacilityOptions.btns"
            :height="gridFacilityOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000000535')"
            :useExcelExport="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            :showGridSetSave="true"
            @cellClick="selectedRow"
          />
        </b-col>
      </b-col>
      <y-search-box
        :gridOptions="gridMaterialOptions"
        v-if="false"
      ></y-search-box>
      <b-col sm="12" class="mt-3">
        <b-col sm="12" class="px-0">
          <!-- 자재 목록 -->
          <!-- <y-data-table
            v-if="isRendered"
            ref="dataTable"
            label="L0000002316"
            :height="gridMaterialOptions.height"
            :headers="gridMaterialOptions.header"
            :items="gridMaterialOptions.data"
            :use-paging="false"
            :useRownum="false"
            :pageTotal="searchParam.pageTotal"
          ></y-data-table>
          <div class="pagination-container">
            <el-pagination
              ref="pagination"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="materialSearchParam.pageNumber"
              :page-size="materialSearchParam.pageSize"
              :page-sizes="materialSearchParam.pageSizes"
              layout="total, sizes, prev, pager, next, jumper, ->, slot"
              :total="materialSearchParam.pageTotal"
            ></el-pagination>
          </div> -->
          <!-- 자재 목록 -->
          <y-auigrid
            ref="yAuiGrid3"
            :name="gridMaterialOptions.name"
            :headers="gridMaterialOptions.header"
            :height="gridMaterialOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000002316')"
            :useExcelExport="true"
            :enableSorting="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :usePaginate="true"
            :showGridSetSave="true"
            :paginateListCount="materialSearchParam.pageSize"
            :paginateTotalCount="materialSearchParam.pageTotal"
            :paginateCurrentPage="materialSearchParam.pageNumber"
          />
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import YTreeDataTable from '@/components/YTreeDataTable';
import arrayToTree from 'array-to-tree';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
var pixelWidth = require('string-pixel-width');
let materialGridHeader = [];

export default {
  name: 'y-facility-mst-status',
  components: {
    YTreeDataTable,
  },
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '', // 사업장
      deptCd: '', // 관리부서 코드
      processCd: '', // 공정
      specHealth: '',
    },
    materialSearchParam: {
      search: '',
      regulItmNos: [],
      chemprodNm: '',
      dgrYn: '',
      plantCd: null,
      deptCd: null,
      safFacilityCd: null,
      useYn: '',
      pageNumber: 1,
      pageSize: 20,
      pageTotal: 0,
      pageSizes: [10, 20],
      orderByExpression: '',
    },
    gridOptions: {
      header: [],
      data: [],
      height: '200',
      merge: [],
    },
    gridFacilityOptions: {
      header: [],
      data: [],
      height: '200',
      merge: [],
    },
    gridMaterialOptions: {
      header: [],
      data: [],
      height: 400,
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '60%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    searchUrl: '',
    searchFacilityUrl: '',
    regulItems: [],
    specHealthItems: [],
    isRendered: false,
    YAuiGrid: null,
    YAuiGrid2: null,
    YAuiGrid3: null,
  }),
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
    this.YAuiGrid3 = this.$refs.yAuiGrid3;
    // this.mountedInit();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = selectConfig.saf.facilityMstStatus.list.url;
      this.searchFacilityUrl = selectConfig.saf.facilityMst.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: '',
          dataField: 'deptNm',
          width: '150px',
          style: 'center',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '150px',
          style: 'center',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001588'),
          dataField: 'facilityCount',
          width: '120px',
          style: 'center',
        }, // 설비 수
      ];
      this.gridFacilityOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: '140px',
          style: 'left',
        }, // 공정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001597'),
          dataField: 'safFacilityTypeNm',
          width: '150px',
          style: 'center',
        }, // 설비유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001618'),
          dataField: 'safFacilityCd',
          width: '110px',
          style: 'center',
        }, // 설비코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001596'),
          dataField: 'facilityNm',
          width: '200px',
          style: 'left',
        }, // 설비명
      ];

      materialGridHeader = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000940'),
          dataField: 'plant_nm',
          width: '150px',
          style: 'center',
        }, // 대표사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000157'),
          dataField: 'sap_mat_cd',
          width: '120px',
          style: 'center',
        }, // SAP자재코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003318'),
          dataField: 'chem_prod_nm_kr',
          width: '150px',
          style: 'left',
        }, // 화학자재명(국문)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001635'),
          dataField: 'property_nm',
          width: '100px',
          style: 'center',
        }, // 성상
      ];
      this.specHealthItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        {
          code: 'true',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003714'),
        }, // 특수건강검진o
        {
          code: 'false',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003715'),
        }, // 특수건강검진x
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList(); // 안전점검결과 목록 조회
      this.getRegulItems();
    },
    // mountedInit() {
    //   this.gridOptions.btn = [
    //     {
    //       title: this.$comm.getLangSpecInfoLabel('L0000000327'),
    //       color: 'green',
    //       btnClicked: 'getList',
    //     }, // 검색
    //   ];
    //   this.YAuiGrid.setBtnArr(this.gridOptions.btn);
    // },
    /** 안전점검결과 목록 조회 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.convertTree(_result.data);
          this.YAuiGrid.setGridData(this.convertTree(_result.data));
          this.$comm.pushCookie(this.searchParam);
          this.gridFacilityOptions.data = [];
          this.gridMaterialOptions.data = [];
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 규제법규 및 항목 검색
     */
    getRegulItems() {
      this.$http.url = selectConfig.chm.chemicalRegulItem.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          let keys = this.$_.uniq(this.$_.map(_result.data, 'regulLawCd'));
          let keyNames = this.$_.uniq(this.$_.map(_result.data, 'regulLawNm'));
          this.$_.forEach(keys, (key) => {
            this.regulItems.push(
              this.$_.filter(_result.data, { regulLawCd: key })
            );
          });
          this.setRegulItemData([]);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setRegulItemData(regulItmNms) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'CHM_REGUL_LAW'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.setChemHeader(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setChemHeader(reguls) {
      var i = 0;
      var maxWidth = 50;
      this.$_.forEach(reguls, (regul) => {
        var parent = null;
        var children = [];
        this.$_.forEach(this.regulItems[i], (item) => {
          var width = pixelWidth(item.regulItmNm, {
            size: 12,
            bold: true,
            font: 'Arial',
          });
          if (width > maxWidth) {
            maxWidth = width;
          }
          if (item.regulLawCd === regul.code) {
            children.push({
              headerText: item.regulItmNm,
              dataField: item.regulItmNo.toString(),
              width: '80px',
              style: 'center',
              sortable: false,
              prop: item.regulItmNo.toString(),
              dataType: 'tag',
              compareVal: 'Y',
              trueVal: 'danger',
              falseVal: '',
            });
          }
        });
        // 부모에 맞게 자식 배열을 넣어주도록 하기 위함
        // 자식배열이 없는 경우 []의 빈 배열 값으로 들어가는게 아닌, 배열 자체를 넣어주지 않음
        if (children.length > 0) {
          parent = {
            headerText: this.$comm.getLangSpecInfoLabel(regul.codeNm),
            children: children,
            sortable: false,
          };
        } else {
          parent = {
            headerText: this.$comm.getLangSpecInfoLabel(regul.codeNm),

            sortable: false,
          };
        }

        i++;
        // this.gridMaterialOptions.header.push(parent);

        materialGridHeader.push(parent);
      });
      this.gridMaterialOptions.header = materialGridHeader;

      // this.$_.forEach(this.gridMaterialOptions.header, (item) => {
      //   if (item.children !== undefined) {
      //     console.log('item: ', item);
      //   }
      // });
      this.YAuiGrid3.changeColumnLayout(this.gridMaterialOptions.header);
      this.isRendered = true;
    },
    // selectedRow(row) {
    //   this.materialSearchParam.plantCd = row.plantCd;
    //   this.materialSearchParam.deptCd = row.deptCd;
    //   this.materialSearchParam.safFacilityCd = row.safFacilityCd;

    //   this.getMeterialDatas();
    // },
    selectedRow(event) {
      console.log('12', event);
      this.materialSearchParam.plantCd = event.item.plantCd;
      this.materialSearchParam.deptCd = event.item.deptCd;
      this.materialSearchParam.safFacilityCd = event.item.safFacilityCd;

      this.getMeterialDatas();
    },
    /**
     * 메뉴 트리용 기초 정보를 Tree 메뉴로 변환
     */
    convertTree(_treeBases) {
      if (!_treeBases || _treeBases.length <= 0) return null;
      var tree = arrayToTree(_treeBases, {
        parentProperty: 'pdeptCd',
        customID: 'deptCd',
      });
      return tree;
    },
    // rowClicked(row) {
    //   const selectedRows = this.YAuiGrid.getCheckedRowItems().map(
    //     (rows) => rows.item
    //   );

    //   this.$http.url = this.searchFacilityUrl;
    //   this.$http.type = 'get';
    //   this.$http.param = {
    //     plantCd: row.plantCd,
    //     deptCd: row.deptCd,
    //   };
    //   this.$http.request(
    //     (_result) => {
    //       this.gridFacilityOptions.data = _result.data;
    //     },
    //     (_error) => {
    //       window.getApp.$emit(
    //         'APP_REQUEST_ERROR',
    //         'M0000000016'
    //         // 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
    //       );
    //     }
    //   );
    // },
    rowClicked(event) {
      this.$http.url = this.searchFacilityUrl;
      this.$http.type = 'get';
      this.$http.param = {
        plantCd: event.item.plantCd,
        deptCd: event.item.deptCd,
      };
      this.$http.request(
        (_result) => {
          this.gridFacilityOptions.data = _result.data;
          this.YAuiGrid2.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016'
            // 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    // 그리드 row click 이벤트
    // tableLinkClicked(header, data) {
    //   if (data === null) return;
    //   this.btnPopupClickedCallback(data);
    // },
    tableLinkClicked(event) {
      if (event === null) return;
      this.btnPopupClickedCallback(event);
    },

    /** button 관련 이벤트 **/

    // 유형별 설비현황 상세 팝업
    // btnPopupClickedCallback(data) {
    //   this.popupOptions.target = () =>
    //     import(`${'./facilityMstStatusDetail.vue'}`);
    //   this.popupOptions.title = 'L0000003723';
    //   // 부서공정별 설비현황 상세
    //   this.popupOptions.visible = true;
    //   this.popupOptions.width = '85%';
    //   this.popupOptions.top = '10px';
    //   this.popupOptions.param = {
    //     deptCd: data ? data.deptCd : '',
    //     deptNm: data ? data.deptNm : '',
    //     processCd: data ? data.processCd : '',
    //     processNm: data ? data.processNm : '',
    //   };
    //   this.popupOptions.closeCallback = this.closePopup;
    // },
    btnPopupClickedCallback(event) {
      this.popupOptions.target = () =>
        import(`${'./facilityMstStatusDetail.vue'}`);
      this.popupOptions.title = 'L0000003723';
      // 부서공정별 설비현황 상세
      this.popupOptions.visible = true;
      this.popupOptions.width = '85%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        deptCd: event.item ? event.item.deptCd : '',
        deptNm: event.item ? event.item.deptNm : '',
        processCd: event.item ? event.item.processCd : '',
        processNm: event.item ? event.item.processNm : '',
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    // 팝업 닫기
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    // 버튼 에러 처리용 공통함수
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    rowClassName({ row, rowIndex }) {
      var returnText = '';
      if (rowIndex % 2 === 1) {
        returnText = 'odd-row';
      } else if (rowIndex % 2 === 0) {
        returnText = 'even-row';
      }
      return returnText;
    },
    myRowClassName({ row, rowIndex }) {
      if (this.$_.parseInt(row.facilityCount) > 0) {
        return 'count-row';
      }
      return '';
    },
    handleSizeChange(_newPageSize) {
      this.materialSearchParam.pageSize = _newPageSize;
      this.getMeterialDatas();
    },
    handleCurrentChange(_newPage) {
      this.getMeterialDatas();
    },
    getMeterialDatas() {
      this.$http.url = selectConfig.chm.chemprod.listpage.url;
      this.$http.type = 'GET';
      this.$http.param = this.materialSearchParam;

      this.$http.request(
        (_result) => {
          console.log('123', _result.data);
          // this.gridMaterialOptions.data = _result.data.items;
          this.YAuiGrid3.setGridData(_result.data.items);
          this.materialSearchParam.pageTotal = Number(_result.data.count);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** end button 관련 이벤트 **/
  },
};
</script>

<style>
.count-row {
  background-color: #f2f5a9 !important;
}
.pagination-container {
  background: #fff;
  padding: 0px 16px;
  text-align: center;
}
.pagination-container.hidden {
  display: none;
}
</style>
