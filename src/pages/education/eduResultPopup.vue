<!--
  목적 : 교육 결과 등록/수정
  작성자 : kkc
  Detail : 교육 결과 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 교육 결과 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 교육 결과 상세 -->
            <y-label
              label="L0000000607"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                :disabled="true"
                name="plantCd"
                v-model="eduMaster.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- /* 교육구분 */ -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="eduTypeCdItems"
                :required="true"
                :disabled="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000639"
                name="eduTypeCd"
                v-model="eduMaster.eduTypeCd"
                v-validate="'required'"
                :state="validateState('eduTypeCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육대분류 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="eduAttCdItems"
                :disabled="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000644"
                name="eduAttCd"
                v-model="eduMaster.eduAttCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('eduAttCd')"
              ></y-select>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육분류 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="eduClassCdItems"
                :disabled="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000659"
                name="eduAttCd"
                v-model="eduMaster.eduClassCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('eduClassCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육과정 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="eduCourseItems"
                itemText="eduCourseNm"
                itemValue="safEduCourseNo"
                :disabled="true"
                ui="bootstrap"
                label="L0000000633"
                name="safEduCourseNo"
                v-model="eduMaster.safEduCourseNo"
                :required="true"
                v-validate="'required'"
                :state="validateState('safEduCourseNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육담당자 -->
              <y-text
                :width="8"
                :readonly="true"
                :required="true"
                :disabled="true"
                ui="bootstrap"
                label="L0000000643"
                name="addUser"
                v-model="addUser"
                v-validate="'required'"
                :state="validateState('addUser')"
              />
            </b-col>
            <!-- 
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="questionUseYnItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                :disabled="true"
                label="교육풀이문제"
                name="questionUseYn"
                v-model="eduMaster.questionUseYn"
              ></y-select>
            </b-col>
            -->

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 교육명 -->
              <y-text
                :width="10"
                :editable="editable"
                :required="true"
                :disabled="true"
                :maxlength="60"
                ui="bootstrap"
                label="L0000000653"
                name="eduNm"
                v-model="eduMaster.eduNm"
                v-validate="'required'"
                :state="validateState('eduNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육시작일 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :required="true"
                :disabled="true"
                label="L0000000661"
                name="eduSYmd"
                v-validate="'required'"
                v-model="eduMaster.eduSYmd"
                :state="validateState('eduSYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육종료일 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :required="true"
                :disabled="true"
                label="L0000000673"
                name="eduEYmd"
                v-validate="'required'"
                v-model="eduMaster.eduEYmd"
                :state="validateState('eduEYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육시간 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :required="true"
                ui="bootstrap"
                label="L0000000660"
                :disabled="true"
                name="eduTime"
                v-validate="'required'"
                v-model="eduMaster.eduTime"
                :state="validateState('eduTime')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="8">
                  <!-- 교육 시작시/종료시 -->
                  <y-text
                    :width="6"
                    :editable="editable"
                    :maxlength="10"
                    ui="bootstrap"
                    label="L0000003650"
                    :disabled="true"
                    name="eduSHour"
                    v-model="eduMaster.eduSHour"
                  ></y-text>
                </b-col>
                <b-col sm="4">
                  <y-text
                    :width="12"
                    :editable="editable"
                    :disabled="true"
                    :maxlength="10"
                    ui="bootstrap"
                    name="eduEHour"
                    v-model="eduMaster.eduEHour"
                  ></y-text>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육장소 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="60"
                :required="true"
                :disabled="true"
                ui="bootstrap"
                label="L0000000672"
                name="eduPlace"
                v-validate="'required'"
                v-model="eduMaster.eduPlace"
                :state="validateState('eduPlace')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육강사 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                :required="true"
                :disabled="true"
                ui="bootstrap"
                label="L0000003649"
                name="eduTeacher"
                v-validate="'required'"
                v-model="eduMaster.eduTeacher"
                :state="validateState('eduTeacher')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육총비용 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="9"
                :required="true"
                :hasSeperator="true"
                :disabled="true"
                ui="bootstrap"
                label="L0000000676"
                name="eduCost"
                v-validate="'required'"
                v-model="eduMaster.eduCost"
                :state="validateState('eduCost')"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 교육내용 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="600"
                :required="true"
                :disabled="true"
                ui="bootstrap"
                label="L0000000642"
                name="eduContent"
                v-validate="'required'"
                v-model="eduMaster.eduContent"
                :state="validateState('eduContent')"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
        <b-row class="mt-3"></b-row>
        <el-tabs type="border-card" v-model="tabIndex">
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
              :is="component"
              v-if="component"
              :eduMaster.sync="eduMaster"
              :viewMode="true"
              :attachFileGrp.sync="attachFileGrp"
            />
          </keep-alive>
        </el-tabs>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
    <!-- excelDownload -->
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'edu-result',
  props: {
    popupParam: {
      type: Object,
      default: {
        safEduMstNo: 0,
        processStepCd: '',
      },
    },
  },
  data() {
    return {
      tabItems: [],
      component: null,
      tabIndex: 0,
      eduMaster: {
        safEduMstNo: 0,
        eduAttCd: null,
        safEduCourseNo: null,
        eduTypeCd: null,
        deptCd: null,
        eduNm: '',
        eduTime: 0,
        eduSYmd: '',
        eduEYmd: '',
        eduPlace: '',
        eduCost: '',
        eduTeacher: '',
        eduContent: '',
        processStepCd: '',
        eduResultSummary: '',
        eduEvalOpin: '',
        personList: [],
        createUserId: '',
        updateUserId: '',
        eduOutSideUsers: [],
        userId: '',
      },
      attachFileGrp: {
        taskClassNm: '',
        taskKey: '',
        createUserId: '',
        showUploadBtn: true,
        editable: true,
        drag: true,
        label: '',
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
      addUser: '',
      editable: true,
      updateMode: false,
      compleMode: false,
      eduAttCdItems: [],
      eduCourseItems: [],
      eduTypeCdItems: [],
      eduClassCdItems: [],
      questionUseYnItems: [],
      editUrl: '',
      deleteUrl: '',
      getUrl: '',
      isEdit: false,
      isAppr: false,
      isComple: false,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'eduMaster.eduAttCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/

  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      // URL 셋팅
      this.editUrl = transactionConfig.saf.education.eduResult.edit.url;
      this.deleteUrl = transactionConfig.saf.education.eduMaster.delete.url;
      this.getUrl = selectConfig.saf.education.eduMaster.get.url;

      this.attachFileGrp.taskClassNm = 'EDUPLAN';
      this.attachFileGrp.taskKey = this.popupParam.safEduMstNo.toString();
      this.attachFileGrp.createUserId = this.$store.getters.token;
      this.attachFileGrp.showUploadBtn = false;
      this.attachFileGrp.drag = false;
      this.attachFileGrp.disabled = true;
      this.attachFileGrp.onlyDownload = true;
      this.attachFileGrp.label = 'L0000003030'; /* 파일업로드 */

      this.getEduAttCdItems();
      this.getEduCourseItems();
      this.getEduTypeCdItems();
      this.getEduClassCdItems();

      this.eduMaster.safEduMstNo = this.popupParam.safEduMstNo;
      this.eduMaster.processStepCd = this.popupParam.processStepCd;

      this.tabItems = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000668'),
          url: './eduResultPersonPop',
        } /* '교육이수자' */,
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000669'),
          url: './eduResultPersonOutside',
        } /* '교육이수자(외부)' */,
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000407'),
          url: './eduResultOverall',
        } /* '결과/총평' */,
        // { title: '교육풀이문제', url: './eduPlanExam' },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000775'),
          url: './eduPlanMaterialResult',
        } /* '교육자료' */,
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002843'),
          url: 'fileUploadPage',
        } /* '첨부파일' */,
      ];

      setTimeout(() => {
        this.getDetail();
        if (this.eduMaster.processStepCd === 'SES02') {
          this.updateMode = true;
          this.compleMode = true;
        } else if (this.eduMaster.processStepCd === 'SES03') {
          this.updateMode = false;
          this.compleMode = false;
        }
        this.loadComponent();
      }, 600);

      this.questionUseYnItems = [
        {
          code: 'Y',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001440'),
        } /* '사용' */,
        {
          code: 'N',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000001063'),
        } /* '미사용' */,
      ];
    },
    getDetail() {
      this.$http.url = this.$format(this.getUrl, this.eduMaster.safEduMstNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.eduMaster = this.$_.clone(_result.data);
          this.addUser = _result.data.deptNm + ' / ' + _result.data.userNm;
          this.eduMaster.userId = _result.data.userId;
          this.eduMaster.deptCd = _result.data.deptCd;

          if (
            this.$comm.getDatediff(
              this.$comm.moment(this.eduMaster.eduEYmd),
              this.$comm.moment(this.$comm.getToday())
            ) > 0
          ) {
            this.isAppr = true;
          } else {
            this.isAppr = false;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEduAttCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_ATT'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.eduAttCdItems = this.$_.clone(_result.data);
          this.eduAttCdItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); /* '선택하세요'  */
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    getEduTypeCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_TYPE'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.eduTypeCdItems = this.$_.clone(_result.data);
          this.eduTypeCdItems.splice(0, 0, {
            code: null,
            codeNm:
              this.$comm.getLangSpecInfoLabel(
                'L0000003394'
              ) /* '선택하세요', */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEduClassCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_COURSE'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.eduClassCdItems = this.$_.clone(_result.data);
          this.eduClassCdItems.splice(0, 0, {
            code: null,
            codeNm:
              this.$comm.getLangSpecInfoLabel(
                'L0000003394'
              ) /* '선택하세요', */,
          });
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    getEduCourseItems() {
      this.$http.url = selectConfig.saf.education.eduCourse.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        eduAttCd: this.eduMaster.eduAttCd,
      };
      this.$http.request(
        (_result) => {
          this.eduCourseItems = this.$_.clone(_result.data);
          this.eduCourseItems.splice(0, 0, {
            safEduCourseNo: null,
            eduCourseNm:
              this.$comm.getLangSpecInfoLabel(
                'L0000003394'
              ) /* '선택하세요', */,
          });
          if (
            this.eduMaster.safEduCourseNo &&
            this.$_.indexOf(
              this.$_.map(this.eduCourseItems, 'safEduCourseNo'),
              this.eduMaster.safEduCourseNo
            ) === -1
          ) {
            this.eduMaster.safEduCourseNo = null;
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },

    // 탭
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;
      if (path === 'fileUploadPage') {
        this.component = () => import('@/pages/saf/imprAct/fileUploadPage');
      } else {
        this.component = () => import(`${path}`);
      }
    },
    beforeEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.validationMessage();
          if (!this.eduMaster.eduResultSummary || !this.eduMaster.eduEvalOpin) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000000293' /* 결과/총평을 입력해 주세요. */,
              type: 'warning', // success / info / warning / error
            });
            return;
          } else if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000060' /* 교육결과 정보를 수정하시겠습니까? */,
              type: 'info',
              confirmCallback: () => {
                this.eduMaster.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    beforeComple() {
      this.$validator.validateAll().then((_result) => {
        this.validationMessage();
        if (!this.eduMaster.eduResultSummary || !this.eduMaster.eduEvalOpin) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'M0000000293' /* 결과/총평을 입력해 주세요. */,
            type: 'warning', // success / info / warning / error
          });
          return;
        } else if (_result) {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321' /* 확인 */,
            message: 'M0000000236' /* 완료하시겠습니까? */,
            type: 'info',
            confirmCallback: () => {
              this.eduMaster.processStepCd = 'SES03';
              this.eduMaster.updateUserId = this.$store.getters.token;
              this.$validator
                .validateAll()
                .then((_result) => {
                  this.isComple = true;
                })
                .catch(() => {
                  this.isComple = false;
                });
            },
          });
        }
      });
    },
    btnDeleteClickedCallback() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.eduMaster.safEduMstNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000007' /* 정상적으로 삭제되었습니다. */,
                type: 'success',
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit(
                'APP_REQUEST_ERROR',
                'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
              );
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
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
    validationMessage() {
      if (!this.eduMaster.deptCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000725' /* 주관부서를 선택해 주세요. */,
          type: 'warning', // success / info / warning / error
        });
        return;
      } else if (!this.eduMaster.eduSYmd || !this.eduMaster.eduEYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000726' /* 교육기간을 선택해 주세요. */,
          type: 'warning', // success / info / warning / error
        });
        return;
      }
    },
    // 수정
    btnEditClickedCallback(_result) {
      // this.eduMaster.safEduMstNo = _result.data;

      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000836' /*  수정하였습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.updateMode = true;
      this.isEdit = false;
      // this.getDetail();
      if (
        this.$comm.getDatediff(
          this.$comm.moment(this.eduMaster.eduEYmd),
          this.$comm.moment(this.$comm.getToday())
        ) > 0
      ) {
        this.isAppr = true;
      } else {
        this.isAppr = false;
      }
    },
    // 완료
    btnCompleClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'L0000005541', // '정상적으로 완료되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.compleMode = false;
      this.updateMode = false;
      this.isComple = false;
    },
    closePopup() {
      this.$emit('closePopup');
    },

    excelDownEduResult(data) {
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = '/api/saf/education/eduresultexceldown'; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.param = {
        type: data,
        safEduMstNo: this.eduMaster.safEduMstNo,
      };
      this.$http.request(
        (_result) => {
          var fileOrgNm = null;
          if (data === 'EDU1') {
            fileOrgNm =
              this.$comm.getLangSpecInfoLabel('L0000000633') +
              this.$comm.moment().format('YYYYMMDD') +
              '.xlsx'; /* 교육과정 */
          } else if (data === 'EDU2') {
            fileOrgNm =
              this.$comm.getLangSpecInfoLabel('L0000002798') +
              this.$comm.moment().format('YYYYMMDD') +
              '.xlsx'; /* 교육차수_ */
          } else if (data === 'EDU3') {
            fileOrgNm =
              this.$comm.getLangSpecInfoLabel('L0000000646') +
              this.$comm.moment().format('YYYYMMDD') +
              '.xlsx'; /* 교육대상자_ */
          } else if (data === 'EDU4') {
            fileOrgNm =
              this.$comm.getLangSpecInfoLabel('L0000003607') +
              this.$comm.moment().format('YYYYMMDD') +
              '.xlsx'; /* 교육결과_ */
          } else if (data === 'EDU5') {
            fileOrgNm =
              this.$comm.getLangSpecInfoLabel('L0000002208') +
              this.$comm.moment().format('YYYYMMDD') +
              '.xlsx'; /* 이력정보_ */
          }
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );

      let form = document.excelDownload;
      form.action =
        'http://192.1.22.63:8080/api/saf/education/eduresultexceldown';

      form.target = 'hiddenifr';
      form.submit();
    },

    inputElementFunc(_name, _value) {
      var method = document.createElement('input');
      method.setAttribute('type', 'hidden');
      method.setAttribute('name', _name);
      method.value = _value;
      return method;
    },

    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isEdit = false;
      this.isComple = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    /** /Button Event **/
    btnAbsenteeReEdu(data) {
      this.popupOptions.target = () => import(`${'./eduPlanReEdu.vue'}`);
      this.popupOptions.title = 'L0000001356'; /* 불참자 재교육결과 등록/수정 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = { safEduMstNo: this.eduMaster.safEduMstNo };
      this.popupOptions.closeCallback = this.closeReEduPopup;
    },
    closeReEduPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },

    btnAppr() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; /* 결재요청 */
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'EU-ED-02',
        apprParams: {
          safEduMstNo: this.eduMaster.safEduMstNo,
        },
      };
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getDetail();
    },
    /** 기타 function **/

    /** /기타 function **/
  },
};
</script>
