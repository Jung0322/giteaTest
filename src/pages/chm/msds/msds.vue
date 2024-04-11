<!--
  목적 : 물질관리 > 화학자재 > MSDS
  작성자 : kdh
  Detail : MSDS 목록 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 검색어 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000331"
            placeholder="L0000003823"
            name="search"
            v-model="searchParam.search"
          ></y-text>
          <!-- L0000003823: 화학자재 및 업체명 -->
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <y-plant
            type="search"
            filter="chm"
            name="plantCd"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- MSDS작성일자 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000133"
            name="evalPeriod"
            :default="searchParam.evalPeriod"
            v-model="searchParam.evalPeriod"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn
              title="일괄 다운로드"
              color="gray"
              @btnClicked="btnAllDown"
            />
             신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnInsert"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getDataList"
            />
          </div>
           MSDS목록 
          <y-data-table
            label="L0000000128"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
            v-model="checkItem"
          >
            <el-table-column
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000128')"
          :useExcelExport="false"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getDataList="getDataList"
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
  name: 'msds',
  props: {},
  data() {
    return {
      checkItem: [],
      searchParam: {
        search: '', // 업체명
        delYn: 'N',
        newYn: 'Y',
        plantCd: '',
        evalPeriod: [], // 기간
        fromYmd: '',
        toYmd: '',
      },
      gridOptions: {
        name: 'msds',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      searchUrl: '',
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
    this.editable = this.$route.meta.editable;
    this.searchParam.fromYmd = this.$comm.getCalculatedDate(
      this.$comm.getToday(),
      '-6m',
      'YYYY-MM-DD',
      'YYYY-MM-DD'
    );
    this.searchParam.toYmd = this.$comm.getCalculatedDate(
      this.$comm.getToday(),
      '1m',
      'YYYY-MM-DD',
      'YYYY-MM-DD'
    );
    this.searchParam.evalPeriod = [
      this.searchParam.fromYmd,
      this.searchParam.toYmd,
    ];
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
      // URL 셋팅
      this.searchUrl = selectConfig.chm.MSDS.list.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDataList(); // MSDS grid

      // MSDS grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003318'),
          dataField: 'chemProdNmKr',
          width: '12%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003319'),
          dataField: 'chemProdNmEn',
          width: '12%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000134'),
          dataField: 'fileOrgNm',
          width: '10%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000132'),
          dataField: 'summaryFileOrgNm',
          width: '10%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002614'),
          dataField: 'revTypeNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000293'),
          dataField: 'revNum',
          width: '6%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002329'),
          dataField: 'chemProdNo',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003824'),
          dataField: 'sapMatCd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000496'),
          dataField: 'vendorNm',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002627'),
          dataField: 'makecpNm',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000133'),
          dataField: 'writeDt',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000297'),
          dataField: 'createDt',
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
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnInsert',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',
        },
      ];
    },
    // MSDS grid
    getDataList() {
      if (
        this.searchParam.evalPeriod &&
        this.searchParam.evalPeriod.length === 2
      ) {
        this.searchParam.fromYmd = this.searchParam.evalPeriod[0];
        this.searchParam.toYmd = this.searchParam.evalPeriod[1];
      }
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    btnInsert(data) {
      this.popupOptions.target = () => import(`${'./MSDSDetail.vue'}`);
      this.popupOptions.title = 'MSDS';
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '50px';
      this.popupOptions.param = {
        msdsRqstNo: data ? data.msdsRqstNo : 0,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    cellClickHandler(event) {
      if (event.dataField === 'chemProdNmEn') {
        this.btnInsert(event.item);
      }
      // MSDS파일을 누를 시 MSDS 파일을 다운로드한다.
      // MSDS요약파일을 누를 시 MSDS 요약파일을 다운로드한다.
      else if (event.dataField === 'fileOrgNm' && event.item.fileNo !== null) {
        this.downloadMsdsFile(
          event.item,
          'MSDS',
          'MSDS',
          event.item.fileNo.split(',')
        );
      } else if (
        event.dataField === 'summaryFileOrgNm' &&
        event.item.fileNo !== null
      ) {
        this.downloadMsdsFile(
          event.item,
          'MSDS_SUMMARY',
          'MSDS요약파일',
          event.item.summaryFileNo.split(',')
        );
      }
    },
    // 그리드 cell click 이벤트
    tableLinkClicked(header, data) {
      // 화학자재명을 누를시 MSDS 상세 정보 팝업을 open
      if (header.name === 'chemProdNmEn') {
        this.btnInsert(data);
      }
      // MSDS파일을 누를 시 MSDS 파일을 다운로드한다.
      // MSDS요약파일을 누를 시 MSDS 요약파일을 다운로드한다.
      else if (header.name === 'fileOrgNm') {
        this.downloadMsdsFile(data, 'MSDS', 'MSDS', data.fileNo.split(','));
      } else if (header.name === 'summaryFileOrgNm') {
        this.downloadMsdsFile(
          data,
          'MSDS_SUMMARY',
          'MSDS요약파일',
          data.summaryFileNo.split(',')
        );
      }
    },
    downloadMsdsFile(data, _taskClassNm, _taskLabel, files) {
      // 파일이 여러개인 경우와 아닌경우를 분리하여 처리
      if (files.length === 1) {
        this.onDocumentDownload(data, _taskClassNm, _taskLabel);
      } else if (files.length > 1) {
        // 팝업
        this.openMsdsFileView(data, _taskClassNm, _taskLabel);
      }
    },
    openMsdsFileView(data, _taskClassNm, _taskLabel) {
      this.popupOptions.target = () => import(`${'./MSDSFileView.vue'}`);
      this.popupOptions.title = 'L0000000127'; // MSDS
      this.popupOptions.visible = true;
      this.popupOptions.width = '50%';
      this.popupOptions.param = {
        msdsRqstNo: data ? data.msdsRqstNo : 0,
        taskClassNm: _taskClassNm,
        taskLabel: _taskLabel,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getDataList(); // 화학자재 grid
    },

    onDocumentDownload(_item, _taskClassNm, _taskLabel) {
      let thisVue = this;
      let accept = this.$comm.getAccept(_item.fileExt);
      let _comm = this.$comm;
      this.$http.url = selectConfig.attachFile.file64.url; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.param = {
        fileNo: _taskClassNm === 'MSDS' ? _item.fileNo : _item.summaryFileNo, // 해당 컴포넌트는 공정안전자료에서 사용하지 않기 때문에 taskFlag는 주지 않는다. 210629 jkl
        taskFlag: '',
      };
      this.$http.request(
        (_result) => {
          let fileOrgNm =
            _taskClassNm === 'MSDS' ? _item.fileOrgNm : _item.summaryFileOrgNm;
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    btnAllDown() {
      let param = {};
      let fileNo = [];
      this.checkItem.forEach((item) => {
        let nm = item.chemProdNmKr;

        if (item.fileNo) {
          let files = item.fileNo.split(',');
          this.$_.forEach(files, (file, i) => {
            let index = i + 1;
            fileNo.push(nm + '|' + index + '|' + file.trim());
          });
        }
      });

      let thisVue = this;
      let accept = this.$comm.getAccept('zip');
      let _comm = this.$comm;
      this.$http.url = 'api/chm/chem/msds/downloadZip';
      this.$http.type = 'GET';
      this.$http.param = {
        fileNo: fileNo,
      };
      this.$http.request(
        (_result) => {
          let fileOrgNm = 'MSDSFile.zip';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
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
