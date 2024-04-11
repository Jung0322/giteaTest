<!--
  목적 : 경영 > 기준정보 > SHE목표 분야별 항목 관리
  작성자 : mjpark
  Detail : SHE목표 분야별 항목 관리 조회화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 분야 -->
          <y-select
            :width="8"
            :comboItems="bizFieldCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001346"
            name="bizFieldCd"
            v-model="searchParam.bizFieldCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 항목명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003199"
            name="bizFieldItemNm"
            v-model="searchParam.bizFieldItemNm"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="useItems"
            itemText="codeNm"
            itemValue="code"
            label="L0000001439"
            ui="bootstrap"
            name="useYn"
            v-model="searchParam.useYn"
          />
        </b-col>
      </b-row>
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 작성일 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002352"
            name="createDt"
            default="createDt"
            v-model="createDt"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 작성자 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002355"
            name="createUserNm"
            v-model="searchParam.createUserNm"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           KPI 분야별 항목관리
          <y-data-table
            ref="dataTable"
            label="L0000005095"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :span-options="gridOptions.merge"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
            :rowClassName="tableRowClassName"
          />
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005095')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @getList="getList"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'safety-action-biz-field-item',
  props: {},
  data() {
    return {
      searchParam: {
        bizFieldCd: null, // 분야
        bizFieldItemNm: '', // 항목
        useYn: 'Y', // 사용여부
        from: '',
        to: '',
        createUserNm: '', // 작성자
      },
      gridOptions: {
        name: 'safetyActionBizFieldItem',
        btns: [],
        header: [],
        data: [],
        merge: [],
        height: 'auto',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      bizFieldCdSearchItems: [], // 분야 리스트 (검색)
      useItems: [],
      editable: false,
      searchUrl: '',
      createDt: [],
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  methods: {
    tableRowClassName({ row, rowIndex }) {
      return 'odd-row';
    },
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.mgt.safetyActionBizFieldItem.list.url;

      this.getComboItems('MGT_BIZ_FIELD'); // SHE 분야

      this.createDt.push(
        this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '-3m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        )
      );
      this.createDt.push(
        this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '0m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        )
      );

      this.useItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];

      this.gridOptions.merge.push({ index: 1, field: 'bizFieldNm' });

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001346'), 
          dataField: 'bizFieldNm', 
          width: '10%', 
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003199'), 
          dataField: 'bizFieldItemNm', 
          width: '30%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004965'), 
          dataField: 'decPlace', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'), 
          dataField: 'sortOrder', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005307'), 
          dataField: 'dashboardYnNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'), 
          dataField: 'useYnNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'createUserNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'createDt', 
          width: '10%', 
        },        
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ]

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
    },

    /**
     * 공통 마스터 정보 조회 (분야)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'MGT_BIZ_FIELD') {
            this.bizFieldCdSearchItems = this.$_.clone(_result.data);
            this.bizFieldCdSearchItems.splice(0, 0, {
              code: null,
              codeNm:
                this.$comm.getLangSpecInfoLabel('L0000002519') /* '전체' */,
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },

    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'get';
      this.searchParam.from = this.createDt[0];
      this.searchParam.to = this.createDt[1];
      this.$http.param = this.searchParam;

      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField !== 'bizFieldItemNm') return;
      this.popupOptions.target = () =>
        import(`${'./safetyActionBizFieldItemDetail.vue'}`);
      this.popupOptions.title = 'L0000005095'; // SHE목표 분야별 항목 관리 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 수정 팝업 호출
     */
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.target = () =>
        import(`${'./safetyActionBizFieldItemDetail.vue'}`);
      this.popupOptions.title = 'L0000005095'; // SHE목표 분야별 항목 관리 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업 호출
     */
    btnPopupClickedCallback(data) {
      this.popupOptions.target = () =>
        import(`${'./safetyActionBizFieldItemDetail.vue'}`);
      this.popupOptions.title = 'L0000005095'; // SHE목표 분야별 항목 관리 상세 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        bizFieldItemNo: 0,
      };
      data = this.popupOptions.param;
      this.popupOptions.closeCallback = this.closePopupUsage;
    },

    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
  },
};
</script>
