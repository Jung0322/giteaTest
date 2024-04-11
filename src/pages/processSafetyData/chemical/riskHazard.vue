<!--
  목적 : 화학물질정보 > 유해ㆍ위험물질 목록 
작성자 : kdh
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색조건 -->
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003315"
            name="chemProdNmKr"
            v-model="searchParam.chemProdNmKr"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 화학물질 grid -->
    <b-row>
      <b-col sm="12">
        <!-- 유해ㆍ위험물질 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004302')"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
          @btnSearch="getDataList"
          @btnExcelPrint="btnExcelPrintClicked"
          @btnPdfPrint="btnPdfPrintClicked"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'risk-hazard',
  props: {},
  data: function () {
    return {
      searchParam: {
        plantCd: '',
        plantNm: '',
        chemProdNmKr: '',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'processSafetyDataChemicalRiskHazard',
        header: [],
        data: [],
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
      editable: false,
      searchUrl: '',
      printExcelUrl: '',
      printUrl: '',
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getDataList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.psm.facilityChemprod.riskHazard.url;
      this.printUrl = selectConfig.psm.facilityChemprod.print.url;
      this.printExcelUrl = selectConfig.psm.facilityChemprod.print.excel.url;
      this.editable = this.$route.meta.editable;

      this.searchParam.plantNm = this.$store.getters.plantNm;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      const searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '90', 
        }, // 사업장 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003315'), 
          dataField: 'chemProdNmKr', 
          width: '250', 
          style: 'left-align', 
          cellMerge: true
        }, // 화학자재명 
        { 
          headerText: 'MSDS', 
          dataField: 'msds', 
          width: '80', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {}, 
          },
        }, 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003298'), 
          dataField: 'chemNmKr', 
          width: '160', 
          style: 'left-align', 
        }, // 화학물질명 
        { 
          headerText: 'CAS No.', 
          dataField: 'casNo', 
          width: '120', 
        }, 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001348'), 
          dataField: 'moleFormula', 
          width: '150', 
          style: 'left-align', 
        }, // 분자식 
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003147'), // 폭발한계(%)
          children: [
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000001540'), 
              dataField: 'explUpLimit', 
              width: '80', 
              style: 'right-align', 
            }, // 상한 
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000003166'), 
              dataField: 'explLowLimit', 
              width: '80', 
              style: 'right-align', 
            }, // 하한 

          ],
        },
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000845'), 
          dataField: 'leakThresh', 
          width: '110', 
          style: 'left-align', 
        }, // 노출기준 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000959'), 
          dataField: 'lc50', 
          width: '100', 
          style: 'left-align', 
        }, // 독성치 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002261'), 
          dataField: 'flashingPnt', 
          width: '100', 
          style: 'right-align', 
        }, // 인화점 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001104'), 
          dataField: 'IgnitionPnt', 
          width: '100', 
          style: 'right-align', 
        }, // 발화점 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002744'), 
          dataField: 'vaporPressure', 
          width: '100', 
          style: 'right-align', 
        }, // 증기압 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001335'), 
          dataField: 'corrosivenessYnNm', 
          width: '100', 
        }, // 부식성유무 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002210'), 
          dataField: 'extraReactionYnNm', 
          width: '110', 
        }, // 이상반응유무 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002271'), 
          dataField: 'dailyVol', 
          width: '110', 
          style: 'right-align', 
        }, // 일일취급량 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002477'), 
          dataField: 'maxVol', 
          width: '100', 
          style: 'right-align', 
        }, // 저장량 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
          dataField: 'remark', 
          width: '200', 
          style: 'left-align', 
        }, // 비고 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writerUserNm', 
          width: '100',
        }, /* 작성자 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'writerDt', 
          width: '100',
        }, /* 작성일 */ 

      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000004301') + "(EXCEL)", 
          btnClicked: 'btnExcelPrint',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        },  // 유해위험물질출력 (EXCEL)
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000004301') + "(PDF)", 
          btnClicked: 'btnPdfPrint',
          btnClickedError: 'btnClickedError',
        },  // 유해위험물질출력 (PDF)
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green', 
          btnClicked: 'btnSearch',
        },  // 검색
      ]; 

    },
    // 화학물질 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField !== "msds") return;
      // this.popupOptions.param = {
      //   'taskClassNm': 'MSDS',
      //   'refTableId': row.chemProdNo,
      //   'docuKindCd': 'MSDS',
      //   'plantCd': row.plantCd,
      //   'label': 'MSDS',
      //   'taskKey': '0',
      //   'taskFlag': 'SAF',
      //   'isPopup': true,
      // };

      // this.popupOptions.target = () => import(`${'../../common/attachFile/safAttachFile.vue'}`);
      // this.popupOptions.title = 'MSDS 상세';
      // this.popupOptions.width = '80%';
      // this.popupOptions.top = "10px";
      // this.popupOptions.visible = true;
      // this.popupOptions.closeCallback = this.closePopup;

      // 업체별로 MSDS가 따지기 때문에 이부분은 수정이 필요
      // 업체별 MSDS 목록이 뜬 후에 거기서 MSDS 요약본을 클릭하여 볼 수 있도록 수정
      // 현재는 첫번째 MSDS의 요약정보가 바로 팝업으로 뜸
      this.$http.url = selectConfig.chm.MSDS.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        delYn: 'N',
        chemProdNo: event.item.chemProdNo,
      };
      this.$http.request(
        (_result) => {
          if (_result.data && _result.data.length > 0) {
            this.$http.url = this.$format(
              selectConfig.chm.MSDS.get.url,
              _result.data[0].msdsRqstNo
            );
            this.$http.type = 'GET';
            this.$http.request(
              (_result) => {
                this.msds = this.$_.clone(_result.data);
                this.popupOptions.target = () =>
                  import(`${'../../chm/msds/MSDSSummeryEdit.vue'}`);
                this.popupOptions.title = 'MSDS';
                this.popupOptions.visible = true;
                this.popupOptions.width = '80%';
                this.popupOptions.param = {
                  msds: this.$_.clone(_result.data),
                  viewMode: true,
                };
                this.popupOptions.closeCallback = this.closePopup;
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000632', // 등록된 MSDS가 없습니다.
              type: 'warning',
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnPdfPrintClicked() {
      let thisVue = this;
      this.$http.url = this.$format(this.printUrl, this.searchParam.plantCd, this.searchParam.plantNm);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          let fileOrgNm = '유해위험물질_' + this.$comm.getToday() + '.pdf';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
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
    btnExcelPrintClicked() {
      let thisVue = this;
      this.$http.url = this.$format(
        this.printExcelUrl,
        this.searchParam.plantCd,
        this.searchParam.plantNm
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          let fileOrgNm = '유해위험물질_' + this.$comm.getToday() + '.xlsx';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
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

    handleSelect(key, keyPath) {
      if (key === '2-1') {
        this.btnExcelPrintClicked();
      } else {
        this.btnPdfPrintClicked();
      }
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    handleCommand(command) {
      if (command === 'excel') {
        this.btnExcelPrintClicked();
      } else if (command === 'pdf') {
        this.btnPdfPrintClicked();
      }
    },
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 300;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>