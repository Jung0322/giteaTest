<!--
  목적 : 화학물질 > 저장설비관리 
  작성자 : kyk
  Detail : 
  2019.08.07(수) kdh 
   > 설비가 아닌 시설로 취급함으로 인해 화면 수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 대표사업장 -->
          <y-plant
            type="search"
            filter="chm"
            label="L0000000940"
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
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 설치위치 -->
          <y-text
            :width="8"
            :editable="editable"
            :clearable="true"
            ui="bootstrap"
            name="location"
            label="L0000001626"
            v-model="searchParam.location"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <b-row class="mt-3 h-100">
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 신규등록 -->
            <y-btn v-if="editable" title="L0000001789" color="orange" @btnClicked="openPopup(null)" />
            <!-- 검색 -->
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
          <!-- 저장/보관 위치 목록 -->
          <y-data-table
            label="L0000002475"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @tableLinkClicked="tableLinkClicked"
            :use-paging="true"
          />
        </b-col>
      </b-col>
    </b-row>

    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'storage-facility-management',
  components: {},
  /** props, data, computed, watch **/
  props: {},
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        location: '', // 설치위치
        matStrgNm: '', // 저장위치명
        // deptCd: '', // 관리부서
        plantCd: '', // 사업장
      },
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },
      editable: true,
      searchUrl: '',
    };
  },
  computed: {},
  watch: {},
  /** created, beforeMount, mounted, beforeDestroy, destroyed **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
  },
  destroyed() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 사업장
        { text: 'L0000001415', name: 'plantNm', width: '110px', align: 'center', },
        // 저장위치코드
        { text: 'L0000002480', name: 'matStrgCd', width: '120px', align: 'center', },
        // 저장위치명
        { text: 'L0000002479', name: 'matStrgNm', width: '100px', align: 'center', url: 'link', },
        // 시설유형
        { text: 'L0000001747', name: 'matStrgTypeNm', width: '100px', align: 'center', },
        // 설치위치
        { text: 'L0000001626', name: 'location', width: '100px', align: 'center', },
        // 관리부서
        { text: 'L0000000591', name: 'deptNm', width: '100px', align: 'center', },
      ];

      this.searchUrl = selectConfig.chm.mat.storageFacilityManagement.list.url;

      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkClicked(header, row) {
      this.openPopup(row);
    },
    openPopup(data) {
      this.popupOptions.param = {
        matStrgCd: data ? data.matStrgCd : '',
        plantCd: data ? data.plantCd : '',
      };
      this.popupOptions.target = () => import(`${'./storageFacilityManagementDetail.vue'}`);
      this.popupOptions.title = 'L0000003842'; // '저장/보관 위치';
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '20px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getList();
    },
  },
};
</script>