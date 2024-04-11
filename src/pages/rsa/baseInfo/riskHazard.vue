<!--
  목적 : 위험성평가 > 기준정보 > 유해위험요인 관리
  작성자 : kga
  Detail : 유해위험요인 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 유해위험요인 분류 -->
          <y-select
            :width="6"
            :comboItems="comboSelPriskHazardNos"
            itemText="riskHazardNm"
            itemValue="riskHazardNo"
            ui="bootstrap"
            type="search"
            label="L0000002181"
            name="priskHazardNo"
            v-model="searchParam.priskHazardNo"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 유해위험요인 -->
          <y-text
            :width="9"
            ui="bootstrap"
            label="L0000002179"
            name="riskHazardNm"
            v-model="searchParam.riskHazardNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
           <div slot="buttonGroup" class="float-right mb-1">
            <y-btn 
              v-if="editable"
              title="엑셀 업로드"
              color="blue"
              @btnClicked="btnExcelUploadClicked" 
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getDataList"
            />
          </div>
           유해위험요인 목록 
          <y-data-table
            label="L0000002180"
            :cellClick="true"
            v-model="riskHazard"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @tableLinkClicked="tableLinkClicked"
          ></y-data-table>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002180')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getDataList="getDataList"
          @cellClick="cellClickHandler"
          @btnPopupClickedCallback="btnPopupClickedCallback"
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
  name: 'y-risk-hazard',
  props: {},
  data() {
    return {
      riskHazard: {
        riskHazardNo: 0,
        priskHazardNo: null,
        riskHazardNm: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      searchParam: {
        priskHazardNo: 0,
        riskHazardNm: '',
      },
      gridOptions: {
        name: 'riskHazard',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: null,
        width: '800px',
        top: '10px',
        closeCallback: null,
      },
      editable: false,
      comboSelPriskHazardNos: [],
      comboInsPriskHazardNos: [],
      searchUrl: '',

      isInsert: false,
      isEdit: false,
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
    // 윈도우 resize event
    // window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
    // window.removeEventListener('resize', this.setGridSize);
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.rsa.riskHazard.list.url;
      this.editable = this.$route.meta.editable;

      // this.setGridSize(); // grid 사이즈 조절

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getPriskHazardNos('search'); // 유해위험요인
      this.getPriskHazardNos('model'); // 유해위험요인
      this.getDataList(); // 유해위험요인 grid

      // 유해위험요인 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002181'),
          dataField: 'priskHazardNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002179'),
          dataField: 'riskHazardNm',
          width: '40%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '15%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',
        },
      ];
    },
    resizeGrid() {
      let _height = window.innerHeight - 300;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    // 유해위험요인 분류
    getPriskHazardNos(flag) {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        riskHazardLevel: 1,
      };
      this.$http.request(
        (_result) => {
          if (flag === 'search') {
            this.comboSelPriskHazardNos = this.$_.clone(_result.data);
            this.comboSelPriskHazardNos.splice(0, 0, {
              riskHazardNo: null,
              riskHazardNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            });
            if (
              this.searchParam.priskHazardNo &&
              this.$_.indexOf(
                this.$_.map(this.comboSelPriskHazardNos, 'riskHazardNo'),
                this.searchParam.priskHazardNo
              ) === -1
            ) {
              this.searchParam.priskHazardNo = null;
            }
          } else if (flag === 'model') {
            this.comboInsPriskHazardNos = this.$_.clone(_result.data);
            this.comboInsPriskHazardNos.splice(0, 0, {
              riskHazardNo: null,
              riskHazardNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
            });
            if (
              this.riskHazard.priskHazardNo &&
              this.$_.indexOf(
                this.$_.map(this.comboInsPriskHazardNos, 'priskHazardNo'),
                this.riskHazard.priskHazardNo
              ) === -1
            ) {
              this.riskHazard.priskHazardNo = null;
            }
          }
        },
        (_error) => {
          this.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 유해위험요인 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /**
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },

    /** /validation checking **/

    /** Button Event **/

    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.dataField !== 'riskHazardNm') return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./riskHazardDetail.vue'}`);
      this.popupOptions.title = 'L0000002183'; // 유해위험요인 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./riskHazardDetail.vue'}`);
      this.popupOptions.title = 'L0000002183'; // 유해위험요인 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./riskHazardDetail.vue'}`);
      this.popupOptions.title = 'L0000002183'; // 유해위험요인 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        riskHazardNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    /** /Button Event **/
  },
};
</script>
