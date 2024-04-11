<!--
  목적 : 첨부파일 설정 등록/수정
  Detail : 
  *
  examples: 
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 첨부파일 설정정보 -->
            <y-label
              label="L0000002846"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="attachSetting"
                :is-submit="isCreateSubmit"
                title="L0000002474"
                color="orange"
                action-type="post"
                beforeSubmit="beforeCreateSubmit"
                @beforeCreateSubmit="beforeCreateSubmit"
                @btnClicked="btnCreateClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="attachSetting"
                :is-submit="isUpdateSubmit"
                title="L0000002474"
                color="orange"
                action-type="put"
                beforeSubmit="beforeUpdateSubmit"
                @beforeUpdateSubmit="beforeUpdateSubmit"
                @btnClicked="btnUpdateClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 첨부파일구분 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :disabled="updateMode"
                ui="bootstrap"
                label="L0000002848"
                name="taskClassNm"
                v-model="attachSetting.taskClassNm"
                v-validate="'required'"
                :state="validateState('taskClassNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 첨부파일구분설명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000002850"
                name="taskClassDesc"
                v-model="attachSetting.taskClassDesc"
                v-validate="'required'"
                :state="validateState('taskClassDesc')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 허용파일 확장자 -->
              <y-text
                :width="10"
                :editable="editable"
                :required="true"
                ui="bootstrap"
                label="L0000003237"
                name="acceptExt"
                v-model="attachSetting.acceptExt"
                v-validate="'required'"
                :state="validateState('acceptExt')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 업로드가능 파일수 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="limitCntItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="limitCnt"
                label="L0000001940"
                v-model="attachSetting.limitCnt"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 업로드가능 파일크기 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="limitSizeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="limitSize"
                label="L0000001941"
                v-model="attachSetting.limitSize"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 업로드파일 다중선택 가능여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001946"
                name="multipleSelYn"
                selectText="L0000004553"
                unselectText="L0000004554"
                v-model="attachSetting.multipleSelYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- Drag&Drop 가능여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000000109"
                name="dragDropYn"
                selectText="L0000003644"
                unselectText="L0000003645"
                v-model="attachSetting.dragDropYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 미리보기여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001062"
                name="previewYn"
                selectText="L0000003644"
                unselectText="L0000003645"
                v-model="attachSetting.previewYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 설명작성가능여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001579"
                name="pictureExplainYn"
                selectText="L0000003644"
                unselectText="L0000003645"
                v-model="attachSetting.pictureExplainYn"
              />
            </b-col>
            <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="파일암호화여부"
                name="encryptYn"
                selectText="암호화"
                unselectText="비암호화"
                v-model="attachSetting.encryptYn"
              />
            </b-col> -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 사용여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="attachSetting.useYn"
              />
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
  /** attributes: name, components, props, data **/
  name: 'y-code-master-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        taskClassNm: null,
      },
    },
  },
  data() {
    return {
      attachSetting: {
        taskClassNm: null,
        taskClassDesc: null,
        acceptExt: 'txt,xls,xlsx,ppt,pptx,doc,docx,pdf,png,gif,jpg,jpeg',
        limitCnt: '1',
        limitSize: '10',
        multipleSelYn: 'Y',
        multipleSelYnNm: '',
        dragDropYn: 'Y',
        dragDropYnNm: '',
        previewYn: 'N',
        previewYnNm: '',
        pictureExplainYn: 'N',
        pictureExplainYnNm: '',
        encryptYn: 'N',
        encryptYnNm: '',
        useYn: 'Y',
        useYnNm: '',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
      },

      editable: false,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      limitCntItems: [],
      limitSizeItems: [],

      insertUrl: '',
      editUrl: '',
      detailUrl: '',
      checkDuplicateUrl: '',
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {
      this.insertUrl = transactionConfig.manage.attachSetting.insert.url;
      this.editUrl = transactionConfig.manage.attachSetting.edit.url;
      this.detailUrl = selectConfig.manage.attachSetting.get.url;
      this.checkDuplicateUrl =
        selectConfig.manage.attachSetting.checkDuplicate.url;

      this.editable = this.$route.meta.editable;

      this.limitCntItems.push({ code: '1', codeNm: '1개' });
      this.limitCntItems.push({ code: '2', codeNm: '2개' });
      this.limitCntItems.push({ code: '3', codeNm: '3개' });
      this.limitCntItems.push({ code: '5', codeNm: '5개' });
      this.limitCntItems.push({ code: '10', codeNm: '10개' });
      this.limitCntItems.push({ code: '20', codeNm: '20개' });
      this.limitCntItems.push({ code: '99', codeNm: '99개' });

      this.limitSizeItems.push({ code: '10', codeNm: '10MB' });
      this.limitSizeItems.push({ code: '20', codeNm: '20MB' });
      this.limitSizeItems.push({ code: '50', codeNm: '50MB' });
      this.limitSizeItems.push({ code: '100', codeNm: '100MB' });
      this.limitSizeItems.push({ code: '200', codeNm: '200MB' });

      if (
        this.popupParam.taskClassNm != null &&
        this.popupParam.taskClassNm !== ''
      ) {
        this.getDetail();
      }
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.popupParam.taskClassNm
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.attachSetting = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.updateMode = true;

      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000523', // 첨부파일 설정정보를 정상적으로 저장하였습니다.
        type: 'success',
      });
    },
    beforeCreateSubmit() {
      this.$http.url = this.$format(
        this.checkDuplicateUrl,
        this.attachSetting.taskClassNm
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          if (_result.data) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000000524', // 같은 첨부파일 구분명이 존재합니다.
              type: 'warning',
            });
          } else {
            this.$validator
              .validateAll()
              .then((_result) => {
                if (_result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // 확인
                    message: 'M0000000525', // 첨부파일 설정정보를 저장 하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.attachSetting.createUserId =
                        this.$store.getters.token;
                      this.isCreateSubmit = true;
                    },
                    cancelCallback: () => {},
                  });
                } else {
                  this.$popupRequired.check(
                    'attachSettingDetail',
                    this.$data,
                    this.errors
                  );
                }
              })
              .catch(() => {
                window.getApp.$emit(
                  'APP_VALID_ERROR',
                  'M0000000004' // 유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
                );
              });
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;

      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000523', // 첨부파일 설정정보를 정상적으로 저장하였습니다.
        type: 'success',
      });
    },
    beforeUpdateSubmit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000525', // 첨부파일 설정정보를 저장 하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.attachSetting.updateUserId = this.$store.getters.token;
                this.isUpdateSubmit = true;
              },
              cancelCallback: () => {},
            });
          } else {
            this.$popupRequired.check(
              'attachSettingDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // 유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        });
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
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
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
