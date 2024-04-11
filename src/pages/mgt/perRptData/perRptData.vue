<!--
  목적 : SHE경영 관리> 중처법 정기보고자료 관리
  Detail : 중처법 정기보고자료 관리 조회화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 년도 -->
          <y-datepicker
            :width="9"
            label="L0000000829"
            :range="true"
            type="year"
            name="year"
            :default="searchParam.year"
            v-model="searchParam.year"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 보고일자 -->
          <y-datepicker
            :width="9"
            :range="true"
            label="L0000005126"
            name="rptDt"
            default="searchParam.rptDt"
            v-model="searchParam.rptDt"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 주관부서 -->
          <y-tree-dept
            label="L0000005015"
            type="search"
            name="deptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>

        <b-col sm="4" md="4" lg="40" xl="4" class="col-xxl-4">
          <!-- 구분 -->
          <y-select
            :width="9"
            :comboItems="perClsItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000686"
            name="halfTypeCd"
            v-model="searchParam.halfTypeCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 보고명 -->
          <y-text
            :width="9"
            label="L0000005127"
            ui="bootstrap"
            name="rptNm"
            v-model="searchParam.rptNm"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 단계/상태 -->
          <b-row>
            <b-col sm="4">
              <y-label label="L0000005147" />
            </b-col>
            <b-col sm="4">
              <y-select
                :width="12"
                :disabled="true"
                :comboItems="procStepItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="procStepCd"
                v-model="searchParam.procStepCd"
              ></y-select>
            </b-col>
            <b-col sm="4">
              <y-select
                :width="12"
                :comboItems="stateItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="stepCd"
                v-model="searchParam.stepCd"
              ></y-select>
            </b-col>
          </b-row>
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
              @btnClicked="openPopup"
            />
             검색
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           중처법 정기보고자료 관리 
          <y-data-table
            class="mergeTable"
            label="L0000005142"
            ref="dataTable"
            :height="gridOptions.height"
            :spanOptions="gridOptions.merge"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            :rowClassName="tableRowClassName"
            :cellClassName="cellClassName"
            @tableLinkClicked="tableLinkClicked"
          />
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005142')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
          @getList="getList"
          @openNewPopup="openNewPopup"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'perRpt-data',
  props: {},
  data() {
    return {
      searchParam: {
        year: [], // 년도
        rptDt: [], // 보고일자
        plantCd: null,
        deptCd: null, // 주관부서
        halfTypeCd: null, // 구분
        rptNm: null, // 보고명
        procStepCd: 'MPRS2', // 단계 - 결과로 고정
        stepCd: null, // 상태
      },
      gridOptions: {
        name: 'perRptData',
        btns: [],
        header: [],
        data: [],
        height: '550',
        merge: [], // rowspan할 컬럼명 및 기준
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
      perClsItems: [], // 구분 selectbox 목록
      procStepItems: [], // 단계 selectbox 목록
      stateItems: [], // 상태 selectbox 목록
      companyEditable: false,
      plantEditable: false,
      deptEditable: false,
    };
  },

  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
  },

  methods: {
    tableRowClassName({ row, rowIndex }) {
      return 'odd-row';
    },
    cellClassName({ row, column, rowIndex, colIndex }) {
      // let className = '';
      if (column.property === 'year') {
        return 'mergeCol';
      }
    },
    init() {
      // URL 셋팅
      this.editable = this.$route.meta.editable;

      var from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-3m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '0m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );

      this.searchParam.rptDt = [from, to];

      // 년도 설정
      this.searchParam.year = [
        this.$comm.getThisYear(),
        this.$comm.getThisYear(),
      ];

      // 구분(상반기/하반기)
      this.$comm.getComboItems('MGT_HALF_TYPE', true).then((_result) => {
        this.perClsItems = this.$_.clone(_result);
      });

      // 단계
      this.$comm.getComboItems('MGT_PER_RPT_STEP', true).then((_result) => {
        this.procStepItems = this.$_.clone(_result);
      });

      this.$comm.getComboItems('GHG_STATUS', true).then((_result) => {
        this.stateItems = this.$_.clone(_result);
      });

      this.gridOptions.merge = [];

      this.gridOptions.merge = [
        { index: 1, field: 'year' }, // 년도
        // { index: 2, field: 'halfTypeCd' }, // 구분(상/하반기)
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      // 권한별 컨트롤 처리
      if (this.$comm.isCompanyGrp()) {
        // 전사권한
        this.companyEditable = true;
        this.plantEditable = true;
        this.deptEditable = true;
      } else if (this.$comm.isPlantGrp()) {
        // 사업장권한
        this.plantEditable = true;
        this.deptEditable = true;
      } // 일반권한
      else {
        this.searchParam.deptCd = this.$store.getters.deptCd;
        this.deptEditable = true;
      }

      // 그리드 header 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000829'),
          dataField: 'year',
          width: '11%',
          cellMerge: true,
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'halfTypeNm',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005126'),
          dataField: 'rptDt',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'),
          dataField: 'stepNm',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005127'),
          dataField: 'rptNm',
          width: '11%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005015'),
          dataField: 'deptNm',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005131'),
          dataField: 'rptData',
          width: '12%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerNm',
          width: '11%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writeDt',
          width: '11%',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openNewPopup',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];

      this.getList();
    },

    tableLinkClicked(header, data) {
      if (header.name === 'rptNm') {
        this.openPopup(data);
      } else if (header.name === 'rptData') {
        this.downloadrptDataFile(
          data,
          'PERRPT_DATA',
          '중처법 정기보고 자료',
          data.fileNo.split(',')
        );
      }
    },
    downloadrptDataFile(data, _taskClassNm, _taskLabel, files) {
      if (files.length === 1) {
        this.onDocumentDownload(data, _taskClassNm, _taskLabel);
      } else if (files.length > 1) {
        this.openrptFileView(data, _taskClassNm, _taskLabel);
      }
    },

    openrptFileView(data, _taskClassNm, _taskLabel) {
      this.popupOptions.target = () => import(`${'./rptDataFileView.vue'}`);
      this.popupOptions.title = '중처법 정기보고 자료';
      this.popupOptions.visible = true;
      this.popupOptions.width = '50%';
      this.popupOptions.param = {
        perRptDataNo: data ? data.perRptDataNo : 0,
        taskClassNm: _taskClassNm,
        taskLabel: _taskLabel,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    onDocumentDownload(_item, _taskClassNm, _taskLabel) {
      let thisVue = this;
      let accept = this.$comm.getAccept(_item.fileExt);
      let _comm = this.$comm;
      this.$http.url = selectConfig.attachFile.file64.url; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.param = {
        fileNo:
          _taskClassNm === 'PERRPT_DATA' ? _item.fileNo : _item.summaryFileNo, // 해당 컴포넌트는 공정안전자료에서 사용하지 않기 때문에 taskFlag는 주지 않는다. 210629 jkl
        taskFlag: '',
      };
      this.$http.request(
        (_result) => {
          let rptData =
            _taskClassNm === 'PERRPT_DATA'
              ? _item.rptData
              : _item.summaryFileOrgNm;
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, rptData);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = rptData;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'rptNm') {
        this.openPopup(event.item);
      } else if (event.dataField === 'rptData') {
        this.downloadrptDataFile(
          event.item,
          'PERRPT_DATA',
          '중처법 정기보고 자료',
          event.item.fileNo.split(',')
        );
      }
    },
    openNewPopup() {
      this.popupOptions.target = () => import(`${'./perRptDataDetail.vue'}`);
      this.popupOptions.title = 'L0000005142'; // 중처법 정기보고자료 상세
      this.popupOptions.param = { perRptDataNo: 0 };
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    openPopup(data) {
      this.popupOptions.target = () => import(`${'./perRptDataDetail.vue'}`);
      this.popupOptions.title = 'L0000005142'; // 중처법 정기보고자료 상세
      this.popupOptions.param = data ? data : { perRptDataNo: 0 };
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    getList() {
      this.$http.url = selectConfig.mgt.perRptData.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          if (this.companyEditable) {
            // 전사권한 : 전체 건
            this.YAuiGrid.setGridData(this.$_.clone(_result.data));
          } else if (this.plantEditable) {
            // 사업장권한 : 내 사업장 등록 건
            this.gridOptions.data = this.$_.clone(
              _result.data.filter(
                (v) => v.plantCd === this.$store.getters.plantCd
              )
            );
            this.YAuiGrid.setGridData(this.gridOptions.data);
          } else if (this.deptEditable) {
            // 일반권한 : 내 부서 등록 건 + 타 부서 평가완료 건
            this.gridOptions.data = this.$_.clone(
              _result.data.filter(
                (v) =>
                  v.deptCd === this.$store.getters.deptCd || v.stepCd === '0002'
              )
            );
            this.YAuiGrid.setGridData(this.gridOptions.data);
          }
          // 단계(상태) rowspan 기준 정보 추가
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR');
        }
      );
    },
  },
};
</script>
