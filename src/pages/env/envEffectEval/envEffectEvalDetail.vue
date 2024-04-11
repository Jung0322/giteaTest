<!--
  목적 : 환경 > 환경영향평가 > 환경영향평가 목록 > 등록/수정/조회 페이지
  Detail : 등록/수정/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 기본 정보 -->
            <y-label
              label="L0000000776"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 평가완료 -->
              <y-btn
                v-if="
                  !evalComplete &&
                  editable &&
                  this.popupParam.envEffectEvalNo &&
                  !insertMode &&
                  !updateMode &&
                  !this.popupParam.popupMode
                "
                :action-url="saveUrl"
                :param="envEffectEval"
                :is-submit="isComplete"
                title="L0000004735"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeComplete"
                @beforeComplete="beforeComplete"
                @btnClicked="btnCompleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="
                  ((updateMode && editable) || insertMode) &&
                  !this.popupParam.popupMode
                "
                :action-url="saveUrl"
                :param="envEffectEval"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 수정 -->
              <y-btn
                v-if="
                  !updateMode &&
                  editable &&
                  !insertMode &&
                  !evalComplete &&
                  !this.popupParam.popupMode
                "
                title="L0000001696"
                color="orange"
                @btnClicked="btnUpdateMode"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="
                  updateMode &&
                  editable &&
                  !insertMode &&
                  !this.popupParam.popupMode
                "
                color="red"
                title="L0000001495"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 취소 -->
              <y-btn
                v-if="updateMode && editable && !insertMode"
                title="L0000002920"
                @btnClicked="btnCancel"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-card>
          <b-row>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
              <!--사업장-->
              <y-plant
                type="edit"
                :required="true"
                :editable="(insertMode || updateMode) && editable"
                :disabled="!(insertMode || updateMode)"
                name="plantCd"
                v-model="envEffectEval.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <!--        주관부서-->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                name="deptNm"
                label="L0000002713"
                :editable="(insertMode || updateMode) && editable"
                v-model="envEffectEval.deptNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('deptNm')"
                :appendIcon="[
                  { icon: 'times', callbackName: 'clear' },
                  { icon: 'search', callbackName: 'searchDept' },
                ]"
                @searchDept="searchDept"
                @clear="clearDept"
              />
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
              <!-- 평가구분 -->
              <y-select
                :width="8"
                :comboItems="evalGubunCombos"
                itemText="codeNm"
                itemValue="code"
                :editable="(insertMode || updateMode) && editable"
                ui="bootstrap"
                label="L0000003059"
                name="evalGubun"
                v-model="envEffectEval.evalGubun"
                :required="true"
                v-validate="'required'"
                :state="validateState('evalGubun')"
              ></y-select>
            </b-col>
            <!-- 평가대행 여부 , 해당/미해당 -->
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
              <y-switch
                :width="8"
                :editable="(insertMode || updateMode) && editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                :label="$comm.getLangSpecInfoLabel('L0000004736')"
                name="radioValue"
                selectText="L0000003213"
                unselectText="L0000001065"
                v-model="envEffectEval.proxyYn"
                :required="true"
                v-validate="'required'"
                :state="validateState('proxyYn')"
              />
            </b-col>
            <template v-if="envEffectEval.proxyYn === 'Y'">
              <!--        대행업체-->
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
                <y-text
                  :width="8"
                  :disabled="true"
                  :editable="(insertMode || updateMode) && editable"
                  ui="bootstrap"
                  name="vendorNm"
                  label="L0000004734"
                  v-model="envEffectEval.proxyVendorNm"
                  :appendIcon="[
                    { icon: 'times', callbackName: 'clear' },
                    { icon: 'search', callbackName: 'searchVendor' },
                  ]"
                  @searchVendor="searchVendor"
                  @clear="clearVendor"
                />
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
                <!-- 진행상태 -->
                <y-text
                  :editable="false"
                  :width="8"
                  ui="bootstrap"
                  label="L0000002779"
                  name="evalProgState"
                  v-model="envEffectEval.evalProgState"
                ></y-text>
              </b-col>
              <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-3">
                <!-- 사업명 -->
                <y-text
                  :width="10"
                  ui="bootstrap"
                  label="L0000004732"
                  :editable="(insertMode || updateMode) && editable"
                  name="businessName"
                  v-model="envEffectEval.businessName"
                  :required="true"
                  v-validate="'required'"
                  :state="validateState('businessName')"
                ></y-text>
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
                <!-- 진행단계 -->
                <y-text
                  :editable="false"
                  :width="8"
                  ui="bootstrap"
                  label="L0000002777"
                  name="evalStepNm"
                  v-model="envEffectEval.evalStepNm"
                ></y-text>
              </b-col>
            </template>
            <template v-if="envEffectEval.proxyYn === 'N'">
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
                <!-- 진행상태 -->
                <y-text
                  :editable="false"
                  :width="8"
                  ui="bootstrap"
                  label="L0000002779"
                  name="evalProgState"
                  v-model="envEffectEval.evalProgState"
                ></y-text>
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-6">
                <!-- 진행단계 -->
                <y-text
                  :editable="false"
                  :width="8"
                  ui="bootstrap"
                  label="L0000002777"
                  name="evalStepNm"
                  v-model="envEffectEval.evalStepNm"
                ></y-text>
              </b-col>
              <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-3">
                <!-- 사업명 -->
                <y-text
                  :width="10"
                  ui="bootstrap"
                  label="L0000004732"
                  :editable="(insertMode || updateMode) && editable"
                  name="businessName"
                  v-model="envEffectEval.businessName"
                  :required="true"
                  v-validate="'required'"
                  :state="validateState('businessName')"
                ></y-text>
              </b-col>
            </template>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
              <!-- 사업기간 -->
              <y-datepicker
                :width="8"
                :editable="(insertMode || updateMode) && editable"
                :disabled="!(insertMode || updateMode)"
                :range="true"
                label="L0000004737"
                name="period"
                v-model="envEffectEval.period"
                :required="true"
                v-validate="'required'"
                :state="validateState('period')"
              ></y-datepicker>
            </b-col>
            <!-- 사업내용 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-textarea
                :width="11"
                :editable="(insertMode || updateMode) && editable"
                :maxlength="2000"
                ui="bootstrap"
                label="L0000004738"
                name="envBusinessContents"
                v-model="envEffectEval.businessContents"
                :required="true"
                v-validate="'required'"
                :state="validateState('businessContents')"
              ></y-textarea>
              <el-divider content-position="left">{{
                $comm.getLangSpecInfoLabel('L0000002843')
              }}</el-divider>
              <component
                :is="attach"
                v-if="attach"
                :submitCheck="submitCheck"
                :attachFileGrps="attachFileGrps"
                :saveAttachFiles="saveAttachFiles"
                @changeUploadFiles="changeUploadFiles"
                @setTempDeleteFiles="setTempDeleteFiles"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <el-tabs
      class="envEffectTabs"
      @tab-click="setTabParam"
      type="border-card"
      v-model="tabIndex"
      v-if="envEffectEval.envEffectEvalNo"
    >
      <el-tab-pane
        v-for="(item, i) in tabItems"
        :key="i"
        stretch
        :name="envEffectEval.evalGubun === '2' ? String(8) : String(i)"
        class="default-tab-pane"
      >
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ item.title }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          sm="12"
          :envEffectEval.sync="envEffectEval"
          :popupParam.sync="popupParam"
          :popopMode.sync="popupParam.popupMode"
          :tabParam.sync="tabParam"
          :submitCheck="submitCheck"
          :attachFileGrps.sync="attachFileGrps"
          :saveAttachFiles.sync="saveAttachFiles"
          ref="envTab"
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
        />
      </keep-alive>
    </el-tabs>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'envEffectEvalDetail',
  props: {
    popupMode: false,
    popupParam: {
      type: Object,
      default: function () {
        return { envEffectEvalNo: 0 }; // 번호
      },
    },
  },
  data() {
    return {
      envEffectEval: {
        envEffectEvalNo: 0,
        plantCd: '',
        deptCd: '',
        deptNm: '',
        evalGubun: '1',
        evalProgState: '',
        evalProgStateCd: '',
        evalStepCd: '',
        evalStepNm: '',
        proxyVendorCd: '',
        proxyVendorNm: '',
        proxyYn: 'N',
        businessName: '',
        businessStartDt: '',
        businessEndDt: '',
        businessContents: '',
        objectConfirmContent: '',
        evalPrepCont: '',
        evalDeterCont: '',
        draftCont: '',
        draftNoticeCont: '',
        residentOpnAccept: '',
        residentExplCont: '',
        residentHearCont: '',
        evalAgendaWrite: '',
        evalAgendaDiscuss: '',
        evalAgendaReflect: '',
        createUserId: '',
        createDt: '',
        updateUserId: '',
        updateDt: '',
        writerUserNm: '',
        writerDt: '',
        period: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      evalStepCombos: [],
      evalGubunCombos: [],
      evalProgStateCombos: [],

      tabItems: [],
      component: null,
      tabIndex: 0,
      tabParam: 0,
      isComplete: false,
      isSave: false,
      saveUrl: '',
      deleteUrl: '',
      actionType: 'POST',
      updateMode: false,

      attach: null, // 첨부파일컴포넌트
      attachFileGrp: {
        taskClassNm: '',
        taskKey: '',
        createUserId: '',
        showUploadBtn: true,
        editable: true,
        multiple: true,
        drag: true,
        label: '',
      },
      submitCheck: false,
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],
    };
  },
  computed: {
    insertMode: function () {
      return (
        !this.popupParam.envEffectEvalNo && !this.envEffectEval.envEffectEvalNo
      );
    },
    evalComplete: function () {
      return this.envEffectEval.evalProgState === '평가완료';
    },
  },
  watch: {
    tabIndex: function (newValue, oldValue) {
      this.loadComponent();
    },
    updateMode: 'setAttachFileGrps',
    'envEffectEval.period': {
      deep: true,
      handler(newVal, oldVal) {
        this.envEffectEval.businessStartDt = newVal[0];
        this.envEffectEval.businessEndDt = newVal[1];
      },
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    window.getApp.$on('getEnvEffectEvalDetail', this.getEnvEffectEvalDetail);
    window.getApp.$on(
      'updateEnvEffectEvalContent',
      this.updateEnvEffectEvalContent
    );
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.deleteUrl =
        transactionConfig.env.envEffectEval.envEffectEval.delete.url;

      var today = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        today,
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to = this.$comm.getCalculatedDate(
        today,
        '1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.envEffectEval.period = [from, to];

      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps();

      this.getComboItems('EVAL_STEP_CD');
      this.getComboItems('EVAL_GUBUN');
      this.getComboItems('EVAL_PROG_STATE');
      if (this.popupParam.envEffectEvalNo) {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.env.envEffectEval.envEffectEval.get.url,
        this.popupParam.envEffectEvalNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.envEffectEval = _result.data;
          this.envEffectEval.period = [
            _result.data.businessStartDt,
            _result.data.businessEndDt,
          ];

          if (this.envEffectEval.evalGubun === '2') {
            this.tabItems = [
              {
                title: this.$comm.getLangSpecInfoLabel('L0000004779'),
                url: './envEffectEvalTabs',
              }, // 환경영향평가(본안) 작성
            ];
            this.tabParam = 8;
          } else {
            this.tabItems = [
              {
                title: this.$comm.getLangSpecInfoLabel('L0000004739'),
                url: './envEffectEvalTabs',
              }, // 대상여부확인
              {
                title: this.$comm.getLangSpecInfoLabel('L0000004741'),
                url: './envEffectEvalTabs',
              }, // 평가준비서 작성
              {
                title: this.$comm.getLangSpecInfoLabel('L0000004750'),
                url: './envEffectEvalTabs',
              }, // 평가항목 결정 공개
              {
                title: this.$comm.getLangSpecInfoLabel('L0000004778'),
                url: './envEffectEvalTabs',
              }, // 환경영향평가(초안) 작성
              {
                title: this.$comm.getLangSpecInfoLabel('L0000004782'),
                url: './envEffectEvalTabs',
              }, // 환경영향평가(초안) 공고 공람
              {
                title: this.$comm.getLangSpecInfoLabel('L0000004747'),
                url: './envEffectEvalTabs',
              }, // 주민 등의 의견 수렴
              {
                title: this.$comm.getLangSpecInfoLabel('L0000004746'),
                url: './envEffectEvalTabs',
              }, // 주민설명회 개최
              {
                title: this.$comm.getLangSpecInfoLabel('L0000004745'),
                url: './envEffectEvalTabs',
              }, // 주민공청회 개최
              {
                title: this.$comm.getLangSpecInfoLabel('L0000004779'),
                url: './envEffectEvalTabs',
              }, // 환경영향평가(본안) 작성
              {
                title: this.$comm.getLangSpecInfoLabel('L0000004780'),
                url: './envEffectEvalTabs',
              }, // 환경영향평가(본안) 협의
              {
                title: this.$comm.getLangSpecInfoLabel('L0000004781'),
                url: './envEffectEvalTabs',
              }, // 환경영향평가(본안) 협의의견 반영
            ];
          }
          this.$nextTick(function () {
            // this.tabIndex = Number(this.tabIndex);

            if (this.envEffectEval.evalGubun === '2') {
              this.tabIndex = '8';
            } else {
              if (this.envEffectEval.evalAgendaReflect) {
                this.tabIndex = '10';
              }

              if (this.envEffectEval.evalAgendaDiscuss) {
                this.tabIndex = '9';
              }

              if (this.envEffectEval.evalAgendaWrite) {
                this.tabIndex = '8';
              }

              if (this.envEffectEval.residentHearCont) {
                this.tabIndex = '7';
              }

              if (this.envEffectEval.residentExplCont) {
                this.tabIndex = '6';
              }

              if (this.envEffectEval.residentOpnAccept) {
                this.tabIndex = '5';
              }

              if (this.envEffectEval.draftNoticeCont) {
                this.tabIndex = '4';
              }

              if (this.envEffectEval.draftCont) {
                this.tabIndex = '3';
              }

              if (this.envEffectEval.evalDeterCont) {
                this.tabIndex = '2';
              }

              if (this.envEffectEval.evalPrepCont) {
                this.tabIndex = '1';
              }
            }

            // this.tabIndex =
            //   this.envEffectEval.evalGubun === '2'
            //     ? 8
            //     : this.envEffectEval.evalAgendaReflect
            //     ? 10
            //     : this.envEffectEval.evalAgendaDiscuss
            //     ? 9
            //     : this.envEffectEval.evalAgendaWrite
            //     ? 8
            //     : this.envEffectEval.residentHearCont
            //     ? 7
            //     : this.envEffectEval.residentExplCont
            //     ? 6
            //     : this.envEffectEval.residentOpnAccept
            //     ? 5
            //     : this.envEffectEval.draftNoticeCont
            //     ? 4
            //     : this.envEffectEval.draftCont
            //     ? 3
            //     : this.envEffectEval.evalDeterCont
            //     ? 2
            //     : this.envEffectEval.evalPrepCont
            //     ? 1
            //     : Number(this.tabIndex);

            // console.log('2222', this.tabIndex);

            this.tabParam = Number(this.tabIndex);
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEnvEffectEvalDetail() {
      this.$http.url = this.$format(
        selectConfig.env.envEffectEval.envEffectEval.get.url,
        this.popupParam.envEffectEvalNo
      );
      this.$http.type = 'GET';
      this.$http.request((_result) => {
        this.envEffectEval.evalStepNm = _result.data.evalStepNm;
      });
    },
    setTabParam(obj, e) {
      this.tabParam = this.envEffectEval.evalGubun === '2' ? 8 : obj.$vnode.key;
    },
    loadComponent() {
      let path = this.tabItems[this.tabIndex].url;
      this.component = () => import(`${path}`);
    },
    setAttachFileGrps() {
      let taskKey = this.popupParam.envEffectEvalNo
        ? this.popupParam.envEffectEvalNo.toString()
        : this.envEffectEval.envEffectEvalNo
          ? this.envEffectEval.envEffectEvalNo.toString()
          : '';
      this.attachFileGrps = [
        {
          label: 'L0000003030', // 파일업로드
          uploadTempFiles: null,
          taskClassNm: 'ENV_EFFECT_EVAL',
          taskKey: taskKey,
          drag: false,
          showFileSearch: this.updateMode,
          editable: this.updateMode || this.insertMode,
          disabled: false,
          onlyDownload: !(this.updateMode || this.insertMode),
          createUserId: this.$store.getters.token,
        },
      ];
    },
    searchDept(_item) {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000004627'; // 부서 검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '35%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchDept;
    },
    closePopupSearchDept(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.dept) {
        this.envEffectEval.deptCd = data.dept.deptCd;
        this.envEffectEval.deptNm = data.dept.deptNm;
      }
    },
    clearDept() {
      this.envEffectEval.deptCd = null;
      this.envEffectEval.deptNm = null;
    },
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'EVAL_STEP_CD') {
            this.evalStepCombos = this.$_.clone(_result.data);
            this.evalStepCombos.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); /* 전체 */
          }
          if (codeGroupCd === 'EVAL_GUBUN') {
            this.evalGubunCombos = this.$_.clone(_result.data);
          }
          if (codeGroupCd === 'EVAL_PROG_STATE') {
            this.evalProgStateCombos = this.$_.clone(_result.data);
            this.evalProgStateCombos.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); /* 전체 */
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    searchVendor() {
      this.popupOptions.target = () =>
        import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000004283'; // 협력업체 검색
      this.popupOptions.param = {
        plantCd: this.envEffectEval.plantCd,
        popupMode: true,
        multiSelect: false,
      };
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.envEffectEval.proxyVendorCd = data.data.vendorCd;
      this.envEffectEval.proxyVendorNm = data.data.vendorNm;
    },
    clearVendor() {
      this.envEffectEval.proxyVendorCd = null;
      this.envEffectEval.proxyVendorNm = null;
    },
    beforeEdit() {
      this.envEffectEval.businessStartDt = this.envEffectEval.period[0];
      this.envEffectEval.businessEndDt = this.envEffectEval.period[1];
      if (
        !this.popupParam.envEffectEvalNo &&
        !this.envEffectEval.envEffectEvalNo
      ) {
        this.saveUrl =
          transactionConfig.env.envEffectEval.envEffectEval.insert.url;
        this.actionType = 'POST';
      } else {
        this.saveUrl =
          transactionConfig.env.envEffectEval.envEffectEval.editBasicInfo.url;
        this.actionType = 'PUT';
      }
      this.saveCheckResult(0, this.$comm.getLangSpecInfoLabel('L0000002474')); // 저장
    },
    beforeComplete() {
      this.saveUrl =
        transactionConfig.env.envEffectEval.envEffectEval.editBasicInfo.url;
      this.saveCheckResult(
        true,
        this.$comm.getLangSpecInfoLabel('L0000002039')
      ); // 완료
    },
    saveCheckResult(completeable, alertTitle) {
      this.$validator
        .validateAll()
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message:
                alertTitle + this.$comm.getLangSpecInfoMessage('M0000000097'), // 하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.envEffectEval.createUserId = this.$store.getters.token;
                this.envEffectEval.updateUserId = this.$store.getters.token;
                if (completeable) {
                  this.envEffectEval.evalProgState = '2';
                  this.isComplete = true;
                } else {
                  this.isSave = true;
                }
              },
              // 취소 callback 함수
              cancelCallback: () => {
                this.isSave = false;
                this.isComplete = false;
              },
            });
          } else {
            this.$popupRequired.check(
              'envEffectEvalDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isSave = false;
          this.isComplete = false;
        });
    },
    btnCompleteClickedCallback() {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000078' /* 완료되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.isComplete = false;
      this.getDetail();
    },
    btnSaveClickedCallback(_result) {
      this.envEffectEval.envEffectEvalNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
      if (this.envEffectEval.evalGubun === '2') {
        this.tabItems = [
          {
            title: this.$comm.getLangSpecInfoLabel('L0000004779'),
            url: './envEffectEvalTabs',
          }, // 환경영향평가(본안)작성
        ];
        this.tabParam = 8;
      } else {
        this.tabItems = [
          {
            title: this.$comm.getLangSpecInfoLabel('L0000004739'),
            url: './envEffectEvalTabs',
          }, // 대상여부확인
          {
            title: this.$comm.getLangSpecInfoLabel('L0000004741'),
            url: './envEffectEvalTabs',
          }, // 평가준비서 작성
          {
            title: this.$comm.getLangSpecInfoLabel('L0000004750'),
            url: './envEffectEvalTabs',
          }, // 평가항목 결정 공개
          {
            title: this.$comm.getLangSpecInfoLabel('L0000004778'),
            url: './envEffectEvalTabs',
          }, // 환경영향평가(초안) 작성
          {
            title: this.$comm.getLangSpecInfoLabel('L0000004782'),
            url: './envEffectEvalTabs',
          }, // 환경영향평가(초안) 공고 공람
          {
            title: this.$comm.getLangSpecInfoLabel('L0000004747'),
            url: './envEffectEvalTabs',
          }, // 주민 등의 의견 수렴
          {
            title: this.$comm.getLangSpecInfoLabel('L0000004746'),
            url: './envEffectEvalTabs',
          }, // 주민설명회 개최
          {
            title: this.$comm.getLangSpecInfoLabel('L0000004745'),
            url: './envEffectEvalTabs',
          }, // 주민공청회 개최
          {
            title: this.$comm.getLangSpecInfoLabel('L0000004779'),
            url: './envEffectEvalTabs',
          }, // 환경영향평가(본안) 작성
          {
            title: this.$comm.getLangSpecInfoLabel('L0000004780'),
            url: './envEffectEvalTabs',
          }, // 환경영향평가(본안) 협의
          {
            title: this.$comm.getLangSpecInfoLabel('L0000004781'),
            url: './envEffectEvalTabs',
          }, // 환경영향평가(본안) 협의의견 반영
        ];
      }
      this.isSave = false;
      this.updateMode = false;
      this.saveAttach();
      this.setAttachFileGrps();
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.envEffectEval.envEffectEvalNo;
      });

      if (this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        this.$http.request(
          (_result) => {
            this.tempDeleteFiles = [];
            // 저장할 데이터가 있는 경우
            if (this.saveAttachFiles.length > 0) {
              this.submitCheck = !this.submitCheck;
            }
            // 저장할 데이터가 없는 경우
            // else this.closePopup();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitCheck = !this.submitCheck;
        }
        // 저장할 데이터가 없는 경우
        // else this.closePopup();
      }
    },
    btnClickedErrorCallback(_result) {
      this.isEdit = false;
      this.isSave = false;
      this.isComplete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnDeleteClickedCallback() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message:
          'M0000001570' /* 사업 기본정보 삭제시 진행단계별로 저장된 내역도 전체 삭제됩니다. 삭제하시겠습니까? */,
        type: 'warning',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.envEffectEval.envEffectEvalNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // '삭제되었습니다.',
                type: 'success',
              });

              window.getApp.$emit('updateEnvEffectEvalList');

              let taskClassNmList = [
                'ENV_OBJECT_CONFIRM_CONTENT',
                'ENV_EVAL_PREP_CONT',
                'ENV_EVAL_DETER_CONT',
                'ENV_DRAFT_CONT',
                'ENV_DRAFT_NOTICE_CONT',
                'ENV_RESIDENT_OPN_ACCEPT',
                'ENV_RESIDENT_EXPL_CONT',
                'ENV_RESIDENT_HEAR_CONT',
                'ENV_EVAL_AGENDA_REFLECT',
                'ENV_EVAL_AGENDA_DISCUSS',
                'ENV_EVAL_AGENDA_WRITE',
              ];

              for (let i = 0; i < taskClassNmList.length; i++) {
                this.$http.url = this.$format(
                  transactionConfig.attachFile.deleteAllDocu.url,
                  taskClassNmList[i],
                  this.envEffectEval.envEffectEvalNo
                );
                this.$http.type = 'DELETE';
                this.$http.request(
                  (_result) => {},
                  (_error) => {
                    window.getApp.$emit('APP_REQUEST_ERROR', _error);
                  }
                );
              }
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    updateEnvEffectEvalContent(data) {
      switch (data[1]) {
        case 0:
          this.envEffectEval.objectConfirmContent = data[0];
          break;
        case 1:
          this.envEffectEval.evalPrepCont = data[0];
          break;
        case 2:
          this.envEffectEval.evalDeterCont = data[0];
          break;
        case 3:
          this.envEffectEval.draftCont = data[0];
          break;
        case 4:
          this.envEffectEval.draftNoticeCont = data[0];
          break;
        case 5:
          this.envEffectEval.residentOpnAccept = data[0];
          break;
        case 6:
          this.envEffectEval.residentExplCont = data[0];
          break;
        case 7:
          this.envEffectEval.residentHearCont = data[0];
          break;
        case 8:
          this.envEffectEval.evalAgendaWrite = data[0];
          break;
        case 9:
          this.envEffectEval.evalAgendaDiscuss = data[0];
          break;
        case 10:
          this.envEffectEval.evalAgendaReflect = data[0];
          break;
      }
    },
    btnUpdateMode() {
      this.updateMode = true;
    },
    btnCancel() {
      this.updateMode = false;
    },
    closePopup() {
      this.$emit('closePopup', {});
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
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
    },
  },
};
</script>

<style>
textarea[name='envBusinessContents'] {
  width: 97%;
  margin-left: 3%;
}

.envEffectTabs > .el-tabs__header > .el-tabs__nav-wrap > .el-tabs__nav-next,
.envEffectTabs > .el-tabs__header > .el-tabs__nav-wrap > .el-tabs__nav-prev {
  line-height: 27px;
  width: 60px;
}
.envEffectTabs
  > .el-tabs__header
  > .el-tabs__nav-wrap
  > .el-tabs__nav-next:after {
  content: '►';
  padding-left: 27px;
  font-size: 26px;
  font-weight: 400;
}
.envEffectTabs
  > .el-tabs__header
  > .el-tabs__nav-wrap
  > .el-tabs__nav-prev:after {
  content: '◄';
  padding-left: 9px;
  font-size: 26px;
  font-weight: 400;
}
.envEffectTabs > .el-tabs__header > .el-tabs__nav-wrap {
  padding: 0 43px;
}
</style>
