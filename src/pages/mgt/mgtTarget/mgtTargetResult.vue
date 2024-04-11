<!--
  목적 : 상세조회 및 수정 팝업
  작성자 : mjpark
  Detail : 목표/실적/평가 상세,등록,수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <y-label
              label="L0000005054"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn
                v-if="
                  editable &&
                  confirmMode &&
                  updateMode &&
                  mgtTargetRslt.rstepCd !== 'BAPSG' &&
                  !rDisabled &&
                  !popupParam.apprFlag &&
                  (companyEditable ||
                    (plantEditable &&
                      this.mgtTargetRslt.plantCd ===
                        this.$store.getters.plantCd) ||
                    (deptEditable &&
                      this.mgtTargetRslt.deptCd === this.$store.getters.deptCd))
                "
                :action-url="editUrl"
                :param="mgtTargetRslt"
                :is-submit="isConfirm"
                title="L0000005055"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeConfirm"
                @beforeConfirm="beforeConfirm"
                @btnClicked="btnRsltConfirmClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="
                  editable &&
                  confirmMode &&
                  updateMode &&
                  mgtTargetRslt.estepCd !== 'BAPSG' &&
                  !eDisabled &&
                  !popupParam.apprFlag &&
                  (companyEditable ||
                    (plantEditable &&
                      this.mgtTargetRslt.plantCd ===
                        this.$store.getters.plantCd) ||
                    (deptEditable &&
                      this.mgtTargetRslt.deptCd === this.$store.getters.deptCd))
                "
                :action-url="editUrl"
                :param="mgtTargetRslt"
                :is-submit="isConfirm"
                title="L0000005056"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeConfirm2"
                @beforeConfirm2="beforeConfirm2"
                @btnClicked="btnEvalConfirmClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="
                  editable &&
                  confirmMode &&
                  mgtTargetRslt.estepCd !== 'BAPSG' &&
                  (popupParam.apprFlag ||
                    !tDisabled ||
                    !rDisabled ||
                    !eDisabled) &&
                  (popupParam.apprFlag ||
                    companyEditable ||
                    (plantEditable &&
                      this.mgtTargetRslt.plantCd ===
                        this.$store.getters.plantCd) ||
                    (deptEditable &&
                      this.mgtTargetRslt.deptCd === this.$store.getters.deptCd))
                "
                :action-url="insertUrl"
                :param="mgtTargetRslt"
                :is-submit="isInsert"
                title="L0000004986"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="
                  editable &&
                  confirmMode &&
                  updateMode &&
                  !rDisabled &&
                  !popupParam.apprFlag &&
                  (companyEditable ||
                    (plantEditable &&
                      this.mgtTargetRslt.plantCd ===
                        this.$store.getters.plantCd) ||
                    (deptEditable &&
                      this.mgtTargetRslt.deptCd === this.$store.getters.deptCd))
                "
                title="L0000005057"
                color="red"
                @btnClicked="btnDeleteRsltClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="
                  editable &&
                  confirmMode &&
                  updateMode &&
                  !eDisabled &&
                  !popupParam.apprFlag &&
                  (companyEditable ||
                    (plantEditable &&
                      this.mgtTargetRslt.plantCd ===
                        this.$store.getters.plantCd) ||
                    (deptEditable &&
                      this.mgtTargetRslt.deptCd === this.$store.getters.deptCd))
                "
                title="L0000005058"
                color="red"
                @btnClicked="btnDeleteEvalClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="closePopup"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-datepicker
                :width="8"
                :editable="false"
                type="year"
                label="L0000004449"
                name="year"
                v-model="mgtTargetRslt.year"
                :required="true"
                v-validate="'required'"
                :state="validateState('year')"
              >
              </y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :editable="false"
                :comboItems="months"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000005059"
                name="month"
                :required="true"
                v-model="mgtTargetRslt.month"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                v-if="
                  this.popupParam.areaType === 'plant' ||
                  this.popupParam.areaType === 'dept'
                "
                type="search"
                name="plantCd"
                :editable="false"
                v-model="mgtTargetRslt.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-dept
                v-if="this.popupParam.areaType === 'dept'"
                :editable="false"
                label="L0000001287"
                :plantCd="mgtTargetRslt.plantCd"
                v-model="mgtTargetRslt.deptCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-textarea
                :width="10"
                :editable="false"
                :required="true"
                :maxlength="300"
                :disabled="!confirmMode"
                ui="bootstrap"
                label="L0000003774"
                name="target"
                v-model="mgtTargetRslt.target"
                :rows="2"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-textarea
                :width="10"
                :editable="false"
                :required="true"
                :maxlength="300"
                :disabled="!confirmMode"
                ui="bootstrap"
                label="L0000005049"
                name="policy"
                v-model="mgtTargetRslt.policy"
                :rows="2"
              />
            </b-col>
            <!-- <b-col sm="8"></b-col>
              <b-col sm="3">
                <y-number
                  :width="6"
                  :editable="editable"
                  :maxlength="6"
                  :hasSeperator="true"
                  :pointNumber="3"
                  :showMaxLength="false"
                  ui="bootstrap"
                  label="L0000005097"
                  name="allInputVal"
                  v-model="allInputVal"
                />                
              </b-col>           
              <b-col sm="1">
                <div slot="buttonGroup" class="float-right mb-1">                  
                  <y-btn
                    title="L0000002482"
                    color="orange"
                    @btnClicked="btnAllInputValClickedCallback" 
                    @btnClickedErrorCallback="btnClickedErrorCallback"
                  />
                </div>
              </b-col>   -->
          </b-row>
        </b-card>

        <!-- 탭 -->
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
            <keep-alive>
              <component
                :is="component"
                v-if="component"
                :mgtTargetItemRslt.sync="mgtTargetRslt"
                :allInputVal.sync="setAllInputVal"
                :apprFlag.sync="popupParam.apprFlag"
              />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
import tabUrl from './mgtTargetItemResult';
export default {
  /* attributes: name, components, props, data */
  name: 'mgt-target-result',
  props: {
    popupParam: {
      type: Object,
      default: {
        mgtTargetMonthNo: 0,
        apprFlag: false,
        areaType: null,
      },
    },
  },
  data() {
    return {
      mgtTargetRslt: {
        mgtTargetNo: 0,
        mgtTargetMonthNo: 0,
        year: '',
        month: '',
        plantCd: null,
        deptCd: null,
        target: '',
        policy: '',
        tstepCd: '',
        rstepCd: '',
        estepCd: '',
        tapprRqstNo: 0,
        rapprRqstNo: 0,
        eapprRqstNo: 0,
        createUserId: '',
        createUserNm: '',
        createDeptCd: '',
        createDeptNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDeptCd: '',
        updateDeptNm: '',
        updateDt: '',
        evalDataList: [],
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
      tabItems: [],
      bizTgtYear: '',
      deptCd: '',
      component: null,
      tabIndex: 0,
      editable: true,
      insertUrl: '',
      editUrl: '',
      deleteUrl: '',
      searchUrl: '',
      isConfirm: false,
      isInsert: false,
      isEdit: false,
      confirmMode: true,
      insertMode: true,
      updateMode: false,
      months: [],
      stepLvl: 0,
      tDisabled: true,
      rDisabled: true,
      eDisabled: true,
      companyEditable: false, // 전사 권한
      plantEditable: false, // 사업장 권한
      deptEditable: false, // 일반 권한
      allInputVal: 0,
      setAllInputVal: 0,
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.tabItems.push({
      title: this.$comm.getLangSpecInfoLabel('L0000005149'),
      url: './mgtTargetItemResult',
    });
    this.init();
  },
  mounted() {
    this.loadComponent();
    this.getDetail();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.searchUrl = selectConfig.mgt.mgtTarget.mgtTargetRslt.get.url;
      this.insertUrl = transactionConfig.mgt.mgtTarget.mgtTarget.insertRslt.url;
      this.deleteUrl = transactionConfig.mgt.mgtTarget.mgtTarget.deleteRslt.url;

      this.months.push({ code: '01', codeNm: '01' });
      this.months.push({ code: '02', codeNm: '02' });
      this.months.push({ code: '03', codeNm: '03' });
      this.months.push({ code: '04', codeNm: '04' });
      this.months.push({ code: '05', codeNm: '05' });
      this.months.push({ code: '06', codeNm: '06' });
      this.months.push({ code: '07', codeNm: '07' });
      this.months.push({ code: '08', codeNm: '08' });
      this.months.push({ code: '09', codeNm: '09' });
      this.months.push({ code: '10', codeNm: '10' });
      this.months.push({ code: '11', codeNm: '11' });
      this.months.push({ code: '12', codeNm: '12' });

      this.insertMode = true;
      this.updateMode = false;

      // 권한별 컨트롤 처리
      if (this.$comm.isCompanyGrp()) {
        // 전사권한
        this.companyEditable = true;
        this.plantEditable = true;
        this.deptEditable = true;
      } else if (this.$comm.isPlantGrp()) {
        // 사업장권한
        this.plantEditable = true;
        this.deptEditable = true;
      } // 일반권한
      else {
        this.deptEditable = true;
      }
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'fileUploadPage') { this.component = () => import('@/pages/saf/imprAct/fileUploadPage'); }
       
      else this.component = tabUrl;
    },
    getDetail() {
      if (this.popupParam.mgtTargetMonthNo > 0) {
        this.mgtTargetRslt.mgtTargetMonthNo = this.popupParam.mgtTargetMonthNo;
      }

      this.$http.url = this.$format(
        this.searchUrl,
        this.mgtTargetRslt.mgtTargetMonthNo
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.mgtTargetRslt = _result.data;
            this.mgtTargetRslt.estepCd =
              _result.data.estepCd === null ? '' : _result.data.estepCd;
            this.insertMode = false;
            this.updateMode = true;

            this.tDisabled = true;
            this.rDisabled = true;
            this.eDisabled = true;

            if (this.mgtTargetRslt.estepCd === 'BAPSG') {
              this.tDisabled = true;
              this.rDisabled = true;
              this.eDisabled = false;
            } else if (this.mgtTargetRslt.rstepCd === 'BAPSG') {
              if (this.mgtTargetRslt.estepCd === '') {
                this.rDisabled = false;
              }
              if (this.mgtTargetRslt.estepCd !== 'BAPSA') {
                this.eDisabled = false;
              }
            } else if (
              this.mgtTargetRslt.tstepCd === 'BAPSG' &&
              this.mgtTargetRslt.rstepCd !== 'BAPSA'
            ) {
              this.rDisabled = false;
            }
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
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

    /** button 관련 이벤트 **/
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000011',
              type: 'info',
              confirmCallback: () => {
                this.mgtTargetRslt.createUserId = this.$store.getters.token;
                this.mgtTargetRslt.createUserNm = this.$store.getters.name;
                this.mgtTargetRslt.createDeptCd = this.$store.getters.deptCd;
                this.mgtTargetRslt.createDeptNm = this.$store.getters.deptNm;
                this.mgtTargetRslt.updateUserId = this.$store.getters.token;
                this.mgtTargetRslt.updateUserNm = this.$store.getters.name;
                this.mgtTargetRslt.updateDeptCd = this.$store.getters.deptCd;
                this.mgtTargetRslt.updateDeptNm = this.$store.getters.deptNm;
                this.isInsert = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            '유효성 검사도중 에러가 발생하였습니다.'
          );
        });
    },
    beforeConfirm() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000718',
        // 결재요청 전 저장됩니다. 진행하시겠습니까?
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.mgtTargetRslt.createUserId = this.$store.getters.token;
          this.mgtTargetRslt.updateUserId = this.$store.getters.token;
          this.$http.url = this.insertUrl;
          this.$http.type = 'POST';
          this.$http.param = this.mgtTargetRslt;
          this.$http.request(
            (_result) => {
              this.popupOptions.target = () =>
                import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
              this.popupOptions.title = 'L0000003418'; // 결재요청
              this.popupOptions.visible = true;
              this.popupOptions.closeCallback = this.closeApprPop;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                apprBizCd: 'MG-MI-07',
                apprRqstNo: this.mgtTargetRslt.rapprRqstNo,
                apprParams: {
                  mgtTargetMonthNo: this.mgtTargetRslt.mgtTargetMonthNo,
                },
              };
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    beforeConfirm2() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000718',
        // 결재요청 전 저장됩니다. 진행하시겠습니까?
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.mgtTargetRslt.createUserId = this.$store.getters.token;
          this.mgtTargetRslt.updateUserId = this.$store.getters.token;
          this.$http.url = this.insertUrl;
          this.$http.type = 'POST';
          this.$http.param = this.mgtTargetRslt;
          this.$http.request(
            (_result) => {
              this.popupOptions.target = () =>
                import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
              this.popupOptions.title = 'L0000003418'; // 결재요청
              this.popupOptions.visible = true;
              this.popupOptions.closeCallback = this.closeApprPop;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                apprBizCd: 'MG-MI-08',
                apprRqstNo: this.mgtTargetRslt.eapprRqstNo,
                apprParams: {
                  mgtTargetMonthNo: this.mgtTargetRslt.mgtTargetMonthNo,
                },
              };
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    btnInsertClickedCallback(_result) {
      this.mgtTargetRslt.mgtTargetMonthNo = _result.data;
      this.insertMode = false;
      this.updateMode = true;
      this.isInsert = false;

      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.getDetail();
    },
    btnRsltConfirmClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000802',
        type: 'success', // success / info / warning / error
      });
      this.confirmMode = false;
      this.isConfirm = false;
      this.getDetail();
    },
    btnEvalConfirmClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000802',
        type: 'success', // success / info / warning / error
      });
      this.confirmMode = false;
      this.isConfirm = false;
      this.getDetail();
    },
    btnDeleteRsltClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000012',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.mgtTargetRslt.mgtTargetMonthNo,
            'rslt'
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000007',
                type: 'success',
              });
              this.getDetail();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    btnDeleteEvalClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000012',
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.mgtTargetRslt.mgtTargetMonthNo,
            'eval'
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000007',
                type: 'success',
              });
              this.getDetail();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    btnAllInputValClickedCallback(_result) {
      this.setAllInputVal = this.allInputVal;
    },
    btnClickedErrorCallback(_result) {
      this.$emit('APP_REQUEST_ERROR', _result);
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
    },
    /** end button 관련 이벤트 **/
    closePopup(data) {
      this.$emit('closePopup', {});
    },
  },
};
</script>
