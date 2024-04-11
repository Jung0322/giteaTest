\
<!--
  목적 : 이력조회
  Detail : kckim
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="infirmaryGridOptions" @enter="btnSearchClicked">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 상담기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000001518"
            name="duration"
            v-model="searchParam.duration"
          ></y-datepicker>
        </b-col>
        <b-col
          v-if="isHealthManager"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
        >
          <y-tree-dept
            type="search"
            name="deptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
          />
        </b-col>
        <b-col
          v-if="isHealthManager"
          sm="6"
          md="6"
          lg="6"
          xl="6"
          class="col-xxl-3"
        >
          <!-- 성명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001630"
            name="userNm"
            :clearable="true"
            :readonly="true"
            v-model="searchParam.userNm"
            :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
            @searchUser="btnSearchUserClicked"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <b-row class="mt-3">
      <b-col sm="12">
        <!-- <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            - 삭제 
            <y-btn
              v-if="editable && isHealthManager"
              :action-url="deleteUrl"
              :param="deleteValue"
              :is-submit="isDeleteSubmit"
              title="L0000001495"
              color="red"
              action-type="delete"
              beforeSubmit="beforeDelete"
              @beforeDelete="beforeDelete"
              @btnClicked="btnDeleteClickedCallback"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
            - 신규등록 
            <y-btn
              v-if="editable && isHealthManager"
              title="L0000001789"
              color="orange"
              @btnClicked="btnPopupClickedCallback"
            />
            검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClicked"
            />
          </div>
          - 상담이력 목록 
          <y-data-table
            label="L0000001521"
            ref="dataTable"
            :height="infirmaryGridOptions.height"
            :headers="infirmaryGridOptions.header"
            :items="infirmaryGridOptions.data"
            :use-paging="true"
            v-model="selectedValue"
            @tableLinkClicked="tableLinkClicked"
          >
            <el-table-column
              type="selection"
              slot="selection"
              width="55"
            ></el-table-column>
          </y-data-table>
        </b-col>
      </b-col> -->
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="yAuiGrid"
            :name="infirmaryGridOptions.name"
            :headers="infirmaryGridOptions.header"
            :btns="infirmaryGridOptions.btns"
            :height="infirmaryGridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000001521')"
            :useExcelExport="false"
            :enableCellMerge="true"
            :enableSorting="true"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :showRowCheckColumn="true"
            @btnSearchClicked="btnSearchClicked"
            @btnRowDelClicked="btnRowDelClicked"
            @btnPopupClickedCallback="btnPopupClickedCallback"
            @cellClick="cellClickHandler"
          />
        </b-col>
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col sm="12">
        <!-- <b-col sm="12" class="px-0">
          - 검진이력 목록 
          <y-data-table
            label="L0000000370"
            ref="dataTable"
            :height="checkupGridOptions.height"
            :headers="checkupGridOptions.header"
            :items="checkupGridOptions.data"
            :use-paging="true"
          ></y-data-table>
        </b-col> -->
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="auiGrid"
            :name="checkupGridOptions.name"
            :headers="checkupGridOptions.header"
            :btns="checkupGridOptions.btns"
            :height="checkupGridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000000370')"
            :useExcelExport="false"
            :enableCellMerge="true"
            :enableSorting="true"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :showRowCheckColumn="true"
          />
        </b-col>
      </b-col>
    </b-row>
    <!-- 아래 그리드 강제 설정을 위해 y-search-box 생성 -->
    <y-search-box
      :gridOptions="checkupGridOptions"
      v-show="false"
    ></y-search-box>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'history-search',
  components: {},
  props: {},
  data: function () {
    return {
      // tabItems: [
      //   { title: '방문이력', url: './infirmaryUsageHistory' },
      //   { title: '검진이력', url: './checkupHistory' },
      // ],
      component: null,
      editable: true,
      searchParam: {
        plantCd: '',
        deptCd: '',
        userNm: '',
        duration: [],
        heaCheckedPeriod: [],
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '70%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      infirmaryGridOptions: {
        name: 'historySearch',
        btns: [],
        header: [],
        data: [],
        height: '400',
      },
      checkupGridOptions: {
        name: 'historySearch2',
        header: [],
        data: [],
        height: '300',
      },
      YAuiGrid: null,
      AuiGrid: null,
      deleteUrl: '',
      infiramrySearchUrl: '',
      checkupSearchUrl: '',
      isHealthManager: false,
      selectedValue: [],
      deleteValue: null,
      isDeleteSubmit: false,
    };
  },
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    let userAuthGrps = this.$store.getters.userAuthGrps;
    this.$_.forEach(userAuthGrps, (item) => {
      if (
        this.$_.indexOf(['2', '1022', '1090'], item.authGrpNo) > -1 &&
        item.settingYn === 'Y'
      ) {
        this.isHealthManager = true;
      }
    });
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.AuiGrid = this.$refs.auiGrid;
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      // 방문이력 헤더
      this.infirmaryGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'userNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001517'),
          dataField: 'counselTypeNm',
          width: '10%',
        },
        {
          headerText: '상담일',
          dataField: 'visitYmd',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002745'),
          dataField: 'symptom',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001519'),
          dataField: 'consult',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001516'),
          dataField: 'remark',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        },
      ];

      // 검진이력 헤더
      this.checkupGridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'userNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000372'),
          dataField: 'heaCheckedYmd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000373'),
          dataField: 'heaCheckupClassNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000357'),
          dataField: 'heaCheckupOrgNm',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001949'),
          dataField: 'heaWorkableNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001493'),
          dataField: 'heaFollowUpNm',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002708'),
          dataField: 'overallOpinion',
          width: '10%',
          style: 'left-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '10%',
        },
      ];

      this.infirmaryGridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnRowDelClicked',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
          visible: true,
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClicked',
        },
      ];
      this.infirmarySearchUrl = selectConfig.hea.infirmaryUsageHistory.list.url;
      this.checkupSearchUrl = selectConfig.hea.checkupHistory.list.url;
      this.deleteUrl = transactionConfig.hea.consult.delete.url;
      this.searchParam.duration = [];
      this.searchParam.duration.push(
        this.$comm.getCalculatedDate(
          this.$comm.getToday(),
          '-1m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        )
      );
      this.searchParam.duration.push(this.$comm.moment().format('YYYY-MM-DD'));

      if (!this.isHealthManager) {
        this.searchParam.userNm = this.$store.getters.name;
        this.getInfirmaryDataList();
        this.getCheckupDataList();
      }
    },
    getInfirmaryDataList() {
      this.$http.url = this.infirmarySearchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.infirmaryGridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getCheckupDataList() {
      this.searchParam.heaCheckedPeriod = this.$_.clone(
        this.searchParam.duration
      );
      this.$http.url = this.checkupSearchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (Result) => {
          // this.checkupGridOptions.data = Result.data;
          this.AuiGrid.setGridData(Result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit(
            'APP_REQUEST_ERROR',
            'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
          );
        }
      );
    },
    btnRowDelClicked() {
      let checkingData = this.YAuiGrid.getCheckedRowItemsAll();
      if (checkingData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000444', // 건강관리실 상담 항목을 선택해주세요.
          type: 'warning',
        });
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.deleteValue = {
            data: Object.values(this.$_.clone(checkingData)),
          };
          this.$http.url = this.deleteUrl;
          this.$http.type = 'DELETE';
          this.$http.param = this.deleteValue;
          this.$http.request(
            (_result) => {
              this.getInfirmaryDataList();
              this.getCheckupDataList();
              window.getApp.$emit('ALERT', {
                title: 'L0000003395', // '안내',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success',
              });
            },
            (_error) => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
          this.isDeleteSubmit = true;
        },
      });
    },
    beforeDelete() {
      if (this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000444', // 건강관리실 상담 항목을 선택해주세요.
          type: 'warning',
        });
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        confirmCallback: () => {
          this.deleteValue = {
            data: Object.values(this.$_.clone(this.selectedValue)),
          };
          this.isDeleteSubmit = true;
        },
      });
    },

    /** Button Event **/
    btnSearchClicked() {
      this.getInfirmaryDataList();
      this.getCheckupDataList();
    },

    btnDeleteClickedCallback(_result) {
      this.getInfirmaryDataList();
      this.getCheckupDataList();
      this.isDeleteSubmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
    },
    btnClickedErrorCallback(_result) {
      this.isDeleteSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);

      this.popupOptions.param = {
        plantCd: this.searchParam.plantCd,
        deptCd: this.searchParam.deptCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.searchParam.userNm = data.user.userNm;
      }
    },

    btnPopupClickedCallback() {
      this.popupOptions.target = () =>
        import(`${'./createGeneralBusiness.vue'}`);
      this.popupOptions.title = 'L0000001515'; // 상담 등록
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        heaConsultNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getInfirmaryDataList();
      this.getCheckupDataList();
    },
    cellClickHandler(event) {
      if (event.dataField !== 'visitYmd') return;
      this.popupOptions.target = () =>
        import(`${'./createGeneralBusiness.vue'}`);
      this.popupOptions.title = 'L0000004696'; // 상담 상세
      this.popupOptions.param = {
        heaConsultNo: event.item.heaConsultNo,
      };
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    tableLinkClicked(header, data) {
      if (data === null) return;

      this.popupOptions.target = () =>
        import(`${'./createGeneralBusiness.vue'}`);
      this.popupOptions.title = 'L0000004696'; // 상담 상세
      this.popupOptions.param = {
        heaConsultNo: data.heaConsultNo,
      };
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
  },
};
</script>
