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
            <!-- 도면파일 상세정보 -->
            <y-label
              label="L0000000956"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="insertMod && editable"
                :action-url="insertUrl"
                :param="diagram"
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
                :param="diagram"
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
                :param="diagram"
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
                :required="true"
                :disabled="!insertMod"
                :editable="editable"
                name="plantCd"
                v-model="diagram.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 도면번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :disabled="!insertMod"
                :maxlength="60"
                ui="bootstrap"
                label="L0000000953"
                name="diagramNo"
                v-model="diagram.diagramNo"
                v-validate="'required'"
                :state="validateState('diagramNo')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 도면명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :disabled="!insertMod"
                :maxlength="60"
                ui="bootstrap"
                label="L0000000952"
                name="diagTitle"
                v-model="diagram.diagTitle"
                v-validate="'required'"
                :state="validateState('diagTitle')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 변경발의번호 -->
              <y-text
                :width="8"
                :disabled="renewalMod === 'C'"
                :editable="editable"
                ui="bootstrap"
                label="L0000004754"
                name="chngNum"
                v-model="diagram.chngNum"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 개정사유 -->
              <y-textarea
                :width="10"
                :maxlength="100"
                :editable="editable"
                :disabled="renewalMod === 'C'"
                ui="bootstrap"
                label="L0000000294"
                name="revContents"
                v-model="diagram.revContents"
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
          </el-tab-pane>
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
              @setSubmitCheckFalse="setSubmitCheckFalse"
              @setSafTempDeleteFiles="setSafTempDeleteFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
              @setSafDeleteTempFileAll="setSafDeleteTempFileAll"
              @setDeleteTempFileAll="setDeleteTempFileAll"
            />
          </keep-alive>
        </el-tabs>
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
  name: 'saf-attach-file-dialog',
  props: {
    popupParam: {
      type: Object,
      default: {
        diagramSeq: 0,
        diagGrpNo: 0,
        taskKey: '',
        taskClassNm: '',
        taskFlag: '',
        diagClassCd: '',
        plantCd: '',
        data: {},
        editable: true,
        key1: 0,
      },
    },
  },
  data() {
    return {
      diagram: {
        diagramSeq: '',
        diagramNo: '',
        diagGrpNo: '',
        diagKindNo: 0,
        diagClassCd: '',
        plantCd: '',
        deptCd: '',
        processCd: '',
        diagTitle: '',
        revNum: 0,
        revYmd: '',
        diagContents: '',
        diagSysNum: '',
        diagSysUrl: '',
        revContents: '',
        useYn: '',
        delYn: '',
        createUserId: '',
        createDt: '',
        updateUserId: '',
        updateDt: '',
        selectRow: [],
        chngNum: '', // 변경발의번호
        safChngNo: 0,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '80%',
        top: '10px',
        closeCallback: null,
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
        label: 'L0000003030', // 파일업로드
        close: false,
        uploadCheck: false,
        limit: 999,
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
        multiple: false,
        label: 'L0000003030', // 파일업로드
        close: false,
        uploadCheck: false,
        limit: 999,
        // 파일 업로드 버튼 없을시 상태값 체크하여 파일 업로드 진행
        submitCheck: false,
        disabled: false,
        onlyDownload: false,
      },
      beforeAttachFileGrp: {
        taskClassNm: '',
        taskKey: '',
        taskFlag: '',
        isBefore: false,
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
      diagramNo: '',
      revNum: '',
      renewalMod: 'C',
      tabIndex: 0,
      component: null,
      paneName: '',
      editable: true,
      searchUrl: '',
      insertUrl: '',
      editUrl: '',
      renewalUrl: '',
      deleteUrl: '',
      isInsert: false,
      isEdit: false,
      isRenewal: false,
      editCheck: true,
      insertFlag: false,
      editFlag: false,
      insertMod: false,
      updateMod: false,
      multiFileUpload: false,
      safTempDeleteFiles: [],
      tempDeleteFiles: [],
      tempSafDeleteAll: false,
      tempDeleteAll: false,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    updateMod: {
      handler: function (val, oldVal) {
        if (val) {
          this.attachFileGrp.multiple = true;
          this.safAttachFileGrp.disabled = false;
          this.attachFileGrp.disabled = false;
        } else {
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
      this.searchUrl = selectConfig.diagramFile.get.url;
      this.insertUrl = transactionConfig.diagramFile.insert.url;
      this.renewalUrl = transactionConfig.diagramFile.insert.url;
      this.editUrl = transactionConfig.diagramFile.edit.url;

      if (this.popupParam.label === undefined) {
        this.popupParam.label = 'L0000002843'; // 첨부파일
      }
      this.tabItems = [
        {
          title: this.$comm.getLangSpecInfoLabel(this.popupParam.label),
          url: 'safFileUploadPage',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002843'),
          url: 'fileUploadPage',
        }, // 첨부파일
      ];

      this.setAttachFile();
    },
    setAttachFile() {
      this.attachFileGrp.createUserId = this.$store.getters.token;
      this.safAttachFileGrp.createUserId = this.$store.getters.token;

      this.safAttachFileGrp.taskClassNm = this.popupParam.taskClassNm;
      this.safAttachFileGrp.taskKey = this.popupParam.taskKey
        ? this.popupParam.taskKey
        : '';
      this.safAttachFileGrp.taskFlag = 'SAF';
      this.safAttachFileGrp.showUploadBtn = false;
      this.safAttachFileGrp.multiple = false;
      this.safAttachFileGrp.close = true;
      this.multiFileUpload = true;

      this.beforeAttachFileGrp = this.$_.clone(this.safAttachFileGrp);
      this.beforeAttachFileGrp.taskKey = this.popupParam.taskKey;
      this.beforeAttachFileGrp.isBefore = false;

      if (this.popupParam.key1 === 0) {
        this.diagram.diagClassCd = this.popupParam.diagClassCd;
        this.revNum = 0;
        this.diagramNo = '';

        this.insertMod = true;
        this.updateMod = true;
        this.revNum = 0;
      } else {
        this.safAttachFileGrp.drag = false;
        this.safAttachFileGrp.onlyDownload = true;
        this.safAttachFileGrp.disabled = true;
        this.attachFileGrp.disabled = true;

        this.diagram = this.$_.clone(this.popupParam.data);
        this.revNum = this.popupParam.data.revNum;
        this.diagramNo = this.popupParam.data.diagramNo;
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

      this.attachFileGrp = this.$_.clone(this.safAttachFileGrp);
      this.attachFileGrp.taskKey = this.popupParam.diagGrpNo
        ? String(this.popupParam.diagGrpNo)
        : '';
      this.attachFileGrp.taskFlag = '';
      this.attachFileGrp.limit = 999;
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
    setUpdateMod(flag) {
      this.renewalMod = flag;
      this.updateMod = true;
      this.safAttachFileGrp.drag = true;

      if (flag === 'R') {
        this.safAttachFileGrp.taskKey = '';

        this.tabItems = [
          {
            title: this.$comm.getLangSpecInfoLabel(this.popupParam.label),
            url: 'attachFile',
          },
          {
            title: this.$comm.getLangSpecInfoLabel('L0000002843'),
            url: 'fileUploadPage',
          }, // 첨부파일
        ];
        this.tabIndex = '0';
        this.component = () => import('@/pages/common/attachFile/attachFile');

        let nowDate = new Date();
        this.beforeAttachFileGrp.paneName = nowDate.getMilliseconds();
        this.$nextTick(() => {
          if (this.$refs.tab) {
            this.$refs.tab[0].getList();
            this.$refs.tab[0].searchAttachFile();
          }
        });

        this.attachFileGrp.showUploadBtn = false;
        this.attachFileGrp.multiple = true;
        this.attachFileGrp.drag = true;
        this.attachFileGrp.close = false;
        this.attachFileGrp.onlyDownload = false;
        this.safAttachFileGrp.onlyDownload = false;
      } else if (flag === 'M') {
        this.safAttachFileGrp.taskKey = this.popupParam.taskKey
          ? this.popupParam.taskKey
          : '';
        this.tabItems = [
          {
            title: this.$comm.getLangSpecInfoLabel(this.popupParam.label),
            url: 'safFileUploadPage',
          },
          {
            title: this.$comm.getLangSpecInfoLabel('L0000002843'),
            url: 'fileUploadPage',
          }, // 첨부파일
        ];
        this.tabIndex = '0';
        this.component = () =>
          import('@/pages/common/attachFile/safFileUploadPage');

        this.safAttachFileGrp.showUploadBtn = false;
        this.safAttachFileGrp.multiple = false;
        this.safAttachFileGrp.close = false;
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
        this.tempSafDeleteAll = false;
        this.tempDeleteAll = false;

        this.updateMod = false;
        this.safAttachFileGrp.taskKey = this.popupParam.taskKey
          ? this.popupParam.taskKey
          : '';
        this.tabItems = [
          {
            title: this.$comm.getLangSpecInfoLabel(this.popupParam.label),
            url: 'safFileUploadPage',
          },
          {
            title: this.$comm.getLangSpecInfoLabel('L0000002843'),
            url: 'fileUploadPage',
          }, // 첨부파일
        ];
        this.tabIndex = '0';
        let path = this.tabItems[this.tabIndex].url;
        this.component = () =>
          import('@/pages/common/attachFile/safFileUploadPage');
        // this.$nextTick(() => {
        //   this.$refs.tab.$refs.fileupload.getUploadedFileList();
        // })

        this.safAttachFileGrp.drag = false;
        this.safAttachFileGrp.showUploadBtn = false;
        this.safAttachFileGrp.multiple = false;
        this.safAttachFileGrp.close = true;
        this.safAttachFileGrp.onlyDownload = true;

        this.attachFileGrp.onlyDownload = true;
        this.attachFileGrp.showUploadBtn = false;
        this.attachFileGrp.multiple = false;
        this.attachFileGrp.drag = false;
        this.attachFileGrp.close = true;
        this.beforeAttachFileGrp.selectRow = [];

        this.safAttachFileGrp.disabled = true;
        this.attachFileGrp.disabled = true;

        this.diagram = this.$_.clone(this.popupParam.data); // 개정사유를 입력하고 왔을때 취소를 누르면 기존의 개정사유가 보여져야 한다.
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
    checkDiagram() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'POST';
      this.$http.param = this.diagram;
      this.$http.request(
        (_result) => {
          if (this.insertFlag) {
            if (_result.data === 0) {
              this.checkValidationInsert();
            } else {
              window.getApp.$emit(
                'APP_REQUEST_ERROR',
                'M0000000941' // 이미 등록된 도면 입니다.
              );
              this.insertFlag = false;
            }
          } else {
            if (_result.data === 0) {
              this.checkValidationEdit();
            } else {
              window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000941');
              this.editFlag = false;
            }
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
    beforeInsert() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000011', // 저장하시겠습니까?
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.diagram.createUserId = this.$store.getters.token;
          this.insertFlag = true;
          this.checkDiagram();
        },
      });
    },
    beforeEdit() {
      this.$validator.validateAll().then((_result) => {
        if (_result) {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321', // 확인
            message: 'M0000000011', // 저장하시겠습니까?
            type: 'info',
            confirmCallback: () => {
              this.diagram.updateUserId = this.$store.getters.token;
              this.checkValidationEdit();
            },
          });
        }
      });
    },
    beforeRenewal() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000166', // 개정하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.diagram.selectRow = this.beforeAttachFileGrp.selectRow;
          this.diagram.createUserId = this.$store.getters.token;
          this.diagram.updateUserId = this.$store.getters.token;
          this.checkValidationRenewal();
        },
        cancelCallback: () => {
          this.isRenewal = false;
        },
      });
    },
    checkValidationInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isInsert = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isInsert) {
            this.$popupRequired.check(
              'diagramFileDialog',
              this.$data,
              this.errors
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
            this.$popupRequired.check(
              'diagramFileDialog',
              this.$data,
              this.errors
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
            this.$popupRequired.check(
              'diagramFileDialog',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          this.isRenewal = false;
        });
    },
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.insertFlag = false;
      this.insertMod = false;
      this.renewalMod = 'C';
      this.updateMod = false;

      this.diagram.diagramSeq = _result.data.diagramSeq;
      this.diagram.diagGrpNo = _result.data.diagGrpNo;
      this.diagram.useYn = 'Y';

      if (
        this.uploadFiles.data.length === 0 &&
        this.safUploadFiles.data.length === 0
      ) {
        return;
      } else {
        this.attachFileGrp.submitCheck = !this.attachFileGrp.submitCheck;
      }

      if (!this.popupParam.key1) {
        this.safAttachFileGrp.taskKey = _result.data.diagramSeq
          ? String(this.$_.clone(_result.data.diagramSeq))
          : '';
        if (!this.attachFileGrp.taskKey) {
          this.attachFileGrp.taskKey = _result.data.diagGrpNo
            ? String(this.$_.clone(_result.data.diagGrpNo))
            : '';
        }

        this.safAttachFileGrp.submitCheck = !this.safAttachFileGrp.submitCheck;
        window.getApp.$emit('SAVE_FILES');
      } else {
        window.getApp.$emit('SAVE_FILES');
      }
    },
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;

      this.safAttachFileGrp.drag = false;
      this.safAttachFileGrp.showUploadBtn = false;
      this.safAttachFileGrp.multiple = false;
      this.safAttachFileGrp.close = true;
      this.safAttachFileGrp.onlyDownload = true;
      this.safAttachFileGrp.disabled = true;

      this.attachFileGrp.drag = false;
      this.attachFileGrp.showUploadBtn = false;
      this.attachFileGrp.multiple = false;
      this.attachFileGrp.close = true;
      this.attachFileGrp.onlyDownload = true;
      this.attachFileGrp.disabled = true;

      this.renewalMod = 'C';
      this.insertMod = false;
      this.attachFileGrp.onlyDownload = true;
      if (this.safUploadFiles.data.length > 0) {
        this.safAttachFileGrp.submitCheck = !this.safAttachFileGrp.submitCheck;
      } else if (this.uploadFiles.data.length > 0) {
        this.attachFileGrp.submitCheck = !this.attachFileGrp.submitCheck;
      }

      window.getApp.$emit('SAVE_FILES');

      // 삭제
      if (this.tempSafDeleteAll === true) {
        this.$http.url = transactionConfig.attachFile.deleteAll.url;
        this.$http.type = 'POST';
        this.$http.param = this.safAttachFileGrp;
        this.$http.request((_result) => {
          this.tempSafDeleteAll = false;
          if (this.tempDeleteAll === true) {
            this.$http.url = transactionConfig.attachFile.deleteAll.url;
            this.$http.type = 'POST';
            this.$http.param = this.attachFileGrp;
            this.$http.request((_result) => {
              this.tempDeleteAll = false;
            });
          }
          // 임시로 삭제한 첨부파일이 있는 경우
          else if (this.tempDeleteFiles.length > 0) {
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
        });
      } else if (this.tempDeleteAll === true) {
        this.$http.url = transactionConfig.attachFile.deleteAll.url;
        this.$http.type = 'POST';
        this.$http.param = this.attachFileGrp;
        this.$http.request(
          (_result) => {
            this.tempDeleteAll = false;
            // 임시로 삭제한 문서가 있는 경우
            // 임시로 삭제한 문서가 있으면 다 끝난 후 임시로 삭제한 첨부파일이 있는지도 확인하여 지운다.
            if (this.safTempDeleteFiles.length > 0) {
              this.$http.url = transactionConfig.safAttachFile.deleteMulti.url;
              this.$http.type = 'DELETE';
              this.$http.param = {
                data: Object.values(this.$_.clone(this.safTempDeleteFiles)),
              };
              this.$http.request((_result) => {
                this.safTempDeleteFiles = [];
              });
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        // 임시로 삭제한 문서가 있는 경우
        // 임시로 삭제한 문서가 있으면 다 끝난 후 임시로 삭제한 첨부파일이 있는지도 확인하여 지운다.
        if (this.safTempDeleteFiles.length > 0) {
          this.$http.url = transactionConfig.safAttachFile.deleteMulti.url;
          this.$http.type = 'DELETE';
          this.$http.param = {
            data: Object.values(this.$_.clone(this.safTempDeleteFiles)),
          };
          this.$http.request(
            (_result) => {
              this.safTempDeleteFiles = [];
              if (this.tempDeleteFiles.length > 0) {
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
        else if (this.tempDeleteFiles.length > 0) {
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

      this.$_.extend(this.diagram, _result.data);
      this.diagram.useYn = 'Y';
      if (this.beforeUploadFiles.data.length !== 0) {
        this.safAttachFileGrp.taskKey = _result.data.diagramSeq
          ? String(this.$_.clone(_result.data.diagramSeq))
          : '';
        this.popupParam.taskKey = _result.data.diagramSeq
          ? String(this.$_.clone(_result.data.diagramSeq))
          : '';
        // 일반 문서 올리는 vue 파일의 prop이랑 개정하는 vue 파일의 prop이랑 동일한변수를 사용해서 인지 현재 내가 보고 있는 vue 화면의 watch가 돌지 않음
        // 따라서 이와 같이 refs를 이용하여 업로드를 시킴
        // 개정은 뭐가 됬건 간에 완료가 되면 초기 상세 vue를 보이게 한다. (취소버튼을 강제로 누른다)
        this.safAttachFileGrp.submitCheck = !this.safAttachFileGrp.submitCheck;
      }
      // this.setUpdateMod('C');
    },
    btnClickedErrorCallback(_result) {
      this.insertFlag = false;
      this.isInsert = false;
      this.isEdit = false;
      this.isRenewal = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    setSubmitCheckFalse(data) {
      // if (data === 'safAttachFileGrp') {
      //   this.safAttachFileGrp.submitCheck = false;
      // } else if (data === 'attachFileGrp') {
      //   this.attachFileGrp.submitCheck = false;
      // }
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
    setSafDeleteTempFileAll() {
      this.tempSafDeleteAll = true;
    },
    setDeleteTempFileAll() {
      this.tempDeleteAll = true;
    },
    searchMoc() {
      this.popupOptions.param = {
        plantCd: this.diagram.plantCd,
        chngRefWorkCd: 'CGRW1',
      };
      this.popupOptions.target = () =>
        import(`${'@/pages/saf/change/changePop.vue'}`);
      this.popupOptions.title = 'L0000001221'; // 변경관리
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.closeCallback = this.closeMocPopup;
    },
    closeMocPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE') {
        this.diagram.chngNum = data.chngNum;
        this.diagram.safChngNo = data.safChngNo;
      }
    },
    removeMoc() {
      this.diagram.chngNum = '';
      this.diagram.safChngNo = 0;
    },
    /**
     * 사용자의 입력을 받는다.
     */
  },
};
</script>

<style></style>
