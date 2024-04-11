<!--
  목적 : 선해임현황 > 선해임이력 탭
  작성자 : kmj
  Detail : 선해임현황 > 선해임이력 탭
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
                v-if="editable && isDeletable"
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
           선해임이력 목록 
          <y-data-table
            label="L0000004232"
            ref="dataTableCheck"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="gridSelectedRows"
            :editable="editable"
            :popMode="true"
          >
          <el-table-column
              v-if="editable && isDeletable"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000004232')"
          :useExcelExport="false"
          :enableSorting="true"
          :showRowCheckColumn="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @deleteCheckRow="deleteCheckRow"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-elect-his-detail-history',
  props: {
    electHis: {
      type: Object,
      default: {
        safElectHisNo: 0,
        electAttCd: null, // 선해임분야
        plantCd: null,
        plantNm: null,
        content: null,
        refLawCd: null, // 관련법규
        safElectTitlNo: null, // 선해임명NO
        userId: null, // 선해임자ID
        userNm: null, // 선해임자명
        electTypeCd: null, // 선해임구분
        electReason: null, // 선해임사유
        electDt: null, // 선해임일
        lcnTypeCd: null, // 선해임자격증NO
        lcnTypeNm: null, // 선해임자격증NO
        lcnGetDt: null, // 자격취득일
        effSDt: null, // 유효기간시작일
        effEDt: null, // 유효기간종료일
        lcnNum: null, // 자격번호
        remarks: null, // 참고사항
        createUserId: null,
        createUserNm: null,
        createDt: null,
        updateDt: null,
        updateUserId: null,
        qualifiRequire: null, // 자격요건
        useYn: null,
        safElectHisGrpNo: 0,
        deptCd: null,
        refContents: null,
        electEndDt: null,
      },
    },
    updateMode: false,
    updtMode: false,
    revMode: false,
  },
  data: () => ({
    gridOptions: {
      name: 'electHisDetailHistory',
      header: [],
      btns: [],
      data: [],
      height: 210,
    },
    searchParam: {
      safElectHisNo: 0, // 사업장
    },
    editable: true,
    searchUrl: '',
    revdeleteUrl: '',
    deleteUrl: '',
    deleteRows: [],
    isDeleteSubmit: false,
    gridSelectedRows: [],
  }),
  computed: {
    disabled() {
      return !((this.updateMode && (this.updtMode || this.revMode)) || !this.updateMode);
    },
    // 선해임이력이 있을 경우에만 삭제 가능
    isDeletable() {
      return this.gridOptions.data.length > 0 && this.electHis.safElectHisNo;
    }
  },
  watch: {
    'electHis.safElectHisNo': function(newValue, oldValue) {
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

      this.searchUrl = selectConfig.saf.electHis.revlist.url;
      this.revdeleteUrl = transactionConfig.saf.electHis.revdelete.url;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001559'), 
          dataField: 'userNm', 
          width: '10%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001558'), 
          dataField: 'electDt', 
          width: '10%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003217'), 
          dataField: 'electEndDt', 
          width: '10%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000576'), 
          dataField: 'lcnTypeNm', 
          width: '10%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002305'), 
          dataField: 'lcnNum', 
          width: '10%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002306'), 
          dataField: 'lcnGetDt', 
          width: '10%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000293'), 
          dataField: 'revNum', 
          width: '10%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000294'), 
          dataField: 'revContents', 
          width: '10%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000973'), 
          dataField: 'createDt', 
          width: '10%', 
        },
      ];
      this.gridOptions.btns = [
        {        
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'deleteCheckRow',        
        }
      ];

      this.getList();
    },
    getList() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.electHis.safElectHisGrpNo
      );
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016'
            /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    deleteCheckRow() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001614', // 선택된 항목이 없습니다.
          type: 'warning',
        });
        return;
      }
      this.$_.forEach(this.YAuiGrid.getCheckedRowItems(), (item) => {
        this.gridSelectedRows.push(item.item)
      });
      // let tok = Object.values(this.$_.clone(this.gridSelectedRows));
      // console.log(tok);
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000001022' /* 개정이력 목록에서 제외 하시겠습니까? */,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.revdeleteUrl;
          this.$http.param = {
            data: this.gridSelectedRows,
          };
          // this.$http.url = this.$format(this.deleteUrl, this.selectedValues);
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001024' /* 선택된 개정이력을 목록에서 제외하였습니다. */,
                type: 'success',
              });
              this.getList();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
            
        },
      });
    },
    closePopup() {
      this.$emit('closePopup');
    },
    beforeDeleteSubmit() {
      if (this.gridSelectedRows.length > 0) {
        this.deleteRows = {
          data: Object.values(this.$_.clone(this.gridSelectedRows)),
        };
        // let tok = Object.values(this.$_.clone(this.gridSelectedRows));
        // console.log(tok);
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', /* 확인 */
          message: 'M0000001022', /* 개정이력 목록에서 제외 하시겠습니까? */
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.isDeleteSubmit = true;
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', /* 안내 */
          message:
            'M0000001023', /* 선택된 이력이 없습니다. 목록 앞단에 선택박스를 확인하세요. */
          type: 'warning',
        });
      }
    },
    btnDeleteClickedCallback(_result) {
      this.isDeleteSubmit = false;
      this.getList();
      this.$emit('');
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', /* 안내 */
        message: 'M0000001024', /* 선택된 개정이력을 목록에서 제외하였습니다. */
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isDeleteSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016'  /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
      );
    },
  },
};
</script>