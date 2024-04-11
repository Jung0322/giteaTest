<!--
  목적 : 평가및안전보건비용 결과 상세
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
            <!-- 평가및안전보건비용 결과 상세 -->
            <y-label
              label="L0000005174"
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
                @btnClicked="beforeConfirm"
              />
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable && apprMode"
                :action-url="editUrl"
                :param="assmnSfhlcResultInfo"
                :is-submit="isEdit"
                title="L0000002474"
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
                :param="assmnSfhlcResultInfo"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeValidateChk('insert')"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
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
              <b-row>
                <!-- 등록일 -->
                <b-col sm="4">
                  <y-label ui="bootstrap" label="L0000000973"></y-label>
                </b-col>
                <b-col sm="8">
                  <y-label
                    ui="bootstrap"
                    :fieldable="true"
                    :label="assmnSfhlcResultInfo.createDt"
                    name="createDt"
                  ></y-label>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <!-- 등록자 -->
                <b-col sm="4">
                  <y-label ui="bootstrap" label="L0000000976"></y-label>
                </b-col>
                <b-col sm="8">
                  <y-label
                    ui="bootstrap"
                    :fieldable="true"
                    :label="assmnSfhlcResultInfo.createUserNm"
                    name="createUserNm"
                  ></y-label>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                type="edit"
                :editable="newInsertMode"
                :required="true"
                name="plantCd"
                v-model="assmnSfhlcResultInfo.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 평가기간 -->
              <y-datepicker
                :editable="newInsertMode"
                :width="8"
                :range="true"
                label="L0000003062"
                name="assessDt"
                v-model="assmnSfhlcResultInfo.assessDt"
                :required="true"
                v-validate="'required'"
                :state="validateState('assessDt')"
              ></y-datepicker>
            </b-col>
            <!-- 평가구분 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-select
                :editable="newInsertMode"
                :width="8"
                :comboItems="evalClsCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000003059"
                name="evalClsCd"
                v-model="assmnSfhlcResultInfo.evalClsCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('evalClsCd')"
                @datachange="datachange"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 대상년도 -->
              <y-datepicker
                :editable="newInsertMode"
                :width="8"
                type="year"
                name="year"
                label="L0000004449"
                :default="assmnSfhlcResultInfo.year"
                v-model="assmnSfhlcResultInfo.year"
                :required="true"
                v-validate="'required'"
                :state="validateState('year')"
              />
            </b-col>
            <!-- 주간부서 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-tree-dept
                label="L0000005015"
                name="mainDeptCd"
                v-model="assmnSfhlcResultInfo.mainDeptCd"
                :plantCd="assmnSfhlcResultInfo.plantCd"
                :required="true"
                :editable="newInsertMode && deptEditable"
                v-validate="'required'"
                :state="validateState('mainDeptCd')"
                @setDeptNm="setDeptNm"
              />
            </b-col>
            <!-- 수행부서 -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-tree-dept
                label="L0000005120"
                name="deptCd"
                v-model="assmnSfhlcResultInfo.deptCd"
                :plantCd="assmnSfhlcResultInfo.plantCd"
                :dtlNull="true"
                :required="true"
                :editable="newInsertMode"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <!-- 평가명 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :editable="newInsertMode"
                :width="10"
                ui="bootstrap"
                label="L0000003081"
                name="evalTitle"
                v-model="assmnSfhlcResultInfo.evalTitle"
                :required="true"
                v-validate="'required'"
                :state="validateState('evalTitle')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 업체 -->
              <y-text
                :width="8"
                :required="true"
                :editable="newInsertMode"
                :disabled="true"
                ui="bootstrap"
                name="vendorNm"
                label="L0000001951"
                v-model="assmnSfhlcResultInfo.vendorNm"
                v-validate="'required'"
                :state="validateState('vendorNm')"
                :appendIcon="[
                  { icon: 'search', callbackName: 'searchVendorMaster' },
                ]"
                @searchVendorMaster="btnSearchVendorClicked"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-2">
                  <y-label
                    :width="5"
                    ui="bootstrap"
                    label="L0000005754"
                  ></y-label>
                  <!-- 평점합계/배점합계 -->
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-2">
                  <el-tag
                    key="1"
                    :closable="false"
                    :disable-transitions="false"
                    :state="null"
                    name="evalSumPnt"
                    style="margin-left: 5px"
                    >{{ assmnSfhlcResultInfo.evalSumPnt }}</el-tag
                  >
                  /
                  <el-tag
                    key="2"
                    :closable="false"
                    :disable-transitions="false"
                    :state="null"
                    name="evalAllPnt"
                    style="margin-left: 5px"
                    >{{ assmnSfhlcResultInfo.evalAllPnt }}</el-tag
                  >
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-select
                :editable="apprMode"
                :width="8"
                :comboItems="ratingItems"
                itemText="codeNm"
                itemValue="code"
                label="L0000003944"
                ui="bootstrap"
                name="ratingCd"
                v-model="assmnSfhlcResultInfo.ratingCd"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :editable="apprMode"
                :width="10"
                :maxlength="250"
                ui="bootstrap"
                name="vendorDesc"
                label="L0000001360"
                v-model="assmnSfhlcResultInfo.vendorDesc"
                :rows="3"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 상세내용 -->
              <y-textarea
                :editable="newInsertMode"
                :width="10"
                :maxlength="250"
                ui="bootstrap"
                name="vendorDesc"
                label="L0000001528"
                v-model="assmnSfhlcResultInfo.evalDesc"
                :rows="3"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="5">
                  <y-label label="L0000005151" />
                </b-col>
                <!-- 산업안전보건비반영여부 -->
                <b-col sm="1" :editable="false" style="margin-left: 20px">
                  <y-checkbox
                    :width="8"
                    :comboItems="[
                      { text: '', value: 'Y' },
                      { text: '', value: 'N' },
                    ]"
                    ui="bootstrap"
                    name="costRefYn"
                    :useDefault="true"
                    v-model="assmnSfhlcResultInfo.costRefYn"
                  />
                </b-col>
                <b-col sm="5">
                  <y-number
                    :editable="costYn && apprMode"
                    :width="12"
                    ui="bootstrap"
                    name="cost"
                    v-model="assmnSfhlcResultInfo.cost"
                  />
                </b-col>
                <div slot="buttonGroup" class="float-right mb-1">
                  <!-- (원) -->
                  <y-label label="L0000005152" />
                </div>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 평가일 -->
              <y-datepicker
                :editable="apprMode"
                :width="8"
                label="L0000003091"
                name="evalFinishDt"
                v-model="assmnSfhlcResultInfo.evalFinishDt"
                :required="true"
                v-validate="'required'"
                :state="validateState('evalFinishDt')"
              ></y-datepicker>
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
          <resultmgnt-item-result
            v-show="tabIndex === '0'"
            sm="12"
            :assmnSfhlcResultInfo.sync="assmnSfhlcResultInfo"
            :deptListLoad.sync="deptListLoad"
            :updateMode.sync="updateMode"
            :apprMode.sync="apprMode"
          />

          <component
            v-show="tabIndex === '1'"
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
import resultmgntItemResult from './resultmgntItemResult.vue';

export default {
  /* attributes: name, components, props, data */
  name: 'y-facility-mst-detail',
  components: {
    resultmgntItemResult,
  },

  props: {
    popupParam: {
      type: Object,
      default: {
        evalPlanVendorNo: 0,
        newInsert: false,
      },
    },
  },
  data: () => ({
    assmnSfhlcResultInfo: {
      vendorEvalPlanNo: 0,
      evalPlanVendorNo: 0,
      plantCd: '', // 사업장 코드
      evalClsCd: '',
      year: '',
      evalStartDt: '',
      evalEndDt: '',
      mainDeptCd: '',
      deptCd: '',
      mainDeptNm: '',
      evalTitle: '',
      vendorDesc: '',
      assessDt: null,
      assmnSfhlcItemList: [], // 평가항목
      costRefYn: '',
      cost: 0,
      evalFinishDt: '',
      stepNm: '',
      evalSumPnt: 0, // 평점
      evalAllPnt: 0, // 총점
      ratingCd: null, // 등급
      vendorCd: '',
      vendorNm: '',
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
    evalClsCdItems: [], // 평가구분
    ratingItems: [], // 등급
    component: null,
    component2: null,
    deptListLoad: false,
    apprMode: true,
    newInsertMode: false,
    costYn: false,
    companyEditable: false, // 전사 권한
    plantEditable: false, // 사업장 권한
    deptEditable: false, // 일반 권한
  }),
  watch: {
    'assmnSfhlcResultInfo.evalClsCd'() {
      if (!this.assmnSfhlcResultInfo.plantCd) {
        this.$comm.alertWarning('L0000005081'); // 본문 사업장을 선택해주세요.
        return;
      }
      if (!this.assmnSfhlcResultInfo.evalPlanVendorNo) {
        this.searchItemList();
      }
    },
    'assmnSfhlcResultInfo.costRefYn'() {
      if (this.assmnSfhlcResultInfo.costRefYn === 'N') {
        this.assmnSfhlcResultInfo.cost = 0;
        this.costYn = false;
      } else {
        this.costYn = true;
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
      this.newInsertMode = this.popupParam.newInsert;

      // Url Setting
      this.detailUrl = selectConfig.vendor.assmnSfhlcResult.get.url;
      this.itemListUrl = selectConfig.vendor.assmnSfhlc.itemlist.url;
      this.editUrl = transactionConfig.vendor.assmnSfhlcResult.edit.url;
      this.insertUrl = transactionConfig.vendor.assmnSfhlcResult.insert.url;
      this.deleteUrl = transactionConfig.vendor.assmnSfhlcResult.delete.url;

      this.component2 = () =>
        import('@/pages/common/attachFile/multiFileUpload');
      // 구분
      this.$comm.getComboItems('SAF_SC_EVAL_CLS', false).then((_result) => {
        this.evalClsCdItems = _result;
      });
      // 등급
      this.$comm.getComboItems('SAF_EVAL_RATING', false).then((_result) => {
        this.ratingItems = _result;
      });

      if (!this.popupParam.evalPlanVendorNo) {
        this.assmnSfhlcResultInfo.year = this.$comm.moment().format('YYYY');
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

        this.assmnSfhlcResultInfo.assessDt = [from, to];
        this.assmnSfhlcResultInfo.evalPlanVendorNo = 0;
        this.assmnSfhlcResultInfo.evalFinishDt = this.$comm
          .moment()
          .format('YYYY-MM-DD');
        this.setAttachFileGrps();
      } else {
        this.assmnSfhlcResultInfo.evalPlanVendorNo =
          this.popupParam.evalPlanVendorNo;
      }

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
      }
      console.log('111', this.popupParam);
      this.getDetail();
    },
    btnSearchVendorClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000000327'; /* 업체검색 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: this.$store.getters.plantCd,
      };
      this.popupOptions.closeCallback = this.closePopupSearchVendor;
    },
    closePopupSearchVendor(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data) {
        this.assmnSfhlcResultInfo.vendorCd = data.data.vendorCd;
        this.assmnSfhlcResultInfo.vendorNm = data.data.vendorNm;
      }
    },
    setDeptNm(deptNm) {
      this.assmnSfhlcResultInfo.mainDeptNm = deptNm;
    },
    getDetail() {
      if (!this.assmnSfhlcResultInfo.evalPlanVendorNo) return;
      this.$http.url = this.$format(
        this.detailUrl,
        this.assmnSfhlcResultInfo.evalPlanVendorNo
      );
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.updateMode = true;

          this.assmnSfhlcResultInfo = _result.data;
          this.assmnSfhlcResultInfo.assessDt = [
            this.assmnSfhlcResultInfo.evalStartDt,
            this.assmnSfhlcResultInfo.evalEndDt,
          ];
          if (this.assmnSfhlcResultInfo.apprRqstNo === 0) {
            this.newInsert = false;
            this.apprMode = true;
          } else if (
            this.assmnSfhlcResultInfo.stepNm === '결재반려' ||
            this.assmnSfhlcResultInfo.stepNm === '결재요청전' ||
            this.popupParam.apprFlag
          ) {
            this.newInsert = false;
            this.apprMode = true;
          } else {
            this.apprMode = false;
          }
          var checkBox = document.getElementsByClassName(
            'custom-control-input'
          )[0];
          if (!this.apprMode) {
            checkBox.disabled = true;
          } else {
            checkBox.disabled = false;
          }
          this.setAttachFileGrps();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    searchItemList() {
      if (!this.assmnSfhlcResultInfo.evalPlanVendorNo) {
        this.assmnSfhlcResultInfo.evalPlanVendorNo = 0;
      }
      this.$http.url = this.$format(
        this.itemListUrl,
        this.assmnSfhlcResultInfo.evalPlanVendorNo,
        this.assmnSfhlcResultInfo.plantCd,
        this.assmnSfhlcResultInfo.evalClsCd
      );
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          let allCnt = 0;
          this.assmnSfhlcResultInfo.assmnSfhlcItemList = _result.data;
          if (this.newInsertMode) {
            this.$_.forEach(
              this.assmnSfhlcResultInfo.assmnSfhlcItemList,
              (item) => {
                allCnt += item.subconEvalItemPnt;
              }
            );
            this.assmnSfhlcResultInfo.evalAllPnt = allCnt;
          }
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
              message: '평가및안전보건비용 결과 정보를 수정하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.assmnSfhlcResultInfo.evalStartDt =
                  this.assmnSfhlcResultInfo.assessDt[0];
                this.assmnSfhlcResultInfo.evalEndDt =
                  this.assmnSfhlcResultInfo.assessDt[1];
                this.assmnSfhlcResultInfo.updateUserId =
                  this.$store.getters.token;
                this.assmnSfhlcResultInfo.updateDeptNm =
                  this.$store.getters.deptNm;
                this.assmnSfhlcResultInfo.updateDeptCd =
                  this.$store.getters.deptCd;
                this.assmnSfhlcResultInfo.updatePositionCd =
                  this.$store.getters.positionCd;
                this.assmnSfhlcResultInfo.updatePositionNm =
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
        if (!this.assmnSfhlcResultInfo.costRefYn) {
          this.assmnSfhlcResultInfo.costRefYn = 'N';
        }
        if (this.newInsertMode) {
          if (!this.assmnSfhlcResultInfo.plantCd) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'L0000005081' /* 본문 사업장을 선택해주세요. */,
              type: 'warning', // success / info / warning / error
            });
            _resolve(false);
            return;
          }
          if (
            !this.assmnSfhlcResultInfo.assessDt[0] ||
            !this.assmnSfhlcResultInfo.assessDt[1]
          ) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'L0000005154' /* 평가(계획)기간을 선택해주세요. */,
              type: 'warning', // success / info / warning / error
            });
            _resolve(false);
            return;
          }
          if (!this.assmnSfhlcResultInfo.evalClsCd) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'L0000005157' /* 평가구분을 선택해주세요. */,
              type: 'warning', // success / info / warning / error
            });
            _resolve(false);
            return;
          }
          if (!this.assmnSfhlcResultInfo.mainDeptCd) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'L0000005136' /* 주관부서를 선택해주세요. */,
              type: 'warning', // success / info / warning / error
            });
            _resolve(false);
            return;
          }
          if (!this.assmnSfhlcResultInfo.year) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'L0000005132' /* 대상년도를 선택해주세요. */,
              type: 'warning', // success / info / warning / error
            });
            _resolve(false);
            return;
          }
          if (!this.assmnSfhlcResultInfo.deptCd) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'L0000005155' /* 수행부서를 선택해주세요. */,
              type: 'warning', // success / info / warning / error
            });
            _resolve(false);
            return;
          }
          if (!this.assmnSfhlcResultInfo.evalTitle) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'L0000005137' /* 평가명을 입력해주세요. */,
              type: 'warning', // success / info / warning / error
            });
            _resolve(false);
            return;
          }

          if (!this.assmnSfhlcResultInfo.vendorCd) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'L0000005156' /* 업체를 선택해주세요. */,
              type: 'warning', // success / info / warning / error
            });
            _resolve(false);
            return;
          }
          if (!this.assmnSfhlcResultInfo.evalFinishDt) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'L0000005141' /* 평가일을 입력해주세요. */,
              type: 'warning', // success / info / warning / error
            });
            _resolve(false);
            return;
          }
        }
        if (this.assmnSfhlcResultInfo.costRefYn === 'Y') {
          if (
            !this.assmnSfhlcResultInfo.cost ||
            this.assmnSfhlcResultInfo.cost === 0
          ) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'L0000005153' /* 산업안전보건비를 입력해주세요. */,
              type: 'warning', // success / info / warning / error
            });
            _resolve(false);
            return;
          }
        }

        if (flag === 'insert') {
          this.nextInsert();
        } else {
          this.nextUpdate();
        }
      });
    },
    nextInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: '확인',
              message: '평가및안전보건비용 결과 정보를 등록하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.assmnSfhlcResultInfo.evalStartDt =
                  this.assmnSfhlcResultInfo.assessDt[0];
                this.assmnSfhlcResultInfo.evalEndDt =
                  this.assmnSfhlcResultInfo.assessDt[1];
                this.assmnSfhlcResultInfo.updateUserId =
                  this.$store.getters.token;
                this.assmnSfhlcResultInfo.updateDeptNm =
                  this.$store.getters.deptNm;
                this.assmnSfhlcResultInfo.updateDeptCd =
                  this.$store.getters.deptCd;
                this.assmnSfhlcResultInfo.updatePositionCd =
                  this.$store.getters.positionCd;
                this.assmnSfhlcResultInfo.updatePositionNm =
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
    },
    btnInsertClickedCallback(result) {
      this.assmnSfhlcResultInfo.evalPlanVendorNo = result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.newInsertMode = false;
      this.updateMode = true;
      this.saveAttach();
      this.getDetail();
    },
    deleteInfo() {
      return new Promise((_resolve, _reject) => {
        this.$http.type = 'GET';
        this.$http.url = this.$format(
          selectConfig.vendor.assmnSfhlc.getstatus.url,
          this.assmnSfhlcResultInfo.evalPlanVendorNo
        );
        this.$http.request(
          (_result) => {
            if (_result.data === 0) {
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
            this.assmnSfhlcResultInfo.evalPlanVendorNo
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
      let taskKey = this.assmnSfhlcResultInfo.evalPlanVendorNo
        ? this.assmnSfhlcResultInfo.evalPlanVendorNo
        : ''; // 현 모델 키 값

      this.attachFileGrps = [
        {
          label: '파일업로드',
          drag: this.editable,
          showFileSearch: false,
          editable: this.editable && this.apprMode,
          disabled: !this.apprMode,
          uploadTempFiles: null,
          taskClassNm: 'SAF_VENDOR_EVAL_RESULT', // 현 화면의 첨부파일 키 값
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
        item.taskKey = this.assmnSfhlcResultInfo.evalPlanVendorNo;
      });

      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitCheck = !this.submitCheck;
      }
    },
    beforeConfirm() {
      this.deptListLoad = !this.deptListLoad;
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000718',
        // 결재요청 전 저장됩니다. 진행하시겠습니까?
        type: 'info', // success / info / warning / error
        confirmCallback: () => {
          this.assmnSfhlcResultInfo.evalStartDt =
            this.assmnSfhlcResultInfo.assessDt[0];
          this.assmnSfhlcResultInfo.evalEndDt =
            this.assmnSfhlcResultInfo.assessDt[1];
          this.assmnSfhlcResultInfo.updateUserId = this.$store.getters.token;
          this.assmnSfhlcResultInfo.updateDeptNm = this.$store.getters.deptNm;
          this.assmnSfhlcResultInfo.updateDeptCd = this.$store.getters.deptCd;
          this.assmnSfhlcResultInfo.updatePositionCd =
            this.$store.getters.positionCd;
          this.assmnSfhlcResultInfo.updatePositionNm =
            this.$store.getters.positionNm;
          this.$http.url = this.editUrl;
          this.$http.type = 'PUT';
          this.$http.param = this.assmnSfhlcResultInfo;
          this.$http.request(
            (_result) => {
              this.popupOptions.target = () =>
                import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
              this.popupOptions.title = 'L0000003418'; // 결재요청
              this.popupOptions.visible = true;
              this.popupOptions.closeCallback = this.closeApprPop;
              this.popupOptions.width = '80%';
              this.popupOptions.param = {
                apprBizCd: 'CN-EV-03',
                apprRqstNo: this.assmnSfhlcResultInfo.apprRqstNo,
                apprParams: {
                  evalPlanVendorNo: this.assmnSfhlcResultInfo.evalPlanVendorNo,
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
    },
  },
};
</script>
