<!--
  목적 : 안전운전계획 > 비상사태 대비대응 > 훈련시나리오
  작성자 : LHJ
  Detail : 안전운전계획 > 비상사태 대비대응 > 훈련시나리오
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색조건 -->
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <y-plant
            type="search"
            name="plantCd"
            :width="9"
            v-model="searchParam.plantCd"
          />
        </b-col>

        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 분류 -->
          <y-select
            :width="9"
            :comboItems="trainSceTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000001341"
            name="trainSceTypeCd"
            v-model="searchParam.trainSceTypeCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 매뉴얼명 -->
          <y-text
            :width="9"
            ui="bootstrap"
            label="L0000005365"
            name="title"
            v-model="searchParam.title"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 주관부서 -->
          <y-tree-dept
            :width="9"
            type="search"
            name="deptCd"
            label="L0000002713"
            :notAcceptRole="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <!-- 훈련시나리오 목록 L0000003382-->
        <!-- 훈련 매뉴얼 목록 L0000005361-->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005361')"
          :useExcelExport="editable && !popupParam.popMode"
          :enableSorting="editable && !popupParam.popMode"
          :showGridSetSave="editable && !popupParam.popMode"
          :showRowCheckColumn="popupParam.popMode"
          @cellClick="cellClickHandler"
          @openDetailPage="openDetailPage"
          @btnSelectTrainSce="btnSelectTrainSce"
          @btnSearch="btnSearchClickedCallback"
          @btnClose="closepopMode"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOpt"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'training-sinario',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          plantCd: null,
          popMode: false,
        };
      },
    },
  },
  data() {
    return {
      // 검색 조건
      searchParam: {
        plantCd: '',
        title: '',
        trainSceTypeCd: '',
        deptCd: '',
        deptSubYn: 'Y', // 하위부서여부 사용
      },
      // GRID 옵션들
      YAuiGrid: null,
      gridOptions: {
        name: 'mgtTrainingTrainingScenario',
        header: [],
        data: [],
      },
      popupOpt: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
        customCallBack: null,
      },
      // list 페이지에서 필수 속성
      searchUrl: '',
      editable: true, // 페이지내 쓰기권한 여부
      trainSceTypeItems: [],
    };
  },
  computed: {},
  watch: {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
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
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      if (this.popupParam.popMode) {
        this.searchParam.plantCd = this.popupParam.plantCd;
      }
      this.$comm.getComboItems('SAF_TRA_SCE_TYPE', true).then((_result) => {
        this.trainSceTypeItems = _result;
      });

      this.searchUrl =
        selectConfig.sop.emergencyState.trainingScenario.list.url;
      this.searchParam.deptSubYn = 'Y';

      // 기본 헤더
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '11%',
        }, // 부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001341'),
          dataField: 'trainSceTypeNm',
          width: '11%',
        }, // 분류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004754'),
          dataField: 'sceNum',
          width: '11%',
        }, // 변경발의번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005365'),
          dataField: 'title',
          width: '16%',
          style: 'left-align',
        }, // 매뉴얼명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000293'),
          dataField: 'revNum',
          width: '11%',
        }, // 개정번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002459'),
          dataField: 'createDt',
          width: '11%',
        }, // 재개정일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '11%',
        } /* 작성자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '11%',
        } /* 작성일 */,
      ];
      if (this.popupParam.popMode === false) {
        const idx = this.gridOptions.header.findIndex(
          (item) => item.dataField === 'title'
        );
        if (idx > 0) {
          this.gridOptions.header[idx].renderer = {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          };
        }
      }

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openDetailPage',
          visible: this.editable && !this.popupParam.popMode,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnSelectTrainSce',
          visible: this.editable && this.popupParam.popMode,
        }, // 선택
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, // 검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClose',
          visible: this.popupParam.popMode,
        }, // 닫기
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      const searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (
        typeof searchParamByCookie !== 'undefined' &&
        !this.popupParam.popMode
      ) {
        this.searchParam = searchParamByCookie;
      }
    },
    // 리스트 검색
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          if (!this.popupParam.popMode) {
            this.$comm.pushCookie(this.searchParam);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /Button Event **/
    // 테이블 링크 클릭 팝업띄움
    cellClickHandler(event) {
      if (event.dataField === 'title') {
        this.openDetailPage(event.dataField, event.item);
      }
    },
    // detail 팝업 열기(등록, 수정)
    openDetailPage(header, data) {
      this.popupOpt.visible = true;
      this.popupOpt.closeCallback = this.closePopup;

      if (header && header.name === 'revNum') {
        this.popupOpt.target = () =>
          import(`${'./trainingScenarioHistory.vue'}`);
        // this.popupOpt.title = 'L0000003472'; // 훈련 시나리오 개정이력
        this.popupOpt.title = 'L0000005363'; // 훈련 매뉴얼 개정이력
        this.popupOpt.param = {
          trainSceGrpNo: data ? data.trainSceGrpNo : 0,
        };
      } else {
        this.popupOpt.target = () =>
          import(`${'./trainingScenarioDetail.vue'}`);
        // this.popupOpt.title = 'L0000003381'; // 훈련시나리오 등록/수정
        this.popupOpt.title = 'L0000005362'; // 훈련 매뉴얼 등록/수정
        this.popupOpt.param = {
          trainSceNo: data ? data.trainSceNo : 0,
        };
      }
    },
    // detail 팝업 닫음 ( 자식창에서 호출 됨... )
    closePopup(data) {
      this.popupOpt.target = null;
      this.popupOpt.visible = false;
      this.getList();
    },
    // 페이지별 default method 모음
    btnSearchClickedCallback() {
      this.getList();
    },
    btnSelectTrainSce() {
      if (this.YAuiGrid.getCheckedRowItemsAll().length < 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000630', // 훈련 시나리오를 선택해주세요
          type: 'warning',
        });
        return;
      }

      this.closepopMode();
    },
    closepopMode() {
      this.$emit('closePopup', {
        success: true,
        data: this.YAuiGrid.getCheckedRowItemsAll(),
      });
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    resizeGrid() {
      let _height = window.innerHeight < 500 ? 250 : window.innerHeight - 330;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
