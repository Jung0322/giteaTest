<!--
  목적 : 위험성평가 > 작업 위험성평가 관리 > 평가계획 관리
  Detail : 평가계획 관리 등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <div slot="header">
        <y-label label="L0000000327" />
        <div class="float-right">
          <!-- 검색 -->
          <y-btn title="L0000000327" color="green" @btnClicked="getList" />
        </div>
      </div>
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 사업장 -->
          <y-plant type="search" :width="8" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 대상년도 -->
          <y-datepicker
            :width="8"
            name="period"
            label="대상년도"
            type="year"
            :default="searchParam.period"
            v-model="searchParam.period"
          />
        </b-col>

        <!-- 평가기법 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="rsaAssessTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="평가기법"
            name="classificationCd"
            v-model="searchParam.classificationCd"
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
            label="구분"
            name="regRegdem"
            v-model="searchParam.regRegdem"
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

        <!-- 단계/상태 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="assessStepCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="단계/상태"
            name="assessStepCd"
            v-model="searchParam.assessStepCd"
          ></y-select>
        </b-col>

        <!-- 주관팀 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-tree-dept
            type="search"
            label="주관팀"
            name="deptCd"
            v-model="searchParam.deptCd"
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
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 계획등록 -->
            <y-btn
              v-if="editable"
              title="무계획 결과 등록"
              color="orange"
              @btnClicked="openPopup"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <!-- 출력 -->
            <!-- <y-btn
              v-if="editable"
              title="출력"
              color="black"
              @btnClicked="openPopup"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            /> -->
            <!-- 검색 -->
            <!-- <y-btn title="L0000000327" color="green" @btnClicked="getList" /> -->
          </div>
          <!-- 평가계획 목록 -->
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :print="true"
            :use-paging="true"
            @tableLinkClicked="tableLinkAccidentTitleClicked"
            :cellClassName="tableCellClassName"
            label="평가계획 목록"
            v-model="selectedValue"
          >
            <el-table-column
              :selectable="selectCheck"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table>
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
      period: [], // 대상년도
      assessNm: '',
      classificationCd: '',
      regRegdem: '', // 구분
      yearChk: '',
      riskType: '',
      stateCd: '', // 상태
      apprStatusCd: '', // 결재상태
      deptSubYn: 'Y', // 하위부서여부 사용
      deptCd: '',
      statusCd: null,
      assessStepCd: '', // 단계, 상태
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
    selectedValue: [],
    stateItems: [], // 상태
    statusItem: [{ code: null, codeNm: '계획' }], // 단계
    searchUrl: '',
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
    excelUrl: '',
    assessStepCdItems: [], // 단계, 상태
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
      if (column.property === 'overDateCnt' && row['overDateCnt'] !== '0') {
        return 'row-color';
      }
    },
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam.plantCd = this.$store.getters.plantCd;
      this.searchParam.period = this.$comm.moment().format('YYYY');
      this.excelUrl = selectConfig.saf.imprActStd.downLoad;
      // Url Setting
      this.searchUrl = selectConfig.rsa.planmgmt.list2.url;
      this.$comm.getComboItems('RSA_ASSESS_TYPE', true).then((_result) => {
        this.rsaAssessTypeItems = _result;
      });
      // 평가구분
      this.$comm.getComboItems('RSA_REG_REGDEM', true).then((_result) => {
        this.rsaRegRegdemItems = _result;
      });
      // 단계, 상태
      this.$comm.getComboItems('COM_STATE', true).then((_result) => {
        this.assessStepCdItems = _result;
      });
      this.$comm.getComboItems('COM_STATE', true).then((_result) => {
        this.stateItems = _result.filter((v) => v.code !== 'STATE1');
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      if (this.$route.meta.param === 'W') {
        this.searchParam.riskType = 'work';
      } else {
        this.searchParam.riskType = 'proc';
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
        this.searchParam.deptCd = this.$store.getters.deptCd;
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
        // 평가명
        {
          text: 'L0000003081',
          name: 'assessNm',
          width: '90px',
          align: 'center',
          url: true,
        },
        // 평가구분
        {
          text: '평가구분',
          name: 'regRegemNm',
          width: '180px',
          align: 'left',
        },
        // 진행단계
        {
          text: '진행단계',
          name: 'assessStepNm',
          width: '80px',
          align: 'center',
          url: true,
        },
        // 평가팀
        {
          text: '평가팀',
          name: 'deptNm',
          width: '120px',
          align: 'center',
        },
        // 분류
        {
          text: '분류',
          name: 'classificationCd',
          width: '80px',
          align: 'center',
        },
        // 평가기간
        {
          text: '평가기간',
          name: 'assessYear',
          width: '110px',
          align: 'center',
        },
        // 평가담당자
        {
          text: '평가담당자',
          name: 'createUserNm',
          width: '110px',
          align: 'center',
        },
        // 작성일
        {
          text: 'L0000002352',
          name: 'createDt',
          width: '120px',
          align: 'center',
        },
      ];

      this.getList(); // 평가계획 목록 조회
    },
    selectCheck() {
      return true;
    },

    /**
     * showAccidentPopup 호출
     * 평가계획 목록에 평가명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    tableLinkAccidentTitleClicked(header, data) {
      if (header.name === 'assessStepNm') {
        this.showApprProgressPopup(data);
      } else {
        this.openPopup(data);
      }

      // else if (
      //   header.name === 'deptCnt' ||
      //   header.name === 'deptNCnt' ||
      //   header.name === 'overDateCnt' ||
      //   header.name === 'deptYCnt'
      // ) {
      //   data.apprFlag = header.name;
      //   this.openDeptListPopup(data);
      // } else {
      //   this.openPopup(data);
      // }
    },
    btnDownload() {
      if (!this.selectedValue || !this.selectedValue.length) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'L0000005853', // 출력할 개선사항을 선택해주세요.
        });
        return;
      }
      let assessPlanNos = this.$_.flatMap(this.gridOptions.data, (data) => {
        return data.assessPlanNo;
      });
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = this.excelUrl; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.param = { assessPlanNos };
      this.$http.type = 'POST';
      this.$http.request(
        (_result) => {
          let fileOrgNm = '위험성평가 계획_' + this.$comm.getToday() + '.xlsx';
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          // let fileOrgNm = '한글.xlsx'
          let blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          this.pageAlert = {
            alertType: 'error',
            alertMsg: this.gm(
              'common.file.download.error.msg',
              '오류가 발생했습니다.'
            ),
          };
        }
      );
      // this.$comm.exportFile(this.excelUrl, { assessPlanNos }, 'POST');
    },
    openDeptListPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./planmgmtDeptListPopup.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000000928'; // '대상부서 목록';
      this.popupOptions.param = {
        assessPlanNo: data.assessPlanNo,
        apprFlag: data.apprFlag,
      };

      this.popupOptions.closeCallback = this.closePopup;
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.papprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./processResultmgmtDetail.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = '평가결과 관리 상세'; // '평가계획 등록';
      this.popupOptions.param = data
        ? data
        : { assessPlanNo: 0, riskType: this.searchParam.riskType };
      this.popupOptions.closeCallback = this.closePopup;
    },
    /** 위험성 평가계획 수립 목록 검색 **/
    getList() {
      this.searchParam.yearChk =
        this.searchParam.yearChk === '' ? 'N' : this.searchParam.yearChk;
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
                  v.stepCd === 'BAPSG'
              )
            );
          }

          this.$comm.pushCookie(this.searchParam);
          setTimeout(() => {
            $('.row-color').css('color', 'red');
          }, 50);
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
    /** end button 관련 이벤트 **/
  },
};
</script>
<style>
.row-color .el-button {
  color: red !important;
}
</style>
