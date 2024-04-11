<!--
  목적 : 첨부파일 목록
  Detail : 펌부파일 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 공정 -->
          <y-tree-process
            label="L0000000515"
            name="processCd"
            type="search"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.processCd"
          ></y-tree-process>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 문서명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001041"
            name="docuTitle"
            v-model="searchParam.docuTitle"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="gridOptions.label"
          :items="gridOptions.data"
          :useExcelExport="!attachFileGrp.isPopup"
          :showGridSetSave="!attachFileGrp.isPopup"
          :useContextMenu="!attachFileGrp.isPopup"
          :enableRightDownFocus="!attachFileGrp.isPopup"
          :showGridCtrl="!attachFileGrp.isPopup"
          @cellClick="cellClickHandler"
          @btnOpen="openDialogPage()"
          @btnSearch="btnSearchClickedCallback"
          @btnClose="closePop"
          @btnClickedError="btnClickedErrorCallback"
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
  name: 'saf-attach-file',
  props: {
    attachFileGrp: {
      taskClassNm: '',
      taskKey: '',
      docuKindCd: null,
      taskFlag: '',
      plantCd: '',
      refTableId: '',
      label: 'L0000002843', // 첨부파일
      isPopup: false,
    },
    tabIndex: 0,
    tap: null,
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        tap: 'safAttachFile',
        taskClassNm: '',
        docuKindCd: '',
        taskKey: '',
        taskFlag: '',
        plantCd: '',
        docuTitle: '',
        refTableId: '',
        processCd: '',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'commonAttachFileSafAttachFile',
        header: [],
        data: [],
        height: '300',
        tabs: true,
      },
      editable: false,
      docuKindCdSearchItems: [],
      searchUrl: '',
    };
  },
  watch: {
    attachFileGrp: {
      handler: function (val, oldVal) {
        this.searchUrl = selectConfig.safAttachFile.list.url;
        this.setSearchParam();
      },
      deep: true,
    },
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
  activated() {
    this.resizeGrid();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.attachFileGrp.label = this.$comm.getLangSpecInfoLabel(
        this.attachFileGrp.label
      );
      // Url Setting
      this.searchUrl = selectConfig.safAttachFile.list.url;

      this.gridOptions.label =
        this.attachFileGrp.label +
        this.$comm.getLangSpecInfoLabel('L0000001022');
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '90',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          style: 'left-align',
          width: '200',
        }, // 공정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005851'),
          dataField: 'sheDocuNo',
          width: '100',
        }, // 문서번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001041'),
          dataField: 'docuTitle',
          width: '30%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 문서명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002798'),
          dataField: 'revNum',
          width: '90',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 차수
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003029'),
          dataField: 'fileCnt',
          width: '100',
        }, // 파일수량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '100',
        } /* 작성자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '100',
        } /* 작성일 */,
      ];

      if (this.attachFileGrp.mgtEditable) this.getComboItems('MGT_DOCU_KND01');
      this.setSearchParam();

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnOpen',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, // 검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClose',
          visible: this.attachFileGrp.isPopup || false,
        }, // 닫기
      ];
    },
    setSearchParam() {
      this.searchParam.taskKey = this.attachFileGrp.taskKey;
      this.searchParam.taskClassNm = this.attachFileGrp.taskClassNm;
      this.searchParam.docuKindCd = this.attachFileGrp.docuKindCd
        ? this.attachFileGrp.docuKindCd
        : '';

      if (!this.attachFileGrp.refTableId) {
        this.searchParam.refTableId = '';
      } else {
        this.searchParam.refTableId = this.attachFileGrp.refTableId;
      }
      if (!this.attachFileGrp.taskFlag) {
        this.searchParam.taskFlag = '';
      } else {
        this.searchParam.taskFlag = this.attachFileGrp.taskFlag;
      }

      if (this.tap) {
        this.searchParam.tap = 'safAttachFile_' + this.tap;
      }

      if (!this.attachFileGrp.label) {
        this.attachFileGrp.label =
          this.$comm.getLangSpecInfoLabel('L0000002843'); // 첨부파일
      }
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      const searchParamByCookie = this.$comm.setSearchParamByCookie(
        this.searchParam.tap
      );
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'MGT_DOCU_KND01') {
            this.docuKindCdSearchItems = this.$_.clone(_result.data);
            this.docuKindCdSearchItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'docuTitle') {
        this.openDialogPage(event.item);
      } else if (event.dataField === 'revNum') {
        this.openCustomDialog(event.item);
      }
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openDialogPage(data) {
      if (!data) {
        this.popupOptions.param = {
          docuGrpNo: 0,
          taskKey: '',
          sheDocuNo: 0,
          taskClassNm: this.attachFileGrp.taskClassNm,
          taskFlag: this.attachFileGrp.taskFlag,
          docuKindCd: this.attachFileGrp.docuKindCd,
          plantCd: this.attachFileGrp.plantCd,
          refTableId: this.attachFileGrp.refTableId,
          label: this.attachFileGrp.label,
          data: {},
        };
      } else {
        this.popupOptions.param = {
          docuGrpNo: data.docuGrpNo,
          taskKey: data.sheDocuNo,
          sheDocuNo: data.sheDocuNo,
          taskClassNm: this.attachFileGrp.taskClassNm,
          taskFlag: this.attachFileGrp.taskFlag,
          docuKindCd: this.attachFileGrp.docuKindCd,
          plantCd: this.attachFileGrp.plantCd,
          refTableId: this.attachFileGrp.refTableId,
          label: this.attachFileGrp.label,
          data: data,
        };
      }
      this.popupOptions.target = () => import(`${'./safAttachFileDialog.vue'}`);
      this.popupOptions.title =
        this.$comm.getLangSpecInfoLabel(this.attachFileGrp.label) +
        this.$comm.getLangSpecInfoLabel('L0000001526'); // (팝업타이틀) + 상세
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openCustomDialog(data) {
      let searchParam = this.$_.clone(this.searchParam);
      let dialogParam = {
        docuGrpNo: data.docuGrpNo,
        taskKey: data.sheDocuNo,
        taskClassNm: this.attachFileGrp.taskClassNm,
        taskFlag: this.attachFileGrp.taskFlag,
        docuKindCd: this.attachFileGrp.docuKindCd,
        plantCd: this.attachFileGrp.plantCd,
        label: this.attachFileGrp.label,
        data: data,
      };

      searchParam.taskKey = data.docuGrpNo;
      searchParam.docuTitle = '';
      searchParam.taskFlag = '';

      this.popupOptions.param = {
        flag: 'SAF_ATTACH_FILE',
        gridOptions: this.gridOptions,
        listLabel:
          this.attachFileGrp.label +
          this.$comm.getLangSpecInfoLabel('L0000000296'), // 개정이력 목록
        searchUrl: this.searchUrl,
        searchKey: searchParam,
        dialogTitle:
          this.attachFileGrp.label +
          this.$comm.getLangSpecInfoLabel('L0000001526'), // 상세
        dialogParam: dialogParam,
      };
      this.popupOptions.target = () =>
        import(`${'../baseInfo/customDialog.vue'}`);
      this.popupOptions.title = this.$comm.getLangSpecInfoLabel('L0000000292'); // 개정 관리
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.getList();

      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    // 팝업으로 뜬 경우 창을 닫는 메소드
    closePop() {
      this.$emit('closePopup', {});
    },
    /** button 관련 이벤트 **/
    btnSearchClickedCallback(_result) {
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** end button 관련 이벤트 **/
    resizeGrid() {
      // 공정설명서(탭)일 경우 그리드 사이즈 조절
      let _height =
        this.searchParam.docuKindCd === 'PLMUL'
          ? window.innerHeight - 390
          : window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
