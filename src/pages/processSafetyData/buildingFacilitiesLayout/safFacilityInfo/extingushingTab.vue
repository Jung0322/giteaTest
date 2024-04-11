<!--
  목적 : 소화설비 설치계획 Tab
  Detail : 소화설비 설치계획 목록 화면
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
          <!-- 설치지역 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            type="search"
            label="L0000001628"
            name="location"
            v-model="searchParam.location"
            :tabApply="true"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <!-- 소화설비 설치계획 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :label="this.$comm.getLangSpecInfoLabel('L0000001673')"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @openDialogPage="openDialogPage"
          @btnSearch="btnSearchClickedCallback"
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
  name: 'extingushing-tab',
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
        tap: 'extingushingTab',
        plantCd: '',
        category: '',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'processSafetyDataExtingushingTab',
        header: [],
        data: [],
      },
      editable: false,
      baseWidth: 8,
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
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
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
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl =
        selectConfig.psm.buildingFacilitiesLayout.extingushing.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '90',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001628'),
          dataField: 'location',
          width: '250',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 설치지역
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001666'),
          dataField: 'extinguisher',
          width: '130',
        }, // 소화기
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002311'),
          dataField: 'spreadExtinguisher',
          width: '130',
        }, // 자동확산소화기
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002307'),
          dataField: 'autoExtinguisher',
          width: '130',
        }, // 자동소화장치
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002026'),
          dataField: 'indoorExtinguisher',
          width: '130',
        }, // 옥내소화전
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001724'),
          dataField: 'sprinkler',
          width: '130',
        }, // 스프링쿨러
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001051'),
          dataField: 'waterSpray',
          width: '130',
        }, // 물분무소화설비
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003140'),
          dataField: 'foamExtinguisher',
          width: '130',
        }, // 포소화설비
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000106'),
          dataField: 'co2Extinguisher',
          width: '130',
        }, // Co2소화설비
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003171'),
          dataField: 'halogenExtinguisher',
          width: '130',
        }, // 할로겐화합물소화설비
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002853'),
          dataField: 'cleanExtinguisher',
          width: '130',
        }, // 청정소화약제소화설비
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002027'),
          dataField: 'outdoorExtinguisher',
          width: '130',
        }, // 옥외소화전
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
          btnClicked: 'openDialogPage',
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
      if (event.dataField === 'location') {
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
          extingushingNo: 0,
        };
      } else {
        this.popupOptions.param = {
          extingushingNo: data.extingushingNo,
        };
      }

      this.popupOptions.target = () => import(`${'./extingushingDialog.vue'}`);
      this.popupOptions.title = 'L0000001674'; // 소화설비 설치계획 상세

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
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 360;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
