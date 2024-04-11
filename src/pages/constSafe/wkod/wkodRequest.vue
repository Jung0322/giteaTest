<!--
  목적 : 공사 및 작업허가 > 일일 작업허가서 > 일일 작업허가서 관리
  Detail : 일일 작업허가서 목록 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <y-plant type="search" v-model="searchParam.plantCd" />
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 작업기간 -->
          <y-datepicker
            :width="8"
            :range="true"
            label="L0000002373"
            name="workYmd"
            :default="searchParam.workYmd"
            v-model="searchParam.workYmd"
          ></y-datepicker>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 진행단계 -->
          <y-select
            v-if="!popupParam.popupMode"
            :width="8"
            :comboItems="comboWkodStepItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002777"
            name="wkodStepCd"
            v-model="searchParam.wkodStepCd"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 신청부서 -->
          <y-tree-dept
            label="L0000001798"
            type="search"
            name="reqDeptCd"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.reqDeptCd"
            :deptSubYn="searchParam.reqDeptSubYn"
            @setDeptSubYn="setReqDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 사용/운전부서 -->
          <y-tree-dept
            label="L0000001442"
            type="search"
            name="pubDeptCd"
            :showAllDept="true"
            :plantCd="searchParam.plantCd"
            v-model="searchParam.pubDeptCd"
            :deptSubYn="searchParam.pubDeptSubYn"
            @setDeptSubYn="setPubDeptSubYn"
          />
          <!-- 
            하위부서 포함 조회 위해 아래 코드 추가
            :deptSubYn="searchParam.deptSubYn"
            @setDeptSubYn="setDeptSubYn"
           -->
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 허가서구분 -->
          <y-select
            :width="8"
            :comboItems="comboWkodTypeItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000003233"
            name="wkodClsCd"
            v-model="searchParam.wkodClsCd"
          ></y-select>
        </b-col>
        <b-col
          v-show="!popupParam.popupMode"
          sm="4"
          md="4"
          lg="4"
          xl="4"
          class="col-xxl-3"
        >
          <!-- 작업구분 -->
          <y-multi-select
            :width="8"
            :comboItems="comboWkodKindItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000002368"
            name="wkodKindCdTemps"
            v-model="searchParam.wkodKindCdTemps"
          ></y-multi-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- PSM여부 -->
          <y-select
            :width="8"
            :comboItems="psmItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000153"
            name="psmYn"
            v-model="searchParam.psmYn"
          ></y-select>
        </b-col>
        <b-col sm="4" md="4" lg="4" xl="4" class="col-xxl-3">
          <!-- 검색어 -->
          <!-- 작업명, 작업회사명, 공사명 -->
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000331"
            placeholder="L0000002390"
            name="keyword"
            v-model="searchParam.keyword"
          ></y-text>
        </b-col>
      </b-row>
    </y-search-box>

    <!-- 검색 결과 테이블 -->
    <b-row class="grid-height grid-box">
      <b-col sm="12" class="h100p">
        <!-- 작업허가서 목록 -->
        <y-auigrid
          ref="yAuiGrid"
          :name="gridOptions.name"
          :headers="gridOptions.header"
          :btns="gridOptions.btns"
          :height="gridOptions.height"
          :label="this.$comm.getLangSpecInfoLabel('L0000004729')"
          :useExcelExport="!this.popupParam.popupMode && this.editable"
          :showGridSetSave="!this.popupParam.popupMode && this.editable"
          :useContextMenu="true"
          :enableRightDownFocus="true"
          :showGridCtrl="true"
          :showRowCheckColumn="true"
          @cellClick="cellClickHandler"
          @cellDoubleClick="cellDoubleClickHandler"
          @btnDetail="openDetailPage(null, 'detail')"
          @btnSelect="btnSelect"
          @getList="getList"
          @closeWkodPopup="closeWkodPopup"
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
  name: 'wkod-request',
  props: {
    popupParam: {
      type: Object,
      default: () => ({
        popupMode: false,
        plantCd: '',
        wkodClsCd: '',
        wkodKindCds: [],
        workYmd: [],
        subconnNm: '',
        prevWkod: false, // 이전 작업허가서 조회여부
      }),
    },
  },
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
      excelDown: false,
      searchParam: {
        workYmd: [], // 작업기간
        reqDeptCd: '', // 신청부서
        wkodKindCdTemps: [],
        wkodKindCds: [], // 작업구분
        pubDeptCd: '', // 사용/운전부서
        wkodStepCd: '', // 진행단계
        wkodNum: '', // 작업NO
        plantCd: '', // 사업장
        wkodClsCd: '', // 허가서구분
        keyword: '',
        psmYn: '',
        subconnNm: '',
        reqDeptSubYn: 'Y',
        pubDeptSubYn: 'Y',
      },
      YAuiGrid: null,
      gridOptions: {
        name: 'constSafeWkodRequest',
        header: [],
        data: [],
        height: '350',
      },
      editable: true,
      comboWkodKindItems: [],
      comboWkodStepItems: [],
      comboWkodTypeItems: [],
      psmItems: [],
      searchUrl: '',
      selectedValue: null,
    };
  },
  watch: {},
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

    this.searchParam.reqDeptSubYn = 'Y';
    this.searchParam.pubDeptSubYn = 'Y';
    if (!this.$_.isEmpty(this.$router.currentRoute.query)) {
      if (
        this.$router.currentRoute.query.wkodNo &&
        this.$router.currentRoute.query.apprStep
      ) {
        this.openDetailPage(this.$router.currentRoute.query, 'apprDetail');
      } else {
        this.$comm.movePage(this.$router, '/404');
        return;
      }
    }

    this.setGridBtn();
    this.getList();
  },
  beforeDestroy() {},
  //* methods */
  methods: {
    init() {
      this.editable = this.$route.meta.editable;
      // Url Setting
      this.searchUrl = selectConfig.saf.wkodMaster.list.url;
      const workDay = this.$comm.getCalculatedDate(
        this.$comm.getToday(),
        '-21d',
        'YYYY-MM-DD',
        'YYYY-MM-DD'
      );
      this.searchParam.workYmd = [workDay, workDay];

      // 그리드 헤더 설정
      this.gridOptions.header = [
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002777'),
          dataField: 'wkodStepNm',
          width: '100',
        }, // 진행단계
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000422'),
          dataField: 'bizApprStepNm',
          width: '100',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 결재단계
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002389'),
          dataField: 'workTitle',
          width: '200',
          style: 'left-align',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        }, // 작업명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '100',
        }, // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000503'),
          dataField: 'constTitle',
          width: '200',
          style: 'left-align',
        }, // 공사명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002411'),
          dataField: 'workYmd',
          width: '100',
        }, // 작업일
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002426'),
          dataField: 'wkodNum',
          width: '120',
        }, // 작업허가번호
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000003233'),
          dataField: 'wkodClsNm',
          width: '110',
        }, // 허가서구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002368'),
          dataField: 'wkodKindNm',
          width: '150',
          style: 'left-align',
        }, // 작업구분
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002420'),
          dataField: 'workArea',
          width: '150',
        }, // 작업장소
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001798'),
          dataField: 'reqDeptNm',
          width: '120',
        }, // 신청부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001442'),
          dataField: 'pubDeptNm',
          width: '120',
        }, // 사용/운전부서
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002404'),
          dataField: 'subconnNm',
          width: '120',
        }, // 작업업체
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000153'),
          dataField: 'psmYnNm',
          width: '80',
        }, // psm여부
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002355'),
          dataField: 'writerUserNm',
          width: '90',
        },
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000002352'),
          dataField: 'writerDt',
          width: '90',
        },
      ];

      this.psmItems = [
        {
          code: '',
          codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'),
        },
        {
          code: 'Y',
          codeNm: 'O',
        },
        {
          code: 'N',
          codeNm: 'X',
        },
      ];

      // 허가서구분
      this.$comm.getComboItems('SAF_WKOD_WKKD', true).then((_result) => {
        this.comboWkodTypeItems = _result;
      });
      this.getComboAttrItems('SAF_WKOD_KIND'); // 작업구분
      // 진행단계
      this.$comm.getComboItems('SAF_WKOD_STEP', true).then((_result) => {
        this.comboWkodStepItems = _result;
      });

      if (this.popupParam.popupMode) {
        // 작업허가서 목록이 팝업으로 띄워지는 경우에는 가지고 온 값을 조회조건에 넣는다.
        if (this.popupParam.plantCd) {
          this.searchParam.plantCd = this.popupParam.plantCd;
        }
        if (this.popupParam.workYmd) {
          this.searchParam.workYmd = this.popupParam.workYmd;
        }
        if (this.popupParam.wkodClsCd) {
          this.searchParam.wkodClsCd = this.popupParam.wkodClsCd;
        }
        if (this.popupParam.wkodKindCds) {
          this.searchParam.wkodKindCdTemps = this.popupParam.wkodKindCds;
        }

        if (this.popupParam.subconnNm) {
          this.searchParam.subconnNm = this.popupParam.subconnNm;
        }

        this.searchParam.wkodStepCd = this.popupParam.prevWkod ? null : 'WKS05';
        this.gridOptions.header.splice(0, 2);
        this.YAuiGrid.changeColumnLayout(this.gridOptions.header);
      }

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }
    },
    setGridBtn() {
      this.gridOptions.btns = [
        // {
        //   title: this.$comm.getLangSpecInfoLabel('L0000005398'),
        //   btnClicked: 'btnCopy',
        //   visible: !this.popupParam.popupMode && this.editable,
        // }, // 복사/등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnDetail',
          visible: !this.popupParam.popupMode && this.editable,
        }, // 신규등록
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001561'),
          color: 'orange',
          btnClicked: 'btnSelect',
          visible:
            !this.popupParam.popupMode &&
            this.editable &&
            this.popupParam.prevWkod,
        }, // 선택
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'getList',
          visible: true,
        }, // 검색
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000881'),
          btnClicked: 'closeWkodPopup',
          visible: this.popupParam.popupMode,
        }, // 닫기
      ];

      this.YAuiGrid.setBtnArr(this.gridOptions.btns);
    },
    getList() {
      this.searchParam.wkodKindCds = this.$_.map(
        this.searchParam.wkodKindCdTemps,
        'code'
      );
      if (
        this.popupParam.popupMode &&
        this.$_.findIndex(this.popupParam.wkodKindCds, { name: '보충작업X' }) >
          -1
      ) {
        this.searchParam.wkodKindCds = [];
        this.searchParam.searchFlag = '99';
      }
      this.$http.url = this.searchUrl;
      this.$http.type = 'GET';
      this.$http.param = this.searchParam;
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    getComboAttrItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelectAttr.url,
        codeGroupCd,
        null,
        null,
        'STANDARD'
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.comboWkodKindItems = this.$_.clone(_result.data);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },
    /**
     * header : 헤더 정보
     * data : 클릭한 col의 row 정보
     */
    cellClickHandler(event) {
      this.selectedValue = event.item;

      if (event.dataField === 'bizApprStepNm') {
        this.showApprProgressPopup(event.item);
      } else if (event.dataField === 'workTitle') {
        this.openDetailPage(event.item, 'detail');
      }
    },
    cellDoubleClickHandler(event) {
      this.selectedValue = event.item;
      this.btnSelect();
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
    openDetailPage(data, gubun) {
      if (gubun === 'detail') {
        if (data === null || data === undefined) {
          this.popupOptions.title = 'L0000002429'; // 작업허가서 등록/수정
          this.popupOptions.param = {
            wkodNo: 0,
            wkodStepCd: 'WKS01',
          };
        } else {
          this.popupOptions.title = 'L0000002431'; // 작업허가서 상세
          this.popupOptions.param = {
            wkodNo: data.wkodNo,
            wkodStepCd: data.wkodStepCd,
            readOnly: this.popupParam.prevWkod,
          };
        }
      } else {
        this.popupOptions.param = data;
      }
      this.popupOptions.top = '10px';
      this.popupOptions.target = () =>
        import(`${'@/pages/constSafe/wkod/wkodNewlDetail.vue'}`);
      this.popupOptions.visible = true;
      this.popupOptions.width = this.popupParam.prevWkod ? '65%' : '90%';
      this.popupOptions.closeCallback = this.closePopup;
    },
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    closeWkodPopup() {
      this.$emit('closePopup');
    },
    btnSelect() {
      this.$emit('closePopup', this.selectedValue);
    },
    // 하위부서 포함 조회 관련 함수 추가
    setReqDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.reqDeptSubYn = _result;
    },
    // 하위부서 포함 조회 관련 함수 추가
    setPubDeptSubYn(_result) {
      // 하위부서 tree에서 값이 변경될 경우 현재값 변경
      this.searchParam.pubDeptSubYn = _result;
    },
    // 데모용 임시버튼
    copyRegi() {
      window.getApp.$emit('ALERT', {
        title: 'L0000003395', // 안내
        message: 'L0000005528', // '추가 작업중',
        type: 'warning', // success / info / warning / error
      });
    },
    /** end button 관련 이벤트 **/
    resizeGrid() {
      let _height = window.innerHeight - 380;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
