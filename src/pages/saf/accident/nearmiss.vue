<!--
  목적 : 사고관리 - 아차사고
  Detail : 사고 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 기간(발생일) -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000770"
            name="period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 진행단계 -->
          <y-select
            :width="8"
            :comboItems="comboAccidentStepItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="checkStepCd"
            label="L0000002777"
            v-model="searchParam.processStepCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 사고종류 -->
          <y-select
            :width="8"
            :comboItems="occTypeCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="occTypeCd"
            label="L0000001406"
            v-model="searchParam.occTypeCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 발생장소 -->
          <y-text
            :width="8"
            ui="bootstrap"
            name="area"
            label="L0000001081"
            v-model="searchParam.area"
          ></y-text>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 아차사고명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            name="nearmissTitle"
            label="L0000001837"
            v-model="searchParam.nearmissTitle"
          ></y-text>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 발생부서 -->
          <y-tree-dept
            type="search"
            label="L0000001076"
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
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001833')"
          :useExcelExport="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @btnSearchCheckResult="btnSearchCheckResultOpenPopupClicked"
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
  name: 'y-accident-occur',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '',
      period: [], // 기간(발생일)
      startDate: '', // From
      endDate: '', // To
      deptCd: '', // 발생부서 코드
      area: '', // 발생장소
      nearmissTitle: '', // 사고명
      processStepCd: '', // 사내사고진행단계
      occTypeCd: '', // 사고유형코드
      deptSubYn: 'Y', // 하위부서여부 사용
    },
    YAuiGrid: null,
    gridOptions: {
      header: [],
      data: [],
      height: '300',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: null,
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    comboAccidentStepItems: [], // 사내사고진행단계
    occTypeCdItems: [], // 사고유형코드 목록
    searchUrl: '',
  }),
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

    Promise.all([
      // 사고유형코드 목록
      new Promise((resolve) => {
        this.$comm.getComboItems('SAF_OCC_TYPE', true).then((_result) => {
          this.occTypeCdItems = _result;
          resolve(true);
        });
      }),

      // 진행단계
      new Promise((resolve) => {
        this.$comm
          .getComboItems('SAF_NEARMISS_STEP', true)
          .then((_result) => {
            this.comboAccidentStepItems = _result;
            resolve(true);
          });
      }),
      // 직접원인
    ]).then((result) => {
      if (result) {
        /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 By 2022-05-09 장헌영 */
        let searchParamByCookie = this.$comm.setSearchParamByCookie();
        if (typeof searchParamByCookie !== 'undefined') {
          this.searchParam = searchParamByCookie;
        } else {
          let today = this.$comm.getToday();
          let from = this.$comm.getCalculatedDate(
            today,
            '-1m',
            'YYYY-MM-DD',
            'YYYY-MM-DD'
          );
          let to = this.$comm.getCalculatedDate(
            today,
            '1m',
            'YYYY-MM-DD',
            'YYYY-MM-DD'
          );
          this.searchParam.period = [from, to];
        }
      }

      this.getList(); // 사고 현황 조회
    });
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.nearmiss.list.url;
      this.searchParam.deptSubYn = 'Y';

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '90', 
        }, // 사업장 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002777'), 
          dataField: 'processStepNm', 
          width: '100', 
        }, // 진행단계 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001837'), 
          dataField: 'nearmissTitle', 
          width: '300', 
          style: 'left-align left-align', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {}, 
          },
        }, // 아차사고명 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001078'), 
          dataField: 'nearmissYmd', 
          width: '100', 
        }, // 발생일 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001076'), 
          dataField: 'deptNm', 
          width: '130', 
        }, // 발생부서 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001081'), 
          dataField: 'area', 
          width: '150', 
          style: 'left-align', 
        }, // 발생장소 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001386'), 
          dataField: 'nearKindNm', 
          width: '100', 
        }, // 사고구분 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001406'), 
          dataField: 'occTypeNm', 
          width: '150', 
        }, // 사고유형 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001662'), 
          dataField: 'showDeptNm', 
          width: '110', 
        }, // 소속 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'showUserNm', 
          width: '100', 
        }, // 작성자 
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
          btnClicked: 'btnSearchCheckResult',
          visible: this.editable,
        },  // 신규등록
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green', 
          btnClicked: 'btnSearch',
        },  // 검색
      ];
    },
    /** 사고등록 목록 조회 **/
    getList() {
      this.searchParam.startDate = this.$_.clone(this.searchParam.period[0]);
      this.searchParam.endDate = this.$_.clone(this.searchParam.period[1]);

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
    /**
     * showNearmissPopup 호출
     * 아차사고등록 목록에 사고명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    cellClickHandler(event) {
      if (event.dataField === 'nearmissTitle') {
        this.showNearmissPopup(event.item);
      }
    },
    /**
     * 해당 사고 상세보는 팝업 open
     */
    showNearmissPopup(data) {
      this.popupOptions.target = () => import(`${'./nearmissDetail.vue'}`);
      this.popupOptions.title = 'L0000001832'; // 아차사고
      this.popupOptions.param = {
        safNearmissNo: data.safNearmissNo, // 아차사고 번호
        bizApprStepCd: data.bizApprStepCd, // 결재진행상태
        processStepCd: data.processStepCd, // 진행단계
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.getList();

      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },

    /** button 관련 이벤트 **/
    btnSearchCheckResultOpenPopupClicked() {
      const data = {
        safNearmissNo: 0, // 아차사고 번호
        processStepCd: 'NEMS1', // 진행단계
        bizApprStepCd: '',
      };
      this.showNearmissPopup(data);
    },
    btnSearchClickedCallback() {
      this.getList();
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 370;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
