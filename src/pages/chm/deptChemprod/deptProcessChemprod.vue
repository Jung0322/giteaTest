<!--
  목적 : 기초정보 > 공정별 화학자재
  작성자 : kga
  수정자 : jkl
  Detail :
  풍산 기준으로 화면 재정의
  공정별 화학자재를 다중으로 선택 가능하도록 변경한다.
  ** 수정: 등록/수정을 팝업으로 전환
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="4" class="col-xxl-3">
          <y-plant
            type="search"
            filter="chm"
            name="plantCd"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="4" class="col-xxl-3">
          <y-tree-dept
            type="search"
            name="deptCd"
            v-model="searchParam.deptCd"
            :plantCd="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="4" class="col-xxl-3">
          <y-tree-process
            name="processCd"
            type="search"
            :plantCd="searchParam.plantCd"
            :deptCd="searchParam.deptCd"
            v-model="searchParam.processCd"
          ></y-tree-process>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="4" class="col-xxl-3">
          <!-- 검색어 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000331"
            name="search"
            placeholder="L0000003860"
            v-model="searchParam.search"
          ></y-text>
          <!-- 화학자재명 및 제조/공급업체명 -->
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="4" class="col-xxl-3">
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
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1">
             신규등록 
            <y-btn
              title="L0000001789"
              color="orange"
              @btnClicked="openPopup(null)"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getDataList"
            />
          </div>
           부서공정별 화학자재 목록 
          <y-data-table
            ref="dataTable"
            label="L0000001304"
            :cellClick="true"
            :useRownum="false"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :span-options="gridOptions.merge"
            @tableLinkClicked="tableLinkClicked"
          ></y-data-table>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000001304')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getDataList="getDataList"
          @cellClick="cellClickHandler"
          @openPopup="openPopup(null)"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'dept-process-chemprod',
  props: {},
  data() {
    return {
      searchParam: {
        deptCd: '',
        processCd: '',
        search: '',
        plantCd: '',
        useYn: 'Y',
      },
      gridOptions: {
        name: 'deptProcessChemprod',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
        merge: [],
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
      editable: false,
      useItems: [],
    };
  },
  watch: {},
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
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.useItems = [
        { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000001440') }, // 사용
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000001063') }, // 미사용
      ];
      this.gridOptions.merge = [];
      this.gridOptions.header = [];
      this.gridOptions.merge.push(
        // { index: 0, field: 'rownum' },
        { index: 0, field: 'plantNm' },
        { index: 1, field: 'deptNm' },
        { index: 2, field: 'processNm' },
        { index: 11, field: 'processNm' },
        { index: 12, field: 'processNm' },
        { index: 13, field: 'processNm' }
      );
      // 사업장
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
        dataField: 'plantNm',
        width: '10%',
        cellMerge: true,
      });
      // 부서
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
        dataField: 'deptNm',
        width: '10%',
        style: 'left-align',
        cellMerge: true,
      });
      // 취급공정
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000002915'),
        dataField: 'processNm',
        width: '10%',
        style: 'left-align',
        cellMerge: true,
        renderer: {
          type: 'LinkRenderer',
          baseUrl: 'javascript',
          jsCallback: function (rowIndex, columnIndex, value, item) {},
        },
      });
      // 납품업체
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000000804'),
        dataField: 'vendorNm',
        width: '10%',
        style: 'left-align',
      });
      // 제조업체
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000002627'),
        dataField: 'makerNm',
        width: '10%',
        style: 'left-align',
      });
      // 화학자재명(국문)
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000003318'),
        dataField: 'chemProdNmKr',
        width: '10%',
        style: 'left-align',
      });
      // 화학자재명(영문)
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000003319'),
        dataField: 'chemProdNmEn',
        width: '10%',
        style: 'left-align',
      });
      // 일사용량
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000002267'),
        dataField: 'dayUsage',
        width: '7%',
        style: 'right-align',
      });
      // 단위
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000000870'),
        dataField: 'usageUnitNm',
        width: '6%',
      });
      // 사용용도
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000001456'),
        dataField: 'substanceUsing',
        width: '6%',
        style: 'left-align',
      });
      // 취급형태
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000002918'),
        dataField: 'handlingTypeNm',
        width: '7%',
        style: 'left-align',
      });
      // 사용여부
      this.gridOptions.header.push({
        headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
        dataField: 'useYnNm',
        width: '7%',
        style: 'left-align',
      });
      // 작성일/자
      this.gridOptions.header.push(
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        }
      );
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openPopup',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',
        },
      ];
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 By 2022-05-09 장헌영 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDataList();
    },
    cellClickHandler(event) {
      if (event.dataField !== 'processNm') return;
      this.openPopup(event.item);
    },
    tableLinkClicked(header, data) {
      if (!data) return;
      this.openPopup(data);
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    openPopup(data) {
      if (data) {
        this.popupOptions.param = {
          rowData: data,
        };
      } else {
        this.popupOptions.param = null;
      }
      this.popupOptions.title = 'L0000003861'; // '부서공정별 화학자재';
      this.popupOptions.target = () => import(`${'./dpcDetail.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    // 부서별 취급물질 grid
    getDataList() {
      this.$http.url = selectConfig.chm.deptChemprod.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);

          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
  },
};
</script>
