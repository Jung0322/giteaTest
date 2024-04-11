<!--
  목적 : 즉시조치
  Detail : 개선사항 즉시조치 화면
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
            <!-- 즉시조치 상세 정보 -->
            <y-label
              label="L0000002738"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 신규등록 -->
              <y-btn
                v-if="insertCheck && editable && !disabled"
                :action-url="insertUrl"
                :param="imprAct"
                :is-submit="isInsert"
                title="L0000001789"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="!insertCheck && editable && !disabled"
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
                v-if="!insertCheck && editable && !disabled"
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
            <b-col
              v-if="popupParam.actClassYn"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
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
                    name="createDt"
                    v-model="imprAct.createDt"
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
                :editable="editable"
                :disabled="true"
                name="plantCd"
                label="L0000005369"
                v-model="imprAct.plantCd"
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
            <b-col
              v-if="popupParam.actClassYn"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12"
            >
              <!-- 개선요청명 -->
              <y-text
                :width="10"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000005370"
                name="imprTitle"
                v-model="imprAct.imprTitle"
              ></y-text>
            </b-col>
            <b-col
              v-if="popupParam.actClassYn"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12"
            >
              <!-- 조치 요청내용 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="150"
                label="L0000002665"
                ui="bootstrap"
                name="imprRqstContents"
                v-model="imprAct.imprRqstContents"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 세부위치 -->
              <y-text
                :width="10"
                :maxlength="50"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="L0000001641"
                name="dtlLocat"
                v-model="imprAct.dtlLocat"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 발견사항 -->
              <y-textarea
                :width="10"
                :maxlength="600"
                :editable="editable"
                :disabled="disabled"
                label="L0000001073"
                ui="bootstrap"
                name="discoverMatter"
                v-model="imprAct.discoverMatter"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 조치결과내용 -->
              <y-textarea
                :width="10"
                :maxlength="1300"
                :editable="editable"
                :disabled="disabled"
                label="L0000002666"
                ui="bootstrap"
                name="actResultContents"
                v-model="imprAct.actResultContents"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="8">
                  <!-- 조치부서/담당자 -->
                  <y-text
                    :width="6"
                    :editable="editable"
                    :clearable="true"
                    :disabled="true"
                    ui="bootstrap"
                    name="actDeptNm"
                    label="L0000002675"
                    v-model="imprAct.actDeptNm"
                  />
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :editable="editable"
                    :clearable="true"
                    :disabled="true"
                    ui="bootstrap"
                    name="actUserNm"
                    v-model="imprAct.actUserNm"
                    :appendIcon="[
                      { icon: 'search', callbackName: 'searchUser' },
                    ]"
                    @searchUser="btnSearchUserClicked"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 조치일 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="disabled"
                label="L0000002690"
                type="today"
                name="actConfirmYmd"
                default="imprAct.actConfirmYmd"
                v-model="imprAct.actConfirmYmd"
              ></y-datepicker>
            </b-col>
          </b-row>
        </b-card>
        <b-row class="mt-3">
          <b-col sm="12">
            <!-- 개선 전/후 사진 -->
            <y-label
              label="L0000000250"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6">
              <y-file-upload
                ref="fileuploadBefore"
                :attach-file-grp="attachFileGrpBefore"
                :label="attachFileGrpBefore.label"
                :showUploadBtn="attachFileGrpBefore.showUploadBtn"
                :drag="!disabled"
                :showFileSearch="false"
                :editable="editable"
                :disabled="disabled"
                :multiple="true"
                :limit="5"
                :close="true"
                :onlyDownload="disabled"
                :refresh="refresh1"
                :uploadTempFiles="attachFileGrpBefore.uploadTempFiles"
                @uploadFiles="safetyPlanUploadFiles"
                @setDeleteTempFileData="setDeleteTempFileData"
                @setUploadFileLength="setUploadFileLength1"
                @uploadedList="uploadedList1"
              ></y-file-upload>
            </b-col>
            <b-col sm="6">
              <y-file-upload
                ref="fileuploadAfter"
                :attach-file-grp="attachFileGrpAfter"
                :label="attachFileGrpAfter.label"
                :showUploadBtn="attachFileGrpAfter.showUploadBtn"
                :drag="!disabled"
                :showFileSearch="false"
                :editable="editable"
                :disabled="disabled"
                :multiple="true"
                :limit="5"
                :close="true"
                :onlyDownload="disabled"
                :refresh="refresh2"
                :uploadTempFiles="attachFileGrpAfter.uploadTempFiles"
                @uploadFiles="safetyPlanUploadFiles"
                @setDeleteTempFileData="setDeleteTempFileData"
                @setUploadFileLength="setUploadFileLength2"
                @uploadedList="uploadedList2"
              ></y-file-upload>
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
            <b-col sm="12">
              <y-file-upload
                ref="fileupload"
                :attach-file-grp="attachFileGrp"
                :label="attachFileGrp.label"
                :showUploadBtn="attachFileGrp.showUploadBtn"
                :drag="!disabled"
                :showFileSearch="false"
                :editable="editable"
                :disabled="disabled"
                :multiple="true"
                :limit="5"
                :close="true"
                :onlyDownload="disabled"
                :refresh="refresh3"
                :uploadTempFiles="attachFileGrp.uploadTempFiles"
                @uploadFiles="safetyPlanUploadFiles"
                @setDeleteTempFileData="setDeleteTempFileData"
                @setUploadFileLength="setUploadFileLength3"
                @uploadedList="uploadedList3"
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
  name: 'immediate-action-new-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safImprActNo: 0,
        refTableId: 0,
        imprClassCd: null,
        taskClassNm: '',
        flag: '',
        actClassYn: false,
      },
    },
  },
  data() {
    return {
      editable: false,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
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
        actDeptCd: '',
        actDeptNm: '',
        actUserId: '',
        actUserNm: '',
        actResultContents: '',
        actResultReview: '',
        createUserId: '',
        createDt: '',
        updateUserId: '',
        updateDt: '',
        dtlLocat: '',
        processCd: '',
        discoverMatter: '',
      },
      attachFileGrp: {
        taskClassNm: 'ACCTION',
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
        drag: true,
        uploadCheck: false,
        label: 'L0000003030' /* 파일업로드 */,
        uploadTempFiles: null,
      },
      attachFileGrpBefore: {
        taskClassNm: 'ACCTION_BEFORE',
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
        uploadCheck: false,
        drag: true,
        label: 'L0000000274' /* 개선전 사진 */,
        uploadTempFiles: null,
      },
      attachFileGrpAfter: {
        taskClassNm: 'ACCTION_AFTER',
        drag: true,
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
        uploadCheck: false,
        label: 'L0000000285' /* 개선후 사진 */,
        uploadTempFiles: null,
      },
      disabled: false,
      tempDeleteFiles: [],
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
      countIndex1: 0,
      countIndex2: 0,
      countIndex3: 0,
      refresh1: false,
      refresh2: false,
      refresh3: false,
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    this.setAttachFile();
  },
  updated() {},
  mounted() {},
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
      this.imprAct.actConfirmYmd = this.$comm.getToday();
      if (this.popupParam.flag === 'DETAIL') {
        this.disabled = true;
      } else {
        this.disabled = false;
      }

      if (this.popupParam.safImprActNo !== 0) this.insertCheck = false;

      /**
       * 2022.02.23 LHJ
       * 조치부서/담당자를 현재 로그인한 사용자로 초기화
       */
      this.imprAct.actUserId = this.$store.getters.token;
      this.imprAct.actUserNm = this.$store.getters.name;
      this.imprAct.actDeptCd = this.$store.getters.deptCd;
      this.imprAct.actDeptNm = this.$store.getters.deptNm;

      this.getComboItems('SAF_IMPR_CLASS'); // 개선분류코드
      this.getList();
    },
    setAttachFile() {
      let taskKey = this.popupParam.safImprActNo
        ? String(this.popupParam.safImprActNo)
        : '';
      this.attachFileGrp.taskKey = taskKey;
      this.attachFileGrp.createUserId = this.$store.getters.token;

      this.attachFileGrpBefore.taskKey = taskKey;
      this.attachFileGrpBefore.createUserId = this.$store.getters.token;

      this.attachFileGrpAfter.taskKey = taskKey;
      this.attachFileGrpAfter.createUserId = this.$store.getters.token;
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
    setDetailData() {
      this.imprAct.plantCd = this.$store.getters.plantCd;
      this.imprAct.imprRqstUserId = this.$store.getters.token;
      this.imprAct.imprRqstUserNm = this.$store.getters.name;
      this.imprAct.imprRqstDeptCd = this.$store.getters.deptCd;
      this.imprAct.imprRqstDeptNm = this.$store.getters.deptNm;

      this.imprAct.imprRqstYmd = this.$comm.getToday();
      this.imprAct.actClassCd = 'ACL01';
      this.imprAct.imprStepCd = 'IMST1';
      this.imprAct.refTableId = this.popupParam.refTableId;
      this.imprRqstUserInfo =
        this.imprAct.imprRqstDeptNm + ' ' + this.imprAct.imprRqstUserNm;
    },
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, { code: '', codeNm: '선택' });
          this.comboImprClassItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000839' /* 신규등록하시겠습니까? */,
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
              'M0000000005' /* 필수 입력값을 입력해 주세요. */
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
              'M0000000005' /* 필수 입력값을 입력해 주세요. */
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
      this.popupParam.safImprActNo = _result.data;
      this.imprAct.safImprActNo = _result.data;
      this.attachFileGrpBefore.taskKey = _result.data;
      this.attachFileGrpAfter.taskKey = _result.data;
      this.attachFileGrp.taskKey = _result.data;
      this.imprAct.actConfirmYmd = _result.data;
      this.isInsert = false;
      this.insertCheck = false;
      this.saveAttach();
    },
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006' /* 저장되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      this.saveAttach();
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000007' /* 삭제되었습니다 */,
        type: 'success',
      });
      this.closePopup();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchUserClicked(_item) {
      if (!this.editable || this.disabled) return;
      this.popupOptions.target = () =>
        import(`${'../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.imprAct.plantCd, // 선택한 사업장의 정보가 따라서 조회되도록 설정
      };
      this.popupOptions.title = 'L0000001466'; /* 사용자검색 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.imprAct.actUserId = data.user.userId;
        this.imprAct.actUserNm = data.user.userNm;
        this.imprAct.actDeptCd = data.user.deptCd;
        this.imprAct.actDeptNm = data.user.deptNm;
      }
    },
    safetyPlanUploadFiles(data, taskClassNm, attachFileGrp) {
      let inputData = {
        data: data,
      };

      if (this.attachFileGrpBefore.taskClassNm === taskClassNm) {
        this.attachFileGrpBefore.uploadTempFiles = inputData;
      } else if (this.attachFileGrpAfter.taskClassNm === taskClassNm) {
        this.attachFileGrpAfter.uploadTempFiles = inputData;
      } else if (this.attachFileGrp.taskClassNm === taskClassNm) {
        this.attachFileGrp.uploadTempFiles = inputData;
      }
    },
    setDeleteTempFileData(data) {
      var pushData = {
        fileNo: data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
      // this.$emit('refWorkAttach');
    },
    saveAttach() {
      this.$refs['fileuploadBefore'].submitUpload();
      this.$refs['fileuploadAfter'].submitUpload();
      this.$refs['fileupload'].submitUpload();
      // task_key 를 셋팅한다.
      if (this.tempDeleteFiles && this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        console.log(this.tempDeleteFiles);
        this.$http.request(
          (_result) => {
            this.tempDeleteFiles = [];
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    setUploadFileLength1(data) {
      this.countIndex1 = data;
    },
    setUploadFileLength2(data) {
      this.countIndex2 = data;
    },
    setUploadFileLength3(data) {
      this.countIndex3 = data;
    },
    uploadedList1(data) {
      if (data && data.length > 0) {
        if (data.length < this.countIndex1 && this.countIndex1 !== 0) {
          this.refresh1 = !this.refresh1;
        } else {
          this.countIndex1 = 0;
        }
      }
    },
    uploadedList2(data) {
      if (data && data.length > 0) {
        if (data.length < this.countIndex2 && this.countIndex2 !== 0) {
          this.refresh2 = !this.refresh2;
        } else {
          this.countIndex2 = 0;
        }
      }
    },
    uploadedList3(data) {
      if (data && data.length > 0) {
        if (data.length < this.countIndex3 && this.countIndex3 !== 0) {
          this.refresh3 = !this.refresh3;
        } else {
          this.countIndex3 = 0;
        }
      }
    },
  },
};
</script>

<style></style>
