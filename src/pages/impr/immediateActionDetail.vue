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
                v-if="insertCheck && editable"
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
              <!-- 수정 -->
              <y-btn
                v-if="!insertCheck && editable"
                :action-url="editUrl"
                :param="imprAct"
                :is-submit="isEdit"
                title="L0000001696"
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
                    :disabled="true"
                    :editable="editable"
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
                    name="imprRqstUserNm"
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
                v-model="imprAct.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 제목 -->
              <y-text
                :width="10"
                :maxlength="50"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000002616"
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
                :maxlength="150"
                :editable="editable"
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
              <b-row>
                <!-- <b-col sm="4">
                  <y-label label="" />
                </b-col>-->
                <b-col sm="8">
                  <!-- 조치부서/담당자 -->
                  <y-text
                    :width="6"
                    :editable="editable"
                    :required="true"
                    :clearable="true"
                    :disabled="true"
                    ui="bootstrap"
                    name="actDeptNm"
                    label="L0000002675"
                    v-model="imprAct.actDeptNm"
                    v-validate="'required'"
                    :state="validateState('actDeptNm')"
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
                    v-validate="'required'"
                    :state="validateState('actUserNm')"
                  />
                </b-col>
              </b-row>
            </b-col>

            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-radio
                :width="10"
                :editable="editable"
                :comboItems="deptVendorGubunItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="subconnRqstYn"
                label="조치구분"
                v-model="imprAct.subconnRqstYn"
              />
            </b-col>-->
            <!-- <b-col
              v-else-if="imprAct.subconnRqstYn === 'N'"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
              <b-row>
                <b-col sm="4">
                  <y-label label="업체" />
                </b-col>
                <b-col sm="8">
                  <y-text
                    :width="12"
                    :editable="editable"
                    :clearable="true"
                    :disabled="true"
                    ui="bootstrap"
                    name="actDeptNm"
                    v-model="imprAct.actDeptNm"
                    :appendIcon="[{ 'icon': 'search', callbackName: 'searchVendor' }]"
                    @searchVendor="btnSearchVendorUserClicked"
                  />
                </b-col>
              </b-row>
            </b-col>-->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 조치일자 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :required="true"
                label="L0000002691"
                type="today"
                name="actConfirmYmd"
                default="imprAct.actConfirmYmd"
                v-model="imprAct.actConfirmYmd"
                v-validate="'required'"
                :state="validateState('actConfirmYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 조치내용 및 결과 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="150"
                :required="true"
                label="L0000004667"
                ui="bootstrap"
                name="actResultContents"
                v-model="imprAct.actResultContents"
                v-validate="'required'"
                :state="validateState('actResultContents')"
              />
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
                ui="bootstrap"
                label="L0000001641"
                name="dtlLocat"
                v-model="imprAct.dtlLocat"
              ></y-text>
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
                :drag="attachFileGrpBefore.drag"
                :showFileSearch="false"
                :editable="editable"
                :multiple="true"
                :limit="5"
                :close="true"
                :onlyDownload="false"
                :uploadTempFiles="attachFileGrpBefore.uploadTempFiles"
                @uploadFiles="safetyPlanUploadFiles"
                @setDeleteTempFileData="setDeleteTempFileData"
              ></y-file-upload>
            </b-col>
            <b-col sm="6">
              <y-file-upload
                ref="fileuploadAfter"
                :attach-file-grp="attachFileGrpAfter"
                :label="attachFileGrpAfter.label"
                :showUploadBtn="attachFileGrpAfter.showUploadBtn"
                :drag="attachFileGrpAfter.drag"
                :showFileSearch="false"
                :editable="editable"
                :multiple="true"
                :limit="5"
                :close="true"
                :onlyDownload="false"
                :uploadTempFiles="attachFileGrpAfter.uploadTempFiles"
                @uploadFiles="safetyPlanUploadFiles"
                @setDeleteTempFileData="setDeleteTempFileData"
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
                :drag="attachFileGrp.drag"
                :showFileSearch="false"
                :editable="editable"
                :multiple="true"
                :limit="5"
                :close="true"
                :onlyDownload="false"
                :uploadTempFiles="attachFileGrp.uploadTempFiles"
                @uploadFiles="safetyPlanUploadFiles"
                @setDeleteTempFileData="setDeleteTempFileData"
              ></y-file-upload>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <div class="float-right mt-3">
          <!-- 신규등록 -->
          <y-btn
            v-if="insertCheck && editable"
            title="L0000001789"
            color="orange"
            action-type="POST"
            beforeSubmit="beforeInsert"
            @beforeInsert="beforeInsert"
            @btnClicked="btnInsertClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 수정 -->
          <y-btn
            v-if="!insertCheck && editable"
            title="L0000001696"
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
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'immediate-action-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safImprActNo: 0,
        refTableId: 0,
        imprClassCd: null,
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
      },
      attachFileGrp: {
        taskClassNm: '',
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
        drag: true,
        uploadCheck: false,
        label: '',
        uploadTempFiles: null,
      },
      attachFileGrpBefore: {
        taskClassNm: '',
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
        uploadCheck: false,
        drag: true,
        label: '',
        uploadTempFiles: null,
      },
      attachFileGrpAfter: {
        taskClassNm: '',
        drag: true,
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
        uploadCheck: false,
        label: '',
        uploadTempFiles: null,
      },
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
      deptVendorGubunItems: [],
      deleteValue: null,
    };
  },
  watch: {
    // 'imprAct.subconnRqstYn'() {
    //   if (this.isFirst) {
    //     this.isFirst = false;
    //     return;
    //   }
    //   this.imprAct.actUserId = '';
    //   this.imprAct.actUserNm = '';
    //   this.imprAct.actDeptCd = '';
    //   this.imprAct.actDeptNm = '';
    // },
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

      this.searchUrl = selectConfig.saf.imprAct.get.url;
      this.insertUrl = transactionConfig.saf.imprAct.insert.url;
      this.editUrl = transactionConfig.saf.imprAct.edit.url;
      this.deleteUrl = transactionConfig.saf.imprAct.delete.url;

      this.imprAct.imprClassCd = this.popupParam.imprClassCd;

      if (this.popupParam.safImprActNo !== 0) this.insertCheck = false;

      this.deptVendorGubunItems = [
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001287') }, // 부서
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000003246') }, // 협력업체
      ];

      this.setAttachFile();
      this.getComboItems('SAF_IMPR_CLASS'); // 개선분류코드
      this.getList();
    },
    setAttachFile() {
      this.attachFileGrp.taskClassNm = 'ACCTION';
      this.attachFileGrp.taskKey = this.popupParam.safImprActNo.toString();
      this.attachFileGrp.createUserId = this.$store.getters.token;
      this.attachFileGrp.label = 'L0000003030'; // 파일업로드

      this.attachFileGrpBefore.taskClassNm = 'ACCTION_BEFORE';
      this.attachFileGrpBefore.taskKey =
        this.popupParam.safImprActNo.toString();
      this.attachFileGrpBefore.createUserId = this.$store.getters.token;
      this.attachFileGrpBefore.label = 'L0000000274'; // 개선전 사진

      this.attachFileGrpAfter.taskClassNm = 'ACCTION_AFTER';
      this.attachFileGrpAfter.taskKey = this.popupParam.safImprActNo.toString();
      this.attachFileGrpAfter.createUserId = this.$store.getters.token;
      this.attachFileGrpAfter.label = 'L0000000285'; // 개선후 사진
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
          _result.data.splice(0, 0, {
            code: '',
            codeNm: this.$comm.getLangSpecInfoLabel('L0000001561'),
          }); // 선택
          this.comboImprClassItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnSearchUserClicked(_item) {
      if (!this.editable) return;
      this.popupOptions.target = () =>
        import(`${'../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.imprAct.plantCd, // 선택한 사업장의 정보가 따라서 조회되도록 설정
      };
      this.popupOptions.title = 'L0000001459'; // 사용자검색
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
    btnSearchVendorUserClicked(_item) {
      if (!this.editable) return;
      this.popupOptions.param = {
        popupMode: true,
        multiple: false,
        vendors: [],
        vendorTypeCd: 'CVET1', // 공사업체
        plantCd: this.imprAct.plantCd,
      };
      this.popupOptions.target = () =>
        import(`${'../vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003246'; // 협력업체
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.closeCallback = this.closePopupSearchVendorUser;
    },
    closePopupSearchVendorUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data === 'C') return;

      // this.imprAct.actUserId = data.data.portalId;
      // this.imprAct.actUserNm = data.data.chargerNm;
      this.imprAct.actDeptCd = data.data.vendorCd;
      this.imprAct.actDeptNm = data.data.vendorNm;
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
              title: 'L0000003321', // 확인
              message: 'M0000000839', // 신규등록하시겠습니까?
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
              'M0000000005' // 필수 입력값을 입력해 주세요.
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
              title: 'L0000003321', // 확인
              message: 'M0000000060', // 수정하시겠습니까?
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
              'M0000000005' // 필수 입력값을 입력해 주세요.
            );
          }
        })
        .catch(() => {
          this.isEdit = false;
        });
    },
    beforeDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000012', // 삭제하시겠습니까?
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
        title: 'L0000003395', // 안내
        message: 'M0000000840', // 신규등록 되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.attachFileGrpBefore.taskKey = _result.data;
      this.attachFileGrpAfter.taskKey = _result.data;
      this.attachFileGrp.taskKey = _result.data;
      this.saveAttach();
    },
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000836', // 수정되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.saveAttach();
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000007', // 삭제
        type: 'success',
      });
      this.closePopup();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
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
        this.$http.request(
          (_result) => {
            this.tempDeleteFiles = [];
            this.closePopup();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        this.closePopup();
      }
    },
  },
};
</script>

<style></style>
