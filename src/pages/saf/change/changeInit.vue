<!--
  목적 : 안전 - 변경관리
  Detail : 변경관리 조회 화면
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
          <!-- 기간(요청일) -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000771"
            name="rqstPeriod"
            v-model="searchParam.rqstPeriod"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 변경구분 -->
          <y-select
            :width="8"
            :comboItems="chngClsCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="chngAttCd"
            label="L0000001226"
            v-model="searchParam.chngAttCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 요청부서 -->
          <y-tree-dept
            type="search"
            label="L0000002053"
            :showAllDept="false"
            name="rqstDeptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.rqstDeptCd"
            :deptSubYn="searchParam.rqstDeptSubYn"
            @setDeptSubYn="setRqstDeptSubYn"
          />
          <!-- 
              하위부서 포함 조회 위해 아래 코드 추가
              :deptSubYn="searchParam.deptSubYn"
              @setDeptSubYn="setDeptSubYn"
             -->
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 제목 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002616"
            name="bizNm"
            v-model="searchParam.bizNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001222')"
          :useExcelExport="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @openDetailPage="openPopup"
          @btnSearchClicked="btnSearchClickedCallback"
          @closeConstPopup="closeConstPopup('CLOSE')"
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
  name: 'y-change-init',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '',
      rqstPeriod: [],
      rqstDeptCd: null,
      chngStepCd: 'CGSP1',
      chngAttCd: null,
      bizNm: '',
      rqstDeptSubYn: 'Y',
    },
    YAuiGrid: null,
    gridOptions: {
      name: 'changechangeInit',
      header: [],
      data: [],
      height: '400',
    },    
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '80%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    chngClsCdItems: [], // 변경종류
    searchUrl: '',
  }),
  watch: {},
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
    this.setGridBtns();
    this.resizeGrid();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.change.list.url;

      this.searchParam.rqstDeptSubYn = 'Y';

      // 기간 Setting
      let today = this.$comm.getToday();
      let from = this.$comm.getCalculatedDate(
        today,
        '-3m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.rqstPeriod = [from, today];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), // 사업장
          dataField: 'plantNm',
          width: '150px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002616'), // 제목
          dataField: 'bizNm',
          width: '250px',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002777'), // 진행단계
          dataField: 'chngStepNm',
          width: '150px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000451'), // 결재진행단계
          dataField: 'bizApprStepNm',
          width: '120px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001226'), // 변경구분
          dataField: 'chngAttNm',
          width: '100px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001042'), // 문서번호
          dataField: 'chngNum',
          width: '120px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002055'), // 요청일
          dataField: 'rqstDt',
          width: '120px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002053'), // 요청부서
          dataField: 'rqstDeptNm',
          width: '120px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002057'), // 요청자
          dataField: 'rqstUserNm',
          width: '100px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002043'), // 완료일
          dataField: 'confirmDt',
          width: '120px',
          style: 'center-align',
        },
      ];

      // 변경구분
      this.$comm.getComboItems('SAF_CHNG_ATT', true).then((_result) => {
        this.chngClsCdItems = _result;
      });
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList(); // 변경관리 목록 조회
    },
    /** 변경관리 목록 검색 **/
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
    /**
     * showAccidentPopup 호출
     * 평가계획 목록에 평가명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    cellClickHandler(event) {
      if (event.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'bizNm') {
        this.openPopup(event.item);
      }
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
    openPopup(data) {
      this.popupOptions.param = {
        safChngNo: data ? data.safChngNo : 0, // key
        chngStepCd: data ? data.chngStepCd : '', // 진행상태
      };
      this.popupOptions.target = () => import(`${'./changeDetail.vue'}`);
      this.popupOptions.title = 'L0000001221'; // 변경관리
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    // 하위부서 포함 조회 관련 함수 추가
    setRqstDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.rqstDeptSubYn = _result;
    },
    setGridBtns() {
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'), // 신규등록
          color: 'orange',
          btnClicked: 'openDetailPage',
          visible: this.editable,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), // 검색
          color: 'green',
          btnClicked: 'btnSearchClicked',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'), // 선택
          color: 'orange',
          selectConst: 'selectConst',
          visible: false,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), // 닫기
          btnClicked: 'closeConstPopup',
          visible: false,
        },
      ];

      this.YAuiGrid.setBtnArr(this.gridOptions.btns);
    },
    // 검색
    btnSearchClickedCallback(_result) {
      this.getList();
    },
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