<!--
  목적 : 교육문제관리
  Detail : 교육문제관리 목록
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <y-plant
            type="search"
            v-model="searchParam.plantCd"
            @datachange="
              (val) => {
                (searchParam.plantCd = val), getList();
                getEduCourseItems();
              }
            "
          ></y-plant>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
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

        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육분류 -->
          <y-select
            :width="8"
            :comboItems="eduTypeCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000659"
            name="eduTypeCd"
            v-model="searchParam.eduTypeCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="4" xl="4" class="col-xxl-3">
          <!-- 교육명 -->
          <y-select
            :width="8"
            :comboItems="eduCourseSearchItems"
            itemText="eduCourseNm"
            itemValue="safEduCourseNo"
            ui="bootstrap"
            type="edit"
            label="L0000000653"
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
             신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnAddClicked"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
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
            :use-paging="true"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000615')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @cellClick="cellClickHandler"
          @btnAddClicked="btnAddClicked"
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
  props: {},
  data() {
    return {
      searchParam: {
        eduAttCd: null,
        eduTypeCd: null,
        safEduCourseNo: 0,
        plantCd: '',
      },
      gridOptions: {
        name: 'educationExam',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '80%',
        top: '10px',
        height: '500',
        param: {},
        closeCallback: null,
      },
      searchUrl: '',
      editable: true,
      examList: [],
      eduAttCdSearchItems: [],
      eduTypeCdSearchItems: [],
      eduCourseSearchItems: [],
    };
  },
  watch: {
    'searchParam.eduAttCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },
    'searchParam.eduTypeCd': function (newValue, oldValue) {
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
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      setTimeout(() => {
        this.getEduAttCdItems();
        this.getEduTypeCdItems();
        this.getEduCourseItems();
      }, 200);

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000644'), 
          dataField: 'eduAttNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000659'), 
          dataField: 'eduTypeNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000653'), 
          dataField: 'eduCourseNm', 
          width: '20%', 
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001044'), 
          dataField: 'questionCount', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'), 
          dataField: 'useYnNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writerUserNm', 
          width: '15%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'writerDt', 
          width: '15%', 
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnAddClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ]

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
      // this.setGridSize();
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    // 조회
    getList() {
      this.$http.url = selectConfig.saf.education.eduQuestion.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
        }
      );
    },
    btnSearchClickedCallback(_result) {
      this.getList();
    },
    // 추가
    btnAddClicked() {
      this.popupOptions.target = () => import(`${'./eduPlanExamAdd.vue'}`);
      this.popupOptions.title = 'L0000000614'; // 교육 문제 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        eduQuestionNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    cellClickHandler(event) {
      if (event.dataField !== 'eduCourseNm') return;
      this.popupOptions.target = () => import(`${'./eduPlanExamAdd.vue'}`);
      this.popupOptions.title = 'L0000000614'; // 교육 문제 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = event.item;
      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkClicked(header, data) {
      if (data === null) return;
      this.popupOptions.target = () => import(`${'./eduPlanExamAdd.vue'}`);
      this.popupOptions.title = 'L0000000614'; // 교육 문제 등록/수정
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = data;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    getEduAttCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_ATT'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.eduAttCdSearchItems = this.$_.clone(_result.data);
          this.eduAttCdSearchItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }); // 전체
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
        }
      );
    },
    getEduCourseItems() {
      this.$http.url = selectConfig.saf.education.eduCourse.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        eduAttCd: this.searchParam.eduAttCd,
        eduTypeCd: this.searchParam.eduTypeCd,
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          this.eduCourseSearchItems = this.$_.clone(_result.data);
          this.eduCourseSearchItems.splice(0, 0, {
            safEduCourseNo: 0,
            eduCourseNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
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
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
        }
      );
    },
    getEduTypeCdItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'SAF_EDU_COURSE'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.eduTypeCdSearchItems = this.$_.clone(_result.data);
          this.eduTypeCdSearchItems.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
          // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
        }
      );
    },
    ckedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', 'M0000000016');
      // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
  },
};
</script>
