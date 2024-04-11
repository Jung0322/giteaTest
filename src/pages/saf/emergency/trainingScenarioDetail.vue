<!--
  목적 : 안전운전계획 > 비상사태 대비대응 > 훈련시나리오 등록/수정
  작성자 : LHJ
  Detail : 안전운전계획 > 비상사태 대비대응 > 훈련시나리오 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-row>
          <b-col sm="12">
            <!-- 훈련시나리오 상세 L0000003383-->
            <!-- 훈련 매뉴얼 상세 L0000003383-->
            <y-label
              label="L0000005364"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 개정 -->
              <y-btn
                v-if="
                  editable &&
                  popupParam.trainSceNo &&
                  !isRev &&
                  !isEdit &&
                  !popupParam.popMode
                "
                title="L0000000291"
                color="blue"
                @btnClicked="btnRev"
              />
              <!-- 수정 -->
              <y-btn
                v-if="
                  editable &&
                  popupParam.trainSceNo &&
                  !isRev &&
                  !isEdit &&
                  !popupParam.popMode
                "
                title="수정"
                color="orange"
                @btnClicked="btnEdit"
              />
              <!-- 개정완료 -->
              <y-btn
                v-if="editable && isRev"
                title="개정완료"
                color="blue"
                @btnClicked="btnAction"
              />

              <!-- 저장 -->
              <y-btn
                v-if="this.isEdit && editable"
                title="저장"
                color="orange"
                @btnClicked="btnAction"
              />
              <!-- 취소 -->
              <y-btn
                v-if="editable && isCancel"
                title="L0000002920"
                @btnClicked="btnCancelClickedCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClose" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
              <!-- 등록자 -->
              <y-label ui="bootstrap" label="L0000000976"></y-label>
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label
                ui="bootstrap"
                :fieldable="true"
                :label="trainingScenario.createUserNm"
                name="createUserNm"
              ></y-label>
            </b-col>
            <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
              <!-- 등록일 -->
              <y-label ui="bootstrap" label="L0000000973"></y-label>
            </b-col>
            <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
              <y-label
                ui="bootstrap"
                :fieldable="true"
                :label="trainingScenario.createDt"
                name="createDt"
              ></y-label>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable && !popupParam.trainSceNo"
                name="plantCd"
                v-model="trainingScenario.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 주관부서 -->
              <y-tree-dept
                label="L0000002713"
                name="deptCd"
                v-model="trainingScenario.deptCd"
                :plantCd="trainingScenario.plantCd"
                :required="true"
                :editable="editable && !popupParam.trainSceNo && deptEditable"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 분류 -->
              <y-select
                :width="8"
                :editable="editable && !popupParam.trainSceNo"
                :required="true"
                :comboItems="trainSceTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001341"
                name="trainSceTypeCd"
                v-validate="'required'"
                :state="validateState('trainSceTypeCd')"
                v-model="trainingScenario.trainSceTypeCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!--
                 변경발의번호 필수값입력
                 v-validate="'required'"
                 :state="validateState('sceNum')"
                 :required="false" 
              -->
              <!-- 변경발의번호 -->
              <y-text
                :width="8"
                :editable="editable && isRev"
                ui="bootstrap"
                label="L0000004754"
                :maxlength="50"
                name="sceNum"
                v-model="trainingScenario.sceNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 개정번호 -->
              <y-number
                :width="8"
                :editable="editable && isRev"
                ui="bootstrap"
                label="개정번호"
                :maxlength="50"
                name="revNum"
                v-model="trainingScenario.revNum"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 매뉴얼명 -->
              <y-text
                :width="10"
                :editable="editable && (isRev || isEdit)"
                :required="true"
                ui="bootstrap"
                label="L0000005365"
                :maxlength="50"
                name="title"
                v-model="trainingScenario.title"
                v-validate="'required'"
                :state="validateState('title')"
              ></y-text>
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
              <i :class="item.icon"></i>
              {{ $comm.getLangSpecInfoLabel(item.title) }}
            </span>
          </el-tab-pane>
          <keep-alive>
            <component
              :is="component"
              v-if="component"
              :parentEditable="editable && isEdit"
              :trainingScenario.sync="trainingScenario"
              :attachFileGrps="attachFileGrps"
              :submitCheck="submitCheck"
              :saveAttachFiles="saveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
            />
          </keep-alive>
        </el-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'training-sinario-detail',
  props: {
    // 부모로부터 받은 param data
    popupParam: {
      type: Object,
      default: {
        trainSceNo: 0,
        popMode: false,
        revFlag: false,
      },
    },
  },
  data() {
    return {
      trainingScenario: {
        trainSceNo: 0, // 훈련시나리오번호
        trainSceGrpNo: 0, // 훈련시나리오그룹번호
        plantCd: '', // 사업장코드
        deptCd: '', // 부서코드
        trainSceTypeCd: null, // C분류코드
        sceNum: '', // 문서번호
        title: '', // 제목
        revNum: '', // 재개정번호
        contents: '', // 내용
        revContents: '', // 개정내용
        useYn: '', // 사용여부
        delYn: '', // 삭제여부
        createUserId: '', // 등록자ID
        createUserNm: '', // 등록자
        createDt: '', // 등록일_제개정일
        updateUserId: '', // 최종수정자ID
        updateUserNm: '', // 최종수정자
        updateDt: '', // 최종수정일
      },
      tabIndex: 0,
      tabItems: [
        { title: 'L0000000810', url: './trainingScenarioContent' }, // 내용
        // { title: '관련 비상대응시나리오', url: './refEmergencyResponseSinario'}, // 관련 비상대응시나리오
        { title: 'L0000002843', url: 'fileUpload' }, // 첨부파일
        { title: '개정이력', url: './trainingScenarioHistory' }, // 개정이력
      ],

      editable: true, // 수정여부
      searchUrl: '',
      insertUrl: '',
      editUrl: '',
      detailUrl: '',
      isRev: false,
      isEdit: true,
      isCancel: false,
      trainSceTypeItems: [],

      // 첨부파일 그룹
      attachFileGrps: [],
      submitCheck: false,
      saveAttachFiles: [],
      component: null,

      companyEditable: false, // 전사 권한
      plantEditable: false, // 사업장 권한
      deptEditable: false, // 일반 권한
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.popupParam.revFlag) {
        this.tabItems = [
          { title: 'L0000000810', url: './trainingScenarioContent' }, // 내용
          // { title: '관련 비상대응시나리오', url: './refEmergencyResponseSinario'}, // 관련 비상대응시나리오
          { title: 'L0000002843', url: 'fileUpload' }, // 첨부파일,
        ];
      }

      this.editable = this.$route.meta.editable;

      this.$comm.getComboItems('SAF_TRA_SCE_TYPE', false).then((_result) => {
        this.trainSceTypeItems = _result;
      });
      // detail 페이지 초기화 메소드(URL 설정, DataTable Header 설정, detail 상세정보 조회, select item 초기화 등)
      this.insertUrl =
        transactionConfig.sop.emergencyState.trainingScenario.insert.url;
      this.editUrl =
        transactionConfig.sop.emergencyState.trainingScenario.edit.url;
      this.detailUrl =
        selectConfig.sop.emergencyState.trainingScenario.detail.url;

      if (this.popupParam.trainSceNo !== 0) {
        this.getDetail();
      } else {
        this.trainingScenario.createUserNm = this.$store.getters.name;
        this.trainingScenario.createDt = this.$comm.getToday();
        this.setAttachFileGrps();
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
    },

    // detail 상세정보 조회
    getDetail() {
      return new Promise((resolve, reject) => {
        this.$http.url = this.$format(
          this.detailUrl,
          this.popupParam.trainSceNo
        );
        this.$http.type = 'get';
        this.$http.request(
          (_result) => {
            this.trainingScenario = this.$_.clone(_result.data);
            this.isEdit = false;
            this.setAttachFileGrps();
            resolve(true);
          },
          (_error) => {
            reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    btnCancelClickedCallback() {
      this.isRev = false;
      this.isEdit = false;
      this.isCancel = false;
      this.getDetail();
      this.setAttachFileGrps(); // 첨부파일 셋팅
    },
    // 저장하기 전 유효성 검사
    checkValidation() {
      return new Promise((resolve) => {
        this.$validator
          .validateAll()
          .then((_result) => {
            if (_result) {
              resolve(true);
            } else {
              this.$popupRequired.check(
                'trainingScenarioDetail',
                this.$data,
                this.errors
              );
            }
          })
          .catch(() => {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
            );
          });
      });
    },
    // 확인
    confirm(msg) {
      return new Promise((resolve, reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: msg,
          type: 'info',
          confirmCallback: () => {
            this.trainingScenario.createUserId = this.$store.getters.token;
            this.trainingScenario.updateUserId = this.$store.getters.token;
            resolve(true);
          },
          cancelCallback: () => {
            resolve(false);
          },
        });
      });
    },
    // 저장
    saveData() {
      return new Promise((resolve, reject) => {
        let actionType = 'PUT';
        let url = this.editUrl;
        if (!this.popupParam.trainSceNo || this.isRev) {
          actionType = 'POST';
          url = this.insertUrl;
        }

        this.$http.url = url;
        this.$http.type = actionType;
        this.$http.param = this.trainingScenario;
        this.$http.request(
          (_result) => {
            this.popupParam.trainSceNo = _result.data;
            this.isRev = false;
            this.isEdit = false;
            this.isCancel = false;
            this.saveAttach();
            resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            reject(_error);
          }
        );
      });
    },
    // 버튼 액션
    btnAction() {
      let msg = this.isRev ? 'M0000000166' : 'M0000000011'; // 개정하시겠습니까? 저장하시겠습니까?
      let saveMsg = this.isRev
        ? 'M0000000631' // 개정되었습니다.
        : 'M0000000006'; // 저장되었습니다.

      let promises = [
        {
          func: this.checkValidation,
          exceptionMessage: 'M0000000005', // 필수입력값을 입력해주세요.
        },
        { func: this.confirm, param: msg },
        { func: this.saveData },
        { func: this.getDetail, successMessage: saveMsg },
      ];
      this.$comm.orderedPromise(promises);
    },
    btnEdit() {
      this.isEdit = true;
      this.isRev = false;
      this.isCancel = true;
      this.setAttachFileGrps();
    },
    btnRev() {
      this.isRev = true;
      this.isEdit = true;
      this.isCancel = true;
      this.trainingScenario.createUserNm = this.$store.getters.name;
      this.trainingScenario.createDt = this.$comm.getToday();
      this.trainingScenario.sceNum = '';
      this.trainingScenario.title = '';
      this.trainingScenario.contents = '';

      this.attachFileGrps = [
        {
          label: 'L0000003473', // 훈련시나리오 첨부파일
          drag: this.editable,
          showFileSearch: false,
          editable: this.editable && this.isEdit,
          disabled: false,
          uploadTempFiles: null,
          taskClassNm: 'TRAINING_SINARIO', // 현 화면의 첨부파일 키 값
          taskKey: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    btnClose() {
      this.$emit('closePopup', { success: true });
    },

    // tab 페이지를 따로 만들었을 경우 동적으로 component를 load
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'fileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else {
        this.component = () => import(`${path}`);
      }
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
    // 첨부파일 영역 ////////////
    setAttachFileGrps() {
      let taskKey = this.popupParam.trainSceNo
        ? this.popupParam.trainSceNo
        : ''; // 현 모델 키 값

      this.attachFileGrps = [
        {
          label: 'L0000003473', // 훈련시나리오 첨부파일
          drag: this.editable,
          showFileSearch: false,
          editable: this.editable && this.isEdit,
          disabled: false,
          uploadTempFiles: null,
          taskClassNm: 'TRAINING_SINARIO', // 현 화면의 첨부파일 키 값
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
        item.taskKey = this.popupParam.trainSceNo;
      });

      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitCheck = !this.submitCheck;
      }
    },
  },
};
</script>
