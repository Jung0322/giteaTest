\
<!--
  목적 : 건강관리실 - 유소견자 건강상담
  Detail :
  examples:
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClicked">
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
        </b-col>
        <b-col v-if="isHealthNm" sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 유소견자 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            label="L0000002158"
            name="userNm"
            v-model="searchParam.userNm"
            :disabled="true"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchUser' },
            ]"
            @searchUser="btnSearchUserClicked"
            @clear="clear"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 년도 -->
          <y-datepicker
            :width="baseWidth"
            :range="true"
            type="year"
            label="L0000000829"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 유소견자 여부 -->
          <y-select
            :width="8"
            :comboItems="suspectYnItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002159"
            name="suspectYn"
            v-model="searchParam.suspectYn"
          ></y-select>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 관리대상 유소견자 목록 -->
    <b-row>
      <b-col sm="12">
        <!-- <b-col sm="12" class="px-0 mt-3">
          <div class="float-right mb-1">
             관리대상 지정 및 해제 
            <y-btn
              v-if="editable"
              title="L0000000584"
              color="blue"
              @btnClicked="suspectPopupClickedCallback"
            />
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="btnSearchClicked" />
          </div>
           관리대상 유소견자 목록 
          <y-data-table
            title="L0000000579"
            label="L0000000579"
            ref="dataTable"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :height="gridOptions.height"
            :smPageSizes="true"
            :use-paging="true"
            @selectedRow="suspectSelectedRow"
          ></y-data-table>
        </b-col> -->
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000000579')"
            :useExcelExport="false"
            :enableCellMerge="true"
            :enableSorting="true"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            @selectedRow="suspectSelectedRow"
            @btnSearchClicked="btnSearchClicked"
            @suspectPopupClickedCallback="suspectPopupClickedCallback"
          />
        </b-col>
        <b-col sm="12" class="h100p">
          <y-auigrid
            ref="auiGrid"
            :name="gridOptions2.name"
            :headers="gridOptions2.header"
            :btns="gridOptions2.btns"
            :height="gridOptions2.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000000300')"
            :useExcelExport="false"
            :enableCellMerge="true"
            :enableSorting="true"
            :showGridSetSave="true"
            :useContextMenu="true"
            :enableRightDownFocus="true"
            :showGridCtrl="true"
            :showRowCheckColumn="true"
            @btnDelRowClicked="btnDelRowClicked"
            @consultPopupClickedCallback="consultPopupClickedCallback"
            @cellClick="cellclickHandler"
          />
        </b-col>
        <!-- 건강상담 목록 -->
        <!-- <b-col sm="12" class="px-0 mt-3">
          <div class="float-right mb-1">
             삭제 
            <y-btn
              v-if="editable && deleteMode"
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
             신규등록
            <y-btn
              v-if="editable && deleteMode"
              title="L0000001789"
              color="orange"
              @btnClicked="consultPopupClickedCallback"
            />
          </div>
           건강상담 목록 
          <y-data-table
            title="L0000000300"
            label="L0000000300"
            ref="dataTable2"
            :headers="gridOptions2.header"
            :items="gridOptions2.data"
            :height="gridOptions2.height"
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
        </b-col> -->
      </b-col>
    </b-row>
    <!-- 아래 그리드 강제 설정을 위해 y-search-box 생성 -->
    <y-search-box :gridOptions="gridOptions2" v-show="false"></y-search-box>

    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'suspect-user',
  props: {},
  data() {
    return {
      searchParam: {
        plantCd: '',
        deptCd: '',
        userId: '',
        userNm: '',
        period: [],
        startYear: null,
        endYear: null,
        suspectYn: 'Y',
        counselTypeCd: 'HCT02', // 사후관리
        deptSubYn: 'Y', // 하위부서여부 사용
      },
      consult: {
        visitYmd: '',
        userId: '',
        diseasePast: '',
        diseaseCurr: '',
        symptom: '',
        remark: '',
        deptCd: '',
        userNm: '',
        heaConsultNo: '',
        counselor: '',
        createUserId: '',
        updateUserId: '',
      },
      deleteRows: [],
      static: {
        userId: '',
        userNm: '',
        deptCd: '',
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
      isDeleteSubmit: false,
      isInsertSubmit: false,
      isEditSubmit: false,
      baseWidth: 8,
      editable: true,
      updateMode: false,
      deleteMode: false,
      searchUrl: '',
      deleteUrl: '',
      gridOptions: {
        name: 'suspectUser',
        btns: [],
        header: [],
        data: [],
        height: '200',
      },
      YAuiGrid: null,
      AuiGrid: null,
      gridOptions2: {
        name: 'suspectUser2',
        btns: [],
        header: [],
        data: [],
        height: '300',
      },
      selectedValue: [],
      deleteValue: null,
      today: '',
      tempYmd: '',
      counselTypeCdItems: [],
      suspectYnItems: [],
      isHealthNm: false,
    };
  },
  watch: {
    'consult.visitYmd': function (newValue, oldValue) {
      if (
        newValue < this.today &&
        this.tempYmd !== newValue &&
        newValue !== ''
      ) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000442', // 과거 날짜를 선택하였습니다.
          type: 'warning',
        });
        this.tempYmd = this.today;
      }
    },
    'testItemResult.heaTestItemCd': function (newValue, oldValue) {
      this.getTestItem();
    },
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.AuiGrid = this.$refs.auiGrid;
  },
  beforeDestroy() {},
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;
      let userAuthGrps = this.$store.getters.userAuthGrps;
      this.searchParam.deptSubYn = 'Y';

      this.$_.forEach(userAuthGrps, (item) => {
        if (
          (item.authGrpNo === '1090' && item.settingYn === 'Y') ||
          (item.authGrpNo === '1022' && item.settingYn === 'Y')
        ) {
          this.isHealthNm = true;
        }
      });
      if (!this.isHealthNm) {
        this.searchParam.userId = this.$store.getters.token;
        this.searchParam.userNm = this.$store.getters.name;
      }

      this.searchParam.period = [];
      this.searchParam.period.push(this.$comm.moment().format('YYYY'));
      this.searchParam.period.push(this.$comm.moment().format('YYYY'));

      this.suspectYnItems = [
        { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }, // 전체
        { code: 'Y', codeNm: this.$comm.getLangSpecInfoLabel('L0000004862') }, // 지정자 // Y
        { code: 'N', codeNm: this.$comm.getLangSpecInfoLabel('L0000004863') }, // 해제자 // N
      ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
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
          headerText: this.$comm.getLangSpecInfoLabel('L0000002161'),
          dataField: 'userNm',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002162'),
          dataField: 'suspectYn',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000585'),
          dataField: 'beManagedYmd',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000587'),
          dataField: 'notManagedYmd',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002764'),
          dataField: 'remark',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003218'),
          dataField: 'notRemark',
          width: '10%',
        },
      ];
      this.gridOptions2.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001523'),
          dataField: 'visitYmd',
          width: '15%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001517'),
          dataField: 'counselTypeNm',
          width: '15%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000559'),
          dataField: 'diseasePast',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003239'),
          dataField: 'diseaseCurr',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002745'),
          dataField: 'symptom',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001519'),
          dataField: 'consult',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001516'),
          dataField: 'remark',
          width: '10%',
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

      this.gridOptions.btns = [
        // {
        //   title: this.$comm.getLangSpecInfoLabel('L0000000584'),
        //   color: 'blue',
        //   btnClicked: 'suspectPopupClickedCallback'
        // },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClicked',
        },
      ];

      this.gridOptions2.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelRowClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'consultPopupClickedCallback',
        },
      ];
      // 오늘 날짜 구하기
      this.today = this.$comm.getToday();

      this.searchUrl = selectConfig.hea.suspectUser.list.url;
      this.deleteUrl = transactionConfig.hea.consult.delete.url;

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.getSuspectUsers();
    },
    /** /초기화 관련 함수 **/
    getSuspectUsers() {
      this.searchParam.startYear = this.searchParam.period[0];
      this.searchParam.endYear = this.searchParam.period[1];
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
          this.gridOptions2.data = [];

          this.deleteMode = false;
          /**
           * 22.01.03 lhj
           * 데이터 조회 후 default로 최상단 데이터 선택하여 하단의 상담기록 조회되도록 수정 (highlight 처리)
           */
          // if (this.gridOptions.data && this.gridOptions.data.length > 0) {
          //   this.$refs.dataTable.setCurrentRow(this.gridOptions.data[0]);
          //   this.btnSearchConsults(this.gridOptions.data[0]);
          // }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    getConsults(data) {
      this.$http.url = selectConfig.hea.consult.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        userId: data.userId,
      };
      this.$http.request(
        (_result) => {
          // this.gridOptions2.data = _result.data;
          this.AuiGrid.setGridData(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );

      this.consult.userId = data.userId;
      this.consult.userNm = data.userNm;
      this.consult.deptCd = data.deptCd;
      this.static.userId = data.userId;
      this.static.userNm = data.userNm;
      this.static.deptCd = data.deptCd;

      this.consult.visitYmd = this.$comm.getToday();
      this.deleteMode = true;

      this.tempYmd = this.today;
    },
    getConsult(data) {
      Object.assign(this.consult, data);
      this.updateMode = true;

      this.tempYmd = data.visitYmd;
    },
    // 상담구분
    getComboItems() {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'HEA_COUNSEL_TYPE'
      );
      this.$http.type = 'get';
      this.$http.request(
        (_result) => {
          this.counselTypeCdItems = this.$_.clone(_result.data);
          this.counselTypeCdItems.splice(0, 0, {
            code: '',
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    beforeInsert() {
      if (this.consult.userNm === '') {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000448', // 유소견자목록에서 직원을 선택해 주세요.
          type: 'warning',
        });
        return;
      }
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인',
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.consult.createUserId = this.$store.getters.token;

                this.isInsertSubmit = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    beforeEdit() {
      this.$validator
        .validateAll()
        .then((_result) => {
          if (_result) {
            window.getApp.$emit('CONFIRM', {
              title: 'L0000003321', // '확인'
              message: 'M0000000011', // 저장하시겠습니까?
              type: 'info',
              // 확인 callback 함수
              confirmCallback: () => {
                this.consult.updateUserId = this.$store.getters.token;

                this.isEditSubmit = true;
              },
            });
          }
        })
        .catch(() => {
          window.getApp.$emit(
            'APP_VALID_ERROR',
            'M0000000881' // 유효성 검사도중 에러가 발생하였습니다.
          );
        });
    },
    btnDelRowClicked() {
      let checkingData = this.AuiGrid.getCheckedRowItemsAll();
      if (checkingData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000449', // 유소견자 건강상담 항목을 선택해주세요.
          type: 'warning',
        });
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        // 확인 callback 함수
        confirmCallback: () => {
          this.deleteRows = [];
          // this.deleteValue = {
          //   data: Object.values(this.$_.clone(this.selectedValue)),
          // };
          // this.isDeleteSubmit = true;
          checkingData.forEach((item) => {
            this.deleteRows.push(item);
          });
          this.$http.url = this.deleteUrl;
          this.$http.type = 'DELETE';
          this.$http.param = {
            data: Object.values(this.$_.clone(this.deleteRows)),
          };
          this.$http.request(
            (_result) => {
              this.getConsults(this.static);
              this.btnClearClickedCallback();
              this.isDeleteSubmit = false;
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
        },
      });
    },
    beforeDelete() {
      if (this.selectedValue.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395', // '안내',
          message: 'M0000000449', // 유소견자 건강상담 항목을 선택해주세요.
          type: 'warning',
        });
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321', // '확인',
        message: 'M0000000012', // 삭제하시겠습니까?
        type: 'info',
        // 확인 callback 함수
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
      this.getSuspectUsers();
    },
    btnSearchConsults(_result) {
      this.btnClearClickedCallback();
      this.getConsults(_result);
    },
    btnDeleteClickedCallback(_result) {
      this.getConsults(this.static);
      this.btnClearClickedCallback();
      this.isDeleteSubmit = false;
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // '안내',
        message: 'M0000000007', // 삭제되었습니다.
        type: 'success',
      });
    },
    btnClearClickedCallback() {
      Object.assign(this.$data.consult, this.$options.data().consult);
      this.$validator.reset();
      this.updateMode = false;

      this.consult.userId = this.static.userId;
      this.consult.userNm = this.static.userNm;
      this.consult.deptCd = this.static.deptCd;
    },
    btnClickedErrorCallback(_result) {
      this.isInsertSubmit = false;
      this.isEditSubmit = false;
      window.getApp.$emit(
        'APP_REQUEST_ERROR',
        'M0000000016' // 오류가 발생했습니다. 재시도 후 지속적인 문제 발생 시 관리자에게 문의하세요.
      );
    },
    suspectPopupClickedCallback() {
      this.popupOptions.target = () => import(`${'./suspectUserPopup.vue'}`);
      this.popupOptions.title = 'L0000000580'; // 관리대상 유소견자 지정'
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '10px';
      this.param = {};
      this.popupOptions.closeCallback = this.closePopup;
    },
    consultPopupClickedCallback() {
      this.popupOptions.target = () =>
        import(`${'./createGeneralBusiness.vue'}`);
      this.popupOptions.title = 'L0000001515'; // 상담 등록
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.param = {
        heaConsultNo: 0,
        userId: this.static.userId,
        userNm: this.static.userNm,
        deptCd: this.static.deptCd,
        counselTypeCd: this.searchParam.counselTypeCd,
      };
      this.popupOptions.closeCallback = this.closeGeneralBusinessPopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getSuspectUsers();
      Object.assign(this.$data.consult, this.$options.data().consult);
      this.$validator.reset();
    },
    closeGeneralBusinessPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getConsults(this.static);
    },
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.searchParam.plantCd,
        deptCd: this.searchParam.deptCd,
      };
      this.popupOptions.title = '유소견자 검색'; // 유소견자 검색
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
        this.searchParam.userId = data.user.userId;
      }
    },
    clear() {
      this.searchParam.userId = null;
      this.searchParam.userNm = null;
    },
    suspectSelectedRow(row) {
      this.btnSearchConsults(row);
    },
    cellclickHandler(event) {
      if (event.dataField !== 'visitYmd') return;
      this.popupOptions.target = () =>
        import(`${'./createGeneralBusiness.vue'}`);
      this.popupOptions.title = 'L0000002264'; // 일반업무 상세
      this.popupOptions.param = {
        heaConsultNo: event.item.heaConsultNo,
      };
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closeGeneralBusinessPopup;
    },
    tableLinkClicked(header, data) {
      if (data === null) return;
      this.popupOptions.target = () =>
        import(`${'./createGeneralBusiness.vue'}`);
      this.popupOptions.title = 'L0000002264'; // 일반업무 상세
      this.popupOptions.param = {
        heaConsultNo: data.heaConsultNo,
      };
      this.popupOptions.visible = true;
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closeGeneralBusinessPopup;
    },
    /** /Button Event **/
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
  },
};
</script>
