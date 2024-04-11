<!--
  목적 : 결제진행 상태 팝업
  Detail : 결제진행 상태 팝업
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             닫기 
            <y-btn title="L0000000881" @btnClicked="closePopup('CLOSE')" />
          </div>
           평가결과 관리 목록 
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :span-options="gridOptions.merge"
            :use-paging="true"
            label="L0000004993"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000004993')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @closePopup="closePopup('CLOSE')"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'appr-progress-popup',
  props: {
    popupParam: {
      type: Object,
      default() {
        return {
          monFlag: 'mon100',
          gubun: '',
          plantCd: '',
          assessYear: '',
          riskType: '',
          regRegdemCd: '',
        };
      },
    },
  },
  data() {
    return {
      searchParam: {
        monFlag: '',
        gubun: '',
        plantCd: '',
        assessYear: '',
        regRegdemCd: '',
        riskType: '',
      },
      gridOptions: {
        name: 'resultstatusPopup',
        btns: [],
        header: [],
        data: [],
        height: '500',
        merge: [],
      },
      YAuiGrid: null,
      searchUrl: '',
    };
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  updated() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  //* methods */
  methods: {
    init() {
      this.searchParam = this.popupParam;
      // Url Setting
      this.searchUrl = selectConfig.rsa.resultmgmt.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000927'),
          dataField: 'deptNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003416'),
          dataField: 'assessTypeNm',
          width: '8%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'),
          dataField: 'assessNm',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'regRegdemNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004449'),
          dataField: 'assessYear',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'),
          dataField: 'stateNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'createUserNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'createDt',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000264'),
          dataField: 'requestCnt',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003563'),
          dataField: 'incompletCnt',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004973'),
          dataField: 'overdueCnt',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002039'),
          dataField: 'completCnt',
          width: '7%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        }, // 닫기
      ];
      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
  },
};
</script>
