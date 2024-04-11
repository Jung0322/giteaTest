<!--
  목적 : 작업허가서 신청 목록
  Detail : 작업허가서 신청 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002430')"
          :useExcelExport="false"
          :showItemCount="false"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';

export default {
  /* attributes: name, components, props, data */
  name: 'wkod-request-list',
  props: {
    constSafe: {
      type: Object,
      default: {
        constNo: '',
      },
    },
    paneName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: 300,
      },
      editable: true,
      comboWkodKindItems: [],
      searchUrl: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.wkodMaster.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002411'),
          dataField: 'workYmd',
          width: '25%',
        }, // 작업일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003233'),
          dataField: 'wkodTypeNm',
          width: '25%',
        }, // 허가서구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002368'),
          dataField: 'wkodKindNm',
          width: '25%',
        }, // 작업구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000507'),
          dataField: 'subconnNm',
          width: '25%',
        }, // 공사업체
      ];

      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd:
          this.$route.meta.plantAccess === 'APA02'
            ? this.$store.getters.plantCd
            : '',
        constNo: this.constSafe.constNo,
      };
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
