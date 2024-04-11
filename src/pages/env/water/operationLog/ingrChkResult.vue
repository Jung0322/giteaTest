<!--
  목적 : 운영일지-원료/첨가제 사용량
  작성자 : etg
  Detail : 운영일지-원료/첨가제 사용량 조회,등록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="insertBox">
      <b-col sm="12">
        <!-- 원료/첨가제 사용량 목록 -->
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000002085')"
            :useExcelExport="false"
            :enableSorting="true"
            :showGridSetSave="true"
            @btnClicked="btnClicked"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4 mt-1">
          <!-- 총사용량(m³/일) -->
          <y-text
            :width="8"
            :editable="editable"
            ui="bootstrap"
            label="L0000002865"
            :disabled="true"
            name="totalAmt"
            v-model="totalAmt"
          ></y-text>
        </b-col>
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
  name: 'ingr-chk-result',
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
        name: 'ingrChkResult',
        header: [],
        data: [],
        btns: [],
        height: 300,
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
      isUpdate: false,
      isSaveDisable: true,

      editUrl: '',
      searchUrl: '',
      YAuiGrid: null,
      totalAmt: null,
    };
  },
  watch: {
    updateMode: {
      handler: function (val, oldVal) {
        console.log('123', this.updateMode);
        if (this.updateMode) {
          this.gridOptions.btns[0].visible = true;
        } else {
          this.gridOptions.btns[0].visible = false;
        }
      },
      deep: true,
    },
    disabled: {
      handler: function (newVal, oldVal) {
        console.log('123aaa', this.disabled);
        if (this.disabled) {
          this.gridOptions.btns[0].visible = false;
        } else {
          this.gridOptions.btns[0].visible = true;
        }
      },
      deep: true,
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          // 원료/첨가제명
          headerText: this.$comm.getLangSpecInfoLabel('L0000002087'),
          dataField: 'ewtrIngrNm',
          width: '15%',
          style: 'left-align',
        },
        {
          // 사용량(kg)
          headerText: this.$comm.getLangSpecInfoLabel('L0000001446'),
          dataField: 'consumAmt',
          width: '10%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002086'),
          color: 'orange',
          btnClicked: 'btnClicked',
          visible: this.tabEditable && this.updateMode && !this.disabled,
        },
      ];

      this.editUrl =
        transactionConfig.env.water.operationLog.ingrChkResult.edit.url;
      this.searchUrl =
        selectConfig.env.water.operationLog.ingrChkResult.list.url;

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
    btnClicked() {
      this.popupOptions.target = () => import(`${'./ingrChkResultDetail.vue'}`);
      this.popupOptions.title = 'L0000002085'; // 원료/첨가제 사용량 목록
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        paramMeasureYmd: this.paramMeasureYmd,
        paramPlantCd: this.paramPlantCd,
        paramEwtrCleanFacNo: this.paramEwtrCleanFacNo,
        paramDeptCd: this.paramDeptCd,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
  },
};
</script>
