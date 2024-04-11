<!--
  목적 : 요청/조치사항 목록
  Detail : 요청/조치사항 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 사업장 -->
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 업무구분 -->
          <y-select
            :width="8"
            :comboItems="comboImprClassItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001947"
            name="imprClassCd"
            v-model="searchParam.imprClassCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!--  단계 -->
          <y-select
            :width="8"
            :comboItems="gubunItems"
            :disabled="true"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000005014"
            name="imprGubun"
            v-model="searchParam.imprGubun"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!--  상태 -->
          <y-select
            :width="8"
            :comboItems="stateItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000001538"
            name="stateCd"
            v-model="searchParam.stateCd"
          ></y-select>
        </b-col>

        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 요청일 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002055"
            name="imprRqstYmd"
            :default="searchParam.imprRqstYmd"
            v-model="searchParam.imprRqstYmd"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 조치기한 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002670"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>

        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!--  조치업체 -->
          <y-text
            :width="8"
            ui="bootstrap"
            name="subconnNm"
            label="L0000002681"
            v-model="searchParam.subconnNm"
          ></y-text>
        </b-col>
        <b-col
          v-if="this.$route.meta.param === 'RQST'"
          sm="6"
          md="6"
          lg="4"
          xl="4"
          class="col-xxl-3"
        >
          <!-- 요청부서 -->
          <y-tree-dept
            :width="8"
            type="search"
            name="imprRqstDeptCd"
            label="L0000002053"
            :editable="deptEditable"
            :searchEditable="deptEditable"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.imprRqstDeptCd"
            :deptSubYn="searchParam.imprRqstDeptSubYn"
            @setDeptSubYn="setImprRqstDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col
          v-if="this.$route.meta.param === 'ACT'"
          sm="6"
          md="6"
          lg="4"
          xl="4"
          class="col-xxl-3"
        >
          <!-- 요청부서 -->
          <y-tree-dept
            :width="8"
            type="search"
            name="imprRqstDeptCd"
            label="L0000002053"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.imprRqstDeptCd"
            :deptSubYn="searchParam.imprRqstDeptSubYn"
            @setDeptSubYn="setImprRqstDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col
          v-if="this.$route.meta.param === 'ACT'"
          sm="6"
          md="6"
          lg="4"
          xl="4"
          class="col-xxl-3"
        >
          <!--  조치부서 -->
          <y-tree-dept
            :width="8"
            type="search"
            name="actDeptCd"
            label="L0000002673"
            :editable="deptEditable"
            :searchEditable="deptEditable"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.actDeptCd"
            :deptSubYn="searchParam.actDeptSubYn"
            @setDeptSubYn="setActDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col
          v-if="this.$route.meta.param === 'RQST'"
          sm="6"
          md="6"
          lg="4"
          xl="4"
          class="col-xxl-3"
        >
          <!--  조치부서 -->
          <y-tree-dept
            :width="8"
            type="search"
            name="actDeptCd"
            label="L0000002673"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.actDeptCd"
            :deptSubYn="searchParam.actDeptSubYn"
            @setDeptSubYn="setActDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 제목 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002616"
            name="imprTitle"
            v-model="searchParam.imprTitle"
          ></y-text>
        </b-col>
        <!-- 평가기한초과 -->
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-checkbox
            :width="8"
            :comboItems="[
              { text: '', value: 'Y' },
              { text: '', value: 'N' },
            ]"
            ui="bootstrap"
            name="searchParam.imprChk"
            :useDefault="true"
            label="L0000005013"
            v-model="searchParam.imprChk"
          />
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             개선결과출력 
            <y-btn title="L0000000251" @btnClicked="printImprCk" />
              검색 
            <y-btn
              title="L0000000327"
              color="green"
              @btnClicked="btnSearchClickedCallback"
            />
          </div>
           요청/조치사항 목록 -
          <y-data-table
            ref="dataTable"
            :use-paging="true"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :label="gridOptions.label"
            @tableLinkClicked="tableLinkimprTitleClicked"
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
          :label="gridOptions.label"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @printImprCk="printImprCk"
          @btnSearchClickedCallback="btnSearchClickedCallback"
          @cellClick="cellClickHanlder"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'impr-act',
  props: {},
  data() {
    return {
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '85%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      searchParam: {
        plantCd: '',
        imprClassCd: '', // 업무구분
        imprRqstYmd: '', // 요청일
        period: '', // 조치 기한
        imprStepCd: '', // 진행상태
        actClassCd: 'ACL02', // 조치처리구분코드 (개선사항)
        imprTitle: '', // 제목
        imprRqstDeptCd: null, // 요청부서
        actDeptCd: null, // 조치부서
        subconnNm: '', // 협력업체
        apprFlag: 'Y', // 결재완료 조회 flag
        type: '',
        actDeptSubYn: 'Y',
        imprRqstDeptSubYn: 'Y',
        imprChk: '', // 조치 기한 초과 검색box
        imprGubun: 'PHASE3', // 개선요청 관리 - 개선요청, 개선접수 및 조치 관리 - 개선조치
      },
      gridOptions: {
        name: 'imprAct1',
        btns: [],
        header: [],
        data: [],
        height: 'auto',
        label: '',
      },
      YAuiGrid: null,
      comboImprClassItems: [],
      gubunItems: [],
      stateItems: [],
      searchUrl: '',
      printUrl: '',
      editable: true,
      companyEditable: false,
      plantEditable: false,
      deptEditable: false,
    };
  },
  watch: {},
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.searchParam.type = this.$route.meta.param;
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      console.log('aaaaaaaaa')
      this.editable = this.$route.meta.editable;

      this.searchParam.actDeptSubYn = 'Y';
      this.searchParam.imprRqstDeptSubYn = 'Y';

      this.gubunItems = [
        {
          code: 'PHASE3',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000000264'),
        }, // 개선요청
        {
          code: 'PHASE4',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000000276'),
        }, // 개선조치
      ];

      var from = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-6m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '0m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );

      var from2 = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      var to2 = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );

      if (this.$route.meta.param === 'RQST') {
        this.searchParam.imprRqstYmd = [from, to];
        this.searchParam.period = [from2, to2];
      } else {
        this.searchParam.imprRqstYmd = [from2, to2];
        this.searchParam.period = [from, to];
      }
      // Url Setting
      this.searchUrl = selectConfig.saf.imprAct.list.url;
      this.printUrl = selectConfig.saf.imprAct.print.url;

      // 개선분류코드
      this.$comm.getComboItems('SAF_IMPR_CLASS', true).then(_result => {
        this.comboImprClassItems = _result;
      });

      // 개선상태단계
      this.$comm.getComboItems('IMPR_STATE', true).then(_result => {
        this.stateItems = _result;
      });

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      if (this.$route.meta.param === 'RQST') {
        // 요청
        this.gridOptions.label = 'L0000004315'; // 요청사항 목록
        this.searchParam.imprGubun = 'PHASE3';
      } else {
        this.gridOptions.label = 'L0000004316'; // 조치사항 목록
        this.searchParam.imprGubun = 'PHASE4';
      }

      // 권한별 컨트롤 처리
      if (this.$comm.isCompanyGrp()) {
        // 전사권한
        this.searchParam.plantCd = '';
        this.searchParam.imprRqstDeptCd = '';
        this.companyEditable = true;
        this.plantEditable = true;
        this.deptEditable = true;
      } else if (this.$comm.isPlantGrp()) {
        // 사업장권한
        this.searchParam.plantCd = this.$store.getters.plantCd;
        this.searchParam.imprRqstDeptCd = '';
        this.plantEditable = true;
        this.deptEditable = true;
      } else {
        this.searchParam.plantCd = this.$store.getters.plantCd;

        if (this.$route.meta.param !== 'RQST') {
          // 요청
          this.searchParam.actDeptCd = this.$store.getters.deptCd;
        } else {
          this.searchParam.imprRqstDeptCd = this.$store.getters.deptCd;
        }
      }

      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '7%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002616'), 
          dataField: 'imprTitle', 
          width: '15%', 
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001947'), 
          dataField: 'imprClassNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002055'), 
          dataField: 'imprRqstYmd', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002053'), 
          dataField: 'imprRqstDeptNm', 
          width: '7%', 
        },

        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002673'), 
          dataField: 'actDeptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002681'), 
          dataField: 'actVendorNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002672'), 
          dataField: 'actUserNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002670'), 
          dataField: 'actLimitYmd', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002694'), 
          dataField: 'actConfirmYmd', 
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

      if (this.$route.meta.param === 'RQST') {
        this.gridOptions.header.splice(3, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'), 
          dataField: 'stateNm', 
          width: '10%', 
        });

        this.gridOptions.header.splice(4, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005475'), 
          dataField: 'apprStateNm', 
          width: '7%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },          
        });
      } else {
        this.gridOptions.header.splice(3, 0, {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'), 
          dataField: 'stateNm', 
          width: '10%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },  
        });
      }

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000251'),
          btnClicked: 'printImprCk',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ]

      this.getList();
    },
    getList() {
      this.searchParam.imprChk =
        this.searchParam.imprchk === '' ? 'N' : this.searchParam.imprChk;
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
    resizeGrid() {
      let _height = window.innerHeight - 385;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    cellClickHanlder(event) {
      if (
        (this.$route.meta.param === 'RQST' && event.dataField === 'apprStateNm') ||
        (this.$route.meta.param === 'ACT' && event.dataField === 'stateNm')
      ) {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'imprTitle') {
        this.openDialogPage('DETAIL', event.item);
      }
    },
    tableLinkimprTitleClicked(header, data) {
      if (
        (this.$route.meta.param === 'RQST' && header.name === 'apprStateNm') ||
        (this.$route.meta.param === 'ACT' && header.name === 'stateNm')
      ) {
        this.showApprProgressPopup(data);
      } else {
        this.openDialogPage('DETAIL', data);
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
    openDialogPage(flag, data) {
      if (data.imprStepCd === 'IMST2') flag = 'ACCEPT';
      else if (data.imprStepCd === 'IMST3') flag = 'IMPROVE';
      // else if (data.imprStepCd === 'IMST4') flag = 'CONFIRM';
      else flag = 'DETAIL';

      if (!this.editable) flag = 'DETAIL';

      // 조치 부서가 자신의 부서가 아닌 경우에 수정불가
      // if (data.actDeptCd !== this.$store.getters.deptCd) flag = 'DETAIL';

      this.popupOptions.param = {
        safImprActNo: data.safImprActNo,
        imprClassCd: data.imprClassCd,
        flag: flag,
      };
      // IMST1 요청등록 , IMST2 접수, IMST3 조치부서조치중, IMST4 요청부서확인, IMST5 개선완료

      if (flag === 'ACCEPT') {
        this.popupOptions.target = () => import(`${'./actionAccept.vue'}`);
        this.popupOptions.title = 'L0000003545'; /* 개선조치부서 접수 및 확인 */
      } else {
        if (flag === 'IMPROVE') {
          this.popupOptions.title = 'L0000000276'; /* 개선조치 */
        } else if (flag === 'CONFIRM') {
          this.popupOptions.title = 'L0000003546'; /* 개선조치요청 확인 */
        } else {
          this.popupOptions.title =
            'L0000002688'; /* 상세정보 --> 조치요청 상세 정보 */
        }
        this.popupOptions.target = () => import(`${'./improveDetail.vue'}`);
      }

      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },

    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /** button 관련 이벤트 **/
    btnSearchClickedCallback(_result) {
      this.getList();
    },
    printImprCk() {
      let thisVue = this;
      let _comm = this.$comm;
      this.$http.url = this.printUrl;
      this.$http.type = 'GET'; // BASE64를 UTF-8인코딩한 바이트로 다운받음 (그렇지 않으면 FRONT에서 JSON이 깨짐)
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          let fileOrgNm = '개선결과.xlsx';
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
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    // 하위부서 포함 조회 관련 함수 추가
    setImprRqstDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.imprRqstDeptSubYn = _result;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setActDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.actDeptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>
