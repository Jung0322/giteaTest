<!--
  목적 : 환경 > 대기 > 운영일지 > 상세 > 배출구별 주요배출시설 가동(조업)시간
  작성자 : jkl
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
        <!-- 수질 배출시설 가동(조업)시간 -->
        <y-data-table
          ref="dataTable"
          label="L0000001700"
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
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },
      isUpdateSubmit: false,
      editUrl: '',
      searchUrl: '',

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
      this.editUrl =
        transactionConfig.env.water.operationLog.dischRunTm.edit.url;
      this.searchUrl = selectConfig.env.water.operationLog.dischRunTm.list.url;
      this.initGrid();
    },
    initGrid() {
      this.gridOptions.header = [
        {
          text: 'L0000003132', // '폐수배출시설명'
          name: 'facNm',
          width: '180px',
          align: 'left',
        },
        {
          text: 'L0000000024', // '06시'
          name: 'h06Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000025', // '07시'
          name: 'h07Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000026', // '08시'
          name: 'h08Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000027', // '09시'
          name: 'h09Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000028', // '10시'
          name: 'h10Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000029', // '11시'
          name: 'h11Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000030', // '12시'
          name: 'h12Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000031', // '13시'
          name: 'h13Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000032', // '14시'
          name: 'h14Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000033', // '15시'
          name: 'h15Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000034', // '16시'
          name: 'h16Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000035', // '17시'
          name: 'h17Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000036', // '18시'
          name: 'h18Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000037', // '19시'
          name: 'h19Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000038', // '20시'
          name: 'h20Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000039', // '21시'
          name: 'h21Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000040', // '22시'
          name: 'h22Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000041', // '23시'
          name: 'h23Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000003594', // '24시'
          name: 'h00Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000019', // '01시'
          name: 'h01Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000020', // '02시'
          name: 'h02Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000021', // '03시'
          name: 'h03Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000022', // '04시'
          name: 'h04Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
        },
        {
          text: 'L0000000023', // '05시'
          name: 'h05Yn',
          width: '60px',
          align: 'center',
          type: 'singlecheckbox',
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
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.$_.forEach(this.gridOptions.data, row => {
                  row.updateUserId = this.$store.getters.token;
                  row.createUserId = this.$store.getters.token;
                  row.ewtrCleanFacNo = this.popupParam.paramEwtrCleanFacNo;
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
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      this.getList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
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
