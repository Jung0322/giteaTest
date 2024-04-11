<!--
  목적 : 안전 > 기준정보 > 경영정보부서구분명
  작성자 : kdh
  Detail : 경영정보부서항목 목록/등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="infoItmAttCds"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="분류"
            name="infoItmAttCd"
            v-model="searchParam.infoItmAttCd"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <y-btn
              v-if="editable"
              title="신규등록"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
            <y-btn title="검색" color="green" @btnClicked="getList" />
          </div>
          <y-data-table
            label="경영정보항목 목록"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row>

    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'mgt-info-item',
  data() {
    return {
      management: {
        mgtMgInfoDeptAttNo: 0, // 부서구분번호
        mgtMgInfoItmNo: null, // 경영정보항목번호
        plantCd: null, // 사업장코드
        deptAttNm: '', // 부서구분명
        useYn: 'Y', // 사용여부
        sortOrder: 0, // 정렬순서
        createUserId: '', // 등록자
      },
      searchArea: {
        title: '검색박스숨기기',
        show: true,
      },
      searchParam: {
        plantCd: '',
        infoItmAttCd: '', // 분류
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
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      updateMode: false,
      searchUrl: '',
      detailUrl: '',
      checkUrl: '',
      isInsert: false,
      isEdit: false,
      comboMgtInfoItems: [], // 항목
      infoItmAttCds: [], // 분류 목록
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
      this.searchUrl = selectConfig.mgt.mgtInfoItem.list.url;
      this.comboUrl = selectConfig.mgt.mgtInfoItem.comboList.url;
      this.checkUrl = selectConfig.mgt.mgtInfoItem.checkMgtInfoItem.url;

      this.detailUrl = selectConfig.saf.electTitle.get.url;

      this.editable = this.$route.meta.editable;

      this.getList(); // 경영항목관리 grid
      this.getComboList(); // 항목 조회
      this.getCommonCodeList('MICS2'); // 분류 조회
      // this.setGridSize();

      // 경영항목관리 grid 헤더 설정
      this.gridOptions.header = [
        {
          text: '사용사업장',
          name: 'plantNm',
          width: '130px',
          align: 'center',
        },
        {
          text: '구분',
          name: 'infoItmTypeNm',
          width: '130px',
          align: 'center',
        },
        { text: '분류', name: 'infoItmAttNm', width: '130px', align: 'center' },
        {
          text: '항목',
          name: 'mgInfoItmNm',
          width: '130px',
          align: 'center',
        },
        {
          text: '부서구분명',
          name: 'deptAttNm',
          width: '130px',
          align: 'center',
          url: 'true',
        },
        { text: '사용여부', name: 'useYnNm', width: '100px', align: 'center' },
        {
          text: '정렬순서',
          name: 'sortOrder',
          width: '100px',
          align: 'center',
        },
      ];
    },
    // 검색
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./mgtInfoItemDetail.vue'}`);
      this.popupOptions.title = '경영정보항목 등록/수정';
      this.popupOptions.visible = true;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    btnPopupClickedCallback() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./mgtInfoItemDetail.vue'}`);
      this.popupOptions.title = '경영정보항목 등록/수정';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        mgtMgInfoDeptAttNo: 0,
        plantCd: this.searchParam.plantCd,
        infoItmAttCd: this.searchParam.infoItmAttCd,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    getComboList() {
      this.$http.url = this.comboUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;

      this.$http.request(
        (_result) => {
          this.comboMgtInfoItems = this.$_.clone(_result.data);
          this.comboMgtInfoItems.splice(0, 0, {
            mgtMgInfoItmNo: null,
            mgInfoItmNm: '선택하세요',
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /** Button Event **/

    // 초기화
    btnClearClickedCallback() {
      this.isInsert = false;
      this.updateMode = false;
      Object.assign(this.$data.management, this.$options.data().management);
      this.$validator.reset();
    },

    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },

    getCommonCodeList(codeGroup) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroup
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          if (codeGroup === 'MICS2') {
            // 분류
            this.infoItmAttCds = this.$_.clone(_result.data);
            this.infoItmAttCds.splice(0, 0, {
              code: null,
              codeNm: '전체',
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** /Button Event **/
  },
};
</script>
