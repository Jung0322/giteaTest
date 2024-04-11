<!--
  목적 : 시스템관리-공용코드-코드마스터
  작성자 : kga
  Detail : 코드마스터 관리
  *
  examples: 코드마스터 관리 목록/조회
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 코드도메인 -->
          <y-select
            :width="8"
            :comboItems="searchCodeDomainCdItems"
            itemText="codeDomainNm"
            itemValue="codeDomainCd"
            ui="bootstrap"
            name="codeDomainCd"
            label="L0000002976"
            v-model="searchParam.codeDomainCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 코드그룹 -->
          <y-select
            :width="8"
            :comboItems="searchCodeGroupCdItems"
            itemText="codeGroupNm"
            itemValue="codeGroupCd"
            ui="bootstrap"
            name="codeGroupCd"
            label="L0000002970"
            v-model="searchParam.codeGroupCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 코드명(KOR) -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000004544"
            name="codeNm"
            v-model="searchParam.codeNm"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 코드그룹명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002973"
            name="codeGroupNm"
            v-model="searchParam.codeGroupNm"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002982')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @btnSearchClicked="btnSearchClicked"
        />
      </b-col>
    </b-row>

    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'y-code-master',
  props: {},
  data() {
    return {
      codeMaster: {
        codeDomainCd: '',
        codeDomainNm: '',
        codeGroupCd: null,
        codeGroupNm: '',
        code: '',
        codeNm: '',
        remarks: '',
        sortOrder: null,
        useYn: 'Y',
        attr1: '',
        attr2: '',
        attr3: '',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
      },
      codeGroup: {
        codeGroupCd: '',
        codeLength: 5,
      },
      searchParam: {
        codeDomainCd: '',
        codeGroupCd: '',
        codeNm: '',
        forSystemYn: '',
      },
      searchArea: {
        title: 'L0000000329', // 검색박스숨기기
        show: true,
      },
      gridOptions: {
        header: [],
        data: [],
        height: '600',
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
      createMode: true,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      totalCodeList: [],
      searchCodeGroupCdItems: [],
      detailCodeGroupCdItems: [],
      searchCodeDomainCdItems: [],

      searchUrl: '',
      YAuiGrid: null,
    };
  },
  watch: {
    'searchParam.codeDomainCd': function (newValue, oldValue) {
      this.getCodeGroupCdItems();
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeGrid);
  },
  methods: {
    init() {
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002976'), // 코드도메인
          dataField: 'codeDomainNm',
          width: '150',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002970'), // 코드그룹
          dataField: 'codeGroupNm',
          width: '200',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002969'), // 코드
          dataField: 'code',
          width: '100',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004544'), // 코드명(KOR)
          dataField: 'codeNm',
          width: '250',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), // 비고
          dataField: 'remarks',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'), // 사용여부
          dataField: 'useYnNm',
          width: '100',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'), // 정렬순서
          dataField: 'sortOrder',
          width: '100',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002355') /* 작성자 */,
          dataField: 'writerUserNm',
          width: '120',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002352') /* 작성일 */,
          dataField: 'writerDt',
          width: '120',
          style: 'center-align',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'), // 신규등록
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), // 검색
          color: 'green',
          btnClicked: 'btnSearchClicked',
        },
      ];

      this.searchUrl = selectConfig.codeMaster.allList.url;

      this.editable = this.$route.meta.editable;

      this.getCodeDomainCdItems();
      this.getCodeGroupCdItems();
      this.getTotalCodeList();

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    getCodeDomainCdItems() {
      this.$http.url = selectConfig.codeDomain.list.url;
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          var searchItems = this.$_.clone(_result.data);
          searchItems.splice(0, 0, {
            codeDomainCd: null,
            codeDomainNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });

          this.searchCodeDomainCdItems = searchItems;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    getTotalCodeList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.totalCodeList = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },

    getCodeGroupCdItems() {
      this.$http.url = selectConfig.codeGroup.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        codeDomainCd: this.searchParam.codeDomainCd,
        // forSystemYn: 'N',
        settableYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          var searchItems = this.$_.clone(_result.data);
          var detailItems = this.$_.clone(_result.data);
          searchItems.splice(0, 0, {
            codeGroupCd: null,
            codeGroupNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }); // 전체
          this.searchCodeGroupCdItems = searchItems;

          if (
            this.searchParam.codeGroupCd &&
            this.$_.indexOf(
              this.$_.map(this.searchCodeGroupCdItems, 'codeGroupCd'),
              this.searchParam.codeGroupCd
            ) === -1
          ) {
            this.searchParam.codeGroupCd = null;
          }

          if (!this.searchParam.codeDomainCd) {
            detailItems.splice(0, 0, {
              codeGroupCd: null,
              codeGroupNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
            this.detailCodeGroupCdItems = detailItems;
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },

    btnSearchClicked() {
      this.getList();
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.item === null || event.item === undefined) return;
      if (event.dataField === 'codeNm') {
        this.popupOptions.top = '10px';
        this.popupOptions.width = '80%';
        this.popupOptions.target = () => import(`${'./codeMasterDetail.vue'}`);
        this.popupOptions.title = 'L0000002983'; // 코드마스터 상세 등록/수정
        this.popupOptions.visible = true;
        this.popupOptions.param = event.item;
        this.popupOptions.closeCallback = this.closePopupUsage;
      }
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./codeMasterDetail.vue'}`);
      this.popupOptions.title = 'L0000002983'; // 코드마스터 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        codeGroupCd: '',
        code: '',
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
