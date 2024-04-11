<!--
  목적 : 안전 > 안전순회 > 순회결과 목록
  Detail : 순회결과 목록 화면으로 이미 등록된 계획을 선택하여 결과를 등록하거나 등록창을 띄워 별도 결과만 등록할 수 있음.
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box
      :gridOptions="gridOptions"
      @enter="getList"
      v-if="!popupParam.popupMode"
    >
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" name="plantCd" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 실제점검일 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000001811"
            name="periodRes"
            v-model="searchParam.periodRes"
          ></y-datepicker>
        </b-col>
        <b-col
          v-if="!popupParam.popupMode"
          sm="4"
          md="4"
          lg="4"
          xl="4"
          class="col-xxl-3"
        >
          <!-- 점검종류 상세 -->
          <y-select
            :width="8"
            :comboItems="patrolTypeItems"
            itemText="safCheckKindNm"
            itemValue="safCheckKindNo"
            ui="bootstrap"
            name="patrolType"
            label="L0000003718"
            v-model="searchParam.safCheckKindNo"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 순회결과 -->
          <y-select
            :width="8"
            :comboItems="patrolResultCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="checkResultCd"
            label="L0000001710"
            v-model="searchParam.checkResultCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 순회주관부서 -->
          <y-tree-dept
            label="L0000001721"
            type="search"
            name="deptCd"
            :showAllDept="true"
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
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 순회대상 부서 -->
          <y-tree-dept
            type="search"
            name="tgtDeptCd"
            label="L0000004279"
            :showAllDept="false"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.tgtDeptCd"
            :deptSubYn="searchParam.tgtDeptSubYn"
            @setDeptSubYn="setTgtDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 순회대상 협력업체 -->
          <y-text
            :width="8"
            :readonly="true"
            ui="bootstrap"
            label="L0000004280"
            name="tgtVendorNm"
            v-model="searchParam.tgtVendorNm"
            :appendIcon="[{ icon: 'search', callbackName: 'searchVendor' }]"
            @searchVendor="searchVendor"
          ></y-text>
        </b-col>
        <b-col
          v-if="!popupParam.popupMode"
          sm="4"
          md="4"
          lg="4"
          xl="4"
          class="col-xxl-3"
        >
          <!-- 순회수행부서 -->
          <y-tree-dept
            type="search"
            name="pgpDeptCd"
            label="순회수행부서"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.pgpDeptCd"
            :deptSubYn="searchParam.pgpDeptSubYn"
            @setDeptSubYn="setPgpDeptSubYn"
          />
        </b-col>
        <!-- 진행단계 -->
        <!-- <y-select
            :width="8"
            :comboItems="patrolStepItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002777"
            name="checkStepCd"
            v-model="searchParam.checkStepCd"
          ></y-select>
        </b-col> -->
        <b-col
          v-if="popupParam.popupMode"
          sm="4"
          md="4"
          lg="4"
          xl="4"
          class="col-xxl-3"
        >
          <!-- 순회결과 -->
          <y-select
            :width="8"
            :comboItems="patrolResultCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            name="checkResultCd"
            label="L0000001710"
            v-model="searchParam.checkResultCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 세부점검계획 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001642"
            name="checkTitle"
            v-model="searchParam.checkTitle"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- <div slot="buttonGroup" class="float-right mb-1">
            <y-btn
              v-if="!popupParam.popupMode && editable"
              title="L0000001034"
              color="orange"
              @btnClicked="tableLinkCheckTitleClicked(null, null)"
            />
            <y-btn
              v-if="!popupParam.popupMode"
              title="L0000000327"
              color="green"
              @btnClicked="getList"
            />
             검색 
            <y-btn
              v-if="popupParam.popupMode"
              title="L0000000881"
              @btnClicked="closeTotalPopup"
            />
             닫기 
          </div> -->
          <!-- 순회점검결과현황 목록 -->
          <!-- <y-data-table
            ref="dataTable"
            :height="gridOptions.height"
            :headers="gridOptions.header"
            :items="gridOptions.data"
            :editable="editable"
            :use-paging="true"
            label="순회점검결과현황 목록"
            @tableLinkClicked="tableLinkCheckTitleClicked"
          ></y-data-table> -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            label="순회점검결과현황 목록"
            :useExcelExport="false"
            :enableSorting="true"
            :showGridSetSave="true"
            @cellClick="cellClickHandler"
            @openNewPage="openNewPage"
            @getList="getList"
            @closeTotalPopup="closeTotalPopup"
          />
        </b-col>
      </b-col>
    </b-row>
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
export default {
  /* attributes: name, components, props, data */
  name: 'y-patrol-result',
  props: {
    popupParam: {
      type: Object,
      default: function () {
        return {
          popupMode: false,
          plantCd: '',
          year: '',
          month: '',
          deptCd: '',
          tgtDeptCd: '',
          tgtVendorCd: '',
          tgtVendorNm: '',
          checkResultCd: '',
          checkStepCd: '',
          tgtClsCd: '',
        };
      },
    },
  },
  data: () => ({
    searchParam: {
      periodRes: [],
      plantCd: '',
      safCheckKindNo: null,
      checkStepCd: 'CHS02',
      tgtDeptCd: '',
      tgtVendorCd: '',
      tgtVendorNm: '',
      deptCd: '',
      checkResultCd: '',
      tgtClsCd: '',
      deptSubYn: 'Y', // 하위부서여부 사용
      tgtDeptSubYn: 'Y', // 하위부서여부 사용
      pgpDeptSubYn: 'Y',
    },
    gridOptions: {
      name: 'patrolResult',
      header: [],
      data: [],
      height: 'auto',
    },
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
    patrolResultCdItems: [],
    patrolTypeItems: [], // 순회종류
    patrolStepItems: [], // 진행단계
    targetItems: [], // 순회대상
    // apprStepCdItems: [],
    searchUrl: '',
    isInit: true,
    YAuiGrid: null,
  }),
  watch: {
    'searchParam.plantCd'() {
      this.getPatrolKindList();
    },
    'searchParam.tgtVendorNm'() {
      if (
        this.searchParam.tgtVendorNm === '' ||
        this.searchParam.tgtVendorNm === null
      ) {
        this.searchParam.tgtVendorCd = '';
      }
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
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.patrol.list.url;

      if (this.popupParam.popupMode) {
        this.searchParam.deptSubYn = 'N';
        this.searchParam.tgtDeptSubYn = 'N';
      }
      // this.searchParam.deptSubYn = 'Y';
      // this.searchParam.tgtDeptSubYn = 'Y';
      // this.searchParam.pgpDeptSubYn = 'Y';

      if (this.popupParam.popupMode) {
        this.searchParam.checkStepCd = this.popupParam.checkStepCd;
      }

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'), // 사업장
          dataField: 'plantNm',
          width: '130',
          style: 'center-align',
        },
        // {
        //   text: 'L0000002777', // 진행단계
        //   name: 'checkStepNm',
        //   width: '100px',
        //   style: 'center-align',
        // },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001642'), // 세부점검계획
          dataField: 'checkTitle',
          width: '200',
          align: 'left',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003718'), // 점검종류 상세
          dataField: 'safCheckKindNm',
          width: '150',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001717'), // 순회일
          dataField: 'checkYmd',
          width: '120',
          style: 'center-align',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001721'), // 순회주관부서
          dataField: 'deptNm',
          width: '120',
          style: 'center-align',
        },
        {
          headerText: '순회대상부서',
          dataField: 'tgt',
          width: '110',
          align: 'center',
        }, // 순회대상

        {
          headerText: '순회수행부서', // 순회수행부서
          dataField: 'pgpDeptNm',
          width: '150',
          style: 'center-align',
        },
        {
          headerText: '순회결과', // 순회결과
          dataField: 'checkResultNm',
          width: '150',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002355') /* 작성자 */,
          dataField: 'writerUserNm',
          width: '120',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002352') /* 작성일 */,
          dataField: 'writerDt',
          width: '120',
          style: 'center-align',
        },
      ];

      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001034'),
          color: 'orange',
          btnClicked: 'openNewPage',
          visible: !this.popupParam.popupMode && this.editable,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
          visible: !this.popupParam.popupMode,
        }, //  검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closeTotalPopup',
          visible: this.popupParam.popupMode,
        }, //  닫기 
      ];

      // 기간 Setting
      if (!this.popupParam.popupMode) {
        let today = this.$comm.getToday();
        let from = this.$comm.getCalculatedDate(
          today,
          '-2m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        let to = this.$comm.getCalculatedDate(
          today,
          '1m',
          'YYYY-MM-DD',
          'YYYY-MM-DD'
        );
        this.searchParam.periodRes = [from, to];
      } else {
        let startDateRes = '';
        let endDateRes = '';
        if (this.popupParam.month) {
          startDateRes = this.$comm.moment([
            this.popupParam.year,
            this.$_.parseInt(this.popupParam.month) - 1,
          ]);
          endDateRes = this.$comm.moment(startDateRes).endOf('month');
        } else {
          startDateRes = this.$comm.moment([this.popupParam.year, 0]);
          endDateRes = this.$comm.moment([this.popupParam.year, 11]);
          endDateRes = this.$comm.moment(endDateRes).endOf('month');
        }
        this.searchParam.periodRes = [
          startDateRes.format('YYYY-MM-DD'),
          endDateRes.format('YYYY-MM-DD'),
        ];
        this.searchParam.plantCd = this.popupParam.plantCd;
        if (this.popupParam.deptCd) {
          this.searchParam.deptCd = this.popupParam.deptCd;
        }
        if (this.popupParam.tgtDeptCd) {
          this.searchParam.tgtDeptCd = this.popupParam.tgtDeptCd;
        }
        if (this.popupParam.tgtVendorCd) {
          this.searchParam.tgtVendorCd = this.popupParam.tgtVendorCd;
        }
        if (
          this.popupParam.tgtVendorNm &&
          this.popupParam.tgtVendorNm !== 'L0000004287' // 순회대상합계
        ) {
          this.searchParam.tgtVendorNm = this.popupParam.tgtVendorNm;
        }
        if (this.popupParam.checkResultCd) {
          this.searchParam.checkResultCd = this.popupParam.checkResultCd;
        }
        if (this.popupParam.tgtClsCd) {
          this.searchParam.tgtClsCd = this.popupParam.tgtClsCd;
        }
        // this.gridOptions.header.splice(0, 1);
        // this.gridOptions.header.splice(6, 0, {
        //   text: 'L0000001710', // 순회결과
        //   dataField: 'checkResultNm',
        //   width: '120px',
        //   style: 'center-align',
        // });
      }
      this.getPatrolKindList();
      this.$comm.getComboItems('SAF_CHECK_STEP', true).then((_result) => {
        _result.splice(1, 1);
        _result.splice(0, 1);
        _result.splice(0, 0, {
          code: 'CHS100',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
        });
        this.patrolStepItems = _result;
      });
      this.$comm.getComboItems('SAF_ACTPART_CLS', true).then((_result) => {
        this.targetItems = _result;
      });
      this.$comm.getComboItems('SAF_PATROL_RSLT_CLS', true).then((_result) => {
        this.patrolResultCdItems = _result;
      });

      this.getList(); // 목록 조회
    },
    getPatrolKindList() {
      this.$http.url = selectConfig.saf.checkKind.list.url;
      this.$http.type = 'GET';
      this.$http.param = {
        patrolYn: 'Y',
        chngKind: 'CKC04',
        plantCd: this.searchParam.plantCd,
      };
      this.$http.request(
        (_result) => {
          _result.data.splice(0, 0, {
            safCheckKindNo: null,
            safCheckKindNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
          });
          this.patrolTypeItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /** 순회결과 목록 조회 **/
    getList() {
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          // this.gridOptions.data = this.$_.clone(_result.data);
          this.YAuiGrid.setGridData(this.$_.clone(_result.data));
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * 순회결과 목록에 점검명 col 클릭시 마다 발생
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    tableLinkCheckTitleClicked(header, data) {
      this.popupOptions.target = () => import(`${'./patrolResultDetail.vue'}`);
      this.popupOptions.title = 'L0000001710'; // 순회결과
      this.popupOptions.param = {
        safCheckRsltNo: data ? data.safCheckRsltNo : 0, // 순회결과번호
        detailCheck: this.popupParam.popupMode ? true : false,
      };
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    cellClickHandler(event) {
      if (event.dataField !== 'checkTitle') return;

      this.openNewPage(event.item, false);
    },
    openNewPage(event) {
      this.popupOptions.target = () => import(`${'./patrolResultDetail.vue'}`);
      this.popupOptions.title = 'L0000001710'; // 순회결과
      this.popupOptions.param = {
        safCheckRsltNo: event ? event.safCheckRsltNo : 0, // 순회결과번호
        detailCheck: this.popupParam.popupMode ? true : false,
      };
      this.popupOptions.width = '90%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closePopup;
    },
    /**
     *  팝업 안 보이도록 설정 후 getReserveData 호출
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closePopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    /** button 관련 이벤트 **/
    /**
     *  팝업 안 보이도록 closePopup emit
     *  팝업 close
     * data : 팝업창에서 return하는 데이터
     */
    closeTotalPopup(data) {
      this.$emit('closePopup', {});
    },
    /** end button 관련 이벤트 **/
    searchVendor() {
      this.popupOptions.target = () =>
        import(`${'@/pages/vendor/baseInfo/vendorMaster.vue'}`);
      this.popupOptions.title = 'L0000003246'; // 협력업체
      this.popupOptions.param = {
        popupMode: true,
        plantCd: this.searchParam.plantCd,
      };
      this.popupOptions.width = '80%';
      this.popupOptions.visible = true;
      this.popupOptions.closeCallback = this.closeVendorPopup;
    },
    closeVendorPopup(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;

      if (data.data !== 'C') {
        this.searchParam.tgtVendorCd = data.data.vendorCd;
        this.searchParam.tgtVendorNm = data.data.vendorNm;
      }
    },
    // 하위부서 포함 조회 관련 함수 추가
    setDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.deptSubYn = _result;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setTgtDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.tgtDeptSubYn = _result;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setPgpDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.pgpDeptSubYn = _result;
    },
    resizeGrid() {
      const _height = window.innerHeight < 500 ? 250 : window.innerHeight - 335;
      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
