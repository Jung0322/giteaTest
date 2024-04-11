<!--
  목적 : 화학물질관리 > 화학물질 > 구성성분/규제 정보
  작성자 : kdh
  Detail : 구성성분/규제 정보 등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <b-row sm="12">
      <!--
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mb-1">
          <el-tag size="medium" type="info" v-if="!disabled && editable">
             대표값 합의 전체값이 100%가 되지 않는 경우, 성분내역서를 첨부하셔야 합니다. 
            <i class="el-icon-info"></i>
            {{ $comm.getLangSpecInfoLabel('L0000003888') }}
          </el-tag>
           영업비밀 
          <y-btn title="영업비밀 추가" color="blue" @btnClicked="addSecret" />
           추가 
          <y-btn
            v-if="!disabled && editable"
            title="L0000002892"
            color="orange"
            @btnClicked="openInsertPopup"
          />
           제외 
          <y-btn
            v-if="gridOptions.data.length > 0 && !disabled && editable"
            title="L0000002620"
            color="red"
            @btnClicked="btnReject"
          />
        </div>
         구성성분 정보 
        <y-data-table
          label="L0000000694"
          ref="dataTable"
          :height="gridOptions.height"
          :headers="gridOptions.header"
          :items="gridOptions.data"
          :editable="editable && !disabled"
          v-model="selectedValue"
          :popMode="true"
        >
          <el-table-column
            v-if="!disabled && editable"
            type="selection"
            slot="selection"
            align="center"
            width="55"
          ></el-table-column>
        </y-data-table>
      </b-col>-->
      <el-tag
        size="medium"
        type="info"
        class="float-right mb-1"
        v-if="!disabled && editable"
      >
        <!-- 대표값 합의 전체값이 100%가 되지 않는 경우, 성분내역서를 첨부하셔야 합니다.  -->
        <i class="el-icon-info"></i>
        {{ $comm.getLangSpecInfoLabel('L0000003888') }}
      </el-tag>
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="true"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000694')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="true"
          @cellEditEnd="cellEditEndHandler"
          @addSecret="addSecret"
          @openInsertPopup="openInsertPopup"
          @btnReject="btnReject"
        />
      </b-col>
      <b-col sm="12" class="mt-3">
        <!-- <div slot="buttonGroup" class="float-right mb-1"> -->
        <el-tag size="medium" type="info" v-if="!disabled && editable">
          <!-- 구성성분에 해당하는 규제정보를 검증합니다.  -->
          <i class="el-icon-info"></i>
          {{ $comm.getLangSpecInfoLabel('L0000000700') }}
        </el-tag>
        <!-- 규제정보 검증  -->
        <!-- <y-btn
            v-if="editable && !disabled"
            title="L0000000728"
            color="orange"
            @btnClicked="verificationRegulDb"
          /> -->
        <!-- </div> -->
        <!-- 자재규제정보  -->
        <!-- <y-data-table
          label="L0000002324"
          ref="dataTableRegulItem"
          :height="gridOptions.regulItemHeight"
          :headers="gridOptions.regulItemHeader"
          :items="gridOptions.regulItemData"
          :editable="editable && !disabled"
          :fixwithclass="gridOptions.checkGroupStyle"
          minHeight="380px"
          :popMode="true"
        ></y-data-table> -->
        <y-auigrid
          ref="auiGrid"
          :name="gridOptions.name2"
          :headers="gridOptions.regulItemHeader"
          :height="gridOptions.regulItemHeight"
          :btns="gridOptions.btns2"
          :label="this.$comm.getLangSpecInfoLabel('L0000002324')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :rowHeight="50"
          @verificationRegulDb="verificationRegulDb"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
var pixelWidth = require('string-pixel-width');
export default {
  name: 'mat-check-request-chem-regul-info',
  props: {
    matChkRqstNo: 0,
    chemProdNo: 0,
    changeChemProd: false,
    chkRqstState: '',
    saveData: {
      matChkRqstNo: 0,
      matCheckRequestCompos: [],
      regulItmMatVals: [],
      createUserId: '',
      updateUserId: '',
    },
    disabled: false,
  },
  data() {
    return {
      gridOptions: {
        name: 'matCheckRequestRegulInfoNew',
        name2: 'matCheckRequestRegulInfoNew2',
        btns: [],
        btns2: [],
        header: [],
        data: [],
        height: 300,
        regulItemHeader: [],
        regulItemData: [],
        regulItemHeight: 300,
        checkGroupStyle: 'width: 140px !important;',
      },
      YAuiGrid: null,
      AuiGrid: null,
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
      editable: false,
      searchUrl: '',
      searchRegulUrl: '',
      searchMatRegulUrl: '',
      searchChemProdChemUrl: '',
      searchChemprodRegulUrl: '',
      checkRegulDbUrl: '', // 규제db검증
      saveUrl: '',
      isSave: false,
      regulItems: [],
      num: 1,
      secretArray: [],
      myData: [],
      myCheckingData: [],
      testValue: [],
    };
  },
  watch: {
    'gridOptions.regulItemData': {
      handler: function (val, oldVal) {
        let regulItemData = [];
        this.$_.forEach(this.gridOptions.regulItemData, (item) => {
          if (item.regulItmNms) {
            regulItemData = this.$_.concat(regulItemData, item.regulItmNms);
          }
        });
        this.saveData.regulItmMatVals = this.$_.clone(regulItemData);
      },
      deep: true,
    },
    'gridOptions.data': {
      handler: function (val, oldVal) {
        this.saveData.matCheckRequestCompos = this.$_.clone(
          this.gridOptions.data
        );
      },
      deep: true,
    },
    changeChemProd: {
      handler: function (val, oldVal) {
        if (val) {
          this.getChemProdDataList(); // 구성성분 grid
          this.getChemProdRegulDataList(); // 규제
        } else this.$emit('setChangeChemProd');
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
    this.AuiGrid = this.$refs.auiGrid;
    // 윈도우 resize event
    window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {
    // 윈도우 resize event 제거-SPA 기반이므로 제거하지 않으면 다른페이지에서 해당 이벤트가 호출됨
    window.removeEventListener('resize', this.setGridSize);
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.chm.matCheckRequestCompo.list.url;
      this.searchRegulUrl = selectConfig.chm.chemicalRegulItem.list.url;
      this.searchMatRegulUrl = selectConfig.chm.matCheckRequestCompo.regul.url;
      this.saveUrl = transactionConfig.chm.matCheckRequestCompo.insert.url;
      this.checkRegulDbUrl = selectConfig.chm.matCheckRequest.reguldbcheck.url;

      // 화학물질별
      this.searchChemProdChemUrl = selectConfig.chm.chemprodChem.list.url;
      this.searchChemprodRegulUrl = selectConfig.chm.chemprod.regul.url;

      this.editable = this.$route.meta.editable;

      // if (this.chkRqstState === 'MCRS2' || this.chkRqstState === 'MCRS3') {
      //   this.disabled = true;
      // }
      this.getDataList(); // 구성성분 grid
      this.getRegulItems(); // 규제

      // 구성성분 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000102'),
          dataField: 'casNo',
          width: '10%',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003304'),
          dataField: 'chemNmKr',
          width: '15%',
          style: 'left-align',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003305'),
          dataField: 'chemNmEn',
          width: '15%',
          style: 'left-align',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003177'),
          dataField: 'limitHigh',
          width: '10%',
          style: 'right-align',
          editable: !this.disabled,
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 5, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003178'),
          dataField: 'limitLow',
          width: '10%',
          style: 'right-align',
          editable: !this.disabled,
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 5, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003176'),
          dataField: 'limitRepval',
          width: '15%',
          style: 'right-align',
          editable: !this.disabled,
          editRenderer: {
            type: 'InputEditRenderer',
            onlyNumeric: true,
            maxlength: 5, // 글자수 3으로 제한
            autoThousandSeparator: true,
          },
        },
        {
          headerText: '영업비밀 여부',
          dataField: 'secretWhether',
          width: '10%',
          editable: !this.disabled,
          renderer: {
            type: 'CheckBoxEditRenderer',
            editable: this.editable,
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
              return true;
            },
          },
        },
        {
          headerText: '대체물질명',
          dataField: 'substitute',
          width: '15%',
          editable: !this.disabled,
          style: 'left-align',
        },
      ];

      this.gridOptions.btns = [
        {
          title: '영업비밀 추가',
          color: 'blue',
          btnClicked: 'addSecret',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'openInsertPopup',
          visible: !this.disabled,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'btnReject',
          visible: !this.disabled,
        },
      ];
      this.gridOptions.btns2 = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000728'),
          color: 'orange',
          btnClicked: 'verificationRegulDb',
          visible: !this.disabled,
        },
      ];
      this.setGridSize(); // 그리드 사이즈 조절
    },
    // 구성성분 grid
    getDataList() {
      if (this.matChkRqstNo === 0) return;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        matChkRqstNo: this.matChkRqstNo,
      };
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellEditEndHandler() {
      this.saveData.matCheckRequestCompos = this.YAuiGrid.getGridData();
    },
    cellEditEndHandler2() {
      this.testValue = this.testValue.filter(
        (v, i) => this.testValue.indexOf(v) === i
      );
      let regulItmNos = [];
      this.$_.forEach(this.AuiGrid.getGridData(), (item) => {
        regulItmNos = this.$_.concat(regulItmNos, item.regulItmNos);
      });
      this.$_.forEach(this.myCheckingData, (item) => {
        regulItmNos = this.$_.concat(regulItmNos, String(item));
      });
      let result = regulItmNos.filter((v, i) => regulItmNos.indexOf(v) === i);

      this.saveData.regulItmMatVals = this.$_.clone(this.testValue);
    },
    // 화학물질별 구성성분 grid
    getChemProdDataList() {
      if (this.chemProdNo === 0) return;
      this.$http.url = this.searchChemProdChemUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        chemProdNo: this.chemProdNo,
        searchFlag: 'true',
      };
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
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
                // let myCheckingData = [];
                const selectedList = document.querySelectorAll(
                  'input[name="' + item.regulLawNm + '"]:checked'
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

                  const id = item.regulLawNm + '_' + row.regulItmNo;
                  template +=
                    " <div class='custom-control custom-control-inline custom-checkbox b-custom-control-sm'> ";
                  template +=
                    " <input type='checkbox' class='custom-control-input' id='" +
                    id +
                    "' name='" +
                    item.regulLawNm +
                    "' value='" +
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

          this.$comm.getComboItems('CHM_REGUL_LAW').then((regulLaws) => {
            // this.regulItems // 정렬(규제법규 및 항목 영역에서 관련법규와 맞추기 위해)
            let tempRegulItems = [];
            this.$_.forEach(regulLaws, (item) => {
              this.$_.forEach(this.regulItems, (regulItemArr) => {
                if (regulItemArr[0].regulLawCd === item.code) {
                  tempRegulItems.push(regulItemArr);
                  return false;
                }
              });
            });
            this.regulItems = tempRegulItems;
            this.gridOptions.regulItemHeader[1].items = this.regulItems;

            if (this.matChkRqstNo !== 0) {
              this.getRegulDataList();
            } else {
              let regulItmNms = [];
              this.gridOptions.regulItemData = [];
              this.$_.forEach(regulLaws, (item) => {
                this.gridOptions.regulItemData.push({
                  regulLawNm: item.codeNm,
                  regulItmNms: !this.$_.isEmpty(regulItmNms)
                    ? regulItmNms[item.code]
                    : [],
                });
              });
              this.AuiGrid.setGridData(this.gridOptions.regulItemData);
              // this.setChemHeader(regulLaws);
            }
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 물질검토별 규제정보
    getRegulDataList() {
      this.$http.url = this.searchMatRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        matChkRqstNo: this.matChkRqstNo,
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
          this.$comm.getComboItems('CHM_REGUL_LAW').then((_result) => {
            let regulItmNms = this.$_.zipObject(keys, values);
            this.myData = [];
            this.$_.forEach(_result, (item) => {
              this.myData.push({
                regulLawNm: item.codeNm,
                regulItmNms: !this.$_.isEmpty(regulItmNms)
                  ? regulItmNms[item.code]
                  : [],
                regulItmNms123123: !this.$_.isEmpty(regulItmNms)
                  ? regulItmNms[item.code]
                  : [],
              });
            });
            this.AuiGrid.setGridData(this.myData);
            // this.setChemHeader(_result);
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 화학물질별 규제정보
    getChemProdRegulDataList() {
      this.$http.url = this.searchChemprodRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        chemprodNo: this.chemProdNo,
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
          this.$comm.getComboItems('CHM_REGUL_LAW').then((_result) => {
            let regulItmNms = this.$_.zipObject(keys, values);
            this.gridOptions.regulItemData = [];
            this.$_.forEach(_result, (item) => {
              this.gridOptions.regulItemData.push({
                regulLawNm: item.codeNm,
                regulItmNms: !this.$_.isEmpty(regulItmNms)
                  ? regulItmNms[item.code]
                  : [],
              });
            });
            this.setChemHeader(_result);
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setChemHeader(reguls) {
      var i = 0;
      var maxWidth = 50;
      this.$_.forEach(reguls, (regul) => {
        var parent = null;
        var child = [];
        this.$_.forEach(this.regulItems[i], (item) => {
          var width = pixelWidth(item.regulItmNm, {
            size: 12,
            bold: true,
            font: 'Arial',
          });
          if (width > maxWidth) {
            maxWidth = width;
          }
        });
        i++;
      });
      this.gridOptions.checkGroupStyle =
        'width: ' + (maxWidth + 70) + 'px !important;';
    },
    beforeSave() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000011', // 저장하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.saveData.matChkRqstNo = this.$_.clone(this.matChkRqstNo);
          this.saveData.createUserId = this.$store.getters.token;
          this.saveData.updateUserId = this.$store.getters.token;

          let regulItemData = [];
          this.$_.forEach(this.gridOptions.regulItemData, (item) => {
            regulItemData = this.$_.concat(regulItemData, item.regulItmNms);
          });
          this.saveData.matCheckRequestCompos = this.$_.clone(
            this.gridOptions.data
          );
          this.saveData.regulItmMatVals = this.$_.clone(regulItemData);

          this.isSave = true;
        },
        cancelCallback: () => {
          this.isSave = false;
        },
      });
    },
    /** validation checking **/
    /** /validation checking **/

    /** Button Event **/
    // 저장
    btnSaveClickedCallback(_result) {
      this.getDataList(); // 구성성분 grid
      this.getRegulItems();
      this.isSave = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000006', // '저장되었습니다.',
        type: 'success',
      });
    },
    openInsertPopup(data) {
      this.popupOptions.target = () => import(`${'../../chemical/chem.vue'}`);
      this.popupOptions.title = 'L0000003285'; // '화학물질';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        chems: this.YAuiGrid.getGridData(),
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closeChemPopup;
    },
    closeChemPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.data.length > 0 && data.data !== 'C') {
        let plusData = this.YAuiGrid.getGridData();
        //   // 기존 데이터가 존재하는 경우에는 제외
        this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
          if (item.chemNo) {
            data.data = this.$_.clone(
              this.$_.reject(data.data, { chemNo: item.chemNo })
            );
          } else {
            data.data = this.$_.clone(
              this.$_.reject(data.data, { chemNmKr: item.chemNmKr })
            );
          }
        });

        this.$_.forEach(data.data, (item) => {
          if (item.chemNmKr.includes('영업비밀')) {
            this.secretArray.push(item);
          }
          plusData.push(item);
        });
        this.YAuiGrid.setGridData(plusData);
        this.cellEditEndHandler();
      }
    },
    btnReject() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000160', // '제외할 항목를 선택하세요.',
          type: 'warning',
        });
      } else {
        let gridData = this.YAuiGrid.getGridData();
        this.$_.forEach(checkingData, (item) => {
          if (item.chemNmKr.includes('영업비밀')) {
            this.secretArray = this.$_.clone(
              this.$_.reject(this.secretArray, { chemNo: item.chemNo })
            );
          }
          gridData = this.$_.reject(gridData, item);
        });
        this.YAuiGrid.setGridData(gridData);
        this.cellEditEndHandler();
      }
    },
    verificationRegulDb() {
      // 규제DB검증
      let chemNos = '';
      let chemCount = 0;
      let limitRepvals = '';

      this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
        // this.$_.forEach(this.gridOptions.data, (item) => {
        if (item.chemNo !== undefined) {
          chemNos += (chemNos === '' ? '' : ',') + item.chemNo;
          limitRepvals += (limitRepvals === '' ? '' : ',') + item.limitRepval;
          chemCount += 1;
        }
      });

      if (chemCount === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000171', // '검증할 구성성분이 없습니다. 구성성분을 추가하신 후 검증하시기 바랍니다.',
          type: 'warning',
        });
        return;
      }

      this.$http.url = this.checkRegulDbUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        chemNos: chemNos,
        limitRepvals: limitRepvals,
        chemCount: chemCount,
      };
      this.$http.request(
        (_result) => {
          // 새 창을 띄워서 결과를 보여주고, 결과값 적용여부를 확인 받아 처리해 준다.
          this.openVerificationResultPop(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openVerificationResultPop(data) {
      this.popupOptions.target = () => import(`${'../checkRegulDBResult.vue'}`);
      this.popupOptions.title = 'L0000003863'; // '규제DB검증결과';
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        checkResult: data,
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closeVerificationResultPop;
    },
    closeVerificationResultPop(_retData) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.popupOptions.width = '80%';
      if (_retData.apply) {
        // 검증한 규제DB 정보를 적용한다.
        let keys = this.$_.uniq(this.$_.map(_retData.items, 'regulLawCd'));
        let keyNames = this.$_.uniq(this.$_.map(_retData.items, 'regulLawNm'));
        let values = [];
        this.$_.forEach(keys, (key) => {
          values.push(
            this.$_.map(
              this.$_.filter(_retData.items, { regulLawCd: key }),
              'regulItemNo'
            )
          );
        });
        let regulItmNms = this.$_.zipObject(keys, values);
        this.$comm.getComboItems('CHM_REGUL_LAW').then((_result) => {
          this.myData = [];
          this.$_.forEach(_result, (item) => {
            this.myData.push({
              regulLawNm: item.codeNm,
              regulItmNms: !this.$_.isEmpty(regulItmNms)
                ? regulItmNms[item.code]
                : [],
            });
          });
          this.AuiGrid.setGridData(this.myData);
          this.setChemHeader(_result);
        });
      }
    },
    getChemNo(value) {
      switch (String(value)) {
        case '1':
          return '904';
        case '2':
          return '905';
        case '3':
          return '906';
        case '4':
          return '907';
        case '5':
          return '908';
        case '6':
          return '909';
        case '7':
          return '910';
        case '8':
          return '911';
        case '9':
          return '912';
        case '10':
          return '913';
      }
    },
    addSecret() {
      if (this.secretArray.length === 10) {
        this.$comm.alertWarning('L0000005473'); // 영업비밀은 10개 까지 추가할수있습니다.
        return;
      }
      let tempArray = [];
      let numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      if (this.secretArray.length === 0) {
        this.num = 1;
      } else {
        tempArray = this.secretArray.map((item) => item.chemNo);
        for (let i = 1; numberArray.length; i++) {
          let comparisonChemNo = this.getChemNo(i);
          if (!tempArray.includes(Number(comparisonChemNo))) {
            this.num = i;
            break;
          }
        }
      }

      let title =
        this.$comm.getLangSpecInfoLabel('L0000002014') + String(this.num); // 영업비밀
      let secretData = {
        casNo: '',
        chemNmKr: title,
        chemNmEn: title,
        limitHigh: '0',
        limitLow: '0',
        limitRepval: '0',
        secretWhether: 'Y',
        useYn: 'Y',
        useYnNm: '사용',
        chemNo: 903 + this.num,
      };
      this.YAuiGrid.addRow(secretData);
      // this.gridOptions.data.push(secretData);
      this.secretArray.push(secretData);
      this.cellEditEndHandler();
    },
    /**
     * 그리드 리사이징
     */
    setGridSize() {
      var defaultHeight1 = 250;
      var defaultHeight2 = 480;
      window.getApp.$emit('LOADING_SHOW');
      setTimeout(() => {
        this.gridOptions.regulItemHeight = '380';
        this.gridOptions.height = 'auto';
        window.getApp.$emit('LOADING_HIDE');
      }, 600);
    },
    /** /Button Event **/
  },
};
</script>
