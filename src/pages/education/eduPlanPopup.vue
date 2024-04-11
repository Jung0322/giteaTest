<!--
  목적 : 교육 계획 등록/수정
  작성자 : kkc
  Detail : 교육 계획 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 교육 계획 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 교육 계획 상세 -->
            <y-label label="L0000000608" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" v-if="!this.popupParam.apprFlag" @btnClicked="closePopup" />
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
                @datachange="val => {eduMaster.plantCd = val, getEduCourseItems();}"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 교육구분 -->
              <y-select
                :width="8"
                :comboItems="eduTypeCdItems"
                :disabled="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000639"
                name="eduTypeCd"
                v-model="eduMaster.eduTypeCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('eduTypeCd')"
              ></y-select>
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
                name="eduClassCd"
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
                :disabled="true"
                itemText="eduCourseNm"
                itemValue="safEduCourseNo"
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
                :disabled="true"
                :required="true"
                ui="bootstrap"
                label="L0000000643"
                name="addUser"
                v-model="addUser"
                v-validate="'required'"
                :state="validateState('addUser')"
                :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                @searchUser="btnSearchUserClicked"
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
                label="교육풀이문제여부"
                name="questionUseYn"
                v-model="eduMaster.questionUseYn"
              ></y-select>
            </b-col>-->

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 교육명 -->
              <y-text
                :width="10"
                :editable="editable"
                :disabled="true"
                :required="true"
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
                :disabled="true"
                :required="true"
                ui="bootstrap"
                label="L0000000660"
                name="eduTimePlan"
                v-validate="'required'"
                v-model="eduMaster.eduTimePlan"
                :state="validateState('eduTimePlan')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="8">
                  <!-- 교육 시작시/종료시 -->
                  <y-text
                    :width="6"
                    :editable="editable"
                    :disabled="true"
                    :maxlength="10"
                    ui="bootstrap"
                    label="L0000003650"
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
                :disabled="true"
                :required="true"
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
                :disabled="true"
                :required="true"
                ui="bootstrap"
                label="L0000003649"
                name="eduTeacher"
                v-validate="'required'"
                v-model="eduMaster.eduTeacher"
                :state="validateState('eduTeacher')"
              ></y-text>
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
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- <qrcode-vue value="www.naver.com" size="300" level="H"></qrcode-vue> -->
            </b-col>
          </b-row>
        </b-card>
        <b-row class="mt-3"></b-row>
        <el-tabs type="border-card" v-model="tabIndex">
          <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ item.title }}
            </span>
            <keep-alive>
              <component
                :is="component"
                v-if="component"
                :eduMaster.sync="eduMaster"
                :submitCheck="safSubmitCheck"
                :disabled="true"
                sm="12"
                :attachFileGrps="safAttachFileGrps"
                :saveAttachFiles="safSaveAttachFiles"
                @changeUploadFiles="changeUploadFiles"
                @setTempDeleteFiles="setTempDeleteFiles"
              />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import QrcodeVue from 'qrcode.vue';

export default {
  /** attributes: name, components, props, data **/
  name: 'edu-plan',
  components: {
    QrcodeVue,
  },
  props: {
    popupParam: {
      type: Object,
      default: {
        safEduMstNo: 0,
        processStepCd: '',
        safEduCourseNo: null,
      },
    },
  },
  data() {
    return {
      tabItems: [],

      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '850px',
        top: '100px',
        param: {},
        closeCallback: null,
      },

      component: null,
      tabIndex: 0,
      eduMaster: {
        safEduMstNo: 0, // 교육마스터 번호
        safEduCourseNo: null, // 교육과정 번호
        eduTypeCd: null, // 교육구분코드
        eduAttCd: null, // 교육분류
        deptCd: null, // 교육담당부서코드
        userId: null, // 교육담당자 아이디
        eduNm: null, // 교육명
        eduSYmd: null, // 교육시작일
        eduEYmd: null, // 교육종료일
        eduTime: 0, // 실제교육시간
        eduTimePlan: 0, // 계획교육시간
        eduSHour: null, // 교육시작시
        eduEHour: null, // 교육종료시
        eduPlace: null, // 교육장소
        eduTeacher: null, // 교육강사
        eduContent: null, // 교육내용
        eduResultSummary: null, // 교육결과요약
        eduEvalOpin: null, // 교육총평
        processStepCd: null, // 교육진행단계코드
        plantCd: null, // 사업장
        questionUseYn: null, // 교육문제풀이여부
        reEduYn: null, // 재교육수행여부
        reEduSYmd: null, // 재교육시작일
        reEduEYmd: null, // 재교육종료일
        reEduTime: 0, // 재교육시간
        reEduPlace: null, // 재교육장소
        reEduTeacher: null, // 재교육강사
        reEduEndYn: null, // 재교육완료여부
        papprRqstNo: 0, // 계획결재요청번호
        rApprRqstNo: 0, // 결과결재요청번호
        createUserId: null, // 등록자아이디
        createDt: null, // 등록일
        updateUserId: null, // 수정자아이디
        updateDt: null, // 수정일
        eduClassCd: null,
        questionLsts: [],
        dataLsts: [],
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
      editable: true,
      insertMode: false,
      updateMode: false,
      compleMode: false,

      eduAttCdItems: [],
      eduCourseItems: [],
      eduTypeCdItems: [],
      eduClassCdItems: [],
      questionUseYnItems: [],
      addUser: '',
      insertUrl: '',
      editUrl: '',
      deleteUrl: '',
      getUrl: '',
      isInsert: false,
      isEdit: false,
      isComple: false,

      attach: null, // 첨부파일컴포넌트
      safSubmitCheck: false,
      safSaveAttachFiles: [],
      safTempDeleteFiles: [],
      safAttachFileGrps: [],
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'eduMaster.eduAttCd': function(newValue, oldValue) {
      this.getEduCourseItems();
    },
    'eduMaster.eduClassCd': function(newValue, oldValue) {
      this.getEduCourseItems();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/

  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.loadComponent();
  },

  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      // URL 셋팅
      this.insertUrl = transactionConfig.saf.education.eduMaster.insert.url;
      this.editUrl = transactionConfig.saf.education.eduMaster.edit.url;
      this.deleteUrl = transactionConfig.saf.education.eduMaster.delete.url;
      this.getUrl = selectConfig.saf.education.eduMaster.get.url;

      this.getEduAttCdItems();
      this.getEduTypeCdItems();
      this.getEduClassCdItems();

      this.eduCourseItems.splice(0, 0, {
        safEduCourseNo: null,
        eduCourseNm: this.$comm.getLangSpecInfoLabel('L0000003394'), /* '선택하세요' */
      });

      this.eduMaster.safEduMstNo = this.popupParam.safEduMstNo;
      this.eduMaster.processStepCd = this.popupParam.processStepCd;

      if (this.popupParam.safEduMstNo === 0) {
        this.updateMode = false;
        this.insertMode = true;
        this.compleMode = false;
      } else {
        this.getDetail();
        this.updateMode = true;
        this.insertMode = false;
        this.compleMode = true;
      }
      
      this.questionUseYnItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), /* '선택하세요' */ },
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, /* '사용' */
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') },  /* '미사용'  */
      ];

      this.setAttachFileGrp();

      
      this.tabItems = [
        { title: this.$comm.getLangSpecInfoLabel('L0000000646'), url: './eduPlanPerson' }, /* 교육대상자 */
        { title: this.$comm.getLangSpecInfoLabel('L0000000654'), url: './eduPlanExam' }, /* 교육문제 */
        { title: this.$comm.getLangSpecInfoLabel('L0000000775'), url: './eduPlanMaterial' }, /* 교육자료 */
        { title: this.$comm.getLangSpecInfoLabel('L0000002843'), url: 'multiFileUpload' }, /* 첨부파일 */
      ];
    },
    getDetail() {
      this.$http.url = this.$format(this.getUrl, this.eduMaster.safEduMstNo);
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.eduMaster = this.$_.clone(_result.data);
          this.addUser =
            String(_result.data.deptNm) + ' / ' + String(_result.data.userNm);
        },
        _error => {
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
        _result => {
          this.eduAttCdItems = this.$_.clone(_result.data);
          this.eduAttCdItems.splice(0, 0, { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), /* '선택하세요' */ });
        },
        _error => {
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
        _result => {
          this.eduTypeCdItems = this.$_.clone(_result.data);
          this.eduTypeCdItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), /* '선택하세요' */
          });
        },
        _error => {
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
        _result => {
          this.eduClassCdItems = this.$_.clone(_result.data);
          this.eduClassCdItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), /* '선택하세요' */
          });
        },
        _error => {
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
        eduTypeCd: this.eduMaster.eduClassCd,
        plantCd: this.eduMaster.plantCd,
      };
      this.$http.request(
        _result => {
          this.eduCourseItems = this.$_.clone(_result.data);
          this.eduCourseItems.splice(0, 0, {
            safEduCourseNo: null,
            eduCourseNm: this.$comm.getLangSpecInfoLabel('L0000003394'), /* '선택하세요' */
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
        _error => {
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

      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } // else if (path === 'imprActTab') this.component = () => import('@/pages/impr/imprActTab');
      else {
        this.component = () => import(`${path}`);
      }
    },
    beforeInsert() {
      this.$validator
        .validateAll()
        .then(_result => {
          if (this.eduMaster.eduUserId === undefined) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', /* 안내 */
              message: 'M0000000724', /* 교육대상자를 선정해 주세요. */
              type: 'warning', // success / info / warning / error
            });
          } else if (this.eduMaster.questionLsts.length <= 0) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', /* 안내 */
              message: 'M0000000283', /* 교육문제를 선택 해 주세요 */
              type: 'warning', // success / info / warning / error
            });
          } else if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', /* 확인 */
              message: 'M0000000011', /* 저장하시겠습니까? */
              type: 'info',
              confirmCallback: () => {
                this.eduMaster.createUserId = this.$store.getters.token;
                this.isInsert = true;
              },
            });
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', /* 안내 */
              message: 'M0000000005', /* 필수입력값을 입력해주세요. */
              type: 'warning', // success / info / warning / error
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
    beforeEdit() {
      this.$validator
        .validateAll()
        .then(_result => {
          if (this.eduMaster.eduUserId === undefined) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', /* 안내 */
              message: 'M0000000724', /* 교육대상자를 선정해 주세요. */
              type: 'warning', // success / info / warning / error
            });
          } else if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', /* 확인 */
              message: 'M0000000011', /* 저장하시겠습니까? */
              type: 'info',
              confirmCallback: () => {
                this.eduMaster.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              },
            });
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', /* 안내 */
              message: 'M0000000005', /* 필수입력값을 입력해주세요. */
              type: 'warning', // success / info / warning / error
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
      this.$validator.validateAll().then(_result => {
        this.validationMessage();
        if (this.eduMaster.eduUserId.length === 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', /* 안내 */
            message: 'M0000000724', /* 교육대상자를 선정해 주세요. */
            type: 'warning', // success / info / warning / error
          });
        } else if (_result) {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321', /* 확인 */
            message: 'M0000000236', /* 완료하시겠습니까? */
            type: 'info',
            confirmCallback: () => {
              this.eduMaster.processStepCd = 'SES02';
              this.eduMaster.updateUserId = this.$store.getters.token;
              this.$validator
                .validateAll()
                .then(_result => {
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
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', /* 확인 */
        message: 'M0000000012', /* 삭제하시겠습니까? */
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.eduMaster.safEduMstNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            _result => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000000007', /* 삭제되었습니다. */
                type: 'success',
              });
              this.closePopup();
            },
            _error => {
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
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000000327'; /* 검색 */
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },

    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.addUser = data.user.deptNm + ' / ' + data.user.userNm;
        this.eduMaster.userId = data.user.userId;
        this.eduMaster.deptCd = data.user.deptCd;
      }
    },

    validationMessage() {
      if (!this.eduMaster.eduSYmd || !this.eduMaster.eduEYmd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', /* 안내 */
          message: 'M0000000726', /* 교육기간을 선택해 주세요. */
          type: 'warning', // success / info / warning / error
        });
        return;
      }
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.eduMaster.safEduMstNo = _result.data;
      this.isInsert = false;
      this.insertMode = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', /* 안내 */
        message: 'M0000000006', /* 저장하였습니다. */
        type: 'success',
      });

      this.getDetail();
      this.saveAttach();
    },
    // 수정
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', /* 안내 */
        message: 'M0000000006', /* 저장하였습니다. */
        type: 'success', // success / info / warning / error
      });
      this.updateMode = true;
      this.insertMode = false;
      this.isEdit = false;
      this.saveAttach();
    },
    // 완료
    btnCompleClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', /* 안내 */
        message: 'M0000000078', /* 완료되었습니다. */
        type: 'success', // success / info / warning / error
      });
      this.closePopup();
    },
    closePopup() {
      this.$emit('closePopup');
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.isComple = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },

    btnAppr() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; /* 결재요청 */
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'EU-ED-01',
        apprParams: {
          safEduMstNo:
            this.popupParam.safEduMstNo === 0
              ? this.eduMaster.safEduMstNo
              : this.popupParam.safEduMstNo,
        },
      };
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.eduMaster.safEduMstNo =
        this.popupParam.safEduMstNo === 0
          ? this.eduMaster.safEduMstNo
          : this.popupParam.safEduMstNo;

      this.getDetail();
    },

    setAttachFileGrp() {
      let taskKey = this.eduMaster.safEduMstNo
        ? this.eduMaster.safEduMstNo.toString()
        : '';
      this.safAttachFileGrps = [
        {
          label: 'L0000000632', /* 교육계획 파일업로드 */
          listType: 'text',
          drag: false,
          editable: false,
          disabled: true,
          showFileSearch: false,
          limit: 10,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'EDUPLAN',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.safAttachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.safAttachFileGrps[index].uploadTempFiles = data;
        let saveIndex = this.$_.findIndex(this.safSaveAttachFiles, {
          taskClassNm: data.taskClassNm,
        });
        if (saveIndex > -1) {
          this.safSaveAttachFiles[saveIndex] = this.$_.clone(
            this.safAttachFileGrps[index]
          );
        } else {
          this.safSaveAttachFiles.push(
            this.$_.clone(this.safAttachFileGrps[index])
          );
        }
      }
    },
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.safTempDeleteFiles.push(pushData);
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.safAttachFileGrps, item => {
        item.taskKey = this.eduMaster.safEduMstNo;
      });
      if (this.safTempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.safTempDeleteFiles)),
        };
        this.$http.request(_result => {
          this.safTempDeleteFiles = [];
          // this.getDetail();
          if (this.safSaveAttachFiles.length > 0) {
            // 저장할 데이터가 있는 경우
            this.safSubmitCheck = !this.safSubmitCheck;
          } else {
            // 저장할 데이터가 없는 경우
            this.submitCheck = !this.submitCheck;
          }
        });
      } else {
        // this.getDetail();
        if (this.safSaveAttachFiles.length > 0) {
          // 저장할 데이터가 있는 경우
          this.safSubmitCheck = !this.safSubmitCheck;
        } else {
          // 저장할 데이터가 없는 경우
          this.submitCheck = !this.submitCheck;
        }
      }
      // this.setBtnVisible(true);
    },
    /** end button 관련 이벤트 **/

    /** /Button Event **/

    /** 기타 function **/

    /** /기타 function **/
  },
};
</script>
