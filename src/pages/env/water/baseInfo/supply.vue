<!--
  목적 : 공급수 관리
  작성자 : kkc (수정 2021-02-16 etg)
  Detail : 공급수 조회
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
            :disabled="popupParam.popMode"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>
        <b-col
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
          v-if="!popupParam.popMode"
        >
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            label="L0000001439"
            ui="bootstrap"
            name="useYn"
            v-model="searchParam.useYn"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 공급수명 -->
          <y-text
            :width="8"
            label="L0000000494"
            ui="bootstrap"
            name="title"
            v-model="searchParam.title"
          />
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000488')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :showRowCheckColumn="this.popupParam.popMode"
          @cellClick="tableLinkClicked"
          @btnSelect="btnSelect"
          @closePopup="closePopup"
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
export default {
  /* attributes: name, components, props, data */
  name: 'supply',
  props: {
    popupParam: {
      type: Object,
      default: () => {
        return {
          plantCd: null,
          popMode: false,
        };
      },
    },
  },
  data() {
    return {
      checkItem: [],
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
        name: 'supply',
        header: [],
        data: [],
        btns: [],
        height: 400,
      },
      searchParam: {
        plantCd: '',
        useYn: 'Y',
        title: '',
      },
      useItems: [],
      editable: true,
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
    /** 초기화 관련 함수 **/
    init() {
      console.log('111', this.popupParam.popMode);
      this.editable = this.$route.meta.editable;
      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.popupParam.plantCd;
      }
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
          width: '10%',
          style: 'center-align',
        },
        // 공급수 분류명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000489'),
          dataField: 'ewtrSuplClassNm',
          width: '21%',
          style: 'left-align',
        },
        // 공급수명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000494'),
          dataField: 'ewtrSuplNm',
          width: '21%',
          style: 'left-align grid-link-cell',
        },
        // 비고
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '16%',
          style: 'left-align',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '16%',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '16%',
          style: 'center-align',
        },
        // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '10%',
          style: 'center-align',
          visible: !this.popupParam.popMode,
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
          visible: !this.popupParam.popMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnSelect',
          visible: this.popupParam.popMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
          visible: this.popupParam.popMode,
        }, // 닫기
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList();
    },
    getList() {
      this.$http.url = selectConfig.env.water.baseInfo.supply.list.url;
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
      if (!data || this.popupParam.popMode) return;
      if (data.dataField === 'ewtrSuplNm') {
        this.btnPopupClickedCallback(data.item);
      }
    },
    btnPopupClickedCallback(data) {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./supplyDetail.vue'}`);
      this.popupOptions.title = 'L0000000493'; // '공급수 상세 등록/수정';
      this.popupOptions.visible = true;
      this.popupOptions.param = { ewtrSuplNo: data ? data.ewtrSuplNo : 0 };

      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnSelect() {
      this.closePopup('SAVE');
    },
    closePopup(data) {
      if (data === 'SAVE') {
        data = this.YAuiGrid.getCheckedRowItemsAll();
        this.$emit('closePopup', data, 'supply');
      } else {
        this.$emit('closePopup', {});
      }
    },
    btnSearchClickedCallback(result) {
      this.getList();
    },
    /** end button 관련 이벤트 **/
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
