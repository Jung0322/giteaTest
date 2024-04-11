<!--
  목적 : 점검 > 중대시민재해점검 관리 > 점검 결과 관리 > 안전 계획 텝
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
                  v-model="majDisaInsp.majDisaInspSafe.planTargetVal"
                  :required="true"
                  :maxlength="8"
                  :showMaxLength="false"
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
                  v-model="majDisaInsp.majDisaInspSafe.planVal"
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
                  v-model="majDisaInsp.majDisaInspSafe.planRate"
                  :maxlength="3"
                  :required="true"
                  :pointNumber="2"
                  v-validate="'required'"
                  :state="validateState('planRate')"
                ></y-number>
              </b-col>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-col sm="12">
                <y-file-upload
                  ref="fileuploadBefore"
                  :editable="parentEditable && !parentDisabled"
                  :disabled="parentDisabled"
                  :attach-file-grp="attachFileGrps"
                  :label="attachFileGrps.label"
                  :showUploadBtn="attachFileGrps.showUploadBtn"
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
                  name="safeDesc"
                  v-model="majDisaInsp.majDisaInspSafe.safeDesc"
                  v-validate="'required'"
                  :state="validateState('safeDesc')"
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
      default: () => {
        return {
          majDisaInspNo: 0, // 중대시민재해점검번호
          testFlag: false,
          majDisaInspSafe: {
            majDisaInspSafeNo: 0, // 중대시민재해점검 안전계획번호
            majDisaInspNo: 0, // 중대시민재해점검번호
            planTargetVal: 0, // 계획수립대상(개소)
            planVal: 0, // 계획수립(개소)
            planRate: 0, // 계획수립율(%)
            safeDesc: null, // 비고
          },
        };
      },
    },
    parentEditable: false,
    parentDisabled: false,
    safeFlag: {
      type: Object,
      default: () => {
        return {
          submitCheck: false,
          majDisaInspSafeNo: 0,
        };
      },
    },

    attachFileGrps: {},
  },
  data: () => ({
    gridOptions: {
      header: [],
      data: [],
      height: '450',
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
    'majDisaInsp.majDisaInspSafe.planVal': function(newVal, oldVal) {
      if (
        this.majDisaInsp.majDisaInspSafe.planVal &&
        this.majDisaInsp.majDisaInspSafe.planTargetVal &&
        this.majDisaInsp.majDisaInspSafe.planTargetVal > 0
      ) {
        this.majDisaInsp.majDisaInspSafe.planRate =
          (this.majDisaInsp.majDisaInspSafe.planVal /
            this.majDisaInsp.majDisaInspSafe.planTargetVal) *
          100;
      } else {
        this.majDisaInsp.majDisaInspSafe.planRate = 0;
      }
    },
    'majDisaInsp.majDisaInspSafe.planTargetVal': function(newVal, oldVal) {
      if (
        this.majDisaInsp.majDisaInspSafe.planVal &&
        this.majDisaInsp.majDisaInspSafe.planTargetVal &&
        this.majDisaInsp.majDisaInspSafe.planTargetVal > 0
      ) {
        this.majDisaInsp.majDisaInspSafe.planRate =
          (this.majDisaInsp.majDisaInspSafe.planVal /
            this.majDisaInsp.majDisaInspSafe.planTargetVal) *
          100;
      } else {
        this.majDisaInsp.majDisaInspSafe.planRate = 0;
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
    init() {},
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

      this.attachFileGrps.uploadTempFiles = inputData;
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
        this.$_.forEach(this.attachFileGrps, item => {
          item.taskKey = this.majDisaInsp.majDisaInspSafe.majDisaInspSafeNo;
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
      this.attachFileGrps.taskKey = this.majDisaInsp.majDisaInspSafe
        .majDisaInspSafeNo
        ? this.majDisaInsp.majDisaInspSafe.majDisaInspSafeNo
        : this.safeFlag.majDisaInspSafeNo;
      // 저장할 데이터가 있는 경우

      this.$refs['fileuploadBefore'].submitUpload();
    },
    setAttachFileGrps() {
      this.attachFileGrps.taskKey = !this.majDisaInsp.majDisaInspSafe
        .majDisaInspSafeNo
        ? ''
        : this.majDisaInsp.majDisaInspSafe.majDisaInspSafeNo;
    },
  },
};
</script>
