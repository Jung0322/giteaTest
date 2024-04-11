<!--
  목적 : 포틀릿-요청/조치 현황
  작성자 : khk
  Detail : 
  *
  examples:
  *
  -->
<template>
  <el-table
    :data="tableData"
    :style="{width:'100%', height:(portletHeight-55)+'px', maxHeight:(portletHeight-55)+'px', fontSize:'0.8125rem'}"
    :height="(portletHeight-55)"
    :header-row-style="{fontWeight:'bold', color:'#212529', fontSize:'0.8125rem'}"
  >
    <el-table-column label="개선구분" align="center">
      <template slot-scope="scope">{{ scope.row.code_nm }}</template>
    </el-table-column>
    <el-table-column label="개선계획" align="right">
      <template slot-scope="scope">{{ scope.row.request_count }}건</template>
    </el-table-column>
    <el-table-column label="이행완료" align="right">
      <template slot-scope="scope">{{ scope.row.complete_count }}건</template>
    </el-table-column>
    <el-table-column label="이행률" align="right">
      <template slot-scope="scope">{{ scope.row.action_rate }}%</template>
    </el-table-column>
  </el-table>
</template>

<script>
import selectConfig from '@/js/selectConfig';

export default {
  name: 'impr-act-status',
  props: {
    portletParam: {
      type: Object,
      default: function() {
        return {
          depts: [],
          plantCd: null,
        };
      },
    },
    portletHeight: {
      type: [String, Number],
      default: 350,
    },
  },
  data() {
    return {
      tableData: [],
      searchParam: {
        fromDate: '',
        toDate: '',
        depts: [],
        plantCd: null,
      },
    };
  },
  watch: {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    init() {
      var from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      from = this.$comm.getCalculatedDate(
        from,
        '1d',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );

      this.searchParam.fromDate = from;
      this.searchParam.toDate = this.$comm
        .moment(this.$comm.getToday())
        .format('YYYY-MM-DD');
      this.searchParam.depts =
        this.portletParam.depts && this.portletParam.depts.length > 0
          ? this.portletParam.depts
          : [];

      if (this.portletParam.plantCd) {
        this.searchParam.plantCd = this.portletParam.plantCd;
      }
      this.getTableData();
    },
    getTableData() {
      this.$http.url = selectConfig.main.portlet.imprActStatus.list.url;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.tableData = _result.data;
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
  },
};
</script>
