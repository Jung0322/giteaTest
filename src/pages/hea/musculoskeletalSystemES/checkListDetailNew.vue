<!--
  목적 : 근골격계 사전조사 상세
  Detail : 근골격계 사전조사 상세
  examples:
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 체크리스트 상세 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 근골격계 사전조사 상세 -->
            <y-label
              label="L0000000740"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 완료 -->
              <y-btn
                v-if="editable && updateMode && !disabled"
                :param="muscResearch"
                :action-url="completeUrl"
                :is-submit="isFinish"
                title="L0000002039"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeFinish"
                @beforeFinish="beforeFinish"
                @btnClicked="btnFinishClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && !disabled"
                :action-url="saveUrl"
                :param="muscResearch"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="editable && updateMode && !disabled"
                title="L0000001495"
                color="red"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-plant
                :width="8"
                type="edit"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                name="plantCd"
                v-model="muscResearch.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 년도 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="disabled"
                type="year"
                label="L0000000829"
                name="year"
                :default="muscResearch.year"
                v-model="muscResearch.year"
                :required="true"
                v-validate="'required'"
                :state="validateState('year')"
              ></y-datepicker>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 조사계획명 -->
              <y-text
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                :maxlength="50"
                ui="bootstrap"
                label="L0000004373"
                name="researchNm"
                v-model="muscResearch.researchNm"
                v-validate="'required'"
                :state="validateState('researchNm')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 조사내용 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="300"
                ui="bootstrap"
                label="L0000002648"
                name="researchDesc"
                v-model="muscResearch.researchDesc"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 조사기관 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :maxlength="50"
                ui="bootstrap"
                label="L0000002647"
                name="researchOrgNm"
                v-model="muscResearch.researchOrgNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 조사기간 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="disabled"
                label="L0000002646"
                name="periodTemp"
                :default="muscResearch.periodTemp"
                v-model="muscResearch.periodTemp"
                :range="true"
                :required="true"
                v-validate="'required'"
                :state="validateState('periodTemp')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3 mb-3">
              <!-- 조사대상부서 , 부서 추가 -->
              <y-tag-structure
                :width="8"
                itemText="deptNm"
                itemValue="deptCd"
                label="L0000004264"
                :newLabelText="$comm.getLangSpecInfoLabel('L0000001300')"
                :editable="editable"
                :disabled="disabled"
                :name="'muscResearchDepts'"
                v-model="muscResearch.muscResearchDepts"
                :required="true"
                v-validate="'required'"
                :state="validateState('muscResearchDepts')"
                @customNewTag="customNewTag()"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-4">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="disabled"
                :maxlength="300"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="muscResearch.remark"
              ></y-textarea>
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
  /** attributes: name, components, props, data **/
  name: 'check-list-detail-new',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          muscResearchNo: 0,
        };
      },
    },
  },
  data() {
    return {
      muscResearch: {
        muscResearchNo: 0,
        plantCd: '',
        periodTemp: [],
        researchStartDt: '',
        researchEndDt: '',
        researchDesc: '',
        researchOrgNm: '',
        researchNm: '',
        muscResearchStateCd: '',
        remark: '',
        createUserId: '',
        updateUserId: '',
        muscResearchDepts: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '35%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      updateMode: false,
      editable: false,
      disabled: false,
      actionType: 'POST',
      isSave: false,
      isFinish: false,
      searchUrl: '',
      completeUrl: '',
      saveUrl: '',
      deleteUrl: '',
    };
  },
  watch: {},
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

      this.searchUrl = selectConfig.hea.muscResearch.get.url;
      this.saveUrl = transactionConfig.hea.muscResearch.insert.url;
      this.deleteUrl = transactionConfig.hea.muscResearch.delete.url;
      this.completeUrl = transactionConfig.hea.muscResearch.complete.url;

      this.muscResearch.year = this.$comm.getThisYear();

      this.getDetail();
    },
    getDetail() {
      if (!this.popupParam.muscResearchNo) {
        return;
      }
      this.$http.url = this.$format(
        this.searchUrl,
        this.popupParam.muscResearchNo
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.muscResearch = this.$_.clone(_result.data);
          this.muscResearch.periodTemp = [
            this.muscResearch.researchStartDt,
            this.muscResearch.researchEndDt,
          ];
          if (!this.muscResearch.muscResearchDepts) {
            this.muscResearch.muscResearchDepts = [];
          }
          if (this.muscResearch.muscResearchStateCd === 'HMCS1') {
            this.updateMode = true;
          } else if (this.muscResearch.muscResearchStateCd !== 'HMCS1') {
            this.updateMode = false;
            this.disabled = true;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeSave() {
      if (this.popupParam.muscResearchNo) {
        this.saveUrl = transactionConfig.hea.muscResearch.edit.url;
        this.actionType = 'PUT';
        this.checkValidator('edit');
      } else {
        this.saveUrl = transactionConfig.hea.muscResearch.insert.url;
        this.actionType = 'POST';
        this.checkValidator('insert');
      }
    },
    checkValidator(checkMode) {
      if (
        this.muscResearch.periodTemp === null ||
        this.muscResearch.periodTemp.length === 0 ||
        this.muscResearch.periodTemp[0] === null
      ) {
        this.muscResearch.periodTemp = null;
      }
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.muscResearch.createUserId = this.$store.getters.token;
                this.muscResearch.updateUserId = this.$store.getters.token;
                if (
                  this.muscResearch.periodTemp &&
                  this.muscResearch.periodTemp.length > 0
                ) {
                  this.muscResearch.researchStartDt =
                    this.muscResearch.periodTemp[0];
                  this.muscResearch.researchEndDt =
                    this.muscResearch.periodTemp[1];
                }

                this.isSave = true;
              },
            });
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' // '필수 입력값을 입력해 주세요.',
            );
            this.$popupRequired.check(
              'checkListDetailNew',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          this.isSave = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
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
    btnSaveClickedCallback(_result) {
      if (!this.popupParam.muscResearchNo) {
        this.popupParam.muscResearchNo = _result.data;
        this.muscResearch.muscResearchNo = _result.data;
      }
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.getDetail();
      this.updateMode = true;
      this.isSave = false;
    },
    closePopup() {
      this.$emit('closePopup');
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            transactionConfig.hea.muscResearch.delete.url,
            this.muscResearch.muscResearchNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success',
              });
              this.btnClosePopup();
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
    btnClosePopup() {
      this.$emit('closePopup');
    },

    // 완료
    beforeFinish() {
      if (
        this.muscResearch.periodTemp === null ||
        this.muscResearch.periodTemp.length === 0 ||
        this.muscResearch.periodTemp[0] === null
      ) {
        this.muscResearch.periodTemp = null;
      }
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000838', // 완료하시겠습니까?
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.muscResearch.updateUserId = this.$store.getters.token;
                if (
                  this.muscResearch.periodTemp &&
                  this.muscResearch.periodTemp.length > 0
                ) {
                  this.muscResearch.researchStartDt =
                    this.muscResearch.periodTemp[0];
                  this.muscResearch.researchEndDt =
                    this.muscResearch.periodTemp[1];
                }
                this.isFinish = true;
              },
              cancelCallback: () => {
                this.isFinish = false;
              },
            });
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' // '필수 입력값을 입력해 주세요.',
            );
          }
        })
        .catch(() => {
          this.isFinish = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    btnFinishClickedCallback(_result) {
      if (_result.data === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003396',
          message: 'M0000000457', // 완료 처리하는 중 오류가 발생했습니다.
          type: 'error',
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000078', // 완료되었습니다.
          type: 'success',
        });
        this.disabled = true;
        this.updateMode = false;
      }
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      this.isFinish = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    customNewTag() {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000001287'; // 부서
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        multiple: true,
        isSubDeptSelection: true,
        plantCd: this.muscResearch.plantCd,
      };

      this.popupOptions.closeCallback = this.closeDeptPopup;
    },
    closeDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE') {
        this.$_.forEach(data, (item) => {
          if (
            this.$_.findIndex(this.muscResearch.muscResearchDepts, {
              deptCd: item.deptCd,
              deptNm: item.deptNm,
            }) === -1
          ) {
            this.muscResearch.muscResearchDepts.push(item);
          }
        });
      }
    },
  },
};
</script>
