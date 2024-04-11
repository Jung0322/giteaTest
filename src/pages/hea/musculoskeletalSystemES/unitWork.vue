<!--
  목적 : 근골격계 단위작업 탭
  Detail : 조사결과
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                 추가 
                <y-btn
                  v-if="editable && tabEditable"
                  title="L0000002892"
                  color="blue"
                  @btnClicked="btnAdd"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                 삭제 
                <y-btn
                  v-if="editable && tabEditable"
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
               단위작업 목록 
              <y-data-table
                ref="dataTableIn"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :useRownum="false"
                v-model="selectedValue"
                label="L0000000873"
                @tableLinkClicked="tableLinkClicked"
              >
                <el-table-column
                  v-if="editable && tabEditable"
                  type="selection"
                  slot="selection"
                  align="center"
                  width="55"
                ></el-table-column>
              </y-data-table>
            </b-col>
          </b-col>
        </b-row>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000873')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="true"
          @cellClick="cellClickHandler"
          @btnAddRow="btnAddRow"
          @btnDelRow="btnDelRow"
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
  name: 'unit-work',
  props: {
    tabEditable: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    allDept: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
    muscResearch: {
      type: Object,
      default: function () {
        return {
          muscResearchNo: 0,
          plantCd: '',
          muscResearchDepts: [],
        };
      },
    },
  },
  data() {
    return {
      gridOptions: {
        // 조사결과
        name: 'unitWork',
        btns: [],
        header: [],
        data: [],
        height: '400',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        height: '50%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      selectedValue: [],
      editable: false,
      searchUrl: '',
      deleteUrl: '',
      isDelete: false,
      deleteValue: null,
    };
  },
  watch: {
    'muscResearch.muscResearchNo': {
      handler: function (val, oldVal) {
        this.getList();
      },
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
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.searchUrl = selectConfig.hea.unitWork.list.url;
      this.deleteUrl = transactionConfig.hea.unitWork.delete.url;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002654'),
          dataField: 'researchCd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004264'),
          dataField: 'deptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004368'),
          dataField: 'processNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000875'),
          dataField: 'unitWorkNm',
          width: '20%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002409'),
          dataField: 'workerCnt',
          width: '10%',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002374'),
          dataField: 'processDesc',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002660'),
          dataField: 'researchDt',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002662'),
          dataField: 'researchUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '10%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnAddRow',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelRow',
          visible: true,
        },
      ];
      this.getList();
    },
    getList() {
      if (!this.muscResearch.muscResearchNo) {
        return;
      }
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        muscResearchNo: this.muscResearch.muscResearchNo,
        deptCd: this.allDept ? null : this.$store.getters.deptCd,
      };

      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          if (this.tabEditable) {
            this.gridOptions.btns[0].visible = true;
            this.gridOptions.btns[1].visible = true;
          } else {
            this.gridOptions.btns[0].visible = false;
            this.gridOptions.btns[1].visible = false;
          }
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    cellClickHandler(event) {
      if (event.dataField !== 'unitWorkNm') return;
      this.btnAdd(event.item);
    },
    tableLinkClicked(header, data) {
      if (!data) {
        return;
      }
      this.btnAdd(data);
    },
    btnAddRow() {
      this.btnAdd();
    },
    btnAdd(data) {
      this.popupOptions.param = {
        muscResearchUnitNo: data ? data.muscResearchUnitNo : 0,
        muscResearchNo: this.muscResearch.muscResearchNo,
        tabEditable: this.tabEditable,
        plantCd: this.muscResearch.plantCd,
        muscResearchDepts: this.muscResearch.muscResearchDepts,
      };
      this.popupOptions.title = 'L0000000872'; // 단위작업
      this.popupOptions.target = () => import(`${'./unitWorkDetail.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.width = '72%';
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /** button 관련 이벤트 **/
    /**
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnDelRow() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (!checkingData || checkingData.length === 0) {
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
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success',
              });
              this.$emit('reloadChkRsltDetail');
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    beforeDelete() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
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
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      this.getList();
      this.isDelete = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
      this.$emit('reloadChkRsltDetail');
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
