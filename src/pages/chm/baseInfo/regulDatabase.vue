<!--
  목적 : 규제 DB관리
  Detail : 
    - 규제DB파일을 업로드 하여, 새 규제물질을 등록하거나, 변경사항을 처리할 수 있다.
    1. 규제DB관리자는 보증기간동안 발생한 변경사항에 대해서, 쉬즈케미칼로부터 규제DB파일을 받는다. (수동)
    2. 규제DB관리자는 규제DB파일을 업로드 한다.
      2-1. 시스템은 규제DB파일을 업로드 하고, 파일의 내용을 규제DB임시 테이블이 넣는다.
      2-2. 테이블에 넣을때 각 항목별로 유효성 검사를 실시하여 맞지 않는 경우, 테이블에 해당 오류에 대한 메시지를 기록해 준다.
    3. 규제DB관리자는 화학물질 > 기준정보 > 규제DB업로드 화면에서 업로드한 규제DB의 정보를 확인한다.
      3-1. 상태가 적용대기인 경우 유효성 검사성공으로, "적용"버튼이 활성화되며, 규제DB적용처리를 한다.
      3-2. 상태가 적용불가인 경우 유효성 검사실패로, 실제 규제DB에 적용할 수 없는 경우로 기록해둔 오류 메시지를 조회하여 규제DB관리자가 규제DB파일재검토를 할 수 있도록 한다.
    4. 적용이 완료된 후 제대로 적용이 되었는지 화학물질 관리에서 확인한다.
  </template>
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="12" class="mb-3">
          <el-upload
            v-if="editable"
            class="upload-demo"
            ref="upload"
            name="files"
            :headers="uploadHeader"
            :action="uploadUrl"
            :auto-upload="false"
            :on-success="onSuccess"
            :drag="true"
            :on-error="onError"
            v-loading="loading"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              <!-- 파일을 끌어 놓거나 -->
              <!-- 클릭하여 업로드 -->
              {{ $comm.getLangSpecInfoLabel('L0000003031') }}
              <em>{{ $comm.getLangSpecInfoLabel('L0000003625') }} </em>
            </div>

            <div class="el-upload__tip" slot="tip">
              <!-- 업로드 -->
              <el-button
                v-if="editable"
                style="margin-left: 10px"
                size="small"
                type="success"
                @click="submitUpload"
                >{{ $comm.getLangSpecInfoLabel('L0000001934') }}</el-button
              >
            </div>
          </el-upload>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row class="pt-3" id="uploadSuccessArea">
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mb-1">
          - 양식다운로드 >
          <y-btn
            title="L0000001925"
            @btnClicked="btnDownloadFormClicked"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
           검색 
          <y-btn
            title="L0000000327"
            color="green"
            @btnClicked="btnSearchClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
        </div>
        - 규제DB 업로드 이력목록 
        <y-data-table
          ref="dataTable"
          label="L0000000721"
          :height="gridOptions.height"
          :headers="gridOptions.header"
          :items="gridOptions.data"
          :use-paging="true"
          :check-item-data="regulUploadItems"
          check-key="regulUploadNo"
          v-model="selectedValue"
          @tableLinkClicked="tableLinkClicked"
        >
          <el-table-column slot="tag" width="220">
            <template slot-scope="scope">
               규제영향자재 
              <el-button
                v-if="scope.row.uploadStatus !== 'CRD20'"
                size="mini"
                type="primary"
                @click="onAffectedChemProd(scope.$index, scope.row)"
                >{{ $comm.getLangSpecInfoLabel('L0000000727') }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column slot="tag" width="250">
            <template slot-scope="scope">
               적용 
              <el-button
                v-if="scope.row.uploadStatus === 'CRD30' && editable"
                size="mini"
                type="success"
                @click="onApply(scope.$index, scope.row)"
                >{{ $comm.getLangSpecInfoLabel('L0000002482') }}</el-button
              >
              삭제 
              <el-button
                v-if="scope.row.uploadStatus !== 'CRD40' && editable"
                size="mini"
                type="danger"
                @click="onDelete(scope.$index, scope.row)"
                >{{ $comm.getLangSpecInfoLabel('L0000001495') }}</el-button
              >
            </template>
          </el-table-column>
        </y-data-table>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000721')"
          :useExcelExport="false"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @btnDownloadFormClicked="btnDownloadFormClicked"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import backendConfig from '@/js/backendConfig.js';
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import { getAccessToken } from '@/utils/auth';
export default {
  name: 'y-reguldatabase',
  props: {},
  data() {
    return {
      uploadParam: {
        chmRegulDbCd: null,
        uploadStatus: null,
      },

      attachFileGrp: {
        label: 'L0000003872', // 규제DB업로드
        taskClassNm: 'CHM_REGUL_DB_HIST',
        taskKey: '0',
        createUserId: '',
        showUploadBtn: true,
      },

      gridOptions: {
        name: 'regulDatabase',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      chmRegulDbCd: null,
      uploadHeader: {},

      // 규제DB업로드 이력목록
      regulUploadItems: [],
      selectedValue: [],

      // 첨부파일
      attach: null,
      submitCheck: false,
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],

      editable: false,
      searchUrl: '',
      detailUrl: '',
      uploadUrl: '',
      applyUrl: '',
      deleteUrl: '',
      isInsert: false,
      isEdit: false,

      uploadFiles: [],
      isUpload: false,
      loading: false,
      isSave: false,

      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
    };
  },
  watch: {
    isSave: function (newValue, oldValue) {
      if (newValue) this.executeApply();
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
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.chm.chemicalreguldbhist.list.url;
      this.detailUrl = selectConfig.chm.chemicalreguldbhist.get.url;
      this.uploadUrl = backendConfig.getUrl(
        transactionConfig.chm.chemicalreguldbhist.upload.url
      );
      this.applyUrl = transactionConfig.chm.chemicalreguldbhist.apply.url;
      this.deleteUrl = transactionConfig.chm.chemicalreguldbhist.delete.url;

      this.attachFileGrp.label = this.$comm.getLangSpecInfoLabel('L0000003872');
      this.uploadHeader = {
        'X-Authorization': getAccessToken(),
      };

      let myThis = this;
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001944'),
          dataField: 'uploadDt',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001939'),
          dataField: 'uploadUserNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002489'),
          dataField: 'applyDt',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001538'),
          dataField: 'uploadStatusNm',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: '',
          dataField: '',
          width: '10%',
          editable: false,
          renderer: {
            type: 'ButtonRenderer',
            labelText: this.$comm.getLangSpecInfoLabel('L0000000727'),
            onClick: function (rowIndex, columnIndex, value, item) {
              myThis.openView(rowIndex);
            },
            visibleFunction: function (
              rowIndex,
              columnIndex,
              value,
              item,
              dataField
            ) {
              if (item.uploadStatus !== 'CRD20') {
                return true;
              } else {
                return false;
              }
            },
          },
        },
        {
          headerText: '',
          dataField: '',
          width: '10%',
          editable: false,
          renderer: {
            type: 'ButtonRenderer',
            labelText: this.$comm.getLangSpecInfoLabel('L0000002482'),
            onClick: function (rowIndex, columnIndex, value, item) {
              myThis.onApplyNew(rowIndex);
            },
            visibleFunction: function (
              rowIndex,
              columnIndex,
              value,
              item,
              dataField
            ) {
              if (item.uploadStatus === 'CRD30') {
                return true;
              } else {
                return false;
              }
            },
          },
        },
        {
          headerText: '',
          dataField: '',
          width: '10%',
          editable: false,
          renderer: {
            type: 'ButtonRenderer',
            labelText: this.$comm.getLangSpecInfoLabel('L0000001495'),
            onClick: function (rowIndex, columnIndex, value, item) {
              myThis.onDeleteNew(rowIndex);
            },
            visibleFunction: function (
              rowIndex,
              columnIndex,
              value,
              item,
              dataField
            ) {
              if (item.uploadStatus !== 'CRD40') {
                return true;
              } else {
                return false;
              }
            },
          },
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001925'),
          btnClicked: 'btnDownloadFormClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      this.getDataList();
    },
    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // 검색 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    resizeGrid() {
      let _height = window.innerHeight - 500;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    // 그리드 row click 이벤트
    cellClickHandler(event) {
      if (event.dataField !== 'uploadStatusNm') return;
      this.popupOptions.param = {
        chmRegulDbCd: event.item.chmRegulDbCd,
        uploadStatus: event.item.uploadStatus,
      };
      this.popupOptions.target = () =>
        import(`${'./regulDatabaseHistDetail.vue'}`);
      this.popupOptions.title = 'L0000003873'; // 업로드 규제DB 상세
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '20px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    // 업로드된 파일의 적용처리
    onApplyNew(item) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000153',
        // 규제DB 데이터를 화학물질 정보에 반영 하시겠습니까?
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.uploadParam.chmRegulDbCd = item.item.chmRegulDbCd;
          this.isSave = true;
        },
        // 취소 callback 함수
        cancelCallback: () => {
          return;
        },
      });
    },
    onApply(index, row) {
      if (row === null) return;
      // 적용실행처리
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000153',
        // 규제DB 데이터를 화학물질 정보에 반영 하시겠습니까?
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.uploadParam.chmRegulDbCd = row.chmRegulDbCd;
          this.isSave = true;
        },
        // 취소 callback 함수
        cancelCallback: () => {
          return;
        },
      });
    },
    executeApply() {
      this.$http.isLoading = true;
      this.$http.url = this.$format(
        this.applyUrl,
        this.uploadParam.chmRegulDbCd
      );
      this.$http.type = 'POST';
      this.$http.request(
        (_result) => {
          this.isSave = false;
          this.getDataList();
        },
        (_error) => {
          this.isSave = false;
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 적용완료처리된 정보의 확인처리
    onConfirm(index, row) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000154',
        // 기능준비중입니다.
        type: 'warning',
      });
      return;
    },
    // 업로드 규제DB 이력조회
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    // 업로드
    submitUpload() {
      // 파일이 있는지 여부 확인
      if (this.$refs.upload.uploadFiles.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000001934', // 업로드
          message: 'M0000000083',
          // 업로드할 파일이 없습니다. 파일을 선택하세요
          type: 'warning',
        });
        return;
      }
      var uploadFileName = this.$refs.upload.uploadFiles[0].name.toLowerCase();
      if (uploadFileName.indexOf('xlsx') === -1) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003874',
          // 파일형식 오류
          message: 'M0000000900',
          // 업로드 파일은 XLSX 형식이어야 합니다.
          type: 'warning',
        });
        return;
      }
      this.loading = true;
      this.$refs.upload.submit();
    },
    onSuccess(response, file, fileList) {
      this.loading = false;
      this.$refs.upload.clearFiles();
      this.getDataList();
      var msg = this.getConfirmMsg(response);
      window.getApp.$emit('ALERT', {
        title: 'L0000003875',
        // 업로드 결과
        message: msg,
        type: 'warning',
      });
    },
    onError(err, file, fileList) {
      this.loading = false;
      console.log(JSON.stringify(err));
      // 인증오류처리
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000086'
        // 업로드에 실패했습니다. 재시도 시에도 지속적으로 문제가 발생한다면 관리자에게 문의해 주세요.
      );
      return;
    },
    getConfirmMsg(response) {
      var returnMsg = '';
      if (response.totCount === response.noCount) {
        returnMsg = 'M0000000084';
        // 업로드한 파일에 업로드할 데이터가 없습니다. 업로드할 데이터가 있는지 다시한번 확인해 주세요.
      } else {
        returnMsg = this.$comm.getLangSpecInfoMessage('M0000000155', {
          s1: response.totCount,
          s2: response.addCount,
          s3: response.editCount,
          s4: response.deleteCount,
        });
      }
      return returnMsg;
    },
    onDeleteNew(item) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000156',
        // 선택된 적용전 상태의 규제DB정보를 삭제하시겠습니까? (적용전 상태는 화학물질에 반영되지 않은 임시상태입니다.)
        type: 'info',
        confirmCallback: () => {
          this.uploadParam.chmRegulDbCd = item.item.chmRegulDbCd;
          this.executeDelete();
        },
        // 취소 callback 함수
        cancelCallback: () => {
          return;
        },
      });
    },
    onDelete(index, row) {
      // 적용완료전단계에서 삭제처리
      if (row === null) return;
      // 적용실행처리
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000156',
        // 선택된 적용전 상태의 규제DB정보를 삭제하시겠습니까? (적용전 상태는 화학물질에 반영되지 않은 임시상태입니다.)
        type: 'info',
        confirmCallback: () => {
          this.uploadParam.chmRegulDbCd = row.chmRegulDbCd;
          this.executeDelete();
        },
        // 취소 callback 함수
        cancelCallback: () => {
          return;
        },
      });
    },
    executeDelete() {
      this.$http.isLoading = true;
      this.$http.url = this.$format(
        this.deleteUrl,
        this.uploadParam.chmRegulDbCd
      );
      this.$http.type = 'DELETE';
      this.$http.request(
        (_result) => {
          if (_result.data === 'apply') {
            window.getApp.$emit('ALERT', {
              title: 'L0000003874',
              // 파일형식 오류
              message: 'M0000000157',
              // 이미 적용완료된 규제DB정보는 삭제할 수 없습니다.
              type: 'warning',
            });
            return;
          }
          this.getDataList();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openView(item) {
      console.log(item);
      this.uploadParam.chmRegulDbCd = item.item.chmRegulDbCd;
      this.uploadParam.uploadStatus = item.item.uploadStatus;
      this.popupOptions.param = {
        chmRegulDbCd: item.item.chmRegulDbCd,
        uploadStatus: item.item.uploadStatus,
      };
      this.popupOptions.target = () =>
        import(`${'./regulDatabaseHistValid.vue'}`);
      this.popupOptions.title = 'L0000003876';
      // 영향 화학물질 및 화학자재
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    onAffectedChemProd(index, row) {
      if (row === null) return;
      this.uploadParam.chmRegulDbCd = row.chmRegulDbCd;
      this.uploadParam.uploadStatus = row.uploadStatus;
      this.popupOptions.param = {
        chmRegulDbCd: row.chmRegulDbCd,
        uploadStatus: row.uploadStatus,
      };
      this.popupOptions.target = () =>
        import(`${'./regulDatabaseHistValid.vue'}`);
      this.popupOptions.title = 'L0000003876';
      // 영향 화학물질 및 화학자재
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    btnDownloadFormClicked() {
      let thisVue = this;
      let accept = this.$comm.getAccept('xlsx');
      let _comm = this.$comm;
      this.$http.url = selectConfig.chm.chemicalreguldbhist.excelDown.url; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, '규제DB업로드양식.xlsx');
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = '규제DB업로드양식.xlsx';
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
