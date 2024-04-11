<!--
  목적 : 상세조회 및 수정 팝업 목표/실적/평가 목록
  작성자 : mjpark
  Detail : 목표/실적/평가 목록 조회
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
            <y-data-table
              class="mergeTable"
              label="L0000005060"
              ref="dataTable"
              :height="gridOptions.height"
              :headers="gridOptions.header"
              :items="gridOptions.data"
              :span-options="gridOptions.merge"
              :rowClassName="tableRowClassName"
              @tableLinkClicked="tableLinkClicked"
            >
            </y-data-table>
          </b-col>
        </b-col>
      </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005060')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
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
  name: 'mgt-target-item-result',
  props: {
    mgtTargetItemRslt: {
      type: Object,
      default: function () {
        return {
          mgtTargetMonthNo: null,
          tapprRqstNo: null,
          rapprRqstNo: null,
          eapprRqstNo: null,
          tstepCd: null,
          rstepCd: null,
          estepCd: null,
          evalDataList: [],
        };
      },
    },
    allInputVal: 0,
    apprFlag: false,
  },
  data() {
    return {
      gridOptions: {
        name: 'mgtTargetItemResult',
        header: [],
        data: [],
        merge: [],
        height: '360',
      },
      YAuigrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: true,
      searchUrl: '',
      tDisabled: true,
      rDisabled: true,
      eDisabled: true,
    };
  },
  watch: {
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.mgtTargetItemRslt.evalDataList = this.gridOptions.data;
      },
      deep: true,
    },
    'mgtTargetItemRslt.mgtTargetMonthNo': {
      handler: function (val, oldVal) {
        this.getHeaders();
        this.getList();
      },
      deep: true,
    },
    'mgtTargetItemRslt.rstepCd': {
      handler: function (val, oldVal) {
        this.getHeaders();
        this.getList();
      },
      deep: true,
    },
    'mgtTargetItemRslt.estepCd': {
      handler: function (val, oldVal) {
        this.getHeaders();
        this.getList();
      },
      deep: true,
    },
    allInputVal: {
      handler: function (val, oldVal) {
        this.$_.forEach(this.gridOptions.data, (item) => {
          if (item.estepCd === 'BAPSG') {
            return;
          } else if (item.rstepCd === 'BAPSG') {
            item['evalVal'] = val;
          } else if (item.tstepCd === 'BAPSG') {
            item['rsltVal'] = val;
          }
        });
      },
      deep: true,
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
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
  /** methods **/
  methods: {
    tableRowClassName({ row, rowIndex }) {
      return 'odd-row';
    },
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.mgt.mgtTarget.mgtTargetRslt.list.url;

      this.getHeaders();
      this.getList();
    },
    /** /초기화 관련 함수 **/
    getHeaders() {
      this.tDisabled = true;
      this.rDisabled = true;
      this.eDisabled = true;

      if (this.mgtTargetItemRslt.estepCd === 'BAPSG') {
        this.tDisabled = true;
        this.rDisabled = true;
        this.eDisabled = true;
      } else if (
        this.mgtTargetItemRslt.rstepCd === 'BAPSG' &&
        (this.mgtTargetItemRslt.estepCd === null ||
          this.mgtTargetItemRslt.estepCd === '' ||
          this.mgtTargetItemRslt.estepCd === 'BAPSB' ||
          this.mgtTargetItemRslt.estepCd === 'BAPSD' ||
          this.apprFlag)
      ) {
        this.eDisabled = false;
      } else if (
        this.mgtTargetItemRslt.tstepCd === 'BAPSG' &&
        (this.mgtTargetItemRslt.rstepCd === null ||
          this.mgtTargetItemRslt.rstepCd === '' ||
          this.mgtTargetItemRslt.rstepCd === 'BAPSB' ||
          this.mgtTargetItemRslt.rstepCd === 'BAPSD' ||
          this.apprFlag)
      ) {
        this.rDisabled = false;
      }

      this.gridOptions.merge = [];
      this.gridOptions.merge.push({ index: 1, field: 'bizFieldNm' });
      this.gridOptions.merge.push({ index: 6, field: 'stepNm' });

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001346'),
          dataField: 'bizFieldNm',
          width: '10%',
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003199'),
          dataField: 'bizFieldItemNm',
          width: '25%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003774'),
          dataField: 'targetVal',
          width: '15%',
          dataType: 'numeric',
          editable: !this.tDisabled,
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            allowPoint: true,
            allowNegative: true,
            textAlign: 'right',
            autoThousandSeparator: true,
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001810'),
          dataField: 'rsltVal',
          width: '15%',
          dataType: 'numeric',
          editable: !this.rDisabled,
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            allowPoint: true,
            allowNegative: true,
            textAlign: 'right',
            autoThousandSeparator: true,
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003044'),
          dataField: 'evalVal',
          width: '15%',
          dataType: 'numeric',
          editable: !this.eDisabled,
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            allowPoint: true,
            allowNegative: true,
            textAlign: 'right',
            autoThousandSeparator: true,
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'),
          dataField: 'stepNm',
          width: '20%',
          cellMerge: true,
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
      ];
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        mgtTargetMonthNo: this.mgtTargetItemRslt.mgtTargetMonthNo,
      };

      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
    cellClickHandler(event) {
      this.mgtTargetItemRslt.evalDataList = this.YAuiGrid.getGridData();
      if (event.item === null) return;
      if (event.dataField !== 'stepNm') return;

      var apprRqstNo = 0;
      if (event.item.estepCd !== null) {
        apprRqstNo = event.item.eapprRqstNo;
      } else if (event.item.rstepCd !== null) {
        apprRqstNo = event.item.rapprRqstNo;
      } else {
        apprRqstNo = event.item.tapprRqstNo;
      }
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: apprRqstNo,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkClicked(header, data) {
      if (data === null) return;

      var apprRqstNo = 0;
      if (data.estepCd !== null) {
        apprRqstNo = data.eapprRqstNo;
      } else if (data.rstepCd !== null) {
        apprRqstNo = data.rapprRqstNo;
      } else {
        apprRqstNo = data.tapprRqstNo;
      }
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: apprRqstNo,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
      );
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      // this.getHeaders();
      // this.getList();
    },
    /** /Button Event **/
  },
};
</script>
