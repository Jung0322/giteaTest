<!--
  목적 : 안전 - 선해임
  Detail : 선해임 조회 화면\
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box
      :gridOptions="gridOptions"
      @enter="btnSearchClickedCallback"
      v-if="this.popupParam.popupMode === false"
    >
      <b-row slot="search">
        <!-- 사업장 -->
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <y-plant
            :width="9"
            type="search"
            v-model="searchParam.plantCd"
          ></y-plant>
        </b-col>

        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!--  선임자명 -->
          <y-text
            :width="9"
            ui="bootstrap"
            label="L0000001560"
            name="userNm"
            v-model="searchParam.userNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!--  법정선임자 명 -->
          <y-select
            :width="9"
            :comboItems="electTitleItems"
            itemText="electTitlNm"
            itemValue="safElectTitlNo"
            ui="bootstrap"
            name="status"
            label="L0000001565"
            v-model="searchParam.safElectTitlNo"
          ></y-select>
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
              v-if="editable && this.popupParam.popupMode === false"
              title="L0000001789"
              color="orange"
              @btnClicked="openPopup"
            />
             검색
            <y-btn
              v-if="this.popupParam.popupMode === false"
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
            />
             닫기 
            <y-btn
              v-if="this.popupParam.popupMode === true"
              title="L0000000881"
              @btnClicked="btnClosePopup"
            />
          </div>
           선해임 목록
          <y-data-table
            class="mergeTable"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            :span-options="gridOptions.merge"
            :rowClassName="tableRowClassName"
            @tableLinkClicked="tableLinkAccidentTitleClicked"
            label="L0000001563"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000001563')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
          @getList="getList"
          @openNewPopup="openNewPopup"
          @closePopup="btnClosePopup"
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
  /* attributes: name, components, props, data */
  name: 'y-elec-his',
  props: {
    popupParam: {
      type: Object,
      default() {
        return {
          popupMode: false,
          plantCd: null,
          safElectTitlNo: null,
          startDt: '',
          endDt: '',
        };
      },
    },
  },
  data: () => ({
    searchParam: {
      period: [], // 선해임일자
      electTypeCd: null, // 구분
      userNm: '', // 선임자
      safElectTitlNo: null, // 선해임명번호
      testEndDt: '',
      plantCd: null,
    },
    searchArea: {
      // title: '검색박스숨기기',
      show: true,
    },
    gridOptions: {
      name: 'electHis',
      header: [],
      btns: [],
      data: [],
      height: '500',
      merge: [],
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '80%',
      top: '10px',
      closeCallback: null,
    },
    YAuiGrid: null,
    editable: false,
    electTypeCdItems: [], // 구분
    electTitleItems: [], // 선해임명
    searchUrl: '',
    searchElectTitleUrl: '',
  }),
  watch: {
    'searchParam.plantCd'() {
      this.getElectTitleComboItems();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    // this.searchParam.period.push(
    //   this.$comm.getCalculatedDate(
    //     this.$comm.getToday(),
    //     '-1m',
    //     'YYYY-MM-DD',
    //     'YYYY-MM-DD'
    //   )
    // );

    // this.searchParam.period.push(this.$comm.moment().format('YYYY-MM-DD'));
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.electHis.list.url;
      this.searchElectTitleUrl = selectConfig.saf.electTitle.list.url;

      this.gridOptions.merge = [
        { index: 1, field: 'plantNm' },
        { index: 2, field: 'plantNm' },
        { index: 3, field: 'plantNm' },
      ];

      if (this.popupParam.popupMode) {
        this.popupParam.period = [
          this.popupParam.startDt,
          this.popupParam.endDt,
        ];

        this.searchParam.plantCd = this.popupParam.plantCd;
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '11%',
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001346'),
          dataField: 'electAttNm',
          width: '12%',
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001565'),
          dataField: 'electTitlNm',
          width: '11%',
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001559'),
          dataField: 'userNm',
          width: '11%',
          styleFunction: (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item,
            dataField
          ) => {
            if (this.popupParam.popupMode) {
              return 'row-color';
            } else {
              return 'row-color2';
            }
          },
        },
        // {
        //   text: 'L0000001559' /* 선임자 */,
        //   name: 'userNm',
        //   width: '130px',
        //   align: 'center',
        //   url: this.popupParam.popupMode === false ? 'link' : null,
        // },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001558'),
          dataField: 'electDt',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003217'),
          dataField: 'electEndDt',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '11%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openNewPopup',
          visible: !this.popupParam.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
          visible: !this.popupParam.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
          visible: this.popupParam.popupMode,
        },
      ];

      // this.setHeader(); // popupMode gridheader 해임일 제거
      if (this.popupParam.popupMode === true) {
        this.setHeader();
      }

      this.getComboItems('SAF_ELECT_TYPE'); // 구분
      this.getElectTitleComboItems(); // 선해임명

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (
        typeof searchParamByCookie !== 'undefined' &&
        !this.popupParam.popupMode
      ) {
        this.searchParam = searchParamByCookie;
      }

      this.getList(); // 선해임 목록 조회
      // this.setGridSize(); // 그리드 사이즈 조절
    },
    // gridheader 해임일 제거 메소드
    setHeader() {
      let idx = '';
      this.$_.forEach(this.gridOptions.header, (item) => {
        console.log('2', item);
        if (this.popupParam.popupMode === true) {
          if (item.dataField === 'electEndDt') {
            idx = this.gridOptions.header.indexOf(item);
          }
        }
      });
      this.gridOptions.header.splice(idx, 1);
    },
    /**
     * 공통 마스터 정보 조회 (구분)
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
          if (codeGroupCd === 'SAF_ELECT_TYPE') {
            this.electTypeCdItems = this.$_.clone(_result.data);
            this.electTypeCdItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 선해임명 **/
    getElectTitleComboItems() {
      this.searchParam.safElectTitlNo = null;
      this.$http.url = this.searchElectTitleUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.electTitleItems = this.$_.clone(_result.data);
          this.electTitleItems.splice(0, 0, {
            safElectTitlNo: null,
            electTitlNm:
              this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableRowClassName({ row, rowIndex }) {
      return 'odd-row';
    },
    /** 선해임 목록 검색 **/
    getList() {
      if (this.popupParam.popupMode && this.popupParam.safElectTitlNo) {
        this.searchParam = this.popupParam;
      }

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          if (!this.popupParam.popupMode) {
            this.$comm.pushCookie(this.searchParam);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * showAccidentPopup 호출
     * 평가계획 목록에 평가명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    tableLinkAccidentTitleClicked(header, data) {
      this.openPopup(data);
    },
    cellClickHandler(event) {
      if (this.popupParam.popupMode) return;
      if (event.dataField !== 'userNm') return;
      this.popupOptions.param = {
        safElectHisNo: event.item ? event.item.safElectHisNo : 0, // key
      };
      this.popupOptions.target = () => import(`${'./electHisDetail.vue'}`);
      this.popupOptions.title = 'L0000001569'; /* 선해임상세 */
      this.popupOptions.width = '80%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openNewPopup() {
      this.popupOptions.param = {
        safElectHisNo: 0, // key
      };
      this.popupOptions.target = () => import(`${'./electHisDetail.vue'}`);
      this.popupOptions.title = 'L0000001569'; /* 선해임상세 */
      this.popupOptions.width = '80%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    openPopup(data) {
      this.popupOptions.param = {
        safElectHisNo: data ? data.safElectHisNo : 0, // key
      };
      this.popupOptions.target = () => import(`${'./electHisDetail.vue'}`);
      this.popupOptions.title = 'L0000001569'; /* 선해임상세 */
      this.popupOptions.width = '80%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },

    openHrPopup(data) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message:
          'M0000000566' /* 인사시스템과 인터페이스가 필요하여 현재 연결할 수 없습니다. */,
        type: 'info',
      });
      /*
      백엔드에서 openquery(ehr) 관련하여 문제 해결 필요

      기존 코드
      this.popupOptions.param = {};
      this.popupOptions.target = () => import(`${'./electHisHr.vue'}`);
      this.popupOptions.title = 'HR 선임현황';
      this.popupOptions.width = '80%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeHrPopup;
      */
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },

    closeHrPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },

    /** button 관련 이벤트 **/

    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchClickedCallback() {
      this.getList();
    },
    btnClosePopup(data) {
      this.$emit('closePopup', { success: true });
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
<style>
.row-color2 {
  color: #0a85e7 !important;
  cursor: pointer !important;
}
.row-color {
  color: #333333 !important;
  pointer-events: none;
}
</style>
