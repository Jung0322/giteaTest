<!--
  목적 : 포틀릿-공사 및 작업허가서 현황
  작성자 : khk
  Detail : 
  *
  examples:
  *
  -->
<template>
  <div class="main-wkod-status type-01">
    <!-- :style="{width:'100%', height:(portletHeight-55)+'px', maxHeight:(portletHeight-55)+'px', fontSize:'0.8em'}" -->
    <!-- :style="{width:'100%', height:'auto', fontSize:'0.8em'}" -->
    <el-table
      :data="tableData"
      :style="{width:'100%', height:'200px', maxHeight:'200px', fontSize:'0.8125rem'}"
      height="200px"
      :header-row-style="{fontWeight:'bold', color:'#212529', fontSize:'0.8125rem'}"
    >
      <el-table-column
        v-for="header in tableHeader"
        :key="header.name"
        :label="header.label"
        :min-width="header.width"
        :align="header.align"
      >
        <template slot="header" slot-scope="scope">
          <span v-if="!header.today">{{header.label}}</span>
          <span v-else>
            {{header.label}}
            <el-tag type="warning" effect="dark">Today</el-tag>
          </span>
        </template>
        <template slot-scope="scope">{{ scope.row[header.name] }}</template>
      </el-table-column>
    </el-table>
    <y-dialog :param="popupOptions"></y-dialog>
  </div>
</template>

<script>
import selectConfig from '@/js/selectConfig';

export default {
  name: 'portlet-wkod-status',
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
      type: Number,
      default: 350,
    },
  },
  data() {
    return {
      param: {
        searchDates: [],
        dates: [],
        plantCd: '',
      },
      tableHeader: [],
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
    init() {
      this.setHeader();
    },
    setHeader() {
      this.tableHeader.splice(0, this.tableHeader.length);
      this.tableHeader.push({
        label: 'L0000000686', // 구분
        name: 'gubun',
        align: 'center',
        width: '16%',
      });
      let today = this.$comm.getToday();
      let startDay = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-2d',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.param.searchDates = [];
      for (let i = 0; i < 5; i++) {
        let date = this.$comm.getCalculatedDate(
          startDay,
          String(i) + 'd',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        let date2 = this.$comm.moment(date).format('MM-DD');
        this.param.searchDates.push(date);
        this.tableHeader.push({
          label: date2,
          name: date,
          align: 'center',
          width: '12%',
          today: date === today,
        });
      }
      if (this.portletParam.plantCd) {
        this.param.plantCd = this.portletParam.plantCd;
      } else {
        this.param.plantCd = this.$store.getters.plantCd;
      }
      this.param.dates = [
        startDay,
        this.$comm.getCalculatedDate(
          startDay,
          '6d',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        ),
      ];
      this.getTableData();
    },
    getTableData() {
      this.$http.url = selectConfig.main.portlet.constWkod.list.url;
      this.$http.type = 'get';
      this.$http.param = this.param;
      this.$http.request(
        _result => {
          this.tableData = _result.data;
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
  },
};
</script>