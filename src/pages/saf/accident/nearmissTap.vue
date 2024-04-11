<!--
  목적 : 아차사고 등록-> 개선사항탭
  Detail : 개선사항 목록 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row ref="searchBox">
      <b-col sm="12">
        <b-row v-if="searchArea.show">
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12s">
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 즉시조치등록 -->
              <y-btn
                title="즉시조치등록"
                color="blue"
                v-if="disabled&&editable"
                @btnClicked="openDialogPage('NOW')"
              />
              <!-- 개선요청등록 -->
              <y-btn
                title="개선요청등록"
                color="blue"
                v-if="disabled&&editable"
                @btnClicked="openDialogPage('REQUEST')"
              />
            </div>
            <!-- 개선사항목록 -->
            <y-data-table
              ref="dataTable"
              label="개선사항목록"
              :messageCheck="isMessage"
              message="개선사항 입력은 안전점검결과 등록후 진행단계가 작성중일때만 입력 가능합니다."
              :headers="gridOptions.header"
              :items="gridOptions.data"
              :print="true"
              :rows="5"
              :cellClick="true"
              @tableLinkClicked="tableLinkimprTitleClicked"
            ></y-data-table>
          </b-col>
        </b-row>
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
  name: 'y-nearmissType-result-tap',
  props: {
    nearmiss: {
      safNearmissNo: 0, // 아차사고 번호
      nearmissTitle: '', // 아차사고명
      nearmissNum: '', // 발행번호
      processStepCd: '', // 진행단계
      nearmissYmd: '', // 발생일
      nearmissHour: '', // 발생시간
      nearmissMinute: '', // 발생분
      deptCd: '', // 부서코드
      area: '', // 발생장소
      occTypeCd: '', // 발생유형코드
      nearmissTypeEtc: '', // 발생유형기타
      contents: '', // 발생내용
      cauTypeCd: '', // 원인유형코드
      cauTypeEtc: '', // 원인유형기타
      bgnMeas: '', // 초기대책
      provReason: '', // 추정원인
      createUserId: '', // 등록자
      createDeptCd: '', // 등록자 부서
      createDt: '', // 작성일
      updateUserId: '', // 수정자
      updateDeptCd: '', // 수정자 부서
      updateDt: '', // 수정일
      showDeptNm: '', // 사용자부서
      showUserNm: '', // 사용자명
    },
  },
  data: () => ({
    searchParam: {
      safEduRsltNo: '',
    },
    searchArea: {
      title: '검색박스숨기기', // 검색박스숨기기
      show: true,
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '1000px',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    gridOptions: {
      header: [],
      data: [],
      height: '300',
    },
    baseWidth: 9,
    editable: true,
    searchUrl: '',
    gridLabel: '',
    isMessage: false,
    disabled: true,
  }),
  watch: {
    // TODO : 부모의 v-model 변경을 감시(예를 들면, db로부터 데이터를 조회 한 후 값을 바인딩 할 경우)
    'nearmiss.safNearmissNo': function(newValue, oldValue) {
      this.init();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  update() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
  },
  beforeDestroy() {
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.searchUrl = selectConfig.saf.nearmiss.getImprActList.url;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          text: 'L0000004666', // 조치처리구분
          name: 'actClassNm',
          width: '150px',
          align: 'center',
        },
        {
          text: 'L0000000267', // 개선요청내용
          name: 'imprRqstContents',
          width: '200px',
          url: 'true',
        },
        {
          text: 'L0000002666', // 조치결과내용
          name: 'actResultContents',
          width: '200px',
          align: 'left',
        },
        {
          text: 'L0000002673', // 조치부서
          name: 'actDeptNm',
          width: '150px',
          align: 'center',
        },
        {
          text: 'L0000002670', // 조치기한
          name: 'actLimitYmd',
          width: '200px',
          align: 'center',
        },
        {
          text: 'L0000002691', // 조치일자
          name: 'actConfirmYmd',
          width: '200px',
          align: 'center',
        },
      ];

      this.getList();
      // 완료 처리 된것은 수정 불가 및 개선사항 등록 불가
      if (this.nearmiss.processStepCd === 'NEMS2') {
        // this.editable = false;
        this.isMessage = false;
        this.disabled = false;
      } else if (this.nearmiss.processStepCd === '') {
        this.isMessage = true;
      } else if (this.nearmiss.processStepCd === 'NEMS3') {
        this.disabled = false;
      }
    },

    selectedRow(data) {
      if (data === null) return;
    },
    // 목록 조회
    getList() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.nearmiss.safNearmissNo
      );
      this.$http.type = 'get';
      this.$http.request(
        _result => {
          this.gridOptions.data = _result.data;
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },

    tableLinkimprTitleClicked(header, data) {
      this.openDialogPage('DETAIL', data);
    },
    openDialogPage(flag, data) {
      if (this.nearmiss.processStepCd === '') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000689', // 아차사고를 저장후 등록 가능합니다.
          type: 'info',
        });
        return;
      } else if (this.nearmiss.processStepCd === 'STEP2' && flag !== 'DETAIL') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000690', // 완료된 아차 사고 입니다.
          type: 'info',
        });
        return;
      }

      if (data !== undefined) {
        if (data.imprStepCd === 'IMST1' && data.actClassCd === 'ACL01') {
          flag = 'NOW';
        } else if (data.imprStepCd === 'IMST1' && data.actClassCd === 'ACL02') {
          flag = 'REQUEST';
        }

        if (!this.editable) flag = 'DETAIL';

        this.popupOptions.param = {
          safImprActNo: data.safImprActNo,
          imprClassCd: data.imprClassCd,
          refTableId: this.nearmiss.refTableId,
          flag: flag,
        };
      } else {
        if (!this.editable) flag = 'DETAIL';

        this.popupOptions.param = {
          safImprActNo: 0,
          imprClassCd: 'ICL02', // 아차사고 코드
          refTableId: this.nearmiss.safNearmissNo,
          flag: flag,
        };
      }

      if (flag === 'NOW') {
        this.popupOptions.title = 'L0000002740'; // 즉시조치등록
        this.popupOptions.target = () =>
          import(`${'../../impr/immediateActionDetail.vue'}`);
      } else if (flag === 'DETAIL') {
        this.popupOptions.title = 'L0000003458'; // 개선요청상세
        this.popupOptions.target = () =>
          import(`${'../../impr/improveDetail.vue'}`);
      } else {
        this.popupOptions.title = 'L0000000268'; // 개선요청등록
        this.popupOptions.target = () =>
          import(`${'../../impr/actionRequest.vue'}`);
      }

      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },

    // 즉시 조치 / 개선요청등록 버튼
    btnPopupClicked() {},

    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isSubmit = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      // TODO : 여기에 추가 로직 삽입(로직 삽입시 지워주세요)
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },

    /**
     * 사용자의 입력을 받는다.
     */
    /** button 관련 이벤트 **/

    /** end button 관련 이벤트 **/
  },
};
</script>