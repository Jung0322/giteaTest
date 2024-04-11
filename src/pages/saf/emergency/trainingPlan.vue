<!--
  목적 : 훈련계획 관리
  Detail : 훈련계획 관리 목록 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 훈련기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            type="day"
            name="trainDt"
            label="L0000003376"
            :default="searchParam.trainDt"
            v-model="searchParam.trainDt"
          />
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 훈련구분 -->
          <y-select
            :width="8"
            :comboItems="trainTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000003375"
            name="trainTypeCd"
            v-model="searchParam.trainTypeCd"
          ></y-select>
        </b-col>

        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 훈련명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003378"
            name="trainNm"
            v-model="searchParam.trainNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 훈련장소 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003386"
            name="trainPlace"
            v-model="searchParam.trainPlace"
          ></y-text>
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
                :disabled="true"
                :comboItems="procStepItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="procStepCd"
                v-model="searchParam.procStepCd"
              ></y-select>
            </b-col>
            <b-col sm="4">
              <y-select
                :width="12"
                :comboItems="processStepItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="stateCd"
                v-model="searchParam.stateCd"
              ></y-select>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 주관부서 -->
          <y-tree-dept
            type="search"
            label="L0000005015"
            name="deptCd"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005178')"
          :useExcelExport="true"
          :enableSorting = "true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @btnOpenPopup="openPopup"
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
  name: 'y-subcon-eval-result',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '',
      trainDt: null, // 훈련기간
      trainTypeCd: null, // 훈련구분
      trainNm: '', // 훈련명
      trainPlace: '', // 훈련장소
      deptCd: null, // 주관부서
      procStepCd: 'STS01', // 진행상태
      deptSubYn: 'Y', // 하위부서여부 사용
      state_cd: null,
    },
    YAuiGrid: null,
    gridOptions: {
      name: 'safEmergencyTrainingPlan',
      header: [],
      data: [],
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
    trainTypeItems: [], // 훈련구분
    processStepItems: [], // 진행상태
    procStepItems: [{ code: 'STS01', codeNm: '계획' }], // 단계
    searchUrl: '',
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
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
    this.resizeGrid();
    this.getList(); // 협력업체 평가계획 목록 조회
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // URL 세팅
      this.searchUrl = selectConfig.saf.emergency.list.url;
      // 훈련구분
      this.$comm.getComboItems('SAF_TRA_COURSE_CLS', true).then((_result) => {
        this.trainTypeItems = _result;
      });
      // 진행상태
      this.$comm.getComboItems('COM_PROCESS_STEP', true).then((_result) => {
        this.processStepItems = _result;
      });

      const from = this.$comm.getCalculatedDate(this.$comm.getToday(), '0m', 'YYYY-MM-DD', 'YYYY-MM-DD');
      const to = this.$comm.getCalculatedDate(this.$comm.getToday(), '3m', 'YYYY-MM-DD', 'YYYY-MM-DD');
      this.searchParam.trainDt = [from, to];

      // 권한별 컨트롤 처리
      if (this.$comm.isCompanyGrp()) {
        // 전사권한
        this.companyEditable = true;
        this.plantEditable = true;
        this.deptEditable = true;
      } else if (this.$comm.isPlantGrp()) {
        // 사업장권한
        this.plantEditable = true;
        this.deptEditable = true;
      } // 일반권한
      else {
        this.deptEditable = true;
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '90', 
        }, /* 사업장 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003375'), 
          dataField: 'trainTypeNm', 
          width: '150', 
        }, /* 훈련구분 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003385'), 
          dataField: 'trainYmd', 
          width: '100', 
        }, /* 훈련일 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003379'), 
          dataField: 'trainTime', 
          width: '140', 
        }, /* 훈련시간 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003378'), 
          dataField: 'trainNm', 
          width: '200', 
          style: 'left-align', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {}, 
          },
        }, /* 훈련명 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003386'), 
          dataField: 'trainPlace', 
          width: '150', 
        }, /* 훈련장소 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000005015'), 
          dataField: 'deptNm', 
          width: '150', 
        }, /* 주관부서 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'), 
          dataField: 'stateAnm', 
          width: '120', 
        }, /* 단계(상태) */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'createUserNm', 
          width: '130', 
        }, /* 작성자 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'createDt', 
          width: '100', 
        }, /* 작성일 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000005192'), 
          dataField: 'userCnt', 
          width: '100', 
          style: 'right-align', 
        }, /* 참여인원수 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'), 
          dataField: 'subDeptCnt', 
          width: '100', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {}, 
          },
        }, /* 대상부서 */ 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000005378'), 
          dataField: 'stateNCnt', 
          width: '100', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {}, 
          },
        }, // 훈련미완료 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000005379'), 
          dataField: 'overDateCnt', 
          width: '100', 
          styleFunction: function (rowIndex, columnIndex, value, headerText, item, dataField) {
            return Number(value) !== 0 ? "grid-link-cell-red" : "grid-link-cell";
          }
        }, // 훈련 기한초과 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000005380'), 
          dataField: 'stateYCnt', 
          width: '100', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {}, 
          },
        }, // 훈련완료 

      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000001789'), 
          color: 'orange', 
          btnClicked: 'btnOpenPopup',
          visible: this.editable,
        },  // 신규등록
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green', 
          btnClicked: 'btnSearch',
        },  // 검색
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      const searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    /** 협력업체 평가계획 수립 목록 검색 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          if (this.companyEditable) {
            // 전사권한 : 전체 건
            this.gridOptions.data = this.$_.clone(_result.data);
          } else if (this.plantEditable) {
            // 사업장권한 : 내 사업장 등록 건
            this.gridOptions.data = this.$_.clone(
              _result.data.filter(
                (v) => v.plantCd === this.$store.getters.plantCd
              )
            );
          } else if (this.deptEditable) {
            // 일반권한 : 내 부서 등록 건 + 타 부서 평가완료 건
            this.gridOptions.data = this.$_.clone(
              _result.data.filter(
                (v) =>
                  v.deptCd === this.$store.getters.deptCd ||
                  v.stateCd === 'PSEND'
              )
            );
          }
          this.YAuiGrid.setGridData(this.gridOptions.data);
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
      if (event.dataField === 'stepNm') {
        this.showApprProgressPopup(event.item);
      } else if (
        event.dataField === 'subDeptCnt' ||
        event.dataField === 'stateNCnt' ||
        event.dataField === 'overDateCnt' ||
        event.dataField === 'stateYCnt'
      ) {
        const data = this.$_.cloneDeep(event.item);
        data.apprFlag = event.dataField;
        this.openResultPopup(data);
      } else if (event.dataField === 'trainNm') {
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
    openResultPopup(data) {
      this.popupOptions.param = data ? data : { safTrainPlanNo: 0 };
      this.popupOptions.target = () =>
        import(`${'./trainingTargetDeptListPopup.vue'}`);
      this.popupOptions.title = 'L0000000928'; /* 대상부서 목록 */
      this.popupOptions.width = '80%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup2;
    },
    openPopup(data) {
      this.popupOptions.param = data ? data : { safTrainPlanNo: 0 };
      this.popupOptions.target = () => import(`${'./trainingPlanDetail.vue'}`);
      this.popupOptions.title = 'L0000005179'; /* 훈련계획 관리 */
      this.popupOptions.width = '80%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    closePopup2(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },

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