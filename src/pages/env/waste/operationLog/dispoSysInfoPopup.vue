<!--
  목적 : 사용자검색
  작성자 : khk
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 닫기 -->
            <y-btn title="L0000000881" @btnClicked="closePopup" />
          </div>
          <y-data-table
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @selectedRow="selectedRow"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'waste_sap_if',
  props: {
    popupParam: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },
      searchUrl: '',
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
  beforeDestory() {
  },
  /** methods **/
  methods: {
    init() {
      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장 코드
        { text: 'L0000003671', name: 'WERKS', width: '120px', align: 'center', },
        // 반출입일자
        { text: 'L0000003672', name: 'ZIODAT', width: '120px', align: 'center', },
        // 출고번호
        { text: 'L0000002904', name: 'ZOUTNO', width: '150px', align: 'center', },
        // 회수번호
        { text: 'L0000003359', name: 'ZIOCNT', width: '150px', align: 'center', },
        // 관련근거
        { text: 'L0000000565', name: 'ZRFNO', width: '150px', align: 'center', },
        // 반출입구분
        { text: 'L0000001072', name: 'ZIOGBNM', width: '150px', align: 'center', },
        // 비고
        { text: 'L0000001360', name: 'ZBIGO', width: '150px', align: 'center', },
        // 차량번호
        { text: 'L0000002797', name: 'ZCARNS', width: '100px', align: 'center', },
        // 계근순번
        { text: 'L0000003673', name: 'ZIOSEQ', width: '100px', align: 'center', },
        // 물품명
        { text: 'L0000003681', name: 'ZMATNM', width: '200px', align: 'center' },
        // 계근중량
        { text: 'L0000000462', name: 'ZGRWGT', width: '100px', align: 'center', },
        // 공차중량
        { text: 'L0000000557', name: 'ZBLKWE', width: '100px', align: 'center', },
        // 처리량
        { text: 'L0000002824', name: 'ZGGWGT', width: '100px', align: 'center', },
        // 포장중량
        { text: 'L0000003682', name: 'ZTAREW', width: '100px', align: 'center', },
        // 단위
        { text: 'L0000000870', name: 'ZEKG', width: '100px', align: 'center' },
      ];

      this.searchUrl = selectConfig.env.waste.operationLog.disposalResult.sap.url;

      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.param = {
        reqYmdPeriod: this.popupParam.ymd,
        plantCd: this.popupParam.plantCd,
      };

      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.gridOptions.data = this.$_.filter(_result.data, {
            WERKS: this.popupParam.plantCd,
          });
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectedRow(data) {
      this.$emit('closePopup', { success: true, sys: data });
    },
    closePopup() {
      this.$emit('closePopup', { success: true });
    },
    btnSearchClicked() {
      this.getList();
    },
  },
};
</script>