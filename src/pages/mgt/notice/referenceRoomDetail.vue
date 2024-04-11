<!--
  목적 : 경영 > 게시판 > 자료실 등록/수정
  작성자 : ksw
  Detail : 자료실 등록/수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row>
      <!-- 자료실 등록/수정 -->
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 자료실 등록/수정 -->
            <y-label
              label="L0000002312"
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
                <!-- 수정완료(저장) -->
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
                  v-if="
                    updateMode &&
                    !this.isRevisionButtonClicked &&
                    !this.isUpdateButtonClicked
                  "
                  title="L0000001495"
                  color="red"
                  @btnClicked="btnDeleteClickedCallback"
                />
              </template>
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
              <!-- 사업장 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000001415"
                name="plantNm"
                v-model="referenceInfo.plantNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등록일 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000973"
                name="createDt"
                v-model="referenceInfo.createDt"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등록부서 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000971"
                name="deptNm"
                v-model="referenceInfo.deptNm"
              ></y-text>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 등록자 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000000976"
                name="createUserNm"
                v-model="referenceInfo.createUserNm"
              ></y-text>
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 개정번호 -->
              <y-number
                :width="8"
                :editable="isEnable"
                :disabled="!isEnable"
                ui="bootstrap"
                label="L0000000293"
                name="revNum"
                :hasSeperator="false"
                v-model="referenceInfo.revNum"
              ></y-number>
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
              ></y-text>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 사업장 범위 -->
              <y-checkbox
                :width="10"
                :editable="isEnable"
                :disabled="!isEnable"
                :comboItems="plantTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="plantType"
                label="L0000001418"
                v-model="referenceInfo.plantType"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
    <b-row>
      <!-- 자료실 등록 탭 -->
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
              {{ item.title }}
            </span>
          </el-tab-pane>
          <keep-alive>
            <component
              :is="component"
              v-if="component"
              :referenceInfo.sync="referenceInfo"
              :count="count"
              :editable="isEnable"
              sm="12"
              :attachFileGrps.sync="attachFileGrps"
              :saveAttachFiles.sync="saveAttachFiles"
              @changeUploadFiles="changeUploadFiles"
              @setTempDeleteFiles="setTempDeleteFiles"
              :attachFileGrp.sync="attachFileGrp"
              :submitObject="submitObject"
              @closePopup="fileSaveAfterFunc"
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
  name: 'reference-room-add',
  props: {
    popupParam: {
      type: Object,
      default: {
        dataBoardNo: 0,
        dataBoardGrpNo: 0,
      },
    },
  },
  data: () => ({
    referenceInfo: {
      dataBoardNo: 0,
      dataBoardGrpNo: 0,
      kindCd: null,
      title: null,
      roomTp: null,
      plantCd: null,
      plantNm: null,
      deptCd: null,
      deptNm: null,
      content: null,
      createUserNm: null,
      createUserId: null,
      createDt: null,
      revNum: null,
      plantCdArr: [],
      plantType: [],
      updateAuth: false,
    },
    editable: true,
    roomTpItems: [],
    plantTypeItems: [],
    plantItems: [], // 사업장
    tabIndex: 0,
    attachFileGrp: {
      taskClassNm: '',
      taskKey: '',
      createUserId: '',
      showUploadBtn: true,
      editable: true,
      drag: true,
      label: '',
    },
    tabItems: [
      { title: '내용', url: './referenceRoomAddContentD' }, // L0000000810
      { title: '개정이력', url: './referenceRoomAddHistory' }, // L0000000295
      { title: '첨부파일', url: 'multiFileUpload' }, // L0000002843
    ],
    searchParam: {
      dataBoardNo: '', // 사업장
    },
    component: null,
    insertUrl: '',
    updateUrl: '',
    insertPlantsUrl: '',
    isEdit: false,
    isRev: false,
    isSave: false,
    deleteUrl: '',
    submitObject: {
      submitCheck: false,
    },
    attachFileGrps: [],
    saveAttachFiles: [],
    tempDeleteFiles: [],
    isAuthUser: false,
    count: 0,

    // 신규 등록시 true
    // insertMode: false,
    // 상세 보기시 true
    updateMode: false,
    // 개정버튼 클릭시 true
    isRevisionButtonClicked: false,
    // 수정버튼 클릭시 true
    isUpdateButtonClicked: false,
    now: '',
    lastRefHistotyNum: 0,
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
    'referenceInfo.revNum'(val, event) {
      if (this.referenceInfo.revNum) {
        if (val.includes('.')) {
          return (this.referenceInfo.revNum = val.slice(0, -1));
        } else if (val.includes('-')) {
          return (this.referenceInfo.revNum = val.slice(1));
        }
      }
      // this.changeRevNum(val);
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
    this.loadComponent();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      // / 수정, 삭제는 등록자와 최고 관리자

      this.insertUrl = transactionConfig.saf.referenceRoom.insert.url;
      this.updateUrl = transactionConfig.saf.referenceRoom.update.url;
      this.searchUrl = selectConfig.mgt.referenceRoom.get.url;
      this.searchParam.dataBoardNo =
        this.referenceInfo.dataBoardNo === 0
          ? this.popupParam.dataBoardNo.toString()
          : this.referenceInfo.dataBoardNo.toString();
      this.hisorotySearchUrl = selectConfig.mgt.referenceRoom.revlist.url;
      this.deleteUrl = transactionConfig.saf.referenceRoom.delete.url;
      this.revdeleteUrl = transactionConfig.saf.referenceRoom.revdelete.url;

      this.now = this.$comm.moment().format('YYYY-MM-DD');

      this.attachFileGrp.taskClassNm = 'reference_add';
      this.attachFileGrp.taskKey = this.popupParam.dataBoardNo;
      this.attachFileGrp.createUserId = this.$store.getters.token;
      this.attachFileGrp.showUploadBtn = false;
      this.attachFileGrp.drag = false;
      this.attachFileGrp.onlyDownload = true;
      this.attachFileGrp.editable = false;
      this.attachFileGrp.label = 'L0000003030'; // 파일업로드

      this.getComboItems('COM_PLANT_CD'); // 사업장
      this.getComboItems('MGT_DOCU_KND01'); // 분류

      if (this.popupParam.dataBoardNo === 0) {
        this.updateMode = false;
        // this.insertMode = true;
      } else {
        this.getDetail();
        this.updateMode = true;
        // this.insertMode = false;
      }

      this.referenceInfo.plantType = [this.$store.getters.plantCd];

      this.$_.forEach(this.$store.getters.userAuthGrps, (item) => {
        // 관리자 권한

        if (item.authGrpNo === '2') {
          this.isAuthUser = true;
          return;
        }
      });
      this.getLastRevNum();
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
          if (codeGroupCd === 'COM_PLANT_CD') {
            this.plantTypeItems = this.$_.clone(_result.data);
            // 공통사업장 제거
            let _idx = 0;
            let _delIndx = -1;
            this.$_.forEach(this.plantTypeItems, (item) => {
              if (item.code === '0000') {
                _delIndx = _idx;
              }
              _idx += 1;
            });

            if (_delIndx > -1) this.plantTypeItems.splice(_delIndx, 1);
          } else if (codeGroupCd === 'MGT_DOCU_KND01') {
            this.roomTpItems = this.$_.clone(_result.data);
            this.roomTpItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'),
            }); // 선택하세요
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnCancelClickedCallback() {
      this.isRevisionButtonClicked = false;
      this.isUpdateButtonClicked = false;
      this.setAttachFileGrps(); // 첨부파일 셋팅
    },
    getDetail() {
      this.$http.url = this.$format(
        this.searchUrl,
        this.referenceInfo.dataBoardNo === 0
          ? this.popupParam.dataBoardNo.toString()
          : this.referenceInfo.dataBoardNo.toString()
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.referenceInfo = _result.data;
          if (_result.data.plantType.length <= 0) {
            this.referenceInfo.plantType = [this.$store.getters.plantCd];
          }
          if (
            this.referenceInfo.createUserId === this.$store.getters.token ||
            this.$store.getters.token === 'she' || // 전사담당자
            this.$store.getters.token === 'manager' || // 시스템관리자
            this.$store.getters.token === 'safety' ||
            this.$store.getters.token === 'spe' ||
            this.$store.getters.token === 'health' ||
            this.$store.getters.token === 'env'
          ) {
            this.referenceInfo.updateAuth = true;
          } else {
            this.referenceInfo.updateAuth = false;
          }

          // 분류
          this.setAttachFileGrps(); // 첨부파일 셋팅

          if (this.referenceInfo.createUserId === this.$store.getters.token) {
            this.isAuthUser = true;
          }
          document.querySelector('.custom-align').style.textAlign = 'left';
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
    getLastRevNum() {
      this.$http.url = this.hisorotySearchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          if (_result.data) {
            _result.data[0]
              ? (this.lastRefHistotyNum = _result.data[0].revNum)
              : (this.lastRefHistotyNum = 0);
          }
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
                this.$http.url = this.$format(
                  this.updateUrl,
                  this.referenceInfo.dataBoardNo,
                  this.referenceInfo.dataBoardGrpNo
                );
                this.$http.type = 'PUT';
                this.referenceInfo.createUserId = this.$store.getters.token;
                this.isSave = true;
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
    revPopup() {
      this.isRev = false;
      this.isRevisionButtonClicked = true;
      this.isUpdateButtonClicked = false;
      this.attachFileGrps = [
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
          taskClassNm: 'reference_add',
          taskKey: '',
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    updatePopup() {
      this.isEdit = false;
      this.isUpdateButtonClicked = true;
      this.isRevisionButtonClicked = false;
    },

    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000608', // 자료실 정보를 삭제하시겠습니까?,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.referenceInfo.dataBoardNo,
            this.referenceInfo.dataBoardGrpNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000001025', // 정상적으로 삭제되었습니다.
                type: 'success',
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit(
                'APP_REQUEST_ERROR',
                'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
              );
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    btnSaveClickedCallback(_result) {
      this.referenceInfo.dataBoardNo = _result.data;
      this.isEdit = true;
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
      // this.referenceInfo.dataBoardNo = _result.data;
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
      if (this.referenceInfo.revNum <= this.lastRefHistotyNum) {
        window.getApp.$emit('ALERT', {
          title: 'L0000004265', // 경고
          message: `개정 번호는 이전 개정 이력 번호를 초과해야합니다. 이전 개정이력번호: ${this.lastRefHistotyNum}`,
          type: 'info',
          // 확인 callback 함수
          confirmCallback: () => {},
        });
      } else {
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
                  this.$http.url = this.$format(
                    this.insertUrl,
                    this.referenceInfo.dataBoardNo,
                    this.referenceInfo.dataBoardGrpNo
                  );
                  this.$http.type = 'PUT';
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
      }
    },
    btnRevSaveClickedCallback(_result) {
      this.referenceInfo.dataBoardNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395' /* 안내 */,
        message: 'M0000000631' /* 개정되었습니다. */,
        type: 'success', // success / info / warning / error
      });
      this.getDetail();
      this.saveAttach();
      this.getLastRevNum();
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
      } else {
        this.component = () => import(`${path}`);
      }
    },
    setAttachFileGrps() {
      let taskKey = this.popupParam.dataBoardNo
        ? this.popupParam.dataBoardNo.toString()
        : '';
      let editable =
        !this.updateMode ||
        this.isUpdateButtonClicked ||
        this.isRevisionButtonClicked;

      this.attachFileGrps = [
        {
          label: 'L0000002843', // 첨부파일
          listType: 'text',
          drag: false,
          showFileSearch: false,
          editable: false,
          disabled: false,
          onlyDownload: true,
          limit: 10,
          multiple: true,
          uploadTempFiles: null,
          taskClassNm: 'reference_add',
          taskKey: taskKey,
          taskFlag: '',
          createUserId: this.$store.getters.token,
        },
      ];
    },
    setSafInfoAttachFileGrps(disabled) {
      let taskKey = this.popupParam.dataBoardNo
        ? this.popupParam.dataBoardNo.toString()
        : '';
      this.attachFileGrps = [];
    },
    fileSaveAfterFunc() {},
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.referenceInfo.dataBoardNo;
      });

      if (this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        this.$http.request((_result) => {
          this.tempDeleteFiles = [];
          // 저장할 데이터가 있는 경우
          if (this.saveAttachFiles.length > 0) {
            this.submitObject.submitCheck = !this.submitObject.submitCheck;
          }
        });
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitObject.submitCheck = !this.submitObject.submitCheck;
        }
      }
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
    tabClick() {
      this.count++;
    },
  },
};
</script>
