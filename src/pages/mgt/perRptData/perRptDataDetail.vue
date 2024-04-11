<template>
  <b-container fluid>
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <b-row>
            <b-col sm="12">
              <!-- 중처법 정기보고자료 상세 -->
              <y-label
                label="L0000005142"
                icon="user-edit"
                color-class="cutstom-title-color"
              />
              <div slot="buttonGroup" class="float-right mb-1">
                <!-- 확정 -->
                <y-btn
                  v-if="this.updateMode && this.perRptData.stepCd === '0001'"
                  title="L0000004571"
                  color="black"
                  @btnClicked="btnCompleteClicked"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                <!-- 임시저장 L0000004986-->
                <y-btn
                  v-if="editable && insertMode"
                  :action-url="insertUrl"
                  :param="perRptData"
                  :is-submit="isInsert"
                  title="L0000004986"
                  color="orange"
                  action-type="POST"
                  beforeSubmit="beforeInsert"
                  @beforeInsert="beforeInsert"
                  @btnClicked="btnInsertClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                <!-- 임시저장(수정) -->
                <y-btn
                  v-if="
                    editable &&
                    this.updateMode &&
                    this.perRptData.stepCd === '0001'
                  "
                  :action-url="editUrl"
                  :param="perRptData"
                  :is-submit="isEdit"
                  title="L0000004986"
                  color="orange"
                  action-type="PUT"
                  beforeSubmit="beforeEdit"
                  @beforeEdit="beforeEdit"
                  @btnClicked="btnEditClickedCallback"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                />
                <!-- 삭제 -->
                <y-btn
                  v-if="
                    editable &&
                    updateMode &&
                    $store.getters.token === perRptData.createUserId
                  "
                  title="L0000001495"
                  color="red"
                  @btnClicked="btnDeleteClickedCallback"
                />
                <!-- 닫기 -->
                <y-btn title="L0000000881" @btnClicked="closePopup" />
              </div>
            </b-col>
          </b-row>
          <b-card>
            <b-row>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <!-- 주관부서 -->
                <y-tree-dept
                  :width="8"
                  label="L0000002713"
                  :editable="editable && deptEditable"
                  :disabled="this.perRptData.stepCd === '0002'"
                  :required="true"
                  :plantCd="perRptData.plantCd"
                  v-model="perRptData.deptCd"
                  v-validate="'required'"
                  :state="validateState('deptCd')"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
                <!-- 년도 -->
                <y-datepicker
                  :width="8"
                  label="L0000000829"
                  type="year"
                  name="year"
                  :default="perRptData.year"
                  v-model="perRptData.year"
                  :disabled="this.perRptData.stepCd === '0002'"
                  :required="true"
                  v-validate="'required'"
                  :state="validateState('year')"
                ></y-datepicker>
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <!-- 구분 -->
                <y-select
                  :width="8"
                  :comboItems="perClsItems"
                  :editable="editable"
                  :disabled="this.perRptData.stepCd === '0002'"
                  :required="true"
                  itemText="codeNm"
                  itemValue="code"
                  ui="bootstrap"
                  name="halfTypeCd"
                  label="L0000000686"
                  v-model="perRptData.halfTypeCd"
                  v-validate="'required'"
                  :state="validateState('halfTypeCd')"
                />
              </b-col>
              <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
                <!-- 보고일자   @text="
                    (val) => {
                      inputText(val, 'halfTypeCd');
                    }
                  "-->
                <y-datepicker
                  :width="8"
                  :editable="editable"
                  :disabled="this.perRptData.stepCd === '0002'"
                  label="L0000005126"
                  :required="true"
                  name="rptDt"
                  :default="perRptData.rptDt"
                  v-model="perRptData.rptDt"
                  v-validate="'required'"
                  :state="validateState('rptDt')"
                ></y-datepicker>
              </b-col>
              <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
                <!-- 보고명 -->
                <y-text
                  :width="10"
                  :editable="editable"
                  :required="true"
                  :maxlength="60"
                  ui="bootstrap"
                  label="L0000005127"
                  name="rptNm"
                  :disabled="this.perRptData.stepCd === '0002'"
                  v-model="perRptData.rptNm"
                  v-validate="'required'"
                  :state="validateState('rptNm')"
                ></y-text>
              </b-col>
              <!-- 첨부파일 -->
              <el-divider content-position="left">{{
                $comm.getLangSpecInfoLabel('L0000002843')
              }}</el-divider>
              <component
                :is="attach"
                v-if="attach"
                sm="12"
                :submitCheck="submitCheck"
                :attachFileGrps="attachFileGrps"
                :saveAttachFiles="saveAttachFiles"
                @changeUploadFiles="changeUploadFiles"
                @setTempDeleteFiles="setTempDeleteFiles"
              />
            </b-row>
          </b-card>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'per-Rpt-Detail',
  props: {
    popupParam: {
      default: {
        perRptDataNo: 0, // 예산편성번호
      },
    },
  },
  data() {
    return {
      perRptData: {
        perRptDataNo: 0,
        detpCd: null,
        year: null,
        halfTypeCd: null,
        rptDt: null,
        rptNm: null,
        procStepCd: null,
        stepCd: null,
        createUserId: null,
        createDt: null,
        updateUserId: null,
        updateDt: null,
        createDeptNm: null,
        createDeptCd: null,
        updateDeptNm: null,
        updateDeptCd: null,
        createPositionNm: null,
        createPositionCd: null,
        updatePositionNm: null,
        updatePositionCd: null,
      },
      editable: true, // 수정가능여부
      insertMode: false,
      updateMode: false,
      compleMode: false,
      disabled: false,
      perClsItems: [], // 구분 selectbox 목록
      insertUrl: '',
      editUrl: '',
      deleteUrl: '',
      completeUrl: '',
      isInsert: false,
      isEdit: false,
      isComplete: false,

      // 첨부파일
      attach: null,
      submitCheck: false,
      saveAttachFiles: [],
      tempDeleteFiles: [],
      attachFileGrps: [],

      deptEditable: true,
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},

  methods: {
    init() {
      this.perRptData.rptDt = this.$comm.getToday();
      this.perRptData.year = this.$comm.getThisYear();

      // URL 셋팅
      this.editable = this.$route.meta.editable;
      this.insertUrl = transactionConfig.mgt.perRptData.insert.url;
      this.editUrl = transactionConfig.mgt.perRptData.edit.url;
      this.deleteUrl = transactionConfig.mgt.perRptData.delete.url;
      this.completeUrl = transactionConfig.mgt.perRptData.complete.url;

      // 구분(상반기/하반기)
      this.$comm.getComboItems('MGT_HALF_TYPE', false).then((_result) => {
        this.perClsItems = this.$_.clone(_result);
      });

      // 첨부파일 셋팅
      this.attach = () => import('@/pages/common/attachFile/multiFileUpload');

      if (this.popupParam.perRptDataNo === 0) {
        this.updateMode = false;
        this.insertMode = true;
        this.perRptData.plantCd = this.$store.getters.plantCd;
        this.perRptData.createUserNm = this.$store.getters.name;
        this.setAttachFileGrps();
      } else {
        setTimeout(() => {
          this.getDetail();
        }, 600);

        this.updateMode = true;
        this.insertMode = false;
      }

      // 권한별 컨트롤 처리
      if (!this.$comm.isCompanyGrp() && !this.$comm.isPlantGrp()) {
        // 일반사용자
        this.deptEditable = false;
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
    setAttachFileGrps() {
      let taskKey = this.popupParam.perRptDataNo
        ? this.popupParam.perRptDataNo.toString()
        : '';
      this.attachFileGrps = [
        {
          label: 'L0000005131', // 보고자료
          uploadTempFiles: null,
          taskClassNm: 'PERRPT_DATA',
          taskKey: taskKey,
          drag: false,
          showFileSearch: this.editable,
          editable: !this.isComplete,
          createUserId: this.$store.getters.token,
        },
      ];
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
        item.taskKey = this.popupParam.perRptDataNo;
      });
      // 저장할 데이터가 있는 경우
      if (this.saveAttachFiles.length > 0) {
        this.submitCheck = !this.submitCheck;
      }
    },

    closePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    // 수정모드 Detail
    getDetail() {
      if (this.popupParam.perRptDataNo === undefined) {
        return;
      }

      this.$http.url = this.$format(
        selectConfig.mgt.perRptData.get.url,
        this.popupParam.perRptDataNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.perRptData = this.$_.clone(_result.data);
          this.updateMode = true;
          if (this.perRptData.stepCd === '0002') {
            this.isComplete = true;
          }
          this.setAttachFileGrps();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
        }
      );
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

    //  버튼Method- 등록
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.perRptData.createUserId = this.$store.getters.token;
                this.perRptData.createDeptCd = this.$store.getters.deptCd;
                this.perRptData.createDeptNm = this.$store.getters.deptNm;
                this.perRptData.createPositionCd =
                  this.$store.getters.positionCd;
                this.perRptData.createPositionNm =
                  this.$store.getters.positionNm;

                this.isInsert = true;
              },
            });
          } else {
            this.$popupRequired.check(
              'perRptDataDetail',
              this.$data,
              this.errors
            );
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000001226', // 필수입력값을 입력해주세요.
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
        });
    },
    btnInsertClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });

      this.isInsert = false;
      this.isEdit = true;
      this.updateMode = true;
      this.insertMode = false;
      this.popupParam.perRptDataNo = _result.data.perRptDataNo;
      this.getDetail();

      this.saveAttach();
    },

    //  버튼Method- 수정
    beforeEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // 확인
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.isEdit = true;
                this.perRptData.updateUserId = this.$store.getters.token;
                this.perRptData.updateDeptCd = this.$store.getters.deptCd;
                this.perRptData.updateDeptNm = this.$store.getters.deptNm;
                this.perRptData.updatePositionCd =
                  this.$store.getters.positionCd;
                this.perRptData.updatePositionNm =
                  this.$store.getters.positionNm;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'perRptDataDetail',
              this.$data,
              this.errors
            );
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000001226', // 필수입력값을 입력해주세요.
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000004');
        });
    },
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다.
        type: 'success', // success / info / warning / error
      });

      this.isEdit = false;
      this.saveAttach();
    },

    //  버튼Method- 삭제
    btnDeleteClickedCallback(_result) {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = this.$format(
            this.deleteUrl,
            this.perRptData.perRptDataNo
          );
          this.$http.type = 'DELETE';
          this.$http.request(
            (_result) => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // 안내
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success',
              });
              this.closePopup();
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    // 버튼Method- 확정
    btnCompleteClicked() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: 'L0000005755',
              // 확정 전 저장됩니다. 진행하시겠습니까?
              type: 'info', // success / info / warning / error
              confirmCallback: () => {
                this.$http.url = this.editUrl;
                this.$http.type = 'PUT';
                this.$http.param = this.perRptData;
                this.$http.request(
                  (_result) => {
                    this.$http.url = this.$format(this.completeUrl);
                    this.$http.type = 'PUT';
                    this.$http.param = this.perRptData;
                    this.$http.request(
                      (_result) => {
                        window.getApp.$emit('ALERT', {
                          title: 'L0000003395', // 안내
                          message: 'M0000001590', // 확정되었습니다.
                          type: 'success',
                        });
                        this.isComplete = true;
                        this.getDetail();
                      },
                      (_error) => {
                        window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
                      }
                    );
                  },
                  (_error) => {
                    window.getApp.$emit('APP_REQUEST_ERROR', _error);
                  }
                );
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'perRptDataDetail',
              this.$data,
              this.errors
            );
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // 안내
              message: 'M0000001226', // 필수입력값을 입력해주세요.
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000004');
        });
    },

    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>
