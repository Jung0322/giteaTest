<!--
  목적 : 설비점검결과 상세
  Detail : 설비점검결과 수정 화면
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
            <!-- 가동전점검결과 상세 -->
            <y-label
              label="L0000003990"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 전체완료 -->
              <!-- <y-btn
                v-if="isSave"
                title="L0000002527"
                color="black"
                @btnClicked="btnCompleteClicked"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              /> -->
              <!-- 저장 -->
              <!-- <y-btn
                v-if="isNew"
                :action-url="insertUrl"
                :param="preOperChkResult"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnSaveInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              /> -->
              <!-- 저장 -->
              <y-btn
                v-if="isSave"
                :action-url="editUrl"
                :param="preOperChkResult"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :editable="editable"
                :required="true"
                :disabled="isComplete"
                name="plantCd"
                v-model="preOperChkResult.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <b-row>
                <!-- 등록자/등록일 -->
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-label label="L0000000978" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label
                    :label="
                      preOperChkResult.createUserNm +
                        ' / ' +
                        preOperChkResult.createDt
                    "
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검부서 -->
              <y-tree-dept
                :editable="editable"
                :required="true"
                :disabled="isComplete"
                :plantCd="preOperChkResult.plantCd"
                label="L0000002552"
                name="deptCd"
                v-model="preOperChkResult.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 점검명 -->
              <y-text
                :width="10"
                :editable="editable"
                :disabled="isComplete"
                :maxlength="50"
                :showMaxLength="false"
                ui="bootstrap"
                type="search"
                label="L0000002551"
                name="safFacilChkTitle"
                :required="true"
                v-model="preOperChkResult.safFacilChkTitle"
                v-validate="'required'"
                :state="validateState('safFacilChkTitle')"
              ></y-text>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="mt-3"></b-row>
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
          :preOperChkResult.sync="preOperChkResult"
          :safFacilChkNo="popupParam.safFacilChkNo"
          :inspBefItemView.sync="inspBefItemView"
          :tabParam.sync="tabParam"
          :isComplete="isComplete"
          :count.sync="count"
          sm="12"
          :submitObject="submitObject"
          :attachFileGrps="attachFileGrps"
          :saveAttachFiles="saveAttachFiles"
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
          @countUnComplete="countUnComplete"
          @closePopup="closePopup2"
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
  /* attributes: name, components, props, data */
  name: 'facil-chk-result-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        safFacilChkNo: 0, // 설비점검결과번호
        isSearch: false,
      },
    },
  },
  data: () => ({
    // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
    //                즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
    tabItems: [
      { title: 'L0000000405', url: 'inspBefOperResultInfo' }, // 결과
      { title: 'L0000000259', url: 'imprActTab' }, // 개선사항
      { title: 'L0000002843', url: 'fileUploadPage' }, // 첨부파일
    ],
    component: null,
    tabIndex: 0,

    preOperChkResult: {
      plantCd: '', // 사업장 코드
      safCheckTypeCd: null, // 점검종류
      safFacilityCheckNo: 0,
      deptCd: '', // 점검부서
      safFacilChkTitle: '', // 점검명
      createUserId: '', // 등록자 ID
      createUserNm: '',
      createDt: '', // 등록일
      chkStepCd: '',
      facilChkResults: [],
      apprRqstNo: 0,
      bizApprStepCd: '',
      rApprRqstNo: 0,
      rBizApprStepCd: '',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: null,
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    // 개선조치를 위한 변수
    tabParam: {
      imprClassCd: '',
      refTableId: 0,
      editable: true,
      detailCheck: false,
    },
    saveAttachFiles: [],
    tempDeleteFiles: [],
    attachFileGrps: [],
    typeInfoList: [],
    inspBefItemView: {
      safFacilChkNo: 0,
      plantCd: '',
      safCheckTypeCd: '',
      safFacilityCd: '',
      typeInfoList: [],
    },
    comboCheckTypeItems: [], // 점검종류
    submitObject: {
      submitCheck: false,
    },
    editable: true,
    disabled: false,
    completable: false,
    isEdit: false,
    isInsert: false,
    isComplete: false,
    isPlan: false,
    searchUrl: '',
    insertUrl: '',
    editUrl: '',
    deleteUrl: '',
    completeUrl: '',
    uncompleteCnt: 0,

    count: 0,
  }),
  computed: {
    isSave() {
      return (
        this.editable && !this.isComplete && this.popupParam.safFacilChkNo > 0
      );
    },
    isNew() {
      return (
        this.editable && !this.isComplete && this.popupParam.safFacilChkNo === 0
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
    // this.loadComponent();
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.preOperChkResult.createUserNm = this.$store.getters.name;
      this.preOperChkResult.createDt = this.$comm.getToday();
      // Url Setting
      this.searchUrl = selectConfig.saf.befInspPlan.get.url;
      this.insertUrl = transactionConfig.saf.befInspPlan.insert.url;
      this.editUrl = transactionConfig.saf.befInspPlan.edit.url;
      this.deleteUrl = transactionConfig.saf.befInspPlan.delete.url;
      this.completeUrl = transactionConfig.saf.befInspPlan.complete.url;

      this.$comm
        .getComboItems('SAF_PREOPERATION_CHECK', false)
        .then(_result => {
          this.comboCheckTypeItems = _result;
        });

      // 개선조치를 위한 변수 Setting
      this.tabParam.imprClassCd = 'ICL17';
      this.tabParam.refTableId = this.popupParam.safFacilChkNo;

      if (this.popupParam.safFacilChkNo && this.popupParam.safFacilChkNo > 0) {
        this.getDetail();
      }
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'fileUploadPage') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else if (path === 'imprActTab') {
        this.component = () => import('@/pages/impr/imprActTab');
      } else if (path === 'inspBefOperResultInfo') {
        this.component = () =>
          import('@/pages/saf/inspBefOperation/inspBefOperResultInfo');
      }
    },
    // 첨부파일 설정
    attachFileGrpSetting() {
      let taskKey = this.popupParam.safFacilChkNo
        ? this.popupParam.safFacilChkNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000002843', // 첨부파일
          uploadTempFiles: null,
          taskClassNm: 'PREOPERATION_CHECK_RESULT',
          taskKey: taskKey,
          drag: !this.isComplete,
          editable: this.editable,
          disabled: this.isComplete,
          onlyDownload: this.isComplete,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    getDetail() {
      if (
        !this.popupParam.safFacilChkNo ||
        this.popupParam.safFacilChkNo === 0
      ) {
        return;
      }
      this.$http.url = this.$format(
        this.searchUrl,
        this.popupParam.safFacilChkNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          if (
            (_result.data.chkStepCd !== 'CHS02' &&
              _result.data.chkStepCd !== 'CHS03') ||
            Number(_result.data.rapprRqstNo) > 0
          ) {
            this.isComplete = true;
            this.editable = false;
            this.tabParam.editable = false;
            this.tabParam.detailCheck = true;
          }
          this.preOperChkResult = this.$_.clone(_result.data);

          if (this.popupParam.isSearch || this.popupParam.isView) {
            this.isComplete = true;
            this.editable = false;
            this.tabParam.editable = false;
            this.tabParam.detailCheck = true;
          }

          this.getSubDetail();
          this.attachFileGrpSetting(); // 첨부파일 설정
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getSubDetail() {
      this.isItems = true;
      this.$http.url = selectConfig.saf.befInspResult.forEachType.url;
      this.$http.type = 'GET';
      this.$http.param = {
        safFacilChkNo: this.popupParam.safFacilChkNo,
        plantCd: this.preOperChkResult.plantCd,
      };
      this.$http.request(
        _result => {
          this.typeInfoList = [];
          this.typeInfoList.push({
            safCheckTypeCd: null,
            safFacilChkNo: this.popupParam.safFacilChkNo,
          });

          let typeInfoList = [];
          if (this.$_.clone(_result.data).length > 0) {
            typeInfoList = this.$_.clone(_result.data);
          } else {
            typeInfoList = [
              {
                safCheckTypeCd: null,
                safFacilChkNo: this.popupParam.safFacilChkNo,
              },
            ];
          }
          this.inspBefItemView = {
            typeInfoList: typeInfoList,

            safFacilChkNo: this.popupParam.safFacilChkNo,
            // safFacilityCd: data.safFacilityCd ? data.safFacilityCd : null,
            plantCd: this.preOperChkResult.plantCd,
          };
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeInsert() {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            if (
              !this.preOperChkResult.facilChkResults ||
              this.preOperChkResult.facilChkResults.length === 0
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000090',
                // 설비는 최소 1개 이상 지정되야 합니다.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            let items = this.preOperChkResult.facilChkResults;
            for (let i = 0; i < items.length; i++) {
              if (!items[i].chkUserId || items[i].chkUserId.length === 0) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  message: 'M0000000091',
                  // 점검자는 필수 지정되야 합니다.
                  type: 'warning', // success / info / warning / error
                });
                return;
              }
              if (!items[i].chkSchYmd) {
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395',
                  message: 'M0000000727',
                  // 점검예정일은 필수 지정되야 합니다.
                  type: 'warning', // success / info / warning / error
                });
                return;
              }
            }
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000011',
              // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.preOperChkResult.chkStepCd = 'CHS03';
                this.preOperChkResult.createUserId = this.$store.getters.token;
                this.preOperChkResult.updateUserId = this.$store.getters.token;

                this.$_.forEach(this.preOperChkResult.facilChkResults, item => {
                  item.createUserId = item.createUser.userId;
                });

                this.isInsert = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {},
            });
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000005',
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881'
            // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isInsert = false;
        });
    },
    beforeEdit() {
      this.$validator
        .validateAll()
        .then(_result => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000011',
              // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.isEdit = true;
                this.preOperChkResult.createUserId = this.$store.getters.token;
                this.preOperChkResult.updateUserId = this.$store.getters.token;

                this.$_.forEach(this.preOperChkResult.facilChkResults, item => {
                  item.createUserId = item.createUser.userId;
                });
              },
              // 취소 callback 함수
              cancelCallback: () => {},
            });
          } else if (!_result) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000005',
              type: 'warning', // success / info / warning / error
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881'
            // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isEdit = false;
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
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    closePopup2(data) {},
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSaveInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.popupParam.safFacilChkNo = _result.data;
      this.getDetail();
      this.saveAttach();
    },
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isEdit = false;
      this.popupParam.safFacilChkNo = _result.data;
      this.getDetail();
      this.saveAttach();
    },
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000012',
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.popupParam.safFacilChkNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            _result => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success', // success / info / warning / error
              });
              this.isDelete = false;
              this.closePopup(null);
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {
          this.isDelete = false;
        },
      });
    },
    changeUploadFiles(data) {
      var index = this.$_.findIndex(this.attachFileGrps, {
        taskClassNm: data.taskClassNm,
      });
      if (index > -1) {
        data.index = index;
        this.attachFileGrps[index].uploadTempFiles = data;
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
      this.$_.forEach(this.attachFileGrps, item => {
        item.taskKey = this.popupParam.safFacilChkNo;
      });

      if (this.tempDeleteFiles.length > 0) {
        this.$http.url = transactionConfig.attachFile.deleteMulti.url;
        this.$http.type = 'DELETE';
        this.$http.param = {
          data: Object.values(this.$_.clone(this.tempDeleteFiles)),
        };
        this.$http.request(
          _result => {
            this.tempDeleteFiles = [];
            // 저장할 데이터가 있는 경우
            if (this.saveAttachFiles.length > 0) {
              this.submitObject.submitCheck = !this.submitObject.submitCheck;
            }
            // 저장할 데이터가 없는 경우
            else this.closePopup2();
          },
          _error => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitObject.submitCheck = !this.submitObject.submitCheck;
        }
        // 저장할 데이터가 없는 경우
        else this.closePopup2();
      }
    },
    btnCompleteClicked() {
      let confirmMsg = '';
      if (this.uncompleteCnt > 0) {
        confirmMsg = this.$comm.getLangSpecInfoMessage('M0000000729', {
          s1: this.uncompleteCnt,
        });
        // 완료되지 않은 점검결과가 {s1}개 있습니다.
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 전체완료?
          message: confirmMsg,
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        confirmMsg = 'M0000000730';
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: confirmMsg,
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.completeUrl;
          this.$http.type = 'PUT';
          this.$http.param = {
            safFacilChkNo: this.popupParam.safFacilChkNo,
            updateUserId: this.$store.getters.token,
          };
          this.$http.request(
            _result => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000731',
                // 전체완료 되었습니다.
                type: 'success', // success / info / warning / error
              });
              this.isComplete = true;
              this.tabParam.editable = false;
              this.tabParam.detailCheck = true;
              this.attachFileGrpSetting(); // 첨부파일 설정
              this.getDetail();
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {
          this.isDelete = false;
        },
      });
    },
    countUnComplete(v) {
      this.uncompleteCnt = v;
    },
    tabClick() {
      this.count++;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
