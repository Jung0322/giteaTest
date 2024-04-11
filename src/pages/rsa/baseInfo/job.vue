<!--
  목적 : 위험성평가 > 기준정보 > 작업 관리
  작성자 : kga
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-dept
            type="search"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작업코드 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002423"
            name="jobCd"
            v-model="searchParam.jobCd"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 공정 -->
          <y-tree-process
            name="processCd"
            type="edit"
            :showDataMapping="true"
            v-model="searchParam.processCd"
          ></y-tree-process>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작업명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002389"
            name="jobNm"
            v-model="searchParam.jobNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- SOP번호 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000171"
            name="sopNo"
            v-model="searchParam.sopNo"
          ></y-text>
        </b-col>
        <b-col
          v-if="!popupParam.popupMode"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
        >
          <!-- 사용여부 -->
          <y-select
            :width="8"
            :comboItems="comboUseYnItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000001439"
            name="useYn"
            v-model="searchParam.useYn"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- SOP명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000170"
            name="sopNm"
            v-model="searchParam.sopNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             선택 
            <y-btn
              v-if="popupParam.popupMode && !popupParam.multiple && editable"
              title="L0000001561"
              color="orange"
              @btnClicked="btnAdd"
            />
             선택 
            <y-btn
              v-if="popupParam.popupMode && popupParam.multiple && editable"
              title="L0000001561"
              color="orange"
              @btnClicked="btnAddMultiple"
            />
             신규등록 
            <y-btn
              v-if="!popupParam.popupMode && editable"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getDataList"
            />
             닫기 
            <y-btn
              v-if="popupParam.popupMode"
              title="L0000000881"
              @btnClicked="btnClose"
            />
          </div>
          작업 목록
          <y-data-table
            ref="dataTable"
            label="L0000002360"
            :use-paging="true"
            :useRownum="popupParam.multiple ? false : true"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            @selectedRow="selectedRow"
            @rowDoubleClicked="rowDoubleClicked"
            @tableLinkClicked="tableLinkClicked"
            v-model="gridOptions.selectedValue"
          >
            <el-table-column
              v-if="popupParam.multiple"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002360')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @btnPopupClickedCallback="btnPopupClickedCallback"
          @getDataList="getDataList"
          @btnAdd="btnAdd"
          @selectedRow="selectedRow"
          @cellClick="cellClickHandler"
          @closePopup="btnClose"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'y-job',
  props: {
    popupParam: {
      type: Object,
      default: () => {
        return {
          popupMode: false,
          plantCd: null,
          deptCd: null,
          multiple: false,
          searchFlag: 'N',
        };
      },
    },
  },
  data() {
    return {
      tabItems: [
        { title: '상세정보', url: './jobDetail' }, // L0000003928
        { title: '작업단계', url: './jobStep' }, // L0000002375
        { title: '이력정보', url: './jobHistory' }, // L0000002208
      ],
      component: null,
      tabIndex: 0,
      searchParam: {
        deptCd: '',
        plantNm: '',
        deptNm: '',
        processCd: '',
        jobCd: '',
        jobNm: '',
        sopNo: '',
        sopNm: '',
        useYn: '',
        plantCd: '',
        searchFlag: 'N',
        deptSubYn: 'Y', // 하위부서여부 사용
      },
      gridOptions: {
        name: 'job',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
        selectedValue: [],
      },
      YAuiGrid: null,
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      plantNm: '',
      plantCd: '',
      deptCd: '',
      deptNm: '',
      processCd: '',
      processNm: '',
      jobId: 0,
      jobCd: '',
      jobNm: '',
      jobRevno: 0,
      comboUseYnItems: [], // 사용여부
      selectedJob: null,
      searchUrl: '',
    };
  },
  watch: {},
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
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      // URL 셋팅
      this.searchUrl = selectConfig.rsa.job.list.url;
      this.searchParam.deptSubYn = 'Y';

      this.editable = this.$route.meta.editable;

      if (this.popupParam.plantCd) {
        this.searchParam.plantCd = this.popupParam.plantCd;
      }
      if (this.popupParam.deptCd) {
        this.searchParam.deptCd = this.popupParam.deptCd;
      }
      if (this.popupParam.searchFlag) {
        this.searchParam.searchFlag = this.popupParam.searchFlag;
      }

      this.comboUseYnItems.push({
        code: '',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
      });
      this.comboUseYnItems.push({
        code: 'Y',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000001440'),
      });
      this.comboUseYnItems.push({
        code: 'N',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000001063'),
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getDataList(); // 작업 grid

      // 작업 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002423'),
          dataField: 'jobCd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'jobNm',
          width: '15%',
          style: 'left-align',
          renderer: {
            type: !this.popupParam.popupMode ? 'LinkRenderer' : '',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003091'),
          dataField: 'frequencyDesc',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000171'),
          dataField: 'sopNo',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000170'),
          dataField: 'sopNm',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000156'),
          dataField: 'jobRevno',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001439'),
          dataField: 'useYnNm',
          width: '7%',
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
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
          visible: !this.popupParam.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnAdd',
          visible: this.popupParam.popupMode,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closePopup',
          visible: this.popupParam.popupMode,
        },
      ];
    },
    // 작업 grid
    getDataList() {
      if (this.popupParam.popupMode) {
        this.searchParam.useYn = 'Y';
      }
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
    // 그리드 row click 이벤트
    selectedRow(data) {
      if (this.popupParam.popupMode) {
        if (this.popupParam.multiple) return;
        this.selectedJob = data;
      } else {
        this.plantCd = data.plantCd;
        this.plantNm = data.plantNm;
        this.deptCd = data.deptCd;
        this.deptNm = data.deptNm;
        this.processCd = data.processCd;
        this.processNm = data.processNm;
        this.jobId = data.jobId;
        this.jobCd = data.jobCd;
        this.jobNm = data.jobNm;
        this.jobRevno = data.jobRevno;
      }
    },
    rowDoubleClicked(data) {
      if (!this.popupParam.popupMode) return;
      if (this.popupParam.multiple) return;
      this.btnClose(data);
    },
    setJobId(data) {
      this.jobId = data;
    },
    btnAdd() {
      console.log(this.selectedJob);
      if (!this.selectedJob) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000655', // 작업을 선택하세요
          type: 'warning', // success / info / warning / error
        });
      } else {
        this.btnClose(this.selectedJob);
      }
    },
    btnAddMultiple() {
      if (
        !this.gridOptions.selectedValue ||
        (this.gridOptions.selectedValue &&
          this.gridOptions.selectedValue.length === 0)
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000655', // 작업을 선택하세요
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.btnClose({
        success: true,
        jobs: this.gridOptions.selectedValue,
      });
    },
    resizeGrid() {
      let _height = window.innerHeight - 415;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    btnClose(data) {
      this.$emit('closePopup', data);
    },
    /** /Button Event **/
    validateState(ref) {
      if (
        this.veeBag[ref] &&
        (this.veeBag[ref].dirty || this.veeBag[ref].validated)
      ) {
        return !this.errors.has(ref);
      }
      return null;
    },
    resetJob() {
      this.plantCd = '';
      this.plantNm = '';
      this.deptCd = '';
      this.deptNm = '';
      this.processCd = '';
      this.processNm = '';
      this.jobId = '';
      this.jobCd = '';
      this.jobNm = '';
      this.jobRevno = '';
    },

    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.dataField !== 'jobNm') return;
      if (this.popupParam.popupMode) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./jobDetail.vue'}`);
      this.popupOptions.title = 'L0000002362'; // 작업 상세 수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        jobId: event.item.jobId,
        readOnly: this.popupParam.popupMode ? true : false, // 검색 팝업용
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./jobDetail.vue'}`);
      this.popupOptions.title = 'L0000002362'; // 작업 상세 수정
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        jobId: data.jobId,
        readOnly: this.popupParam.popupMode ? true : false, // 검색 팝업용
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./jobDetail.vue'}`);
      this.popupOptions.title = 'L0000002361'; // 작업 상세 등록
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        ewtrDischNo: 0,
        jobId: 0,
        readOnly: false, // 검색 팝업용
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
  },
};
</script>
