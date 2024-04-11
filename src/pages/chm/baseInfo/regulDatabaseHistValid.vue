<!--
  목적 : 화학물질관리 > 기본정보 > 규제DB 업로드 > 규제DB업로드 목록
  작성자 : kyk
  Detail : 영향받을 화학물질 / 영향받을 자재에 대해서 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 아래 그리드 강제 설정을 위해 y-search-box 생성 -->
    <y-search-box :gridOptions="gridOptions" v-show="false"></y-search-box>
    <y-search-box :gridOptions="gridProdOptions" v-show="false"></y-search-box>

    <b-row class="mt-3" ref="detailBox">
      <b-col sm="12">
        <b-row>
          <b-col sm="12">
            <!-- 닫기 -->
            <div slot="buttonGroup" class="float-right mb-1">
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
          </b-col>
        </b-row>

        <b-card>
          <b-row>
            <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-12">
              <el-tabs type="border-card">
                <!-- 영향 화학물질 -->
                <el-tab-pane :label="this.$comm.getLangSpecInfoLabel('L0000002015')">
                  <!-- 건수 -->
                  <!-- <y-data-table
                    v-model="selectedValue"
                    label="L0000003877"
                    ref="dataTable"
                    :height="gridOptions.height"
                    :headers="gridOptions.header"
                    :items="gridOptions.data"
                    :excelDown="true"
                    :usePaging="true"
                  ></y-data-table> -->
                  <b-col sm="12" class="h100p">
                    <y-auigrid
                      ref="yAuiGrid"
                      :name="gridOptions.name"
                      :headers="gridOptions.header"
                      :btns="gridOptions.btns"
                      :height="gridOptions.height"
                      :label="this.$comm.getLangSpecInfoLabel('L0000003877')"
                      :useExcelExport="false"
                      :showGridSetSave="true"
                      :useContextMenu="true"
                      :enableRightDownFocus="true"
                      :showGridCtrl="true"  
                    />
                  </b-col>
                </el-tab-pane>
                <!-- 영향 화학자재 -->
                <el-tab-pane :label="this.$comm.getLangSpecInfoLabel('L0000002016')">
                  <!-- 건수 -->
                  <!-- <y-data-table
                    v-model="selectedValue"
                    label="L0000003877"
                    ref="dataTable"
                    :height="gridProdOptions.height"
                    :headers="gridProdOptions.header"
                    :items="gridProdOptions.data"
                    :excelDown="true"
                    :usePaging="true"
                  ></y-data-table> -->
                  <b-col sm="12" class="h100p">
                  <y-auigrid
                      ref="auiGrid"
                      :name="gridProdOptions.name"
                      :headers="gridProdOptions.header"
                      :btns="gridProdOptions.btns"
                      :height="gridProdOptions.height"
                      :label="this.$comm.getLangSpecInfoLabel('L0000003877')"
                      :useExcelExport="false"
                      :showGridSetSave="true"
                      :useContextMenu="true"
                      :enableRightDownFocus="true"
                      :showGridCtrl="true"  
                    />
                  </b-col>
                </el-tab-pane>
              </el-tabs>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'y-regul-database-hist-valid',
  props: {
    popupParam: {
      type: Object,
      default: {
        chmRegulDbCd: '',
        uploadStatus: '',
      },
    },
  },
  data: () => ({
    editable: false,
    gridOptions: {
      name: 'regulDatabaseHistValid1',
      header: [],
      data: [],
      height: '400',
    },
    YAuiGrid: null,
    gridProdOptions: {
      name: 'regulDatabaseHistValid2',
      header: [],
      data: [],
      height: '400',
    },
    AuiGrid: null,
    selectedValue: [],
    affprodlistUrl: '',
    affchemlistUrl: '',
  }),
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.AuiGrid = this.$refs.auiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      if (this.popupParam.uploadStatus === 'CRD40') {
        this.affprodlistUrl =
          selectConfig.chm.chemicalreguldbhist.affprodapplylist.url;
        this.affchemlistUrl =
          selectConfig.chm.chemicalreguldbhist.affchemapplylist.url;
      } else {
        this.affprodlistUrl =
          selectConfig.chm.chemicalreguldbhist.affprodlist.url;
        this.affchemlistUrl =
          selectConfig.chm.chemicalreguldbhist.affchemlist.url;
      }

      // 그리드 헤더 설정
      this.getChemHeader();
      this.getProdHeader();
      this.getDataList();
      this.getDataProdList();
    },
    getDataList() {
      if (this.popupParam.chmRegulDbCd === '') return;
      this.$http.url = this.$format(
        this.affchemlistUrl,
        this.popupParam.chmRegulDbCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getDataProdList() {
      if (this.popupParam.chmRegulDbCd === '') return;
      this.$http.url = this.$format(
        this.affprodlistUrl,
        this.popupParam.chmRegulDbCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          // this.gridProdOptions.data = this.$_.clone(_result.data);
          this.AuiGrid.setGridData(this.$_.clone(_result.data))
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    resizeGrid() {
      let _height = window.innerHeight - 395;  
      let _width = window.innerWidth - 495;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(_width, _height);
      this.AuiGrid.resize(_width, _height);
    },
    getChemHeader() {
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003299'), 
          dataField: 'chemNmKr', 
          width: '15%',           
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003300'), 
          dataField: 'chemNmEn', 
          width: '15%',           
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001207'), 
          dataField: 'lawNm', 
          width: '15%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000731'), 
          dataField: 'regulItmNm', 
          width: '15%',    
          style: 'left-align',       
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001230'), 
          dataField: 'actType', 
          width: '20%',    
          style: 'left-align',       
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001234'), 
          dataField: 'actTypeDesc', 
          width: '20%',    
          style: 'left-align',       
        },
      ];
    },
    getProdHeader() {
      this.gridProdOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003299'), 
          dataField: 'chemNmKr', 
          width: '15%',           
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003300'), 
          dataField: 'chemNmEn', 
          width: '15%',           
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001207'), 
          dataField: 'lawNm', 
          width: '15%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000731'), 
          dataField: 'regulItmNm', 
          width: '15%',    
          style: 'left-align',       
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001230'), 
          dataField: 'actType', 
          width: '20%',    
          style: 'left-align',       
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001234'), 
          dataField: 'actTypeDesc', 
          width: '20%',    
          style: 'left-align',       
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003318'), 
          dataField: 'chemProdNmKr', 
          width: '20%',    
          style: 'left-align',       
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003319'), 
          dataField: 'chemProdNmEn', 
          width: '20%',    
          style: 'left-align',       
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000157'), 
          dataField: 'sapMatCd', 
          width: '20%',    
          style: 'left-align',       
        },
      ];
    },
  },
};
</script>
