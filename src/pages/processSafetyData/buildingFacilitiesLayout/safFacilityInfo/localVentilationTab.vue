<!--
  목적 : 국소배기장치 설치계획
  Detail : 국소배기장치 설치계획 목록 화면
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
          <!-- 공정또는작업장명 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            label="L0000000533"
            name="processNm"
            v-model="searchParam.processNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 실내외구분 L0000004046-->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            label="L0000001807"
            name="inoutFlag"
            v-model="searchParam.inoutFlag"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 발생원 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            label="L0000001077"
            name="category"
            v-model="searchParam.source"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 유해물질종류 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            label="L0000002165"
            name="harmfulType"
            v-model="searchParam.harmfulType"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <!-- 국소배기장치 설치계획 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :label="this.$comm.getLangSpecInfoLabel('L0000000704')"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @openDialogPage="openDialogPage"
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
        tap: 'localVentilationTab',
        plantCd: '',
        source: '',
        processNm: '',
        inoutFlag: '',
        harmfulType: '',
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
      },
      gridOptionsX: {
        header: [],
        height: '300',
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
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.setGridSize);
  },
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.editable = this.$route.meta.editable;
      this.searchUrl =
        selectConfig.psm.buildingFacilitiesLayout.localVentilation.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '100',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000533'),
          dataField: 'processNm',
          width: '200',
          style: 'left-align',
        }, // 공정또는작업장명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004046'),
          dataField: 'inoutFlag',
          width: '200',
          style: 'left-align',
        }, // 옥내,외구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001077'),
          dataField: 'source',
          width: '200',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 발생원
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002165'),
          dataField: 'harmfulType',
          width: '200',
          style: 'left-align',
        }, // 유해물질종류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003367'),
          dataField: 'hoodForm',
          width: '200',
        }, // 후드형식
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004047'),
          dataField: 'hoodVelocity',
          width: '200',
        }, // 후드의 제어풍속(m/s)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004048'),
          dataField: 'reactionVelocity',
          width: '200',
        }, // 덕트내 반송 속도(m/s)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004049'),
          dataField: 'exairVol',
          width: '200',
        }, // 배출풍량(㎥/min)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004050'),
          dataField: 'prairVol',
          width: '200',
        }, // 처리풍량(㎥/min)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002497'), // 전동기
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004306'),
              dataField: 'motorVol',
              width: '150',
            }, // 용량(KW)
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001126'),
              dataField: 'motorEpForm',
              width: '150',
            }, // 방폭형식
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001135'),
          dataField: 'airExhaustOrder',
          width: '200',
        }, // 배기및처리순서
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
          btnClickedError: 'btnClickedError',
          visible: this.editable,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
          btnClickedError: 'btnClickedError',
        }, // 검색
      ];
    },
    // combo box list
    cellClickHandler(event) {
      if (event.dataField === 'source') {
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
          localVentilationNo: 0,
        };
      } else {
        this.popupOptions.param = {
          localVentilationNo: data.localVentilationNo,
        };
      }

      this.popupOptions.target = () =>
        import(`${'./localVentilationDialog.vue'}`);
      this.popupOptions.title = 'L0000000713'; // 국소배기장치 설치계획서 상세

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
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 430;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
