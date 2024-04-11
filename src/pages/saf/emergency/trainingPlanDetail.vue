<!--
  목적 : 훈련계획 관리 상세
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
            <!-- 훈련계획 관리 상세 -->
            <y-label
              label="L0000005182"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 확정 -->
              <y-btn
                v-if="updateMode && editable && stateYn"
                title="L0000004571"
                color="black"
                @btnClicked="btnComplete"
              />
              <!-- 임시저장 -->
              <y-btn
                v-if="updateMode && editable && stateYn"
                :action-url="editUrl"
                :param="emergencyInfo"
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
                v-if="!updateMode && editable && stateYn"
                :action-url="insertUrl"
                :param="emergencyInfo"
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
                v-if="editable && updateMode && stateYn"
                title="L0000001495"
                color="red"
                @btnClicked="deleteSubmit"
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
                :editable="editable && stateYn"
                :required="true"
                name="plantCd"
                v-model="emergencyInfo.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <!-- 훈련구분 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :editable="editable && stateYn"
                :width="8"
                :comboItems="trainTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000003375"
                name="trainTypeCd"
                v-model="emergencyInfo.trainTypeCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('trainTypeCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 훈련일 -->
              <y-datepicker
                :editable="editable && stateYn"
                :width="8"
                label="L0000003385"
                name="trainYmd"
                v-model="emergencyInfo.trainYmd"
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
                        :editable="editable && stateYn"
                        :minuteStep="10"
                        type="time"
                        name="trainSTime"
                        v-model="emergencyInfo.trainSTime"
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
                        :editable="editable && stateYn"
                        :minuteStep="10"
                        type="time"
                        name="trainETime"
                        v-model="emergencyInfo.trainETime"
                        v-validate="'required'"
                        :state="validateState('trainETime')"
                      ></y-datepicker>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-col>
            <!-- 주간부서 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-tree-dept
                label="L0000005015"
                name="deptCd"
                v-model="emergencyInfo.deptCd"
                :plantCd="emergencyInfo.plantCd"
                :required="true"
                :editable="editable && stateYn && deptEditable"
                v-validate="'required'"
                :state="validateState('deptCd')"
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
                    :editable="editable && stateYn"
                    :disabled="true"
                    ui="bootstrap"
                    name="trainDeptNm"
                    v-model="emergencyInfo.trainDeptNm"
                    v-validate="'required'"
                    :state="validateState('trainDeptNm')"
                  ></y-text>
                </b-col>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-text
                    :editable="editable && stateYn"
                    :clearable="true"
                    :disabled="true"
                    ui="bootstrap"
                    name="trainUserNm"
                    v-model="emergencyInfo.trainUserNm"
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
                :editable="editable && stateYn"
                :required="true"
                ui="bootstrap"
                name="trainNm"
                label="L0000003378"
                v-model="emergencyInfo.trainNm"
                v-validate="'required'"
                :maxlength="100"
                :state="validateState('trainNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 훈련장소 -->
              <y-text
                :width="8"
                :editable="editable && stateYn"
                :required="true"
                ui="bootstrap"
                name="trainPlace"
                label="L0000003386"
                v-model="emergencyInfo.trainPlace"
                :maxlength="100"
                v-validate="'required'"
                :state="validateState('trainPlace')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 변경발의번호 -->
              <y-text
                :width="8"
                :editable="editable && stateYn"
                ui="bootstrap"
                label="L0000004754"
                name="chngNum"
                v-model="emergencyInfo.chngNum"
                :maxlength="50"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 훈련내용요약 -->
              <y-textarea
                :width="10"
                :editable="editable && stateYn"
                :required="true"
                :rows="4"
                ui="bootstrap"
                name="trainContent"
                label="L0000003377"
                v-model="emergencyInfo.trainContent"
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
            :tabIndex.sync="tabIndex"
            :emergencyInfo.sync="emergencyInfo"
            :updateMode.sync="updateMode"
            :stateYn.sync="stateYn"
          />
          <component
            v-show="tabIndex === '1'"
            :is="component1"
            sm="12"
            :tabIndex.sync="tabIndex"
            :emergencyInfo.sync="emergencyInfo"
            :updateMode.sync="updateMode"
            :stateYn.sync="stateYn"
          />
          <component
            v-show="tabIndex === '2'"
            sm="12"
            :is="component2"
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
        safTrainPlanNo: 0,
      },
    },
  },
  data: () => ({
    emergencyInfo: {
      safTrainPlanNo: 0,
      plantCd: '', // 사업장 코드
      trainTypeCd: null, // 훈련구분
      trainYmd: null, // 훈련일
      deptCd: null, // 주관부서
      deptNm: null,
      procStepCd: 'STS01',
      trainSTime: null, // 훈련시작시간
      trainETime: null, // 훈련종료시간
      trainUserId: null, // 훈련교관ID
      trainUserNm: null, // 훈련교관명
      trainDeptCd: null, // 훈련교관소속부서코드
      trainDeptNm: null, // 훈련교관소속부서명
      trainNm: null, // 훈련명
      trainPlace: null, // 훈련장소
      trainContent: null, // 훈련내용요약
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
    tabIndex: 0,
    tabItems: [
      {
        title: 'L0000000927',
      } /* 대상부서 */,
      {
        title: 'L0000005190',
      } /* 훈련매뉴얼 */,
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
    desabled: false,
    insertUrl: '',
    deleteUrl: '',
    detailUrl: '',
    itemListUrl: '',
    trainTypeItems: [], // 훈련구분
    component: null,
    component1: null,
    component2: null,
    stateYn: true,
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
  }),
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.detailUrl = selectConfig.saf.emergency.get.url;
      this.editUrl = transactionConfig.saf.emergency.edit.url;
      this.insertUrl = transactionConfig.saf.emergency.insert.url;
      this.deleteUrl = transactionConfig.saf.emergency.delete.url;

      // 구분
      this.$comm.getComboItems('SAF_TRA_COURSE_CLS', true).then((_result) => {
        this.trainTypeItems = _result;
      });
      // 훈련일

      if (!this.popupParam.safTrainPlanNo) {
        this.emergencyInfo.trainYmd = this.$comm.moment().format('YYYY-MM-DD');
        this.emergencyInfo.deptCd = this.$store.getters.deptCd;
        this.emergencyInfo.safTrainPlanNo = 0;
        this.setAttachFileGrps();
      } else {
        this.emergencyInfo.safTrainPlanNo = this.popupParam.safTrainPlanNo;
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

      this.getDetail().then(() => {
        this.component = () => import(`${'./trainingPlanDetailDeptList'}`);
        this.component1 = () => import(`${'./trainingPlanDetailScenario'}`);
        this.component2 = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      });
    },
    setDeptNm(deptNm) {
      this.emergencyInfo.deptNm = deptNm;
    },
    getDetail() {
      return new Promise((resolve, reject) => {
        if (this.emergencyInfo.safTrainPlanNo === 0) {
          resolve();
          return;
        }

        this.$http.url = this.$format(
          this.detailUrl,
          this.emergencyInfo.safTrainPlanNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.updateMode = true;

            this.emergencyInfo = _result.data;
            if (this.emergencyInfo.stateCd === 'PSREG') {
              this.stateYn = true;
            } else {
              this.stateYn = false;
            }
            this.setAttachFileGrps();
            resolve();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            reject(_error);
          }
        );
      });
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
              message: 'L0000005381',
              type: 'info',
              confirmCallback: () => {
                this.emergencyInfo.updateUserId = this.$store.getters.token;
                this.emergencyInfo.updateDeptNm = this.$store.getters.deptNm;
                this.emergencyInfo.updateDeptCd = this.$store.getters.deptCd;
                this.emergencyInfo.updatePositionCd =
                  this.$store.getters.positionCd;
                this.emergencyInfo.updatePositionNm =
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
        if (!this.emergencyInfo.plantCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005081' /* 본문 사업장을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyInfo.trainTypeCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005183' /* 훈련구분을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyInfo.trainYmd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005184' /* 훈련일을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyInfo.trainSTime || !this.emergencyInfo.trainETime) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005185' /* 훈련시간을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyInfo.deptCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005136' /* 주관부서를 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (
          !this.emergencyInfo.trainUserId ||
          !this.emergencyInfo.trainUserNm
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005186' /* 훈련교관을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyInfo.trainNm) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005187' /* 훈련명을 입력해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyInfo.trainPlace) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005188' /* 훈련장소를 입력해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.emergencyInfo.trainContent) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005189' /* 훈련내용요약을 입력해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (
          !this.emergencyInfo.emergencyDeptList ||
          this.emergencyInfo.emergencyDeptList.length <= 0
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

        let checkDate = this.checkDeptList();

        if (!checkDate) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message:
              '[' +
              this.$comm.getLangSpecInfoLabel('L0000000927') +
              '] ' +
              this.$comm.getLangSpecInfoLabel('L0000005384'), // 대상부서에 훈련일을 훈련계획 기간 이내로 입력해주세요.,
            type: 'warning', // success / info / warning / error
          });
          return;
        }

        if (flag === 'insert') {
          this.nextInsert();
        } else {
          this.nextUpdate();
        }
      });
    },
    checkDeptList() {
      let flag = true;

      let date1 = new Date(
        this.emergencyInfo.trainYmd + ' ' + this.emergencyInfo.trainSTime
      );
      let date2 = new Date(
        this.emergencyInfo.trainYmd + ' ' + this.emergencyInfo.trainETime
      );

      this.$_.forEach(this.emergencyInfo.emergencyDeptList, (item) => {
        let date3 = new Date(item.trainYmd + ' ' + item.trainSTime);
        let date4 = new Date(item.trainYmd + ' ' + item.trainETime);
        if (date3 < date1 || date3 > date2) {
          flag = false;
          return;
        } else if (date4 < date1 || date4 > date2) {
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
              message: 'L0000005381',
              type: 'info',
              confirmCallback: () => {
                this.emergencyInfo.createUserId = this.$store.getters.token;
                this.emergencyInfo.createDeptNm = this.$store.getters.deptNm;
                this.emergencyInfo.createDeptCd = this.$store.getters.deptCd;
                this.emergencyInfo.createPositionCd =
                  this.$store.getters.positionCd;
                this.emergencyInfo.createPositionNm =
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
      this.emergencyInfo.safTrainPlanNo = result.data;
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
    deleteSubmit() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // '삭제하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.emergencyInfo.safTrainPlanNo
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
      let taskKey = this.emergencyInfo.safTrainPlanNo
        ? this.emergencyInfo.safTrainPlanNo
        : ''; // 현 모델 키 값

      this.attachFileGrps = [
        {
          label: '파일업로드',
          drag: this.editable,
          showFileSearch: false,
          editable: this.editable && this.stateYn,
          disabled: this.disabled,
          uploadTempFiles: null,
          taskClassNm: 'TRAINING_PLAN', // 현 화면의 첨부파일 키 값
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
        item.taskKey = this.emergencyInfo.safTrainPlanNo;
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
        plantCd: this.emergencyInfo.plantCd,
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
        this.emergencyInfo.trainUserNm = data.user.userNm;
        this.emergencyInfo.trainUserId = data.user.userId;
        this.emergencyInfo.trainDeptNm = data.user.deptNm;
        this.emergencyInfo.trainDeptCd = data.user.deptCd;
      }
    },
    btnComplete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000001593', // '확정 하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.$format(
            transactionConfig.saf.emergency.complete.url,
            this.emergencyInfo.safTrainPlanNo
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
