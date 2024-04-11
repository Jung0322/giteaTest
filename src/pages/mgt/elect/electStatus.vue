<template>
  <b-container fluid>
    <!-- 사업장 Searchbox -->
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col> -->

        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!--  법정선임자 명 -->
          <y-select
            :width="8"
            :comboItems="electTitleItems"
            itemText="electTitlNm"
            itemValue="safElectTitlNo"
            ui="bootstrap"
            name="status"
            label="L0000001565"
            v-model="searchParam.safElectTitlNo"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
          검색
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           선해임 목록
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @tableLinkClicked="tableLinkClicked"
            :rowClassName="tableRowClassName"
            label="L0000001563"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000001563')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
          @getList="getList"
        />
      </b-col>
    </b-row>

    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import { header } from 'case';

export default {
  name: 'y-elec-status',

  data: () => ({
    searchParam: {
      safElectTitlNo: null, // 법정선임자 명 번호
      plantCd: '',
    },

    searchArea: {
      show: true,
    },
    gridOptions: {
      name: 'electStatus',
      header: [],
      btns: [],
      data: [],
      height: '490',
    },
    YAuiGrid: null,
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '500px',
      top: '50px',
      param: {},
      closeCallback: null,
    },
    electTitleItems: [], // 법정선임자명 select아이템
    searchElectTitleUrl: '',
    temptPlantCdItems: [],
    editable: true,
    searchUrl: '',
    popupMode: '',
  }),

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
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      this.searchElectTitleUrl = selectConfig.saf.electTitle.list.url;
      this.searchUrl = selectConfig.saf.electHis.electStatusList.url;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001565'),
          dataField: 'elect_titl_nm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003180'),
          dataField: 'elect_total',
          width: '15%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        // {
        //   text: 'L0000003180' /* 합계 */,
        //   name: 'elect_total',
        //   width: '60px',
        //   align: 'right',
        //   url: true,
        //   disabledFn: this.disabledFn,
        // },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
      this.getPlantItems();

      this.getElectTitleComboItems(); // 선해임명

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getList(); // 선해임 목록 조회
    },
    /** 선해임명 **/
    getElectTitleComboItems() {
      this.$http.url = this.searchElectTitleUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.electTitleItems = this.$_.clone(_result.data);
          this.electTitleItems.splice(0, 0, {
            safElectTitlNo: null,
            electTitlNm:
              this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getPlantItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'COM_PLANT_CD'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.temptPlantCdItems = this.$_.clone(_result.data);

          // 공통사업장 제거
          let _idx = 0;
          let _delIndx = -1;
          this.$_.forEach(this.temptPlantCdItems, (item) => {
            if (item.code === '0000') {
              _delIndx = _idx;
            }
            _idx += 1;
          });
          if (_delIndx > -1) this.temptPlantCdItems.splice(_delIndx, 1);
          this.$_.forEach(this.temptPlantCdItems, (item, idx) => {
            let tempItem = {
              headerText: item.codeNm,
              dataField: item.code,
              width: '12%',
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
              // align: 'right',
              // url: true,
              // disabledFn: this.disabledFn,
            };
            //     {
            //   headerText: this.$comm.getLangSpecInfoLabel('L0000003180'),
            //   dataField: 'elect_total',
            //   width: '10%',
            // },
            // 그리드 header에 사업장 출력
            this.gridOptions.header.splice(1 + idx, 0, tempItem);
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'elect_titl_nm') return;
      this.popupOptions.target = () => import(`${'./electHis.vue'}`);
      this.popupOptions.title = 'L0000005104'; /* 법정선임자 현황 목록 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      if (event.dataField === 'elect_total') {
        this.popupOptions.param = {
          plantCd: null,
          safElectTitlNo: event.item.saf_elect_titl_no,
          popupMode: true,
          testEndDt: 'Y',
        };
      } else {
        this.popupOptions.param = {
          plantCd: event.dataField,
          safElectTitlNo: event.item.saf_elect_titl_no,
          popupMode: true,
          testEndDt: 'Y',
        };
      }
      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkClicked(header, data) {
      if (data === null) return;
      this.popupOptions.target = () => import(`${'./electHis.vue'}`);
      this.popupOptions.title = 'L0000005104'; /* 법정선임자 현황 목록 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      if (header.name === 'elect_total') {
        this.popupOptions.param = {
          plantCd: null,
          safElectTitlNo: data.saf_elect_titl_no,
          popupMode: true,
          testEndDt: 'Y',
        };
      } else {
        this.popupOptions.param = {
          plantCd: header.name,
          safElectTitlNo: data.saf_elect_titl_no,
          popupMode: true,
          testEndDt: 'Y',
        };
      }
      this.popupOptions.closeCallback = this.closePopup;
    },

    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },

    // grid 에 list 불러오기
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));

          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.elect_titl_nm === '합계') {
        return 'row-eval-background-color';
      }
    },
    disabledFn(header, row, index) {
      if (row.elect_titl_nm === '합계') {
        return false;
      }

      return true;
    },
  },
};
</script>
<style>
/* .row-pointer .el-button {
  color: black !important;
  pointer-events: none;
  background-color: #80808042;
} */
.row-eval-background-color {
  /* color: black; */
  background-color: #80808042 !important;
  pointer-events: none;
}
</style>
