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
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 닫기 -->
            <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
          </div>
          <!-- 개선요청사항 목록 -->
          <y-data-table
            label="L0000000270"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @tableLinkClicked="tableLinkimprTitleClicked"
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
  },
  mounted() {
    this.init();
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
          text: 'L0000002668',
          name: 'actClassNm',
          width: '100px',
          align: 'center',
        } /* 조치구분 */,
        {
          text: 'L0000001415',
          name: 'plantNm',
          width: '100px',
          align: 'center',
        } /* 사업장 */,
        {
          text: 'L0000005032',
          name: 'imprTitle',
          width: '170px',
          align: 'left',
          url: 'true',
        } /* 요청 제목 */,
        {
          text: 'L0000000267',
          name: 'imprRqstContents',
          width: '300px',
        } /* 개선요청내용 */,
        {
          text: 'L0000002666',
          name: 'actResultContents',
          width: '250px',
        } /* 조치결과내용 */,
        {
          text: 'L0000005033',
          name: 'imprStepNm',
          width: '100px',
          align: 'center',
        } /* 조치결과 */,
        {
          text: 'L0000002673',
          name: 'actDeptNm',
          width: '130px',
          align: 'center',
        } /* 조치부서 */,
        {
          text: 'L0000002670',
          name: 'actLimitYmd',
          width: '130px',
          align: 'center',
        } /* 조치기한 */,
        {
          text: 'L0000002685',
          name: 'actConfirmYmd',
          width: '130px',
          align: 'center',
        } /* 조치완료일 */,
        {
          text: 'L0000002040',
          name: 'completYn',
          width: '100px',
          align: 'center',
        } /* 완료여부 */,
      ];
      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.$_.filter(_result.data, {
            actClassCd: 'ACL01',
          });
          // 개선요청사항 목록
          this.$_.filter(_result.data, {
            actClassCd: 'ACL02',
          });
          // 개선요청사항 목록
          this.gridOptions.data = _result.data;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkimprTitleClicked(header, data) {
      this.openDialogPage('DETAIL', data);
    },
    openDialogPage(flag, data) {
      this.popupOptions.param = {
        safImprActNo: data.safImprActNo,
        imprClassCd: data.imprClassCd,
        flag: flag,
      };

      this.popupOptions.title = 'L0000002688'; /* 상세정보 --> 조치요청 상세 정보 */
      this.popupOptions.target = () => import(`${'../../impr/improveDetail.vue'}`);

      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      if (data === 'CLOSE')
      {
        this.$emit('closePopup', data);        
      }
      else
      {
        this.popupOptions.target = null;
        this.popupOptions.visible = false;
      }
    },
  },
};
</script>
