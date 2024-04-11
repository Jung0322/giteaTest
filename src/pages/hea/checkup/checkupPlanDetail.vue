<template>
  <b-container fluid>
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 검진 계획 상세 -->
            <y-label
              label="L0000000339"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="checkupPlan"
                :is-submit="isEmit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEmit"
                @beforeEmit="beforeEmit"
                @btnClicked="btnEmitClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && !updateMode"
                :action-url="insertUrl"
                :param="checkupPlan"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 삭제 -->
              <y-btn
                v-if="
                  editable &&
                  checkupPlan.heaCheckupPlanNo &&
                  !checkupPlan.checkupUserCount
                "
                :action-url="deleteUrl"
                :param="{ data: checkupPlan }"
                :is-submit="isDelete"
                title="L0000001495"
                color="red"
                action-type="DELETE"
                beforeSubmit="beforeDelete"
                @beforeDelete="beforeDelete"
                @btnClicked="btnDeleteClickedCallback"
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
                name="plantCd"
                :editable="editable"
                :required="true"
                :state="validateState('plantCd')"
                v-validate="'required'"
                v-model="checkupPlan.plantCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 검진 종류 -->
              <y-select
                ui="bootstrap"
                label="L0000000346"
                itemText="codeNm"
                itemValue="code"
                name="heaCheckupClassCd"
                :width="8"
                :editable="editable"
                :comboItems="heaCheckupClassItems"
                :required="true"
                :state="validateState('heaCheckupClassCd')"
                v-validate="'required'"
                v-model="checkupPlan.heaCheckupClassCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 검진 계획명 -->
              <y-text
                ui="bootstrap"
                label="L0000000341"
                name="heaCheckupPlanNm"
                :width="8"
                :editable="editable"
                :maxlength="30"
                :required="true"
                :state="validateState('heaCheckupPlanNm')"
                v-validate="'required'"
                v-model="checkupPlan.heaCheckupPlanNm"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 검진 기간 -->
              <y-datepicker
                label="L0000000342"
                name="period"
                :width="8"
                :editable="editable"
                :range="true"
                :required="true"
                :state="validateState('period')"
                v-validate="'required'"
                v-model="checkupPlan.period"
              ></y-datepicker>
            </b-col>
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <div v-show="ChkRowBtn" slot="buttonGroup" class="float-right mb-1">
                <y-btn title="L0000003224" color="blue" @btnClicked="addRow()" /> < 행 추가 
                <y-btn title="L0000003223" color="red" @btnClicked="removeRow()" />  행 삭제 
              </div>
               검진 기관 목록 
              <y-data-table
                ref="dataTable"
                label="L0000000343"
                :popMode="true"
                :useRownum="false"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                v-model="gridOptions.selectValue"
              >
                <el-table-column type="selection" slot="selection" align="center" width="55"></el-table-column>
              </y-data-table>
            </b-col> -->
            <b-col sm="12" class="h100p">
              <y-auigrid
                ref="yAuiGrid"
                :editable="true"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :useExcelExport="false"
                :enableCellMerge="true"
                :enableSorting="true"
                :showGridSetSave="true"
                :useContextMenu="true"
                :showRowCheckColumn="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"
                @btnAddRow="btnAddRow"
                @btnDelRow="btnDelRow"
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
  name: 'checkup-plan-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        heaCheckupPlanNo: 0,
      },
    },
  },
  data() {
    return {
      checkupPlan: {
        heaCheckupPlanNo: 0,
        heaCheckupPlanNm: null,
        heaCheckupClassCd: null,
        plantCd: null,
        period: null,
        startYmd: null,
        endYmd: null,
        finishYmd: null,
        requiredOptYn: 'N',
        selectOptCount: 0,
        checkupPlanOrgs: [],
        checkupUserCount: 0,
        createUserId: null,
        updateUserId: null,
      },
      gridOptions: {
        name: 'checkupPlanDetail',
        btns: [],
        header: [],
        data: [],
        height: '300',
        selectValue: [],
      },
      YAuiGrid: null,
      editable: false,
      updateMode: false,
      heaCheckupClassItems: [],
      heaCheckupOrgItems: [],
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEmit: false,
      isDelete: false,
      ChkRowBtn: false,
      selectedValue: [],
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // URL 셋팅
      this.searchUrl = selectConfig.hea.checkupPlan.list.url;
      this.insertUrl = transactionConfig.hea.checkupPlan.insert.url;
      this.editUrl = transactionConfig.hea.checkupPlan.edit.url;
      this.deleteUrl = transactionConfig.hea.checkupPlan.delete.url;

      this.getComboItems();
      this.getHeaCheckupOrgItems();

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003224'),
          color: 'blue',
          btnClicked: 'btnAddRow',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003223'),
          color: 'red',
          btnClicked: 'btnDelRow',
        },
      ];

      if (this.popupParam.heaCheckupPlanNo) {
        this.checkupPlan.heaCheckupPlanNo = this.popupParam.heaCheckupPlanNo;
        this.getDetail();
      }

      let userAuthGrps = this.$store.getters.userAuthGrps;
      this.$_.forEach(userAuthGrps, (item) => {
        if (
          (item.authGrpNo === '1021' || // 사업장안전담당자
            item.authGrpNo === '1022' || // 사업장보건담당자
            item.authGrpNo === '1024' || // 사업장환경담당자
            item.authGrpNo === '1036' || // 시스템관리자
            item.authGrpNo === '1090' || // 시스템관리자
            item.authGrpNo === '2') && // 전사담당자
          item.settingYn === 'Y'
        ) {
          this.ChkRowBtn = true;
        }
      });
    },
    setHeader() {
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003423'),
          dataField: 'heaCheckupOrgNo',
          width: '40%',
          style: 'center-align',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.heaCheckupOrgItems;
            },
            keyField: 'heaCheckupOrgNo', // key 에 해당되는 필드명
            valueField: 'heaCheckupOrgNm', // value 에 해당되는 필드명
          },
        }, // 점검시
        {
          headerText: '검진시작일',
          dataField: 'startYmd',
          width: '30%',
          editRenderer: {
            type: 'CalendarRenderer',
            onlyCalendar: true,
            defaultFormat: 'yyyy-mm-dd',
          },
        },
        {
          headerText: '검진종료일',
          dataField: 'endYmd',
          width: '30%',
          editRenderer: {
            type: 'CalendarRenderer',
            onlyCalendar: true,
            defaultFormat: 'yyyy-mm-dd',
          },
        },
      ];
    },
    // 검진 종류
    getComboItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'HEA_CHECKUP_CLASS'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.heaCheckupClassItems = this.$_.clone(_result.data);
          this.heaCheckupClassItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 검진 기관
    getHeaCheckupOrgItems() {
      this.$http.url = selectConfig.hea.checkupOrg.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.heaCheckupOrgItems = _result.data;
          this.heaCheckupOrgItems.splice(0, 0, {
            heaCheckupOrgNo: null,
            heaCheckupOrgNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
          });
          this.setHeader();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 검진 기관 행추가
    btnAddRow() {
      if (!this.checkupPlan.period) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000423', // 검진 기관은 검진 기간을 입력 후 추가할 수 있습니다.
          type: 'warning',
        });
        return;
      }

      let row = {
        heaCheckupPlanNo: this.checkupPlan.heaCheckupPlanNo,
        heaCheckupOrgNo: null,
        heaCheckupOrgNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
        startEndYmd: this.checkupPlan.period,
        startYmd: this.checkupPlan.period[0],
        endYmd: this.checkupPlan.period[1],
      };
      this.YAuiGrid.addRow(row, 'last');
    },
    addRow() {
      if (!this.checkupPlan.period) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000423', // 검진 기관은 검진 기간을 입력 후 추가할 수 있습니다.
          type: 'warning',
        });
        return;
      }
      this.gridOptions.data.splice(0, 0, {
        heaCheckupPlanNo: this.checkupPlan.heaCheckupPlanNo,
        heaCheckupOrgNo: null,
        heaCheckupOrgNm: this.$comm.getLangSpecInfoLabel('L0000003394'), // 선택하세요
        startEndYmd: this.checkupPlan.period,
        startYmd: '',
        endYmd: '',
      });
    },
    btnDelRow() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000160' /* 제외할 항목을 선택하세요. */,
          type: 'warning',
        });
      }
      let gridData = this.YAuiGrid.getGridData();
      this.$_.forEach(checkingData, (item) => {
        gridData = this.$_.reject(gridData, item);
      });

      this.YAuiGrid.setGridData(gridData);
    },
    // 검진 기관 행삭제
    removeRow() {
      this.$_.forEach(this.gridOptions.selectValue, (item) => {
        this.gridOptions.data = this.$_.reject(this.gridOptions.data, item);
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
    getDetail() {
      this.$http.url = this.$format(
        selectConfig.hea.checkupPlan.get.url,
        this.checkupPlan.heaCheckupPlanNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.checkupPlan = this.$_.clone(_result.data);
          this.checkupPlan.period = [
            this.checkupPlan.startYmd,
            this.checkupPlan.endYmd,
          ];
          this.gridOptions.data = this.$_.clone(_result.data.checkupPlanOrgs);
          this.YAuiGrid.setGridData(
            this.$_.clone(_result.data.checkupPlanOrgs)
          );
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.checkupPlan.heaCheckupPlanNo = this.$_.clone(_result.data);
      this.updateMode = true;
      this.isInsert = false;
      // if (this.gridOptions.data.length <= 0) {
      //   window.getApp.$emit('ALERT', {
      //     title: 'L0000003395', // '안내',
      //     message: 'M0000000407', // 검진기관을 선택하세요.
      //     type: 'warning',
      //   });
      //   return;
      // }
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.getHeaCheckupOrgItems();
      this.getDetail();
    },
    // 수정
    btnEmitClickedCallback(_result) {
      this.updateMode = true;
      this.isEmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
    },
    /** validation checking **/
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeInsert() {
      if (this.checkDuplicate()) {
        return;
      }
      for (let i = 0; i < this.YAuiGrid.getGridData().length; i++) {
        if (this.YAuiGrid.getGridData()[i].heaCheckupOrgNo === null) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000424', // 기관명을 선택해주세요.
            type: 'warning',
          });
          return;
        }

        if (
          this.YAuiGrid.getGridData()[i].startYmd >
          this.YAuiGrid.getGridData()[i].endYmd
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: '검진시작일은 검진종료일보다 과거일 수 없습니다.', // 검진시작일은 검진종료일보다 과거일 수 없습니다.
            type: 'warning',
          });
          return;
        }
      }
      if (this.checkPeriod()) return;
      this._beforeCheck('insert');
    },
    beforeEmit() {
      if (this.checkPeriod()) return;
      if (this.checkDuplicate()) {
        return;
      }
      for (let i = 0; i < this.YAuiGrid.getGridData().length; i++) {
        if (!this.YAuiGrid.getGridData()[i].heaCheckupOrgNo) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000424', // 기관명을 선택해주세요.
            type: 'warning',
          });
          return;
        }
        if (
          this.YAuiGrid.getGridData()[i].startYmd >
          this.YAuiGrid.getGridData()[i].endYmd
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: '검진시작일은 종료일보다 과거여야합니다.', // 기관명을 선택해주세요.
            type: 'warning',
          });
          return;
        }
      }
      this._beforeCheck('update');
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    // 검진기간 체크
    checkPeriod() {
      for (let i = 0; i < this.YAuiGrid.getGridData().length; i++) {
        if (
          this.YAuiGrid.getGridData()[i].startYmd <
            this.checkupPlan.period[0] ||
          this.YAuiGrid.getGridData()[i].endYmd > this.checkupPlan.period[1] ||
          (!this.YAuiGrid.getGridData()[i].startYmd &&
            !this.YAuiGrid.getGridData()[i].endYmd)
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395',
            message: this.$comm.getLangSpecInfoMessage('M0000000425', {
              s1: this.checkupPlan.period[0],
              s2: this.checkupPlan.period[1],
            }), // 기관별 검진기간의 범위는 {s1}부터 {s2}까지 입니다.
            type: 'warning',
          });
          return true;
        }
        // '기관별 검진기간의 범위는  ' +
        //       this.checkupPlan.period[0] +
        //       '부터  ' +
        //       this.checkupPlan.period[1] +
        //       '까지 입니다.',
        return false;
      }
    },
    _beforeCheck(mode) {
      this.checkupPlan.checkupPlanOrgs = this.YAuiGrid.getGridData();
      let confirmMsg;
      if (mode === 'insert') confirmMsg = 'M0000000011'; // 저장하시겠습니까?
      else if (mode === 'update') confirmMsg = 'M0000000011'; // 저장하시겠습니까?

      // this.checkupPlan.period에 빈배열이 들어가서 vee-validation이 적용이 되지 않아 null할당
      if (
        !this.checkupPlan.period ||
        this.checkupPlan.period.length === 0 ||
        this.checkupPlan.period[0] == null
      ) {
        this.checkupPlan.period = null;
      }
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321',
              message: confirmMsg,
              type: 'info',
              confirmCallback: () => {
                if (this.YAuiGrid.getGridData() <= 0) {
                  window.getApp.$emit('ALERT', {
                    title: 'L0000003395', // '안내',
                    message: 'M0000000407', // 검진기관을 선택하세요.
                    type: 'warning',
                  });
                  return;
                }
                if (mode === 'insert') {
                  this.checkupPlan.createUserId = this.$store.getters.token;
                  this.isInsert = true;
                } else if (mode === 'update') {
                  this.checkupPlan.updateUserId = this.$store.getters.token;
                  this.isEmit = true;
                }
                this.checkupPlan.startYmd = this.checkupPlan.period[0];
                this.checkupPlan.endYmd = this.checkupPlan.period[1];
                // this.$_.forEach(this.gridOptions.data, _item => {
                //   _item.startYmd = _item.startEndYmd[0];
                //   _item.endYmd = _item.startEndYmd[1];
                // });
                this.checkupPlan.checkupPlanOrgs = this.YAuiGrid.getGridData();
              },
              cancelCallback: () => {
                if (mode === 'insert') this.isInsert = false;
                else if (mode === 'update') this.isEmit = false;
              },
            });
          } else if (!_result) {
            this.$popupRequired.check(
              'checkupPlanDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000876' // 유효성 검사도중 에러가 발생하였습니다.
          );
          if (mode === 'insert') this.isInsert = false;
          else if (mode === 'update') this.isEmit = false;
        });
    },
    checkDuplicate(index) {
      let checkDup = [];
      this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
        checkDup.push(Number(item.heaCheckupOrgNo));
      });
      let set = new Set(checkDup);
      if (set.size !== checkDup.length) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000426',
          // 중복된 검진 기관이 존재합니다.
          type: 'warning',
        });

        return true;
      }
      return false;
    },
    beforeDelete() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.isDelete = true;
        },
        cancelCallback: () => {
          this.isDelete = false;
        },
      });
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 확인
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
      this.btnClosePopup();
    },
    // 팝업 닫기
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
