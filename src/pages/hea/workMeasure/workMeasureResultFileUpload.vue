<!--
  목적 : 작업환경측정결과 엑셀 업로드
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 업로드정보 -->
            <y-label label="L0000001945" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
            <y-file-upload
              ref="fileupload"
              :attach-file-grp="attachFileGrp"
              :label="attachFileGrp.label"
              :drag="attachFileGrp.drag"
              :multiple="false"
              :limit="1"
              :close="true"
              @closePopup="getList"
            ></y-file-upload>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 업로드 및 저장결과 -->
          <y-data-table
            ref="dataTable"
            label="L0000001937"
            :height="'100'"
            :minHeight="'100'"
            :headers="gridUploadHeaderOptions"
            :items="gridUploadData"
            :print="true"
            :rows="4"
            :useRownum="false"
            :popMode="true"
          />
        </b-col>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 오류정보(실패한 사유에 대한 정보) -->
          <y-data-table
            ref="dataTable"
            label="L0000002022"
            :height="'200'"
            :minHeight="'200'"
            :headers="gridErrorHeaderOptions"
            :items="gridErrorData"
            :print="true"
            :rows="4"
            :useRownum="false"
            :popMode="true"
          />
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import backendConfig from '@/js/backendConfig.js';
export default {
  /** attributes: name, components, props, data **/
  name: 'diagnose-result-upload', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        plantCd: '',
        workAreaGradeCd: '',
      }),
    },
    // workAreaGradeCd: {
    //   type: String,
    //   default: '',
    // },
  },
  // TODO: 화살표 함수(=>)는 data에 사용하지 말 것
  //    data: () => { return { a: this.myProp }}) 화살표 함수가 부모 컨텍스트를 바인딩하기 때문에 this는 예상과 달리 Vue 인스턴스가 아니기 때문에 this.myProp는 undefined로 나옵니다.
  //    참고url: https://kr.vuejs.org/v2/api/index.html#data
  data() {
    return {
      // Naming Rule : JAVA model class와 연동되는 vue model은 model class명을 Camel case로 변환해서 선언하시고 기본값은 {}로 초기화 시켜주세요.
      // 예) ExamData -> examData: {},
      uploadFile: {
        file: null,
      },
      uploadResult: {
        classNm: '',
        totalCount: 0,
        successCount: 0,
        failCount: 0,
      },
      errorInfo: {
        classNm: '',
        failRow: 0,
        failMessage: '',
        remark: '',
      },
      // 첨부파일 그룹
      attachFileGrp: {
        label: '파일업로드',
        taskClassNm: 'WORK_MEASURE_RESULT_TEMPLETE',
        taskKey: '0',
        createUserId: '',
        showUploadBtn: true,
        plantCd: '',
        workAreaGradeCd: '',
        // uploadFile: this.uploadFile,
      },
      baseWidth: 9,
      editable: true,
      isUploadSubmit: false,

      gridUploadData: [],
      gridUploadHeaderOptions: [],
      gridErrorData: [],
      gridErrorHeaderOptions: [],

      searchExcelUrl: '',
      workAreaGradeCd: '',
    };
  },
  watch: {},
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchExcelUrl = selectConfig.rsa.workMeasureResult.excelUpload.url;

      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.
      // 선택항목 설정

      setTimeout(() => {
        var nowDate = new Date();
        this.attachFileGrp.taskKey = nowDate.getTime().toString();
        this.attachFileGrp.createUserId = this.$store.getters.token;
      }, 200);

      // 그리드 헤더 설정
      this.gridUploadHeaderOptions = [
        {
          text: 'L0000002520', // 전체 Row 수
          name: 'totalCount',
          width: '25%',
          align: 'center',
        },
        {
          text: 'L0000001629', // 성공 Row 수
          name: 'successCount',
          width: '25%',
          align: 'center',
        },
        {
          text: 'L0000001816', // 실패 Row 수
          name: 'failCount',
          width: '25%',
          align: 'center',
        },
      ];

      this.gridErrorHeaderOptions = [
        {
          text: 'L0000001815', // 실패 Row 번호
          name: 'failRow',
          width: '20%',
          align: 'center',
        },
        { text: 'L0000001817', name: 'failMessage', width: '35%' }, // 실패 사유
        { text: 'L0000001360', name: 'remark', width: '35%' }, // 비고
      ];

      this.attachFileGrp.plantCd = this.popupParam.plantCd;
      this.attachFileGrp.workAreaGradeCd = this.popupParam.workAreaGradeCd;
    },
    getList(data) {
      this.$http.url = this.searchExcelUrl;
      this.$http.type = 'GET';
      this.$http.param = data;
      this.$http.request(_result => {
        this.isUploadSubmit = false;
        this.gridUploadData = _result.data['uploadResult'];
        this.gridErrorData = _result.data['errorInfo'];

        let alertMessage =
          '업로드 및 저장결과, 오류정보를 확인하시기 바랍니다.';

        if (_result.data.message) {
          alertMessage = _result.data.message;
        }

        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          // message: '업로드 및 저장결과, 오류정보를 확인하시기 바랍니다.',
          message: alertMessage,
          type: 'info',
        });
      });
    },
    /** /초기화 관련 함수 **/

    /** Call API service
     * Naming Rule: get, post, put 등의 RESTFul verb를 접두사로 사용하고 그 뒤에 관련 모델명을 Camel case로 추가하세요.
     * Naming Rule: get의 경우 복수의 데이터조회(리스트 데이터 등)시에는 복수를 나타내는 접미사 "s"를 붙여주세요.
     * ex) getExamData () {}
     * ex) getExamDatas () {}
     */
    closePopup(data) {
      // if (data !== 'CLOSE') data = this.attachFileGrp;
      // this.$emit('closePopup', data);
      this.$emit('closePopup');
    },
    /** /Call API service **/

    /** validation checking(필요없으면 지워주세요) **/
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },

    /** /validation checking **/

    /** Component Events, Callbacks (버튼 제외) **/

    /** /Component, Callbacks (버튼 제외) **/

    /** Button Event **/
    /**
     * 저장 버튼 처리용 샘플함수
     */
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isUploadSubmit = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016'
      );
    },
    /** /Button Event **/

    /** 기타 function **/

    /** /기타 function **/
  },
};
</script>
