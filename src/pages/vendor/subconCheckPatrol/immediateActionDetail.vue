<!--
  목적 : 협력업체 포탈 > 협력업체 자체점검 결과등록 > 개선사항 > 즉치조치 
  작성자 : kyk
  Detail : 협력업체 자체점검 결과등록 > 개선사항  > 즉치조치 
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
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn
                v-if="insertCheck && editable"
                :action-url="insertUrl"
                :param="imprAct"
                :is-submit="isInsert"
                title="저장"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!insertCheck && editable"
                :action-url="editUrl"
                :param="imprAct"
                :is-submit="isEdit"
                title="수정"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!insertCheck && editable"
                :action-url="deleteUrl"
                :param="deleteValue"
                :is-submit="isDelete"
                title="삭제"
                color="red"
                action-type="DELETE"
                beforeSubmit="beforeDelete"
                @beforeDelete="beforeDelete"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-select
                :width="8"
                :disabled="true"
                :comboItems="comboImprClassItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="업무구분"
                name="imprClassCd"
                v-model="imprAct.imprClassCd"
              ></y-select>
            </b-col>-->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="개선분류"
                name="imprClassNm"
                v-model="imprAct.imprClassNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="3">
                  <y-label label="작성일/작성자" />
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
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="imprRqstUserNm"
                    v-model="imprRqstUserInfo"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-text
                :width="10"
                :maxlength="50"
                :required="true"
                :editable="editable"
                ui="bootstrap"
                label="제목"
                name="imprTitle"
                v-model="imprAct.imprTitle"
                v-validate="'required'"
                :state="validateState('imprTitle')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-textarea
                :width="10"
                :maxlength="150"
                :required="true"
                :editable="editable"
                label="개선요청내용"
                ui="bootstrap"
                name="imprRqstContents"
                v-model="imprAct.imprRqstContents"
                v-validate="'required'"
                :state="validateState('imprRqstContents')"
              />
            </b-col>
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-radio
                :width="10"
                :comboItems="deptVendorGubunItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="deptVendorGubun"
                label="조치구분"
                v-model="deptVendorGubun"
              />
            </b-col>-->
            <!-- <b-col v-if="deptVendorGubun === 'd'" sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4">
                  <y-label label="조치부서/담당자" />
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :clearable="true"
                    :disabled="true"
                    ui="bootstrap"
                    name="actDeptNm"
                    v-model="imprAct.actDeptNm"
                  />
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :clearable="true"
                    :disabled="true"
                    ui="bootstrap"
                    name="actUserNm"
                    v-model="imprAct.actUserNm"
                    :appendIcon="[{ 'icon': 'search', callbackName: 'searchUser' }]"
                    @searchUser="btnSearchUserClicked"
                  />
                </b-col>
              </b-row>
            </b-col>-->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4">
                  <y-label label="업체/담당자" />
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :clearable="true"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="subconnNm"
                    v-model="imprAct.subconnNm"
                  />
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :clearable="true"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="actUserNm"
                    v-model="imprAct.actUserNm"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-datepicker
                :width="8"
                :required="true"
                label="조치일자"
                :editable="editable"
                type="today"
                name="actConfirmYmd"
                default="imprAct.actConfirmYmd"
                v-model="imprAct.actConfirmYmd"
                v-validate="'required'"
                :state="validateState('actConfirmYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-textarea
                :width="10"
                :maxlength="150"
                :required="true"
                :editable="editable"
                label="조치결과내용"
                ui="bootstrap"
                name="actResultContents"
                v-model="imprAct.actResultContents"
                v-validate="'required'"
                :state="validateState('actResultContents')"
              />
            </b-col>
          </b-row>
        </b-card>
        <b-row class="mt-3">
          <b-col sm="12">
            <y-label
              label="개선 전/후 사진"
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
                :editable="attachFileGrpBefore.editable"
                :multiple="false"
                :limit="1"
                :close="attachFileGrpBefore.close"
                @closePopup="uploadFileCheck"
                @uploadFiles="uploadFilesBeforeCheck"
              ></y-file-upload>
            </b-col>
            <b-col sm="6">
              <y-file-upload
                ref="fileuploadAfter"
                :attach-file-grp="attachFileGrpAfter"
                :label="attachFileGrpAfter.label"
                :showUploadBtn="attachFileGrpAfter.showUploadBtn"
                :drag="attachFileGrpAfter.drag"
                :editable="attachFileGrpAfter.editable"
                :multiple="false"
                :limit="1"
                :close="attachFileGrpAfter.close"
                @closePopup="uploadFileCheck"
                @uploadFiles="uploadFilesAfterCheck"
              ></y-file-upload>
            </b-col>
          </b-row>
        </b-card>
        <b-row class="mt-3">
          <b-col sm="12">
            <y-label
              label="첨부파일"
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
                :editable="attachFileGrp.editable"
                :multiple="attachFileGrp.multiple"
                :close="attachFileGrp.close"
                @closePopup="uploadFileCheck"
                @uploadFiles="setUploadFiles"
              ></y-file-upload>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <div class="float-right mt-3">
          <y-btn
            v-if="insertCheck && editable"
            title="저장"
            color="orange"
            action-type="POST"
            beforeSubmit="beforeInsert"
            @beforeInsert="beforeInsert"
            @btnClicked="btnInsertClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <y-btn
            v-if="!insertCheck && editable"
            title="수정"
            color="orange"
            action-type="PUT"
            beforeSubmit="beforeEdit"
            @beforeEdit="beforeEdit"
            @btnClicked="btnEditClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <y-btn
            v-if="!insertCheck && editable"
            title="삭제"
            color="red"
            action-type="DELETE"
            beforeSubmit="beforeDelete"
            @beforeDelete="beforeDelete"
            @btnClicked="btnDeleteClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
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
        editable: true,
        checkStepCd: 'CHS01',
      },
    },
  },
  data() {
    return {
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
        safImprActNo: 0,
        imprClassNm: '자체점검', // 개선분류
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
        actUserNm: '협력건설',
        actResultContents: '',
        actResultReview: '',
        subconnNm: '협력건설',
        createUserId: '',
        createDt: '',
        updateUserId: '',
        updateDt: '',
      },
      imprActData: {
        safImprActNo: 1,
        imprClassNm: '자체점검', // 개선분류
        imprClassCd: 'T1',
        actClassCd: 'ACL01',
        imprRqstYmd: '2019-08-22',
        imprTitle: '즉시조치건 제목을 입력',
        imprRqstDeptCd: 'T1',
        imprRqstDeptNm: '협력건설',
        imprRqstUserId: 'T1',
        imprRqstUserNm: '홍길동',
        imprRqstContents: '조치 요청내용을 입력',
        imprStepCd: 'IMST1',
        refTable: 'dataTable',
        refTableId: 'dataTable',
        actSchYmd: '2019-08-22',
        actConfirmYmd: '2019-08-22',
        actLimitYmd: '2019-08-22',
        actDeptCd: 'T1',
        actDeptNm: '부서',
        actUserId: 'T1',
        actUserNm: '협력건설',
        actResultContents: '조치 요청내용을 입력',
        actResultReview: '조치 요청내용을 검토',
        subconnNm: '협력건설',
        createUserId: 'T1',
        createDt: '2019-08-22',
        updateUserId: 'T1',
        updateDt: '2019-08-22',
      },
      deptVendorGubun: 'd',
      attachFileGrp: {
        taskClassNm: '',
        taskKey: '',
        createUserId: '',
        showUploadBtn: true,
        editable: true,
        multiple: true,
        close: false,
        drag: true,
        uploadCheck: false,
        label: '',
      },
      attachFileGrpBefore: {
        taskClassNm: '',
        taskKey: '',
        createUserId: '',
        showUploadBtn: true,
        editable: true,
        close: false,
        uploadCheck: false,
        drag: true,
        label: '',
      },
      attachFileGrpAfter: {
        taskClassNm: '',
        drag: true,
        taskKey: '',
        createUserId: '',
        showUploadBtn: true,
        editable: true,
        close: false,
        uploadCheck: false,
        label: '',
      },
      uploadFiles: {
        data: [],
      },
      uploadFilesBefore: {
        data: [],
      },
      uploadFilesAfter: {
        data: [],
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
      deptVendorGubunItems: [],
      deleteValue: null,
    };
  },
  watch: {
    deptVendorGubun() {
      this.imprAct.actUserId = '';
      this.imprAct.actUserNm = '';
      this.imprAct.actDeptCd = '';
      this.imprAct.actDeptNm = '';
      this.imprAct.actUserNm = '';
      this.imprAct.subconnNm = '';
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  updated() {},
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.searchUrl = selectConfig.saf.imprAct.get.url;
      this.insertUrl = transactionConfig.saf.imprAct.insert.url;
      this.editUrl = transactionConfig.saf.imprAct.edit.url;
      this.deleteUrl = transactionConfig.saf.imprAct.delete.url;
      this.imprAct.imprClassCd = this.popupParam.imprClassCd;
      this.editable = this.popupParam.editable;

      if (this.popupParam.safImprActNo !== 0) {
        this.insertCheck = false;
      }

      if (this.popupParam.checkStepCd === 'CHS04') {
        this.insertCheck = false;
        this.attachFileGrp.editable = false;
        this.attachFileGrpBefore.editable = false;
        this.attachFileGrpAfter.editable = false;
        this.attachFileGrp.showUploadBtn = false;
        this.attachFileGrpBefore.showUploadBtn = false;
        this.attachFileGrpAfter.showUploadBtn = false;
      }

      this.deptVendorGubunItems = [
        { code: 'd', codeNm: '부서' },
        { code: 'v', codeNm: '협력업체' },
      ];

      // this.setAttachFile();
      this.getComboItems('SAF_IMPR_CLASS'); // 개선분류코드
      this.getList();
    },
    setAttachFile() {
      this.attachFileGrp.taskClassNm = 'ACCTION';
      this.attachFileGrp.taskKey = this.popupParam.safImprActNo.toString();
      this.attachFileGrp.createUserId = this.$store.getters.token;
      this.attachFileGrp.label = '파일업로드';

      this.attachFileGrpBefore.taskClassNm = 'ACCTION_BEFORE';
      this.attachFileGrpBefore.taskKey =
        this.popupParam.safImprActNo.toString();
      this.attachFileGrpBefore.createUserId = this.$store.getters.token;
      this.attachFileGrpBefore.label = '개선전 사진';

      this.attachFileGrpAfter.taskClassNm = 'ACCTION_AFTER';
      this.attachFileGrpAfter.taskKey = this.popupParam.safImprActNo.toString();
      this.attachFileGrpAfter.createUserId = this.$store.getters.token;
      this.attachFileGrpAfter.label = '개선후 사진';

      if (this.popupParam.safImprActNo === 0) {
        this.attachFileGrp.showUploadBtn = false;
        this.attachFileGrp.drag = true;
        this.attachFileGrp.multiple = false;
        this.attachFileGrp.close = true;

        this.attachFileGrpBefore.showUploadBtn = false;
        this.attachFileGrpBefore.drag = true;
        this.attachFileGrpBefore.close = true;

        this.attachFileGrpAfter.showUploadBtn = false;
        this.attachFileGrpAfter.drag = true;
        this.attachFileGrpAfter.close = true;
      }
    },
    setUploadFiles(data) {
      this.uploadFiles.data = data;
    },
    uploadFilesBeforeCheck(data) {
      this.uploadFilesBefore.data = data;
    },
    uploadFilesAfterCheck(data) {
      this.uploadFilesAfter.data = data;
    },
    getList() {
      if (this.popupParam.safImprActNo !== 0) {
        // this.$http.url = this.$format(
        //   this.searchUrl,
        //   this.popupParam.safImprActNo
        // );
        // this.$http.type = 'GET';
        // this.$http.request(
        //   _result => {
        //     Object.assign(this.imprAct, _result.data);
        //     this.imprRqstUserInfo =
        //       this.imprAct.imprRqstDeptNm + ' ' + this.imprAct.imprRqstUserNm;
        //   },
        //   _error => {
        //     this.$emit('APP_REQUEST_ERROR', _error);
        //   }
        // );
        Object.assign(this.imprAct, this.imprActData);
        this.imprRqstUserInfo =
          this.imprAct.imprRqstDeptNm + ' ' + this.imprAct.imprRqstUserNm;
      } else {
        this.setDetailData();
      }
    },
    setDetailData() {
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
          this.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = '사용자검색';
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
    // btnSearchVendorUserClicked (_item) {
    //   this.popupOptions.param = {
    //     popupMode: true,
    //     multiple: false,
    //   };
    //   this.popupOptions.target = () =>
    //     import(`${'../../vendor/baseInfo/vendorMasterPerson.vue'}`);
    //   this.popupOptions.title = '출입자';
    //   this.popupOptions.visible = true;
    //   this.popupOptions.width = '80%';
    //   this.popupOptions.closeCallback = this.closePopupSearchVendorUser;
    // },
    // closePopupSearchVendorUser (data) {
    //   this.popupOptions.target = null;
    //   this.popupOptions.visible = false;

    //   if (data === 'CLOSE') return;

    //   this.imprAct.actUserNm = data.data.vendorPersonNm;
    //   this.imprAct.subconnNm = data.data.vendorNm;
    // },
    uploadFileCheck(data) {
      if (data.taskClassNm === 'ACCTION') {
        this.attachFileGrp.uploadCheck = true;
      } else if (data.taskClassNm === 'ACCTION_AFTER') {
        this.attachFileGrpAfter.uploadCheck = true;
      } else if (data.taskClassNm === 'ACCTION_BEFORE') {
        this.attachFileGrpBefore.uploadCheck = true;
      }

      if (
        this.attachFileGrp.uploadCheck &&
        this.attachFileGrpAfter.uploadCheck &&
        this.attachFileGrpBefore.uploadCheck
      ) {
        this.closePopup();
      }
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
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '저장되었습니다. (준비중입니다)',
        type: 'success', // success / info / warning / error
      });
      // window.getApp.$emit('CONFIRM', {
      //   title: '확인',
      //   message: '저장하시겠습니까?',
      //   type: 'info', // success / info / warning / error
      //   // 확인 callback 함수
      //   confirmCallback: () => {
      //     this.imprAct.createUserId = this.$store.getters.token;
      //     this.checkValidationInsert();
      //   },
      // });
    },
    beforeEdit() {
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '수정되었습니다. (준비중입니다)',
        type: 'success', // success / info / warning / error
      });
      // window.getApp.$emit('CONFIRM', {
      //   title: '확인',
      //   message: '수정하시겠습니까?',
      //   type: 'info', // success / info / warning / error
      //   // 확인 callback 함수
      //   confirmCallback: () => {
      //     this.imprAct.updateUserId = this.$store.getters.token;
      //     this.checkValidationEdit();
      //   },
      // });
    },
    beforeDelete() {
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '삭제되었습니다. (준비중입니다)',
        type: 'success', // success / info / warning / error
      });
      // window.getApp.$emit('CONFIRM', {
      //   title: '확인',
      //   message: '삭제하시겠습니까?',
      //   type: 'info',
      //   confirmCallback: () => {
      //     this.deleteValue = {
      //       data: this.imprAct.safImprActNo,
      //     };
      //     this.isDelete = true;
      //   },
      // });
    },
    checkValidationInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isInsert = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isInsert) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              '필수 입력값을 입력해 주세요.'
            );
          }
        })
        .catch(() => {
          this.isInsert = false;
        });
    },
    checkValidationEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isEdit = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isEdit) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              '필수 입력값을 입력해 주세요.'
            );
          }
        })
        .catch(() => {
          this.isEdit = false;
        });
    },
    btnInsertClickedCallback(_result) {
      // window.getApp.$emit('ALERT', {
      //   title: '안내',
      //   message: '저장되었습니다.',
      //   type: 'success', // success / info / warning / error
      // });
      // if (this.uploadFiles.data.length === 0) this.attachFileGrp.uploadCheck = true;
      // if (this.uploadFilesBefore.data.length === 0) this.attachFileGrpBefore.uploadCheck = true;
      // if (this.uploadFilesAfter.data.length === 0) this.attachFileGrpAfter.uploadCheck = true;
      // if (
      //   this.attachFileGrp.uploadCheck &&
      //   this.attachFileGrpAfter.uploadCheck &&
      //   this.attachFileGrpBefore.uploadCheck
      // ) this.closePopup();
      // if (this.popupParam.safImprActNo === 0) {
      //   this.attachFileGrp.taskKey = this.$_.clone(_result.data.toString());
      //   this.attachFileGrpBefore.taskKey = this.$_.clone(
      //     _result.data.toString()
      //   );
      //   this.attachFileGrpAfter.taskKey = this.$_.clone(
      //     _result.data.toString()
      //   );
      //   this.$refs.fileuploadBefore.submitUpload();
      //   this.$refs.fileuploadAfter.submitUpload();
      //   this.$refs.fileupload.submitUpload();
      // } else {
      //   this.closePopup();
      // }
    },
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '수정되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.closePopup();
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '삭제되었습니다.',
        type: 'success',
      });
      this.closePopup();
    },
    btnClickedErrorCallback(_result) {
      // this.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>

<style></style>
