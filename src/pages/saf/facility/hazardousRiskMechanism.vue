<!--
  목적 : 유해위험기계기구 목록
  Detail : 유해위험기계기구 검색 화면
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
          <b-row>
            <b-col sm="4">
              <!-- 차기검사일 -->
              <y-label label="L0000002793" />
            </b-col>
            <b-col sm="7" md="7" lg="7" xl="7" class="col-xxl-3">
              <y-datepicker
                :width="12"
                :range="true"
                label
                name="period"
                v-model="searchParam.period"
              ></y-datepicker>
            </b-col>
            <b-col sm="1" md="1" lg="1" xl="1">
              <y-checkbox
                :width="12"
                :comboItems="[{ text: '', value: 'Y' }]"
                ui="bootstrap"
                name="checkPeriodYn"
                :useDefault="true"
                v-model="checkPeriodYn"
              />
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 기계분류 -->
          <y-select
            :width="8"
            :comboItems="machineItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000772"
            name="machineTypeCd"
            v-model="searchParam.machineTypeCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 검사대상 -->
          <y-select
            :width="8"
            :comboItems="targetItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000310"
            name="inspYn"
            v-model="searchParam.inspYn"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- ITEM NO -->
          <y-text
            :width="8"
            ui="bootstrap"
            type="search"
            label="L0000000119"
            name="itemNo"
            v-model="searchParam.itemNo"
          ></y-text>
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
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getDataList"
            />
             <y-btn
              v-if="editable"
              :action-url="deleteUrl"
              :param="deleteValue"
              :is-submit="isDelete"
              title="삭제"
              color="red"
              action-type="DELETE"
              beforeSubmit="beforeDelete"
              @beforeDelete="beforeDelete"
              @btnClicked="btnDeleteClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
          </div>
           유해위험기계기구 목록 
          <y-data-table
            label="L0000002175"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            v-model="selectedValue"
            @tableLinkClicked="tableLinkClicked"
          >
             <el-table-column align="center" type="selection" slot="selection" width="55"></el-table-column> 
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002175')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @openPopup="openPopup"
          @getDataList="getDataList"
          @cellClick="cellClickHandler"
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
  name: 'hazardous-risk-mechanism',
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '', // 사업장
        machineTypeCd: '', // 기계분류
        inspYn: '', // 검사대상
        period: [],
        startDate: '', // from차기검사일
        endDate: '', // to차기검사일
        periodYn: 'N',
        itemNo: null,
      },
      gridOptions: {
        name: 'hazardousRiskMechanism',
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
      machineItems: [],
      targetItems: [],
      editable: false,
      searchUrl: '',
      deleteUrl: '',
      isDelete: false,
      selectedValue: [],
      deleteValue: null,
      selectStressPlan: null,
      checkPeriodYn: [],
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
    init() {
      this.editable = this.$route.meta.editable;
      // URL 셋팅
      this.searchUrl = selectConfig.saf.hazardousRiskMechanism.list.url;
      this.deleteUrl = transactionConfig.saf.hazardousRiskMechanism.delete.url;

      this.targetItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // '전체'
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000003427') }, // 대상
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000003686') }, // 미대상
      ];
      // 기계분류
      this.$comm.getComboItems('MACHINE_TYPE_CD', true).then((_result) => {
        this.machineItems = _result;
      });

      let today = this.$comm.getToday();
      let to = this.$comm.getCalculatedDate(
        today,
        '+6m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.period = [today, to];
      this.checkPeriodYn.push('Y');

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000772'), 
          dataField: 'machineTypeNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000310'), 
          dataField: 'inspTxt', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000119'), 
          dataField: 'itemNo', 
          width: '10%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002063'), 
          dataField: 'volume', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003232'), 
          dataField: 'licenseNumber', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002881'), 
          dataField: 'inspIssueDt', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002880'), 
          dataField: 'recentInspDt', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002794'), 
          dataField: 'nextIsnpDt', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000316'), 
          dataField: 'inspCycleNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001902'), 
          dataField: 'alarmNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000312'), 
          dataField: 'inspFee', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001360'), 
          dataField: 'remark', 
          width: '10%', 
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001034'),
          color: 'orange',
          btnClicked: 'openPopup',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',
        },
      ]
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getDataList();
    },
    // 검진 계획 그리드
    getDataList() {
      if (this.checkPeriodYn != null) {
        this.searchParam.periodYn = this.checkPeriodYn[0] === 'Y' ? 'Y' : 'N';
      }
      this.searchParam.startDate = this.$_.clone(this.searchParam.period[0]);
      this.searchParam.endDate = this.$_.clone(this.searchParam.period[1]);
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data.safCheckMachines);
          this.gridOptions.data = _result.data.safCheckMachines;
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField !== 'itemNo') return;
      this.openPopup(event.item);
    },
    tableLinkClicked(header, data) {
      if (data === null || data === undefined) return;
      this.openPopup(data);
    },
    /**
     * 등록 팝업  호출
     */
    resizeGrid() {
      let _height = window.innerHeight - 335;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    /**
     * 등록 팝업  호출
     */
    openPopup(data) {
      this.popupOptions.target = () =>
        import(`${'./hazardousRiskMechanismDetail.vue'}`);
      this.popupOptions.title = data
        ? 'L0000002176' // 유해위험기계기구 상세
        : 'L0000002174'; // 유해위험기계기구 등록
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        checkMachineNo: data ? data.checkMachineNo : 0,
      };
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      this.isDelete = false;
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    beforeDelete() {
      if (!this.selectedValue || this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // 안내
          message: 'M0000000057', // 삭제할 항목을 선택해주세요.
          type: 'warning',
        });
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // 확인
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.deleteValue = {
            data: Object.values(this.$_.clone(this.selectedValue)),
          };
          this.isDelete = true;
        },
      });
    },
    // 삭제
    btnDeleteClickedCallback(_result) {
      this.getDataList();
      this.isDelete = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
    },
    /** /Button Event **/
  },
};
</script>
