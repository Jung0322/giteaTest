<!--
  목적 : 공급수 사용량 
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
        <!-- 공급수 사용량 목록 -->
        <y-data-table
          label="L0000000490"
          ref="dataTable"
          :height="gridOptions.height"
          :headers="gridOptions.header"
          :items="gridOptions.data"
          @selectedRow="changeSelectedRow"
          :popMode="true"
        ></y-data-table>
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
      this.totalAmt = 0;
      this.$_.forEach(this.gridOptions.data, row => {
        this.totalAmt =
          parseFloat(this.totalAmt) +
          (!row.consumAmt ? 0 : parseFloat(row.consumAmt));
      });
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
        transactionConfig.env.water.operationLog.suplChkResult.edit.url;
      this.searchUrl =
        selectConfig.env.water.operationLog.suplChkResult.list.url;
      this.initGrid();
    },
    initGrid() {
      this.gridOptions.header = [
        {
          text: 'L0000000495', // '공급수분류명',
          name: 'ewtrSuplClassNm',
          width: '100px',
          align: 'left',
          sortable: false,
        },
        {
          text: 'L0000000494', // '공급수명',
          name: 'ewtrSuplNm',
          width: '150px',
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
              width: '100px',
              align: 'center',
              sortable: false,
            },
            {
              text: 'L0000003595', // '금일',
              name: 'meterCntT',
              width: '100px',
              align: 'center',
              type: 'number',
              maxlength: 9,
              pointNumber: 2,
              sortable: false,
            },
          ],
        },
        {
          text: 'L0000001449', // '사용량(㎥/일)',
          name: 'consumAmt',
          width: '100px',
          align: 'center',
          sortable: false,
        },
        {
          text: 'L0000000379', // '검침시간',
          name: 'chkTime',
          width: '100px',
          align: 'center',
          type: 'text',
          maxlength: 50,
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
          this.totalAmt = 0;
          this.$_.forEach(this.gridOptions.data, row => {
            this.totalAmt =
              parseFloat(this.totalAmt) +
              (!row.consumAmt ? 0 : parseFloat(row.consumAmt));
          });
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
      this.totalAmt = 0;
      this.$_.forEach(this.gridOptions.data, row => {
        this.totalAmt =
          parseFloat(this.totalAmt) +
          (!row.consumAmt ? 0 : parseFloat(row.consumAmt));
      });
    },
    getCalc(meterCntY, meterCntT) {
      if (meterCntY != null && meterCntT != null) {
        // 금일검침 - 전일검침
        return (meterCntT - meterCntY).toFixed(2);
      } else if (meterCntT != null) {
        return Number(meterCntT).toFixed(2);
      } else return '0.00';
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
