<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xl-6">
          <!-- 검색어 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000331"
            name="word"
            placeholder="L0000000336"
            v-model="searchParam.word"
            :editable="editable"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 -->
    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             글쓰기 -
            <y-btn
              v-if="editable"
              title="L0000000761"
              color="orange"
              @btnClicked="openDetailPage(null)"
            />
             검색 -
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
            />
          </div>
           게시판 목록 
          <y-data-table
            label="L0000000396"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000396')"
          :enableSorting="true"
          :showGridSetSave="true"
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @openDetailPage="openDetailPage(null)"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="boardPopupOpt"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'bbs',
  data() {
    return {
      bbsNo: null,
      boardMaster: {},
      searchParam: {
        bbsNm: '', // 게시판명
      },
      // GRID 옵션들
      gridOptions: {
        name: 'bbs',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      boardPopupOpt: {},
      // list 페이지에서 필수 속성
      searchUrl: '',
      editable: true, // 페이지내 쓰기권한 여부
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
  },
  methods: {
    init() {
      this.bbsNo = this.getBbsNo();
      this.getBoardMaster(this.bbsNo);
      this.searchUrl = this.$format(selectConfig.board.list.url, this.bbsNo);

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000392'), 
          dataField: 'notiNo', 
          width: '10%',       
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002616'), 
          dataField: 'notiTtl', 
          width: '50%',  
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },          
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'notierName', 
          width: '15%',       
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002702'), 
          dataField: 'searchCnt', 
          width: '10%',       
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'createDt', 
          width: '15%',       
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000761'), 
          color: 'orange',
          btnClicked: 'openDetailPage',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ]

      // 팝업 옵션 기본 셋팅
      this.boardPopupOpt = {
        target: () => import(`${'@/pages/board/bbsDetail.vue'}`),
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: this.closePopup,
        customCallBack: this.setDetailPageTitle,
      };

      this.getList();
    },
    getBbsNo() {
      var lastPath = this.$route.path.split('/');
      if (lastPath.length > 0) {
        return lastPath[lastPath.length - 1].replace('bbs_', '');
      } else {
        return null;
      }
    },
    // 게시판 마스터 정보 가져옴
    getBoardMaster(bbsNo) {
      this.$http.url = selectConfig.manage.board.get.url;
      this.$http.type = 'GET';
      this.$http.param = { bbsNo: bbsNo };
      this.$http.request(
        (_result) => {
          this.boardMaster = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 325;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    // 리스트 검색
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data))
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /Button Event **/
    // 테이블 링크 클릭 팝업띄움
    cellClickHandler(event) {
      if (event.dataField !== 'notiTtl') return;
      this.openDetailPage(event.item);
    },
    tableLinkClicked(header, data) {
      this.openDetailPage(data);
    },

    openDetailPage(data) {
      this.boardPopupOpt.title = 'L0000005420'; /* 게시글 등록 */
      this.boardPopupOpt.visible = true;

      // replyPosbYn: '', 댓글 가능 여부
      // answerPosbYn: '', 답글 작성 여부
      // readAuthPosbYn: '', 열람 권한 설정 여부
      if (data) {
        // 게시판 마스터에 설정된 첨부파일 설정을 같이 던져준다.
        this.boardPopupOpt.param = {
          bbs: this.$_.clone(data),
          taskClassNm: this.boardMaster.taskClassNm,
          replyPosbYn: this.boardMaster.replyPosbYn,
          answerPosbYn: this.boardMaster.answerPosbYn,
          readAuthPosbYn: this.boardMaster.readAuthPosbYn,
        };
      } else {
        this.boardPopupOpt.param = {
          bbs: {
            bbsNo: this.bbsNo,
            notiNo: 0, // 신규게시물은 0으로 구분함.
          },
          taskClassNm: this.boardMaster.taskClassNm,
        };
      }
    },

    setDetailPageTitle(data) {
      this.boardPopupOpt.title = data.title;
    },
    // 팝업 닫음 ( 자식창에서 호출 됨... )
    closePopup(data) {
      this.boardPopupOpt.visible = false;
      this.getList();
    },

    // 페이지별 default method 모음

    btnSearchClickedCallback() {
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>
