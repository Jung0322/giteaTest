<!--
  목적 : 보호구관리 > 보호구 지급현황
  작성자 : ksw
  Detail :
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="btnSearchClickedCallback">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" :editable="editable" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 지급기간 -->
          <y-datepicker
            :width="baseWidth"
            :range="true"
            label="L0000002747"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 보호구 종류 -->
          <y-select
            :width="baseWidth"
            :comboItems="speKindCds"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            type="search"
            label="L0000001270"
            name="speKindCd"
            v-model="searchParam.speKindCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 보호구명 -->
          <y-text
            :width="baseWidth"
            ui="bootstrap"
            type="search"
            label="L0000001275"
            name="speNm"
            v-model="searchParam.speNm"
          ></y-text>
        </b-col>
        <b-col v-if="searchAuth" sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 요청부서 -->
          <y-tree-dept
            type="search"
            label="L0000002053"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.rqstDeptCd"
          />
        </b-col>
        <b-col v-if="searchAuth" sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 요청자명 -->
          <y-text
            :width="baseWidth"
            :clearable="true"
            :readonly="true"
            ui="bootstrap"
            type="search"
            label="L0000002058"
            name="rqstUserNm"
            v-model="searchParam.rqstUserNm"
            :appendIcon="[{ 'icon': 'search', callbackName: 'searchUser' }]"
            @searchUser="btnSearchUserClicked"
          ></y-text>
        </b-col>
        <b-col v-if="searchAuth" sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 수령자명 -->
          <y-text
            :width="baseWidth"
            :clearable="true"
            :readonly="true"
            ui="bootstrap"
            type="search"
            label="L0000001684"
            name="userNm"
            v-model="searchParam.userNm"
            :appendIcon="[{ 'icon': 'search', callbackName: 'searchUser' }]"
            @searchUser="btnSearchUserClicked2"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 보호구 지급 grid -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div class="float-right mb-1">
             <y-btn :title="searchArea.title" color="green" @btnClicked="btnSearchVisibleClicked" /> 
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="btnSearchClickedCallback" />
          </div>
           보호구 지급현황 
          <y-data-table
            :label="$comm.getLangSpecInfoLabel('L0000004407')"
            gridType="edit"
            :use-paging="true"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :excelDown="true"
            :rowClassName="rowClassName"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000004407')"
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
    <!-- 팝업 설정 -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  name: 'spe-give',
  props: {},
  data() {
    return {
      searchArea: {
        title: '검색박스숨기기',
        show: true,
      },
      searchParam: {
        plantCd: '',
        speKindCd: '',
        speNm: '',
        rqstDeptCd: '',
        rqstUserId: '',
        rqstUserNm: '',
        period: [],
        userId: '',
        userNm: '',
      },
      gridOptions: {
        name: 'spePaymentStatus',
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
        width: '60%',
        top: '10px',
        param: {},
        closeCallback: null,
      },
      editable: false,
      baseWidth: 8,
      speKindCds: [], // 보호구 종류
      searchUrl: '',
      searchAuth: false,
    };
  },
  watch: {
    'searchParam.rqstUserNm'() {
      if (this.searchParam.rqstUserNm === '') {
        this.searchParam.rqstUserId = '';
      }
    },
    'searchParam.userNm'() {
      if (this.searchParam.userNm === '') {
        this.searchParam.userId = '';
      }
    },
  },
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.initSearchAuth();
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {
  },
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // URL 셋팅
      this.searchUrl = selectConfig.saf.speGive.list.url;

      //   // 안환팀 확인
      //   let tmpDeptCd = this.$store.getters.deptCd;
      //   if (
      //     tmpDeptCd === '10C1400' ||
      //     tmpDeptCd === '30E1300' ||
      //     tmpDeptCd === '30E1310' ||
      //     tmpDeptCd === '40K3600' ||
      //     tmpDeptCd === '40K3610' ||
      //     tmpDeptCd === '50K9200E'
      //   ) {
      //     this.searchAuth = true;
      //   }
      //   let userAuthGrps = this.$_.filter(this.$store.getters.userAuthGrps, {
      //     settingYn: 'Y',
      //   });
      //   if (userAuthGrps && userAuthGrps.length > 0) {
      //     this.$_.forEach(userAuthGrps, item => {
      //       if (
      //         String(item.authGrpNo) === '1030' ||
      //         String(item.authGrpNo) === '1031'
      //       ) {
      //         this.searchAuth = true;
      //       }
      //     });
      //   }

      var nowDate = this.$comm.getToday();
      var from = this.$comm.getCalculatedDate(
        nowDate,
        '-1m',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.period.push(from);
      this.searchParam.period.push(nowDate);


      this.getComboItems('SAF_SPE_KIND'); // 보호구 종류
      this.getComboItems('SAF_GIVE_KIND'); // 지급구분

      // 보호구 지급 grid 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002751'), 
          dataField: 'giveYmd', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002053'), 
          dataField: 'rqstDeptNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002057'), 
          dataField: 'rqstUserNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001682'), 
          dataField: 'userNms', 
          width: '10%',    
          style: 'left-align'       
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001277'), 
          dataField: 'speKindNm', 
          width: '10%',           
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001275'), 
          dataField: 'speNm', 
          width: '10%',   
          style: 'left-align' 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002750'), 
          dataField: 'giveNum', 
          width: '5%',       
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000870'), 
          dataField: 'giveUnitNm', 
          width: '5%',       
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000865'), 
          dataField: 'unitCost', 
          width: '10%',       
          dataType: 'numeric',
          formatString: '#,##0',
          style: 'right-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002866'), 
          dataField: 'totCost', 
          width: '10%',       
          dataType: 'numeric',
          formatString: '#,##0',
          style: 'right-align',
          styleFunction: (rowIndex, columnIndex, value, headerText, item, dataField) => {           
            if (item.plantNm === '총 합계') {
              return "cell-red";  
            } 
                    
          },
        },

        // { text: '수령자ID', name: 'userIds', width: '200px', align: 'left' },
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

      this.getList();
    },
    /**
     * 공통 마스터 정보 조회 (보호구 종류, 지급구분)
     * codeGroupCd : 마스터 테이블 codeGroupCd 정보
     */
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        _result => {
          if (codeGroupCd === 'SAF_SPE_KIND') {
            this.speKindCds = this.$_.clone(_result.data);
            this.speKindCds.splice(0, 0, { code: '', codeNm: this.$comm.getLangSpecInfoLabel('L0000002519') }); // 전체
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 415;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    // 보호구 지급 grid
    getList() {
      if (!this.searchAuth) {
        this.searchParam.userId = this.$store.getters.token;
      }
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data))
          this.$comm.pushCookie(this.searchParam);

          if (this.YAuiGrid.getGridData().length > 0) {
            let totalCost = 0;
            this.$_.forEach(this.YAuiGrid.getGridData(), item => {
              totalCost += Number(item.totCost);
            });
            let row = {
              plantNm: this.$comm.getLangSpecInfoLabel('L0000002862'), // 총 합계 
              giveYmd: '',
              rqstDeptNm: '',
              rqstUserNm: '',
              userNms: '',
              speKindNm: '',
              speNm: '',
              giveUnitNm: '',
              totCost: totalCost,
            }
            this.YAuiGrid.addRow(row, 'last');
          }
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    initSearchAuth() {
      // 안환팀 확인
      let tmpDeptCd = this.$store.getters.deptCd;
      if (
        tmpDeptCd === '10C1000' ||
        tmpDeptCd === '10C1400' ||
        tmpDeptCd === '30E1300' ||
        tmpDeptCd === '30E1310' ||
        tmpDeptCd === '40K3600' ||
        tmpDeptCd === '40K3610' ||
        tmpDeptCd === '50K9200E'
      ) {
        this.searchAuth = true;
      }
      let userAuthGrps = this.$_.filter(this.$store.getters.userAuthGrps, {
        settingYn: 'Y',
      });

      if (userAuthGrps && userAuthGrps.length > 0) {
        this.$_.forEach(userAuthGrps, item => {
          if (
            String(item.authGrpNo) === '1030' ||
            String(item.authGrpNo) === '1031'
          ) {
            this.searchAuth = true;
          }
        });
      }
    },

    /** Button Event **/

    // 검색
    btnSearchClickedCallback(_result) {
      this.getList();
    },
    // 사용자 검색
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    // 사용자 검색 팝업 닫기
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.searchParam.rqstUserNm = data.user.userNm;
        this.searchParam.rqstUserId = data.user.userId;
      } else {
        this.searchParam.rqstUserNm = '';
        this.searchParam.rqstUserId = '';
      }
    },
    // 사용자 검색
    btnSearchUserClicked2(_item) {
      this.popupOptions.target = () =>
        import(`${'../../manage/user/userSearch.vue'}`);
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupSearchUser2;
    },
    // 사용자 검색 팝업 닫기
    closePopupSearchUser2(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.searchParam.userNm = data.user.userNm;
        this.searchParam.userId = data.user.userId;
      } else {
        this.searchParam.userNm = '';
        this.searchParam.userId = '';
      }
    },
    // 버튼 에러 처리
    btnClickedErrorCallback(_result) {
      window.getApp.emit('APP_REQUEST_ERROR', _result);
    },
    rowClassName({ row, rowIndex }) {
      if (row.plantNm === 'L0000002862') {
        // 총 합계
        return 'tot-row';
      }
    },
    /** /Button Event **/
  },
};
</script>

<style>
.tot-row {
  background-color: #fff29e !important;
}
.cell-red {
    background-color: #ffa899 !important;
}
.cell-blue {
    background-color: #99b4ff !important;
}    
</style>