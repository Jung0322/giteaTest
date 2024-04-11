<!--
  목적 : 환경 > 대기 > 시설관리 > 방지시설 > 상세 > 보수관리정보(탭)
  작성자 : jkl
  Detail : 대기 방지시설 보수이력 관리
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 보수이력 목록 -->
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
          :label="this.$comm.getLangSpecInfoLabel('L0000001254')"
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
            <!-- 보수이력 등록 -->
            <y-label
              label="L0000001253"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
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
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3"></b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 보수기간 -->
              <y-datepicker
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :range="true"
                :required="true"
                label="L0000001250"
                name="maintPeriod"
                v-model="preventMaintHist.maintPeriod"
                v-validate="'required'"
                :state="validateState('maintPeriod')"
                @input="changeMaintPeriod"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 보수자 -->
              <y-text
                :width="8"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                :maxlength="30"
                ui="bootstrap"
                label="L0000001255"
                name="worker"
                v-model="preventMaintHist.worker"
                v-validate="'required'"
                :state="validateState('worker')"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 보수명세 -->
              <y-textarea
                :width="10"
                :disabled="disabled"
                :editable="editable"
                :required="true"
                :maxlength="200"
                ui="bootstrap"
                label="L0000001251"
                name="remark"
                v-model="preventMaintHist.remark"
                v-validate="'required'"
                :state="validateState('remark')"
                :rows="2"
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
              :param="preventMaintHist"
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
              :param="preventMaintHist"
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
  name: 'prevent-maint-hist',
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
        eairOutletNo: 0,
        eairOutletNm: '',
      },
      preventMaintHist: {
        eairPreventFacMaintHistNo: 0,
        eairPreventFacNo: 0,
        eairPreventFacNm: '',
        eairPreventFacClassCd: '',
        eairPreventFacClassNm: '',
        eairOutletNo: null,
        eairOutletNm: '',
        installPos: '',
        maintPeriod: null,
        startYmd: '',
        endYmd: '',
        worker: '',
        remark: '',
        createUserId: '',
        createUserNm: '',
        createDt: '',
      },
      gridOptions: {
        name: 'preventMaintHist',
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
      if (this.this.prevention.eairPreventFacNo > 0) {
        this.disabled = false;

        this.getList();
        this.getPreventionDetail();
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
      // 선택항목 설정

      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 보수시작일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001252'),
          dataField: 'startYmd',
          width: '160',
          style: 'center-align',
        },
        // 보수종료일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001256'),
          dataField: 'endYmd',
          width: '160',
          style: 'center-align',
        },
        // 보수자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001255'),
          dataField: 'worker',
          width: '120',
          style: 'center-align',
        },
        // 보수명세
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001251'),
          dataField: 'remark',
          width: '500',
          style: 'left-align',
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
          visible: this.editable && !this.tabDisabled && !this.disabled,
        },
      ];

      this.insertUrl =
        transactionConfig.env.air.facility.preventionMaintenanceHistory.insert.url;
      this.editUrl =
        transactionConfig.env.air.facility.preventionMaintenanceHistory.edit.url;
      this.deleteUrl =
        transactionConfig.env.air.facility.preventionMaintenanceHistory.delete.url;
      this.searchUrl =
        selectConfig.env.air.facility.preventionMaintenanceHistory.list.url;
      this.detailUrl =
        selectConfig.env.air.facility.preventionMaintenanceHistory.get.url;
      this.preventionDetailUrl =
        selectConfig.env.air.facility.preventionN.get.url;

      this.prevention.eairPreventFacNo = this.selectedEairPreventFacNo;
      if (this.prevention.eairPreventFacNo > 0) {
        this.getList();
        this.getPreventionDetail();
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
        data.eairPreventFacMaintHistNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.preventMaintHist = _result.data;
          this.preventMaintHist.maintPeriod = [
            this.preventMaintHist.startYmd,
            this.preventMaintHist.endYmd,
          ];
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
          this.preventMaintHist.eairPreventFacNo =
            this.prevention.eairPreventFacNo;
          this.preventMaintHist.eairPreventFacNm =
            this.prevention.eairPreventFacNm;
          this.btnClearClickedCallback({});
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    changeMaintPeriod(data) {
      this.preventMaintHist.startYmd = data[0];
      this.preventMaintHist.endYmd = data[1];
    },
    beforeCreateSubmit() {
      this.preventMaintHist.eairPreventFacMaintHistNo = 0;
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
                this.preventMaintHist.createUserId = this.$store.getters.token;
                this.isCreateSubmit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'preventMaintHist',
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
                this.preventMaintHist.updateUserId = this.$store.getters.token;
                this.isUpdateSubmit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'preventMaintHist',
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
      this.preventMaintHist.eairPreventFacMaintHistNo = 0;
      this.preventMaintHist.eairPreventFacNo = this.prevention.eairPreventFacNo;
      this.preventMaintHist.eairPreventFacNm = this.prevention.eairPreventFacNm;
      this.preventMaintHist.eairPreventFacClassCd = '';
      this.preventMaintHist.eairPreventFacClassNm = '';
      this.preventMaintHist.eairOutletNo = null;
      this.preventMaintHist.eairOutletNm = '';
      this.preventMaintHist.installPos = '';
      this.preventMaintHist.startYmd = null;
      this.preventMaintHist.endYmd = null;
      this.preventMaintHist.worker = '';
      this.preventMaintHist.remark = '';
      this.preventMaintHist.createUserId = '';
      this.preventMaintHist.createUserNm = '';
      this.preventMaintHist.createDt = '';
      this.preventMaintHist.maintPeriod = [];
    },
    btnCreateClickedCallback(_result) {
      this.isCreateSubmit = false;
      this.updateMode = true;
      this.preventMaintHist.eairPreventFacMaintHistNo = _result.data;
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
            this.$http.type = 'delete';
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
          message: 'M0000000315', // '방지시설 보수 정보를 선택하세요.',
          type: 'warning',
        });
      }
    },
  },
};
</script>
