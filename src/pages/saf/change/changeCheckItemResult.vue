<!--
  목적 : 안전 - 변경관리 상세 - 검토항목
  Detail : 검토항목 등록/수정 화면
  *
  examples:
  *
  -->
  <template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <div slot="buttonGroup" class="float-right mb-1">
          <el-tag size="medium" type="warning">
            <i class="el-icon-warning"></i>
            {{ $comm.getLangSpecInfoLabel('L0000001220') }}
            <!-- 변경/실행여부가 체크해제 되면 완료예정일, 담당자, 실행확인, 완료일, 확인자 값이 초기화 됩니다. -->
          </el-tag>
        </div>
      </b-col>
      <b-col sm="12">
        <!-- 관련업무 목록 -->        
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000000574')"
          :useExcelExport="false"
          :showGridSetSave="false"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :editable="editable && !allDisabled"
          @cellEditEnd="cellEditEndHandler"
        />
      </b-col>
    </b-row>
    <change-ref-work
      :change.sync="change"
      :checkItemResult.sync="checkItemResult"
      :refWork.sync="refWork"
      :changeIndex="changeIndex"
      :allDisabled="allDisabled"
      @proceeding="proceeding"
    />
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
  
<script>
import changeRefWork from './changeRefWork';
import searchIcon from '@/assets/images/info.png';
import item from '../../../views/layout/components/Sidebar/Item';
export default {
  /* attributes: name, components, props, data */
  name: 'y-change-check-item-result',
  components: {
    changeRefWork,
  },
  props: {
    allDisabled: false,
    tabIndex: {
      type: String,
      default: '',
    },
    refWork: {
      type: Object,
      default: {
        submitCheckSafWork: false,
      },
    },
    checkItemResult: {
      type: String,
      default: function () {
        return '';
      },
    },
    change: {
      type: Object,
      default: function () {
        return {
          safChngNo: 0, // key
          chngStepCd: '',
          changeCheckItemResults: [],
          changeRefWorks: [],
          plantCd: '',
        };
      },
    },
  },
  data: () => ({
    YAuiGrid: null,
    gridOptions: {
      name: 'changechangeCheckItemResult',
      header: [],
      data: [],
      height: '300',
    },
    popupOptions: {
      target: null,
      title: '',
      visible: false,
      param: {},
      width: '70%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    row: null,
    headerName: '',
    changeIndex: 0,
    loading: false,
    // searchUrl: '',
  }),
  computed: {
    checkEdit() {
      return !(this.change.chngStepCd === 'CGSP2' || this.change.chngStepCd === 'CGSP3');
    },
    actionEdit() {
      return this.change.chngStepCd === 'CGSP2';
    },
  },
  watch: {
    tabIndex: {
      handler: function (val, oldVal) {
        this.getComboItems(); // 진행사항
      },
      deep: true,
    },
    allDisabled: function () {
      this.init();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.YAuiGrid.setGridData(this.change.changeCheckItemResults);
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {      
      this.editable = this.$route.meta.editable;
      this.getComboItems(); // 진행사항
      this.addDisabledEdit();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), // 구분
          dataField: 'chngRefWorkNm',
          width: '200px',
          style: 'center-align',
          editable: false,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001219'), // 변경/실행여부
          dataField: 'chngRsltYn',
          width: '130px',
          style: 'center-align',
          renderer: {
            type: 'CheckBoxEditRenderer',
            checkValue: 'Y',
            unCheckValue: 'N',
            editable: true,
            // 체크박스 disabled 함수
            disabledFunction: function (rowIndex, columnIndex, value, isChecked, item, dataField) {
              return item.disabledEdit; // true 반환하면 disabled 시킴
            } 
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004671'), // 실행예정일
          dataField: 'endSchDt',
          editable: this.editable && !this.allDisabled && this.checkEdit,
          width: '400px',
          dateInputFormat: 'yyyy-mm-dd',
          editRenderer: {
            type: 'CalendarRenderer',
            openDirectly: true, // 에디팅 진입 시 바로 달력 열기
            showExtraDays: true, // 지난 달, 다음 달 여분의 날짜(days) 출력
            defaultFormat: 'yyyy-mm-dd', // 달력 선택 시 데이터에 적용되는 날짜 형식
            onlyCalendar: false, // 사용자 입력 불가, 즉 달력으로만 날짜입력 (기본값 : true)
            showPlaceholder: true, // defaultFormat 설정된 값으로 플래스홀더 표시
            showEditorBtn: false, // 셀에 마우스 오버 시 해당 셀의 오른쪽에 에디터 버턴을 출력시킬지 여부를 지정
          },
          renderer: {
            type: 'IconRenderer',
            iconPosition: 'aisleRight',
            iconWidth: 18,
            iconHeight: 18,
            iconFunction: (rowIndex, columnIndex, value, item) => {
              if (item.chngRsltYn === 'Y' && this.editable && !this.allDisabled && this.checkEdit) {
                return searchIcon;
              }
            },
            onClick: (event) => {
              if (event.item.chngRsltYn === 'Y' && this.editable && !this.allDisabled && this.checkEdit) {
                this.YAuiGrid.openInputer();
              }
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000890'), // 담당부서
          dataField: 'mgrDeptNm',
          editable: false,
          width: '200px',
          style: 'center-align',
          renderer: {
            type: 'IconRenderer',
            iconPosition: 'aisleRight',
            iconWidth: 18,
            iconHeight: 18,
            iconFunction: (rowIndex, columnIndex, value, item) => {
              if (item.chngRsltYn === 'Y' && this.editable && !this.allDisabled && this.checkEdit) {
                return searchIcon;
              }
            },
            onClick: (event) => {
              if (event.item.chngRsltYn === 'Y' && this.editable && !this.allDisabled && this.checkEdit) {
                this.searchDept(event.item);
              }
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000892'), // 담당자
          dataField: 'mgrNm',
          editable: false,
          width: '200px',
          style: 'center-align',
          renderer: {
            type: 'IconRenderer',
            iconPosition: 'aisleRight',
            iconWidth: 18,
            iconHeight: 18,
            iconFunction: (rowIndex, columnIndex, value, item) => {
              if (item.chngRsltYn === 'Y' && this.editable && !this.allDisabled && (this.checkEdit || this.actionEdit)) {
                return searchIcon;
              }
            },
            onClick: (event) => {
              if (event.item.chngRsltYn === 'Y' && this.editable && !this.allDisabled && (this.checkEdit || this.actionEdit)) {
                this.btnSearchUserClicked(event.item, 'mgr');
              }
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001822'), // 실행확인
          dataField: 'contents',
          width: '200px',
          style: 'center-align',
          editable: this.editable && !this.allDisabled && this.actionEdit,
          editRenderer: {
            type: "InputEditRenderer",
            showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
          }
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002043'), // 완료일
          dataField: 'endDt',
          width: '200px',
          style: 'center-align',
          editable: this.editable && !this.allDisabled && this.actionEdit,
          dataType: 'data',
          editRenderer: {
            type: 'CalendarRenderer',
            openDirectly: true, // 에디팅 진입 시 바로 달력 열기
            showExtraDays: true, // 지난 달, 다음 달 여분의 날짜(days) 출력
            defaultFormat: 'yyyy-mm-dd', // 달력 선택 시 데이터에 적용되는 날짜 형식
            onlyCalendar: false, // 사용자 입력 불가, 즉 달력으로만 날짜입력 (기본값 : true)
            showPlaceholder: true, // defaultFormat 설정된 값으로 플래스홀더 표시
            showEditorBtn: false, // 셀에 마우스 오버 시 해당 셀의 오른쪽에 에디터 버턴을 출력시킬지 여부를 지정
          },
          renderer: {
            type: 'IconRenderer',
            iconPosition: 'aisleRight',
            iconWidth: 18,
            iconHeight: 18,
            iconFunction: (rowIndex, columnIndex, value, item) => {
              if (item.chngRsltYn === 'Y' && this.editable && !this.allDisabled && this.actionEdit) {
                return searchIcon;
              }
            },
            onClick: (event) => {
              if (event.item.chngRsltYn === 'Y' && this.editable && !this.allDisabled && this.actionEdit) {
                this.YAuiGrid.openInputer();
              }
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003323'), // 확인자
          dataField: 'chkNm',
          editable: false,
          width: '200px',
          style: 'center-align',
          renderer: {
            type: 'IconRenderer',
            iconPosition: 'aisleRight',
            iconWidth: 18,
            iconHeight: 18,
            iconFunction: (rowIndex, columnIndex, value, item) => {
              if (item.chngRsltYn === 'Y' && this.editable && !this.allDisabled) {
                return searchIcon;
              }
            },
            onClick: (event) => {
              if (event.item.chngRsltYn === 'Y' && this.editable && !this.allDisabled && this.actionEdit && this.$store.getters.deptAuthGrp.deptAccessYn === 'Y') {
                this.btnSearchUserClicked(event.item, 'chk');
              }
            },
          },
        },
      ];

      if (this.change.chngStepCd === 'CGSP2') {
        this.$_.forEach(this.change.changeCheckItemResults, (item) => {
          item.chkNm = item.chkNm ? item.chkNm : item.endSchDt ? this.$store.getters.name : null;
          item.chkId = item.chkId ? item.chkId : item.endSchDt ? this.$store.getters.token : null;
        });
      }
    },
    /**
     * 공통 마스터 정보 조회 (변경구분, 등급(작성), 등급(검토))
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    async getComboItems() {
      if (!this.change.changeCheckItemResults || this.change.changeCheckItemResults.length === 0) {
        // 초기의 경우 다음과 같이 코드에서 데이터를 가지고 와 표시한다.
        await this.$comm.getComboItems('SAF_CHNG_REF_WORK').then((_result) => {
          _result = _result.filter((code) => code.useYn === 'Y');
          this.$_.forEach(_result, (item) => {            
            this.change.changeCheckItemResults.push({
              safChngChkItmRsltNo: 0,
              chngRefWorkCd: item.code,
              chngRefWorkNm: item.codeNm,
              mgrNm: '',
              mgrId: '',
              mgrDeptNm: '',
              mgrDeptCd: '',
              chkNm: '',
              chkId: '',
              disabledEdit: !this.editable || this.allDisabled || !this.checkEdit,
            });
          });
        });
        this.YAuiGrid.setGridData(this.change.changeCheckItemResults);
      }
    },
    searchDept(row) {
      this.row = row;

      this.popupOptions.target = () =>
        import(`${'../../baseInfo/deptManage/deptSearchPopup.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000004627';
      this.popupOptions.visible = true;
      this.popupOptions.width = '35%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchDept;
    },
    closePopupSearchDept(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.dept) {
        this.row['mgrDeptNm'] = data.dept.deptNm;
        this.row['mgrDeptCd'] = data.dept.deptCd;
      }
      // this.$forceUpdate();
      this.change.changeCheckItemResults = this.YAuiGrid.getGridData();
      this.YAuiGrid.update();
    },
    btnSearchUserClicked(row, headerName) {
      // 선택한 row와 헤더의 명칭을 저장한다.
      this.row = row;
      this.headerName = headerName;

      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
        deptCd: this.$store.getters.deptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        if (this.headerName === 'mgr') {
          this.row['mgrNm'] = data.user.userNm;
          this.row['mgrId'] = data.user.userId;
          this.row['mgrDeptNm'] = data.user.deptNm;
          this.row['mgrDeptCd'] = data.user.deptCd;
        } else {
          this.row['chkNm'] = data.user.userNm;
          this.row['chkId'] = data.user.userId;
        }
        // this.$forceUpdate();
        this.change.changeCheckItemResults = this.YAuiGrid.getGridData();
        this.YAuiGrid.update();
      }
    },
    changeAction(scope) {
      this.loading = true;
      this.changeIndex = scope.$index;
      this.change.changeCheckItemResults[this.changeIndex].endSchDt = '';
      this.change.changeCheckItemResults[this.changeIndex].mgrNm = '';
      this.change.changeCheckItemResults[this.changeIndex].mgrId = '';
      this.change.changeCheckItemResults[this.changeIndex].mgrDeptNm = '';
      this.change.changeCheckItemResults[this.changeIndex].mgrDeptCd = '';
      this.change.changeCheckItemResults[this.changeIndex].chkNm = '';
      this.change.changeCheckItemResults[this.changeIndex].chkId = '';
      this.change.changeCheckItemResults[this.changeIndex].contents = '';
      this.change.changeCheckItemResults[this.changeIndex].endDt = '';

      this.$emit('changeItemResult', scope.$index);

      setTimeout(() => {
        if (this.loading) {
          // 1초 정도의 여유를 주고 그 이상 넘어갈시 로딩바 제거 후 전체 로직 검사
          this.changeIndex = -1;
          this.$emit('changeItemResult', -1);
        }
      }, 1000);
    },
    proceeding() {
      this.loading = false;
    },
    cellEditEndHandler(event) {
      let indexData = {
        $index: event.rowIndex,
      };
      
      // 변경/실행여부가 체크해제 되면 진행부서, 확인일자, 완료여부 값이 초기화
      if (event.columnIndex === 1) { // 변경/실행여부
        this.changeAction(indexData);
        this.change.changeCheckItemResults[event.rowIndex].chngRsltYn = event.value;

      // 해당 index의 체크박스가 Y면 값을 변경
      } else if (event.columnIndex === 2 && event.item.chngRsltYn === 'Y') { // 실행예정일
        this.change.changeCheckItemResults[event.rowIndex].endSchDt = event.value;
      } else if (event.columnIndex === 5 && event.item.chngRsltYn === 'Y') { // 실행확인
        this.change.changeCheckItemResults[event.rowIndex].contents = event.value;
      } else if (event.columnIndex === 6 && event.item.chngRsltYn === 'Y') { // 완료일
        this.change.changeCheckItemResults[event.rowIndex].endDt = event.value;
      }
      this.YAuiGrid.setGridData(this.change.changeCheckItemResults);
    },
    // checkbox 활성화 여부 추가
    addDisabledEdit() {
      this.$_.forEach(this.change.changeCheckItemResults, item => {
        item.disabledEdit = !this.editable || this.allDisabled || !this.checkEdit
      });
    },
    /** button 관련 이벤트 **/
    /** end button 관련 이벤트 **/
  },
};
</script>
  