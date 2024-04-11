<!--
  목적 : 화학물질관리 > 시약관리 > 시약입출고
  작성자 : kyk
  Detail : 시약입출고 조회 
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
            filter="chm"
            name="plantCd"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 입출고일 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002296"
            name="searchPeriod"
            :default="searchParam.searchPeriod"
            v-model="searchParam.searchPeriod"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 입출고구분 -->
          <y-select
            :width="8"
            :editable="editable"
            :comboItems="inoutFlagItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            name="inoutFlag"
            label="L0000002294"
            v-model="searchParam.inoutFlag"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 실험실 -->
          <y-select
            :width="8"
            :comboItems="labNoItems"
            itemText="labNm"
            itemValue="labNo"
            ui="bootstrap"
            name="labNo"
            label="L0000001823"
            v-model="searchParam.labNo"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 시약 -->
          <y-text
            :width="8"
            :editable="editable"
            :clearable="true"
            ui="bootstrap"
            name="chemProdNm"
            label="L0000001771"
            v-model="searchParam.chemProdNm"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3 h-100">
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 
            <y-btn
              v-if="!popupParam.popupMode && editable"
              title="L0000001789"
              color="orange"
              @btnClicked="openInsertPopup"
            />
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           시약 입출고 목록 
          <y-data-table
            label="L0000001772"
            ref="dataTable"
            :use-paging="true"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @tableLinkClicked="tableLinkClicked"
          />
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
          :label="this.$comm.getLangSpecInfoLabel('L0000001772')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @getList="getList"
          @openInsertPopup="openInsertPopup"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'reagent-dispensing',
  components: {},
  /** props, data, computed, watch **/
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return { chmReagentInout: [], popupMode: false };
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
        searchPeriod: [],
        inoutFlag: '',
        labNo: '',
        chemProdNm: '',
        plantCd: '',
      },
      gridOptions: {
        name: 'reagentDispensing',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      editable: false,
      inoutFlagItems: [],
      labNoItems: [],
      searchUrl: '',
    };
  },
  computed: {},
  watch: {
    'searchParam.plantCd': {
      handler: function (val, oldVal) {
        // 실험실
        this.getReagentLabs();
      },
      deep: true,
    },
  },
  /** created, beforeMount, mounted, beforeDestroy, destroyed **/
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
  destroyed() {},
  /** methods **/
  methods: {
    init() {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
      this.editable = this.$route.meta.editable;
      var from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.searchPeriod = [from, this.$comm.getToday()];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002296'), 
          dataField: 'inoutDt', 
          width: '10%',   
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },              
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002294'), 
          dataField: 'inoutFlagNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001823'), 
          dataField: 'labNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001773'), 
          dataField: 'chemProdNm', 
          width: '10%',  
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000102'), 
          dataField: 'casNo', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002287'), 
          dataField: 'inAmt', 
          width: '7%',       
          style: 'right-align'    
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002903'), 
          dataField: 'outAmt', 
          width: '7%',           
          style: 'right-align'    
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'), 
          dataField: 'unitNm', 
          width: '7%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002728'), 
          dataField: 'weight', 
          width: '7%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001374'), 
          dataField: 'specificGravity', 
          width: '7%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
          dataField: 'remarks', 
          width: '10%',    
          style: 'left-align',       
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writerUserNm', 
          width: '10%',           
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
          btnClicked: 'openInsertPopup',
          visible: !this.popupParam.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green',
          btnClicked: 'getList',
        },
      ]
      // 입출고구분
      this.$comm.getComboItems('CHM_INOUT_CLS', true).then((_result) => {
        this.inoutFlagItems = _result;
      });

      this.searchUrl = selectConfig.chm.chemicalReagentInout.list.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 395;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    getList() {
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
    cellClickHandler(event) {
      if (event.dataField !== 'inoutDt') return;
      this.openInsertPopup(event.item);
    },
    tableLinkClicked(header, row) {
      if (!row) return;
      this.openInsertPopup(row);
    },
    openInsertPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./reagentDispensingDetail.vue'}`);
      this.popupOptions.title = 'L0000003822'; // '시약입출고 상세';
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '20px';
      this.popupOptions.param = {
        reagentInoutNo: data ? data.reagentInoutNo : 0,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    getReagentLabs() {
      if (this.searchParam.plantCd === '') {
        this.labNoItems = [
          {
            labNo: null,
            labNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          },
        ];
        return;
      }
      this.$http.url = selectConfig.chm.chemicalReagentLab.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            labNo: null,
            labNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          this.labNoItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>

<style></style>
