<!--
  목적 : 대상부서 상태 팝업
  Detail : 대상부서 상태 팝업
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
          <!-- 대상부서 목록 -->
          <y-data-table
            label="L0000000928"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
          />
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
          assessPlanNo: 0,
          apprFlag: '',
          regRegdemCd: '',
        };
      },
    },
  },
  data() {
    return {
      editable: true,
      searchParam: {
        assessPlanNo: 0,
        apprFlag: '',
        regRegdemCd: '',
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
     
      this.editable = this.$route.meta.editable;
      this.searchParam = this.popupParam;
      // Url Setting
      this.searchUrl = selectConfig.rsa.planmgmt.deptList.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          text: 'L0000001287',
          name: 'deptNm',
          width: '100px',
          align: 'center',
        },
        {
          // 평가일시작
          text: 'L0000004977',
          name: 'assessStartDt',
          width: '120px',
          align: 'center',
        },
        {
          // 평가종료일
          text: 'L0000004978',
          name: 'assessEndDt',
          width: '120px',
          align: 'center',
        },
        {
          // 비고
          text: 'L0000001360',
          name: 'assessDesc',
          width: '220px',
          align: 'left',
        },

        // 평가완료여부
        {
          text: 'L0000004979',
          name: 'assessFinishYn',
          width: '90px',
          align: 'center',
        },
        // 평가완료일
        {
          text: 'L0000004980',
          name: 'assessFinishDt',
          width: '120px',
          align: 'center',
        },
      ];

      this.getList();
    },
    getList() {
      this.$http.url = selectConfig.rsa.planmgmt.deptList.url;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
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
