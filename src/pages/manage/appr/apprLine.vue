<!--
  목적 : 시스템 > 결재 > 결재선
  작성자 : ksw
  Detail : 결재선 조회 화면
  *
  examples:
  *
  -->
<template>
  <b-container fluid>
    <y-search-box :gridOptions="gridOptions" @enter="getList">
      <b-row slot="search">
        <!-- 결재문서유형코드 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000000425"
            name="apprBizCd"
            v-model="searchParam.apprBizCd"
          />
        </b-col>
        <!-- 업무명 -->
        <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-text
            :width="8"
            ui="bootstrap"
            label="L0000001948"
            name="bizNm"
            v-model="searchParam.bizNm"
          />
        </b-col>
        <!-- 결재선적용방식 -->
        <!-- <b-col sm="6" md="6" lg="6" xl="6" class="col-xxl-3">
          <y-select
            :width="8"
            :comboItems="searchApprBizTypeCdItems"
            itemText="codeNm"
            itemValue="code"
            ui="bootstrap"
            label="L0000000434"
            name="apprBizTypeCd"
            v-model="searchParam.apprBizTypeCd"
          />
        </b-col> -->
      </b-row>
    </y-search-box>
    <!-- 검색 결과 테이블 s -->
    <b-row class="mt-3">
      <b-col sm="12">
        <b-col sm="12" class="px-0">
          <!-- 결재 마스터 목록 -->
          <y-auigrid
            ref="yAuiGrid"
            :name="gridOptions.name"
            :headers="gridOptions.header"
            :btns="gridOptions.btns"
            :height="gridOptions.height"
            :label="this.$comm.getLangSpecInfoLabel('L0000000416')"
            :useExcelExport="false"
            :enableSorting="true"
            :showGridSetSave="true"
            @cellClick="cellClickHandler"
            @btnPopupClickedCallback="btnPopupClickedCallback"
            @btnSearchClickedCallback="btnSearchClickedCallback"
          />
        </b-col>
      </b-col>
    </b-row>

    <!-- 결재선 상세 e -->
    <y-dialog :param="popupOptions"></y-dialog>
  </b-container>
</template>

<script>
import selectConfig from '@/js/selectConfig';
import transactionConfig from '@/js/transactionConfig';

export default {
  /* attributes: name, components, props, data */
  name: 'appr-line',
  props: {},
  data() {
    return {
      searchArea: {
        title: 'L0000000329', // 검색박스 숨기기
        show: true,
      },
      searchParam: {},
      gridOptions: {
        name: 'apprLine',
        header: [],
        data: [],
        btns: [],
        height: '600',
      },
      gridOptions2: {
        header: [],
        data: [],
        btns: [],
        height: '200',
        minHeight: '100',
      },
      gridOptions3: {
        header: [],
        data: [],
        btns: [],
        height: '200',
        minHeight: '100',
      },
      gridOptions4: {
        header: [],
        data: [],
        btns: [],
        height: '100',
        minHeight: '100',
      },
      popupOptions: {
        target: null,
        title: '',
        visible: false,
        width: '500px',
        top: '50px',
        param: {},
        closeCallback: null,
      },
      selectValue: '',
      appr: {
        apprBizNo: 0, // 결재문서 마스터 번호
        apprBizCd: '', // 결재문서 유형
        bizNm: '', // 업무명
        apprBizTypeCd: null, // 결재선적용방식
        apprUrl: '', // 결재URL
        apprParameter: '', // 결재 파라미터
        apprMailContents: '', // 결재메일내용
        useYn: 'Y', // 사용여부
        sortOrder: 0, // 정렬순서
        apprBizLineList: [], // 결재문서결재선 목록
        apprBizLineDtlList: [], // 결재문서결재선 세부정보 목록
      },
      apprBizLine: {
        plantCd: null, // 사업장
        apprLineNm: '', // 결재선명
        apprLineDesc: '', // 설명
        apprLineTypeCd: '', // 결재선유형코드
      },
      apprBizLineDtl: {
        plantCd: null, // 사업장
        plantConfirmDeptCd: '', // 사업장 확인부서 코드
        plantConfWorkerId: '', // 사업장 확인부서 실무자ID
        plantConfWorkerNm: '', // 사업장 확인부서 실무자
        plantConfChargerId: '', // 사업장 확인부서 담당자ID
        plantConfChargerNm: '', // 사업장 확인부서 담당자
        hqConfirmDeptCd: '', // 본사 확인부서 코드
        hqConfWorkerId: '', // 본사 확인부서 실무자ID
        hqConfWorkerNm: '', // 본사 확인부서 실무자
        hqConfChargerId: '', // 본사 확인부서 담당자ID
        hqConfChargerNm: '', // 본사 확인부서 담당자
      },
      editable: false,
      apprBizTypeCdItems: [], // 결재선적용방식코드 목록
      searchApprBizTypeCdItems: [], // 결재선적용방식코드 목록(검색)
      plantItems: [], // 사업장 목록
      plantConfFlag: false, // 사업장 확인부서 입력 flag
      hqContFlag: false, // 본사 확인부서 입력 flag
      insertUrl: '', // 등록 url
      editUrl: '', // 수정 url
      listUrl: '', // 결재문서 마스터 목록 조회 url
      getUrl: '', // 결재선 상세 조회 url
      countUrl: '', // 결재문서 유형코드 유효성 조회 url
      isInsert: false,
      isEdit: false,
      popupCallRow: null,
      selectValue1: [],
      selectValue2: [],
      YAuiGrid: null,
    };
  },
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
      this.insertUrl = transactionConfig.manage.apprLine.insert.url;
      this.editUrl = transactionConfig.manage.apprLine.edit.url;
      this.listUrl = selectConfig.manage.apprLine.list.url;
      this.getUrl = selectConfig.manage.apprLine.get.url;
      this.countUrl = selectConfig.manage.apprLine.count.url;

      this.getComboItems('COM_PLANT_SAME'); // 결재선적용방식코드 목록 조회
      this.getComboItems('COM_PLANT_CD'); // 사업장 목록 조회

      // 결재 마스터 목록 그리드
      this.gridOptions.header = [
        // 결재문서유형
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004205'),
          dataField: 'apprBizCd',
          width: '20%',
          style: 'center-align',
        },
        // 업무명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001948'),
          dataField: 'bizNm',
          width: '20%',
          renderer: {
            type: 'LinkRenderer',
            baseUrl: 'javascript',
            jsCallback: function (rowIndex, columnIndex, value, item) {},
          },
        },
        // 결재선적용방식
        // {
        //   text: 'L0000000434',
        //   name: 'apprBizTypeNm',
        //   width: '130px',
        //   align: 'center',
        // },
        // 결재URL
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000421'),
          dataField: 'apprUrl',
          width: '30%',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002355') /* 작성자 */,
          dataField: 'writerUserNm',
          width: '15%',
          style: 'center-align',
        },
        {
          headerText:
            this.$comm.getLangSpecInfoLabel('L0000002352') /* 작성일 */,
          dataField: 'writerDt',
          width: '15%',
          style: 'center-align',
        },
      ];
      this.gridOptions.btns = [
        {
          title: this.$comm.getLangSpecInfoLabel('L0000001789'),
          color: 'orange',
          btnClicked: 'btnPopupClickedCallback',
        },
        {
          title: this.$comm.getLangSpecInfoLabel('L0000000327'),
          color: 'green',
          btnClicked: 'btnSearchClickedCallback',
        },
      ];

      // 결재선 목록
      this.gridOptions2.header = [
        // 사업장
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000001415'),
          dataField: 'plantNm',
          width: '130',
          style: 'center-align',
        },
        // 결재선명
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000000433'),
          dataField: 'apprLineNm',
          width: '200',
        },
        // 결재선유형코드
        {
          headerText: this.$comm.getLangSpecInfoLabel('L0000004206'),
          dataField: 'apprLineTypeCd',
          width: '130',
          style: 'center-align',
        },
      ];

      /* 쿠키에 저장된 검색 조건이 있을 경우 최초 페이지 진입시 자동 설정 */
      var searchParamByCookie = this.$comm.setSearchParamByCookie();
      if (typeof searchParamByCookie !== 'undefined') {
        this.searchParam = searchParamByCookie;
      }

      // 결재 마스터 목록 조회
      this.getList();
    },
    // 공통 코드 조회
    getComboItems(codeGroupCd) {
      this.$http.url = this.$format(
        selectConfig.codeMaster.getSelect.url,
        codeGroupCd
      );
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          if (codeGroupCd === 'COM_PLANT_SAME') {
            this.apprBizTypeCdItems = this.$_.clone(_result.data);
            this.apprBizTypeCdItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000001561'), // 선택
            });
            this.searchApprBizTypeCdItems = this.$_.clone(_result.data);
            this.searchApprBizTypeCdItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000002519'), // 전체
            });
          } else if (codeGroupCd === 'COM_PLANT_CD') {
            this.plantItems = this.$_.clone(_result.data);
            this.plantItems.splice(0, 0, {
              code: null,
              codeNm: this.$comm.getLangSpecInfoLabel('L0000001561'),
            }); // 선택
          }
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    btnSearchClickedCallback(result) {
      this.getList();
    },

    // 마스터 목록 조회
    getList() {
      this.$http.url = this.listUrl;
      this.$http.param = this.searchParam;
      this.$http.type = 'GET';
      this.$http.request(
        (_result) => {
          this.YAuiGrid.setGridData(_result.data);
          // this.gridOptions.data = _result.data;
          this.$comm.pushCookie(this.searchParam);
        },
        (_error) => {
          window.getApp.$emit('APP_REQUEST_ERROR', _error);
        }
      );
    },

    // 팝업닫기
    closePopup() {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
    },

    alertMessage(title, message, type) {
      window.getApp.$emit('ALERT', {
        title: title,
        message: message,
        type: type, // success / info / warning / error
      });
    },
    setPlantDeptNm(deptNm) {
      this.apprBizLineDtl.plantConfirmDeptNm = deptNm;
    },
    setHqDeptNm(deptNm) {
      this.apprBizLineDtl.hqConfirmDeptNm = deptNm;
    },
    /**
     * 수정 팝업 호출
     */
    cellClickHandler(event) {
      if (event.item === null || event.item === undefined) return;
      if (event.dataField === 'bizNm') {
        this.popupOptions.top = '10px';
        this.popupOptions.width = '80%';
        this.popupOptions.target = () => import(`${'./apprLineDetail.vue'}`);
        this.popupOptions.title = 'L0000004207'; // 결재 마스터 상세
        this.popupOptions.visible = true;
        this.popupOptions.param = event.item;
        this.popupOptions.closeCallback = this.closePopupUsage;
      }
    },
    /**
     * 등록 팝업  호출
     */
    btnPopupClickedCallback() {
      this.popupOptions.top = '10px';
      this.popupOptions.width = '80%';
      this.popupOptions.target = () => import(`${'./apprLineDetail.vue'}`);
      this.popupOptions.title = 'L0000004207'; // 결재 마스터 상세
      this.popupOptions.visible = true;
      this.popupOptions.param = {
        apprBizNo: 0,
      };
      this.popupOptions.closeCallback = this.closePopupUsage;
    },
    closePopupUsage(data) {
      this.popupOptions.target = null;
      this.popupOptions.visible = false;
      this.getList();
    },
    resizeGrid() {
      let _height = window.innerHeight - 335;
      if (window.innerHeight < 500) {
        _height = 250;
      }

      this.YAuiGrid.resize(null, _height);
    },
  },
};
</script>
