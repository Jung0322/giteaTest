<!--
  목적 : sap에서 받은 저장위치 
  작성자 : kdh
  Detail : 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            filter="chm"
            name="plantCd"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 저장위치명 -->
          <y-text
            :width="8"
            :editable="editable"
            :clearable="true"
            ui="bootstrap"
            name="matStrgNm"
            label="L0000002479"
            v-model="searchParam.matStrgNm"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <b-row sm="12" class="mt-3">
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mb-1">
          <!-- 선택 -->
          <y-btn v-if="editable" title="L0000001561" color="orange" @btnClicked="onSelect" />
          <!-- 검색 -->
          <y-btn title="L0000000327" color="green" @btnClicked="getDataList" />
          <!-- 닫기 -->
          <y-btn title="L0000000881" @btnClicked="closePopup" />
        </div>
        <!-- 저장위치(SAP) 목록 -->
        <y-data-table
          label="L0000003844"
          ref="dataTable"
          :height="gridOptions.height"
          :headers="gridOptions.header"
          :items="gridOptions.data"
          @selectedRow="selectedRow"
          @rowDoubleClicked="rowDoubleClicked"
        ></y-data-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'sap-mat-strg',
  props: {},
  data() {
    return {
      searchParam: {
        matStrgNm: '', // 저장위치명
        plantCd: '', // 사업장
      },
      gridOptions: {
        header: [],
        data: [],
        height: 450,
      },
      editable: false,
      searchUrl: '',
      selectData: null,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.chm.mat.storageFacilityManagement.sapList.url;

      this.editable = this.$route.meta.editable;

      this.searchParam.plantCd = this.$store.getters.plantCd;

      this.getDataList();

      this.gridOptions.header = [
        // 사업장
        { text: 'L0000001415', name: 'plantNm', width: '150px', align: 'center', },
        // 저장위치코드
        { text: 'L0000002480', name: 'matStrgCd', width: '150px', align: 'center', },
        // 저장위치명
        { text: 'L0000002479', name: 'matStrgNm', width: '150px', align: 'left', },
      ];
    },
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.gridOptions.data = _result.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 그리드 row click 이벤트
    selectedRow(data) {
      if (!data || !this.editable) return;
      this.selectData = data;
    },
    rowDoubleClicked(data) {
      this.closePopup(data);
    },
    onSelect() {
      if (!this.selectData) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000183', // '저장위치를 선택하세요.',
          type: 'warning',
        });
      } else {
        this.closePopup(this.selectData);
      }
    },
    closePopup(data) {
      if (!data) data = 'CLOSE';
      this.$emit('closePopup', data);
    },
  },
};
</script>