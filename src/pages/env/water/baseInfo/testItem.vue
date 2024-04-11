<!--
  목적 : 검사항목 관리
  작성자 : kkc (2021-02-16 수정 etg)
  Detail : 검사항목 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            v-if="!popupParam.popupMode"
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
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000325"
            name="ewtrTestItemNm"
            v-model="searchParam.ewtrTestItemNm"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000321')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :showRowCheckColumn="this.popupParam.popupMode"
          @cellClick="tableLinkClicked"
          @btnSelect="btnSelect"
          @btnClose="btnClose"
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
  name: 'test-item',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return { testitem: [], popupMode: false };
      },
    },
  },
  data() {
    return {
      gridOptions: {
        selectValue: [],
        name: 'testItem',
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
      searchParam: {
        plantCd: '',
        useYn: 'Y',
        ewtrTestItemNm: '',
      },
      useItems: [],
      selectTestItem: null,
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
      this.editable = this.$route.meta.editable;

      this.useItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];

      // 그리드 헤더 설정
      if (this.popupParam.popupMode) {
        this.gridOptions.header = [
          // 사업장
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
            dataField: 'plantNm',
            width: '25%',
            style: 'center-align',
          },
          // 검사항목명
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000325'),
            dataField: 'ewtrTestItemNm',
            width: '25%',
            style: 'left-align',
          },
          // 단위
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
            dataField: 'envUnitNm',
            width: '25%',
            style: 'center-align',
          },
          // 비고
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'remark',
            width: '25%',
            style: 'left-align',
          },
        ];
      } else {
        this.gridOptions.header = [
          // 사업장
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
            dataField: 'plantNm',
            width: '14%',
            style: 'center-align',
          },
          // 검사항목명
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000325'),
            dataField: 'ewtrTestItemNm',
            width: '15%',
            style: 'left-align grid-link-cell',
          },
          // 단위
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
            dataField: 'envUnitNm',
            width: '14%',
            style: 'center-align',
          },
          // 비고
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'remark',
            width: '15%',
            style: 'left-align',
          },
          // 사용여부
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
            dataField: 'useYnNm',
            width: '14%',
            style: 'center-align',
          },
          // 작성자
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
            dataField: 'writerUserNm',
            width: '14%',
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
      }
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
          visible: !this.popupParam.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnSelect',
          visible: this.popupParam.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          color: 'gray',
          btnClicked: 'btnClose',
          visible: this.popupParam.popupMode,
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
      this.$http.url = selectConfig.env.water.baseInfo.testItem.list.url;
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
    rowDoubleClicked(data) {
      if (!this.popupParam.popupMode) return;
      this.closePopup(data);
    },
    tableLinkClicked(data) {
      if (!data) return;
      if (data.dataField === 'ewtrTestItemNm') {
        this.btnPopupClickedCallback(data.item);
      }
    },
    btnPopupClickedCallback(data) {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./testItemDetail.vue'}`);
      this.popupOptions.title = 'L0000000323'; // '검사항목 상세 등록/수정';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        ewtrTestItemCd: data ? data.ewtrTestItemCd : 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    btnSelect() {
      this.closePopup(this.YAuiGrid.getCheckedRowItemsAll());
    },
    btnClose() {
      this.closePopup('C');
    },
    closePopup(data) {
      this.$emit('closePopup', { data });
    },
    btnAdd() {
      if (this.gridOptions.selectValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000385', // '검사항목을 선택하세요.',
          type: 'warning',
        });
      } else this.closePopup(this.gridOptions.selectValue);
    },
    closePopupUsage() {
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
