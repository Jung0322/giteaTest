<!--
  목적 : 화학물질관리 > 화학물질  > 화학물질 상세
  Detail : 화학물질 등록/수정 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row ref="editBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 화학물질 상세 -->
            <y-label
              label="L0000003290"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="!popupParam.popupMode && editable"
                :action-url="saveUrl"
                :param="chem"
                :is-submit="isSave"
                title="L0000002474"
                :action-type="actionType"
                color="orange"
                before-submit="beforeSave"
                @beforeSave="beforeSave"
                @btnClicked="btnSaveClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <!-- 닫기 -->
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>
        <b-card>
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- CAS No. -->
              <y-text
                :width="8"
                :required="true"
                :editable="!popupParam.popupMode && editable"
                ui="bootstrap"
                label="L0000000102"
                name="casNo"
                v-model="chem.casNo"
                v-validate="'required'"
                :state="validateState('casNo')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 화학물질명(국문) -->
              <y-text
                :width="8"
                :required="true"
                :editable="!popupParam.popupMode && editable"
                ui="bootstrap"
                label="L0000003304"
                name="chemNmKr"
                v-model="chem.chemNmKr"
                v-validate="'required'"
                :state="validateState('chemNmKr')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 화학물질명(영문) -->
              <y-text
                :width="8"
                :required="true"
                :editable="!popupParam.popupMode && editable"
                ui="bootstrap"
                label="L0000003305"
                name="chemNmEn"
                v-model="chem.chemNmEn"
                v-validate="'required'"
                :state="validateState('chemNmEn')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 분자식 -->
              <y-text
                :width="8"
                :editable="!popupParam.popupMode && editable"
                ui="bootstrap"
                label="L0000001348"
                name="moleFormula"
                v-model="chem.moleFormula"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-4">
              <!-- 사용여부 -->
              <y-switch
                :width="8"
                :editable="!popupParam.popupMode && editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000001439"
                name="useYn"
                selectText="L0000001440"
                unselectText="L0000001063"
                v-model="chem.useYn"
              />
              <!-- L0000001440: 사용 -->
              <!-- L0000001063: 미사용 -->
            </b-col>
          </b-row>
          <!-- <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
               규제항목 목록 -
              <y-data-table
                label="L0000000730"
                ref="dataTable"
                v-model="selectedValue"
                :height="gridOptions2.height"
                :headers="gridOptions2.header"
                :items="gridOptions2.data"
                checkKey="regulItmChemValNo"
                :checkItemData="checkItemData"
                :useRownum="false"
                :popMode="true"
                :editable="!popupParam.popupMode && editable"
              >
                <el-table-column
                  v-if="!popupParam.popupMode && editable"
                  slot="selection"
                  type="selection"
                  align="center"
                  width="55"
                ></el-table-column>
              </y-data-table>
            </b-col>
          </b-row> -->
          <b-row class="grid-height grid-box">
            <b-col sm="12" class="h100p">
              <y-auigrid
                ref="yAuiGrid"
                :editable="!popupParam.popupMode && editable"
                :name="gridOptions2.name"
                :headers="gridOptions2.header"
                :btns="gridOptions2.btns"
                :height="gridOptions2.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000000730')"
                :useExcelExport="false"
                :enableCellMerge="true"
                :enableSorting="true"
                :showGridSetSave="true"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"
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
  name: 'chem-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        chemNo: 0, // 화학물질 번호
        popupMode: false, // 팝업조회모드
      },
    },
  },
  data() {
    return {
      chem: {
        chemNo: 0,
        casNo: null, // CAS No.
        chemNmKr: null, // 화학물질명(국문)
        chemNmEn: null, // 화학물질명(영문)
        moleFormula: null, // 분자식
        useYn: 'N', // 사용여부
        hisYn: 'N', // 이력여부 -- 규제DB가 들어오면서 값이 변하게 됨
        chemicalRegulItmChemVals: [],
      },
      editable: false,
      updateMode: false,
      isSave: false,
      gridOptions: {
        header: [],
        data: [],
        height: '300',
      },
      searchParam: {
        regulLawCd: null, // 규제법규
        regulItmNm: '', // 규제항목명
      },
      gridOptions2: {
        name: 'chemDetail2',
        btns: [],
        header: [],
        data: [],
        height: 600,
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      selectedValue: [],
      selectedValue2: [],
      searchDetailUrl: '',
      saveUrl: '',
      checkUrl: '',
      actionType: 'POST',
      chmUnitItems: [],
      chmStndSignItems: [], // 부등호
      selectChems: null,
      checkItemData: [],
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
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchDetailUrl = selectConfig.chm.chem.getunion.url;
      this.checkUrl = selectConfig.chm.chem.check.url;
      this.saveUrl = transactionConfig.chm.chem.insert.url;

      // 부등호
      this.$comm.getComboItems('CHM_STND_SIGN', false).then((_result) => {
        this.chmStndSignItems = _result;
        // 기준단위
        this.getchmUnitItems();
      });
      console.log('111', this.popupParam.popupMode);
      console.log('222', this.editable);
    },
    getchmUnitItems() {
      this.$http.url = selectConfig.chm.chemicalUnit.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.chmUnitItems = _result.data;
          this.chmUnitItems.splice(0, 0, {
            unitNo: 0,
            unitNm: '선택하세요',
          });
          this.initGrid();
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    initGrid() {
      let myThis = this;
      // 규제항목 grid 헤더 설정
      this.gridOptions2.header = [
        {
          headerText: '',
          dataField: 'regulItmNoCheck',
          width: '9%',
          renderer: {
            type: 'CheckBoxEditRenderer',
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
              if (value) {
                return true;
              }
            },
            disabledFunction: () => {
              if (this.popupParam.popupMode) {
                return true;
              }
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000725'),
          dataField: 'regulLawNm',
          width: '13%',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000731'),
          dataField: 'regulItmNm',
          width: '13%',
          style: 'left-align',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000786'),
          dataField: 'stndVal',
          width: '13%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000787'),
          dataField: 'unitNo',
          width: '13%',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.chmUnitItems;
            },
            keyField: 'unitNo',
            valueField: 'unitNm',
            disabledFunction: () => {
              if (this.popupParam.popupMode) {
                return true;
              }
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001286'),
          dataField: 'stndSign',
          width: '13%',
          renderer: {
            type: 'DropDownListRenderer',
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.chmStndSignItems;
            },
            keyField: 'code',
            valueField: 'codeNm',
            disabledFunction: () => {
              if (this.popupParam.popupMode) {
                return true;
              }
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002487'),
          dataField: 'startDt',
          width: '13%',
          editRenderer: {
            type: 'CalendarRenderer',
            onlyCalendar: true,
            defaultFormat: 'yyyy-mm-dd',
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002485'),
          dataField: 'endDt',
          width: '13%',
          editRenderer: {
            type: 'CalendarRenderer',
            onlyCalendar: true,
            defaultFormat: 'yyyy-mm-dd',
          },
        },
        // // 기준단위
        // { text: 'L0000000787', name: 'unitNo', width: '120px', align: 'center', type: 'select', items: this.chmUnitItems, itemText: 'unitNm', itemValue: 'unitNo', },
        // // 부등호
        // { text: 'L0000001286', name: 'stndSign', width: '100px', align: 'center', type: 'select', items: this.chmStndSignItems, itemText: 'codeNm', itemValue: 'code', },
        // 적용시작일
      ];
      this.getList();
    },
    getList() {
      if (this.popupParam.chemNo === null || this.popupParam.chemNo === '') {
        this.popupParam.chemNo = 0;
      }
      this.$http.url = this.$format(
        this.searchDetailUrl,
        this.popupParam.chemNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.chem = _result.data;
          this.chem.useYn = this.chem.useYn ? this.chem.useYn : 'N';
          if (this.chem.chemicalRegulItmChemVals) {
            this.gridOptions2.data = this.chem.chemicalRegulItmChemVals;
            let checkedVals = this.$_.filter(
              this.gridOptions2.data,
              (_item) => {
                return _item.regulItmChemValNo !== 0;
              }
            );
            this.$_.forEach(this.chem.chemicalRegulItmChemVals, (item) => {
              if (item.regulItmChemValNo !== 0) {
                item.regulItmNoCheck = 'Y';
              } else {
                item.regulItmNoCheck = 'N';
              }
            });
            this.checkItemData = this.$_.clone(checkedVals);
            this.YAuiGrid.setGridData(this.chem.chemicalRegulItmChemVals);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellEditEndHandler() {
      this.chem.chemicalRegulItmChemVals = this.YAuiGrid.getGridData();
    },
    getNewGridData() {
      this.$http.url = selectConfig.chm.chemicalRegulItem.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions2.data = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 규제법규 및 항목 검색
    getReguls() {
      var i = 0;
      var o = {};
      var regulItems = [];
      for (; i < this.YAuiGrid.getGridData().length; i++) {
        o = this.YAuiGrid.getGridData()[i];
        // regulItmChemValNo
        if (o.regulItmNoCheck === 'Y') {
          regulItems.push({
            chemNo: o.chemNo,
            regulItmChemValNo: o.regulItmChemValNo,
            startDt: o.startDt,
            endDt: o.endDt,
            regulItemNo: o.regulItemNo,
            regulLawCd: o.regulLawCd,
            stndVal: o.stndVal,
            stndSign: o.stndSign,
            unitNo: o.unitNo,
            createUserId: this.$store.getters.token,
            createUserNm: '',
          });
        }
      }
      return regulItems;
    },
    alertMessage(param) {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message:
          param === 'casNo'
            ? 'M0000000100' // '이미 같은 Cas No가 있습니다.'
            : 'M0000000101', // '이미 같은 이름의 화학물질이 있습니다.',
        type: 'warning',
      });
    },
    check(gubun) {
      this.$validator
        .validateAll()
        .then((result) => {
          if (result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              casNo: this.chem.casNo,
              chemNmKr: this.chem.chemNmKr,
              chemNmEn: this.chem.chemNmEn,
              chemNo: gubun === 'insert' ? 0 : this.popupParam.chemNo,
              chemicalRegulItmChemVals: this.getReguls(),
            };
            this.$http.request(
              (_result) => {
                var gubunList = this.$_.map(
                  this.$_.clone(_result.data),
                  'gubun'
                );
                var cntList = this.$_.map(this.$_.clone(_result.data), 'cnt');
                var casNoIndex = this.$_.indexOf(gubunList, 'cas_count');
                var chemNmKrIndex = this.$_.indexOf(
                  gubunList,
                  'chem_nm_kr_count'
                );
                var chemNmEnIndex = this.$_.indexOf(
                  gubunList,
                  'chem_nm_en_count'
                );

                if (cntList[casNoIndex] > 0) {
                  this.alertMessage('casNo');
                  return;
                } else if (
                  cntList[chemNmKrIndex] > 0 ||
                  cntList[chemNmEnIndex] > 0
                ) {
                  this.alertMessage('chemNm');
                  return;
                } else {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321', // '확인',
                    message: 'M0000000011', // 저장하시겠습니까?
                    // TODO : 필요시 추가하세요.
                    type: 'info', // success / info / warning / error
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.chem.createUserId = this.$store.getters.token;
                      this.chem.updateUserId = this.$store.getters.token;
                      this.chem.chemicalRegulItmChemVals = [];
                      this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
                        if (item.regulItmNoCheck === 'Y') {
                          this.chem.chemicalRegulItmChemVals.push(item);
                        }
                      });
                      this.isSave = true;
                    },
                    // 취소 callback 함수
                    cancelCallback: () => {
                      this.isSave = false;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else if (!result) {
            this.$popupRequired.check('chemDetail', this.$data, this.errors);
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000004' // '유효성 검사 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
          this.isSave = false;
        });
    },
    /** 신규등록 하기전 UI단 유효성 검사 **/
    beforeSave() {
      var gubun = '';
      // 신규등록
      if (this.popupParam.chemNo === 0) {
        gubun = 'insert';
        this.saveUrl = transactionConfig.chm.chem.insert.url;
        this.actionType = 'POST';
      }
      // 수정
      else {
        gubun = 'edit';
        this.saveUrl = transactionConfig.chm.chem.edit.url;
        this.actionType = 'PUT';
      }

      this.check(gubun);
    },
    /**
     * 필수입력값 유효성 검사
     */
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    /** button 관련 이벤트 **/
    /**
     * 대상부서 목록 조회 및 수정버튼 보여지도록 처리
     *  신규등록 버튼 callback
     * _result : backend에서 return하는 데이터
     */
    btnSaveClickedCallback(_result) {
      this.chem.chemNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success', // success / info / warning / error
      });
      this.isSave = false;
      this.closePopup();
    },
    /**
     * 수정 버튼 안보여지도록 처리 및 isSubmit false 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      this.isSave = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    /**
     * showAccidentPopup 호출
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    tableLinkClicked(header, data) {
      this.openPopup(data);
    },
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./chemRegulValue.vue'}`);
      this.popupOptions.title = 'L0000003819'; // '규제법규별 항목값';
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        regulItmChemValNo: data ? data.regulItmChemValNo : 0,
        data: data ? data : null,
        regulItmNos: this.$_.map(this.gridOptions.data, 'regulItmNo'),
      };
      // 신규로 창을 여는지 상세로 창을 여는지 체크
      if (data) this.updateMode = true;
      else this.updateMode = false;
      this.popupOptions.closeCallback = this.closeRegulPopup;
    },
    // 규제법규 및 항목 추가 팝업 닫기
    closeRegulPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      // 닫기가 아닌경우
      if (data.data !== 'C') {
        if (this.updateMode) {
          let selectRow =
            this.gridOptions.data[
              this.$_.findIndex(this.gridOptions.data, {
                regulItmNo: data.data.regulItmNo,
              })
            ];
          selectRow.stndVal = data.data.stndVal;
          selectRow.unitNm = data.data.unitNm;
          selectRow.unitNo = data.data.unitNo;
          selectRow.stndSign = data.data.stndSign;
          selectRow.stndSignNm = data.data.stndSignNm;
          selectRow.startDt = data.data.startDt;
          selectRow.period = data.data.startDt + ' ~ 9999-12-31';
        } else {
          this.gridOptions.data.push({
            regulLawNm: data.data.regulLawNm,
            regulLawCd: data.data.regulLawCd,
            regulItmNm: data.data.regulItmNm,
            regulItmNo: data.data.regulItmNo,
            stndVal: data.data.stndVal,
            unitNm: data.data.unitNm,
            unitNo: data.data.unitNo,
            stndSign: data.data.stndSign,
            stndSignNm: data.data.stndSignNm,
            startDt: data.data.startDt,
            endDt: '9999-12-31',
            period: data.data.startDt + ' ~ 9999-12-31',
            createUserId: this.$store.getters.token,
          });
        }
      }

      // if (data !== 'C') this.gridOptions.nodeData = data;
    },
    btnReject() {
      if (this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000160', // '제외할 항목을 선택하세요.',
          type: 'warning',
        });
      } else {
        this.$_.forEach(this.selectedValue, (item) => {
          this.gridOptions.data = this.$_.clone(
            this.$_.reject(this.gridOptions.data, {
              regulItmNo: item.regulItmNo,
            })
          );
        });
      }
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
<style scoped>
.mx-datepicker {
  width: 150px !important;
}
</style>
