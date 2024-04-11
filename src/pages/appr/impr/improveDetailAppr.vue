<!--
  목적 : 개선상세
  Detail : 개선사항 상세 화면
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
            <!-- 조치요청 상세 정보 -->
            <y-label label="L0000002689" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="!disabled&&editable"
                :action-url="editUrl"
                :param="imprAct"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
              />
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
                <b-col v-if="imprAct.imprStepCd==='IMST1'">
                  <!-- 요청등록 ▷ 접수 ▷ 조치부서 조치 ▷ 개선완료 -->
                  <b>
                    <font color="blue">{{ $comm.getLangSpecInfoLabel('L0000002052') }}</font
                    >&nbsp;&nbsp;▷&nbsp;&nbsp;{{ $comm.getLangSpecInfoLabel('L0000002590') }}&nbsp;&nbsp;▷&nbsp;&nbsp;{{ $comm.getLangSpecInfoLabel('L0000002674') }}
                    &nbsp;&nbsp;▷&nbsp;&nbsp; {{ $comm.getLangSpecInfoLabel('L0000000262') }}
                  </b>
                </b-col>
                <b-col v-if="imprAct.imprStepCd==='IMSTA'">
                  <b>
                    <font color="blue">{{ $comm.getLangSpecInfoLabel('L0000002052') }}</font
                    >&nbsp;&nbsp;▷&nbsp;&nbsp;{{ $comm.getLangSpecInfoLabel('L0000002590') }}&nbsp;&nbsp;▷&nbsp;&nbsp;{{ $comm.getLangSpecInfoLabel('L0000002674') }}
                    &nbsp;&nbsp;▷&nbsp;&nbsp; {{ $comm.getLangSpecInfoLabel('L0000000262') }}
                  </b>
                </b-col>
                <b-col v-if="imprAct.imprStepCd==='IMST2'">
                  <b>
                    {{ $comm.getLangSpecInfoLabel('L0000002052') }}&nbsp;&nbsp;▷&nbsp;&nbsp;
                    <font color="blue">{{ $comm.getLangSpecInfoLabel('L0000002590') }}</font
                    >&nbsp;&nbsp;▷&nbsp;&nbsp;{{ $comm.getLangSpecInfoLabel('L0000002674') }}&nbsp;&nbsp;▷&nbsp;&nbsp;{{ $comm.getLangSpecInfoLabel('L0000000262') }}
                  </b>
                </b-col>
                <b-col v-if="imprAct.imprStepCd==='IMST3'">
                  <b>
                    {{ $comm.getLangSpecInfoLabel('L0000002052') }}&nbsp;&nbsp;▷&nbsp;&nbsp;{{ $comm.getLangSpecInfoLabel('L0000002590') }}&nbsp;&nbsp;▷&nbsp;&nbsp;
                    <font color="blue">{{ $comm.getLangSpecInfoLabel('L0000002674') }}</font>
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
                      <i class="el-icon-warning"></i>{{ $comm.getLangSpecInfoLabel('L0000002696') }}  </el-tag
                    >&nbsp;▷&nbsp;&nbsp;
                    <!-- 개선완료 -->
                    {{ $comm.getLangSpecInfoLabel('L0000000262') }}
                  </b>
                </b-col>
                <b-col v-if="imprAct.imprStepCd==='IMST5'">
                  <b>
                    {{ $comm.getLangSpecInfoLabel('L0000002052') }}&nbsp;&nbsp;▷&nbsp;&nbsp;{{ $comm.getLangSpecInfoLabel('L0000002590') }}&nbsp;&nbsp;▷&nbsp;&nbsp;{{ $comm.getLangSpecInfoLabel('L0000002674') }}&nbsp;&nbsp;▷&nbsp;&nbsp;
                    <font color="blue">{{ $comm.getLangSpecInfoLabel('L0000000262') }}</font>
                  </b>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!--  업무구분 -->
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
                    name="imprRqstUserNm"
                    v-model="imprRqstUserInfo"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 제목 -->
              <y-text
                :width="10"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002616"
                name="imprTitle"
                v-model="imprAct.imprTitle"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!--  조치 요청내용 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="true"
                label="L0000002665"
                ui="bootstrap"
                name="imprRqstContents"
                v-model="imprAct.imprRqstContents"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4">
                  <!-- 조치부서/조치자 -->
                  <y-label label="L0000002677" />
                </b-col>
                <b-col sm="4">
                  <y-select
                    :width="12"
                    :editable="editable"
                    :comboItems="comboDeptItems"
                    :disabled="true"
                    itemText="deptNm"
                    itemValue="deptCd"
                    ui="bootstrap"
                    name="actDeptCd"
                    v-model="imprAct.actDeptCd"
                  ></y-select>
                </b-col>
                <b-col sm="4">
                  <y-text
                    :editable="editable"
                    :width="12"
                    :clearable="true"
                    :disabled="true"
                    ui="bootstrap"
                    name="actUserNm"
                    v-model="imprAct.actUserNm"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4">
                  <!--  조치협력업체 -->
                  <y-label label="L0000002695" />
                </b-col>
                <b-col sm="8">
                  <y-text
                    :width="12"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="actDeptNm"
                    v-model="imprAct.actVendorNm"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 조치기한 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="true"
                label="L0000002670"
                type="today"
                name="actLimitYmd"
                v-model="imprAct.actLimitYmd"
              ></y-datepicker>
            </b-col>
            <!-- 개선전 -->
            <el-divider
              v-if="popupParam.imprClassCd === 'ICL02'"
              content-position="left"
              >{{ $comm.getLangSpecInfoLabel('L0000000273') }}</el-divider
            >
            <b-col
              v-if="imprAct.imprClassCd === 'ICL02'"
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
                    :disabled="true"
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
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="befInten"
                    v-model="imprAct.befInten"
                  ></y-number>
                </b-col>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <y-number
                    :width="12"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="befDegRisk"
                    v-model="imprAct.befDegRisk"
                  ></y-number>
                </b-col>
              </b-row>
            </b-col>
            <!-- 개선후 -->
            <el-divider
              v-if="popupParam.imprClassCd === 'ICL02'"
              content-position="left"
              >{{ $comm.getLangSpecInfoLabel('L0000000284') }}
            </el-divider>
            <b-col
              v-if="imprAct.imprClassCd === 'ICL02'"
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
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000001380"
                    name="aftFreq"
                    v-model="imprAct.aftFreq"
                  ></y-number>
                </b-col>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <y-number
                    :width="12"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    name="aftInten"
                    v-model="imprAct.aftInten"
                  ></y-number>
                </b-col>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <y-number
                    :width="12"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    name="aftDegRisk"
                    v-model="imprAct.aftDegRisk"
                  ></y-number>
                </b-col>
              </b-row>
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
        <b-row>
          <b-col sm="6">
            <y-file-upload
              ref="fileuploadBefore"
              :attach-file-grp="attachFileGrpBefore"
              :label="attachFileGrpBefore.label"
              :showUploadBtn="attachFileGrpBefore.showUploadBtn"
              :drag="attachFileGrpBefore.drag"
              :showFileSearch="false"
              :editable="editable&&!disabled"
              :multiple="true"
              :limit="5"
              :close="true"
              :onlyDownload="attachFileGrpBefore.disabled"
              :refresh="refresh1"
              :disabled="attachFileGrpBefore.disabled"
              :uploadTempFiles="attachFileGrpBefore.uploadTempFiles"
              :isCoverImage="true"
              @uploadFiles="safetyPlanUploadFiles"
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
              :drag="attachFileGrpAfter.drag"
              :showFileSearch="false"
              :editable="editable&&!disabled"
              :multiple="true"
              :limit="5"
              :close="true"
              :onlyDownload="attachFileGrpAfter.disabled"
              :refresh="refresh2"
              :disabled="attachFileGrpAfter.disabled"
              :uploadTempFiles="attachFileGrpAfter.uploadTempFiles"
              :isCoverImage="true"
              @uploadFiles="safetyPlanUploadFiles"
              @setUploadFileLength="setUploadFileLength2"
              @uploadedList="uploadedList2"
            ></y-file-upload>
          </b-col>
        </b-row>
        <el-tabs type="border-card" v-model="tabIndex" class="mt-3">
          <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ $comm.getLangSpecInfoLabel(item.title) }}
            </span>
          </el-tab-pane>
          <keep-alive>
            <component
              :is="component"
              v-if="component"
              :disabled="disabled"
              :imprAct.sync="imprAct"
              :attachFileGrp.sync="attachFileGrp"
              sm="12"
              :submitObject="submitObject"
              :attachFileGrps="attachFileGrp"
              :saveAttachFiles="safSaveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
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
  name: 'improve-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safImprActNo: 0,
      },
    },
  },
  data() {
    return {
      editable: true,
      imprAct: {
        safImprActNo: '',
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
        actVendorNm: '',
        actVendorCd: '',
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
        aftFreq: 0,
        aftInten: 0,
        aftDegRisk: 0,
        actVendorConfirmYn: '',
        apprRqstNo: 0,
        bizApprStepCd: '',
        bizApprStepNm: '',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '90%',
        top: '10px',
        closeCallback: null,
      },
      submitObject: {
        submitCheck: false,
      },
      attachFileGrp: [],
      safSaveAttachFiles: [],
      tabItems: [
        { title: 'L0000002671', url: 'improveContent' } /* 조치내용 */,
        // { title: '개선 전/후 사진', url: './improveImage' },
        { title: 'L0000002843', url: 'fileUploadPage' } /* 첨부파일 */,
      ],
      tabIndex: 0,
      component: null,
      searchUrl: '',
      editUrl: '',
      isEdit: false,
      isConfirm: false,
      isReturn: false,
      disabled: false,
      apprCheck: false,
      imprRqstUserInfo: '',
      immediateBeforeImage: '',
      immediateAfterImage: '',
      comboDeptItems: [],
      comboImprClassItems: [],
      // afterDisabled: false,
      showStepInfo: false,

      attachFileGrpBefore: {
        label: 'L0000000274' /* 개선전 사진 */,
        uploadTempFiles: null,
        taskClassNm: 'ACCTION_BEFORE',
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
      },
      attachFileGrpAfter: {
        label: 'L0000000285' /* 개선후 사진 */,
        uploadTempFiles: null,
        taskClassNm: 'ACCTION_AFTER',
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
      },
      countIndex1: 0,
      countIndex2: 0,
      countIndex3: 0,
      refresh1: false,
      refresh2: false,
      refresh3: false,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'imprAct.aftFreq'() {
      if (!this.imprAct.aftFreq) {
        // this.imprAct.aftFreq = 0;
        // this.imprAct.aftDegRisk = 0;
      } else {
        this.imprAct.aftDegRisk = this.imprAct.aftFreq * this.imprAct.aftInten;
      }
    },
    'imprAct.aftInten'() {
      if (!this.imprAct.aftInten) {
        // this.imprAct.aftInten = 0;
        // this.imprAct.aftDegRisk = 0;
      } else {
        this.imprAct.aftDegRisk = this.imprAct.aftFreq * this.imprAct.aftInten;
      }
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
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.saf.imprAct.get.url;
      this.editUrl = transactionConfig.saf.imprAct.edit.url;

      this.getDeptItems();
      // 개선분류코드
      this.$comm.getComboItems('SAF_IMPR_CLASS', false).then(_result => {
        this.comboImprClassItems = _result;
      });
      this.getList();
    },
    apprSave() {
      return new Promise((resolve) => {
        this.$validator
          .validateAll()
          .then(_result => {
            if (_result) {
              this.$http.url = this.editUrl;
              this.$http.param = this.imprAct;
              this.$http.type = "PUT";
              this.$http.request(
                _result => {
                  this.imprAct.createUserId = this.$store.getters.token;
                  this.imprAct.updateUserId = this.$store.getters.token;
                  resolve(true);
                },
                _error => {
                  resolve(false)
                }
              );

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
      })
    },
    getList() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.popupParam.safImprActNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          Object.assign(this.imprAct, _result.data);
          this.showStepInfo = this.imprAct.actVendorCd;
          this.imprRqstUserInfo =
            this.imprAct.imprRqstDeptNm + ' ' + this.imprAct.imprRqstUserNm;

          if (this.imprAct.imprStepCd === 'IMST5') {
            this.disabled = true;
          } else {
            this.disabled = false;
          }

          this.setAttachFile();
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setAttachFile() {
      let taskKey =
        this.popupParam.safImprActNo && this.popupParam.safImprActNo !== 0
          ? this.popupParam.safImprActNo.toString()
          : '';
      this.attachFileGrp = [
        {
          label: 'L0000003030' /* 파일업로드 */,
          drag: !this.disabled,
          editable: this.editable,
          disabled: this.disabled,
          limit: 5,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'ACCTION',
          taskKey: taskKey,
          taskFlag: '',
          onlyDownload: this.disabled,
          createUserId: this.$store.getters.token,
        },
      ];

      this.attachFileGrpBefore.taskKey = taskKey;
      this.attachFileGrpBefore.createUserId = this.$store.getters.token;

      this.attachFileGrpAfter.taskKey = taskKey;
      this.attachFileGrpAfter.createUserId = this.$store.getters.token;

      this.attachFileGrpBefore.disabled = this.disabled;
      this.attachFileGrpAfter.disabled = this.disabled;

      this.attachFileGrpBefore.drag = !this.disabled;
      this.attachFileGrpAfter.drag = !this.disabled;
    },
    getDeptItems() {
      this.$http.url = selectConfig.manage.dept.list.url;
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          _result.data.splice(0, 0, { deptCd: '', deptNm: this.$comm.getLangSpecInfoLabel('L0000003394') });
          this.comboDeptItems = this.$_.clone(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      if (path === 'fileUploadPage') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else this.component = () => import(`@/pages/impr/${path}`);
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
    beforeEdit() {
      if (this.tabDataCheck()) return;
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000011' /* 저장하시겠습니까? */,
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.imprAct.createUserId = this.$store.getters.token;
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
    tabDataCheck() {
      if (
        this.imprAct.imprStepCd === 'IMST3' &&
        this.imprAct.actResultContents === ''
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000005' /* 필수 입력값을 입력해 주세요. */,
          type: 'warning', // success / info / warning / error
        });
        return true;
      }
      return false;
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
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.attachFileGrp, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.attachFileGrp[index].uploadTempFiles = data;
        let saveIndex = this.$_.findIndex(this.safSaveAttachFiles, {
          taskClassNm: data.taskClassNm,
        });
        if (saveIndex > -1) {
          this.safSaveAttachFiles[saveIndex] = this.$_.clone(
            this.attachFileGrp[index]
          );
        } else {
          this.safSaveAttachFiles.push(
            this.$_.clone(this.attachFileGrp[index])
          );
        }
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
      }
    },
    saveAttach() {
      this.$refs['fileuploadBefore'].submitUpload();
      this.$refs['fileuploadAfter'].submitUpload();

      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrp, item => {
        item.taskKey = this.popupParam.safImprActNo;
      });

      // 저장할 데이터가 있는 경우
      if (this.safSaveAttachFiles.length > 0) {
        this.submitObject.submitCheck = !this.submitObject.submitCheck;
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
