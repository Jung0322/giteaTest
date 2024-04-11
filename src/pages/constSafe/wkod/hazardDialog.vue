<!--
  목적 : 유해인자 조회 팝업
  Detail : 유해인자 조회 팝업 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 -->
    <b-row>
      <b-col sm="12">
        <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
          <b-row slot="search">
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <!-- 유해위험요인 분류 -->
              <y-select
                :width="8"
                :comboItems="comboSelPriskHazardNos"
                itemText="riskHazardNm"
                itemValue="riskHazardNo"
                ui="bootstrap"
                type="search"
                label="L0000002181"
                name="priskHazardNo"
                v-model="searchParam.priskHazardNo"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 유해위험요인 -->
              <y-text
                :width="8"
                ui="bootstrap"
                label="L0000002179"
                name="riskHazardNm"
                v-model="searchParam.riskHazardNm"
              ></y-text>
            </b-col>
          </b-row>
        </y-search-box>
      </b-col>
    </b-row>

    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <!-- 유해인자 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000002190')"
          :useExcelExport="false"
          :showRowCheckColumn="true"
          @btnSearch="btnSearchClickedCallback"
          @btnSelect="closePopup('SAVE')"
          @btnClose="closePopup('CLOSE')"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';

export default {
  /* attributes: name, components, props, data */
  name: 'hazard-dialog',
  props: {
    popupParam: {
      type: Object,
      default: {
        wkodNo: 0,
        selectHandleChemContentRow: [],
      },
    },
  },
  data() {
    return {
      searchParam: {
        assessTypeNo: 0,
        priskHazardNo: 0,
        riskHazardNm: '',
      },
      YAuiGrid: null,
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },
      comboSelPriskHazardNos: [],
      selectHandleChemContentRow: [],
      handleChemContentRow: [],
      oldHandleChemContentRow: [],
      searchUrl: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
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
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = selectConfig.rsa.riskHazard.list.url;

      this.oldHandleChemContentRow = this.popupParam.selectHandleChemContentRow;
      // 그리드 헤더 설정
      this.gridOptions.header = [
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002181'), 
          dataField: 'priskHazardNm', 
          width: '30%', 
        }, // 유해위험요인 분류 
        { 
          headerText: this.$comm.getLangSpecInfoLabel('L0000002179'), 
          dataField: 'riskHazardNm', 
          width: '65%', 
          style: 'left-align', 
        }, // 유해위험요인 

      ];
      this.gridOptions.btns = [
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green', 
          btnClicked: 'btnSearch',
        },  //  검색
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000001561'), 
          color: 'orange', 
          btnClicked: 'btnSelect',
        },  //  선택
        { 
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), 
          btnClicked: 'btnClose',
        },  //  닫기
      ];
      this.getPriskHazardNos(0, 'search'); // 유해위험요인
      this.getList();
    },
    // 유해위험요인 분류
    getPriskHazardNos(assessTypeNo, flag) {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        riskHazardLevel: 1,
        assessTypeNo: assessTypeNo,
        useYn: 'Y',
      };
      this.$http.request(
        _result => {
          this.comboSelPriskHazardNos = this.$_.clone(_result.data);
          this.comboSelPriskHazardNos.unshift({
            riskHazardNo: null,
            riskHazardNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });

          if (
            this.searchParam.priskHazardNo &&
            this.$_.indexOf(
              this.$_.map(this.comboSelPriskHazardNos, 'priskHazardNo'),
              this.searchParam.priskHazardNo
            ) === -1
          ) this.searchParam.priskHazardNo = 0;
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.YAuiGrid.setGridData(_result.data);
          
          this.selectHandleChemContentRow = this.popupParam.selectHandleChemContentRow || [];
          if (this.selectHandleChemContentRow.length > 0) {
            const value = this.selectHandleChemContentRow.map(rows => rows.riskHazardNm);
            this.YAuiGrid.addCheckedRowsByValue('riskHazardNm', value);
          }

          // this.getSelectList();
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 사용자의 입력을 받는다.
     */
    closePopup(data) {
      if (data === 'CLOSE') {
        this.handleChemContentRow = this.oldHandleChemContentRow;
        this.$emit('closePopup', this.handleChemContentRow);
      } else {
        if (this.YAuiGrid.getCheckedRowItems().length > 0) {
          this.handleChemContentRow = this.YAuiGrid.getCheckedRowItems().map(rows => rows.item);

          this.$emit('closePopup', this.handleChemContentRow);
        } else {
          this.handleChemContentRow = [];
          window.getApp.$emit('ALERT', {
            title: 'L0000003321',
            // 하나 이상 선택하세요
            message: 'M0000000068',
            type: 'warning',
          });
          return;
        }
      }
    },
    /** button 관련 이벤트 **/
    btnSearchClickedCallback(_result) {
      this.getList();
      // window.getApp.$emit('APP_REQUEST_SUCCESS', '조회 버튼이 클릭되었습니다.');
    },
    /** end button 관련 이벤트 **/
  },
};
</script>

<style>
</style>
