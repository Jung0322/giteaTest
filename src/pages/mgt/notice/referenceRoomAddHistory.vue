<!--
  목적 : 경영 > 게시판 > 자료실 등록/수정 > 개정이력 탭
  작성자 : ksw
  Detail : 자료실 등록/수정 > 개정이력 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             삭제 
              <y-btn 
              v-if="editable"
              :action-url="revdeleteUrl"
              :param="deleteRows"
              :is-submit="isDeleteSubmit"
              title="L0000001495" 
              color="red"
              action-type="delete"
              beforeSubmit="beforeDeleteSubmit"
              @beforeDeleteSubmit="beforeDeleteSubmit"
              @btnClicked="btnDeleteClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           개정이력 목록 
          <y-data-table
            label="L0000000296"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="gridSelectedRows"
            :editable="editable"
            @tableLinkClicked="tableLinkClicked"
            :popMode="true"
          >
          <el-table-column
              v-if="editable"
              label="checkbox"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002274')"
          :useExcelExport="false"
          :showRowCheckColumn="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @deleteCheckRow="deleteCheckRow"
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
  /** attributes: name, components, props, data **/
  name: 'reference-room-add-history',
  props: {
    referenceInfo: {
      type: Object,
      default: {
        dataBoardNo: '',
      },
    },
    count: {
      type: Number,
      default: 0,
    },
  },

  data: () => ({
    gridOptions: {
      name: 'referenceRoomAddHistory',
      btns: [],
      header: [],
      data: [],
      height: 210,
    },
    YAuiGrid: null,
    searchParam: {
      dataBoardNo: '', // 사업장
    },
    editable: true,
    searchUrl: '',

    revdeleteUrl: '',
    deleteUrl: '',
    deleteRows: [],
    isDeleteSubmit: false,
    gridSelectedRows: [],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '80%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
  }),
  watch: {
    count() {
      this.getList();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam.dataBoardNo = this.referenceInfo.dataBoardNo;
      this.searchUrl = selectConfig.mgt.referenceRoom.revlist.url;
      this.deleteUrl = transactionConfig.saf.referenceRoom.delete.url;
      this.revdeleteUrl = transactionConfig.saf.referenceRoom.revdelete.url;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002616'),
          dataField: 'title',
          width: '30%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000293'),
          dataField: 'revNum',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000971'),
          dataField: 'deptNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000976'),
          dataField: 'createUserNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000297'),
          dataField: 'createDt',
          width: '20%',
        },
      ];
      if (
        this.referenceInfo.dataBoardNo !== '' &&
        this.referenceInfo.dataBoardNo !== null &&
        this.referenceInfo.dataBoardNo !== undefined
      ) {
        this.gridOptions.btns = [
          {
            title: this.$comm.getLangSpecInfoLabel('L0000001495'),
            color: 'red',
            btnClicked: 'deleteCheckRow',
          },
        ];
      }

      if (
        this.referenceInfo.dataBoardNo !== '' &&
        this.referenceInfo.dataBoardNo !== null &&
        this.referenceInfo.dataBoardNo !== undefined
      ) {
        this.getList();
      }
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
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
      if (event.dataField !== 'title') return;
      this.popupOptions.target = () =>
        import(`${'./referenceRoomHistoryDetail.vue'}`);
      this.popupOptions.title = 'L0000004258'; /* 자료실 개정상세 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        lcnBoardNo: event.item.dataBoardNo,
      };
      // console.log(data.lcnBoardNo);
      this.popupOptions.closeCallback = this.closeDetailPopup;
    },
    tableLinkClicked(header, data) {
      if (data === null) return;
      this.popupOptions.target = () =>
        import(`${'./referenceRoomHistoryDetail.vue'}`);
      this.popupOptions.title = 'L0000004258'; /* 자료실 개정상세 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        lcnBoardNo: data.dataBoardNo,
      };
      // console.log(data.lcnBoardNo);
      this.popupOptions.closeCallback = this.closeDetailPopup;
    },
    closeDetailPopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    closePopup() {
      this.$emit('closePopup');
    },

    deleteCheckRow() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (removeData.length > 0) {
        this.$_.forEach(this.YAuiGrid.getCheckedRowItems(), (item) => {
          this.gridSelectedRows.push(item.item);
        });
        // let tok = Object.values(this.$_.clone(this.gridSelectedRows));
        // console.log(tok);
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000001022', // 개정이력 목록에서 제외 하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.$http.url = this.revdeleteUrl;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: this.gridSelectedRows,
            };
            this.$http.request(
              (_result) => {
                this.btnDeleteClickedCallback();
              },
              (_error) => {
                window.getApp.$emit(
                  'APP_REQUEST_ERROR',
                  'M0000000016'
                  /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
                );
              }
            );
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001023', // 선택된 이력이 없습니다. 목록 앞단에 선택박스를 확인하세요.
          type: 'warning',
        });
      }
    },
    /** validation checking**/
    /**
     * 저장 하기전 UI단 유효성 검사
     **/
    beforeDeleteSubmit() {
      if (this.gridSelectedRows.length > 0) {
        this.deleteRows = {
          data: Object.values(this.$_.clone(this.gridSelectedRows)),
        };
        // let tok = Object.values(this.$_.clone(this.gridSelectedRows));
        // console.log(tok);
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000001022', // 개정이력 목록에서 제외 하시겠습니까?
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.isDeleteSubmit = true;
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001023', // 선택된 이력이 없습니다. 목록 앞단에 선택박스를 확인하세요.
          type: 'warning',
        });
      }
    },

    /**
     * 삭제버튼 클릭 이후 callback 메서드
     **/
    btnDeleteClickedCallback(_result) {
      this.isDeleteSubmit = false;
      this.getList();
      this.$emit('');
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000001024', // 선택된 개정이력을 목록에서 제외하였습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isDeleteSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
    },
  },
};
</script>
