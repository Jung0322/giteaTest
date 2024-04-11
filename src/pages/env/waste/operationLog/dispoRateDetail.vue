<!--
  목적 : 폐기물-부서별분배율
  작성자 : SB
  Detail : 부서별분배율 상세,등록, 수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 부서별 분배율 등록 -->
            <y-label
              label="L0000001318"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="ingredient"
                :is-submit="isUpdateSubmit"
                title="L0000002474"
                color="orange"
                action-type="put"
                beforeSubmit="beforeUpdateSubmit"
                @beforeUpdateSubmit="beforeUpdateSubmit"
                @btnClicked="btnUpdateClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="ingredient"
                :is-submit="isCreateSubmit"
                title="L0000002474"
                color="orange"
                action-type="post"
                beforeSubmit="beforeCreateSubmit"
                @beforeCreateSubmit="beforeCreateSubmit"
                @btnClicked="btnCreateClickedCallback"
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
                name="plantCd"
                v-model="ingredient.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
                @datachange="
                  (val) => {
                    (ingredient.plantCd = val), getEwstWasteNoItems();
                  }
                "
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 연도 -->
              <y-datepicker
                :width="8"
                type="year"
                label="L0000001991"
                name="year"
                v-model="ingredient.year"
                :required="true"
                v-validate="'required'"
                :state="validateState('year')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 폐기물 분류 -->
              <y-select
                :width="8"
                :comboItems="ewstClassCdItems"
                itemText="ewstClassNm"
                itemValue="ewstClassCd"
                ui="bootstrap"
                label="L0000003106"
                name="ewstClassCd"
                v-model="ingredient.ewstClassCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewstClassCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 폐기물 -->
              <y-select
                :width="8"
                :comboItems="ewstWasteCdItems"
                itemText="ewstWasteNm"
                itemValue="ewstWasteNo"
                ui="bootstrap"
                label="L0000003102"
                name="ewstWasteNo"
                v-model="ingredient.ewstWasteNo"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewstWasteNo')"
              ></y-select>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="this.editable"
          :name="gridRateOptions.name"
          :headers="gridRateOptions.header"
          :btns="gridRateOptions.btns"
          :height="gridRateOptions.height"
          :items="gridRateOptions.data"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="false"
          @cellEditEnd="cellEditEndHandler"
        />
      </b-col>
    </b-row>

    <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <y-data-table
            id="test"
            ref="dataTable"
            :height="gridRateSumOptions.height"
            :headers="gridRateSumOptions.header"
            :items="gridRateSumOptions.data"
            :useRownum="false"
            v-model="selectedRateValue"
            @selectedRow="changeSelectedRow"
            minHeight="28px"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'dispo-rate-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ewstWasteRateNo: 0,
        plantCd: '',
      },
    },
  },
  data() {
    return {
      ingredient: {
        eairIngrCd: null,
        eairIngrNm: null,
        envUnitCd: null,
        envUniNm: null,
        remark: '',
        ewstClassCd: null,
        ewstWasteNo: null,
        sortOrder: null,
        useYn: 'Y',
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
        plantCd: '',
        plantNm: null,
        disporateDeptItem: [],
      },
      gridRateOptions: {
        name: 'dispoRateDetail',
        header: [],
        data: [],
        height: '200',
        selectedRowData: {
          m01: 0,
          m02: 0,
          m03: 0,
          m04: 0,
          m05: 0,
          m06: 0,
          m07: 0,
          m08: 0,
          m09: 0,
          m10: 0,
          m11: 0,
          m12: 0,
        },
      },
      gridRateSumOptions: {
        data: [],
        height: 0,
        selectedRowData: {
          m01: 0,
          m02: 0,
          m03: 0,
          m04: 0,
          m05: 0,
          m06: 0,
          m07: 0,
          m08: 0,
          m09: 0,
          m10: 0,
          m11: 0,
          m12: 0,
        },
      },
      editable: true,
      updateMode: false,
      isCreateSubmit: false,
      isUpdateSubmit: false,
      plantSearchItems: [],
      ewstClassCdItems: [],
      ewstWasteCdItems: [],
      selectedValue: [],
      envUnitCdItems: [],
      selectedRateValue: [],
      deptItems: [],
      insertUrl: '',
      editUrl: '',
      detailUrl: '',
      checkUrl: '',
      m01: 0,
      YAuiGrid: null,
    };
  },
  watch: {
    'ingredient.plantCd': function (newValue, oldValue) {
      this.selectedValue.plantCd = this.ingredient.plantCd;
    },

    'ingredient.ewstClassCd': function (newValue, oldValue) {
      this.getEwstWasteNoItems();
    },
    'gridRateOptions.selectedRowData': {
      handler: function (newValue, oldValue) {
        var count = 0;

        this.$_.forEach(this.gridRateOptions.selectedRowData, (item) => {
          ++count;
          if (count >= 5) {
            let test = String(count - 4);
            let key = '';
            if (test.length === 2) {
              key = String('m' + test);
            } else {
              key = String('m0' + test);
            }
            if (item > 100) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000373', // '부서별 분배율은 100을 초과 할 수 없습니다.',
                type: 'warning', // success / info / warning / error
              });
              newValue[key] = 100;
            }
          }
        });
        this.getRateSum(newValue);
      },
      deep: true,
    },
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
      this.editable = this.$route.meta.editable;
      // 폐기물
      this.getEwstWasteCdItems();
      // 폐기물 분류
      this.getEwstClassCdItems();

      this.gridRateOptions.header = [
        // 부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '16%',
          style: 'left-align',
          editable: false,
        },
        // 1월
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000042'),
          dataField: 'm01',
          width: '7%',
          style: 'center-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 3, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        // 2월
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000043'),
          dataField: 'm02',
          width: '7%',
          style: 'center-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 3, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        // 3월
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000044'),
          dataField: 'm03',
          width: '7%',
          style: 'center-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 3, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        // 4월
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000045'),
          dataField: 'm04',
          width: '7%',
          style: 'center-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 3, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        // 5월
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000046'),
          dataField: 'm05',
          width: '7%',
          style: 'center-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 3, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        // 6월
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000047'),
          dataField: 'm06',
          width: '7%',
          style: 'center-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 3, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        // 7월
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000048'),
          dataField: 'm07',
          width: '7%',
          style: 'center-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 3, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        // 8월
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000049'),
          dataField: 'm08',
          width: '7%',
          style: 'center-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 3, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        // 9월
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000050'),
          dataField: 'm09',
          width: '7%',
          style: 'center-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 3, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        // 10월
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000051'),
          dataField: 'm10',
          width: '7%',
          style: 'center-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 3, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        // 11월
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000052'),
          dataField: 'm11',
          width: '7%',
          style: 'center-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 3, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        // 12월
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000053'),
          dataField: 'm12',
          width: '7%',
          style: 'center-align',
          dataType: 'numeric',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 3, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
      ];

      this.gridRateSumOptions.header = [
        { name: 'deptNm', width: '120px' },
        { name: 'm01', width: '70px' },
        { name: 'm02', width: '70px' },
        { name: 'm03', width: '70px' },
        { name: 'm04', width: '70px' },
        { name: 'm05', width: '70px' },
        { name: 'm06', width: '70px' },
        { name: 'm07', width: '70px' },
        { name: 'm08', width: '70px' },
        { name: 'm09', width: '70px' },
        { name: 'm10', width: '70px' },
        { name: 'm11', width: '70px' },
        { name: 'm12', width: '70px' },
      ];

      this.editUrl =
        transactionConfig.env.waste.operationLog.disporate.edit.url;
      this.insertUrl =
        transactionConfig.env.waste.operationLog.disporate.insert.url;
      this.detailUrl = selectConfig.env.waste.operationLog.disporate.get.url;
      this.checkUrl = selectConfig.env.waste.operationLog.disporate.check.url;

      if (this.popupParam.ewstWasteRateNo > 0) {
        this.ingredient.ewstWasteRateNo = this.popupParam.ewstWasteRateNo;
        this.ingredient.plantCd = this.popupParam.plantCd;
        this.getDetail();
      }
    },
    getDetail() {
      this.deptItems = [];
      this.selectedValue = this.popupParam;
      this.$http.url = this.$format(
        this.detailUrl,
        this.ingredient.plantCd,
        this.ingredient.ewstWasteRateNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.gridRateOptions.data = _result.data.disporateDeptItem;
          this.ingredient = _result.data;

          this.deptItems = [];
          this.$_.forEach(_result.data.checkedDeptList, (item) => {
            this.deptItems.push({ deptCd: item });
          });

          this.getRateSum();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEwstWasteNoItems() {
      this.$http.url = selectConfig.env.waste.baseInfo.waste.list.url;
      this.$http.type = 'get';
      this.$http.param = {
        useYn: 'Y',
        ewstClassCd: this.ingredient.ewstClassCd,
        plantCd: this.ingredient.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.ewstWasteCdItems = _result.data;
          this.ewstWasteCdItems.splice(0, 0, {
            ewstWasteNo: null,
            ewstWasteNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetailDefault() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.ingredient.plantCd !== '' ? this.ingredient.plantCd : 0,
        0
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.gridRateOptions.data = _result.data.disporateDeptItem;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEwstWasteCdItems() {
      this.$http.url = selectConfig.env.waste.baseInfo.waste.list.url;
      this.$http.type = 'get';
      this.$http.param = { useYn: 'Y' };
      this.$http.request(
        (_result) => {
          this.ewstWasteCdItems = this.$_.clone(_result.data);
          this.ewstWasteCdItems.splice(0, 0, {
            ewstWasteNo: null,
            ewstWasteNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEwstClassCdItems() {
      this.$http.url = selectConfig.env.waste.baseInfo.wasteClass.list.url;
      this.$http.type = 'GET';
      this.$http.param = { useYn: 'Y' };
      this.$http.request(
        (_result) => {
          this.ewstClassCdItems = this.$_.clone(_result.data);
          this.ewstClassCdItems.splice(0, 0, {
            ewstClassCd: null,
            ewstClassNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
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
    changeSelectedRow(row) {
      this.gridRateOptions.selectedRowData = row;
    },
    getRateSum(newValue) {
      var m01 = 0;
      var m02 = 0;
      var m03 = 0;
      var m04 = 0;
      var m05 = 0;
      var m06 = 0;
      var m07 = 0;
      var m08 = 0;
      var m09 = 0;
      var m10 = 0;
      var m11 = 0;
      var m12 = 0;

      this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
        m01 = Number(m01) + Number(item.m01);
        m02 = Number(m02) + Number(item.m02);
        m03 = Number(m03) + Number(item.m03);
        m04 = Number(m04) + Number(item.m04);
        m05 = Number(m05) + Number(item.m05);
        m06 = Number(m06) + Number(item.m06);
        m07 = Number(m07) + Number(item.m07);
        m08 = Number(m08) + Number(item.m08);
        m09 = Number(m09) + Number(item.m09);
        m10 = Number(m10) + Number(item.m10);
        m11 = Number(m11) + Number(item.m11);
        m12 = Number(m12) + Number(item.m12);
      });

      this.gridRateSumOptions.data = this.$_.clone(
        this.$_.reject(this.gridRateSumOptions.data, {
          deptCd: null,
        })
      );

      var sumRecodes = {
        deptCd: null,
        deptNm: this.$comm.getLangSpecInfoLabel('L0000003180'), // '합계',
        ewstWasteRateNo: null,
        m01: m01,
        m02: m02,
        m03: m03,
        m04: m04,
        m05: m05,
        m06: m06,
        m07: m07,
        m08: m08,
        m09: m09,
        m10: m10,
        m11: m11,
        m12: m12,
      };
      this.gridRateSumOptions.data.push(sumRecodes);
      var count = 0;
      this.$_.forEach(this.gridRateSumOptions.data[0], (item) => {
        ++count;
        if (count >= 4) {
          let test = String(count - 3);
          let key = '';
          if (test.length === 2) {
            key = String('m' + test);
          } else {
            key = String('m0' + test);
          }
          if (item > 100) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000373', // '부서별 분배율은 100을 초과 할 수 없습니다.',
              type: 'warning', // success / info / warning / error
            });
            newValue[key] = 0;
          }
        }
      });

      if (Number(this.gridRateSumOptions.data[0].m01) > 100) {
        newValue['m01'] = 0;
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000374', // '부서별 분배율의 합계는 100을 초과 할 수 없습니다.',
          type: 'warning', // success / info / warning / error
        });
        return false;
      }
    },
    cellEditEndHandler() {
      this.ingredient.disporateDeptItem = this.YAuiGrid.getGridData();
      this.getRateSum();
    },
    beforeCreateSubmit() {
      this.updateMode = false;
      // this.ingredient.disporateDeptItem = this.gridRateOptions.data;

      this.$http.url = this.checkUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        year: this.ingredient.year,
        ewstWasteNo: this.ingredient.ewstWasteNo,
        plantCd: this.ingredient.plantCd,
      };
      this.$http.request(
        (_result) => {
          if (Number(_result.data) > 0) {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000375', // '사업장,년도,폐기물분류,폐기물이 중복 됩니다.',
              type: 'warning',
            });
            this.updateMode = true;
          } else {
            if (!this.checkDispoRateSum()) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000376', // '분배율의 합계는 100이 되어야 합니다',
                type: 'warning', // success / info / warning / error
              });
              this.updateMode = true;
              return;
            }

            this.$validator
              .validateAll()
              .then((_result) => {
                if (_result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.ingredient.createUserId = this.$store.getters.token;
                      this.isCreateSubmit = true;
                    },
                  });
                } else if (!_result) {
                  this.$popupRequired.check(
                    'dispoRateDetail',
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
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeUpdateSubmit() {
      // this.ingredient.disporateDeptItem = this.gridRateOptions.data;

      this.$http.url = this.checkUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        year: this.ingredient.year,
        ewstWasteNo: this.ingredient.ewstWasteNo,
        plantCd: this.ingredient.plantCd,
        ewstWasteRateNo: this.ingredient.ewstWasteRateNo,
      };
      this.$http.request(
        (_result) => {
          if (Number(_result.data) === 1) {
            if (!this.checkDispoRateSum()) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000376', // '분배율의 합계는 100이 되어야 합니다',
                type: 'warning', // success / info / warning / error
              });
              this.updateMode = true;
              return;
            }

            this.$validator
              .validateAll()
              .then((_result) => {
                if (_result) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    type: 'info',
                    confirmCallback: () => {
                      this.ingredient.updateUserId = this.$store.getters.token;
                      this.isUpdateSubmit = true;
                    },
                  });
                } else if (!_result) {
                  this.$popupRequired.check(
                    'dispoRateDetail',
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
              message: 'M0000000375', // '사업장,년도,폐기물분류,폐기물이 중복 됩니다.',
              type: 'warning',
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnClickedErrorCallback(_result) {
      this.isCreateSubmit = false;
      this.isUpdateSubmit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.updateMode = true;
      this.ingredient.ewstWasteRateNo = _result.data;
      this.getDetail();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    checkDispoRateSum() {
      let flag = true;
      var count = 0;
      this.$_.forEach(this.gridRateSumOptions.data[0], (item) => {
        if (Number(item) === 100 || Number(item) === 0) {
          ++count;
        }
      });
      if (count < 14) {
        flag = false;
      }
      return flag;
    },

    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
