<!--
  목적 : 개선사항 탭
  Detail : 개선사항 탭
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <!-- <b-row>
      <b-col sm="12">
        <b-col v-if="tabParam.target !== 'IMM'" sm="12" class="px-0 mt-2">
          <div slot="buttonGroup" class="float-right mb-1">
            - 업로드양식 
            <y-btn
              v-if="editable"
              title="L0000005022"
              @btnClicked="btnTemplate"
            />
             업로드 
            <y-btn
              v-if="tabParam.editable && editable && tabParam.refTableId"
              title="L0000001934"
              color="blue"
              @btnClicked="btnExcelUpload"
            />
             개선요청등록
            <y-btn
              v-if="tabParam.editable && editable && tabParam.refTableId"
              title="L0000000268"
              color="blue"
              @btnClicked="openDialogPage('BATCH')"
            />
             행 삭제 
            <y-btn
              v-if="
                gridOptions.data.length > 0 && tabParam.editable && editable
              "
              title="L0000003223"
              color="red"
              @btnClicked="deleteRow()"
            />
          </div>
           개선요청사항 목록 
          <y-data-table
            label="L0000000270"
            ref="dataTable"
            :messageCheck="!tabParam.editable"
            :message="tabParam.message"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @tableLinkClicked="tableLinkimprTitleClicked"
            v-model="gridOptions.selectValue"
            :popMode="true"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000270')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :softRemoveRowMode="false"
          :showRowCheckColumn="true"
          @cellClick="cellClickHandler"
          @btnTemplate="btnTemplate"
          @btnExcelUpload="btnExcelUpload"
          @openDialogPage="openDialogPage('BATCH')"
          @deleteRow="deleteRow"
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
  /* attributes: name, components, props, data */
  name: 'impr-act-tab',
  props: {
    tabParam: {
      type: Object,
      default: {
        plantCd: null,
        imprClassCd: '',
        refTableId: 0,
        refTableIdList: [],
        editable: true,
        detailCheck: false,
        status: '',
        message: '',
        editMode: false,
        refresh: false,
      },
    },
    tabIndex: '',
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
      gridOptions: {
        name: 'imprActTabSample',
        btns: [],
        header: [],
        data: [],
        selectValue: [],
      },
      YAuiGrid: null,
      searchUrl: '',
      deleteUrl: '',
      gridSelectedRows: [],
      editable: false,
    };
  },
  watch: {
    tabIndex() {
      if (Number(this.tabIndex) === 3) {
        this.getList();
        this.resizeGrid();
      }
    },
    'tabParam.refresh': function (newVal, oldVal) {
      this.getList();
    },
    'tabParam.editable': function (newVal, oldVal) {
      this.gridOptions.btns.map((btn) => {
        if (btn.color === 'blue') {
          btn.visible =
            this.tabParam.editable && this.editable && this.tabParam.refTableId;
        } else if (btn.color === 'red') {
          btn.visible = this.tabParam.editable && this.editable;
        }

        return btn;
      });
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
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = selectConfig.saf.imprAct.newlist.url;
      this.deleteUrl = transactionConfig.saf.imprAct.immDelete.url;
      this.editable = this.$route.meta.editable;
      this.getList();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002668'),
          dataField: 'actClassNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005032'),
          dataField: 'imprTitle',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000267'),
          dataField: 'imprRqstContents',
          style: 'left-align',
          width: '15%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002666'),
          dataField: 'actResultContents',
          style: 'left-align',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005033'),
          dataField: 'imprStepNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002673'),
          dataField: 'actDeptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002670'),
          dataField: 'actLimitYmd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002685'),
          dataField: 'actConfirmYmd',
          width: '10%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005022'),
          // color: 'orange',
          btnClicked: 'btnTemplate',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001934'),
          color: 'blue',
          btnClicked: 'btnExcelUpload',
          visible:
            this.tabParam.editable && this.editable && this.tabParam.refTableId,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000268'),
          color: 'blue',
          btnClicked: 'openDialogPage',
          visible:
            this.tabParam.editable && this.editable && this.tabParam.refTableId,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003223'),
          color: 'red',
          btnClicked: 'deleteRow',
          visible: this.tabParam.editable && this.editable,
        },
      ];
      console.log('tab', this.tabParam.editable);
      console.log('editable', this.editable);
      console.log('refTableId', this.tabParam.refTableId);
    },
    cellClickHandler(event) {
      if (event.dataField !== 'imprRqstContents') return;
      this.openDialogPage('DETAIL', event.item);
    },
    tableLinkimprTitleClicked(header, data) {
      this.openDialogPage('DETAIL', data);
    },
    getList() {
      if (
        this.tabParam.refTableId === 0 &&
        (!this.tabParam.refTableIdList || !this.tabParam.refTableIdList.length)
      ) {
        return;
      }

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.tabParam;
      this.$http.request(
        (_result) => {
          // 개선요청사항 목록

          this.gridOptions.data = _result.data;
          // this.$.forEach(this.gridOptions.data, (item) => {
          //   if (item.imprStepCd === 'IMST1') {
          //     item.imprStepNm = '요청등록';
          //   } else if (item.imprStepCd === 'IMST2') {
          //     item.imprStepNm = '접수';
          //   } else if (item.imprStepCd === 'IMST3') {
          //     item.imprStepNm = '조치부서 조치';
          //   } else if (item.imprStepCd === 'IMST5') {
          //     item.imprStepNm = '개선완료';
          //   }
          // });
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    openDialogPage(flag, data) {
      if (data !== undefined) {
        flag = 'REQUEST';

        if (!this.editable) flag = 'DETAIL';

        this.popupOptions.param = {
          safImprActNo: data.safImprActNo,
          imprClassCd: this.tabParam.imprClassCd,
          refTableId: this.tabParam.refTableId,
          flag: flag,
        };
      } else {
        if (!this.editable) flag = 'DETAIL';
        this.popupOptions.param = {
          safImprActNo: 0,
          imprClassCd: this.tabParam.imprClassCd,
          refTableId: this.tabParam.refTableId,
          flag: flag,
          plantCd: this.tabParam.plantCd,
        };
      }
      if (this.tabParam.detailCheck) {
        flag = 'DETAIL';
        this.popupOptions.param.flag = 'DETAIL';
      }
      // this.popupOptions.title = 'L0000002740'; /* 즉시조치등록 */
      // this.popupOptions.target = () => import(`${'./imprActTabDetail.vue'}`);

      // this.popupOptions.top = '10px';
      // this.popupOptions.visible = true;
      // this.popupOptions.closeCallback = this.closePopup;
      // if (flag === 'NOW') {
      //   this.popupOptions.title = 'L0000002740'; /* 즉시조치등록 */
      //   this.popupOptions.target = () =>
      //     import(`${'./immediateActionNewDetail.vue'}`);

      //   this.popupOptions.top = '10px';
      //   this.popupOptions.visible = true;
      //   this.popupOptions.closeCallback = this.closePopup;
      // } else
      if (data && data.actClassCd === 'ACL01') {
        this.popupOptions.param.actClassYn = true;
        this.popupOptions.param.editMode = this.tabParam.editMode;
        this.popupOptions.title = 'L0000002740'; /* 즉시조치등록 */
        this.popupOptions.target = () =>
          import(`${'./immediateActionNewDetail.vue'}`);

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else if (flag === 'DETAIL') {
        this.popupOptions.param.actClassYn = true;
        this.popupOptions.title = 'L0000003458'; /* 개선요청상세 */
        this.popupOptions.target = () => import(`${'./improveDetail.vue'}`);

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else if (flag === 'BATCH') {
        this.popupOptions.title = 'L0000004216'; /* 개선요청일괄등록 */
        this.popupOptions.target = () => import(`${'./imprActTabDetail.vue'}`);

        this.popupOptions.top = '10px';
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else {
        this.popupOptions.param.actClassYn = true;
        this.popupOptions.param.editMode = this.tabParam.editMode;
        this.popupOptions.title = 'L0000000268'; /* 개선요청등록 */
        this.popupOptions.target = () => import(`${'./actionRequest.vue'}`);

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

    deleteRow() {
      if (
        !this.YAuiGrid.getCheckedRowItems() ||
        this.YAuiGrid.getCheckedRowItems().length === 0
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395 ' /* 안내 */,
          message: 'M0000001148', // 삭제 할 행을 선택하세요.
          type: 'warning',
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321' /* 확인 */,
          message:
            'M0000000484' /* 선택한 즉시조치사항들을 삭제하시겠습니까? */,
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            let deleteData = this.$_.reject(
              this.YAuiGrid.getCheckedRowItems(),
              {
                safImprActNo: 0,
              }
            );
            this.$_.forEach(this.YAuiGrid.getCheckedRowItems(), (item) => {
              // this.gridOptions.data = this.$_.reject(
              //   this.gridOptions.data,
              //   item
              // );
              this.gridSelectedRows.push(item.item);
            });
            // 삭제 처리해야됨 아직 체크 안함
            if (deleteData.length > 0) {
              this.$http.url = this.deleteUrl;
              this.$http.type = 'DELETE';
              this.$http.param = {
                data: this.gridSelectedRows,
              };
              this.$http.request(
                (_result) => {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395 ' /* 안내 */,
                    message: 'M0000000007' /* 삭제되었습니다 */,
                    type: 'success', // success / info / warning / error
                  });
                  this.$_.forEach(deleteData, (item) => {
                    this.gridOptions.data = this.$_.reject(
                      this.gridOptions.data,
                      item
                    );
                  });
                  this.getList();
                },
                (_error) => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                }
              );
            } else {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395 ' /* 안내 */,
                message: 'M0000000007' /* 삭제되었습니다 */,
                type: 'success', // success / info / warning / error
              });
            }
          },
          cancelCallback: () => {},
        });
      }
    },
    btnTemplate() {
      let thisVue = this;
      let accept = this.$comm.getAccept('xlsx');
      let _comm = this.$comm;
      let fileNm = '개선사항 업로드양식_샘플.xlsx';

      this.$http.url = selectConfig.saf.imprAct.template.url;
      this.$http.param = {
        fileName: fileNm, // 양식 파일명
      };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnExcelUpload(data) {
      this.popupOptions.target = () =>
        import(`${'@/pages/impr/imprActTabUploadPopup'}`);
      this.popupOptions.title = 'L0000001938'; // '업로드 정보';
      this.popupOptions.visible = true;
      this.popupOptions.param = this.tabParam;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      // this.$emit('refresh');
      this.getList();
    },

    resizeGrid() {
      this.YAuiGrid.resize(null, this.gridOptions.height);
    },
  },
};
</script>
