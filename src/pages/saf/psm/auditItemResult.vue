<!--
  목적 : psm 감사결과 관리
  Detail : psm 감사결과 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <el-tabs type="border-card" v-model="tabIndex" @tab-click="tabClicked">
      <el-tab-pane
        v-for="(item, i) in tabItems"
        :key="i"
        stretch
        class="default-tab-pane"
      >
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ $comm.getLangSpecInfoLabel(item.targetDeptNm) }}
        </span>
        <b-row>
          <b-col sm="12">
            <!-- 감사기준 목록 -->
            <y-auigrid
              :ref="'resultDataTable' + i"
              :height="rsltGridOptions.height"
              :headers="rsltGridOptions.header"
              :items="rsltGridOptions.data"
              :label="$comm.getLangSpecInfoLabel('L0000000230')"
              :editable="!disabled2 && editable"
              :showItemCount="false"
              @cellClick="cellClickHandler"
              @cellEditEnd="cellEditEndHandler"
            />
          </b-col>
          <b-col sm="12">
            <!-- 감사항목 목록 -->
            <y-auigrid
              :ref="'dataTableItem' + i"
              :height="rsltGridOptions.itemHeight"
              :headers="rsltGridOptions.itemHeader"
              :items="rsltGridOptions.itemData"
              :label="$comm.getLangSpecInfoLabel('L0000000241')"
              :editable="!disabled2 && editable"
              :wordWrap="true"
              @cellClick="cellClickHandler2"
              @cellEditEnd="cellEditEndHandler2"
              @cellDoubleClick="cellDoubleClick"
              :rowHeight="70"
            />
          </b-col>
        </b-row>
      </el-tab-pane>
    </el-tabs>
    <y-dialog :param="popupOptions"></y-dialog>

    <!-- 사용자 정의 렌더러 - html textarea 태그 -->
    <div id="textAreaWrap">
      <textarea
        id="myTextArea"
        class="aui-grid-custom-renderer-ext"
        style="width: 100%; height: 90px"
      ></textarea>
      <ul class="nav_u" style="margin-top: 4px">
        <li>
          <button class="editor_btn" id="confirmBtn" v-on:click="btnConfirm">
            확인
          </button>
        </li>
        <li>
          <button class="editor_btn" id="cancelBtn" v-on:click="btnCancel">
            취소
          </button>
        </li>
      </ul>
    </div>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';

export default {
  name: 'audit-item-result',
  props: {
    disabled2: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    tabParam: {
      type: Object,
      default: function () {
        return {
          imprClassCd: '',
          refTableId: 0,
          editable: true,
        };
      },
    },
    safPsmAuditRslt: {
      type: Object,
      default: function () {
        return {
          auditRsltNo: 0,
          safPsmAuditRsltDepts: [], // 감사결과_대상부서
          files: [],
        };
      },
    },
    research: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  data() {
    return {
      rsltGridOptions: {
        header: [],
        data: [],
        height: '300',
        itemHeader: [],
        itemData: [],
        itemHeight: '300',
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
      evalItems: [],
      editable: false,
      searchUrl: '',
      searchItemInfoUrl: '',
      tabIndex: 0,
      tabItems: [],

      selectedRsltGridIndex: -1,
      saveData: {
        safPsmAuditRslt: '',
        taskClassNm: 'AUDIT_RSLT',
        files: [],
      },
      YAuiGrid: null,
    };
  },
  watch: {
    research: {
      handler: function (val, oldVal) {
        this.selectedRsltGridIndex = -1;
        this.rsltGridOptions.itemData = [];
        this.getEduDept();
      },
      deep: true,
    },
    'rsltGridOptions.data': {
      handler: function (val, oldVal) {
        this.$_.forEach(this.rsltGridOptions.data, (item) => {
          if (item.auditStdNo) {
            let index = this.$_.findIndex(
              this.safPsmAuditRslt.safPsmAuditRsltDepts[this.tabIndex]
                .safPsmAuditRsltDeptStds,
              {
                auditStdNo: item.auditStdNo,
              }
            );
            if (index > -1) {
              this.safPsmAuditRslt.safPsmAuditRsltDepts[
                this.tabIndex
              ].safPsmAuditRsltDeptStds[index].auditorDesc = item.auditorDesc;
              this.safPsmAuditRslt.safPsmAuditRsltDepts[
                this.tabIndex
              ].safPsmAuditRsltDeptStds[index].safPsmAuditRsltItems =
                item.safPsmAuditRsltItems;
              this.safPsmAuditRslt.safPsmAuditRsltDepts[
                this.tabIndex
              ].safPsmAuditRsltDeptStds[index].files = item.files;
              this.safPsmAuditRslt.safPsmAuditRsltDepts[
                this.tabIndex
              ].safPsmAuditRsltDeptStds[index].tempId = item.tempId;
            }
          }
        });
      },
      deep: true,
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    for (let i = 0; i < this.tabItems.length; i++) {
      this.YAuiGrid = this.$refs['dataTableItem' + i][0];
    }
  },
  activated() {
    this.resizeGrid();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.auditItem.list.url;
      this.searchItemInfoUrl = selectConfig.saf.auditItemInfo.list.url;
      this.editable = this.$route.meta.editable;

      this.evalItems = [
        {
          code: '',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
        } /* '선택하세요' */,
        { code: '10', codeNm: 'A' },
        { code: '8', codeNm: 'B' },
        { code: '6', codeNm: 'C' },
        { code: '4', codeNm: 'D' },
        { code: '2', codeNm: 'E' },
      ];

      // 그리드 헤더 설정
      this.rsltGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000233'),
          dataField: 'auditStdNm',
          width: '30%',
          style: 'left-align',
          editable: false,
        } /* 감사범위 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000229'),
          dataField: 'auditStdDesc',
          width: '35%',
          style: 'left-align',
          editable: false,
        } /* 감사기준 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000235'),
          dataField: 'auditorDesc',
          width: '35%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 200,
          },
        } /* 감사원 소견 */,
      ];
      this.rsltGridOptions.itemHeader = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000233'),
          dataField: 'auditStdNm',
          width: '150',
          editable: false,
        } /* 감사범위 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003783'),
          dataField: 'auditItemNm',
          width: '350',
          style: 'left-align',
          editable: false,
        } /* 감사항목 */,
        /* { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003047'), 
          dataField: 'resultRemark', 
          width: '350', 
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer', 
            maxlength: 200,
          }, 
        }, 평가결과 */
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003047'),
          dataField: 'resultRemark',
          width: '350',
          style: 'left-align',
          renderer: {
            type: 'TemplateRenderer',
            maxlength: 200,
          },
        } /* 평가결과 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003044'),
          dataField: 'resultValue',
          width: '120',
          renderer: {
            type: 'DropDownListRenderer',
            list: this.evalItems,
            keyField: 'code',
            valueField: 'codeNm',
            disabledFunction: (
              rowIndex,
              columnIndex,
              value,
              item,
              dataField
            ) => {
              return this.editable && !this.disabled2 ? false : true;
            },
          },
        } /* 평가 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000264'),
          dataField: 'improvement',
          width: '100',
          editable: false,
        } /* 개선요청 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002842'),
          dataField: 'files',
          width: '130',
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
      if (this.editable && !this.disabled2) {
        const idx = this.rsltGridOptions.itemHeader.findIndex(
          (item) => item.dataField === 'improvement'
        );
        if (idx > -1) {
          this.rsltGridOptions.itemHeader[idx].renderer = {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          };
        }
      }

      this.getEduDept();
      // this.getDataList();
    },
    openMultiFileUpload(event) {
      const saveData =
        this.$refs['dataTableItem' + this.tabIndex][0].getSaveDataObj();
      this.popupOptions.target = () =>
        import('@/pages/common/attachFile/gridAttachFileUpload.vue');
      this.popupOptions.title = 'L0000002843';
      this.popupOptions.visible = true;
      this.popupOptions.top = '10%';
      this.popupOptions.width = '30%';
      this.popupOptions.param = {
        editable: this.editable,
        disabled: this.disabled2,
        rowIndex: event.rowIndex,
        tempId: event.item.tempId,
        rowFiles: event.item.files,
        files: saveData,
      };
      this.popupOptions.customCallBack = this.setSaveFiles;
      this.popupOptions.closeCallback = this.closeMultiFilePopup;
    },
    closeMultiFilePopup(params) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.setSaveFiles(params);
    },
    setSaveFiles(params) {
      if ((params || null) !== null) {
        if ((params.saveData || null) !== null) {
          const rowIndex = this.popupOptions.param.rowIndex;
          this.rsltGridOptions.itemData[rowIndex].files = params.rowFiles;

          this.$refs['dataTableItem' + this.tabIndex][0].setSaveFiles(
            params.saveData
          );

          let files = [];
          for (let i = 0; i < this.tabItems.length; i++) {
            if (this.$refs['dataTableItem' + i]) {
              const data = this.$refs['dataTableItem' + i][0].getSaveFiles();
              files = this.$_.concat(files, data.files);
            }
          }
          this.safPsmAuditRslt.files = this.$_.clone(files);
        }
      }
    },

    // 검진 계획 그리드
    tabClicked(tab) {
      let idx = tab ? tab.index : this.tabIndex;
      this.tabIndex = idx;

      if (this.safPsmAuditRslt.safPsmAuditRsltDepts[idx] === undefined) return;

      this.rsltGridOptions.data = [];

      this.$_.forEach(
        this.safPsmAuditRslt.safPsmAuditRsltDepts[idx].safPsmAuditRsltDeptStds,
        (item) => {
          var date = new Date();
          let reltItems = [];
          this.$_.forEach(item.safPsmAuditRsltItems, (reltItem) => {
            reltItems.push({
              auditRsltDeptItemNo: reltItem.auditRsltDeptItemNo,
              auditRsltNo: reltItem.auditRsltNo,
              auditItemNo: reltItem.auditItemNo,
              auditStdNo: reltItem.auditStdNo,
              auditStdNm: reltItem.auditStdNm,
              auditItemNm: reltItem.auditItemNm,
              resultRemark: reltItem.resultRemark,
              resultValue: reltItem.resultValue,
              improvement: reltItem.improvement,
              targetDeptCd: reltItem.targetDeptCd,
              createDt: reltItem.createDt,
              createUserId: reltItem.createUserId,
              files: reltItem.files ? reltItem.files : [],
              tempId: reltItem.tempId
                ? reltItem.tempId
                : reltItem.auditRsltDeptItemNo + String(date.getTime()),
              updateDt: reltItem.updateDt,
              updateUserId: reltItem.updateUserId,
            });
          });
          this.rsltGridOptions.data.push({
            auditRsltNo: item.auditRsltNo,
            auditRsltStdNo: item.auditRsltStdNo,
            auditStdDesc: item.auditStdDesc,
            auditStdNm: item.auditStdNm,
            auditStdNo: item.auditStdNo,
            auditorDesc: item.auditorDesc,
            auditorUserId: item.auditorUserId,
            createDt: item.createDt,
            createUserId: item.createUserId,
            files: item.files ? item.files : [],
            safPsmAuditRsltItems: reltItems,
            updateDt: item.updateDt,
            updateUserId: item.updateUserId,
          });
        }
      );
    },
    isDisabled(scope) {
      if (scope.$index === 0) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * 수정 팝업 호출
     */
    // 그리드 row click 이벤트
    cellClickHandler(event) {
      $('#textAreaWrap').hide();
      if (event.dataField !== 'auditorDesc') {
        if (this.selectedRsltGridIndex > -1) {
          this.rsltGridOptions.data[
            this.selectedRsltGridIndex
          ].safPsmAuditRsltItems = this.rsltGridOptions.itemData;
        }

        this.selectedRsltGridIndex = event.rowIndex;
        this.rsltGridOptions.itemData = event.item.safPsmAuditRsltItems;
      }
    },
    /**
     * 등록 팝업  호출
     */
    cellClickHandler2(event) {
      $('#textAreaWrap').hide();
      if (!(!this.disabled2 && this.editable)) return;
      if (event.dataField !== 'improvement') return;

      let flag = '';
      if (!this.editable) {
        flag = 'DETAIL';
      } else {
        // 개선요청
        flag = event.dataField === 'improvement' ? 'REQUEST' : 'NOW';
      }

      this.popupOptions.param = {
        safImprActNo: 0, // data ? data.safImprActNo : 0, << 무조건 신규등록만 되도록
        imprClassCd: this.tabParam.imprClassCd,
        refTableId: event.item ? event.item.auditRsltDeptItemNo : 0,
        flag: '',
        imprRqstType: 'psm',
        psmImprRqstDeptCd: event.item ? event.item.targetDeptCd : '',
        title: event.item
          ? '[' + event.item.auditStdNm + ']' + event.item.auditItemNm
          : '',
      };

      if (event.item.no === 0) {
        return false;
      } else {
        // 개선요청
        if (event.dataField === 'improvement') {
          // 무조건 등록만 뜨도록 수정
          this.popupOptions.param.flag = 'NOW';
          this.popupOptions.title = 'L0000004216'; /* 개선요청일괄등록 */
          this.popupOptions.target = () =>
            import(`${'../../impr/actionRequestBatch.vue'}`);
        }
        this.popupOptions.visible = true;
        this.popupOptions.top = '10px';
        this.popupOptions.width = '90%';
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.$emit('reload');
      // if (data !== 'CLOSE') {

      // }
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    linkClicked(scope) {
      window.alert('L0000003784'); /* 개발중 */
      // TODO : 페이지 이동은 준비중
    },
    getEduDept() {
      this.tabItems = this.safPsmAuditRslt.safPsmAuditRsltDepts;
      this.tabClicked();
    },
    cellEditEndHandler(event) {
      this.rsltGridOptions.data[event.rowIndex][event.dataField] = event.value;
    },
    cellEditEndHandler2(event) {
      this.rsltGridOptions.itemData[event.rowIndex][event.dataField] =
        event.value;
    },
    resizeGrid() {
      for (let i = 0; i < this.tabItems.length; i++) {
        this.$refs['resultDataTable' + i][0].resize(
          null,
          this.rsltGridOptions.height
        );
        this.$refs['dataTableItem' + i][0].resize(
          null,
          this.rsltGridOptions.itemHeight
        );
      }
    },

    // 개행 문자 입력
    cellDoubleClick(event) {
      if (!(!this.disabled2 && this.editable)) return;
      if (event.dataField === 'resultRemark') {
        this.createMyCustomEditRenderer(event);
      }
    },
    // 커스텀 에디팅 렌더러 유형에 맞게 출력하기
    createMyCustomEditRenderer(event) {
      var i = 0;
      if (event.orgEvent.layerY > 70 && event.orgEvent.layerY < 140) {
        i = 1;
      } else if (event.orgEvent.layerY > 140 && event.orgEvent.layerY < 210) {
        i = 2;
      }
      var dataField = event.dataField;
      var $obj;
      var $textArea;
      // title, content는  TextArea 사용
      if (dataField === 'resultRemark') {
        $obj = $('#textAreaWrap')
          .css({
            left: event.orgEvent.clientX - event.orgEvent.offsetX - 100,
            top: event.orgEvent.screenY - event.orgEvent.pageY + 480 + 70 * i,
            width: 350,
            height: 140,
          })
          .show();
        $textArea = $('#myTextArea').val(
          String(event.value).replace(/[<]br[/][>]/gi, '\r\n')
        );
      }

      if (dataField === 'resultRemark') {
        // 데이터 필드 보관
        $obj.data('data-field', dataField);
        // 행인덱스 보관
        $obj.data('row-index', event.rowIndex);

        // 포커싱
        setTimeout(function () {
          $textArea.focus();
          $textArea.select();
        }, 16);
      }
    },
    // 진짜로 textarea 값을 그리드에 수정 적용시킴
    forceEditngTextArea(value) {
      var dataField = $('#textAreaWrap').data('data-field'); // 보관한 dataField 얻기
      var rowIndex = Number($('#textAreaWrap').data('row-index')); // 보관한 rowIndex 얻기
      value = value.replace(/\r|\n|\r\n/g, '<br/>'); // 엔터를 BR태그로 변환

      var item = {};
      item[dataField] = value;

      this.YAuiGrid.updateRow(item, rowIndex);
      $('#textAreaWrap').hide();
    },
    btnConfirm() {
      var value = $('#myTextArea').val();
      this.forceEditngTextArea(value);
    },
    btnCancel() {
      $('#textAreaWrap').hide();
    },
    // 개행 문자 입력
    /** /Button Event **/
  },
};
</script>

<style>
/* 커스텀 에디터 스타일 */
#textAreaWrap {
  font-size: 12px;
  position: absolute;
  height: 100px;
  min-width: 100px;
  background: #fff;
  border: 1px solid #555;
  display: none;
  padding: 4px;
  text-align: right;
  z-index: 9999;
}
#textAreaWrap textarea {
  font-size: 12px;
}

.nav_u {
  display: inline-block;
  list-style: none;
}
.nav_u li {
  display: inline;
  white-space: nowrap;
  text-align: right;
  list-style: none;
}

/* 에디터 버튼 */
.editor_btn {
  background: #ccc;
  border: 1px solid #555;
  cursor: pointer;
  margin: 2px;
  padding: 2px;
}
</style>
