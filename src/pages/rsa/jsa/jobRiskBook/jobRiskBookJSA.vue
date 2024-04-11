<!--
  목적 : 위험등록부 - KRAS
  Detail : 평가결과 위험등록부에 등록된 KRAS 작업를 조회하는 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <!-- 평가년도 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-datepicker
            :width="8"
            type="year"
            label="L0000003065"
            name="assessYear"
            :default="searchParam.assessYear"
            v-model="searchParam.assessYear"
          />
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
          <!-- 담당자 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000004201"
            :disabled="true"
            name="userNm"
            v-model="searchParam.userNm"
            :appendIcon="[{ 'icon': 'times', callbackName: 'clear' }, { 'icon': 'search', callbackName: 'searchUser' }]"
            @searchUser="btnSearchUserClicked"
            @clear="clear"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-tree-process
            type="search"
            :plantCd="searchParam.plantCd"
            :deptCd="searchParam.deptCd"
            v-model="searchParam.processCd"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-6">
          <!-- 평가명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            name="assessNm"
            label="L0000003081"
            v-model="searchParam.assessNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작업명 -->
          <y-text :width="8" ui="bootstrap" name="jobNm" label="L0000002389" v-model="searchParam.jobNm"></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작업단계명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            name="jobNm"
            label="L0000002382"
            v-model="searchParam.jobStepNm"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-2">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             삭제 
            <y-btn
              v-if="editable"
              title="L0000001495"
              color="red"
              @btnClicked="btnDeleteClicked"
              @btnClickedErrorCallback="btnClickedErrorCallback"
            />
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           위험등록부(JSA) 목록 
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :print="true"
            :use-paging="true"
            :editable="editable"
            v-model="selectedValue"
            :routeName="routeName"
            @tableLinkClicked="tableLinkAccidentTitleClicked"
            label="L0000002133"
          >
            <el-table-column type="selection" slot="selection" align="center" width="55"></el-table-column>
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002133')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :showRowCheckColumn="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @getList="getList"
          @btnDelRow="btnDelRow"
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
  /* attributes: name, components, props, data */
  name: 'y-job-risk-book-jsa',
  props: {
    paneName: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    searchParam: {
      // assessTypeNo: 2,
      plantCd: '', // 사업장
      assessNm: '', // 평가명
      deptCd: '', // 부서
      processCd: '', // 공정
      assessYear: '', // 평가년도
      jobNm: '', // 작업명
      jobStepNm: '', // 작업단계명
      userId: '',
      userNm: '',
      deptSubYn: 'Y', // 하위부서여부 사용
    },
    gridOptions: {
      name: 'jobRiskBookJSA',
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
      param: null,
      width: '90%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    selectedValue: [],
    searchUrl: '',
    routeName: '',
  }),
  watch: {
    // 해당 tab 들어올 때마다 그리드 사이즈 조정
    paneName(val) {
      // this.setGridSize();
    },
  },
  //* Vue lifecycle: created, mounted, destroyed, etc */
  beforeCreate() {},
  created() {},
  beforeMount() {
    Object.assign(this.$data, this.$options.data());
    this.init();
    window.addEventListener('resize', this.resizeGrid);
  },
  mounted() {
    this.YAuiGrid = this.$refs.yAuiGrid
    this.resizeGrid();
  },
  beforeDestroy() {
  },
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;

      this.routeName = this.$route.name;
      // Url Setting
      this.searchUrl = selectConfig.rsa.jobRiskBookJSA.list.url;
      this.searchParam.deptSubYn = 'Y';
      this.searchParam.assessYear = this.$comm.getToday().substring(0, 4);
      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000271'), 
          dataField: 'imprStepNm', 
          width: '10%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
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
          headerText: this.$comm.getLangSpecInfoLabel('L0000000515'), 
          dataField: 'processNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'), 
          dataField: 'assessNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002423'), 
          dataField: 'jobCd', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000156'), 
          dataField: 'jobRevno', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'), 
          dataField: 'jobNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002400'), 
          dataField: 'jobStepNo', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002375'), 
          dataField: 'jobStepNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002181'), 
          dataField: 'upRiskHazardNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002179'), 
          dataField: 'subRiskHazardNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000254'), 
          dataField: 'improve', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003083'), 
          dataField: 'evalDesc', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000284'),         
          children: [
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000001378'), 
              dataField: 'frequencySize', 
              width: '10%', 
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000000248'), 
              dataField: 'strongSize', 
              width: '10%', 
            },
            {
              headerText: this.$comm.getLangSpecInfoLabel('L0000002121'), 
              dataField: 'riskSize', 
              width: '10%', 
            },          
          ],
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003093'), 
          dataField: 'userNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003092'), 
          dataField: 'assessDate', 
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
          title: this.$comm.getLangSpecInfoLabel('L0000001495'),
          color: 'red',
          btnClicked: 'btnDelRow',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ]
      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.getList(); // 위험등록부 목록 조회
      // this.setGridSize(); // 그리드 사이즈 조절
    },
    /**
     * showAccidentPopup 호출
     * 사고등록 목록에 사고명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    cellClickHandler(event) {
      if (event.dataField !== 'imprStepNm') return;
      if (!this.editable && !event.item.imprStepCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000633', // 쓰기권한이 없습니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (event.item.imprStepCd) {
        this.popupOptions.param = {
          safImprActNo: event.item.safImprActNo,
          imprClassCd: 'ICL05',
          refTableId: event.item.riskBookNo,
          flag: 'DETAIL',
        };
      } else {
        this.popupOptions.param = {
          safImprActNo: 0,
          imprClassCd: 'ICL05',
          refTableId: event.item.riskBookNo,
          flag: 'REQUEST',
          imprStepCd: 'IMST2',
        };
      }

      if (this.popupOptions.param.flag === 'REQUEST') {
        this.popupOptions.title = 'L0000000268'; // 개선요청등록
        this.popupOptions.target = () =>
          import(`${'../../../impr/actionRequest.vue'}`);
      } else if (this.popupOptions.param.flag === 'DETAIL') {
        this.popupOptions.title = 'L0000003458'; // 개선요청상세
        this.popupOptions.target = () =>
          import(`${'../../../impr/improveDetail.vue'}`);
      }

      this.popupOptions.width = '1000px';
      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    tableLinkAccidentTitleClicked(header, data) {
      if (!data) return;
      if (!this.editable && !data.imprStepCd) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000633', // 쓰기권한이 없습니다.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      if (data.imprStepCd) {
        this.popupOptions.param = {
          safImprActNo: data.safImprActNo,
          imprClassCd: 'ICL05',
          refTableId: data.riskBookNo,
          flag: 'DETAIL',
        };
      } else {
        this.popupOptions.param = {
          safImprActNo: 0,
          imprClassCd: 'ICL05',
          refTableId: data.riskBookNo,
          flag: 'REQUEST',
          imprStepCd: 'IMST2',
        };
      }

      if (this.popupOptions.param.flag === 'REQUEST') {
        this.popupOptions.title = 'L0000000268'; // 개선요청등록
        this.popupOptions.target = () =>
          import(`${'../../../impr/actionRequest.vue'}`);
      } else if (this.popupOptions.param.flag === 'DETAIL') {
        this.popupOptions.title = 'L0000003458'; // 개선요청상세
        this.popupOptions.target = () =>
          import(`${'../../../impr/improveDetail.vue'}`);
      }

      this.popupOptions.width = '1000px';
      this.popupOptions.top = '10px';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    resizeGrid() {
      let _height = window.innerHeight - 385;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    /** 위험등록부 목록 검색 **/
    getList() {
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
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data === 'CLOSE' || !data) this.getList();
      else if (data.assessPlan) {
        this.searchParam.assessNm = data.assessPlan.assessNm;
      }
    },

    /** button 관련 이벤트 **/

    /**
     * 수정 버튼 안보여지도록 처리
     *  버튼 http 통신 중 error 발생 callback
     * _result : error return하는 데이터
     */
    btnClickedErrorCallback(_result) {
      window.getApp.$emit('APP_REQUEST_ERROR', _result);
    },
    btnDelRow() {
      let removeData = this.YAuiGrid.getCheckedRowItems();
      if (!removeData || removeData.length === 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000136', // 항목을 하나이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }
      this.selectedValue = [];
      this.$_.forEach(removeData, item => {
        this.selectedValue.push(item.item)
      });
      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000012', // 삭제하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = transactionConfig.rsa.jobRiskBook.delete.url;
          this.$http.type = 'DELETE';
          this.$http.param = {
            data: Object.values(this.$_.clone(this.selectedValue)),
          };
          this.$http.request(
            _result => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success', // success / info / warning / error
              });
              // 실제로 삭제가 되는 경우는 엑셀업로드한 데이터(저장되지 않은 데이터)를 보는것이 아닌
              // 조회된 데이터를 삭제하는 경우임으로 다시 리스트를 조회한다.
              this.getList();
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    // 위험등록부 JSA 삭제
    btnDeleteClicked() {
      if (this.selectedValue.length <= 0) {
        window.getApp.$emit('ALERT', {
          title: 'L0000003395',
          message: 'M0000000136', // 항목을 하나이상 선택하세요.
          type: 'warning', // success / info / warning / error
        });
        return;
      }

      window.getApp.$emit('CONFIRM', {
        title: 'L0000003321',
        message: 'M0000000012', // 삭제하시겠습니까?
        // TODO : 필요시 추가하세요.
        type: 'info', // success / info / warning / error
        // 확인 callback 함수
        confirmCallback: () => {
          this.$http.url = transactionConfig.rsa.jobRiskBook.delete.url;
          this.$http.type = 'DELETE';
          this.$http.param = {
            data: Object.values(this.$_.clone(this.selectedValue)),
          };
          this.$http.request(
            _result => {
              window.getApp.$emit('ALERT', {
                title: 'L0000003395',
                message: 'M0000000007', // 삭제되었습니다.
                type: 'success', // success / info / warning / error
              });
              // 실제로 삭제가 되는 경우는 엑셀업로드한 데이터(저장되지 않은 데이터)를 보는것이 아닌
              // 조회된 데이터를 삭제하는 경우임으로 다시 리스트를 조회한다.
              this.getList();
            },
            _error => {
              window.getApp.$emit('APP_REQUEST_ERROR', _error);
            }
          );
        },
        // 취소 callback 함수
        cancelCallback: () => {},
      });
    },
    
    btnSearchUserClicked() {
      this.popupOptions.target = () =>
        import(`${'../../../manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.searchParam.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.top = '100px';
      this.popupOptions.closeCallback = this.closePopupUser;
    },
    closePopupUser(data) {
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
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    /** end button 관련 이벤트 **/
  },
};
</script>