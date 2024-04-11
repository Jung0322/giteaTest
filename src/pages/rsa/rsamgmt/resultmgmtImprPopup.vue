<!--
  목적 : 개선사항 상태 목록
  Detail : 개선사항 상태 목록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12">
        <y-auigrid
          ref="yAuiGrid"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000270')"
          :useExcelExport="true"
          @cellClick="cellClickHandler"
          @btnClose="closePopup('CLOSE')"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'appr-progress-popup',
  props: {
    popupParam: {
      type: Object,
      default() {
        return {
          plantCd: '',
          imprClassCd: '',
          apprFlag: '',
          refTableId: 0,
          popupMode: 'Y',
        };
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '85%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: true,
      searchParam: {
        plantCd: '',
        imprClassCd: '',
        apprFlag: '',
        refTableId: 0,
        popupMode: 'Y',
        dashMode: false,
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: '500',
        merge: [],
      },

      searchUrl: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    this.getList();
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchParam = this.popupParam;
      if (!this.searchParam.dashMode) {
        this.searchParam.plantCd = '';
      }

      this.searchParam.popupMode = 'Y';
      // Url Setting
      this.searchUrl = selectConfig.saf.imprAct.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002668'),
          dataField: 'actClassNm',
          width: '100',
        } /* 조치구분 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '100',
        } /* 사업장 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005032'),
          dataField: 'imprTitle',
          width: '170',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: () => {},
          },
        } /* 요청 제목 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000267'),
          dataField: 'imprRqstContents',
          width: '300',
          style: 'left-align',
        } /* 개선요청내용 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002666'),
          dataField: 'actResultContents',
          width: '250',
          style: 'left-align',
        } /* 조치결과내용 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005033'),
          dataField: 'imprStepNm',
          width: '100',
        } /* 조치결과 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002673'),
          dataField: 'actDeptNm',
          width: '130',
        } /* 조치부서 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002670'),
          dataField: 'actLimitYmd',
          width: '130',
        } /* 조치기한 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002685'),
          dataField: 'actConfirmYmd',
          width: '130',
        } /* 조치완료일 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002040'),
          dataField: 'completYn',
          width: '100',
        } /* 완료여부 */,
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'btnClose',
        }, // 닫기
      ];
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.$_.filter(_result.data, {
            actClassCd: 'ACL01',
          });
          // 개선요청사항 목록
          this.$_.filter(_result.data, {
            actClassCd: 'ACL02',
          });
          // 개선요청사항 목록
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'imprTitle') {
        this.openDialogPage('DETAIL', event.item);
      }
    },
    openDialogPage(flag, data) {
      this.popupOptions.param = {
        safImprActNo: data.safImprActNo,
        imprClassCd: data.imprClassCd,
        flag: flag,
      };

      this.popupOptions.title =
        'L0000002688'; /* 상세정보 --> 조치요청 상세 정보 */
      this.popupOptions.target = () =>
        import(`${'../../impr/improveDetail.vue'}`);

      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      if (data === 'CLOSE') {
        this.$emit('closePopup', data);
      } else {
        this.popupOptions.target = null;
        this.popupOptions.visible = false;
      }
    },
    resizeGrid() {
      this.YAuiGrid.resize(null, this.gridOptions.height);
    },
  },
};
</script>
