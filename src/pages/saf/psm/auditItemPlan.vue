<!--
  목적 : psm 감사항목 관리
  Detail : psm 감사항목 검색 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <!-- 감사기준 목록 -->
        <y-auigrid
          ref="yPlanAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :label="this.$comm.getLangSpecInfoLabel('L0000000230')"
          :showRowCheckColumn="editable && !disabled"
          :useExcelExport="false"
          @selectedRow="selectedRow"
          @openPopup="openPopup"
          @itemDelete="itemDelete"
          @btnClickedError="btnClickedErrorCallback"
        />
      </b-col>
      <b-col sm="12">
        <!-- 감사항목 목록 -->
        <y-auigrid
          ref="yItemAuiGrid"
          :height="gridOptions.itemHeight"
          :headers="gridOptions.itemHeader"
          :items="gridOptions.itemData"
          :label="this.$comm.getLangSpecInfoLabel('L0000000241')"
          :useExcelExport="false"
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
  name: 'audit-item',
  props: {
    disabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    safPsmAuditRslt: {
      type: Object,
      default: function () {
        return {
          auditRsltNo: 0,
          plantCd: '',
          safPsmAuditRsltStds: [], // 감사결과_기준
          deleteSafPsmAuditRsltStds: [], // 삭제할 감사결과_기준
          files: [],
        };
      },
    },
  },
  data() {
    return {
      YPlanAuiGrid: null,
      YItemAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '320',
        itemHeader: [],
        itemData: [],
        itemHeight: '320',
      },

      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      searchUrl: '',
      searchItemInfoUrl: '',
      index: -1,
      searchParam: {
        plantCd: '',
        useYn: 'Y',
      },

      saveData: {
        files: [],
        tempId: [],
      },
    };
  },
  watch: {
    'safPsmAuditRslt.auditRsltNo': {
      handler: function (val, oldVal) {
        this.getList(); // 감사법위
      },
      deep: true,
    },
    'safPsmAuditRslt.plantCd': {
      handler: function (val, oldVal) {
        this.gridOptions.data = [];
        this.getList();
      },
      deep: true,
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        let deleteData = this.$_.clone(
          this.safPsmAuditRslt.safPsmAuditRsltStds
        );
        this.$_.forEach(this.safPsmAuditRslt.safPsmAuditRsltStds, (item) => {
          if (item.auditStdNo) {
            let index = this.$_.findIndex(this.gridOptions.data, {
              auditStdNo: item.auditStdNo,
            });
            if (index === -1) {
              deleteData = this.$_.reject(deleteData, {
                auditStdNo: item.auditStdNo,
              });
            }
          } else {
            let index = this.$_.findIndex(this.gridOptions.data, {
              tempId: item.tempId,
            });
            if (index === -1) {
              deleteData = this.$_.reject(deleteData, {
                tempId: item.tempId,
              });
            }
          }
        });
        this.safPsmAuditRslt.safPsmAuditRsltStds = deleteData;

        this.$_.forEach(this.gridOptions.data, (item) => {
          if (item.auditStdNo) {
            let index = this.$_.findIndex(
              this.safPsmAuditRslt.safPsmAuditRsltStds,
              {
                auditStdNo: item.auditStdNo,
              }
            );
            if (index > -1) {
              this.safPsmAuditRslt.safPsmAuditRsltStds[index] = item;
            } else {
              this.safPsmAuditRslt.safPsmAuditRsltStds.push(item);
            }
          } else {
            let index = this.$_.findIndex(
              this.safPsmAuditRslt.safPsmAuditRsltStds,
              {
                tempId: item.tempId,
              }
            );
            if (index > -1) {
              this.safPsmAuditRslt.safPsmAuditRsltStds[index] = item;
            } else {
              this.safPsmAuditRslt.safPsmAuditRsltStds.push(item);
            }
          }
        });

        let files = [];
        // let data = this.$refs.planDataTable.getSaveFiles();
        const data = this.getSaveFiles();
        this.safPsmAuditRslt.files = this.$_.concat(files, data.files);
      },
      deep: true,
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YPlanAuiGrid = this.$refs.yPlanAuiGrid;
    this.YItemAuiGrid = this.$refs.yItemAuiGrid;
    this.resizeGrid();
    this.YPlanAuiGrid.setNewBtnArr(this.gridOptions.btns);
    this.getList();
  },
  beforeDestroy() {},
  activated() {
    this.resizeGrid();
  },
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.auditItem.list.url;
      this.searchItemInfoUrl = selectConfig.saf.auditItemInfo.list.url;
      this.editable = this.$route.meta.editable;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000233'),
          dataField: 'auditStdNm',
          width: '20%',
        } /* 감사범위 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000229'),
          dataField: 'auditStdDesc',
          width: '60%',
          style: 'left-align',
        } /* 감사기준 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002842'),
          dataField: 'files',
          width: '20%%',
          editable: false,
          renderer: {
            type: 'ButtonRenderer',
            labelText: '상세 보기',
            onClick: (event) => {
              this.openMultiFileUpload(event);
            },
          },
        } /* 첨부자료 */,
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'openPopup',
          btnClickedError: 'btnClickedError',
          visible: this.editable && !this.disabled,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'itemDelete',
          btnClickedError: 'btnClickedError',
          visible: this.editable && !this.disabled,
        }, // 삭제
      ];

      this.gridOptions.itemHeader = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000233'),
          dataField: 'auditStdNm',
          width: '20%%',
        } /* 감사범위 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003783'),
          dataField: 'auditItemNm',
          width: '40%',
          style: 'left-align',
        } /* 감사항목 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '40%',
          style: 'left-align',
        } /* 비고 */,
      ];
    },
    openMultiFileUpload(event) {
      this.popupOptions.target = () =>
        import('@/pages/common/attachFile/gridAttachFileUpload.vue');
      this.popupOptions.title = 'L0000002843';
      this.popupOptions.visible = true;
      this.popupOptions.top = '10%';
      this.popupOptions.width = '30%';
      this.popupOptions.param = {
        editable: false,
        disabled: true,
        rowFiles: event.item.files,
      };
      this.popupOptions.closeCallback = this.closeMultiFilePopup;
    },
    closeMultiFilePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    // 검진 계획 그리드
    getList() {
      if (this.safPsmAuditRslt.auditRsltNo > 0) {
        this.gridOptions.data = [];
        if (
          this.safPsmAuditRslt.safPsmAuditRsltStds &&
          this.safPsmAuditRslt.safPsmAuditRsltStds.length > 0
        ) {
          this.$_.forEach(this.safPsmAuditRslt.safPsmAuditRsltStds, (item) => {
            var date = new Date();

            this.gridOptions.data.push({
              auditRsltNo: item.auditRsltNo,
              auditRsltDeptStdNo: item.auditRsltDeptStdNo,
              auditStdDesc: item.auditStdDesc,
              auditStdNm: item.auditStdNm,
              auditStdNo: item.auditStdNo,
              auditorUserId: item.auditorUserId,
              createDt: item.createDt,
              createUserId: item.createUserId,
              files: item.files ? item.files : [],
              reltFiles: item.reltFiles ? item.reltFiles : [],
              safPsmAuditRsltItems: item.safPsmAuditRsltItems,
              tempId: item.tempId
                ? item.tempId
                : item.auditStdNo + String(date.getTime()),
              updateDt: item.updateDt,
              updateUserId: item.updateUserId,
            });
          });
        }
      } else {
        this.searchParam.plantCd = this.safPsmAuditRslt.plantCd;
        this.searchParam.useYn = 'Y';
        this.$http.url = this.searchUrl;
        this.$http.type = 'GET';
        this.$http.param = this.searchParam;
        this.$http.request(
          (_result) => {
            this.$_.forEach(_result.data, (item) => {
              var date = new Date();
              this.gridOptions.data.push({
                auditRsltNo: item.auditRsltNo,
                auditRsltDeptStdNo: item.auditRsltDeptStdNo,
                auditStdDesc: item.auditStdDesc,
                auditStdNm: item.auditStdNm,
                auditStdNo: item.auditStdNo,
                auditorUserId: item.auditorUserId,
                createDt: item.createDt,
                createUserId: item.createUserId,
                files: item.files ? item.files : [],
                reltFiles: item.reltFiles ? item.reltFiles : [],
                safPsmAuditRsltItems: item.safPsmAuditRsltItems,
                tempId: item.tempId
                  ? item.tempId
                  : item.auditStdNo + String(date.getTime()),
                updateDt: item.updateDt,
                updateUserId: item.updateUserId,
              });
            });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    /**
     * 수정 팝업 호출
     */
    // 그리드 row click 이벤트
    selectedRow(data) {
      if (data.dataField === 'files') return;

      this.$http.url = this.searchItemInfoUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        auditStdNo: data.auditStdNo,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.itemData = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 등록 팝업  호출
     */
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'@/pages/saf/psm/auditItem.vue'}`);
      this.popupOptions.title = 'L0000000148'; /* PSM 감사항목 */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        isPopup: true,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data !== 'CLOSE') {
        this.$_.forEach(data, (item) => {
          if (
            this.$_.findIndex(this.gridOptions.data, {
              auditStdNo: item.auditStdNo,
            }) === -1
          ) {
            let date = new Date();
            this.gridOptions.data.splice(0, 0, {
              auditItems: item.auditItems,
              auditStdDesc: item.auditStdDesc,
              auditStdNm: item.auditStdNm,
              auditStdNo: item.auditStdNo,
              chargeDeptCd: item.chargeDeptCd,
              chargeDeptNm: item.chargeDeptNm,
              convFactor: item.convFactor,
              createDt: item.createDt,
              createUserId: item.createUserId,
              deleteAuditItems: item.deleteAuditItems,
              plantCd: item.plantCd,
              plantNm: item.plantNm,
              remark: item.remark,
              updateDt: item.updateDt,
              updateUserId: item.updateUserId,
              useYn: item.useYn,
              tempId: item.auditStdNo + String(date.getTime()),
              files: item.files ? item.files : [],
            });
          }
        });
      }
    },
    itemDelete() {
      const selectedRows = this.YPlanAuiGrid.getCheckedRowItemsAll();
      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
      } else {
        if (!this.safPsmAuditRslt.deleteSafPsmAuditRsltStds) {
          this.safPsmAuditRslt.deleteSafPsmAuditRsltStds = [];
        }
        this.$_.forEach(selectedRows, (item) => {
          if (item.tempId) {
            this.gridOptions.data.splice(
              this.$_.findIndex(this.gridOptions.data, { tempId: item.tempId }),
              1
            );
          } else {
            this.safPsmAuditRslt.deleteSafPsmAuditRsltStds.push(item);
            this.gridOptions.data.splice(
              this.$_.findIndex(this.gridOptions.data, {
                auditStdNo: item.auditStdNo,
              }),
              1
            );
          }
        });
      }
    },
    /** Button Event **/
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    linkClicked(scope) {
      window.alert('L0000003784'); /* 개발중 */
      // TODO : 페이지 이동은 준비중
    },
    resizeGrid() {
      this.YPlanAuiGrid.resize(null, this.gridOptions.height);
      this.YItemAuiGrid.resize(null, this.gridOptions.itemHeight);
    },
    /** /Button Event **/
    getSaveFiles() {
      const returnData = {
        tempId: [],
        files: [],
      };
      let ready = this.$_.filter(this.$_.clone(this.saveData.files), {
        status: 'ready',
      });
      let tempIds = [];
      let files = [];
      if (ready && ready.length > 0) {
        this.$_.forEach(ready, (item) => {
          tempIds = this.$_.concat(tempIds, this.$_.map(item.raw, 'tempId'));
          files = this.$_.concat(files, item.raw);
        });
      }
      tempIds = this.$_.uniq(tempIds);

      returnData.tempId = tempIds;
      returnData.files = files;
      return returnData;
    },
  },
};
</script>
<style>
.auditItemPlanTag .button-new-tag {
  padding-top: 0 !important;
}
</style>
