<!--
  목적 : 환경 > 대기 > 시설관리 > 방지시설 > 상세 > 변경관리정보(탭)
  작성자 : jkl
  Detail : 대기 방지시설 변경이력 관리
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="py-0">
      <b-col sm="12" class="px-0">
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 삭제 -->
        </div>
        <!-- 가동시간 -->
        <y-data-table
          ref="dataTable"
          label="L0000001232"
          v-model="selectedValue"
          :popMode="true"
          :height="gridOptions.height"
          :headers="gridOptions.header"
          :items="gridOptions.data"
          :useRownum="false"
          @selectedRow="getDetail"
        >
          <el-table-column
            type="selection"
            slot="selection"
            align="center"
            width="55"
          ></el-table-column>
        </y-data-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'discharge-chk-result',
  props: {
    selectedTabIndex: 0,
  },
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: '250',
      },
    };
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {},
    getDetail(data) {
      this.$http.url = this.$format(
        this.detailUrl,
        data.eairPreventFacChgHistNo,
        this.prevention.eairPreventFacNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.updateMode = true;
          this.preventChgHist = _result.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>
