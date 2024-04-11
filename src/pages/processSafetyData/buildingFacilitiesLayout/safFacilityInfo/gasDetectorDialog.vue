<!--
  목적 : 가스누출감지 경보기 설치계획 상세 목록
  Detail : 가스누출감지 경보기 설치계획 상세 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row ref="searchBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 가스누출감지 경보기 설치계획 상세정보 -->
            <y-label
              label="L0000000208"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="insertCheck && editable && !popupParam.search"
                :action-url="insertUrl"
                :param="gasDetector"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="!insertCheck && editable && !popupParam.search"
                :action-url="editUrl"
                :param="gasDetector"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="!insertCheck && editable && !popupParam.search"
                :action-url="deleteUrl"
                :param="deleteValue"
                :is-submit="isDelete"
                title="L0000001495"
                color="red"
                action-type="DELETE"
                beforeSubmit="beforeDelete"
                @beforeDelete="beforeDelete"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card
          header-class="default-card"
          body-class="default-body-card"
          class="py-0"
        >
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                :width="baseWidth"
                type="edit"
                :required="true"
                :disabled="popupParam.search"
                :editable="editable"
                name="plantCd"
                v-model="gasDetector.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 감지기번호 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="15"
                :required="true"
                ui="bootstrap"
                label="L0000000246"
                name="mgrNum"
                v-model="gasDetector.mgrNum"
                v-validate="'required'"
                :state="validateState('mgrNum')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 감지대상 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="50"
                :required="true"
                ui="bootstrap"
                label="L0000000247"
                name="sensingObj"
                v-model="gasDetector.sensingObj"
                v-validate="'required'"
                :state="validateState('sensingObj')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 설치장소 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000003703"
                name="location"
                v-model="gasDetector.location"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 작동시간 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002344"
                name="oprTm"
                v-model="gasDetector.oprTm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 측정방식 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000002934"
                name="detectMethod"
                v-model="gasDetector.detectMethod"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 경보설정값-경보표시 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000004042"
                name="alarmDisplay"
                v-model="gasDetector.alarmDisplay"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 경보설정값-설정범위 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000004103"
                name="alarmRange"
                v-model="gasDetector.alarmRange"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 경보기위치 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000004041"
                name="alarmLocation"
                v-model="gasDetector.alarmLocation"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 정밀도 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002602"
                name="precision"
                v-model="gasDetector.precision"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 경보시조치내용 -->
              <y-textarea
                :width="10"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="200"
                ui="bootstrap"
                label="L0000004308"
                name="measureinfo"
                v-model="gasDetector.measureinfo"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 유지관리 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :disabled="popupParam.search"
                :maxlength="50"
                ui="bootstrap"
                label="L0000002163"
                name="management"
                v-model="gasDetector.management"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 비고(방폭형식) -->
              <y-textarea
                :width="10"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="200"
                ui="bootstrap"
                label="L0000004102"
                name="remark"
                v-model="gasDetector.remark"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 변경발의번호 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                ui="bootstrap"
                label="L0000004754"
                name="chngNum"
                v-model="gasDetector.chngNum"
              ></y-text>
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
  name: 'opr-cond-dialog',
  props: {
    popupParam: {
      type: Object,
      default: {
        gasDetectorNo: 0,
        search: false,
      },
    },
  },
  data() {
    return {
      gasDetector: {
        gasDetectorNo: 0,
        plantCd: null,
        mgrNum: '',
        sensingObj: '',
        location: '',
        oprTm: '',
        detectMethod: '',
        // alarmVal: '',
        alarmDisplay: '',
        alarmRange: '',
        alarmLocation: '',
        precision: '',
        management: '',
        remark: '',
        measureinfo: '',
        useYn: 'Y',
        revNum: '',
        revContents: '',
        createrId: '',
        createDt: '',
        updaterId: '',
        updateDt: '',
        chngNum: '', // 변경발의번호
        safChngNo: 0,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      searchUrl: '',
      insertUrl: '',
      editUrl: '',
      deleteUrl: '',
      isInsert: false,
      isEdit: false,
      isDelete: false,
      insertCheck: true,
      baseWidth: 8,
      editable: false,
      deleteValue: null,
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl =
        selectConfig.psm.buildingFacilitiesLayout.gasDetector.get.url;
      this.insertUrl =
        transactionConfig.psm.buildingFacilitiesLayout.gasDetector.insert.url;
      this.editUrl =
        transactionConfig.psm.buildingFacilitiesLayout.gasDetector.edit.url;
      this.deleteUrl =
        transactionConfig.psm.buildingFacilitiesLayout.gasDetector.delete.url;

      if (this.popupParam.gasDetectorNo > 0) {
        this.insertCheck = false;
        this.getList();
      }
    },
    getList() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.popupParam.gasDetectorNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gasDetector = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
    beforeInsert() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000011' /* 저장하시겠습니까? */,
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.gasDetector.createrId = this.$store.getters.token;
          this.checkValidationInsert();
        },
      });
    },
    beforeEdit() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000060', // 수정하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.gasDetector.updaterId = this.$store.getters.token;
          this.checkValidationEdit();
        },
      });
    },
    beforeDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012', // 삭제하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.deleteValue = {
            data: this.gasDetector,
          };

          this.isDelete = true;
        },
        // 취소 callback 함수
        cancelCallback: () => {
          this.isDelete = false;
        },
      });
    },
    btnDeleteClickedCallback(_result) {
      // window.alert("삭제되었습니다.");
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success', // success / info / warning / error
      });

      this.closePopup();
    },
    checkValidationInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isInsert = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isInsert) {
            this.$popupRequired.check(
              'gasDetectorDialog',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          this.isInsert = false;
        });
    },
    checkValidationEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isEdit = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isEdit) {
            this.$popupRequired.check(
              'gasDetectorDialog',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          this.isEdit = false;
        });
    },
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });

      this.closePopup();
    },
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000836', // 수정되었습니다.
        type: 'success', // success / info / warning / error
      });

      this.closePopup();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    searchMoc() {
      this.popupOptions.param = {
        plantCd: this.gasDetector.plantCd,
        chngRefWorkCd: 'CGRW1',
      };
      this.popupOptions.target = () =>
        import(`${'@/pages/saf/change/changePop.vue'}`);
      this.popupOptions.title = 'L0000001221'; // 변경관리
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.closeCallback = this.closeMocPopup;
    },
    closeMocPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE') {
        this.gasDetector.chngNum = data.chngNum;
        this.gasDetector.safChngNo = data.safChngNo;
      }
    },
    removeMoc() {
      this.gasDetector.chngNum = '';
      this.gasDetector.safChngNo = 0;
    },
    /**
     * 사용자의 입력을 받는다.
     */
  },
};
</script>

<style></style>
