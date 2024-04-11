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
                <!-- 계획수립대상(개소) -->
                <y-number
                  :width="8"
                  :editable="parentEditable"
                  :disabled="parentDisabled"
                  ui="bootstrap"
                  label="L0000005259"
                  name="planTargetVal"
                  v-model="majDisaInsp.majDisaInspRaw.planTargetVal"
                  :maxlength="8"
                  :showMaxLength="false"
                  :required="true"
                  v-validate="'required'"
                  :state="validateState('planTargetVal')"
                ></y-number>
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 계획수립(개소) -->
                <y-number
                  :width="8"
                  :editable="parentEditable"
                  :disabled="parentDisabled"
                  ui="bootstrap"
                  label="L0000005260"
                  name="planVal"
                  v-model="majDisaInsp.majDisaInspRaw.planVal"
                  :maxlength="8"
                  :showMaxLength="false"
                  :required="true"
                  v-validate="'required'"
                  :state="validateState('planVal')"
                ></y-number>
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 계획수립율(%) -->
                <y-number
                  :width="8"
                  :disabled="true"
                  ui="bootstrap"
                  label="L0000005261"
                  name="planRate"
                  v-model="majDisaInsp.majDisaInspRaw.planRate"
                  :maxlength="3"
                  :showMaxLength="false"
                  :required="true"
                  :pointNumber="2"
                  v-validate="'required'"
                  :state="validateState('planRate')"
                ></y-number>
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 점검실시(개소) -->
                <y-number
                  :width="8"
                  :editable="parentEditable"
                  :disabled="parentDisabled"
                  ui="bootstrap"
                  label="L0000005283"
                  name="chkVal"
                  v-model="majDisaInsp.majDisaInspRaw.chkVal"
                  :maxlength="8"
                  :showMaxLength="false"
                  :required="true"
                  v-validate="'required'"
                  :state="validateState('chkVal')"
                ></y-number>
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 점검실시율(%) -->
                <y-number
                  :width="8"
                  :disabled="true"
                  ui="bootstrap"
                  label="L0000005284"
                  name="chkRate"
                  v-model="majDisaInsp.majDisaInspRaw.chkRate"
                  :maxlength="3"
                  :showMaxLength="false"
                  :required="true"
                  :pointNumber="2"
                  v-validate="'required'"
                  :state="validateState('chkRate')"
                ></y-number>
              </b-col>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-col sm="12">
                <y-file-upload
                  ref="fileuploadBefore"
                  :editable="parentEditable && !parentDisabled"
                  :disabled="parentDisabled"
                  :attach-file-grp="attachFileRawGrps"
                  :label="attachFileRawGrps.label"
                  :showUploadBtn="attachFileRawGrps.showUploadBtn"
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
                  v-model="majDisaInsp.majDisaInspRaw.rawDesc"
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
        majDisaInspRaw: {
          majDisaInspRawNo: 0, // 중대시민재해점검 법정점검계획번호
          majDisaInspNo: 0, // 중대시민재해점검번호
          planTargetVal: 0, // 계획수립대상(개소)
          planVal: 0, // 계획수립(개소)
          planRate: 0, // 계획수립율(%)
          chkVal: 0, // 점검실시(개소)
          chkRate: 0, // 점검실시율(%)
          rawDesc: '',
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
          majDisaInspRawNo: 0,
        };
      },
    },
  },
  data: () => ({
    gridOptions: {
      header: [],
      data: [],
      height: '450',
    },

    attachFileRawGrps: {
      taskClassNm: 'INSP_MGMT_PLAN_RAW',
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
    'majDisaInsp.majDisaInspRaw.planVal': function(newVal, oldVal) {
      if (
        this.majDisaInsp.majDisaInspRaw.planVal &&
        this.majDisaInsp.majDisaInspRaw.planTargetVal
      ) {
        this.majDisaInsp.majDisaInspRaw.planRate =
          (this.majDisaInsp.majDisaInspRaw.planVal /
            this.majDisaInsp.majDisaInspRaw.planTargetVal) *
          100;
      } else {
        this.majDisaInsp.majDisaInspRaw.planRate = 0;
      }
    },
    'majDisaInsp.majDisaInspRaw.planTargetVal': function(newVal, oldVal) {
      if (
        this.majDisaInsp.majDisaInspRaw.planVal &&
        this.majDisaInsp.majDisaInspRaw.planTargetVal
      ) {
        this.majDisaInsp.majDisaInspRaw.planRate =
          (this.majDisaInsp.majDisaInspRaw.planVal /
            this.majDisaInsp.majDisaInspRaw.planTargetVal) *
          100;
      } else {
        this.majDisaInsp.majDisaInspRaw.planRate = 0;
      }
    },
    'majDisaInsp.majDisaInspRaw.chkVal': function(newVal, oldVal) {
      if (
        this.majDisaInsp.majDisaInspRaw.planVal &&
        this.majDisaInsp.majDisaInspRaw.chkVal
      ) {
        this.majDisaInsp.majDisaInspRaw.chkRate =
          (this.majDisaInsp.majDisaInspRaw.chkVal /
            this.majDisaInsp.majDisaInspRaw.planVal) *
          100;
      } else {
        this.majDisaInsp.majDisaInspRaw.chkRate = 0;
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

      this.attachFileRawGrps.uploadTempFiles = inputData;
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
        this.$_.forEach(this.attachFileRawGrps, item => {
          item.taskKey = this.majDisaInsp.majDisaInspRaw.majDisaInspRawNo;
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
      this.attachFileRawGrps.taskKey = this.majDisaInsp.majDisaInspRaw
        .majDisaInspRawNo
        ? this.majDisaInsp.majDisaInspRaw.majDisaInspRawNo
        : this.safeFlag.majDisaInspRawNo;
      // 저장할 데이터가 있는 경우
      this.$refs['fileuploadBefore'].submitUpload();
    },
    setAttachFileGrps() {
      this.attachFileRawGrps.taskKey = !this.majDisaInsp.majDisaInspRaw
        .majDisaInspRawNo
        ? ''
        : this.majDisaInsp.majDisaInspRaw.majDisaInspRawNo;
    },
  },
};
</script>
