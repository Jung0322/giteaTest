<!--
  목적 : 평가및안전보건비용 현황 팝업
  Detail : 평가및안전보건비용 현황 팝업
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
          <y-data-table
            :label="title"
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
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="title"
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
          plantCd: null,
          year: 0,
          monFlag: 0,
          searchFlag: 0,
        };
      },
    },
  },
  data() {
    return {
      editable: true,
      searchParam: {
        vendorEvalPlanNo: 0,
        apprFlag: '',
        procStepCd: '',
      },
      gridOptions: {
        name: 'statusPopup',
        btns: [],
        header: [],
        data: [],
        height: '500',
        merge: [],
      },
      YAuiGrid: null,
      searchUrl: '',
      title: '',
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
      // Url Setting
      this.searchUrl = selectConfig.vendor.assmnSfhlc.statusPopup.url;
      // title 설정
      this.setTitle();
      // 그리드 헤더 설정
      if (
        this.popupParam.searchFlag === 1 ||
        this.popupParam.searchFlag === 2 ||
        this.popupParam.searchFlag === 3 ||
        this.popupParam.searchFlag === 9
      ) {
        this.vendorHeaderSet();
      } else {
        this.resultmgmtHeader();
      }
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'), 
          btnClicked: 'closePopup'
        },
      ]
      this.getList();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
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
    vendorHeaderSet() {
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plant_nms', 
          width: '15%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001959'), 
          dataField: 'vendor_type_nm', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001961'), 
          dataField: 'vendor_att_nm', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000702'), 
          dataField: 'origin_nm_kr', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001958'), 
          dataField: 'vendor_nm', 
          width: '10%', 
          style: 'left-align'        
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001414'), 
          dataField: 'biz_num', 
          width: '7%',    
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002528'), 
          dataField: 'vendor_tel', 
          width: '7%',    
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000895'), 
          dataField: 'charger_nm', 
          width: '7%',    
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001280'), 
          dataField: 'vendor_addr', 
          width: '15%', 
          style: 'left-align'           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writer_user_nm', 
          width: '7%',    
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'writer_dt', 
          width: '10%',    
        },
      ];
    },
    resultmgmtHeader() {
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plant_nm', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'), 
          dataField: 'eval_title', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001957'), 
          dataField: 'vendor_nm', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002777'), 
          dataField: 'state_nm', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000428'), 
          dataField: 'step_nm', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003059'), 
          dataField: 'eval_cls_nm', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003062'), 
          dataField: 'eval_date', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005015'), 
          dataField: 'main_dept_nm', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005120'), 
          dataField: 'dept_nm', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005752'), 
          dataField: 'eval_sum_pnt', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005753'), 
          dataField: 'eval_all_pnt', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005151'), 
          dataField: 'cost_ref_yn', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005150'), 
          dataField: 'cost', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'update_user_nm', 
          width: '7%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'update_dt', 
          width: '7%',         
        },
      ];
    },
    setTitle() {
      let flag = this.popupParam.searchFlag;
      if (flag === 1) {
        this.title = '전월누적 협력업체(건수)';
      } else if (flag === 2) {
        this.title = '신규 협력업체(건수)';
      } else if (flag === 3 || flag === 9) {
        this.title = '전체 협력업체(건수)';
      } else if (flag === 4) {
        this.title = '평가대상 업체(건수)';
      } else if (flag === 5) {
        this.title = '평가완료 업체(건수)';
      } else if (flag === 6 || flag === 10) {
        this.title = '평가 실시율(%)';
      } else if (flag === 7) {
        this.title = '산업안전보건비 반영(건수)';
      } else if (flag === 8 || flag === 11) {
        this.title = '산업안전보건비 반영율(%)';
      }
    },
  },
};
</script>
