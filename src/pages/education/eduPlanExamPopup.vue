<!--
  목적 : 교육계획 등록-> 교육계획탭
  Detail : 교육풀이문제 등록/수정화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant
            type="search"
            v-model="searchParam.plantCd"
            @datachange="val => {searchParam.plantCd = val, getList();}"
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 교육대분류 -->
          <y-select
            :width="8"
            :comboItems="eduAttCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000644"
            name="eduAttCd"
            v-model="searchParam.eduAttCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 교육분류 -->
          <y-select
            :width="8"
            :comboItems="eduClassCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000659"
            name="eduClassCd"
            v-model="searchParam.eduClassCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 교육과정 -->
          <y-select
            :width="8"
            :comboItems="eduCourseSearchItems"
            itemText="eduCourseNm"
            itemValue="safEduCourseNo"
            ui="bootstrap"
            type="edit"
            label="L0000000633"
            name="safEduCourseNo"
            v-model="searchParam.safEduCourseNo"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             문제상세 
            <y-btn v-if="editable" title="L0000001048" color="blue" @btnClicked="btnDetailAllClicked" />
            선택 
            <y-btn title="L0000001561" color="orange" @btnClicked="btnAdd" />
             검색 
            <y-btn
              v-if="editable"
              title="L0000000327"
              color="green"
              action-type="GET"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             닫기 
            <y-btn title="L0000000881" @btnClicked="closePPopup()" />
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
          >
            <el-table-column type="selection" slot="selection" align="center" width="55"></el-table-column>
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
          @getList="getList"
          @btnAdd="btnAdd"
          @closePPopup="closePPopup"
          @btnDetailAllClicked="btnDetailAllClicked"
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
    popupParam: {
      type: Object,
      default: function() {
        return { eduMaster: [], popupMode: false };
      },
    },

    eduMaster: {
      safEduMstNo: 0,
      eduAttCd: null,
      safEduCourseNo: 0,
      eduClassCd: null,
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
      name: 'eduPlanExamPopup',
      btns: [],
      header: [],
      data: [],
      height: '300',
      selectedValue: [],
    },
    YAuiGrid: null,
    searchParam: {
      plantCd: '',
      eduAttCd: '',
      useYn: 'Y',
      eduClassCd: '',
      safEduCourseNo: 0,
    },
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
    examList: [],
    checkData: [],
    eduAttCdSearchItems: [],
    eduCourseSearchItems: [],
    eduTypeCdSearchItems: [],
    eduClassCdSearchItems: [],
  }),

  watch: {
    tabIndex() {
      this.loadComponent();
    },
    'searchParam.eduAttCd': function(newValue, oldValue) {
      this.getEduCourseItems();
    },
    'searchParam.eduClassCd': function(newValue, oldValue) {
      this.getEduCourseItems();
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
      setTimeout(() => {
        this.getEduAttCdItems();
        this.getEduCourseItems();
        this.getEduClassCdItems();
      }, 200);

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001043'), 
          dataField: 'questionContents', 
          width: '50%', 
          style: 'left-align'
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
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnAdd',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePPopup',
        },
      ]
      // this.searchParam = this.popupParam;
      this.searchParam.safEduCourseNo = this.popupParam.safEduCourseNo
      this.searchParam.safEduMstNo = this.popupParam.safEduMstNo
      this.searchParam.plantCd = this.popupParam.plantCd
      this.searchParam.eduAttCd = this.popupParam.eduAttCd
      this.searchParam.eduClassCd = this.popupParam.eduClassCd

      this.getList();
    },
    btnSearchClickedCallback(_result) {
      this.getList();
    },
    getList() {
      this.searchParam.useYn = 'Y';
      this.$http.url = selectConfig.saf.education.eduMaster.getQuestion.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.gridOptions.data = [];
          this.$_.forEach(_result.data, item => {
            var union = this.$_.find(this.popupParam.paramEducation, {
              eduQuestionLstNo: item.eduQuestionLstNo,
            });

            if (union === undefined) {
              this.gridOptions.data.push(item);
            }            
          });

          this.YAuiGrid.setGridData(this.gridOptions.data)
          if (_result.data[0] !== undefined) {
            this.$_.forEach(_result.data[0].checkData, _item => {
              this.checkData.push({ eduQuestionLstNo: Number(_item) });
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
    getEduAttCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_ATT'
      );
      this.$http.type = 'get';
      this.$http.request(
        _result => {
          this.eduAttCdSearchItems = this.$_.clone(_result.data);
          this.eduAttCdSearchItems.splice(0, 0, { code: null, codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), /* 전체 */ });
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },

    getEduCourseItems() {
      this.$http.url = selectConfig.saf.education.eduCourse.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        eduAttCd: this.searchParam.eduAttCd,
        eduTypeCd: this.searchParam.eduClassCd,
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        _result => {
          this.eduCourseSearchItems = this.$_.clone(_result.data);
          this.eduCourseSearchItems.splice(0, 0, {
            safEduCourseNo: 0,
            eduCourseNm: this.$comm.getLangSpecInfoLabel('L0000002519'), /* 전체 */
          });
          if (
            this.searchParam.safEduCourseNo &&
            this.$_.indexOf(
              this.$_.map(this.eduCourseSearchItems, 'safEduCourseNo'),
              this.searchParam.safEduCourseNo
            ) === -1
          ) {
            this.searchParam.safEduCourseNo = 0;
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
    btnPopupClickedCallback() {
      this.openPopup(null);
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
      );
    },
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./eduPlanExamAdd.vue'}`);
      this.popupOptions.title = 'L0000000319'; /* 검사항목 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        editMode: false,
        popupMode: true,
        paramTestItems: this.testitemgridOptions.data,
      };
      // 신규로 창을 여는지 상세로 창을 여는지 체크
      // if (data) this.updateMode = true;
      // else this.updateMode = false;
      this.popupOptions.closeCallback = this.closeTestItemPopup;
    },
    // 검사항목 추가 팝업 닫기
    closeTestItemPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        this.$_.forEach(data.data, item => {
          this.testitemgridOptions.data.push({
            eairTestItemNm: item.eairTestItemNm,
            envUnitNm: item.envUnitNm,
            eairTestItemCd: item.eairTestItemCd,
            useYn: item.useYn,
          });
        });

        // }
      }

      // if (data !== 'C') this.gridOptions.nodeData = data;
    },
    getEduTypeCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_TYPE'
      );
      this.$http.type = 'get';
      this.$http.request(
        _result => {
          this.eduTypeCdSearchItems = this.$_.clone(_result.data);
          this.eduTypeCdSearchItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), /* 전체 */
          });
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    getEduClassCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_COURSE'
      );
      this.$http.type = 'get';

      this.$http.request(
        _result => {
          this.eduClassCdSearchItems = this.$_.clone(_result.data);
          this.eduClassCdSearchItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), /* 전체 */
          });
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 작업 중 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    // 추가
    btnAdd() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', /* 안내 */
          message: 'L0000004282', /* 제외할 항목을 선택하세요. */
          type: 'warning',
        });
        return
      }
      this.closePPopup(checkingData);
    },

    // 삭제
    btnDeleteClicked() {},
    // 문제상세
    btnDetailAllClicked() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', /* 안내 */
          message: 'M0000000275', /* 조회할 데이터가 없습니다. */
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
        eduQuestionList: checkingData,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    closePPopup(data) {
      this.$emit('closePopup', { data });
    },
  },
};
</script>
