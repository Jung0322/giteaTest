<!--
  목적 : 운영일지 검색
  작성자 : kkc (2021-02-18 수정 etg)
  Detail : 운영일지 목록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작성부서 -->
          <y-tree-dept
            type="search"
            label="L0000002348"
            name="deptCd"
            v-model="searchParam.deptCd"
            :plantCd="searchParam.plantCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작업기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002373"
            name="evalPeriod"
            default="searchParam.evalPeriod"
            v-model="searchParam.evalPeriod"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 클린센터 -->
          <y-select
            :width="8"
            :editable="editable"
            :comboItems="ewtrCleanFacItems"
            itemText="ewtrCleanFacNm"
            itemValue="ewtrCleanFacNo"
            ui="bootstrap"
            label="L0000002988"
            v-model="searchParam.ewtrCleanFacNo"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 진행상태 -->
          <y-select
            :width="8"
            :comboItems="envOpLogStCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002779"
            name="envOpLogStCd"
            v-model="searchParam.envOpLogStCd"
          ></y-select>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002075')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
          @btnSearchClickedCallback="btnSearchClickedCallback"
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
  name: 'op-log',
  components: {},
  props: {},
  data() {
    return {
      gridOptions: {
        name: 'opLog',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },
      searchParam: {
        evalPeriod: [],
        ewtrCleanFacNo: null,
        plantCd: '',
        deptCd: '',
        envOpLogStCd: '',
        deptSubYn: 'Y', // 하위부서여부 사용
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
      editable: true,
      measureYmd: '',
      searchUrl: '',
      ewtrCleanFacItems: [], // 클린센터
      envOpLogStCdItems: [],
      YAuiGrid: null,
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  watch: {
    'searchParam.plantCd'() {
      this.getCleanItems();
      this.searchParam.ewtrCleanFacNo = null;
    },
  },
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
    /** 초기화 관련 함수 **/
    init() {
      this.$comm.getComboItems('SAF_PROCESS_STEP', true).then((_result) => {
        this.envOpLogStCdItems = _result;
      });

      this.editable = this.$route.meta.editable;

      this.searchParam.evalPeriod.push(
        this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '-7d',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        )
      );
      this.searchParam.evalPeriod.push(
        this.$comm.moment().format('YYYY-MM-DD')
      );

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 진행상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'),
          dataField: 'envOpLogStNm',
          width: '10%',
          style: 'grid-link-cell',
        },
        // 결재상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000428'),
          dataField: 'bizApprStepNm',
          width: '10%',
          style: 'grid-link-cell',
        },
        // 작성일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002354'),
          dataField: 'measureYmd',
          width: '15%',
          style: 'center-align',
        },
        // 작성부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002348'),
          dataField: 'deptNm',
          width: '15%',
          style: 'center-align',
        },

        // 클린센터
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002988'),
          dataField: 'ewtrCleanFacNm',
          width: '20%',
          style: 'center-align',
        },
        // 날씨
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000803'),
          dataField: 'weatherNm',
          width: '10%',
          style: 'center-align',
        },
        // 온도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002028'),
          dataField: 'temp',
          width: '10%',
          style: 'center-align',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '120',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '120',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      this.searchUrl = selectConfig.env.water.operationLog.dailyReport.list.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getCleanItems();
      this.getList();
    },
    getCleanItems() {
      this.$http.url = selectConfig.env.water.facility.wasteBasicUnit.list.url;
      this.$http.type = 'GET';
      this.$http.param = { plantCd: this.searchParam.plantCd };
      this.$http.request(
        (_result) => {
          this.ewtrCleanFacItems = this.$_.clone(_result.data);
          this.ewtrCleanFacItems.splice(0, 0, {
            ewtrCleanFacNo: null,
            ewtrCleanFacNm:
              this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
          });

          if (
            this.$_.findIndex(this.ewtrCleanFacItems, {
              ewtrCleanFacNo: this.searchParam.ewtrCleanFacNo,
            }) === -1
          ) {
            this.searchParam.ewtrCleanFacNo = null;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
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
    cellClickHandler(event) {
      console.log(event.item);
      if (event.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'envOpLogStNm') {
        this.openPopup(event.item);
      }
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.apprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./operationLogBase.vue'}`);
      this.popupOptions.title = 'L0000001701'; // '수질 운영일지';
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        ewtrCleanFacNo: data ? data.ewtrCleanFacNo : 0,
        ewtrCleanFacNm: data ? data.ewtrCleanFacNm : 0,
        measureYmd: data ? data.measureYmd : null,
        plantCd: data ? data.plantCd : null,
        deptCd: data ? data.deptCd : null,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },

    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    btnSearchClickedCallback(result) {
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 370;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
