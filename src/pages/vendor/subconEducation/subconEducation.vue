<!--
  목적 : 협력업체 포탈 > 교육현황 
  작성자 : kyk
  Detail : 교육현황 
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 교육기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000641"
            name="searchPeriod"
            :default="searchParam.searchPeriod"
            v-model="searchParam.searchPeriod"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 교육분류 -->
          <y-select
            :width="8"
            :comboItems="eduAttCdSearchItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000659"
            name="eduAttCd"
            v-model="searchParam.eduAttCd"
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
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 협력업체 -->
          <y-text
            :width="8"
            :readonly="true"
            ui="bootstrap"
            name="vendorNm"
            label="L0000003246"
            v-model="searchParam.vendorNm"
            :appendIcon="[{ 'icon': 'search', callbackName: 'searchVendorMaster' }]"
            @searchVendorMaster="btnSearchVendorClicked"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 성명 -->
          <y-text
            :width="8"
            :clearable="true"
            ui="bootstrap"
            name="workerNm"
            label="L0000001630"
            v-model="searchParam.workerNm"
          />
        </b-col>
      </b-row>
    </y-search-box>
    <!-- <b-row ref="searchBox">
      <b-col v-if="searchArea.show" sm="12">
        <b-card header-class="default-card" body-class="default-body-card" class="py-0">
          <div slot="header">
            <div class="float-left">
              <y-label label="검색" />
            </div>
          </div>
          <b-row v-on:keyup.enter="btnSearchClickedCallback">
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-plant type="search" v-model="searchParam.plantCd" />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-datepicker
                :width="8"
                :range="true"
                label="교육기간"
                name="searchPeriod"
                :default="searchParam.searchPeriod"
                v-model="searchParam.searchPeriod"
              />
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="eduAttCdSearchItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                label="교육분류"
                name="eduAttCd"
                v-model="searchParam.eduAttCd"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-select
                :width="8"
                :comboItems="eduCourseSearchItems"
                itemText="eduCourseNm"
                itemValue="safEduCourseNo"
                ui="bootstrap"
                type="edit"
                label="교육과정"
                name="safEduCourseNo"
                v-model="searchParam.safEduCourseNo"
              ></y-select>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :readonly="true"
                ui="bootstrap"
                name="vendorNm"
                label="협력업체"
                v-model="searchParam.vendorNm"
                :appendIcon="[{ 'icon': 'search', callbackName: 'searchVendorMaster' }]"
                @searchVendorMaster="btnSearchVendorClicked"
              ></y-text>
            </b-col>
            <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
              <y-text
                :width="8"
                :clearable="true"
                ui="bootstrap"
                name="workerNm"
                label="성명"
                v-model="searchParam.workerNm"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>-->

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
           협력업체 교육현황 
          <y-data-table
            label="L0000003249"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            excelDown="true"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000003249')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @btnSearchClickedCallback="btnSearchClickedCallback"
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
  name: 'y-subcon-education',
  data() {
    return {
      searchArea: {
        title: 'L0000000329', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        plantCd: '',
        eduAttCd: null,
        safEduCourseNo: 0,
        startDate: '',
        endDate: '',
        vendorNm: '',
        vendorCd: '',
        workerNm: '',
        searchPeriod: [],
      },
      gridOptions: {
        name: 'subconEducation',
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
        param: {},
        width: '80%',
        top: '10px',
        closeCallback: null,
      },
      editable: false,
      searchUrl: '',
      eduAttCdSearchItems: [],
      eduCourseSearchItems: [],
    };
  },
  watch: {
    'searchParam.eduAttCd'() {
      this.getEduCourseItems();
    },
    'searchParam.plantCd'() {
      this.getEduCourseItems();
    },
    'searchParam.vendorNm'() {
      if (
        this.searchParam.vendorNm === '' ||
        this.searchParam.vendorNm === null
      ) {
        this.searchParam.vendorCd = '';
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      this.searchUrl = selectConfig.vendor.education.list.url;

      this.searchParam.searchPeriod = [
        this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '-3m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        ),
        this.$comm.moment(this.$comm.getToday()).format('YYYY-MM-DD'),
      ];

      // 선택항목 설정
      this.getEduAttCdItems();
      // this.getEduCourseItems();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000661'), 
          dataField: 'eduSYmd', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000673'), 
          dataField: 'eduEYmd', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000659'), 
          dataField: 'eduAttNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000633'), 
          dataField: 'eduCourseNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000639'), 
          dataField: 'eduTypeNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000653'), 
          dataField: 'eduNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003246'), 
          dataField: 'vendorNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'), 
          dataField: 'workerNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000890'), 
          dataField: 'deptNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'), 
          dataField: 'writerUserNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'), 
          dataField: 'writerDt', 
          width: '10%',           
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'), 
          color: 'green',
          btnClicked: 'btnSearchClickedCallback'
        },
      ]
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDataList();
    },
    // 업체 grid
    getDataList() {
      this.searchParam.startDate = this.$_.clone(
        this.searchParam.searchPeriod[0]
      );
      this.searchParam.endDate = this.$_.clone(
        this.searchParam.searchPeriod[1]
      );

      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data))
          this.$comm.pushCookie(this.searchParam);
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
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
          this.eduAttCdSearchItems.splice(0, 0, { code: null, codeNm: '전체' });
        },
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // '오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 395;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    getEduCourseItems() {
      this.$http.url = selectConfig.saf.education.eduCourse.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
        eduAttCd: this.searchParam.eduAttCd,
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        _result => {
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
        _error => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // '오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.'
          );
        }
      );
    },
    /** Button Event **/

    // 검색
    btnSearchClickedCallback(_result) {
      this.getDataList();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },

    btnSearchVendorClicked() {
      this.popupOptions.target = () =>
        import(`${'../baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003848'; // 협력업체검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.param = {
        popupMode: true,
      };
      this.popupOptions.closeCallback = this.closePopupSearchVendor;
    },
    closePopupSearchVendor(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data) {
        this.searchParam.vendorCd = data.data.vendorCd;
        this.searchParam.vendorNm = data.data.vendorNm;
      }
    },
  },
};
</script>