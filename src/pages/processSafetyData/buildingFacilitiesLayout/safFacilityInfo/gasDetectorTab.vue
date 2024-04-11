<!--
  목적 : 가스누출감지 경보기 설치계획 Tab
  Detail : 가스누출감지 경보기 설치계획 목록 화면
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
          <!-- 감지기번호 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            type="search"
            label="L0000000246"
            name="mgrNum"
            v-model="searchParam.mgrNum"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 감지대상 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            type="search"
            label="L0000000247"
            name="sensingObj"
            v-model="searchParam.sensingObj"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 설치장소 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            type="search"
            label="L0000003703"
            name="location"
            v-model="searchParam.location"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <!-- 가스누출감지 경보기 설치계획 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :label="this.$comm.getLangSpecInfoLabel('L0000000201')"
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
        tap: 'gasDectorTab',
        plantCd: '',
        mgrNum: '',
        sensingObj: '',
        location: '',
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
        tabs: true,
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
  activated() {
    this.resizeGrid();
  },
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.editable = this.$route.meta.editable;
      this.searchUrl =
        selectConfig.psm.buildingFacilitiesLayout.gasDetector.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '90',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000246'),
          dataField: 'mgrNum',
          width: '200',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 감지기번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000247'),
          dataField: 'sensingObj',
          width: '200',
        }, // 감지대상
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003703'),
          dataField: 'location',
          width: '200',
        }, // 설치장소
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002344'),
          dataField: 'oprTm',
          width: '200',
        }, // 작동시간
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002934'),
          dataField: 'detectMethod',
          width: '200',
        }, // 측정방식
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000460'), // 경보설정값
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004038'),
              dataField: 'alarmDisplay',
              width: '150',
            }, // 경보표시
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000004039'),
              dataField: 'alarmRange',
              width: '150',
            }, // 설정범위
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004041'),
          dataField: 'alarmLocation',
          width: '200',
        }, // 경보기위치
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002602'),
          dataField: 'precision',
          width: '200',
        }, // 정밀도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004040'),
          dataField: 'measureinfo',
          width: '250',
          style: 'left-align',
        }, // 경보시 조치내용
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002163'),
          dataField: 'management',
          width: '200',
        }, // 유지관리
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004102'),
          dataField: 'remark',
          width: '250',
          style: 'left-align',
        }, // 비고(방폭형식)
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
      if (event.dataField === 'mgrNum') {
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
          gasDetectorNo: 0,
        };
      } else {
        this.popupOptions.param = {
          gasDetectorNo: data.gasDetectorNo,
        };
      }

      this.popupOptions.target = () => import(`${'./gasDetectorDialog.vue'}`);
      this.popupOptions.title = 'L0000000207'; // 가스누출감지 경보기 설치계획 상세

      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
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
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 360;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
