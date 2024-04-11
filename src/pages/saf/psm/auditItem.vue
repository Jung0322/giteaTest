<!--
  목적 : psm 감사범위 관리
  Detail : psm 감사범위 검색 화면
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
          <!-- 감사기준 -->
          <y-text
            :width="8"
            label="L0000000229"
            type="search"
            name="auditStdDesc"
            v-model="searchParam.auditStdDesc"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            label="L0000001439"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            name="useYn"
            v-model="searchParam.useYn"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <b-row>
      <b-col sm="12">
        <!-- 감사기준 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000230')"
          :useExcelExport="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableSorting="true"
          :showRowCheckColumn="popupParam.isPopup"
          @cellClick="cellClickHandler"
          @openPopup="openPopup"
          @btnSelectAuditItem="btnSelectAuditItem"
          @btnGetList="getList"
          @btnPopup="closePopupThis"
          @btnClickedErrorCallback="btnClickedErrorCallback"
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
  name: 'audit-item',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          isPopup: false,
        };
      },
    },
  },
  data() {
    return {
      searchParam: {
        plantCd: '',
        auditStdDesc: '',
        useYn: 'Y',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'safBaseInfoPsmAuditItem',
        header: [],
        data: [],
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
      useItems: [],
      editable: false,
      searchUrl: '',
      deleteUrl: '',
      isDelete: false,
      selectedValue: [],
      deleteValue: null,
      selectAuditItem: null,
    };
  },
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.saf.auditItem.list.url;
      this.deleteUrl = transactionConfig.saf.auditItem.delete.url;
      this.editable = this.$route.meta.editable;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
        } /* 사업장 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000233'),
          dataField: 'auditStdNm',
          width: '16%',
        } /* 감사범위 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000229'),
          dataField: 'auditStdDesc',
          width: '16%',
          style: 'left-align',
        } /* 감사기준 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'),
          dataField: 'chargeDeptNm',
          width: '10%',
        } /* 주관부서 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003338'),
          dataField: 'convFactor',
          width: '7%',
          style: 'right-align',
        } /* 환산계수 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '10%',
          style: 'left-align',
        } /* 비고 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '7%',
        } /* 정렬순서 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '7%',
        } /* 사용여부 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        } /* 작성자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        } /* 작성일 */,
      ];
      if (!this.popupParam.isPopup) {
        const idx = this.gridOptions.header.findIndex(
          (item) => item.dataField === 'auditStdDesc'
        );
        if (idx > -1) {
          this.gridOptions.header[idx].renderer = {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          };
        }
      }
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openPopup',
          btnClickedError: 'btnClickedError',
          visible: this.editable && !this.popupParam.isPopup,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnSelectAuditItem',
          btnClickedError: 'btnClickedError',
          visible: this.popupParam.isPopup,
        }, // 선택
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnGetList',
          btnClickedError: 'btnClickedError',
        }, // 검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          color: 'orange',
          btnClicked: 'btnPopup',
          btnClickedError: 'btnClickedError',
          visible: this.popupParam.isPopup,
        }, // 닫기
      ];

      // 사용여부
      this.useItems = [
        {
          code: null,
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
        } /* 전체 */,
        {
          code: 'Y',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001440'),
        } /* 사용 */,
        {
          code: 'N',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001063'),
        } /* 미사용 */,
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      const searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    // 검진 계획 그리드
    getList() {
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
    // 그리드 row click 이벤트
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (this.popupParam.isPopup) {
        return;
      } else if (event.dataField === 'auditStdDesc') {
        this.openPopup(event.item);
      }
    },
    /**
     * 등록 팝업  호출
     */
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'@/pages/saf/psm/auditItemDetail.vue'}`);
      this.popupOptions.title = data
        ? 'L0000000144' /* PSM 감사범위 상세 */
        : 'L0000003785'; /* PSM 감사범위 등록 */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        auditStdNo: data ? data.auditStdNo : 0,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /** Button Event **/
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSelectAuditItem() {
      const selectedRow = this.YAuiGrid.getCheckedRowItemsAll();

      if (!selectedRow || selectedRow.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000702' /* 감사범위 목록에서 한 행 이상 선택하세요. */,
          type: 'warning',
        });
      } else {
        this.closePopupThis(selectedRow);
      }
    },
    // 팝업 닫기
    closePopupThis(data) {
      if (!data) {
        data = 'CLOSE';
      }
      // 부모창에 값 전달
      this.$emit('closePopup', data);
    },
    /** /Button Event **/
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 335;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
