<!--
  목적 : 대기 > 운영관리 > SEMS 데이터 등록 
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-card
          header-class="default-card bg-light"
          body-class="default-body-card"
          class="py-0"
        >
          <div slot="header">
            <div class="float-left">
              <!-- 엑셀업로드 -->
              <y-label label="L0000001969" />
            </div>
            <!-- <div class="float-right mb-1">
              <!-양식다운로드 -->
            <!-- <y-btn title="L0000001925" @btnClicked="excelDownTemplate" />
            </div>
            -->
          </div>
          <b-row>
            <b-col sm="12" class="mb-3">
              <el-upload
                class="upload-demo"
                ref="upload"
                name="files"
                :headers="uploadHeader"
                :action="uploadUrl"
                :data="uploadParam"
                :auto-upload="false"
                :on-success="onSuccess"
                :drag="false"
                :multiple="false"
                :limit="1"
                :on-error="onError"
                v-loading="loading"
              >
                <!-- 파일선택 -->
                <el-button size="small" type="primary">
                  {{ $comm.getLangSpecInfoLabel('L0000003028') }}
                </el-button>
                <!-- 업로드 -->
                <el-button
                  slot="tip"
                  style="margin-left: 10px"
                  size="small"
                  type="success"
                  @click="submitUpload"
                  >{{ $comm.getLangSpecInfoLabel('L0000001934') }}</el-button
                >
              </el-upload>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- 올바로 데이터 등록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :label="this.$comm.getLangSpecInfoLabel('L0000002036')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @excelDownTemplate="excelDownTemplate"
          @btnCreateClickedCallback="btnCreateClickedCallback"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import backendConfig from '@/js/backendConfig.js';
import { getAccessToken } from '@/utils/auth';
export default {
  name: 'allbaro-data',
  props: {},
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
        selectedRowData: {
          freightCost: 0,
          dispoCost: 0,
          freightCostSum: 0,
          dispoCostSum: 0,
          totalCost: 0,
        },
      },
      editable: false,
      updateMode: false,
      insertUrl: '',
      isInsert: false,
      searchExcelUrl: '',
      isEdit: false,
      ewstWasteCdItems: [],
      selectedValue: [],
      ewstDispoMtdCds: [],
      freightVendorCdItems: [],
      dispoVendorCdItems: [],
      ewstDispoMtdCdItems: [],

      uploadUrl: '',
      uploadParam: {
        search: '',
        eairSemsRptTypeCd: '',
      },
      uploadHeader: {},
      uploadList: [],
      loading: false,
      YAuiGrid: null,
    };
  },
  watch: {
    'gridOptions.selectedRowData.freightCostSum': function (
      newValue,
      oldValue
    ) {
      this.gridOptions.selectedRowData.totalCost =
        Number(this.gridOptions.selectedRowData.freightCostSum) +
        Number(this.gridOptions.selectedRowData.dispoCostSum);
    },

    'gridOptions.selectedRowData.dispoCostSum': function (newValue, oldValue) {
      this.gridOptions.selectedRowData.totalCost =
        Number(this.gridOptions.selectedRowData.freightCostSum) +
        Number(this.gridOptions.selectedRowData.dispoCostSum);
    },
    'gridOptions.selectedRowData.ewstWasteNo': function (newValue, oldValue) {
      this.gridOptions.selectedRowData.ewstWasteCd =
        this.gridOptions.selectedRowData.ewstWasteNo;
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  beforeDestory() {},
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchExcelUrl =
        selectConfig.env.air.operationLog.allbaro.excelUpload.url;
      this.uploadUrl = backendConfig.getUrl(
        selectConfig.env.air.operationLog.allbaro.excelUpload.url
      );
      this.insertUrl =
        transactionConfig.env.waste.operationLog.allbaro.insert.url;

      this.uploadHeader = {
        'X-Authorization': getAccessToken(),
      };

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001925'),
          color: 'gray',
          btnClicked: 'excelDownTemplate',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002474'),
          color: 'orange',
          btnClicked: 'btnCreateClickedCallback',
        },
      ];

      this.getEwstWasteCdItems();
      this.getVendorList();
      this.getEwstDispoMtdCdItems();

      this.initGrid();
    },
    // 업로드
    submitUpload() {
      // 파일이 있는지 여부 확인
      if (this.$refs.upload.uploadFiles.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000001934', // '업로드',
          message: 'M0000000083', // '업로드할 파일이 없습니다. 파일을 선택하세요',
          type: 'warning',
        });
        return;
      }
      var uploadFileName = this.$refs.upload.uploadFiles[0].name.toLowerCase();
      if (uploadFileName.indexOf('xlsx') === -1) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000900', // '업로드 파일은 XLSX 형식이어야 합니다.',
          type: 'warning',
        });
        return;
      }
      this.loading = true;
      this.$refs.upload.submit();
    },
    onSuccess(response, file, fileList) {
      this.initGrid();
      this.loading = false;
      this.$refs.upload.clearFiles();
      var i = 0;
      var indexArray = [];
      this.gridOptions.data = [];
      if (response.length === 1 && response[0].errorMessage) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: response[0].errorMessage,
          type: 'warning',
        });
      } else {
        if (this.gridOptions.header[0].name !== 'errorMessage') {
          this.gridOptions.header.splice(0, 0, {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003676'), // '진행내역',
            dataField: 'errorMessage',
            width: '350',
            style: 'left-align',
          });
        }
        this.gridOptions.data = this.$_.clone(response);
        indexArray = this.$_.keys(
          this.$_.pickBy(this.gridOptions.data, { errorMessage: '' })
        );
        this.checkItemData = [];
        for (; i < indexArray.length; i++) {
          this.checkItemData.push(this.gridOptions.data[indexArray[i]]);
        }
      }
    },
    onError(err, file, fileList) {
      this.loading = false;
      console.log(JSON.stringify(err));
      // 인증오류처리
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000086' // '업로드에 실패했습니다. 재시도 시에도 지속적으로 문제가 발생한다면 관리자에게 문의해 주세요.'
      );
      return;
    },
    getConfirmMsg(response) {
      var returnMsg = '';
      if (response.totCount === 0) {
        returnMsg = this.$comm.getLangSpecInfoMessage('M0000000084');
        // returnMsg = '업로드한 파일에 업로드할 데이터가 없습니다. 업로드할 데이터가 있는지 다시한번 확인해 주세요.';
      } else {
        returnMsg = this.$comm.getLangSpecInfoMessage('M0000000085', {
          // 총 {s0}건 (완료 : {s1}, 실패 : {s2})이 업로드 되었습니다.
          s0: response.totCount,
          s1: response.completeCount,
          s2: response.dontCount,
        });
        // returnMsg = String(
        //   '총 ' +
        //     response.totCount +
        //     '건 (완료 : ' +
        //     response.completeCount +
        //     ', 실패 : ' +
        //     response.dontCount +
        //     ')이 업로드 되었습니다.'
        // );
      }
      return returnMsg;
    },
    initGrid() {
      this.gridOptions.header = [
        // 인계일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002230'),
          dataField: 'dispoYmd',
          width: '110',
          style: 'center-align',
          editable: false,
        },
        // 인계번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002229'),
          dataField: 'allbaroTransNum',
          width: '110',
          style: 'center-align',
          editable: false,
        },
        // 폐기물종류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003123'),
          dataField: 'ewstClassNm',
          width: '300',
          style: 'center-align',
          editable: false,
        },
        // 성상
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001635'),
          dataField: 'ewstClassItem',
          width: '110',
          style: 'center-align',
          editable: false,
        },
        // 사업장폐기물
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001435'),
          dataField: 'ewstWasteNo',
          width: '140',
          style: 'center-align',
          renderer: {
            type: "DropDownListRenderer",
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.ewstWasteCdItems;
            },
            keyField: "ewstWasteNo", // key 에 해당되는 필드명
            valueField: "ewstWasteNm", // value 에 해당되는 필드명
          }
        },
        // 위탁량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002111'),
          dataField: 'amtGent',
          width: '110',
          style: 'center-align',
          editable: false,
        },
        // 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'envUnitNm',
          width: '110',
          style: 'center-align',
          editable: false,
        },
        // 운반업체
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002072'),
          dataField: 'freightNm',
          width: '200',
          style: 'center-align',
          editable: false,
        },
        // 운반업체설정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002073'),
          dataField: 'freightCd',
          width: '140',
          style: 'center-align',
          renderer: {
            type: "DropDownListRenderer",
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.freightVendorCdItems;
            },
            keyField: "vendorCd", // key 에 해당되는 필드명
            valueField: "vendorNm", // value 에 해당되는 필드명
          }
        },
        // 차량번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002797'),
          dataField: 'carrier',
          width: '180',
          style: 'center-align',
          editable: false,
        },
        // 처리업체
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002831'),
          dataField: 'vendorNm',
          width: '200',
          style: 'center-align',
          editable: false,
        },
        // 처리업체설정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002832'),
          dataField: 'vendorCd',
          width: '140',
          style: 'center-align',
          renderer: {
            type: "DropDownListRenderer",
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.dispoVendorCdItems;
            },
            keyField: "vendorCd", // key 에 해당되는 필드명
            valueField: "vendorNm", // value 에 해당되는 필드명
          }
        },
        // 처리방법
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002825'),
          dataField: 'ewstDispoMtdNm',
          width: '300',
          style: 'center-align',
          editable: false,
        },
        // 처리방법설정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002827'),
          dataField: 'ewstDispoMtdCd',
          width: '140',
          style: 'center-align',
          renderer: {
            type: "DropDownListRenderer",
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.ewstDispoMtdCdItems;
            },
            keyField: "ewstDispoMtdCd", // key 에 해당되는 필드명
            valueField: "ewstDispoMtdNm", // value 에 해당되는 필드명
          }
        },
        // 처리단가
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002821'),
          dataField: 'freightCost',
          width: '110',
          style: 'center-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 9,
            autoThousandSeparator: false,
          }, 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002817'),
          dataField: 'freightCostSum',
          width: '110',
          style: 'center-align',          
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 12,
            autoThousandSeparator: false,
          }, 
        },
      ];
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    excelDownTemplate() {
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = '/api/env/waste/operationLog/allbaro/template'; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.param = {};
      this.$http.request(
        (_result) => {
          var fileOrgNm =
            '올바로_양식' + this.$comm.moment().format('YYYYMMDD') + '.xlsx';
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
    btnCreateClickedCallback(_result) {
      if (this.YAuiGrid.getRowCount() === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000912', // '저장할 데이터가 없습니다.',
          type: 'error',
        });
        return;
      }
      let returnVal = false;
      let message = '';
      this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
        if (!item.ewstWasteNo) {
          message = 'M0000000913'; // '사업장 폐기물을 선택하세요';
          return false;
        } else if (!item.freightCd) {
          message = 'M0000000914'; // '운반업체설정을 선택하세요';
          return false;
        } else if (!item.vendorCd) {
          message = 'M0000000915'; // '처리업체설정을 선택하세요';
          return false;
        } else if (!item.ewstDispoMtdCd) {
          message = 'M0000000916'; // '처리방법설정을 선택하세요';
          return false;
        } else if (!item.freightCost) {
          message = 'M0000000917'; // '처리단가를 입력하세요';
          return false;
        } else if (!item.freightCostSum) {
          message = 'M0000000918'; // '처리금액을 입력하세요';
          return false;
        }
      });
      if (message) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: message,
          type: 'error',
        });
        return;
      } else {
        returnVal = true;
      }
      if (returnVal) {
        this.$validator
          .validateAll()
          .then((_result) => {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.$http.url = this.insertUrl;
                this.$http.type = 'POST';
                this.$http.param = this.YAuiGrid.getGridData();
                this.$http.request(
                  (_result) => {          
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // 안내
                      message: 'M0000000006', // 저장되었습니다.
                      type: 'success',
                    });
                    this.gridOptions.data = [];
                  },
                  (_error) => {
                    window.getApp.emit('APP_REQUEST_ERROR', _error);
                  }
                );                
              },
            });
          })
          .catch(() => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
            );
          });
      }
    },
    changeSelectedRow(row) {
      this.gridOptions.selectedRowData = row;
    },
    getVendorList() {
      this.$http.url = selectConfig.env.waste.baseInfo.disposalCompany.list.url;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            vendorCd: 0,
            vendorNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 선택하세요
          this.dispoVendorCdItems = _result.data;
          this.freightVendorCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEwstDispoMtdCdItems() {
      this.$http.url = this.$format(
        selectConfig.env.waste.operationLog.disposalResult.mtd.url
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewstDispoMtdCd: 0,
            ewstDispoMtdNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
          this.ewstDispoMtdCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEwstWasteCdItems() {
      this.$http.url = selectConfig.env.waste.baseInfo.waste.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        plantCd: this.$store.getters.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewstWasteNo: 0,
            ewstWasteNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
          this.ewstWasteCdItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    editableSelectedCheck(row, index) {
      if (!this.editable) return false;
      else if (row.status === 'delete') return false;
      else return true;
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
