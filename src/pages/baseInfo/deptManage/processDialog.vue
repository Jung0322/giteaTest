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
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 사업장 -->
          <!-- '사업장 존재 X'를 사용하기위해 y-plant를 사용하지 않음 -->
          <y-select
            :width="8"
            :comboItems="plantlItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001415"
            name="plantCd"
            v-model="searchParam.plantCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-dept
            type="search"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 공정 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000515"
            name="processNm"
            v-model="searchParam.processNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1"> -->
    <!-- 선택 or 추가 -->
    <!-- <y-btn
              :title="popupParam.isSelectMode ? 'L0000001561' : 'L0000002892'"
              color="orange"
              @btnClicked="closePopup('SAVE')"
            /> -->
    <!-- 검색 -->
    <!-- <y-btn title="L0000000327" color="green" @btnClicked="getList" /> -->
    <!-- 닫기 -->
    <!-- <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
          </div> -->
    <!-- 공정 목록 -->
    <!-- <y-data-table
            ref="requestDatatable"
            checkKey="processCd"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :height="gridOptions.height"
            :checkItemData="checkItemData"
            label="L0000000516"
            v-model="handleProcessRow"
          >
            <el-table-column type="selection" slot="selection" align="center" width="55"></el-table-column>
          </y-data-table>
        </b-col>
      </b-col>
    </b-row> -->

    <!-- 검색 결과 테이블 -->
    <b-row>
      <b-col sm="12" class="mt-3">
        <b-col sm="12" class="px-0">
          <b-row class="grid-height grid-box">
            <b-col sm="12" class="h100p">
              <!-- 공정 목록 -->
              <y-auigrid
                ref="yAuiGrid"
                :name="gridOptions.name"
                :headers="gridOptions.header"
                :btns="gridOptions.btns"
                :height="gridOptions.height"
                :label="this.$comm.getLangSpecInfoLabel('L0000000516')"
                :useExcelExport="false"
                :useContextMenu="true"
                :enableRightDownFocus="true"
                :showGridCtrl="true"
                :enableSorting="true"
                :showRowCheckColumn="true"
                @closeSavePopup="closeSavePopup"
                @getList="getList"
                @closePopup="closePopup"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'hazard-dialog',
  props: {
    popupParam: {
      type: Object,
      default: {
        deptCd: '',
        selectProcess: [],
        isSelectMode: false,
      },
    },
  },
  data() {
    return {
      searchParam: {
        plantCd: '',
        deptCd: '',
        processNm: '',
        useYn: 'Y',
      },
      gridOptions: {
        header: [],
        data: [],
        height: 'auto',
      },
      checkItemData: [],
      oldHandleProcessRow: [],
      handleProcessRow: [],
      plantlItems: [],
      searchUrl: '',
      YAuiGrid: null,
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
    this.mountedInit();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      // Url Setting
      this.searchUrl = selectConfig.manage.process.list.url;

      this.searchParam.plantCd = this.$store.getters.plantCd;

      this.oldHandleProcessRow = this.popupParam.selectProcess;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNms',
          width: '150px',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNms',
          width: '150px',
        }, // 부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002367'),
          dataField: 'processNm',
          width: '200px',
        }, // 작업공정명
      ];
      this.getComboItems('COM_PLANT_CD');
      this.getList();
    },
    mountedInit() {
      this.gridOptions.btn = [
        {
          title: this.popupParam.isSelectMode
            ? this.$comm.getLangSpecInfoLabel('L0000001561')
            : this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'closeSavePopup',
        }, // 선택 or 추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        }, // 검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        }, // 닫기
      ];
      this.YAuiGrid.setBtnArr(this.gridOptions.btn);
    },
    // combo box list
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.checkItemData = this.popupParam.selectProcess;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 유해인자 분류
    getComboItems(comCode) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        comCode
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          if (comCode === 'COM_PLANT_CD') {
            _result.data = this.$_.reject(_result.data, { code: '0000' });
            if (
              this.$store.getters.deptAuthGrp &&
              this.$store.getters.deptAuthGrp.plantAccessYn === 'Y'
            ) {
              this.plantlItems = this.$_.clone(_result.data);
              this.plantlItems.splice(0, 0, {
                code: '-1000',
                codeNm: this.$comm.getLangSpecInfoLabel('L0000004369'), // 사업장 존재 X
              });
            } else {
              this.plantlItems = this.$_.filter(this.$_.clone(_result.data), {
                code: this.$store.getters.plantCd,
              });
              this.plantlItems.splice(0, 0, {
                code: '-1000',
                codeNm: this.$comm.getLangSpecInfoLabel('L0000004369'), // 사업장 존재 X
              });
            }
            // this.plantlItems = this.$_.clone(_result.data);
            this.plantlItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
            }); // 전체
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 사용자의 입력을 받는다.
     */
    closePopup(data) {
      data = 'CLOSE';
      this.$emit('closePopup', data);
    },
    closeSavePopup(data) {
      let gridData = this.YAuiGrid.getGridData();
      const selectedRows = this.YAuiGrid.getCheckedRowItems().map(
        (rows) => rows.item
      );
      if (selectedRows.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000643',
          // 공정을 선택하세요.
          type: 'warning',
        });
        return false;
      } else {
        this.$emit('closePopup', { process: selectedRows });
      }
    },
    /** button 관련 이벤트 **/
    btnSearchClickedCallback(_result) {
      this.getList();
    },
  },
};
</script>

<style></style>
