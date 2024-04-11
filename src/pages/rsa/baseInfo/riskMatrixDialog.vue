<!--
  목적 : 작업허가서 점검 확인사항
  Detail : 작업허가서 점검 확인사항 Tab
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 위험Matrix 상세 -->
            <y-label
              label="L0000002115"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 개정 -->
              <y-btn
                v-if="
                  popupParam.assessTypeNo > 0 &&
                  !revMode &&
                  editable &&
                  !updateMod &&
                  !editMode &&
                  !popupParam.isHistory
                "
                title="L0000000291"
                color="blue"
                @btnClicked="renewalMode"
              />
              <!-- 개정완료 -->
              <y-btn
                v-if="revMode && editable && !popupParam.isHistory"
                :action-url="renewUrl"
                :param="assessType"
                :is-submit="isRenew"
                title="개정완료"
                color="blue"
                action-type="POST"
                beforeSubmit="beforeRenew"
                @beforeRenew="beforeRenew"
                @btnClicked="btnRenewClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 수정 -->
              <y-btn
                v-if="
                  popupParam.assessTypeNo > 0 &&
                  !revMode &&
                  editable &&
                  !updateMod &&
                  !editMode &&
                  !popupParam.isHistory
                "
                title="L0000001696"
                color="orange"
                @btnClicked="btnEdit"
              />
              <!-- 저장 -->
              <y-btn
                v-if="
                  popupParam.assessTypeNo === 0 &&
                  !updateMod &&
                  !revMode &&
                  editable &&
                  !popupParam.isHistory
                "
                :action-url="insertUrl"
                :param="assessType"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 수정 -->
              <y-btn
                v-if="
                  popupParam.assessTypeNo !== 0 &&
                  editable &&
                  editMode &&
                  !revMode &&
                  !popupParam.isHistory
                "
                :action-url="editUrl"
                :param="assessType"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="Put"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 취소 -->
              <!-- <y-btn
                v-if="revMode && editable&&!popupParam.isHistory"
                title="L0000002920"
                @btnClicked="cancel"
              /> -->
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup('C')" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                :required="true"
                :editable="editMode"
                :disabled="popupParam.isHistory"
                type="edit"
                name="plantCd"
                v-model="assessType.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 위험Matrix명 -->
              <y-text
                :width="8"
                :editable="editMode"
                :disabled="popupParam.isHistory"
                :maxlength="30"
                :required="true"
                ui="bootstrap"
                label="L0000002120"
                name="assessNm"
                v-model="assessType.assessNm"
                v-validate="'required'"
                :state="validateState('assessNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 위험Matrix 그룹 -->
              <y-select
                :width="8"
                :editable="editMode"
                :disabled="popupParam.isHistory"
                :comboItems="comboAssessGroupItems"
                itemText="codeNm"
                itemValue="code"
                :required="true"
                ui="bootstrap"
                label="L0000002116"
                name="assessGroupCd"
                v-model="assessType.assessGroupCd"
                v-validate="'required'"
                :state="validateState('assessGroupCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 위험Matrix 타입 -->
              <y-select
                :width="8"
                :editable="editMode"
                :disabled="popupParam.isHistory"
                :comboItems="comboAssessTypeItems"
                itemText="codeNm"
                itemValue="code"
                :required="true"
                ui="bootstrap"
                label="L0000002119"
                name="assessTypeCd"
                v-model="assessType.assessTypeCd"
                v-validate="'required'"
                :state="validateState('assessTypeCd')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 위험Matrix 설명 -->
              <y-textarea
                :width="10"
                :editable="editMode"
                :disabled="popupParam.isHistory"
                :maxlength="225"
                :required="true"
                ui="bootstrap"
                label="L0000002118"
                name="assessDesc"
                v-model="assessType.assessDesc"
                v-validate="'required'"
                :state="validateState('assessDesc')"
              ></y-textarea>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 개정번호 -->
              <y-number
                :width="8"
                :editable="editMode"
                :maxlength="10"
                :disabled="!revMode"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000000293"
                name="revNo"
                v-model="assessType.revNo"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 개정사유 -->
              <y-textarea
                :width="10"
                :editable="editMode"
                :maxlength="600"
                :disabled="!revMode"
                ui="bootstrap"
                label="L0000000294"
                name="revContents"
                v-model="assessType.revContents"
              ></y-textarea>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <el-tabs type="border-card" v-model="tabIndex" class="mt-3">
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
          :assessType.sync="assessType"
          :editMode.sync="editMode"
          :assessTypeNo.sync="popupParam.assessTypeNo"
          @riskMatrixAdd="riskMatrixAdd"
        />
      </keep-alive>
    </el-tabs>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'risk-matrix-dialog',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        plantCd: '',
        flag: '',
        assessTypeNo: '',
        isHistory: false,
      }),
    },
  },
  data() {
    return {
      tabItems: [
        { title: 'L0000002123', url: './riskMatrixAdditional.vue' }, // 위험도 생성
        { title: 'L0000000296', url: './assessTypeHistory.vue' }, // 개정이력목룍
      ],
      component: null,
      tabIndex: 0,
      searchParam: {
        plantCd: '',
        flag: '',
        assessTypeNo: '',
      },
      frequencyGridOptions: {
        header: [],
        data: [],
        height: 200,
      },
      strongGridOptions: {
        header: [],
        data: [],
        height: 200,
      },
      riskGridOptions: {
        header: [],
        data: [],
        height: 500,
      },
      assessType: {
        plantCd: '',
        assessTypeNo: 0,
        assessNm: '',
        assessDesc: '',
        assessTypeCd: '',
        assessGroupCd: '',
        assessGroupNo: 0,
        revNo: 1,
        revContents: '',
        createUserId: '',
        updateUserId: '',
        frequencyList: [],
        strongList: [],
        riskList: [],
      },
      tempRevNo: 1,
      tempRevContents: '',
      insertUrl: '',
      editUrl: '',
      renewUrl: '',
      isInsert: false,
      isEdit: false,
      isRenew: false,
      editable: true,
      revMode: false,
      updateMod: false,
      editMode: false,
      frequencySize: 1,
      strongSize: 1,
      deptAndPrecess: '',
      jobCdAndJobRevno: '',
      pRHNmAndRHNm: '',
      ADeptNmAndAUserNm: '',
      comboAssessTypeItems: [],
      comboAssessGroupItems: [],
    };
  },
  watch: {
    tabIndex() {
      this.loadComponent();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {},
  updated() {},
  mounted() {
    // Object.assign(this.$data, this.$options.data());
    this.init();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.rsa.assessAction.matrixeList.url;
      this.insertUrl = transactionConfig.rsa.assessType.insert.url;
      this.editUrl = transactionConfig.rsa.assessType.edit.url;
      this.renewUrl = transactionConfig.rsa.assessType.insert.url;
      // GridHeader
      if (this.editable && !this.popupParam.isHistory) {
        this.frequencyGridOptions.header = [
          {
            text: 'L0000001378',
            name: 'frequencySize',
            width: '55px',
            align: 'center',
          }, // 빈도
          {
            text: 'L0000001578',
            name: 'frequencyDesc',
            width: '400px',
            type: 'text',
          },
        ]; // 설명

        this.strongGridOptions.header = [
          {
            text: 'L0000000248',
            name: 'strongSize',
            width: '55px',
            align: 'center',
          }, // 강도
          {
            text: 'L0000001578',
            name: 'strongDesc',
            width: '400px',
            type: 'text',
          }, // 설명
        ];

        this.riskGridOptions.header = [
          {
            text: 'L0000001378',
            name: 'frequencySize',
            width: '90px',
            align: 'center',
          }, // 빈도
          {
            text: 'L0000000248',
            name: 'strongSize',
            width: '90px',
            align: 'center',
          }, // 강도
          {
            text: 'L0000002121',
            name: 'riskSize',
            width: '90px',
            align: 'center',
            type: 'number',
            maxlength: 2,
            hasSeperator: false,
          }, // 위험도
          {
            text: 'L0000001578',
            name: 'riskDesc',
            width: '800px',
            type: 'text',
          }, // 설명
        ];
      } else {
        this.frequencyGridOptions.header = [
          {
            text: 'L0000001378',
            name: 'frequencySize',
            width: '55px',
            align: 'center',
          }, // 빈도
          { text: 'L0000001578', name: 'frequencyDesc', width: '400px' }, // 설명
        ];

        this.strongGridOptions.header = [
          {
            text: 'L0000000248',
            name: 'strongSize',
            width: '55px',
            align: 'center',
          }, // 강도
          { text: 'L0000001578', name: 'strongDesc', width: '400px' }, // 설명
        ];

        this.riskGridOptions.header = [
          {
            text: 'L0000001378',
            name: 'frequencySize',
            width: '90px',
            align: 'center',
          }, // 빈도
          {
            text: 'L0000000248',
            name: 'strongSize',
            width: '90px',
            align: 'center',
          }, // 강도
          {
            text: 'L0000002121',
            name: 'riskSize',
            width: '90px',
            align: 'center',
          }, // 위험도
          { text: 'L0000001578', name: 'riskDesc', width: '800px' }, // 설명
        ];
      }
      this.$comm.getComboItems('RSA_ASSESS_TYPE', false).then((_result) => {
        this.comboAssessTypeItems = _result;
      });
      this.$comm.getComboItems('RSA_ASSESS_GROUP', false).then((_result) => {
        this.comboAssessGroupItems = _result;
      });
      if (this.popupParam.assessTypeNo !== 0) {
        this.updateMod = false;
        this.getDetailInfo();
        this.getList();
      } else {
        this.editMode = true;
      }
    },
    loadComponent() {
      var path = this.tabItems[this.tabIndex].url;

      this.component = () => import(`${path}`);
    },
    getDetailInfo() {
      this.$http.url = this.$format(
        selectConfig.rsa.assessType.get.url,
        this.popupParam.assessTypeNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.assessType = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      this.searchParam.assessTypeNo = this.popupParam.assessTypeNo;

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.frequencyGridOptions.data = this.$_.clone(
            _result.data.frequencyList
          );
          this.strongGridOptions.data = this.$_.clone(_result.data.strongList);
          this.riskGridOptions.data = this.$_.clone(_result.data.riskList);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
      console.log('edit, ', this.editMode);
      console.log('ishis, ', this.popupParam.isHistory);
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
    checkGridData(target, text) {
      var returnVal = true;
      if (text === '가능성') {
        this.$_.forEach(target, (item) => {
          if (!item.frequencyDesc) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000878' // 가능성 설명을 기입하세요
            );
            returnVal = false;
          }
        });
      } else if (text === '중대성') {
        this.$_.forEach(target, (item) => {
          if (!item.strongDesc) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000879' // 중대성 설명을 기입하세요.
            );
            returnVal = false;
          }
        });
      } else if (text === '위험도') {
        this.$_.forEach(target, (item) => {
          if (!item.riskDesc) {
            window.getApp.$emit(
              'APP_VALID_ERROR',
              'M0000000880' // 위험도 설명을 기입하세요.
            );
            returnVal = false;
          }
        });
      }
      return returnVal;
    },
    checkDescri() {
      var check = true;
      check = this.checkGridData(this.frequencyGridOptions.data, '가능성');
      if (check) {
        check = this.checkGridData(this.strongGridOptions.data, '중대성');
      }
      if (check) {
        check = this.checkGridData(this.riskGridOptions.data, '위험도');
      }

      return check;
    },
    /** validation checking **/
    beforeInsert() {
      if (
        this.frequencyGridOptions.data.length === 0 ||
        this.strongGridOptions.data.length === 0 ||
        this.riskGridOptions.data.length === 0
      ) {
        window.getApp.$emit(
          'APP_VALID_ERROR',
          'M0000000881' // 위험 Matrix 정보를 생성해 주세요.
        );
        return;
      } else {
        if (!this.checkDescri()) return;
        else this.checkAssessNm('I');
      }
    },
    beforeEdit() {
      if (
        this.frequencyGridOptions.data.length === 0 ||
        this.strongGridOptions.data.length === 0 ||
        this.riskGridOptions.data.length === 0
      ) {
        window.getApp.$emit(
          'APP_VALID_ERROR',
          'M0000000881' // 위험 Matrix 정보를 생성해 주세요.
        );
        return;
      } else {
        if (!this.checkDescri()) return;
        else this.checkAssessNm('E');
      }
    },
    beforeRenew() {
      if (
        this.frequencyGridOptions.data.length === 0 ||
        this.strongGridOptions.data.length === 0 ||
        this.riskGridOptions.data.length === 0
      ) {
        window.getApp.$emit(
          'APP_VALID_ERROR',
          'M0000000881' // 위험 Matrix 정보를 생성해 주세요.
        );
        return;
      } else if (this.tempRevNo === this.assessType.revNo) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000167', // 개정번호가 바뀌지 않았습니다.
          type: 'warning',
        });
        return;
      } else {
        if (!this.checkDescri()) return;
        else this.checkAssessNm('R');
      }
    },
    checkAssessNm(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = selectConfig.rsa.assessType.check.url;
            this.$http.type = 'GET';
            this.$http.param = {
              plantCd: this.assessType.plantCd,
              assessTypeNo: this.assessType.assessTypeNo,
              assessNm: this.assessType.assessNm,
              assessTypeCd: this.assessType.assessTypeCd,
              assessGroupNo: flag !== 'R' ? 0 : this.assessType.assessGroupNo,
              revNo: flag !== 'R' ? '1' : this.assessType.revNo,
            };
            this.$http.request(
              (_result) => {
                var cntList = this.$_.map(this.$_.clone(_result.data), 'cnt');

                if (cntList[0] > 0 && flag === 'I') {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    message: 'M0000000665', // 이미 해당 Matrix명이 있습니다.
                    type: 'warning',
                  });
                  return;
                } else if (cntList[1] > 0 && flag === 'R') {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395',
                    message: 'M0000000165', // 이미 해당 개정번호가 있습니다.
                    type: 'warning',
                  });
                  return;
                } else {
                  let msg = '';

                  if (flag === 'I') {
                    msg = 'M0000000011'; // 저장하시겠습니까?
                  } else if (flag === 'R') {
                    msg = 'M0000000166'; // 개정하시겠습니까?
                  } else {
                    msg = 'M0000000011';
                  }
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321',
                    message: msg,
                    type: 'info',
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.assessType.createUserId = this.$store.getters.token;
                      this.assessType.updateUserId = this.$store.getters.token;
                      this.assessType.frequencyList =
                        this.frequencyGridOptions.data;
                      this.assessType.strongList = this.strongGridOptions.data;
                      this.assessType.riskList = this.riskGridOptions.data;

                      this.$_.forEach(this.assessType.riskList, (risk) => {
                        let freq = this.$_.find(this.assessType.frequencyList, {
                          frequencySize: risk.frequencySize,
                        });
                        if (freq) {
                          risk.frequencyDesc = freq.frequencyDesc;
                        }
                        let stro = this.$_.find(this.assessType.strongList, {
                          strongSize: risk.strongSize,
                        });
                        if (stro) {
                          risk.strongDesc = stro.strongDesc;
                        }
                      });

                      if (flag === 'I') this.isInsert = true;
                      else if (flag === 'R') this.isRenew = true;
                      else this.isEdit = true;
                    },
                    cancelCallback: () => {
                      if (flag === 'I') this.isInsert = false;
                      else if (flag === 'R') this.isRenew = false;
                      else this.isEdit = false;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395',
              message: 'M0000000005', // 필수입력값을 입력해주세요.
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
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });

      this.closePopup();
    },
    btnEditClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000006',
        type: 'success', // success / info / warning / error
      });

      this.closePopup();
    },
    btnRenewClickedCallback(_result) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395',
        message: 'M0000000631', // 개정되었습니다.
        type: 'success', // success / info / warning / error
      });
      this.closePopup();
    },
    closePopup(flag) {
      this.$emit('closePopup', {});
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.$emit('APP_REQUEST_ERROR', _result);
    },
    renewalMode() {
      // 제개정구분이 개정이 되며 개정번호를 수정할 수 있게 된다.
      this.revMode = true;
      this.updateMod = false;
      this.editMode = true;
      this.tempRevNo = this.$_.clone(this.assessType.revNo);
      this.tempRevContents = this.$_.clone(this.assessType.revContents);
    },
    btnEdit() {
      this.editMode = true;
      this.revMode = false;
      this.updateMod = false;
    },
    // 개정 취소 버튼
    cancel() {
      this.revMode = false;
      this.assessType.revNo = this.$_.clone(this.tempRevNo);
      this.assessType.revContents = this.$_.clone(this.tempRevContents);
    },
    riskMatrixAdd(data) {
      this.riskGridOptions.data = data.riskGridOptions;
      this.frequencyGridOptions.data = data.frequencyGridOptions;
      this.strongGridOptions.data = data.strongGridOptions;
    },
  },
};
</script>

<style></style>
