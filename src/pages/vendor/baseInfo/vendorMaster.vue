<!--
  목적 : 협력업체관리 > 기준정보 > 협력업체관리
  작성자 : kdh
  Detail : 협력업체관리 목록/등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 업체분류 -->
          <y-select
            :width="8"
            :comboItems="vendorTypeSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001959"
            v-model="searchParam.vendorTypeCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 업체유형 -->
          <y-select
            :width="8"
            :comboItems="vendorAttSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001961"
            v-model="searchParam.vendorAttCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 업체명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001957"
            name="vendorNmSearch"
            v-model="searchParam.vendorNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <b-row>
      <b-col sm="12" class="h100p">
        <!-- 사용자 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001462')"
          :useExcelExport="false"
          :enableSorting="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="popupParam.multiSelect"
          :usePaginate="true"
          :paginateListCount="searchParam.pageSize"
          :paginateTotalCount="searchParam.pageTotal"
          :paginateCurrentPage="searchParam.pageNumber"
          @paginateClick="paginateClickHandler"
          @cellClick="cellClickHandler"
          @cellDoubleClick="cellDoubleClickHandler"
          @openPopup="openPopup"
          @btnAdd="btnAdd"
          @btnSearch="btnSearchClickedCallback"
          @btnClosePopup="closePopup('C')"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';

export default {
  name: 'y-chemical-branch',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          vendoerCd: [],
          vendorTypeCd: '',
          gubun: '',
          popupMode: false,
          multiSelect: false,
          vendors: [],
          plantCd: '',
        };
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      selectVendor: null,
      searchParam: {
        plantCd: '', // 사업장
        vendorTypeCd: '', // 업체분류
        vendorAttCd: '', // 업체유형
        vendorNm: '', // 업체명
        pageNumber: 1,
        pageSize: 20,
        pageTotal: 0,
        pageSizes: [10, 20],
        orderByExpression: '',
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },
      selectedValue: [],
      editable: false,
      searchUrl: '',
      vendorTypeSearchItems: [],
      vendorAttSearchItems: [],
      selectVendorData: null, // ?
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.editable = this.$route.meta.editable;
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getDataList(); // 업체 grid
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.vendor.baseInfo.vendorMaster.list.url;

      if (this.popupParam.vendorTypeCd) {
        this.searchParam.vendorTypeCd = this.popupParam.vendorTypeCd;
      }
      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.popupParam.plantCd;
      }

      // 업체분류
      this.$comm.getComboItems('COM_VENDOR_TYPE', true).then((_result) => {
        this.vendorTypeSearchItems = _result;
      });
      // 업체유형
      this.$comm.getComboItems('COM_VENDOR_ATT', true).then((_result) => {
        this.vendorAttSearchItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = null;

      if (
        !this.popupParam.popupMode ||
        this.popupParam.popupMode === '' ||
        this.popupParam.popupMode === undefined
      ) {
        searchParamByCookie = this.$comm.setSearchParamByCookie();
        if (typeof searchParamByCookie !== 'undefined') {
          this.searchParam = searchParamByCookie;
        }
      }

      this.setGrid();
    },
    /** 업체 grid 헤더 설정 */
    setGrid() {
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNms',
          style: 'left-align',
          width: '220',
        } /* 사업장 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001959'),
          dataField: 'vendorTypeNm',
          width: '130',
        } /* 업체분류 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001961'),
          dataField: 'vendorAttNm',
          width: '80',
        } /* 업체유형 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000702'),
          dataField: 'originNmKr',
          width: '100',
        } /* 국가 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001958'),
          dataField: 'vendorNm',
          width: '230',
          style: 'left-align',
          styleFunction: (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item,
            dataField
          ) => {
            if (this.popupParam.popupMode) {
              return 'row-color';
            } else {
              return 'row-color2';
            }
          },
        } /* 업체명(국문) */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001414'),
          dataField: 'bizNum',
          width: '110',
        } /* 사업자번호 */,
      ];

      if (!this.popupParam.popupMode) {
        this.gridOptions.header.push(
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002528'),
            dataField: 'vendorTel',
            width: '150',
          } /* 전화번호 */,
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000895'),
            dataField: 'chargerNm',
            width: '150',
          } /* 담당자명 */,
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001280'),
            dataField: 'vendorAddr',
            width: '250',
            style: 'left-align',
          } /* 본사주소 */,
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000005111'),
            dataField: 'regDt',
            width: '120',
          } /* 협력업체등록일 */,
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
            dataField: 'useYnNm',
            width: '80',
          } /* 사용여부 */
        );
      } else {
        this.gridOptions.header[4].renderer = {
          type: 'LinkRenderer',
          baseUrl: 'javascript',
          jsCallback: function (rowIndex, columnIndex, value, item) {},
        };
      }

      this.gridOptions.header.push(
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '120',
        } /* 작성자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '120',
        } /* 작성일 */
      );

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openPopup',
          visible: this.editable && !this.popupParam.popupMode,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnAdd',
          visible: this.editable && this.popupParam.popupMode,
        }, // 선택
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, //  검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClosePopup',
          visible: this.popupParam.popupMode,
        }, //  닫기
      ];
    },
    // 업체 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.searchParam.pageTotal = _result.data.count;
          this.YAuiGrid.setGridData(_result.data.items);
          if (!this.popupParam.popupMode) {
            this.$comm.pushCookie(this.searchParam);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /validation checking **/

    /** Button Event **/

    // 검색
    btnSearchClickedCallback(_result) {
      this.searchParam.pageNumber = 1;
      this.getDataList();
    },
    paginateClickHandler(pageNum) {
      this.searchParam.pageNumber = pageNum;
      this.getDataList();
    },
    cellClickHandler(event) {
      if (!event.item) return;

      if (event.dataField === 'vendorNm') {
        if (this.popupParam.popupMode) {
          return;
        } else {
          this.openPopup(event.item);
        }
      }

      if (!this.popupParam.popupMode) return;
      this.selectVendorData = event.item;
    },
    resizeGrid() {
      let _height = window.innerHeight - 390;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    cellDoubleClickHandler(event) {
      if (this.popupParam.popupMode && !this.popupParam.multiSelect) {
        this.closePopup(event.item);
      }
    },
    openPopup(data) {
      this.popupOptions.param = {
        vendorCd: data ? data.vendorCd : '',
      };
      this.popupOptions.target = () => import(`${'./vendorMasterDetail.vue'}`);
      this.popupOptions.title = 'L0000003254'; /* 협력업체 정보 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '20px';
      this.popupOptions.closeCallback = this.closeVendorDetailPopup;
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closeVendorDetailPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getDataList();
    },

    btnAdd() {
      if (!this.popupParam.multiSelect) {
        if (!this.selectVendorData) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'M0000000811' /* 업체를 선택하세요. */,
            type: 'warning',
          });
        } else this.closePopup(this.selectVendorData);
      } else {
        const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
        this.closePopup(selectedRows);
      }
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', { data, gubun: this.popupParam.gubun });
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
<style>
.pagination-container {
  background: #fff;
  padding: 0px 16px;
  text-align: center;
}
.pagination-container.hidden {
  display: none;
}
.row-color2 {
  color: #0a85e7 !important;
  cursor: pointer !important;
}
.row-color {
  color: #333333 !important;
  pointer-events: none;
}
</style>
