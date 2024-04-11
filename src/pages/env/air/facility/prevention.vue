<!--
  목적 : 환경 > 대기 > 시설관리 > 방지시설 > 상세 > 기본정보(탭)
  작성자 : psb
  Detail : 대기 방지시설 관리
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="py-0">
      <b-col sm="12" class="px-0">
        <b-row>
          <b-col sm="12">
            <!-- 기본정보 -->
            <y-label
              label="L0000000776"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable"
                :action-url="saveUrl"
                :param="prevention"
                :is-submit="isSave"
                title="L0000002474"
                color="orange"
                :action-type="actionType"
                beforeSubmit="beforeSave"
                @beforeSave="beforeSave"
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
                name="plantCd"
                v-model="prevention.plantCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관리부서 -->
              <y-tree-dept
                :editable="editable"
                type="edit"
                label="L0000000591"
                name="mgDeptCd"
                v-model="prevention.mgDeptCd"
                :plantCd="prevention.plantCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('mgDeptCd')"
              />
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 방지시설분류 -->
              <y-select
                :width="8"
                :editable="editable"
                :required="true"
                :comboItems="eairPreventFacClassCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="eairPreventFacClassCd"
                label="L0000001118"
                v-model="prevention.eairPreventFacClassCd"
                v-validate="'required'"
                :state="validateState('eairPreventFacClassCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 방지시설명 -->
              <y-text
                :width="8"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001117"
                name="eairPreventFacNm"
                v-model="prevention.eairPreventFacNm"
                v-validate="'required'"
                :state="validateState('eairPreventFacNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 방지시설일련번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001119"
                name="eairPreventFacNum"
                v-model="prevention.eairPreventFacNum"
                :required="true"
                v-validate="'required'"
                :state="validateState('eairPreventFacNum')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 고유방지시설번호 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000477"
                name="eairPreventFacInhNum"
                v-model="prevention.eairPreventFacInhNum"
                :required="true"
                v-validate="'required'"
                :state="validateState('eairPreventFacInhNum')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- ERP 코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000000111"
                name="sapCd"
                v-model="prevention.sapCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 설치위치 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001626"
                name="installPos"
                v-model="prevention.installPos"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="prevention.useYn"
              />
              <!-- L0000001440: 사용 -->
              <!-- L0000001063: 미사용 -->
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 연결배출시설 -->
              <y-multi-select
                :width="8"
                :editable="editable"
                :needDefaultView="true"
                :comboItems="dischFacItems"
                itemText="eairDischFacNm"
                itemValue="eairDischFacNo"
                ui="bootstrap"
                label="L0000004200"
                name="outletDischItem"
                v-model="prevention.outletDischItem"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- SEMS대상여부 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="semsTargetYnItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000004221"
                name="semsYn"
                v-model="prevention.semsYn"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="200"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="prevention.remark"
              />
            </b-col>
            <!-- 전력량계 목록 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-auigrid
                ref="yAuiGrid"
                :editable="this.editable"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :items="gridOptions.data"
                :label="this.$comm.getLangSpecInfoLabel('L0000002506')"
                :useExcelExport="false"
                :enableSorting="true"
                :showGridSetSave="true"
                :showRowCheckColumn="true"
                @btnAddClickedCallback="btnAddClickedCallback"
                @btnReject="btnReject"
                @cellEditEnd="cellEditEndHandler"
              />
            </b-col>
            <b-col sm="12" class="mt-3">
              <!-- 변경관리정보 -->
              <y-label label="L0000001225" color-class="cutstom-title-color" />
              <div
                slot="buttonGroup"
                class="float-right mb-1"
                v-if="!tabDisabled"
              >
                <y-label label="*" />
                <!-- 변경관리정보 -->
                <y-label
                  label="L0000001225"
                  color-class="cutstom-title-color"
                />
                <!-- 의 경우 최초등록만 가능하며 추후 -->
                <y-label label="L0000005562" />
                <!-- [변경관리정보] 탭에서 이력을 관리 -->
                <y-label
                  label="L0000005563"
                  color-class="cutstom-title-color"
                />
                <!-- 할 수 있습니다. -->
                <y-label label="L0000005564" />
              </div>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 처리용량(㎡/min) -->
              <y-number
                :width="8"
                :editable="editable"
                :required="!updateMode"
                :disabled="updateMode"
                :maxlength="10"
                :hasSeperator="true"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000002837"
                name="dispoCap"
                v-model="preventChgHist.dispoCap"
                v-validate="updateMode ? '' : 'required'"
                :state="updateMode ? '' : validateState('dispoCap')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 처리농도(mg/S㎥) -->
              <y-number
                :width="8"
                :editable="editable"
                :required="!updateMode"
                :disabled="updateMode"
                :maxlength="10"
                :hasSeperator="true"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000002819"
                name="dispoConc"
                v-model="preventChgHist.dispoConc"
                v-validate="updateMode ? '' : 'required'"
                :state="updateMode ? '' : validateState('dispoConc')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 처리효율(%) -->
              <y-number
                :width="8"
                :editable="editable"
                :required="!updateMode"
                :disabled="updateMode"
                :maxlength="10"
                :hasSeperator="true"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000002841"
                name="dispoEff"
                v-model="preventChgHist.dispoEff"
                v-validate="updateMode ? '' : 'required'"
                :state="updateMode ? '' : validateState('dispoEff')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 처리오염물질 -->
              <y-multi-select
                :width="8"
                :editable="editable"
                :required="!updateMode"
                :disabled="updateMode"
                :needDefaultView="true"
                :comboItems="eairPolluCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002834"
                name="eairPolluCds"
                v-model="preventChgHist.eairPolluCds"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사용약품 -->
              <y-multi-select
                :width="8"
                :editable="editable"
                :disabled="updateMode"
                :needDefaultView="true"
                :comboItems="eairChemCdItems"
                itemText="eairChemNm"
                itemValue="eairChemCd"
                ui="bootstrap"
                label="L0000001453"
                name="eairChemCds"
                v-model="preventChgHist.eairChemCds"
              />
            </b-col>
          </b-row>
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
  name: 'prevention',
  props: {
    selectedEairPreventFacNo: 0,
    selectedTabIndex: 0,
    tabDisabled: false,
  },
  data() {
    return {
      // 방지시설 기본정보
      prevention: {
        eairPreventFacNo: 0,
        eairPreventFacNm: '', // 방지시설명
        eairPreventFacNum: '', // 방지시설일련번호
        eairPreventFacInhNum: '', // 고유방지시설번호
        eairPreventFacClassCd: null, // 방지시설분류
        eairPreventFacClassNm: '',
        eairOutletNo: null,
        eairOutletNm: '',
        installPos: '', // 설치위치
        sortOrder: null,
        useYn: 'Y',
        plantCd: '', // 사업장코드
        deptCd: '', // 일지작성부서
        mgDeptCd: '', // 관리부서
        remark: '',
        sapCd: '', // SAP(ERP)코드

        facConnStruNm: null,

        prevFacElecMeter: [], // 전력량계 목록
        createUserId: '',
        updateUserId: '',
        outletDischItem: [], // 연결배출시설
        semsYn: null,
      },
      preventionAdd: {
        deptCd: '', // 관리부서 추가
        remark: '', // 비고 추가
      },
      gridOptions: {
        name: 'prevention',
        header: [],
        data: [],
        btns: [],
        height: 250,
      },
      // 변경관리정보
      preventChgHist: {
        eairPreventFacChgHistNo: 0,
        eairPreventFacNo: 0,
        eairPreventFacNum: null,
        eairPreventFacInhNum: null,
        eairPreventFacNm: '',
        eairPreventFacClassCd: null,
        eairPreventFacClassNm: '',
        eairOutletNo: null,
        eairOutletNm: '',
        installPos: '',
        startYmd: '',
        endYmd: '',
        dispoCap: null,
        eairPolluCd: '',
        eairPolluNm: '',
        dispoConc: null,
        dispoEff: null,
        eairChemCd: '',
        eairChemNm: '',

        chemConsum: null,
        endCause: '',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        eairPolluCds: [],
        eairChemCds: [],
      },
      editable: false,
      updateMode: false,
      isSave: false,

      preventEditable: false,

      selectedValue: [],
      eairPreventFacClassCdItems: [],
      prevFacElecMeter: [],
      eairPolluCdItems: [],
      eairChemCdItems: [], // 사용약품
      totalData: [],

      dischFacItems: [], // 연결배출시설

      saveUrl: '',
      detailUrl: '',
      checkUrl: '',
      actionType: 'POST',

      gridIndex: 0,

      inhNumValid: true,
      semsTargetYnItems: [], // SEMS 대상여부 콤보 아이템
      YAuiGrid: null,
    };
  },
  watch: {
    selectedEairPreventFacNo: function (newValue, oldValue) {
      this.prevention.eairPreventFacNo = this.selectedEairPreventFacNo;
      if (this.prevention.eairPreventFacNo > 0) {
        this.getDetail();
      }
    },
    selectedTabIndex: function (newValue, oldValue) {},

    'prevention.plantCd': function (newValue, oldValue) {
      this.getEairChemCdItems(); // 사용약품
      this.getDischFacItems(); // 연결 배출시설
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.editable = this.$route.meta.editable && !this.tabDisabled;
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestory() {},
  methods: {
    init() {
      this.getEairChemCdItems(); // 사용약품
      this.getDischFacItems(); // 연결 배출시설
      this.setGrigHeader();
      this.setGridBtn();

      // 방지시설분류
      this.$comm
        .getComboItems('EAIR_PREVENT_FAC_CLASS', false)
        .then((_result) => {
          this.eairPreventFacClassCdItems = _result;
        });

      // 처리오염물질
      this.$comm.getComboItems('EAIR_POLLU', false).then((_result) => {
        this.eairPolluCdItems = _result;
      });

      // SEMS대상여부
      this.semsTargetYnItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000003394') }, // '선택하세요'
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003213') }, // 해당
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001065') }, // 미해당
      ];

      this.detailUrl = selectConfig.env.air.facility.preventionN.get.url;
      this.checkUrl = selectConfig.env.air.facility.preventionN.check.url;
      this.checkInhNumUrl =
        selectConfig.env.air.facility.preventionN.checkInhNum.url;
      console.log('d', this.selectedEairPreventFacNo);
      if (this.selectedEairPreventFacNo > 0) {
        this.getDetail();
      }
    },
    setGrigHeader() {
      this.gridOptions.header = [
        // ERP 코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000111'),
          dataField: 'sapCd',
          width: '25%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 50,
          },
        },
        // 전력량계명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002510'),
          dataField: 'eairPreventFacElecMeterNm',
          width: '25%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
            maxlength: 50,
          },
        },
        // 배율
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001136'),
          dataField: 'pwrMeterMagn',
          width: '25%',
          style: 'right-align',
          dataType: 'numeric',
          formatString: '#,##0',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 10,
            autoThousandSeparator: true,
          },
        },
        // 사용여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYn',
          width: '25%',
          style: 'center-align',
          renderer: {
            type: 'CheckBoxEditRenderer',
            editable: this.editable,
            checkValue: 'Y',
            unCheckValue: 'N',
            checkableFunction: function (
              rowIndex,
              columnIndex,
              value,
              isChecked,
              item,
              dataField
            ) {
              return true;
            },
          },
        },
      ];
    },
    setGridBtn() {
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), // 추가
          color: 'blue',
          btnClicked: 'btnAddClickedCallback',
          visible: this.editable,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'), // 제외
          color: 'red',
          btnClicked: 'btnReject',
          visible: this.gridOptions.data.length > 0 && this.editable,
        },
      ];
    },

    getDischFacItems() {
      this.$http.url = selectConfig.env.air.facility.dischargeN.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        plantCd: this.prevention.plantCd,
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.dischFacItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.selectedEairPreventFacNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.prevention = this.$_.clone(_result.data);
          this.gridOptions.data = _result.data.prevFacElecMeter;
          this.getChgHistDetail();
          this.setGridBtn();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getChgHistDetail() {
      this.$http.url = this.$format(
        selectConfig.env.air.facility.preventionChangeHistory.get.url,
        0,
        this.prevention.eairPreventFacNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.preventChgHist = _result.data;
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
        plantCd: this.prevention.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.eairChemCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
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
    beforeSave() {
      let flag = '';
      if (this.updateMode) {
        // 수정
        flag = 'update';
        this.actionType = 'PUT';
        this.saveUrl = transactionConfig.env.air.facility.prevention.edit.url;
      } else {
        // 신규등록
        flag = 'insert';
        this.actionType = 'POST';
        this.saveUrl = transactionConfig.env.air.facility.prevention.insert.url;
      }
      this.$_.forEach(this.gridOptions.data, (row) => {
        if (!row.eairPreventFacElecMeterNm) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000314', // '전력량계명을 입력하세요.',
            type: 'warning', // success / info / warning / error
          });
          return false;
        }
      });
      this.checkInhNum(flag);
    },
    checkInhNum(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (this.preventChgHist.eairPolluCds.length === 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000001408', // '처리오염물질을 선택해주세요.',
                type: 'warning',
              });
              return;
            }
            this.$http.url = this.checkInhNumUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              eairPreventFacInhNum: this.prevention.eairPreventFacInhNum,
              eairPreventFacNo:
                flag === 'insert' ? 0 : this.prevention.eairPreventFacNo,
            };
            this.$http.request(
              (_result) => {
                if (_result.data > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'L0000005565', // '이미 같은 고유방지시설번호가 존재합니다.',
                    type: 'warning',
                  });
                  this.inhNumValid = false;
                  return;
                } else {
                  this.inhNumValid = true;
                  this.check(flag);
                  return;
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else if (!_result) {
            this.$popupRequired.check('prevention', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // 유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        });
    },
    check(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            if (this.preventChgHist.eairPolluCds.length === 0) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: '처리오염물질을 선택해주세요.',
                type: 'warning',
              });
              return;
            }
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              eairPreventFacNo:
                flag === 'insert' ? 0 : this.prevention.eairPreventFacNo,
              eairPreventFacNm: this.prevention.eairPreventFacNm,
              plantCd: this.prevention.plantCd,
            };
            this.$http.request(
              (_result) => {
                if (_result.data > 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000393', // '이미 같은 이름의 방지시설명이 존재합니다.',
                    type: 'warning',
                  });
                  return;
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      if (flag === 'insert') {
                        // this.prevention.prevFacElecMeter = this.gridOptions.data;
                        this.prevention.createUserId =
                          this.$store.getters.token;
                        this.preventChgHist.createUserId =
                          this.$store.getters.token;
                      } else {
                        // this.prevention.prevFacElecMeter = this.gridOptions.data;
                        this.prevention.updateUserId =
                          this.$store.getters.token;
                        // this.preventChgHist.createUserId = this.$store.getters.token;
                      }
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
          } else if (!_result) {
            this.$popupRequired.check('prevention', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // 유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        });
    },
    btnSaveClickedCallback(_result) {
      this.isSave = false;
      this.updateMode = true;
      this.prevention.eairPreventFacNo = _result.data;

      if (_result.data > 0 && this.actionType === 'POST') {
        this.preventChgHist.eairPreventFacNo = _result.data;
        this.preventChgHist.startYmd = this.$comm.moment().format('YYYY-MM-DD');
        this.preventChgHist.createUserId = this.$store.getters.token;
        this.$http.url =
          transactionConfig.env.air.facility.preventionChangeHistory.insert.url;
        this.$http.type = 'POST';
        this.$http.param = this.preventChgHist;
        this.$http.request(
          (__result) => {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000006', // '저장되었습니다.',
              type: 'success',
            });
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
          }
        );
      } else {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000006', // '저장되었습니다.',
          type: 'success',
        });
      }
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnAddClickedCallback() {
      this.gridIndex = this.gridIndex + 1;
      this.gridOptions.data.splice(0, 0, {
        eairPreventFacElecMeterNo: this.gridIndex,
        sapCd: '',
        eairPreventFacElecMeterNm: '',
        pwrMeterMagn: 0,
        useYn: 'Y',
      });
      this.setGridBtn();
    },
    btnReject() {
      if (this.YAuiGrid.getCheckedRowItems().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000160', // '제외할 항목을 선택하세요.',
          type: 'warning',
        });
      } else {
        let gridData = this.YAuiGrid.getGridData();
        const selectedRows = this.YAuiGrid.getCheckedRowItems().map(
          (row) => row.item
        );
        this.$_.forEach(selectedRows, (item) => {
          gridData = this.$_.reject(gridData, item);
        });

        this.gridOptions.data = gridData;
        this.YAuiGrid.setGridData(gridData);
        this.cellEditEndHandler();

        if (this.YAuiGrid.getRowCount() === 0) {
          this.setGridBtn();
        }
      }
    },
    cellEditEndHandler() {
      this.prevention.prevFacElecMeter = this.YAuiGrid.getGridData();
    },
  },
};
</script>
