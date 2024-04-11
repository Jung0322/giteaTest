<!--
  목적 : 인터록 작동조건 및 가동중지 범위
  Detail : 인터록 작동조건 및 가동중지 범위 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 인터록번호 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            type="search"
            label="L0000002247"
            name="interLockNo"
            v-model="searchParam.interLockNo"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 대상설비 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            type="search"
            label="L0000000931"
            name="facilityNm"
            v-model="searchParam.facilityNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <!-- 인터락 작동조건 및 가동중지 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :label="this.$comm.getLangSpecInfoLabel('L0000002244')"
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
  name: 'opr-cond',
  props: {
    tabIndex: 0,
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '70%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchArea: {
        title: '검색박스숨기기', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        plantCd: '',
        facilityNm: '',
        interLockNo: '',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'processSafetyDataInterLock',
        header: [],
        data: [],
      },
      baseWidth: 8,
      component: null,
      searchUrl: '',
      editable: false,
    };
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
    // window.addEventListener('resize', this.setGridSize);
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
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
      // Url Setting
      this.searchUrl = selectConfig.psm.processChart.interLock.list.url;
      this.editable = this.$route.meta.editable;
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '90', 
        }, // 사업장 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002247'), 
          dataField: 'interLockNo', 
          width: '200', 
        }, // 인터록번호 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000931'), 
          dataField: 'facilityNm', 
          width: '150', 
          style: 'left-align', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {}, 
          },
        }, // 대상설비 
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001622'), // 설정값
          children: [
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000002028'), 
              dataField: 'temperature', 
              width: '150', 
            }, // 온도 
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000001906'), 
              dataField: 'pressure', 
              width: '150', 
            }, // 압력 
            { 
              headerText: this.$comm.getLangSpecInfoLabel('L0000001913'), 
              dataField: 'liquidLevel', 
              width: '150', 
            }, // 액위 
            { 
              headerText: '기타', 
              dataField: 'etc', 
              width: '150', 
            }, 
          ],
        },
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000246'), 
          dataField: 'detectorNum', 
          width: '100', 
        }, // 감지기번호 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002889'), 
          dataField: 'lastOprFacil', 
          width: '150', 
        }, // 최종작동설비 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000198'), 
          dataField: 'oprStopRange', 
          width: '150', 
        }, // 가동중지범위 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002579'), 
          dataField: 'period', 
          width: '150', 
        }, // 점검주기 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
          dataField: 'remark', 
          width: '250', 
          style: 'left-align',
        }, // 비고 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writerUserNm', 
          width: '100', 
        }, /* 작성자 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'writerDt', 
          width: '100', 
        }, /* 작성일 */ 
      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000001789'), 
          color: 'orange', 
          btnClicked: 'btnPopupClicked',
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        },  // 신규등록
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green', 
          btnClicked: 'btnSearch',
          btnClickedError: 'btnClickedError',
        },  // 검색
      ]; 
    },
    // combo box list
    cellClickHandler(event) {
      if (event.dataField !== 'facilityNm') return;
      this.openDialogPage(event.item);
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
      if (data === undefined || data === '') {
        this.popupOptions.param = {
          interLockSeq: 0,
        };
      } else {
        this.popupOptions.param = {
          interLockSeq: data.interLockSeq,
        };
      }

      this.popupOptions.target = () => import(`${'./interLockDialog.vue'}`);
      this.popupOptions.title = 'L0000002245'; // 인터락 작동조건 및 가동중지 상세

      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },

    // 검색박스숨기기

    closePopup() {
      this.getList();

      this.popupOptions.target = null;
      this.popupOptions.visible = false;
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
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 390;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>