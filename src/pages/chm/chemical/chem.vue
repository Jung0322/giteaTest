<!--
  목적 : 물질관리 > 화학물질 > 화학물질
  작성자 : kdh
  Detail : 화학물질 목록 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getInitDataList">
      <b-row slot="search">
        <b-col
          v-if="!popupParam.popupMode"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-6"
        >
          <!-- 검색어 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000331"
            v-model="searchParam.search"
            name="search"
            placeholder="L0000003820"
          ></y-text>
          <!-- L0000003820: 화학물질명 및 CAS No. -->
        </b-col>

        <b-col
          v-if="!popupParam.popupMode"
          sm="12"
          md="12"
          lg="12"
          xl="12"
          class="col-xxl-12 mb-3"
        >
          <!-- 규제법규 및 항목 -->
          <b-col sm="12" class="h100p">
            <y-auigrid
              ref="yAuiGrid"
              :name="gridOptions.name"
              :headers="gridOptions.regulItemHeader"
              :height="gridOptions.regulItemHeight"
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
          <div v-show="!show" slot="labelGroup" class="float-left">
            <!-- 규제법규 및 항목 -->
            <y-label
              label="L0000000724"
              icon="list-alt"
              color-class="cutstom-title-color"
            />
            <!-- <y-label :label="'(' + (total ? total : 0) + '건)'" style="font-size:15px;" /> -->
            <y-label
              :label="
                $comm.getLangSpecInfoLabel('L0000003405', {
                  s1: total ? total : 0,
                })
              "
              style="font-size: 15px"
            />
          </div>
          <!-- <y-tag
            v-show="!show"
            :width="10"
            :editable="editable"
            :disabled="true"
            new-label-text
            label="규제법규 및 항목"
            v-model="selectedRegulItems"
            name="selectedRegulItems"
          /> -->
        </b-col>

        <b-col
          v-if="popupParam.popupMode"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
        >
          <!-- CAS No. -->
          <y-text
            :width="7"
            ui="bootstrap"
            type="search"
            label="L0000000102"
            v-model="searchParam.casNo"
            name="casNo"
          ></y-text>
        </b-col>
        <b-col
          v-if="popupParam.popupMode"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
        >
          <!-- 화학물질명(국문) -->
          <y-text
            :width="7"
            ui="bootstrap"
            type="search"
            label="L0000003304"
            v-model="searchParam.chemNmKr"
            name="chemNmKr"
          ></y-text>
        </b-col>
        <b-col
          v-if="popupParam.popupMode"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
        >
          <!-- 화학물질명(영문) -->
          <y-text
            :width="7"
            ui="bootstrap"
            type="search"
            label="L0000003305"
            v-model="searchParam.chemNmEn"
            name="chemNmEn"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 화학물질 목록 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="auiGrid"
          :name="gridOptions.name2"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003289')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :usePaginate="true"
          :showRowCheckColumn="popupParam.popupMode"
          :paginateListCount="searchParam.pageSize"
          :paginateTotalCount="searchParam.pageTotal"
          :paginateCurrentPage="searchParam.pageNumber"
          @paginateClick="paginateClickHandler"
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @btnInsert="btnInsert"
          @closePopup="closePopup('C')"
          @cellClick="cellClickHandler"
          @btnAdd="btnAdd"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
var pixelWidth = require('string-pixel-width');
export default {
  name: 'chem',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return { chems: [], popupMode: false };
      },
    },
  },
  data() {
    return {
      searchParam: {
        search: '', // 검색어
        regulItmNos: [],
        casNo: '',
        chemNmKr: '',
        chemNmEn: '',
        useYn: 'Y',
        pageNumber: 1,
        pageSize: 20,
        pageTotal: 0,
        pageSizes: [10, 20],
        orderByExpression: '',
        regulItemData: [],
      },
      gridOptions: {
        name: 'chemSearch',
        name2: 'chemData',
        btns: [],
        header: [],
        data: [],
        totalData: [],
        height: 'auto',
        checkGroupStyle: 'width: 140px !important;',
        regulItemHeader: [],
        regulItemData: [],
        regulItemHeight: 280,
        regulItemMinHeight: '250px',
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
      editable: false,
      searchUrl: '',
      searchRegulUrl: '',
      selectedValue: [],
      checkItemData: [],
      vendorItems: [],
      regulItemFullList: [],
      regulItems: [],
      selectedRegulItems: [],
      show: true,
      isInit: true,
      oldRegulItemData: [],
      total: 0,
      showDatatable: false,
    };
  },
  // watch: {
  //   'gridOptions.regulItemData': {
  //     handler: function(val, oldVal) {
  //       this.selectedRegulItems = [];
  //       this.$_.forEach(this.gridOptions.regulItemData, regulItem => {
  //         this.$_.forEach(regulItem.regulItmNms, item => {
  //           let index = this.$_.findIndex(this.regulItemFullList, {
  //             regulItmNo: item,
  //           });
  //           this.selectedRegulItems.push(
  //             regulItem.regulLawNm +
  //               ' | ' +
  //               this.regulItemFullList[index].regulItmNm
  //           );
  //         });
  //       });
  //     },
  //     deep: true,
  //   },
  // },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    this.editable = this.$route.meta.editable;
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
      this.isInit = true;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 By 2022-05-09 장헌영 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
        this.oldRegulItemData = searchParamByCookie.regulItemData;
        // this.oldOrderBy = searchParamByCookie.orderByExpression;
      }
      // URL 셋팅
      this.searchUrl = selectConfig.chm.chem.listpage.url;
      this.searchRegulUrl = selectConfig.chm.chemicalRegulItem.list.url;

      if (!this.popupParam.popupMode) this.getRegulItems(); // 규제법규 및 항목

      this.searchParam.pageTotal = 0;

      // 화학물질 grid 헤더 설정
      if (!this.popupParam.popupMode) {
        this.searchUrl = selectConfig.chm.chem.listpage.url;
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000102'),
            dataField: 'cas_no',
            width: '10%',
          }, // CAS No.
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003304'),
            dataField: 'chem_nm_kr',
            width: '10%',
            style: 'left-align',
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {},
            },
          }, // 화학물질명(국문)
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003305'),
            dataField: 'chem_nm_en',
            width: '10%',
            style: 'left-align',
          }, // L0000003305
        ];
        this.$comm.getComboItems('CHM_REGUL_LAW').then((regulLaws) => {
          this.setChemHeader(regulLaws);
        });
        this.gridOptions.btns = [
          {
            title: this.$comm.getLangSpecInfoLabel('L0000001789'),
            color: 'orange',
            btnClicked: 'btnInsert',
            visible: !this.popupParam.popupMode,
          }, // 신규등록
          {
            title: this.$comm.getLangSpecInfoLabel('L0000000327'),
            color: 'green',
            btnClicked: 'btnSearchClickedCallback',
            visible: true,
          }, // 검색
          {
            title: this.$comm.getLangSpecInfoLabel('L0000000881'),
            btnClicked: 'closePopup',
            visible: this.popupParam.popupMode,
          }, // 닫기
        ];
        // 규제법규 및 항목 검색조건
        this.getRegulItems().then((_result) => {
          if (_result)
            this.$comm.getComboItems('CHM_REGUL_LAW').then((regulLaws) => {
              this.gridOptions.regulItemData = [];
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

                this.gridOptions.regulItemData.push({
                  regulLawNm: item.codeNm,
                  regulItmNms: !this.$_.isEmpty(tempData)
                    ? this.oldRegulItemData[idx].regulItmNms
                    : [],
                });
              });
              this.YAuiGrid.setGridData(this.gridOptions.regulItemData);

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
              this.setChemHeader(regulLaws);
            });
        });
      } else {
        this.searchUrl = selectConfig.chm.chem.chemNoRegulpage.url;
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000102'),
            dataField: 'casNo',
            width: '20%',
          }, // CAS No.

          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003304'),
            dataField: 'chemNmKr',
            width: '40%',
          }, // 화학물질명(국문)
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003305'),
            dataField: 'chemNmEn',
            width: '40%',
          }, // 화학물질명(영문)
        ];
        this.gridOptions.btns = [
          {
            title: this.$comm.getLangSpecInfoLabel('L0000001789'),
            color: 'orange',
            btnClicked: 'btnInsert',
            visible: !this.popupParam.popupMode,
          }, // 신규등록
          {
            title: this.$comm.getLangSpecInfoLabel('L0000001561'),
            color: 'orange',
            btnClicked: 'btnAdd',
            visible: this.popupParam.popupMode,
          }, // 선택
          {
            title: this.$comm.getLangSpecInfoLabel('L0000000327'),
            color: 'green',
            btnClicked: 'btnSearchClickedCallback',
            visible: true,
          }, // 검색
          {
            title: this.$comm.getLangSpecInfoLabel('L0000000881'),
            btnClicked: 'closePopup',
            visible: this.popupParam.popupMode,
          }, // 닫기
        ];
        this.showDatatable = true;
      }
    },
    getRegulItems() {
      let myThis = this;
      return new Promise((_resolve, _reject) => {
        this.$http.url = this.searchRegulUrl;
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
            this.regulItems = [];
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
              }, // 관련법규
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
                  item
                ) {
                  // HTML 템플릿 작성
                  const selectedList = document.querySelectorAll(
                    'input[name="' + item.regulLawNm + '"]:checked'
                  );
                  if (selectedList.length > 0) {
                    values = Array.from(selectedList).map(
                      (items) => items.value
                    );
                    item.regulItmNos = values;
                  } else {
                    item.regulItmNos = [];
                  }
                  var template = '<div class="my_div">';
                  template += '<span class="my_div_chk_span">';
                  myThis.regulItems[rowIndex].forEach((row, idx) => {
                    let checkedTag = '';
                    let disabledTab = '';
                    if (values.includes(row.code)) {
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
                  });

                  return template;
                },
              }, // 규제항목
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

    setChemHeader(reguls) {
      return new Promise((_resolve, _reject) => {
        var maxWidth = 50;
        let gridHeader = this.$_.clone(this.gridOptions.header);
        this.$_.forEach(reguls, (regul) => {
          var parent = null;
          var children = [];
          this.$_.forEach(this.regulItems, (regulItems) => {
            let items = regulItems;
            this.$_.forEach(items, (item) => {
              var width = pixelWidth(item.regulItmNm, {
                size: 12,
                bold: true,
                font: 'Arial',
              });
              if (width > maxWidth) {
                maxWidth = width;
              }
              if (item.regulLawCd === regul.code) {
                children.push({
                  headerText: item.regulItmNm,
                  dataField: item.regulItmNo.toString(),
                  width: '80px',
                  align: 'center',
                  styleFunction: (
                    rowIndex,
                    columnIndex,
                    value,
                    headerText,
                    item,
                    dataField
                  ) => {
                    if (value === 'Y') {
                      return 'cell-red';
                    } else {
                      return 'cell-blue';
                    }
                  },
                  // sortable: false,
                  // prop: item.regulItmNo.toString(),
                  // type: 'tag',
                  // compareVal: 'Y',
                  // trueVal: 'danger',
                  // falseVal: '',
                });
              }
            });
          });
          parent = {
            headerText: regul.codeNm,
            children: children,
            sortable: false,
          };
          gridHeader.push(parent);
        });
        this.gridOptions.header = gridHeader;

        this.gridOptions.checkGroupStyle =
          'width: ' + (maxWidth + 70) + 'px !important;';
        _resolve(true);
        this.showDatatable = true;
      });
    },
    getInitDataList() {
      this.searchParam.pageNumber = 1;
      this.getDataList();
    },
    paginateClickHandler(pageNum) {
      this.searchParam.pageNumber = pageNum;
      this.getDataList();
    },
    getDataList() {
      let saveData = [];
      let regulItemData = [];
      if (this.isInit) {
        regulItemData = this.oldRegulItemData;
        this.isInit = !this.isInit;
      } else {
        regulItemData = this.gridOptions.regulItemData;
      }
      if (!this.popupParam.popupMode) {
        this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
          saveData = this.$_.concat(saveData, item.regulItmNos);
        });
        this.searchParam.regulItmNos = saveData;
      }

      if (!this.popupParam.popupMode) {
        if (
          this.searchParam.search.length < 2 &&
          this.searchParam.regulItmNos.length < 1
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000158', // '검색어 2자 이상 또는 규제법규 및 항목 검색조건을 선택하세요.',
            type: 'warning',
          });
          return;
        }
      } else {
        if (
          this.searchParam.casNo === '' &&
          this.searchParam.chemNmKr === '' &&
          this.searchParam.chemNmEn === ''
        ) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000159', // '최소 하나의 검색조건을 입력 후 검색하세요.',
            type: 'warning',
          });
          return;
        }
      }

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.searchParam.pageTotal = _result.data.count;
          this.gridOptions.data = _result.data.items;
          this.gridOptions.totalData = _result.data.totItems;
          this.checkItemData = this.$_.clone(this.popupParam.chems);
          // var searchParam = {
          //   searchParam: this.searchParam,
          //   selectedRegulItems: this.selectedRegulItems,
          //   regulItemData: this.gridOptions.regulItemData,
          // };
          // 검색조건 cookie 저장하려 화면 재진입시 검색조건 유지되도록 값 저장
          if (!this.popupParam.popupMode) {
            this.gridOptions.btns[0].visible = true;
            this.gridOptions.btns[1].visible = true;
            this.gridOptions.btns[2].visible = false;
          } else {
            this.gridOptions.btns[0].visible = false;
            this.gridOptions.btns[1].visible = true;
            this.gridOptions.btns[2].visible = true;
          }
          this.searchParam.regulItemData = this.gridOptions.regulItemData; // 규재법규관련 체크 데이터
          this.AuiGrid.setGridData(this.$_.clone(_result.data.items));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 그리드 row click 이벤트
    tableLinkClicked(header, row) {
      if (row === null) return;
      this.OpenInsertPopup(row);
    },
    cellClickHandler(event) {
      if (!this.popupParam.popupMode) {
        if (event.dataField === 'chem_nm_kr') {
          this.OpenInsertPopup(event.item);
        }
      }
    },
    // 검색
    btnSearchClickedCallback(_result) {
      this.getInitDataList();
    },
    iconClicked() {
      this.show = !this.show;
    },
    btnInsert() {
      this.OpenInsertPopup(null);
    },
    OpenInsertPopup(data) {
      this.popupOptions.target = () => import(`${'./chemDetail.vue'}`);
      this.popupOptions.title = 'L0000003285'; // '화학물질';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        chemNo: data ? data.chem_no : 0,
      };
      this.popupOptions.closeCallback = this.closeChemPopup;
    },
    closeChemPopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    btnAdd() {
      let checkingData = this.AuiGrid.getCheckedRowItemsAll();
      this.closePopup(checkingData);
    },
    btnExcelDownloadClicked() {
      // 엑셀다운로드
    },
    btnExcelDownloadClickedCallBack() {
      // 엑셀다운로드 오류메시지처리
    },
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.$emit('closePopup', { data });
    },

    onPageChange(_item) {
      if (this.searchParam.pageNumber !== _item.page) {
        this.searchParam.pageNumber = _item.page;
        this.searchParam.pageSize = _item.limit;
        this.getDataList();
      }
    },
    handleSizeChange(_newPageSize) {
      this.searchParam.pageSize = _newPageSize;
      this.getDataList();
    },
    handleCurrentChange(_newPage) {
      this.getDataList();
    },
    tableSortChange(_item) {
      this.searchParam.orderByExpression =
        this.$comm.toUndrFromCamelCase(_item.prop) +
        ' ' +
        (_item.order === 'descending' ? 'desc' : 'asc');
      this.getDataList();
    },
  },
};
</script>
<style>
.pagination-container {
  background: #fff;
  padding: 0px 16px;
  text-align: center;
}
.pagination-container.hidden {
  display: none;
}
.cell-red {
  background-color: #ffa899 !important;
}
.cell-blue {
  background-color: #99b4ff !important;
}
</style>
