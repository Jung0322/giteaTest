<!--
  목적 : 포틀릿-SHE 지수
  작성자 : khk
  Detail : 
  *
  examples:
  *
  -->
<template>
  <div>
    <el-table
      :data="tableData"
      :style="{width:'100%', height:(portletHeight-55)+'px', maxHeight:(portletHeight-55)+'px', fontSize:'0.8125rem'}"
      :height="(portletHeight-55)"
      :header-row-style="{fontWeight:'bold', color:'#212529', fontSize:'0.8125rem'}"
      :span-method="objectSpanMethod"
    >
      <el-table-column :label="changeLang(null, 'dept')" min-width="120px" align="center">
        <template slot-scope="scope">{{ scope.row.deptNm }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'division')" min-width="130px" align="center">
        <template slot-scope="scope">{{ scope.row.gubun }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'targetIndex')" min-width="85px" align="right">
        <template slot-scope="scope">{{ scope.row.sheIndexTgt }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'achievementIndex')" min-width="85px" align="right">
        <template slot-scope="scope">{{ scope.row.sheIndexSum }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'january')" min-width="55px" align="right">
        <template slot-scope="scope">{{ scope.row.sheIndexValMonth1 }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'february')" min-width="55px" align="right">
        <template slot-scope="scope">{{ scope.row.sheIndexValMonth2 }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'march')" min-width="55px" align="right">
        <template slot-scope="scope">{{ scope.row.sheIndexValMonth3 }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'april')" min-width="55px" align="right">
        <template slot-scope="scope">{{ scope.row.sheIndexValMonth4 }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'may')" min-width="55px" align="right">
        <template slot-scope="scope">{{ scope.row.sheIndexValMonth5 }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'june')" min-width="55px" align="right">
        <template slot-scope="scope">{{ scope.row.sheIndexValMonth6 }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'july')" min-width="55px" align="right">
        <template slot-scope="scope">{{ scope.row.sheIndexValMonth7 }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'august')" min-width="55px" align="right">
        <template slot-scope="scope">{{ scope.row.sheIndexValMonth8 }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'september')" min-width="55px" align="right">
        <template slot-scope="scope">{{ scope.row.sheIndexValMonth9 }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'october')" min-width="55px" align="right">
        <template slot-scope="scope">{{ scope.row.sheIndexValMonth10 }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'november')" min-width="55px" align="right">
        <template slot-scope="scope">{{ scope.row.sheIndexValMonth11 }}</template>
      </el-table-column>
      <el-table-column :label="changeLang(null, 'december')" min-width="55px" align="right">
        <template slot-scope="scope">{{ scope.row.sheIndexValMonth12 }}</template>
      </el-table-column>
    </el-table>
    <y-dialog :param="popupOptions"></y-dialog>
  </div>
</template>

<script>
import { changeLang } from '@/utils/i18n'
import selectConfig from '@/js/selectConfig';

export default {
  name: 'portlet-SHE',
  props: {
    portletParam: {
      type: Object,
      default: function() {
        return {
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
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
    };
  },
  watch: {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    changeLang,
    init() {
      this.getTableData();
    },
    getTableData() {
      let today = this.$comm.getToday();
      let year = this.$comm.getCalculatedDate(today, '-1y', 'YYYY', 'YYYY');
      this.$http.url = selectConfig.main.portlet.she.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        plantCd: this.portletParam.plantCd
          ? this.portletParam.plantCd
          : this.$store.getters.plantCd,
        deptCd: this.$store.getters.deptCd,
        yearPeriod: [year, today.substring(0, 4)],
      };
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
    objectSpanMethod(data) {
      if (data.columnIndex === 0) {
        if (data.rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
  },
};
</script>
