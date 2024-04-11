<!--
  목적 : 폐기물-폐기물 처리요청
  작성자 : khk
  Detail : 폐기물-폐기물 처리요청 조회
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
          <!-- 요청일 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002055"
            name="reqYmdPeriod"
            default="searchParam.reqYmdPeriod"
            v-model="searchParam.reqYmdPeriod"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 처리상태 -->
          <y-select
            :width="8"
            :comboItems="ewstDispoStCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="ewstDispoStCd"
            label="L0000002830"
            v-model="searchParam.ewstDispoStCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 요청부서 -->
          <y-tree-dept
            v-if="deptAble"
            type="search"
            label="L0000002053"
            :showAllDept="true"
            name="rqstDeptCd"
            v-model="searchParam.rqstDeptCd"
          />
          <y-tree-dept
            v-else
            type="search"
            disabled="true"
            label="L0000002053"
            :showAllDept="true"
            name="rqstDeptCd"
            v-model="searchParam.rqstDeptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 폐기물 분류 -->
          <y-select
            :width="8"
            :comboItems="ewstClassCdItemsEdit"
            itemText="ewstClassNm"
            itemValue="ewstClassCd"
            ui="bootstrap"
            type="search"
            name="ewstClassCd"
            label="L0000003106"
            v-model="searchParam.ewstClassCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 폐기물 -->
          <y-select
            :width="8"
            :comboItems="ewstWasteCdItemsEdit"
            itemText="ewstWasteNm"
            itemValue="ewstWasteNo"
            ui="bootstrap"
            type="search"
            name="ewstWasteNo"
            label="L0000003102"
            v-model="searchParam.ewstWasteNo"
          ></y-select>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003116')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked"
          @openPopup="openPopup"
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
  /** attributes: name, components, props, data **/
  name: 'dispo-request',
  props: {},
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        plantCd: '',
        reqYmdPeriod: [],
        ewstDispoStCd: '',
        rqstDeptCd: '',
        reqYmdFrom: null,
        reqYmdTo: null,
        ewstClassCd: '',
        ewstWasteNo: '',
      },
      gridOptions: {
        name: 'dispoRequest',
        header: [],
        data: [],
        btns: [],
        height: '350',
      },
      editable: true,
      ewstDispoStCdItems: [], // 처리상태
      ewstClassCdItemsEdit: [], // 폐기물 분류
      ewstWasteCdItemsEdit: [], // 폐기물
      searchUrl: '',
      deptAble: false,
      YAuiGrid: null,
    };
  },
  computed: {},
  watch: {
    'searchParam.plantCd'() {
      this.getEwstWasteCdItems(
        this.searchParam.plantCd,
        this.searchParam.ewstClassCd
      );
    },
    'searchParam.ewstClassCd'() {
      this.getEwstWasteCdItems(
        this.searchParam.plantCd,
        this.searchParam.ewstClassCd
      );
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
    this.searchParam.reqYmdPeriod.push(
      this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      )
    );
    this.searchParam.reqYmdPeriod.push(
      this.$comm.moment().format('YYYY-MM-DD')
    );
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  beforeDestroy() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl =
        selectConfig.env.waste.operationLog.disposalRequest.list.url;

      this.getEwstWasteCdItems(
        this.searchParam.plantCd,
        this.searchParam.ewstClassCd
      );

      this.getEwstClassCdItems();

      // 처리상태
      this.$comm.getComboItems('EWST_DISPO_ST', true).then((_result) => {
        this.ewstDispoStCdItems = _result;
      });

      let userAuthGrps = this.$_.filter(this.$store.getters.userAuthGrps, {
        settingYn: 'Y',
      });
      if (userAuthGrps && userAuthGrps.length > 0) {
        this.$_.forEach(userAuthGrps, (item) => {
          if (
            String(item.authGrpNo) === '2' ||
            String(item.authGrpNo) === '1090'
          ) {
            this.searchAuth = true;
          }
        });
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '110',
          style: 'center-align',
        },
        // 폐기물분류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003120'),
          dataField: 'ewstClassNm',
          width: '160',
          style: 'center-align',
        },
        // 폐기물
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003102'),
          dataField: 'ewstWasteNm',
          width: '160',
          style: 'left-align grid-link-cell',
        },
        // 요청일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002055'),
          dataField: 'reqYmd',
          width: '120',
          style: 'center-align',
        },
        // 요청부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002053'),
          dataField: 'reqDeptNm',
          width: '120',
          style: 'center-align',
        },
        // 요청자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002057'),
          dataField: 'reqUserNm',
          width: '120',
          style: 'center-align',
        },
        // 처리상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002830'),
          dataField: 'ewstDispoStNm',
          width: '100',
          style: 'center-align',
        },
        // 발생량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001075'),
          dataField: 'amtGenList',
          width: '100',
          style: 'right-align',
        },
        // 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'envUnitNm',
          width: '120',
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
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openPopup',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      if (
        this.$store.getters.deptAuthGrp &&
        this.$store.getters.deptAuthGrp.deptAccessYn === 'Y'
      ) {
        this.deptAble = true;
      }

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    getEwstClassCdItems() {
      this.$http.url = selectConfig.env.waste.baseInfo.wasteClass.list.url;
      this.$http.type = 'GET';
      this.$http.param = { useYn: 'Y' };
      this.$http.request(
        (_result) => {
          this.ewstClassCdItemsEdit = this.$_.clone(_result.data);
          this.ewstClassCdItemsEdit.splice(0, 0, {
            ewstClassCd: null,
            ewstClassNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEwstWasteCdItems(plantCd, ewstClassCd) {
      this.$http.url = selectConfig.env.waste.baseInfo.waste.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: plantCd,
        ewstClassCd: ewstClassCd,
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.ewstWasteCdItemsEdit = _result.data;
          this.ewstWasteCdItemsEdit.splice(0, 0, {
            ewstWasteNo: null,
            ewstWasteNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      if (!this.searchAuth) {
        this.searchParam.userId = this.$store.getters.token;
        this.searchParam.rqstDeptCd = this.$store.getters.deptCd;
      } else {
        this.searchParam.userId = '';
      }
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
    tableLinkClicked(data) {
      if (data === null) return;
      if (data.dataField === 'ewstWasteNm') {
        this.openPopup(data.item);
      }
    },
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./dispoRequestDetail.vue'}`);
      this.popupOptions.title = 'L0000003117'; // '폐기물 처리요청 상세 등록/수정';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        ewstDispoReqNo: data ? data.ewstDispoReqNo : 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnSearchClickedCallback(result) {
      this.getList();
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
