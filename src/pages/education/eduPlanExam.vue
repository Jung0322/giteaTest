<!--
  목적 : 교육계획 등록-> 교육계획탭
  Detail : 교육풀이문제 등록/수정화면
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
             문제상세 
            <y-btn
              v-if="editable && !authDuringAppr && !search"
              title="L0000001048"
              color="blue"
              @btnClicked="btnDetailAllClicked"
            />
             추가 
            <y-btn
              v-if="editable && eduMaster.processStepCd !== 'SES02' && eduMaster.processStepCd !== 'SES03' && !authDuringAppr && !search"
              title="L0000002892"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
             제외 
            <y-btn
              v-if="gridOptions.data.length > 0 && editable && this.eduMaster.processStepCd !== 'SES02' && this.eduMaster.processStepCd !== 'SES03' && !authDuringAppr && !search"
              title="L0000002620"
              color="red"
              @btnClicked="btnReject"
            />
          </div>
           교육 문제 목록 
          <y-data-table
            label="L0000000615"
            :print="true"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="gridOptions.selectedValue"
            :checkItemData="checkData"
            checkKey="eduQuestionLstNo"
            :useRownum="false"
            :popMode="true"
          >
            <el-table-column
              v-if="editable && this.eduMaster.processStepCd !== 'SES02' && this.eduMaster.processStepCd !== 'SES03' && !authDuringAppr && !search"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000615')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="true"
          @btnDetailAllClicked="btnDetailAllClicked"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @btnReject="btnReject"
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
    tabEditable: false,
    eduMaster: {
      safEduMstNo: 0,
      eduAttCd: null,
      useYn: 'Y',
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
    },
  },

  data: () => ({
    gridOptions: {
      name: 'eduPlanExam',
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
    examList: [],
    checkData: [],
  }),

  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'eduMaster.eduAttCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },

    'eduMaster.safEduCourseNo': function (newValue, oldValue) {
      if (newValue != null) {
        this.getList();
      } else {
        this.gridOptions.data = [];
        this.YAuiGrid.setGridData([]);
      }
    },
    'gridOptions.data.length': {
      handler: function (newValue, oldValue) {
        var questionLstList = [];

        this.gridOptions.data.forEach((element) => {
          questionLstList.push(element.eduQuestionLstNo);
        });

        this.eduMaster.questionLsts = questionLstList;
      },
      deep: true,
    },
    tabEditable: {
      handler: function (newValue, oldValue) {
        this.editable = newValue;
        if (!this.tabEditable) {
          this.gridOptions.btns[1].visible = this.editable;
          this.gridOptions.btns[2].visible = this.editable;
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
    this.YAuiGrid = this.$refs.yAuiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      if (this.editable) {
        this.editable = this.tabEditable;
      }

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001043'),
          dataField: 'questionContents',
          width: '50%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000902'),
          dataField: 'answerCount',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000976'),
          dataField: 'createUserNm',
          width: '20%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000973'),
          dataField: 'createDt',
          width: '20%',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001048'),
          color: 'blue',
          btnClicked: 'btnDetailAllClicked',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002892'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
          visible: this.editable,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000002620'),
          color: 'red',
          btnClicked: 'btnReject',
          visible: this.editable,
        },
      ];
      this.getList();
    },

    getList() {
      if (this.eduMaster.safEduCourseNo === null) {
        return;
      }
      this.$http.url = 'api/saf/education/mobile/eduplanquestion';

      this.$http.type = 'GET';
      this.$http.param = {
        safEduMstNo: this.eduMaster.safEduMstNo,
        safEduCourseNo: this.eduMaster.safEduCourseNo,
      };
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));

          if (this.editable && !this.authDuringAppr && !this.search) {
            this.gridOptions.btns[0].visible = true;
          }
          if (
            this.editable &&
            this.eduMaster.processStepCd !== 'SES02' &&
            this.eduMaster.processStepCd !== 'SES03' &&
            !this.authDuringAppr &&
            !this.search
          ) {
            this.gridOptions.btns[1].visible = true;
            this.gridOptions.btns[2].visible = true;
          }

          if (_result.data[0] !== undefined) {
            this.$_.forEach(_result.data[0].checkData, (_item) => {
              this.checkData.push({ eduQuestionLstNo: Number(_item) });
            });
          } else {
            this.checkData = [];
          }
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },

    btnPopupClickedCallback() {
      this.openPopup(null);
    },
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./eduPlanExamPopup.vue'}`);
      this.popupOptions.title = 'L0000001045'; /* 문제내역 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        safEduCourseNo:
          this.eduMaster.safEduCourseNo === null
            ? 0
            : this.eduMaster.safEduCourseNo,
        safEduMstNo:
          this.eduMaster.safEduMstNo === null ? '' : this.eduMaster.safEduMstNo,
        plantCd: this.eduMaster.plantCd === null ? '' : this.eduMaster.plantCd,
        eduAttCd:
          this.eduMaster.eduAttCd === null ? '' : this.eduMaster.eduAttCd,
        eduClassCd:
          this.eduMaster.eduClassCd === null ? '' : this.eduMaster.eduClassCd,
        paramEducation: this.YAuiGrid.getGridData(),
      };
      this.popupOptions.closeCallback = this.closeTestItemPopup;
    },
    // 검사항목 추가 팝업 닫기
    closeTestItemPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.gridOptions.data = this.YAuiGrid.getGridData();
      this.$_.forEach(data.data, (item) => {
        this.gridOptions.data.push(item);
      });
      this.YAuiGrid.setGridData(this.gridOptions.data);
      let questionLstList = [];
      this.YAuiGrid.getGridData().forEach((element) => {
        questionLstList.push(element.eduQuestionLstNo);
      });

      this.eduMaster.questionLsts = questionLstList;
    },

    btnReject() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000160' /* 제외할 항목을 선택하세요. */,
          type: 'warning',
        });
      } else {
        let gridData = this.YAuiGrid.getGridData();
        this.$_.forEach(checkingData, (item) => {
          gridData = this.$_.reject(gridData, item);
        });
        this.YAuiGrid.setGridData(gridData);
        let questionLstList = [];
        this.YAuiGrid.getGridData().forEach((element) => {
          questionLstList.push(element.eduQuestionLstNo);
        });

        this.eduMaster.questionLsts = questionLstList;
        // this.$_.forEach(this.gridOptions.selectedValue, item => {
        //   this.gridOptions.data = this.$_.clone(
        //     this.$_.reject(this.gridOptions.data, {
        //       eduQuestionLstNo: item.eduQuestionLstNo,
        //     })
        //   );
        // });
      }
    },
    // 문제상세
    btnDetailAllClicked() {
      if (this.YAuiGrid.getGridData().length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395' /* 안내 */,
          message: 'M0000000275' /* 조회할 데이터가 없습니다. */,
          type: 'warning',
        });
        return;
      }
      this.popupOptions.target = () => import(`${'./eduPlanExamDetail.vue'}`);
      this.popupOptions.title = 'L0000000616'; /* 교육 문제 상세 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        eduQuestionList: this.YAuiGrid.getGridData(),
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
  },
};
</script>
