<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- PSM 감사계획 상세 -->
            <y-label label="L0000000143" icon="user-edit" color-class="cutstom-title-color" />
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
    <el-tabs type="border-card" v-model="tabIndex" @tab-click="tabClick">
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
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
        />
      </keep-alive>
    </el-tabs>
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
        safPsmAuditRsltDepts: [], // 감사결과 대상부서
        safPsmAuditRsltUsers: [], // 감사결과 감사원
        safPsmAuditRsltStds: [], // 감사결과_기준
        safPsmAuditRsltImprs: [], // 감사결과_개선사항
        deleteSafPsmAuditRsltImprs: [], // 삭제할 감사결과_개선사항
      },
      tabItems: [
        { title: 'L0000000239', url: '/appr/auditUserPlanAppr' }, /* 감사팀 */
        { title: 'L0000000233', url: '/appr/auditItemPlanAppr' }, /* 감사범위 */
        { title: 'L0000000225', url: '/saf/psm/auditItemResult' }, /* 감사결과 */
        { title: 'L0000000259', url: '/saf/psm/auditImprActTab' }, /* 개선사항 */
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
      isSave: false,
      actionType: 'PUT',
      isComplete: false,
      isAppr: false,
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
      this.searchDetailUrl = selectConfig.saf.auditResult.get.url;
      this.editable = this.$route.meta.editable;

      this.setAttachFileGrps();
      this.getDetail();
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
            this.safPsmAuditRslt.psmProgState === 'PPS50'
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
          this.setAttachFileGrps();
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
      } else if (path === 'imprActTab') {
        this.component = () => import('@/pages/impr/imprActTab');
      } else this.component = () => import(`@/pages${path}`);
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
    tabClick(tab) {
      if (tab.index > 2) {
        if (
          this.safPsmAuditRslt.psmProgState === 'PPS40' ||
          this.safPsmAuditRslt.psmProgState === 'PPS50'
        ) {
          this.tabDisabled = true;
          this.disabled2 = true;
        } else {
          this.tabDisabled = true;
          this.disabled2 = false;
        }
      } else {
        this.tabDisabled = true;
      }
    },
  },
};
</script>