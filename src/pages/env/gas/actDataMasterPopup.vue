<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!--구분-->
          <y-select
            :width="8"
            :comboItems="actClsCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000686"
            name="actClsCd"
            v-model="searchParam.actClsCd"
          ></y-select>
        </b-col>
        <!-- 활동자료명 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            label="L0000003350"
            name="actDataNm"
            v-model="searchParam.actDataNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             선택 
            <y-btn title="L0000001561" color="orange" @btnClicked="selectbtn" />
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
             닫기 
            <y-btn title="L0000000881" @btnClicked="closeMPopup" />
          </div>
           활동자료명 목록 
          <y-data-table
            label="L0000003351"
            :height="gridOptions3.height"
            :headers="gridOptions3.header"
            :items="gridOptions3.data"
            :popMode="true"
            @selectedRow="selectedRow"
            @rowDoubleClicked="rowDoubleClicked"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <!-- 활동자료명 목록  -->
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000003351')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          @cellClick="cellClickHandler"
          @cellDoubleClick="cellDoubleClickHandler"
          @btnSelect="selectbtn"
          @btnSearch="btnSearchClicked"
          @closePopup="closeMPopup"
        />
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'reference-room',
  props: {},
  data() {
    return {
      searchParam: {
        actClsCd: '',
        actDataNm: '',
      },
      gridOptions: {
        header: [],
        data: [],
        btns: [],
        height: 'auto',
      },
      actClsCdItems: [],
      editable: false,
      selectedData: null,
      YAuiGrid: null,
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.setGridHeader();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.init();
  },
  beforeDestroy() {},

  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.$comm.getComboItems('ACT_CLS_DATA', true).then((_result) => {
        this.actClsCdItems = _result;
      });
      this.getList();
    },
    setGridHeader() {
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'actClsNm',
          width: '200px',
        } /* 구분 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000915'),
          dataField: 'ppActDataNm',
          width: '200px',
        } /* 대분류명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002731'),
          dataField: 'pActDataNm',
          width: '200px',
        } /* 중분류명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003353'),
          dataField: 'actDataCd',
          width: '200px',
        } /* 활동자료코드 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003350'),
          dataField: 'actDataNm',
          width: '250px',
        } /* 활동자료명 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '80px',
        } /* 사용여부 */,
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002601'),
          dataField: 'sortOrder',
          width: '80px',
        } /* 정렬순서 */,
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnSelect',
        }, //  선택
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearch',
        }, //  검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        }, //  닫기
      ];
    },

    getList() {
      this.$http.url = selectConfig.env.gas.actDataMaster.getParent.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(data) {
      this.selectedData = data.item;
    },
    selectbtn() {
      if (!this.selectedData) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000068' /* 선택하세요 */,
          type: 'warning', // success / info / warning / error
        });
      } else {
        // 부모값에 값 전달'
        this.$emit('closePopup', { success: true, data: this.selectedData });
      }
    },
    // row 더블 클릭시
    cellDoubleClickHandler(data) {
      this.$emit('closePopup', { success: true, data: this.selectedData });
    },
    closeMPopup() {
      this.$emit('closePopup', {});
    },
    btnSearchClicked() {
      this.getList();
    },
  },
};
</script>
