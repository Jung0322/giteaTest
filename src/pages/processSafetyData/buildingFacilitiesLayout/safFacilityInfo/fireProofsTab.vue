<!--
  목적 : 내화구조명세
  Detail : 내화구조명세 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 구분 -->
          <y-text
            :width="8"
            ui="bootstrap"
            type="search"
            label="L0000000686"
            name="category"
            v-model="searchParam.category"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 지역명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            type="search"
            label="L0000002759"
            name="fireProofsNm"
            v-model="searchParam.fireProofsNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <!-- 내화구조 명세 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :label="this.$comm.getLangSpecInfoLabel('L0000000815')"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
          @btnPopupClicked="openDialogPage"
          @btnSearch="btnSearchClickedCallback"
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
  name: 'fire-proofs-tab',
  props: {
    tabIndex: 0,
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
      searchArea: {
        title: '검색박스숨기기', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        tap: 'fireProofsTab',
        plantCd: '',
        category: '',
        fireProofsNum: '',
        fireProofsNm: '',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'processSafetyDataSafFacilityInfo',
        header: [],
        data: [],
        height: '300',
        tabs: true,
      },
      editable: false,
      component: null,
      searchUrl: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getList();
    window.addEventListener('resize', this.resizeGrid);
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.setGridSize);
  },
  activated() {
    this.resizeGrid();
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl =
        selectConfig.psm.buildingFacilitiesLayout.fireProofs.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '90',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'category',
          width: '200',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000827'),
          dataField: 'fireProofsNm',
          width: '150',
          style: 'left-align',
        }, // 내화설비 또는 지역
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000826'),
          dataField: 'fireProofPart',
          width: '150',
          style: 'left-align',
        }, // 내화부위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004028'),
          dataField: 'testStnd',
          width: '200',
          style: 'left-align',
        }, // 내화시험기준 및 시간
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '300',
          style: 'left-align',
        }, // 비고
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
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClicked',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, // 검색
      ];
    },
    // combo box list
    cellClickHandler(event) {
      if (event.dataField === 'category') {
        this.openDialogPage(event.item);
      }
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openDialogPage(data) {
      if (data === undefined || data === '') {
        this.popupOptions.param = {
          fireProofsNo: 0,
        };
      } else {
        this.popupOptions.param = {
          fireProofsNo: data.fireProofsNo,
        };
      }

      this.popupOptions.target = () => import(`${'./fireProofsDialog.vue'}`);
      this.popupOptions.title = 'L0000003604'; // 내화구조명세서 상세

      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },

    closePopup() {
      this.getList();

      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /**
     * 사용자의 입력을 받는다.
     */
    getConfirm() {},
    /** button 관련 이벤트 **/
    btnSearchClickedCallback(_result) {
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** end button 관련 이벤트 **/
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 390;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
