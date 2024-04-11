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
            <!-- 설비점검 상세 -->
            <y-label
              label="L0000001607"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 확정 -->
              <y-btn
                v-if="
                  editable &&
                  !isComplete &&
                  facilChkPlan.safFacilChkNo > 0 &&
                  popupParam.planFlag &&
                  confirmFlag
                "
                title="L0000004571"
                color="black"
                @btnClicked="btnCompleteClicked"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="
                  editable &&
                  !isComplete &&
                  isCreate &&
                  popupParam.planFlag &&
                  confirmFlag
                "
                :action-url="insertUrl"
                :param="facilChkPlan"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="
                  editable &&
                  !isComplete &&
                  facilChkPlan.safFacilChkNo > 0 &&
                  popupParam.planFlag &&
                  confirmFlag
                "
                :action-url="editUrl"
                :param="facilChkPlan"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="
                  editable &&
                  !isComplete &&
                  facilChkPlan.safFacilChkNo > 0 &&
                  facilChkPlan.noPlanYn == 'Y' &&
                  popupParam.planFlag &&
                  confirmFlag
                "
                color="red"
                title="L0000001495"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
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
              <!-- <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-label label="L0000001415" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="facilChkPlan.plantNm" :fieldable="true" />
                </b-col>
              </b-row> -->
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                :disabled="facilChkPlan.safFacilChkNo > 0"
                v-model="facilChkPlan.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              ></y-plant>
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
                      facilChkPlan.createUserNm + ' / ' + facilChkPlan.createDt
                    "
                    :fieldable="true"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검종류 -->
              <!-- <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-label label="L0000002576" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="facilChkPlan.safCheckTypeNm" :fieldable="true" />
                </b-col>
              </b-row> -->
              <y-select
                key="new-checkType"
                :width="8"
                :editable="editable"
                :disabled="facilChkPlan.safFacilChkNo > 0"
                :required="true"
                :comboItems="comboCheckTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002576"
                name="safCheckTypeCd"
                v-model="facilChkPlan.safCheckTypeCd"
                v-validate="'required'"
                :state="validateState('safCheckTypeCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검주관부서 -->
              <!-- <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-label label="L0000002552" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="facilChkPlan.deptNm" :fieldable="true" />
                </b-col>
              </b-row> -->
              <y-tree-dept
                key="new-dept"
                :editable="editable"
                :required="true"
                :disabled="facilChkPlan.safFacilChkNo > 0"
                :plantCd="facilChkPlan.plantCd"
                label="L0000002578"
                name="deptCd"
                v-model="facilChkPlan.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검명 -->
              <y-text
                :width="8"
                :editable="editable"
                :disabled="isComplete || !popupParam.planFlag"
                :maxlength="50"
                :showMaxLength="false"
                ui="bootstrap"
                type="search"
                label="L0000002551"
                name="safFacilChkTitle"
                :required="true"
                v-model="facilChkPlan.safFacilChkTitle"
                v-validate="'required'"
                :state="validateState('safFacilChkTitle')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검대상부서 -->
              <!-- <b-row>
                <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                  <y-label label="L0000002552" />
                </b-col>
                <b-col sm="8" md="8" lg="8" xl="8" class="col-xxl-8">
                  <y-label :label="facilChkPlan.deptNm" :fieldable="true" />
                </b-col>
              </b-row> -->
              <y-tree-dept
                v-if="
                  popupParam.tDeptCd ||
                  (popupParam.tDeptCd && popupParam.noPlanYn == 'Y')
                "
                key="new-dept"
                :editable="editable"
                :required="true"
                :disabled="facilChkPlan.safFacilChkNo > 0"
                :plantCd="facilChkPlan.plantCd"
                label="L0000002549"
                name="tDeptCd"
                v-model="facilChkPlan.tDeptCd"
                v-validate="'required'"
                :state="validateState('tDeptCd')"
              />
              <y-tree-dept
                v-if="popupParam.pDeptCd"
                key="new-dept"
                :editable="editable"
                :required="true"
                :disabled="facilChkPlan.safFacilChkNo > 0"
                :plantCd="facilChkPlan.plantCd"
                label="L0000004852"
                name="pDeptCd"
                v-model="facilChkPlan.pDeptCd"
                v-validate="'required'"
                :state="validateState('pDeptCd')"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
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
          {{ $comm.getLangSpecInfoLabel(item.title) }}
        </span>
      </el-tab-pane>
      <keep-alive>
        <component
          :is="component"
          v-if="component"
          :facilChkPlan.sync="facilChkPlan"
          :safFacilChkNo="popupParam.safFacilChkNo"
          :tabParam.sync="tabParam"
          :isComplete="isComplete"
          :reFlash="reFlash"
          sm="12"
          :submitObject="submitObject"
          :attachFileGrps="attachFileGrps"
          :saveAttachFiles="saveAttachFiles"
          @changeUploadFiles="changeUploadFiles"
          @setTempDeleteFiles="setTempDeleteFiles"
          @countUnComplete="countUnComplete"
          @confirmFlagCheck="confirmFlagCheck"
          @reFlashCheck="reFlashCheck"
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
        noPlanYn: 'N',
        tDeptCd: '',
        tPlantCd: '',
        pDeptCd: '',
        pPlantCd: '',
        safFacilityCd: '',
        planFlag: true,
      },
    },
  },
  data: () => ({
    // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
    //                즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
    tabItems: [
      { title: 'L0000000405', url: './facilChkResultItem' }, // 결과
      { title: 'L0000000259', url: 'imprActTab' }, // 개선사항
      { title: 'L0000002843', url: 'fileUploadPage' }, // 첨부파일
      // { title: '결과', url: './facilityItemResult' },
    ],
    component: null,
    tabIndex: 0,

    facilChkPlan: {
      safFacilChkNo: 0,
      plantCd: '', // 사업장 코드
      safCheckTypeCd: null, // 점검종류
      deptCd: '', // 점검부서
      safFacilChkTitle: '', // 점검명
      createUserId: '', // 등록자 ID
      createUserNm: '',
      createDt: '', // 등록일
      noPlanYn: '',
      facilChkResults: [],
      reflash: false,
      tPlantCd: '',
      tDeptCd: '',
      pPlantCd: '',
      pDeptCd: '',
      safFacilityCd: '',
      planFlag: true,
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
    submitObject: {
      submitCheck: false,
    },
    editable: true,
    disabled: false,
    completable: false,
    isInsert: false,
    isEdit: false,
    isComplete: false,
    searchUrl: '',
    insertUrl: '',
    editUrl: '',
    deleteUrl: '',
    confirmFlag: true,
    completeUrl: '',
    uncompleteCnt: 0,
    reFlash: false,
    comboCheckTypeItems: [],
  }),
  computed: {
    isCreate() {
      return (
        this.facilChkPlan.noPlanYn === 'Y' && !this.facilChkPlan.safFacilChkNo
      );
    },
  },
  watch: {
    tabIndex: function (newValue, oldValue) {
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

      this.facilChkPlan.createUserNm = this.$store.getters.name;
      this.facilChkPlan.createDt = this.$comm.getToday();

      // Url Setting
      this.searchUrl = selectConfig.saf.facilChkPlan.get.url;
      this.insertUrl = transactionConfig.saf.facilChkPlan.insert.url;
      this.editUrl = transactionConfig.saf.facilChkPlan.edit.url;
      this.deleteUrl = transactionConfig.saf.facilChkPlan.delete.url;
      this.completeUrl = transactionConfig.saf.facilChkPlan.complete.url;

      // 개선조치를 위한 변수 Setting
      this.tabParam.imprClassCd = 'ICL04';
      this.tabParam.refTableId = this.popupParam.safFacilChkNo;

      this.$comm.getComboItems('SAF_FACILITY_CHECK', false).then((_result) => {
        this.comboCheckTypeItems = _result;
      });

      this.facilChkPlan.planFlag = this.popupParam.planFlag;
      this.facilChkPlan.noPlanYn = this.popupParam.noPlanYn;
      this.facilChkPlan.pDeptCd = this.popupParam.pDeptCd;
      this.facilChkPlan.tDeptCd = this.popupParam.tDeptCd;
      // this.facilChkPlan.pPlantCd = this.popupParam.plantCd;
      // this.facilChkPlan.tPlantCd = this.popupParam.plantCd;
      this.facilChkPlan.safFacilityCd = this.popupParam.safFacilityCd;
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
      } else this.component = () => import(`${path}`);
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
          taskClassNm: 'FACILITY_CHECK_RESULT',
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
      this.$http.param = {
        tDeptCd: this.popupParam.tDeptCd,
        pDeptCd: this.popupParam.pDeptCd,
      };
      this.$http.request(
        (_result) => {
          this.facilChkPlan = this.$_.clone(_result.data);
          this.facilChkPlan.tDeptCd = this.popupParam.tDeptCd;
          this.facilChkPlan.pDeptCd = this.popupParam.pDeptCd;
          this.facilChkPlan.safFacilityCd = this.popupParam.safFacilityCd;
          this.facilChkPlan.reflash = false;

          if (_result.data.chkStepCd !== 'CHS02') {
            this.isComplete = true;
            this.editable = false;
            this.tabParam.editable = false;
            this.tabParam.detailCheck = true;
          }

          if (this.popupParam.isSearch) {
            this.isComplete = true;
            this.editable = false;
            this.tabParam.editable = false;
            this.tabParam.detailCheck = true;
          }
          this.attachFileGrpSetting(); // 첨부파일 설정
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeComplete() {
      // this.saveCheckResult(1, '완료');
    },
    /** 저장 하기전 UI단 유효성 검사 **/
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          console.log('11', this.facilChkPlan.facilChkResults);
          if (_result) {
            if (
              !this.facilChkPlan.facilChkResults ||
              !this.facilChkPlan.facilChkResults.length
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000090',
                // 설비는 최소 1개 이상 지정되야 합니다.
                type: 'warning', // success / info / warning / error
              });
              return;
            }
            let checkUser = false;
            let checkDay = false;
            this.facilChkPlan.facilChkResults.forEach((item) => {
              console.log('22', item);
              if (item.userId === '') {
                checkUser = true;
              }
              if (!item.safFacilityCheckSchYmd) {
                checkDay = true;
              }
            });

            if (checkUser || checkDay) {
              this.$comm.alertWarning(
                checkUser
                  ? '점검자를 지정해주세요.'
                  : '점검예정일을 지정해주세요.'
              );
              return;
            }

            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000011',
              // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.facilChkPlan.facilChkResults =
                  this.facilChkPlan.facilChkResults.map((rslt) => {
                    rslt.userId2 = rslt.userId;
                    rslt.createUserId = rslt.userId;
                    return rslt;
                  });

                this.facilChkPlan.chkStepCd = 'CHS02'; // 무계획 점검결과 등록시 진행상태는 계획완료로 저장
                this.facilChkPlan.createUserId = this.$store.getters.token;
                this.facilChkPlan.createDt = this.$comm.getToday();
                this.isInsert = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {},
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'facilChkResultDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch((e) => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881'
            // 유효성 검사도중 에러가 발생하였습니다.
          );
          this.isInsert = false;
        });
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'M0000000011',
              // 저장하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.facilChkPlan.facilChkResults =
                  this.facilChkPlan.facilChkResults.map((rslt) => {
                    if (rslt.user !== undefined) {
                      rslt.userId = rslt.user.userId;
                      rslt.createUserId = rslt.user.userId;
                    }
                    return rslt;
                  });
                this.facilChkPlan.updateUserId = this.$store.getters.token;
                this.isEdit = true;
              },
              // 취소 callback 함수
              cancelCallback: () => {},
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'facilChkResultDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876'
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
      this.isEdit = false;
      this.isInsert = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnCompleteClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000078',
        // 완료되었습니다.
        type: 'success', // success / info / warning / error
      });

      this.completable = false;
      this.saveAttach();
    },
    /**
     *  수정 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      this.facilChkPlan.safFacilChkNo = this.$_.clone(_result.data);
      this.popupParam.safFacilChkNo = this.$_.clone(_result.data);
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });
      this.isInsert = false;
      this.isEdit = false;

      this.facilChkPlan.reflash = true;
      this.saveAttach();
      this.getDetail();
    },
    /**
     * 설비점검결과 삭제
     *  삭제 버튼 callback
     * _result : backend에서 return하는 데이터
     */
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
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success', // success / info / warning / error
              });
              this.isDelete = false;
              this.closePopup(null);
            },
            (_error) => {
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
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.popupParam.safFacilChkNo;
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
            // 저장할 데이터가 없는 경우uncompleteCnt
            else this.closePopup2();
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
          title: 'L0000003395', // 확정?
          message: confirmMsg,
          type: 'warning', // success / info / warning / error
        });
        return;
      } else {
        confirmMsg = 'M0000001593';
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
            facilChkResults: this.facilChkPlan.facilChkResults,
          };
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001590',
                // 확정 되었습니다.
                type: 'success', // success / info / warning / error
              });
              this.isComplete = true;
              this.facilChkPlan.reflash = true;
              this.tabParam.editable = false;
              this.tabParam.detailCheck = true;
              this.attachFileGrpSetting(); // 첨부파일 설정
            },
            (_error) => {
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
    confirmFlagCheck(v) {
      this.confirmFlag = v;
    },
    reFlashCheck(v) {
      this.reFlash = v;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
