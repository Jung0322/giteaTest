<!--
  목적 : 위험성평가 결과 엑셀업로드
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 엑셀업로드 -->
            <y-label
              label="L0000001969"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
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
          />
        </b-col>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            <!-- 저장 -->
            <y-btn
              v-if="editable"
              title="L0000002474"
              color="orange"
              @btnClicked="btnSave"
            />
          </div>
          <!-- 업로드 내용 -->
          <y-data-table
            ref="dataTable"
            label="L0000005885"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :print="true"
            :useRownum="true"
            :messageCheck="true"
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
  name: 'impr-act-upload', // 반드시 입력하세요(안 하면 warning 발생). 네이밍 룰은 현재 vue component의 파일명의 단어를 "-"로 구분(예:exam-data)하여 입력하시면 됩니다. 입력후 이 주석은 지워주세요.
  props: {
    popupParam: {
      title: '',
      imprClassCd: '',
      refTableId: 0,
      plantCd: '',
      actRqstYn: '',
    },
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
      searchParam: {
        plantCd: null,
        imprClassCd: '',
      },
      // 첨부파일 그룹
      attachFileGrp: {
        label: '파일업로드',
        taskClassNm: 'SAF_RESULT_UPLOAD',
        taskKey: '',
        createUserId: '',
        showUploadBtn: true,
        drag: true,
        // uploadFile: this.uploadFile,
      },
      baseWidth: 9,
      editable: true,
      isUploadSubmit: false,

      gridUploadData: [],
      gridUploadHeaderOptions: [],
      gridOptions: {
        header: [],
        data: [],
        height: 200,
      },
      comboImprClassItems: [],
      comboItems: [],

      searchExcelUrl: '',
      resultList: [],

      refresh: false,
      disabled: false,
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
    this.init();
  },
  mounted() {},
  beforeDestory() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchExcelUrl = selectConfig.rsa.planmgmt2.getExcelUpload.url;

      this.searchParam.imprClassCd = this.popupParam.imprClassCd;
      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.popupParam.plantCd;
      } else {
        this.searchParam.plantCd = this.$store.getters.plantCd;
      }

      // TODO : 여기에 초기 설정용 함수를 호출하거나 로직을 입력하세요.

      setTimeout(() => {
        var nowDate = new Date();
        this.attachFileGrp.taskKey = nowDate.getTime().toString();
        this.attachFileGrp.createUserId = this.$store.getters.token;
      }, 200);

      // 그리드 헤더 설정
      this.gridUploadHeaderOptions = [
        // 전체 Row 수
        {
          text: 'L0000002520',
          name: 'totalCount',
          width: '25%',
          align: 'center',
        },
        // 성공 Row 수
        {
          text: 'L0000001629',
          name: 'successCount',
          width: '25%',
          align: 'center',
        },
        // 실패 Row 수
        {
          text: 'L0000001816',
          name: 'failCount',
          width: '25%',
          align: 'center',
        },
      ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 작업단계(분석)
        {
          text: 'L0000005869',
          name: 'jobStep',
          width: '130px',
          align: 'center',
        },
        {
          // 유해위험요인
          text: 'L0000002179',
          name: 'classificationNm',
          width: '130px',
          align: 'center',
          child: [
            // 원인 및 결과
            {
              text: 'L0000005870',
              name: 'causeEffect',
              width: '120px',

              align: 'center',
            },
            // 발생형태
            {
              text: 'L0000001082',
              name: 'riskType',
              width: '120px',
              align: 'center',
            },
          ],
        },
        {
          // 현재안전조치
          text: 'L0000003556',
          name: 'preventMeasure',
          width: '130px',
          align: 'center',
        },
        {
          // 위험도
          text: 'L0000002121',
          name: 'classificationNm',
          width: '130px',
          align: 'center',
          child: [
            {
              text: 'L0000001378',
              name: 'frequency',
              width: '120px',
              align: 'center',
            }, // 빈도
            {
              text: 'L0000000248',
              name: 'strong',
              width: '120px',
              align: 'center',
            }, // 강도
            {
              text: 'L0000002121',
              name: 'risk',
              width: '120px',
              align: 'center',
            }, // 위험도
          ],
        },

        {
          // 실패사유
          text: 'L0000004567',
          name: 'failMessage',
          width: '400px',
          align: 'left',
        },
      ];
    },
    getList(data) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: '엑셀파일 업로드를 진행하시겠습니까?', // 엑셀파일 업로드를 진행하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.searchExcelUrl;
          this.$http.type = 'GET';
          this.$http.param = data;
          this.$http.request(
            (_result) => {
              let result = this.$_.clone(_result.data);
              if (result.success) {
                this.resultList = this.$_.clone(_result.data.excelDataList);

                // 위험도 자동 계산
                this.$_.forEach(_result.data['excelData'], (item) => {
                  item.risk = item.frequency * item.strong;
                });

                this.isUploadSubmit = false;
                this.gridUploadData = _result.data['uploadResult'];
                this.gridOptions.data = _result.data['excelData'];
                this.gridOptions.height = 300;

                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // 안내
                  message: '업로드 내용을 확인하시기 바랍니다.', // 업로드 내용을 확인하시기 바랍니다.
                  type: 'info',
                });
                this.refresh = true;
              } else {
                if (_result.data.message) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: _result.data.message,
                    type: 'warning',
                  });
                }
              }
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR');
            }
          );
        },
        cancelCallback: () => {},
      });
    },
    closePopup() {
      if (this.gridOptions.data) {
        this.$_.forEach(this.gridOptions.data, (item, index) => {
          if (item.failMessage) {
            this.gridOptions.data.splice(index, 1);
          }
        });
      }

      this.$emit('closePopup', this.gridOptions.data);
    },
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    btnClickedErrorCallback(_result) {
      this.isUploadSubmit = false; // 반드시 isSubmit을 false로 초기화 하세요. 그렇지 않으면 버튼을 다시 클릭해도 동작하지 않습니다.
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'L0000005408'
        // 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
    },
    // 업로드 내용 저장
    btnSave() {
      if (!this.gridOptions.data || this.gridOptions.data.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: '저장할 항목이 없습니다.', // 저장할 항목이 없습니다.
          type: 'warning',
        });
        return;
      }

      let validCnt = 0;
      this.$_.forEach(this.gridOptions.data, (data) => {
        if (data.failMessage) {
          validCnt++;
        }
      });

      if (validCnt > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: '실패한 항목이 있습니다. 저장 하시겠습니까?(실패한 항목은 저장되지 않습니다.)', // 실패한 항목이 있습니다. 저장 하시겠습니까?(실패한 항목은 저장되지 않습니다.)
          type: 'info',
          confirmCallback: () => {
            this.saveData();
          },
          cancelCallback: () => {},
        });
      } else {
        this.saveData();
      }
    },
    saveData() {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'info',
      });
      this.closePopup();
    },
  },
};
</script>
