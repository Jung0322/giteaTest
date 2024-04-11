<!--
  목적 : 공사안전 > 일일작업출입자 목록
  Detail : 일일작업출입자 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 작업기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002373"
            name="workYmd"
            :default="searchParam.workYmd"
            v-model="searchParam.workYmd"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 허가서구분 -->
          <y-select
            :width="8"
            :comboItems="comboWkodTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000003233"
            name="wkodClsCd"
            v-model="searchParam.wkodClsCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 신청부서 -->
          <y-tree-dept
            label="L0000001798"
            type="search"
            name="reqDeptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.reqDeptCd"
            :deptSubYn="searchParam.reqDeptSubYn"
            @setDeptSubYn="setReqDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 사용/운전부서 -->
          <y-tree-dept
            label="L0000001442"
            type="search"
            name="pubDeptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.pubDeptCd"
            :deptSubYn="searchParam.pubDeptSubYn"
            @setDeptSubYn="setPubDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 검색어 -->
          <!-- 작업명, 작업회사명, 공사명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000331"
            placeholder="L0000002390"
            name="keyword"
            v-model="searchParam.keyword"
          ></y-text>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 작업구분 -->
          <y-multi-select
            :width="8"
            :comboItems="comboWkodKindItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002368"
            name="wkodKindCdTemps"
            v-model="searchParam.wkodKindCdTemps"
          ></y-multi-select>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002269')"
          :useExcelExport="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @btnSearch="getList"
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
  name: 'const-worker-list',
  props: {},
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        workYmd: [],
        reqDeptCd: '',
        wkodKindCdTemps: [],
        wkodKindCds: [],
        pubDeptCd: '',
        plantCd: '',
        wkodStepCd: 'WKS99',
        wkodClsCd: '',
        vendorNm: '',
        keyword: '',
        reqDeptSubYn: 'Y',
        pubDeptSubYn: 'Y',
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '380',
      },
      editable: true,
      comboWkodKindItems: [],
      comboWkodTypeItems: [],
      searchUrl: '',
    };
  },
  watch: {},
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
  beforeDestroy() {
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.wkodMaster.list.url;
      this.searchParam.reqDeptSubYn = 'Y';
      this.searchParam.pubDeptSubYn = 'Y';

      const date = this.$comm.getCalculatedDate(this.$comm.getToday(), '-7d', 'YYYY-MM-DD', 'YYYY-MM-DD');
      this.searchParam.workYmd = [date, date];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '100', 
        }, // 사업장 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000503'), 
          dataField: 'constTitle', 
          style: 'left-align',
          width: '200', 
        }, // 공사명 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002411'), 
          dataField: 'workYmd', 
          width: '110', 
        }, // 작업일 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002426'), 
          dataField: 'wkodNum', 
          width: '120', 
        }, // 작업허가번호 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003233'), 
          dataField: 'wkodClsNm', 
          width: '110', 
        }, // 허가서구분 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002368'), 
          dataField: 'wkodKindNm', 
          width: '170', 
          style: 'left-align', 
        }, // 작업구분 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'), 
          dataField: 'workTitle', 
          width: '250',
          style: 'left-align',
        }, // 작업명 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002410'), 
          dataField: 'workerNumb', 
          width: '80', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {}, 
          },
        }, // 작업인원수 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000507'), 
          dataField: 'subconnNm', 
          width: '130', 
        }, // 공사업체 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002420'), 
          dataField: 'workArea', 
          width: '150', 
        }, // 작업장소 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001798'), 
          dataField: 'reqDeptNm', 
          width: '110', 
        }, // 신청부서 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001442'), 
          dataField: 'pubDeptNm', 
          width: '110', 
        }, // 사용/운전부서 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writerUserNm', 
          width: '90', 
        }, /* 작성자 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'writerDt', 
          width: '90', 
        }, /* 작성일 */ 
      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green', 
          btnClicked: 'btnSearch',
        },  // 검색 
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      // 허가서구분
      this.$comm.getComboItems('SAF_WKOD_WKKD', true).then(_result => {
        _result = this.$_.filter(_result, { attr3: 'STANDARD' });
        _result.unshift({ code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }); // 전체
        _result = this.$_.reject(_result, { codeNm: this.$comm.getLangSpecInfoLabel('L0000004663') }); // 보충작업
        this.comboWkodTypeItems = _result;
      });

      this.getComboAttrItems('SAF_WKOD_KIND'); // 작업구분
    },
    getComboAttrItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelectAttr.url,
        codeGroupCd,
        null,
        null,
        'STANDARD'
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.comboWkodKindItems = this.$_.clone(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      this.searchParam.wkodKindCds = this.$_.map(
        this.searchParam.wkodKindCdTemps,
        'code'
      );
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField !== 'workerNumb') return;

      this.popupOptions.target = () =>
        import(`${'./wkodPerson.vue'}`);
      this.popupOptions.title = 'L0000002416'; // 작업자정보
      this.popupOptions.param = {
        popupMode: true,
        wkodNo: event.item.wkodNo,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    searchVendor() {
      this.popupOptions.target = () =>
        import(`${'../../vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000001951'; // 업체
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        gubun: 'V',
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        this.searchParam.vendorNm = data.data.vendorNm;
      }
    },
    // 하위부서 포함 조회 관련 함수 추가
    setReqDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.reqDeptSubYn = _result;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setPubDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.pubDeptSubYn = _result;
    }, 
    resizeGrid() {
      let _height = window.innerHeight - 390;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },   
  },
};
</script>