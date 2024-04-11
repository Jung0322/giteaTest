<!--
  목적 : 경영 > 게시판 > 인허가현황 등록/수정
  작성자 : ksw
  Detail : 인허가현황 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 인허가현황 등록/수정 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 인허가현황 등록/수정 -->
            <y-label
              label="L0000002257"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <template v-if="editable">
                <!-- 신규등록 -->
                <y-btn
                  v-if="!updateMode"
                  :action-url="insertUrl"
                  :param="referenceInfo"
                  :is-submit="isSave"
                  :showLoading="false"
                  title="L0000001789"
                  color="orange"
                  action-type="POST"
                  beforeSubmit="beforeSave"
                  @beforeSave="beforeSave"
                  @btnClicked="btnSaveClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />

                <!-- v-if="editable&&updateMode&&!isRevisionButtonClicked&&!isUpdateButtonClicked" -->
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
                <y-btn
                  v-if="isRevisionButtonClicked"
                  :action-url="insertUrl"
                  :param="referenceInfo"
                  :is-submit="isRev"
                  title="L0000003777"
                  color="blue"
                  action-type="POST"
                  beforeSubmit="beforeRevSave"
                  @beforeRevSave="beforeRevSave"
                  @btnClicked="btnRevSaveClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                <!-- 수정완료 -->
                <y-btn
                  v-if="isUpdateButtonClicked"
                  :action-url="updateUrl"
                  :param="referenceInfo"
                  :is-submit="isEdit"
                  title="L0000002474"
                  color="orange"
                  action-type="PUT"
                  beforeSubmit="beforeEdit"
                  @beforeEdit="beforeEdit"
                  @btnClicked="btnModifyClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                <!--  삭제 -->
                <y-btn
                  v-if="updateMode && !this.isRevisionButtonClicked"
                  title="L0000001495"
                  color="red"
                  @btnClicked="btnDeleteClickedCallback"
                />
              </template>
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col
              v-if="!updateMode"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <b-row>
                <b-col sm="4">
                  <!-- 등록일/등록자 -->
                  <y-label label="L0000000974" />
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="this.now + ' / ' + this.$store.getters.name"
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col
              v-if="updateMode"
              sm="6"
              md="6"
              lg="6"
              xl="6"
              class="col-xxl-3"
            >
              <b-row>
                <b-col sm="4">
                  <!-- 등록일/등록자 -->
                  <y-label label="L0000000974" />
                </b-col>
                <b-col sm="8">
                  <y-label
                    :label="
                      referenceInfo.createDt +
                      ' / ' +
                      referenceInfo.createUserNm
                    "
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3"></b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- :disabled="!(isRevisionable || isUpdatable)" -->
              <y-plant
                type="edit"
                :width="8"
                :editable="isEnable"
                :disabled="!isEnable"
                name="plantCd"
                v-model="referenceInfo.plantCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 분류 -->
              <y-select
                :width="8"
                :editable="isEnable"
                :disabled="!isEnable"
                :comboItems="roomTpItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001341"
                name="kindCd"
                v-model="referenceInfo.kindCd"
                :required="true"
                v-validate="'required'"
              ></y-select>
            </b-col>

            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 제목 -->
              <y-text
                :width="10"
                :editable="isEnable"
                :disabled="!isEnable"
                ui="bootstrap"
                label="L0000002616"
                name="title"
                v-model="referenceInfo.title"
                :required="true"
                v-validate="'required'"
                :state="validateState('title')"
              ></y-text>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관련기관 -->
              <y-text
                :width="8"
                :editable="isEnable"
                :disabled="!isEnable"
                ui="bootstrap"
                label="L0000000567"
                name="refOffice"
                v-model="referenceInfo.refOffice"
                :required="true"
                v-validate="'required'"
                :state="validateState('refOffice')"
              ></y-text>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!--  관련법규 -->
              <y-text
                :width="8"
                :editable="isEnable"
                :disabled="!isEnable"
                ui="bootstrap"
                label="L0000000568"
                name="refLaw"
                v-model="referenceInfo.refLaw"
                :required="true"
                v-validate="'required'"
                :state="validateState('refLaw')"
              ></y-text>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관련근거 -->
              <y-text
                :width="8"
                :editable="isEnable"
                :disabled="!isEnable"
                ui="bootstrap"
                label="L0000000565"
                name="refDesc"
                v-model="referenceInfo.refDesc"
                :required="true"
                v-validate="'required'"
                :state="validateState('refDesc')"
              ></y-text>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 주관부서 -->
              <y-tree-dept
                type="edit"
                label="L0000002713"
                name="deptCd"
                :editable="isEnable"
                :disabled="!isEnable"
                v-model="referenceInfo.deptCd"
                :plantCd="referenceInfo.plantCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('deptNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 개정번호 -->
              <y-number
                :width="8"
                :editable="isRevisionButtonClicked"
                :disabled="!isRevisionButtonClicked"
                ui="bootstrap"
                label="L0000000293"
                name="revNum"
                :hasSeperator="false"
                :maxlength="5"
                v-model="referenceInfo.revNum"
                :required="this.isRevisionButtonClicked"
                v-validate="this.isRevisionButtonClicked ? 'required' : ''"
              ></y-number>
            </b-col>
            <b-col
              v-if="popupParam.lcnBoardNo > 0"
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
                :required="this.isRevisionButtonClicked"
                v-model="referenceInfo.revContents"
                v-validate="this.isRevisionButtonClicked ? 'required' : ''"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <b-row>
      <!-- 인허가현황 등록 탭 -->
      <b-col sm="12">
        <el-tabs type="border-card" v-model="tabIndex" @tab-click="tabClick">
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
              :is="component"
              v-if="component"
              :referenceInfo.sync="referenceInfo"
              :submitCheck="safSubmitCheck"
              :count="count"
              :editable="isEnable"
              sm="12"
              :attachFileGrps="safAttachFileGrps"
              :saveAttachFiles="safSaveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
            />
          </keep-alive>
        </el-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'licensing-status-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        lcnBoardNo: 0,
      },
    },
  },
  data: () => ({
    referenceInfo: {
      lcnBoardNo: 0,
      lcnBoardGrpNo: 0,
      kindCd: null,
      title: null,
      refOffice: null,
      roomTp: null,
      refDesc: null,
      refLaw: null,
      revNum: null,
      revYmd: null,
      contents: null,
      plantCd: null,
      deptCd: null,
      deptNm: null,
      revContents: null,
      useYn: null,
      delYn: null,
      createUserId: null,
      createUserNm: null,
      createDt: null,
      updateUserId: null,
      updateUserNm: null,
      updateDt: null,
    },
    editable: true,
    roomTpItems: [],
    plantItems: [], // 사업장
    tabIndex: 0,
    count: 0,
    attachFileGrp: {
      taskClassNm: '',
      taskKey: '',
      createUserId: '',
      // showUploadBtn: true,
      editable: true,
      // drag: true,
      label: '',
    },

    attach: null, // 첨부파일컴포넌트
    safSubmitCheck: false,
    safSaveAttachFiles: [],
    safTempDeleteFiles: [],
    safAttachFileGrps: [],

    tabItems: [
      { title: 'L0000000810', url: './licensingStatusAddContent' } /* 내용 */,
      {
        title: 'L0000004233' /* 인허가이력 */,
        url: './licensingStatusAddHistory',
      },
      { title: 'L0000002843', url: 'multiFileUpload' } /* 첨부파일 */,
    ],
    component: null,
    insertUrl: '',
    updateUrl: '',
    isEdit: false,
    isRev: false,
    isSave: false,
    date: '',

    // 신규 등록시 true
    // insertMode: false,
    // 상세 보기시 true
    updateMode: false,
    // 개정버튼 클릭시 true
    isRevisionButtonClicked: false,
    // 수정버튼 클릭시 true
    isUpdateButtonClicked: false,
    now: '',
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
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
    this.loadComponent();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.insertUrl = transactionConfig.saf.licensingStatus.insert.url;
      this.updateUrl = transactionConfig.saf.licensingStatus.update.url;
      this.searchUrl = selectConfig.mgt.licensingStatus.get.url;
      this.deleteUrl = transactionConfig.saf.licensingStatus.delete.url;
      this.revdeleteUrl = transactionConfig.saf.licensingStatus.revdelete.url;

      this.now = this.$comm.moment().format('YYYY-MM-DD');

      this.getComboItems('MGT_DOCU_KND01'); // 분류

      if (this.popupParam.lcnBoardNo === 0) {
        this.updateMode = false;
        // this.insertMode = true;
      } else {
        this.getDetail();
        this.updateMode = true;
        // this.insertMode = false;
      }
      this.setAttachFileGrp();
    },
    getDetail() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.referenceInfo.lcnBoardNo === 0
          ? this.popupParam.lcnBoardNo.toString()
          : this.referenceInfo.lcnBoardNo.toString()
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.referenceInfo = _result.data;
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016'
            /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    closePopup() {
      this.$emit('closePopup');
    },
    // 사업장
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'MGT_DOCU_KND01') {
            this.roomTpItems = this.$_.clone(_result.data);
            this.roomTpItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
            }); /* 선택하세요 */
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
                this.referenceInfo.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {},
            });
          } else {
            if (!this.referenceInfo.plantCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '사업장을 선택해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.kindCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '분류를 선택해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.title) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '제목을 입력해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.refOffice) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '관련기관을 입력해주세요',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.refLaw) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '관련법규를 입력해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.refDesc) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '관련근거를 입력해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.deptCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '주관부서를 선택해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
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
    beforeSave() {
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
                this.referenceInfo.createUserId = this.$store.getters.token;
                this.isSave = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {},
            });
          } else {
            if (!this.referenceInfo.plantCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '사업장을 선택해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.kindCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '분류를 선택해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.title) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '제목을 입력해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.refOffice) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '관련기관을 입력해주세요',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.refLaw) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '관련법규를 입력해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.refDesc) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '관련근거를 입력해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.deptCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '주관부서를 선택해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
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
    revPopup() {
      this.isRev = false;
      this.isRevisionButtonClicked = true;
      this.isUpdateButtonClicked = false;

      this.safAttachFileGrps = [
        {
          label: 'L0000003780' /* 인허가현황 파일업로드 */,
          listType: 'text',
          // drag: false,
          editable: this.editable,
          disabled: !this.editable,
          // showFileSearch: this.editable,
          limit: 10,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'LICENSINGSTATUS',
          taskKey: 0,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    updatePopup() {
      this.isEdit = false;
      this.isUpdateButtonClicked = true;
      this.isRevisionButtonClicked = false;
      this.setAttachFileGrp();
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000012' /* 삭제하시겠습니까? */,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.referenceInfo.lcnBoardNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: 'M0000000007' /* 삭제되었습니다 */,
                type: 'success',
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit(
                'APP_REQUEST_ERROR',
                'M0000000016'
                /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
              );
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    btnSaveClickedCallback(_result) {
      this.referenceInfo.lcnBoardNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006' /* 저장되었습니다. */,
        type: 'success', // success / info / warning / error
      });

      this.saveAttach();
      this.getDetail();

      this.isRev = false;
      this.updateMode = true;
      // this.insertMode = false;
      this.isUpdateButtonClicked = false;
      this.isRevisionButtonClicked = false;
      this.isSave = false;
    },
    btnModifyClickedCallback(_result) {
      this.referenceInfo.lcnBoardNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000006' /* 저장되었습니다. */,
        type: 'success', // success / info / warning / error
      });

      this.saveAttach();
      this.getDetail();

      this.isRev = false;
      this.updateMode = true;
      // this.insertMode = false;
      this.isUpdateButtonClicked = false;
      this.isRevisionButtonClicked = false;
      this.isEdit = false;
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
            if (!this.referenceInfo.plantCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '사업장을 선택해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.kindCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '분류를 선택해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.title) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '제목을 입력해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.refOffice) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '관련기관을 입력해주세요',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.refLaw) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '관련법규를 입력해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.refDesc) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '관련근거를 입력해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.deptCd) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '주관부서를 선택해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.revNum) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '개정번호를 입력해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            if (!this.referenceInfo.revContents) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395' /* 안내 */,
                message: '개정사유를 입력해주세요.',
                type: 'warning', // success / info / warning / error
              });
              return;
            }
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
    // 탭
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
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    setAttachFileGrp() {
      let taskKey =
        this.popupParam.lcnBoardNo > 0
          ? this.popupParam.lcnBoardNo.toString()
          : '';

      let editable =
        !this.updateMode ||
        this.isUpdateButtonClicked ||
        this.isRevisionButtonClicked;
      this.safAttachFileGrps = [
        {
          label: 'L0000003780' /* 인허가현황 파일업로드 */,
          listType: 'text',
          // drag: false,
          editable: editable,
          disabled: !editable,
          // showFileSearch: this.insertMode || this.isUpdateButtonClicked || this.isRevisionButtonClicked,
          onlydownload: !editable,
          // !this.isUpdateButtonClicked && !this.isRevisionButtonClicked,
          limit: 10,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'LICENSINGSTATUS',
          taskKey: taskKey,
          taskFlag: '',
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
        item.taskKey = this.referenceInfo.lcnBoardNo;
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
    },
    tabClick() {
      this.count++;
    },
  },
};
</script>
