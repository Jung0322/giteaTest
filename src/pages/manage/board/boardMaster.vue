<!--
  목적 : 시스템 > 게시판관리 > 게시판생성관리
  Detail : 게시판마스터 CRUD
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 게시판명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000401"
            name="word"
            placeholder="L0000000335"
            v-model="searchParam.bbsNm"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000396')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
          @openDetailPage="openDetailPage"
          @btnSearchClickedCallback="btnSearchClickedCallback"
        />
      </b-col>
    </b-row>
    <y-dialog :param="boardPopupOpt"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'board-master-list',
  props: {},
  data() {
    return {
      searchArea: {
        title: 'L0000000329', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        bbsNm: '', // 게시판명
      },
      // GRID 옵션들
      gridOptions: {
        name: 'boardMaster',
        header: [],
        data: [],
        btns: [],
        height: '600',
      },
      // 팝업 옵션들
      boardPopupOpt: {},

      searchUrl: '',
      editable: true, // 페이지내 쓰기권한 여부
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    // vue 객체 초기화
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
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.manage.board.list.url;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000403'),
          dataField: 'bbsNo',
          width: '120',
          align: 'center',
        }, // 게시판 번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000401'), // 게시판명
          dataField: 'bbsNm',
          width: '200px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000404'), // 게시판소개
          dataField: 'bbsInstr',
          width: '200',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000943'), // 댓글가능여부
          dataField: 'replyPosbYn',
          width: '150',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001927'),
          dataField: 'tmplId',
          width: '100',
          style: 'center-align',
        }, // 양식ID
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYn',
          width: '100',
          align: 'center',
        }, // 사용여부
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002355') /* 작성자 */,
          dataField: 'writerUserNm',
          width: '120',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002352') /* 작성일 */,
          dataField: 'writerDt',
          width: '120',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000900'), // 답글작성여부
          dataField: 'answerPosbYn',
          width: '150',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002844'), // 첨부파일 설정
          dataField: 'taskClassNm',
          width: '150',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'), // 신규등록
          color: 'orange',
          btnClicked: 'openDetailPage',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        }, // 검색
      ];

      // 팝업 옵션 기본 셋팅
      this.boardPopupOpt = {
        target: () => import(`${'@/pages/manage/board/boardMasterDetail.vue'}`),
        title: 'L0000000394', // 게시판 등록&수정
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: this.closePopup,
      };

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
      // this.setGridSize();
    },

    // 초기화
    btnClearClickedCallback() {
      //   Object.assign(
      //     this.$data.comSafeMaster,
      //     this.$options.data().comSafeMaster
      //   );
      //   this.$validator.reset();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    // 리스트 검색
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /** validation checking **/
    btnSearchClickedCallback() {
      this.getList();
    },

    /** /Button Event **/
    // 테이블 링크 클릭 팝업띄움
    cellClickHandler(event) {
      if (event.dataField !== 'bbsNm') return;
      this.openDetailPage(event.item);
    },
    openDetailPage(data) {
      this.boardPopupOpt.visible = true;
      this.boardPopupOpt.param = data ? this.$_.clone(data) : {};
    },
    // 팝업 닫음 ( 자식창에서 호출 됨... )
    closePopup(data) {
      this.boardPopupOpt.visible = false;
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 295;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
