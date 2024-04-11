<!--
  목적 : 입법예고법규 조회
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
          <!-- 공고일자 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000000487"
            name="period"
            v-model="searchParam.period"
          ></y-datepicker>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 입법예고명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000002291"
            name="isNm"
            v-model="searchParam.isNm"
          ></y-text>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 작성자 -->
          <y-text
            :width="8"
            :disabled="true"
            ui="bootstrap"
            label="L0000002355"
            name="createUserNm"
            v-model="searchParam.createUserNm"
            :appendIcon="[{ 'icon': 'times', callbackName: 'clear' }, { icon: 'search', callbackName: 'searchUser' }]"
            @searchUser="btnSearchUserClicked"
            @clear="clear"
          />
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 진행상태 -->
          <y-select
            :width="8"
            :comboItems="checkStepItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="useYn"
            label="L0000002779"
            v-model="searchParam.checkStepCd"
          ></y-select>
        </b-col>
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <!-- 검토팀 -->
          <y-tree-dept
            type="search"
            label="L0000000388"
            name="deptCd"
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
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <!-- <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <div slot="buttonGroup" class="float-right mb-1">
            검색 
            <y-btn title="L0000000327" color="green" @btnClicked="getDataList" />
          </div>
           입법예고법규 검토 목록 -
          <y-data-table
            label="L0000002292"
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :use-paging="true"
            @tableLinkClicked="tableLinkClicked"
          >
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
          :label="this.$comm.getLangSpecInfoLabel('L0000002292')"
          :useExcelExport="false"
          :enableSorting="true"
          :showGridSetSave="true"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :enableCellMerge="true"
          :cellMergeRowSpan="true"
          @cellClick="cellClickHandler"
          @getDataList="getDataList"
        />
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /** attributes: name, components, props, data **/
  name: 'lawmaking-check',
  props: {},
  data() {
    return {
      searchParam: {
        period: [],
        isNm: '',
        createUserId: '',
        createUserNm: '',
        checkStepCd: '',
        deptCd: '',
        deptSubYn: 'Y', // 하위부서여부 사용
      },
      gridOptions: {
        name: 'lawmakingCheck',
        header: [],
        btns: [],
        data: [],
        height: '550',
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
      checkStepItems: [],
      editable: false,
      searchUrl: '',
    };
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
  },
  beforeDestroy() {
  },
  /** methods **/
  methods: {
    /** 초기화 관련 함수 **/
    init() {
      this.editable = this.$route.meta.editable;

      this.searchParam.deptSubYn = 'Y';

      // 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002779'), 
          dataField: 'checkStepNm', 
          width: '10%', 
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000452'), 
          dataField: 'bizApprStepNm', 
          width: '10%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000384'), 
          dataField: 'checkRqstTitle', 
          width: '10%', 
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000388'), 
          dataField: 'checkDeptNms', 
          width: '10%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002291'), 
          dataField: 'isNm', 
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
          headerText: this.$comm.getLangSpecInfoLabel('L0000001208'), 
          dataField: 'temp', 
          width: '15%',         
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {              
            },
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001209'), 
          dataField: 'isClsNm', 
          width: '15%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000486'), 
          dataField: 'pntcNo', 
          width: '15%',         
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001779'), 
          dataField: 'stYd', 
          width: '15%',         
        },        
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002706'), 
          dataField: 'edYd', 
          width: '15%',         
        },        
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000976'), 
          dataField: 'createUserNm', 
          width: '15%',         
        },        
      ];
      
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getDataList',      
        },
      ]
      // 공고일자 초기값 설정
      // this.searchParam.period = ['2020-01-01', this.$comm.getToday()];
      this.searchParam.period = [this.$comm.getFirstDayThisYear(), this.$comm.getToday()];
      this.$comm.getComboItems('MGT_LAW_MAKING_STEP', true).then(_result => {
        this.checkStepItems = _result;
      });

      // URL 설정
      this.searchUrl = selectConfig.lawMakingCheck.list.url;

      // this.setGridSize();
      this.getDataList(); // 입법예고 목록
    },
    /** /초기화 관련 함수 **/
    getDataList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        _result => {
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        _error => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    cellClickHandler(event) {
      if (!event.item) return;
      if (event.dataField === 'temp') {
        let link = document.createElement('a');
        link.href = event.item.fileDownLink.includes('https:') ? event.item.fileDownLink.replace('https:', '') : event.item.fileDownLink.replace('http:', '');
        link.download = event.item.fileName;
        link.click();
      } else if (event.dataField === 'isNm') {
        /**
          * 2022.02.18 LHJ
          * 헤더에 도메인 정보를 같이 전달하는 경우 정부입법지원센터의 OPEN API를 통해 URL 호출하였을 경우 도메인 필터링을 통해 접근차단을 당함
          * 헤더에서 도메인 정보를 같이 전달하지 않도록 빈 팝업 생성 후 a link 생성하여 target을 빈 팝업으로 지정 후 referrer 설정을 no-referrer 지정하여 link 이동
         */
        let popup = window.open('', this.$comm.getLangSpecInfoLabel('L0000002291'), 'width=1200, height=700'); /* 입법예고명 */

        // head 태그에 meta 태그를 추가하여 referrer 전달에 대한 설정을 no-referrer로 지정하는 script
        // let metaTag = document.createElement('meta');
        // metaTag.name = 'referrer';
        // metaTag.content = 'no-referrer';
        // popup.document.getElementsByTagName('head')[0].appendChild(metaTag);

        let link = document.createElement('a');
        link.href = event.item.detailUrl;
        link.target = this.$comm.getLangSpecInfoLabel('L0000002291');   /* 입법예고명 */
        link.referrerPolicy = 'no-referrer';
        link.click();

        // window.open(data.detailUrl, '입법예고명', 'width=1200, height=700');
        // window.open('https://she2019.yullin.com', '입법예고명', 'width=1200, height=700');
      } else if (event.dataField === 'checkRqstTitle') {
        this.linkClicked(event.item);
      } else if (event.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(event.item);
      }
    },
    tableLinkClicked(header, data) {
      if (!data) return;
      if (header.name === 'temp') {
        let link = document.createElement('a');
        link.href = data.fileDownLink.includes('https:') ? data.fileDownLink.replace('https:', '') : data.fileDownLink.replace('http:', '');
        link.download = data.fileName;
        link.click();
      } else if (header.name === 'isNm') {
        /**
          * 2022.02.18 LHJ
          * 헤더에 도메인 정보를 같이 전달하는 경우 정부입법지원센터의 OPEN API를 통해 URL 호출하였을 경우 도메인 필터링을 통해 접근차단을 당함
          * 헤더에서 도메인 정보를 같이 전달하지 않도록 빈 팝업 생성 후 a link 생성하여 target을 빈 팝업으로 지정 후 referrer 설정을 no-referrer 지정하여 link 이동
         */
        let popup = window.open('', this.$comm.getLangSpecInfoLabel('L0000002291'), 'width=1200, height=700'); /* 입법예고명 */

        // head 태그에 meta 태그를 추가하여 referrer 전달에 대한 설정을 no-referrer로 지정하는 script
        // let metaTag = document.createElement('meta');
        // metaTag.name = 'referrer';
        // metaTag.content = 'no-referrer';
        // popup.document.getElementsByTagName('head')[0].appendChild(metaTag);

        let link = document.createElement('a');
        link.href = data.detailUrl;
        link.target = this.$comm.getLangSpecInfoLabel('L0000002291');   /* 입법예고명 */
        link.referrerPolicy = 'no-referrer';
        link.click();

        // window.open(data.detailUrl, '입법예고명', 'width=1200, height=700');
        // window.open('https://she2019.yullin.com', '입법예고명', 'width=1200, height=700');
      } else if (header.name === 'checkRqstTitle') {
        this.linkClicked(data);
      } else if (header.name === 'bizApprStepNm') {
        this.showApprProgressPopup(data);
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
    linkClicked(row, index) {
      let step = '';
      if (row.checkStepCd === 'LMCS4' || row.checkStepCd === 'LMCS3') {
        // 검토완료, 의견작성중
        step = 'OPINION';
      } else if (row.checkStepCd === 'LMCS2') {
        // 검토자지정
        step = 'DESIGNATION';
      } else if (row.checkStepCd === 'LMCS1') {
        // 작성중
        step = 'REVIEW';
      } else {
        // 검토요청 전
        step = 'REVIEW';
      }
      this.popupOptions.target = () =>
        import(`${'./lawmakingCheckDetail.vue'}`);
      this.popupOptions.title = 'L0000004243';  /* 검토요청내용 작성 */
      this.popupOptions.param = {
        lmcSeqNo: row.lmcSeqNo, // 순번
        seqNo: row.seqNo, // 순번
        step: step,
      };
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getDataList();
    },
    // 사용자 검색
    btnSearchUserClicked(_item) {
      this.popupOptions.target = () =>
        import(`${'@/pages/manage/user/userSearch.vue'}`);
      this.popupOptions.param = {
        plantCd: this.$store.getters.plantCd,
      };
      this.popupOptions.title = 'L0000001466'; /* 사용자검색 */
      this.popupOptions.visible = true; 
      this.popupOptions.width = '70%';
      this.popupOptions.top = '10px';
      this.popupOptions.closeCallback = this.closePopupSearchUser;
    },
    // 사용자 검색 팝업 닫기
    closePopupSearchUser(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      if (data.user) {
        this.searchParam.createUserId = data.user.userId;
        this.searchParam.createUserNm = data.user.userNm;
      }
    },
    clear() {
      this.searchParam.createUserId = null;
      this.searchParam.createUserNm = null;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
  },
};
</script>
