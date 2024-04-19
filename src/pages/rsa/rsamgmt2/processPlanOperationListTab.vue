<!--
  목적 : 위험성평가 > 작업위험성평가 > 평가 계획 상세 > 평가대상 작업 탭
  작성자 : kyh
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- <div slot="buttonGroup" class="float-right mb-1"> -->
          <!-- 팀추가 -->
          <!-- <y-btn
              v-if="editable && apprMode"
              title="L0000005905"
              color="orange"
              @btnClicked="btnPopupInsertClicked"
            /> -->

          <!-- 행삭제 -->
          <!-- <y-btn
              v-if="editable && apprMode"
              title="L0000003225"
              color="red"
              @btnClicked="deleteRow"
            />
          </div> -->
          <!-- 평가대상 작업 목록 -->
          <!-- <y-data-table
            :editable="editable && apprMode"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            v-model="selectedValues"
            label="L0000003072"
          >
            <el-table-column
              v-if="editable && apprMode"
              type="selection"
              slot="selection"
              align="center"
              width="55"
            ></el-table-column>
          </y-data-table> -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000003072')"
            :useExcelExport="false"
            :enableCellMerge="true"
            :enableSorting="true"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :showRowCheckColumn="true"
            :editable="editable && apprMode"
            @btnPopupInsertClicked="btnPopupInsertClicked"
            @deleteRow="deleteRow"
            @cellEditEnd="cellEditEndHandler"
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
  name: 'rsaPlanDetailList',
  props: {
    Planmgmt: {
      type: Object,
      default: () => ({
        assessPlanNo: 0,
        plantCd: '', // 사업장 코드
        assessYear: '',
        classificationCd: '',
        regRegdemCd: '',
        assessNm: '',
        assessDt: null,
        assessDesc: '',
        riskType: '',
        planmgmtDeptList: [], // 평가대상작업목록'
        deptList: [],
        deptCd: '',
        deptNm: '',
        tempAssessYear: '',
      }),
    },
    deptListLoad: false,
    updateMode: false,
    deptReLoad: false,
    apprMode: false,
    apprFlag: false,
  },
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      gridOptions: {
        header: [],
        data: [],
        btns: [],
        height: '500',
      },
      editable: true,
      selectedValues: [], // 그리드 선택 목록
      // deptList: [],
      deleteValue: null,
      deleteUrl: '',
      isDelete: false,
      detailUrl: '',
      YAuiGrid: null,
    };
  },
  watch: {
    deptListLoad() {
      this.Planmgmt.planmgmtDeptList = this.YAuiGrid.getGridData();
    },
    deptReLoad() {
      setTimeout(() => {
        this.getList();
      }, 300);
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    // window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    // this.resizeGrid();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.deleteUrl = transactionConfig.rsa.planmgmtdeptlist2.delete.url;
      this.detailUrl = selectConfig.rsa.planmgmt2.get.url;
      setTimeout(() => {
        this.setGridHeader().then(() => {
          this.getList();
        });
      }, 500);
      this.gridOptions.btns = [
        // 팀추가
        {
          title: this.$comm.getLangSpecInfoLabel('L0000005905'),
          color: 'orange',
          btnClicked: 'btnPopupInsertClicked',
          visible: true,
        },
        // 행삭제
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003225'),
          color: 'red',
          btnClicked: 'deleteRow',
          visible: true,
        },
      ];
      this.getList();
    },
    cellEditEndHandler() {
      this.Planmgmt.planmgmtDeptList = this.YAuiGrid.getGridData();
    },
    setGridHeader() {
      return new Promise((resolve) => {
        // 그리드 헤더 설정
        this.gridOptions.header = [
          // 대상팀
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000000927'),
            dataField: 'deptNm',
            editable: false,
            width: 200,
          },
          {
            // 평가시작일
            headerText: this.$comm.getLangSpecInfoLabel('L0000004977'),
            dataField: 'assessStartDt',
            width: 130,
            editRenderer: {
              type: 'CalendarRenderer',
              onlyCalendar: true,
              defaultFormat: 'yyyy-mm-dd',
            },
          },
          {
            // 평가종료일
            headerText: this.$comm.getLangSpecInfoLabel('L0000004978'),
            dataField: 'assessEndDt',
            width: 130,
            editRenderer: {
              type: 'CalendarRenderer',
              onlyCalendar: true,
              defaultFormat: 'yyyy-mm-dd',
            },
          },
          {
            // 비고
            headerText: this.$comm.getLangSpecInfoLabel('L0000001360'),
            dataField: 'assessDesc',
            width: 400,
            type: 'textarea',
            maxlength: 600,
          },
          // 평가완료여부
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004979'),
            dataField: 'showAssessFinishYn',
            editable: false,
            width: 130,
          },
          // 평가완료일
          {
            headerText: this.$comm.getLangSpecInfoLabel('L0000004980'),
            dataField: 'assessFinishDt',
            editable: false,
            width: 150,
          },
        ];
        resolve();
      });
    },
    resizeGrid() {
      let _height = window.innerHeight - 695;
      let _width = window.innerWidth - 1000;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(_width, _height);
    },
    getList() {
      if (!this.Planmgmt.assessPlanNo) return;
      this.$http.url = this.$format(this.detailUrl, this.Planmgmt.assessPlanNo);
      this.$http.type = 'GET';

      this.$http.request(
        (_result) => {
          this.Planmgmt.planmgmtDeptList = _result.data.planmgmtDeptList;
          this.Planmgmt.plantCd = _result.data.plantCd;

          this.YAuiGrid.setGridData(this.Planmgmt.planmgmtDeptList);

          if (
            this.Planmgmt.stepCd === 'BAPSG' ||
            this.Planmgmt.stepCd === 'BAPSA'
          ) {
            console.log('1');
            this.editable = false;
            this.gridOptions.btns[0].visible = false;
            this.gridOptions.btns[1].visible = false;
          }
          if (this.apprFlag) {
            console.log('2');
            this.editable = false;
            this.gridOptions.btns[0].visible = false;
            this.gridOptions.btns[1].visible = false;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    btnPopupInsertClicked() {
      this.popupOptions.target = () =>
        import(`${'@/pages/baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.title = 'L0000004209'; // 팀검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        multiple: true,
        plantCd: this.Planmgmt.plantCd,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      let tempGridData = this.YAuiGrid.getGridData();

      if (data.length > 0) {
        if (data) {
          this.$_.forEach(data, (dept) => {
            let index = this.$_.findIndex(tempGridData, {
              deptCd: dept.deptCd,
            });
            if (index === -1) {
              tempGridData.push({
                deptCd: dept.deptCd,
                deptNm: dept.deptNm,
                assessStartDate: '',
                assessEndDate: '',
                remarks: '',
                assessFinishYn: 'N', // 평가완료여부
                showAssessFinishYn: '미완료',
                assessDate: this.$comm.getToday(),
              });
            }
          });
        }
      }
      this.YAuiGrid.setGridData(tempGridData);
      this.Planmgmt.planmgmtDeptList = this.YAuiGrid.getGridData();
    },
    deleteRow() {
      let selectedValues = this.YAuiGrid.getCheckedRowItemsAll();
      let tempGridData = this.YAuiGrid.getGridData();
      if (!selectedValues || !selectedValues.length) {
        this.$comm.alertWarning('M0000001614'); // 선택된 항목이 없습니다.
        return;
      }

      this.$_.forEach(selectedValues, (item) => {
        tempGridData.splice(
          this.$_.findIndex(tempGridData, {
            deptCd: item.deptCd,
          }),
          1
        );
      });
      this.YAuiGrid.setGridData(tempGridData);
      this.Planmgmt.planmgmtDeptList = this.YAuiGrid.getGridData();
    },

    // 삭제
    btnDeleteClickedCallback(_result) {
      this.$_.forEach(this.selectedValues, (item) => {
        this.gridOptions.data.splice(
          this.$_.findIndex(this.gridOptions.data, {
            deptCd: item.deptCd,
          }),
          1
        );
      });

      this.isDelete = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>
