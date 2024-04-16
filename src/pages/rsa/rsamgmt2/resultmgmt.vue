/* eslint-disable indent */ /* eslint-disable indent */
<!--
  목적 : 위험성평가 > 작업 위험성평가 관리 > 평가계획 관리
  Detail : 평가결과 관리 등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" :width="8" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 대상년도 -->
          <y-datepicker
            :width="8"
            type="year"
            name="assessYear"
            label="L0000004449"
            :default="searchParam.assessYear"
            v-model="searchParam.assessYear"
          />
        </b-col>
        <!-- 평기기법 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="rsaAssessTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000003416"
            name="assessTypeCd"
            v-model="searchParam.assessTypeCd"
          ></y-select>
        </b-col>
        <!-- 구분 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="rsaRegRegdemItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000686"
            name="regRegdemCd"
            v-model="searchParam.regRegdemCd"
          ></y-select>
        </b-col>
        <!-- 평가명 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003081"
            name="assessNm"
            v-model="searchParam.assessNm"
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
                :comboItems="statusItem"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="statusCd"
                v-model="searchParam.statusCd"
              ></y-select>
            </b-col>
            <b-col sm="4">
              <y-select
                :width="12"
                :comboItems="stateItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="stateCd"
                v-model="searchParam.stateCd"
              ></y-select>
            </b-col>
          </b-row>
        </b-col>
        <!-- 주관부서 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-tree-dept
            type="search"
            label="L0000005015"
            name="mainDeptCd"
            v-model="searchParam.mainDeptCd"
            :deptSubYn="searchParam.mainDeptSubYn"
            @setDeptSubYn="setMainDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <!-- 대상부서 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-tree-dept
            type="search"
            label="L0000000927"
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
        <!-- 평가기한초과 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <b-row>
            <b-col sm="7">
              <y-checkbox
                :width="5"
                :comboItems="[
                  { text: '', value: 'Y' },
                  { text: '', value: 'N' },
                ]"
                ui="bootstrap"
                name="searchParam.yearChk"
                :useDefault="true"
                label="L0000004971"
                v-model="searchParam.yearChk"
              />
            </b-col>
          </b-row>
        </b-col>
        <!-- 개선조치 기한초과 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <b-row>
            <b-col sm="7">
              <y-checkbox
                :width="5"
                :comboItems="[
                  { text: '', value: 'Y' },
                  { text: '', value: 'N' },
                ]"
                ui="bootstrap"
                name="searchParam.imprChk"
                :useDefault="true"
                label="L0000004983"
                v-model="searchParam.imprChk"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 무계획 결과 등록 -->
            <y-btn
              v-if="editable"
              title="L0000004982"
              color="orange"
              @btnClicked="openPopup"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <!-- 검색 -->
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
          <!-- 평가결과 관리 목록 -->
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :print="true"
            :use-paging="true"
            @tableLinkClicked="tableLinkAccidentTitleClicked"
            :cellClassName="tableCellClassName"
            label="L0000004993"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row>

    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-assess-plan',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '', // 사업장
      assessYear: '', // 대상년도
      assessNm: '',
      assessTypeCd: '',
      regRegdemCd: '', // 구분
      yearChk: '',
      imprChk: '',
      mainDeptSubYn: 'Y', // 하위부서여부 사용
      deptSubYn: 'Y', // 하위부서여부 사용
      riskType: '',
      monFlag: '',
      stateCd: '', // 상태
      apprStatusCd: '', // 결재상태
      mainDeptCd: '',
      deptCd: '',
      statusCd: null,
    },
    gridOptions: {
      header: [],
      data: [],
      height: 'auto',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    rsaAssessTypeItems: [], // 기법
    rsaRegRegdemItems: [], // 구분
    stateItems: [], // 결재상태
    statusItem: [{ code: null, codeNm: '결과' }], // 단계
    searchUrl: '',
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    tableCellClassName({ row, column, rowIndex, colIndex }) {
      if (column.property === 'overdueCnt' && row['overdueCnt'] !== '0') {
        return 'row-color';
      }
    },
    init() {
      this.editable = this.$route.meta.editable;

      this.searchParam.assessYear = this.$comm.moment().format('YYYY');
      // Url Setting
      this.searchUrl = selectConfig.rsa.resultmgmt.list.url;
      this.$comm.getComboItems('RSA_ASSESS_TYPE', true).then((_result) => {
        this.rsaAssessTypeItems = _result;
      });
      this.$comm.getComboItems('RSA_REG_REGDEM', true).then((_result) => {
        this.rsaRegRegdemItems = _result;
      });
      this.$comm.getComboItems('COM_STATE', true).then((_result) => {
        this.stateItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      if (this.$route.meta.param === 'W') {
        this.searchParam.riskType = 'work';
        this.searchParam.monFlag = '100';
      } else {
        this.searchParam.riskType = 'proc';
        this.searchParam.monFlag = '100';
      }

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
        this.searchParam.mainDeptCd = this.$store.getters.deptCd;
        this.searchParam.deptCd = '';
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        {
          text: 'L0000001415',
          name: 'plantNm',
          width: '100px',
          align: 'center',
        },
        // 주관부서
        {
          text: 'L0000005015',
          name: 'mainDeptNm',
          width: '120px',
          align: 'center',
        },
        // 평가기법
        {
          text: 'L0000003416',
          name: 'assessTypeNm',
          width: '90px',
          align: 'center',
        },
        // 평가명
        {
          text: 'L0000003081',
          name: 'assessNm',
          width: '180px',
          align: 'left',
          url: true,
        },
        // 구분
        {
          text: 'L0000000686',
          name: 'regRegdemNm',
          width: '80px',
          align: 'center',
        },
        // 대상부서
        {
          text: 'L0000000927',
          name: 'deptNm',
          width: '120px',
          align: 'center',
        },
        // 대상년도
        {
          text: 'L0000004449',
          name: 'assessYear',
          width: '80px',
          align: 'center',
        },
        // 평가일
        {
          text: 'L0000004980',
          name: 'assessFinishDt',
          width: '120px',
          align: 'center',
        },
        // 단계(상태)
        {
          text: 'L0000004972',
          name: 'stateNm',
          width: '150px',
          align: 'center',
          url: true,
        },
        // 결재상태
        // {
        //   text: 'L0000002564',
        //   name: 'rapprRqstNm',
        //   width: '100px',
        //   align: 'center',
        //   url: true,
        // },
        // 작성자
        {
          text: 'L0000002355',
          name: 'createUserNm',
          width: '130px',
          align: 'center',
        },
        // 작성일
        {
          text: 'L0000002352',
          name: 'createDt',
          width: '120px',
          align: 'center',
        },
        // 개선요청
        {
          text: 'L0000000264',
          name: 'requestCnt',
          width: '100px',
          align: 'center',
          url: true,
        },
        // 조치 미완료
        {
          text: 'L0000005012',
          name: 'incompletCnt',
          width: '100px',
          align: 'center',
          url: true,
        },
        // 조치기한초과
        {
          text: 'L0000005013',
          name: 'overdueCnt',
          width: '110px',
          align: 'center',
          url: true,
        },
        // 조치 완료
        {
          text: 'L0000002683',
          name: 'completCnt',
          width: '100px',
          align: 'center',
          url: true,
        },
      ];

      this.getList(); // 평가계획 목록 조회
    },

    /**
     * showAccidentPopup 호출
     * 평가계획 목록에 평가명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    tableLinkAccidentTitleClicked(header, data) {
      if (header.name === 'stateNm') {
        this.showApprProgressPopup(data);
      } else if (
        header.name === 'requestCnt' ||
        header.name === 'incompletCnt' ||
        header.name === 'overdueCnt' ||
        header.name === 'completCnt'
      ) {
        data.apprFlag = header.name;
        this.openImprPopup(data);
      } else {
        this.openPopup(data);
      }
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.rapprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openImprPopup(data) {
      this.popupOptions.target = () => import(`${'./resultmgmtImprPopup.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005000'; // '개선사항 목록';
      this.popupOptions.param = {
        imprClassCd: this.searchParam.riskType === 'work' ? 'ICL41' : 'ICL42',
        refTableId: data.assessDeptNo,
        apprFlag: data.apprFlag,
      };

      this.popupOptions.closeCallback = this.closePopup;
    },

    openPopup(data) {
      let param = {
        assessDeptNo: 0,
        newInsert: true,
        riskType: this.searchParam.riskType,
      };
      if (data) {
        data.newInsert = false;
        data.riskType = this.searchParam.riskType;
      }

      this.popupOptions.target = () => import(`${'./resultmgmtDetail.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000004984'; // '평가결과 관리 상세 등록/수정';
      this.popupOptions.param = data ? data : param;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /** 위험성 평가계획 수립 목록 검색 **/
    getList() {
      this.searchParam.yearChk =
        this.searchParam.yearChk === '' ? 'N' : this.searchParam.yearChk;
      this.searchParam.imprChk =
        this.searchParam.imprChk === '' ? 'N' : this.searchParam.imprChk;
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
                  v.mainDeptCd === this.$store.getters.deptCd ||
                  v.stepCd === 'BAPSG'
              )
            );
          }

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
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    setMainDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.mainDeptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
<style>
.row-color .el-button {
  color: red !important;
}
</style>
