<!--
  목적 : 국소배기장치 설치계획 상세 목록
  Detail : 국소배기장치 설치계획 상세 화면
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
            <!-- 국소배기장치 설치계획서 상세정보 -->
            <y-label
              label="L0000000714"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="insertCheck && editable && !popupParam.search"
                :action-url="insertUrl"
                :param="localVentilation"
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
                :param="localVentilation"
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
                v-model="localVentilation.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 발생원 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="15"
                :required="true"
                ui="bootstrap"
                label="L0000001077"
                name="source"
                v-model="localVentilation.source"
                v-validate="'required'"
                :state="validateState('source')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 공정또는작업장명 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="50"
                :required="true"
                ui="bootstrap"
                label="L0000000533"
                name="processNm"
                v-model="localVentilation.processNm"
                v-validate="'required'"
                :state="validateState('processNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 실내외구분 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="50"
                :required="true"
                ui="bootstrap"
                label="L0000001807"
                name="inoutFlag"
                v-model="localVentilation.inoutFlag"
                v-validate="'required'"
                :state="validateState('inoutFlag')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 유해물질종류 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :disabled="popupParam.search"
                :maxlength="30"
                :required="true"
                ui="bootstrap"
                label="L0000002165"
                name="harmfulType"
                v-model="localVentilation.harmfulType"
                v-validate="'required'"
                :state="validateState('harmfulType')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 후드형식 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000003367"
                name="hoodForm"
                v-model="localVentilation.hoodForm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 후드의 제어풍속(m/s) -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000004047"
                name="hoodVelocity"
                v-model="localVentilation.hoodVelocity"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 덕트내 반송 속도(m/s) -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000004048"
                name="reactionVelocity"
                v-model="localVentilation.reactionVelocity"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 배출풍량(㎥/min) -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000004049"
                name="exairVol"
                v-model="localVentilation.exairVol"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 처리풍량(㎥/min) -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000004050"
                name="prairVol"
                v-model="localVentilation.prairVol"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 전동기-용량(KW) -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000004307"
                name="motorVol"
                v-model="localVentilation.motorVol"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 전동기-방폭형식 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="100"
                ui="bootstrap"
                label="L0000002498"
                name="motorEpForm"
                v-model="localVentilation.motorEpForm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 배기및처리순서 -->
              <y-text
                :width="baseWidth"
                :disabled="popupParam.search"
                :editable="editable"
                :maxlength="100"
                ui="bootstrap"
                label="L0000001135"
                name="airExhaustOrder"
                v-model="localVentilation.airExhaustOrder"
              ></y-text>
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
                v-model="localVentilation.chngNum"
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
        localVentilationNo: 0,
        search: false,
      },
    },
  },
  data() {
    return {
      localVentilation: {
        localVentilationNo: 0,
        plantCd: null,
        source: '',
        processNm: '',
        inoutFlag: '',
        harmfulType: '',
        hoodForm: '',
        hoodVelocity: '',
        reactionVelocity: '',
        // airVol: '',
        exairVol: '',
        prairVol: '',
        motorVol: '',
        motorEpForm: '',
        airExhaustOrder: '',
        remark: '',
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
        selectConfig.psm.buildingFacilitiesLayout.localVentilation.get.url;
      this.insertUrl =
        transactionConfig.psm.buildingFacilitiesLayout.localVentilation.insert.url;
      this.editUrl =
        transactionConfig.psm.buildingFacilitiesLayout.localVentilation.edit.url;
      this.deleteUrl =
        transactionConfig.psm.buildingFacilitiesLayout.localVentilation.delete.url;

      if (this.popupParam.localVentilationNo > 0) {
        this.insertCheck = false;
        this.getList();
      }
    },
    getList() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.popupParam.localVentilationNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.localVentilation = this.$_.clone(_result.data);
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
          this.localVentilation.createrId = this.$store.getters.token;
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
          this.localVentilation.updaterId = this.$store.getters.token;
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
            data: this.localVentilation,
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
              'localVentilationDialog',
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
              'localVentilationDialog',
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
        plantCd: this.localVentilation.plantCd,
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
        this.localVentilation.chngNum = data.chngNum;
        this.localVentilation.safChngNo = data.safChngNo;
      }
    },
    removeMoc() {
      this.localVentilation.chngNum = '';
      this.localVentilation.safChngNo = 0;
    },
    /**
     * 사용자의 입력을 받는다.
     */
  },
};
</script>

<style></style>
