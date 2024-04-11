<!--
  목적 : 평가계획 수립 - 평가계획 수립 조회용 팝업
  Detail : 평가계획 등록/조회 팝업화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row ref="searchBox">
      <b-col sm="12">
        <b-card
          header-class="default-card"
          body-class="default-body-card"
          class="py-0"
        >
          <div slot="header">
            <y-label label="검색" />
            <div class="float-right">
              <y-btn
                :title="searchArea.title"
                color="green"
                @btnClicked="btnSearchVisibleClicked"
              />
              <y-btn
                title="검색"
                color="green"
                @btnClicked="btnSearchClickedCallback"
              />
            </div>
          </div>
          <b-row v-if="searchArea.show">
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :width="10"
                ui="bootstrap"
                name="assessNmSearch"
                label="평가명"
                v-model="searchParam.assessNm"
                >
              </y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :width="10"
                ui="bootstrap"
                name="assessDescSearch"
                label="상세내용" 
                v-model="searchParam.assessDesc"
                >
              </y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="comboRegRegdemItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="regRegdemSearch"
                label="정기/수시"
                v-model="searchParam.regRegdem"
              />
            </b-col>-->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="comboAssessStatusItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="진행상태"
                name="assessStatus"
                v-model="searchParam.assessStatus"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-datepicker
                :width="8"
                :range="true"
                type="searchAssessPriod"
                label="평가기간"
                v-model="searchParam.assessPriod"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                ui="bootstrap"
                label="담당자"
                name="userNm"
                v-model="searchParam.userNm"
                :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                @searchUser="btnSearchUserClicked('search')"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn title="L0000000881" @btnClicked="closePopup" />
          </div>
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :print="true"
            :use-paging="true"
            @selectedRow="selectedRow"
            label="평가계획 목록"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-assess-plan-popup',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        assessTypeCd: '',
      }),
    },
  },
  data: () => ({
    searchParam: {
      assessNm: '', // 평가명
      assessTypeCd: '',
      // assessTypeNos: [], // 평가유형
      regRegdem: '', // 정시/수기
      assessDesc: '', // 상세내용
      assessStatus: 'C', // 진행상태
      assessPriod: [], // 평가기간
      userId: '', // 담당자ID
      userNm: '', // 담당자명
    },
    searchArea: {
      title: '검색박스숨기기',
      show: true,
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
      param: {},
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    comboRegRegdemItems: [], // 정기/수기
    searchUrl: '',
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    // 윈도우 resize event
    // window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
    // window.removeEventListener('resize', this.setGridSize);
  },
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = selectConfig.rsa.assessPlan.list.url;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          text: '진행상태',
          name: 'assessStatusNm',
          width: '100px',
          align: 'center',
        },
        {
          text: '평가분류',
          name: 'assessGroupNm',
          width: '150px',
          align: 'center',
        },
        {
          text: '평가기법',
          name: 'assessTypeNm',
          width: '140px',
          align: 'center',
        },
        {
          text: '위험Matrix명',
          name: 'assessTypeChecks',
          width: '140px',
          align: 'center',
        },
        {
          text: '정시/수기',
          name: 'regRegdemNm',
          width: '110px',
          align: 'center',
        },
        {
          text: '평가기간',
          name: 'assessPeriod',
          width: '200px',
          align: 'center',
        },
        { text: '평가명', name: 'assessNm', width: '270px' },
        { text: '담당자', name: 'userNm', width: '100px' },
        { text: '상세내용', name: 'assessDesc', width: '250px' },
      ];

      this.comboAssessStatusItems = [
        { code: null, codeNm: '전체' },
        { code: 'P', codeNm: '계획' },
        { code: 'A', codeNm: '진행' },
        { code: 'C', codeNm: '완료' },
      ];

      this.getComboItems('RSA_REG_REGDEM'); // 정시/수기
      this.getList(); // 평가계획 목록 조회
      // this.setGridSize(); // 그리드 사이즈 조절
    },
    /**
     * 공통 마스터 정보 조회 (정기/수기)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.comboRegRegdemItems = this.$_.clone(_result.data);
          this.comboRegRegdemItems.splice(0, 0, { code: '', codeNm: '전체' });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 평가계획 상세 조회
     * 평가계획 목록 row 클릭시 마다 발생
     * data : 클릭한 row 정보
     */
    selectedRow(data) {
      if (data === null) return;

      this.$http.url = this.$format(
        selectConfig.rsa.assessPlan.get.url,
        data.assessPlanNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.closePopup(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 위험성 평가계획 수립 목록 검색 **/
    getList() {
      // this.searchParam.assessTypeNos = [];
      // this.$_.forEach(this.popupParam.assessTypeNos, (item) => {
      //   this.searchParam.assessTypeNos.push(item);
      // });
      this.searchParam.assessTypeCd = this.popupParam.assessTypeCd;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     *  팝업 안 보이도록 설정
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', { assessPlan: data });
    },
    /** button 관련 이벤트 **/
    /**
     * 검색박스 숨기기/보이기 처리 후 setGridSize 호출
     */
    btnSearchVisibleClicked() {
      this.searchArea.show = !this.searchArea.show;
      if (this.searchArea.show) this.searchArea.title = '검색박스숨기기';
      else this.searchArea.title = '검색박스보이기';

      window.getApp.$emit('LOADING_PASS_COUNT', 1);
    },
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchClickedCallback() {
      this.getList();
    },
    btnSearchUserClicked(data) {
      this.popupOptions.target = () =>
        import(`${'../../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = '사용자검색';
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupUser;
    },
    closePopupUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.searchParam.userId = data.user.userId;
        this.searchParam.userNm = data.user.userNm;
      }
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
