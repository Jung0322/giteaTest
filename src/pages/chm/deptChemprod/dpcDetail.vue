<!--
  목적 : 기초정보 > 부서별 화학자재 > 화학자재 정보 탭
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 부서별 화학자재 상세 -->
    <b-row>
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 부서공정별 화학자재 -->
            <y-label
              label="L0000003861"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn title="L0000002474" color="orange" @btnClicked="save" />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant
                type="edit"
                filter="chm"
                :editable="editable && !updateMode"
                name="plantCd"
                :required="true"
                v-model="deptProcessChemprod.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-dept
                type="edit"
                :editable="editable && !updateMode"
                :required="true"
                name="deptCd"
                v-model="deptProcessChemprod.deptCd"
                :plantCd="deptProcessChemprod.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-tree-process
                :required="true"
                name="processCd"
                type="edit"
                :editable="editable && !updateMode"
                :plantCd="deptProcessChemprod.plantCd"
                :deptCd="deptProcessChemprod.deptCd"
                v-model="deptProcessChemprod.processCd"
                v-validate="'required'"
                :state="validateState('processCd')"
              ></y-tree-process>
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
                v-model="deptProcessChemprod.useYn"
              ></y-switch>
              <!-- L0000001440: 사용 -->
              <!-- L0000001063: 미사용 -->
            </b-col>
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mb-3">
              <div slot="buttonGroup" class="float-right mb-1">
                 추가 
                <y-btn
                  v-if="editable"
                  title="L0000002892"
                  color="orange"
                  @btnClicked="searchChemprod"
                />
                 제외 
                <y-btn
                  v-if="gridOptions.data && gridOptions.data.length > 0 && editable"
                  title="L0000002620"
                  color="red"
                  @btnClicked="btnReject"
                />
              </div>
               화학자재 
              <y-data-table
                label="L0000003309"
                ref="dataTable"
                minHeight="150"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                v-model="selectedValue"
                :checkItemData="checkItemData"
                :editable="editable"
                checkKey="chemProdNo"
                @inputChange="inputChange"
              >
                <el-table-column
                  v-if="editable"
                  slot="selection"
                  type="selection"
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
                :label="this.$comm.getLangSpecInfoLabel('L0000003309')"
                :useExcelExport="false"
                :enableCellMerge="true"
                :enableSorting="true"
                :showGridSetSave="true"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"
                @btnReject="btnReject"
                @searchChemprod="searchChemprod"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  name: 'dpc-detail',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        rowData: null,
      }),
    },
  },
  data() {
    return {
      deptProcessChemprod: {
        plantCd: null,
        deptCd: null,
        processCd: '',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        chemProds: [],

        changeChemProds: [],
        insertChemProds: [],
        deleteChemProds: [],
        updateChemProds: [],
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
      gridOptions: {
        name: 'dpcDetail',
        btns: [],
        header: [],
        data: [],
        height: 350,
      },
      YAuiGrid: null,
      editable: false,
      editInput: false,
      updateMode: false,
      handlingTypeItems: [],
      handlingTypes: [],
      usageUnitItems: [], // 단위
      isInsert: false,
      isEdit: false,
      selectedValue: [],
      checkItemData: [],
    };
  },
  watch: {
    rowData: {
      handler: function (newValue, oldValue) {
        this.getDetail();
      },
      deep: true,
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // 취급형태
      this.$comm.getComboItems('RSA_HANDLING_TYPE', false).then((_result) => {
        this.handlingTypeItems = _result;

        // 사용단위
        this.$comm.getComboItems('RSA_CHEM_UNIT', false).then((_result) => {
          this.usageUnitItems = _result;
          this.initGrid().then(() => {
            if (this.popupParam) this.getDetail();
          });
        });
      });

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'searchChemprod',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'btnReject',
        },
      ];
    },
    initGrid() {
      return new Promise((resolve) => {
        // selectBox항목(사용단위, 취급형태)이 모두 로드된 후 헤더를 그려야 한다.
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003318'),
            dataField: 'chemProdNmKr',
            width: '20%',
            style: 'left-align',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003319'),
            dataField: 'chemProdNmEn',
            width: '20%',
            style: 'left-align',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000158'),
            dataField: 'sapMatCd',
            width: '20%',
            editable: false,
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002267'),
            dataField: 'dayUsage',
            width: '10%',
            style: 'right-align',
            editRenderer: {
              type: 'InputEditRenderer',
              onlyNumeric: true,
              maxlength: 10, // 글자수 3으로 제한
              autoThousandSeparator: true,
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001443'),
            dataField: 'usageUnit',
            width: '10%',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.usageUnitItems;
              },
              keyField: 'code',
              valueField: 'codeNm',
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001456'),
            dataField: 'substanceUsing',
            width: '10%',
            style: 'left-align',
            editRenderer: {
              type: 'InputEditRenderer',
              maxlength: 15,
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002918'),
            dataField: 'handlingType',
            width: '10%',
            renderer: {
              type: 'DropDownListRenderer',
              listFunction: (rowIndex, columnIndex, item, dataField) => {
                return this.handlingTypeItems;
              },
              keyField: 'code',
              valueField: 'codeNm',
            },
          },
        ];
        resolve();
      });
    },
    // 부서별 화학자재 상세
    getDetail() {
      if (!this.popupParam.rowData.processCd) return;
      this.$http.url = selectConfig.chm.deptChemprod.get.url;
      this.$http.param = { processCd: this.popupParam.rowData.processCd };
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.deptProcessChemprod = _result.data;
          this.gridOptions.data = this.deptProcessChemprod.chemProds;
          this.YAuiGrid.setGridData(this.deptProcessChemprod.chemProds);
          this.deptProcessChemprod.insertChemProds = [];
          this.deptProcessChemprod.deleteChemProds = [];
          this.deptProcessChemprod.updateChemProds = [];
          this.updateMode = true;
          this.editInput = true;
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
    searchChemprod() {
      this.popupOptions.target = () => import(`${'../chemprod/chemprod.vue'}`);
      this.popupOptions.title = 'L0000003309'; // '화학자재';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closePopupSearchChemProd;
    },
    closePopupSearchChemProd(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data) {
        this.$_.forEach(data.data, (data) => {
          if (
            this.$_.indexOf(
              this.$_.map(this.YAuiGrid.getGridData(), 'chemProdNo'),
              data.chemProdNo
            ) > -1
          ) {
            return;
          }
          let row = {
            chemProdNo: data.chemProdNo,
            chemProdNmKr: data.chemProdNmKr,
            chemProdNmEn: data.chemProdNmEn,
            sapMatCd: data.sapMatCd,
            dayUsage: 0,
            usageUnit: null,
            substanceUsing: '',
            handlingType: null,
          };
          this.YAuiGrid.addRow(row, 'last');
        });
        this.deptProcessChemprod.insertChemProds = this.YAuiGrid.getGridData();
      }
    },
    btnReject() {
      if (this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000160', // '제외할 항목을 선택하세요.
          type: 'warning',
        });
      } else {
        this.$_.forEach(this.selectedValue, (item) => {
          this.gridOptions.data = this.$_.clone(
            this.$_.reject(this.gridOptions.data, {
              chemProdNo: item.chemProdNo,
            })
          );
          if (item.hasOwnProperty('createUserId')) {
            if (!this.deptProcessChemprod.deleteChemProds) {
              this.deptProcessChemprod.deleteChemProds = [];
            }
            this.deptProcessChemprod.deleteChemProds.push(item.chemProdNo);
          }
        });
      }
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    inputChange(row) {
      if (!this.deptProcessChemprod.updateChemProds) {
        this.deptProcessChemprod.updateChemProds = [];
      }
      if (
        this.deptProcessChemprod.updateChemProds &&
        this.deptProcessChemprod.updateChemProds.length > 0
      ) {
        if (
          this.$_.indexOf(
            this.deptProcessChemprod.updateChemProds,
            row.chemProdNo
          ) === -1
        ) {
          this.deptProcessChemprod.updateChemProds.push(row.chemProdNo);
        }
      }
    },
    closePopup() {
      this.$emit('closePopup');
    },
    save() {
      const message = 'M0000000011'; // 저장하시겠습니까?
      let promises = [
        {
          func: this.checkValdation,
          exceptionMessage: 'M0000000005', // '필수 입력값을 입력해 주세요.',
        },
        {
          func: this.checkData,
        },
        {
          func: this.confirm,
          param: message,
        },
        {
          func: this.saveData,
          successMessage: 'M0000000006', // '저장되었습니다.',
        },
      ];
      this.$comm.orderedPromise(promises);
    },
    checkValdation() {
      return new Promise((_resolve, _reject) => {
        this.$validator
          .validateAll()
          .then((result) => {
            if (!result) {
              this.$popupRequired.check('dpcDetail', this.$data, this.errors);
              return;
            }
            if (
              !this.YAuiGrid.getGridData() ||
              this.YAuiGrid.getGridData().length === 0
            ) {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000175', // '화학자재를 추가해 주세요.',
                type: 'warning',
              });
              return;
            }
            _resolve(result);
          })
          .catch((_error) => {
            _reject(_error);
          });
      });
    },
    checkData() {
      return new Promise((_resolve, _reject) => {
        this.$http.url = selectConfig.chm.deptChemprod.check.url;
        this.$http.type = 'GET';
        this.$http.param = {
          deptCd: this.deptProcessChemprod.deptCd,
          processCd: this.deptProcessChemprod.processCd,
        };
        this.$http.request((_result) => {
          let error = 'M0000000927'; // '이미 등록된 공정입니다.';
          // _result.data.cnt: 중복 데이터 체크, !this.popupParam: '신규등록 or 수정' 체크
          if (this.$_.parseInt(_result.data.cnt) && !this.popupParam) {
            _reject(error);
          } else {
            _resolve(true);
          }
        });
      });
    },
    confirm(_message) {
      return new Promise((_resolve, _reject) => {
        window.getApp.$emit('CONFIRM', {
          title: 'L0000003321', // '확인',
          message: _message,
          // TODO : 필요시 추가하세요.
          type: 'info', // success / info / warning / error
          // 확인 callback 함수
          confirmCallback: () => {
            _resolve(true);
          },
          // 취소 callback 함수
          cancelCallback: () => {
            _resolve(false);
          },
        });
      });
    },
    saveData() {
      return new Promise((_resolve, _reject) => {
        // 화학자재정보 전달.
        this.deptProcessChemprod.chemProds = this.YAuiGrid.getGridData();
        this.deptProcessChemprod.changeChemProds = this.$_.union(
          this.deptProcessChemprod.insertChemProds,
          this.deptProcessChemprod.deleteChemProds
        );
        this.deptProcessChemprod.changeChemProds = this.$_.union(
          this.deptProcessChemprod.changeChemProds,
          this.deptProcessChemprod.updateChemProds
        );
        let temptPk = [];
        this.$_.forEach(this.deptProcessChemprod.changeChemProds, (item) => {
          temptPk.push(item.chemProdNo);
        });
        this.deptProcessChemprod.changeChemProds = temptPk;
        let _url = null;
        if (this.popupParam) {
          this.$http.type = 'PUT';
          _url = transactionConfig.chm.deptChemprod.edit.url;
          this.deptProcessChemprod.updateUserId = this.$store.getters.token;
        } else {
          this.$http.type = 'POST';
          _url = transactionConfig.chm.deptChemprod.insert.url;
          this.deptProcessChemprod.createUserId = this.$store.getters.token;

          this.updateMode = true;
          this.editInput = true;
        }

        this.$http.url = _url;

        this.$http.param = this.deptProcessChemprod;
        this.$http.request(
          (_result) => {
            _resolve(true);
            this.closePopup();
          },
          (_error) => {
            _reject(_error);
          }
        );
      });
    },
  },
};
</script>
