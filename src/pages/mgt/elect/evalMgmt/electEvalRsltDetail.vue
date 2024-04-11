<!--
  목적 : SHE경영 관리>법정선임자 관리>법정선임자 평가 관리>본인평가결과/상위평가결과 관리
  Detail : 본인평가결과/상위평가결과 관리 상세 팝업화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <b-row>
            <b-col sm="12">
              <!-- 본인평가결과 상세 / 상위평가결과 상세 -->
              <y-label
                :label="rsltLbl"
                icon="user-edit"
                color-class="cutstom-title-color"
              />
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 확정 -->
                <y-btn
                  v-if="confirmBtn"
                  title="L0000004571"
                  color="black"
                  @btnClicked="btnConfirm"
                />
                <!-- 확정취소 -->
                <y-btn
                  v-if="cancelBtn"
                  title="L0000004572"
                  color="red"
                  @btnClicked="btnCancel"
                />
                <!-- 임시저장 -->
                <y-btn
                  v-if="saveBtn"
                  title="L0000004986"
                  color="orange"
                  @btnClicked="btnSave"
                />
                <!-- 닫기 -->
                <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
              </div>
            </b-col>
          </b-row>
          <b-card>
            <b-row>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 대상년도 -->
                <y-datepicker
                  :width="9"
                  :editable="editable"
                  :disabled="true"
                  label="L0000004449"
                  :required="true"
                  type="year"
                  name="year"
                  :default="electEvalRslt.year"
                  v-model="electEvalRslt.year"
                  v-validate="'required'"
                  :state="validateState('year')"
                ></y-datepicker>
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 구분 -->
                <y-select
                  :width="9"
                  :comboItems="MgtHalfTypeItems"
                  :editable="editable"
                  :disabled="true"
                  :required="true"
                  itemText="codeNm"
                  itemValue="code"
                  ui="bootstrap"
                  name="halfTypeCd"
                  label="L0000000686"
                  v-model="electEvalRslt.halfTypeCd"
                  v-validate="'required'"
                  :state="validateState('halfTypeCd')"
                />
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 사업장 -->
                <y-plant
                  :width="9"
                  :editable="editable"
                  :disabled="true"
                  :required="true"
                  type="edit"
                  name="plantCd"
                  v-model="electEvalRslt.plantCd"
                  v-validate="'required'"
                  :state="validateState('plantCd')"
                />
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 법정선임자 -->
                <y-select
                  :width="9"
                  :comboItems="electTitleItems"
                  :editable="editable"
                  :disabled="true"
                  :required="true"
                  itemText="electTitlNm"
                  itemValue="safElectTitlNo"
                  ui="bootstrap"
                  name="safElectTitlNo"
                  label="L0000005162"
                  v-model="electEvalRslt.safElectTitlNo"
                  v-validate="'required'"
                  :state="validateState('safElectTitlNo')"
                />
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 주관부서 -->
                <y-tree-dept
                  :width="9"
                  label="L0000002713"
                  :editable="editable"
                  :disabled="true"
                  :required="true"
                  v-model="electEvalRslt.deptCd"
                  v-validate="'required'"
                  :state="validateState('deptCd')"
                />
              </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4"></b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 평가대상자 -->
                <y-text
                  :width="9"
                  :editable="editable"
                  :disabled="true"
                  ui="bootstrap"
                  name="mePlantNm"
                  label="L0000005202"
                  v-model="electEvalRslt.mePlantNm"
                />
              </b-col>
              <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
                <y-text
                  :width="12"
                  :editable="editable"
                  :disabled="true"
                  ui="bootstrap"
                  name="meDeptNm"
                  v-model="electEvalRslt.meDeptNm"
                />
              </b-col>
              <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
                <y-text
                  :width="12"
                  :editable="editable"
                  :disabled="true"
                  ui="bootstrap"
                  name="meUserNm"
                  v-model="electEvalRslt.meUserNm"
                />
              </b-col>
              <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2"> </b-col>
              <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
                <!-- 평가자 -->
                <y-text
                  :width="9"
                  :editable="editable"
                  :disabled="true"
                  ui="bootstrap"
                  name="upPlantNm"
                  label="L0000003093"
                  v-model="electEvalRslt.upPlantNm"
                />
              </b-col>
              <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
                <y-text
                  :width="12"
                  :editable="editable"
                  :disabled="true"
                  ui="bootstrap"
                  name="upDeptNm"
                  v-model="electEvalRslt.upDeptNm"
                />
              </b-col>
              <b-col sm="3" md="3" lg="3" xl="3" class="col-xxl-3">
                <y-text
                  :width="12"
                  :editable="editable"
                  :disabled="true"
                  ui="bootstrap"
                  name="upUserNm"
                  v-model="electEvalRslt.upUserNm"
                />
              </b-col>
              <b-col sm="2" md="2" lg="2" xl="2" class="col-xxl-2"> </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 평가명 -->
                <y-text
                  :width="11"
                  :editable="editable"
                  :disabled="true"
                  :required="true"
                  ui="bootstrap"
                  name="evalNm"
                  label="L0000003081"
                  v-model="electEvalRslt.evalNm"
                  v-validate="'required'"
                  :state="validateState('evalNm')"
                />
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
                <!-- 상세내용 -->
                <y-textarea
                  :width="11"
                  :editable="editable"
                  :disabled="true"
                  :rows="5"
                  ui="bootstrap"
                  name="evalDesc"
                  label="L0000001528"
                  v-model="electEvalRslt.evalDesc"
                />
              </b-col>
            </b-row>
          </b-card>
          <b-row class="mt-3"></b-row>
          <el-tabs type="border-card" v-model="tabIndex">
            <el-tab-pane v-for="(item, i) in tabItems" :key="i">
              <template slot="label">
                {{ $comm.getLangSpecInfoLabel(item.title) }}
              </template>
            </el-tab-pane>
            <keep-alive>
              <component
                v-if="components"
                :is="components"
                :electEvalRslt="electEvalRslt"
                :parentEditable="editable"
                :evalType="popupParam.evalType"
                :attachFileGrps="attachFileGrps"
                :saveAttachFiles="saveAttachFiles"
                :tempDeleteFiles="tempDeleteFiles"
                :submitObject="submitObject"
                @changeUploadFiles="changeUploadFiles"
                @setTempDeleteFiles="setTempDeleteFiles"
              ></component>
            </keep-alive>
          </el-tabs>
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'elect-eval-plan-detail',
  props: {
    popupParam: {
      default: {
        evalUserNo: 0, // 평가대상자번호
        evalType: null, // 평가 종류(본인평가 - me/상위평가 - up)
      },
    },
  },
  data() {
    return {
      editable: false, // 수정 가능 여부
      electEvalRslt: {
        evalPlanNo: 0, // 평가계획번호
        evalUserNo: 0, // 평가대상자 번호
        plantCd: null, // 사업장코드
        year: null, // 대상년도
        halfTypeCd: null, // 구분(상반기/하반기)
        deptCd: null, // 주관부서
        safElectTitlNo: null, // 법정선임자번호
        evalNm: null, // 평가명
        evalDesc: null, // 상세내용
        procStepCd: null, // 단계(SAF_ELECT_TITL_STEP)
        stateCd: null, // 상태(COM_STATE)
        stepCd: null, // 결재상태(COM_BIZ_APPR_STEP)
        apprRqstNo: 0, // 결재요청번호
        meDeptCd: null, // 평가대상자 소속부서코드
        meDeptNm: null, // 평가대상자 소속부서
        meUserId: null, // 평가대상자(본인평가자) 사번
        meUserNm: null, // 평가대상자(본인평가자)
        meProcStep: null, // 본인평가 진행상태
        upUserId: null, // 평가자(상위평가자) 사번
        upUserNm: null, // 평가자(상위평가자)
        upProcStep: null, // 상위평가 진행상태
        electEvalRsltItems: [], // 평가결과 목록
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
      MgtHalfTypeItems: [], // 구분 selectbox 목록
      electTitleItems: [], // 법정선임자 selectbox 목록
      disabled: false,
      tabItems: [
        { title: 'L0000002843', path: 'fileUpload' }, // 첨부파일
        { title: 'L0000003047', path: './electEvalRsltItem' }, // 평가결과        
      ], // 탭아이템
      tabIndex: 0,
      components: null,
      attachFileGrps: [],
      saveAttachFiles: [],
      tempDeleteFiles: [],
      submitObject: {
        submitCheck: false,
      },
    };
  },
  computed: {
    rsltLbl() {
      return this.popupParam.evalType === 'me' ? 'L0000005220' : 'L0000005221'; // 본인평가결과 상세 : 상위평가결과 상세
    },
    confirmBtn() {
      // 확정버튼 권한
      let procStepCd =
        this.popupParam.evalType === 'me'
          ? this.electEvalRslt.meProcStep
          : this.electEvalRslt.upProcStep;

      return (
        this.editable && this.electEvalRslt.evalUserNo && procStepCd === 'PSREG'
      );
    },
    saveBtn() {
      // 저장버튼 권한
      let procStepCd =
        this.popupParam.evalType === 'me'
          ? this.electEvalRslt.meProcStep
          : this.electEvalRslt.upProcStep;

      return (
        this.editable && this.electEvalRslt.evalUserNo && procStepCd !== 'PSEND'
      );
    },
    cancelBtn() {
      // 삭제버튼 권한
      let procStepCd =
        this.popupParam.evalType === 'me'
          ? this.electEvalRslt.meProcStep === 'PSEND'
          : this.electEvalRslt.upProcStep === 'PSEND';

      return this.editable && this.electEvalRslt.evalUserNo && procStepCd;
    },
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestory() {},
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.electEvalRslt.year = this.$comm.getThisYear();

      // 구분 (상반기/하반기)
      this.$comm.getComboItems('MGT_HALF_TYPE', false).then((_result) => {
        this.MgtHalfTypeItems = _result;
      });

      // 법정선임자(평가대상인 법정선임자)
      this.getElectTitleComboItems();

      if (this.popupParam.evalUserNo) {
        this.electEvalRslt.evalUserNo = this.popupParam.evalUserNo;
        this.getDetail();
      }
    },
    getElectTitleComboItems() {
      this.$http.url = selectConfig.saf.electTitle.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y', // 사용여부
        evalTgtYn: 'Y', // 평가대상여부
      };
      this.$http.request(
        (_result) => {
          this.electTitleItems = this.$_.clone(_result.data);
          this.electTitleItems.splice(0, 0, {
            safElectTitlNo: null,
            electTitlNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 전체 */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      let url =
        this.popupParam.evalType === 'me'
          ? selectConfig.mgt.electEvalMgmt.rslt.me.get.url
          : selectConfig.mgt.electEvalMgmt.rslt.up.get.url;

      this.$http.url = this.$format(url, this.electEvalRslt.evalUserNo);
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (_result.data) {
            this.electEvalRslt = this.$_.clone(_result.data);

            let procStepCd =
              this.popupParam.evalType === 'me'
                ? this.electEvalRslt.meProcStep
                : this.electEvalRslt.upProcStep;

            this.setAttachFileGrps();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    loadComponent() {
      let path = this.tabItems[this.tabIndex].path;

      if (path === 'fileUpload') {
        this.components = () =>
          import(`${'@/pages/common/attachFile/multiFileUpload'}`);
      } else {
        this.components = () => import(`${path}`);
      }
    },
    btnSave() {
      let param = { msg: 'M0000000011' };

      let promises = [
        { func: this.checkValidation },
        { func: this.confirm, param: param }, // 저장하시겠습니까?
        { func: this.saveData },
      ];

      this.$comm.orderedPromise(promises);
    },
    btnCancel() {
      let param = { msg: 'L0000005213' };

      let promises = [
        { func: this.checkValidation, param: 'cancel' },
        { func: this.confirm, param: param }, // 확정취소 하시겠습니까?
        { func: this.cancelData },
      ];

      this.$comm.orderedPromise(promises);
    },
    btnConfirm() {
      let param = { msg: 'M0000001593', flag: 'confirm' };

      let promises = [
        { func: this.checkValidation },
        { func: this.confirm, param: param }, // 확정 하시겠습니까?
        { func: this.saveData, param: 'confirm' },
      ];

      this.$comm.orderedPromise(promises);
    },
    /** validation checking **/
    checkValidation(flag) {
      // 값 유효성 체크
      return new Promise((_resolve) => {
        if (flag === 'cancel') {
          if (this.popupParam.evalType === 'me') {
            // 상위평가결과 작성중일 경우 확정취소 불가능
            let validCancel = this.electEvalRslt.upProcStep === 'PSURE';

            if (!validCancel) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'L0000005222', // 평가가 진행되어 확정취소할 수 없습니다.
                type: 'warning',
              });
              return;
            }
          }

          _resolve(true);
        } else {
          // 유효성 검사 체크
          this.$validator
            .validateAll()
            .then((_result) => {
              if (_result) {
                _resolve(this.checkEvalRsltValidation());
              }
            })
            .catch((e) => {
              window.getApp.$emit(
                'APP_VALID_ERROR',
                'M0000000876' // 유효성 검사도 에러가 발생하였습니다.
              );
            });
        }
      });
    },
    checkEvalRsltValidation() {
      let returnVal = true;
      this.electEvalRslt.electEvalRsltItems.every((item) => {
        let evalPoint =
          this.popupParam.evalType === 'me'
            ? item.meEvalPoint
            : item.upEvalPoint;

        if (!evalPoint && evalPoint !== 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // 본인평가 점수를 선택해주세요.
            message: '[' + this.$comm.getLangSpecInfoLabel('L0000003047') + '] ' + this.$comm.getLangSpecInfoLabel('L0000005181'),
            type: 'warning',
          });
          returnVal = false;
          return false;
        }

        return true;
      });

      return returnVal;
    },
    confirm(param) {
      // 저장
      return new Promise((_resolve) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // 확인
          message: param.msg,
          type: 'info',
          confirmCallback: () => {
            if (this.popupParam.evalType === 'me') {
              // 본인평가결과
              this.electEvalRslt.meProcStep =
                param.flag === 'confirm' ? 'PSEND' : 'PSREG'; // 확정일 경우 완료/저장일 경우 작성중
            } else {
              // 상위평가결과
              this.electEvalRslt.upProcStep =
                param.flag === 'confirm' ? 'PSEND' : 'PSREG'; // 확정일 경우 완료/저장일 경우 작성중
            }

            this.electEvalRslt.electEvalRsltItems =
              this.electEvalRslt.electEvalRsltItems.map((item) => {
                let row = item;

                row.evalPoint =
                  this.popupParam.evalType === 'me'
                    ? row.meEvalPoint // 본인평가점수
                    : row.upEvalPoint; // 상위평가점수

                if (row.evalMeRsltNo) {
                  // 평가결과 항목번호가 있을 경우
                  row.updateUserId = this.$store.getters.token;
                  row.updateDeptCd = this.$store.getters.deptCd;
                  row.updateDeptNm = this.$store.getters.deptNm;
                  row.updatePositionCd = this.$store.getters.positionCd;
                  row.updatePositionNm = this.$store.getters.positionNm;
                } else {
                  // 평가결과 항목번호가 없을 경우 (본인평가결과 미작성 상태인 경우)
                  row.createUserId = this.$store.getters.token;
                  row.createDeptCd = this.$store.getters.deptCd;
                  row.createDeptNm = this.$store.getters.deptNm;
                  row.createPositionCd = this.$store.getters.positionCd;
                  row.createPositionNm = this.$store.getters.positionNm;
                }

                return row;
              });

            _resolve(true);
          },
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData(flag) {
      return new Promise((_resolve) => {
        let url =
          this.popupParam.evalType === 'me'
            ? transactionConfig.mgt.electEvalMgmt.rslt.me.save.url
            : transactionConfig.mgt.electEvalMgmt.rslt.up.save.url;

        this.$http.url = url;
        this.$http.type = 'PUT';
        this.$http.param = this.electEvalRslt;
        this.$http.request(
          (_result) => {
            this.electEvalRslt = this.$_.clone(_result.data);

            this.saveAttach();

            if (flag === 'confirm') {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000001590', // 확정 되었습니다.
                type: 'success',
              });
            } else {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000006', // 저장되었습니다.
                type: 'success',
              });
            }

            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      });
    },
    cancelData() {
      return new Promise((_resolve) => {
        let url =
          this.popupParam.evalType === 'me'
            ? transactionConfig.mgt.electEvalMgmt.rslt.me.cancel.url
            : transactionConfig.mgt.electEvalMgmt.rslt.up.save.url;

        this.$http.url = url;
        this.$http.type = 'PUT';
        this.$http.param = this.electEvalRslt;
        this.$http.request(
          (_result) => {
            if (_result.data) {
              this.electEvalRslt = this.$_.clone(_result.data);
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'L0000005223', // 확정취소되었습니다.
                type: 'success',
              });

              _resolve(true);
            }
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
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
    /** /validation checking **/
    setAttachFileGrps() {
      let taskKey = this.electEvalRslt.evalUserNo
        ? this.electEvalRslt.evalUserNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000002843', // '첨부파일',
          taskClassNm: 'ELECT_EVAL_ME_RSLT',
          taskKey: taskKey,
          editable: this.editable && !this.disabled,
          drag: this.editable && !this.disabled,
          disabled: !this.editable || this.disabled,
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
        item.taskKey = this.electEvalRslt.evalUserNo;
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
      }
    },
    /** Button Event **/
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    /** /Button Event **/
  },
};
</script>
