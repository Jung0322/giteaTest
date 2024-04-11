<!--
  목적 : 환경 > 대기 > 시설관리 > 배출시설
  작성자 : psb
  Detail : 대기 배출시설 조회
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
          <!-- 관리부서 -->
          <y-tree-dept
            type="search"
            label="L0000000591"
            name="mgDeptCd"
            v-model="searchParam.mgDeptCd"
            :plantCd="searchParam.plantCd"
          />
        </b-col>

        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 배출시설명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001174"
            name="eairDischFacNm"
            v-model="searchParam.eairDischFacNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001439"
            name="useYn"
            v-model="searchParam.useYn"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!--<b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            -- 신규등록 --
            <y-btn
              v-if="editable && !popupParam.popupMode"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
            -- 선택 --
            <y-btn
              v-if="popupParam.popupMode"
              title="L0000001561"
              color="orange"
              @btnClicked="btnAdd"
            />
            -- 검색 --
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
            -- 닫기 --
            <y-btn
              title="L0000000881"
              v-if="popupParam.popupMode"
              @btnClicked="btnClosePopup"
            />
          </div>
          -- 배출시설 목록 --
          <y-data-table
            ref="dataTable"
            label="L0000001170"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
            @selectedRow="selectedRow"
            @rowDoubleClicked="rowDoubleClicked"
          />
        </b-col>
      </b-col>
    </b-row>-->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000321')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked"
          @cellDoubleClick="cellDoubleClickHandler"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @closePopup="btnClosePopup"
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
  name: 'discharge',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          popupMode: false,
        };
      },
    },
  },
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
        eairDischFacNm: '',
        mgDeptCd: '',
        plantCd: '',
        useYn: 'Y',
      },
      gridOptions: {
        name: 'discharge',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },
      editable: false,
      searchUrl: '',
      selectedData: null,
      useItems: [],
      YAuiGrid: null,
    };
  },
  watch: {},
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
  },
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.env.air.facility.dischargeN.list.url;

      this.useItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '11%',
          style: 'center-align',
        },
        // 배출시설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001174'),
          dataField: 'eairDischFacNm',
          width: '15%',
          style: !this.popupParam.popupMode
            ? 'left-align grid-link-cell'
            : 'left-align',
        },
        // 관리부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'mgDeptNm',
          width: '11%',
          style: 'center-align',
        },

        // 관리번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000590'),
          dataField: 'mgrNum',
          width: '11%',
          style: 'left-align',
        },
        // 용량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002061'),
          dataField: 'vol',
          width: '11%',
          style: 'center-align',
        },
        // 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'unitNm',
          width: '7%',
          style: 'left-align',
        },
        // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '11%',
          style: 'center-align',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '11%',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '12%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
          visible: !this.popupParam.popupMode,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
          visible: true,
        }, // 검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
          visible: this.popupParam.popupMode,
        }, //  닫기
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList();
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
    tableLinkClicked(data) {
      if (!data) return;
      if (data.dataField === 'eairDischFacNm' && !this.popupParam.popupMode) {
        this.btnPopupClickedCallback(data.item);
      }
    },
    btnPopupClickedCallback(data) {
      this.popupOptions.target = () => import(`${'./dischargeDetail.vue'}`);
      this.popupOptions.title = 'L0000001172'; // '배출시설 상세 등록/수정';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        eairDischFacNo: data ? data.eairDischFacNo : 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;
      this.ewtrWasteDischFac.safFacilityCd = data[0].facilityMgrNum;
    },
    selectedRow(data) {
      if (this.popupParam.popupMode) {
        this.selectedData = this.$_.clone(data);
      }
    },
    cellDoubleClickHandler(data) {
      if (!this.popupParam.popupMode) {
        return;
      }
      this.btnClosePopup(data);
    },
    btnAdd() {
      if (!this.selectedData) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000311', // '배출시설을 선택하세요',
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.btnClosePopup(this.selectedData);
      }
    },
    btnClosePopup(data) {
      this.$emit('closePopup', data);
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
