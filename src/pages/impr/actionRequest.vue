<!--
  목적 : 조치요청
  Detail : 개선사항 조치 요청 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!--  조치요청 상세 정보 -->
            <y-label
              label="L0000002688"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="insertCheck && editable"
                :action-url="insertUrl"
                :param="imprAct"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="!insertCheck && editable"
                :action-url="editUrl"
                :param="imprAct"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="!insertCheck && editable"
                :action-url="deleteUrl"
                :param="deleteValue"
                :is-submit="isDelete"
                title="L0000001495"
                color="red"
                action-type="DELETE"
                beforeSubmit="beforeDelete"
                @beforeDelete="beforeDelete"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <b-row>
                <b-col sm="2">
                  <!-- 진행 단계 -->
                  <y-label label="L0000002775" />
                </b-col>
                <b-col v-if="imprAct.imprStepCd === 'IMST1'">
                  <!-- 요청등록 ▷ 접수 ▷ 조치부서 조치 ▷ 개선완료 -->
                  <b>
                    <font color="blue">{{
                      $comm.getLangSpecInfoLabel('L0000002052')
                    }}</font
                    >&nbsp;&nbsp;▷&nbsp;&nbsp;{{
                      $comm.getLangSpecInfoLabel('L0000002590')
                    }}&nbsp;&nbsp;▷&nbsp;&nbsp;{{
                      $comm.getLangSpecInfoLabel('L0000002674')
                    }}
                    &nbsp;&nbsp;▷&nbsp;&nbsp;
                    {{ $comm.getLangSpecInfoLabel('L0000000262') }}
                  </b>
                </b-col>
                <b-col v-if="imprAct.imprStepCd === 'IMST2'">
                  <b>
                    {{
                      $comm.getLangSpecInfoLabel('L0000002052')
                    }}&nbsp;&nbsp;▷&nbsp;&nbsp;
                    <font color="blue">{{
                      $comm.getLangSpecInfoLabel('L0000002590')
                    }}</font
                    >&nbsp;&nbsp;▷&nbsp;&nbsp;{{
                      $comm.getLangSpecInfoLabel('L0000002674')
                    }}&nbsp;&nbsp;▷&nbsp;&nbsp;{{
                      $comm.getLangSpecInfoLabel('L0000000262')
                    }}
                  </b>
                </b-col>
                <b-col v-if="imprAct.imprStepCd === 'IMST3'">
                  <b>
                    {{
                      $comm.getLangSpecInfoLabel('L0000002052')
                    }}&nbsp;&nbsp;▷&nbsp;&nbsp;{{
                      $comm.getLangSpecInfoLabel('L0000002590')
                    }}&nbsp;&nbsp;▷&nbsp;&nbsp;
                    <font color="blue">{{
                      $comm.getLangSpecInfoLabel('L0000002674')
                    }}</font>
                    &nbsp;
                    <!-- 조치협력업체 완료 -->
                    <el-tag
                      v-if="imprAct.actVendorConfirmYn === 'Y' && showStepInfo"
                      size="mini"
                    >
                      <i class="el-icon-success"></i>
                      {{ $comm.getLangSpecInfoLabel('L0000002697') }}
                    </el-tag>
                    <el-tag
                      v-else-if="
                        imprAct.actVendorConfirmYn !== 'Y' && showStepInfo
                      "
                      size="mini"
                      type="danger"
                    >
                      <!-- 조치협력업체 미완료 -->
                      <i class="el-icon-warning"></i
                      >{{ $comm.getLangSpecInfoLabel('L0000002696') }} </el-tag
                    >&nbsp;▷&nbsp;&nbsp;
                    <!-- 개선완료 -->
                    {{ $comm.getLangSpecInfoLabel('L0000000262') }}
                  </b>
                </b-col>
                <b-col v-if="imprAct.imprStepCd === 'IMST5'">
                  <b>
                    {{
                      $comm.getLangSpecInfoLabel('L0000002052')
                    }}&nbsp;&nbsp;▷&nbsp;&nbsp;{{
                      $comm.getLangSpecInfoLabel('L0000002590')
                    }}&nbsp;&nbsp;▷&nbsp;&nbsp;{{
                      $comm.getLangSpecInfoLabel('L0000002674')
                    }}&nbsp;&nbsp;▷&nbsp;&nbsp;
                    <font color="blue">{{
                      $comm.getLangSpecInfoLabel('L0000000262')
                    }}</font>
                  </b>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 업무구분 -->
              <y-select
                :width="8"
                :disabled="true"
                :editable="editable"
                :comboItems="comboImprClassItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001947"
                name="imprClassCd"
                v-model="imprAct.imprClassCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="3">
                  <!-- 작성일/작성자 -->
                  <y-label label="L0000002353" />
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :editable="editable"
                    :disabled="true"
                    ui="bootstrap"
                    name="imprRqstYmd"
                    v-model="imprAct.imprRqstYmd"
                  ></y-text>
                </b-col>
                <b-col sm="5">
                  <y-text
                    :width="12"
                    :editable="editable"
                    :disabled="true"
                    ui="bootstrap"
                    name="imprRqstUserInfo"
                    v-model="imprRqstUserInfo"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                name="plantCd"
                label="L0000005369"
                v-model="imprAct.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <!-- 조치구분 -->
            <b-col
              v-if="popupParam.actClassYn"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <y-text
                :editable="editable"
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000002668"
                name="actClassNm"
                v-model="imprAct.actClassNm"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 개선요청명 -->
              <y-text
                :width="10"
                :editable="editable"
                :maxlength="50"
                :required="true"
                ui="bootstrap"
                label="L0000005370"
                name="imprTitle"
                v-model="imprAct.imprTitle"
                v-validate="'required'"
                :state="validateState('imprTitle')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 조치 요청내용 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="150"
                :required="true"
                label="L0000002665"
                ui="bootstrap"
                name="imprRqstContents"
                v-model="imprAct.imprRqstContents"
                v-validate="'required'"
                :state="validateState('imprRqstContents')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 조치부서 -->
              <y-tree-dept
                :required="true"
                :editable="editable"
                :plantCd="imprAct.plantCd"
                :showAllDept="true"
                label="L0000002673"
                name="actDeptCd"
                v-model="imprAct.actDeptCd"
                v-validate="'required'"
                :state="validateState('actDeptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 조치기한 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :required="true"
                label="L0000002670"
                type="today"
                name="actLimitYmd"
                default="imprAct.actLimitYmd"
                v-model="imprAct.actLimitYmd"
                v-validate="'required'"
                :state="validateState('actLimitYmd')"
              ></y-datepicker>
            </b-col>
            <b-col
              v-if="popupParam.imprClassCd === 'ICL03'"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
              <!-- 공정 -->
              <y-tree-process
                label="L0000000515"
                :editable="editable"
                name="processCd"
                :plantCd="imprAct.plantCd"
                :deptCd="imprAct.actDeptCd"
                v-model="imprAct.processCd"
              ></y-tree-process>
            </b-col>
            <b-col
              v-if="popupParam.imprClassCd === 'ICL03'"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
              <!-- 세부위치 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000001641"
                name="dtlLocat"
                v-model="imprAct.dtlLocat"
              ></y-text>
            </b-col>
            <el-divider
              v-if="popupParam.imprClassCd === 'ICL02'"
              content-position="left"
              >{{ this.$comm.getLangSpecInfoLabel('L0000000273') }}</el-divider
            >
            <!-- 개선전 -->
            <b-col
              v-if="popupParam.imprClassCd === 'ICL02'"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12"
            >
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 빈도/강도/위험도 -->
                  <y-number
                    :width="6"
                    :maxlength="1"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000001380"
                    name="befFreq"
                    v-model="imprAct.befFreq"
                  ></y-number>
                </b-col>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <y-number
                    :width="12"
                    :maxlength="1"
                    :editable="editable"
                    ui="bootstrap"
                    name="befInten"
                    v-model="imprAct.befInten"
                  ></y-number>
                </b-col>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <y-number
                    :width="12"
                    :maxlength="2"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="befDegRisk"
                    v-model="imprAct.befDegRisk"
                  ></y-number>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
        <b-row class="mt-3">
          <b-col sm="12">
            <!-- 첨부파일 -->
            <y-label
              label="L0000002843"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" class="px-0">
              <y-file-upload
                ref="fileupload"
                :attach-file-grp="attachFileGrp"
                :label="attachFileGrp.label"
                :showUploadBtn="attachFileGrp.showUploadBtn"
                :drag="attachFileGrp.drag"
                :showFileSearch="false"
                :editable="editable"
                :multiple="true"
                :limit="5"
                :close="true"
                :onlyDownload="false"
                :uploadTempFiles="attachFileGrp.uploadTempFiles"
                @uploadFiles="safetyPlanUploadFiles"
              ></y-file-upload>
            </b-col>
          </b-row>
        </b-card>
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
  name: 'action-request',
  props: {
    popupParam: {
      type: Object,
      default: {
        safImprActNo: 0,
        refTableId: 0,
        imprClassCd: null,
        taskClassNm: '',
        actClassYn: false,
        editMode: false,
      },
    },
  },
  data() {
    return {
      editable: true,
      imprAct: {
        safImprActNo: '',
        plantCd: '',
        imprClassCd: '',
        actClassCd: '',
        imprRqstYmd: '',
        imprTitle: '',
        imprRqstDeptCd: '',
        imprRqstDeptNm: '',
        imprRqstUserId: '',
        imprRqstUserNm: '',
        imprRqstContents: '',
        imprStepCd: '',
        refTable: '',
        refTableId: '',
        actSchYmd: '',
        actConfirmYmd: '',
        actLimitYmd: '',
        actDeptCd: null,
        actDeptNm: '',
        actUserId: '',
        actUserNm: '',
        actResultContents: '',
        actResultReview: '',
        createUserId: '',
        createDt: '',
        updateUserId: '',
        updateDt: '',
        befFreq: 0,
        befInten: 0,
        befDegRisk: 0,
        dtlLocat: '',
        processCd: '',
      },
      attachFileGrp: {
        taskClassNm: 'ACCTION',
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
        drag: true,
        label: 'L0000003030' /* 파일업로드 */,
        uploadTempFiles: null,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      searchUrl: '',
      insertUrl: '',
      editUrl: '',
      deleteUrl: '',
      isInsert: false,
      isEdit: false,
      isDelete: false,
      insertCheck: true,
      imprRqstUserInfo: '',
      immediateBeforeImage: '',
      immediateAfterImage: '',
      comboImprClassItems: [],
      deleteValue: null,
    };
  },
  watch: {
    // 'imprAct.subconnRqstYn'() {
    //   if (this.isFirst) {
    //     this.isFirst = false;
    //     return;
    //   }
    //   this.imprAct.actDeptCd = '';
    // },
    'imprAct.befFreq'() {
      if (!this.imprAct.befFreq) {
        // this.imprAct.befFreq = 0;
        // this.imprAct.befDegRisk = 0;
      } else {
        this.imprAct.befDegRisk = this.imprAct.befFreq * this.imprAct.befInten;
      }
    },
    'imprAct.befInten'() {
      if (!this.imprAct.befInten) {
        // this.imprAct.befInten = 0;
        // this.imprAct.befDegRisk = 0;
      } else {
        this.imprAct.befDegRisk = this.imprAct.befFreq * this.imprAct.befInten;
      }
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  updated() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      if (this.popupParam.editMode) {
        this.editable = false;
      }
      this.searchUrl = selectConfig.saf.imprAct.get.url;
      this.insertUrl = transactionConfig.saf.imprAct.insert.url;
      this.editUrl = transactionConfig.saf.imprAct.edit.url;
      this.deleteUrl = transactionConfig.saf.imprAct.delete.url;

      this.imprAct.imprClassCd = this.popupParam.imprClassCd;
      this.imprAct.actLimitYmd = this.$comm.getToday(); // 조치기한 오늘날짜로 초기화
      this.imprAct.imprRqstContents = this.popupParam.imprRqstContents;

      // 조치부서 선택하세요로 지정
      this.imprAct.actDeptCd = null;

      if (this.popupParam.safImprActNo !== 0) this.insertCheck = false;

      this.setAttachFile();
      this.getComboItems('SAF_IMPR_CLASS'); // 개선분류코드

      this.getList();
    },

    setAttachFile() {
      this.attachFileGrp.taskKey = this.popupParam.safImprActNo
        ? String(this.popupParam.safImprActNo)
        : '';
      this.attachFileGrp.createUserId = this.$store.getters.token;
    },
    getList() {
      if (this.popupParam.safImprActNo !== 0) {
        this.$http.url = this.$format(
          this.searchUrl,
          this.popupParam.safImprActNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            Object.assign(this.imprAct, _result.data);
            this.imprRqstUserInfo =
              this.imprAct.imprRqstDeptNm + ' ' + this.imprAct.imprRqstUserNm;
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        this.setDetailData();
      }
    },
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); /* 선택하세요 */
          this.comboImprClassItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setDetailData() {
      this.imprAct.plantCd = this.$store.getters.plantCd;
      this.imprAct.imprRqstUserId = this.$store.getters.token;
      this.imprAct.imprRqstUserNm = this.$store.getters.name;
      this.imprAct.imprRqstDeptCd = this.$store.getters.deptCd;
      this.imprAct.imprRqstDeptNm = this.$store.getters.deptNm;

      this.imprAct.imprRqstYmd = this.$comm.getToday();
      this.imprAct.actClassCd = 'ACL02';
      this.imprAct.imprStepCd = !this.popupParam.imprStepCd
        ? 'IMST1'
        : this.popupParam.imprStepCd;
      this.imprAct.refTableId = this.popupParam.refTableId;
      this.imprRqstUserInfo =
        this.imprAct.imprRqstDeptNm + ' ' + this.imprAct.imprRqstUserNm;
    },
    uploadFiles(data) {
      this.uploadFile.data = data;
    },
    closePopup(data) {
      this.$emit('closePopup', data);
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
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000011' /* 저장하시겠습니까? */,
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.imprAct.createUserId = this.$store.getters.token;
                this.isInsert = true;
              },
            });
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' /*  필수 입력값을 입력해 주세요. */
            );
          }
        })
        .catch(() => {
          this.isInsert = false;
        });
    },
    beforeEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000011' /* 저장하시겠습니까? */,
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.imprAct.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              },
            });
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' /*  필수 입력값을 입력해 주세요. */
            );
          }
        })
        .catch(() => {
          this.isEdit = false;
        });
    },
    beforeDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        type: 'info',
        confirmCallback: () => {
          this.deleteValue = {
            data: this.imprAct.safImprActNo,
          };
          this.isDelete = true;
        },
      });
    },
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006' /* 저장되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.attachFileGrp.taskKey = _result.data;
      this.saveAttach();
    },
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006' /* 저장되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.saveAttach();
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000007' /* 삭제되었습니다. */,
        type: 'success',
      });
      this.closePopup();
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.isDelete = false;

      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    searchVendor(gubun) {
      if (!this.editable) return;
      this.popupOptions.target = () =>
        import(`${'../vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003246'; /* 협력업체 */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
        multiple: false,
        vendors: [],
        vendorTypeCd: 'CVET1', // 공사업체
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data === 'C') return;

      this.imprAct.actDeptCd = data.data.vendorCd;
      this.imprAct.actDeptNm = data.data.vendorNm;
    },
    safetyPlanUploadFiles(data, taskClassNm, attachFileGrp) {
      let inputData = {
        data: data,
      };

      this.attachFileGrp.uploadTempFiles = inputData;
    },
    saveAttach() {
      this.$refs['fileupload'].submitUpload();
    },
  },
};
</script>

<style></style>
