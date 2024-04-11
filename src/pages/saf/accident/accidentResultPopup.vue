<!--
  목적 : 대상부서 상태 팝업
  Detail : 대상부서 상태 팝업
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             닫기 
            <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
          </div>
           조사결과 현황 
          <y-data-table
            label="L0000005264"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
          />
        </b-col>
      </b-col>
    </b-row> -->
    <!-- 조사결과 현황  테이블 -->
    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005264')"
          :useExcelExport="true"
          @btnClose="closePopup('CLOSE')"
        />
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
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '500',
        merge: [],
        btns: [],
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
    this.setGridHeader();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.init();
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam = this.popupParam;
      // Url Setting
      this.searchUrl = selectConfig.saf.accident.list.url;

      this.getList();
    },
    setGridHeader() {
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClose',
        }, // 닫기
      ];
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '100',
        } /* 사업장 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001390'),
          dataField: 'accidentTitle',
          width: '100',
        } /* 사고명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002777'),
          dataField: 'accidentStepNm',
          width: '170',
        } /* 진행단계 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000451'),
          dataField: 'bizApprStepNm',
          width: '300',
        } /* 결재진행단계 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001078'),
          dataField: 'accidentYmd',
          width: '250',
        } /* 발생일 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001076'),
          dataField: 'deptNm',
          width: '100',
        } /* 발생부서 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001081'),
          dataField: 'area',
          width: '130',
        } /* 발생장소 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001386'),
          dataField: 'accKindNms',
          width: '130',
        } /* 사고구분 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001406'),
          dataField: 'accidentTypeNms',
          width: '130',
        } /* 사고종류 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001401'),
          dataField: 'victimNms',
          width: '100',
        } /* 사고자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001405'),
          dataField: 'investYnNm',
          width: '100',
        } /* 사고조사대상 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '100',
        } /* 작성자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '100',
        } /* 작성일 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000264'),
          dataField: 'requestCnt',
          width: '100',
        } /* 개선요청 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005012'),
          dataField: 'incompletCnt',
          width: '100',
        } /* 조치미완료 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005013'),
          dataField: 'overdueCnt',
          width: '100',
        } /* 조치기한초과 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002683'),
          dataField: 'completCnt',
          width: '100',
        } /* 조치완료 */,
      ];
    },
    getList() {
      this.$http.url = selectConfig.saf.accident.list.url;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
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
