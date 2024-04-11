<!--
  목적 : 약품 사용량 팝업창
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
        <!-- 약품사용량 목록 -->
        <y-data-table
          label="L0000003635"
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
    'gridOptions.selectedRowData.inAmt': function (newValue, oldValue) {
      this.gridOptions.selectedRowData.amountCurr =
        Number(this.gridOptions.selectedRowData.prevAmountCurr) +
        Number(this.gridOptions.selectedRowData.inAmt) -
        Number(this.gridOptions.selectedRowData.consumAmt);
    },
    'gridOptions.selectedRowData.consumAmt': function (newValue, oldValue) {
      this.gridOptions.selectedRowData.amountCurr =
        Number(this.gridOptions.selectedRowData.prevAmountCurr) +
        Number(this.gridOptions.selectedRowData.inAmt) -
        Number(this.gridOptions.selectedRowData.consumAmt);
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
        transactionConfig.env.water.operationLog.chemChkResult.edit.url;
      this.searchUrl =
        selectConfig.env.water.operationLog.chemChkResult.list.url;
      this.initGrid();
    },
    initGrid() {
      this.gridOptions.header = [
        {
          text: 'L0000000686', // 구분
          name: 'ewtrDischGrpNm',
          width: '15%',
          align: 'left',
          sortable: false,
        },
        {
          text: 'L0000001922', // 약품명
          name: 'ewtrChemNm',
          width: '15%',
          align: 'left',
          sortable: false,
        },
        {
          text: 'L0000002516', // 전일잔고량
          name: 'prevAmountCurr',
          width: '10%',
          align: 'center',
          sortable: false,
        },
        {
          text: 'L0000000701', // 구입량
          name: 'inAmt',
          width: '10%',
          align: 'center',
          sortable: false,
          hasSeperator: true,
          maxlength: 9,
          pointNumber: 2,
          type: 'number',
        },
        {
          text: 'L0000001923', // 약품사용량
          name: 'consumAmt',
          width: '10%',
          align: 'center',
          type: 'number',
          hasSeperator: true,
          pointNumber: 2,
          maxlength: 9,
          sortable: false,
        },
        {
          text: 'L0000002448', // 잔고량
          name: 'amountCurr',
          width: '10%',
          align: 'center',
          type: 'number',
          disabled: true,

          hasSeperator: true,
          pointNumber: 2,
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
        (_result) => {
          this.gridOptions.data = _result.data;

          if (this.firstFlag === true) {
            this.initData = JSON.parse(JSON.stringify(_result.data));
            this.firstFlag = false;
          }

          if (_result.data.length > 0) {
            this.isSaveDisable = false;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    changeSelectedRow(row) {
      this.gridOptions.selectedRowData = row;
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeUpdate() {
      var i = 0;
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (this.isSaveChemChkResult) {
              let flag = true;
              this.$_.forEach(this.gridOptions.data, (row) => {
                row.ewtrCleanFacNo = this.paramEwtrCleanFacNo;
                row.updateUserId = this.$store.getters.token;
                row.createUserId = this.$store.getters.token;

                if (row.amountCurr < 0 && row.amountCurr !== null) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000910', // '약품 사용량이 잔고량보다 많습니다. 다시 입력해 주세요.',
                    type: 'warning',
                  });
                  flag = false;
                }
              });

              if (flag) {
                this.isUpdate = true;
              } else {
                this.$emit('callbackSaveOperationLog', {
                  isSaveChemChkResult: true,
                  isSaveResult: true,
                });
              }
            } else {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321', // '확인',
                message: 'M0000000011', // '저장하시겠습니까?',
                type: 'info',
                confirmCallback: () => {
                  var flag = true;
                  this.$_.forEach(this.gridOptions.data, (row) => {
                    row.updateUserId = this.$store.getters.token;
                    row.createUserId = this.$store.getters.token;
                    row.ewtrCleanFacNo = this.popupParam.paramEwtrCleanFacNo;

                    if (row.amountCurr < 0 && row.amountCurr !== null) {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395', // '안내',
                        message: 'M0000000910',
                        // '약품 사용량이 잔고량보다 많습니다. 다시 입력해 주세요',
                        type: 'warning',
                      });
                      flag = false;
                    }
                  });
                  if (flag) this.isUpdate = true;
                },
              });
            }
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
      this.firstFlag = true;
      this.getList();
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
