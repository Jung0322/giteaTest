<!--
  목적 : 작업허가서 신청 목록
  Detail : 작업허가서 신청 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <b-col v-if="tabParam.target!=='IMM'" sm="12" class="px-0">
          <!-- 개선요청사항 목록 -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000000270')"
            :items="gridOptions.data"
            :editable="!disabled2 && editable"
            :showRowNumColumn="disabled2"
            :showRowCheckColumn="!disabled2 && editable"
            :useExcelExport="false"
            @cellClick="cellClickHandler"
            @deleteRow="deleteRow"
          />
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';

export default {
  /* attributes: name, components, props, data */
  name: 'impr-act-tab',
  props: {
    disabled2: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    tabParam: {
      type: Object,
      default: {
        imprClassCd: 'ICL30',
        refTableId: 0,
        editable: true,
        detailCheck: false,
        status: '',
        message: '',
        auditRsltNo: 0,
        tabClickCnt: 0,
      },
    },
    tabIndex: '',
    safPsmAuditRslt: {
      type: Object,
      default: function () {
        return {
          auditRsltNo: 0,
          safPsmAuditRsltImprs: [], // 감사결과_개선사항
          deleteSafPsmAuditRsltImprs: [], // 삭제할 감사결과_개선사항
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
        width: '70%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '320',
      },
      searchUrl: '',
      saveUrl: '',
      deleteUrl: '',
      editable: false,
      searchParam: {
        imprClassCd: 'ICL30',
        auditRsltNo: 0,
      },
    };
  },
  watch: {
    'tabParam.tabClickCnt': {
      handler: function (val, oldVal) {
        this.getList();
      },
      deep: true,
    },
    // 'safPsmAuditRslt.auditRsltNo': {
    //   handler: function (val, oldVal) {
    //     this.getList();
    //   },
    //   deep: true,
    // },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        let deleteData = this.$_.clone(
          this.safPsmAuditRslt.safPsmAuditRsltImprs
        );
        this.$_.forEach(this.safPsmAuditRslt.safPsmAuditRsltImprs, (item) => {
          if (item.safImprActNo) {
            let index = this.$_.findIndex(this.gridOptions.data, {
              safImprActNo: item.safImprActNo,
            });
            if (index === -1) {
              deleteData = this.$_.reject(deleteData, {
                safImprActNo: item.safImprActNo,
              });
            }
          }
        });
        this.safPsmAuditRslt.safPsmAuditRsltImprs = deleteData;
      },
      deep: true,
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getList();
  },
  beforeDestroy() { },
  activated() {
    this.resizeGrid();
  },
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = selectConfig.saf.auditImpr.list.url;
      this.editable = this.$route.meta.editable;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002673'), 
          dataField: 'actDeptNm', 
          width: '120', 
        }, /* 조치부서 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000233'), 
          dataField: 'auditStdNm', 
          width: '200', 
        }, /* 감사범위 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003783'), 
          dataField: 'auditItemNm', 
          width: '200', 
          style: 'left-align', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {}, 
          },
        },  /* 감사항목 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000269'), 
          dataField: 'imprRqstContents', 
          width: '200', 
        }, /* 개선요청사항 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002671'), 
          dataField: 'actResultContents', 
          width: '200', 
        }, /* 조치내용 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002042'), 
          dataField: 'actSchYmd', 
          width: '100', 
        }, /* 완료요청일자 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002044'), 
          dataField: 'actConfirmYmd', 
          width: '100', 
        }, /* 완료일자 */ 
      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), 
          color: 'red', 
          btnClicked: 'deleteRow',
          visible: !this.disabled2 && this.editable,
        },  // 삭제
      ]; 
    },
    getList() {
      this.gridOptions.data = [];

      this.searchParam.imprClassCd = this.tabParam.imprClassCd;
      this.searchParam.auditRsltNo = this.safPsmAuditRslt.auditRsltNo;

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
      // }
    },
    /** button 관련 이벤트 **/
    deleteRow() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000911', /* 삭제 할 데이터를 선택하세요. */
          type: 'warning',
        });
      } else {
        if (!this.safPsmAuditRslt.deleteSafPsmAuditRsltImprs) {
          this.safPsmAuditRslt.deleteSafPsmAuditRsltImprs = [];
        }

        let gridData = this.YAuiGrid.getGridData();
        this.$_.forEach(selectedRows, (item) => {
          this.safPsmAuditRslt.deleteSafPsmAuditRsltImprs.push(item);
          gridData = this.$_.reject(gridData, item);
          // this.gridOptions.data.splice(
          //   this.$_.findIndex(this.gridOptions.data, {
          //     safImprActNo: item.safImprActNo,
          //   }),
          //   1
          // );
        });

        this.gridOptions.data = gridData;
      }
    },
    cellClickHandler(event) {
      if (event.dataField === 'auditItemNm') {
        this.openDialogPage('DETAIL', event.item);
      }
    },
    openDialogPage(flag, data) {
      if (data !== undefined) {
        if (data.imprStepCd === 'IMST1' && data.actClassCd === 'ACL01') {
          flag = 'NOW';
        } else if (data.imprStepCd === 'IMST1' && data.actClassCd === 'ACL02') {
          flag = 'REQUEST';
        }
        if (!this.editable) flag = 'DETAIL';
        this.popupOptions.param = {
          safImprActNo: data.safImprActNo,
          imprClassCd: this.tabParam.imprClassCd,
          refTableId: this.tabParam.refTableId,
          flag: flag,
          editable: this.tabParam.editable2,
        };
      } else {
        if (!this.editable) flag = 'DETAIL';

        this.popupOptions.param = {
          safImprActNo: 0,
          imprClassCd: this.tabParam.imprClassCd,
          refTableId: this.tabParam.refTableId,
          flag: flag,
          editable: this.tabParam.editable2,
        };
      }
      if (this.tabParam.detailCheck) {
        flag = 'DETAIL';
        this.popupOptions.param.flag = 'DETAIL';
      }
      if (flag === 'DETAIL') {
        this.popupOptions.title = 'L0000003458'; /* 개선요청상세 */
        this.popupOptions.target = () =>
          import(`${'@/pages/impr/improveDetail.vue'}`);

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else {
        this.popupOptions.title = 'L0000000268'; /* 개선요청등록 */
        this.popupOptions.target = () =>
          import(`${'@/pages/impr/actionRequest.vue'}`);

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    closePopup() {
      this.getList();

      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** end button 관련 이벤트 **/
    resizeGrid() {
      this.YAuiGrid.resize(null, this.gridOptions.height);
    },
  },
};
</script>