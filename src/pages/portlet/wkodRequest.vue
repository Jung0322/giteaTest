<!--
  목적 : 포틀릿-작업허가서 현황
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
        <template slot="header">
          <span v-if="!header.today">{{changeLang(null, header.name) || header.label}}</span>
          <span v-else>
            {{changeLang(null, header.name) || header.label}}
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
        workYmd: [], // 작업기간
        reqDeptCd: '', // 신청부서
        wkodKindCdTemps: [],
        wkodKindCds: [], // 작업구분
        pubDeptCd: '', // 사용/운전부서
        wkodStepCd: '', // 진행단계
        wkodNum: '', // 작업NO
        workTitle: '', // 작업명
        plantCd: '', // 사업장
        constTitle: '', // 공사명
        wkodClsCd: '', // 허가서구분
        vendorNm: '', // 작업업체
        psmYn: '',
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
      // this.tableHeader.splice(0, this.tableHeader.length);
      // this.tableHeader.push({
      //   label: '구분',
      //   name: 'gubun',
      //   align: 'center',
      //   width: '16%',
      // });
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
        this.tableHeader = [
          { label: 'L0000002389', name: 'workTitle', width: '250px', url: 'true' }, // 작업명
          {
            label: 'L0000002368', // 작업구분
            name: 'wkodKindNm',
            width: '250px',
            align: 'left',
          },
          { label: 'L0000002411', name: 'workYmd', width: '130px', align: 'center' }, // 작업일
          { label: 'L0000002426', name: 'wkodNum', width: '130px', align: 'center' }, // 작업허가번호
          { label: 'L0000000503', name: 'constTitle', width: '150px' }, // 공사명
          {
            label: 'L0000001415', // 사업장
            name: 'plantNm',
            width: '130px',
            align: 'center',
          },
          { label: 'L0000002420', name: 'workArea', width: '150px' }, // 작업장소
          {
            label: 'L0000003233', // 허가서구분
            name: 'wkodClsNm',
            width: '120px',
            align: 'center',
          },    
        ]
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
      this.$http.url = selectConfig.saf.wkodMaster.list.url;
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
    openPopup(row, event, column) {
      this.popupOptions.param = {
        wkodNo: row.wkodNo,
        wkodStepCd: row.wkodStepCd,
      };
      this.popupOptions.target = () =>
        import(`${'../constSafe/wkod/wkodNewlDetail.vue'}`);
      this.popupOptions.title = 'L0000002431'; // 작업허가서 상세
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

<style scoped>
.base-font {
  font-size:'0.8125rem';
}

.header-color {
  color:'#212529'
}
</style>
