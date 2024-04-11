<!--
  목적 : 교육 자료 등록/수정
  작성자 : kkc
  Detail : 교육 자료 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 교육 자료 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 교육 자료 상세 -->
            <y-label label="L0000000621" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등록자 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000976"
                name="createUserNm"
                v-model="eduMaterial.createUserNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등록일 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000973"
                name="createDt"
                v-model="eduMaterial.createDt"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                :disabled="true"
                name="plantCd"
                v-model="eduMaterial.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
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
                v-model="eduMaterial.eduAttCd"
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
                :comboItems="eduTypeCdItems"
                :disabled="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000659"
                name="eduAttCd"
                v-model="eduMaterial.eduTypeCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('eduTypeCd')"
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
                v-model="eduMaterial.safEduCourseNo"
                :required="true"
                v-validate="'required'"
                :state="validateState('safEduCourseNo')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 제목 -->
              <y-text
                :width="10"
                :editable="editable"
                :required="true"
                :disabled="true"
                :maxlength="60"
                ui="bootstrap"
                label="L0000002616"
                name="title"
                v-model="eduMaterial.title"
                v-validate="'required'"
                :state="validateState('title')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 내용 -->
              <y-textarea
                :width="10"
                :rows="10"
                :maxlength="600"
                :required="true"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000810"
                name="contents"
                v-validate="'required'"
                v-model="eduMaterial.contents"
              ></y-textarea>
            </b-col>
            <el-divider content-position="left">첨부파일</el-divider>
            <component
              :is="attach"
              v-if="attach"
              :submitCheck="submitCheck"
              sm="12"
              :attachFileGrps="attachFileGrps"
              :saveAttachFiles="saveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
              @closePopup="closePopup"
            />
          </b-row>
        </b-card>
        <b-row class="mt-3"></b-row>
        <!-- <el-tabs type="border-card" v-model="tabIndex">
          <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
            <span slot="label">
              <i class="el-icon-date"></i>
              {{ item.title }}
            </span>
            <keep-alive>
              <component
                :is="component"
                v-if="component"
                :eduMaterial.sync="eduMaterial"
                :attachFileGrp.sync="attachFileGrp"
              />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>-->
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'educationMaterialDetail',
  props: {
    popupParam: {
      type: Object,
      default: {
        eduAttNm: '',
        eduCourseNm: '',
        materialNm: '',
        createDt: '',
        createUserNm: '',
        safEduMstNo: 0,
      },
    },
  },
  data: () => ({
    component: null,
    tabIndex: 0,
    eduMaterial: {
      eduMatNo: 0,
      eduAttCd: null,
      plantCd: null,
      eduAttNm: null,
      contents: null,
      eduCourseNm: null,
      eduTypeCd: null,
      materialNm: null,
      createUserNm: null,
      createDt: null,
    },
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
    editable: true,
    insertMode: false,
    updateMode: false,
    compleMode: false,
    eduTypeCdItems: [],
    eduAttCdItems: [],
    eduCourseItems: [],
    insertUrl: '',
    editUrl: '',
    deleteUrl: '',
    getUrl: '',
    isInsert: false,
    isEdit: false,

    // 첨부 파일
    attach: null,
    submitCheck: false,
    saveAttachFiles: [],
    tempDeleteFiles: [],
    attachFileGrps: [],
  }),
  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'eduMaterial.eduAttCd': function(newValue, oldValue) {
      this.getEduCourseItems();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
    this.loadComponent();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      // URL 셋팅
      this.insertUrl = transactionConfig.saf.education.eduProblemMgt.insert.url;
      this.editUrl = transactionConfig.saf.education.eduProblemMgt.edit.url;
      this.deleteUrl = transactionConfig.saf.education.eduProblemMgt.delete.url;
      this.getUrl = selectConfig.saf.education.eduProblemMgt.get.url;

      this.attachFileGrp.taskClassNm = 'EDUCATION';
      this.attachFileGrp.taskKey = this.popupParam.eduAttNm;
      this.attachFileGrp.createUserId = this.$store.getters.token;
      this.attachFileGrp.showUploadBtn = true;
      this.attachFileGrp.drag = true;
      this.attachFileGrp.label = 'L0000003030'; /* 파일업로드 */

      this.getEduAttCdItems();
      this.getEduCourseItems();
      this.getEduTypeCdItems();

      if (this.popupParam.eduMatNo === 0) {
        this.updateMode = false;
        this.insertMode = true;

        this.eduMaterial.createUserNm = this.$store.getters.name;
      } else {
        this.getDetail();

        this.updateMode = true;
        this.insertMode = false;
      }

      this.eduMaterial.createDt = this.$comm
        .moment(this.$comm.getToday())
        .format('YYYY-MM-DD');

      // 첨부파일 셋팅
      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');
      this.setAttachFileGrps();
    },

    getDetail() {
      if (this.popupParam.eduMatNo === undefined) {
        return;
      }

      this.$http.url = this.$format(
        selectConfig.saf.education.eduProblemMgt.get.url,
        this.popupParam.eduMatNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.eduMaterial = this.$_.clone(_result.data);
          this.updateMode = true;
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
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
          this.eduAttCdItems.splice(0, 0, { code: null, codeNm: this.$comm.getLangSpecInfoLabel("L0000003394") /* '선택하세요' */ });
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
        'SAF_EDU_COURSE'
      );
      this.$http.type = 'get';
      this.$http.request(
        _result => {
          this.eduTypeCdItems = this.$_.clone(_result.data);
          this.eduTypeCdItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel("L0000002519") /* '전체' */,
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
        eduAttCd: this.eduMaterial.eduAttCd,
      };
      this.$http.request(
        _result => {
          this.eduCourseItems = this.$_.clone(_result.data);
          this.eduCourseItems.splice(0, 0, {
            safEduCourseNo: null,
            eduCourseNm: this.$comm.getLangSpecInfoLabel("L0000003394"),
          });
          if (
            this.eduMaterial.safEduCourseNo &&
            this.$_.indexOf(
              this.$_.map(this.eduCourseItems, 'safEduCourseNo'),
              this.eduMaterial.safEduCourseNo
            ) === -1
          ) {
            this.eduMaterial.safEduCourseNo = null;
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
    loadComponent() {},
    beforeInsert() {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', /* 확인 */
              message: 'M0000000011', /*  저장하시겠습니까? */
              type: 'info',
              confirmCallback: () => {
                this.eduMaterial.createUserId = this.$store.getters.token;
                this.isInsert = true;
              },
            });
          } else {
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
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', /* 확인 */
              message: 'M0000000060', /* 수정하시겠습니까? */
              type: 'info',
              confirmCallback: () => {
                this.eduMaterial.updateUserId = this.$store.getters.token;
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
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        });
    },
    beforeComple() {},
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', /* 확인 */
        message: 'M0000000012', /* 삭제하시겠습니까? */
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.eduMaterial.eduMatNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            _result => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', /* 안내 */
                message: 'M0000000007', /* 정상적으로 삭제되었습니다. */
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
    // 신규등록
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', /* 안내 */
        message: 'M0000000555', /* 교육자료를 정상적으로 등록하였습니다. */
        type: 'success',
      });

      this.isInsert = false;

      this.eduMaterial.eduMatNo = _result.data;
      this.saveAttach();
    },

    // 첨부파일 관련 메서드
    setAttachFileGrps() {
      let taskKey = this.popupParam.eduMatNo
        ? this.popupParam.eduMatNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000000618', /* 교육 자료 */
          listType: 'text',
          drag: false,
          showFileSearch: false,
          editable: false,
          limit: 5,
          multiple: true,
          onlyDownload: true,
          uploadTempFiles: null,
          taskClassNm: 'EDU_REFERENCE',
          taskKey: taskKey,
          disabled: true,
          taskFlag: '',
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
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
    },
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, item => {
        item.taskKey = this.eduMaterial.eduMatNo;
      });
      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitCheck = !this.submitCheck;
      } else {
        this.closePopup(null);
      } 
    },

    // 수정
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', /* 안내 */
        message: 'M0000000556', /* 정상적으로 수정하였습니다. */
        type: 'success', // success / info / warning / error
      });

      this.isEdit = false;

      this.eduMaterial.eduMatNo = _result.data;
      this.saveAttach();
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
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>