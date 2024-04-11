<!--
  목적 : 경영 > 인허가현황 목록
  작성자 : ksw
  Detail : 인허가현황 목록 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            v-model="searchParam.plantCd"
            @datachange="
              (val) => {
                (searchParam.plantCd = val), getList();
              }
            "
          ></y-plant>
        </b-col>

        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 분류 -->
          <y-select
            :width="8"
            :comboItems="roomTpItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001341"
            name="kindCd"
            v-model="searchParam.kindCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 제목 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002616"
            name="title"
            v-model="searchParam.title"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
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
            <y-btn title="L0000000327" color="green" @btnClicked="btnSearchClickedCallback" />
          </div>
           인허가현황 목록 
          <y-data-table
            label="L0000002258"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002258')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
          @getList="getList"
          @openNewPopup="openNewPopup"
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
  name: 'reference-room',
  props: {},
  data() {
    return {
      searchArea: {
        // title: '검색박스숨기기',
        show: true,
      },
      searchParam: {
        kindCd: '', // 분류
        title: '', // 제목
        // duration: [], // 등록일
      },
      gridOptions: {
        name: 'licensingStatus',
        header: [],
        btns: [],
        data: [],
        height: '450',
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
      roomTpItems: [],
      plantItems: [],
      editable: false,
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    // this.searchParam.duration.push(
    //   this.$comm.getCalculatedDate(
    //     this.$comm.getToday(),
    //     '-1m',
    //     'YYYY-MM-DD',
    //     'YYYY-MM-DD'
    //   )
    // );

    // this.searchParam.duration.push(this.$comm.moment().format('YYYY-MM-DD'));
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001341'),
          dataField: 'roomTp',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002616'),
          dataField: 'title',
          width: '12%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000567'),
          dataField: 'refOffice',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000568'),
          dataField: 'refLaw',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000565'),
          dataField: 'refDesc',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'),
          dataField: 'deptNm',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '11%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openNewPopup',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];

      this.searchUrl = selectConfig.mgt.licensingStatus.list.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 By 2022-05-09 장헌영 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
      // this.setGridSize();
      this.$comm.getComboItems('MGT_DOCU_KND01', true).then((_result) => {
        this.roomTpItems = _result;
      });
    },
    // 필수입력값 유효성 검사
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    // 초기화
    btnClearClickedCallback() {
      Object.assign(
        this.$data.comSafeMaster,
        this.$options.data().comSafeMaster
      );
      this.$validator.reset();
    },
    // 검색
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016'
            /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    openNewPopup() {
      this.popupOptions.target = () =>
        import(`${'./licensingStatusDetail.vue'}`);
      this.popupOptions.title = 'L0000002257'; /* 인허가현황 등록/수정 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        lcnBoardNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    cellClickHandler(event) {
      if (event.dataField === 'title') {
        this.popupOptions.target = () =>
          import(`${'./licensingStatusDetail.vue'}`);
        this.popupOptions.title = 'L0000002259'; /* 인허가현황 상세 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          lcnBoardNo: event.item.lcnBoardNo,
        };
        this.popupOptions.closeCallback = this.closePopup;
        this.popupOptions.customCallBack = this.updatePopup;
      } else if (event.dataField === 'revNum') {
        this.popupOptions.target = () =>
          import(`${'./licensingStatusAddHistory.vue'}`);
        this.popupOptions.title = 'L0000003776'; /* 인허가현황 개정이력 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.param = {
          lcnBoardNo: event.item.lcnBoardNo,
        };
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    tableLinkClicked(header, data) {
      if (data === null) return;

      if (header.name === 'title') {
        this.popupOptions.target = () =>
          import(`${'./licensingStatusDetail.vue'}`);
        this.popupOptions.title = 'L0000002259'; /* 인허가현황 상세 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          lcnBoardNo: data.lcnBoardNo,
        };
        this.popupOptions.closeCallback = this.closePopup;
        this.popupOptions.customCallBack = this.updatePopup;
      } else if (header.name === 'revNum') {
        this.popupOptions.target = () =>
          import(`${'./licensingStatusAddHistory.vue'}`);
        this.popupOptions.title = 'L0000003776'; /* 인허가현황 개정이력 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.param = {
          lcnBoardNo: data.lcnBoardNo,
        };
        this.popupOptions.closeCallback = this.closePopup;
      }
    },
    updatePopup(data) {
      this.popupOptions.target = () => import(`${'./licensingStatus.vue'}`);
      this.popupOptions.title = 'L0000002257'; /* 인허가현황 등록/수정 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        lcnBoardNo: data.lcnBoardNo,
        lcnBoardGrpNo: data.lcnBoardGrpNo,
        // insertMode: data.insertMode,
        // updateMode: data.updateMode,
        revisionMode: data.revisionMode,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    btnSearchClickedCallback() {
      this.getList();
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
  },
};
</script>
