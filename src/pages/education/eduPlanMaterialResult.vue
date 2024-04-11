<!--
  목적 : 교육계획 등록-> 교육자료탭
  Detail : 교육자료 등록화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- <b-row>
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1"></div>
           교육 자료 목록 
          <y-data-table
            label="L0000000620"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="!viewMode"
            v-model="gridOptions.selectedValue"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000620')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @cellClick="cellClickHandler"
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
    viewMode: false,
    eduMaster: {
      safEduMstNo: 0,
      eduAttCd: null,
      safEduCourseNo: 0,
      eduTypeCd: null,
      deptCd: null,
      eduNm: '',
      duration: [],
      eduGrpNo: 0,
      eduTime: 0,
      eduSYmd: '',
      eduEYmd: '',
      eduPlace: '',
      eduTeacher: '',
      eduContent: '',
      processStepCd: '',
      eduUserId: [],
      eduDeptCd: [],
      eduGroupCds: [],
      questionLsts: [],
      dataLsts: [],
    },
  },

  data: () => ({
    gridOptions: {
      name: 'eduPlanMateriaResult',
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
    editable: true,
    checkData: [],
    materialList: [],
  }),
  watch: {
    'eduMaster.safEduCourseNo': function(newValue, oldValue) {
      if (newValue != null) {
        this.getList();
      } else {
        this.gridOptions.data = [];
        this.YAuiGrid.setGridData([]);
      }
    },
    'gridOptions.selectedValue': {
      handler: function(newValue, oldValue) {
        var dataLsts = [];

        this.gridOptions.selectedValue.forEach(element => {
          dataLsts.push(element.eduMatNo);
        });

        this.eduMaster.dataLsts = dataLsts;
      },
      deep: true,
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
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002616'), 
          dataField: 'title', 
          width: '100%', 
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
      ];

      this.getList();
    },

    getList() {
      this.$http.url = this.$format(
        // selectConfig.saf.education.eduMaster.getProblemsResult.url,
        // this.eduMaster.safEduMstNo
        selectConfig.saf.education.eduMaster.getProblems.url,
        this.eduMaster.safEduCourseNo,
        this.eduMaster.safEduMstNo
      );
      this.$http.type = 'GET';
      this.$http.param = [];
      this.$http.request(
        _result => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data))

          if (_result.data[0] !== undefined) {
            this.$_.forEach(_result.data[0].checkData, _item => {
              this.checkData.push({ eduMatNo: Number(_item) });
            });
          } else {
            this.checkData = [];
          }
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    cellClickHandler(event) {
      this.popupOptions.target = () =>
        import(`${'./educationRegMaterialDetailPopup.vue'}`);
      this.popupOptions.title = 'L0000000621'; /* 교육자료 상세 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkClicked(header, data) {
      if (data === null) return;
      this.popupOptions.target = () =>
        import(`${'./educationRegMaterialDetailPopup.vue'}`);
      this.popupOptions.title = 'L0000000621'; /* 교육자료 상세 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopup;
    },
    // 추가
    btnAddClicked() {
      this.popupOptions.target = () => import(`${'./eduPlanMaterialAdd.vue'}`);
      this.popupOptions.title = 'L0000000614'; /* 교육 문제 등록/수정 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        examNo: this.gridOptions.data.length + 1,
        planMode: true,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    // 삭제
    btnDeleteClicked() {},
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
  },
};
</script>
