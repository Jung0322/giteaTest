<!--
  목적 : 고장이력정보
  작성자 : kkc (2021-02-18 etg수정)
  Detail : 고장이력정보 조회,등록,수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 고장이력정보 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :items="gridOptions.data"
          :label="this.$comm.getLangSpecInfoLabel('L0000000483')"
          :enableCellMerge="true"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :showRowCheckColumn="true"
          @cellClick="getDetail"
          @btnDeleteClicked="btnDeleteClicked"
        />
      </b-col>
    </b-row>
    <!-- 등록 -->
    <b-row class="mt-3" ref="insertBox" v-if="!tabDisabled">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 고장이력정보 상세 -->
            <y-label
              label="L0000000484"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 방지시설명 -->
              <y-select
                :width="8"
                :editable="editable"
                :disabled="true"
                :comboItems="preventFacNoItems"
                itemText="ewtrPreventFacNm"
                itemValue="ewtrPreventFacNo"
                ui="bootstrap"
                label="L0000001117"
                name="ewtrPreventFacNo"
                v-model="ewtrPreventFacBreakHist.ewtrPreventFacNo"
                v-validate="'required'"
                :state="validateState('ewtrPreventFacNo')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 고장발생일시 -->
              <y-datepicker
                :width="8"
                :disabled="disabled"
                :editable="editable"
                label="L0000000478"
                name="starttime"
                type="datetime"
                :minuteStep="10"
                v-model="starttime"
                :required="true"
                v-validate="'required'"
                :state="validateState('starttime')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 조치완료일시 -->
              <y-datepicker
                :width="8"
                :disabled="disabled"
                :editable="editable"
                label="L0000002686"
                :start="start"
                name="endtime"
                type="datetime"
                :minuteStep="10"
                v-model="endtime"
                :required="true"
                v-validate="'required'"
                :state="validateState('endtime')"
              ></y-datepicker>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 고장상태 -->
              <y-textarea
                :width="10"
                :disabled="disabled"
                :editable="editable"
                :maxlength="150"
                ui="bootstrap"
                label="L0000000479"
                name="downCond"
                v-model="ewtrPreventFacBreakHist.downCond"
                :rows="2"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 조치사항 -->
              <y-textarea
                :width="10"
                :disabled="disabled"
                :editable="editable"
                :maxlength="150"
                ui="bootstrap"
                label="L0000002679"
                name="action"
                v-model="ewtrPreventFacBreakHist.action"
                :rows="2"
              />
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <!-- 특기사항 -->
              <y-textarea
                :width="10"
                :disabled="disabled"
                :editable="editable"
                :maxlength="150"
                ui="bootstrap"
                label="L0000003012"
                name="remark"
                v-model="ewtrPreventFacBreakHist.remark"
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
              :param="ewtrPreventFacBreakHist"
              :is-submit="isInsert"
              title="L0000001789"
              color="orange"
              action-type="POST"
              beforeSubmit="beforeInsert"
              @beforeInsert="beforeInsert"
              @btnClicked="btnInsertClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            <!-- 저장 -->
            <y-btn
              v-if="editable && updateMode && !disabled"
              :action-url="editUrl"
              :param="ewtrPreventFacBreakHist"
              :is-submit="isEdit"
              title="L0000002474"
              color="orange"
              action-type="PUT"
              beforeSubmit="beforeEdit"
              @beforeEdit="beforeEdit"
              @btnClicked="btnEditClickedCallback"
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
  /* attributes: name, components, props, data */
  name: 'prevent-break-hist',
  props: {
    selectedPreventFacNo: 0,
    tabDisabled: false,
  },
  data() {
    return {
      ewtrPreventFacBreakHist: {
        ewtrPreventFacNo: null,
        measureYmd: '',
        completeYmd: '',
        downCond: '',
        action: '',
        remark: '',
        fromDownTime: '',
        toDownTime: '',
        ewtrCleanFacNo: null,
        createUserId: '',
        updateUserId: '',
      },
      gridOptions: {
        name: 'preventBreakHist',
        header: [],
        data: [],
        btns: [],
        height: 250,
      },
      preventFacNoItems: [],
      editable: true,
      updateMode: false,
      disabled: false,
      isInsert: false,
      isEdit: false,
      editUrl: '',
      insertUrl: '',
      deleteUrl: '',
      selectedValue: [],
      ewtrCleanFacItems: [],

      starttime: null,
      endtime: null,
      start: null,
      YAuiGrid: null,
    };
  },
  watch: {
    selectedPreventFacNo: function (newValue, oldValue) {
      this.btnClearClickedCallback();
      this.ewtrPreventFacBreakHist.ewtrPreventFacNo = this.selectedPreventFacNo;

      if (this.selectedPreventFacNo !== 0) {
        this.disabled = false;
      }
      this.getList();
    },
    starttime() {
      this.start = this.starttime.substring(0, 10);

      if (this.starttime > this.endtime) {
        this.endtime = '';
      }
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      setTimeout(() => {
        this.getPreventFacNoItems();
      }, 200);
      // 그리드 헤더 설정
      this.gridOptions.header = [
        // 방지시설명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001117'),
          dataField: 'ewtrPreventFacNm',
          width: '200',
          style: 'left-align',
        },
        // 고장일시
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000485'),
          dataField: 'downTime',
          width: '280',
          style: 'center-align',
        },
        // 고장상태
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000479'),
          dataField: 'downCond',
          width: '130',
          style: 'left-align',
        },
        // 조치사항
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002679'),
          dataField: 'action',
          width: '300',
          style: 'left-align',
        },
        // 특기사항
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003012'),
          dataField: 'remark',
          width: '300',
          style: 'left-align',
        },
        // 등록일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000973'),
          dataField: 'createDt',
          width: '180',
          style: 'center-align',
        },
        // 등록자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000976'),
          dataField: 'createUserNm',
          width: '100',
          style: 'center-align',
        },
        // 수정일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001697'),
          dataField: 'updateDt',
          width: '180',
          style: 'center-align',
        },
        // 수정자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001698'),
          dataField: 'updateUserNm',
          width: '100',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), // 삭제
          color: 'red',
          btnClicked: 'btnDeleteClicked',
        },
      ];

      this.editUrl =
        transactionConfig.env.water.facility.preventFacBreakHist.edit.url;
      this.insertUrl =
        transactionConfig.env.water.facility.preventFacBreakHist.insert.url;
      this.deleteUrl =
        transactionConfig.env.water.facility.preventFacBreakHist.delete.url;

      if (this.selectedPreventFacNo > 0) {
        this.ewtrPreventFacBreakHist.ewtrPreventFacNo =
          this.selectedPreventFacNo;
        this.getList();
      } else {
        this.disabled = true;
      }
    },
    getList() {
      this.$http.url =
        selectConfig.env.water.facility.preventFacBreakHist.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrPreventFacNo: this.ewtrPreventFacBreakHist.ewtrPreventFacNo,
      };
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDetail(data) {
      if (data === null) return;
      console.log('111', data);
      this.$http.url = this.$format(
        selectConfig.env.water.facility.preventFacBreakHist.get.url,
        data.item.ewtrPreventFacBreakHistNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.ewtrPreventFacBreakHist = this.$_.clone(_result.data);

          this.starttime =
            _result.data.measureYmd + ' ' + _result.data.fromDownTime;
          this.endtime =
            _result.data.completeYmd + ' ' + _result.data.toDownTime;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getPreventFacNoItems() {
      this.$http.url = selectConfig.env.water.facility.preventFac.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewtrPreventFacNo: null,
            ewtrPreventFacNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
          this.preventFacNoItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getCleanItems() {
      this.$http.url = selectConfig.env.water.facility.wasteBasicUnit.list.url;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            ewtrCleanFacNo: null,
            ewtrCleanFacNm:
              this.$comm.getLangSpecInfoLabel('L0000003394') /* 선택하세요 */,
          });
          this.ewtrCleanFacItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeInsert() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.ewtrPreventFacBreakHist.createUserId =
                  this.$store.getters.token;
                this.ewtrPreventFacBreakHist.measureYmd =
                  this.starttime.substring(0, 10);
                this.ewtrPreventFacBreakHist.fromDownTime =
                  this.starttime.substring(11);
                this.ewtrPreventFacBreakHist.completeYmd =
                  this.endtime.substring(0, 10);
                this.ewtrPreventFacBreakHist.toDownTime =
                  this.endtime.substring(11);

                this.isInsert = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'preventBreakHist',
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
    beforeEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              confirmCallback: () => {
                this.ewtrPreventFacBreakHist.updateUserId =
                  this.$store.getters.token;
                this.ewtrPreventFacBreakHist.measureYmd =
                  this.starttime.substring(0, 10);
                this.ewtrPreventFacBreakHist.fromDownTime =
                  this.starttime.substring(11);
                this.ewtrPreventFacBreakHist.completeYmd =
                  this.endtime.substring(0, 10);
                this.ewtrPreventFacBreakHist.toDownTime =
                  this.endtime.substring(11);
                this.isEdit = true;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'preventBreakHist',
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
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    btnInsertClickedCallback(_result) {
      this.ewtrPreventFacBreakHist.ewtrPreventFacBreakHistNo = _result.data;
      this.getList();
      this.isInsert = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnEditClickedCallback(_result) {
      this.getList();
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    btnClearClickedCallback() {
      var temp = this.ewtrPreventFacBreakHist.ewtrPreventFacNo;
      Object.assign(
        this.$data.ewtrPreventFacBreakHist,
        this.$options.data().ewtrPreventFacBreakHist
      );
      this.$validator.reset();
      this.ewtrPreventFacBreakHist.ewtrPreventFacNo = temp;
      this.updateMode = false;
      this.starttime = null;
      this.endtime = null;
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
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
          message: 'M0000000392', // '고장이력정보를 선택하세요.',
          type: 'warning',
        });
      }
    },
  },
};
</script>
