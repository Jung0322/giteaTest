<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- PSM 감사계획 상세 -->
            <y-label label="L0000000143" icon="user-edit" color-class="cutstom-title-color" />
            <div
              slot="buttonGroup"
              class="float-right mb-1"
              v-if="safPsmAuditRslt.planApprRqstCd === 'BAPSD'"
            >
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
            <div
              slot="buttonGroup"
              class="float-right mb-1"
              v-if="safPsmAuditRslt.planApprRqstCd !== 'BAPSD'"
            >
              <!-- 감사결과 보고서 -->
              <y-btn v-if="safPsmAuditRslt.sortOrder > 3" title="L0000000226" @btnClicked="psmPrint" color="black" />
              <!-- 결과결재요청 -->
              <y-btn
                v-if="safPsmAuditRslt.sortOrder > 3 && safPsmAuditRslt.sortOrder < 5"
                title="L0000003787"
                color="black"
                @btnClicked="btnApprRequest"
              />
              <!-- 결과완료 -->
              <y-btn
                v-if="editable && !disabled && popupParam.auditRsltNo > 0"
                :isFileRequestPost="true"
                :action-url="completeUrl"
                :param="saveData"
                :is-submit="isComplete"
                title="L0000000412"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeComplete"
                @beforeComplete="beforeComplete"
                @btnClicked="beforeCompleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && !disabled"
                :isFileRequestPost="true"
                :action-url="saveUrl"
                :param="saveData"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-3">
              <b-row>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 사업장 -->
                  <y-label label="L0000001415" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="safPsmAuditRslt.plantNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 년도 -->
                  <y-label label="L0000000829" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                 <!--  년 -->
                  <y-label :label="safPsmAuditRslt.auditYear + this.$comm.getLangSpecInfoLabel('L0000000828')" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 감사종류 -->
                  <y-label label="L0000000238" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="safPsmAuditRslt.auditTypeNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 대상기간 -->
                  <y-label label="L0000000921" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="safPsmAuditRslt.targetDt" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <!-- 감사기간 -->
                  <y-label label="L0000000228" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="safPsmAuditRslt.auditDt" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 감사명 -->
                  <y-label label="L0000000232" />
                </b-col>
                <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10">
                  <y-label :label="safPsmAuditRslt.auditNm" :fieldable="true" />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 대상부서 -->
                  <y-label label="L0000000927" />
                </b-col>
                <b-col sm="10" md="10" lg="10" xl="10" class="col-xxl-10">
                  <y-label
                    v-for="(dept, index) in safPsmAuditRslt.safPsmAuditRsltDepts"
                    :key="dept.targetDeptCd"
                    :label="index < (safPsmAuditRslt.safPsmAuditRsltDepts.length -1) ? dept.targetDeptNm+',' : dept.targetDeptNm "
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 감사원의 역할과 책임 -->
                  <y-label label="L0000000236" />
                </b-col>
                <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-5">
                  <!-- 선임감사원 -->
                  <y-textarea
                    :width="12"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000001555"
                    name="col3"
                    v-model="safPsmAuditRslt.seniorAudidorRole"
                  ></y-textarea>
                </b-col>
                <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-5">
                  <!-- 감사원 -->
                  <y-textarea
                    :width="12"
                    :disabled="true"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000000234"
                    name="col4"
                    v-model="safPsmAuditRslt.audidorRole"
                  ></y-textarea>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 감사원 소견 -->
                  <y-label label="L0000000235" />
                </b-col>
                <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-5">
                  <!-- 선임감사원 -->
                  <y-textarea
                    :width="12"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000001555"
                    name="seniorAuditorRemark"
                    v-model="safPsmAuditRslt.seniorAuditorRemark"
                  ></y-textarea>
                </b-col>
                <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-5">
                  <!-- 감사원 -->
                  <y-textarea
                    :width="12"
                    :disabled="disabled"
                    :editable="editable"
                    ui="bootstrap"
                    label="L0000000234"
                    name="auditorRemark"
                    v-model="safPsmAuditRslt.auditorRemark"
                  ></y-textarea>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 차기감사시 반영사항 -->
              <y-textarea
                :width="10"
                :disabled="disabled"
                :editable="editable"
                ui="bootstrap"
                label="L0000002792"
                name="nextRemark"
                v-model="safPsmAuditRslt.nextRemark"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="safPsmAuditRslt.remark"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <!-- @tab-click="tabClick" -->
    <el-tabs type="border-card" v-model="tabIndex">
      <el-tab-pane v-for="(item, i) in tabItems" :key="i" stretch class="default-tab-pane">
        <span slot="label">
          <i class="el-icon-date"></i>
          {{ $comm.getLangSpecInfoLabel(item.title) }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          ref="tabcomponent"
          :is="component"
          v-if="component"
          :disabled="tabDisabled"
          :disabled2="disabled2"
          :safPsmAuditRslt.sync="safPsmAuditRslt"
          :tabParam.sync="tabParam"
          :submitObject.sync="submitObject"
          :attachFileGrps.sync="attachFileGrps"
          :saveAttachFiles.sync="saveAttachFiles"
          :research.sync="research"
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
          @closePopup="closePopup2"
          @reload="reload"
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
  name: 'audit-plan-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        auditRsltNo: 0,
      },
    },
  },
  data() {
    return {
      saveData: {
        safPsmAuditRslt: '',
        taskClassNm: 'AUDIT_RSLT',
        files: [],
      },
      safPsmAuditRslt: {
        auditRsltNo: 0,
        plantCd: '',
        plantNm: '', // 사업장명
        auditType: '',
        auditTypeNm: '', // 감사종류명
        auditYear: '', // 년도
        targetDt: '', // 대상기간
        targetStartDt: '',
        targetEndDt: '',
        auditDt: '', // 감사기간
        auditStartDt: '',
        auditEndDt: '',
        auditNm: '', // 감사명
        seniorAudidorRole: '', // 선임감사원 역할과 책임
        audidorRole: '', // 감사원 역할과 책임
        seniorAuditorRemark: '', // 비고(선임감사원)
        auditorRemark: '', // 비고(감사원)
        nextRemark: '', // 차기감사시반영사항
        remark: '',
        psmProgState: '',
        sortOrder: 0,
        period1: [],
        period2: [],
        createUserId: '',
        updateUserId: '',
        planApprRqstCd: '',
        safPsmAuditRsltDepts: [], // 감사결과 대상부서
        safPsmAuditRsltUsers: [], // 감사결과 감사원
        safPsmAuditRsltStds: [], // 감사결과_기준
        safPsmAuditRsltImprs: [], // 감사결과_개선사항
        deleteSafPsmAuditRsltImprs: [], // 삭제할 감사결과_개선사항
      },
      tabItems: [
        { title: 'L0000000239', url: '/saf/psm/auditUserPlan' }, /* 감사팀 */
        { title: 'L0000000233', url: '/saf/psm/auditItemPlan' }, /* 감사범위 */
        { title: 'L0000000225', url: '/saf/psm/auditItemResult' }, /* 감사결과 */
        { title: 'L0000000259', url: 'auditImprActTab' }, /* 개선사항 */
        { title: 'L0000002843', url: 'multiFileUpload' }, /* 첨부파일 */
      ],
      component: null,
      tabIndex: 0,
      // 개선조치를 위한 변수
      tabParam: {
        imprClassCd: 'ICL30',
        refTableId: 0,
        editable: true,
        detailCheck: true,
        tabClickCnt: 0,
      },
      submitObject: {
        submitCheck: false,
      },
      attachFileGrps: [],
      saveAttachFiles: [],
      tempDeleteFiles: [],
      disabled: false,
      disabled2: false,
      editable: false,
      tabDisabled: true,
      selectedValue: [],
      searchDetailUrl: '',
      saveUrl: '',
      isSave: false,
      actionType: 'PUT',
      isComplete: false,
      isAppr: false,
      printUrl: '',
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
        gridRow: '',
      },
      isReject: false,
    };
  },
  watch: {
    tabIndex: function (newValue, oldValue) {
      if (Number(newValue) !== Number(oldValue)) {
        this.loadComponent();
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchDetailUrl = selectConfig.saf.auditResult.get.url;
      this.saveUrl = transactionConfig.saf.auditResult.edit.url;
      this.completeUrl = transactionConfig.saf.auditResult.complete.url;
      this.printUrl = selectConfig.saf.auditResult.print.url;
      this.editable = this.$route.meta.editable;

      this.getDetail();
      this.setAttachFileGrps();
    },
    getDetail() {
      // 탭에 있는 정보들도 다 같이 들고와서 표시한다.
      // 탭에 있는 정보를 들고 오지 않을 시에 validation 체크 및 정보 저장에 대한 대처가 어렵
      if (!this.popupParam.auditRsltNo) {
        return;
      }
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.auditRsltNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.safPsmAuditRslt = this.$_.clone(_result.data);
          if (
            this.safPsmAuditRslt.psmProgState === 'PPS40' ||
            this.safPsmAuditRslt.psmProgState === 'PPS50' ||
            this.safPsmAuditRslt.psmProgState === 'PPS60'
          ) {
            this.disabled = true;
            this.disabled2 = true;
            this.tabDisabled = true;
            this.editable = false;
          } else {
            this.disabled = false;
            this.disabled2 = false;
            this.tabDisabled = true;

            this.tabParam.detailCheck = false;
            this.tabParam.refTableId = this.safPsmAuditRslt.auditRsltNo;
            this.tabParam.message = '';

            // 저장 후 조회를 하게되며 탭의 정보를 저장된 데이터로 잘 가지고 올 수 있도록 처리
            this.research = !this.research;
          }
          this.loadComponent();
          // this.setAttachFileGrps();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setAttachFileGrps() {
      let taskKey = this.popupParam.auditRsltNo
        ? this.popupParam.auditRsltNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000003030', /* 파일업로드 */
          listType: 'text',
          drag: false,
          showFileSearch: !(this.disabled && this.disabled2),
          editable: this.editable,
          disabled: this.disabled && this.disabled2,
          limit: 10,
          multiple: true,
          onlyDownload: this.disabled && this.disabled2,
          uploadTempFiles: null,
          taskClassNm: 'AUDIT_PLAN',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === 'auditImprActTab') {
        this.tabParam.tabClickCnt = this.tabParam.tabClickCnt + 1;
        this.component = () => import('@/pages/saf/psm/auditImprActTab.vue');
      } else this.component = () => import(`@/pages${path}`);
    },
    beforeSave() {
      this.saveUrl = transactionConfig.saf.auditResult.edit.url;
      this.actionType = 'PUT';
      this.checkValidator('edit');
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000011', /* 저장하시겠습니까? */
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.safPsmAuditRslt.updateUserId = this.$store.getters.token;

                this.saveData.files = this.safPsmAuditRslt.files;
                this.saveData.safPsmAuditRslt = JSON.stringify(
                  this.safPsmAuditRslt
                );

                this.isSave = true;
              },
            });
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' /*  필수 입력값을 입력해 주세요. */
            );
          }
        })
        .catch(() => {
          this.isSave = false;
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' /*  유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', /* 안내 */
        message: 'M0000000006', /* 저장되었습니다. */
        type: 'success',
      });
      if (!this.popupParam.auditRsltNo) {
        this.popupParam.auditRsltNo = _result.data;
        this.safPsmAuditRslt.auditRsltNo = _result.data;
      }
      this.isSave = false;
      this.saveAttach();
      this.getDetail();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      this.isComplete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
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
    closePopup2() {},
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.safPsmAuditRslt.auditRsltNo;
      });

      if (this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        this.$http.request(
          (_result) => {
            this.tempDeleteFiles = [];
            // 저장할 데이터가 있는 경우
            if (this.saveAttachFiles.length > 0) {
              this.submitObject.submitCheck = !this.submitObject.submitCheck;
            }
            // 저장할 데이터가 없는 경우
            // else this.closePopup();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitObject.submitCheck = !this.submitObject.submitCheck;
        }
        // 저장할 데이터가 없는 경우
        // else this.closePopup();
      }
    },
    psmPrint() {
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = this.$format(this.printUrl, this.popupParam.auditRsltNo);
      this.$http.type = 'GET'; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.request(
        (_result) => {
          let fileOrgNm =
          /* 자체감사 결과 보고서_날짜.pdf */
            '자체감사 결과 보고서_' + this.$comm.getToday() + '.pdf'; 
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // tabClick(tab) {
    //   if (tab.index > 2) {
    //     if (
    //       this.safPsmAuditRslt.psmProgState === 'PPS40' ||
    //       this.safPsmAuditRslt.psmProgState === 'PPS50' ||
    //       this.safPsmAuditRslt.psmProgState === 'PPS60'
    //     ) {
    //       this.tabDisabled = true;
    //       this.disabled2 = true;
    //     } else {
    //       this.tabDisabled = true;
    //       this.disabled2 = false;
    //     }
    //   } else {
    //     this.tabDisabled = true;
    //   }
    // },
    beforeComplete() {
      if (
        this.safPsmAuditRslt.seniorAuditorRemark === null ||
        this.safPsmAuditRslt.seniorAuditorRemark === ''
      ) {
        window.getApp.$emit(
          'APP_VALID_ERROR',
          'M0000000921'  /* 선임 감사원 소견을 입력해 주세요. */
        );
        return;
      }
      if (
        this.safPsmAuditRslt.auditorRemark === null ||
        this.safPsmAuditRslt.auditorRemark === ''
      ) {
        window.getApp.$emit('APP_VALID_ERROR', 'M0000000922');  /* 감사원 소견을 입력해 주세요 */
        return;
      }
      // let saveComp = true;
      // if (
      //   this.safPsmAuditRslt.safPsmAuditRsltDepts != null &&
      //   this.safPsmAuditRslt.safPsmAuditRsltDepts.length > 0
      // ) {
      //   this.$_.forEach(this.safPsmAuditRslt.safPsmAuditRsltDepts, (dept) => {
      //     if (
      //       dept.safPsmAuditRsltDeptStds != null &&
      //       dept.safPsmAuditRsltDeptStds.length > 0
      //     ) {
      //       this.$_.forEach(dept.safPsmAuditRsltDeptStds, (std) => {
      //         if (std.auditorDesc === null || std.auditorDesc === '') {
      //           saveComp = false;
      //         } else {
      //           if (
      //             std.safPsmAuditRsltItems != null &&
      //             std.safPsmAuditRsltItems.length > 0
      //           ) {
      //             this.$_.forEach(std.safPsmAuditRsltItems, (item) => {
      //               if (
      //                 item.resultRemark === null ||
      //                 item.resultRemark === ''
      //               ) {
      //                 saveComp = false;
      //               } else if (
      //                 item.resultValue === null ||
      //                 item.resultValue === ''
      //               ) {
      //                 saveComp = false;
      //               }
      //             });
      //           }
      //         }
      //       });
      //     }
      //   });
      // }
      // if (saveComp) {
      this.beforeSaveComplete();
      // } else {
      //   window.getApp.$emit('APP_VALID_ERROR', '감사 결과를 입력해 주세요.');
      // }
    },
    beforeSaveComplete() {
      this.$validator
        .validateAll()
        // eslint-disable-next-line complexity
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000768', /* 결과 완료하시겠습니까? */
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.safPsmAuditRslt.updateUserId = this.$store.getters.token;

                this.saveData.files = this.safPsmAuditRslt.files;
                this.saveData.safPsmAuditRslt = JSON.stringify(
                  this.safPsmAuditRslt
                );
                this.isComplete = true;
              },
            });
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' /* 필수 입력값을 입력해 주세요. */
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALIpD_ERROR',
            'M0000000876' /*  유효성 검사도중 에러가 발생하였습니다. */
          );
          this.isComplete = false;
        });
    },
    beforeCompleteClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', /* 안내 */
        message: 'M0000000769', /* 결과 완료되었습니다. */
        type: 'success', // success / info / warning / error
      });
      this.isComplete = false;
      this.$http.isFileRequestPost = false;
      this.research = !this.research;

      this.safPsmAuditRslt.auditRsltNo = _result.data;
      this.popupParam.auditRsltNo = _result.data;

      this.saveAttach();
      this.setAttachFileGrps();
      this.getDetail();

      this.disabled = true;
    },
    btnApprRequest() {
      this.$validator
        .validateAll()
        // eslint-disable-next-line complexity
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000770', /* 결과결재요청하시겠습니까? */
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.isAppr = true;
                this.openAppr();
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALIpD_ERROR',
            'M0000000876' /*  유효성 검사도중 에러가 발생하였습니다. */
          );
          this.isComplete = false;
        });
    },
    openAppr() {

      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; /* 결재요청 */
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.param = {
        apprBizCd: 'SA-AU-02',
        detailUrl: '/saf/psm/auditResultDetailAppr',
        apprParams: {
          auditRsltNo:
            this.popupParam.auditRsltNo === 0
              ? this.safPsmAuditRslt.auditRsltNo
              : this.popupParam.auditRsltNo,
        },
      };
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.isAppr = false;
      this.getDetail();
    },
    validateState(_ref) {
      if (!_ref) return;
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },
    reload() { // 개선요청 이후 한번 getDetail불러와야함. (개선list model에 담겨지지 않음.)
      this.getDetail();
    }
  },
};
</script>