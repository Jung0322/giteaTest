<!--
  목적 : 유해요인조사 목록
  Detail : 유해요인조사 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <!-- <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             유해요인 양식 다운로드 
            <y-btn
              v-if="gridOptions.data.length !== 0 && !disabled && editable"
              :width="8"
              title="L0000004882"
              color="blue"
              @btnClicked="btnExcelTemplateDownClicked"
            />
            유해요인 업로드
            <y-btn
              v-if="gridOptions.data.length !== 0 && !disabled && editable"
              :width="8"
              title="L0000004883"
              color="blue"
              @btnClicked="btnExcelUploadClicked"
            />
            삭제
            <y-btn
              v-if="!disabled && editable && gridOptions.data.length !== 0"
              :action-url="deleteUrl"
              :param="deleteValue"
              :is-submit="isDelete"
              title="L0000001495"
              color="red"
              action-type="DELETE"
              beforeSubmit="beforeDelete"
              @beforeDelete="beforeDelete"
              @btnClicked="btnDeleteClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           유해요인 조사 목록 
          <y-data-table
            label="L0000002170"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :useRownum="false"
            v-model="selectedValue"
            @tableLinkClicked="tableLinkClicked"
          >
            <el-table-column
              v-if="editable&&!disabled"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002170')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="true"
          @btnExcelUploadClicked="btnExcelUploadClicked"
          @btnExcelTemplateDownClicked="btnExcelTemplateDownClicked"
          @btnDelRowClicked="btnDelRowClicked"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
    <harmful-detail
      ref="ddetail"
      :popupParam="popupParam"
      v-show="uesView"
      @redirectYN="redirectYN"
    ></harmful-detail>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import harmfulDetail from '@/pages/hea/musculoskeletalSystemES/harmfulDetail.vue';

export default {
  /* attributes: name, components, props, data */
  name: 'harmful',
  components: { harmfulDetail },
  props: {
    disabled: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    muscResearch: {
      type: Object,
      default: function () {
        return {
          plantCd: '',
          muscResearchNo: 0,
          muscResearchStateCd: '',
        };
      },
    },
    harmsur: {
      type: Object,
      default: function () {
        return {
          surveyMode: false,
        };
      },
    },
    tabParam: {
      type: Object,
      default: function () {
        return {
          imprClassCd: 'ICL14',
          refTableId: 0,
          editable: true,
          editable2: true,
          detailCheck: false,
          plantCd: '',
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
      gridOptions: {
        name: 'harmful',
        btns: [],
        header: [],
        data: [],
        height: '200',
      },
      YAuiGrid: null,
      selectedValue: [],
      searchUrl: '',
      saveUrl: '',
      deleteUrl: '',
      isDelete: false,
      deleteValue: null,
      editable: false,
      uesView: false,
      popupParam: {},
      harmfulNoArr: [],
    };
  },
  watch: {
    // tabIndex() {
    //   this.getList();
    // },
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
      this.searchUrl = selectConfig.hea.harmful.list.url;
      this.deleteUrl = transactionConfig.hea.harmful.delete.url;
      this.editable = this.$route.meta.editable;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002645'),
          dataField: 'surveryTypeNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002661'),
          dataField: 'surveryDt',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002662'),
          dataField: 'surveryUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004264'),
          dataField: 'deptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000875'),
          dataField: 'unitWorkNm',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004394'),
          dataField: 'harmCnt',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002374'),
          dataField: 'processDesc',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000264'),
          dataField: 'improvement',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002737'),
          dataField: 'request',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004882'),
          color: 'blue',
          btnClicked: 'btnExcelTemplateDownClicked',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004883'),
          color: 'blue',
          btnClicked: 'btnExcelUploadClicked',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelRowClicked',
          visible: true,
        },
      ];
      this.getList();
    },

    getList() {
      if (!this.muscResearch || !this.muscResearch.muscResearchNo) {
        return;
      }
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        muscResearchNo: this.muscResearch.muscResearchNo,
      };

      this.$http.request(
        (_result) => {
          this.$_.forEach(_result.data, (item) =>
            this.harmfulNoArr.push(item.muscHarmfulNo)
          );
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          if (this.YAuiGrid.getGridData().length === 0) {
            this.gridOptions.btns[0].visible = false;
            this.gridOptions.btns[1].visible = false;
            this.gridOptions.btns[2].visible = false;
          } else {
            this.gridOptions.btns[0].visible = true;
            this.gridOptions.btns[1].visible = true;
            this.gridOptions.btns[2].visible = true;
          }
          if (this.muscResearch.muscResearchStateCd === 'HMCS5') {
            this.harmsur.surveyMode = true;
          } else if (this.muscResearch.muscResearchStateCd === 'HMCS4') {
            this.$_.forEach(_result.data, (item) => {
              if (item.updateDt) {
                this.harmsur.surveyMode = true;
                this.muscResearch.muscResearchStateCd = 'HMCS5';
                return false;
              }
            });
          } else {
            this.harmsur.surveyMode = false;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'improvement') {
        this.popupOptions.param.flag = 'NOW';
        this.popupOptions.title = 'L0000004216'; /* 개선요청일괄등록 */
        this.popupOptions.param = {
          safImprActNo: 0, // data ? data.safImprActNo : 0, << 무조건 신규등록만 되도록
          imprClassCd: this.tabParam.imprClassCd,
          refTableId: this.tabParam.refTableId,
          flag: '',
          title: '[' + event.item.processNm + '] ' + event.item.unitWorkNm,
        };
        this.popupOptions.target = () =>
          import(`${'../../impr/actionRequestBatch.vue'}`);
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else if (event.dataField === 'request') {
        this.popupOptions.param.flag = 'REQUEST';
        this.popupOptions.title = 'L0000002740'; // 즉시조치등록
        this.popupOptions.param = {
          safImprActNo: 0, // data ? data.safImprActNo : 0, << 무조건 신규등록만 되도록
          imprClassCd: this.tabParam.imprClassCd,
          refTableId: this.tabParam.refTableId,
          editable: true,
          flag: '',
        };
        this.popupOptions.target = () =>
          import(`${'../../impr/immediateActionNewDetail.vue'}`);
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else if (event.dataField === 'unitWorkNm') {
        this.btnDetail(event.item);
      }
    },
    tableLinkClicked(header, data) {
      // if (!(!this.disabled && this.editable)) {
      if (!data) {
        return;
      }
      if (header.name === 'improvement') {
        this.popupOptions.param.flag = 'NOW';
        this.popupOptions.title = 'L0000004216'; /* 개선요청일괄등록 */
        this.popupOptions.param = {
          safImprActNo: 0, // data ? data.safImprActNo : 0, << 무조건 신규등록만 되도록
          imprClassCd: this.tabParam.imprClassCd,
          refTableId: this.tabParam.refTableId,
          flag: '',
          title: '[' + data.processNm + '] ' + data.unitWorkNm,
        };
        this.popupOptions.target = () =>
          import(`${'../../impr/actionRequestBatch.vue'}`);
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else if (header.name === 'request') {
        this.popupOptions.param.flag = 'REQUEST';
        this.popupOptions.title = 'L0000002740'; // 즉시조치등록
        this.popupOptions.param = {
          safImprActNo: 0, // data ? data.safImprActNo : 0, << 무조건 신규등록만 되도록
          imprClassCd: this.tabParam.imprClassCd,
          refTableId: this.tabParam.refTableId,
          editable: true,
          flag: '',
        };
        this.popupOptions.target = () =>
          import(`${'../../impr/immediateActionNewDetail.vue'}`);
        this.popupOptions.visible = true;
        this.popupOptions.closeCallback = this.closePopup;
      } else {
        this.btnDetail(data);
      }
    },
    btnDetail(data) {
      this.popupParam = {
        muscHarmfulNo: data.muscHarmfulNo,
        disabled: this.disabled,
      };
      // this.popupOptions = {
      //   muscHarmfulNo: data.muscHarmfulNo,
      //   disabled: this.disabled
      // };
      // this.popupOptions.param = {
      // flag: '',
      // }
      // this.popupOptions.title = '유해요인';
      // this.popupOptions.target = () => import(`${'./harmfulDetail.vue'}`);
      // this.popupOptions.visible = true;
      // this.popupOptions.closeCallback = this.closePopup;

      // 팝업창 제거 후 동일 화면에서 상세화면 호출
      this.uesView = true;
    },
    closePopup() {
      this.getList();
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.uesView = false;
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnDelRowClicked() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning',
        });
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.deleteUrl;
          this.$http.type = 'DELETE';
          this.$http.param = {
            data: Object.values(this.$_.clone(checkingData)),
          };
          this.$http.request(
            (_result) => {
              this.getList();
              this.isDelete = false;
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success',
              });
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    beforeDelete() {
      if (this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning',
        });
        return;
      }
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.deleteValue = {
            data: Object.values(this.$_.clone(this.selectedValue)),
          };
          this.isDelete = true;
        },
      });
      // else {
      //   this.$_.forEach(this.selectedValue, item => {
      //     this.gridOptions.data = this.$_.clone(
      //       this.$_.reject(this.gridOptions.data, item)
      //     );
      //   });
      // }
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      this.getList();
      // this.gridOptions.checkData = [];
      this.isDelete = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
    },
    // 상세화면 저장 시 유해요인 조사 그리드 재호출
    redirectYN(data) {
      if (data) {
        this.getList();
      }
    },
    /**
     * 사용자의 입력을 받는다.
     */
    /** button 관련 이벤트 **/
    /** end button 관련 이벤트 **/

    btnExcelTemplateDownClicked() {
      let thisVue = this;
      let accept = this.$comm.getAccept('xlsx');
      let _comm = this.$comm;
      this.$http.url = selectConfig.hea.harmful.excel.url;
      this.$http.type = 'GET';
      this.$http.param = {
        harmfulNoArr: this.harmfulNoArr,
      };
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(
              blob,
              '유해요인조사_업로드_양식.xlsx'
            );
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = '유해요인조사_업로드_양식.xlsx';
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnExcelUploadClicked() {
      this.popupOptions.target = () =>
        import(`${'./checkResultHarmfulListUpload.vue'}`);
      this.popupOptions.title = 'L0000004879'; // 유해요인조사 엑셀 업로드
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        muscResearchNo: this.muscResearch.muscResearchNo,
      };
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupExcelUpload;
    },
    closePopupExcelUpload() {
      this.getList();
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.$refs.ddetail.excelUploadWatch += new Date();
    },
  },
};
</script>

<style></style>
