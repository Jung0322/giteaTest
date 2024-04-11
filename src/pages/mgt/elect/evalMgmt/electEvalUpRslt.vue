<!--
  목적 : SHE경영 관리>법정선임자 관리>법정선임자 평가 관리>상위평가결과 관리
  Detail : 상위평가결과 관리 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 대상년도 -->
          <y-datepicker
            :width="8"
            label="L0000004449"
            :range="true"
            type="year"
            name="period"
            :default="searchParam.period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 구분 -->
          <y-select
            :width="8"
            :comboItems="MgtHalfTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="halfTypeCd"
            label="L0000000686"
            v-model="searchParam.halfTypeCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 사업장 -->
          <y-plant
            :width="8"
            ui="bootstrap"
            type="search"
            name="plantCd"
            v-model="searchParam.plantCd"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 법정선임자 -->
          <y-select
            :width="8"
            :comboItems="electTitleItems"
            itemText="electTitlNm"
            itemValue="safElectTitlNo"
            ui="bootstrap"
            name="safElectTitlNo"
            label="L0000005162"
            v-model="searchParam.safElectTitlNo"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 평가명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000003081"
            name="evalNm"
            v-model="searchParam.evalNm"
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 주관부서 -->
          <y-tree-dept
            label="L0000002713"
            type="search"
            name="deptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.deptCd"
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="
              (val) => {
                searchParam.deptSubYn = val;
              }
            "
          />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 대상자 -->
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            label="L0000004488"
            name="userNm"
            v-model="searchParam.userNm"
            :appendIcon="
              changeUpUserEditable
                ? [
                    { icon: 'search', callbackName: 'searchUser' },
                    { icon: 'times', callbackName: 'clearUser' },
                  ]
                : null
            "
            @searchUser="btnSearchUserClicked('user')"
            @clearUser="btnClearUser('user')"
          ></y-text>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <!-- 상위 평가자 -->
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            label="L0000005171"
            name="upUserNm"
            v-model="searchParam.upUserNm"
            :appendIcon="
              changeUpUserEditable
                ? [
                    { icon: 'search', callbackName: 'searchUser' },
                    { icon: 'times', callbackName: 'clearUser' },
                  ]
                : null
            "
            @searchUser="btnSearchUserClicked('upUser')"
            @clearUser="btnClearUser('upUser')"
          ></y-text>
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
                name="stateCd"
                v-model="searchParam.stateCd"
              ></y-select>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-4">
          <b-row>
            <b-col sm="6">
              <!-- 평가미완료 -->
              <y-checkbox
                :width="4"
                :useDefault="true"
                checkedValue="Y"
                uncheckedValue="N"
                ui="bootstrap"
                name="evalIncompleteYn"
                label="L0000005011"
                v-model="searchParam.evalIncompleteYn"
              ></y-checkbox>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
             검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getList" />
          </div>
           상위평가결과 목록 
          <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
            label="L0000005301"
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
          :label="this.$comm.getLangSpecInfoLabel('L0000005301')"
          :useExcelExport="false"
          :enableCellMerge="true"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"  
          @getList="getList"
          @cellClick="cellcLickHandler"
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
  name: 'elect-eval-plan',
  props: {},
  data: () => ({
    searchParam: {
      period: [], // 대상년도
      halfTypeCd: null, // 구분
      plantCd: null, // 사업장
      safElectTitlNo: null, // 법정선임자번호
      evalNm: null, // 평가명
      deptCd: null, // 주관부서
      deptSubYn: null, // 하위부서 조회 여부
      userId: null, // 대상자 사번
      userNm: null, // 대상자
      upUserId: null, // 상위평가자 사번
      upUserNm: null, // 상위평가자
      procStepCd: 'SETS3', // 단계 (상위평가로 고정)
      stateCd: null, // 상태
      evalIncompleteYn: null, // 평가미완료여부
    },
    gridOptions: {
      name: 'electEvalUpRslt',
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
      param: {},
      width: '80%',
      top: '10px',
      closeCallback: null,
    },
    editable: false,
    MgtHalfTypeItems: [], // 구분 selectbox 목록
    electTitleItems: [], // 법정선임자 selectbox 목록
    procStepItems: [], // 상태 selectbox 목록
    stateItems: [], // 상태 selectbox 목록
    userType: null, // 대상자 검색/본인평가자 검색 구분
  }),
  computed: {
    changeUpUserEditable() {
      // 전사 담당자이거나 사업장 담당자이거나 시스템 관리자인지 권한 여부
      return (
        this.$comm.isPlantGrp() ||
        this.$comm.isCompanyGrp() ||
        this.$store.getters.isManager
      );
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
    this.YAuiGrid = this.$refs.yAuiGrid;
    this.resizeGrid();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchParam.period = [
        this.$comm.getThisYear(),
        this.$comm.getThisYear(),
      ];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004449'), 
          dataField: 'year', 
          width: '5%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000686'), 
          dataField: 'halfTypeNm', 
          width: '5%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003081'), 
          dataField: 'evalNm', 
          width: '15%', 
          style: 'left-align'
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005162'), 
          dataField: 'electTitlNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), 
          dataField: 'plantNm', 
          width: '5%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005226'), 
          dataField: 'meDeptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004488'), 
          dataField: 'userNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002713'), 
          dataField: 'deptNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004972'), 
          dataField: 'stepNm', 
          width: '10%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005336'), 
          dataField: 'meUserNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000005337'), 
          dataField: 'upUserNm', 
          width: '10%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
        },
      ]
      // 구분 (상반기/하반기)
      this.$comm.getComboItems('MGT_HALF_TYPE', true).then((_result) => {
        this.MgtHalfTypeItems = _result;
      });

      // 법정선임자(평가대상인 법정선임자)
      this.getElectTitleComboItems();

      // 단계 (계획/본인평가/상위평가)
      this.$comm.getComboItems('SAF_ELECT_TITL_STEP', true).then((_result) => {
        this.procStepItems = _result;
      });

      // 상태 (미작성/작성중/결재중/결재완료)
      this.$comm.getComboItems('COM_PROCESS_STEP2', true).then((_result) => {
        this.stateItems = _result;
      });

      // 권한이 없는 사람은 자신의 평가만 조회 및 수정 가능
      if (!this.changeUpUserEditable) {
        // 상위평가자
        this.searchParam.upUserId = this.$store.getters.token;
        this.searchParam.upUserNm = this.$store.getters.name;
      }

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      this.searchParam.deptSubYn = 'Y';
      this.getList();
    },
    getElectTitleComboItems() {
      this.$http.url = selectConfig.saf.electTitle.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        useYn: 'Y', // 사용여부
        evalTgtYn: 'Y', // 평가대상여부
      };
      this.$http.request(
        (_result) => {
          this.electTitleItems = this.$_.clone(_result.data);
          this.electTitleItems.splice(0, 0, {
            safElectTitlNo: null,
            electTitlNm:
              this.$comm.getLangSpecInfoLabel('L0000002519') /* 전체 */,
          });
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;  
      if (window.innerHeight < 500) {
        _height = 250;
      }
      
      this.YAuiGrid.resize(null, _height);
    },
    getList() {
      this.$http.url = selectConfig.mgt.electEvalMgmt.rslt.up.list.url;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data))

          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellcLickHandler(event) {
      if (event.dataField === 'stepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'upUserNm') {
        this.openPopup(event.item);
      }
    },
    tableLinkClicked(header, data) {
      if (header.name === 'stepNm') {
        this.showApprProgressPopup(data);
      } else {
        this.openPopup(data);
      }
    },
    openPopup(data) {
      data.evalType = 'up'; // 상위평가결과

      this.popupOptions.target = () => import(`${'./electEvalRsltDetail.vue'}`);
      this.popupOptions.title = 'L0000005221'; // 상위평가결과 상세
      this.popupOptions.param = data;
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
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
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      this.getList();
    },
    btnSearchUserClicked(type) {
      this.userType = type;

      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.searchParam.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; // 사용자검색
      this.popupOptions.visible = true;
      this.popupOptions.width = '60%';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.user) {
        if (this.userType === 'upUser') {
          // 본인평가자 항목일 경우
          this.searchParam.upUserId = data.user.userId;
          this.searchParam.upUserNm = data.user.userNm;
        } else {
          // 대상자 항목일 경우
          this.searchParam.userId = data.user.userId;
          this.searchParam.userNm = data.user.userNm;
        }
      }
    },
    btnClearUser(type) {
      if (type === 'upUser') {
        // 본인평가자 항목일 경우
        this.searchParam.upUserId = '';
        this.searchParam.upUserNm = '';
      } else {
        // 대상자 항목일 경우
        this.searchParam.userId = '';
        this.searchParam.userNm = '';
      }
    },
    /** button 관련 이벤트 **/
    /** end button 관련 이벤트 **/
  },
};
</script>
