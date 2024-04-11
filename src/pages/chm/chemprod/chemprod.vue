<!--
  목적 : 화학물질 > 화학자재 목록
  작성자 : kdh
  Detail : 화학자재 목록 조회 화면을 보여준다.
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
          lg="4"
          xl="4"
          class="col-xxl-4"
        >
          <!-- 대표사업장 -->
          <y-plant
            type="search"
            filter="chm"
            label="L0000000940"
            name="plantCd"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col
          v-if="!popupParam.popupMode"
          sm="6"
          md="6"
          lg="4"
          xl="4"
          class="col-xxl-4"
        >
          <!-- 위험물질 -->
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            label="L0000002143"
            name="chemprodRegulItmNm"
            v-model="searchParam.chemprodRegulItmNm"
            :appendIcon="[
              { icon: 'search', callbackName: 'searchMatStrg' },
              { icon: 'times', callbackName: 'clear' },
            ]"
            @searchMatStrg="searchMatStrg"
            @clear="clear"
          ></y-text>
        </b-col>
        <b-col
          v-if="!popupParam.popupMode"
          sm="6"
          md="6"
          lg="4"
          xl="4"
          class="col-xxl-4"
        >
          <!-- 대기오염물질 -->
          <y-select
            :width="8"
            :comboItems="airPolItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000910"
            name="airPolYn"
            v-model="searchParam.airPolYn"
          ></y-select>
        </b-col>
        <b-col
          v-if="!popupParam.popupMode"
          sm="6"
          md="6"
          lg="4"
          xl="4"
          class="col-xxl-4"
        >
          <!-- 수질오염물질 -->
          <y-select
            :width="8"
            :comboItems="wtrPolItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001703"
            name="wtrPolYn"
            v-model="searchParam.wtrPolYn"
          ></y-select>
        </b-col>
        <b-col
          v-if="!popupParam.popupMode"
          sm="6"
          md="6"
          lg="4"
          xl="4"
          class="col-xxl-4"
        >
          <!-- 인허가대상물질 -->
          <y-select
            :width="8"
            :comboItems="licensingItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002249"
            name="licensingYn"
            v-model="searchParam.licensingYn"
          ></y-select>
        </b-col>
        <b-col
          v-if="!popupParam.popupMode"
          sm="6"
          md="6"
          lg="4"
          xl="4"
          class="col-xxl-4"
        >
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001439"
            name="useYn"
            v-model="searchParam.useYn"
          ></y-select>
        </b-col>
        <b-col
          v-if="!popupParam.popupMode"
          sm="6"
          md="6"
          lg="8"
          xl="8"
          class="col-xxl-8"
        >
          <!-- 검색어 -->
          <y-text
            :width="10"
            ui="bootstrap"
            label="L0000000331"
            placeholder="L0000003862"
            name="search"
            v-model="searchParam.search"
          ></y-text>
          <!-- 화학자재명, 제품명, 자재번호 -->
        </b-col>

        <b-col
          v-if="!popupParam.popupMode"
          sm="12"
          md="12"
          lg="12"
          xl="12"
          class="col-xxl-12 mb-3"
        >
          <!-- <div slot="buttonGroup" class="float-right mb-1"> -->
          <!-- 숨기기 -->
          <!-- <y-btn v-if="show" title="L0000001723" color="green" @btnClicked="iconClicked" /> -->
          <!-- 표시 -->
          <!-- <y-btn v-if="!show" title="L0000003151" color="green" @btnClicked="iconClicked" /> -->
          <!-- </div> -->
          <!-- <el-collapse-transition>
            <div>
              <div v-show="show" slot="labelGroup" class="float-left">
                규제법규 및 항목 
                <y-label label="L0000000724" icon="list-alt" color-class="cutstom-title-color" />
                 총 {s1}건 
                <y-label :label="$comm.getLangSpecInfoLabel('L0000003405', { s1: total ? total : 0 })" style="font-size:15px;" />
              </div>
              <y-data-table
                v-show="show && gridOptionsRegulItem.data.length"
                ref="dataTableRegulItem"
                :height="gridOptionsRegulItem.height"
                :headers="gridOptionsRegulItem.header"
                :items="gridOptionsRegulItem.data"
                :fixwithclass="gridOptionsRegulItem.checkGroupStyle"
                minHeight="250px"
                id="areaRegulItem"
              ></y-data-table>
            </div>
          </el-collapse-transition> -->
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
          <!-- 규제법규 및 항목 -->
          <!-- <y-tag
            v-show="!show"
            :width="10"
            :editable="editable"
            :disabled="true"
            newLabelText
            label="L0000000724"
          /> -->
        </b-col>
        <b-col
          v-if="popupParam.popupMode"
          sm="12"
          md="12"
          lg="8"
          xl="8"
          class="col-xxl-8"
        >
          <y-text
            :width="10"
            ui="bootstrap"
            type="search"
            placeholder="L0000003862"
            name="chemprodNm"
            v-model="searchParam.chemprodNm"
          ></y-text>
          <!-- 화학자재명, 제품명, 자재번호 -->
        </b-col>
        <b-col
          v-if="popupParam.popupMode"
          sm="12"
          md="12"
          lg="4"
          xl="4"
          class="col-xxl-4"
        >
          <y-plant
            type="search"
            filter="chm"
            name="plantCd"
            v-model="searchParam.plantCd"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             <y-btn title="엑셀다운로드" @btnClicked="btnExcelExport" /> 
             신규등록 
            <y-btn
              v-if="!popupParam.popupMode && editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnInsert"
            />
            선택 
            <y-btn
              v-if="popupParam.popupMode && editable"
              title="L0000001561"
              color="orange"
              @btnClicked="btnAdd"
            />
            검색 
            <y-btn title="L0000000327" color="green" @btnClicked="btnSearchClickedCallback" />
          닫기 
            <y-btn
              v-if="popupParam.popupMode"
              title="L0000000881"
              @btnClicked="closePopup('C')"
            />
          </div>
           화학자재 목록 
          <y-data-table
            label="L0000003311"
            ref="dataTable"
            v-model="chemprodValues"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :useRownum="false"
            :use-paging="false"
            :use-server-paging="true"
            :pageTotal="searchParam.pageTotal"
            :searchExcelTotalUrl="searchUrl"
            :searchExcelTotalParam="searchParam"
            @selectedRow="selectedRow"
            @rowDoubleClicked="rowDoubleClicked"
            @tableLinkClicked="tableLinkClicked"
            @expandChange="expandChange"
            @onSortChange="tableSortChange"
          >
            <el-table-column
              v-if="popupParam.multiple"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          
             구성물질 
            <el-table-column
              v-if="!popupParam.popupMode"
              type="expand"
              slot="expand"
              :label="$comm.getLangSpecInfoLabel('L0000000689')"
              width="75"
            >
              <template slot-scope="scope">
                 * 구성물질 목록({s1}건) 
                <y-label :label="$comm.getLangSpecInfoLabel('L0000003463', { s0: scope.row.chemicals.length })"></y-label>
                <el-table
                  ref="chemicalData"
                  :border="true"
                  header-cell-class-name="default-th"
                  cell-class-name="default-td"
                  :data="scope.row.chemicals"
                  class="chem-tbl"
                >
                
                  <el-table-column width="70px" align="center" />  L0000000689
                  <el-table-column width="150px" align="center" />  L0000000940-
                  <el-table-column width="120px" align="center" /> - L0000003824-
                  <화학물질명(국문) 
                  <el-table-column :label="$comm.getLangSpecInfoLabel('L0000003304')" width="150px" prop="chem_nm_kr" align="center" />
                  - 화학물질명(영문) 
                  <el-table-column :label="$comm.getLangSpecInfoLabel('L0000003305')" width="150px" prop="chem_nm_en" align="center" />
                  < CAS No. -
                  <el-table-column :label="$comm.getLangSpecInfoLabel('L0000000102')" width="100px" prop="cas_no" align="center" />
                  <el-table-column
                    v-for="(regul, index) in regulInfor"
                    :key="index"
                    :label="regul.text"
                    align="center"
                  >
                    <el-table-column
                      v-for="_regul in regul.child"
                      :key="_regul.name"
                      :label="_regul.text"
                      :width="_regul.width"
                      :prop="_regul.name"
                      :align="_regul.align"
                    ><template slot-scope="scope">
                        <el-tag
                          v-if="_regul.type && _regul.type === 'tag'"
                          :type="
                            scope.row[_regul.prop] === _regul.compareVal
                            ? _regul.trueVal
                            : _regul.falseVal
                            "
                            disable-transition>{{ scope.row[_regul.name] }}</el-tag>
                            </template>
                      </el-table-column>
                  </el-table-column>

                <el-table-column :label="$comm.getLangSpecInfoLabel('L0000002355')" width="120px" prop="writer_user_nm" align="center" />
                <el-table-column :label="$comm.getLangSpecInfoLabel('L0000002352')" width="120px" prop="writer_dt" align="center" />



                </el-table>
              </template>
            </el-table-column>
          </y-data-table>
          <div class="pagination-container">
            <el-pagination
              ref="pagination"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="searchParam.pageNumber"
              :page-size="searchParam.pageSize"
              :page-sizes="searchParam.pageSizes"
              layout="total, sizes, prev, pager, next, jumper, ->, slot"
              :total="searchParam.pageTotal"
            ></el-pagination>
          </div>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003311')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :usePaginate="true"
          :showRowCheckColumn="popupParam.popupMode || popupParam.multiple"
          :paginateListCount="searchParam.pageSize"
          :paginateTotalCount="searchParam.pageTotal"
          :paginateCurrentPage="searchParam.pageNumber"
          @paginateClick="paginateClickHandler"
          @selectedRow="selectedRow"
          @closePopup="closePopup('C')"
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @btnInsert="btnInsert"
          @btnAdd="btnAdd"
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
export default {
  name: 'chemprod',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return { chemprod: [], popupMode: false, multiple: false, plantCd: '' };
      },
    },
  },
  data() {
    return {
      searchParam: {
        search: '', // 검색어
        regulItmNos: [],
        chemprodNm: '',
        dgrYn: '',
        chemprodRegulItmNo: 0,
        chemprodRegulItmNm: '',
        plantCd: '',
        useYn: 'Y',
        airPolYn: '',
        wtrPolYn: '',
        licensingYn: '',
        pageNumber: 1,
        pageSize: 20,
        pageTotal: 0,
        pageSizes: [10, 20],
        orderByExpression: '',
        regulItemData: [],
      },
      gridOptionsRegulItem: {
        name: 'chemprodMain',
        header: [],
        data: [],
        height: 280,
        checkGroupStyle: 'width: 140px !important;',
      },
      gridOptions: {
        name: 'chemprodmainData',
        btns: [],
        header: [],
        data: [],
        height: '400',
        totalData: [],
      },
      AuiGrid: null,
      YAuiGrid: null,
      selectChemprod: null,
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
      searchChemiUrl: '',
      searchRegulUrl: '',
      airPolItems: [],
      wtrPolItems: [],
      licensingItems: [],
      vendorItems: [],
      regulItemFullList: [],
      regulItems: [],
      regulInfor: [],
      selectedRegulItems: [],
      show: true,
      chemprodValues: [], // 팝업으로 띄우는 경우 선택된 여러개의 화학물질를 저장
      total: 0,
      isInit: true,
      isInitOrderBy: true,
      oldRegulItemData: [],
      oldOrderBy: '',
      useItems: [], // 사용여부
    };
  },

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
      this.useItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];
      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.$_.clone(this.popupParam.plantCd);
      }
      // URL 셋팅
      this.searchUrl = selectConfig.chm.chemprod.listpage.url;
      this.searchChemiUrl = selectConfig.chm.chem.list.url;
      this.searchRegulUrl = selectConfig.chm.chemicalRegulItem.list.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 By 2022-05-09 장헌영 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
        this.oldRegulItemData = searchParamByCookie.regulItemData;
        this.oldOrderBy = searchParamByCookie.orderByExpression;
      }

      if (!this.popupParam.popupMode) {
        this.getRegulItems(); // 규제법규 및 항목
        this.airPolItems = [
          { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
          { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003213') }, // 해당
          { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001065') }, // 미해당
        ];
        this.wtrPolItems = [
          { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
          { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003213') }, // 해당
          { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001065') }, // 미해당
        ];
        this.licensingItems = [
          { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
          { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003213') }, // 해당
          { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001065') }, // 미해당
        ];
      }

      // this.getInitDataList(); =>>> 쿠키로 인한 검색조건 셋팅하는 부분으로 인해 getRegulItems() 안에서 최초 호출하도록 변경처리 - 2022-05-12 by 장헌영

      if (!this.popupParam.popupMode) {
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000940'),
            dataField: 'plant_nm',
            width: '20%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003824'),
            dataField: 'sap_mat_cd',
            width: '20%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003318'),
            dataField: 'chem_prod_nm_kr',
            width: '20%',
            style: 'left-align',
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {},
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003319'),
            dataField: 'chem_prod_nm_en',
            width: '20%',
            style: 'left-align',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001635'),
            dataField: 'property_nm',
            width: '20%',
          },
        ];
      } else {
        // 팝업일때
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000940'),
            dataField: 'plantNm',
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003824'),
            dataField: 'plantsapMatCdNm',
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003318'),
            dataField: 'chemProdNmKr',
            width: '10%',
            style: 'left-align',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000003319'),
            dataField: 'chemProdNmEn',
            width: '10%',
            style: 'left-align',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001635'),
            dataField: 'propertyNm',
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001053'),
            dataField: 'mixYnNm',
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002637'),
            dataField: 'prodCatNm',
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002059'),
            dataField: 'usageNm',
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000496'),
            dataField: 'vendorNm',
            width: '10%',
            style: 'left-align',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002627'),
            dataField: 'makerNm',
            width: '10%',
            style: 'left-align',
          },
        ];
      }
      this.$comm.getComboItems('CHM_REGUL_LAW').then((regulLaws) => {
        this.setChemHeader(regulLaws);
      });
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnInsert',
          visible: !this.popupParam.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnAdd',
          visible: this.popupParam.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
          visible: this.popupParam.popupMode,
        },
      ];
      this.getDataList();
    },
    /**
     * 규제법규 및 항목 검색
     */
    getRegulItems() {
      let myThis = this;
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
          let keyNames = this.$_.uniq(this.$_.map(_result.data, 'regulLawNm'));
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
                item
              ) {
                // HTML 템플릿 작성
                const selectedList = document.querySelectorAll(
                  'input[name="' + item.regulLawNm + '"]:checked'
                );
                if (selectedList.length > 0) {
                  values = Array.from(selectedList).map((items) => items.value);
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
            },
          ];
          this.$comm.getComboItems('CHM_REGUL_LAW').then((regulLaws) => {
            this.dischargeItems = regulLaws;
            this.gridOptionsRegulItem.data = [];
            this.$_.forEach(regulLaws, (item) => {
              let idx = -1;
              let tempData = {};

              if (this.oldRegulItemData.length > 0) {
                idx = this.$_.findIndex(this.oldRegulItemData, {
                  regulLawNm: item.codeNm,
                });
                tempData =
                  idx === -1 ? {} : this.oldRegulItemData[idx].regulItmNms;
              }

              this.gridOptionsRegulItem.data.push({
                regulLawNm: item.codeNm,
                regulItmNms: !this.$_.isEmpty(tempData)
                  ? this.oldRegulItemData[idx].regulItmNms
                  : [],
              });
            });
            this.YAuiGrid.setGridData(this.gridOptionsRegulItem.data);

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

          // this.getInitDataList();
          let orderBy = this.searchParam.orderByExpression;
          if (this.isInitOrderBy && orderBy !== '') {
            this.isInitOrderBy = false;
            let orderByArr = orderBy.split(' ');
            orderBy = '';
            this.$refs.dataTable.sortChange({
              prop: orderByArr[0],
              order: orderByArr === 'desc' ? 'descending' : 'ascending',
            });
          } else {
            this.getInitDataList();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setChemHeader(regul) {
      var i = 0;
      var maxWidth = 50;
      this.regulInfor = [];
      this.$_.forEach(regul, (regul) => {
        var parent = '';
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
                // text: item.regulItmNm,
                // name: item.regulItmNo.toString(),
                // // width: item.regulItmNm.length * 8 + 105 + 'px',
                // width: '80px',
                // align: 'center',
                // sortable: false,
                // prop: item.regulItmNo.toString(),
                // type: 'tag',
                // compareVal: 'Y',
                // trueVal: 'danger',
                // falseVal: '',
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
              });
            }
          });
        });
        parent = {
          headerText: regul.codeNm,
          children: children,
          sortable: false,
        };
        this.regulInfor.push(parent);
        this.gridOptions.header.push(parent);
      });
      this.gridOptionsRegulItem.checkGroupStyle =
        'width: ' + (maxWidth + 70) + 'px !important;';
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
        dataField: 'writer_user_nm',
        width: '10%',
      });

      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
        dataField: 'writer_dt',
        width: '10%',
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
        regulItemData = this.gridOptionsRegulItem.data;
      }

      // this.$_.forEach(regulItemData, item => {
      //   saveData = this.$_.concat(saveData, item.regulItmNms);
      // });
      if (!this.popupParam.popupMode) {
        this.$_.forEach(this.YAuiGrid.getGridData(), (item) => {
          saveData = this.$_.concat(saveData, item.regulItmNos);
        });
        this.searchParam.regulItmNos = saveData;
      }
      if (this.popupParam.popupMode) {
        this.searchUrl = selectConfig.chm.chemprod.chemprodNoRegulpage.url;
        this.searchParam.useYn = 'Y';
      }
      // this.searchParam.regulItmNos = saveData;
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.searchParam.pageTotal = _result.data.count;
          _result.data.items.forEach((item) => {
            item['chemicals'] = [];
          });
          this.gridOptions.data = _result.data.items;
          this.AuiGrid.setGridData(_result.data.items);

          this.gridOptions.totalData = _result.data.totItems;

          // 검색조건 cookie 저장하려 화면 재진입시 검색조건 유지되도록 값 저장
          this.searchParam.regulItemData = this.gridOptionsRegulItem.data; // 규재법규관련 체크 데이터
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    expandChange(row) {
      this.$http.url = this.searchChemiUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        chemprodNo: row.chem_prod_no,
      };
      this.$http.request(
        (_result) => {
          row['chemicals'] = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    selectedRow(data) {
      if (!this.popupParam.popupMode) return;
      this.selectChemprod = data;
    },
    rowDoubleClicked(data) {
      if (!this.popupParam.popupMode || this.popupParam.multiple) return;
      this.closePopup(data);
    },
    // 그리드 row click 이벤트
    cellClickHandler(event) {
      if (!this.popupParam.popupMode) {
        if (event.dataField === 'chem_prod_nm_kr') {
          this.openInsertPopup(event.item);
        }
      }
    },
    tableLinkClicked(header, row) {
      if (row === null) return;

      this.openInsertPopup(row);
    },
    /** /validation checking **/

    /** Button Event **/

    // 검색
    btnSearchClickedCallback(_result) {
      this.getInitDataList();
    },
    iconClicked() {
      this.show = !this.show;
    },
    btnInsert() {
      this.openInsertPopup(null);
    },
    openInsertPopup(data) {
      this.popupOptions.target = () => import(`${'./chemprodDetailNew.vue'}`);
      this.popupOptions.title = 'L0000003309'; // '화학자재';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        chemprodNo: data ? data.chem_prod_no : 0,
      };
      this.popupOptions.closeCallback = this.closeChemprodPopup;
    },
    closeChemprodPopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getDataList(''); // 화학물질 grid
    },
    btnAdd() {
      if (!this.popupParam.multiple && !this.popupParam.popupMode) {
        if (!this.selectChemprod && !this.popupParam.multiple) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000170', // '화학자재를 선택하세요.',
            type: 'warning',
          });
        } else {
          this.closePopup(this.selectChemprod);
        }
      } else {
        let checkingData2 = this.AuiGrid.getCheckedRowItemsAll();
        if (!checkingData2 || checkingData2.length === 0) {
          window.getApp.$emit('ALERT', {
            title: 'L0000003395', // '안내',
            message: 'M0000000170', // '화학자재를 선택하세요.',
            type: 'warning',
          });
        } else {
          this.closePopup(checkingData2);
        }
      }
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
    btnExcelExport() {
      import('@/vendor/Export2Excel').then((excel) => {
        const multiHeader = [['Id', 'Main Information', '', '', 'Date']];
        const header = ['', 'Title', 'Author', 'Readings', ''];
        const filterVal = [
          'id',
          'title',
          'author',
          'pageviews',
          'display_time',
        ];
        const list = this.list;
        const data = []; // this.formatJson(filterVal, list)
        const merges = ['A1:A2', 'B1:D1', 'E1:E2'];
        excel.export_json_to_excel({
          multiHeader,
          header,
          merges,
          data,
        });
        this.downloadLoading = false;
      });
    },
    searchMatStrg() {
      this.popupOptions.target = () => import(`${'../mat/chmDgrAttAmt.vue'}`);
      this.popupOptions.title = 'L0000003808'; // '위험물 허가량';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        single: true,
      };
      this.popupOptions.closeCallback = this.closeChemPopup;
    },
    closeChemPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data !== 'CLOSE') {
        this.searchParam.chemprodRegulItmNo = data.chmDgrAttAmtNo;
        this.searchParam.chemprodRegulItmNm = data.dgrNm;
      }
    },
    clear() {
      this.searchParam.chemprodRegulItmNo = 0;
      this.searchParam.chemprodRegulItmNm = '';
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
.chem-tbl >>> .el-table__body-wrapper {
  overflow-x: hidden !important;
  margin-bottom: 35px;
}
.cell-red {
  background-color: #ffa899 !important;
}
.cell-blue {
  background-color: #99b4ff !important;
}
</style>
