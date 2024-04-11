<!--
  목적 : 판정이력 조회
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 닫기 -->
            <y-btn title="L0000000881" @btnClicked="closePopup" />
          </div>
          <!-- 검진 결과 이력 -->
          <y-data-table
            label="L0000000337"
            :headers="gridHistoryHeaderOptions"
            :items="gridHistoryData"
            @selectedRow="selectedRow"
          />
        </b-col>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 소견 -->
            <y-label
              label="L0000001658"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 업무수행적합 -->
                  <y-label label="L0000001949"></y-label>
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="checkupResult.heaWorkableNm"
                    :fieldable="true"
                  ></y-label>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 사후관리 -->
                  <y-label label="L0000001492"></y-label>
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="checkupResult.heaFollowUpNm"
                    :fieldable="true"
                  ></y-label>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="2">
                  <!-- 종합소견 -->
                  <y-label label="L0000002708"></y-label>
                </b-col>
                <b-col sm="10">
                  <y-label
                    :label="checkupResult.overallOpinion"
                    :fieldable="true"
                  ></y-label>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 판정목록 -->
          <y-data-table
            label="L0000003036"
            height="200"
            :headers="gridResultDiagHistoryHeaderOptions"
            :items="gridResultDiagHistoryData"
          />
        </b-col>
      </b-col>
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mt-1">
          <!-- 닫기 -->
          <y-btn title="L0000000881" @btnClicked="closePopup" />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'diagnose-result-history',
  props: {
    popupParam: {
      type: Object,
      default: {
        heaCheckupPlanNo: 0,
        userId: '',
      },
    },
  },
  data() {
    return {
      checkupResult: {
        heaCheckupPlanNo: 0,
        heaCheckupPlanNm: '',
        userId: '',
        userNm: '',
        heaCheckupClassCd: '',
        heaCheckupClassNm: '',
        heaWorkableCd: '',
        heaWorkableNm: '',
        heaFollowUpCd: '',
        heaFollowUpNm: '',
        overallOpinion: '',
      },
      selectedData: {
        heaCheckupPlanNo: 0,
        userId: '',
      },
      gridHistoryData: [],
      gridHistoryHeaderOptions: [],
      gridResultDiagHistoryData: [],
      gridResultDiagHistoryHeaderOptions: [],

      detailUrl: '',
      searchUrl: '',
      searchResultDiagUrl: '',
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.checkupResult.heaCheckupPlanNo = this.popupParam.heaCheckupPlanNo;
      this.checkupResult.userId = this.popupParam.userId;

      // 그리드 헤더 설정
      this.gridHistoryHeaderOptions = [
        {
          text: 'L0000000353', // 검진계획
          name: 'heaCheckupPlanNm',
          width: '200px',
        },
        {
          text: 'L0000000373', // 검진종류
          name: 'heaCheckupClassNm',
          width: '120px',
          align: 'center',
        },
        {
          text: 'L0000001412', // 사번
          name: 'userId',
          width: '80px',
          align: 'center',
        },
        {
          text: 'L0000001630', // 성명
          name: 'userNm',
          width: '100px',
          align: 'center',
        },
        {
          text: 'L0000000371', // 검진일
          name: 'heaCheckedYmd',
          width: '160px',
          align: 'center',
        },
        {
          text: 'L0000000357', // 검진기관
          name: 'heaCheckupOrgNm',
          width: '160px',
          align: 'center',
        },
      ];
      this.gridResultDiagHistoryHeaderOptions = [
        {
          text: 'L0000003035',
          name: 'heaDiagnoseNm',
          width: '15%',
          align: 'center',
        }, // 판정
        { text: 'L0000002785', name: 'heaDiseaseClassNm', width: '45%' }, // 질환종류
        { text: 'L0000002780', name: 'heaDiseaseNm', width: '20%' }, // 질환
        { text: 'L0000002188', name: 'heaHazardNm', width: '20%' }, // 유해인자
      ];

      this.detailUrl = selectConfig.hea.checkupResult.get.url;
      this.searchUrl = selectConfig.hea.checkupResult.resultHistory.url;
      this.searchResultDiagUrl = selectConfig.hea.checkupResultDiag.list.url;

      this.getList();
    },
    /** /초기화 관련 함수 **/

    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        heaCheckupPlanNo: this.checkupResult.heaCheckupPlanNo,
        userId: this.checkupResult.userId,
      };
      this.$http.request(
        (_result) => {
          this.gridHistoryData = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.selectedData.heaCheckupPlanNo,
        this.selectedData.userId
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.checkupResult = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getResultDiagList() {
      this.$http.url = this.searchResultDiagUrl;
      this.$http.type = 'GET';
      this.$http.param = this.selectedData;
      this.$http.request(
        (_result) => {
          this.gridResultDiagHistoryData = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectedRow(data) {
      this.selectedData.heaCheckupPlanNo = data.heaCheckupPlanNo;
      this.selectedData.userId = data.userId;
      this.getDetail();
      this.getResultDiagList();
    },

    /** /Call API service **/
    /** Button Event **/
    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup');
    },
    /** /Button Event **/

    /** 기타 function **/

    /** /기타 function **/
  },
};
</script>
