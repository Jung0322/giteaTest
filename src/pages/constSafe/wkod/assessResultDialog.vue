<!--
  목적 : 위험성평가 실행
  Detail : 위험성평가 실행 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 평가년도 -->
          <y-datepicker
            :width="8"
            :range="true"
            type="year"
            label="L0000003065"
            name="assessYear"
            :default="searchParam.assessYear"
            v-model="searchParam.assessYear"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 정기/수시 -->
          <y-select
            :width="8"
            :comboItems="comboRegRegdemItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002596"
            name="regRegdem"
            v-model="searchParam.regRegdem"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 평가명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003081"
            name="assessNm"
            v-model="searchParam.assessNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003045')"
          :useExcelExport="false"
          @cellClick="cellClickHandler"
          @cellDoubleClick="cellDoubleClickHandler"
          @btnSelect="closePopup('SAVE')"
          @btnSearch="getList"
          @btnClose="closePopup('CLOSE')"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';

export default {
  /* attributes: name, components, props, data */
  name: 'assess-action',
  props: {},
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '1100px',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        assessStatus: 'C',
        assessYear: [],
        regRegdem: null,
        assessTypeCd: '',
        assessNm: '',
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: 300,
      },
      component: null,
      selectRowData: {
        assessPlanNo: 0,
        assessNm: '',
      },
      comboRegRegdemItems: [],
      // comboAssessStatusItems: [],
      searchUrl: '',
    };
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
  beforeDestroy() {
  },
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = selectConfig.rsa.assessPlan.list.url;
      const year = this.$comm.getToday().substring(0, 4);
      this.searchParam.assessYear = [year, year];
      
      this.$comm.getComboItems('RSA_REG_REGDEM', false).then(_result => {
        this.comboRegRegdemItems = _result;
      });
      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'), 
          dataField: 'assessStatusNm', 
          width: '100', 
        }, // 진행상태 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003065'), 
          dataField: 'assessYear', 
          width: '100', 
        }, // 평가년도 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002596'), 
          dataField: 'regRegdemNm', 
          width: '100', 
        }, // 정기/수시 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003089'), 
          dataField: 'assessTypeChecks', 
          width: '140', 
        }, // 평가유형 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'), 
          dataField: 'assessNm', 
          width: '40%', 
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {}, 
          },
        }, // 평가명 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001778'), 
          dataField: 'assessStartDate', 
          width: '120', 
        }, // 시작일 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002705'), 
          dataField: 'assessEndDate', 
          width: '120', 
        }, // 종료일 
      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000001561'), 
          color: 'orange', 
          btnClicked: 'btnSelect',
        },  //  선택
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green', 
          btnClicked: 'btnSearch',
        },  //  검색
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), 
          btnClicked: 'btnClose',
        },  //  닫기
      ];
      
    },
    getList() {
      this.searchParam.assessTypeCd = 'AT002';

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.YAuiGrid.setGridData(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      this.selectRowData.assessPlanNo = event.item.assessPlanNo;
      this.selectRowData.assessNm = event.item.assessNm;

      if (event.dataField === 'assessNm') {
        this.openDialogPage(event.item); 
      }
    },
    cellDoubleClickHandler(event) {
      this.cellClickHandler(event);

      this.$emit('closePopup', this.selectRowData);
    },
    openDialogPage(data) {
      this.popupOptions.param = {
        assessPlanNo: data.assessPlanNo,
        deptCd: data.deptCd,
        deptNm: data.deptNm,
        assessNm: data.assessNm,
        processCd: data.processCd,
        processNm: data.processNm,
        totalDivision: 'PROCESS',
      };
      this.popupOptions.target = () =>
        import(`${'@/pages/rsa/jsa/assessTotal/assessTotalJSADialog.vue'}`);
      this.popupOptions.title = 'L0000003050'; // 평가결과집계 상세

      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeSndPopup;
    },
    closeSndPopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    closePopup(data) {
      if (data === 'SAVE') {
        this.$emit('closePopup', this.selectRowData);
      } else {
        this.$emit('closePopup', '');
      }
    },
    /**
     * 사용자의 입력을 받는다.
     */
    getConfirm() {},
    /** button 관련 이벤트 **/
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>