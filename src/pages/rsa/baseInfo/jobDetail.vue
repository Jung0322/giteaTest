<!--
  목적 : 위험성평가 > 기준정보 > 작업 관리 > 상세정보 탭
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 작업 상세 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 작업 마스터 정보 -->
            <y-label label="L0000002358" icon="user-edit" color-class="cutstom-title-color" />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 작업 등록 -->
              <y-btn 
                v-if="!updateMode&&editable && this.job.jobId === 0"
                :action-url="insertUrl"
                :param="job"
                :is-submit="isInsert"
                title="L0000002387"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 개정 -->
              <y-btn 
                v-if="this.job.jobId > 0 && editable && !renewMode"
                title="L0000000291" 
                color="blue"
                @btnClicked="btnRenew" 
              />
              <!-- 개정완료 -->
              <y-btn
                v-if="renewMode && editable && !editMode"
                :action-url="editUrl"
                :param="job"
                :is-submit="isRenew"
                title="L0000003777"
                color="blue"
                action-type="post"
                beforeSubmit="beforeRenew"
                @beforeRenew="beforeRenew"
                @btnClicked="btnRenewClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 수정 -->
              <y-btn
                v-if="this.job.jobId > 0 && editable && !renewMode"
                title="L0000001696"
                color="orange"
                @btnClicked="btnEdit"
              />              
              <!-- 저장 -->
              <y-btn
                v-if="this.job.jobId > 0 && editable && editMode && !updateMode"
                :action-url="editUrl"
                :param="job"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                :action-type="actionTypeSave"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 취소 -->
              <!-- <y-btn
                v-if="renewMode && editable"
                title="L0000002920"
                @btnClicked="btnCancel"
              /> -->
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="12">
            <b-card>
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <y-plant
                    type="edit"
                    :required="true"
                    :disabled="updateMode"
                    :editable="editable"
                    name="plantCd"
                    v-model="job.plantCd"
                    v-validate="'required'"
                    :state="validateState('plantCd')"
                  />
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                  <y-tree-dept
                    :editable="editable"
                    :disabled="updateMode"
                    :required="true"
                    :plantCd="job.plantCd"
                    v-model="job.deptCd"
                    name="deptCd"
                    v-validate="'required'"
                    :state="validateState('deptCd')"
                  />
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <y-tree-process
                    :required="true"
                    :editable="editable"
                    :disabled="updateMode"
                    name="processCd"
                    type="edit"
                    :showDataMapping="true"
                    :plantCd="job.plantCd"
                    :deptCd="job.deptCd"
                    v-model="job.processCd"
                    v-validate="'required'"
                    :state="validateState('processCd')"
                  ></y-tree-process>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 작업코드 -->
                  <y-text
                    :width="8"
                    :editable="editable"
                    :disabled="updateMode"
                    :maxlength="15"
                    :required="true"
                    ui="bootstrap"
                    label="L0000002423"
                    name="jobCd"
                    v-model="job.jobCd"
                    v-validate="'required'"
                    :state="validateState('jobCd')"
                  ></y-text>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
                  <!-- 작업명 -->
                  <y-text
                    :width="10"
                    :editable="editable"
                    :disabled="updateMode"
                    :maxlength="50"
                    :required="true"
                    ui="bootstrap"
                    label="L0000002389"
                    name="jobNm"
                    v-model="job.jobNm"
                    v-validate="'required'"
                    :state="validateState('jobNm')"
                  ></y-text>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- SOP번호 -->
                  <y-text
                    :width="8"
                    :editable="editable"
                    :disabled="updateMode"
                    :maxlength="15"
                    ui="bootstrap"
                    label="L0000000171"
                    name="sopNo"
                    v-model="job.sopNo"
                  ></y-text>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- SOP명 -->
                  <y-text
                    :width="8"
                    :editable="editable"
                    :disabled="updateMode"
                    :maxlength="50"
                    ui="bootstrap"
                    label="L0000000170"
                    name="sopNm"
                    v-model="job.sopNm"
                  ></y-text>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 변경내용 -->
                  <y-text
                    :width="8"
                    :required="renewMode ? true : false"
                    :editable="editable"
                    :disabled="updateMode"
                    :maxlength="30"
                    ui="bootstrap"
                    label="L0000001227"
                    name="jobCommts"
                    v-model="job.jobCommts"
                  ></y-text>
                </b-col>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- Rev No -->
                  <y-number
                    :width="8"
                    :editable="editable"
                    :disabled="updateMode"
                    :maxlength="2"
                    :required="true"
                    ui="bootstrap"
                    type="search"
                    label="L0000000156"
                    name="jobRevno"
                    v-model="job.jobRevno"
                    v-validate="'required'"
                    :state="validateState('jobRevno')"
                  ></y-number>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                  <!-- 사용여부 -->
                  <y-switch
                    :width="8"
                    :editable="editable"
                    :disabled="updateMode"
                    true-value="Y"
                    false-value="N"
                    ui="bootstrap"
                    label="L0000001439"
                    name="useYn"
                    selectText="L0000001440"
                    unselectText="L0000001063"
                    v-model="job.useYn"
                  ></y-switch>
                </b-col>                
              </b-row>
            </b-card>
          </b-col>
        </b-row>
        <b-row class="mt-3 mb-2">
          <b-col sm="12">
            <!-- 작업 마스터 정보 -->
            <el-tag v-if="popupParam.jobId === 0" size="medium" type="info">
              <i class="el-icon-info"></i> {{$comm.getLangSpecInfoLabel('L0000002359')}}
            </el-tag>
          </b-col>
        </b-row>
        <b-row style="margin-top: 10px;">
          <b-col>
            <el-tabs v-if="!popupParam.popupMode" type="border-card" v-model="tabIndex">
              <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
                <span slot="label">
                  <i class="el-icon-date"></i>
                  {{ $comm.getLangSpecInfoLabel(item.title) }}
                </span>
              </el-tab-pane>
              <keep-alive>
                <component
                  :is="component"
                  v-if="component"
                  :selectedJobId.sync="job.jobId"
                  :selectedJobCd.sync="job.jobCd"
                  :selectedJobRevno.sync="job.jobRevno"
                  :editMode.sync="renewMode"
                />
              </keep-alive>
            </el-tabs>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'y-job-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        selectedJob: null,
        jobId: 0,
      },
    },
    jobArg: {
      plantNm: '',
      deptNm: '',
      processNm: '',
      jobId: 0,
      jobCd: '',
      jobNm: '',
      jobRevno: 0,
    },
  },
  data() {
    return {
      deptTree: [],
      job: {
        jobId: '',
        plantCd: null,
        deptCd: null,
        deptNm: '',
        processCd: null,
        jobCd: '',
        jobRevno: 0,
        jobNm: '',
        sopNo: '',
        sopNm: '',
        jobCommts: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
      },
      isRenew: false,
      editable: false,
      nowJobRevno: 0,
      deptCdItems: [], // 부서
      comboUseYnItems: [], // 사용여부
      countUrl: '',
      detailUrl: '',
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,
      renewMode: false,
      editMode: false,
      actionTypeSave: 'PUT',
      updateMode: false,
      tabItems: [
        { title: 'L0000002375', url: './jobStep' }, // 작업단계
        { title: 'L0000002208', url: './jobHistory' }, // 이력정보
      ],
      component: null,
      tabIndex: 0,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();    
  },
  mounted() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.countUrl = selectConfig.rsa.job.count.url;
      this.detailUrl = selectConfig.rsa.job.get.url;
      this.insertUrl = transactionConfig.rsa.job.insert.url;
      this.editUrl = transactionConfig.rsa.job.edit.url;

      this.editable = this.$route.meta.editable;

      this.comboUseYnItems.push({ code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') }); // 선택하세요
      this.comboUseYnItems.push({ code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }); // 사용
      this.comboUseYnItems.push({ code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }); // 미사용

      this.job.jobId = this.popupParam.jobId ? this.popupParam.jobId : 0;
      this.getDetail();
    },
    resetMode() {
      this.isRenew = false
      this.editable = true
      this.isInsert = false
      this.isEdit = false
      this.renewMode = false
      this.editMode = false
      this.updateMode = false
    },
    // 작업 상세
    getDetail() {
      if (!this.job.jobId) return;
      this.$http.url = this.$format(this.detailUrl, this.job.jobId);
      this.$http.type = 'get';
      this.$http.request(
        _result => {
          this.job = _result.data;
          this.updateMode = true;
          this.nowJobRevno = this.job.jobRevno;
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'fileUploadPage') {
        this.component = () => import('@/pages/saf/imprAct/fileUploadPage');
      } else this.component = () => import(`${path}`);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    /** validation checking **/
    // 신규등록 및 수정 시 중복검사
    checkDuplicate(flag) {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            // 부서,공정별 작업코드 중복검사
            this.$http.url = this.countUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              plantCd: this.job.plantCd,
              jobCd: this.job.jobCd,
              jobNm: this.job.jobNm,
              selectedJobId: this.job.jobId,
              jobRevno: flag === 'edit' || flag === 'renew' ? this.job.jobRevno : -1,
            };
            this.$http.request(
              _result => {                
                let idCheck = this.$_.filter(_result.data, { gubun: 'id' }); // id 체크 값 (사업장, 부서, 공정, 작업코드) -- 본질키
                let nameCheck = this.$_.filter(_result.data, { gubun: 'name' }); // 이름 체크값
                let revCheck = this.$_.filter(_result.data, { gubun: 'rev' }); // 개정번호 체크값
                if (!this.job.jobCommts && flag === 'renew') {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    message:
                      'M0000000957', // 변경내용 입력하세요.
                    type: 'warning',
                  });
                  return;
                }
                if (idCheck[0].cnt > 0 && flag === 'insert') {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message:
                      'M0000000656', // 이미 존재하는 (사업장/공정)별 작업코드입니다.
                    type: 'warning',
                  });
                } else if (nameCheck[0].cnt > 0 && flag !== 'renew') {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000000657', // 이미 존재하는 작업명입니다.
                    type: 'warning',
                  });
                } else if (
                  revCheck[0].cnt > 0 &&
                  flag === 'renew'
                ) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // 안내
                    message: 'M0000000658', // 해당 작업에 이미 존재하는 개정번호입니다.
                    type: 'warning',
                  });
                } else {
                  let msg = '';
                  if (
                    flag !== 'renew'
                  ) {
                    msg = 'M0000000011'; // 저장하시겠습니까?
                  } else {
                    msg = 'M0000000011'; // 저장하시겠습니까?
                  }
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // 확인
                    message: msg,
                    type: 'info',
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.job.updateUserId = this.$store.getters.token;
                      this.job.createUserId = this.$store.getters.token;
                      if (flag === 'insert') {
                        this.isInsert = true;
                      } else {
                        if (
                          flag === 'edit'
                        ) {
                          this.actionTypeSave = 'PUT';
                          this.editUrl = transactionConfig.rsa.job.edit.url;
                          this.isEdit = true;
                        } else {
                          this.actionTypeSave = 'POST';
                          this.editUrl = transactionConfig.rsa.job.insert.url;
                          this.isRenew = true;
                        }
                      }
                      this.isEdit = true;
                    },
                    cancelCallback: () => {
                      if (flag === 'insert') {
                        this.isInsert = false;
                      } else {
                        this.isEdit = false;
                      }
                    },
                  });
                }
              },
              _error => {
                this.isInsert = false;
                this.isEdit = false;
                this.isRenew = false;
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else if (!_result) {
            this.$popupRequired.check('jobDetail', this.$data, this.errors);
            this.isInsert = false;
            this.isEdit = false;
            this.isRenew = false;
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876'
          );
          this.isInsert = false;
          this.isEdit = false;
        });
    },
    beforeInsert() {
      this.checkDuplicate('insert');
    },
    beforeEdit() {
      this.checkDuplicate('edit');
    },
    
    beforeRenew() {
      this.checkDuplicate('renew');
    },
    btnRenew() {
      this.renewMode = true;
      this.updateMode = false
    },
    btnEdit() {
      this.editMode = true
      this.renewMode = true
      this.updateMode = false
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

    // 신규등록
    btnInsertClickedCallback(_result) {
      this.$emit('getDataList');
      this.isInsert = false;
      this.renewMode = false;
      this.job.jobId = _result.data;
      this.nowJobRevno = this.job.jobRevno;
      this.getDetail();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.resetMode()
    },
    // 수정
    btnEditClickedCallback(_result) {
      this.$emit('getDataList');
      this.isEdit = false;
      this.renewMode = false;
      this.updateMode = true
      this.editMode = false
      this.job.jobId = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.nowJobRevno = this.job.jobRevno;
    },
    btnRenewClickedCallback(_result) {
      this.$emit('getDataList');
      this.isRenew = false;
      this.renewMode = false;
      this.updateMode = true
      this.editMode = false      
      this.job.jobId = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000631', // 개정되었습니다.
        type: 'success',
      });
      this.nowJobRevno = this.job.jobRevno;
      this.resetMode()
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.isRenew = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    btnCancel() {
      this.renewMode = false;
      this.updateMode = true
      this.editMode = false
      this.job.jobRevno = this.$_.clone(this.nowJobRevno)
      this.job.jobCommts = this.$_.clone(this.nowJobComments);
    },
    /** /Button Event **/
  },
};
</script>