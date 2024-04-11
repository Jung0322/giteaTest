<!--
  목적 : 측정위치 관리
  작성자 : kkc (2021-02-16 수정 etg)
  Detail : 측정위치 조회,등록,수정
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row class="mt-3" ref="insertBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 측정위치 상세 -->
            <y-label
              label="L0000002946"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="editable && updateMode && !popupParam.popMode"
                :action-url="editUrl"
                :param="ewtrMonPos"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 저장 -->
              <y-btn
                v-if="editable && !updateMode && !popupParam.popMode"
                :action-url="insertUrl"
                :param="ewtrMonPos"
                :is-submit="isInsert"
                title="L0000002474"
                color="orange"
                action-type="POST"
                beforeSubmit="beforeInsert"
                @beforeInsert="beforeInsert"
                @btnClicked="btnInsertClickedCallback"
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
                :editable="editable && !popupParam.popMode"
                name="plantCd"
                v-model="ewtrMonPos.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 관리부서 -->
              <y-tree-dept
                label="L0000000591"
                name="deptCd"
                type="edit"
                v-model="ewtrMonPos.deptCd"
                :plantCd="ewtrMonPos.plantCd"
                :required="true"
                :editable="editable && !popupParam.popMode"
                v-validate="'required'"
                :state="validateState('deptCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 측정위치명 -->
              <y-text
                :width="8"
                :editable="editable && !popupParam.popMode"
                :maxlength="30"
                ui="bootstrap"
                label="L0000002949"
                name="ewtrMonPosNm"
                v-model="ewtrMonPos.ewtrMonPosNm"
                :required="true"
                v-validate="'required'"
                :state="validateState('ewtrMonPosNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 측정횟수 -->
              <y-select
                :width="8"
                :editable="editable && !popupParam.popMode"
                :comboItems="measureCntTypeItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="wtrPerdCd"
                label="L0000002965"
                :required="true"
                v-validate="'required'"
                :state="validateState('wtrPerdCd')"
                v-model="ewtrMonPos.wtrPerdCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 사용여부 -->
              <y-switch
                :width="8"
                :editable="editable && !popupParam.popMode"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="ewtrMonPos.useYn"
              ></y-switch>
              <!-- L0000001440: 사용 -->
              <!-- L0000001063: 미사용 -->
            </b-col>
            <!-- 검사항목 목록 -->
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <y-auigrid
                ref="yAuiGrid"
                :editable="this.editable && !this.popupParam.popMode"
                :name="testitemgridOptions.name"
                :headers="testitemgridOptions.header"
                :btns="testitemgridOptions.btns"
                :height="testitemgridOptions.height"
                :items="testitemgridOptions.data"
                :label="this.$comm.getLangSpecInfoLabel('L0000002835')"
                :useExcelExport="false"
                :enableSorting="true"
                :showGridSetSave="true"
                :showRowCheckColumn="true"
                @btnPopupClickedCallback="btnPopupClickedCallback"
                @btnReject="btnReject"
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
  /* attributes: name, components, props, data */
  name: 'mon-pos-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        ewtrMonPosNo: 0,
        popMode: false,
      },
    },
  },
  data() {
    return {
      ewtrMonPos: {
        ewtrMonPosNo: 0,
        ewtrMonPosNm: '',
        remark: '',
        sortOrder: '',
        useYn: 'Y',
        plantCd: null,
        deptCd: null,
        ewtrMonCount: '',
        wtrPerdCd: '',
        selectedTestItemCds: [],
        createUserId: '',
        createUserNm: '',
        createDt: '',
        updateUserId: '',
        updateUserNm: '',
        updateDt: '',
        monPosTestItem: [],
      },
      testitemgridOptions: {
        name: 'monPosDetail',
        header: [],
        data: [],
        btns: [],
        height: 250,
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      selectedValue: [],
      editable: true,
      updateMode: false,
      isInsert: false,
      isEdit: false,
      testItemItems: [],
      editUrl: '',
      insertUrl: '',
      measureCntTypeItems: [], // 측정횟수
      YAuiGrid: null,
    };
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
    this.getDetail();
  },
  beforeDestory() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.editUrl = transactionConfig.env.water.baseInfo.monPos.edit.url;
      this.insertUrl = transactionConfig.env.water.baseInfo.monPos.insert.url;

      this.$comm.getComboItems('EAIR_SELF_TEST_PERD', false).then((_result) => {
        this.measureCntTypeItems = _result;
      });

      this.testitemgridOptions.header = [
        // 검사항목
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000319'),
          dataField: 'ewtrTestItemNm',
          width: '25%',
          style: 'left-align',
          editable: false,
        },
        // 단위
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
          dataField: 'envUnitNm',
          width: '25%',
          style: 'left-align',
          editable: false,
        },
        // 법적기준
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001212'),
          dataField: 'legalLimit',
          width: '25%',
          style: 'right-align',
          dataType: 'numeric',
          formatString: '#,##0',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 9,
            autoThousandSeparator: true,
          },
        },
        // 자체기준
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002336'),
          dataField: 'selfLimit',
          width: '25%',
          style: 'right-align',
          dataType: 'numeric',
          formatString: '#,##0',
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 9,
            autoThousandSeparator: true,
          },
        },
      ];
      this.setGridBtn();
      this.getDetail();
    },
    setGridBtn() {
      this.testitemgridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'), // 추가
          color: 'blue',
          btnClicked: 'btnPopupClickedCallback',
          visible: this.editable && !this.popupParam.popMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'), // 삭제
          color: 'red',
          btnClicked: 'btnReject',
          visible:
            this.testitemgridOptions.data.length > 0 &&
            this.editable &&
            !this.popupParam.popMode,
        },
      ];
    },
    getDetail() {
      if (this.popupParam.ewtrMonPosNo === 0) return;
      this.$http.url = this.$format(
        selectConfig.env.water.baseInfo.monPos.get.url,
        this.popupParam.ewtrMonPosNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.updateMode = true;
          this.ewtrMonPos = this.$_.clone(_result.data);
          this.testitemgridOptions.data = _result.data.monPosTestItem;
          this.setGridBtn();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** button 관련 이벤트 **/
    btnInsertClickedCallback(_result) {
      this.popupParam.ewtrMonPosNo = _result.data;
      this.isInsert = false;
      this.updateMode = true;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
      this.getDetail();
    },
    btnPopupClickedCallback() {
      this.openPopup(null);
    },
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./testItem.vue'}`);
      this.popupOptions.title = 'L0000000319'; // '검사항목';
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closeTestItemPopup;
    },
    closeTestItemPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        this.$_.forEach(data.data, (item) => {
          if (
            this.$_.findIndex(this.testitemgridOptions.data, {
              ewtrTestItemCd: item.ewtrTestItemCd,
            }) === -1
          ) {
            this.testitemgridOptions.data.push({
              ewtrTestItemNm: item.ewtrTestItemNm,
              ewtrTestItemCd: item.ewtrTestItemCd,
              envUnitNm: item.envUnitNm,
              useYn: item.useYn,
              selfLimit: 0,
              legalLimit: 0,
            });
          }
        });
      }
      this.setGridBtn();
    },
    beforeInsert() {
      this.updateMode = false;
      this.$http.url = selectConfig.env.water.baseInfo.monPos.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrMonPosNo: 0,
        plantCd: this.ewtrMonPos.plantCd,
        ewtrMonPosNm: this.ewtrMonPos.ewtrMonPosNm,
      };
      this.$http.request((_result) => {
        if (_result.data === 0) {
          this.$validator
            .validateAll()
            .then((_result) => {
              if (_result) {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321', // '확인',
                  message: 'M0000000382', // '저장하시겠습니까?(법적기준과 자체기준이 0인 경우, 제외되고 저장이 됩니다.)',
                  type: 'info',
                  confirmCallback: () => {
                    this.ewtrMonPos.ewtrMonPosNo = 0;
                    this.ewtrMonPos.createUserId = this.$store.getters.token;
                    this.isInsert = true;
                  },
                });
              } else if (!_result) {
                this.$popupRequired.check(
                  'monPosDetail',
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
            message: 'M0000000383', // '이미 입력된 사업장의 부서별 특정위치명이 존재합니다.',
            type: 'warning',
          });
        }
      });
    },
    beforeEdit() {
      this.$http.url = selectConfig.env.water.baseInfo.monPos.check.url;
      this.$http.type = 'GET';
      this.$http.param = {
        ewtrMonPosNo: this.popupParam.ewtrMonPosNo,
        plantCd: this.ewtrMonPos.plantCd,
        ewtrMonPosNm: this.ewtrMonPos.ewtrMonPosNm,
      };
      this.$http.request((_result) => {
        if (_result.data === 0) {
          this.$validator
            .validateAll()
            .then((_result) => {
              if (_result) {
                window.getApp.$emit('CONFIRM', {
                  title: 'L0000003321', // '확인',
                  message: 'M0000000382', // '저장하시겠습니까?(법적기준과 자체기준이 0인 경우, 제외되고 저장이 됩니다.)',
                  type: 'info',
                  confirmCallback: () => {
                    this.ewtrMonPos.updateUserId = this.$store.getters.token;
                    this.isEdit = true;
                  },
                });
              } else if (!_result) {
                this.$popupRequired.check(
                  'monPosDetail',
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
            message: 'M0000000383', // '이미 입력된 사업장의 부서별 특정위치명이 존재합니다.',
            type: 'warning',
          });
        }
      });
    },
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
      this.getDetail();
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnReject() {
      if (this.YAuiGrid.getCheckedRowItems().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000057', // '삭제할 항목을 선택해주세요.',
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

        this.testitemgridOptions.data = gridData;
        this.YAuiGrid.setGridData(gridData);
        this.cellEditEndHandler();

        if (this.YAuiGrid.getRowCount() === 0) {
          this.setGridBtn();
        }
      }
    },
    cellEditEndHandler() {
      this.ewtrMonPos.monPosTestItem = this.YAuiGrid.getGridData();
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
    btnClosePopup() {
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
