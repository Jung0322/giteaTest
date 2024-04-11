<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 배출시설구분 -->
          <y-select
            :width="8"
            :comboItems="disClsItems"
            itemText="codeNm"
            itemValue="code"
            label="L0000004480"
            ui="bootstrap"
            name="disClsCd"
            v-model="searchParam.disClsCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 배출시설코드명 -->
          <y-text
            :width="8"
            label="L0000001180"
            ui="bootstrap"
            name="disFacNm"
            v-model="searchParam.disFacNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
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
      </b-row>
    </y-search-box>

    <!-- 온실가스 배출시설분류 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004479')"
          :enableCellMerge="true"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="tableLinkClicked"
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
  name: 'y-discharge-fac-master',
  props: {},

  data() {
    return {
      searchParam: {
        disFacNm: '',
        disClsCd: '',
        useYn: 'Y',
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
      gridOptions: {
        name: 'dischargeFacMaster',
        btns: [],
        header: [],
        data: [],
        height: '400',
        merge: [],
      },
      searchUrl: '',
      disClsItems: [], // 배출시설구분 리스트
      useItems: [],
      editable: false,
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

      this.searchUrl = selectConfig.env.gas.baseInfo.disFac.list.url;

      this.useItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];

      // 배출활동구분
      this.$comm.getComboItems('GHG_DISCH_TYPE', true).then((_result) => {
        this.disClsItems = _result;
      });

      // grid header 설정
      this.getHeaders();
      this.gridOptions.btns = [
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
      // grid 목록
      this.getDataList();
    },
    getHeaders() {
      this.gridOptions.merge = [];
      this.gridOptions.merge.push({ index: 0, field: 'disClsCd' });

      this.gridOptions.header = [];
      this.gridOptions.header.push(
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004480'),
          dataField: 'disClsCd',
          width: '14%',
          style: 'center-align',
          cellMerge: true,
        }, // 배출시설구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001177'),
          dataField: 'disFacCd',
          width: '15%',
          style: 'center-align',
        }, // 배출시설분류코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004479'),
          dataField: 'disFacNm',
          width: '15%',
          style: 'left-align grid-link-cell',
        }, // 온실가스 배출시설분류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYn',
          width: '14%',
          style: 'center-align',
        }, // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '14%',
          style: 'right-align',
        }, // 정렬순서
        {
          // 작성자
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '14%',
          style: 'center-align',
        },
        {
          // 작성일
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '14%',
          style: 'center-align',
        }
      );
    },
    // grid 목록 불러오기
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnSearchClickedCallback() {
      this.getDataList();
    },
    // 신규등록 팝업
    btnPopupClickedCallback(data) {
      this.popupOptions.target = () => import(`${'./dischargeFacDetail.vue'}`);
      this.popupOptions.title = 'L0000004479'; // 온실가스 배출시설분류
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        disFacCd: data ? data.disFacCd : null,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    // 수정 팝업
    tableLinkClicked(data) {
      if (!data) return;
      if (data.dataField === 'disFacNm') {
        this.btnPopupClickedCallback(data.item);
      }
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
