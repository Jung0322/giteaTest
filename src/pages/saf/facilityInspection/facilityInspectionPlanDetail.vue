<!--
  목적 : 시설점검계획 등록/상세
  Detail : 시설점검계획 등록/수정 화면
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
            <!-- 시설점검계획 상세 -->
            <y-label
              label="L0000001759"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 결재요청 -->
              <y-btn
                v-if="
                  popupParam.checkStepCd === 'CHS01' &&
                  editable &&
                  !popupParam.apprFlag &&
                  confirmCheck &&
                  !updateMode &&
                  !popupParam.gubun
                "
                :action-url="saveUrl"
                :param="facilityInspectionSchedule"
                :is-submit="isAppr"
                title="L0000003418"
                color="black"
                action-type="PUT"
                beforeSubmit="beforeAppr"
                @beforeAppr="beforeAppr"
                @btnClicked="btnAppr"
              />
              <!-- <y-btn
                v-if="popupParam.gubun"
                title="시설추가"
                color="green"
                @btnClicked="btnFacilityAdd"
              /> -->
              <!-- 결재요청회수 -->
              <y-btn
                v-if="collectCheck && !popupParam.apprFlag"
                title="L0000003420"
                color="black"
                @btnClicked="btnCollectClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && editCheck && !updateMode && !authDuringAppr"
                title="L0000002474"
                color="orange"
                @btnClicked="beforeSave"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="
                  editable &&
                  deleteCheck &&
                  !updateMode &&
                  !authDuringAppr &&
                  !popupParam.gubun
                "
                color="red"
                title="L0000001495"
                @btnClicked="btnDeleteClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
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
              <y-plant
                type="edit"
                :editable="editable"
                :disabled="!popupParam.gubun"
                :required="true"
                name="plantCd"
                v-model="facilityInspectionSchedule.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검종류 -->
              <y-select
                :width="8"
                :comboItems="comboCheckTypeItems"
                :required="true"
                :editable="editable"
                :disabled="!popupParam.gubun"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="edit"
                name="comFacilityCheckCd"
                label="L0000002576"
                v-model="facilityInspectionSchedule.comFacilityCheckCd"
                v-validate="'required'"
                :state="validateState('comFacilityCheckCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검예정일 -->
              <y-datepicker
                :width="8"
                :required="true"
                :disabled="disabled || authDuringAppr"
                :editable="editable"
                label="L0000002564"
                name="facilityCheckSchYmd"
                :default="facilityInspectionSchedule.facilityCheckSchYmd"
                v-model="facilityInspectionSchedule.facilityCheckSchYmd"
                v-validate="'required'"
                :state="validateState('facilityCheckSchYmd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검주관부서 -->
              <y-tree-dept
                :editable="editable"
                :required="true"
                :disabled="!popupParam.gubun"
                :plantCd="facilityInspectionSchedule.plantCd"
                label="L0000002578"
                name="deptCd"
                v-model="facilityInspectionSchedule.deptCd"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 시설유형/시설명 -->
              <y-text
                :width="8"
                :editable="editable && popupParam.gubun"
                :disabled="true"
                :clearable="true"
                ui="bootstrap"
                type="search"
                label="L0000001750"
                name="userNm"
                v-model="sumName"
                :appendIcon="[
                  { icon: 'search', callbackName: 'btnFacilityAdd' },
                ]"
                @btnFacilityAdd="btnFacilityAdd"
                :required="true"
                v-validate="'required'"
                :state="validateState('sumName')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검대상부서 -->
              <y-tree-dept
                :editable="editable"
                :required="true"
                :disabled="!popupParam.gubun"
                :plantCd="facilityInspectionSchedule.plantCd"
                :showAllDept="true"
                label="L0000002549"
                name="tgtDeptCd"
                v-model="facilityInspectionSchedule.tgtDeptCd"
                v-validate="'required'"
                :state="validateState('tgtDeptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 점검수행부서 -->
              <y-tree-dept
                :editable="editable"
                :required="true"
                :disabled="disabled || authDuringAppr"
                :plantCd="facilityInspectionSchedule.plantCd"
                :showAllDept="true"
                label="L0000004852"
                name="pfmDeptCd"
                v-model="facilityInspectionSchedule.pfmDeptCd"
                v-validate="'required'"
                :state="validateState('pfmDeptCd')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 점검명 -->
              <y-text
                :width="10"
                :disabled="disabled || authDuringAppr"
                :editable="editable"
                ui="bootstrap"
                label="L0000002551"
                name="facilityCheckNm"
                v-model="facilityInspectionSchedule.facilityCheckNm"
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
        :disabled="!item.mode"
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
            :disabled="disabled"
            :facilityInspectionSchedule.sync="facilityInspectionSchedule"
            :tabParam.sync="tabParam"
            sm="12"
            :submitObject="submitObject"
            :attachFileGrps="attachFileGrps"
            :authDuringAppr="authDuringAppr"
            :saveAttachFiles="saveAttachFiles"
            @changeUploadFiles="changeUploadFiles"
            @setTempDeleteFiles="setTempDeleteFiles"
            @closePopup="closePopup2"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <b-row>
      <b-col sm="12">
        <div class="float-right mt-2">
          <!-- 결재요청 -->
          <!-- <y-btn
            v-if="popupParam.checkStepCd === 'CHS01' && confirmCheck&&!popupParam.apprFlag&&editable && !updateMode && !popupParam.gubun"
            title="L0000003418"
            color="black"
            @btnClicked="beforeAppr"
          /> -->
          <!-- <y-btn
            v-if="popupParam.gubun"
            title="시설추가"
            color="green"
            @btnClicked="btnFacilityAdd"
          /> -->
          <!-- 결재요청회수 -->
          <y-btn
            v-if="collectCheck && !popupParam.apprFlag"
            title="L0000003420"
            color="black"
            @btnClicked="btnCollectClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          />
          <!-- 저장 -->
          <!-- <y-btn
            v-if="editable && editCheck && !updateMode && !authDuringAppr"
            title="L0000002474"
            color="orange"
            @btnClicked="beforeSave"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          /> -->
          <!-- 삭제 -->
          <!-- <y-btn
            v-if="editable && deleteCheck && !updateMode && !authDuringAppr && !popupParam.gubun"
            color="red"
            title="L0000001495"
            @btnClicked="btnDeleteClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
          /> -->
          <!-- 닫기 -->
          <!-- <y-btn v-if="!popupParam.apprFlag" title="L0000000881" size="mini" @btnClicked="closePopup" />  -->
        </div>
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
  name: 'y-facility-inspection-plan-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        comFacilityCheckScheduleNo: 0, // 시설점검일정번호
        bizApprStepCd: '',
        apprFlag: false,
        apprRqstNo: 0,
        gubun: false,
        noPlanYn: null,
      },
    },
  },
  data: () => ({
    // TODO : 현재까지 파악된 바로는 tab은 같은 폴더 또는 하위 폴더의 컴포넌트만 접근이 가능한 것으로 파악됨
    //                즉, 반드시 메인페이지 역할을 하는 vue와 동일 폴더나 하위 폴더에 tabItem 역할을 하는 vue 파일을 위치 시킬 것
    tabItems: [],
    component: null,
    tabIndex: 0,
    sumName: '',
    facilityInspectionSchedule: {
      comFacilityCheckNo: 0, // 시설점검마스터번호
      comFacilityCheckScheduleNo: 0, // 시설점검일정번호
      plantCd: '', // 사업장
      plantNm: '', // 사업장명
      comFacilityCheckCd: '', // 시설점검종류 코드
      comFacilityCheckNm: '', // 시설점검종류
      facilityCheckSchYmd: '', // 시설점검예정일
      comFacilityTypeCd: '', // 시설유형코드
      comFacilityTypeNm: '', // 시설유형명
      facilityCd: '', // 시설코드
      facilityNm: '', // 시설명
      checkStepCd: '', // 점검진행상태
      apprStepCd: '', // 결제진행상태
      facilityCheckNm: '', // 점검명
      innerTeamData: [], // 내부점검수행팀원
      outerTeamData: [], // 외부점검수행팀원
      facilityInsInspectors: [], // 점검자
      noPlanYn: null,
      isResult: 0,
      createUserId: '',
      updateUserId: '',
      deptCd: '',
      deptNm: '',
      tgtDeptCd: '',
      tgtDeptNm: '',
      pfmDeptCd: '',
      pfmDeptNm: '',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
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
    updateMode: false,
    deleteable: false,
    isSave: false,
    isAppr: false,
    isDelete: false,
    editCheck: false,
    confirmCheck: false, // 계획저장확인여부
    deleteCheck: false,
    searchDetailUrl: '',
    saveUrl: '',
    deleteUrl: '',
    authDuringAppr: false,
    collectCheck: false,
    collectUrl: '',

    comboCheckTypeItems: [], // 점검종류
  }),
  watch: {
    tabIndex: function (newValue, oldValue) {
      this.loadComponent();
    },
    // 'facilityInspectionSchedule.comFacilityCheckCd'() {
    //   if (this.popupParam.gubun) {
    //     if (this.facilityInspectionSchedule.comFacilityCheckCd) {
    //       let checkNm = this.comboCheckTypeItems.filter(
    //         (item) =>
    //           item.code === this.facilityInspectionSchedule.comFacilityCheckCd
    //       );
    //       this.facilityInspectionSchedule.facilityCheckNm = `${checkNm[0].codeNm}(${this.facilityInspectionSchedule.facilityCheckSchYmd} )`;
    //     }
    //   }
    // },
    // 'facilityInspectionSchedule.facilityCheckSchYmd'() {
    //   if (this.popupParam.gubun) {
    //     if (this.facilityInspectionSchedule.comFacilityCheckCd) {
    //       let checkNm = this.comboCheckTypeItems.filter(
    //         (item) =>
    //           item.code === this.facilityInspectionSchedule.comFacilityCheckCd
    //       );
    //       this.facilityInspectionSchedule.facilityCheckNm = `${checkNm[0].codeNm}(${this.facilityInspectionSchedule.facilityCheckSchYmd} )`;
    //     }
    //   }
    // },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    this.tabItems = [
      {
        title: this.$comm.getLangSpecInfoLabel('L0000002572'),
        url: './facilityInspectionInspector',
        mode: true,
      }, // 점검자
      {
        title: this.$comm.getLangSpecInfoLabel('L0000002843'),
        url: 'fileUploadPage',
        mode: true,
      }, // 첨부파일
    ];
  },
  mounted() {
    this.loadComponent();
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.detailUrl =
        selectConfig.saf.facilityInspection.facilityInspectionPlan.get.url;
      this.saveUrl =
        transactionConfig.saf.facilityInspection.facilityInspectionPlan.edit.url;
      this.deleteUrl =
        transactionConfig.saf.facilityInspection.facilityInspectionPlan.delete.url;
      this.collectUrl = transactionConfig.manage.appr.collect.url;

      this.editCheck = true;
      this.deleteCheck = true;
      this.confirmCheck = true;

      this.btnControlle();

      // 개선조치를 위한 변수 Setting
      this.tabParam.imprClassCd = 'ICL08';
      this.tabParam.refTableId = this.popupParam.comFacilityCheckScheduleNo;

      if (this.popupParam.gubun) {
        this.facilityInspectionSchedule.facilityCheckSchYmd =
          this.$comm.getToday();
      }
      this.getComboItems('SAF_FACILITY_CHECK');
      this.attachFileGrpSetting(); // 첨부파일 설정

      this.facilityInspectionSchedule.noPlanYn = this.popupParam.noPlanYn; // 무계획 여부 판별

      this.getDetail();
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      if (path === 'fileUploadPage') {
        this.component = () =>
          import('@/pages/common/attachFile/multiFileUpload');
      } else this.component = () => import(`${path}`);
    },
    setTempDeleteFiles(data) {
      var pushData = {
        fileNo: data.data.fileNo,
      };
      this.tempDeleteFiles.push(pushData);
    },

    // 첨부파일 설정
    attachFileGrpSetting() {
      let taskKey = this.popupParam.comFacilityCheckScheduleNo
        ? this.popupParam.comFacilityCheckScheduleNo.toString()
        : '';

      this.attachFileGrps = [
        {
          label: 'L0000002843', // 첨부파일
          uploadTempFiles: null,
          taskClassNm: 'FACILITY_INSPECTION_RESULT',
          taskKey: taskKey,
          drag: !this.disabled && !this.authDuringAppr,
          editable: this.editable && !this.authDuringAppr,
          disabled: this.disabled,
          onlyDownload: this.disabled,
          createUserId: this.$store.getters.token,
        },
      ];
    },
    getApprDetail() {
      if (!this.popupParam.apprRqstNo || this.popupParam.apprRqstNo <= 0) {
        return;
      }
      this.$http.url = this.$format(
        selectConfig.manage.appr.authCheck.url,
        this.popupParam.apprRqstNo,
        this.$store.getters.token
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.authDuringAppr = _result.data;
          this.attachFileGrpSetting();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getCollectable() {
      if (
        !this.facilityInspectionSchedule.papprRqstNo ||
        this.facilityInspectionSchedule.papprRqstNo <= 0
      ) {
        return;
      }
      this.$http.url = this.$format(
        selectConfig.manage.appr.getCollect.url,
        this.facilityInspectionSchedule.papprRqstNo,
        this.$store.getters.token
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.collectCheck = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnCollectClickedCallback() {
      if (this.collectCheck) {
        this.$http.url = this.$format(
          this.collectUrl,
          this.facilityInspectionSchedule.papprRqstNo
        );
        this.$http.type = 'PUT';
        this.$http.request(
          (_result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000507', // 회수되었습니다.
              type: 'success', // success / info / warning / error
            });
            this.closePopup();
          },
          (_error) => {
            this.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000506', //  이미 결재된 문서입니다.
          type: 'warning', // success / info / warning / error
        });
        this.closePopup();
      }
    },
    getDetail() {
      if (
        !this.popupParam.comFacilityCheckScheduleNo ||
        this.popupParam.comFacilityCheckScheduleNo === 0
      ) {
        return;
      }
      this.$http.url = this.$format(
        this.detailUrl,
        this.popupParam.comFacilityCheckScheduleNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.facilityInspectionSchedule = this.$_.clone(_result.data);
          this.sumName = `${this.facilityInspectionSchedule.comFacilityTypeNm} / ${this.facilityInspectionSchedule.facilityNm}`;
          this.getApprDetail();
          // this.getCollectable();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 수정 하기전 UI단 유효성 검사 **/
    beforeSave() {
      this.saveCheckResult('save');
    },
    beforeAppr() {
      this.saveCheckResult('appr');
    },
    saveCheckResult(flag) {
      console.log('저장할때 이거 안탐?');
      this.$validator
        .validateAll()
        .then((_result) => {
          // TODO : 전역 성공 메시지 처리
          // 이벤트는 ./event.js 파일에 선언되어 있음
          if (_result) {
            if (
              !this.facilityInspectionSchedule.facilityInsInspectors ||
              this.facilityInspectionSchedule.facilityInsInspectors.length === 0
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000739', // 점검자를 지정하세요.
                type: 'warning', // success / info / warning / error
              });
              return;
            } else {
              let returnVal = true;
              this.$_.forEach(
                this.facilityInspectionSchedule.facilityInsInspectors,
                (item) => {
                  if (
                    this.$_.parseInt(item.checkSchHour) >
                    this.$_.parseInt(item.checkSchEhour)
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // '안내',
                      message: 'M0000000740', // 점검예정시가 점검예정종료시보다 뒤에 있습니다.
                      type: 'warning', // success / info / warning / error
                    });
                    returnVal = false;
                    return false;
                  }
                  if (
                    this.$_.parseInt(item.checkSchHour) ===
                      this.$_.parseInt(item.checkSchEhour) &&
                    this.$_.parseInt(item.checkSchMinute) >
                      this.$_.parseInt(item.checkSchEminute)
                  ) {
                    window.getApp.$emit('ALERT', {
                      title: 'L0000003395', // '안내',
                      message: 'M0000000740', // 점검예정시가 점검예정종료시보다 뒤에 있습니다.
                      type: 'warning', // success / info / warning / error
                    });
                    returnVal = false;
                    return;
                  }
                }
              );
              if (!returnVal) return;
            }

            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message:
                flag === 'save'
                  ? 'M0000000011' // 저장하시겠습니까?
                  : 'M0000000754', // 저장후 결재하시겠습니까?
              // TODO : 필요시 추가하세요.
              type: 'info', // success / info / warning / error
              // 확인 callback 함수
              confirmCallback: () => {
                this.facilityInspectionSchedule.createUserId =
                  this.$store.getters.token;
                this.facilityInspectionSchedule.updateUserId =
                  this.$store.getters.token;
                if (flag === 'save') {
                  this.isSave = true;
                  this.isAppr = false;
                  this.facilityInspectionSchedule.checkStepCd = 'CHS01';
                } else {
                  this.isSave = false;
                  this.isAppr = true;
                }
                // 확인

                this.facilityInspectionSchedule.facilityInsInspectors = [];
                this.$_.forEach(
                  this.facilityInspectionSchedule.innerTeamData,
                  (item) => {
                    this.facilityInspectionSchedule.facilityInsInspectors.push(
                      item
                    );
                  }
                );
                console.log(
                  '저장시innerTeamData1: ',
                  this.facilityInspectionSchedule.innerTeamData
                );
                console.log(
                  '저장시innerTeamData2: ',
                  this.facilityInspectionSchedule.facilityInsInspectors
                );
                this.$_.forEach(
                  this.facilityInspectionSchedule.outerTeamData,
                  (item) => {
                    this.facilityInspectionSchedule.facilityInsInspectors.push(
                      item
                    );
                  }
                );
                console.log(
                  '저장시outerTeamData1: ',
                  this.facilityInspectionSchedule.outerTeamData
                );
                console.log(
                  '저장시outerTeamData2: ',
                  this.facilityInspectionSchedule.facilityInsInspectors
                );
                this.$http.url = this.saveUrl;
                this.$http.type = this.popupParam.gubun ? 'POST' : 'PUT';
                this.$http.param = this.facilityInspectionSchedule;
                this.$http.request(
                  (_result) => {
                    if (flag === 'save') {
                      window.getApp.$emit('ALERT', {
                        title: 'L0000003395', // '안내',
                        message: 'M0000000006', // 저장되었습니다.
                        type: 'success', // success / info / warning / error
                      });
                    }
                    this.isSave = false;
                    this.popupParam.gubun = false;
                    console.log(' _result.data: ', _result.data);
                    this.popupParam.comFacilityCheckScheduleNo = _result.data;
                    this.facilityInspectionSchedule.comFacilityCheckScheduleNo =
                      _result.data;
                    this.saveAttach();
                    this.getDetail();
                  },
                  (_error) => {
                    window.getApp.$emit('APP_REQUEST_ERROR', _error);
                  }
                );
              },
              // 취소 callback 함수
              cancelCallback: () => {
                this.isSave = false;
                this.isAppr = false;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'facilityInspectionPlanDetail',
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
          this.isSave = false;
          this.isAppr = false;
        });
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
    /**
     *  수정 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.isSave = false;
      this.saveAttach();
    },
    /**
     * 시설점검결과 삭제
     *  삭제 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.facilityInspectionSchedule.comFacilityCheckScheduleNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
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
    saveAttach() {
      // task_key 를 셋팅한다.
      this.$_.forEach(this.attachFileGrps, (item) => {
        item.taskKey = this.popupParam.comFacilityCheckScheduleNo;
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
          // 저장할 데이터가 없는 경우
          // else this.closePopup();
        });
      } else {
        // 저장할 데이터가 있는 경우
        if (this.saveAttachFiles.length > 0) {
          this.submitObject.submitCheck = !this.submitObject.submitCheck;
        }
        // 저장할 데이터가 없는 경우
        // else this.closePopup();
      }
    },
    // 결재
    btnAppr() {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/appr/comApprRequest.vue'}`);
      this.popupOptions.title = 'L0000003418'; // 결재요청
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeApprPop;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        apprBizCd: 'SA_FA-02',
        apprParams: {
          comFacilityCheckScheduleNo:
            this.facilityInspectionSchedule.comFacilityCheckScheduleNo,
          checkStepCd: this.facilityInspectionSchedule.checkStepCd,
        },
      };
    },
    closeApprPop(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.resultFlag) {
        this.tabParam.editable = true;
        this.updateMode = true;
        this.deleteable = true;
        this.disabled = true;
        this.editCheck = false;
        this.deleteCheck = false;
        this.confirmCheck = false;
      }

      this.isAppr = false;
      this.saveAttach();
      this.getDetail();
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
    /** end button 관련 이벤트 **/

    // 2022-03-04 무계획등록추가
    btnFacilityAdd() {
      this.popupOptions.target = () =>
        import(`${'./facilityInspectionMstPopup.vue'}`);
      this.popupOptions.title = 'L0000001740'; // 시설 추가
      this.popupOptions.param = {
        // 시설 추가 팝업에서 점검시설 목록에 있는 데이터를 넘기지 않음
        // 따라서 제외는 제외버튼을 통해 제외
        plantCd: this.facilityInspectionSchedule.plantCd,
        selectedFacilityMstValue: [],
        deptCd: this.facilityInspectionSchedule.tgtDeptCd,
        gubun: 'single',
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeFacilityPopup;
    },

    closeFacilityPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data === 'CLOSE') return;
      this.facilityInspectionSchedule.comFacilityTypeCd =
        data.comFacilityTypeCd; // 시설유형코드
      this.facilityInspectionSchedule.comFacilityTypeNm =
        data.comFacilityTypeNm; // 시설유형명
      this.facilityInspectionSchedule.facilityCd = data.facilityCd; // 시설코드
      this.facilityInspectionSchedule.facilityNm = data.facilityNm; // 시설명
      this.facilityInspectionSchedule.tgtDeptCd = data.deptCd; // 점검 대상부서
      this.sumName = `${data.comFacilityTypeNm} / ${data.facilityNm}`;
    },

    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'SAF_FACILITY_CHECK') {
            this.comboCheckTypeItems = this.$_.clone(_result.data);
            this.comboCheckTypeItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnControlle() {
      if (this.popupParam.bizApprStepCd === 'BAPSA') {
        this.tabParam.editable = true;
        this.updateMode = true;
        this.deleteable = true;
        this.disabled = true;
        this.editCheck = false;
        this.deleteCheck = false;
        this.confirmCheck = false;
      } else if (this.popupParam.bizApprStepCd === 'BAPSD') {
        this.tabParam.editable = false;
        this.updateMode = false;
        this.deleteable = false;
        this.deleteCheck = false;
        this.tabParam.detailCheck = true;
      } else {
        this.tabParam.editable = false;
        this.updateMode = false;
        this.deleteable = false;
        this.tabParam.detailCheck = true;
      }

      if (this.popupParam.checkStepCd !== 'CHS01') {
        this.tabParam.editable = false;
        this.editCheck = false;
        this.deleteCheck = false;
        this.updateMode = false;
        this.deleteable = false;
        this.tabParam.detailCheck = true;
        this.disabled = true;
      }

      // 결재상태일때
      if (this.popupParam.apprFlag) {
        this.editCheck = true;
        this.deleteCheck = false;
        this.updateMode = false;
      }
    },
  },
};
</script>
<style>
.color-red {
  color: #dc143c;
}
</style>
