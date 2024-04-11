<!--
  목적 : 훈련결과 관리 상세
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
            <!-- 훈련결과 관리 상세 -->
            <y-label
              label="L0000005224"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 확정 -->
              <y-btn
                v-if="updateMode && editable && !stateYn"
                title="L0000004571"
                color="black"
                @btnClicked="btnComplete"
              />
              <!-- 임시저장 -->
              <y-btn
                v-if="updateMode && editable && !stateYn"
                :action-url="editUrl"
                :param="emergencyResultInfo"
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
                :param="emergencyResultInfo"
                :is-submit="isInsert"
                title="L0000004986"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeValidateChk('insert')"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
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
                :editable="editable && newInsertMode"
                :required="true"
                name="plantCd"
                v-model="emergencyResultInfo.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <!-- 훈련구분 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :editable="editable && newInsertMode"
                :width="8"
                :comboItems="trainTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000003375"
                name="trainTypeCd"
                v-model="emergencyResultInfo.trainTypeCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('trainTypeCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 훈련일 -->
              <y-datepicker
                :editable="editable && newInsertMode"
                :width="8"
                label="L0000003385"
                name="trainYmd"
                v-model="emergencyResultInfo.trainYmd"
                :required="true"
                v-validate="'required'"
                :state="validateState('trainYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4 pr-0">
                  <!-- 훈련시간 -->
                  <y-label label="L0000003379" :required="true"></y-label>
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <b-row>
                    <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-5 pr-0">
                      <y-datepicker
                        :width="12"
                        :editable="editable && newInsertMode"
                        :minuteStep="10"
                        type="time"
                        name="trainSTime"
                        v-model="emergencyResultInfo.trainSTime"
                        v-validate="'required'"
                        :state="validateState('trainSTime')"
                      ></y-datepicker>
                    </b-col>
                    <b-col
                      sm="2"
                      md="2"
                      lg="2"
                      xl="2"
                      class="col-xxl-2 text-center"
                    >
                      <y-label label="~"></y-label>
                    </b-col>
                    <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-5 pl-0">
                      <y-datepicker
                        :width="12"
                        :editable="editable && newInsertMode"
                        :minuteStep="10"
                        type="time"
                        name="trainETime"
                        v-model="emergencyResultInfo.trainETime"
                        v-validate="'required'"
                        :state="validateState('trainETime')"
                      ></y-datepicker>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 주간부서 -->
              <y-tree-dept
                label="L0000005015"
                name="deptCd"
                v-model="emergencyResultInfo.deptCd"
                :plantCd="emergencyResultInfo.plantCd"
                :required="true"
                :editable="editable && newInsertMode && deptEditable"
                v-validate="'required'"
                :state="validateState('deptCd')"
                @setDeptNm="setDeptNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 대상부서 -->
              <y-tree-dept
                label="L0000000927"
                name="subDeptCd"
                v-model="emergencyResultInfo.subDeptCd"
                :plantCd="emergencyResultInfo.plantCd"
                :required="true"
                :editable="editable && newInsertMode"
                v-validate="'required'"
                :state="validateState('subDeptCd')"
                :dtlNull="true"
                @setDeptNm="setDeptNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4 pr-0">
                  <!-- 훈련교관 -->
                  <y-label label="L0000003374" :required="true"></y-label>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4 pr-0">
                  <y-text
                    :editable="editable && newInsertMode"
                    :disabled="true"
                    ui="bootstrap"
                    name="trainDeptNm"
                    v-model="emergencyResultInfo.trainDeptNm"
                    v-validate="'required'"
                    :state="validateState('trainDeptNm')"
                  ></y-text>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-text
                    :editable="editable && newInsertMode"
                    :clearable="true"
                    :disabled="true"
                    ui="bootstrap"
                    name="trainUserNm"
                    v-model="emergencyResultInfo.trainUserNm"
                    :appendIcon="
                      editable
                        ? [{ icon: 'search', callbackName: 'searchUser' }]
                        : null
                    "
                    @searchUser="btnSearchUserClicked"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 훈련명 -->
              <y-text
                :width="10"
                :editable="editable && newInsertMode"
                :required="true"
                ui="bootstrap"
                name="trainNm"
                label="L0000003378"
                v-model="emergencyResultInfo.trainNm"
                :maxlength="100"
                v-validate="'required'"
                :state="validateState('trainNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 훈련장소 -->
              <y-text
                :width="8"
                :editable="editable && newInsertMode"
                :required="true"
                ui="bootstrap"
                name="trainPlace"
                label="L0000003386"
                v-model="emergencyResultInfo.trainPlace"
                :maxlength="100"
                v-validate="'required'"
                :state="validateState('trainPlace')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 변경발의번호 -->
              <y-text
                :width="8"
                :editable="editable && newInsertMode"
                ui="bootstrap"
                label="L0000004754"
                name="chngNum"
                v-model="emergencyResultInfo.chngNum"
                :maxlength="50"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 훈련내용요약 -->
              <y-textarea
                :width="10"
                :editable="editable && newInsertMode"
                :required="true"
                :rows="4"
                ui="bootstrap"
                name="trainContent"
                label="L0000003377"
                v-model="emergencyResultInfo.trainContent"
                :maxlength="1000"
                v-validate="'required'"
                :state="validateState('trainContent')"
              ></y-textarea>
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
            :emergencyResultInfo.sync="emergencyResultInfo"
            :updateMode.sync="updateMode"
            :stateYn.sync="stateYn"
          />
          <component
            v-show="tabIndex === '1'"
            :is="component1"
            sm="12"
            :emergencyResultInfo.sync="emergencyResultInfo"
            :updateMode.sync="updateMode"
            :stateYn.sync="stateYn"
          />
          <component
            v-show="tabIndex === '2'"
            :is="component2"
            sm="12"
            :tabIndex="tabIndex"
            :emergencyResultInfo.sync="emergencyResultInfo"
            :updateMode.sync="updateMode"
            :newInsertMode.sync="newInsertMode"
          />
          <component
            v-show="tabIndex === '3'"
            :is="component3"
            sm="12"
            :tabIndex="tabIndex"
            :emergencyResultInfo.sync="emergencyResultInfo"
            :updateMode.sync="updateMode"
            :newInsertMode.sync="newInsertMode"
            :tabParam.sync="tabParam"
          />
          <component
            v-show="tabIndex === '4'"
            sm="12"
            :is="component4"
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
        safTrainDeptRsltNo: 0,
        safTrainPlanNo: 0,
        newInsert: false,
      },
    },
  },
  data: () => ({
    emergencyResultInfo: {
      safTrainPlanNo: 0,
      safTrainDeptRsltNo: 0,
      plantCd: '', // 사업장 코드
      trainTypeCd: null, // 훈련구분
      trainYmd: null, // 훈련일
      subTrainYmd: null, // 결과 훈련일
      deptCd: null, // 주관부서
      subDeptCd: null, // 대상부서
      deptNm: null,
      procStepCd: 'STS02',
      trainSTime: null, // 훈련시작시간
      trainETime: null, // 훈련종료시간
      subTrainSTime: null, // 결과훈련시작시간
      subTrainETime: null, // 결과훈련종료시간
      trainUserId: null, // 훈련교관ID
      trainUserNm: null, // 훈련교관명
      trainDeptCd: null, // 훈련교관소속부서코드
      trainDeptNm: null, // 훈련교관소속부서명
      trainNm: null, // 훈련명
      trainPlace: null, // 훈련장소
      trainContent: null, // 훈련내용요약
      trainUserCnt: 0, // 참여인원수
      trainImprDesc: '',
      trainEvalOpin: '',
      stateCd: null,
      chngNum: null,
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
      emergencyDeptList: [],
      emergencyScenarioList: [],
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
    tabParam: {
      plantCd: null,
      imprClassCd: '',
      refTableId: 0,
      editable: false,
      message: 'M0000001618', // 개선사항 입력은 평가결과 관리 상세를 등록후 입력 가능합니다.
      detailCheck: false,
      editMode: false,
    },
    tabIndex: 0,
    tabItems: [
      {
        title: 'L0000005206',
      } /* 훈련결과 */,
      {
        title: 'L0000003388',
      } /* 훈련평가 */,
      {
        title: 'L0000005190',
      } /* 훈련메뉴얼 */,
      { title: 'L0000000259' } /* 개선사항 */,

      { title: 'L0000002843' } /* 첨부파일 */,
    ],
    saveAttachFiles: [],
    attachFileGrps: [],
    submitCheck: false,
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    editUrl: '',
    desabled: false,
    insertUrl: '',
    detailUrl: '',
    itemListUrl: '',
    trainTypeItems: [], // 훈련구분
    component: null,
    component1: null,
    component2: null,
    component3: null,
    component4: null,
    newInsertMode: false,
    stateYn: false,
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
  }),
  watch: {
    tabIndex() {
      this.tabParam.refTableId = this.emergencyResultInfo.safTrainDeptRsltNo;
    },
    'emergencyResultInfo.plantCd'() {
      this.tabParam.plantCd = this.emergencyResultInfo.plantCd;
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  methods: {
    init() {
      this.newInsertMode = this.popupParam.newInsert;

      this.editable = this.$route.meta.editable;

      // Url Setting
      this.detailUrl = selectConfig.saf.emergencyResult.get.url;
      this.editUrl = transactionConfig.saf.emergencyResult.edit.url;
      this.insertUrl = transactionConfig.saf.emergencyResult.insert.url;
      this.component = () => import(`${'./trainingResultDetailTab'}`);
      this.component1 = () => import(`${'./trainingResultDetailAssess'}`);
      this.component2 = () => import(`${'./trainingResultDetailScenario'}`);
      this.component3 = () => import(`${'@/pages/impr/imprActTabSample'}`);
      this.component4 = () =>
        import('@/pages/common/attachFile/multiFileUpload');
      // 구분
      this.$comm.getComboItems('SAF_TRA_COURSE_CLS', true).then((_result) => {
        this.trainTypeItems = _result;
      });
      // 훈련일
      if (!this.popupParam.safTrainDeptRsltNo) {
        this.emergencyResultInfo.trainYmd = this.$comm
          .moment()
          .format('YYYY-MM-DD');
        this.emergencyResultInfo.deptCd = this.$store.getters.deptCd;
        this.emergencyResultInfo.safTrainDeptRsltNo = 0;
        this.emergencyResultInfo.safTrainPlanNo = 0;
        this.setAttachFileGrps();
      } else {
        this.emergencyResultInfo.safTrainDeptRsltNo =
          this.popupParam.safTrainDeptRsltNo;
        this.emergencyResultInfo.safTrainPlanNo =
          this.popupParam.safTrainPlanNo;
        this.tabParam.imprClassCd = 'ICL37';
        this.tabParam.refTableId = this.emergencyResultInfo.safTrainDeptRsltNo;
        this.tabParam.detailCheck = this.disabled;
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
    setDeptNm(deptNm) {
      this.emergencyResultInfo.deptNm = deptNm;
    },
    getDetail() {
      if (!this.emergencyResultInfo.safTrainDeptRsltNo) return;
      this.$http.url = this.$format(
        this.detailUrl,
        this.emergencyResultInfo.safTrainDeptRsltNo
      );
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.updateMode = true;

          this.emergencyResultInfo = _result.data;
          if (this.emergencyResultInfo.stateCd === 'PSEND') {
            this.stateYn = true;
            this.tabParam.editMode = true;
            this.tabParam.editable = false;
          } else {
            this.tabParam.editable = true;
          }
          this.tabParam.refTableId =
            this.emergencyResultInfo.safTrainDeptRsltNo;
          this.newInsertMode = false;
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
    nextUpdate() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: 'L0000005382',
              type: 'info',
              confirmCallback: () => {
                this.emergencyResultInfo.updateUserId =
                  this.$store.getters.token;
                this.emergencyResultInfo.updateDeptNm =
                  this.$store.getters.deptNm;
                this.emergencyResultInfo.updateDeptCd =
                  this.$store.getters.deptCd;
                this.emergencyResultInfo.updatePositionCd =
                  this.$store.getters.positionCd;
                this.emergencyResultInfo.updatePositionNm =
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
    beforeValidateChk(flag) {
      return new Promise((_resolve, _reject) => {
        if (!this.emergencyResultInfo.plantCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005081' /* 본문 사업장을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyResultInfo.trainTypeCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005183' /* 훈련구분을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyResultInfo.trainYmd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005184' /* 훈련일을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (
          !this.emergencyResultInfo.trainSTime ||
          !this.emergencyResultInfo.trainETime
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005185' /* 훈련시간을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyResultInfo.deptCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005136' /* 주관부서를 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (
          !this.emergencyResultInfo.trainUserId ||
          !this.emergencyResultInfo.trainUserNm
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005186' /* 훈련교관을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyResultInfo.trainNm) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005187' /* 훈련명을 입력해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyResultInfo.trainPlace) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005188' /* 훈련장소를 입력해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyResultInfo.trainContent) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005189' /* 훈련내용요약을 입력해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyResultInfo.trainUserCnt) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005218' /* [훈련결과] 참여인원수를 입력해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyResultInfo.subTrainYmd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005217' /* [훈련결과] 훈련일를 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (
          !this.emergencyResultInfo.subTrainSTime ||
          !this.emergencyResultInfo.subTrainETime
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005216' /* [훈련결과] 훈련시간을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyResultInfo.trainImprDesc) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message:
              'L0000005215' /* [훈련평가] 문제점 및 개선사항을 입력해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyResultInfo.trainEvalOpin) {
          window.getApp.$emit('ALERT', {
            title: 'L0000005214' /* 안내 */,
            message:
              'L0000005189' /* [훈련평가] 훈련결과요약을 입력해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (flag === 'insert') {
          this.nextInsert();
        } else {
          this.nextUpdate();
        }
      });
    },
    nextInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: 'L0000005382',
              type: 'info',
              confirmCallback: () => {
                this.emergencyResultInfo.createUserId =
                  this.$store.getters.token;
                this.emergencyResultInfo.createDeptNm =
                  this.$store.getters.deptNm;
                this.emergencyResultInfo.createDeptCd =
                  this.$store.getters.deptCd;
                this.emergencyResultInfo.createPositionCd =
                  this.$store.getters.positionCd;
                this.emergencyResultInfo.createPositionNm =
                  this.$store.getters.positionNm;
                this.isInsert = true;
              },
            });
          }
        })
        .catch((e) => {
          console.log('2', e);
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
    },
    btnInsertClickedCallback(result) {
      this.emergencyResultInfo.safTrainDeptRsltNo = result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.updateMode = true;
      this.saveAttach();
      this.getDetail();
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
      let taskKey = this.emergencyResultInfo.safTrainDeptRsltNo
        ? this.emergencyResultInfo.safTrainDeptRsltNo
        : ''; // 현 모델 키 값

      this.attachFileGrps = [
        {
          label: '파일업로드',
          drag: this.editable,
          showFileSearch: false,
          editable: this.editable && !this.stateYn,
          disabled: this.disabled,
          uploadTempFiles: null,
          taskClassNm: 'TRAINING_RESULT', // 현 화면의 첨부파일 키 값
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
        item.taskKey = this.emergencyResultInfo.safTrainDeptRsltNo;
      });

      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitCheck = !this.submitCheck;
      }
    },
    // 사용자 검색 팝업 열기
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.param = {
        plantCd: this.emergencyResultInfo.plantCd,
      }; // 사용자검색 팝업 검색조건
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        this.emergencyResultInfo.trainUserNm = data.user.userNm;
        this.emergencyResultInfo.trainUserId = data.user.userId;
        this.emergencyResultInfo.trainDeptNm = data.user.deptNm;
        this.emergencyResultInfo.trainDeptCd = data.user.deptCd;
      }
    },
    btnComplete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000001593', // '확정 하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.$format(
            transactionConfig.saf.emergencyResult.complete.url,
            this.emergencyResultInfo.safTrainDeptRsltNo
          );
          this.$http.type = 'PUT';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000001590', // '확정 되었습니다.',
                type: 'success',
              });
              this.getDetail();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
  },
};
</script>
