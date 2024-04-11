<!--
  목적 : 위험성평가 > 기준정보 > 작업 관리 > 작업단계 탭
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 작업단계 상세 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 순번 -->
            <y-number
              :width="8"
              :editable="editable"
              :maxlength="2"
              :required="true"
              ui="bootstrap"
              type="search"
              label="L0000001707"
              name="jobStepNo"
              v-model="jobStep.jobStepNo"
              v-validate="'required'"
              :state="validateState('jobStepNo')"
            ></y-number>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 순번 -->
            <y-text
              :width="8"
              :editable="editable"
              :maxlength="30"
              :required="true"
              ui="bootstrap"
              label="L0000002382"
              name="jobStepNm"
              v-model="jobStep.jobStepNm"
              v-validate="'required'"
              :state="validateState('jobStepNm')"
            ></y-text>
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <!-- 작업단계 설명 -->
            <y-textarea
              :width="10"
              :editable="editable"
              :maxlength="255"
              :rows="2"
              ui="bootstrap"
              label="L0000002379"
              name="jobStepDesc"
              v-model="jobStep.jobStepDesc"
            ></y-textarea>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
            <!-- 개정번호 -->
            <y-number
              :width="8"
              :editable="editable"
              :maxlength="10"
              :disabled="!revMode"
              :hasSeperator="false"
              :pointNumber="2"
              ui="bootstrap"
              label="L0000000293"
              name="revNo"
              v-model="jobStep.revNo"
            ></y-number>
          </b-col>
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
            <!-- 개정사유 -->
            <y-textarea
              :width="10"
              :editable="editable"
              :maxlength="600"
              :disabled="!revMode"
              ui="bootstrap"
              label="L0000000294"
              name="revContents"
              v-model="jobStep.revContents"
            ></y-textarea>
          </b-col>
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
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
              v-model="jobStep.useYn"
              v-validate="'required'"
              :state="validateState('useYn')"
            ></y-switch>
          </b-col>
        </b-row>

        <div class="float-right">
          <!-- 저장 -->
          <y-btn
            v-if="!jobStep.jobStepId && !revMode && editable"
            :action-url="insertUrl"
            :param="jobStep"
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
            v-if="jobStep.selectedJobStepNo > 0 && !revMode && editable"
            :action-url="editUrl"
            :param="jobStep"
            :is-submit="isEdit"
            title="L0000002474"
            color="orange"
            action-type="PUT"
            beforeSubmit="beforeEdit"
            @beforeEdit="beforeEdit"
            @btnClicked="btnEditClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 개정 -->
          <y-btn
            v-if="jobStep.selectedJobStepNo > 0 && !revMode && editable"
            title="L0000000291"
            color="orange"
            @btnClicked="renewalMode"
          />
          <!-- 개정 -->
          <y-btn
            v-if="revMode && editable"
            :action-url="renewUrl"
            :param="jobStep"
            :is-submit="isRenew"
            title="L0000000291"
            color="orange"
            action-type="POST"
            beforeSubmit="beforeRenew"
            @beforeRenew="beforeRenew"
            @btnClicked="btnRenewClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 취소 -->
          <y-btn
            v-if="revMode && editable"
            title="L0000002920"
            @btnClicked="cancel"
          />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-job-step-detail',
  props: {
    jobStepProp: null,
  },
  data() {
    return {
      tempRevNo: 1,
      tempRevContents: '',
      editable: false,
      revMode: false,
      searchUrl: '',
      insertUrl: '',
      editUrl: '',
      renewUrl: '',
      isInsert: false,
      isEdit: false,
      isRenew: false,
      jobStep: {
        jobId: 0,
        jobStepNo: null,
        jobStepId: 0,
        selectedJobStepNo: 0,
        jobStepNm: '',
        jobStepDesc: '',
        revNo: 0,
        revContents: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
    };
  },
  watch: {
    jobStepProp(_newValue, _oldValue) {
      if (!_oldValue) return;
      this.jobStep = _newValue;
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.rsa.jobStep.list.url;
      this.insertUrl = transactionConfig.rsa.jobStep.insert.url;
      this.editUrl = transactionConfig.rsa.jobStep.edit.url;
      this.renewUrl = transactionConfig.rsa.jobStep.insert.url;

      this.editable = this.$route.meta.editable;

      this.jobStep.jobId = this.jobStepProp.jobId;

      // if (this.jobStep.jobId === 0) this.jobStep.jobId = this.jobStep.jobStepId;
      if (this.jobStepProp.jobStepId > 0) {
        this.jobStep = this.jobStepProp;
        this.getData();
      } else {
        this.jobStep.jobStepNo = null;
        this.jobStep.jobStepNm = '';
        this.jobStep.jobStepDesc = '';
      }
    },
    /** validation checking **/
    // 작업단계순번 & 작업단계명 중복검사
    checkDuplicate(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.searchUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              jobId: this.jobStep.jobStepId,
            };
            this.$http.request(
              (_result) => {
                var jobStepNos = this.$_.map(_result.data, 'jobStepNo');
                var jobStepNms = this.$_.map(_result.data, 'jobStepNm');
                let returnVal = true;
                // 신규등록
                if (flag === 'insert') {
                  if (
                    this.$_.indexOf(
                      jobStepNos,
                      this.$_.parseInt(this.jobStep.jobStepNo)
                    ) > -1
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395',
                      message: 'M0000000661', // 이미 같은 순번이 존재합니다.
                      type: 'warning',
                    });
                    returnVal = false;
                  } else if (
                    this.$_.indexOf(jobStepNms, this.jobStep.jobStepNm) > -1
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395',
                      message: 'M0000000662', // 이미 같은 이름의 작업단계가 존재합니다.
                      type: 'warning',
                    });
                    returnVal = false;
                  }
                  // 수정
                } else if (flag === 'edit') {
                  if (
                    this.$_.indexOf(
                      jobStepNos,
                      this.$_.parseInt(this.jobStep.jobStepNo)
                    ) > -1 &&
                    this.jobStep.selectedJobStepNo.toString() !==
                      this.jobStep.jobStepNo.toString()
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395',
                      message: 'M0000000661', // 이미 같은 순번이 존재합니다.
                      type: 'warning',
                    });
                    returnVal = false;
                  }
                  jobStepNms.splice(
                    this.$_.indexOf(jobStepNos, this.jobStep.selectedJobStepNo),
                    1
                  );
                  if (
                    this.$_.indexOf(jobStepNms, this.jobStep.jobStepNm) > -1
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395',
                      message: 'M0000000662', // 이미 같은 이름의 작업단계가 존재합니다.
                      type: 'warning',
                    });
                    returnVal = false;
                  }
                }
                if (returnVal) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321',
                    message:
                      flag === 'edit'
                        ? 'M0000000011'
                        : flag === 'insert'
                        ? 'M0000000011'
                        : 'M0000000166',
                    type: 'info',
                    confirmCallback: () => {
                      this.jobStep.createUserId = this.$store.getters.token;
                      this.jobStep.updateUserId = this.$store.getters.token;
                      if (flag === 'edit') {
                        this.isEdit = true;
                      } else if (flag === 'insert') {
                        this.isInsert = true;
                      } else if (flag === 'renew') {
                        this.isRenew = true;
                      }
                    },
                    cancelCallback: () => {
                      this.isEdit = false;
                      this.isInsert = false;
                      this.isRenew = false;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000005', // 필수입력값을 입력해주세요.
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 에러
          );
        });
    },
    beforeRenew() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = selectConfig.rsa.jobStep.checkRev.url;
            this.$http.type = 'GET';
            this.$http.param = {
              jobId: this.jobStep.jobStepId,
              jobStepNo: this.jobStep.jobStepNo,
              revNo: this.jobStep.revNo,
            };
            this.$http.request(
              (_result) => {
                let returnVal = true;
                var jobStepNos = this.$_.map(_result.data.datas, 'jobStepNo');
                var jobStepNms = this.$_.map(_result.data.datas, 'jobStepNm');
                if (_result.data.rev.cnt > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    message: 'M0000000663', // 이미 같은 개정번호가 존재합니다.
                    type: 'warning',
                  });
                  returnVal = false;
                } else {
                  if (
                    this.$_.indexOf(
                      jobStepNos,
                      this.$_.parseInt(this.jobStep.jobStepNo)
                    ) > -1 &&
                    this.jobStep.selectedJobStepNo.toString() !==
                      this.jobStep.jobStepNo.toString()
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395',
                      message: 'M0000000661', // 이미 같은 순번이 존재합니다.
                      type: 'warning',
                    });
                    returnVal = false;
                  }
                  jobStepNms.splice(
                    this.$_.indexOf(jobStepNos, this.jobStep.selectedJobStepNo),
                    1
                  );
                  if (
                    this.$_.indexOf(jobStepNms, this.jobStep.jobStepNm) > -1
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395',
                      message: 'M0000000662', // 이미 같은 이름의 작업단계가 존재합니다.
                      type: 'warning',
                    });
                    returnVal = false;
                  }
                }
                if (returnVal) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321',
                    message: 'M0000000166', // 개정하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.jobStep.createUserId = this.$store.getters.token;
                      this.jobStep.updateUserId = this.$store.getters.token;
                      this.isRenew = true;
                    },
                    cancelCallback: () => {
                      this.isRenew = false;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000005', // 필수입력값을 입력해주세요.
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    beforeInsert() {
      this.checkDuplicate('insert');
    },
    beforeEdit() {
      this.checkDuplicate('edit');
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
    /** /validation checking **/

    /** Button Event **/
    // 초기화
    btnClearClickedCallback() {
      Object.assign(this.$data.jobStep, this.$options.data().jobStep);
      // this.jobStep.jobId = this.jobStepId;
      // this.jobStep.jobStepId = this.jobStepId;
      this.jobStep = this.jobStepProp;
      this.$validator.reset();
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.isInsert = false;
      this.jobStep.jobId = _result.data.jobId;
      this.jobStep.jobStepId = _result.data.jobStepId;
      this.jobStep.selectedJobStepNo = _result.data.jobStepNo;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success',
      });
      // 최초 저장시에 탭 나오게
      this.$emit('addRiskTab', _result.data.jobStepId);
    },
    // 수정
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success',
      });
    },
    btnRenewClickedCallback(_result) {
      this.isRenew = false;
      this.revMode = false;
      this.jobStep.jobId = _result.data.jobId;
      this.jobStep.jobStepId = _result.data.jobStepId;
      this.jobStep.selectedJobStepNo = _result.data.jobStepNo;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000168', // 개정되었습니다.
        type: 'success',
      });
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.isRenew = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    renewalMode() {
      // 제개정구분이 개정이 되며 개정번호를 수정할 수 있게 된다.
      this.revMode = true;
      this.tempRevNo = this.$_.clone(this.jobStep.revNo);
      this.tempRevContents = this.$_.clone(this.jobStep.revContents);
    },
    // 개정 취소 버튼
    cancel() {
      this.revMode = false;
      this.jobStep.revNo = this.$_.clone(this.tempRevNo);
      this.jobStep.revContents = this.$_.clone(this.tempRevContents);
    },
    /** /Button Event **/
    getData() {
      this.$http.url = this.$format(
        selectConfig.rsa.jobStep.get.url,
        this.jobStep.jobStepId
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.jobStep = this.$_.clone(_result.data);
          this.jobStep.selectedJobStepNo = _result.data.jobStepNo;
          // this.jobStep.jobStepId = this.$_.clone(this.jobStepId);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>
