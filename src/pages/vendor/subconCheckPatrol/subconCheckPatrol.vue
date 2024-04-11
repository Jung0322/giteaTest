<!--
  목적 : 협력업체 > 협력업체 자체점검 목록 
  작성자 : kyk
  Detail : 협력업체 자체점검 목록  
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 점검종류 -->
          <y-select
            :width="8"
            :comboItems="checkKindCdItems"
            itemText="safCheckKindNm"
            itemValue="safCheckKindNo"
            ui="bootstrap"
            name="checkKindCd"
            label="L0000002576"
            v-model="searchParam.checkKindCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000767"
            name="searchPeriod"
            default="searchParam.searchPeriod"
            v-model="searchParam.searchPeriod"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 업체 -->
          <y-text
            :width="8"
            :readonly="true"
            ui="bootstrap"
            name="vendorNm"
            label="L0000001951"
            v-model="searchParam.vendorNm"
            v-validate="'required'"
            :appendIcon="[
              { icon: 'search', callbackName: 'searchVendorMaster' },
            ]"
            @searchVendorMaster="btnSearchVendorClicked"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 점검명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002551"
            name="checkTitle"
            v-model="searchParam.checkTitle"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1">
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getDataList"
            />
          </div>
           협력업체 자체점검 목록
          <y-data-table
            label="L0000003253"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            excelDown="true"
            @tableLinkClicked="tableLinkClicked"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003253')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getDataList="getDataList"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'y-subcon-check-patrol',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return { selfCheckNo: [], popupMode: false };
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
      searchParam: {
        plantCd: '', // 사업장
        checkKindCd: null, // 점검종류코드
        searchPeriod: [], // 기간
        vendorCd: '', // 업체코드
        vendorNm: '', // 업체명
        checkTitle: '',
      },
      gridOptions: {
        name: 'subconCheckPatrol',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      searchUrl: '',
      searchKindUrl: '',
      checkKindCdItems: [],
      isInit: true,
    };
  },
  watch: {
    'searchParam.plantCd': function (newVal, oldVal) {
      this.getCheckKindCdItems();
    },
    'searchParam.vendorNm'() {
      if (
        this.searchParam.vendorNm === '' ||
        this.searchParam.vendorNm === null
      ) {
        this.searchParam.vendorCd = '';
      }
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.searchUrl = selectConfig.vendor.subconCheckPatrol.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002576'),
          dataField: 'safCheckKindNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002570'),
          dataField: 'checkYmd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002551'),
          dataField: 'checkTitle',
          width: '40%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002560'),
          dataField: 'vendorNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',
        },
      ];
      // 기간 Setting
      this.searchParam.searchPeriod.push(
        this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '-2m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        )
      );

      this.searchParam.searchPeriod.push(
        this.$comm.moment(this.$comm.getToday()).format('YYYY-MM-DD')
      );

      this.checkKindCdItems = [
        {
          safCheckKindNo: null,
          safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
        },
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDataList();
    },
    // 점검종류 조회
    getCheckKindCdItems() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        subconUseYn: 'Y',
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          this.checkKindCdItems = this.$_.clone(_result.data);

          if (
            this.$_.findIndex(this.checkKindCdItems, {
              safCheckKindNo: this.searchParam.safCheckKindNo,
            }) === -1
          ) {
            this.searchParam.checkKindCd = null;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 375;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    // 업체 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /validation checking **/

    /** Button Event **/

    // 버튼 에러 처리
    cellClickHandler(event) {
      if (event.dataField !== 'checkTitle') return;
      this.openPopup(event.item);
    },
    tableLinkClicked(header, row) {
      this.openPopup(row);
    },
    openPopup(data) {
      this.popupOptions.param = {
        vendorCheckRsltNo: data ? data.vendorCheckRsltNo : 0,
      };
      this.popupOptions.target = () =>
        import(`${'./subconCheckPatrolDetail.vue'}`);
      this.popupOptions.title = 'L0000003252'; // 협력업체 자체점검
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '20px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    // 업체명 검색
    btnSearchVendorClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003848'; // 협력업체검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closePopupSearchVendor;
    },
    // 업체 검색 팝업 닫기
    closePopupSearchVendor(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data) {
        this.searchParam.vendorCd = data.data.vendorCd;
        this.searchParam.vendorNm = data.data.vendorNm;
      }
    },
  },
};
</script>
