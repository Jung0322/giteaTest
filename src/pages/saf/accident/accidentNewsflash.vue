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
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-datepicker
            :width="8"
            :range="true"
            label="기간(발생일)"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-dept
            type="search"
            label="발생부서"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text :width="8" ui="bootstrap" name="area" label="발생장소" v-model="searchParam.area"></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            name="accidentTitle"
            label="사고명"
            v-model="searchParam.accidentTitle"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="comboAccidentStepItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="checkStepCd"
            label="진행단계"
            v-model="searchParam.accidentStepCd"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn
              v-if="editable"
              title="신규등록"
              color="orange"
              @btnClicked="btnSearchCheckResultOpenPopupClicked"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <y-btn
              title="검색"
              color="green"
              @btnClicked="getList"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="editable"
            :excelDown="excelDown"
            :use-paging="true"
            @tableLinkClicked="tableLinkAccidentTitleClicked"
            label="사고 목록"
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
  name: 'y-accident-newsflash',
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
      accidentStepCd: 'ACCS0', // 사내사고진행단계
      // accidentStepCds: [], // 사내사고진행단계
      searchFlag: '',
    },
    searchArea: {
      title: '검색박스숨기기',
      show: true,
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
      param: null,
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    comboAccidentStepItems: [], // 사내사고진행단계
    searchUrl: '',
    excelDown: false,
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
  beforeDestroy() {
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      let excelDownDept = [
        '10C1400',
        '30E1300',
        '40K3600',
        '50K9200E',
        '30E1200',
        '40K3100',
        '50K9100E',
      ]; // 안전환경팀
      if (this.$_.indexOf(excelDownDept, this.$store.getters.deptCd) > -1) {
        this.excelDown = true;
      } else {
        this.excelDown = false;
      }

      // Url Setting
      this.searchUrl = selectConfig.saf.accident.list.url;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        { text: '사업장', name: 'plantNm', width: '120px', align: 'center' },
        {
          text: '진행단계',
          name: 'accidentStepNm',
          width: '120px',
          align: 'center',
        },
        {
          text: '발생일',
          name: 'accidentYmd',
          width: '130px',
          align: 'center',
        },
        { text: '발생부서', name: 'deptNm', width: '150px' },
        { text: '발생장소', name: 'area', width: '150px' },
        { text: '사고명', name: 'accidentTitle', width: '250px', url: 'link' },
        {
          text: '사고구분',
          name: 'accKindNms',
          width: '180px',
          align: 'center',
        },
        {
          text: '사고종류',
          name: 'accidentTypeNms',
          width: '180px',
          align: 'center',
        },
        { text: '작성자', name: 'createUserNm', width: '100px' },
        { text: '작성일', name: 'createDt', width: '150px', align: 'center' },
      ];
      // 기간 Setting
      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        today,
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to = this.$comm.getCalculatedDate(
        today,
        '1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.period = [from, to];
      this.getComboItems('SAF_ACCIDENT_STEP'); // 사내사고진행단계
      this.getList(); // 사고등록 목록 조회
      // this.setGridSize(); // 그리드 사이즈 조절
    },
    /**
     * 공통 마스터 정보 조회 (진행단계)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.comboAccidentStepItems = this.$_.clone(_result.data);
          this.comboAccidentStepItems.splice(0, 0, {
            code: '',
            codeNm: '전체',
          });
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * showAccidentPopup 호출
     * 사고등록 목록에 사고명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    tableLinkAccidentTitleClicked(header, data) {
      this.showAccidentPopup(data, false);
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
      this.popupOptions.title = flag ? '사고속보등록' : '사고 상세';
      this.popupOptions.param = {
        safAccidentNo: data.safAccidentNo, // 사내사고번호
        accidentStepCd: data.accidentStepCd, // 사내사고진행단계
        investYn: data.investYn,
        insertFlag: 'newsflash',
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
        _result => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        _error => {
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

    /** button 관련 이벤트 **/

    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchCheckResultOpenPopupClicked() {
      var data = {
        safAccidentNo: 0, // 사내사고번호
        accidentStepCd: '', // 사내사고진행단계 (계획)
      };
      this.showAccidentPopup(data, true);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
