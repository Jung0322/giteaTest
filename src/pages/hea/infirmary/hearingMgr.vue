<!--
  목적 : 청력관리대상자
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
          <!-- 검사일자 -->
          <y-datepicker
            :width="baseWidth"
            :range="true"
            type="year"
            label="L0000000314"
            name="duration"
            :default="searchParam.duration"
            v-model="searchParam.duration"
          ></y-datepicker>
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
          <!-- 성명 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            label="L0000001630"
            name="userNm"
            :readonly="true"
            v-model="searchParam.userNm"
            :appendIcon="[{ icon: 'search', callbackName: 'searchUser' }]"
            @searchUser="btnSearchUserClicked"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             :action-url="deleteUrl"
              :param="deleteValue"
              :is-submit="isDeleteSubmit"
              beforeSubmit="beforeDelete"
              @btnClicked="btnDeleteClickedCallback"
            @btnClickedErrorCallback="btnClickedErrorCallback"
             엑셀다운로드 
            <y-btn title="L0000001966" @btnClicked="btnExcelDown" />
             엑셀업로드 
            <y-btn
              v-if="editable"
              title="L0000001969"
              @btnClicked="btnExcelUploadClicked"
            />
             엑셀양식파일 받기
            <y-btn
              title="L0000001968"
              @btnClicked="btnExcelTemplateDownClicked"
            />
             검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="getDataList"
            />
          </div>
          - 청력치 목록 
          <y-data-table
            label="L0000002852"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            :excelIcon="false"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002852')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          @getDataList="getDataList"
          @btnExcelTemplateDownClicked="btnExcelTemplateDownClicked"
          @btnExcelUploadClicked="btnExcelUploadClicked"
          @btnExcelDown="btnExcelDown"
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
  /** attributes: name, components, props, data **/
  name: 'general-business',
  props: {},
  data() {
    return {
      searchArea: {
        title: '검색박스숨기기', // 검색박스숨기기
        show: true,
      },
      searchParam: {
        plantCd: '',
        deptCd: '',
        userNm: '',
        duration: [],
        deptSubYn: 'Y', // 하위부서여부 사용
      },
      gridOptions: {
        name: 'hearingMgr',
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
        width: '70%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      baseWidth: 8,
      editable: false,
      searchUrl: '',
      downloadUrl: '',
      excelDownUrl: '',
      isHealthNm: false,
    };
  },
  /** Vue lifecycle: created, mounted, destroyed, etc **/
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
      let userAuthGrps = this.$store.getters.userAuthGrps;

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

      let today = this.$comm.moment().format('YYYY');
      this.searchParam.duration = [today, today];

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000314'),
          dataField: 'chkDt',
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
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001412'),
          dataField: 'userId',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002710'),
          children: [
            {
              headerText: '500',
              dataField: 'left500',
              width: '5%',
            },
            {
              headerText: '1000',
              dataField: 'left1000',
              width: '5%',
            },
            {
              headerText: '2000',
              dataField: 'left2000',
              width: '5%',
            },
            {
              headerText: '4000',
              dataField: 'left4000',
              width: '5%',
            },
          ],
        },
        {
          text: 'L0000002711', // 좌청력
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000098'),
              dataField: 'left3Div',
              width: '5%',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000101'),
              dataField: 'left6Div',
              width: '5%',
            },
          ],
        },
        {
          text: 'L0000004339', // 우
          children: [
            {
              headerText: '500',
              dataField: 'right500',
              width: '5%',
            },
            {
              headerText: '1000',
              dataField: 'right1000',
              width: '5%',
            },
            {
              headerText: '2000',
              dataField: 'right2000',
              width: '5%',
            },
            {
              headerText: '4000',
              dataField: 'right4000',
              width: '5%',
            },
          ],
        },

        {
          text: 'L0000002071', // 우청력
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000098'),
              dataField: 'right3Div',
              width: '5%',
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000101'),
              dataField: 'right6Div',
              width: '5%',
            },
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003035'),
          dataField: 'heaDiagnoseCd',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000589'),
          dataField: 'mgrLvl',
          width: '10%',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000476'),
          dataField: 'highDgrGrpNm',
          width: '10%',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001966'),
          btnClicked: 'btnExcelDown',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001969'),
          btnClicked: 'btnExcelUploadClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001968'),
          btnClicked: 'btnExcelTemplateDownClicked',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',
        },
      ];
      this.searchUrl = selectConfig.hea.hearingMgr.list.url;
      this.downloadUrl = selectConfig.hea.hearingMgr.excel.url;
      this.excelDownUrl = selectConfig.hea.hearingMgr.excelDownload.url;

      this.getComboItems();
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
      this.searchParam.deptSubYn = 'Y';

      this.getDataList();
      // this.setGridSize();
    },
    /** /초기화 관련 함수 **/
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.gridOptions.data = _result.data;
          this.YAuiGrid.setGridData(_result.data);
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
            codeNm:
              this.$comm.getLangSpecInfoLabel('L0000002519') /* 선택하세요 */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    /** Button Event **/

    btnDeleteClickedCallback(_result) {
      this.getDataList();
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
        import(`${'../../manage/user/userSearch.vue'}`);
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
    btnExcelUploadClicked() {
      this.popupOptions.target = () => import(`${'./hearingMgrUpload.vue'}`);
      this.popupOptions.title = 'L0000002851'; // 청력관리대상자 엑셀 업로드
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupExcelUpload;
    },
    closePopupExcelUpload(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },
    btnExcelTemplateDownClicked() {
      let thisVue = this;
      let accept = this.$comm.getAccept('xlsx');
      let _comm = this.$comm;
      this.$http.url = this.$format(this.downloadUrl, 'P'); // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data, accept);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, '청력관리대상자.xlsx');
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = '청력관리대상자.xlsx';
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    btnExcelDown() {
      let thisVue = this;
      this.$http.url = this.excelDownUrl; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          var fileOrgNm =
            this.$comm.getLangSpecInfoLabel('L0000004340') + // 청력관리대상자_
            this.$comm.moment().format('YYYYMMDD') +
            '.xlsx';

          var url = window.URL || window.webkitURL;
          let link = document.createElement('a');
          var blob = thisVue.$comm.base64ToBlob(_result.data);
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileOrgNm);
          } else {
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileOrgNm;
            link.click();
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (event.dataField !== 'userNm') return;
      this.popupOptions.target = () => import(`${'./hearingMgrDetail.vue'}`);
      this.popupOptions.param = event.item;
      this.popupOptions.title = 'L0000004341'; // 청력관리대상자 등록/상세
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupHearing;
    },
    tableLinkClicked(header, data) {
      this.popupOptions.target = () => import(`${'./hearingMgrDetail.vue'}`);
      this.popupOptions.param = data;
      this.popupOptions.title = 'L0000004341'; // 청력관리대상자 등록/상세
      this.popupOptions.visible = true;
      this.popupOptions.width = '80%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupHearing;
    },
    closePopupHearing() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getDataList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
    /** /Button Event **/
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
  },
};
</script>
