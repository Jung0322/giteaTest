<!--
  목적 : 안전운전계획 > 비상사태 대비대응 > 훈련시나리오 개정이력
  작성자 : LHJ
  Detail : 안전운전계획 > 비상사태 대비대응 > 훈련시나리오 개정이력
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <!-- 훈련시나리오 개정이력 -->
        <y-auigrid
          ref="yAuiGrid"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003472')"
          :useExcelExport="false"
          :showRowCheckColumn="editable && !disabled"
          @cellClick="cellClickHandler"
          @beforeDeleteSubmit="beforeDeleteSubmit"
          @btnDelete="btnDeleteClickedCallback"
          @btnClickedError="btnClickedErrorCallback"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOpt"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'training-sinario-history',
  props: {
    // 부모로부터 받은 param data
    trainingScenario: {
      trainSceNo: 0, // 훈련시나리오번호
      trainSceGrpNo: 0, // 훈련시나리오그룹번호:
      revNum: '', // 재개정번호
      type: Object,
      default: {
        trainSceGrpNo: 0,
        popMode: false,
      },
    },
  },
  data() {
    return {
      // GRID 옵션들
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: 300,
      },
      popupOpt: {
        target: null,
        title: '',
        visible: false,
        width: '',
        top: '',
        param: {},
        closeCallback: null,
        customCallBack: null,
      },
      editable: false,
      searchUrl: '',

      revdeleteUrl: '',
      isDeleteSubmit: false,
      deleteRows: [],
      disabled: false,
      gridSelectedRows: [],
    };
  },
  watch: {
    'trainingScenario.trainSceNo': {
      handler: function (newval, oldval) {
        this.getList();
        this.gridOptions.btns[0].visible =
          this.editable &&
          !this.disabled &&
          this.trainingScenario.trainSceGrpNo;
      },
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    if (this.trainingScenario.trainSceGrpNo) {
      this.getList();
    }
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl =
        selectConfig.sop.emergencyState.trainingScenario.revList.url;
      this.revdeleteUrl =
        transactionConfig.sop.emergencyState.trainingScenario.revdelete.url;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001042'),
          dataField: 'sceNum',
          width: '15%',
        }, // 문서번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005365'),
          dataField: 'title',
          width: '55%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 매뉴얼명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000293'),
          dataField: 'revNum',
          width: '15%',
        }, // 개정번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002459'),
          dataField: 'createDt',
          width: '15%',
        }, // 재개정일
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          actionUrl: this.revdeleteUrl,
          actionType: 'delete',
          beforeSubmit: 'beforeDeleteSubmit',
          btnClicked: 'btnDelete',
          btnClickedError: 'btnClickedError',
          visible:
            this.editable &&
            !this.disabled &&
            this.trainingScenario.trainSceGrpNo,
          useSubmit: true,
        }, // 삭제
      ];
      console.log('12132', this.trainingScenario);
    },
    getList() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.trainingScenario.trainSceGrpNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'title') {
        const param = this.$_.cloneDeep(event.item);
        param.popMode = true;
        param.revFlag = true;

        this.popupOpt.target = () => import(`./trainingScenarioDetail`);
        this.popupOpt.title = 'L0000003383'; // 훈련 시나리오 상세
        this.popupOpt.visible = true;
        this.popupOpt.width = '70%';
        this.popupOpt.top = '10px';
        this.popupOpt.param = param;
        this.popupOpt.closeCallback = this.closePopup;
      }
    },
    closePopup() {
      this.popupOpt.target = null;
      this.popupOpt.visible = false;
      this.getList();
    },
    beforeDeleteSubmit() {
      if (this.YAuiGrid.getCheckedRowItemsAll().length > 0) {
        this.deleteRows = {
          data: Object.values(
            this.$_.clone(this.YAuiGrid.getCheckedRowItemsAll())
          ),
        };
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321' /* 확인 */,
          message: 'M0000001022' /* 개정이력 목록에서 제외 하시겠습니까? */,
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {
            this.isDeleteSubmit = true;
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            'M0000001023' /* 선택된 이력이 없습니다. 목록 앞단에 선택박스를 확인하세요. */,
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
        title: 'L0000003395' /* 안내 */,
        message: 'M0000001024' /* 선택된 개정이력을 목록에서 제외하였습니다. */,
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isDeleteSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
      );
    },
    resizeGrid() {
      this.YAuiGrid.resize(null, this.gridOptions.height);
    },
  },
};
</script>
