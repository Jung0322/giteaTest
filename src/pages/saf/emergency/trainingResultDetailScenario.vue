<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <!-- ::::::::::::::::::: 2. 상세 속성 및 edit 항목 영역 <시작> ::::::::::::::::::: -->
        <b-row>
          <!-- ::::::::::::::::::: 2. 상세 속성 및 edit 항목 영역(dataTable) <시작> ::::::::::::::::::: -->
          <b-col sm="12">
            <b-row>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <y-auigrid
                  ref="yAuiGrid"
                  :name="gridOptions.name"
                  :headers="gridOptions.header"
                  :btns="gridOptions.btns"
                  :height="gridOptions.height"
                  :label="this.$comm.getLangSpecInfoLabel('L0000005361')"
                  :useExcelExport="false"
                  :showRowCheckColumn="editable && newInsertMode"
                  @cellClick="cellClickHandler"
                  @btnAdd="addRow"
                  @btnRemove="removeRow"
                />
              </b-col>
            </b-row>
          </b-col>
          <!-- ::::::::::::::::::: 2. 상세 속성 및 edit 항목 영역(dataTable) <끝> ::::::::::::::::::: -->
        </b-row>
        <!-- ::::::::::::::::::: 2. 상세 속성 및 edit 항목 영역 <끝> ::::::::::::::::::: -->
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  props: {
    emergencyResultInfo: {
      type: Object,
      default: () => ({
        safTrainPlanNo: 0,
        emergencyScenarioList: [],
      }),
    },
    newInsertMode: false,
    updateMode: false,
    tabIndex: '',
  },
  data() {
    return {
      // 0000000000000000000  그리드 정보 <시작> 0000000000000000000
      // GRID 옵션들
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: 300,
      },
      // 0000000000000000000  그리드 정보 <끝> 0000000000000000000

      // 0000000000000000000  팝업 변수 <시작> 0000000000000000000
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
        customCallBack: null,
      },
      // 0000000000000000000  탭 정보 <끝>  0000000000000000000

      editable: false, // 수정여부
    };
  },
  watch: {
    tabIndex() {
      if (Number(this.tabIndex) === 2) {
        this.YAuiGrid.setGridData(
          this.emergencyResultInfo.emergencyScenarioList
        );
        this.resizeGrid();
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002616'),
          dataField: 'title',
          width: '100%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 제목
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'blue',
          btnClicked: 'btnAdd',
          visible: this.editable && this.newInsertMode,
        }, // 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnRemove',
          visible: this.editable && this.newInsertMode,
        }, // 삭제
      ];
    },
    // dataTable row 추가
    addRow() {
      this.popupOptions.target = () => import(`${'./trainingScenario.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005366'; // 훈련 매뉴얼
      this.popupOptions.width = '60%';
      this.popupOptions.height = '50%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        popMode: true,
        plantCd: this.emergencyResultInfo.plantCd,
      };
      this.popupOptions.closeCallback = this.closeTrainSce;
    },
    closeTrainSce(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.success && data.data.length > 0) {
        this.$_.forEach(data.data, (item) => {
          if (
            this.$_.findIndex(this.emergencyResultInfo.emergencyScenarioList, {
              trainSceNo: item.trainSceNo,
            }) === -1
          ) {
            this.emergencyResultInfo.emergencyScenarioList.push(item);
          }
        });

        this.YAuiGrid.setGridData(
          this.emergencyResultInfo.emergencyScenarioList
        );
      }
    },
    // dataTable row 삭제
    removeRow() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      if (selectedRows.length > 0) {
        this.$_.forEach(selectedRows, (item) => {
          this.emergencyResultInfo.emergencyScenarioList = this.$_.reject(
            this.emergencyResultInfo.emergencyScenarioList,
            item
          );
        });
        this.YAuiGrid.setGridData(
          this.emergencyResultInfo.emergencyScenarioList
        );
      }
    },
    cellClickHandler(event) {
      this.popupOptions.target = () =>
        import(`${'./trainingScenarioDetail.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005364'; // 훈련 매뉴얼 상세
      this.popupOptions.width = '70%';
      this.popupOptions.param = {
        trainSceNo: event.item.trainSceNo,
        popMode: true,
      };
      this.popupOptions.closeCallback = this.closeScePopup;
    },
    closeScePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    resizeGrid() {
      this.YAuiGrid.resize(null, this.gridOptions.height);
    },
  },
};
</script>
