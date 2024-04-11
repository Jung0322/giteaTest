<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 대상년월 -->
          <y-datepicker
            :width="8"
            type="month"
            :range="true"
            name="actMonth"
            label="L0000004446"
            v-model="searchParam.actMonth"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작성상태 -->
          <y-select
            :width="8"
            :comboItems="stepCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002350"
            name="stepCd"
            v-model="searchParam.stepCd"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 활동량 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003341')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :showRowCheckColumn="true"
          @cellClick="tableLinkClicked"
          @btnCancelAllCompleteCallback="btnCancelAllCompleteCallback"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @btnSearchClickedCallback="btnSearchClickedCallback"
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
  name: 'y-act-data-master',
  props: {},

  data() {
    return {
      searchParam: {
        plantCd: '',
        actMonth: [],
        stepCd: '',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        name: 'actDataMaster',
        header: [],
        data: [],
        btns: [],
        height: 400,
        selectedValue: [],
      },
      searchUrl: '',
      editable: false,
      checkItemData: [],
      stepCdItems: [],
      YAuiGrid: null,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getDataList();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    // 초기화
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.env.gas.actData.list.url;
      this.$comm.getComboItems('GHG_STATUS', true).then((_result) => {
        this.stepCdItems = _result;
      });

      // grid header 설정
      this.gridOptions.header = [
        {
          // 사업장
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '12%',
          style: 'center-align',
        },
        {
          // 년월
          headerText: this.$comm.getLangSpecInfoLabel('L0000000835'),
          dataField: 'actMonth',
          width: '12%',
          style: 'center-align grid-link-cell',
        },
        {
          // 작성상태
          headerText: this.$comm.getLangSpecInfoLabel('L0000002350'),
          dataField: 'stepNm',
          width: '12%',
          style: 'center-align',
        },
        {
          // 배출시설 수
          headerText: this.$comm.getLangSpecInfoLabel('L0000004447'),
          dataField: 'ghgFcltCnt',
          width: '12%',
          style: 'center-align',
        },
        {
          // 활동자료 수
          headerText: this.$comm.getLangSpecInfoLabel('L0000004448'),
          dataField: 'ghgOutActCnt',
          width: '12%',
          style: 'center-align',
        },
        {
          // 작성일
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'createDt',
          width: '14%',
          style: 'center-align',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '12%',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '14%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000004576'),
          color: 'gray',
          btnClicked: 'btnCancelAllCompleteCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      // 기간 Setting
      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        this.$comm.getPrevYear(),
        '0m',
        'YYYY-MM',
        'YYYY-MM'
      );
      var to = this.$comm.getCalculatedDate(
        this.$comm.getPrevYear(),
        '11m',
        'YYYY-MM',
        'YYYY-MM'
      );
      this.searchParam.actMonth = [from, to];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      // grid 목록
      this.getDataList();
    },
    // grid 목록 불러오기
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnSearchClickedCallback() {
      this.getDataList();
    },
    btnCancelAllCompleteCallback() {
      if (this.YAuiGrid.getCheckedRowItems().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: '확정취소할 활동량이 선택되지 않았습니다.',
          type: 'warning',
        });
        return;
      }

      const selectedRows = this.YAuiGrid.getCheckedRowItems().map(
        (rows) => rows.item
      );
      let existsNotComplete =
        this.$_.findIndex(selectedRows, {
          stepNm: this.$comm.getLangSpecInfoLabel('L0000004649'), // 작성중
        }) !== -1;

      if (existsNotComplete) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'L0000005665', // '확정되지 않은 건이 존재합니다.',
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        let count = 0;
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'L0000005666', // '일괄확정취소하시겠습니까?', //
          type: 'info',
          confirmCallback: function () {
            this.$_.forEach(selectedRows, (item) => {
              item.updateUserId = this.$store.getters.token;
              item.updateUserNm = this.$store.getters.name;
              item.updateDeptCd = this.$store.getters.deptCd;
              item.updateDeptNm = this.$store.getters.deptNm;
              this.$http.url =
                transactionConfig.env.gas.actData.cancelComplete.url;
              this.$http.type = 'PUT';
              this.$http.param = item;
              this.$http.request(
                (_result) => {
                  count += 1;
                  if (selectedRows.length === count) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // '안내',
                      message: 'M0000000078', // '완료되었습니다.',
                      type: 'success',
                    });
                    this.getDataList();
                  }
                },
                (_error) => {
                  window.getApp.$emit('APP_REQUEST_ERROR', _error);
                  return;
                }
              );
            });
          }.bind(this),
        });
      }
    },
    selectedRow() {},
    rowDoubleClicked() {},
    // 신규등록 팝업
    btnPopupClickedCallback() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '90%';
      this.popupOptions.target = () => import(`${'./actDataDetail.vue'}`);
      this.popupOptions.title = 'L0000003342'; // 활동량 등록
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        plantCd: this.searchParam.plantCd,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },

    // 수정 팝업
    tableLinkClicked(data) {
      if (
        data === null ||
        data === undefined ||
        data.dataField !== 'actMonth'
      ) {
        return;
      }

      this.popupOptions.top = '10px';
      this.popupOptions.width = '90%';
      this.popupOptions.target = () => import(`${'./actDataDetail.vue'}`);
      this.popupOptions.title = 'L0000003342'; // 활동량 등록
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        actDaRptNo: data.item.actDaRptNo,
        plantCd: data.item.plantCd,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
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

<style></style>
