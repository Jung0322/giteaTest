<!--
  목적 : 인터록 작동조건 및 가동중지 범위 상세 목록
  Detail : 인터록 작동조건 및 가동중지 범위 상세 화면
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
            <!-- 인터락 작동조건 및 가동중지 상세정보 -->
            <y-label
              label="L0000002246"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="insertCheck&&editable"
                :action-url="insertUrl"
                :param="interLock"
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
                v-if="!insertCheck&&editable"
                :action-url="editUrl"
                :param="interLock"
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
                v-if="!insertCheck&&editable"
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
        <b-card header-class="default-card" body-class="default-body-card" class="py-0">
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="interLock.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
              <!-- <y-select
                :width="baseWidth"
                :comboItems="plantItems"
                :editable="editable"
                :required="true"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="사업장"
                name="plantCd"
                v-model="interLock.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              ></y-select>-->
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 인터록번호 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :maxlength="15"
                :required="true"
                ui="bootstrap"
                label="L0000002247"
                name="interLockNo"
                v-model="interLock.interLockNo"
                v-validate="'required'"
                :state="validateState('interLockNo')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 대상설비 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :maxlength="50"
                :required="true"
                ui="bootstrap"
                label="L0000000931"
                name="facilityNm"
                v-model="interLock.facilityNm"
                v-validate="'required'"
                :state="validateState('facilityNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 온도 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000002028"
                name="temperature"
                v-model="interLock.temperature"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 압력 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000001906"
                name="pressure"
                v-model="interLock.pressure"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 액위 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000001913"
                name="liquidLevel"
                v-model="interLock.liquidLevel"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 기타 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :maxlength="15"
                ui="bootstrap"
                label="L0000000794"
                name="etc"
                v-model="interLock.etc"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 감지기번호 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000000246"
                name="detectorNum"
                v-model="interLock.detectorNum"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 최종작동설비 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000002889"
                name="lastOprFacil"
                v-model="interLock.lastOprFacil"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 가동중지범위 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000000198"
                name="oprStopRange"
                v-model="interLock.oprStopRange"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 점검주기 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000002579"
                name="period"
                v-model="interLock.period"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="500"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="interLock.remark"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
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
        interLockSeq: 0,
      },
    },
  },
  data() {
    return {
      interLock: {
        interLockSeq: 0,
        plantCd: null,
        interLockNo: '',
        facilityNm: '',
        temperature: '',
        pressure: '',
        liquidLevel: '',
        etc: '',
        detectorNum: '',
        lastOprFacil: '',
        oprStopRange: '',
        period: '',
        remark: '',
        useYn: '',
        revNum: '',
        revContents: '',
        createrId: '',
        createDt: '',
        updaterId: '',
        updateDt: '',
      },
      searchUrl: '',
      insertUrl: '',
      editUrl: '',
      deleteUrl: '',
      insertCheckUrl: '',
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
      this.searchUrl = selectConfig.psm.processChart.interLock.get.url;
      this.insertCheckUrl = selectConfig.psm.processChart.interLock.check.url;

      this.insertUrl = transactionConfig.psm.processChart.interLock.insert.url;
      this.editUrl = transactionConfig.psm.processChart.interLock.edit.url;
      this.deleteUrl = transactionConfig.psm.processChart.interLock.delete.url;

      if (this.popupParam.interLockSeq > 0) {
        this.insertCheck = false;
        this.getList();
      }
    },
    getList() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.popupParam.interLockSeq
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.interLock = this.$_.clone(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    checkInterLockNo(flag) {
      this.$http.url = this.$format(
        this.insertCheckUrl,
        this.interLock.interLockSeq,
        this.interLock.interLockNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          if (_result.data === 0 && flag === 'I') this.checkValidationInsert();
          else if (_result.data === 0 && flag === 'E') {
            this.checkValidationEdit();
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000943' // 중복된 인터록 번호가 존재 합니다.
            );
          }
        },
        _error => {
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
      this.$validator.validateAll().then(_result => {
        if (_result) {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321', // 확인
            message: 'M0000000011', // 저장하시겠습니까?
            type: 'info',
            confirmCallback: () => {
              this.interLock.createrId = this.$store.getters.token;
              this.checkInterLockNo('I');
            },
          });
        } else {
          this.$popupRequired.check('interLockDialog', this.$data, this.errors);
        }
      });
    },
    beforeEdit() {
      this.$validator.validateAll().then(_result => {
        if (_result) {
          window.getApp.$emit('CONFIRM', {
            title: 'L0000003321', // 확인
            message: 'M0000000011', // 저장하시겠습니까?
            type: 'info',
            confirmCallback: () => {
              this.interLock.updaterId = this.$store.getters.token;
              this.checkInterLockNo('E');
            },
          });
        } else {
          this.$popupRequired.check('interLockDialog', this.$data, this.errors);
        }
      });
    },
    beforeDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000012', // 삭제하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.deleteValue = {
            data: this.interLock,
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
        .then(_result => {
          this.isInsert = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isInsert) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' // 필수 입력값을 입력해 주세요.
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
        .then(_result => {
          this.isEdit = _result;
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (!this.isEdit) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' // 필수 입력값을 입력해 주세요.
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
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });

      this.closePopup();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * 사용자의 입력을 받는다.
     */
  },
};
</script>

<style>
</style>
