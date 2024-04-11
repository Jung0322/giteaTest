<!--
  목적 : 조치부서 접수 및 확인
  Detail : 개선사항 접수 및 담당자 지정 화면
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
            <y-label
              label="L0000002688"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 개선요청취소 -->
              <y-btn
                v-if="editable && (isManager || isCancel)"
                title="L0000000272"
                color="red"
                @btnClicked="btnCancel"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!--  접수 -->
              <y-btn
                v-show="editable"
                :action-url="editUrl"
                :param="imprAct"
                :is-submit="isConfirm"
                title="L0000002590"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeConfirm"
                @beforeConfirm="beforeConfirm"
                @btnClicked="btnConfirmClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!--  저장 -->
              <y-btn
                v-if="editable"
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
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
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
                <b-col>
                  <!-- 요청등록 ▷ 접수 ▷ 조치부서 조치 ▷ 개선완료 -->
                  <b>
                    {{
                      $comm.getLangSpecInfoLabel('L0000002052')
                    }}&nbsp;&nbsp;▷&nbsp;&nbsp;
                    <font color="blue">{{
                      $comm.getLangSpecInfoLabel('L0000002590')
                    }}</font
                    >&nbsp;&nbsp;▷&nbsp;&nbsp;{{
                      $comm.getLangSpecInfoLabel('L0000002674')
                    }}&nbsp;&nbsp;▷&nbsp;&nbsp;
                    {{ $comm.getLangSpecInfoLabel('L0000000262') }}
                  </b>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 업무구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :disabled="true"
                :comboItems="comboImprClassItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001947"
                name="imprClassCd"
                v-model="imprAct.imprClassCd"
              ></y-select>
            </b-col>
            <!-- 작성일/작성자 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="3">
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- (사업장)-->
              <y-plant
                type="edit"
                :editable="editable"
                :disabled="true"
                name="plantCd"
                v-model="imprAct.plantCd"
              />
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
            <!--  조치 요청내용 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
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
              <!--  조치기한 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="disabled"
                label="L0000002670"
                type="today"
                name="actLimitYmd"
                :default="imprAct.actLimitYmd"
                v-model="imprAct.actLimitYmd"
              ></y-datepicker>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mb-3">
              <el-tag size="medium" type="info" class="float-right">
                <i class="el-icon-info"></i
                >{{ $comm.getLangSpecInfoLabel('L0000002693') }}
                <!-- 조치자 검색 팝업에서 검색조건이 입력된 사업장으로 설정됩니다. -->
              </el-tag>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-tree-dept
                name="actDeptCd"
                :disabled="true"
                :editable="editable"
                :label="actDeptTitle"
                :plantCd="imprAct.plantCd"
                v-model="imprAct.actDeptCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 조치자 -->
              <y-text
                :width="8"
                :editable="editable"
                :clearable="true"
                :disabled="true"
                :required="true"
                ui="bootstrap"
                label="L0000002692"
                name="actUserNm"
                v-model="imprAct.actUserNm"
                :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                @searchUser="btnSearchUserClicked"
                v-validate="validRequire ? 'required' : ''"
                :state="validRequire ? validateState('actUserNm') : ''"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-tree-dept
                name="preActDeptCd"
                :editable="editable"
                :disabled="actDeptDisabled"
                :showAllDept="true"
                :label="changeActDeptTitle"
                :plantCd="imprAct.plantCd"
                v-model="imprAct.preActDeptCd"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 조치부서변경사유 -->
              <y-textarea
                :width="10"
                :disabled="actDeptDisabled"
                :editable="editable"
                :maxlength="200"
                ui="bootstrap"
                label="L0000002678"
                name="actDeptChngContents"
                v-model="imprAct.actDeptChngContents"
              />
            </b-col>
            <!-- 조치협력업체 정보 -->
            <el-divider content-position="left">{{
              $comm.getLangSpecInfoLabel('L0000002698')
            }}</el-divider>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                name="actVendorNm"
                :label="actVendorTitle"
                v-model="imprAct.actVendorNm"
                :appendIcon="[{ icon: 'search', callbackName: 'searchVendor' }]"
                @searchVendor="searchVendor('act')"
              />
            </b-col>
            <b-col
              v-if="actVendorDisplay"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
              <y-text
                :width="8"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                name="actDeptNm"
                :label="changeActVendorTitle"
                v-model="imprAct.preActVendorNm"
                :appendIcon="[{ icon: 'search', callbackName: 'searchVendor' }]"
                @searchVendor="searchVendor('pre')"
              />
            </b-col>
            <b-col
              v-if="actVendorDisplay"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12"
            >
              <!-- 조치협력업체변경사유 -->
              <y-textarea
                :width="10"
                :disabled="actVendorDisabled"
                :editable="editable"
                :maxlength="200"
                ui="bootstrap"
                label="L0000003564"
                name="actVendorChngContents"
                v-model="imprAct.actVendorChngContents"
              />
            </b-col>
            <!-- 공정 및 세부위치 정보 -->
            <el-divider
              v-if="popupParam.imprClassCd === 'ICL03'"
              content-position="left"
              >{{ $comm.getLangSpecInfoLabel('L0000000517') }}</el-divider
            >
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
                :disabled="true"
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
                :disabled="true"
                ui="bootstrap"
                label="L0000001641"
                name="dtlLocat"
                v-model="imprAct.dtlLocat"
              ></y-text>
            </b-col>
            <!-- 개선전 -->
            <el-divider
              v-if="popupParam.imprClassCd === 'ICL02'"
              content-position="left"
              >{{ $comm.getLangSpecInfoLabel('L0000000273') }}</el-divider
            >
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
          </b-row>
        </b-card>
        <b-row class="mt-3">
          <b-col sm="12">
            <!--  첨부파일 -->
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
                :disabled="false"
                :uploadTempFiles="attachFileGrp.uploadTempFiles"
                @uploadFiles="safetyPlanUploadFiles"
                @closePopup="closePopupAccept"
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
  name: 'action-accept',
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
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '70%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
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
        preActDeptCd: '',
        preActDeptNm: '',
        actDeptChngContents: '',
        actVendorCd: '',
        actVendorNm: '',
        preActVendorCd: '',
        preActVendorNm: '',
        actVendorChngContents: '',
        changeActDeptCd: '',
        changeActDeptCause: '',
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
        actMgClsCd: null,
        actChangeYn: 'N', // 조치부서 변경여부
        stateCd: '',
      },
      attachFileGrp: {
        taskClassNm: 'ACCTION',
        taskKey: '',
        createUserId: '',
        showUploadBtn: false,
        drag: true,
        label: '',
        uploadTempFiles: null,
        disabled: false,
      },
      editable: false,
      searchUrl: '',
      editUrl: '',
      cancelUrl: '',
      isEdit: false,
      isConfirm: false,
      disabled: false,
      imprRqstUserInfo: '',
      immediateBeforeImage: '',
      immediateAfterImage: '',
      comboImprClassItems: [],
      actDeptTitle: 'L0000002673' /* 조치부서 */,
      changeActDeptTitle: 'L0000001235' /* 변경조치부서 */,
      actVendorTitle: 'L0000002695' /* 조치협력업체 */,
      changeActVendorTitle: 'L0000003549' /* 변경조치협력업체 */,
      actDeptDisabled: false,
      actVendorDisabled: false,
      actVendorDisplay: false,
      isManager: false,
      isCancel: false,
      deleteValue: null,
      btnStatus: 'save',
    };
  },
  computed: {
    /**
     * 2022.03.03 LHJ
     * 조치부서 변경시 저장만 가능하도록 권한 처리
     * 조치부서 변경 후 저장했거나 조치부서 변경을 하지 않은 경우 조치자 필수값 체크하도록 수정
     */
    validRequire() {
      return (
        ((this.imprAct.actChangeYn === 'Y' && this.imprAct.preActDeptCd) ||
          (this.imprAct.actChangeYn === 'N' && !this.imprAct.preActDeptCd)) &&
        this.btnStatus === 'complete'
      );
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
      this.cancelUrl = transactionConfig.saf.imprAct.cancel.url;

      this.isManager =
        this.$store.getters.userAuthGrps.filter(
          auth => String(auth.authGrpNo) === '1090' && auth.settingYn === 'Y'
        ).length > 0
          ? true
          : false;

      this.attachFileGrp.taskKey = this.popupParam.safImprActNo
        ? this.popupParam.safImprActNo.toString()
        : '';
      this.attachFileGrp.createUserId = this.$store.getters.token;

      // 개선분류코드
      this.$comm.getComboItems('SAF_IMPR_CLASS', false).then(_result => {
        this.comboImprClassItems = _result;
      });
      this.getDetail();
    },
    getDetail() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.popupParam.safImprActNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.$_.extend(this.imprAct, _result.data);
          this.imprRqstUserInfo =
            this.imprAct.imprRqstDeptNm + ' ' + this.imprAct.imprRqstUserNm;
          // 기존조치부서 코드가 있는 경우에
          if (this.imprAct.preActDeptCd) {
            this.actDeptDisabled = true;
            this.actDeptTitle = 'L0000001235'; /* 변경조치부서 */
            this.changeActDeptTitle = 'L0000003547'; /* 기존조치부서 */
          }
          // 기존조치협력업체 코드가 있는 경우에
          if (this.imprAct.preActVendorCd) {
            this.actVendorDisabled = true;
            this.actVendorTitle = 'L0000003549'; /* 변경조치협력업체 */
            this.changeActVendorTitle = 'L0000003548'; /* 기존조치협력업체 */
          }
          if (this.imprAct.actVendorCd) {
            this.actVendorDisplay = true;
          }
          if (
            String(this.$store.getters.token) === this.imprAct.imprRqstUserId
          ) {
            this.isCancel = true;
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.imprAct.plantCd, // 선택한 사업장의 정보가 따라서 조회되도록 설정
        deptCd: this.imprAct.actDeptCd, // 조치부서
      };
      this.popupOptions.title = 'L0000001466'; /* 사용자검색 */
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.imprAct.actUserId = data.user.userId;
        this.imprAct.actUserNm = data.user.userNm;

        /**
          2022.02.17 LHJ
          조치부서가 상위부서일 때 하위부서 조치자를 지정하였을 경우 하위부서를 조치부서로 지정
          현재 조치부서와 조치자의 부서가 다를 경우 조치자의 부서를 지정하도록 수정
         */
        if (this.imprAct.actDeptCd !== data.user.deptCd) {
          this.imprAct.actDeptCd = data.user.deptCd;
          this.imprAct.actDeptNm = data.user.deptNm;
        }
        // this.imprAct.actDeptCd = data.user.deptCd;
        // this.imprAct.actDeptNm = data.user.deptNm;
      }
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
    beforeCheck(isComplete, title) {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            let returnVal = true;
            if (this.imprAct.preActDeptCd) {
              if (!this.imprAct.actDeptChngContents) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395' /* 안내 */,
                  message: 'M0000000476' /* 조치부서변경사유를 입력하세요. */,
                  type: 'warning', // success / info / warning / error
                });
                returnVal = false;
              }

              /**
               * 2022.03.03 LHJ
               * 조치부서 변경 후 저장만 가능하도록 수정
               */
              if (
                this.imprAct.actChangeYn === 'N' &&
                String(isComplete) === '1'
              ) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395' /* 안내 */,
                  message:
                    'M0000001009' /* 조치부서 변경의 경우 저장 버튼을 눌러주시기 바랍니다. */,
                  type: 'warning', // success / info / warning / error
                });
                returnVal = false;
              }
            } else {
              if (this.imprAct.actDeptChngContents) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395' /* 안내 */,
                  message: 'M0000000477' /* 변경조치부서를 입력하세요. */,
                  type: 'warning', // success / info / warning / error
                });
                returnVal = false;
              }
            }
            if (returnVal) {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321' /* 확인 */,
                message:
                  this.$comm.getLangSpecInfoLabel(title) +
                  this.$comm.getLangSpecInfoMessage(
                    'M0000000097'
                  ) /* 하시겠습니까? */,
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.imprAct.createUserId = this.$store.getters.token;
                  this.imprAct.updateUserId = this.$store.getters.token;

                  // 변경조치부서가 선정되었을 시에 기존에 선정된 조치부서 정보를 기존조치부서 컬럼에 매핑한다.
                  if (this.imprAct.preActDeptCd && !this.actDeptDisabled) {
                    let tempActDeptCd = this.$_.clone(this.imprAct.actDeptCd);
                    this.imprAct.actDeptCd = this.$_.clone(
                      this.imprAct.preActDeptCd
                    );
                    this.imprAct.preActDeptCd = this.$_.clone(tempActDeptCd);
                    // 조치부서가 변경 되기때문에 조치자를 초기화한다.
                    this.imprAct.actUserId = '';
                    this.imprAct.actUserNm = '';
                  }
                  // 변경조치협력업체가 선정되었을 시에 기존에 선정된 조치협력업체 정보를 기존조치협력업체 컬럼에 매핑한다.
                  if (this.imprAct.preActVendorCd && !this.actVendorDisabled) {
                    let tempActVendorCd = this.$_.clone(
                      this.imprAct.actVendorCd
                    );
                    this.imprAct.actVendorCd = this.$_.clone(
                      this.imprAct.preActVendorCd
                    );
                    this.imprAct.preActVendorCd = this.$_.clone(
                      tempActVendorCd
                    );
                  }
                  if (isComplete === 1) {
                    this.imprAct.stateCd = 'IMPR2';
                    this.imprAct.imprStepCd = 'IMST3';
                    this.isConfirm = true;
                  } else {
                    this.isEdit = true;
                  }
                },
                cancelCallback: () => {},
              });
            }
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' /* 필수 입력값을 입력해 주세요. */
            );
          }
        })
        .catch(() => {
          this.isConfirm = false;
          this.isEdit = false;
        });
    },
    btnCancel(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message:
          'M0000000478' /* 해당 개선요청건을 취소처리시 삭제됩니다. 취소처리하시겠습니까? */,
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.cancelUrl,
            this.imprAct.safImprActNo
          );
          this.$http.type = 'PUT';
          this.$http.request(
            _result => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000479' /* 개선요청 취소되었습니다. */,
                type: 'success', // success / info / warning / error
              });
              this.closePopup();
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    beforeConfirm() {
      this.btnStatus = 'complete';
      // this.beforeCheck(1, 'L0000002590'); /* 접수 */
      setTimeout(() => {
        this.beforeCheck(1, 'L0000002590'); /* 접수 */
      }, 100);
    },
    beforeEdit() {
      this.btnStatus = 'save';
      // this.beforeCheck(0, 'L0000002474'); /* 저장 */
      setTimeout(() => {
        this.beforeCheck(0, 'L0000002474'); /* 저장 */
      }, 100);
    },
    btnConfirmClickedCallback(_result) {
      this.isConfirm = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000480' /* 접수되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.saveAttach();
    },
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006' /* 저장되었습니다 */,
        type: 'success', // success / info / warning / error
      });
      this.saveAttach();
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    closePopupAccept() {
      if (this.imprAct.imprStepCd === 'IMST3') {
        this.closePopup();
      }
    },
    btnClickedErrorCallback(_result) {
      this.isConfirm = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    searchVendor(gubun) {
      if (!this.editable || this.actVendorDisabled) return;
      if (gubun === 'act' && this.actVendorDisplay && !this.actVendorDisabled) {
        return;
      }
      this.popupOptions.target = () =>
        import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003246'; /* 협력업체 */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
        multiple: false,
        vendors: [],
        vendorTypeCd: 'CVET1', // 공사업체
      };
      if (gubun === 'act') {
        this.popupOptions.closeCallback = this.closeVendorPopup;
      } else {
        this.popupOptions.closeCallback = this.closePreVendorPopup;
      }
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data === 'C') return;

      this.imprAct.actVendorCd = data.data.vendorCd;
      this.imprAct.actVendorNm = data.data.vendorNm;
    },
    closePreVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data === 'C') return;

      this.imprAct.preActVendorCd = data.data.vendorCd;
      this.imprAct.preActVendorNm = data.data.vendorNm;
    },
    safetyPlanUploadFiles(data, taskClassNm, attachFileGrp) {
      let inputData = {
        data: data,
      };

      this.attachFileGrp.uploadTempFiles = inputData;
    },
    saveAttach() {
      this.$refs['fileupload'].submitUpload();
      this.getDetail();
    },
  },
};
</script>
