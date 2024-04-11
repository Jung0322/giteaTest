<!--
  목적 : 입법예고법규 조회
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
          <y-datepicker
            :width="8"
            :range="true"
            label="공고일자"
            name="period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="입법예고명"
            name="isNm"
            v-model="searchParam.isNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="asndOfiItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            name="mgrGovCd"
            label="소관부처"
            v-model="searchParam.mgrGovCd"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn title="검색" color="green" @btnClicked="getDataList" />
          </div>
          <y-data-table
            label="입법예고 목록"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
          >
          </y-data-table>
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'general-business',
  props: {},
  data() {
    return {
      searchParam: {
        period: [],
        isNm: '',
        mgrGovCd: '',
      },
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '70%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      asndOfiItems: [],
      searchUrl: '',
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // 헤더 설정
      this.gridOptions.header = [
        { text: '입법예고명', name: 'isNm', width: '215px', align: 'left', url: true, },
        { text: '법령종류(소관부서)', name: 'isClsNm', width: '95px', align: 'center', },
        { text: '공고번호(공고일자)', name: 'pntcNo', width: '85px', align: 'center', },
        { text: '시작일자', name: 'stYd', width: '55px', align: 'center' },
        { text: '종료일자', name: 'edYd', width: '55px', align: 'center' },
        { text: '법령안다운로드', name: 'temp', width: '65px', align: 'center', url: true, },
      ];

      // 공고일자 초기값 설정
      this.searchParam.period = [this.$comm.getFirstDayThisYear(), this.$comm.getToday()];

      // URL 설정
      this.searchUrl = selectConfig.lawMakinglist.list.url;

      this.getComboItems('MGR_GOVCD'); // 소관부처

      this.getDataList(); // 입법예고 목록
    },
    /** /초기화 관련 함수 **/
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
    // 소관부처 콤보 셋팅
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.asndOfiItems = this.$_.clone(_result.data);
          this.asndOfiItems.splice(0, 0, {
            codeNm: '전체',
            code: '',
          });
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkClicked(header, data) {
      if (!data) return;
      if (header.name === 'temp') {
        let link = document.createElement('a');
        link.href = data.fileDownLink;
        link.download = data.fileName;
        link.click();
      } else if (header.name === 'isNm') {
        window.open(data.detailUrl, '입법예고명', 'width=1200, height=700');
      }
    },
  },
};
</script>
