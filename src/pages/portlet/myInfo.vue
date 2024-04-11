<!--
  목적 : 포틀릿-나의할일
  작성자 : khk
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-row>
    <b-col sm="12">
      <b-row class="mt-2">
        <b-col sm="12">
          <b-row class="my-wrok-box">
            <b-col sm="3" style="min-height:50px; border:0; text-align:center" @click="goAppr(1)">
              <i class="el-icon-tickets"></i>
              <br />결재할 문서
              <br />
              <b-badge class="w-50" variant="warning">{{apprCnt}} 건</b-badge>
            </b-col>
            <b-col
              sm="3"
              style="min-height:50px; border:0; text-align:center"
              @click="goApprRequest"
            >
              <i class="el-icon-time"></i>
              <br />결재중 문서
              <br />
              <b-badge class="w-50" variant="secondary">{{requestCnt}} 건</b-badge>
            </b-col>
            <b-col sm="3" style="min-height:50px; border:0; text-align:center" @click="goAppr(2)">
              <i class="el-icon-document-checked"></i>
              <br />승인한 문서
              <br />
              <b-badge class="w-50" variant="success">{{apprdCnt}} 건</b-badge>
            </b-col>
            <b-col sm="3" style="min-height:50px; border:0; text-align:center" @click="goAppr(3)">
              <i class="el-icon-scissors"></i>
              <br />반려한 문서
              <br />
              <b-badge class="w-50" variant="danger">{{returnCnt}} 건</b-badge>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <!-- <b-row class="mt-4">
        <b-col sm="12">
          <div class="text-center" style="width:100%;">
            <b-button variant="outline-dark" style="width:45%;font-size:0.8em;min-height:80px;" size="sm">
              <b-badge variant="danger">{{myInfoData.imprAct}} 건</b-badge><br />이행할 개선조치
            </b-button>
            <b-button variant="outline-dark" style="width:45%;font-size:0.8em;min-height:80px;" size="sm">
              <b-badge variant="danger">{{myInfoData.accident}} 건</b-badge><br />조사할 사내사고
            </b-button>
          </div>
        </b-col>
      </b-row>-->
    </b-col>
  </b-row>
</template>

<script>
import selectConfig from '@/js/selectConfig';

export default {
  name: 'my-info',
  props: {
    portletParam: {
      type: String,
      default: '',
    },
    portletHeight: {
      type: Number,
      default: 350,
    },
  },
  data() {
    return {
      searchParam: {
        fromDate: '',
        toDate: '',
      },
      myInfoData: {
        requestCnt: 0,
        apprCnt: 0,
        apprdCnt: 0,
        returnCnt: 0,
      },
    };
  },
  computed: {
    apprCnt() {
      return this.myInfoData.apprCnt > 999 ? 999 : this.myInfoData.apprCnt;
    },
    requestCnt() {
      return this.myInfoData.requestCnt > 999
        ? 999
        : this.myInfoData.requestCnt;
    },
    apprdCnt() {
      return this.myInfoData.apprdCnt > 999 ? 999 : this.myInfoData.apprdCnt;
    },
    returnCnt() {
      return this.myInfoData.returnCnt > 999 ? 999 : this.myInfoData.returnCnt;
    },
  },
  watch: {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    init() {
      // 최근 1년
      var from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-1y',
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

      this.getData();
    },
    getData() {
      this.$http.url = selectConfig.main.portlet.myInfo.get.url;
      this.$http.type = 'get';
      this.$http.param = {
        userId: this.$store.getters.token,
        from: this.searchParam.fromDate,
        to: this.searchParam.toDate,
      };
      this.$http.request(
        _result => {
          this.$_.extend(this.myInfoData, _result.data);
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
    goAppr(flag) {
      if (flag === 1) {
        // 결재할 문서
        this.$router.push({
          path: '/manage/appr/apprWhich',
          name: 'COM30010',
          params: {
            from: this.searchParam.fromDate,
            to: this.searchParam.toDate,
          },
        });
      } else if (flag === 2) {
        // 승인한 문서
        this.$router.push({
          path: '/manage/appr/apprWhich',
          name: 'COM30010',
          params: {
            from: this.searchParam.fromDate,
            to: this.searchParam.toDate,
            apprYn: 'Y',
          },
        });
      } else {
        // 반려한 문서
        this.$router.push({
          path: '/manage/appr/apprWhich',
          name: 'COM30010',
          params: {
            from: this.searchParam.fromDate,
            to: this.searchParam.toDate,
            apprYn: 'Y',
            returnYn: 'Y',
          },
        });
      }
    },
    goApprRequest() {
      this.$router.push({
        path: '/manage/appr/apprRequest',
        name: 'COM30011',
        params: {
          from: this.searchParam.fromDate,
          to: this.searchParam.toDate,
          bizApprStepCd: 'BAPSA',
        },
      });
    },
  },
};
</script>
