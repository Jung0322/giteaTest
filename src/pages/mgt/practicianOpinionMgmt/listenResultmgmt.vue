<!--
  목적 : SHE경영 관리 > 종사자의견 관리 > 종사자의견청취 결과 관리
  Detail : 종사자의견청취 결과 관리 등록/조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getDataList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 대상년도 -->
          <y-datepicker
            :width="8"
            :range="true"
            type="year"
            label="L0000004449"
            name="year"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
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
                :comboItems="progressStepItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
              ></y-select>
            </b-col>
            <b-col sm="4">
              <y-select
                :width="12"
                :comboItems="stateItems"
                itemText="codeNm"
                itemValue="code"
                ui="bootstrap"
                name="stateCd"
                v-model="searchParam.stateCd"
              ></y-select>
            </b-col>
          </b-row>
        </b-col>

        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 채널 -->
          <y-select
            :width="8"
            :comboItems="cmiClsCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000005063"
            name="cmiClsCd"
            v-model="searchParam.cmiClsCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 구분 -->
          <y-select
            :width="8"
            :comboItems="halfTypeCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000686"
            name="halfTypeCd"
            v-model="searchParam.halfTypeCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 제목 -->
          <y-text
            :width="8"
            label="L0000002616"
            name="confNm"
            v-model="searchParam.confNm"
          />
        </b-col>
        <!-- 개선조치 기한초과 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <b-row>
            <b-col sm="7">
              <y-checkbox
                :width="5"
                :comboItems="[
                  { text: '', value: 'Y' },
                  { text: '', value: 'N' },
                ]"
                ui="bootstrap"
                name="searchParam.imprChk"
                :useDefault="true"
                label="L0000004983"
                v-model="searchParam.imprChk"
              />
            </b-col>
          </b-row>
        </b-col>
        <!-- 주간부서 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-tree-dept
            type="search"
            label="L0000005015"
            name="mainDeptCd"
            v-model="searchParam.mainDeptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
      </b-row>
    </y-search-box>

    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000005082')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @cellClick="cellClickHandler"
          @getDataList="getDataList"
          @btnResultClicked="btnResultClicked"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>
<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'industrial-safety-health-committee',
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '',
        startDt: '',
        endDt: '',
        cmiClsCd: '',
        confNm: '',
        period: '',
        stateCd: '', // 상태
        apprStatusCd: null,
        mainDeptCd: '',
        deptSubYn: 'Y', // 하위부서여부 사용
        halfTypeCd: null,
        progressStepCd2: '',
        progressStepCd: '',
        imprChk: 'N',
      },
      gridOptions: {
        name: 'listenResultmgmt',
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
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      searchUrl: '',
      cmiClsCdItems: [],
      apprStatusItems: [],
      halfTypeCdItems: [], // 상/하반기
      progressStepItems: [{ code: null, codeNm: '결과' }], // 단계
      period: [],
      stateItems: [], // 상태
      companyEditable: false, // 전사 권한
      plantEditable: false, // 사업장 권한
      deptEditable: false, // 일반 권한
    };
  },
  watch: {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    window.addEventListener('resize', this.resizeGrid);
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    tableCellClassName({ row, column, rowIndex, colIndex }) {
      if (column.property === 'overdueCnt' && row['overdueCnt'] !== '0') {
        return 'row-color';
      }
    },
    init() {
      // URL 셋팅
      this.searchUrl =
        selectConfig.mgt.industrialSafetyHealthCommittee.list.url;

      this.editable = this.$route.meta.editable;
      this.searchParam.progressStepCd = 'CMS03';
      this.searchParam.period = [
        this.$comm.getThisYear(),
        this.$comm.getThisYear(),
      ];
      // 채널
      this.$comm.getComboItems('MGT_CMI_CLS', true).then((_result) => {
        this.cmiClsCdItems = _result;
      });
      // 상/하반기
      this.$comm.getComboItems('MGT_HALF_TYPE', true).then((_result) => {
        this.halfTypeCdItems = _result;
      });
      // 상태
      this.$comm.getComboItems('COM_STATE', true).then((_result) => {
        this.stateItems = _result.filter((v) => v.code !== 'STATE1');
      });

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
        this.deptEditable = true;
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '6%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004449'),
          dataField: 'year',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005063'),
          dataField: 'cmiClsNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'),
          dataField: 'halfTypeNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002268'),
          dataField: 'confDate',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002616'),
          dataField: 'confNm',
          width: '20%',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005015'),
          dataField: 'mainDeptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002451'),
          dataField: 'confPlace',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'),
          dataField: 'stateNm',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
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
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000264'),
          dataField: 'requestCnt',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005012'),
          dataField: 'incompletCnt',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005013'),
          dataField: 'overdueCnt',
          width: '10%',
          styleFunction: (
            rowIndex,
            columnIndex,
            value,
            headerText,
            item,
            dataField
          ) => {
            if (value !== '0') {
              return 'row-color';
            }
            return 'row-color2';
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002683'),
          dataField: 'completCnt',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnResultClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',
        },
      ];
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getDataList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 375;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    getDataList() {
      this.searchParam.startDt = this.searchParam.period[0];
      this.searchParam.endDt = this.searchParam.period[1];
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          if (this.companyEditable) {
            // 전사권한 : 전체 건
            // this.gridOptions.data = this.$_.clone(_result.data);
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
                  v.mainDeptCd === this.$store.getters.deptCd ||
                  v.stateCd === 'STATE4'
              )
            );
            this.YAuiGrid.setGridData(this.gridOptions.data);
          }

          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'stateNm') {
        this.showApprProgressPopup(event.item);
      } else if (
        event.dataField === 'requestCnt' ||
        event.dataField === 'incompletCnt' ||
        event.dataField === 'overdueCnt' ||
        event.dataField === 'completCnt'
      ) {
        event.item.apprFlag = event.dataField;
        this.openImprPopup(event.item);
      } else {
        if (event.dataField !== 'confNm') return;
        this.openPopup(event.item, null);
      }
    },
    // 결재진행상태 조회
    showApprProgressPopup(data) {
      this.popupOptions.target = () => import('@/pages/appr/apprProgressPopup');
      this.popupOptions.title = 'L0000000452'; // 결재진행상태
      this.popupOptions.param = {
        apprRqstNo: data.apprRqstNo, // 결재번호
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    btnResultClicked() {
      this.openPopup(null);
    },
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./listenResultmgmtDetail.vue'}`);
      this.popupOptions.title =
        'L0000005084'; /* 종사자의견청취 결과 관리 등록/수정 */
      this.popupOptions.visible = true;
      this.popupOptions.width = '90%';
      this.popupOptions.param = {
        committeeConfNo: data ? data.committeeConfNo : 0,
        progressStepCd: 'CMS03',
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    openImprPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./listenResultImprPopup.vue'}`);
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.title = 'L0000005000'; // '개선사항 목록';
      this.popupOptions.param = {
        imprClassCd: 'ICL13',
        committeeConfNo: data.committeeConfNo,
        apprFlag: data.apprFlag,
        refTableId: data.committeeConfNo,
      };

      this.popupOptions.closeCallback = this.closePopup;
    },
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
  },
};
</script>
<style>
.row-color {
  color: red !important;
}
.row-color2 {
  color: #0a85e7 !important;
}
</style>
