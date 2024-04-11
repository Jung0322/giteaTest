<!--
  목적 : 원료 관리
  작성자 : kkc (2021-02-16 수정 etg)
  Detail : 원료 조회
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
          <!-- 원료명 -->
          <y-text
            :width="8"
            label="L0000002088"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002081')"
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
  name: 'ingredient',
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
        name: 'ingredient',
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
      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.popupParam.plantCd;
      }

      this.editable = this.$route.meta.editable;
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
          width: '17%',
          style: 'center-align',
        },
        // 원료명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002088'),
          dataField: 'ewtrIngrNm',
          width: '17%',
          style: 'left-align grid-link-cell',
        },
        // 비고
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '17%',
          style: 'left-align',
        },
        // 작성자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '17%',
          style: 'center-align',
        },
        // 작성일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '17%',
          style: 'center-align',
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
      if (!this.popupParam.popMode) {
        this.gridOptions.header.push({
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '15%',
          style: 'center-align',
        }); // 사용여부
      }
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList();
    },
    getList() {
      this.$http.url = selectConfig.env.water.baseInfo.ingredient.list.url;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
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
      if (data === null || this.popupParam.popMode) return;
      if (data.dataField === 'ewtrIngrNm') {
        this.btnPopupClickedCallback(data.item);
      }
    },
    btnPopupClickedCallback(data) {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./ingredientDetail.vue'}`);
      this.popupOptions.title = 'L0000002083'; // '원료 상세 등록/수정';
      this.popupOptions.visible = true;
      this.popupOptions.param = data ? data : { ewtrIngrNo: 0 };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnSelect() {
      this.closePopup('SAVE');
    },
    closePopup(data) {
      // if (data === 'SAVE') data = this.checkItem;
      if (data === 'SAVE') {
        data = this.YAuiGrid.getCheckedRowItemsAll();
        this.$emit('closePopup', data, 'ingredient');
      } else {
        this.$emit('closePopup', {});
      }
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
