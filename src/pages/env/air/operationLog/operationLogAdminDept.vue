<!--
  목적 : 환경 > 대기 > 운영일지(관리자)
  작성자 : LHJ
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
        <b-row>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
            <!-- 대기 운영일지 작성부서 정보 -->
            <y-label
              label="L0000005566"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
        <b-card>
          <b-row>
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
              <!-- 사업장 -->
              <y-label label="L0000001415"></y-label>
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label :label="popupParam.plantNm" :fieldable="true"></y-label>
            </b-col>
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
              <!-- 작성일자 -->
              <y-label label="L0000002354"></y-label>
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label
                :label="popupParam.measureYmd"
                :fieldable="true"
              ></y-label>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
        <table class="oplog-dept-tb">
          <colgroup>
            <col width="33%" />
            <col width="33%" />
            <col width="34%" />
          </colgroup>
          <tr class="dept-header">
            <th class="dept-th">대상부서</th>
            <th class="dept-th">작성부서</th>
            <th>미작성부서</th>
          </tr>
          <tr class="dept-body">
            <td class="dept-td">
              <div v-for="(tgtDept, i) in tgtDeptNms" :key="i">
                {{ tgtDept }}
                <br />
              </div>
            </td>
            <td class="dept-td">
              <div v-for="(writeDept, i) in writeDeptNms" :key="i">
                {{ writeDept }}
                <br />
              </div>
            </td>
            <td>
              <div v-for="(noDept, i) in noDeptNms" :key="i">
                {{ noDept }}
                <br />
              </div>
            </td>
          </tr>
        </table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'operation-log',
  props: {
    popupParam: {
      type: Object,
      default: {
        measureYmd: '',
        plantCd: '',
      },
    },
  },
  data() {
    return {
      editable: true,
      tgtDeptNms: '',
      writeDeptNms: '',
      noDeptNms: '',
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  destroyed() {},

  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.getList();
    },
    getList() {
      if (!this.popupParam.plantCd || !this.popupParam.measureYmd) {
        return;
      }

      this.$http.url = this.$format(
        selectConfig.env.air.opLog.admin.dept.url,
        this.popupParam.plantCd,
        this.popupParam.measureYmd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.tgtDeptNms = _result.data.map((dept) => dept.tgtDeptNm);
          this.writeDeptNms = _result.data
            .filter((dept) => dept.writeDeptNm)
            .map((dept) => dept.writeDeptNm);
          this.noDeptNms = _result.data
            .filter((dept) => dept.noDeptNm)
            .map((dept) => dept.noDeptNm);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR');
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup');
    },
  },
};
</script>

<style>
.oplog-dept {
  height: 400px !important;
}

.oplog-dept-tb {
  width: 100%;
}

.oplog-dept-tb > tr {
  text-align: center;
}

.oplog-dept-tb > .dept-header {
  background-color: #eef1f6 !important;
  font-weight: 500;
  border-bottom: 1px solid #e6e6e6 !important;
  border-top: 1px solid #cfd2d8 !important;
}

.oplog-dept-tb > .dept-header > th {
  line-height: 32px !important;
  padding: 0px 10px;
}

.oplog-dept-tb > .dept-header > .dept-th {
  border-right: 1px solid #e6e6e6 !important;
}

.oplog-dept-tb > .dept-body {
  font-weight: normal !important;
  border-bottom: 1px solid #e6e6e6 !important;
  background: #fff !important;
}

.oplog-dept-tb > .dept-body > td {
  line-height: 32px !important;
  padding: 0px 10px;
}

.oplog-dept-tb > .dept-body > .dept-td {
  border-right: 1px solid #e6e6e6 !important;
}
</style>
