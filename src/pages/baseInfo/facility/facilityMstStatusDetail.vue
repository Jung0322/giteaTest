<!--
  목적 : 설비유형별 설비현황 상세
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="1" md="1" lg="1" xl="1" class="col-xxl-1">
          <!-- 관리부서 -->
          <y-label label="L0000000591" />
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-2">
          <y-label :label="searchParam.deptNm" :fieldable="true" />
        </b-col>
        <!-- 공정 -->
        <b-col sm="1" md="1" lg="1" xl="1" class="col-xxl-1">
          <y-label label="L0000000515" />
        </b-col>
        <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-2">
          <y-label :label="searchParam.processNm" :fieldable="true" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 설비유형 -->
          <y-select
            :width="baseWidth"
            :comboItems="comboFacilityTypeItems"
            itemText="safFacilityTypeNm"
            itemValue="safFacilityTypeCd"
            ui="bootstrap"
            name="deptNm"
            label="L0000001597"
            v-model="searchParam.safFacilityTypeCd"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 설비 grid -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 설비유형별 관리부서별 상세 현황 -->
          <y-data-table
            label="L0000003724"
            gridType="edit"
            :print="true"
            :rows="3"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'facility-mst-status-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        deptCd: '',
        deptNm: '',
        processNo: 0,
        processNm: '',
        safFacilityTypeCd: '',
      },
    },
  },
  data() {
    return {
      searchParam: {
        deptCd: '',
        deptNm: '',
        processCd: '',
        processNm: '',
        safFacilityTypeCd: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: '210',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      baseWidth: 8,
      comboFacilityTypeItems: [], // 설비유형
      searchUrl: '',
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.facilityMst.list.url;

      this.searchParam.deptCd = this.popupParam.deptCd;
      this.searchParam.deptNm = this.popupParam.deptNm;
      this.searchParam.processNo = this.popupParam.processNo;
      this.searchParam.processNm = this.popupParam.processNm;
      this.getFacilityTypeItems(); // 설비유형

      setTimeout(() => {
        this.getDataList(); // 설비 grid
      }, 200);

      // 설비 grid 헤더 설정
      this.gridOptions.header = [
        {
          text: 'L0000001597',
          name: 'safFacilityTypeNm',
          width: '150px',
          align: 'center',
        }, // 설비유형
        { text: 'L0000000515', name: 'processNm', width: '120px', align: 'center' }, // 공정
        {
          text: 'L0000001618',
          name: 'safFacilityCd',
          width: '110px',
          align: 'center',
        }, // 설비코드
        { text: 'L0000001596', name: 'facilityNm', width: '200px', align: 'left' }, // 설비명
        {
          text: 'L0000003725',
          name: 'facilityMgrNum',
          width: '110px',
          align: 'center',
        }, // 설비관리번호
        {
          text: 'L0000001626',
          name: 'installLocate',
          width: '120px',
          align: 'left',
        }, // 설치위치
        { text: 'L0000000591', name: 'deptNm', width: '120px', align: 'left' }, // 관리부서
        { text: 'L0000002061', name: 'vol', width: '100px', align: 'right' }, // 용량
        {
          text: 'L0000001627',
          name: 'installYmd',
          width: '110px',
          align: 'center',
        }, // 설치일자
        {
          text: 'L0000001846',
          name: 'safMgrPsn',
          width: '110px',
          align: 'center',
        }, // 안전관리자
      ];
    },
    // 설비유형
    getFacilityTypeItems() {
      this.$http.url = selectConfig.baseInfo.facilityType.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        _result => {
          _result.data.splice(0, 0, {
            safFacilityTypeCd: '',
            safFacilityTypeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          });
          this.comboFacilityTypeItems = _result.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 설비 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.gridOptions.data = _result.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/
  },
};
</script>