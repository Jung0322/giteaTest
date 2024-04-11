<!--
  목적 : 가동전점검 - 가동전점검 점검 항목
  Detail : 가동전점검 점검 상세보기
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
            @datachange="datachange"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 점검유형 -->
          <y-select
            :width="8"
            :comboItems="comboPreOperationItems"
            :editable="true"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000004068"
            name="safCheckTypeCd"
            v-model="searchParam.safCheckTypeCd"
            @datachange="datachange"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="mt-3">
      <!-- <b-col sm="4">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback('L', 'ECL01')"
            />
          </div>
           점검내용 대분류 목록 
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :useRownum="false"
            :print="true"
            rowKey="safFacilityCheckItemNo"
            @tableLinkClicked="tableLinkClicked"
            @selectedRow="selectedRow"
            label="L0000004076"
          ></y-data-table>
        </b-col>
      </b-col> -->
      <b-col sm="4" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004076')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @btnPopupClickedCallback="btnPopupClickedCallback('L', 'ECL01')"
          @cellClick="cellClickHandler"          
        />
      </b-col>
      <!-- <b-col sm="4">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback('M', 'ECL02')"
            />
          </div>
           점검내용 중분류 목록 
          <y-data-table
            ref="dataTable2"
            :height="gridOptions.height"
            :headers="gridOptions2.header"
            :items="gridOptions2.data"
            :useRownum="false"
            :print="true"
            rowKey="safFacilityCheckItemNo"
            @selectedRow="selectedRow2"
            @tableLinkClicked="tableLinkClicked2"
            label="L0000004077"
          ></y-data-table>
        </b-col>
      </b-col> -->
      <b-col sm="4" class="h100p">
        <y-auigrid
          ref="auiGrid"
          :name="gridOptions2.name"
          :headers="gridOptions2.header"
          :btns="gridOptions2.btns"
          :height="gridOptions2.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004077')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @btnPopupClickedCallback="btnPopupClickedCallback('M', 'ECL02')"
          @cellClick="cellClickHandler2"
        />
      </b-col>
      <!-- <b-col sm="4">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback('S', 'ECL03')"
            />
          </div>
           점검내용 소분류 목록 
          <y-data-table
            ref="dataTable3"
            :height="gridOptions.height"
            :headers="gridOptions3.header"
            :items="gridOptions3.data"
            :useRownum="false"
            :print="true"
            rowKey="safFacilityCheckItemNo"
            @tableLinkClicked="tableLinkClicked3"
            label="L0000004078"
          ></y-data-table>
        </b-col>
      </b-col> -->
      <b-col sm="4" class="h100p">
        <y-auigrid
          ref="lastauiGrid"
          :name="gridOptions3.name"
          :headers="gridOptions3.header"
          :btns="gridOptions3.btns"
          :height="gridOptions3.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004078')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @btnPopupClickedCallback="btnPopupClickedCallback('S', 'ECL03')"
          @cellClick="cellClickHandler3"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-facility-check-item',
  props: {},
  data: () => ({
    searchParam: {
      plantCd: '', // 사업장
      safCheckTypeCd: 'SPC01', // 가동전점검종류코드
      dataLvlCd: '',
    },
    gridOptions: {
      name: 'inspBefOperResultItem',
      btns: [],
      header: [],
      data: [],
      height: 'auto',
    },
    gridOptions2: {
      name: 'inspBefOperResultItem2',
      btns: [],
      header: [],
      data: [],
      height: 'auto',
    },
    gridOptions3: {
      name: 'inspBefOperResultItem3',
      btns: [],
      header: [],
      data: [],
      height: 'auto',
    },
    YAuiGrid: null,
    AuiGrid: null,
    LastAuiGrid: null,
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '80%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    comboPreOperationItems: [],
    editable: false,
    searchUrl: '',
    flag: false,
    tempFirstItems: {},
    tempSecondItems: {},
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.AuiGrid = this.$refs.auiGrid;
    this.LastAuiGrid = this.$refs.lastauiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.baseInfo.inspBefOper.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004073'), 
          dataField: 'safFacilityCheckNm', 
          width: '70%', 
          style: 'left-align',
        },
        {
          headerText: '',
          dataField: 'updating', 
          width: '30%', 
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        },
      ]

      // 그리드 헤더 설정
      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004074'), 
          dataField: 'safFacilityCheckNm', 
          width: '70%', 
          style: 'left-align',
        },
        {
          headerText: '',
          dataField: 'updating', 
          width: '30%', 
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
      ];
      this.gridOptions2.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        },
      ]
      // 그리드 헤더 설정
      this.gridOptions3.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004075'), 
          dataField: 'safFacilityCheckNm', 
          width: '70%', 
          style: 'left-align',
        },
        {
          headerText: '',
          dataField: 'updating', 
          width: '30%', 
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
      ];
      this.gridOptions3.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        },
      ]
      this.$comm.getComboItems('SAF_PREOPERATION_CHECK').then((_result) => {
        this.comboPreOperationItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 385;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
      this.AuiGrid.resize(null, _height);
      this.LastAuiGrid.resize(null, _height);
    },
    getList(data) {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.searchParam.dataLvlCd = 'ECL01';
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data))
          this.$comm.pushCookie(this.searchParam);

          // if (this.gridOptions.data && this.gridOptions.data.length) {
          //   this.$refs.dataTable.setCurrentRow(
          //     data ? data : this.gridOptions.data[0]
          //   );
          //   // this.selectedRow(data ? data : this.gridOptions.data[0]);
          //   this.$forceUpdate();
          // }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    datachange(data) {
      this.getList();
      this.gridOptions2.data = [];
      this.gridOptions3.data = [];
      this.AuiGrid.setGridData(this.gridOptions2.data);
      this.LastAuiGrid.setGridData(this.gridOptions3.data);
    },
    selectedFirstRow(row) {
      this.$http.url = this.$format(
        selectConfig.baseInfo.inspBefOper.items.url,
        'ECL02',
        row.safCheckTypeCd,
        row.safFacilityCheckItemNo,
        'Y',
        row.plantCd
      );
      this.$http.type = 'GET';
      this.tempFirstItems = row;
      this.$http.request(
        (_result) => {
          this.gridOptions2.data = this.$_.clone(_result.data);
          this.AuiGrid.setGridData(this.$_.clone(_result.data));
          if (!this.flag) {
            this.tempSecondItems = {};
            this.gridOptions3.data = [];
          }

          // if (this.gridOptions2.data && this.gridOptions2.data.length) {
          //   this.$refs.dataTable2.setCurrentRow(
          //     second ? second : this.gridOptions2.data[0]
          //   );
          //   this.selectedRow2(second ? second : this.gridOptions2.data[0]);
          //   this.$forceUpdate();
          // }

          setTimeout(() => {
            this.flag = false;
          }, 100);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    selectedRow(first, second) {
      this.$http.url = this.$format(
        selectConfig.baseInfo.inspBefOper.items.url,
        'ECL02',
        first.safCheckTypeCd,
        first.safFacilityCheckItemNo,
        'Y',
        first.plantCd
      );
      this.$http.type = 'GET';
      this.tempFirstItems = first;
      this.$http.request(
        (_result) => {
          this.gridOptions2.data = this.$_.clone(_result.data);
          if (!this.flag) {
            this.tempSecondItems = {};
            this.gridOptions3.data = [];
          }

          if (this.gridOptions2.data && this.gridOptions2.data.length) {
            this.$refs.dataTable2.setCurrentRow(
              second ? second : this.gridOptions2.data[0]
            );
            this.selectedRow2(second ? second : this.gridOptions2.data[0]);
            this.$forceUpdate();
          }

          setTimeout(() => {
            this.flag = false;
          }, 100);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    selectedSecondRow(row) {
      this.$http.url = this.$format(
        selectConfig.baseInfo.inspBefOper.items.url,
        'ECL03',
        row.safCheckTypeCd,
        row.safFacilityCheckItemNo,
        'Y',
        row.plantCd
      );
      this.$http.type = 'GET';
      this.tempSecondItems = row;
      this.tempSecondItems.pSafFacilityCheckNm =
        this.tempFirstItems.safFacilityCheckItemNo;
      this.tempSecondItems.plantCd = this.tempFirstItems.plantCd;
      this.$http.request(
        (_result) => {
          this.LastAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    selectedRow2(data) {
      this.$http.url = this.$format(
        selectConfig.baseInfo.inspBefOper.items.url,
        'ECL03',
        data.safCheckTypeCd,
        data.safFacilityCheckItemNo,
        'Y',
        data.plantCd
      );
      this.$http.type = 'GET';
      this.tempSecondItems = data;
      this.tempSecondItems.pSafFacilityCheckNm =
        this.tempFirstItems.safFacilityCheckItemNo;
      this.tempSecondItems.plantCd = this.tempFirstItems.plantCd;
      this.$http.request(
        (_result) => {
          this.gridOptions3.data = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      // if (event.dataField !== 'updating') return;
      if (event.dataField !== 'updating') {
        this.selectedFirstRow(event.item)
      } else {
        this.popupOptions.target = () =>
        import(`${'./inspBefOperResultItemDetail.vue'}`);
        this.popupOptions.title = 'L0000004064'; // 가동전점검별 점검 항목 등록/수정';
        this.popupOptions.visible = true;
        this.popupOptions.param = {
          safFacilityCheckItemNo: event.item.safFacilityCheckItemNo,
          kind: 'L',
          dataLvlCd: 'ECL01',
        };
        this.popupOptions.closeCallback = this.closePopupUsage;
      }
      
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = () =>
        import(`${'./inspBefOperResultItemDetail.vue'}`);
      this.popupOptions.title = 'L0000004064'; // 가동전점검별 점검 항목 등록/수정';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        safFacilityCheckItemNo: data.safFacilityCheckItemNo,
        kind: 'L',
        dataLvlCd: 'ECL01',
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler2(event) {
      if (event.dataField !== 'updating') {
        this.selectedSecondRow(event.item);
      } else {
        this.popupOptions.target = () =>
        import(`${'./inspBefOperResultItemDetail.vue'}`);
        this.popupOptions.title = 'L0000004064'; // 가동전점검별 점검 항목 등록/수정';
        this.popupOptions.visible = true;
        this.popupOptions.param = {
          safFacilityCheckItemNo: event.item.safFacilityCheckItemNo,
          kind: 'M',
          dataLvlCd: 'ECL02',
        };
        this.popupOptions.closeCallback = this.closePopupUsage;
      }
      
    },
    tableLinkClicked2(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = () =>
        import(`${'./inspBefOperResultItemDetail.vue'}`);
      this.popupOptions.title = 'L0000004064'; // 가동전점검별 점검 항목 등록/수정';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        safFacilityCheckItemNo: data.safFacilityCheckItemNo,
        kind: 'M',
        dataLvlCd: 'ECL02',
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler3(event) {
      if (event.dataField !== 'updating') return;
      this.popupOptions.target = () =>
        import(`${'./inspBefOperResultItemDetail.vue'}`);
      this.popupOptions.title = 'L0000004064'; // 가동전점검별 점검 항목 등록/수정';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        safFacilityCheckItemNo: event.item.safFacilityCheckItemNo,
        kind: 'S',
        dataLvlCd: 'ECL03',
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked3(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = () =>
        import(`${'./inspBefOperResultItemDetail.vue'}`);
      this.popupOptions.title = 'L0000004064'; // 가동전점검별 점검 항목 등록/수정';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        safFacilityCheckItemNo: data.safFacilityCheckItemNo,
        kind: 'S',
        dataLvlCd: 'ECL03',
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback(kind, lvl) {
      this.popupOptions.target = () =>
        import(`${'./inspBefOperResultItemDetail.vue'}`);
      this.popupOptions.title = 'L0000004064'; // 가동전점검별 점검 항목 등록/수정';
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        safCheckTypeCd: this.searchParam.safCheckTypeCd,
        safFacilityCheckItemNo: 0,
        kind: kind,
        dataLvlCd: lvl,
        tempFirstItems: this.tempFirstItems,
        tempSecondItems: this.tempSecondItems,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 사용자의 입력을 받는다.
     */

    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      // this.getList(this.tempFirstItems);
      this.flag = true;
      if (data.data.kind === 'L') {
        if (this.tempFirstItems.safFacilityCheckItemNo) {
          this.selectedFirstRow(this.tempFirstItems);
        }
      } else if (data.data.kind === 'M') {
        if (this.tempFirstItems.safFacilityCheckItemNo) {
          this.selectedFirstRow(this.tempFirstItems, this.tempSecondItems);
        }
        // if (this.tempSecondItems.safFacilityCheckItemNo) {
        //   this.selectedRow2(this.tempSecondItems);
        // }
      } else {
        if (this.tempSecondItems.safFacilityCheckItemNo) {
          setTimeout(() => {
            this.selectedSecondRow(this.tempSecondItems);
          }, 50);
        }
      }
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
