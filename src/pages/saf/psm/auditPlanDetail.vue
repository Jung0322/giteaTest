<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- PSM 감사계획 상세 -->
            <y-label
              label="L0000000143"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  editable &&
                  !disabled &&
                  popupParam.auditRsltNo > 0 &&
                  !isReject
                "
                title="L0000003418"
                color="black"
                @btnClicked="openAppr"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && !disabled && popupParam.auditRsltNo === 0"
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
              <y-btn
                v-if="editable && !disabled && popupParam.auditRsltNo > 0"
                title="L0000002474"
                color="orange"
                @btnClicked="btnSave"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="
                  editable &&
                  !disabled &&
                  popupParam.auditRsltNo > 0 &&
                  !isReject
                "
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
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-3">
              <b-row>
                <b-col sm="6">
                  <y-plant
                    type="edit"
                    :editable="editable"
                    :disabled="isDisabled"
                    name="plantCd"
                    v-model="safPsmAuditRslt.plantCd"
                    v-validate="'required'"
                    :state="validateState('plantCd')"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 년도 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="isDisabled"
                :required="true"
                type="year"
                label="L0000000829"
                name="auditYear"
                v-model="safPsmAuditRslt.auditYear"
                v-validate="'required'"
                :state="validateState('auditYear')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 감사종류 -->
              <y-select
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                :comboItems="kindItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000238"
                name="auditType"
                v-model="safPsmAuditRslt.auditType"
                v-validate="'required'"
                :state="validateState('auditType')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 대상기간 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                :range="true"
                label="L0000000921"
                name="period1"
                v-model="safPsmAuditRslt.period1"
                v-validate="'required'"
                :state="validateState('period1')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 감사기간 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="disabled"
                :required="true"
                :range="true"
                label="L0000000228"
                name="period2"
                v-model="safPsmAuditRslt.period2"
                v-validate="'required'"
                :state="validateState('period2')"
              ></y-datepicker>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 감사명 -->
              <y-text
                :width="10"
                :required="true"
                :editable="editable"
                :disabled="disabled"
                :maxlength="100"
                ui="bootstrap"
                label="L0000000232"
                name="auditNm"
                v-model="safPsmAuditRslt.auditNm"
                v-validate="'required'"
                :state="validateState('auditNm')"
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 대상부서 -->
                  <y-label label="L0000000927" :required="true" />
                </b-col>
                <b-col
                  sm="10"
                  md="10"
                  lg="10"
                  xl="10"
                  class="col-xxl-10"
                  style="
                    max-height: 300px;
                    overflow-y: auto;
                    overflow-x: hidden;
                  "
                >
                  <!-- 부서 추가 -->
                  <y-tag-structure
                    :width="12"
                    :editable="editable && !disabled"
                    itemText="targetDeptNm"
                    itemValue="targetDeptCd"
                    :newLabelText="$comm.getLangSpecInfoLabel('L0000001300')"
                    v-model="safPsmAuditRslt.safPsmAuditRsltDepts"
                    name="plants"
                    v-validate="'required'"
                    :state="validateState('safPsmAuditRsltDepts')"
                    @customNewTag="customNewTag"
                  />
                </b-col>
                <!-- <b-col
                  v-else
                  sm="10"
                  md="10"
                  lg="10"
                  xl="10"
                  class="col-xxl-10"
                  style="max-height:300px;overflow-y:auto;overflow-x:hidden"
                >
                  <li v-for="(dept, i) in safPsmAuditRslt.safPsmAuditRsltDepts" :key="i">
                    <span>{{dept.targetDeptNm}}</span>
                  </li>
                </b-col>-->
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <b-row>
                <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2">
                  <!-- 감사원의 역할과 책임 -->
                  <y-label label="L0000000236" />
                </b-col>
                <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-5">
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 선임감사원 -->
                      <y-textarea
                        :width="12"
                        :maxlength="200"
                        :editable="editable"
                        :disabled="disabled"
                        ui="bootstrap"
                        label="L0000001555"
                        name="seniorAudidorRole"
                        v-model="safPsmAuditRslt.seniorAudidorRole"
                      ></y-textarea>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col sm="5" md="5" lg="5" xl="5" class="col-xxl-5">
                  <b-row>
                    <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                      <!-- 감사원 -->
                      <y-textarea
                        :width="12"
                        :maxlength="200"
                        :editable="editable"
                        :disabled="disabled"
                        ui="bootstrap"
                        label="L0000000234"
                        name="audidorRole"
                        v-model="safPsmAuditRslt.audidorRole"
                      ></y-textarea>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :maxlength="200"
                :editable="editable"
                :disabled="disabled"
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
    <el-tabs type="border-card" v-model="tabIndex">
      <el-tab-pane
        v-for="(item, i) in tabItems"
        :key="i"
        stretch
        class="default-tab-pane"
      >
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
          :disabled="disabled"
          :safPsmAuditRslt.sync="safPsmAuditRslt"
          :submitObject.sync="submitObject"
          :attachFileGrps.sync="attachFileGrps"
          :saveAttachFiles.sync="saveAttachFiles"
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
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
        taskClassNm: 'AUDIT_PLAN',
        files: [],
      },
      safPsmAuditRslt: {
        auditRsltNo: 0,
        plantCd: '',
        auditType: '',
        auditYear: '',
        targetStartDt: '',
        targetEndDt: '',
        auditStartDt: '',
        auditEndDt: '',
        auditNm: '',
        seniorAudidorRole: '',
        audidorRole: '',
        remark: '',
        psmProgState: '',
        period1: [],
        period2: [],
        createUserId: '',
        updateUserId: '',
        safPsmAuditRsltDepts: [],
        safPsmAuditRsltUsers: [],
        deleteSafPsmAuditRsltUsers: [],
        safPsmAuditRsltStds: [],
        deleteSafPsmAuditRsltStds: [],
        taskClassNm: 'AUDIT_PLAN',
      },
      tabItems: [
        { title: 'L0000000239', url: '/saf/psm/auditUserPlan' } /* 감사팀 */,
        { title: 'L0000000233', url: '/saf/psm/auditItemPlan' } /* 감사범위 */,
        { title: 'L0000002843', url: 'multiFileUpload' } /* 첨부파일 */,
      ],
      component: null,
      tabIndex: 0,
      submitObject: {
        submitCheck: false,
      },
      attachFileGrps: [],
      saveAttachFiles: [],
      tempDeleteFiles: [],
      kindItems: [],
      selectedValue: [],
      disabled: false,
      editable: false,
      searchDetailUrl: '',
      saveUrl: '',
      isSave: false,
      actionType: 'POST',
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      isComplete: false,
      deleteUrl: '',
      isDelete: false,
      deleteValue: null,
      isAppr: false,
      isDisabled: false,
      isReject: false,
    };
  },
  watch: {
    tabIndex: function (newValue, oldValue) {
      this.loadComponent();
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchDetailUrl = selectConfig.saf.auditPlan.get.url;
      this.saveUrl = transactionConfig.saf.auditPlan.insert.url;
      this.apprRequestUrl = transactionConfig.saf.auditPlan.request.url;
      this.deleteUrl = transactionConfig.saf.auditPlan.delete.url;
      this.checkUrl = selectConfig.saf.auditPlan.check.url;
      this.editable = this.$route.meta.editable;

      if (this.popupParam.auditRsltNo > 0) {
        this.isDisabled = true;
      } else {
        let today = this.$comm.moment().format('YYYY');
        this.safPsmAuditRslt.auditYear = today;
      }

      // (C)감사종류
      this.$comm.getComboItems('AUDIT_TYPE', false).then((_result) => {
        this.kindItems = _result;
      });

      this.getDetail();
    },
    getDetail() {
      if (!this.popupParam.auditRsltNo) {
        this.setAttachFileGrps();
        this.$http.url = selectConfig.saf.auditItem.list.url;
        this.$http.type = 'GET';
        this.$http.param = {
          plantCd: this.safPsmAuditRslt.plantCd,
          useYn: 'Y',
        };
        this.$http.request(
          (_result) => {
            this.$_.forEach(_result.data, (item) => {
              const date = new Date();
              this.safPsmAuditRslt.safPsmAuditRsltStds.push({
                auditRsltNo: item.auditRsltNo,
                auditRsltDeptStdNo: item.auditRsltDeptStdNo,
                auditStdDesc: item.auditStdDesc,
                auditStdNm: item.auditStdNm,
                auditStdNo: item.auditStdNo,
                auditorUserId: item.auditorUserId,
                createDt: item.createDt,
                createUserId: item.createUserId,
                files: item.files ? item.files : [],
                reltFiles: item.reltFiles ? item.reltFiles : [],
                safPsmAuditRsltItems: item.safPsmAuditRsltItems,
                tempId: item.tempId
                  ? item.tempId
                  : item.auditStdNo + String(date.getTime()),
                updateDt: item.updateDt,
                updateUserId: item.updateUserId,
              });
            });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        // 탭에 있는 정보들도 다 같이 들고와서 표시한다.
        // 탭에 있는 정보를 들고 오지 않을 시에 validation 체크 및 정보 저장에 대한 대처가 어렵
        this.$http.url = this.$format(
          this.searchDetailUrl,
          this.popupParam.auditRsltNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            var date = new Date();

            this.safPsmAuditRslt = this.$_.clone(_result.data);

            if (
              this.safPsmAuditRslt.targetStartDt &&
              this.safPsmAuditRslt.targetEndDt
            ) {
              this.safPsmAuditRslt.period1 = [
                this.safPsmAuditRslt.targetStartDt,
                this.safPsmAuditRslt.targetEndDt,
              ];
            }
            if (
              this.safPsmAuditRslt.auditStartDt &&
              this.safPsmAuditRslt.auditEndDt
            ) {
              this.safPsmAuditRslt.period2 = [
                this.safPsmAuditRslt.auditStartDt,
                this.safPsmAuditRslt.auditEndDt,
              ];
            }

            if (this.safPsmAuditRslt.psmProgState !== 'PPS10') {
              this.disabled = true;
            } else {
              this.disabled = false;
            }

            if (this.safPsmAuditRslt.planApprRqstCd === 'BAPSD') {
              this.isReject = true;
            }

            this.setAttachFileGrps();
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      }
    },
    setAttachFileGrps() {
      let taskKey = this.safPsmAuditRslt.auditRsltNo
        ? this.safPsmAuditRslt.auditRsltNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000003030' /* 파일업로드 */,
          listType: 'text',
          drag: false,
          showFileSearch: !this.disabled,
          editable: this.editable,
          disabled: this.disabled,
          limit: 10,
          multiple: true,
          onlyDownload: this.disabled,
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
      } else this.component = () => import(`@/pages${path}`);
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
    beforeSave() {
      if (this.popupParam.auditRsltNo) {
        this.saveUrl = transactionConfig.saf.auditPlan.edit.url;
        this.actionType = 'PUT';
        this.checkValidator('edit');
      } else {
        this.saveUrl = transactionConfig.saf.auditPlan.insert.url;
        this.actionType = 'POST';
        this.checkValidator('insert');
      }
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (
              this.safPsmAuditRslt.safPsmAuditRsltUsers === null ||
              this.safPsmAuditRslt.safPsmAuditRsltUsers.length === 0
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000058' /* 감사팀을 지정해 주세요. */,
                type: 'warning',
              });
              return;
            }
            if (
              this.safPsmAuditRslt.safPsmAuditRsltStds === null ||
              this.safPsmAuditRslt.safPsmAuditRsltStds.length === 0
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000059' /* 감사범위을 지정해 주세요. */,
                type: 'warning',
              });
              return;
            }

            if (flag === 'insert') {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321' /* 확인 */,
                message: 'M0000000011' /* 저장하시겠습니까? */,
                // TODO : 필요시 추가하세요.
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.safPsmAuditRslt.createUserId = this.$store.getters.token;
                  this.safPsmAuditRslt.updateUserId = this.$store.getters.token;
                  this.safPsmAuditRslt.targetStartDt = this.$_.clone(
                    this.safPsmAuditRslt.period1[0]
                  );
                  this.safPsmAuditRslt.targetEndDt = this.$_.clone(
                    this.safPsmAuditRslt.period1[1]
                  );
                  this.safPsmAuditRslt.auditStartDt = this.$_.clone(
                    this.safPsmAuditRslt.period2[0]
                  );
                  this.safPsmAuditRslt.auditEndDt = this.$_.clone(
                    this.safPsmAuditRslt.period2[1]
                  );

                  this.saveData.files = this.safPsmAuditRslt.files;
                  this.saveData.safPsmAuditRslt = JSON.stringify(
                    this.safPsmAuditRslt
                  );

                  this.isSave = true;
                },
              });
            } else {
              window.getApp.$emit('CONFIRM', {
                title: 'L0000003321' /* 확인 */,
                message: 'M0000000011' /* 저장하시겠습니까? */,
                // TODO : 필요시 추가하세요.
                type: 'info', // success / info / warning / error
                // 확인 callback 함수
                confirmCallback: () => {
                  this.safPsmAuditRslt.createUserId = this.$store.getters.token;
                  this.safPsmAuditRslt.updateUserId = this.$store.getters.token;
                  this.safPsmAuditRslt.targetStartDt = this.$_.clone(
                    this.safPsmAuditRslt.period1[0]
                  );
                  this.safPsmAuditRslt.targetEndDt = this.$_.clone(
                    this.safPsmAuditRslt.period1[1]
                  );
                  this.safPsmAuditRslt.auditStartDt = this.$_.clone(
                    this.safPsmAuditRslt.period2[0]
                  );
                  this.safPsmAuditRslt.auditEndDt = this.$_.clone(
                    this.safPsmAuditRslt.period2[1]
                  );

                  this.saveData.files = this.safPsmAuditRslt.files;
                  this.saveData.safPsmAuditRslt = JSON.stringify(
                    this.safPsmAuditRslt
                  );

                  this.isSave = true;
                },
              });
            }
          } else {
            this.$popupRequired.check(
              'auditPlanDetail',
              this.$data,
              this.errors
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

    btnSave() {
      if (
        this.$popupRequired.check(
          'auditPlanDetail',
          this.$data,
          this.errors
        ) === false
      ) {
        return;
      }
      this.safPsmAuditRslt.createUserId = this.$store.getters.token;
      this.safPsmAuditRslt.updateUserId = this.$store.getters.token;
      this.safPsmAuditRslt.targetStartDt = this.$_.clone(
        this.safPsmAuditRslt.period1[0]
      );
      this.safPsmAuditRslt.targetEndDt = this.$_.clone(
        this.safPsmAuditRslt.period1[1]
      );
      this.safPsmAuditRslt.auditStartDt = this.$_.clone(
        this.safPsmAuditRslt.period2[0]
      );
      this.safPsmAuditRslt.auditEndDt = this.$_.clone(
        this.safPsmAuditRslt.period2[1]
      );
      const confirm = () => {
        this.$comm.reqHttp(
          this.popupParam.auditRsltNo ? 'PUT' : 'POST',
          '/api/saf/psm/auditplan/auditplanNew',
          this.safPsmAuditRslt,
          (res) => {
            this.popupParam.auditRsltNo = res.data;
            this.safPsmAuditRslt.auditRsltNo = res.data;
            this.$comm.alertSucess('M0000000006');
          }
        );
      };
      this.$comm.alertConfirm('M0000000011', confirm);
    },

    btnSaveClickedCallback(_result) {
      this.$http.isFileRequestPost = false;
      if (this.isAppr) {
        // 결재요청 팝업 전 저장을 하고 callback에 온 경우
        this.openAppr();
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000006' /* 저장되었습니다. */,
          type: 'success',
        });
      }

      if (!this.popupParam.auditRsltNo) {
        this.popupParam.auditRsltNo = _result.data;
        this.safPsmAuditRslt.auditRsltNo = _result.data;
      }
      this.isSave = false;
      this.getDetail();
      this.saveAttach();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.$http.isFileRequestPost = false;
      this.isSave = false;
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
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.$_.clone(this.safPsmAuditRslt.auditRsltNo);
      });

      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitObject.submitCheck = !this.submitObject.submitCheck;
      }
    },
    customNewTag() {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000001287'; /* 부서 */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        multiple: true,
        checkStrictly: true,
        filter: 'psm',
        plantCd: this.safPsmAuditRslt.plantCd,
      };
      this.popupOptions.width = '35%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closeDeptPopup;
    },
    closeDeptPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data !== 'CLOSE') {
        this.$_.forEach(data, (item) => {
          if (item.deptCd) {
            if (
              this.$_.findIndex(this.safPsmAuditRslt.safPsmAuditRsltDepts, {
                targetDeptCd: item.deptCd,
                targetDeptNm: item.deptNm,
              }) === -1
            ) {
              item.targetDeptCd = item.deptCd;
              item.targetDeptNm = item.deptNm;
              this.safPsmAuditRslt.safPsmAuditRsltDepts.push(item);
            }
          }
        });
      }
    },
    btnApprRequest() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (
              this.safPsmAuditRslt.safPsmAuditRsltUsers === null ||
              this.safPsmAuditRslt.safPsmAuditRsltUsers.length === 0
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000058' /* 감사팀을 지정해 주세요. */,
                type: 'warning',
              });
              return;
            }
            if (
              this.safPsmAuditRslt.safPsmAuditRsltStds === null ||
              this.safPsmAuditRslt.safPsmAuditRsltStds.length === 0
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000059' /* 감사범위을 지정해 주세요. */,
                type: 'warning',
              });
              return;
            }
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message:
                'M0000000767' /* 결재요청 하기전 입력된 값을 저장합니다. 진행하시겠습니까? */,
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.isAppr = true;

                this.saveUrl = transactionConfig.saf.auditPlan.edit.url;
                this.actionType = 'PUT';

                this.safPsmAuditRslt.createUserId = this.$store.getters.token;
                this.safPsmAuditRslt.updateUserId = this.$store.getters.token;
                this.safPsmAuditRslt.targetStartDt = this.$_.clone(
                  this.safPsmAuditRslt.period1[0]
                );
                this.safPsmAuditRslt.targetEndDt = this.$_.clone(
                  this.safPsmAuditRslt.period1[1]
                );
                this.safPsmAuditRslt.auditStartDt = this.$_.clone(
                  this.safPsmAuditRslt.period2[0]
                );
                this.safPsmAuditRslt.auditEndDt = this.$_.clone(
                  this.safPsmAuditRslt.period2[1]
                );

                this.saveData.files = this.safPsmAuditRslt.files;
                this.saveData.safPsmAuditRslt = JSON.stringify(
                  this.safPsmAuditRslt
                );

                this.isSave = true;
              },
            });
          } else {
            this.$popupRequired.check(
              'auditPlanDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          this.isSave = false;
        });
    },
    beforeDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        type: 'info',
        confirmCallback: () => {
          this.safPsmAuditRslts = [];
          this.safPsmAuditRslts.push(this.safPsmAuditRslt);
          this.deleteValue = {
            data: Object.values(this.$_.clone(this.safPsmAuditRslts)),
          };
          this.isDelete = true;
        },
      });
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000007' /* 삭제되었습니다. */,
        type: 'success',
      });
      this.btnClosePopup();
    },
    openAppr() {
      let taskGrpCd = 'AUDIT_PLAN';

      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; /* 결재요청 */
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '90%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        apprBizCd: 'SA-AU-01',
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
    /** /Button Event **/
  },
};
</script>
