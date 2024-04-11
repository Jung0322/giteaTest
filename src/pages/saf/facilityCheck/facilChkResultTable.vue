<!--
  목적 : 설비점검 관리 - 설비점검결과  - 점검자
  Detail : 설비점검 점검자
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 등록 -->
    <b-row>
      <b-col sm="12">
        <!-- 점검팀원 테이블 -->
        <!-- <b-row>
          <b-col sm="12">
            <b-col sm="12" class="px-0">
              <div slot="buttonGroup" class="float-right mb-1">
                닫기 
                <y-btn
                  v-if="popupParam.popupMode"
                  title="L0000000881"
                  @btnClicked="closePopup"
                />
              </div>
              설비점검결과 목록
              <y-data-table
                ref="dataTable"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :editable="editable"
                :useRownum="false"
                label="L0000001609"
                :popMode="true"
                @tableLinkClicked="tableLinkClicked"
              ></y-data-table>
            </b-col>
          </b-col>
        </b-row> -->
        <!-- 설비점검결과 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000001609')"
          :useExcelExport="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @btnClicked="closePopup"
        />
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
  name: 'facil-chk-result-table',
  props: {
    popupParam: {
      type: Object,
      default: {
        popupMode: false,
        plantCd: '',
        year: '',
        month: '',
        gubun: '',
        safCheckTypeCd: '',
        safFacilityTypeCd: '',
        deptCd: '',
        planFlag: false,
      },
    },
  },
  data: () => ({
    searchParam: {
      plantCd: '',
      startDate: '',
      endDate: '',
      chkEndYn: '',
      deptCd: '',
      safCheckTypeCd: '', // 점검종류
      safFacilityTypeCd: '', // 설비유형코드
      chkStepCd: '', // 점검진행상태
    },
    gridOptions: {
      header: [],
      data: [],
      height: '250',
      btns: [],
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
    baseWidth: 8,
    editable: false,
    searchUrl: '',
    YAuiGrid: null,
  }),
  watch: {},
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
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.facilChkResult.rlist.url;

      this.searchParam.plantCd = this.popupParam.plantCd;

      let startDate = '';
      let endDate = '';
      if (this.popupParam.month) {
        startDate = this.$comm.moment([
          this.popupParam.year,
          this.$_.parseInt(this.popupParam.month) - 1,
        ]);
        endDate = this.$comm.moment(startDate).endOf('month');
      } else {
        startDate = this.$comm.moment([this.popupParam.year, 0]);
        endDate = this.$comm.moment([this.popupParam.year, 11]);
        endDate = this.$comm.moment(endDate).endOf('month');
      }
      this.searchParam.startDate = startDate.format('YYYY-MM-DD');
      this.searchParam.endDate = endDate.format('YYYY-MM-DD');
      if (this.popupParam.safCheckTypeCd) {
        this.searchParam.safCheckTypeCd = this.popupParam.safCheckTypeCd;
      }
      if (this.popupParam.deptCd) {
        this.searchParam.deptCd = this.popupParam.deptCd;
      }
      if (this.popupParam.safFacilityTypeCd) {
        this.searchParam.safFacilityTypeCd = this.popupParam.safFacilityTypeCd;
      }

      if (this.popupParam.gubun === 'CHS04') {
        this.searchParam.chkEndYn = 'Y';
        this.searchParam.chkStepCd = 'CHS04';
      } else if (this.popupParam.gubun === 'CHS02') {
        this.searchParam.chkStepCd = 'CHS02';
      } else {
        this.searchParam.chkEndYn = '';
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002551'),
          dataField: 'safFacilChkTitle',
          width: '200px',
          align: 'center',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 점검명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001579'),
          dataField: 'safFacilityTypeNm',
          width: '120px',
        }, // 설비유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'),
          dataField: 'processNm',
          width: '120px',
        }, // 공정
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001618'),
          dataField: 'safFacilityCd',
          width: '120px',
        }, // 설비코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001596'),
          dataField: 'facilityNm',
          width: '120px',
        }, // 설비명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000590'),
          dataField: 'facilityMgrNum',
          width: '120px',
        }, // 관리번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
          dataField: 'tDeptNm',
          width: '120px',
        }, // 관리부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002572'),
          dataField: 'userNm',
          width: '120px',
        }, // 점검자
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002564'),
          dataField: 'safFacilityCheckSchYmd',
          width: '120px',
        }, // 점검예정일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002040'),
          dataField: 'chkEndYnNm',
          width: '120px',
        }, // 완료여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002569'),
          dataField: 'chkYmd',
          width: '120px',
        }, // 점검완료일
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          color: 'orange',
          btnClicked: 'btnClicked',
          visible: this.popupParam.popupMode,
        }, // 닫기
      ];
      // 점검결과목록 조회
      this.getDataList();
    },
    /** 설비점검결과 목록 조회 **/
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(data) {
      console.log('11', data);
      this.popupOptions.target = () =>
        import(`${'./facilChkResultDetail.vue'}`);
      this.popupOptions.title = 'L0000001608';
      // 설비점검결과
      this.popupOptions.param = {
        safFacilChkNo: data.item.safFacilChkNo, // 설비점검번호
        safFacilityCd: data.item.safFacilityCd, // 설비 코드
        planFlag: this.popupParam.planFlag, // 계획/결과 구분 Flag
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup2;
    },
    closePopup2(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** button 관련 이벤트 **/
    closePopup() {
      this.$emit('closePopup', {});
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
