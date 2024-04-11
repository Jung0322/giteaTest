<!--
  목적 : 검진결과 상세
  작성자 :
  Detail :
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
            <!-- 검진 정보 -->
            <y-label
              label="L0000000345"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="checkupResult"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSaveSubmit"
                @beforeSaveSubmit="beforeSaveSubmit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4">
                  <!-- 사업장 / 부서 -->
                  <y-label label="L0000001416"></y-label>
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="checkupResult.plantNm"
                    :fieldable="true"
                  ></y-label>
                  <y-label :label="plantDeptSlash" :fieldable="true"></y-label>
                  <y-label
                    :label="checkupResult.deptNm"
                    :fieldable="true"
                  ></y-label>
                </b-col>
              </b-row>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 성명 -->
              <y-text
                :width="8"
                :disabled="true"
                :required="true"
                ui="bootstrap"
                name="userNm"
                label="L0000001630"
                v-model="checkupResult.userNm"
                :appendIcon="
                  editable && !checkUpDisabled
                    ? [
                        { icon: 'search', callbackName: 'searchUser' },
                        { icon: 'times', callbackName: 'removeUser' },
                      ]
                    : null
                "
                @searchUser="btnSearchUserClicked"
                @removeUser="removeUser"
                v-validate="'required'"
                :state="validateState('userNm')"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4">
                  <!-- 사번 -->
                  <y-label label="L0000001412"></y-label>
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="checkupResult.userId"
                    :fieldable="true"
                  ></y-label>
                </b-col>
              </b-row>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4">
                  <!-- 검진당시 부서 -->
                  <y-label label="L0000000365"></y-label>
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="checkupResult.deptNmOrg"
                    :fieldable="true"
                  ></y-label>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 검진일 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                :disabled="checkUpDisabled"
                :required="true"
                :start="popupParam.start"
                :end="popupParam.end"
                label="L0000000371"
                name="heaCheckedYmd"
                v-model="checkupResult.heaCheckedYmd"
                v-validate="'required'"
                :state="validateState('heaCheckedYmd')"
              ></y-datepicker>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 검진계획 -->
              <y-select
                :width="8"
                :required="true"
                :ediable="editable"
                :disabled="
                  (this.checkupResult.heaCheckedYmd != null
                    ? checkUpDisabled
                    : true) || popupParam.heaCheckupPlanNoForNewResult
                "
                :comboItems="heaCheckupPlanNoItems"
                itemText="heaCheckupPlanNm"
                itemValue="heaCheckupPlanNo"
                ui="bootstrap"
                type="search"
                name="heaCheckupPlanNo"
                label="L0000000353"
                v-model="checkupResult.heaCheckupPlanNo"
                v-validate="'required'"
                :state="validateState('heaCheckupPlanNo')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 검진기관 -->
              <y-select
                :width="8"
                :required="true"
                :ediable="editable"
                :disabled="checkUpDisabled"
                :comboItems="heaCheckupOrgItems"
                itemText="heaCheckupOrgNm"
                itemValue="heaCheckupOrgNo"
                ui="bootstrap"
                type="search"
                name="heaCheckupOrgNo"
                label="L0000000357"
                v-model="checkupResult.heaCheckupOrgNo"
                v-validate="'required'"
                :state="validateState('heaCheckupOrgNo')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <b-row>
                <b-col sm="4">
                  <!-- 검진종류 -->
                  <y-label label="L0000000373"></y-label>
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="checkupResult.heaCheckupClassNm"
                    :fieldable="true"
                  ></y-label>
                </b-col>
              </b-row>
            </b-col>
            <!-- 소견 -->
            <el-divider v-if="checkUpDisabled" content-position="left">{{
              $comm.getLangSpecInfoLabel('L0000001658')
            }}</el-divider>
            <b-col
              v-if="checkUpDisabled"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
              <!-- 업무수행적합 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="heaWorkableCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="save"
                name="heaWorkableCd"
                label="L0000001949"
                v-model="checkupResult.heaWorkableCd"
                v-validate="'required'"
                :state="validateState('heaWorkableCd')"
              />
            </b-col>
            <b-col
              v-if="checkUpDisabled"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-6"
            >
              <!-- 사후관리 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="heaFollowUpCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="save"
                name="heaFollowUpCd"
                label="L0000001492"
                v-model="checkupResult.heaFollowUpCd"
                v-validate="'required'"
                :state="validateState('heaFollowUpCd')"
              />
            </b-col>
            <b-col
              v-if="checkUpDisabled"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12"
            >
              <!-- 종합소견 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="1000"
                ui="bootstrap"
                label="L0000002708"
                name="overallOpinion"
                v-model="checkupResult.overallOpinion"
              />
            </b-col>
            <b-col
              v-if="checkUpDisabled"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-12"
            >
              <!-- 관련유해인자 -->
              <y-textarea
                v-if="checkupResult.heaCheckupClassCd === 'B1'"
                :width="10"
                :editable="editable"
                :maxlength="1000"
                ui="bootstrap"
                label="L0000000575"
                name="refHazardDesc"
                v-model="checkupResult.refHazardDesc"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <component
        :is="compResultDiag"
        v-if="compResultDiag && checkUpDisabled"
        :popupParam="popupParam"
      />
      <component
        :is="compItemResult"
        v-if="compItemResult && checkUpDisabled"
        :popupParam="popupParam"
      />
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'checkup-result-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        heaCheckupPlanNo: 0,
        userId: '',
        userNm: '',
        deptNm: '',
        deptCd: '',
        plantNm: '',
        plantCd: '',
        start: '',
        end: '',
        heaCheckupPlanNoForNewResult: '',
      },
    },
  },
  data() {
    return {
      checkupResult: {
        heaCheckupPlanNo: 0,
        heaCheckupPlanNm: '',
        heaCheckupClassCd: '',
        heaCheckupClassNm: '',
        heaCheckupOrgNo: null,
        heaCheckupOrgNm: '',
        userId: '',
        userNm: '',
        deptCd: '',
        deptNm: '',
        deptCdOrg: '',
        deptNmOrg: '',
        heaCheckedYmd: null,
        heaWorkableCd: null,
        heaWorkableNm: '',
        heaFollowUpCd: null,
        heaFollowUpNm: '',
        overallOpinion: '',
        refHazardDesc: '',
        updateUserId: '',
      },
      editable: false,
      checkUpDisabled: false,
      isSave: false,
      actionType: 'POST',

      heaWorkableCdItems: [],
      heaFollowUpCdItems: [],

      heaCheckupPlanNoItems: [],
      heaCheckupOrgItems: [],

      detailUrl: '',
      searchPlanUrl: '',
      searchPlanDetailUrl: '',
      checkUrl: '',
      saveUrl: '',

      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },

      compResultDiag: null,
      compItemResult: null,
      plantDeptSlash: '/',
    };
  },
  computed: {},
  watch: {
    'checkupResult.heaCheckupPlanNo'() {
      if (this.checkupResult.heaCheckupPlanNo) {
        let data = this.$_.find(this.heaCheckupPlanNoItems, {
          heaCheckupPlanNo: this.checkupResult.heaCheckupPlanNo,
        });
        if (data) {
          this.getPlanDetail(data);
        }
      }
    },
    'checkupResult.plantCd'() {
      this.getHeaCheckupPlanNoItems();
    },
    'checkupResult.heaCheckedYmd'() {
      this.getHeaCheckupPlanNoItems();
    },
    'checkupResultDiag.heaDiseaseClassCd': function (newValue, oldValue) {
      this.getHeaDiseaseCdItems();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    // TODO : data를 초기화 시켜줌(검색 조건 유지가 필요할 때는 삭제할 것)
    // 이유 : vue.js는 SPA기반으로 동작하기 때문에 페이지를 이동하더라도 기존 입력된 정보가 그대로 남아 있는 문제가 있음
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.detailUrl = selectConfig.hea.checkupResult.get.url;
      this.searchPlanUrl = selectConfig.hea.checkupPlan.list.url;
      this.searchPlanDetailUrl = selectConfig.hea.checkupPlan.get.url;
      this.checkUrl = selectConfig.hea.checkupResult.check.url;
      this.saveUrl = transactionConfig.hea.checkupResult.insert.url;
      this.getHeaCheckupPlanNoItems(); // 검진계획 조회
      setTimeout(() => {
        if (this.popupParam.heaCheckupPlanNo) {
          this.getResultDetail();
        } else if (this.popupParam.deptNm) {
          this.checkupResult.userId = this.popupParam.userId;
          this.checkupResult.userNm = this.popupParam.userNm;
          this.checkupResult.plantCd = this.popupParam.plantCd;
          this.checkupResult.plantNm = this.popupParam.plantNm;
          this.checkupResult.deptCd = this.popupParam.deptCd;
          this.checkupResult.deptNm = this.popupParam.deptNm;
          this.checkupResult.deptCdOrg = this.popupParam.deptCd;
          this.checkupResult.deptNmOrg = this.popupParam.deptNm;
          if (this.popupParam.heaCheckupPlanNoForNewResult) {
            this.checkupResult.heaCheckupPlanNo =
              this.popupParam.heaCheckupPlanNoForNewResult;
          }
        } else {
          this.checkupResult.userId = this.$store.getters.token;
          this.checkupResult.userNm = this.$store.getters.name;

          this.checkupResult.plantCd = this.$store.getters.plantCd;
          this.checkupResult.plantNm = this.$store.getters.plantNm;
          this.checkupResult.deptCd = this.$store.getters.deptCd;
          this.checkupResult.deptNm = this.$store.getters.deptNm;
          this.checkupResult.deptCdOrg = this.$store.getters.deptCd;
          this.checkupResult.deptNmOrg = this.$store.getters.deptNm;
        }
      }, 300);
    },
    loadComponent() {
      this.compResultDiag = () => import(`${'./checkupResultDiag.vue'}`);
      this.compItemResult = () => import(`${'./testItemResult.vue'}`);
    },
    getResultDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.popupParam.heaCheckupPlanNo,
        this.popupParam.userId
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.checkupResult = _result.data;
          this.checkUpDisabled = true;
          this.checkupResult.heaCheckedYmd = this.$comm
            .moment(this.checkupResult.heaCheckedYmd)
            .format('YYYY-MM-DD');
          this.loadComponent();
          this.getHeaWorkableCdItems();
          this.getHeaFollowUpCdItems();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getHeaCheckupPlanNoItems() {
      let startDate = null;
      let endDate = null;
      if (this.checkupResult.heaCheckedYmd) {
        startDate = this.$comm
          .moment(this.checkupResult.heaCheckedYmd)
          .format('YYYY');
        endDate = this.$comm
          .moment(this.checkupResult.heaCheckedYmd)
          .format('YYYY');
      } else if (this.popupParam.start && this.popupParam.end) {
        startDate = this.$comm.moment(this.popupParam.start).format('YYYY');
        endDate = this.$comm.moment(this.popupParam.end).format('YYYY');
      }
      // 검진계획 선택항목 조회
      this.$http.url = this.searchPlanUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        startDate: startDate,
        endDate: endDate,
        plantCd: this.checkupResult.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            heaCheckupPlanNo: null,
            heaCheckupPlanNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });

          this.heaCheckupPlanNoItems = _result.data;
          if (
            this.$_.findIndex(this.heaCheckupPlanNoItems, {
              heaCheckupPlanNo: this.checkupResult.heaCheckupPlanNo,
            }) === -1
          ) {
            this.checkupResult.heaCheckupPlanNo = null;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getPlanDetail(data) {
      if (!data || !data.heaCheckupPlanNo) {
        return;
      }
      this.$http.url = this.$format(
        this.searchPlanDetailUrl,
        data.heaCheckupPlanNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.checkupResult.heaCheckupClassCd = _result.data.heaCheckupClassCd;
          this.checkupResult.heaCheckupClassNm = _result.data.heaCheckupClassNm;
          this.heaCheckupOrgItems = _result.data.checkupPlanOrgs;
          this.heaCheckupOrgItems.splice(0, 0, {
            heaCheckupOrgNo: null,
            heaCheckupOrgNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // '선택하세요',
          });
          if (
            this.$_.findIndex(this.heaCheckupOrgItems, {
              heaCheckupOrgNo: this.checkupResult.heaCheckupOrgNo,
            }) === -1
          ) {
            this.checkupResult.heaCheckupOrgNo = null;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getHeaWorkableCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'HEA_WORKABLE'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 선택하세요
          this.heaWorkableCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getHeaFollowUpCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'HEA_FOLLOW_UP'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
          }); // 선택하세요
          this.heaFollowUpCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    closePopup() {
      // 부모창에 값 전달
      window.getApp.$emit('closePopupToDetail');
      this.$emit('closePopup', { success: true });
    },
    beforeSaveSubmit() {
      if (this.checkUpDisabled) {
        this.actionType = 'PUT';
        this.saveUrl = transactionConfig.hea.checkupResult.edit.url;
      } else {
        this.actionType = 'POST';
        this.saveUrl = transactionConfig.hea.checkupResult.insert.url;
      }
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              userId: this.checkupResult.userId,
              heaCheckupPlanNo: this.checkupResult.heaCheckupPlanNo,
            };
            this.$http.request(
              (_result) => {
                if (_result.data > 0 && this.actionType === 'POST') {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message:
                      this.$comm.getLangSpecInfoLabel('L0000005743') +
                      this.checkupResult.userNm +
                      this.$comm.getLangSpecInfoLabel('L0000005744'),
                    // 해당계획에 + 님은 이미 등록된 결과가 있습니다.
                    type: 'warning',
                  });
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.popupParam.userId = this.checkupResult.userId;
                      this.popupParam.heaCheckupPlanNo =
                        this.checkupResult.heaCheckupPlanNo;
                      this.checkupResult.heaCheckedYmd = this.$comm
                        .moment(this.checkupResult.heaCheckedYmd)
                        .format('YYYY-MM-DD');
                      this.checkupResult.createUserId =
                        this.$store.getters.token;
                      this.checkupResult.updateUserId =
                        this.$store.getters.token;
                      this.isSave = true;
                    },
                    cancelCallback: () => {
                      this.isSave = false;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            this.$popupRequired.check(
              'checkupResultDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
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
    btnSaveClickedCallback(_result) {
      this.isSave = false;
      this.checkUpDisabled = true;
      this.loadComponent();
      this.getHeaWorkableCdItems();
      this.getHeaFollowUpCdItems();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000001034', // 정상적으로 저장하였습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.checkupResult.userId = data.user.userId;
        this.checkupResult.userNm = data.user.userNm;

        this.checkupResult.plantCd = data.user.plantCd;
        this.checkupResult.plantNm = data.user.plantNm;
        this.checkupResult.deptCd = data.user.deptCd;
        this.checkupResult.deptNm = data.user.deptNm;
        this.checkupResult.deptCdOrg = data.user.deptCdOrg;
        this.checkupResult.deptNmOrg = data.user.deptNmOrg;
      }
    },
    removeUser() {
      this.checkupResult.userNm = '';
      this.checkupResult.userId = '';

      this.checkupResult.plantCd = '';
      this.checkupResult.plantNm = '';
      this.checkupResult.deptCd = '';
      this.checkupResult.deptNm = '';
      this.checkupResult.deptCdOrg = '';
      this.checkupResult.deptNmOrg = '';
    },
  },
};
</script>
