<!--
  목적 : 물질관리 > 전과정관리 > 물질검토
  작성자 : kdh
  Detail : 물질검토 목록 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 검색어 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000331"
            name="search"
            placeholder="L0000003809"
            v-model="searchParam.search"
          ></y-text>
          <!-- L0000003809: 화학자재명 및 성분명 및 CAS No. -->
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 제조/납품업체명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002625"
            name="vendorNm"
            v-model="searchParam.vendorNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 대표사업장 -->
          <y-plant
            type="search"
            label="L0000000940"
            filter="chm"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4" v-show="!popupParam.popupMode">
          <!-- 진행상태 -->
          <y-select
            :width="8"
            :comboItems="chkRqstStateItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002779"
            name="chkRqstState"
            v-model="searchParam.chkRqstState"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 요청구분 -->
          <y-select
            :width="8"
            :comboItems="rqstTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002050"
            name="rqstType"
            v-model="searchParam.rqstType"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
          <!-- 검토요청일 -->
          <y-datepicker
            :width="8"
            :range="true"
            type="rqstPeriod"
            label="L0000000386"
            :default="searchParam.rqstPeriod"
            v-model="searchParam.rqstPeriod"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 
            <y-btn
              v-if="!popupParam.popupMode && editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnInsert"
            />
             인터페이스 미사용으로 인한 주석 처리, 소스코드 지우지 마세요 
             <y-btn
              v-if="!popupParam.popupMode && editable"
              title="자재검토요청(SAP)"
              color="orange"
              @btnClicked="btnMatCheckRequestInsert"
            /> 
             선택 
            <y-btn
              v-if="popupParam.popupMode && editable"
              title="L0000001561"
              color="orange"
              @btnClicked="btnSelect"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getDataList"
            />
             닫기 
            <y-btn
              v-if="popupParam.popupMode && editable"
              title="L0000000881"
              @btnClicked="closeModalPopup('C')"
            />
          </div>
           자재검토 목록 
          <y-data-table
            class="self-measurement-detail-newline"
            label="L0000002322"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @selectedRow="selectedRow"
            @tableLinkClicked="tableLinkClicked"
            @rowDoubleClicked="rowDoubleClicked"
            :use-paging="true"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002322')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @getDataList="getDataList"
          @cellClick="cellClickHandler"
          @btnSelect="btnSelect"
          @btnInsert="btnInsert"
          @closeModalPopup="closeModalPopup('C')"
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
  name: 'mat-check-request',
  props: {
    popupParam: {
      type: Object,
      default: function() {
        return { chkRqstState: '', popupMode: false };
      },
    },
  },
  data() {
    return {
      searchParam: {
        search: '', // 업체명
        vendorNm: '',
        chkRqstState: '',
        rqstType: '',
        rqstPeriod: [],
        plantCd: '', // 사업장
      },
      gridOptions: {
        name: 'matCheckRequest',
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
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      chkRqstStateItems: [],
      rqstTypeItems: [],
      editable: false,
      searchUrl: '',
      plantItems: [], // 사업장
      selectMatCheckRequestRow: null,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    this.editable = this.$route.meta.editable;
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.chm.matCheckRequest.list.url;
      if (this.popupParam.chkRqstState !== '') {
        this.searchParam.chkRqstState = this.popupParam.chkRqstState;
      }

      // 기간 Setting
      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        today,
        '-3m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.rqstPeriod = [from, today];

      if (!this.popupParam.popupMode) {
        // 물질검토 grid 헤더 설정
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
            dataField: 'plantNm', 
            width: '7%',           
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000386'), 
            dataField: 'rqstDt', 
            width: '8%',  
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {              
              },
            },               
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002053'), 
            dataField: 'deptNm', 
            width: '7%',           
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002057'), 
            dataField: 'chkRqsterNm', 
            width: '7%',           
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002779'), 
            dataField: 'chkRqstStateNm', 
            width: '7%',           
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002050'), 
            dataField: 'rqstTypeNm', 
            width: '7%',           
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003318'), 
            dataField: 'chemProdNmKr', 
            width: '10%',           
            style: 'left-align',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003319'), 
            dataField: 'chemProdNmEn', 
            width: '10%',       
            style: 'left-align',    
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001635'), 
            dataField: 'propertyNm', 
            width: '7%',           
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002627'), 
            dataField: 'makecpNm', 
            width: '10%',           
            style: 'left-align',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000804'), 
            dataField: 'vendorNm', 
            width: '10%',       
            style: 'left-align',    
          },
          {
            headerText: '안전/보건\n검토', 
            dataField: 'chkResultLink', 
            width: '7%',   
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {              
              },
            },                  
          },
          {
            headerText: '환경\n검토', 
            dataField: 'chkResultEnvLink', 
            width: '7%',   
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {              
              },
            },                  
          },
        ];
      } else {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
            dataField: 'plantNm', 
            width: '10%',           
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000386'), 
            dataField: 'rqstDt', 
            width: '10%',           
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003810'), 
            dataField: 'chkDt', 
            width: '10%',           
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002050'), 
            dataField: 'rqstTypeNm', 
            width: '10%',           
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003318'), 
            dataField: 'chemProdNmKr', 
            width: '10%',       
            style: 'left-align',    
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003319'), 
            dataField: 'chemProdNmEn', 
            width: '10%',      
            style: 'left-align',     
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002627'), 
            dataField: 'makecpNm', 
            width: '10%',           
            style: 'left-align',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000804'), 
            dataField: 'vendorNm', 
            width: '10%',          
            style: 'left-align', 
          },      
        ];
      }

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'), 
          color: 'orange',
          btnClicked: 'btnInsert',
          visible: !this.popupParam.popupMode
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'), 
          color: 'orange',
          btnClicked: 'btnSelect',
          visible: this.popupParam.popupMode
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green',
          btnClicked: 'getDataList',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), 
          btnClicked: 'closeModalPopup',
          visible: this.popupParam.popupMode
        },
      ]
      // 진행상태
      this.$comm.getComboItems('CHM_MCR_STEP', true).then(_result => {
        this.chkRqstStateItems = _result;
      });
      // 요청구분
      this.$comm.getComboItems('CHM_MCR_CLS', true).then(_result => {
        this.rqstTypeItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      // 물질검토 grid
      this.getDataList();
    },
    // 물질검토 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data)
          this.$comm.pushCookie(this.searchParam);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'rqstDt') {
        this.btnInsert(event.item);
      }
      else if (event.dataField === 'chkResultLink' || event.dataField === 'chkResultEnvLink') {
        if (event.item.chkRqstState === 'MCRS0') return;
        let chkFlag = event.dataField === 'chkResultLink' ? 'saf' : 'env';
        this.btnInsert(event.item, chkFlag);
      }
    },
    tableLinkClicked(header, data) {
      // 화학물질명을 누를시 물질검토 상세 정보 팝업을 open
      if (header.name === 'rqstDt') {
        this.btnInsert(data);
      }
      else if (header.name === 'chkResultLink' || header.name === 'chkResultEnvLink') {
        if (data.chkRqstState === 'MCRS0') return;
        let chkFlag = header.name === 'chkResultLink' ? 'saf' : 'env';
        this.btnInsert(data, chkFlag);
      }
    },
    resizeGrid() {
      let _height = window.innerHeight - 395;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    btnInsert(data, chkFlag) {
      this.popupOptions.target = () => import(`${'./matCheckRequestDetail.vue'}`);
      this.popupOptions.title = 'L0000003811'; // '자재검토';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        matChkRqstNo: data ? data.matChkRqstNo : 0,
        chkRqstState: data ? data.chkRqstState : 'MCRS0',
        chkFlag: chkFlag,
      };
      this.popupOptions.width = '80%';
      this.popupOptions.closeCallback = this.closePopup;
    },
    selectedRow(data) {
      if (!this.popupParam.popupMode) return;
      this.selectMatCheckRequestRow = data;
    },
    rowDoubleClicked(data) {
      if (!this.popupParam.popupMode) return;
      this.closeModalPopup(data);
    },
    btnMatCheckRequestInsert() {
      // 아래의 주석 처리된 소스코드 삭제 하지마세요.
      // 자재검토요청 from - to 를 받아 sap I/F 해 insert/update 한다.
      // this.popupOptions.target = () =>
      //   import(`${'./matCheckRequestPeriod.vue'}`);
      // this.popupOptions.title = '자재검토요청';
      // this.popupOptions.visible = true;
      // this.popupOptions.width = '30%';
      // this.popupOptions.closeCallback = this.closePopup;

      // 임시요청자재를 생성하여 테스트로 활용한다.
      // this.$http.url = transactionConfig.chm.matCheckRequest.dummy.url;
      // this.$http.type = 'POST';
      // this.$http.param = {
      //   matChkRqstNo: 0,
      //   matCheckRequestCompos: [],
      //   regulItmMatVals: [],
      //   createUserId: this.$store.getters.token,
      //   updateUserId: this.$store.getters.token,
      // };
      // this.$http.request(_result => {
      //   this.getDataList();
      // });
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getDataList(); // 물질검토 grid
    },
    closeModalPopup(data) {
      this.$emit('closePopup', { data });
    },
    btnSelect() {
      // 선택.
      if (!this.selectMatCheckRequestRow) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000170', // '화학자재를 선택하세요.',
          type: 'warning',
        });
      } else this.closeModalPopup(this.selectMatCheckRequestRow);
    },
  },
};
</script>
<style>
.self-measurement-detail-newline .el-table .el-table__header-wrapper .default-td .cell {
  white-space: pre;
}
</style>
