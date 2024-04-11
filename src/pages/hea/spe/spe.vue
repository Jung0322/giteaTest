<!--
  목적 : 안전보호구 > 보호구 목록
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" :editable="editable" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 보호구 종류 -->
          <y-select
            :width="baseWidth"
            :comboItems="selSpeKindCds"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000001270"
            name="speKindCd"
            v-model="searchParam.speKindCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 보호구명 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            type="search"
            label="L0000001275"
            name="speNm"
            v-model="searchParam.speNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 보호구 grid -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
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
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
        보호구 목록
          <y-data-table
            label="L0000001261"
            gridType="edit"
            :use-paging="true"
            :print="true"
            v-model="spe"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000001261')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @btnPopupClickedCallback="btnPopupClickedCallback"
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
  name: 'spe',
  props: {},
  data() {
    return {
      spe: {
        safSpeNo: 0, // 보호구번호
        speKindCd: null, // 보호구종류
        speNm: '', // 보호구명
        giveUnitCd: null, // 지급단위코드
        useYn: 'Y', // 사용여부
        matCd: '', // SAP 자재번호
        sortOrder: '', // 정렬순서
        createUserId: '', // 등록자ID
        updateUserId: '', // 수정자ID
        plantCd: '', // 사업장코드
        giveCyclCd: null, // 지급주기
      },
      searchArea: {
        title: '검색박스숨기기', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        plantCd: '',
        speKindCd: '',
        speNm: '',
      },
      gridOptions: {
        name: 'spe',
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
      editable: false,
      baseWidth: 8,
      selSpeKindCds: [], // 보호구 종류 - 검색조건
      insSpeKindCds: [], // 보호구 종류 - 상세
      insGiveUnitCds: [], // 단위 - 상세
      comboUseYnItems: [], // 사용여부
      giveCyclCdItems: [], // 지급주기 목록
      searchUrl: '',
      insertUrl: '',

      isInsert: false,
      isEdit: false,
      isDelete: false,

      // 첨부 파일
      attach: null,
      submitCheck: false,
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid
    this.resizeGrid();
  },
  beforeDestroy() {
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // URL 셋팅
      this.searchUrl = selectConfig.saf.spe.list.url;
      this.insertUrl = transactionConfig.saf.spe.insert.url;

      this.comboUseYnItems.push({ code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }); // 전체
      this.comboUseYnItems.push({ code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }); // 사용
      this.comboUseYnItems.push({ code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }); // 미사용


      this.getCommonCodeList('SAF_SPE_KIND'); // 보호구 종류
      this.getCommonCodeList('SAF_GIVE_UNIT'); // 단위
      this.getCommonCodeList('SAF_SPE_CHK_CYE'); // 지급주기

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getDataList(); // 보호구 grid

      // 보호구 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '10%', 
        },   
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001270'), 
          dataField: 'speKindNm', 
          width: '10%', 
        },   
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001275'), 
          dataField: 'speNm', 
          width: '15%', 
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },   
        
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004396'), 
          dataField: 'matCd', 
          width: '10%', 
        },  
        
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'), 
          dataField: 'giveUnitNm', 
          width: '7%', 
        },  
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000865'), 
          dataField: 'unitCost',
          dataType: 'numeric', 
          formatString: '#,##0',
          width: '7%', 
        },  
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'), 
          dataField: 'useYnNm', 
          width: '8%', 
        },  
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001273'), 
          dataField: 'giveCyclNm', 
          width: '10%', 
        },  
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'), 
          dataField: 'sortOrder', 
          width: '10%', 
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
          btnClicked: 'btnPopupClickedCallback'
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green',
          btnClicked: 'btnSearchClickedCallback'
        },
      ]
      // 첨부파일 셋팅
      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps();
    },
    getCommonCodeList(codeGroup) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroup
      );
      this.$http.type = 'get';
      this.$http.request(
        _result => {
          if (codeGroup === 'SAF_SPE_KIND') {
            // 보호구 종류
            this.selSpeKindCds = this.$_.clone(_result.data);
            this.selSpeKindCds.splice(0, 0, { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') });  // 전체
            this.insSpeKindCds = this.$_.clone(_result.data);
            this.insSpeKindCds.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          } else if (codeGroup === 'SAF_GIVE_UNIT') {
            // 단위
            this.insGiveUnitCds = this.$_.clone(_result.data);
            this.insGiveUnitCds.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          } else if (codeGroup === 'SAF_SPE_CHK_CYE') {
            // 지급주기
            this.giveCyclCdItems = this.$_.clone(_result.data);
            this.giveCyclCdItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 365;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    // 보호구 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.gridOptions.data = _result.data;
          this.$comm.pushCookie(this.searchParam);
          this.YAuiGrid.setGridData(_result.data)
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    // 그리드 row click 이벤트
    selectedRow(data) {
      if (data === null) return;

      this.$http.url = this.$format(
        selectConfig.saf.spe.get.url,
        data.safSpeNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.spe = this.$_.clone(_result.data);
          this.setAttachFileGrps();
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    textCalculate(row, name) {
      if (!row[name]) {
        row[name] = 0;
      }
      return row[name].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },

    /** Button Event **/

    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // // 초기화
    // btnClearClickedCallback() {
    //   Object.assign(this.$data.spe, this.$options.data().spe);
    //   // this.spe = '';sadsad
    //   this.spe.safSpeNo = '';
    //   this.setAttachFileGrps();
    //   // this.spe.speKindCd = null;
    //   // this.spe.giveUnitCd = null;
    //   this.$validator.reset();
    // },

    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.isDelete = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.dataField !== 'speNm') return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./speDetail.vue'}`);
      this.popupOptions.title = 'L0000001265'; // 보호구 상세 수정/등록
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./speDetail.vue'}`);
      this.popupOptions.title = 'L0000001265'; // 보호구 상세 수정/등록
      this.popupOptions.visible = true;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./speDetail.vue'}`);
      this.popupOptions.title = 'L0000001265'; // 보호구 상세 수정/등록
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safSpeNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupSearchChemProd(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.data && data.data !== 'C' && data.data !== '[]') {
        this.spe.matCd = data.data.matCode;
      }
    },
    // 첨부파일 관련 메서드
    setAttachFileGrps() {
      let taskKey = this.spe.safSpeNo ? this.spe.safSpeNo.toString() : '';
      this.attachFileGrps = [
        {
          label: this.$comm.getLangSpecInfoLabel('L0000001263'), // 보호구 사진
          drag: false,
          showFileSearch: true,
          editable: this.editable,
          limit: 1,
          multiple: true,
          onlyDownload: false,
          uploadTempFiles: null,
          taskClassNm: 'SHIELD',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
        {
          label: this.$comm.getLangSpecInfoLabel('L0000002243'), // '인증서',
          listType: 'text',
          drag: false,
          showFileSearch: true,
          editable: this.editable,
          limit: 3,
          multiple: true,
          onlyDownload: false,
          uploadTempFiles: null,
          taskClassNm: 'SHIELD_CERTIFICATE',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
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