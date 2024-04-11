<!--
  목적 : SHE경영 관리>법정선임자 관리>법정선임자 평가 관리>평가계획 관리>평가계획 상세>대상자 탭
  Detail : 평가계획 상세 팝업 대상자 탭의 대상자추가 팝업 화면
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
               선택 
              <y-btn title="L0000001561" color="orange" @btnClicked="btnSelect" />
               닫기 
              <y-btn title="L0000000881" @btnClicked="closePopup" />
            </div>
             선해임 목록 
            <y-data-table
              ref="dataTable"
              :height="gridOptions.height"
              :headers="gridOptions.header"
              :items="gridOptions.data"
              :use-paging="true"
              label="L0000001563"
              v-model="gridOptions.selectedValue"
              @selectedRow="selectedRow"
              @rowDoubleClicked="rowDoubleClicked"
            >
              <el-table-column
                type="selection"
                slot="selection"
                align="center"
                width="55"
              ></el-table-column>
            </y-data-table>
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
            :label="this.$comm.getLangSpecInfoLabel('L0000001563')"
            :useExcelExport="false"
            :enableSorting="true"
            :showGridSetSave="true"
            :useContextMenu="true"
            :showRowCheckColumn="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"   
            :softRemoveRowMode="false"
            @btnSelect="btnSelect"
            @closePopup="closePopup"
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
  name: 'elect-his-by-eval-target-pop',
  props: {
    popupParam: {
      default: {
        safElectTitlNo: null, // 법정선임자 번호
        plantCd: null,
      },
    },
  },
  data: () => ({
    searchParam: {
      safElectTitlNo: null, // 선해임명번호
    },
    gridOptions: {
      name: 'electHisEvalTargetPop',
      btns: [],
      header: [],
      data: [],
      height: '350px',
      selectedValue: null,
    },
    YAuiGrid: null,
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '80%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
  }),
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
  
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001346'), 
          dataField: 'electAttNm', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001565'), 
          dataField: 'electTitlNm', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'), 
          dataField: 'deptNm', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001559'), 
          dataField: 'meUserNm', 
          width: '20%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001558'), 
          dataField: 'electDt', 
          width: '20%', 
        },
      ];
  
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnSelect',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
        },
      ]
  
      if (this.popupParam.safElectTitlNo) {
        this.searchParam.safElectTitlNo = this.popupParam.safElectTitlNo;
        this.searchParam.plantCd = this.popupParam.plantCd;
      }
  
      this.getList();
    },
    getList() {
      this.$http.url = selectConfig.mgt.electEvalMgmt.electHis.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data))          
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    closePopup(data) {
      this.$emit('closePopup', data);
    },
    // selectedRow(data) {
    //   console.log(data)
    // },
    // rowDoubleClicked(data) {
    //   this.gridOptions.selectedValue = [];
    //   this.gridOptions.selectedValue.push(data);
    //   this.closePopup(this.gridOptions.selectedValue);
    // },
    btnSelect() {
      if (this.YAuiGrid.getCheckedRowItems() === null) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'L0000005322' /* 구분을 입력해주세요.  */,
          type: 'warning',
        });
  
        return;
      }
      this.closePopup(this.YAuiGrid.getCheckedRowItems());
    },
    /** button 관련 이벤트 **/
    /** end button 관련 이벤트 **/
  },
};
</script>
  