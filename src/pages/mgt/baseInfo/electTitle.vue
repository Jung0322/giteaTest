<!--
  목적 : 안전 > 기준정보 > 선해임명관리
  작성자 : kdh
  Detail : 선해임명관리 목록/등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 구분 -->
          <y-plant
            :width="9"
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          >
          </y-plant>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 구분 -->
          <y-select
            :width="9"
            :comboItems="electClsSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000686"
            name="electClsSearchCd"
            v-model="searchParam.electClsCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 분야 -->
          <y-select
            :width="9"
            :comboItems="electAttCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001346"
            name="electClsSearchCd"
            v-model="searchParam.electAttCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-4">
          <!-- 법정선임자임명 -->
          <y-text
            :width="9"
            ui="bootstrap"
            label="L0000001565"
            name="electTitlSearchNm"
            v-model="searchParam.electTitlNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           선해임명 목록
          <y-data-table
            label="L0000001566"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001566')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getDataList="getDataList"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @cellClick="cellClickHandler"
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
  name: 'y-elect-title',
  props: {},
  data() {
    return {
      electTitle: {
        safElectTitlNo: 0,
        electClsCd: null,
        electAttCd: null,
        refLawCd: null,
        electTitlNm: '',
        lcnTypeCds: [],
        sortOrder: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        qualifiRequire: '',
        electStndDesc: '',
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
      lcnTypeCds: [],
      searchArea: {
        title: 'L0000000329' /* 검색박스숨기기 */,
        show: true,
      },
      searchParam: {
        electClsCd: null, // 구분
        electTitlNm: '', // 선해임명
      },
      gridOptions: {
        name: 'electTitle',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      editable: false,
      updateMode: false,
      searchUrl: '',
      detailUrl: '',
      checkUrl: '',
      isInsert: false,
      isEdit: false,
      electClsSearchItems: [], // 구분 리스트 (검색)
      electClsItems: [], // 구분 리스트 (저장)
      electAttCdSearchItems: [], // 분야(검색)
      electAttCdItems: [], // 분야(저장)
      refLawCdItems: [], // 법규명(저장)
      lcnTypeCdItems: [], // 자격증 (저장)
      elecTypeCdItems: [], // 신고/선임
      electTypeCdItems: [],
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.electTitle.list.url;
      this.detailUrl = selectConfig.saf.electTitle.get.url;
      this.checkUrl = selectConfig.saf.electTitle.check.url;

      this.editable = this.$route.meta.editable;

      this.getComboItems('SAF_ELECT_CLS'); // 구분
      this.getComboItems('TASK_GRP'); // 분야
      this.getComboItems('MGT_LAW_CLASS'); // 법규명
      this.getComboItems('MGT_LCN_TYPE'); // 자격증
      this.getComboItems('MGT_ELECT_TYPE'); // 신고/선임/

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDataList(); // 선해임명 grid
      // this.setGridSize();

      // 선해임명 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'electClsNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001346'),
          dataField: 'electAttNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001207'),
          dataField: 'refLawNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001565'),
          dataField: 'electTitlNm',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001556'),
          dataField: 'electStndDesc',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002303'),
          dataField: 'qualifiRequire',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001782'),
          dataField: 'electTypeNm',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005040'),
          dataField: 'evalTgtYnNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005042'),
          dataField: 'useYnCt',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',
        },
      ];
    },
    /**
     * 공통 마스터 정보 조회 (구분, 분야,  법규명, 자격증)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'SAF_ELECT_CLS') {
            this.electClsSearchItems = this.$_.clone(_result.data);
            this.electClsSearchItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel('L0000002519') /* '전체' */,
            });
            this.electClsItems = this.$_.clone(_result.data);
            this.electClsItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel(
                  'L0000003394'
                ) /* '선택하세요' */,
            });
          } else if (codeGroupCd === 'TASK_GRP') {
            this.electAttCdSearchItems = this.$_.clone(_result.data);
            this.electAttCdSearchItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel('L0000002519') /* '전체' */,
            });
            this.electAttCdItems = this.$_.clone(_result.data);
            this.electAttCdItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel(
                  'L0000003394'
                ) /* '선택하세요' */,
            });
          } else if (codeGroupCd === 'MGT_LAW_CLASS') {
            this.refLawCdItems = this.$_.clone(_result.data);
            this.refLawCdItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel(
                  'L0000003394'
                ) /* '선택하세요' */,
            });
          } else if (codeGroupCd === 'MGT_LCN_TYPE') {
            this.lcnTypeCdItems = this.$_.clone(_result.data);
          } else if (codeGroupCd === 'MGT_ELECT_TYPE') {
            this.electTypeCdItems = this.$_.clone(_result.data);
            this.electTypeCdItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel(
                  'L0000003394'
                ) /* '선택하세요' */,
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 선해임명 grid
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.dataField !== 'electTitlNm') return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./electTitleDetail.vue'}`);
      this.popupOptions.title = 'L0000001568'; /* 선해임명 상세 등록/수정 */
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./electTitleDetail.vue'}`);
      this.popupOptions.title = 'L0000001568'; /* 선해임명 상세 등록/수정 */
      this.popupOptions.visible = true;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./electTitleDetail.vue'}`);
      this.popupOptions.title = 'L0000001568'; /* 선해임명 상세 등록/수정 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safElectTitlNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },

    /** Button Event **/

    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // // 초기화
    // btnClearClickedCallback() {
    //   this.updateMode = false;
    //   Object.assign(this.$data.electTitle, this.$options.data().electTitle);
    //   this.$validator.reset();
    // },

    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    /** /Button Event **/
  },
};
</script>
