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
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000928')"
          :useExcelExport="true"
          :enableSorting = "true"
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
          safTrainPlanNo: 0,
          apprFlag: '',
        };
      },
    },
  },
  data() {
    return {
      editable: true,
      searchParam: {
        safTrainPlanNo: 0,
        apprFlag: '',
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '250',
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
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getList();
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam = this.popupParam;
      // Url Setting

      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), 
          dataField: 'deptNm', 
          width: '170', 
        }, // 부서 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000004690'), 
          dataField: 'trainYn', 
          width: '110', 
        }, // 참여여부 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000005192'), 
          dataField: 'trainUserCnt', 
          width: '110', 
        }, // 참여인원수 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
          dataField: 'trainDesc', 
          width: '270', 
        }, // 비고 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000003385'), 
          dataField: 'trainYmd', 
          width: '130', 
        }, // 훈련일 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000005194'), 
          dataField: 'trainSTime', 
          width: '110', 
          minuteStep: 1, dateType: 'time',
        },  // 훈련시작시간 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000005193'), 
          dataField: 'trainETime', 
          width: '110', 
          minuteStep: 1,
        },  // 훈련종료시간 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000005355'), 
          dataField: 'trainCompleteYn', 
          width: '100', 
        }, // 훈련완료여부 

      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), 
          btnClicked: 'btnClose',
        },  // 닫기
      ]; 
    },
    getList() {
      this.$http.url = this.$format(
        selectConfig.saf.emergency.deptList.url,
        this.searchParam.safTrainPlanNo,
        this.searchParam.apprFlag
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.resizeGrid();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
    resizeGrid() {
      this.YAuiGrid.resize(null, this.gridOptions.height);
    },
  },
};
</script>
