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
            <!-- 선해임 상세 -->
            <y-label
              label="L0000001567"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 신규등록 -->
              <y-btn
                v-if="!updateMode"
                :action-url="saveUrl"
                :param="electHis"
                :is-submit="isSave"
                :showLoading="false"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 개정 -->
              <y-btn
                v-if="showRevisionAndUpdateButton"
                title="L0000000291"
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
              <y-btn
                v-if="isRevisionButtonClicked"
                :action-url="saveUrl"
                :param="electHis"
                :is-submit="isRev"
                title="L0000003777"
                color="blue"
                action-type="POST"
                beforeSubmit="beforeRevSave"
                @beforeRevSave="beforeRevSave"
                @btnClicked="btnRevSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="isUpdateButtonClicked"
                :action-url="saveUrl"
                :param="electHis"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!--  삭제 -->
              <y-btn
                v-if="
                  updateMode &&
                  !this.isRevisionButtonClicked &&
                  !this.isUpdateButtonClicked
                "
                title="L0000001495"
                color="red"
                @btnClicked="beforeDelete"
              />
              <!-- 취소 -->
              <y-btn
                v-if="isRevisionButtonClicked || isUpdateButtonClicked"
                title="L0000002920"
                @btnClicked="btnCancelClickedCallback"
              />
              <!-- 닫기 -->
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
                :width="8"
                :disabled="updateMode"
                :editable="editable"
                name="plantCd"
                v-model="electHis.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <b-col sm="4">
                  <!-- 등록일/등록자 -->
                  <y-label label="L0000000974" />
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="electHis.createDt + ' / ' + electHis.createUserNm"
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 법규 -->
              <y-select
                :width="8"
                :comboItems="refLawCdItems"
                :required="true"
                :editable="editable"
                :disabled="updateMode"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="refLawCd"
                label="L0000001205"
                v-model="electHis.refLawCd"
                v-validate="'required'"
                :state="validateState('refLawCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 법정선임자명 -->
              <y-select
                :width="8"
                :comboItems="electTitleItems"
                :required="true"
                :editable="editable"
                :disabled="updateMode"
                itemText="electTitlNm"
                itemValue="safElectTitlNo"
                ui="bootstrap"
                name="safElectTitlNo"
                label="L0000001565"
                v-model="electHis.safElectTitlNo"
                v-validate="'required'"
                :state="validateState('safElectTitlNo')"
              ></y-select>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 자격요건 -->
              <y-textarea
                :width="10"
                :maxlength="150"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002303"
                name="qualifiRequire"
                v-model="electHis.qualifiRequire"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 선임자 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                :required="true"
                ui="bootstrap"
                label="L0000001559"
                name="userNm"
                v-model="electHis.userNm"
                v-validate="'required'"
                :state="validateState('userNm')"
                :appendIcon="
                  updateMode && !updtMode && !revMode
                    ? null
                    : [{ icon: 'search', callbackName: 'searchUser' }]
                "
                @searchUser="btnSearchUserClicked"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 선임일 -->
              <y-datepicker
                :width="8"
                :required="true"
                :disabled="updateMode && !updtMode && !revMode"
                :editable="editable"
                label="L0000001558"
                name="electDt"
                v-model="electHis.electDt"
                v-validate="'required'"
                :state="validateState('electDt')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관련자격증 -->
              <y-text
                :width="8"
                :disabled="updateMode && !updtMode && !revMode"
                :editable="editable"
                ui="bootstrap"
                name="lcnTypeNm"
                label="L0000000576"
                v-model="electHis.lcnTypeNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 해임일 -->
              <y-datepicker
                :width="8"
                :disabled="updateMode && !updtMode && !revMode"
                :editable="editable"
                label="L0000003217"
                name="electEndDt"
                v-model="electHis.electEndDt"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 자격증번호 -->
              <y-text
                :width="8"
                :maxlength="30"
                :required="true"
                :editable="editable"
                :disabled="updateMode && !updtMode && !revMode"
                ui="bootstrap"
                label="L0000002305"
                name="lcnNum"
                v-model="electHis.lcnNum"
                v-validate="'required'"
                :state="validateState('lcnNum')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 자격취득일 -->
              <y-datepicker
                :width="8"
                :disabled="updateMode && !updtMode && !revMode"
                :editable="editable"
                label="L0000002306"
                name="lcnGetDt"
                v-model="electHis.lcnGetDt"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-number
                :width="8"
                :editable="revMode"
                ui="bootstrap"
                label="개정번호"
                name="revNum"
                :hasSeperator="false"
                :maxlength="5"
                v-model="electHis.revNum"
                :required="revMode"
                v-validate="revMode ? 'required' : ''"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 개정사유 -->
              <y-textarea
                :width="10"
                :maxlength="300"
                :editable="revMode"
                ui="bootstrap"
                label="L0000000294"
                name="revContents"
                v-model="electHis.revContents"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <b-row>
      <!-- 자료실 등록 탭 -->
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
          <keep-alive>
            <component
              sm="12"
              v-if="component"
              ref="content"
              :is="component"
              :electHis.sync="electHis"
              :updateMode.sync="updateMode"
              :updtMode.sync="updtMode"
              :revMode.sync="revMode"
              :isElectReason="isElectReason"
              :submitCheck="safSubmitCheck"
              :attachFileGrps="safAttachFileGrps"
              :saveAttachFiles="safSaveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
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
  name: 'y-elect-his-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safElectHisNo: 0, // key
        safElectHisGrpNo: 0, // 첨부파일 사용
        contents: null,
        refContents: null,
        safElectTitlNo: null,
      },
    },
  },
  data: () => ({
    electHis: {
      safElectHisNo: 0, // key
      electAttCd: null, // 선해임분야
      plantCd: null,
      plantNm: null,
      content: null,
      refLawCd: null, // 관련법규
      safElectTitlNo: null, // 선해임명NO
      userId: null, // 선해임자ID
      userNm: null, // 선해임자명
      electTypeCd: null, // 선해임구분
      electReason: null, // 선해임사유
      electDt: null, // 선해임일
      lcnTypeCd: null, // 선해임자격증NO
      lcnTypeNm: null, // 선해임자격증NO
      lcnGetDt: null, // 자격취득일
      effSDt: null, // 유효기간시작일
      effEDt: null, // 유효기간종료일
      lcnNum: null, // 자격번호
      remarks: null, // 참고사항
      createUserId: null,
      createUserNm: null,
      createDt: null,
      updateDt: null,
      updateUserId: null,
      qualifiRequire: null, // 자격요건
      useYn: null,
      safElectHisGrpNo: 0,
      deptCd: null,
      refContents: null,
      electEndDt: null,
      revNum: null, // 개정번호
      revContents: null, // 개정사유
    },
    tabIndex: 0,
    tabItems: [
      { title: 'L0000000810' /* 내용 */, url: './electHisDetailContent' },
      { title: 'L0000004634' /* 선해임이력 */, url: './electHisDetailHistory' },
      { title: 'L0000002843' /* 첨부파일 */, url: 'multiFileUpload' },
    ],
    component: null,
    effPeriod: [], // 유효기한
    electAttCdItems: [], // 분야
    refLawCdItems: [], // 법규
    electTitleItems: [], // 선해임명
    electTypeCdItems: [], // 구분
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '90%',
      top: '10px',
      closeCallback: null,
    },

    attachFileGrp: {
      taskClassNm: '',
      taskKey: '',
      createUserId: '',
      showUploadBtn: true,
      editable: true,
      drag: true,
      label: '',
    },

    attach: null, // 첨부파일컴포넌트
    safSubmitCheck: false,
    safSaveAttachFiles: [],
    safTempDeleteFiles: [],
    safAttachFileGrps: [],
    deleteValue: [],

    editable: false,
    isSave: false,
    isEdit: false,
    isRev: false,
    actionType: 'POST',
    searchDetailUrl: '',
    searchElectTitleUrl: '',
    searchElectLcnUrl: '',
    checkUrl: '',
    saveUrl: '',
    deleteUrl: '',
    revSaveUrl: '',
    insertMode: false,
    updateMode: false,
    revMode: false,
    updtMode: false,
    // 개정버튼 클릭시 true
    isRevisionButtonClicked: false,
    // 수정버튼 클릭시 true
    isUpdateButtonClicked: false,
    isElectReason: false, // 선임사유 작성여부
    temptCheck: false, // 유효성 검사
  }),
  computed: {
    // 개정 가능 여부
    isRevisionable() {
      return this.editable && this.isRevisionButtonClicked;
    },
    // 수정 가능 여부
    isUpdatable() {
      return this.editable && this.isUpdateButtonClicked;
    },
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
    'electHis.safElectTitlNo': function (newValue, oldValue) {
      if (newValue) {
        this.searchElecReason();
      }
    },
    'electHis.refLawCd': function (newValue, oldValue) {
      this.getElectTitleComboItems();
    },
    'electHis.plantCd': function () {
      if (!this.electHis.refLawCd) return;

      this.getElectTitleComboItems();
    },
    // 'electHis.userNm': function(newValue, oldValue) {
    //   this.electHis.lcnTypeNm = '';
    //   this.electHis.lcnNum = '';
    //   this.electHis.lcnGetDt = '';
    // },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    this.loadComponent();
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.searchDetailUrl = selectConfig.saf.electHis.get.url;
      this.searchElectTitleUrl = selectConfig.saf.electTitle.list.url;
      this.searchElectLcnUrl = selectConfig.saf.electTitle.electTitlLcn.url;
      this.checkUrl = selectConfig.saf.electHis.check.url;
      this.saveUrl = transactionConfig.saf.electHis.insert.url;
      this.deleteUrl = transactionConfig.saf.electHis.delete.url;

      this.getDetail(); // 협력업체 평가결과 상세 조회

      this.getComboItems('TASK_GRP'); // 분야
      this.getComboItems('MGT_LAW_CLASS'); // 법규
      this.getComboItems('SAF_ELECT_TYPE', ''); // 구분

      this.electTitleItems.splice(0, 0, {
        safElectTitlNo: null,
        electTitlNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
      });

      if (this.popupParam.safElectHisNo === 0) {
        this.updateMode = false;
        this.insertMode = true;
      } else {
        this.getDetail();

        this.updateMode = true;
        this.insertMode = false;
      }

      this.setAttachFileGrp();
    },
    /**
     * 공통 마스터 정보 조회 (분야, 법규, 구분)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'TASK_GRP') {
            this.electAttCdItems = this.$_.clone(_result.data);
            this.electAttCdItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
            });
          } else if (codeGroupCd === 'MGT_LAW_CLASS') {
            this.refLawCdItems = this.$_.clone(_result.data);
            this.refLawCdItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
            });
          } else if (codeGroupCd === 'SAF_ELECT_TYPE') {
            this.electTypeCdItems = this.$_.clone(_result.data);
            this.electTypeCdItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 선해임명 **/
    getElectTitleComboItems() {
      this.electHis.safElectTitlNo = null;
      this.$http.url = this.searchElectTitleUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        electAttCd: this.electHis.electAttCd,
        refLawCd: this.electHis.refLawCd,
        plantCd: this.electHis.plantCd,
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.electTitleItems = this.$_.clone(_result.data);
          this.electTitleItems.splice(0, 0, {
            safElectTitlNo: null,
            electTitlNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 협력업체 평가결과 상세 검색 **/
    getDetail() {
      if (
        !this.popupParam.safElectHisNo ||
        this.popupParam.safElectHisNo === 0
      ) {
        this.electHis.createDt = this.$comm.getToday();
        this.electHis.createUserNm = this.$store.getters.name;
        return;
      }
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.safElectHisNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.electHis = this.$_.clone(_result.data);
          this.effPeriod = [this.electHis.effSDt, this.electHis.effEDt];
          this.updateMode = true;
          this.searchElecReason();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    showMessage(checkList, flag) {
      var checkText = '';
      var i = 0;
      for (; i < checkList.length; i++) {
        if (this.$_.parseInt(checkList[i].cnt) > 0) {
          checkText =
            this.$comm.getLangSpecInfoMessage(
              'M0000000567'
            ); /* 이미 해당 선해임자에게 존재하는 선해임에 자격증입니다. */
          break;
        }
      }
      if (checkText) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: checkText,
          type: 'warning',
        });
        return false;
      } else {
        return true;
      }
    },
    checkValidator() {
      if (this.temptCheck && !this.updateMode) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000005333', // 이미 해당 사업장, 법정선임자명에 등록된 선임자 입니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.$validator
        .validateAll()
        .then((_result) => {
          this.isElectReason = !this.isElectReason;

          if (_result && this.electHis.electReason) {
            if (this.popupParam.safElectHisNo === 0) {
              this.electHis.createUserId = this.$store.getters.token;
              this.isSave = true;
            } else {
              this.electHis.updateUserId = this.$store.getters.token;
              this.isEdit = true;
            }
          } else {
            if (!this.electHis.plantCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000863', // 사업장을 선택해주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.electHis.refLawCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001100', // 법규를 선택해주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.electHis.safElectTitlNo) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001101', // 법정선임자명을 선택해주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.electHis.userNm) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001019', // 선임자를 지정해주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.electHis.electDt) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001020', // 선임일을 지정해주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.electHis.lcnNum) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001102', // 자격증번호를 입력해주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (this.revMode && !this.electHis.revNum) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000001103', // 개정번호를 입력해주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.$refs.content.electHis.electReason) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message:
                  '[' +
                  this.$comm.getLangSpecInfoLabel('L0000000810') +
                  '] ' +
                  this.$comm.getLangSpecInfoLabel('M0000000568'), // 선임사유를 입력해주세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000000005' /* 필수 입력값을 입력해 주세요. */,
              type: 'warning',
            });

            // 필수 입력값이 없을 경우 선임사유가 입력되지 않았을 수 있기 때문에 해당 탭을 활성화
            if (String(this.tabIndex) !== '0') {
              this.tabIndex = '0';
            }
          }
        })
        .catch((e) => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    checkValidator2() {
      this.temptCheck = false;
      this.$http.url = this.$format(
        selectConfig.saf.electHis.checkNm.url,
        this.electHis.plantCd,
        this.electHis.userId,
        this.popupParam.safElectTitlNo
          ? this.popupParam.safElectTitlNo
          : this.electHis.safElectTitlNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          console.log(_result.data);
          if (_result.data > 0) {
            this.temptCheck = true;
          }
          this.checkValidator();
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            '작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      let gubun = 'insert';
      if (this.popupParam.safElectHisNo === 0) {
        this.actionType = 'POST';
        this.saveUrl = transactionConfig.saf.electHis.insert.url;
      } else {
        gubun = 'edit';
        this.actionType = 'PUT';
        this.saveUrl = transactionConfig.saf.electHis.edit.url;
      }
      this.checkValidator2();
    },
    beforeRevSave() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (
              this.electHis.electReason === '' ||
              this.electHis.electReason === undefined
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000568' /* 선임사유를 입력해주세요. */,
                type: 'warning',
              });
              return;
            }
            this.actionType = 'POST';
            this.saveUrl = transactionConfig.saf.electHis.insert.url;

            this.electHis.safElectHisGrpNo =
              this.electHis.safElectHisGrpNo === 0
                ? this.popupParam.safElectHisNo
                : this.electHis.safElectHisGrpNo;

            this.isRev = true;
          } else if (
            this.electHis.userNm === '' ||
            this.electHis.userNm === null
          ) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000001019' /* 선임자를 지정해주세요. */,
              type: 'warning',
            });
          } else if (
            this.electHis.electDt === '' ||
            this.electHis.electDt === null
          ) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000001020' /* 선임일을 지정해주세요. */,
              type: 'warning',
            });
          } else if (
            this.electHis.lcnNum === '' ||
            this.electHis.lcnNum === null
          ) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: 'M0000001021' /* 자격증 번호를 지정해주세요. */,
              type: 'warning',
            });
          } else if (this.revMode && !this.electHis.revNum) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395' /* 안내 */,
              message: '개정번호를 입력해주세요.',
              type: 'warning', // success / info / warning / error
            });
            return;
          }
          // else {  개정완료 수정 전 코드
          //   window.getApp.$emit('ALERT', {
          //     title: 'L0000003395', /* 안내 */
          //     message: 'M0000000005', /* 필수 입력값을 입력해 주세요. */
          //     type: 'warning',
          //   });
          // }
        })
        .catch((e) => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' /* 유효성 검사도중 에러가 발생하였습니다. */
          );
        });
    },
    btnRevSaveClickedCallback(data) {
      this.popupParam.safElectHisNo = data.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000631' /* 개정되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.getDetail();
      this.saveAttach();

      this.isRev = false;
      this.updateMode = true;
      this.insertMode = false;
      // this.insertMode = false;
      this.isUpdateButtonClicked = false;
      this.isRevisionButtonClicked = false;
      this.updtMode = false;
      this.revMode = false;

      this.setAttachFileGrp();
      //  this.closePopup();
    },

    beforeDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.popupParam.safElectHisNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000007' /* 삭제되었습니다 */,
                type: 'success', // success / info / warning / error
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        cancelCallback: () => {},
      });
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
    /** button 관련 이벤트 **/
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.isEdit = false;
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
    /**
     *  신규등록 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      this.popupParam.safElectHisNo = _result.data;
      this.isEdit = false;
      if (this.popupParam.safElectHisNo === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000006' /* 저장되었습니다. */,
          type: 'success', // success / info / warning / error
        });
        this.saveAttach();

        this.isRev = false;
        this.updateMode = true;
        this.insertMode = false;
        this.updtMode = false;
        this.revMode = false;
        this.isSave = false;

        // this.insertMode = false;
        this.isUpdateButtonClicked = false;
        this.isRevisionButtonClicked = false;
        // this.closePopup();
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000006' /* 저장되었습니다. */,
          type: 'success', // success / info / warning / error
        });

        this.saveAttach();

        this.isRev = false;
        this.updateMode = true;
        this.insertMode = false;
        this.updtMode = false;
        this.revMode = false;

        this.isUpdateButtonClicked = false;
        this.isRevisionButtonClicked = false;
        // this.closePopup();
      }
      // this.getDetail();

      // this.closePopup();
      this.setAttachFileGrp();
    },

    btnSearchUserClicked(_item) {
      if (
        (this.updateMode && (this.revMode || this.updtMode)) ||
        !this.updateMode
      ) {
        this.popupOptions.target = () =>
          import(`${'../../manage/user/userSearch.vue'}`);
        this.popupOptions.title = 'L0000003674'; /* 처리자검색 */
        this.popupOptions.visible = true;
        this.popupOptions.param = {
          plantCd: this.electHis.plantCd,
          plantDisabled: true,
        };
        this.popupOptions.closeCallback = this.closePopupSearchUser;
      }
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.electHis.userNm = data.user.userNm;
        this.electHis.userId = data.user.userId;
      }
    },

    btnSearchLcnClicked(_item) {
      if (
        (this.updateMode && (this.revMode || this.updtMode)) ||
        !this.updateMode
      ) {
        if (this.electHis.userId === null) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395' /* 안내 */,
            message: 'M0000000569' /* 선임자를 입력해주세요 */,
            type: 'warning', // success / info / warning / error
          });
          return;
        } else {
          this.popupOptions.target = () => import(`${'./lcnSearch.vue'}`);
          this.popupOptions.title = 'L0000003775'; /* HR 자격현황 */
          this.popupOptions.visible = true;
          this.popupOptions.param = {
            userId: this.electHis.userId,
            userNm: this.electHis.userNm,
            plantCd: this.$store.getters.plantCd,
          };
          this.popupOptions.closeCallback = this.closePopupSearchLcn;
        }
      }
    },
    btnCancelClickedCallback() {
      this.isRevisionButtonClicked = false;
      this.isUpdateButtonClicked = false;
      this.setAttachFileGrp(); // 첨부파일 셋팅
    },
    closePopupSearchLcn(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.electHis.lcnTypeNm = data.electHis.licenseNm;
      this.electHis.lcnNum = data.electHis.licenseNo;
      this.electHis.lcnGetDt = data.electHis.lcnGetDt;
    },

    openHrPopup(data) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message:
          'M0000000566' /* 인사시스템과 인터페이스가 필요하여 현재 연결할 수 없습니다. */,
        type: 'info',
      });
      /*
      백엔드에서 openquery(ehr) 관련하여 문제 해결 필요

      기존 코드
      this.popupOptions.target = () => import(`${'./lcnSearch.vue'}`);
      this.popupOptions.title = 'HR 자격현황';
      this.popupOptions.visible = true;
      this.popupOptions.param = {};
      this.popupOptions.closeCallback = this.closeHrPopup;
      */
    },

    closeHrPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data) {
        this.electHis.lcnTypeNm = data.data.licenseNm;
        this.electHis.lcnNum = data.data.licenseNo;
        this.electHis.lcnGetDt = data.data.lcnGetDt;
        this.electHis.userNm = data.data.userNm;
        this.electHis.userId = data.data.userId;
      }
    },

    searchElecReason() {
      this.$http.url = this.$format(
        selectConfig.saf.electTitle.get.url,
        this.electHis.safElectTitlNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.electHis.qualifiRequire = _result.data.qualifiRequire;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    revPopup() {
      this.electHis.userNm = '';
      this.electHis.lcnTypeNm = '';
      this.electHis.lcnNum = '';
      this.electHis.lcnGetDt = '';
      this.electHis.electDt = '';
      this.electHis.electEndDt = '';
      this.electHis.refContents = '';
      this.electHis.electReason = '';

      this.isRevisionButtonClicked = true;
      this.isUpdateButtonClicked = false;
      this.revMode = true;
      this.updtMode = false;

      this.safAttachFileGrps = [
        {
          label: 'L0000001564' /* 선해임 파일업로드 */,
          editable: this.editable,
          disabled: !this.editable,
          uploadTempFiles: null,
          taskClassNm: 'ELECT_HIS',
          taskKey: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    updatePopup() {
      this.updtMode = true;
      this.revMode = false;
      this.isUpdateButtonClicked = true;
      this.isRevisionButtonClicked = false;
      this.setAttachFileGrp();
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'multiFileUpload') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
        // else if (path === 'imprActTab') this.component = () => import('@/pages/impr/imprActTab');
      } else {
        this.component = () => import(`${path}`);
      }
    },

    setAttachFileGrp() {
      let taskKey =
        this.popupParam.safElectHisNo > 0
          ? this.popupParam.safElectHisNo.toString()
          : '';

      this.safAttachFileGrps = [
        {
          label: 'L0000001564' /* 선해임 파일업로드 */,
          uploadTempFiles: null,
          taskClassNm: 'ELECT_HIS',
          taskKey: taskKey,
          onlydownload: !this.updtMode && !this.revMode,
          drag: this.insertMode || this.updtMode || this.revMode,
          editable: this.insertMode || this.updtMode || this.revMode,
          disabled: !this.insertMode && !this.updtMode && !this.revMode,
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
        item.taskKey = this.popupParam.safElectHisNo;
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
      // this.setBtnVisible(true);
      // this.closePopup();
    },
  },
};
</script>
