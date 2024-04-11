<!--
  목적 : 안전 - 선해임 상세
  Detail : 선해임 등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 배출시설 상세 -->
            <y-label
              label="L0000001171"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 개정 -->
              <y-btn
                v-if="showRevisionAndUpdateButton"
                title="L0000000291"
                :showLoading="false"
                color="blue"
                @btnClicked="revPopup"
              />
              <!-- 수정 -->
              <y-btn
                v-if="showRevisionAndUpdateButton"
                title="L0000001696"
                color="orange"
                @btnClicked="updatePopup"
              />
              <!-- 개정완료 -->
              <!-- <y-btn
                v-if="isRevisionButtonClicked"
                :action-url="insertUrl"
                :param="ghgFclt"
                :is-submit="isRev"
                title="L0000003777"
                color="blue"
                action-type="POST"
                beforeSubmit="beforeRevSave"
                @beforeRevSave="beforeRevSave"
                @btnClicked="btnRevSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              /> -->
              <!-- 개정완료-->
              <y-btn
                v-if="isRevisionButtonClicked"
                title="L0000003777"
                color="blue"
                @btnClicked="btnRevSaveClicked"
              />

              <!-- 수정완료
              <y-btn
                v-if="isUpdateButtonClicked"
                :action-url="updateUrl"
                :param="ghgFclt"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnSaveClicked"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              /> -->
              <!-- 저장 -->
              <y-btn
                v-if="!isRevisionButtonClicked && isEnable"
                title="L0000002474"
                color="orange"
                @btnClicked="btnSaveClicked"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="12">
              <el-tag size="mini" type="info">
                <i class="el-icon-info"></i>
                {{ $comm.getLangSpecInfoMessage('M0000001168') }}
              </el-tag>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :disabled="true"
                :required="true"
                :width="8"
                :editable="editable"
                name="plantCd"
                v-model="ghgFclt.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 부서 -->
              <y-tree-dept
                type="edit"
                :disabled="true"
                label="L0000001287"
                name="deptCd"
                :editable="editable"
                :required="true"
                :plantCd="ghgFclt.plantCd"
                v-model="ghgFclt.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출시설명 -->
              <y-text
                :width="8"
                ui="bootstrap"
                :required="true"
                :editable="isEnable"
                :disabled="!isEnable"
                label="L0000001174"
                name="fcltNm"
                :readonly="true"
                v-model="ghgFclt.fcltNm"
                :appendIcon="[
                  { icon: 'search', callbackName: 'searchFacility' },
                ]"
                @searchFacility="searchFacility"
                v-validate="'required'"
                :state="validateState('fcltNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 배출시설분류 -->
              <y-select
                :width="8"
                :comboItems="disFacItems"
                :required="true"
                :editable="isEnable"
                :disabled="!isEnable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001175"
                name="ghgFcltCd"
                v-model="ghgFclt.ghgFcltCd"
                v-validate="'required'"
                :state="validateState('ghgFcltCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 공정-->
              <y-tree-process
                label="L0000000515"
                name="processCd"
                type="edit"
                :editable="isEnable"
                :disabled="!isEnable"
                :plantCd="ghgFclt.plantCd"
                :deptCd="ghgFclt.deptCd"
                v-model="ghgFclt.processCd"
              ></y-tree-process>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- NGMS시설일련번호 -->
              <y-text
                :width="8"
                ui="bootstrap"
                :required="true"
                :editable="isEnable"
                :disabled="!isEnable"
                label="L0000000136"
                name="ngmsFceqNum"
                v-model="ghgFclt.ngmsFceqNum"
                v-validate="'required'"
                :state="validateState('ngmsFceqNum')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!--시설코드(ERP) -->
              <y-text
                :width="8"
                ui="bootstrap"
                :editable="isEnable"
                :disabled="!isEnable"
                label="L0000001768"
                name="erpCode"
                v-model="ghgFclt.erpCode"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!--정렬순서-->
              <y-number
                :width="8"
                :editable="isEnable"
                :disabled="!isEnable"
                :isPositive="true"
                ui="bootstrap"
                label="L0000002601"
                name="sortOrder"
                v-model="ghgFclt.sortOrder"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부 -->
              <y-switch
                :width="8"
                true-value="Y"
                :editable="isEnable"
                :disabled="!isEnable"
                false-value="N"
                ui="L0000001439"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="ghgFclt.useYn"
              ></y-switch>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 소규모배출시설여부 -->
              <y-select
                :width="8"
                :comboItems="sFcltItems"
                :editable="isEnable"
                :disabled="!isEnable"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000004485"
                name="sFcltYn"
                v-model="ghgFclt.sFcltYn"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 개정번호 -->
              <y-number
                :width="8"
                :editable="isRevisionButtonClicked"
                :disabled="!isRevisionButtonClicked"
                ui="bootstrap"
                label="L0000000293"
                name="revisionNo"
                :hasSeperator="false"
                :maxlength="5"
                v-model="ghgFclt.revisionNo"
                :required="isRevisionButtonClicked ? true : false"
                v-validate="isRevisionButtonClicked ? 'required' : ''"
                :state="validateState('revisionNo')"
              ></y-number>
            </b-col>
            <b-col
              v-if="popupParam.ghgFcltNo > 0"
              sm="12"
              md="12"
              lg="12"
              xl="12"
              class="col-xxl-6"
            >
              <!-- 개정사유 -->
              <y-textarea
                :width="10"
                :maxlength="300"
                :editable="isRevisionButtonClicked"
                :disabled="!isRevisionButtonClicked"
                ui="bootstrap"
                label="L0000000294"
                name="revContents"
                v-model="ghgFclt.chgReason"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
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
              {{ item.title }}
            </span>
          </el-tab-pane>
          <keep-alive>
            <component
              sm="12"
              v-if="component"
              :is="component"
              :ghgFclt.sync="ghgFclt"
              :isEnable="isEnable"
            />
          </keep-alive>
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
  name: 'discharge-facility-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ghgFcltNo: 0, // key
      },
    },
  },
  data() {
    return {
      ghgFclt: {
        ghgFcltNo: 0,
        eairDischFacNo: 0,
        ghgFcltCd: null,
        ghgFcltGrpNo: 0,
        fcltNm: null,
        plantCd: null,
        lcnFactCd: null,
        ngmsFceqNum: null,
        erpCode: null,
        deptCd: null,
        processCd: null,
        useYn: 'Y',
        sFcltYn: '',
        chgReason: '',
        sortOrder: null,
        createUserId: null,
        updateUserId: null,
        disActDataList: [],
        disActDataHistoryList: [],
        revisionNo: null,
      },
      tabIndex: 0,
      tabItems: [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001189'),
          url: './disActData',
        } /* 배출활동/활동자료 */,
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001745'),
          url: './disFacDetailHistory',
        } /* 시설사용변경이력 */,
      ],
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        param: {},
        width: '90%',
        top: '10px',
        closeCallback: null,
      },
      component: null,
      editable: false,
      saveUrl: '',

      insertUrl: '',
      updateUrl: '',
      isEdit: false,
      isRev: false,
      isSave: false,

      disFacItems: [],
      sFcltItems: [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ],
      // 상세 보기시 true
      updateMode: false,
      // 개정버튼 클릭시 true
      isRevisionButtonClicked: false,
      // 수정버튼 클릭시 true
      isUpdateButtonClicked: false,
      historyList: [],
    };
  },
  computed: {
    // 컴포넌트 활성화 여부(쓰기 권한 있고 신규 등록 상태 이거나, 개정 또는 수정 버튼 클릭 했을 경우)
    isEnable() {
      if (!this.editable) return false;
      return (
        !this.updateMode ||
        this.isRevisionButtonClicked ||
        this.isUpdateButtonClicked
      );
    },
    // 개정버튼, 수정버튼 표시 여부()
    showRevisionAndUpdateButton() {
      return (
        this.editable &&
        this.updateMode &&
        !this.isRevisionButtonClicked &&
        !this.isUpdateButtonClicked
      );
    },
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
  },
  mounted() {
    this.init();
    this.loadComponent();
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.$comm.getComboItems('GHG_FAC_DATA', false).then((_result) => {
        this.disFacItems = _result;
      });
      if (this.popupParam.ghgFcltNo === 0) {
        this.updateMode = false;
        // this.insertMode = true;
      } else {
        this.getDetail();
        this.updateMode = true;
        // this.insertMode = false;
        this.getHistoryList();
      }
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'disActData') {
        this.component = () => import('@/pages/env/gas/disActData');
      } else {
        this.component = () => import(`${path}`);
      }
    },
    getDetail() {
      return new Promise((_resolve, _reject) => {
        if (!this.popupParam.ghgFcltNo || this.popupParam.ghgFcltNo === 0) {
          this.ghgFclt.createUserNm = this.$store.getters.name;
          return;
        }
        this.$http.url = this.$format(
          selectConfig.env.gas.dischargeFacility.get.url,
          this.popupParam.ghgFcltNo
        );
        this.$http.type = 'GET';
        this.$http.request(
          (_result) => {
            this.ghgFclt = _result.data;
            _resolve(true);
            this.isRevisionButtonClicked = false;
            this.isUpdateButtonClicked = false;
            this.editable = true;
            this.updateMode = true;
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _resolve(false);
          }
        );
      });
    },
    searchFacility() {
      this.popupOptions.target = () =>
        import(`${'@/pages/env/air/facility/discharge.vue'}`);
      this.popupOptions.title = 'L0000001167'; /* 배출시설 */
      this.popupOptions.width = '70%';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closeFacilityPopup;
    },
    closeFacilityPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data) {
        this.ghgFclt.eairDischFacNo = data.item.eairDischFacNo;
        this.ghgFclt.fcltNm = data.item.eairDischFacNm;
        this.ghgFclt.plantCd = data.item.plantCd;
        this.ghgFclt.deptCd = data.item.mgDeptCd;
      }
    },
    revPopup() {
      this.isRev = false;
      this.isRevisionButtonClicked = true;
      this.isUpdateButtonClicked = false;
    },
    updatePopup() {
      this.isEdit = false;
      this.isRevisionButtonClicked = false;
      this.isUpdateButtonClicked = true;
    },
    btnSaveClicked() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$comm.recursivePromise([
              {
                func: this.checkValidation,
                exceptionMessage: 'M0000000005',
                // 필수 입력값을 입력해 주세요.
              },
              {
                func: this.checkFacility,
                exceptionMessage: 'M0000000336',
                // 입력된 시설은 이미 등록되어있습니다.
              },
              {
                func: this.confirm,
                param: 'M0000000337',
                // 저장하시겠습니까? (값이 없는 배출활동/활동자료 목록 행은 자동 제거 됩니다.)
              },
              { func: this.saveData },
              { func: this.getDetail, successMessage: 'M0000000006' },
              // 저장되었습니다.
            ]);
          } else {
            this.$popupRequired.check(
              'dischargeFacilityDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' /* 유효성 검사도중 에러가 발생하였습니다 */
          );
          this.isInsert = false;
        });
    },
    getHistoryList() {
      this.$http.url = this.$format(
        selectConfig.env.gas.dischargeFacility.histroys.url,
        this.popupParam.ghgFcltNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.historyList = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnRevSaveClicked() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (this.ghgFclt.revisionNo === 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'L0000004786', // '개정번호를 입력하세요',
                type: 'warning',
              });
            } else if (
              this.ghgFclt.revisionNo <= this.historyList[0].revisionNo
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000001075', // '개정번호는 이전 개정번호보다 커야합니다',
                type: 'warning',
              });
            } else {
              this.$comm.recursivePromise([
                {
                  func: this.checkValidation,
                  exceptionMessage: 'M0000000005',
                  // 필수 입력값을 입력해 주세요.
                },
                {
                  func: this.revConfirm,
                  param: 'M0000000166', // 개정하시겠습니까?
                },
                { func: this.saveRevData },
                { func: this.getDetail, successMessage: 'M0000000631' }, // 개정되었습니다.
              ]);
            }
          } else {
            this.$popupRequired.check(
              'dischargeFacilityDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' /* 유효성 검사도중 에러가 발생하였습니다 */
          );
          this.isInsert = false;
        });
    },
    /**
     * 필수입력값 유효성 검사
     */
    checkValidation() {
      return this.$validator.validateAll();
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
    checkFacility() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = selectConfig.env.gas.dischargeFacility.check.url;
        this.$http.type = 'GET';
        this.$http.param = {
          fcltNm: this.ghgFclt.fcltNm,
          ghgFcltNo:
            this.popupParam.ghgFcltNo > 0 ? this.popupParam.ghgFcltNo : 0,
        };
        this.$http.request(
          (_result) => {
            if (_result.data && _result.data > 0) {
              _resolve(false);
            } else {
              _resolve(true);
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _resolve(false);
            _reject(_error);
          }
        );
      });
    },
    confirm() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000337', // 저장하시겠습니까? (값이 없는 배출활동/활동자료 목록 행은 자동 제거 됩니다.)
          type: 'info',
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    revConfirm() {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: 'M0000000166', // 개정하시겠습니까?
          type: 'info',
          confirmCallback: () => {
            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData() {
      return new Promise((_resolve, _reject) => {
        if (this.popupParam.ghgFcltNo > 0) {
          this.$http.url =
            transactionConfig.env.gas.dischargeFacility.update.url;
          this.$http.type = 'PUT';
          this.ghgFclt.updateUserId = this.$store.getters.token;
        } else {
          this.$http.url =
            transactionConfig.env.gas.dischargeFacility.insert.url;
          this.$http.type = 'POST';
        }
        this.ghgFclt.disActDataList = this.$_.filter(
          this.ghgFclt.disActDataList,
          (_item) => {
            return _item.ghgActDaCd && _item.ghgOutActCd;
          }
        );
        this.ghgFclt.createUserId = this.$store.getters.token;
        this.$http.param = this.ghgFclt;
        this.$http.request(
          (_result) => {
            this.isSave = true;
            this.popupParam.ghgFcltNo = _result.data;
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
        this.editable = false;
      });
    },
    saveRevData() {
      return new Promise((_resolve, _reject) => {
        this.ghgFclt.updateUserId = this.$store.getters.token;
        this.$http.url =
          transactionConfig.env.gas.dischargeFacility.revInsert.url;
        this.$http.type = 'PUT';
        this.ghgFclt.disActDataList = this.$_.filter(
          this.ghgFclt.disActDataList,
          (_item) => {
            return _item.ghgActDaCd && _item.ghgOutActCd;
          }
        );

        this.ghgFclt.createUserId = this.$store.getters.token;
        this.$http.param = this.ghgFclt;
        this.$http.request(
          (_result) => {
            this.isSave = true;
            this.popupParam.ghgFcltNo = _result.data;
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
      });
    },
    beforeEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000011' /* 저장하시겠습니까? */,
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.ghgFclt.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {},
            });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000000005' /* 필수 입력값을 입력해 주세요. */,
              type: 'warning',
            });
          }
        })
        .catch((e) => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    beforeRevSave() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321' /* 확인 */,
              message: 'M0000000166' /* 개정하시겠습니까? */,
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.referenceInfo.createUserId = this.$store.getters.token;
                this.isRev = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {},
            });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000000005' /* 필수 입력값을 입력해 주세요. */,
              type: 'warning',
            });
          }
        })
        .catch((e) => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    btnRevSaveClickedCallback(_result) {
      this.referenceInfo.lcnBoardNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000631' /* 개정되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.getDetail();
      this.saveAttach();
      this.getHistoryList();

      this.isRev = false;
      this.updateMode = true;
      // this.insertMode = false;
      this.isUpdateButtonClicked = false;
      this.isRevisionButtonClicked = false;

      this.count++;
      //  this.closePopup();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
  },
};
</script>
