<!--
  목적 : 운영일지-방지시설 가동시간
  작성자 : etg
  Detail : 운영일지-방지시설 가동시간 조회,등록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 방지시설 가동시간 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001108')"
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
  name: 'disch-run-tm',
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
        name: 'preventRunTm',
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
      isSaveDisable: true,
      isUpdate: false,
      editUrl: '',
      searchUrl: '',
      YAuiGrid: null,
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
          // '오염방지시설명',
          headerText: this.$comm.getLangSpecInfoLabel('L0000002025'),
          dataField: 'ewtrPreventFacNm',
          width: '180',
          style: 'left-align',
        },
        {
          // '06시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000024'),
          dataField: 'h06Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '07시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000025'),
          dataField: 'h07Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '08시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000026'),
          dataField: 'h08Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '09시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000027'),
          dataField: 'h09Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '10시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000028'),
          dataField: 'h10Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '11시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000029'),
          dataField: 'h11Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '12시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000030'),
          dataField: 'h12Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '13시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000031'),
          dataField: 'h13Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '14시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000032'),
          dataField: 'h14Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '15시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000033'),
          dataField: 'h15Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '16시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000034'),
          dataField: 'h16Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '17시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000035'),
          dataField: 'h17Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '18시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000036'),
          dataField: 'h18Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '19시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000037'),
          dataField: 'h19Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '20시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000038'),
          dataField: 'h20Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '21시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000039'),
          dataField: 'h21Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '22시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000040'),
          dataField: 'h22Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '23시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000041'),
          dataField: 'h23Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '24시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000003594'),
          dataField: 'h00Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '01시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000019'),
          dataField: 'h01Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '02시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000020'),
          dataField: 'h02Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '03시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000021'),
          dataField: 'h03Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '04시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000022'),
          dataField: 'h04Yn',
          width: '60',
          style: 'center-align',
        },
        {
          // '05시'
          headerText: this.$comm.getLangSpecInfoLabel('L0000000023'),
          dataField: 'h05Yn',
          width: '60',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001109'),
          color: 'orange',
          btnClicked: 'btnClicked',
          visible: this.tabEditable && this.updateMode && !this.disabled,
        },
      ];

      this.editUrl =
        transactionConfig.env.water.operationLog.preventRunTm.edit.url;
      this.searchUrl =
        selectConfig.env.water.operationLog.preventRunTm.list.url;
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
          if (_result.data.length > 0) {
            this.isSaveDisable = false;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnClicked() {
      this.popupOptions.target = () => import(`${'./preventRunTmDetail.vue'}`);
      this.popupOptions.title = 'L0000001699'; // '수질 방지시설 가동(조업)시간';
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
