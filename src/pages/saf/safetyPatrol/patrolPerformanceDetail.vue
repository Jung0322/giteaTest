<!--
  목적 : 안전 > 순회 > 순회실적
  Detail : 순회실적 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions2" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            name="plantCd"
            v-model="searchParam2.plantCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 점검년도 -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000002548"
            name="year"
            :default="searchParam2.year"
            v-model="searchParam2.year"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 순회주관부서 -->
          <y-tree-dept
            type="search"
            label="L0000001721"
            name="deptCd"
            :showAllDept="true"
            :plantCd="searchPlantCd"
            v-model="searchParam2.deptCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 순회결과 -->
          <y-select
            :width="8"
            :comboItems="patrolResultCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="checkResultCd"
            label="L0000001710"
            v-model="searchParam2.checkResultCd"
          ></y-select>
        </b-col>
        <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
          <b-row>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 순회대상 부서 -->
              <y-tree-dept
                type="search"
                name="tgtDeptCd"
                label="L0000004279"
                :showAllDept="false"
                :plantCd="searchPlantCd"
                v-model="searchParam2.tgtDeptCd"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
              <!-- 순회대상 협력업체 -->
              <y-text
                :width="8"
                :readonly="true"
                ui="bootstrap"
                label="L0000004280"
                name="tgtVendorNm"
                v-model="searchParam2.tgtVendorNm"
                :appendIcon="[{ icon: 'search', callbackName: 'searchVendor' }]"
                @searchVendor="searchVendor"
              ></y-text>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </y-search-box>
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0 patrolsub">
          <!-- <div class="float-right mb-1"> -->
          <!-- 검색 -->
          <!-- <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getList"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div> -->
          <!-- 사업장별 세부 순회실적 현황 -->
          <!-- <y-data-table
            ref="dataTable2"
            :height="gridOptions2.height"
            :headers="gridOptions2.header"
            :items="gridOptions2.data"
            :span-options="gridOptions2.merge"
            :useRownum="false"
            :rowClassName="myRowClassName"
            label="L0000001426"
            @tableLinkClicked="tableLinkClicked2"
          ></y-data-table> -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions2.name"
            :headers="gridOptions2.header"
            :btns="gridOptions2.btns"
            :height="gridOptions2.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001426')"
            :items="gridOptions2.data"
            :span-options="gridOptions2.merge"
            :useRownum="false"
            :rowClassName="myRowClassName"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableCellMerge="true"
            :cellMergeRowSpan="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            @cellClick="cellClickHandler"
            :routeName="routeName"
            @selectedRow="selectedRow"
            @getList="getList"
            @btnClickedError="btnClickedErrorCallback"
          />
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'patrol-performance',
  props: {},
  data: () => ({
    searchParam2: {
      year: '', // 점검년도
      plantCd: '',
      deptCd: '',
      tgtClsCd: '',
      tgtDeptCd: '',
      tgtVendorCd: '',
      tgtVendorNm: '',
      checkResultCd: '',
      deptSubYn: 'Y', // 하위부서여부 사용
      tgtDeptSubYn: 'Y', // 하위부서여부 사용
    },
    searchArea2: {
      title: '검색박스숨기기', // 검색박스숨기기
      show: true,
    },
    gridOptions2: {
      header: [],
      data: [],
      height: '500',
      merge: [],
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: null,
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    searchPlantCd: '',
    searchYear: '',
    targetItems: [],
    patrolResultCdItems: [],
    editable: false,
    searchUrl: '',
    searchUrl2: '',
    routeName: '',
    YAuiGrid: null,
  }),
  watch: {
    // 'searchParam.plantCd'() {
    //   this.searchPlantCd = this.searchParam2.plantCd;
    // },
    // 'searchParam.tgtClsCd'() {
    //   // 순회대상이 다시 설정이 되면 값을 초기화 해준다.
    //   this.searchParam2.tgtDeptCd = '';
    //   this.searchParam2.tgtVendorNm = '';
    //   this.searchParam2.tgtVendorCd = '';
    // },
    'searchParam.year': function (newValue, oldValue) {
      if (!this.searchParam2.year) {
        let today = this.$comm.getToday();
        this.searchParam2.year = today.substring(0, 4);
      }
      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'), // 주관부서
          dataField: 'dept_nm',
          width: '150px',
          style: 'center-align',
          // fixed: 'left',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001714'), // 순회대상
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), // 구분
              dataField: 'gubun',
              width: '120px',
              style: 'center-align',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000925'), // 대상명
              dataField: 'name',
              width: '200px',
              style: 'center-align',
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001710'), // 순회결과
          dataField: 'check_result_nm',
          width: '150px',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003180'), // 합계
          dataField: 'sum',
          width: '90px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
      ];

      for (let i = 1; i <= 12; i++) {
        let month = i < 10 ? '0' + i : i.toString();
        this.gridOptions2.header.splice(i + 2, 0, {
          headerText: i + this.$comm.getLangSpecInfoLabel('L0000002108'), // 월
          dataField: month,
          width: '90px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        });
      }
      this.getList();
    },
    'searchParam2.tgtVendorNm'() {
      if (
        this.searchParam2.tgtVendorNm === '' ||
        this.searchParam2.tgtVendorNm === null
      ) {
        this.searchParam2.tgtVendorCd = '';
      }
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl2 = selectConfig.saf.patrol.status2.url;

      this.searchParam2.deptSubYn = 'Y';
      this.searchParam2.tgtDeptSubYn = 'Y';

      this.routeName = this.$route.name;
      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'), // 주관부서
          dataField: 'dept_nm',
          width: '150px',
          style: 'center-align',
          cellMerge: true,
          // fixed: 'left',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001714'), // 순회대상
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), // 구분
              dataField: 'gubun',
              width: '120px',
              style: 'center-align',
              cellMerge: true,
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000925'), // 대상명
              dataField: 'name',
              width: '200px',
              style: 'center-align',
              cellMerge: true,
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001710'), // 순회결과
          dataField: 'check_result_nm',
          width: '150px',
          style: 'center-align',
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003180'), // 합계
          dataField: 'sum',
          width: '90px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
      ];
      this.gridOptions2.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
          visible: this.editable,
        }, //  검색
      ];

      let today = this.$comm.getToday();
      this.searchParam2.year = today.substring(0, 4);

      for (let i = 1; i <= 12; i++) {
        let month = i < 10 ? '0' + i : i.toString();
        this.gridOptions2.header.splice(i + 2, 0, {
          headerText: i + this.$comm.getLangSpecInfoLabel('L0000002108'), // 월
          dataField: month,
          width: '90px',
          style: 'center-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        });
      }

      this.gridOptions2.merge = [];
      this.gridOptions2.merge.push(
        { index: 0, field: 'dept_nm' },
        { index: 1, field: 'dept_nm_gubun' },
        { index: 2, field: 'dept_gubun_name' }
        // { index: 3, field: 'dept_gubun' }
      );

      this.getComboItems('SAF_ACTPART_CLS'); // 순회대상
      this.getComboItems('SAF_PATROL_RSLT_CLS'); // 순회결과

      this.getList(); // 순회 현황 조회
    },
    // combo box list
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            code: '',
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }); // 전체
          if (codeGroupCd === 'SAF_ACTPART_CLS') {
            this.targetItems = this.$_.clone(_result.data);
          } else if (codeGroupCd === 'SAF_PATROL_RSLT_CLS') {
            this.patrolResultCdItems = this.$_.clone(_result.data);
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 사고 현황 검색 **/
    // getList() {
    //   this.$http.url = this.searchUrl;
    //   this.$http.type = 'GET';
    //   this.$http.param = this.searchParam;
    //   this.$http.request(
    //     (_result) => {
    //       this.searchYear = this.$_.clone(this.searchParam.year);
    //       this.gridOptions.data = this.$_.clone(_result.data);
    //       //   this.$refs.dataTable.setCurrentRow(this.gridOptions.data[0]);
    //       this.selectedRow(this.gridOptions.data[0]);
    //     },
    //     (_error) => {
    //       window.getApp.$emit('APP_REQUEST_ERROR', _error);
    //     }
    //   );
    // },
    selectedRow(data) {
      if (data) {
        this.searchPlantCd = data.plant_cd;
      } else {
        if (!this.searchPlantCd) {
          // 검색 조건이 전체인 경우는 그냥 빈값 그대로 넘기게 설정
          this.searchPlantCd = this.$_.clone(this.searchParam.plantCd);
        }
      }
    },

    /** button 관련 이벤트 **/

    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    searchVendor() {
      this.popupOptions.target = () =>
        import(`${'../../vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003246'; // 협력업체
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        vendorTypeCd: 'CVET1', // 공사업체
        plantCd: this.searchPlantCd,
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        this.searchParam2.tgtVendorCd = data.data.vendorCd;
        this.searchParam2.tgtVendorNm = data.data.vendorNm;
      }
    },
    getList(data) {
      this.$http.url = this.searchUrl2;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam2;
      this.$http.request(
        (_result) => {
          this.gridOptions2.data = this.$_.clone(_result.data);
          this.YAuiGrid2 = this.gridOptions2.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(header, row) {
      this.popupOptions.target = () => import(`${'./patrolResult.vue'}`);
      this.popupOptions.title = 'L0000001709'; // 순회
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      let tgtClsCd = '';

      if (
        header.item.gubun === this.$comm.getLangSpecInfoLabel('L0000004288')
      ) {
        // 구분합계
        tgtClsCd = '';
      } else if (
        header.item.gubun === this.$comm.getLangSpecInfoLabel('L0000001287')
      ) {
        // 부서
        tgtClsCd = 'ACTDP';
      } else {
        tgtClsCd = 'ACTSC';
      }
      this.popupOptions.param = {
        popupMode: true,
        plantCd: this.searchPlantCd,
        year: this.searchParam2.year,
        month:
          header.item['dataField'] !== 'sum' ? header.item['dataField'] : '',
        deptCd: header.item.dept_cd,
        tgtClsCd: tgtClsCd,
        tgtDeptCd:
          header.item.gubun ===
            this.$comm.getLangSpecInfoLabel('L0000001287') ||
          header.item.gubun === this.$comm.getLangSpecInfoLabel('L0000004288')
            ? header.item.code
            : '', // 부서 / 구분합계
        tgtVendorCd:
          header.item.gubun ===
            this.$comm.getLangSpecInfoLabel('L0000001287') ||
          header.item.gubun === this.$comm.getLangSpecInfoLabel('L0000004288')
            ? ''
            : header.item.code, // 부서 / 구분합계
        tgtVendorNm:
          header.item.gubun ===
            this.$comm.getLangSpecInfoLabel('L0000001287') ||
          header.item.gubun === this.$comm.getLangSpecInfoLabel('L0000004288')
            ? ''
            : header.item.name, // 부서 / 구분합계
        checkResultCd: header.item.check_result_cd,
        checkStepCd: 'CHS04',
      };

      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkClicked2(header, row) {
      this.popupOptions.target = () => import(`${'./patrolResult.vue'}`);
      this.popupOptions.title = 'L0000001709'; // 순회
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      let tgtClsCd = '';

      if (row.gubun === this.$comm.getLangSpecInfoLabel('L0000004288')) {
        // 구분합계
        tgtClsCd = '';
      } else if (row.gubun === this.$comm.getLangSpecInfoLabel('L0000001287')) {
        // 부서
        tgtClsCd = 'ACTDP';
      } else {
        tgtClsCd = 'ACTSC';
      }

      this.popupOptions.param = {
        popupMode: true,
        plantCd: this.searchPlantCd,
        year: this.searchParam2.year,
        month: header['name'] !== 'sum' ? header['name'] : '',
        deptCd: row.dept_cd,
        tgtClsCd: tgtClsCd,
        tgtDeptCd:
          row.gubun === this.$comm.getLangSpecInfoLabel('L0000001287') ||
          row.gubun === this.$comm.getLangSpecInfoLabel('L0000004288')
            ? row.code
            : '', // 부서 / 구분합계
        tgtVendorCd:
          row.gubun === this.$comm.getLangSpecInfoLabel('L0000001287') ||
          row.gubun === this.$comm.getLangSpecInfoLabel('L0000004288')
            ? ''
            : row.code, // 부서 / 구분합계
        tgtVendorNm:
          row.gubun === this.$comm.getLangSpecInfoLabel('L0000001287') ||
          row.gubun === this.$comm.getLangSpecInfoLabel('L0000004288')
            ? ''
            : row.name, // 부서 / 구분합계
        checkResultCd: row.check_result_cd,
        checkStepCd: 'CHS04',
      };

      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    myRowClassName({ row, rowIndex }) {
      var resultClassName = '';
      if (row.check_result_nm === 'L0000004289') {
        // 순회결과합계
        resultClassName = 'result-row';
      }
      if (row.name === 'L0000004287') {
        // 순회대상합계
        resultClassName = 'target-row';
      }
      if (row.gubun === 'L0000004288') {
        // 구분합계
        resultClassName = 'gubun-row';
      }
      if (row.dept_nm === 'L0000004290') {
        // 주관부서합계
        resultClassName = 'dept-row';
      }
      return resultClassName;
    },
    // // 하위부서 포함 조회 관련 함수 추가
    // setDeptSubYn(_result) {
    //   // 하위부서 tree에서 값이 변경될 경우 현재값 변경
    //   this.searchParam2.deptSubYn = _result;
    // },
    // // 하위부서 포함 조회 관련 함수 추가
    // setTgtDeptSubYn(_result) {
    //   // 하위부서 tree에서 값이 변경될 경우 현재값 변경
    //   this.searchParam2.tgtDeptSubYn = _result;
    // },
    /** end button 관련 이벤트 **/
  },
};
</script>

<style>
.result-row {
  background-color: #ffffb0 !important;
}
.target-row {
  background-color: #f2f5a9 !important;
}
.gubun-row {
  background-color: #d2e5a8 !important;
}
.dept-row {
  background-color: #fff29e !important;
}
.patrol .el-table__body-wrapper {
  height: 227.77px !important;
}
/* .patrolsub .el-table__body-wrapper {
  height: 382.22px !important;
} */
</style>
