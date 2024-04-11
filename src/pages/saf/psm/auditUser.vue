<!--
  목적 : 검사원
  Detail : 검사원 검색/등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="searchBox">
      <b-col sm="12">
        <y-search-box :gridOptions="gridOptions" @enter="getList">
          <b-row slot="search">
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant type="search" v-model="searchParam.plantCd" />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 년도 -->
              <y-datepicker
                :width="8"
                type="year"
                label="L0000000829"
                name="year"
                :default="searchParam.year"
                v-model="searchParam.year"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 구분 -->
              <y-select
                :width="8"
                :comboItems="typeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000686"
                name="auditTypeCd"
                v-model="searchParam.auditTypeCd"
              ></y-select>
            </b-col>
          </b-row>
        </y-search-box>
      </b-col>
    </b-row>

    <b-row>
      <b-col sm="12">
        <!-- PSM 감사원 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000145')"
          :useExcelExport="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableSorting="true"
          :showRowCheckColumn="popupParam.isPopup"
          @cellClick="cellClickHandler"
          @openPopup="openPopup"
          @btnAuditUser="btnAuditUser"
          @getList="getList"
          @btnClosePop="closePopupThis"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'audit-user',
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
        year: '',
        auditTypeCd: '',
      },
      YAuiGrid: null,
      gridOptions: {
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
      typeItems: [],
      editable: false,
      searchUrl: '',
      isDelete: false,
      deleteValue: null,
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
      this.searchUrl = selectConfig.saf.auditUser.list.url;
      this.editable = this.$route.meta.editable;

      // 올해
      this.searchParam.year = this.$comm.moment().format('YYYY');

      // 검사원구분
      this.$comm.getComboItems('AUDIT_TYPE_CD', true).then((_result) => {
        this.typeItems = _result;
      });

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '90',
        } /* 사업장 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000829'),
          dataField: 'year',
          width: '80',
        } /* 년도 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'auditTypeNm',
          width: '100',
        } /* 구분 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '150',
        } /* 부서 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'userNm',
          width: '110',
        } /* 성명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002491'),
          dataField: 'majorDesc',
          width: '120',
          style: 'left-align',
        } /* 전공 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000458'),
          dataField: 'careerDesc',
          width: '70',
        } /* 경력 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000665'),
          dataField: 'eduDesc',
          width: '110',
          style: 'left-align',
        } /* 교육이수현황 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002304'),
          dataField: 'certiDesc',
          width: '110',
          style: 'left-align',
        } /* 자격증보유현황 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '140',
          style: 'left-align',
        } /* 비고 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '90',
        } /* 사용여부 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '100',
        } /* 작성자 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '100',
        } /* 작성일 */,
      ];
      if (!this.popupParam.isPopup) {
        const idx = this.gridOptions.header.findIndex(
          (item) => item.dataField === 'userNm'
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
          visible: this.editable && !this.popupParam.isPopup,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnAuditUser',
          visible: this.popupParam.isPopup,
        }, // 선택
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        }, //
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          color: 'orange',
          btnClicked: 'btnClosePop',
          visible: this.popupParam.isPopup,
        }, // 닫기
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      const searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    // 검사원 그리드
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
    cellClickHandler(event) {
      if (event.dataField === 'userNm') {
        this.openPopup(event.item);
      }
    },
    /**
     * 등록 팝업  호출
     */
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./auditUserDetail.vue'}`);
      this.popupOptions.title = data
        ? 'L0000000146'
        : 'L0000003782'; /* PSM 감사원 상세' : 'PSM 감사원 등록 */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        auditUserNo: data ? data.auditUserNo : 0,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    beforeDelete() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000057' /* 삭제할 항목을 선택해주세요. */,
          type: 'warning',
        });
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        type: 'info',
        confirmCallback: () => {
          this.deleteValue = {
            data: Object.values(this.$_.clone(selectedRows)),
          };
          this.isDelete = true;
        },
      });
    },
    /** Button Event **/
    /**
     * 검색박스 숨기기/보이기 처리
     */
    // 버튼 에러 처리
    btnAuditUser() {
      const selectedRows = this.YAuiGrid.getCheckedRowItemsAll();
      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message:
            'M0000000705' /* PSM 감사원 목록에서 한 행 이상 선택하세요. */,
          type: 'warning',
        });
      } else {
        this.closePopupThis(selectedRows);
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
