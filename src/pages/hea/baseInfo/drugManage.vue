<!--
  목적 : 약품관리 - 약품관리
  작성자 : kckim
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDrugManages">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 약품명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            type="search"
            label="L0000001915"
            name="drugNm"
            v-model="searchParam.heaDrugNm"
          >
          </y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            ui="bootstrap"
            :comboItems="useYnItems"
            itemText="codeNm"
            itemValue="code"
            label="L0000001439"
            name="useYn"
            v-model="searchParam.useYn"
          >
          </y-select>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 테이블 목록 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 
            <y-btn
              v-if="editable&&!popupParam.popupMode"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getDrugManages"
            />
             선택 
            <y-btn
              v-if="editable&&popupParam.popupMode"
              title="L0000001561"
              color="orange"
              @btnClicked="selectDrugs"
            />
             닫기 
            <y-btn
              v-if="popupParam.popupMode"
              title="L0000000881"
              @btnClicked="closepopMode"
            />
          </div>
          - 약품 목록 
          <y-data-table
            label="L0000001916"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="gridOptions.selectedData"
            @tableLinkClicked="tableLinkClicked"
            :use-paging="true"
          >
            <el-table-column
              v-if="popupParam.popupMode"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001916')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="popupParam.popupMode"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @selectDrugs="selectDrugs"
          @getDrugManages="getDrugManages"
          @closepopMode="closepopMode"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'drug-manage',
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
      searchParam: {
        heaDrugNm: '', // 약품명
        useYn: 'Y', // 사용여부
      },
      gridOptions: {
        name: 'drugManage',
        btns: [],
        header: [],
        data: [],
        height: '550',
        selectedData: [],
      },
      YAuiGrid: null,
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
      useYnItems: [],
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
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
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001915'),
          dataField: 'heaDrugNm',
          width: '40%',
          style: 'left-align',
          renderer: {
            type: !this.popupParam.popupMode ? 'LinkRenderer' : '',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'unit',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDrugManages',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'selectDrugs',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closepopMode',
          visible: true,
        },
      ];
      this.useYnItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];

      this.searchUrl = selectConfig.hea.drugManage.list.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDrugManages();
    },
    /** /초기화 관련 함수 **/
    // 약품관리 조회
    resizeGrid() {
      let _height = window.innerHeight - 300;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    getDrugManages() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      // if (this.popupParam.popupMode) {
      //   this.$http.param = {
      //     useYn: 'Y',
      //   }
      // }
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          if (this.popupParam.popupMode) {
            this.gridOptions.btns[0].visible = false;
            this.gridOptions.btns[1].visible = true;
            this.gridOptions.btns[2].visible = true;
            this.gridOptions.btns[3].visible = true;
          } else {
            this.gridOptions.btns[0].visible = true;
            this.gridOptions.btns[1].visible = false;
            this.gridOptions.btns[2].visible = false;
            this.gridOptions.btns[3].visible = false;
          }
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (this.popupParam.popupMode) return;
      if (event.dataField !== 'heaDrugNm') return;
      this.popupOptions.target = () => import(`${'./drugManageDetail.vue'}`);
      this.popupOptions.title = 'L0000001919'; // 약품 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;

      this.popupOptions.closeCallback = this.closePopup;
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./drugManageDetail.vue'}`);
      this.popupOptions.title = 'L0000001919'; // 약품 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        heaDrugNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDrugManages();
    },
    selectDrugs() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length === 0 || !checkingData) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001037', // 약품을 하나 이상 선택해주세요
          type: 'warning',
        });
        return;
      }

      this.closepopMode(checkingData);
    },
    closepopMode(data) {
      this.$emit('closePopup', data);
    },
    /** /Button Event **/
  },
  /** /methods **/
};
</script>
