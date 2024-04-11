<!--
  목적 : 포틀릿-입법예고
  작성자 : sch
  Detail : 
  *
  examples:
  *
  -->
<template>
  <div>
    <el-table
      :data="tableData"
      :height="portletHeight"
      :style="{fontSize:'0.8125rem'}"
      :header-row-style="{fontWeight:'bold', color:'#212529', fontSize:'0.8125rem'}"
      @row-click="openPopup"
    >
      <el-table-column
        v-for="header in tableHeader"
        :key="header.name"
        :label="changeLang(null, header.name) || header.label"
        :min-width="header.width"
        :align="header.align"
      >
        <template slot-scope="scope"> <div class="column-ellipsis" :title="scope.row[header.name]">{{ scope.row[header.name] }}</div> </template>
      </el-table-column>
    </el-table>
    <y-dialog :param="popupOptions"></y-dialog>
  </div>
</template>

<script>
import { changeLang } from '@/utils/i18n'
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
      type: [String, Number],
      default: 350,
    },
  },
  data() {
    return {
      param: {
        period: [],
        isNm: '',
        mgrGovCd: '',
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
    changeLang,
    init() {
      this.setHeader();
    },
    setHeader() {
      let today = this.$comm.moment().format('YYYY-MM-DD');
      var stday = this.$comm.moment().format('YYYY-01-01');

      this.param.period = [stday, today];

      this.tableHeader = [
        {
          label: '입법예고명',
          name: 'isNm',
          width: '180px',
          align: 'left',
          url: true,
        },
        {
          label: '법령종류',
          name: 'isClsNm',
          width: '95px',
          align: 'center',
        },
        {
          label: '공고번호',
          name: 'pntcNo',
          width: '85px',
          align: 'center',
        },
        { label: '시작일자', name: 'stYd', align: 'center' },
      ];

      this.getTableData();
    },
    getTableData() {
      this.$http.url = selectConfig.lawMakinglist.list.url;
      this.$http.type = 'get';
      this.$http.param = this.param;
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
    openPopup(row, event, column) {
      if (row === null) return;

      let link = document.createElement('a');
      link.href = row.fileDownLink;
      link.download = row.fileName;
      link.click();
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
  },
};
</script>

<style scoped>
.base-font {
  font-size:'0.8125rem';
}

.header-color {
  color:'#212529'
}

.column-ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden; 
}
</style>
