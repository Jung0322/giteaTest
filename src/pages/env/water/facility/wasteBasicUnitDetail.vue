<!--
  목적 : 클린센터 
  작성자 : kyk (2021-02-17 수정 etg)
  Detail : 2019.08.14 추가 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="insertBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 클린센터 상세 -->
            <y-label
              label="L0000002990"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="wasteBasicUnitInfo"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="wasteBasicUnitInfo"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="btnClosePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                :required="true"
                :editable="editable"
                :disabled="updateMode"
                name="plantCd"
                v-model="wasteBasicUnitInfo.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관리부서 -->
              <y-tree-dept
                type="edit"
                :editable="editable"
                label="L0000000591"
                :plantCd="wasteBasicUnitInfo.plantCd"
                v-model="wasteBasicUnitInfo.deptCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 시설분류 -->
              <y-select
                type="edit"
                :width="8"
                :editable="editable"
                :comboItems="facilityClassItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000001744"
                name="ewtrCleanFacClassCd"
                v-model="wasteBasicUnitInfo.ewtrCleanFacClassCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrCleanFacClassCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 시설명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001743"
                name="ewtrCleanFacNm"
                v-model="wasteBasicUnitInfo.ewtrCleanFacNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrCleanFacNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 약품구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :comboItems="wtrChemItems"
                itemText="codeNm"
                itemValue="code"
                label="L0000001921"
                ui="bootstrap"
                name="wtrChemRegCd"
                :required="true"
                v-model="wasteBasicUnitInfo.wtrChemRegCd"
                v-validate="'required'"
                :state="validateState('wtrChemRegCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- ERP 코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="25"
                ui="bootstrap"
                label="L0000000111"
                name="sapCode"
                v-model="wasteBasicUnitInfo.sapCode"
              ></y-text>
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
                v-model="wasteBasicUnitInfo.useYn"
              ></y-switch>
              <!-- L0000001440: 사용 -->
              <!-- L0000001063: 미사용 -->
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 비고 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="150"
                ui="bootstrap"
                label="L0000001360"
                name="remark"
                v-model="wasteBasicUnitInfo.remark"
                :rows="2"
              />
            </b-col>
          </b-row>
        </b-card>
        <b-row>
          <!-- 원료 -->
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
            <y-auigrid
              ref="yAuiGrid1"
              :name="ingredientGrid.name"
              :headers="ingredientGrid.header"
              :btns="ingredientGrid.btns"
              :height="ingredientGrid.height"
              :items="ingredientGrid.data"
              :label="this.$comm.getLangSpecInfoLabel('L0000002080')"
              :useExcelExport="false"
              :enableSorting="true"
              :showGridSetSave="false"
              :showRowCheckColumn="true"
              @btnAdd1="btnAdd1"
              @btnDel1="btnDel1"
            />
          </b-col>
          <!-- 약품 -->
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
            <y-auigrid
              ref="yAuiGrid2"
              :name="chemBaseGrid.name"
              :headers="chemBaseGrid.header"
              :btns="chemBaseGrid.btns"
              :height="chemBaseGrid.height"
              :items="chemBaseGrid.data"
              :label="this.$comm.getLangSpecInfoLabel('L0000001915')"
              :useExcelExport="false"
              :enableSorting="true"
              :showGridSetSave="false"
              :showRowCheckColumn="true"
              @btnAdd2="btnAdd2"
              @btnDel2="btnDel2"
            />
          </b-col>
          <!-- 용수(공급수) -->
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
            <y-auigrid
              ref="yAuiGrid3"
              :editable="editable"
              :name="supplyGrid.name"
              :headers="supplyGrid.header"
              :btns="supplyGrid.btns"
              :height="supplyGrid.height"
              :items="supplyGrid.data"
              :label="this.$comm.getLangSpecInfoLabel('L0000002065')"
              :useExcelExport="false"
              :enableSorting="true"
              :showGridSetSave="false"
              :showRowCheckColumn="true"
              @cellEditEnd="cellEditEndHandler3"
              @btnAdd3="btnAdd3"
              @btnDel3="btnDel3"
            />
          </b-col>
          <!-- 수질측정위치 -->
          <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
            <y-auigrid
              ref="yAuiGrid4"
              :name="monPosGrid.name"
              :headers="monPosGrid.header"
              :btns="monPosGrid.btns"
              :height="monPosGrid.height"
              :items="monPosGrid.data"
              :label="this.$comm.getLangSpecInfoLabel('L0000001704')"
              :useExcelExport="false"
              :enableSorting="true"
              :showGridSetSave="false"
              :showRowCheckColumn="true"
              @btnAdd4="btnAdd4"
              @btnDel4="btnDel4"
            />
          </b-col>
          <!-- 폐수(배출수) -->
          <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-4">
            <y-auigrid
              ref="yAuiGrid5"
              :editable="editable"
              :name="dischargeGrid.name"
              :headers="dischargeGrid.header"
              :btns="dischargeGrid.btns"
              :height="dischargeGrid.height"
              :items="dischargeGrid.data"
              :label="this.$comm.getLangSpecInfoLabel('L0000003127')"
              :useExcelExport="false"
              :enableSorting="true"
              :showGridSetSave="false"
              :showRowCheckColumn="true"
              @cellEditEnd="cellEditEndHandler5"
              @btnAdd5="btnAdd5"
              @btnDel5="btnDel5"
            />
          </b-col>
        </b-row>
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
  name: 'prevent-base-detail',
  components: {},
  props: {
    popupParam: {
      type: Object,
      default: {
        ewtrCleanFacNo: 0,
        facilityCd: 0,
        disabled: false,
        plantCd: '',
      },
    },
  },
  data() {
    return {
      wasteBasicUnitInfo: {
        ewtrCleanFacNo: 0,
        ewtrCleanFacNm: null,
        deptCd: null,
        sapCode: '',
        wtrChemRegCd: null,
        ewtrCleanFacClassCd: null,
        plantCd: null,
        wasteBasicUnitFacNm: null,
        remark: '',
        sortOrder: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        createDt: '',
        updateDt: '',
        ingredient: [],
        chemBase: [],
        supply: [],
        discharge: [],
        monPos: [],
      },
      ingredientGrid: {
        name: 'ingredientGrid',
        header: [],
        data: [],
        btns: [],
        height: 200,
      },
      chemBaseGrid: {
        name: 'chemBaseGrid',
        header: [],
        data: [],
        btns: [],
        height: 200,
      },
      supplyGrid: {
        name: 'supplyGrid',
        header: [],
        data: [],
        btns: [],
        height: 200,
      },
      dischargeGrid: {
        name: 'dischargeGrid',
        header: [],
        data: [],
        btns: [],
        height: 200,
      },
      monPosGrid: {
        name: 'monPosGrid',
        header: [],
        data: [],
        btns: [],
        height: 200,
      },
      gridOptions: {
        header: [],
        data: [],
        height: 300,
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
      updateMode: false,
      isInsert: false,
      isEdit: false,
      facilityClassItems: [],
      wtrChemItems: [],
      editUrl: '',
      insertUrl: '',
      editable: true,
      ewtrCleanFacNm: null,

      dischargeCheckItemData: [],
      monPosCheckItemData: [],
      supplyCheckItemData: [],
      ingredientCheckItemData: [],
      chemBaseCheckItemData: [],
      YAuiGrid1: null,
      YAuiGrid2: null,
      YAuiGrid3: null,
      YAuiGrid4: null,
      YAuiGrid5: null,
    };
  },
  watch: {
    // 'wasteBasicUnitInfo.plantCd'() {
    //   if (!this.updateMode) {
    //     this.getIngredientList();
    //     this.getChemBaseList();
    //     this.getSupplyList();
    //     this.getMosPosList();
    //     this.getDischargeList();
    //   }
    // },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid1 = this.$refs.yAuiGrid1;
    this.YAuiGrid2 = this.$refs.yAuiGrid2;
    this.YAuiGrid3 = this.$refs.yAuiGrid3;
    this.YAuiGrid4 = this.$refs.yAuiGrid4;
    this.YAuiGrid5 = this.$refs.yAuiGrid5;
    this.getDetail();
  },
  beforeDestory() {},
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable && !this.popupParam.disabled;
      this.insertUrl =
        transactionConfig.env.water.facility.wasteBasicUnit.insert.url;
      this.editUrl =
        transactionConfig.env.water.facility.wasteBasicUnit.edit.url;

      if (this.popupParam.facilityCd) {
        this.popupParam.ewtrCleanFacNo = this.popupParam.facilityCd;
      }

      this.$comm.getComboItems('EWTR_CLEAN_FAC_CLASS', true).then((_result) => {
        // 시설분류
        this.facilityClassItems = _result;
      });
      this.$comm.getComboItems('EWTR_CHEM_REG', true).then((_result) => {
        // 약품구분
        this.wtrChemItems = _result;
      });

      this.ingredientGrid.header = [
        // 원료명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002088'),
          dataField: 'ewtrIngrNm',
          width: '100%',
          style: 'left-align',
        },
      ];
      this.ingredientGrid.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), // 추가
          color: 'orange',
          btnClicked: 'btnAdd1',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), // 삭제
          color: 'red',
          btnClicked: 'btnDel1',
        },
      ];

      this.chemBaseGrid.header = [
        // 약품명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001922'),
          dataField: 'ewtrChemNm',
          width: '50%',
          style: 'left-align',
        },
        // 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'envUnitNm',
          width: '50%',
          style: 'left-align',
        },
      ];
      this.chemBaseGrid.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), // 추가
          color: 'orange',
          btnClicked: 'btnAdd2',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), // 삭제
          color: 'red',
          btnClicked: 'btnDel2',
        },
      ];

      this.supplyGrid.header = [
        // 용수분류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002068'),
          dataField: 'ewtrSuplClassNm',
          width: '33%',
          style: 'left-align',
          editable: false,
        },
        // 용수명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002067'),
          dataField: 'ewtrSuplNm',
          width: '33%',
          style: 'left-align',
          editable: false,
        },
        // ERP 코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000111'),
          dataField: 'sapCode',
          width: '34%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        },
      ];
      this.supplyGrid.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), // 추가
          color: 'orange',
          btnClicked: 'btnAdd3',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), // 삭제
          color: 'red',
          btnClicked: 'btnDel3',
        },
      ];

      this.dischargeGrid.header = [
        // 폐수분류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003133'),
          dataField: 'ewtrDischClassNm',
          width: '33%',
          style: 'left-align',
          editable: false,
        },
        // 폐수명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003128'),
          dataField: 'ewtrDischNm',
          width: '33%',
          style: 'left-align',
          editable: false,
        },
        // 전력계일련번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002505'),
          dataField: 'pwrMeterCode',
          width: '34%',
          style: 'left-align',
          editRenderer: {
            type: 'InputEditRenderer',
          },
        },
      ];
      this.dischargeGrid.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), // 추가
          color: 'orange',
          btnClicked: 'btnAdd5',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), // 삭제
          color: 'red',
          btnClicked: 'btnDel5',
        },
      ];

      this.monPosGrid.header = [
        // 지점명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002763'),
          dataField: 'ewtrMonPosNm',
          width: '50%',
          style: 'left-align',
        },
        // 관리부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'deptNm',
          width: '50%',
          style: 'left-align',
        },
      ];
      this.monPosGrid.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), // 추가
          color: 'orange',
          btnClicked: 'btnAdd4',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), // 삭제
          color: 'red',
          btnClicked: 'btnDel4',
        },
      ];

      if (this.popupParam.ewtrCleanFacNo !== 0) {
        this.wasteBasicUnitInfo.plantCd = this.popupParam.plantCd;
      }
      // this.getIngredientList();
      // this.getChemBaseList();
      // this.getSupplyList();
      // this.getMosPosList();
      // this.getDischargeList();

      setTimeout(() => {
        this.getDetail();
      }, 500);
    },
    getDetail() {
      if (this.popupParam.ewtrCleanFacNo === 0) return;
      this.$http.url = this.$format(
        selectConfig.env.water.facility.wasteBasicUnit.get.url,
        this.popupParam.ewtrCleanFacNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.wasteBasicUnitInfo = this.$_.clone(_result.data);
          this.dischargeGrid.data = _result.data.discharge;
          this.monPosGrid.data = _result.data.monPos;
          this.supplyGrid.data = _result.data.supply;
          this.ingredientGrid.data = _result.data.ingredient;
          this.chemBaseGrid.data = _result.data.chemBase;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // getIngredientList() {
    //   this.$http.url = selectConfig.env.water.baseInfo.ingredient.list.url;
    //   this.$http.type = 'GET';
    //   this.$http.param = {
    //     plantCd: this.wasteBasicUnitInfo.plantCd,
    //     useYn: 'Y',
    //   };
    //   this.$http.request(
    //     _result => {
    //       this.ingredientGrid.data = this.$_.clone(_result.data);
    //     },
    //     _error => {
    //       window.getApp.$emit('APP_REQUEST_ERROR', _error);
    //     }
    //   );
    // },
    // getChemBaseList() {
    //   this.$http.url = selectConfig.env.water.baseInfo.chemical.list.url;
    //   this.$http.type = 'GET';
    //   this.$http.param = {
    //     plantCd: this.wasteBasicUnitInfo.plantCd,
    //     useYn: 'Y',
    //   };
    //   this.$http.request(
    //     _result => {
    //       this.chemBaseGrid.data = this.$_.clone(_result.data);
    //     },
    //     _error => {
    //       window.getApp.$emit('APP_REQUEST_ERROR', _error);
    //     }
    //   );
    // },
    // getSupplyList() {
    //   this.$http.url = selectConfig.env.water.baseInfo.supply.list.url;
    //   this.$http.type = 'GET';
    //   this.$http.param = {
    //     ewtrCleanFacNo: this.popupParam.ewtrCleanFacNo,
    //     plantCd: this.wasteBasicUnitInfo.plantCd,
    //     useYn: 'Y',
    //   };
    //   this.$http.request(
    //     _result => {
    //       this.supplyGrid.data = this.$_.clone(_result.data);
    //     },
    //     _error => {
    //       window.getApp.$emit('APP_REQUEST_ERROR', _error);
    //     }
    //   );
    // },
    // getDischargeList() {
    //   this.$http.url = selectConfig.env.water.baseInfo.discharge.list.url;
    //   this.$http.type = 'GET';
    //   this.$http.param = {
    //     ewtrCleanFacNo: this.popupParam.ewtrCleanFacNo,
    //     plantCd: this.wasteBasicUnitInfo.plantCd,
    //     useYn: 'Y',
    //   };
    //   this.$http.request(
    //     _result => {
    //       this.dischargeGrid.data = this.$_.clone(_result.data);
    //     },
    //     _error => {
    //       window.getApp.$emit('APP_REQUEST_ERROR', _error);
    //     }
    //   );
    // },
    // getMosPosList() {
    //   this.$http.url = selectConfig.env.water.baseInfo.monPos.list.url;
    //   this.$http.type = 'GET';
    //   this.$http.param = {
    //     plantCd: this.wasteBasicUnitInfo.plantCd,
    //     useYn: 'Y',
    //   };
    //   this.$http.request(
    //     _result => {
    //       this.monPosGrid.data = this.$_.clone(_result.data);
    //     },
    //     _error => {
    //       window.getApp.$emit('APP_REQUEST_ERROR', _error);
    //     }
    //   );
    // },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    beforeInsert() {
      this.updateMode = false;
      this.$http.url = selectConfig.env.water.facility.wasteBasicUnit.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrCleanFacNo: this.popupParam.ewtrCleanFacNo,
        plantCd: this.wasteBasicUnitInfo.plantCd,
        ewtrCleanFacNm: this.wasteBasicUnitInfo.ewtrCleanFacNm,
      };
      this.$http.request(
        (_result) => {
          if (_result.data === 0) {
            this.$validator
              .validateAll()
              .then((_result) => {
                if (_result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.wasteBasicUnitInfo.createUserId =
                        this.$store.getters.token;
                      this.wasteBasicUnitInfo.ingredient =
                        this.ingredientGrid.data;
                      this.wasteBasicUnitInfo.chemBase = this.chemBaseGrid.data;
                      this.wasteBasicUnitInfo.supply = this.supplyGrid.data;
                      this.wasteBasicUnitInfo.discharge =
                        this.dischargeGrid.data;
                      this.wasteBasicUnitInfo.monPos = this.monPosGrid.data;
                      this.isInsert = true;
                    },
                  });
                } else if (!_result) {
                  this.$popupRequired.check(
                    'wasteBasicUnitDetail',
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
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000395', // '이미 입력된 사업장에 같은 시설명이 존재합니다.',
              type: 'warning',
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeEdit() {
      this.$http.url = selectConfig.env.water.facility.wasteBasicUnit.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrCleanFacNo: this.popupParam.ewtrCleanFacNo,
        plantCd: this.wasteBasicUnitInfo.plantCd,
        ewtrCleanFacNm: this.wasteBasicUnitInfo.ewtrCleanFacNm,
      };
      this.$http.request(
        (_result) => {
          if (_result.data === 0) {
            this.$validator
              .validateAll()
              .then((_result) => {
                if (_result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.wasteBasicUnitInfo.updateUserId =
                        this.$store.getters.token;
                      this.wasteBasicUnitInfo.ingredient =
                        this.ingredientGrid.data;
                      this.wasteBasicUnitInfo.chemBase = this.chemBaseGrid.data;
                      // this.wasteBasicUnitInfo.supply = this.supplyGrid.data;
                      // this.wasteBasicUnitInfo.discharge = this.dischargeGrid.data;
                      this.wasteBasicUnitInfo.monPos = this.monPosGrid.data;
                      this.isEdit = true;
                    },
                  });
                } else if (!_result) {
                  this.$popupRequired.check(
                    'wasteBasicUnitDetail',
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
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000395', // '이미 입력된 사업장에 같은 시설명이 존재합니다.',
              type: 'warning',
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnInsertClickedCallback(_result) {
      this.popupParam.ewtrCleanFacNo = _result.data;
      this.isInsert = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
      this.getDetail();
    },
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    tabClick(tab) {
      var nowDate = new Date();
      this.paneName = tab.paneName + nowDate.getMilliseconds();
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    cellEditEndHandler3() {
      this.wasteBasicUnitInfo.supply = this.YAuiGrid3.getGridData();
    },
    cellEditEndHandler5() {
      this.wasteBasicUnitInfo.discharge = this.YAuiGrid5.getGridData();
    },
    // 2022-03-15 추가삭제 기능추가
    btnAdd1() {
      this.btnAdd('ingredient');
    },
    btnAdd2() {
      this.btnAdd('chemBase');
    },
    btnAdd3() {
      this.btnAdd('supply');
    },
    btnAdd4() {
      this.btnAdd('monPos');
    },
    btnAdd5() {
      this.btnAdd('discharge');
    },
    btnAdd(gubun) {
      let title;
      let vueFile;
      switch (gubun) {
        case 'ingredient':
          vueFile = import(`${'@/pages/env/water/ingrChem/ingredient.vue'}`);
          title = 'L0000004424'; // 원료 추가
          break;
        case 'chemBase':
          vueFile = import(`${'@/pages/env/water/ingrChem/chemBase.vue'}`);
          title = 'L0000004425'; // 약품 추가
          break;
        case 'supply':
          vueFile = import(`${'@/pages/env/water/baseInfo/supply.vue'}`);
          title = 'L0000004426'; // 용수(공급수) 추가
          break;
        case 'monPos':
          vueFile = import(`${'@/pages/env/water/baseInfo/monPos.vue'}`);
          title = 'L0000004427'; // 수질측정위치 추가
          break;
        case 'discharge':
          vueFile = import(`${'@/pages/env/water/baseInfo/discharge.vue'}`);
          title = 'L0000004428'; // 폐수(배출수) 추가
          break;
      }

      this.popupOptions.target = () => vueFile;
      this.popupOptions.title = title;
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        plantCd: this.wasteBasicUnitInfo.plantCd,
        popMode: true,
      };
      this.popupOptions.top = '10px';
      this.popupOptions.width = '60%';
      this.popupOptions.closeCallback = this.closeAddPopup;
    },

    closeAddPopup(data, gubun) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      let idx;
      if (data) {
        this.$_.forEach(data, (item) => {
          switch (gubun) {
            case 'ingredient':
              idx = this.$_.indexOf(
                this.$_.map(this.ingredientGrid.data, 'ewtrIngrNm'),
                item.ewtrIngrNm
              );
              if (idx < 0) {
                this.ingredientGrid.data.push({
                  ewtrIngrNo: item.ewtrIngrNo,
                  ewtrIngrNm: item.ewtrIngrNm,
                });
              }
              break;
            case 'chemBase':
              idx = this.$_.indexOf(
                this.$_.map(this.chemBaseGrid.data, 'ewtrChemNm'),
                item.ewtrChemNm
              );
              if (idx < 0) {
                this.chemBaseGrid.data.push({
                  ewtrChemNo: item.ewtrChemNo,
                  ewtrChemNm: item.ewtrChemNm,
                  envUnitCd: item.envUnitCd,
                  envUnitNm: item.envUnitNm,
                });
              }
              break;
            case 'supply':
              idx = this.$_.indexOf(
                this.$_.map(this.supplyGrid.data, 'ewtrSuplNm'),
                item.ewtrSuplNm
              );
              if (idx < 0) {
                this.supplyGrid.data.push({
                  ewtrSuplClassNo: item.ewtrSuplClassNo,
                  ewtrSuplClassNm: item.ewtrSuplClassNm,
                  ewtrSuplNo: item.ewtrSuplNo,
                  ewtrSuplNm: item.ewtrSuplNm,
                });
              }
              break;
            case 'monPos':
              idx = this.$_.indexOf(
                this.$_.map(this.monPosGrid.data, 'ewtrMonPosNm'),
                item.ewtrMonPosNm
              );
              if (idx < 0) {
                this.monPosGrid.data.push({
                  ewtrMonPosNo: item.ewtrMonPosNo,
                  ewtrMonPosNm: item.ewtrMonPosNm,
                  deptCd: item.deptCd,
                  deptNm: item.deptNm,
                });
              }
              break;
            case 'discharge':
              idx = this.$_.indexOf(
                this.$_.map(this.dischargeGrid.data, 'ewtrDischNm'),
                item.ewtrDischNm
              );
              if (idx < 0) {
                this.dischargeGrid.data.push({
                  ewtrDischClassNo: item.ewtrDischClassNo,
                  ewtrDischClassNm: item.ewtrDischClassNm,
                  ewtrDischNo: item.ewtrDischNo,
                  ewtrDischNm: item.ewtrDischNm,
                  pwrMeterCode: '',
                });
              }
              break;
          }
        });
      }
    },

    btnDel1() {
      if (this.YAuiGrid1.getCheckedRowItemsAll() >= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000160', // '제외할 항목을 선택하세요.',
          type: 'warning',
        });
        return;
      }
      this.btnDel('ingredient', this.YAuiGrid1.getCheckedRowItemsAll());
    },
    btnDel2() {
      if (this.YAuiGrid2.getCheckedRowItemsAll() >= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000160', // '제외할 항목을 선택하세요.',
          type: 'warning',
        });
        return;
      }
      this.btnDel('chemBase', this.YAuiGrid2.getCheckedRowItemsAll());
    },
    btnDel3() {
      if (this.YAuiGrid3.getCheckedRowItemsAll() >= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000160', // '제외할 항목을 선택하세요.',
          type: 'warning',
        });
        return;
      }
      this.btnDel('supply', this.YAuiGrid3.getCheckedRowItemsAll());
    },
    btnDel4() {
      if (this.YAuiGrid4.getCheckedRowItemsAll() >= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000160', // '제외할 항목을 선택하세요.',
          type: 'warning',
        });
        return;
      }
      this.btnDel('monPos', this.YAuiGrid4.getCheckedRowItemsAll());
    },
    btnDel5() {
      if (this.YAuiGrid5.getCheckedRowItemsAll() >= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000160', // '제외할 항목을 선택하세요.',
          type: 'warning',
        });
        return;
      }
      this.btnDel('discharge', this.YAuiGrid5.getCheckedRowItemsAll());
    },
    btnDel(gubun, checkItem) {
      let idx;
      this.$_.forEach(checkItem, (item) => {
        switch (gubun) {
          case 'ingredient':
            idx = this.$_.indexOf(
              this.$_.map(this.ingredientGrid.data, 'ewtrIngrNm'),
              item.ewtrIngrNm
            );
            this.ingredientGrid.data.splice(idx, 1);
            break;
          case 'chemBase':
            idx = this.$_.indexOf(
              this.$_.map(this.chemBaseGrid.data, 'ewtrChemNm'),
              item.ewtrChemNm
            );
            this.chemBaseGrid.data.splice(idx, 1);
            break;
          case 'supply':
            idx = this.$_.indexOf(
              this.$_.map(this.supplyGrid.data, 'ewtrSuplNm'),
              item.ewtrSuplNm
            );
            this.supplyGrid.data.splice(idx, 1);
            break;
          case 'monPos':
            idx = this.$_.indexOf(
              this.$_.map(this.monPosGrid.data, 'ewtrMonPosNm'),
              item.ewtrMonPosNm
            );
            this.monPosGrid.data.splice(idx, 1);
            break;
          case 'discharge':
            idx = this.$_.indexOf(
              this.$_.map(this.dischargeGrid.data, 'ewtrDischNm'),
              item.ewtrDischNm
            );
            this.dischargeGrid.data.splice(idx, 1);
            break;
        }
      });
    },
  },
};
</script>
