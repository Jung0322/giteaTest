<!--
  목적 : 도면파일 목록
  Detail : 도면파일 목록 화면
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
          <!-- 도면번호 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000953"
            name="diagramNo"
            v-model="searchParam.diagramNo"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 도면명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000952"
            name="diagTitle"
            v-model="searchParam.diagTitle"
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
          :label="gridOptions.label"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @openDialogPage="openDialogPage"
          @btnSearch="getList"
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
  name: 'diagram-file',
  props: {
    attachFileGrp: {
      taskClassNm: '',
      taskKey: '',
      diagClassCd: '',
      taskFlag: '',
      plantCd: '',
      label: '',
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
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        tap: 'diagram',
        taskKey: '',
        taskClassNm: '',
        diagClassCd: '',
        taskFlag: '',
        plantCd: '',
        docuTitle: '',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'commonDiagramFile',
        header: [],
        data: [],
        height: '300',
      },
      editable: false,
      searchUrl: '',
    };
  },
  watch: {
    attachFileGrp: {
      handler: function (val, oldVal) {
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
      this.searchUrl = selectConfig.diagramFile.list.url;

      this.gridOptions.label =
        this.attachFileGrp.label +
        this.$comm.getLangSpecInfoLabel('L0000001022');
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000953'),
          dataField: 'diagramNo',
          width: '30%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 도면번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000952'),
          dataField: 'diagTitle',
          width: '30%',
          style: 'left-align',
        }, // 도면명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002798'),
          dataField: 'revNum',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 차수
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        } /* 작성자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        } /* 작성일 */,
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openDialogPage',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, // 검색
      ];

      this.setSearchParam();
    },
    setSearchParam() {
      this.searchParam.taskKey = this.attachFileGrp.taskKey
        ? String(this.attachFileGrp.taskKey)
        : '';
      this.searchParam.taskClassNm = this.attachFileGrp.taskClassNm;
      this.searchParam.diagClassCd = this.attachFileGrp.diagClassCd;
      if (this.attachFileGrp.taskFlag === undefined) {
        this.searchParam.taskFlag = '';
      } else this.searchParam.taskFlag = this.attachFileGrp.taskFlag;

      if (this.tap) {
        this.searchParam.tap = 'diagram_' + this.tap;
      }

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      const searchParamByCookie = this.$comm.setSearchParamByCookie(
        this.searchParam.tap
      );
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    cellClickHandler(event) {
      if (event.dataField === 'diagramNo') {
        this.openDialogPage(event.item);
      } else if (event.dataField === 'fileOrgNm') {
        const link = document.createElement('a');
        link.href = event.item.fileDownPath;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
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
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openDialogPage(data) {
      if (data === undefined) {
        this.popupOptions.param = {
          diagramSeq: 0,
          diagGrpNo: 0,
          taskKey: '',
          taskClassNm: this.attachFileGrp.taskClassNm,
          taskFlag: this.attachFileGrp.taskFlag,
          diagClassCd: this.attachFileGrp.diagClassCd,
          label: this.attachFileGrp.label,
          data: {},
          key1: 0,
        };
      } else {
        this.popupOptions.param = {
          diagramSeq: data.diagramSeq,
          diagGrpNo: data.diagGrpNo,
          taskKey: data.diagramSeq ? String(data.diagramSeq) : '',
          taskClassNm: this.attachFileGrp.taskClassNm,
          taskFlag: this.attachFileGrp.taskFlag,
          diagClassCd: this.attachFileGrp.diagClassCd,
          label: this.attachFileGrp.label,
          data: data,
          key1: data.key1,
        };
      }
      this.popupOptions.target = () => import(`${'./diagramFileDialog.vue'}`);
      this.popupOptions.title = 'L0000000955'; // 도면파일 상세
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openCustomDialog(data) {
      let searchParam = this.$_.clone(this.searchParam);
      let dialogParam = {
        diagramSeq: data.diagramSeq,
        diagGrpNo: data.diagGrpNo,
        taskKey: data.diagramSeq ? String(data.diagramSeq) : '',
        taskClassNm: this.attachFileGrp.taskClassNm,
        taskFlag: this.attachFileGrp.taskFlag,
        diagClassCd: this.attachFileGrp.diagClassCd,
        label: this.attachFileGrp.label,
        data: data,
      };

      searchParam.taskKey = data.diagGrpNo ? String(data.diagGrpNo) : '';
      searchParam.diagTitle = '';
      searchParam.taskFlag = '';

      this.popupOptions.param = {
        flag: 'DIAGRAM_FILE',
        gridOptions: this.gridOptions,
        listLabel:
          this.$comm.getLangSpecInfoLabel(this.attachFileGrp.label) +
          ' ' +
          this.$comm.getLangSpecInfoLabel('L0000000296'), // 개정이력 목록
        searchUrl: this.searchUrl,
        searchKey: searchParam,
        dialogTitle:
          this.$comm.getLangSpecInfoLabel(this.attachFileGrp.label) +
          ' ' +
          this.$comm.getLangSpecInfoLabel('L0000001526'), // 상세
        dialogParam: dialogParam,
      };
      this.popupOptions.target = () =>
        import(`${'../baseInfo/customDialog.vue'}`);
      this.popupOptions.title = this.$comm.getLangSpecInfoLabel('L0000000292'); // 개정 관리
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.getList();

      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** end button 관련 이벤트 **/
    resizeGrid() {
      let _height = window.innerHeight - 360;

      // 공정안전자료 > 건물 설비 배치도 > 배치도면 일때 그리드 사이즈 변경
      if (
        this.attachFileGrp.diagClassCd === 'FAIRD' ||
        this.attachFileGrp.diagClassCd === 'FAARD' ||
        this.attachFileGrp.diagClassCd === 'BFAAD' ||
        this.attachFileGrp.diagClassCd === 'FIREP'
      ) {
        _height = window.innerHeight - 400;
      }

      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
