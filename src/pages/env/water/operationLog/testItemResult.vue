<!--
  목적 : 운영일지-자가측정 검사결과
  작성자 : etg
  Detail : 운영일지-자가측정 검사결과 조회,등록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 자가측정 검사결과 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002298')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @btnClicked="btnClicked"
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
  name: 'test-item-result',
  props: {
    tabEditable: false,
    paramEwtrCleanFacNo: 0,
    paramMeasureYmd: '',
    paramPlantCd: '',
    paramDeptCd: '',
    authDuringAppr: false,
    apprMode: false,
    updateMode: false,
    disabled: false,
  },
  data() {
    return {
      gridOptions: {
        name: 'testItemResult',
        header: [],
        data: [],
        btns: [],
        height: 200,
        merge: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      editable: true,
      isSaveDisable: true,
      isUpdate: false,
      editUrl: '',
      searchUrl: '',
      YAuiGrid: null,
    };
  },
  watch: {},
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
  beforeDestroy() {},
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.getTestItemHeader();

      this.editUrl =
        transactionConfig.env.water.operationLog.testItemResult.edit.url;
      this.searchUrl =
        selectConfig.env.water.operationLog.testItemResult.list.url;

      if (
        this.paramMeasureYmd &&
        this.paramEwtrCleanFacNo > 0 &&
        this.paramDeptCd
      ) {
        this.getList();
      }
    },

    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        measureYmd: this.paramMeasureYmd,
        ewtrCleanFacNo: this.paramEwtrCleanFacNo,
        plantCd: this.paramPlantCd,
        deptCd: this.paramDeptCd,
      };
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    getDataSet() {
      this.$http.url =
        selectConfig.env.water.operationLog.testItemResult.default.url;
      this.$http.type = 'GET';
      this.$http.param = {
        measureYmd: this.paramMeasureYmd,
        ewtrCleanFacNo: this.paramEwtrCleanFacNo,
        plantCd: this.paramPlantCd,
      };

      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;

          if (_result.data.length > 0) {
            this.isSaveDisable = false;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getTestItemHeader() {
      this.$http.url =
        selectConfig.env.water.operationLog.testItemResult.items.url;
      this.$http.type = 'GET';
      this.$http.param = {
        measureYmd: this.paramMeasureYmd,
        ewtrCleanFacNo: this.paramEwtrCleanFacNo,
        plantCd: this.paramPlantCd,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.merge = [];
          this.gridOptions.merge.push({ index: 1, field: 'ewtrMonPosNm' });
          // 그리드 헤더 설정
          this.gridOptions.header = [
            {
              // 측정위치명
              headerText: this.$comm.getLangSpecInfoLabel('L0000002949'),
              dataField: 'ewtrMonPosNm',
              width: '150',
              style: 'left-align',
            },
          ];
          this.$_.forEach(_result.data, (item) => {
            if (item.inputTypeCd === 'TXT01') {
              this.gridOptions.header.push({
                headerText: item.ewtrTestItemNm,
                dataField: item.inputTypeCd + item.ewtrTestItemCd,
                width: '120',
                style: 'right-align',
              });
            } else {
              this.gridOptions.header.push({
                headerText: item.ewtrTestItemNm,
                dataField: item.inputTypeCd + item.ewtrTestItemCd,
                width: '120',
                style: 'right-align',
              });
            }
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    btnClicked() {
      this.popupOptions.target = () =>
        import(`${'./testItemResultDetail2.vue'}`);
      this.popupOptions.title = 'L0000002298'; // 자가측정 검사결과 목록
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        paramMeasureYmd: this.paramMeasureYmd,
        paramPlantCd: this.paramPlantCd,
        paramEwtrCleanFacNo: this.paramEwtrCleanFacNo,
        paramDeptCd: this.paramDeptCd,
        popMode: true,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      this.isUpdate = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>
