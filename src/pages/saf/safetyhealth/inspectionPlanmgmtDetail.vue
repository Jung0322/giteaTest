<!--
  목적 : 점검계획 관리 상세
  작성자 : pkj
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 점검계획 관리 상세 -->
            <y-label
              label="L0000005238"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  editable &&
                  updateMode &&
                  apprMode &&
                  !this.popupParam.apprFlag
                "
                title="L0000003418"
                color="black"
                @btnClicked="beforeConfirm"
              />
              <!-- 임시저장 -->
              <y-btn
                v-if="updateMode && editable && apprMode"
                :action-url="editUrl"
                :param="inspectionPlan"
                :is-submit="isEdit"
                title="L0000004986"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeValidateChk('update')"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!updateMode && editable"
                :action-url="insertUrl"
                :param="inspectionPlan"
                :is-submit="isInsert"
                title="L0000004986"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeValidateChk('insert')"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="
                  editable &&
                  updateMode &&
                  apprMode &&
                  !this.popupParam.apprFlag
                "
                title="L0000001495"
                color="red"
                @btnClicked="deleteInfo"
              />
              <!-- 닫기 -->
              <y-btn
                v-if="!this.popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="closePopup"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :editable="editable && apprMode"
                :required="true"
                name="plantCd"
                v-model="inspectionPlan.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대상년도 -->
              <y-datepicker
                :editable="editable && apprMode"
                :width="8"
                type="year"
                name="year"
                label="L0000004449"
                :default="inspectionPlan.year"
                v-model="inspectionPlan.year"
                :required="true"
                v-validate="'required'"
                :state="validateState('year')"
              />
            </b-col>
            <!-- 주관부서 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-tree-dept
                label="L0000005015"
                name="mainDeptCd"
                v-model="inspectionPlan.mainDeptCd"
                :plantCd="inspectionPlan.plantCd"
                :required="true"
                :editable="editable && apprMode && deptEditable"
                v-validate="'required'"
                :state="validateState('mainDeptCd')"
              />
            </b-col>
            <!-- 구분 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :editable="editable && apprMode"
                :width="8"
                :comboItems="rsaRegRegdemItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000686"
                name="regRegdemCd"
                v-model="inspectionPlan.regRegdemCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('regRegdemCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검(계획)기간 -->
              <y-datepicker
                :editable="editable && apprMode"
                :width="8"
                :range="true"
                label="L0000005234"
                name="assessDt"
                v-model="inspectionPlan.assessDt"
                :required="true"
                v-validate="'required'"
                :state="validateState('assessDt')"
              ></y-datepicker>
            </b-col>

            <!-- 점검명 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :editable="editable && apprMode"
                :width="10"
                ui="bootstrap"
                label="L0000002551"
                name="chkNm"
                v-model="inspectionPlan.chkNm"
                :maxlength="50"
                :required="true"
                v-validate="'required'"
                :state="validateState('chkNm')"
              ></y-text>
            </b-col>
            <!-- 상세내용 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :editable="editable && apprMode"
                :width="10"
                :maxlength="1000"
                ui="bootstrap"
                name="chkDesc"
                label="상세내용"
                v-model="inspectionPlan.chkDesc"
                :rows="3"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <el-tabs type="border-card" v-model="tabIndex">
          <el-tab-pane
            v-for="(item, i) in tabItems"
            :key="i"
            stretch
            class="default-tab-pane"
          >
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ $comm.getLangSpecInfoLabel(item.title) }}
            </span>
          </el-tab-pane>
          <component
            v-show="tabIndex === '0'"
            :is="component"
            sm="12"
            :inspectionPlan.sync="inspectionPlan"
            :deptListLoad.sync="deptListLoad"
            :updateMode.sync="updateMode"
            :deptReLoad.sync="deptReLoad"
            :apprMode.sync="apprMode"
          />
          <component
            v-show="tabIndex === '1'"
            sm="12"
            :is="component1"
            :saveAttachFiles="saveAttachFiles"
            :attachFileGrps="attachFileGrps"
            :submitCheck="submitCheck"
            @changeUploadFiles="changeUploadFiles"
          />
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
  name: 'y-facility-mst-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        implChkPlanNo: 0,
      },
    },
  },
  data: () => ({
    inspectionPlan: {
      implChkPlanNo: 0,
      plantCd: '', // 사업장 코드
      year: '',
      regRegdemCd: '',
      chkNm: '',
      assessDt: null,
      chkStartDt: '',
      chkEndDt: '',
      chkDesc: '',
      mainDeptCd: '',
      procStepCd: 'RWRS1',
      inspectionSHDetp: [],
      createUserId: '',
      createDeptNm: '',
      createDeptCd: '',
      createPositionCd: '',
      createPositionNm: '',
      updatePositionCd: '',
      updatePositionNm: '',
      updateUserId: '',
      updateDeptNm: '',
      updateDeptCd: '',
      papprRqstNm: '',
      papprRqstNo: 0,
    },
    gridOptions: {
      header: [],
      data: [],
      height: '450',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '90%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    tabIndex: 0,
    tabItems: [
      {
        title: 'L0000000927',
      } /* 대상부서 */,
      { title: 'L0000002843', url: 'multiFileUpload' } /* 첨부파일 */,
    ],
    saveAttachFiles: [],
    attachFileGrps: [],
    submitCheck: false,
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    editUrl: '',
    insertUrl: '',
    deleteUrl: '',
    detailUrl: '',
    rsaRegRegdemItems: [], // 구분
    component: null,
    component1: null,
    deptListLoad: false,
    deptReLoad: false,
    apprMode: true,
    minDt: '',
    maxDt: '',
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
  }),
  watch: {
    'inspectionPlan.year': function (newVal, oldVal) {
      if (this.inspectionPlan.year) {
        this.minDt = this.inspectionPlan.year + '-01-01';
        this.maxDt = this.inspectionPlan.year + '-12-31';
        this.inspectionPlan.assessDt = [this.minDt, this.maxDt];
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },

  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.detailUrl = selectConfig.saf.inspection.get.url;
      this.editUrl = transactionConfig.saf.inspection.edit.url;
      this.insertUrl = transactionConfig.saf.inspection.insert.url;
      this.deleteUrl = transactionConfig.saf.inspection.delete.url;
      this.inspectionPlan.year = this.$comm.moment().format('YYYY');
      this.component = () => import(`${'./inspectionPlanmgmtDetailDeptList'}`);

      this.component1 = () =>
        import('@/pages/common/attachFile/multiFileUpload');

      this.$comm.getComboItems('RSA_REG_REGDEM', false).then((_result) => {
        this.rsaRegRegdemItems = _result;
      });
      if (!this.popupParam.implChkPlanNo) {
        let from = this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '-6m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        let to = this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '0y',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        this.inspectionPlan.assessDt = [from, to];
        this.inspectionPlan.mainDeptCd = this.$store.getters.deptCd;
        this.setAttachFileGrps();
      } else {
        this.inspectionPlan.implChkPlanNo = this.popupParam.implChkPlanNo;
      }

      // 권한별 컨트롤 처리
      if (this.$comm.isCompanyGrp()) {
        // 전사권한
        this.companyEditable = true;
        this.plantEditable = true;
        this.deptEditable = true;
      } else if (this.$comm.isPlantGrp()) {
        // 사업장권한
        this.plantEditable = true;
        this.deptEditable = true;
      }

      this.getDetail();
    },

    getDetail() {
      if (!this.inspectionPlan.implChkPlanNo) return;
      this.$http.url = this.$format(
        this.detailUrl,
        this.inspectionPlan.implChkPlanNo
      );
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.updateMode = true;

          this.inspectionPlan = _result.data;
          this.inspectionPlan.assessDt = [
            this.inspectionPlan.chkStartDt,
            this.inspectionPlan.chkEndDt,
          ];
          if (this.inspectionPlan.papprRqstNo === 0) {
            this.apprMode = true;
          } else if (
            this.inspectionPlan.papprRqstNm === '결재반려' ||
            this.inspectionPlan.papprRqstNm === '결재요청전' ||
            this.popupParam.apprFlag
          ) {
            this.apprMode = true;
          } else {
            this.apprMode = false;
          }
          this.setAttachFileGrps();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeValidateChk(flag) {
      this.deptListLoad = !this.deptListLoad;
      return new Promise((_resolve, _reject) => {
        if (!this.inspectionPlan.plantCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005081' /* 본문 사업장을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.inspectionPlan.year) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005132' /* 대상년도를 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.inspectionPlan.regRegdemCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005134' /* 구분을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (
          !this.inspectionPlan.assessDt[0] ||
          !this.inspectionPlan.assessDt[1]
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005135' /* 기간을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.inspectionPlan.mainDeptCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005136' /* 주관부서를 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.inspectionPlan.chkNm) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005235' /* 점검명을 입력해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (
          !this.inspectionPlan.inspectionSHDetp ||
          this.inspectionPlan.inspectionSHDetp.length <= 0
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 대상부서를 한건이상 등록해주세요.
            message:
              '[' +
              this.$comm.getLangSpecInfoLabel('L0000000927') +
              '] ' +
              this.$comm.getLangSpecInfoLabel('L0000005138'),
            type: 'warning',
          });
          _resolve(false);
          return;
        }

        if (
          this.inspectionPlan.year !==
            this.$comm.moment(this.inspectionPlan.assessDt[0]).format('YYYY') ||
          this.inspectionPlan.year !==
            this.$comm.moment(this.inspectionPlan.assessDt[1]).format('YYYY')
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message:
              'L0000005392' /* 대상년도와 점검(계획)기간이 일치 하지 않습니다. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }

        let checkDate = this.checkDeptList();
        if (!checkDate) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message:
              '[' +
              this.$comm.getLangSpecInfoLabel('L0000000927') +
              '] ' +
              this.$comm.getLangSpecInfoLabel('L0000005383'), // 대상부서에 점검일을 점검기간 이내로 입력해주세요.
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }

        _resolve(true);
        if (flag === 'insert') {
          this.nextInsert();
        } else {
          this.nextUpdate();
        }
      });
    },

    checkDeptList() {
      let flag = true;
      this.$_.forEach(this.inspectionPlan.inspectionSHDetp, (item) => {
        if (
          this.$comm.moment(item.chkStartDt).format('YYYY-MM-DD') <
            this.$comm
              .moment(this.inspectionPlan.assessDt[0])
              .format('YYYY-MM-DD') ||
          this.$comm.moment(item.chkStartDt).format('YYYY-MM-DD') >
            this.$comm
              .moment(this.inspectionPlan.assessDt[1])
              .format('YYYY-MM-DD')
        ) {
          flag = false;

          return;
        } else if (
          this.$comm.moment(item.chkEndDt).format('YYYY-MM-DD') <
            this.$comm
              .moment(this.inspectionPlan.assessDt[0])
              .format('YYYY-MM-DD') ||
          this.$comm.moment(item.chkEndDt).format('YYYY-MM-DD') >
            this.$comm
              .moment(this.inspectionPlan.assessDt[1])
              .format('YYYY-MM-DD')
        ) {
          flag = false;

          return;
        }
      });

      return flag;
    },
    nextInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: 'L0000005323',
              type: 'info',
              confirmCallback: () => {
                this.inspectionPlan.chkStartDt =
                  this.inspectionPlan.assessDt[0];
                this.inspectionPlan.chkEndDt = this.inspectionPlan.assessDt[1];
                this.inspectionPlan.createUserId = this.$store.getters.token;
                this.inspectionPlan.createDeptNm = this.$store.getters.deptNm;
                this.inspectionPlan.createDeptCd = this.$store.getters.deptCd;
                this.inspectionPlan.createPositionCd =
                  this.$store.getters.positionCd;
                this.inspectionPlan.createPositionNm =
                  this.$store.getters.positionNm;
                this.isInsert = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사도중 에러가 발생하였습니다.'
          );
        });
    },
    nextUpdate() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '점검계획 관리정보를 수정하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.inspectionPlan.chkStartDt =
                  this.inspectionPlan.assessDt[0];
                this.inspectionPlan.chkEndDt = this.inspectionPlan.assessDt[1];
                this.inspectionPlan.updateUserId = this.$store.getters.token;
                this.inspectionPlan.updateDeptNm = this.$store.getters.deptNm;
                this.inspectionPlan.updateDeptCd = this.$store.getters.deptCd;
                this.inspectionPlan.updatePositionCd =
                  this.$store.getters.positionCd;
                this.inspectionPlan.updatePositionNm =
                  this.$store.getters.positionNm;
                this.isEdit = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사도중 에러가 발생하였습니다.'
          );
        });
    },
    btnSaveClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      this.updateMode = true;
      this.saveAttach();
      this.getDetail();
      this.deptReLoad = !this.deptReLoad;
    },
    btnInsertClickedCallback(result) {
      this.inspectionPlan.implChkPlanNo = result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.updateMode = true;
      this.saveAttach();
      this.getDetail();
      // 저장 후 재 조회시 대상부서탭 우선조회되서 데이터 정합성 안맞는 현상처리
      setTimeout(() => {
        this.deptReLoad = !this.deptReLoad;
      }, 300);
    },
    deleteInfo() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000012', // '삭제하시겠습니까?',
          type: 'info',
          confirmCallback: () => {
            this.$http.url = this.$format(
              this.deleteUrl,
              this.inspectionPlan.implChkPlanNo
            );
            this.$http.type = 'DELETE';
            this.$http.request(
              (_result) => {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000007', // '삭제되었습니다.',
                  type: 'success',
                });
                this.closePopup();
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
        });
      });
    },
    btnClickedErrorCallback(result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', result);
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    setAttachFileGrps() {
      let taskKey = this.inspectionPlan.implChkPlanNo
        ? this.inspectionPlan.implChkPlanNo
        : ''; // 현 모델 키 값

      this.attachFileGrps = [
        {
          label: '파일업로드',
          drag: this.editable,
          showFileSearch: false,
          editable: this.editable && this.apprMode,
          disabled: !this.apprMode,
          uploadTempFiles: null,
          taskClassNm: 'INSPECTION_PLAN', // 현 화면의 첨부파일 키 값
          taskKey: taskKey,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.attachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.attachFileGrps[index].uploadTempFiles = data;

        // 업로드 하기 위해 올라온 파일들을 저장하는 부분
        // 기존에 들어가 있는 경우에는 덮어쓰고 아닌 경우에는 신규로 넣는다.
        let saveIndex = this.$_.findIndex(this.saveAttachFiles, {
          taskClassNm: data.taskClassNm,
        });
        if (saveIndex > -1) {
          this.saveAttachFiles[saveIndex] = this.$_.clone(
            this.attachFileGrps[index]
          );
        } else {
          this.saveAttachFiles.push(this.$_.clone(this.attachFileGrps[index]));
        }
      }
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.inspectionPlan.implChkPlanNo;
      });

      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitCheck = !this.submitCheck;
      }
    },
    beforeConfirm() {
      this.deptListLoad = !this.deptListLoad;
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000718',
        // 결재요청 전 저장됩니다. 진행하시겠습니까?
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          // 결재요청팝업 버튼 표시여부
          this.inspectionPlan.chkStartDt = this.inspectionPlan.assessDt[0];
          this.inspectionPlan.chkEndDt = this.inspectionPlan.assessDt[1];
          this.inspectionPlan.updateUserId = this.$store.getters.token;
          this.inspectionPlan.updateDeptNm = this.$store.getters.deptNm;
          this.inspectionPlan.updateDeptCd = this.$store.getters.deptCd;
          this.inspectionPlan.updatePositionCd = this.$store.getters.positionCd;
          this.inspectionPlan.updatePositionNm = this.$store.getters.positionNm;
          this.$http.url = this.editUrl;
          this.$http.type = 'PUT';
          this.$http.param = this.inspectionPlan;
          this.$http.request(
            (_result) => {
              this.popupOptions.target = () =>
                import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
              this.popupOptions.title = 'L0000003418'; // 결재요청
              this.popupOptions.visible = true;
              this.popupOptions.closeCallback = this.closeApprPop;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                apprBizCd: 'IS-PL-01',
                apprRqstNo: this.inspectionPlan.papprRqstNo,
                apprParams: {
                  implChkPlanNo: this.inspectionPlan.implChkPlanNo,
                },
              };
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    closeApprPop(data) {
      // 결재요청팝업 버튼 표시여부
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
      this.deptReLoad = !this.deptReLoad;
    },
  },
};
</script>
