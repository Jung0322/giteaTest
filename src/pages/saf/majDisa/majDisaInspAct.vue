<!--
  목적 : 점검 > 중대시민재해점검 관리 > 점검 결과 관리 > 법정 점검 텝
  Detail : 안전 계획 텝
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="editBox">
      <b-col sm="12">
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 우려사항 조치(건수) -->
                <y-number
                  :width="8"
                  :editable="parentEditable"
                  :disabled="parentDisabled"
                  ui="bootstrap"
                  label="L0000005286"
                  name="conActVal"
                  v-model="majDisaInsp.majDisaInspAct.conActVal"
                  :maxlength="8"
                  :showMaxLength="false"
                  :required="true"
                  v-validate="'required'"
                  :state="validateState('conActVal')"
                ></y-number>
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 시민재해 조치(건수) -->
                <y-number
                  :width="8"
                  :editable="parentEditable"
                  :disabled="parentDisabled"
                  ui="bootstrap"
                  label="L0000005287"
                  name="civilDisActVal"
                  v-model="majDisaInsp.majDisaInspAct.civilDisActVal"
                  :maxlength="8"
                  :showMaxLength="false"
                  :required="true"
                  v-validate="'required'"
                  :state="validateState('civilDisActVal')"
                ></y-number>
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 시민재해 개선(건수) -->
                <y-number
                  :width="8"
                  :editable="parentEditable"
                  :disabled="parentDisabled"
                  ui="bootstrap"
                  label="L0000005288"
                  name="civilDisImprVal"
                  v-model="majDisaInsp.majDisaInspAct.civilDisImprVal"
                  :maxlength="8"
                  :showMaxLength="false"
                  :required="true"
                  v-validate="'required'"
                  :state="validateState('civilDisImprVal')"
                ></y-number>
              </b-col>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-col sm="12">
                <y-file-upload
                  ref="fileuploadBefore"
                  :editable="parentEditable && !parentDisabled"
                  :disabled="parentDisabled"
                  :attach-file-grp="attachFileActGrps"
                  :label="attachFileActGrps.label"
                  :showUploadBtn="attachFileActGrps.showUploadBtn"
                  :showFileSearch="false"
                  :multiple="true"
                  :limit="5"
                  :close="true"
                  @uploadFiles="safetyPlanUploadFiles"
                  @setDeleteTempFileData="setDeleteTempFileData"
                  @setUploadFileLength="setUploadFileLength"
                ></y-file-upload>
              </b-col>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mt-3">
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 비고 -->
                <y-textarea
                  :width="10"
                  :editable="parentEditable"
                  :disabled="parentDisabled"
                  :maxlength="1000"
                  ui="bootstrap"
                  label="L0000001360"
                  name="rawDesc"
                  v-model="majDisaInsp.majDisaInspAct.actDesc"
                  v-validate="'required'"
                  :state="validateState('rawDesc')"
                  :rows="3"
                ></y-textarea>
              </b-col>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-facility-mst-detail',
  props: {
    majDisaInsp: {
      type: Object,
      default: () => ({
        majDisaInspNo: 0, // 중대시민재해점검번호
        majDisaInspAct: {
          majDisaInspActNo: 0, // 중대시민재해점검 우려사항조치번호
          majDisaInspNo: 0, // 중대시민재해점검번호
          conActVal: 0, // 우려상황 조치(건수)
          civilDisActVal: 0, // 시민재해 조치(건수)
          civilDisImprVal: 0, // 시민재해 개선(건수)
          actDesc: null, // 비고
        },
      }),
    },
    parentEditable: false,
    parentDisabled: false,
    safeFlag: {
      type: Object,
      default: () => {
        return {
          submitCheck: false,
          majDisaInspActNo: 0,
        };
      },
    },

    editable: false,
  },
  data: () => ({
    gridOptions: {
      header: [],
      data: [],
      height: '450',
    },

    attachFileActGrps: {
      taskClassNm: 'INSP_MGMT_PLAN_ACT',
      taskKey: '',
      createUserId: '',
      showUploadBtn: false,
      uploadCheck: false,
      label: '파일업로드' /* 파일업로드 */,
      uploadTempFiles: null,
    },

    refresh: false,
    saveAttachFiles: [],
    tempDeleteFiles: [],
    countIndex: 0,
    disabled: false,
  }),
  watch: {
    'safeFlag.submitCheck': {
      handler: function(newVal, oldVal) {
        this.setAttach();
      },
    },
    'majDisaInsp.majDisaInspNo': function(newval, oldVal) {
      this.setAttachFileGrps();
    },
    'majDisaInsp.majDisaInspAct.planVal': function(newVal, oldVal) {
      if (
        this.majDisaInsp.majDisaInspAct.planVal &&
        this.majDisaInsp.majDisaInspAct.planTargetVal
      ) {
        this.majDisaInsp.majDisaInspAct.planRate =
          this.majDisaInsp.majDisaInspAct.planVal /
          this.majDisaInsp.majDisaInspAct.planTargetVal;
      } else {
        this.majDisaInsp.majDisaInspAct.planRate = 0;
      }
    },
    'majDisaInsp.majDisaInspAct.planTargetVal': function(newVal, oldVal) {
      if (
        this.majDisaInsp.majDisaInspAct.planVal &&
        this.majDisaInsp.majDisaInspAct.planTargetVal
      ) {
        this.majDisaInsp.majDisaInspAct.planRate =
          this.majDisaInsp.majDisaInspAct.planVal /
          this.majDisaInsp.majDisaInspAct.planTargetVal;
      } else {
        this.majDisaInsp.majDisaInspAct.planRate = 0;
      }
    },
    'majDisaInsp.majDisaInspAct.chkVal': function(newVal, oldVal) {
      if (
        this.majDisaInsp.majDisaInspAct.planVal &&
        this.majDisaInsp.majDisaInspAct.chkVal
      ) {
        this.majDisaInsp.majDisaInspAct.chkRate =
          this.majDisaInsp.majDisaInspAct.chkVal /
          this.majDisaInsp.majDisaInspAct.planVal;
      } else {
        this.majDisaInsp.majDisaInspAct.chkRate = 0;
      }
    },

    setAttachFile() {
      this.setAttachFileGrps();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());

    this.init();
  },
  methods: {
    init() {
      this.setAttachFileGrps();
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    safetyPlanUploadFiles(data, taskClassNm, attachFileGrp) {
      let inputData = {
        data: data,
      };

      this.attachFileActGrps.uploadTempFiles = inputData;
    },
    setDeleteTempFileData(data) {
      var pushData = {
        fileNo: data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
    },
    setUploadFileLength(data) {
      this.countIndex = data;
    },
    uploadedList(data) {
      // task_key 를 셋팅한다.

      if (data && data.length > 0) {
        this.$_.forEach(this.attachFileActGrps, item => {
          item.taskKey = this.majDisaInsp.majDisaInspAct.majDisaInspActNo;
        });
        if (data.length < this.countIndex1 && this.countIndex1 !== 0) {
          this.refresh = !this.refresh;
        } else {
          this.countIndex1 = 0;
        }
      }
    },
    setAttach() {
      // task_key 를 셋팅한다.
      this.attachFileActGrps.taskKey = this.majDisaInsp.majDisaInspAct
        .majDisaInspActNo
        ? this.majDisaInsp.majDisaInspAct.majDisaInspActNo
        : this.safeFlag.majDisaInspActNo;
      // 저장할 데이터가 있는 경우
      this.$refs['fileuploadBefore'].submitUpload();
    },
    setAttachFileGrps() {
      this.attachFileActGrps.taskKey = !this.majDisaInsp.majDisaInspAct
        .majDisaInspActNo
        ? ''
        : this.majDisaInsp.majDisaInspAct.majDisaInspActNo;
    },
  },
};
</script>
