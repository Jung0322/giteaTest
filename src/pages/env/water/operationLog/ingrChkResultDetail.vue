<!--
  목적 : 원료/첨가제 사용량 팝업창
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
        <!-- 원료/첨가제 사용량 목록 -->
        <y-data-table
          label="L0000002085"
          ref="dataTable"
          grid-type="edit"
          :height="gridOptions.height"
          :headers="gridOptions.header"
          :items="gridOptions.data"
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
  watch: {},
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
        transactionConfig.env.water.operationLog.ingrChkResult.edit.url;
      this.searchUrl =
        selectConfig.env.water.operationLog.ingrChkResult.list.url;
      this.initGrid();
    },
    initGrid() {
      this.gridOptions.header = [
        {
          text: 'L0000002087', // 원료/첨가제명
          name: 'ewtrIngrNm',
          width: '15%',
          align: 'left',
          sortable: false,
        },
        {
          text: 'L0000001446', // 사용량(kg)
          name: 'consumAmt',
          width: '10%',
          align: 'center',
          type: 'number',
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
        _result => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeUpdate() {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // '저장하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.$_.forEach(this.gridOptions.data, row => {
                  row.updateUserId = this.$store.getters.token;
                  row.ewtrCleanFacNo = this.popupParam.paramEwtrCleanFacNo;
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
