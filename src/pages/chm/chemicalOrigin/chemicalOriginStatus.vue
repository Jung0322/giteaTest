<!--
  목적 : 인허가현황
  작성자 : kyk
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            filter="chm"
            v-model="searchParam.plantCd"
            @datachange="
              (val) => {
                (searchParam.plantCd = val), changePlant();
              }
            "
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 인허가종류 -->
          <y-select
            :width="8"
            :comboItems="permitClsNoItems"
            itemText="permitClsNm"
            itemValue="permitClsNo"
            ui="bootstrap"
            name="permitClsNo"
            label="L0000002256"
            v-model="searchParam.permitClsNo"
            @datachange="
              (val) => {
                (searchParam.permitClsNo = val), getDataList();
              }
            "
          />
        </b-col>

        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="useYn"
            label="L0000001439"
            v-model="searchParam.useYn"
            @datachange="
              (val) => {
                (searchParam.useYn = val), getDataList();
              }
            "
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row class="mt-3 h-100">
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 
            <y-btn
              v-if="!popupParam.popupMode && editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnInsert"
            />
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="btnSearchClicked" />
          </div>
           인허가신고 현황 
          <y-data-table
            label="L0000002255"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            excelDown="true"
            :use-paging="true"
            :use-server-paging="false"
            @tableLinkClicked="tableLinkClicked"
          />
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002255')"
          :useExcelExport="false"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @btnSearchClicked="btnSearchClicked"
          @btnInsert="btnInsert"
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
  name: 'chemical-origin-status',
  components: {},
  /** props, data, computed, watch **/
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return { chemPermitProdHis: [], popupMode: false };
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        searchPeriod: [],
        permitProdHisNo: 0,
        plantCd: '',
        permitClsNo: '',
        from: '',
        to: '',
        useYn: 'Y',
      },
      gridOptions: {
        name: 'chemicalOriginStatus',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      editable: true,
      useItems: [],
      permitClsNoItems: [], // 인허가종류(인허가신고서)
      searchUrl: '',
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    this.editable = this.$route.meta.editable;
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {
    this.$comm.pushCookie(this.searchParam);
  },
  destroyed() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.searchUrl = selectConfig.chm.chemPermitProdHis.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002256'),
          dataField: 'permitClsNm',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001785'),
          dataField: 'permitDt',
          width: '7%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001783'),
          dataField: 'permitOrg',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001784'),
          dataField: 'permitNum',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001787'),
          dataField: 'chemProdNmKr',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001452'),
          dataField: 'useDeptNm',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002478'),
          dataField: 'storFac',
          width: '9%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002843'),
          dataField: 'fileNm',
          width: '10%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
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
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnInsert',
          visible: !this.popupParam.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClicked',
        },
      ];
      this.useItems = [
        {
          code: '',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
        },
        {
          code: 'Y',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001440'),
        },
        {
          code: 'N',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001063'),
        },
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 By 2022-05-09 장헌영 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getPermitCls(); // 인허가종류
      this.getDataList();
    },
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    changePlant() {
      this.getDataList();
      if (this.searchParam.plantCd) {
        this.getPermitCls();
      } else {
        this.permitClsNoItems = [
          {
            permitClsNo: '',
            permitClsNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          },
        ];
        if (
          this.$_.findIndex(this.permitClsNoItems, {
            permitClsNo: this.searchParam.permitClsNo,
          }) === -1
        ) {
          this.searchParam.permitClsNo = '';
        }
      }
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    cellClickHandler(event) {
      if (event.dataField === 'permitDt') {
        this.OpenInsertPopup(event.item);
      }
      // MSDS파일을 누를 시 MSDS 파일을 다운로드한다.
      else if (event.dataField === 'fileNm' && event.item.fileNm !== null) {
        // 파일을 다운로드
        this.onDocumentDownload(event.item);
      }
    },
    tableLinkClicked(header, data) {
      if (header.name === 'permitDt') {
        this.OpenInsertPopup(data);
      }
      // MSDS파일을 누를 시 MSDS 파일을 다운로드한다.
      else if (header.name === 'fileNm') {
        // 파일을 다운로드
        this.onDocumentDownload(data);
      }
    },
    getDetail(data) {
      this.popupOptions.param = {
        permitProdHisNo: data.permitProdHisNo,
        userId: data.userId,
      };
      this.popupOptions.target = () =>
        import(`${'./chemicalOriginStatusDetail.vue'}`);
      this.popupOptions.title = 'L0000002259';
      // 인허가현황 상세
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '20px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },

    btnSearchClicked() {
      this.getDataList();
    },

    btnInsert() {
      this.OpenInsertPopup(null);
    },
    OpenInsertPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./chemicalOriginStatusDetail.vue'}`);
      this.popupOptions.title = 'L0000002259';
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '20px';
      this.popupOptions.param = {
        permitProdHisNo: data ? data.permitProdHisNo : 0,
      };
      this.popupOptions.closeCallback = this.closeChemPopup;
    },
    closeChemPopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList(); // 화학물질 grid
    },
    getPermitCls() {
      this.$http.url = selectConfig.chm.chemicalPermitCls.listsimple.url;
      this.$http.type = 'get';
      this.$http.param = {
        useYn: 'Y',
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.permitClsNoItems = this.$_.clone(_result.data);
          this.permitClsNoItems.splice(0, 0, {
            permitClsNo: '',
            permitClsNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          });
          if (
            this.$_.findIndex(this.permitClsNoItems, {
              permitClsNo: this.searchParam.permitClsNo,
            }) === -1
          ) {
            this.searchParam.permitClsNo = '';
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    onDocumentDownload(_item) {
      let thisVue = this;
      let accept = this.$comm.getAccept(_item.fileExt);
      let _comm = this.$comm;
      this.$http.url = selectConfig.attachFile.file64.url; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.param = { fileNo: _item.fileNo, taskFlag: '' }; // 해당 컴포넌트는 공정안전자료에서 사용하지 않기 때문에 taskFlag는 주지 않는다. 210629 jkl
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, _item.fileNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = _item.fileNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>

<style></style>
