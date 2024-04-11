<!--
  목적 : LOG > SMS로그관리
  Detail : SMS 로그 확인 및 이력 조회 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000767"
            name="searchDt"
            v-model="searchParam.searchDt"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 검색어 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000331"
            name="word"
            placeholder="메시지 내용 또는 수신전화번호"
            v-model="searchParam.word"
            :editable="true"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000169')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :showRowCheckColumn="true"
          @trySend="trySend"
          @getList="getList"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'sms-log',
  props: {},
  data() {
    return {
      searchParam: {
        searchDt: [], // 로그검색기간
        fromDt: '',
        toDt: '',
        word: '',
      },
      gridOptions: {
        name: 'smsLog',
        header: [],
        data: [],
        btns: [],
        height: '600',
      },
      editable: true,
      searchUrl: '',
      tryUrl: '',
      selectedValue: [],
      YAuiGrid: null,
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
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
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.searchUrl = selectConfig.manage.log.smsLog.list.url;
      this.tryUrl = transactionConfig.manage.log.smsLog.try.url;

      let from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      let to = this.$comm.getToday();
      this.searchParam.searchDt = [from, to];

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004565'), // 발송일
          dataField: 'sendDt',
          width: '180',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001096'), // 발신자
          dataField: 'senderNm',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001099'), // 발신자번호
          dataField: 'senderPhoneNo',
          width: '150',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001690'), // 수신자
          dataField: 'receiverNm',
          width: '130',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001691'), // 수신자번호
          dataField: 'receiverPhoneNo',
          width: '150',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001013'), // 메시지내용
          dataField: 'contents',
          width: '500',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004566'), // 발송성공여부
          dataField: 'sendYnNm',
          width: '100',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004567'), // 실패사유
          dataField: 'failDesc',
          width: '200',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004568'), // 재시도수
          dataField: 'tryCount',
          width: '100',
          style: 'right-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004564'),
          color: 'blue',
          btnClicked: 'trySend',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    // 리스트 검색
    getList() {
      this.searchParam.fromDt = this.searchParam.searchDt[0];
      this.searchParam.toDt = this.searchParam.searchDt[1];
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectCheck(row, index) {
      if (row.sendYn === 'Y') return false;
      else return true;
    },
    trySend() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000001067', // 재전송할 데이터를 하나 이상 선택하세요
          type: 'warning',
        });
      } else {
        this.$http.url = this.tryUrl;
        this.$http.type = 'PUT';
        this.$http.param = this.selectedValue;
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message:
                'M0000001068 : ' +
                _result.data.successCount + // 재전송 성공
                ', M0000001069 : ' +
                _result.data.failCount, // 재전송 실패
              type: 'success',
            });
            this.getList();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
