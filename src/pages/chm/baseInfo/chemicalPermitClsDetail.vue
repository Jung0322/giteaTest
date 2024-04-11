<!--
  목적 : 물질관리 > 기준정보 > 인허가신고서
  작성자 : kdh
  Detail : 인허가신고서 상세/등록/수정 화면
  * 
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 인허가신고서 상세 -->
    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 인허가신고서 상세 -->
            <y-label
              label="L0000002253"
              icon="user-edit"
              color-class="cutstom-title-color"
            />
            <div slot="buttonGroup" class="float-right mb-1">
              <!-- 저장 -->
              <y-btn
                v-if="updateMode && editable"
                :action-url="editUrl"
                :param="chemicalPermitCls"
                :is-submit="isEdit"
                title="L0000002474"
                color="orange"
                action-type="PUT"
                beforeSubmit="beforeEdit"
                @beforeEdit="beforeEdit"
                @btnClicked="btnEditClickedCallback"
                @btnClickedErrorCallback="btnClickedErrorCallback"
              />
              <y-btn
                v-if="!updateMode && editable"
                :action-url="insertUrl"
                :param="chemicalPermitCls"
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
                filter="chm"
                :required="true"
                :editable="editable"
                name="plantCd"
                v-model="chemicalPermitCls.plantCd"
                v-validate="'required'"
                :state="validateState('plantCd')"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 인허가신고명 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="100"
                :required="true"
                ui="bootstrap"
                label="L0000002251"
                name="permitClsNm"
                v-model="chemicalPermitCls.permitClsNm"
                v-validate="'required'"
                :state="validateState('permitClsNm')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 인허가신고코드 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="10"
                :required="true"
                ui="bootstrap"
                label="L0000002254"
                name="permitClsCd"
                v-model="chemicalPermitCls.permitClsCd"
                v-validate="'required'"
                :state="validateState('permitClsCd')"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 인허가구분 -->
              <y-select
                :width="8"
                :required="true"
                :comboItems="permitKindSaveItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="L0000002248"
                name="permitKindCd"
                v-model="chemicalPermitCls.permitKindCd"
                v-validate="'required'"
                :state="validateState('permitKindCd')"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 인허가확인방법 -->
              <y-checkbox
                :width="8"
                :editable="editable"
                :comboItems="permitConfirmItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="permitConfirms"
                label="L0000002260"
                v-model="chemicalPermitCls.permitConfirms"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 제출기관 -->
              <y-text
                :width="8"
                :editable="editable"
                :maxlength="50"
                ui="bootstrap"
                label="L0000002633"
                name="mainOrg"
                v-model="chemicalPermitCls.mainOrg"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 처리일 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                type="search"
                ui="bootstrap"
                name="permitPeriod"
                label="L0000002839"
                v-model="chemicalPermitCls.permitPeriod"
              ></y-number>
            </b-col>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
              <y-text
                :width="10"
                :editable="editable"
                :maxlength="60"
                ui="bootstrap"
                label="URL"
                name="permitUrl"
                v-model="chemicalPermitCls.permitUrl"
              ></y-text>
            </b-col>

            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 필수여부 -->
              <!-- 필수, 선택 -->
              <y-switch
                :width="8"
                :editable="editable"
                true-value="Y"
                false-value="N"
                ui="bootstrap"
                label="L0000003163"
                name="needYn"
                selectText="L0000003854"
                unselectText="L0000001561"
                v-model="chemicalPermitCls.needYn"
              />
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
                v-model="chemicalPermitCls.useYn"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 정렬순서 -->
              <y-number
                :width="8"
                :editable="editable"
                :maxlength="5"
                :hasSeperator="false"
                :isPositive="true"
                ui="bootstrap"
                name="sortOrder"
                label="L0000002601"
                v-model="chemicalPermitCls.sortOrder"
              ></y-number>
            </b-col>
            <!-- <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mb-3">
              - 관련법규 및 규제사항 
              <y-data-table
                label="L0000000569"
                ref="dataTableRegulItem"
                :height="gridOptions.regulItemHeight"
                :headers="gridOptions.regulItemHeader"
                :items="gridOptions.regulItemData"
                :fixwithclass="gridOptions.checkGroupStyle"
                minHeight="250px"
                :popMode="true"
              ></y-data-table>
            </b-col> -->
            <b-col sm="12" class="h100p">
              <y-auigrid
                ref="yAuiGrid"
                :name="gridOptions.name"
                :headers="gridOptions.regulItemHeader"
                :height="gridOptions.regulItemHeight"
                :label="this.$comm.getLangSpecInfoLabel('L0000000569')"
                :useExcelExport="false"
                :enableSorting="true"
                :showGridSetSave="true"
                :rowHeight="50"
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
  name: 'y-chemical-branch-detail',
  props: {
    popupParam: {
      type: Object,
      default: {
        permitClsNo: 0,
      },
    },
  },
  data() {
    return {
      chemicalPermitCls: {
        permitClsNm: '',
        permitClsCd: '',
        permitKindCd: null,
        permitConfirms: [],
        confirmYn: '',
        attachYn: '',
        mainOrg: '',
        permitPeriod: '',
        permitUrl: '',
        sortOrder: '',
        needYn: 'N',
        useYn: 'Y',
        createUserId: '',
        updateUserId: '',
        regulItmNos: [],
        plantCd: '', // 사업장
      },
      branchCd: '',

      gridOptions: {
        name: 'chemicalPermitClsDetail',
        header: [],
        data: [],
        height: 500,
        merge: [],
        checkGroupStyle: 'width: 140px !important;',
        regulItemHeader: [],
        regulItemData: [],
        regulItemHeight: 280,
        regulItemMinHeight: '250px',
      },
      YAuiGrid: null,
      editable: false,
      updateMode: false,
      searchUrl: '',
      searchPermitRegulUrl: '',
      searchRegulUrl: '',
      detailUrl: '',
      checkUrl: '',
      insertUrl: '',
      editUrl: '',
      isInsert: false,
      isEdit: false,
      permitKindItems: [], // 인허가 구분 리스트 (조회)
      permitKindSaveItems: [], // 인허가 구분 리스트 (저장)
      permitConfirmItems: [],
      regulItems: [],
      plantItems: [],
      myData: [],
      myCheckingData: [],
      testValue: [],
    };
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    this.editable = this.$route.meta.editable;
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.chm.chemicalPermitCls.list.url;
      this.searchPermitRegulUrl =
        selectConfig.chm.chemicalPermitCls.permitRegul.url;
      this.searchRegulUrl = selectConfig.chm.chemicalRegulItem.list.url;
      this.detailUrl = selectConfig.chm.chemicalPermitCls.get.url;
      this.checkUrl = selectConfig.chm.chemicalPermitCls.check.url;
      this.insertUrl = transactionConfig.chm.chemicalPermitCls.insert.url;
      this.editUrl = transactionConfig.chm.chemicalPermitCls.edit.url;

      this.permitConfirmItems = [
        {
          code: 'confirm',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000003321'),
        }, // 확인
        {
          code: 'attach',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002843'),
        }, // 첨부파일
      ];
      this.$comm.getComboItems('CHM_PERMIT_KND', false).then((_result) => {
        this.permitKindSaveItems = _result; // 인허가구분
      });
      if (this.popupParam.permitClsNo !== 0) {
        this.getDetail();
      }
      this.getRegulItems();
    },
    getDetail() {
      this.$http.url = this.$format(
        this.detailUrl,
        this.popupParam.permitClsNo
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.chemicalPermitCls = this.$_.clone(_result.data);
          this.chemicalPermitCls.permitConfirms = [];
          if (this.chemicalPermitCls.confirmYn === 'Y') {
            this.chemicalPermitCls.permitConfirms.push('confirm');
          }
          if (this.chemicalPermitCls.attachYn === 'Y') {
            this.chemicalPermitCls.permitConfirms.push('attach');
          }
          this.updateMode = true;
          this.getRegulDataList(this.popupParam.permitClsNo);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getRegulDataList(permitClsNo) {
      this.$http.url = this.searchPermitRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        permitClsNo: permitClsNo,
      };
      this.$http.request(
        (_result) => {
          let keys = this.$_.uniq(this.$_.map(_result.data, 'regulLawCd'));
          let keyNames = this.$_.uniq(this.$_.map(_result.data, 'regulLawNm'));
          let values = [];
          this.$_.forEach(keys, (key) => {
            values.push(
              this.$_.map(
                this.$_.filter(_result.data, { regulLawCd: key }),
                'regulItmNo'
              )
            );
          });
          this.setRegulItemData(this.$_.zipObject(keys, values));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getRegulItems() {
      let myThis = this;
      this.$http.url = this.searchRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          let keys = this.$_.uniq(this.$_.map(_result.data, 'regulLawCd'));
          let keyNames = this.$_.uniq(this.$_.map(_result.data, 'regulLawNm'));
          this.$_.forEach(keys, (key) => {
            this.regulItems.push(
              this.$_.filter(_result.data, { regulLawCd: key })
            );
          });
          this.gridOptions.regulItemHeader = [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000568'),
              dataField: 'regulLawNm',
              width: '20%',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000729'),
              dataField: 'regulItmNms',
              width: '80%',
              style: 'left-align',
              renderer: {
                type: 'TemplateRenderer',
              },
              labelFunction: (
                rowIndex,
                columnIndex,
                values,
                headerText,
                item
              ) => {
                // HTML 템플릿 작성
                const selectedList = document.querySelectorAll(
                  'input[name="' +
                    item.regulLawNm +
                    '_chemicalPermitClsDetail"]:checked'
                );
                if (selectedList.length > 0) {
                  values = Array.from(selectedList).map((items) => items.value);
                  item.regulItmNos = values;
                } else {
                  item.regulItmNos = [];
                }
                let saveGridDataForCheck = [];
                this.$_.forEach(this.myData, (item) => {
                  this.$_.forEach(item.regulItmNms, (items) => {
                    saveGridDataForCheck.push(items);
                  });
                });
                this.testValue = saveGridDataForCheck;
                myThis.$_.forEach(
                  myThis.myData[rowIndex].regulItmNms,
                  (item) => {
                    myThis.myCheckingData.push(item);
                  }
                );
                var template = '<div class="my_div">';
                template += '<span class="my_div_chk_span">';
                myThis.regulItems[rowIndex].forEach((row, idx) => {
                  let checkedTag = '';
                  let disabledTab = '';
                  if ((!this.disabled && this.editable) === false) {
                    disabledTab = ' disabled ';
                  }
                  if (myThis.myCheckingData.includes(row.regulItmNo)) {
                    checkedTag = " checked='checked'";
                  }
                  const id =
                    item.regulLawNm +
                    '_' +
                    row.regulItmNo +
                    '_chemicalPermitClsDetail';
                  template +=
                    " <div class='custom-control custom-control-inline custom-checkbox b-custom-control-sm'> ";
                  template +=
                    " <input type='checkbox' class='custom-control-input' id='" +
                    id +
                    "' name='" +
                    item.regulLawNm +
                    "_K' value='" +
                    row.regulItmNo +
                    "'" +
                    checkedTag +
                    disabledTab +
                    '>';
                  template +=
                    "<label for='" +
                    id +
                    "' class='custom-control-label'>" +
                    row.regulItmNm +
                    ' </label>';
                  template += ' </input>';
                  template += ' </div> ';
                  if (idx > 0 && Number(idx % 6) === 0) template += ' <br/> ';
                  let checkbox = document.getElementById(id);
                  if ($(checkbox).prop('checked')) {
                    this.testValue.push(row.regulItmNo);
                  } else {
                    this.testValue = this.testValue.filter(
                      (element) => element !== row.regulItmNo
                    );
                  }
                });
                myThis.cellEditEndHandler2();
                return template;
              },
            },
          ];
          this.setRegulItemData([]);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setRegulItemData(regulItmNms) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'CHM_REGUL_LAW'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.myData = [];
          this.gridOptions.regulItemData = [];
          this.$_.forEach(_result.data, (item) => {
            this.myData.push({
              regulLawNm: item.codeNm,
              regulItmNms: !this.$_.isEmpty(regulItmNms)
                ? regulItmNms[item.code]
                : [],
            });
          });
          this.YAuiGrid.setGridData(this.myData);
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
    /** validation checking **/
    beforeInsert() {
      this.checkValidator('insert');
    },
    beforeEdit() {
      this.checkValidator('edit');
    },
    checkValidator(flag) {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            this.$http.url = this.checkUrl;
            this.$http.type = 'GET';
            this.$http.param = {
              permitClsNm: this.chemicalPermitCls.permitClsNm,
              permitClsCd: this.chemicalPermitCls.permitClsCd,
              permitClsNo:
                flag === 'edit' ? this.chemicalPermitCls.permitClsNo : '',
            };
            this.$http.request(
              (_result) => {
                var returnVal = this.showMessage(_result.data, flag);

                if (returnVal) {
                  window.getApp.$emit('CONFIRM', {
                    title: 'L0000003321',
                    message: flag === 'edit' ? 'M0000000011' : 'M0000000011',
                    // 저장하시겠습니까?
                    type: 'info',
                    // 확인 callback 함수
                    confirmCallback: () => {
                      this.chemicalPermitCls.createUserId =
                        this.$store.getters.token;
                      this.chemicalPermitCls.updateUserId =
                        this.$store.getters.token;

                      let saveData = [];
                      var i = 0;
                      this.$_.forEach(
                        this.gridOptions.regulItemData,
                        (item) => {
                          // alert(item.regulItmNms);
                          saveData = this.$_.concat(saveData, item.regulItmNms);
                        }
                      );
                      this.chemicalPermitCls.confirmYn =
                        this.$_.indexOf(
                          this.chemicalPermitCls.permitConfirms,
                          'confirm'
                        ) !== -1
                          ? 'Y'
                          : 'N';
                      this.chemicalPermitCls.attachYn =
                        this.$_.indexOf(
                          this.chemicalPermitCls.permitConfirms,
                          'attach'
                        ) !== -1
                          ? 'Y'
                          : 'N';
                      // this.chemicalPermitCls.regulItmNos = saveData;

                      if (flag === 'edit') this.isEdit = true;
                      else this.isInsert = true;
                    },
                    cancelCallback: () => {
                      if (flag === 'edit') this.isEdit = false;
                      else this.isInsert = false;
                    },
                  });
                }
              },
              (_error) => {
                window.getApp.$emit('APP_REQUEST_ERROR', _error);
              }
            );
          } else {
            this.$popupRequired.check(
              'chemicalPermitClsDetail',
              this.$data,
              this.errors
            );
          }
        })
        .catch(() => {
          window.getApp.$emit('APP_VALID_ERROR', 'M0000000876');
        });
    },
    showMessage(checkList, flag) {
      var checkText = '';
      var i = 0;
      for (; i < checkList.length; i++) {
        if (this.$_.parseInt(checkList[i].cnt) > 0) {
          checkText =
            checkList[i].gubun === 'permitClsNm'
              ? 'M0000000148' // 이미 존재하는 인허가신고명입니다.
              : 'M0000000149'; // 이미 존재하는 인허가신고코드입니다.
          break;
        }
      }
      if (checkText) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: checkText,
          type: 'warning',
        });
        return false;
      } else {
        return true;
      }
    },
    // 수정
    btnEditClickedCallback(_result) {
      this.isEdit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다
        type: 'success',
      });
    },
    // 신규등록
    btnInsertClickedCallback(_result) {
      this.isInsert = false;
      this.updateMode = true;
      this.chemicalPermitCls.permitClsNo = _result.data;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000006', // 저장되었습니다
        type: 'success',
      });
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    cellEditEndHandler2() {
      this.testValue = this.testValue.filter(
        (v, i) => this.testValue.indexOf(v) === i
      );
      // console.log(this.testValue)
      let regulItmNos = [];
      this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
        regulItmNos = this.$_.concat(regulItmNos, item.regulItmNos);
      });
      this.$_.forEach(this.myCheckingData, (item) => {
        regulItmNos = this.$_.concat(regulItmNos, String(item));
      });
      // console.log(regulItmNos, '22')
      let result = regulItmNos.filter((v, i) => regulItmNos.indexOf(v) === i);
      this.chemicalPermitCls.regulItmNos = this.$_.clone(this.testValue);
    },
    btnClosePopup() {
      // 부모창에 값 전달
      this.$emit('closePopup', { success: true });
    },
  },
};
</script>
