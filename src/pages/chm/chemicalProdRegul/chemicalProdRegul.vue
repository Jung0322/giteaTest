<!--
  목적 : 화학물질 > 규제항목별 자재현황
  작성자 : kyk
  Detail : 규제항목별 자재현황 상세조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12 mb-3">
          <!-- <div v-show="show" slot="labelGroup" class="float-left">
               규제법규 및 항목
              <y-label label="L0000000724" icon="list-alt" color-class="cutstom-title-color" />
               <y-label :label="'(' + (total ? total : 0) + '건)'" style="font-size:15px;" /> 
              <y-label :label="$comm.getLangSpecInfoLabel('L0000003405', { s1: total ? total : 0 })" style="font-size:15px;" />
            </div> 
               <y-data-table
                v-if="gridOptionsRegulItem.data.length"
                label
                ref="dataTableRegulItem"
                :height="gridOptionsRegulItem.height"
                :headers="gridOptionsRegulItem.header"
                :items="gridOptionsRegulItem.data"
                :fixwithclass="gridOptionsRegulItem.checkGroupStyle"
              ></y-data-table> -->
          <b-col sm="12" class="h100p">
            <y-auigrid
              ref="yAuiGrid"
              :name="gridOptionsRegulItem.name"
              :headers="gridOptionsRegulItem.header"
              :btns="gridOptionsRegulItem.btns"
              :height="gridOptionsRegulItem.height"
              :label="this.$comm.getLangSpecInfoLabel('L0000000724')"
              :useExcelExport="false"
              :enableCellMerge="true"
              :enableSorting="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"
              :rowHeight="50"
            />
          </b-col>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
        <b-col sm="12">
          <b-col sm="12" class="px-0">
            <div class="float-right mb-1">
               검색 
              <y-btn title="L0000000327" color="green" @btnClicked="getDataList" />
            </div>
            화학자재 규제현황 
            <y-data-table
              label="L0000003310"
              ref="dataTable"
              :height="gridOptions.height"
              :headers="gridOptions.header"
              :items="gridOptions.data"
              @tableLinkClicked="tableLinkClicked"
            ></y-data-table>
          </b-col>
        </b-col>
      </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="auiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003310')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getDataList="getDataList"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
var pixelWidth = require('string-pixel-width');
import '@/js/templateRendererFunc'; // Aui Grid TemplateRenderer function 처리 js

export default {
  name: 'chemical-prod-regul',
  props: {},
  data() {
    return {
      searchParam: {
        search: '', // 검색어
        regulItmNos: [],
      },
      gridOptionsRegulItem: {
        name: 'chemicalProdRegul1',
        header: [],
        data: [],
        height: 280,
        checkGroupStyle: 'width: 140px !important;',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'chemicalProdRegul2',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
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
      editable: false,
      regulItemFullList: [],
      regulItems: [],
      regulInfor: [],
      selectedRegulItems: [],
      show: true,
      total: 0,
      oldRegulItemData: [],
    };
  },
  watch: {
    'gridOptionsRegulItem.data': {
      handler: function (val, oldVal) {
        this.selectedRegulItems = [];
        this.$_.forEach(this.gridOptionsRegulItem.data, (regulItem) => {
          this.$_.forEach(regulItem.regulItmNms, (item) => {
            let index = this.$_.findIndex(this.regulItemFullList, {
              regulItmNo: item,
            });
            this.selectedRegulItems.push(
              regulItem.regulLawNm +
                ' | ' +
                this.regulItemFullList[index].regulItmNm
            );
          });
        });
      },
      deep: true,
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
    this.AuiGrid = this.$refs.auiGrid;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.editable = this.$route.meta.editable;

      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
        this.oldRegulItemData = searchParamByCookie.regulItemData;
      }

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001205'),
          dataField: 'regulLawNm',
          width: '25%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000729'),
          dataField: 'regulItmNm',
          width: '25%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003307'),
          dataField: 'chemProdCnt',
          width: '25%',
          style: 'right-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003286'),
          dataField: 'chmCnt',
          width: '25%',
          style: 'right-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',
        },
      ];
      // 규제법규 및 항목 검색조건
      this.getRegulItems().then((_result) => {
        if (_result) {
          this.$comm.getComboItems('CHM_REGUL_LAW').then((regulLaws) => {
            this.gridOptionsRegulItem.data = [];
            let data = [];
            this.$_.forEach(regulLaws, (item) => {
              let idx = -1;
              let tempData = {};

              if (this.oldRegulItemData != null) {
                idx = this.$_.findIndex(this.oldRegulItemData, {
                  regulLawNm: item.codeNm,
                });
                tempData =
                  idx === -1 ? {} : this.oldRegulItemData[idx].regulItmNms;
              }
              data.push({
                regulLawNm: item.codeNm,
                regulItmNms: !this.$_.isEmpty(tempData)
                  ? this.oldRegulItemData[idx].regulItmNms
                  : [],
              });
            });
            this.gridOptionsRegulItem.data = data;
            this.YAuiGrid.setGridData(data);
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
            this.gridOptionsRegulItem.header[1].items = this.regulItems;
            this.setChemHeader(regulLaws);
          });
        }
      });
    },
    /**
     * 규제법규 및 항목 검색
     */
    getRegulItems() {
      let myThis = this;
      return new Promise((_resolve, _reject) => {
        this.$http.url = selectConfig.chm.chemicalRegulItem.list.url;
        this.$http.type = 'GET';
        this.$http.param = {
          useYn: 'Y',
        };
        this.$http.request(
          (_result) => {
            this.total = _result.data.length;
            this.regulItemFullList = this.$_.clone(_result.data);
            let keys = this.$_.uniq(this.$_.map(_result.data, 'regulLawCd'));
            let keyNames = this.$_.uniq(
              this.$_.map(_result.data, 'regulLawNm')
            );
            keys.sort();
            this.$_.forEach(keys, (key) => {
              this.regulItems.push(
                this.$_.filter(_result.data, { regulLawCd: key })
              );
            });
            this.gridOptionsRegulItem.header = [
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
                labelFunction: function (
                  rowIndex,
                  columnIndex,
                  values,
                  headerText,
                  item,
                  dataField
                ) {
                  // HTML 템플릿 작성

                  // 그리드 ID 조회
                  const gridId = myThis.$refs.yAuiGrid.myId;

                  // dataField의 값 array로 변환
                  const selectedList = [...values];
                  if (selectedList.length > 0) {
                    item.regulItmNos = selectedList;
                  } else {
                    item.regulItmNos = [];
                  }

                  // HTML 작성
                  var template = '<div class="my_div">';
                  template += '<span class="my_div_chk_span">';
                  myThis.regulItems[rowIndex].forEach((row, idx) => {
                    let checkedTag = '';
                    let disabledTab = '';
                    if (selectedList.includes(String(row.regulItmNo))) {
                      checkedTag = " checked='checked'";
                    }
                    const id = item.regulLawNm + '_' + row.regulItmNo;
                    template +=
                      '<div class="custom-control custom-control-inline custom-checkbox b-custom-control-sm">';
                    template +=
                      '<input type="checkbox" class="custom-control-input" id="' +
                      id +
                      '" name="' +
                      item.regulLawNm +
                      '" value="' +
                      row.regulItmNo +
                      '"' +
                      checkedTag +
                      '" onclick="$agRendererTemplate.agCheckClick(\'' +
                      gridId +
                      "', '" +
                      rowIndex +
                      "', '" +
                      dataField +
                      '\', event);">';
                    template +=
                      '<label for="' +
                      id +
                      '" class="custom-control-label">' +
                      row.regulItmNm +
                      '</label>';
                    template += '</input>';
                    template += '</div> ';
                    if (idx > 0 && Number(idx % 6) === 0) template += '<br/> ';
                  });

                  return template;
                },
              },
              // 관련법규
              // { text: 'L0000000568', name: 'regulLawNm', width: '130px', align: 'center', },
              // // 규제항목
              // { text: 'L0000000729', name: 'regulItmNms', width: '500px', type: 'checkboxmulti', items: this.regulItems, itemText: 'regulItmNm', itemValue: 'regulItmNo', },
            ];
            _resolve(true);
          },
          (_error) => {
            window.getApp.$emit('APP_REQUEST_ERROR', _error);
            _reject(_error);
          }
        );
      });
    },
    setChemHeader(regul) {
      var i = 0;
      var maxWidth = 50;
      this.regulInfor = [];
      this.$_.forEach(regul, (regul) => {
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
          if (item.regulLawCd === regul.code) {
            child.push({
              text: item.regulItmNm,
              name: item.regulItmNo.toString(),
              width: item.regulItmNm.length * 8 + 105 + 'px',
              align: 'center',
            });
          }
        });
        parent = {
          text: regul.codeNm,
          child: child,
        };
        i++;
        this.regulInfor.push(parent);
      });
      this.gridOptionsRegulItem.checkGroupStyle =
        'width: ' + (maxWidth + 70) + 'px !important;';
      this.getDataList();
    },
    // 화학물질 grid
    getDataList() {
      let regulItmNos = [];
      let regulItemData = [];
      regulItemData = this.YAuiGrid.getGridData();

      this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
        regulItmNos = this.$_.concat(regulItmNos, item.regulItmNos);
      });

      this.searchParam.regulItmNos = regulItmNos;

      this.$http.url = selectConfig.chm.chemicalprodregul.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          _result.data.forEach((item) => {
            item['chemicals'] = [];
          });
          this.gridOptions.data = _result.data;
          this.AuiGrid.setGridData(_result.data);
          this.searchParam.regulItemData = this.gridOptionsRegulItem.data;
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField !== 'chmCnt' && event.dataField !== 'chemProdCnt') {
        return;
      }
      this.openInsertPopup(event.item, event.dataField);
    },
    tableLinkClicked(header, row) {
      if (row === null) return;
      this.openInsertPopup(row, header);
    },
    openInsertPopup(row, header) {
      this.popupOptions.target = () =>
        import(`${'./chemicalProdRegulDetail.vue'}`);
      this.popupOptions.title = 'L0000003310'; // '화학자재 규제현황';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        viewtype: header,
        totalCount: header === 'chemProdCnt' ? row.chemProdCnt : row.chmCnt,
        regulItmNo: row.regulItmNo,
        regulItmNm: row.regulItmNm,
        regulOrgNm: row.regulOrgNm,
        regulLawNm: row.regulLawNm,
      };
      this.popupOptions.closeCallback = this.closeChemPopup;
    },
    closeChemPopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
  },
};
</script>
