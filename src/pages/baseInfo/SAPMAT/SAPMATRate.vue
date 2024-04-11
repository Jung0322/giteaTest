<!--
  목적 : 기초정보 > 자재관리 > 자재별 제조업체 비율
  작성자 : kdh > kyh
  Detail : 자재 목록//조회 화면
  y-aui-grid 작업 완료
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 자재명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002326"
            name="matName"
            v-model="searchParam.matName"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 자재번호 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002329"
            name="matCode"
            v-model="searchParam.matCode"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 자재그룹 -->
          <y-select
            :width="8"
            :comboItems="sapMatGroupItems"
            itemText="matGroupNmUp"
            itemValue="matGroupCd"
            ui="bootstrap"
            label="L0000002325"
            name="matGroupCd"
            v-model="searchParam.matGroupCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001439"
            name="useYn"
            v-model="searchParam.useYn"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 자재 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002316')"
          :useExcelExport="true"
          :enableSorting="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :usePaginate="true"
          :showGridSetSave="true"
          :paginateListCount="searchParam.pageSize"
          :paginateTotalCount="searchParam.pageTotal"
          :paginateCurrentPage="searchParam.pageNumber"
          :showRowCheckColumn="editable && popupParam.multiple"
          @cellClick="cellClickHandler"
          @btnAdd="btnAdd"
          @cellDoubleClick="cellDoubleClickHandler"
          @btnGetList="getDataList"
          @closePopup="closePopup"
          @paginateClick="handleCurrentChange"
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
  name: 'SAP-MAT-rate',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          popupMode: false,
        };
      },
    },
  },
  data() {
    return {
      SAPMAT: {
        matCode: '',
        matName: '',
        matNameEng: '',
        packUnit: '',
        matGroupNm: '',
        matType: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        matVendors: [],
      },
      searchParam: {
        matCode: '', // 자재번호
        matName: '', // 자재명
        matGroupCd: '',
        useYn: 'Y',
        pageNumber: 1,
        pageSize: 100,
        pageTotal: 0,
        pageSizes: [50, 100],
        orderByExpression: '',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: null,
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      gridOptions: {
        header: [],
        data: [],
        height: '700',
      },
      sapMatGroupItems: [],
      useItems: [],
      selectedValue: null,
      YAuiGrid: null,
      editable: false,
      searchUrl: '',
      searchSapMatGroupUrl: '',
    };
  },
  watch: {
    'searchParam.pageNumber': {
      handler: function (val, oldVal) {
        this.getDataList();
      },
      deep: true,
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.mountedInit();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.baseInfo.SAPMAT.list.url;
      this.searchSapMatGroupUrl = selectConfig.baseInfo.SAPMAT.groups.url;
      this.editable = this.$route.meta.editable;

      // 자재 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002329'),
          dataField: 'mat_code',
          width: '120px',
          style: 'center',
        }, // 자재번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002328'),
          dataField: 'mat_name',
          width: '200px',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 자재명 kor
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002327'),
          dataField: 'mat_name_eng',
          width: '200px',
        }, // 자재명 eng
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002325'),
          dataField: 'mat_group_nm',
          width: '130px',
          style: 'center',
        }, // 자재그룹
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003141'),
          dataField: 'pack_unit',
          width: '100px',
          style: 'center',
        }, // 포장단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          name: 'use_yn_nm',
          width: '80px',
          style: 'center',
        }, // 사용여부
      ];
      this.useItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getSapMatGroup(); // 자재 그룹
      this.getDataList(); // 자재 grid
    },
    mountedInit() {
      if (this.popupParam.popupMode) {
        if (this.editable) {
          this.gridOptions.btn = [
            {
              title: this.$comm.getLangSpecInfoLabel('L0000000327'),
              color: 'green',
              btnClicked: 'btnGetList',
            }, // 검색
            {
              title: this.$comm.getLangSpecInfoLabel('L0000001561'),
              color: 'orange',
              btnClicked: 'btnAdd',
            }, // 선택
            {
              title: this.$comm.getLangSpecInfoLabel('L0000000881'),
              btnClicked: 'closePopup',
            }, // 닫기
          ];
        } else {
          this.gridOptions.btn = [
            {
              title: this.$comm.getLangSpecInfoLabel('L0000000327'),
              color: 'green',
              btnClicked: 'btnGetList',
            }, // 검색
            {
              title: this.$comm.getLangSpecInfoLabel('L0000000881'),
              color: 'green',
              btnClicked: 'closePopup',
            }, // 닫기
          ];
        }
      } else {
        this.gridOptions.btn = [
          {
            title: this.$comm.getLangSpecInfoLabel('L0000000327'),
            color: 'green',
            btnClicked: 'btnGetList',
          }, // 검색
        ];
      }

      this.YAuiGrid.setBtnArr(this.gridOptions.btn);
    },
    // 자재 그룹
    getSapMatGroup() {
      this.$http.url = this.searchSapMatGroupUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            matGroupCd: '',
            matGroupNmUp: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          this.sapMatGroupItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 자재 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.searchParam.pageTotal = _result.data.count;

          this.YAuiGrid.setGridData(_result.data.items);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 그리드 row click 이벤트
    selectedRow(data) {
      if (data === null) return;
      if (!this.popupParam.popupMode) return;
      if (this.popupParam.popupMode) {
        this.selectedValue = data;
        return;
      }
    },
    cellDoubleClickHandler(data) {
      if (!this.popupParam.popupMode) return;
      this.closePopup(data);
    },

    /** Button Event **/
    // 검색박스숨기기

    btnAdd() {
      this.closePopup(this.selectedValue);
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', { data });
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    handleSizeChange(_newPageSize) {
      this.searchParam.pageSize = _newPageSize;
      this.getDataList();
    },
    handleCurrentChange(_newPage) {
      this.searchParam.pageNumber = _newPage;
      this.getDataList();
    },
    tableSortChange(_item) {
      this.searchParam.orderByExpression =
        this.$comm.toUndrFromCamelCase(_item.prop) +
        ' ' +
        (_item.order === 'descending' ? 'desc' : 'asc');
      this.getDataList();
    },
    search() {
      this.searchParam.pageNumber = 1;
      this.getDataList();
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.item === null || event.item === undefined) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./SAPMATRateDetail.vue'}`);
      this.popupOptions.title = 'L0000002318';
      // 자재 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = { mat_code: event.item.mat_code };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    /** /Button Event **/
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
