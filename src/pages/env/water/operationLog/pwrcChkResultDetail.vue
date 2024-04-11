<!--
  목적 : 배출수 사용량 팝업창
  작성자 : etg
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 저장 -->
          <y-btn
            :action-url="editUrl"
            :param="gridOptions.data"
            :is-submit="isUpdate"
            title="L0000002474"
            color="orange"
            action-type="PUT"
            beforeSubmit="beforeUpdate"
            @beforeUpdate="beforeUpdate"
            @btnClicked="btnUpdateClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 닫기 -->
          <y-btn title="L0000000881" @btnClicked="closePopup" />
        </div>
        <!-- 전력 사용량 목록 -->
        <y-data-table
          label="L0000002502"
          ref="dataTable"
          grid-type="edit"
          :height="gridOptions.height"
          :headers="gridOptions.header"
          :items="gridOptions.data"
          @selectedRow="changeSelectedRow"
          :popMode="true"
        ></y-data-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'discharg-chk-result-detail',
  props: {
    popupParam: {
      paramMeasureYmd: '',
      paramEwtrCleanFacNo: 0,
      paramPlantCd: '',
      paramDeptCd: '',
    },
  },
  data() {
    return {
      totalAmt: '',
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
        selectedRowData: {
          meterCntY: null,
          meterCntT: null,
          consumAmt: null,
        },
      },
      isUpdate: false,
      editUrl: '',
      searchUrl: '',
      editable: false,
      runTmItems: [],
      runTmHours: [],
    };
  },
  watch: {
    'gridOptions.selectedRowData.pwrMeterCntT': function(newValue, oldValue) {
      this.gridOptions.selectedRowData.pwrConsumAmt = this.getCalc(
        this.gridOptions.selectedRowData.pwrMeterCntY,
        this.gridOptions.selectedRowData.pwrMeterCntT,
        this.gridOptions.selectedRowData.pwrMeterMagn
      );
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.editUrl =
        transactionConfig.env.water.operationLog.pwrcChkResult.edit.url;
      this.searchUrl =
        selectConfig.env.water.operationLog.pwrcChkResult.list.url;
      this.initGrid();
    },
    initGrid() {
      this.gridOptions.header = [
        {
          text: 'L0000002511', // 전력사용량계명
          name: 'ewtrPwrMeterNm',
          width: '180px',
          align: 'left',
          sortable: false,
        },
        {
          text: 'L0000000191', // 가동시간
          name: 'runTm',
          width: '150px',
          align: 'left',
          type: 'number',
          maxlength: 5,
          pointNumber: 2,
          sortable: false,
        },
        {
          text: 'L0000001448', // 사용량(kWh)
          name: 'pwrConsumAmt',
          width: '120px',
          align: 'center',
          type: 'number',
          disabled: true,
          maxlength: 9,
          hasSeperator: true,
          pointNumber: 2,
          sortable: false,
        },
        {
          text: 'L0000000764', // 금일폐수 1㎥당 소모전력량(kWh/㎥)
          name: 'pwrcPerDay',
          width: '200px',
          align: 'center',
          sortable: false,
          hasSeperator: true,
          type: 'number',
          maxlength: 9,
          pointNumber: 2,
        },
        {
          text: 'L0000000379', // 검침시간
          name: 'chkTime',
          width: '150px',
          align: 'left',
          type: 'text',
          maxlength: 10,
          sortable: false,
        },
        {
          text: 'L0000002509', // 전력량계 지침
          sortable: false,
          child: [
            {
              text: 'L0000002515', // 전일
              name: 'pwrMeterCntY',
              width: '120px',
              align: 'center',
              hasSeperator: true,
              sortable: false,
            },
            {
              text: 'L0000003595', // 금일
              name: 'pwrMeterCntT',
              width: '120px',
              align: 'center',
              type: 'number',
              hasSeperator: true,
              maxlength: 11,
              pointNumber: 2,
              sortable: false,
            },
            {
              text: 'L0000001136', // 배율
              name: 'pwrMeterMagn',
              width: '120px',
              align: 'center',
              sortable: false,
            },
          ],
        },
        {
          text: 'L0000002800', // 참고사항
          name: 'remark',
          width: '250px',
          align: 'left',
          maxlength: 250,
          type: 'text',
          sortable: false,
        },
      ];

      if (
        this.popupParam.paramMeasureYmd &&
        this.popupParam.paramEwtrCleanFacNo > 0 &&
        this.popupParam.paramDeptCd
      ) {
        this.getList();
      }
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        measureYmd: this.popupParam.paramMeasureYmd,
        ewtrCleanFacNo: this.popupParam.paramEwtrCleanFacNo,
        deptCd: this.popupParam.paramDeptCd,
      };
      this.$http.request(
        _result => {
          _result.data.forEach(item => {
            item.pwrConsumAmt = this.getCalc(
              item.pwrMeterCntY,
              item.pwrMeterCntT,
              item.pwrMeterMagn
            );
          });
          this.gridOptions.data = this.$_.clone(_result.data);

          if (_result.data.length > 0) {
            this.isSaveDisable = false;
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    changeSelectedRow(row) {
      this.gridOptions.selectedRowData = row;

      this.gridOptions.selectedRowData.pwrConsumAmt = this.getCalc(
        this.gridOptions.selectedRowData.pwrMeterCntY,
        this.gridOptions.selectedRowData.pwrMeterCntT,
        this.gridOptions.selectedRowData.pwrMeterMagn
      );
    },
    beforeUpdate() {
      var flag = false;
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.$_.forEach(this.gridOptions.data, row => {
                  row.updateUserId = this.$store.getters.token;
                  row.createUserId = this.$store.getters.token;
                  row.ewtrCleanFacNo = this.popupParam.paramEwtrCleanFacNo;
                  if (row.pwrConsumAmt < 0) flag = true;
                });
                this.isUpdate = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdate = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
      this.getList();
    },
    getCalc(pwrMeterCntY, pwrMeterCntT, pwrMeterMagn) {
      if (pwrMeterCntY && pwrMeterCntT) {
        // 금일검침 - 전일검침
        return ((pwrMeterCntT - pwrMeterCntY) * Number(pwrMeterMagn)).toFixed(
          2
        );
      } else if (pwrMeterCntT) {
        let tempPwrMeterMagn = Number(pwrMeterMagn) ? Number(pwrMeterMagn) : 1;
        return (Number(pwrMeterCntT) * tempPwrMeterMagn).toFixed(2);
      } else return '0.00';
    },
    btnClickedErrorCallback(_result) {
      this.isUpdate = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
  },
};
</script>
