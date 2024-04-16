<!--
  목적 : 결제진행 상태 팝업
  Detail : 결제진행 상태 팝업
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 닫기 -->
            <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
          </div>
          <!-- 평가결과 관리 목록 -->
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :span-options="gridOptions.merge"
            :use-paging="true"
            label="L0000004993"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'appr-progress-popup',
  props: {
    popupParam: {
      type: Object,
      default() {
        return {
          monFlag: 'mon100',
          gubun: '',
          plantCd: '',
          assessYear: '',
          riskType: '',
          regRegdemCd: '',
        };
      },
    },
  },
  data() {
    return {
      searchParam: {
        monFlag: '',
        gubun: '',
        plantCd: '',
        assessYear: '',
        regRegdemCd: '',
        riskType: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: '500',
        merge: [],
      },
      searchUrl: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  //* methods */
  methods: {
    init() {
      this.searchParam = this.popupParam;
      // Url Setting
      this.searchUrl = selectConfig.rsa.resultmgmt.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        {
          text: 'L0000001415',
          name: 'plantNm',
          width: '100px',
          align: 'center',
        },
        // 대상부서
        {
          text: 'L0000000927',
          name: 'deptNm',
          width: '100px',
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
          align: 'center',
        },
        // 구분
        {
          text: 'L0000000686',
          name: 'regRegdemNm',
          width: '60px',
          align: 'center',
        },
        // 대상년도
        {
          text: 'L0000004449',
          name: 'assessYear',
          width: '80px',
          align: 'center',
        },

        // 단계(상태)
        {
          text: 'L0000004972',
          name: 'stateNm',
          width: '100px',
          align: 'center',
        },
        // 작성자
        {
          text: 'L0000002355',
          name: 'createUserNm',
          width: '120px',
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
          width: '60px',
          align: 'center',
        },
        // 미완료
        {
          text: 'L0000003563',
          name: 'incompletCnt',
          width: '60px',
          align: 'center',
        },
        // 기한초과
        {
          text: 'L0000004973',
          name: 'overdueCnt',
          width: '60px',
          align: 'center',
        },
        // 완료
        {
          text: 'L0000002039',
          name: 'completCnt',
          width: '60px',
          align: 'center',
        },
      ];
      this.getList();
    },
    getList() {
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
    closePopup(data) {
      this.$emit('closePopup', data);
    },
  },
};
</script>
