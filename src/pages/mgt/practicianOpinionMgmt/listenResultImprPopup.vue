<!--
  목적 : 개선사항 상태 목록
  Detail : 개선사항 상태 목록
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
           개선요청사항 목록 
          <y-data-table
            label="L0000000270"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
          />
        </b-col>
      </b-col>
    </b-row> -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :editable="editable"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000270')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"        
          @closePopup="closePopup"  
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
          plantCd: '',
          imprClassCd: '',
          apprFlag: '',
          refTableId: 0,
        };
      },
    },
  },
  data() {
    return {
      editable: true,
      searchParam: {
        plantCd: '',
        imprClassCd: '',
        apprFlag: '',
        refTableId: 0,
        popupMode: 'Y',
        dashMode: false,
      },
      gridOptions: {
        name: 'listenResultImprPopup',
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
      this.editable = this.$route.meta.editable;
      this.searchParam = this.popupParam;
      this.searchParam.plantCd = '';
      // Url Setting
      this.searchUrl = selectConfig.saf.imprAct.list.url;

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002668'), 
          dataField: 'actClassNm', 
          width: '6%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '6%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005032'), 
          dataField: 'imprTitle', 
          width: '12%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000267'), 
          dataField: 'imprRqstContents', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002666'), 
          dataField: 'actResultContents', 
          width: '15%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005033'), 
          dataField: 'imprStepNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002673'), 
          dataField: 'actDeptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002670'), 
          dataField: 'actLimitYmd', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002685'), 
          dataField: 'actConfirmYmd', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002040'), 
          dataField: 'completYn', 
          width: '10%', 
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        },
      ]
      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.$_.filter(_result.data, {
            actClassCd: 'ACL01',
          });
          // 개선요청사항 목록
          this.$_.filter(_result.data, {
            actClassCd: 'ACL02',
          });
          // 개선요청사항 목록
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        _error => {
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
