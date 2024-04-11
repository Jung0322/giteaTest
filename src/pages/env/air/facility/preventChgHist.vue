<!--
  목적 : 환경 > 대기 > 시설관리 > 방지시설 > 상세 > 변경관리정보(탭)
  작성자 : jkl
  Detail : 대기 방지시설 변경이력 관리
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 변경이력 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :label="this.$comm.getLangSpecInfoLabel('L0000001232')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :showRowCheckColumn="true"
          @cellClick="tableLinkClicked"
          @btnDeleteClicked="btnDeleteClicked"
        />
      </b-col>
    </b-row>

    <b-row class="mt-3" ref="detailBox" v-if="!tabDisabled">
      <b-col sm="12" class="px-0">
        <b-row>
          <b-col sm="12">
            <!-- 변경이력 등록 -->
            <y-label
              label="L0000001231"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 방지시설명 -->
              <y-text
                :width="8"
                :disabled="true"
                ui="bootstrap"
                label="L0000001117"
                name="eairPreventFacNm"
                v-model="prevention.eairPreventFacNm"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 적용일 -->
              <y-datepicker
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                label="L0000002488"
                name="startYmd"
                v-model="preventChgHist.startYmd"
                v-validate="'required'"
                :state="validateState('startYmd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 처리용량(㎡/min) -->
              <y-number
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000002837"
                name="dispoCap"
                v-model="preventChgHist.dispoCap"
                v-validate="'required'"
                :state="validateState('dispoCap')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 처리농도(mg/S㎥) -->
              <y-number
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000002819"
                name="dispoConc"
                v-model="preventChgHist.dispoConc"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 처리효율(%) -->
              <y-number
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                :maxlength="10"
                :hasSeperator="false"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000002841"
                name="dispoEff"
                v-model="preventChgHist.dispoEff"
                v-validate="'required'"
                :state="validateState('dispoEff')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 처리오염물질 -->
              <y-select
                v-show="false"
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :required="false"
                :comboItems="eairPolluCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="eairPolluCd"
                label="L0000002834"
                v-model="preventChgHist.eairPolluCd"
              />
              <!-- 처리오염물질 -->
              <y-multi-select
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                :needDefaultView="true"
                :comboItems="eairPolluCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002834"
                name="eairPolluCds"
                v-model="preventChgHist.eairPolluCds"
                v-validate="'required'"
                :state="validateState('eairPolluCds')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사용약품 -->
              <y-select
                v-show="false"
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :comboItems="eairChemCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="eairChemCd"
                label="L0000001453"
                v-model="preventChgHist.eairChemCd"
              />
              <!-- 사용약품 -->
              <y-multi-select
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :needDefaultView="true"
                :comboItems="eairChemCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001453"
                name="eairChemCds"
                v-model="preventChgHist.eairChemCds"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 변경사유 -->
              <y-text
                :width="10"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001229"
                name="endCause"
                v-model="preventChgHist.endCause"
                v-validate="'required'"
                :state="validateState('endCause')"
              />
            </b-col>
          </b-row>
          <div class="float-right mt-3">
            <!-- 초기화 -->
            <y-btn
              v-if="editable"
              title="L0000002859"
              @btnClicked="btnClearClickedCallback"
            />
            <!-- 신규등록 -->
            <y-btn
              v-if="editable && !updateMode && !disabled"
              :action-url="insertUrl"
              :param="preventChgHist"
              :is-submit="isCreateSubmit"
              title="L0000001789"
              color="orange"
              action-type="post"
              beforeSubmit="beforeCreateSubmit"
              @beforeCreateSubmit="beforeCreateSubmit"
              @btnClicked="btnCreateClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <!-- 저장 -->
            <y-btn
              v-if="editable && updateMode && !disabled"
              :action-url="editUrl"
              :param="preventChgHist"
              :is-submit="isUpdateSubmit"
              title="L0000002474"
              color="orange"
              action-type="put"
              beforeSubmit="beforeUpdateSubmit"
              @beforeUpdateSubmit="beforeUpdateSubmit"
              @btnClicked="btnUpdateClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'prevent-chg-hist',
  props: {
    selectedEairPreventFacNo: 0,
    selectedTabIndex: 0,
    selectedPlantCd: '',
    tabDisabled: false,
  },
  data() {
    return {
      prevention: {
        eairPreventFacNo: 0,
        eairPreventFacNm: '',
      },
      preventChgHist: {
        eairPreventFacChgHistNo: 0,
        eairPreventFacNo: 0,
        eairPreventFacNm: '',
        eairPreventFacClassCd: null,
        eairPreventFacClassNm: '',
        eairOutletNo: null,
        eairOutletNm: '',
        installPos: '',
        startYmd: '',
        endYmd: '',
        dispoCap: null,
        eairPolluCd: null,
        eairPolluNm: '',
        dispoConc: null,
        dispoEff: null,
        eairChemCd: null,
        eairChemNm: '',
        chemConsum: null,
        endCause: '',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        eairPolluCds: [],
        eairChemCds: [],
      },
      preventChgHistAdd: {
        eairPolluCds: [],
        eairChemCds: [],
      },
      gridOptions: {
        name: 'preventChgHist',
        header: [],
        data: [],
        btns: [],
        height: 250,
      },
      editable: true,
      disabled: false,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,

      eairPolluCdItems: [],
      eairChemCdItems: [],
      selectedValue: [],

      insertUrl: '',
      editUrl: '',
      deleteUrl: '',
      searchUrl: '',
      detailUrl: '',
      preventionDetailUrl: '',
      YAuiGrid: null,
    };
  },
  watch: {
    selectedEairPreventFacNo: function (newValue, oldValue) {
      this.prevention.eairPreventFacNo = this.selectedEairPreventFacNo;
      if (this.prevention.eairPreventFacNo > 0) {
        console.log('zfzf');
        this.disabled = false;
        this.getList();
        this.getPreventionDetail();
      }
    },
    selectedPlantCd: function (newValue, oldValue) {
      // 사용약품
      this.getEairChemCdItems();
    },
    selectedTabIndex: function (newValue, oldValue) {},
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestory() {},
  methods: {
    init() {
      // 처리오염물질
      this.$comm.getComboItems('EAIR_POLLU').then((_result) => {
        this.eairPolluCdItems = _result;
      });
      // 사용약품
      this.getEairChemCdItems();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 적용일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002488'),
          dataField: 'startYmd',
          width: '120',
          style: 'center-align',
        },
        // 처리용량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002836'),
          dataField: 'dispoCap',
          width: '100',
          style: 'right-align',
        },
        // 처리오염물질
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002834'),
          dataField: 'eairPolluNm',
          width: '160',
          style: 'center-align',
        },
        // 처리농도
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002818'),
          dataField: 'dispoConc',
          width: '100',
          style: 'right-align',
        },
        // 처리효율
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003584'),
          dataField: 'dispoEff',
          width: '100',
          style: 'right-align',
        },
        // 사용약품
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001453'),
          dataField: 'eairChemNm',
          width: '160',
          style: 'center-align',
        },
        // 변경사유
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001229'),
          dataField: 'endCause',
          width: '300',
          style: 'center-align',
        },
        // 등록일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000973'),
          dataField: 'createDt',
          width: '120',
          style: 'center-align',
        },
        // 등록자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000976'),
          dataField: 'createUserNm',
          width: '120',
          style: 'center-align',
        },
        // 수정일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001697'),
          dataField: 'updateDt',
          width: '120',
          style: 'center-align',
        },
        // 수정자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001698'),
          dataField: 'updateUserNm',
          width: '120',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'), // 제외
          color: 'red',
          btnClicked: 'btnDeleteClicked',
          visible: this.editable && !this.tabDisabled,
        },
      ];

      this.insertUrl =
        transactionConfig.env.air.facility.preventionChangeHistory.insert.url;
      this.editUrl =
        transactionConfig.env.air.facility.preventionChangeHistory.edit.url;
      this.deleteUrl =
        transactionConfig.env.air.facility.preventionChangeHistory.delete.url;
      this.searchUrl =
        selectConfig.env.air.facility.preventionChangeHistory.list.url;
      this.detailUrl =
        selectConfig.env.air.facility.preventionChangeHistory.get.url;
      this.preventionDetailUrl =
        selectConfig.env.air.facility.preventionN.get.url;

      this.prevention.eairPreventFacNo = this.selectedEairPreventFacNo;
      console.log('a', this.prevention.eairPreventFacNo);
      if (this.prevention.eairPreventFacNo > 0) {
        this.getList();
        this.getPreventionDetail();
      } else {
        this.disabled = false;
      }
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.prevention;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableLinkClicked(data) {
      if (!data) return;
      this.getDetail(data.item);
    },
    getDetail(data) {
      this.$http.url = this.$format(
        this.detailUrl,
        data.eairPreventFacChgHistNo,
        this.prevention.eairPreventFacNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.preventChgHist = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getPreventionDetail() {
      this.$http.url = this.$format(
        this.preventionDetailUrl,
        this.prevention.eairPreventFacNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.prevention = _result.data;
          this.preventChgHist.eairPreventFacNo =
            this.prevention.eairPreventFacNo;
          this.preventChgHist.eairPreventFacNm =
            this.prevention.eairPreventFacNm;
          this.btnClearClickedCallback({});
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEairChemCdItems() {
      this.$http.url = selectConfig.env.air.baseInfo.chemBase.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        plantCd: this.selectedPlantCd,
      };
      this.$http.request(
        (_result) => {
          this.eairChemCdItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    checkDuplicate() {
      var test = {
        startYmd: this.preventChgHist.startYmd,
      };
      var item = this.$_.find(this.gridOptions.data, test);
      if (item != null) {
        if (this.updateMode && this.preventChgHist.startYmd === item.startYmd) {
          return false;
        }
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000313', // '적용일이 중복됩니다.',
          type: 'warning',
        });
        return true;
      }
      return false;
    },
    beforeCreateSubmit() {
      this.preventChgHist.eairPreventFacChgHistNo = 0;
      this.updateMode = false;
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // '저장하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.preventChgHist.createUserId = this.$store.getters.token;
                this.isCreateSubmit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'preventChgHist',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        });
    },
    beforeUpdateSubmit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // '저장하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.preventChgHist.updateUserId = this.$store.getters.token;
                this.isUpdateSubmit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'preventChgHist',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
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
    btnClearClickedCallback(_result) {
      this.updateMode = false;
      Object.assign(
        this.$data.preventChgHist,
        this.$options.data().preventChgHist
      );
      this.$validator.reset();

      this.preventChgHist.eairPreventFacNo = this.prevention.eairPreventFacNo;
      this.preventChgHist.eairPreventFacNm = this.prevention.eairPreventFacNm;
      this.clearDevAttr();
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.updateMode = true;
      this.preventChgHist.eairPreventFacChgHistNo = _result.data;
      this.getList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      this.getList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnDeleteClicked() {
      if (this.YAuiGrid.getCheckedRowItemsAll().length > 0) {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: 'M0000000012', // '삭제하시겠습니까?',
          type: 'info',
          confirmCallback: () => {
            this.$http.url = this.deleteUrl;
            this.$http.type = 'DELETE';
            this.$http.param = {
              data: Object.values(
                this.$_.clone(this.YAuiGrid.getCheckedRowItemsAll())
              ),
            };
            this.$http.request(
              (_result) => {
                this.btnClearClickedCallback({});
                this.getList();
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000007', // '삭제되었습니다.',
                  type: 'success',
                });
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          },
        });
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000310', // '방지시설 변경 정보를 선택하세요.',
          type: 'warning',
        });
      }
    },
    clearDevAttr() {
      // 추가정보 clear
      this.preventChgHist.dispoCap = null;
      this.preventChgHist.dispoConc = null;
      this.preventChgHist.dispoEff = null;
      this.preventChgHist.eairPolluCd = '';
      this.preventChgHist.eairChemCd = '';
      this.preventChgHistAdd.eairPolluCds = [];
      this.preventChgHistAdd.eairChemCds = [];
    },
  },
};
</script>
