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
            :is-submit="isUpdateSubmit"
            title="L0000002474"
            color="orange"
            action-type="put"
            beforeSubmit="beforeUpdate"
            @beforeUpdate="beforeUpdate"
            @btnClicked="btnUpdateClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 닫기 -->
          <y-btn title="L0000000881" @btnClicked="closePopup" />
        </div>
        <!-- 배출수 사용량 목록 -->
        <y-data-table
          label="L0000001160"
          ref="dataTable"
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
      isUpdateSubmit: false,
      editUrl: '',
      searchUrl: '',
      editable: false,
      runTmItems: [],
      runTmHours: [],
    };
  },
  watch: {
    'gridOptions.selectedRowData.meterCntT': function(newValue, oldValue) {
      this.gridOptions.selectedRowData.consumAmt = this.getCalc(
        this.gridOptions.selectedRowData.meterCntY,
        this.gridOptions.selectedRowData.meterCntT
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
        transactionConfig.env.water.operationLog.dischChkResult.edit.url;
      this.searchUrl =
        selectConfig.env.water.operationLog.dischChkResult.list.url;
      this.initGrid();
    },
    initGrid() {
      this.gridOptions.header = [
        {
          text: 'L0000001166', // 배출수분류명
          name: 'ewtrDischClassNm',
          width: '10%',
          align: 'left',
          sortable: false,
        },
        {
          text: 'L0000003205', // 항목명
          name: 'ewtrDischNm',
          width: '10%',
          align: 'left',
          sortable: false,
        },
        {
          text: 'L0000002767', // '지침(㎥)',
          sortable: false,
          child: [
            {
              text: 'L0000002515', // '전일',
              name: 'meterCntY',
              width: '10%',
              align: 'center',
              sortable: false,
            },
            {
              text: 'L0000003595', // '금일',
              name: 'meterCntT',
              width: '10%',
              align: 'center',
              type: 'number',
              maxlength: 11,
              hasSeperator: true,
              pointNumber: 2,
              sortable: false,
            },
          ],
        },

        {
          text: 'L0000001153', // 배출량 및 사용량(㎥/일)
          name: 'consumAmt',
          width: '10%',
          type: 'number',
          disabled: true,
          maxlength: 9,
          hasSeperator: true,
          pointNumber: 2,
          align: 'center',
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
            item.consumAmt = this.getCalc(item.meterCntY, item.meterCntT);
          });
          this.gridOptions.data = _result.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
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
                  row.ewtrCleanFacNo = this.popupParam.paramEwtrCleanFacNo;
                  row.updateUserId = this.$store.getters.token;
                  row.createUserId = this.$store.getters.token;
                  if (row.consumAmt < 0) flag = true;
                });
                this.isUpdateSubmit = true;
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
    changeSelectedRow(row) {
      this.gridOptions.selectedRowData = row;
      this.gridOptions.selectedRowData.consumAmt = this.getCalc(
        this.gridOptions.selectedRowData.meterCntY,
        this.gridOptions.selectedRowData.meterCntT
      );
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
      this.getList();
    },
    getCalc(meterCntY, meterCntT) {
      if (meterCntY != null && meterCntT != null) {
        // 금일검침 - 전일검침
        return (meterCntT - meterCntY).toFixed(2);
      } else if (meterCntT != null) {
        return Number(meterCntT).toFixed(2);
      } else return '0.00';
    },
    btnClickedErrorCallback(_result) {
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
  },
};
</script>
