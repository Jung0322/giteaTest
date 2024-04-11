<!--
  목적 : 평가및안전보건비용 계획 상세
  작성자 : pkj
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 평가및안전보건비용 계획 상세 -->
            <y-label
              label="L0000005128"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  editable &&
                  updateMode &&
                  apprMode &&
                  !this.popupParam.apprFlag
                "
                title="L0000003418"
                color="black"
                @btnClicked="beforeValidateChk('appr')"
              />
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable && apprMode"
                :action-url="editUrl"
                :param="assmnSfhlcInfo"
                :is-submit="isEdit"
                title="L0000004986"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSubmit"
                @beforeSubmit="beforeValidateChk('update')"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!updateMode && editable"
                :action-url="insertUrl"
                :param="assmnSfhlcInfo"
                :is-submit="isInsert"
                title="L0000004986"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeValidateChk('insert')"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="
                  editable &&
                  updateMode &&
                  apprMode &&
                  !this.popupParam.apprFlag
                "
                title="L0000001495"
                color="red"
                @btnClicked="deleteInfo"
              />
              <!-- 닫기 -->
              <y-btn
                v-if="!this.popupParam.apprFlag"
                title="L0000000881"
                @btnClicked="closePopup"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                type="edit"
                :editable="editable && apprMode"
                :required="true"
                name="plantCd"
                v-model="assmnSfhlcInfo.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 대상년도 -->
              <y-datepicker
                :editable="editable && apprMode"
                :width="8"
                type="year"
                name="year"
                label="L0000004449"
                :default="assmnSfhlcInfo.year"
                v-model="assmnSfhlcInfo.year"
                :required="true"
                v-validate="'required'"
                :state="validateState('year')"
              />
            </b-col>
            <!-- 구분 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-select
                :editable="editable && apprMode"
                :width="8"
                :comboItems="evalClsCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000000686"
                name="evalClsCd"
                v-model="assmnSfhlcInfo.evalClsCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('evalClsCd')"
                @datachange="datachange"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 평가(계획)기간 -->
              <y-datepicker
                :editable="editable && apprMode"
                :width="8"
                :range="true"
                label="L0000005122"
                name="assessDt"
                v-model="assmnSfhlcInfo.assessDt"
                :required="true"
                v-validate="'required'"
                :state="validateState('assessDt')"
              ></y-datepicker>
            </b-col>
            <!-- 주간부서 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-tree-dept
                label="L0000005015"
                name="mainDeptCd"
                v-model="assmnSfhlcInfo.mainDeptCd"
                :plantCd="assmnSfhlcInfo.plantCd"
                :required="true"
                :editable="editable && apprMode && deptEditable"
                v-validate="'required'"
                :state="validateState('mainDeptCd')"
                @setDeptNm="setDeptNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6"></b-col>
            <!-- 평가명 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :editable="editable && apprMode"
                :width="10"
                ui="bootstrap"
                label="L0000003081"
                name="evalTitle"
                :maxlength="100"
                v-model="assmnSfhlcInfo.evalTitle"
                :required="true"
                v-validate="'required'"
                :state="validateState('evalTitle')"
              ></y-text>
            </b-col>
            <!-- 상세내용 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-textarea
                :editable="editable && apprMode"
                :width="10"
                :maxlength="250"
                ui="bootstrap"
                name="evalDesc"
                label="L0000001528"
                v-model="assmnSfhlcInfo.evalDesc"
                :rows="3"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
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
          <component
            v-show="tabIndex === '0'"
            :is="component"
            sm="12"
            :assmnSfhlcInfo.sync="assmnSfhlcInfo"
            :deptListLoad.sync="deptListLoad"
            :updateMode.sync="updateMode"
            :deptReLoad.sync="deptReLoad"
            :apprMode.sync="apprMode"
          />
          <component
            v-show="tabIndex === '1'"
            :is="component1"
            sm="12"
            :assmnSfhlcInfo.sync="assmnSfhlcInfo"
            :deptListLoad.sync="deptListLoad"
            :updateMode.sync="updateMode"
            :deptReLoad.sync="deptReLoad"
            :apprMode.sync="apprMode"
          />
          <component
            v-show="tabIndex === '2'"
            sm="12"
            :is="component2"
            :saveAttachFiles="saveAttachFiles"
            :attachFileGrps="attachFileGrps"
            :submitCheck="submitCheck"
            @changeUploadFiles="changeUploadFiles"
          />
        </el-tabs>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-facility-mst-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        vendorEvalPlanNo: 0,
      },
    },
  },
  data: () => ({
    assmnSfhlcInfo: {
      vendorEvalPlanNo: 0,
      plantCd: '', // 사업장 코드
      year: '',
      evalClsCd: '',
      evalStartDt: '',
      evalEndDt: '',
      mainDeptCd: '',
      mainDeptNm: '',
      evalTitle: '',
      evalDesc: '',
      assessDt: null,
      assmnSfhlcVendorList: [], // 대상협력업체
      assmnSfhlcItemList: [], // 평가항목
      createUserId: '',
      createDeptNm: '',
      createDeptCd: '',
      createPositionCd: '',
      createPositionNm: '',
      updatePositionCd: '',
      updatePositionNm: '',
      updateUserId: '',
      updateDeptNm: '',
      updateDeptCd: '',
      stepNm: '',
      apprRqstNo: 0,
    },
    gridOptions: {
      header: [],
      data: [],
      height: '450',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '90%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    tabIndex: 0,
    tabItems: [
      {
        title: 'L0000005121',
      } /* 대상협력업체 */,
      {
        title: 'L0000003098',
      } /* 평가항목 */,
      { title: 'L0000002843', url: 'multiFileUpload' } /* 첨부파일 */,
    ],
    saveAttachFiles: [],
    attachFileGrps: [],
    submitCheck: false,
    editable: false,
    updateMode: false,
    isInsert: false,
    isEdit: false,
    editUrl: '',
    insertUrl: '',
    deleteUrl: '',
    detailUrl: '',
    itemListUrl: '',
    evalClsCdItems: [], // 기법
    component: null,
    component1: null,
    component2: null,
    deptListLoad: false,
    deptReLoad: false,
    apprMode: true,
    deptEditable: true, // 일반 권한
  }),
  watch: {
    'assmnSfhlcInfo.evalClsCd'() {
      if (!this.assmnSfhlcInfo.plantCd) {
        this.$comm.alertWarning('L0000005081'); // 본문 사업장을 선택해주세요.
        return;
      }
      // this.searchItemList();
    },
    'assmnSfhlcInfo.year'() {
      if (this.assmnSfhlcInfo.year) {
        this.assmnSfhlcInfo.assessDt = [
          this.assmnSfhlcInfo.year + '-01-01',
          this.assmnSfhlcInfo.year + '-12-31',
        ];
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      // Url Setting
      this.detailUrl = selectConfig.vendor.assmnSfhlc.get.url;
      this.itemListUrl = selectConfig.vendor.assmnSfhlc.itemlist.url;
      this.editUrl = transactionConfig.vendor.assmnSfhlc.edit.url;
      this.insertUrl = transactionConfig.vendor.assmnSfhlc.insert.url;
      this.deleteUrl = transactionConfig.vendor.assmnSfhlc.delete.url;
      this.assmnSfhlcInfo.year = this.$comm.moment().format('YYYY');
      this.component = () => import(`${'./planmgmtVendorList'}`);
      this.component1 = () => import(`${'./planmgmtItemResult'}`);
      this.component2 = () =>
        import('@/pages/common/attachFile/multiFileUpload');
      // 구분
      this.$comm.getComboItems('SAF_SC_EVAL_CLS', false).then((_result) => {
        this.evalClsCdItems = _result;
      });

      if (!this.popupParam.vendorEvalPlanNo) {
        let from = this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '-6m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        let to = this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '0y',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        this.assmnSfhlcInfo.assessDt = [from, to];
        this.assmnSfhlcInfo.mainDeptCd = this.$store.getters.deptCd;
        this.assmnSfhlcInfo.vendorEvalPlanNo = 0;
        this.setAttachFileGrps();
      } else {
        this.assmnSfhlcInfo.vendorEvalPlanNo = this.popupParam.vendorEvalPlanNo;
      }

      // 권한별 컨트롤 처리
      if (!this.$comm.isCompanyGrp() && !this.$comm.isPlantGrp()) {
        // 일반권한
        this.deptEditable = false;
      }

      this.getDetail();
    },
    setDeptNm(deptNm) {
      this.assmnSfhlcInfo.mainDeptNm = deptNm;
    },
    getDetail() {
      if (!this.assmnSfhlcInfo.vendorEvalPlanNo) return;
      this.$http.url = this.$format(
        this.detailUrl,
        this.assmnSfhlcInfo.vendorEvalPlanNo
      );
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.assmnSfhlcInfo = _result.data;
          this.assmnSfhlcInfo.assessDt = [
            this.assmnSfhlcInfo.evalStartDt,
            this.assmnSfhlcInfo.evalEndDt,
          ];
          if (this.assmnSfhlcInfo.apprRqstNo === 0) {
            this.apprMode = true;
          } else if (
            this.assmnSfhlcInfo.stepNm === '결재반려' ||
            this.assmnSfhlcInfo.stepNm === '결재요청전' ||
            this.popupParam.apprFlag
          ) {
            this.apprMode = true;
          } else {
            this.apprMode = false;
          }

          this.setAttachFileGrps();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    searchItemList() {
      if (!this.assmnSfhlcInfo.vendorEvalPlanNo) {
        this.assmnSfhlcInfo.vendorEvalPlanNo = 0;
      }
      this.$http.url = this.$format(
        this.itemListUrl,
        this.assmnSfhlcInfo.vendorEvalPlanNo,
        this.assmnSfhlcInfo.plantCd,
        this.assmnSfhlcInfo.evalClsCd
      );
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.assmnSfhlcInfo.assmnSfhlcItemList = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
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
    nextUpdate() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '평가및안전보건비용 계획 정보를 수정하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.assmnSfhlcInfo.evalStartDt =
                  this.assmnSfhlcInfo.assessDt[0];
                this.assmnSfhlcInfo.evalEndDt = this.assmnSfhlcInfo.assessDt[1];
                this.assmnSfhlcInfo.updateUserId = this.$store.getters.token;
                this.assmnSfhlcInfo.updateDeptNm = this.$store.getters.deptNm;
                this.assmnSfhlcInfo.updateDeptCd = this.$store.getters.deptCd;
                this.assmnSfhlcInfo.updatePositionCd =
                  this.$store.getters.positionCd;
                this.assmnSfhlcInfo.updatePositionNm =
                  this.$store.getters.positionNm;
                this.isEdit = true;
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
    beforeValidateChk(flag) {
      return new Promise((_resolve, _reject) => {
        this.deptListLoad = !this.deptListLoad;
        if (!this.assmnSfhlcInfo.plantCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005081' /* 본문 사업장을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.assmnSfhlcInfo.year) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005132' /* 대상년도를 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.assmnSfhlcInfo.evalClsCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005134' /* 구분을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (
          !this.assmnSfhlcInfo.assessDt[0] ||
          !this.assmnSfhlcInfo.assessDt[1]
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005145' /* 평가(계획)기간을 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.assmnSfhlcInfo.mainDeptCd) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005136' /* 주관부서를 선택해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (!this.assmnSfhlcInfo.evalTitle) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'L0000005137' /* 평가명을 입력해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }

        if (
          !this.assmnSfhlcInfo.assmnSfhlcVendorList ||
          this.assmnSfhlcInfo.assmnSfhlcVendorList.length <= 0
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message:
              '[' +
              this.$comm.getLangSpecInfoLabel('L0000005121') +
              '] ' +
              this.$comm.getLangSpecInfoLabel(
                'L0000005146'
              ) /* 대상협력업체를 한건이상 등록해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }
        if (
          this.assmnSfhlcInfo.year !==
            this.$comm.moment(this.assmnSfhlcInfo.assessDt[0]).format('YYYY') ||
          this.assmnSfhlcInfo.year !==
            this.$comm.moment(this.assmnSfhlcInfo.assessDt[1]).format('YYYY')
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message:
              'L0000005353' /* 대상년도와 평가(계획)기간이 일치 하지 않습니다. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }

        let checkDate = this.checkDeptList();
        if (!checkDate) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message:
              'L0000005386' /* 대상협력업체의 평가일을 평가기간 이내로 입력해주세요. */,
            type: 'warning', // success / info / warning / error
          });
          _resolve(false);
          return;
        }

        if (flag === 'insert') {
          this.nextInsert();
        } else if (flag === 'update') {
          this.nextUpdate();
        } else {
          this.beforeConfirm();
        }
      });
    },
    checkDeptList() {
      let flag = true;
      this.$_.forEach(this.assmnSfhlcInfo.assmnSfhlcVendorList, (item) => {
        if (
          this.$comm.moment(item.evalStartDt).format('YYYY-MM-DD') <
            this.$comm
              .moment(this.assmnSfhlcInfo.assessDt[0])
              .format('YYYY-MM-DD') ||
          this.$comm.moment(item.evalStartDt).format('YYYY-MM-DD') >
            this.$comm
              .moment(this.assmnSfhlcInfo.assessDt[1])
              .format('YYYY-MM-DD')
        ) {
          flag = false;
          return;
        } else if (
          this.$comm.moment(item.evalEndDt) <
            this.$comm.moment(this.assmnSfhlcInfo.assessDt[0]) ||
          this.$comm.moment(item.evalEndDt) >
            this.$comm.moment(this.assmnSfhlcInfo.assessDt[1])
        ) {
          flag = false;
          return;
        }
      });
      return flag;
    },
    nextInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '평가및안전보건비용 계획 정보를 등록하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.assmnSfhlcInfo.evalStartDt =
                  this.assmnSfhlcInfo.assessDt[0];
                this.assmnSfhlcInfo.evalEndDt = this.assmnSfhlcInfo.assessDt[1];
                this.assmnSfhlcInfo.createUserId = this.$store.getters.token;
                this.assmnSfhlcInfo.createDeptNm = this.$store.getters.deptNm;
                this.assmnSfhlcInfo.createDeptCd = this.$store.getters.deptCd;
                this.assmnSfhlcInfo.createPositionCd =
                  this.$store.getters.positionCd;
                this.assmnSfhlcInfo.createPositionNm =
                  this.$store.getters.positionNm;
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
    btnSaveClickedCallback(result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      this.updateMode = true;
      this.saveAttach();
      this.getDetail();
      this.deptReLoad = !this.deptReLoad;
    },
    btnInsertClickedCallback(result) {
      this.assmnSfhlcInfo.vendorEvalPlanNo = result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.updateMode = true;
      this.saveAttach();
      this.getDetail();
      this.deptReLoad = !this.deptReLoad;
    },
    deleteInfo() {
      return new Promise((_resolve, _reject) => {
        this.$http.type = 'GET';
        this.$http.url = this.$format(
          selectConfig.vendor.assmnSfhlc.getstatus.url,
          this.assmnSfhlcInfo.vendorEvalPlanNo
        );
        this.$http.request(
          (_result) => {
            let delYn = 'Y';
            if (!_result.data || _result.data.length > 0) {
              for (let i = 0; i < _result.data.length; i++) {
                if (_result.data[i]['imprStepCd'] !== 'IMST1') {
                  delYn = 'N';
                }
              }
              if (delYn === 'Y') {
                _resolve(true);
                this.deleteSubmit();
              } else {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395' /* 안내 */,
                  message:
                    'M0000001620' /* 대상 부서가 평가 중상 태일 경우 삭제가 불가합니다. */,
                  type: 'warning', // success / info / warning / error
                });
                _resolve(false);
                return;
              }
            } else {
              _resolve(true);
              this.deleteSubmit();
            }

            // if (_result.data === 0) {
            //   _resolve(true);
            //   this.deleteSubmit();
            // } else {
            //   window.getApp.$emit('ALERT', {
            //     title: 'L0000003395' /* 안내 */,
            //     message:
            //       'M0000001620' /* 대상 부서가 평가 중상 태일 경우 삭제가 불가합니다. */,
            //     type: 'warning', // success / info / warning / error
            //   });
            //   _resolve(false);
            //   return;
            // }
          },
          (_error) => {
            _reject(_error);
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    deleteSubmit() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // '삭제하시겠습니까?',
        type: 'info',
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.assmnSfhlcInfo.vendorEvalPlanNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // '삭제되었습니다.',
                type: 'success',
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
      });
    },
    btnClickedErrorCallback(result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', result);
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    setAttachFileGrps() {
      let taskKey = this.assmnSfhlcInfo.vendorEvalPlanNo
        ? this.assmnSfhlcInfo.vendorEvalPlanNo
        : ''; // 현 모델 키 값

      this.attachFileGrps = [
        {
          label: '파일업로드',
          drag: this.editable,
          showFileSearch: false,
          editable: this.editable && this.apprMode,
          disabled: !this.apprMode,
          uploadTempFiles: null,
          taskClassNm: 'SAF_VENDOR_EVAL_PLAN', // 현 화면의 첨부파일 키 값
          taskKey: taskKey,
          createUserId: this.$store.getters.token,
        },
      ];
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
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.assmnSfhlcInfo.vendorEvalPlanNo;
      });

      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitCheck = !this.submitCheck;
      }
    },
    beforeConfirm() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000718',
        // 결재요청 전 저장됩니다. 진행하시겠습니까?
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.assmnSfhlcInfo.evalStartDt = this.assmnSfhlcInfo.assessDt[0];
          this.assmnSfhlcInfo.evalEndDt = this.assmnSfhlcInfo.assessDt[1];
          this.assmnSfhlcInfo.updateUserId = this.$store.getters.token;
          this.assmnSfhlcInfo.updateDeptNm = this.$store.getters.deptNm;
          this.assmnSfhlcInfo.updateDeptCd = this.$store.getters.deptCd;
          this.assmnSfhlcInfo.updatePositionCd = this.$store.getters.positionCd;
          this.assmnSfhlcInfo.updatePositionNm = this.$store.getters.positionNm;
          this.$http.url = this.editUrl;
          this.$http.type = 'PUT';
          this.$http.param = this.assmnSfhlcInfo;
          this.$http.request(
            (_result) => {
              this.popupOptions.target = () =>
                import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
              this.popupOptions.title = 'L0000003418'; // 결재요청
              this.popupOptions.visible = true;
              this.popupOptions.closeCallback = this.closeApprPop;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                apprBizCd: 'CN-EV-02',
                apprRqstNo: this.assmnSfhlcInfo.apprRqstNo,
                apprParams: {
                  vendorEvalPlanNo: this.assmnSfhlcInfo.vendorEvalPlanNo,
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
    datachange(data) {
      if (data) {
        this.searchItemList();
      }
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDetail();
      this.deptReLoad = !this.deptReLoad;
    },
  },
};
</script>
