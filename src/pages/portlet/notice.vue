<!--
  목적 : 포틀릿-공지사항
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
      :style="{
        width: '100%',
        height: portletHeight - 55 + 'px',
        maxHeight: portletHeight - 55 + 'px',
        fontSize: '0.8125rem',
      }"
      :height="portletHeight - 55"
      header-cell-class-name="portlet-notice-th"
      :header-row-style="{
        fontWeight: 'bold',
        color: '#212529',
        fontSize: '0.8125rem',
        'text-align': 'center',
      }"
      @row-click="openPopup"
    >
      <el-table-column :label="changeLang(null, 'title')" min-width="70%">
        <!-- <template slot="header" slot-scope="scope" style="text-align:center;">제목</template> -->
        <template slot-scope="scope">
          <span
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
            >{{ scope.row.notice_title }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        :label="changeLang(null, 'writeDate')"
        min-width="30%"
        align="center"
      >
        <template slot-scope="scope">{{ scope.row.create_dt }}</template>
      </el-table-column>
    </el-table>
    <y-dialog :param="popupOptions"></y-dialog>
  </div>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import { changeLang } from '@/utils/i18n';

export default {
  name: 'notice',
  props: {
    portletParam: {
      type: Object,
      default: {
        plantCd: null,
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
      plantCd: '',
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
      if (this.portletParam.plantCd) {
        this.plantCd = this.portletParam.plantCd;
      } else {
        this.plantCd = this.$store.getters.plantCd;
      }

      this.$http.url = selectConfig.main.portlet.notice.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        plantCd: this.plantCd,
      };

      this.$http.request(
        (_result) => {
          this.tableData = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
    openPopup(row, event, column) {
      this.popupOptions.param = {
        noticeNo: row.notice_no,
        height: window.innerHeight - 300,
      };
      this.popupOptions.target = () =>
        import(`${'../manage/notice/noticeDetail.vue'}`);
      this.popupOptions.title = row.notice_title;
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
  },
};
</script>

<style>
.test {
  font-weight: bold;
}
.portlet-notice-th {
  text-align: center !important;
}
</style>
