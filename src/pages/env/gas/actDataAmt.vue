<template>
  <b-container fluid>
    <!-- 활동량 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :label="this.$comm.getLangSpecInfoLabel('L0000003343')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :showRowNumColumn="false"
          :showRightLabel="this.compleDisabled"
          :rightLabel="this.$comm.getLangSpecInfoLabel('L0000004490')"
          @cellEditEnd="cellEditEndHandler"
          @excelDown="excelDown"
          @emsCalc="emsCalc"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import { v4 as uuidv4 } from 'uuid';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-dis-act-data',
  props: {
    actData: {
      type: Object,
      default: {
        actDaRptNo: null,
        plantCd: null,
        actMonth: null,
        actDataList: [],
        stepCd: null,
      },
    },
    compleDisabled: false,
  },

  data() {
    return {
      editable: false,
      gridOptions: {
        selectValue: [],
        name: 'actDataAmt',
        header: [],
        data: [],
        btns: [],
        height: 250,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      initFinished: false,
    };
  },
  computed: {},
  watch: {
    'actData.actDataCd': {
      handler: function (newValue, oldValue) {
        if (this.initFinished === true) this.getList();
      },
      deep: true,
    },
    'actData.actMonth': {
      handler: function (newValue, oldValue) {
        this.getList(newValue);
      },
    },
    'actData.plantCd': {
      handler: function (newValue, oldValue) {
        if (this.initFinished === true) this.getList();
      },
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.getList();
    },

    gridHeaderSet() {
      this.gridOptions.header = [
        { // 배출유형
          headerText: this.$comm.getLangSpecInfoLabel('L0000001185'),
          dataField: 'ghgOutActType',
          width: '150',
          style: 'left-align',
          editable: false,
        },
        { // 배출활동구분
          headerText: this.$comm.getLangSpecInfoLabel('L0000001191'),
          dataField: 'disClsCd',
          width: '100',
          style: 'left-align',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001167'),
          dataField: 'disFacNm',
          width: '150',
          style: 'left-align',
          editable: false,
        }, // 배출시설
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003344'),
          dataField: 'disActNm',
          width: '150',
          style: 'left-align',
          editable: false,
        }, // 활동명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003340'), // 활동데이터
          children: [
            { // 활동중분류
              headerText: this.$comm.getLangSpecInfoLabel('L0000003354'),
              dataField: 'actClsSec',
              width: '150',
              style: 'left-align',
              editable: false,
            },
            { // 활동자료명
              headerText: this.$comm.getLangSpecInfoLabel('L0000003350'),
              dataField: 'actDataNm',
              width: '140',
              style: 'left-align',
              editable: false,
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
              dataField: 'unitType',
              width: '80',
              style: 'center-align',
              editable: false,
            }, // 단위
            { // 활동량
              headerText: this.$comm.getLangSpecInfoLabel('L0000003341'),
              dataField: 'actAmt',
              width: '120',
              style: 'right-align',
              dataType: "numeric",
              editable: this.actData.stepCd !== '0002',
              editRenderer: {
                type: 'InputEditRenderer',
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: true, // 소수점( . ) 도 허용할지 여부
                allowNegative: true, // 마이너스 부호(-) 허용 여부
                textAlign: "right", // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: true // 천단위 구분자 삽입 여부
              },
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004441'), // 온실가스 배출량
          children: [
            { // CO2(ton)
              headerText: this.$comm.getLangSpecInfoLabel('L0000005659'),
              dataField: 'emsCo2',
              width: '120',
              style: 'right-align',
              dataType: "numeric",
              editable: this.actData.stepCd !== '0002',
              editRenderer: {
                type: 'InputEditRenderer',
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: true, // 소수점( . ) 도 허용할지 여부
                allowNegative: true, // 마이너스 부호(-) 허용 여부
                textAlign: "right", // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: true // 천단위 구분자 삽입 여부
              },
            },
            { // CH4(kg)
              headerText: this.$comm.getLangSpecInfoLabel('L0000005660'),
              dataField: 'emsCh4',
              width: '120',
              style: 'right-align',
              dataType: "numeric",
              editable: this.actData.stepCd !== '0002',
              editRenderer: {
                type: 'InputEditRenderer',
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: true, // 소수점( . ) 도 허용할지 여부
                allowNegative: true, // 마이너스 부호(-) 허용 여부
                textAlign: "right", // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: true // 천단위 구분자 삽입 여부
              },
            },
            { // N2O(kg)
              headerText: this.$comm.getLangSpecInfoLabel('L0000005661'),
              dataField: 'emsN2o',
              width: '120',
              style: 'right-align',
              dataType: "numeric",
              editable: this.actData.stepCd !== '0002',
              editRenderer: {
                type: 'InputEditRenderer',
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: true, // 소수점( . ) 도 허용할지 여부
                allowNegative: true, // 마이너스 부호(-) 허용 여부
                textAlign: "right", // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: true // 천단위 구분자 삽입 여부
              },
            },
            { // HFCs(kg)
              headerText: this.$comm.getLangSpecInfoLabel('L0000005662'),
              dataField: 'emsHfcs',
              width: '120',
              style: 'right-align',
              dataType: "numeric",
              editable: this.actData.stepCd !== '0002',
              editRenderer: {
                type: 'InputEditRenderer',
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: true, // 소수점( . ) 도 허용할지 여부
                allowNegative: true, // 마이너스 부호(-) 허용 여부
                textAlign: "right", // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: true // 천단위 구분자 삽입 여부
              },
            },
            { // PFCs(kg)
              headerText: this.$comm.getLangSpecInfoLabel('L0000005663'),
              dataField: 'emsPfcs',
              width: '120',
              style: 'right-align',
              dataType: "numeric",
              editable: this.actData.stepCd !== '0002',
              editRenderer: {
                type: 'InputEditRenderer',
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: true, // 소수점( . ) 도 허용할지 여부
                allowNegative: true, // 마이너스 부호(-) 허용 여부
                textAlign: "right", // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: true // 천단위 구분자 삽입 여부
              },
            },
            { // SF6(kg)
              headerText: this.$comm.getLangSpecInfoLabel('L0000005664'),
              dataField: 'emsSf6',
              width: '120',
              style: 'right-align',
              dataType: "numeric",
              editable: this.actData.stepCd !== '0002',
              editRenderer: {
                type: 'InputEditRenderer',
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: true, // 소수점( . ) 도 허용할지 여부
                allowNegative: true, // 마이너스 부호(-) 허용 여부
                textAlign: "right", // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: true // 천단위 구분자 삽입 여부
              },
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004442'), // 에너지 사용량
          children: [
            { // 에너지(Mj)
              headerText: this.$comm.getLangSpecInfoLabel('L0000004443'),
              dataField: 'energyUsage',
              width: '120',
              style: 'right-align',
              dataType: "numeric",
              editable: this.actData.stepCd !== '0002',
              editRenderer: {
                type: 'InputEditRenderer',
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: true, // 소수점( . ) 도 허용할지 여부
                allowNegative: true, // 마이너스 부호(-) 허용 여부
                textAlign: "right", // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: true // 천단위 구분자 삽입 여부
              },
            },
            { // 전력(Mj)
              headerText: this.$comm.getLangSpecInfoLabel('L0000004444'),
              dataField: 'elecUsage',
              width: '120',
              style: 'right-align',
              dataType: "numeric",
              editable: this.actData.stepCd !== '0002',
              editRenderer: {
                type: 'InputEditRenderer',
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: true, // 소수점( . ) 도 허용할지 여부
                allowNegative: true, // 마이너스 부호(-) 허용 여부
                textAlign: "right", // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: true // 천단위 구분자 삽입 여부
              },
            },
            { // 스팀(Mj)
              headerText: this.$comm.getLangSpecInfoLabel('L0000004445'),
              dataField: 'steamUsage',
              width: '120',
              style: 'right-align',
              dataType: "numeric",
              editable: this.actData.stepCd !== '0002',
              editRenderer: {
                type: 'InputEditRenderer',
                onlyNumeric: true, // 0~9만 입력가능
                allowPoint: true, // 소수점( . ) 도 허용할지 여부
                allowNegative: true, // 마이너스 부호(-) 허용 여부
                textAlign: "right", // 오른쪽 정렬로 입력되도록 설정
                autoThousandSeparator: true // 천단위 구분자 삽입 여부
              },
            },
          ],
        },
      ];

    },
    gridBtnSet() {
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004439'),
          color: 'orange',
          btnClicked: 'excelDown',
          visible: this.editable
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004440'),
          color: 'blue',
          btnClicked: 'emsCalc',
          visible: !this.compleDisabled && this.editable
        },
      ];
    },

    getList(_newActMonth) {
      this.gridHeaderSet();
      this.gridBtnSet();

      if (!this.actData.actDaRptNo) {
        this.$http.url = this.$format(
          selectConfig.env.gas.actData.getItems.url,
          this.actData.plantCd,
          _newActMonth ? _newActMonth : this.actData.actMonth
        );
      } else {
        this.$http.url = this.$format(
          selectConfig.env.gas.actData.getUpdatedItems.url,
          this.actData.actDaRptNo,
          this.actData.plantCd,
          _newActMonth ? _newActMonth : this.actData.actMonth
        );
      }
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.initFinished = true;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellEditEndHandler() {
      this.actData.actDataList = this.YAuiGrid.getGridData();
    },
    excelDown() {
      let thisVue = this;
      this.$http.url = '/api/env/gas/refbook/exceldown';
      this.$http.type = 'GET';
      this.$http.param = {};
      this.$http.request(
        (_result) => {
          var fileOrgNm =
            this.$comm.getLangSpecInfoLabel('L0000004439') + // 산정식도움말
            this.$comm.moment().format('YYYYMMDD') +
            '.xlsx';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    emsCalc() {
      /* let tempData = this.gridOptions.data.filter((f) => {
        return !f.actAmt || f.actAmt === 0;
      }); */
      let tempData = this.YAuiGrid.getGridData().filter((f) => {
        return !f.actAmt || f.actAmt === 0;
      });

      if (tempData.length > 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003321', // '확인',
          message: 'M0000001055', // 활동량을 입력해주세요.
          type: 'warning',
          confirmCallback: () => {},
        });
      } else {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000001056', // 배출량 계산시 기존에 입력한 온실가스 배출량과 에너비 사용량 내역은 삭제 됩니다.
          type: 'info',
          confirmCallback: () => {
            this.$http.url = transactionConfig.env.gas.actData.calActData.url;
            this.$http.type = 'PUT';
            this.$http.param = this.actData;
            this.$http.request(
              (_result) => {
                this.gridOptions.data = this.$_.clone(_result.data);
                this.YAuiGrid.setGridData(this.$_.clone(_result.data));
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
          cancelCallback: () => {},
        });
      }
    },
    resizeGrid() {
      let _height = window.innerHeight - 505;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
