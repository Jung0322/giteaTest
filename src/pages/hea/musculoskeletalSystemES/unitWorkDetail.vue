<!--
  목적 : 근골격계 체크리스트 등록/수정
  Detail : 체크리스트 등록/수정
  examples:
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 단위작업 상세 -->
            <y-label
              label="L0000000874"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && popupParam.tabEditable"
                :action-url="saveUrl"
                :param="unitWork"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-plant
                :editable="editable"
                :width="baseWidth"
                type="edit"
                :disabled="true"
                name="plantCd"
                v-model="unitWork.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 조사번호 -->
              <y-text
                :width="baseWidth"
                :disabled="true"
                :editable="editable"
                ui="bootstrap"
                label="L0000002654"
                name="researchCd"
                v-model="unitWork.researchCd"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 조사대상부서 -->
              <y-select
                :required="true"
                :width="8"
                :editable="editable"
                :disabled="
                  !popupParam.tabEditable || unitWork.muscResearchUnitNo > 0
                "
                :comboItems="deptItems"
                itemText="deptNm"
                itemValue="deptCd"
                ui="bootstrap"
                name="deptCd"
                label="L0000004264"
                v-model="unitWork.deptCd"
                v-validate="'required'"
              ></y-select>

              <!-- <y-tree-dept
                :width="baseWidth"
                label="조사부서"
                type="edit"
                :plantCd="unitWork.plantCd"
                v-model="unitWork.deptCd"
                :editable="editable"
                :disabled="true"
                name="deptCd"
              /> -->
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 공정 -->
              <y-tree-process
                :required="true"
                :editable="editable"
                :disabled="!popupParam.tabEditable || !deptCheck"
                label="L0000000515"
                name="processCd"
                type="edit"
                :showDataMapping="true"
                :plantCd="unitWork.plantCd"
                :deptCd="unitWork.deptCd"
                v-model="unitWork.processCd"
                v-validate="'required'"
                :state="validateState('processCd')"
              ></y-tree-process>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 단위작업명 -->
              <y-text
                :width="baseWidth"
                :editable="editable"
                :disabled="!popupParam.tabEditable"
                :required="true"
                :maxlength="50"
                ui="bootstrap"
                label="L0000000875"
                name="unitWorkNm"
                v-model="unitWork.unitWorkNm"
                v-validate="'required'"
                :state="validateState('unitWorkNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 조사일자 -->
              <y-datepicker
                :width="baseWidth"
                :editable="editable"
                :disabled="!popupParam.tabEditable"
                :required="true"
                label="L0000004376"
                name="researchDt"
                :default="unitWork.researchDt"
                v-model="unitWork.researchDt"
                v-validate="'required'"
                :state="validateState('researchDt')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 작업인원 -->
              <y-number
                :width="baseWidth"
                :required="true"
                :editable="editable"
                :disabled="!popupParam.tabEditable"
                :maxlength="3"
                :hasSeperator="false"
                ui="bootstrap"
                label="L0000002409"
                name="workerCnt"
                v-model="unitWork.workerCnt"
                v-validate="'required'"
                :state="validateState('workerCnt')"
              ></y-number>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <y-text
                :width="8"
                :required="true"
                :editable="editable"
                :disabled="true"
                ui="bootstrap"
                label="L0000002649"
                name="researchUserNm"
                v-model="unitWork.researchUserNm"
                :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                @searchUser="btnSearchUserClicked"
                v-validate="'required'"
                :state="validateState('researchUserNm')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 부담작업No -->
              <y-checkbox
                :width="10"
                :required="true"
                :editable="editable"
                :disabled="!popupParam.tabEditable"
                :comboItems="chklistItems"
                itemText="chklistNm"
                itemValue="muscResearchChklistNo"
                ui="bootstrap"
                name="muscResearchChklistNos"
                label="L0000001285"
                v-model="unitWork.muscResearchChklistNos"
                v-validate="'required'"
                :state="validateState('muscResearchChklistNos')"
              />
            </b-col>
            <b-col sm="12" class="mb-3 workCategoryTableJob">
              <y-data-table
                ref="dataTableIn"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :useRownum="false"
                class="unitWork-tbl"
                label
              >
                <!-- 구분 -->
                <el-table-column
                  :label="$comm.getLangSpecInfoLabel('L0000000686')"
                  slot="tag"
                  name="gubun"
                  class-name="default-td"
                  header-align="center"
                >
                  <!-- 노출시간 -->
                  <el-table-column
                    :label="$comm.getLangSpecInfoLabel('L0000000850')"
                    width="120"
                    name="exposureTime"
                    class-name="default-td"
                    header-align="center"
                  >
                    <!-- 노출빈도 -->
                    <el-table-column
                      :label="$comm.getLangSpecInfoLabel('L0000000848')"
                      width="120"
                      name="exopsureCnt"
                      class-name="default-td"
                      header-align="center"
                    >
                      <!-- 신체부위 -->
                      <el-table-column
                        :label="$comm.getLangSpecInfoLabel('L0000000848')"
                        width="120"
                        name="bodyDesc"
                        class-name="default-td"
                        header-align="center"
                      >
                        <!-- 작업자세 및 내용 -->
                        <el-table-column
                          :label="$comm.getLangSpecInfoLabel('L0000002415')"
                          width="120"
                          name="positionDesc"
                          class-name="default-td"
                          header-align="center"
                        >
                          <!-- 무게 -->
                          <!-- <el-table-column
                            :label="$comm.getLangSpecInfoLabel('L0000001033')"
                            width="120"
                            name="weightDesc"
                            class-name="default-td"
                            header-align="center"
                            align="center"
                            prop="work_nm"
                          > -->
                          <!--  prop="col1" -->
                          <!-- <template slot-scope="scope">
                              {{
                              scope.row.col1
                              }}
                            </template>-->
                          <!-- <template slot-scope="scope">
                            {{ scope.row.work_nm }}
                          </template> -->
                          <!-- </el-table-column> -->
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>
                  </el-table-column>
                </el-table-column>
                <el-table-column
                  v-for="(img, index) in imageArr"
                  :key="img.src"
                  slot="tag"
                  class-name="musculoskeletal-img"
                  header-align="center"
                >
                  <!-- v-for="(img, index) in imageArr" -->
                  <template slot="header" slot-scope="scope">
                    {{ index + 1
                    }}{{ $comm.getLangSpecInfoLabel('L0000003198') }}
                    <!-- 항 -->
                    <el-image :src="img.src"></el-image>
                  </template>
                  <el-table-column
                    label
                    width="120"
                    class-name="default-td"
                    header-align="center"
                  >
                    <template slot="header" slot-scope="scope">
                      <span v-html="img.exposureTime"></span>
                    </template>
                    <el-table-column
                      width="120"
                      class-name="default-td"
                      header-align="center"
                    >
                      <template slot="header" slot-scope="scope">
                        <span v-html="img.exopsureCnt"></span>
                      </template>
                      <el-table-column
                        width="120"
                        class-name="default-td"
                        header-align="center"
                      >
                        <template slot="header" slot-scope="scope">
                          <span v-html="img.bodyDesc"></span>
                        </template>
                        <el-table-column
                          width="120"
                          class-name="default-td"
                          header-align="center"
                        >
                          <template slot="header" slot-scope="scope">
                            <span v-html="img.positionDesc"></span>
                          </template>
                          <!-- <el-table-column
                            width="120"
                            class-name="default-td weight-desc"
                            header-align="center"
                            align="center"
                            :prop="String(index + 1)"
                          > -->
                          <!-- -->
                          <!-- <template slot="header" slot-scope="scope">
                              {{ img.weightDesc }}
                            </template> -->
                          <template slot-scope="scope">
                            {{ scope.row[index + 1] }}
                          </template>
                          <!-- </el-table-column> -->
                        </el-table-column>
                      </el-table-column>
                    </el-table-column>
                  </el-table-column>
                </el-table-column>
              </y-data-table>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 작업내용 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="!popupParam.tabEditable"
                :maxlength="600"
                ui="bootstrap"
                label="L0000002374"
                name="processDesc"
                v-model="unitWork.processDesc"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :disabled="!popupParam.tabEditable"
                :maxlength="600"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="unitWork.remark"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
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
  name: 'unit-work-job',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          muscResearchNo: 0,
          muscResearchUnitNo: 0,
          tabEditable: false,
          plantCd: null,
          muscResearchDepts: [],
        };
      },
    },
  },
  data() {
    return {
      unitWork: {
        deptCd: '',
        processCd: '',
        researchCd: '',
        processNm: '',
        // unitNo: '',
        muscResearchUnitNo: 0,
        muscResearchNo: 0,
        muscResearchDeptNo: 0,
        processDesc: '',
        unitWorkNm: null,
        researchDt: '',
        workerCnt: '',
        researchUserId: '',
        researchUserNm: '',
        remark: '',
        createUserId: '',
        updateUserId: '',
        chklistNm: '',
        chklistDesc: '',
        muscResearchChklistNos: [],
        muscResearchChklists: [],
      },
      gridOptions: {
        // 조사결과
        header: [],
        data: [],
        height: '390px',
        merge: [],
      },
      imageArrs: [],
      imageArr: [],
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        height: '50%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      deptItems: [],
      chklistItems: [], // 부담작업 No 리스트
      searchUrl: '',
      checkUrl: '',
      searchChklistUrl: '',
      saveUrl: '',
      baseWidth: 8,
      editable: false,
      isSave: false,
      actionType: 'POST',
      // orderNo: 0,
      deptCheck: false,
    };
  },
  computed: {
    publicPath: function () {
      return process.env.PUBLIC_PATH;
    },
  },
  watch: {
    'unitWork.deptCd': function (newValue, oldValue) {
      if (newValue === null) {
        this.deptCheck = false;
      } else {
        this.deptCheck = true;
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
  },
  mounted() {
    this.init();
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.searchUrl = selectConfig.hea.unitWork.get.url;
      this.searchChklistUrl = selectConfig.hea.unitWorkChklist.list.url;
      this.checkUrl = selectConfig.hea.unitWork.check.url;
      this.saveUrl = transactionConfig.hea.unitWork.insert.url;

      this.deptItems = this.$_.cloneDeep(this.popupParam.muscResearchDepts);
      this.deptItems.splice(0, 0, {
        deptCd: null,
        deptNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
      });

      this.getchklistItems();
      this.getDetail();
      this.getGubunList();
    },
    getchklistItems() {
      this.$http.url = selectConfig.hea.unitWorkChklist.list.url;
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.chklistItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail() {
      if (!this.popupParam.muscResearchUnitNo) {
        this.unitWork.plantCd = this.$_.clone(this.popupParam.plantCd);
        if (
          this.$_.findIndex(this.deptItems, {
            deptCd: this.$store.getters.deptCd,
          }) === -1
        ) {
          this.unitWork.deptCd = null;
        } else {
          this.unitWork.deptCd = this.$store.getters.deptCd;
        }
        return;
      }

      this.$http.url = this.$format(
        this.searchUrl,
        this.popupParam.muscResearchUnitNo
      );
      this.$http.type = 'get';

      this.$http.request(
        (_result) => {
          this.unitWork = this.$_.clone(_result.data);
          console.log('## unitWork : ', this.unitWork);
          if (
            this.unitWork.muscResearchChklists &&
            this.unitWork.muscResearchChklists.length > 0
          ) {
            this.unitWork.muscResearchChklistNos = this.$_.map(
              this.unitWork.muscResearchChklists,
              'muscResearchChklistNo'
            );
          } else {
            this.unitWork.muscResearchChklistNos = [];
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    getGubunList() {
      this.$http.url = this.searchChklistUrl;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.imageArrs = this.$_.clone(_result.data);
          this.setgubunTable();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setgubunTable(item) {
      let i = 1;
      this.$_.forEach(this.imageArrs, (item) => {
        item.src =
          this.publicPath + '/src/assets/images/musculoskeletal_' + i + '.jpg';
        this.imageArr.push(item);
        i += 1;
      });
    },
    beforeSave() {
      if (this.popupParam.muscResearchUnitNo) {
        this.saveUrl = transactionConfig.hea.unitWork.edit.url;
        this.actionType = 'PUT';
        this.checkValidator('edit');
      } else {
        this.saveUrl = transactionConfig.hea.unitWork.insert.url;
        this.actionType = 'POST';
        this.checkValidator('insert');
      }
    },
    checkValidator(checkMode) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (this.unitWork.workerCnt <= 0) {
            _result = false;
          }
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              deptCd: this.unitWork.deptCd,
              muscResearchNo: this.popupParam.muscResearchNo,
              unitWorkNm: this.unitWork.unitWorkNm,
              muscResearchUnitNo:
                checkMode === 'edit' ? this.unitWork.muscResearchUnitNo : 0,
            };
            this.$http.request(
              (_result) => {
                if (_result.data != null && _result.data > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message:
                      this.$comm.getLangSpecInfoLabel('L0000004377') + //  해당 공정에서 단위작업 [
                      this.unitWork.unitWorkNm +
                      this.$comm.getLangSpecInfoLabel('L0000004378'), // ]이 이미 존재 합니다.
                    type: 'warning',
                  });
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    // TODO : 필요시 추가하세요.
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.unitWork.createUserId = this.$store.getters.token;
                      this.unitWork.updateUserId = this.$store.getters.token;
                      this.unitWork.muscResearchNo =
                        this.popupParam.muscResearchNo;
                      this.unitWork.muscResearchChklists = [];

                      this.$_.forEach(
                        this.unitWork.muscResearchChklistNos,
                        (item) => {
                          if (
                            this.$_.findIndex(
                              this.unitWork.muscResearchChklists,
                              {
                                muscResearchChklistNo: item,
                              }
                            ) === -1
                          ) {
                            this.unitWork.muscResearchChklists.push({
                              muscResearchChklistNo: item,
                              createUserId: this.$store.getters.token,
                            });
                          }
                        }
                      );
                      this.isSave = true;
                    },
                    cancelCallback: () => {},
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000005' // '필수 입력값을 입력해 주세요.',
            );
          }
        })
        .catch(() => {
          this.isSave = false;
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
      if (!this.popupParam.muscResearchUnitNo) {
        this.popupParam.muscResearchUnitNo = _result.data;
        this.unitWork.muscResearchUnitNo = _result.data;
      }

      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.getDetail();
      this.isSave = false;
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
    /**
     * 버튼 에러 처리용 공통함수
     */
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchUserClicked() {
      if (!this.popupParam.tabEditable) return;
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.unitWork.plantCd,
        deptCd: this.unitWork.deptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.unitWork.researchUserNm = data.user.userNm;
        this.unitWork.researchUserId = data.user.userId;
      }
    },
  },
};
</script>
<style>
.workCategoryTableJob .el-table .el-table__header-wrapper {
  overflow-x: scroll !important;
}
.weight-desc {
  font-size: 0.7825rem !important;
}
</style>
