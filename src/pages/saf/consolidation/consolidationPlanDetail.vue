<!--
  목적 : 점검예정일별 점검계획 등록/상세
  Detail : 점검예정일별 점검계획 등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <y-label
              label="합동점검계획 상세"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn
                v-if="updateMode && editable && !disabled"
                color="black"
                title="완료"
                @btnClicked="beforeComplete"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!updateMode && editable && !disabled"
                :action-url="insertUrl"
                :param="checkPlanDetail"
                :is-submit="isEdit"
                title="저장"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="updateMode && editable && !disabled"
                :action-url="editUrl"
                :param="checkPlanDetail"
                :is-submit="isEdit"
                title="저장"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- <y-btn
                v-if="updateMode && editable && !disabled"
                color="red"
                title="삭제"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              /> -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
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
                :disabled="updateMode || disabled"
                name="plantCd"
                v-model="checkPlanDetail.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :required="true"
                :comboItems="consolTypeItems"
                :disabled="updateMode || disabled"
                :editable="editable"
                itemText="safCheckKindNm"
                itemValue="safCheckKindNo"
                ui="bootstrap"
                name="safCheckKindNo"
                label="합동종류"
                v-model="checkPlanDetail.safCheckKindNo"
                v-validate="'required'"
                :state="validateState('safCheckKindNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-dept
                :required="true"
                :editable="editable"
                :disabled="disabled"
                label="점검주관부서"
                name="deptCd"
                :plantCd="checkPlanDetail.plantCd"
                v-model="checkPlanDetail.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-datepicker
                :width="8"
                :required="true"
                :disabled="disabled"
                :editable="editable"
                label="점검예정일"
                name="congChkSchYmd"
                :default="checkPlanDetail.congChkSchYmd"
                v-model="checkPlanDetail.congChkSchYmd"
                v-validate="'required'"
                :state="validateState('congChkSchYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :width="10"
                :maxlength="60"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                ui="bootstrap"
                label="합동점검계획명"
                name="chkTitle"
                v-model="checkPlanDetail.chkTitle"
                v-validate="'required'"
                :state="validateState('chkTitle')"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <el-tabs type="border-card" v-model="tabIndex">
      <el-tab-pane
        v-for="(item, i) in tabItems"
        :key="i"
        stretch
        class="default-tab-pane"
      >
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ item.title }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :checkPlanDetail.sync="checkPlanDetail"
          :disabled.sync="disabled"
          :submitCheck="safSubmitCheck"
          :attachFileGrps="safAttachFileGrps"
          :saveAttachFiles="safSaveAttachFiles"
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
          @isEditMode="setBtnVisible"
        />
      </keep-alive>
    </el-tabs>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'check-result-plan-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safCongChkRsltNo: 0, // 합동점검계획 일련번호
      },
    },
  },
  data: () => ({
    tabItems: [
      { title: '참여부서/업체', url: './checkInspector' },
      { title: '첨부파일', url: 'multiFileUpload' },
    ],
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '500px',
      top: '50px',
      param: {},
      closeCallback: null,
    },
    component: null,
    tabIndex: 0,
    checkPlanDetail: {
      safCongChkRsltNo: 0, //  일련번호
      checkYmd: '', // 점검일
      tgtClsCd: null,
      deptCd: '', // 주관부서코드
      congChkSchYmd: '',
      safCheckKindNo: null,
      chkTitle: '',
      checkOrgCd: '',
      checkStepCd: '',
      checkItemResults: [],
      innerTeamData: [],
      outerTeamData: [],
      consolInspectors: [],
      checkResult: null,
      isResult: 0,
      createUserId: '',
      updateUserId: '',
      plantCd: null, // 사업장 코드
      checkPlanFlag: false, // 탭에 정보 조회 후 등록/수정 판단용 flag
    },
    disabled: false,
    editable: true,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    consolTypeItems: [],
    deleteUrl: '',
    editUrl: '',
    insertUrl: '',
    completeUrl: '',
    selectUrl: '',
    // 첨부파일 관련
    attach: null, // 첨부파일컴포넌트
    safSubmitCheck: false,
    safSaveAttachFiles: [],
    safTempDeleteFiles: [],
    safAttachFileGrps: [],
  }),
  computed: {},
  watch: {
    tabIndex: function (newValue, oldValue) {
      // this.loadComponent();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.checkPlanDetail.safCongChkRsltNo = this.popupParam.safCongChkRsltNo;

      // Url Setting
      this.insertUrl = transactionConfig.saf.consolPlan.insert.url;
      this.editUrl = transactionConfig.saf.consolPlan.edit.url;
      this.deleteUrl = transactionConfig.saf.consolPlan.delete.url;
      this.completeUrl = transactionConfig.saf.consolPlan.complete.url;
      this.selectUrl = selectConfig.saf.consolPlan.get.url;

      this.getConsolKindList();
      this.getDetail();
    },
    getConsolKindList() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        congYn: 'Y',
        plantCd: this.checkPlanDetail.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm: '선택하세요',
          });
          this.consolTypeItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else this.component = () => import(`${path}`);
    },
    getDetail() {
      if (this.checkPlanDetail.safCongChkRsltNo === 0) {
        /**
         * 2020-02-08
         *  무일정등록 추가로 인해 키 값이 없는 경우 체크
         */
        this.setBtnVisible(false);
        this.loadComponent();
      } else {
        this.$http.url = this.$format(
          this.selectUrl,
          this.checkPlanDetail.safCongChkRsltNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.$_.extend(this.checkPlanDetail, _result.data);

            if (_result.data.safCheckKindNo === 0) {
              this.checkPlanDetail.safCheckKindNo = null;
            }
            if (_result.data.checkStepCd === 'CHS02') {
              this.disabled = true;
            }
            this.updateMode = true;

            this.setBtnVisible(true);
            this.loadComponent();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    setBtnVisible(isEditMode) {
      // 점검자 목록이 있으면 수정
      if (isEditMode) {
        this.checkPlanDetail.checkYmd = this.checkPlanDetail.checkYmd
          ? this.checkPlanDetail.checkYmd
          : this.checkPlanDetail.congChkSchYmd;
        if (this.checkPlanDetail.checkStepCd === 'CHS01') {
          this.updateMode = true;
          this.disabled = false;
        } else {
          this.updateMode = false;
          this.disabled = true;
        }
      } else {
        this.checkPlanDetail.checkYmd = this.$comm.getToday();
        this.updateMode = false;
      }
      if (isEditMode) {
        if (this.checkPlanDetail.checkStepCd !== 'CHS01') {
          this.checkPlanDetail.checkPlanFlag = true;
        } else {
          this.checkPlanDetail.checkPlanFlag = false;
        }
      } else {
        this.checkPlanDetail.checkPlanFlag = false;
      }
      this.setAttachFileGrp();
    },
    saveCheckResult(alertTitle) {
      this.$validator
        .validateAll()
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: alertTitle + '하시겠습니까?',
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.checkPlanDetail.createUserId = this.$store.getters.token;
                this.checkPlanDetail.updateUserId = this.$store.getters.token;
                this.checkPlanDetail.checkStepCd = 'CHS01';
                /**
                 * 2020-02-08 KDH
                 *  사업장을 수정가능하도록 풀려져 있는 상태임으로 자신의 사업장이 무조건 들어가는것이 아닌
                 *  사용자가 수정한 사업장으로 등록/ 수정 되도록 변경
                 */
                // this.checkPlanDetail.plantCd = this.$store.getters.plantCd;
                this.checkPlanDetail.consolInspectors = [];
                this.$_.forEach(this.checkPlanDetail.innerTeamData, (item) => {
                  this.checkPlanDetail.consolInspectors.push(item);
                });
                this.$_.forEach(this.checkPlanDetail.outerTeamData, (item) => {
                  this.checkPlanDetail.consolInspectors.push(item);
                });
                this.isEdit = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {
                this.isEdit = false;
              },
            });
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: '안내',
              message: '필수입력값을 입력해주세요.',
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사도중 에러가 발생하였습니다.'
          );
          this.isEdit = false;
        });
    },
    beforeComplete() {
      window.getApp.$emit('CONFIRM', {
        title: '확인',
        message: '완료하시겠습니까?',
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.completeUrl,
            this.checkPlanDetail.safCongChkRsltNo
          );
          this.$http.type = 'PUT';

          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: '안내',
                message: '완료되었습니다.',
                type: 'success', // success / info / warning / error
              });
              this.complete = true;
              this.updateMode = true;
              this.getDetail();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        cancelCallback: () => {},
      });
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeEdit() {
      this.saveCheckResult('저장');
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /** button 관련 이벤트 **/
    btnInsertClickedCallback(_result) {
      this.checkPlanDetail.safCongChkRsltNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      this.getDetail();
      this.saveAttach();
    },
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      this.getDetail();
      this.saveAttach();
    },
    /**
     * 안전점검결과 삭제
     *  삭제 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: '확인',
        message: '삭제하시겠습니까?',
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.checkPlanDetail.safCongChkRsltNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: '안내',
                message: '삭제되었습니다.',
                type: 'success', // success / info / warning / error
              });
              this.closePopup(null);
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
    btnCompleteClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: '안내',
        message: '완료되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.disabled = true;
      this.checkPlanDetail.checkPlanFlag = true;
      this.updateMode = false;
      this.checkPlanDetail.checkStepCd = 'CHS02';
      if (this.safSaveAttachFiles.length > 0) {
        this.saveAttach();
      } else {
        // this.closePopup(null);
      }
      this.setAttachFileGrp();
    },
    searchVendor() {
      this.popupOptions.target = () =>
        import(`${'../../vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = '협력업체';
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        vendorTypeCd: 'CVET1', // 공사업체
        plantCd: this.checkPlanDetail.plantCd,
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        this.checkPlanDetail.tgtVendorCd = data.data.vendorCd;
        this.checkPlanDetail.tgtVendorNm = data.data.vendorNm;
      }
    },
    setAttachFileGrp() {
      let taskKey = this.checkPlanDetail.safCongChkRsltNo
        ? this.checkPlanDetail.safCongChkRsltNo.toString()
        : '';
      this.safAttachFileGrps = [
        {
          label: '파일업로드',
          uploadTempFiles: null,
          taskClassNm: 'CONSOL_DATA',
          taskKey: taskKey,
          drag: !this.disabled,
          editable: this.editable,
          disabled: this.disabled,
          onlyDownload: this.disabled,
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
      this.$_.forEach(this.safAttachFileGrps, (item) => {
        item.taskKey = this.checkPlanDetail.safCongChkRsltNo;
      });
      if (this.safTempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.safTempDeleteFiles)),
        };
        this.$http.request((_result) => {
          this.safTempDeleteFiles = [];
          this.getDetail();
          if (this.safSaveAttachFiles.length > 0) {
            // 저장할 데이터가 있는 경우
            this.safSubmitCheck = !this.safSubmitCheck;
          } else {
            // 저장할 데이터가 없는 경우
            this.submitCheck = !this.submitCheck;
          }
        });
      } else {
        this.getDetail();
        if (this.safSaveAttachFiles.length > 0) {
          // 저장할 데이터가 있는 경우
          this.safSubmitCheck = !this.safSubmitCheck;
        } else {
          // 저장할 데이터가 없는 경우
          this.submitCheck = !this.submitCheck;
        }
      }
      this.setBtnVisible(true);
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
