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
    <b-row>
      <b-col sm="12">
        <b-card>
          <b-row sm="12">
            <b-col sm="12">
              <div slot="buttonGroup" class="float-right mb-1">
                <el-tag size="medium" type="info" v-if="!popupMode && editable">
                  <!-- 대표값 합의 전체값이 100%가 되어야 합니다. -->
                  <i class="el-icon-info"></i> {{ $comm.getLangSpecInfoLabel('L0000000938') }}
                </el-tag>
                <el-tag size="medium" type="info" v-if="!popupMode && editable">
                  <!-- 대표값을 숨기실려면 영업비밀에 체크 하십시오. -->
                  <i class="el-icon-info"></i> {{ $comm.getLangSpecInfoLabel('L0000000939') }}
                </el-tag>
                <!-- 추가 -->
                <!-- <y-btn
                  v-if="!popupMode && editable"
                  title="L0000002892"
                  color="orange"
                  @btnClicked="openInsertPopup"
                />
                 제외 
                <y-btn
                  v-if="gridOptions.data.length > 0 && !popupMode && editable"
                  title="L0000002620"
                  color="red"
                  @btnClicked="btnReject"
                  @btnClickedErrorCallback="btnClickedErrorCallback"
                /> -->
              </div>              
              <!-- 구성성분 목록 -->
              <!-- <y-data-table
                label="L0000000693"
                ref="dataTable"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :popMode="true"
                :editable="!popupMode && editable"
                v-model="selectedValue"
              >
                <el-table-column
                  v-if="!popupMode && editable"
                  type="selection"
                  slot="selection"
                  align="center"
                  width="55"
                ></el-table-column>
              </y-data-table> -->
            </b-col>      
            <b-col sm="12" class="h100p">
                <y-auigrid
                  ref="yAuiGrid"
                  :editable="true"
                  :name="gridOptions.name"
                  :headers="gridOptions.header"
                  :btns="gridOptions.btns"
                  :height="gridOptions.height"
                  :label="this.$comm.getLangSpecInfoLabel('L0000000693')"
                  :useExcelExport="false"
                  :showRowCheckColumn="true"
                  :showGridSetSave="true"
                  :useContextMenu="true"
                  :showGridCtrl="true"  
                  @cellEditEnd="cellEditEndHandler"
                  @openInsertPopup="openInsertPopup"
                  @btnReject="btnReject"
                />
              </b-col>    
            <b-col sm="12" class="mt-3">
              <div slot="buttonGroup" class="float-right mb-1">
                <el-tag size="medium" type="info" v-if="!popupMode && editable">
                  <!-- 구성성분에 해당하는 규제정보를 검증합니다. -->
                  <i class="el-icon-info"></i> {{ $comm.getLangSpecInfoLabel('L0000000700') }}
                </el-tag>
              </div>
                <!-- 규제정보 검증 -->
                <!-- <y-btn
                  v-if="!popupMode && editable"
                  title="L0000000728"
                  color="orange"
                  @btnClicked="verificationRegulDb"
                />              
               화학물질 규제정보 
              <y-data-table
                label="L0000003288"
                ref="dataTableRegulItem"
                :height="gridOptions.regulItemHeight"
                :headers="gridOptions.regulItemHeader"
                :items="gridOptions.regulItemData"
                :fixwithclass="gridOptions.checkGroupStyle"
                :popMode="true"
                :editable="!popupMode && editable"
              ></y-data-table> -->              
            </b-col>
            <b-col sm="12" class="h100p">
              <y-auigrid
                  ref="auiGrid"
                  :name="gridOptions.name2"
                  :headers="gridOptions.regulItemHeader"
                  :height="gridOptions.regulItemHeight"
                  :btns="gridOptions.btns2"
                  :label="this.$comm.getLangSpecInfoLabel('L0000003288')"
                  :useExcelExport="false"            
                  :enableSorting="true"
                  :showGridSetSave="true"
                  :rowHeight="50"
                  @verificationRegulDb="verificationRegulDb"
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
var pixelWidth = require('string-pixel-width');
export default {
  name: 'y-chemprod-chem-regul-info',
  props: {
    chemprodNo: 0,
    changeChemProd: false,
    changeImport: false, // 불러오기가 발생한 경우 처리
    popupMode: false, // 팝업조회모드
    saveData: {
      chemProdNo: 0,
      chemprodChems: [],
      chemprodRegulItms: [],
      regulItmNos: [],
      createUserId: '',
      updateUserId: '',
    },
  },
  data() {
    return {
      gridOptions: {
        name: 'chemprodChemRegulInfoNew',
        name2: 'chemprodChemRegulInfoNew2',
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
      updateMode: false,
      searchUrl: '',
      searchRegulUrl: '',
      searchChemprodRegulUrl: '',
      checkRegulDbUrl: '',
      saveUrl: '',
      isSave: false,
      regulItems: [],
      myData: [],
      myCheckingData: [],
      testValue: [],
    };
  },
  watch: {
    'gridOptions.regulItemData': {
      handler: function(val, oldVal) {
        let regulItemData = [];
        this.$_.forEach(this.gridOptions.regulItemData, item => {
          if (item.regulItmNms) {
            regulItemData = this.$_.concat(regulItemData, item.regulItmNms);
          }
        });
        this.saveData.regulItmNos = this.$_.clone(regulItemData);
      },
      deep: true,
    },
    'gridOptions.data': {
      handler: function(val, oldVal) {
        this.saveData.chemprodChems = this.$_.clone(this.gridOptions.data);
      },
      deep: true,
    },
    changeChemProd: {
      handler: function(val, oldVal) {
        if (val) {
          this.getDataList(); // 구성성분 grid
          this.getRegulItems();
        } else this.$emit('setChangeChemProd');
      },
      deep: true,
    },
    changeImport: {
      handler: function(val, oldVal) {
        if (val) {
          this.gridOptions.data = this.saveData.chemprodChems;
          this.setRegulItemInfos(this.saveData.chemprodRegulItms, 'import');
          this.$emit('setChangeImport');
        }
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
  },
  beforeDestroy() {
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.chm.chemprodChem.list.url;
      this.searchRegulUrl = selectConfig.chm.chemicalRegulItem.list.url;
      this.searchChemprodRegulUrl = selectConfig.chm.chemprod.regul.url;
      this.saveUrl = transactionConfig.chm.chemprodChem.insert.url;
      this.checkRegulDbUrl = selectConfig.chm.matCheckRequest.reguldbcheck.url;
      this.editable = this.$route.meta.editable;

      this.getDataList();
      this.getRegulItems();

      // 구성성분 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000102'), 
          dataField: 'casNo', 
          width: '15%',    
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
          headerText: this.$comm.getLangSpecInfoLabel('L0000003178'), 
          dataField: 'limitLow', 
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
          headerText: this.$comm.getLangSpecInfoLabel('L0000002014'), 
          dataField: 'companySecret', 
          width: '10%',    
          editable: !this.disabled,
          renderer: {
            type: 'CheckBoxEditRenderer',
            editable: this.editable,
            checkValue: 'Y',
            unCheckValue: 'N',
            checkableFunction: function (rowIndex, columnIndex, value, isChecked, item, dataField) {
              return true;
            }
          }, 
        },      
      ];

      this.gridOptions.btns = [
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
      ]
      this.gridOptions.btns2 = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000728'), 
          color: 'orange',
          btnClicked: 'verificationRegulDb',
          visible: !this.disabled,
        },
      ]

    },
    // 구성성분 grid
    getDataList() {
      if (this.chemprodNo === 0) return;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        chemProdNo: this.chemprodNo,
      };
      this.$http.request(
        _result => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data)
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellEditEndHandler() {
      this.saveData.chemprodChems = this.$_.clone(this.YAuiGrid.getGridData());
    },
    cellEditEndHandler2() {
      this.testValue = this.testValue.filter((v, i) => this.testValue.indexOf(v) === i);
      // console.log(this.testValue)
      let regulItmNos = [];
      this.$_.forEach(this.AuiGrid.getGridData(), item => {
        regulItmNos = this.$_.concat(regulItmNos, item.regulItmNos);
      });
      this.$_.forEach(this.myCheckingData, item => {
        regulItmNos = this.$_.concat(regulItmNos, String(item));
      });
      // console.log(regulItmNos, '22')
      let result = regulItmNos.filter((v, i) => regulItmNos.indexOf(v) === i);
      this.saveData.regulItmNos = this.$_.clone(this.testValue)
    },
    getRegulItems() {
      this.$http.url = this.searchRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        _result => {
          this.setRegulItemInfos(_result.data, 'edit');
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setRegulItemInfos(_item, _gubun) {
      let myThis = this;
      let keys = this.$_.uniq(this.$_.map(_item, 'regulLawCd'));
      let keyNames = this.$_.uniq(this.$_.map(_item, 'regulLawNm'));
      this.$_.forEach(keys, key => {
        this.regulItems.push(this.$_.filter(_item, { regulLawCd: key }));
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
            type: "TemplateRenderer"
          },  
          labelFunction: (rowIndex, columnIndex, values, headerText, item) => { // HTML 템플릿 작성
            const selectedList = document.querySelectorAll('input[name="' + item.regulLawNm + '_K"]:checked');
            if (selectedList.length > 0) {
              values = Array.from(selectedList).map(items => items.value);
              item.regulItmNos = values;  
            } else {
              item.regulItmNos = [];                   
            }
            let saveGridDataForCheck = [];
            this.$_.forEach(this.myData, item => {
              this.$_.forEach(item.regulItmNms, items => {
                saveGridDataForCheck.push(items)
              });
            });
            this.testValue = saveGridDataForCheck
            myThis.$_.forEach(myThis.myData[rowIndex].regulItmNms, (item) => {
              myThis.myCheckingData.push(item)                  
            });
            var template = '<div class="my_div">';
            template += '<span class="my_div_chk_span">';
            myThis.regulItems[rowIndex].forEach((row, idx) => {
              let checkedTag = '';
              let disabledTab = '';
              if ((!this.disabled && this.editable) === false) disabledTab = " disabled ";
              if (myThis.myCheckingData.includes(row.regulItmNo)) checkedTag = " checked='checked'";
              const id = item.regulLawNm + "_" + row.regulItmNo + "_T";
              template += " <div class='custom-control custom-control-inline custom-checkbox b-custom-control-sm'> ";
              template += " <input type='checkbox' class='custom-control-input' id='" + id + "' name='" + item.regulLawNm + "_K' value='" + row.regulItmNo + "'" + checkedTag + disabledTab + ">";
              template += "<label for='" + id + "' class='custom-control-label'>" + row.regulItmNm + " </label>";
              template += " </input>";
              template += " </div> ";
              if (idx > 0 && Number(idx % 6) === 0) template += " <br/> "
              let checkbox = document.getElementById(id);             
              if ($(checkbox).prop("checked")) {
                this.testValue.push(row.regulItmNo)
              } else {
                this.testValue = this.testValue.filter((element) => element !== row.regulItmNo);
              }
            });
            myThis.cellEditEndHandler2();
            return template;
          }
        },
      ];

      this.$comm.getComboItems('CHM_REGUL_LAW').then(regulLaws => {
        // this.regulItems // 정렬(규제법규 및 항목 영역에서 관련법규와 맞추기 위해)
        let tempRegulItems = []; 
        this.$_.forEach(regulLaws, item => {
          this.$_.forEach(this.regulItems, regulItemArr => {
            if (regulItemArr[0].regulLawCd === item.code) {
              tempRegulItems.push(regulItemArr);
              return false;
            }
          })
        });
        this.regulItems = tempRegulItems;
        this.gridOptions.regulItemHeader[1].items = this.regulItems;
      });

      if (_gubun === 'import') {
        let values = [];
        this.$_.forEach(keys, key => {
          values.push(
            this.$_.map(
              this.$_.filter(_item, { regulLawCd: key }),
              'regulItmNo'
            )
          );
        });
        this.setRegulItemData(this.$_.zipObject(keys, values));
      } else {
        if (this.chemprodNo !== 0) this.getRegulDataList();
        else this.setRegulItemData([]);
      }
    },
    getRegulDataList() {
      this.$http.url = this.searchChemprodRegulUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        chemprodNo: this.chemprodNo,
      };
      this.$http.request(
        _result => {
          let keys = this.$_.uniq(this.$_.map(_result.data, 'regulLawCd'));
          let keyNames = this.$_.uniq(this.$_.map(_result.data, 'regulLawNm'));
          let values = [];
          this.$_.forEach(keys, key => {
            values.push(
              this.$_.map(
                this.$_.filter(_result.data, { regulLawCd: key }),
                'regulItmNo'
              )
            );
          });
          this.setRegulItemData(this.$_.zipObject(keys, values));
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setRegulItemData(regulItmNms1) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'CHM_REGUL_LAW'
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.myData = [];
          this.gridOptions.regulItemData = [];
          this.$_.forEach(_result.data, item => {
            this.myData.push({
              regulLawNm: item.codeNm,
              regulItmNms: !this.$_.isEmpty(regulItmNms1)
                ? regulItmNms1[item.code]
                : [],
            });
          });
          // this.$_.forEach(this.myData, item => {
          //   this.$_.forEach(item.regulItmNms, items => {
          //     this.testValue.push(String(items))
          //   });
          // });
          this.gridOptions.regulItemHeight = 280;

          this.AuiGrid.setGridData(this.myData)
          this.setChemHeader(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setChemHeader(reguls) {
      var i = 0;
      var maxWidth = 50;
      this.$_.forEach(reguls, regul => {
        var parent = null;
        var child = [];
        this.$_.forEach(this.regulItems[i], item => {
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
    verificationRegulDb() {
      // 규제DB검증
      let chemNos = '';
      let chemCount = 0;
      let limitRepvals = '';

      this.$_.forEach(this.YAuiGrid.getGridData(), item => {
        chemNos += (chemNos === '' ? '' : ',') + item.chemNo;
        limitRepvals += (limitRepvals === '' ? '' : ',') + item.limitRepval;
        chemCount += 1;
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
        _result => {
          // 새 창을 띄워서 결과를 보여주고, 결과값 적용여부를 확인 받아 처리해 준다.
          this.openVerificationResultPop(_result.data);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    openVerificationResultPop(data) {
      this.popupOptions.target = () =>
        import(`${'../wholeProcess/checkRegulDBResult.vue'}`);
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
        this.$_.forEach(keys, key => {
          values.push(
            this.$_.map(
              this.$_.filter(_retData.items, { regulLawCd: key }),
              'regulItemNo'
            )
          );
        });
        
        this.setRegulItemData(this.$_.zipObject(keys, values));
      }
    },
    btnClickedErrorCallback(_result) {
      this.isInsert = false;
      this.isEdit = false;
      this.updateMode = false;
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    openInsertPopup(data) {
      this.popupOptions.target = () => import(`${'../chemical/chem.vue'}`);
      this.popupOptions.title = 'L0000003285'; // '화학물질';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        chems: this.gridOptions.data,
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closeChemPopup;
    },
    closeChemPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C' && data.data.length > 0) {
        // 기존 데이터가 존재하는 경우에는 제외
        let plusData = this.YAuiGrid.getGridData();
        this.$_.forEach(plusData, item => {
          data.data = this.$_.clone(
            this.$_.reject(data.data, { chemNo: item.chemNo })
          );
        });

        this.$_.forEach(data.data, item => {
          plusData.push(item);
        });

        this.YAuiGrid.setGridData(plusData)
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
          gridData = this.$_.reject(gridData, item);
        });
        this.YAuiGrid.setGridData(gridData);
        this.cellEditEndHandler();
      }
    },
  },
};
</script>