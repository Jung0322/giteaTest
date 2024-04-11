<!--
  목적 : 환경 > 대기 > 기준정보 > 배출구
  작성자 : jkl
  Detail : 
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
        <b-col
          v-if="!popupParam.isPopup"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
        >
          <!-- 배출구일련번호 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001150"
            name="eairOutletNm"
            v-model="searchParam.eairOutletNm"
          />
        </b-col>
        <b-col
          v-if="!popupParam.isPopup"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
        >
          <!-- 배출구명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001147"
            name="mainDischFacNm"
            v-model="searchParam.mainDischFacNm"
          />
        </b-col>
        <b-col
          v-if="!popupParam.isPopup"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
        >
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
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001143')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked"
          @btnPopupInsertClicked="btnPopupInsertClicked"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>

    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'outlet',
  props: {
    popupParam: {
      type: Object,
      default() {
        return {
          plantCd: '',
          isPopup: false,
        };
      },
    },
  },
  data() {
    return {
      searchParam: {
        eairOutletNm: '',
        mainDischFacNm: '',
        mgDeptCd: '',
        plantCd: '',
        useYn: 'Y',
      },
      gridOptions: {
        name: 'outlet',
        header: [],
        data: [],
        btns: [],
        height: 400,
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
      editable: false,
      searchUrl: '',
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
    this.getList();
  },
  beforeDestroy() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.env.air.baseInfo.outletN.list.url;

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
          width: '7%',
          style: 'center-align',
        },
        // 관리부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'mgDeptNm',
          width: '10%',
          style: 'center-align',
        },

        // 배출구명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001147'),
          dataField: 'mainDischFacNm',
          width: '13%',
          style: this.popupParam.isPopup
            ? 'left-align'
            : 'left-align grid-link-cell',
        },
        // 배출구일련번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001150'),
          dataField: 'eairOutletNm',
          width: '10%',
          style: 'right-align',
        },
        // 배출구허가증상배출구번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001152'),
          dataField: 'eairOutletPermitNo',
          width: '13%',
          style: 'right-align',
        },
        // 측정횟수
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002965'),
          dataField: 'airPerdNm',
          width: '10%',
          style: 'center-align',
        },
        // 대기 총량제 대상여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004794'),
          dataField: 'airtotTargetYn',
          width: '10%',
          style: 'center-align',
        },
        // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '7%',
          style: 'center-align',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupInsertClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
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
      if (data.dataField === 'mainDischFacNm') {
        this.btnPopupInsertClicked(data.item);
      }
    },
    btnPopupInsertClicked(data) {
      this.popupOptions.target = () => import(`${'./outletDetail.vue'}`);
      this.popupOptions.title = 'L0000004418'; // 배출구 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        eairOutletNo: data ? data.eairOutletNo : 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    selectedRow(data) {
      if (data === null) return;
      if (this.popupParam.isPopup) {
        this.selectRow = this.$_.clone(data);
      }
    },
    rowDoubleClicked(data) {
      if (this.popupParam.isPopup) {
        this.btnClosePopup(data);
      }
    },
    btnSelect() {
      if (this.selectRow) {
        this.btnClosePopup(this.selectRow);
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000301', // '선택된 배출구가 없습니다. 배출구를 선택하세요',
          type: 'warning',
        });
      }
    },
    btnClosePopup(data) {
      if (!data) {
        data = 'CLOSE';
      }
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
