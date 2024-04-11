<!--
  목적 : 위험성평가 실행 상세 목록
  Detail : 위험성평가 실행 상세 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row ref="searchBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 상세정보 -->
            <y-label
              :label="
                popupParam.label +
                this.$comm.getLangSpecInfoLabel('L0000003928')
              "
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="insertMod && editable"
                :action-url="insertUrl"
                :param="sheDouc"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 개정 -->
              <y-btn
                v-if="renewalMod === 'R'"
                :action-url="renewalUrl"
                :param="sheDouc"
                :is-submit="isRenewal"
                title="L0000000291"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeRenewal"
                @beforeRenewal="beforeRenewal"
                @btnClicked="btnRenewalClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="renewalMod === 'M'"
                :action-url="editUrl"
                :param="sheDouc"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 수정 -->
              <y-btn
                v-if="renewalMod === 'C' && !insertMod && editable"
                title="L0000001696"
                color="orange"
                @btnClicked="setUpdateMod('M')"
              />
              <!-- 개정 -->
              <y-btn
                v-if="renewalMod === 'C' && !insertMod && editable"
                title="L0000000291"
                color="orange"
                @btnClicked="setUpdateMod('R')"
              />
              <!-- 취소 -->
              <y-btn
                v-if="renewalMod !== 'C'"
                title="L0000002920"
                @btnClicked="setUpdateMod('C')"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card
          header-class="default-card"
          body-class="default-body-card"
          class="py-0"
        >
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                type="edit"
                :editable="editable"
                :disabled="!insertMod"
                name="plantCd"
                v-model="sheDouc.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 공정 -->
              <y-tree-process
                :required="true"
                :editable="editable"
                :disabled="!insertMod"
                label="L0000000515"
                name="processCd"
                type="edit"
                :showDataMapping="true"
                :plantCd="sheDouc.plantCd"
                v-model="sheDouc.processCd"
                v-validate="'required'"
                :state="validateState('processCd')"
              ></y-tree-process>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 문서명 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="!insertMod"
                :required="true"
                :maxlength="60"
                ui="bootstrap"
                label="L0000001041"
                name="docuTitle"
                v-model="sheDouc.docuTitle"
                v-validate="'required'"
                :state="validateState('docuTitle')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 개정사유 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="renewalMod === 'C'"
                :maxlength="100"
                ui="bootstrap"
                label="L0000001483"
                name="revContents"
                v-model="sheDouc.revContents"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
        <b-row class="mt-3"></b-row>
        <el-tabs type="border-card" v-model="tabIndex" @tab-click="tabClick">
          <el-tab-pane
            v-for="(item, i) in tabItems"
            :key="i"
            stretch
            class="default-tab-pane"
          >
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ item.title }}
            </span>
            <keep-alive>
              <component
                ref="tab"
                :is="component"
                v-if="component"
                :paneName="paneName"
                :updateMod="updateMod"
                :attachFileGrp.sync="attachFileGrp"
                :safAttachFileGrp.sync="safAttachFileGrp"
                :beforeAttachFileGrp.sync="beforeAttachFileGrp"
                :multiFileUpload.sync="multiFileUpload"
                :uploadTempFiles="uploadFiles"
                :beforeUploadTempFiles="beforeUploadFiles"
                @changeUploadFiles="changeUploadFiles"
                @changeSafUploadFiles="changeSafUploadFiles"
                @changeBeforeUploadFiles="changeBeforeUploadFiles"
                @setSafTempDeleteFiles="setSafTempDeleteFiles"
                @setTempDeleteFiles="setTempDeleteFiles"
              />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'saf-attach-file-dialog',
  props: {
    popupParam: {
      type: Object,
      default: {
        sheDocuNo: 0,
        docuGrpNo: 0,
        docuClassCd: '',
        taskKey: '',
        taskClassNm: '',
        taskFlag: '',
        docuKindCd: null,
        plantCd: '',
        data: {},
        editable: true,
        refTableId: '',
        label: '',
      },
    },
  },
  data() {
    return {
      sheDouc: {
        sheDocuNo: '',
        docuGrpNo: '',
        docuClassCd: '',
        docuKindCd: null,
        plantCd: '',
        deptCd: '',
        docuTitle: '',
        processCd: '',
        revNum: 0,
        revYmd: '',
        enfYmd: '',
        docuContents: '',
        revContents: '',
        useYn: '',
        delYn: '',
        createUserId: '',
        createDt: '',
        updateUserId: '',
        updateDt: '',
        refTableId: '',
        selectRow: [],
      },
      tabItems: [],
      // 일반 첨부파일 data
      attachFileGrp: {
        taskClassNm: '',
        taskKey: '',
        taskFlag: 'SAF',
        createUserId: '',
        showUploadBtn: true,
        drag: true,
        editable: true,
        multiple: true,
        label: 'L0000003030' /* 파일업로드 */,
        close: false,
        uploadCheck: false,
        // 파일 업로드 버튼 없을시 상태값 체크하여 파일 업로드 진행
        submitCheck: false,
        disabled: false,
        onlyDownload: false,
      },
      // 문서 첨부파일 data
      safAttachFileGrp: {
        taskClassNm: '',
        taskKey: '',
        taskFlag: 'SAF',
        createUserId: '',
        showUploadBtn: true,
        drag: true,
        editable: true,
        multiple: true,
        label: 'L0000003030' /* 파일업로드 */,
        close: false,
        uploadCheck: false,
        // 파일 업로드 버튼 없을시 상태값 체크하여 파일 업로드 진행
        submitCheck: false,
        disabled: false,
        onlyDownload: false,
      },
      beforeAttachFileGrp: {
        taskClassNm: '',
        taskKey: '',
        taskFlag: '',
        selectRow: [],
        paneName: '',
      },
      uploadFiles: {
        data: [],
      },
      safUploadFiles: {
        data: [],
      },
      beforeUploadFiles: {
        data: [],
      },
      revCheck: false,
      revNum: '',
      tabIndex: 0,
      paneName: '',
      component: null,
      editable: true,
      insertUrl: '',
      editUrl: '',
      renewalUrl: '',
      deleteUrl: '',
      isInsert: false,
      isEdit: false,
      isRenewal: false,
      docuKindCdSearchItems: [],
      insertMod: false,
      updateMod: false,
      renewalMod: 'C',
      multiFileUpload: false,
      safTempDeleteFiles: [],
      tempDeleteFiles: [],
      refresh: false,
      prevSheDouc: {},
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    updateMod: {
      handler: function (val, oldVal) {
        if (val) {
          this.safAttachFileGrp.multiple = true;
          this.attachFileGrp.multiple = true;
          this.safAttachFileGrp.disabled = false;
          this.attachFileGrp.disabled = false;
        } else {
          this.safAttachFileGrp.multiple = false;
          this.attachFileGrp.multiple = false;
          this.safAttachFileGrp.disabled = true;
          this.attachFileGrp.disabled = true;
        }
      },
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.attachFileGrp.label = this.$comm.getLangSpecInfoLabel(
        this.attachFileGrp.label
      );
      this.popupParam.label = this.$comm.getLangSpecInfoLabel(
        this.popupParam.label
      );

      this.insertUrl = transactionConfig.safAttachFile.insert.url;
      this.renewalUrl = transactionConfig.safAttachFile.insert.url;

      this.editUrl = transactionConfig.safAttachFile.edit.url;
      this.deleteUrl = transactionConfig.safAttachFile.edit.url;

      this.prevSheDouc = this.$_.cloneDeep(this.popupParam.data);

      this.setAttachFile();

      if (this.popupParam.label === undefined) {
        this.popupParam.label =
          this.$comm.getLangSpecInfoLabel('L0000002843'); /* 첨부파일 */
      }
      this.tabItems = [
        { title: this.popupParam.label, url: 'safFileUploadPage' },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002843'),
          url: 'fileUploadPage',
        } /* 첨부파일 */,
      ];
    },
    setAttachFile() {
      this.attachFileGrp.createUserId = this.$store.getters.token;
      this.safAttachFileGrp.createUserId = this.$store.getters.token;
      this.safAttachFileGrp.taskClassNm = this.popupParam.taskClassNm;
      this.safAttachFileGrp.taskKey = this.popupParam.taskKey
        ? String(this.popupParam.taskKey)
        : '';
      this.safAttachFileGrp.taskFlag = 'SAF';
      this.safAttachFileGrp.showUploadBtn = false;

      this.safAttachFileGrp.multiple = true;
      this.multiFileUpload = true;

      this.sheDouc.refTableId = this.popupParam.refTableId;

      this.beforeAttachFileGrp = this.$_.cloneDeep(this.safAttachFileGrp);

      if (this.popupParam.sheDocuNo === 0) {
        this.sheDouc.docuKindCd = this.popupParam.docuKindCd;
        this.sheDouc.processCd = '';
        this.sheDouc.docuClassCd = this.popupParam.docuClassCd;

        this.insertMod = true;
        this.updateMod = true;
        this.revNum = 0;
      } else {
        this.safAttachFileGrp.drag = false;
        this.safAttachFileGrp.onlyDownload = true;

        this.$_.extend(this.sheDouc, this.popupParam.data);
        this.revNum = this.popupParam.data.revNum;
        this.safAttachFileGrp.multiple = false;
        this.attachFileGrp.multiple = false;
        this.safAttachFileGrp.disabled = true;
        this.attachFileGrp.disabled = true;
      }

      // editable 체크
      if (this.popupParam.editable === false) {
        this.editable = false;
        this.safAttachFileGrp.showUploadBtn = false;
        this.safAttachFileGrp.multiple = false;
        this.safAttachFileGrp.drag = false;
      } else {
        this.editable = this.$route.meta.editable;
      }

      this.attachFileGrp = this.$_.cloneDeep(this.safAttachFileGrp);
      this.attachFileGrp.taskKey = this.popupParam.docuGrpNo
        ? String(this.popupParam.docuGrpNo)
        : '';
      this.attachFileGrp.taskFlag = '';
    },
    setUpdateMod(flag) {
      this.renewalMod = flag;
      this.updateMod = true;
      this.safAttachFileGrp.drag = true;

      if (flag === 'R') {
        this.safAttachFileGrp.taskKey = '';

        this.tabItems = [
          { title: this.popupParam.label, url: 'attachFile' },
          {
            title: this.$comm.getLangSpecInfoLabel('L0000002843'),
            url: 'fileUploadPage',
          } /* 첨부파일 */,
        ];
        this.tabIndex = '0';
        this.loadComponent();

        let nowDate = new Date();
        this.beforeAttachFileGrp.paneName = nowDate.getMilliseconds();

        this.attachFileGrp.showUploadBtn = false;
        this.attachFileGrp.multiple = true;
        this.attachFileGrp.drag = true;
        this.attachFileGrp.close = false;
        this.attachFileGrp.onlyDownload = false;
      } else if (flag === 'M') {
        this.safAttachFileGrp.taskKey = this.popupParam.taskKey
          ? String(this.popupParam.taskKey)
          : '';
        this.tabItems = [
          { title: this.popupParam.label, url: 'safFileUploadPage' },
          {
            title: this.$comm.getLangSpecInfoLabel('L0000002843'),
            url: 'fileUploadPage',
          } /* 첨부파일 */,
        ];
        this.tabIndex = '0';
        this.loadComponent();

        this.safAttachFileGrp.showUploadBtn = false;
        this.safAttachFileGrp.multiple = true;
        this.safAttachFileGrp.close = true; // 테스트
        this.safAttachFileGrp.onlyDownload = false;

        this.attachFileGrp.showUploadBtn = false;
        this.attachFileGrp.multiple = true;
        this.attachFileGrp.drag = true;
        this.attachFileGrp.close = false;
        this.attachFileGrp.onlyDownload = false;

        this.safAttachFileGrp.disabled = false;
        this.attachFileGrp.disabled = false;
      } else {
        this.safTempDeleteFiles = [];
        this.tempDeleteFiles = [];

        this.updateMod = false;
        this.safAttachFileGrp.taskKey = this.popupParam.taskKey
          ? String(this.popupParam.taskKey)
          : '';
        this.tabItems = [
          { title: this.popupParam.label, url: 'safFileUploadPage' },
          {
            title: this.$comm.getLangSpecInfoLabel('L0000002843'),
            url: 'fileUploadPage',
          } /* 첨부파일 */,
        ];
        this.tabIndex = '0';
        this.loadComponent();

        this.safAttachFileGrp.drag = false;
        this.safAttachFileGrp.showUploadBtn = false;
        this.safAttachFileGrp.multiple = true;
        this.renewalMod = 'C';
        this.insertMod = false;
        this.safAttachFileGrp.onlyDownload = true;
        this.attachFileGrp.onlyDownload = true;

        this.attachFileGrp.showUploadBtn = false;
        this.attachFileGrp.multiple = false;
        this.attachFileGrp.drag = false;
        this.beforeAttachFileGrp.selectRow = [];

        this.safAttachFileGrp.disabled = true;
        this.attachFileGrp.disabled = true;

        this.sheDouc = this.$_.clone(this.prevSheDouc); // 개정사유를 입력하고 왔을때 취소를 누르면 기존의 개정사유가 보여져야 한다.
      }
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      if (path === 'attachFile') {
        this.component = () => import('@/pages/common/attachFile/attachFile');
      } else if (path === 'safFileUploadPage') {
        this.component = () =>
          import('@/pages/common/attachFile/safFileUploadPage');
      } else {
        this.component = () => import('@/pages/saf/imprAct/fileUploadPage');
      }
    },
    closePopup() {
      this.$emit('closePopup', {});
    },
    tabClick(tab) {
      var nowDate = new Date();
      this.paneName = tab.paneName + nowDate.getMilliseconds();
    },
    changeSafUploadFiles(data) {
      this.safUploadFiles = data;
    },
    changeBeforeUploadFiles(data) {
      this.beforeUploadFiles = data;
    },
    changeUploadFiles(data) {
      this.uploadFiles = data;
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
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'MGT_DOCU_KND01') {
            this.docuKindCdSearchItems = this.$_.clone(_result.data);
            this.docuKindCdSearchItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // '선택하세요',
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
                this.sheDouc.createUserId = this.$store.getters.token;
                this.isInsert = true;
              },
            });
          } else {
            this.$popupRequired.check(
              'safAttachFileDialog',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          this.isInsert = false;
        });
    },
    beforeEdit() {
      this.$validator.validateAll().then((_result) => {
        if (_result) {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321' /* 확인 */,
            message: 'M0000000011' /* 저장하시겠습니까? */,
            type: 'info',
            confirmCallback: () => {
              this.sheDouc.updateUserId = this.$store.getters.token;
              this.checkValidationEdit();
            },
          });
        }
      });
    },
    beforeRenewal() {
      console.log('1111', this.beforeAttachFileGrp.selectRow);
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000166', // 개정하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.sheDouc.selectRow = this.beforeAttachFileGrp.selectRow;
          this.sheDouc.createUserId = this.$store.getters.token;
          this.sheDouc.updateUserId = this.$store.getters.token;
          this.checkValidationRenewal();
        },
        cancelCallback: () => {
          this.isRenewal = false;
        },
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
              'M0000000005' /* 필수 입력값을 입력해 주세요. */
            );
          }
        })
        .catch(() => {
          this.isEdit = false;
        });
    },
    checkValidationRenewal() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isRenewal = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isRenewal) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' /* 필수 입력값을 입력해 주세요. */
            );
          }
        })
        .catch(() => {
          this.isRenewal = false;
        });
    },
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006' /* 저장되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.insertMod = false;
      this.renewalMod = 'C';
      this.safAttachFileGrp.onlyDownload = true;
      this.safAttachFileGrp.drag = false;
      this.safAttachFileGrp.showUploadBtn = false;
      this.safAttachFileGrp.multiple = true;
      this.safAttachFileGrp.disabled = true;

      this.attachFileGrp.onlyDownload = true;
      this.attachFileGrp.drag = false;
      this.attachFileGrp.showUploadBtn = false;
      this.attachFileGrp.multiple = false;
      this.attachFileGrp.disabled = true;

      this.sheDouc.sheDocuNo = _result.data.sheDocuNo;
      this.sheDouc.docuGrpNo = _result.data.docuGrpNo;
      this.sheDouc.useYn = _result.data.useYn;

      this.prevSheDouc = this.$_.cloneDeep(this.sheDouc);

      if (!this.popupParam.sheDocuNo) {
        this.safAttachFileGrp.taskKey = _result.data.sheDocuNo
          ? String(this.$_.clone(_result.data.sheDocuNo))
          : '';
        if (!this.attachFileGrp.taskKey) {
          this.attachFileGrp.taskKey = _result.data.docuGrpNo
            ? String(this.$_.clone(_result.data.docuGrpNo))
            : '';
        }
        this.safAttachFileGrp.submitCheck = !this.safAttachFileGrp.submitCheck;
        this.attachFileGrp.submitCheck = !this.attachFileGrp.submitCheck;
      }

      this.popupParam.sheDocuNo = _result.data.sheDocuNo;
      this.popupParam.docuGrpNo = _result.data.docuGrpNo;
      this.popupParam.taskKey = _result.data.sheDocuNo;

      // 신규등록일 경우 개정전 첨부파일 정보 복사
      this.beforeAttachFileGrp = this.$_.cloneDeep(this.safAttachFileGrp);
    },
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006' /* 저장되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      this.renewalMod = 'C';
      this.insertMod = false;

      this.safAttachFileGrp.onlyDownload = true;
      this.safAttachFileGrp.drag = false;
      this.safAttachFileGrp.showUploadBtn = false;
      this.safAttachFileGrp.multiple = true;
      this.safAttachFileGrp.disabled = true;

      this.attachFileGrp.onlyDownload = true;
      this.attachFileGrp.drag = false;
      this.attachFileGrp.showUploadBtn = false;
      this.attachFileGrp.multiple = false;
      this.attachFileGrp.disabled = true;

      this.safAttachFileGrp.submitCheck = !this.safAttachFileGrp.submitCheck;
      this.attachFileGrp.submitCheck = !this.attachFileGrp.submitCheck;
      this.prevSheDouc = this.$_.cloneDeep(this.sheDouc);

      // 삭제
      // 임시로 삭제한 문서가 있는 경우
      // 임시로 삭제한 문서가 있으면 다 끝난 후 임시로 삭제한 첨부파일이 있는지도 확인하여 지운다.
      if (this.safTempDeleteFiles.length) {
        this.$http.url = transactionConfig.safAttachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.safTempDeleteFiles)),
        };
        this.$http.request(
          (_result) => {
            this.safTempDeleteFiles = [];
            if (this.tempDeleteFiles.length) {
              this.$http.url = transactionConfig.attachFile.deleteMulti.url;
              this.$http.type = 'DELETE';
              this.$http.param = {
                data: Object.values(this.$_.clone(this.tempDeleteFiles)),
              };
              this.$http.request((_result) => {
                this.tempDeleteFiles = [];
              });
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
      // 임시로 삭제한 첨부파일이 있는 경우
      else if (this.tempDeleteFiles.length) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
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
    btnRenewalClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000631', // 개정되었습니다.
        type: 'success',
      });
      this.isRenewal = false;
      this.renewalMod = 'C';
      this.safAttachFileGrp.onlyDownload = true;
      this.attachFileGrp.onlyDownload = true;

      this.$_.extend(this.sheDouc, _result.data);
      this.prevSheDouc = this.$_.cloneDeep(this.sheDouc);

      this.safAttachFileGrp.taskKey = _result.data.sheDocuNo
        ? String(this.$_.clone(_result.data.sheDocuNo))
        : '';
      this.popupParam.taskKey = _result.data.sheDocuNo
        ? String(this.$_.clone(_result.data.sheDocuNo))
        : '';
      this.safAttachFileGrp.submitCheck = !this.safAttachFileGrp.submitCheck;
      this.attachFileGrp.submitCheck = !this.attachFileGrp.submitCheck;
      this.setUpdateMod('C');
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.isRenewal = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    setSafTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.safTempDeleteFiles.push(pushData);
    },
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
    },
    /**
     * 사용자의 입력을 받는다.
     */
  },
};
</script>

<style></style>
