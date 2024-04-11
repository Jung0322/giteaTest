<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005269')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @closePopup="closePopup('CLOSE')"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'SHEFrontendEduPersonList',
  props: {
    popupParam: {
      type: Object,
      default() {
        return {
          safEduCourseNo: 0,
        };
      },
    },
  },
  data() {
    return {
      editable: true,
      searchParam: {
        safEduCourseNo: 0,
      },
      gridOptions: {
        header: [],
        data: [],
        height: '500',
        merge: [],
      },
      searchUrl: '',
      YAuiGrid: null,
    };
  },

  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },

  methods: {
    init() {
      console.log('2', this.popupParam);
      this.editable = this.$route.meta.editable;
      this.searchParam = this.popupParam;
      // Url Setting
      this.searchUrl = selectConfig.saf.education.eduComYTotalList.list.url;
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000653'),
          dataField: 'eduCourseNm',
          width: '16%',
          style: 'left-align',
        }, // 교육명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000641'),
          dataField: 'eduYmd',
          width: '22%',
        }, // 교육기간
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005293'),
          dataField: 'deptNm',
          width: '10%',
        }, // 부서(업체명)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005266'),
          dataField: 'userNm',
          width: '7%',
          style: 'left-align',
        }, // 사원명(성명)
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002212'),
          dataField: 'completYn',
          width: '7%',
        }, // 이수여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005267'),
          dataField: 'subConnYn',
          width: '7%',
        }, // 외부인원여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002467'),
          dataField: 'reCompletYn',
          width: '7%',
        }, // 재교육이수여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002217'),
          dataField: 'completYmd',
          width: '7%',
        }, // 이수일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005268'),
          dataField: 'eduEvalEnd',
          width: '7%',
        }, // 최종평가결과
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        },
      ];
      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
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
