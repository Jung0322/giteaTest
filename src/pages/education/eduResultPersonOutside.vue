<!--
  목적 : 교육결과 등록 팝업 > 교육이수자(외부) 탭
  작성자 : kkc
  Detail : 교육결과 등록 팝업 > 교육이수자(외부) 탭
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             추가 
            <y-btn
              v-if="editable && !viewMode && !search"
              title="L0000002892"
              color="orange"
              @btnClicked="btnAddClicked"
            />
             삭제 
            <y-btn
              v-if="editable && !viewMode && !search"
              title="L0000001495"
              color="red"
              @btnClicked="btnDeleteClicked"
            />
          </div>
          - 교육이수자(외부) 
          <y-data-table
            label="L0000000669"
            :print="true"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="!authDuringAppr && !viewMode && !search"
            v-model="gridOptions.selectedValue"
          >
            <el-table-column
              v-if="editable && !viewMode && !search"
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
          :editable="true"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000669')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :showRowCheckColumn="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @btnAddClicked="btnAddClicked"
          @btnDeleteClicked="btnDeleteClicked"
          @cellEditEnd="cellEditEndHandler"
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
  name: 'edu-plan-exam',
  props: {
    authDuringAppr: false,
    search: false,
    viewMode: false,
    eduMaster: {
      safEduMstNo: 0,
      eduAttCd: null,
      safEduCourseNo: null,
      eduTypeCd: null,
      deptCd: null,
      eduNm: '',
      duration: [],
      eduTime: 0,
      eduSYmd: '',
      eduEYmd: '',
      eduPlace: '',
      eduTeacher: '',
      eduContent: '',
      processStepCd: '',
      eduResultSummary: '',
      eduEvalOpin: '',
      personList: [],
      eduOutSideUsers: [],
    },
    parentEditable: null,
  },
  data: () => ({
    gridOptions: {
      name: 'eduResultPersonOutside',
      btns: [],
      header: [],
      data: [],
      height: '300',
      selectedValue: [],
    },
    YAuiGrid: null,
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      width: '80%',
      top: '10px',
      param: {},
      closeCallback: null,
    },
    editable: false,
    sexItems: [],
  }),
  watch: {
    gridOptions: {
      handler: function (newValue, oldValue) {
        this.eduMaster.eduOutSideUsers = this.gridOptions.data;
      },
      deep: true,
    },
    parentEditable: {
      handler: function (newValue, oldValue) {
        if (this.editable) {
          this.editable = this.parentEditable;
        }
      },
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  update() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      if (this.editable) {
        this.editable = this.parentEditable;
      }
      this.sexItems = [
        { code: 'M', codeNm: this.$comm.getLangSpecInfoLabel('L0000005539') }, // 남
        { code: 'F', codeNm: this.$comm.getLangSpecInfoLabel('L0000005540') }, // 여
      ];

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001957'), 
          dataField: 'vendorNm', 
          width: '20%', 
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'), 
          dataField: 'workerNm', 
          width: '30%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001545'), 
          dataField: 'birthYmd', 
          width: '30%', 
          editRenderer: { 
            type: 'CalendarRenderer', 
            onlyCalendar: true,
            defaultFormat: 'yyyy-mm-dd', 
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001632'), 
          dataField: 'genderCd', 
          width: '20%', 
          renderer: {
            type: "DropDownListRenderer",
            listFunction: (rowIndex, columnIndex, item, dataField) => {
              return this.sexItems;
            },
            keyField: "code", // key 에 해당되는 필드명
            valueField: "codeNm", // value 에 해당되는 필드명
            // disabledFunction: () => {
            //   return this.checkDisabled;
            // },
          }
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnAddClicked',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDeleteClicked',
          visible: true,
        },
      ]
      this.searchUrl =
        selectConfig.saf.education.eduDetailPerson.getOutsides.url;

      this.getList();
    },

    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = {
        safEduMstNo: this.eduMaster.safEduMstNo,
      };
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          if (this.editable && !this.viewMode && !this.search) {
            this.gridOptions.btns[0].visible = true;
            this.gridOptions.btns[1].visible = true;
          } else {
            this.gridOptions.btns[0].visible = false;
            this.gridOptions.btns[1].visible = false;
          }
          this.YAuiGrid.setGridData(_result.data)
        },

        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },

    // 추가
    btnAddClicked() {
      this.searchVendor();
    },
    // 삭제
    btnDeleteClicked() {
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321' /* 확인 */,
        message: 'M0000000224' /* 제거하시겠습니까? */,
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          let checkingData = this.YAuiGrid.getCheckedRowItemsAll();

          let gridData = this.YAuiGrid.getGridData();
          this.$_.forEach(checkingData, (item) => {
            gridData = this.$_.reject(gridData, item);
          });

          this.YAuiGrid.setGridData(gridData)
          this.cellEditEndHandler();
          // this.$_.forEach(this.gridOptions.selectedValue, (item) => {
          //   this.gridOptions.data = this.$_.clone(
          //     this.$_.reject(this.gridOptions.data, item)
          //   );
          // });
        },
        cancelCallback: () => {},
      });
    },
    // 검색지정
    btnSearchClicked() {
      this.popupOptions.target = () =>
        import(`${'./eduResultPersonOutsideAdd.vue'}`);
      this.popupOptions.title = 'L0000000614'; /* 교육 문제 등록/수정 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        examNo: this.gridOptions.data.length + 1,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    searchVendor() {
      this.popupOptions.target = () =>
        import(`${'../vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003246'; /* 협력업체 */
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        popupMode: true,
        multiple: false,
        vendors: [],
      };
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.data !== 'C') {
        let row = {
          subconnPsnNo: this.$comm.moment().format('mmSS'),
          vendorNm: data.data.vendorNm,
          vendorCd: data.data.vendorCd,
          workerNm: '',
          birthYmd: '',
          genderCd: 'M',
        };
        this.YAuiGrid.addRow(row, 'last');
      }
      this.eduMaster.eduOutSideUsers = this.YAuiGrid.getGridData();
    },
    cellEditEndHandler() {
      this.eduMaster.eduOutSideUsers = this.YAuiGrid.getGridData();
    },
  },
};
</script>
