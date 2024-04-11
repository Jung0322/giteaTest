<!--
  목적 : 사고관리 - 사고 발생 등록
  Detail : 사고 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
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
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 단계/상태 -->
          <b-row>
            <b-col sm="4">
              <y-label label="L0000005147" />
            </b-col>
            <b-col sm="4">
              <y-select
                :width="12"
                :comboItems="comboAccidentStepItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="checkStepCd"
                v-model="searchParam.accidentStepCd"
              ></y-select>
            </b-col>
            <b-col sm="4">
              <y-select
                :width="12"
                :comboItems="apprItems"
                itemText="codeNm"
                itemValue="codeNm"
                ui="bootstrap"
                name="stateCd"
                v-model="searchParam.bizApprStepNm"
              ></y-select>
            </b-col>
          </b-row>
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
          <!-- 사고명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            name="accidentTitle"
            label="L0000001390"
            v-model="searchParam.accidentTitle"
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
      <b-col sm="12" class="h100p">
        <!-- 사고 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001382')"
          :useExcelExport="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableSorting="true"
          @cellClick="cellClickHandler"
          @btnOpenPop="btnSearchCheckResultOpenPopupClicked"
          @btnSearch="getList"
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
  name: 'accident-occur',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '',
      period: [], // 기간(발생일)
      startDate: '', // From
      endDate: '', // To
      deptCd: '', // 발생부서 코드
      area: '', // 발생장소
      accidentTitle: '', // 사고명
      accidentStepCd: '', // 사내사고진행단계
      // accidentStepCds: [], // 사내사고진행단계
      searchFlag: 'ocuur',
      deptSubYn: 'Y', // 하위부서여부 사용
      bizApprStepNm: '', // 단계(결재상태)
    },
    YAuiGrid: null,
    gridOptions: {
      name: 'accidentAccidentOccur',
      header: [],
      data: [],
      height: '400',
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
    searchUrl: '',
    apprItems: [], // 상태(결재) 아이템
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
    this.getList(); // 사고등록 목록 조회
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // 기간 Setting
      const from = this.$comm.getToday();
      const to = this.$comm.getCalculatedDate(this.$comm.getToday(), '3m', 'YYYY-MM-DD', 'YYYY-MM-DD');
      this.searchParam.period = [from, to];

      // Url Setting
      this.searchUrl = selectConfig.saf.accident.list.url;
      this.searchParam.deptSubYn = 'Y';
      this.searchParam.bizApprStepNm = '전체';

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '100', 
        }, // 사업장 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001390'), 
          dataField: 'accidentTitle', 
          width: '260', 
          style: 'left-align', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {}, 
          },
        }, // 사고명 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'), 
          dataField: 'stateNm', 
          width: '150', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {}, 
          },
        }, // 단계(상태) 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001078'), 
          dataField: 'accidentYmd', 
          width: '120', 
        }, // 발생일 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001076'), 
          dataField: 'deptNm', 
          width: '150', 
          style: 'left-align', 
        }, // 발생부서 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001081'), 
          dataField: 'area', 
          width: '150', 


        }, // 발생장소 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001386'), 
          dataField: 'accKindNms', 
          width: '180', 
        }, // 사고구분 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001406'), 
          dataField: 'accidentTypeNms', 
          width: '180', 
        }, // 사고종류 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001401'), 
          dataField: 'victimNms', 
          width: '150', 
        }, // 사고자 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001405'), 
          dataField: 'investYnNm', 
          width: '120', 
        }, // 사고조사대상 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writerUserNm', 
          width: '120', 
        }, /* 작성자 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'writerDt', 
          width: '120', 
        }, /* 작성일 */ 
      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000001789'), 
          color: 'orange', 
          btnClicked: 'btnOpenPop',
          visible: this.editable,
        },  //  신규등록
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green', 
          btnClicked: 'btnSearch',
        },  //  검색
      ];

      // 사내사고진행단계
      this.$comm.getComboItems('SAF_ACCIDENT_STEP', true).then((_result) => {
        this.comboAccidentStepItems = _result;
        if (
          this.$_.findIndex(this.comboAccidentStepItems, {
            code: this.searchParam.accidentStepCd,
          }) === -1
        ) {
          this.searchParam.accidentStepCd = '';
        }
      });

      // 상태(결재)
      this.$comm.getComboItems('COM_BIZ_APPR_STEP', true).then((_result) => {
        this.apprItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      const searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    /**
     * showAccidentPopup 호출
     * 사고등록 목록에 사고명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    cellClickHandler(event) {
      if (event.dataField === 'accidentTitle') {
        this.showAccidentPopup(event.item, false);
      } else if (event.dataField === 'stateNm') {
        this.showApprProgressPopup(event.item);
      }
    },
    /**
     * 해당 사고 상세보는 팝업 open
     */
    showAccidentPopup(data, flag) {
      let tabIndex = 5;
      if (data.accidentStepCd === 'ACCS0' || !data.accidentStepCd) {
        tabIndex = 0;
      } else if (data.accidentStepCd === 'ACCS1') {
        tabIndex = 1;
      } else if (data.accidentStepCd === 'ACCS2') {
        tabIndex = 3;
      }

      this.popupOptions.target = () => import(`${'./accidentDetail.vue'}`);
      this.popupOptions.title = 'L0000003652'; // 사고
      this.popupOptions.param = {
        safAccidentNo: data.safAccidentNo, // 사내사고번호
        accidentStepCd: data.accidentStepCd, // 사내사고진행단계
        investYn: data.investYn,
        insertFlag: 'occur',
        tabIndex: tabIndex,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
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
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === null || data === undefined) return;
      this.getList();
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.apprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /** button 관련 이벤트 **/
    btnSearchCheckResultOpenPopupClicked() {
      var data = {
        safAccidentNo: 0, // 사내사고번호
        accidentStepCd: '', // 사내사고진행단계 (계획)
      };
      this.showAccidentPopup(data, true);
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
    resizeGrid() {
      let _height = window.innerHeight - 335;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
