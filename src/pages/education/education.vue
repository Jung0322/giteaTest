<!--
  목적 : 교육 계획 및 실적
  작성자 : kkc
  Detail : 교육 계획 및 실적 조회
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
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
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 년도 -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000000829"
            name="year"
            default="searchParam.year"
            v-model="searchParam.year"
          ></y-datepicker>
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

    <!-- 교육 결과 목록 grid -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1">
            <y-btn :title="searchArea.title" color="green" @btnClicked="btnSearchVisibleClicked" /> 
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           교육과정별 현황 목록 
          <y-data-table
            label="L0000000638"
            gridType="edit"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000638')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @cellClick="cellClickHandler"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'edu-person-status',
  props: {},
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '500px',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      searchArea: {
        title: 'L0000000329' /* 검색박스숨기기 */,
        show: true,
      },
      searchParam: {
        year: '',
        eduAttCd: null,
        safEduCourseNo: 0,
        plantCd: '',
        userId: '',
        userNm: '',
        deptCd: '',
        eduClassCd: '',
        eduNm: '',
      },
      gridOptions: {
        name: 'education',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      editable: true,
      eduAttCdSearchItems: [],
      eduCourseSearchItems: [],
      searchUrl: '',
      eduClassCdSearchItems: [],
    };
  },
  watch: {
    'searchParam.eduAttCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },
    'searchParam.eduClassCd': function (newValue, oldValue) {
      this.getEduCourseItems();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
    this.searchParam.year = this.$comm.getToday().substring(0, 4);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
    // window.addEventListener('resize', this.setGridSize);
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.setGridSize);
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '7%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000644'), 
          dataField: 'eduAttNm', 
          width: '7%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000659'), 
          dataField: 'eduClassNm', 
          width: '7%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000633'), 
          dataField: 'eduCourseNm', 
          width: '19%', 
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000042'), 
          dataField: 'month1Num', 
          width: '5%',           
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000043'), 
          dataField: 'month2Num', 
          width: '5%',           
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000044'), 
          dataField: 'month3Num', 
          width: '5%',           
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000045'), 
          dataField: 'month4Num', 
          width: '5%',           
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000046'), 
          dataField: 'month5Num', 
          width: '5%',           
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000047'), 
          dataField: 'month6Num', 
          width: '5%',           
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000048'), 
          dataField: 'month7Num', 
          width: '5%',           
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000049'), 
          dataField: 'month8Num', 
          width: '5%',           
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000050'), 
          dataField: 'month9Num', 
          width: '5%',           
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000051'), 
          dataField: 'month10Num', 
          width: '5%',           
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000052'), 
          dataField: 'month11Num', 
          width: '5%',           
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000053'), 
          dataField: 'month12Num', 
          width: '5%',         
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green',
          btnClicked: 'btnSearchClickedCallback'
        },
      ]
      this.searchUrl = selectConfig.saf.education.eduPersonStatus.list.url;

      setTimeout(() => {
        this.$comm.getComboItems('SAF_EDU_ATT', true).then((_result) => {
          this.eduAttCdSearchItems = _result;
        });
        this.$comm.getComboItems('SAF_EDU_COURSE', true).then((_result) => {
          this.eduClassCdSearchItems = _result;
        });
        this.getEduCourseItems();
      }, 200);

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();
      // this.setGridSize();
    },
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getEduCourseItems() {
      this.$http.url = selectConfig.saf.education.eduCourse.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        eduAttCd: this.searchParam.eduAttCd,
        plantCd: this.searchParam.plantCd,
        eduTypeCd: this.searchParam.eduClassCd,
      };
      this.$http.request(
        (_result) => {
          this.eduCourseSearchItems = this.$_.clone(_result.data);
          this.eduCourseSearchItems.splice(0, 0, {
            safEduCourseNo: 0,
            eduCourseNm:
              this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
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
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
          );
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 385;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },

    btnSearchClickedCallback(_result) {
      this.getList();
    },
    btnClickedErrorCallback(_result) {
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' /* 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요. */
      );
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001459'; /* 사용자검색 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.searchParam.userId = data.user.userId;
        this.searchParam.userNm = data.user.userNm;
      }
    },
    cellClickHandler(event) {
      if (event.dataField === 'plantNm') return;
      if (event.dataField === 'eduAttNm') return;
      if (event.dataField === 'eduClassNm') return;
      if (event.dataField === 'eduCourseNm') {
        this.popupOptions.target = () => import(`${'./eduListPopup.vue'}`);
        this.popupOptions.title = 'L0000000638'; /* 교육과정별 현황 목록 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          pYear: this.searchParam.year,
          plantCd: event.item.plantCd,
          eduAttCd: event.item.eduAttCd,
          eduClassCd: event.item.eduClassCd,
          safEduCourseNo: event.item.safEduCourseNo,
          processStepNm: 'SES03',
        };
        this.popupOptions.closeCallback = this.closePopup;
      } else {
        this.popupOptions.target = () => import(`${'./eduListPopup.vue'}`);
        this.popupOptions.title = 'L0000000638'; /* 교육과정별 현황 목록 */
        this.popupOptions.visible = true;
        this.popupOptions.width = '80%';
        this.popupOptions.top = '10px';
        this.popupOptions.param = {
          pYear: this.searchParam.year,
          pMonth: event.headerText.substr(0, 1),
          plantCd: event.item.plantCd,
          eduAttCd: event.item.eduAttCd,
          eduClassCd: event.item.eduClassCd,
          safEduCourseNo: event.item.safEduCourseNo,
          processStepNm: 'SES03',
        };
        this.popupOptions.closeCallback = this.closePopup;
      }
      
    },
    tableLinkClicked(header, data) {
      if (data === null) return;
      console.log('data');
      console.log(data);
      this.popupOptions.target = () => import(`${'./eduListPopup.vue'}`);
      this.popupOptions.title = 'L0000000638'; /* 교육과정별 현황 목록 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        pYear: this.searchParam.year,
        pMonth: header.month,
        plantCd: data.plantCd,
        eduAttCd: data.eduAttCd,
        eduClassCd: data.eduClassCd,
        safEduCourseNo: data.safEduCourseNo,
        processStepNm: 'SES03',
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
