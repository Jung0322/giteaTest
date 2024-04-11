<!--
  목적 : 건강관리실 - 건강관리실 일반업무
  Detail :
  examples:
  -->
<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 상담 등록 -->
            <y-label
              :label="$comm.getLangSpecInfoLabel('L0000001515')"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && insertMode"
                :action-url="insertUrl"
                :param="consult"
                :is-submit="isInsertSubmit"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="editable && updateMode"
                :action-url="editUrl"
                :param="consult"
                :is-submit="isEditSubmit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn title="L0000000881" @btnClicked="closePopupUsage" />
              <!-- 닫기 -->
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <y-plant
                :required="true"
                :editable="editable"
                type="edit"
                name="plantCd"
                v-model="consult.plantCd"
                v-validate="'required'"
                :state="validateState('userNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 상담일자 -->
              <y-datepicker
                :width="8"
                :editable="editable"
                label="L0000001523"
                name="visitYmd"
                v-model="consult.visitYmd"
                default="today"
                :end="today"
                :required="true"
                v-validate="'required'"
                :error-msg="errors.first('visitYmd')"
                :state="validateState('visitYmd')"
              ></y-datepicker>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 방문자 -->
              <y-text
                :width="8"
                :editable="editable"
                :clearable="true"
                ui="bootstrap"
                name="userNm"
                label="L0000001105"
                :disabled="true"
                v-model="consult.userNm"
                :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
                @searchUser="btnSearchUserClicked"
                :required="true"
                v-validate="'required'"
                :state="validateState('userNm')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 상담구분 -->
              <y-select
                :width="8"
                :editable="editable"
                :disabled="disable"
                :comboItems="heaCounselTypeCdItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                type="edit"
                label="L0000001517"
                name="counselTypeCd"
                v-model="consult.counselTypeCd"
                :required="true"
                v-validate="'required'"
                :state="validateState('counselTypeCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 상담자 -->
              <y-text
                :width="8"
                :editable="editable"
                :clearable="true"
                :maxlength="20"
                ui="bootstrap"
                name="counselor"
                label="L0000001524"
                v-model="consult.counselor"
              />
            </b-col>
          </b-row>
          <b-row class="mt-3">
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 과거력 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="600"
                ui="bootstrap"
                label="L0000000559"
                name="diseasePast"
                v-model="consult.diseasePast"
                :rows="2"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 현병력 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="600"
                ui="bootstrap"
                label="L0000003240"
                name="diseaseCurr"
                v-model="consult.diseaseCurr"
                :rows="2"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 증상 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="600"
                ui="bootstrap"
                label="L0000002745"
                name="symptom"
                v-model="consult.symptom"
                :rows="2"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 상담내용 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="600"
                ui="bootstrap"
                label="L0000001519"
                name="consult"
                v-model="consult.consult"
                :required="true"
                v-validate="'required'"
                :state="validateState('consult')"
                :rows="2"
              ></y-textarea>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <!-- 상담결과 및 특이사항 -->
              <y-textarea
                :width="10"
                :editable="editable"
                :maxlength="150"
                ui="bootstrap"
                label="L0000001516"
                name="remark"
                v-model="consult.remark"
                :rows="2"
              ></y-textarea>
            </b-col>
            <!-- 측정 -->
            <el-divider content-position="left">{{
              $comm.getLangSpecInfoLabel('L0000004334')
            }}</el-divider>
            <!-- 검사 s -->
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 혈당 -->
              <y-number
                :width="8"
                :editable="editable"
                :clearable="true"
                :maxlength="8"
                ui="bootstrap"
                name="bldSugVal"
                label="L0000003243"
                v-model="consult.bldSugVal"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 콜레스테롤 -->
              <y-number
                :width="8"
                :editable="editable"
                :clearable="true"
                :maxlength="8"
                ui="bootstrap"
                name="cholesterolVal"
                label="L0000002985"
                v-model="consult.cholesterolVal"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 혈압 - 수축기 -->
              <y-number
                :width="8"
                :editable="editable"
                :clearable="true"
                :maxlength="8"
                ui="bootstrap"
                name="bldPressContVal"
                label="L0000003244"
                v-model="consult.bldPressContVal"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 혈압 - 이완기 -->
              <y-number
                :width="8"
                :editable="editable"
                :clearable="true"
                :maxlength="8"
                ui="bootstrap"
                name="bldPressReleVal"
                label="L0000003245"
                v-model="consult.bldPressReleVal"
              />
            </b-col>
            <!-- 검사 e -->
            <!-- 투약 -->
            <el-divider content-position="left">{{
              $comm.getLangSpecInfoLabel('L0000004335')
            }}</el-divider>
            <!-- <b-col sm="12">
              <div slot="buttonGroup" class="float-right mb-1">
                 추가 
                <y-btn
                  v-if="editable"
                  title="L0000002892"
                  color="orange"
                  @btnClicked="addDrug"
                />
                - 삭제 
                <y-btn
                  v-if="editable"
                  title="L0000001495"
                  color="red"
                  @btnClicked="deleteDrug"
                />
              </div>
               투약 약품 목록 
              <y-data-table
                label="L0000004336"
                ref="dataTable"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="consult.drugSuplies"
                v-model="gridOptions.selectedData"
                :use-paging="true"
              >
                <el-table-column
                  v-if="editable"
                  type="selection"
                  slot="selection"
                  align="center"
                  width="55"
                ></el-table-column>
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
                :label="this.$comm.getLangSpecInfoLabel('L0000004336')"
                :useExcelExport="false"
                :enableCellMerge="true"
                :enableSorting="true"
                :showGridSetSave="true"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"
                :showRowCheckColumn="true"
                @btnAddRow="btnAddRow"
                @btnDelRow="btnDelRow"
                @cellEditEnd="cellEditEndHandler"
              />
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
  name: 'create-general-business',
  props: {
    popupParam: {
      type: Object,
      default: {
        heaConsultNo: 0,
        pageNm: '',
      },
    },
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      consult: {
        plantCd: '',
        heaConsultNo: 0,
        userId: null,
        userNm: '',
        deptCd: '',
        visitYmd: '',
        counselTypeCd: null,
        counselor: '',
        diseasePast: '',
        diseaseCurr: '',
        symptom: '',
        consult: '',
        remark: '',
        createUserId: '',
        creatDt: '',
        updateUserId: '',
        updateDt: '',
        bldSugVal: null,
        cholesterolVal: null,
        bldPressContVal: null,
        bldPressReleVal: null,
        drugSuplies: [],
        deleteDrugSuplies: [],
      },
      gridOptions: {
        name: 'createGeneralBusiness',
        btns: [],
        header: [],
        height: '350',
        selectedData: [],
      },
      YAuiGrid: null,
      isInsertSubmit: false,
      isEditSubmit: false,
      editable: true,
      insertMode: false,
      updateMode: false,
      insertUrl: '',
      editUrl: '',
      heaCounselTypeCdItems: [],
      today: '',
      disable: false,
    };
  },
  watch: {
    'consult.visitYmd': function (newValue, oldValue) {
      if (
        newValue < this.today &&
        this.tempYmd !== newValue &&
        newValue !== ''
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000442', // 과거 날짜를 선택하였습니다.
          type: 'warning', // success / info / warning / error
        });
        this.tempYmd = this.today;
      }
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
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
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001915'),
          dataField: 'heaDrugNm',
          width: '50%',
          style: 'left-align',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004337'),
          dataField: 'amount',
          width: '30%',
          editable: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'unit',
          width: '20%',
          editable: false,
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAddRow',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelRow',
        },
      ];

      // 오늘 날짜 구하기
      this.today = this.$comm.getToday();

      // 수정 또는 신규등록 버튼 Mode
      if (this.popupParam.heaConsultNo !== 0) {
        this.getConsult();
      } else {
        this.insertMode = true;
        this.consult.visitYmd = this.$_.clone(this.today);
      }

      this.insertUrl = transactionConfig.hea.consult.insert.url;
      this.editUrl = transactionConfig.hea.consult.edit.url;

      this.$comm.getComboItems('HEA_COUNSEL_TYPE', false).then((_result) => {
        this.heaCounselTypeCdItems = _result;
      });

      // 관리대상유소견자 화면에서 신규등록할 경우 상담구분 고정값 설정
      if (this.popupParam.counselTypeCd) {
        this.consult.userId = this.popupParam.userId;
        this.consult.userNm = this.popupParam.userNm;
        this.consult.deptCd = this.popupParam.deptCd;
        this.consult.counselTypeCd = this.popupParam.counselTypeCd;

        this.disable = true;
      }
    },
    /** /초기화 관련 함수 **/
    getConsult() {
      this.$http.url = this.$format(
        selectConfig.hea.consult.get.url,
        this.popupParam.heaConsultNo
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.$_.extend(this.consult, _result.data);
          this.YAuiGrid.setGridData(this.consult.drugSuplies);
          this.tempYmd = this.consult.visitYmd;
          this.updateMode = true;
          this.insertMode = false;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeInsert() {
      this._beforeCheck('insert');
    },
    beforeEdit() {
      this._beforeCheck('edit');
    },
    _beforeCheck(mode) {
      let confirmMsg = '';
      if (mode === 'insert') {
        confirmMsg = 'M0000000011'; // 저장하시겠습니까?
      } else if (mode === 'edit') {
        confirmMsg = 'M0000000011'; // 저장하시겠습니까?
      }

      if (this.consult.userNm === '') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000443', // 방문자를 선택해 주세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: confirmMsg,
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                if (mode === 'insert') {
                  this.consult.createUserId = this.$store.getters.token;
                  this.isInsertSubmit = true;
                } else if (mode === 'edit') {
                  this.consult.updateUserId = this.$store.getters.token;
                  this.isEditSubmit = true;
                }
              },
            });
          } else {
            window.getApp.$emit('ALERT', {
              title: 'L0000003395', // '안내',
              message: 'M0000000005', // '필수 입력값을 입력해 주세요.',
              type: 'warning',
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    /** validation checking **/
    validateState(_ref) {
      if (
        this.veeBag[_ref] &&
        (this.veeBag[_ref].dirty || this.veeBag[_ref].validated)
      ) {
        return !this.errors.has(_ref);
      }
      return null;
    },

    /** Button Event **/
    btnInsertClickedCallback(_result) {
      this.popupParam.heaConsultNo = _result.data;
      this.isInsertSubmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.getConsult();
    },
    btnEditClickedCallback(_result) {
      this.isEditSubmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // 저장되었습니다.
        type: 'success',
      });
      this.getConsult();
    },
    btnClickedErrorCallback(_result) {
      this.isInsertSubmit = false;
      this.isEditSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
      this.closePopupUsage();
    },
    closePopupUsage() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.consult.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.consult.userNm = data.user.userNm;
        this.consult.userId = data.user.userId;
        this.consult.deptCd = data.user.deptCd;
      }
    },
    btnAddRow() {
      this.popupOptions.target = () =>
        import(`${'@/pages/hea/baseInfo/drugManage.vue'}`);
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.title = 'L0000001915'; // 약품
      this.popupOptions.visible = true;
      this.popupOptions.width = '75%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopupDrug;
    },
    cellEditEndHandler() {
      this.consult.drugSuplies = this.YAuiGrid.getGridData();
    },
    addDrug() {
      this.popupOptions.target = () =>
        import(`${'@/pages/hea/baseInfo/drugManage.vue'}`);
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.title = 'L0000001915'; // 약품
      this.popupOptions.visible = true;
      this.popupOptions.width = '75%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopupDrug;
    },
    closePopupDrug(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data && data.length > 0) {
        this.$_.forEach(data, (item) => {
          if (
            this.$_.findIndex(this.consult.drugSuplies, {
              heaDrugNo: item.heaDrugNo,
            }) === -1
          ) {
            this.consult.drugSuplies.push(item);
          }
        });
      }
      this.YAuiGrid.setGridData(this.consult.drugSuplies);
    },
    btnDelRow() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      let gridData = this.YAuiGrid.getGridData();
      if (checkingData.length === 0 || !checkingData) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001036', // 삭제할 약품을 하나 이상 선택해주세요',
          type: 'warning',
        });
      } else {
        this.$_.forEach(checkingData, (item) => {
          if (item.heaConsultNo > 0) {
            if (!this.consult.deleteDrugSuplies) {
              this.consult.deleteDrugSuplies = [];
            }
            this.consult.deleteDrugSuplies.push(item);
          }
          gridData = this.$_.reject(gridData, item);
        });
        this.YAuiGrid.setGridData(gridData);
      }
    },
    deleteDrug() {
      if (
        this.gridOptions.selectedData.length === 0 ||
        !this.gridOptions.selectedData
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000001036', // 삭제할 약품을 하나 이상 선택해주세요',
          type: 'warning',
        });
      } else {
        this.$_.forEach(this.gridOptions.selectedData, (item) => {
          if (item.heaConsultNo > 0) {
            if (!this.consult.deleteDrugSuplies) {
              this.consult.deleteDrugSuplies = [];
            }
            this.consult.deleteDrugSuplies.push(item);
          }
          this.consult.drugSuplies = this.$_.reject(
            this.consult.drugSuplies,
            item
          );
        });
      }
    },
    /** /Button Event **/
  },
};
</script>
