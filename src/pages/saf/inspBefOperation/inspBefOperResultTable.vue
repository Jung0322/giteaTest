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
               가동전점검결과 목록 
              <y-data-table
                ref="dataTable"
                :height="gridOptions.height"
                :headers="gridOptions.header"
                :items="gridOptions.data"
                :editable="editable"
                :useRownum="false"
                label="L0000003989"
                :popMode="true"
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
              :label="this.$comm.getLangSpecInfoLabel('L0000003989')"
              :useExcelExport="false"
              :enableCellMerge="true"
              :enableSorting="true"
              :showGridSetSave="true"
              :useContextMenu="true"
              :enableRightDownFocus="true"
              :showGridCtrl="true"
              @closePopup="closePopup"
              @cellClick="cellClickHandler"
            />
          </b-col>
        </b-row>
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
        completeYn: 'N',
        dtlYn: 'N',
        safFacilityTypeCd: '',
        deptCd: '',
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
      safCheckTypeCd: '', // 점검유형
      safFacilityTypeCd: '', // 설비유형코드
      completeYn: 'N',
      dtlYn: 'N',
    },
    gridOptions: {
      name: 'inspBefOperResultTable',
      btns: [],
      header: [],
      data: [],
      height: '250',
    },
    YAuiGrid: null,
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
      this.searchUrl = selectConfig.saf.befInspResult.rlist.url;

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

      this.searchParam.completeYn = this.popupParam.completeYn;
      this.searchParam.dtlYn = this.popupParam.dtlYn;

      if (this.searchParam.dtlYn === 'Y') {
        // 그리드 헤더 설정
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002551'),
            dataField: 'safFacilChkTitle',
            width: '20%',
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {},
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001597'),
            dataField: 'safFacilityTypeNm',
            width: '15%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001596'),
            dataField: 'facilityNm',
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
            dataField: 'deptNm',
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002572'),
            dataField: 'chkUserNm',
            width: '15%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002570'),
            dataField: 'safFacilityCheckYmd',
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002040'),
            dataField: 'chkStepNm',
            width: '10%',
          },
        ];
      } else {
        // 그리드 헤더 설정
        this.gridOptions.header = [
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002551'),
            dataField: 'safFacilChkTitle',
            width: '20%',
            renderer: {
              type: 'LinkRenderer',
              baseUrl: 'javascript',
              jsCallback: function (rowIndex, columnIndex, value, item) {},
            },
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001618'),
            dataField: 'safCheckTypeNm',
            width: '15%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000001596'),
            dataField: 'facilityNm',
            width: '15%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000591'),
            dataField: 'deptNm',
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002572'),
            dataField: 'chkUserNm',
            width: '10%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002570'),
            dataField: 'safFacilityCheckYmd',
            width: '15%',
          },
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000002040'),
            dataField: 'chkStepNm',
            width: '10%',
          },
        ];
      }
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        },
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
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      this.popupOptions.target = () =>
        import(`${'./inspBefOperResultDetail.vue'}`);
      this.popupOptions.title = 'L0000003988';
      // 가동전점검결과
      this.popupOptions.param = {
        popupMode: this.popupParam.popupMode,
        safFacilChkNo: event.item.safFacilChkNo, // 설비점검번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup2;
    },
    closePopup2(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    /** button 관련 이벤트 **/
    closePopup(data) {
      this.$emit('closePopup', {});
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
