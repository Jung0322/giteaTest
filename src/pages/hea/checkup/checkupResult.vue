<!--
  목적 : 검진결과
  Detail :
  examples:
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <!-- 검색조건 사업장 추가 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <!-- 검색조건 부서 추가 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-dept
            type="search"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 검진년도 -->
          <y-datepicker
            :width="8"
            type="year"
            label="L0000000364"
            name="checkupYear"
            v-model="searchParam.checkupYear"
          ></y-datepicker>
        </b-col>

        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 검진계획 -->
          <y-select
            :width="8"
            :comboItems="heaCheckupPlanNoItems"
            itemText="heaCheckupPlanNm"
            itemValue="heaCheckupPlanNo"
            ui="bootstrap"
            type="search"
            name="heaCheckupPlanNo"
            label="L0000000353"
            v-model="searchParam.heaCheckupPlanNo"
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
            :disabled="true"
            :editable="editable"
            ui="bootstrap"
            name="userNm"
            label="L0000001630"
            v-model="searchParam.userNm"
            :appendIcon="[
              { icon: 'times', callbackName: 'clear' },
              { icon: 'search', callbackName: 'searchUser' },
            ]"
            @searchUser="searchUser"
            @clear="clear"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 재직/퇴직 -->
          <y-select
            :width="8"
            :comboItems="retirementYnItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            name="retirementYn"
            label="L0000002469"
            v-model="searchParam.retirementYn"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 질환종류 -->
          <y-select
            :width="8"
            :comboItems="heaDiseaseClassCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            name="heaDiseaseClassCd"
            label="L0000002785"
            v-model="searchParam.heaDiseaseClassCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 질환 -->
          <y-select
            :width="8"
            :comboItems="heaDiseaseCdItems"
            itemText="heaDiseaseNm"
            itemValue="heaDiseaseCd"
            ui="bootstrap"
            type="search"
            name="heaDiseaseCd"
            label="L0000002780"
            v-model="searchParam.heaDiseaseCd"
          />
        </b-col>
        <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
          <!-- 판정 -->
          <y-checkbox
            :width="10"
            :comboItems="heaDiagnoseCdsItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="heaDiagnoseCds"
            label="L0000003035"
            v-model="searchParam.heaDiagnoseCds"
          />
        </b-col>
        <b-col sm="12" md="12" lg="12" xl="12" class="col-xxl-6">
          <!-- 검진병원 -->
          <y-multi-select
            :width="10"
            :comboItems="heaCheckedOrgNosItems"
            itemText="heaCheckupOrgNm"
            itemValue="heaCheckupOrgNo"
            ui="bootstrap"
            label="L0000000369"
            name="heaCheckedOrgNoTemps"
            v-model="searchParam.heaCheckedOrgNoTemps"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- <b-row class="mt-3">
      <b-col sm="12" class="px-0">
        <b-col sm="12">
          <div slot="buttonGroup" class="float-right mb-1">
            - 일반검진 양식 다운로드 -
            <y-btn title="L0000002263" @btnClicked="btnDownloadFormClicked('normal')" />
             특수검진 양식 다운로드 
            <y-btn title="L0000003017" @btnClicked="btnDownloadFormClicked('special')" />
             업로드 -
            <y-btn
              v-if="editable"
              title="L0000001934"
              color="blue"
              @btnClicked="btnDiagnoseResultUploadClicked"
            />
             신규등록 
            <y-btn
              v-if="editable"
              title="L0000001789"
              color="orange"
              @btnClicked="openPopup(null)"
            />
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           검진결과 목록 
          <y-data-table
            label="L0000000350"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000000350')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getList="getList"
          @openPopup="openPopup(null)"
          @btnDownloadFormClicked="btnDownloadFormClicked('normal')"
          @btnDownloadFormClicked2="btnDownloadFormClicked('special')"
          @btnDiagnoseResultUploadClicked="btnDiagnoseResultUploadClicked"
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
  name: 'checkup-result',
  components: {},
  /** props, data, computed, watch **/
  props: {},
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '90%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        plantCd: '',
        deptCd: '',
        checkupYear: '',
        heaCheckupPlanNo: 0,
        retirementYn: '',
        heaDiagnoseCds: [],
        heaDiseaseClassCd: '',
        heaDiseaseCd: '',
        heaCheckedOrgNos: [],
        heaCheckedOrgNoTemps: [],
        userNm: '',
        userId: '',
        heaCheckupPlanPeriod: [],
        deptSubYn: 'Y', // 하위부서여부 사용
      },
      gridOptions: {
        name: 'checkupResult',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
      },
      YAuiGrid: null,
      editable: false,
      selectAll: false,
      heaCheckupPlanNoItems: [],
      heaDiagnoseCdsItems: [],
      retirementYnItems: [],
      heaDiseaseClassCdItems: [],
      heaDiseaseCdItems: [],
      heaCheckedOrgNosItems: [],
      heaCheckedOrgNos: [],
      isHealthManager: true,
      searchUrl: '',
      isInit: true,
    };
  },
  computed: {},
  watch: {
    'searchParam.checkupYear': function (newValue, oldValue) {
      let checkupYear = this.searchParam.checkupYear;
      this.searchParam.heaCheckupPlanPeriod = [checkupYear, checkupYear];
      this.getHeaCheckupPlanNoItems();
    },
    'searchParam.heaDiseaseClassCd': function (newValue, oldValue) {
      this.getHeaDiseaseCdItems();
    },
    'searchParam.heaDiagnoseCds'() {
      if (!this.isInit) {
        let items = this.searchParam.heaDiagnoseCds;
        if (items.indexOf('ALL') > -1 && !this.selectAll) {
          // 전체 체크
          this.searchParam.heaDiagnoseCds = this.heaDiagnoseCdsItems.map(
            (v) => v.code
          );
          this.selectAll = true;
        } else if (items.indexOf('ALL') < 0 && this.selectAll) {
          // 전체 체크 해제
          this.searchParam.heaDiagnoseCds = [];
          this.selectAll = false;
        }
      } else {
        this.isInit = !this.isInit;
      }
    },
    'searchParam.heaCheckedOrgNoTemps'() {
      this.searchParam.heaCheckedOrgNos = this.$_.map(
        this.searchParam.heaCheckedOrgNoTemps,
        'code'
      );
    },
  },
  /** created, beforeMount, mounted, beforeDestroy, destroyed **/
  beforeCreate() {},
  created() {},
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
  destroyed() {},
  /** methods **/
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.searchParam.deptCd = this.$store.getters.deptCd;

      if (
        this.$store.getters.token === 'she' ||
        this.$store.getters.token === 'manager' ||
        this.$store.getters.token === 'sysdev'
      ) {
        this.searchParam.deptCd = '';
      }

      this.searchUrl = selectConfig.hea.checkupResult.list.url;

      let userAuthGrps = this.$store.getters.userAuthGrps;
      this.$_.forEach(userAuthGrps, (item) => {
        if (item.authGrpNo === '1022' && item.settingYn === 'Y') {
          this.isHealthManager = true;
        }
      });

      if (!this.isHealthManager) {
        this.searchParam.userId = this.$store.getters.token;
      }

      if (
        !this.$store.getters.deptAuthGrp ||
        (this.$store.getters.deptAuthGrp &&
          this.$store.getters.deptAuthGrp.deptAccessYn === 'N')
      ) {
        this.searchParam.userNm = this.$store.getters.name;
        this.searchParam.userId = this.$store.getters.token;
      }

      // 선택항목 설정
      let today = this.$comm.getToday();
      this.searchParam.heaCheckupPlanPeriod = [today, today];
      this.searchParam.checkupYear = this.$comm.getThisYear();

      this.retirementYnItems.push({
        code: '',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
      }); // 전체
      this.retirementYnItems.push({
        code: 'Y',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000004327'),
      }); // 재직
      this.retirementYnItems.push({
        code: 'N',
        codeNm: this.$comm.getLangSpecInfoLabel('L0000004328'),
      }); // 퇴직

      this.getHeaDiagnoseCdsItems();
      this.getHeaDiseaseClassCdItems();
      this.getHeaCheckedOrgNosItems();

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList();

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001287'),
          dataField: 'deptNm',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001412'),
          dataField: 'userId',
          width: '7%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001630'),
          dataField: 'userNm',
          width: '10%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001632'),
          dataField: 'comSexTypeNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003035'),
          dataField: 'heaDiagnoseNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002785'),
          dataField: 'heaDiseaseClassNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002780'),
          dataField: 'heaDiseaseNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000373'),
          dataField: 'heaCheckupClassNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000371'),
          dataField: 'heaCheckedYmd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002158'),
          dataField: 'suspectYn',
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
          title: this.$comm.getLangSpecInfoLabel('L0000002263'),
          btnClicked: 'btnDownloadFormClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000003017'),
          btnClicked: 'btnDownloadFormClicked2',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001934'),
          color: 'blue',
          btnClicked: 'btnDiagnoseResultUploadClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'openPopup',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ];
      this.searchParam.deptSubYn = 'Y';
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
    resizeGrid() {
      let _height = window.innerHeight - 510;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    getHeaCheckupPlanNoItems() {
      // 검진계획 선택항목 조회
      this.$http.url = selectConfig.hea.checkupPlan.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        heaCheckupPlanPeriod: this.searchParam.heaCheckupPlanPeriod,
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            heaCheckupPlanNo: '0',
            heaCheckupPlanNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });

          this.heaCheckupPlanNoItems = _result.data;
          if (
            this.$_.findIndex(this.heaCheckupPlanNoItems, {
              heaCheckupPlanNo: this.searchParam.heaCheckupPlanNo,
            }) === -1
          ) {
            this.searchParam.heaCheckupPlanNo = 0;
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getHeaDiagnoseCdsItems() {
      // 판정 항목 조회
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'HEA_DIAGNOSE'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.heaDiagnoseCdsItems = _result.data;
          this.heaDiagnoseCdsItems.unshift({
            code: 'ALL',
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }); // 전체
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getHeaDiseaseClassCdItems() {
      // 질환종류 선택항목 조회
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        'HEA_DISEASE_CLASS'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            code: null,
            codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }); // 전체
          this.heaDiseaseClassCdItems = _result.data;
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getHeaDiseaseCdItems() {
      // 질환 선택항목 조회
      this.$http.url = selectConfig.hea.disease.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        heaDiseaseClassCd: this.searchParam.heaDiseaseClassCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            heaDiseaseCd: '',
            heaDiseaseNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
          }); // 전체
          this.heaDiseaseCdItems = _result.data;
          if (
            this.$_.findIndex(this.heaDiseaseCdItems, {
              heaDiseaseCd: this.searchParam.heaDiseaseCd,
            }) === -1
          ) {
            this.searchParam.heaDiseaseCd = '';
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getHeaCheckedOrgNosItems() {
      // 검진병원
      this.$http.url = selectConfig.hea.checkupOrg.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y',
      };
      this.$http.request(
        (_result) => {
          this.heaCheckedOrgNosItems = _result.data;
          this.searchParam.heaCheckedOrgNos = [];
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField === 'userNm') {
        this.openPopup(event.item);
      }
    },
    tableLinkClicked(header, row) {
      if (header.name === 'userNm') {
        this.openPopup(row);
      }
    },
    openPopup(data) {
      this.popupOptions.param = {
        heaCheckupPlanNo: data ? data.heaCheckupPlanNo : 0,
        userId: data ? data.userId : null,
      };
      this.popupOptions.target = () => import(`${'./checkupResultDetail.vue'}`);
      this.popupOptions.title = data ? 'L0000000351' : 'L0000004329'; // 검진결과 상세 : 검진결과 등록
      this.popupOptions.visible = true;
      this.popupOptions.width = '90%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getList();
    },
    btnDiagnoseResultUploadClicked(_result) {
      this.popupOptions.target = () =>
        import(`${'./diagnoseResultUpload.vue'}`);
      this.popupOptions.title = 'L0000000352'; // 검진결과/판정 Upload
      this.popupOptions.visible = true;
      this.popupOptions.width = '90%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopup;
    },
    searchUser(_item) {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
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
        this.searchParam.userId = data.user.userId;
        this.searchParam.userNm = data.user.userNm;
      }
    },
    clear() {
      this.searchParam.userId = null;
      this.searchParam.userNm = null;
    },
    btnDownloadFormClicked(checkupType) {
      if (checkupType === 'normal') {
        this.downloadUrl = selectConfig.hea.checkupResult.excel.normal.url;
      } else if (checkupType === 'special') {
        this.downloadUrl = selectConfig.hea.checkupResult.excel.special.url;
      }

      let thisVue = this;
      let accept = this.$comm.getAccept('xlsx');
      let _comm = this.$comm;
      this.$http.url = this.downloadUrl; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            if (checkupType === 'normal') {
              window.navigator.msSaveOrOpenBlob(
                blob,
                '일반검진결과_엑셀업로드양식.xlsx'
              );
            } else if (checkupType === 'special') {
              window.navigator.msSaveOrOpenBlob(
                blob,
                '특수검진결과_엑셀업로드양식.xlsx'
              );
            }
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            if (checkupType === 'normal') {
              link.download = '일반검진결과_엑셀업로드양식.xlsx';
            } else if (checkupType === 'special') {
              link.download = '특수검진결과_엑셀업로드양식.xlsx';
            }

            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
  },
};
</script>
