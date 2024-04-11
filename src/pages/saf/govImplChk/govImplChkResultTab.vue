<!--
  목적 : 점검>정부지자체 시정조치 이행점검 관리 관리>점검결과 관리>점검결과 상세 팝업
  Detail : 점검결과 상세 팝업화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <b-card>
            <b-row>
              <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-4">
                <!-- 개선도출건수 -->
                <y-number
                  :width="8"
                  :editable="editable && parentEditable"
                  :disabled="parentDisabled"
                  :maxlength="10"
                  label="L0000004991"
                  name="imprCaseCnt"
                  v-model="govImplChkPlan.govImplChkRslt.imprCaseCnt"
                ></y-number>
              </b-col>
              <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-4">
                <!-- 점검완료일 -->
                <y-datepicker
                  :width="8"
                  :editable="editable && parentEditable"
                  :disabled="parentDisabled"
                  :required="true"
                  label="L0000002569"
                  name="chkDt"
                  :default="govImplChkPlan.govImplChkRslt.chkDt"
                  v-model="govImplChkPlan.govImplChkRslt.chkDt"
                  v-validate="'required'"
                  :state="validateState('chkDt')"
                ></y-datepicker>
              </b-col>
              <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-4"></b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 점검결과요약 -->
                <y-textarea
                  :width="10"
                  ui="bootstrap"
                  :editable="editable && parentEditable"
                  :disabled="parentDisabled"
                  :rows="5"
                  :maxlength="1000"
                  label="L0000002538"
                  name="rsltDesc"
                  v-model="govImplChkPlan.govImplChkRslt.rsltDesc"
                />
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <file-upload
                  :attachFileGrps="rsltAttachFileGrps"
                  :saveAttachFiles="rsltSaveAttachFiles"
                  :tempDeleteFiles="rsltTempDeleteFiles"
                  :submitObject="rsltSubmitObject"
                  @changeUploadFiles="changeUploadFiles"
                  @setTempDeleteFiles="setTempDeleteFiles"
                ></file-upload>
              </b-col>
              <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                <file-upload
                  :attachFileGrps="refAttachFileGrps"
                  :saveAttachFiles="refSaveAttachFiles"
                  :tempDeleteFiles="refTempDeleteFiles"
                  :submitObject="refSubmitObject"
                  @changeUploadFiles="changeUploadFiles"
                  @setTempDeleteFiles="setTempDeleteFiles"
                ></file-upload>
              </b-col> -->
            </b-row>
          </b-card>
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import fileUpload from '@/pages/common/attachFile/multiFileUpload';
export default {
  /** attributes: name, components, props, data **/
  name: 'gov-impl-chk-result-tab',
  components: {
    fileUpload,
  },
  props: {
    govImplChkPlan: {
      implChkPlanNo: 0, // 정부지자체 시정조치 이행점검번호
      plantCd: null, // 사업장
      year: null, // 대상년도
      regRegdem: null, // 구분(정기/수시) RSA_REG_REGDEM
      chkStartDt: null, // 점검(계획)시작일
      chkEndDt: null, // 점검(계획)종료일
      chkPeriod: [], // 점검기간
      mainDeptCd: null, // 주관부서
      targetDeptCd: null, // 대상부서
      chkNm: null, // 점검명
      chkDesc: null, // 상세내용
      procStepCd: null, // 단계(COM_STEP)
      stateCd: null, // 상태(COM_STATE)
      stepCd: null, // 결재상태(COM_BIZ_APPR_STEP)
      apprRqstNo: 0, // 결재요청번호
      refGovNm: null, // 관련 정부지자체
      deptReaderId: null, // 평가리더ID
      deptReaderNm: null, // 평가리더
      readerDeptCd: null, // 평가리더 부서코드
      readerDeptNm: null, // 평가리더 부서
      createUserId: null, // 등록자ID
      createDt: null, // 등록일시
      updateUserId: null, // 수정자ID
      updateDt: null, // 수정일시
      createDeptNm: null, // 등록자부서명
      createDeptCd: null, // 등록자부서코드
      updateDeptNm: null, // 수정자부서명
      updateDeptCd: null, // 수정자부서코드
      createPositionNm: null, // 등록자직위명
      createPositionCd: null, // 등록자직위코드
      updatePositionNm: null, // 수정자직위명
      updatePositionCd: null, // 수정자직위코드
      govImplChkInRaters: [], // 내부 점검자 목록
      govImplChkExRaters: [], // 외부 점검자 목록
      govImplChkRslt: {
        implChkRsltNo: 0, // 정부지자체 시정조치 이행점검 결과번호
        implChkPlanNo: 0, // 정부지자체 시정조치 이행점검번호
        imprCaseCnt: 0, // 개선도출건수
        chkDt: null, // 점검 완료일
        rsltDesc: null, // 점검결과 요약
      },
    },
    attachFileGrps: {
      type: Array,
      default: [],
    }, // 첨부파일 그룹 목록
    parentEditable: {
      type: Boolean,
      default: false,
    },
    parentDisabled: {
      type: Boolean,
      default: false,
    },
    refreshObject: {
      refresh: false,
    },
  },
  data() {
    return {
      editable: false, // 수정 가능 여부
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      disabled: false,
      rsltAttachFileGrps: [], // 점검결과자료 첨부파일 그룹
      refAttachFileGrps: [], // 참고자료 첨부파일 그룹
      rsltSaveAttachFiles: [],
      rsltTempDeleteFiles: [],
      rsltSubmitObject: {
        submitCheck: false,
      },
      refSaveAttachFiles: [],
      refTempDeleteFiles: [],
      refSubmitObject: {
        submitCheck: false,
        taskKey: '',
      },
    };
  },
  computed: {},
  watch: {
    'refreshObject.refresh': {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.saveAttach();
        }
      },
    },
    // attachFileGrps: {
    //   handler: function (newVal, oldVal) {
    //     this.setAttachFileGrps();
    //   },
    //   deep: true,
    // },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {
      setTimeout(() => {
        this.editable = this.$route.meta.editable;

        this.setAttachFileGrps();
      }, 300);
    
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
    setAttachFileGrps() {
      this.rsltAttachFileGrps = this.attachFileGrps.filter(
        (grp) => grp.taskClassNm === 'GOV_IMPL_CHK_RESULT'
      );

      this.rsltAttachFileGrps[0].editable =
        this.editable && this.parentEditable && !this.parentDisabled;
      this.rsltAttachFileGrps[0].drag =
        this.editable && this.parentEditable && !this.parentDisabled;
      this.rsltAttachFileGrps[0].disabled =
        !this.editable || !this.parentEditable || this.parentDisabled;

      this.refAttachFileGrps = this.attachFileGrps.filter(
        (grp) => grp.taskClassNm === 'GOV_IMPL_CHK_RESULT_REF'
      );

      this.refAttachFileGrps[0].editable =
        this.editable && this.parentEditable && !this.parentDisabled;
      this.refAttachFileGrps[0].drag =
        this.editable && this.parentEditable && !this.parentDisabled;
      this.refAttachFileGrps[0].disabled =
        !this.editable || !this.parentEditable || this.parentDisabled;
    },
    changeUploadFiles(data) {
      if (data.taskClassNm === 'GOV_IMPL_CHK_RESULT') {
        // 점검결과자료 첨부파일
        let index = this.$_.findIndex(this.rsltAttachFileGrps, {
          taskClassNm: data.taskClassNm,
        });
        if (index > -1) {
          data.index = index;
          this.rsltAttachFileGrps[index].uploadTempFiles = data;
          let saveIndex = this.$_.findIndex(this.rsltSaveAttachFiles, {
            taskClassNm: data.taskClassNm,
          });
          if (saveIndex > -1) {
            this.rsltSaveAttachFiles[saveIndex] = this.$_.clone(
              this.rsltAttachFileGrps[index]
            );
          } else {
            this.rsltSaveAttachFiles.push(
              this.$_.clone(this.rsltAttachFileGrps[index])
            );
          }
        }
      } else {
        // 참고자료 첨부파일
        let index = this.$_.findIndex(this.refAttachFileGrps, {
          taskClassNm: data.taskClassNm,
        });
        if (index > -1) {
          data.index = index;
          this.refAttachFileGrps[index].uploadTempFiles = data;
          let saveIndex = this.$_.findIndex(this.refSaveAttachFiles, {
            taskClassNm: data.taskClassNm,
          });
          if (saveIndex > -1) {
            this.refSaveAttachFiles[saveIndex] = this.$_.clone(
              this.refAttachFileGrps[index]
            );
          } else {
            this.refSaveAttachFiles.push(
              this.$_.clone(this.refAttachFileGrps[index])
            );
          }
        }
      }
    },
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };

      if (data.taskClassNm === 'GOV_IMPL_CHK_RESULT') {
        // 점검결과자료 첨부파일
        this.rsltTempDeleteFiles.push(pushData);
      } else {
        // 참고자료 첨부파일
        this.refTempDeleteFiles.push(pushData);
      }
    },
    saveAttach() {
      // 점검결과자료 첨부파일 task_key 를 셋팅한다.
      this.$_.forEach(this.rsltAttachFileGrps, (item) => {
        item.taskKey = this.refreshObject.taskKey;
      });

      if (this.rsltTempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.rsltTempDeleteFiles)),
        };
        this.$http.request(
          (_result) => {
            this.rsltTempDeleteFiles = [];
            // 저장할 데이터가 있는 경우
            if (this.rsltSaveAttachFiles.length > 0) {
              this.rsltSubmitObject.submitCheck =
                !this.rsltSubmitObject.submitCheck;
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        // 저장할 데이터가 있는 경우
        if (this.rsltSaveAttachFiles.length > 0) {
          this.rsltSubmitObject.submitCheck =
            !this.rsltSubmitObject.submitCheck;
        }
      }

      // 참고자료 첨부파일 task_key 를 셋팅한다.
      this.$_.forEach(this.refAttachFileGrps, (item) => {
        item.taskKey = this.refreshObject.taskKey;
      });

      if (this.refTempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.refTempDeleteFiles)),
        };
        this.$http.request(
          (_result) => {
            this.refTempDeleteFiles = [];
            // 저장할 데이터가 있는 경우
            if (this.refSaveAttachFiles.length > 0) {
              this.refSubmitObject.submitCheck =
                !this.refSubmitObject.submitCheck;
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        // 저장할 데이터가 있는 경우
        if (this.refSaveAttachFiles.length > 0) {
          this.refSubmitObject.submitCheck = !this.refSubmitObject.submitCheck;
        }
      }
    },

    /** Button Event **/
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    /** /Button Event **/
  },
};
</script>
