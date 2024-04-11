<!--
  목적 : 안전 > 사고 > 사고통계
  Detail : 사고통계 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 발생년도 -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000001074"
            name="accidentYear"
            v-model="searchParam.accidentYear"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 사고구분 -->
          <y-select
            :width="8"
            :comboItems="accidentGubunItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000001386"
            name="accidentGubun"
            v-model="searchParam.accidentGubun"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 사고종류 -->
          <y-select
            :width="8"
            :comboItems="accidentTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000001406"
            name="accidentType"
            v-model="searchParam.accidentType"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 대분류 -->
          <y-select
            :width="8"
            :comboItems="comboFormOcuurMainCategoryItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="occKindCd"
            label="L0000000912"
            v-model="searchParam.occKindCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 중분류 -->
          <y-select
            :width="8"
            :comboItems="comboFormOcuurCategoryItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002729"
            name="occAttCd"
            v-model="searchParam.occAttCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 발생부서 -->
          <y-tree-dept
            label="L0000001076"
            type="search"
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
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 직접원인 -->
          <y-select
            :width="8"
            :comboItems="comboProvDirectlyReasonItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="immCauseCd"
            label="L0000002771"
            v-model="searchParam.immCauseCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 간접원인 -->
          <y-select
            :width="8"
            :comboItems="comboProvIndirectReasonItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="indCauseCd"
            label="L0000000220"
            v-model="searchParam.indCauseCd"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col>
        <y-auigrid
          ref="yAuiGrid"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001383')"
          :useExcelExport="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
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
  name: 'y-accident-total',
  props: {},
  data: () => ({
    searchParam: {
      accidentYear: '', // 기간(발생일)
      plantCd: '',
      deptCd: '', // 발생부서
      accidentGubun: '', // 사고구분
      accidentType: '', // 사고종류
      occKindCd: '', // 발생형태 대분류
      occAttCd: null, // 발생형태 중분류
      immCauseCd: '', // 사고원인 직접
      indCauseCd: '', // 사고원인 간접
      // accidentAttCd: '', // 사고분류
      // accidentLvlCd: '', // 사고등급
      deptSubYn: 'Y', // 하위부서여부 사용
    },
    gridOptions: {
      header: [],
      data: [],
      height: '300',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '90%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    accidentGubunItems: [],
    accidentTypeItems: [],
    comboFormOcuurMainCategoryItems: [],
    comboFormOcuurCategoryItems: [],
    comboProvDirectlyReasonItems: [],
    comboProvIndirectReasonItems: [],
    // comboAccidentClassItems: [],
    // comboAccidentLevlItems: [],
    editable: false,
    searchUrl: '',
  }),
  watch: {
    'searchParam.occKindCd': function (newValue, oldValue) {
      if (newValue) {
        this.$comm.getComboItems(newValue, true).then((_result) => {
          this.comboFormOcuurCategoryItems = _result;
          this.searchParam.occAttCd =
            this.$_.findIndex(this.comboFormOcuurCategoryItems, {
              code: this.searchParam.occAttCd,
            }) === -1
              ? null
              : this.searchParam.occAttCd;
        });
      } else {
        this.comboFormOcuurCategoryItems = [
          {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          },
        ];
        this.searchParam.occAttCd = null;
      }
    },
    'searchParam.accidentYear': function (newValue, oldValue) {
      if (!this.searchParam.accidentYear) {
        let today = this.$comm.getToday();
        this.searchParam.accidentYear = today.substring(0, 4);
      }
      // this.getList(); // 사고 현황 조회
    },
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
    this.getList(); // 사고 현황 조회
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.accident.status.url;
      this.searchParam.deptSubYn = 'Y';
      this.searchParam.accidentYear = this.$comm.getToday().substring(0, 4);

      this.comboFormOcuurCategoryItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') },
      ];
      this.accidentGubunItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') },
        {
          code: 'nearmiss',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001832'),
        }, // 아차사고
        {
          code: 'accident',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003652'),
        }, // 사고
      ];

      this.setGridHeader();
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, // 검색
      ];

      const promise1 = this.$comm.getComboItems('SAF_OCC_TYPE', true); // 사고종류
      const promise2 = this.$comm.getComboItems(
        'SAF_ACCIDENT_OCC_PTN_CLS',
        true
      ); // 대분류
      const promise3 = this.$comm.getComboItems('SAF_ACCIDENT_IMM_CAUSE', true); // 직접원인
      const promise4 = this.$comm.getComboItems('SAF_ACCIDENT_IND_CAUSE', true); // 간접원인
      Promise.all([promise1, promise2, promise3, promise4]).then((values) => {
        const [
          accidentType,
          ocuurMainCategory,
          directlyReason,
          indirectReason,
        ] = values;
        this.accidentTypeItems = accidentType;
        this.comboFormOcuurMainCategoryItems = ocuurMainCategory;
        this.comboProvDirectlyReasonItems = directlyReason;
        this.comboProvIndirectReasonItems = indirectReason;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 By 2022-05-09 장헌영 */
      const searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    /** 그리드 헤더 설정 */
    setGridHeader() {
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001386'),
          dataField: 'accident_gubun',
          width: '120',
          cellMerge: true,
        }, // 사고구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plant_nm',
          width: '90',
          cellMerge: true,
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001082'), // 발생형태
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000912'),
              dataField: 'occ_kind_nm',
              style: 'left-align',
              width: '150',
            }, // 대분류
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002729'),
              dataField: 'occ_att_nm',
              style: 'left-align',
              width: '150',
            }, // 중분류
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001397'), // 사고원인
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002771'),
              dataField: 'imm_cause_nm',
              style: 'left-align',
              width: '150',
            }, // 직접원인
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000220'),
              dataField: 'ind_cause_nm',
              style: 'left-align',
              width: '150',
            }, // 간접원인
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001076'),
          dataField: 'dept_nm',
          width: '150',
        }, // 발생부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001406'),
          dataField: 'accident_type_nm',
          width: '100',
        }, // 사고종류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003180'),
          dataField: 'sum',
          width: '90',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        }, // 합계
      ];
      for (let i = 1; i <= 12; i++) {
        let month = i < 10 ? '0' + i : i.toString();
        this.gridOptions.header.splice(i + 5, 0, {
          headerText: i + this.$comm.getLangSpecInfoLabel('L0000002108'), // 월
          dataField: this.searchParam.accidentYear + '-' + month,
          width: '90',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        });
      }

      if ((this.YAuiGrid || null) !== null) {
        this.YAuiGrid.changeColumnLayout(this.gridOptions.header);
      }
    },
    /** 사고 현황 검색 **/
    getList() {
      this.setGridHeader();

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
    /** button 관련 이벤트 **/
    btnSearchClickedCallback() {
      this.getList();
    },
    cellClickHandler(event) {
      if (
        event.dataField === 'accident_gubun' ||
        event.dataField === 'plant_nm' ||
        event.dataField === 'occ_kind_nm' ||
        event.dataField === 'occ_att_nm' ||
        event.dataField === 'imm_cause_nm' ||
        event.dataField === 'ind_cause_nm' ||
        event.dataField === 'dept_nm' ||
        event.dataField === 'accident_type_nm'
      ) {
        return;
      }

      // 사고구분이 사고 일시 사고 목록을 아차사고 일 경우 아차사고 목록을 보여준다.
      this.popupOptions.target = () => import(`${'./accidentTotalDetail.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        gubun: event.item.accident_gubun,
        popupMode: true,
        plantCd: event.item.plant_cd,
        occKindCd: event.item.occ_kind_cd,
        occAttCd: event.item.occ_att_cd,
        immCauseCd: event.item.imm_cause_cd,
        indCauseCd: event.item.ind_cause_cd,
        deptCd: event.item.dept_cd,
        accidentTypeCd: event.item.accident_type_cd,
        yearMonth:
          event.dataField === 'sum'
            ? this.searchParam.accidentYear
            : event.dataField,
      };
      if (event.item.accident_gubun === 'Nearmiss') {
        this.popupOptions.title = 'L0000001832'; // 아차사고
      } else {
        this.popupOptions.title = 'L0000003652'; // 사고
      }
      this.popupOptions.closeCallback = this.closePopup;
    },

    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
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
