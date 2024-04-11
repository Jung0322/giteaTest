<!--
  목적 : 환경 > 대기 > 시설관리 > 방지시설 > 상세 > 활성탄교체(탭)
  작성자 : jkl
  Detail : 대기 방지시설 활성탄교체 관리
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 활성탄 교체 목록 -->
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003356')"
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
            <!-- 활성탄 교체 등록 -->
            <y-label
              label="L0000003355"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 교체일자 -->
              <y-datepicker
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                label="L0000000682"
                name="chngDate"
                :default="activatedCarbon.chngDate"
                v-model="activatedCarbon.chngDate"
                v-validate="'required'"
                :state="validateState('chngDate')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 교체비용 -->
              <y-number
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                :maxlength="11"
                :hasSeperator="true"
                ui="bootstrap"
                label="L0000000681"
                name="chngCost"
                v-model="activatedCarbon.chngCost"
                v-validate="'required'"
                :state="validateState('chngCost')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 교체량 -->
              <y-number
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :maxlength="10"
                :hasSeperator="true"
                :pointNumber="2"
                ui="bootstrap"
                label="L0000000680"
                name="chngAmount"
                v-model="activatedCarbon.chngAmount"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 단위 -->
              <y-select
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                :comboItems="unitCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="unitCd"
                label="L0000000870"
                v-model="activatedCarbon.unitCd"
                v-validate="'required'"
                :state="validateState('unitCd')"
              ></y-select>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-8">
              <!-- 비고 -->
              <y-textarea
                :disabled="disabled"
                :editable="editable"
                :width="10"
                :maxlength="250"
                ui="bootstrap"
                name="remark"
                label="L0000001360"
                v-model="activatedCarbon.remark"
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
              :param="activatedCarbon"
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
              :param="activatedCarbon"
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
    tabDisabled: false,
  },
  data() {
    return {
      prevention: {
        eairPreventFacNo: 0,
        eairPreventFacNm: '',
      },
      activatedCarbon: {
        eairPreventFacActCarbHistNo: 0,
        eairPreventFacNo: 0,
        eairPreventFacNm: '',
        chngDate: '',
        chngCost: '',
        chngAmount: '',
        remark: '',
        unitCd: null,
        createUserId: '',
        createUserNm: '',
        createDt: '',
      },
      gridOptions: {
        name: 'activatedCarbonChange',
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

      selectedValue: [],
      unitCdItems: [],
      insertUrl: '', // 등록
      editUrl: '', // 수정
      listUrl: '', // 조회
      searchUrl: '',
      detailUrl: '',
      YAuiGrid: null,
    };
  },
  watch: {
    selectedEairPreventFacNo: function (newValue, oldValue) {
      this.prevention.eairPreventFacNo = this.selectedEairPreventFacNo;
      if (this.this.prevention.eairPreventFacNo > 0) {
        this.disabled = false;

        this.getList();
      }
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
      // 단위
      this.$comm.getComboItems('ENV_UNIT', false).then((_result) => {
        this.unitCdItems = _result;
      });

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 교체일자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000682'),
          dataField: 'chngDate',
          width: '17%',
          style: 'center-align',
        },
        // 교체비용
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000681'),
          dataField: 'chngCost',
          width: '17%',
          style: 'right-align',
        },
        // 비용 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001371'),
          dataField: 'chngUnit',
          width: '16%',
          style: 'center-align',
        },
        // 교체량
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000680'),
          dataField: 'chngAmount',
          width: '17%',
          style: 'right-align',
        },
        // 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'unitNm',
          width: '16%',
          style: 'center-align',
        },
        // 비고
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
          dataField: 'remark',
          width: '17%',
          style: 'left-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'), // 제외
          color: 'red',
          btnClicked: 'btnDeleteClicked',
          visible: this.editable && !this.tabDisabled && !this.disabled,
        },
      ];

      this.insertUrl =
        transactionConfig.env.air.facility.preventionFacActCarbHist.insert.url;
      this.editUrl =
        transactionConfig.env.air.facility.preventionFacActCarbHist.edit.url;
      this.deleteUrl =
        transactionConfig.env.air.facility.preventionFacActCarbHist.delete.url;
      this.searchUrl =
        selectConfig.env.air.facility.preventionFacActCarbHist.list.url;
      this.detailUrl =
        selectConfig.env.air.facility.preventionFacActCarbHist.get.url;

      this.prevention.eairPreventFacNo = this.selectedEairPreventFacNo;
      if (this.prevention.eairPreventFacNo > 0) {
        this.getList();
      } else {
        this.disabled = true;
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
        data.eairPreventFacActCarbHistNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.activatedCarbon = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeCreateSubmit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000304', // '활성탄 교체 정보를 저장 하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.activatedCarbon.eairPreventFacNo =
                  this.selectedEairPreventFacNo;
                this.activatedCarbon.createUserId = this.$store.getters.token;
                this.isCreateSubmit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'activatedCarbonChange',
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
              message: 'M0000000305', // '활성탄 교체 정보를 수정하시겠습니까?',
              type: 'info',
              confirmCallback: () => {
                this.activatedCarbon.updateUserId = this.$store.getters.token;
                this.isUpdateSubmit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'activatedCarbonChange',
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
        this.$data.activatedCarbon,
        this.$options.data().activatedCarbon
      );
      this.$validator.reset();

      this.activatedCarbon.eairPreventFacNo = this.prevention.eairPreventFacNo;
      this.activatedCarbon.eairPreventFacNm = this.prevention.eairPreventFacNm;
      this.clearDevAttr();
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.updateMode = true;
      this.activatedCarbon.activatedCarbonNo = _result.data;
      this.getList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000306', // '활성탄 교체 정보를 정상적으로 저장하였습니다.',
        type: 'success',
      });
    },
    btnUpdateClickedCallback(_result) {
      this.isUpdateSubmit = false;
      this.getList();
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000307', // '활성탄 교체 정보를 정상적으로 수정하였습니다.',
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
          message: 'M0000000308', // '선택된 활성탄 교체 정보를 삭제하시겠습니까?',
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
                this.getList();
                window.getApp.$emit('ALERT', {
                  title: 'L0000003395', // '안내',
                  message: 'M0000000309', // '활성탄 교체 정보를 정상적으로 삭제하였습니다.',
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
      this.activatedCarbon.chngDate = null;
      this.activatedCarbon.activatedCarbonNo = null;
      this.activatedCarbon.chngCost = null;
      this.activatedCarbon.chngAmount = null;
      this.activatedCarbon.remark = null;
      this.activatedCarbon.unitCd = null;
      // this.unitCdItems = [];
    },
  },
};
</script>
