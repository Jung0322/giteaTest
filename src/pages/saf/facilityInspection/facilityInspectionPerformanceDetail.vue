<!--
  목적 : 안전 > 안전점검 > 안전점검실적 (사업장별 세부 tab)
  Detail : 안전점검실적 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions2" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam2.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 년도(점검일) -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000000830"
            name="year"
            :default="searchParam2.year"
            v-model="searchParam2.year"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 시설점검종류 -->
          <y-select
            :width="8"
            :comboItems="comboFacilityInsCheckItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001765"
            name="comFacilityCheckCd"
            v-model="searchParam2.comFacilityCheckCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 시설유형 -->
          <y-select
            :width="8"
            :comboItems="comboFacilityInsTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="comFacilityTypeCd"
            label="L0000001747"
            v-model="searchParam2.comFacilityTypeCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 점검주관부서 -->
          <y-tree-dept
            type="search"
            label="L0000002578"
            :plantCd="searchPlantCd"
            v-model="searchParam2.deptCd"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0 facilityInspectionResultSub">
          <div class="float-right mb-1">
             <y-btn
                :title="searchArea2.title"
                color="green"
                @btnClicked="btnSearchVisibleClicked2"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getList"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           사업장별 세부 시설점검실적 현황 
          <y-data-table
            ref="dataTable2"
            :height="gridOptions2.height"
            :headers="gridOptions2.header"
            :items="gridOptions2.data"
            :use-paging="false"
            :useRownum="false"
            :showSummary="true"
            @tableLinkClicked="tableLinkClicked2"
            label="L0000001427"
          ></y-data-table>
        </b-col>
      </b-col>
    </b-row> -->

    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="h100p">
          <!--   사업장별 세부 시설점검실적 현황   -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions2.name"
            :headers="gridOptions2.header"
            :btns="gridOptions2.btns"
            :height="gridOptions2.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001427')"
            :useExcelExport="false"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :enableSorting="true"
            :showSummary="true"
            @cellClick="cellClickHandler"
            @btnSearchClickedCallback="btnSearchClickedCallback"
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
  name: 'check-result-performance',
  props: {},
  data: () => ({
    searchParam2: {
      year: '', // 기간(점검일)
      plantCd: '',
      comFacilityCheckCd: '', // 시설점검종류
      comFacilityTypeCd: '', // 시설유형코드
      deptCd: '', // 주관부서코드
      // deptSubYn: 'Y', // 하위부서여부 사용
    },
    searchArea2: {
      title: '검색박스숨기기', // 검색박스숨기기
      show: true,
    },

    gridOptions2: {
      header: [],
      data: [],
      height: '500',
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
    comboFacilityInsCheckItems: [], // 점검종류
    comboFacilityInsTypeItems: [], // 시설유형
    editable: false,
    searchUrl2: '',
    YAuiGrid: null,
  }),
  watch: {},
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
      // Url Setting
      this.searchUrl2 =
        selectConfig.saf.facilityInspection.facilityInspectionResult.status2.url;
      // this.searchParam2.deptSubYn = 'Y';

      let today = this.$comm.getToday();
      this.searchParam2.year = today.substring(0, 4);

      this.getComboItems('SAF_FACILITY_CHECK'); // 시설점검종류
      this.getComboFacilityTypeItems(); // 시설유형
      // /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      // var searchParamByCookie = this.$comm.setSearchParamByCookie();
      // if (typeof searchParamByCookie !== 'undefined') {
      //   this.searchParam = searchParamByCookie;
      // }

      // /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      // var searchParamByCookie2 = this.$comm.setSearchParamByCookie();
      // if (typeof searchParamByCookie2 !== 'undefined') {
      //   this.searchParam2 = searchParamByCookie2;
      // }

      this.getList();
    },
    setGridHeader() {
      // 그리드 헤더 설정
      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plant_nm',
          width: '150px',
          align: 'center',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001765'),
          dataField: 'com_facility_check_cd',
          width: '150px',
          align: 'center',
        }, // 시설점검종류
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001747'),
          dataField: 'com_facility_type_nm',
          width: '150px',
          align: 'center',
        }, // 시설유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002578'),
          dataField: 'dept_nm',
          width: '150px',
          align: 'center',
        }, // 점검주관부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003181'),
          dataField: 'sum_plan',
          wdith: '90px',
          align: 'center',
          fixed: 'right',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 합계 계획
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003182'),
          dataField: 'sum_result',
          wdith: '90px',
          align: 'center',
          fixed: 'right',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 합계 실적
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002874'),
          dataField: 'sum',
          wdith: '90px',
          align: 'center',
          fixed: 'right',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 총합
      ];
      for (let i = 1; i < 13; i++) {
        let month = i < 10 ? '0' + i : i.toString();
        this.gridOptions2.header.splice(i + 3, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003663', {
            s1: i,
          }), // {s1}월
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000466'),
              dataField: month + '_plan',
              wdith: '90px',
              align: 'center',
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            }, // 계획
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001810'),
              dataField: month + '_result',
              wdith: '90px',
              align: 'center',
              renderer: {
                type: 'LinkRenderer',
                baseUrl: 'javascript',
                jsCallback: function (rowIndex, columnIndex, value, item) {},
              },
            }, // 실적
          ],
        });
      }

      this.gridOptions2.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        }, //  검색
      ];
    },

    /**
     * 공통 마스터 정보 조회 (시설점검종류)
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
          if (codeGroupCd === 'SAF_FACILITY_CHECK') {
            this.comboFacilityInsCheckItems = this.$_.clone(_result.data);
            this.comboFacilityInsCheckItems.splice(0, 0, {
              code: '',
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            });
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 시설유형 조회
     */
    getComboFacilityTypeItems() {
      this.$http.url =
        selectConfig.saf.facilityInspection.facilityType.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.comboFacilityInsTypeItems = this.$_.clone(_result.data);
          this.comboFacilityInsTypeItems.splice(0, 0, {
            code: '',
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /** button 관련 이벤트 **/

    btnSearchVisibleClicked2() {
      this.searchArea2.show = !this.searchArea2.show;
      // if (this.searchArea2.show) this.searchArea2.title = '검색박스숨기기';
      // else this.searchArea.title = '검색박스보이기';

      window.getApp.$emit('LOADING_PASS_COUNT', 1);
    },
    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnSearchClickedCallback() {
      this.getList();
    },

    cellClickHandler(data) {
      let gubun = '';
      if (data.dataField.split('_')[1] === 'result') {
        gubun = 'CHS04';
      }
      this.popupOptions.target = () =>
        import(`${'./facilityInspectionResult.vue'}`);
      this.popupOptions.title = 'L0000001753'; // 시설점검
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.param = {
        popupMode: true,
        plantCd: data.item.plantCd,
        year: this.searchParam2.year,
        gubun: gubun,
        month:
          data.dataField !== 'sum' &&
          data.dataField !== 'sum_plan' &&
          data.dataField !== 'sum_result'
            ? data.dataField.substring(0, 2)
            : '',
        comFacilityCheckCd: data.item.com_facility_check_cd,
        comFacilityTypeCd: data.item.com_facility_type_cd,
        deptCd: data.item.dept_cd,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    getList(data) {
      this.$http.url = this.searchUrl2;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam2;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam2);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 하위부서 포함 조회 관련 함수 추가
    // setDeptSubYn(_result) {
    //   // 하위부서 tree에서 값이 변경될 경우 현재값 변경
    //   this.searchParam2.deptSubYn = _result;
    // },
    /** end button 관련 이벤트 **/
  },
};
</script>

<style>
.facilityInspectionResultSub .el-table__body-wrapper {
  height: 382.22px !important;
}
</style>
